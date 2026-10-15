// ================== MINI GAMES DE ARRASTAR (estilo NSS, pensados pro celular) ==================
function swFrame(o,svg,hint){
 $ov.hidden=false;
 $ov.innerHTML=`<div class="ovwrap mg sw"><div class="row" style="justify-content:space-between"><span class="eyebrow">${esc(o.comp||'')}${o.min!=null?` · ${o.min}'`:''}</span><span class="tag campo">${esc(o.tag||'Lance')}</span></div>
 <h2 class="pkh" style="font-size:24px">${esc(o.title||'')}</h2><div class="swwrap">${svg}<div class="swtimer"><i id="swT"></i></div></div><p class="swhint">${hint}</p><div class="pkres" id="mgRes"></div></div>`;
 const T=document.getElementById('swT');if(T&&o.time){T.style.transition=`width ${o.time}ms linear`;requestAnimationFrame(()=>requestAnimationFrame(()=>T.style.width='0%'))}
}
function swPt(svg,e){const r=svg.getBoundingClientRect();const vb=svg.viewBox.baseVal;return{x:(e.clientX-r.left)/r.width*vb.width,y:(e.clientY-r.top)/r.height*vb.height}}
function gauss(){return(rnd()+rnd()+rnd()-1.5)/1.5}
function swEnd(ok,txt,perfect){return mgEnd(ok,txt,perfect)}

// ---------- CHUTE / FALTA / CABEÇADA: arraste da bola até o gol ----------
function swipeShot(o){
 return new Promise(res=>{
  const fk=o.kind==='fk',hd=o.kind==='header';const skill=clamp(o.skill??.6,.15,.98);const time=o.time||(hd?2600:4200);
  const kx=160,ky=96;
  const svg=`<svg class="swsvg" id="sw" viewBox="0 0 320 340">
   <defs><linearGradient id="swg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1f15"/><stop offset=".42" stop-color="#16422c"/><stop offset="1" stop-color="#1f5a3b"/></linearGradient><pattern id="swn" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M0 0L9 9M9 0L0 9" stroke="rgba(236,240,226,.22)" stroke-width=".7"/></pattern></defs>
   <rect width="320" height="340" fill="url(#swg)"/>${[0,1,2,3,4].map(i=>`<rect y="${140+i*40}" width="320" height="20" fill="rgba(255,255,255,.025)"/>`).join('')}
   <rect x="60" y="40" width="200" height="82" fill="url(#swn)"/><path d="M60 122V40h200v82" fill="none" stroke="#ecf0e2" stroke-width="5" stroke-linejoin="round"/><path d="M30 124h260" stroke="rgba(236,240,226,.5)" stroke-width="2"/>
   ${fk?`<g id="wall">${[0,1,2,3].map(i=>`<g transform="translate(${126+i*18},160)"><rect x="-7" y="0" width="14" height="30" rx="5" fill="#c8102e"/><circle cy="-6" r="6" fill="#d9a77a"/></g>`).join('')}</g>`:''}
   <g id="kp" transform="translate(${kx} ${ky})"><rect x="-11" y="-16" width="22" height="30" rx="7" fill="#c6f432"/><circle cy="-23" r="8" fill="#d9a77a"/><rect x="-26" y="-14" width="15" height="7" rx="3.5" fill="#c6f432"/><rect x="11" y="-14" width="15" height="7" rx="3.5" fill="#c6f432"/><rect x="-10" y="14" width="8" height="14" rx="3" fill="#222"/><rect x="2" y="14" width="8" height="14" rx="3" fill="#222"/></g>
   ${hd?`<circle id="cross" cx="-20" cy="210" r="9" fill="#fff" opacity=".9"/>`:''}
   <path id="aim" d="" stroke="rgba(242,196,67,.9)" stroke-width="4" stroke-dasharray="8 6" fill="none" stroke-linecap="round"/>
   <circle id="tgt" r="0" fill="none" stroke="var(--gold)" stroke-width="3"/>
   <g id="ball" transform="translate(160 292)"><circle r="13" fill="#fff"/><path d="M-5-4l5-4 5 4-2 6h-6z" fill="#222"/><circle r="13" fill="none" stroke="rgba(0,0,0,.25)"/></g>
   <circle id="finger" cx="160" cy="292" r="26" fill="rgba(255,122,43,.18)" stroke="var(--accent)" stroke-width="2" class="swpulse"/>
  </svg>`;
  swFrame({...o,tag:fk?'Falta':hd?'Cabeçada':'Finalização',time},svg,hd?'Quando a bola chegar, <b>arraste pra cima</b> mirando no canto.':fk?'<b>Arraste da bola pro gol.</b> Curve o dedo pra dar efeito por cima da barreira.':'<b>Arraste da bola até onde quer chutar.</b> Mais longo = mais alto.');
  const sv=document.getElementById('sw'),aim=document.getElementById('aim'),ball=document.getElementById('ball'),kp=document.getElementById('kp'),tgt=document.getElementById('tgt'),fg=document.getElementById('finger');
  let start=null,path=[],done=false,ready=!hd;const t0=performance.now();
  if(hd){const cr=document.getElementById('cross');const d0=reduced?50:900;cr.animate([{transform:'translate(0,0)'},{transform:'translate(180px,70px)'}],{duration:d0,fill:'forwards',easing:'ease-out'});setTimeout(()=>{ready=true;fg.classList.add('go');cr.remove();ball.setAttribute('transform','translate(160 270)')},d0)}
  const to=setTimeout(()=>finish(null),time);
  sv.addEventListener('pointerdown',e=>{if(done||!ready)return;sv.setPointerCapture(e.pointerId);start=swPt(sv,e);path=[start]});
  sv.addEventListener('pointermove',e=>{if(!start||done)return;const p=swPt(sv,e);path.push(p);const bx=hd?160:160,by=hd?270:292;aim.setAttribute('d',`M${bx} ${by} Q ${bx+(p.x-start.x)*.5} ${by+(p.y-start.y)*.5-20} ${bx+(p.x-start.x)*1.6} ${by+(p.y-start.y)*1.15}`)});
  sv.addEventListener('pointerup',e=>{if(!start||done)return;const p=swPt(sv,e);path.push(p);finish(p)});
  const finish=async end=>{
   if(done)return;done=true;clearTimeout(to);fg.remove();aim.setAttribute('d','');
   if(!end||Math.hypot(end.x-start.x,end.y-start.y)<25){await swEnd(false,hd?'Não subiu no tempo':'Demorou demais e perdeu a bola');return res({ok:false})}
   const dx=end.x-start.x,dy=end.y-start.y;const len=Math.hypot(dx,dy);
   // efeito: desvio do meio do traço
   let curve=0;if(path.length>4){const m=path[Math.floor(path.length/2)];const lx=start.x+dx/2,ly=start.y+dy/2;curve=clamp((m.x-lx)*-1,-60,60)}
   const noise=(1-skill)*38+4;
   let tx=160+dx*1.25+curve*.5+gauss()*noise, ty=122-clamp((-dy-40)*.42,0,120)+gauss()*noise*.7;
   if(hd)ty=122-clamp((-dy-20)*.5,0,110)+gauss()*noise*.7;
   tgt.setAttribute('cx',tx);tgt.setAttribute('cy',ty);
   // goleiro
   const read=clamp((o.keeper??.45)-(o.planned?.15:0),.1,.85);const side=tx<130?-1:tx>190?1:0;const dive=ch(read)?side:pick([-1,0,1]);
   const dpx=kx+dive*52,dpy=dive?90:88;const reach=dive===0?28:31;
   const bx0=160,by0=hd?270:292;const cx=bx0+curve*1.4,cy=(by0+ty)/2-40;
   const flight=reduced?60:520;const ts=performance.now();
   kp.animate([{transform:`translate(${kx}px,${ky}px)`},{transform:`translate(${dpx}px,${dpy}px) rotate(${dive*-60}deg)`}],{duration:380,delay:120,fill:'forwards',easing:'cubic-bezier(.3,.7,.3,1)'});
   await new Promise(r=>{const st=t=>{const k=Math.min(1,(t-ts)/flight);const x=(1-k)*(1-k)*bx0+2*(1-k)*k*cx+k*k*tx,y=(1-k)*(1-k)*by0+2*(1-k)*k*cy+k*k*ty;ball.setAttribute('transform',`translate(${x} ${y}) scale(${1-k*.45})`);if(k<1)requestAnimationFrame(st);else r()};requestAnimationFrame(st)});
   let ok=true,txt=o.okTxt||'GOOOL!';
   if(fk&&ty>100&&Math.abs(curve)<18&&len<150&&tx>120&&tx<200){ok=false;txt='Na barreira!'}
   else if(ty<40){ok=false;txt='Por cima do gol!'}else if(tx<60||tx>260){ok=false;txt='Pra fora!'}
   else if(Math.hypot(tx-dpx,ty-dpy)<reach){ok=false;txt='O goleiro pegou!'}
   const perfect=ok&&(tx<84||tx>236)&&ty<70;
   await swEnd(ok,ok&&perfect?'NO ÂNGULO!':txt,perfect);res({ok,perfect});
  };
 });
}

// ---------- PASSE / LANÇAMENTO / CRUZAMENTO: arraste na direção do companheiro ----------
function swipePass(o){
 return new Promise(res=>{
  const long=o.kind==='long'||o.kind==='cross';const skill=clamp(o.skill??.6,.15,.98);const time=o.time||(long?4200:3600);
  const mates=long?[{x:o.kind==='cross'?160:80,y:60,a:0,sp:.0014,amp:o.kind==='cross'?40:50},{x:240,y:80,a:2,sp:.0012,amp:30}]:[{x:60,y:150,a:0,sp:.0016,amp:30},{x:160,y:120,a:1.5,sp:.0013,amp:40},{x:260,y:150,a:3,sp:.0018,amp:30}];
  const defs=(long?[{x:120,y:110},{x:210,y:120},{x:160,y:190}]:[{x:110,y:210},{x:210,y:215}]).slice(0,o.defs||(long?3:2)).map((d,i)=>({...d,a:i*2.1,sp:(.0018+i*.0006)*(o.speed||1),amp:45}));
  const svg=`<svg class="swsvg" id="sw" viewBox="0 0 320 360"><defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a4a31"/><stop offset="1" stop-color="#1f5a3b"/></linearGradient></defs>
   <rect width="320" height="360" fill="url(#pg)"/>${[0,1,2,3,4,5,6,7,8].map(i=>`<rect y="${i*40}" width="320" height="20" fill="rgba(255,255,255,.03)"/>`).join('')}
   <path d="M0 4h320M160 4v30" stroke="rgba(236,240,226,.35)" stroke-width="2"/>${long&&o.kind==='cross'?'<rect x="90" y="4" width="140" height="70" fill="none" stroke="rgba(236,240,226,.4)" stroke-width="2"/>':''}
   ${mates.map((m,i)=>`<g id="m${i}"><circle r="15" fill="${o.c1||'#ff7a2b'}" stroke="#fff" stroke-width="2.5"/><text y="5" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">${[9,10,7][i]}</text></g>`).join('')}
   ${defs.map((d,i)=>`<g id="d${i}"><circle r="15" fill="#20242a" stroke="#ff6a5c" stroke-width="2.5"/></g>`).join('')}
   <path id="aim" d="" stroke="rgba(242,196,67,.9)" stroke-width="4" stroke-dasharray="8 6" fill="none" stroke-linecap="round"/>
   <g id="me" transform="translate(160 320)"><circle r="16" fill="${o.c1||'#ff7a2b'}" stroke="var(--gold)" stroke-width="3"/></g>
   <g id="ball" transform="translate(160 298)"><circle r="8" fill="#fff"/></g>
   <circle id="finger" cx="160" cy="298" r="24" fill="rgba(255,122,43,.18)" stroke="var(--accent)" stroke-width="2" class="swpulse"/></svg>`;
  swFrame({...o,tag:long?(o.kind==='cross'?'Cruzamento':'Lançamento'):'Passe',time},svg,long?'<b>Arraste longo</b> na direção do atacante que está correndo. A força conta.':'<b>Arraste da bola até um companheiro livre</b> (laranja). Evite os marcadores.');
  const sv=document.getElementById('sw'),aim=document.getElementById('aim'),ball=document.getElementById('ball'),fg=document.getElementById('finger');
  const mE=mates.map((_,i)=>document.getElementById('m'+i)),dE=defs.map((_,i)=>document.getElementById('d'+i));
  let done=false,start=null,t0=performance.now(),flying=false;
  const pos=(o2,t)=>({x:o2.x+Math.sin(o2.a+(t-t0)*o2.sp)*o2.amp,y:o2.y+(long?Math.cos(o2.a+(t-t0)*o2.sp*.7)*8:0)});
  const loop=t=>{if(done&&!flying)return;mates.forEach((m,i)=>{const p=pos(m,t);mE[i].setAttribute('transform',`translate(${p.x} ${p.y})`)});defs.forEach((d,i)=>{const p=pos(d,t);dE[i].setAttribute('transform',`translate(${p.x} ${p.y})`)});requestAnimationFrame(loop)};requestAnimationFrame(loop);
  const to=setTimeout(()=>finish(null),time);
  sv.addEventListener('pointerdown',e=>{if(done)return;sv.setPointerCapture(e.pointerId);start=swPt(sv,e)});
  sv.addEventListener('pointermove',e=>{if(!start||done)return;const p=swPt(sv,e);aim.setAttribute('d',`M160 298 L ${160+(p.x-start.x)*(long?3.4:3)} ${298+(p.y-start.y)*(long?3.4:3)}`)});
  sv.addEventListener('pointerup',e=>{if(!start||done)return;finish(swPt(sv,e))});
  const finish=async end=>{
   if(done)return;done=true;clearTimeout(to);fg.remove();aim.setAttribute('d','');
   if(!end||Math.hypot(end.x-start.x,end.y-start.y)<20){await swEnd(false,'Perdeu a bola');return res({ok:false})}
   let dx=end.x-start.x,dy=end.y-start.y;const len=Math.hypot(dx,dy);const ang=Math.atan2(dy,dx)+gauss()*(1-skill)*.14;
   const dist=long?clamp(len*3.4,140,340):clamp(len*3,90,300);
   const tx=160+Math.cos(ang)*dist,ty=298+Math.sin(ang)*dist;const dur=reduced?80:(long?800:450);const ts=performance.now();flying=true;
   let caught=null,cut=false;
   await new Promise(r=>{const st=t=>{const k=Math.min(1,(t-ts)/dur);const x=160+(tx-160)*k,y=298+(ty-298)*k-(long?Math.sin(k*Math.PI)*40:0);ball.setAttribute('transform',`translate(${x} ${y}) scale(${long?1+Math.sin(k*Math.PI)*.6:1})`);
    const gy=298+(ty-298)*k;if(!cut&&(!long||k>.75)){for(const d of defs){const p=pos(d,t);if(Math.hypot(p.x-x,p.y-gy)<(long?18:14)){cut=true;break}}}
    if(!cut&&caught==null&&k>.3){mates.forEach((m,i)=>{const p=pos(m,t);if(Math.hypot(p.x-x,p.y-gy)<(long?30:28))caught=i})}
    if(k<1&&!cut&&caught==null)requestAnimationFrame(st);else r()};requestAnimationFrame(st)});
   flying=false;
   const ok=!cut&&caught!=null;
   await swEnd(ok,cut?'Interceptado!':ok?(o.okTxt||(long?'Na medida!':'Passe perfeito!')):'Ninguém chegou na bola',ok&&len>90&&!long);res({ok,perfect:ok});
  };
 });
}

// ---------- DRIBLE: arraste pro lado contrário do marcador ----------
function swipeDribble(o){
 return new Promise(async res=>{
  const rounds=3,need=o.need||2;let hits=0;
  for(let i=0;i<rounds;i++){
   const mv=pick(['left','right','legs']);const win=Math.max(650,(o.window||1300)-i*120);
   const r=await new Promise(rs=>{
    const svg=`<svg class="swsvg" id="sw" viewBox="0 0 320 300"><rect width="320" height="300" fill="#1d5236"/>${[0,1,2,3,4,5,6].map(k=>`<rect y="${k*44}" width="320" height="22" fill="rgba(255,255,255,.03)"/>`).join('')}
     <g id="df" transform="translate(160 110)"><rect x="-16" y="-10" width="32" height="44" rx="10" fill="#20242a" stroke="#ff6a5c" stroke-width="3"/><circle cy="-22" r="12" fill="#d9a77a"/><rect id="lgL" x="-14" y="32" width="10" height="26" rx="4" fill="#20242a"/><rect id="lgR" x="4" y="32" width="10" height="26" rx="4" fill="#20242a"/></g>
     <g id="me" transform="translate(160 240)"><rect x="-15" y="-10" width="30" height="40" rx="10" fill="${o.c1||'#ff7a2b'}" stroke="var(--gold)" stroke-width="3"/><circle cy="-21" r="11" fill="#b07a50"/></g><circle id="db" cx="160" cy="214" r="9" fill="#fff"/>
     <text x="160" y="40" text-anchor="middle" font-size="15" font-weight="800" fill="#f2c443" id="cue">Lance ${i+1} de ${rounds}</text></svg>`;
    swFrame({...o,tag:'Drible',time:win+600},svg,'Leia o marcador e <b>arraste pro lado contrário</b>. Se ele abrir as pernas, <b>arraste pra cima</b> (caneta).');
    const sv=document.getElementById('sw'),df=document.getElementById('df');let start=null,done=false;
    setTimeout(()=>{if(done)return;const tx=mv==='left'?-55:mv==='right'?55:0;df.animate([{transform:'translate(160px,110px)'},{transform:`translate(${160+tx}px,${mv==='legs'?130:122}px)`}],{duration:340,fill:'forwards',easing:'ease-out'});
     if(mv==='legs'){document.getElementById('lgL').animate([{transform:'none'},{transform:'translateX(-9px) rotate(18deg)'}],{duration:300,fill:'forwards'});document.getElementById('lgR').animate([{transform:'none'},{transform:'translateX(9px) rotate(-18deg)'}],{duration:300,fill:'forwards'})}},250);
    const to=setTimeout(()=>{if(!done){done=true;rs(null)}},win+600);
    sv.addEventListener('pointerdown',e=>{sv.setPointerCapture(e.pointerId);start=swPt(sv,e)});
    sv.addEventListener('pointerup',e=>{if(!start||done)return;const p=swPt(sv,e);const dx=p.x-start.x,dy=p.y-start.y;if(Math.hypot(dx,dy)<22)return;done=true;clearTimeout(to);rs(Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down'))});
   });
   const ok=(mv==='left'&&r==='right')||(mv==='right'&&r==='left')||(mv==='legs'&&r==='up');if(ok)hits++;
   const el=document.getElementById('mgRes');if(el)el.innerHTML=`<span class="${ok?'good':'bad'}">${ok?(mv==='legs'?'CANETA!':'Passou!'):r?'Ele leu a jogada':'Demorou'}</span>`;await sleep(reduced?100:550);
  }
  const ok=hits>=need;await swEnd(ok,ok?(o.okTxt||`Driblou ${hits} de ${rounds}`):`Perdeu a bola (${hits} de ${rounds})`,hits===rounds);res({ok,perfect:hits===rounds});
 });
}

// ---------- REFLEXO DO GOLEIRO: arraste na direção da bola ----------
function swipeReflex(o){
 return new Promise(res=>{
  const zx=[90,160,230],zy=[62,104];const z=RI(0,5);const col=z%3,row=Math.floor(z/3);const win=o.window||800;
  const svg=`<svg class="swsvg" id="sw" viewBox="0 0 320 300"><rect width="320" height="300" fill="#16422c"/>
   <rect x="50" y="36" width="220" height="92" fill="rgba(236,240,226,.07)"/><path d="M50 128V36h220v92" fill="none" stroke="#ecf0e2" stroke-width="5"/>
   <g id="kp" transform="translate(160 110)"><rect x="-13" y="-18" width="26" height="34" rx="8" fill="#c6f432"/><circle cy="-27" r="9" fill="#d9a77a"/><rect x="-30" y="-16" width="17" height="8" rx="4" fill="#c6f432"/><rect x="13" y="-16" width="17" height="8" rx="4" fill="#c6f432"/></g>
   <g id="sh" transform="translate(160 262)"><rect x="-12" y="-8" width="24" height="34" rx="8" fill="#20242a"/><circle cy="-18" r="9" fill="#d9a77a"/></g>
   <circle id="ball" cx="160" cy="240" r="9" fill="#fff"/></svg>`;
  swFrame({...o,tag:'Reflexo',time:win+1400},svg,'Assim que ele chutar, <b>arraste pro lado da bola</b> (pra cima se for alta).');
  const sv=document.getElementById('sw'),ball=document.getElementById('ball'),kp=document.getElementById('kp');let start=null,done=false,shotAt=0;
  const delay=RI(500,1300);
  setTimeout(()=>{shotAt=performance.now();ball.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${zx[col]-160}px,${zy[row]-240}px) scale(1.5)`}],{duration:win,fill:'forwards',easing:'ease-in'})},delay);
  const to=setTimeout(()=>fin(null),delay+win+80);
  sv.addEventListener('pointerdown',e=>{sv.setPointerCapture(e.pointerId);start=swPt(sv,e)});
  sv.addEventListener('pointerup',e=>{if(!start||done)return;const p=swPt(sv,e);const dx=p.x-start.x,dy=p.y-start.y;if(Math.hypot(dx,dy)<20)return;fin({dx,dy})});
  const fin=async d=>{if(done)return;done=true;clearTimeout(to);
   if(!d||!shotAt){await swEnd(false,!shotAt&&d?'Pulou antes da hora!':'Não deu tempo');return res({ok:false})}
   const c2=Math.abs(d.dx)<30?1:d.dx<0?0:2;const r2=d.dy<-25?0:1;
   kp.animate([{transform:'translate(160px,110px)'},{transform:`translate(${zx[c2]}px,${zy[r2]+6}px) rotate(${(c2-1)*-55}deg)`}],{duration:260,fill:'forwards'});
   await sleep(280);const ok=c2===col&&(r2===row||col===1);await swEnd(ok,ok?'DEFENDEU!':'Foi pro outro lado');res({ok});};
 });
}

// ---------- liga nos lances, no treino e no jogo ----------
function skillOf(k){const A=typeof effAttrs==='function'?effAttrs():CA();return clamp((A[k]-40)/55,.1,.98)}
const _runChanceSW=runChance;
runChance=async function(c){
 const pl=c.planned,c1=club()?club().c1:'#ff7a2b';
 if(c.type==='finish')return(await swipeShot({...c,kind:'finish',title:pl?'Cara a cara com o goleiro!':'Sobrou pra você!',skill:skillOf('FIN'),keeper:pl?.38:.55,okTxt:'GOL!'})).ok;
 if(c.type==='fk')return(await swipeShot({...c,kind:'fk',title:'Falta perigosa',skill:(skillOf('FIN')+skillOf('PAS'))/2,keeper:pl?.4:.55,okTxt:'GOLAÇO DE FALTA!'})).ok;
 if(c.type==='header')return(await swipeShot({...c,kind:'header',title:'Cruzamento na área!',skill:skillOf('FIS'),keeper:pl?.38:.55,okTxt:'GOL DE CABEÇA!'})).ok;
 if(c.type==='dribble')return(await swipeDribble({...c,title:'Um contra um!',need:pl?2:3,window:1150+skillOf('DRI')*500,c1,okTxt:pl?'Driblou e marcou!':'Driblou geral e marcou!'})).ok;
 if(c.type==='pass')return(await swipePass({...c,kind:'pass',title:pl?'Linha de passe!':'Contra-ataque!',skill:skillOf('PAS'),defs:pl?2:3,speed:pl?1:1.25,c1,okTxt:'Passe pra gol!'})).ok;
 if(c.type==='long'||c.type==='cross')return(await swipePass({...c,kind:c.type,title:c.type==='cross'?'Hora do cruzamento':'Lançamento longo',skill:skillOf('PAS'),c1,okTxt:c.type==='cross'?'Cruzou na cabeça!':'Lançou na medida!'})).ok;
 if(c.type==='reflex')return(await swipeReflex({...c,title:pl?'Chute à queima-roupa!':'Chute de longe!',window:(pl?620:950)+skillOf('REF')*250})).ok;
 return _runChanceSW(c);
};
IO_UI.chance=async c=>runChance(c);
// treinos semanais usam os mesmos mini games
const _weeklySW=weeklyTraining;
weeklyTraining=async function(k){
 const map={finish:{f:()=>swipeShot({kind:'finish',comp:'Treino',title:'Finalização no treino',skill:skillOf('FIN'),keeper:.45})},fk:{f:()=>swipeShot({kind:'fk',comp:'Treino',title:'Cobrança de falta',skill:(skillOf('FIN')+skillOf('PAS'))/2,keeper:.45})},header:{f:()=>swipeShot({kind:'header',comp:'Treino',title:'Treino de cabeceio',skill:skillOf('FIS'),keeper:.45})},pass:{f:()=>swipePass({kind:'pass',comp:'Treino',title:'Rondo',skill:skillOf('PAS'),defs:2})},long:{f:()=>swipePass({kind:'long',comp:'Treino',title:'Lançamentos',skill:skillOf('PAS')})},dribble:{f:()=>swipeDribble({comp:'Treino',title:'Circuito de drible',need:2,window:1200+skillOf('DRI')*400})},reflex:{f:()=>swipeReflex({comp:'Treino',title:'Reflexos',window:850+skillOf('REF')*250})}};
 if(!map[k])return _weeklySW(k);
 const d=DRILLS.find(x=>x.k===k);let hits=0,perf=0;const n=k==='dribble'?1:3;
 for(let i=0;i<n;i++){const r=await map[k].f();if(k==='dribble'){hits=r.ok?(r.perfect?3:2):1;perf=r.perfect?1:0}else{hits+=r.ok?1:0;perf+=r.perfect?1:0}}
 const chips=[];const st=S.st;if(st){const f=hits>=3?2:hits>=2?1:0;st.forma+=f;if(f)chips.push([`+${f} Forma`,'up'])}
 const gain=hits*4+perf*3+(S.perks&&S.perks.psico?2:0);S.xp[d.a]=(S.xp[d.a]||0)+gain;chips.push([`+${gain} XP ${ATTR_NAME[d.a]}`,'gold']);
 if(S.xp[d.a]>=100){S.xp[d.a]-=100;S.attrs[d.a]=clamp(S.attrs[d.a]+1,1,99);chips.push([`+1 ${ATTR_NAME[d.a]}`,'up']);const w=(POS[S.pos].w[d.a]||0);if(ch(clamp(w*1.6,.05,.75))){S.ovr=clamp(S.ovr+1,30,99);if(S.ovr>S.peak){S.peak=S.ovr;S.peakAge=S.age}chips.push(['+1 OVR','up'])}}
 if(S.ovr>=S.pot){S.pot=Math.min(99,S.ovr+1);chips.push(['↑ Teto subiu','gold'])}else if(hits>=3&&ch(.22)){S.pot=Math.min(99,S.pot+1);chips.push(['↑ Potencial +1','gold'])}
 S.coach=clamp((S.coach??50)+(hits>=2?2:0),0,100);
 return{hits,chips};
};
// treino da pré-temporada também
playTraining=async function(kind){
 let r;const k=kind==='reflex'?'reflex':kind==='dribble'?'dribble':kind==='header'?'header':'finish';
 let hits=0,perf=0;
 if(k==='dribble'){const x=await swipeDribble({comp:'Pré-temporada',title:'Circuito de drible',need:2,window:1200+skillOf('DRI')*400});hits=x.ok?(x.perfect?3:2):1;perf=x.perfect?1:0}
 else for(let i=0;i<3;i++){const x=k==='reflex'?await swipeReflex({comp:'Pré-temporada',title:`Reflexo ${i+1} de 3`,window:850+skillOf('REF')*250}):await swipeShot({kind:k,comp:'Pré-temporada',title:`${k==='header'?'Cabeceio':'Finalização'} ${i+1} de 3`,skill:skillOf(k==='header'?'FIS':'FIN'),keeper:.45});hits+=x.ok?1:0;perf+=x.perfect?1:0}
 const attr=k==='reflex'?'REF':k==='dribble'?'DRI':k==='header'?'FIS':'FIN';const out=[];
 if(hits>=3){S.st.forma+=2;out.push(['+2 Forma','up'])}else if(hits===2){S.st.forma+=1;out.push(['+1 Forma','up'])}else out.push(['Treino fraco','down']);
 if(perf>=1&&ch(.6)){S.attrs[attr]=clamp(S.attrs[attr]+1,10,99);out.push([`+1 ${ATTR_NAME[attr]}`,'gold']);if(ch(.5)){S.ovr=clamp(S.ovr+1,30,99);if(S.ovr>=S.pot)S.pot=Math.min(99,S.ovr+1);out.push(['+1 OVR','up'])}}
 return{hits,perf,of:3,attr,chips:out};
};
