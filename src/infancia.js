// ================== INFÂNCIA: a rua aos 10, o futsal aos 12, a peneira aos 14 ==================
// Antes da peneira o jogador vive dois capítulos jogados no motor 3D (ou resumidos, no modo decisão):
// 10 anos: racha 2 contra 2 na rua, gol de chinelo, calçada e carro passando ("vira 2, acaba 4").
// 12 anos: final do futsal do bairro pelo E.C. Vila Esperança. Aos 14 vem a peneira e, depois de assinar,
// dois anos de base passam num capítulo e a temporada começa aos 16, como sempre.
const KID={
 rua:{key:'rua',age:10,env:'street',total:20,half:0,tab:'rua1',atk:['rua1','rua2','rua4','rua1','rua2'],def:['rua3'],gk:null,n:5,cap:4,gl:[[1,3],[1,3]],
  us:'Rua das Flores',th:'Beco do Sapo',ua:'FLO',ta:'SAP',usC:['#f2c94c','#222222'],themC:['#c99368','#222222'],comp:'Racha na rua · 10 anos',label:'Vira 2, acaba 4'},
 fut:{key:'fut',age:12,env:'futsal',total:40,half:20,tab:'fs1',atk:['fs1','fs2','fs3','fs1','fs2'],def:['fs4'],gk:['fsGk'],n:5,gl:[[0,2],[1,3]],
  us:'Vila Esperança',th:'Jardim América',ua:'VIL',ta:'JAR',usC:['#ffd23c','#10356b'],themC:['#d62828','#ffffff'],comp:'Futsal do bairro · 12 anos',label:'Final do campeonato'}};
const KID_NAMES=['Caio','Biel','Juninho','Dudu','Pedrinho','Kauã','Rafinha','Zezinho','Tico','Vitinho','Lipe','Maicon','Baixinho','Alemão'];
const KID_DEF=['rua3','fs4'],KID_GK=['fsGk'];
function kidRole(sc){return KID_GK.includes(sc)?'gk':KID_DEF.includes(sc)?'def':'atk'}
function kidSkill(){try{const a=CA();const k=S.pos==='GOL'?(a.REF+a.MEN)/2:(a.DRI+a.VEL+a.FIN+a.PAS)/4;return clamp((k-38)/50,.15,.9)}catch(e){return .5}}
function kidLances(K){const p=S.pos;const gk=p==='GOL'&&!!K.gk;const def=['ZAG','LD','LE','VOL'].includes(p)||(p==='GOL'&&!K.gk);const L=[];
 for(let i=0;i<K.n;i++){let pool=K.atk;
  if(gk)pool=i===K.n-1?K.atk:K.gk;            // goleiro: defende tudo e no fim sai pro jogo
  else if(def)pool=i%2===0?K.def:K.atk;       // zagueiro: metade marcando
  else if(i===2)pool=K.def;                   // todo mundo marca pelo menos uma vez
  let s=pick(pool);if(L.length&&L[L.length-1]===s&&pool.length>1)s=pick(pool.filter(x=>x!==s));L.push(s)}
 return L}
function kidTimeline(K,L){const TT=K.total;const ev=[];const step=(TT-4)/L.length;
 L.forEach((sc,i)=>ev.push({m:Math.max(1,Math.round(2+step*i+R(0,step*.6))),k:'lance',sc}));
 const gl=K.gl||[[0,2],[1,3]];const ou=RI(...gl[0]),ot=RI(...gl[1]);
 for(let i=0;i<ou;i++)ev.push({m:RI(2,TT-1),k:'g',us:true});for(let i=0;i<ot;i++)ev.push({m:RI(2,TT-1),k:'g',us:false});
 for(let i=0;i<2;i++)ev.push({m:RI(3,TT-2),k:'c',us:ch(.5)});
 ev.sort((a,b)=>a.m-b.m);return ev}
// lance sem jogar (modo decisão, ⏭ ou "Simular"): a chance vem dos atributos
function kidAutoRes(sc,sk){const role=kidRole(sc);const ok=rnd()<clamp(.32+.42*sk,.2,.78);
 if(role==='atk'){const hg=ok&&ch(.75);return{role,goal:ok,heroGoal:hg,heroAssist:ok&&!hg,kind:ok?'goal':'miss'}}
 return{role,goal:!ok,kind:ok?(role==='gk'?'save':'desarme'):'goal'}}
function kidFlash(t){try{L3D.frame.contentWindow.postMessage({type:'ml-sess',op:'flash',txt:t},'*')}catch(e){}}
function kidOff(){SESS.on=false;SESS.skipAll=false;try{L3D.frame.classList.remove('on');document.body.classList.remove('l3d-on')}catch(e){}}
// o lance da infância usa a cena pedida (rua1…fs4) e o ambiente da rua/quadra
{const _cfgK=l3dCfg;l3dCfg=function(o){const c=_cfgK(o);if(o&&o.scen){c.scen=o.scen;c.head=o.title||null;c.goal=null;delete c.crowd;if(o.env)c.env=o.env;if(c.hero)c.hero={...c.hero,beard:false}}return c}}
async function kidMatch(K,play){
 const R0={gu:0,gt:0,g:0,a:0,won:0,tot:0,sc:[],played:false,cap:false,pens:null};
 const nm=first()||'Você';const L=kidLances(K);const ev=kidTimeline(K,L);const sk=kidSkill();
 let on=false;
 if(play&&lanceMode()==='jogar'&&!L3D.failed){
  try{await l3dBoot();L3D._loaded=true;
   SESS.on=true;SESS.skipAll=false;L3D.frame.classList.add('on');document.body.classList.add('l3d-on');
   const base=l3dCfg({kind:'finish'});const hero={...(base.hero||{}),beard:false};
   const r=await sessCall('start',{info:{usName:K.us,themName:K.th,usAbbr:K.ua,themAbbr:K.ta,usC:K.usC,themC:K.themC,comp:K.comp,label:K.label,
     total:K.total,half:K.half,tableau:K.tab,env:K.env,cfg:{env:K.env,hero},heroGK:S.pos==='GOL'&&!!K.gk,def:['GOL','ZAG','LD','LE','VOL'].includes(S.pos)}});
   if(!r||r.skip||r.err)kidOff();else{on=true;R0.played=true}
  }catch(e){L3D.failed=L3D.failed||!L3D._loaded;kidOff()}}
 const live=()=>on&&!SESS.skipAll;
 let turned=false;
 const goal=async(us,w,m,o={})=>{if(us)R0.gu++;else R0.gt++;R0.sc.push({m,w,us});if(o.mine)R0.g++;if(o.ast)R0.a++;
  if(live())await sessCall('event',{e:{t:'g',us,mine:!!o.mine,ast:!!o.ast,w,m},gu:R0.gu,gt:R0.gt});
  if(K.cap&&!turned&&R0.gu+R0.gt>=2&&R0.gu<K.cap&&R0.gt<K.cap){turned=true;if(live()){kidFlash('🔄 VIROU! Troca de lado');await sleep(900)}}};
 const evt=async(t,m,o={})=>{if(live())await sessCall('event',{e:{t,m,us:true,mine:true,w:nm,...o},gu:R0.gu,gt:R0.gt})};
 let lastM=0;
 for(const e of ev){
  if(K.cap&&(R0.gu>=K.cap||R0.gt>=K.cap)){R0.cap=true;break}
  if(live())await sessCall('clock',{to:e.m});lastM=e.m;
  if(e.k==='lance'){let res=null;
   if(live()){kidFlash('⚡ A bola é sua…');await sleep(500);
    try{res=await lance3dPlay({kind:kidRole(e.sc)==='gk'?'keeper':kidRole(e.sc)==='def'?'tackle':'finish',scen:e.sc,env:K.env,min:e.m,comp:K.comp})}catch(x){res=null}}
   if(!res||res.skip||!res.role)res=kidAutoRes(e.sc,sk);
   R0.tot++;const role=res.role;
   if(role==='atk'){if(res.goal){R0.won++;if(res.heroGoal||!res.heroAssist)await goal(true,nm,e.m,{mine:true});else await goal(true,pick(KID_NAMES),e.m,{ast:true})}
    else await evt('c',e.m,{missed:true})}
   else{const good=!res.goal&&res.kind!=='falta';if(good){R0.won++;await evt(role==='gk'?'gks':'dsr',e.m,{w:pick(KID_NAMES)})}else await goal(false,pick(KID_NAMES),e.m)}}
  else if(e.k==='g')await goal(e.us,pick(KID_NAMES),e.m);
  else if(live())await sessCall('event',{e:{t:'c',us:e.us,w:pick(KID_NAMES),m:e.m},gu:R0.gu,gt:R0.gt})}
 if(K.cap&&(R0.gu>=K.cap||R0.gt>=K.cap))R0.cap=true;
 // final de futsal empatada vai pros pênaltis
 if(!K.cap&&R0.gu===R0.gt){let pu=0,pt=0;for(let i=0;i<5;i++){if(ch(.72))pu++;if(ch(.68))pt++}while(pu===pt){if(ch(.7))pu++;if(ch(.7))pt++}R0.pens=[pu,pt];
  if(live()){await sessCall('clock',{to:K.total});kidFlash(`PÊNALTIS: ${pu} × ${pt}`);await sleep(1300)}}
 const win=R0.pens?R0.pens[0]>R0.pens[1]:R0.gu>R0.gt?true:R0.gu<R0.gt?false:null;R0.win=win;
 R0.nota=clamp(6+R0.won*.5-(R0.tot-R0.won)*.25+R0.g*.3+R0.a*.2+(win===true?.4:win===false?-.2:0),3,10);
 if(on){const msg=K.cap?(win===true?`Ganhou o racha${R0.cap?' no 4':''}! A rua inteira viu.`:win===false?'Perdeu o racha. Amanhã tem revanche.':'Empate. A mãe gritou da janela: hora da janta!')
   :(win?`CAMPEÃO DO BAIRRO!${R0.pens?` Nos pênaltis, ${R0.pens[0]} × ${R0.pens[1]}.`:''}`:`Vice-campeão.${R0.pens?` Nos pênaltis, ${R0.pens[0]} × ${R0.pens[1]}.`:''} Dói, mas ensina.`);
  try{if(!SESS.skipAll&&!R0.cap)await sessCall('clock',{to:K.total});await sessCall('end',{f:{msg,win,gu:R0.gu,gt:R0.gt},me:{g:R0.g,a:R0.a},scorers:R0.sc})}catch(e){}
  kidOff()}
 return R0}
// o que cada fase ensina
function kidGains(K,r){const gk=S.pos==='GOL';const up={};const add=(a,v)=>{if(v>0)up[a]=(up[a]||0)+v};
 if(K.key==='rua'){add('DRI',RI(1,2)+(r.win?1:0));add('VEL',RI(1,2));if(r.nota>=7.5)add(gk?'REF':'FIN',1)}
 else{add('PAS',RI(1,2));add(gk?'REF':pick(['FIN','DRI']),RI(1,2));if(r.win)add('MEN',1)}
 const chips=[];for(const[a,v]of Object.entries(up)){S.attrs[a]=clamp((S.attrs[a]||50)+v,10,99);chips.push([`+${v} ${ATTR_NAME[a]}`,'up'])}
 if(r.nota>=7)S.ovr=clamp(S.ovr+1,40,Math.max(S.ovr,Math.min(80,S.pot)));
 if(r.nota>=8.5){S.pot=clamp(S.pot+1,40,99);chips.push(['↑ Potencial','gold'])}
 const pen=Math.round(clamp((r.nota-6.5)*1.6,-2,3))+(K.key==='fut'&&r.win?2:0);S.childhood.pen=(S.childhood.pen||0)+pen;
 S.childhood[K.key]={gu:r.gu,gt:r.gt,g:r.g,a:r.a,won:r.won,tot:r.tot,nota:+r.nota.toFixed(1),win:r.win,pens:r.pens,played:r.played};
 return chips}
// cartão de capítulo (mesmo visual da história)
function kidCard(o){return new Promise(res=>{$ov.hidden=false;
 if(o.log){const st=storyLog();st.log.push({n:st.log.length+1,title:o.title,txt:o.txt,ic:o.ic,age:S.age,year:S.year})}
 const chips=(o.chips||[]).length?`<div class="chipsrow" style="justify-content:center">${o.chips.map(([t,k])=>`<span class="chip ${k}">${esc(t)}</span>`).join('')}</div>`:'';
 $ov.innerHTML=`<div class="ovwrap story kidch"><div class="st-glow"></div><div class="eyebrow st-eb">${esc(o.eb||'Infância')}</div><div class="st-ic">${o.ic||'⚽'}</div><h2 class="st-t">${esc(o.title)}</h2>
 ${o.score||''}<p class="st-txt" style="min-height:0">${esc(o.txt)}</p>${chips}<div class="st-meta">${esc(S.name)} · ${S.age} anos</div>
 <div class="kid-btns"><button class="btn wide" id="kOk">${esc(o.ok||'Continuar')}</button>${o.alt?`<button class="lnk" id="kAlt">${esc(o.alt)}</button>`:''}</div></div>`;
 const done=v=>{$ov.hidden=true;$ov.innerHTML='';res(v)};
 document.getElementById('kOk').onclick=()=>{try{if(window.FDB_GESTURE)FDB_GESTURE()}catch(e){}done('ok')};const a=document.getElementById('kAlt');if(a)a.onclick=()=>done('alt')})}
function kidScore(K,r){const b=(c,t)=>`<span style="background:${c[0]};color:${l3dDist(c[0],'#ffffff')>200?'#fff':'#111'}">${esc(t)}</span>`;
 return`<div class="kid-score">${b(K.usC,K.ua)}<b>${r.gu} × ${r.gt}</b>${b(K.themC,K.ta)}</div>${r.pens?`<div class="kid-pens">pênaltis ${r.pens[0]} × ${r.pens[1]}</div>`:''}
 <div class="kid-line"><span><b>${r.g}</b> gols</span><span><b>${r.a}</b> assist.</span><span><b>${r.won}/${r.tot}</b> lances</span><span><b>${r.nota.toFixed(1)}</b> nota</span></div>`}
function kidResTxt(K,r){const n=first();
 if(K.key==='rua')return r.win===true?`${n} ganhou o racha${r.cap?' no 4':''}. ${r.g>=2?'Fez chover em cima dos maiores e o dono da bola ficou de cara.':'Na rua, quem ganha fica, e ele ficou até escurecer.'} A rua ensinou a driblar no aperto e a correr da calçada pro meio-fio.`
  :r.win===false?`${n} perdeu o racha${r.cap?' no 4':''}, mas ninguém esqueceu ${r.g?'o golaço que ele fez entre os chinelos':'a raça dele no meio dos maiores'}. A rua ensinou a driblar no aperto e a cair sem chorar.`
  :`Empatou. A mãe gritou da janela, o racha acabou na hora da janta. A rua ensinou a driblar no aperto.`;
 return r.win?`${n} é campeão do bairro${r.pens?' nos pênaltis':''}! A medalha de lata foi pendurada na parede da sala e o professor contou pra todo mundo que um olheiro estava na arquibancada.`
  :`Vice-campeão do bairro${r.pens?' nos pênaltis':''}. ${n} chorou no vestiário, mas o professor disse que um olheiro gostou dele. O futsal ensinou passe rápido e a pensar antes da bola chegar.`}
async function kidPrologue(){
 S.childhood={pen:0};const can3d=lanceMode()==='jogar'&&!L3D.failed;const n=first();const br=NATS[S.nat]&&NATS[S.nat].n==='Brasil';
 S.age=10;
 const c1=await kidCard({eb:'Prólogo · Infância',ic:'🩴',title:'10 anos · A rua',log:true,
  txt:`${br?'Rua de paralelepípedo, fim de tarde.':'Fim de tarde na rua de casa.'} ${n} tem 10 anos, joga descalço e o gol é um par de chinelos. É 2 contra 2: vira com 2, acaba com 4. Bola alta não vale, e quando alguém grita "CARRO!", todo mundo corre pra calçada.`,
  ok:can3d?'Jogar o racha ▶':'Ver o racha',alt:'Pular a infância'});
 if(c1==='alt'){const r1=await kidMatch(KID.rua,false),g1=kidGains(KID.rua,r1);S.age=12;const r2=await kidMatch(KID.fut,false),g2=kidGains(KID.fut,r2);S.age=14;S.childhood.done=1;S.childhood.skipped=1;
  await kidCard({eb:'Infância',ic:'📼',title:'Quatro anos depois',txt:`Rua das Flores ${r1.gu} × ${r1.gt} Beco do Sapo, no racha dos 10 anos. Aos 12, ${r2.win?'campeão':'vice'} do futsal do bairro pelo Vila Esperança. Agora ${n} tem 14 anos e a peneira chegou.`,chips:[...g1,...g2]});return}
 const r1=await kidMatch(KID.rua,can3d);const g1=kidGains(KID.rua,r1);
 await kidCard({eb:'Racha na rua',ic:r1.win===true?'🏆':r1.win===false?'🩹':'🍲',title:r1.win===true?'Ganhou o racha':r1.win===false?'Perdeu o racha':'Hora da janta',score:kidScore(KID.rua,r1),txt:kidResTxt(KID.rua,r1),chips:g1});
 S.age=12;
 const c2=await kidCard({eb:'Prólogo · Infância',ic:'🏟️',title:'12 anos · Futsal do bairro',log:true,
  txt:`O professor do E.C. Vila Esperança viu ${n} na rua e chamou pro futsal. Quadra de cimento pintada de azul, tênis furado e a final do campeonato contra o Jardim América. A arquibancada de concreto está lotada de vizinho.`,
  ok:can3d?'Jogar a final ▶':'Ver a final',alt:can3d?'Simular a final':null});
 const r2=await kidMatch(KID.fut,can3d&&c2!=='alt');const g2=kidGains(KID.fut,r2);
 await kidCard({eb:'Futsal do bairro',ic:r2.win?'🥇':'🥈',title:r2.win?'Campeão do bairro':'Vice do bairro',score:kidScore(KID.fut,r2),txt:kidResTxt(KID.fut,r2),chips:g2,log:false});
 S.age=14;S.childhood.done=1}
// a peneira agora é aos 14, depois da infância
{const _spK=startPeneira;startPeneira=async function(){
  try{if(!S.childhood&&!S.club&&!(S.history&&S.history.length)&&S.age<=16)await kidPrologue()}catch(e){console.warn('infância',e);S.childhood=S.childhood||{pen:0};kidOff()}
  if(S.childhood&&!S.club&&S.age>14)S.age=14;PEN.kidApplied=false;return _spK()}}
// a fama da rua e do futsal chega antes do jogador na peneira
{const _rpK=renderPeneira;renderPeneira=function(...a){try{if(PEN.step===0&&!PEN.kidApplied&&S.childhood&&S.childhood.pen){PEN.kidApplied=true;penLog(S.childhood.fut&&S.childhood.fut.win?'Campeão do futsal do bairro, o olheiro já sabia o seu nome':'A fama da rua e do futsal chegou antes de você',S.childhood.pen)}}catch(e){}return _rpK.apply(this,a)}}
// a história de abertura passa a falar dos 14 anos
{const _siK=storyIntro;storyIntro=function(){const o=_siK();if(S.childhood){const fut=S.childhood.fut;o.title='A peneira';o.ic='🎯';
  o.txt=`Quatro anos depois do primeiro racha na rua, ${first()} tem 14 anos${fut&&fut.win?' e uma medalha de campeão do bairro na parede':''}. Jogava de ${POS[S.pos].n.toLowerCase()}${S.heart&&CLUB[S.heart]?`, sonhava com a camisa do ${CLUB[S.heart].n}`:''} e tinha uma chuteira emprestada do primo. ${pickT(['A mãe dizia pra estudar. O pai dizia pra não desistir.','O professor do futsal disse que agora era com ele.','O sonho era simples: viver de futebol.'])} Agora, a primeira porta: a peneira.`}return o}}
// assinou na base aos 14: dois anos passam e a primeira temporada é aos 16
{const _bsK=buildSeason;buildSeason=function(...a){try{if(S.childhood&&S.age<16&&S.club){const from=S.age;const g=Math.max(0,Math.min(RI(2,4),S.pot-S.ovr));S.age=16;S.ovr=clamp(S.ovr+g,30,99);if(S.ovr>(S.peak||0)){S.peak=S.ovr;S.peakAge=16}S.childhood.jump={from,g};S.flags.kidJump=1}}catch(e){}return _bsK.apply(this,a)}}
{const _rhK=renderHub;renderHub=function(...a){const r=_rhK.apply(this,a);try{if(S&&S.flags&&S.flags.kidJump===1&&S.club){const show=()=>{if(S.flags.kidJump!==1)return;if(!$ov.hidden){setTimeout(show,700);return}S.flags.kidJump=2;const j=S.childhood&&S.childhood.jump||{g:0};const c=CLUB[S.club];
  storyChapter({key:'base2',ic:'⏩',title:'Dois anos de base',txt:`Dos 14 aos 16, ${first()} viveu a base do ${c?c.n:'clube'}: alojamento, escola de manhã, treino à tarde e campeonato de base no fim de semana.${j.g?` Cresceu ${j.g} de OVR nesse tempo.`:''} Agora, com 16 anos, começa a temporada de verdade.`})};setTimeout(show,600)}}catch(e){}return r}}
{const st=document.createElement('style');st.textContent=`.kid-btns{display:grid;gap:8px;margin-top:4px}.kid-btns .lnk{background:none;border:0;color:var(--muted);font:600 13px var(--f-body,inherit);text-decoration:underline;cursor:pointer;padding:6px}
.kid-score{display:flex;align-items:center;justify-content:center;gap:10px;font-family:var(--f-display);font-weight:900;font-size:34px;color:#fff;animation:pop .5s .25s both}.kid-score span{font-size:15px;padding:4px 9px;border-radius:7px;letter-spacing:.04em}
.kid-pens{font-size:12px;color:var(--gold);letter-spacing:.08em;text-transform:uppercase;margin-top:-6px}.kid-line{display:flex;justify-content:center;gap:14px;flex-wrap:wrap;font-size:12px;color:var(--muted)}.kid-line b{color:var(--chalk,#fff);font-size:15px;margin-right:3px}`;document.head.appendChild(st)}
