// ===================== INFÂNCIA: A RUA (10 anos) E O FUTSAL DO BAIRRO (12 anos) =====================
// Rua: asfalto remendado, calçada de pedra portuguesa, casas coloridas com grade e portão, poste com fiação, carros
// parados no meio-fio e de vez em quando um carro passando (para tudo). Gol de chinelo: dois chinelos no chão, um pouco
// mais de 1,5 m entre eles, e bola acima do joelho não vale. 2 contra 2, sem goleiro, criançada descalça,
// "com camisa contra sem camisa".
// Futsal: ginásio do bairro, quadra de 40×20 m pintada, gol de 3×2 m com rede, goleiro e quatro na linha, arquibancada
// pequena de cimento com as famílias, faixa do time na parede.
// Os dois cenários mudam o tamanho do gol (GW/GH), as paredes que seguram a bola, a câmera e o tamanho dos jogadores.
const KIDENV={street:{gw:.8,gh:.9,halfW:4.5,len:30,minZ:-5,wallX:7.4,scale:.72,pow:.8,sp:.86,camZ:44,camY:30},
 futsal:{gw:1.5,gh:2,halfW:10,len:40,minZ:-3.6,wallX:13.4,scale:.84,pow:.86,sp:.9,camZ:43.4,camY:8.6}};
const KG={street:null,futsal:null,cur:null};
const kidM=(c,map)=>new T.MeshLambertMaterial(map?{map}:{color:c});
function kidTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.anisotropy=MAXANI;return t}
// ---------- carro em blocos ----------
function kidCar(col){const g=new T.Group();const body=bx(1.85,.62,4.1,lam(col));body.position.y=.55;g.add(body);
 const cab=bx(1.6,.55,2.1,lam(col));cab.position.set(0,1.12,.2);g.add(cab);
 const glass=bx(1.62,.4,1.9,new T.MeshLambertMaterial({color:'#2a3946'}),false);glass.position.set(0,1.14,.2);glass.scale.set(1.01,1,1.01);g.add(glass);
 for(const sx of[-1,1])for(const sz of[-1.35,1.35]){const w=new T.Mesh(new T.CylinderGeometry(.33,.33,.24,14),lam('#151515'));w.rotation.z=Math.PI/2;w.position.set(sx*.86,.33,sz);g.add(w)}
 const fl=bx(1.4,.16,.05,new T.MeshBasicMaterial({color:'#fff6c8'}),false);fl.position.set(0,.66,-2.06);g.add(fl);const bl=bx(1.4,.14,.05,new T.MeshBasicMaterial({color:'#c8231d'}),false);bl.position.set(0,.66,2.06);g.add(bl);
 return g}
// ---------- chinelo ----------
function kidChinelo(col,strap){const g=new T.Group();const so=new T.Mesh(new T.CylinderGeometry(.075,.06,.022,14),lam(col));so.scale.set(1,1,2.1);so.position.y=.012;g.add(so);
 const sm=lam(strap);for(const s of[-1,1]){const st=new T.Mesh(new T.CylinderGeometry(.009,.009,.11,6),sm);st.position.set(s*.035,.04,-.03);st.rotation.set(.9,0,s*.9);g.add(st)}
 const k=new T.Mesh(new T.SphereGeometry(.014,6,6),sm);k.position.set(0,.03,-.09);g.add(k);g.traverse(o=>{if(o.isMesh)o.castShadow=true});return g}
// ---------- a rua ----------
function buildStreet(){const G=new T.Group();G.visible=false;scene.add(G);const add=(m,x,y,z)=>{m.position.set(x,y,z);G.add(m);return m};
 // asfalto com remendos e faixa apagada
 const at=kidTex(256,256,(x,w,h)=>{x.fillStyle='#4a4d52';x.fillRect(0,0,w,h);for(let i=0;i<7000;i++){const v=40+Math.random()*60|0;x.fillStyle=`rgba(${v},${v},${v+4},.5)`;x.fillRect(Math.random()*w,Math.random()*h,1+Math.random()*2,1+Math.random()*2)}
  for(let i=0;i<5;i++){x.fillStyle='rgba(28,30,33,.55)';x.beginPath();x.ellipse(Math.random()*w,Math.random()*h,8+Math.random()*26,6+Math.random()*16,Math.random()*3,0,7);x.fill()}});
 at.wrapS=at.wrapT=T.RepeatWrapping;at.repeat.set(3,12);const road=new T.Mesh(new T.PlaneGeometry(10.2,120),kidM(0,at));road.rotation.x=-Math.PI/2;road.receiveShadow=true;add(road,0,.003,20);
 for(let z=-40;z<80;z+=6){const d=new T.Mesh(new T.PlaneGeometry(.14,2.6),new T.MeshLambertMaterial({color:'#d8d2b0',transparent:true,opacity:.45}));d.rotation.x=-Math.PI/2;add(d,0,.006,z)}
 // calçada portuguesa (ondas preto e branco) com meio-fio
 const ct=kidTex(256,256,(x,w,h)=>{x.fillStyle='#e9e5da';x.fillRect(0,0,w,h);x.strokeStyle='#26272a';x.lineWidth=26;for(let k=-1;k<3;k++){x.beginPath();for(let i=0;i<=w;i+=4){const y=k*128+64+Math.sin(i/w*Math.PI*2)*40;i?x.lineTo(i,y):x.moveTo(i,y)}x.stroke()}
  for(let i=0;i<2600;i++){x.fillStyle='rgba(0,0,0,.08)';x.fillRect(Math.random()*w,Math.random()*h,2,2)}});ct.wrapS=ct.wrapT=T.RepeatWrapping;ct.repeat.set(1,40);
 for(const sx of[-1,1]){const sw=new T.Mesh(new T.BoxGeometry(2.3,.15,120),[lam('#bdb8ad'),lam('#bdb8ad'),kidM(0,ct),lam('#bdb8ad'),lam('#bdb8ad'),lam('#bdb8ad')]);sw.receiveShadow=true;add(sw,sx*6.25,.075,20);
  const curb=bx(.16,.17,120,lam('#d9d4c8'),false);curb.receiveShadow=true;add(curb,sx*5.12,.085,20)}
 // casas: fachada colorida, porta, janela com grade, portão, muro pichado, um bar
 const cols=['#f2c14e','#7fb3d5','#f19c79','#a8d5a2','#f7f1e3','#d4a5d9','#e76f51','#9fd8cb'];const words=['RUA 9','BAR DO ZÉ','VENDE-SE','FÉ','A RUA É NOSSA','CRAQUE','PAZ'];
 for(const sx of[-1,1])for(let z=-38,k=0;z<78;k++){const wdt=6+((k*7+(sx>0?3:0))%5);const ht=3.2+((k*5)%3)*1.1;const col=cols[(k*3+(sx>0?2:0))%cols.length];
  const ft=kidTex(256,160,(x,w,h)=>{x.fillStyle=col;x.fillRect(0,0,w,h);for(let i=0;i<500;i++){x.fillStyle='rgba(0,0,0,.05)';x.fillRect(Math.random()*w,Math.random()*h,2,2)}
   x.fillStyle='rgba(60,40,30,.25)';x.fillRect(0,h-14,w,14);x.fillStyle='#5b3a24';x.fillRect(w*.12,h*.42,w*.16,h*.58);x.fillStyle='#2b2f33';x.fillRect(w*.5,h*.3,w*.3,h*.3);x.fillStyle='#9aa0a6';for(let i=0;i<7;i++)x.fillRect(w*.5+i*w*.05,h*.3,3,h*.3);
   if(k%3===1){x.fillStyle='#454b52';x.fillRect(w*.35,h*.5,w*.12,h*.5);for(let i=0;i<6;i++){x.fillStyle='#2b2f33';x.fillRect(w*.35+i*w*.02,h*.5,2,h*.5)}}
   if(k%4===2){x.save();x.translate(w*.5,h*.82);x.rotate(-.05);x.font='900 20px "Saira Condensed",Impact,sans-serif';x.textAlign='center';x.fillStyle=pick(['#1e1e1e','#b2221c','#1c4fa0']);x.fillText(words[(k+(sx>0?2:0))%words.length],0,0);x.restore()}});
  const f=new T.Mesh(new T.PlaneGeometry(wdt,ht),kidM(0,ft));f.rotation.y=-sx*Math.PI/2;add(f,sx*7.4,ht/2,z+wdt/2);
  const blk=bx(4,ht,wdt,lam(col),false);add(blk,sx*9.42,ht/2,z+wdt/2);const roof=bx(4.4,.25,wdt+.2,lam('#8a5a44'),false);add(roof,sx*9.3,ht+.12,z+wdt/2);z+=wdt}
 // poste com fio
 for(const z of[-12,14,40,66]){add(bx(.22,8,.22,lam('#8d8f92'),false),5.6,4,z);add(bx(1.6,.1,.1,lam('#8d8f92'),false),4.9,7.8,z);add(bx(.5,.18,.3,new T.MeshBasicMaterial({color:'#fff1c2'}),false),4.2,7.7,z)}
 for(const y of[7.3,7.0]){const w=new T.Mesh(new T.CylinderGeometry(.012,.012,80,4),lam('#1d1d1d'));w.rotation.x=Math.PI/2;add(w,5.6,y,26)}
 // carros parados no meio-fio (fora da área do racha)
 const carC=['#c0392b','#ecf0f1','#2c3e50','#f1c40f','#16a085','#7f8c8d'];[[-4.05,-9],[4.05,-13],[-4.05,37],[4.05,41],[-4.05,47],[4.05,55]].forEach(([x,z],i)=>{const c=kidCar(carC[i%carC.length]);c.position.set(x,0,z);c.rotation.y=i%2?Math.PI:0;G.add(c)});
 // o carro que passa
 KG.car=kidCar('#3d6fb8');KG.car.visible=false;G.add(KG.car);
 // chinelos: o gol de cada lado
 const cA=kidChinelo('#2f6fe0','#f2f2f2'),cB=kidChinelo('#ffd23c','#1d6b3a');cA.position.set(-.8,0,0);cA.rotation.y=.4;cB.position.set(.8,0,0);cB.rotation.y=-.3;G.add(cA,cB);
 const cC=kidChinelo('#e74c3c','#ffffff'),cD=kidChinelo('#ffffff','#2f6fe0');cC.position.set(-.8,0,30);cC.rotation.y=2.6;cD.position.set(.8,0,30);cD.rotation.y=3.4;G.add(cC,cD);
 // fundo: muro no fim da rua e céu de fim de tarde
 add(bx(16,3,.4,lam('#c9b79c'),false),0,1.5,-40);add(bx(16,3,.4,lam('#c9b79c'),false),0,1.5,82);
 G.traverse(o=>{if(o.isMesh&&o.castShadow===undefined)o.castShadow=false});return G}
// ---------- o ginásio do bairro ----------
function buildFutsal(){const G=new T.Group();G.visible=false;scene.add(G);const add=(m,x,y,z)=>{m.position.set(x,y,z);G.add(m);return m};
 // piso: quadra azul com área cinza em volta, linhas brancas
 const ft=kidTex(512,1024,(x,w,h)=>{x.fillStyle='#2f6fb3';x.fillRect(0,0,w,h);for(let i=0;i<9000;i++){x.fillStyle=Math.random()<.5?'rgba(255,255,255,.035)':'rgba(0,0,0,.04)';x.fillRect(Math.random()*w,Math.random()*h,2,1)}
  const sx=w/20,sz=h/40,L=(a,b,c,d)=>{x.beginPath();x.moveTo(a*sx,b*sz);x.lineTo(c*sx,d*sz);x.stroke()};x.strokeStyle='#ffffff';x.lineWidth=5;x.strokeRect(2,2,w-4,h-4);L(0,20,20,20);
  x.beginPath();x.arc(10*sx,20*sz,3*sx,0,7);x.stroke();for(const e of[0,1]){const z0=e?40:0,dir=e?-1:1;x.beginPath();x.arc(8.42*sx,z0*sz,6*sx,e?Math.PI:0,e?Math.PI*1.5:Math.PI*.5,false);x.stroke();x.beginPath();x.arc(11.58*sx,z0*sz,6*sx,e?Math.PI*1.5:Math.PI*.5,e?Math.PI*2:Math.PI,false);x.stroke();L(8.42,z0+dir*6,11.58,z0+dir*6);
   x.fillStyle='#fff';x.beginPath();x.arc(10*sx,(z0+dir*6)*sz,4,0,7);x.fill();x.beginPath();x.arc(10*sx,(z0+dir*10)*sz,4,0,7);x.fill()}
  x.fillStyle='rgba(255,210,60,.35)';x.font='900 italic 46px "Saira Condensed",Impact,sans-serif';x.textAlign='center';x.save();x.translate(w/2,h/2);x.fillText('VILA ESPERANÇA',0,16);x.restore()});
 const court=new T.Mesh(new T.PlaneGeometry(20,40),kidM(0,ft));court.rotation.x=-Math.PI/2;court.receiveShadow=true;add(court,0,.004,20);
 const out=new T.Mesh(new T.PlaneGeometry(30,52),lam('#8b8f94'));out.rotation.x=-Math.PI/2;out.receiveShadow=true;add(out,0,.002,20);
 // gols de futsal 3×2 com rede
 const pm=new T.MeshPhongMaterial({color:'#ffffff',shininess:60});const nm=new T.LineBasicMaterial({color:'#ffffff',transparent:true,opacity:.55});
 for(const e of[0,1]){const g=new T.Group();const Z=e?40:0;g.position.set(0,0,Z);if(e)g.rotation.y=Math.PI;
  for(const s of[-1,1]){const p=new T.Mesh(new T.CylinderGeometry(.05,.05,2,12),pm);p.position.set(s*1.5,1,0);p.castShadow=true;g.add(p)}const bar=new T.Mesh(new T.CylinderGeometry(.05,.05,3,12),pm);bar.rotation.z=Math.PI/2;bar.position.set(0,2,0);g.add(bar);
  const pts=[];const D=.9;for(let i=0;i<=12;i++){const x=-1.5+i*.25;pts.push(x,2,0,x,2,-D,x,2,-D,x,0,-D)}for(let j=0;j<=8;j++){const y=j*.25;pts.push(-1.5,y,-D,1.5,y,-D,-1.5,y,0,-1.5,y,-D,1.5,y,0,1.5,y,-D)}for(let k=0;k<=4;k++){const z=-k*D/4;pts.push(-1.5,2,z,1.5,2,z,-1.5,0,z,-1.5,2,z,1.5,0,z,1.5,2,z)}
  const ng=new T.BufferGeometry();ng.setAttribute('position',new T.Float32BufferAttribute(pts,3));g.add(new T.LineSegments(ng,nm));G.add(g)}
 // paredes: bloco pintado (verde embaixo, branco em cima), faixa do time, arquibancada de cimento com a família
 const wt=kidTex(512,128,(x,w,h)=>{x.fillStyle='#f1efe8';x.fillRect(0,0,w,h);x.fillStyle='#2e8b57';x.fillRect(0,h*.55,w,h*.45);x.strokeStyle='rgba(0,0,0,.12)';x.lineWidth=1;for(let y=0;y<h;y+=12){x.beginPath();x.moveTo(0,y);x.lineTo(w,y);x.stroke()}for(let y=0;y<h;y+=12)for(let i=(y/12)%2*16;i<w;i+=32){x.beginPath();x.moveTo(i,y);x.lineTo(i,y+12);x.stroke()}});wt.wrapS=T.RepeatWrapping;
 for(const [x,z,len,ry] of[[-13.6,20,52,1],[13.6,20,52,1],[0,-4.8,28,0],[0,44.8,28,0]]){const t=wt.clone();t.needsUpdate=true;t.repeat.set(len/8,1);const w=new T.Mesh(new T.PlaneGeometry(len,9),kidM(0,t));if(ry)w.rotation.y=x<0?Math.PI/2:-Math.PI/2;else if(z>20)w.rotation.y=Math.PI;add(w,x,4.5,z)}
 const ban=kidTex(512,96,(x,w,h)=>{x.fillStyle='#ffd23c';x.fillRect(0,0,w,h);x.fillStyle='#10356b';x.font='900 italic 48px "Saira Condensed",Impact,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('E.C. VILA ESPERANÇA · SUB-13',w/2,h/2+3)});
 const bn=new T.Mesh(new T.PlaneGeometry(14,2.6),kidM(0,ban));bn.rotation.y=Math.PI;add(bn,0,5.6,44.7);const bn2=bn.clone();bn2.rotation.y=-Math.PI/2;add(bn2,13.55,5.6,26);
 const seats=[];for(let r=0;r<4;r++){const st=bx(1.1,.5,30,lam(r%2?'#a6a6a6':'#b8b8b8'),false);add(st,-11.2-r*.6,.25+r*.5,20);for(let z=6;z<34;z+=1.2)if(Math.random()<.35)seats.push([-11.2-r*.6,.5+r*.5,z+R(-.2,.2)])}
 if(seats.length){const n=seats.length,body=new T.InstancedMesh(new T.BoxGeometry(.45,.6,.32),new T.MeshLambertMaterial(),n),head=new T.InstancedMesh(new T.BoxGeometry(.28,.28,.28),new T.MeshLambertMaterial(),n);const M=new T.Matrix4(),C=new T.Color();
  seats.forEach(([x,y,z],i)=>{M.makeTranslation(x,y+.3,z);body.setMatrixAt(i,M);body.setColorAt(i,C.set(pick(['#ffd23c','#10356b','#e74c3c','#ffffff','#2ecc71','#9b59b6'])));M.makeTranslation(x,y+.75,z);head.setMatrixAt(i,M);head.setColorAt(i,C.set(pick(SKINS)))});G.add(body,head)}
 // telhado com treliça e luminárias
 add(bx(28,.3,52,lam('#5c6168'),false),0,10.2,20);for(let z=-2;z<44;z+=6){add(bx(27,.25,.25,lam('#7c828a'),false),0,9.6,z);add(bx(2.2,.18,.6,new T.MeshBasicMaterial({color:'#fffbe6'}),false),-5,9.4,z+3);add(bx(2.2,.18,.6,new T.MeshBasicMaterial({color:'#fffbe6'}),false),5,9.4,z+3)}
 return G}
// ---------- trocar de cenário ----------
const KSKY={};
function kidSky(env){if(!KSKY[env]){const c=document.createElement('canvas');c.width=2;c.height=256;const x=c.getContext('2d');const g=x.createLinearGradient(0,0,0,256);
  if(env==='street'){g.addColorStop(0,'#3f5fa8');g.addColorStop(.5,'#e8946b');g.addColorStop(1,'#ffd9a3')}else{g.addColorStop(0,'#2b2f35');g.addColorStop(1,'#4b5058')}x.fillStyle=g;x.fillRect(0,0,2,256);KSKY[env]=new T.CanvasTexture(c)}
 scene.background=KSKY[env];if(env==='street'){scene.fog.color.set('#e9b48c');scene.fog.near=60;scene.fog.far=150;hemi.color.set('#ffe8cf');hemi.groundColor.set('#6b5a4a');hemi.intensity=.66;sun.color.set('#ffd2a1');sun.intensity=.8}
 else{scene.fog.color.set('#3c4148');scene.fog.near=60;scene.fog.far=140;hemi.color.set('#ffffff');hemi.groundColor.set('#3e5a7a');hemi.intensity=.85;sun.color.set('#fff8e8');sun.intensity=.5}}
{const _se=setEnv;setEnv=function(env){
  if(env==='street'||env==='futsal'){if(ENV.cur!=='stadium')_se('stadium');S.env=env;KG.cur=env;if(!KG[env])KG[env]=env==='street'?buildStreet():buildFutsal();
   for(const k of['street','futsal'])if(KG[k])KG[k].visible=k===env;for(const o of STAD.objs)o.visible=false;for(const o of PITCH.objs)o.visible=false;goalG.visible=false;GOAL2.visible=false;
   const E=KIDENV[env];GW=E.gw;GH=E.gh;S.kidPow=E.pow;kidSky(env);return}
  if(KG.cur){KG.cur=null;for(const k of['street','futsal'])if(KG[k])KG[k].visible=false;for(const o of STAD.objs)o.visible=true;for(const o of PITCH.objs)o.visible=true;goalG.visible=true;GOAL2.visible=true;GW=GW0;GH=GH0;S.kidPow=1;
   const k=SKY.stadium;scene.background=k.bg;scene.fog.color.set(k.fog[0]);scene.fog.near=k.fog[1];scene.fog.far=k.fog[2];hemi.color.set(k.hemi[0]);hemi.groundColor.set(k.hemi[1]);hemi.intensity=k.hemi[2];sun.color.set(k.sun[0]);sun.intensity=k.sun[1];S.env='stadium'}
  return _se(env)}}
// ---------- física: paredes, meio-fio, rede do futsal; sem trave na rua ----------
{const _cg=collideGoal;collideGoal=function(b){if(KG.cur==='street')return;return _cg(b)}}
{const _nc=netCollide;netCollide=function(b,dt){if(!KG.cur)return _nc(b,dt);if(KG.cur==='futsal'){const p=b.p,v=b.v;if(p.z<0&&p.z>-1.3&&Math.abs(p.x)<GW&&p.y<GH){b.inGoal=true;if(p.z<-.86){p.z=-.86;if(v.z<0)v.z*=-.12;v.x*=.6;v.y*=.6;b.w.multiplyScalar(.4)}if(p.y>GH-.12&&v.y>0)v.y*=-.2}}}}
{const _cs=collideStadium;collideStadium=function(b){if(!KG.cur)return _cs(b);const E=KIDENV[KG.cur],p=b.p,v=b.v,wx=E.wallX-BR;
  if(Math.abs(p.x)>wx&&p.x*v.x>0){p.x=Math.sign(p.x)*wx;v.x=-v.x*.45;v.z*=.8}
  if(KG.cur==='street'&&Math.abs(p.x)>5.05&&Math.abs(p.x)<5.3&&p.y<.3&&p.x*v.x>0&&Math.abs(v.x)<4){p.x=Math.sign(p.x)*5.05;v.x=-v.x*.4}
  if(KG.cur==='futsal'){if(p.z<-4.6&&v.z<0){p.z=-4.6;v.z=-v.z*.4}if(p.z>44.6&&v.z>0){p.z=44.6;v.z=-v.z*.4}if(p.y>9.8&&v.y>0){p.y=9.8;v.y=-v.y*.3}}
  else if(p.z<-38&&v.z<0){p.z=-38;v.z=-v.z*.3}}}
{const _cc=checkContacts;checkContacts=function(prev){if(KG.cur){const p=S.ball.p,E=KIDENV[KG.cur];if(KG.cur==='futsal'&&Math.abs(p.x)>E.halfW+.4&&p.y<3)return endPlay('outside');if(p.z<-4&&!(Math.abs(p.x)<GW&&p.y<GH))return endPlay('wide');if(p.z>E.len+3)return endPlay('outside')}return _cc(prev)}}
{const _cl=camLim;camLim=p=>{if(!KG.cur)return _cl(p);const E=KIDENV[KG.cur];p.x=clamp(p.x,-E.wallX+.7,E.wallX-.7);p.z=clamp(p.z,E.minZ+.6,E.camZ);p.y=clamp(p.y,1.2,E.camY);return p}}
// criança em campo: menores, um pouco mais lentas, e ninguém sai da rua/quadra
{const _ap=animPlayer;animPlayer=function(p,dt,now){if(KG.cur){const E=KIDENV[KG.cur],lim=KG.cur==='street'?E.halfW+2.2:E.halfW+2.6;p.pos.x=clamp(p.pos.x,-lim,lim);p.pos.z=clamp(p.pos.z,E.minZ+.4,E.len+6)}return _ap(p,dt,now)}}
// ---------- quem joga ----------
const KID_TEE=['#e8e2d0','#d94a3a','#2f5fae','#f2c94c','#3fa66b','#f08a24','#8e5ad1','#ffffff'],KID_SH=['#1d2b4a','#3a3a3a','#7a1f1f','#1f5f3a','#c8c2b0','#2f5fae'];
// rua: o seu time de camiseta, o deles sem camisa; todo mundo descalço
function KUs(kind,x,z,num,run){const sk=pick(SKINS);const tee=pick(KID_TEE);return P(kind,x,z,num,run,{shirt:tee,shirt2:'#222222',trim:tee,shorts:pick(KID_SH),socks:sk,boot:sk,num:''})}
function KAt(x,z,car){const p=KThem(x,z);S.opps.splice(S.opps.indexOf(p),1);S.atks.push(p);setFacingNow(p,-x*.1,-z);if(car)S.carrier=p;return p}
function KThem(x,z){const sk=pick(SKINS);const p=makePlayer({shirt:sk,shirt2:sk,trim:sk,tee:sk,shorts:pick(KID_SH),socks:sk,boot:sk,num:'',team:'them',skin:sk,hair:pick(HAIRS),sp:6});p.pos.set(x,0,z);p.home=new T.Vector3(x,0,z);setFacingNow(p,0,1);S.players.push(p);S.opps.push(p);return p}
const FS_US={shirt:'#ffd23c',shirt2:'#10356b',shorts:'#10356b',socks:'#ffd23c'},FS_TH={shirt:'#d62828',shirt2:'#ffffff',shorts:'#ffffff',socks:'#d62828'};
function FUs(kind,x,z,num,run){return P(kind,x,z,num,run,FS_US)}
function FThem(x,z){const keep=THEM;THEM={...THEM,...FS_TH};const p=O(x,z);THEM=keep;return p}
function FK(){const keep=GKC;GKC={...GKC,shirt:'#2b2b2b',shirt2:'#ffd23c',shorts:'#2b2b2b',socks:'#2b2b2b'};const p=K();GKC=keep;p.pos.set(0,0,.6);return p}
Object.assign(SC,{
 rua1:{env:'street',kid:1,n:'Racha · 2 contra 2',ic:'🩴',d:'Gol de chinelo. Seu parceiro corre pro lado, o grandão vem em você.',build(){const s=flip(),x0=R(1,2.6)*s;KUs('me',x0,13,10);KUs('m',-x0*.8,9.5,7,[-x0*.9,4.2]);KThem(x0*.7,10.4);KThem(-x0*.3,3.2)}},
 rua2:{env:'street',kid:1,n:'Racha · drible',ic:'🌀',d:'Um na frente, outro na linha do chinelo. Passa por ele.',build(){const s=flip(),x0=R(.6,2)*s;KUs('me',x0,9,10);KThem(x0*.9,6.6);KThem(-x0*.6,2.4);KUs('m',-x0*1.6,12.5,7,[-x0*1.4,5])}},
 rua3:{env:'street',kid:1,def:true,n:'Racha · defesa',ic:'🛡️',d:'Vieram dois pra cima de você. Segura!',build(){const x0=R(-2.2,2.2);const k0=OUR;OUR={...OUR,shirt:pick(KID_TEE),shirt2:'#222222',shorts:pick(KID_SH)};DH(x0*.5,6.5);OUR={...OUR,shirt:pick(KID_TEE)};DF(-x0*.5,3.5);OUR=k0;KAt(x0,14,true);KAt(-x0*1.2,12,false)}},
 rua4:{env:'street',kid:1,n:'Racha · bomba',ic:'💥',d:'Ficou de longe com espaço. Chuta rasteiro, alto não vale!',build(){const x0=R(-2.5,2.5);KUs('me',x0,17,10);KUs('m',-x0*.6+1.5,10,7);KThem(-1,3.6);KThem(1.6,6.2)}},
 fs1:{env:'futsal',kid:1,n:'Futsal · chute',ic:'🥅',d:'Entrada da área, marcador colado. Chute no canto ou toque pro pivô.',build(){const s=flip(),x0=R(1,4)*s;FUs('me',x0,11,10);FUs('m',-x0*.4,5.6,9,[-x0*.3,3.2]);FUs('m',7*s,9,7);FUs('m',0,20,3);
   FThem(x0*.8,8.6);FThem(-1.6,4.4);FThem(5*s,6.8);FThem(-6*s,10);FK()}},
 fs2:{env:'futsal',kid:1,n:'Futsal · ala',ic:'↪️',d:'Você na ala. Corte pra dentro e bata ou rola pro pivô no segundo pau.',build(){const s=flip();FUs('me',8*s,7.5,7);FUs('m',-1*s,4.6,9,[-1.4*s,2.4]);FUs('m',0,13,10);FUs('m',-6*s,12,3);
   FThem(6.8*s,5.8);FThem(.3,3.4);FThem(-4*s,6);FThem(-1.5*s,11);FK()}},
 fs3:{env:'futsal',kid:1,n:'Futsal · tabela',ic:'🔁',d:'Toque no pivô e corra pra receber de volta.',build(){const x0=R(-3,3);FUs('me',x0,14,10);FUs('m',x0*.3+2,8.5,9);FUs('m',-7,10,7);FUs('m',7,11,11);
   FThem(x0+.6,11.6);FThem(x0*.3+2.4,6.8);FThem(-5,6);FThem(5,7);FK()}},
 fs4:{env:'futsal',kid:1,def:true,n:'Futsal · defesa',ic:'🛡️',d:'Contra-ataque deles. Fecha o caminho e dá o bote.',build(){const x0=R(-3,3);const keep=GKU;GKU={...GKU,shirt:'#2b2b2b',shirt2:'#ffd23c',shorts:'#2b2b2b',socks:'#2b2b2b'};KD();GKU=keep;S.gk.pos.set(0,0,.6);
   const k0=OUR;OUR={...OUR,...FS_US};DH(x0*.5,7);DF(-x0*.6,4.2);OUR=k0;const k1=THEM;THEM={...THEM,...FS_TH};AT(x0,15,9,true);AT(-x0*1.4,12,11);THEM=k1}},
 fsGk:{env:'futsal',kid:1,gk:true,n:'Futsal · goleiro',ic:'🧤',d:'Chute deles.',build(){const x0=R(-4,4);const keep=GKU;GKU={...GKU,shirt:'#2b2b2b',shirt2:'#ffd23c',shorts:'#2b2b2b',socks:'#2b2b2b'};KU();GKU=keep;S.gk.pos.set(0,0,.6);const k1=THEM;THEM={...THEM,...FS_TH};SH(x0,R(7.5,10),9);A(x0+3,12);THEM=k1;const k0=OUR;OUR={...OUR,...FS_US};D(x0*.6,5);D(-3,7);OUR=k0}}});
const KIDS=['rua1','rua2','rua3','rua4','fs1','fs2','fs3','fs4'];
// cada cena de criança muda o cenário sozinha; a primeira cena normal volta pro estádio
{const _ss=startScen;startScen=function(key){const sc=SC[key]||{};
  if(sc.env){if(KG.cur!==sc.env){S.envBack=KG.cur?S.envBack:(S.env||'stadium');setEnv(sc.env)}}else if(KG.cur)setEnv(S.envBack||'stadium');
  const r=_ss(key);
  if(sc.kid&&KG.cur){const E=KIDENV[KG.cur];for(const p of S.players){p.g.scale.setScalar(E.scale);p.sp=(p.sp||7)*E.sp;
    // na rua é todo mundo descalço
    if(KG.cur==='street'){const hm=p.neck.children[0]&&p.neck.children[0].material;if(hm&&hm.color){const m=lam('#'+hm.color.getHexString());p.knees.forEach(K=>{if(K.children[1])K.children[1].material=m})}}}snapCam()}
  return r}}
// carro passando na rua: todo mundo pra calçada
function kidCarPass(){return new Promise(res=>{if(KG.cur!=='street'||!KG.car){res();return}const c=KG.car;c.visible=true;const sd=Math.random()<.5?1:-1;c.position.set(sd*1.6,0,sd>0?70:-34);c.rotation.y=sd>0?0:Math.PI;
 KG.carRun={c,sd,v:9*(sd>0?-1:1),done:res};for(const p of S.players)p.carSpot=new T.Vector3(p.pos.x>=0?5.7:-5.7,0,p.pos.z)})}
function kidCarStep(dt){const R0=KG.carRun;if(!R0)return;const c=R0.c;c.position.z+=R0.v*dt;for(const p of S.players){if(p.carSpot){steer(p,p.carSpot,5,dt);setFacing(p,c.position.x-p.pos.x,c.position.z-p.pos.z,dt,6)}}
 if((R0.v<0&&c.position.z<-36)||(R0.v>0&&c.position.z>72)){c.visible=false;KG.carRun=null;for(const p of S.players)p.carSpot=null;R0.done()}}
