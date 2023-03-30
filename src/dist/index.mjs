var v = Object.defineProperty;
var C = (a, t, e) => t in a ? v(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var h = (a, t, e) => (C(a, typeof t != "symbol" ? t + "" : t, e), e);
let m;
const x = new Uint8Array(16);
function _() {
  if (!m && (m = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !m))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return m(x);
}
const u = [];
for (let a = 0; a < 256; ++a)
  u.push((a + 256).toString(16).slice(1));
function E(a, t = 0) {
  return (u[a[t + 0]] + u[a[t + 1]] + u[a[t + 2]] + u[a[t + 3]] + "-" + u[a[t + 4]] + u[a[t + 5]] + "-" + u[a[t + 6]] + u[a[t + 7]] + "-" + u[a[t + 8]] + u[a[t + 9]] + "-" + u[a[t + 10]] + u[a[t + 11]] + u[a[t + 12]] + u[a[t + 13]] + u[a[t + 14]] + u[a[t + 15]]).toLowerCase();
}
const L = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), w = {
  randomUUID: L
};
function S(a, t, e) {
  if (w.randomUUID && !t && !a)
    return w.randomUUID();
  a = a || {};
  const s = a.random || (a.rng || _)();
  if (s[6] = s[6] & 15 | 64, s[8] = s[8] & 63 | 128, t) {
    e = e || 0;
    for (let r = 0; r < 16; ++r)
      t[e + r] = s[r];
    return t;
  }
  return E(s);
}
class O {
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
class A {
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
class I {
  constructor(t, e, s) {
    h(this, "setCallback", (t) => this.callback = t);
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
const T = () => S();
let y = !1;
const c = new I("LIGHTER.js ROUTER *****");
class j {
  constructor(t, e, s, r) {
    h(this, "initRouter", async (t, e) => {
      this.setRoute();
      let s = !1;
      if (this.curRoute.length < this.basePath.length && (this.curRoute = this.basePath + "/", s = !0), !t) {
        this.notFound();
        return;
      }
      for (let i = 0; i < t.length; i++) {
        if (!t[i].route)
          throw c.error(`Route '${t[i].id}' is missing the route attribute.`), new Error("Call stack");
        if (t[i].route = this.basePath + t[i].route, t[i].redirect) {
          if (t[i].redirect = this.basePath + t[i].redirect, t[i].redirect === t[i].route)
            throw c.error(`Route's redirect cannot be the same as the route '${t[i].route}'.`), new Error("Call stack");
          this._compareRoutes(t[i].route, this.curRoute) && (this.curRoute = t[i].redirect, s = !0);
        }
        if (this._compareRoutes(t[i].route, this.curRoute, !0) && t[i].beforeDraw) {
          const l = await t[i].beforeDraw({
            route: t[i],
            curRouteData: this.curRouteData,
            curRoute: this.curRoute,
            basePath: this.basePath,
            commonData: this.commonData,
            prevRouteData: null,
            prevRoute: null
          });
          l && (this.curRoute = this.basePath + l, s = !0);
        }
      }
      let r = !1;
      for (let i = 0; i < t.length; i++) {
        if (t[i].redirect) {
          this.routes.push(t[i]);
          continue;
        }
        if (!t[i].id)
          throw c.error("Route is missing the id attribute."), new Error("Call stack");
        if (this.langFn && (t[i].titleKey ? t[i].title = this.langFn(t[i].titleKey) : c.warn(
          `Router has a langFn defined, but route '${t[i].id}' is missing the titleKey.`
        )), t[i].title || (c.warn(`Route '${t[i].id}' is missing the title. Setting id as title.`), t[i].title = t[i].id), t[i].attachId = e, this.routes.push(t[i]), this._compareRoutes(t[i].route, this.curRoute) && !this.curRoute.includes(":") && (t[i].attachId = e, this._createNewView(t[i]), r = !0, this.curRouteData = t[i], document.title = this._createPageTitle(t[i].title)), !r) {
          const l = this._getRouteParams(this.routes[i].route, this.curRoute);
          l && (t[i].attachId = e, this._createNewView(t[i]), r = !0, this.curRouteData = t[i], this.curRouteData.params = l, document.title = this._createPageTitle(t[i].title));
        }
      }
      if (r || this.notFound(), window.onpopstate = this.routeChangeListener, s) {
        const i = this._createRouteState();
        window.history.pushState(i, "", this.curRoute), this.curHistoryState = i;
      }
      y = !0;
    });
    h(this, "routeChangeListener", (t) => {
      this.setRoute(), this.changeRoute(this.curRoute, {
        forceUpdate: !0,
        ignoreBasePath: !0,
        doNotSetState: !0
      }), this.curHistoryState = t.state || {};
    });
    h(this, "_createPageTitle", (t) => this.titlePrefix + t + this.titleSuffix);
    h(this, "_createRouteState", () => {
      const t = Object.assign({}, this.nextHistoryState);
      return this.nextHistoryState = {}, this.curHistoryState = {}, t;
    });
    h(this, "replaceRoute", (t, e) => {
      let s = this.basePath;
      e && (s = ""), t = s + t;
      const r = this._createRouteState();
      window.history.replaceState(r, "", t);
    });
    h(this, "setNextHistoryState", (t) => {
      this.nextHistoryState = Object.assign(this.nextHistoryState, t);
    });
    h(this, "setCurHistoryState", (t) => {
      this.curHistoryState = Object.assign(this.curHistoryState, t), window.history.replaceState(this.curHistoryState, "");
    });
    h(this, "getCurHistoryState", () => this.curHistoryState);
    // Options: Object
    // - forceUpdate: Boolean
    // - ignoreBasePath: Boolean
    // - doNotSetState: Boolean
    // - replaceState: Boolean (if true, doNotSetState is also true, so no need to declare it)
    h(this, "changeRoute", async (t, e) => {
      e || (e = {});
      const s = e.forceUpdate, r = e.ignoreBasePath, i = e.doNotSetState, l = e.replaceState;
      let n = this.basePath;
      r && (n = ""), t = n + t;
      let d;
      for (let o = 0; o < this.routes.length; o++)
        if (this._compareRoutes(this.routes[o].route, t, !0) && this.routes[o].beforeDraw) {
          d = await this.routes[o].beforeDraw({
            route: this.routes[o],
            curRouteData: this.curRouteData,
            curRoute: this.curRoute,
            basePath: this.basePath,
            commonData: this.commonData,
            prevRouteData: this.prevRouteData,
            prevRoute: this.prevRouteData
          }), d && (t = n + d);
          break;
        }
      for (let o = 0; o < this.routes.length; o++)
        if (this.routes[o].redirect && this._compareRoutes(this.routes[o].route, t)) {
          t = this.routes[o].redirect;
          break;
        }
      if (this._compareRoutes(t, this.curRoute) && !s)
        return;
      if (s && (this.curRouteData.component.discard(!0), this.curRouteData.component = null), !i && !l) {
        const o = this._createRouteState();
        window.history.pushState(o, "", t);
      } else
        l && this.replaceRoute(t, !0);
      this.prevRoute = this.curRoute, this.setRoute();
      let p = !1;
      for (let o = 0; o < this.routes.length; o++) {
        if (this._compareRoutes(this.routes[o].route, t) && !t.includes(":")) {
          p = !0, this.prevRouteData = Object.assign({}, this.curRouteData), this.curRouteData = this.routes[o], document.title = this._createPageTitle(this.routes[o].title), this._createNewView(this.routes[o]);
          break;
        }
        const b = this._getRouteParams(this.routes[o].route, t);
        if (b) {
          p = !0, this.prevRouteData = Object.assign({}, this.curRouteData), this.curRouteData = this.routes[o], this.curRouteData.params = b, document.title = this._createPageTitle(this.routes[o].title), this._createNewView(this.routes[o]);
          break;
        }
      }
      p || this.notFound(), this.rcCallback(this.curRoute);
    });
    h(this, "_compareRoutes", (t, e, s) => {
      if (t = t.split("?")[0], e = e.split("?")[0], s && (t.includes(":") || e.includes(":"))) {
        const r = t.split("/"), i = e.split("/");
        let l = r.length;
        i.length > r.length && (l = i.length);
        for (let n = 0; n < l; n++)
          r[n] && r[n].includes(":") ? r[n] = i[n] : i[n] && i[n].includes(":") && (i[n] = r[n]);
        t = r.join("/"), e = i.join("/");
      }
      return t === e || t + "/" === e || t === e + "/";
    });
    h(this, "getRoute", (t) => t ? this.curRoute.replace(this.basePath, "") : this.curRoute);
    h(this, "getRouteData", () => ({ ...this.curRouteData, prevRouteData: this.prevRouteData }));
    h(this, "getRouteParams", () => this.curRouteData.params);
    h(this, "isCurrent", (t) => this.basePath + t === this.curRoute || this.basePath + t === this.curRoute + "/" || this.basePath + t + "/" === this.curRoute);
    h(this, "setRoute", () => {
      let t = location.pathname;
      t ? (t.length > 1 && t.substring(t.length - 1, t.length) === "/" && (t = t.substring(0, t.length - 1)), this.curRoute = t) : this.curRoute = this.basePath + "/";
    });
    h(this, "addRoute", (t) => {
      t.route = this.basePath + t.route, this.routes.push(t), this._compareRoutes(t.route, this.curRoute) && (this.curRouteData = t);
    });
    h(this, "notFound", () => {
      let t;
      for (let e = 0; e < this.routes.length; e++)
        this.routes[e].is404 && (t = this.routes[e]);
      if (!t)
        throw c.error("Could not find 404 template."), new Error("Call stack");
      this.prevRouteData = Object.assign({}, this.curRouteData), this.curRouteData = t, document.title = this._createPageTitle(t.title), this._createNewView(t);
    });
    h(this, "draw", () => {
      var t;
      (t = this.prevRouteData) != null && t.component && (this.prevRouteData.component.discard(!0), this.prevRouteData.component = null), this.curRouteData.component.draw();
    });
    h(this, "_createNewView", (t) => {
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
    h(this, "_getRouteParams", (t, e) => {
      if (!t.includes(":"))
        return !1;
      const s = t.split("/");
      e = e.split("?")[0];
      const r = e.split("/");
      let i = s.length;
      r.length > s.length && (i = r.length);
      let l = {};
      for (let n = 0; n < i; n++)
        if (s[n] && s[n].includes(":")) {
          if (!r[n])
            return !1;
          const d = s[n].replace(":", "");
          l[d] = r[n];
        } else if (!s[n] === void 0 || !r[n] === void 0 || s[n] !== r[n])
          return !1;
      return l;
    });
    if (y)
      throw c.error("Router has already been initiated. Only one router per app is allowed."), new Error("Call stack");
    if (!t || !t.routes || !t.routes.length)
      throw c.error(
        `Missing routesData parameter, routesData.routes, or routesData.routes is empty.
Required params: new Route(routesData, attachId, rcCallback);`
      ), new Error("Call stack");
    if (!e)
      throw c.error(
        `Missing attachId parameter.
Required params: new Route(routesData, attachId, rcCallback);`
      ), new Error("Call stack");
    if (!s)
      throw c.error(
        `Missing rcCallback (route change callback) parameter / function.
Required params: new Route(routesData, attachId, rcCallback);`
      ), new Error("Call stack");
    P = this, this.routes = [], this.nextHistoryState = {}, this.curHistoryState = {}, this.basePath = t.basePath || "", this.titlePrefix = t.titlePrefix || "", this.titleSuffix = t.titleSuffix || "", this.langFn = t.langFn, this.curRoute = this.basePath + "/", this.rcCallback = s, this.redirectRoute = null, this.curRouteData = {
      route: this.basePath + "/",
      source: null,
      params: {},
      component: null
    }, this.prevRoute = null, this.prevRouteData = null, r || (r = {}), this.commonData = r, this.initRouter(t.routes, e);
  }
}
let P = null;
const H = (a) => c.setCallback(a), U = (a) => a ? c.turnOff() : c.turnOn(), R = {}, g = new I("LIGHTER.js COMPO *****");
class k {
  constructor(t) {
    h(this, "draw", (t) => {
      if (this.drawing || this.discarding)
        return;
      this.drawing = !0;
      const e = { ...this.props, ...t };
      this.props = e, this.elem && this.discard(), this._checkParentAndAttachId(), !this.template !== e.template && (this.template = e.template || this._createDefaultTemplate(e)), this._createElement(), e.prepend ? this.parent.elem.prepend(this.elem) : this.parent.elem.append(this.elem), this.paint(e), this.addListeners(e);
      for (let s = 0; s < this.listenersToAdd.length; s++)
        this.listenersToAdd[s].targetId && (this.listenersToAdd[s].target = this.getComponentElemById(this.listenersToAdd[s].targetId)), this.addListener(this.listenersToAdd[s]);
      return this.listenersToAdd = [], this.drawing = !1, this;
    });
    h(this, "add", (t) => {
      let e = t;
      return e.isComponent || (e = new k(t)), this.children[e.id] = e, e.props.attachId || (e.parent = this), e;
    });
    h(this, "addListener", (t) => {
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
      this.listeners[e] && this.removeListener(e), s && (s.addEventListener(r, i), this.listeners[e] = t);
    });
    h(this, "removeListener", (t) => {
      if (!t)
        throw g.error(
          `Could not remove listener, id missing. Listener props: ${JSON.stringify(t)}`,
          this
        ), new Error("Call stack");
      const { target: e, type: s, fn: r } = this.listeners[t];
      e.removeEventListener(s, r), delete this.listeners[t];
    });
    h(this, "discard", (t) => {
      if (this.discarding)
        return;
      this.discarding = !0;
      let e = Object.keys(this.listeners);
      for (let s = 0; s < e.length; s++)
        this.removeListener(e[s]);
      e = Object.keys(this.children);
      for (let s = 0; s < e.length; s++)
        this.children[e[s]].discard(t), t && delete this.children[e[s]];
      this.elem && (this.elem.remove(), this.elem = null), t && delete R[this.id], this.discarding = !1;
    });
    h(this, "_setElemData", (t, e) => {
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
        e.text && (t.innerText = e.text), e._id && !t.getAttribute("id") && t.setAttribute("id", e._id);
      }
    });
    h(this, "_createDefaultTemplate", (t) => t != null && t.tag ? `<${t.tag}></${t.tag}>` : "<div></div>");
    h(this, "_createElement", () => {
      const t = document.createElement("template");
      t.innerHTML = this.template, this.elem = t.content.firstChild, this._setElemData(this.elem, this.props);
    });
    h(this, "getComponentById", (t) => R[t]);
    h(this, "getComponentElemById", (t) => {
      const e = R[t];
      return e != null && e.elem ? e.elem : document.getElementById(t);
    });
    h(this, "_checkParentAndAttachId", () => {
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
    t != null && t.id || t != null && t._id ? this.id = t.id || t._id : this.id = S(), this.props = {
      id: this.id,
      ...t
    }, R[this.id] = this, this.elem, this.parent, this.children = {}, this.listeners = {}, this.listenersToAdd = [], this.drawing = !1, this.discarding = !1, this.isComponent = !0, this.props.attachId && (this.parent ? this.parent.elem = this.getComponentElemById(this.props.attachId) : this.parent = { elem: this.getComponentElemById(this.props.attachId) }), this.router = P, this.template = (t == null ? void 0 : t.template) || this._createDefaultTemplate(t), t != null && t.preCreateElement && this._createElement();
  }
  paint() {
  }
  addListeners() {
  }
}
const N = (a) => g.setCallback(a), $ = (a) => a ? g.turnOff() : g.turnOn(), f = {};
class F {
  constructor(t) {
    this.initState = t, this.state = t || {}, this.listeners = [], this.listenerCallbacks = [];
  }
  set(t, e, s, r) {
    if (!t)
      return;
    const i = t.split(".");
    let l;
    if (i.length === 1) {
      if (r) {
        f[t] = e;
        return;
      }
      l = this.state[i[i.length - 1]], this.state[t] = e, this._checkListeners(l, e, t);
      return;
    }
    let n = r ? f[i[0]] : this.state[i[0]];
    n === void 0 && (r ? f[i[0]] = n = {} : this.state[i[0]] = n = {});
    for (let d = 1; d < i.length - 1; d++)
      n[i[d]] === void 0 && (n[i[d]] = {}), n = n[i[d]];
    r ? n[i[i.length - 1]] = e : (l = n[i[i.length - 1]], n[i[i.length - 1]] = e, this._checkListeners(l, e, t)), s && !r && this.addListener(t, s);
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
  O as LocalStorage,
  I as Logger,
  j as Router,
  P as RouterRef,
  A as SessionStorage,
  F as State,
  T as createUUID,
  $ as isComponentLoggerQuiet,
  U as isRouterLoggerQuiet,
  N as setComponentLoggerCallback,
  H as setRouterLoggerCallback
};
