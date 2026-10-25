// ================== LANCES (motor v2) ==================
// O motor anterior está guardado em backup/nssmoment-jogabilidade-v1-2026-10-19.js
// ---------- som (sintetizado, sem arquivos) ----------
const SFX={ac:null,on:(()=>{try{return localStorage.getItem('fdb_snd')!=='0'}catch(e){return true}})(),loop:null,
 ctx(){if(!this.on)return null;try{if(!this.ac)this.ac=new (window.AudioContext||window.webkitAudioContext)();if(this.ac.state==='suspended')this.ac.resume();return this.ac}catch(e){return null}},
 toggle(){this.on=!this.on;try{localStorage.setItem('fdb_snd',this.on?'1':'0')}catch(e){}if(!this.on)this.stopLoop();return this.on},
 nbuf(a,sec){const b=a.createBuffer(1,Math.max(1,a.sampleRate*sec|0),a.sampleRate);const d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b},
 noise(o){const a=this.ctx();if(!a)return;const s=a.createBufferSource();s.buffer=this.nbuf(a,o.dur);const f=a.createBiquadFilter();f.type=o.type||'lowpass';f.frequency.value=o.f||800;f.Q.value=o.q||.7;const g=a.createGain();const t=a.currentTime;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(o.gain||.3,t+(o.att||.01));g.gain.exponentialRampToValueAtTime(.0008,t+o.dur);if(o.f2)f.frequency.exponentialRampToValueAtTime(o.f2,t+o.dur);s.connect(f);f.connect(g);g.connect(a.destination);s.start(t);s.stop(t+o.dur+.05)},
 tone(o){const a=this.ctx();if(!a)return;const s=a.createOscillator();s.type=o.type||'sine';const g=a.createGain();const t=a.currentTime+(o.delay||0);s.frequency.setValueAtTime(o.f,t);if(o.f2)s.frequency.exponentialRampToValueAtTime(o.f2,t+o.dur);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(o.gain||.2,t+(o.att||.005));g.gain.exponentialRampToValueAtTime(.0008,t+o.dur);s.connect(g);g.connect(a.destination);s.start(t);s.stop(t+o.dur+.05)},
 kick(p=.6){this.tone({f:150,f2:45,dur:.16,gain:.5*p+.2});this.noise({dur:.06,f:2500,gain:.15*p+.05,type:'bandpass'})},
 touch(){this.tone({f:120,f2:60,dur:.08,gain:.18})},
 net(){this.noise({dur:.5,f:3000,f2:700,gain:.22,type:'bandpass',q:.5,att:.02})},
 post(){this.tone({f:1250,dur:.6,gain:.18,type:'triangle'});this.tone({f:1870,dur:.45,gain:.08,type:'sine'});this.tone({f:140,f2:60,dur:.15,gain:.3})},
 roar(){this.noise({dur:2.8,f:500,f2:1400,gain:.38,att:.25,q:.4});this.noise({dur:2.4,f:1600,gain:.12,att:.3,type:'bandpass'})},
 ooh(){this.noise({dur:1.3,f:420,f2:260,gain:.22,att:.2,q:.6})},
 whistle(){this.tone({f:2600,dur:.22,gain:.12,type:'square'});this.tone({f:2750,dur:.32,gain:.1,type:'square',delay:.26})},
 save(){this.tone({f:220,f2:110,dur:.12,gain:.3});this.ooh()},
 startLoop(){const a=this.ctx();if(!a||this.loop)return;const s=a.createBufferSource();s.buffer=this.nbuf(a,2);s.loop=true;const f=a.createBiquadFilter();f.type='lowpass';f.frequency.value=650;const g=a.createGain();g.gain.value=0;g.gain.linearRampToValueAtTime(.05,a.currentTime+.6);s.connect(f);f.connect(g);g.connect(a.destination);s.start();this.loop={s,g}},
 stopLoop(){if(!this.loop||!this.ac)return;const{s,g}=this.loop;try{g.gain.linearRampToValueAtTime(0,this.ac.currentTime+.4);s.stop(this.ac.currentTime+.5)}catch(e){}this.loop=null}
};
const NM={};const GW=5.0,GH=3.2;
function nmCrowd(){
 if(NM.crowd)return NM.crowd;
 const c=document.createElement('canvas');c.width=420;c.height=96;const x=c.getContext('2d');
 x.fillStyle='#8a8f96';x.fillRect(0,0,420,96);
 const cols=['#e8e1d3','#c8102e','#1e4fd8','#f2c443','#2e9e4f','#ff8c3a','#ffffff','#7a3cc8','#d0312d','#1b5fbf'];const skins=['#f1c9a5','#d9a27a','#a86f45','#6e4426'];
 for(let r=0;r<6;r++){const y=4+r*15;x.fillStyle=r%2?'#9aa0a8':'#7d838b';x.fillRect(0,y+11,420,4);
  for(let i=0;i<54;i++){if(Math.random()<.08)continue;const px=i*7.8+(r%2)*3.5+Math.random();x.fillStyle=cols[(Math.random()*cols.length)|0];x.fillRect(px,y+5,6,6);x.fillStyle=skins[(Math.random()*skins.length)|0];x.fillRect(px+1,y,4,5);x.fillStyle='rgba(0,0,0,.25)';x.fillRect(px+4,y+5,2,6)}}
 return NM.crowd=c;
}
function nmHex(h){h=(h||'#888').replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[(n>>16)&255,(n>>8)&255,n&255]}
function nmShade(h,f){const[r,g,b]=nmHex(h);const m=v=>Math.max(0,Math.min(255,Math.round(v*f)));return`rgb(${m(r)},${m(g)},${m(b)})`}
function nmOppColor(c1){const[r,g,b]=nmHex(c1);const red=r>140&&g<110&&b<110,blue=b>130&&r<110;const light=(r+g+b)/3>200;return red?['#f4f4f4','#1d3f9e']:blue||light?['#d0312d','#f4f4f4']:['#f4f4f4','#d0312d']}

// ================== MOTOR DE LANCES v2 ==================
// Reconstruído a partir do documento de design "jogabilidade de lances":
//  • máquina de estados: SETUP → POSSESSION → FLIGHT → CONTEST/RECEIVE → OUTCOME (KEEPER no modo goleiro)
//  • gestos separados por contexto: arrastar PRA FRENTE = chute (lado = mira, comprimento = força, curvar o dedo = efeito);
//    arrastar/tocar NO COMPANHEIRO = passe (com assistência leve); tocar no gramado = conduzir; arrastar pro lado perto do marcador = drible
//  • resolução por intenção (canto/centro/altura) + erro previsível (atributo, distância, pressão, força)
//  • IA por regras (apoio, corrida, marcação, pressão, interceptação), só o mais próximo de cada time disputa a sobra
//  • goleiro entre a bola e o centro do gol; rebote, escanteio, trave; avaliação curta explicando o resultado
function nssMoment(o){
 return new Promise(res=>{
  if(o.ast&&o.assist==null)o={...o,assist:true};
  NM.netHit=null;NM.intc=null;NM.grade=null;NM.why='';NM.rebs=0;NM.last='';NM.stars=0;
  const K=o.kind||'finish',GK=K==='keeper',pl=!!o.planned,SETP=K==='fk'||K==='pen';
  const BOOT=(()=>{try{if(!S.boot||!(S.bootLeft>0))return null;return BOOTS.find(x=>x.id===S.boot)||null}catch(e){return null}})();const BB=BOOT?Object.values(BOOT.b).reduce((a,c)=>a+c,0)/10:0;
  const skill=clamp((o.skill??.6)+BB*.06,.12,.98);
  const sk=k=>{try{return typeof skillOf==='function'?clamp(skillOf(k)*.45+skill*.55,.1,.98):skill}catch(e){return skill}};
  const FIN=sk('FIN'),PAS=sk('PAS'),DRI=sk('DRI'),VEL=sk('VEL'),REF=GK?skill:sk('REF');
  const kq=clamp((o.keeper??.45)*1.65,.45,.95);const spdMul=o.speed||1;
  const myC=(typeof club==='function'&&club())?[club().c1||'#ff7a2b',club().c2||'#ffffff']:['#ff7a2b','#ffffff'];const opC=nmOppColor(myC[0]);
  const PRISON=/Pátio|prisão/i.test(o.comp||'');const TRAIN=PRISON||/Treino|Peneira|Pré|Tutorial|Pelada/i.test(o.comp||'');
  const NIGHT=!TRAIN&&(NM.night=ch(.25));
  // ---------- agentes ----------
  const P=[];const mk=(team,x,d,ex={})=>{const p={team,x,d,vx:0,vd:0,ph:Math.random()*6,sp:6,jump:0,num:0,fall:0,...ex};P.push(p);return p};
  let me=null,gk=null;const ball={x:0,d:0,h:0,vx:0,vd:0,vh:0,spin:0,rot:0};
  let tmax=10,tag='Lance',hint='';const side=ch(.5)?1:-1;
  const RP=k=>typeof rpgHas==='function'&&rpgHas(k);
  const mySp=6.2+VEL*1.8+(RP('arranque')?.8:0);
  let nI=0;const NUMS=[7,8,10,11,17,19,20,21,23];
  const mate=(x,d,ex)=>mk('mate',x,d,{sp:6.3,num:NUMS[(nI++)%NUMS.length],...ex});
  const opp=(x,d,ex)=>mk('opp',x,d,{sp:(5.3+Math.random()*.5)*spdMul,num:[2,3,4,5,6,14,15][P.length%7],...ex});
  let G={t:0,st:'SETUP',owner:null,dead:false,flight:null,carry:null,burst:0,grace:0,cue:null,combo:0,assisted:false,hd:null,gkIn:null,out:null,first:null,tk:0,nextTk:0,miss:0,touched:false};
  // ---------- SETUP: cada tipo de lance começa numa situação legível ----------
  if(GK){
   gk=mk('me',0,.9,{isGK:true});const sh=mk('opp',o.pen?0:R(-8,8),o.pen?13:R(15,21),{sp:0,shooter:true,num:9});
   ball.x=o.pen?0:sh.x*.96;ball.d=o.pen?11:sh.d-2.2;G.dead=true;tmax=7;tag='Defesa';
   hint='Fique de olho no <b>quadril do batedor</b> logo antes do chute. <b>Toque no canto</b> do gol pra mergulhar. Se pular cedo demais, ele muda o lado.';
   const sideS=ch(.5)?1:-1;G.gkShot={side:sideS,tx:sideS*R(1.6,GW-.45),th:ch(.4)?R(1.4,2.5):R(.15,1.1),runT:R(1.1,1.6)};
   G.gkShot.cue=ch(.72)?sideS:-sideS;
  }else if(K==='pen'){
   ball.x=0;ball.d=11;me=mk('me',0,12.5);G.dead=true;tmax=99;tag='Pênalti';
   hint='<b>Arraste pra frente</b> a partir da bola: o <b>lado</b> do arrasto escolhe o canto, o <b>comprimento</b> é a força. Mais forte = mais alto e mais arriscado.';
  }else if(K==='fk'){
   const fx=R(-11,11),fd=R(20,27);ball.x=fx;ball.d=fd;G.dead=true;
   const ux=-fx,ud=-fd,L=Math.hypot(ux,ud);me=mk('me',fx-ux/L*1.3,fd-ud/L*1.3);
   const n=fd<23.5?4:3;const wx=fx+ux/L*9.15,wd=fd+ud/L*9.15;const px=-ud/L,pd=ux/L;const near=-Math.sign(fx||1);
   for(let i=0;i<n;i++){const k=(i-(n-1)/2)*.62+near*.35;opp(wx+px*k,wd+pd*k,{wall:true,sp:0})}
   tmax=99;tag='Falta';hint='<b>Arraste pra frente</b> mirando o canto. <b>Curve o dedo</b> no caminho pra dar efeito por cima/ao lado da barreira.';
  }else if(K==='header'){
   me=mk('me',R(-3,3),R(9,12.5));opp(me.x+R(-.8,.8),me.d+R(.6,1.2),{mark:me});opp(-me.x*.5,me.d-R(2,4));
   tmax=8;tag='Cabeçada';hint='A bola vem cruzada. <b>Arraste na direção do canto</b> antes dela chegar (ou toque quando ela estiver em cima de você).';
  }else if(K==='cross'){
   me=mk('me',side*R(23,27),R(11,19));
   const a=mate(side*R(3,6),R(10,13),{spot:{x:side*1.6,d:R(5.5,6.8)}}),b=mate(-side*R(2,4),R(13,16),{spot:{x:-side*R(2,3.2),d:R(7,8.5)}}),c=mate(R(-2,2),R(18,21),{spot:{x:R(-1.5,1.5),d:R(11.5,13)}});
   opp(a.x+R(-.6,.6),a.d-1.1,{mark:a});opp(b.x+R(-.6,.6),b.d-1.1,{mark:b});opp(me.x-side*2.5,me.d-3.5,{sp:5*spdMul});
   tmax=9;tag='Cruzamento';hint='<b>Toque num companheiro</b> dentro da área ou <b>arraste na direção dele</b>. Os círculos azuis mostram quem está atacando a bola.';
  }else if(K==='long'){
   me=mk('me',R(-12,12),R(55,62));const far=mate(R(-18,18),R(26,33),{spot:null});far.run={x:far.x*.7,d:far.d-10};
   mate(clamp(me.x+R(-11,11),-26,26),me.d-R(13,17));opp(far.x+R(-1.5,1.5),far.d-R(1,2.5),{mark:far});opp(me.x+R(-2,2),me.d-R(5,7));
   tmax=9;tag='Lançamento';hint='<b>Toque no companheiro lá na frente</b> ou arraste na direção dele: a bola vai pelo alto, na corrida dele.';
  }else if(K==='pass'){
   me=mk('me',R(-10,10),o.assist?R(27,32):R(40,48));
   const n=o.defs>=3?3:2;const ms=[];for(let i=0;i<n;i++)ms.push(mate(clamp(me.x+(i-(n-1)/2)*R(9,12),-26,26),me.d-(o.assist?R(9,13):R(10,16))));
   ms.forEach(m=>{m.run={x:m.x*.85+R(-3,3),d:Math.max(o.assist?10:14,m.d-R(4,8))}});
   opp(me.x+R(-1.5,1.5),me.d-R(5,7));for(let i=0;i<(o.defs||2)-1;i++){const m=ms[i%ms.length];opp(m.x+R(-1.5,1.5),m.d-R(.8,2),{mark:m})}
   tmax=9;tag='Passe';hint='<b>Toque no companheiro</b> pra passe seguro, ou <b>arraste na direção dele</b> controlando a força. Quem está <b>LIVRE</b> tem o círculo verde.';
  }else if(K==='combo'){
   me=mk('me',R(-6,6),R(25,29));const m=mate(clamp(me.x+side*R(5,7),-20,20),me.d-R(5,7));
   opp(m.x+R(-1,1),m.d-1.3,{mark:m,loose:true});opp(me.x-side*R(1,2),me.d-R(5,6.5));
   tmax=11;tag='Tabela';hint='<b>Toque no companheiro</b>: ele devolve de primeira na sua corrida. Aí é <b>arrastar pra frente</b> e finalizar.';
  }else if(K==='dribble'){
   me=mk('me',R(-4,4),R(32,36));const n=o.need||2;
   for(let i=0;i<n;i++)opp(clamp(me.x+R(-2,2),-16,16),me.d-6-i*6.5,{sp:(4.9+i*.3)*spdMul});
   mate(clamp(me.x+(me.x>0?-1:1)*R(8,11),-20,20),me.d-R(3,6));
   tmax=14;tag='Drible';hint='<b>Toque no gramado</b> pra conduzir. Perto do marcador, <b>arraste pro lado</b> pra driblar. Chegue na área com a bola (ou finalize).';
  }else if(K==='chip'){
   me=mk('me',R(-3,3),R(17,21));opp(me.x+R(-1,1),me.d+R(2.5,4),{sp:6.4*spdMul});
   tmax=7;tag='Cobertura';hint='O goleiro saiu! <b>Arraste curto e suave</b> pra frente: com o goleiro adiantado a bola sai <b>por cima</b> dele.';
  }else{
   me=mk('me',R(-8,8),pl?R(15,21):R(17,25));
   opp(clamp(me.x+R(-2,2),-18,18),me.d-R(3.5,5.5));opp(me.x+side*R(2,3.5),me.d+R(1.5,3),{sp:6*spdMul});
   const m=mate(clamp(me.x+(me.x>0?-1:1)*R(6,9),-18,18),me.d-R(2,5));m.run={x:m.x*.8,d:Math.max(9,m.d-5)};
   tmax=9;tag='Finalização';hint='<b>Arraste pra frente</b> a partir da bola: <b>lado</b> = canto, <b>comprimento</b> = força, <b>curva no dedo</b> = efeito. Toque no companheiro pra tocar, ou no gramado pra conduzir.';
  }
  if(!GK){gk=mk('gk',0,1.2,{sp:4.6,num:1});if(K==='chip'){gk.d=R(6.5,8.5);gk.rush=true}}
  if(me&&!SETP&&!GK){ball.x=me.x;ball.d=me.d-.5;if(K!=='header'){G.owner=me}}
  if(me){me.num=S.num||9}
  P.forEach(p=>{if(p.team==='opp'){p.c=opC[0];p.c2=opC[1]}else if(p.team==='gk'){p.c='#f5e400';p.c2='#222'}else{p.c=myC[0];p.c2=myC[1]}});
  if(GK){gk.c='#3cdc5a';gk.c2='#222'}
  // cruzamento que vem pra cabeçada
  if(K==='header'){const MP={x:me.x+R(-1,1),d:me.d+R(-.6,.8)};ball.x=side*R(22,27);ball.d=R(8,14);ball.h=.25;const t=R(1.35,1.6);
   const s=solveLob(ball,MP.x,MP.d,1.85,t);ball.vx=s.vx;ball.vd=s.vd;ball.vh=s.vh;G.hdMP=MP;G.hdArr=t;G.flight={type:'cross',by:null,t0:0,lofted:true,tried:new Set()};}

  // ---------- quadro ----------
  $ov.hidden=false;
  $ov.innerHTML=`<div class="ovwrap mg nssm"><div class="nm-top"><span class="eyebrow">${esc(o.comp||'')}${o.min!=null?` · ${o.min}'`:''}</span><span class="nm-tr"><button class="nm-snd" id="nmSnd" aria-label="Som">${SFX.on?'🔊':'🔇'}</button><span class="tag campo">${esc(tag)}</span></span></div>
  <h2 class="pkh nm-t">${esc(o.title||'')}</h2><div class="nm-stage"><canvas id="nmC"></canvas></div><p class="swhint nm-h">${hint}</p><div class="pkres" id="mgRes"></div></div>`;
  const cv=document.getElementById('nmC');const ctx=cv.getContext('2d');
  document.getElementById('nmSnd').onclick=e=>{const on=SFX.toggle();e.currentTarget.textContent=on?'🔊':'🔇';if(on)SFX.startLoop()};
  const stage=cv.parentElement;const W=Math.min(stage.clientWidth||360,480);const H=Math.round(Math.min(W*(GK?1.02:1.28),Math.max(320,innerHeight-235)));
  const dpr=Math.min(2,devicePixelRatio||1);cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
  cv.style.touchAction='none';
  const F=GK?H*.95:H*1.3,hz=GK?H*.3:H*.4;

  // ---------- câmera: enquadra bola, jogador controlado, gol e marcadores próximos ----------
  const XF=K==='cross'?(()=>{const dx=-me.x,dd=7-me.d,L=Math.hypot(dx,dd)||1;return[dx/L,dd/L]})():null;
  function behind(sx,sd,B,off){let fx,fd;if(XF){[fx,fd]=XF}else{fx=(0-sx)*.5;fd=Math.min(-5-sd,-3);const L=Math.hypot(fx,fd)||1;fx/=L;fd/=L}
   const y=Math.atan2(fx,-fd),rx=Math.cos(y),rd=Math.sin(y),o2=off==null?(XF?0:1.6):off;return{x:sx-fx*B+rx*o2,d:sd-fd*B+rd*o2,y}}
  const CB=11.5,CHh=6.2,CTl=.3;
  const cam=GK?{x:0,d:-7.6,h:2.5,dir:-1,tilt:0,z:1,yaw:0}:(()=>{const s0=SETP?ball:(me||ball);const b=behind(s0.x,s0.d,SETP?(K==='pen'?8:9):CB,SETP?0:null);return{x:b.x,d:b.d,h:SETP?(K==='pen'?4.2:5):CHh,dir:1,tilt:SETP?.28:CTl,z:1,yaw:b.y}})();
  const proj=(x,d,h,mn)=>{const cy=Math.cos(cam.yaw||0),sy=Math.sin(cam.yaw||0),dx0=x-cam.x,dd0=d-cam.d;const lat=(dx0*cy+dd0*sy)*cam.dir,dz=(dx0*sy-dd0*cy)*cam.dir,dy=h-cam.h,ct=Math.cos(cam.tilt),st=Math.sin(cam.tilt);const zc=dz*ct-dy*st;if(zc<(mn||.35))return null;const yc=dy*ct+dz*st;const s=F*cam.z/zc;return{x:W/2+lat*s,y:hz-yc*s,s}};
  function unproj(sx,sy){const ct=Math.cos(cam.tilt),st=Math.sin(cam.tilt);const FZ=F*cam.z;const v=(hz-sy)/FZ;const den=st-v*ct;if(den<=.01)return null;const dz=cam.h*(ct+v*st)/den;const zc=dz*ct+cam.h*st;if(zc<=.1)return null;const s=FZ/zc;const lat=(sx-W/2)/s;const cy=Math.cos(cam.yaw||0),sy2=Math.sin(cam.yaw||0);const Lw=lat*cam.dir,Dw=dz*cam.dir;return{x:cam.x+cy*Lw+sy2*Dw,d:cam.d+sy2*Lw-cy*Dw}}
  const dist=(a,b)=>Math.hypot(a.x-b.x,a.d-b.d);
  const spd=()=>Math.hypot(ball.vx,ball.vd);

  const myLook=(typeof faceLook==='function'&&S.face&&!S.face.photo)?faceLook(S.face):null;
  const meP=me||(GK?gk:null);if(meP&&myLook){meP.skin=myLook.skin;meP.hairC=myLook.hair;meP.hs=myLook.vstyle||myLook.style;meP.band=myLook.band;meP.beard=myLook.beard}
  if(meP&&S.boots&&S.boots.c)meP.boot=S.boots.c;
  const surname=(S.name||'').trim().split(/\s+/).slice(-1)[0].toUpperCase().slice(0,10);
  // texturas prontas
  function nmGrass(){if(NM.grass)return NM.grass;const c=document.createElement('canvas');c.width=c.height=96;const x=c.getContext('2d');for(let i=0;i<1400;i++){x.fillStyle=Math.random()<.5?'rgba(0,0,0,.09)':'rgba(255,255,255,.07)';x.fillRect(Math.random()*96,Math.random()*96,1,Math.random()*2+1)}return NM.grass=c}
  function nmTrees(){if(NM.trees)return NM.trees;const c=document.createElement('canvas');c.width=600;c.height=80;const x=c.getContext('2d');for(let i=0;i<70;i++){const cx=Math.random()*600,r=10+Math.random()*22;x.fillStyle=['#1f4d2a','#275e33','#2f6b3a','#1a4224'][i%4];x.beginPath();x.arc(cx,80-r*.7,r,0,7);x.fill()}x.fillStyle='rgba(0,0,0,.18)';x.fillRect(0,64,600,16);return NM.trees=c}
  const grassPat=ctx.createPattern(nmGrass(),'repeat');
  const flashes=[];const parts=[];let shakeT=0,shakeA=0,flashT=0;const trail=[];
  NM.netHit=null;
  // câmera de entrada
  const camEnd={x:cam.x,d:cam.d,h:cam.h};if(!GK){const y=cam.yaw||0;cam.x-=Math.sin(y)*6;cam.d+=Math.cos(y)*6;cam.h+=3.5}
  function burst(x,y,n,cols,spd,grav,size){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,v=spd*(.4+Math.random());parts.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v-spd*.6,g:grav,life:1,dec:.6+Math.random()*.8,c:cols[i%cols.length],s:size*(.6+Math.random()*.8),rot:Math.random()*6})}}
  function shake(a,t){shakeA=a;shakeT=t}
  function tapFx(t){try{if(navigator.vibrate)navigator.vibrate(t==='touch'?8:18)}catch(e){}
   if(t==='touch')SFX.touch();else SFX.kick(t==='header'?.4:.8);
   const bp=proj(ball.x,ball.d,ball.h);if(bp&&t!=='header')burst(bp.x,bp.y,t==='touch'?4:10,['#3d8a35','#6b4a2a','#9ad07a'],t==='touch'?40:90,260,2.2)}
  function onEnd(ok,big){
   if(big==='GOOOL!'){SFX.net();setTimeout(()=>SFX.roar(),120);shake(9,.5);flashT=.35;NM.netHit={x:ball.x,h:clamp(ball.h,.2,2.3),t:0};burst(W/2,H*.05,46,['#f2c443','#ffffff',myC[0],myC[1]],220,320,4.2)}
   else if(big==='NA TRAVE!'){SFX.post();shake(6,.35);SFX.ooh();const bp=proj(ball.x,0,ball.h);if(bp)burst(bp.x,bp.y,14,['#ffffff','#fff4c4'],120,200,1.8)}
   else if(big==='DEFENDEU!'){if(GK&&ok){SFX.save();setTimeout(()=>SFX.roar(),100);shake(5,.3);burst(W/2,H*.05,30,['#3cdc5a','#ffffff','#f2c443'],200,320,3.6)}else SFX.save()}
   else if(ok){SFX.roar();burst(W/2,H*.05,24,['#f2c443','#ffffff',myC[0]],180,320,3.2)}
   else if(big==='GOL DELES'){SFX.ooh()}
   else SFX.ooh();
   SFX.stopLoop();
  }
  // ---------- desenho ----------
  const crowd=nmCrowd();
  function line3(pts,w,col){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();let pen=false;for(const[x,d,h]of pts){const p=proj(x,d,h||0,2.2);if(!p){pen=false;continue}if(!pen){ctx.moveTo(p.x,p.y);pen=true}else ctx.lineTo(p.x,p.y)}ctx.stroke()}
  function seg(x1,d1,x2,d2,n=16){const a=[];for(let i=0;i<=n;i++){const t=i/n;a.push([x1+(x2-x1)*t,d1+(d2-d1)*t,0])}return a}
  function quad(pts,fill){const q=pts.map(([x,d,h])=>proj(x,d,h||0,1));if(q.some(p=>!p))return;ctx.fillStyle=fill;ctx.beginPath();q.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fill()}
  function glow(x,y,r,col){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,col);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2)}
  function drawField(){
   const farD=cam.dir>0?-7:46;const nearD=cam.d-cam.dir*.6;
   const bt=proj(cam.x,farD,0),btop=proj(cam.x,farD+(cam.dir>0?-9:9),7.5);
   let yB=bt?bt.y:hz+10,yT=btop?Math.max(hz*.2,btop.y):0;
   if(Math.abs(cam.yaw||0)>.05){let best=null;const pp=[];for(let i=0;i<=24;i++){const t=i/24;pp.push([-38+76*t,-7],[38,-7+62*t],[-38,-7+62*t])}
    for(const[x,d]of pp){const q=proj(x,d,0,1);if(!q||q.x<-W*.2||q.x>W*1.2)continue;if(!best||q.y<best.q.y)best={q,x,d}}
    if(best){yB=best.q.y;const up=proj(best.x,best.d,7.5,1);yT=up?Math.max(hz*.1,up.y):yB-60}}
   // céu
   const sk=ctx.createLinearGradient(0,0,0,yB);
   if(NIGHT){sk.addColorStop(0,'#040914');sk.addColorStop(1,'#16304f')}else{sk.addColorStop(0,'#5c95d6');sk.addColorStop(1,'#cfe5f6')}
   ctx.fillStyle=sk;ctx.fillRect(0,0,W,H);
   if(PRISON){const wh=Math.max(30,(yB-yT)*1.1);ctx.fillStyle='#8c8a84';ctx.fillRect(0,yB-wh,W,wh);ctx.fillStyle='rgba(0,0,0,.12)';for(let x=0;x<W;x+=26)ctx.fillRect(x,yB-wh,2,wh);for(let y=yB-wh;y<yB;y+=12)ctx.fillRect(0,y,W,1);
    ctx.strokeStyle='#3a3a3a';ctx.lineWidth=1.2;ctx.beginPath();for(let x=0;x<=W;x+=8){ctx.lineTo(x,yB-wh-(x/8%2?6:0))}ctx.stroke();ctx.beginPath();for(let x=4;x<=W;x+=8){ctx.lineTo(x,yB-wh-3-(x/8%2?0:5))}ctx.stroke();
    ctx.fillStyle='#5f5d58';ctx.fillRect(W*.78,yB-wh-46,22,46);ctx.fillRect(W*.76,yB-wh-54,32,10);glow(W*.79,yB-wh-50,40,'rgba(255,250,200,.35)')}
   else if(TRAIN){
    ctx.drawImage(nmTrees(),-(cam.x*3%60)-30,yB-Math.max(30,(yB-yT)*.9),W+60,Math.max(30,(yB-yT)*.9));
    // alambrado
    ctx.strokeStyle='rgba(60,70,60,.45)';ctx.lineWidth=1;const fh=Math.max(8,(yB-yT)*.35);for(let x=0;x<W;x+=7){ctx.beginPath();ctx.moveTo(x,yB-fh);ctx.lineTo(x+fh*.5,yB);ctx.moveTo(x+fh*.5,yB-fh);ctx.lineTo(x,yB);ctx.stroke()}
    ctx.fillStyle='rgba(90,100,90,.8)';ctx.fillRect(0,yB-fh-2,W,2);
   }else{
    // arquibancada em dois anéis + cobertura
    const hh=Math.max(6,yB-yT),mid=yT+hh*.42;
    ctx.fillStyle=NIGHT?'#05080e':'#2a323c';ctx.fillRect(0,yT-hh*.18,W,hh*.2);
    ctx.drawImage(crowd,0,yT,W,mid-yT);ctx.drawImage(crowd,40,0,380,90,0,mid+2,W,yB-mid-2);
    ctx.fillStyle=NIGHT?'rgba(0,0,10,.42)':'rgba(0,0,0,.18)';ctx.fillRect(0,yT,W,mid-yT);
    ctx.fillStyle='rgba(0,0,0,.45)';ctx.fillRect(0,mid-1,W,3);
    // flashes de câmera
    if(Math.random()<(NIGHT?.5:.25))flashes.push({x:Math.random()*W,y:yT+Math.random()*(yB-yT),t:1});
    for(let i=flashes.length-1;i>=0;i--){const f=flashes[i];f.t-=.08;if(f.t<=0){flashes.splice(i,1);continue}ctx.fillStyle=`rgba(255,255,255,${f.t})`;ctx.fillRect(f.x,f.y,2,2)}
    if(NIGHT){// torres de refletor
     const lt=[[W*.06,yT-hh*.45],[W*.94,yT-hh*.45]];for(const[lx,ly]of lt){ctx.fillStyle='#0b0f16';ctx.fillRect(lx-1.5,ly,3,yT-ly);ctx.fillStyle='#e9f1ff';ctx.fillRect(lx-12,ly-6,24,8);glow(lx,ly-2,Math.max(60,W*.22),'rgba(220,235,255,.55)')}
     for(let i=0;i<9;i++){const lx=W*(.12+i*.095);glow(lx,yT-hh*.12,14,'rgba(255,250,230,.6)')}
    }
   }
   // gramado
   const gg=ctx.createLinearGradient(0,yB,0,H);
   if(PRISON){gg.addColorStop(0,'#77746d');gg.addColorStop(1,'#9b978e')}else if(NIGHT){gg.addColorStop(0,'#2f7d31');gg.addColorStop(1,'#45a43f')}else{gg.addColorStop(0,'#4ea83a');gg.addColorStop(1,'#5bbd45')}
   ctx.fillStyle=gg;ctx.fillRect(0,yB,W,H-yB);
   const lo=Math.min(farD,nearD),hi=Math.max(farD,nearD);
   for(let d=Math.floor(lo/5)*5;d<hi;d+=5){const a=Math.max(lo,d),b=Math.min(hi,d+5);if(((d/5)|0)%2===0)quad([[-60,a],[60,a],[60,b],[-60,b]],'rgba(255,255,255,.11)')}
   ctx.save();ctx.globalAlpha=.1;ctx.fillStyle=grassPat;ctx.fillRect(0,yB,W,H-yB);ctx.restore();
   if(NIGHT){const gp=proj(0,8,0);if(gp)glow(gp.x,gp.y,W*.75,'rgba(255,255,235,.10)')}
   // placas de LED
   const off=(performance.now()/1000*2.5)%14;
   for(let i=-6;i<6;i++)quad([[i*7,farD,0],[(i+1)*7,farD,0],[(i+1)*7,farD,1],[i*7,farD,1]],i%2?(NIGHT?'#0d1a6e':'#f3efe4'):(NIGHT?'#ff7a2b':'#d8402f'));
   const tp=proj(cam.x,farD,.5);if(tp){ctx.font=`900 ${Math.max(6,tp.s*.55)}px 'Saira Condensed',sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';for(let i=-4;i<4;i++){const q=proj(i*14+off*cam.dir,farD,.5);if(q){ctx.font=`900 ${clamp(q.s*.55,6,40)}px 'Saira Condensed',sans-serif`;ctx.fillStyle=NIGHT?'#fff':(((i+40)%2)?'#c8321f':'#fff');ctx.fillText(i%2?'FOME DE BOLA':'⚽ AO VIVO',q.x,q.y)}}}
   if(NIGHT&&bt){ctx.fillStyle='rgba(255,140,60,.10)';ctx.fillRect(0,yB-2,W,6)}
   // linhas
   const Lc='rgba(255,255,255,.9)',lw=d=>{const p=proj(0,d,0);return p?clamp(p.s*.1,1,4):1};
   line3(seg(-34,0,34,0,30),lw(0),Lc);
   line3(seg(-20.16,0,-20.16,16.5),lw(8),Lc);line3(seg(20.16,0,20.16,16.5),lw(8),Lc);line3(seg(-20.16,16.5,20.16,16.5,20),lw(16),Lc);
   line3(seg(-9.16,0,-9.16,5.5),lw(3),Lc);line3(seg(9.16,0,9.16,5.5),lw(3),Lc);line3(seg(-9.16,5.5,9.16,5.5),lw(5),Lc);
   const arc=[];for(let i=0;i<=24;i++){const a=-.93+i*1.86/24;const x=Math.sin(a)*9.15,d=11+Math.cos(a)*9.15;if(d>=16.5)arc.push([x,d,0])}line3(arc,lw(18),Lc);
   line3(seg(-34,0,-34,70,40),lw(20),Lc);line3(seg(34,0,34,70,40),lw(20),Lc);line3(seg(-34,52.5,34,52.5,30),lw(52),Lc);
   const cc=[];for(let i=0;i<=40;i++){const a=i/40*Math.PI*2;cc.push([Math.sin(a)*9.15,52.5+Math.cos(a)*9.15,0])}line3(cc,lw(52),Lc);
   const sp=proj(0,11,0);if(sp){ctx.fillStyle=Lc;ctx.beginPath();ctx.ellipse(sp.x,sp.y,sp.s*.12,sp.s*.05,0,0,7);ctx.fill()}
   // bandeirinhas de escanteio
   for(const sx of[-34,34]){const a=proj(sx,0,0),b=proj(sx,0,1.5);if(a&&b){ctx.strokeStyle='#ddd';ctx.lineWidth=Math.max(1,a.s*.04);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.fillStyle='#ff7a2b';ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x+(sx<0?1:-1)*b.s*.35*cam.dir,b.y+b.s*.12);ctx.lineTo(b.x,b.y+b.s*.25);ctx.closePath();ctx.fill()}}
  }
  // rede com ondulação no gol
  function bulge(x,h){const n=NM.netHit;if(!n)return 0;const dd=(x-n.x)**2+(h-n.h)**2;const k=Math.exp(-dd/1.1);const t=n.t;return k*.9*Math.max(0,Math.sin(Math.min(Math.PI,t*7)))*Math.exp(-t*1.6)}
  function drawNet(){
   const nc=cam.dir>0?(NIGHT?'rgba(255,255,255,.34)':'rgba(255,255,255,.4)'):'rgba(255,255,255,.12)';
   ctx.fillStyle=cam.dir>0?'rgba(255,255,255,.05)':'rgba(255,255,255,.02)';
   quad([[-GW,-2.2,0],[GW,-2.2,0],[GW,-1.6,2.2],[-GW,-1.6,2.2]],ctx.fillStyle);
   for(let i=0;i<=16;i++){const x=-GW+i*(2*GW)/16;const pts=[[x,0,GH],[x,-1.6,2.2]];for(let j=8;j>=0;j--){const h=j*2.2/8;pts.push([x,-1.6-(.6*(1-h/2.2))-bulge(x,h),h])}line3(pts,1,nc)}
   for(let j=0;j<=8;j++){const h=j*2.2/8;const pts=[];for(let i=0;i<=16;i++){const x=-GW+i*(2*GW)/16;pts.push([x,-1.6-(.6*(1-h/2.2))-bulge(x,h),h])}line3(pts,1,nc)}
   for(let j=0;j<=6;j++){const t=j/6;line3([[-GW,0,GH*t],[-GW,-2.2+.6*t,GH*t]],1,nc);line3([[GW,0,GH*t],[GW,-2.2+.6*t,GH*t]],1,nc)}
   for(let i=0;i<=8;i++){const dd=-i*1.6/8;line3([[-GW,dd,GH-(i/8)*.24],[GW,dd,GH-(i/8)*.24]],1,nc)}
  }
  function drawPosts(){const p0=proj(0,0,0)||{s:20};const w=Math.max(2,p0.s*.12);line3([[-GW,0,0],[-GW,0,GH],[GW,0,GH],[GW,0,0]],w+1.5,'rgba(0,0,0,.25)');line3([[-GW,0,0],[-GW,0,GH],[GW,0,GH],[GW,0,0]],w,'#fbfbf6');line3([[-GW,0,.02],[-GW,0,GH],[GW,0,GH]],Math.max(1,w*.3),'rgba(255,255,255,.9)')}
  function shadow(x,d,r,a){const p=proj(x,d,0);if(!p)return;ctx.fillStyle=`rgba(0,0,0,${a})`;ctx.beginPath();ctx.ellipse(p.x,p.y,r*p.s,r*p.s*(cam.tilt>.3?.62:.32),0,0,7);ctx.fill();
   if(NIGHT){ctx.fillStyle=`rgba(0,0,0,${a*.35})`;for(const k of[-1,1]){ctx.beginPath();ctx.ellipse(p.x+k*r*p.s*1.3,p.y+r*p.s*.18,r*p.s*1.4,r*p.s*.22,k*.25,0,7);ctx.fill()}}}
  function face3(pts,col){const q=pts.map(([x,d,h])=>proj(x,d,h,.3));if(q.some(v=>!v))return null;ctx.fillStyle=col;ctx.beginPath();q.forEach((v,i)=>i?ctx.lineTo(v.x,v.y):ctx.moveTo(v.x,v.y));ctx.closePath();ctx.fill();return q}
  function vbox(T,cx,cd,h0,w,dp,hg,col){const x0=cx-w/2,x1=cx+w/2,d0=cd-dp/2,d1=cd+dp/2,h1=h0+hg;const tc=cam.dir>0?d1:d0;const sx=cam.x>cx?x1:x0;
   face3([T(sx,d0,h0),T(sx,d1,h0),T(sx,d1,h1),T(sx,d0,h1)],nmShade(col,.7));
   const fq=face3([T(x0,tc,h0),T(x1,tc,h0),T(x1,tc,h1),T(x0,tc,h1)],nmShade(col,.9));
   face3([T(x0,d0,h1),T(x1,d0,h1),T(x1,d1,h1),T(x0,d1,h1)],nmShade(col,1.13));return fq}
  function onQuad(q,u,v){const a=q[0],b=q[1],c=q[2],d=q[3];const x=(1-v)*((1-u)*a.x+u*b.x)+v*((1-u)*d.x+u*c.x),y=(1-v)*((1-u)*a.y+u*b.y)+v*((1-u)*d.y+u*c.y);return{x,y}}
  function drawPlayer(p){
   const isGK=p.team==='gk'||p.isGK;const facing=p.isGK?false:(p.team==='opp'||p.team==='gk')?(GK?true:cam.dir>0):(cam.dir<0);
   const lift=(p.jump>0?Math.sin(p.jump/.45*Math.PI)*.5:0)+(p.lift&&p.isGK?Math.max(0,p.lift-1.2)*.6:0);
   const pr=proj(p.x,p.d,0);if(!pr||pr.s<1.2)return;if(pr.s>F*cam.z/3.2)return;
   const v=Math.hypot(p.vx,p.vd);p.ph+=v*.09;const amt=Math.min(1,v/3);
   let a=0;if(isGK&&p.dive)a=-p.dive*1.15;if(p.fall>0)a=-(p.fallDir||1)*Math.min(1.35,(1-p.fall)*3+.4);
   const ca=Math.cos(a),sa=Math.sin(a),SC=1.55;const bobH=Math.abs(Math.sin(p.ph))*.07*amt;const T=(x,d,h)=>{const dx=(x-p.x)*SC,hh=h*SC;return[p.x+dx*ca-hh*sa,p.d+(d-p.d)*SC,dx*sa+hh*ca+lift+bobH]};
   const kicking=(G.t-(p.kAt??-9))<.32&&!p.isGK;
   const skin=p.skin||'#e3b088',hair=p.hairC||'#2a1a10',shirt=p.c,c2=p.c2,shorts=isGK?'#1a1a1a':(p.team==='opp'?p.c2:'#f4f4f4'),sock=isGK?'#1a1a1a':shirt,boot=p.boot||'#111';
   const sw=Math.sin(p.ph)*amt*.17,up=isGK&&p.dive?1:0;
   // pernas (a de trás primeiro)
   const legs=[-1,1].map(k=>({k,dd:k*sw})).sort((A,B)=>(A.dd-B.dd)*cam.dir);
   for(const L of legs){const kk=kicking&&L.k===1;const lx=p.x+L.k*.11,ld=p.d+L.dd-(kk?.32*cam.dir:0),lh=kk?.16:0;vbox(T,lx,ld-.04*cam.dir,lh,.19,.3,.09,boot);vbox(T,lx,ld,.09+lh,.17,.18,.2,sock);vbox(T,lx,ld*.5+p.d*.5,.29+lh*.5,.18,.19,.12,skin)}
   vbox(T,p.x,p.d,.41,.5,.28,.18,shorts);
   const tq=vbox(T,p.x,p.d,.59,.54,.31,.42,shirt);
   if(tq&&!facing&&!isGK&&pr.s>9){const c=onQuad(tq,.5,.45);const wq=Math.abs(tq[1].x-tq[0].x);ctx.fillStyle=c2;ctx.font=`900 ${Math.max(7,wq*.55)}px 'Saira Condensed',sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(p.num),c.x,c.y);
    if(p.team==='me'&&wq>22){const c3=onQuad(tq,.5,.82);ctx.font=`800 ${Math.max(6,wq*.17)}px 'Saira Condensed',sans-serif`;ctx.fillText(surname,c3.x,c3.y)}}
   if(tq&&facing&&pr.s>9){const c=onQuad(tq,.3,.72);ctx.fillStyle=c2;ctx.fillRect(c.x-1.5,c.y-1.5,3,3)}
   // braços
   for(const k of[-1,1]){const ad=p.d-k*sw;if(up){vbox(T,p.x+k*.37,p.d,.92,.15,.16,.34,shirt);vbox(T,p.x+k*.37,p.d,1.26,.16,.17,.13,isGK?'#ff8c2a':skin)}else{vbox(T,p.x+k*.35,ad,.72,.15,.16,.29,shirt);vbox(T,p.x+k*.35,ad,.58,.14,.15,.14,isGK?'#ff8c2a':skin)}}
   // cabeça em bloco
   const hq=vbox(T,p.x,p.d,1.01,.6,.54,.56,skin);
   const st=p.hs||'buzz';const hh=st==='afro'?.22:st==='quiff'?.15:.09,hw=st==='afro'?.7:.62;
   if(st!=='bald')vbox(T,p.x,p.d,1.57,hw,st==='afro'?.64:.56,hh,hair);
   if(st==='quiff'&&!facing)vbox(T,p.x,p.d-.14*cam.dir,1.66,.36,.18,.11,hair);
   if(!facing&&st!=='bald'){vbox(T,p.x,p.d+.275*cam.dir,st==='long'?.85:1.17,hw,.03,st==='long'?.72:.4,hair)}
   else if(hq&&pr.s>7){const e1=onQuad(hq,.3,.55),e2=onQuad(hq,.7,.55);const es=Math.max(1.5,Math.abs(hq[1].x-hq[0].x)*.1);ctx.fillStyle='#161616';ctx.fillRect(e1.x-es/2,e1.y-es,es,es*1.5);ctx.fillRect(e2.x-es/2,e2.y-es,es,es*1.5);
    if(st!=='bald')vbox(T,p.x,p.d-.28*cam.dir,1.47,hw,.03,.1,hair);if(p.beard){const b=onQuad(hq,.5,.12);ctx.fillStyle=hair;ctx.fillRect(b.x-es*2,b.y-es,es*4,es*1.6)}}
   if(p.band&&!facing)vbox(T,p.x,p.d,1.45,.64,.58,.06,'#ffffff');
  }
  function drawBall(){const p=proj(ball.x,ball.d,ball.h+.22);if(!p)return;const r=Math.max(4.5,.22*p.s);
   const spd=Math.hypot(ball.vx,ball.vd,ball.vh);
   trail.push({x:p.x,y:p.y,r});if(trail.length>9)trail.shift();
   if(spd>11)trail.forEach((t,i)=>{ctx.fillStyle=`rgba(255,255,255,${i/trail.length*.28})`;ctx.beginPath();ctx.arc(t.x,t.y,t.r*(.5+i/trail.length*.5),0,7);ctx.fill()});
   if(spd>18)glow(p.x,p.y,r*3,'rgba(255,240,200,.35)');
   const g=ctx.createRadialGradient(p.x-r*.35,p.y-r*.35,r*.1,p.x,p.y,r);g.addColorStop(0,'#ffffff');g.addColorStop(1,'#cfd3d8');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,r,0,7);ctx.fill();
   ctx.save();ctx.beginPath();ctx.arc(p.x,p.y,r,0,7);ctx.clip();ctx.fillStyle='#1b1b1b';
   const pent=(cx,cy,rr,rot)=>{ctx.beginPath();for(let i=0;i<5;i++){const a=rot+i*Math.PI*2/5;ctx.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr)}ctx.closePath();ctx.fill()};
   pent(p.x+Math.cos(ball.rot)*r*.25,p.y+Math.sin(ball.rot*.7)*r*.25,r*.32,ball.rot);for(let i=0;i<5;i++){const a=ball.rot+i*1.2566;pent(p.x+Math.cos(a)*r*.95,p.y+Math.sin(a)*r*.95,r*.26,a)}
   ctx.restore();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=Math.max(.6,r*.1);ctx.beginPath();ctx.arc(p.x,p.y,r,0,7);ctx.stroke()}
  function ring(x,d,r,col,lw=2.5,pulse){const p=proj(x,d,0);if(!p)return;const k=pulse?1+.12*Math.sin(performance.now()/160):1;ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.beginPath();ctx.ellipse(p.x,p.y,r*p.s*k,r*p.s*(cam.tilt>.3?.62:.33)*k,0,0,7);ctx.stroke()}
  function target(t,r,c){ctx.strokeStyle='rgba(0,0,0,.55)';ctx.lineWidth=5;ctx.beginPath();ctx.arc(t.x,t.y,r,0,7);ctx.stroke();ctx.strokeStyle=c;ctx.lineWidth=3;ctx.beginPath();ctx.arc(t.x,t.y,r,0,7);ctx.stroke();ctx.beginPath();ctx.moveTo(t.x-r*1.5,t.y);ctx.lineTo(t.x-r*.5,t.y);ctx.moveTo(t.x+r*.5,t.y);ctx.lineTo(t.x+r*1.5,t.y);ctx.moveTo(t.x,t.y-r*1.5);ctx.lineTo(t.x,t.y-r*.5);ctx.moveTo(t.x,t.y+r*.5);ctx.lineTo(t.x,t.y+r*1.5);ctx.stroke()}
  function roundRect(x,y,w,h,r){r=Math.min(r,w/2,Math.max(0,h)/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
  function star(cx,cy,r,fill){ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;ctx.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr)}ctx.closePath();ctx.fillStyle=fill?'#f2c443':'rgba(255,255,255,.18)';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=1.5;ctx.stroke()}
  function drawParts(dt){for(let i=parts.length-1;i>=0;i--){const q=parts[i];q.vy+=q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=q.dec*dt;q.rot+=dt*8;if(q.life<=0){parts.splice(i,1);continue}ctx.save();ctx.globalAlpha=Math.min(1,q.life*1.5);ctx.translate(q.x,q.y);ctx.rotate(q.rot);ctx.fillStyle=q.c;ctx.fillRect(-q.s/2,-q.s/4,q.s,q.s/2);ctx.restore()}}
  function vignette(){const g=ctx.createRadialGradient(W/2,H*.55,Math.min(W,H)*.35,W/2,H*.55,Math.max(W,H)*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,NIGHT?'rgba(0,0,10,.5)':'rgba(0,0,0,.3)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}

  // =====================================================================
  // FÍSICA: posição += velocidade·dt; atrito no chão; gravidade no ar; quique com perda
  // =====================================================================
  function integrate(b,dt){
   if(b.h>0||b.vh>0)b.vh-=9.8*dt;
   const s=Math.hypot(b.vx,b.vd);
   if(b.spin&&s>.5){const k=b.spin*(b.h>.05?1:.25);const px=-b.vd/s,pd=b.vx/s;b.vx+=px*k*dt;b.vd+=pd*k*dt;b.spin*=Math.pow(.75,dt)}
   b.x+=b.vx*dt;b.d+=b.vd*dt;b.h+=b.vh*dt;
   if(b.h<=0){b.h=0;if(b.vh<-1.6){b.vh=-b.vh*.42;b.vx*=.86;b.vd*=.86}else b.vh=0}
   const s2=Math.hypot(b.vx,b.vd);if(s2>0){const dec=(b.h===0?(1.05+.012*s2*s2):(.006*s2*s2))*dt;const ns=Math.max(0,s2-dec);b.vx*=ns/s2;b.vd*=ns/s2}
  }
  function sim(b0,secs,stopAtLine){const b={...b0};const pts=[];let t=0;const dt=1/60;let cross=null;
   while(t<secs){const pd=b.d;integrate(b,dt);t+=dt;pts.push({x:b.x,d:b.d,h:b.h,t});if(pd>0&&b.d<=0){const f=pd/(pd-b.d);cross={x:b.x,h:b.h,t};if(stopAtLine)break}if(Math.hypot(b.vx,b.vd)<.3&&b.h===0)break}
   return{pts,cross}}
  // resolve um chute: chega em (tx,th) na linha do gol com a velocidade dada (iterativo, usa a mesma física)
  function solveShot(from,tx,th,v,spin){const L=Math.hypot(tx-from.x,from.d)||1;let ux=(tx-from.x)/L,ud=-from.d/L;let t=L/v;let vh=(th-from.h+4.9*t*t)/t;let aimX=tx,aimH=th;
   let out={vx:ux*v,vd:ud*v,vh};
   for(let it=0;it<6;it++){const L2=Math.hypot(aimX-from.x,from.d)||1;ux=(aimX-from.x)/L2;ud=-from.d/L2;const b={x:from.x,d:from.d,h:from.h,vx:ux*v,vd:ud*v,vh:(aimH-from.h+4.9*t*t)/t,spin};const r=sim(b,4,true);
    out={vx:b.vx,vd:b.vd,vh:b.vh};if(!r.cross)break;t=r.cross.t;aimX+=(tx-r.cross.x)*.9;aimH+=(th-r.cross.h)*.9;if(Math.abs(tx-r.cross.x)<.05&&Math.abs(th-r.cross.h)<.05)break}
   return out}
  // bola alta que cai em (tx,td) com altura de chegada ha, tempo de voo t
  function solveLob(from,tx,td,ha,t){let ax=tx,ad=td,out=null;for(let it=0;it<5;it++){const b={x:from.x,d:from.d,h:from.h,vx:(ax-from.x)/t,vd:(ad-from.d)/t,vh:(ha-from.h+4.9*t*t)/t,spin:0};out={vx:b.vx,vd:b.vd,vh:b.vh};
    const r=sim(b,t+.02,false);const e=r.pts[Math.min(r.pts.length-1,Math.round(t*60)-1)]||r.pts[r.pts.length-1];if(!e)break;ax+=(tx-e.x);ad+=(td-e.d)}return out}
  // velocidade inicial de passe rasteiro pra percorrer L e chegar com ~vEnd
  function groundSpeedFor(L,vEnd){let lo=2,hi=40;for(let i=0;i<22;i++){const v=(lo+hi)/2;const b={x:0,d:0,h:0,vx:v,vd:0,vh:0,spin:0};let x=0,t=0;while(t<6){integrate(b,1/60);t+=1/60;if(b.x>=L)break;if(b.vx<=.2)break}
    if(b.x>=L&&b.vx>=vEnd)hi=v;else lo=v}return hi}

  // =====================================================================
  // ESTADOS E RESULTADO
  // =====================================================================
  let ended=null,banner=null,phase='intro',tIntro=0,ts=1;const gkInfo={};let aim=null;
  function setState(s){G.st=s;G.stT=G.t}
  function pressOn(p){let m=0;for(const q of P){if(q.team!=='opp'||q.wall||q.fall>0)continue;const d0=dist(q,p);m=Math.max(m,clamp(1-(d0-1)/4,0,1))}return m}
  function finish(ok,txt,big,perfect){if(ended)return;if(!ok&&K==='cross'&&G.crossOk&&!/IMPEDIDO/.test(big||'')){ok=true;txt='Cruzamento na medida! '+txt;big='NA MEDIDA!';perfect=G.crossFree}NM.last=txt;try{grade(ok,big,txt)}catch(e){}if(ok&&NM.grade>=88)perfect=true;ended={ok,txt,perfect:!!perfect,t:0};banner={txt:big||txt,ok,t:0};phase='end';setState('OUTCOME');try{onEnd(ok,big)}catch(e){}try{tele(ok)}catch(e){}}
  function flash(txt,ok){banner={txt,ok:!!ok,t:0,tmp:true}}

  // ---------- avaliação pós-jogada: poucos fatores, explicados ----------
  function grade(ok,big,txt){const why=[];let aimQ=.6,decQ=.6,presQ=.5,diff=.5;
   const a=G.act||{};
   if(GK){const r=gkInfo.react;aimQ=gkInfo.early?.15:r==null?0:clamp(1-(r-.15)/.6,0,1);decQ=gkInfo.read==null?.5:(gkInfo.read?1:.2);diff=o.pen?.8:.55;presQ=.6;
    why.push(gkInfo.early?'pulou antes do chute':r==null?'não reagiu':r<.35?'reação rápida':'reagiu tarde');if(gkInfo.read!=null)why.push(gkInfo.read?'leu o lado certo':'foi pro lado errado')}
   else{
    if(a.kind==='shot'){aimQ=clamp(a.aimQ??.5,0,1);why.push(aimQ>.75?'mira no canto':aimQ>.45?'mira razoável':'mira em cima do goleiro');diff=clamp((a.dist-8)/22,0,1)*.6+clamp(1-a.angle,0,1)*.4;if(a.dist>22)why.push('de longe')}
    else if(a.kind==='pass'){aimQ=a.free?1:.5;why.push(a.free?'achou o livre':'passou pro marcado');diff=clamp(a.dist/35,0,1)}
    else if(K==='dribble'){aimQ=clamp(1-G.tk*.3,0,1);why.push(G.tk?'perdeu tempo em dividida':'condução limpa')}
    presQ=a.press!=null?a.press:.4;if(a.press>.55)why.push('sob pressão');
    decQ=a.decQ??.6;if(a.decQ!=null)why.push(a.decQ>.7?'boa decisão':a.decQ<.4?'tinha opção melhor':'decisão ok');
   }
   const res=ok?1:(/TRAVE/.test(big||'')?.4:/DEFENDEU|ESCANTEIO/.test(big||'')?.3:0);
   let g=Math.round(clamp(res*40+aimQ*25+decQ*15+presQ*10+diff*10,0,100));if(!ok)g=Math.min(g,69);
   NM.grade=g;NM.why=why.slice(0,3).join(' · ');NM.stars=g>=85?3:g>=65?2:g>=40?1:0}

  // ---------- telemetria local: entender se o gesto foi entendido antes de mexer na dificuldade ----------
  function tele(ok){let D={};try{D=JSON.parse(localStorage.getItem('fdb_tele')||'{}')}catch(e){}const k=D[K]=D[K]||{n:0,ok:0,dur:0,first:0,miss:0};
   k.n++;if(ok)k.ok++;k.dur+=G.t;k.first+=(G.first??G.t);k.miss+=G.miss;try{localStorage.setItem('fdb_tele',JSON.stringify(D))}catch(e){}NM.tele=D}

  // =====================================================================
  // AÇÕES: chute, passe, condução, drible
  // =====================================================================
  function lead(m,t){const r=m.run||m.spot;if(!r)return{x:m.x+m.vx*t*.5,d:m.d+m.vd*t*.5};const dx=r.x-m.x,dd=r.d-m.d,L=Math.hypot(dx,dd);const run=Math.min(L,(m.sp||6)*t*.85);return L<.01?{x:m.x,d:m.d}:{x:m.x+dx/L*run,d:m.d+dd/L*run}}
  function laneBlock(ax,ad,bx,bd){let worst=0;for(const q of P){if(q.team!=='opp'||q.fall>0)continue;const vx=bx-ax,vd=bd-ad,L2=vx*vx+vd*vd||1;const t=clamp(((q.x-ax)*vx+(q.d-ad)*vd)/L2,0,1);const px=ax+vx*t,pd=ad+vd*t;const dd=Math.hypot(q.x-px,q.d-pd);if(t>.08&&t<.97)worst=Math.max(worst,clamp(1-dd/1.6,0,1))}return worst}
  function shotValue(x,d){const ang=Math.abs(Math.atan2(GW,Math.max(1,d))*2);const dd=Math.hypot(x,d);return clamp(ang/1.2,0,1)*clamp(1.25-dd/30,0,1)*(1-laneBlock(x,d,0,0)*.6)}
  function bestOption(){let best={v:shotValue(ball.x,ball.d),k:'shot'};for(const m of P){if(m.team!=='mate')continue;const lp=lead(m,1);const v=shotValue(lp.x,lp.d)*(1-laneBlock(ball.x,ball.d,lp.x,lp.d))*(isFree(m)?1:.6);if(v>best.v)best={v,k:'pass',m}}return best}
  const isFree=m=>!P.some(q=>q.team==='opp'&&!q.wall&&dist(q,m)<2.4);

  // intenção de chute a partir do gesto → alvo (canto/centro, altura) + erro previsível
  function shotIntent(g){const from={x:ball.x,d:ball.d,h:ball.h};const dir=g.dir;let tx;
   if(dir.d<-.05)tx=from.x+dir.x*(from.d/-dir.d);else tx=from.x+Math.sign(dir.x||1)*20;
   tx=clamp(tx,-GW-2.5,GW+2.5);
   for(const c of[-(GW-.6),0,GW-.6]){if(Math.abs(tx-c)<1.1){tx+=(c-tx)*.45;break}}
   const p=g.power;const chip=gk&&gk.d>3.2&&p<.55&&ball.d<26&&!g.header;
   let th=g.header?clamp(.4+g.dy*1.8,.25,2.4):p<.42?.22:p<.78?.22+(p-.42)/.36*1.3:1.52+(p-.78)*5.2;
   const v=g.header?10.5+p*8:14+p*18;
   const curve=clamp(g.bulge*9,-4.6,4.6)*(.55+.45*FIN);
   const label=chip?'CAVADINHA':g.header?'CABEÇADA':Math.abs(curve)>1.2?'CURVA':p<.42?'COLOCADO':p<.78?'MEIA ALTURA':'BOMBA';
   return{tx,th,v,spin:-curve,chip,label,p}}
  function errOf(it){const pr=G.press||0;const dd=Math.hypot(ball.x,ball.d);
   let sx=(.12+.95*(1-FIN))*(1+1.1*pr)*(.55+dd/24)*(1+1.8*Math.max(0,it.p-.82))*(1+Math.abs(it.spin)*.08);
   if(it.p<.42)sx*=.65;if(pl)sx*=.85;if(RP('pe'))sx*=.82;if(K==='pen')sx*=.8;if(it.chip)sx*=.8;return{sx,sh:sx*.55}}
  function shoot(g,by){by=by||me;const it=shotIntent(g);const e=errOf(it);let tx=it.tx+gauss()*e.sx,th=Math.max(.08,it.th+gauss()*e.sh);
   const from={x:ball.x,d:ball.d,h:Math.max(ball.h,g.header?1.75:0)};let s;
   if(it.chip){const t=clamp(.75+ball.d*.035,1,1.45);s=solveLob(from,tx,-.4,clamp(.8+(1-it.p)*1.2,.9,2.2),t);ball.spin=0}
   else s=solveShot(from,tx,th,it.v,it.spin);
   ball.h=from.h;ball.vx=s.vx;ball.vd=s.vd;ball.vh=s.vh;ball.spin=it.chip?0:it.spin;G.owner=null;G.dead=false;G.carry=null;by.kAt=G.t;
   // avaliação: qualidade da mira = distância do alvo pretendido ao goleiro, dentro do gol
   const inG=Math.abs(it.tx)<GW-.2&&it.th<GH-.15;const fromGk=gk?Math.abs(it.tx-gk.x):3;
   const bo=bestOption();G.act={kind:'shot',aimQ:inG?clamp(fromGk/3.4,0,1)*(it.th>1.2&&it.th<GH-.3?1.1:1):.1,dist:Math.hypot(ball.x,ball.d),angle:Math.abs(Math.atan2(ball.x,ball.d))/1.2,press:G.press,decQ:bo.k==='shot'?1:clamp(shotValue(ball.x,ball.d)/(bo.v||1),0,1)};
   G.flight={type:g.header?'header':'shot',by,t0:G.t,tried:new Set(),label:it.label};setState('FLIGHT');keeperReact();
   P.forEach(q=>{if(q.wall)q.jump=.5});
   tapFx(g.header?'header':'kick');flash(it.label,true);if(it.p>.75)shake(2+it.p*3,.14)}
  function pass(m,g){const from={x:ball.x,d:ball.d};let t0=dist(m,ball)/16;let lp=lead(m,t0);for(let i=0;i<3;i++){t0=Math.hypot(lp.x-from.x,lp.d-from.d)/16;lp=lead(m,t0)}
   const L=Math.hypot(lp.x-from.x,lp.d-from.d);const lane=laneBlock(from.x,from.d,lp.x,lp.d);
   const lofted=K==='long'||K==='cross'||L>25||(g&&g.power>.8&&lane>.3);
   const pr=G.press||0;let ang=(g?(.015+.07*(1-PAS)):(.008+.04*(1-PAS)))*(1+pr)*gauss();
   // assistência: puxa a direção do gesto em direção ao companheiro, sem ser infalível
   let ux=(lp.x-from.x)/L,ud=(lp.d-from.d)/L;
   if(RP('visao'))ang*=.75;
   if(g){const a=.5+.35*PAS+(RP('visao')?.12:0);let gx=g.dir.x*(1-a)+ux*a,gd=g.dir.d*(1-a)+ud*a;const gl=Math.hypot(gx,gd)||1;ux=gx/gl;ud=gd/gl}
   const c=Math.cos(ang),s=Math.sin(ang);[ux,ud]=[ux*c-ud*s,ux*s+ud*c];
   if(lofted){let t=.55+L/24;let lp2=lp;for(let i=0;i<3;i++){lp2=lead(m,t);t=.55+Math.hypot(lp2.x-from.x,lp2.d-from.d)/24}const L2=Math.hypot(lp2.x-from.x,lp2.d-from.d);ux=(lp2.x-from.x)/L2*(g?1:1);ud=(lp2.d-from.d)/L2;if(g){const a=.5+.35*PAS;let gx=g.dir.x*(1-a)+ux*a,gd=g.dir.d*(1-a)+ud*a;const gl=Math.hypot(gx,gd)||1;ux=gx/gl;ud=gd/gl}m.run={x:lp2.x,d:lp2.d};lp=lp2;const ex=(g?(.3+1.6*(1-PAS))*(1+pr):(.2+.9*(1-PAS)))*gauss();const LL=Math.hypot(lp.x-from.x,lp.d-from.d);const tx=from.x+ux*LL+ex*.6,td=from.d+ud*LL+ex*.4;
    const r=solveLob({x:from.x,d:from.d,h:0},tx,td,K==='cross'?1.7:1.1,t);ball.vx=r.vx;ball.vd=r.vd;ball.vh=r.vh}
   else{const need=groundSpeedFor(L,6.5);let mul=1;if(g){const want=.7+g.power*.6;mul=1+(want-1)*(1-.5*PAS)}const v=need*mul;ball.vx=ux*v;ball.vd=ud*v;ball.vh=0}
   ball.spin=0;G.owner=null;G.carry=null;me.kAt=G.t;m.recv=true;if(!lofted)m.run={x:lp.x,d:lp.d};m.sp=Math.max(m.sp,7);
   const bo=bestOption();G.act={kind:'pass',free:isFree(m),dist:L,press:G.press,decQ:bo.k==='pass'?(bo.m===m?1:.7):clamp(.5+lane*0-.1,0,1)};
   G.flight={type:K==='cross'&&lofted?'cross':'pass',by:me,to:m,t0:G.t,lofted,tried:new Set()};setState('FLIGHT');
   // tabela: quem passa sai pro espaço
   if(!SETP&&K!=='cross'){me.run={x:clamp(me.x*.8,-20,20),d:Math.max(9,me.d-7)}}
   tapFx('kick');flash(lofted?(K==='cross'?'CRUZAMENTO':'LANÇAMENTO'):'PASSE',true)}
  function carry(tx,td,burst){G.carry={x:clamp(tx,-30,30),d:clamp(td,3,70)};if(burst){G.burst=.45}}
  // drible: arrancada pro lado perto do marcador; sucesso depende de DRI, ângulo e pressão
  function dribbleMove(dir){const q=P.filter(z=>z.team==='opp'&&!z.wall&&z.fall<=0).sort((a,b)=>dist(a,me)-dist(b,me))[0];
   carry(me.x+dir.x*5,me.d+dir.d*5,true);if(!q||dist(q,me)>3.2)return;
   const toQ={x:(q.x-me.x),d:(q.d-me.d)};const L=Math.hypot(toQ.x,toQ.d)||1;const cosA=(toQ.x*dir.x+toQ.d*dir.d)/L;const ang=Math.acos(clamp(cosA,-1,1));
   const p=clamp(.32+.5*DRI+(ang>.8?.12:-.1)-(G.press||0)*.1+(RP('drible')?.12:0),.15,.94);
   if(ch(p)){q.fall=.9;q.fallDir=Math.sign(dir.x||1);flash('DRIBLOU!',true);SFX.tone({f:660,dur:.1,gain:.08});G.grace=.8}
   else{tackle(q)}}
  function tackle(q){G.tk++;if(ch(.5)){const a=R(-1.4,1.4);G.owner=null;ball.vx=Math.sin(a)*R(4,7);ball.vd=Math.cos(a)*R(3,6);ball.vh=R(0,1.4);me.fall=.35;contest('tackle','DIVIDIDA!')}
   else{NM.intc=q;q.hl=1;G.owner=q;finish(false,'Desarmado!','DESARMOU!')}}

  // ---------- disputa (rebote, desvio, dividida): só o mais próximo de cada time vai na bola ----------
  function contest(src,txt){if(ended)return;if(NM.rebs>=(K==='pen'?0:2)){return false}NM.rebs++;G.flight=null;G.owner=null;G.dead=false;G.carry=null;setState('CONTEST');G.ct={t0:G.t,src};
   flash(txt,false);const q=proj(ball.x,ball.d,ball.h+.2);if(q)burst(q.x,q.y,10,['#ffffff','#ffe23c'],110,220,3);shake(3,.15);
   try{SFX.tone({f:src==='post'?1320:240,f2:src==='post'?900:160,dur:src==='post'?.25:.09,gain:.12,type:src==='post'?'square':'triangle'})}catch(e){}tmax=Math.max(tmax,G.t+6);return true}
  function takeBall(p){G.owner=p;ball.vx=ball.vd=ball.vh=0;ball.h=0;ball.spin=0;G.flight=null;G.grace=.9;SFX.touch()}
  function switchTo(m){const old=me;old.team='mate';old.recv=false;old.run={x:clamp(old.x*.75,-20,20),d:Math.max(8,old.d-5)};m.team='me';m.recv=false;m.run=null;m.num=m.num||10;
   P.forEach(q=>{if(q.team==='opp'&&q.mark===m)q.mark=old});me=m;takeBall(me);setState('POSSESSION');flash('SUA VEZ!',true);tmax=Math.max(tmax,G.t+6);SFX.tone({f:660,dur:.1,gain:.08})}

  // ---------- recepção (primeiro toque com volume de contato generoso) ----------
  function receive(m){const air=ball.h>1.1;
   if(K==='pass'&&!o.assist||K==='long'){takeBall(m);return finish(true,o.okTxt||'Na medida!','NA MEDIDA!',isFree(m))}
   if(K==='cross'){ // finalização automática do companheiro (cabeça ou pé): o cruzamento já foi bom
    G.crossOk=true;G.crossFree=isFree(m);const tx=(gk&&gk.x>0?-1:1)*R(1.6,GW-.5);const from={x:ball.x,d:ball.d,h:air?1.8:.1};
    const e=(air?.9:.6)*(G.crossFree?1:1.6);const s=solveShot(from,tx+gauss()*e,air?R(.4,1.8):R(.2,1.2),air?R(13,17):R(20,25),0);
    ball.h=from.h;ball.vx=s.vx;ball.vd=s.vd;ball.vh=s.vh;ball.spin=0;m.kAt=G.t;if(air)m.jump=.4;G.flight={type:'shot',by:m,t0:G.t,tried:new Set(),mate:true};setState('FLIGHT');keeperReact();SFX.kick(.7);return}
   if(K==='combo'&&!G.combo&&m!==me){G.combo=1;// devolve de primeira na corrida
    const tg={x:clamp(me.x+(me.x>m.x?.5:-.5),-18,18),d:Math.max(11,Math.min(me.d,m.d)-R(4,6))};me.run={x:tg.x,d:tg.d};me.sp=mySp;
    const L=Math.hypot(tg.x-ball.x,tg.d-ball.d);const v=groundSpeedFor(L,5);ball.vx=(tg.x-ball.x)/L*v;ball.vd=(tg.d-ball.d)/L*v;ball.vh=0;m.kAt=G.t;
    G.flight={type:'pass',by:m,to:me,t0:G.t,lofted:false,tried:new Set()};flash('TABELA!',true);SFX.kick(.5);return}
   if(m===me){takeBall(me);setState('POSSESSION');flash('DOMINOU',true);return}
   if(o.assist&&K==='pass')G.assisted=true;
   switchTo(m)}

  // ---------- goleiro: posicionamento, reação, mergulho, defesa/espalmada ----------
  function keeperReact(){if(!gk||GK)return;const r=sim({...ball},3,true);gk.plan=null;if(!r.cross&&!r.pts.length)return;
   // ponto em que a bola cruza o plano do goleiro
   let cx=null;for(const q of r.pts){if(q.d<=gk.d){cx=q;break}}if(!cx)return;
   const screened=P.some(q=>(q.team==='opp'||q.team==='mate')&&!q.wall&&Math.abs(q.d-(ball.d+gk.d)/2)<ball.d/2&&laneBlock(ball.x,ball.d,cx.x,cx.d)>.5&&dist(q,gk)>2);
   gk.plan={x:cx.x+gauss()*.55*(1-kq),h:cx.h,t:cx.t,react:(K==='pen'?0:.2+.2*(1-kq))+(screened?.12:0),t0:G.t};
   if(K==='pen'){const guess=ch(.18)?0:(ch(.5+.22*Math.sign(cx.x||1)*(kq-.5))?1:-1);gk.plan.x=guess===0?0:guess*R(1.8,3.3);gk.plan.react=.02}
   if(gk.rush)gk.rush=false}
  function keeperStep(dt){
   if(gk.down>0){gk.down-=dt;gk.x+=(gk.dvx||0)*dt;gk.dvx=(gk.dvx||0)*Math.pow(.03,dt);if(gk.down<=0){gk.dive=0;gk.down=0}return}
   const move=(tx,td,vmax,acc)=>{const dx=tx-gk.x,dd=td-gk.d;const L=Math.hypot(dx,dd);const v=Math.min(vmax,L*5);const wx=L>.01?dx/L*v:0,wd=L>.01?dd/L*v:0;const k=Math.min(1,dt*acc);gk.vx+=(wx-gk.vx)*k;gk.vd+=(wd-gk.vd)*k;gk.x+=gk.vx*dt;gk.d+=gk.vd*dt};
   if(G.st==='FLIGHT'&&G.flight&&(G.flight.type==='shot'||G.flight.type==='header')&&gk.plan){const pn=gk.plan;const el=G.t-pn.t0;
    if(el<pn.react){gk.vx*=Math.pow(.05,dt);gk.vd*=Math.pow(.05,dt);return}
    const dx=pn.x-gk.x,tl=Math.max(.08,pn.t-el);
    if(!gk.dive&&(Math.abs(dx)>.65||pn.h>1.95)&&tl<.45){gk.dive=Math.sign(dx)||1;gk.diveV=Math.min(Math.abs(dx)/tl,3+1.4*kq)}
    if(gk.dive){gk.x+=gk.dive*gk.diveV*dt;gk.lift=Math.min(pn.h,(gk.lift||0)+dt*5)}else move(pn.x,gk.d,1+1.4*kq,9);return}
   if(G.st==='FLIGHT'&&G.flight&&G.flight.lofted&&!G.flight.land){const r=sim({...ball},3,false);let l=null,ph=-1;for(const z of r.pts){if(z.h<ph&&z.h<2.4){l=z;break}ph=z.h}G.flight.land=l||{d:99}}
   if(G.st==='FLIGHT'&&G.flight&&G.flight.lofted&&G.flight.land&&G.flight.land.d<4.6&&Math.abs(G.flight.land.x)<6.5){move(G.flight.land.x,Math.max(.5,G.flight.land.d),4.4+kq,6);if(dist(gk,ball)<1.15&&ball.h<2.75){G.owner=gk;ball.vx=ball.vd=ball.vh=0;return finish(false,'O goleiro saiu e pegou.','GOLEIRO!')}return}
   if(gk.rush&&G.owner===me){move(me.x,Math.max(1,me.d-2.3),4.2,5);if(dist(gk,me)<1.3){NM.intc=gk;return finish(false,'O goleiro chegou antes na bola.','GOLEIRO!')}return}
   // bola solta na área: ele sai nela
   if(G.st==='CONTEST'&&ball.d<6.5&&Math.abs(ball.x)<9){move(ball.x,Math.max(.3,ball.d),4.6,7);return}
   // entre a bola e o centro do gol, saindo da linha conforme a bola se aproxima
   const bd=Math.max(.5,ball.d);const ang=Math.atan2(ball.x,bd);const out=bd<24?clamp(.6+(24-bd)*.085,.6,2.2):.6;
   move(clamp(Math.sin(ang)*out*1.15,-GW+.5,GW-.5),clamp(Math.cos(ang)*out,.5,2.4),3.8,6)}
  // a bola passou pelo plano do goleiro: defesa?
  function keeperCheck(pd){if(!gk||GK||gk.down>0&&!gk.dive)return false;if(!(pd>gk.d&&ball.d<=gk.d&&ball.vd<0))return false;if(G.st!=='FLIGHT'&&G.st!=='CONTEST')return false;
   const off=Math.abs(ball.x-gk.x);const R0=(gk.dive?.95+.3*kq:.75+.2*kq)*(pl?.93:1);const top=gk.dive?2.3:2.45;
   if(!(off<R0&&ball.h<top))return false;
   const edge=off/R0,bs=spd();gk.down=gk.dive?.9:0;gk.dvx=gk.dive*1.5;if(!gk.dive&&edge>.4)gk.dive=Math.sign(ball.x-gk.x)||1,gk.down=.8;
   if(edge<.55&&bs<22&&ball.h<1.9){ball.vx=ball.vd=ball.vh=0;ball.x=gk.x;ball.d=gk.d;ball.h=Math.min(ball.h,1.1);G.owner=gk;if(gk.dive)gk.down=9;finish(false,'O goleiro segurou.','DEFENDEU!');return true}
   if(edge>.78&&ch(.45)){ball.vd=-ball.vd*.3;ball.vx=Math.sign(ball.x-gk.x||1)*R(4,7);ball.vh=R(2,4);finish(false,'Espalmou pra escanteio!','ESCANTEIO!');return true}
   ball.d=gk.d+.15;ball.vd=R(5,9);ball.vx=Math.sign(ball.x-gk.x||(ch(.5)?1:-1))*R(1.5,6);ball.vh=R(1.5,3.6);ball.spin=0;gk.down=Math.max(gk.down,.85);
   if(!contest('gk','REBOTE!'))finish(false,'Espalmou!','DEFENDEU!');return true}

  // ---------- IA por regras ----------
  function steer(p,tx,td,vmax,dt,acc=6){const dx=tx-p.x,dd=td-p.d,L=Math.hypot(dx,dd);const v=Math.min(vmax,L*3.2);const wx=L>.05?dx/L*v:0,wd=L>.05?dd/L*v:0;const k=Math.min(1,dt*acc);p.vx+=(wx-p.vx)*k;p.vd+=(wd-p.vd)*k}
  function separate(dt){for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const a=P[i],b=P[j];if(a===gk||b===gk||a.wall||b.wall)continue;const dx=b.x-a.x,dd=b.d-a.d,L=Math.hypot(dx,dd);if(L>0&&L<1.05){const f=(1.05-L)*2.5*dt;a.x-=dx/L*f;a.d-=dd/L*f;b.x+=dx/L*f;b.d+=dd/L*f}}}
  function nearestOf(team,pt){let b=null,bd=1e9;for(const p of P){if(p.team!==team||p.wall||p.fall>0)continue;const d0=dist(p,pt);if(d0<bd){bd=d0;b=p}}return b}
  function interceptPoint(q){// primeiro ponto do caminho da bola que ele alcança antes dela
   const r=sim({...ball},2.2,false);for(const z of r.pts){if(z.h>(G.flight&&G.flight.lofted?2.3:1.3))continue;if(dist(q,z)/(q.sp||5)<=z.t+.08)return z}return null}
  function aiStep(dt){
   const carrier=G.owner&&G.owner!==gk?G.owner:null;
   const presser=carrier&&carrier.team==='me'?nearestOf('opp',carrier):null;
   const ctOpp=G.st==='CONTEST'&&G.t-G.ct.t0>.25?nearestOf('opp',ball):null,ctMate=G.st==='CONTEST'?nearestOf('mate',ball):null;
   const ctMe=G.st==='CONTEST'&&me&&(!ctMate||dist(me,ball)<=dist(ctMate,ball)+1.5);
   for(const p of P){if(p===gk||p.wall)continue;if(p.fall>0){p.fall-=dt;p.vx*=Math.pow(.02,dt);p.vd*=Math.pow(.02,dt);p.x+=p.vx*dt;p.d+=p.vd*dt;continue}
    if(p.jump>0)p.jump=Math.max(0,p.jump-dt*.9);
    let tx=p.x,td=p.d,vm=(p.sp||6)*.8;
    if(p===me){
     if(G.st==='POSSESSION'&&G.owner===me){if(G.carry){tx=G.carry.x;td=G.carry.d;vm=mySp*(G.burst>0?1.15:.86);if(dist(me,G.carry)<.4)G.carry=null}else{vm=0}}
     else if(G.st==='CONTEST'&&ctMe){tx=ball.x+ball.vx*.25;td=ball.d+ball.vd*.25+.3;vm=mySp*1.05}
     else if(K==='header'&&G.hdMP&&!G.hd?.done){tx=G.hdMP.x;td=G.hdMP.d;vm=mySp}
     else if(G.flight&&G.flight.to===me){const z=interceptPoint(me)||G.flight.to.run||me;tx=z.x;td=z.d;vm=mySp}
     else if(me.run){tx=me.run.x;td=me.run.d;vm=mySp*.85}
     else vm=0;
    }else if(p.team==='mate'){
     if(G.flight&&G.flight.to===p){const z=interceptPoint(p);if(z){tx=z.x;td=z.d}else if(p.run){tx=p.run.x;td=p.run.d}vm=p.sp*1.05}
     else if(G.st==='CONTEST'&&p===ctMate&&!ctMe){tx=ball.x+ball.vx*.25;td=ball.d+ball.vd*.25+.3;vm=p.sp}
     else if(K==='cross'&&p.spot&&G.st!=='OUTCOME'){const go=G.st==='FLIGHT'||G.t>1.4;tx=go?p.spot.x:p.x;td=go?p.spot.d:p.d;vm=p.sp*(go?1:.3)}
     else{if(!p.sup||G.t>p.supT){p.supT=G.t+.9;p.sup=supportSpot(p)}tx=p.sup.x;td=p.sup.d;vm=p.sp*.7}
    }else if(p.team==='opp'){
     const role=q=>{if(q.mark){const m=q.mark;const gx=-m.x,gd=-m.d,gl=Math.hypot(gx,gd)||1;tx=m.x+gx/gl*(q.loose?1.6:1)+(ball.x-m.x)*.1;td=m.d+gd/gl*(q.loose?1.6:1);vm=q.sp*.95}
      else{const gx=-ball.x,gd=-ball.d,gl=Math.hypot(gx,gd)||1;const k=Math.min(6,gl*.45);tx=ball.x+gx/gl*k;td=ball.d+gd/gl*k;vm=q.sp*.8}};
     if(G.st==='FLIGHT'&&G.flight&&G.flight.type!=='shot'&&G.flight.type!=='header'&&!G.flight.tried.has(p)){const z=G.t-G.flight.t0>.2?interceptPoint(p):null;if(z&&dist(p,z)<3.2){tx=z.x;td=z.d;vm=p.sp*.9}else role(p)}
     else if(G.st==='CONTEST'&&p===ctOpp){tx=ball.x+ball.vx*.3;td=ball.d+ball.vd*.3;vm=p.sp}
     else if(p===presser){const gx=-carrier.x,gd=-carrier.d,gl=Math.hypot(gx,gd)||1;const close=dist(p,carrier);
      tx=carrier.x+gx/gl*(close<2?.9:1.1);td=carrier.d+gd/gl*(close<2?.9:1.1);vm=p.sp*(close<3?.7:.95);
      if(close<1.15&&G.grace<=0&&G.t>=G.nextTk&&G.st==='POSSESSION'){G.nextTk=G.t+.75;const pk=(.3+.32*(1-DRI))*(G.carry?.8:1)*(RP('drible')?.82:1);if(ch(pk))tackle(p);else{p.fall=.6;p.fallDir=Math.sign(p.x-me.x||1)}}}
     else role(p);
    }
    if(p.shooter)continue;
    steer(p,tx,td,vm,dt,p===me?8:6);p.x+=p.vx*dt;p.d+=p.vd*dt;p.x=clamp(p.x,-33,33);p.d=clamp(p.d,.3,75)}
   separate(dt)}
  function supportSpot(m){// espaço livre à frente da bola, sem marcação, longe dos outros
   let best={x:m.x,d:m.d},bv=-1e9;for(let i=0;i<14;i++){const x=clamp(m.x+R(-8,8),-26,26),d=clamp(Math.min(m.d,ball.d)-R(-2,8),7,70);let v=0;
    for(const q of P){if(q===m)continue;const d0=Math.hypot(q.x-x,q.d-d);if(q.team==='opp')v+=clamp(d0,0,6)*1.2;else if(q.team!=='gk')v-=d0<5?(5-d0)*1.5:0}
    v-=Math.hypot(x-m.x,d-m.d)*.35;v-=Math.abs(d-(ball.d-8))*.25;v-=laneBlock(ball.x,ball.d,x,d)*6;if(v>bv){bv=v;best={x,d}}}return best}

  // =====================================================================
  // PASSO
  // =====================================================================
  function step(dt){G.t+=dt;if(G.grace>0)G.grace-=dt;if(G.burst>0)G.burst-=dt;
   if(GK)return stepGK(dt);
   if(ended){integrate(ball,dt);if(NM.netHit&&ball.d<.2){ball.vx*=Math.pow(.03,dt);ball.vd*=Math.pow(.003,dt);ball.spin=0;if(ball.d<-1.95)ball.d=-1.95}aiStep(dt*.6);return}
   // posse: bola colada no pé
   if(G.owner&&G.owner!==gk){const p=G.owner;const s=Math.hypot(p.vx,p.vd);const fx=s>.3?p.vx/s:0,fd=s>.3?p.vd/s:-1;const tx=p.x+fx*.55,td=p.d+fd*.55;ball.x+=(tx-ball.x)*Math.min(1,dt*14);ball.d+=(td-ball.d)*Math.min(1,dt*14);ball.h=0;ball.vx=p.vx;ball.vd=p.vd;ball.vh=0;ball.rot+=s*dt*2;G.press=pressOn(p)}
   else if(!G.dead){const pd=ball.d;integrate(ball,dt);ball.rot+=spd()*dt*2;
    if(keeperCheck(pd))return;
    // linha do gol
    if(pd>0&&ball.d<=0){const x=ball.x,h=ball.h;const post=Math.abs(Math.abs(x)-GW)<.16&&h<GH+.05,bar=Math.abs(h-GH)<.16&&Math.abs(x)<GW+.05;
     if(post||bar){SFX.post();if(post&&Math.abs(x)<GW&&ch(.3)){ball.vx=-Math.sign(x)*(Math.abs(ball.vx)*.5+2);ball.d=-.1}
      else if(bar&&h<GH&&ch(.3)){ball.vh=-Math.abs(ball.vh)*.6-2;ball.d=-.1}
      else{ball.d=.08;ball.vd=Math.abs(ball.vd)*R(.35,.55);if(post)ball.vx=-Math.sign(x)*R(1,4.5)+ball.vx*.25;else{ball.vx*=.5;ball.vh=-Math.abs(ball.vh)*.4-1}ball.spin=0;
       if(bar&&h>=GH&&ch(.5))return finish(false,'No travessão!','NA TRAVE!');if(!contest('post',bar?'TRAVESSÃO!':'NA TRAVE!'))return finish(false,bar?'No travessão!':'Na trave!','NA TRAVE!');return}}
     if(ball.d<=0&&Math.abs(ball.x)<GW&&ball.h<GH){NM.goalX=ball.x;NM.goalH=ball.h;NM.netHit={x:ball.x,h:clamp(ball.h,.2,2.3),t:0};
      if(G.flight&&G.flight.mate){return finish(true,o.okTxt||'Assistência!','ASSISTÊNCIA!',true)}
      if(G.assisted)return finish(true,o.okTxt||'Assistência!','ASSISTÊNCIA!',true);
      const corner=Math.abs(ball.x)>GW-1.4||ball.h>1.8;return finish(true,o.okTxt||'GOL!','GOOOL!',corner)}
     if(G.flight&&G.flight.mate&&G.crossOk)return finish(true,'Cruzamento na medida! O companheiro mandou pra fora.','NA MEDIDA!');
     return finish(false,ball.h>GH?'Por cima do gol!':'Pra fora!','PRA FORA!')}
    if(Math.abs(ball.x)>34||ball.d>72)return finish(false,G.flight&&G.flight.type==='pass'?'O passe saiu.':'Saiu pela lateral.','PRA FORA!');
   }
   if(gk&&!ended)keeperStep(dt);
   if(ended)return;
   aiStep(dt);
   if(ended)return;
   // contatos: interceptação, bloqueio, barreira, recepção, sobra
   if(!G.owner&&!G.dead){
    for(const q of P){if(q.team!=='opp'||q.fall>0)continue;if(K==='header'&&!(G.hd&&G.hd.done))continue;const db=Math.hypot(q.x-ball.x,q.d-ball.d);
     const reachH=q.wall?1.85+q.jump*.55:(G.flight&&G.flight.lofted?2.3:1.35);
     if(db<(q.wall?.48:.7)&&ball.h<reachH&&G.t-(G.flight?G.flight.t0:G.t-1)>.1){
      if(G.st==='CONTEST'){if(G.t-G.ct.t0<.22)continue;NM.intc=q;q.hl=1;return finish(false,'O zagueiro chegou antes na sobra.','AFASTOU!')}
      if(!G.flight||G.flight.tried.has(q))continue;G.flight.tried.add(q);
      const shotF=G.flight.type==='shot'||G.flight.type==='header';const s=spd();
      if(q.wall||shotF){if(q.wall||ch(.8)){const a=R(-1.3,1.3);ball.vx=Math.sin(a)*s*R(.2,.4)+ball.vx*.1;ball.vd=Math.cos(a)*s*R(.2,.38);ball.vh=R(.3,3);ball.spin=0;ball.d=q.d+(q.wall?.6:.3);q.vx*=-.3;
        if(!contest('block',q.wall?'BARREIRA!':'BLOQUEADO!'))return finish(false,q.wall?'Bateu na barreira.':'Bloqueado!',q.wall?'BARREIRA!':'BLOQUEOU!');break}continue}
      const pc=clamp(.78-(s-8)*.04,.3,.8);
      if(ch(pc)){NM.intc=q;q.hl=1;G.owner=q;ball.vx=ball.vd=ball.vh=0;return finish(false,'Interceptado: a linha de passe estava fechada.','CORTOU!')}
      // desvio de leve
      const a=R(-.5,.5);const c=Math.cos(a),sn=Math.sin(a);[ball.vx,ball.vd]=[(ball.vx*c-ball.vd*sn)*.6,(ball.vx*sn+ball.vd*c)*.6];ball.vh=Math.max(ball.vh,R(0,1.5));
      if(spd()<6&&!contest('block','DESVIOU!'))return finish(false,'Desviou no zagueiro.','CORTOU!')}}
    if(ended)return;
    // recepção / sobra
    for(const p of P){if((p.team!=='mate'&&p.team!=='me')||p.fall>0)continue;const db=Math.hypot(p.x-ball.x,p.d-.35-ball.d);
     if(G.st==='FLIGHT'&&G.flight&&G.flight.to===p&&G.t-G.flight.t0>.15&&db<1.35&&ball.h<(G.flight.lofted?2.7:1.3))return receive(p);
     if(G.st==='CONTEST'&&G.t-G.ct.t0>.22&&db<.9&&ball.h<1.3){if(p===me){takeBall(me);setState('POSSESSION');flash('SOBRA!',true);tmax=Math.max(tmax,G.t+6);return}return switchTo(p)}}
    if(G.st==='CONTEST'&&gk&&!(gk.down>0)&&ball.h<2.3&&dist(gk,ball)<1.05){G.owner=gk;return finish(false,'O goleiro ficou com a sobra.','DEFENDEU!')}
    if(G.st==='CONTEST'&&G.t-G.ct.t0>6)return finish(false,'Ninguém dominou a sobra.','PERDEU!');
    // bola morreu
    if(G.st==='FLIGHT'&&ball.h===0&&spd()<.6){if(G.flight&&G.flight.to)return finish(false,'Passe fraco: ninguém chegou na bola.','ERROU!');return finish(false,'Fraquinho demais.','ERROU!')}
    // cabeçada
    if(K==='header')headerStep();
   }
   // drible: chegou na área com a bola
   if(K==='dribble'&&G.owner===me&&me.d<16.5&&Math.abs(me.x)<20)return finish(true,o.okTxt||'Passou por todos!','PASSOU!',G.tk===0&&G.t<9);
   if((G.st==='POSSESSION'||G.st==='SETUP')&&G.t>tmax&&!SETP)return finish(false,'Demorou demais!','PERDEU!')}
  // cabeçada: janela de contato quando a bola chega
  function headerStep(){if(G.hd&&G.hd.done)return;const dh=Math.hypot(me.x-ball.x,me.d-ball.d);
   const inW=ball.h>1.0&&ball.h<2.9&&dh<1.6;G.hdWin=inW;
   const mk2=P.find(q=>q.mark===me);
   if(inW&&(G.hd||G.hdTap)){const g=G.hd||{dir:{x:-me.x*.15,d:-1},power:.6,dy:.3,bulge:0};const early=G.hd?clamp((G.t-G.hd.t)-0,0,3):0;const q=early<.7?1:early<1.3?.78:.58;
    if(mk2&&dist(mk2,me)<1.3&&ch(.32*(1-skill*.4))){NM.intc=mk2;mk2.jump=.45;return finish(false,'O zagueiro subiu mais.','CORTOU!')}
    me.jump=.45;G.hd={...g,done:true};const g2={...g,header:true,power:clamp(g.power*q,.2,1)};ball.x=me.x;ball.d=me.d-.2;ball.h=Math.max(ball.h,1.7);
    G.press=clamp(.5-q*.4,0,1);shoot(g2,me);return}
   if(ball.d<me.d-2.6||(ball.h<.4&&G.t>G.hdArr+.2))return finish(false,G.hd?'Cabeceou fora do tempo: a bola passou.':'A bola passou por você.','PASSOU!')}

  // ---------- modo goleiro ----------
  function stepGK(dt){const sh=P.find(p=>p.shooter);const s=G.gkShot;
   if(!s.fired){const k=clamp(G.t/s.runT,0,1);sh.d=ball.d+2.2-2*k;sh.x=ball.x+(-s.cue*.6)*(1-k);sh.vd=-2;
    G.cue=G.t>s.runT-.38?s.cue:null;
    // pulou cedo demais: o batedor lê e troca de lado
    if(G.gkIn&&!G.gkIn.after&&!s.read){s.read=true;gkInfo.early=G.t<s.runT-.38;if(ch(gkInfo.early?.6:.25)){s.side=-Math.sign(G.gkIn.x||1);s.tx=s.side*R(1.4,GW-.5)}}
    if(k>=1){s.fired=true;G.shotT=G.t;if(G.gkIn&&!gkInfo.early&&gkInfo.react==null)gkInfo.react=.2;const v=(o.pen?R(21,26):R(20,27))*(pl?.95:1);const from={x:ball.x,d:ball.d,h:0};const r=solveShot(from,s.tx,s.th,v,0);ball.vx=r.vx;ball.vd=r.vd;ball.vh=r.vh;G.dead=false;sh.kAt=G.t;SFX.kick(.9)}
    return}
   const pd=ball.d;integrate(ball,dt);ball.rot+=dt*20;
   if(G.gkIn){const tg=G.gkIn;const v=5.8+3*REF;const dx=tg.x-gk.x;gk.x+=clamp(dx,-v*dt,v*dt);gk.dive=Math.abs(dx)>.5?Math.sign(dx):0;gk.lift=Math.min(tg.h,(gk.lift||0)+dt*6)}
   if(pd>gk.d&&ball.d<=gk.d){const hx=gk.x,hh=Math.max(1,(gk.lift||0));const reach=(G.gkIn?.9+REF*.45:.5);const dx=Math.abs(ball.x-hx),dh=Math.abs(ball.h-hh);
    if(dx<reach&&(dh<1.15||ball.h<1.3&&(gk.lift||0)<1.2)){ball.vd=-ball.vd*.3;ball.vx=Math.sign(ball.x-hx||1)*5;ball.vh=3;gk.down=9;return finish(true,o.okTxt||'DEFENDEU!','DEFENDEU!',dx<reach*.5)}}
   if(pd>0&&ball.d<=0){if(Math.abs(ball.x)<GW&&ball.h<GH)return finish(false,gkInfo.early?'Pulou antes da hora!':'Foi no canto.','GOL DELES');return finish(false,'Ufa… pra fora','PRA FORA')}
   if(G.t>tmax+3)finish(false,'Ele chutou e você nem viu','GOL DELES')}

  // =====================================================================
  // CÂMERA
  // =====================================================================
  function camUpdate(dt){
   if(GK){const tz=G.gkShot.fired&&!ended?1.08:(ended&&ended.ok?1.05:1);cam.z+=(tz-cam.z)*Math.min(1,dt*3);return}
   if(phase==='intro'){const k=Math.min(1,dt*2.6);cam.x+=(camEnd.x-cam.x)*k;cam.d+=(camEnd.d-cam.d)*k;cam.h+=(camEnd.h-cam.h)*k;return}
   let b,fh=CHh,fz=1,ft=CTl;const fl=G.st==='FLIGHT';
   if(SETP&&G.dead){b=behind(ball.x,ball.d,K==='pen'?8:9,0);fh=K==='pen'?4.2:5;ft=.28}
   else if(XF&&G.owner!==me){b=fl||G.st!=='POSSESSION'?behind(ball.x*.5,Math.max(4,ball.d*.5+3.5),11):behind(me.x/2,(me.d+7)/2,13);fh=fl?6:7;ft=fl?.34:.4}
   else if(K==='header'&&!(G.hd&&G.hd.done)){b=behind(me.x*.8+ball.x*.2,me.d,CB)}
   else if(G.owner===me){b=behind(me.x,me.d,CB)}
   else if(G.st==='CONTEST'){b=behind(ball.x*.65+me.x*.35,Math.max(3,ball.d*.65+me.d*.35),10.5)}
   else{b=behind(ball.x,Math.max(ball.d,3),CB);if(fl&&ball.d<20&&!ended)fz=1.06}
   if(ended){if(NM.netHit){b=behind(ball.x*.8,Math.max(2,ball.d+1),8,0);fh=4.4;fz=1.08}else if(ended.ok){fz=1.05}else{fz=.97}}
   const k=Math.min(1,dt*(G.st==='CONTEST'?4:fl?2.4:3.4));cam.x+=(b.x-cam.x)*k;cam.d+=(b.d-cam.d)*k;let dy=b.y-(cam.yaw||0);while(dy>Math.PI)dy-=2*Math.PI;while(dy<-Math.PI)dy+=2*Math.PI;cam.yaw=(cam.yaw||0)+dy*Math.min(1,dt*2.6);
   cam.h+=(fh-cam.h)*Math.min(1,dt*2.2);cam.z+=(fz-cam.z)*Math.min(1,dt*2.6);cam.tilt+=(ft-cam.tilt)*Math.min(1,dt*3)}

  // =====================================================================
  // GESTOS: toque confirma/seleciona; arrasto a partir da bola age. Zona morta contra toque acidental.
  // =====================================================================
  const pt=e=>{const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)*(W/r.width),y:(e.clientY-r.top)*(H/r.height)}};
  const canAct=()=>phase==='play'&&!ended&&((G.st==='POSSESSION'&&G.owner===me)||(SETP&&G.dead));
  function mateAt(sx,sy){let best=null,bd=46;for(const m of P){if(m.team!=='mate')continue;const q=proj(m.x,m.d,.9);if(!q)continue;const d0=Math.hypot(q.x-sx,q.y-sy);if(d0<bd){bd=d0;best=m}}return best}
  function readGesture(a){const dx=a.ex-a.sx,dy=a.ey-a.sy,len=Math.hypot(dx,dy);const from=K==='header'?me:ball;const B=proj(from.x,from.d,0);let dir={x:0,d:-1};
   if(B){for(const k of[90,50,25]){const w=unproj(B.x+dx/len*k,B.y+dy/len*k);if(w){const L=Math.hypot(w.x-from.x,w.d-from.d);if(L>.05){dir={x:(w.x-from.x)/L,d:(w.d-from.d)/L};break}}}}
   // curva: quanto o caminho do dedo "barriga" pro lado da linha reta
   let bulge=0;if(a.path.length>3&&len>30){const nx=-dy/len,ny=dx/len;let mx=0;for(const q of a.path){const v=(q.x-a.sx)*nx+(q.y-a.sy)*ny;if(Math.abs(v)>Math.abs(mx))mx=v}bulge=clamp(mx/len,-.5,.5)}
   const power=clamp((len-14)/(H*.52),.05,1);
   return{dir,power,len,bulge,dy:clamp(-dy/(H*.5),0,1),dur:a.dur}}
  function classify(g){// o que esse gesto quer dizer neste contexto?
   if(K==='header')return{k:'header'};
   const toGoal={x:-ball.x,d:-ball.d};const tl=Math.hypot(toGoal.x,toGoal.d)||1;const cg=(g.dir.x*toGoal.x+g.dir.d*toGoal.d)/tl;
   if(!SETP){let best=null,ba=.36;for(const m of P){if(m.team!=='mate')continue;const lp=lead(m,dist(m,ball)/16);const ux=lp.x-ball.x,ud=lp.d-ball.d,L=Math.hypot(ux,ud)||1;const a=Math.acos(clamp((ux*g.dir.x+ud*g.dir.d)/L,-1,1));if(a<ba){ba=a;best=m}}
    if(best&&!(cg>.93&&ball.d<26&&K!=='pass'&&K!=='long'&&K!=='cross'))return{k:'pass',m:best}}
   if(SETP||cg>.25)return{k:'shot'};
   return{k:'carry'}}
  cv.addEventListener('pointerdown',e=>{if(phase!=='play'||ended)return;try{cv.setPointerCapture(e.pointerId)}catch(_){}const p=pt(e);aim={sx:p.x,sy:p.y,ex:p.x,ey:p.y,t:performance.now(),path:[p],dur:0};SFX.ctx()});
  cv.addEventListener('pointermove',e=>{if(!aim)return;const p=pt(e);aim.ex=p.x;aim.ey=p.y;aim.path.push(p);if(aim.path.length>60)aim.path.splice(1,1)});
  cv.addEventListener('pointercancel',()=>{aim=null});
  cv.addEventListener('pointerup',e=>{if(!aim)return;const a=aim;aim=null;a.dur=performance.now()-a.t;const len=Math.hypot(a.ex-a.sx,a.ey-a.sy);
   if(G.first==null&&phase==='play')G.first=G.t;
   if(GK)return gkInput(a.ex,a.ey);
   if(K==='header'){if(len<14){G.hdTap=true;return}const g=readGesture(a);G.hd={...g,t:G.t};return}
   if(!canAct()){G.miss++;return}
   if(len<14){// toque: no companheiro = passe seguro; no gramado = conduzir
    const m=!SETP&&mateAt(a.ex,a.ey);if(m){S.tips=S.tips||{};return pass(m,null)}
    if(SETP){G.miss++;return}const w=unproj(a.ex,a.ey);if(w){const dx=w.x-me.x,dd=w.d-me.d,L=Math.hypot(dx,dd);const k=Math.min(1,7/(L||1));carry(me.x+dx*k,me.d+dd*k,false)}return}
   if(len<24){G.miss++;return}
   const g=readGesture(a);const c=classify(g);
   tipSeen();
   if(c.k==='pass')return pass(c.m,g);
   if(c.k==='shot')return shoot(g,me);
   const near=P.some(q=>q.team==='opp'&&!q.wall&&q.fall<=0&&dist(q,me)<3.2);if(near)return dribbleMove(g.dir);carry(me.x+g.dir.x*(3+g.power*6),me.d+g.dir.d*(3+g.power*6),g.power>.5)});
  function gkInput(sx,sy){if(ended||G.gkIn)return;const dep=(cam.d-gk.d)*cam.dir;const s=F*cam.z/dep;const wx=cam.x+(sx-W/2)/s*cam.dir;const wh=cam.h-(sy-hz)/s;
   G.gkIn={x:clamp(wx,-GW+.2,GW-.2),h:clamp(wh,0,2.7),after:!!G.gkShot.fired};if(G.gkShot.fired)gkInfo.react=G.t-G.shotT;gkInfo.read=Math.sign(G.gkIn.x||0)===Math.sign(G.gkShot.tx);tipSeen()}
  function tipSeen(){try{S.tips=S.tips||{};S.tips.l2=S.tips.l2||{};S.tips.l2[K]=(S.tips.l2[K]||0)+1}catch(e){}}
  const tipCount=()=>{try{return(S.tips&&S.tips.l2&&S.tips.l2[K])||0}catch(e){return 9}};

  // =====================================================================
  // DESENHO DA MIRA E DOS INDICADORES
  // =====================================================================
  function thickArrow(x0,d0,ux,ud,L,col,col2,lab){const pts=[];const hw0=.3,hw1=.42,hh=.85,hl=1.4;const Lb=Math.max(.2,L-hl);const px=-ud,pd=ux;
   const poly=[[x0+px*hw0,d0+pd*hw0],[x0+ux*Lb+px*hw1,d0+ud*Lb+pd*hw1],[x0+ux*Lb+px*hh,d0+ud*Lb+pd*hh],[x0+ux*L,d0+ud*L],[x0+ux*Lb-px*hh,d0+ud*Lb-pd*hh],[x0+ux*Lb-px*hw1,d0+ud*Lb-pd*hw1],[x0-px*hw0,d0-pd*hw0]];
   const q=poly.map(([x,d])=>proj(x,d,.05,.4));if(q.some(v=>!v))return;
   ctx.save();ctx.translate(0,3);ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();q.forEach((v,i)=>i?ctx.lineTo(v.x,v.y):ctx.moveTo(v.x,v.y));ctx.closePath();ctx.fill();ctx.restore();
   const g=ctx.createLinearGradient(q[0].x,q[0].y,q[3].x,q[3].y);g.addColorStop(0,col);g.addColorStop(1,col2);ctx.fillStyle=g;ctx.beginPath();q.forEach((v,i)=>i?ctx.lineTo(v.x,v.y):ctx.moveTo(v.x,v.y));ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(40,25,0,.75)';ctx.lineWidth=3;ctx.lineJoin='round';ctx.stroke();
   if(lab){const t=proj(x0+ux*(L+.9),d0+ud*(L+.9),.6);if(t)pill(lab,t.x,t.y-8,'#fff','rgba(0,0,0,.6)',15)}}
  function pill(txt,x,y,fg,bg,fs=13){ctx.font=`900 ${fs}px 'Saira Condensed',sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';const tw=ctx.measureText(txt).width+14;ctx.fillStyle=bg;roundRect(x-tw/2,y-fs*.75,tw,fs*1.5,fs*.75);ctx.fill();ctx.fillStyle=fg;ctx.fillText(txt,x,y+1)}
  function drawAim(top){
   if(!top){
   // posse: companheiros elegíveis como alvos sutis + passe sugerido + pressão
   if(G.st==='POSSESSION'&&G.owner===me&&!ended){const bo=bestOption();
    for(const m of P){if(m.team!=='mate')continue;const fr=isFree(m);ring(m.x,m.d,.62,fr?'rgba(110,240,150,.95)':'rgba(255,170,90,.9)',2.5,bo.m===m);
     if(bo.m===m){const tp=proj(m.x,m.d,3.05);if(tp){const b=Math.sin(performance.now()/220)*3;ctx.fillStyle='#8fffb0';ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(tp.x-7,tp.y-10+b);ctx.lineTo(tp.x+7,tp.y-10+b);ctx.lineTo(tp.x,tp.y+b);ctx.closePath();ctx.fill();ctx.stroke()}}}
    if(G.press>.25)ring(me.x,me.d,.85,`rgba(255,${Math.round(200-150*G.press)},60,${.4+.5*G.press})`,3,true)}
   if(K==='header'&&!(G.hd&&G.hd.done)&&G.hdMP){ring(G.hdMP.x,G.hdMP.d,.55,G.hdWin?'#f2c443':'rgba(255,255,255,.6)',G.hdWin?5:2.5,true);
    if(G.hdWin){const tp=proj(me.x,me.d,3);if(tp)pill('AGORA!',tp.x,tp.y,'#1a1a1a','#f2c443',15)}
    if(G.hd&&!G.hd.done){const it=shotIntent({...G.hd,header:true});const t=proj(it.tx,0,it.th);if(t)target(t,Math.max(8,t.s*.3),'#ffd21f')}}
   return}
   if(!aim||GK)return;const len=Math.hypot(aim.ex-aim.sx,aim.ey-aim.sy);
   // traço do dedo
   if(aim.path.length>1){ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=6;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();aim.path.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.stroke()}
   if(len<24||K==='header'&&false)return;
   if(!canAct()&&K!=='header')return;
   const g=readGesture(aim);if(K==='header'){const it=shotIntent({...g,header:true});const t=proj(it.tx,0,it.th);if(t)target(t,Math.max(8,t.s*.3),'#ffd21f');return}
   const c=classify(g);
   if(c.k==='pass'){const m=c.m;const lp=lead(m,dist(m,ball)/16);const L=Math.hypot(lp.x-ball.x,lp.d-ball.d);const a=.5+.35*PAS;let ux=(lp.x-ball.x)/L*a+g.dir.x*(1-a),ud=(lp.d-ball.d)/L*a+g.dir.d*(1-a);const gl=Math.hypot(ux,ud)||1;ux/=gl;ud/=gl;
    const lofted=K==='long'||K==='cross'||L>25;const lane=lofted?0:laneBlock(ball.x,ball.d,lp.x,lp.d);thickArrow(ball.x,ball.d,ux,ud,Math.min(L*.85,2+g.power*10),lane>.45?'#ffc0b0':'#bfe6ff',lane>.45?'#ff5a3a':'#4aa8ff',null);
    if(lane>.45){const tq=proj(ball.x+ux*3,ball.d+ud*3,1.2);if(tq)pill('LINHA FECHADA',tq.x,tq.y,'#fff','rgba(190,40,30,.9)',13)}
    ring(lp.x,lp.d,.7,'#8fd3ff',4,true);const tp=proj(m.x,m.d,3.1);if(tp)pill(lofted?(K==='cross'?'CRUZAMENTO':'LANÇAMENTO'):'PASSE',tp.x,tp.y,'#8fd3ff','rgba(10,40,70,.85)',15);
    const want=.7+g.power*.6;const pw=Math.round(clamp(want,0,2)*100);const t2=proj(ball.x+ux*(2.4+g.power*10),ball.d+ud*(2.4+g.power*10),.6);if(t2&&!lofted)pill(Math.abs(want-1)<.12?'FORÇA CERTA':want<1?'FRACO':'FORTE',t2.x,t2.y-8,Math.abs(want-1)<.12?'#7dff9a':'#ffe23c','rgba(0,0,0,.6)',13);return}
   if(c.k==='shot'){const it=shotIntent(g);const e=errOf(it);const from={x:ball.x,d:ball.d,h:ball.h};let s;if(it.chip){const t=clamp(.75+ball.d*.035,1,1.45);s=solveLob(from,it.tx,-.4,clamp(.8+(1-it.p)*1.2,.9,2.2),t)}else s=solveShot(from,it.tx,it.th,it.v,it.spin);
    const r=sim({...from,vx:s.vx,vd:s.vd,vh:s.vh,spin:it.chip?0:it.spin},3,true);
    thickArrow(ball.x,ball.d,g.dir.x,g.dir.d,1.6+g.power*5.5,it.p>.8?'#ffb36b':'#ffe766',it.p>.8?'#ff5a2a':'#ffc61a',null);
    // trajetória prevista (curta) + alvo com a imprecisão (maior sob pressão)
    const n=r.pts.length;for(let i=4;i<n;i+=3){const q=r.pts[i];const a2=proj(q.x,q.d,q.h+.2,.6);if(!a2)continue;const rr=Math.max(1.8,Math.min(5,a2.s*.045));ctx.fillStyle=`rgba(255,246,190,${.9-.6*i/n})`;ctx.beginPath();ctx.arc(a2.x,a2.y,rr,0,7);ctx.fill()}
    const t=proj(it.tx,0,clamp(it.th,.1,GH+.6));if(t){const inG=Math.abs(it.tx)<GW&&it.th<GH;ctx.fillStyle=inG?'rgba(255,214,31,.18)':'rgba(255,90,74,.18)';ctx.beginPath();ctx.ellipse(t.x,t.y,Math.max(6,e.sx*t.s*.9),Math.max(5,e.sh*t.s*.9),0,0,7);ctx.fill();target(t,Math.max(8,t.s*.22),inG?'#ffd21f':'#ff5a4a')}
    const tp=proj(ball.x+g.dir.x*(2.6+g.power*5.5),ball.d+g.dir.d*(2.6+g.power*5.5),.7);if(tp){pill(Math.round(g.power*100)+'%',tp.x,tp.y-6,'#fff','rgba(0,0,0,.6)',18);pill(it.label,tp.x,tp.y+18,'#1a1a1a','#ffe23c',12)}return}
   const near=P.some(q=>q.team==='opp'&&!q.wall&&q.fall<=0&&dist(q,me)<3.2);thickArrow(me.x,me.d,g.dir.x,g.dir.d,2+g.power*4,'#ffffff','#d6e2ee',near?'DRIBLE':'CONDUZIR')}
  // mão fantasma: ensina o gesto sem texto longo
  function drawTutor(){if(tipCount()>=3||ended||aim)return;let a=null,b=null;const t=(performance.now()/1300)%1;
   if(GK){if(!G.gkShot.fired&&G.t>.4){const q=proj(GW*.7*(Math.sin(performance.now()/1300)>0?1:-1),0,1.2);if(q)a=b=q}}
   else if(canAct()&&G.t-(G.stT||0)>1.1){const bp=proj(ball.x,ball.d,0);if(!bp)return;
    if(K==='pass'||K==='long'||K==='cross'||K==='combo'){const m=bestOption().m||P.find(z=>z.team==='mate');const q=m&&proj(m.x,m.d,.9);if(q){a=b=q}}
    else if(K==='dribble'){a=bp;b={x:bp.x+70,y:bp.y-30}}
    else{a=bp;b={x:bp.x+(ch(0)?0:18),y:bp.y-H*.28}}}
   else if(K==='header'&&!G.hd&&G.t>.3){const bp=proj(me.x,me.d,1);if(bp){a=bp;b={x:bp.x-20,y:bp.y-H*.22}}}
   if(!a)return;const k=Math.min(1,t*1.5);const x=a.x+(b.x-a.x)*k,y=a.y+(b.y-a.y)*k;ctx.globalAlpha=1-t*.8;ctx.font='32px sans-serif';ctx.textAlign='center';ctx.textBaseline='top';ctx.fillText('👆',x,y);
   if(a===b){ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(a.x,a.y,8+t*18,0,7);ctx.stroke()}ctx.globalAlpha=1}
  function drawGK(){if(!GK)return;const sh=P.find(p=>p.shooter);
   if(G.cue&&!G.gkShot.fired){const q=proj(sh.x,sh.d,1.1);const q2=proj(sh.x+G.cue*1.2,sh.d-.6,1.1);if(q&&q2){ctx.strokeStyle='rgba(255,226,60,.95)';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(q2.x,q2.y);ctx.stroke();ctx.fillStyle='#ffe23c';ctx.beginPath();ctx.arc(q2.x,q2.y,5,0,7);ctx.fill()}}
   if(G.gkIn){const dep=(cam.d-gk.d)*cam.dir;const s=F*cam.z/dep;const x=W/2+(G.gkIn.x-cam.x)*s*cam.dir,y=hz-(G.gkIn.h-cam.h)*s;target({x,y},12,'#3cdc5a')}}
  function drawHUD(){
   if(!GK&&!SETP&&phase!=='intro'&&(G.st==='POSSESSION'||K==='header')&&!ended){const left=clamp(1-G.t/tmax,0,1);const cx=W-24,cy=24;ctx.fillStyle='rgba(0,0,0,.5)';ctx.beginPath();ctx.arc(cx,cy,15,0,7);ctx.fill();ctx.strokeStyle=left<.3?'#ff5a4a':'#f2c443';ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy,12,-Math.PI/2,-Math.PI/2+left*Math.PI*2);ctx.stroke();ctx.fillStyle='#fff';ctx.font="800 11px 'Saira Condensed',sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(Math.max(0,Math.ceil(tmax-G.t)),cx,cy+1)}
   if(phase!=='intro'){ctx.font="800 12px 'Saira Condensed',sans-serif";const lbl=(o.min!=null?o.min+"' · ":'')+tag.toUpperCase();const tw=ctx.measureText(lbl).width+18;ctx.fillStyle='rgba(0,0,0,.5)';roundRect(10,12,tw,22,11);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(lbl,19,23.5)}
   if(banner&&banner.tmp&&banner.t>.75)banner=null;
   if(banner){banner.t+=1/60;const k=Math.min(1,banner.t*5);const sc=.5+.5*(1-Math.pow(1-k,3))+(banner.t<.3?Math.sin(banner.t*30)*.06:0);
    ctx.save();ctx.translate(W/2,banner.tmp?H*.17:H*.38);ctx.rotate(-.05);ctx.scale(sc,sc);ctx.font=`900 ${banner.tmp?Math.min(36,W*.09):Math.min(70,W*.17)}px 'Saira Condensed',sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
    if(banner.ok){ctx.shadowColor='rgba(242,196,67,.8)';ctx.shadowBlur=24}
    ctx.lineWidth=10;ctx.strokeStyle='rgba(0,0,0,.6)';ctx.strokeText(banner.txt,0,0);ctx.shadowBlur=0;
    const fg=ctx.createLinearGradient(0,-30,0,30);if(banner.ok){fg.addColorStop(0,'#fff4c4');fg.addColorStop(1,'#f2a91a')}else{fg.addColorStop(0,'#ffffff');fg.addColorStop(1,'#c9d2dc')}ctx.fillStyle=fg;ctx.fillText(banner.txt,0,0);ctx.restore();
    if(ended&&!banner.tmp&&banner.t>.25){const n=NM.stars||0;for(let i=0;i<3;i++){const t=clamp((banner.t-.3-i*.12)*6,0,1);if(t>0){ctx.save();ctx.translate(W/2+(i-1)*34,H*.38+52);ctx.scale(t,t);star(0,0,13,i<n);ctx.restore()}}}}
   if(phase==='intro'){const k=Math.min(1,tIntro/.85);const bh=H*.09*(1-k*.6);ctx.fillStyle='#000';ctx.fillRect(0,0,W,bh);ctx.fillRect(0,H-bh,W,bh);
    const sx=-W*.6+W*.6*Math.min(1,k*2.2);ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(sx,H*.36,W,H*.12);ctx.fillStyle='#ff7a2b';ctx.fillRect(sx,H*.36,6,H*.12);ctx.fillStyle='#fff';ctx.font=`900 ${Math.min(40,W*.105)}px 'Saira Condensed',sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(GK?'ATENÇÃO, GOLEIRO!':tag.toUpperCase()+'!',W/2+sx,H*.42)}
   if(BOOT&&phase!=='intro'&&!ended){ctx.font="800 11px 'Saira Condensed',sans-serif";const bl='👟 '+BOOT.n;const bw=ctx.measureText(bl).width+16;ctx.fillStyle='rgba(0,0,0,.5)';roundRect(10,H-30,bw,20,10);ctx.fill();ctx.fillStyle='#f2c443';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(bl,18,H-19.5)}
   if(flashT>0){ctx.fillStyle=`rgba(255,255,255,${flashT})`;ctx.fillRect(0,0,W,H);flashT=Math.max(0,flashT-.03)}}
  function drawGrade(){if(!ended||NM.grade==null||ended.t<.35)return;const a=clamp((ended.t-.35)*4,0,1);ctx.save();ctx.globalAlpha=a;
   const y=H*.38+Math.min(70,W*.17)*.75+14;const lb=`NOTA ${NM.grade}`;
   ctx.font="900 17px 'Saira Condensed',sans-serif";const tw=ctx.measureText(lb).width+22;ctx.fillStyle='rgba(0,0,0,.7)';roundRect(W/2-tw/2,y-13,tw,26,13);ctx.fill();ctx.fillStyle=NM.grade>=75?'#7dff9a':NM.grade>=50?'#ffe23c':'#ff8a7a';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(lb,W/2,y+1);
   if(NM.why){ctx.font="700 12px 'Saira Condensed',sans-serif";const w2=Math.min(W-20,ctx.measureText(NM.why).width+18);ctx.fillStyle='rgba(0,0,0,.6)';roundRect(W/2-w2/2,y+17,w2,20,10);ctx.fill();ctx.fillStyle='#fff';ctx.fillText(NM.why,W/2,y+27,W-30)}
   if(NM.intc){const q=proj(NM.intc.x,NM.intc.d,0);if(q){ctx.strokeStyle='#ff3b2f';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(q.x,q.y,Math.max(14,q.s*.75),Math.max(6,q.s*.33),0,0,7);ctx.stroke()}}
   ctx.restore()}
  function render(rdt){
   ctx.save();if(shakeT>0){const a=shakeA*shakeT*2;ctx.translate((Math.random()-.5)*a,(Math.random()-.5)*a);shakeT=Math.max(0,shakeT-rdt)}
   ctx.clearRect(-20,-20,W+40,H+40);drawField();
   if(NM.netHit)NM.netHit.t+=rdt;
   if(cam.dir>0){drawNet();if(ball.d<0)drawBall();drawPosts()}
   if(me&&!GK){const sp0=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?.26:.62;sp0.push(proj(me.x+Math.cos(a)*rr,me.d+Math.sin(a)*rr*.95,.01))}if(sp0.every(Boolean)){ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();sp0.forEach((q,i)=>i?ctx.lineTo(q.x+1,q.y+2):ctx.moveTo(q.x+1,q.y+2));ctx.closePath();ctx.fill();ctx.fillStyle='#ffd21f';ctx.beginPath();sp0.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.closePath();ctx.fill()}}
   P.forEach(p=>shadow(p.x,p.d,.32,.32));shadow(ball.x,ball.d,.22,clamp(.45-ball.h*.08,.1,.45));
   if(phase==='play')drawAim(false);
   const ents=P.map(p=>({d:p.d,f:()=>drawPlayer(p)}));if(!(cam.dir>0&&ball.d<0))ents.push({d:ball.d-.01,f:drawBall});
   ents.sort((a,b)=>(b.d-a.d)*cam.dir).forEach(e=>e.f());
   if(cam.dir<0){drawNet();drawPosts()}
   if(phase==='play')drawAim(true);
   drawGK();
   vignette();drawParts(rdt);
   ctx.restore();
   drawHUD();drawTutor();drawGrade()}

  // =====================================================================
  // LOOP
  // =====================================================================
  let last=performance.now(),raf=0,doneAt=null;
  function loop(now){
   const rdt=Math.min(.04,(now-last)/1000);last=now;
   if(phase==='intro'){tIntro+=rdt;if(tIntro>.85){phase='play';setState(GK?'KEEPER':SETP?'POSSESSION':K==='header'?'FLIGHT':'POSSESSION');if(!GK&&!SETP&&K!=='header')G.grace=1}}
   // câmera lenta enquanto o dedo decide; na cabeçada quando a bola chega; no goleiro logo após o chute
   ts=1;if(aim&&canAct())ts=.22;if(K==='header'&&!(G.hd&&G.hd.done)&&Math.hypot(me.x-ball.x,me.d-ball.d)<6&&ball.h>.4)ts=.45;if(GK&&G.gkShot.fired&&!G.gkIn&&!ended)ts=.5;
   if(phase==='end'){ts=.5;ended.t+=rdt}
   if(phase!=='intro'){const dt=rdt*ts;const n=3;for(let i=0;i<n;i++){if(phase==='end'&&ended.t>1.6)break;step(dt/n)}}
   camUpdate(rdt);render(rdt);
   if(phase==='end'&&ended.t>1.7&&!doneAt){doneAt=now;cancelAnimationFrame(raf);const r=ended;SFX.stopLoop();
    swEnd(r.ok,r.txt,r.perfect).then(()=>res({ok:r.ok,perfect:!!r.perfect,grade:NM.grade}));try{const el=document.getElementById('mgRes');if(el&&NM.grade!=null)el.insertAdjacentHTML('beforeend',`<div class="nm-grade"><b>Nota ${NM.grade}</b> · ${esc(NM.why||'')}</div>`)}catch(e){}return}
   raf=requestAnimationFrame(loop)}
  raf=requestAnimationFrame(loop);SFX.startLoop();setTimeout(()=>SFX.whistle(),350);
  // ganchos de teste
  NM.__bp=()=>{const q=proj(ball.x,ball.d,ball.h+.2);return q&&{x:q.x,y:q.y,W,H}};
  NM.__pp=(x,d,h)=>{const q=proj(x,d,h||0);return q&&{x:q.x,y:q.y,W,H}};
  NM.api={state:()=>({phase,st:G.st,T:G.t,owner:G.owner===me,ball:{...ball},me:me&&{x:me.x,d:me.d},kicked:G.st==='FLIGHT'?'kick':G.st==='CONTEST'?'loose':null}),P,
   kickTo(tx,td,p,c){if(K==='header'){G.hd={dir:(()=>{const dx=tx-me.x,dd=td-me.d,L=Math.hypot(dx,dd)||1;return{x:dx/L,d:dd/L}})(),power:p,dy:.3,bulge:0,t:G.t};return}
    if(!canAct())return;const dx=tx-ball.x,dd=td-ball.d,L=Math.hypot(dx,dd)||1;const g={dir:{x:dx/L,d:dd/L},power:p,len:200,bulge:-(c||0)/9,dy:.3};const cl=classify(g);if(cl.k==='pass')pass(cl.m,g);else shoot(g,me)},
   tapMate(i){const ms=P.filter(q=>q.team==='mate');const m=i==null?(bestOption().m||ms[0]):ms[i];if(m&&canAct())pass(m,null)},
   gkSet(x,h){G.gkIn={x,h,after:!!G.gkShot.fired};if(G.gkShot.fired)gkInfo.react=G.t-G.shotT;gkInfo.read=Math.sign(x)===Math.sign(G.gkShot.tx)},
   carry(x,d){if(canAct())carry(x,d,false)},drible(x,d){if(canAct()){const dx=x-me.x,dd=d-me.d,L=Math.hypot(dx,dd)||1;dribbleMove({x:dx/L,d:dd/L})}},gk:()=>gk&&{x:gk.x,d:gk.d},gkShot:()=>G.gkShot};
 });
}

// ---------- liga o motor novo em tudo que usava os mini games de arrastar ----------
swipeShot=function(o){return nssMoment({...o,kind:o.kind==='fk'?'fk':o.kind==='header'?'header':'finish'})};
swipePass=function(o){return nssMoment({...o,kind:o.kind==='long'?'long':o.kind==='cross'?'cross':'pass'})};
swipeDribble=function(o){return nssMoment({...o,kind:'dribble',need:o.need||2})};
swipeReflex=function(o){return nssMoment({...o,kind:'keeper',skill:typeof skillOf==='function'?skillOf('REF'):.6})};

// ---------- pênaltis no estilo NSS ----------
IO_UI.penalty=async function(o){const save=o.mode==='save';const sk=k=>typeof skillOf==='function'?skillOf(k):.6;
 const r=await nssMoment({kind:save?'keeper':'pen',pen:true,comp:o.comp,min:o.min,title:save?`Pênalti contra! ${o.taker||'O batedor'} vai bater`:'Pênalti! A bola é sua',skill:save?sk('REF'):clamp(sk('FIN')-(55-S.life.cab)/400,.15,.95),keeper:.5,okTxt:save?'DEFENDEU!':'GOL!'});
 const last=NM.last||'';const res=save?(r.ok?'defesa':/fora/i.test(last)?'fora':'gol'):(r.ok?'gol':/segurou|Espalmou/.test(last)?'defesa':'fora');return{goal:res==='gol',res}};

// ---------- tabela e assistência nos jogos ----------
const _rcNM=runChance;runChance=async function(c){if(c.type==='tackle'){const sk=k=>typeof skillOf==='function'?skillOf(k):.6;return(await nssMoment({...c,kind:'tackle',title:c.planned?'Contra-ataque deles! Só você na frente':'O atacante vem pra cima de você',skill:sk('DEF')*.7+sk('VEL')*.3,keeper:.5,okTxt:'DESARMOU!'})).ok}if(c.type==='chip'){const sk=k=>typeof skillOf==='function'?skillOf(k):.6;return(await nssMoment({...c,kind:'chip',title:'O goleiro saiu do gol!',skill:sk('FIN'),keeper:c.planned?.4:.55,okTxt:'GOL DE COBERTURA!'})).ok}if(c.type==='combo'){const sk=k=>typeof skillOf==='function'?skillOf(k):.6;return(await nssMoment({...c,kind:'combo',title:c.planned?'Tabela na entrada da área!':'Jogada de tabela',skill:sk('PAS')*.5+sk('FIN')*.5,keeper:c.planned?.4:.55,okTxt:'Gol de tabela!'})).ok}return _rcNM(c)};
IO_UI.chance=async c=>runChance(c);
const _ctNM=chanceType;chanceType=function(e){const t=_ctNM(e);if(t==='finish'&&!e.fk&&ch(.25))return'chip';if(!e.fk&&['finish','dribble'].includes(t)&&['ATA','SA','MEI','MC','PE','PD','ME','MD'].includes(S.pos)&&ch(.28))return'combo';return t};
