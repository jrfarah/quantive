window.pdocSearch = (function(){
/** elasticlunr - http://weixsong.github.io * Copyright (C) 2017 Oliver Nightingale * Copyright (C) 2017 Wei Song * MIT Licensed */!function(){function e(e){if(null===e||"object"!=typeof e)return e;var t=e.constructor();for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t}var t=function(e){var n=new t.Index;return n.pipeline.add(t.trimmer,t.stopWordFilter,t.stemmer),e&&e.call(n,n),n};t.version="0.9.5",lunr=t,t.utils={},t.utils.warn=function(e){return function(t){e.console&&console.warn&&console.warn(t)}}(this),t.utils.toString=function(e){return void 0===e||null===e?"":e.toString()},t.EventEmitter=function(){this.events={}},t.EventEmitter.prototype.addListener=function(){var e=Array.prototype.slice.call(arguments),t=e.pop(),n=e;if("function"!=typeof t)throw new TypeError("last argument must be a function");n.forEach(function(e){this.hasHandler(e)||(this.events[e]=[]),this.events[e].push(t)},this)},t.EventEmitter.prototype.removeListener=function(e,t){if(this.hasHandler(e)){var n=this.events[e].indexOf(t);-1!==n&&(this.events[e].splice(n,1),0==this.events[e].length&&delete this.events[e])}},t.EventEmitter.prototype.emit=function(e){if(this.hasHandler(e)){var t=Array.prototype.slice.call(arguments,1);this.events[e].forEach(function(e){e.apply(void 0,t)},this)}},t.EventEmitter.prototype.hasHandler=function(e){return e in this.events},t.tokenizer=function(e){if(!arguments.length||null===e||void 0===e)return[];if(Array.isArray(e)){var n=e.filter(function(e){return null===e||void 0===e?!1:!0});n=n.map(function(e){return t.utils.toString(e).toLowerCase()});var i=[];return n.forEach(function(e){var n=e.split(t.tokenizer.seperator);i=i.concat(n)},this),i}return e.toString().trim().toLowerCase().split(t.tokenizer.seperator)},t.tokenizer.defaultSeperator=/[\s\-]+/,t.tokenizer.seperator=t.tokenizer.defaultSeperator,t.tokenizer.setSeperator=function(e){null!==e&&void 0!==e&&"object"==typeof e&&(t.tokenizer.seperator=e)},t.tokenizer.resetSeperator=function(){t.tokenizer.seperator=t.tokenizer.defaultSeperator},t.tokenizer.getSeperator=function(){return t.tokenizer.seperator},t.Pipeline=function(){this._queue=[]},t.Pipeline.registeredFunctions={},t.Pipeline.registerFunction=function(e,n){n in t.Pipeline.registeredFunctions&&t.utils.warn("Overwriting existing registered function: "+n),e.label=n,t.Pipeline.registeredFunctions[n]=e},t.Pipeline.getRegisteredFunction=function(e){return e in t.Pipeline.registeredFunctions!=!0?null:t.Pipeline.registeredFunctions[e]},t.Pipeline.warnIfFunctionNotRegistered=function(e){var n=e.label&&e.label in this.registeredFunctions;n||t.utils.warn("Function is not registered with pipeline. This may cause problems when serialising the index.\n",e)},t.Pipeline.load=function(e){var n=new t.Pipeline;return e.forEach(function(e){var i=t.Pipeline.getRegisteredFunction(e);if(!i)throw new Error("Cannot load un-registered function: "+e);n.add(i)}),n},t.Pipeline.prototype.add=function(){var e=Array.prototype.slice.call(arguments);e.forEach(function(e){t.Pipeline.warnIfFunctionNotRegistered(e),this._queue.push(e)},this)},t.Pipeline.prototype.after=function(e,n){t.Pipeline.warnIfFunctionNotRegistered(n);var i=this._queue.indexOf(e);if(-1===i)throw new Error("Cannot find existingFn");this._queue.splice(i+1,0,n)},t.Pipeline.prototype.before=function(e,n){t.Pipeline.warnIfFunctionNotRegistered(n);var i=this._queue.indexOf(e);if(-1===i)throw new Error("Cannot find existingFn");this._queue.splice(i,0,n)},t.Pipeline.prototype.remove=function(e){var t=this._queue.indexOf(e);-1!==t&&this._queue.splice(t,1)},t.Pipeline.prototype.run=function(e){for(var t=[],n=e.length,i=this._queue.length,o=0;n>o;o++){for(var r=e[o],s=0;i>s&&(r=this._queue[s](r,o,e),void 0!==r&&null!==r);s++);void 0!==r&&null!==r&&t.push(r)}return t},t.Pipeline.prototype.reset=function(){this._queue=[]},t.Pipeline.prototype.get=function(){return this._queue},t.Pipeline.prototype.toJSON=function(){return this._queue.map(function(e){return t.Pipeline.warnIfFunctionNotRegistered(e),e.label})},t.Index=function(){this._fields=[],this._ref="id",this.pipeline=new t.Pipeline,this.documentStore=new t.DocumentStore,this.index={},this.eventEmitter=new t.EventEmitter,this._idfCache={},this.on("add","remove","update",function(){this._idfCache={}}.bind(this))},t.Index.prototype.on=function(){var e=Array.prototype.slice.call(arguments);return this.eventEmitter.addListener.apply(this.eventEmitter,e)},t.Index.prototype.off=function(e,t){return this.eventEmitter.removeListener(e,t)},t.Index.load=function(e){e.version!==t.version&&t.utils.warn("version mismatch: current "+t.version+" importing "+e.version);var n=new this;n._fields=e.fields,n._ref=e.ref,n.documentStore=t.DocumentStore.load(e.documentStore),n.pipeline=t.Pipeline.load(e.pipeline),n.index={};for(var i in e.index)n.index[i]=t.InvertedIndex.load(e.index[i]);return n},t.Index.prototype.addField=function(e){return this._fields.push(e),this.index[e]=new t.InvertedIndex,this},t.Index.prototype.setRef=function(e){return this._ref=e,this},t.Index.prototype.saveDocument=function(e){return this.documentStore=new t.DocumentStore(e),this},t.Index.prototype.addDoc=function(e,n){if(e){var n=void 0===n?!0:n,i=e[this._ref];this.documentStore.addDoc(i,e),this._fields.forEach(function(n){var o=this.pipeline.run(t.tokenizer(e[n]));this.documentStore.addFieldLength(i,n,o.length);var r={};o.forEach(function(e){e in r?r[e]+=1:r[e]=1},this);for(var s in r){var u=r[s];u=Math.sqrt(u),this.index[n].addToken(s,{ref:i,tf:u})}},this),n&&this.eventEmitter.emit("add",e,this)}},t.Index.prototype.removeDocByRef=function(e){if(e&&this.documentStore.isDocStored()!==!1&&this.documentStore.hasDoc(e)){var t=this.documentStore.getDoc(e);this.removeDoc(t,!1)}},t.Index.prototype.removeDoc=function(e,n){if(e){var n=void 0===n?!0:n,i=e[this._ref];this.documentStore.hasDoc(i)&&(this.documentStore.removeDoc(i),this._fields.forEach(function(n){var o=this.pipeline.run(t.tokenizer(e[n]));o.forEach(function(e){this.index[n].removeToken(e,i)},this)},this),n&&this.eventEmitter.emit("remove",e,this))}},t.Index.prototype.updateDoc=function(e,t){var t=void 0===t?!0:t;this.removeDocByRef(e[this._ref],!1),this.addDoc(e,!1),t&&this.eventEmitter.emit("update",e,this)},t.Index.prototype.idf=function(e,t){var n="@"+t+"/"+e;if(Object.prototype.hasOwnProperty.call(this._idfCache,n))return this._idfCache[n];var i=this.index[t].getDocFreq(e),o=1+Math.log(this.documentStore.length/(i+1));return this._idfCache[n]=o,o},t.Index.prototype.getFields=function(){return this._fields.slice()},t.Index.prototype.search=function(e,n){if(!e)return[];e="string"==typeof e?{any:e}:JSON.parse(JSON.stringify(e));var i=null;null!=n&&(i=JSON.stringify(n));for(var o=new t.Configuration(i,this.getFields()).get(),r={},s=Object.keys(e),u=0;u<s.length;u++){var a=s[u];r[a]=this.pipeline.run(t.tokenizer(e[a]))}var l={};for(var c in o){var d=r[c]||r.any;if(d){var f=this.fieldSearch(d,c,o),h=o[c].boost;for(var p in f)f[p]=f[p]*h;for(var p in f)p in l?l[p]+=f[p]:l[p]=f[p]}}var v,g=[];for(var p in l)v={ref:p,score:l[p]},this.documentStore.hasDoc(p)&&(v.doc=this.documentStore.getDoc(p)),g.push(v);return g.sort(function(e,t){return t.score-e.score}),g},t.Index.prototype.fieldSearch=function(e,t,n){var i=n[t].bool,o=n[t].expand,r=n[t].boost,s=null,u={};return 0!==r?(e.forEach(function(e){var n=[e];1==o&&(n=this.index[t].expandToken(e));var r={};n.forEach(function(n){var o=this.index[t].getDocs(n),a=this.idf(n,t);if(s&&"AND"==i){var l={};for(var c in s)c in o&&(l[c]=o[c]);o=l}n==e&&this.fieldSearchStats(u,n,o);for(var c in o){var d=this.index[t].getTermFrequency(n,c),f=this.documentStore.getFieldLength(c,t),h=1;0!=f&&(h=1/Math.sqrt(f));var p=1;n!=e&&(p=.15*(1-(n.length-e.length)/n.length));var v=d*a*h*p;c in r?r[c]+=v:r[c]=v}},this),s=this.mergeScores(s,r,i)},this),s=this.coordNorm(s,u,e.length)):void 0},t.Index.prototype.mergeScores=function(e,t,n){if(!e)return t;if("AND"==n){var i={};for(var o in t)o in e&&(i[o]=e[o]+t[o]);return i}for(var o in t)o in e?e[o]+=t[o]:e[o]=t[o];return e},t.Index.prototype.fieldSearchStats=function(e,t,n){for(var i in n)i in e?e[i].push(t):e[i]=[t]},t.Index.prototype.coordNorm=function(e,t,n){for(var i in e)if(i in t){var o=t[i].length;e[i]=e[i]*o/n}return e},t.Index.prototype.toJSON=function(){var e={};return this._fields.forEach(function(t){e[t]=this.index[t].toJSON()},this),{version:t.version,fields:this._fields,ref:this._ref,documentStore:this.documentStore.toJSON(),index:e,pipeline:this.pipeline.toJSON()}},t.Index.prototype.use=function(e){var t=Array.prototype.slice.call(arguments,1);t.unshift(this),e.apply(this,t)},t.DocumentStore=function(e){this._save=null===e||void 0===e?!0:e,this.docs={},this.docInfo={},this.length=0},t.DocumentStore.load=function(e){var t=new this;return t.length=e.length,t.docs=e.docs,t.docInfo=e.docInfo,t._save=e.save,t},t.DocumentStore.prototype.isDocStored=function(){return this._save},t.DocumentStore.prototype.addDoc=function(t,n){this.hasDoc(t)||this.length++,this.docs[t]=this._save===!0?e(n):null},t.DocumentStore.prototype.getDoc=function(e){return this.hasDoc(e)===!1?null:this.docs[e]},t.DocumentStore.prototype.hasDoc=function(e){return e in this.docs},t.DocumentStore.prototype.removeDoc=function(e){this.hasDoc(e)&&(delete this.docs[e],delete this.docInfo[e],this.length--)},t.DocumentStore.prototype.addFieldLength=function(e,t,n){null!==e&&void 0!==e&&0!=this.hasDoc(e)&&(this.docInfo[e]||(this.docInfo[e]={}),this.docInfo[e][t]=n)},t.DocumentStore.prototype.updateFieldLength=function(e,t,n){null!==e&&void 0!==e&&0!=this.hasDoc(e)&&this.addFieldLength(e,t,n)},t.DocumentStore.prototype.getFieldLength=function(e,t){return null===e||void 0===e?0:e in this.docs&&t in this.docInfo[e]?this.docInfo[e][t]:0},t.DocumentStore.prototype.toJSON=function(){return{docs:this.docs,docInfo:this.docInfo,length:this.length,save:this._save}},t.stemmer=function(){var e={ational:"ate",tional:"tion",enci:"ence",anci:"ance",izer:"ize",bli:"ble",alli:"al",entli:"ent",eli:"e",ousli:"ous",ization:"ize",ation:"ate",ator:"ate",alism:"al",iveness:"ive",fulness:"ful",ousness:"ous",aliti:"al",iviti:"ive",biliti:"ble",logi:"log"},t={icate:"ic",ative:"",alize:"al",iciti:"ic",ical:"ic",ful:"",ness:""},n="[^aeiou]",i="[aeiouy]",o=n+"[^aeiouy]*",r=i+"[aeiou]*",s="^("+o+")?"+r+o,u="^("+o+")?"+r+o+"("+r+")?$",a="^("+o+")?"+r+o+r+o,l="^("+o+")?"+i,c=new RegExp(s),d=new RegExp(a),f=new RegExp(u),h=new RegExp(l),p=/^(.+?)(ss|i)es$/,v=/^(.+?)([^s])s$/,g=/^(.+?)eed$/,m=/^(.+?)(ed|ing)$/,y=/.$/,S=/(at|bl|iz)$/,x=new RegExp("([^aeiouylsz])\\1$"),w=new RegExp("^"+o+i+"[^aeiouwxy]$"),I=/^(.+?[^aeiou])y$/,b=/^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/,E=/^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/,D=/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/,F=/^(.+?)(s|t)(ion)$/,_=/^(.+?)e$/,P=/ll$/,k=new RegExp("^"+o+i+"[^aeiouwxy]$"),z=function(n){var i,o,r,s,u,a,l;if(n.length<3)return n;if(r=n.substr(0,1),"y"==r&&(n=r.toUpperCase()+n.substr(1)),s=p,u=v,s.test(n)?n=n.replace(s,"$1$2"):u.test(n)&&(n=n.replace(u,"$1$2")),s=g,u=m,s.test(n)){var z=s.exec(n);s=c,s.test(z[1])&&(s=y,n=n.replace(s,""))}else if(u.test(n)){var z=u.exec(n);i=z[1],u=h,u.test(i)&&(n=i,u=S,a=x,l=w,u.test(n)?n+="e":a.test(n)?(s=y,n=n.replace(s,"")):l.test(n)&&(n+="e"))}if(s=I,s.test(n)){var z=s.exec(n);i=z[1],n=i+"i"}if(s=b,s.test(n)){var z=s.exec(n);i=z[1],o=z[2],s=c,s.test(i)&&(n=i+e[o])}if(s=E,s.test(n)){var z=s.exec(n);i=z[1],o=z[2],s=c,s.test(i)&&(n=i+t[o])}if(s=D,u=F,s.test(n)){var z=s.exec(n);i=z[1],s=d,s.test(i)&&(n=i)}else if(u.test(n)){var z=u.exec(n);i=z[1]+z[2],u=d,u.test(i)&&(n=i)}if(s=_,s.test(n)){var z=s.exec(n);i=z[1],s=d,u=f,a=k,(s.test(i)||u.test(i)&&!a.test(i))&&(n=i)}return s=P,u=d,s.test(n)&&u.test(n)&&(s=y,n=n.replace(s,"")),"y"==r&&(n=r.toLowerCase()+n.substr(1)),n};return z}(),t.Pipeline.registerFunction(t.stemmer,"stemmer"),t.stopWordFilter=function(e){return e&&t.stopWordFilter.stopWords[e]!==!0?e:void 0},t.clearStopWords=function(){t.stopWordFilter.stopWords={}},t.addStopWords=function(e){null!=e&&Array.isArray(e)!==!1&&e.forEach(function(e){t.stopWordFilter.stopWords[e]=!0},this)},t.resetStopWords=function(){t.stopWordFilter.stopWords=t.defaultStopWords},t.defaultStopWords={"":!0,a:!0,able:!0,about:!0,across:!0,after:!0,all:!0,almost:!0,also:!0,am:!0,among:!0,an:!0,and:!0,any:!0,are:!0,as:!0,at:!0,be:!0,because:!0,been:!0,but:!0,by:!0,can:!0,cannot:!0,could:!0,dear:!0,did:!0,"do":!0,does:!0,either:!0,"else":!0,ever:!0,every:!0,"for":!0,from:!0,get:!0,got:!0,had:!0,has:!0,have:!0,he:!0,her:!0,hers:!0,him:!0,his:!0,how:!0,however:!0,i:!0,"if":!0,"in":!0,into:!0,is:!0,it:!0,its:!0,just:!0,least:!0,let:!0,like:!0,likely:!0,may:!0,me:!0,might:!0,most:!0,must:!0,my:!0,neither:!0,no:!0,nor:!0,not:!0,of:!0,off:!0,often:!0,on:!0,only:!0,or:!0,other:!0,our:!0,own:!0,rather:!0,said:!0,say:!0,says:!0,she:!0,should:!0,since:!0,so:!0,some:!0,than:!0,that:!0,the:!0,their:!0,them:!0,then:!0,there:!0,these:!0,they:!0,"this":!0,tis:!0,to:!0,too:!0,twas:!0,us:!0,wants:!0,was:!0,we:!0,were:!0,what:!0,when:!0,where:!0,which:!0,"while":!0,who:!0,whom:!0,why:!0,will:!0,"with":!0,would:!0,yet:!0,you:!0,your:!0},t.stopWordFilter.stopWords=t.defaultStopWords,t.Pipeline.registerFunction(t.stopWordFilter,"stopWordFilter"),t.trimmer=function(e){if(null===e||void 0===e)throw new Error("token should not be undefined");return e.replace(/^\W+/,"").replace(/\W+$/,"")},t.Pipeline.registerFunction(t.trimmer,"trimmer"),t.InvertedIndex=function(){this.root={docs:{},df:0}},t.InvertedIndex.load=function(e){var t=new this;return t.root=e.root,t},t.InvertedIndex.prototype.addToken=function(e,t,n){for(var n=n||this.root,i=0;i<=e.length-1;){var o=e[i];o in n||(n[o]={docs:{},df:0}),i+=1,n=n[o]}var r=t.ref;n.docs[r]?n.docs[r]={tf:t.tf}:(n.docs[r]={tf:t.tf},n.df+=1)},t.InvertedIndex.prototype.hasToken=function(e){if(!e)return!1;for(var t=this.root,n=0;n<e.length;n++){if(!t[e[n]])return!1;t=t[e[n]]}return!0},t.InvertedIndex.prototype.getNode=function(e){if(!e)return null;for(var t=this.root,n=0;n<e.length;n++){if(!t[e[n]])return null;t=t[e[n]]}return t},t.InvertedIndex.prototype.getDocs=function(e){var t=this.getNode(e);return null==t?{}:t.docs},t.InvertedIndex.prototype.getTermFrequency=function(e,t){var n=this.getNode(e);return null==n?0:t in n.docs?n.docs[t].tf:0},t.InvertedIndex.prototype.getDocFreq=function(e){var t=this.getNode(e);return null==t?0:t.df},t.InvertedIndex.prototype.removeToken=function(e,t){if(e){var n=this.getNode(e);null!=n&&t in n.docs&&(delete n.docs[t],n.df-=1)}},t.InvertedIndex.prototype.expandToken=function(e,t,n){if(null==e||""==e)return[];var t=t||[];if(void 0==n&&(n=this.getNode(e),null==n))return t;n.df>0&&t.push(e);for(var i in n)"docs"!==i&&"df"!==i&&this.expandToken(e+i,t,n[i]);return t},t.InvertedIndex.prototype.toJSON=function(){return{root:this.root}},t.Configuration=function(e,n){var e=e||"";if(void 0==n||null==n)throw new Error("fields should not be null");this.config={};var i;try{i=JSON.parse(e),this.buildUserConfig(i,n)}catch(o){t.utils.warn("user configuration parse failed, will use default configuration"),this.buildDefaultConfig(n)}},t.Configuration.prototype.buildDefaultConfig=function(e){this.reset(),e.forEach(function(e){this.config[e]={boost:1,bool:"OR",expand:!1}},this)},t.Configuration.prototype.buildUserConfig=function(e,n){var i="OR",o=!1;if(this.reset(),"bool"in e&&(i=e.bool||i),"expand"in e&&(o=e.expand||o),"fields"in e)for(var r in e.fields)if(n.indexOf(r)>-1){var s=e.fields[r],u=o;void 0!=s.expand&&(u=s.expand),this.config[r]={boost:s.boost||0===s.boost?s.boost:1,bool:s.bool||i,expand:u}}else t.utils.warn("field name in user configuration not found in index instance fields");else this.addAllFields2UserConfig(i,o,n)},t.Configuration.prototype.addAllFields2UserConfig=function(e,t,n){n.forEach(function(n){this.config[n]={boost:1,bool:e,expand:t}},this)},t.Configuration.prototype.get=function(){return this.config},t.Configuration.prototype.reset=function(){this.config={}},lunr.SortedSet=function(){this.length=0,this.elements=[]},lunr.SortedSet.load=function(e){var t=new this;return t.elements=e,t.length=e.length,t},lunr.SortedSet.prototype.add=function(){var e,t;for(e=0;e<arguments.length;e++)t=arguments[e],~this.indexOf(t)||this.elements.splice(this.locationFor(t),0,t);this.length=this.elements.length},lunr.SortedSet.prototype.toArray=function(){return this.elements.slice()},lunr.SortedSet.prototype.map=function(e,t){return this.elements.map(e,t)},lunr.SortedSet.prototype.forEach=function(e,t){return this.elements.forEach(e,t)},lunr.SortedSet.prototype.indexOf=function(e){for(var t=0,n=this.elements.length,i=n-t,o=t+Math.floor(i/2),r=this.elements[o];i>1;){if(r===e)return o;e>r&&(t=o),r>e&&(n=o),i=n-t,o=t+Math.floor(i/2),r=this.elements[o]}return r===e?o:-1},lunr.SortedSet.prototype.locationFor=function(e){for(var t=0,n=this.elements.length,i=n-t,o=t+Math.floor(i/2),r=this.elements[o];i>1;)e>r&&(t=o),r>e&&(n=o),i=n-t,o=t+Math.floor(i/2),r=this.elements[o];return r>e?o:e>r?o+1:void 0},lunr.SortedSet.prototype.intersect=function(e){for(var t=new lunr.SortedSet,n=0,i=0,o=this.length,r=e.length,s=this.elements,u=e.elements;;){if(n>o-1||i>r-1)break;s[n]!==u[i]?s[n]<u[i]?n++:s[n]>u[i]&&i++:(t.add(s[n]),n++,i++)}return t},lunr.SortedSet.prototype.clone=function(){var e=new lunr.SortedSet;return e.elements=this.toArray(),e.length=e.elements.length,e},lunr.SortedSet.prototype.union=function(e){var t,n,i;this.length>=e.length?(t=this,n=e):(t=e,n=this),i=t.clone();for(var o=0,r=n.toArray();o<r.length;o++)i.add(r[o]);return i},lunr.SortedSet.prototype.toJSON=function(){return this.toArray()},function(e,t){"function"==typeof define&&define.amd?define(t):"object"==typeof exports?module.exports=t():e.elasticlunr=t()}(this,function(){return t})}();
    /** pdoc search index */const docs = [{"fullname": "quantive", "modulename": "quantive", "kind": "module", "doc": "<p><!-- Improved compatibility of back to top link: See: <a href=\"https://github.com/othneildrew/Best-README-Template/pull/73\">https://github.com/othneildrew/Best-README-Template/pull/73</a> -->\n<a name=\"readme-top\"></a>\n<!--\n<strong>* Thanks for checking out the Best-README-Template. If you have a suggestion\n<em></strong> that would make this better, please fork the repo and create a pull request\n<strong></em> or simply open an issue with the tag \"enhancement\".\n<em></strong> Don't forget to give the project a star!\n*</em>* Thanks again! Now go create something AMAZING! :D\n--></p>\n\n<p><!-- PROJECT SHIELDS -->\n<!--\n<strong>* I'm using markdown \"reference style\" links for readability.\n<em></strong> Reference links are enclosed in brackets [ ] instead of parentheses ( ).\n<strong></em> See the bottom of this document for the declaration of the reference variables\n<em></strong> for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.\n*</em>* <a href=\"https://www.markdownguide.org/basic-syntax/#reference-style-links\">https://www.markdownguide.org/basic-syntax/#reference-style-links</a>\n-->\n<a href=\"https://github.com/jrfarah/quantive/graphs/contributors\"><img src=\"https://img.shields.io/github/contributors/jrfarah/quantive.svg?style=for-the-badge\" alt=\"Contributors\" /></a>\n<a href=\"https://github.com/jrfarah/quantive/network/members\"><img src=\"https://img.shields.io/github/forks/jrfarah/quantive.svg?style=for-the-badge\" alt=\"Forks\" /></a>\n<a href=\"https://github.com/jrfarah/quantive/stargazers\"><img src=\"https://img.shields.io/github/stars/jrfarah/quantive.svg?style=for-the-badge\" alt=\"Stargazers\" /></a>\n<a href=\"https://github.com/jrfarah/quantive/issues\"><img src=\"https://img.shields.io/github/issues/jrfarah/quantive.svg?style=for-the-badge\" alt=\"Issues\" /></a>\n<a href=\"https://github.com/jrfarah/quantive/blob/master/LICENSE.txt\"><img src=\"https://img.shields.io/github/license/jrfarah/quantive.svg?style=for-the-badge\" alt=\"GPL-3.0 License\" /></a>\n<!-- <a href=\"https://linkedin.com/in/linkedin_username\"><img src=\"https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&amp;logo=linkedin&amp;colorB=555\" alt=\"LinkedIn\" /></a> --></p>\n\n<p><!-- PROJECT LOGO -->\n<br/>\n<!-- <div align=\"center\">\n  <a href=\"https://github.com/jrfarah/quantive\">\n    <img src=\"images/logo.png\" alt=\"Logo\" width=\"80\" height=\"80\">\n  </a> --></p>\n\n<h3 align=\"center\">quantive</h3>\n\n<p><p align=\"center\">\n    Quantive will be an open-source package for stock market analysis and trading. This package will be modular and customizable, interfacing with several major exchanges and providing analysis, execution, and logging capabilities.\n    <br />\n    <a href=\"https://jrfarah.github.io/quantive/\"><strong>Explore the docs \u00bb</strong></a>\n    <br />\n    <br />\n    <!-- <a href=\"https://github.com/jrfarah/quantive\">View Demo</a> -->\n    \u00b7\n    <a href=\"https://github.com/jrfarah/quantive/issues\">Report Bug</a>\n    \u00b7\n    <a href=\"https://github.com/jrfarah/quantive/issues\">Request Feature</a>\n  </p>\n</div></p>\n\n<p><!-- TABLE OF CONTENTS -->\n<details>\n  <summary>Table of Contents</summary>\n  <ol>\n    <li>\n      <a href=\"#about-the-project\">About The Project</a>\n      <ul>\n        <li><a href=\"#built-with\">Built With</a></li>\n      </ul>\n    </li>\n    <li>\n      <a href=\"#getting-started\">Getting Started</a>\n      <ul>\n        <li><a href=\"#prerequisites\">Prerequisites</a></li>\n        <li><a href=\"#installation\">Installation</a></li>\n      </ul>\n    </li>\n    <li><a href=\"#usage\">Usage</a></li>\n    <li><a href=\"#roadmap\">Roadmap</a></li>\n    <li><a href=\"#contributing\">Contributing</a></li>\n    <li><a href=\"#license\">License</a></li>\n    <li><a href=\"#contact\">Contact</a></li>\n    <li><a href=\"#acknowledgments\">Acknowledgments</a></li>\n  </ol>\n</details></p>\n\n<p><!-- ABOUT THE PROJECT --></p>\n\n<h2 id=\"about-the-project\">About The Project</h2>\n\n<p><!-- <a href=\"https://example.com\"><img src=\"images/screenshot.png\" alt=\"Product Name Screen Shot\" /></a> --></p>\n\n<p>Quantive will be an open-source package for stock market analysis and trading. This package will be modular and customizable, interfacing with several major exchanges and providing analysis, execution, and logging capabilities. </p>\n\n<p>Quantive will be built on a monitor-buy-monitor-sell-record framework.</p>\n\n<p>\ud83d\udea7\ud83d\udea7 Under construction \ud83d\udea7\ud83d\udea7</p>\n\n<p align=\"right\">(<a href=\"#readme-top\">back to top</a>)</p>\n\n<h3 id=\"built-with\">Built With</h3>\n\n<p><a href=\"https://www.python.org/\"><img src=\"https://img.shields.io/badge/python-20232A?style=for-the-badge&amp;logo=python&amp;logoColor=white\" alt=\"Python\" /></a><a href=\"https://getbootstrap.com\"><img src=\"https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&amp;logo=bootstrap&amp;logoColor=white\" alt=\"Bootstrap\" /></a><a href=\"https://cplusplus.com/\"><img src=\"https://img.shields.io/badge/c++-0769AD?style=for-the-badge&amp;logo=c++&amp;logoColor=white\" alt=\"C++\" /></a></p>\n\n<p align=\"right\">(<a href=\"#readme-top\">back to top</a>)</p>\n\n<p><!-- GETTING STARTED --></p>\n\n<h2 id=\"getting-started\">Getting Started</h2>\n\n<p>Eventually, we will make this software <code>pip</code> installable.</p>\n\n<p>\ud83d\udea7\ud83d\udea7 Under construction \ud83d\udea7\ud83d\udea7</p>\n\n<h3 id=\"prerequisites\">Prerequisites</h3>\n\n<p><pre><code>conda activate quantive\npip install -r requirements.txt\n</code></pre></p>\n\n<h3 id=\"installation\">Installation</h3>\n\n<p>\ud83d\udea7\ud83d\udea7 Under construction \ud83d\udea7\ud83d\udea7</p>\n\n<p><!-- 1. Get a free API Key at <a href=\"https://example.com\">https://example.com</a></p>\n\n<ol start=\"2\">\n<li>Clone the repo\n<div class=\"pdoc-code codehilite\">\n<pre><span></span><code>git<span class=\"w\"> </span>clone<span class=\"w\"> </span><a href=\"https://github.com/jrfarah/quantive.git\">https://github.com/jrfarah/quantive.git</a>\n</code></pre>\n</div></li>\n</ol>\n\n<ol start=\"3\">\n<li><p>Install NPM packages</p>\n\n<div class=\"pdoc-code codehilite\">\n<pre><span></span><code>npm<span class=\"w\"> </span>install\n</code></pre>\n</div></li>\n<li><p>Enter your API in <code>config.js</code></p>\n\n<div class=\"pdoc-code codehilite\">\n<pre><span></span><code><span class=\"kd\">const</span><span class=\"w\"> </span><span class=\"nx\">API_KEY</span><span class=\"w\"> </span><span class=\"o\">=</span><span class=\"w\"> </span><span class=\"s1\">&#39;ENTER YOUR API&#39;</span><span class=\"p\">;</span>\n</code></pre>\n</div></li>\n</ol>\n\n<p align=\"right\">(<a href=\"#readme-top\">back to top</a>)</p>\n\n<p>--></p>\n\n<p><!-- USAGE EXAMPLES --></p>\n\n<h2 id=\"usage\">Usage</h2>\n\n<p>_For more examples, please refer to the <a href=\"https://example.com\">Documentation</a>_</p>\n\n<p>\ud83d\udea7\ud83d\udea7 Under construction \ud83d\udea7\ud83d\udea7</p>\n\n<p align=\"right\">(<a href=\"#readme-top\">back to top</a>)</p>\n\n<p><!-- ROADMAP --></p>\n\n<h2 id=\"roadmap\">Roadmap</h2>\n\n<p>The roadmap for the software will be laid out here. Minor functionality will be grouped under major features. Once all the desired functionality for a particular feature is implemented, it will be removed, and information about the feature will be accessible in the documentation.</p>\n\n<ul>\n<li><input type=\"checkbox\" class=\"task-list-item-checkbox\" checked disabled> <s>Set up documentation</s> (documentation now running on <code>pdoc</code>)</li>\n<li><input type=\"checkbox\" class=\"task-list-item-checkbox\" disabled> Set up project structure\n<ul>\n<li><input type=\"checkbox\" class=\"task-list-item-checkbox\" checked disabled> Finalize organization</li>\n<li><input type=\"checkbox\" class=\"task-list-item-checkbox\" disabled> Make installable</li>\n</ul></li>\n<li><input type=\"checkbox\" class=\"task-list-item-checkbox\" disabled> Pipeline\n<ul>\n<li><input type=\"checkbox\" class=\"task-list-item-checkbox\" disabled> Make barebones pipeline that calls and incorporates all modules</li>\n<li><input type=\"checkbox\" class=\"task-list-item-checkbox\" disabled> Configuration\n<ul>\n<li><input type=\"checkbox\" class=\"task-list-item-checkbox\" disabled> Decide on configuration method (how to change pipeline settings?)</li>\n</ul></li>\n</ul></li>\n<li><input type=\"checkbox\" class=\"task-list-item-checkbox\" disabled> Monitor\n<ul>\n<li><input type=\"checkbox\" class=\"task-list-item-checkbox\" disabled> Construct simple proof-of-concept module</li>\n</ul></li>\n<li><input type=\"checkbox\" class=\"task-list-item-checkbox\" disabled> Buy\n<ul>\n<li><input type=\"checkbox\" class=\"task-list-item-checkbox\" disabled> Construct simple proof-of-concept module</li>\n</ul></li>\n<li><input type=\"checkbox\" class=\"task-list-item-checkbox\" disabled> Sell\n<ul>\n<li><input type=\"checkbox\" class=\"task-list-item-checkbox\" disabled> Construct simple proof-of-concept module</li>\n</ul></li>\n<li><input type=\"checkbox\" class=\"task-list-item-checkbox\" disabled> Record\n<ul>\n<li><input type=\"checkbox\" class=\"task-list-item-checkbox\" disabled> Construct simple proof-of-concept module</li>\n<li><input type=\"checkbox\" class=\"task-list-item-checkbox\" disabled> Test HTML interfaces</li>\n</ul></li>\n<li><input type=\"checkbox\" class=\"task-list-item-checkbox\" disabled> Analysis\n<ul>\n<li><input type=\"checkbox\" class=\"task-list-item-checkbox\" disabled> Develop core list of functions to impelement</li>\n</ul></li>\n</ul>\n\n<p>See the <a href=\"https://github.com/jrfarah/quantive/issues\">open issues</a> for a full list of proposed features (and known issues).</p>\n\n<p align=\"right\">(<a href=\"#readme-top\">back to top</a>)</p>\n\n<p><!-- CONTRIBUTING --></p>\n\n<h2 id=\"contributing\">Contributing</h2>\n\n<p>Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are <strong>greatly appreciated</strong>.</p>\n\n<p>If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag \"enhancement\".\nDon't forget to give the project a star! Thanks :)</p>\n\n<ol>\n<li>Fork the Project</li>\n<li>Create your Feature Branch (<code>git checkout -b feature/AmazingFeature</code>)</li>\n<li>Commit your Changes (<code>git commit -m 'Add some AmazingFeature'</code>)</li>\n<li>Push to the Branch (<code>git push origin feature/AmazingFeature</code>)</li>\n<li>Open a Pull Request</li>\n</ol>\n\n<p align=\"right\">(<a href=\"#readme-top\">back to top</a>)</p>\n\n<p><!-- LICENSE --></p>\n\n<h2 id=\"license\">License</h2>\n\n<p>Distributed under the GPLv3.0 License. See <code>LICENSE.txt</code> for more information.</p>\n\n<p align=\"right\">(<a href=\"#readme-top\">back to top</a>)</p>\n\n<p><!-- CONTACT --></p>\n\n<h2 id=\"contact\">Contact</h2>\n\n<p>Joseph Farah - <a href=\"mailto:jfarah@lco.global\">jfarah@lco.global</a> - <a href=\"http://jrfarah.com\">jrfarah.com</a></p>\n\n<p>Project Link: <a href=\"https://github.com/jrfarah/quantive\">https://github.com/jrfarah/quantive</a></p>\n\n<p align=\"right\">(<a href=\"#readme-top\">back to top</a>)</p>\n\n<p><!-- ACKNOWLEDGMENTS --></p>\n\n<h2 id=\"acknowledgments\">Acknowledgments</h2>\n\n<p>\ud83d\udea7\ud83d\udea7 Under construction \ud83d\udea7\ud83d\udea7</p>\n\n<p align=\"right\">(<a href=\"#readme-top\">back to top</a>)</p>\n\n<p><!-- MARKDOWN LINKS &amp; IMAGES -->\n<!-- <a href=\"https://www.markdownguide.org/basic-syntax/#reference-style-links\">https://www.markdownguide.org/basic-syntax/#reference-style-links</a> --></p>\n"}, {"fullname": "quantive.analysis", "modulename": "quantive.analysis", "kind": "module", "doc": "<p></p>\n"}, {"fullname": "quantive.buy", "modulename": "quantive.buy", "kind": "module", "doc": "<p></p>\n"}, {"fullname": "quantive.config", "modulename": "quantive.config", "kind": "module", "doc": "<p>====================================</p>\n\n<ul>\n<li><strong>Filename</strong>:         config.py </li>\n<li><strong>Author</strong>:              Joseph Farah </li>\n<li><strong>Description</strong>:       Writes and reads custom quantive configuration files.</li>\n</ul>\n\n<p>====================================</p>\n\n<p><strong>Notes</strong></p>\n"}, {"fullname": "quantive.config.ConfigurationObject", "modulename": "quantive.config", "qualname": "ConfigurationObject", "kind": "class", "doc": "<p>Object to write and read configuration files. \nObject of this type will be passed to pipeline as settings.</p>\n"}, {"fullname": "quantive.config.ConfigurationObject.__init__", "modulename": "quantive.config", "qualname": "ConfigurationObject.__init__", "kind": "function", "doc": "<p></p>\n", "signature": "<span class=\"signature pdoc-code condensed\">(<span class=\"param\"><span class=\"n\">config_file</span><span class=\"p\">:</span> <span class=\"n\">Union</span><span class=\"p\">[</span><span class=\"nb\">str</span><span class=\"p\">,</span> <span class=\"nb\">dict</span><span class=\"p\">]</span></span>)</span>"}, {"fullname": "quantive.config.ConfigurationObject.config", "modulename": "quantive.config", "qualname": "ConfigurationObject.config", "kind": "variable", "doc": "<p>Configuration file or dictionary</p>\n"}, {"fullname": "quantive.config.ConfigurationObject.load", "modulename": "quantive.config", "qualname": "ConfigurationObject.load", "kind": "function", "doc": "<p>Load in a configuration file from a filepath.</p>\n\n<p><strong>Args</strong>:</p>\n\n<ul>\n<li>_fpath (str): Path to configuration file.</li>\n</ul>\n\n<p><strong>Returns</strong>:</p>\n\n<ul>\n<li>config_dict (dict): Dictionary containing config settings</li>\n</ul>\n", "signature": "<span class=\"signature pdoc-code condensed\">(<span class=\"param\"><span class=\"bp\">self</span>, </span><span class=\"param\"><span class=\"n\">_fpath</span><span class=\"p\">:</span> <span class=\"nb\">str</span></span><span class=\"return-annotation\">) -> <span class=\"nb\">dict</span>:</span></span>", "funcdef": "def"}, {"fullname": "quantive.config.ConfigurationObject.update_key", "modulename": "quantive.config", "qualname": "ConfigurationObject.update_key", "kind": "function", "doc": "<p>Update a key in the configuration with a new value. \nModifies the configuration object in place.</p>\n\n<p><strong>Args</strong>:</p>\n\n<ul>\n<li>group (str): group (e.g., CONNECT, BUY, etc)</li>\n<li>key (str): existing key to update</li>\n<li>new_value (str): new value corresponding to key</li>\n</ul>\n\n<p><strong>Returns</strong>:</p>\n\n<ul>\n<li>none (none): none</li>\n</ul>\n", "signature": "<span class=\"signature pdoc-code condensed\">(<span class=\"param\"><span class=\"bp\">self</span>, </span><span class=\"param\"><span class=\"n\">group</span><span class=\"p\">:</span> <span class=\"nb\">str</span>, </span><span class=\"param\"><span class=\"n\">key</span><span class=\"p\">:</span> <span class=\"nb\">str</span>, </span><span class=\"param\"><span class=\"n\">new_value</span><span class=\"p\">:</span> <span class=\"nb\">str</span></span><span class=\"return-annotation\">):</span></span>", "funcdef": "def"}, {"fullname": "quantive.config.ConfigurationObject.add_key", "modulename": "quantive.config", "qualname": "ConfigurationObject.add_key", "kind": "function", "doc": "<p>Adds a setting to the configuration.</p>\n\n<p><strong>Args</strong>:</p>\n\n<ul>\n<li>key (str): new key to add </li>\n<li>value (str): new value corresponding to key</li>\n</ul>\n\n<p><strong>Returns</strong>:</p>\n\n<ul>\n<li>none (none): none</li>\n</ul>\n", "signature": "<span class=\"signature pdoc-code condensed\">(<span class=\"param\"><span class=\"bp\">self</span>, </span><span class=\"param\"><span class=\"n\">group</span><span class=\"p\">:</span> <span class=\"nb\">str</span>, </span><span class=\"param\"><span class=\"n\">key</span><span class=\"p\">:</span> <span class=\"nb\">str</span>, </span><span class=\"param\"><span class=\"n\">value</span><span class=\"p\">:</span> <span class=\"nb\">str</span></span><span class=\"return-annotation\">):</span></span>", "funcdef": "def"}, {"fullname": "quantive.config.ConfigurationObject.remove_key", "modulename": "quantive.config", "qualname": "ConfigurationObject.remove_key", "kind": "function", "doc": "<p>remove setting from the configuration.  </p>\n\n<p><strong>Args</strong>:</p>\n\n<ul>\n<li>group (str): group (e.g., CONNECT, BUY, etc)</li>\n<li>key (str): existing key to remove. Put NONE to remove\nentire group.</li>\n</ul>\n\n<p><strong>Returns</strong>:</p>\n\n<ul>\n<li>none (none): none</li>\n</ul>\n", "signature": "<span class=\"signature pdoc-code condensed\">(<span class=\"param\"><span class=\"bp\">self</span>, </span><span class=\"param\"><span class=\"n\">group</span><span class=\"p\">:</span> <span class=\"nb\">str</span>, </span><span class=\"param\"><span class=\"n\">key</span><span class=\"p\">:</span> <span class=\"nb\">str</span></span><span class=\"return-annotation\">):</span></span>", "funcdef": "def"}, {"fullname": "quantive.config.ConfigurationObject.save", "modulename": "quantive.config", "qualname": "ConfigurationObject.save", "kind": "function", "doc": "<p>Saves the configuration to a file.</p>\n\n<p><strong>Args</strong>:</p>\n\n<ul>\n<li>_output_fpath (str): filepath of the saved config</li>\n</ul>\n\n<p><strong>Returns</strong>:</p>\n\n<ul>\n<li>none (none): none</li>\n</ul>\n", "signature": "<span class=\"signature pdoc-code condensed\">(<span class=\"param\"><span class=\"bp\">self</span>, </span><span class=\"param\"><span class=\"n\">_output_fpath</span><span class=\"p\">:</span> <span class=\"nb\">str</span></span><span class=\"return-annotation\">):</span></span>", "funcdef": "def"}, {"fullname": "quantive.config.main", "modulename": "quantive.config", "qualname": "main", "kind": "function", "doc": "<p>Test load and editing of config file.</p>\n\n<p><strong>Args</strong>:</p>\n\n<ul>\n<li>none (none): none</li>\n</ul>\n\n<p><strong>Returns</strong>:</p>\n\n<ul>\n<li>none (none): none</li>\n</ul>\n", "signature": "<span class=\"signature pdoc-code condensed\">(<span class=\"return-annotation\">):</span></span>", "funcdef": "def"}, {"fullname": "quantive.monitor", "modulename": "quantive.monitor", "kind": "module", "doc": "<p></p>\n"}, {"fullname": "quantive.pipeline", "modulename": "quantive.pipeline", "kind": "module", "doc": "<p>====================================</p>\n\n<ul>\n<li><strong>Filename</strong>:         pipeline.py </li>\n<li><strong>Author</strong>:              Joseph Farah </li>\n<li><strong>Description</strong>:       The main QUANTIVE pipeline. Brings all the \nmodules together into one cohesive functionality. Additionally serves\nas an example for how QUANTIVE can be used by you, if you wish to construct\nyour own pipeline.</li>\n</ul>\n\n<p>====================================</p>\n\n<p><strong>Notes</strong></p>\n\n<ul>\n<li>Under active development. This pipeline is not a substitute for \nthe unit testing.</li>\n</ul>\n"}, {"fullname": "quantive.record", "modulename": "quantive.record", "kind": "module", "doc": "<p></p>\n"}, {"fullname": "quantive.sell", "modulename": "quantive.sell", "kind": "module", "doc": "<p></p>\n"}];

    // mirrored in build-search-index.js (part 1)
    // Also split on html tags. this is a cheap heuristic, but good enough.
    elasticlunr.tokenizer.setSeperator(/[\s\-.;&_'"=,()]+|<[^>]*>/);

    let searchIndex;
    if (docs._isPrebuiltIndex) {
        console.info("using precompiled search index");
        searchIndex = elasticlunr.Index.load(docs);
    } else {
        console.time("building search index");
        // mirrored in build-search-index.js (part 2)
        searchIndex = elasticlunr(function () {
            this.pipeline.remove(elasticlunr.stemmer);
            this.pipeline.remove(elasticlunr.stopWordFilter);
            this.addField("qualname");
            this.addField("fullname");
            this.addField("annotation");
            this.addField("default_value");
            this.addField("signature");
            this.addField("bases");
            this.addField("doc");
            this.setRef("fullname");
        });
        for (let doc of docs) {
            searchIndex.addDoc(doc);
        }
        console.timeEnd("building search index");
    }

    return (term) => searchIndex.search(term, {
        fields: {
            qualname: {boost: 4},
            fullname: {boost: 2},
            annotation: {boost: 2},
            default_value: {boost: 2},
            signature: {boost: 2},
            bases: {boost: 2},
            doc: {boost: 1},
        },
        expand: true
    });
})();