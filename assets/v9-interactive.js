/* OTClient V9 — interactive presentation.
   No camera permission until the visitor clicks; video and landmarks stay in this tab.
   Face model JS and WASM are fetched from their public CDNs on demand. */
(()=>{'use strict';
const stage=document.querySelector('[data-parallax-stage]');
if(!stage)return;
const lang=document.documentElement.lang.startsWith('en')?'en':document.documentElement.lang.startsWith('es')?'es':'pt';
const copy={
pt:{mouse:'Passe o mouse ou toque na arte. A câmera é opcional e nenhuma imagem é enviada.',loading:'Solicitando câmera e preparando rastreamento facial local…',active:'Câmera ligada: mova sua cabeça suavemente. O vídeo não é enviado.',notfound:'Posicione o rosto diante da câmera para ativar a profundidade.',denied:'Câmera indisponível ou acesso negado. Use o mouse ou toque na imagem.',failure:'Não foi possível inicializar o rastreamento. O mouse continua disponível.',stopped:'Câmera desligada. Use o mouse ou toque na imagem.'},
en:{mouse:'Move your pointer or touch the artwork. Camera is optional; no video is uploaded.',loading:'Requesting camera and preparing local face tracking…',active:'Camera on: gently move your head. Your video is not uploaded.',notfound:'Face the camera to activate the depth effect.',denied:'Camera unavailable or permission denied. Use your mouse or touch instead.',failure:'Face tracking could not start. Mouse interaction remains available.',stopped:'Camera off. Move your pointer or touch the artwork.'},
es:{mouse:'Mueve el ratón o toca la imagen. La cámara es opcional; no se sube vídeo.',loading:'Solicitando cámara y preparando seguimiento facial local…',active:'Cámara encendida: mueve la cabeza suavemente. No se envía vídeo.',notfound:'Colócate frente a la cámara para activar la profundidad.',denied:'Cámara no disponible o permiso denegado. Usa el ratón o toca la imagen.',failure:'No se pudo iniciar el seguimiento. El ratón sigue disponible.',stopped:'Cámara apagada. Usa el ratón o toca la imagen.'}
}[lang];
const layers=[...stage.querySelectorAll('[data-depth]')];
const start=document.querySelector('[data-head-start]');
const stop=document.querySelector('[data-head-stop]');
const status=document.querySelector('[data-head-status]');
const video=document.querySelector('[data-head-video]');
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let x=0,y=0,tx=0,ty=0,stream=null,tracker=null,tracking=false,session=0,detectRAF=0,lastDetect=0,lastFace=0;
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
function report(key,mode='idle'){if(status){status.textContent=copy[key];status.dataset.mode=mode;}}
if(!reduce){
function animate(){
x+=(tx-x)*.085;y+=(ty-y)*.085;
for(const layer of layers){const depth=Number(layer.dataset.depth)||0;layer.style.transform='translate3d('+(x*depth).toFixed(1)+'px,'+(y*depth).toFixed(1)+'px,0)';}
requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
stage.addEventListener('pointermove',e=>{
if(tracking)return;
const rect=stage.getBoundingClientRect();
tx=clamp((e.clientX-rect.left)/rect.width-.5,-.5,.5)*2;
ty=clamp((e.clientY-rect.top)/rect.height-.5,-.5,.5)*2;
},{passive:true});
stage.addEventListener('pointerleave',()=>{if(!tracking){tx=0;ty=0;}});
}else{
for(const layer of layers)layer.style.transform='none';
}
async function deactivate(msg='stopped',mode='idle'){
session++;tracking=false;cancelAnimationFrame(detectRAF);detectRAF=0;
if(stream){for(const t of stream.getTracks())t.stop();stream=null;}
if(video){video.pause();video.srcObject=null;}
if(tracker){try{tracker.close();}catch(_e){}tracker=null;}
if(start){start.disabled=false;start.hidden=false;}
if(stop)stop.hidden=true;
tx=0;ty=0;
report(msg,mode);
}
async function activate(){
if(!start||!stop||!video||reduce||!navigator.mediaDevices?.getUserMedia||!window.isSecureContext){
report('denied','error');return;
}
const thisSession=++session;start.hidden=true;stop.hidden=false;
report('loading');
let localStream=null,localTracker=null;
try{
localStream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:'user',width:{ideal:640},height:{ideal:480},frameRate:{ideal:24,max:30}}});
if(thisSession!==session){localStream.getTracks().forEach(t=>t.stop());return;}
stream=localStream;video.srcObject=stream;await video.play();
const vision=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/+esm');
const fileset=await vision.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22-rc.20250304/wasm');
localTracker=await vision.FaceLandmarker.createFromOptions(fileset,{
baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',delegate:'CPU'},
runningMode:'VIDEO',numFaces:1,minFaceDetectionConfidence:.5,minTrackingConfidence:.45
});
if(thisSession!==session){localTracker.close();return;}
tracker=localTracker;tracking=true;lastDetect=0;lastFace=0;report('active','active');
function detect(time){
if(thisSession!==session||!tracking)return;
if(!document.hidden&&video.readyState>=2&&time-lastDetect>=90){
lastDetect=time;
try{
const faces=tracker.detectForVideo(video,time).faceLandmarks||[];
if(faces.length){
const points=faces[0],nose=points[1]||points[0];
if(nose){
tx=clamp((.5-nose.x)*3,-1,1);
ty=clamp((.5-nose.y)*3,-1,1);
lastFace=time;
if(status?.dataset.mode!=='active')report('active','active');
}
}else if(time-lastFace>1900){
tx=0;ty=0;
if(status?.dataset.mode!=='waiting'){report('notfound');status.dataset.mode='waiting';}
}
}catch(e){console.warn('Local face tracking failed:',e);deactivate('failure','error');return;}
}
detectRAF=requestAnimationFrame(detect);
}
detectRAF=requestAnimationFrame(detect);
}catch(error){
console.warn('Could not activate opt-in camera:',error);
if(localStream&&!stream)localStream.getTracks().forEach(t=>t.stop());
if(localTracker&&localTracker!==tracker)try{localTracker.close();}catch(_e){}
if(thisSession===session)deactivate(error?.name==='NotAllowedError'||error?.name==='NotFoundError'?'denied':'failure','error');
}
}
start?.addEventListener('click',activate);
stop?.addEventListener('click',()=>deactivate());
window.addEventListener('pagehide',()=>deactivate(),{once:true});
if(reduce){if(start){start.disabled=true;start.title='Animations disabled by reduced motion preference';}report('mouse');}
else report('mouse');
const filters=[...document.querySelectorAll('[data-feature-filter]')];
const cards=[...document.querySelectorAll('.cards .card[data-feature]')];
for(const button of filters){button.addEventListener('click',()=>{
const category=button.dataset.featureFilter;
for(const item of filters)item.setAttribute('aria-pressed',String(item===button));
for(const card of cards)card.hidden=category!=='all'&&card.dataset.feature!==category;
});}
const protocolText={
pt:{'8.60':'Geração clássica. Meta: preservar compatibilidade; testes de regressão ainda pendentes.','10.98':'Geração de transição. Meta: preservar compatibilidade; testes de regressão ainda pendentes.','15.11':'Integração com Canary em desenvolvimento. Login, movimento e renderização precisam de validação real.','15.25':'Recursos modernos em implementação e validação. Não é uma confirmação de gameplay completo.'},
en:{'8.60':'Classic generation. Goal: preserve compatibility; regression tests are still pending.','10.98':'Transitional generation. Goal: preserve compatibility; regression tests are still pending.','15.11':'Canary integration in progress. Real-world login, movement, and rendering still need validation.','15.25':'Modern features are under development and validation. Full gameplay support is not yet confirmed.'},
es:{'8.60':'Generación clásica. Objetivo: mantener la compatibilidad; pruebas de regresión pendientes.','10.98':'Generación de transición. Objetivo: mantener la compatibilidad; pruebas de regresión pendientes.','15.11':'Integración con Canary en desarrollo. Faltan pruebas reales de conexión, movimiento y gráficos.','15.25':'Funciones modernas en implementación y validación. El juego completo no está confirmado.'}
}[lang];
const protocolButtons=[...document.querySelectorAll('[data-protocol-button]')];
const desc=document.querySelector('[data-protocol-description]');
for(const btn of protocolButtons){btn.addEventListener('click',()=>{
const key=btn.dataset.protocolButton;
for(const b of protocolButtons)b.setAttribute('aria-pressed',String(b===btn));
if(desc)desc.textContent=protocolText[key]||'';
});}
const progress=document.querySelector('[data-scroll-progress]');
if(progress){
let scheduled=false;
const update=()=>{scheduled=false;const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=(max>0?clamp(window.scrollY/max,0,1)*100:0).toFixed(1)+'%';};
addEventListener('scroll',()=>{if(!scheduled){scheduled=true;requestAnimationFrame(update);}},{passive:true});update();
}
if(!reduce&&'IntersectionObserver'in window){
const elements=[...document.querySelectorAll('.section-head,.cards .card,.visual,.split,.table-wrap,.cta')];
const observer=new IntersectionObserver(entries=>{for(const item of entries){if(item.isIntersecting){item.target.classList.add('in-view');observer.unobserve(item.target);}}},{threshold:.09,rootMargin:'0px 0px 10% 0px'});
for(const element of elements){element.classList.add('js-reveal');observer.observe(element);}
}
})();
