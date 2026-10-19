// ================== LANCES NO ESTILO NEW STAR SOCCER ==================
// Câmera atrás do jogador, campo em perspectiva. Puxe o dedo pra trás (estilingue) e solte pra chutar.
// Puxada curta = conduzir. Depois do chute, arraste pro lado pra dar efeito. O tempo desacelera enquanto você mira.
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

function nssMoment(o){
 return new Promise(res=>{
  if(o.ast&&o.assist==null)o={...o,assist:true};
  NM.mateShot=false;NM.assistMode=false;NM.netHit=null;
  const K=o.kind||'finish';const pl=!!o.planned;const BOOT=(()=>{try{if(!S.boot||!(S.bootLeft>0))return null;return BOOTS.find(x=>x.id===S.boot)||null}catch(e){return null}})();const BB=BOOT?Object.values(BOOT.b).reduce((a,c)=>a+c,0)/10:0;const skill=clamp((o.skill??.6)+BB*.06,.12,.98);
  const kq=clamp((o.keeper??.45)*1.65,.45,.95);const spdMul=o.speed||1;
  const myC=club()?[club().c1||'#ff7a2b',club().c2||'#ffffff']:['#ff7a2b','#ffffff'];const opC=nmOppColor(myC[0]);
  const GK=K==='keeper';
  var fkAim=null;
  const P=[];const mk=(team,x,d,ex={})=>{const p={team,x,d,vx:0,vd:0,ph:Math.random()*6,sp:5,jump:0,...ex};P.push(p);return p};
  let me=null,gk=null;const ball={x:0,d:0,h:0,vx:0,vd:0,vh:0,ax:0,rot:0};
  let tmax=10,hint='',tag='Lance';
  const side=ch(.5)?1:-1;
  const vel=typeof skillOf==='function'?skillOf('VEL'):.6;
  const mySp=6.2+vel*1.6;const dri=typeof skillOf==='function'?skillOf('DRI'):.6;
  if(K==='finish'){
   me=mk('me',R(-7,7),pl?R(12,16):R(15,20));
   gk=mk('gk',0,1.2);
   mk('opp',me.x+R(-4,4),me.d+R(4,6),{sp:(pl?5.3:5.9)*spdMul});
   if(!pl)mk('opp',clamp(me.x*.55,-6,6),me.d-R(4.5,6.5),{sp:5.2*spdMul});
   if(!pl){const mt=mk('mate',clamp(me.x+(me.x>0?-1:1)*R(5,7),-20,20),me.d-R(2,4.5),{sp:5.6});mt.run={x:mt.x*.75,d:Math.max(8,mt.d-5)};mk('opp',mt.x-Math.sign(mt.x||1)*1.8,mt.d+R(.5,1.5),{sp:5*spdMul,mark:mt,loose:true})}
   tmax=pl?9:9;tag='Finalização';hint='O tempo para enquanto você decide. <b>Puxe para trás</b> e solte, depois <b>toque no ponto da bola</b> onde quer bater. Mire num companheiro para tocar. Rebote do goleiro ou da trave? <b>Corre que a bola tá viva!</b>';
  }else if(K==='fk'){
   const bx=R(-9,9),bd=R(19,25);me=mk('me',bx+(bx>0?.4:-.4),bd+1.1);ball.x=bx;ball.d=bd;fkAim={x:(bx>0?-1:1)*2.4,h:1.7};
   const L=Math.hypot(bx,bd),ux=-bx/L,ud=-bd/L;const cx=bx+ux*9.15,cd=bd+ud*9.15;const px=-ud,pd=ux;const shift=(bx>0?1:-1)*.5;
   for(let i=0;i<4;i++)mk('opp',cx+px*((i-1.5)*.62+shift),cd+pd*((i-1.5)*.62+shift),{wall:true,sp:0});
   gk=mk('gk',(bx>0?-1:1)*.9,.7);tmax=14;tag='Falta';hint='<b>Puxe para trás</b> mirando por fora da barreira e solte. Na bola, <b>toque no lado</b> para curvar ou em cima para ela cair.';
  }else if(K==='pen'){
   ball.x=0;ball.d=11;me=mk('me',R(-.5,.5),12.4);gk=mk('gk',0,.25);tmax=14;tag='Pênalti';hint='<b>Puxe para trás</b> mirando o canto e solte; depois toque na bola no meio. Chute no meio do gol o goleiro lê.';
  }else if(K==='combo'){
   me=mk('me',R(-8,8),R(26,30));const mt=mk('mate',clamp(me.x+side*R(4.5,6.5),-20,20),me.d-R(3.5,6),{sp:4});mt.run={x:mt.x-side*1.5,d:mt.d-2};
   mk('opp',me.x-side*R(2,3),me.d+R(2,4),{sp:4.4*spdMul});mk('opp',mt.x+side*1.2,mt.d-1.2,{sp:3.6,mark:mt});gk=mk('gk',0,1.2);tmax=14;tag='Tabela';
   hint='<b>1</b> Toque no companheiro. <b>2</b> Receba a devolução. <b>3</b> Puxe para trás, solte e toque na bola.';
  }else if(K==='chip'){
   me=mk('me',R(-3,3),R(17,21));gk=mk('gk',me.x*.3,R(6.5,8.5));gk.rush=true;
   mk('opp',me.x+R(-3,3),me.d+R(3,5),{sp:6*spdMul});
   tmax=9;tag='Cobertura';hint='O goleiro saiu do gol! <b>Puxe para trás</b> mirando o gol e, na bola, <b>toque embaixo</b> para encobrir. Força média: a bola cai dentro.';
  }else if(K==='header'){
   me=mk('me',R(-3,3),R(7,11));gk=mk('gk',0,1);mk('opp',me.x+R(-1.2,1.2),me.d-R(.8,1.4),{sp:4.6,mark:me});
   tmax=6;tag='Cabeçada';hint='Puxe <b>para trás</b> para mirar. Quando a bola entrar no anel, <b>toque</b> para cabecear.';
  }else if(K==='pass'){
   me=mk('me',R(-12,12),o.assist?R(27,32):R(44,52));const n=o.defs>=3?3:2;
   const mates=[];for(let i=0;i<n;i++){const x=clamp(me.x+(i-(n-1)/2)*R(7,9)+R(-1.5,1.5),-28,28);mates.push(mk('mate',x,me.d-(o.assist?R(6,10):R(7,13)),{sp:5.6}))}
   mates.forEach(m=>{m.run={x:m.x*(o.assist?.6:1)+R(-4,4),d:Math.max(9,m.d-(o.assist?R(3,6):R(9,16)))}});
   mk('opp',me.x+R(-2,2),me.d-R(6,8),{sp:5*spdMul});
   for(let i=0;i<(o.defs||2)-1;i++){const m=mates[i%mates.length];mk('opp',m.x+R(-2,2),m.d-R(1,3),{sp:5.4*spdMul,mark:m})}
   gk=mk('gk',0,1.2);tmax=9;tag='Passe';hint='<b>Puxe para trás</b> mirando no companheiro e solte, depois toque na bola. Quando ele recebe, <b>você passa a controlar ele</b>. Cuidado com o impedimento.';
  }else if(K==='long'){
   me=mk('me',R(-15,15),R(60,66));const far=mk('mate',R(-18,18),R(28,34),{sp:6});far.run={x:far.x*.6,d:far.d-12};
   const mid=mk('mate',clamp(me.x+R(-12,12),-28,28),me.d-R(14,18),{sp:5});mid.run={x:mid.x,d:mid.d-5};
   mk('opp',far.x+R(-2,2),far.d-R(1,3),{sp:5.6,mark:far});mk('opp',mid.x+R(-2,2),mid.d-2,{sp:5,mark:mid});mk('opp',me.x+R(-2,2),me.d-7,{sp:4.8});
   gk=mk('gk',0,1.5);tmax=9;tag='Lançamento';hint='<b>Toque no companheiro</b> lá na frente, ou puxe longo para trás mirando nele: a bola vai pelo alto.';
  }else if(K==='cross'){
   me=mk('me',side*R(23,28),R(9,17));
   const a=mk('mate',R(-4,2)*side*-1,R(9,12),{sp:6});a.run={x:a.x*.3,d:R(5,7)};
   const b=mk('mate',R(-2,4)*side*-1,R(12,15),{sp:5.5});b.run={x:b.x,d:R(10,12)};
   mk('opp',a.x+R(-1,1),a.d-1.2,{sp:5.2,mark:a});mk('opp',b.x+R(-1,1),b.d-1.2,{sp:5.2,mark:b});mk('opp',me.x-side*3,me.d-4,{sp:4.8});
   gk=mk('gk',0,1.2);tmax=8;tag='Cruzamento';hint='<b>Toque no companheiro</b> dentro da área, ou arraste até ele. Cruzamento sai pelo alto.';
  }else if(K==='dribble'){
   me=mk('me',R(-4,4),R(30,34));const n=o.need||2;
   for(let i=0;i<n;i++)mk('opp',clamp(me.x+R(-2.5,2.5),-18,18),me.d-6-i*6.5,{sp:(4.6+i*.3)*spdMul});
   const mt=mk('mate',clamp(me.x+(me.x>0?-1:1)*R(5.5,7.5),-20,20),me.d-R(4,7),{sp:5.4});mt.run={x:mt.x*.8,d:Math.max(12,mt.d-6)};
   gk=mk('gk',0,1.2);tmax=30;tag='Drible';hint='<b>Puxada curta</b> = toque na bola para conduzir. Passe pelos marcadores e chegue na área, toque no companheiro ou chute.';
  }else if(GK){
   gk=mk('me',0,.9);gk.isGK=true;const sh=mk('opp',o.pen?R(-.4,.4):R(-8,8),o.pen?11.6:R(13,20),{sp:0,shooter:true});ball.x=sh.x;ball.d=sh.d-.5;
   tmax=6;tag='Defesa';hint='Antes do chute, toque em um lado para <b>antecipar</b> (é um risco). Quando ele chutar, <b>arraste para o lado</b> do mergulho.';
  }
  if(me&&K!=='fk'&&K!=='pen'&&!GK){ball.x=me.x;ball.d=me.d-.45}
  if(K==='header'){const T=1.15;const tx=me.x+R(-1.2,1.2),td=me.d+R(-1.2,1);ball.x=side*R(22,27);ball.d=R(9,15);ball.h=.3;ball.vx=(tx-ball.x)/T;ball.vd=(td-ball.d)/T;ball.vh=(1.75-.3+4.9*T*T)/T;me.run={x:tx,d:td};NM.cross={tx,td}}
  P.forEach(p=>{if(p.team==='opp'){p.c=opC[0];p.c2=opC[1]}else if(p.team==='gk'){p.c='#f5e400';p.c2='#222'}else{p.c=myC[0];p.c2=myC[1]}});
  if(GK){gk.c='#3cdc5a';gk.c2='#222'}

  // ---------- quadro ----------
  $ov.hidden=false;
  $ov.innerHTML=`<div class="ovwrap mg nssm"><div class="nm-top"><span class="eyebrow">${esc(o.comp||'')}${o.min!=null?` · ${o.min}'`:''}</span><span class="nm-tr"><button class="nm-snd" id="nmSnd" aria-label="Som">${SFX.on?'🔊':'🔇'}</button><span class="tag campo">${esc(tag)}</span></span></div>
  <h2 class="pkh nm-t">${esc(o.title||'')}</h2><div class="nm-stage"><canvas id="nmC"></canvas></div><div class="nm-ctl" id="nmCtl"></div><p class="swhint nm-h">${hint}</p><div class="pkres" id="mgRes"></div></div>`;
  const cv=document.getElementById('nmC');const ctx=cv.getContext('2d');
  document.getElementById('nmSnd').onclick=e=>{const on=SFX.toggle();e.currentTarget.textContent=on?'🔊':'🔇';if(on)SFX.startLoop()};
  const stage=cv.parentElement;const W=Math.min(stage.clientWidth||360,480);const H=Math.round(Math.min(W*(GK?1.02:1.28),Math.max(320,innerHeight-235)));
  const dpr=Math.min(2,devicePixelRatio||1);cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
  const F=GK?H*.95:H*1.3,hz=GK?H*.3:H*.4;
  const XS=K==='cross'&&me?Math.sign(me.x||1):0;
  const XF=XS?(()=>{const dx=-me.x,dd=7-me.d,L=Math.hypot(dx,dd)||1;return[dx/L,dd/L]})():null;
  // câmera em terceira pessoa: atrás do sujeito, olhando pro gol (no cruzamento, de lado olhando a área)
  function behind(sx,sd,B,off){let fx,fd;if(XF){[fx,fd]=XF}else{fx=(0-sx)*.5;fd=Math.min(-5-sd,-3);const L=Math.hypot(fx,fd)||1;fx/=L;fd/=L}
   const y=Math.atan2(fx,-fd),rx=Math.cos(y),rd=Math.sin(y),o2=off==null?(XF?0:1.8):off;return{x:sx-fx*B+rx*o2,d:sd-fd*B+rd*o2,y}}
  const CB=11.5,CHh=6.2,CTl=.3;const XM=XF?{x:me.x/2,d:(me.d+7)/2}:null;
  const cam=GK?{x:0,d:-7.6,h:2.5,dir:-1,tilt:0,z:1}:(()=>{const s0=me||ball;const b=behind(s0.x,s0.d,XF?10:CB);return{x:b.x,d:b.d,h:XF?6.5:CHh,dir:1,tilt:XF?.36:CTl,z:1,yaw:b.y}})();
  if(K==='pen'||K==='fk'){const b=behind(ball.x,ball.d,K==='pen'?8:9,0);cam.x=b.x;cam.d=b.d;cam.yaw=b.y;cam.h=K==='pen'?4.2:5;cam.tilt=.28}
  const proj=(x,d,h,mn)=>{const cy=Math.cos(cam.yaw||0),sy=Math.sin(cam.yaw||0),dx0=x-cam.x,dd0=d-cam.d;const lat=(dx0*cy+dd0*sy)*cam.dir,dz=(dx0*sy-dd0*cy)*cam.dir,dy=h-cam.h,ct=Math.cos(cam.tilt),st=Math.sin(cam.tilt);const zc=dz*ct-dy*st;if(zc<(mn||.35))return null;const yc=dy*ct+dz*st;const s=F*cam.z/zc;return{x:W/2+lat*s,y:hz-yc*s,s}};

  // ---------- estado ----------
  let runUp=null;const STRK=['finish','fk','pen','pass','long','cross','combo','chip'].includes(K);let strike=null;
  let loftSel=(K==='long'||K==='cross')?2:(K==='pass'?0:1),shotInfo=null,gkInfo={antic:0},gotT=-9,hdTapT=-9,hdMiss=false,reflexT=0;NM.intc=null;NM.grade=null;NM.why='';
  let phase='intro',T=0,tIntro=0,owner=(K==='fk'||K==='pen'||K==='header'||GK)?null:me,kicked=null,kickT=0,aim=null,lastAim=null,curl=0,ended=null,banner=null,ts=1,prePath=null,shotLive=false,gkReact=0,gkDive=0,headed=false,flightLog=[];
  const sp2=()=>Math.hypot(ball.vx,ball.vd);
  const dist=(a,b)=>Math.hypot(a.x-b.x,a.d-b.d);
  let loose=null;NM.rebs=0;
  function goLoose(src,txt){if(ended||NM.rebs>=3)return false;NM.rebs++;loose={t0:T,src};kicked='loose';kickT=T;owner=null;shotLive=false;gkReact=0;runUp=null;NM.mateShot=false;NM.assistMode=false;
   if(gk){gk.err=null;if(src!=='gk')gk.down=0}tmax=Math.max(tmax,T+6);banner={txt,ok:false,t:0,tmp:true};P.forEach(p=>{if(p.team==='mate')p.got=false});
   {const q=proj(ball.x,ball.d,ball.h+.2);if(q)burst(q.x,q.y,10,['#ffffff','#ffe23c'],110,220,3)}shake(3,.15);try{SFX.tone({f:src==='post'?1320:240,f2:src==='post'?900:160,dur:src==='post'?.25:.09,gain:.12,type:src==='post'?'square':'triangle'})}catch(e){}return true}
  function finish(ok,txt,perfect,big){if(ended)return;try{gradeNow(ok,big,txt)}catch(e){}if(ok&&NM.grade>=88)perfect=true;NM.last=txt;ended={ok,txt,perfect,t:0};banner={txt:big||txt,ok,t:0};phase='end';try{onEnd(ok,big)}catch(e){}}
  function gradeNow(ok,big,txt){let dq=.6,ex=.6,df=.4,im=ok?1:0;const why=[];
   if(big==='NA TRAVE!')im=.35;if(big==='DEFENDEU!'&&!GK)im=.2;
   if(GK){const r=gkInfo.react;ex=gkInfo.early?.1:r==null?0:clamp(1-(r-.12)/.55,0,1);dq=gkInfo.antic?(gkInfo.anticOk?1:.25):.7;df=o.pen?.8:.55;
    why.push(gkInfo.early?'pulou antes do chute':r==null?'não reagiu':r<.3?'reação rápida':'reagiu tarde');if(gkInfo.antic)why.push(gkInfo.anticOk?'leu o lado certo':'antecipou o lado errado')}
   else if(K==='dribble'){ex=drbTot?drbPerf/drbTot:.2;dq=.75;df=clamp((o.need||2)/4,.3,1);why.push(drbTot&&drbPerf===drbTot?'tempo perfeito nos dribles':ok?'passou, mas fora do tempo ideal':'faltou tempo no drible')}
   else if(shotInfo){const s=shotInfo;const g=s.g;ex=clamp(g.contact*(1-Math.abs(s.k.err||0)/((s.k.base||.13)*1.6)),0,1);df=clamp(s.d0/30+(s.press?.25:0),0,1);
    if(s.pass){dq=s.free?.92:.45;why.push(NM.intc?'linha de passe fechada':s.free?'boa escolha de receptor':'receptor estava marcado');if(s.assist)ex=Math.max(ex,.7)}
    else if(s.header){dq=.7;ex=clamp(g.contact,0,1);why.push(g.contact>.8?'tempo de bola perfeito':g.contact>.6?'tempo de bola quase certo':'cabeceou fora do tempo')}
    else{const tx=s.tx;if(tx==null||Math.abs(tx)>GW||s.th>GH){dq=.25;why.push(tx!=null&&s.th>GH?'mirou por cima do gol':'mirou fora do gol')}else{const off=Math.abs(tx-s.gkx);dq=off>1.6?.9:off>.8?.65:.3;why.push(dq>.8?'boa escolha de canto':dq<.4?'chute em cima do goleiro':'canto pouco aberto')}
     if(s.loftSel===2&&s.gkd>2.5){dq=1;why.push('leu a saída do goleiro')}
     if(Math.abs(g.curve)>.3)why.push(ok?'efeito bem usado':'efeito exagerado')}
    if(!s.header){if(g.power>.88)why.push('força acima do necessário');else if(g.power<.3&&!s.pass)why.push('faltou força');else why.push('força na medida')}
    if(g.contact<.6)why.push('gesto tremido, contato ruim')}
   else{dq=.2;ex=.2;why.push(/Demorou|nem viu|passou por/i.test(txt||'')?'demorou para decidir':'lance perdido')}
   const gr=Math.round(clamp(100*(.3*dq+.3*ex+.15*df+.25*im),0,100));NM.grade=gr;NM.why=why.slice(0,2).join('; ');NM.stars=!ok?0:gr>=80?3:gr>=60?2:1}
  function canAim(){if(phase!=='play')return false;if(GK)return !gkTarget;if(K==='header')return !headed||owner===me;if(K==='fk'||K==='pen')return !kicked;return owner===me}

  // simulação de bola sem colisão (pra prévia e pros companheiros)
  function simPath(b,secs){const p=[];let x=b.x,d=b.d,h=b.h,vx=b.vx,vd=b.vd,vh=b.vh,spin=b.spin||0;let g=9.8+(b.dip||0);const dt=1/30;let bounced=null;
   for(let i=0;i<secs*30;i++){if(h>0||vh>0)vh-=g*dt;
    if(spin){const sp=spin*(h>0?1:.4);const ox=vx;vx-=sp*vd*dt;vd+=sp*ox*dt;spin*=1-dt*.7}
    x+=vx*dt;d+=vd*dt;h+=vh*dt;if(h<0){h=0;if(!bounced)bounced={x,d,i};if(vh<-1.6)vh=-vh*.38;else vh=0;g=9.8}
    if(h===0){const s=Math.hypot(vx,vd);const ns=Math.max(0,s-3.2*dt);if(s>0){vx*=ns/s;vd*=ns/s}}else{vx*=1-.015*dt;vd*=1-.015*dt}
    p.push({x,d,h,t:(i+1)*dt});if(d<-2||Math.abs(x)>36)break;if(h===0&&Math.hypot(vx,vd)<.3)break}
   return{p,bounced}}
  // ===== gesto: toque inicial = origem; deslocamento = direção e força; soltar = chute =====
  const GSC=clamp(W/360,.85,1.3);
  const COMP=typeof skillOf==='function'?skillOf('MEN'):.6;const PASK=typeof skillOf==='function'?skillOf('PAS'):.6;
  const TEC=clamp((dri+skill)/2+BB*.05,.1,1);const CTRL=clamp(dri*.6+skill*.4+BB*.05,.1,1);
  function unproj(sx,sy){const ct=Math.cos(cam.tilt),st=Math.sin(cam.tilt);const FZ=F*cam.z;const v=(hz-sy)/FZ;const den=st-v*ct;if(den<=.01)return null;const dz=cam.h*(ct+v*st)/den;const zc=dz*ct+cam.h*st;if(zc<=.1)return null;const s=FZ/zc;const lat=(sx-W/2)/s;const cy=Math.cos(cam.yaw||0),sy2=Math.sin(cam.yaw||0);const Lw=lat*cam.dir,Dw=dz*cam.dir;return{x:cam.x+cy*Lw+sy2*Dw,d:cam.d+sy2*Lw-cy*Dw}}
  function readShotGesture(a){
   const dx=a.cx-a.sx,dy=a.cy-a.sy,len=Math.hypot(dx,dy);if(len<12)return null;
   const hd=K==='header'&&!headed;const ox=hd?me.x:ball.x,od=hd?me.d:ball.d;
   const B=proj(ox,od,0);let ux=0,ud=-1;
   if(B){for(const k of[70,40,22]){const w=unproj(B.x-dx/len*k,B.y-dy/len*k);if(w){const L=Math.hypot(w.x-ox,w.d-od);if(L>.05){ux=(w.x-ox)/L;ud=(w.d-od)/L;break}}}}
   const raw=len/(175*GSC);const AL0=autoLoft(raw,hd);const power=AL0.power;
   // efeito: quanto o traço "barriga" para um lado da corda
   let dev=0,plen=0;const pth=a.path||[];const px=-dy/len,py=dx/len;
   for(let i=0;i<pth.length;i++){const q=pth[i];const v=(q.x-a.sx)*px+(q.y-a.sy)*py;if(Math.abs(v)>Math.abs(dev))dev=v;if(i)plen+=Math.hypot(q.x-pth[i-1].x,q.y-pth[i-1].y)}
   let cs=dev/len;cs=Math.abs(cs)<.06?0:clamp((cs-Math.sign(cs)*.06)/.24,-1,1);
   const curve=-cs*cam.dir;
   const jitter=plen>0&&pth.length>3?clamp((plen/len-1-Math.abs(cs)*.18)*1.5,0,.35):0;
   const over=Math.max(0,power-.86)*2.2;
   const contact=clamp(1-jitter-over+BB*.12,.25,1);
   const G={ux,ud,power,curve,contact,len,raw,lsel:AL0.lsel,loft:AL0.loft,dip:AL0.dip,chip:!!AL0.chip};if(strike)applyContact(G,strike.cp||{x:0,y:0});return G;
  }
  // ponto de contato: embaixo sobe, em cima sai rasteiro/caindo, nos lados faz curva
  function applyContact(g,cp){g.cx=cp.x;g.cy=cp.y;const ax=Math.abs(cp.x);g.curve=ax<.22?0:ax>.68?-Math.sign(cp.x)*1:clamp(cp.x*1.15,-1,1);g.ctype=ax>.68?'TRIVELA':ax>=.22?'EFEITO':cp.y>.45?'CAVADINHA':cp.y>.2?'POR CIMA':cp.y<-.3?'RASTEIRA':'COLOCADA';if(g.ctype==='CAVADINHA')g.lsel=2;if(g.ctype==='COLOCADA'){g.contact=Math.min(1,(g.contact||1)+.1)}
   if(!g.chip){g.loft=clamp(g.loft+cp.y*.17,.01,.75);if(cp.y<-.35){g.dip=(g.dip||0)+3.5;g.loft=Math.max(.01,g.loft-.03)}if(cp.y>.4&&g.lsel<2&&g.loft>.3)g.lsel=2;if(cp.y<-.4&&g.loft<.08)g.lsel=0}}
  // puxada curta = rasteiro; média = meia altura; longa = forte e alto; além do máximo = cavadinha
  function autoLoft(raw,header){const p=clamp(raw,.12,1);
   if(header)return{lsel:1,loft:.06,dip:0,power:p};
   if(K==='fk')return p<.4?{lsel:0,loft:.1,dip:0,power:p}:p<=.85?{lsel:1,loft:.42,dip:5,power:p}:{lsel:2,loft:.52,dip:7,power:p};
   if(isPassK())return(K==='cross'||p>=.6)?{lsel:2,loft:K==='cross'?.55:.45+(p-.6)*.4,dip:0,power:p}:{lsel:0,loft:.03,dip:0,power:p};
   if(raw>1.22&&K!=='pen')return{lsel:2,loft:.66,dip:0,power:.42,chip:true};
   if(p<.42)return{lsel:0,loft:.02,dip:0,power:p};
   if(p<=.8)return{lsel:1,loft:.1+(p-.42)*.35,dip:0,power:p};
   return{lsel:1,loft:.23+(p-.8)*.6,dip:0,power:p}}
  const isPassK=()=>(K==='pass'||K==='long'||K==='cross'||(K==='combo'&&!comboStage));
  function loftOf(p,header){if(header)return .06;const ps=isPassK();
   if(K==='fk')return[.1,.42,.55][loftSel];
   if(loftSel===0)return .02;if(loftSel===2)return ps?.6:.66;return ps?.04:.12+p*.15}
  function createShot(g,header,noise){
   const p=g.power;const ps=isPassK()&&!header;
   const mn=header?7:ps?6:10,mx=header?19:ps?27:33;const speed=mn+(mx-mn)*p;
   const sk=ps?clamp(PASK*.7+skill*.3,.1,1):skill;
   const base=header?.14:ps?.07:.09;const prec=g.ctype==='COLOCADA'?.3:g.ctype==='CAVADINHA'?.5:1;
   const err=noise?(Math.random()*2-1)*base*prec*(1-.62*sk)*(1.15-.3*COMP)*(1.35-.55*g.contact):0;
   const loft=g.loft!=null?g.loft:loftOf(p,header);
   const spin=-g.curve*1.6*(.35+.65*TEC);
   const L0=ps?14:Math.max(6,Math.hypot(ball.x,ball.d));const tf=clamp(L0/(speed*.9),.3,1.3);
   const ang=Math.atan2(g.ux,-g.ud)-spin*tf*.4+err;
   let hs=speed*(1-loft*.35),vh=speed*(.05+loft*.62);
   if(g.ctype==='CAVADINHA'&&!header&&!ps&&g.ud<-.2){const ang0=Math.atan2(g.ux,-g.ud);const D=Math.max(6,ball.d/Math.cos(ang0));const t=clamp(.85+D*.03,1.1,1.6);const hG=.7+(p-.4)*5.2;vh=(hG-.11+.5*9.8*t*t)/t;hs=D/t*1.02;
    return{type:'kick',vx:Math.sin(ang0+err)*hs,vd:-Math.cos(ang0+err)*hs,vh,spin:0,p,loft:.7,err,speed:Math.hypot(hs,vh),dip:0,base}}
   if(g.ctype==='COLOCADA')hs*=.95;
   const dip=g.dip!=null?g.dip:(K==='fk'?[0,5,7][loftSel]:0);
   return{type:header?'header':'kick',vx:Math.sin(ang)*hs,vd:-Math.cos(ang)*hs,vh,spin,p,loft,err,speed,dip,base}}
  function goalCross(b){const sp=simPath(b,2.2);const q=sp.p.find(z=>z.d<=0);return{q,p:sp.p}}
  function doShot(g,header,extra){if(g.lsel!=null)loftSel=g.lsel;
   const k=createShot(g,header,true);
   if(header){ball.x=me.x;ball.d=me.d-.2;ball.h=Math.max(ball.h,1.6);me.jump=.35;headed=true}
   const ideal=createShot(g,header,false);const gc=goalCross({x:ball.x,d:ball.d,h:ball.h,vx:ideal.vx,vd:ideal.vd,vh:ideal.vh,spin:ideal.spin,dip:ideal.dip});
   shotInfo={g,k,header,x0:ball.x,d0:ball.d,gkx:gk?gk.x:0,gkd:gk?gk.d:0,loftSel,pass:isPassK()&&!header,tx:gc.q?gc.q.x:null,th:gc.q?gc.q.h:null,
    press:P.some(q=>q.team==='opp'&&!q.wall&&dist(q,ball)<2.4),...(extra||{})};
   ball.vx=k.vx;ball.vd=k.vd;ball.vh=k.vh;ball.ax=0;ball.spin=k.spin;ball.dip=k.dip;owner=null;kicked=k.type;kickT=T;curl=Math.abs(g.curve)>.15?Math.sign(g.curve):0;{const q=proj(ball.x,ball.d,ball.h+.19);if(q)burst(q.x,q.y,10+Math.round(g.power*10),['#ffffff','#fff3a0','#9ad07a'],90+g.power*120,220,3)}shake(2+g.power*3,.14);
   shotLive=ball.vd<-5&&ball.d<40&&!shotInfo.pass;gkReact=.18+(1-kq)*.25+(K==='fk'?.22:0);gk&&(gk.err=null);P.forEach(p=>{if(p.wall)p.jump=.45});
   if(K==='pen'){const q=gc.q||{x:0};const px=q.x;gk.penT=ch(.24+.15*kq+(Math.abs(px)<1.1?.45:0))?px+gauss()*.5:(ch(.6)?-Math.sign(px||1)*R(1.5,3):0);gkReact=.04}
   const sp=simPath({...ball},3);NM.path=sp.p;P.filter(p=>p.team==='mate').forEach(m=>planRun(m));
   if(!header&&me){me.follow={x:me.x+g.ux*1.5,d:me.d+g.ud*1.5}}
   tapFx(k.type);
  }
  // ===== TELA DO CHUTE: corta para a bola grande =====
  function bestMate(){let best=null,bv=-1e9;for(const m of P){if(m.team!=='mate')continue;const free=!P.some(q=>q.team==='opp'&&dist(q,m)<2.6);const v=-m.d*.4+(free?8:0);if(v>bv){bv=v;best=m}}return best}
  function enterStrike(tg,mate){if(strike||ended)return;if(!tg){if(isPassK()){mate=mate||bestMate();tg=mate?leadOf(mate,dist(mate,ball)/14):{x:0,d:0}}else tg={x:clamp(-ball.x*.08,-1,1),d:0}}
   strike={tg,mate:mate||null,cp:null,t0:T};aim=null;flashT=.16;SFX.tone({f:300,f2:900,dur:.18,gain:.08,type:'triangle'});strikeCam();
   try{if(navigator.vibrate)navigator.vibrate(10)}catch(e){}}
  function shotStrike(g,m){const tg=m?leadOf(m,dist(m,ball)/14):{x:ball.x+g.ux*16,d:ball.d+g.ud*16};enterStrike(tg,m||null);if(strike){strike.pending={g,m};strike.rt=performance.now()}}
  function fireStrike(){if(!strike||!strike.pending)return;const{g,m}=strike.pending;const cp=strike.cp||{x:0,y:0};applyContact(g,cp);exitStrike();if(m){passTo(m,g)}else doShot(g,false);S.tips=S.tips||{};S.tips.nssm=(S.tips.nssm||0)+1}
  function exitStrike(){if(!strike)return;strike=null;const pf=K==='fk'||K==='pen';const b=behind(ball.x,ball.d,pf?9:CB,pf?0:null);cam.yaw=b.y;cam.x=b.x;cam.d=b.d;cam.h=pf?5:CHh;cam.tilt=pf?.28:CTl;cam.z=1}
  function strikeCam(){const tg=strike.tg,dx=tg.x-ball.x,dd=tg.d-ball.d,L=Math.hypot(dx,dd)||1,fx=dx/L,fd=dd/L;cam.yaw=Math.atan2(fx,-fd);cam.dir=1;cam.tilt=0;cam.z=1;
   const br=Math.sin(performance.now()/700)*.012;cam.x=ball.x-fx*1.6;cam.d=ball.d-fd*1.6;cam.h=.42+br}
  function strikeUI(){if(!strike)return;
   // faixas de cinema + título
   const g1=ctx.createLinearGradient(0,0,0,H*.14);g1.addColorStop(0,'rgba(0,0,0,.55)');g1.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g1;ctx.fillRect(0,0,W,H*.14);
   const g2=ctx.createLinearGradient(0,H*.82,0,H);g2.addColorStop(0,'rgba(0,0,0,0)');g2.addColorStop(1,'rgba(0,0,0,.6)');ctx.fillStyle=g2;ctx.fillRect(0,H*.82,W,H*.18);
   const bp=proj(ball.x,ball.d,ball.h+.11);if(!bp)return;const r=.11*bp.s;
   if(!aim){ctx.font="900 14px 'Saira Condensed',sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';const t1='TOQUE ONDE BATER NA BOLA';const tw=ctx.measureText(t1).width+24;ctx.fillStyle='rgba(0,0,0,.6)';roundRect(W/2-tw/2,H-38,tw,26,13);ctx.fill();ctx.fillStyle='#ffe23c';ctx.fillText(t1,W/2,H-24)}
   // guias do ponto de contato
   if(!aim){ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=2;ctx.setLineDash([5,6]);ctx.beginPath();ctx.arc(bp.x,bp.y,r*1.18,0,7);ctx.stroke();ctx.setLineDash([]);
    ctx.font="800 11px 'Saira Condensed',sans-serif";ctx.fillStyle='rgba(255,255,255,.92)';ctx.textAlign='center';ctx.textBaseline='middle';
    const lab=(t,x,y)=>{const w2=ctx.measureText(t).width+12;ctx.fillStyle='rgba(0,0,0,.55)';roundRect(x-w2/2,y-9,w2,18,9);ctx.fill();ctx.fillStyle='#fff';ctx.fillText(t,x,y)};
    lab('▲ RASTEIRO',bp.x,bp.y-r*1.42-16);lab('▼ SOBE',bp.x,bp.y+r*1.42+16);lab('CURVA ↶',bp.x+r*1.42+38,bp.y);lab('↷ CURVA',bp.x-r*1.42-38,bp.y)}
   const cp=strike.cp||{x:0,y:0};const mx=bp.x+cp.x*r*.82,my=bp.y+cp.y*r*.82;
   ctx.fillStyle='rgba(255,60,40,.95)';ctx.beginPath();ctx.arc(mx,my,Math.max(4,r*.13),0,7);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.arc(mx,my,Math.max(7,r*.22),0,7);ctx.stroke();
   // voltar
   {const left=clamp(1-(performance.now()-(strike.rt||performance.now()))/3600,0,1);ctx.lineWidth=5;ctx.strokeStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.arc(bp.x,bp.y,r*1.42,0,7);ctx.stroke();ctx.strokeStyle=left<.3?'#ff5a4a':'#ffe23c';ctx.beginPath();ctx.arc(bp.x,bp.y,r*1.42,-Math.PI/2,-Math.PI/2+left*Math.PI*2);ctx.stroke()}
   if(true){ctx.fillStyle='rgba(0,0,0,.55)';roundRect(10,44,74,26,13);ctx.fill();ctx.fillStyle='#fff';ctx.font="800 12px 'Saira Condensed',sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('← VOLTAR',47,57)}
   // alvo: nome do companheiro
   if(strike.mate){const q=proj(strike.mate.x,strike.mate.d,2.4);if(q){ctx.fillStyle='rgba(30,120,200,.85)';roundRect(q.x-30,q.y-10,60,18,9);ctx.fill();ctx.fillStyle='#fff';ctx.font="800 11px 'Saira Condensed',sans-serif";ctx.textAlign='center';ctx.fillText('PASSE',q.x,q.y)}}
  }
  // ===== CONTATO (MSS): depois de mirar, uma bola atravessa a tela; toque no ponto e na hora certa =====
  let CT=null;const CTD=1.25;
  function startContact(g,m){CT={g,m,t0:performance.now()};aim=null;SFX.tone({f:420,f2:760,dur:.12,gain:.06,type:'triangle'})}
  function ctPos(){const k=Math.min(1,(performance.now()-CT.t0)/260);const r=Math.min(W,H)*.2*(.6+.4*k);return{k:.5,x:W/2,y:H*.55,r,a:k}}
  function ctFire(cp,e,miss){const c=CT;CT=null;const g=c.g;
   if(miss){g.power*=.45;g.contact=.25;g.loft=Math.max(.01,(g.loft||.1)*.5);banner={txt:'FURADA!',ok:false,t:0,tmp:true}}
   else{applyContact(g,cp);const ae=Math.abs(e);g.power=clamp(g.power*(1-.32*ae),.12,1);g.loft=clamp((g.loft||.1)-e*.12,.01,.8);g.contact=clamp((g.contact||1)*(1-.55*ae),.2,1);
    banner={txt:g.ctype||'CHUTE',ok:true,t:0,tmp:true};SFX.tone({f:880,dur:.1,gain:.08})}
   NM.lastCT=g.ctype;NM.lastP=g.power;if(me){const bx=ball.x,bd=ball.d;me.x=bx-g.ux*1.25;me.d=bd-g.ud*1.25+.2;me.vx=me.vd=0;runUp={g,m:c.m,t0:T,bx,bd}}else{if(c.m)passTo(c.m,g);else doShot(g,false)}}
  function drawContact(){if(!CT)return;const p=ctPos();
   ctx.fillStyle='rgba(6,20,10,.55)';ctx.fillRect(0,0,W,H);
   // faixa de grama e zona ideal
   const gy=p.y+p.r*1.05;const gg=ctx.createLinearGradient(0,gy-30,0,gy+40);gg.addColorStop(0,'#4ea83a');gg.addColorStop(1,'#3b8a2e');ctx.fillStyle=gg;ctx.fillRect(0,gy-6,W,46);

   // bola grande rolando
   ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(p.x,gy+2,p.r*.9,p.r*.18,0,0,7);ctx.fill();
   const r=p.r,rot=p.k*9;const g2=ctx.createRadialGradient(p.x-r*.35,p.y-r*.35,r*.1,p.x,p.y,r);g2.addColorStop(0,'#fff');g2.addColorStop(1,'#cfd3d8');ctx.fillStyle=g2;ctx.beginPath();ctx.arc(p.x,p.y,r,0,7);ctx.fill();
   ctx.save();ctx.beginPath();ctx.arc(p.x,p.y,r,0,7);ctx.clip();ctx.fillStyle='#1b1b1b';const pent=(cx,cy,rr,a0)=>{ctx.beginPath();for(let i=0;i<5;i++){const a=a0+i*Math.PI*2/5;ctx.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr)}ctx.closePath();ctx.fill()};
   pent(p.x,p.y,r*.3,-Math.PI/2);for(let i=0;i<5;i++){const a=-Math.PI/2+Math.PI/5+i*1.2566;pent(p.x+Math.cos(a)*r*.92,p.y+Math.sin(a)*r*.92,r*.25,a)}ctx.restore();
   ctx.strokeStyle='#111';ctx.lineWidth=3;ctx.beginPath();ctx.arc(p.x,p.y,r,0,7);ctx.stroke();
   // guias
   ctx.font="900 16px 'Saira Condensed',sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=4;ctx.strokeStyle='rgba(0,0,0,.6)';const t1='ONDE VOCÊ VAI BATER NA BOLA?';ctx.strokeText(t1,W/2,p.y-p.r*1.9);ctx.fillStyle='#ffe23c';ctx.fillText(t1,W/2,p.y-p.r*1.9);
   ctx.font="800 12px 'Saira Condensed',sans-serif";const t2='meio: colocada · em cima: rasteira · embaixo: por cima',t3='bem embaixo: cavadinha · lado: efeito · ponta: trivela';ctx.strokeText(t2,W/2,gy+24);ctx.fillStyle='#fff';ctx.fillText(t2,W/2,gy+24);ctx.strokeText(t3,W/2,gy+42);ctx.fillText(t3,W/2,gy+42)}
  // conduzir: toque no gramado empurra a bola até lá (ou segura, se tocar na própria bola)
  function carryTo(sx,sy){const w=unproj(sx,sy);if(!w)return;const dx=w.x-ball.x,dd=w.d-ball.d,L=Math.hypot(dx,dd);
   if(L<1.1){banner={txt:'DOMINADA',ok:true,t:0,tmp:true};SFX.touch();return}
   const v=Math.sqrt(2*3.2*Math.min(L,7))+.8;ball.vx=dx/L*v;ball.vd=dd/L*v;ball.vh=0;ball.spin=0;owner=null;kicked='touch';kickT=T;tapFx('touch')}
  // passe: toque no companheiro (assistido) ou arrasto até ele (força e espaço à frente)
  function pickMate(sx,sy){let best=null,bd=50*GSC;for(const m of P){if(m.team!=='mate')continue;const q=proj(m.x,m.d,.9);if(!q)continue;const dd=Math.hypot(q.x-sx,q.y-sy);if(dd<bd){bd=dd;best=m}}return best}
  function leadOf(m,t,mul){const tx=m.run?m.run.x:m.x,td=m.run?m.run.d:m.d;const vx=tx-m.x,vd=td-m.d,L=Math.hypot(vx,vd);const s=L>.3?Math.min(m.sp||5,L*4):0;const k=(mul??1)*t*s;const u=L>.3?Math.min(k,L+1.5):0;return{x:m.x+(L?vx/L*u:0),d:m.d+(L?vd/L*u:0)}}
  function passSolve(m,mul){const high=loftSel===2;const tt=L=>high?.55+L/24:Math.max(.35,L/14);let t=tt(dist(m,ball)),tg=leadOf(m,t,mul);for(let i=0;i<3;i++){t=tt(Math.hypot(tg.x-ball.x,tg.d-ball.d));tg=leadOf(m,t,mul)}
   const L=Math.hypot(tg.x-ball.x,tg.d-ball.d)||1;let vx,vd,vh;
   if(high){const th=K==='cross'?1.7:1.05;vh=(th+.5*9.8*t*t)/t;const hs=L/t*1.01;vx=(tg.x-ball.x)/L*hs;vd=(tg.d-ball.d)/L*hs}
   else{const v0=L/t+3.2*t/2;vx=(tg.x-ball.x)/L*v0;vd=(tg.d-ball.d)/L*v0;vh=0}
   return{vx,vd,vh,tg,t}}
  function laneBlocked(m){const ax=ball.x,ad=ball.d,bx=m.x-ax,bd=m.d-ad,L2=bx*bx+bd*bd||1;return P.some(q=>{if(q.team!=='opp')return false;const t=clamp(((q.x-ax)*bx+(q.d-ad)*bd)/L2,0,1);return Math.hypot(ax+bx*t-q.x,ad+bd*t-q.d)<1.3&&t>.15&&t<.92})}
  function passTo(m,g){if(g&&g.lsel!=null)loftSel=g.lsel;else if(!g)loftSel=(K==='cross'||K==='long'||dist(m,ball)>24||laneBlocked(m))?2:0;
   const mul=g?.55+g.power*.9:1;const s0=passSolve(m,mul);let {vx,vd,vh}=s0;
   const sk=clamp(PASK*.75+skill*.25,.1,1);const ct=g?g.contact:1;
   let pw=1;if(g){const id=clamp(Math.hypot(vx,vd)/27,.15,1);pw=1+clamp(g.power-id,-.35,.35)*.5}
   const e=(Math.random()*2-1)*.08*(1-.62*sk)*(1.15-.3*COMP)*(1.35-.55*ct);const c=Math.cos(e),sn=Math.sin(e);[vx,vd]=[(vx*c-vd*sn)*pw,(vx*sn+vd*c)*pw];
   shotInfo={g:g||{power:.6,contact:1,curve:0},k:{err:e,base:.08},pass:true,assist:!g,m,free:!P.some(q=>q.team==='opp'&&dist(q,m)<2.6),x0:ball.x,d0:ball.d,tg:s0.tg,loftSel,press:P.some(q=>q.team==='opp'&&dist(q,ball)<2.4)};
   ball.vx=vx;ball.vd=vd;ball.vh=vh;ball.spin=0;ball.dip=0;ball.ax=0;owner=null;kicked='kick';kickT=T;curl=0;shotLive=false;
   {const defs=P.filter(q=>q.team==='opp'&&!q.wall);if(defs.length){const last=Math.min(...defs.map(q=>q.d));if(m.d<last-.8&&m.d<ball.d-.5)shotInfo.off=true}}
   m.run={x:s0.tg.x,d:s0.tg.d};m.sp=Math.max(m.sp||5,6);{const dx=s0.tg.x-m.x,dd=s0.tg.d-m.d,L=Math.hypot(dx,dd);if(L>.05){const v=Math.min(m.sp,L*4);m.vx=dx/L*v;m.vd=dd/L*v}}
   const sp=simPath({...ball},3);NM.path=sp.p;P.filter(p=>p.team==='mate'&&p!==m).forEach(q=>planRun(q));
   tapFx('kick');NM.passTo=m}
  function assistMate(g){if(!isPassK()&&K!=='finish')return null;let best=null,ba=K==='finish'?.3:.5;for(const m of P){if(m.team!=='mate')continue;const t=leadOf(m,dist(m,ball)/14);const ux=t.x-ball.x,ud=t.d-ball.d,L=Math.hypot(ux,ud)||1;const a=Math.acos(clamp((ux*g.ux+ud*g.ud)/L,-1,1));if(a<ba){ba=a;best=m}}return best}
  function planRun(m){const path=NM.path||[];const hmax=K==='cross'?2.6:1.8;for(const q of path){if(q.h>hmax||q.d>m.d+1.2)continue;const dd=Math.hypot(q.x-m.x,q.d-m.d);if(dd/7<=q.t+.25){m.run={x:q.x,d:q.d};m.sp=7;return}}}
  // ---------- passo da física ----------
  function step(dt){
   T+=dt;
   // goleiro do jogo (eu) — modo defesa
   if(GK)return stepGK(dt);
   // bola
   if(runUp){const r=runUp;const k=clamp((T-r.t0)/.3,0,1);const tx=r.bx-r.g.ux*.38,td=r.bd-r.g.ud*.38+.2;const v=1.25/.3;me.vx=r.g.ux*v;me.vd=r.g.ud*v;me.x+=(tx-me.x)*Math.min(1,dt*12);me.d+=(td-me.d)*Math.min(1,dt*12);ball.x=r.bx;ball.d=r.bd;ball.h=0;if(k>=1){runUp=null;if(r.m)passTo(r.m,r.g);else doShot(r.g,false)}return}
   if(owner){const m=owner;ball.x+=(m.x-ball.x)*Math.min(1,dt*18);ball.d+=(m.d-.5-ball.d)*Math.min(1,dt*18);ball.h=0;ball.vx=ball.vd=ball.vh=0}
   else if(!((K==='fk'||K==='pen')&&!kicked)){
    const pd=ball.d;
    if(ball.h>0||ball.vh>0){ball.vh-=(9.8+(ball.dip||0))*dt}
    if(ball.spin&&!NM.netHit){const sp=ball.spin*(ball.h>0?1:.4);const ox=ball.vx;ball.vx-=sp*ball.vd*dt;ball.vd+=sp*ox*dt;ball.spin*=1-dt*.7}
    if(NM.netHit&&ball.d<.2){ball.vx*=Math.pow(.03,dt);ball.vd*=Math.pow(.004,dt);ball.ax=0;ball.spin=0;if(ball.d<-1.95)ball.d=-1.95}
    ball.x+=ball.vx*dt;ball.d+=ball.vd*dt;ball.h+=ball.vh*dt;
    if(ball.h<0){ball.h=0;ball.dip=0;if(ball.vh<-1.6)ball.vh=-ball.vh*.38;else ball.vh=0}
    if(ball.h===0){const s=sp2();const ns=Math.max(0,s-3.2*dt);if(s>0){ball.vx*=ns/s;ball.vd*=ns/s}}else{ball.vx*=1-.015*dt;ball.vd*=1-.015*dt}
    ball.rot+=sp2()*dt*2;
    if(ball.d<-1.9&&Math.abs(ball.x)<(GW+.09)&&ball.h<2.5){ball.d=-1.9;ball.vd=0;ball.vx*=.3}
    // goleiro adversário: plano de defesa
    if(gk&&kicked!=='loose'&&pd>gk.d&&ball.d<=gk.d&&ball.vd<0){const reach=(gkDive?.72+1.08*kq:.7)*R(.88,1.1);const top=gkDive?2.15:2.5;
     if(Math.abs(ball.x-gk.x)<reach&&ball.h<top+.2){const bs=Math.hypot(ball.vx,ball.vd),edge=Math.abs(ball.x-gk.x)>reach*.55;if(ball.h>top||edge&&ch(.75)||bs>19&&ch(.55)||ch(.18)){if(ch(.3)&&(edge||ball.h>top)){ball.vd=-ball.vd*.35;ball.vx+=Math.sign(ball.x-gk.x)*4;ball.vh=3;return finish(false,'Espalmou pra escanteio!',false,'DEFENDEU!')}ball.d=gk.d+.15;ball.vd=R(5,9);ball.vx=Math.sign(ball.x-gk.x||(ch(.5)?1:-1))*R(1.5,6);ball.vh=R(1.5,3.8);ball.spin=0;ball.dip=0;ball.ax=0;gk.down=.85;gk.dvx=0;if(!gkDive)gkDive=Math.sign(ball.x-gk.x)||1;if(goLoose('gk','REBOTE!'))return;return finish(false,'Espalmou!',false,'DEFENDEU!')}
      ball.vx=ball.vd=0;ball.vh=0;ball.x=gk.x;ball.d=gk.d;ball.h=Math.min(ball.h,1.2);if(gkDive)gk.down=9;return finish(false,'O goleiro segurou.',false,'DEFENDEU!')}}
    // linha do gol
    if(pd>0&&ball.d<=0){const f=pd/(pd-ball.d);const x=ball.x,h=ball.h;
     const post=Math.abs(Math.abs(x)-GW)<.14&&h<2.5,bar=Math.abs(h-GH)<.14&&Math.abs(x)<3.8;
     if(post||bar){if(post&&Math.abs(x)<GW&&ch(.3)){ball.vx=-Math.sign(x)*Math.abs(ball.vx)*.5-Math.sign(x)*2;ball.d=-.1}else if(bar&&h<GH&&ch(.3)){ball.vh=-Math.abs(ball.vh)*.6-2;ball.d=-.1}else{ball.d=.08;ball.vd=Math.abs(ball.vd)*R(.35,.55);if(post)ball.vx=-Math.sign(x)*R(1,4.5)+ball.vx*.25;else{ball.vx*=.5;ball.vh=-Math.abs(ball.vh)*.4-1}ball.spin=0;ball.dip=0;ball.ax=0;if(bar&&h>=GH&&ch(.5))return finish(false,'No travessão!',false,'NA TRAVE!');if(goLoose('post',bar?'TRAVESSÃO!':'NA TRAVE!'))return;return finish(false,bar?'No travessão!':'Na trave!',false,'NA TRAVE!')}}if((post||bar)&&ball.d<=0&&Math.abs(ball.x)<GW&&ball.h<GH){NM.goalX=ball.x;NM.goalH=ball.h;return finish(true,o.okTxt||'Bateu na trave e entrou!',true,'GOOOL!')}
     if(Math.abs(x)<GW&&h<GH){NM.goalX=x;NM.goalH=h;const corner=Math.abs(x)>2.5||h>1.7||(K==='fk'&&Math.hypot(Math.abs(x)-(GW-.61),h-(GH-.39))<.6);if(NM.mateShot||NM.assistMode){NM.mateShot=false;NM.assistMode=false;return finish(true,o.okTxt||'Assistência!',NM.assistFree,'ASSISTÊNCIA!')}return finish(true,o.okTxt||'GOL!',corner,'GOOOL!')}
     return finish(false,h>GH?'Por cima do gol!':'Pra fora!',false,'PRA FORA!')}
    if(Math.abs(ball.x)>34||ball.d>72)return finish(false,'Saiu pela lateral.',false,'PRA FORA!');
   }
   if(gk&&!GK){const gx0=gk.x,gd0=gk.d;stepKeeper(dt);gk.vx=(gk.x-gx0)/Math.max(dt,1e-4);gk.vd=(gk.d-gd0)/Math.max(dt,1e-4)}
   // eu
   if(me){
    let tx=null,td=null,sp=mySp;
    if(kicked==='loose'&&!(me.stun>0)){tx=ball.x+ball.vx*.25;td=ball.d+ball.vd*.25+.35;sp=mySp*1.08}
    else if(K==='header'&&!headed&&me.run){tx=me.run.x;td=me.run.d}
    else if(!owner&&kicked==='touch'&&ball.h<.6){tx=ball.x;td=ball.d+.3}
    else if(me.follow&&T-kickT<1.1){tx=me.follow.x;td=me.follow.d;sp=3.2}
    if(tx!=null){const dx=tx-me.x,dd=td-me.d,L=Math.hypot(dx,dd);const kA=Math.min(1,dt*7);if(L>.05){const v=Math.min(sp,L*6+3);me.vx+=(dx/L*v-me.vx)*kA;me.vd+=(dd/L*v-me.vd)*kA}else{me.vx*=1-kA;me.vd*=1-kA}}else{const kk=owner===me?Math.pow(.3,dt):Math.pow(.02,dt);me.vx*=kk;me.vd*=kk}
    if(me.stun>0)me.stun-=dt;
    me.x+=me.vx*dt;me.d+=me.vd*dt;
    if(!owner&&kicked==='touch'&&T-kickT>.18&&ball.h<.5&&Math.hypot(me.x-ball.x,me.d-.45-ball.d)<.75){owner=me;const wasPass=comboStage===2&&gotT<0;kicked=null;
     if(wasPass){gotT=T;const pr=P.some(q=>q.team==='opp'&&dist(q,me)<2.4);if(pr&&ch(.55*(1-CTRL))){const a=R(-.6,.6);ball.vx=Math.sin(a)*5;ball.vd=-Math.cos(a)*5;owner=null;kicked='touch';kickT=T;banner={txt:'TOQUE LONGO',ok:false,t:0,tmp:true};gotT=-1}else banner={txt:'1º TOQUE',ok:true,t:0,tmp:true}}}
    // cabeçada: bola na janela
    if(K==='header'&&!headed&&NM.autoTap&&hdWin()&&Math.hypot(me.x-ball.x,me.d-ball.d)<.7)headNow();
    if(K==='header'&&!headed&&(ball.d<me.d-3||ball.h===0&&T>.5))return finish(false,hdMiss?'Tocou fora do tempo: a bola passou.':'A bola passou por você.',false,'PASSOU!');
    if(K==='dribble'&&owner===me&&me.d<16.5&&Math.abs(me.x)<20)return finish(true,o.okTxt||'Passou por todos!',me.d<14,'PASSOU!');
   }
   // sobra: quem chegar primeiro fica com a bola
   if(kicked==='loose'&&!ended&&T-loose.t0>.22&&ball.h<1.25){let win=null,wd=1e9;
    for(const p of P){if(p===gk||p.wall||(p.stun>0))continue;const r=p.team==='opp'?.7:.85;const dd=Math.hypot(p.x-ball.x,p.d-.35-ball.d);if(dd<r&&dd<wd){wd=dd;win=p}}
    if(win){loose=null;ball.vx=ball.vd=ball.vh=0;ball.h=0;ball.spin=0;
     if(win===me){owner=me;kicked=null;gotT=T;banner={txt:'SOBRA!',ok:true,t:0,tmp:true};SFX.touch();tmax=Math.max(tmax,T+6)}
     else if(win.team==='mate'){kicked=null;switchTo(win)}
     else{NM.intc=win;win.hl=1;return finish(false,'O zagueiro chegou antes na sobra.',false,'AFASTOU!')}}}
   if(kicked==='loose'&&gk&&!ended&&!(gk.down>0)&&ball.h<2.3&&Math.hypot(gk.x-ball.x,gk.d-ball.d)<1.05)return finish(false,'O goleiro ficou com a sobra.',false,'DEFENDEU!');
   // companheiros
   let lm=null;if(kicked==='loose'){let bd=1e9;for(const p of P)if(p.team==='mate'){const dd=dist(p,ball);if(dd<bd){bd=dd;lm=p}}}
   P.filter(p=>p.team==='mate').forEach(m=>{if(kicked==='loose'){if(m===lm){m.run={x:ball.x+ball.vx*.25,d:ball.d+ball.vd*.25+.3};m.sp=Math.max(m.sp,6.4)}else if(!m.run)m.run={x:m.x*.85,d:Math.max(6,m.d-2)}}if(!m.run&&!m.got&&owner!==m&&K!=='combo')m.run={x:m.x*.92,d:Math.max(9,m.d-4)};if(m.run){const dx=m.run.x-m.x,dd=m.run.d-m.d,L=Math.hypot(dx,dd);const v=Math.min(m.sp,L*4);const kA=Math.min(1,dt*9);if(L>.05){m.vx+=(dx/L*v-m.vx)*kA;m.vd+=(dd/L*v-m.vd)*kA}else{m.vx*=1-kA;m.vd*=1-kA}}m.x+=m.vx*dt;m.d+=m.vd*dt;
    if(!m.got&&kicked&&kicked!=='touch'&&kicked!=='loose'&&((K!=='finish'&&!NM.rebs)||(shotInfo&&shotInfo.pass))&&T-kickT>.15&&ball.h<(K==='cross'?2.7:1.8)&&Math.hypot(m.x-ball.x,m.d-ball.d)<1.5)receive(m)});
   if(retM&&T>=retT){retPass(retM);retM=null}
   if(shootM&&T>=shootT){mateShoot(shootM);shootM=null}
   if(K!=='header'&&kicked&&kicked!=='touch'&&!ended&&T-kickT>.3)P.filter(p=>p.team==='mate').forEach(m=>{if(((T*4)|0)%2===0)planRun(m)});
   // adversários
   let lo=[];if(kicked==='loose'&&T-loose.t0>.28)lo=P.filter(q=>q.team==='opp'&&!q.wall&&q.sp>0).sort((a,b)=>dist(a,ball)-dist(b,ball)).slice(0,2);
   for(const q of P){if(q.team!=='opp')continue;
    if(q.jump>0)q.jump=Math.max(0,q.jump-dt*.9);
    if(q.stun>0){q.stun-=dt;q.x+=q.vx*dt;q.d+=q.vd*dt;q.vx*=.9;q.vd*=.9;continue}
    if(q.sp>0&&!q.wall){let tx,td;
     if(lo.includes(q)){tx=ball.x+ball.vx*.3;td=ball.d+ball.vd*.3}
     else if(q.mark&&!(kicked&&kicked!=='touch'&&dist(q,ball)<7)&&dist(q,ball)>5){tx=q.mark.x+(q.mark===me?0:(ball.x-q.mark.x)*.12)+(q.loose&&q.mark!==me?-Math.sign(q.mark.x||1)*1.7:0);td=q.mark.d-(q.mark===me?.9:(q.loose?.1:1.1))}
     else{tx=ball.x+ball.vx*.25;td=ball.d+ball.vd*.25}
     const dx=tx-q.x,dd=td-q.d,L=Math.hypot(dx,dd);const jock=(owner===me||kicked==='touch')&&L<3.5?.55:1;if(L>.05){const v=Math.min(q.sp*jock,L*5);q.vx+=(dx/L*v-q.vx)*Math.min(1,dt*4);q.vd+=(dd/L*v-q.vd)*Math.min(1,dt*4)}q.x+=q.vx*dt;q.d+=q.vd*dt}
    if(phase!=='play')continue;
    const db=Math.hypot(q.x-ball.x,q.d-ball.d);const fast=sp2()>14;const top=q.wall?1.75+q.jump*.5:(K==='header'?2.3:1.85);
    if((T-kickT>.12||!kicked)&&db<(owner===me?.6:ball.h<.6&&!fast?.7:.5)&&ball.h<top){
     if(q.mark===me&&K==='header'&&!headed)return finish(false,'O zagueiro subiu mais.',false,'CORTOU!');
     if(kicked==='loose')continue;
     if(q.wall){NM.intc=q;q.hl=1;if(ch(.65)){const sp=sp2();const a=R(-1.1,1.1);ball.vx=Math.sin(a)*sp*R(.25,.4);ball.vd=Math.cos(a)*sp*R(.25,.4);ball.vh=R(.5,3);ball.spin=0;ball.dip=0;ball.ax=0;ball.d=q.d+.6;if(goLoose('block','BARREIRA!'))continue}return finish(false,'Bateu na barreira.',false,'BARREIRA!')}
     if((owner===me||kicked==='touch')&&T-gotT<.9)continue;
     if(owner===me||kicked==='touch'){if(ch(.12+dri*.4)){q.stun=.8;q.vx*=-.4;q.vd*=-.4;banner={txt:'PASSOU!',ok:true,t:0,tmp:true};continue}if(ch(.45)){q.stun=.45;const a=R(-1.4,1.4);ball.vx=Math.sin(a)*R(4,7);ball.vd=Math.cos(a)*R(3,6);ball.vh=R(0,1.5);me.stun=.3;if(goLoose('tackle','DIVIDIDA!'))continue}return finish(false,'Desarmado!',false,'DESARMOU!')}
     if(kicked&&kicked!=='touch'&&sp2()>9&&ch(.7)){const sp=sp2();const a=R(-1.3,1.3);ball.vx=Math.sin(a)*sp*R(.25,.45)+ball.vx*.15;ball.vd=Math.cos(a)*sp*R(.2,.4);ball.vh=R(.3,3.2);ball.spin=0;ball.dip=0;ball.ax=0;q.stun=.45;q.vx*=-.3;q.vd*=-.3;if(goLoose('block','DESVIOU!'))continue}
     NM.intc=q;q.hl=1;return finish(false,kicked&&ball.vd<-5&&K!=='pass'&&K!=='long'&&!(shotInfo&&shotInfo.pass)?'Bloqueado!':'Interceptado: a linha de passe estava fechada.',false,fast?'BLOQUEOU!':'CORTOU!')}}
   // bola morreu
   if(kicked==='loose'&&!ended&&T-loose.t0>6)return finish(false,'Ninguém dominou a sobra.',false,'PERDEU!');
   if(kicked&&kicked!=='touch'&&kicked!=='loose'&&ball.h===0&&sp2()<.35&&!ended)return finish(false,K==='pass'||K==='long'||K==='cross'?'Ninguém chegou na bola.':'Fraquinho demais.',false,'ERROU!');
   if(T>tmax&&(!kicked||kicked==='touch'))return finish(false,'Demorou demais!',false,'PERDEU!');
  }
  function stepKeeper(dt){
   const bd=Math.max(.1,ball.d);gk.mvx=gk.mvx||0;gk.mvd=gk.mvd||0;
   const moveTo=(tx,td,vmax,acc)=>{const dx=tx-gk.x,dd=td-gk.d;const wx=clamp(dx*5,-vmax,vmax),wd=clamp(dd*5,-vmax,vmax);const k=Math.min(1,dt*acc);gk.mvx+=(wx-gk.mvx)*k;gk.mvd+=(wd-gk.mvd)*k;gk.x+=gk.mvx*dt;gk.d+=gk.mvd*dt};
   // caído depois do mergulho: levanta
   if(gk.down>0){gk.down-=dt;gk.x+=(gk.dvx||0)*dt;gk.dvx=(gk.dvx||0)*Math.pow(.02,dt);gk.mvx=gk.mvd=0;if(gk.down<=0){gkDive=0;gk.down=0}return}
   if(K==='pen'&&!kicked&&!owner){gk.x=Math.sin(T*2.2)*.25;return}
   if(gk.rush&&!shotLive&&kicked!=='loose'){gk.x+=clamp(ball.x*.35-gk.x,-2*dt,2*dt);return}
   // bola solta na área: o goleiro sai nela
   if(kicked==='loose'){if(ball.d<6.5&&Math.abs(ball.x)<8.5){moveTo(ball.x,Math.max(.3,ball.d),4.8,7);return}}
   if(!shotLive||kicked==='touch'||kicked==='loose'){
    // fica na bissetriz entre as traves e sai do gol conforme a bola se aproxima
    const ang=Math.atan2(ball.x,bd);const out=clamp(.8+(ball.d<15&&K!=='fk'&&K!=='header'?(15-ball.d)*.2:0),.6,3.6);
    const tx=clamp(Math.sin(ang)*out*1.15+ball.x*.04,-GW+.6,GW-.6),td=clamp(Math.cos(ang)*out,.5,4);
    moveTo(tx,td,3.6,6)}
   else{if(gkReact>0){gkReact-=dt;const k=Math.pow(.05,dt);gk.mvx*=k;gk.mvd*=k;return}
    if(K==='pen'&&gk.penT!=null){const v=4.4;gk.x+=clamp(gk.penT-gk.x,-v*dt,v*dt);if(!gkDive)gkDive=Math.sign(gk.penT-gk.x)||(ch(.5)?1:-1);if(Math.abs(gk.penT)<.4)gkDive=0;return}
    if(ball.vd<-.5){const tc=(ball.d-gk.d)/(-ball.vd);const px=ball.x+ball.vx*tc;if(gk.err==null)gk.err=gauss()*.7*(1-kq);const tgt=px+gk.err;
     if(gkDive){gk.x+=clamp(tgt-gk.x,-(2.2+1.8*kq)*dt,(2.2+1.8*kq)*dt);gk.dvx=gkDive*2.2}
     else{moveTo(tgt,gk.d,1+1.8*kq,10);if(tc<.36&&Math.abs(tgt-gk.x)>.45)gkDive=Math.sign(tgt-gk.x)||1}}}
   // sai pra pegar cruzamento
   if((K==='cross'&&kicked||K==='header'&&!headed)&&ball.h>.5&&ball.h<2.8&&Math.hypot(gk.x-ball.x,gk.d-ball.d)<1.2&&!ended)finish(false,'O goleiro saiu e pegou.',false,'GOLEIRO!');
  }
  // ---------- modo goleiro ----------
  let shotAt=null,gkTarget=null,early=false;const shooter=P.find(p=>p.shooter);
  function stepGK(dt){
   if(!shotAt&&gkInfo.antic)gk.x+=clamp(gkInfo.antic*.6-gk.x,-2*dt,2*dt);
   if(!shotAt&&T>NM.gkDelay){shotAt=T;reflexT=.22+.4*clamp((typeof skillOf==='function'?skillOf('REF'):.6)*.7+skill*.3,0,1);const ga=gkInfo.antic;const tx=ga&&ch(.5)?-ga*R(1.6,3.3):(ga?ga*R(1.4,3.3):R(-3.3,3.3)),th=ch(.4)?R(1.4,2.2):R(.15,1.1);const L=Math.hypot(tx-ball.x,ball.d);const sp=(o.pen?R(22,28):R(20,27))*(o.planned?1.05:.92);const t=L/sp;
    ball.vx=(tx-ball.x)/t;ball.vd=-ball.d/t;ball.vh=(th+4.9*t*t)/t;NM.gkShot={tx,th}}
   if(shotAt){const pd=ball.d;ball.vh-=9.8*dt;ball.x+=ball.vx*dt;ball.d+=ball.vd*dt;ball.h+=ball.vh*dt;if(ball.h<0){ball.h=0;ball.vh=-ball.vh*.4}ball.rot+=dt*20;
    if(!gkTarget&&gkInfo.antic){gk.x+=clamp(gkInfo.antic*.6-gk.x,-2*dt,2*dt)}
    if(gkTarget){const v=4+skill*5;const dx=gkTarget.x-gk.x;gk.x+=clamp(dx,-v*dt,v*dt);gk.lift=Math.min(gkTarget.h,(gk.lift||0)+dt*6)}
    if(pd>gk.d&&ball.d<=gk.d){const hx=gk.x,hh=Math.max(1,(gk.lift||0));const reach=(gkTarget?.9+skill*.5:.55)+(gkInfo.antic&&Math.sign(ball.x)===gkInfo.antic&&gkTarget&&Math.sign(gkTarget.x)===gkInfo.antic?.3:0);const dx=Math.abs(ball.x-hx),dh=Math.abs(ball.h-hh);
     if(dx<reach&&(dh<1.1||ball.h<1.3&&(gk.lift||0)<1.2)){ball.vd=-ball.vd*.3;ball.vx=Math.sign(ball.x-hx||1)*5;ball.vh=3;return finish(true,o.okTxt||'DEFENDEU!',dx<reach*.5,'DEFENDEU!')}}
    if(pd>0&&ball.d<=0){if(Math.abs(ball.x)<GW&&ball.h<GH)return finish(false,early?'Pulou antes da hora!':'Foi no canto.',false,'GOL DELES');return finish(false,'Ufa… pra fora',false,'PRA FORA')}}
   if(!shotAt&&gkTarget){early=true;gkInfo.early=true;shotAt=T;ball.vx=0;const tx=gkTarget.x>0?-R(1.5,3.2):R(1.5,3.2);const t=.75;ball.vx=(tx-ball.x)/t;ball.vd=-ball.d/t;ball.vh=(R(.3,1.2)+4.9*t*t)/t}
   if(!shotAt&&T>tmax)finish(false,'Ele chutou e você nem viu',false,'GOL DELES');
  }
  NM.gkDelay=R(.9,1.8);

  // ---------- recepção, assistência e tabela ----------
  let retM=null,retT=0,shootM=null,shootT=0,comboStage=0;
  function receive(m){if(m.got||ended)return;m.got=true;owner=m;kicked=null;ball.vx=ball.vd=ball.vh=0;ball.h=0;ball.ax=0;ball.spin=0;ball.x=m.x;ball.d=m.d-.55;{const q=proj(ball.x,ball.d,0);if(q)burst(q.x,q.y,8,['#ffffff','#8fd3ff'],80,200,2.5)}m.run=null;m.vx*=.2;m.vd*=.2;SFX.touch();tmax=Math.max(tmax,T+6);
   const free=!P.some(q=>q.team==='opp'&&dist(q,m)<2.6);
   if(shotInfo&&shotInfo.off){return finish(false,'Impedido! O bandeirinha levantou a bandeira.',false,'IMPEDIDO!')}
   if(K==='finish'||K==='dribble'||NM.rebs){switchTo(m);return}
   if(K==='combo'&&!comboStage){comboStage=1;banner={txt:'TABELA!',ok:true,t:0,tmp:true};retM=m;retT=T+.35;return}
   if(o.assist){NM.assistMode=true;NM.assistFree=free;switchTo(m);return}
   finish(true,o.okTxt||'Na medida!',free,K==='cross'?'NA CABEÇA!':'NA MEDIDA!')}
  function switchTo(m){const old=me;old.team='mate';old.got=false;old.run={x:clamp(old.x*.7,-20,20),d:Math.max(8,old.d-5)};old.sp=5.5;m.team='me';m.got=false;m.run=null;me=m;owner=me;kicked=null;shotInfo=null;NM.path=null;
   P.forEach(q=>{if(q.team==='opp'&&q.mark===m)q.mark=me});gotT=T;P.forEach(q=>{if(q.team==='opp'&&dist(q,m)<2.2){const dx=q.x-m.x,dd=q.d-m.d,L=Math.hypot(dx,dd)||1;q.stun=.5;q.vx=dx/L*3;q.vd=dd/L*3}});banner={txt:'SUA VEZ!',ok:true,t:0,tmp:true};tmax=Math.max(tmax,T+5);SFX.tone({f:660,dur:.1,gain:.08})}
  function retPass(m){const tx=clamp(me.x+R(-1.2,1.2),-20,20),td=Math.max(12,me.d-6.5);const dx=tx-ball.x,dd=td-ball.d,L=Math.hypot(dx,dd)||1;const v=Math.sqrt(2*3.2*L)+2.5;
   owner=null;ball.vx=dx/L*v;ball.vd=dd/L*v;ball.vh=0;kicked='touch';kickT=T;comboStage=2;SFX.kick(.4);me.run=null}
  function mateShoot(m){const tx=(ch(.5)?1:-1)*R(1.8,3.2),th=K==='cross'?R(.4,1.6):R(.2,1.9);const bx=ball.x,bd=ball.d,h0=K==='cross'?1.8:.11;
   const sp=K==='cross'?R(14,18):R(21,26);const t=Math.hypot(tx-bx,bd)/sp;owner=null;ball.h=h0;ball.vx=(tx-bx)/t;ball.vd=-bd/t;ball.dip=5;ball.vh=(th-h0+.5*14.8*t*t)/t;ball.ax=0;
   kicked='kick';kickT=T;shotLive=true;gkReact=.2+(1-kq)*.25;gk.err=null;gkDive=0;m.jump=K==='cross'?.35:0;SFX.kick(.8);NM.mateShot=true}
  // ---------- falta: mira, força, efeito ----------
  let fkS='aim',fkPw=0,fkCv=0,fkT0=0,fkDrag=false;
  function fkAim0(){return null}
  function fkKick(){const bx=ball.x,bd=ball.d;const pw=fkPw,cv=fkCv;let tx=fkAim.x+gauss()*(1-skill)*.55,th=fkAim.h;
   const dist2=Math.hypot(tx-bx,bd);const speed=19+pw*13;const t=dist2/speed;const pIdeal=clamp(.5+dist2/110,.5,.8);
   th=th+(pw-pIdeal)*7.5+gauss()*(1-skill)*.35;const ax=cv*9*(1+BB*.3);
   ball.vx=(tx-bx)/t;ball.vd=-bd/t;ball.dip=5;ball.vh=(th-.11+.5*14.8*t*t)/t;ball.ax=ax;ball.keepAx=true;
   owner=null;kicked='kick';kickT=T;curl=Math.sign(ax);shotLive=true;gkReact=.4+(1-kq)*.25;gk.err=null;P.forEach(p=>{if(p.wall)p.jump=.45});fkS='go';tapFx('kick');
   NM.fkTarget=fkAim}
  function fkFromScreen(sx,sy){const s=F/Math.max(.5,cam.d);return{x:clamp(cam.x+(sx-W/2)/s,-4.6,4.6),h:clamp(cam.h-(sy-hz)/s,.1,3.3)}}
  function drawFK(){if(K!=='fk'||fkS==='go'||phase!=='play')return;
   if(!fkAim)fkAim={x:(ball.x>0?-1:1)*2.4,h:1.7};
   const a=proj(fkAim.x,0,fkAim.h);if(a){const r=Math.max(10,a.s*.35);ctx.strokeStyle='#ff3b2f';ctx.lineWidth=3;ctx.beginPath();ctx.arc(a.x,a.y,r,0,7);ctx.stroke();ctx.beginPath();ctx.moveTo(a.x-r*1.5,a.y);ctx.lineTo(a.x+r*1.5,a.y);ctx.moveTo(a.x,a.y-r*1.5);ctx.lineTo(a.x,a.y+r*1.5);ctx.stroke();ctx.fillStyle='rgba(255,59,47,.25)';ctx.beginPath();ctx.arc(a.x,a.y,r,0,7);ctx.fill()}
   // alvos bônus nos ângulos
   for(const sx of[-1,1]){const t=proj(sx*(GW-.61),0,(GH-.39));if(t){const rr=Math.max(6,t.s*.32);ctx.strokeStyle='rgba(255,255,255,.85)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(t.x,t.y,rr,0,7);ctx.stroke();ctx.strokeStyle='#f2c443';ctx.beginPath();ctx.arc(t.x,t.y,rr*.55,0,7);ctx.stroke()}}
   const tt=(performance.now()-fkT0)/1000;const spd=1.7-skill*.55-BB*.2;
   if(fkS==='power'){fkPw=(Math.sin(tt*Math.PI*spd-Math.PI/2)+1)/2}
   if(fkS==='curve'){fkCv=Math.sin(tt*Math.PI*spd*1.15)}
   // medidores
   const bx=W-26,by=H*.2,bh=H*.5;ctx.fillStyle='rgba(0,0,0,.5)';roundRect(bx-9,by-4,18,bh+8,9);ctx.fill();
   const gr=ctx.createLinearGradient(0,by+bh,0,by);gr.addColorStop(0,'#7dff9a');gr.addColorStop(.55,'#ffd34a');gr.addColorStop(1,'#ff3b2f');ctx.fillStyle=gr;roundRect(bx-5,by+bh*(1-fkPw),10,bh*fkPw,5);ctx.fill();
   const id=by+bh*(1-clamp(.5+Math.hypot(ball.x,ball.d)/110,.5,.8));ctx.fillStyle='#fff';ctx.fillRect(bx-12,id-1,24,2);
   const cx=W/2,cy=H-34,cw=W*.6;ctx.fillStyle='rgba(0,0,0,.5)';roundRect(cx-cw/2-6,cy-9,cw+12,18,9);ctx.fill();ctx.fillStyle='rgba(255,255,255,.35)';ctx.fillRect(cx-1,cy-9,2,18);
   ctx.fillStyle='#8fd3ff';ctx.beginPath();ctx.arc(cx+fkCv*cw/2,cy,8,0,7);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();
   ctx.font="800 12px 'Saira Condensed',sans-serif";ctx.textAlign='center';ctx.fillStyle='#fff';ctx.fillText('↶ EFEITO ↷',cx,cy-14);
   const msg=fkS==='aim'?'1 · ARRASTE O ALVO NO GOL':fkS==='power'?'2 · TOQUE: FORÇA':'3 · TOQUE: EFEITO';ctx.font="900 15px 'Saira Condensed',sans-serif";const tw=ctx.measureText(msg).width+22;ctx.fillStyle='rgba(0,0,0,.6)';roundRect(W/2-tw/2,44,tw,24,12);ctx.fill();ctx.fillStyle='#f2c443';ctx.textBaseline='middle';ctx.fillText(msg,W/2,57)}
  // ---------- drible sincronizado ----------
  let drbSlow=false,drbPerf=0,drbTot=0;
  const drbAct=()=>P.find(q=>q.drb&&!q.passed&&!q.beat);
  function stepDRB(dt){
   // corre sozinho com a bola rumo à área
   const tv=6+vel*1.4;me.vd+=(-tv-me.vd)*Math.min(1,dt*3);me.vx+=((me.laneX-me.x)*5-me.vx)*Math.min(1,dt*8);me.x+=me.vx*dt;me.d+=me.vd*dt;
   ball.x=me.x+me.vx*.05;ball.d=me.d-.55+Math.sin(T*9)*.12;ball.h=0;ball.rot+=dt*10;owner=me;
   drbSlow=false;
   for(const q of P){if(!q.drb)continue;
    if(q.stun>0){q.stun-=dt;q.x+=q.vx*dt;q.d+=q.vd*dt;q.vx*=.92;q.vd*=.92;if(q.d>me.d+1.5)q.passed=true;continue}
    if(q.beat){q.d+=(-1.5)*dt;continue}
    const dd=me.d-q.d;if(dd<-1.5){q.passed=true;continue}
    // marcador vem de frente acompanhando seu lado
    q.vx+=((me.x-q.x)*2.2-q.vx)*Math.min(1,dt*4);q.x+=q.vx*dt;q.d+=q.sp*dt*.6;
    if(q===drbAct()){if(dd<4.6&&dd>1)drbSlow=true;
     if(dd<1.15){q.beat=true;return finish(false,'Ele tomou a bola. Faltou tempo no drible.',false,'DESARMOU!')}}
   }
   if(me.d<16.5&&Math.abs(me.x)<20&&!drbAct())return finish(true,o.okTxt||'Passou por todos!',drbTot>0&&drbPerf===drbTot,drbPerf===drbTot&&drbTot>0?'PERFEITO!':'PASSOU!');
   if(me.d<14)return finish(true,o.okTxt||'Passou por todos!',false,'PASSOU!');
  }
  function drbSwipe(dir){
   if(phase!=='play')return;const q=drbAct();if(!q)return;const dd=me.d-q.d;
   if(dd>4.6){banner={txt:'AINDA NÃO!',ok:false,t:0,tmp:true};return}
   const good=dir==='up'?q.nut:dir===q.open;
   if(dd>3.3){// cedo demais: ele lê o movimento
    if(ch(.12+dri*.25)){beat(q,dir,false)}else{q.beat=true;finish(false,'Cedo demais: ele leu o drible.',false,'CEDO DEMAIS!')}return}
   if(!good){if(ch(.08+dri*.12)){beat(q,dir,false);return}q.beat=true;finish(false,dir==='up'?'Ele fechou as pernas!':'Foi pro lado fechado.',false,'DESARMOU!');return}
   const perfect=dd>=1.7-BB*.2&&dd<=2.6+BB*.2;beat(q,dir,perfect);
  }
  function beat(q,dir,perfect){drbTot++;if(perfect)drbPerf++;q.passed=false;q.stun=1.2;
   const side=dir==='up'?0:dir;q.vx=-side*3.5;q.vd=2.2;q.fall=perfect?1:0;q.passed=false;q.beatAt=T;
   if(dir!=='up')me.laneX=clamp(me.x+side*1.8,-18,18);else{ball.h=.2}
   q.drb=true;q.passedMark=true;q.passed=false;q.beatFlag=true;q.stunned=true;q.done=true;
   banner={txt:dir==='up'?'CANETA!':perfect?'PERFEITO!':'PASSOU!',ok:true,t:0,tmp:true};SFX.touch();if(perfect||dir==='up'){SFX.tone({f:880,dur:.12,gain:.1});shake(3,.2)}
   const bp=proj(ball.x,ball.d,0);if(bp)burst(bp.x,bp.y,8,['#3d8a35','#9ad07a'],70,240,2);
   q.passed=true;
  }
  function drawDRB(){const q=drbAct();if(!q||phase!=='play')return;const dd=me.d-q.d;if(dd>7)return;
   const fp=proj(q.x,q.d,0);if(!fp)return;
   // anel de tempo: fecha conforme ele chega
   const k=clamp((dd-1.2)/(4.6-1.2),0,1);const rOut=.55+k*1.6,rGold=.55+((2.15-1.2)/(4.6-1.2))*1.6;const inWin=dd<=3.3&&dd>=1.2,perf=dd>=1.7&&dd<=2.6;
   ring(q.x,q.d,rGold,'rgba(242,196,67,.9)',3);ring(q.x,q.d,rOut,perf?'#f2c443':inWin?'#ffffff':'rgba(255,255,255,.45)',perf?5:3);
   if(perf)glow(fp.x,fp.y,fp.s*1.4,'rgba(242,196,67,.25)');
   // lado livre (seta verde) e lado fechado (bloqueio)
   const ar=(sx,col,up)=>{const a=proj(q.x+sx,q.d+.3,0),b=proj(q.x+sx*(up?0:2.6),q.d-(up?1.8:.5),0);if(!a||!b)return;ctx.strokeStyle=col;ctx.lineWidth=Math.max(5,a.s*.2);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();const ang=Math.atan2(b.y-a.y,b.x-a.x),hl=Math.max(12,a.s*.5);ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(b.x+Math.cos(ang)*hl*.6,b.y+Math.sin(ang)*hl*.6);ctx.lineTo(b.x+Math.cos(ang+2.4)*hl,b.y+Math.sin(ang+2.4)*hl);ctx.lineTo(b.x+Math.cos(ang-2.4)*hl,b.y+Math.sin(ang-2.4)*hl);ctx.closePath();ctx.fill()};
   ar(q.open*1.1,'rgba(110,255,150,.95)',false);
   const bx=proj(q.x-q.open*.75,q.d,0),by=proj(q.x-q.open*.75,q.d,.9);if(bx&&by){ctx.strokeStyle='rgba(255,80,70,.9)';ctx.lineWidth=Math.max(3,bx.s*.1);ctx.beginPath();ctx.moveTo(bx.x,bx.y);ctx.lineTo(by.x,by.y);ctx.stroke()}
   if(q.nut)ar(0,'rgba(120,200,255,.95)',true);
   if(inWin){const tp=proj(q.x,q.d,2.6);if(tp){ctx.font="900 16px 'Saira Condensed',sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';const lb=perf?'AGORA!':'ARRASTE!';const tw=ctx.measureText(lb).width+16;ctx.fillStyle='rgba(0,0,0,.6)';roundRect(tp.x-tw/2,tp.y-11,tw,22,11);ctx.fill();ctx.fillStyle=perf?'#f2c443':'#fff';ctx.fillText(lb,tp.x,tp.y+1)}}
  }
  // ---------- ambiente e visual ----------
  const PRISON=/Pátio|prisão/i.test(o.comp||'');const TRAIN=PRISON||/Treino|Peneira|Pré|Tutorial|Pelada/i.test(o.comp||'');
  const NIGHT=!TRAIN&&(NM.night=ch(.25));
  const SKINS=['#f1c9a5','#e3b088','#c68a5e','#a86f45','#8a5536','#5e3a24'];
  const HAIRC=['#1b120c','#2d1c10','#4a2f1a','#6e4a2a','#c9a066','#0d0d0d'];
  const STY=['buzz','quiff','afro','long','buzz','quiff'];
  P.forEach((p,i)=>{const h=(i*2654435761)>>>0;p.skin=SKINS[h%SKINS.length];p.hairC=HAIRC[(h>>>3)%HAIRC.length];p.hs=STY[(h>>>6)%STY.length];p.num=p.team==='me'?(S.num||9):[4,5,6,7,8,10,11,14,17,20,23][(h>>>9)%11];p.boot=['#111','#e8e8e8','#ff5a1f','#1e90ff','#ffd400'][(h>>>12)%5]});
  if(PRISON)P.forEach(p=>{if(p.team==='me'||p.team==='mate'){p.c='#ff7a1a';p.c2='#1a1a1a'}else if(p.team==='opp'){p.c='#d9d4c7';p.c2='#3a3a3a'}});
  const myLook=(typeof FACES!=='undefined'&&S.face&&!S.face.photo)?FACES[S.face.preset||0]:null;
  const meP=me||(GK?gk:null);if(meP&&myLook){meP.skin=myLook.skin;meP.hairC=myLook.hair;meP.hs=myLook.style;meP.band=myLook.band;meP.beard=myLook.beard}
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
   if(strike&&p===me)return;
   const isGK=p.team==='gk'||p.isGK;const facing=p.isGK?false:(p.team==='opp'||p.team==='gk')?(GK?true:cam.dir>0):(cam.dir<0);
   const lift=(p.jump>0?Math.sin(p.jump/.45*Math.PI)*.5:0)+(p.lift&&p.isGK?Math.max(0,p.lift-1.2)*.6:0);
   const pr=proj(p.x,p.d,0);if(!pr||pr.s<1.2)return;if(pr.s>F*cam.z/(strike?2.6:3.2))return;
   const v=Math.hypot(p.vx,p.vd);p.ph+=v*.09;const amt=Math.min(1,v/3);
   let a=0;if(isGK&&p===gk&&gkDive&&!GK)a=-gkDive*1.15;if(GK&&p===gk&&gkTarget)a=-clamp((gkTarget.x-p.x)*.4,-1.3,1.3)*(gkTarget.h<1.4?1:.6);if(p.drb&&p.stun>0)a=-(p.vx>0?1:-1)*Math.min(1.35,(1.2-p.stun)*2.4)*(p.fall?1:.45);
   const ca=Math.cos(a),sa=Math.sin(a),SC=1.55;const bobH=Math.abs(Math.sin(p.ph))*.07*amt;const T=(x,d,h)=>{const dx=(x-p.x)*SC,hh=h*SC;return[p.x+dx*ca-hh*sa,p.d+(d-p.d)*SC,dx*sa+hh*ca+lift+bobH]};
   const kicking=p===me&&kicked&&kicked!=='touch'&&kicked!=='header'&&T-kickT<.4;
   const skin=p.skin||'#e3b088',hair=p.hairC||'#2a1a10',shirt=p.c,c2=p.c2,shorts=isGK?'#1a1a1a':(p.team==='opp'?p.c2:'#f4f4f4'),sock=isGK?'#1a1a1a':shirt,boot=p.boot||'#111';
   const sw=Math.sin(p.ph)*amt*.17,up=isGK&&(gkDive||gkTarget)?1:0;
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
   vbox(T,p.x,p.d,1.57,hw,st==='afro'?.64:.56,hh,hair);
   if(st==='quiff'&&!facing)vbox(T,p.x,p.d-.14*cam.dir,1.66,.36,.18,.11,hair);
   if(!facing){vbox(T,p.x,p.d+.275*cam.dir,st==='long'?.85:1.17,hw,.03,st==='long'?.72:.4,hair)}
   else if(hq&&pr.s>7){const e1=onQuad(hq,.3,.55),e2=onQuad(hq,.7,.55);const es=Math.max(1.5,Math.abs(hq[1].x-hq[0].x)*.1);ctx.fillStyle='#161616';ctx.fillRect(e1.x-es/2,e1.y-es,es,es*1.5);ctx.fillRect(e2.x-es/2,e2.y-es,es,es*1.5);
    vbox(T,p.x,p.d-.28*cam.dir,1.47,hw,.03,.1,hair);if(p.beard){const b=onQuad(hq,.5,.12);ctx.fillStyle=hair;ctx.fillRect(b.x-es*2,b.y-es,es*4,es*1.6)}}
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
  function shotType(g){const ls=g.lsel!=null?g.lsel:loftSel;
   if(K==='fk')return ls===2?'FOLHA SECA':ls===0?'RASTEIRA':'POR CIMA DA BARREIRA';
   if(isPassK())return ls===2?'PASSE ALTO':'PASSE RASTEIRO';
   if(g.chip)return'CAVADINHA';if(ls===0)return'RASTEIRO';if(Math.abs(g.curve)>.3)return'CURVADO';if(g.loft>.24)return'FORTE E ALTO';if(g.power>.7)return'FORTE';return'MEIA ALTURA'}
  let AL='t';
  function drawAim(){const GL=AL==='g';
   // zona de toque contextual em volta da bola
   if(GL&&canAim()&&!aim&&!GK&&K!=='dribble'&&K!=='header'){const pz=proj(ball.x,ball.d,0);if(pz){const r=Math.max(16,pz.s*.75)*(1+.08*Math.sin(performance.now()/180));ctx.strokeStyle=T-gotT<2?'rgba(242,196,67,.9)':'rgba(255,255,255,.55)';ctx.lineWidth=2;ctx.setLineDash([4,5]);ctx.beginPath();ctx.ellipse(pz.x,pz.y,r,r*.45,0,0,7);ctx.stroke();ctx.setLineDash([]);
     if(T-gotT<2){ctx.font="800 11px 'Saira Condensed',sans-serif";ctx.textAlign='center';ctx.fillStyle='#f2c443';ctx.fillText('1º TOQUE: ARRASTE OU TOQUE',pz.x,pz.y+r*.45+12)}}
    if(isPassK())P.forEach(m=>{if(m.team!=='mate')return;const q=proj(m.x,m.d,0);if(!q)return;const r=Math.max(12,q.s*.6)*(1+.1*Math.sin(performance.now()/160+m.ph));ctx.strokeStyle='rgba(120,200,255,.95)';ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(q.x,q.y,r,r*.45,0,0,7);ctx.stroke();
     const free=!P.some(z=>z.team==='opp'&&dist(z,m)<2.6);const tp=proj(m.x,m.d,2.5);if(tp){ctx.font="900 11px 'Saira Condensed',sans-serif";ctx.textAlign='center';const lb=free?'LIVRE':'MARCADO';const tw=ctx.measureText(lb).width+10;ctx.fillStyle=free?'rgba(30,140,70,.85)':'rgba(170,40,30,.85)';roundRect(tp.x-tw/2,tp.y-9,tw,16,8);ctx.fill();ctx.fillStyle='#fff';ctx.textBaseline='middle';ctx.fillText(lb,tp.x,tp.y)}})}
   // cabeçada: mira guardada + anel de tempo
   if(!GL&&K==='header'&&!headed&&phase==='play'){const g=lastAim;if(g){const k=createShot(g,true,false);const gc=goalCross({x:me.x,d:me.d-.2,h:1.7,vx:k.vx,vd:k.vd,vh:k.vh,spin:k.spin});if(gc.q){const t=proj(gc.q.x,0,gc.q.h);if(t)target(t,Math.max(8,t.s*.3),'#ffd21f')}}
    const dd=Math.hypot(me.x-ball.x,me.d-ball.d);const pm=proj(me.x,me.d,0);if(pm&&ball.h>.3){const k=clamp((dd-.4)/5,0,1);const inW=hdWin();ring(me.x,me.d,.55,'rgba(242,196,67,.9)',3);ring(me.x,me.d,.55+k*2.2,inW?'#f2c443':'rgba(255,255,255,.6)',inW?5:3);
     if(inW){const tp=proj(me.x,me.d,2.7);if(tp){ctx.font="900 16px 'Saira Condensed',sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';const tw=ctx.measureText('TOQUE!').width+16;ctx.fillStyle='rgba(0,0,0,.6)';roundRect(tp.x-tw/2,tp.y-11,tw,22,11);ctx.fill();ctx.fillStyle='#f2c443';ctx.fillText('TOQUE!',tp.x,tp.y+1)}}}}
   if(!aim||aim.len<8)return;
   if(GK){if(GL)return;ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=3;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(aim.sx,aim.sy);ctx.lineTo(aim.cx,aim.cy);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#ffd21f';ctx.beginPath();ctx.arc(aim.cx,aim.cy,12,0,7);ctx.fill();return}
   // traço do dedo
   const pth=aim.path||[];if(!GL&&pth.length>1){ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=6;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();pth.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.stroke()}
   const g=readShotGesture(aim);if(!g)return;
   const hd=K==='header'&&!headed;
   let mate=null;if((isPassK()||K==='finish')&&!hd){mate=assistMate(g)}
   if(mate){const t=leadOf(mate,dist(mate,ball)/14);const ux=t.x-ball.x,ud=t.d-ball.d,L=Math.hypot(ux,ud)||1;g.ux=ux/L;g.ud=ud/L;if(!isPassK())g.passHint=true}
   let k,b0;
   if(mate){loftSel=g.lsel;const s=passSolve(mate,.55+g.power*.9);k={vx:s.vx,vd:s.vd,vh:s.vh,spin:0,dip:0,err:0};const q=proj(mate.x,mate.d,0);if(q&&!GL){const pu=.85+.15*Math.sin(performance.now()/120);ctx.strokeStyle='#8fd3ff';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(q.x,q.y,Math.max(16,q.s*.8*pu),Math.max(7,q.s*.34*pu),0,0,7);ctx.stroke();const tq=proj(mate.x,mate.d,3.1);if(tq){ctx.font="900 15px 'Saira Condensed',sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';const tw=ctx.measureText('PASSE').width+16;ctx.fillStyle='rgba(10,40,70,.8)';roundRect(tq.x-tw/2,tq.y-11,tw,22,11);ctx.fill();ctx.fillStyle='#8fd3ff';ctx.fillText('PASSE',tq.x,tq.y+1)}}}
   else k=createShot(g,hd,false);
   b0={x:hd?me.x:ball.x,d:hd?me.d-.2:ball.d,h:hd?1.7:ball.h,vx:k.vx,vd:k.vd,vh:k.vh,spin:k.spin,dip:k.dip};
   const sp=simPath(b0,2.2).p;let endI=sp.length-1;for(let i=0;i<sp.length;i++){if(sp[i].d<=0){endI=i;break}}
   // elástico do dedo até a bola
   const bp=proj(b0.x,b0.d,hd?1.7:0);
   if(!strike&&!GL&&bp){ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=2.5;ctx.setLineDash([4,6]);ctx.beginPath();ctx.moveTo(aim.cx,aim.cy);ctx.lineTo(bp.x,bp.y);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='rgba(255,255,255,.9)';ctx.beginPath();ctx.arc(aim.cx,aim.cy,8,0,7);ctx.fill()}
   // seta no gramado seguindo a trajetória (curva junto com o efeito)
   const Lm=(hd?2:1.6)+g.power*(isPassK()?9.5:7.5);const pts=[{x:b0.x,d:b0.d}];let acc=0;
   pts[0].h=0;{const n0=Math.ceil(Lm/.5);for(let i=1;i<=n0;i++){const t=Math.min(Lm,i*.5);pts.push({x:b0.x+g.ux*t,d:b0.d+g.ud*t,h:0})}}
   {let c0=0,i0=0;for(let i=1;i<pts.length;i++){c0+=Math.hypot(pts[i].x-pts[i-1].x,pts[i].d-pts[i-1].d);if(c0>=.5){i0=i;break}}if(pts.length-i0>=3)pts.splice(0,i0)}
   if(!strike&&pts.length>=3){const n=pts.length,hw0=.36,hw1=.5,hh=.95,hl=1.55;
    const dirAt=i=>{const a=pts[Math.max(0,i-1)],b=pts[Math.min(n-1,i+1)];const dx=b.x-a.x,dd=b.d-a.d,L=Math.hypot(dx,dd)||1;return[dx/L,dd/L]};
    let cut2=n-1,rest=hl;while(cut2>1){const st=Math.hypot(pts[cut2].x-pts[cut2-1].x,pts[cut2].d-pts[cut2-1].d);if(rest<=st)break;rest-=st;cut2--}
    const Ls=[],Rs=[];for(let i=0;i<=cut2;i++){const[ux,ud]=dirAt(i);const w=hw0+(hw1-hw0)*i/Math.max(1,cut2);Ls.push([pts[i].x-ud*w,pts[i].d+ux*w,pts[i].h||0]);Rs.push([pts[i].x+ud*w,pts[i].d-ux*w,pts[i].h||0])}
    const[ux,ud]=dirAt(n-1);const bx=pts[cut2].x,bd=pts[cut2].d,tx=pts[n-1].x+ux*.15,td=pts[n-1].d+ud*.15;
    const bh=pts[cut2].h||0,th=pts[n-1].h||0;const poly=[...Ls,[bx-ud*hh,bd+ux*hh,bh],[tx,td,th],[bx+ud*hh,bd-ux*hh,bh],...Rs.reverse()];
    const draw=(h,col,stroke)=>{const q=poly.map(([x,d,hh2])=>proj(x,d,h<0?0:h+(hh2||0),.4));if(q.some(v=>!v))return false;ctx.beginPath();q.forEach((v,i)=>i?ctx.lineTo(v.x,v.y):ctx.moveTo(v.x,v.y));ctx.closePath();if(col){ctx.fillStyle=col;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=3.5;ctx.lineJoin='round';ctx.stroke()}return true};
    const t0=proj(b0.x,b0.d,0),t1=proj(tx,td,0);
    if(GL){draw(-1,'rgba(0,0,0,.22)');
}
    else if(t0&&t1){const hot=g.power>.88;
     ctx.save();ctx.translate(0,Math.max(3,(t0.s||20)*.06));draw(.06,hot?'#b8461c':'#c48a00');ctx.restore();
     const gr=ctx.createLinearGradient(t0.x,t0.y,t1.x,t1.y);gr.addColorStop(0,hot?'#ffb36b':'#ffe766');gr.addColorStop(1,hot?'#ff5a2a':'#ffc61a');draw(.06,gr,'rgba(90,50,0,.85)');
     const tp=proj(tx,td,(th||0)+.6);if(tp){ctx.font="900 22px 'Saira Condensed',sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=5;ctx.strokeStyle='rgba(0,0,0,.6)';const lb=Math.round(g.power*100)+'%';ctx.strokeText(lb,tp.x,tp.y-6);ctx.fillStyle='#fff';ctx.fillText(lb,tp.x,tp.y-6)}}
   }
   if(GL)return;
   if(strike){const bp2=proj(b0.x,b0.d,b0.h+.11);
    for(let i=3;i<=endI;i+=2){const q=sp[i];const a=proj(q.x,q.d,q.h+.11,.6);if(!a)continue;const rr=Math.max(2,Math.min(6,a.s*.05));ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.arc(a.x,a.y+1,rr+1.3,0,7);ctx.fill();ctx.fillStyle=i/endI<.5?'#fff6c0':'#ffe23c';ctx.beginPath();ctx.arc(a.x,a.y,rr,0,7);ctx.fill()}
    const e2=sp[endI];if(e2){const onG=e2.d<=.05;const t=proj(e2.x,onG?0:e2.d,onG?e2.h:0);if(t){const inG=Math.abs(e2.x)<GW&&e2.h<GH;target(t,Math.max(9,t.s*.25),isPassK()?'#8fd3ff':inG?'#ffd21f':'#ff5a4a')}}
    if(bp2){const r=.11*bp2.s*1.32;ctx.strokeStyle='rgba(255,255,255,.65)';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(bp2.x,bp2.y);ctx.lineTo(aim.cx,aim.cy);ctx.stroke();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(aim.cx,aim.cy,9,0,7);ctx.fill();
     ctx.lineWidth=7;ctx.strokeStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.arc(bp2.x,bp2.y,r,0,7);ctx.stroke();ctx.strokeStyle=g.power>.86?'#ff5a2a':g.power>.6?'#ffd21f':'#7dff9a';ctx.lineCap='round';ctx.beginPath();ctx.arc(bp2.x,bp2.y,r,-Math.PI/2,-Math.PI/2+g.power*Math.PI*2);ctx.stroke()}}
   // alvo discreto na boca do gol
   const end=sp[endI];if(true){}else if(end&&!isPassK()&&end.d<=0.05){const t=proj(end.x,0,end.h);if(t){const inG=Math.abs(end.x)<GW&&end.h<GH;target(t,Math.max(7,t.s*.22),inG?'#ffd21f':'#ff5a4a')}}
   else if(end&&mate){const t=proj(end.x,end.d,0);if(t)target(t,Math.max(7,t.s*.35),'#8fd3ff')}
   // tipo do chute, pequeno, perto do dedo
   if(false){const lb=hd?'CABEÇADA':shotType(g);ctx.font="800 12px 'Saira Condensed',sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineWidth=3;ctx.strokeStyle='rgba(0,0,0,.6)';const ly=clamp(aim.cy+30,20,H-14);ctx.strokeText(lb,aim.cx,ly);ctx.fillStyle=g.power>.88?'#ffb36b':'#fff6c0';ctx.fillText(lb,aim.cx,ly);
    if(g.power>.97){ctx.font='16px sans-serif';ctx.fillText('⚡',aim.cx+ctx.measureText(lb).width/2+14,ly)}}
  }
  function target(t,r,c){ctx.strokeStyle='rgba(0,0,0,.55)';ctx.lineWidth=5;ctx.beginPath();ctx.arc(t.x,t.y,r,0,7);ctx.stroke();ctx.strokeStyle=c;ctx.lineWidth=3;ctx.beginPath();ctx.arc(t.x,t.y,r,0,7);ctx.stroke();ctx.beginPath();ctx.moveTo(t.x-r*1.5,t.y);ctx.lineTo(t.x-r*.5,t.y);ctx.moveTo(t.x+r*.5,t.y);ctx.lineTo(t.x+r*1.5,t.y);ctx.moveTo(t.x,t.y-r*1.5);ctx.lineTo(t.x,t.y-r*.5);ctx.moveTo(t.x,t.y+r*.5);ctx.lineTo(t.x,t.y+r*1.5);ctx.stroke()}
  function drawGrade(){if(!ended||NM.grade==null||ended.t<.35)return;const a=clamp((ended.t-.35)*4,0,1);ctx.save();ctx.globalAlpha=a;
   const y=H*.38+Math.min(70,W*.17)*.75;const st=TRAIN&&ended.ok?' '+'★'.repeat(NM.stars)+'☆'.repeat(3-NM.stars):'';const lb=`NOTA ${NM.grade}${st}`;
   ctx.font="900 17px 'Saira Condensed',sans-serif";const tw=ctx.measureText(lb).width+22;ctx.fillStyle='rgba(0,0,0,.7)';roundRect(W/2-tw/2,y-13,tw,26,13);ctx.fill();ctx.fillStyle=NM.grade>=75?'#7dff9a':NM.grade>=50?'#ffe23c':'#ff8a7a';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(lb,W/2,y+1);
   if(NM.why){ctx.font="700 12px 'Saira Condensed',sans-serif";const w2=Math.min(W-20,ctx.measureText(NM.why).width+18);ctx.fillStyle='rgba(0,0,0,.6)';roundRect(W/2-w2/2,y+17,w2,20,10);ctx.fill();ctx.fillStyle='#fff';ctx.fillText(NM.why,W/2,y+27,W-30)}
   // linha de passe + quem cortou
   if(NM.intc&&shotInfo){const a0=proj(shotInfo.x0,shotInfo.d0,0),tg=shotInfo.tg||{x:shotInfo.x0+(NM.intc.x-shotInfo.x0)*1.6,d:shotInfo.d0+(NM.intc.d-shotInfo.d0)*1.6},a1=proj(tg.x,tg.d,0);if(a0&&a1){ctx.setLineDash([7,6]);ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(a0.x,a0.y);ctx.lineTo(a1.x,a1.y);ctx.stroke();ctx.setLineDash([])}
    const q=proj(NM.intc.x,NM.intc.d,0);if(q){ctx.strokeStyle='#ff3b2f';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(q.x,q.y,Math.max(14,q.s*.75),Math.max(6,q.s*.33),0,0,7);ctx.stroke();const tp=proj(NM.intc.x,NM.intc.d,2.6);if(tp){ctx.fillStyle='#ff3b2f';ctx.font="900 20px 'Saira Condensed',sans-serif";ctx.fillText('!',tp.x,tp.y)}}}
   ctx.restore()}
  function roundRect(x,y,w,h,r){r=Math.min(r,w/2,Math.max(0,h)/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
  function star(cx,cy,r,fill){ctx.beginPath();for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;ctx.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr)}ctx.closePath();ctx.fillStyle=fill?'#f2c443':'rgba(255,255,255,.18)';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=1.5;ctx.stroke()}
  function drawHUD(){
   // placa de tempo (anel)
   if(!GK&&K!=='dribble'&&phase!=='intro'&&(!kicked||kicked==='touch')&&!ended){const left=clamp(1-T/tmax,0,1);const cx=W-24,cy=24;ctx.fillStyle='rgba(0,0,0,.5)';ctx.beginPath();ctx.arc(cx,cy,15,0,7);ctx.fill();ctx.strokeStyle=left<.3?'#ff5a4a':'#f2c443';ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy,12,-Math.PI/2,-Math.PI/2+left*Math.PI*2);ctx.stroke();ctx.fillStyle='#fff';ctx.font="800 11px 'Saira Condensed',sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(Math.ceil(tmax-T),cx,cy+1)}
   // etiqueta do lance
   if(phase!=='intro'){ctx.font="800 12px 'Saira Condensed',sans-serif";const lbl=(o.min!=null?o.min+"' · ":'')+tag.toUpperCase();const tw=ctx.measureText(lbl).width+18;ctx.fillStyle='rgba(0,0,0,.5)';roundRect(10,12,tw,22,11);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(lbl,19,23.5)}
   if(curl&&kicked&&kicked!=='touch'&&T-kickT<1.4){ctx.fillStyle='rgba(0,0,0,.5)';roundRect(W/2-50,44,100,22,11);ctx.fill();ctx.fillStyle='#ffd34a';ctx.font="800 13px 'Saira Condensed',sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(curl>0?'EFEITO ↷':'↶ EFEITO',W/2,55)}
   if(banner&&banner.tmp&&banner.t>.7)banner=null;
   if(banner){banner.t+=1/60;const k=Math.min(1,banner.t*5);const sc=.5+.5*(1-Math.pow(1-k,3))+(banner.t<.3?Math.sin(banner.t*30)*.06:0);
    ctx.save();ctx.translate(W/2,banner.tmp?H*.17:H*.38);ctx.rotate(-.05);ctx.scale(sc,sc);ctx.font=`900 ${banner.tmp?Math.min(40,W*.1):Math.min(70,W*.17)}px 'Saira Condensed',sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
    if(banner.ok){ctx.shadowColor='rgba(242,196,67,.8)';ctx.shadowBlur=24}
    ctx.lineWidth=10;ctx.strokeStyle='rgba(0,0,0,.6)';ctx.strokeText(banner.txt,0,0);ctx.shadowBlur=0;
    const fg=ctx.createLinearGradient(0,-30,0,30);if(banner.ok){fg.addColorStop(0,'#fff4c4');fg.addColorStop(1,'#f2a91a')}else{fg.addColorStop(0,'#ffffff');fg.addColorStop(1,'#c9d2dc')}ctx.fillStyle=fg;ctx.fillText(banner.txt,0,0);ctx.restore();
    if(ended&&!banner.tmp&&banner.t>.25){const n=ended.ok?(ended.perfect?3:2):(/TRAVE|DEFENDEU|CORTOU|BARREIRA/.test(banner.txt)?1:0);for(let i=0;i<3;i++){const t=clamp((banner.t-.3-i*.12)*6,0,1);if(t>0){ctx.save();ctx.translate(W/2+(i-1)*34,H*.38+52);ctx.scale(t,t);star(0,0,13,i<n);ctx.restore()}}}}
   if(phase==='intro'){const k=Math.min(1,tIntro/.85);const bh=H*.09*(1-k*.6);ctx.fillStyle='#000';ctx.fillRect(0,0,W,bh);ctx.fillRect(0,H-bh,W,bh);
    const sx=-W*.6+W*.6*Math.min(1,k*2.2);ctx.fillStyle='rgba(0,0,0,.55)';ctx.fillRect(sx,H*.36,W,H*.12);ctx.fillStyle='#ff7a2b';ctx.fillRect(sx,H*.36,6,H*.12);ctx.fillStyle='#fff';ctx.font=`900 ${Math.min(40,W*.105)}px 'Saira Condensed',sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(GK?'ATENÇÃO, GOLEIRO!':tag.toUpperCase()+'!',W/2+sx,H*.42)}
   if(phase==='play'&&K!=='dribble'&&!aim&&!kicked&&T<2.4&&!(S.tips&&S.tips.nssm>2)){const t=(performance.now()/900)%1;const bp=GK?proj(gk.x,gk.d,1):proj(ball.x,ball.d,0);if(bp){const y0=bp.y-6,y1=bp.y+(GK?-40:-80);const yy=y0+(y1-y0)*Math.min(1,t*1.4);ctx.globalAlpha=1-t;ctx.font='30px sans-serif';ctx.textAlign='center';ctx.fillText('👆',bp.x+(GK?t*50:0),yy);ctx.globalAlpha=1}}
   if(BOOT&&phase!=='intro'&&!ended){ctx.font="800 11px 'Saira Condensed',sans-serif";const bl='👟 '+BOOT.n;const bw=ctx.measureText(bl).width+16;ctx.fillStyle='rgba(0,0,0,.5)';roundRect(10,H-30,bw,20,10);ctx.fill();ctx.fillStyle='#f2c443';ctx.textAlign='left';ctx.textBaseline='middle';ctx.fillText(bl,18,H-19.5)}
   if(flashT>0){ctx.fillStyle=`rgba(255,255,255,${flashT})`;ctx.fillRect(0,0,W,H);flashT=Math.max(0,flashT-.03)}
  }
  function drawParts(dt){for(let i=parts.length-1;i>=0;i--){const q=parts[i];q.vy+=q.g*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.life-=q.dec*dt;q.rot+=dt*8;if(q.life<=0){parts.splice(i,1);continue}ctx.save();ctx.globalAlpha=Math.min(1,q.life*1.5);ctx.translate(q.x,q.y);ctx.rotate(q.rot);ctx.fillStyle=q.c;ctx.fillRect(-q.s/2,-q.s/4,q.s,q.s/2);ctx.restore()}}
  function vignette(){const g=ctx.createRadialGradient(W/2,H*.55,Math.min(W,H)*.35,W/2,H*.55,Math.max(W,H)*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,NIGHT?'rgba(0,0,10,.5)':'rgba(0,0,0,.3)');ctx.fillStyle=g;ctx.fillRect(0,0,W,H)}
  function render(rdt){
   ctx.save();if(shakeT>0){const a=shakeA*shakeT*2;ctx.translate((Math.random()-.5)*a,(Math.random()-.5)*a);shakeT=Math.max(0,shakeT-rdt)}
   ctx.clearRect(-20,-20,W+40,H+40);drawField();
   if(NM.netHit)NM.netHit.t+=rdt;
   if(cam.dir>0){drawNet();if(ball.d<0)drawBall();drawPosts()}
   if(me&&!GK&&!strike){const sp0=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,rr=i%2?.26:.62;sp0.push(proj(me.x+Math.cos(a)*rr,me.d+Math.sin(a)*rr*.95,.01))}if(sp0.every(Boolean)){ctx.fillStyle='rgba(0,0,0,.25)';ctx.beginPath();sp0.forEach((q,i)=>i?ctx.lineTo(q.x+1,q.y+2):ctx.moveTo(q.x+1,q.y+2));ctx.closePath();ctx.fill();ctx.fillStyle='#ffd21f';ctx.beginPath();sp0.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y));ctx.closePath();ctx.fill()}}
   P.filter(p=>p.team==='mate').forEach(m=>ring(m.x,m.d,.6,'rgba(120,220,255,.95)',2.5,!kicked));
   if(K==='header'&&NM.cross&&!headed)ring(NM.cross.tx,NM.cross.td,.5,'rgba(255,255,255,.55)',2,true);
   P.forEach(p=>{if(!(strike&&p===me))shadow(p.x,p.d,.32,.32)});shadow(ball.x,ball.d,.22,clamp(.45-ball.h*.08,.1,.45));
   if(phase==='play'){AL='g';drawAim()}
   const ents=P.map(p=>({d:p.d,f:()=>drawPlayer(p)}));if(!(cam.dir>0&&ball.d<0))ents.push({d:ball.d-.01,f:drawBall});
   ents.sort((a,b)=>(b.d-a.d)*cam.dir).forEach(e=>e.f());
   if(cam.dir<0){drawNet();drawPosts()}
   if(phase==='play'){AL='t';drawAim()}
   strikeUI();
   if(false){const pp=proj(me.x,me.d,2.2);if(pp){const bob=Math.sin(performance.now()/220)*3;ctx.fillStyle='#f2c443';ctx.strokeStyle='rgba(0,0,0,.5)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(pp.x-7,pp.y-10+bob);ctx.lineTo(pp.x+7,pp.y-10+bob);ctx.lineTo(pp.x,pp.y+bob);ctx.closePath();ctx.fill();ctx.stroke()}}
   vignette();drawParts(rdt);
   ctx.restore();
   drawHUD();drawGrade();drawContact();
  }
  function camUpdate(dt){
   if(GK){const tz=shotAt&&!ended?1.1:(ended&&ended.ok?1.05:1);cam.z+=(tz-cam.z)*Math.min(1,dt*3);return}
   if(strike){strikeCam();return}
   if(phase==='intro'){const k=Math.min(1,dt*2.6);cam.x+=(camEnd.x-cam.x)*k;cam.d+=(camEnd.d-cam.d)*k;cam.h+=(camEnd.h-cam.h)*k;return}
   let b,fh=CHh,fz=1,ft=CTl;const fl=kicked&&kicked!=='touch';
   if((K==='fk'||K==='pen')&&!kicked&&!owner){b=behind(ball.x,ball.d,K==='pen'?8:9,0);fh=K==='pen'?4.2:5;ft=.28}
   else if(XF&&!(owner===me)){b=fl?behind(ball.x*.5,Math.max(4,ball.d*.5+3.5),11):behind(XM.x,XM.d,13);fh=fl?6:7;ft=fl?.34:.4}
   else if(K==='header'&&!headed){b=behind(me.x*.8+ball.x*.2,me.d,CB)}
   else if(owner===me||kicked==='touch'||runUp){b=behind(me.x,me.d,CB)}
   else if(kicked==='loose'&&me){b=behind(ball.x*.65+me.x*.35,Math.max(3,ball.d*.65+me.d*.35),10.5)}
   else{b=behind(ball.x,Math.max(ball.d,3),CB);if(K==='fk'||K==='pen'){fh=5.2;ft=.28}if(shotLive&&ball.d<20&&!ended){fz=1.06}}
   if(ended){if(NM.netHit){b=behind(ball.x*.8,Math.max(2,ball.d+1),8,0);fh=4.4;fz=1.08;ft=.3}else if(ended.ok){fz=1.05}else{fz=.97}}
   const k=Math.min(1,dt*(kicked==='loose'?4:fl?2.4:3.4));cam.x+=(b.x-cam.x)*k;cam.d+=(b.d-cam.d)*k;let dy=b.y-(cam.yaw||0);while(dy>Math.PI)dy-=2*Math.PI;while(dy<-Math.PI)dy+=2*Math.PI;cam.yaw=(cam.yaw||0)+dy*Math.min(1,dt*2.6);
   cam.h+=(fh-cam.h)*Math.min(1,dt*2.2);cam.z+=(fz-cam.z)*Math.min(1,dt*2.6);cam.tilt+=(ft-cam.tilt)*Math.min(1,dt*3)}
  // ---------- toque ----------
  const pt=e=>{const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)*(W/r.width),y:(e.clientY-r.top)*(H/r.height)}};
  let drag=null;let swp=null;let curlLast=null;
  function hdWin(){if(K!=='header'||headed)return false;const dd=Math.hypot(me.x-ball.x,me.d-ball.d);return ball.h>.9&&ball.h<2.9&&dd<1.9}
  function headNow(){const dd=Math.hypot(me.x-ball.x,me.d-ball.d);const g0=lastAim||{ux:R(-.25,.25),ud:-1,power:.55,curve:0,contact:.6};const L=Math.hypot(g0.ux,g0.ud)||1;
   const g={...g0,ux:g0.ux/L,ud:g0.ud/L,contact:clamp((g0.contact||1)*(1-clamp((dd-.45)/1.6,0,1)*.7),.25,1)};aim=null;doShot(g,true)}
  function onTap(p){
   if(GK){if(!shotAt&&!gkTarget){gkInfo.antic=p.x<W/2?-cam.dir:cam.dir;banner={txt:gkInfo.antic*cam.dir<0?'◀ ANTECIPOU':'ANTECIPOU ▶',ok:true,t:0,tmp:true};SFX.touch()}return}
   if(K==='header'){if(headed)return;if(hdWin()){headNow();return}if(T-hdTapT>.3){hdTapT=T;hdMiss=true;banner={txt:'AINDA NÃO!',ok:false,t:0,tmp:true}}return}
   if(K==='fk'||K==='pen'||owner!==me)return;
   if(isPassK()||K==='finish'){const m=pickMate(p.x,p.y);if(m){passTo(m,null);return}}
   if(K==='dribble')carryTo(p.x,p.y)}
  cv.addEventListener('pointerdown',e=>{e.preventDefault();SFX.ctx();if(!SFX.loop)SFX.startLoop();try{cv.setPointerCapture(e.pointerId)}catch(_){}const p=pt(e);
   if(CT){const q=ctPos();const dx=(p.x-q.x)/q.r,dy=(p.y-q.y)/q.r,L=Math.hypot(dx,dy);if(L<1.25){const k=L>1?1/L:1;ctFire({x:clamp(dx*k,-1,1),y:clamp(dy*k,-1,1)},0,false)}return}
   if(strike&&p.x<90&&p.y>40&&p.y<74){exitStrike();return}
   if(strike){const bp=proj(ball.x,ball.d,ball.h+.11);if(bp){const r=.11*bp.s;const dx=(p.x-bp.x)/r,dy=(p.y-bp.y)/r,L=Math.hypot(dx,dy);if(L<1.45){const k=L>1?1/L:1;strike.cp={x:clamp(dx*k,-1,1),y:clamp(dy*k,-1,1)};strike.hit=true;SFX.touch()}}return}
   if(GK&&(shotAt||phase!=='play')&&gkTarget)return;
   if(!canAim()&&!(K==='header'&&!headed&&phase==='play'))return;
   aim={sx:p.x,sy:p.y,cx:p.x,cy:p.y,len:0,path:[p]};drag=true});
  cv.addEventListener('pointermove',e=>{const p=pt(e);if(curlLast&&kicked&&!ended){const dx=p.x-curlLast.x;curlLast=p;ball.spin=clamp((ball.spin||0)+dx*.018*cam.dir,-2.4,2.4);curl=Math.sign(ball.spin)*cam.dir;return}if(!drag||!aim)return;aim.cx=p.x;aim.cy=p.y;aim.len=Math.hypot(aim.cx-aim.sx,aim.cy-aim.sy);const l=aim.path[aim.path.length-1];if(Math.hypot(p.x-l.x,p.y-l.y)>3&&aim.path.length<240)aim.path.push(p)});
  const up=e=>{
   if(curlLast){curlLast=null;return}
   if(CT)return;
   if(strike){if(strike.hit)fireStrike();return}
   if(!drag||!aim){drag=null;return}drag=null;const a=aim;aim=null;
   if(a.len<12){onTap({x:a.sx,y:a.sy});return}
   if(GK){if(phase!=='play')return;const dep=(cam.d-gk.d)*cam.dir;const s=F*cam.z/dep;const wx=cam.x+(a.cx-W/2)/s*cam.dir;const wh=cam.h-(a.cy-hz)/s;gkTarget={x:clamp(wx,-3.6,3.6),h:clamp(wh,0,2.6)};
    if(shotAt){gkInfo.react=T-shotAt;if(gkInfo.antic)gkInfo.anticOk=Math.sign(NM.gkShot?NM.gkShot.tx:0)===gkInfo.antic}return}
   const g=readShotGesture(a);if(!g)return;
   if(K==='header'){lastAim=g;if(hdWin())headNow();return}
   if(!canAim())return;
   if(g.raw<.26&&owner===me&&K==='dribble'){const L=1.6+g.raw*13,v=Math.sqrt(2*3.2*L)+.6;ball.vx=g.ux*v;ball.vd=g.ud*v;ball.vh=0;ball.spin=0;owner=null;kicked='touch';kickT=T;tapFx('touch');return}
   const m=assistMate(g);if(m){const t=leadOf(m,dist(m,ball)/14);const ux=t.x-ball.x,ud=t.d-ball.d,L=Math.hypot(ux,ud)||1;g.ux=ux/L;g.ud=ud/L}startContact(g,m)
   S.tips=S.tips||{};S.tips.nssm=(S.tips.nssm||0)+1};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',()=>{drag=null;aim=null;curlLast=null});
  // barra de controles: altura do chute / contato na falta
  (function(){const el=document.getElementById('nmCtl');if(!el)return;el.remove();return;let opts=null;
   if(K==='fk')opts=[[0,'Rasteira'],[1,'Por cima'],[2,'Folha seca']];
   else if(K==='pass'||K==='long'||K==='cross')opts=[[0,'⬇ Rasteiro'],[2,'⤴ Por cima']];
   else if(K==='finish'||K==='combo'||K==='pen')opts=[[0,'⬇ Rasteiro'],[1,'● Normal'],[2,'⤴ Cobertura']];
   if(!opts){el.remove();return}
   const lab=K==='fk'?'Contato':'Altura';
   const draw=()=>{el.innerHTML=`<span class="nm-cl">${lab}</span>`+opts.map(([v,t])=>`<button class="nm-cb${v===loftSel?' on':''}" data-v="${v}">${t}</button>`).join('');el.querySelectorAll('button').forEach(b=>b.onclick=()=>{loftSel=+b.dataset.v;SFX.touch();draw()})};draw()})();
  // ---------- loop ----------
  let last=performance.now(),raf=0,doneAt=null;
  function loop(now){
   const rdt=Math.min(.04,(now-last)/1000);last=now;
   if(phase==='intro'){tIntro+=rdt;if(tIntro>.85)phase='play'}
   if(strike&&phase==='play'&&performance.now()-strike.rt>3600){strike.cp=strike.cp||{x:0,y:0};fireStrike()}
   const decide=!runUp&&phase==='play'&&!GK&&(K!=='header'||owner===me)&&!ended&&((owner===me&&!kicked)||((K==='fk'||K==='pen')&&!kicked));
   ts=(decide||CT)&&phase==='play'?0:strike&&phase==='play'?.12:aim&&phase==='play'&&!(K==='header')&&!GK?.1:(aim&&K==='header'?.6:(K==='dribble'&&drbSlow?.55:1));if(GK&&shotAt&&!gkTarget&&T-shotAt<reflexT)ts=.42;if(K==='header'&&!headed&&phase==='play'&&ball.h>.4&&Math.hypot(me.x-ball.x,me.d-ball.d)<5)ts=.33;
   if(phase==='end'){ts=.45;ended.t+=rdt}
   if(phase!=='intro'){const dt=rdt*ts;const n=3;for(let i=0;i<n;i++){if(phase==='end'&&ended.t>1.6)break;step(dt/n)}}
   camUpdate(rdt);render(rdt);
   if(phase==='end'&&ended.t>1.7&&!doneAt){doneAt=now;cancelAnimationFrame(raf);const r=ended;SFX.stopLoop();
    swEnd(r.ok,r.txt,r.perfect).then(()=>res({ok:r.ok,perfect:!!r.perfect,grade:NM.grade}));try{const el=document.getElementById('mgRes');if(el&&NM.grade!=null)el.insertAdjacentHTML('beforeend',`<div class="nm-grade"><b>Nota ${NM.grade}</b> · ${esc(NM.why||'')}</div>`)}catch(e){}return}
   raf=requestAnimationFrame(loop)}
  raf=requestAnimationFrame(loop);SFX.startLoop();setTimeout(()=>SFX.whistle(),350);
  NM.__ct=()=>{if(!CT)return null;const q=ctPos();return{x:q.x,y:q.y,r:q.r,k:q.k,W,H}};
  NM.__bp=()=>{const q=proj(ball.x,ball.d,ball.h+.11);return q&&{x:q.x,y:q.y,r:.11*q.s,W,H}};NM.__mate=()=>{const m=P.find(q=>q.team==='mate');const q=m&&proj(m.x,m.d,.9);return q&&{x:q.x,y:q.y,W,H}};
  NM.api={kickTo(tx,td,p,c){exitStrike();const ox=K==='header'?me.x:ball.x,od=K==='header'?me.d:ball.d;const dx0=tx-ox,dd0=td-od,L=Math.hypot(dx0,dd0)||1;const AL1=autoLoft(p,K==='header');const g={ux:dx0/L,ud:dd0/L,power:AL1.power,curve:clamp((c||0)/9,-1,1),contact:1,len:p*175,lsel:AL1.lsel,loft:AL1.loft,dip:AL1.dip};if(K==='header'){lastAim=g;NM.autoTap=true;return}if(p<.27&&owner===me){const v=Math.sqrt(2*3.2*Math.min(L,7))+.8;ball.vx=dx0/L*v;ball.vd=dd0/L*v;owner=null;kicked='touch';kickT=T;return}const m=assistMate(g);if(m)passTo(m,g);else doShot(g,false)},tapMate(i){const m=P.filter(q=>q.team==='mate')[i||0];if(m)passTo(m,null)},loft(v){loftSel=v},antic(s){gkInfo.antic=s},state:()=>({phase,T,kicked,owner:owner===me,ball:{...ball},me:me&&{x:me.x,d:me.d}}),P,gkSet(x,h){gkTarget={x,h};if(shotAt)gkInfo.react=T-shotAt},swipe(d){drbSwipe(d)},fk(x,h,pw,cv){fkAim={x,h};fkPw=pw;fkCv=cv;fkKick()},drb(){const q=drbAct();return q?{dd:me.d-q.d,open:q.open,nut:q.nut}:null}};
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
const _rcNM=runChance;runChance=async function(c){if(c.type==='chip'){const sk=k=>typeof skillOf==='function'?skillOf(k):.6;return(await nssMoment({...c,kind:'chip',title:'O goleiro saiu do gol!',skill:sk('FIN'),keeper:c.planned?.4:.55,okTxt:'GOL DE COBERTURA!'})).ok}if(c.type==='combo'){const sk=k=>typeof skillOf==='function'?skillOf(k):.6;return(await nssMoment({...c,kind:'combo',title:c.planned?'Tabela na entrada da área!':'Jogada de tabela',skill:sk('PAS')*.5+sk('FIN')*.5,keeper:c.planned?.4:.55,okTxt:'Gol de tabela!'})).ok}return _rcNM(c)};
IO_UI.chance=async c=>runChance(c);
const _ctNM=chanceType;chanceType=function(e){const t=_ctNM(e);if(t==='finish'&&!e.fk&&ch(.25))return'chip';if(!e.fk&&['finish','dribble'].includes(t)&&['ATA','SA','MEI','MC','PE','PD','ME','MD'].includes(S.pos)&&ch(.28))return'combo';return t};
