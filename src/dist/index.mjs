var I = Object.defineProperty;
var k = (a, t, e) => t in a ? I(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : a[t] = e;
var n = (a, t, e) => (k(a, typeof t != "symbol" ? t + "" : t, e), e);
let f;
const v = new Uint8Array(16);
function x() {
  if (!f && (f = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !f))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return f(v);
}
const l = [];
for (let a = 0; a < 256; ++a)
  l.push((a + 256).toString(16).slice(1));
function C(a, t = 0) {
  return (l[a[t + 0]] + l[a[t + 1]] + l[a[t + 2]] + l[a[t + 3]] + "-" + l[a[t + 4]] + l[a[t + 5]] + "-" + l[a[t + 6]] + l[a[t + 7]] + "-" + l[a[t + 8]] + l[a[t + 9]] + "-" + l[a[t + 10]] + l[a[t + 11]] + l[a[t + 12]] + l[a[t + 13]] + l[a[t + 14]] + l[a[t + 15]]).toLowerCase();
}
const _ = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), p = {
  randomUUID: _
};
function D(a, t, e) {
  if (p.randomUUID && !t && !a)
    return p.randomUUID();
  a = a || {};
  const s = a.random || (a.rng || x)();
  if (s[6] = s[6] & 15 | 64, s[8] = s[8] & 63 | 128, t) {
    e = e || 0;
    for (let r = 0; r < 16; ++r)
      t[e + r] = s[r];
    return t;
  }
  return C(s);
}
class L {
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
class T {
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
class y {
  constructor(t, e, s) {
    n(this, "setCallback", (t) => this.callback = t);
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
let b = !1;
const c = new y("LIGHTER.js ROUTER *****");
class O {
  constructor(t, e, s, r) {
    n(this, "initRouter", async (t, e) => {
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
          const u = await t[i].beforeDraw({
            route: t[i],
            curRouteData: this.curRouteData,
            curRoute: this.curRoute,
            basePath: this.basePath,
            commonData: this.commonData,
            prevRouteData: null,
            prevRoute: null
          });
          u && (this.curRoute = this.basePath + u, s = !0);
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
          const u = this._getRouteParams(this.routes[i].route, this.curRoute);
          u && (t[i].attachId = e, this._createNewView(t[i]), r = !0, this.curRouteData = t[i], this.curRouteData.params = u, document.title = this._createPageTitle(t[i].title));
        }
      }
      if (r || this.notFound(), window.onpopstate = this.routeChangeListener, s) {
        const i = this._createRouteState();
        window.history.pushState(i, "", this.curRoute), this.curHistoryState = i;
      }
      b = !0;
    });
    n(this, "routeChangeListener", (t) => {
      this.setRoute(), this.changeRoute(this.curRoute, {
        forceUpdate: !0,
        ignoreBasePath: !0,
        doNotSetState: !0
      }), this.curHistoryState = t.state || {};
    });
    n(this, "_createPageTitle", (t) => this.titlePrefix + t + this.titleSuffix);
    n(this, "_createRouteState", () => {
      const t = Object.assign({}, this.nextHistoryState);
      return this.nextHistoryState = {}, this.curHistoryState = {}, t;
    });
    n(this, "replaceRoute", (t, e) => {
      let s = this.basePath;
      e && (s = ""), t = s + t;
      const r = this._createRouteState();
      window.history.replaceState(r, "", t);
    });
    n(this, "setNextHistoryState", (t) => {
      this.nextHistoryState = Object.assign(this.nextHistoryState, t);
    });
    n(this, "setCurHistoryState", (t) => {
      this.curHistoryState = Object.assign(this.curHistoryState, t), window.history.replaceState(this.curHistoryState, "");
    });
    n(this, "getCurHistoryState", () => this.curHistoryState);
    // Options: Object
    // - forceUpdate: Boolean
    // - ignoreBasePath: Boolean
    // - doNotSetState: Boolean
    // - replaceState: Boolean (if true, doNotSetState is also true, so no need to declare it)
    n(this, "changeRoute", async (t, e) => {
      e || (e = {});
      const s = e.forceUpdate, r = e.ignoreBasePath, i = e.doNotSetState, u = e.replaceState;
      let h = this.basePath;
      r && (h = ""), t = h + t;
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
          }), d && (t = h + d);
          break;
        }
      for (let o = 0; o < this.routes.length; o++)
        if (this.routes[o].redirect && this._compareRoutes(this.routes[o].route, t)) {
          t = this.routes[o].redirect;
          break;
        }
      if (this._compareRoutes(t, this.curRoute) && !s)
        return;
      if (s && (this.curRouteData.component.discard(!0), this.curRouteData.component = null), !i && !u) {
        const o = this._createRouteState();
        window.history.pushState(o, "", t);
      } else
        u && this.replaceRoute(t, !0);
      this.prevRoute = this.curRoute, this.setRoute();
      let R = !1;
      for (let o = 0; o < this.routes.length; o++) {
        if (this._compareRoutes(this.routes[o].route, t) && !t.includes(":")) {
          R = !0, this.prevRouteData = Object.assign({}, this.curRouteData), this.curRouteData = this.routes[o], document.title = this._createPageTitle(this.routes[o].title), this._createNewView(this.routes[o]);
          break;
        }
        const w = this._getRouteParams(this.routes[o].route, t);
        if (w) {
          R = !0, this.prevRouteData = Object.assign({}, this.curRouteData), this.curRouteData = this.routes[o], this.curRouteData.params = w, document.title = this._createPageTitle(this.routes[o].title), this._createNewView(this.routes[o]);
          break;
        }
      }
      R || this.notFound(), this.rcCallback(this.curRoute);
    });
    n(this, "_compareRoutes", (t, e, s) => {
      if (t = t.split("?")[0], e = e.split("?")[0], s && (t.includes(":") || e.includes(":"))) {
        const r = t.split("/"), i = e.split("/");
        let u = r.length;
        i.length > r.length && (u = i.length);
        for (let h = 0; h < u; h++)
          r[h] && r[h].includes(":") ? r[h] = i[h] : i[h] && i[h].includes(":") && (i[h] = r[h]);
        t = r.join("/"), e = i.join("/");
      }
      return t === e || t + "/" === e || t === e + "/";
    });
    n(this, "getRoute", (t) => t ? this.curRoute.replace(this.basePath, "") : this.curRoute);
    n(this, "getRouteData", () => ({ ...this.curRouteData, prevRouteData: this.prevRouteData }));
    n(this, "getRouteParams", () => this.curRouteData.params);
    n(this, "isCurrent", (t) => this.basePath + t === this.curRoute || this.basePath + t === this.curRoute + "/" || this.basePath + t + "/" === this.curRoute);
    n(this, "setRoute", () => {
      let t = location.pathname;
      t ? (t.length > 1 && t.substring(t.length - 1, t.length) === "/" && (t = t.substring(0, t.length - 1)), this.curRoute = t) : this.curRoute = this.basePath + "/";
    });
    n(this, "addRoute", (t) => {
      t.route = this.basePath + t.route, this.routes.push(t), this._compareRoutes(t.route, this.curRoute) && (this.curRouteData = t);
    });
    n(this, "notFound", () => {
      let t;
      for (let e = 0; e < this.routes.length; e++)
        this.routes[e].is404 && (t = this.routes[e]);
      if (!t)
        throw c.error("Could not find 404 template."), new Error("Call stack");
      this.prevRouteData = Object.assign({}, this.curRouteData), this.curRouteData = t, document.title = this._createPageTitle(t.title), this._createNewView(t);
    });
    n(this, "draw", () => {
      var t;
      (t = this.prevRouteData) != null && t.component && (this.prevRouteData.component.discard(!0), this.prevRouteData.component = null), this.curRouteData.component.draw();
    });
    n(this, "_createNewView", (t) => {
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
    n(this, "_getRouteParams", (t, e) => {
      if (!t.includes(":"))
        return !1;
      const s = t.split("/");
      e = e.split("?")[0];
      const r = e.split("/");
      let i = s.length;
      r.length > s.length && (i = r.length);
      let u = {};
      for (let h = 0; h < i; h++)
        if (s[h] && s[h].includes(":")) {
          if (!r[h])
            return !1;
          const d = s[h].replace(":", "");
          u[d] = r[h];
        } else if (!s[h] === void 0 || !r[h] === void 0 || s[h] !== r[h])
          return !1;
      return u;
    });
    if (b)
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
    S = this, this.routes = [], this.nextHistoryState = {}, this.curHistoryState = {}, this.basePath = t.basePath || "", this.titlePrefix = t.titlePrefix || "", this.titleSuffix = t.titleSuffix || "", this.langFn = t.langFn, this.curRoute = this.basePath + "/", this.rcCallback = s, this.redirectRoute = null, this.curRouteData = {
      route: this.basePath + "/",
      source: null,
      params: {},
      component: null
    }, this.prevRoute = null, this.prevRouteData = null, r || (r = {}), this.commonData = r, this.initRouter(t.routes, e);
  }
}
let S = null;
const m = {}, g = new y("LIGHTER.js COMPO *****");
class P {
  constructor(t) {
    n(this, "draw", (t) => {
      if (this.drawing || this.discarding)
        return;
      this.drawing = !0;
      const e = { ...this.props, ...t };
      this.props = e, this.elem && this.discard(), !this.template !== e.template && (this.template = e.template || this._createDefaultTemplate(e));
      const s = document.createElement("template");
      s.innerHTML = this.template, this.elem = s.content.firstChild, e.prepend ? this.parent.elem.prepend(this.elem) : this.parent.elem.append(this.elem), this._setElemData(this.elem, e), this.paint(e), this.addListeners(e);
      for (let r = 0; r < this.listenersToAdd.length; r++)
        this.listenersToAdd[r].targetId && (this.listenersToAdd[r].target = this.getComponentElemById(this.listenersToAdd[r].targetId)), this.addListener(this.listenersToAdd[r]);
      return this.listenersToAdd = [], this.drawing = !1, this;
    });
    n(this, "add", (t) => {
      let e = t;
      return e.isComponent || (e = new P(t)), this.children[e.id] = e, e.props.attachId || (e.parent = this), e;
    });
    n(this, "addListener", (t) => {
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
    n(this, "removeListener", (t) => {
      if (!t)
        throw g.error(
          `Could not remove listener, id missing. Listener props: ${JSON.stringify(t)}`,
          this
        ), new Error("Call stack");
      const { target: e, type: s, fn: r } = this.listeners[t];
      e.removeEventListener(s, r), delete this.listeners[t];
    });
    n(this, "discard", (t) => {
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
    n(this, "_setElemData", (t, e) => {
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
        e.text && (t.innerText = e.text);
      }
    });
    n(this, "_createDefaultTemplate", (t) => {
      let e = "";
      return t._id && (e = ` id="${t.id}"`), t != null && t.tag ? `<${t.tag}${e}></${t.tag}>` : `<div${e}></div>`;
    });
    n(this, "getComponentById", (t) => m[t]);
    n(this, "getComponentElemById", (t) => {
      const e = m[t];
      return e != null && e.elem ? e.elem : document.getElementById(t);
    });
    if (t != null && t.parent || t != null && t.children)
      throw g.error(
        `Component props contains a reserved keyword (parent or children. Props: ${JSON.stringify(
          t
        )}`
      ), new Error("Invalid Component props key.");
    t != null && t.id || t != null && t._id ? this.id = t.id || t._id : this.id = D(), this.props = {
      id: this.id,
      ...t
    }, m[this.id] = this, this.elem, this.parent, this.template, this.children = {}, this.listeners = {}, this.listenersToAdd = [], this.drawing = !1, this.discarding = !1, this.isComponent = !0, this.props.attachId && (this.parent ? this.parent.elem = this.getComponentElemById(this.props.attachId) : this.parent = { elem: this.getComponentElemById(this.props.attachId) }), this.router = S;
  }
  paint() {
  }
  addListeners() {
  }
}
export {
  P as Component,
  L as LocalStorage,
  y as Logger,
  O as Router,
  T as SessionStorage
};
