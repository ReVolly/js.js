#!/usr/bin/python

"""This script builds js.js"""

import os
import sys
import argparse
import urllib
import zipfile
import shutil
import filecmp
import tempfile
import tarfile

import conf
import jsjs.util as util
import jsjs.compile_filters as compile_filters
from jsjs.filtering import filter_file
import jsjs.emscripten as emscripten

CURDIR = os.path.abspath(os.path.dirname(__file__))
BUILD_DIR_ABS = util.abspath_join(CURDIR, conf.BUILD_DIR)
NEEDED_COMMANDS = [("hg", "Mercurial"),
                   ("git", "Git"),
                   ("svn", "Subversion"),
                   ("make", "Make"),
                   ("autoreconf2.13", "autoreconf 2.13"),
                   ("scons", "SCons")]

def ensure_needed_commands():
    for command, name in NEEDED_COMMANDS:
        if util.which(command) is None:
            sys.stderr.write(("Could not find command: '%s'\n" + 
                             "Install %s and be sure that '%s' is on the path.\n")
                             % (command, name, command))
            sys.exit(1)

def get_llvm_dir():
    return util.abspath_join(BUILD_DIR_ABS, conf.LLVM_DIR)
def get_llvm_bindir():
    return util.abspath_join(get_llvm_dir(), "Debug/bin")
def get_clang_path():
    return util.abspath_join(get_llvm_dir(), "Debug/bin/clang")
def get_clangpp_path():
    return util.abspath_join(get_llvm_dir(), "Debug/bin/clang++")
def get_llvm_link_path():
    return util.abspath_join(get_llvm_dir(), "Debug/bin/llvm-link")
def get_llvm_dis_path():
    return util.abspath_join(get_llvm_dir(), "Debug/bin/llvm-dis")
def get_v8_path():
    return util.abspath_join(BUILD_DIR_ABS, conf.V8_DIR, "d8")
def get_spidermonkey_path():
    return util.abspath_join(BUILD_DIR_ABS, conf.SPIDERMONKEY_DIR, "js/src/shell/js")
def get_closure_compiler_path():
    return util.abspath_join(BUILD_DIR_ABS, conf.CLOSURE_COMPILER_DIR, "compiler.jar")
def get_emscripten_dir():
    return util.abspath_join(CURDIR, "../external/emscripten")
def get_emconfigure_path():
    return util.abspath_join(get_emscripten_dir(), "emconfigure")
def get_emcc_path():
    return util.abspath_join(get_emscripten_dir(), "emcc")
def get_nodejs_dir():
    return util.abspath_join(BUILD_DIR_ABS, conf.NODEJS_DIR, "node-v0.6.7")
def get_nodejs_path():
    return util.abspath_join(get_nodejs_dir(), "node")

def deps(**kwargs):
    print("[START] - deps")
    
    print("Checking for needed commands: " + ", ".join(c[0] for c in NEEDED_COMMANDS))
    ensure_needed_commands()
    
    print("Creating build directory: '%s'" % BUILD_DIR_ABS)
    util.mkdir(BUILD_DIR_ABS)
    
    llvmdir = get_llvm_dir()
    print("Checking for LLVM: '%s'" % llvmdir)
    if not os.path.isdir(util.abspath_join(llvmdir, "lib")):
        util.svn_co(conf.LLVM_URL, llvmdir)
    
    clangdir = util.abspath_join(llvmdir, "tools/clang")
    print("Checking for Clang: '%s'" % clangdir)
    if not os.path.isdir(util.abspath_join(clangdir, "lib")):
        util.svn_co(conf.CLANG_URL, clangdir)
    
    compilerrtdir = util.abspath_join(llvmdir, "projects/compiler-rt")
    print("Checking for Compiler RT: '%s'" % compilerrtdir)
    if not os.path.isdir(util.abspath_join(compilerrtdir, "lib")):
        util.svn_co(conf.COMPILER_RT_URL, compilerrtdir)
    
    if not os.path.exists(util.abspath_join(llvmdir, "Makefile.config")):
        util.run_command(["./configure"], cwd=llvmdir)
    
    clang_path = get_clang_path()
    clangpp_path = get_clangpp_path()
    clang_found = util.is_exe(clang_path) and util.is_exe(clangpp_path)
    if not clang_found:
        util.run_command(["make"], cwd=llvmdir)
    clang_found = util.is_exe(clang_path) and util.is_exe(clangpp_path)
    if not clang_found:
        sys.stderr.write("Failed to build LLVM clang/clang++\n")
        sys.exit(1)
    print("Using clang: " + clang_path)
    print("Using clang++: " + clangpp_path)
    
    v8dir = util.abspath_join(BUILD_DIR_ABS, conf.V8_DIR)
    print("Checking for V8: '%s'" % v8dir)
    if not os.path.isdir(util.abspath_join(v8dir, "src")):
        util.svn_co(conf.V8_URL, v8dir)
    v8_path = get_v8_path()
    if not util.is_exe(v8_path):
        util.run_command(["scons", "d8"], cwd=v8dir)
    if not util.is_exe(v8_path):
        sys.stderr.write("Failed to build v8 d8 executable\n")
        sys.exit(1)
    print("Using d8: " + v8_path)
    
    closure_compiler_dir = util.abspath_join(BUILD_DIR_ABS, conf.CLOSURE_COMPILER_DIR)
    util.mkdir(closure_compiler_dir)
    closure_compiler_zip = util.abspath_join(closure_compiler_dir, "compiler-latest.zip")
    if not os.path.isfile(closure_compiler_zip):
        print("Downloading '%s' -> '%s'" % (conf.CLOSURE_COMPILER_URL, closure_compiler_zip))
        urllib.urlretrieve(conf.CLOSURE_COMPILER_URL, closure_compiler_zip)
    closure_compiler = get_closure_compiler_path()
    if not os.path.isfile(closure_compiler):
        z = zipfile.ZipFile(closure_compiler_zip)
        z.extractall(path=closure_compiler_dir)
    if not os.path.isfile(closure_compiler):
        sys.stderr.write("Failed to get closure compiler\n")
        sys.exit(1)
    print("Using compiler.jar: " + closure_compiler)
    
    spidermonkey_dir = util.abspath_join(BUILD_DIR_ABS, conf.SPIDERMONKEY_DIR)
    print("Checking for SpiderMonkey: '%s'" % spidermonkey_dir)
    if not os.path.isdir(util.abspath_join(spidermonkey_dir, "browser")):
        util.hg_clone(conf.SPIDERMONKEY_URL, spidermonkey_dir, conf.SPIDERMONKEY_TAG)
    spidermonkey_build_dir = util.abspath_join(spidermonkey_dir, "js/src")
    spidermonkey_path = get_spidermonkey_path()
    if not os.path.isfile(util.abspath_join(spidermonkey_build_dir, "configure")):
        util.run_command(["autoreconf2.13"], cwd=spidermonkey_build_dir)
    if not os.path.isfile(util.abspath_join(spidermonkey_build_dir, "Makefile")):
        util.run_command(["./configure"], cwd=spidermonkey_build_dir)
    if not util.is_exe(spidermonkey_path):
        util.run_command(["make"], cwd=spidermonkey_build_dir)
    if not util.is_exe(spidermonkey_path):
        sys.stderr.write("Failed to build SpiderMonkey js executable\n")
        sys.exit(1)
    print("Using js: " + spidermonkey_path)
    
    nodejs_dir = util.abspath_join(BUILD_DIR_ABS, conf.NODEJS_DIR)
    util.mkdir(nodejs_dir)
    nodejs_tgz = util.abspath_join(nodejs_dir, os.path.basename(conf.NODEJS_URL))
    if not os.path.isfile(nodejs_tgz):
        print("Downloading '%s' -> '%s'" % (conf.NODEJS_URL, nodejs_tgz))
        urllib.urlretrieve(conf.NODEJS_URL, nodejs_tgz)
    nodejs_dir_path = get_nodejs_dir()
    if not os.path.isfile(util.abspath_join(nodejs_dir_path, "./configure")):
        print("Extracting '%s' -> '%s'" % (nodejs_tgz, nodejs_dir))
        t = tarfile.open(nodejs_tgz)
        t.extractall(path=nodejs_dir)
    nodejs_path = get_nodejs_path()
    if not util.is_exe(nodejs_path):
        util.run_command(["./configure"], cwd=nodejs_dir_path)
        util.run_command(["make"], cwd=nodejs_dir_path)
    if not util.is_exe(nodejs_path):
        sys.stderr.write("Failed to build nodejs.\n")
        sys.exit(1)
    print("Using node: " + nodejs_path)
    
    emscripten_dir = get_emscripten_dir()
    print("Checking for emscripten: '%s'" % emscripten_dir)
    if not util.is_exe(util.abspath_join(emscripten_dir, "emscripten.py")):
        sys.stderr.write("Could not find emscripten.py in emscripten directory '%s'.\n" % emscripten_dir)
        sys.stderr.write("Did you forget to run 'git submodule update --init --recursive' after cloning?\n")
        sys.exit(1)
    
    emscripten.write_emscripten_config(get_llvm_bindir(),
                                       get_v8_path(),
                                       get_closure_compiler_path(),
                                       get_emscripten_dir(),
                                       get_spidermonkey_path(),
                                       get_nodejs_path())
    
    print("[DONE] - deps")

def compile(**kwargs):
    print("[START] - compile")
    
    mozdir = util.abspath_join(BUILD_DIR_ABS, conf.MOZILLA_CENTRAL_DIR)
    js_src_dir = util.abspath_join(mozdir, "js/src")
    if not os.path.isdir(util.abspath_join(mozdir, "browser")):
        util.hg_clone(conf.MOZILLA_CENTRAL_URL, mozdir, conf.MOZILLA_CENTRAL_TAG)
    print("Using mozilla-central js/src directory: '%s'" % js_src_dir)
    
    if kwargs.get('clean', False):
        try:
            shutil.rmtree(js_src_dir)
        except OSError:
            pass
        
        util.run_command(["hg", "revert", "js/src"], cwd=mozdir)
    
    if not util.is_exe(util.abspath_join(js_src_dir, "./configure")):
        util.run_command(["autoreconf2.13"], cwd=js_src_dir)
    
    emconfigure = get_emconfigure_path()
    
    configure_line = [emconfigure,
                      "./configure",
                      "--disable-methodjit",
                      "--disable-monoic",
                      "--disable-polyic",
                      "--disable-tracejit",
                      "--disable-methodjit-spew",
                      "--disable-tests",
                      "--enable-debug",
                      "--disable-optimize"
                      ]
    
    makefile_path = util.abspath_join(js_src_dir, "./Makefile")
    if not os.path.isfile(makefile_path):
        util.run_command(configure_line, cwd=js_src_dir)
    
    filter_file(makefile_path, compile_filters.makefile_filters)
    
    jsapi_h_path = util.abspath_join(js_src_dir, "./jsapi.h")
    filter_file(jsapi_h_path, compile_filters.jsapi_filters)
    
    MacroAssemblerX86Common_h_path = util.abspath_join(js_src_dir, "./assembler/assembler/MacroAssemblerX86Common.h")
    filter_file(MacroAssemblerX86Common_h_path, compile_filters.MacroAssemblerX86Common_filters)
    
    MacroAssemblerX86Common_cpp_path = util.abspath_join(js_src_dir, "./assembler/assembler/MacroAssemblerX86Common.cpp")
    filter_file(MacroAssemblerX86Common_cpp_path, compile_filters.MacroAssemblerX86Common_cpp_filters)
    
    expandlibs_config_path = util.abspath_join(js_src_dir, "./config/expandlibs_config.py")
    filter_file(expandlibs_config_path, compile_filters.expandlibs_config_filters)
    
    jsgcchunk_cpp_path = util.abspath_join(js_src_dir, "./jsgcchunk.cpp")
    filter_file(jsgcchunk_cpp_path, compile_filters.jsgchunk_cpp_filters)
    
    js_shell_bc_out = util.abspath_join(js_src_dir, "./shell/js")
    libjs_static_bc_out = util.abspath_join(js_src_dir, "./libjs_static.a.bc")
    make_success = util.is_exe(libjs_static_bc_out) and os.path.exists(js_shell_bc_out)
    
    if not make_success:
        util.run_command(["make", "-C", "config"], cwd=js_src_dir)
        util.run_command(["make", "jsautocfg.h"], cwd=js_src_dir)
        
        jscpucfg_h_path = util.abspath_join(js_src_dir, "./jscpucfg.h")
        filter_file(jscpucfg_h_path, compile_filters.jscpucfg_filters)
        jsautocfg_h_path = util.abspath_join(js_src_dir, "./jsautocfg.h")
        filter_file(jsautocfg_h_path, compile_filters.jscpucfg_filters)
        
        jsconfig_h_path = util.abspath_join(js_src_dir, "./js-config.h")
        filter_file(jsconfig_h_path, compile_filters.jsconfig_filters)
        
        jsconfdefs_h_path = util.abspath_join(js_src_dir, "./js-confdefs.h")
        filter_file(jsconfdefs_h_path, compile_filters.jsconfdefs_filters)
        
        jstypes_h_path = util.abspath_join(js_src_dir, "./jstypes.h")
        filter_file(jstypes_h_path, compile_filters.jstypes_h_filters)
        
        util.run_command(["make"], cwd=js_src_dir)
    
    make_success = util.is_exe(libjs_static_bc_out) and os.path.exists(js_shell_bc_out)
    if not make_success:
        sys.stderr.write("Failed to build spidermonkey. Exiting.\n")
        sys.exit(1)
        
    js_bc = util.abspath_join(BUILD_DIR_ABS, "./js.bc")
    libjs_bc = util.abspath_join(BUILD_DIR_ABS, "./libjs.bc")
    
    try:
        same_files = filecmp.cmp(js_shell_bc_out, js_bc) and filecmp.cmp(libjs_static_bc_out, libjs_bc)
    except OSError:
        same_files = False
    
    ranprev = False
    if not same_files:
        shutil.copyfile(js_shell_bc_out, js_bc)
        shutil.copyfile(libjs_static_bc_out, libjs_bc)
        ranprev = True
    
    js_combined_bc = util.abspath_join(BUILD_DIR_ABS, "./js_combined.bc")
    if ranprev or not os.path.isfile(js_combined_bc):
        util.run_command([get_llvm_link_path(), '-o', js_combined_bc, libjs_bc, js_bc])
        ranprev = True
    
    js_combined_ll = util.abspath_join(BUILD_DIR_ABS, "./js_combined.ll")
    if ranprev or not os.path.isfile(js_combined_ll):
        util.run_command([get_llvm_dis_path(), '-show-annotations', '-o', js_combined_ll, js_combined_bc])
        ranprev = True
    
    if not os.path.isfile(js_combined_ll):
        sys.stderr.write("Failed to build combined LLVM file.\n")
        sys.exit(1)
    
    print("Built LLVM file:\n -- %s" % js_combined_ll)
    print(" -- %g MB" % (float(os.path.getsize(js_combined_ll)) / 1024 / 1024,))
    
    print("[DONE] - compile")

def translate(**kwargs):
    print("[START] - translate")
    
    js_combined_ll = util.abspath_join(BUILD_DIR_ABS, "./js_combined.ll")
    if not os.path.isfile(js_combined_ll):
        sys.stderr.write("Could not find expected LLVM output file at '%s'.\n" % js_combined_ll)
        sys.stderr.write("Did you forget to run ./build.py compile ?\n")
        sys.exit(1)
    
    js_js_path = util.abspath_join(BUILD_DIR_ABS, "./js.js")

    added_env = dict(EMCC_LEAVE_INPUTS_RAW='1',
                     EMCC_DEBUG='1')
    
    util.run_command([get_emcc_path(),
                      
                      '-O0',
                      
                      #'-O1',
                      #'-s', 'DISABLE_EXCEPTION_CATCHING=0',
                      
                      '--typed-arrays', '0',
                      '-o', js_js_path,
                      js_combined_ll],
                     added_env=added_env,
                     cwd=BUILD_DIR_ABS)
    
    last_lines = ""
    try:
        last_lines = util.tail(open(js_js_path, 'r'), window=25)
    except IOError:
        pass
    
    if not os.path.isfile(js_js_path) or "error" in last_lines.lower():
        sys.stderr.write("Translation failed. Dumping end of output file:\n\n======\n")
        sys.stderr.write(last_lines)
        sys.stdout.write("======\n\nYou can also find the error in the temporary emscripten directory above.\n")
        sys.exit(1)
        
    print("js.js at '%s'" % js_js_path)
    
    print("[DONE] - translate")

def build_all(**kwargs):
    deps(**kwargs)
    compile(**kwargs)
    translate(**kwargs)

def main():
    parser = argparse.ArgumentParser(description='Build script for js.js')
    subparsers = parser.add_subparsers(title='available commands')
    
    all_parser = subparsers.add_parser('all', help='Runs deps, compile, and translate')
    all_parser.set_defaults(func=build_all)
    
    deps_parser = subparsers.add_parser('deps', help='Checks out, builds, and installs dependencies')
    deps_parser.set_defaults(func=deps)
    
    compile_parser = subparsers.add_parser('compile', help='Compiles SpiderMonkey into LLVM')
    compile_parser.add_argument('--clean', action='store_true', help='Cleans out the js/src directory before compiling. Useful for debugging.')
    compile_parser.set_defaults(func=compile)
    
    translate_parser = subparsers.add_parser('translate', help='Translates output LLVM file into JS')
    translate_parser.set_defaults(func=translate)
    
    args = parser.parse_args()
    args.func(**vars(args))

if __name__ == '__main__':
    main()