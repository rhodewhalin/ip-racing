(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();var ye=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function yl(i){if(i.__esModule)return i;var t=i.default;if(typeof t=="function"){var e=function n(){return this instanceof n?Reflect.construct(t,arguments,this.constructor):t.apply(this,arguments)};e.prototype=t.prototype}else e={};return Object.defineProperty(e,"__esModule",{value:!0}),Object.keys(i).forEach(function(n){var r=Object.getOwnPropertyDescriptor(i,n);Object.defineProperty(e,n,r.get?r:{enumerable:!0,get:function(){return i[n]}})}),e}var zc={};ArrayBuffer.isView||(ArrayBuffer.isView=i=>i!==null&&typeof i=="object"&&i.buffer instanceof ArrayBuffer);typeof globalThis>"u"&&typeof window<"u"&&(window.globalThis=window);var Hi={},ms={};(function(i){Object.defineProperty(i,"__esModule",{value:!0}),i.ServerError=i.CloseCode=void 0,function(e){e[e.CONSENTED=4e3]="CONSENTED",e[e.DEVMODE_RESTART=4010]="DEVMODE_RESTART"}(i.CloseCode||(i.CloseCode={}));class t extends Error{constructor(n,r){super(r),this.name="ServerError",this.code=n}}i.ServerError=t})(ms);var Mr={},Gi={};Object.defineProperty(Gi,"__esModule",{value:!0});Gi.decode=Gi.encode=void 0;function Zi(i,t){if(this._offset=t,i instanceof ArrayBuffer)this._buffer=i,this._view=new DataView(this._buffer);else if(ArrayBuffer.isView(i))this._buffer=i.buffer,this._view=new DataView(this._buffer,i.byteOffset,i.byteLength);else throw new Error("Invalid argument")}function Sl(i,t,e){for(var n="",r=0,s=t,a=t+e;s<a;s++){var o=i.getUint8(s);if(!(o&128)){n+=String.fromCharCode(o);continue}if((o&224)===192){n+=String.fromCharCode((o&31)<<6|i.getUint8(++s)&63);continue}if((o&240)===224){n+=String.fromCharCode((o&15)<<12|(i.getUint8(++s)&63)<<6|(i.getUint8(++s)&63)<<0);continue}if((o&248)===240){r=(o&7)<<18|(i.getUint8(++s)&63)<<12|(i.getUint8(++s)&63)<<6|(i.getUint8(++s)&63)<<0,r>=65536?(r-=65536,n+=String.fromCharCode((r>>>10)+55296,(r&1023)+56320)):n+=String.fromCharCode(r);continue}throw new Error("Invalid byte "+o.toString(16))}return n}Zi.prototype._array=function(i){for(var t=new Array(i),e=0;e<i;e++)t[e]=this._parse();return t};Zi.prototype._map=function(i){for(var t="",e={},n=0;n<i;n++)t=this._parse(),e[t]=this._parse();return e};Zi.prototype._str=function(i){var t=Sl(this._view,this._offset,i);return this._offset+=i,t};Zi.prototype._bin=function(i){var t=this._buffer.slice(this._offset,this._offset+i);return this._offset+=i,t};Zi.prototype._parse=function(){var i=this._view.getUint8(this._offset++),t,e=0,n=0,r=0,s=0;if(i<192)return i<128?i:i<144?this._map(i&15):i<160?this._array(i&15):this._str(i&31);if(i>223)return(255-i+1)*-1;switch(i){case 192:return null;case 194:return!1;case 195:return!0;case 196:return e=this._view.getUint8(this._offset),this._offset+=1,this._bin(e);case 197:return e=this._view.getUint16(this._offset),this._offset+=2,this._bin(e);case 198:return e=this._view.getUint32(this._offset),this._offset+=4,this._bin(e);case 199:if(e=this._view.getUint8(this._offset),n=this._view.getInt8(this._offset+1),this._offset+=2,n===-1){var a=this._view.getUint32(this._offset);return r=this._view.getInt32(this._offset+4),s=this._view.getUint32(this._offset+8),this._offset+=12,new Date((r*4294967296+s)*1e3+a/1e6)}return[n,this._bin(e)];case 200:return e=this._view.getUint16(this._offset),n=this._view.getInt8(this._offset+2),this._offset+=3,[n,this._bin(e)];case 201:return e=this._view.getUint32(this._offset),n=this._view.getInt8(this._offset+4),this._offset+=5,[n,this._bin(e)];case 202:return t=this._view.getFloat32(this._offset),this._offset+=4,t;case 203:return t=this._view.getFloat64(this._offset),this._offset+=8,t;case 204:return t=this._view.getUint8(this._offset),this._offset+=1,t;case 205:return t=this._view.getUint16(this._offset),this._offset+=2,t;case 206:return t=this._view.getUint32(this._offset),this._offset+=4,t;case 207:return r=this._view.getUint32(this._offset)*Math.pow(2,32),s=this._view.getUint32(this._offset+4),this._offset+=8,r+s;case 208:return t=this._view.getInt8(this._offset),this._offset+=1,t;case 209:return t=this._view.getInt16(this._offset),this._offset+=2,t;case 210:return t=this._view.getInt32(this._offset),this._offset+=4,t;case 211:return r=this._view.getInt32(this._offset)*Math.pow(2,32),s=this._view.getUint32(this._offset+4),this._offset+=8,r+s;case 212:if(n=this._view.getInt8(this._offset),this._offset+=1,n===0){this._offset+=1;return}return[n,this._bin(1)];case 213:return n=this._view.getInt8(this._offset),this._offset+=1,[n,this._bin(2)];case 214:return n=this._view.getInt8(this._offset),this._offset+=1,n===-1?(t=this._view.getUint32(this._offset),this._offset+=4,new Date(t*1e3)):[n,this._bin(4)];case 215:if(n=this._view.getInt8(this._offset),this._offset+=1,n===0)return r=this._view.getInt32(this._offset)*Math.pow(2,32),s=this._view.getUint32(this._offset+4),this._offset+=8,new Date(r+s);if(n===-1){r=this._view.getUint32(this._offset),s=this._view.getUint32(this._offset+4),this._offset+=8;var o=(r&3)*4294967296+s;return new Date(o*1e3+(r>>>2)/1e6)}return[n,this._bin(8)];case 216:return n=this._view.getInt8(this._offset),this._offset+=1,[n,this._bin(16)];case 217:return e=this._view.getUint8(this._offset),this._offset+=1,this._str(e);case 218:return e=this._view.getUint16(this._offset),this._offset+=2,this._str(e);case 219:return e=this._view.getUint32(this._offset),this._offset+=4,this._str(e);case 220:return e=this._view.getUint16(this._offset),this._offset+=2,this._array(e);case 221:return e=this._view.getUint32(this._offset),this._offset+=4,this._array(e);case 222:return e=this._view.getUint16(this._offset),this._offset+=2,this._map(e);case 223:return e=this._view.getUint32(this._offset),this._offset+=4,this._map(e)}throw new Error("Could not parse")};function El(i,t=0){var e=new Zi(i,t),n=e._parse();if(e._offset!==i.byteLength)throw new Error(i.byteLength-e._offset+" trailing bytes");return n}Gi.decode=El;var Tl=4294967296-1,Al=17179869184-1;function wl(i,t,e){for(var n=0,r=0,s=e.length;r<s;r++)n=e.charCodeAt(r),n<128?i.setUint8(t++,n):n<2048?(i.setUint8(t++,192|n>>6),i.setUint8(t++,128|n&63)):n<55296||n>=57344?(i.setUint8(t++,224|n>>12),i.setUint8(t++,128|n>>6&63),i.setUint8(t++,128|n&63)):(r++,n=65536+((n&1023)<<10|e.charCodeAt(r)&1023),i.setUint8(t++,240|n>>18),i.setUint8(t++,128|n>>12&63),i.setUint8(t++,128|n>>6&63),i.setUint8(t++,128|n&63))}function bl(i){for(var t=0,e=0,n=0,r=i.length;n<r;n++)t=i.charCodeAt(n),t<128?e+=1:t<2048?e+=2:t<55296||t>=57344?e+=3:(n++,e+=4);return e}function Ui(i,t,e){var n=typeof e,r=0,s=0,a=0,o=0,c=0,h=0;if(n==="string"){if(c=bl(e),c<32)i.push(c|160),h=1;else if(c<256)i.push(217,c),h=2;else if(c<65536)i.push(218,c>>8,c),h=3;else if(c<4294967296)i.push(219,c>>24,c>>16,c>>8,c),h=5;else throw new Error("String too long");return t.push({_str:e,_length:c,_offset:i.length}),h+c}if(n==="number")return Math.floor(e)!==e||!isFinite(e)?(i.push(203),t.push({_float:e,_length:8,_offset:i.length}),9):e>=0?e<128?(i.push(e),1):e<256?(i.push(204,e),2):e<65536?(i.push(205,e>>8,e),3):e<4294967296?(i.push(206,e>>24,e>>16,e>>8,e),5):(a=e/Math.pow(2,32)>>0,o=e>>>0,i.push(207,a>>24,a>>16,a>>8,a,o>>24,o>>16,o>>8,o),9):e>=-32?(i.push(e),1):e>=-128?(i.push(208,e),2):e>=-32768?(i.push(209,e>>8,e),3):e>=-2147483648?(i.push(210,e>>24,e>>16,e>>8,e),5):(a=Math.floor(e/Math.pow(2,32)),o=e>>>0,i.push(211,a>>24,a>>16,a>>8,a,o>>24,o>>16,o>>8,o),9);if(n==="object"){if(e===null)return i.push(192),1;if(Array.isArray(e)){if(c=e.length,c<16)i.push(c|144),h=1;else if(c<65536)i.push(220,c>>8,c),h=3;else if(c<4294967296)i.push(221,c>>24,c>>16,c>>8,c),h=5;else throw new Error("Array too large");for(r=0;r<c;r++)h+=Ui(i,t,e[r]);return h}if(e instanceof Date){var u=e.getTime(),f=Math.floor(u/1e3),p=(u-f*1e3)*1e6;return f>=0&&p>=0&&f<=Al?p===0&&f<=Tl?(i.push(214,255,f>>24,f>>16,f>>8,f),6):(a=f/4294967296,o=f&4294967295,i.push(215,255,p>>22,p>>14,p>>6,a,o>>24,o>>16,o>>8,o),10):(a=Math.floor(f/4294967296),o=f>>>0,i.push(199,12,255,p>>24,p>>16,p>>8,p,a>>24,a>>16,a>>8,a,o>>24,o>>16,o>>8,o),15)}if(e instanceof ArrayBuffer){if(c=e.byteLength,c<256)i.push(196,c),h=2;else if(c<65536)i.push(197,c>>8,c),h=3;else if(c<4294967296)i.push(198,c>>24,c>>16,c>>8,c),h=5;else throw new Error("Buffer too large");return t.push({_bin:e,_length:c,_offset:i.length}),h+c}if(typeof e.toJSON=="function")return Ui(i,t,e.toJSON());var _=[],x="",y=Object.keys(e);for(r=0,s=y.length;r<s;r++)x=y[r],e[x]!==void 0&&typeof e[x]!="function"&&_.push(x);if(c=_.length,c<16)i.push(c|128),h=1;else if(c<65536)i.push(222,c>>8,c),h=3;else if(c<4294967296)i.push(223,c>>24,c>>16,c>>8,c),h=5;else throw new Error("Object too large");for(r=0;r<c;r++)x=_[r],h+=Ui(i,t,x),h+=Ui(i,t,e[x]);return h}if(n==="boolean")return i.push(e?195:194),1;if(n==="undefined")return i.push(192),1;if(typeof e.toJSON=="function")return Ui(i,t,e.toJSON());throw new Error("Could not encode")}function Rl(i){var t=[],e=[],n=Ui(t,e,i),r=new ArrayBuffer(n),s=new DataView(r),a=0,o=0,c=-1;e.length>0&&(c=e[0]._offset);for(var h,u=0,f=0,p=0,_=t.length;p<_;p++)if(s.setUint8(o+p,t[p]),p+1===c){if(h=e[a],u=h._length,f=o+c,h._bin)for(var x=new Uint8Array(h._bin),y=0;y<u;y++)s.setUint8(f+y,x[y]);else h._str?wl(s,f,h._str):h._float!==void 0&&s.setFloat64(f,h._float);a++,o+=u,e[a]&&(c=e[a]._offset)}return r}Gi.encode=Rl;var gs={},_s={},Cl=function(){throw new Error("ws does not work in the browser. Browser clients must use the native WebSocket object")},Pl=ye&&ye.__importDefault||function(i){return i&&i.__esModule?i:{default:i}};Object.defineProperty(_s,"__esModule",{value:!0});_s.WebSocketTransport=void 0;const Il=Pl(Cl),ws=globalThis.WebSocket||Il.default;class Ll{constructor(t){this.events=t}send(t){t instanceof ArrayBuffer?this.ws.send(t):Array.isArray(t)&&this.ws.send(new Uint8Array(t).buffer)}connect(t,e){try{this.ws=new ws(t,{headers:e,protocols:this.protocols})}catch{this.ws=new ws(t,this.protocols)}this.ws.binaryType="arraybuffer",this.ws.onopen=this.events.onopen,this.ws.onmessage=this.events.onmessage,this.ws.onclose=this.events.onclose,this.ws.onerror=this.events.onerror}close(t,e){this.ws.close(t,e)}get isOpen(){return this.ws.readyState===ws.OPEN}}_s.WebSocketTransport=Ll;Object.defineProperty(gs,"__esModule",{value:!0});gs.Connection=void 0;const Dl=_s;class Ul{constructor(){this.events={},this.transport=new Dl.WebSocketTransport(this.events)}send(t){this.transport.send(t)}connect(t,e){this.transport.connect(t,e)}close(t,e){this.transport.close(t,e)}get isOpen(){return this.transport.isOpen}}gs.Connection=Ul;var eo={};(function(i){Object.defineProperty(i,"__esModule",{value:!0}),i.utf8Length=i.utf8Read=i.ErrorCode=i.Protocol=void 0,function(n){n[n.HANDSHAKE=9]="HANDSHAKE",n[n.JOIN_ROOM=10]="JOIN_ROOM",n[n.ERROR=11]="ERROR",n[n.LEAVE_ROOM=12]="LEAVE_ROOM",n[n.ROOM_DATA=13]="ROOM_DATA",n[n.ROOM_STATE=14]="ROOM_STATE",n[n.ROOM_STATE_PATCH=15]="ROOM_STATE_PATCH",n[n.ROOM_DATA_SCHEMA=16]="ROOM_DATA_SCHEMA",n[n.ROOM_DATA_BYTES=17]="ROOM_DATA_BYTES"}(i.Protocol||(i.Protocol={})),function(n){n[n.MATCHMAKE_NO_HANDLER=4210]="MATCHMAKE_NO_HANDLER",n[n.MATCHMAKE_INVALID_CRITERIA=4211]="MATCHMAKE_INVALID_CRITERIA",n[n.MATCHMAKE_INVALID_ROOM_ID=4212]="MATCHMAKE_INVALID_ROOM_ID",n[n.MATCHMAKE_UNHANDLED=4213]="MATCHMAKE_UNHANDLED",n[n.MATCHMAKE_EXPIRED=4214]="MATCHMAKE_EXPIRED",n[n.AUTH_FAILED=4215]="AUTH_FAILED",n[n.APPLICATION_ERROR=4216]="APPLICATION_ERROR"}(i.ErrorCode||(i.ErrorCode={}));function t(n,r){const s=n[r++];for(var a="",o=0,c=r,h=r+s;c<h;c++){var u=n[c];if(!(u&128)){a+=String.fromCharCode(u);continue}if((u&224)===192){a+=String.fromCharCode((u&31)<<6|n[++c]&63);continue}if((u&240)===224){a+=String.fromCharCode((u&15)<<12|(n[++c]&63)<<6|(n[++c]&63)<<0);continue}if((u&248)===240){o=(u&7)<<18|(n[++c]&63)<<12|(n[++c]&63)<<6|(n[++c]&63)<<0,o>=65536?(o-=65536,a+=String.fromCharCode((o>>>10)+55296,(o&1023)+56320)):a+=String.fromCharCode(o);continue}throw new Error("Invalid byte "+u.toString(16))}return a}i.utf8Read=t;function e(n=""){let r=0,s=0;for(let a=0,o=n.length;a<o;a++)r=n.charCodeAt(a),r<128?s+=1:r<2048?s+=2:r<55296||r>=57344?s+=3:(a++,s+=4);return s+1}i.utf8Length=e})(eo);var si={};Object.defineProperty(si,"__esModule",{value:!0});si.getSerializer=si.registerSerializer=void 0;const kc={};function Nl(i,t){kc[i]=t}si.registerSerializer=Nl;function Ol(i){const t=kc[i];if(!t)throw new Error("missing serializer: "+i);return t}si.getSerializer=Ol;var yr={};Object.defineProperty(yr,"__esModule",{value:!0});yr.createNanoEvents=void 0;const Fl=()=>({emit(i,...t){let e=this.events[i]||[];for(let n=0,r=e.length;n<r;n++)e[n](...t)},events:{},on(i,t){var e;return!((e=this.events[i])===null||e===void 0)&&e.push(t)||(this.events[i]=[t]),()=>{var n;this.events[i]=(n=this.events[i])===null||n===void 0?void 0:n.filter(r=>t!==r)}}});yr.createNanoEvents=Fl;var Vi={};Object.defineProperty(Vi,"__esModule",{value:!0});Vi.createSignal=Vi.EventEmitter=void 0;class Hc{constructor(){this.handlers=[]}register(t,e=!1){return this.handlers.push(t),this}invoke(...t){this.handlers.forEach(e=>e.apply(this,t))}invokeAsync(...t){return Promise.all(this.handlers.map(e=>e.apply(this,t)))}remove(t){const e=this.handlers.indexOf(t);this.handlers[e]=this.handlers[this.handlers.length-1],this.handlers.pop()}clear(){this.handlers=[]}}Vi.EventEmitter=Hc;function Bl(){const i=new Hc;function t(e){return i.register(e,this===null)}return t.once=e=>{const n=function(...r){e.apply(this,r),i.remove(n)};i.register(n)},t.remove=e=>i.remove(e),t.invoke=(...e)=>i.invoke(...e),t.invokeAsync=(...e)=>i.invokeAsync(...e),t.clear=()=>i.clear(),t}Vi.createSignal=Bl;var ha={exports:{}};(function(i,t){(function(e,n){n(t)})(ye,function(e){var n=function(m,l){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(g,E){g.__proto__=E}||function(g,E){for(var B in E)Object.prototype.hasOwnProperty.call(E,B)&&(g[B]=E[B])},n(m,l)};function r(m,l){if(typeof l!="function"&&l!==null)throw new TypeError("Class extends value "+String(l)+" is not a constructor or null");n(m,l);function g(){this.constructor=m}m.prototype=l===null?Object.create(l):(g.prototype=l.prototype,new g)}function s(m,l,g,E){var B=arguments.length,K=B<3?l:E,It;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")K=Reflect.decorate(m,l,g,E);else for(var wt=m.length-1;wt>=0;wt--)(It=m[wt])&&(K=(B<3?It(K):B>3?It(l,g,K):It(l,g))||K);return B>3&&K&&Object.defineProperty(l,g,K),K}function a(m,l,g){if(arguments.length===2)for(var E=0,B=l.length,K;E<B;E++)(K||!(E in l))&&(K||(K=Array.prototype.slice.call(l,0,E)),K[E]=l[E]);return m.concat(K||Array.prototype.slice.call(l))}typeof SuppressedError=="function"&&SuppressedError;var o=255,c=213;e.OPERATION=void 0,function(m){m[m.ADD=128]="ADD",m[m.REPLACE=0]="REPLACE",m[m.DELETE=64]="DELETE",m[m.DELETE_AND_ADD=192]="DELETE_AND_ADD",m[m.TOUCH=1]="TOUCH",m[m.CLEAR=10]="CLEAR"}(e.OPERATION||(e.OPERATION={}));var h=function(){function m(l,g,E){this.changed=!1,this.changes=new Map,this.allChanges=new Set,this.caches={},this.currentCustomOperation=0,this.ref=l,this.setParent(g,E)}return m.prototype.setParent=function(l,g,E){var B=this;if(this.indexes||(this.indexes=this.ref instanceof Gt?this.ref._definition.indexes:{}),this.parent=l,this.parentIndex=E,!!g)if(this.root=g,this.ref instanceof Gt){var K=this.ref._definition;for(var It in K.schema){var wt=this.ref[It];if(wt&&wt.$changes){var ee=K.indexes[It];wt.$changes.setParent(this.ref,g,ee)}}}else typeof this.ref=="object"&&this.ref.forEach(function(jt,Lt){if(jt instanceof Gt){var M=jt.$changes,P=B.ref.$changes.indexes[Lt];M.setParent(B.ref,B.root,P)}})},m.prototype.operation=function(l){this.changes.set(--this.currentCustomOperation,l)},m.prototype.change=function(l,g){g===void 0&&(g=e.OPERATION.ADD);var E=typeof l=="number"?l:this.indexes[l];this.assertValidIndex(E,l);var B=this.changes.get(E);(!B||B.op===e.OPERATION.DELETE||B.op===e.OPERATION.TOUCH)&&this.changes.set(E,{op:B&&B.op===e.OPERATION.DELETE?e.OPERATION.DELETE_AND_ADD:g,index:E}),this.allChanges.add(E),this.changed=!0,this.touchParents()},m.prototype.touch=function(l){var g=typeof l=="number"?l:this.indexes[l];this.assertValidIndex(g,l),this.changes.has(g)||this.changes.set(g,{op:e.OPERATION.TOUCH,index:g}),this.allChanges.add(g),this.touchParents()},m.prototype.touchParents=function(){this.parent&&this.parent.$changes.touch(this.parentIndex)},m.prototype.getType=function(l){if(this.ref._definition){var g=this.ref._definition;return g.schema[g.fieldsByIndex[l]]}else{var g=this.parent._definition,E=g.schema[g.fieldsByIndex[this.parentIndex]];return Object.values(E)[0]}},m.prototype.getChildrenFilter=function(){var l=this.parent._definition.childFilters;return l&&l[this.parentIndex]},m.prototype.getValue=function(l){return this.ref.getByIndex(l)},m.prototype.delete=function(l){var g=typeof l=="number"?l:this.indexes[l];if(g===void 0){console.warn("@colyseus/schema ".concat(this.ref.constructor.name,": trying to delete non-existing index: ").concat(l," (").concat(g,")"));return}var E=this.getValue(g);this.changes.set(g,{op:e.OPERATION.DELETE,index:g}),this.allChanges.delete(g),delete this.caches[g],E&&E.$changes&&(E.$changes.parent=void 0),this.changed=!0,this.touchParents()},m.prototype.discard=function(l,g){var E=this;l===void 0&&(l=!1),g===void 0&&(g=!1),this.ref instanceof Gt||this.changes.forEach(function(B){if(B.op===e.OPERATION.DELETE){var K=E.ref.getIndex(B.index);delete E.indexes[K]}}),this.changes.clear(),this.changed=l,g&&this.allChanges.clear(),this.currentCustomOperation=0},m.prototype.discardAll=function(){var l=this;this.changes.forEach(function(g){var E=l.getValue(g.index);E&&E.$changes&&E.$changes.discardAll()}),this.discard()},m.prototype.cache=function(l,g){this.caches[l]=g},m.prototype.clone=function(){return new m(this.ref,this.parent,this.root)},m.prototype.ensureRefId=function(){this.refId===void 0&&(this.refId=this.root.getNextUniqueId())},m.prototype.assertValidIndex=function(l,g){if(l===void 0)throw new Error('ChangeTree: missing index for field "'.concat(g,'"'))},m}();function u(m,l,g,E){return m[l]||(m[l]=[]),m[l].push(g),E==null||E.forEach(function(B,K){return g(B,K)}),function(){return p(m[l],m[l].indexOf(g))}}function f(m){var l=this,g=typeof this.$changes.getType()!="string";this.$items.forEach(function(E,B){m.push({refId:l.$changes.refId,op:e.OPERATION.DELETE,field:B,value:void 0,previousValue:E}),g&&l.$changes.root.removeRef(E.$changes.refId)})}function p(m,l){if(l===-1||l>=m.length)return!1;for(var g=m.length-1,E=l;E<g;E++)m[E]=m[E+1];return m.length=g,!0}var _=function(m,l){var g=m.toString(),E=l.toString();return g<E?-1:g>E?1:0};function x(m){return m.$proxy=!0,m=new Proxy(m,{get:function(l,g){return typeof g!="symbol"&&!isNaN(g)?l.at(g):l[g]},set:function(l,g,E){if(typeof g!="symbol"&&!isNaN(g)){var B=Array.from(l.$items.keys()),K=parseInt(B[g]||g);E==null?l.deleteAt(K):l.setAt(K,E)}else l[g]=E;return!0},deleteProperty:function(l,g){return typeof g=="number"?l.deleteAt(g):delete l[g],!0},has:function(l,g){return typeof g!="symbol"&&!isNaN(Number(g))?l.$items.has(Number(g)):Reflect.has(l,g)}}),m}var y=function(){function m(){for(var l=[],g=0;g<arguments.length;g++)l[g]=arguments[g];this.$changes=new h(this),this.$items=new Map,this.$indexes=new Map,this.$refId=0,this.push.apply(this,l)}return m.prototype.onAdd=function(l,g){return g===void 0&&(g=!0),u(this.$callbacks||(this.$callbacks={}),e.OPERATION.ADD,l,g?this.$items:void 0)},m.prototype.onRemove=function(l){return u(this.$callbacks||(this.$callbacks={}),e.OPERATION.DELETE,l)},m.prototype.onChange=function(l){return u(this.$callbacks||(this.$callbacks={}),e.OPERATION.REPLACE,l)},m.is=function(l){return Array.isArray(l)||l.array!==void 0},Object.defineProperty(m.prototype,"length",{get:function(){return this.$items.size},set:function(l){l===0?this.clear():this.splice(l,this.length-l)},enumerable:!1,configurable:!0}),m.prototype.push=function(){for(var l=this,g=[],E=0;E<arguments.length;E++)g[E]=arguments[E];var B;return g.forEach(function(K){B=l.$refId++,l.setAt(B,K)}),B},m.prototype.pop=function(){var l=Array.from(this.$indexes.values()).pop();if(l!==void 0){this.$changes.delete(l),this.$indexes.delete(l);var g=this.$items.get(l);return this.$items.delete(l),g}},m.prototype.at=function(l){if(l=Math.trunc(l)||0,l<0&&(l+=this.length),!(l<0||l>=this.length)){var g=Array.from(this.$items.keys())[l];return this.$items.get(g)}},m.prototype.setAt=function(l,g){var E,B;if(g==null){console.error("ArraySchema items cannot be null nor undefined; Use `deleteAt(index)` instead.");return}if(this.$items.get(l)!==g){g.$changes!==void 0&&g.$changes.setParent(this,this.$changes.root,l);var K=(B=(E=this.$changes.indexes[l])===null||E===void 0?void 0:E.op)!==null&&B!==void 0?B:e.OPERATION.ADD;this.$changes.indexes[l]=l,this.$indexes.set(l,l),this.$items.set(l,g),this.$changes.change(l,K)}},m.prototype.deleteAt=function(l){var g=Array.from(this.$items.keys())[l];return g===void 0?!1:this.$deleteAt(g)},m.prototype.$deleteAt=function(l){return this.$changes.delete(l),this.$indexes.delete(l),this.$items.delete(l)},m.prototype.clear=function(l){this.$changes.discard(!0,!0),this.$changes.indexes={},this.$indexes.clear(),l&&f.call(this,l),this.$items.clear(),this.$changes.operation({index:0,op:e.OPERATION.CLEAR}),this.$changes.touchParents()},m.prototype.concat=function(){for(var l,g=[],E=0;E<arguments.length;E++)g[E]=arguments[E];return new(m.bind.apply(m,a([void 0],(l=Array.from(this.$items.values())).concat.apply(l,g),!1)))},m.prototype.join=function(l){return Array.from(this.$items.values()).join(l)},m.prototype.reverse=function(){var l=this,g=Array.from(this.$items.keys()),E=Array.from(this.$items.values()).reverse();return E.forEach(function(B,K){l.setAt(g[K],B)}),this},m.prototype.shift=function(){var l=Array.from(this.$items.keys()),g=l.shift();if(g!==void 0){var E=this.$items.get(g);return this.$deleteAt(g),E}},m.prototype.slice=function(l,g){var E=new m;return E.push.apply(E,Array.from(this.$items.values()).slice(l,g)),E},m.prototype.sort=function(l){var g=this;l===void 0&&(l=_);var E=Array.from(this.$items.keys()),B=Array.from(this.$items.values()).sort(l);return B.forEach(function(K,It){g.setAt(E[It],K)}),this},m.prototype.splice=function(l,g){g===void 0&&(g=this.length-l);for(var E=[],B=2;B<arguments.length;B++)E[B-2]=arguments[B];for(var K=Array.from(this.$items.keys()),It=[],wt=l;wt<l+g;wt++)It.push(this.$items.get(K[wt])),this.$deleteAt(K[wt]);for(var wt=0;wt<E.length;wt++)this.setAt(l+wt,E[wt]);return It},m.prototype.unshift=function(){for(var l=this,g=[],E=0;E<arguments.length;E++)g[E]=arguments[E];var B=this.length,K=g.length,It=Array.from(this.$items.values());return g.forEach(function(wt,ee){l.setAt(ee,wt)}),It.forEach(function(wt,ee){l.setAt(K+ee,wt)}),B+K},m.prototype.indexOf=function(l,g){return Array.from(this.$items.values()).indexOf(l,g)},m.prototype.lastIndexOf=function(l,g){return g===void 0&&(g=this.length-1),Array.from(this.$items.values()).lastIndexOf(l,g)},m.prototype.every=function(l,g){return Array.from(this.$items.values()).every(l,g)},m.prototype.some=function(l,g){return Array.from(this.$items.values()).some(l,g)},m.prototype.forEach=function(l,g){Array.from(this.$items.values()).forEach(l,g)},m.prototype.map=function(l,g){return Array.from(this.$items.values()).map(l,g)},m.prototype.filter=function(l,g){return Array.from(this.$items.values()).filter(l,g)},m.prototype.reduce=function(l,g){return Array.prototype.reduce.apply(Array.from(this.$items.values()),arguments)},m.prototype.reduceRight=function(l,g){return Array.prototype.reduceRight.apply(Array.from(this.$items.values()),arguments)},m.prototype.find=function(l,g){return Array.from(this.$items.values()).find(l,g)},m.prototype.findIndex=function(l,g){return Array.from(this.$items.values()).findIndex(l,g)},m.prototype.fill=function(l,g,E){throw new Error("ArraySchema#fill() not implemented")},m.prototype.copyWithin=function(l,g,E){throw new Error("ArraySchema#copyWithin() not implemented")},m.prototype.toString=function(){return this.$items.toString()},m.prototype.toLocaleString=function(){return this.$items.toLocaleString()},m.prototype[Symbol.iterator]=function(){return Array.from(this.$items.values())[Symbol.iterator]()},Object.defineProperty(m,Symbol.species,{get:function(){return m},enumerable:!1,configurable:!0}),m.prototype.entries=function(){return this.$items.entries()},m.prototype.keys=function(){return this.$items.keys()},m.prototype.values=function(){return this.$items.values()},m.prototype.includes=function(l,g){return Array.from(this.$items.values()).includes(l,g)},m.prototype.flatMap=function(l,g){throw new Error("ArraySchema#flatMap() is not supported.")},m.prototype.flat=function(l){throw new Error("ArraySchema#flat() is not supported.")},m.prototype.findLast=function(){var l=Array.from(this.$items.values());return l.findLast.apply(l,arguments)},m.prototype.findLastIndex=function(){var l=Array.from(this.$items.values());return l.findLastIndex.apply(l,arguments)},m.prototype.with=function(l,g){var E=Array.from(this.$items.values());return E[l]=g,new(m.bind.apply(m,a([void 0],E,!1)))},m.prototype.toReversed=function(){return Array.from(this.$items.values()).reverse()},m.prototype.toSorted=function(l){return Array.from(this.$items.values()).sort(l)},m.prototype.toSpliced=function(l,g){var E=Array.from(this.$items.values());return E.toSpliced.apply(E,arguments)},m.prototype.setIndex=function(l,g){this.$indexes.set(l,g)},m.prototype.getIndex=function(l){return this.$indexes.get(l)},m.prototype.getByIndex=function(l){return this.$items.get(this.$indexes.get(l))},m.prototype.deleteByIndex=function(l){var g=this.$indexes.get(l);this.$items.delete(g),this.$indexes.delete(l)},m.prototype.toArray=function(){return Array.from(this.$items.values())},m.prototype.toJSON=function(){return this.toArray().map(function(l){return typeof l.toJSON=="function"?l.toJSON():l})},m.prototype.clone=function(l){var g;return l?g=new(m.bind.apply(m,a([void 0],Array.from(this.$items.values()),!1))):g=new(m.bind.apply(m,a([void 0],this.map(function(E){return E.$changes?E.clone():E}),!1))),g},m}();function v(m){return m.$proxy=!0,m=new Proxy(m,{get:function(l,g){return typeof g!="symbol"&&typeof l[g]>"u"?l.get(g):l[g]},set:function(l,g,E){return typeof g!="symbol"&&g.indexOf("$")===-1&&g!=="onAdd"&&g!=="onRemove"&&g!=="onChange"?l.set(g,E):l[g]=E,!0},deleteProperty:function(l,g){return l.delete(g),!0}}),m}var d=function(){function m(l){var g=this;if(this.$changes=new h(this),this.$items=new Map,this.$indexes=new Map,this.$refId=0,l)if(l instanceof Map||l instanceof m)l.forEach(function(B,K){return g.set(K,B)});else for(var E in l)this.set(E,l[E])}return m.prototype.onAdd=function(l,g){return g===void 0&&(g=!0),u(this.$callbacks||(this.$callbacks={}),e.OPERATION.ADD,l,g?this.$items:void 0)},m.prototype.onRemove=function(l){return u(this.$callbacks||(this.$callbacks={}),e.OPERATION.DELETE,l)},m.prototype.onChange=function(l){return u(this.$callbacks||(this.$callbacks={}),e.OPERATION.REPLACE,l)},m.is=function(l){return l.map!==void 0},m.prototype[Symbol.iterator]=function(){return this.$items[Symbol.iterator]()},Object.defineProperty(m.prototype,Symbol.toStringTag,{get:function(){return this.$items[Symbol.toStringTag]},enumerable:!1,configurable:!0}),Object.defineProperty(m,Symbol.species,{get:function(){return m},enumerable:!1,configurable:!0}),m.prototype.set=function(l,g){if(g==null)throw new Error("MapSchema#set('".concat(l,"', ").concat(g,"): trying to set ").concat(g," value on '").concat(l,"'."));l=l.toString();var E=typeof this.$changes.indexes[l]<"u",B=E?this.$changes.indexes[l]:this.$refId++,K=E?e.OPERATION.REPLACE:e.OPERATION.ADD,It=g.$changes!==void 0;if(It&&g.$changes.setParent(this,this.$changes.root,B),!E)this.$changes.indexes[l]=B,this.$indexes.set(B,l);else{if(!It&&this.$items.get(l)===g)return;It&&this.$items.get(l)!==g&&(K=e.OPERATION.ADD)}return this.$items.set(l,g),this.$changes.change(l,K),this},m.prototype.get=function(l){return this.$items.get(l)},m.prototype.delete=function(l){return this.$changes.delete(l.toString()),this.$items.delete(l)},m.prototype.clear=function(l){this.$changes.discard(!0,!0),this.$changes.indexes={},this.$indexes.clear(),l&&f.call(this,l),this.$items.clear(),this.$changes.operation({index:0,op:e.OPERATION.CLEAR}),this.$changes.touchParents()},m.prototype.has=function(l){return this.$items.has(l)},m.prototype.forEach=function(l){this.$items.forEach(l)},m.prototype.entries=function(){return this.$items.entries()},m.prototype.keys=function(){return this.$items.keys()},m.prototype.values=function(){return this.$items.values()},Object.defineProperty(m.prototype,"size",{get:function(){return this.$items.size},enumerable:!1,configurable:!0}),m.prototype.setIndex=function(l,g){this.$indexes.set(l,g)},m.prototype.getIndex=function(l){return this.$indexes.get(l)},m.prototype.getByIndex=function(l){return this.$items.get(this.$indexes.get(l))},m.prototype.deleteByIndex=function(l){var g=this.$indexes.get(l);this.$items.delete(g),this.$indexes.delete(l)},m.prototype.toJSON=function(){var l={};return this.forEach(function(g,E){l[E]=typeof g.toJSON=="function"?g.toJSON():g}),l},m.prototype.clone=function(l){var g;return l?g=Object.assign(new m,this):(g=new m,this.forEach(function(E,B){E.$changes?g.set(B,E.clone()):g.set(B,E)})),g},m}(),R={};function b(m,l){R[m]=l}function A(m){return R[m]}var H=function(){function m(){this.indexes={},this.fieldsByIndex={},this.deprecated={},this.descriptors={}}return m.create=function(l){var g=new m;return g.schema=Object.assign({},l&&l.schema||{}),g.indexes=Object.assign({},l&&l.indexes||{}),g.fieldsByIndex=Object.assign({},l&&l.fieldsByIndex||{}),g.descriptors=Object.assign({},l&&l.descriptors||{}),g.deprecated=Object.assign({},l&&l.deprecated||{}),g},m.prototype.addField=function(l,g){var E=this.getNextFieldIndex();this.fieldsByIndex[E]=l,this.indexes[l]=E,this.schema[l]=Array.isArray(g)?{array:g[0]}:g},m.prototype.hasField=function(l){return this.indexes[l]!==void 0},m.prototype.addFilter=function(l,g){return this.filters||(this.filters={},this.indexesWithFilters=[]),this.filters[this.indexes[l]]=g,this.indexesWithFilters.push(this.indexes[l]),!0},m.prototype.addChildrenFilter=function(l,g){var E=this.indexes[l],B=this.schema[l];if(A(Object.keys(B)[0]))return this.childFilters||(this.childFilters={}),this.childFilters[E]=g,!0;console.warn("@filterChildren: field '".concat(l,"' can't have children. Ignoring filter."))},m.prototype.getChildrenFilter=function(l){return this.childFilters&&this.childFilters[this.indexes[l]]},m.prototype.getNextFieldIndex=function(){return Object.keys(this.schema||{}).length},m}();function D(m){return m._context&&m._context.useFilters}var I=function(){function m(){this.types={},this.schemas=new Map,this.useFilters=!1}return m.prototype.has=function(l){return this.schemas.has(l)},m.prototype.get=function(l){return this.types[l]},m.prototype.add=function(l,g){g===void 0&&(g=this.schemas.size),l._definition=H.create(l._definition),l._typeid=g,this.types[g]=l,this.schemas.set(l,g)},m.create=function(l){return l===void 0&&(l={}),function(g){return l.context||(l.context=new m),w(g,l)}},m}(),N=new I;function w(m,l){return l===void 0&&(l={}),function(g,E){var B=l.context||N,K=g.constructor;if(K._context=B,!m)throw new Error("".concat(K.name,': @type() reference provided for "').concat(E,`" is undefined. Make sure you don't have any circular dependencies.`));B.has(K)||B.add(K);var It=K._definition;if(It.addField(E,m),It.descriptors[E]){if(It.deprecated[E])return;try{throw new Error("@colyseus/schema: Duplicate '".concat(E,"' definition on '").concat(K.name,`'.
Check @type() annotation`))}catch(P){var wt=P.stack.split(`
`)[4].trim();throw new Error("".concat(P.message," ").concat(wt))}}var ee=y.is(m),jt=!ee&&d.is(m);if(typeof m!="string"&&!Gt.is(m)){var Lt=Object.values(m)[0];typeof Lt!="string"&&!B.has(Lt)&&B.add(Lt)}if(l.manual){It.descriptors[E]={enumerable:!0,configurable:!0,writable:!0};return}var M="_".concat(E);It.descriptors[M]={enumerable:!1,configurable:!1,writable:!0},It.descriptors[E]={get:function(){return this[M]},set:function(P){P!==this[M]&&(P!=null?(ee&&!(P instanceof y)&&(P=new(y.bind.apply(y,a([void 0],P,!1)))),jt&&!(P instanceof d)&&(P=new d(P)),P.$proxy===void 0&&(jt?P=v(P):ee&&(P=x(P))),this.$changes.change(E),P.$changes&&P.$changes.setParent(this,this.$changes.root,this._definition.indexes[E])):this[M]!==void 0&&this.$changes.delete(E),this[M]=P)},enumerable:!0,configurable:!0}}}function T(m){return function(l,g){var E=l.constructor,B=E._definition;B.addFilter(g,m)&&(E._context.useFilters=!0)}}function U(m){return function(l,g){var E=l.constructor,B=E._definition;B.addChildrenFilter(g,m)&&(E._context.useFilters=!0)}}function $(m){return m===void 0&&(m=!0),function(l,g){var E=l.constructor,B=E._definition;B.deprecated[g]=!0,m&&(B.descriptors[g]={get:function(){throw new Error("".concat(g," is deprecated."))},set:function(K){},enumerable:!1,configurable:!0})}}function X(m,l,g){g===void 0&&(g={}),g.context||(g.context=m._context||g.context||N);for(var E in l)w(l[E],g)(m.prototype,E);return m}function J(m){for(var l=0,g=0,E=0,B=m.length;E<B;E++)l=m.charCodeAt(E),l<128?g+=1:l<2048?g+=2:l<55296||l>=57344?g+=3:(E++,g+=4);return g}function nt(m,l,g){for(var E=0,B=0,K=g.length;B<K;B++)E=g.charCodeAt(B),E<128?m[l++]=E:E<2048?(m[l++]=192|E>>6,m[l++]=128|E&63):E<55296||E>=57344?(m[l++]=224|E>>12,m[l++]=128|E>>6&63,m[l++]=128|E&63):(B++,E=65536+((E&1023)<<10|g.charCodeAt(B)&1023),m[l++]=240|E>>18,m[l++]=128|E>>12&63,m[l++]=128|E>>6&63,m[l++]=128|E&63)}function Z(m,l){m.push(l&255)}function tt(m,l){m.push(l&255)}function Y(m,l){m.push(l&255),m.push(l>>8&255)}function ft(m,l){m.push(l&255),m.push(l>>8&255)}function Mt(m,l){m.push(l&255),m.push(l>>8&255),m.push(l>>16&255),m.push(l>>24&255)}function Rt(m,l){var g=l>>24,E=l>>16,B=l>>8,K=l;m.push(K&255),m.push(B&255),m.push(E&255),m.push(g&255)}function Xt(m,l){var g=Math.floor(l/Math.pow(2,32)),E=l>>>0;Rt(m,E),Rt(m,g)}function ue(m,l){var g=l/Math.pow(2,32)>>0,E=l>>>0;Rt(m,E),Rt(m,g)}function Q(m,l){Ft(m,l)}function ot(m,l){Vt(m,l)}var bt=new Int32Array(2),pt=new Float32Array(bt.buffer),Ot=new Float64Array(bt.buffer);function Ft(m,l){pt[0]=l,Mt(m,bt[0])}function Vt(m,l){Ot[0]=l,Mt(m,bt[0]),Mt(m,bt[1])}function _e(m,l){return tt(m,l?1:0)}function Zt(m,l){l||(l="");var g=J(l),E=0;if(g<32)m.push(g|160),E=1;else if(g<256)m.push(217),tt(m,g),E=2;else if(g<65536)m.push(218),ft(m,g),E=3;else if(g<4294967296)m.push(219),Rt(m,g),E=5;else throw new Error("String too long");return nt(m,m.length,l),E+g}function ie(m,l){if(isNaN(l))return ie(m,0);if(isFinite(l)){if(l!==(l|0))return m.push(203),Vt(m,l),9}else return ie(m,l>0?Number.MAX_SAFE_INTEGER:-Number.MAX_SAFE_INTEGER);return l>=0?l<128?(tt(m,l),1):l<256?(m.push(204),tt(m,l),2):l<65536?(m.push(205),ft(m,l),3):l<4294967296?(m.push(206),Rt(m,l),5):(m.push(207),ue(m,l),9):l>=-32?(m.push(224|l+32),1):l>=-128?(m.push(208),Z(m,l),2):l>=-32768?(m.push(209),Y(m,l),3):l>=-2147483648?(m.push(210),Mt(m,l),5):(m.push(211),Xt(m,l),9)}var k=Object.freeze({__proto__:null,boolean:_e,float32:Q,float64:ot,int16:Y,int32:Mt,int64:Xt,int8:Z,number:ie,string:Zt,uint16:ft,uint32:Rt,uint64:ue,uint8:tt,utf8Write:nt,writeFloat32:Ft,writeFloat64:Vt});function He(m,l,g){for(var E="",B=0,K=l,It=l+g;K<It;K++){var wt=m[K];if(!(wt&128)){E+=String.fromCharCode(wt);continue}if((wt&224)===192){E+=String.fromCharCode((wt&31)<<6|m[++K]&63);continue}if((wt&240)===224){E+=String.fromCharCode((wt&15)<<12|(m[++K]&63)<<6|(m[++K]&63)<<0);continue}if((wt&248)===240){B=(wt&7)<<18|(m[++K]&63)<<12|(m[++K]&63)<<6|(m[++K]&63)<<0,B>=65536?(B-=65536,E+=String.fromCharCode((B>>>10)+55296,(B&1023)+56320)):E+=String.fromCharCode(B);continue}console.error("Invalid byte "+wt.toString(16))}return E}function Qt(m,l){return qt(m,l)<<24>>24}function qt(m,l){return m[l.offset++]}function Ut(m,l){return fe(m,l)<<16>>16}function fe(m,l){return m[l.offset++]|m[l.offset++]<<8}function Ct(m,l){return m[l.offset++]|m[l.offset++]<<8|m[l.offset++]<<16|m[l.offset++]<<24}function C(m,l){return Ct(m,l)>>>0}function S(m,l){return yt(m,l)}function W(m,l){return te(m,l)}function et(m,l){var g=C(m,l),E=Ct(m,l)*Math.pow(2,32);return E+g}function st(m,l){var g=C(m,l),E=C(m,l)*Math.pow(2,32);return E+g}var j=new Int32Array(2),Pt=new Float32Array(j.buffer),mt=new Float64Array(j.buffer);function yt(m,l){return j[0]=Ct(m,l),Pt[0]}function te(m,l){return j[0]=Ct(m,l),j[1]=Ct(m,l),mt[0]}function at(m,l){return qt(m,l)>0}function Et(m,l){var g=m[l.offset++],E;g<192?E=g&31:g===217?E=qt(m,l):g===218?E=fe(m,l):g===219&&(E=C(m,l));var B=He(m,l.offset,E);return l.offset+=E,B}function Nt(m,l){var g=m[l.offset];return g<192&&g>160||g===217||g===218||g===219}function Dt(m,l){var g=m[l.offset++];if(g<128)return g;if(g===202)return yt(m,l);if(g===203)return te(m,l);if(g===204)return qt(m,l);if(g===205)return fe(m,l);if(g===206)return C(m,l);if(g===207)return st(m,l);if(g===208)return Qt(m,l);if(g===209)return Ut(m,l);if(g===210)return Ct(m,l);if(g===211)return et(m,l);if(g>223)return(255-g+1)*-1}function At(m,l){var g=m[l.offset];return g<128||g>=202&&g<=211}function re(m,l){return m[l.offset]<160}function zt(m,l){return m[l.offset-1]===o&&(m[l.offset]<128||m[l.offset]>=202&&m[l.offset]<=211)}var de=Object.freeze({__proto__:null,arrayCheck:re,boolean:at,float32:S,float64:W,int16:Ut,int32:Ct,int64:et,int8:Qt,number:Dt,numberCheck:At,readFloat32:yt,readFloat64:te,string:Et,stringCheck:Nt,switchStructureCheck:zt,uint16:fe,uint32:C,uint64:st,uint8:qt}),O=function(){function m(l){var g=this;this.$changes=new h(this),this.$items=new Map,this.$indexes=new Map,this.$refId=0,l&&l.forEach(function(E){return g.add(E)})}return m.prototype.onAdd=function(l,g){return g===void 0&&(g=!0),u(this.$callbacks||(this.$callbacks=[]),e.OPERATION.ADD,l,g?this.$items:void 0)},m.prototype.onRemove=function(l){return u(this.$callbacks||(this.$callbacks=[]),e.OPERATION.DELETE,l)},m.prototype.onChange=function(l){return u(this.$callbacks||(this.$callbacks=[]),e.OPERATION.REPLACE,l)},m.is=function(l){return l.collection!==void 0},m.prototype.add=function(l){var g=this.$refId++,E=l.$changes!==void 0;return E&&l.$changes.setParent(this,this.$changes.root,g),this.$changes.indexes[g]=g,this.$indexes.set(g,g),this.$items.set(g,l),this.$changes.change(g),g},m.prototype.at=function(l){var g=Array.from(this.$items.keys())[l];return this.$items.get(g)},m.prototype.entries=function(){return this.$items.entries()},m.prototype.delete=function(l){for(var g=this.$items.entries(),E,B;(B=g.next())&&!B.done;)if(l===B.value[1]){E=B.value[0];break}return E===void 0?!1:(this.$changes.delete(E),this.$indexes.delete(E),this.$items.delete(E))},m.prototype.clear=function(l){this.$changes.discard(!0,!0),this.$changes.indexes={},this.$indexes.clear(),l&&f.call(this,l),this.$items.clear(),this.$changes.operation({index:0,op:e.OPERATION.CLEAR}),this.$changes.touchParents()},m.prototype.has=function(l){return Array.from(this.$items.values()).some(function(g){return g===l})},m.prototype.forEach=function(l){var g=this;this.$items.forEach(function(E,B,K){return l(E,B,g)})},m.prototype.values=function(){return this.$items.values()},Object.defineProperty(m.prototype,"size",{get:function(){return this.$items.size},enumerable:!1,configurable:!0}),m.prototype.setIndex=function(l,g){this.$indexes.set(l,g)},m.prototype.getIndex=function(l){return this.$indexes.get(l)},m.prototype.getByIndex=function(l){return this.$items.get(this.$indexes.get(l))},m.prototype.deleteByIndex=function(l){var g=this.$indexes.get(l);this.$items.delete(g),this.$indexes.delete(l)},m.prototype.toArray=function(){return Array.from(this.$items.values())},m.prototype.toJSON=function(){var l=[];return this.forEach(function(g,E){l.push(typeof g.toJSON=="function"?g.toJSON():g)}),l},m.prototype.clone=function(l){var g;return l?g=Object.assign(new m,this):(g=new m,this.forEach(function(E){E.$changes?g.add(E.clone()):g.add(E)})),g},m}(),ht=function(){function m(l){var g=this;this.$changes=new h(this),this.$items=new Map,this.$indexes=new Map,this.$refId=0,l&&l.forEach(function(E){return g.add(E)})}return m.prototype.onAdd=function(l,g){return g===void 0&&(g=!0),u(this.$callbacks||(this.$callbacks=[]),e.OPERATION.ADD,l,g?this.$items:void 0)},m.prototype.onRemove=function(l){return u(this.$callbacks||(this.$callbacks=[]),e.OPERATION.DELETE,l)},m.prototype.onChange=function(l){return u(this.$callbacks||(this.$callbacks=[]),e.OPERATION.REPLACE,l)},m.is=function(l){return l.set!==void 0},m.prototype.add=function(l){var g,E;if(this.has(l))return!1;var B=this.$refId++;l.$changes!==void 0&&l.$changes.setParent(this,this.$changes.root,B);var K=(E=(g=this.$changes.indexes[B])===null||g===void 0?void 0:g.op)!==null&&E!==void 0?E:e.OPERATION.ADD;return this.$changes.indexes[B]=B,this.$indexes.set(B,B),this.$items.set(B,l),this.$changes.change(B,K),B},m.prototype.entries=function(){return this.$items.entries()},m.prototype.delete=function(l){for(var g=this.$items.entries(),E,B;(B=g.next())&&!B.done;)if(l===B.value[1]){E=B.value[0];break}return E===void 0?!1:(this.$changes.delete(E),this.$indexes.delete(E),this.$items.delete(E))},m.prototype.clear=function(l){this.$changes.discard(!0,!0),this.$changes.indexes={},this.$indexes.clear(),l&&f.call(this,l),this.$items.clear(),this.$changes.operation({index:0,op:e.OPERATION.CLEAR}),this.$changes.touchParents()},m.prototype.has=function(l){for(var g=this.$items.values(),E=!1,B;(B=g.next())&&!B.done;)if(l===B.value){E=!0;break}return E},m.prototype.forEach=function(l){var g=this;this.$items.forEach(function(E,B,K){return l(E,B,g)})},m.prototype.values=function(){return this.$items.values()},Object.defineProperty(m.prototype,"size",{get:function(){return this.$items.size},enumerable:!1,configurable:!0}),m.prototype.setIndex=function(l,g){this.$indexes.set(l,g)},m.prototype.getIndex=function(l){return this.$indexes.get(l)},m.prototype.getByIndex=function(l){return this.$items.get(this.$indexes.get(l))},m.prototype.deleteByIndex=function(l){var g=this.$indexes.get(l);this.$items.delete(g),this.$indexes.delete(l)},m.prototype.toArray=function(){return Array.from(this.$items.values())},m.prototype.toJSON=function(){var l=[];return this.forEach(function(g,E){l.push(typeof g.toJSON=="function"?g.toJSON():g)}),l},m.prototype.clone=function(l){var g;return l?g=Object.assign(new m,this):(g=new m,this.forEach(function(E){E.$changes?g.add(E.clone()):g.add(E)})),g},m}(),q=function(){function m(){this.refIds=new WeakSet,this.containerIndexes=new WeakMap}return m.prototype.addRefId=function(l){this.refIds.has(l)||(this.refIds.add(l),this.containerIndexes.set(l,new Set))},m.get=function(l){return l.$filterState===void 0&&(l.$filterState=new m),l.$filterState},m}(),it=function(){function m(){this.refs=new Map,this.refCounts={},this.deletedRefs=new Set,this.nextUniqueId=0}return m.prototype.getNextUniqueId=function(){return this.nextUniqueId++},m.prototype.addRef=function(l,g,E){E===void 0&&(E=!0),this.refs.set(l,g),E&&(this.refCounts[l]=(this.refCounts[l]||0)+1)},m.prototype.removeRef=function(l){var g=this.refCounts[l];if(g===void 0){console.warn("trying to remove reference ".concat(l," that doesn't exist"));return}if(g===0){console.warn("trying to remove reference ".concat(l," with 0 refCount"));return}this.refCounts[l]=g-1,this.deletedRefs.add(l)},m.prototype.clearRefs=function(){this.refs.clear(),this.deletedRefs.clear(),this.refCounts={}},m.prototype.garbageCollectDeletedRefs=function(){var l=this;this.deletedRefs.forEach(function(g){if(!(l.refCounts[g]>0)){var E=l.refs.get(g);if(E instanceof Gt)for(var B in E._definition.schema)typeof E._definition.schema[B]!="string"&&E[B]&&E[B].$changes&&l.removeRef(E[B].$changes.refId);else{var K=E.$changes.parent._definition,It=K.schema[K.fieldsByIndex[E.$changes.parentIndex]];typeof Object.values(It)[0]=="function"&&Array.from(E.values()).forEach(function(wt){return l.removeRef(wt.$changes.refId)})}l.refs.delete(g),delete l.refCounts[g]}}),this.deletedRefs.clear()},m}(),gt=function(m){r(l,m);function l(){return m!==null&&m.apply(this,arguments)||this}return l}(Error);function vt(m,l,g,E){var B,K=!1;switch(l){case"number":case"int8":case"uint8":case"int16":case"uint16":case"int32":case"uint32":case"int64":case"uint64":case"float32":case"float64":B="number",isNaN(m)&&console.log('trying to encode "NaN" in '.concat(g.constructor.name,"#").concat(E));break;case"string":B="string",K=!0;break;case"boolean":return}if(typeof m!==B&&(!K||K&&m!==null)){var It="'".concat(JSON.stringify(m),"'").concat(m&&m.constructor&&" (".concat(m.constructor.name,")")||"");throw new gt("a '".concat(B,"' was expected, but ").concat(It," was provided in ").concat(g.constructor.name,"#").concat(E))}}function Bt(m,l,g,E){if(!(m instanceof l))throw new gt("a '".concat(l.name,"' was expected, but '").concat(m.constructor.name,"' was provided in ").concat(g.constructor.name,"#").concat(E))}function xe(m,l,g,E,B){vt(g,m,E,B);var K=k[m];if(K)K(l,g);else throw new gt("a '".concat(m,"' was expected, but ").concat(g," was provided in ").concat(E.constructor.name,"#").concat(B))}function Re(m,l,g){return de[m](l,g)}var Gt=function(){function m(){for(var l=[],g=0;g<arguments.length;g++)l[g]=arguments[g];Object.defineProperties(this,{$changes:{value:new h(this,void 0,new it),enumerable:!1,writable:!0},$callbacks:{value:void 0,enumerable:!1,writable:!0}});var E=this._definition.descriptors;E&&Object.defineProperties(this,E),l[0]&&this.assign(l[0])}return m.onError=function(l){console.error(l)},m.is=function(l){return l._definition&&l._definition.schema!==void 0},m.prototype.onChange=function(l){return u(this.$callbacks||(this.$callbacks={}),e.OPERATION.REPLACE,l)},m.prototype.onRemove=function(l){return u(this.$callbacks||(this.$callbacks={}),e.OPERATION.DELETE,l)},m.prototype.assign=function(l){return Object.assign(this,l),this},Object.defineProperty(m.prototype,"_definition",{get:function(){return this.constructor._definition},enumerable:!1,configurable:!0}),m.prototype.setDirty=function(l,g){this.$changes.change(l,g)},m.prototype.listen=function(l,g,E){var B=this;return E===void 0&&(E=!0),this.$callbacks||(this.$callbacks={}),this.$callbacks[l]||(this.$callbacks[l]=[]),this.$callbacks[l].push(g),E&&this[l]!==void 0&&g(this[l],void 0),function(){return p(B.$callbacks[l],B.$callbacks[l].indexOf(g))}},m.prototype.decode=function(l,g,E){g===void 0&&(g={offset:0}),E===void 0&&(E=this);var B=[],K=this.$changes.root,It=l.length,wt=0;for(K.refs.set(wt,this);g.offset<It;){var ee=l[g.offset++];if(ee==o){wt=Dt(l,g);var jt=K.refs.get(wt);if(!jt)throw new Error('"refId" not found: '.concat(wt));E=jt;continue}var Lt=E.$changes,M=E._definition!==void 0,P=M?ee>>6<<6:ee;if(P===e.OPERATION.CLEAR){E.clear(B);continue}var z=M?ee%(P||255):Dt(l,g),F=M?E._definition.fieldsByIndex[z]:"",L=Lt.getType(z),G=void 0,rt=void 0,_t=void 0;if(M?rt=E["_".concat(F)]:(rt=E.getByIndex(z),(P&e.OPERATION.ADD)===e.OPERATION.ADD?(_t=E instanceof d?Et(l,g):z,E.setIndex(z,_t)):_t=E.getIndex(z)),(P&e.OPERATION.DELETE)===e.OPERATION.DELETE&&(P!==e.OPERATION.DELETE_AND_ADD&&E.deleteByIndex(z),rt&&rt.$changes&&K.removeRef(rt.$changes.refId),G=null),F===void 0){console.warn("@colyseus/schema: definition mismatch");for(var lt={offset:g.offset};g.offset<It&&!(zt(l,g)&&(lt.offset=g.offset+1,K.refs.has(Dt(l,lt))));)g.offset++;continue}else if(P!==e.OPERATION.DELETE)if(m.is(L)){var ct=Dt(l,g);if(G=K.refs.get(ct),P!==e.OPERATION.REPLACE){var ut=this.getSchemaType(l,g,L);G||(G=this.createTypeInstance(ut),G.$changes.refId=ct,rt&&(G.$callbacks=rt.$callbacks,rt.$changes.refId&&ct!==rt.$changes.refId&&K.removeRef(rt.$changes.refId))),K.addRef(ct,G,G!==rt)}}else if(typeof L=="string")G=Re(L,l,g);else{var St=A(Object.keys(L)[0]),Wt=Dt(l,g),Jt=K.refs.has(Wt)?rt||K.refs.get(Wt):new St.constructor;if(G=Jt.clone(!0),G.$changes.refId=Wt,rt&&(G.$callbacks=rt.$callbacks,rt.$changes.refId&&Wt!==rt.$changes.refId)){K.removeRef(rt.$changes.refId);for(var kt=rt.entries(),ce=void 0;(ce=kt.next())&&!ce.done;){var ae=ce.value,Tt=ae[0],We=ae[1];B.push({refId:Wt,op:e.OPERATION.DELETE,field:Tt,value:void 0,previousValue:We})}}K.addRef(Wt,G,Jt!==rt)}if(G!=null){if(G.$changes&&G.$changes.setParent(Lt.ref,Lt.root,z),E instanceof m)E[F]=G;else if(E instanceof d){var Tt=_t;E.$items.set(Tt,G),E.$changes.allChanges.add(z)}else if(E instanceof y)E.setAt(z,G);else if(E instanceof O){var Kt=E.add(G);E.setIndex(z,Kt)}else if(E instanceof ht){var Kt=E.add(G);Kt!==!1&&E.setIndex(z,Kt)}}rt!==G&&B.push({refId:wt,op:P,field:F,dynamicIndex:_t,value:G,previousValue:rt})}return this._triggerChanges(B),K.garbageCollectDeletedRefs(),B},m.prototype.encode=function(l,g,E){l===void 0&&(l=!1),g===void 0&&(g=[]),E===void 0&&(E=!1);for(var B=this.$changes,K=new WeakSet,It=[B],wt=1,ee=0;ee<wt;ee++){var jt=It[ee],Lt=jt.ref,M=Lt instanceof m;jt.ensureRefId(),K.add(jt),jt!==B&&(jt.changed||l)&&(tt(g,o),ie(g,jt.refId));for(var P=l?Array.from(jt.allChanges):Array.from(jt.changes.values()),z=0,F=P.length;z<F;z++){var L=l?{op:e.OPERATION.ADD,index:P[z]}:P[z],G=L.index,rt=M?Lt._definition.fieldsByIndex&&Lt._definition.fieldsByIndex[G]:G,_t=g.length;if(L.op!==e.OPERATION.TOUCH)if(M)tt(g,G|L.op);else{if(tt(g,L.op),L.op===e.OPERATION.CLEAR)continue;ie(g,G)}if(!M&&(L.op&e.OPERATION.ADD)==e.OPERATION.ADD&&Lt instanceof d){var lt=jt.ref.$indexes.get(G);Zt(g,lt)}if(L.op!==e.OPERATION.DELETE){var ct=jt.getType(G),ut=jt.getValue(G);if(ut&&ut.$changes&&!K.has(ut.$changes)&&(It.push(ut.$changes),ut.$changes.ensureRefId(),wt++),L.op!==e.OPERATION.TOUCH){if(m.is(ct))Bt(ut,ct,Lt,rt),ie(g,ut.$changes.refId),(L.op&e.OPERATION.ADD)===e.OPERATION.ADD&&this.tryEncodeTypeId(g,ct,ut.constructor);else if(typeof ct=="string")xe(ct,g,ut,Lt,rt);else{var St=A(Object.keys(ct)[0]);Bt(Lt["_".concat(rt)],St.constructor,Lt,rt),ie(g,ut.$changes.refId)}E&&jt.cache(G,g.slice(_t))}}}!l&&!E&&jt.discard()}return g},m.prototype.encodeAll=function(l){return this.encode(!0,[],l)},m.prototype.applyFilters=function(l,g){var E,B;g===void 0&&(g=!1);for(var K=this,It=new Set,wt=q.get(l),ee=[this.$changes],jt=1,Lt=[],M=function(z){var F=ee[z];if(It.has(F.refId))return"continue";var L=F.ref,G=L instanceof m;tt(Lt,o),ie(Lt,F.refId);var rt=wt.refIds.has(F),_t=g||!rt;wt.addRefId(F);var lt=wt.containerIndexes.get(F),ct=_t?Array.from(F.allChanges):Array.from(F.changes.values());if(!g&&G&&L._definition.indexesWithFilters){var ut=L._definition.indexesWithFilters;ut.forEach(function(Ie){!lt.has(Ie)&&F.allChanges.has(Ie)&&(_t?ct.push(Ie):ct.push({op:e.OPERATION.ADD,index:Ie}))})}for(var St=0,Wt=ct.length;St<Wt;St++){var Jt=_t?{op:e.OPERATION.ADD,index:ct[St]}:ct[St];if(Jt.op===e.OPERATION.CLEAR){tt(Lt,Jt.op);continue}var kt=Jt.index;if(Jt.op===e.OPERATION.DELETE){G?tt(Lt,Jt.op|kt):(tt(Lt,Jt.op),ie(Lt,kt));continue}var ce=F.getValue(kt),ae=F.getType(kt);if(G){var Tt=L._definition.filters&&L._definition.filters[kt];if(Tt&&!Tt.call(L,l,ce,K)){ce&&ce.$changes&&It.add(ce.$changes.refId);continue}}else{var We=F.parent,Tt=F.getChildrenFilter();if(Tt&&!Tt.call(We,l,L.$indexes.get(kt),ce,K)){ce&&ce.$changes&&It.add(ce.$changes.refId);continue}}if(ce.$changes&&(ee.push(ce.$changes),jt++),Jt.op!==e.OPERATION.TOUCH)if(Jt.op===e.OPERATION.ADD||G)Lt.push.apply(Lt,(E=F.caches[kt])!==null&&E!==void 0?E:[]),lt.add(kt);else if(lt.has(kt))Lt.push.apply(Lt,(B=F.caches[kt])!==null&&B!==void 0?B:[]);else{if(lt.add(kt),tt(Lt,e.OPERATION.ADD),ie(Lt,kt),L instanceof d){var Kt=F.ref.$indexes.get(kt);Zt(Lt,Kt)}ce.$changes?ie(Lt,ce.$changes.refId):k[ae](Lt,ce)}else if(ce.$changes&&!G){if(tt(Lt,e.OPERATION.ADD),ie(Lt,kt),L instanceof d){var Kt=F.ref.$indexes.get(kt);Zt(Lt,Kt)}ie(Lt,ce.$changes.refId)}}},P=0;P<jt;P++)M(P);return Lt},m.prototype.clone=function(){var l,g=new this.constructor,E=this._definition.schema;for(var B in E)typeof this[B]=="object"&&typeof((l=this[B])===null||l===void 0?void 0:l.clone)=="function"?g[B]=this[B].clone():g[B]=this[B];return g},m.prototype.toJSON=function(){var l=this._definition.schema,g=this._definition.deprecated,E={};for(var B in l)!g[B]&&this[B]!==null&&typeof this[B]<"u"&&(E[B]=typeof this[B].toJSON=="function"?this[B].toJSON():this["_".concat(B)]);return E},m.prototype.discardAllChanges=function(){this.$changes.discardAll()},m.prototype.getByIndex=function(l){return this[this._definition.fieldsByIndex[l]]},m.prototype.deleteByIndex=function(l){this[this._definition.fieldsByIndex[l]]=void 0},m.prototype.tryEncodeTypeId=function(l,g,E){g._typeid!==E._typeid&&(tt(l,c),ie(l,E._typeid))},m.prototype.getSchemaType=function(l,g,E){var B;return l[g.offset]===c&&(g.offset++,B=this.constructor._context.get(Dt(l,g))),B||E},m.prototype.createTypeInstance=function(l){var g=new l;return g.$changes.root=this.$changes.root,g},m.prototype._triggerChanges=function(l){for(var g,E,B,K,It,wt,ee,jt,Lt,M=new Set,P=this.$changes.root.refs,z=function(L){var G=l[L],rt=G.refId,_t=P.get(rt),lt=_t.$callbacks;if((G.op&e.OPERATION.DELETE)===e.OPERATION.DELETE&&G.previousValue instanceof m&&((E=(g=G.previousValue.$callbacks)===null||g===void 0?void 0:g[e.OPERATION.DELETE])===null||E===void 0||E.forEach(function(ct){return ct()})),!lt)return"continue";if(_t instanceof m){if(!M.has(rt))try{(B=lt==null?void 0:lt[e.OPERATION.REPLACE])===null||B===void 0||B.forEach(function(ct){return ct()})}catch(ct){m.onError(ct)}try{lt.hasOwnProperty(G.field)&&((K=lt[G.field])===null||K===void 0||K.forEach(function(ct){return ct(G.value,G.previousValue)}))}catch(ct){m.onError(ct)}}else G.op===e.OPERATION.ADD&&G.previousValue===void 0?(It=lt[e.OPERATION.ADD])===null||It===void 0||It.forEach(function(ct){var ut;return ct(G.value,(ut=G.dynamicIndex)!==null&&ut!==void 0?ut:G.field)}):G.op===e.OPERATION.DELETE?G.previousValue!==void 0&&((wt=lt[e.OPERATION.DELETE])===null||wt===void 0||wt.forEach(function(ct){var ut;return ct(G.previousValue,(ut=G.dynamicIndex)!==null&&ut!==void 0?ut:G.field)})):G.op===e.OPERATION.DELETE_AND_ADD&&(G.previousValue!==void 0&&((ee=lt[e.OPERATION.DELETE])===null||ee===void 0||ee.forEach(function(ct){var ut;return ct(G.previousValue,(ut=G.dynamicIndex)!==null&&ut!==void 0?ut:G.field)})),(jt=lt[e.OPERATION.ADD])===null||jt===void 0||jt.forEach(function(ct){var ut;return ct(G.value,(ut=G.dynamicIndex)!==null&&ut!==void 0?ut:G.field)})),G.value!==G.previousValue&&((Lt=lt[e.OPERATION.REPLACE])===null||Lt===void 0||Lt.forEach(function(ct){var ut;return ct(G.value,(ut=G.dynamicIndex)!==null&&ut!==void 0?ut:G.field)}));M.add(rt)},F=0;F<l.length;F++)z(F)},m._definition=H.create(),m}();function Ve(m){for(var l=[m.$changes],g=1,E={},B=E,K=function(wt){var ee=l[wt];ee.changes.forEach(function(jt){var Lt=ee.ref,M=jt.index,P=Lt._definition?Lt._definition.fieldsByIndex[M]:Lt.$indexes.get(M);B[P]=ee.getValue(M)})},It=0;It<g;It++)K(It);return E}var Pe={context:new I},hi=function(m){r(l,m);function l(){return m!==null&&m.apply(this,arguments)||this}return s([w("string",Pe)],l.prototype,"name",void 0),s([w("string",Pe)],l.prototype,"type",void 0),s([w("number",Pe)],l.prototype,"referencedType",void 0),l}(Gt),ui=function(m){r(l,m);function l(){var g=m!==null&&m.apply(this,arguments)||this;return g.fields=new y,g}return s([w("number",Pe)],l.prototype,"id",void 0),s([w([hi],Pe)],l.prototype,"fields",void 0),l}(Gt),_n=function(m){r(l,m);function l(){var g=m!==null&&m.apply(this,arguments)||this;return g.types=new y,g}return l.encode=function(g){var E,B=g.constructor,K=new l;K.rootType=B._typeid;var It=function(Lt,M){for(var P in M){var z=new hi;z.name=P;var F=void 0;if(typeof M[P]=="string")F=M[P];else{var L=M[P],G=void 0;Gt.is(L)?(F="ref",G=M[P]):(F=Object.keys(L)[0],typeof L[F]=="string"?F+=":"+L[F]:G=L[F]),z.referencedType=G?G._typeid:-1}z.type=F,Lt.fields.push(z)}K.types.push(Lt)},wt=(E=B._context)===null||E===void 0?void 0:E.types;for(var ee in wt){var jt=new ui;jt.id=Number(ee),It(jt,wt[ee]._definition.schema)}return K.encodeAll()},l.decode=function(g,E){var B=new I,K=new l;K.decode(g,E);var It=K.types.reduce(function(M,P){var z=function(L){r(G,L);function G(){return L!==null&&L.apply(this,arguments)||this}return G}(Gt),F=P.id;return M[F]=z,B.add(z,F),M},{});K.types.forEach(function(M){var P=It[M.id];M.fields.forEach(function(z){var F;if(z.referencedType!==void 0){var L=z.type,G=It[z.referencedType];if(!G){var rt=z.type.split(":");L=rt[0],G=rt[1]}L==="ref"?w(G,{context:B})(P.prototype,z.name):w((F={},F[L]=G,F),{context:B})(P.prototype,z.name)}else w(z.type,{context:B})(P.prototype,z.name)})});var wt=It[K.rootType],ee=new wt;for(var jt in wt._definition.schema){var Lt=wt._definition.schema[jt];typeof Lt!="string"&&(ee[jt]=typeof Lt=="function"?new Lt:new(A(Object.keys(Lt)[0])).constructor)}return ee},s([w([ui],Pe)],l.prototype,"types",void 0),s([w("number",Pe)],l.prototype,"rootType",void 0),l}(Gt);b("map",{constructor:d}),b("array",{constructor:y}),b("set",{constructor:ht}),b("collection",{constructor:O}),e.ArraySchema=y,e.CollectionSchema=O,e.Context=I,e.MapSchema=d,e.Reflection=_n,e.ReflectionField=hi,e.ReflectionType=ui,e.Schema=Gt,e.SchemaDefinition=H,e.SetSchema=ht,e.decode=de,e.defineTypes=X,e.deprecated=$,e.dumpChanges=Ve,e.encode=k,e.filter=T,e.filterChildren=U,e.hasFilter=D,e.registerType=b,e.type=w})})(ha,ha.exports);var Gc=ha.exports,zl=ye&&ye.__createBinding||(Object.create?function(i,t,e,n){n===void 0&&(n=e);var r=Object.getOwnPropertyDescriptor(t,e);(!r||("get"in r?!t.__esModule:r.writable||r.configurable))&&(r={enumerable:!0,get:function(){return t[e]}}),Object.defineProperty(i,n,r)}:function(i,t,e,n){n===void 0&&(n=e),i[n]=t[e]}),kl=ye&&ye.__setModuleDefault||(Object.create?function(i,t){Object.defineProperty(i,"default",{enumerable:!0,value:t})}:function(i,t){i.default=t}),Hl=ye&&ye.__importStar||function(i){if(i&&i.__esModule)return i;var t={};if(i!=null)for(var e in i)e!=="default"&&Object.prototype.hasOwnProperty.call(i,e)&&zl(t,i,e);return kl(t,i),t};Object.defineProperty(Mr,"__esModule",{value:!0});Mr.Room=void 0;const So=Hl(Gi),Gl=gs,Le=eo,Eo=si,Vl=yr,br=Vi,Xe=Gc,To=ms;class no{constructor(t,e){this.onStateChange=(0,br.createSignal)(),this.onError=(0,br.createSignal)(),this.onLeave=(0,br.createSignal)(),this.onJoin=(0,br.createSignal)(),this.hasJoined=!1,this.onMessageHandlers=(0,Vl.createNanoEvents)(),this.roomId=null,this.name=t,e&&(this.serializer=new((0,Eo.getSerializer)("schema")),this.rootSchema=e,this.serializer.state=new e),this.onError((n,r)=>{var s;return(s=console.warn)===null||s===void 0?void 0:s.call(console,`colyseus.js - onError => (${n}) ${r}`)}),this.onLeave(()=>this.removeAllListeners())}get id(){return this.roomId}connect(t,e,n=this,r){const s=new Gl.Connection;n.connection=s,s.events.onmessage=no.prototype.onMessageCallback.bind(n),s.events.onclose=function(a){var o;if(!n.hasJoined){(o=console.warn)===null||o===void 0||o.call(console,`Room connection was closed unexpectedly (${a.code}): ${a.reason}`),n.onError.invoke(a.code,a.reason);return}a.code===To.CloseCode.DEVMODE_RESTART&&e?e():(n.onLeave.invoke(a.code,a.reason),n.destroy())},s.events.onerror=function(a){var o;(o=console.warn)===null||o===void 0||o.call(console,`Room, onError (${a.code}): ${a.reason}`),n.onError.invoke(a.code,a.reason)},s.connect(t,r)}leave(t=!0){return new Promise(e=>{this.onLeave(n=>e(n)),this.connection?t?this.connection.send([Le.Protocol.LEAVE_ROOM]):this.connection.close():this.onLeave.invoke(To.CloseCode.CONSENTED)})}onMessage(t,e){return this.onMessageHandlers.on(this.getMessageHandlerKey(t),e)}send(t,e){const n=[Le.Protocol.ROOM_DATA];typeof t=="string"?Xe.encode.string(n,t):Xe.encode.number(n,t);let r;if(e!==void 0){const s=So.encode(e);r=new Uint8Array(n.length+s.byteLength),r.set(new Uint8Array(n),0),r.set(new Uint8Array(s),n.length)}else r=new Uint8Array(n);this.connection.send(r.buffer)}sendBytes(t,e){const n=[Le.Protocol.ROOM_DATA_BYTES];typeof t=="string"?Xe.encode.string(n,t):Xe.encode.number(n,t);let r;r=new Uint8Array(n.length+(e.byteLength||e.length)),r.set(new Uint8Array(n),0),r.set(new Uint8Array(e),n.length),this.connection.send(r.buffer)}get state(){return this.serializer.getState()}removeAllListeners(){this.onJoin.clear(),this.onStateChange.clear(),this.onError.clear(),this.onLeave.clear(),this.onMessageHandlers.events={}}onMessageCallback(t){const e=Array.from(new Uint8Array(t.data)),n=e[0];if(n===Le.Protocol.JOIN_ROOM){let r=1;const s=(0,Le.utf8Read)(e,r);if(r+=(0,Le.utf8Length)(s),this.serializerId=(0,Le.utf8Read)(e,r),r+=(0,Le.utf8Length)(this.serializerId),!this.serializer){const a=(0,Eo.getSerializer)(this.serializerId);this.serializer=new a}e.length>r&&this.serializer.handshake&&this.serializer.handshake(e,{offset:r}),this.reconnectionToken=`${this.roomId}:${s}`,this.hasJoined=!0,this.onJoin.invoke(),this.connection.send([Le.Protocol.JOIN_ROOM])}else if(n===Le.Protocol.ERROR){const r={offset:1},s=Xe.decode.number(e,r),a=Xe.decode.string(e,r);this.onError.invoke(s,a)}else if(n===Le.Protocol.LEAVE_ROOM)this.leave();else if(n===Le.Protocol.ROOM_DATA_SCHEMA){const r={offset:1},a=this.serializer.getState().constructor._context.get(Xe.decode.number(e,r)),o=new a;o.decode(e,r),this.dispatchMessage(a,o)}else if(n===Le.Protocol.ROOM_STATE)e.shift(),this.setState(e);else if(n===Le.Protocol.ROOM_STATE_PATCH)e.shift(),this.patch(e);else if(n===Le.Protocol.ROOM_DATA){const r={offset:1},s=Xe.decode.stringCheck(e,r)?Xe.decode.string(e,r):Xe.decode.number(e,r),a=e.length>r.offset?So.decode(t.data,r.offset):void 0;this.dispatchMessage(s,a)}else if(n===Le.Protocol.ROOM_DATA_BYTES){const r={offset:1},s=Xe.decode.stringCheck(e,r)?Xe.decode.string(e,r):Xe.decode.number(e,r);this.dispatchMessage(s,new Uint8Array(e.slice(r.offset)))}}setState(t){this.serializer.setState(t),this.onStateChange.invoke(this.serializer.getState())}patch(t){this.serializer.patch(t),this.onStateChange.invoke(this.serializer.getState())}dispatchMessage(t,e){var n;const r=this.getMessageHandlerKey(t);this.onMessageHandlers.events[r]?this.onMessageHandlers.emit(r,e):this.onMessageHandlers.events["*"]?this.onMessageHandlers.emit("*",t,e):(n=console.warn)===null||n===void 0||n.call(console,`colyseus.js: onMessage() not registered for type '${t}'.`)}destroy(){this.serializer&&this.serializer.teardown()}getMessageHandlerKey(t){switch(typeof t){case"function":return`$${t._typeid}`;case"string":return t;case"number":return`i${t}`;default:throw new Error("invalid message type.")}}}Mr.Room=no;var vs={};function Ao(i,t){t.headers=i.headers||{},t.statusMessage=i.statusText,t.statusCode=i.status,t.data=i.response}function ln(i,t,e){return new Promise(function(n,r){e=e||{};var s=new XMLHttpRequest,a,o,c,h=e.body,u=e.headers||{};e.timeout&&(s.timeout=e.timeout),s.ontimeout=s.onerror=function(f){f.timeout=f.type=="timeout",r(f)},s.open(i,t.href||t),s.onload=function(){for(c=s.getAllResponseHeaders().trim().split(/[\r\n]+/),Ao(s,s);o=c.shift();)o=o.split(": "),s.headers[o.shift().toLowerCase()]=o.join(": ");if(o=s.headers["content-type"],o&&~o.indexOf("application/json"))try{s.data=JSON.parse(s.data,e.reviver)}catch(f){return Ao(s,f),r(f)}(s.status>=400?r:n)(s)},typeof FormData<"u"&&h instanceof FormData||h&&typeof h=="object"&&(u["content-type"]="application/json",h=JSON.stringify(h)),s.withCredentials=!!e.withCredentials;for(a in u)s.setRequestHeader(a,u[a]);s.send(h)})}var Wl=ln.bind(ln,"GET"),$l=ln.bind(ln,"POST"),Xl=ln.bind(ln,"PATCH"),ql=ln.bind(ln,"DELETE"),Yl=ln.bind(ln,"PUT");const jl=Object.freeze(Object.defineProperty({__proto__:null,del:ql,get:Wl,patch:Xl,post:$l,put:Yl,send:ln},Symbol.toStringTag,{value:"Module"})),Kl=yl(jl);var Zl=ye&&ye.__createBinding||(Object.create?function(i,t,e,n){n===void 0&&(n=e);var r=Object.getOwnPropertyDescriptor(t,e);(!r||("get"in r?!t.__esModule:r.writable||r.configurable))&&(r={enumerable:!0,get:function(){return t[e]}}),Object.defineProperty(i,n,r)}:function(i,t,e,n){n===void 0&&(n=e),i[n]=t[e]}),Jl=ye&&ye.__setModuleDefault||(Object.create?function(i,t){Object.defineProperty(i,"default",{enumerable:!0,value:t})}:function(i,t){i.default=t}),Ql=ye&&ye.__importStar||function(i){if(i&&i.__esModule)return i;var t={};if(i!=null)for(var e in i)e!=="default"&&Object.prototype.hasOwnProperty.call(i,e)&&Zl(t,i,e);return Jl(t,i),t};Object.defineProperty(vs,"__esModule",{value:!0});vs.HTTP=void 0;const th=ms,eh=Ql(Kl);class nh{constructor(t,e={}){this.client=t,this.headers=e}get(t,e={}){return this.request("get",t,e)}post(t,e={}){return this.request("post",t,e)}del(t,e={}){return this.request("del",t,e)}put(t,e={}){return this.request("put",t,e)}request(t,e,n={}){return eh[t](this.client.getHttpEndpoint(e),this.getOptions(n)).catch(r=>{var s;const a=r.statusCode,o=((s=r.data)===null||s===void 0?void 0:s.error)||r.statusMessage||r.message;throw!a&&!o?r:new th.ServerError(a,o)})}getOptions(t){return t.headers=Object.assign({},this.headers,t.headers),this.authToken&&(t.headers.Authorization=`Bearer ${this.authToken}`),typeof cc<"u"&&cc.sys&&cc.sys.isNative||(t.withCredentials=!0),t}}vs.HTTP=nh;var Sr={},Bn={};Object.defineProperty(Bn,"__esModule",{value:!0});Bn.getItem=Bn.removeItem=Bn.setItem=void 0;let rr;function io(){if(!rr)try{rr=typeof cc<"u"&&cc.sys&&cc.sys.localStorage?cc.sys.localStorage:window.localStorage}catch{}return rr||(rr={cache:{},setItem:function(i,t){this.cache[i]=t},getItem:function(i){this.cache[i]},removeItem:function(i){delete this.cache[i]}}),rr}function ih(i,t){io().setItem(i,t)}Bn.setItem=ih;function rh(i){io().removeItem(i)}Bn.removeItem=rh;function sh(i,t){const e=io().getItem(i);typeof Promise>"u"||!(e instanceof Promise)?t(e):e.then(n=>t(n))}Bn.getItem=sh;var Wn=ye&&ye.__awaiter||function(i,t,e,n){function r(s){return s instanceof e?s:new e(function(a){a(s)})}return new(e||(e=Promise))(function(s,a){function o(u){try{h(n.next(u))}catch(f){a(f)}}function c(u){try{h(n.throw(u))}catch(f){a(f)}}function h(u){u.done?s(u.value):r(u.value).then(o,c)}h((n=n.apply(i,t||[])).next())})},di=ye&&ye.__classPrivateFieldGet||function(i,t,e,n){if(e==="a"&&!n)throw new TypeError("Private accessor was defined without a getter");if(typeof t=="function"?i!==t||!n:!t.has(i))throw new TypeError("Cannot read private member from an object whose class did not declare it");return e==="m"?n:e==="a"?n.call(i):n?n.value:t.get(i)},sr=ye&&ye.__classPrivateFieldSet||function(i,t,e,n,r){if(n==="m")throw new TypeError("Private method is not writable");if(n==="a"&&!r)throw new TypeError("Private accessor was defined without a setter");if(typeof t=="function"?i!==t||!r:!t.has(i))throw new TypeError("Cannot write private member to an object whose class did not declare it");return n==="a"?r.call(i,e):r?r.value=e:t.set(i,e),e},ts,ua,Nn,es;Object.defineProperty(Sr,"__esModule",{value:!0});Sr.Auth=void 0;const bs=Bn,ah=yr;class oh{constructor(t){this.http=t,this.settings={path:"/auth",key:"colyseus-auth-token"},ts.set(this,!1),ua.set(this,void 0),Nn.set(this,void 0),es.set(this,(0,ah.createNanoEvents)()),(0,bs.getItem)(this.settings.key,e=>this.token=e)}set token(t){this.http.authToken=t}get token(){return this.http.authToken}onChange(t){const e=di(this,es,"f").on("change",t);return di(this,ts,"f")||sr(this,ua,new Promise((n,r)=>{this.getUserData().then(s=>{this.emitChange(Object.assign(Object.assign({},s),{token:this.token}))}).catch(s=>{this.emitChange({user:null,token:void 0})}).finally(()=>{n()})}),"f"),sr(this,ts,!0,"f"),e}getUserData(){return Wn(this,void 0,void 0,function*(){if(this.token)return(yield this.http.get(`${this.settings.path}/userdata`)).data;throw new Error("missing auth.token")})}registerWithEmailAndPassword(t,e,n){return Wn(this,void 0,void 0,function*(){const r=(yield this.http.post(`${this.settings.path}/register`,{body:{email:t,password:e,options:n}})).data;return this.emitChange(r),r})}signInWithEmailAndPassword(t,e){return Wn(this,void 0,void 0,function*(){const n=(yield this.http.post(`${this.settings.path}/login`,{body:{email:t,password:e}})).data;return this.emitChange(n),n})}signInAnonymously(t){return Wn(this,void 0,void 0,function*(){const e=(yield this.http.post(`${this.settings.path}/anonymous`,{body:{options:t}})).data;return this.emitChange(e),e})}sendPasswordResetEmail(t){return Wn(this,void 0,void 0,function*(){return(yield this.http.post(`${this.settings.path}/forgot-password`,{body:{email:t}})).data})}signInWithProvider(t,e={}){return Wn(this,void 0,void 0,function*(){return new Promise((n,r)=>{const s=e.width||480,a=e.height||768,o=this.token?`?token=${this.token}`:"",c=`Login with ${t[0].toUpperCase()+t.substring(1)}`,h=this.http.client.getHttpEndpoint(`${e.prefix||`${this.settings.path}/provider`}/${t}${o}`),u=screen.width/2-s/2,f=screen.height/2-a/2;sr(this,Nn,window.open(h,c,"toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width="+s+", height="+a+", top="+f+", left="+u),"f");const p=x=>{x.data.user===void 0&&x.data.token===void 0||(clearInterval(_),di(this,Nn,"f").close(),sr(this,Nn,void 0,"f"),window.removeEventListener("message",p),x.data.error!==void 0?r(x.data.error):(n(x.data),this.emitChange(x.data)))},_=setInterval(()=>{(!di(this,Nn,"f")||di(this,Nn,"f").closed)&&(sr(this,Nn,void 0,"f"),r("cancelled"),window.removeEventListener("message",p))},200);window.addEventListener("message",p)})})}signOut(){return Wn(this,void 0,void 0,function*(){this.emitChange({user:null,token:null})})}emitChange(t){t.token!==void 0&&(this.token=t.token,t.token===null?(0,bs.removeItem)(this.settings.key):(0,bs.setItem)(this.settings.key,t.token)),di(this,es,"f").emit("change",t)}}Sr.Auth=oh;ts=new WeakMap,ua=new WeakMap,Nn=new WeakMap,es=new WeakMap;var xs={};Object.defineProperty(xs,"__esModule",{value:!0});xs.discordURLBuilder=void 0;function ch(i){var t;const e=((t=window==null?void 0:window.location)===null||t===void 0?void 0:t.hostname)||"localhost",n=i.hostname.split("."),r=!i.hostname.includes("trycloudflare.com")&&!i.hostname.includes("discordsays.com")&&n.length>2?`/${n[0]}`:"";return i.pathname.startsWith("/.proxy")?`${i.protocol}//${e}${r}${i.pathname}${i.search}`:`${i.protocol}//${e}/.proxy/colyseus${r}${i.pathname}${i.search}`}xs.discordURLBuilder=ch;var fn=ye&&ye.__awaiter||function(i,t,e,n){function r(s){return s instanceof e?s:new e(function(a){a(s)})}return new(e||(e=Promise))(function(s,a){function o(u){try{h(n.next(u))}catch(f){a(f)}}function c(u){try{h(n.throw(u))}catch(f){a(f)}}function h(u){u.done?s(u.value):r(u.value).then(o,c)}h((n=n.apply(i,t||[])).next())})},Rs;Object.defineProperty(Hi,"__esModule",{value:!0});Hi.Client=Hi.MatchMakeError=void 0;const lh=ms,hh=Mr,uh=vs,fh=Sr,dh=xs;class Ms extends Error{constructor(t,e){super(t),this.code=e,Object.setPrototypeOf(this,Ms.prototype)}}Hi.MatchMakeError=Ms;const wo=typeof window<"u"&&typeof((Rs=window==null?void 0:window.location)===null||Rs===void 0?void 0:Rs.hostname)<"u"?`${window.location.protocol.replace("http","ws")}//${window.location.hostname}${window.location.port&&`:${window.location.port}`}`:"ws://127.0.0.1:2567";class ph{constructor(t=wo,e){var n,r;if(typeof t=="string"){const s=t.startsWith("/")?new URL(t,wo):new URL(t),a=s.protocol==="https:"||s.protocol==="wss:",o=Number(s.port||(a?443:80));this.settings={hostname:s.hostname,pathname:s.pathname,port:o,secure:a}}else t.port===void 0&&(t.port=t.secure?443:80),t.pathname===void 0&&(t.pathname=""),this.settings=t;this.settings.pathname.endsWith("/")&&(this.settings.pathname=this.settings.pathname.slice(0,-1)),this.http=new uh.HTTP(this,(e==null?void 0:e.headers)||{}),this.auth=new fh.Auth(this.http),this.urlBuilder=e==null?void 0:e.urlBuilder,!this.urlBuilder&&typeof window<"u"&&(!((r=(n=window==null?void 0:window.location)===null||n===void 0?void 0:n.hostname)===null||r===void 0)&&r.includes("discordsays.com"))&&(this.urlBuilder=dh.discordURLBuilder,console.log("Colyseus SDK: Discord Embedded SDK detected. Using custom URL builder."))}joinOrCreate(t,e={},n){return fn(this,void 0,void 0,function*(){return yield this.createMatchMakeRequest("joinOrCreate",t,e,n)})}create(t,e={},n){return fn(this,void 0,void 0,function*(){return yield this.createMatchMakeRequest("create",t,e,n)})}join(t,e={},n){return fn(this,void 0,void 0,function*(){return yield this.createMatchMakeRequest("join",t,e,n)})}joinById(t,e={},n){return fn(this,void 0,void 0,function*(){return yield this.createMatchMakeRequest("joinById",t,e,n)})}reconnect(t,e){return fn(this,void 0,void 0,function*(){if(typeof t=="string"&&typeof e=="string")throw new Error("DEPRECATED: .reconnect() now only accepts 'reconnectionToken' as argument.\nYou can get this token from previously connected `room.reconnectionToken`");const[n,r]=t.split(":");if(!n||!r)throw new Error(`Invalid reconnection token format.
The format should be roomId:reconnectionToken`);return yield this.createMatchMakeRequest("reconnect",n,{reconnectionToken:r},e)})}getAvailableRooms(t=""){return fn(this,void 0,void 0,function*(){return(yield this.http.get(`matchmake/${t}`,{headers:{Accept:"application/json"}})).data})}consumeSeatReservation(t,e,n){return fn(this,void 0,void 0,function*(){const r=this.createRoom(t.room.name,e);r.roomId=t.room.roomId,r.sessionId=t.sessionId;const s={sessionId:r.sessionId};t.reconnectionToken&&(s.reconnectionToken=t.reconnectionToken);const a=n||r;return r.connect(this.buildEndpoint(t.room,s),t.devMode&&(()=>fn(this,void 0,void 0,function*(){console.info(`[Colyseus devMode]: ${String.fromCodePoint(128260)} Re-establishing connection with room id '${r.roomId}'...`);let o=0,c=8;const h=()=>fn(this,void 0,void 0,function*(){o++;try{yield this.consumeSeatReservation(t,e,a),console.info(`[Colyseus devMode]: ${String.fromCodePoint(9989)} Successfully re-established connection with room '${r.roomId}'`)}catch{o<c?(console.info(`[Colyseus devMode]: ${String.fromCodePoint(128260)} retrying... (${o} out of ${c})`),setTimeout(h,2e3)):console.info(`[Colyseus devMode]: ${String.fromCodePoint(10060)} Failed to reconnect. Is your server running? Please check server logs.`)}});setTimeout(h,2e3)})),a,this.http.headers),new Promise((o,c)=>{const h=(u,f)=>c(new lh.ServerError(u,f));a.onError.once(h),a.onJoin.once(()=>{a.onError.remove(h),o(a)})})})}createMatchMakeRequest(t,e,n={},r,s){return fn(this,void 0,void 0,function*(){const a=(yield this.http.post(`matchmake/${t}/${e}`,{headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(n)})).data;if(a.error)throw new Ms(a.error,a.code);return t==="reconnect"&&(a.reconnectionToken=n.reconnectionToken),yield this.consumeSeatReservation(a,r,s)})}createRoom(t,e){return new hh.Room(t,e)}buildEndpoint(t,e={}){const n=[];for(const a in e)e.hasOwnProperty(a)&&n.push(`${a}=${e[a]}`);let r=this.settings.secure?"wss://":"ws://";t.publicAddress?r+=`${t.publicAddress}`:r+=`${this.settings.hostname}${this.getEndpointPort()}${this.settings.pathname}`;const s=`${r}/${t.processId}/${t.roomId}?${n.join("&")}`;return this.urlBuilder?this.urlBuilder(new URL(s)):s}getHttpEndpoint(t=""){const e=t.startsWith("/")?t:`/${t}`,n=`${this.settings.secure?"https":"http"}://${this.settings.hostname}${this.getEndpointPort()}${this.settings.pathname}${e}`;return this.urlBuilder?this.urlBuilder(new URL(n)):n}getEndpointPort(){return this.settings.port!==80&&this.settings.port!==443?`:${this.settings.port}`:""}}Hi.Client=ph;var ys={};Object.defineProperty(ys,"__esModule",{value:!0});ys.SchemaSerializer=void 0;const bo=Gc;class mh{setState(t){return this.state.decode(t)}getState(){return this.state}patch(t){return this.state.decode(t)}teardown(){var t,e;(e=(t=this.state)===null||t===void 0?void 0:t.$changes)===null||e===void 0||e.root.clearRefs()}handshake(t,e){this.state?new bo.Reflection().decode(t,e):this.state=bo.Reflection.decode(t,e)}}ys.SchemaSerializer=mh;var Ss={};Object.defineProperty(Ss,"__esModule",{value:!0});Ss.NoneSerializer=void 0;class gh{setState(t){}getState(){return null}patch(t){}teardown(){}handshake(t){}}Ss.NoneSerializer=gh;(function(i){Object.defineProperty(i,"__esModule",{value:!0}),i.SchemaSerializer=i.registerSerializer=i.Auth=i.Room=i.ErrorCode=i.Protocol=i.MatchMakeError=i.Client=void 0;var t=Hi;Object.defineProperty(i,"Client",{enumerable:!0,get:function(){return t.Client}}),Object.defineProperty(i,"MatchMakeError",{enumerable:!0,get:function(){return t.MatchMakeError}});var e=eo;Object.defineProperty(i,"Protocol",{enumerable:!0,get:function(){return e.Protocol}}),Object.defineProperty(i,"ErrorCode",{enumerable:!0,get:function(){return e.ErrorCode}});var n=Mr;Object.defineProperty(i,"Room",{enumerable:!0,get:function(){return n.Room}});var r=Sr;Object.defineProperty(i,"Auth",{enumerable:!0,get:function(){return r.Auth}});const s=ys;Object.defineProperty(i,"SchemaSerializer",{enumerable:!0,get:function(){return s.SchemaSerializer}});const a=Ss,o=si;Object.defineProperty(i,"registerSerializer",{enumerable:!0,get:function(){return o.registerSerializer}}),(0,o.registerSerializer)("schema",s.SchemaSerializer),(0,o.registerSerializer)("none",a.NoneSerializer)})(zc);const _h={BASE_URL:"/"};function vh(){const i=_h||{};if(i.VITE_SERVER_URL)return i.VITE_SERVER_URL;const t=i.BASE_URL||"/",e=location.protocol==="https:"?"wss:":"ws:";return t!=="/"&&t!==""?`${e}//${location.host}${t.replace(/\/+$/,"")}`:`${e}//${location.hostname}:2567`}const xh=vh(),se={client:new zc.Client(xh),room:null,state:null,selfId:"",track:null,_handlers:{},_bound:{},_lastSent:{throttle:0,steer:0,drift:!1},lastStateAt:0,async create(i,t="city"){return this.room=await this.client.create("race",{nickname:i,trackId:t}),this._wire(),await this._waitFirstState(),this.room.roomId},async join(i,t){const e=i.trim().toUpperCase();if(e.length!==6)throw new Error("방 코드는 6자리입니다.");const r=(await this.client.getAvailableRooms("race")).find(s=>{var a;return((a=s.metadata)==null?void 0:a.roomCode)===e});if(!r)throw new Error("그 코드의 방을 찾을 수 없어요. 코드를 확인하거나, 방이 이미 시작되지 않았는지 보세요.");if(r.clients>=r.maxClients)throw new Error("방이 가득 찼어요.");return this.room=await this.client.joinById(r.roomId,{nickname:t}),this._wire(),await this._waitFirstState(),this.room.roomId},_waitFirstState(){return new Promise(i=>{var e,n;if((e=this.state)!=null&&e.roomCode)return i();const t=setTimeout(i,3e3);(n=this.room)==null||n.onStateChange.once(()=>{clearTimeout(t),i()})})},roomCode(){var i;return((i=this.state)==null?void 0:i.roomCode)||""},ready(){var i;(i=this.room)==null||i.send("set_ready")},useItem(){var i;(i=this.room)==null||i.send("use_item")},answer(i){var t;(t=this.room)==null||t.send("quiz_answer",{choice:i})},rematch(){var i;(i=this.room)==null||i.send("rematch")},requestTrack(){var i;(i=this.room)==null||i.send("request_track")},ensureTrack(i){if(this.track){i==null||i();return}let t=0;const e=setInterval(()=>{if(this.track){clearInterval(e),i==null||i();return}if(++t>20){clearInterval(e),console.error("[net] 트랙 수신 실패");return}this.requestTrack()},400);this.requestTrack()},sendInput(i){var e;const t=this._lastSent;i.throttle===t.throttle&&i.steer===t.steer&&i.drift===t.drift||(this._lastSent={...i},(e=this.room)==null||e.send("input",i))},me(){var i,t,e;return((e=(t=(i=this.state)==null?void 0:i.karts)==null?void 0:t.get)==null?void 0:e.call(t,this.selfId))??null},on(i,t){var e;((e=this._handlers)[i]||(e[i]=[])).push(t),!this._bound[i]&&this.room&&(this._bound[i]=!0,this.room.onMessage(i,n=>{(this._handlers[i]||[]).forEach(r=>{try{r(n)}catch(s){console.error(`[net] ${i}`,s)}})}))},onState(i){var t;(t=this.room)==null||t.onStateChange(e=>{this.state=e,i(e)})},_wire(){this.room&&(this.selfId=this.room.sessionId,this._bound={},this.room.onStateChange(i=>{this.state=i,this.lastStateAt=performance.now()}),this.on("track",i=>{this.track=i}))}},Ee={ctx:null,master:null,musicGain:null,sfxGain:null,enabled:!0,engineOn:!0,engOsc:[],engGain:null,engFilter:null,skidSrc:null,skidGain:null,noiseBuf:null,musicTimer:0,musicStep:0,init(){if(this.ctx){this.resume();return}const i=window.AudioContext||window.webkitAudioContext;if(!i)return;const t=new i;this.ctx=t,this.master=t.createGain(),this.master.gain.value=this.enabled?.9:0,this.master.connect(t.destination),this.sfxGain=t.createGain(),this.sfxGain.gain.value=1,this.sfxGain.connect(this.master),this.musicGain=t.createGain(),this.musicGain.gain.value=.3,this.musicGain.connect(this.master),this.noiseBuf=this.makeNoise(t,2),this.buildEngine(t),this.buildSkid(t)},resume(){var i;((i=this.ctx)==null?void 0:i.state)==="suspended"&&this.ctx.resume()},toggleEngine(){return this.engineOn=!this.engineOn,this.engineOn},toggle(){return this.enabled=!this.enabled,this.master&&this.ctx&&this.master.gain.setTargetAtTime(this.enabled?.9:0,this.ctx.currentTime,.05),this.enabled},makeNoise(i,t){const e=Math.floor(i.sampleRate*t),n=i.createBuffer(1,e,i.sampleRate),r=n.getChannelData(0);for(let s=0;s<e;s++)r[s]=Math.random()*2-1;return n},buildEngine(i){this.engGain=i.createGain(),this.engGain.gain.value=0,this.engFilter=i.createBiquadFilter(),this.engFilter.type="lowpass",this.engFilter.frequency.value=1600,this.engFilter.Q.value=.7,this.engGain.connect(this.engFilter),this.engFilter.connect(this.sfxGain);const t=[["triangle",0,1],["triangle",9,.55],["sawtooth",-6,.22]];for(const[r,s,a]of t){const o=i.createOscillator(),c=i.createGain();o.type=r,o.frequency.value=120,o.detune.value=s,c.gain.value=a,o.connect(c),c.connect(this.engGain),o.start(),this.engOsc.push(o)}const e=i.createOscillator(),n=i.createGain();e.frequency.value=7,n.gain.value=.012,e.connect(n),n.connect(this.engGain.gain),e.start()},updateEngine(i,t,e={}){if(!this.ctx||!this.engGain||!this.engFilter)return;const n=this.ctx.currentTime,r=Math.min(Math.abs(i)/Math.max(t,1),1.6),s=Math.floor(r*3),o=130+(r*3-s)*150+s*34+(e.boost?60:0);for(const h of this.engOsc)h.frequency.setTargetAtTime(o,n,.04);this.engFilter.frequency.setTargetAtTime(1200+r*3200+(e.boost?1400:0),n,.06);const c=this.engineOn&&e.racing?.022+r*.05:0;this.engGain.gain.setTargetAtTime(c,n,.1)},buildSkid(i){const t=i.createBufferSource();t.buffer=this.noiseBuf,t.loop=!0;const e=i.createBiquadFilter();e.type="bandpass",e.frequency.value=2400,e.Q.value=1.6;const n=i.createGain();n.gain.value=0,t.connect(e),e.connect(n),n.connect(this.sfxGain),t.start(),this.skidSrc=t,this.skidGain=n},setSkid(i,t=1){!this.ctx||!this.skidGain||this.skidGain.gain.setTargetAtTime(i?.1*t:0,this.ctx.currentTime,.05)},tone(i,t,e="square",n=.2,r){if(!this.ctx)return;const s=this.ctx.currentTime,a=this.ctx.createOscillator(),o=this.ctx.createGain();a.type=e,a.frequency.setValueAtTime(i,s),r&&a.frequency.exponentialRampToValueAtTime(Math.max(r,1),s+t),o.gain.setValueAtTime(0,s),o.gain.linearRampToValueAtTime(n,s+.012),o.gain.exponentialRampToValueAtTime(1e-4,s+t),a.connect(o),o.connect(this.sfxGain),a.start(s),a.stop(s+t+.02)},noise(i,t,e=.25,n="bandpass"){if(!this.ctx||!this.noiseBuf)return;const r=this.ctx.currentTime,s=this.ctx.createBufferSource();s.buffer=this.noiseBuf;const a=this.ctx.createBiquadFilter();a.type=n,a.frequency.value=t,a.Q.value=1.2;const o=this.ctx.createGain();o.gain.setValueAtTime(e,r),o.gain.exponentialRampToValueAtTime(1e-4,r+i),s.connect(a),a.connect(o),o.connect(this.sfxGain),s.start(r),s.stop(r+i+.02)},countdown(i){i>0?(this.tone(660,.16,"square",.3),this.tone(880,.12,"triangle",.14)):[1046.5,1318.5,1568].forEach((t,e)=>setTimeout(()=>this.tone(t,.45,"square",.3),e*45))},boost(i=1){const t=[420,520,640][Math.min(i,3)-1]??420;this.tone(t,.34,"sawtooth",.26,t*2.4),this.noise(.3,1800+i*500,.2,"highpass")},hit(){this.tone(150,.32,"square",.3,55),this.noise(.34,500,.34,"lowpass")},wall(){this.noise(.09,1600,.12)},pickup(){this.tone(660,.09,"square",.2),setTimeout(()=>this.tone(990,.12,"square",.2),80)},correct(){[660,880,1170].forEach((i,t)=>setTimeout(()=>this.tone(i,.13,"triangle",.24),t*75))},wrong(){this.tone(300,.26,"sawtooth",.22,150)},lap(){[880,1108,1318].forEach((i,t)=>setTimeout(()=>this.tone(i,.15,"square",.26),t*70))},shield(){this.tone(520,.22,"sine",.22,880)},respawn(){this.tone(300,.3,"sine",.2,620)},finish(){[523,659,784,1047].forEach((i,t)=>setTimeout(()=>this.tone(i,.3,"square",.3),t*110)),setTimeout(()=>[1047,1318,1568].forEach(i=>this.tone(i,.8,"triangle",.2)),460)},startMusic(){if(!this.ctx||this.musicTimer)return;const i=[65.41,65.41,98,98,110,110,87.31,87.31],t=[[523.25,659.25,783.99],[493.88,587.33,783.99],[523.25,659.25,880],[523.25,698.46,880]],e=[783.99,0,880,987.77,0,880,783.99,0,659.25,0,783.99,880,0,783.99,659.25,0,587.33,0,659.25,783.99,0,880,987.77,0,1046.5,0,987.77,880,0,783.99,659.25,0];this.musicStep=0,this.musicTimer=setInterval(()=>{if(!this.ctx||!this.enabled)return;const n=this.ctx.currentTime,r=this.musicStep++,s=Math.floor(r/8)%4;if(r%2===0&&this.musicTone(i[r%i.length],.2,"square",.26,n),r%4===2)for(const o of t[s])this.musicTone(o,.11,"triangle",.075,n);const a=e[r%e.length];a&&this.musicTone(a,.14,"square",.1,n),(r%8===0||r%8===5)&&this.kick(),r%8===4&&this.snare(),r%2===1&&this.musicNoise(.03,9e3,.055)},125)},kick(){if(!this.ctx||!this.musicGain)return;const i=this.ctx.currentTime,t=this.ctx.createOscillator(),e=this.ctx.createGain();t.type="sine",t.frequency.setValueAtTime(150,i),t.frequency.exponentialRampToValueAtTime(45,i+.11),e.gain.setValueAtTime(.42,i),e.gain.exponentialRampToValueAtTime(1e-4,i+.16),t.connect(e),e.connect(this.musicGain),t.start(i),t.stop(i+.18)},snare(){if(this.musicNoise(.13,1900,.2),!this.ctx||!this.musicGain)return;const i=this.ctx.currentTime,t=this.ctx.createOscillator(),e=this.ctx.createGain();t.type="triangle",t.frequency.setValueAtTime(240,i),e.gain.setValueAtTime(.14,i),e.gain.exponentialRampToValueAtTime(1e-4,i+.1),t.connect(e),e.connect(this.musicGain),t.start(i),t.stop(i+.12)},stopMusic(){clearInterval(this.musicTimer),this.musicTimer=0},musicTone(i,t,e,n,r){if(!this.ctx||!this.musicGain)return;const s=this.ctx.createOscillator(),a=this.ctx.createGain();s.type=e,s.frequency.value=i,a.gain.setValueAtTime(0,r),a.gain.linearRampToValueAtTime(n,r+.008),a.gain.exponentialRampToValueAtTime(1e-4,r+t),s.connect(a),a.connect(this.musicGain),s.start(r),s.stop(r+t+.02)},musicNoise(i,t,e){if(!this.ctx||!this.noiseBuf||!this.musicGain)return;const n=this.ctx.currentTime,r=this.ctx.createBufferSource();r.buffer=this.noiseBuf;const s=this.ctx.createBiquadFilter();s.type="highpass",s.frequency.value=t;const a=this.ctx.createGain();a.gain.setValueAtTime(e,n),a.gain.exponentialRampToValueAtTime(1e-4,n+i),r.connect(s),s.connect(a),a.connect(this.musicGain),r.start(n),r.stop(n+i+.02)}},xt=i=>document.getElementById(i),Cs={bomb:"💧 물폭탄",boost:"🔥 부스터",oil:"🛢 기름",shield:"🛡 방어막","":"—"},Mh={item:"아이템 획득",block:"IP 블록",escape:"탈출!"},fa={show(i){xt(i).classList.remove("hidden")},hide(i){xt(i).classList.add("hidden")},_onStart:()=>{},_quizTimer:0,_lastCount:-1,_shownLap:-1,_trackId:"city",_helpShown:!1,initLobby(i){const t=xt("nick"),e=xt("code");document.querySelectorAll("#trackpick .trk").forEach(r=>{r.addEventListener("click",()=>{this._trackId=r.dataset.track||"city",document.querySelectorAll("#trackpick .trk").forEach(s=>s.classList.remove("on")),r.classList.add("on")})}),xt("btnCreate").addEventListener("click",async()=>{if(!t.value.trim())return this.lobbyMsg("닉네임을 입력하세요.");try{await se.create(t.value.trim(),this._trackId),this.enterWaiting(),this.attachRoomState()}catch{this.lobbyMsg("방 생성 실패: 서버가 켜져 있나요?")}}),xt("btnJoin").addEventListener("click",()=>{xt("joinbox").classList.toggle("hidden"),e.focus()});const n=async()=>{if(!t.value.trim())return this.lobbyMsg("닉네임을 입력하세요.");if(!e.value.trim())return this.lobbyMsg("방 코드를 입력하세요.");this.lobbyMsg("입장 중…");try{await se.join(e.value.trim(),t.value.trim()),this.enterWaiting(),this.attachRoomState(),this.lobbyMsg("")}catch(r){this.lobbyMsg((r==null?void 0:r.message)??"입장 실패")}};xt("btnJoinGo").addEventListener("click",n),e.addEventListener("keydown",r=>{r.key==="Enter"&&n()}),xt("btnReady").addEventListener("click",()=>{Ee.init(),Ee.startMusic(),se.ready(),this.lobbyMsg("준비 완료. 혼자여도 AI가 자리를 채웁니다.")}),xt("btnMute").addEventListener("click",()=>this.toggleSound()),xt("btnFull").addEventListener("click",()=>this.toggleFullscreen()),window.addEventListener("keydown",r=>{const s=r.key;if((s==="m"||s==="M")&&this.toggleSound(),(s==="f"||s==="F")&&this.toggleFullscreen(),(s==="d"||s==="D")&&this.toggleDiag(),s==="e"||s==="E"){const a=Ee.toggleEngine();this.lobbyMsg(a?"엔진음 켜짐":"엔진음 꺼짐")}}),this._onStart=i},_diagOn:!1,_diagTimer:0,toggleDiag(){this._diagOn=!this._diagOn,xt("diag").classList.toggle("hidden",!this._diagOn),clearInterval(this._diagTimer),this._diagOn&&(this._diagTimer=setInterval(()=>{const i=window.__ipr;if(!i){xt("diag").textContent="진단 정보 없음 (레이스 시작 전)";return}xt("diag").innerHTML=`<b>진단</b> (D로 끄기)<br>phase: ${i.phase}<br>내 속도(예측): ${i.speed} / 서버: ${i.serverSpeed}<br>예측-서버 오차: ${i.gap}<br>스핀: ${i.stunMs}ms · 복귀: ${i.respawnMs}ms · 퀴즈: ${i.quizActive}<br>입력: ↑${i.keys.throttle} ←→${i.keys.steer} drift=${i.keys.drift}<br><span style="color:${i.stallMs>800?"#ff5d6c":"#8ea3c8"}">멈춤 지속: ${i.stallMs}ms</span><br>서버 갱신 경과: ${i.serverAgeMs}ms<br>프레임 오류: ${i.frameErrors} · 자동복구 ${i.recoveries??0}회`+(i.lastError?`<br><span style="color:#ffb020">${i.lastError}</span>`:"")},250))},toggleFullscreen(){var t,e;const i=document.documentElement;document.fullscreenElement?(e=document.exitFullscreen)==null||e.call(document):(t=i.requestFullscreen)==null||t.call(i).catch(()=>{})},toggleSound(){Ee.init();const i=Ee.toggle();xt("btnMute").textContent=i?"🔊":"🔇"},attachRoomState(){se.onState(i=>{xt("roomcode").textContent=i.roomCode||"…",this.renderPlayerList(i),i.phase!=="lobby"&&(this.hide("lobby"),this._onStart()),i.phase==="racing"&&!this._helpShown&&(this._helpShown=!0,this.show("ingameHelp"),setTimeout(()=>xt("ingameHelp").classList.add("fade"),9e3),setTimeout(()=>this.hide("ingameHelp"),9800)),xt("tracklabel")&&(xt("tracklabel").textContent=i.trackName||""),i.phase==="countdown"?(this.show("countdown"),xt("countnum").textContent=String(i.countdown||"GO!"),i.countdown!==this._lastCount&&(this._lastCount=i.countdown,Ee.countdown(i.countdown))):(this.hide("countdown"),this._lastCount=-1),(i.phase==="racing"||i.phase==="finished")&&this.renderHud(i)})},renderPlayerList(i){const t=[...i.karts.values()];xt("players").innerHTML=t.map(e=>`<div class="prow"><span>${e.nickname}</span><span>${e.ready?"✅ 준비":"⏳ 대기"}</span></div>`).join("")},enterWaiting(){xt("startrow").classList.add("hidden"),xt("joinbox").classList.add("hidden"),this.show("waiting"),xt("roomcode").textContent=se.roomCode()||"…"},lobbyMsg(i){xt("lobbyMsg").textContent=i},renderHud(i){this.show("hud"),this.show("standings"),this.show("minimap"),this.show("touchctrl"),this.drawMinimap(i);const t=se.me();if(!t)return;xt("hudRank").textContent=`${t.rank} / ${i.karts.size}`,xt("hudLap").textContent=`${Math.min(t.lap+1,i.laps)} / ${i.laps}`,xt("hudItem").textContent=Cs[t.item]??"—",this.show("itemslot");const e=xt("itemslot"),n=!!t.item;e.classList.toggle("has",n),xt("itemicon").textContent=n?(Cs[t.item]??"").split(" ")[0]:"—",xt("itemname").textContent=n?(Cs[t.item]??"").split(" ")[1]??"":"아이템 없음",xt("itemkey").textContent=n?"SPACE 로 사용":"SPACE",xt("tItem").classList.toggle("has",n),xt("hudSpeed").textContent=String(Math.round(Math.abs(t.speed))),xt("hudItem").classList.toggle("ready",!!t.item),this.show("lapbanner");const r=Math.min(t.lap+1,i.laps);if(xt("lapnum").textContent=`${r} / ${i.laps}`,xt("lapbanner").classList.toggle("final",r===i.laps),r!==this._shownLap){this._shownLap=r;const u=xt("lapbanner");u.classList.add("pop"),setTimeout(()=>u.classList.remove("pop"),220)}xt("laptime").textContent=t.bestLapMs>0?`BEST ${Ps(t.bestLapMs)}s`:"";const s=Math.max(0,(i.raceMs??0)-(t.lapStartMs??0));xt("hudLapTime").textContent=Ps(s),xt("hudBest").textContent=t.bestLapMs>0?Ps(t.bestLapMs):"—";const a=t.driftTier||t.boostTier||0,o=xt("hudDrift");if(o.textContent=a>0?`${a}단`:"—",o.className="v"+(a>0?` t${a}`:""),xt("hud").classList.toggle("offtrack",t.offTrack&&Math.abs(t.speed)>60),t.finished){xt("spinbanner").classList.remove("hidden"),xt("spinbanner").style.background="rgba(55,214,122,.92)";const u=i.endsInMs>0?` (${Math.ceil(i.endsInMs/1e3)}초)`:"";xt("spintext").textContent=`🏁 완주! 다른 주자를 기다리는 중${u}`;return}xt("spinbanner").style.background="";const c=t.stunMs>0;xt("spinbanner").classList.toggle("hidden",!c),c&&(xt("spintext").textContent=t.quizActive?`💧 스핀아웃! 문제를 맞히면 즉시 탈출 (${(t.stunMs/1e3).toFixed(1)}초)`:`💧 스핀아웃 — ${(t.stunMs/1e3).toFixed(1)}초`);const h=[...i.karts.values()].sort((u,f)=>u.rank-f.rank);xt("standings").innerHTML=h.map(u=>{const f=u.sessionId===se.selfId?"me":u.isBot?"bot":"",p=u.isBot?" 🤖":"",_=u.finished?"🏁":`${Math.min(u.lap+1,i.laps)}랩`;return`<div class="srow ${f}"><span>${u.rank}. ${u.nickname}${p}</span><span>${_}</span></div>`}).join("")},bindQuiz(){se.on("quiz_open",i=>this.openQuiz(i)),se.on("quiz_result",i=>this.showQuizResult(i)),window.addEventListener("keydown",i=>{if(xt("quiz").classList.contains("hidden"))return;const e={1:"A",2:"B",3:"C"}[i.key];e&&(i.preventDefault(),this.answer(e))})},openQuiz(i){clearTimeout(this._quizTimer),this._quizTimer=0,this.show("quiz");const t=xt("quiz");t.className=`quiz-card ${i.kind}`,xt("qkind").textContent=Mh[i.kind]??"",xt("qtext").textContent=i.text,xt("qopts").innerHTML=i.options.map((n,r)=>`<button class="qopt" data-label="${n.label}"><b>${r+1}</b> ${n.text}</button>`).join(""),xt("qopts").querySelectorAll(".qopt").forEach(n=>n.addEventListener("click",()=>this.answer(n.dataset.label)));const e=xt("qfill");e.style.transition="none",e.style.width="100%",e.offsetWidth,e.style.transition=`width ${i.ms}ms linear`,e.style.width="0%"},answer(i){se.answer(i),xt("qopts").querySelectorAll(".qopt").forEach(t=>{t.disabled=!0,t.classList.toggle("picked",t.dataset.label===i)})},showQuizResult(i){i.correct?Ee.correct():Ee.wrong(),xt("quiz").classList.add(i.correct?"ok":"no"),xt("qkind").textContent=i.correct?`✅ ${i.effect}`:`❌ ${i.effect}`,xt("qtext").textContent=(i.correct?"":`정답: ${i.correctText||i.correctLabel} — `)+i.explanation,xt("qopts").innerHTML="",clearTimeout(this._quizTimer),this._quizTimer=setTimeout(()=>this.hide("quiz"),1800)},_mapT:null,drawMinimap(i){const t=xt("minimap"),e=t.getContext("2d");if(!e||!se.track)return;const n=se.track.points;if(!this._mapT){let c=1/0,h=1/0,u=-1/0,f=-1/0;for(const x of n)x[0]<c&&(c=x[0]),x[0]>u&&(u=x[0]),x[1]<h&&(h=x[1]),x[1]>f&&(f=x[1]);const p=14,_=Math.min((t.width-p*2)/(u-c),(t.height-p*2)/(f-h));this._mapT={sc:_,ox:p-c*_,oy:p-h*_}}const r=this._mapT,s=c=>c*r.sc+r.ox,a=c=>c*r.sc+r.oy;e.clearRect(0,0,t.width,t.height),e.strokeStyle="#33456b",e.lineWidth=5,e.lineJoin="round",e.beginPath(),e.moveTo(s(n[0][0]),a(n[0][1]));for(let c=1;c<n.length;c++)e.lineTo(s(n[c][0]),a(n[c][1]));e.closePath(),e.stroke();const o=["#4da3ff","#ff9f43","#37d67a","#c77dff"];[...i.karts.values()].forEach((c,h)=>{const u=c.sessionId===se.selfId;e.fillStyle=o[h%o.length],e.beginPath(),e.arc(s(c.x),a(c.y),u?6:4.5,0,Math.PI*2),e.fill(),u&&(e.strokeStyle="#fff",e.lineWidth=2,e.beginPath(),e.arc(s(c.x),a(c.y),9,0,Math.PI*2),e.stroke())})},bindEnd(){se.on("race_end",i=>this.renderResult(i)),se.on("rematch",()=>{this.hide("result"),this.hide("hud"),this.hide("standings"),this.hide("minimap"),this.hide("lapbanner"),this.hide("quiz"),this.hide("touchctrl"),this.show("lobby"),this.show("waiting"),xt("startrow").classList.add("hidden"),xt("joinbox").classList.add("hidden"),this._shownLap=-1,this._lastCount=-1,this._mapT=null,this.lobbyMsg("새 판입니다. 준비 완료를 눌러주세요.")}),xt("btnRematch").addEventListener("click",()=>{se.rematch(),xt("btnRematch").textContent="초기화 중…"}),xt("btnQuit").addEventListener("click",()=>location.reload())},renderResult(i){Ee.stopMusic(),xt("btnRematch").textContent="🔁 다시 하기",this.hide("quiz"),this.hide("hud"),this.hide("standings"),this.hide("minimap"),this.hide("lapbanner"),this.hide("itemslot"),this.hide("touchctrl"),this.show("result"),xt("scores").innerHTML=i.results.map(t=>{const e=t.finished?`${(t.timeMs/1e3).toFixed(1)}초`:"미완주",n=t.bestLapMs>0?` · 베스트랩 ${(t.bestLapMs/1e3).toFixed(1)}초`:"",r=t.isBot?" 🤖":"";return`<div class="score"><span>${t.rank}위 · <b>${t.nickname}</b>${r}</span><span>${e}${n} · IP ${t.correctCount}/${t.answerCount} · <b>${t.finalScore}</b></span></div>`}).join(""),xt("reviewlist").innerHTML=i.review.map(t=>{const e=t.perPlayer.filter(a=>a.sessionId===se.selfId),n=e.some(a=>a.correct),r=e.length>0;return`<div class="q ${r&&!n?"wrong":""}"><div class="tag">${r?n?'<span class="badge ok">정답</span>':'<span class="badge no">오답</span>':'<span class="badge">안 나옴</span>'}</div><div><b>${t.text}</b></div><div class="tag">정답: ${t.correctText??""}</div><div>💡 ${t.explanation}</div><div class="tag">출처: ${t.sourceName}</div></div>`}).join("")}};function Ps(i){return(i/1e3).toFixed(1)}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ro="170",yh=0,Ro=1,Sh=2,Vc=1,Eh=2,En=3,Gn=0,ze=1,en=2,zn=0,Fi=1,Co=2,Po=3,Io=4,Th=5,Qn=100,Ah=101,wh=102,bh=103,Rh=104,Ch=200,Ph=201,Ih=202,Lh=203,da=204,pa=205,Dh=206,Uh=207,Nh=208,Oh=209,Fh=210,Bh=211,zh=212,kh=213,Hh=214,ma=0,ga=1,_a=2,Wi=3,va=4,xa=5,Ma=6,ya=7,so=0,Gh=1,Vh=2,kn=0,Wh=1,$h=2,Xh=3,qh=4,Yh=5,jh=6,Kh=7,Wc=300,$i=301,Xi=302,Sa=303,Ea=304,Es=306,hs=1e3,ei=1001,Ta=1002,je=1003,Zh=1004,Rr=1005,mn=1006,Is=1007,ni=1008,wn=1009,$c=1010,Xc=1011,xr=1012,ao=1013,ai=1014,gn=1015,Er=1016,oo=1017,co=1018,qi=1020,qc=35902,Yc=1021,jc=1022,cn=1023,Kc=1024,Zc=1025,Bi=1026,Yi=1027,lo=1028,ho=1029,Jc=1030,uo=1031,fo=1033,ns=33776,is=33777,rs=33778,ss=33779,Aa=35840,wa=35841,ba=35842,Ra=35843,Ca=36196,Pa=37492,Ia=37496,La=37808,Da=37809,Ua=37810,Na=37811,Oa=37812,Fa=37813,Ba=37814,za=37815,ka=37816,Ha=37817,Ga=37818,Va=37819,Wa=37820,$a=37821,as=36492,Xa=36494,qa=36495,Qc=36283,Ya=36284,ja=36285,Ka=36286,Jh=3200,Qh=3201,po=0,tu=1,On="",Qe="srgb",Ji="srgb-linear",Ts="linear",pe="srgb",pi=7680,Lo=519,eu=512,nu=513,iu=514,tl=515,ru=516,su=517,au=518,ou=519,Za=35044,Do="300 es",Tn=2e3,us=2001;class Qi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const r=this._listeners[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,t);t.target=null}}}const De=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Ls=Math.PI/180,Ja=180/Math.PI;function Hn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(De[i&255]+De[i>>8&255]+De[i>>16&255]+De[i>>24&255]+"-"+De[t&255]+De[t>>8&255]+"-"+De[t>>16&15|64]+De[t>>24&255]+"-"+De[e&63|128]+De[e>>8&255]+"-"+De[e>>16&255]+De[e>>24&255]+De[n&255]+De[n>>8&255]+De[n>>16&255]+De[n>>24&255]).toLowerCase()}function Ge(i,t,e){return Math.max(t,Math.min(e,i))}function cu(i,t){return(i%t+t)%t}function Ds(i,t,e){return(1-e)*i+e*t}function pn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function me(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class Ht{constructor(t=0,e=0){Ht.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ge(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*n-a*r+t.x,this.y=s*r+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class $t{constructor(t,e,n,r,s,a,o,c,h){$t.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,c,h)}set(t,e,n,r,s,a,o,c,h){const u=this.elements;return u[0]=t,u[1]=r,u[2]=o,u[3]=e,u[4]=s,u[5]=c,u[6]=n,u[7]=a,u[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[3],c=n[6],h=n[1],u=n[4],f=n[7],p=n[2],_=n[5],x=n[8],y=r[0],v=r[3],d=r[6],R=r[1],b=r[4],A=r[7],H=r[2],D=r[5],I=r[8];return s[0]=a*y+o*R+c*H,s[3]=a*v+o*b+c*D,s[6]=a*d+o*A+c*I,s[1]=h*y+u*R+f*H,s[4]=h*v+u*b+f*D,s[7]=h*d+u*A+f*I,s[2]=p*y+_*R+x*H,s[5]=p*v+_*b+x*D,s[8]=p*d+_*A+x*I,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],h=t[7],u=t[8];return e*a*u-e*o*h-n*s*u+n*o*c+r*s*h-r*a*c}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],h=t[7],u=t[8],f=u*a-o*h,p=o*c-u*s,_=h*s-a*c,x=e*f+n*p+r*_;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/x;return t[0]=f*y,t[1]=(r*h-u*n)*y,t[2]=(o*n-r*a)*y,t[3]=p*y,t[4]=(u*e-r*c)*y,t[5]=(r*s-o*e)*y,t[6]=_*y,t[7]=(n*c-h*e)*y,t[8]=(a*e-n*s)*y,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,a,o){const c=Math.cos(s),h=Math.sin(s);return this.set(n*c,n*h,-n*(c*a+h*o)+a+t,-r*h,r*c,-r*(-h*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Us.makeScale(t,e)),this}rotate(t){return this.premultiply(Us.makeRotation(-t)),this}translate(t,e){return this.premultiply(Us.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Us=new $t;function el(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function fs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function lu(){const i=fs("canvas");return i.style.display="block",i}const Uo={};function gr(i){i in Uo||(Uo[i]=!0,console.warn(i))}function hu(i,t,e){return new Promise(function(n,r){function s(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:r();break;case i.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}function uu(i){const t=i.elements;t[2]=.5*t[2]+.5*t[3],t[6]=.5*t[6]+.5*t[7],t[10]=.5*t[10]+.5*t[11],t[14]=.5*t[14]+.5*t[15]}function fu(i){const t=i.elements;t[11]===-1?(t[10]=-t[10]-1,t[14]=-t[14]):(t[10]=-t[10],t[14]=-t[14]+1)}const he={enabled:!0,workingColorSpace:Ji,spaces:{},convert:function(i,t,e){return this.enabled===!1||t===e||!t||!e||(this.spaces[t].transfer===pe&&(i.r=An(i.r),i.g=An(i.g),i.b=An(i.b)),this.spaces[t].primaries!==this.spaces[e].primaries&&(i.applyMatrix3(this.spaces[t].toXYZ),i.applyMatrix3(this.spaces[e].fromXYZ)),this.spaces[e].transfer===pe&&(i.r=zi(i.r),i.g=zi(i.g),i.b=zi(i.b))),i},fromWorkingColorSpace:function(i,t){return this.convert(i,this.workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===On?Ts:this.spaces[i].transfer},getLuminanceCoefficients:function(i,t=this.workingColorSpace){return i.fromArray(this.spaces[t].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,t,e){return i.copy(this.spaces[t].toXYZ).multiply(this.spaces[e].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}};function An(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function zi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}const No=[.64,.33,.3,.6,.15,.06],Oo=[.2126,.7152,.0722],Fo=[.3127,.329],Bo=new $t().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zo=new $t().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);he.define({[Ji]:{primaries:No,whitePoint:Fo,transfer:Ts,toXYZ:Bo,fromXYZ:zo,luminanceCoefficients:Oo,workingColorSpaceConfig:{unpackColorSpace:Qe},outputColorSpaceConfig:{drawingBufferColorSpace:Qe}},[Qe]:{primaries:No,whitePoint:Fo,transfer:pe,toXYZ:Bo,fromXYZ:zo,luminanceCoefficients:Oo,outputColorSpaceConfig:{drawingBufferColorSpace:Qe}}});let mi;class du{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{mi===void 0&&(mi=fs("canvas")),mi.width=t.width,mi.height=t.height;const n=mi.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=mi}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=fs("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=An(s[a]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(An(e[n]/255)*255):e[n]=An(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let pu=0;class nl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:pu++}),this.uuid=Hn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Ns(r[a].image)):s.push(Ns(r[a]))}else s=Ns(r);n.url=s}return e||(t.images[this.uuid]=n),n}}function Ns(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?du.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let mu=0;class Oe extends Qi{constructor(t=Oe.DEFAULT_IMAGE,e=Oe.DEFAULT_MAPPING,n=ei,r=ei,s=mn,a=ni,o=cn,c=wn,h=Oe.DEFAULT_ANISOTROPY,u=On){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:mu++}),this.uuid=Hn(),this.name="",this.source=new nl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Ht(0,0),this.repeat=new Ht(1,1),this.center=new Ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new $t,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Wc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case hs:t.x=t.x-Math.floor(t.x);break;case ei:t.x=t.x<0?0:1;break;case Ta:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case hs:t.y=t.y-Math.floor(t.y);break;case ei:t.y=t.y<0?0:1;break;case Ta:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Oe.DEFAULT_IMAGE=null;Oe.DEFAULT_MAPPING=Wc;Oe.DEFAULT_ANISOTROPY=1;class Se{constructor(t=0,e=0,n=0,r=1){Se.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*e+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*e+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*e+a[7]*n+a[11]*r+a[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s;const c=t.elements,h=c[0],u=c[4],f=c[8],p=c[1],_=c[5],x=c[9],y=c[2],v=c[6],d=c[10];if(Math.abs(u-p)<.01&&Math.abs(f-y)<.01&&Math.abs(x-v)<.01){if(Math.abs(u+p)<.1&&Math.abs(f+y)<.1&&Math.abs(x+v)<.1&&Math.abs(h+_+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const b=(h+1)/2,A=(_+1)/2,H=(d+1)/2,D=(u+p)/4,I=(f+y)/4,N=(x+v)/4;return b>A&&b>H?b<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(b),r=D/n,s=I/n):A>H?A<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(A),n=D/r,s=N/r):H<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(H),n=I/s,r=N/s),this.set(n,r,s,e),this}let R=Math.sqrt((v-x)*(v-x)+(f-y)*(f-y)+(p-u)*(p-u));return Math.abs(R)<.001&&(R=1),this.x=(v-x)/R,this.y=(f-y)/R,this.z=(p-u)/R,this.w=Math.acos((h+_+d-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class gu extends Qi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Se(0,0,t,e),this.scissorTest=!1,this.viewport=new Se(0,0,t,e);const r={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:mn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const s=new Oe(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];const a=n.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=t,this.textures[r].image.height=e,this.textures[r].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,r=t.textures.length;n<r;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new nl(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class oi extends gu{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class il extends Oe{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=je,this.minFilter=je,this.wrapR=ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class _u extends Oe{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=je,this.minFilter=je,this.wrapR=ei,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Tr{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,a,o){let c=n[r+0],h=n[r+1],u=n[r+2],f=n[r+3];const p=s[a+0],_=s[a+1],x=s[a+2],y=s[a+3];if(o===0){t[e+0]=c,t[e+1]=h,t[e+2]=u,t[e+3]=f;return}if(o===1){t[e+0]=p,t[e+1]=_,t[e+2]=x,t[e+3]=y;return}if(f!==y||c!==p||h!==_||u!==x){let v=1-o;const d=c*p+h*_+u*x+f*y,R=d>=0?1:-1,b=1-d*d;if(b>Number.EPSILON){const H=Math.sqrt(b),D=Math.atan2(H,d*R);v=Math.sin(v*D)/H,o=Math.sin(o*D)/H}const A=o*R;if(c=c*v+p*A,h=h*v+_*A,u=u*v+x*A,f=f*v+y*A,v===1-o){const H=1/Math.sqrt(c*c+h*h+u*u+f*f);c*=H,h*=H,u*=H,f*=H}}t[e]=c,t[e+1]=h,t[e+2]=u,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,r,s,a){const o=n[r],c=n[r+1],h=n[r+2],u=n[r+3],f=s[a],p=s[a+1],_=s[a+2],x=s[a+3];return t[e]=o*x+u*f+c*_-h*p,t[e+1]=c*x+u*p+h*f-o*_,t[e+2]=h*x+u*_+o*p-c*f,t[e+3]=u*x-o*f-c*p-h*_,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,r=t._y,s=t._z,a=t._order,o=Math.cos,c=Math.sin,h=o(n/2),u=o(r/2),f=o(s/2),p=c(n/2),_=c(r/2),x=c(s/2);switch(a){case"XYZ":this._x=p*u*f+h*_*x,this._y=h*_*f-p*u*x,this._z=h*u*x+p*_*f,this._w=h*u*f-p*_*x;break;case"YXZ":this._x=p*u*f+h*_*x,this._y=h*_*f-p*u*x,this._z=h*u*x-p*_*f,this._w=h*u*f+p*_*x;break;case"ZXY":this._x=p*u*f-h*_*x,this._y=h*_*f+p*u*x,this._z=h*u*x+p*_*f,this._w=h*u*f-p*_*x;break;case"ZYX":this._x=p*u*f-h*_*x,this._y=h*_*f+p*u*x,this._z=h*u*x-p*_*f,this._w=h*u*f+p*_*x;break;case"YZX":this._x=p*u*f+h*_*x,this._y=h*_*f+p*u*x,this._z=h*u*x-p*_*f,this._w=h*u*f-p*_*x;break;case"XZY":this._x=p*u*f-h*_*x,this._y=h*_*f-p*u*x,this._z=h*u*x+p*_*f,this._w=h*u*f+p*_*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],r=e[4],s=e[8],a=e[1],o=e[5],c=e[9],h=e[2],u=e[6],f=e[10],p=n+o+f;if(p>0){const _=.5/Math.sqrt(p+1);this._w=.25/_,this._x=(u-c)*_,this._y=(s-h)*_,this._z=(a-r)*_}else if(n>o&&n>f){const _=2*Math.sqrt(1+n-o-f);this._w=(u-c)/_,this._x=.25*_,this._y=(r+a)/_,this._z=(s+h)/_}else if(o>f){const _=2*Math.sqrt(1+o-n-f);this._w=(s-h)/_,this._x=(r+a)/_,this._y=.25*_,this._z=(c+u)/_}else{const _=2*Math.sqrt(1+f-n-o);this._w=(a-r)/_,this._x=(s+h)/_,this._y=(c+u)/_,this._z=.25*_}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ge(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,r=t._y,s=t._z,a=t._w,o=e._x,c=e._y,h=e._z,u=e._w;return this._x=n*u+a*o+r*h-s*c,this._y=r*u+a*c+s*o-n*h,this._z=s*u+a*h+n*c-r*o,this._w=a*u-n*o-r*c-s*h,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,r=this._y,s=this._z,a=this._w;let o=a*t._w+n*t._x+r*t._y+s*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=r,this._z=s,this;const c=1-o*o;if(c<=Number.EPSILON){const _=1-e;return this._w=_*a+e*this._w,this._x=_*n+e*this._x,this._y=_*r+e*this._y,this._z=_*s+e*this._z,this.normalize(),this}const h=Math.sqrt(c),u=Math.atan2(h,o),f=Math.sin((1-e)*u)/h,p=Math.sin(e*u)/h;return this._w=a*f+this._w*p,this._x=n*f+this._x*p,this._y=r*f+this._y*p,this._z=s*f+this._z*p,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),r=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(r*Math.sin(t),r*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class V{constructor(t=0,e=0,n=0){V.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ko.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ko.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=t.elements,a=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,r=this.z,s=t.x,a=t.y,o=t.z,c=t.w,h=2*(a*r-o*n),u=2*(o*e-s*r),f=2*(s*n-a*e);return this.x=e+c*h+a*f-o*u,this.y=n+c*u+o*h-s*f,this.z=r+c*f+s*u-a*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,r=t.y,s=t.z,a=e.x,o=e.y,c=e.z;return this.x=r*c-s*o,this.y=s*a-n*c,this.z=n*o-r*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Os.copy(this).projectOnVector(t),this.sub(Os)}reflect(t){return this.sub(Os.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Ge(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Os=new V,ko=new Tr;class ci{constructor(t=new V(1/0,1/0,1/0),e=new V(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(sn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(sn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=sn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,sn):sn.fromBufferAttribute(s,a),sn.applyMatrix4(t.matrixWorld),this.expandByPoint(sn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Cr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Cr.copy(n.boundingBox)),Cr.applyMatrix4(t.matrixWorld),this.union(Cr)}const r=t.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,sn),sn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ar),Pr.subVectors(this.max,ar),gi.subVectors(t.a,ar),_i.subVectors(t.b,ar),vi.subVectors(t.c,ar),Cn.subVectors(_i,gi),Pn.subVectors(vi,_i),$n.subVectors(gi,vi);let e=[0,-Cn.z,Cn.y,0,-Pn.z,Pn.y,0,-$n.z,$n.y,Cn.z,0,-Cn.x,Pn.z,0,-Pn.x,$n.z,0,-$n.x,-Cn.y,Cn.x,0,-Pn.y,Pn.x,0,-$n.y,$n.x,0];return!Fs(e,gi,_i,vi,Pr)||(e=[1,0,0,0,1,0,0,0,1],!Fs(e,gi,_i,vi,Pr))?!1:(Ir.crossVectors(Cn,Pn),e=[Ir.x,Ir.y,Ir.z],Fs(e,gi,_i,vi,Pr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,sn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(sn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(vn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),vn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),vn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),vn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),vn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),vn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),vn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),vn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(vn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const vn=[new V,new V,new V,new V,new V,new V,new V,new V],sn=new V,Cr=new ci,gi=new V,_i=new V,vi=new V,Cn=new V,Pn=new V,$n=new V,ar=new V,Pr=new V,Ir=new V,Xn=new V;function Fs(i,t,e,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){Xn.fromArray(i,s);const o=r.x*Math.abs(Xn.x)+r.y*Math.abs(Xn.y)+r.z*Math.abs(Xn.z),c=t.dot(Xn),h=e.dot(Xn),u=n.dot(Xn);if(Math.max(-Math.max(c,h,u),Math.min(c,h,u))>o)return!1}return!0}const vu=new ci,or=new V,Bs=new V;class Ar{constructor(t=new V,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):vu.setFromPoints(t).getCenter(n);let r=0;for(let s=0,a=t.length;s<a;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;or.subVectors(t,this.center);const e=or.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(or,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Bs.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(or.copy(t.center).add(Bs)),this.expandByPoint(or.copy(t.center).sub(Bs))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const xn=new V,zs=new V,Lr=new V,In=new V,ks=new V,Dr=new V,Hs=new V;class xu{constructor(t=new V,e=new V(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,xn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=xn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(xn.copy(this.origin).addScaledVector(this.direction,e),xn.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){zs.copy(t).add(e).multiplyScalar(.5),Lr.copy(e).sub(t).normalize(),In.copy(this.origin).sub(zs);const s=t.distanceTo(e)*.5,a=-this.direction.dot(Lr),o=In.dot(this.direction),c=-In.dot(Lr),h=In.lengthSq(),u=Math.abs(1-a*a);let f,p,_,x;if(u>0)if(f=a*c-o,p=a*o-c,x=s*u,f>=0)if(p>=-x)if(p<=x){const y=1/u;f*=y,p*=y,_=f*(f+a*p+2*o)+p*(a*f+p+2*c)+h}else p=s,f=Math.max(0,-(a*p+o)),_=-f*f+p*(p+2*c)+h;else p=-s,f=Math.max(0,-(a*p+o)),_=-f*f+p*(p+2*c)+h;else p<=-x?(f=Math.max(0,-(-a*s+o)),p=f>0?-s:Math.min(Math.max(-s,-c),s),_=-f*f+p*(p+2*c)+h):p<=x?(f=0,p=Math.min(Math.max(-s,-c),s),_=p*(p+2*c)+h):(f=Math.max(0,-(a*s+o)),p=f>0?s:Math.min(Math.max(-s,-c),s),_=-f*f+p*(p+2*c)+h);else p=a>0?-s:s,f=Math.max(0,-(a*p+o)),_=-f*f+p*(p+2*c)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(zs).addScaledVector(Lr,p),_}intersectSphere(t,e){xn.subVectors(t.center,this.origin);const n=xn.dot(this.direction),r=xn.dot(xn)-n*n,s=t.radius*t.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,a,o,c;const h=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,p=this.origin;return h>=0?(n=(t.min.x-p.x)*h,r=(t.max.x-p.x)*h):(n=(t.max.x-p.x)*h,r=(t.min.x-p.x)*h),u>=0?(s=(t.min.y-p.y)*u,a=(t.max.y-p.y)*u):(s=(t.max.y-p.y)*u,a=(t.min.y-p.y)*u),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),f>=0?(o=(t.min.z-p.z)*f,c=(t.max.z-p.z)*f):(o=(t.max.z-p.z)*f,c=(t.min.z-p.z)*f),n>c||o>r)||((o>n||n!==n)&&(n=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,xn)!==null}intersectTriangle(t,e,n,r,s){ks.subVectors(e,t),Dr.subVectors(n,t),Hs.crossVectors(ks,Dr);let a=this.direction.dot(Hs),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;In.subVectors(this.origin,t);const c=o*this.direction.dot(Dr.crossVectors(In,Dr));if(c<0)return null;const h=o*this.direction.dot(ks.cross(In));if(h<0||c+h>a)return null;const u=-o*In.dot(Hs);return u<0?null:this.at(u/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ge{constructor(t,e,n,r,s,a,o,c,h,u,f,p,_,x,y,v){ge.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,c,h,u,f,p,_,x,y,v)}set(t,e,n,r,s,a,o,c,h,u,f,p,_,x,y,v){const d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=r,d[1]=s,d[5]=a,d[9]=o,d[13]=c,d[2]=h,d[6]=u,d[10]=f,d[14]=p,d[3]=_,d[7]=x,d[11]=y,d[15]=v,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ge().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,r=1/xi.setFromMatrixColumn(t,0).length(),s=1/xi.setFromMatrixColumn(t,1).length(),a=1/xi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,r=t.y,s=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(r),h=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(t.order==="XYZ"){const p=a*u,_=a*f,x=o*u,y=o*f;e[0]=c*u,e[4]=-c*f,e[8]=h,e[1]=_+x*h,e[5]=p-y*h,e[9]=-o*c,e[2]=y-p*h,e[6]=x+_*h,e[10]=a*c}else if(t.order==="YXZ"){const p=c*u,_=c*f,x=h*u,y=h*f;e[0]=p+y*o,e[4]=x*o-_,e[8]=a*h,e[1]=a*f,e[5]=a*u,e[9]=-o,e[2]=_*o-x,e[6]=y+p*o,e[10]=a*c}else if(t.order==="ZXY"){const p=c*u,_=c*f,x=h*u,y=h*f;e[0]=p-y*o,e[4]=-a*f,e[8]=x+_*o,e[1]=_+x*o,e[5]=a*u,e[9]=y-p*o,e[2]=-a*h,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const p=a*u,_=a*f,x=o*u,y=o*f;e[0]=c*u,e[4]=x*h-_,e[8]=p*h+y,e[1]=c*f,e[5]=y*h+p,e[9]=_*h-x,e[2]=-h,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const p=a*c,_=a*h,x=o*c,y=o*h;e[0]=c*u,e[4]=y-p*f,e[8]=x*f+_,e[1]=f,e[5]=a*u,e[9]=-o*u,e[2]=-h*u,e[6]=_*f+x,e[10]=p-y*f}else if(t.order==="XZY"){const p=a*c,_=a*h,x=o*c,y=o*h;e[0]=c*u,e[4]=-f,e[8]=h*u,e[1]=p*f+y,e[5]=a*u,e[9]=_*f-x,e[2]=x*f-_,e[6]=o*u,e[10]=y*f+p}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Mu,t,yu)}lookAt(t,e,n){const r=this.elements;return qe.subVectors(t,e),qe.lengthSq()===0&&(qe.z=1),qe.normalize(),Ln.crossVectors(n,qe),Ln.lengthSq()===0&&(Math.abs(n.z)===1?qe.x+=1e-4:qe.z+=1e-4,qe.normalize(),Ln.crossVectors(n,qe)),Ln.normalize(),Ur.crossVectors(qe,Ln),r[0]=Ln.x,r[4]=Ur.x,r[8]=qe.x,r[1]=Ln.y,r[5]=Ur.y,r[9]=qe.y,r[2]=Ln.z,r[6]=Ur.z,r[10]=qe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[4],c=n[8],h=n[12],u=n[1],f=n[5],p=n[9],_=n[13],x=n[2],y=n[6],v=n[10],d=n[14],R=n[3],b=n[7],A=n[11],H=n[15],D=r[0],I=r[4],N=r[8],w=r[12],T=r[1],U=r[5],$=r[9],X=r[13],J=r[2],nt=r[6],Z=r[10],tt=r[14],Y=r[3],ft=r[7],Mt=r[11],Rt=r[15];return s[0]=a*D+o*T+c*J+h*Y,s[4]=a*I+o*U+c*nt+h*ft,s[8]=a*N+o*$+c*Z+h*Mt,s[12]=a*w+o*X+c*tt+h*Rt,s[1]=u*D+f*T+p*J+_*Y,s[5]=u*I+f*U+p*nt+_*ft,s[9]=u*N+f*$+p*Z+_*Mt,s[13]=u*w+f*X+p*tt+_*Rt,s[2]=x*D+y*T+v*J+d*Y,s[6]=x*I+y*U+v*nt+d*ft,s[10]=x*N+y*$+v*Z+d*Mt,s[14]=x*w+y*X+v*tt+d*Rt,s[3]=R*D+b*T+A*J+H*Y,s[7]=R*I+b*U+A*nt+H*ft,s[11]=R*N+b*$+A*Z+H*Mt,s[15]=R*w+b*X+A*tt+H*Rt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],a=t[1],o=t[5],c=t[9],h=t[13],u=t[2],f=t[6],p=t[10],_=t[14],x=t[3],y=t[7],v=t[11],d=t[15];return x*(+s*c*f-r*h*f-s*o*p+n*h*p+r*o*_-n*c*_)+y*(+e*c*_-e*h*p+s*a*p-r*a*_+r*h*u-s*c*u)+v*(+e*h*f-e*o*_-s*a*f+n*a*_+s*o*u-n*h*u)+d*(-r*o*u-e*c*f+e*o*p+r*a*f-n*a*p+n*c*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],h=t[7],u=t[8],f=t[9],p=t[10],_=t[11],x=t[12],y=t[13],v=t[14],d=t[15],R=f*v*h-y*p*h+y*c*_-o*v*_-f*c*d+o*p*d,b=x*p*h-u*v*h-x*c*_+a*v*_+u*c*d-a*p*d,A=u*y*h-x*f*h+x*o*_-a*y*_-u*o*d+a*f*d,H=x*f*c-u*y*c-x*o*p+a*y*p+u*o*v-a*f*v,D=e*R+n*b+r*A+s*H;if(D===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const I=1/D;return t[0]=R*I,t[1]=(y*p*s-f*v*s-y*r*_+n*v*_+f*r*d-n*p*d)*I,t[2]=(o*v*s-y*c*s+y*r*h-n*v*h-o*r*d+n*c*d)*I,t[3]=(f*c*s-o*p*s-f*r*h+n*p*h+o*r*_-n*c*_)*I,t[4]=b*I,t[5]=(u*v*s-x*p*s+x*r*_-e*v*_-u*r*d+e*p*d)*I,t[6]=(x*c*s-a*v*s-x*r*h+e*v*h+a*r*d-e*c*d)*I,t[7]=(a*p*s-u*c*s+u*r*h-e*p*h-a*r*_+e*c*_)*I,t[8]=A*I,t[9]=(x*f*s-u*y*s-x*n*_+e*y*_+u*n*d-e*f*d)*I,t[10]=(a*y*s-x*o*s+x*n*h-e*y*h-a*n*d+e*o*d)*I,t[11]=(u*o*s-a*f*s-u*n*h+e*f*h+a*n*_-e*o*_)*I,t[12]=H*I,t[13]=(u*y*r-x*f*r+x*n*p-e*y*p-u*n*v+e*f*v)*I,t[14]=(x*o*r-a*y*r-x*n*c+e*y*c+a*n*v-e*o*v)*I,t[15]=(a*f*r-u*o*r+u*n*c-e*f*c-a*n*p+e*o*p)*I,this}scale(t){const e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),r=Math.sin(e),s=1-n,a=t.x,o=t.y,c=t.z,h=s*a,u=s*o;return this.set(h*a+n,h*o-r*c,h*c+r*o,0,h*o+r*c,u*o+n,u*c-r*a,0,h*c-r*o,u*c+r*a,s*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,a){return this.set(1,n,s,0,t,1,a,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){const r=this.elements,s=e._x,a=e._y,o=e._z,c=e._w,h=s+s,u=a+a,f=o+o,p=s*h,_=s*u,x=s*f,y=a*u,v=a*f,d=o*f,R=c*h,b=c*u,A=c*f,H=n.x,D=n.y,I=n.z;return r[0]=(1-(y+d))*H,r[1]=(_+A)*H,r[2]=(x-b)*H,r[3]=0,r[4]=(_-A)*D,r[5]=(1-(p+d))*D,r[6]=(v+R)*D,r[7]=0,r[8]=(x+b)*I,r[9]=(v-R)*I,r[10]=(1-(p+y))*I,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){const r=this.elements;let s=xi.set(r[0],r[1],r[2]).length();const a=xi.set(r[4],r[5],r[6]).length(),o=xi.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],an.copy(this);const h=1/s,u=1/a,f=1/o;return an.elements[0]*=h,an.elements[1]*=h,an.elements[2]*=h,an.elements[4]*=u,an.elements[5]*=u,an.elements[6]*=u,an.elements[8]*=f,an.elements[9]*=f,an.elements[10]*=f,e.setFromRotationMatrix(an),n.x=s,n.y=a,n.z=o,this}makePerspective(t,e,n,r,s,a,o=Tn){const c=this.elements,h=2*s/(e-t),u=2*s/(n-r),f=(e+t)/(e-t),p=(n+r)/(n-r);let _,x;if(o===Tn)_=-(a+s)/(a-s),x=-2*a*s/(a-s);else if(o===us)_=-a/(a-s),x=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,r,s,a,o=Tn){const c=this.elements,h=1/(e-t),u=1/(n-r),f=1/(a-s),p=(e+t)*h,_=(n+r)*u;let x,y;if(o===Tn)x=(a+s)*f,y=-2*f;else if(o===us)x=s*f,y=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-p,c[1]=0,c[5]=2*u,c[9]=0,c[13]=-_,c[2]=0,c[6]=0,c[10]=y,c[14]=-x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const xi=new V,an=new ge,Mu=new V(0,0,0),yu=new V(1,1,1),Ln=new V,Ur=new V,qe=new V,Ho=new ge,Go=new Tr;class hn{constructor(t=0,e=0,n=0,r=hn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const r=t.elements,s=r[0],a=r[4],o=r[8],c=r[1],h=r[5],u=r[9],f=r[2],p=r[6],_=r[10];switch(e){case"XYZ":this._y=Math.asin(Ge(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,_),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(p,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Ge(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,_),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ge(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-f,_),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Ge(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(p,_),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(Ge(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,h),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(o,_));break;case"XZY":this._z=Math.asin(-Ge(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(p,h),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,_),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ho.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ho,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Go.setFromEuler(this),this.setFromQuaternion(Go,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}hn.DEFAULT_ORDER="XYZ";class rl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Su=0;const Vo=new V,Mi=new Tr,Mn=new ge,Nr=new V,cr=new V,Eu=new V,Tu=new Tr,Wo=new V(1,0,0),$o=new V(0,1,0),Xo=new V(0,0,1),qo={type:"added"},Au={type:"removed"},yi={type:"childadded",child:null},Gs={type:"childremoved",child:null};class Te extends Qi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Su++}),this.uuid=Hn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Te.DEFAULT_UP.clone();const t=new V,e=new hn,n=new Tr,r=new V(1,1,1);function s(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ge},normalMatrix:{value:new $t}}),this.matrix=new ge,this.matrixWorld=new ge,this.matrixAutoUpdate=Te.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Te.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new rl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Mi.setFromAxisAngle(t,e),this.quaternion.multiply(Mi),this}rotateOnWorldAxis(t,e){return Mi.setFromAxisAngle(t,e),this.quaternion.premultiply(Mi),this}rotateX(t){return this.rotateOnAxis(Wo,t)}rotateY(t){return this.rotateOnAxis($o,t)}rotateZ(t){return this.rotateOnAxis(Xo,t)}translateOnAxis(t,e){return Vo.copy(t).applyQuaternion(this.quaternion),this.position.add(Vo.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Wo,t)}translateY(t){return this.translateOnAxis($o,t)}translateZ(t){return this.translateOnAxis(Xo,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Mn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Nr.copy(t):Nr.set(t,e,n);const r=this.parent;this.updateWorldMatrix(!0,!1),cr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Mn.lookAt(cr,Nr,this.up):Mn.lookAt(Nr,cr,this.up),this.quaternion.setFromRotationMatrix(Mn),r&&(Mn.extractRotation(r.matrixWorld),Mi.setFromRotationMatrix(Mn),this.quaternion.premultiply(Mi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(qo),yi.child=t,this.dispatchEvent(yi),yi.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Au),Gs.child=t,this.dispatchEvent(Gs),Gs.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Mn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Mn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Mn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(qo),yi.child=t,this.dispatchEvent(yi),yi.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(cr,t,Eu),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(cr,Tu,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let h=0,u=c.length;h<u;h++){const f=c[h];s(t.shapes,f)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,h=this.material.length;c<h;c++)o.push(s(t.materials,this.material[c]));r.material=o}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),h=a(t.textures),u=a(t.images),f=a(t.shapes),p=a(t.skeletons),_=a(t.animations),x=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),h.length>0&&(n.textures=h),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),p.length>0&&(n.skeletons=p),_.length>0&&(n.animations=_),x.length>0&&(n.nodes=x)}return n.object=r,n;function a(o){const c=[];for(const h in o){const u=o[h];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const r=t.children[n];this.add(r.clone())}return this}}Te.DEFAULT_UP=new V(0,1,0);Te.DEFAULT_MATRIX_AUTO_UPDATE=!0;Te.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const on=new V,yn=new V,Vs=new V,Sn=new V,Si=new V,Ei=new V,Yo=new V,Ws=new V,$s=new V,Xs=new V,qs=new Se,Ys=new Se,js=new Se;class nn{constructor(t=new V,e=new V,n=new V){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),on.subVectors(t,e),r.cross(on);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){on.subVectors(r,e),yn.subVectors(n,e),Vs.subVectors(t,e);const a=on.dot(on),o=on.dot(yn),c=on.dot(Vs),h=yn.dot(yn),u=yn.dot(Vs),f=a*h-o*o;if(f===0)return s.set(0,0,0),null;const p=1/f,_=(h*c-o*u)*p,x=(a*u-o*c)*p;return s.set(1-_-x,x,_)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,Sn)===null?!1:Sn.x>=0&&Sn.y>=0&&Sn.x+Sn.y<=1}static getInterpolation(t,e,n,r,s,a,o,c){return this.getBarycoord(t,e,n,r,Sn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,Sn.x),c.addScaledVector(a,Sn.y),c.addScaledVector(o,Sn.z),c)}static getInterpolatedAttribute(t,e,n,r,s,a){return qs.setScalar(0),Ys.setScalar(0),js.setScalar(0),qs.fromBufferAttribute(t,e),Ys.fromBufferAttribute(t,n),js.fromBufferAttribute(t,r),a.setScalar(0),a.addScaledVector(qs,s.x),a.addScaledVector(Ys,s.y),a.addScaledVector(js,s.z),a}static isFrontFacing(t,e,n,r){return on.subVectors(n,e),yn.subVectors(t,e),on.cross(yn).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return on.subVectors(this.c,this.b),yn.subVectors(this.a,this.b),on.cross(yn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return nn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return nn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,r,s){return nn.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return nn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return nn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,r=this.b,s=this.c;let a,o;Si.subVectors(r,n),Ei.subVectors(s,n),Ws.subVectors(t,n);const c=Si.dot(Ws),h=Ei.dot(Ws);if(c<=0&&h<=0)return e.copy(n);$s.subVectors(t,r);const u=Si.dot($s),f=Ei.dot($s);if(u>=0&&f<=u)return e.copy(r);const p=c*f-u*h;if(p<=0&&c>=0&&u<=0)return a=c/(c-u),e.copy(n).addScaledVector(Si,a);Xs.subVectors(t,s);const _=Si.dot(Xs),x=Ei.dot(Xs);if(x>=0&&_<=x)return e.copy(s);const y=_*h-c*x;if(y<=0&&h>=0&&x<=0)return o=h/(h-x),e.copy(n).addScaledVector(Ei,o);const v=u*x-_*f;if(v<=0&&f-u>=0&&_-x>=0)return Yo.subVectors(s,r),o=(f-u)/(f-u+(_-x)),e.copy(r).addScaledVector(Yo,o);const d=1/(v+y+p);return a=y*d,o=p*d,e.copy(n).addScaledVector(Si,a).addScaledVector(Ei,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const sl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Dn={h:0,s:0,l:0},Or={h:0,s:0,l:0};function Ks(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class ne{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Qe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,he.toWorkingColorSpace(this,e),this}setRGB(t,e,n,r=he.workingColorSpace){return this.r=t,this.g=e,this.b=n,he.toWorkingColorSpace(this,r),this}setHSL(t,e,n,r=he.workingColorSpace){if(t=cu(t,1),e=Ge(e,0,1),n=Ge(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,a=2*n-s;this.r=Ks(a,s,t+1/3),this.g=Ks(a,s,t),this.b=Ks(a,s,t-1/3)}return he.toWorkingColorSpace(this,r),this}setStyle(t,e=Qe){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Qe){const n=sl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=An(t.r),this.g=An(t.g),this.b=An(t.b),this}copyLinearToSRGB(t){return this.r=zi(t.r),this.g=zi(t.g),this.b=zi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Qe){return he.fromWorkingColorSpace(Ue.copy(this),t),Math.round(Ge(Ue.r*255,0,255))*65536+Math.round(Ge(Ue.g*255,0,255))*256+Math.round(Ge(Ue.b*255,0,255))}getHexString(t=Qe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=he.workingColorSpace){he.fromWorkingColorSpace(Ue.copy(this),e);const n=Ue.r,r=Ue.g,s=Ue.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let c,h;const u=(o+a)/2;if(o===a)c=0,h=0;else{const f=a-o;switch(h=u<=.5?f/(a+o):f/(2-a-o),a){case n:c=(r-s)/f+(r<s?6:0);break;case r:c=(s-n)/f+2;break;case s:c=(n-r)/f+4;break}c/=6}return t.h=c,t.s=h,t.l=u,t}getRGB(t,e=he.workingColorSpace){return he.fromWorkingColorSpace(Ue.copy(this),e),t.r=Ue.r,t.g=Ue.g,t.b=Ue.b,t}getStyle(t=Qe){he.fromWorkingColorSpace(Ue.copy(this),t);const e=Ue.r,n=Ue.g,r=Ue.b;return t!==Qe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(Dn),this.setHSL(Dn.h+t,Dn.s+e,Dn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Dn),t.getHSL(Or);const n=Ds(Dn.h,Or.h,e),r=Ds(Dn.s,Or.s,e),s=Ds(Dn.l,Or.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Ue=new ne;ne.NAMES=sl;let wu=0;class li extends Qi{static get type(){return"Material"}get type(){return this.constructor.type}set type(t){}constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:wu++}),this.uuid=Hn(),this.name="",this.blending=Fi,this.side=Gn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=da,this.blendDst=pa,this.blendEquation=Qn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ne(0,0,0),this.blendAlpha=0,this.depthFunc=Wi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Lo,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=pi,this.stencilZFail=pi,this.stencilZPass=pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Fi&&(n.blending=this.blending),this.side!==Gn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==da&&(n.blendSrc=this.blendSrc),this.blendDst!==pa&&(n.blendDst=this.blendDst),this.blendEquation!==Qn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Wi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Lo&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==pi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==pi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==pi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(e){const s=r(t.textures),a=r(t.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class ri extends li{static get type(){return"MeshBasicMaterial"}constructor(t){super(),this.isMeshBasicMaterial=!0,this.color=new ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.combine=so,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Ae=new V,Fr=new Ht;class rn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Za,this.updateRanges=[],this.gpuType=gn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Fr.fromBufferAttribute(this,e),Fr.applyMatrix3(t),this.setXY(e,Fr.x,Fr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix3(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix4(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyNormalMatrix(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.transformDirection(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=pn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=me(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=pn(e,this.array)),e}setX(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=pn(e,this.array)),e}setY(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=pn(e,this.array)),e}setZ(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=pn(e,this.array)),e}setW(t,e){return this.normalized&&(e=me(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),n=me(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),n=me(n,this.array),r=me(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=me(e,this.array),n=me(n,this.array),r=me(r,this.array),s=me(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Za&&(t.usage=this.usage),t}}class al extends rn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class ol extends rn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Me extends rn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let bu=0;const Ze=new ge,Zs=new Te,Ti=new V,Ye=new ci,lr=new ci,Ce=new V;class ke extends Qi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:bu++}),this.uuid=Hn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(el(t)?ol:al)(t,1):this.index=t,this}setIndirect(t){return this.indirect=t,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new $t().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ze.makeRotationFromQuaternion(t),this.applyMatrix4(Ze),this}rotateX(t){return Ze.makeRotationX(t),this.applyMatrix4(Ze),this}rotateY(t){return Ze.makeRotationY(t),this.applyMatrix4(Ze),this}rotateZ(t){return Ze.makeRotationZ(t),this.applyMatrix4(Ze),this}translate(t,e,n){return Ze.makeTranslation(t,e,n),this.applyMatrix4(Ze),this}scale(t,e,n){return Ze.makeScale(t,e,n),this.applyMatrix4(Ze),this}lookAt(t){return Zs.lookAt(t),Zs.updateMatrix(),this.applyMatrix4(Zs.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ti).negate(),this.translate(Ti.x,Ti.y,Ti.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let r=0,s=t.length;r<s;r++){const a=t[r];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Me(n,3))}else{for(let n=0,r=e.count;n<r;n++){const s=t[n];e.setXYZ(n,s.x,s.y,s.z||0)}t.length>e.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ci);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new V(-1/0,-1/0,-1/0),new V(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){const s=e[n];Ye.setFromBufferAttribute(s),this.morphTargetsRelative?(Ce.addVectors(this.boundingBox.min,Ye.min),this.boundingBox.expandByPoint(Ce),Ce.addVectors(this.boundingBox.max,Ye.max),this.boundingBox.expandByPoint(Ce)):(this.boundingBox.expandByPoint(Ye.min),this.boundingBox.expandByPoint(Ye.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ar);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new V,1/0);return}if(t){const n=this.boundingSphere.center;if(Ye.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const o=e[s];lr.setFromBufferAttribute(o),this.morphTargetsRelative?(Ce.addVectors(Ye.min,lr.min),Ye.expandByPoint(Ce),Ce.addVectors(Ye.max,lr.max),Ye.expandByPoint(Ce)):(Ye.expandByPoint(lr.min),Ye.expandByPoint(lr.max))}Ye.getCenter(n);let r=0;for(let s=0,a=t.count;s<a;s++)Ce.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(Ce));if(e)for(let s=0,a=e.length;s<a;s++){const o=e[s],c=this.morphTargetsRelative;for(let h=0,u=o.count;h<u;h++)Ce.fromBufferAttribute(o,h),c&&(Ti.fromBufferAttribute(t,h),Ce.add(Ti)),r=Math.max(r,n.distanceToSquared(Ce))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,r=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new rn(new Float32Array(4*n.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let N=0;N<n.count;N++)o[N]=new V,c[N]=new V;const h=new V,u=new V,f=new V,p=new Ht,_=new Ht,x=new Ht,y=new V,v=new V;function d(N,w,T){h.fromBufferAttribute(n,N),u.fromBufferAttribute(n,w),f.fromBufferAttribute(n,T),p.fromBufferAttribute(s,N),_.fromBufferAttribute(s,w),x.fromBufferAttribute(s,T),u.sub(h),f.sub(h),_.sub(p),x.sub(p);const U=1/(_.x*x.y-x.x*_.y);isFinite(U)&&(y.copy(u).multiplyScalar(x.y).addScaledVector(f,-_.y).multiplyScalar(U),v.copy(f).multiplyScalar(_.x).addScaledVector(u,-x.x).multiplyScalar(U),o[N].add(y),o[w].add(y),o[T].add(y),c[N].add(v),c[w].add(v),c[T].add(v))}let R=this.groups;R.length===0&&(R=[{start:0,count:t.count}]);for(let N=0,w=R.length;N<w;++N){const T=R[N],U=T.start,$=T.count;for(let X=U,J=U+$;X<J;X+=3)d(t.getX(X+0),t.getX(X+1),t.getX(X+2))}const b=new V,A=new V,H=new V,D=new V;function I(N){H.fromBufferAttribute(r,N),D.copy(H);const w=o[N];b.copy(w),b.sub(H.multiplyScalar(H.dot(w))).normalize(),A.crossVectors(D,w);const U=A.dot(c[N])<0?-1:1;a.setXYZW(N,b.x,b.y,b.z,U)}for(let N=0,w=R.length;N<w;++N){const T=R[N],U=T.start,$=T.count;for(let X=U,J=U+$;X<J;X+=3)I(t.getX(X+0)),I(t.getX(X+1)),I(t.getX(X+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new rn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let p=0,_=n.count;p<_;p++)n.setXYZ(p,0,0,0);const r=new V,s=new V,a=new V,o=new V,c=new V,h=new V,u=new V,f=new V;if(t)for(let p=0,_=t.count;p<_;p+=3){const x=t.getX(p+0),y=t.getX(p+1),v=t.getX(p+2);r.fromBufferAttribute(e,x),s.fromBufferAttribute(e,y),a.fromBufferAttribute(e,v),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),o.fromBufferAttribute(n,x),c.fromBufferAttribute(n,y),h.fromBufferAttribute(n,v),o.add(u),c.add(u),h.add(u),n.setXYZ(x,o.x,o.y,o.z),n.setXYZ(y,c.x,c.y,c.z),n.setXYZ(v,h.x,h.y,h.z)}else for(let p=0,_=e.count;p<_;p+=3)r.fromBufferAttribute(e,p+0),s.fromBufferAttribute(e,p+1),a.fromBufferAttribute(e,p+2),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),n.setXYZ(p+0,u.x,u.y,u.z),n.setXYZ(p+1,u.x,u.y,u.z),n.setXYZ(p+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ce.fromBufferAttribute(t,e),Ce.normalize(),t.setXYZ(e,Ce.x,Ce.y,Ce.z)}toNonIndexed(){function t(o,c){const h=o.array,u=o.itemSize,f=o.normalized,p=new h.constructor(c.length*u);let _=0,x=0;for(let y=0,v=c.length;y<v;y++){o.isInterleavedBufferAttribute?_=c[y]*o.data.stride+o.offset:_=c[y]*u;for(let d=0;d<u;d++)p[x++]=h[_++]}return new rn(p,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ke,n=this.index.array,r=this.attributes;for(const o in r){const c=r[o],h=t(c,n);e.setAttribute(o,h)}const s=this.morphAttributes;for(const o in s){const c=[],h=s[o];for(let u=0,f=h.length;u<f;u++){const p=h[u],_=t(p,n);c.push(_)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const h=a[o];e.addGroup(h.start,h.count,h.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(t[h]=c[h]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const h=n[c];t.data.attributes[c]=h.toJSON(t.data)}const r={};let s=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],u=[];for(let f=0,p=h.length;f<p;f++){const _=h[f];u.push(_.toJSON(t.data))}u.length>0&&(r[c]=u,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const r=t.attributes;for(const h in r){const u=r[h];this.setAttribute(h,u.clone(e))}const s=t.morphAttributes;for(const h in s){const u=[],f=s[h];for(let p=0,_=f.length;p<_;p++)u.push(f[p].clone(e));this.morphAttributes[h]=u}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let h=0,u=a.length;h<u;h++){const f=a[h];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const jo=new ge,qn=new xu,Br=new Ar,Ko=new V,zr=new V,kr=new V,Hr=new V,Js=new V,Gr=new V,Zo=new V,Vr=new V;class oe extends Te{constructor(t=new ke,e=new ri){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(r,t);const o=this.morphTargetInfluences;if(s&&o){Gr.set(0,0,0);for(let c=0,h=s.length;c<h;c++){const u=o[c],f=s[c];u!==0&&(Js.fromBufferAttribute(f,t),a?Gr.addScaledVector(Js,u):Gr.addScaledVector(Js.sub(e),u))}e.add(Gr)}return e}raycast(t,e){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Br.copy(n.boundingSphere),Br.applyMatrix4(s),qn.copy(t.ray).recast(t.near),!(Br.containsPoint(qn.origin)===!1&&(qn.intersectSphere(Br,Ko)===null||qn.origin.distanceToSquared(Ko)>(t.far-t.near)**2))&&(jo.copy(s).invert(),qn.copy(t.ray).applyMatrix4(jo),!(n.boundingBox!==null&&qn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,qn)))}_computeIntersections(t,e,n){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,h=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,p=s.groups,_=s.drawRange;if(o!==null)if(Array.isArray(a))for(let x=0,y=p.length;x<y;x++){const v=p[x],d=a[v.materialIndex],R=Math.max(v.start,_.start),b=Math.min(o.count,Math.min(v.start+v.count,_.start+_.count));for(let A=R,H=b;A<H;A+=3){const D=o.getX(A),I=o.getX(A+1),N=o.getX(A+2);r=Wr(this,d,t,n,h,u,f,D,I,N),r&&(r.faceIndex=Math.floor(A/3),r.face.materialIndex=v.materialIndex,e.push(r))}}else{const x=Math.max(0,_.start),y=Math.min(o.count,_.start+_.count);for(let v=x,d=y;v<d;v+=3){const R=o.getX(v),b=o.getX(v+1),A=o.getX(v+2);r=Wr(this,a,t,n,h,u,f,R,b,A),r&&(r.faceIndex=Math.floor(v/3),e.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let x=0,y=p.length;x<y;x++){const v=p[x],d=a[v.materialIndex],R=Math.max(v.start,_.start),b=Math.min(c.count,Math.min(v.start+v.count,_.start+_.count));for(let A=R,H=b;A<H;A+=3){const D=A,I=A+1,N=A+2;r=Wr(this,d,t,n,h,u,f,D,I,N),r&&(r.faceIndex=Math.floor(A/3),r.face.materialIndex=v.materialIndex,e.push(r))}}else{const x=Math.max(0,_.start),y=Math.min(c.count,_.start+_.count);for(let v=x,d=y;v<d;v+=3){const R=v,b=v+1,A=v+2;r=Wr(this,a,t,n,h,u,f,R,b,A),r&&(r.faceIndex=Math.floor(v/3),e.push(r))}}}}function Ru(i,t,e,n,r,s,a,o){let c;if(t.side===ze?c=n.intersectTriangle(a,s,r,!0,o):c=n.intersectTriangle(r,s,a,t.side===Gn,o),c===null)return null;Vr.copy(o),Vr.applyMatrix4(i.matrixWorld);const h=e.ray.origin.distanceTo(Vr);return h<e.near||h>e.far?null:{distance:h,point:Vr.clone(),object:i}}function Wr(i,t,e,n,r,s,a,o,c,h){i.getVertexPosition(o,zr),i.getVertexPosition(c,kr),i.getVertexPosition(h,Hr);const u=Ru(i,t,e,n,zr,kr,Hr,Zo);if(u){const f=new V;nn.getBarycoord(Zo,zr,kr,Hr,f),r&&(u.uv=nn.getInterpolatedAttribute(r,o,c,h,f,new Ht)),s&&(u.uv1=nn.getInterpolatedAttribute(s,o,c,h,f,new Ht)),a&&(u.normal=nn.getInterpolatedAttribute(a,o,c,h,f,new V),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const p={a:o,b:c,c:h,normal:new V,materialIndex:0};nn.getNormal(zr,kr,Hr,p.normal),u.face=p,u.barycoord=f}return u}class Ne extends ke{constructor(t=1,e=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],h=[],u=[],f=[];let p=0,_=0;x("z","y","x",-1,-1,n,e,t,a,s,0),x("z","y","x",1,-1,n,e,-t,a,s,1),x("x","z","y",1,1,t,n,e,r,a,2),x("x","z","y",1,-1,t,n,-e,r,a,3),x("x","y","z",1,-1,t,e,n,r,s,4),x("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new Me(h,3)),this.setAttribute("normal",new Me(u,3)),this.setAttribute("uv",new Me(f,2));function x(y,v,d,R,b,A,H,D,I,N,w){const T=A/I,U=H/N,$=A/2,X=H/2,J=D/2,nt=I+1,Z=N+1;let tt=0,Y=0;const ft=new V;for(let Mt=0;Mt<Z;Mt++){const Rt=Mt*U-X;for(let Xt=0;Xt<nt;Xt++){const ue=Xt*T-$;ft[y]=ue*R,ft[v]=Rt*b,ft[d]=J,h.push(ft.x,ft.y,ft.z),ft[y]=0,ft[v]=0,ft[d]=D>0?1:-1,u.push(ft.x,ft.y,ft.z),f.push(Xt/I),f.push(1-Mt/N),tt+=1}}for(let Mt=0;Mt<N;Mt++)for(let Rt=0;Rt<I;Rt++){const Xt=p+Rt+nt*Mt,ue=p+Rt+nt*(Mt+1),Q=p+(Rt+1)+nt*(Mt+1),ot=p+(Rt+1)+nt*Mt;c.push(Xt,ue,ot),c.push(ue,Q,ot),Y+=6}o.addGroup(_,Y,w),_+=Y,p+=tt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ne(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ji(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function Be(i){const t={};for(let e=0;e<i.length;e++){const n=ji(i[e]);for(const r in n)t[r]=n[r]}return t}function Cu(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function cl(i){const t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:he.workingColorSpace}const Pu={clone:ji,merge:Be};var Iu=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Lu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Vn extends li{static get type(){return"ShaderMaterial"}constructor(t){super(),this.isShaderMaterial=!0,this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Iu,this.fragmentShader=Lu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ji(t.uniforms),this.uniformsGroups=Cu(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?e.uniforms[r]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[r]={type:"m4",value:a.toArray()}:e.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class ll extends Te{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ge,this.projectionMatrix=new ge,this.projectionMatrixInverse=new ge,this.coordinateSystem=Tn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Un=new V,Jo=new Ht,Qo=new Ht;class tn extends ll{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Ja*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Ls*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Ja*2*Math.atan(Math.tan(Ls*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Un.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Un.x,Un.y).multiplyScalar(-t/Un.z),Un.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Un.x,Un.y).multiplyScalar(-t/Un.z)}getViewSize(t,e){return this.getViewBounds(t,Jo,Qo),e.subVectors(Qo,Jo)}setViewOffset(t,e,n,r,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Ls*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,h=a.fullHeight;s+=a.offsetX*r/c,e-=a.offsetY*n/h,r*=a.width/c,n*=a.height/h}const o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const Ai=-90,wi=1;class Du extends Te{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new tn(Ai,wi,t,e);r.layers=this.layers,this.add(r);const s=new tn(Ai,wi,t,e);s.layers=this.layers,this.add(s);const a=new tn(Ai,wi,t,e);a.layers=this.layers,this.add(a);const o=new tn(Ai,wi,t,e);o.layers=this.layers,this.add(o);const c=new tn(Ai,wi,t,e);c.layers=this.layers,this.add(c);const h=new tn(Ai,wi,t,e);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,r,s,a,o,c]=e;for(const h of e)this.remove(h);if(t===Tn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===us)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const h of e)this.add(h),h.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,h,u]=this.children,f=t.getRenderTarget(),p=t.getActiveCubeFace(),_=t.getActiveMipmapLevel(),x=t.xr.enabled;t.xr.enabled=!1;const y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,a),t.setRenderTarget(n,2,r),t.render(e,o),t.setRenderTarget(n,3,r),t.render(e,c),t.setRenderTarget(n,4,r),t.render(e,h),n.texture.generateMipmaps=y,t.setRenderTarget(n,5,r),t.render(e,u),t.setRenderTarget(f,p,_),t.xr.enabled=x,n.texture.needsPMREMUpdate=!0}}class hl extends Oe{constructor(t,e,n,r,s,a,o,c,h,u){t=t!==void 0?t:[],e=e!==void 0?e:$i,super(t,e,n,r,s,a,o,c,h,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Uu extends oi{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];this.texture=new hl(r,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:mn}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Ne(5,5,5),s=new Vn({name:"CubemapFromEquirect",uniforms:ji(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:ze,blending:zn});s.uniforms.tEquirect.value=e;const a=new oe(r,s),o=e.minFilter;return e.minFilter===ni&&(e.minFilter=mn),new Du(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,r){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,r);t.setRenderTarget(s)}}const Qs=new V,Nu=new V,Ou=new $t;class Zn{constructor(t=new V(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const r=Qs.subVectors(n,e).cross(Nu.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(Qs),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Ou.getNormalMatrix(t),r=this.coplanarPoint(Qs).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Yn=new Ar,$r=new V;class mo{constructor(t=new Zn,e=new Zn,n=new Zn,r=new Zn,s=new Zn,a=new Zn){this.planes=[t,e,n,r,s,a]}set(t,e,n,r,s,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Tn){const n=this.planes,r=t.elements,s=r[0],a=r[1],o=r[2],c=r[3],h=r[4],u=r[5],f=r[6],p=r[7],_=r[8],x=r[9],y=r[10],v=r[11],d=r[12],R=r[13],b=r[14],A=r[15];if(n[0].setComponents(c-s,p-h,v-_,A-d).normalize(),n[1].setComponents(c+s,p+h,v+_,A+d).normalize(),n[2].setComponents(c+a,p+u,v+x,A+R).normalize(),n[3].setComponents(c-a,p-u,v-x,A-R).normalize(),n[4].setComponents(c-o,p-f,v-y,A-b).normalize(),e===Tn)n[5].setComponents(c+o,p+f,v+y,A+b).normalize();else if(e===us)n[5].setComponents(o,f,y,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Yn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Yn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Yn)}intersectsSprite(t){return Yn.center.set(0,0,0),Yn.radius=.7071067811865476,Yn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Yn)}intersectsSphere(t){const e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const r=e[n];if($r.x=r.normal.x>0?t.max.x:t.min.x,$r.y=r.normal.y>0?t.max.y:t.min.y,$r.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint($r)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function ul(){let i=null,t=!1,e=null,n=null;function r(s,a){e(s,a),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function Fu(i){const t=new WeakMap;function e(o,c){const h=o.array,u=o.usage,f=h.byteLength,p=i.createBuffer();i.bindBuffer(c,p),i.bufferData(c,h,u),o.onUploadCallback();let _;if(h instanceof Float32Array)_=i.FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?_=i.HALF_FLOAT:_=i.UNSIGNED_SHORT;else if(h instanceof Int16Array)_=i.SHORT;else if(h instanceof Uint32Array)_=i.UNSIGNED_INT;else if(h instanceof Int32Array)_=i.INT;else if(h instanceof Int8Array)_=i.BYTE;else if(h instanceof Uint8Array)_=i.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)_=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:p,type:_,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,c,h){const u=c.array,f=c.updateRanges;if(i.bindBuffer(h,o),f.length===0)i.bufferSubData(h,0,u);else{f.sort((_,x)=>_.start-x.start);let p=0;for(let _=1;_<f.length;_++){const x=f[p],y=f[_];y.start<=x.start+x.count+1?x.count=Math.max(x.count,y.start+y.count-x.start):(++p,f[p]=y)}f.length=p+1;for(let _=0,x=f.length;_<x;_++){const y=f[_];i.bufferSubData(h,y.start*u.BYTES_PER_ELEMENT,u,y.start,y.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=t.get(o);c&&(i.deleteBuffer(c.buffer),t.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const h=t.get(o);if(h===void 0)t.set(o,e(o,c));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(h.buffer,o,c),h.version=o.version}}return{get:r,remove:s,update:a}}class Ki extends ke{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};const s=t/2,a=e/2,o=Math.floor(n),c=Math.floor(r),h=o+1,u=c+1,f=t/o,p=e/c,_=[],x=[],y=[],v=[];for(let d=0;d<u;d++){const R=d*p-a;for(let b=0;b<h;b++){const A=b*f-s;x.push(A,-R,0),y.push(0,0,1),v.push(b/o),v.push(1-d/c)}}for(let d=0;d<c;d++)for(let R=0;R<o;R++){const b=R+h*d,A=R+h*(d+1),H=R+1+h*(d+1),D=R+1+h*d;_.push(b,A,D),_.push(A,H,D)}this.setIndex(_),this.setAttribute("position",new Me(x,3)),this.setAttribute("normal",new Me(y,3)),this.setAttribute("uv",new Me(v,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ki(t.width,t.height,t.widthSegments,t.heightSegments)}}var Bu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,zu=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,ku=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Hu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Gu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Vu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Wu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,$u=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Xu=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,qu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Yu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ju=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ku=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Zu=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Ju=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Qu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,tf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ef=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,nf=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,rf=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,sf=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,af=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,of=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,cf=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,lf=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,hf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,uf=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,ff=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,df=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,pf=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,mf="gl_FragColor = linearToOutputTexel( gl_FragColor );",gf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,_f=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,vf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,xf=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Mf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,yf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Sf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ef=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Tf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Af=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,wf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,bf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Rf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Cf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Pf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,If=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Lf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Df=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Uf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Nf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Of=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Ff=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Bf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,zf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,kf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Hf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Gf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Vf=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Wf=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,$f=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Xf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,qf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Yf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,jf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Kf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Zf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Jf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Qf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,td=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,ed=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,nd=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,id=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,rd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,sd=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ad=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,od=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,cd=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ld=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,hd=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ud=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,fd=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,dd=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,pd=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,md=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,gd=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,_d=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,vd=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,xd=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Md=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,yd=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Sd=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Ed=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Td=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Ad=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,wd=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,bd=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Rd=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Cd=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Pd=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Id=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ld=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Dd=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Ud=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Nd=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Od=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Fd=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Bd=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,zd=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Hd=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Gd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Vd=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wd=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,$d=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Xd=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,qd=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Yd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,jd=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kd=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Zd=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Jd=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Qd=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ep=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,np=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,ip=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,sp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,ap=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,op=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,lp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,up=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,dp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,pp=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,mp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,gp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,_p=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Yt={alphahash_fragment:Bu,alphahash_pars_fragment:zu,alphamap_fragment:ku,alphamap_pars_fragment:Hu,alphatest_fragment:Gu,alphatest_pars_fragment:Vu,aomap_fragment:Wu,aomap_pars_fragment:$u,batching_pars_vertex:Xu,batching_vertex:qu,begin_vertex:Yu,beginnormal_vertex:ju,bsdfs:Ku,iridescence_fragment:Zu,bumpmap_pars_fragment:Ju,clipping_planes_fragment:Qu,clipping_planes_pars_fragment:tf,clipping_planes_pars_vertex:ef,clipping_planes_vertex:nf,color_fragment:rf,color_pars_fragment:sf,color_pars_vertex:af,color_vertex:of,common:cf,cube_uv_reflection_fragment:lf,defaultnormal_vertex:hf,displacementmap_pars_vertex:uf,displacementmap_vertex:ff,emissivemap_fragment:df,emissivemap_pars_fragment:pf,colorspace_fragment:mf,colorspace_pars_fragment:gf,envmap_fragment:_f,envmap_common_pars_fragment:vf,envmap_pars_fragment:xf,envmap_pars_vertex:Mf,envmap_physical_pars_fragment:If,envmap_vertex:yf,fog_vertex:Sf,fog_pars_vertex:Ef,fog_fragment:Tf,fog_pars_fragment:Af,gradientmap_pars_fragment:wf,lightmap_pars_fragment:bf,lights_lambert_fragment:Rf,lights_lambert_pars_fragment:Cf,lights_pars_begin:Pf,lights_toon_fragment:Lf,lights_toon_pars_fragment:Df,lights_phong_fragment:Uf,lights_phong_pars_fragment:Nf,lights_physical_fragment:Of,lights_physical_pars_fragment:Ff,lights_fragment_begin:Bf,lights_fragment_maps:zf,lights_fragment_end:kf,logdepthbuf_fragment:Hf,logdepthbuf_pars_fragment:Gf,logdepthbuf_pars_vertex:Vf,logdepthbuf_vertex:Wf,map_fragment:$f,map_pars_fragment:Xf,map_particle_fragment:qf,map_particle_pars_fragment:Yf,metalnessmap_fragment:jf,metalnessmap_pars_fragment:Kf,morphinstance_vertex:Zf,morphcolor_vertex:Jf,morphnormal_vertex:Qf,morphtarget_pars_vertex:td,morphtarget_vertex:ed,normal_fragment_begin:nd,normal_fragment_maps:id,normal_pars_fragment:rd,normal_pars_vertex:sd,normal_vertex:ad,normalmap_pars_fragment:od,clearcoat_normal_fragment_begin:cd,clearcoat_normal_fragment_maps:ld,clearcoat_pars_fragment:hd,iridescence_pars_fragment:ud,opaque_fragment:fd,packing:dd,premultiplied_alpha_fragment:pd,project_vertex:md,dithering_fragment:gd,dithering_pars_fragment:_d,roughnessmap_fragment:vd,roughnessmap_pars_fragment:xd,shadowmap_pars_fragment:Md,shadowmap_pars_vertex:yd,shadowmap_vertex:Sd,shadowmask_pars_fragment:Ed,skinbase_vertex:Td,skinning_pars_vertex:Ad,skinning_vertex:wd,skinnormal_vertex:bd,specularmap_fragment:Rd,specularmap_pars_fragment:Cd,tonemapping_fragment:Pd,tonemapping_pars_fragment:Id,transmission_fragment:Ld,transmission_pars_fragment:Dd,uv_pars_fragment:Ud,uv_pars_vertex:Nd,uv_vertex:Od,worldpos_vertex:Fd,background_vert:Bd,background_frag:zd,backgroundCube_vert:kd,backgroundCube_frag:Hd,cube_vert:Gd,cube_frag:Vd,depth_vert:Wd,depth_frag:$d,distanceRGBA_vert:Xd,distanceRGBA_frag:qd,equirect_vert:Yd,equirect_frag:jd,linedashed_vert:Kd,linedashed_frag:Zd,meshbasic_vert:Jd,meshbasic_frag:Qd,meshlambert_vert:tp,meshlambert_frag:ep,meshmatcap_vert:np,meshmatcap_frag:ip,meshnormal_vert:rp,meshnormal_frag:sp,meshphong_vert:ap,meshphong_frag:op,meshphysical_vert:cp,meshphysical_frag:lp,meshtoon_vert:hp,meshtoon_frag:up,points_vert:fp,points_frag:dp,shadow_vert:pp,shadow_frag:mp,sprite_vert:gp,sprite_frag:_p},dt={common:{diffuse:{value:new ne(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new $t}},envmap:{envMap:{value:null},envMapRotation:{value:new $t},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new $t}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new $t}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new $t},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new $t},normalScale:{value:new Ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new $t},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new $t}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new $t}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new $t}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ne(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ne(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0},uvTransform:{value:new $t}},sprite:{diffuse:{value:new ne(16777215)},opacity:{value:1},center:{value:new Ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new $t},alphaMap:{value:null},alphaMapTransform:{value:new $t},alphaTest:{value:0}}},dn={basic:{uniforms:Be([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.fog]),vertexShader:Yt.meshbasic_vert,fragmentShader:Yt.meshbasic_frag},lambert:{uniforms:Be([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new ne(0)}}]),vertexShader:Yt.meshlambert_vert,fragmentShader:Yt.meshlambert_frag},phong:{uniforms:Be([dt.common,dt.specularmap,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,dt.lights,{emissive:{value:new ne(0)},specular:{value:new ne(1118481)},shininess:{value:30}}]),vertexShader:Yt.meshphong_vert,fragmentShader:Yt.meshphong_frag},standard:{uniforms:Be([dt.common,dt.envmap,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.roughnessmap,dt.metalnessmap,dt.fog,dt.lights,{emissive:{value:new ne(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag},toon:{uniforms:Be([dt.common,dt.aomap,dt.lightmap,dt.emissivemap,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.gradientmap,dt.fog,dt.lights,{emissive:{value:new ne(0)}}]),vertexShader:Yt.meshtoon_vert,fragmentShader:Yt.meshtoon_frag},matcap:{uniforms:Be([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,dt.fog,{matcap:{value:null}}]),vertexShader:Yt.meshmatcap_vert,fragmentShader:Yt.meshmatcap_frag},points:{uniforms:Be([dt.points,dt.fog]),vertexShader:Yt.points_vert,fragmentShader:Yt.points_frag},dashed:{uniforms:Be([dt.common,dt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Yt.linedashed_vert,fragmentShader:Yt.linedashed_frag},depth:{uniforms:Be([dt.common,dt.displacementmap]),vertexShader:Yt.depth_vert,fragmentShader:Yt.depth_frag},normal:{uniforms:Be([dt.common,dt.bumpmap,dt.normalmap,dt.displacementmap,{opacity:{value:1}}]),vertexShader:Yt.meshnormal_vert,fragmentShader:Yt.meshnormal_frag},sprite:{uniforms:Be([dt.sprite,dt.fog]),vertexShader:Yt.sprite_vert,fragmentShader:Yt.sprite_frag},background:{uniforms:{uvTransform:{value:new $t},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Yt.background_vert,fragmentShader:Yt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new $t}},vertexShader:Yt.backgroundCube_vert,fragmentShader:Yt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Yt.cube_vert,fragmentShader:Yt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Yt.equirect_vert,fragmentShader:Yt.equirect_frag},distanceRGBA:{uniforms:Be([dt.common,dt.displacementmap,{referencePosition:{value:new V},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Yt.distanceRGBA_vert,fragmentShader:Yt.distanceRGBA_frag},shadow:{uniforms:Be([dt.lights,dt.fog,{color:{value:new ne(0)},opacity:{value:1}}]),vertexShader:Yt.shadow_vert,fragmentShader:Yt.shadow_frag}};dn.physical={uniforms:Be([dn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new $t},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new $t},clearcoatNormalScale:{value:new Ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new $t},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new $t},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new $t},sheen:{value:0},sheenColor:{value:new ne(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new $t},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new $t},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new $t},transmissionSamplerSize:{value:new Ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new $t},attenuationDistance:{value:0},attenuationColor:{value:new ne(0)},specularColor:{value:new ne(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new $t},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new $t},anisotropyVector:{value:new Ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new $t}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag};const Xr={r:0,b:0,g:0},jn=new hn,vp=new ge;function xp(i,t,e,n,r,s,a){const o=new ne(0);let c=s===!0?0:1,h,u,f=null,p=0,_=null;function x(R){let b=R.isScene===!0?R.background:null;return b&&b.isTexture&&(b=(R.backgroundBlurriness>0?e:t).get(b)),b}function y(R){let b=!1;const A=x(R);A===null?d(o,c):A&&A.isColor&&(d(A,1),b=!0);const H=i.xr.getEnvironmentBlendMode();H==="additive"?n.buffers.color.setClear(0,0,0,1,a):H==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||b)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function v(R,b){const A=x(b);A&&(A.isCubeTexture||A.mapping===Es)?(u===void 0&&(u=new oe(new Ne(1,1,1),new Vn({name:"BackgroundCubeMaterial",uniforms:ji(dn.backgroundCube.uniforms),vertexShader:dn.backgroundCube.vertexShader,fragmentShader:dn.backgroundCube.fragmentShader,side:ze,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(H,D,I){this.matrixWorld.copyPosition(I.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),jn.copy(b.backgroundRotation),jn.x*=-1,jn.y*=-1,jn.z*=-1,A.isCubeTexture&&A.isRenderTargetTexture===!1&&(jn.y*=-1,jn.z*=-1),u.material.uniforms.envMap.value=A,u.material.uniforms.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(vp.makeRotationFromEuler(jn)),u.material.toneMapped=he.getTransfer(A.colorSpace)!==pe,(f!==A||p!==A.version||_!==i.toneMapping)&&(u.material.needsUpdate=!0,f=A,p=A.version,_=i.toneMapping),u.layers.enableAll(),R.unshift(u,u.geometry,u.material,0,0,null)):A&&A.isTexture&&(h===void 0&&(h=new oe(new Ki(2,2),new Vn({name:"BackgroundMaterial",uniforms:ji(dn.background.uniforms),vertexShader:dn.background.vertexShader,fragmentShader:dn.background.fragmentShader,side:Gn,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(h)),h.material.uniforms.t2D.value=A,h.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,h.material.toneMapped=he.getTransfer(A.colorSpace)!==pe,A.matrixAutoUpdate===!0&&A.updateMatrix(),h.material.uniforms.uvTransform.value.copy(A.matrix),(f!==A||p!==A.version||_!==i.toneMapping)&&(h.material.needsUpdate=!0,f=A,p=A.version,_=i.toneMapping),h.layers.enableAll(),R.unshift(h,h.geometry,h.material,0,0,null))}function d(R,b){R.getRGB(Xr,cl(i)),n.buffers.color.setClear(Xr.r,Xr.g,Xr.b,b,a)}return{getClearColor:function(){return o},setClearColor:function(R,b=1){o.set(R),c=b,d(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(R){c=R,d(o,c)},render:y,addToRenderList:v}}function Mp(i,t){const e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},r=p(null);let s=r,a=!1;function o(T,U,$,X,J){let nt=!1;const Z=f(X,$,U);s!==Z&&(s=Z,h(s.object)),nt=_(T,X,$,J),nt&&x(T,X,$,J),J!==null&&t.update(J,i.ELEMENT_ARRAY_BUFFER),(nt||a)&&(a=!1,A(T,U,$,X),J!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(J).buffer))}function c(){return i.createVertexArray()}function h(T){return i.bindVertexArray(T)}function u(T){return i.deleteVertexArray(T)}function f(T,U,$){const X=$.wireframe===!0;let J=n[T.id];J===void 0&&(J={},n[T.id]=J);let nt=J[U.id];nt===void 0&&(nt={},J[U.id]=nt);let Z=nt[X];return Z===void 0&&(Z=p(c()),nt[X]=Z),Z}function p(T){const U=[],$=[],X=[];for(let J=0;J<e;J++)U[J]=0,$[J]=0,X[J]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:$,attributeDivisors:X,object:T,attributes:{},index:null}}function _(T,U,$,X){const J=s.attributes,nt=U.attributes;let Z=0;const tt=$.getAttributes();for(const Y in tt)if(tt[Y].location>=0){const Mt=J[Y];let Rt=nt[Y];if(Rt===void 0&&(Y==="instanceMatrix"&&T.instanceMatrix&&(Rt=T.instanceMatrix),Y==="instanceColor"&&T.instanceColor&&(Rt=T.instanceColor)),Mt===void 0||Mt.attribute!==Rt||Rt&&Mt.data!==Rt.data)return!0;Z++}return s.attributesNum!==Z||s.index!==X}function x(T,U,$,X){const J={},nt=U.attributes;let Z=0;const tt=$.getAttributes();for(const Y in tt)if(tt[Y].location>=0){let Mt=nt[Y];Mt===void 0&&(Y==="instanceMatrix"&&T.instanceMatrix&&(Mt=T.instanceMatrix),Y==="instanceColor"&&T.instanceColor&&(Mt=T.instanceColor));const Rt={};Rt.attribute=Mt,Mt&&Mt.data&&(Rt.data=Mt.data),J[Y]=Rt,Z++}s.attributes=J,s.attributesNum=Z,s.index=X}function y(){const T=s.newAttributes;for(let U=0,$=T.length;U<$;U++)T[U]=0}function v(T){d(T,0)}function d(T,U){const $=s.newAttributes,X=s.enabledAttributes,J=s.attributeDivisors;$[T]=1,X[T]===0&&(i.enableVertexAttribArray(T),X[T]=1),J[T]!==U&&(i.vertexAttribDivisor(T,U),J[T]=U)}function R(){const T=s.newAttributes,U=s.enabledAttributes;for(let $=0,X=U.length;$<X;$++)U[$]!==T[$]&&(i.disableVertexAttribArray($),U[$]=0)}function b(T,U,$,X,J,nt,Z){Z===!0?i.vertexAttribIPointer(T,U,$,J,nt):i.vertexAttribPointer(T,U,$,X,J,nt)}function A(T,U,$,X){y();const J=X.attributes,nt=$.getAttributes(),Z=U.defaultAttributeValues;for(const tt in nt){const Y=nt[tt];if(Y.location>=0){let ft=J[tt];if(ft===void 0&&(tt==="instanceMatrix"&&T.instanceMatrix&&(ft=T.instanceMatrix),tt==="instanceColor"&&T.instanceColor&&(ft=T.instanceColor)),ft!==void 0){const Mt=ft.normalized,Rt=ft.itemSize,Xt=t.get(ft);if(Xt===void 0)continue;const ue=Xt.buffer,Q=Xt.type,ot=Xt.bytesPerElement,bt=Q===i.INT||Q===i.UNSIGNED_INT||ft.gpuType===ao;if(ft.isInterleavedBufferAttribute){const pt=ft.data,Ot=pt.stride,Ft=ft.offset;if(pt.isInstancedInterleavedBuffer){for(let Vt=0;Vt<Y.locationSize;Vt++)d(Y.location+Vt,pt.meshPerAttribute);T.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=pt.meshPerAttribute*pt.count)}else for(let Vt=0;Vt<Y.locationSize;Vt++)v(Y.location+Vt);i.bindBuffer(i.ARRAY_BUFFER,ue);for(let Vt=0;Vt<Y.locationSize;Vt++)b(Y.location+Vt,Rt/Y.locationSize,Q,Mt,Ot*ot,(Ft+Rt/Y.locationSize*Vt)*ot,bt)}else{if(ft.isInstancedBufferAttribute){for(let pt=0;pt<Y.locationSize;pt++)d(Y.location+pt,ft.meshPerAttribute);T.isInstancedMesh!==!0&&X._maxInstanceCount===void 0&&(X._maxInstanceCount=ft.meshPerAttribute*ft.count)}else for(let pt=0;pt<Y.locationSize;pt++)v(Y.location+pt);i.bindBuffer(i.ARRAY_BUFFER,ue);for(let pt=0;pt<Y.locationSize;pt++)b(Y.location+pt,Rt/Y.locationSize,Q,Mt,Rt*ot,Rt/Y.locationSize*pt*ot,bt)}}else if(Z!==void 0){const Mt=Z[tt];if(Mt!==void 0)switch(Mt.length){case 2:i.vertexAttrib2fv(Y.location,Mt);break;case 3:i.vertexAttrib3fv(Y.location,Mt);break;case 4:i.vertexAttrib4fv(Y.location,Mt);break;default:i.vertexAttrib1fv(Y.location,Mt)}}}}R()}function H(){N();for(const T in n){const U=n[T];for(const $ in U){const X=U[$];for(const J in X)u(X[J].object),delete X[J];delete U[$]}delete n[T]}}function D(T){if(n[T.id]===void 0)return;const U=n[T.id];for(const $ in U){const X=U[$];for(const J in X)u(X[J].object),delete X[J];delete U[$]}delete n[T.id]}function I(T){for(const U in n){const $=n[U];if($[T.id]===void 0)continue;const X=$[T.id];for(const J in X)u(X[J].object),delete X[J];delete $[T.id]}}function N(){w(),a=!0,s!==r&&(s=r,h(s.object))}function w(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:N,resetDefaultState:w,dispose:H,releaseStatesOfGeometry:D,releaseStatesOfProgram:I,initAttributes:y,enableAttribute:v,disableUnusedAttributes:R}}function yp(i,t,e){let n;function r(h){n=h}function s(h,u){i.drawArrays(n,h,u),e.update(u,n,1)}function a(h,u,f){f!==0&&(i.drawArraysInstanced(n,h,u,f),e.update(u,n,f))}function o(h,u,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,h,0,u,0,f);let _=0;for(let x=0;x<f;x++)_+=u[x];e.update(_,n,1)}function c(h,u,f,p){if(f===0)return;const _=t.get("WEBGL_multi_draw");if(_===null)for(let x=0;x<h.length;x++)a(h[x],u[x],p[x]);else{_.multiDrawArraysInstancedWEBGL(n,h,0,u,0,p,0,f);let x=0;for(let y=0;y<f;y++)x+=u[y]*p[y];e.update(x,n,1)}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function Sp(i,t,e,n){let r;function s(){if(r!==void 0)return r;if(t.has("EXT_texture_filter_anisotropic")===!0){const I=t.get("EXT_texture_filter_anisotropic");r=i.getParameter(I.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(I){return!(I!==cn&&n.convert(I)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(I){const N=I===Er&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(I!==wn&&n.convert(I)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&I!==gn&&!N)}function c(I){if(I==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";I="mediump"}return I==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=e.precision!==void 0?e.precision:"highp";const u=c(h);u!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",u,"instead."),h=u);const f=e.logarithmicDepthBuffer===!0,p=e.reverseDepthBuffer===!0&&t.has("EXT_clip_control"),_=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),v=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),R=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),A=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),H=x>0,D=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:f,reverseDepthBuffer:p,maxTextures:_,maxVertexTextures:x,maxTextureSize:y,maxCubemapSize:v,maxAttributes:d,maxVertexUniforms:R,maxVaryings:b,maxFragmentUniforms:A,vertexTextures:H,maxSamples:D}}function Ep(i){const t=this;let e=null,n=0,r=!1,s=!1;const a=new Zn,o=new $t,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,p){const _=f.length!==0||p||n!==0||r;return r=p,n=f.length,_},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,p){e=u(f,p,0)},this.setState=function(f,p,_){const x=f.clippingPlanes,y=f.clipIntersection,v=f.clipShadows,d=i.get(f);if(!r||x===null||x.length===0||s&&!v)s?u(null):h();else{const R=s?0:n,b=R*4;let A=d.clippingState||null;c.value=A,A=u(x,p,b,_);for(let H=0;H!==b;++H)A[H]=e[H];d.clippingState=A,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=R}};function h(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(f,p,_,x){const y=f!==null?f.length:0;let v=null;if(y!==0){if(v=c.value,x!==!0||v===null){const d=_+y*4,R=p.matrixWorldInverse;o.getNormalMatrix(R),(v===null||v.length<d)&&(v=new Float32Array(d));for(let b=0,A=_;b!==y;++b,A+=4)a.copy(f[b]).applyMatrix4(R,o),a.normal.toArray(v,A),v[A+3]=a.constant}c.value=v,c.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,v}}function Tp(i){let t=new WeakMap;function e(a,o){return o===Sa?a.mapping=$i:o===Ea&&(a.mapping=Xi),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===Sa||o===Ea)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const h=new Uu(c.height);return h.fromEquirectangularTexture(i,a),t.set(a,h),a.addEventListener("dispose",r),e(h.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}class fl extends ll{constructor(t=-1,e=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-t,a=n+t,o=r+e,c=r-e;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=h*this.view.offsetX,a=s+h*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ni=4,tc=[.125,.215,.35,.446,.526,.582],ti=20,ta=new fl,ec=new ne;let ea=null,na=0,ia=0,ra=!1;const Jn=(1+Math.sqrt(5))/2,bi=1/Jn,nc=[new V(-Jn,bi,0),new V(Jn,bi,0),new V(-bi,0,Jn),new V(bi,0,Jn),new V(0,Jn,-bi),new V(0,Jn,bi),new V(-1,1,-1),new V(1,1,-1),new V(-1,1,1),new V(1,1,1)];class ic{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100){ea=this._renderer.getRenderTarget(),na=this._renderer.getActiveCubeFace(),ia=this._renderer.getActiveMipmapLevel(),ra=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,n,r,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ac(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=sc(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ea,na,ia),this._renderer.xr.enabled=ra,t.scissorTest=!1,qr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===$i||t.mapping===Xi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ea=this._renderer.getRenderTarget(),na=this._renderer.getActiveCubeFace(),ia=this._renderer.getActiveMipmapLevel(),ra=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:mn,minFilter:mn,generateMipmaps:!1,type:Er,format:cn,colorSpace:Ji,depthBuffer:!1},r=rc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=rc(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Ap(s)),this._blurMaterial=wp(s,t,e)}return r}_compileMaterial(t){const e=new oe(this._lodPlanes[0],t);this._renderer.compile(e,ta)}_sceneToCubeUV(t,e,n,r){const o=new tn(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,p=u.toneMapping;u.getClearColor(ec),u.toneMapping=kn,u.autoClear=!1;const _=new ri({name:"PMREM.Background",side:ze,depthWrite:!1,depthTest:!1}),x=new oe(new Ne,_);let y=!1;const v=t.background;v?v.isColor&&(_.color.copy(v),t.background=null,y=!0):(_.color.copy(ec),y=!0);for(let d=0;d<6;d++){const R=d%3;R===0?(o.up.set(0,c[d],0),o.lookAt(h[d],0,0)):R===1?(o.up.set(0,0,c[d]),o.lookAt(0,h[d],0)):(o.up.set(0,c[d],0),o.lookAt(0,0,h[d]));const b=this._cubeSize;qr(r,R*b,d>2?b:0,b,b),u.setRenderTarget(r),y&&u.render(x,o),u.render(t,o)}x.geometry.dispose(),x.material.dispose(),u.toneMapping=p,u.autoClear=f,t.background=v}_textureToCubeUV(t,e){const n=this._renderer,r=t.mapping===$i||t.mapping===Xi;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=ac()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=sc());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new oe(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=t;const c=this._cubeSize;qr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,ta)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=nc[(r-s-1)%nc.length];this._blur(t,s-1,s,a,o)}e.autoClear=n}_blur(t,e,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,r,"latitudinal",s),this._halfBlur(a,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,a,o){const c=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new oe(this._lodPlanes[r],h),p=h.uniforms,_=this._sizeLods[n]-1,x=isFinite(s)?Math.PI/(2*_):2*Math.PI/(2*ti-1),y=s/x,v=isFinite(s)?1+Math.floor(u*y):ti;v>ti&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${v} samples when the maximum is set to ${ti}`);const d=[];let R=0;for(let I=0;I<ti;++I){const N=I/y,w=Math.exp(-N*N/2);d.push(w),I===0?R+=w:I<v&&(R+=2*w)}for(let I=0;I<d.length;I++)d[I]=d[I]/R;p.envMap.value=t.texture,p.samples.value=v,p.weights.value=d,p.latitudinal.value=a==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:b}=this;p.dTheta.value=x,p.mipInt.value=b-n;const A=this._sizeLods[r],H=3*A*(r>b-Ni?r-b+Ni:0),D=4*(this._cubeSize-A);qr(e,H,D,3*A,2*A),c.setRenderTarget(e),c.render(f,ta)}}function Ap(i){const t=[],e=[],n=[];let r=i;const s=i-Ni+1+tc.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let c=1/o;a>i-Ni?c=tc[a-i+Ni-1]:a===0&&(c=0),n.push(c);const h=1/(o-2),u=-h,f=1+h,p=[u,u,f,u,f,f,u,u,f,f,u,f],_=6,x=6,y=3,v=2,d=1,R=new Float32Array(y*x*_),b=new Float32Array(v*x*_),A=new Float32Array(d*x*_);for(let D=0;D<_;D++){const I=D%3*2/3-1,N=D>2?0:-1,w=[I,N,0,I+2/3,N,0,I+2/3,N+1,0,I,N,0,I+2/3,N+1,0,I,N+1,0];R.set(w,y*x*D),b.set(p,v*x*D);const T=[D,D,D,D,D,D];A.set(T,d*x*D)}const H=new ke;H.setAttribute("position",new rn(R,y)),H.setAttribute("uv",new rn(b,v)),H.setAttribute("faceIndex",new rn(A,d)),t.push(H),r>Ni&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function rc(i,t,e){const n=new oi(i,t,e);return n.texture.mapping=Es,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function qr(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function wp(i,t,e){const n=new Float32Array(ti),r=new V(0,1,0);return new Vn({name:"SphericalGaussianBlur",defines:{n:ti,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:go(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:zn,depthTest:!1,depthWrite:!1})}function sc(){return new Vn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:go(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:zn,depthTest:!1,depthWrite:!1})}function ac(){return new Vn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:go(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:zn,depthTest:!1,depthWrite:!1})}function go(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function bp(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,h=c===Sa||c===Ea,u=c===$i||c===Xi;if(h||u){let f=t.get(o);const p=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==p)return e===null&&(e=new ic(i)),f=h?e.fromEquirectangular(o,f):e.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),f.texture;if(f!==void 0)return f.texture;{const _=o.image;return h&&_&&_.height>0||u&&_&&r(_)?(e===null&&(e=new ic(i)),f=h?e.fromEquirectangular(o):e.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,t.set(o,f),o.addEventListener("dispose",s),f.texture):null}}}return o}function r(o){let c=0;const h=6;for(let u=0;u<h;u++)o[u]!==void 0&&c++;return c===h}function s(o){const c=o.target;c.removeEventListener("dispose",s);const h=t.get(c);h!==void 0&&(t.delete(c),h.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Rp(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const r=e(n);return r===null&&gr("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function Cp(i,t,e,n){const r={},s=new WeakMap;function a(f){const p=f.target;p.index!==null&&t.remove(p.index);for(const x in p.attributes)t.remove(p.attributes[x]);for(const x in p.morphAttributes){const y=p.morphAttributes[x];for(let v=0,d=y.length;v<d;v++)t.remove(y[v])}p.removeEventListener("dispose",a),delete r[p.id];const _=s.get(p);_&&(t.remove(_),s.delete(p)),n.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,e.memory.geometries--}function o(f,p){return r[p.id]===!0||(p.addEventListener("dispose",a),r[p.id]=!0,e.memory.geometries++),p}function c(f){const p=f.attributes;for(const x in p)t.update(p[x],i.ARRAY_BUFFER);const _=f.morphAttributes;for(const x in _){const y=_[x];for(let v=0,d=y.length;v<d;v++)t.update(y[v],i.ARRAY_BUFFER)}}function h(f){const p=[],_=f.index,x=f.attributes.position;let y=0;if(_!==null){const R=_.array;y=_.version;for(let b=0,A=R.length;b<A;b+=3){const H=R[b+0],D=R[b+1],I=R[b+2];p.push(H,D,D,I,I,H)}}else if(x!==void 0){const R=x.array;y=x.version;for(let b=0,A=R.length/3-1;b<A;b+=3){const H=b+0,D=b+1,I=b+2;p.push(H,D,D,I,I,H)}}else return;const v=new(el(p)?ol:al)(p,1);v.version=y;const d=s.get(f);d&&t.remove(d),s.set(f,v)}function u(f){const p=s.get(f);if(p){const _=f.index;_!==null&&p.version<_.version&&h(f)}else h(f);return s.get(f)}return{get:o,update:c,getWireframeAttribute:u}}function Pp(i,t,e){let n;function r(p){n=p}let s,a;function o(p){s=p.type,a=p.bytesPerElement}function c(p,_){i.drawElements(n,_,s,p*a),e.update(_,n,1)}function h(p,_,x){x!==0&&(i.drawElementsInstanced(n,_,s,p*a,x),e.update(_,n,x))}function u(p,_,x){if(x===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,_,0,s,p,0,x);let v=0;for(let d=0;d<x;d++)v+=_[d];e.update(v,n,1)}function f(p,_,x,y){if(x===0)return;const v=t.get("WEBGL_multi_draw");if(v===null)for(let d=0;d<p.length;d++)h(p[d]/a,_[d],y[d]);else{v.multiDrawElementsInstancedWEBGL(n,_,0,s,p,0,y,0,x);let d=0;for(let R=0;R<x;R++)d+=_[R]*y[R];e.update(d,n,1)}}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=h,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function Ip(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(s/3);break;case i.LINES:e.lines+=o*(s/2);break;case i.LINE_STRIP:e.lines+=o*(s-1);break;case i.LINE_LOOP:e.lines+=o*s;break;case i.POINTS:e.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function Lp(i,t,e){const n=new WeakMap,r=new Se;function s(a,o,c){const h=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0;let p=n.get(o);if(p===void 0||p.count!==f){let T=function(){N.dispose(),n.delete(o),o.removeEventListener("dispose",T)};var _=T;p!==void 0&&p.texture.dispose();const x=o.morphAttributes.position!==void 0,y=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],R=o.morphAttributes.normal||[],b=o.morphAttributes.color||[];let A=0;x===!0&&(A=1),y===!0&&(A=2),v===!0&&(A=3);let H=o.attributes.position.count*A,D=1;H>t.maxTextureSize&&(D=Math.ceil(H/t.maxTextureSize),H=t.maxTextureSize);const I=new Float32Array(H*D*4*f),N=new il(I,H,D,f);N.type=gn,N.needsUpdate=!0;const w=A*4;for(let U=0;U<f;U++){const $=d[U],X=R[U],J=b[U],nt=H*D*4*U;for(let Z=0;Z<$.count;Z++){const tt=Z*w;x===!0&&(r.fromBufferAttribute($,Z),I[nt+tt+0]=r.x,I[nt+tt+1]=r.y,I[nt+tt+2]=r.z,I[nt+tt+3]=0),y===!0&&(r.fromBufferAttribute(X,Z),I[nt+tt+4]=r.x,I[nt+tt+5]=r.y,I[nt+tt+6]=r.z,I[nt+tt+7]=0),v===!0&&(r.fromBufferAttribute(J,Z),I[nt+tt+8]=r.x,I[nt+tt+9]=r.y,I[nt+tt+10]=r.z,I[nt+tt+11]=J.itemSize===4?r.w:1)}}p={count:f,texture:N,size:new Ht(H,D)},n.set(o,p),o.addEventListener("dispose",T)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",a.morphTexture,e);else{let x=0;for(let v=0;v<h.length;v++)x+=h[v];const y=o.morphTargetsRelative?1:1-x;c.getUniforms().setValue(i,"morphTargetBaseInfluence",y),c.getUniforms().setValue(i,"morphTargetInfluences",h)}c.getUniforms().setValue(i,"morphTargetsTexture",p.texture,e),c.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:s}}function Dp(i,t,e,n){let r=new WeakMap;function s(c){const h=n.render.frame,u=c.geometry,f=t.get(c,u);if(r.get(f)!==h&&(t.update(f),r.set(f,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const p=c.skeleton;r.get(p)!==h&&(p.update(),r.set(p,h))}return f}function a(){r=new WeakMap}function o(c){const h=c.target;h.removeEventListener("dispose",o),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:s,dispose:a}}class dl extends Oe{constructor(t,e,n,r,s,a,o,c,h,u=Bi){if(u!==Bi&&u!==Yi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===Bi&&(n=ai),n===void 0&&u===Yi&&(n=qi),super(null,r,s,a,o,c,u,n,h),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:je,this.minFilter=c!==void 0?c:je,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const pl=new Oe,oc=new dl(1,1),ml=new il,gl=new _u,_l=new hl,lc=[],hc=[],uc=new Float32Array(16),fc=new Float32Array(9),dc=new Float32Array(4);function tr(i,t,e){const n=i[0];if(n<=0||n>0)return i;const r=t*e;let s=lc[r];if(s===void 0&&(s=new Float32Array(r),lc[r]=s),t!==0){n.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(s,o)}return s}function we(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function be(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function As(i,t){let e=hc[t];e===void 0&&(e=new Int32Array(t),hc[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Up(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Np(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2fv(this.addr,t),be(e,t)}}function Op(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(we(e,t))return;i.uniform3fv(this.addr,t),be(e,t)}}function Fp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4fv(this.addr,t),be(e,t)}}function Bp(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),be(e,t)}else{if(we(e,n))return;dc.set(n),i.uniformMatrix2fv(this.addr,!1,dc),be(e,n)}}function zp(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),be(e,t)}else{if(we(e,n))return;fc.set(n),i.uniformMatrix3fv(this.addr,!1,fc),be(e,n)}}function kp(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(we(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),be(e,t)}else{if(we(e,n))return;uc.set(n),i.uniformMatrix4fv(this.addr,!1,uc),be(e,n)}}function Hp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Gp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2iv(this.addr,t),be(e,t)}}function Vp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3iv(this.addr,t),be(e,t)}}function Wp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4iv(this.addr,t),be(e,t)}}function $p(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Xp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(we(e,t))return;i.uniform2uiv(this.addr,t),be(e,t)}}function qp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(we(e,t))return;i.uniform3uiv(this.addr,t),be(e,t)}}function Yp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(we(e,t))return;i.uniform4uiv(this.addr,t),be(e,t)}}function jp(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);let s;this.type===i.SAMPLER_2D_SHADOW?(oc.compareFunction=tl,s=oc):s=pl,e.setTexture2D(t||s,r)}function Kp(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||gl,r)}function Zp(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||_l,r)}function Jp(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||ml,r)}function Qp(i){switch(i){case 5126:return Up;case 35664:return Np;case 35665:return Op;case 35666:return Fp;case 35674:return Bp;case 35675:return zp;case 35676:return kp;case 5124:case 35670:return Hp;case 35667:case 35671:return Gp;case 35668:case 35672:return Vp;case 35669:case 35673:return Wp;case 5125:return $p;case 36294:return Xp;case 36295:return qp;case 36296:return Yp;case 35678:case 36198:case 36298:case 36306:case 35682:return jp;case 35679:case 36299:case 36307:return Kp;case 35680:case 36300:case 36308:case 36293:return Zp;case 36289:case 36303:case 36311:case 36292:return Jp}}function tm(i,t){i.uniform1fv(this.addr,t)}function em(i,t){const e=tr(t,this.size,2);i.uniform2fv(this.addr,e)}function nm(i,t){const e=tr(t,this.size,3);i.uniform3fv(this.addr,e)}function im(i,t){const e=tr(t,this.size,4);i.uniform4fv(this.addr,e)}function rm(i,t){const e=tr(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function sm(i,t){const e=tr(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function am(i,t){const e=tr(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function om(i,t){i.uniform1iv(this.addr,t)}function cm(i,t){i.uniform2iv(this.addr,t)}function lm(i,t){i.uniform3iv(this.addr,t)}function hm(i,t){i.uniform4iv(this.addr,t)}function um(i,t){i.uniform1uiv(this.addr,t)}function fm(i,t){i.uniform2uiv(this.addr,t)}function dm(i,t){i.uniform3uiv(this.addr,t)}function pm(i,t){i.uniform4uiv(this.addr,t)}function mm(i,t,e){const n=this.cache,r=t.length,s=As(e,r);we(n,s)||(i.uniform1iv(this.addr,s),be(n,s));for(let a=0;a!==r;++a)e.setTexture2D(t[a]||pl,s[a])}function gm(i,t,e){const n=this.cache,r=t.length,s=As(e,r);we(n,s)||(i.uniform1iv(this.addr,s),be(n,s));for(let a=0;a!==r;++a)e.setTexture3D(t[a]||gl,s[a])}function _m(i,t,e){const n=this.cache,r=t.length,s=As(e,r);we(n,s)||(i.uniform1iv(this.addr,s),be(n,s));for(let a=0;a!==r;++a)e.setTextureCube(t[a]||_l,s[a])}function vm(i,t,e){const n=this.cache,r=t.length,s=As(e,r);we(n,s)||(i.uniform1iv(this.addr,s),be(n,s));for(let a=0;a!==r;++a)e.setTexture2DArray(t[a]||ml,s[a])}function xm(i){switch(i){case 5126:return tm;case 35664:return em;case 35665:return nm;case 35666:return im;case 35674:return rm;case 35675:return sm;case 35676:return am;case 5124:case 35670:return om;case 35667:case 35671:return cm;case 35668:case 35672:return lm;case 35669:case 35673:return hm;case 5125:return um;case 36294:return fm;case 36295:return dm;case 36296:return pm;case 35678:case 36198:case 36298:case 36306:case 35682:return mm;case 35679:case 36299:case 36307:return gm;case 35680:case 36300:case 36308:case 36293:return _m;case 36289:case 36303:case 36311:case 36292:return vm}}class Mm{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Qp(e.type)}}class ym{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=xm(e.type)}}class Sm{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(t,e[o.id],n)}}}const sa=/(\w+)(\])?(\[|\.)?/g;function pc(i,t){i.seq.push(t),i.map[t.id]=t}function Em(i,t,e){const n=i.name,r=n.length;for(sa.lastIndex=0;;){const s=sa.exec(n),a=sa.lastIndex;let o=s[1];const c=s[2]==="]",h=s[3];if(c&&(o=o|0),h===void 0||h==="["&&a+2===r){pc(e,h===void 0?new Mm(o,i,t):new ym(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new Sm(o),pc(e,f)),e=f}}}class os{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=t.getActiveUniform(e,r),a=t.getUniformLocation(e,s.name);Em(s,a,this)}}setValue(t,e,n,r){const s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){const r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,a=e.length;s!==a;++s){const o=e[s],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,r)}}static seqWithValue(t,e){const n=[];for(let r=0,s=t.length;r!==s;++r){const a=t[r];a.id in e&&n.push(a)}return n}}function mc(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Tm=37297;let Am=0;function wm(i,t){const e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const gc=new $t;function bm(i){he._getMatrix(gc,he.workingColorSpace,i);const t=`mat3( ${gc.elements.map(e=>e.toFixed(4))} )`;switch(he.getTransfer(i)){case Ts:return[t,"LinearTransferOETF"];case pe:return[t,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function _c(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=i.getShaderInfoLog(t).trim();if(n&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return e.toUpperCase()+`

`+r+`

`+wm(i.getShaderSource(t),a)}else return r}function Rm(i,t){const e=bm(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}function Cm(i,t){let e;switch(t){case Wh:e="Linear";break;case $h:e="Reinhard";break;case Xh:e="Cineon";break;case qh:e="ACESFilmic";break;case jh:e="AgX";break;case Kh:e="Neutral";break;case Yh:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Yr=new V;function Pm(){he.getLuminanceCoefficients(Yr);const i=Yr.x.toFixed(4),t=Yr.y.toFixed(4),e=Yr.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Im(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(_r).join(`
`)}function Lm(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Dm(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(t,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function _r(i){return i!==""}function vc(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function xc(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Um=/^[ \t]*#include +<([\w\d./]+)>/gm;function Qa(i){return i.replace(Um,Om)}const Nm=new Map;function Om(i,t){let e=Yt[t];if(e===void 0){const n=Nm.get(t);if(n!==void 0)e=Yt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Qa(e)}const Fm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Mc(i){return i.replace(Fm,Bm)}function Bm(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function yc(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function zm(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Vc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Eh?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===En&&(t="SHADOWMAP_TYPE_VSM"),t}function km(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case $i:case Xi:t="ENVMAP_TYPE_CUBE";break;case Es:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Hm(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Xi:t="ENVMAP_MODE_REFRACTION";break}return t}function Gm(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case so:t="ENVMAP_BLENDING_MULTIPLY";break;case Gh:t="ENVMAP_BLENDING_MIX";break;case Vh:t="ENVMAP_BLENDING_ADD";break}return t}function Vm(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Wm(i,t,e,n){const r=i.getContext(),s=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=zm(e),h=km(e),u=Hm(e),f=Gm(e),p=Vm(e),_=Im(e),x=Lm(s),y=r.createProgram();let v,d,R=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(v=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(_r).join(`
`),v.length>0&&(v+=`
`),d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(_r).join(`
`),d.length>0&&(d+=`
`)):(v=[yc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(_r).join(`
`),d=[yc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",e.envMap?"#define "+f:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==kn?"#define TONE_MAPPING":"",e.toneMapping!==kn?Yt.tonemapping_pars_fragment:"",e.toneMapping!==kn?Cm("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Yt.colorspace_pars_fragment,Rm("linearToOutputTexel",e.outputColorSpace),Pm(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(_r).join(`
`)),a=Qa(a),a=vc(a,e),a=xc(a,e),o=Qa(o),o=vc(o,e),o=xc(o,e),a=Mc(a),o=Mc(o),e.isRawShaderMaterial!==!0&&(R=`#version 300 es
`,v=[_,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+v,d=["#define varying in",e.glslVersion===Do?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Do?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const b=R+v+a,A=R+d+o,H=mc(r,r.VERTEX_SHADER,b),D=mc(r,r.FRAGMENT_SHADER,A);r.attachShader(y,H),r.attachShader(y,D),e.index0AttributeName!==void 0?r.bindAttribLocation(y,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(y,0,"position"),r.linkProgram(y);function I(U){if(i.debug.checkShaderErrors){const $=r.getProgramInfoLog(y).trim(),X=r.getShaderInfoLog(H).trim(),J=r.getShaderInfoLog(D).trim();let nt=!0,Z=!0;if(r.getProgramParameter(y,r.LINK_STATUS)===!1)if(nt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,y,H,D);else{const tt=_c(r,H,"vertex"),Y=_c(r,D,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(y,r.VALIDATE_STATUS)+`

Material Name: `+U.name+`
Material Type: `+U.type+`

Program Info Log: `+$+`
`+tt+`
`+Y)}else $!==""?console.warn("THREE.WebGLProgram: Program Info Log:",$):(X===""||J==="")&&(Z=!1);Z&&(U.diagnostics={runnable:nt,programLog:$,vertexShader:{log:X,prefix:v},fragmentShader:{log:J,prefix:d}})}r.deleteShader(H),r.deleteShader(D),N=new os(r,y),w=Dm(r,y)}let N;this.getUniforms=function(){return N===void 0&&I(this),N};let w;this.getAttributes=function(){return w===void 0&&I(this),w};let T=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=r.getProgramParameter(y,Tm)),T},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(y),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Am++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=H,this.fragmentShader=D,this}let $m=0;class Xm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new qm(t),e.set(t,n)),n}}class qm{constructor(t){this.id=$m++,this.code=t,this.usedTimes=0}}function Ym(i,t,e,n,r,s,a){const o=new rl,c=new Xm,h=new Set,u=[],f=r.logarithmicDepthBuffer,p=r.vertexTextures;let _=r.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(w){return h.add(w),w===0?"uv":`uv${w}`}function v(w,T,U,$,X){const J=$.fog,nt=X.geometry,Z=w.isMeshStandardMaterial?$.environment:null,tt=(w.isMeshStandardMaterial?e:t).get(w.envMap||Z),Y=tt&&tt.mapping===Es?tt.image.height:null,ft=x[w.type];w.precision!==null&&(_=r.getMaxPrecision(w.precision),_!==w.precision&&console.warn("THREE.WebGLProgram.getParameters:",w.precision,"not supported, using",_,"instead."));const Mt=nt.morphAttributes.position||nt.morphAttributes.normal||nt.morphAttributes.color,Rt=Mt!==void 0?Mt.length:0;let Xt=0;nt.morphAttributes.position!==void 0&&(Xt=1),nt.morphAttributes.normal!==void 0&&(Xt=2),nt.morphAttributes.color!==void 0&&(Xt=3);let ue,Q,ot,bt;if(ft){const Gt=dn[ft];ue=Gt.vertexShader,Q=Gt.fragmentShader}else ue=w.vertexShader,Q=w.fragmentShader,c.update(w),ot=c.getVertexShaderID(w),bt=c.getFragmentShaderID(w);const pt=i.getRenderTarget(),Ot=i.state.buffers.depth.getReversed(),Ft=X.isInstancedMesh===!0,Vt=X.isBatchedMesh===!0,_e=!!w.map,Zt=!!w.matcap,ie=!!tt,k=!!w.aoMap,He=!!w.lightMap,Qt=!!w.bumpMap,qt=!!w.normalMap,Ut=!!w.displacementMap,fe=!!w.emissiveMap,Ct=!!w.metalnessMap,C=!!w.roughnessMap,S=w.anisotropy>0,W=w.clearcoat>0,et=w.dispersion>0,st=w.iridescence>0,j=w.sheen>0,Pt=w.transmission>0,mt=S&&!!w.anisotropyMap,yt=W&&!!w.clearcoatMap,te=W&&!!w.clearcoatNormalMap,at=W&&!!w.clearcoatRoughnessMap,Et=st&&!!w.iridescenceMap,Nt=st&&!!w.iridescenceThicknessMap,Dt=j&&!!w.sheenColorMap,At=j&&!!w.sheenRoughnessMap,re=!!w.specularMap,zt=!!w.specularColorMap,de=!!w.specularIntensityMap,O=Pt&&!!w.transmissionMap,ht=Pt&&!!w.thicknessMap,q=!!w.gradientMap,it=!!w.alphaMap,gt=w.alphaTest>0,vt=!!w.alphaHash,Bt=!!w.extensions;let xe=kn;w.toneMapped&&(pt===null||pt.isXRRenderTarget===!0)&&(xe=i.toneMapping);const Re={shaderID:ft,shaderType:w.type,shaderName:w.name,vertexShader:ue,fragmentShader:Q,defines:w.defines,customVertexShaderID:ot,customFragmentShaderID:bt,isRawShaderMaterial:w.isRawShaderMaterial===!0,glslVersion:w.glslVersion,precision:_,batching:Vt,batchingColor:Vt&&X._colorsTexture!==null,instancing:Ft,instancingColor:Ft&&X.instanceColor!==null,instancingMorph:Ft&&X.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:pt===null?i.outputColorSpace:pt.isXRRenderTarget===!0?pt.texture.colorSpace:Ji,alphaToCoverage:!!w.alphaToCoverage,map:_e,matcap:Zt,envMap:ie,envMapMode:ie&&tt.mapping,envMapCubeUVHeight:Y,aoMap:k,lightMap:He,bumpMap:Qt,normalMap:qt,displacementMap:p&&Ut,emissiveMap:fe,normalMapObjectSpace:qt&&w.normalMapType===tu,normalMapTangentSpace:qt&&w.normalMapType===po,metalnessMap:Ct,roughnessMap:C,anisotropy:S,anisotropyMap:mt,clearcoat:W,clearcoatMap:yt,clearcoatNormalMap:te,clearcoatRoughnessMap:at,dispersion:et,iridescence:st,iridescenceMap:Et,iridescenceThicknessMap:Nt,sheen:j,sheenColorMap:Dt,sheenRoughnessMap:At,specularMap:re,specularColorMap:zt,specularIntensityMap:de,transmission:Pt,transmissionMap:O,thicknessMap:ht,gradientMap:q,opaque:w.transparent===!1&&w.blending===Fi&&w.alphaToCoverage===!1,alphaMap:it,alphaTest:gt,alphaHash:vt,combine:w.combine,mapUv:_e&&y(w.map.channel),aoMapUv:k&&y(w.aoMap.channel),lightMapUv:He&&y(w.lightMap.channel),bumpMapUv:Qt&&y(w.bumpMap.channel),normalMapUv:qt&&y(w.normalMap.channel),displacementMapUv:Ut&&y(w.displacementMap.channel),emissiveMapUv:fe&&y(w.emissiveMap.channel),metalnessMapUv:Ct&&y(w.metalnessMap.channel),roughnessMapUv:C&&y(w.roughnessMap.channel),anisotropyMapUv:mt&&y(w.anisotropyMap.channel),clearcoatMapUv:yt&&y(w.clearcoatMap.channel),clearcoatNormalMapUv:te&&y(w.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:at&&y(w.clearcoatRoughnessMap.channel),iridescenceMapUv:Et&&y(w.iridescenceMap.channel),iridescenceThicknessMapUv:Nt&&y(w.iridescenceThicknessMap.channel),sheenColorMapUv:Dt&&y(w.sheenColorMap.channel),sheenRoughnessMapUv:At&&y(w.sheenRoughnessMap.channel),specularMapUv:re&&y(w.specularMap.channel),specularColorMapUv:zt&&y(w.specularColorMap.channel),specularIntensityMapUv:de&&y(w.specularIntensityMap.channel),transmissionMapUv:O&&y(w.transmissionMap.channel),thicknessMapUv:ht&&y(w.thicknessMap.channel),alphaMapUv:it&&y(w.alphaMap.channel),vertexTangents:!!nt.attributes.tangent&&(qt||S),vertexColors:w.vertexColors,vertexAlphas:w.vertexColors===!0&&!!nt.attributes.color&&nt.attributes.color.itemSize===4,pointsUvs:X.isPoints===!0&&!!nt.attributes.uv&&(_e||it),fog:!!J,useFog:w.fog===!0,fogExp2:!!J&&J.isFogExp2,flatShading:w.flatShading===!0,sizeAttenuation:w.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:Ot,skinning:X.isSkinnedMesh===!0,morphTargets:nt.morphAttributes.position!==void 0,morphNormals:nt.morphAttributes.normal!==void 0,morphColors:nt.morphAttributes.color!==void 0,morphTargetsCount:Rt,morphTextureStride:Xt,numDirLights:T.directional.length,numPointLights:T.point.length,numSpotLights:T.spot.length,numSpotLightMaps:T.spotLightMap.length,numRectAreaLights:T.rectArea.length,numHemiLights:T.hemi.length,numDirLightShadows:T.directionalShadowMap.length,numPointLightShadows:T.pointShadowMap.length,numSpotLightShadows:T.spotShadowMap.length,numSpotLightShadowsWithMaps:T.numSpotLightShadowsWithMaps,numLightProbes:T.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:w.dithering,shadowMapEnabled:i.shadowMap.enabled&&U.length>0,shadowMapType:i.shadowMap.type,toneMapping:xe,decodeVideoTexture:_e&&w.map.isVideoTexture===!0&&he.getTransfer(w.map.colorSpace)===pe,decodeVideoTextureEmissive:fe&&w.emissiveMap.isVideoTexture===!0&&he.getTransfer(w.emissiveMap.colorSpace)===pe,premultipliedAlpha:w.premultipliedAlpha,doubleSided:w.side===en,flipSided:w.side===ze,useDepthPacking:w.depthPacking>=0,depthPacking:w.depthPacking||0,index0AttributeName:w.index0AttributeName,extensionClipCullDistance:Bt&&w.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Bt&&w.extensions.multiDraw===!0||Vt)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:w.customProgramCacheKey()};return Re.vertexUv1s=h.has(1),Re.vertexUv2s=h.has(2),Re.vertexUv3s=h.has(3),h.clear(),Re}function d(w){const T=[];if(w.shaderID?T.push(w.shaderID):(T.push(w.customVertexShaderID),T.push(w.customFragmentShaderID)),w.defines!==void 0)for(const U in w.defines)T.push(U),T.push(w.defines[U]);return w.isRawShaderMaterial===!1&&(R(T,w),b(T,w),T.push(i.outputColorSpace)),T.push(w.customProgramCacheKey),T.join()}function R(w,T){w.push(T.precision),w.push(T.outputColorSpace),w.push(T.envMapMode),w.push(T.envMapCubeUVHeight),w.push(T.mapUv),w.push(T.alphaMapUv),w.push(T.lightMapUv),w.push(T.aoMapUv),w.push(T.bumpMapUv),w.push(T.normalMapUv),w.push(T.displacementMapUv),w.push(T.emissiveMapUv),w.push(T.metalnessMapUv),w.push(T.roughnessMapUv),w.push(T.anisotropyMapUv),w.push(T.clearcoatMapUv),w.push(T.clearcoatNormalMapUv),w.push(T.clearcoatRoughnessMapUv),w.push(T.iridescenceMapUv),w.push(T.iridescenceThicknessMapUv),w.push(T.sheenColorMapUv),w.push(T.sheenRoughnessMapUv),w.push(T.specularMapUv),w.push(T.specularColorMapUv),w.push(T.specularIntensityMapUv),w.push(T.transmissionMapUv),w.push(T.thicknessMapUv),w.push(T.combine),w.push(T.fogExp2),w.push(T.sizeAttenuation),w.push(T.morphTargetsCount),w.push(T.morphAttributeCount),w.push(T.numDirLights),w.push(T.numPointLights),w.push(T.numSpotLights),w.push(T.numSpotLightMaps),w.push(T.numHemiLights),w.push(T.numRectAreaLights),w.push(T.numDirLightShadows),w.push(T.numPointLightShadows),w.push(T.numSpotLightShadows),w.push(T.numSpotLightShadowsWithMaps),w.push(T.numLightProbes),w.push(T.shadowMapType),w.push(T.toneMapping),w.push(T.numClippingPlanes),w.push(T.numClipIntersection),w.push(T.depthPacking)}function b(w,T){o.disableAll(),T.supportsVertexTextures&&o.enable(0),T.instancing&&o.enable(1),T.instancingColor&&o.enable(2),T.instancingMorph&&o.enable(3),T.matcap&&o.enable(4),T.envMap&&o.enable(5),T.normalMapObjectSpace&&o.enable(6),T.normalMapTangentSpace&&o.enable(7),T.clearcoat&&o.enable(8),T.iridescence&&o.enable(9),T.alphaTest&&o.enable(10),T.vertexColors&&o.enable(11),T.vertexAlphas&&o.enable(12),T.vertexUv1s&&o.enable(13),T.vertexUv2s&&o.enable(14),T.vertexUv3s&&o.enable(15),T.vertexTangents&&o.enable(16),T.anisotropy&&o.enable(17),T.alphaHash&&o.enable(18),T.batching&&o.enable(19),T.dispersion&&o.enable(20),T.batchingColor&&o.enable(21),w.push(o.mask),o.disableAll(),T.fog&&o.enable(0),T.useFog&&o.enable(1),T.flatShading&&o.enable(2),T.logarithmicDepthBuffer&&o.enable(3),T.reverseDepthBuffer&&o.enable(4),T.skinning&&o.enable(5),T.morphTargets&&o.enable(6),T.morphNormals&&o.enable(7),T.morphColors&&o.enable(8),T.premultipliedAlpha&&o.enable(9),T.shadowMapEnabled&&o.enable(10),T.doubleSided&&o.enable(11),T.flipSided&&o.enable(12),T.useDepthPacking&&o.enable(13),T.dithering&&o.enable(14),T.transmission&&o.enable(15),T.sheen&&o.enable(16),T.opaque&&o.enable(17),T.pointsUvs&&o.enable(18),T.decodeVideoTexture&&o.enable(19),T.decodeVideoTextureEmissive&&o.enable(20),T.alphaToCoverage&&o.enable(21),w.push(o.mask)}function A(w){const T=x[w.type];let U;if(T){const $=dn[T];U=Pu.clone($.uniforms)}else U=w.uniforms;return U}function H(w,T){let U;for(let $=0,X=u.length;$<X;$++){const J=u[$];if(J.cacheKey===T){U=J,++U.usedTimes;break}}return U===void 0&&(U=new Wm(i,T,w,s),u.push(U)),U}function D(w){if(--w.usedTimes===0){const T=u.indexOf(w);u[T]=u[u.length-1],u.pop(),w.destroy()}}function I(w){c.remove(w)}function N(){c.dispose()}return{getParameters:v,getProgramCacheKey:d,getUniforms:A,acquireProgram:H,releaseProgram:D,releaseShaderCache:I,programs:u,dispose:N}}function jm(){let i=new WeakMap;function t(a){return i.has(a)}function e(a){let o=i.get(a);return o===void 0&&(o={},i.set(a,o)),o}function n(a){i.delete(a)}function r(a,o,c){i.get(a)[o]=c}function s(){i=new WeakMap}return{has:t,get:e,remove:n,update:r,dispose:s}}function Km(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Sc(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Ec(){const i=[];let t=0;const e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function a(f,p,_,x,y,v){let d=i[t];return d===void 0?(d={id:f.id,object:f,geometry:p,material:_,groupOrder:x,renderOrder:f.renderOrder,z:y,group:v},i[t]=d):(d.id=f.id,d.object=f,d.geometry=p,d.material=_,d.groupOrder=x,d.renderOrder=f.renderOrder,d.z=y,d.group=v),t++,d}function o(f,p,_,x,y,v){const d=a(f,p,_,x,y,v);_.transmission>0?n.push(d):_.transparent===!0?r.push(d):e.push(d)}function c(f,p,_,x,y,v){const d=a(f,p,_,x,y,v);_.transmission>0?n.unshift(d):_.transparent===!0?r.unshift(d):e.unshift(d)}function h(f,p){e.length>1&&e.sort(f||Km),n.length>1&&n.sort(p||Sc),r.length>1&&r.sort(p||Sc)}function u(){for(let f=t,p=i.length;f<p;f++){const _=i[f];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:o,unshift:c,finish:u,sort:h}}function Zm(){let i=new WeakMap;function t(n,r){const s=i.get(n);let a;return s===void 0?(a=new Ec,i.set(n,[a])):r>=s.length?(a=new Ec,s.push(a)):a=s[r],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function Jm(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new V,color:new ne};break;case"SpotLight":e={position:new V,direction:new V,color:new ne,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new V,color:new ne,distance:0,decay:0};break;case"HemisphereLight":e={direction:new V,skyColor:new ne,groundColor:new ne};break;case"RectAreaLight":e={color:new ne,position:new V,halfWidth:new V,halfHeight:new V};break}return i[t.id]=e,e}}}function Qm(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let tg=0;function eg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function ng(i){const t=new Jm,e=Qm(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)n.probe.push(new V);const r=new V,s=new ge,a=new ge;function o(h){let u=0,f=0,p=0;for(let w=0;w<9;w++)n.probe[w].set(0,0,0);let _=0,x=0,y=0,v=0,d=0,R=0,b=0,A=0,H=0,D=0,I=0;h.sort(eg);for(let w=0,T=h.length;w<T;w++){const U=h[w],$=U.color,X=U.intensity,J=U.distance,nt=U.shadow&&U.shadow.map?U.shadow.map.texture:null;if(U.isAmbientLight)u+=$.r*X,f+=$.g*X,p+=$.b*X;else if(U.isLightProbe){for(let Z=0;Z<9;Z++)n.probe[Z].addScaledVector(U.sh.coefficients[Z],X);I++}else if(U.isDirectionalLight){const Z=t.get(U);if(Z.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){const tt=U.shadow,Y=e.get(U);Y.shadowIntensity=tt.intensity,Y.shadowBias=tt.bias,Y.shadowNormalBias=tt.normalBias,Y.shadowRadius=tt.radius,Y.shadowMapSize=tt.mapSize,n.directionalShadow[_]=Y,n.directionalShadowMap[_]=nt,n.directionalShadowMatrix[_]=U.shadow.matrix,R++}n.directional[_]=Z,_++}else if(U.isSpotLight){const Z=t.get(U);Z.position.setFromMatrixPosition(U.matrixWorld),Z.color.copy($).multiplyScalar(X),Z.distance=J,Z.coneCos=Math.cos(U.angle),Z.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),Z.decay=U.decay,n.spot[y]=Z;const tt=U.shadow;if(U.map&&(n.spotLightMap[H]=U.map,H++,tt.updateMatrices(U),U.castShadow&&D++),n.spotLightMatrix[y]=tt.matrix,U.castShadow){const Y=e.get(U);Y.shadowIntensity=tt.intensity,Y.shadowBias=tt.bias,Y.shadowNormalBias=tt.normalBias,Y.shadowRadius=tt.radius,Y.shadowMapSize=tt.mapSize,n.spotShadow[y]=Y,n.spotShadowMap[y]=nt,A++}y++}else if(U.isRectAreaLight){const Z=t.get(U);Z.color.copy($).multiplyScalar(X),Z.halfWidth.set(U.width*.5,0,0),Z.halfHeight.set(0,U.height*.5,0),n.rectArea[v]=Z,v++}else if(U.isPointLight){const Z=t.get(U);if(Z.color.copy(U.color).multiplyScalar(U.intensity),Z.distance=U.distance,Z.decay=U.decay,U.castShadow){const tt=U.shadow,Y=e.get(U);Y.shadowIntensity=tt.intensity,Y.shadowBias=tt.bias,Y.shadowNormalBias=tt.normalBias,Y.shadowRadius=tt.radius,Y.shadowMapSize=tt.mapSize,Y.shadowCameraNear=tt.camera.near,Y.shadowCameraFar=tt.camera.far,n.pointShadow[x]=Y,n.pointShadowMap[x]=nt,n.pointShadowMatrix[x]=U.shadow.matrix,b++}n.point[x]=Z,x++}else if(U.isHemisphereLight){const Z=t.get(U);Z.skyColor.copy(U.color).multiplyScalar(X),Z.groundColor.copy(U.groundColor).multiplyScalar(X),n.hemi[d]=Z,d++}}v>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=dt.LTC_FLOAT_1,n.rectAreaLTC2=dt.LTC_FLOAT_2):(n.rectAreaLTC1=dt.LTC_HALF_1,n.rectAreaLTC2=dt.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=f,n.ambient[2]=p;const N=n.hash;(N.directionalLength!==_||N.pointLength!==x||N.spotLength!==y||N.rectAreaLength!==v||N.hemiLength!==d||N.numDirectionalShadows!==R||N.numPointShadows!==b||N.numSpotShadows!==A||N.numSpotMaps!==H||N.numLightProbes!==I)&&(n.directional.length=_,n.spot.length=y,n.rectArea.length=v,n.point.length=x,n.hemi.length=d,n.directionalShadow.length=R,n.directionalShadowMap.length=R,n.pointShadow.length=b,n.pointShadowMap.length=b,n.spotShadow.length=A,n.spotShadowMap.length=A,n.directionalShadowMatrix.length=R,n.pointShadowMatrix.length=b,n.spotLightMatrix.length=A+H-D,n.spotLightMap.length=H,n.numSpotLightShadowsWithMaps=D,n.numLightProbes=I,N.directionalLength=_,N.pointLength=x,N.spotLength=y,N.rectAreaLength=v,N.hemiLength=d,N.numDirectionalShadows=R,N.numPointShadows=b,N.numSpotShadows=A,N.numSpotMaps=H,N.numLightProbes=I,n.version=tg++)}function c(h,u){let f=0,p=0,_=0,x=0,y=0;const v=u.matrixWorldInverse;for(let d=0,R=h.length;d<R;d++){const b=h[d];if(b.isDirectionalLight){const A=n.directional[f];A.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),A.direction.sub(r),A.direction.transformDirection(v),f++}else if(b.isSpotLight){const A=n.spot[_];A.position.setFromMatrixPosition(b.matrixWorld),A.position.applyMatrix4(v),A.direction.setFromMatrixPosition(b.matrixWorld),r.setFromMatrixPosition(b.target.matrixWorld),A.direction.sub(r),A.direction.transformDirection(v),_++}else if(b.isRectAreaLight){const A=n.rectArea[x];A.position.setFromMatrixPosition(b.matrixWorld),A.position.applyMatrix4(v),a.identity(),s.copy(b.matrixWorld),s.premultiply(v),a.extractRotation(s),A.halfWidth.set(b.width*.5,0,0),A.halfHeight.set(0,b.height*.5,0),A.halfWidth.applyMatrix4(a),A.halfHeight.applyMatrix4(a),x++}else if(b.isPointLight){const A=n.point[p];A.position.setFromMatrixPosition(b.matrixWorld),A.position.applyMatrix4(v),p++}else if(b.isHemisphereLight){const A=n.hemi[y];A.direction.setFromMatrixPosition(b.matrixWorld),A.direction.transformDirection(v),y++}}}return{setup:o,setupView:c,state:n}}function Tc(i){const t=new ng(i),e=[],n=[];function r(u){h.camera=u,e.length=0,n.length=0}function s(u){e.push(u)}function a(u){n.push(u)}function o(){t.setup(e)}function c(u){t.setupView(e,u)}const h={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:r,state:h,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:a}}function ig(i){let t=new WeakMap;function e(r,s=0){const a=t.get(r);let o;return a===void 0?(o=new Tc(i),t.set(r,[o])):s>=a.length?(o=new Tc(i),a.push(o)):o=a[s],o}function n(){t=new WeakMap}return{get:e,dispose:n}}class rg extends li{static get type(){return"MeshDepthMaterial"}constructor(t){super(),this.isMeshDepthMaterial=!0,this.depthPacking=Jh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class sg extends li{static get type(){return"MeshDistanceMaterial"}constructor(t){super(),this.isMeshDistanceMaterial=!0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const ag=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,og=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function cg(i,t,e){let n=new mo;const r=new Ht,s=new Ht,a=new Se,o=new rg({depthPacking:Qh}),c=new sg,h={},u=e.maxTextureSize,f={[Gn]:ze,[ze]:Gn,[en]:en},p=new Vn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ht},radius:{value:4}},vertexShader:ag,fragmentShader:og}),_=p.clone();_.defines.HORIZONTAL_PASS=1;const x=new ke;x.setAttribute("position",new rn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new oe(x,p),v=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Vc;let d=this.type;this.render=function(D,I,N){if(v.enabled===!1||v.autoUpdate===!1&&v.needsUpdate===!1||D.length===0)return;const w=i.getRenderTarget(),T=i.getActiveCubeFace(),U=i.getActiveMipmapLevel(),$=i.state;$.setBlending(zn),$.buffers.color.setClear(1,1,1,1),$.buffers.depth.setTest(!0),$.setScissorTest(!1);const X=d!==En&&this.type===En,J=d===En&&this.type!==En;for(let nt=0,Z=D.length;nt<Z;nt++){const tt=D[nt],Y=tt.shadow;if(Y===void 0){console.warn("THREE.WebGLShadowMap:",tt,"has no shadow.");continue}if(Y.autoUpdate===!1&&Y.needsUpdate===!1)continue;r.copy(Y.mapSize);const ft=Y.getFrameExtents();if(r.multiply(ft),s.copy(Y.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/ft.x),r.x=s.x*ft.x,Y.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/ft.y),r.y=s.y*ft.y,Y.mapSize.y=s.y)),Y.map===null||X===!0||J===!0){const Rt=this.type!==En?{minFilter:je,magFilter:je}:{};Y.map!==null&&Y.map.dispose(),Y.map=new oi(r.x,r.y,Rt),Y.map.texture.name=tt.name+".shadowMap",Y.camera.updateProjectionMatrix()}i.setRenderTarget(Y.map),i.clear();const Mt=Y.getViewportCount();for(let Rt=0;Rt<Mt;Rt++){const Xt=Y.getViewport(Rt);a.set(s.x*Xt.x,s.y*Xt.y,s.x*Xt.z,s.y*Xt.w),$.viewport(a),Y.updateMatrices(tt,Rt),n=Y.getFrustum(),A(I,N,Y.camera,tt,this.type)}Y.isPointLightShadow!==!0&&this.type===En&&R(Y,N),Y.needsUpdate=!1}d=this.type,v.needsUpdate=!1,i.setRenderTarget(w,T,U)};function R(D,I){const N=t.update(y);p.defines.VSM_SAMPLES!==D.blurSamples&&(p.defines.VSM_SAMPLES=D.blurSamples,_.defines.VSM_SAMPLES=D.blurSamples,p.needsUpdate=!0,_.needsUpdate=!0),D.mapPass===null&&(D.mapPass=new oi(r.x,r.y)),p.uniforms.shadow_pass.value=D.map.texture,p.uniforms.resolution.value=D.mapSize,p.uniforms.radius.value=D.radius,i.setRenderTarget(D.mapPass),i.clear(),i.renderBufferDirect(I,null,N,p,y,null),_.uniforms.shadow_pass.value=D.mapPass.texture,_.uniforms.resolution.value=D.mapSize,_.uniforms.radius.value=D.radius,i.setRenderTarget(D.map),i.clear(),i.renderBufferDirect(I,null,N,_,y,null)}function b(D,I,N,w){let T=null;const U=N.isPointLight===!0?D.customDistanceMaterial:D.customDepthMaterial;if(U!==void 0)T=U;else if(T=N.isPointLight===!0?c:o,i.localClippingEnabled&&I.clipShadows===!0&&Array.isArray(I.clippingPlanes)&&I.clippingPlanes.length!==0||I.displacementMap&&I.displacementScale!==0||I.alphaMap&&I.alphaTest>0||I.map&&I.alphaTest>0){const $=T.uuid,X=I.uuid;let J=h[$];J===void 0&&(J={},h[$]=J);let nt=J[X];nt===void 0&&(nt=T.clone(),J[X]=nt,I.addEventListener("dispose",H)),T=nt}if(T.visible=I.visible,T.wireframe=I.wireframe,w===En?T.side=I.shadowSide!==null?I.shadowSide:I.side:T.side=I.shadowSide!==null?I.shadowSide:f[I.side],T.alphaMap=I.alphaMap,T.alphaTest=I.alphaTest,T.map=I.map,T.clipShadows=I.clipShadows,T.clippingPlanes=I.clippingPlanes,T.clipIntersection=I.clipIntersection,T.displacementMap=I.displacementMap,T.displacementScale=I.displacementScale,T.displacementBias=I.displacementBias,T.wireframeLinewidth=I.wireframeLinewidth,T.linewidth=I.linewidth,N.isPointLight===!0&&T.isMeshDistanceMaterial===!0){const $=i.properties.get(T);$.light=N}return T}function A(D,I,N,w,T){if(D.visible===!1)return;if(D.layers.test(I.layers)&&(D.isMesh||D.isLine||D.isPoints)&&(D.castShadow||D.receiveShadow&&T===En)&&(!D.frustumCulled||n.intersectsObject(D))){D.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,D.matrixWorld);const X=t.update(D),J=D.material;if(Array.isArray(J)){const nt=X.groups;for(let Z=0,tt=nt.length;Z<tt;Z++){const Y=nt[Z],ft=J[Y.materialIndex];if(ft&&ft.visible){const Mt=b(D,ft,w,T);D.onBeforeShadow(i,D,I,N,X,Mt,Y),i.renderBufferDirect(N,null,X,Mt,D,Y),D.onAfterShadow(i,D,I,N,X,Mt,Y)}}}else if(J.visible){const nt=b(D,J,w,T);D.onBeforeShadow(i,D,I,N,X,nt,null),i.renderBufferDirect(N,null,X,nt,D,null),D.onAfterShadow(i,D,I,N,X,nt,null)}}const $=D.children;for(let X=0,J=$.length;X<J;X++)A($[X],I,N,w,T)}function H(D){D.target.removeEventListener("dispose",H);for(const N in h){const w=h[N],T=D.target.uuid;T in w&&(w[T].dispose(),delete w[T])}}}const lg={[ma]:ga,[_a]:Ma,[va]:ya,[Wi]:xa,[ga]:ma,[Ma]:_a,[ya]:va,[xa]:Wi};function hg(i,t){function e(){let O=!1;const ht=new Se;let q=null;const it=new Se(0,0,0,0);return{setMask:function(gt){q!==gt&&!O&&(i.colorMask(gt,gt,gt,gt),q=gt)},setLocked:function(gt){O=gt},setClear:function(gt,vt,Bt,xe,Re){Re===!0&&(gt*=xe,vt*=xe,Bt*=xe),ht.set(gt,vt,Bt,xe),it.equals(ht)===!1&&(i.clearColor(gt,vt,Bt,xe),it.copy(ht))},reset:function(){O=!1,q=null,it.set(-1,0,0,0)}}}function n(){let O=!1,ht=!1,q=null,it=null,gt=null;return{setReversed:function(vt){if(ht!==vt){const Bt=t.get("EXT_clip_control");ht?Bt.clipControlEXT(Bt.LOWER_LEFT_EXT,Bt.ZERO_TO_ONE_EXT):Bt.clipControlEXT(Bt.LOWER_LEFT_EXT,Bt.NEGATIVE_ONE_TO_ONE_EXT);const xe=gt;gt=null,this.setClear(xe)}ht=vt},getReversed:function(){return ht},setTest:function(vt){vt?pt(i.DEPTH_TEST):Ot(i.DEPTH_TEST)},setMask:function(vt){q!==vt&&!O&&(i.depthMask(vt),q=vt)},setFunc:function(vt){if(ht&&(vt=lg[vt]),it!==vt){switch(vt){case ma:i.depthFunc(i.NEVER);break;case ga:i.depthFunc(i.ALWAYS);break;case _a:i.depthFunc(i.LESS);break;case Wi:i.depthFunc(i.LEQUAL);break;case va:i.depthFunc(i.EQUAL);break;case xa:i.depthFunc(i.GEQUAL);break;case Ma:i.depthFunc(i.GREATER);break;case ya:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}it=vt}},setLocked:function(vt){O=vt},setClear:function(vt){gt!==vt&&(ht&&(vt=1-vt),i.clearDepth(vt),gt=vt)},reset:function(){O=!1,q=null,it=null,gt=null,ht=!1}}}function r(){let O=!1,ht=null,q=null,it=null,gt=null,vt=null,Bt=null,xe=null,Re=null;return{setTest:function(Gt){O||(Gt?pt(i.STENCIL_TEST):Ot(i.STENCIL_TEST))},setMask:function(Gt){ht!==Gt&&!O&&(i.stencilMask(Gt),ht=Gt)},setFunc:function(Gt,Ve,Pe){(q!==Gt||it!==Ve||gt!==Pe)&&(i.stencilFunc(Gt,Ve,Pe),q=Gt,it=Ve,gt=Pe)},setOp:function(Gt,Ve,Pe){(vt!==Gt||Bt!==Ve||xe!==Pe)&&(i.stencilOp(Gt,Ve,Pe),vt=Gt,Bt=Ve,xe=Pe)},setLocked:function(Gt){O=Gt},setClear:function(Gt){Re!==Gt&&(i.clearStencil(Gt),Re=Gt)},reset:function(){O=!1,ht=null,q=null,it=null,gt=null,vt=null,Bt=null,xe=null,Re=null}}}const s=new e,a=new n,o=new r,c=new WeakMap,h=new WeakMap;let u={},f={},p=new WeakMap,_=[],x=null,y=!1,v=null,d=null,R=null,b=null,A=null,H=null,D=null,I=new ne(0,0,0),N=0,w=!1,T=null,U=null,$=null,X=null,J=null;const nt=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Z=!1,tt=0;const Y=i.getParameter(i.VERSION);Y.indexOf("WebGL")!==-1?(tt=parseFloat(/^WebGL (\d)/.exec(Y)[1]),Z=tt>=1):Y.indexOf("OpenGL ES")!==-1&&(tt=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),Z=tt>=2);let ft=null,Mt={};const Rt=i.getParameter(i.SCISSOR_BOX),Xt=i.getParameter(i.VIEWPORT),ue=new Se().fromArray(Rt),Q=new Se().fromArray(Xt);function ot(O,ht,q,it){const gt=new Uint8Array(4),vt=i.createTexture();i.bindTexture(O,vt),i.texParameteri(O,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(O,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Bt=0;Bt<q;Bt++)O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY?i.texImage3D(ht,0,i.RGBA,1,1,it,0,i.RGBA,i.UNSIGNED_BYTE,gt):i.texImage2D(ht+Bt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,gt);return vt}const bt={};bt[i.TEXTURE_2D]=ot(i.TEXTURE_2D,i.TEXTURE_2D,1),bt[i.TEXTURE_CUBE_MAP]=ot(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),bt[i.TEXTURE_2D_ARRAY]=ot(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),bt[i.TEXTURE_3D]=ot(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),pt(i.DEPTH_TEST),a.setFunc(Wi),Qt(!1),qt(Ro),pt(i.CULL_FACE),k(zn);function pt(O){u[O]!==!0&&(i.enable(O),u[O]=!0)}function Ot(O){u[O]!==!1&&(i.disable(O),u[O]=!1)}function Ft(O,ht){return f[O]!==ht?(i.bindFramebuffer(O,ht),f[O]=ht,O===i.DRAW_FRAMEBUFFER&&(f[i.FRAMEBUFFER]=ht),O===i.FRAMEBUFFER&&(f[i.DRAW_FRAMEBUFFER]=ht),!0):!1}function Vt(O,ht){let q=_,it=!1;if(O){q=p.get(ht),q===void 0&&(q=[],p.set(ht,q));const gt=O.textures;if(q.length!==gt.length||q[0]!==i.COLOR_ATTACHMENT0){for(let vt=0,Bt=gt.length;vt<Bt;vt++)q[vt]=i.COLOR_ATTACHMENT0+vt;q.length=gt.length,it=!0}}else q[0]!==i.BACK&&(q[0]=i.BACK,it=!0);it&&i.drawBuffers(q)}function _e(O){return x!==O?(i.useProgram(O),x=O,!0):!1}const Zt={[Qn]:i.FUNC_ADD,[Ah]:i.FUNC_SUBTRACT,[wh]:i.FUNC_REVERSE_SUBTRACT};Zt[bh]=i.MIN,Zt[Rh]=i.MAX;const ie={[Ch]:i.ZERO,[Ph]:i.ONE,[Ih]:i.SRC_COLOR,[da]:i.SRC_ALPHA,[Fh]:i.SRC_ALPHA_SATURATE,[Nh]:i.DST_COLOR,[Dh]:i.DST_ALPHA,[Lh]:i.ONE_MINUS_SRC_COLOR,[pa]:i.ONE_MINUS_SRC_ALPHA,[Oh]:i.ONE_MINUS_DST_COLOR,[Uh]:i.ONE_MINUS_DST_ALPHA,[Bh]:i.CONSTANT_COLOR,[zh]:i.ONE_MINUS_CONSTANT_COLOR,[kh]:i.CONSTANT_ALPHA,[Hh]:i.ONE_MINUS_CONSTANT_ALPHA};function k(O,ht,q,it,gt,vt,Bt,xe,Re,Gt){if(O===zn){y===!0&&(Ot(i.BLEND),y=!1);return}if(y===!1&&(pt(i.BLEND),y=!0),O!==Th){if(O!==v||Gt!==w){if((d!==Qn||A!==Qn)&&(i.blendEquation(i.FUNC_ADD),d=Qn,A=Qn),Gt)switch(O){case Fi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Co:i.blendFunc(i.ONE,i.ONE);break;case Po:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Io:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case Fi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Co:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Po:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Io:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}R=null,b=null,H=null,D=null,I.set(0,0,0),N=0,v=O,w=Gt}return}gt=gt||ht,vt=vt||q,Bt=Bt||it,(ht!==d||gt!==A)&&(i.blendEquationSeparate(Zt[ht],Zt[gt]),d=ht,A=gt),(q!==R||it!==b||vt!==H||Bt!==D)&&(i.blendFuncSeparate(ie[q],ie[it],ie[vt],ie[Bt]),R=q,b=it,H=vt,D=Bt),(xe.equals(I)===!1||Re!==N)&&(i.blendColor(xe.r,xe.g,xe.b,Re),I.copy(xe),N=Re),v=O,w=!1}function He(O,ht){O.side===en?Ot(i.CULL_FACE):pt(i.CULL_FACE);let q=O.side===ze;ht&&(q=!q),Qt(q),O.blending===Fi&&O.transparent===!1?k(zn):k(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),a.setFunc(O.depthFunc),a.setTest(O.depthTest),a.setMask(O.depthWrite),s.setMask(O.colorWrite);const it=O.stencilWrite;o.setTest(it),it&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),fe(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?pt(i.SAMPLE_ALPHA_TO_COVERAGE):Ot(i.SAMPLE_ALPHA_TO_COVERAGE)}function Qt(O){T!==O&&(O?i.frontFace(i.CW):i.frontFace(i.CCW),T=O)}function qt(O){O!==yh?(pt(i.CULL_FACE),O!==U&&(O===Ro?i.cullFace(i.BACK):O===Sh?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ot(i.CULL_FACE),U=O}function Ut(O){O!==$&&(Z&&i.lineWidth(O),$=O)}function fe(O,ht,q){O?(pt(i.POLYGON_OFFSET_FILL),(X!==ht||J!==q)&&(i.polygonOffset(ht,q),X=ht,J=q)):Ot(i.POLYGON_OFFSET_FILL)}function Ct(O){O?pt(i.SCISSOR_TEST):Ot(i.SCISSOR_TEST)}function C(O){O===void 0&&(O=i.TEXTURE0+nt-1),ft!==O&&(i.activeTexture(O),ft=O)}function S(O,ht,q){q===void 0&&(ft===null?q=i.TEXTURE0+nt-1:q=ft);let it=Mt[q];it===void 0&&(it={type:void 0,texture:void 0},Mt[q]=it),(it.type!==O||it.texture!==ht)&&(ft!==q&&(i.activeTexture(q),ft=q),i.bindTexture(O,ht||bt[O]),it.type=O,it.texture=ht)}function W(){const O=Mt[ft];O!==void 0&&O.type!==void 0&&(i.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function et(){try{i.compressedTexImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function st(){try{i.compressedTexImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function j(){try{i.texSubImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Pt(){try{i.texSubImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function mt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function yt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function te(){try{i.texStorage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function at(){try{i.texStorage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Et(){try{i.texImage2D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Nt(){try{i.texImage3D.apply(i,arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Dt(O){ue.equals(O)===!1&&(i.scissor(O.x,O.y,O.z,O.w),ue.copy(O))}function At(O){Q.equals(O)===!1&&(i.viewport(O.x,O.y,O.z,O.w),Q.copy(O))}function re(O,ht){let q=h.get(ht);q===void 0&&(q=new WeakMap,h.set(ht,q));let it=q.get(O);it===void 0&&(it=i.getUniformBlockIndex(ht,O.name),q.set(O,it))}function zt(O,ht){const it=h.get(ht).get(O);c.get(ht)!==it&&(i.uniformBlockBinding(ht,it,O.__bindingPointIndex),c.set(ht,it))}function de(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),a.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),u={},ft=null,Mt={},f={},p=new WeakMap,_=[],x=null,y=!1,v=null,d=null,R=null,b=null,A=null,H=null,D=null,I=new ne(0,0,0),N=0,w=!1,T=null,U=null,$=null,X=null,J=null,ue.set(0,0,i.canvas.width,i.canvas.height),Q.set(0,0,i.canvas.width,i.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:pt,disable:Ot,bindFramebuffer:Ft,drawBuffers:Vt,useProgram:_e,setBlending:k,setMaterial:He,setFlipSided:Qt,setCullFace:qt,setLineWidth:Ut,setPolygonOffset:fe,setScissorTest:Ct,activeTexture:C,bindTexture:S,unbindTexture:W,compressedTexImage2D:et,compressedTexImage3D:st,texImage2D:Et,texImage3D:Nt,updateUBOMapping:re,uniformBlockBinding:zt,texStorage2D:te,texStorage3D:at,texSubImage2D:j,texSubImage3D:Pt,compressedTexSubImage2D:mt,compressedTexSubImage3D:yt,scissor:Dt,viewport:At,reset:de}}function Ac(i,t,e,n){const r=ug(n);switch(e){case Yc:return i*t;case Kc:return i*t;case Zc:return i*t*2;case lo:return i*t/r.components*r.byteLength;case ho:return i*t/r.components*r.byteLength;case Jc:return i*t*2/r.components*r.byteLength;case uo:return i*t*2/r.components*r.byteLength;case jc:return i*t*3/r.components*r.byteLength;case cn:return i*t*4/r.components*r.byteLength;case fo:return i*t*4/r.components*r.byteLength;case ns:case is:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case rs:case ss:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case wa:case Ra:return Math.max(i,16)*Math.max(t,8)/4;case Aa:case ba:return Math.max(i,8)*Math.max(t,8)/2;case Ca:case Pa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ia:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case La:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Da:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case Ua:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case Na:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case Oa:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case Fa:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case Ba:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case za:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case ka:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case Ha:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case Ga:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case Va:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case Wa:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case $a:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case as:case Xa:case qa:return Math.ceil(i/4)*Math.ceil(t/4)*16;case Qc:case Ya:return Math.ceil(i/4)*Math.ceil(t/4)*8;case ja:case Ka:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function ug(i){switch(i){case wn:case $c:return{byteLength:1,components:1};case xr:case Xc:case Er:return{byteLength:2,components:1};case oo:case co:return{byteLength:2,components:4};case ai:case ao:case gn:return{byteLength:4,components:1};case qc:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function fg(i,t,e,n,r,s,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Ht,u=new WeakMap;let f;const p=new WeakMap;let _=!1;try{_=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(C,S){return _?new OffscreenCanvas(C,S):fs("canvas")}function y(C,S,W){let et=1;const st=Ct(C);if((st.width>W||st.height>W)&&(et=W/Math.max(st.width,st.height)),et<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const j=Math.floor(et*st.width),Pt=Math.floor(et*st.height);f===void 0&&(f=x(j,Pt));const mt=S?x(j,Pt):f;return mt.width=j,mt.height=Pt,mt.getContext("2d").drawImage(C,0,0,j,Pt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+st.width+"x"+st.height+") to ("+j+"x"+Pt+")."),mt}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+st.width+"x"+st.height+")."),C;return C}function v(C){return C.generateMipmaps}function d(C){i.generateMipmap(C)}function R(C){return C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?i.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function b(C,S,W,et,st=!1){if(C!==null){if(i[C]!==void 0)return i[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let j=S;if(S===i.RED&&(W===i.FLOAT&&(j=i.R32F),W===i.HALF_FLOAT&&(j=i.R16F),W===i.UNSIGNED_BYTE&&(j=i.R8)),S===i.RED_INTEGER&&(W===i.UNSIGNED_BYTE&&(j=i.R8UI),W===i.UNSIGNED_SHORT&&(j=i.R16UI),W===i.UNSIGNED_INT&&(j=i.R32UI),W===i.BYTE&&(j=i.R8I),W===i.SHORT&&(j=i.R16I),W===i.INT&&(j=i.R32I)),S===i.RG&&(W===i.FLOAT&&(j=i.RG32F),W===i.HALF_FLOAT&&(j=i.RG16F),W===i.UNSIGNED_BYTE&&(j=i.RG8)),S===i.RG_INTEGER&&(W===i.UNSIGNED_BYTE&&(j=i.RG8UI),W===i.UNSIGNED_SHORT&&(j=i.RG16UI),W===i.UNSIGNED_INT&&(j=i.RG32UI),W===i.BYTE&&(j=i.RG8I),W===i.SHORT&&(j=i.RG16I),W===i.INT&&(j=i.RG32I)),S===i.RGB_INTEGER&&(W===i.UNSIGNED_BYTE&&(j=i.RGB8UI),W===i.UNSIGNED_SHORT&&(j=i.RGB16UI),W===i.UNSIGNED_INT&&(j=i.RGB32UI),W===i.BYTE&&(j=i.RGB8I),W===i.SHORT&&(j=i.RGB16I),W===i.INT&&(j=i.RGB32I)),S===i.RGBA_INTEGER&&(W===i.UNSIGNED_BYTE&&(j=i.RGBA8UI),W===i.UNSIGNED_SHORT&&(j=i.RGBA16UI),W===i.UNSIGNED_INT&&(j=i.RGBA32UI),W===i.BYTE&&(j=i.RGBA8I),W===i.SHORT&&(j=i.RGBA16I),W===i.INT&&(j=i.RGBA32I)),S===i.RGB&&W===i.UNSIGNED_INT_5_9_9_9_REV&&(j=i.RGB9_E5),S===i.RGBA){const Pt=st?Ts:he.getTransfer(et);W===i.FLOAT&&(j=i.RGBA32F),W===i.HALF_FLOAT&&(j=i.RGBA16F),W===i.UNSIGNED_BYTE&&(j=Pt===pe?i.SRGB8_ALPHA8:i.RGBA8),W===i.UNSIGNED_SHORT_4_4_4_4&&(j=i.RGBA4),W===i.UNSIGNED_SHORT_5_5_5_1&&(j=i.RGB5_A1)}return(j===i.R16F||j===i.R32F||j===i.RG16F||j===i.RG32F||j===i.RGBA16F||j===i.RGBA32F)&&t.get("EXT_color_buffer_float"),j}function A(C,S){let W;return C?S===null||S===ai||S===qi?W=i.DEPTH24_STENCIL8:S===gn?W=i.DEPTH32F_STENCIL8:S===xr&&(W=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):S===null||S===ai||S===qi?W=i.DEPTH_COMPONENT24:S===gn?W=i.DEPTH_COMPONENT32F:S===xr&&(W=i.DEPTH_COMPONENT16),W}function H(C,S){return v(C)===!0||C.isFramebufferTexture&&C.minFilter!==je&&C.minFilter!==mn?Math.log2(Math.max(S.width,S.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?S.mipmaps.length:1}function D(C){const S=C.target;S.removeEventListener("dispose",D),N(S),S.isVideoTexture&&u.delete(S)}function I(C){const S=C.target;S.removeEventListener("dispose",I),T(S)}function N(C){const S=n.get(C);if(S.__webglInit===void 0)return;const W=C.source,et=p.get(W);if(et){const st=et[S.__cacheKey];st.usedTimes--,st.usedTimes===0&&w(C),Object.keys(et).length===0&&p.delete(W)}n.remove(C)}function w(C){const S=n.get(C);i.deleteTexture(S.__webglTexture);const W=C.source,et=p.get(W);delete et[S.__cacheKey],a.memory.textures--}function T(C){const S=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let et=0;et<6;et++){if(Array.isArray(S.__webglFramebuffer[et]))for(let st=0;st<S.__webglFramebuffer[et].length;st++)i.deleteFramebuffer(S.__webglFramebuffer[et][st]);else i.deleteFramebuffer(S.__webglFramebuffer[et]);S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer[et])}else{if(Array.isArray(S.__webglFramebuffer))for(let et=0;et<S.__webglFramebuffer.length;et++)i.deleteFramebuffer(S.__webglFramebuffer[et]);else i.deleteFramebuffer(S.__webglFramebuffer);if(S.__webglDepthbuffer&&i.deleteRenderbuffer(S.__webglDepthbuffer),S.__webglMultisampledFramebuffer&&i.deleteFramebuffer(S.__webglMultisampledFramebuffer),S.__webglColorRenderbuffer)for(let et=0;et<S.__webglColorRenderbuffer.length;et++)S.__webglColorRenderbuffer[et]&&i.deleteRenderbuffer(S.__webglColorRenderbuffer[et]);S.__webglDepthRenderbuffer&&i.deleteRenderbuffer(S.__webglDepthRenderbuffer)}const W=C.textures;for(let et=0,st=W.length;et<st;et++){const j=n.get(W[et]);j.__webglTexture&&(i.deleteTexture(j.__webglTexture),a.memory.textures--),n.remove(W[et])}n.remove(C)}let U=0;function $(){U=0}function X(){const C=U;return C>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+r.maxTextures),U+=1,C}function J(C){const S=[];return S.push(C.wrapS),S.push(C.wrapT),S.push(C.wrapR||0),S.push(C.magFilter),S.push(C.minFilter),S.push(C.anisotropy),S.push(C.internalFormat),S.push(C.format),S.push(C.type),S.push(C.generateMipmaps),S.push(C.premultiplyAlpha),S.push(C.flipY),S.push(C.unpackAlignment),S.push(C.colorSpace),S.join()}function nt(C,S){const W=n.get(C);if(C.isVideoTexture&&Ut(C),C.isRenderTargetTexture===!1&&C.version>0&&W.__version!==C.version){const et=C.image;if(et===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(et.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Q(W,C,S);return}}e.bindTexture(i.TEXTURE_2D,W.__webglTexture,i.TEXTURE0+S)}function Z(C,S){const W=n.get(C);if(C.version>0&&W.__version!==C.version){Q(W,C,S);return}e.bindTexture(i.TEXTURE_2D_ARRAY,W.__webglTexture,i.TEXTURE0+S)}function tt(C,S){const W=n.get(C);if(C.version>0&&W.__version!==C.version){Q(W,C,S);return}e.bindTexture(i.TEXTURE_3D,W.__webglTexture,i.TEXTURE0+S)}function Y(C,S){const W=n.get(C);if(C.version>0&&W.__version!==C.version){ot(W,C,S);return}e.bindTexture(i.TEXTURE_CUBE_MAP,W.__webglTexture,i.TEXTURE0+S)}const ft={[hs]:i.REPEAT,[ei]:i.CLAMP_TO_EDGE,[Ta]:i.MIRRORED_REPEAT},Mt={[je]:i.NEAREST,[Zh]:i.NEAREST_MIPMAP_NEAREST,[Rr]:i.NEAREST_MIPMAP_LINEAR,[mn]:i.LINEAR,[Is]:i.LINEAR_MIPMAP_NEAREST,[ni]:i.LINEAR_MIPMAP_LINEAR},Rt={[eu]:i.NEVER,[ou]:i.ALWAYS,[nu]:i.LESS,[tl]:i.LEQUAL,[iu]:i.EQUAL,[au]:i.GEQUAL,[ru]:i.GREATER,[su]:i.NOTEQUAL};function Xt(C,S){if(S.type===gn&&t.has("OES_texture_float_linear")===!1&&(S.magFilter===mn||S.magFilter===Is||S.magFilter===Rr||S.magFilter===ni||S.minFilter===mn||S.minFilter===Is||S.minFilter===Rr||S.minFilter===ni)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,ft[S.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,ft[S.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,ft[S.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,Mt[S.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,Mt[S.minFilter]),S.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,Rt[S.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(S.magFilter===je||S.minFilter!==Rr&&S.minFilter!==ni||S.type===gn&&t.has("OES_texture_float_linear")===!1)return;if(S.anisotropy>1||n.get(S).__currentAnisotropy){const W=t.get("EXT_texture_filter_anisotropic");i.texParameterf(C,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(S.anisotropy,r.getMaxAnisotropy())),n.get(S).__currentAnisotropy=S.anisotropy}}}function ue(C,S){let W=!1;C.__webglInit===void 0&&(C.__webglInit=!0,S.addEventListener("dispose",D));const et=S.source;let st=p.get(et);st===void 0&&(st={},p.set(et,st));const j=J(S);if(j!==C.__cacheKey){st[j]===void 0&&(st[j]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,W=!0),st[j].usedTimes++;const Pt=st[C.__cacheKey];Pt!==void 0&&(st[C.__cacheKey].usedTimes--,Pt.usedTimes===0&&w(S)),C.__cacheKey=j,C.__webglTexture=st[j].texture}return W}function Q(C,S,W){let et=i.TEXTURE_2D;(S.isDataArrayTexture||S.isCompressedArrayTexture)&&(et=i.TEXTURE_2D_ARRAY),S.isData3DTexture&&(et=i.TEXTURE_3D);const st=ue(C,S),j=S.source;e.bindTexture(et,C.__webglTexture,i.TEXTURE0+W);const Pt=n.get(j);if(j.version!==Pt.__version||st===!0){e.activeTexture(i.TEXTURE0+W);const mt=he.getPrimaries(he.workingColorSpace),yt=S.colorSpace===On?null:he.getPrimaries(S.colorSpace),te=S.colorSpace===On||mt===yt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,te);let at=y(S.image,!1,r.maxTextureSize);at=fe(S,at);const Et=s.convert(S.format,S.colorSpace),Nt=s.convert(S.type);let Dt=b(S.internalFormat,Et,Nt,S.colorSpace,S.isVideoTexture);Xt(et,S);let At;const re=S.mipmaps,zt=S.isVideoTexture!==!0,de=Pt.__version===void 0||st===!0,O=j.dataReady,ht=H(S,at);if(S.isDepthTexture)Dt=A(S.format===Yi,S.type),de&&(zt?e.texStorage2D(i.TEXTURE_2D,1,Dt,at.width,at.height):e.texImage2D(i.TEXTURE_2D,0,Dt,at.width,at.height,0,Et,Nt,null));else if(S.isDataTexture)if(re.length>0){zt&&de&&e.texStorage2D(i.TEXTURE_2D,ht,Dt,re[0].width,re[0].height);for(let q=0,it=re.length;q<it;q++)At=re[q],zt?O&&e.texSubImage2D(i.TEXTURE_2D,q,0,0,At.width,At.height,Et,Nt,At.data):e.texImage2D(i.TEXTURE_2D,q,Dt,At.width,At.height,0,Et,Nt,At.data);S.generateMipmaps=!1}else zt?(de&&e.texStorage2D(i.TEXTURE_2D,ht,Dt,at.width,at.height),O&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,at.width,at.height,Et,Nt,at.data)):e.texImage2D(i.TEXTURE_2D,0,Dt,at.width,at.height,0,Et,Nt,at.data);else if(S.isCompressedTexture)if(S.isCompressedArrayTexture){zt&&de&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ht,Dt,re[0].width,re[0].height,at.depth);for(let q=0,it=re.length;q<it;q++)if(At=re[q],S.format!==cn)if(Et!==null)if(zt){if(O)if(S.layerUpdates.size>0){const gt=Ac(At.width,At.height,S.format,S.type);for(const vt of S.layerUpdates){const Bt=At.data.subarray(vt*gt/At.data.BYTES_PER_ELEMENT,(vt+1)*gt/At.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,q,0,0,vt,At.width,At.height,1,Et,Bt)}S.clearLayerUpdates()}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,q,0,0,0,At.width,At.height,at.depth,Et,At.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,q,Dt,At.width,At.height,at.depth,0,At.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else zt?O&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,q,0,0,0,At.width,At.height,at.depth,Et,Nt,At.data):e.texImage3D(i.TEXTURE_2D_ARRAY,q,Dt,At.width,At.height,at.depth,0,Et,Nt,At.data)}else{zt&&de&&e.texStorage2D(i.TEXTURE_2D,ht,Dt,re[0].width,re[0].height);for(let q=0,it=re.length;q<it;q++)At=re[q],S.format!==cn?Et!==null?zt?O&&e.compressedTexSubImage2D(i.TEXTURE_2D,q,0,0,At.width,At.height,Et,At.data):e.compressedTexImage2D(i.TEXTURE_2D,q,Dt,At.width,At.height,0,At.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):zt?O&&e.texSubImage2D(i.TEXTURE_2D,q,0,0,At.width,At.height,Et,Nt,At.data):e.texImage2D(i.TEXTURE_2D,q,Dt,At.width,At.height,0,Et,Nt,At.data)}else if(S.isDataArrayTexture)if(zt){if(de&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ht,Dt,at.width,at.height,at.depth),O)if(S.layerUpdates.size>0){const q=Ac(at.width,at.height,S.format,S.type);for(const it of S.layerUpdates){const gt=at.data.subarray(it*q/at.data.BYTES_PER_ELEMENT,(it+1)*q/at.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,it,at.width,at.height,1,Et,Nt,gt)}S.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,at.width,at.height,at.depth,Et,Nt,at.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Dt,at.width,at.height,at.depth,0,Et,Nt,at.data);else if(S.isData3DTexture)zt?(de&&e.texStorage3D(i.TEXTURE_3D,ht,Dt,at.width,at.height,at.depth),O&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,at.width,at.height,at.depth,Et,Nt,at.data)):e.texImage3D(i.TEXTURE_3D,0,Dt,at.width,at.height,at.depth,0,Et,Nt,at.data);else if(S.isFramebufferTexture){if(de)if(zt)e.texStorage2D(i.TEXTURE_2D,ht,Dt,at.width,at.height);else{let q=at.width,it=at.height;for(let gt=0;gt<ht;gt++)e.texImage2D(i.TEXTURE_2D,gt,Dt,q,it,0,Et,Nt,null),q>>=1,it>>=1}}else if(re.length>0){if(zt&&de){const q=Ct(re[0]);e.texStorage2D(i.TEXTURE_2D,ht,Dt,q.width,q.height)}for(let q=0,it=re.length;q<it;q++)At=re[q],zt?O&&e.texSubImage2D(i.TEXTURE_2D,q,0,0,Et,Nt,At):e.texImage2D(i.TEXTURE_2D,q,Dt,Et,Nt,At);S.generateMipmaps=!1}else if(zt){if(de){const q=Ct(at);e.texStorage2D(i.TEXTURE_2D,ht,Dt,q.width,q.height)}O&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,Et,Nt,at)}else e.texImage2D(i.TEXTURE_2D,0,Dt,Et,Nt,at);v(S)&&d(et),Pt.__version=j.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function ot(C,S,W){if(S.image.length!==6)return;const et=ue(C,S),st=S.source;e.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+W);const j=n.get(st);if(st.version!==j.__version||et===!0){e.activeTexture(i.TEXTURE0+W);const Pt=he.getPrimaries(he.workingColorSpace),mt=S.colorSpace===On?null:he.getPrimaries(S.colorSpace),yt=S.colorSpace===On||Pt===mt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,S.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,S.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,S.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,yt);const te=S.isCompressedTexture||S.image[0].isCompressedTexture,at=S.image[0]&&S.image[0].isDataTexture,Et=[];for(let it=0;it<6;it++)!te&&!at?Et[it]=y(S.image[it],!0,r.maxCubemapSize):Et[it]=at?S.image[it].image:S.image[it],Et[it]=fe(S,Et[it]);const Nt=Et[0],Dt=s.convert(S.format,S.colorSpace),At=s.convert(S.type),re=b(S.internalFormat,Dt,At,S.colorSpace),zt=S.isVideoTexture!==!0,de=j.__version===void 0||et===!0,O=st.dataReady;let ht=H(S,Nt);Xt(i.TEXTURE_CUBE_MAP,S);let q;if(te){zt&&de&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ht,re,Nt.width,Nt.height);for(let it=0;it<6;it++){q=Et[it].mipmaps;for(let gt=0;gt<q.length;gt++){const vt=q[gt];S.format!==cn?Dt!==null?zt?O&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,gt,0,0,vt.width,vt.height,Dt,vt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,gt,re,vt.width,vt.height,0,vt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):zt?O&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,gt,0,0,vt.width,vt.height,Dt,At,vt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,gt,re,vt.width,vt.height,0,Dt,At,vt.data)}}}else{if(q=S.mipmaps,zt&&de){q.length>0&&ht++;const it=Ct(Et[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,ht,re,it.width,it.height)}for(let it=0;it<6;it++)if(at){zt?O&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,Et[it].width,Et[it].height,Dt,At,Et[it].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,re,Et[it].width,Et[it].height,0,Dt,At,Et[it].data);for(let gt=0;gt<q.length;gt++){const Bt=q[gt].image[it].image;zt?O&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,gt+1,0,0,Bt.width,Bt.height,Dt,At,Bt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,gt+1,re,Bt.width,Bt.height,0,Dt,At,Bt.data)}}else{zt?O&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,0,0,Dt,At,Et[it]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,0,re,Dt,At,Et[it]);for(let gt=0;gt<q.length;gt++){const vt=q[gt];zt?O&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,gt+1,0,0,Dt,At,vt.image[it]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+it,gt+1,re,Dt,At,vt.image[it])}}}v(S)&&d(i.TEXTURE_CUBE_MAP),j.__version=st.version,S.onUpdate&&S.onUpdate(S)}C.__version=S.version}function bt(C,S,W,et,st,j){const Pt=s.convert(W.format,W.colorSpace),mt=s.convert(W.type),yt=b(W.internalFormat,Pt,mt,W.colorSpace),te=n.get(S),at=n.get(W);if(at.__renderTarget=S,!te.__hasExternalTextures){const Et=Math.max(1,S.width>>j),Nt=Math.max(1,S.height>>j);st===i.TEXTURE_3D||st===i.TEXTURE_2D_ARRAY?e.texImage3D(st,j,yt,Et,Nt,S.depth,0,Pt,mt,null):e.texImage2D(st,j,yt,Et,Nt,0,Pt,mt,null)}e.bindFramebuffer(i.FRAMEBUFFER,C),qt(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,et,st,at.__webglTexture,0,Qt(S)):(st===i.TEXTURE_2D||st>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&st<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,et,st,at.__webglTexture,j),e.bindFramebuffer(i.FRAMEBUFFER,null)}function pt(C,S,W){if(i.bindRenderbuffer(i.RENDERBUFFER,C),S.depthBuffer){const et=S.depthTexture,st=et&&et.isDepthTexture?et.type:null,j=A(S.stencilBuffer,st),Pt=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,mt=Qt(S);qt(S)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,mt,j,S.width,S.height):W?i.renderbufferStorageMultisample(i.RENDERBUFFER,mt,j,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,j,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,Pt,i.RENDERBUFFER,C)}else{const et=S.textures;for(let st=0;st<et.length;st++){const j=et[st],Pt=s.convert(j.format,j.colorSpace),mt=s.convert(j.type),yt=b(j.internalFormat,Pt,mt,j.colorSpace),te=Qt(S);W&&qt(S)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,te,yt,S.width,S.height):qt(S)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,te,yt,S.width,S.height):i.renderbufferStorage(i.RENDERBUFFER,yt,S.width,S.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ot(C,S){if(S&&S.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,C),!(S.depthTexture&&S.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const et=n.get(S.depthTexture);et.__renderTarget=S,(!et.__webglTexture||S.depthTexture.image.width!==S.width||S.depthTexture.image.height!==S.height)&&(S.depthTexture.image.width=S.width,S.depthTexture.image.height=S.height,S.depthTexture.needsUpdate=!0),nt(S.depthTexture,0);const st=et.__webglTexture,j=Qt(S);if(S.depthTexture.format===Bi)qt(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,st,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,st,0);else if(S.depthTexture.format===Yi)qt(S)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,st,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,st,0);else throw new Error("Unknown depthTexture format")}function Ft(C){const S=n.get(C),W=C.isWebGLCubeRenderTarget===!0;if(S.__boundDepthTexture!==C.depthTexture){const et=C.depthTexture;if(S.__depthDisposeCallback&&S.__depthDisposeCallback(),et){const st=()=>{delete S.__boundDepthTexture,delete S.__depthDisposeCallback,et.removeEventListener("dispose",st)};et.addEventListener("dispose",st),S.__depthDisposeCallback=st}S.__boundDepthTexture=et}if(C.depthTexture&&!S.__autoAllocateDepthBuffer){if(W)throw new Error("target.depthTexture not supported in Cube render targets");Ot(S.__webglFramebuffer,C)}else if(W){S.__webglDepthbuffer=[];for(let et=0;et<6;et++)if(e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer[et]),S.__webglDepthbuffer[et]===void 0)S.__webglDepthbuffer[et]=i.createRenderbuffer(),pt(S.__webglDepthbuffer[et],C,!1);else{const st=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,j=S.__webglDepthbuffer[et];i.bindRenderbuffer(i.RENDERBUFFER,j),i.framebufferRenderbuffer(i.FRAMEBUFFER,st,i.RENDERBUFFER,j)}}else if(e.bindFramebuffer(i.FRAMEBUFFER,S.__webglFramebuffer),S.__webglDepthbuffer===void 0)S.__webglDepthbuffer=i.createRenderbuffer(),pt(S.__webglDepthbuffer,C,!1);else{const et=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,st=S.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,st),i.framebufferRenderbuffer(i.FRAMEBUFFER,et,i.RENDERBUFFER,st)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function Vt(C,S,W){const et=n.get(C);S!==void 0&&bt(et.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),W!==void 0&&Ft(C)}function _e(C){const S=C.texture,W=n.get(C),et=n.get(S);C.addEventListener("dispose",I);const st=C.textures,j=C.isWebGLCubeRenderTarget===!0,Pt=st.length>1;if(Pt||(et.__webglTexture===void 0&&(et.__webglTexture=i.createTexture()),et.__version=S.version,a.memory.textures++),j){W.__webglFramebuffer=[];for(let mt=0;mt<6;mt++)if(S.mipmaps&&S.mipmaps.length>0){W.__webglFramebuffer[mt]=[];for(let yt=0;yt<S.mipmaps.length;yt++)W.__webglFramebuffer[mt][yt]=i.createFramebuffer()}else W.__webglFramebuffer[mt]=i.createFramebuffer()}else{if(S.mipmaps&&S.mipmaps.length>0){W.__webglFramebuffer=[];for(let mt=0;mt<S.mipmaps.length;mt++)W.__webglFramebuffer[mt]=i.createFramebuffer()}else W.__webglFramebuffer=i.createFramebuffer();if(Pt)for(let mt=0,yt=st.length;mt<yt;mt++){const te=n.get(st[mt]);te.__webglTexture===void 0&&(te.__webglTexture=i.createTexture(),a.memory.textures++)}if(C.samples>0&&qt(C)===!1){W.__webglMultisampledFramebuffer=i.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let mt=0;mt<st.length;mt++){const yt=st[mt];W.__webglColorRenderbuffer[mt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,W.__webglColorRenderbuffer[mt]);const te=s.convert(yt.format,yt.colorSpace),at=s.convert(yt.type),Et=b(yt.internalFormat,te,at,yt.colorSpace,C.isXRRenderTarget===!0),Nt=Qt(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,Nt,Et,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.RENDERBUFFER,W.__webglColorRenderbuffer[mt])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(W.__webglDepthRenderbuffer=i.createRenderbuffer(),pt(W.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(j){e.bindTexture(i.TEXTURE_CUBE_MAP,et.__webglTexture),Xt(i.TEXTURE_CUBE_MAP,S);for(let mt=0;mt<6;mt++)if(S.mipmaps&&S.mipmaps.length>0)for(let yt=0;yt<S.mipmaps.length;yt++)bt(W.__webglFramebuffer[mt][yt],C,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,yt);else bt(W.__webglFramebuffer[mt],C,S,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+mt,0);v(S)&&d(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Pt){for(let mt=0,yt=st.length;mt<yt;mt++){const te=st[mt],at=n.get(te);e.bindTexture(i.TEXTURE_2D,at.__webglTexture),Xt(i.TEXTURE_2D,te),bt(W.__webglFramebuffer,C,te,i.COLOR_ATTACHMENT0+mt,i.TEXTURE_2D,0),v(te)&&d(i.TEXTURE_2D)}e.unbindTexture()}else{let mt=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(mt=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(mt,et.__webglTexture),Xt(mt,S),S.mipmaps&&S.mipmaps.length>0)for(let yt=0;yt<S.mipmaps.length;yt++)bt(W.__webglFramebuffer[yt],C,S,i.COLOR_ATTACHMENT0,mt,yt);else bt(W.__webglFramebuffer,C,S,i.COLOR_ATTACHMENT0,mt,0);v(S)&&d(mt),e.unbindTexture()}C.depthBuffer&&Ft(C)}function Zt(C){const S=C.textures;for(let W=0,et=S.length;W<et;W++){const st=S[W];if(v(st)){const j=R(C),Pt=n.get(st).__webglTexture;e.bindTexture(j,Pt),d(j),e.unbindTexture()}}}const ie=[],k=[];function He(C){if(C.samples>0){if(qt(C)===!1){const S=C.textures,W=C.width,et=C.height;let st=i.COLOR_BUFFER_BIT;const j=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Pt=n.get(C),mt=S.length>1;if(mt)for(let yt=0;yt<S.length;yt++)e.bindFramebuffer(i.FRAMEBUFFER,Pt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Pt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Pt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Pt.__webglFramebuffer);for(let yt=0;yt<S.length;yt++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(st|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(st|=i.STENCIL_BUFFER_BIT)),mt){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Pt.__webglColorRenderbuffer[yt]);const te=n.get(S[yt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,te,0)}i.blitFramebuffer(0,0,W,et,0,0,W,et,st,i.NEAREST),c===!0&&(ie.length=0,k.length=0,ie.push(i.COLOR_ATTACHMENT0+yt),C.depthBuffer&&C.resolveDepthBuffer===!1&&(ie.push(j),k.push(j),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,k)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ie))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),mt)for(let yt=0;yt<S.length;yt++){e.bindFramebuffer(i.FRAMEBUFFER,Pt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.RENDERBUFFER,Pt.__webglColorRenderbuffer[yt]);const te=n.get(S[yt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Pt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+yt,i.TEXTURE_2D,te,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Pt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){const S=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[S])}}}function Qt(C){return Math.min(r.maxSamples,C.samples)}function qt(C){const S=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&S.__useRenderToTexture!==!1}function Ut(C){const S=a.render.frame;u.get(C)!==S&&(u.set(C,S),C.update())}function fe(C,S){const W=C.colorSpace,et=C.format,st=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||W!==Ji&&W!==On&&(he.getTransfer(W)===pe?(et!==cn||st!==wn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",W)),S}function Ct(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(h.width=C.naturalWidth||C.width,h.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(h.width=C.displayWidth,h.height=C.displayHeight):(h.width=C.width,h.height=C.height),h}this.allocateTextureUnit=X,this.resetTextureUnits=$,this.setTexture2D=nt,this.setTexture2DArray=Z,this.setTexture3D=tt,this.setTextureCube=Y,this.rebindTextures=Vt,this.setupRenderTarget=_e,this.updateRenderTargetMipmap=Zt,this.updateMultisampleRenderTarget=He,this.setupDepthRenderbuffer=Ft,this.setupFrameBufferTexture=bt,this.useMultisampledRTT=qt}function dg(i,t){function e(n,r=On){let s;const a=he.getTransfer(r);if(n===wn)return i.UNSIGNED_BYTE;if(n===oo)return i.UNSIGNED_SHORT_4_4_4_4;if(n===co)return i.UNSIGNED_SHORT_5_5_5_1;if(n===qc)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===$c)return i.BYTE;if(n===Xc)return i.SHORT;if(n===xr)return i.UNSIGNED_SHORT;if(n===ao)return i.INT;if(n===ai)return i.UNSIGNED_INT;if(n===gn)return i.FLOAT;if(n===Er)return i.HALF_FLOAT;if(n===Yc)return i.ALPHA;if(n===jc)return i.RGB;if(n===cn)return i.RGBA;if(n===Kc)return i.LUMINANCE;if(n===Zc)return i.LUMINANCE_ALPHA;if(n===Bi)return i.DEPTH_COMPONENT;if(n===Yi)return i.DEPTH_STENCIL;if(n===lo)return i.RED;if(n===ho)return i.RED_INTEGER;if(n===Jc)return i.RG;if(n===uo)return i.RG_INTEGER;if(n===fo)return i.RGBA_INTEGER;if(n===ns||n===is||n===rs||n===ss)if(a===pe)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===ns)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===is)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===rs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===ss)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===ns)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===is)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===rs)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===ss)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Aa||n===wa||n===ba||n===Ra)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===Aa)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===wa)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ba)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ra)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ca||n===Pa||n===Ia)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Ca||n===Pa)return a===pe?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Ia)return a===pe?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===La||n===Da||n===Ua||n===Na||n===Oa||n===Fa||n===Ba||n===za||n===ka||n===Ha||n===Ga||n===Va||n===Wa||n===$a)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===La)return a===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Da)return a===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ua)return a===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Na)return a===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Oa)return a===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Fa)return a===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ba)return a===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===za)return a===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ka)return a===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ha)return a===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ga)return a===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Va)return a===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Wa)return a===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===$a)return a===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===as||n===Xa||n===qa)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===as)return a===pe?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Xa)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===qa)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Qc||n===Ya||n===ja||n===Ka)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===as)return s.COMPRESSED_RED_RGTC1_EXT;if(n===Ya)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ja)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ka)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===qi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}class pg extends tn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Fn extends Te{constructor(){super(),this.isGroup=!0,this.type="Group"}}const mg={type:"move"};class aa{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Fn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Fn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new V,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new V),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Fn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new V,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new V),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,h=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(h&&t.hand){a=!0;for(const y of t.hand.values()){const v=e.getJointPose(y,n),d=this._getHandJoint(h,y);v!==null&&(d.matrix.fromArray(v.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=v.radius),d.visible=v!==null}const u=h.joints["index-finger-tip"],f=h.joints["thumb-tip"],p=u.position.distanceTo(f.position),_=.02,x=.005;h.inputState.pinching&&p>_+x?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!h.inputState.pinching&&p<=_-x&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(mg)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Fn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const gg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,_g=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class vg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const r=new Oe,s=t.properties.get(r);s.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=r}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Vn({vertexShader:gg,fragmentShader:_g,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new oe(new Ki(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class xg extends Qi{constructor(t,e){super();const n=this;let r=null,s=1,a=null,o="local-floor",c=1,h=null,u=null,f=null,p=null,_=null,x=null;const y=new vg,v=e.getContextAttributes();let d=null,R=null;const b=[],A=[],H=new Ht;let D=null;const I=new tn;I.viewport=new Se;const N=new tn;N.viewport=new Se;const w=[I,N],T=new pg;let U=null,$=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let ot=b[Q];return ot===void 0&&(ot=new aa,b[Q]=ot),ot.getTargetRaySpace()},this.getControllerGrip=function(Q){let ot=b[Q];return ot===void 0&&(ot=new aa,b[Q]=ot),ot.getGripSpace()},this.getHand=function(Q){let ot=b[Q];return ot===void 0&&(ot=new aa,b[Q]=ot),ot.getHandSpace()};function X(Q){const ot=A.indexOf(Q.inputSource);if(ot===-1)return;const bt=b[ot];bt!==void 0&&(bt.update(Q.inputSource,Q.frame,h||a),bt.dispatchEvent({type:Q.type,data:Q.inputSource}))}function J(){r.removeEventListener("select",X),r.removeEventListener("selectstart",X),r.removeEventListener("selectend",X),r.removeEventListener("squeeze",X),r.removeEventListener("squeezestart",X),r.removeEventListener("squeezeend",X),r.removeEventListener("end",J),r.removeEventListener("inputsourceschange",nt);for(let Q=0;Q<b.length;Q++){const ot=A[Q];ot!==null&&(A[Q]=null,b[Q].disconnect(ot))}U=null,$=null,y.reset(),t.setRenderTarget(d),_=null,p=null,f=null,r=null,R=null,ue.stop(),n.isPresenting=!1,t.setPixelRatio(D),t.setSize(H.width,H.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){s=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){o=Q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(Q){h=Q},this.getBaseLayer=function(){return p!==null?p:_},this.getBinding=function(){return f},this.getFrame=function(){return x},this.getSession=function(){return r},this.setSession=async function(Q){if(r=Q,r!==null){if(d=t.getRenderTarget(),r.addEventListener("select",X),r.addEventListener("selectstart",X),r.addEventListener("selectend",X),r.addEventListener("squeeze",X),r.addEventListener("squeezestart",X),r.addEventListener("squeezeend",X),r.addEventListener("end",J),r.addEventListener("inputsourceschange",nt),v.xrCompatible!==!0&&await e.makeXRCompatible(),D=t.getPixelRatio(),t.getSize(H),r.renderState.layers===void 0){const ot={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:s};_=new XRWebGLLayer(r,e,ot),r.updateRenderState({baseLayer:_}),t.setPixelRatio(1),t.setSize(_.framebufferWidth,_.framebufferHeight,!1),R=new oi(_.framebufferWidth,_.framebufferHeight,{format:cn,type:wn,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil})}else{let ot=null,bt=null,pt=null;v.depth&&(pt=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,ot=v.stencil?Yi:Bi,bt=v.stencil?qi:ai);const Ot={colorFormat:e.RGBA8,depthFormat:pt,scaleFactor:s};f=new XRWebGLBinding(r,e),p=f.createProjectionLayer(Ot),r.updateRenderState({layers:[p]}),t.setPixelRatio(1),t.setSize(p.textureWidth,p.textureHeight,!1),R=new oi(p.textureWidth,p.textureHeight,{format:cn,type:wn,depthTexture:new dl(p.textureWidth,p.textureHeight,bt,void 0,void 0,void 0,void 0,void 0,void 0,ot),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1})}R.isXRRenderTarget=!0,this.setFoveation(c),h=null,a=await r.requestReferenceSpace(o),ue.setContext(r),ue.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function nt(Q){for(let ot=0;ot<Q.removed.length;ot++){const bt=Q.removed[ot],pt=A.indexOf(bt);pt>=0&&(A[pt]=null,b[pt].disconnect(bt))}for(let ot=0;ot<Q.added.length;ot++){const bt=Q.added[ot];let pt=A.indexOf(bt);if(pt===-1){for(let Ft=0;Ft<b.length;Ft++)if(Ft>=A.length){A.push(bt),pt=Ft;break}else if(A[Ft]===null){A[Ft]=bt,pt=Ft;break}if(pt===-1)break}const Ot=b[pt];Ot&&Ot.connect(bt)}}const Z=new V,tt=new V;function Y(Q,ot,bt){Z.setFromMatrixPosition(ot.matrixWorld),tt.setFromMatrixPosition(bt.matrixWorld);const pt=Z.distanceTo(tt),Ot=ot.projectionMatrix.elements,Ft=bt.projectionMatrix.elements,Vt=Ot[14]/(Ot[10]-1),_e=Ot[14]/(Ot[10]+1),Zt=(Ot[9]+1)/Ot[5],ie=(Ot[9]-1)/Ot[5],k=(Ot[8]-1)/Ot[0],He=(Ft[8]+1)/Ft[0],Qt=Vt*k,qt=Vt*He,Ut=pt/(-k+He),fe=Ut*-k;if(ot.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(fe),Q.translateZ(Ut),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),Ot[10]===-1)Q.projectionMatrix.copy(ot.projectionMatrix),Q.projectionMatrixInverse.copy(ot.projectionMatrixInverse);else{const Ct=Vt+Ut,C=_e+Ut,S=Qt-fe,W=qt+(pt-fe),et=Zt*_e/C*Ct,st=ie*_e/C*Ct;Q.projectionMatrix.makePerspective(S,W,et,st,Ct,C),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function ft(Q,ot){ot===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(ot.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(r===null)return;let ot=Q.near,bt=Q.far;y.texture!==null&&(y.depthNear>0&&(ot=y.depthNear),y.depthFar>0&&(bt=y.depthFar)),T.near=N.near=I.near=ot,T.far=N.far=I.far=bt,(U!==T.near||$!==T.far)&&(r.updateRenderState({depthNear:T.near,depthFar:T.far}),U=T.near,$=T.far),I.layers.mask=Q.layers.mask|2,N.layers.mask=Q.layers.mask|4,T.layers.mask=I.layers.mask|N.layers.mask;const pt=Q.parent,Ot=T.cameras;ft(T,pt);for(let Ft=0;Ft<Ot.length;Ft++)ft(Ot[Ft],pt);Ot.length===2?Y(T,I,N):T.projectionMatrix.copy(I.projectionMatrix),Mt(Q,T,pt)};function Mt(Q,ot,bt){bt===null?Q.matrix.copy(ot.matrixWorld):(Q.matrix.copy(bt.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(ot.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(ot.projectionMatrix),Q.projectionMatrixInverse.copy(ot.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=Ja*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return T},this.getFoveation=function(){if(!(p===null&&_===null))return c},this.setFoveation=function(Q){c=Q,p!==null&&(p.fixedFoveation=Q),_!==null&&_.fixedFoveation!==void 0&&(_.fixedFoveation=Q)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(T)};let Rt=null;function Xt(Q,ot){if(u=ot.getViewerPose(h||a),x=ot,u!==null){const bt=u.views;_!==null&&(t.setRenderTargetFramebuffer(R,_.framebuffer),t.setRenderTarget(R));let pt=!1;bt.length!==T.cameras.length&&(T.cameras.length=0,pt=!0);for(let Ft=0;Ft<bt.length;Ft++){const Vt=bt[Ft];let _e=null;if(_!==null)_e=_.getViewport(Vt);else{const ie=f.getViewSubImage(p,Vt);_e=ie.viewport,Ft===0&&(t.setRenderTargetTextures(R,ie.colorTexture,p.ignoreDepthValues?void 0:ie.depthStencilTexture),t.setRenderTarget(R))}let Zt=w[Ft];Zt===void 0&&(Zt=new tn,Zt.layers.enable(Ft),Zt.viewport=new Se,w[Ft]=Zt),Zt.matrix.fromArray(Vt.transform.matrix),Zt.matrix.decompose(Zt.position,Zt.quaternion,Zt.scale),Zt.projectionMatrix.fromArray(Vt.projectionMatrix),Zt.projectionMatrixInverse.copy(Zt.projectionMatrix).invert(),Zt.viewport.set(_e.x,_e.y,_e.width,_e.height),Ft===0&&(T.matrix.copy(Zt.matrix),T.matrix.decompose(T.position,T.quaternion,T.scale)),pt===!0&&T.cameras.push(Zt)}const Ot=r.enabledFeatures;if(Ot&&Ot.includes("depth-sensing")){const Ft=f.getDepthInformation(bt[0]);Ft&&Ft.isValid&&Ft.texture&&y.init(t,Ft,r.renderState)}}for(let bt=0;bt<b.length;bt++){const pt=A[bt],Ot=b[bt];pt!==null&&Ot!==void 0&&Ot.update(pt,ot,h||a)}Rt&&Rt(Q,ot),ot.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ot}),x=null}const ue=new ul;ue.setAnimationLoop(Xt),this.setAnimationLoop=function(Q){Rt=Q},this.dispose=function(){}}}const Kn=new hn,Mg=new ge;function yg(i,t){function e(v,d){v.matrixAutoUpdate===!0&&v.updateMatrix(),d.value.copy(v.matrix)}function n(v,d){d.color.getRGB(v.fogColor.value,cl(i)),d.isFog?(v.fogNear.value=d.near,v.fogFar.value=d.far):d.isFogExp2&&(v.fogDensity.value=d.density)}function r(v,d,R,b,A){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(v,d):d.isMeshToonMaterial?(s(v,d),f(v,d)):d.isMeshPhongMaterial?(s(v,d),u(v,d)):d.isMeshStandardMaterial?(s(v,d),p(v,d),d.isMeshPhysicalMaterial&&_(v,d,A)):d.isMeshMatcapMaterial?(s(v,d),x(v,d)):d.isMeshDepthMaterial?s(v,d):d.isMeshDistanceMaterial?(s(v,d),y(v,d)):d.isMeshNormalMaterial?s(v,d):d.isLineBasicMaterial?(a(v,d),d.isLineDashedMaterial&&o(v,d)):d.isPointsMaterial?c(v,d,R,b):d.isSpriteMaterial?h(v,d):d.isShadowMaterial?(v.color.value.copy(d.color),v.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(v,d){v.opacity.value=d.opacity,d.color&&v.diffuse.value.copy(d.color),d.emissive&&v.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(v.map.value=d.map,e(d.map,v.mapTransform)),d.alphaMap&&(v.alphaMap.value=d.alphaMap,e(d.alphaMap,v.alphaMapTransform)),d.bumpMap&&(v.bumpMap.value=d.bumpMap,e(d.bumpMap,v.bumpMapTransform),v.bumpScale.value=d.bumpScale,d.side===ze&&(v.bumpScale.value*=-1)),d.normalMap&&(v.normalMap.value=d.normalMap,e(d.normalMap,v.normalMapTransform),v.normalScale.value.copy(d.normalScale),d.side===ze&&v.normalScale.value.negate()),d.displacementMap&&(v.displacementMap.value=d.displacementMap,e(d.displacementMap,v.displacementMapTransform),v.displacementScale.value=d.displacementScale,v.displacementBias.value=d.displacementBias),d.emissiveMap&&(v.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,v.emissiveMapTransform)),d.specularMap&&(v.specularMap.value=d.specularMap,e(d.specularMap,v.specularMapTransform)),d.alphaTest>0&&(v.alphaTest.value=d.alphaTest);const R=t.get(d),b=R.envMap,A=R.envMapRotation;b&&(v.envMap.value=b,Kn.copy(A),Kn.x*=-1,Kn.y*=-1,Kn.z*=-1,b.isCubeTexture&&b.isRenderTargetTexture===!1&&(Kn.y*=-1,Kn.z*=-1),v.envMapRotation.value.setFromMatrix4(Mg.makeRotationFromEuler(Kn)),v.flipEnvMap.value=b.isCubeTexture&&b.isRenderTargetTexture===!1?-1:1,v.reflectivity.value=d.reflectivity,v.ior.value=d.ior,v.refractionRatio.value=d.refractionRatio),d.lightMap&&(v.lightMap.value=d.lightMap,v.lightMapIntensity.value=d.lightMapIntensity,e(d.lightMap,v.lightMapTransform)),d.aoMap&&(v.aoMap.value=d.aoMap,v.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,v.aoMapTransform))}function a(v,d){v.diffuse.value.copy(d.color),v.opacity.value=d.opacity,d.map&&(v.map.value=d.map,e(d.map,v.mapTransform))}function o(v,d){v.dashSize.value=d.dashSize,v.totalSize.value=d.dashSize+d.gapSize,v.scale.value=d.scale}function c(v,d,R,b){v.diffuse.value.copy(d.color),v.opacity.value=d.opacity,v.size.value=d.size*R,v.scale.value=b*.5,d.map&&(v.map.value=d.map,e(d.map,v.uvTransform)),d.alphaMap&&(v.alphaMap.value=d.alphaMap,e(d.alphaMap,v.alphaMapTransform)),d.alphaTest>0&&(v.alphaTest.value=d.alphaTest)}function h(v,d){v.diffuse.value.copy(d.color),v.opacity.value=d.opacity,v.rotation.value=d.rotation,d.map&&(v.map.value=d.map,e(d.map,v.mapTransform)),d.alphaMap&&(v.alphaMap.value=d.alphaMap,e(d.alphaMap,v.alphaMapTransform)),d.alphaTest>0&&(v.alphaTest.value=d.alphaTest)}function u(v,d){v.specular.value.copy(d.specular),v.shininess.value=Math.max(d.shininess,1e-4)}function f(v,d){d.gradientMap&&(v.gradientMap.value=d.gradientMap)}function p(v,d){v.metalness.value=d.metalness,d.metalnessMap&&(v.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,v.metalnessMapTransform)),v.roughness.value=d.roughness,d.roughnessMap&&(v.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,v.roughnessMapTransform)),d.envMap&&(v.envMapIntensity.value=d.envMapIntensity)}function _(v,d,R){v.ior.value=d.ior,d.sheen>0&&(v.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),v.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(v.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,v.sheenColorMapTransform)),d.sheenRoughnessMap&&(v.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,v.sheenRoughnessMapTransform))),d.clearcoat>0&&(v.clearcoat.value=d.clearcoat,v.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(v.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,v.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(v.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,v.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(v.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,v.clearcoatNormalMapTransform),v.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===ze&&v.clearcoatNormalScale.value.negate())),d.dispersion>0&&(v.dispersion.value=d.dispersion),d.iridescence>0&&(v.iridescence.value=d.iridescence,v.iridescenceIOR.value=d.iridescenceIOR,v.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],v.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(v.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,v.iridescenceMapTransform)),d.iridescenceThicknessMap&&(v.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,v.iridescenceThicknessMapTransform))),d.transmission>0&&(v.transmission.value=d.transmission,v.transmissionSamplerMap.value=R.texture,v.transmissionSamplerSize.value.set(R.width,R.height),d.transmissionMap&&(v.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,v.transmissionMapTransform)),v.thickness.value=d.thickness,d.thicknessMap&&(v.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,v.thicknessMapTransform)),v.attenuationDistance.value=d.attenuationDistance,v.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(v.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(v.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,v.anisotropyMapTransform))),v.specularIntensity.value=d.specularIntensity,v.specularColor.value.copy(d.specularColor),d.specularColorMap&&(v.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,v.specularColorMapTransform)),d.specularIntensityMap&&(v.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,v.specularIntensityMapTransform))}function x(v,d){d.matcap&&(v.matcap.value=d.matcap)}function y(v,d){const R=t.get(d).light;v.referencePosition.value.setFromMatrixPosition(R.matrixWorld),v.nearDistance.value=R.shadow.camera.near,v.farDistance.value=R.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function Sg(i,t,e,n){let r={},s={},a=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(R,b){const A=b.program;n.uniformBlockBinding(R,A)}function h(R,b){let A=r[R.id];A===void 0&&(x(R),A=u(R),r[R.id]=A,R.addEventListener("dispose",v));const H=b.program;n.updateUBOMapping(R,H);const D=t.render.frame;s[R.id]!==D&&(p(R),s[R.id]=D)}function u(R){const b=f();R.__bindingPointIndex=b;const A=i.createBuffer(),H=R.__size,D=R.usage;return i.bindBuffer(i.UNIFORM_BUFFER,A),i.bufferData(i.UNIFORM_BUFFER,H,D),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,b,A),A}function f(){for(let R=0;R<o;R++)if(a.indexOf(R)===-1)return a.push(R),R;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(R){const b=r[R.id],A=R.uniforms,H=R.__cache;i.bindBuffer(i.UNIFORM_BUFFER,b);for(let D=0,I=A.length;D<I;D++){const N=Array.isArray(A[D])?A[D]:[A[D]];for(let w=0,T=N.length;w<T;w++){const U=N[w];if(_(U,D,w,H)===!0){const $=U.__offset,X=Array.isArray(U.value)?U.value:[U.value];let J=0;for(let nt=0;nt<X.length;nt++){const Z=X[nt],tt=y(Z);typeof Z=="number"||typeof Z=="boolean"?(U.__data[0]=Z,i.bufferSubData(i.UNIFORM_BUFFER,$+J,U.__data)):Z.isMatrix3?(U.__data[0]=Z.elements[0],U.__data[1]=Z.elements[1],U.__data[2]=Z.elements[2],U.__data[3]=0,U.__data[4]=Z.elements[3],U.__data[5]=Z.elements[4],U.__data[6]=Z.elements[5],U.__data[7]=0,U.__data[8]=Z.elements[6],U.__data[9]=Z.elements[7],U.__data[10]=Z.elements[8],U.__data[11]=0):(Z.toArray(U.__data,J),J+=tt.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,$,U.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function _(R,b,A,H){const D=R.value,I=b+"_"+A;if(H[I]===void 0)return typeof D=="number"||typeof D=="boolean"?H[I]=D:H[I]=D.clone(),!0;{const N=H[I];if(typeof D=="number"||typeof D=="boolean"){if(N!==D)return H[I]=D,!0}else if(N.equals(D)===!1)return N.copy(D),!0}return!1}function x(R){const b=R.uniforms;let A=0;const H=16;for(let I=0,N=b.length;I<N;I++){const w=Array.isArray(b[I])?b[I]:[b[I]];for(let T=0,U=w.length;T<U;T++){const $=w[T],X=Array.isArray($.value)?$.value:[$.value];for(let J=0,nt=X.length;J<nt;J++){const Z=X[J],tt=y(Z),Y=A%H,ft=Y%tt.boundary,Mt=Y+ft;A+=ft,Mt!==0&&H-Mt<tt.storage&&(A+=H-Mt),$.__data=new Float32Array(tt.storage/Float32Array.BYTES_PER_ELEMENT),$.__offset=A,A+=tt.storage}}}const D=A%H;return D>0&&(A+=H-D),R.__size=A,R.__cache={},this}function y(R){const b={boundary:0,storage:0};return typeof R=="number"||typeof R=="boolean"?(b.boundary=4,b.storage=4):R.isVector2?(b.boundary=8,b.storage=8):R.isVector3||R.isColor?(b.boundary=16,b.storage=12):R.isVector4?(b.boundary=16,b.storage=16):R.isMatrix3?(b.boundary=48,b.storage=48):R.isMatrix4?(b.boundary=64,b.storage=64):R.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",R),b}function v(R){const b=R.target;b.removeEventListener("dispose",v);const A=a.indexOf(b.__bindingPointIndex);a.splice(A,1),i.deleteBuffer(r[b.id]),delete r[b.id],delete s[b.id]}function d(){for(const R in r)i.deleteBuffer(r[R]);a=[],r={},s={}}return{bind:c,update:h,dispose:d}}class Eg{constructor(t={}){const{canvas:e=lu(),context:n=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reverseDepthBuffer:p=!1}=t;this.isWebGLRenderer=!0;let _;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=n.getContextAttributes().alpha}else _=a;const x=new Uint32Array(4),y=new Int32Array(4);let v=null,d=null;const R=[],b=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Qe,this.toneMapping=kn,this.toneMappingExposure=1;const A=this;let H=!1,D=0,I=0,N=null,w=-1,T=null;const U=new Se,$=new Se;let X=null;const J=new ne(0);let nt=0,Z=e.width,tt=e.height,Y=1,ft=null,Mt=null;const Rt=new Se(0,0,Z,tt),Xt=new Se(0,0,Z,tt);let ue=!1;const Q=new mo;let ot=!1,bt=!1;const pt=new ge,Ot=new ge,Ft=new V,Vt=new Se,_e={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Zt=!1;function ie(){return N===null?Y:1}let k=n;function He(M,P){return e.getContext(M,P)}try{const M={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${ro}`),e.addEventListener("webglcontextlost",it,!1),e.addEventListener("webglcontextrestored",gt,!1),e.addEventListener("webglcontextcreationerror",vt,!1),k===null){const P="webgl2";if(k=He(P,M),k===null)throw He(P)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(M){throw console.error("THREE.WebGLRenderer: "+M.message),M}let Qt,qt,Ut,fe,Ct,C,S,W,et,st,j,Pt,mt,yt,te,at,Et,Nt,Dt,At,re,zt,de,O;function ht(){Qt=new Rp(k),Qt.init(),zt=new dg(k,Qt),qt=new Sp(k,Qt,t,zt),Ut=new hg(k,Qt),qt.reverseDepthBuffer&&p&&Ut.buffers.depth.setReversed(!0),fe=new Ip(k),Ct=new jm,C=new fg(k,Qt,Ut,Ct,qt,zt,fe),S=new Tp(A),W=new bp(A),et=new Fu(k),de=new Mp(k,et),st=new Cp(k,et,fe,de),j=new Dp(k,st,et,fe),Dt=new Lp(k,qt,C),at=new Ep(Ct),Pt=new Ym(A,S,W,Qt,qt,de,at),mt=new yg(A,Ct),yt=new Zm,te=new ig(Qt),Nt=new xp(A,S,W,Ut,j,_,c),Et=new cg(A,j,qt),O=new Sg(k,fe,qt,Ut),At=new yp(k,Qt,fe),re=new Pp(k,Qt,fe),fe.programs=Pt.programs,A.capabilities=qt,A.extensions=Qt,A.properties=Ct,A.renderLists=yt,A.shadowMap=Et,A.state=Ut,A.info=fe}ht();const q=new xg(A,k);this.xr=q,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const M=Qt.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){const M=Qt.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(M){M!==void 0&&(Y=M,this.setSize(Z,tt,!1))},this.getSize=function(M){return M.set(Z,tt)},this.setSize=function(M,P,z=!0){if(q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Z=M,tt=P,e.width=Math.floor(M*Y),e.height=Math.floor(P*Y),z===!0&&(e.style.width=M+"px",e.style.height=P+"px"),this.setViewport(0,0,M,P)},this.getDrawingBufferSize=function(M){return M.set(Z*Y,tt*Y).floor()},this.setDrawingBufferSize=function(M,P,z){Z=M,tt=P,Y=z,e.width=Math.floor(M*z),e.height=Math.floor(P*z),this.setViewport(0,0,M,P)},this.getCurrentViewport=function(M){return M.copy(U)},this.getViewport=function(M){return M.copy(Rt)},this.setViewport=function(M,P,z,F){M.isVector4?Rt.set(M.x,M.y,M.z,M.w):Rt.set(M,P,z,F),Ut.viewport(U.copy(Rt).multiplyScalar(Y).round())},this.getScissor=function(M){return M.copy(Xt)},this.setScissor=function(M,P,z,F){M.isVector4?Xt.set(M.x,M.y,M.z,M.w):Xt.set(M,P,z,F),Ut.scissor($.copy(Xt).multiplyScalar(Y).round())},this.getScissorTest=function(){return ue},this.setScissorTest=function(M){Ut.setScissorTest(ue=M)},this.setOpaqueSort=function(M){ft=M},this.setTransparentSort=function(M){Mt=M},this.getClearColor=function(M){return M.copy(Nt.getClearColor())},this.setClearColor=function(){Nt.setClearColor.apply(Nt,arguments)},this.getClearAlpha=function(){return Nt.getClearAlpha()},this.setClearAlpha=function(){Nt.setClearAlpha.apply(Nt,arguments)},this.clear=function(M=!0,P=!0,z=!0){let F=0;if(M){let L=!1;if(N!==null){const G=N.texture.format;L=G===fo||G===uo||G===ho}if(L){const G=N.texture.type,rt=G===wn||G===ai||G===xr||G===qi||G===oo||G===co,_t=Nt.getClearColor(),lt=Nt.getClearAlpha(),ct=_t.r,ut=_t.g,St=_t.b;rt?(x[0]=ct,x[1]=ut,x[2]=St,x[3]=lt,k.clearBufferuiv(k.COLOR,0,x)):(y[0]=ct,y[1]=ut,y[2]=St,y[3]=lt,k.clearBufferiv(k.COLOR,0,y))}else F|=k.COLOR_BUFFER_BIT}P&&(F|=k.DEPTH_BUFFER_BIT),z&&(F|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),k.clear(F)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",it,!1),e.removeEventListener("webglcontextrestored",gt,!1),e.removeEventListener("webglcontextcreationerror",vt,!1),yt.dispose(),te.dispose(),Ct.dispose(),S.dispose(),W.dispose(),j.dispose(),de.dispose(),O.dispose(),Pt.dispose(),q.dispose(),q.removeEventListener("sessionstart",hi),q.removeEventListener("sessionend",ui),_n.stop()};function it(M){M.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),H=!0}function gt(){console.log("THREE.WebGLRenderer: Context Restored."),H=!1;const M=fe.autoReset,P=Et.enabled,z=Et.autoUpdate,F=Et.needsUpdate,L=Et.type;ht(),fe.autoReset=M,Et.enabled=P,Et.autoUpdate=z,Et.needsUpdate=F,Et.type=L}function vt(M){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function Bt(M){const P=M.target;P.removeEventListener("dispose",Bt),xe(P)}function xe(M){Re(M),Ct.remove(M)}function Re(M){const P=Ct.get(M).programs;P!==void 0&&(P.forEach(function(z){Pt.releaseProgram(z)}),M.isShaderMaterial&&Pt.releaseShaderCache(M))}this.renderBufferDirect=function(M,P,z,F,L,G){P===null&&(P=_e);const rt=L.isMesh&&L.matrixWorld.determinant()<0,_t=ee(M,P,z,F,L);Ut.setMaterial(F,rt);let lt=z.index,ct=1;if(F.wireframe===!0){if(lt=st.getWireframeAttribute(z),lt===void 0)return;ct=2}const ut=z.drawRange,St=z.attributes.position;let Wt=ut.start*ct,Jt=(ut.start+ut.count)*ct;G!==null&&(Wt=Math.max(Wt,G.start*ct),Jt=Math.min(Jt,(G.start+G.count)*ct)),lt!==null?(Wt=Math.max(Wt,0),Jt=Math.min(Jt,lt.count)):St!=null&&(Wt=Math.max(Wt,0),Jt=Math.min(Jt,St.count));const kt=Jt-Wt;if(kt<0||kt===1/0)return;de.setup(L,F,_t,z,lt);let ce,ae=At;if(lt!==null&&(ce=et.get(lt),ae=re,ae.setIndex(ce)),L.isMesh)F.wireframe===!0?(Ut.setLineWidth(F.wireframeLinewidth*ie()),ae.setMode(k.LINES)):ae.setMode(k.TRIANGLES);else if(L.isLine){let Tt=F.linewidth;Tt===void 0&&(Tt=1),Ut.setLineWidth(Tt*ie()),L.isLineSegments?ae.setMode(k.LINES):L.isLineLoop?ae.setMode(k.LINE_LOOP):ae.setMode(k.LINE_STRIP)}else L.isPoints?ae.setMode(k.POINTS):L.isSprite&&ae.setMode(k.TRIANGLES);if(L.isBatchedMesh)if(L._multiDrawInstances!==null)ae.renderMultiDrawInstances(L._multiDrawStarts,L._multiDrawCounts,L._multiDrawCount,L._multiDrawInstances);else if(Qt.get("WEBGL_multi_draw"))ae.renderMultiDraw(L._multiDrawStarts,L._multiDrawCounts,L._multiDrawCount);else{const Tt=L._multiDrawStarts,We=L._multiDrawCounts,Kt=L._multiDrawCount,Ie=lt?et.get(lt).bytesPerElement:1,fi=Ct.get(F).currentProgram.getUniforms();for(let $e=0;$e<Kt;$e++)fi.setValue(k,"_gl_DrawID",$e),ae.render(Tt[$e]/Ie,We[$e])}else if(L.isInstancedMesh)ae.renderInstances(Wt,kt,L.count);else if(z.isInstancedBufferGeometry){const Tt=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,We=Math.min(z.instanceCount,Tt);ae.renderInstances(Wt,kt,We)}else ae.render(Wt,kt)};function Gt(M,P,z){M.transparent===!0&&M.side===en&&M.forceSinglePass===!1?(M.side=ze,M.needsUpdate=!0,K(M,P,z),M.side=Gn,M.needsUpdate=!0,K(M,P,z),M.side=en):K(M,P,z)}this.compile=function(M,P,z=null){z===null&&(z=M),d=te.get(z),d.init(P),b.push(d),z.traverseVisible(function(L){L.isLight&&L.layers.test(P.layers)&&(d.pushLight(L),L.castShadow&&d.pushShadow(L))}),M!==z&&M.traverseVisible(function(L){L.isLight&&L.layers.test(P.layers)&&(d.pushLight(L),L.castShadow&&d.pushShadow(L))}),d.setupLights();const F=new Set;return M.traverse(function(L){if(!(L.isMesh||L.isPoints||L.isLine||L.isSprite))return;const G=L.material;if(G)if(Array.isArray(G))for(let rt=0;rt<G.length;rt++){const _t=G[rt];Gt(_t,z,L),F.add(_t)}else Gt(G,z,L),F.add(G)}),b.pop(),d=null,F},this.compileAsync=function(M,P,z=null){const F=this.compile(M,P,z);return new Promise(L=>{function G(){if(F.forEach(function(rt){Ct.get(rt).currentProgram.isReady()&&F.delete(rt)}),F.size===0){L(M);return}setTimeout(G,10)}Qt.get("KHR_parallel_shader_compile")!==null?G():setTimeout(G,10)})};let Ve=null;function Pe(M){Ve&&Ve(M)}function hi(){_n.stop()}function ui(){_n.start()}const _n=new ul;_n.setAnimationLoop(Pe),typeof self<"u"&&_n.setContext(self),this.setAnimationLoop=function(M){Ve=M,q.setAnimationLoop(M),M===null?_n.stop():_n.start()},q.addEventListener("sessionstart",hi),q.addEventListener("sessionend",ui),this.render=function(M,P){if(P!==void 0&&P.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(H===!0)return;if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),P.parent===null&&P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),q.enabled===!0&&q.isPresenting===!0&&(q.cameraAutoUpdate===!0&&q.updateCamera(P),P=q.getCamera()),M.isScene===!0&&M.onBeforeRender(A,M,P,N),d=te.get(M,b.length),d.init(P),b.push(d),Ot.multiplyMatrices(P.projectionMatrix,P.matrixWorldInverse),Q.setFromProjectionMatrix(Ot),bt=this.localClippingEnabled,ot=at.init(this.clippingPlanes,bt),v=yt.get(M,R.length),v.init(),R.push(v),q.enabled===!0&&q.isPresenting===!0){const G=A.xr.getDepthSensingMesh();G!==null&&m(G,P,-1/0,A.sortObjects)}m(M,P,0,A.sortObjects),v.finish(),A.sortObjects===!0&&v.sort(ft,Mt),Zt=q.enabled===!1||q.isPresenting===!1||q.hasDepthSensing()===!1,Zt&&Nt.addToRenderList(v,M),this.info.render.frame++,ot===!0&&at.beginShadows();const z=d.state.shadowsArray;Et.render(z,M,P),ot===!0&&at.endShadows(),this.info.autoReset===!0&&this.info.reset();const F=v.opaque,L=v.transmissive;if(d.setupLights(),P.isArrayCamera){const G=P.cameras;if(L.length>0)for(let rt=0,_t=G.length;rt<_t;rt++){const lt=G[rt];g(F,L,M,lt)}Zt&&Nt.render(M);for(let rt=0,_t=G.length;rt<_t;rt++){const lt=G[rt];l(v,M,lt,lt.viewport)}}else L.length>0&&g(F,L,M,P),Zt&&Nt.render(M),l(v,M,P);N!==null&&(C.updateMultisampleRenderTarget(N),C.updateRenderTargetMipmap(N)),M.isScene===!0&&M.onAfterRender(A,M,P),de.resetDefaultState(),w=-1,T=null,b.pop(),b.length>0?(d=b[b.length-1],ot===!0&&at.setGlobalState(A.clippingPlanes,d.state.camera)):d=null,R.pop(),R.length>0?v=R[R.length-1]:v=null};function m(M,P,z,F){if(M.visible===!1)return;if(M.layers.test(P.layers)){if(M.isGroup)z=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(P);else if(M.isLight)d.pushLight(M),M.castShadow&&d.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||Q.intersectsSprite(M)){F&&Vt.setFromMatrixPosition(M.matrixWorld).applyMatrix4(Ot);const rt=j.update(M),_t=M.material;_t.visible&&v.push(M,rt,_t,z,Vt.z,null)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||Q.intersectsObject(M))){const rt=j.update(M),_t=M.material;if(F&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Vt.copy(M.boundingSphere.center)):(rt.boundingSphere===null&&rt.computeBoundingSphere(),Vt.copy(rt.boundingSphere.center)),Vt.applyMatrix4(M.matrixWorld).applyMatrix4(Ot)),Array.isArray(_t)){const lt=rt.groups;for(let ct=0,ut=lt.length;ct<ut;ct++){const St=lt[ct],Wt=_t[St.materialIndex];Wt&&Wt.visible&&v.push(M,rt,Wt,z,Vt.z,St)}}else _t.visible&&v.push(M,rt,_t,z,Vt.z,null)}}const G=M.children;for(let rt=0,_t=G.length;rt<_t;rt++)m(G[rt],P,z,F)}function l(M,P,z,F){const L=M.opaque,G=M.transmissive,rt=M.transparent;d.setupLightsView(z),ot===!0&&at.setGlobalState(A.clippingPlanes,z),F&&Ut.viewport(U.copy(F)),L.length>0&&E(L,P,z),G.length>0&&E(G,P,z),rt.length>0&&E(rt,P,z),Ut.buffers.depth.setTest(!0),Ut.buffers.depth.setMask(!0),Ut.buffers.color.setMask(!0),Ut.setPolygonOffset(!1)}function g(M,P,z,F){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[F.id]===void 0&&(d.state.transmissionRenderTarget[F.id]=new oi(1,1,{generateMipmaps:!0,type:Qt.has("EXT_color_buffer_half_float")||Qt.has("EXT_color_buffer_float")?Er:wn,minFilter:ni,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:he.workingColorSpace}));const G=d.state.transmissionRenderTarget[F.id],rt=F.viewport||U;G.setSize(rt.z,rt.w);const _t=A.getRenderTarget();A.setRenderTarget(G),A.getClearColor(J),nt=A.getClearAlpha(),nt<1&&A.setClearColor(16777215,.5),A.clear(),Zt&&Nt.render(z);const lt=A.toneMapping;A.toneMapping=kn;const ct=F.viewport;if(F.viewport!==void 0&&(F.viewport=void 0),d.setupLightsView(F),ot===!0&&at.setGlobalState(A.clippingPlanes,F),E(M,z,F),C.updateMultisampleRenderTarget(G),C.updateRenderTargetMipmap(G),Qt.has("WEBGL_multisampled_render_to_texture")===!1){let ut=!1;for(let St=0,Wt=P.length;St<Wt;St++){const Jt=P[St],kt=Jt.object,ce=Jt.geometry,ae=Jt.material,Tt=Jt.group;if(ae.side===en&&kt.layers.test(F.layers)){const We=ae.side;ae.side=ze,ae.needsUpdate=!0,B(kt,z,F,ce,ae,Tt),ae.side=We,ae.needsUpdate=!0,ut=!0}}ut===!0&&(C.updateMultisampleRenderTarget(G),C.updateRenderTargetMipmap(G))}A.setRenderTarget(_t),A.setClearColor(J,nt),ct!==void 0&&(F.viewport=ct),A.toneMapping=lt}function E(M,P,z){const F=P.isScene===!0?P.overrideMaterial:null;for(let L=0,G=M.length;L<G;L++){const rt=M[L],_t=rt.object,lt=rt.geometry,ct=F===null?rt.material:F,ut=rt.group;_t.layers.test(z.layers)&&B(_t,P,z,lt,ct,ut)}}function B(M,P,z,F,L,G){M.onBeforeRender(A,P,z,F,L,G),M.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),L.onBeforeRender(A,P,z,F,M,G),L.transparent===!0&&L.side===en&&L.forceSinglePass===!1?(L.side=ze,L.needsUpdate=!0,A.renderBufferDirect(z,P,F,L,M,G),L.side=Gn,L.needsUpdate=!0,A.renderBufferDirect(z,P,F,L,M,G),L.side=en):A.renderBufferDirect(z,P,F,L,M,G),M.onAfterRender(A,P,z,F,L,G)}function K(M,P,z){P.isScene!==!0&&(P=_e);const F=Ct.get(M),L=d.state.lights,G=d.state.shadowsArray,rt=L.state.version,_t=Pt.getParameters(M,L.state,G,P,z),lt=Pt.getProgramCacheKey(_t);let ct=F.programs;F.environment=M.isMeshStandardMaterial?P.environment:null,F.fog=P.fog,F.envMap=(M.isMeshStandardMaterial?W:S).get(M.envMap||F.environment),F.envMapRotation=F.environment!==null&&M.envMap===null?P.environmentRotation:M.envMapRotation,ct===void 0&&(M.addEventListener("dispose",Bt),ct=new Map,F.programs=ct);let ut=ct.get(lt);if(ut!==void 0){if(F.currentProgram===ut&&F.lightsStateVersion===rt)return wt(M,_t),ut}else _t.uniforms=Pt.getUniforms(M),M.onBeforeCompile(_t,A),ut=Pt.acquireProgram(_t,lt),ct.set(lt,ut),F.uniforms=_t.uniforms;const St=F.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(St.clippingPlanes=at.uniform),wt(M,_t),F.needsLights=Lt(M),F.lightsStateVersion=rt,F.needsLights&&(St.ambientLightColor.value=L.state.ambient,St.lightProbe.value=L.state.probe,St.directionalLights.value=L.state.directional,St.directionalLightShadows.value=L.state.directionalShadow,St.spotLights.value=L.state.spot,St.spotLightShadows.value=L.state.spotShadow,St.rectAreaLights.value=L.state.rectArea,St.ltc_1.value=L.state.rectAreaLTC1,St.ltc_2.value=L.state.rectAreaLTC2,St.pointLights.value=L.state.point,St.pointLightShadows.value=L.state.pointShadow,St.hemisphereLights.value=L.state.hemi,St.directionalShadowMap.value=L.state.directionalShadowMap,St.directionalShadowMatrix.value=L.state.directionalShadowMatrix,St.spotShadowMap.value=L.state.spotShadowMap,St.spotLightMatrix.value=L.state.spotLightMatrix,St.spotLightMap.value=L.state.spotLightMap,St.pointShadowMap.value=L.state.pointShadowMap,St.pointShadowMatrix.value=L.state.pointShadowMatrix),F.currentProgram=ut,F.uniformsList=null,ut}function It(M){if(M.uniformsList===null){const P=M.currentProgram.getUniforms();M.uniformsList=os.seqWithValue(P.seq,M.uniforms)}return M.uniformsList}function wt(M,P){const z=Ct.get(M);z.outputColorSpace=P.outputColorSpace,z.batching=P.batching,z.batchingColor=P.batchingColor,z.instancing=P.instancing,z.instancingColor=P.instancingColor,z.instancingMorph=P.instancingMorph,z.skinning=P.skinning,z.morphTargets=P.morphTargets,z.morphNormals=P.morphNormals,z.morphColors=P.morphColors,z.morphTargetsCount=P.morphTargetsCount,z.numClippingPlanes=P.numClippingPlanes,z.numIntersection=P.numClipIntersection,z.vertexAlphas=P.vertexAlphas,z.vertexTangents=P.vertexTangents,z.toneMapping=P.toneMapping}function ee(M,P,z,F,L){P.isScene!==!0&&(P=_e),C.resetTextureUnits();const G=P.fog,rt=F.isMeshStandardMaterial?P.environment:null,_t=N===null?A.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:Ji,lt=(F.isMeshStandardMaterial?W:S).get(F.envMap||rt),ct=F.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,ut=!!z.attributes.tangent&&(!!F.normalMap||F.anisotropy>0),St=!!z.morphAttributes.position,Wt=!!z.morphAttributes.normal,Jt=!!z.morphAttributes.color;let kt=kn;F.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(kt=A.toneMapping);const ce=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,ae=ce!==void 0?ce.length:0,Tt=Ct.get(F),We=d.state.lights;if(ot===!0&&(bt===!0||M!==T)){const Ke=M===T&&F.id===w;at.setState(F,M,Ke)}let Kt=!1;F.version===Tt.__version?(Tt.needsLights&&Tt.lightsStateVersion!==We.state.version||Tt.outputColorSpace!==_t||L.isBatchedMesh&&Tt.batching===!1||!L.isBatchedMesh&&Tt.batching===!0||L.isBatchedMesh&&Tt.batchingColor===!0&&L.colorTexture===null||L.isBatchedMesh&&Tt.batchingColor===!1&&L.colorTexture!==null||L.isInstancedMesh&&Tt.instancing===!1||!L.isInstancedMesh&&Tt.instancing===!0||L.isSkinnedMesh&&Tt.skinning===!1||!L.isSkinnedMesh&&Tt.skinning===!0||L.isInstancedMesh&&Tt.instancingColor===!0&&L.instanceColor===null||L.isInstancedMesh&&Tt.instancingColor===!1&&L.instanceColor!==null||L.isInstancedMesh&&Tt.instancingMorph===!0&&L.morphTexture===null||L.isInstancedMesh&&Tt.instancingMorph===!1&&L.morphTexture!==null||Tt.envMap!==lt||F.fog===!0&&Tt.fog!==G||Tt.numClippingPlanes!==void 0&&(Tt.numClippingPlanes!==at.numPlanes||Tt.numIntersection!==at.numIntersection)||Tt.vertexAlphas!==ct||Tt.vertexTangents!==ut||Tt.morphTargets!==St||Tt.morphNormals!==Wt||Tt.morphColors!==Jt||Tt.toneMapping!==kt||Tt.morphTargetsCount!==ae)&&(Kt=!0):(Kt=!0,Tt.__version=F.version);let Ie=Tt.currentProgram;Kt===!0&&(Ie=K(F,P,L));let fi=!1,$e=!1,nr=!1;const ve=Ie.getUniforms(),un=Tt.uniforms;if(Ut.useProgram(Ie.program)&&(fi=!0,$e=!0,nr=!0),F.id!==w&&(w=F.id,$e=!0),fi||T!==M){Ut.buffers.depth.getReversed()?(pt.copy(M.projectionMatrix),uu(pt),fu(pt),ve.setValue(k,"projectionMatrix",pt)):ve.setValue(k,"projectionMatrix",M.projectionMatrix),ve.setValue(k,"viewMatrix",M.matrixWorldInverse);const bn=ve.map.cameraPosition;bn!==void 0&&bn.setValue(k,Ft.setFromMatrixPosition(M.matrixWorld)),qt.logarithmicDepthBuffer&&ve.setValue(k,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(F.isMeshPhongMaterial||F.isMeshToonMaterial||F.isMeshLambertMaterial||F.isMeshBasicMaterial||F.isMeshStandardMaterial||F.isShaderMaterial)&&ve.setValue(k,"isOrthographic",M.isOrthographicCamera===!0),T!==M&&(T=M,$e=!0,nr=!0)}if(L.isSkinnedMesh){ve.setOptional(k,L,"bindMatrix"),ve.setOptional(k,L,"bindMatrixInverse");const Ke=L.skeleton;Ke&&(Ke.boneTexture===null&&Ke.computeBoneTexture(),ve.setValue(k,"boneTexture",Ke.boneTexture,C))}L.isBatchedMesh&&(ve.setOptional(k,L,"batchingTexture"),ve.setValue(k,"batchingTexture",L._matricesTexture,C),ve.setOptional(k,L,"batchingIdTexture"),ve.setValue(k,"batchingIdTexture",L._indirectTexture,C),ve.setOptional(k,L,"batchingColorTexture"),L._colorsTexture!==null&&ve.setValue(k,"batchingColorTexture",L._colorsTexture,C));const ir=z.morphAttributes;if((ir.position!==void 0||ir.normal!==void 0||ir.color!==void 0)&&Dt.update(L,z,Ie),($e||Tt.receiveShadow!==L.receiveShadow)&&(Tt.receiveShadow=L.receiveShadow,ve.setValue(k,"receiveShadow",L.receiveShadow)),F.isMeshGouraudMaterial&&F.envMap!==null&&(un.envMap.value=lt,un.flipEnvMap.value=lt.isCubeTexture&&lt.isRenderTargetTexture===!1?-1:1),F.isMeshStandardMaterial&&F.envMap===null&&P.environment!==null&&(un.envMapIntensity.value=P.environmentIntensity),$e&&(ve.setValue(k,"toneMappingExposure",A.toneMappingExposure),Tt.needsLights&&jt(un,nr),G&&F.fog===!0&&mt.refreshFogUniforms(un,G),mt.refreshMaterialUniforms(un,F,Y,tt,d.state.transmissionRenderTarget[M.id]),os.upload(k,It(Tt),un,C)),F.isShaderMaterial&&F.uniformsNeedUpdate===!0&&(os.upload(k,It(Tt),un,C),F.uniformsNeedUpdate=!1),F.isSpriteMaterial&&ve.setValue(k,"center",L.center),ve.setValue(k,"modelViewMatrix",L.modelViewMatrix),ve.setValue(k,"normalMatrix",L.normalMatrix),ve.setValue(k,"modelMatrix",L.matrixWorld),F.isShaderMaterial||F.isRawShaderMaterial){const Ke=F.uniformsGroups;for(let bn=0,Rn=Ke.length;bn<Rn;bn++){const yo=Ke[bn];O.update(yo,Ie),O.bind(yo,Ie)}}return Ie}function jt(M,P){M.ambientLightColor.needsUpdate=P,M.lightProbe.needsUpdate=P,M.directionalLights.needsUpdate=P,M.directionalLightShadows.needsUpdate=P,M.pointLights.needsUpdate=P,M.pointLightShadows.needsUpdate=P,M.spotLights.needsUpdate=P,M.spotLightShadows.needsUpdate=P,M.rectAreaLights.needsUpdate=P,M.hemisphereLights.needsUpdate=P}function Lt(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return D},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(M,P,z){Ct.get(M.texture).__webglTexture=P,Ct.get(M.depthTexture).__webglTexture=z;const F=Ct.get(M);F.__hasExternalTextures=!0,F.__autoAllocateDepthBuffer=z===void 0,F.__autoAllocateDepthBuffer||Qt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),F.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(M,P){const z=Ct.get(M);z.__webglFramebuffer=P,z.__useDefaultFramebuffer=P===void 0},this.setRenderTarget=function(M,P=0,z=0){N=M,D=P,I=z;let F=!0,L=null,G=!1,rt=!1;if(M){const lt=Ct.get(M);if(lt.__useDefaultFramebuffer!==void 0)Ut.bindFramebuffer(k.FRAMEBUFFER,null),F=!1;else if(lt.__webglFramebuffer===void 0)C.setupRenderTarget(M);else if(lt.__hasExternalTextures)C.rebindTextures(M,Ct.get(M.texture).__webglTexture,Ct.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){const St=M.depthTexture;if(lt.__boundDepthTexture!==St){if(St!==null&&Ct.has(St)&&(M.width!==St.image.width||M.height!==St.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");C.setupDepthRenderbuffer(M)}}const ct=M.texture;(ct.isData3DTexture||ct.isDataArrayTexture||ct.isCompressedArrayTexture)&&(rt=!0);const ut=Ct.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(ut[P])?L=ut[P][z]:L=ut[P],G=!0):M.samples>0&&C.useMultisampledRTT(M)===!1?L=Ct.get(M).__webglMultisampledFramebuffer:Array.isArray(ut)?L=ut[z]:L=ut,U.copy(M.viewport),$.copy(M.scissor),X=M.scissorTest}else U.copy(Rt).multiplyScalar(Y).floor(),$.copy(Xt).multiplyScalar(Y).floor(),X=ue;if(Ut.bindFramebuffer(k.FRAMEBUFFER,L)&&F&&Ut.drawBuffers(M,L),Ut.viewport(U),Ut.scissor($),Ut.setScissorTest(X),G){const lt=Ct.get(M.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+P,lt.__webglTexture,z)}else if(rt){const lt=Ct.get(M.texture),ct=P||0;k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,lt.__webglTexture,z||0,ct)}w=-1},this.readRenderTargetPixels=function(M,P,z,F,L,G,rt){if(!(M&&M.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let _t=Ct.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&rt!==void 0&&(_t=_t[rt]),_t){Ut.bindFramebuffer(k.FRAMEBUFFER,_t);try{const lt=M.texture,ct=lt.format,ut=lt.type;if(!qt.textureFormatReadable(ct)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!qt.textureTypeReadable(ut)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}P>=0&&P<=M.width-F&&z>=0&&z<=M.height-L&&k.readPixels(P,z,F,L,zt.convert(ct),zt.convert(ut),G)}finally{const lt=N!==null?Ct.get(N).__webglFramebuffer:null;Ut.bindFramebuffer(k.FRAMEBUFFER,lt)}}},this.readRenderTargetPixelsAsync=async function(M,P,z,F,L,G,rt){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let _t=Ct.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&rt!==void 0&&(_t=_t[rt]),_t){const lt=M.texture,ct=lt.format,ut=lt.type;if(!qt.textureFormatReadable(ct))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!qt.textureTypeReadable(ut))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(P>=0&&P<=M.width-F&&z>=0&&z<=M.height-L){Ut.bindFramebuffer(k.FRAMEBUFFER,_t);const St=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,St),k.bufferData(k.PIXEL_PACK_BUFFER,G.byteLength,k.STREAM_READ),k.readPixels(P,z,F,L,zt.convert(ct),zt.convert(ut),0);const Wt=N!==null?Ct.get(N).__webglFramebuffer:null;Ut.bindFramebuffer(k.FRAMEBUFFER,Wt);const Jt=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await hu(k,Jt,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,St),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,G),k.deleteBuffer(St),k.deleteSync(Jt),G}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(M,P=null,z=0){M.isTexture!==!0&&(gr("WebGLRenderer: copyFramebufferToTexture function signature has changed."),P=arguments[0]||null,M=arguments[1]);const F=Math.pow(2,-z),L=Math.floor(M.image.width*F),G=Math.floor(M.image.height*F),rt=P!==null?P.x:0,_t=P!==null?P.y:0;C.setTexture2D(M,0),k.copyTexSubImage2D(k.TEXTURE_2D,z,0,0,rt,_t,L,G),Ut.unbindTexture()},this.copyTextureToTexture=function(M,P,z=null,F=null,L=0){M.isTexture!==!0&&(gr("WebGLRenderer: copyTextureToTexture function signature has changed."),F=arguments[0]||null,M=arguments[1],P=arguments[2],L=arguments[3]||0,z=null);let G,rt,_t,lt,ct,ut,St,Wt,Jt;const kt=M.isCompressedTexture?M.mipmaps[L]:M.image;z!==null?(G=z.max.x-z.min.x,rt=z.max.y-z.min.y,_t=z.isBox3?z.max.z-z.min.z:1,lt=z.min.x,ct=z.min.y,ut=z.isBox3?z.min.z:0):(G=kt.width,rt=kt.height,_t=kt.depth||1,lt=0,ct=0,ut=0),F!==null?(St=F.x,Wt=F.y,Jt=F.z):(St=0,Wt=0,Jt=0);const ce=zt.convert(P.format),ae=zt.convert(P.type);let Tt;P.isData3DTexture?(C.setTexture3D(P,0),Tt=k.TEXTURE_3D):P.isDataArrayTexture||P.isCompressedArrayTexture?(C.setTexture2DArray(P,0),Tt=k.TEXTURE_2D_ARRAY):(C.setTexture2D(P,0),Tt=k.TEXTURE_2D),k.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,P.flipY),k.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),k.pixelStorei(k.UNPACK_ALIGNMENT,P.unpackAlignment);const We=k.getParameter(k.UNPACK_ROW_LENGTH),Kt=k.getParameter(k.UNPACK_IMAGE_HEIGHT),Ie=k.getParameter(k.UNPACK_SKIP_PIXELS),fi=k.getParameter(k.UNPACK_SKIP_ROWS),$e=k.getParameter(k.UNPACK_SKIP_IMAGES);k.pixelStorei(k.UNPACK_ROW_LENGTH,kt.width),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,kt.height),k.pixelStorei(k.UNPACK_SKIP_PIXELS,lt),k.pixelStorei(k.UNPACK_SKIP_ROWS,ct),k.pixelStorei(k.UNPACK_SKIP_IMAGES,ut);const nr=M.isDataArrayTexture||M.isData3DTexture,ve=P.isDataArrayTexture||P.isData3DTexture;if(M.isRenderTargetTexture||M.isDepthTexture){const un=Ct.get(M),ir=Ct.get(P),Ke=Ct.get(un.__renderTarget),bn=Ct.get(ir.__renderTarget);Ut.bindFramebuffer(k.READ_FRAMEBUFFER,Ke.__webglFramebuffer),Ut.bindFramebuffer(k.DRAW_FRAMEBUFFER,bn.__webglFramebuffer);for(let Rn=0;Rn<_t;Rn++)nr&&k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Ct.get(M).__webglTexture,L,ut+Rn),M.isDepthTexture?(ve&&k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Ct.get(P).__webglTexture,L,Jt+Rn),k.blitFramebuffer(lt,ct,G,rt,St,Wt,G,rt,k.DEPTH_BUFFER_BIT,k.NEAREST)):ve?k.copyTexSubImage3D(Tt,L,St,Wt,Jt+Rn,lt,ct,G,rt):k.copyTexSubImage2D(Tt,L,St,Wt,Jt+Rn,lt,ct,G,rt);Ut.bindFramebuffer(k.READ_FRAMEBUFFER,null),Ut.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else ve?M.isDataTexture||M.isData3DTexture?k.texSubImage3D(Tt,L,St,Wt,Jt,G,rt,_t,ce,ae,kt.data):P.isCompressedArrayTexture?k.compressedTexSubImage3D(Tt,L,St,Wt,Jt,G,rt,_t,ce,kt.data):k.texSubImage3D(Tt,L,St,Wt,Jt,G,rt,_t,ce,ae,kt):M.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,L,St,Wt,G,rt,ce,ae,kt.data):M.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,L,St,Wt,kt.width,kt.height,ce,kt.data):k.texSubImage2D(k.TEXTURE_2D,L,St,Wt,G,rt,ce,ae,kt);k.pixelStorei(k.UNPACK_ROW_LENGTH,We),k.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Kt),k.pixelStorei(k.UNPACK_SKIP_PIXELS,Ie),k.pixelStorei(k.UNPACK_SKIP_ROWS,fi),k.pixelStorei(k.UNPACK_SKIP_IMAGES,$e),L===0&&P.generateMipmaps&&k.generateMipmap(Tt),Ut.unbindTexture()},this.copyTextureToTexture3D=function(M,P,z=null,F=null,L=0){return M.isTexture!==!0&&(gr("WebGLRenderer: copyTextureToTexture3D function signature has changed."),z=arguments[0]||null,F=arguments[1]||null,M=arguments[2],P=arguments[3],L=arguments[4]||0),gr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(M,P,z,F,L)},this.initRenderTarget=function(M){Ct.get(M).__webglFramebuffer===void 0&&C.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?C.setTextureCube(M,0):M.isData3DTexture?C.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?C.setTexture2DArray(M,0):C.setTexture2D(M,0),Ut.unbindTexture()},this.resetState=function(){D=0,I=0,N=null,Ut.reset(),de.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Tn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorspace=he._getDrawingBufferColorSpace(t),e.unpackColorSpace=he._getUnpackColorSpace()}}class _o{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new ne(t),this.near=e,this.far=n}clone(){return new _o(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Tg extends Te{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new hn,this.environmentIntensity=1,this.environmentRotation=new hn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class Ag{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Za,this.updateRanges=[],this.version=0,this.uuid=Hn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let r=0,s=this.stride;r<s;r++)this.array[t+r]=e.array[n+r];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Hn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Hn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Fe=new V;class ds{constructor(t,e,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyMatrix4(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyNormalMatrix(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.transformDirection(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=pn(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=me(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=me(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=pn(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=pn(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=pn(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=pn(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),n=me(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),n=me(n,this.array),r=me(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=me(e,this.array),n=me(n,this.array),r=me(r,this.array),s=me(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=r,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[r+s])}return new rn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ds(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class vl extends li{static get type(){return"SpriteMaterial"}constructor(t){super(),this.isSpriteMaterial=!0,this.color=new ne(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Ri;const hr=new V,Ci=new V,Pi=new V,Ii=new Ht,ur=new Ht,xl=new ge,jr=new V,fr=new V,Kr=new V,wc=new Ht,oa=new Ht,bc=new Ht;class wg extends Te{constructor(t=new vl){if(super(),this.isSprite=!0,this.type="Sprite",Ri===void 0){Ri=new ke;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Ag(e,5);Ri.setIndex([0,1,2,0,2,3]),Ri.setAttribute("position",new ds(n,3,0,!1)),Ri.setAttribute("uv",new ds(n,2,3,!1))}this.geometry=Ri,this.material=t,this.center=new Ht(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Ci.setFromMatrixScale(this.matrixWorld),xl.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),Pi.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Ci.multiplyScalar(-Pi.z);const n=this.material.rotation;let r,s;n!==0&&(s=Math.cos(n),r=Math.sin(n));const a=this.center;Zr(jr.set(-.5,-.5,0),Pi,a,Ci,r,s),Zr(fr.set(.5,-.5,0),Pi,a,Ci,r,s),Zr(Kr.set(.5,.5,0),Pi,a,Ci,r,s),wc.set(0,0),oa.set(1,0),bc.set(1,1);let o=t.ray.intersectTriangle(jr,fr,Kr,!1,hr);if(o===null&&(Zr(fr.set(-.5,.5,0),Pi,a,Ci,r,s),oa.set(0,1),o=t.ray.intersectTriangle(jr,Kr,fr,!1,hr),o===null))return;const c=t.ray.origin.distanceTo(hr);c<t.near||c>t.far||e.push({distance:c,point:hr.clone(),uv:nn.getInterpolation(hr,jr,fr,Kr,wc,oa,bc,new Ht),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Zr(i,t,e,n,r,s){Ii.subVectors(i,e).addScalar(.5).multiply(n),r!==void 0?(ur.x=s*Ii.x-r*Ii.y,ur.y=r*Ii.x+s*Ii.y):ur.copy(Ii),i.copy(t),i.x+=ur.x,i.y+=ur.y,i.applyMatrix4(xl)}class bg extends Oe{constructor(t=null,e=1,n=1,r,s,a,o,c,h=je,u=je,f,p){super(null,a,o,c,h,u,r,s,f,p),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Rc extends rn{constructor(t,e,n,r=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Li=new ge,Cc=new ge,Jr=[],Pc=new ci,Rg=new ge,dr=new oe,pr=new Ar;class to extends oe{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Rc(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<n;r++)this.setMatrixAt(r,Rg)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new ci),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Li),Pc.copy(t.boundingBox).applyMatrix4(Li),this.boundingBox.union(Pc)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ar),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Li),pr.copy(t.boundingSphere).applyMatrix4(Li),this.boundingSphere.union(pr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,r=this.morphTexture.source.data.data,s=n.length+1,a=t*s+1;for(let o=0;o<n.length;o++)n[o]=r[a+o]}raycast(t,e){const n=this.matrixWorld,r=this.count;if(dr.geometry=this.geometry,dr.material=this.material,dr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),pr.copy(this.boundingSphere),pr.applyMatrix4(n),t.ray.intersectsSphere(pr)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,Li),Cc.multiplyMatrices(n,Li),dr.matrixWorld=Cc,dr.raycast(t,Jr);for(let a=0,o=Jr.length;a<o;a++){const c=Jr[a];c.instanceId=s,c.object=this,e.push(c)}Jr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Rc(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){const n=e.morphTargetInfluences,r=n.length+1;this.morphTexture===null&&(this.morphTexture=new bg(new Float32Array(r*this.count),r,this.count,lo,gn));const s=this.morphTexture.source.data.data;let a=0;for(let h=0;h<n.length;h++)a+=n[h];const o=this.geometry.morphTargetsRelative?1:1-a,c=r*t;s[c]=o,s.set(n,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}}class vo extends Oe{constructor(t,e,n,r,s,a,o,c,h){super(t,e,n,r,s,a,o,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}}class ps extends ke{constructor(t=1,e=32,n=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:r},e=Math.max(3,e);const s=[],a=[],o=[],c=[],h=new V,u=new Ht;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let f=0,p=3;f<=e;f++,p+=3){const _=n+f/e*r;h.x=t*Math.cos(_),h.y=t*Math.sin(_),a.push(h.x,h.y,h.z),o.push(0,0,1),u.x=(a[p]/t+1)/2,u.y=(a[p+1]/t+1)/2,c.push(u.x,u.y)}for(let f=1;f<=e;f++)s.push(f,f+1,0);this.setIndex(s),this.setAttribute("position",new Me(a,3)),this.setAttribute("normal",new Me(o,3)),this.setAttribute("uv",new Me(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ps(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class ii extends ke{constructor(t=1,e=1,n=1,r=32,s=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:c};const h=this;r=Math.floor(r),s=Math.floor(s);const u=[],f=[],p=[],_=[];let x=0;const y=[],v=n/2;let d=0;R(),a===!1&&(t>0&&b(!0),e>0&&b(!1)),this.setIndex(u),this.setAttribute("position",new Me(f,3)),this.setAttribute("normal",new Me(p,3)),this.setAttribute("uv",new Me(_,2));function R(){const A=new V,H=new V;let D=0;const I=(e-t)/n;for(let N=0;N<=s;N++){const w=[],T=N/s,U=T*(e-t)+t;for(let $=0;$<=r;$++){const X=$/r,J=X*c+o,nt=Math.sin(J),Z=Math.cos(J);H.x=U*nt,H.y=-T*n+v,H.z=U*Z,f.push(H.x,H.y,H.z),A.set(nt,I,Z).normalize(),p.push(A.x,A.y,A.z),_.push(X,1-T),w.push(x++)}y.push(w)}for(let N=0;N<r;N++)for(let w=0;w<s;w++){const T=y[w][N],U=y[w+1][N],$=y[w+1][N+1],X=y[w][N+1];(t>0||w!==0)&&(u.push(T,U,X),D+=3),(e>0||w!==s-1)&&(u.push(U,$,X),D+=3)}h.addGroup(d,D,0),d+=D}function b(A){const H=x,D=new Ht,I=new V;let N=0;const w=A===!0?t:e,T=A===!0?1:-1;for(let $=1;$<=r;$++)f.push(0,v*T,0),p.push(0,T,0),_.push(.5,.5),x++;const U=x;for(let $=0;$<=r;$++){const J=$/r*c+o,nt=Math.cos(J),Z=Math.sin(J);I.x=w*Z,I.y=v*T,I.z=w*nt,f.push(I.x,I.y,I.z),p.push(0,T,0),D.x=nt*.5+.5,D.y=Z*.5*T+.5,_.push(D.x,D.y),x++}for(let $=0;$<r;$++){const X=H+$,J=U+$;A===!0?u.push(J,J+1,X):u.push(J+1,J,X),N+=3}h.addGroup(d,N,A===!0?1:2),d+=N}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ii(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Oi extends ii{constructor(t=1,e=1,n=32,r=1,s=!1,a=0,o=Math.PI*2){super(0,t,e,n,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Oi(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class xo extends ke{constructor(t=[],e=[],n=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:r};const s=[],a=[];o(r),h(n),u(),this.setAttribute("position",new Me(s,3)),this.setAttribute("normal",new Me(s.slice(),3)),this.setAttribute("uv",new Me(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(R){const b=new V,A=new V,H=new V;for(let D=0;D<e.length;D+=3)_(e[D+0],b),_(e[D+1],A),_(e[D+2],H),c(b,A,H,R)}function c(R,b,A,H){const D=H+1,I=[];for(let N=0;N<=D;N++){I[N]=[];const w=R.clone().lerp(A,N/D),T=b.clone().lerp(A,N/D),U=D-N;for(let $=0;$<=U;$++)$===0&&N===D?I[N][$]=w:I[N][$]=w.clone().lerp(T,$/U)}for(let N=0;N<D;N++)for(let w=0;w<2*(D-N)-1;w++){const T=Math.floor(w/2);w%2===0?(p(I[N][T+1]),p(I[N+1][T]),p(I[N][T])):(p(I[N][T+1]),p(I[N+1][T+1]),p(I[N+1][T]))}}function h(R){const b=new V;for(let A=0;A<s.length;A+=3)b.x=s[A+0],b.y=s[A+1],b.z=s[A+2],b.normalize().multiplyScalar(R),s[A+0]=b.x,s[A+1]=b.y,s[A+2]=b.z}function u(){const R=new V;for(let b=0;b<s.length;b+=3){R.x=s[b+0],R.y=s[b+1],R.z=s[b+2];const A=v(R)/2/Math.PI+.5,H=d(R)/Math.PI+.5;a.push(A,1-H)}x(),f()}function f(){for(let R=0;R<a.length;R+=6){const b=a[R+0],A=a[R+2],H=a[R+4],D=Math.max(b,A,H),I=Math.min(b,A,H);D>.9&&I<.1&&(b<.2&&(a[R+0]+=1),A<.2&&(a[R+2]+=1),H<.2&&(a[R+4]+=1))}}function p(R){s.push(R.x,R.y,R.z)}function _(R,b){const A=R*3;b.x=t[A+0],b.y=t[A+1],b.z=t[A+2]}function x(){const R=new V,b=new V,A=new V,H=new V,D=new Ht,I=new Ht,N=new Ht;for(let w=0,T=0;w<s.length;w+=9,T+=6){R.set(s[w+0],s[w+1],s[w+2]),b.set(s[w+3],s[w+4],s[w+5]),A.set(s[w+6],s[w+7],s[w+8]),D.set(a[T+0],a[T+1]),I.set(a[T+2],a[T+3]),N.set(a[T+4],a[T+5]),H.copy(R).add(b).add(A).divideScalar(3);const U=v(H);y(D,T+0,R,U),y(I,T+2,b,U),y(N,T+4,A,U)}}function y(R,b,A,H){H<0&&R.x===1&&(a[b]=R.x-1),A.x===0&&A.z===0&&(a[b]=H/2/Math.PI+.5)}function v(R){return Math.atan2(R.z,-R.x)}function d(R){return Math.atan2(-R.y,Math.sqrt(R.x*R.x+R.z*R.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new xo(t.vertices,t.indices,t.radius,t.details)}}class Mo extends xo{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],r=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,r,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Mo(t.radius,t.detail)}}class ki extends ke{constructor(t=1,e=32,n=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let h=0;const u=[],f=new V,p=new V,_=[],x=[],y=[],v=[];for(let d=0;d<=n;d++){const R=[],b=d/n;let A=0;d===0&&a===0?A=.5/e:d===n&&c===Math.PI&&(A=-.5/e);for(let H=0;H<=e;H++){const D=H/e;f.x=-t*Math.cos(r+D*s)*Math.sin(a+b*o),f.y=t*Math.cos(a+b*o),f.z=t*Math.sin(r+D*s)*Math.sin(a+b*o),x.push(f.x,f.y,f.z),p.copy(f).normalize(),y.push(p.x,p.y,p.z),v.push(D+A,1-b),R.push(h++)}u.push(R)}for(let d=0;d<n;d++)for(let R=0;R<e;R++){const b=u[d][R+1],A=u[d][R],H=u[d+1][R],D=u[d+1][R+1];(d!==0||a>0)&&_.push(b,A,D),(d!==n-1||c<Math.PI)&&_.push(A,H,D)}this.setIndex(_),this.setAttribute("position",new Me(x,3)),this.setAttribute("normal",new Me(y,3)),this.setAttribute("uv",new Me(v,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ki(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Di extends li{static get type(){return"MeshStandardMaterial"}constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.color=new ne(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=po,this.normalScale=new Ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Je extends li{static get type(){return"MeshLambertMaterial"}constructor(t){super(),this.isMeshLambertMaterial=!0,this.color=new ne(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ne(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=po,this.normalScale=new Ht(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new hn,this.combine=so,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ml extends Te{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new ne(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}}class Cg extends Ml{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Te.DEFAULT_UP),this.updateMatrix(),this.groundColor=new ne(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const ca=new ge,Ic=new V,Lc=new V;class Pg{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ht(512,512),this.map=null,this.mapPass=null,this.matrix=new ge,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new mo,this._frameExtents=new Ht(1,1),this._viewportCount=1,this._viewports=[new Se(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Ic.setFromMatrixPosition(t.matrixWorld),e.position.copy(Ic),Lc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Lc),e.updateMatrixWorld(),ca.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(ca),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(ca)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Ig extends Pg{constructor(){super(new fl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Dc extends Ml{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Te.DEFAULT_UP),this.updateMatrix(),this.target=new Te,this.shadow=new Ig}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class Lg{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Uc(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const e=Uc();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}}function Uc(){return performance.now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ro}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ro);function Dg(i,t){const e=[0];for(let n=0;n<i.length;n++){const r=i[n],s=i[(n+1)%i.length];e.push(e[n]+Math.hypot(s[0]-r[0],s[1]-r[1]))}return{points:i,width:t,cum:e,total:e[i.length]}}function cs(i,t,e){let n={s:0,lateral:0,d2:1/0};for(let s=0;s<i.points.length;s++){const a=i.points[s],o=i.points[(s+1)%i.points.length],c=o[0]-a[0],h=o[1]-a[1],u=c*c+h*h;if(u===0)continue;let f=((t-a[0])*c+(e-a[1])*h)/u;f=f<0?0:f>1?1:f;const p=a[0]+c*f,_=a[1]+h*f,x=t-p,y=e-_,v=x*x+y*y;if(v<n.d2){const d=Math.sqrt(u),R=(c*y-h*x)/d;n={s:i.cum[s]+d*f,lateral:R,d2:v}}}return{s:(n.s%i.total+i.total)%i.total,lateral:n.lateral,offTrack:Math.abs(n.lateral)>i.width/2}}function vr(i,t){const e=(t%i.total+i.total)%i.total;let n=0,r=i.points.length-1;for(;n<r;){const h=n+r+1>>1;i.cum[h]<=e?n=h:r=h-1}const s=i.points[n],a=i.points[(n+1)%i.points.length],o=i.cum[n+1]-i.cum[n]||1,c=(e-i.cum[n])/o;return{x:s[0]+(a[0]-s[0])*c,y:s[1]+(a[1]-s[1])*c,angle:Math.atan2(a[1]-s[1],a[0]-s[0])}}const le={maxSpeed:520,accel:520,brake:880,drag:240,turnRate:2.6,lowSpeedTurn:.5,steerRampUp:5.2,steerRampDown:11,steerCapAtTop:.62,driftTurnMul:2.1,driftSteerEnter:.3,driftMinTurn:.55,driftGripLoss:.032,driftMinSpeed:200,driftTiers:[{need:.5,mul:1.3,ms:900,color:6734591},{need:1.1,mul:1.5,ms:1450,color:16747069},{need:1.8,mul:1.72,ms:2100,color:16731501}],assistRate:2.2,assistMaxAngle:1,assistWhileSteering:.6,radius:42,stunSpin:5.4,stunDecel:620,stunGlide:150},mr=(i,t,e)=>i<t?t:i>e?e:i;function Ug(i,t,e){const r=Math.abs(t)<Math.abs(i)||t*i<0?le.steerRampDown:le.steerRampUp,s=t-i,a=r*e;return Math.abs(s)<=a?t:i+Math.sign(s)*a}function Ng(i,t,e,n){if(n.stunned){i.speed>le.stunGlide?i.speed-=le.stunDecel*e:i.speed<le.stunGlide&&(i.speed=Math.min(le.stunGlide,i.speed+le.accel*e)),i.heading+=le.stunSpin*e,i.drifting=!1,i.driftCharge=0,i.steerActual=0,i.x+=Math.cos(i.heading)*i.speed*e,i.y+=Math.sin(i.heading)*i.speed*e;return}const r=le.maxSpeed*n.speedMul*1;if(t.throttle>0)i.speed+=le.accel*e;else if(t.throttle<0)i.speed-=le.brake*e;else{const x=le.drag*e;i.speed=i.speed>0?Math.max(0,i.speed-x):Math.min(0,i.speed+x)}i.speed=mr(i.speed,-250,Math.max(r,0));const s=mr(Math.abs(i.speed)/le.maxSpeed,0,1),a=1-(1-le.steerCapAtTop)*s,o=mr(t.steer,-1,1)*(t.drift?1:a);i.steerActual=Ug(i.steerActual,o,e);const c=Math.abs(i.speed)>le.driftMinSpeed,h=Math.abs(i.steerActual)>le.driftSteerEnter;i.drifting=t.drift&&c&&h;let u=i.steerActual;i.drifting&&(u=(i.steerActual>=0?1:-1)*Math.max(Math.abs(i.steerActual),le.driftMinTurn));const f=mr(Math.abs(i.speed)/le.maxSpeed,0,1),p=i.speed>=0?1:-1,_=u*le.turnRate*(le.lowSpeedTurn+(1-le.lowSpeedTurn)*f)*(i.drifting?le.driftTurnMul:1)*p;if(i.heading+=_*e,i.drifting&&(i.driftCharge+=e,i.speed*=1-le.driftGripLoss*e*3),n.trackAngle!==void 0&&!i.drifting&&Math.abs(i.speed)>90){let x=n.trackAngle-i.heading;for(;x>Math.PI;)x-=Math.PI*2;for(;x<-Math.PI;)x+=Math.PI*2;if(Math.abs(x)<le.assistMaxAngle){const v=Math.abs(i.steerActual)>.15?le.assistWhileSteering:1;i.heading+=mr(x,-1,1)*le.assistRate*v*f*e}}i.x+=Math.cos(i.heading)*i.speed*e,i.y+=Math.sin(i.heading)*i.speed*e}const ls={margin:10,slideAlign:.3,speedKeep:.93,minSlideSpeed:60};function Og(i){return i.width/2-le.radius-ls.margin}function Nc(i,t,e){const n=Og(i),r=cs(i,t.x,t.y);if(Math.abs(r.lateral)<=n)return!1;const s=r.lateral>=0?1:-1,a=vr(i,r.s),o=-Math.sin(a.angle),c=Math.cos(a.angle),h=s*n-r.lateral;if(t.x+=o*h,t.y+=c*h,e.throttle>=0){let u=a.angle-t.heading;for(;u>Math.PI;)u-=Math.PI*2;for(;u<-Math.PI;)u+=Math.PI*2;t.speed<0&&(u=u>0?u-Math.PI:u+Math.PI),t.heading+=Math.max(-1,Math.min(1,u))*ls.slideAlign}return Math.abs(t.speed)>ls.minSlideSpeed&&(t.speed*=ls.speedKeep),!0}const Qr={minDist:le.radius*2,speedKeep:.86,shove:.2};function Fg(i,t,e,n=1){const r=i.x-t,s=i.y-e;let a=Math.hypot(r,s);if(a>=Qr.minDist)return!1;a<1e-4&&(a=1e-4);const o=r/a,c=s/a,h=(Qr.minDist-a)*n;i.x+=o*h,i.y+=c*h;let f=Math.atan2(c,o)-i.heading;for(;f>Math.PI;)f-=Math.PI*2;for(;f<-Math.PI;)f+=Math.PI*2;return Math.abs(f)<Math.PI/2&&(i.heading+=Math.max(-1,Math.min(1,f))*Qr.shove),Math.abs(i.speed)>80&&(i.speed*=Qr.speedKeep),!0}function er(i,t){const e=document.createElement("canvas");return e.width=i,e.height=t,[e,e.getContext("2d")]}function wr(i,t=1,e=1){const n=new vo(i);return n.wrapS=n.wrapT=hs,n.repeat.set(t,e),n.anisotropy=8,n}function Bg(){const[i,t]=er(512,512);t.fillStyle="#2b3040",t.fillRect(0,0,512,512);for(let e=0;e<26e3;e++){const n=28+Math.random()*40;t.fillStyle=`rgba(${n+12},${n+16},${n+26},${.25+Math.random()*.4})`,t.fillRect(Math.random()*512,Math.random()*512,2,2)}for(let e=0;e<40;e++){const n=30+Math.random()*90,r=t.createRadialGradient(Math.random()*512,Math.random()*512,0,256,256,n);r.addColorStop(0,"rgba(255,255,255,0.03)"),r.addColorStop(1,"rgba(255,255,255,0)"),t.fillStyle=r,t.fillRect(0,0,512,512)}return wr(i,3,40)}function zg(){const[i,t]=er(256,256);t.fillStyle="#20402a",t.fillRect(0,0,256,256);for(let e=0;e<9e3;e++){const n=Math.random();t.strokeStyle=`rgba(${40+n*50},${90+n*70},${50+n*40},0.5)`,t.lineWidth=1;const r=Math.random()*256,s=Math.random()*256;t.beginPath(),t.moveTo(r,s),t.lineTo(r+Math.random()*3-1.5,s-3-Math.random()*4),t.stroke()}return wr(i,60,60)}function Oc(){const[i,t]=er(64,64);return t.fillStyle="#f2f4f8",t.fillRect(0,0,64,64),t.fillStyle="#d63a48",t.fillRect(0,0,64,32),wr(i,1,260)}function kg(){const[i,t]=er(512,128);return t.fillStyle="#eef2fa",t.fillRect(0,0,512,128),t.fillStyle="#1f6fd0",t.fillRect(0,84,512,44),t.fillStyle="#0f1a2e",t.font="bold 46px system-ui, sans-serif",t.textAlign="center",t.textBaseline="middle",t.fillText("IP RACING",256,44),wr(i,26,1)}function Hg(){const[i,t]=er(128,128),e=8,n=128/e;for(let r=0;r<e;r++)for(let s=0;s<e;s++)t.fillStyle=(s+r)%2?"#12161f":"#f5f8ff",t.fillRect(s*n,r*n,n,n);return wr(i,6,1)}function Gg(){const[i,t]=er(16,256),e=t.createLinearGradient(0,0,0,256);e.addColorStop(0,"#0a1430"),e.addColorStop(.45,"#20406e"),e.addColorStop(.78,"#4a7fae"),e.addColorStop(1,"#9fc4d8"),t.fillStyle=e,t.fillRect(0,0,16,256);const n=new vo(i),r=new ki(7e3,24,16),s=new ri({map:n,side:ze,fog:!1,depthWrite:!1}),a=new oe(r,s);return a.renderOrder=-2,a}function Vg(){const i=new Fn,t=[{r:9e3,h:1500,color:1715013,seg:26},{r:7800,h:1050,color:2242391,seg:22}];for(const e of t){const n=[];for(let a=0;a<e.seg;a++){const o=a/e.seg*Math.PI*2,c=(a+1)/e.seg*Math.PI*2,h=(o+c)/2,u=e.h*(.45+Math.random()*.9),f=(p,_)=>n.push(Math.cos(p)*e.r,_,Math.sin(p)*e.r);f(o,0),f(c,0),n.push(Math.cos(h)*e.r,u,Math.sin(h)*e.r)}const r=new ke;r.setAttribute("position",new Me(n,3)),r.computeVertexNormals();const s=new oe(r,new ri({color:e.color,side:en,fog:!1,depthWrite:!1}));s.renderOrder=-1,i.add(s)}return i}function Wg(){const i=new Fn;for(let t=0;t<4;t++){const e=new oe(new Ne(520,40,70),new Je({color:t%2?4477037:3753054}));e.position.set(0,20+t*38,-t*66),i.add(e);const n=new Ne(14,26,12),r=new Je({color:16777215,vertexColors:!1}),s=22,a=new to(n,r,s),o=new Te,c=[16739179,5088255,16765286,3659386,13073919,16119803];for(let h=0;h<s;h++)o.position.set(-240+h*22+Math.random()*8,53+t*38,-t*66+10),o.updateMatrix(),a.setMatrixAt(h,o.matrix),a.setColorAt(h,new ne(c[Math.floor(Math.random()*c.length)]));a.instanceColor&&(a.instanceColor.needsUpdate=!0),i.add(a)}return i}const Fc=[5088255,16752451,3659386,13073919],$g=new V(0,1,0);class Xg{constructor(t){this.container=t,this.clock=new Lg,this.track=null,this.trackBuilt=!1,this.karts={},this.ghost={},this.pickups={},this.hazards={},this.local={x:0,y:0,heading:0,speed:0,steerActual:0,driftCharge:0,drifting:!1},this.localReady=!1,this.ctrl={throttle:0,steer:0,drift:!1},this.keys={},this.isTouch=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches||typeof navigator<"u"&&navigator.maxTouchPoints>0,this.touch={steer:0,gas:!1,brake:!1,drift:!1},this.camPos=new V,this.camLook=new V,this.sparks=[],this.sparkIdx=0,this.running=!1,this.wallSfx=0,this.frameErrors=0,this.lastError="",this.lastServerAt=0,this.stallMs=0,this.lastLocal={x:0,y:0},this.recoveries=0,this.bumpedAt=0}start(){this.running||(this.running=!0,this.initThree(),this.bindInput(),this.bindTouch(),se.on("fx",t=>this.onFx(t)),se.on("track",()=>this.buildWorld()),se.on("rematch",()=>{for(const t of Object.keys(this.karts))this.disposeKart(t);this.ghost={},this.localReady=!1,this.stallMs=0}),se.ensureTrack(()=>this.buildWorld()),this.renderer.setAnimationLoop(()=>{try{this.frame()}catch(t){this.frameErrors++,this.lastError=String((t==null?void 0:t.message)??t),this.frameErrors<=5&&console.error("[Race3D] frame error",t)}try{this.renderer.render(this.scene,this.camera)}catch{}}))}initThree(){const t=this.container.clientWidth||1280,e=this.container.clientHeight||720;this.renderer=new Eg({antialias:!0}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,2)),this.renderer.setSize(t,e),this.container.appendChild(this.renderer.domElement),this.scene=new Tg,this.scene.fog=new _o(4747158,2600,6400),this.camera=new tn(62,t/e,5,12e3),this.camera.position.set(0,200,0),this.sky=Gg(),this.mounts=Vg(),this.scene.add(this.sky),this.scene.add(this.mounts),this.scene.add(new Cg(12376319,3033642,1));const n=new Dc(16773848,1.5);n.position.set(1600,2600,1e3),this.scene.add(n);const r=new Dc(8956671,.45);r.position.set(-1400,900,-1200),this.scene.add(r);const s=new oe(new Ki(26e3,26e3),new Je({map:zg()}));s.rotation.x=-Math.PI/2,s.position.y=-2,this.scene.add(s);const a=new ki(7,6,5);for(let o=0;o<72;o++){const c=new oe(a,new ri({color:16777215,transparent:!0,opacity:0}));c.visible=!1,this.scene.add(c),this.sparks.push(c)}addEventListener("resize",()=>this.resize()),addEventListener("orientationchange",()=>setTimeout(()=>this.resize(),250)),visualViewport==null||visualViewport.addEventListener("resize",()=>this.resize())}resize(){const t=this.container.clientWidth||1280,e=this.container.clientHeight||720;this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.renderer.setSize(t,e)}bindInput(){addEventListener("keydown",t=>{this.keys[t.code]=!0,t.code==="Space"&&(t.preventDefault(),se.useItem()),["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(t.code)&&t.preventDefault()}),addEventListener("keyup",t=>{this.keys[t.code]=!1}),addEventListener("blur",()=>{this.keys={}})}bindTouch(){if(!this.isTouch)return;document.body.classList.add("touch");const t=document.getElementById("joyBase"),e=document.getElementById("joyStick");if(t&&e){let o=-1;t.addEventListener("pointerdown",h=>{if(h.preventDefault(),o===-1){o=h.pointerId;try{t.setPointerCapture(h.pointerId)}catch{}}}),t.addEventListener("pointermove",h=>{if(h.pointerId!==o)return;h.preventDefault();const u=t.getBoundingClientRect();let f=h.clientX-(u.left+u.width/2);f>42?f=42:f<-42&&(f=-42),e.style.transform=`translateX(${f}px)`,this.touch.steer=Math.abs(f)<8?0:Math.sign(f)});const c=h=>{h.pointerId===o&&(o=-1,this.touch.steer=0,e.style.transform="translateX(0px)")};t.addEventListener("pointerup",c),t.addEventListener("pointercancel",c)}const n=(s,a,o)=>{const c=document.getElementById(s);if(!c)return;c.addEventListener("pointerdown",u=>{u.preventDefault(),c.classList.add("active"),a()});const h=u=>{u==null||u.preventDefault(),c.classList.remove("active"),o()};c.addEventListener("pointerup",h),c.addEventListener("pointercancel",h),c.addEventListener("pointerleave",h)};n("tGas",()=>{this.touch.gas=!0},()=>{this.touch.gas=!1}),n("tBrake",()=>{this.touch.brake=!0},()=>{this.touch.brake=!1}),n("tDrift",()=>{this.touch.drift=!0},()=>{this.touch.drift=!1});const r=document.getElementById("tItem");r==null||r.addEventListener("pointerdown",s=>{s.preventDefault(),se.useItem()})}buildWorld(){if(!se.track||this.trackBuilt)return;this.trackBuilt=!0,this.track=Dg(se.track.points,se.track.width);const t=this.track.points,e=this.track.width/2;this.scene.add(this.ribbon(t,-e,e,0,16777215,Bg())),this.scene.add(this.ribbon(t,-e-26,-e,3,16777215,Oc())),this.scene.add(this.ribbon(t,e,e+26,3,16777215,Oc())),this.scene.add(this.ribbon(t,-e+8,-e+16,1,15331067)),this.scene.add(this.ribbon(t,e-16,e-8,1,15331067)),this.buildWalls(t,e),this.buildStartLine(t,e),this.buildScenery(e)}ribbon(t,e,n,r,s,a){const o=t.length,c=[],h=[],u=[];for(let p=0;p<o;p++){const _=t[p],x=t[(p+1)%o],y=Math.atan2(x[1]-_[1],x[0]-_[0]),v=-Math.sin(y),d=Math.cos(y);c.push(_[0]+v*e,r,_[1]+d*e),c.push(_[0]+v*n,r,_[1]+d*n);const R=p/o;h.push(0,R,1,R)}for(let p=0;p<o;p++){const _=p*2,x=p*2+1,y=(p+1)%o*2,v=(p+1)%o*2+1;u.push(_,x,v,_,v,y)}const f=new ke;return f.setAttribute("position",new Me(c,3)),f.setAttribute("uv",new Me(h,2)),f.setIndex(u),f.computeVertexNormals(),new oe(f,new Je({color:s,map:a,side:en}))}buildWalls(t,e){const n=t.length;for(const r of[-1,1]){const s=[],a=[],o=[];for(let h=0;h<n;h++){const u=t[h],f=t[(h+1)%n],p=Math.atan2(f[1]-u[1],f[0]-u[0]),_=-Math.sin(p)*e*r,x=Math.cos(p)*e*r;s.push(u[0]+_,0,u[1]+x),s.push(u[0]+_,96,u[1]+x);const y=r>0?1-h/n:h/n;a.push(y,0,y,1)}for(let h=0;h<n;h++){const u=h*2,f=h*2+1,p=(h+1)%n*2,_=(h+1)%n*2+1;o.push(u,f,_,u,_,p)}const c=new ke;c.setAttribute("position",new Me(s,3)),c.setIndex(o),c.computeVertexNormals(),c.setAttribute("uv",new Me(a,2)),this.scene.add(new oe(c,new Je({map:kg(),side:en})))}}buildStartLine(t,e){const n=t[0],r=t[1],s=Math.atan2(r[1]-n[1],r[0]-n[0]),a=new Ki(e*2,90),o=new Je({map:Hg()}),c=new oe(a,o);c.rotation.x=-Math.PI/2,c.rotation.z=-s,c.position.set(n[0],2,n[1]),this.scene.add(c)}buildScenery(t){if(!this.track)return;const e=[],n=(s,a,o,c)=>{if(Math.abs(cs(this.track,s,a).lateral)<t+c)return!1;for(const h of e)if(Math.hypot(h.x-s,h.y-a)<h.r+o)return!1;return!0};for(const s of[.02,.36,.72]){const a=vr(this.track,this.track.total*s);for(const o of[1,-1]){const c=(t+230)*o,h=a.x-Math.sin(a.angle)*c,u=a.y+Math.cos(a.angle)*c;if(!n(h,u,300,150))continue;const f=Wg();f.position.set(h,0,u),f.rotation.y=-a.angle+(o>0?Math.PI/2:-Math.PI/2),this.scene.add(f),e.push({x:h,y:u,r:300});break}}const r=[];for(let s=0;s<this.track.total;s+=300)for(const a of[-1,1]){if(Math.random()>.55)continue;const o=vr(this.track,s+Math.random()*140),c=(t+190+Math.random()*560)*a,h=o.x-Math.sin(o.angle)*c,u=o.y+Math.cos(o.angle)*c;if(!n(h,u,90,110))continue;const f=.75+Math.random()*.8;r.push({x:h,y:u,sc:f,rot:Math.random()*6.28}),e.push({x:h,y:u,r:90*f})}if(r.length){const s=[[new ii(9,12,70,6),new Je({color:4863265}),35],[new Oi(58,78,7),new Je({color:3107642}),92],[new Oi(45,78,7),new Je({color:2579250}),136],[new Oi(32,78,7),new Je({color:3635780}),180]],a=new Te;for(const[o,c,h]of s){const u=new to(o,c,r.length);r.forEach((f,p)=>{a.position.set(f.x,h*f.sc,f.y),a.scale.setScalar(f.sc),a.rotation.set(0,f.rot,0),a.updateMatrix(),u.setMatrixAt(p,a.matrix)}),this.scene.add(u)}}this.buildPosts(t)}buildPosts(t){if(!this.track)return;const e=new ii(9,9,90,6),n=new Je({color:15265532}),r=260,s=Math.floor(this.track.total/r),a=new to(e,n,s*2),o=new Te;let c=0;for(let h=0;h<s;h++){const u=h*r,f=vr(this.track,u);for(const p of[-1,1]){const _=(t+55)*p,x=f.x-Math.sin(f.angle)*_,y=f.y+Math.cos(f.angle)*_;Math.abs(cs(this.track,x,y).lateral)<t+20||(o.position.set(x,45,y),o.updateMatrix(),a.setMatrixAt(c++,o.matrix))}}a.count=c,this.scene.add(a)}disposeKart(t){const e=this.karts[t];e&&(e.traverse(n=>{var r,s,a,o,c;if(n.geometry&&((s=(r=n.geometry).dispose)==null||s.call(r)),n.material){const h=Array.isArray(n.material)?n.material:[n.material];for(const u of h)(o=(a=u.map)==null?void 0:a.dispose)==null||o.call(a),(c=u.dispose)==null||c.call(u)}}),this.scene.remove(e),delete this.karts[t],delete this.ghost[t])}makeKart(t,e){const n=new Fn,r=Fc[e%Fc.length],s=new Di({color:r,metalness:.35,roughness:.42}),a=new Di({color:1448744,metalness:.2,roughness:.7}),o=new Di({color:13227238,metalness:.85,roughness:.25}),c=new oe(new Ne(46,24,54),s);c.position.set(-14,24,0),n.add(c);const h=new oe(new Ne(46,18,38),s);h.position.set(26,21,0),n.add(h);for(const I of[-30,30]){const N=new oe(new Ne(52,16,12),s);N.position.set(0,20,I),n.add(N)}const u=new oe(new Oi(13,34,4),s);u.rotation.z=-Math.PI/2,u.position.set(52,20,0),n.add(u);const f=new oe(new Ne(12,5,72),o);f.position.set(56,12,0),n.add(f);for(const I of[-14,14]){const N=new oe(new Ne(5,26,4),a);N.position.set(-38,40,I),n.add(N)}const p=new oe(new Ne(16,5,62),o);p.position.set(-38,55,0),n.add(p);const _=new oe(new Ne(26,16,30),a);_.position.set(0,36,0),n.add(_);const x=new oe(new ki(13,14,12),s);x.position.set(2,50,0),n.add(x);const y=new oe(new Ne(6,7,20),new Di({color:856608,metalness:.9,roughness:.1}));y.position.set(12,51,0),n.add(y);const v=new ii(19,19,15,14),d=new ii(9,9,16,10),R=new Di({color:1053465,roughness:.9}),b=[];for(const[I,N,w]of[[30,34,1],[30,-34,1],[-28,36,0],[-28,-36,0]]){const T=new Fn,U=new oe(v,R);U.rotation.x=Math.PI/2,T.add(U);const $=new oe(d,o);$.rotation.x=Math.PI/2,T.add($),T.position.set(I,19,N),n.add(T),w&&b.push(T)}n.userData.frontWheels=b;const A=new oe(new ps(58,20),new ri({color:0,transparent:!0,opacity:.32,depthWrite:!1}));A.rotation.x=-Math.PI/2,A.position.y=1.5,n.add(A);const H=new oe(new ki(66,16,12),new ri({color:5088255,transparent:!0,opacity:.2}));H.position.y=32,H.visible=!1,n.add(H),n.userData.shield=H;const D=this.makeLabel(t.nickname+(t.isBot?" [AI]":""),r);return D.position.y=112,D.visible=t.sessionId!==se.selfId,n.add(D),n.userData.label=D,this.scene.add(n),n}makeLabel(t,e=16777215){const n=document.createElement("canvas");n.width=512,n.height=128;const r=n.getContext("2d");r.font="bold 54px system-ui, sans-serif",r.textAlign="center",r.textBaseline="middle",r.lineWidth=12,r.strokeStyle="rgba(6,10,20,.95)",r.strokeText(t,256,64),r.fillStyle="#"+e.toString(16).padStart(6,"0"),r.fillText(t,256,64);const s=new vo(n),a=new wg(new vl({map:s,depthTest:!1}));return a.scale.set(150,38,1),a}makePickup(t){const e=t.kind==="item",n=new oe(e?new Mo(40):new Ne(62,62,62),new Di({color:e?3121120:13666858,emissive:e?1135231:5913096,emissiveIntensity:.9,metalness:.4,roughness:.3,transparent:!0,opacity:.92}));return n.position.set(t.x,38,t.y),this.scene.add(n),n}makeHazard(t){const e=new oe(new ps(46,16),new Je({color:1709072}));return e.rotation.x=-Math.PI/2,e.position.set(t.x,4,t.y),this.scene.add(e),e}frame(){const t=Math.min(this.clock.getDelta(),.05),e=se.state;if(!e||!this.track)return;se.lastStateAt&&(this.lastServerAt=se.lastStateAt);const n=e.phase==="racing";n&&this.readInput();const r=se.me();if(r){if(this.localReady||(this.syncLocal(r),this.localReady=!0),n&&!r.finished){const a=cs(this.track,this.local.x,this.local.y),o=vr(this.track,a.s);Ng(this.local,this.ctrl,t,{speedMul:r.speedMul,stunned:r.stunMs>0,trackAngle:o.angle}),Nc(this.track,this.local,this.ctrl);for(let c=0;c<2;c++){for(const h of e.karts.values()){if(h.sessionId===se.selfId||h.finished)continue;const u=this.ghost[h.sessionId],f=u?u.x:h.x,p=u?u.y:h.y;Fg(this.local,f,p,1)&&(this.bumpedAt=performance.now())}Nc(this.track,this.local,this.ctrl)}}Math.hypot(r.x-this.local.x,r.y-this.local.y)>240?this.syncLocal(r):(this.local.x+=(r.x-this.local.x)*.1,this.local.y+=(r.y-this.local.y)*.1,this.local.heading+=Bc(r.heading,this.local.heading)*.1)}this.updateAudio(e,r),this.syncKarts(e,t),this.syncProps(e,t),this.updateCamera(r,t),this.fadeSparks(t),this.collectDiagnostics(e,r,t)}collectDiagnostics(t,e,n){(!Number.isFinite(this.local.x)||!Number.isFinite(this.local.y)||!Number.isFinite(this.local.heading)||!Number.isFinite(this.local.speed))&&(this.lastError="local NaN → 서버 좌표로 복구",e?this.syncLocal(e):(this.local.x=0,this.local.y=0,this.local.heading=0,this.local.speed=0));const r=Math.hypot(this.local.x-this.lastLocal.x,this.local.y-this.lastLocal.y);this.lastLocal={x:this.local.x,y:this.local.y};const s=this.ctrl.throttle!==0||this.ctrl.steer!==0;t.phase==="racing"&&s&&r<.6&&e&&e.stunMs<=0?this.stallMs+=n*1e3:this.stallMs=0,this.stallMs>2e3&&e&&Math.abs(e.speed)>60&&(this.syncLocal(e),this.stallMs=0,this.recoveries++,this.lastError=`예측 멈춤 감지 → 강제 동기화 (${this.recoveries}회)`),window.__ipr={phase:t.phase,speed:Math.round(this.local.speed),serverSpeed:e?Math.round(e.speed):null,gap:e?Math.round(Math.hypot(e.x-this.local.x,e.y-this.local.y)):null,stunMs:(e==null?void 0:e.stunMs)??null,respawnMs:(e==null?void 0:e.respawnMs)??null,quizActive:(e==null?void 0:e.quizActive)??null,keys:{...this.ctrl},stallMs:Math.round(this.stallMs),frameErrors:this.frameErrors,recoveries:this.recoveries,lastError:this.lastError,serverAgeMs:Math.round(performance.now()-this.lastServerAt)}}updateAudio(t,e){e&&(Ee.updateEngine(this.local.speed,le.maxSpeed,{racing:t.phase==="racing"&&!e.finished,boost:e.boostMs>0,drifting:e.drifting}),Ee.setSkid(!!e.drifting,1+(e.driftTier||0)*.25))}readInput(){const t=this.keys,e=t.ArrowUp?1:t.ArrowDown?-1:0,n=t.ArrowLeft?-1:t.ArrowRight?1:0,r=!!(t.ShiftLeft||t.ShiftRight),s=this.touch.gas?1:this.touch.brake?-1:0;this.ctrl.throttle=e||s,this.ctrl.steer=n||this.touch.steer,this.ctrl.drift=r||this.touch.drift,se.sendInput(this.ctrl)}syncLocal(t){this.local.x=t.x,this.local.y=t.y,this.local.heading=t.heading,this.local.speed=t.speed,this.local.steerActual=t.steer??0,this.local.driftCharge=0,this.local.drifting=!1}syncKarts(t,e){const n=[...t.karts.values()],r=new Set(n.map(s=>s.sessionId));for(const s of Object.keys(this.karts))r.has(s)||this.disposeKart(s);n.forEach((s,a)=>{var o,c;let h=this.karts[s.sessionId];h||(h=this.karts[s.sessionId]=this.makeKart(s,a));let u,f,p;if(s.sessionId===se.selfId)u=this.local.x,f=this.local.y,p=this.local.heading;else{const y=(o=this.ghost)[c=s.sessionId]??(o[c]={x:s.x,y:s.y,heading:s.heading});Math.hypot(s.x-y.x,s.y-y.y)>240&&(y.x=s.x,y.y=s.y,y.heading=s.heading),y.x+=(s.x-y.x)*.25,y.y+=(s.y-y.y)*.25,y.heading+=Bc(s.heading,y.heading)*.25,u=y.x,f=y.y,p=y.heading}h.position.set(u,0,f),h.rotation.y=-p;const _=s.drifting?-Math.sign(s.steer||0)*.22:0;h.rotation.z+=(_-h.rotation.z)*Math.min(1,e*8);const x=h.userData.frontWheels;if(x)for(const y of x)y.rotation.y=-(s.steer??0)*.5;if(h.userData.shield.visible=s.shieldMs>0,h.visible=!(s.respawnMs>0&&Math.floor(s.respawnMs/110)%2===0),s.drifting){const y=le.driftTiers[s.driftTier-1];this.emitSpark(u,f,p,y?y.color:10466520)}else if(s.boostMs>0){const y=le.driftTiers[s.boostTier-1];this.emitSpark(u,f,p,y?y.color:16765286)}})}syncProps(t,e){for(const r of t.pickups){let s=this.pickups[r.id];s||(s=this.pickups[r.id]=this.makePickup(r)),s.visible=r.active,s.rotation.y+=e*(r.kind==="item"?1.8:.7),s.position.y=38+Math.sin(performance.now()/400+r.x)*8}const n=new Set;for(const r of t.hazards)n.add(r.id),this.hazards[r.id]||(this.hazards[r.id]=this.makeHazard(r));for(const r of Object.keys(this.hazards))if(!n.has(r)){const s=this.hazards[r];s.geometry.dispose(),s.material.dispose(),this.scene.remove(s),delete this.hazards[r]}}updateCamera(t,e){if(!t)return;const n=this.local.heading,r=Math.abs(this.local.speed),s=Math.min(r/le.maxSpeed,1.4),a=230+s*90,o=130+s*18,c=this.local.x-Math.cos(n)*a,h=this.local.y-Math.sin(n)*a,u=new V(c,o,h);this.camPos.lerp(u,Math.min(1,e*6.5));const f=this.local.x+Math.cos(n)*220,p=this.local.y+Math.sin(n)*220;this.camLook.lerp(new V(f,40,p),Math.min(1,e*9)),this.camera.position.copy(this.camPos),this.camera.up.copy($g),this.camera.lookAt(this.camLook),this.sky&&this.sky.position.copy(this.camera.position),this.mounts&&this.mounts.position.set(this.camera.position.x,0,this.camera.position.z);const _=62+(t.boostMs>0?9:0)+s*4;this.camera.fov+=(_-this.camera.fov)*Math.min(1,e*5),this.camera.updateProjectionMatrix()}emitSpark(t,e,n,r){const s=this.sparks[this.sparkIdx=(this.sparkIdx+1)%this.sparks.length];s.position.set(t-Math.cos(n)*44+(Math.random()-.5)*26,10+Math.random()*14,e-Math.sin(n)*44+(Math.random()-.5)*26),s.material.color.setHex(r),s.material.opacity=.95,s.scale.setScalar(1),s.visible=!0}fadeSparks(t){for(const e of this.sparks){if(!e.visible)continue;const n=e.material;n.opacity-=t*3.2,e.scale.multiplyScalar(1-t*1.6),n.opacity<=0&&(e.visible=!1)}}onFx(t){const e=this.karts[t.id];if(!e)return;const n=t.id===se.selfId;if(t.type==="bomb"||t.type==="spin"){for(let r=0;r<14;r++)this.emitSpark(e.position.x,e.position.z,Math.random()*6.3,5088255);n&&Ee.hit()}else if(t.type==="drift_boost"||t.type==="boost"){const r=le.driftTiers[(t.tier??1)-1];for(let s=0;s<10;s++)this.emitSpark(e.position.x,e.position.z,this.local.heading,r?r.color:16765286);n&&Ee.boost(t.tier??1)}else if(t.type==="respawn"&&n)this.localReady=!1,Ee.respawn();else if(t.type==="wall"&&n){for(let r=0;r<3;r++)this.emitSpark(t.x,t.y,this.local.heading,16767392);this.wallSfx=(this.wallSfx??0)+1,this.wallSfx%5===0&&Ee.wall()}else if(t.type==="pickup"&&n)Ee.pickup();else if(t.type==="lap"&&n)Ee.lap();else if(t.type==="shield"&&n)Ee.shield();else if(t.type==="finish"&&n)Ee.finish();else if(t.type==="bump"){if(n||t.other===se.selfId){for(let r=0;r<5;r++)this.emitSpark(t.x,t.y,Math.random()*6.3,16767392);Ee.wall()}}else t.type==="recover"&&n&&(this.localReady=!1,Ee.shield())}}function Bc(i,t){let e=i-t;for(;e>Math.PI;)e-=Math.PI*2;for(;e<-Math.PI;)e+=Math.PI*2;return e}const qg=typeof matchMedia<"u"&&matchMedia("(pointer: coarse)").matches||typeof navigator<"u"&&navigator.maxTouchPoints>0;qg&&document.body.classList.add("touch");let la=null;function Yg(){if(la)return;const i=document.getElementById("game");la=new Xg(i),la.start(),fa.bindQuiz(),fa.bindEnd()}fa.initLobby(Yg);
