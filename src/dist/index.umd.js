(function(o,d){typeof exports=="object"&&typeof module<"u"?d(exports):typeof define=="function"&&define.amd?define(["exports"],d):(o=typeof globalThis<"u"?globalThis:o||self,d(o.lighterjs={}))})(this,function(o){"use strict";var H=Object.defineProperty;var N=(o,d,b)=>d in o?H(o,d,{enumerable:!0,configurable:!0,writable:!0,value:b}):o[d]=b;var h=(o,d,b)=>(N(o,typeof d!="symbol"?d+"":d,b),b);let d;const b=new Uint8Array(16);function C(){if(!d&&(d=typeof crypto<"u"&&crypto.getRandomValues&&crypto.getRandomValues.bind(crypto),!d))throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");return d(b)}const c=[];for(let n=0;n<256;++n)c.push((n+256).toString(16).slice(1));function _(n,t=0){return(c[n[t+0]]+c[n[t+1]]+c[n[t+2]]+c[n[t+3]]+"-"+c[n[t+4]]+c[n[t+5]]+"-"+c[n[t+6]]+c[n[t+7]]+"-"+c[n[t+8]]+c[n[t+9]]+"-"+c[n[t+10]]+c[n[t+11]]+c[n[t+12]]+c[n[t+13]]+c[n[t+14]]+c[n[t+15]]).toLowerCase()}const I={randomUUID:typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto)};function P(n,t,e){if(I.randomUUID&&!t&&!n)return I.randomUUID();n=n||{};const s=n.random||(n.rng||C)();if(s[6]=s[6]&15|64,s[8]=s[8]&63|128,t){e=e||0;for(let r=0;r<16;++r)t[e+r]=s[r];return t}return _(s)}class L{constructor(t){this.keyPrefix=t||"",this.localStorageAvailable=this._lsTest()}getItem(t,e){return this.localStorageAvailable&&this.checkIfItemExists(t)?localStorage.getItem(this.keyPrefix+t):e||null}checkIfItemExists(t){return this.localStorageAvailable?Object.prototype.hasOwnProperty.call(localStorage,this.keyPrefix+t):!1}setItem(t,e){return this.localStorageAvailable?(localStorage.setItem(this.keyPrefix+t,e),!0):!1}removeItem(t){return this.localStorageAvailable?(this.checkIfItemExists(t)&&localStorage.removeItem(this.keyPrefix+t),!0):!1}convertValue(t,e){return typeof t=="boolean"?e==="true":typeof t=="number"?Number(e):e}_lsTest(){const t=this.keyPrefix+"testLSAvailability";try{return localStorage.setItem(t,t),localStorage.removeItem(t),!0}catch{return!1}}}class E{constructor(t){this.keyPrefix=t||"",this.sessionStorageAvailable=this._lsTest()}getItem(t,e){return this.sessionStorageAvailable&&this.checkIfItemExists(t)?sessionStorage.getItem(this.keyPrefix+t):e||null}checkIfItemExists(t){return this.sessionStorageAvailable?Object.prototype.hasOwnProperty.call(sessionStorage,this.keyPrefix+t):!1}setItem(t,e){return this.sessionStorageAvailable?(sessionStorage.setItem(this.keyPrefix+t,e),!0):!1}removeItem(t){return this.sessionStorageAvailable?(this.checkIfItemExists(t)&&sessionStorage.removeItem(this.keyPrefix+t),!0):!1}convertValue(t,e){return typeof t=="boolean"?e==="true":typeof t=="number"?Number(e):e}_lsTest(){const t=this.keyPrefix+"testSSAvailability";try{return sessionStorage.setItem(t,t),sessionStorage.removeItem(t),!0}catch{return!1}}}class w{constructor(t,e,s){h(this,"setCallback",t=>this.callback=t);this.prefix=t||"",this.callback=e,this.showLogs=!0,this.showErrors=!0,this.showWarnings=!0,s&&this.turnOff()}log(...t){this.callback&&this.callback("log",...t),this.showLogs&&console.log(this.prefix,...t)}error(...t){this.callback&&this.callback("error",...t),this.showErrors&&console.error(this.prefix,...t)}warn(...t){this.callback&&this.callback("warning",...t),this.showWarnings&&console.warn(this.prefix,...t)}turnOff(){this.showLogs=!1,this.showErrors=!1,this.showWarnings=!1}turnOn(){this.showLogs=!0,this.showErrors=!0,this.showWarnings=!0}}const D=()=>P();let k=!1;const f=new w("LIGHTER.js ROUTER *****");class x{constructor(t,e,s,r){h(this,"initRouter",async(t,e)=>{this.setRoute();let s=!1;if(this.curRoute.length<this.basePath.length&&(this.curRoute=this.basePath+"/",s=!0),!t){this.notFound();return}for(let i=0;i<t.length;i++){if(!t[i].route)throw f.error(`Route '${t[i].id}' is missing the route attribute.`),new Error("Call stack");if(t[i].route=this.basePath+t[i].route,t[i].redirect){if(t[i].redirect=this.basePath+t[i].redirect,t[i].redirect===t[i].route)throw f.error(`Route's redirect cannot be the same as the route '${t[i].route}'.`),new Error("Call stack");this._compareRoutes(t[i].route,this.curRoute)&&(this.curRoute=t[i].redirect,s=!0)}if(this._compareRoutes(t[i].route,this.curRoute,!0)&&t[i].beforeDraw){const u=await t[i].beforeDraw({route:t[i],curRouteData:this.curRouteData,curRoute:this.curRoute,basePath:this.basePath,commonData:this.commonData,prevRouteData:null,prevRoute:null});u&&(this.curRoute=this.basePath+u,s=!0)}}let r=!1;for(let i=0;i<t.length;i++){if(t[i].redirect){this.routes.push(t[i]);continue}if(!t[i].id)throw f.error("Route is missing the id attribute."),new Error("Call stack");if(this.langFn&&(t[i].titleKey?t[i].title=this.langFn(t[i].titleKey):f.warn(`Router has a langFn defined, but route '${t[i].id}' is missing the titleKey.`)),t[i].title||(f.warn(`Route '${t[i].id}' is missing the title. Setting id as title.`),t[i].title=t[i].id),t[i].attachId=e,this.routes.push(t[i]),this._compareRoutes(t[i].route,this.curRoute)&&!this.curRoute.includes(":")&&(t[i].attachId=e,this._createNewView(t[i]),r=!0,this.curRouteData=t[i],document.title=this._createPageTitle(t[i].title)),!r){const u=this._getRouteParams(this.routes[i].route,this.curRoute);u&&(t[i].attachId=e,this._createNewView(t[i]),r=!0,this.curRouteData=t[i],this.curRouteData.params=u,document.title=this._createPageTitle(t[i].title))}}if(r||this.notFound(),window.onpopstate=this.routeChangeListener,s){const i=this._createRouteState();window.history.pushState(i,"",this.curRoute),this.curHistoryState=i}k=!0});h(this,"routeChangeListener",t=>{this.setRoute(),this.changeRoute(this.curRoute,{forceUpdate:!0,ignoreBasePath:!0,doNotSetState:!0}),this.curHistoryState=t.state||{}});h(this,"_createPageTitle",t=>this.titlePrefix+t+this.titleSuffix);h(this,"_createRouteState",()=>{const t=Object.assign({},this.nextHistoryState);return this.nextHistoryState={},this.curHistoryState={},t});h(this,"replaceRoute",(t,e)=>{let s=this.basePath;e&&(s=""),t=s+t;const r=this._createRouteState();window.history.replaceState(r,"",t)});h(this,"setNextHistoryState",t=>{this.nextHistoryState=Object.assign(this.nextHistoryState,t)});h(this,"setCurHistoryState",t=>{this.curHistoryState=Object.assign(this.curHistoryState,t),window.history.replaceState(this.curHistoryState,"")});h(this,"getCurHistoryState",()=>this.curHistoryState);h(this,"changeRoute",async(t,e)=>{e||(e={});const s=e.forceUpdate,r=e.ignoreBasePath,i=e.doNotSetState,u=e.replaceState;let a=this.basePath;r&&(a=""),t=a+t;let g;for(let l=0;l<this.routes.length;l++)if(this._compareRoutes(this.routes[l].route,t,!0)&&this.routes[l].beforeDraw){g=await this.routes[l].beforeDraw({route:this.routes[l],curRouteData:this.curRouteData,curRoute:this.curRoute,basePath:this.basePath,commonData:this.commonData,prevRouteData:this.prevRouteData,prevRoute:this.prevRouteData}),g&&(t=a+g);break}for(let l=0;l<this.routes.length;l++)if(this.routes[l].redirect&&this._compareRoutes(this.routes[l].route,t)){t=this.routes[l].redirect;break}if(this._compareRoutes(t,this.curRoute)&&!s)return;if(s&&(this.curRouteData.component.discard(!0),this.curRouteData.component=null),!i&&!u){const l=this._createRouteState();window.history.pushState(l,"",t)}else u&&this.replaceRoute(t,!0);this.prevRoute=this.curRoute,this.setRoute();let S=!1;for(let l=0;l<this.routes.length;l++){if(this._compareRoutes(this.routes[l].route,t)&&!t.includes(":")){S=!0,this.prevRouteData=Object.assign({},this.curRouteData),this.curRouteData=this.routes[l],document.title=this._createPageTitle(this.routes[l].title),this._createNewView(this.routes[l]);break}const v=this._getRouteParams(this.routes[l].route,t);if(v){S=!0,this.prevRouteData=Object.assign({},this.curRouteData),this.curRouteData=this.routes[l],this.curRouteData.params=v,document.title=this._createPageTitle(this.routes[l].title),this._createNewView(this.routes[l]);break}}S||this.notFound(),this.rcCallback(this.curRoute)});h(this,"_compareRoutes",(t,e,s)=>{if(t=t.split("?")[0],e=e.split("?")[0],s&&(t.includes(":")||e.includes(":"))){const r=t.split("/"),i=e.split("/");let u=r.length;i.length>r.length&&(u=i.length);for(let a=0;a<u;a++)r[a]&&r[a].includes(":")?r[a]=i[a]:i[a]&&i[a].includes(":")&&(i[a]=r[a]);t=r.join("/"),e=i.join("/")}return t===e||t+"/"===e||t===e+"/"});h(this,"getRoute",t=>t?this.curRoute.replace(this.basePath,""):this.curRoute);h(this,"getRouteData",()=>({...this.curRouteData,prevRouteData:this.prevRouteData}));h(this,"getRouteParams",()=>this.curRouteData.params);h(this,"isCurrent",t=>this.basePath+t===this.curRoute||this.basePath+t===this.curRoute+"/"||this.basePath+t+"/"===this.curRoute);h(this,"setRoute",()=>{let t=location.pathname;t?(t.length>1&&t.substring(t.length-1,t.length)==="/"&&(t=t.substring(0,t.length-1)),this.curRoute=t):this.curRoute=this.basePath+"/"});h(this,"addRoute",t=>{t.route=this.basePath+t.route,this.routes.push(t),this._compareRoutes(t.route,this.curRoute)&&(this.curRouteData=t)});h(this,"notFound",()=>{let t;for(let e=0;e<this.routes.length;e++)this.routes[e].is404&&(t=this.routes[e]);if(!t)throw f.error("Could not find 404 template."),new Error("Call stack");this.prevRouteData=Object.assign({},this.curRouteData),this.curRouteData=t,document.title=this._createPageTitle(t.title),this._createNewView(t)});h(this,"draw",()=>{var t;(t=this.prevRouteData)!=null&&t.component&&(this.prevRouteData.component.discard(!0),this.prevRouteData.component=null),this.curRouteData.component.draw()});h(this,"_createNewView",t=>{var e,s;t.component=new t.source({...this.commonData,id:t.id,attachId:t.attachId,title:t.title,template:t.template,extraRouteData:t.extraRouteData}),(s=(e=t.component)==null?void 0:e.parent)!=null&&s.elem||(t.component.parent=t.component.getComponentById(t.attachId))});h(this,"_getRouteParams",(t,e)=>{if(!t.includes(":"))return!1;const s=t.split("/");e=e.split("?")[0];const r=e.split("/");let i=s.length;r.length>s.length&&(i=r.length);let u={};for(let a=0;a<i;a++)if(s[a]&&s[a].includes(":")){if(!r[a])return!1;const g=s[a].replace(":","");u[g]=r[a]}else if(!s[a]===void 0||!r[a]===void 0||s[a]!==r[a])return!1;return u});if(k)throw f.error("Router has already been initiated. Only one router per app is allowed."),new Error("Call stack");if(!t||!t.routes||!t.routes.length)throw f.error(`Missing routesData parameter, routesData.routes, or routesData.routes is empty.
Required params: new Route(routesData, attachId, rcCallback);`),new Error("Call stack");if(!e)throw f.error(`Missing attachId parameter.
Required params: new Route(routesData, attachId, rcCallback);`),new Error("Call stack");if(!s)throw f.error(`Missing rcCallback (route change callback) parameter / function.
Required params: new Route(routesData, attachId, rcCallback);`),new Error("Call stack");o.RouterRef=this,this.routes=[],this.nextHistoryState={},this.curHistoryState={},this.basePath=t.basePath||"",this.titlePrefix=t.titlePrefix||"",this.titleSuffix=t.titleSuffix||"",this.langFn=t.langFn,this.curRoute=this.basePath+"/",this.rcCallback=s,this.redirectRoute=null,this.curRouteData={route:this.basePath+"/",source:null,params:{},component:null},this.prevRoute=null,this.prevRouteData=null,r||(r={}),this.commonData=r,this.initRouter(t.routes,e)}}o.RouterRef=null;const O=n=>f.setCallback(n),T=n=>n?f.turnOff():f.turnOn(),p={},R=new w("LIGHTER.js COMPO *****");class y{constructor(t){h(this,"draw",t=>{if(this.drawing||this.discarding)return;this.drawing=!0;const e={...this.props,...t};this.props=e,this.elem&&this.discard(),this._checkParentAndAttachId(),!this.template!==e.template&&(this.template=e.template||this._createDefaultTemplate(e)),this._createElement(),e.prepend?this.parent.elem.prepend(this.elem):this.parent.elem.append(this.elem),this.paint(e),this.addListeners(e);for(let s=0;s<this.listenersToAdd.length;s++)this.listenersToAdd[s].targetId&&(this.listenersToAdd[s].target=this.getComponentElemById(this.listenersToAdd[s].targetId)),this.addListener(this.listenersToAdd[s]);return this.listenersToAdd=[],this.drawing=!1,this});h(this,"add",t=>{let e=t;return e.isComponent||(e=new y(t)),this.children[e.id]=e,e.props.attachId||(e.parent=this),e});h(this,"addListener",t=>{let{id:e,target:s,type:r,fn:i}=t;if(!r||!i)throw R.error(`Could not add listener, type, and/or fn missing. Listener props: ${JSON.stringify(t)}`,this),new Error("Call stack");if(e||(e=this.id,t.id=e),!s){if(s=this.elem,s===null)throw R.error(`Could not add listener, target elem was given but is null. Listener props: ${JSON.stringify(t)}`,this),new Error("Call stack");t.target=s}this.listeners[e]&&this.removeListener(e),s&&(s.addEventListener(r,i),this.listeners[e]=t)});h(this,"removeListener",t=>{if(!t)throw R.error(`Could not remove listener, id missing. Listener props: ${JSON.stringify(t)}`,this),new Error("Call stack");const{target:e,type:s,fn:r}=this.listeners[t];e.removeEventListener(s,r),delete this.listeners[t]});h(this,"discard",t=>{if(this.discarding)return;this.discarding=!0;let e=Object.keys(this.listeners);for(let s=0;s<e.length;s++)this.removeListener(e[s]);e=Object.keys(this.children);for(let s=0;s<e.length;s++)this.children[e[s]].discard(t),t&&delete this.children[e[s]];this.elem&&(this.elem.remove(),this.elem=null),t&&delete p[this.id],this.discarding=!1});h(this,"_setElemData",(t,e)=>{var s;if(!(!t||!e)){if((s=e.classes)!=null&&s.length&&t.classList.add(...e.classes),e.attributes){const r=Object.keys(e.attributes);for(let i=0;i<r.length;i++)t.setAttribute(r[i],e.attributes[r[i]])}if(e.style){const r=Object.keys(e.style);for(let i=0;i<r.length;i++)t.style[r[i]]=e.style[r[i]]}e.text&&(t.innerText=e.text),e._id&&!t.getAttribute("id")&&t.setAttribute("id",e._id)}});h(this,"_createDefaultTemplate",t=>t!=null&&t.tag?`<${t.tag}></${t.tag}>`:"<div></div>");h(this,"_createElement",()=>{const t=document.createElement("template");t.innerHTML=this.template,this.elem=t.content.firstChild,this._setElemData(this.elem,this.props)});h(this,"getComponentById",t=>p[t]);h(this,"getComponentElemById",t=>{const e=p[t];return e!=null&&e.elem?e.elem:document.getElementById(t)});h(this,"_checkParentAndAttachId",()=>{if(!this.parent&&!this.props.attachId)throw R.error('Component does not have a parent nor does it have an "attachId" as a prop. One of these is required. Either pass in an "attachId" as prop or attach this component to the parent component with "parentComponent.add()" method.'),new Error("Call stack")});if(t!=null&&t.parent||t!=null&&t.children)throw R.error(`Component props contains a reserved keyword (parent or children. Props: ${JSON.stringify(t)}`),new Error("Invalid Component props key.");t!=null&&t.id||t!=null&&t._id?this.id=t.id||t._id:this.id=P(),this.props={id:this.id,...t},p[this.id]=this,this.elem,this.parent,this.children={},this.listeners={},this.listenersToAdd=[],this.drawing=!1,this.discarding=!1,this.isComponent=!0,this.props.attachId&&(this.parent?this.parent.elem=this.getComponentElemById(this.props.attachId):this.parent={elem:this.getComponentElemById(this.props.attachId)}),this.router=o.RouterRef,this.template=(t==null?void 0:t.template)||this._createDefaultTemplate(t),t!=null&&t.preCreateElement&&this._createElement()}paint(){}addListeners(){}}const A=n=>R.setCallback(n),j=n=>n?R.turnOff():R.turnOn(),m={};class U{constructor(t){this.initState=t,this.state=t||{},this.listeners=[],this.listenerCallbacks=[]}set(t,e,s,r){if(!t)return;const i=t.split(".");let u;if(i.length===1){if(r){m[t]=e;return}u=this.state[i[i.length-1]],this.state[t]=e,this._checkListeners(u,e,t);return}let a=r?m[i[0]]:this.state[i[0]];a===void 0&&(r?m[i[0]]=a={}:this.state[i[0]]=a={});for(let g=1;g<i.length-1;g++)a[i[g]]===void 0&&(a[i[g]]={}),a=a[i[g]];r?a[i[i.length-1]]=e:(u=a[i[i.length-1]],a[i[i.length-1]]=e,this._checkListeners(u,e,t)),s&&!r&&this.addListener(t,s)}get(t,e){if(!t)return;const s=t.split(".");if(s.length===1)return e?m[t]:this.state[t];let r=e?m[s[0]]:this.state[s[0]];for(let i=1;i<s.length;i++){if(r===void 0||r[s[i]]===void 0)return;r=r[s[i]]}return r}remove(t,e){if(!t)return;e||this.removeListener(t);const s=t.split(".");if(s.length===1){if(e){if(m[t]===void 0)return;delete m[t];return}if(this.state[t]===void 0)return;delete this.state[t];return}let r=e?m[s[0]]:this.state[s[0]];for(let i=1;i<s.length-1;i++){if(r===void 0||r[s[i]]===void 0)return;r=r[s[i]]}r!==void 0&&delete r[s[s.length-1]]}getObject(){return this.state}addListener(t,e){this.listeners.push(t),this.listenerCallbacks.push(e)}removeListener(t){const e=this.listeners.indexOf(t);e>-1&&(this.listeners.splice(e,1),this.listenerCallbacks.splice(e,1))}_checkListeners(t,e,s){if(t===e)return;const r=this.listeners.indexOf(s);r>-1&&this.listenerCallbacks[r](e,t)}getKeys(t){if(!t)return Object.keys(this.state);const e=t.split(".");let s=this.state[e[0]];for(let r=1;r<e.length-1;r++){if(s===void 0||s[e[r]]===void 0)return;s=s[e[r]]}return s===void 0?[]:Object.keys(s)}getG(t){return this.get(t,!0)}getGObject(){return m}setG(t,e){this.set(t,e,null,!0)}removeG(t){this.remove(t,!0)}}o.Component=y,o.LocalStorage=L,o.Logger=w,o.Router=x,o.SessionStorage=E,o.State=U,o.createUUID=D,o.isComponentLoggerQuiet=j,o.isRouterLoggerQuiet=T,o.setComponentLoggerCallback=A,o.setRouterLoggerCallback=O,Object.defineProperty(o,Symbol.toStringTag,{value:"Module"})});
