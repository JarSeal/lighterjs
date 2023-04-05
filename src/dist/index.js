var C = Object.defineProperty;
var x = (n, t, e) => t in n ? C(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : n[t] = e;
var o = (n, t, e) => (x(n, typeof t != "symbol" ? t + "" : t, e), e);
let R;
const _ = new Uint8Array(16);
function P() {
  if (!R && (R = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !R))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return R(_);
}
const u = [];
for (let n = 0; n < 256; ++n)
  u.push((n + 256).toString(16).slice(1));
function D(n, t = 0) {
  return (u[n[t + 0]] + u[n[t + 1]] + u[n[t + 2]] + u[n[t + 3]] + "-" + u[n[t + 4]] + u[n[t + 5]] + "-" + u[n[t + 6]] + u[n[t + 7]] + "-" + u[n[t + 8]] + u[n[t + 9]] + "-" + u[n[t + 10]] + u[n[t + 11]] + u[n[t + 12]] + u[n[t + 13]] + u[n[t + 14]] + u[n[t + 15]]).toLowerCase();
}
const E = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), S = {
  randomUUID: E
};
function I(n, t, e) {
  if (S.randomUUID && !t && !n)
    return S.randomUUID();
  n = n || {};
  const s = n.random || (n.rng || P)();
  if (s[6] = s[6] & 15 | 64, s[8] = s[8] & 63 | 128, t) {
    e = e || 0;
    for (let r = 0; r < 16; ++r)
      t[e + r] = s[r];
    return t;
  }
  return D(s);
}
class T {
  constructor(t) {
    this.keyPrefix = t || "", this.localStorageAvailable = this._lsTest();
  }
  getItem(t, e) {
    return this.localStorageAvailable && this.checkIfItemExists(t) ? localStorage.getItem(this.keyPrefix + t) : e || null;
  }
  checkIfItemExists(t) {
    return this.localStorageAvailable ? Object.prototype.hasOwnProperty.call(localStorage, this.keyPrefix + t) : !1;
  }
  setItem(t, e) {
    return this.localStorageAvailable ? (localStorage.setItem(this.keyPrefix + t, e), !0) : !1;
  }
  removeItem(t) {
    return this.localStorageAvailable ? (this.checkIfItemExists(t) && localStorage.removeItem(this.keyPrefix + t), !0) : !1;
  }
  convertValue(t, e) {
    return typeof t == "boolean" ? e === "true" : typeof t == "number" ? Number(e) : e;
  }
  _lsTest() {
    const t = this.keyPrefix + "testLSAvailability";
    try {
      return localStorage.setItem(t, t), localStorage.removeItem(t), !0;
    } catch {
      return !1;
    }
  }
}
class j {
  constructor(t) {
    this.keyPrefix = t || "", this.sessionStorageAvailable = this._lsTest();
  }
  getItem(t, e) {
    return this.sessionStorageAvailable && this.checkIfItemExists(t) ? sessionStorage.getItem(this.keyPrefix + t) : e || null;
  }
  checkIfItemExists(t) {
    return this.sessionStorageAvailable ? Object.prototype.hasOwnProperty.call(sessionStorage, this.keyPrefix + t) : !1;
  }
  setItem(t, e) {
    return this.sessionStorageAvailable ? (sessionStorage.setItem(this.keyPrefix + t, e), !0) : !1;
  }
  removeItem(t) {
    return this.sessionStorageAvailable ? (this.checkIfItemExists(t) && sessionStorage.removeItem(this.keyPrefix + t), !0) : !1;
  }
  convertValue(t, e) {
    return typeof t == "boolean" ? e === "true" : typeof t == "number" ? Number(e) : e;
  }
  _lsTest() {
    const t = this.keyPrefix + "testSSAvailability";
    try {
      return sessionStorage.setItem(t, t), sessionStorage.removeItem(t), !0;
    } catch {
      return !1;
    }
  }
}
class v {
  constructor(t, e, s) {
    o(this, "setCallback", (t) => this.callback = t);
    this.prefix = t || "", this.callback = e, this.showLogs = !0, this.showErrors = !0, this.showWarnings = !0, s && this.turnOff();
  }
  log(...t) {
    this.callback && this.callback("log", ...t), this.showLogs && console.log(this.prefix, ...t);
  }
  error(...t) {
    this.callback && this.callback("error", ...t), this.showErrors && console.error(this.prefix, ...t);
  }
  warn(...t) {
    this.callback && this.callback("warning", ...t), this.showWarnings && console.warn(this.prefix, ...t);
  }
  turnOff() {
    this.showLogs = !1, this.showErrors = !1, this.showWarnings = !1;
  }
  turnOn() {
    this.showLogs = !0, this.showErrors = !0, this.showWarnings = !0;
  }
}
const H = () => I();
let b = !1;
const c = new v("LIGHTER.js ROUTER *****");
class U {
  constructor(t, e, s, r) {
    o(this, "initRouter", async (t, e) => {
      this.setRoute();
      let s = !1;
      if (this.curRoute.length < this.basePath.length && (this.curRoute = this.basePath + "/", s = !0), !t) {
        this.notFound();
        return;
      }
      for (let i = 0; i < t.length; i++) {
        if (!t[i].route) {
          const a = `Route '${t[i].id}' is missing the route attribute.`;
          throw c.error(a), new Error(a);
        }
        if (t[i].route = this.basePath + t[i].route, t[i].redirect) {
          if (t[i].redirect = this.basePath + t[i].redirect, t[i].redirect === t[i].route) {
            const a = `Route's redirect cannot be the same as the route '${t[i].route}'.`;
            throw c.error(a), new Error(a);
          }
          this._compareRoutes(t[i].route, this.curRoute) && (this.curRoute = t[i].redirect, s = !0);
        }
        if (this._compareRoutes(t[i].route, this.curRoute, !0) && t[i].beforeDraw) {
          const a = await t[i].beforeDraw({
            route: t[i],
            curRouteData: this.curRouteData,
            curRoute: this.curRoute,
            basePath: this.basePath,
            commonData: this.commonData,
            prevRouteData: null,
            prevRoute: null
          });
          a && (this.curRoute = this.basePath + a, s = !0);
        }
      }
      let r = !1;
      for (let i = 0; i < t.length; i++) {
        if (t[i].redirect) {
          this.routes.push(t[i]);
          continue;
        }
        if (!t[i].id) {
          const a = "Route is missing the id attribute.";
          throw c.error(a), new Error(a);
        }
        if (this.langFn && (t[i].titleKey ? t[i].title = this.langFn(t[i].titleKey) : c.warn(
          `Router has a langFn defined, but route '${t[i].id}' is missing the titleKey.`
        )), t[i].title || (c.warn(`Route '${t[i].id}' is missing the title. Setting id as title.`), t[i].title = t[i].id), t[i].attachId = e, this.routes.push(t[i]), this._compareRoutes(t[i].route, this.curRoute) && !this.curRoute.includes(":") && (t[i].attachId = e, this._createNewView(t[i]), r = !0, this.curRouteData = t[i], document.title = this._createPageTitle(t[i].title)), !r) {
          const a = this._getRouteParams(this.routes[i].route, this.curRoute);
          a && (t[i].attachId = e, this._createNewView(t[i]), r = !0, this.curRouteData = t[i], this.curRouteData.params = a, document.title = this._createPageTitle(t[i].title));
        }
      }
      if (r || this.notFound(), window.onpopstate = this.routeChangeListener, s) {
        const i = this._createRouteState();
        window.history.pushState(i, "", this.curRoute), this.curHistoryState = i;
      }
      b = !0;
    });
    o(this, "routeChangeListener", (t) => {
      this.setRoute(), this.changeRoute(this.curRoute, {
        forceUpdate: !0,
        ignoreBasePath: !0,
        doNotSetState: !0
      }), this.curHistoryState = t.state || {};
    });
    o(this, "_createPageTitle", (t) => this.titlePrefix + t + this.titleSuffix);
    o(this, "_createRouteState", () => {
      const t = Object.assign({}, this.nextHistoryState);
      return this.nextHistoryState = {}, this.curHistoryState = {}, t;
    });
    o(this, "replaceRoute", (t, e) => {
      let s = this.basePath;
      e && (s = ""), t = s + t;
      const r = this._createRouteState();
      window.history.replaceState(r, "", t);
    });
    o(this, "setNextHistoryState", (t) => {
      this.nextHistoryState = Object.assign(this.nextHistoryState, t);
    });
    o(this, "setCurHistoryState", (t) => {
      this.curHistoryState = Object.assign(this.curHistoryState, t), window.history.replaceState(this.curHistoryState, "");
    });
    o(this, "getCurHistoryState", () => this.curHistoryState);
    // Options: Object
    // - forceUpdate: Boolean
    // - ignoreBasePath: Boolean
    // - doNotSetState: Boolean
    // - replaceState: Boolean (if true, doNotSetState is also true, so no need to declare it)
    o(this, "changeRoute", async (t, e) => {
      e || (e = {});
      const s = e.forceUpdate, r = e.ignoreBasePath, i = e.doNotSetState, a = e.replaceState;
      let h = this.basePath;
      r && (h = ""), t = h + t;
      let d;
      for (let l = 0; l < this.routes.length; l++)
        if (this._compareRoutes(this.routes[l].route, t, !0) && this.routes[l].beforeDraw) {
          d = await this.routes[l].beforeDraw({
            route: this.routes[l],
            curRouteData: this.curRouteData,
            curRoute: this.curRoute,
            basePath: this.basePath,
            commonData: this.commonData,
            prevRouteData: this.prevRouteData,
            prevRoute: this.prevRouteData
          }), d && (t = h + d);
          break;
        }
      for (let l = 0; l < this.routes.length; l++)
        if (this.routes[l].redirect && this._compareRoutes(this.routes[l].route, t)) {
          t = this.routes[l].redirect;
          break;
        }
      if (this._compareRoutes(t, this.curRoute) && !s)
        return;
      if (s && (this.curRouteData.component.discard(!0), this.curRouteData.component = null), !i && !a) {
        const l = this._createRouteState();
        window.history.pushState(l, "", t);
      } else
        a && this.replaceRoute(t, !0);
      this.prevRoute = this.curRoute, this.setRoute();
      let p = !1;
      for (let l = 0; l < this.routes.length; l++) {
        if (this._compareRoutes(this.routes[l].route, t) && !t.includes(":")) {
          p = !0, this.prevRouteData = Object.assign({}, this.curRouteData), this.curRouteData = this.routes[l], document.title = this._createPageTitle(this.routes[l].title), this._createNewView(this.routes[l]);
          break;
        }
        const y = this._getRouteParams(this.routes[l].route, t);
        if (y) {
          p = !0, this.prevRouteData = Object.assign({}, this.curRouteData), this.curRouteData = this.routes[l], this.curRouteData.params = y, document.title = this._createPageTitle(this.routes[l].title), this._createNewView(this.routes[l]);
          break;
        }
      }
      p || this.notFound(), this.rcCallback(this.curRoute);
    });
    o(this, "_compareRoutes", (t, e, s) => {
      if (t = t.split("?")[0], e = e.split("?")[0], s && (t.includes(":") || e.includes(":"))) {
        const r = t.split("/"), i = e.split("/");
        let a = r.length;
        i.length > r.length && (a = i.length);
        for (let h = 0; h < a; h++)
          r[h] && r[h].includes(":") ? r[h] = i[h] : i[h] && i[h].includes(":") && (i[h] = r[h]);
        t = r.join("/"), e = i.join("/");
      }
      return t === e || t + "/" === e || t === e + "/";
    });
    o(this, "getRoute", (t) => t ? this.curRoute.replace(this.basePath, "") : this.curRoute);
    o(this, "getRouteData", () => ({ ...this.curRouteData, prevRouteData: this.prevRouteData }));
    o(this, "getRouteParams", () => this.curRouteData.params);
    o(this, "isCurrent", (t) => this.basePath + t === this.curRoute || this.basePath + t === this.curRoute + "/" || this.basePath + t + "/" === this.curRoute);
    o(this, "setRoute", () => {
      let t = location.pathname;
      t ? (t.length > 1 && t.substring(t.length - 1, t.length) === "/" && (t = t.substring(0, t.length - 1)), this.curRoute = t) : this.curRoute = this.basePath + "/";
    });
    o(this, "addRoute", (t) => {
      t.route = this.basePath + t.route, this.routes.push(t), this._compareRoutes(t.route, this.curRoute) && (this.curRouteData = t);
    });
    o(this, "notFound", () => {
      let t;
      for (let e = 0; e < this.routes.length; e++)
        this.routes[e].is404 && (t = this.routes[e]);
      if (!t) {
        const e = "Could not find 404 template.";
        throw c.error(e), new Error(e);
      }
      this.prevRouteData = Object.assign({}, this.curRouteData), this.curRouteData = t, document.title = this._createPageTitle(t.title), this._createNewView(t);
    });
    o(this, "draw", () => {
      var t;
      (t = this.prevRouteData) != null && t.component && (this.prevRouteData.component.discard(!0), this.prevRouteData.component = null), this.curRouteData.component.draw();
    });
    o(this, "remove", () => {
      var t, e;
      (t = this.prevRouteData) != null && t.component && this.prevRouteData.component.discard(!0), (e = this.curRouteData) != null && e.component && this.curRouteData.component.discard(!0), w = null, b = !1;
    });
    o(this, "_createNewView", (t) => {
      var e, s;
      t.component = new t.source({
        ...this.commonData,
        id: t.id,
        attachId: t.attachId,
        title: t.title,
        template: t.template,
        extraRouteData: t.extraRouteData
      }), (s = (e = t.component) == null ? void 0 : e.parent) != null && s.elem || (t.component.parent = t.component.getComponentById(t.attachId));
    });
    o(this, "_getRouteParams", (t, e) => {
      if (!t.includes(":"))
        return !1;
      const s = t.split("/");
      e = e.split("?")[0];
      const r = e.split("/");
      let i = s.length;
      r.length > s.length && (i = r.length);
      let a = {};
      for (let h = 0; h < i; h++)
        if (s[h] && s[h].includes(":")) {
          if (!r[h])
            return !1;
          const d = s[h].replace(":", "");
          a[d] = r[h];
        } else if (!s[h] === void 0 || !r[h] === void 0 || s[h] !== r[h])
          return !1;
      return a;
    });
    if (b) {
      const a = "Router has already been initiated. Only one router per app is allowed.";
      throw c.error(a), new Error(a);
    }
    if (!t || !t.routes || !t.routes.length) {
      const a = `Missing routesData parameter, routesData.routes, or routesData.routes is empty.
Required params: new Route(routesData, attachId, rcCallback);`;
      throw c.error(a), new Error(a);
    }
    if (!e)
      throw c.error(
        `Missing attachId parameter.
Required params: new Route(routesData, attachId, rcCallback);`
      ), new Error("Call stack");
    if (!s) {
      const a = `Missing rcCallback (route change callback) parameter / function.
Required params: new Route(routesData, attachId, rcCallback);`;
      throw c.error(a), new Error(a);
    }
    let i = !1;
    for (let a = 0; a < t.routes.length; a++)
      t.routes[a].is404 && (i = !0);
    if (!i) {
      const a = "Could not find 404 template.";
      throw c.error(a), new Error(a);
    }
    w = this, this.routes = [], this.nextHistoryState = {}, this.curHistoryState = {}, this.basePath = t.basePath || "", this.titlePrefix = t.titlePrefix || "", this.titleSuffix = t.titleSuffix || "", this.langFn = t.langFn, this.curRoute = this.basePath + "/", this.rcCallback = s, this.redirectRoute = null, this.curRouteData = {
      route: this.basePath + "/",
      source: null,
      params: {},
      component: null
    }, this.prevRoute = null, this.prevRouteData = null, r || (r = {}), this.commonData = r, this.initRouter(t.routes, e);
  }
}
let w = null;
const N = (n) => c.setCallback(n), $ = (n) => n ? c.turnOff() : c.turnOn(), m = {}, g = new v("LIGHTER.js COMPO *****");
class k {
  constructor(t) {
    o(this, "draw", (t) => {
      if (this.drawing || this.discarding)
        return this;
      this.drawing = !0;
      const e = { ...this.props, ...t };
      if (t != null && t.id || t != null && t._id)
        throw this.drawing = !1, g.error(
          `ID of a component cannot be changed once it has been initialised. Old ID: "${this.id}", new ID: ${t.id || t._id}`
        ), new Error("ID cannot be changed");
      m[e.id] || (m[e.id] = this), this.props = e, this.elem && this.discard(), this._checkParentAndAttachId(), !this.template !== e.template && (this.template = e.template || this._createDefaultTemplate(e)), this._createElement(), e.prepend ? this.parent.elem.prepend(this.elem) : this.parent.elem.append(this.elem), this.paint(e), this.addListeners(e);
      for (let s = 0; s < this.listenersToAdd.length; s++)
        this.listenersToAdd[s].targetId && (this.listenersToAdd[s].target = this.getComponentElemById(this.listenersToAdd[s].targetId)), this.addListener(this.listenersToAdd[s]);
      return this.listenersToAdd = [], this.drawing = !1, this;
    });
    o(this, "add", (t) => {
      let e = t;
      return e.isComponent || (e = new k(t)), this.children[e.id] = e, e.props.attachId || (e.parent = this), e;
    });
    o(this, "addListener", (t) => {
      let { id: e, target: s, type: r, fn: i } = t;
      if (!r || !i)
        throw g.error(
          `Could not add listener, type, and/or fn missing. Listener props: ${JSON.stringify(
            t
          )}`,
          this
        ), new Error("Call stack");
      if (e || (e = this.id, t.id = e), !s) {
        if (s = this.elem, s === null)
          throw g.error(
            `Could not add listener, target elem was given but is null. Listener props: ${JSON.stringify(
              t
            )}`,
            this
          ), new Error("Call stack");
        t.target = s;
      }
      this.listeners[e] && this.removeListener(e), s && (t.fn = (a) => i(a, this), s.addEventListener(r, t.fn), this.listeners[e] = t);
    });
    o(this, "removeListener", (t) => {
      if (!t)
        throw g.error(
          `Could not remove listener, id missing. Listener props: ${JSON.stringify(t)}`,
          this
        ), new Error("Call stack");
      const { target: e, type: s, fn: r } = this.listeners[t];
      e.removeEventListener(s, r), delete this.listeners[t];
    });
    o(this, "discard", (t) => {
      if (this.discarding)
        return;
      this.discarding = !0;
      let e = Object.keys(this.listeners);
      for (let s = 0; s < e.length; s++)
        this.removeListener(e[s]);
      e = Object.keys(this.children);
      for (let s = 0; s < e.length; s++)
        this.children[e[s]].discard(t), t && delete this.children[e[s]];
      this.elem && (this.elem.remove(), this.elem = null), t && delete m[this.id], this.discarding = !1;
    });
    o(this, "_setElemData", (t, e) => {
      var s;
      if (!(!t || !e)) {
        if ((s = e.classes) != null && s.length && t.classList.add(...e.classes), e.attributes) {
          const r = Object.keys(e.attributes);
          for (let i = 0; i < r.length; i++)
            t.setAttribute(r[i], e.attributes[r[i]]);
        }
        if (e.style) {
          const r = Object.keys(e.style);
          for (let i = 0; i < r.length; i++)
            t.style[r[i]] = e.style[r[i]];
        }
        e.text && (t.textContent = e.text), e._id && !t.getAttribute("id") && t.setAttribute("id", e._id);
      }
    });
    o(this, "_createDefaultTemplate", (t) => t != null && t.tag ? `<${t.tag}></${t.tag}>` : "<div></div>");
    o(this, "_createElement", () => {
      const t = document.createElement("template");
      t.innerHTML = this.template, this.elem = t.content.firstChild, this._setElemData(this.elem, this.props);
    });
    o(this, "getComponentById", (t) => L(t));
    o(this, "getComponentElemById", (t) => O(t));
    o(this, "_checkParentAndAttachId", () => {
      if (!this.parent && !this.props.attachId)
        throw g.error(
          'Component does not have a parent nor does it have an "attachId" as a prop. One of these is required. Either pass in an "attachId" as prop or attach this component to the parent component with "parentComponent.add()" method.'
        ), new Error("Call stack");
    });
    if (t != null && t.parent || t != null && t.children)
      throw g.error(
        `Component props contains a reserved keyword (parent or children. Props: ${JSON.stringify(
          t
        )}`
      ), new Error("Invalid Component props key.");
    t != null && t.id || t != null && t._id ? this.id = t.id || t._id : this.id = I(), this.props = {
      id: this.id,
      ...t
    }, m[this.id] = this, this.elem, this.parent, this.children = {}, this.listeners = {}, this.listenersToAdd = [], this.drawing = !1, this.discarding = !1, this.isComponent = !0, this.props.attachId && (this.parent ? this.parent.elem = this.getComponentElemById(this.props.attachId) : this.parent = { elem: this.getComponentElemById(this.props.attachId) }), this.router = w, this.template = (t == null ? void 0 : t.template) || this._createDefaultTemplate(t), t != null && t.preCreateElement && this._createElement();
  }
  paint() {
  }
  addListeners() {
  }
}
const F = (n) => g.setCallback(n), M = (n) => n ? g.turnOff() : g.turnOn(), L = (n) => m[n], O = (n) => {
  const t = m[n];
  return t != null && t.elem ? t.elem : document.getElementById(n);
}, f = {};
class B {
  constructor(t) {
    this.initState = t, this.state = t || {}, this.listeners = [], this.listenerCallbacks = [];
  }
  set(t, e, s, r) {
    if (!t)
      return;
    const i = t.split(".");
    let a;
    if (i.length === 1) {
      if (r) {
        f[t] = e;
        return;
      }
      a = this.state[i[i.length - 1]], this.state[t] = e, this._checkListeners(a, e, t);
      return;
    }
    let h = r ? f[i[0]] : this.state[i[0]];
    h === void 0 && (r ? f[i[0]] = h = {} : this.state[i[0]] = h = {});
    for (let d = 1; d < i.length - 1; d++)
      h[i[d]] === void 0 && (h[i[d]] = {}), h = h[i[d]];
    r ? h[i[i.length - 1]] = e : (a = h[i[i.length - 1]], h[i[i.length - 1]] = e, this._checkListeners(a, e, t)), s && !r && this.addListener(t, s);
  }
  get(t, e) {
    if (!t)
      return;
    const s = t.split(".");
    if (s.length === 1)
      return e ? f[t] : this.state[t];
    let r = e ? f[s[0]] : this.state[s[0]];
    for (let i = 1; i < s.length; i++) {
      if (r === void 0 || r[s[i]] === void 0)
        return;
      r = r[s[i]];
    }
    return r;
  }
  remove(t, e) {
    if (!t)
      return;
    e || this.removeListener(t);
    const s = t.split(".");
    if (s.length === 1) {
      if (e) {
        if (f[t] === void 0)
          return;
        delete f[t];
        return;
      }
      if (this.state[t] === void 0)
        return;
      delete this.state[t];
      return;
    }
    let r = e ? f[s[0]] : this.state[s[0]];
    for (let i = 1; i < s.length - 1; i++) {
      if (r === void 0 || r[s[i]] === void 0)
        return;
      r = r[s[i]];
    }
    r !== void 0 && delete r[s[s.length - 1]];
  }
  getObject() {
    return this.state;
  }
  addListener(t, e) {
    this.listeners.push(t), this.listenerCallbacks.push(e);
  }
  removeListener(t) {
    const e = this.listeners.indexOf(t);
    e > -1 && (this.listeners.splice(e, 1), this.listenerCallbacks.splice(e, 1));
  }
  _checkListeners(t, e, s) {
    if (t === e)
      return;
    const r = this.listeners.indexOf(s);
    r > -1 && this.listenerCallbacks[r](e, t);
  }
  getKeys(t) {
    if (!t)
      return Object.keys(this.state);
    const e = t.split(".");
    let s = this.state[e[0]];
    for (let r = 1; r < e.length - 1; r++) {
      if (s === void 0 || s[e[r]] === void 0)
        return;
      s = s[e[r]];
    }
    return s === void 0 ? [] : Object.keys(s);
  }
  getG(t) {
    return this.get(t, !0);
  }
  getGObject() {
    return f;
  }
  setG(t, e) {
    this.set(t, e, null, !0);
  }
  removeG(t) {
    this.remove(t, !0);
  }
}
export {
  k as Component,
  T as LocalStorage,
  v as Logger,
  U as Router,
  w as RouterRef,
  j as SessionStorage,
  B as State,
  H as createUUID,
  L as getComponentById,
  O as getComponentElemById,
  M as isComponentLoggerQuiet,
  $ as isRouterLoggerQuiet,
  F as setComponentLoggerCallback,
  N as setRouterLoggerCallback
};
