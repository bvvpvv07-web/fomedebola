// ===================== PARTIDA COMPLETA (11 contra 11) =====================
// Joystick à esquerda e botões à direita, como nos jogos de futebol de celular. O seu time sempre ataca pra cima
// (gol em z=0) e defende o gol de baixo (z=105).
// • "Time todo": o controle passa pro jogador mais perto da bola (o seu craque tem a estrela embaixo).
// • "Só meu jogador": você é o seu craque o jogo inteiro; com a bola no pé de um companheiro você pede o passe.
// A mesma IA joga pelos dois times: a formação anda com a bola, dois apoios ficam perto de quem conduz, atacantes
// correm nas costas, o mais perto pressiona o dono da bola com outro na cobertura, o resto marca por zona.
// Tem cruzamento, cabeceio, desarme, falta, pênalti, lateral, escanteio, tiro de meta e um goleiro que fecha o ângulo.
const GLZ=105;
const MT={on:false,pl:[],T:[],st:'off',e:0,min:0,score:[0,0],ev:[],hs:{}};
const MI={jx:0,jy:0,mag:0,sprint:false,shoot:false,shootT0:0,press:false,jid:null,x0:0,y0:0,keys:{}};
const FORM={
 '433':[['GOL',0,.02],['LD',24,.22],['ZAG',8.5,.16],['ZAG',-8.5,.16],['LE',-24,.22],['VOL',0,.34],['MC',12,.42],['MC',-12,.42],['PD',23,.64],['PE',-23,.64],['ATA',0,.7]],
 '4231':[['GOL',0,.02],['LD',24,.22],['ZAG',8.5,.16],['ZAG',-8.5,.16],['LE',-24,.22],['VOL',7,.34],['MC',-7,.36],['MEI',0,.53],['PD',22,.61],['PE',-22,.61],['ATA',0,.71]],
 '442':[['GOL',0,.02],['LD',24,.22],['ZAG',8.5,.16],['ZAG',-8.5,.16],['LE',-24,.22],['VOL',7,.36],['MC',-7,.38],['MD',23,.45],['ME',-23,.45],['SA',-6,.64],['ATA',6,.69]]};
const MT_BK={GOL:'G',LD:'D',LE:'D',ZAG:'D',VOL:'M',MC:'M',MEI:'M',ME:'M',MD:'M',PE:'A',PD:'A',ATA:'A',SA:'A'};
const MT_NUM={GOL:[1],LD:[2],ZAG:[3,4],LE:[6],VOL:[5],MC:[8,15],MEI:[10],MD:[7],ME:[11],PD:[7],PE:[11],ATA:[9],SA:[10]};
const MT_NAMES=['Gabriel','Lucas','Mateus','Pedro','Rafael','Thiago','Bruno','Diego','Felipe','Caio','Vitor','Igor','André','Renan','Danilo','Éverton','Wesley','Júnior','Marcos','Rodrigo','Henrique','Alan','Fábio','Leandro','Otávio','Samuel'];
const MT_CAM=[{n:'Perto',h:12.5,d:13.5,la:2.6},{n:'Média',h:18,d:18,la:3.5},{n:'Longe',h:26,d:23,la:4.4}];
const mtGZ=s=>s===0?0:GLZ,mtOZ=s=>s===0?GLZ:0,mtFw=s=>s===0?-1:1;
const mtDep=(s,z)=>s===0?(GLZ-z)/GLZ:z/GLZ,mtZ=(s,d)=>s===0?GLZ-d*GLZ:d*GLZ;
const V3=(x,z)=>new T.Vector3(x,0,z);
const mtInBox=(s,x,z)=>Math.abs(x)<20.16&&(s===0?z>GLZ-16.5:z<16.5); // área do time s (a que ele defende)
function segD(px,pz,ax,az,bx_,bz){const dx=bx_-ax,dz=bz-az,L2=dx*dx+dz*dz||1;const t=clamp(((px-ax)*dx+(pz-az)*dz)/L2,0,1);return Math.hypot(ax+dx*t-px,az+dz*t-pz)}
// ---------- o segundo gol (z=105), com rede própria que também estufa ----------
const goalG2=goalG.clone();goalG2.rotation.y=Math.PI;goalG2.position.set(0,0,GLZ);scene.add(goalG2);
const NET2={vp:new Float32Array(NET.vb),geo:null,press:[],rip:null,dirty:false};
{const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(NET2.vp,3));g.setIndex(NET.geo.index);NET2.geo=g;const ln=goalG2.children.find(c=>c.isLineSegments);if(ln)ln.geometry=g}
const NETK=['vp','geo','press','rip','dirty'];
function withNet2(fn){const sv={};for(const k of NETK){sv[k]=NET[k];NET[k]=NET2[k]}try{fn()}finally{for(const k of NETK){NET2[k]=NET[k];NET[k]=sv[k]}}}
// girar 180° em volta do meio-campo leva o gol de baixo pro lugar do gol de cima: reaproveita trave, travessão e rede
function rot180(b){b.p.x=-b.p.x;b.p.z=GLZ-b.p.z;b.v.x=-b.v.x;b.v.z=-b.v.z;b.w.x=-b.w.x;b.w.z=-b.w.z}
function farCollide(b,dt){if(b.p.z<GLZ-1.3)return;rot180(b);withNet2(()=>{collideGoal(b);netCollide(b,dt)});rot180(b);
 const p=b.p,v=b.v;if(p.z>GLZ+4.25&&p.z<GLZ+4.9&&p.y<1.05+BR&&v.z>0&&!b.inGoal){p.z=GLZ+4.25;v.z=-v.z*.35;v.x*=.7}if(p.z>GLZ+6.2&&v.z>0){p.z=GLZ+6.2;v.z=-v.z*.25;v.x*=.6;v.y*=.6}}
const updNet2=()=>withNet2(updNet);
// ---------- física rápida pra mirar passes e chutes ----------
function rollSpeedAt(v0,D){let v=v0,x=0;const h=1/60;while(x<D){if(v<=.05)return 0;const a=1.6+.07*v+KA*cdOf(v)*v*v;v=Math.max(0,v-a*h);x+=v*h}return v}
function solveRoll(D,vA){let lo=1,hi=40;for(let i=0;i<16;i++){const m=(lo+hi)/2;if(rollSpeedAt(m,D)<vA)lo=m;else hi=m}return hi}
function rollTime(v0,D){let v=v0,x=0,t=0;const h=1/60;while(x<D&&t<6){if(v<=.05)return 9;const a=1.6+.07*v+KA*cdOf(v)*v*v;v=Math.max(0,v-a*h);x+=v*h;t+=h}return t}
function lobLand(fx,fz,vx,vy,vz){const b={p:new T.Vector3(fx,BR+.01,fz),v:new T.Vector3(vx,vy,vz),w:new T.Vector3()};const h=1/60;for(let t=0;t<5;t+=h){stepBall(b,h);if(t>.1&&b.p.y<=BR+.02)return{d:Math.hypot(b.p.x-fx,b.p.z-fz),t}}return{d:1e9,t:5}}
function mtLobVel(from,tx,tz,el,nz){const dx=tx-from.x,dz=tz-from.z,D=Math.hypot(dx,dz)||1,ux=dx/D,uz=dz/D,ce=Math.cos(el*DEG),se=Math.sin(el*DEG);let lo=4,hi=42;
 for(let i=0;i<12;i++){const s=(lo+hi)/2;if(lobLand(from.x,from.z,ux*ce*s,se*s,uz*ce*s).d<D)lo=s;else hi=s}
 const s=(lo+hi)/2*(1+gauss()*.035);const a=Math.atan2(uz,ux)+gauss()*nz*DEG;return new T.Vector3(Math.cos(a)*ce*s,se*s,Math.sin(a)*ce*s)}
function mtGroundVel(from,tx,tz,vA,nz){const dx=tx-from.x,dz=tz-from.z,D=Math.hypot(dx,dz)||1;const v0=solveRoll(D,vA)*(1+gauss()*.035);const a=Math.atan2(dz,dx)+gauss()*nz*DEG;return new T.Vector3(Math.cos(a)*v0,0,Math.sin(a)*v0)}
function crossAt(fx,fz,ux,uz,spd,el,gz){const ce=Math.cos(el*DEG),se=Math.sin(el*DEG);const b={p:new T.Vector3(fx,BR+.01,fz),v:new T.Vector3(ux*ce*spd,se*spd,uz*ce*spd),w:new T.Vector3()};const h=1/90;
 for(let t=0;t<3;t+=h){stepBall(b,h);if((gz===0&&b.p.z<=0)||(gz>0&&b.p.z>=gz))return{x:b.p.x,y:b.p.y,t};if(b.v.lengthSq()<.5)break}return{x:null,y:-1,t:9}}
function mtShotVel(from,tx,ty,gz,pw){const spd=15+17*pw;let ax=tx,el=6;
 for(let pass=0;pass<2;pass++){const dx=ax-from.x,dz=gz-from.z,hd=Math.hypot(dx,dz)||1,ux=dx/hd,uz=dz/hd;let lo=-3,hi=32;
  for(let i=0;i<10;i++){el=(lo+hi)/2;if(crossAt(from.x,from.z,ux,uz,spd,el,gz).y<ty)lo=el;else hi=el}
  el=(lo+hi)/2;const c=crossAt(from.x,from.z,ux,uz,spd,el,gz);if(c.x!=null)ax+=(tx-c.x)*.9}
 const dx=ax-from.x,dz=gz-from.z,hd=Math.hypot(dx,dz)||1,ce=Math.cos(el*DEG),se=Math.sin(el*DEG);return new T.Vector3(dx/hd*ce*spd,se*spd,dz/hd*ce*spd)}
function addNoise(v,deg,elDeg){const a=gauss()*deg*DEG,c=Math.cos(a),s=Math.sin(a),x=v.x,z=v.z;v.x=x*c-z*s;v.z=x*s+z*c;if(elDeg){const sp=v.length();v.y+=gauss()*elDeg*DEG*sp}return v}
// ---------- montar os times ----------
function mtPools(src){const P={G:[],D:[],M:[],A:[]};if(src)for(const k in P)if(Array.isArray(src[k]))P[k]=src[k].slice();return P}
function mtName(P,pos,hero){if(hero)return MT.cfg.heroName||'Você';const k=MT_BK[pos]||'M';if(P[k]&&P[k].length)return P[k].shift();if(k!=='G')for(const kk of['M','A','D'])if(P[kk].length)return P[kk].shift();return pick(MT_NAMES)}
function mtTeam(side,form,q,names){const t={side,form,q,pl:[],press:null,cover:null,sup:[],chase:null,att:false,pt:0};const used={};const P=mtPools(names);
 FORM[form].forEach(([pos,x,d],i)=>{const gk=pos==='GOL';const hero=side===0&&!MT.hero&&MT.ctrl!=='auto'&&pos===MT.heroPos;
  const k=used[pos]||0;used[pos]=k+1;let num=(MT_NUM[pos]||[])[k]||(13+i);const look=hero?heroLook(num):{num,skin:pick(SKINS),hair:pick(HAIRS)};
  const kit=side===0?(gk?GKU:OUR):(gk?GKC:THEM);const p=makePlayer({...kit,team:side===0?'us':'them',...look,gk});
  p.side=side;p.pos0=pos;p.slot={x:side===0?x:-x,d};p.hero=hero;if(hero){MT.hero=p;p.star.visible=true}
  const pq=clamp(q+gauss()*.07,.03,1);p.q=pq;const A=hero?MT.cfg.heroAttrs:null;const at=k2=>A&&A[k2]!=null?clamp((A[k2]-40)/55,.05,1):clamp(pq+gauss()*.08,.03,1);
  p.spd=6.5+1.6*at('VEL');p.pas=at('PAS');p.sho=at('FIN');p.dri=at('DRI');p.tck=at('DEF');p.gkq=gk?at('REF'):0;
  p.name=mtName(P,pos,hero);p.cd=0;p.down=0;p.tkCD=0;p.dec=0;p.hT=0;p.tgt=V3(x,mtZ(side,d));p.urg=.7;p.run=null;p.feint=0;p.lunge=null;p.astFrom=null;p.plan=null;p.call=0;p.oneT=null;
  t.pl.push(p);MT.pl.push(p)});
 // o número do seu craque não repete no time
 if(side===0&&MT.hero){const h=MT.hero;for(const p of t.pl)if(p!==h&&p.num===h.num){p.num=h.num===10?20:10}}
 return t}
function mtClear(){mtCrowd(false);for(const p of MT.pl)disposePlayer(p);MT.pl=[];MT.T=[];MT.hero=null;MT.ctl=null;MT.on=false;MT.st='off';MT.owner=null;MT.gkHold=null;MT.pass=null;MT.shot=null;MT.rs=null;MTR.visible=false;MTT.visible=false;
 $('mt').hidden=true;['mtPm','mtIn','mtEnd'].forEach(i=>$(i).hidden=true);mtJoyReset()}
function mtStart(cfg){cfg=cfg||{};mtClear();clearScene();S.mode='match';const M=MT;M.cfg=cfg;M.on=true;M.ctrl=cfg.ctrl==='solo'?'solo':cfg.ctrl==='auto'?'auto':'team';
 M.heroPos=cfg.heroPos||'ATA';const fu=M.heroPos==='MEI'?'4231':['SA','ME','MD'].includes(M.heroPos)?'442':'433';const ft=cfg.themForm||pick(['433','442','4231']);
 const qOf=s=>clamp(((s||72)-48)/42,.08,1);const dk=cfg.diffK||0;
 M.T=[mtTeam(0,fu,qOf(cfg.usS),cfg.names&&cfg.names.us),mtTeam(1,ft,clamp(qOf(cfg.themS)+dk,.05,1),cfg.names&&cfg.names.them)];
 M.score=[(cfg.pre&&cfg.pre[0])|0,(cfg.pre&&cfg.pre[1])|0];M.start=clamp(cfg.startMin|0,0,85);M.halfLen=cfg.halfLen||90;M.len=Math.max(40,M.halfLen*2*(90-M.start)/90);
 M.e=0;M.path=null;M.pathAge=0;M.pathT=0;M.min=M.start;M.half=M.start>=45?2:1;M.ev=[];M.hs={g:0,a:0,sh:0,on:0,pa:0,pok:0,tk:0,int:0,sv:0,lost:0,tch:0};M.shots=[0,0];M.paused=false;M.simd=false;
 try{const v=localStorage.getItem('ml_mcam');M.camPre=v!=null?clamp(+v,0,2):1}catch(e){M.camPre=1}
 M.names=[cfg.usName||'Fome FC',cfg.themName||'Rivais'];M.abbr=[cfg.usAbbr||M.names[0].slice(0,3).toUpperCase(),cfg.themAbbr||M.names[1].slice(0,3).toUpperCase()];
 $('mtTa').textContent=M.abbr[0];$('mtTb').textContent=M.abbr[1];$('mtTa').style.background=OUR.shirt;$('mtTb').style.background=THEM.shirt;$('mtTa').style.color=mtInk(OUR.shirt);$('mtTb').style.color=mtInk(THEM.shirt);
 ['menu','top','hint','after','contact','edges','bCam','bAng','intro'].forEach(i=>{const el=$(i);if(el)el.hidden=true});$('banner').className='';$('banner').innerHTML='';LINO.g.visible=false;hideArrow();
 $('mt').hidden=false;M.first=cfg.kick!=null?cfg.kick:(Math.random()<.5?0:1);mtKickoff(M.first);$('mtQuit').hidden=!!S.embed;M.tipT=M.start>0?4:7;
 mtLabels(true);mtScore();mtSnapCam();
 if(cfg.intro){M.st0=M.st;M.st='intro';mtIntro()}else mtTip(mtHowTxt(),6)}
function mtInk(hex){const h=(hex||'#000').replace('#','');const n=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16)||0;const r=n>>16&255,g=n>>8&255,b=n&255;return(r*.3+g*.59+b*.11)>150?'#10251a':'#ffffff'}
function mtHowTxt(){return MT.ctrl==='solo'?'Você é o <b>★</b>. Sem a bola: <b>PEDIR</b> chama o passe. Com ela: <b>PASSE</b>, <b>LANÇAR</b>, <b>CHUTE</b> (segure pra força).':'Joystick pra correr. <b>PASSE</b>, <b>LANÇAR</b> e <b>CHUTE</b> (segure pra força). Sem a bola: <b>TROCAR</b> e <b>BOTE</b>.'}
function mtKickoff(side){const M=MT;M.st='kickoff';M.kick=side;M.owner=null;M.gkHold=null;M.poss=side;M.pass=null;M.shot=null;M.rs=null;M.lastTouch=null;M.lastKick=null;M.lastShooter=null;
 const b=S.ball;b.p.set(0,BR,GLZ/2);b.v.set(0,0,0);b.w.set(0,0,0);b.inGoal=false;
 for(const p of M.pl){const d=p.gk?.02:Math.min(p.slot.d*.84,.45);p.pos.set(p.gk?0:p.slot.x*.92,0,mtZ(p.side,d));p.vel.set(0,0,0);p.down=0;p.cd=0;p.lunge=null;p.cele=null;p.dive=0;p.diveT=0;p.hold=false;p.run=null;p.plan=null;p.feint=0;p.jump=0;p.oneT=null;p.tgt.copy(p.pos);setFacingNow(p,0,mtFw(p.side));p.faceBall=false}
 for(const p of M.T[1-side].pl){const dz=p.pos.z-GLZ/2,L=Math.hypot(p.pos.x,dz);if(!p.gk&&L<9.8){const k=9.8/(L||1);p.pos.x*=k;p.pos.z=GLZ/2+dz*k}}
 const t=M.T[side];const fw=t.pl.filter(p=>MT_BK[p.pos0]==='A'||p.pos0==='MEI').sort((a,c)=>Math.abs(a.slot.x)-Math.abs(c.slot.x));const k=fw[0]||t.pl[10],k2=fw[1]||t.pl[9];
 k.pos.set(0,0,GLZ/2-mtFw(side)*.62);setFacingNow(k,0,mtFw(side));k2.pos.set(side===0?-3.5:3.5,0,GLZ/2-mtFw(side)*1.2);M.kicker=k;M.kick2=k2;
 M.wait=(side===0&&M.ctrl==='team')||(M.ctrl==='solo'&&k===M.hero)?3.4:R(.8,1.3);M.koUser=M.wait>3;if(M.ctrl==='team'&&side===0)M.ctl=k;sfx('whistle');mtLabels(true)}
// ---------- quem você controla ----------
function mtETA(p){const M=MT,path=M.path,b=S.ball.p;const sp=p.spd*.95,rx=.12+(p.down>0?p.down:0);
 if(path&&path.length&&!M.owner&&!M.gkHold){for(const q of path){const t=q.t-M.pathAge;if(t<0)continue;if(q.y>(p.gk?2.4:1.9))continue;const d=Math.hypot(q.x-p.pos.x,q.z-p.pos.z)-.75;if(d<=sp*Math.max(0,t-rx))return{t:Math.max(t,0),x:q.x,z:q.z}}const q=path[path.length-1];return{t:(q.t-M.pathAge)+Math.hypot(q.x-p.pos.x,q.z-p.pos.z)/sp,x:q.x,z:q.z}}
 return{t:Math.hypot(b.x-p.pos.x,b.z-p.pos.z)/sp,x:b.x,z:b.z}}
function mtPickCtl(dt){const M=MT;M.swT=Math.max(0,(M.swT||0)-dt);
 if(M.ctrl==='solo'){M.ctl=M.hero;return}if(M.ctrl==='auto'){M.ctl=null;return}
 if(M.st==='restart'&&M.rs){if(M.rs.side===0)M.ctl=M.rs.taker;return}
 if(M.st==='kickoff'){if(M.kick===0)M.ctl=M.kicker;return}
 if(M.owner&&M.owner.side===0){M.ctl=M.owner;return}if(M.gkHold&&M.gkHold.side===0){M.ctl=M.gkHold;return}
 if(M.pass&&M.pass.from.side===0&&M.pass.to&&M.pass.to.side===0){M.ctl=M.pass.to;return}
 if(M.swT>0&&M.ctl&&!M.ctl.gk)return;
 let best=null,bt=1e9;for(const p of M.T[0].pl){if(p.gk)continue;const e=mtETA(p).t+(p.down>0?.6:0);if(e<bt){bt=e;best=p}}
 if(!M.ctl||M.ctl.gk||M.ctl.side!==0)M.ctl=best;else if(best&&best!==M.ctl&&!M.ctl.lunge){const ec=mtETA(M.ctl).t;if(ec-bt>.55)M.ctl=best}}
function mtSwitch(){const M=MT;if(M.ctrl!=='team')return;const b=S.ball.p;let best=null,bd=1e9;for(const p of M.T[0].pl){if(p.gk||p===M.ctl)continue;const d=Math.hypot(p.pos.x-b.x,p.pos.z-b.z);if(d<bd){bd=d;best=p}}if(best){M.ctl=best;M.swT=1;sfx('tick')}}
// ---------- direção do joystick (a câmera olha sempre pro gol de cima: direita da tela = +x, cima = -z) ----------
function mtJoyDir(p){if(MI.mag>.2)return V3(MI.jx/MI.mag,MI.jy/MI.mag);const f=V3(-Math.sin(p.face),-Math.cos(p.face));return f}
// ---------- planejamento tático (a cada 0,15 s) ----------
function mtPlan(t){const M=MT,b=S.ball.p,s=t.side,o=M.T[1-s],own=M.owner;
 const att=own?own.side===s:M.gkHold?M.gkHold.side===s:M.poss===s;t.att=att;t.press=null;t.cover=null;t.sup=[];t.chase=null;
 const out=t.pl.filter(p=>!p.gk);
 if(M.st==='play'){
  if(own&&own.side!==s){const r=out.filter(p=>p.down<=0).map(p=>({p,d:Math.hypot(p.pos.x-b.x,p.pos.z-b.z)})).sort((a,c)=>a.d-c.d);if(r[0])t.press=r[0].p;if(r[1])t.cover=r[1].p}
  else if(!own&&!M.gkHold){if(M.pass&&M.pass.to&&M.pass.to.side===s&&!M.pass.to.gk)t.chase=M.pass.to;else{let best=null,bt=1e9;for(const p of out){const e=mtETA(p).t+(p.down>0?.5:0);if(e<bt){bt=e;best=p}}t.chase=best}
   // o outro time manda alguém cortar se chegar antes
   if(M.pass&&M.pass.to&&M.pass.to.side!==s){const et=mtETA(M.pass.to).t;let best=null,bt=1e9;for(const p of out){const e=mtETA(p).t;if(e<bt){bt=e;best=p}}if(best&&bt<et+.15)t.chase=best}}
  else if(own&&own.side===s){t.sup=out.filter(p=>p!==own).map(p=>({p,d:Math.hypot(p.pos.x-own.pos.x,p.pos.z-own.pos.z)})).sort((a,c)=>a.d-c.d).slice(0,2).map(x=>x.p)}}
 const bd=mtDep(s,b.z);
 // posição de zona de cada um
 for(const p of out){const bk=MT_BK[p.pos0];let d=att?(-.047+.686*p.slot.d+.535*bd):(-.07+.588*p.slot.d+.5*bd);if(bk==='A')d+=att?.03:.06;d=clamp(d,.04,att?.95:.86);
  const wide=Math.abs(p.slot.x)>18;let x=p.slot.x*(att?(wide?1.05:.85):.66)+b.x*(att?.2:.34);p.zone=V3(clamp(x,-32,32),mtZ(s,d));p.markOn=null}
 // marcação: cada atacante perigoso perto de alguém da linha de trás/meio ganha um marcador (do lado do gol)
 if(!att&&M.st==='play'){const thr=o.pl.filter(q=>!q.gk&&q!==own&&mtDep(o.side,q.pos.z)>.38).sort((a,c)=>mtDep(o.side,c.pos.z)-mtDep(o.side,a.pos.z));const free=new Set(out.filter(p=>p!==t.press&&p!==t.cover));
  for(const q of thr){let best=null,bdd=11;for(const p of free){const d=Math.hypot(q.pos.x-p.zone.x,q.pos.z-p.zone.z);if(d<bdd){bdd=d;best=p}}if(best){best.markOn=q;free.delete(best)}}}
 for(const p of out){let tx=p.zone.x,tz=p.zone.z,urg=.72;const bk=MT_BK[p.pos0];
  if(M.st==='restart'&&M.rs){const r=mtRestartSpot(p,t);if(r){tx=r.x;tz=r.z;urg=.9}}
  else if(M.st==='kickoff'){tx=p.pos.x;tz=p.pos.z}
  else if(t.chase===p){const e=mtETA(p);tx=e.x;tz=e.z;urg=1}
  else if(t.press===p&&own){const gx=-own.pos.x,gz=mtOZ(s)-own.pos.z,L=Math.hypot(gx,gz)||1;const dd=Math.hypot(own.pos.x-p.pos.x,own.pos.z-p.pos.z);const k=dd>4?.6:1.7;tx=own.pos.x+gx/L*k+own.vel.x*.25;tz=own.pos.z+gz/L*k+own.vel.z*.25;urg=dd>3?1:.9}
  else if(t.cover===p&&own){const gx=-own.pos.x,gz=mtOZ(s)-own.pos.z,L=Math.hypot(gx,gz)||1;tx=own.pos.x+gx/L*5.5;tz=own.pos.z+gz/L*5.5;urg=.86}
  else if(att&&own&&t.sup.includes(p)){const sp=mtSupport(p,own,t,t.sup.indexOf(p));tx=sp.x;tz=sp.z;urg=.82}
  else if(att){if(p.run&&p.run.t>0){tx=p.run.x;tz=p.run.z;urg=1}
   else if(own&&(bk==='A'||p.pos0==='MEI'||((p.pos0==='LD'||p.pos0==='LE'||p.pos0==='ME'||p.pos0==='MD')&&Math.random()<.35))&&Math.random()<.035&&bd>.3&&bd<.85){const lim=mtLastLine(s);const rd=Math.min(.95,Math.max(mtDep(s,p.pos.z),lim)+R(.08,.18));p.run={x:clamp(p.zone.x+R(-6,6)-p.zone.x*.25,-30,30),z:mtZ(s,rd),t:R(1.4,2.3)};tx=p.run.x;tz=p.run.z;urg=1}}
  else if(p.markOn){const q=p.markOn,vx=-q.pos.x,vz=mtOZ(s)-q.pos.z,L=Math.hypot(vx,vz)||1;tx=lerp(tx,q.pos.x+vx/L*1.5,.75);tz=lerp(tz,q.pos.z+vz/L*1.5,.75);urg=.85}
  p.tgt.set(clamp(tx,-33.5,33.5),0,clamp(tz,.5,GLZ-.5));p.urg=urg}}
// linha mais adiantada dos defensores adversários (pra corrida nas costas ficar perto dela)
function mtLastLine(s){let m=0;for(const q of MT.T[1-s].pl){if(q.gk)continue;m=Math.max(m,mtDep(s,q.pos.z))}return clamp(m,.2,.95)}
function mtSupport(p,o,t,idx){const s=t.side,fw=mtFw(s),opp=MT.T[1-s].pl;let best=null,bs=-1e9;
 const angs=idx===0?[-38,38,-62,62,0]:[-100,100,-145,145,-75,75];const dist=idx===0?12:9.5;
 for(const a of angs){const r=a*DEG,x=clamp(o.pos.x+Math.sin(r)*dist,-32,32),z=clamp(o.pos.z+Math.cos(r)*dist*fw,1.5,GLZ-1.5);let open=9,lane=6;
  for(const q of opp){open=Math.min(open,Math.hypot(q.pos.x-x,q.pos.z-z));lane=Math.min(lane,segD(q.pos.x,q.pos.z,o.pos.x,o.pos.z,x,z))}
  const sc=open*.5+lane*.8-Math.hypot(x-p.pos.x,z-p.pos.z)*.07+(mtDep(s,z)-mtDep(s,o.pos.z))*4;if(sc>bs){bs=sc;best=V3(x,z)}}return best}
// posições das bolas paradas
function mtRestartSpot(p,t){const rs=MT.rs;if(!rs)return null;if(p===rs.taker)return V3(p.pos.x,p.pos.z);if(p.fix)return V3(p.fix.x,p.fix.z);
 if(rs.type==='throw'||rs.type==='gk'||rs.type==='fk')return null;return null}
// ---------- quem conduz (IA) ----------
function mtPressure(p){let m=99;for(const q of MT.T[1-p.side].pl){const d=Math.hypot(q.pos.x-p.pos.x,q.pos.z-p.pos.z);if(d<m)m=d}return m}
function mtLane(ax,az,bx_,bz,s){let m=9;for(const q of MT.T[1-s].pl){m=Math.min(m,segD(q.pos.x,q.pos.z,ax,az,bx_,bz))}return m}
function mtBestPass(p,dir,mode){const M=MT,b=S.ball.p,s=p.side,opp=M.T[1-s].pl;let best=null,bs=-1e9;
 for(const m of M.T[s].pl){if(m===p||m.down>0)continue;const vx=m.pos.x-b.x,vz=m.pos.z-b.z,d=Math.hypot(vx,vz);if(d<4||d>(dir?48:42))continue;
  let ang=0;if(dir){ang=Math.acos(clamp((vx*dir.x+vz*dir.z)/d,-1,1))/DEG;if(ang>52)continue}
  const lx=m.pos.x+m.vel.x*.5,lz=m.pos.z+m.vel.z*.5;let open=8,lane=6;for(const q of opp){open=Math.min(open,Math.hypot(q.pos.x-lx,q.pos.z-lz));lane=Math.min(lane,segD(q.pos.x,q.pos.z,b.x,b.z,lx,lz))}
  const prog=(mtDep(s,m.pos.z)-mtDep(s,b.z))*GLZ;let kind='ground';
  let sc=dir?(-ang*.09+open*.05+lane*.12-d*.008):(prog*.055+Math.min(open,7)*.13+Math.min(lane,4)*.28-(d>30?(d-30)*.05:0)-(lane<1.2?2:lane<2?.8:0)-(m.gk?1:0)-(mtDep(s,m.pos.z)<.15&&!m.gk?.3:0));
  // corrida nas costas: bola em profundidade
  if(m.run&&m.run.t>0&&!m.gk){const th=mtThroughPt(p,m);let l2=6;for(const q of opp)l2=Math.min(l2,segD(q.pos.x,q.pos.z,b.x,b.z,th.x,th.z));const p2=(mtDep(s,th.z)-mtDep(s,b.z))*GLZ;const sc2=dir?sc+.2:p2*.05+Math.min(l2,4)*.28-(l2<1.2?1.3:0);if(sc2>sc){sc=sc2;kind='through'}}
  if(!dir&&lane<1&&open>6&&d>26){const sc3=prog*.045+open*.1-.6;if(sc3>sc){sc=sc3;kind='lob'}}
  if(!dir&&prog<-2&&Math.hypot(b.x,b.z-mtGZ(s))<30)sc-=.9;
  if(s===0&&M.ctrl==='solo'&&m===M.hero&&M.hero.call>0){sc+=1.6;if(M.hero.callK==='run')kind='through'}
  if(sc>bs){bs=sc;best={m,score:sc,kind,d}}}
 return best}
function mtThroughPt(p,m){const s=p.side,fw=mtFw(s);const lead=R(5,9);return V3(clamp(m.pos.x+m.vel.x*.4-m.pos.x*.12,-31,31),clamp(m.pos.z+fw*lead+m.vel.z*.3,2,GLZ-2))}
function mtCarrier(p,dt){const M=MT,b=S.ball.p,s=p.side,gz=mtGZ(s);p.hT+=dt;p.dec-=dt;
 if(p.dec<=0){p.dec=R(.15,.28);const dG=Math.hypot(b.x,b.z-gz),press=mtPressure(p);
  if(p.gk){const bp=mtBestPass(p,null);if(p.hT>.5||press<6){if(bp&&bp.score>-.2&&bp.d<34)return mtPass(p,bp.m,bp.kind);return mtBoot(p)}}
  else{
   const D=M.dbg||(M.dbg={});D.dec=(D.dec||0)+1;if(dG<27)D.near=(D.near||0)+1;if(dG<27&&Math.abs(b.x)<21)D.nearC=(D.nearC||0)+1;
   if(dG<28&&Math.abs(b.x)<21&&p.hT>.12){D.cand=(D.cand||0)+1;let ps=dG<9?.9:dG<15?.7:dG<20?.4:.18;ps*=.6+.8*p.sho;if(p.hT>1)ps*=1.6;const ang=Math.abs(b.x)/Math.max(1,Math.abs(b.z-gz));if(ang>1.1)ps*=.35;const ln=mtLane(b.x,b.z,0,gz,s);if(ln<1)ps*=.45;else if(ln>1.8&&dG<20)ps=Math.max(ps,.6);if(press<1.6)ps*=1.3;if(Math.random()<ps)return mtAIShoot(p)}
   if(Math.abs(b.x)>18&&mtDep(s,b.z)>.76&&p.hT>.25&&Math.random()<.5){if(mtCross(p))return}
   const bp=mtBestPass(p,null);const urgent=press<1.05||p.hT>3.4;
   // espaço na frente: conduz em vez de tocar
   let room=9;for(const q of M.T[1-s].pl){const qx=q.pos.x-p.pos.x,qz=(q.pos.z-p.pos.z)*mtFw(s);if(qz>-1&&qz<10&&Math.abs(qx)<5)room=Math.min(room,Math.hypot(qx,qz))}
   const th=urgent?-.5:(1.55-p.q*.35)+(p.hT<.9?.7:0)+(room>6?1.1:room>3.5?.4:0);
   if(bp&&bp.score>th&&p.hT>(urgent?.22:.45))return mtPass(p,bp.m,bp.kind);
   if(mtDep(s,b.z)<.17&&press<2.6)return mtBoot(p)}
  // conduzir: pro gol, desviando de quem está na frente
  let dx=-b.x*.35,dz=(gz-b.z);const L=Math.hypot(dx,dz)||1;dx/=L;dz/=L;let ax=0,az=0;
  for(const q of M.T[1-s].pl){const qx=q.pos.x-p.pos.x,qz=q.pos.z-p.pos.z,d=Math.hypot(qx,qz);if(d>5||d<.01)continue;const front=(qx*dx+qz*dz)/d;if(front<-.2)continue;const k=1.7/(d+.4);ax-=qx/d*k;az-=qz/d*k}
  dx+=ax;dz+=az;if(Math.abs(p.pos.x)>29)dx-=Math.sign(p.pos.x)*.8;const L2=Math.hypot(dx,dz)||1;p.drv=V3(dx/L2,dz/L2);
  p.sprint=press>3.5&&Math.random()<.6;
  if(press<1.9&&p.feint<=0&&Math.random()<.25+.45*p.dri){p.feint=.42;p.feintDir=Math.random()<.5?1:-1}}
 let v=p.spd*(p.sprint?.88:.7);let dx=(p.drv||V3(0,mtFw(s))).x,dz=(p.drv||V3(0,mtFw(s))).z;
 if(p.feint>0){const fx=-dz*p.feintDir,fz=dx*p.feintDir;dx=dx*.5+fx;dz=dz*.5+fz;const L=Math.hypot(dx,dz)||1;dx/=L;dz/=L;v=p.spd*.9}
 mtDrive(p,dx,dz,v,dt,8)}
// ---------- toques na bola ----------
function mtKick(p,vel,w,kind,to){const M=MT,b=S.ball;b.v.copy(vel);b.w.copy(w||new T.Vector3());b.p.y=Math.max(b.p.y,BR);b.inGoal=false;
 M.owner=null;M.gkHold=null;p.hT=0;p.cd=.34;M.lastTouch=p;M.lastKick={by:p,kind,t:S.now};M.poss=p.side;
 M.pass=(kind==='shot'||kind==='head'||kind==='clear'||kind==='poke')?null:{from:p,to:to||null,kind,t:0};if(to)to.run=null;
 p.kickT=S.now-.19;p.kickTc=.24;p.kickKind=kind==='head'?'head':'foot';const d=Math.hypot(vel.x,vel.z);if(d>.1&&kind!=='head'){p.face=Math.atan2(-vel.x/d,-vel.z/d);p.g.rotation.y=p.face}
 M.path=predict(b,3.2);M.pathAge=0;M.pathT=0;sfx('kick',clamp(vel.length()/30,.15,1));
 if(p===M.hero&&['ground','through','lob','cross','throw'].includes(kind))M.hs.pa++;
 if(M.ctrl==='team'&&p.side===0&&to&&to.side===0)M.ctl=to}
function mtPassNoise(p){return(1.1+5.2*(1-p.pas))*(mtPressure(p)<1.6?1.5:1)}
function mtPass(p,m,kind){const M=MT,b=S.ball.p;if(kind==='through'){const th=mtThroughPt(p,m);m.run={x:th.x,z:th.z,t:2.6};const D=Math.hypot(th.x-b.x,th.z-b.z);const lane=mtLane(b.x,b.z,th.x,th.z,p.side);
  const v=D>27||lane<1.1?mtLobVel(b,th.x,th.z,D>34?34:28,mtPassNoise(p)*.8):mtGroundVel(b,th.x,th.z,clamp(6.5+D*.14,6.5,11),mtPassNoise(p));return mtKick(p,v,null,'through',m)}
 const d0=Math.hypot(m.pos.x-b.x,m.pos.z-b.z);let vA=clamp(8+d0*.2,8,14.5);const tA=rollTime(solveRoll(d0,vA),d0);const lx=m.pos.x+m.vel.x*tA*.85,lz=m.pos.z+m.vel.z*tA*.85;
 if(kind==='lob'){const v=mtLobVel(b,lx,lz,30,mtPassNoise(p)*.8);return mtKick(p,v,null,'lob',m)}
 const D=Math.hypot(lx-b.x,lz-b.z);vA=clamp(8+D*.2,8,14.5);return mtKick(p,mtGroundVel(b,lx,lz,vA,mtPassNoise(p)),new T.Vector3(),'ground',m)}
function mtSpacePass(p,dir,dist,kind){const b=S.ball.p;const tx=clamp(b.x+dir.x*dist,-33,33),tz=clamp(b.z+dir.z*dist,1,GLZ-1);
 const v=kind==='lob'?mtLobVel(b,tx,tz,30,mtPassNoise(p)):mtGroundVel(b,tx,tz,4.5,mtPassNoise(p));mtKick(p,v,null,kind==='lob'?'lob':'ground',null)}
function mtCross(p,force){const M=MT,b=S.ball.p,s=p.side;let best=null,bs=-1e9;
 for(const m of M.T[s].pl){if(m===p||m.gk)continue;if(mtDep(s,m.pos.z)<.78||Math.abs(m.pos.x)>15)continue;let open=8;for(const q of M.T[1-s].pl)open=Math.min(open,Math.hypot(q.pos.x-m.pos.x,q.pos.z-m.pos.z));const sc=open-Math.abs(m.pos.x)*.08;if(sc>bs){bs=sc;best=m}}
 let tx,tz;if(best){tx=clamp(best.pos.x+best.vel.x*1.1,-9,9);tz=mtZ(s,clamp(mtDep(s,best.pos.z+best.vel.z*1.1),.86,.95))}else{tx=R(-5,5);tz=mtZ(s,R(.87,.92))}
 if(!best&&!force&&Math.random()<.5)return false;
 const v=mtLobVel(b,tx,tz,R(20,26),mtPassNoise(p)*.9);if(best)best.run={x:tx,z:tz,t:2.2};mtKick(p,v,new T.Vector3(0,-Math.sign(b.x)*R(4,9),0),'cross',best);return true}
function mtBoot(p){const b=S.ball.p,s=p.side,fw=mtFw(s);const a=R(-28,28)*DEG;const D=R(32,48);const tx=clamp(b.x*.6+Math.sin(a)*D*.5,-30,30),tz=clamp(b.z+fw*D,4,GLZ-4);
 const v=mtLobVel(b,tx,tz,R(30,40),6);mtKick(p,v,null,'clear',null)}
function mtAIShoot(p){const M=MT,b=S.ball.p,s=p.side,gz=mtGZ(s),gk=M.T[1-s].pl[0];let side=gk&&gk.pos.x>b.x*.15?-1:1;if(Math.random()<.28)side=-side;
 const tx=side*R(.42,.9)*(GW-.35),ty=Math.random()<.55?R(.2,.8):R(1.1,2.6);const dG=Math.hypot(b.x,b.z-gz);const pw=dG<12?R(.5,.8):R(.72,.97);mtShoot(p,tx,ty,pw)}
function mtShoot(p,tx,ty,pw){const M=MT,b=S.ball.p,s=p.side,gz=mtGZ(s);const v=mtShotVel(b,tx,ty,gz,pw);const press=mtPressure(p);
 const nz=(1+4.4*(1-p.sho)+3*Math.pow(pw,3))*(press<1.5?1.45:1)*(Math.hypot(b.x,b.z-gz)>22?1.2:1);addNoise(v,nz,.7+2.4*(1-p.sho)+5*Math.max(0,pw-.78));
 M.shots[s]++;if(p===M.hero)M.hs.sh++;mtKick(p,v,new T.Vector3(),'shot',null);M.lastShooter={p,t:S.now,side:s};M.shot={by:p,side:s,t:0};mtPlanSave(M.T[1-s].pl[0],p)}
// ---------- goleiro ----------
function mtPlanSave(gk,sh){const M=MT;if(!gk)return;gk.plan=null;const gz=mtOZ(gk.side),path=M.path||[];let c=null;
 for(const q of path){if((gz===0&&q.z<=0)||(gz>0&&q.z>=GLZ)){c=q;break}}
 const on=c&&Math.abs(c.x)<GW-.05&&c.y<GH-.05;if(M.shot)M.shot.on=!!on;if(on&&sh===M.hero)M.hs.on++;
 if(!c||Math.abs(c.x)>GW+1.6||c.y>GH+1)return;
 const sp=S.ball.v.length();const react=.24-.11*gk.gkq;const dx=c.x-gk.pos.x;const avail=Math.max(0,c.t-react);const reach=1.05+Math.min(3.2,avail*6.4);
 let ps=Math.abs(dx)<=reach&&c.y<GH+.25?clamp(.78-Math.abs(dx)/(GW*1.15)*.5-(sp>27?.16:sp>22?.08:0)+.28*(gk.gkq-.5)-(c.y>2.4?.1:0)-(c.t<.35?.18:0),.06,.95):.02;
 if(!on)ps=Math.min(ps,.5);if(gk===M.hero&&MT.gkBoost>S.now)ps=clamp(ps+.28,0,.97);
 const save=Math.random()<ps;gk.plan={x:c.x,y:c.y,t:c.t,react,tt:0,go:false,save,catch:save&&sp<21&&Math.abs(dx)<1.5&&Math.random()<.65,done:false,on};if(gk===M.hero&&M.ctrl==='solo'){M.gkAsk=S.now;mtTip('Chute! Toque <b>DEFESA</b>!',1.2)}}
function mtGK(gk,dt){const M=MT,s=gk.side,b=S.ball.p,gz=mtOZ(s);gk.a.look=b;
 if(gk.dive){gk.diveT+=dt;const t=gk.diveT;if(t>.07&&t<.62)gk.pos.x+=gk.dive*gk.diveV*dt*(.35+.65*(1-(t-.07)/.55));gk.vel.set(0,0,0);gk.ready=0;if(t>1.7){gk.dive=0;gk.diveT=0;gk.diveSide=1}return}
 if(M.gkHold===gk){slow(gk,dt,8);gk.hold=true;gk.ready=0;return}gk.hold=false;
 const pl=gk.plan;if(pl&&M.shot&&M.shot.side!==s){pl.tt+=dt;if(pl.tt>pl.react&&!pl.go){pl.go=true;const tl=pl.t-pl.tt,dx=(pl.save?pl.x:pl.x+(Math.random()<.5?-1:1)*R(.6,1.6))-gk.pos.x;
   if(Math.abs(dx)>.75||pl.y>1.9)startDive(gk,dx,clamp(pl.y,.3,2.5),Math.max(.22,tl),6.6);else if(pl.y>1.6)gk.jump=.6}
  if(!pl.go){gk.faceBall=true;steer(gk,V3(clamp(pl.x,-GW,GW),gk.pos.z),3,dt)}gk.ready=1;return}
 if(M.st==='restart'&&M.rs&&M.rs.type==='pen'&&M.rs.side!==s){gk.faceBall=true;steer(gk,V3(0,mtZ(s,.004)),3,dt);gk.ready=1;setFacing(gk,b.x-gk.pos.x,b.z-gk.pos.z,dt,8);return}
 const dist=Math.hypot(b.x,b.z-gz);let tx,tz;
 // sai do gol: bola solta na área que ele alcança primeiro
 if(M.st==='play'&&!M.owner&&mtInBox(s,b.x,b.z)&&b.y<2.5){const e=mtETA(gk);let rival=9;for(const q of M.T[1-s].pl)rival=Math.min(rival,mtETA(q).t);if(e.t<rival-.1&&!(M.lastKick&&M.lastKick.by.side===s&&M.pass)){gk.faceBall=true;steer(gk,V3(e.x,e.z),6.6,dt);gk.ready=.4;return}}
 if(dist>42){tx=clamp(b.x*.1,-4,4);tz=mtZ(s,clamp(.035+(dist-42)*.0013,.035,.12))}
 else{const d=clamp(.8+dist*.075,.8,3.4),ux=b.x/(dist||1),uz=(b.z-gz)/(dist||1);tx=clamp(ux*d*1.1,-GW+.5,GW-.5);tz=gz+uz*d}
 // mano a mano: sai pra fechar o ângulo
 const o=M.owner;if(o&&o.side!==s&&dist<17&&M.st==='play'){let cov=false;for(const q of M.T[s].pl){if(q===gk)continue;if(segD(q.pos.x,q.pos.z,b.x,b.z,0,gz)<1.6&&Math.abs(q.pos.z-gz)<Math.abs(b.z-gz))cov=true}
  if(!cov){const d=clamp(dist*.42,1.5,6.5),ux=b.x/(dist||1),uz=(b.z-gz)/(dist||1);tx=ux*d;tz=gz+uz*d}}
 gk.faceBall=true;steer(gk,V3(tx,tz),dist<25?4.6:3,dt);setFacing(gk,b.x-gk.pos.x,b.z-gk.pos.z,dt,8);gk.ready=dist<32?1:.35}
function mtGkDistribute(gk){const M=MT,b=S.ball,s=gk.side,fw=mtFw(s);M.gkHold=null;gk.hold=false;b.p.set(gk.pos.x-Math.sin(gk.face)*.7,BR,gk.pos.z-Math.cos(gk.face)*.7);
 const bp=mtBestPass(gk,null);if(bp&&Math.random()<.55&&bp.d<30&&bp.score>-.3)return mtPass(gk,bp.m,'ground');mtBoot(gk)}
// ---------- desarme ----------
function mtTackle(d,user){const M=MT,o=M.owner;if(!o||o.side===d.side||M.st!=='play')return false;const b=S.ball.p;const db=Math.hypot(b.x-d.pos.x,b.z-d.pos.z);if(db>(user?1.7:1.35))return false;
 const expo=Math.hypot(b.x-o.pos.x,b.z-o.pos.z);let pw=.3+.42*(d.tck-o.dri*.8)+(expo>.85?.26:0)+(o.sprint?.08:0)-(o.feint>0?.3:0)+(user?.14:0)-(o===M.ctl&&M.ctrl!=='auto'?.06:0);pw=clamp(pw,.08,.88);
 d.kickT=S.now-.1;d.kickTc=.2;d.kickKind='foot';d.face=Math.atan2(-(b.x-d.pos.x),-(b.z-d.pos.z));
 if(Math.random()<pw){if(d===M.hero)M.hs.tk++;if(o===M.hero)M.hs.lost++;o.down=.4;
  if(Math.random()<.55){mtCtrl(d)}else{const a=Math.atan2(b.z-o.pos.z,b.x-o.pos.x)+R(-1.4,1.4),sp=R(3,6);S.ball.v.set(Math.cos(a)*sp,R(0,1),Math.sin(a)*sp);M.owner=null;M.lastTouch=d;M.lastKick={by:d,kind:'poke',t:S.now};M.pass=null;M.path=predict(S.ball,3);M.pathAge=0;d.cd=.25}
  sfx('touch');if(user)mtFlash('DESARME!');return true}
 d.down=user?.6:.48;if(Math.random()<(user?.2:.12)){mtFoul(d,o);return true}return false}
// ---------- toque de controle ----------
function mtCtrl(p){const M=MT,b=S.ball,k=M.lastKick;
 if(k&&k.by!==p&&k.by.side===p.side&&['ground','through','lob','cross','throw'].includes(k.kind))p.astFrom=k.by;else p.astFrom=null;
 if(k&&k.by===M.hero&&p.side===0&&p!==M.hero&&['ground','through','lob','cross','throw'].includes(k.kind)&&!k.ok){M.hs.pok++;k.ok=true}
 if(p===M.hero&&k&&k.by.side!==0&&['ground','through','lob','cross','throw','clear'].includes(k.kind))M.hs.int++;if(p===M.hero)M.hs.tch++;
 M.owner=p;M.poss=p.side;M.pass=null;M.shot=null;M.penKick=false;M.lastTouch=p;p.hT=0;p.dec=R(.1,.25);p.run=null;b.v.set(0,0,0);b.w.set(0,0,0);b.p.y=BR;for(const q of M.pl)if(q.gk)q.plan=null;sfx('touch');
 const o=p.oneT;p.oneT=null;if(o&&S.now<o.until){if(o.kind==='shot')mtUserShoot(p,o.pw);else if(o.kind==='pass')mtUserPass(p,'ground');else if(o.kind==='through')mtUserPass(p,'through')}}
function mtHeader(p){const M=MT,b=S.ball,s=p.side,gz=mtGZ(s);p.jump=.6;const k=M.lastKick;const ast=k&&k.by!==p&&k.by.side===s?k.by:null;
 if(mtDep(s,b.p.z)>.8&&Math.abs(b.p.x)<15){p.astFrom=ast;const tx=R(-1,1)*(GW-.5),ty=R(.25,1.7);const dx=tx-b.p.x,dz=gz-b.p.z,L=Math.hypot(dx,dz)||1;const sp=12+6*p.sho;
  const v=new T.Vector3(dx/L*sp,(ty-b.p.y)/(L/sp)+4.9*(L/sp),dz/L*sp);addNoise(v,4+7*(1-p.sho),2);M.shots[s]++;if(p===M.hero)M.hs.sh++;mtKick(p,v,null,'head',null);M.lastShooter={p,t:S.now,side:s};M.shot={by:p,side:s,t:0};mtPlanSave(M.T[1-s].pl[0],p);return}
 if(mtDep(s,b.p.z)<.3){const a=R(-.5,.5);const fw=mtFw(s);const v=new T.Vector3(Math.sin(a)*10+b.p.x*-.1,R(3,6),fw*Math.cos(a)*10);mtKick(p,v,null,'head',null);return}
 // de peito: a bola cai no pé
 b.v.multiplyScalar(.15);b.v.y=Math.min(0,b.v.y);b.p.y=Math.min(b.p.y,1.2);mtCtrl(p)}
// ---------- bola: no pé, rolando ou no ar ----------
function mtBall(dt){const M=MT,b=S.ball;
 if(M.gkHold){const k=M.gkHold;k.g.updateMatrixWorld(true);k.hands[0].getWorldPosition(_hv);k.hands[1].getWorldPosition(_hv2);_hv.add(_hv2).multiplyScalar(.5);b.p.set(_hv.x-Math.sin(k.face)*.1,Math.max(BR,_hv.y),_hv.z-Math.cos(k.face)*.1);b.v.set(0,0,0);return}
 if(M.owner){const o=M.owner,fx=-Math.sin(o.face),fz=-Math.cos(o.face),sp=Math.hypot(o.vel.x,o.vel.z);o.tph=(o.tph||0)+dt*(1+sp/9);
  const lead=.52+sp*.05+(o.sprint&&sp>5?.55*Math.pow(Math.sin((o.tph%.75)/.75*Math.PI),4):0);const tx=o.pos.x+fx*lead,tz=o.pos.z+fz*lead;const k=1-Math.exp(-dt*16);
  b.p.x+=(tx-b.p.x)*k;b.p.z+=(tz-b.p.z)*k;b.p.y=BR;b.v.set(o.vel.x,0,o.vel.z);b.w.set(0,0,0);
  if(Math.abs(b.p.x)>34+BR||b.p.z<-BR||b.p.z>GLZ+BR)mtCheckOut(b.p.clone());return}
 const n=4,h=dt/n;for(let i=0;i<n;i++){const prev=b.p.clone();stepBall(b,h);netCollide(b,h);collideStadium(b);farCollide(b,h);
  if(M.st==='goal'||M.st==='out'||M.st==='end'||M.st==='half')continue;
  if(mtGoalCheck(prev))return;if(mtCheckOut(prev))return;if(mtContacts())return}
 M.pathAge+=dt;M.pathT+=dt;if(M.pathT>.25){M.pathT=0;M.path=predict(b,3);M.pathAge=0}
 if(M.pass)M.pass.t+=dt;if(M.shot)M.shot.t+=dt}
function mtContacts(){const M=MT,b=S.ball,bp=b.p,sp=b.v.length();
 // defesa do goleiro planejada no chute
 if(M.shot){const gk=M.T[1-M.shot.side].pl[0],pl=gk&&gk.plan;if(pl&&!pl.done){const gz=mtOZ(gk.side);if(Math.abs(bp.z-gz)<1.05){pl.done=true;if(pl.save){if(gk===M.hero)M.hs.sv++;
     if(pl.catch){M.gkHold=gk;M.holdT=0;M.shot=null;M.pass=null;M.owner=null;M.lastTouch=gk;M.lastKick={by:gk,kind:'catch',t:S.now};gk.dive=0;gk.hold=true;sfx('save');mtFlash('DEFENDEU!');return true}
     b.v.z=-b.v.z*R(.22,.42);b.v.x+=(Math.sign(bp.x-gk.pos.x)||1)*R(3,7);b.v.y=R(1.2,3.6);b.w.multiplyScalar(.2);M.shot=null;M.lastTouch=gk;M.lastKick={by:gk,kind:'parry',t:S.now};gk.cd=.6;M.path=predict(b,3);M.pathAge=0;sfx('save');mtFlash('QUE DEFESA!');return true}}}}
 // bloqueio na linha do chute
 if(M.shot&&M.shot.t<.5&&bp.y<1.6){for(const q of M.T[1-M.shot.side].pl){if(q.gk||q.down>0||q.blk)continue;if(Math.hypot(bp.x-q.pos.x,bp.z-q.pos.z)<.62){q.blk=true;if(Math.random()<.55){b.v.multiplyScalar(-R(.15,.35));b.v.x+=R(-4,4);b.v.y=R(.5,3);M.shot=null;M.lastTouch=q;M.lastKick={by:q,kind:'block',t:S.now};q.cd=.4;for(const g of M.pl)if(g.gk)g.plan=null;M.path=predict(b,3);M.pathAge=0;sfx('touch');mtFlash('BLOQUEOU!');return true}}}}
 // bola no alto: cabeceio
 if(bp.y>1.05&&bp.y<2.6){let best=null,bd=.8;for(const p of M.pl){if(p.cd>0||p.down>0||p.gk)continue;const d=Math.hypot(bp.x-p.pos.x,bp.z-p.pos.z);if(d<bd){bd=d;best=p}}if(best&&!(M.lastKick&&M.lastKick.by===best&&S.now-M.lastKick.t<.5)){if(bp.y>1.15&&sp>6.5)mtHeader(best);else{b.v.multiplyScalar(.15);mtCtrl(best)}return true}}
 // goleiro com as mãos dentro da área
 for(const g of[M.T[0].pl[0],M.T[1].pl[0]]){if(!g||g.cd>0||g.dive&&g.diveT>.75||(M.shot&&M.shot.side!==g.side))continue;if(!mtInBox(g.side,bp.x,bp.z))continue;const d=Math.hypot(bp.x-g.pos.x,bp.z-g.pos.z);if(d<(g.dive?1.4:1.05)&&bp.y<2.5&&sp<26){
   const back=M.lastKick&&M.lastKick.by.side===g.side&&['ground','through','lob','throw'].includes(M.lastKick.kind);if(back){mtCtrl(g);return true}
   M.gkHold=g;M.holdT=0;M.owner=null;M.pass=null;M.shot=null;M.lastTouch=g;M.lastKick={by:g,kind:'catch',t:S.now};g.dive=0;g.plan=null;sfx('save');return true}}
 if(bp.y>1.05)return false;
 // no pé
 let best=null,bd=1e9;for(const p of M.pl){if(p.cd>0||p.down>0||p.gk&&M.shot)continue;const mine=M.pass&&M.pass.to===p,foe=M.pass&&M.pass.from.side!==p.side;const r=(mine?.95:foe?.6:.78)+(p.lunge?.3:0);const d=Math.hypot(bp.x-p.pos.x,bp.z-p.pos.z);if(d<r&&d<bd){bd=d;best=p}}
 if(!best)return false;
 if(M.pass&&M.pass.from.side!==best.side&&sp>10&&Math.random()>.32+.32*best.tck+(best.lunge?.25:0)){best.cd=.3;b.v.multiplyScalar(.82);return false}
 if(sp>17&&!best.gk){b.v.multiplyScalar(R(.25,.45));const a=R(-1.2,1.2),c=Math.cos(a),s=Math.sin(a),x=b.v.x,z=b.v.z;b.v.x=x*c-z*s;b.v.z=x*s+z*c;b.v.y=R(0,2);best.cd=.3;M.lastTouch=best;M.lastKick={by:best,kind:'deflect',t:S.now};M.shot=null;M.pass=null;M.path=predict(b,3);M.pathAge=0;sfx('touch');return true}
 mtCtrl(best);return true}
function mtGoalCheck(prev){const M=MT,b=S.ball.p;
 if(prev.z>=0&&b.z<0&&Math.abs(b.x)<GW-.04&&b.y<GH-.04){mtGoal(0);return true}
 if(prev.z<=GLZ&&b.z>GLZ&&Math.abs(b.x)<GW-.04&&b.y<GH-.04){mtGoal(1);return true}return false}
function mtCheckOut(prev){const M=MT,b=S.ball.p,lt=M.lastTouch||M.kicker;const lts=lt?lt.side:0;
 if(Math.abs(b.x)>34+BR){mtOut({type:'throw',side:1-lts,x:Math.sign(b.x)*33.9,z:clamp(b.z,1.5,GLZ-1.5)});return true}
 if(b.z<-BR||b.z>GLZ+BR){const end=b.z<0?0:1,def=end===0?1:0;if(lts===def)mtOut({type:'corner',side:1-def,x:Math.sign(b.x||1)*33.5,z:end===0?.45:GLZ-.45});else mtOut({type:'gk',side:def,x:Math.sign(b.x||1)*R(2,6),z:mtZ(def,.052)});return true}
 return false}
function mtOut(rs){const M=MT;if(rs.type!=='pen')M.penKick=false;M.st='out';M.outT=rs.type==='fk'||rs.type==='pen'?1.3:1;M.rsNext=rs;M.owner=null;M.pass=null;M.shot=null;M.gkHold=null;for(const p of M.pl){p.plan=null;p.run=null}
 if(rs.type==='corner')mtFlash('ESCANTEIO');else if(rs.type==='gk')mtFlash('TIRO DE META',.9);else if(rs.type==='throw')mtFlash('LATERAL',.8)}
function mtFoul(d,o){const M=MT,b=S.ball.p;const def=d.side,inBox=mtInBox(def,b.x,b.z);sfx('whistle');mtFlash(inBox?'PÊNALTI!':'FALTA!');o.down=.6;
 mtOut(inBox?{type:'pen',side:o.side,x:0,z:mtZ(def,11/GLZ),fouled:o}:{type:'fk',side:o.side,x:clamp(b.x,-33,33),z:clamp(b.z,1.5,GLZ-1.5),fouled:o})}
function mtSetRestart(rs){const M=MT,b=S.ball,t=M.T[rs.side],o=M.T[1-rs.side],s=rs.side,fw=mtFw(s);M.st='restart';M.rs=rs;M.poss=rs.side;rs.t=0;b.v.set(0,0,0);b.w.set(0,0,0);b.inGoal=false;M.owner=null;M.pass=null;M.shot=null;M.gkHold=null;
 for(const p of M.pl){p.plan=null;p.dive=0;p.diveT=0;p.down=0;p.lunge=null;p.cele=null;p.fix=null;p.blk=false;p.run=null;p.oneT=null}
 let tk;const near=(list,x,z)=>list.slice().sort((a,c)=>Math.hypot(a.pos.x-x,a.pos.z-z)-Math.hypot(c.pos.x-x,c.pos.z-z))[0];
 if(rs.type==='gk')tk=t.pl[0];
 else if(rs.type==='pen'){tk=(s===0&&M.hero&&!M.hero.gk&&M.ctrl!=='auto'&&(MT_BK[M.hero.pos0]==='A'||M.hero.pos0==='MEI'||M.cfg.penTaker))?M.hero:t.pl.filter(p=>!p.gk).sort((a,c)=>c.sho-a.sho)[0]}
 else if(rs.type==='fk'&&rs.fouled&&!rs.fouled.gk)tk=Math.hypot(rs.x,rs.z-mtGZ(s))<30?t.pl.filter(p=>!p.gk).sort((a,c)=>c.sho+c.pas-a.sho-a.pas)[0]:rs.fouled;
 else tk=near(t.pl.filter(p=>!p.gk),rs.x,rs.z);
 rs.taker=tk;b.p.set(rs.x,BR,rs.z);
 // quem bate fica atrás da bola, de frente pro jogo
 let ax=-rs.x,az=(rs.type==='throw'?mtGZ(s)-rs.z:mtGZ(s)-rs.z);if(rs.type==='throw'){ax=-Math.sign(rs.x)*8;az=fw*6}if(rs.type==='gk'){ax=-rs.x*.2;az=fw*10}const L=Math.hypot(ax,az)||1;
 tk.pos.set(rs.x-ax/L*.65,0,rs.z-az/L*.65);if(rs.type==='throw')tk.pos.x=Math.sign(rs.x)*34.4;tk.vel.set(0,0,0);setFacingNow(tk,ax,az);tk.fix=V3(tk.pos.x,tk.pos.z);
 if(rs.type==='corner'||rs.type==='pen'||(rs.type==='fk'&&Math.hypot(rs.x,rs.z-mtGZ(s))<34))mtSetPieceSetup(rs);
 rs.user=(M.ctrl==='team'&&s===0)||(M.ctrl==='solo'&&tk===M.hero);rs.wait=rs.user?6:R(1.1,1.7);if(rs.user)M.ctl=tk;
 if(rs.user)mtTip(rs.type==='pen'?'Pênalti! Mire com o joystick e segure <b>CHUTE</b>.':rs.type==='corner'?'Escanteio: <b>LANÇAR</b> cruza na área, <b>PASSE</b> joga curto.':rs.type==='fk'?'Falta: <b>CHUTE</b> pro gol, <b>PASSE</b> ou <b>LANÇAR</b> pra um companheiro.':'Mire com o joystick e toque <b>PASSE</b> ou <b>LANÇAR</b>.',3.5);
 mtLabels(true)}
// bola parada perto do gol: todo mundo se arruma na hora (área, barreira, fora da área no pênalti)
function mtSetPieceSetup(rs){const M=MT,s=rs.side,d=1-s,att=M.T[s].pl.filter(p=>!p.gk&&p!==rs.taker),def=M.T[d].pl.filter(p=>!p.gk),gz=mtGZ(s);const put=(p,x,z)=>{p.pos.set(x,0,z);p.vel.set(0,0,0);p.fix=V3(x,z);setFacingNow(p,S.ball.p.x-x,S.ball.p.z-z)};
 const Z=dd=>gz===0?dd:GLZ-dd;
 if(rs.type==='pen'){let i=0;for(const p of M.pl){if(p===rs.taker||p===M.T[d].pl[0])continue;const k=i++;put(p,(k%2?1:-1)*(3+Math.floor(k/2)*2.3),Z(R(18.5,22)));p.fix=null}M.T[d].pl[0].pos.set(0,0,Z(.4));setFacingNow(M.T[d].pl[0],0,-mtFw(s));return}
 if(rs.type==='corner'){const sx=Math.sign(rs.x);const spots=[[sx*2.8,5],[-sx*3.2,7],[0,11],[sx*-7,13],[sx*6,14.5],[0,19]];const ord=att.sort((a,c)=>(MT_BK[c.pos0]==='A'?2:MT_BK[c.pos0]==='D'?1:0)-(MT_BK[a.pos0]==='A'?2:MT_BK[a.pos0]==='D'?1:0));
  ord.forEach((p,i)=>{if(i<spots.length)put(p,spots[i][0]+R(-.6,.6),Z(spots[i][1]+R(-.5,.5)));else put(p,R(-15,15),Z(R(30,48)));p.fix=null});
  def.forEach((p,i)=>{const m=ord[i];if(i<6&&m){const gx=-m.pos.x*.15,gzz=gz-m.pos.z,L=Math.hypot(gx,gzz)||1;put(p,m.pos.x+gx/L*1.1,m.pos.z+gzz/L*1.1)}else if(i===6)put(p,sx*3.6,Z(1.2));else put(p,R(-10,10),Z(R(30,40)));p.fix=null});return}
 // falta perto da área: barreira de 3
 const bx_=rs.x,bz=rs.z,gx=-bx_,gzz=gz-bz,L=Math.hypot(gx,gzz)||1,ux=gx/L,uz=gzz/L;const wc=V3(bx_+ux*9.15,bz+uz*9.15);
 def.sort((a,c)=>Math.hypot(a.pos.x-wc.x,a.pos.z-wc.z)-Math.hypot(c.pos.x-wc.x,c.pos.z-wc.z)).slice(0,3).forEach((p,i)=>{put(p,wc.x-uz*(i-1)*.65,wc.z+ux*(i-1)*.65);p.wall=true})}
function mtTakeRestart(kind){const M=MT,rs=M.rs;if(!rs||M.st!=='restart')return;const tk=rs.taker,b=S.ball.p,s=rs.side;M.st='play';M.penKick=rs.type==='pen';M.rs=null;for(const p of M.pl){p.fix=null;p.wall=false}
 M.owner=tk;tk.hT=1;M.lastTouch=tk;
 if(rs.user){if(rs.type==='pen'||(rs.type==='fk'&&kind==='shoot')){const pw=kind==='shoot'&&MI.lastPw?MI.lastPw:.72;MI.lastPw=0;return mtUserShoot(tk,pw)}
  if(rs.type==='gk'&&kind!=='pass'){return mtSpacePass(tk,MI.mag>.3?mtJoyDir(tk):V3(0,mtFw(s)),40,'lob')}
  if(rs.type==='corner'&&kind!=='pass'){if(MI.mag>.3)return mtUserPass(tk,'through');return mtCross(tk,true)}
  return mtUserPass(tk,kind==='lob'?'through':'ground')}
 if(rs.type==='pen'){const tx=(Math.random()<.5?-1:1)*R(.35,.92)*(GW-.4),ty=Math.random()<.6?R(.2,.9):R(1.2,2.5);return mtShoot(tk,tx,ty,R(.62,.85))}
 if(rs.type==='corner'){if(Math.random()<.18){const bp=mtBestPass(tk,null);if(bp&&bp.d<22)return mtPass(tk,bp.m,'ground')}return mtCross(tk,true)}
 if(rs.type==='fk'){const dG=Math.hypot(b.x,b.z-mtGZ(s));if(dG<30&&Math.abs(b.x)<20&&Math.random()<.55)return mtAIShoot(tk)}
 if(rs.type==='gk'&&Math.random()<.55)return mtBoot(tk);
 const bp=mtBestPass(tk,null);if(bp&&bp.d<(rs.type==='throw'?24:36))return mtPass(tk,bp.m,rs.type==='throw'&&bp.kind==='through'?'ground':bp.kind);mtBoot(tk)}
// ---------- gol, intervalo, fim ----------
function mtGoal(side){const M=MT,b=S.ball;M.score[side]++;M.st='goal';M.goalT=3;M.goalSide=side;
 const sh=M.lastShooter&&M.lastShooter.side===side&&S.now-M.lastShooter.t<4.5?M.lastShooter.p:null;let sc=sh||(M.lastTouch&&M.lastTouch.side===side?M.lastTouch:null);const own=!sc;
 const ast=sc&&sc.astFrom&&sc.astFrom.side===side?sc.astFrom:null;const w=own?((M.lastTouch&&M.lastTouch.name)||'Contra')+' (contra)':sc.name+(M.lastKick&&M.lastKick.kind==='head'?'':'');
 const ev={m:Math.min(90,Math.max(M.start,Math.round(M.min))),us:side===0,w,hero:!!(sc&&sc===M.hero),heroAst:!!(ast&&ast===M.hero),ast:ast?ast.name:null,pen:!!M.penKick,own};M.ev.push(ev);M.penKick=false;
 if(ev.hero)M.hs.g++;if(ev.heroAst)M.hs.a++;
 sfx('goal');if(b.p.z>GLZ/2)withNet2(()=>netRipple(new T.Vector3(-b.p.x,b.p.y,GLZ-b.p.z),.5));else netRipple(b.p.clone(),.5);
 M.celeBy=sc;for(const p of M.pl){if(p.side===side)p.cele=p===sc?'arms':'air';else p.cele=p.gk?'sad':(Math.random()<.5?'sad':null)}
 mtFlash(side===0?'GOL!':'GOL DELES',2.4,(own?'Gol contra · ':'')+(sc?sc.name:'')+' '+ev.m+"'"+(ast?' · passe de '+ast.name:''),side===0?'good':'bad');mtScore();M.owner=null;M.pass=null;M.shot=null;M.gkHold=null}
function mtHalf(){const M=MT;M.st='half';M.halfT=2.6;M.half=2;sfx('whistle');mtFlash('INTERVALO',2.2,`${M.abbr[0]} ${M.score[0]} × ${M.score[1]} ${M.abbr[1]}`)}
function mtFinish(){const M=MT;if(M.st==='end')return;M.st='end';M.min=90;sfx('whistle');setTimeout(()=>sfx('whistle'),500);for(const p of M.pl){p.cele=null;p.vel.set(0,0,0)}
 const w=M.score[0]>M.score[1],l=M.score[0]<M.score[1];for(const p of M.pl)p.cele=(p.side===0?w:l)?'arms':(p.side===0?l:w)?'sad':null;mtEndCard()}
function mtResult(){const M=MT,h=M.hs;const gk=M.hero&&M.hero.gk;
 const adj=clamp(.14*h.on+.025*h.pok-.05*Math.max(0,h.pa-h.pok-1)+.12*h.int+(gk?.3*h.sv:0)-.06*h.lost,-1,1.4);
 return{full:true,gu:M.score[0],gt:M.score[1],ev:M.ev,st:{...h},adj:Math.round(adj*100)/100,sim:!!M.simd,ctrl:M.ctrl,shots:M.shots.slice()}}
function mtSimRest(){const M=MT;if(M.st==='end')return;const rem=Math.max(0,90-M.min);const xg=M.cfg.xg||[1.3,1.18];
 const poi=l=>{let k=0,p=Math.exp(-l),s=p,u=Math.random();while(u>s&&k<9){k++;p*=l/k;s+=p}return k};
 const wt=p=>p.gk?.02:({A:5,M:2.4,D:1})[MT_BK[p.pos0]]||1;const pickW=list=>{const tot=list.reduce((a,p)=>a+wt(p),0);let r=Math.random()*tot;for(const p of list){r-=wt(p);if(r<=0)return p}return list[0]};
 for(const side of[0,1]){const n=poi(xg[side]*rem/90);for(let i=0;i<n;i++){const sc=pickW(M.T[side].pl);const ast=Math.random()<.6?pickW(M.T[side].pl.filter(p=>p!==sc)):null;M.score[side]++;const ev={m:Math.round(M.min+R(0,rem)),us:side===0,w:sc.name,hero:sc===M.hero,heroAst:!!(ast&&ast===M.hero),ast:ast?ast.name:null,sim:true};M.ev.push(ev);if(ev.hero)M.hs.g++;if(ev.heroAst)M.hs.a++}}
 M.ev.sort((a,c)=>a.m-c.m);M.simd=true;mtScore();$('mtPm').hidden=true;M.paused=false;mtFinish()}
// ---------- torcida: um chiado de estádio que respira e sobe perto do gol ----------
const CROWD={src:null,g:null,f:null};
function mtCrowd(on){try{if(!AC)return;if(on&&!CROWD.src){const n=AC.sampleRate*3,bf=AC.createBuffer(1,n,AC.sampleRate),d=bf.getChannelData(0);let l=0;for(let i=0;i<n;i++){l=l*.97+(Math.random()*2-1)*.03;d[i]=l*6+(Math.random()*2-1)*.04}
  const s=AC.createBufferSource();s.buffer=bf;s.loop=true;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=520;f.Q.value=.6;const g=AC.createGain();g.gain.value=0;s.connect(f).connect(g).connect(AC.destination);s.start();CROWD.src=s;CROWD.g=g;CROWD.f=f}
 if(!on&&CROWD.src){CROWD.src.stop();CROWD.src=null}}catch(e){}}
function mtCrowdTick(){if(!CROWD.g||!AC)return;const M=MT,b=S.ball.p;const near=Math.max(0,1-Math.min(b.z,GLZ-b.z)/30);let v=M.paused||M.st==='intro'||M.st==='end'?0:.05+.07*near+(M.st==='goal'?.22:0);if(S.env==='prison')v*=.15;CROWD.g.gain.setTargetAtTime(v,AC.currentTime,.4)}
// ---------- loop ----------
function mtUpdate(dt){const M=MT;if(!M.on)return;if(AC&&!CROWD.src)mtCrowd(true);mtCrowdTick();
 if(M.paused||M.st==='intro'){mtVisual(dt,true);mtCam(dt);return}
 if(['play','restart','out','kickoff'].includes(M.st)){M.e+=dt;M.min=M.start+M.e/M.len*(90-M.start);
  if(M.half===1&&M.min>=45&&!M.shot&&M.st!=='out'){M.min=45;mtHalf()}else if(M.min>=90&&(!M.shot||M.min>=91.5)&&M.st!=='out'){M.min=90;mtFinish()}}
 mtPickCtl(dt);
 for(const t of M.T){t.pt-=dt;if(t.pt<=0){t.pt=.15;mtPlan(t)}}
 if(M.tipT>0){M.tipT-=dt;if(M.tipT<=0)$('mtTip').classList.remove('on')}
 if(M.st==='kickoff'){M.wait-=dt;for(const p of M.pl){slow(p,dt,8);setFacing(p,-p.pos.x*.02,GLZ/2-p.pos.z,dt,6)}if(M.wait<=0||M.koGo){M.koGo=false;M.st='play';const k=M.kicker;M.owner=k;M.poss=k.side;M.lastTouch=k;
   const t=M.T[M.kick];const back=t.pl.filter(p=>!p.gk&&p!==k&&mtDep(M.kick,p.pos.z)<.5).sort((a,c)=>Math.hypot(a.pos.x,a.pos.z-GLZ/2)-Math.hypot(c.pos.x,c.pos.z-GLZ/2))[0]||M.kick2;
   if(M.koUser&&M.ctrl!=='auto'&&MI.mag>.3)mtUserPass(k,'ground');else mtPass(k,back,'ground')}}
 else if(M.st==='out'){M.outT-=dt;mtBall(dt);for(const p of M.pl){if(p.gk)mtGK(p,dt);else{slow(p,dt,5)}}if(M.outT<=0)mtSetRestart(M.rsNext)}
 else if(M.st==='restart'){const rs=M.rs;rs.t+=dt;for(const p of M.pl){if(p===rs.taker){p.vel.set(0,0,0);continue}if(p.gk){mtGK(p,dt);continue}if(p.fix){steer(p,p.fix,4,dt);setFacing(p,S.ball.p.x-p.pos.x,S.ball.p.z-p.pos.z,dt,8);continue}mtMove(p,dt)}
  if(rs.user&&M.ctrl!=='auto'){if(rs.t>rs.wait)mtTakeRestart(rs.type==='pen'?'shoot':'pass')}else if(rs.t>rs.wait)mtTakeRestart()}
 else if(M.st==='goal'){M.goalT-=dt;const sc=M.celeBy;for(const p of M.pl){if(p.gk){slow(p,dt,6);continue}if(sc&&p.side===sc.side&&p!==sc&&Math.hypot(p.pos.x-sc.pos.x,p.pos.z-sc.pos.z)<26)steer(p,V3(sc.pos.x+Math.sin(p.num)*1.6,sc.pos.z+Math.cos(p.num)*1.6),6,dt);else if(p===sc){steer(p,V3(clamp(sc.pos.x*1.15,-30,30),sc.pos.z+mtFw(sc.side)*-3),5,dt)}else slow(p,dt,6)}
  mtBall(dt);if(M.goalT<=0){for(const p of M.pl)p.cele=null;mtKickoff(1-M.goalSide)}}
 else if(M.st==='half'){M.halfT-=dt;for(const p of M.pl)slow(p,dt,6);if(M.halfT<=0)mtKickoff(1-M.first)}
 else if(M.st==='play'){
  mtUser(dt);
  for(const p of M.pl){if(p.cd>0)p.cd-=dt;if(p.tkCD>0)p.tkCD-=dt;if(p.run&&(p.run.t-=dt)<=0)p.run=null;if(p.feint>0)p.feint-=dt;if(p.call>0)p.call-=dt;p.blk=p.blk&&!!M.shot;
   if(p===M.ctl&&M.ctrl!=='auto')continue;
   if(p.gk&&M.owner!==p){mtGK(p,dt);continue}
   if(p.lunge){mtLungeStep(p,dt);continue}
   if(p.down>0){p.down-=dt;slow(p,dt,12);continue}
   if(M.owner===p){mtCarrier(p,dt);continue}
   mtMove(p,dt);
   // pressão da IA: bote quando está colado na bola
   const t=M.T[p.side];if((t.press===p||t.cover===p)&&M.owner&&M.owner.side!==p.side&&p.tkCD<=0){const db=Math.hypot(S.ball.p.x-p.pos.x,S.ball.p.z-p.pos.z);if(db<2.3&&Math.random()<dt*(.7+1.2*p.tck)*(t.press===p?1:.4)){p.tkCD=R(.9,1.8);mtLunge(p)}}}
  if(M.gkHold){M.holdT+=dt;const g=M.gkHold;const user=g.side===0&&(M.ctrl==='team'||(M.ctrl==='solo'&&g===M.hero));if(M.holdT>(user?4.5:R(1.2,1.8)))mtGkDistribute(g)}
  mtBall(dt)}
 if(M.st==='end'){for(const p of M.pl)slow(p,dt,6)}
 mtSeparate();mtVisual(dt,false);mtCam(dt);mtHud(dt)}
function mtDrive(p,dx,dz,vmax,dt,turn=11){const des=_hv.set(dx*vmax,0,dz*vmax);const dv=des.sub(p.vel);const brake=dv.dot(p.vel)<0;const m=dv.length(),cap=(brake?DEC:ACC)*dt;if(m>cap)dv.multiplyScalar(cap/m);p.vel.add(dv);p.pos.addScaledVector(p.vel,dt);
 if(p.vel.lengthSq()>.2)setFacing(p,p.vel.x,p.vel.z,dt,turn)}
function mtMove(p,dt){const M=MT,b=S.ball.p,t=M.T[p.side];const dx=p.tgt.x-p.pos.x,dz=p.tgt.z-p.pos.z,L=Math.hypot(dx,dz);
 const vmax=p.spd*(p.urg>=1?.96:p.urg>.85?.86:.74);p.faceBall=!t.att||L<2;if(L>.35)steer(p,p.tgt,vmax,dt);else slow(p,dt,7);
 if(p.faceBall||p.vel.lengthSq()<.5)setFacing(p,b.x-p.pos.x,b.z-p.pos.z,dt,7);p.ready=!t.att&&Math.hypot(b.x-p.pos.x,b.z-p.pos.z)<5?.5:0}
function mtSeparate(){const P2=MT.pl;for(let i=0;i<P2.length;i++){const a=P2[i];a.pos.x=clamp(a.pos.x,-36,36);a.pos.z=clamp(a.pos.z,-2.5,GLZ+2.5);for(let j=i+1;j<P2.length;j++){const c=P2[j];if(a.dive||c.dive)continue;const dx=c.pos.x-a.pos.x,dz=c.pos.z-a.pos.z;if(Math.abs(dx)>.9||Math.abs(dz)>.9)continue;const L=Math.hypot(dx,dz);if(L>0&&L<.9){const f=(.9-L)*.5,fa=a===MT.owner?.3:1,fc=c===MT.owner?.3:1;a.pos.x-=dx/L*f*fa;a.pos.z-=dz/L*f*fa;c.pos.x+=dx/L*f*fc;c.pos.z+=dz/L*f*fc}}}}
// ---------- você ----------
function mtUser(dt){const M=MT;if(M.ctrl==='auto')return;const p=M.ctl;if(!p)return;const b=S.ball.p;M.ctlActive=MI.mag>.15||MI.press||!!p.lunge||M.owner===p;
 if(MI.shoot)$('mtPow').firstChild.style.width=Math.round(mtPowNow()*100)+'%';
 if(M.gkHold===p){slow(p,dt,8);return}
 if(p.lunge){mtLungeStep(p,dt);return}
 if(p.down>0){p.down-=dt;slow(p,dt,12);return}
 if(p.gk&&M.owner!==p){if(!M.ctlActive){mtGK(p,dt);return}const dx=MI.jx,dz=MI.jy;mtDrive(p,dx,dz,4.5*MI.mag,dt);p.pos.x=clamp(p.pos.x,-20,20);if(p.side===0)p.pos.z=clamp(p.pos.z,GLZ-16.5,GLZ);setFacing(p,b.x-p.pos.x,b.z-p.pos.z,dt,8);return}
 const has=M.owner===p;
 if(MI.press&&!has&&M.owner&&M.owner.side!==p.side){const o=M.owner,gx=-o.pos.x,gz=mtOZ(p.side)-o.pos.z,L=Math.hypot(gx,gz)||1;steer(p,V3(o.pos.x+gx/L*.9+o.vel.x*.2,o.pos.z+gz/L*.9+o.vel.z*.2),p.spd*(MI.sprint?1:.9),dt);setFacing(p,b.x-p.pos.x,b.z-p.pos.z,dt,10);return}
 if(MI.mag>.15){const k=Math.min(1,MI.mag*1.2);let v=p.spd*(MI.sprint?(has?.9:1):(has?.7:.78))*k;p.sprint=MI.sprint&&has;if(has&&p.feint>0){v=p.spd*.95}mtDrive(p,MI.jx/MI.mag,MI.jy/MI.mag,v,dt,has?8.5:12);return}
 p.sprint=false;if(has){slow(p,dt,9);return}
 // sem tocar no joystick: o jogador se posiciona sozinho (assistência)
 mtMove(p,dt)}
function mtPowNow(){return MI.shoot?clamp((performance.now()-MI.shootT0)/850,.12,1):.5}
function mtPickTarget(p,dir){const bp=mtBestPass(p,dir,'user');return bp?bp.m:null}
function mtUserPass(p,kind){const M=MT;const dir=mtJoyDir(p);const m=mtPickTarget(p,dir);
 if(kind==='through'){if(m){m.run=null;const th=mtThroughPt(p,m);m.run={x:th.x,z:th.z,t:2.6};return mtPass(p,m,'through')}return mtSpacePass(p,dir,22,'lob')}
 if(m)return mtPass(p,m,'ground');mtSpacePass(p,dir,12,'ground')}
function mtUserShoot(p,pw){const M=MT,b=S.ball.p,s=p.side,gz=mtGZ(s);let tx;const jx=MI.mag>.25?MI.jx/Math.max(MI.mag,.01):0;
 if(Math.abs(jx)>.18)tx=clamp(jx*1.15,-1,1)*(GW-.35);else tx=-(Math.sign(b.x)||(Math.random()<.5?1:-1))*R(.5,.85)*(GW-.4);
 const ty=clamp(.22+pw*2.1+(MI.mag>.25&&MI.jy/Math.max(MI.mag,.01)<-.6?.5:0),.2,GH-.15);mtShoot(p,tx,ty,pw)}
// botões: o mesmo botão faz coisas diferentes com e sem a bola
function mtBtn(a,down){const M=MT;if(!M.on)return;if(M.st==='intro'||M.paused||M.st==='end')return;const p=M.ctl;
 if(a==='sprint'){MI.sprint=down;return}
 if(a==='lob'&&!down){MI.press=false}
 if(M.st==='kickoff'){if(down&&(a==='pass'||a==='lob')&&M.koUser){M.koGo=true}return}
 if(M.st==='restart'&&M.rs&&M.rs.user){if(a==='shoot'){if(down){MI.shoot=true;MI.shootT0=performance.now();$('mtPow').hidden=false}else if(MI.shoot){MI.lastPw=mtPowNow0();MI.shoot=false;$('mtPow').hidden=true;mtTakeRestart('shoot')}}else if(down)mtTakeRestart(a);return}
 if(M.st!=='play'||!p)return;const has=M.owner===p;const b=S.ball.p;
 if(a==='shoot'){
  if(down){if(p.gk&&M.shot&&M.shot.side!==p.side){M.gkBoost=S.now+1.2;const pl=p.plan;if(pl&&!pl.done&&!pl.save&&pl.on&&Math.random()<.4)pl.save=true;return}
   if(has||(M.pass&&M.pass.to===p)||(!M.owner&&!M.gkHold)){MI.shoot=true;MI.shootT0=performance.now();$('mtPow').hidden=false;return}
   if(M.owner&&M.owner.side!==p.side)return mtUserTackle(p);return}
  if(!MI.shoot)return;MI.shoot=false;$('mtPow').hidden=true;const pw=mtPowNow0();
  if(M.owner===p)return mtUserShoot(p,pw);if(M.pass&&M.pass.to===p||!M.owner){p.oneT={kind:'shot',pw,until:S.now+1.8}}return}
 if(!down)return;
 if(a==='feint'){if(has&&p.feint<=0){p.feint=.45;p.feintDir=MI.mag>.2?(Math.sign(MI.jx)||1):(Math.random()<.5?1:-1);sfx('tick')}return}
 if(M.gkHold===p){if(a==='pass'){M.gkHold=null;p.hold=false;b.set(p.pos.x-Math.sin(p.face)*.7,BR,p.pos.z-Math.cos(p.face)*.7);return mtUserPass(p,'ground')}if(a==='lob'){M.gkHold=null;p.hold=false;b.set(p.pos.x-Math.sin(p.face)*.7,BR,p.pos.z-Math.cos(p.face)*.7);return mtUserPass(p,'through')}return}
 if(has){if(a==='pass')return mtUserPass(p,'ground');if(a==='lob'){const inW=Math.abs(b.x)>18&&mtDep(p.side,b.z)>.72;if(inW&&MI.mag<.3)return mtCross(p,true);return mtUserPass(p,'through')}return}
 // sem a bola
 const ourBall=(M.owner&&M.owner.side===p.side)||(M.pass&&M.pass.from.side===p.side);
 if(M.pass&&M.pass.to===p){if(a==='pass')p.oneT={kind:'pass',until:S.now+1.8};if(a==='lob')p.oneT={kind:'through',until:S.now+1.8};return}
 if(ourBall&&M.ctrl==='solo'){if(a==='pass'||a==='lob'){p.call=2.4;p.callK=a==='lob'?'run':'feet';if(a==='lob'){const th=V3(clamp(p.pos.x,-30,30),clamp(p.pos.z+mtFw(p.side)*10,2,GLZ-2));p.run={x:th.x,z:th.z,t:2.4}}mtFlash(a==='lob'?'LANÇA!':'TOCA!',.7);M.T[p.side].pl.forEach(q=>{if(q===M.owner)q.dec=Math.min(q.dec,.05)})}return}
 if(a==='pass')return mtSwitch();if(a==='lob'){MI.press=true;return}}
function mtPowNow0(){return clamp((performance.now()-MI.shootT0)/850,.12,1)}
function mtLunge(p){const b=S.ball.p,o=MT.owner;const tx=b.x+(o?o.vel.x*.2:0),tz=b.z+(o?o.vel.z*.2:0);const d=Math.hypot(tx-p.pos.x,tz-p.pos.z)||1;p.lunge={x:(tx-p.pos.x)/d,z:(tz-p.pos.z)/d,t:0,dur:clamp((d-.5)/9.5,.1,.3),ai:true};p.kickT=S.now;p.kickTc=.22;p.kickKind='foot';p.face=Math.atan2(-p.lunge.x,-p.lunge.z);p.g.rotation.y=p.face}
function mtLungeStep(p,dt){const M=MT,b=S.ball.p,L=p.lunge;L.t+=dt;const sp=L.t<.06?3:9.5;p.pos.x+=L.x*sp*dt;p.pos.z+=L.z*sp*dt;p.vel.set(L.x*sp,0,L.z*sp);
 const fx=p.pos.x+L.x*.5,fz=p.pos.z+L.z*.5;if(M.owner&&M.owner.side!==p.side&&Math.hypot(fx-b.x,fz-b.z)<1){p.lunge=null;if(!mtTackle(p,!L.ai))p.down=Math.max(p.down,.5);return}
 if(L.t>=L.dur){p.lunge=null;p.down=L.ai?.35:.42}}
function mtUserTackle(p){if(p.down>0||p.lunge)return;const M=MT,b=S.ball.p;const d=Math.hypot(b.x-p.pos.x,b.z-p.pos.z);let dx,dz;if(d<3.2&&d>.01){dx=(b.x-p.pos.x)/d;dz=(b.z-p.pos.z)/d}else{const j=mtJoyDir(p);dx=j.x;dz=j.z}
 p.lunge={x:dx,z:dz,t:0,dur:clamp((d-.6)/9.5,.12,.32)};p.kickT=S.now;p.kickTc=.22;p.kickKind='foot';p.face=Math.atan2(-dx,-dz);p.g.rotation.y=p.face;sfx('dive')}
// ---------- câmera: atrás do seu ataque, alta, seguindo a bola ----------
const _mcf=new T.Vector3(0,0,GLZ/2);
function mtCamGoal(){const M=MT,b=S.ball.p;let fx=b.x,fz=b.z;const o=M.owner;if(o){fx=o.pos.x+mtFw(o.side)*0+o.vel.x*.3;fz=o.pos.z+o.vel.z*.3}
 if(M.ctrl==='solo'&&M.hero&&M.st==='play'){const h=M.hero;const d=Math.hypot(h.pos.x-fx,h.pos.z-fz);const k=clamp((d-6)/30,0,.42);fx=lerp(fx,h.pos.x,k);fz=lerp(fz,h.pos.z,k)}
 if(M.st==='goal'&&M.celeBy){fx=M.celeBy.pos.x;fz=M.celeBy.pos.z}
 const pre=MT_CAM[M.camPre||0],land=cam.aspect>1.15?1.18:1;const h=pre.h*land,d=pre.d*land;
 // com a bola deles a câmera recua um pouco pra mostrar o seu gol
 M.camSh=lerp(M.camSh||0,(M.poss===1&&M.st==='play')||(M.gkHold&&M.gkHold.side===1)?pre.d*.22:0,.02);fz+=M.camSh;
 // perto da linha de fundo e aberto (escanteio, cruzamento): puxa pro meio pra mostrar a área
 const nearEnd=fz<20||fz>GLZ-20;if(nearEnd&&Math.abs(fx)>14)fx=lerp(fx,0,.42);
 // não olha pra arquibancada de cima nem entra na de baixo: sobe em vez de recuar
 fz=Math.max(fz,9);let cz=fz+d,up=0;if(cz>GLZ+8){up=(cz-GLZ-8)*.7;cz=GLZ+8}
 return{pos:new T.Vector3(clamp(fx*.8,-26,26),h+up,cz),look:new T.Vector3(clamp(fx*.9,-30,30),0,fz-pre.la)}}
function mtSnapCam(){const g=mtCamGoal();camPos.copy(g.pos);camLook.copy(g.look);cam.position.copy(camPos);cam.lookAt(camLook)}
function mtCam(dt){const f=camFov();if(cam.fov!==f){cam.fov=f;cam.updateProjectionMatrix()}const g=mtCamGoal();const k=1-Math.exp(-dt*3.2);camLook.lerp(g.look,k);camPos.lerp(g.pos,k);cam.position.copy(camPos);cam.lookAt(camLook);
 sun.position.set(camLook.x-22,48,camLook.z+26);sun.target.position.copy(camLook)}
// ---------- visual ----------
const MTR=(()=>{const m=new T.Mesh(new T.RingGeometry(.62,.82,32),new T.MeshBasicMaterial({color:'#ffd23c',transparent:true,opacity:.95,depthWrite:false}));m.rotation.x=-Math.PI/2;m.renderOrder=3;m.visible=false;scene.add(m);return m})();
const MTT=(()=>{const m=new T.Mesh(new T.RingGeometry(.5,.66,28),new T.MeshBasicMaterial({color:'#5fd0ff',transparent:true,opacity:.9,depthWrite:false}));m.rotation.x=-Math.PI/2;m.renderOrder=3;m.visible=false;scene.add(m);return m})();
function mtVisual(dt,frozen){const M=MT,b=S.ball;
 for(const p of M.pl){if(!frozen&&p.jump>0)p.jump=Math.max(0,p.jump-dt);p.a.look=b.p;animPlayer(p,frozen?0:dt,S.now);if(p.hero)p.star.visible=true}
 const c=M.ctl;MTR.visible=!!c&&M.ctrl!=='auto'&&M.st!=='end';if(MTR.visible){MTR.position.set(c.pos.x,.035,c.pos.z);MTR.material.color.set(M.owner===c?'#ffd23c':'#ffffff')}
 // pra quem vai o passe se você tocar agora
 M.tgtT=(M.tgtT||0)-dt;if(M.tgtT<=0){M.tgtT=.1;M.tgtM=null;if(c&&(M.owner===c||(M.st==='restart'&&M.rs&&M.rs.taker===c))&&M.ctrl!=='auto')M.tgtM=mtPickTarget(c,mtJoyDir(c))}
 MTT.visible=!!M.tgtM;if(M.tgtM)MTT.position.set(M.tgtM.pos.x,.03,M.tgtM.pos.z);
 ballM.position.copy(b.p);const hs=Math.hypot(b.v.x,b.v.z);if(!frozen&&!M.gkHold){if(b.p.y<=BR+.01){if(hs>.01)ballM.rotateOnWorldAxis(_hv.set(b.v.z,0,-b.v.x).normalize(),hs*dt/BR)}else{const ws=b.w.length();if(ws>.3)ballM.rotateOnWorldAxis(_hv.copy(b.w).normalize(),Math.min(ws*.8,24)*dt)}}
 ballSh.position.set(b.p.x,.02,b.p.z);const sh=clamp(1-b.p.y*.15,.35,1);ballSh.scale.set(sh,sh,sh);updNet();updNet2();
 if(MI.shoot&&c){const s2=toScreen(new T.Vector3(c.pos.x,2.9,c.pos.z));const pw=$('mtPow');pw.style.transform=`translate(${s2.x}px,${s2.y}px) translate(-50%,-100%)`}
 stepGuards(dt)}
// ---------- placar, relógio, radar e dicas ----------
function mtScore(){$('mtSc').textContent=`${MT.score[0]}–${MT.score[1]}`}
function mtHud(dt){const M=MT;const mm=Math.min(90,Math.floor(M.min));if(mm!==M.lastMin){M.lastMin=mm;$('mtClk').textContent=mm+"'"}
 M.radT=(M.radT||0)-dt;if(M.radT<=0){M.radT=.08;mtRadar()}mtLabels(false)}
function mtRadar(){const cv=$('mtRad');const x=cv.getContext('2d'),W=cv.width,H=cv.height,sx=W/72,sz=H/109;x.clearRect(0,0,W,H);x.fillStyle='rgba(16,48,26,.72)';x.fillRect(0,0,W,H);x.strokeStyle='rgba(255,255,255,.45)';x.lineWidth=1;
 const X=v=>(v+36)*sx,Z=v=>(v+2)*sz;x.strokeRect(X(-34),Z(0),68*sx,GLZ*sz);x.beginPath();x.moveTo(X(-34),Z(GLZ/2));x.lineTo(X(34),Z(GLZ/2));x.stroke();x.strokeRect(X(-20.16),Z(0),40.32*sx,16.5*sz);x.strokeRect(X(-20.16),Z(GLZ-16.5),40.32*sx,16.5*sz);
 for(const p of MT.pl){const c=p.side===0?OUR.shirt:THEM.shirt;x.fillStyle=c;x.beginPath();x.arc(X(p.pos.x),Z(p.pos.z),p===MT.ctl?3.8:2.8,0,7);x.fill();x.strokeStyle=p.hero?'#ffd23c':p===MT.ctl?'#ffffff':mtInk(c)==='#ffffff'?'rgba(255,255,255,.75)':'rgba(0,0,0,.6)';x.lineWidth=p.hero||p===MT.ctl?1.6:1;x.stroke()}
 const b=S.ball.p;x.fillStyle='#fff';x.beginPath();x.arc(X(b.x),Z(b.z),2.2,0,7);x.fill()}
function mtTip(html,sec){const t=$('mtTip');t.innerHTML=html;t.classList.add('on');MT.tipT=sec||3}
function mtFlash(txt,sec=1.1,sub,cls){const m=$('mtMsg');m.className='';void m.offsetWidth;m.innerHTML=`<b>${txt}</b>${sub?`<small>${sub}</small>`:''}`;m.className='on '+(cls||'');clearTimeout(mtFlash.t);mtFlash.t=setTimeout(()=>{m.className=''},sec*1000)}
// rótulos dos botões conforme a situação (com a bola, sem a bola, defendendo, bola parada)
function mtLabels(force){const M=MT,p=M.ctl;let ctx='def';if(M.ctrl==='auto')ctx='auto';else if(M.st==='restart'&&M.rs&&M.rs.user)ctx=M.rs.type==='pen'?'pen':'set';else if(M.st==='kickoff'&&M.koUser)ctx='ko';else if(p&&M.owner===p)ctx='ball';else if(p&&M.gkHold===p)ctx='gkh';
 else if(p&&p.gk&&M.shot&&M.shot.side!==p.side)ctx='gks';else if(p&&((M.owner&&M.owner.side===p.side)||(M.pass&&M.pass.from.side===p.side)))ctx=M.ctrl==='solo'&&!(M.pass&&M.pass.to===p)?'call':'recv';else if(!M.owner)ctx='loose';
 if(!force&&ctx===M.lblCtx)return;M.lblCtx=ctx;
 const L={ball:['⚽','CHUTE','👟','PASSE','🎯','LANÇAR','🌀','FINTA'],recv:['⚽','CHUTE','👟','PASSE','🎯','LANÇAR','',''],loose:['⚽','CHUTE','🔁',M.ctrl==='solo'?'—':'TROCAR','🎯','LANÇAR','',''],
  def:['🦵','BOTE','🔁',M.ctrl==='solo'?'—':'TROCAR','🧲','PRESSÃO','',''],call:['','—','🙋','PEDIR','🏃','PEDIR LONGE','',''],set:['⚽','CHUTE','👟','PASSE','🎯','LANÇAR','',''],pen:['⚽','CHUTE','','','','','',''],ko:['','—','👟','SAÍDA','👟','SAÍDA','',''],
  gkh:['','—','👐','REPOR','🦶','CHUTÃO','',''],gks:['🧤','DEFESA','','','','','',''],auto:['','','','','','','','']}[ctx];
 const set=(id,i)=>{const el=$(id);el.innerHTML=L[i+1]?`<span>${L[i]}</span><small>${L[i+1]}</small>`:'';el.classList.toggle('off',!L[i+1]||L[i+1]==='—')};set('mbC',0);set('mbP',2);set('mbL',4);set('mbF',6);$('mbF').hidden=ctx!=='ball';$('mbR').innerHTML='<span>⚡</span><small>CORRER</small>';$('mt').classList.toggle('auto',ctx==='auto')}
// ---------- telas: apresentação, pausa e fim ----------
function mtIntro(){const M=MT,c=M.cfg;$('mtIn').hidden=false;$('mtInC').textContent=c.comp||'Partida';$('mtInT').innerHTML=`<span style="background:${OUR.shirt};color:${mtInk(OUR.shirt)}">${M.abbr[0]}</span> × <span style="background:${THEM.shirt};color:${mtInk(THEM.shirt)}">${M.abbr[1]}</span>`;
 $('mtInD').textContent=(M.start>0?`Você entra aos ${M.start}' · `:'')+`${M.names[0]} contra ${M.names[1]}`+(M.score[0]||M.score[1]?` · ${M.score[0]}×${M.score[1]}`:'');mtCtlChips()}
function mtCtlChips(){document.querySelectorAll('[data-mctl]').forEach(b=>b.classList.toggle('on',b.dataset.mctl===MT.ctrl));document.querySelectorAll('[data-mcam]').forEach(b=>b.classList.toggle('on',+b.dataset.mcam===MT.camPre))}
function mtSetCtrl(c){const M=MT;if(c===M.ctrl||!M.hero&&c==='solo')return;M.ctrl=c;if(c==='solo')M.ctl=M.hero;mtCtlChips();mtLabels(true);try{parent.postMessage({type:'ml-ctrl',ctrl:c},'*')}catch(e){}}
function mtEndCard(){const M=MT,h=M.hs,gk=M.hero&&M.hero.gk;$('mtEnd').hidden=false;$('mtEndS').innerHTML=`<span style="background:${OUR.shirt};color:${mtInk(OUR.shirt)}">${M.abbr[0]}</span><b>${M.score[0]} × ${M.score[1]}</b><span style="background:${THEM.shirt};color:${mtInk(THEM.shirt)}">${M.abbr[1]}</span>`;
 $('mtEndG').innerHTML=M.ev.length?M.ev.map(e=>`<li class="${e.us?'us':'th'}"><b>${e.m}'</b> ${e.w}${e.ast?` <i>(${e.ast})</i>`:''}${e.hero?' ⭐':''}</li>`).join(''):'<li>Sem gols.</li>';
 $('mtEndH').innerHTML=M.hero?`<b>★ ${M.hero.name}</b> · ⚽ ${h.g} · 🅰️ ${h.a} · 🎯 ${h.on}/${h.sh} chutes · 👟 ${h.pok}/${h.pa} passes · 🛡️ ${h.tk} desarmes${gk?` · 🧤 ${h.sv} defesas`:''}`:'';
 $('mtEndAgain').hidden=!!S.embed;$('mtEndMenu').textContent=S.embed?'Continuar ▶':'Menu'}
$('mtPause').onclick=()=>{if(!MT.on||MT.st==='end'||MT.st==='intro')return;MT.paused=true;$('mtPm').hidden=false;mtCtlChips();mtJoyReset()};
$('mtResume').onclick=()=>{MT.paused=false;$('mtPm').hidden=true};
$('mtSim').onclick=()=>mtSimRest();
$('mtQuit').onclick=()=>{if(S.embed){mtSimRest();return}$('mtPm').hidden=true;mtClear();showMenu()};
document.querySelectorAll('[data-mctl]').forEach(b=>b.onclick=()=>mtSetCtrl(b.dataset.mctl));
document.querySelectorAll('[data-mcam]').forEach(b=>b.onclick=()=>{MT.camPre=+b.dataset.mcam;try{localStorage.setItem('ml_mcam',String(MT.camPre))}catch(e){}mtCtlChips()});
$('mtGo').onclick=()=>{sfxUnlock();$('mtIn').hidden=true;MT.st=MT.st0||'kickoff';mtTip(mtHowTxt(),6)};
$('mtSkip').onclick=()=>{$('mtIn').hidden=true;mtClear();embedSend({skip:true})};
$('mtEndMenu').onclick=()=>{const res=mtResult();$('mtEnd').hidden=true;if(S.embed){mtClear();embedSend(res)}else{mtClear();showMenu()}};
$('mtEndAgain').onclick=()=>{$('mtEnd').hidden=true;mtStart({...MT.cfg,intro:false})};
addEventListener('visibilitychange',()=>{if(document.hidden&&MT.on&&MT.st!=='end'&&MT.st!=='intro'&&!MT.paused){MT.paused=true;$('mtPm').hidden=false;mtCtlChips();mtJoyReset()}});
// ---------- joystick e botões ----------
const JR=58;
function mtJoyReset(){MI.jx=MI.jy=MI.mag=0;MI.jid=null;MI.sprint=false;MI.press=false;if(MI.shoot){MI.shoot=false;$('mtPow').hidden=true}$('mtJb').classList.remove('on');$('mtJk').style.transform=''}
function mtJoySet(x,y){let dx=x-MI.x0,dy=y-MI.y0;const L=Math.hypot(dx,dy);if(L>JR){dx*=JR/L;dy*=JR/L}MI.jx=dx/JR;MI.jy=dy/JR;MI.mag=Math.min(1,L/JR);$('mtJk').style.transform=`translate(${dx}px,${dy}px)`}
{const jz=$('mtJz');
 jz.addEventListener('pointerdown',e=>{if(!MT.on||MI.jid!=null)return;e.preventDefault();sfxUnlock();MI.jid=e.pointerId;try{jz.setPointerCapture(e.pointerId)}catch(_){}const r=jz.getBoundingClientRect();MI.x0=e.clientX;MI.y0=e.clientY;const jb=$('mtJb');jb.style.left=(e.clientX-r.left)+'px';jb.style.top=(e.clientY-r.top)+'px';jb.classList.add('on');mtJoySet(e.clientX,e.clientY)});
 jz.addEventListener('pointermove',e=>{if(e.pointerId!==MI.jid)return;mtJoySet(e.clientX,e.clientY)});
 const up=e=>{if(e.pointerId!==MI.jid)return;MI.jid=null;MI.jx=MI.jy=MI.mag=0;$('mtJb').classList.remove('on');$('mtJk').style.transform=''};jz.addEventListener('pointerup',up);jz.addEventListener('pointercancel',up);
 document.querySelectorAll('#mt .mb').forEach(btn=>{const a=btn.dataset.a;let pid=null;
  btn.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();sfxUnlock();pid=e.pointerId;try{btn.setPointerCapture(e.pointerId)}catch(_){}btn.classList.add('dn');mtBtn(a,true)});
  const rel=e=>{if(pid!==e.pointerId)return;pid=null;btn.classList.remove('dn');mtBtn(a,false)};btn.addEventListener('pointerup',rel);btn.addEventListener('pointercancel',rel);btn.addEventListener('contextmenu',e=>e.preventDefault())})}
const MT_KEYS={KeyJ:'pass',KeyK:'shoot',KeyL:'lob',ShiftLeft:'sprint',ShiftRight:'sprint',KeyF:'feint',Space:'pass'};
function mtKeyJoy(){if(MI.jid!=null)return;const k=MI.keys;let x=(k.ArrowRight||k.KeyD?1:0)-(k.ArrowLeft||k.KeyA?1:0),y=(k.ArrowDown||k.KeyS?1:0)-(k.ArrowUp||k.KeyW?1:0);const L=Math.hypot(x,y);MI.jx=L?x/L:0;MI.jy=L?y/L:0;MI.mag=L?1:0}
addEventListener('keydown',e=>{if(!MT.on)return;if(e.code==='Escape'||e.code==='KeyP'){$('mtPause').onclick();return}if(MI.keys[e.code])return;MI.keys[e.code]=true;if(MT_KEYS[e.code]){e.preventDefault();mtBtn(MT_KEYS[e.code],true)}else if(/Arrow|Key[WASD]/.test(e.code)){e.preventDefault();mtKeyJoy()}});
addEventListener('keyup',e=>{if(!MT.on)return;MI.keys[e.code]=false;if(MT_KEYS[e.code])mtBtn(MT_KEYS[e.code],false);else mtKeyJoy()});
// entrada pelo jogo da carreira
function mtEmbed(cfg){S.paused=false;last=performance.now();S.embedDone=false;applyCfg(cfg);mtStart({...cfg,intro:true})}
