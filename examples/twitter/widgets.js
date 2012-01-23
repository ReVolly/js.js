((function(a, b) {
  function s(a) {
    for (var b = 1, c; c = arguments[b]; b++) for (var d in c) a[d] = c[d];
    return a;
  }
  function t(a) {
    return Array.prototype.slice.call(a);
  }
  function v(a, b) {
    for (var c = 0, d; d = a[c]; c++) if (b == d) return c;
    return -1;
  }
  function w() {
    var a = t(arguments), b = [];
    for (var c = 0, d = a.length; c < d; c++) a[c].length > 0 && b.push(a[c].replace(/\/$/, ""));
    return b.join("/");
  }
  function x(a, b, c) {
    var d = b.split("/"), e = a;
    while (d.length > 1) {
      var f = d.shift();
      e = e[f] = e[f] || {};
    }
    e[d[0]] = c;
  }
  function y() {}
  function z(a, b) {
    this.id = this.path = a, this.force = !!b;
  }
  function A(a, b) {
    this.id = a, this.body = b, typeof b == "undefined" && (this.path = this.resolvePath(a));
  }
  function B(a, b) {
    this.deps = a, this.collectResults = b, this.deps.length == 0 && this.complete();
  }
  function C(a, b) {
    this.deps = a, this.collectResults = b;
  }
  function D() {
    for (var a in d) if (d[a].readyState == "interactive") return l[d[a].id];
  }
  function E(a, b) {
    var d;
    return !a && c && (d = k || D()), d ? (delete l[d.scriptId], d.body = b, d.execute()) : (j = d = new A(a, b), i[d.id] = d), d;
  }
  function F() {
    var a = t(arguments), b, c;
    return typeof a[0] == "string" && (b = a.shift()), c = a.shift(), E(b, c);
  }
  function G(a, b) {
    var c = b.id || "", d = c.split("/");
    d.pop();
    var e = d.join("/");
    return a.replace(/^\./, e);
  }
  function H(a, b) {
    function d(a) {
      return A.exports[G(a, b)];
    }
    var c = [];
    for (var e = 0, f = a.length; e < f; e++) {
      if (a[e] == "require") {
        c.push(d);
        continue;
      }
      if (a[e] == "exports") {
        b.exports = b.exports || {}, c.push(b.exports);
        continue;
      }
      c.push(d(a[e]));
    }
    return c;
  }
  function I() {
    var a = t(arguments), b = [], c, d;
    return typeof a[0] == "string" && (c = a.shift()), u(a[0]) && (b = a.shift()), d = a.shift(), E(c, (function(a) {
      function f() {
        var e = H(t(b), c), f;
        typeof d == "function" ? f = d.apply(c, e) : f = d, typeof f == "undefined" && (f = c.exports), a(f);
      }
      var c = this, e = [];
      for (var g = 0, h = b.length; g < h; g++) {
        var i = b[g];
        v([ "require", "exports" ], i) == -1 && e.push(G(i, c));
      }
      e.length > 0 ? J.apply(this, e.concat(f)) : f();
    }));
  }
  function J() {
    var a = t(arguments), b, c;
    typeof a[a.length - 1] == "function" && (b = a.pop()), typeof a[a.length - 1] == "boolean" && (c = a.pop());
    var d = new B(K(a, c), c);
    return b && d.then(b), d;
  }
  function K(a, b) {
    var c = [];
    for (var d = 0, e; e = a[d]; d++) typeof e == "string" && (e = L(e)), u(e) && (e = new C(K(e, b), b)), c.push(e);
    return c;
  }
  function L(a) {
    var b, c;
    for (var d = 0, e; e = J.matchers[d]; d++) {
      var f = e[0], g = e[1];
      if (b = a.match(f)) return g(a);
    }
    throw new Error(a + " was not recognised by loader");
  }
  function N() {
    return a.using = m, a.provide = n, a.define = o, a.loadrunner = p, M;
  }
  function O(a) {
    for (var b = 0; b < J.bundles.length; b++) for (var c in J.bundles[b]) if (c != a && v(J.bundles[b][c], a) > -1) return c;
  }
  var c = a.attachEvent && !a.opera, d = b.getElementsByTagName("script"), e = 0, f, g = b.createElement("script"), h = {}, i = {}, j, k, l = {}, m = a.using, n = a.provide, o = a.define, p = a.loadrunner;
  for (var q = 0, r; r = d[q]; q++) if (r.src.match(/loadrunner\.js(\?|#|$)/)) {
    f = r;
    break;
  }
  var u = Array.isArray || (function(a) {
    return a.constructor == Array;
  });
  y.prototype.then = (function(b) {
    var c = this;
    return this.started || (this.started = !0, this.start()), this.completed ? b.apply(a, this.results) : (this.callbacks = this.callbacks || [], this.callbacks.push(b)), this;
  }), y.prototype.start = (function() {}), y.prototype.complete = (function() {
    if (!this.completed) {
      this.results = t(arguments), this.completed = !0;
      if (this.callbacks) for (var b = 0, c; c = this.callbacks[b]; b++) c.apply(a, this.results);
    }
  }), z.loaded = [], z.prototype = new y, z.prototype.start = (function() {
    var a = this, b, c, d;
    return (d = i[this.id]) ? (d.then((function() {
      a.complete();
    })), this) : ((b = h[this.id]) ? b.then((function() {
      a.loaded();
    })) : !this.force && v(z.loaded, this.id) > -1 ? this.loaded() : (c = O(this.id)) ? J(c, (function() {
      a.loaded();
    })) : this.load(), this);
  }), z.prototype.load = (function() {
    var b = this;
    h[this.id] = b;
    var c = g.cloneNode(!1);
    this.scriptId = c.id = "LR" + ++e, c.type = "text/javascript", c.async = !0, c.onerror = (function() {
      throw new Error(b.path + " not loaded");
    }), c.onreadystatechange = c.onload = (function(c) {
      c = a.event || c;
      if (c.type == "load" || v([ "loaded", "complete" ], this.readyState) > -1) this.onreadystatechange = null, b.loaded();
    }), c.src = this.path, k = this, d[0].parentNode.insertBefore(c, d[0]), k = null, l[c.id] = this;
  }), z.prototype.loaded = (function() {
    this.complete();
  }), z.prototype.complete = (function() {
    v(z.loaded, this.id) == -1 && z.loaded.push(this.id), delete h[this.id], y.prototype.complete.apply(this, arguments);
  }), A.exports = {}, A.prototype = new z, A.prototype.resolvePath = (function(a) {
    return w(J.path, a + ".js");
  }), A.prototype.start = (function() {
    var a, b, c = this, d;
    this.body ? this.execute() : (a = A.exports[this.id]) ? this.exp(a) : (b = i[this.id]) ? b.then((function(a) {
      c.exp(a);
    })) : (bundle = O(this.id)) ? J(bundle, (function() {
      c.start();
    })) : (i[this.id] = this, this.load());
  }), A.prototype.loaded = (function() {
    var a, b, d = this;
    c ? (b = A.exports[this.id]) ? this.exp(b) : (a = i[this.id]) && a.then((function(a) {
      d.exp(a);
    })) : (a = j, j = null, a.id = a.id || this.id, a.then((function(a) {
      d.exp(a);
    })));
  }), A.prototype.complete = (function() {
    delete i[this.id], z.prototype.complete.apply(this, arguments);
  }), A.prototype.execute = (function() {
    var a = this;
    typeof this.body == "object" ? this.exp(this.body) : typeof this.body == "function" && this.body.apply(window, [ (function(b) {
      a.exp(b);
    }) ]);
  }), A.prototype.exp = (function(a) {
    this.complete(this.exports = A.exports[this.id] = a || {});
  }), B.prototype = new y, B.prototype.start = (function() {
    function b() {
      var b = [];
      a.collectResults && (b[0] = {});
      for (var c = 0, d; d = a.deps[c]; c++) {
        if (!d.completed) return;
        d.results.length > 0 && (a.collectResults ? d instanceof C ? s(b[0], d.results[0]) : x(b[0], d.id, d.results[0]) : b = b.concat(d.results));
      }
      a.complete.apply(a, b);
    }
    var a = this;
    for (var c = 0, d; d = this.deps[c]; c++) d.then(b);
    return this;
  }), C.prototype = new y, C.prototype.start = (function() {
    var a = this, b = 0, c = [];
    return a.collectResults && (c[0] = {}), function d() {
      var e = a.deps[b++];
      e ? e.then((function(b) {
        e.results.length > 0 && (a.collectResults ? e instanceof C ? s(c[0], e.results[0]) : x(c[0], e.id, e.results[0]) : c.push(e.results[0])), d();
      })) : a.complete.apply(a, c);
    }(), this;
  }), I.amd = {};
  var M = (function(a) {
    return a(J, F, M, define);
  });
  M.Script = z, M.Module = A, M.Collection = B, M.Sequence = C, M.Dependency = y, M.noConflict = N, a.loadrunner = M, a.using = J, a.provide = F, a.define = I, J.path = "", J.matchers = [], J.matchers.add = (function(a, b) {
    this.unshift([ a, b ]);
  }), J.matchers.add(/(^script!|\.js$)/, (function(a) {
    var b = new z(a.replace(/^\$/, J.path.replace(/\/$/, "") + "/").replace(/^script!/, ""), !1);
    return b.id = a, b;
  })), J.matchers.add(/^[a-zA-Z0-9_\-\/]+$/, (function(a) {
    return new A(a);
  })), J.bundles = [], f && (J.path = f.getAttribute("data-path") || f.src.split(/loadrunner\.js/)[0] || "", (main = f.getAttribute("data-main")) && J.apply(a, main.split(/\s*,\s*/)).then((function() {})));
}))(this, document);

window.__twttrlr = loadrunner.noConflict();

__twttrlr((function(using, provide, loadrunner, define) {
  provide("$xd/json2.js", (function(exports) {
    window.JSON || (window.JSON = {}), (function() {
      function f(a) {
        return a < 10 ? "0" + a : a;
      }
      function quote(a) {
        return escapable.lastIndex = 0, escapable.test(a) ? '"' + a.replace(escapable, (function(a) {
          var b = meta[a];
          return typeof b == "string" ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        })) + '"' : '"' + a + '"';
      }
      function str(a, b) {
        var c, d, e, f, g = gap, h, i = b[a];
        i && typeof i == "object" && typeof i.toJSON == "function" && (i = i.toJSON(a)), typeof rep == "function" && (i = rep.call(b, a, i));
        switch (typeof i) {
         case "string":
          return quote(i);
         case "number":
          return isFinite(i) ? String(i) : "null";
         case "boolean":
         case "null":
          return String(i);
         case "object":
          if (!i) return "null";
          gap += indent, h = [];
          if (Object.prototype.toString.apply(i) === "[object Array]") {
            f = i.length;
            for (c = 0; c < f; c += 1) h[c] = str(c, i) || "null";
            return e = h.length === 0 ? "[]" : gap ? "[\n" + gap + h.join(",\n" + gap) + "\n" + g + "]" : "[" + h.join(",") + "]", gap = g, e;
          }
          if (rep && typeof rep == "object") {
            f = rep.length;
            for (c = 0; c < f; c += 1) d = rep[c], typeof d == "string" && (e = str(d, i), e && h.push(quote(d) + (gap ? ": " : ":") + e));
          } else for (d in i) Object.hasOwnProperty.call(i, d) && (e = str(d, i), e && h.push(quote(d) + (gap ? ": " : ":") + e));
          return e = h.length === 0 ? "{}" : gap ? "{\n" + gap + h.join(",\n" + gap) + "\n" + g + "}" : "{" + h.join(",") + "}", gap = g, e;
        }
      }
      typeof Date.prototype.toJSON != "function" && (Date.prototype.toJSON = (function(a) {
        return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null;
      }), String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = (function(a) {
        return this.valueOf();
      }));
      var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, gap, indent, meta = {
        "\b": "\\b",
        "\t": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\"
      }, rep;
      typeof JSON.stringify != "function" && (JSON.stringify = (function(a, b, c) {
        var d;
        gap = "", indent = "";
        if (typeof c == "number") for (d = 0; d < c; d += 1) indent += " "; else typeof c == "string" && (indent = c);
        rep = b;
        if (!b || typeof b == "function" || typeof b == "object" && typeof b.length == "number") return str("", {
          "": a
        });
        throw new Error("JSON.stringify");
      })), typeof JSON.parse != "function" && (JSON.parse = (function(text, reviver) {
        function walk(a, b) {
          var c, d, e = a[b];
          if (e && typeof e == "object") for (c in e) Object.hasOwnProperty.call(e, c) && (d = walk(e, c), d !== undefined ? e[c] = d : delete e[c]);
          return reviver.call(a, b, e);
        }
        var j;
        cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, (function(a) {
          return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
        })));
        if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) return j = eval("(" + text + ")"), typeof reviver == "function" ? walk({
          "": j
        }, "") : j;
        throw new SyntaxError("JSON.parse");
      }));
    })();
    exports();
    loadrunner.Script.loaded.push("$xd/json2.js");
  }));
  provide("util/util", (function(a) {
    function b(a) {
      for (var b = 1, c; c = arguments[b]; b++) for (var d in c) a[d] = c[d];
      return a;
    }
    function c(a) {
      return b([], a);
    }
    function d(a) {
      for (var b in a) a.hasOwnProperty(b) && !a[b] && a[b] !== !1 && a[b] !== 0 && delete a[b];
    }
    function e(a, b) {
      for (var c = 0, d; d = a[c]; c++) if (b == d) return c;
      return -1;
    }
    function f(a, b) {
      if (!a) return null;
      var c = [];
      for (var d = 0, e = a.length; d < e; d++) b(a[d]) && c.push(a[d]);
      return c;
    }
    a({
      aug: b,
      array: c,
      indexOf: e,
      filter: f,
      compact: d
    });
  }));
  provide("util/events", (function(a) {
    using("util/util", (function(b) {
      function d() {
        this.completed = !1, this.callbacks = [];
      }
      var c = {
        bind: (function(a, b) {
          return this._handlers = this._handlers || {}, this._handlers[a] = this._handlers[a] || [], this._handlers[a].push(b);
        }),
        unbind: (function(a, c) {
          if (!this._handlers[a]) return;
          if (c) {
            var d = b.indexOf(this._handlers[a], c);
            d >= 0 && this._handlers[a].splice(d, 1);
          } else this._handlers[a] = [];
        }),
        trigger: (function(a, b) {
          var c = this._handlers && this._handlers[a];
          b.type = a;
          if (c) for (var d = 0, e; e = c[d]; d++) e.call(this, b);
        })
      };
      d.prototype.addCallback = (function(a) {
        this.completed ? a.apply(this, this.results) : this.callbacks.push(a);
      }), d.prototype.complete = (function() {
        this.results = makeArray(arguments), this.completed = !0;
        for (var a = 0, b; b = this.callbacks[a]; a++) b.apply(this, this.results);
      }), a({
        Emitter: c,
        Promise: d
      });
    }));
  }));
  provide("xd/jsonrpc", (function(a) {
    using("util/util", "util/events", (function(b, c) {
      function d(a) {
        this.con = a;
      }
      function e() {
        this.id = e.id++;
      }
      function f() {
        a((function(a) {
          return new d(a);
        }));
      }
      b.aug(d.prototype, {
        expose: (function(a) {
          this.con.bind("message", this._handleRequest(a));
        }),
        call: (function(a) {
          var b, c = this;
          b || (b = {}, this.con.bind("message", (function(a) {
            var c;
            try {
              a = JSON.parse(a);
            } catch (d) {
              return;
            }
            typeof a.id == "number" && (c = b[a.id]) && (a.error ? c.trigger("error", a) : c.trigger("success", a), delete b[a.id]);
          })));
          var d = new e;
          return b[d.id] = d, d.send(this.con, a, Array.prototype.slice.call(arguments, 1));
        }),
        _handleRequest: (function(a) {
          var b = this;
          return function c(c) {
            var d, e;
            try {
              c = JSON && JSON.parse ? JSON.parse(c) : JSON && JSON.decode ? JSON.decode(c) : (new Function("return " + c))();
            } catch (f) {
              return;
            }
            typeof c.id == "number" && typeof a[c.method] == "function" && (e = b._responseCallbacks(c.id), d = a[c.method].apply(a, c.params.concat(e)), typeof d != "undefined" && e[0](d));
          };
        }),
        _responseCallbacks: (function(a) {
          var b = this.con;
          return [ function c(c) {
            b.send(JSON.stringify({
              id: a,
              result: c
            }));
          }, function d(d) {
            b.send(JSON.stringify({
              id: a,
              error: d
            }));
          } ];
        })
      }), e.id = 0, b.aug(e.prototype, c.Emitter, {
        send: (function(a, b, c) {
          return a.send(JSON.stringify({
            id: this.id,
            method: b,
            params: c
          })), this;
        }),
        success: (function(a) {
          return this.bind("success", a), this;
        }),
        error: (function(a) {
          return this.bind("error", a), this;
        })
      }), typeof JSON == "undefined" ? using("$xd/json2.js", (function() {
        f();
      })) : f();
    }));
  }));
  provide("xd/flash", (function(a) {
    function b(a, b) {
      var c = b || Math.floor(Math.random() * 100), d = [ '<object id="xdflashshim' + c + '" name="xdflashshim' + c + '"', 'type="application/x-shockwave-flash" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"', 'width="1" height="1" style="position:absolute;left:-9999px;top:-9999px;">', '<param name="movie" value="' + a + "&debug=" + window.__XDDEBUG__ + '"/>', '<param name="wmode" value="window"/>', '<param name="allowscriptaccess" value="always"/>', "</object>" ].join(" ");
      return d;
    }
    a({
      object: b
    });
  }));
  provide("xd/detection", (function(a) {
    function b() {
      try {
        return !!navigator.plugins["Shockwave Flash"] || !!(new ActiveXObject("ShockwaveFlash.ShockwaveFlash"));
      } catch (a) {
        return !1;
      }
    }
    a({
      getFlashEnabled: b,
      hasPostMessage: !!window.postMessage,
      isIE: !!navigator.userAgent.match("MSIE")
    });
  }));
  provide("xd/base", (function(a) {
    using("util/util", "util/events", (function(b, c) {
      function d() {}
      b.aug(d.prototype, c.Emitter, {
        transportMethod: "",
        init: (function() {}),
        send: (function(a) {
          var b;
          this._ready ? this._performSend(a) : b = this.bind("ready", (function() {
            this.unbind("ready", b), this._performSend(a);
          }));
        }),
        ready: (function() {
          this.trigger("ready", this), this._ready = !0;
        }),
        isReady: (function() {
          return !!this._ready;
        }),
        receive: (function(a) {
          this.trigger("message", a);
        })
      }), a({
        Connection: d
      });
    }));
  }));
  provide("xd/parent", (function(a) {
    using("xd/base", "util/util", "xd/detection", (function(b, c, d) {
      function h(a) {
        var b = [];
        for (var c in a) b.push(c + "=" + a[c]);
        return b.join(",");
      }
      function i() {}
      var e = "__ready__", f = 0, g;
      i.prototype = new b.Connection, c.aug(i.prototype, {
        _createChild: (function() {
          this.options.window ? this._createWindow() : this._createIframe();
        }),
        _createIframe: (function() {
          var a = {
            allowTransparency: !0,
            frameBorder: "0",
            scrolling: "no",
            tabIndex: "0",
            name: this._name()
          }, b, e, f, h = c.aug(c.aug({}, a), this.options.iframe);
          window.postMessage ? (g || (g = document.createElement("iframe")), b = g.cloneNode(!1)) : b = document.createElement('<iframe name="' + h.name + '">'), b.id = h.name;
          for (var i in h) i != "style" && b.setAttribute(i, h[i]);
          var j = b.getAttribute("style");
          j && typeof j.cssText != "undefined" ? j.cssText = h.style : b.style.cssText = h.style;
          var k = this, l = (function() {
            k.child = b.contentWindow, k._ready || k.init();
          });
          if (!b.addEventListener) {
            var m = !1;
            b.attachEvent("onload", (function() {
              if (m) return;
              m = !0, l();
            }));
          } else b.addEventListener("load", l, !1);
          b.src = this._source(), (e = this.options.appendTo) ? e.appendChild(b) : (f = this.options.replace) ? (e = f.parentNode, e && e.replaceChild(b, f)) : document.body.insertBefore(b, document.body.firstChild), d.isIE && this.transportMethod && this.transportMethod === "Flash" && (b.src = b.src);
        }),
        _createWindow: (function() {
          var a = {
            width: 550,
            height: 450,
            personalbar: "0",
            toolbar: "0",
            scrollbars: "1",
            resizable: "1"
          }, b, d, e, f = c.aug(c.aug({}, a), this.options.window), g = screen.width, i = screen.height;
          f.left = f.left || Math.round(g / 2 - f.width / 2), f.top = f.top || Math.round(i / 2 - f.height / 2), i < f.height && (f.top = 0, f.height = i);
          var j = this._name();
          b = window.open(this._source(), j, h(f)), b && b.focus(), this.child = b, this.init();
        }),
        _source: (function() {
          return this.options.src;
        }),
        _name: (function() {
          var a = "_xd_" + f++;
          return window.parent && window.parent != window && window.name && (a = window.name + a), a;
        })
      });
      var j = (function(a) {
        this.transportMethod = "PostMessage", this.options = a, this._createChild();
      });
      j.prototype = new i, c.aug(j.prototype, {
        init: (function() {
          function b(b) {
              throw b;
            //b.source === a.child && (!a._ready && b.data === e ? a.ready() : a.receive(b.data));
          }
          var a = this;
          window.addEventListener ? window.addEventListener("message", b, !1) : window.attachEvent("onmessage", b);
        }),
        _performSend: (function(a) {
          this.child.postMessage(a, this.options.src);
        })
      });
      var k = (function(a) {
        this.transportMethod = "Flash", this.options = a, this.token = Math.random().toString(16).substring(2), this._setup();
      });
      k.prototype = new i, c.aug(k.prototype, {
        _setup: (function() {
          var a = this;
          using("xd/flash", (function(b) {
            window["__xdcb" + a.token] = {
              receive: (function(b) {
                !a._ready && b === e ? a.ready() : a.receive(b);
              }),
              loaded: (function() {})
            };
            var c = document.createElement("div");
            c.innerHTML = b.object("https://tfw-current.s3.amazonaws.com/xd/ft.swf?&token=" + a.token + "&parent=true&callback=__xdcb" + a.token + "&xdomain=" + a._host(), a.token), document.body.insertBefore(c, document.body.firstChild), a.proxy = c.firstChild, a._createChild();
          }));
        }),
        init: (function() {}),
        _performSend: (function(a) {
          this.proxy.send(a);
        }),
        _host: (function() {
          return this.options.src.replace(/https?:\/\//, "").split(/(:|\/)/)[0];
        }),
        _source: (function() {
          return this.options.src + (this.options.src.match(/\?/) ? "&" : "?") + "xd_token=" + escape(this.token);
        })
      });
      var l = (function(a) {
        this.transportMethod = "Fallback", this.options = a, this._createChild();
      });
      l.prototype = new i, c.aug(l.prototype, {
        init: (function() {}),
        _performSend: (function(a) {})
      }), a({
        connect: (function(a) {
          var b;
          return d.hasPostMessage ? d.isIE && a.window ? d.getFlashEnabled() && (b = new k(a)) : b = new j(a) : d.isIE && d.getFlashEnabled() && (b = new k(a)), b || (b = new l(a)), b;
        })
      });
    }));
  }));
  provide("i18n/languages", (function(a) {
    a([ "it", "no", "de", "ja", "fr", "zh-cn", "hi", "ru", "es", "sv", "fi", "pt", "ko", "zh-tw", "id", "msa", "pl", "da", "nl", "tr", "fil" ]);
  }));
  provide("util/iframe", (function(a) {
    a((function(a) {
      var b = document.createElement("div"), c;
      b.innerHTML = "<iframe allowtransparency='true' frameborder='0' scrolling='no'></iframe>", c = b.firstChild, c.src = a.url, c.className = a.className || "";
      if (a.css) for (var d in a.css) c.style[d] = a.css[d];
      if (a.attributes) for (var e in a.attributes) c.setAttribute(e, a.attributes[e]);
      return a.replace ? a.replace.parentNode.replaceChild(c, a.replace) : document.body.insertBefore(c, document.body.firstChild), c;
    }));
  }));
  provide("util/querystring", (function(a) {
    function b(a) {
      return encodeURIComponent(a).replace(/\+/g, "%2B");
    }
    function c(a) {
      return decodeURIComponent(a);
    }
    function d(a) {
      var c = [];
      for (var d in a) a[d] !== null && typeof a[d] != "undefined" && c.push(b(d) + "=" + b(a[d]));
      return c.sort().join("&");
    }
    function e(a) {
      var b = {}, d, e, f, g;
      if (a) {
        d = a.split("&");
        for (g = 0; f = d[g]; g++) e = f.split("="), e.length == 2 && (b[c(e[0])] = c(e[1]));
      }
      return b;
    }
    function f(a, b) {
      var c = d(b);
      return c.length > 0 ? a.indexOf("?") >= 0 ? a + "&" + d(b) : a + "?" + d(b) : a;
    }
    a({
      url: f,
      decode: e,
      encode: d,
      encodePart: b,
      decodePart: c
    });
  }));
  provide("util/nodeselect", (function(a) {
    var b = document, c = "querySelectorAll" in b ? (function(a, c) {
      return b.querySelectorAll(a + "." + c);
    }) : "getElementsByClassName" in b ? (function(a, c) {
      var d = b.getElementsByClassName(c), e, f = [];
      for (i = 0; e = d[i]; i++) e.tagName.toLowerCase() == a && f.push(e);
      return f;
    }) : (function(a, c) {
      var d = b.getElementsByTagName(a), e, f = new RegExp("(?:^|\\s+)" + c + "(?:\\s+|$)"), g = [];
      for (i = 0; e = d[i]; i++) f.test(e.className) && g.push(e);
      return g;
    });
    a(c);
  }));
  provide("$vendor/domready/ready.js", (function(exports) {
    !(function(a) {
      function k() {
        b = 1;
        for (var a = 0, d = c.length; a < d; a++) c[a]();
      }
      var b = 0, c = [], d, e, f = !1, g = a.createElement("a"), h = "DOMContentLoaded", i = "addEventListener", j = "onreadystatechange";
      /^loade|c/.test(a.readyState) && (b = 1), a[i] && a[i](h, e = (function() {
        a.removeEventListener(h, e, f), k();
      }), f), g.doScroll && a.attachEvent(j, d = (function() {
        /^c/.test(a.readyState) && (a.detachEvent(j, d), k());
      }));
      var l = g.doScroll ? (function(a) {
        self != top ? b ? a() : c.push(a) : !(function() {
          try {
            g.doScroll("left");
          } catch (b) {
            return setTimeout((function() {
              l(a);
            }), 50);
          }
          a();
        })();
      }) : (function(a) {
        b ? a() : c.push(a);
      });
      typeof module != "undefined" && module.exports ? module.exports = {
        domReady: l
      } : window.domReady = l;
    })(document);
    exports();
    loadrunner.Script.loaded.push("$vendor/domready/ready.js");
  }));
  provide("util/domready", (function(a) {
    using("$vendor/domready/ready.js", (function() {
      a(domReady);
    }));
  }));
  provide("tfw/widget/base", (function(a) {
    using("util/util", "util/domready", "util/nodeselect", "util/querystring", "util/iframe", "i18n/languages", (function(b, c, d, e, f, g) {
      function n() {
        return window.location.href && !!window.location.href.match("twitter-test-autosize");
      }
      function o(a) {
        var b;
        if (!a) return;
        return (b = a.lang) ? b : o(a.parentNode);
      }
      function p() {
        var a = j.widgets, b, c;
        for (var e in a) {
          e.match(/\./) ? b = d.apply(this, e.split(".")) : b = document.getElementsByTagName(e);
          for (var f = 0, g; g = b[f]; f++) {
            if (g.getAttribute("data-rendering")) continue;
            g.setAttribute("data-rendering", "true"), c = new a[e](g), k.list.push(c), k.byId[c.id] = c, c.render(j);
          }
        }
      }
      function q(a) {
        j = a;
      }
      function r() {
        p();
      }
      function s(a) {
        return a && k.byId[a] ? k.byId[a].element : null;
      }
      var h = 0, i, j, k = {
        list: [],
        byId: {}
      }, l = 2, m = (function() {});
      b.aug(m.prototype, {
        setLanguage: (function(a) {
          var c;
          a || (a = this.params().lang || this.originElement.getAttribute("data-lang") || o(this.originElement)), a = a && a.toLowerCase();
          if (!a) return this.lang = "en";
          if (~b.indexOf(g, a)) return this.lang = a;
          c = a.replace(/[-_].*/, "");
          if (~b.indexOf(g, c)) return this.lang = c;
          this.lang = "en";
        }),
        _: (function(a, b) {
          var c = this.lang;
          b = b || {};
          if (this.langs) {
            if (!c || !this.langs.hasOwnProperty(c)) c = "en";
            a = this.langs[c][a] || a;
          }
          return this.ringo(a, b);
        }),
        ringo: (function(a, b) {
          return a.replace(/\{\{([\w_]+)\}\}/g, (function(a, c) {
            return b[c] !== undefined ? b[c] : a;
          }));
        }),
        add: (function(a) {
          k.list.push(this), k.byId[this.id] = a;
        }),
        create: (function(a, b, c, d) {
          return this.id = this.generateId(), f({
            url: a,
            css: {
              width: c[0] + (typeof c[0] != "string" ? "px" : ""),
              height: c[1] + (typeof c[1] != "string" ? "px" : "")
            },
            className: b,
            id: this.id,
            attributes: d,
            replace: this.originElement
          });
        }),
        params: (function() {
          var a = this.originElement.href && this.originElement.href.split("?")[1], b = a ? e.decode(a) : {};
          return b.enableNewSizing = n(), (this.params = (function() {
            return b;
          }))();
        }),
        generateId: (function() {
          return this.originElement.id || "twitter-widget-" + h++;
        }),
        wjsVersion: (function() {
          return l;
        })
      }), a({
        Base: m,
        init: q,
        embed: r,
        find: s,
        TWITTER_PROFILE_URL: /^https?\:\/\/(?:www\.)?twitter\.com\/(?:#!?\/)?([\w_]{1,20})\/?$/
      });
    }));
  }));
  provide("util/uri", (function(a) {
    using("util/querystring", "util/util", (function(b, c) {
      function d(a) {
        var b;
        return a.match(/^https?:\/\//) ? a : (b = location.host, location.port.length > 0 && (b += ":" + location.port), [ location.protocol, "//", b, a ].join(""));
      }
      function e() {
        var a = document.getElementsByTagName("link");
        for (var b = 0, c; c = a[b]; b++) if (c.getAttribute("rel") == "canonical") return d(c.getAttribute("href"));
        return null;
      }
      function f() {
        var a = document.getElementsByTagName("a"), b = document.getElementsByTagName("link"), d = /\bme\b/, e = /^https?\:\/\/(www\.)?twitter.com\/([a-zA-Z0-9_]+)$/, f = c.array(a).concat(c.array(b)), g, h, i;
        for (var j = 0, k; k = f[j]; j++) {
          h = k.getAttribute("rel"), i = k.getAttribute("href");
          if (h && i && h.match(d) && (g = i.match(e))) return g[2];
        }
      }
      a({
        absolutize: d,
        getCanonicalURL: e,
        getScreenNameFromPage: f
      });
    }));
  }));
  provide("tfw/widget/intent", (function(a) {
    using("util/util", "tfw/widget/base", "util/querystring", "util/uri", (function(b, c, d, e) {
      function m(a) {
        var b = Math.round(k / 2 - h / 2), c = 0;
        j > i && (c = Math.round(j / 2 - i / 2)), window.open(a, "intent", g + ",width=" + h + ",height=" + i + ",left=" + b + ",top=" + c);
      }
      function n(a, b) {
        using("xd/parent", "xd/jsonrpc", (function(c, d) {
          var e = c.connect({
            window: {
              width: 550,
              height: 450
            },
            src: a
          });
          d(e).expose({
            trigger: (function(a, c) {
              twttr.events.trigger(a, {
                target: b,
                region: "intent",
                type: a,
                data: c
              });
            })
          });
        }));
      }
      function o(a) {
        var b = "original_referer=" + location.href;
        return [ a, b ].join(a.indexOf("?") == -1 ? "?" : "&");
      }
      function q(a) {
        a = a || window.event;
        var b = a.target || a.srcElement, c, d;
        while (b && b.nodeName.toLowerCase() !== "a") b = b.parentNode;
        if (b && b.nodeName.toLowerCase() === "a" && b.href) {
          c = b.href.match(f);
          if (c) {
            var e = o(b.href);
            e = e.replace(/^http[:]/, "https:"), e = e.replace(/^\/\//, "https://"), twttr.events.hub ? (d = new p(l.generateId(), b), l.add(d), n(e, b), twttr.events.trigger("click", {
              target: b,
              region: "intent",
              type: "click",
              data: {}
            })) : m(e), a.returnValue = !1, a.preventDefault && a.preventDefault();
          }
        }
      }
      var f = /twitter\.com(\:\d{2,4})?\/intent\/(\w+)/, g = "scrollbars=yes,resizable=yes,toolbar=no,location=yes", h = 550, i = 520, j = screen.height, k = screen.width, l, p = (function(a, b) {
        this.id = a, this.element = this.originElement = b;
      }), r = (function(a) {
        this.originElement = [], this.element = a;
      });
      r.prototype = new c.Base, b.aug(r.prototype, {
        render: (function(a) {
          l = this, window.__twitterIntentHandler || (document.addEventListener ? document.addEventListener("click", q, !1) : document.attachEvent && document.attachEvent("onclick", q), window.__twitterIntentHandler = !0);
        })
      }), a({
        Listener: r
      });
    }));
  }));
  provide("lib/twt", (function(a) {
    a((function(a, b) {
      var c = a != "en" ? a + "." : "";
      using("$vendor/twt/dist/twt." + c + "min.js", (function() {
        twt.settings.lang = a, b(twt);
      }));
    }));
  }));
  provide("util/params", (function(a) {
    using("util/querystring", (function(b) {
      var c = (function(a) {
        var c = a.search.substr(1);
        return b.decode(c);
      }), d = (function(a) {
        var c = a.href, d = c.indexOf("#"), e = d < 0 ? "" : c.substring(d + 1);
        return b.decode(e);
      }), e = (function(a) {
        var b = {}, e = c(a), f = d(a);
        for (var g in e) e.hasOwnProperty(g) && (b[g] = e[g]);
        for (var g in f) f.hasOwnProperty(g) && (b[g] = f[g]);
        return b;
      });
      a({
        combined: e,
        fromQuery: c,
        fromFragment: d
      });
    }));
  }));
  provide("util/widgetrpc", (function(a) {
    using("util/params", (function(b) {
      function i() {
        if (!j()) return;
        var a = 0, b = parent.frames.length, e;
        if (d) return d;
        try {
          d = parent.frames[c];
          if (d) return d;
        } catch (f) {}
        for (; a < b; a++) try {
          e = parent.frames[a];
          if (e && typeof e.openIntent == "function") return d = e;
        } catch (f) {}
      }
      function j() {
        var a = 36e5;
        if (f !== undefined) return f;
        f = !1;
        var c = b.combined(document.location)._;
        return c ? /^\d+$/.test(c) && (f = +(new Date) - parseInt(c) < a) : f = !1, f;
      }
      function k(a, b, c) {
        l((function(d) {
          d.trigger("_resize", {
            width: b,
            height: c
          }, a);
        }));
      }
      function l() {
        var a = {};
        (typeof arguments[0]).toLowerCase() === "function" ? a.success = arguments[0] : a = arguments[0];
        var b = a.success || (function() {}), c = a.timeout || (function() {}), d = a.nohub || (function() {}), f = a.attempt !== undefined ? a.attempt : h;
        if (!j() || e) return d(), !1;
        var k = i();
        f--;
        try {
          if (k && k.trigger) {
            b(k);
            return;
          }
        } catch (m) {}
        if (f <= 0) {
          e = !0, c();
          return;
        }
        window.setTimeout((function() {
          l({
            success: b,
            timeout: c,
            nohub: d,
            attempt: f
          });
        }), g);
      }
      var c = "twttrHubFrame", d, e, f, g = 100, h = 20;
      a({
        resize: k,
        withHub: l,
        isDynamicWidget: j
      });
    }));
  }));
  provide("dom/cookie", (function(a) {
    using("util/util", (function(b) {
      a((function(a, c, d) {
        var e = b.aug({}, d);
        if (arguments.length > 1 && String(c) !== "[object Object]") {
          if (c === null || c === undefined) e.expires = -1;
          if (typeof e.expires == "number") {
            var f = e.expires, g = new Date((new Date).getTime() + f * 60 * 1e3);
            e.expires = g;
          }
          return c = String(c), document.cookie = [ encodeURIComponent(a), "=", e.raw ? c : encodeURIComponent(c), e.expires ? "; expires=" + e.expires.toUTCString() : "", e.path ? "; path=" + e.path : "", e.domain ? "; domain=" + e.domain : "", e.secure ? "; secure" : "" ].join("");
        }
        e = c || {};
        var h, i = e.raw ? (function(a) {
          return a;
        }) : decodeURIComponent;
        return (h = (new RegExp("(?:^|; )" + encodeURIComponent(a) + "=([^;]*)")).exec(document.cookie)) ? i(h[1]) : null;
      }));
    }));
  }));
  provide("util/donottrack", (function(a) {
    using("dom/cookie", (function(b) {
      a((function() {
        return b("dnt") ? !0 : document.navigator ? document.navigator["doNotTrack"] == 1 : navigator ? navigator["doNotTrack"] == 1 || navigator["msDoNotTrack"] == 1 : !1;
      }));
    }));
  }));
  provide("tfw/widget/guest_cookie", (function(a) {
    using("dom/cookie", "util/donottrack", (function(b, c) {
      function f() {
        if (c()) b(d) && b(d, null, {
          domain: ".twitter.com",
          path: "/"
        }); else if (!b(d)) {
          var a = "v1:", f = (+(new Date)).toString() + Math.round(Math.random() * 999999999);
          b(d, a + f, {
            domain: ".twitter.com",
            path: "/",
            expires: e
          });
        }
      }
      var d = "pid", e = 1051897;
      a({
        set: f,
        guest_id_cookie: d,
        default_expire: e
      });
    }));
  }));
  provide("tfw/widget/tracking", (function(a) {
    using("dom/cookie", "util/donottrack", "tfw/widget/guest_cookie", "util/widgetrpc", (function(b, c, d, e) {
      function i(a, b, c) {
        var d = f + b;
        if (!a) return;
        return a[d] = c, a;
      }
      function j(a, f, j, k, l) {
        k || (k = !1), l || (l = !1), j = j || "tweetbutton", j = h[j] || h.tweetbutton;
        var m = a.ownerDocument.createElement("img"), n = [];
        k || (i(f, "referrer", document.referrer.toString()), i(f, "widget", +e.isDynamicWidget()), !l && !c() ? (i(f, "li", +!!b("twid")), i(f, d.guest_id_cookie, b(d.guest_id_cookie) || "")) : i(f, "dnt", "1"));
        for (var o in f) if (f.hasOwnProperty(o)) {
          var p = encodeURIComponent(o), q = encodeURIComponent(f[o]);
          q = q.replace(/'/g, "%27"), n.push(p + "=" + q);
        }
        m.src = g + j + "?" + n.join("&"), m.alt = "", m.style.position = "absolute", m.style.height = "1px", m.style.width = "1px", m.style.top = "-9999px", m.style.left = "-9999px", a.appendChild(m);
      }
      var f = "twttr_", g = "//platform.twitter.com/widgets/images/", h = {
        tweetbutton: "t.gif",
        followbutton: "f.gif",
        tweetembed: "e.gif"
      };
      a({
        addPixel: j,
        addVar: i
      });
    }));
  }));
  provide("$vendor/qwery/qwery.js", (function(exports) {
    !(function(a, b) {
      function G(a) {
        k = [];
        for (d = 0, o = a.length; d < o; d++) k[d] = a[d];
        return k;
      }
      function M(a) {
        return a.match(F);
      }
      function N(a, b, c, e, f, g, h) {
        var j, k, l;
        if (b && this.tagName.toLowerCase() !== b) return !1;
        if (c && (j = c.match(v)) && j[1] !== this.id) return !1;
        if (c && (q = c.match(w))) for (d = q.length; d--; ) {
          k = q[d].slice(1);
          if (!(I.g(k) || I.s(k, new RegExp("(^|\\s+)" + k + "(\\s+|$)"))).test(this.className)) return !1;
        }
        if (e && !h) {
          i = this.attributes;
          for (l in i) if (Object.prototype.hasOwnProperty.call(i, l) && (i[l].name || l) == f) return this;
        }
        return e && !Q(g, this.getAttribute(f) || "", h) ? !1 : this;
      }
      function O(a) {
        var c = [], d = a.pop(), e = M(d), f = e[1] || "*", g, i, j, k = a.length && (h = a[0].match(x)) ? b.getElementById(h[1]) : b;
        if (!k) return c;
        j = k.getElementsByTagName(f);
        for (g = 0, i = j.length; g < i; g++) m = j[g], (r = N.apply(m, e)) && c.push(r);
        return c;
      }
      function P(a) {
        return J.g(a) || J.s(a, a.replace(/([.*+?\^=!:${}()|\[\]\/\\])/g, "\\$1"));
      }
      function Q(a, b, c) {
        switch (a) {
         case "=":
          return b == c;
         case "^=":
          return b.match(K.g("^=" + c) || K.s("^=" + c, new RegExp("^" + P(c))));
         case "$=":
          return b.match(K.g("$=" + c) || K.s("$=" + c, new RegExp(P(c) + "$")));
         case "*=":
          return b.match(K.g(c) || K.s(c, new RegExp(P(c))));
         case "~=":
          return b.match(K.g("~=" + c) || K.s("~=" + c, new RegExp("(?:^|\\s+)" + P(c) + "(?:\\s+|$)")));
         case "|=":
          return b.match(K.g("|=" + c) || K.s("|=" + c, new RegExp("^" + P(c) + "(-|$)")));
        }
        return !1;
      }
      function R(a) {
        var b = [], c = [], d, g, h = L.g(a) || L.s(a, a.split(C));
        h = h.slice(0);
        if (!h.length) return b;
        b = O(h);
        if (!h.length) return b;
        for (e = 0, g = b.length, f = 0; e < g; e++) {
          n = b[e], j = n;
          for (d = h.length; d--; ) i : while (j !== B && (j = j.parentNode)) if (p = N.apply(j, M(h[d]))) break i;
          p && (c[f++] = n);
        }
        return c;
      }
      function T(a, c, d) {
        var e = typeof c == "string" ? d(c)[0] : c || b;
        return U(a) ? !c || U(e) && S(a, e) ? [ a ] : [] : a && typeof a == "object" && a.length && isFinite(a.length) ? G(a) : (h = a.match(x)) ? (m = b.getElementById(h[1])) ? [ m ] : [] : (h = a.match(z)) ? G(e.getElementsByTagName(h[1])) : !1;
      }
      function U(a) {
        return a === window || a && a.nodeType && a.nodeType.toString().match(/[19]/);
      }
      function V(a, c) {
        var d = typeof c == "string" ? V(c)[0] : c || b;
        return d ? (h = T(a, c, V)) ? h : b.getElementsByClassName && (h = a.match(y)) ? G(d.getElementsByClassName(h[1])) : G(d.querySelectorAll(a)) : [];
      }
      function W(a) {
        var b = [], c, d;
        e : for (c = 0; c < a.length; c++) {
          for (d = 0; d < b.length; d++) if (b[d] == a[c]) continue e;
          b[b.length] = a[c];
        }
        return b;
      }
      var c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v = /#([\w\-]+)/, w = /\.[\w\-]+/g, x = /^#([\w\-]+$)/, y = /^\.([\w\-]+)$/, z = /^([\w\-]+)$/, A = /^([\w]+)?\.([\w\-]+)$/, B = b.documentElement, C = /\s(?![\s\w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^'"]*\])/, D = /^([a-z0-9]+)?(?:([\.\#]+[\w\-\.#]+)?)/, E = /\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\]/, F = new RegExp(D.source + "(" + E.source + ")?"), H = (function() {
        this.c = {};
      });
      H.prototype = {
        g: (function(a) {
          return this.c[a] || undefined;
        }),
        s: (function(a, b) {
          return this.c[a] = b, b;
        })
      };
      var I = new H, J = new H, K = new H, L = new H, S = "compareDocumentPosition" in B ? (function(a, b) {
        return (b.compareDocumentPosition(a) & 16) == 16;
      }) : "contains" in B ? (function(a, b) {
        return b !== a && b.contains(a);
      }) : (function(a, b) {
        while (a = a.parentNode) if (a === b) return 1;
        return 0;
      }), X = (function() {
        return b.querySelector && b.querySelectorAll ? V : (function(a, c) {
          var d = typeof c == "string" ? X(c)[0] : c || b;
          if (!d) return [];
          var f, g, i = [], j = [], l;
          if (h = T(a, c, X)) return h;
          if (h = a.match(A)) {
            s = d.getElementsByTagName(h[1] || "*"), k = I.g(h[2]) || I.s(h[2], new RegExp("(^|\\s+)" + h[2] + "(\\s+|$)"));
            for (f = 0, g = s.length, e = 0; f < g; f++) k.test(s[f].className) && (i[e++] = s[f]);
            return i;
          }
          for (f = 0, s = a.split(","), g = s.length; f < g; f++) j[f] = R(s[f]);
          for (f = 0, g = j.length; f < g && (u = j[f]); f++) {
            var m = u;
            if (d !== b) {
              m = [];
              for (e = 0, h = u.length; e < h && (l = u[e]); e++) S(l, d) && m.push(l);
            }
            i = i.concat(m);
          }
          return W(i);
        });
      })(), Y = a.qwery;
      X.noConflict = (function() {
        return a.qwery = Y, this;
      }), a.qwery = X;
    })(this, document);
    exports();
    loadrunner.Script.loaded.push("$vendor/qwery/qwery.js");
  }));
  provide("lib/qwery", (function(a) {
    using("$vendor/qwery/qwery.js", (function() {
      a(qwery);
    }));
  }));
  provide("util/qweryutil", (function(a) {
    using("lib/qwery", (function(b) {
      function c(a, c, d, e) {
        var f = b(a, c);
        if (f.length) {
          f = f[0];
          if (d) switch (d) {
           case "textContent":
            return f.textContent || f.innerText || e || !1;
           case "innerHTML":
            return f.innerHTML;
           default:
            return f.getAttribute(d);
          }
          return f;
        }
        return e || !1;
      }
      a({
        qwery: b,
        qwprop: c
      });
    }));
  }));
  provide("util/tweetparser", (function(a) {
    using("util/qweryutil", (function(b) {
      function g(a) {
        return a && c.test(a) && RegExp.$1;
      }
      function h(a) {
        if (!a || !a.nodeName || !/blockquote/i.test(a.nodeName)) return;
        var c = {}, d = b.qwery("p", a).shift(), e = b.qwery("a", a).pop();
        return d && (c.text = d.textContent || d.innerText || "", c.rendered_text = d.innerHTML || ""), e && (e.getAttribute("data-datetime") ? c.created_at = e.getAttribute("data-datetime") : c.time = e.textContent || e.innerText), c.user = i(a), c.id = c.id_str = g(e.href), c.id_str && c.text && c.user && c;
      }
      function i(a) {
        var c = {}, d = 0, g = a.childNodes.length, h, i;
        for (; d < g; d++) {
          h = a.childNodes[d];
          if (h.nodeType === 3 && e.test(h.nodeValue) || h.nodeType === 1 && /^[p]$/i.test(h.nodeName) && e.test(h.innerText)) {
            c.name = RegExp.$1.split(" ").slice(1).join(" "), c.screen_name = RegExp.$2;
            break;
          }
        }
        if (c.screen_name) return c;
        i = b.qwery("a", a).pop();
        if (f.test(i.href)) return c.name = "", c.screen_name = RegExp.$2, c;
      }
      var c = /\/(\d+)\/?$/, d = /^https?:\/\/(?:www\.)?twitter\.com\/(?:#!\/)?[\w_]+\/status(?:es)?\/(\d+)\/?/, e = /^\s*(.+)\s+\(@([\w_]{1,20})\)\s*$/, f = /^https?:\/\/(?:www\.)?twitter\.com\/(#!\/)?([\w_]{1,20})/;
      a({
        parseTweet: h,
        parseId: g,
        parseAuthor: i
      });
    }));
  }));
  provide("i18n/i18n", (function(a) {
    function b() {
      twttr.i18n_missing_interval || (twttr.i18n_missing_interval = window.setInterval((function() {
        twttr.i18n_missing && twttr.i18n_missing.length > 0 && ($.ajax({
          type: "POST",
          data: $.param({
            authenticity_token: twttr.form_authenticity_token,
            location: window.location.href,
            "strings[]": twttr.i18n_missing
          }),
          url: "/translate/untranslated_javascript"
        }), twttr.i18n_missing = new Array);
      }), 1e4));
    }
    function c(a) {
      twttr.i18n_missing || (twttr.i18n_missing = new Array), twttr.i18n_missing_reported || (twttr.i18n_missing_reported = {}), twttr.i18n_missing_reported[a] || (twttr.i18n_missing.push(encodeURIComponent(a)), twttr.i18n_missing_reported[a] = !0);
    }
    function d(a, b) {
      if (b) for (var c in b) a = a.replace(new RegExp("\\%\\{" + c + "\\}", "gi"), b[c]);
      return a;
    }
    window.setupTranslationCallback = b, a({
      _: (function(a, b) {
        if (twttr.i18n) {
          var e = twttr.i18n[a];
          e ? a = e : c(a);
        }
        return d(a, b);
      }),
      setupTranslationCallback: b
    });
  }));
  provide("tfw/data", (function(a) {
    using("util/querystring", (function(b) {
      window.twttr = window.twttr || {}, window.twttr.tfw = window.twttr.tfw || {}, window.twttr.tfw.callbacks = window.twttr.tfw.callbacks || {};
      var c = "twttr.tfw.callbacks", d = twttr.tfw.callbacks, e = "cb", f = 0, g = !1, h = (function(a, b) {
        return a == {}.toString.call(b).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
      }), i = (function(a) {
        return (function(b) {
          b.error ? a.error && a.error(b) : a.success && a.success(b), a.complete && a.complete(b), j(a);
        });
      }), j = (function(a) {
        var b = a.script;
        b && (b.onload = b.onreadystatechange = null, b.parentNode && b.parentNode.removeChild(b), a.script = undefined, b = undefined), a.callbackName && twttr.tfw.callbacks[a.callbackName] && delete twttr.tfw.callbacks[a.callbackName];
      }), k = (function(a) {
        var b = {};
        return a.success && h("function", a.success) && (b.success = a.success), a.error && h("function", a.error) && (b.error = a.error), a.complete && h("function", a.complete) && (b.complete = a.complete), b;
      }), l = (function(a, h) {
        g && (a = a.replace(/^\/\//, "https://"));
        var j = e + f, k = c + "." + j;
        d[j] = i(h);
        var l = document.createElement("script"), m = {
          callback: k,
          suppress_response_codes: !0
        };
        l.src = b.url(a, m), l.async = "async";
        var n = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
        n.appendChild(l), h.script = l, h.callbackName = j, f++;
      }), m = (function(a, b, c) {
        var d = a.length, e = [], f = {}, g = 0;
        return (function(e) {
          var h;
          h = c(e), f[h] = e;
          if (++g === d) {
            var i = [], j = [], k = [];
            for (var l = 0; l < d; l++) {
              var e = f[a[l]];
              i.push(e), e.error ? k.push(e) : j.push(e);
            }
            b.error && k.length > 0 && b.error(k), b.success && j.length > 0 && b.success(j), b.complete && b.complete(i);
          }
        });
      }), n = {};
      n.config = (function(a) {
        if (a.forceSSL === !0 || a.forceSSL === !1) g = a.forceSSL;
      }), n.user = (function() {
        var a = "//api.twitter.com/1/users/lookup.json", c = "//cdn.api.twitter.com/1/users/show.json";
        return (function() {
          var d, e = {};
          arguments.length === 1 ? (d = arguments[0].screenName, e = k(arguments[0])) : (d = arguments[0], e.success = arguments[1]);
          var f = h("array", d) ? a : c;
          d = h("array", d) ? d.join(",") : d;
          var g = {
            screen_name: d
          }, i = b.url(f, g);
          l(i, e);
        });
      })(), n.status = (function() {
        var a = "//cdn.api.twitter.com/1/statuses/show.json";
        return (function() {
          var c, d = {};
          arguments.length === 1 ? (c = arguments[0].id, d = k(arguments[0])) : (c = arguments[0], d.success = arguments[1]);
          if (!h("array", c)) {
            var e = {
              id: c,
              include_entities: !0
            }, f = b.url(a, e);
            l(f, d);
          } else {
            var g = m(c, d, (function(a) {
              var b;
              return a.error ? b = a.request.split("id=")[1].split("&")[0] : b = a.id_str, b;
            }));
            for (var i = 0; i < c.length; i++) {
              var e = {
                id: c[i],
                include_entities: !0
              }, f = b.url(a, e);
              l(f, {
                success: g,
                error: g
              });
            }
          }
        });
      })(), n.tweet = n.status, n.count = (function() {
        var a = "//cdn.api.twitter.com/1/urls/count.json";
        return (function() {
          var c = "", d = {};
          arguments.length === 1 ? (c = arguments[0].url, d = k(arguments[0])) : arguments.length === 2 && (c = arguments[0], d.success = arguments[1]);
          var e = {
            url: c
          }, f = b.url(a, e);
          l(f, d);
        });
      })(), n.friendshipExists = (function() {
        var a = "//cdn.api.twitter.com/1/friendships/exists.json";
        return (function(c) {
          var d = arguments[0], e = k(arguments[0]), f = {
            screen_name_a: c.screenNameA,
            screen_name_b: c.screenNameB
          }, g = b.url(a, f);
          l(g, e);
        });
      })(), a(n);
    }));
  }));
  provide("util/insert", (function(a) {
    a((function(a, b) {
      if (b) {
        if (!b.parentNode) return b;
        b.parentNode.replaceChild(a, b), delete b;
      } else document.body.insertBefore(a, document.body.firstChild);
      return a;
    }));
  }));
  provide("tfw/widget/tweet", (function(a) {
    using("util/util", "tfw/widget/base", "util/querystring", "util/uri", (function(b, c, d, e) {
      var f = document.title, g = encodeURI(location.href), h = (function(a) {
        this.originElement = a, this.id = this.generateId(), this.version = this.wjsVersion();
        var b = this.params(), c = b.count || a.getAttribute("data-count"), d = b.size || a.getAttribute("data-size"), h = e.getScreenNameFromPage();
        this.setLanguage(), ~a.className.indexOf("twitter-hashtag-button") ? this.type = "hashtag" : ~a.className.indexOf("twitter-mention-button") && (this.type = "mention"), this.text = b.text || a.getAttribute("data-text"), this.align = b.align || a.getAttribute("data-align") || "", this.via = b.via || a.getAttribute("data-via"), this.related = b.related || a.getAttribute("data-related"), this.counturl = b.counturl || a.getAttribute("data-counturl"), this.searchlink = b.searchlink || a.getAttribute("data-searchlink"), this.placeid = b.placeid || a.getAttribute("data-placeid"), this.hashtags = b.hashtags || a.getAttribute("data-hashtags"), this.screen_name = b.screen_name || a.getAttribute("data-button-screen-name"), this.button_hashtag = b.button_hashtag || a.getAttribute("data-button-hashtag"), this.url = b.url || a.getAttribute("data-url"), this.size = d == "large" ? "l" : "m", this.dnt = b.dnt || a.getAttribute("data-dnt") || "", this.enableNewSizing = b.enableNewSizing || a.getAttribute("data-enable-new-sizing"), this.enableNewSizing = this.enableNewSizing || !this.langDimensions[this.lang] || this.size != "m" || !!this.type, this.type ? (this.count = "none", h && (this.related = this.related ? h + "," + this.related : h)) : (this.text = this.text || f, this.url = this.url || e.getCanonicalURL() || g, this.count = this.supportCount[c] ? c : "horizontal", this.count = this.count == "vertical" && this.size == "l" ? "none" : this.count, this.via = this.via || h);
      });
      h.prototype = new c.Base, b.aug(h.prototype, {
        supportCount: {
          vertical: 1,
          horizontal: 1,
          none: 1
        },
        titles: {
          en: "Twitter Tweet Button"
        },
        langDimensions: {
          en: {
            vertical: 55,
            horizontal: 110,
            none: 55
          },
          de: {
            vertical: 67,
            horizontal: 122,
            none: 67
          },
          es: {
            vertical: 64,
            horizontal: 118,
            none: 64
          },
          fr: {
            vertical: 65,
            horizontal: 118,
            none: 65
          },
          id: {
            vertical: 55,
            horizontal: 110,
            none: 55
          },
          it: {
            vertical: 55,
            horizontal: 110,
            none: 55
          },
          ko: {
            vertical: 55,
            horizontal: 110,
            none: 55
          },
          ja: {
            vertical: 80,
            horizontal: 130,
            none: 80
          },
          nl: {
            vertical: 55,
            horizontal: 110,
            none: 55
          },
          pt: {
            vertical: 66,
            horizontal: 120,
            none: 66
          },
          ru: {
            vertical: 68,
            horizontal: 120,
            none: 68
          },
          tr: {
            vertical: 66,
            horizontal: 120,
            none: 66
          }
        },
        dimensions: {
          x: {
            m: {
              normal: 85,
              horizontal: 130
            },
            l: {
              normal: 104,
              horizontal: 162
            }
          },
          y: {
            m: {
              normal: 20,
              vertical: 62
            },
            l: {
              normal: 28,
              vertical: 28
            }
          }
        },
        parameters: (function() {
          var a = {
            text: this.text,
            url: this.url,
            via: this.via,
            related: this.related,
            count: this.count,
            lang: this.lang,
            counturl: this.counturl,
            searchlink: this.searchlink,
            placeid: this.placeid,
            original_referer: location.href,
            id: this.id,
            size: this.size,
            type: this.type,
            screen_name: this.screen_name,
            button_hashtag: this.button_hashtag,
            hashtags: this.hashtags,
            align: this.align,
            dnt: this.dnt,
            enableNewSizing: !!this.enableNewSizing,
            _: +(new Date),
            _version: this.version
          };
          return b.compact(a), d.encode(a);
        }),
        render: (function(a) {
          var b = a.assetUrl() + "/widgets/tweet_button.1326407570.html#" + this.parameters(), c = this.enableNewSizing ? this.dimensions.x[this.size]["horizontal" == this.count ? "horizontal" : "normal"] : this.langDimensions[this.lang][this.count], d = this.dimensions.y[this.size]["vertical" == this.count ? "vertical" : "normal"], e = this.titles.en, f = this;
          this.originElement.className += this.count ? " twitter-count-" + this.count : "", this.element = this.create(b, this.originElement.className, [ this.enableNewSizing ? 1 : c, d ], {
            title: e
          }), window.setTimeout((function() {
            f.element.getAttribute("data-resized") || (f.element.style.width = c + (typeof c != "string" ? "px" : ""));
          }), 15e3);
        })
      }), a({
        Embeddable: h
      });
    }));
  }));
  provide("tfw/widget/tweetembed", (function(a) {
    using("util/util", "tfw/widget/base", "tfw/widget/tweet", "util/uri", "util/insert", "tfw/data", "i18n/i18n", "util/params", "util/qweryutil", "util/tweetparser", "tfw/widget/tracking", (function(b, c, d, e, f, g, h, i, j, k, l) {
      function s(a) {
        var b = document.createElement("link");
        b.rel = "stylesheet", b.type = "text/css", b.href = twttr.widgets.config.assetUrl() + "/" + a, document.getElementsByTagName("head")[0].appendChild(b);
      }
      function t() {
        if (o) return;
        s("embed/embed.css"), o = !0;
      }
      function u(a, b) {
        var c = {};
        c.status_id = a.id_str, c.context = q, l.addVar(c, "variant", m), l.addVar(c, "referrer", document.location.href), l.addPixel(document.body, c, "tweetembed", !0), b && a._wjs_reply && (c.status_id = a._wjs_reply.id_str, c.context = r, l.addPixel(document.body, c, "tweetembed", !0));
      }
      var m = "1.0", n = i.fromQuery(document.location), o, p = /^([0-9]+)( ?px)?$/, q = "subject", r = "thread", v = (function(a) {
        var c, d, e = a.getAttribute("width") || "";
        this.originElement = a, this.id = this.generateId(), c = this.params(), this.setLanguage(), this.related = c.related || a.getAttribute("data-related"), this.partner = c.partner || a.getAttribute("data-partner"), this.classNames = b.filter(a.className.split(" "), (function(a) {
          return a != "twitter-tweet";
        })), this.classNames.push([ "twitter-tweet-rendered" ]), this.styleAttr = [], this.styleAttr.push(a.getAttribute("style") || ""), p.test(e) ? this.width = RegExp.$1 : a.className.match(/(?:\b|^)tw-align-[lr]/i) && (this.width = "350"), this.width && this.styleAttr.push("width:" + this.width + "px!important"), this.showThread = !~b.indexOf(this.classNames, "tw-hide-thread"), this.showMedia = !~b.indexOf(this.classNames, "tw-hide-media"), this.data = k.parseTweet(this.originElement), this.inReplyTo = a.getAttribute("data-in-reply-to") || "";
      });
      v.prototype = new c.Base, b.aug(v.prototype, {
        create: (function(a, b) {
          var c = this, d, e = !!a._wjs_stub_data;
          return !e && u(a, c.showThread), using("lib/twt", (function(g) {
            g(c.lang, (function(g) {
              var h = document.createElement("div"), i = g.autoFormat(c.width || c.element), j = g(a, {
                format: i,
                popupWebIntents: !1,
                tweetElement: "blockquote",
                showMedia: c.showMedia,
                showErrors: !1,
                showFollowButton: !e,
                renderActions: !e,
                product: "tweetembed",
                partner: c.partner,
                related: c.related
              }), k = '<div id="{{id}}" class="{{classNames}}" lang="{{lang}}" style="{{style}}">{{twt}}</div>', l = {
                id: c.id,
                classNames: b || "",
                style: c.styleAttr.join(";"),
                lang: c.lang,
                twt: c.data._wjs_reply ? j.inReplyTo(a._wjs_reply).html() : j.html()
              };
              h.innerHTML = c.ringo(k, l), d = f(h.firstChild, c.element);
            }));
          })), d;
        }),
        render: (function(a) {
          var b = this, c, d;
          if (!b.data) return;
          t(), using("lib/twt", (function(a) {
            a(b.lang, (function() {
              c = b.classNames.join(" "), b.data._wjs_stub_data = !0, b.element = b.originElement, b.element = b.create(b.data, c), d = [ b.data.id_str ], b.inReplyTo && b.showThread && d.push(b.inReplyTo), g.status({
                id: d,
                complete: (function(a) {
                  var d = a[0], e = a[1];
                  if (d.error) return;
                  b.data = d;
                  if (b.showThread && d.in_reply_to_status_id_str && (!e || d.in_reply_to_status_id_str != e.id_str)) {
                    g.status({
                      id: d.in_reply_to_status_id_str,
                      complete: (function(a) {
                        a && !a.error && (b.data._wjs_reply = a), b.element = b.create(b.data, c);
                      })
                    });
                    return;
                  }
                  d.in_reply_to_status_id_str && e && !e.error && (b.data._wjs_reply = e), b.element = b.create(b.data, c);
                })
              });
            }));
          }));
        })
      }), a({
        Embeddable: v
      });
    }));
  }));
  provide("tfw/widget/follow", (function(a) {
    using("util/util", "tfw/widget/base", "util/querystring", "util/uri", (function(b, c, d, e) {
      var f = (function(a) {
        this.originElement = a;
        var b = this.params(), c = b.size || a.getAttribute("data-size");
        this.id = this.generateId(), this.version = this.wjsVersion(), this.setLanguage(), this.showScreenName = b.show_screen_name || a.getAttribute("data-show-screen-name") || "", this.showCount = b.show_count || a.getAttribute("data-show-count") || "", this.width = b.width || a.getAttribute("data-width") || "", this.screenName = this.screenNameFromHref(), this.preview = b.preview || a.getAttribute("data-preview") || "", this.align = b.align || a.getAttribute("data-align") || "", this.dnt = b.dnt || a.getAttribute("data-dnt") || "", this.size = c == "large" ? "l" : "m", this.enableNewSizing = b.enableNewSizing || a.getAttribute("data-enable-new-sizing");
      });
      f.prototype = new c.Base, b.aug(f.prototype, {
        titles: {
          en: "Twitter Follow Button"
        },
        dimensions: {
          x: {
            m: 300,
            l: 350
          },
          y: {
            m: 20,
            l: 28
          }
        },
        parameters: (function() {
          var a = {
            screen_name: this.screenName,
            lang: this.lang,
            show_count: this.showCount,
            show_screen_name: this.showScreenName,
            align: this.align,
            id: this.id,
            preview: this.preview,
            size: this.size,
            dnt: this.dnt,
            enableNewSizing: !!this.enableNewSizing,
            _: +(new Date),
            _version: this.version
          };
          return b.compact(a), d.encode(a);
        }),
        screenNameFromHref: (function() {
          var a = this.originElement.href, b;
          if (b = a.match(c.TWITTER_PROFILE_URL)) return b[1];
        }),
        render: (function(a) {
          if (!this.screenName) return;
          var b = a.assetUrl() + "/widgets/follow_button.1326407570.html#" + this.parameters(), c = this.width || this.dimensions.x[this.size], d = this.dimensions.y[this.size], e = this.titles.en, f = this;
          this.element = this.create(b, "twitter-follow-button", [ this.enableNewSizing ? 1 : c, d ], {
            title: e
          }), window.setTimeout((function() {
            f.element.getAttribute("data-resized") || (f.element.style.width = c + (typeof c != "string" ? "px" : ""));
          }), 15e3);
        })
      }), a({
        Embeddable: f
      });
    }));
  }));
  ((function() {
    window.twttr = window.twttr || {};
    if (twttr.widgets) return twttr.widgets.loaded && twttr.widgets.load(), !1;
    if (twttr.init) return !1;
    twttr.init = !0, (function() {
      twttr._e = twttr._e || [], twttr.ready = twttr.ready || (function(a) {
        twttr.widgets && twttr.widgets.loaded ? a(twttr) : twttr._e.push(a);
      });
    })(), twttr.host = twttr.host || "platform.twitter.com", using.path.length === 0 && (using.path = "//" + twttr.host + "/js"), typeof twttr.ignoreSSL == "undefined" && (twttr.ignoreSSL = !1);
    var a = [];
    twttr.events = {
      bind: (function(b, c) {
        return a.push([ b, c ]);
      })
    }, using("util/domready", (function(b) {
      b((function() {
        using("util/util", "tfw/widget/follow", "tfw/widget/tweet", "tfw/widget/tweetembed", "tfw/widget/intent", "util/events", "tfw/widget/base", (function(b, c, d, e, f, g, h) {
          function j(a) {
            return (window.location.protocol.match(/s\:$/) || a) && !twttr.ignoreSSL ? "https" : "http";
          }
          var i = {};
          i.widgets = {
            "a.twitter-share-button": d.Embeddable,
            "a.twitter-mention-button": d.Embeddable,
            "a.twitter-hashtag-button": d.Embeddable,
            "a.twitter-follow-button": c.Embeddable,
            "blockquote.twitter-tweet": e.Embeddable,
            body: f.Listener
          }, i.assetUrl = (function(a) {
            return j(a) + "://" + twttr.host;
          }), using("xd/parent", "xd/jsonrpc", (function(a, b) {
            var c = "twttrHubFrame", d = i.assetUrl() + "/widgets/hub.1326407570.html";
            if (window.location && window.location.href.match(/LinkedIn\.app/)) return !1;
            if (document.getElementById(c)) return;
            twttr.events.hub = a.connect({
              src: d,
              iframe: {
                name: c,
                style: "position:absolute;top:-9999em;width:10px;height:10px"
              }
            }), b(twttr.events.hub).expose({
              trigger: (function(a, b, c) {
                b = b || {};
                var d = b.region;
                delete b.region, twttr.events.trigger(a, {
                  target: h.find(c),
                  data: b,
                  region: d,
                  type: a
                });
              })
            });
          }));
          var k = twttr.events && twttr.events.hub ? twttr.events : {};
          twttr.events = b.aug(k, g.Emitter), twttr.events.bind("_resize", (function(a) {
            a.target && a.target.style && (a.target.style.width = a.data.width + "px", a.target.style.height = a.data.height + "px", a.target.setAttribute("data-resized", "true"));
          })), twttr.widgets = {
            load: (function() {
              h.init(i), h.embed(), twttr.widgets.loaded = !0;
            }),
            config: i
          };
          var l, m;
          for (l = 0; m = a[l]; l++) twttr.events.bind(m[0], m[1]);
          for (l = 0; m = twttr._e[l]; l++) m(twttr);
          twttr.ready = (function(a) {
            a(twttr);
          }), twttr.widgets.load();
        }));
      }));
    }));
  }))();
}));
