// ================== LANCES NO ESTILO NEW STAR SOCCER ==================
// Câmera atrás do jogador, campo em perspectiva. Puxe o dedo pra trás (estilingue) e solte pra chutar.
// Puxada curta = conduzir. Depois do chute, arraste pro lado pra dar efeito. O tempo desacelera enquanto você mira.
const NM={};
function nmCrowd(){
 if(NM.crowd)return NM.crowd;
 const c=document.createElement('canvas');c.width=420;c.height=90;const x=c.getContext('2d');
 const g=x.createLinearGradient(0,0,0,90);g.addColorStop(0,'#1d2733');g.addColorStop(1,'#33414f');x.fillStyle=g;x.fillRect(0,0,420,90);
 const cols=['#e8e1d3','#c8102e','#1e4fd8','#f2c443','#2e9e4f','#ff8c3a','#d9a77a','#8a5a3c','#ffffff','#9aa7b4'];
 for(let r=0;r<16;r++)for(let i=0;i<120;i++){x.fillStyle=cols[(Math.random()*cols.length)|0];x.globalAlpha=.55+Math.random()*.45;x.fillRect(i*3.5+(r%2)*1.7+Math.random(),6+r*5+Math.random()*1.5,2.2,2.6)}
 x.globalAlpha=1;for(let i=0;i<9;i++){x.fillStyle='rgba(0,0,0,.35)';x.fillRect(i*47,0,3,90)}
 return NM.crowd=c;
}
function nmHex(h){h=(h||'#888').replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[(n>>16)&255,(n>>8)&255,n&255]}
function nmShade(h,f){const[r,g,b]=nmHex(h);const m=v=>Math.max(0,Math.min(255,Math.round(v*f)));return`rgb(${m(r)},${m(g)},${m(b)})`}
function nmOppColor(c1){const[r,g,b]=nmHex(c1);const red=r>140&&g<110&&b<110,blue=b>130&&r<110;const light=(r+g+b)/3>200;return red?['#f4f4f4','#1d3f9e']:blue||light?['#d0312d','#f4f4f4']:['#f4f4f4','#d0312d']}

function nssMoment(o){
 return new Promise(res=>{
  const K=o.kind||'finish';const pl=!!o.planned;const skill=clamp(o.skill??.6,.12,.98);
  const kq=clamp((o.keeper??.45)*1.65,.45,.95);const spdMul=o.speed||1;
  const myC=club()?[club().c1||'#ff7a2b',club().c2||'#ffffff']:['#ff7a2b','#ffffff'];const opC=nmOppColor(myC[0]);
  const GK=K==='keeper';
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
   if(!pl)mk('opp',me.x+(me.x>0?-1:1)*R(4,6),me.d-R(3,5),{sp:5.2*spdMul});
   tmax=pl?9:7;tag='Finalização';hint='Puxe o dedo <b>pra trás</b> e solte pra chutar. Puxada curta conduz a bola.';
  }else if(K==='fk'){
   const bx=R(-9,9),bd=R(19,25);me=mk('me',bx+(bx>0?.4:-.4),bd+1.1);ball.x=bx;ball.d=bd;
   const L=Math.hypot(bx,bd),ux=-bx/L,ud=-bd/L;const cx=bx+ux*9.15,cd=bd+ud*9.15;const px=-ud,pd=ux;const shift=(bx>0?1:-1)*.5;
   for(let i=0;i<4;i++)mk('opp',cx+px*((i-1.5)*.62+shift),cd+pd*((i-1.5)*.62+shift),{wall:true,sp:0});
   gk=mk('gk',(bx>0?-1:1)*.9,.7);tmax=14;tag='Falta';hint='Puxe pra trás e solte. <b>Logo depois, arraste pro lado</b> pra curvar por cima/em volta da barreira.';
  }else if(K==='header'){
   me=mk('me',R(-3,3),R(7,11));gk=mk('gk',0,1);mk('opp',me.x+R(-1.2,1.2),me.d-R(.8,1.4),{sp:4.6,mark:me});
   tmax=6;tag='Cabeçada';hint='<b>Mire antes:</b> puxe o dedo pra trás e segure. Ele cabeceia sozinho quando a bola chegar.';
  }else if(K==='pass'){
   me=mk('me',R(-12,12),R(44,52));const n=o.defs>=3?3:2;
   const mates=[];for(let i=0;i<n;i++){const x=clamp(me.x+(i-(n-1)/2)*R(10,14)+R(-3,3),-28,28);mates.push(mk('mate',x,me.d-R(11,20),{sp:5.6}))}
   mates.forEach(m=>{m.run={x:m.x+R(-4,4),d:m.d-R(9,16)}});
   mk('opp',me.x+R(-2,2),me.d-R(6,8),{sp:5*spdMul});
   for(let i=0;i<(o.defs||2)-1;i++){const m=mates[i%mates.length];mk('opp',m.x+R(-2,2),m.d-R(1,3),{sp:5.4*spdMul,mark:m})}
   gk=mk('gk',0,1.2);tmax=9;tag='Passe';hint='Puxe pra trás <b>mirando no companheiro</b> (anel). Mais longe = mais força.';
  }else if(K==='long'){
   me=mk('me',R(-15,15),R(60,66));const far=mk('mate',R(-18,18),R(28,34),{sp:6});far.run={x:far.x*.6,d:far.d-12};
   const mid=mk('mate',clamp(me.x+R(-12,12),-28,28),me.d-R(14,18),{sp:5});mid.run={x:mid.x,d:mid.d-5};
   mk('opp',far.x+R(-2,2),far.d-R(1,3),{sp:5.6,mark:far});mk('opp',mid.x+R(-2,2),mid.d-2,{sp:5,mark:mid});mk('opp',me.x+R(-2,2),me.d-7,{sp:4.8});
   gk=mk('gk',0,1.5);tmax=9;tag='Lançamento';hint='Puxada <b>longa</b> pra lançar no companheiro lá na frente.';
  }else if(K==='cross'){
   me=mk('me',side*R(23,28),R(9,17));
   const a=mk('mate',R(-4,2)*side*-1,R(9,12),{sp:6});a.run={x:a.x*.3,d:R(5,7)};
   const b=mk('mate',R(-2,4)*side*-1,R(12,15),{sp:5.5});b.run={x:b.x,d:R(10,12)};
   mk('opp',a.x+R(-1,1),a.d-1.2,{sp:5.2,mark:a});mk('opp',b.x+R(-1,1),b.d-1.2,{sp:5.2,mark:b});mk('opp',me.x-side*3,me.d-4,{sp:4.8});
   gk=mk('gk',0,1.2);tmax=8;tag='Cruzamento';hint='Puxe pra trás mirando <b>no anel dentro da área</b>.';
  }else if(K==='dribble'){
   me=mk('me',R(-6,6),R(30,34));const n=o.need||2;
   for(let i=0;i<n;i++)mk('opp',clamp(me.x+(i-(n-1)/2)*R(5,8),-20,20),me.d-R(5,9)-i*2,{sp:(4.3+(n>2?.3:0))*spdMul});
   gk=mk('gk',0,1.2);tmax=12;tag='Drible';hint='<b>Puxadas curtas</b> conduzem a bola. Fuja dos marcadores e entre na área.';
  }else if(GK){
   gk=mk('me',0,.9);gk.isGK=true;const sh=mk('opp',R(-8,8),R(13,20),{sp:0,shooter:true});ball.x=sh.x;ball.d=sh.d-.5;
   tmax=6;tag='Defesa';hint='Quando ele chutar, <b>arraste do goleiro até a bola</b> pra pular.';
  }
  if(me&&K!=='fk'&&!GK){ball.x=me.x;ball.d=me.d-.45}
  if(K==='header'){const T=1.15;const tx=me.x+R(-1.2,1.2),td=me.d+R(-1.2,1);ball.x=side*R(22,27);ball.d=R(9,15);ball.h=.3;ball.vx=(tx-ball.x)/T;ball.vd=(td-ball.d)/T;ball.vh=(1.75-.3+4.9*T*T)/T;me.run={x:tx,d:td};NM.cross={tx,td}}
  P.forEach(p=>{if(p.team==='opp'){p.c=opC[0];p.c2=opC[1]}else if(p.team==='gk'){p.c='#f5e400';p.c2='#222'}else{p.c=myC[0];p.c2=myC[1]}});
  if(GK){gk.c='#3cdc5a';gk.c2='#222'}

  // ---------- quadro ----------
  $ov.hidden=false;
  $ov.innerHTML=`<div class="ovwrap mg nssm"><div class="nm-top"><span class="eyebrow">${esc(o.comp||'')}${o.min!=null?` · ${o.min}'`:''}</span><span class="tag campo">${esc(tag)}</span></div>
  <h2 class="pkh nm-t">${esc(o.title||'')}</h2><div class="nm-stage"><canvas id="nmC"></canvas></div><p class="swhint nm-h">${hint}</p><div class="pkres" id="mgRes"></div></div>`;
  const cv=document.getElementById('nmC');const ctx=cv.getContext('2d');
  const stage=cv.parentElement;const W=Math.min(stage.clientWidth||360,480);const H=Math.round(Math.min(W*(GK?1.02:1.28),Math.max(320,innerHeight-235)));
  const dpr=Math.min(2,devicePixelRatio||1);cv.width=W*dpr;cv.height=H*dpr;cv.style.width=W+'px';cv.style.height=H+'px';ctx.setTransform(dpr,0,0,dpr,0,0);
  const F=GK?H*.95:H*1.08,hz=GK?H*.3:H*.19;
  const cam=GK?{x:0,d:-7.6,h:2.5,dir:-1}:{x:(me?me.x:ball.x)*.88,d:(me?me.d:ball.d)+10.5,h:5.2,dir:1};
  if(K==='fk'){cam.x=ball.x*.8;cam.d=ball.d+9}
  const proj=(x,d,h,mn)=>{const dep=(cam.d-d)*cam.dir;if(dep<(mn||.35))return null;const s=F/dep;return{x:W/2+(x-cam.x)*s*cam.dir,y:hz+(cam.h-h)*s,s}};

  // ---------- estado ----------
  let phase='intro',T=0,tIntro=0,owner=(K==='fk'||K==='header'||GK)?null:me,kicked=null,kickT=0,aim=null,lastAim=null,curl=0,ended=null,banner=null,ts=1,prePath=null,shotLive=false,gkReact=0,gkDive=0,headed=false,flightLog=[];
  const sp2=()=>Math.hypot(ball.vx,ball.vd);
  const dist=(a,b)=>Math.hypot(a.x-b.x,a.d-b.d);
  function finish(ok,txt,perfect,big){if(ended)return;NM.last=txt;ended={ok,txt,perfect,t:0};banner={txt:big||txt,ok,t:0};phase='end'}
  function canAim(){if(phase!=='play')return false;if(GK)return !gkTarget;if(K==='header')return !headed;if(K==='fk')return !kicked;return owner===me}

  // simulação de bola sem colisão (pra prévia e pros companheiros)
  function simPath(b,secs,withCurl){const p=[];let x=b.x,d=b.d,h=b.h,vx=b.vx,vd=b.vd,vh=b.vh,ax=withCurl?b.ax:0;let g=9.8+(b.dip||0);const dt=1/30;let bounced=null;
   for(let i=0;i<secs*30;i++){if(h>0||vh>0){vh-=g*dt;vx+=ax*dt;ax*=.985}x+=vx*dt;d+=vd*dt;h+=vh*dt;if(h<0){h=0;if(!bounced)bounced={x,d,i};if(vh<-1.6)vh=-vh*.45;else vh=0;g=9.8}
    if(h===0){const s=Math.hypot(vx,vd);const ns=Math.max(0,s-3.2*dt);if(s>0){vx*=ns/s;vd*=ns/s}}else{vx*=1-.04*dt;vd*=1-.04*dt}
    p.push({x,d,h,t:(i+1)*dt});if(d<-2||Math.abs(x)>36)break;if(h===0&&Math.hypot(vx,vd)<.3)break}
   return{p,bounced}}
  function kickVec(a){const dx=a.cx-a.sx,dy=a.cy-a.sy;const len=Math.hypot(dx,dy);const p=clamp(len/(H*.34),0,1);
   // estilingue: puxar pra baixo manda pra frente (rumo ao gol)
   const wx=-dx,wd=dy;const L=Math.hypot(wx,wd)||1;return{ux:-wx/L*-1,ud:-wd/L,p,len}}
  function mkKick(a,header,noise){
   const k=kickVec(a);let ux=-(a.cx-a.sx),ud=-(a.cy-a.sy);const L=Math.hypot(ux,ud)||1;ux/=L;ud/=L;
   // ud negativo = pra frente (d diminui); a puxada pra baixo (cy>sy) gera ud<0
   let ang=Math.atan2(ux,-ud);if(noise){ang+=gauss()*(1-skill)*.085}
   const p=k.p;let type,speed,elev;
   if(header){type='header';speed=9+p*12;elev=(-5+p*15)*Math.PI/180}
   else if(p<.27&&K!=='fk'){type='touch';speed=2.6+p*15;elev=0}
   else{type='kick';speed=8+p*24;elev=(3+p*p*30)*Math.PI/180}
   if(noise)speed*=1+gauss()*(1-skill)*.07;
   const hs=Math.cos(elev)*speed;return{type,vx:Math.sin(ang)*hs,vd:-Math.cos(ang)*hs,vh:Math.sin(elev)*speed,p}}
  function doKick(a,header){
   const k=mkKick(a,header,true);
   if(header){ball.x=me.x;ball.d=me.d-.2;ball.h=Math.max(ball.h,1.6);me.jump=.35;headed=true}
   ball.vx=k.vx;ball.vd=k.vd;ball.vh=k.vh;ball.ax=0;ball.dip=k.type==='kick'?5:0;owner=null;kicked=k.type;kickT=T;curl=0;
   if(k.type!=='touch'){shotLive=ball.vd<-5&&ball.d<40;gkReact=.18+(1-kq)*.25+(K==='fk'?.22:0);gk.err=null;P.forEach(p=>{if(p.wall)p.jump=.45})}
   if(k.type!=='touch'){const sp=simPath({...ball},3,false);NM.path=sp.p;P.filter(p=>p.team==='mate').forEach(m=>planRun(m))}
   tapFx(k.type);
  }
  function planRun(m){const path=NM.path||[];const hmax=K==='cross'?2.6:1.8;for(const q of path){if(q.h>hmax)continue;const dd=Math.hypot(q.x-m.x,q.d-m.d);if(dd/7<=q.t+.25){m.run={x:q.x,d:q.d};m.sp=7;return}}}
  function tapFx(t){try{if(navigator.vibrate)navigator.vibrate(t==='touch'?8:18)}catch(e){}}

  // ---------- passo da física ----------
  function step(dt){
   T+=dt;
   // goleiro do jogo (eu) — modo defesa
   if(GK)return stepGK(dt);
   // bola
   if(owner){const m=owner;ball.x+=(m.x-ball.x)*Math.min(1,dt*18);ball.d+=(m.d-.5-ball.d)*Math.min(1,dt*18);ball.h=0;ball.vx=ball.vd=ball.vh=0}
   else if(!(K==='fk'&&!kicked)){
    const pd=ball.d;
    if(ball.h>0||ball.vh>0){ball.vh-=(9.8+(ball.dip||0))*dt;if(kicked&&kicked!=='touch'&&T-kickT<1.6){ball.vx+=ball.ax*dt;ball.ax*=.985}}
    ball.x+=ball.vx*dt;ball.d+=ball.vd*dt;ball.h+=ball.vh*dt;
    if(ball.h<0){ball.h=0;ball.dip=0;if(ball.vh<-1.6)ball.vh=-ball.vh*.45;else ball.vh=0}
    if(ball.h===0){const s=sp2();const ns=Math.max(0,s-3.2*dt);if(s>0){ball.vx*=ns/s;ball.vd*=ns/s}}else{ball.vx*=1-.04*dt;ball.vd*=1-.04*dt}
    ball.rot+=sp2()*dt*2;
    if(ball.d<-1.9&&Math.abs(ball.x)<3.75&&ball.h<2.5){ball.d=-1.9;ball.vd=0;ball.vx*=.3}
    // goleiro adversário: plano de defesa
    if(gk&&pd>gk.d&&ball.d<=gk.d&&ball.vd<0){const reach=(gkDive?.6+.9*kq:.6)*R(.85,1.08);const top=gkDive?2.15:2.5;
     if(Math.abs(ball.x-gk.x)<reach&&ball.h<top+.2){if(ball.h>top||Math.abs(ball.x-gk.x)>reach*.8&&ch(.35)){ball.vd=-ball.vd*.35;ball.vx+=Math.sign(ball.x-gk.x)*4;ball.vh=3;return finish(false,'Espalmou pra escanteio!',false,'DEFENDEU!')}
      ball.vx=ball.vd=0;ball.vh=0;ball.x=gk.x;ball.d=gk.d;ball.h=Math.min(ball.h,1.2);return finish(false,'O goleiro segurou.',false,'DEFENDEU!')}}
    // linha do gol
    if(pd>0&&ball.d<=0){const f=pd/(pd-ball.d);const x=ball.x,h=ball.h;
     const post=Math.abs(Math.abs(x)-3.66)<.14&&h<2.5,bar=Math.abs(h-2.44)<.14&&Math.abs(x)<3.8;
     if(post||bar){ball.vd=-ball.vd*.5;ball.vx*=.6;return finish(false,bar?'No travessão!':'Na trave!',false,'NA TRAVE!')}
     if(Math.abs(x)<3.66&&h<2.44){NM.goalX=x;const corner=Math.abs(x)>2.5||h>1.7;return finish(true,o.okTxt||'GOL!',corner,'GOOOL!')}
     return finish(false,h>2.44?'Por cima do gol!':'Pra fora!',false,'PRA FORA!')}
    if(Math.abs(ball.x)>34||ball.d>72)return finish(false,'Saiu pela lateral.',false,'PRA FORA!');
   }
   if(gk&&!GK)stepKeeper(dt);
   // eu
   if(me){
    let tx=null,td=null,sp=mySp;
    if(K==='header'&&!headed&&me.run){tx=me.run.x;td=me.run.d}
    else if(!owner&&kicked==='touch'&&ball.h<.6){tx=ball.x;td=ball.d+.3}
    if(tx!=null){const dx=tx-me.x,dd=td-me.d,L=Math.hypot(dx,dd);if(L>.05){const v=Math.min(sp,L*6+3);me.vx=dx/L*v;me.vd=dd/L*v}else{me.vx=me.vd=0}}else{const kk=owner===me?Math.pow(.3,dt):Math.pow(.02,dt);me.vx*=kk;me.vd*=kk}
    me.x+=me.vx*dt;me.d+=me.vd*dt;
    if(!owner&&kicked==='touch'&&T-kickT>.18&&ball.h<.5&&Math.hypot(me.x-ball.x,me.d-.45-ball.d)<.75){owner=me;kicked=null}
    // cabeçada: bola na janela
    if(K==='header'&&!headed&&ball.h>.9&&ball.h<2.9&&Math.hypot(me.x-ball.x,me.d-ball.d)<1.5){const a=aim&&aim.len>14?aim:lastAim;
     if(a){aim=null;doKick(a,true)}else{aim=null;doKick({sx:0,sy:0,cx:R(-30,30),cy:-R(40,80)*-1},true)}}
    if(K==='header'&&!headed&&(ball.d<me.d-3||ball.h===0&&T>.5))return finish(false,'A bola passou por você.',false,'PASSOU!');
    if(K==='dribble'&&owner===me&&me.d<16.5&&Math.abs(me.x)<20)return finish(true,o.okTxt||'Passou por todos!',me.d<14,'PASSOU!');
   }
   // companheiros
   P.filter(p=>p.team==='mate').forEach(m=>{if(m.run){const dx=m.run.x-m.x,dd=m.run.d-m.d,L=Math.hypot(dx,dd);const v=Math.min(m.sp,L*4);if(L>.05){m.vx=dx/L*v;m.vd=dd/L*v}else m.vx=m.vd=0}m.x+=m.vx*dt;m.d+=m.vd*dt;
    if(kicked&&kicked!=='touch'&&T-kickT>.15&&ball.h<(K==='cross'?2.7:1.8)&&Math.hypot(m.x-ball.x,m.d-ball.d)<1.15){const free=!P.some(q=>q.team==='opp'&&dist(q,m)<3);finish(true,o.okTxt||'Na medida!',free,K==='cross'?'NA CABEÇA!':'NA MEDIDA!')}});
   if(K!=='header'&&kicked&&kicked!=='touch'&&!ended&&T-kickT>.3)P.filter(p=>p.team==='mate').forEach(m=>{if(((T*4)|0)%2===0)planRun(m)});
   // adversários
   for(const q of P){if(q.team!=='opp')continue;
    if(q.jump>0)q.jump=Math.max(0,q.jump-dt*.9);
    if(q.stun>0){q.stun-=dt;q.x+=q.vx*dt;q.d+=q.vd*dt;q.vx*=.9;q.vd*=.9;continue}
    if(q.sp>0&&!q.wall){let tx,td;
     if(q.mark&&!(kicked&&kicked!=='touch'&&dist(q,ball)<7)&&dist(q,ball)>5){tx=q.mark.x+(q.mark===me?0:(ball.x-q.mark.x)*.12);td=q.mark.d-(q.mark===me?.9:1.1)}
     else{tx=ball.x+ball.vx*.25;td=ball.d+ball.vd*.25}
     const dx=tx-q.x,dd=td-q.d,L=Math.hypot(dx,dd);const jock=(owner===me||kicked==='touch')&&L<3.5?.55:1;if(L>.05){const v=Math.min(q.sp*jock,L*5);q.vx+=(dx/L*v-q.vx)*Math.min(1,dt*4);q.vd+=(dd/L*v-q.vd)*Math.min(1,dt*4)}q.x+=q.vx*dt;q.d+=q.vd*dt}
    if(phase!=='play')continue;
    const db=Math.hypot(q.x-ball.x,q.d-ball.d);const fast=sp2()>14;const top=q.wall?1.85+q.jump*.6:(K==='header'?2.3:1.85);
    if((T-kickT>.12||!kicked)&&db<(owner===me?.6:ball.h<.6&&!fast?.7:.5)&&ball.h<top){
     if(q.mark===me&&K==='header'&&!headed)return finish(false,'O zagueiro subiu mais.',false,'CORTOU!');
     if(q.wall)return finish(false,'Bateu na barreira.',false,'BARREIRA!');
     if(owner===me||kicked==='touch'){if(ch(.12+dri*.4)){q.stun=.8;q.vx*=-.4;q.vd*=-.4;banner={txt:'PASSOU!',ok:true,t:0,tmp:true};continue}return finish(false,'Desarmado!',false,'DESARMOU!')}
     return finish(false,kicked&&ball.vd<-5&&K!=='pass'&&K!=='long'?'Bloqueado!':'Interceptado!',false,fast?'BLOQUEOU!':'CORTOU!')}}
   // bola morreu
   if(kicked&&kicked!=='touch'&&ball.h===0&&sp2()<.35&&!ended)return finish(false,K==='pass'||K==='long'||K==='cross'?'Ninguém chegou na bola.':'Fraquinho demais.',false,'ERROU!');
   if(T>tmax&&(!kicked||kicked==='touch'))return finish(false,'Demorou demais!',false,'PERDEU!');
  }
  function stepKeeper(dt){
   const bd=Math.max(.1,ball.d);
   if(!shotLive||kicked==='touch'){const tx=clamp(ball.x*(3/Math.max(4,Math.hypot(ball.x,bd))),-2.8,2.8);const td=clamp(.8+(ball.d<14&&K!=='fk'&&K!=='header'?(14-ball.d)*.22:0),.6,4);gk.x+=clamp(tx-gk.x,-3*dt,3*dt);gk.d+=clamp(td-gk.d,-3*dt,3*dt)}
   else{if(gkReact>0){gkReact-=dt;return}
    if(ball.vd<-.5){const tc=(ball.d-gk.d)/(-ball.vd);const px=ball.x+ball.vx*tc;if(gk.err==null)gk.err=gauss()*.7*(1-kq);const v=.8+1.6*kq;gk.x+=clamp(px+gk.err-gk.x,-v*dt,v*dt);if(tc<.38&&!gkDive)gkDive=Math.sign(px-gk.x)||1}}
   // sai pra pegar cruzamento
   if((K==='cross'&&kicked||K==='header'&&!headed)&&ball.h>.5&&ball.h<2.8&&Math.hypot(gk.x-ball.x,gk.d-ball.d)<1.2&&!ended)finish(false,'O goleiro saiu e pegou.',false,'GOLEIRO!');
  }
  // ---------- modo goleiro ----------
  let shotAt=null,gkTarget=null,early=false;const shooter=P.find(p=>p.shooter);
  function stepGK(dt){
   if(!shotAt&&T>NM.gkDelay){shotAt=T;const tx=R(-3.3,3.3),th=ch(.4)?R(1.4,2.2):R(.15,1.1);const L=Math.hypot(tx-ball.x,ball.d);const sp=R(20,27)*(o.planned?1.05:.92);const t=L/sp;
    ball.vx=(tx-ball.x)/t;ball.vd=-ball.d/t;ball.vh=(th+4.9*t*t)/t;NM.gkShot={tx,th}}
   if(shotAt){const pd=ball.d;ball.vh-=9.8*dt;ball.x+=ball.vx*dt;ball.d+=ball.vd*dt;ball.h+=ball.vh*dt;if(ball.h<0){ball.h=0;ball.vh=-ball.vh*.4}ball.rot+=dt*20;
    if(gkTarget){const v=4+skill*5;const dx=gkTarget.x-gk.x;gk.x+=clamp(dx,-v*dt,v*dt);gk.lift=Math.min(gkTarget.h,(gk.lift||0)+dt*6)}
    if(pd>gk.d&&ball.d<=gk.d){const hx=gk.x,hh=Math.max(1,(gk.lift||0));const reach=gkTarget?.9+skill*.5:.55;const dx=Math.abs(ball.x-hx),dh=Math.abs(ball.h-hh);
     if(dx<reach&&(dh<1.1||ball.h<1.3&&(gk.lift||0)<1.2)){ball.vd=-ball.vd*.3;ball.vx=Math.sign(ball.x-hx||1)*5;ball.vh=3;return finish(true,o.okTxt||'DEFENDEU!',dx<reach*.5,'DEFENDEU!')}}
    if(pd>0&&ball.d<=0){if(Math.abs(ball.x)<3.66&&ball.h<2.44)return finish(false,early?'Pulou antes da hora!':'Foi no canto.',false,'GOL DELES');return finish(false,'Ufa… pra fora',false,'PRA FORA')}}
   if(!shotAt&&gkTarget){early=true;shotAt=T;ball.vx=0;const tx=gkTarget.x>0?-R(1.5,3.2):R(1.5,3.2);const t=.75;ball.vx=(tx-ball.x)/t;ball.vd=-ball.d/t;ball.vh=(R(.3,1.2)+4.9*t*t)/t}
   if(!shotAt&&T>tmax)finish(false,'Ele chutou e você nem viu',false,'GOL DELES');
  }
  NM.gkDelay=R(.9,1.8);

  // ---------- desenho ----------
  const crowd=nmCrowd();
  function line3(pts,w,col){ctx.strokeStyle=col;ctx.lineWidth=w;ctx.beginPath();let pen=false;for(const[x,d,h]of pts){const p=proj(x,d,h||0,2.2);if(!p){pen=false;continue}if(!pen){ctx.moveTo(p.x,p.y);pen=true}else ctx.lineTo(p.x,p.y)}ctx.stroke()}
  function seg(x1,d1,x2,d2,n=16){const a=[];for(let i=0;i<=n;i++){const t=i/n;a.push([x1+(x2-x1)*t,d1+(d2-d1)*t,0])}return a}
  function quad(pts,fill){const q=pts.map(([x,d,h])=>proj(x,d,h||0));if(q.some(p=>!p))return;ctx.fillStyle=fill;ctx.beginPath();q.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fill()}
  function drawField(){
   const farD=cam.dir>0?-7:46;const nearD=cam.d-cam.dir*.6;
   // céu e arquibancada
   const sk=ctx.createLinearGradient(0,0,0,hz);sk.addColorStop(0,'#5d8fc9');sk.addColorStop(1,'#a9c8e6');ctx.fillStyle=sk;ctx.fillRect(0,0,W,H);
   const bt=proj(cam.x,farD,0),btop=proj(cam.x,farD+(cam.dir>0?-8:8),6.5);
   const yB=bt?bt.y:hz+10,yT=btop?Math.max(hz*.25,btop.y):0;
   ctx.drawImage(crowd,0,yT,W,Math.max(4,yB-yT));ctx.fillStyle='rgba(10,16,24,.35)';ctx.fillRect(0,yT,W,6);
   // gramado
   ctx.fillStyle='#3f9a3c';ctx.fillRect(0,yB,W,H-yB);
   const lo=Math.min(farD,nearD),hi=Math.max(farD,nearD);
   for(let d=Math.floor(lo/5)*5;d<hi;d+=5){const a=Math.max(lo,d),b=Math.min(hi,d+5);if(((d/5)|0)%2===0)quad([[-60,a],[60,a],[60,b],[-60,b]],'#48a845')}
   // placas de publicidade
   const ab=[];for(let i=-6;i<6;i++)ab.push(i);ab.forEach(i=>{quad([[i*7,farD,0],[(i+1)*7,farD,0],[(i+1)*7,farD,1],[i*7,farD,1]],i%2?'#1b1f6b':'#f2c443')});
   const tp=proj(cam.x,farD,.5);if(tp){ctx.fillStyle='rgba(255,255,255,.85)';ctx.font=`900 ${Math.max(6,tp.s*.55)}px 'Saira Condensed',sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';for(let i=-3;i<3;i++){const q=proj(i*14+3.5,farD,.5);if(q)ctx.fillText('FOME DE BOLA',q.x,q.y)}}
   // linhas
   const Lc='rgba(255,255,255,.88)',lw=d=>{const p=proj(0,d,0);return p?Math.max(1,p.s*.09):1};
   line3(seg(-34,0,34,0,30),lw(0),Lc);
   line3(seg(-20.16,0,-20.16,16.5),lw(8),Lc);line3(seg(20.16,0,20.16,16.5),lw(8),Lc);line3(seg(-20.16,16.5,20.16,16.5,20),lw(16),Lc);
   line3(seg(-9.16,0,-9.16,5.5),lw(3),Lc);line3(seg(9.16,0,9.16,5.5),lw(3),Lc);line3(seg(-9.16,5.5,9.16,5.5),lw(5),Lc);
   const arc=[];for(let i=0;i<=24;i++){const a=-.93+i*1.86/24;const x=Math.sin(a)*9.15,d=11+Math.cos(a)*9.15;if(d>=16.5)arc.push([x,d,0])}line3(arc,lw(18),Lc);
   line3(seg(-34,0,-34,70,40),lw(20),Lc);line3(seg(34,0,34,70,40),lw(20),Lc);line3(seg(-34,52.5,34,52.5,30),lw(52),Lc);
   const cc=[];for(let i=0;i<=40;i++){const a=i/40*Math.PI*2;cc.push([Math.sin(a)*9.15,52.5+Math.cos(a)*9.15,0])}line3(cc,lw(52),Lc);
   const sp=proj(0,11,0);if(sp){ctx.fillStyle=Lc;ctx.beginPath();ctx.ellipse(sp.x,sp.y,sp.s*.12,sp.s*.05,0,0,7);ctx.fill()}
  }
  function drawNet(){ // rede e fundo
   const nc=cam.dir>0?'rgba(255,255,255,.28)':'rgba(255,255,255,.1)';
   for(let i=0;i<=12;i++){const x=-3.66+i*7.32/12;line3([[x,0,2.44],[x,-1.6,2.2],[x,-2.2,0]],1,nc)}
   for(let j=0;j<=6;j++){const h=j*2.44/6;const dd=-2.2+h/2.44*.6;line3([[-3.66,dd,h],[3.66,dd,h]],1,nc)}
   for(let j=0;j<=5;j++){const t=j/5;line3([[-3.66,0,2.44*t],[-3.66,-2.2+.6*t,2.44*t]],1,nc);line3([[3.66,0,2.44*t],[3.66,-2.2+.6*t,2.44*t]],1,nc)}
  }
  function drawPosts(){const w=(proj(0,0,0)||{s:20}).s*.12;line3([[-3.66,0,0],[-3.66,0,2.44],[3.66,0,2.44],[3.66,0,0]],Math.max(2,w),'#fbfbf6')}
  function shadow(x,d,r,a){const p=proj(x,d,0);if(!p)return;ctx.fillStyle=`rgba(0,0,0,${a})`;ctx.beginPath();ctx.ellipse(p.x,p.y,r*p.s,r*p.s*.32,0,0,7);ctx.fill()}
  function drawPlayer(p){
   const isGK=p.team==='gk'||p.isGK;const lift=(p.jump>0?Math.sin(p.jump/.45*Math.PI)*.5:0)+(p.lift&&p.isGK?Math.max(0,p.lift-1.2)*.6:0);
   const pr=proj(p.x,p.d,lift);if(!pr)return;const s=pr.s,x=pr.x,y=pr.y;
   const v=Math.hypot(p.vx,p.vd);p.ph+=v*.09;const sw=Math.sin(p.ph)*Math.min(1,v/3)*.22*s;
   let tilt=0;if(isGK&&(p===gk&&gkDive&&!GK)){tilt=gkDive*1.0}if(GK&&p===gk&&gkTarget){tilt=clamp((gkTarget.x-p.x)*-.35*cam.dir,-1.2,1.2)*(gkTarget.h<1.4?1:.6)}
   ctx.save();ctx.translate(x,y);ctx.rotate(tilt);if(GK&&p===gk)ctx.globalAlpha=.8;
   const skin='#c98d62',sock=isGK?'#222':p.c2,shirt=p.c,shorts=isGK?'#222':(p.team==='opp'?p.c2:'#1b1b1b');
   ctx.lineCap='round';
   // pernas
   ctx.strokeStyle=sock;ctx.lineWidth=Math.max(1.5,.15*s);
   ctx.beginPath();ctx.moveTo(-.1*s,-.85*s);ctx.lineTo(-.1*s+sw,0);ctx.moveTo(.1*s,-.85*s);ctx.lineTo(.1*s-sw,0);ctx.stroke();
   ctx.fillStyle='#111';ctx.fillRect(-.1*s+sw-.07*s,-.06*s,.14*s,.07*s);ctx.fillRect(.1*s-sw-.07*s,-.06*s,.14*s,.07*s);
   // calção
   ctx.fillStyle=shorts;ctx.beginPath();ctx.moveTo(-.23*s,-1.02*s);ctx.lineTo(.23*s,-1.02*s);ctx.lineTo(.25*s,-.72*s);ctx.lineTo(-.25*s,-.72*s);ctx.closePath();ctx.fill();
   // braços
   const ar=Math.sin(p.ph+Math.PI)*Math.min(1,v/3)*.18*s+(isGK&&(gkDive||gkTarget)?-.5*s:0);
   ctx.strokeStyle=nmShade(shirt,.85);ctx.lineWidth=Math.max(1.2,.12*s);
   ctx.beginPath();ctx.moveTo(-.27*s,-1.45*s);ctx.lineTo(-.33*s-(isGK?.15*s:0),-1.0*s+ar);ctx.moveTo(.27*s,-1.45*s);ctx.lineTo(.33*s+(isGK?.15*s:0),-1.0*s-ar);ctx.stroke();
   ctx.fillStyle=skin;[-1,1].forEach(k=>{ctx.beginPath();ctx.arc(k*(.33*s+(isGK?.15*s:0)),-1.0*s+(k<0?ar:-ar),.06*s,0,7);ctx.fill()});
   // tronco low-poly
   ctx.fillStyle=shirt;ctx.beginPath();ctx.moveTo(-.29*s,-1.52*s);ctx.lineTo(.29*s,-1.52*s);ctx.lineTo(.21*s,-.98*s);ctx.lineTo(-.21*s,-.98*s);ctx.closePath();ctx.fill();
   ctx.fillStyle='rgba(0,0,0,.18)';ctx.beginPath();ctx.moveTo(0,-1.52*s);ctx.lineTo(.29*s,-1.52*s);ctx.lineTo(.21*s,-.98*s);ctx.lineTo(0,-.98*s);ctx.closePath();ctx.fill();
   ctx.fillStyle='rgba(255,255,255,.14)';ctx.beginPath();ctx.moveTo(-.29*s,-1.52*s);ctx.lineTo(-.05*s,-1.52*s);ctx.lineTo(-.12*s,-1.3*s);ctx.closePath();ctx.fill();
   if(p.team==='me'&&s>22){ctx.fillStyle=p.c2;ctx.font=`800 ${.3*s}px 'Saira Condensed',sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(String(S.num||9),0,-1.25*s)}
   // cabeça
   ctx.fillStyle=skin;ctx.beginPath();ctx.arc(0,-1.68*s,.13*s,0,7);ctx.fill();
   ctx.fillStyle='#2a1a10';ctx.beginPath();ctx.arc(0,-1.71*s,.135*s,Math.PI*1.05,Math.PI*1.95);ctx.fill();
   ctx.restore();
  }
  function drawBall(){const p=proj(ball.x,ball.d,ball.h+.11);if(!p)return;const r=Math.max(2.5,.11*p.s);
   ctx.fillStyle='#fdfdfd';ctx.beginPath();ctx.arc(p.x,p.y,r,0,7);ctx.fill();ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=Math.max(.6,r*.12);ctx.stroke();
   ctx.fillStyle='#1b1b1b';for(let i=0;i<3;i++){const a=ball.rot+i*2.1;ctx.beginPath();ctx.arc(p.x+Math.cos(a)*r*.5,p.y+Math.sin(a)*r*.5,r*.24,0,7);ctx.fill()}
   ctx.fillStyle='rgba(255,255,255,.6)';ctx.beginPath();ctx.arc(p.x-r*.35,p.y-r*.35,r*.25,0,7);ctx.fill()}
  function ring(x,d,r,col,lw=2.5){const p=proj(x,d,0);if(!p)return;ctx.strokeStyle=col;ctx.lineWidth=lw;ctx.beginPath();ctx.ellipse(p.x,p.y,r*p.s,r*p.s*.33,0,0,7);ctx.stroke()}
  function drawAim(){
   if(!aim||aim.len<8)return;
   if(!GK){const k=mkKick(aim,K==='header'&&!headed,false);
    const b=K==='header'?{x:me.x,d:me.d-.2,h:1.7,vx:k.vx,vd:k.vd,vh:k.vh,ax:0}:{x:ball.x,d:ball.d,h:ball.h,vx:k.vx,vd:k.vd,vh:k.vh,ax:0,dip:k.type==='kick'?5:0};
    const vis=k.type==='touch'?.6:clamp(.45+skill*.9,.5,1.4);const sp=simPath(b,vis,false);
    sp.p.forEach((q,i)=>{if(i%2)return;const pp=proj(q.x,q.d,q.h);if(!pp)return;const sh=proj(q.x,q.d,0);const a=1-i/sp.p.length*.7;ctx.fillStyle=`rgba(255,236,90,${a})`;ctx.strokeStyle='rgba(0,0,0,.35)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(pp.x,pp.y,Math.max(3,pp.s*.09),0,7);ctx.fill();ctx.stroke();if(sh&&q.h>.2){ctx.fillStyle=`rgba(0,0,0,${.25*a})`;ctx.beginPath();ctx.arc(sh.x,sh.y,Math.max(1,sh.s*.05),0,7);ctx.fill()}});
    if(sp.bounced)ring(sp.bounced.x,sp.bounced.d,.7,'rgba(255,240,120,.9)');
   }
   // elástico na tela
   const col=aim.len<H*.34*.27&&K!=='fk'&&!GK?'#7dff9a':aim.len<H*.34*.75?'#ffd34a':'#ff6a4a';
   ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=3;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(aim.sx,aim.sy);ctx.lineTo(aim.cx,aim.cy);ctx.stroke();ctx.setLineDash([]);
   ctx.fillStyle='rgba(255,255,255,.18)';ctx.beginPath();ctx.arc(aim.sx,aim.sy,22,0,7);ctx.fill();
   ctx.fillStyle=col;ctx.beginPath();ctx.arc(aim.cx,aim.cy,13,0,7);ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();
   if(!GK){const p=clamp(aim.len/(H*.34),0,1);ctx.strokeStyle=col;ctx.lineWidth=5;ctx.beginPath();ctx.arc(aim.sx,aim.sy,30,-Math.PI/2,-Math.PI/2+p*Math.PI*2);ctx.stroke();
    ctx.fillStyle='#fff';ctx.font="800 13px 'Saira Condensed',sans-serif";ctx.textAlign='center';ctx.fillText(K==='header'?'CABEÇADA':p<.27&&K!=='fk'?'CONDUZIR':K==='pass'||K==='long'||K==='cross'?(p<.6?'PASSE':'LANÇAR'):p>.85?'BOMBA':'CHUTE',aim.sx,aim.sy-40)}
  }
  function drawHUD(){
   // tempo
   const left=GK?1:clamp(1-T/tmax,0,1);if(!GK&&phase!=='intro'&&(!kicked||kicked==='touch')){ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(10,10,W-20,6);ctx.fillStyle=left<.3?'#ff5a4a':'#f2c443';ctx.fillRect(10,10,(W-20)*left,6)}
   if(curl&&kicked&&kicked!=='touch'&&T-kickT<1.4){ctx.fillStyle='rgba(0,0,0,.4)';ctx.fillRect(W/2-46,24,92,20);ctx.fillStyle='#fff';ctx.font="800 13px 'Saira Condensed',sans-serif";ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(curl>0?'EFEITO ↷':'↶ EFEITO',W/2,34)}
   if(banner&&banner.tmp&&banner.t>.7)banner=null;if(banner){banner.t+=1/60;const k=Math.min(1,banner.t*5);const sc=.6+.4*k+(banner.t<.25?Math.sin(banner.t*25)*.05:0);
    ctx.save();ctx.translate(W/2,H*.4);ctx.scale(sc,sc);ctx.font=`900 ${Math.min(64,W*.16)}px 'Saira Condensed',sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.lineWidth=8;ctx.strokeStyle='rgba(0,0,0,.55)';ctx.strokeText(banner.txt,0,0);ctx.fillStyle=banner.ok?'#f2c443':'#ffffff';ctx.fillText(banner.txt,0,0);ctx.restore()}
   if(phase==='intro'){ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(0,H*.34,W,H*.14);ctx.fillStyle='#fff';ctx.font=`900 ${Math.min(42,W*.11)}px 'Saira Condensed',sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(GK?'ATENÇÃO, GOLEIRO!':tag.toUpperCase()+'!',W/2,H*.41)}
   if(phase==='play'&&!aim&&!kicked&&T<2.2&&!(S.tips&&S.tips.nssm>2)){const t=(performance.now()/900)%1;const bp=GK?proj(gk.x,gk.d,1):proj(ball.x,ball.d,0);if(bp){const y0=bp.y+10,y1=bp.y+(GK?-40:70)*1;const yy=y0+(y1-y0)*Math.min(1,t*1.4);ctx.globalAlpha=1-t;ctx.font='30px sans-serif';ctx.textAlign='center';ctx.fillText('👆',bp.x+(GK?t*50:0),yy);ctx.globalAlpha=1}}
  }
  function render(){
   ctx.clearRect(0,0,W,H);drawField();
   if(cam.dir>0){drawNet();if(ball.d<0)drawBall();drawPosts()}
   // marcadores
   if(me&&!GK){ring(me.x,me.d,.55,'#f2c443',3)}
   P.filter(p=>p.team==='mate').forEach(m=>ring(m.x,m.d,.6,'rgba(120,220,255,.95)',2.5));
   if(K==='header'&&NM.cross&&!headed)ring(NM.cross.tx,NM.cross.td,.5,'rgba(255,255,255,.5)',2);
   // sombras
   P.forEach(p=>shadow(p.x,p.d,.32,.3));shadow(ball.x,ball.d,.13,clamp(.4-ball.h*.08,.08,.4));
   if(phase==='play')drawAim();
   const ents=P.map(p=>({d:p.d,f:()=>drawPlayer(p)}));if(!(cam.dir>0&&ball.d<0))ents.push({d:ball.d-.01,f:drawBall});
   ents.sort((a,b)=>(b.d-a.d)*cam.dir).forEach(e=>e.f());
   if(cam.dir<0){drawNet();drawPosts()}
   if(me&&!GK){const pp=proj(me.x,me.d,2.15);if(pp){ctx.fillStyle='#f2c443';ctx.beginPath();ctx.moveTo(pp.x-6,pp.y-8);ctx.lineTo(pp.x+6,pp.y-8);ctx.lineTo(pp.x,pp.y);ctx.closePath();ctx.fill()}}
   drawHUD();
  }
  function camUpdate(dt){
   if(GK)return;let fx,fd;
   if(K==='fk'&&!kicked){fx=ball.x*.8;fd=ball.d+9}
   else if(K==='header'&&!headed){fx=me.x*.9+(ball.x-me.x)*.22;fd=me.d+10.5}
   else if(owner===me||kicked==='touch'){fx=me.x*.88;fd=me.d+10.5}
   else{fx=ball.x*.85;fd=Math.max(ball.d+11,10)}
   fd=Math.max(fd,9.5);const k=Math.min(1,dt*(kicked&&kicked!=='touch'?2.2:3.5));cam.x+=(fx-cam.x)*k;cam.d+=(fd-cam.d)*k}

  // ---------- toque ----------
  const pt=e=>{const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)*(W/r.width),y:(e.clientY-r.top)*(H/r.height)}};
  let drag=null,curlLast=null;
  cv.addEventListener('pointerdown',e=>{e.preventDefault();try{cv.setPointerCapture(e.pointerId)}catch(_){}const p=pt(e);
   if(kicked&&kicked!=='touch'&&!ended&&T-kickT<1.2){curlLast=p;return}
   if(!canAim())return;aim={sx:p.x,sy:p.y,cx:p.x,cy:p.y,len:0};drag=true});
  cv.addEventListener('pointermove',e=>{const p=pt(e);
   if(curlLast&&kicked&&kicked!=='touch'){const dx=p.x-curlLast.x;curlLast=p;const add=dx*.16*cam.dir;ball.ax=clamp(ball.ax+add,-11,11);curl=Math.sign(ball.ax);return}
   if(drag&&aim){aim.cx=p.x;aim.cy=p.y;aim.len=Math.hypot(aim.cx-aim.sx,aim.cy-aim.sy)}});
  const up=e=>{if(curlLast){curlLast=null;return}if(!drag||!aim){drag=null;return}drag=null;const a=aim;
   if(a.len<14){aim=null;return}
   if(GK){aim=null;const r=cv.getBoundingClientRect();const g=proj(gk.x,gk.d,1);const dep=(cam.d-gk.d)*cam.dir;const s=F/dep;const wx=cam.x+(a.cx-W/2)/s*cam.dir;const wh=cam.h-(a.cy-hz)/s;gkTarget={x:clamp(wx,-3.6,3.6),h:clamp(wh,0,2.6)};return}
   if(K==='header'){lastAim={...a};aim=null;return}
   aim=null;doKick(a,false);
   S.tips=S.tips||{};S.tips.nssm=(S.tips.nssm||0)+1};
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',()=>{drag=null;aim=null;curlLast=null});
  // cabeçada: mantém a mira enquanto segura
  // ---------- loop ----------
  let last=performance.now(),raf=0,doneAt=null;
  function loop(now){
   const rdt=Math.min(.04,(now-last)/1000);last=now;
   if(phase==='intro'){tIntro+=rdt;if(tIntro>.85)phase='play'}
   ts=aim&&phase==='play'&&!(K==='header')?.22:(aim&&K==='header'?.5:1);
   if(phase==='end'){ts=.45;ended.t+=rdt}
   if(phase!=='intro'){const dt=rdt*ts;const n=3;for(let i=0;i<n;i++){if(phase==='end'&&ended.t>1.6)break;step(dt/n)}}
   camUpdate(rdt);render();
   if(phase==='end'&&ended.t>1.25&&!doneAt){doneAt=now;cancelAnimationFrame(raf);const r=ended;
    if(r.ok&&!GK&&typeof confetti==='function')try{confetti($ov,['#f2c443','#ffffff',myC[0]],1400)}catch(e){}
    swEnd(r.ok,r.txt,r.perfect).then(()=>res({ok:r.ok,perfect:!!r.perfect}));return}
   raf=requestAnimationFrame(loop)}
  raf=requestAnimationFrame(loop);
  NM.api={kickTo(tx,td,p,c){const ox=K==='header'?me.x:ball.x,od=K==='header'?me.d:ball.d;const dx0=tx-ox,dd0=td-od;const ang=Math.atan2(dx0,-dd0);const L=p*H*.34;const a={sx:0,sy:0,cx:-Math.sin(ang)*L,cy:Math.cos(ang)*L,len:L};if(K==='header'){lastAim=a;return}doKick(a,false);if(c)ball.ax=c},state:()=>({phase,T,owner:!!owner,ball:{...ball},me:me&&{x:me.x,d:me.d}}),P,gkSet(x,h){gkTarget={x,h}}};
 });
}
// ---------- liga o motor novo em tudo que usava os mini games de arrastar ----------
swipeShot=function(o){return nssMoment({...o,kind:o.kind==='fk'?'fk':o.kind==='header'?'header':'finish'})};
swipePass=function(o){return nssMoment({...o,kind:o.kind==='long'?'long':o.kind==='cross'?'cross':'pass'})};
swipeDribble=function(o){return nssMoment({...o,kind:'dribble',need:o.need||2})};
swipeReflex=function(o){return nssMoment({...o,kind:'keeper',skill:typeof skillOf==='function'?skillOf('REF'):.6})};
