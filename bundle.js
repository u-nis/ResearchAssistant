(()=>{var F;(function(t){t.STRING="string",t.NUMBER="number",t.INTEGER="integer",t.BOOLEAN="boolean",t.ARRAY="array",t.OBJECT="object"})(F||(F={}));var $;(function(t){t.LANGUAGE_UNSPECIFIED="language_unspecified",t.PYTHON="python"})($||($={}));var G;(function(t){t.OUTCOME_UNSPECIFIED="outcome_unspecified",t.OUTCOME_OK="outcome_ok",t.OUTCOME_FAILED="outcome_failed",t.OUTCOME_DEADLINE_EXCEEDED="outcome_deadline_exceeded"})(G||(G={}));var j=["user","model","function","system"],K;(function(t){t.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",t.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",t.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",t.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",t.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT"})(K||(K={}));var k;(function(t){t.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",t.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",t.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",t.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",t.BLOCK_NONE="BLOCK_NONE"})(k||(k={}));var Y;(function(t){t.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",t.NEGLIGIBLE="NEGLIGIBLE",t.LOW="LOW",t.MEDIUM="MEDIUM",t.HIGH="HIGH"})(Y||(Y={}));var B;(function(t){t.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",t.SAFETY="SAFETY",t.OTHER="OTHER"})(B||(B={}));var R;(function(t){t.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",t.STOP="STOP",t.MAX_TOKENS="MAX_TOKENS",t.SAFETY="SAFETY",t.RECITATION="RECITATION",t.LANGUAGE="LANGUAGE",t.OTHER="OTHER"})(R||(R={}));var P;(function(t){t.TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",t.RETRIEVAL_QUERY="RETRIEVAL_QUERY",t.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",t.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",t.CLASSIFICATION="CLASSIFICATION",t.CLUSTERING="CLUSTERING"})(P||(P={}));var q;(function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.AUTO="AUTO",t.ANY="ANY",t.NONE="NONE"})(q||(q={}));var V;(function(t){t.MODE_UNSPECIFIED="MODE_UNSPECIFIED",t.MODE_DYNAMIC="MODE_DYNAMIC"})(V||(V={}));var u=class extends Error{constructor(e){super(`[GoogleGenerativeAI Error]: ${e}`)}},E=class extends u{constructor(e,n){super(e),this.response=n}},w=class extends u{constructor(e,n,s,o){super(e),this.status=n,this.statusText=s,this.errorDetails=o}},g=class extends u{};var nt="https://generativelanguage.googleapis.com",st="v1beta",ot="0.21.0",it="genai-js",_;(function(t){t.GENERATE_CONTENT="generateContent",t.STREAM_GENERATE_CONTENT="streamGenerateContent",t.COUNT_TOKENS="countTokens",t.EMBED_CONTENT="embedContent",t.BATCH_EMBED_CONTENTS="batchEmbedContents"})(_||(_={}));var M=class{constructor(e,n,s,o,i){this.model=e,this.task=n,this.apiKey=s,this.stream=o,this.requestOptions=i}toString(){var e,n;let s=((e=this.requestOptions)===null||e===void 0?void 0:e.apiVersion)||st,i=`${((n=this.requestOptions)===null||n===void 0?void 0:n.baseUrl)||nt}/${s}/${this.model}:${this.task}`;return this.stream&&(i+="?alt=sse"),i}};function at(t){let e=[];return t?.apiClient&&e.push(t.apiClient),e.push(`${it}/${ot}`),e.join(" ")}async function rt(t){var e;let n=new Headers;n.append("Content-Type","application/json"),n.append("x-goog-api-client",at(t.requestOptions)),n.append("x-goog-api-key",t.apiKey);let s=(e=t.requestOptions)===null||e===void 0?void 0:e.customHeaders;if(s){if(!(s instanceof Headers))try{s=new Headers(s)}catch(o){throw new g(`unable to convert customHeaders value ${JSON.stringify(s)} to Headers: ${o.message}`)}for(let[o,i]of s.entries()){if(o==="x-goog-api-key")throw new g(`Cannot set reserved header name ${o}`);if(o==="x-goog-api-client")throw new g(`Header name ${o} can only be set using the apiClient field`);n.append(o,i)}}return n}async function ct(t,e,n,s,o,i){let a=new M(t,e,n,s,i);return{url:a.toString(),fetchOptions:Object.assign(Object.assign({},ft(i)),{method:"POST",headers:await rt(a),body:o})}}async function A(t,e,n,s,o,i={},a=fetch){let{url:r,fetchOptions:d}=await ct(t,e,n,s,o,i);return dt(r,d,a)}async function dt(t,e,n=fetch){let s;try{s=await n(t,e)}catch(o){lt(o,t)}return s.ok||await ut(s,t),s}function lt(t,e){let n=t;throw t instanceof w||t instanceof g||(n=new u(`Error fetching from ${e.toString()}: ${t.message}`),n.stack=t.stack),n}async function ut(t,e){let n="",s;try{let o=await t.json();n=o.error.message,o.error.details&&(n+=` ${JSON.stringify(o.error.details)}`,s=o.error.details)}catch{}throw new w(`Error fetching from ${e.toString()}: [${t.status} ${t.statusText}] ${n}`,t.status,t.statusText,s)}function ft(t){let e={};if(t?.signal!==void 0||t?.timeout>=0){let n=new AbortController;t?.timeout>=0&&setTimeout(()=>n.abort(),t.timeout),t?.signal&&t.signal.addEventListener("abort",()=>{n.abort()}),e.signal=n.signal}return e}function L(t){return t.text=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),N(t.candidates[0]))throw new E(`${C(t)}`,t);return ht(t)}else if(t.promptFeedback)throw new E(`Text not available. ${C(t)}`,t);return""},t.functionCall=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),N(t.candidates[0]))throw new E(`${C(t)}`,t);return console.warn("response.functionCall() is deprecated. Use response.functionCalls() instead."),J(t)[0]}else if(t.promptFeedback)throw new E(`Function call not available. ${C(t)}`,t)},t.functionCalls=()=>{if(t.candidates&&t.candidates.length>0){if(t.candidates.length>1&&console.warn(`This response had ${t.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),N(t.candidates[0]))throw new E(`${C(t)}`,t);return J(t)}else if(t.promptFeedback)throw new E(`Function call not available. ${C(t)}`,t)},t}function ht(t){var e,n,s,o;let i=[];if(!((n=(e=t.candidates)===null||e===void 0?void 0:e[0].content)===null||n===void 0)&&n.parts)for(let a of(o=(s=t.candidates)===null||s===void 0?void 0:s[0].content)===null||o===void 0?void 0:o.parts)a.text&&i.push(a.text),a.executableCode&&i.push("\n```"+a.executableCode.language+`
`+a.executableCode.code+"\n```\n"),a.codeExecutionResult&&i.push("\n```\n"+a.codeExecutionResult.output+"\n```\n");return i.length>0?i.join(""):""}function J(t){var e,n,s,o;let i=[];if(!((n=(e=t.candidates)===null||e===void 0?void 0:e[0].content)===null||n===void 0)&&n.parts)for(let a of(o=(s=t.candidates)===null||s===void 0?void 0:s[0].content)===null||o===void 0?void 0:o.parts)a.functionCall&&i.push(a.functionCall);if(i.length>0)return i}var gt=[R.RECITATION,R.SAFETY,R.LANGUAGE];function N(t){return!!t.finishReason&&gt.includes(t.finishReason)}function C(t){var e,n,s;let o="";if((!t.candidates||t.candidates.length===0)&&t.promptFeedback)o+="Response was blocked",!((e=t.promptFeedback)===null||e===void 0)&&e.blockReason&&(o+=` due to ${t.promptFeedback.blockReason}`),!((n=t.promptFeedback)===null||n===void 0)&&n.blockReasonMessage&&(o+=`: ${t.promptFeedback.blockReasonMessage}`);else if(!((s=t.candidates)===null||s===void 0)&&s[0]){let i=t.candidates[0];N(i)&&(o+=`Candidate was blocked due to ${i.finishReason}`,i.finishMessage&&(o+=`: ${i.finishMessage}`))}return o}function I(t){return this instanceof I?(this.v=t,this):new I(t)}function Et(t,e,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var s=n.apply(t,e||[]),o,i=[];return o={},a("next"),a("throw"),a("return"),o[Symbol.asyncIterator]=function(){return this},o;function a(l){s[l]&&(o[l]=function(c){return new Promise(function(f,y){i.push([l,c,f,y])>1||r(l,c)})})}function r(l,c){try{d(s[l](c))}catch(f){O(i[0][3],f)}}function d(l){l.value instanceof I?Promise.resolve(l.value.v).then(h,v):O(i[0][2],l)}function h(l){r("next",l)}function v(l){r("throw",l)}function O(l,c){l(c),i.shift(),i.length&&r(i[0][0],i[0][1])}}var W=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;function Ct(t){let e=t.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),n=vt(e),[s,o]=n.tee();return{stream:pt(s),response:_t(o)}}async function _t(t){let e=[],n=t.getReader();for(;;){let{done:s,value:o}=await n.read();if(s)return L(Ot(e));e.push(o)}}function pt(t){return Et(this,arguments,function*(){let n=t.getReader();for(;;){let{value:s,done:o}=yield I(n.read());if(o)break;yield yield I(L(s))}})}function vt(t){let e=t.getReader();return new ReadableStream({start(s){let o="";return i();function i(){return e.read().then(({value:a,done:r})=>{if(r){if(o.trim()){s.error(new u("Failed to parse stream"));return}s.close();return}o+=a;let d=o.match(W),h;for(;d;){try{h=JSON.parse(d[1])}catch{s.error(new u(`Error parsing JSON response: "${d[1]}"`));return}s.enqueue(h),o=o.substring(d[0].length),d=o.match(W)}return i()})}}})}function Ot(t){let e=t[t.length-1],n={promptFeedback:e?.promptFeedback};for(let s of t){if(s.candidates)for(let o of s.candidates){let i=o.index;if(n.candidates||(n.candidates=[]),n.candidates[i]||(n.candidates[i]={index:o.index}),n.candidates[i].citationMetadata=o.citationMetadata,n.candidates[i].groundingMetadata=o.groundingMetadata,n.candidates[i].finishReason=o.finishReason,n.candidates[i].finishMessage=o.finishMessage,n.candidates[i].safetyRatings=o.safetyRatings,o.content&&o.content.parts){n.candidates[i].content||(n.candidates[i].content={role:o.content.role||"user",parts:[]});let a={};for(let r of o.content.parts)r.text&&(a.text=r.text),r.functionCall&&(a.functionCall=r.functionCall),r.executableCode&&(a.executableCode=r.executableCode),r.codeExecutionResult&&(a.codeExecutionResult=r.codeExecutionResult),Object.keys(a).length===0&&(a.text=""),n.candidates[i].content.parts.push(a)}}s.usageMetadata&&(n.usageMetadata=s.usageMetadata)}return n}async function Z(t,e,n,s){let o=await A(e,_.STREAM_GENERATE_CONTENT,t,!0,JSON.stringify(n),s);return Ct(o)}async function tt(t,e,n,s){let i=await(await A(e,_.GENERATE_CONTENT,t,!1,JSON.stringify(n),s)).json();return{response:L(i)}}function et(t){if(t!=null){if(typeof t=="string")return{role:"system",parts:[{text:t}]};if(t.text)return{role:"system",parts:[t]};if(t.parts)return t.role?t:{role:"system",parts:t.parts}}}function S(t){let e=[];if(typeof t=="string")e=[{text:t}];else for(let n of t)typeof n=="string"?e.push({text:n}):e.push(n);return yt(e)}function yt(t){let e={role:"user",parts:[]},n={role:"function",parts:[]},s=!1,o=!1;for(let i of t)"functionResponse"in i?(n.parts.push(i),o=!0):(e.parts.push(i),s=!0);if(s&&o)throw new u("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");if(!s&&!o)throw new u("No content is provided for sending chat message.");return s?e:n}function mt(t,e){var n;let s={model:e?.model,generationConfig:e?.generationConfig,safetySettings:e?.safetySettings,tools:e?.tools,toolConfig:e?.toolConfig,systemInstruction:e?.systemInstruction,cachedContent:(n=e?.cachedContent)===null||n===void 0?void 0:n.name,contents:[]},o=t.generateContentRequest!=null;if(t.contents){if(o)throw new g("CountTokensRequest must have one of contents or generateContentRequest, not both.");s.contents=t.contents}else if(o)s=Object.assign(Object.assign({},s),t.generateContentRequest);else{let i=S(t);s.contents=[i]}return{generateContentRequest:s}}function X(t){let e;return t.contents?e=t:e={contents:[S(t)]},t.systemInstruction&&(e.systemInstruction=et(t.systemInstruction)),e}function Rt(t){return typeof t=="string"||Array.isArray(t)?{content:S(t)}:t}var z=["text","inlineData","functionCall","functionResponse","executableCode","codeExecutionResult"],It={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall","executableCode","codeExecutionResult"],system:["text"]};function St(t){let e=!1;for(let n of t){let{role:s,parts:o}=n;if(!e&&s!=="user")throw new u(`First content should be with role 'user', got ${s}`);if(!j.includes(s))throw new u(`Each item should include role field. Got ${s} but valid roles are: ${JSON.stringify(j)}`);if(!Array.isArray(o))throw new u("Content should have 'parts' property with an array of Parts");if(o.length===0)throw new u("Each Content should have at least one part");let i={text:0,inlineData:0,functionCall:0,functionResponse:0,fileData:0,executableCode:0,codeExecutionResult:0};for(let r of o)for(let d of z)d in r&&(i[d]+=1);let a=It[s];for(let r of z)if(!a.includes(r)&&i[r]>0)throw new u(`Content with role '${s}' can't contain '${r}' part`);e=!0}}var Q="SILENT_ERROR",x=class{constructor(e,n,s,o={}){this.model=n,this.params=s,this._requestOptions=o,this._history=[],this._sendPromise=Promise.resolve(),this._apiKey=e,s?.history&&(St(s.history),this._history=s.history)}async getHistory(){return await this._sendPromise,this._history}async sendMessage(e,n={}){var s,o,i,a,r,d;await this._sendPromise;let h=S(e),v={safetySettings:(s=this.params)===null||s===void 0?void 0:s.safetySettings,generationConfig:(o=this.params)===null||o===void 0?void 0:o.generationConfig,tools:(i=this.params)===null||i===void 0?void 0:i.tools,toolConfig:(a=this.params)===null||a===void 0?void 0:a.toolConfig,systemInstruction:(r=this.params)===null||r===void 0?void 0:r.systemInstruction,cachedContent:(d=this.params)===null||d===void 0?void 0:d.cachedContent,contents:[...this._history,h]},O=Object.assign(Object.assign({},this._requestOptions),n),l;return this._sendPromise=this._sendPromise.then(()=>tt(this._apiKey,this.model,v,O)).then(c=>{var f;if(c.response.candidates&&c.response.candidates.length>0){this._history.push(h);let y=Object.assign({parts:[],role:"model"},(f=c.response.candidates)===null||f===void 0?void 0:f[0].content);this._history.push(y)}else{let y=C(c.response);y&&console.warn(`sendMessage() was unsuccessful. ${y}. Inspect response object for details.`)}l=c}),await this._sendPromise,l}async sendMessageStream(e,n={}){var s,o,i,a,r,d;await this._sendPromise;let h=S(e),v={safetySettings:(s=this.params)===null||s===void 0?void 0:s.safetySettings,generationConfig:(o=this.params)===null||o===void 0?void 0:o.generationConfig,tools:(i=this.params)===null||i===void 0?void 0:i.tools,toolConfig:(a=this.params)===null||a===void 0?void 0:a.toolConfig,systemInstruction:(r=this.params)===null||r===void 0?void 0:r.systemInstruction,cachedContent:(d=this.params)===null||d===void 0?void 0:d.cachedContent,contents:[...this._history,h]},O=Object.assign(Object.assign({},this._requestOptions),n),l=Z(this._apiKey,this.model,v,O);return this._sendPromise=this._sendPromise.then(()=>l).catch(c=>{throw new Error(Q)}).then(c=>c.response).then(c=>{if(c.candidates&&c.candidates.length>0){this._history.push(h);let f=Object.assign({},c.candidates[0].content);f.role||(f.role="model"),this._history.push(f)}else{let f=C(c);f&&console.warn(`sendMessageStream() was unsuccessful. ${f}. Inspect response object for details.`)}}).catch(c=>{c.message!==Q&&console.error(c)}),l}};async function At(t,e,n,s){return(await A(e,_.COUNT_TOKENS,t,!1,JSON.stringify(n),s)).json()}async function Nt(t,e,n,s){return(await A(e,_.EMBED_CONTENT,t,!1,JSON.stringify(n),s)).json()}async function wt(t,e,n,s){let o=n.requests.map(a=>Object.assign(Object.assign({},a),{model:e}));return(await A(e,_.BATCH_EMBED_CONTENTS,t,!1,JSON.stringify({requests:o}),s)).json()}var T=class{constructor(e,n,s={}){this.apiKey=e,this._requestOptions=s,n.model.includes("/")?this.model=n.model:this.model=`models/${n.model}`,this.generationConfig=n.generationConfig||{},this.safetySettings=n.safetySettings||[],this.tools=n.tools,this.toolConfig=n.toolConfig,this.systemInstruction=et(n.systemInstruction),this.cachedContent=n.cachedContent}async generateContent(e,n={}){var s;let o=X(e),i=Object.assign(Object.assign({},this._requestOptions),n);return tt(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(s=this.cachedContent)===null||s===void 0?void 0:s.name},o),i)}async generateContentStream(e,n={}){var s;let o=X(e),i=Object.assign(Object.assign({},this._requestOptions),n);return Z(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(s=this.cachedContent)===null||s===void 0?void 0:s.name},o),i)}startChat(e){var n;return new x(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(n=this.cachedContent)===null||n===void 0?void 0:n.name},e),this._requestOptions)}async countTokens(e,n={}){let s=mt(e,{model:this.model,generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:this.cachedContent}),o=Object.assign(Object.assign({},this._requestOptions),n);return At(this.apiKey,this.model,s,o)}async embedContent(e,n={}){let s=Rt(e),o=Object.assign(Object.assign({},this._requestOptions),n);return Nt(this.apiKey,this.model,s,o)}async batchEmbedContents(e,n={}){let s=Object.assign(Object.assign({},this._requestOptions),n);return wt(this.apiKey,this.model,e,s)}};var b=class{constructor(e){this.apiKey=e}getGenerativeModel(e,n){if(!e.model)throw new u("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");return new T(this.apiKey,e,n)}getGenerativeModelFromCachedContent(e,n,s){if(!e.name)throw new g("Cached content must contain a `name` field.");if(!e.model)throw new g("Cached content must contain a `model` field.");let o=["model","systemInstruction"];for(let a of o)if(n?.[a]&&e[a]&&n?.[a]!==e[a]){if(a==="model"){let r=n.model.startsWith("models/")?n.model.replace("models/",""):n.model,d=e.model.startsWith("models/")?e.model.replace("models/",""):e.model;if(r===d)continue}throw new g(`Different value for "${a}" specified in modelParams (${n[a]}) and cachedContent (${e[a]})`)}let i=Object.assign(Object.assign({},n),{model:e.model,tools:e.tools,toolConfig:e.toolConfig,systemInstruction:e.systemInstruction,cachedContent:e});return new T(this.apiKey,i,s)}};var Tt="AIzaSyCxuRAnHlObdy4oK_LBzkvUySK7SpLppKA",bt=new b(Tt),U=bt.getGenerativeModel({model:"gemini-1.5-flash"}),p=null,m={},D=!1,H="normal";chrome.runtime.onConnect.addListener(t=>{t.name==="explanation-stream"&&(p||(p=U.startChat({})),t.onMessage.addListener(async e=>{if(e.type==="get-explanation"){let n=e.term||"example term";if(m[n]){t.postMessage({token:m[n],done:!0});return}try{let s=Mt(n),o=await p.sendMessageStream(s),i="";for await(let a of o.stream){let r=a.text();i+=r,t.postMessage({token:r})}m[n]=i,t.postMessage({done:!0})}catch(s){console.error("Error streaming explanation:",s),t.postMessage({error:s.message})}}}))});chrome.runtime.onMessage.addListener((t,e,n)=>{if(t.type==="clear-chat")return p=U.startChat({}),m={},D=!1,n({success:!0}),!0;if(t.type==="add-context"){if(D)return n({success:!1,error:"Context already added."}),!0;let o="Use the following as context for further explanations of my terms, you do not need to respond to this message: "+t.content;return p||(p=U.startChat({})),m={},D=!0,p.sendMessage(o).then(()=>{n({success:!0})}).catch(i=>{console.error("Error appending context:",i),n({success:!1,error:i.message})}),!0}t.type==="update-preset"&&(m={},H=t.preset,n({success:!0}))});function Mt(t){return H==="concise"?`Briefly explain "${t}" in one or two sentences.`:H==="detailed"?`Provide a detailed explanation of "${t}", including its definition, real-world examples, applications, and related key concepts. the maximum length of the response should be 500 words.`:`Act as an expert educator and provide a very concise but understandable explanation of "${t}". 
Include:
- A clear definition
- Real-world examples or applications`}})();
/*! Bundled license information:

@google/generative-ai/dist/index.mjs:
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@google/generative-ai/dist/index.mjs:
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
//# sourceMappingURL=bundle.js.map
