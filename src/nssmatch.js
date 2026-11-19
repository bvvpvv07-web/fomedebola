// ================== PARTIDA NSS ==================
// Você só controla o seu jogador: o resto do time é da IA. O jogo corre em linhas coloridas com a cor de quem tem a bola.
// Embaixo: Esforço (mais esforço = mais bola pra você e mais cansaço), energético e Foco (defender, equilibrado, atacar).
// No intervalo dá pra tomar energético. Os seus lances continuam no 3D. Depois do jogo: estatísticas, relações,
// nível de estrela, jornal, atualização semanal (dinheiro e energia) e a rodada com a tabela.
const NSSM={items:[],cur:null,post:[]};
const NS_ATKB={ATA:.9,SA:.85,PE:.8,PD:.8,MEI:.75,ME:.6,MD:.6,MC:.55,LE:.35,LD:.35,VOL:.3,ZAG:.2,GOL:0};
const NS_DEFB={ZAG:1.4,VOL:1.2,LD:1.1,LE:1.1,MC:1,ME:.8,MD:.8,MEI:.6,PE:.5,PD:.5,SA:.5,ATA:.4,GOL:0};
const NS_PASSB={MC:1.6,MEI:1.5,VOL:1.4,ZAG:1,LE:1.2,LD:1.2,ME:1.2,MD:1.2,PE:.9,PD:.9,SA:1,ATA:.6,GOL:.5};
function nsSur(){const p=(S.name||'').trim().split(/\s+/);return p.length>1?p[p.length-1]:p[0]}
const nsShort=nm=>{const m=String(nm||'').trim().match(/^(.*?)(\s*\(.*\))?$/);const p=(m[1]||'').split(/\s+/);return(p.length>1&&p[p.length-1].length>2?p[p.length-1]:p.join(' '))+(m[2]||'')};
function nsDrain(min,eff){return min/90*(16+eff*6.5)*(S.age>30?1+(S.age-30)*.03:1)}
function nsAutoChance(c){const sk=clamp((S.ovr-45)/50,.05,.95);const t=c&&c.type;
 const p=t==='tackle'?.35+.4*sk:t==='reflex'?.3+.4*sk:['pass','long','cross','build'].includes(t)?.45+.4*sk:.18+.45*sk;return ch(clamp(p*(S.n.en<30?.8:1),.08,.9))}

// ---------- tela do jogo ----------
async function nsLiveStart(m){
 const part=m.part;if(part&&!part.play&&part.why!=='banco')return null;const bench=!!(part&&!part.play);
 const n=S.n;const x=NSSM.cur||{x:{gu:0,gt:0,g:0,a:0,ch:0,ps:0,tk:0,blk:0,sc:[],rm:[]}};const us=m.us,th=m.them;const home=m.neutral?true:m.home;
 let cU=teamColors(us),cT=teamColors(th);try{if(l3dDist(cU[0],cT[0])<100){cT=l3dDist(cU[0],cT[1]||'#fff')>=100?[cT[1],cT[0]]:[l3dDist(cU[0],'#ffffff')>140?'#ffffff':'#151515','#888']}}catch(e){}
 const ros=s=>{try{return(sideRoster(s,!!s.nat)||[]).filter(p=>p&&p.n)}catch(e){return[]}};
 const RU=ros(us).filter(p=>p.n!==S.name),RT=ros(th);
 const gkOf=R=>{const g=R.find(p=>p.pos==='GOL');return g?nsShort(g.n):null};const gkDef=R=>{const g=gkOf(R);return g?`defesa de ${g}`:'defesa do goleiro'};const gkHold=R=>{const g=gkOf(R);return g?`${g} segura firme`:'O goleiro segura firme'};
 const two=R=>{const L=R.filter(p=>p.pos!=='GOL');const a=L.length?pick(L):null;const b=L.filter(x=>x!==a);const c=b.length?pick(b):null;return[a?nsShort(a.n):'o camisa '+RI(5,11),c?nsShort(c.n):'um companheiro']};
 const nm=(R,ex)=>{const L=R.filter(p=>p.pos!=='GOL'&&p.n!==ex);return L.length?nsShort(pick(L).n):'o camisa '+RI(5,11)};
 const ME=nsSur();
 const onFrom=part&&part.play?(part.start?0:90-part.min):0,onTo=part&&part.play?(part.start?part.min:90):90;
 const L={wasOn:null,entered:false,min:0,gu:0,gt:0,rows:[],msg:'',ended:false,skip:false,out:false,lastAmb:0,poss:true,lastX:-99,ht:false,lowWarn:false,drained:0};
 x.live=L;
 const spd=()=>L.skip?0:(S.liveSpeed===3?3:1);const minMs=()=>({1:430,3:110,0:0})[spd()];
 const dU=(us.s||70)-(th.s||70)+(home&&!m.neutral?2:0);
 const onPitch=()=>!bench&&!L.out&&L.min>=onFrom&&L.min<=onTo;
 const sc=()=>{const gu=L.gu+(x.x.gu||0),gt=L.gt+(x.x.gt||0);return home?[gu,gt]:[gt,gu]};
 const H=home?us:th,A=home?th:us,cH=home?cU:cT,cA=home?cT:cU;
 const ab=s=>esc((s.a||mkAbbr(s.n||'')).slice(0,3).toUpperCase());
 const rowHTML=r=>{const c=r.side==='u'?cU:r.side==='t'?cT:['#26352c','#eef2e4'];return`<div class="nfr ${r.k||''}${r.dim?' ndim':''}" style="--c:${c[0]};--k:${pickInk(c[0])}"><b>${r.m!=null?r.m+"'":''}</b><span>${r.t}</span></div>`};
 const effPips=()=>[1,2,3,4,5].map(i=>`<i class="${i<=n.eff?'on':''}"></i>`).join('');
 const drinks=()=>Object.values(n.dr).reduce((s,v)=>s+v,0);
 const draw=()=>{$ov.hidden=false;const[hg,ag]=sc();
  $ov.innerHTML=`<div class="nslive">
  <div class="nsl-top"><span class="nspc">${esc(m.o.comp)}${m.o.label?' · '+esc(m.o.label):''}</span><b class="clk" id="nlClk">${L.ended?'Fim':L.min+"'"}</b><div class="spd">${[[1,'▶'],[3,'▶▶'],[0,'⏭']].map(([k,t])=>`<button data-sp="${k}" class="${spd()===k?'on':''}" aria-label="${k===0?'Pular pro fim':k===3?'Rápido':'Normal'}">${t}</button>`).join('')}</div></div>
  <div class="nsl-score"><div class="tm" style="background:${cH[0]};color:${pickInk(cH[0])}">${esc(H.n)}</div><b id="nlH">${hg}</b><b id="nlA">${ag}</b><div class="tm" style="background:${cA[0]};color:${pickInk(cA[0])}">${esc(A.n)}</div></div>
  ${m.agg?`<div class="nsl-agg">Ida ${m.agg[0]}–${m.agg[1]} · agregado <span id="nlAgg">${m.agg[0]+L.gu+(x.x.gu||0)}–${m.agg[1]+L.gt+(x.x.gt||0)}</span></div>`:''}
  <div class="nsl-time"><i id="nlBar" style="width:${L.min/90*100}%"></i></div>
  <div class="nsl-off" id="nlOff" ${onPitch()||L.ended?'hidden':''}>${offTxt()}</div><div class="nsl-feed ${onPitch()||L.ended?'':'off'}" id="nlFeed">${L.rows.slice(-14).map(rowHTML).join('')}</div>
  <div class="nsl-msg" id="nlMsg">${esc(L.msg)}</div>
  <div id="nlEnd"></div>
  <div class="nsl-ctl ${onPitch()?'':'off'}" ${L.ended||bench?'hidden':''}>
   <div class="nsl-eff"><small>Esforço</small><div><button id="nlEm" aria-label="Menos esforço">−</button><span id="nlEv">${effPips()}</span><button id="nlEp" aria-label="Mais esforço">+</button></div></div>
   <button class="nsl-dr" id="nlDr" ${drinks()&&!L.out?'':'disabled'}>❤️<small id="nlDrN">${drinks()}</small></button>
   <div class="nsl-foc"><small>Foco</small><div>${[[-1,'🛡️','Defender'],[0,'⚖️','Equilibrado'],[1,'⚔️','Atacar']].map(([k,ic,t])=>`<button data-fc="${k}" class="${n.foc===k?'on':''}" aria-label="${t}">${ic}</button>`).join('')}</div></div>
  </div>
  <div class="nsl-en"><span>Energia</span><span class="nsmb ${n.en<30?'low':''}"><i id="nlEn" style="width:${Math.round(n.en)}%"></i></span><b id="nlEnV">${Math.round(n.en)}%</b></div></div>`;
  $ov.querySelectorAll('[data-sp]').forEach(b=>b.onclick=()=>{const v=+b.dataset.sp;if(v===0){L.skip=true;x.skip=true}else{L.skip=false;x.skip=false;S.liveSpeed=v}$ov.querySelectorAll('[data-sp]').forEach(y=>y.classList.toggle('on',y===b))});
  const em=document.getElementById('nlEm'),ep=document.getElementById('nlEp');if(em)em.onclick=()=>{n.eff=clamp(n.eff-1,1,5);document.getElementById('nlEv').innerHTML=effPips()};if(ep)ep.onclick=()=>{n.eff=clamp(n.eff+1,1,5);document.getElementById('nlEv').innerHTML=effPips()};
  $ov.querySelectorAll('[data-fc]').forEach(b=>b.onclick=()=>{n.foc=+b.dataset.fc;$ov.querySelectorAll('[data-fc]').forEach(y=>y.classList.toggle('on',y===b));api.flash(n.foc>0?'⚔️ Você sobe pro ataque':n.foc<0?'🛡️ Você recua pra ajudar a defesa':'⚖️ Posicionamento equilibrado')});
  const dr=document.getElementById('nlDr');if(dr)dr.onclick=()=>nlDrink();
  const f=document.getElementById('nlFeed');if(f)f.scrollTop=f.scrollHeight};
 const setEn=()=>{const e=document.getElementById('nlEn'),v=document.getElementById('nlEnV');if(e){e.style.width=Math.round(n.en)+'%';e.parentElement.classList.toggle('low',n.en<30)}if(v)v.textContent=Math.round(n.en)+'%'};
 const setScore=()=>{const[hg,ag]=sc();const h=document.getElementById('nlH'),a=document.getElementById('nlA');if(h){h.textContent=hg;a.textContent=ag}const g=document.getElementById('nlAgg');if(g&&m.agg)g.textContent=`${m.agg[0]+L.gu+(x.x.gu||0)}–${m.agg[1]+L.gt+(x.x.gt||0)}`};
 const offTxt=()=>L.out||L.entered?'🚪 Você saiu do jogo · só acompanhando':(bench?'🪑 Você está no banco · só acompanhando':'🪑 No banco · espere a sua vez');
 const push=r=>{if(r.dim==null)r.dim=!onPitch()&&!L.ended&&!/\b(nme|nin|nbn)\b/.test(r.k||'');L.rows.push(r);if(L.rows.length>40)L.rows.splice(0,L.rows.length-40);const f=document.getElementById('nlFeed');if(f){f.insertAdjacentHTML('beforeend',rowHTML(r));while(f.children.length>14)f.firstElementChild.remove();f.scrollTop=f.scrollHeight}};
 const chkOn=()=>{const on=onPitch();if(on===L.wasOn)return;L.wasOn=on;const f=document.getElementById('nlFeed'),b=document.getElementById('nlOff');if(f)f.classList.toggle('off',!on);const cl=$ov.querySelector('.nsl-ctl');if(cl)cl.classList.toggle('off',!on);if(b){b.hidden=on;b.textContent=offTxt()}
  if(on&&!L.entered){L.entered=true;push({m:L.min,side:'u',t:`🔥 VOCÊ ENTROU EM CAMPO!<small>Agora é com você, ${ME}</small>`,k:'nme nin'});api.flash('🔥 Você entrou! Agora é com você');const lv=$ov.querySelector('.nslive');if(lv&&!reduced){lv.classList.remove('enter');void lv.offsetWidth;lv.classList.add('enter')}try{SFX.whistle()}catch(e){}}};
 async function nlDrink(){const have=NS_DRINKS.filter(d=>n.dr[d.id]>0);if(!have.length)return;let d=have[0];if(have.length>1){const kk=await nsPop({ic:'🥤',title:'Qual energético?',opts:have.map(d=>[d.id,`${d.ic} ${d.n} (${n.dr[d.id]})`]),ok:'Cancelar'});d=NS_DRINKS.find(z=>z.id===kk)}if(!d)return;nsDrink(d);setEn();const c=document.getElementById('nlDrN');if(c)c.textContent=drinks();if(!drinks()){const b=document.getElementById('nlDr');if(b)b.disabled=true}api.flash(`🥤 ${d.n}: energia em ${Math.round(n.en)}%`)}
 // narração: quem tem a bola manda na cor da linha
 const amb=()=>{const mine=onPitch()&&L.poss;let pU=clamp(.5+dU/45+(n.foc>0?.04:n.foc<0?-.03:0),.25,.75);
  if(ch(.38))L.poss=ch(pU);const u=L.poss;const R=u?RU:RT,t=u?us:th,o=u?th:us,side=u?'u':'t';const[p,q]=two(R),d=RI(12,38);
  const meIn=u&&onPitch()&&ch(clamp(.12+n.eff*.05+(n.foc>0?.06:0)+(n.rel.team-50)/400,.08,.45));
  let t0;
  if(meIn){t0=pick([`A bola chega em <b>${ME}</b>`,`<b>${ME}</b> pede e recebe`,`<b>${ME}</b> toca para ${q}`,`Passe de ${d} m de <b>${ME}</b> para ${q}`,`<b>${ME}</b> arranca com a bola`,`<b>${ME}</b> gira em cima do marcador`,n.foc<0?`<b>${ME}</b> volta pra marcar e rouba a bola`:`<b>${ME}</b> aparece livre`]);return push({m:L.min,side,t:t0,k:'nme'})}
  const r=rnd();
  if(r<.36)t0=pick([`${p} toca para ${q}`,`Bola de ${p} para ${q}`,`${q} recebe de ${p}`,`${p} acha ${q} com um passe de ${d} m`,`${p} inverte o jogo para ${q}`]);
  else if(r<.55)t0=pick([`${esc(t.n)} roda a bola com calma`,`${p} protege a bola`,`${p} procura espaço`,`${esc(t.n)} troca passes no meio`]);
  else if(r<.68)t0=pick([`A defesa do ${esc(o.n)} está aberta`,`${p} invade a área!`,`Contra-ataque do ${esc(t.n)}!`,`${p} parte em velocidade`]);
  else if(r<.78)t0=pick([`${p} arrisca de longe… pra fora`,`Chute de ${p}, por cima`,`${p} cabeceia raspando a trave`,`${gkDef(u?RT:RU).replace(/^d/,'D')}!`,gkHold(u?RT:RU)]);
  else if(r<.9)t0=pick([`Falta em ${p}`,`Escanteio para o ${esc(t.n)}`,`Lateral para o ${esc(t.n)}`,`O juiz deixa o jogo seguir`]);
  else{t0=pick([`${p} perde a bola`,`Desarme! A bola muda de lado`,`Passe errado de ${p}`]);L.poss=!L.poss}
  push({m:L.min,side,t:t0})};
 // lance extra do seu jogador (esforço e foco no ataque criam mais)
 async function extraChance(){const P=S.pos;const atk=n.foc>=0;let type;
  if(P==='GOL')return;
  const r=rnd();if(['ATA','SA','PE','PD'].includes(P))type=r<.62?chanceType({}):assistType();else if(['MEI','MC','ME','MD'].includes(P))type=r<.45?chanceType({}):assistType();else type=r<(atk?.35:.2)?chanceType({}):assistType();
  if(!x.x.drK&&P!=='ZAG'&&ch(['ATA','SA','PE','PD','MEI','ME','MD'].includes(P)?.55:.3))type='dribble';else if(type==='dribble'&&x.x.drK)type=chanceType({})==='dribble'?'finish':type;if(type==='dribble')x.x.drK=1;
  const isPass=['pass','long','cross'].includes(type);x.x.ch=(x.x.ch||0)+1;L.lastX=L.min;
  push({m:L.min,side:'u',t:isPass?`<b>${ME}</b> levanta a cabeça…`:type==='dribble'?`<b>${ME}</b> parte pra cima do marcador…`:`<b>${ME}</b> tem espaço pra finalizar…`,k:'nme'});
  let ok,auto=false;if(L.skip||S.lances==='off'||!lancesWanted(true)){ok=nsAutoChance({type});auto=true}
  else{api.flash(type==='dribble'?'🌀 Um contra um: arraste pro lado e passe por ele':'⚡ A bola é sua…');await sleep(L.skip?0:900);x.inX=true;try{ok=await IO_UI.chance({type,planned:false,comp:m.o.comp,min:L.min})}catch(e){ok=false}x.inX=false;draw()}
  const self=!!NM.selfGoal,dma=!!NM.dmAssist;NM.selfGoal=false;NM.dmAssist=false;
  {const hp=NM.heroPasses||0,dr=NM.drib||0;NM.heroPasses=0;NM.drib=0;x.x.ps=(x.x.ps||0)+hp;x.x.dr=(x.x.dr||0)+dr;if(!ok&&(hp||dr))push({m:L.min,side:'u',t:`✓ ${[hp?`${hp} passe${hp>1?'s':''} certo${hp>1?'s':''}`:'',dr?`${dr} drible${dr>1?'s':''}`:''].filter(Boolean).join(' e ')} de <b>${ME}</b>`,k:'nme'})}
  if(ok&&(isPass?self:!dma)){x.x.gu=(x.x.gu||0)+1;x.x.g=(x.x.g||0)+1;x.x.sc.push({m:L.min,w:S.name,us:true});push({m:L.min,side:'u',t:`⚽ GOL! <b>${ME}</b> marca!`,k:'ngl nme'});api.flash('GOOOOL! É SEU!');goalFx(true)}
  else if(ok&&(dma||(isPass&&(ch(.42)||(!auto&&nsIs3D()))))){const w=nm(RU);const full=(RU.find(p=>nsShort(p.n)===w)||{n:w}).n;x.x.gu=(x.x.gu||0)+1;x.x.a=(x.x.a||0)+1;x.x.sc.push({m:L.min,w:full,us:true});push({m:L.min,side:'u',t:`⚽ GOL de ${w}! Assistência de <b>${ME}</b>`,k:'ngl nme'});api.flash(`GOL do ${us.n}! Sua assistência`);goalFx(true)}
  else if(ok&&isPass){x.x.ps=(x.x.ps||0)+1;push({m:L.min,side:'u',t:`Passe na medida de <b>${ME}</b>, mas ${nm(RU)} não converte`,k:'nme'})}
  else push({m:L.min,side:'u',t:isPass?`O passe de <b>${ME}</b> é cortado`:pick([`<b>${ME}</b> finaliza… ${gkDef(RT)}`,`<b>${ME}</b> chuta pra fora`,`<b>${ME}</b> é travado na hora do chute`]),k:'nme nbad'});
  setScore()}
 async function setPiece(){const P=S.pos;if(P==='GOL')return;const bp=n.sk.bp.l;x.x.sp=(x.x.sp||0)+1;L.lastX=L.min;
  const wide=['PE','PD','ME','MD','MEI','LE','LD','MC','VOL','SA'].includes(P);const r=rnd();
  const usedK=x.x.spK||(x.x.spK=[]);const aerial=['ATA','SA','ZAG','VOL','MC'].includes(P);
  const W=[['corner',wide||bp>=50?.42:.22],['head',aerial?.34:.14],['fk',S.taker.fk||bp>=52?.32:.2],['pen',S.taker.pen||bp>=58||ch(.3)?.13:0]].filter(([k,w])=>w>0&&!usedK.includes(k));
  // o primeiro lance parado do jogo é sempre um escanteio (cobrar ou subir pra cabecear)
  let kind;if(!usedK.includes('corner')&&!usedK.includes('head'))kind=(wide||bp>=50)&&!(aerial&&ch(.5))?'corner':'head';else{const tot=W.reduce((a,[,w])=>a+w,0);let q=rnd()*tot;kind=(W.find(([,w])=>(q-=w)<=0)||W[0]||['fk'])[0]}usedK.push(kind);void r;
  const T={pen:['🎯 PÊNALTI! A bola é sua','Pênalti! <b>'+ME+'</b> vai pra bola'],fk:['🧱 Falta perigosa: você bate','Falta na entrada da área. <b>'+ME+'</b> ajeita a bola'],corner:['🚩 Escanteio: você cobra','Escanteio. <b>'+ME+'</b> vai pra bandeirinha'],head:['🚩 Escanteio: suba pra cabecear','Escanteio pro '+esc(us.n)+'. <b>'+ME+'</b> entra na área']}[kind];
  push({m:L.min,side:'u',t:T[1],k:'nme'});x.x.ch=(x.x.ch||0)+1;
  let ok,auto=false;const sk=k=>typeof skillOf==='function'?skillOf(k):.6;
  if(L.skip||S.lances==='off'||!lancesWanted(true)){auto=true;ok=ch(kind==='pen'?.72+bp/500:kind==='fk'?.12+bp/300:kind==='corner'?.14+bp/600:.22)}
  else{api.flash(T[0]);await sleep(L.skip?0:1000);x.inX=true;
   const o=kind==='pen'?{kind:'pen',scen:'penalti',title:'Pênalti!',skill:sk('FIN')*.5+(bp-40)/110,keeper:.5,okTxt:'GOL!'}:kind==='fk'?{kind:'fk',scen:ch(.6)?'falta':'faltaLonge',title:'Falta perigosa',skill:(sk('FIN')+sk('PAS'))/2*.6+(bp-40)/140,keeper:.5,okTxt:'GOLAÇO DE FALTA!'}:kind==='corner'?{kind:'cross',scen:ch(.75)?'escanteio':'escCurto',title:'Escanteio',skill:sk('PAS'),keeper:.45,okTxt:'GOL!'}:{kind:'header',scen:ch(.7)?'escCab':'cabeca',title:'Escanteio na área',skill:sk('FIS'),keeper:.5,okTxt:'GOL DE CABEÇA!'};
   try{ok=!!(await nssMoment({...o,comp:m.o.comp,min:L.min})).ok}catch(e){ok=false}x.inX=false;draw()}
  const self=!!NM.selfGoal,dma2=!!NM.dmAssist;NM.selfGoal=false;NM.dmAssist=false;
  if(ok&&(kind==='corner'?self:!dma2)){x.x.gu=(x.x.gu||0)+1;x.x.g=(x.x.g||0)+1;x.x.sc.push({m:L.min,w:S.name+(kind==='pen'?' (pên.)':kind==='fk'?' (falta)':''),us:true});push({m:L.min,side:'u',t:`⚽ GOL! <b>${ME}</b> ${kind==='pen'?'converte o pênalti':kind==='fk'?'acerta a falta':'marca de cabeça'}!`,k:'ngl nme'});api.flash('GOOOOL! É SEU!');goalFx(true)}
  else if(ok&&(dma2||(kind==='corner'&&(!auto||ch(.6))))){const w=nm(RU);const full=(RU.find(p=>nsShort(p.n)===w)||{n:w}).n;x.x.gu=(x.x.gu||0)+1;x.x.a=(x.x.a||0)+1;x.x.sc.push({m:L.min,w:full,us:true});push({m:L.min,side:'u',t:`⚽ GOL de ${w} no escanteio de <b>${ME}</b>!`,k:'ngl nme'});api.flash(`GOL! Sua assistência`);goalFx(true)}
  else push({m:L.min,side:'u',t:kind==='pen'?`${gkDef(RT).replace(/^d/,'D')}! Pênalti perdido`:kind==='fk'?`A falta de <b>${ME}</b> ${pick(['passa raspando','explode na barreira','vai nas mãos do goleiro'])}`:kind==='corner'?'A zaga afasta o escanteio':`A cabeçada de <b>${ME}</b> sai pela linha de fundo`,k:'nme nbad'});
  setScore()}
 const goalFx=good=>{const b=$ov.querySelector('.nslive');if(b&&!reduced){b.classList.remove('gfx','bad');void b.offsetWidth;b.classList.add('gfx');if(!good)b.classList.add('bad')}try{SFX.goal&&good&&SFX.goal()}catch(e){}};
 async function halftime(){const[hg,ag]=sc();push({m:null,side:'n',t:`Intervalo · ${esc(H.n)} ${hg}–${ag} ${esc(A.n)}`,k:'nht'});if(L.skip)return;
  const host=document.getElementById('nlEnd');if(!host)return;const has=drinks()>0;
  host.innerHTML=`<div class="nsl-ht"><b>Intervalo</b><span>Energia ${Math.round(n.en)}%${n.en<45?' · você está cansado':''}</span><div class="row">${has?'<button class="btn" id="htDr">🥤 Tomar energético</button>':''}<button class="btn ${has?'ghost':''}" id="htGo">Voltar pro jogo ▶</button></div></div>`;
  await new Promise(res=>{const go=document.getElementById('htGo');if(go)go.onclick=()=>{host.innerHTML='';res()};const d=document.getElementById('htDr');if(d)d.onclick=async()=>{await nlDrink();const s=host.querySelector('span');if(s)s.textContent=`Energia ${Math.round(n.en)}%`;if(!drinks())d.remove()};
   setTimeout(()=>{if(L.skip){host.innerHTML='';res()}},50)})}
 const api={
  async until(t){
   if(L.min===0&&t>0&&!L.kick){L.kick=true;push({m:0,side:'n',t:`Bola rolando: ${esc(us.n)} × ${esc(th.n)}`,k:'nht'});if(bench)push({m:0,side:'n',t:`🪑 Você está no banco hoje. Treine e ganhe o técnico pra jogar.`,k:'nht nbn'});else if(part&&!part.start)push({m:0,side:'n',t:`🪑 Você começa no banco. Fique pronto pra entrar.`,k:'nht nbn'});try{SFX.whistle()}catch(e){}if(!L.skip)await sleep(600)}
   while(L.min<t){L.min++;chkOn();const c=document.getElementById('nlClk'),b=document.getElementById('nlBar');if(c)c.textContent=L.min+"'";if(b)b.style.width=(L.min/90*100)+'%';
    if(onPitch()){const d=(16+n.eff*6.5)/90*(S.age>30?1+(S.age-30)*.03:1);n.en=clamp(n.en-d,0,100);L.drained+=d;setEn();if(n.en<15&&!L.lowWarn){L.lowWarn=true;api.flash('🥵 Você está exausto. Tome um energético ou baixe o esforço.')}}
    if(L.min===45&&!L.ht){L.ht=true;await halftime()}
    if(!L.skip&&L.min-L.lastAmb>=(spd()===3?2:1)&&ch(.62)&&L.min!==45){L.lastAmb=L.min;amb()}
    // seu jogador cria mais com esforço e foco no ataque
    if(onPitch()&&S.pos!=='GOL'&&L.min-L.lastX>=8&&(x.x.ch||0)<4&&L.min<89){const b0=NS_ATKB[S.pos]||.4;const bt=nsBootStats();const faro=bt&&(bt.ab||[]).includes('faro')?1.25:1;
     const p=b0*(.45+.15*n.eff)*(n.foc>0?1.5:n.foc<0?.55:1)*faro*(.8+n.rel.team/250)*(n.en<25?.5:1)/90;if(ch(p))await extraChance()}
    if(onPitch()&&S.pos!=='GOL'&&L.min-L.lastX>=6&&(x.x.sp||0)<3&&L.min>3&&L.min<88&&ch((1.6+(n.foc>0?.35:0))/90))await setPiece();
    // atacar demais abre espaço atrás
    if(n.foc>0&&onPitch()&&ch(.0035*n.eff/3)){x.x.gt=(x.x.gt||0)+1;const w=nm(RT);x.x.sc.push({m:L.min,w:(RT.find(p=>nsShort(p.n)===w)||{n:w}).n,us:false});push({m:L.min,side:'t',t:`⚽ Contra-ataque e gol de ${w}. O time ficou exposto.`,k:'ngl'});api.flash(`Gol do ${th.n}…`);goalFx(false);setScore()}
    const ms=minMs();if(ms)await sleep(L.min>=80?ms*1.3:ms)}},
  flash(t){L.msg=t;const e=document.getElementById('nlMsg');if(e){e.textContent=t;e.classList.remove('pop');void e.offsetWidth;e.classList.add('pop')}},
  redraw(){L.msg='';draw()},
  out(k){if(L.out)return;L.out=true;if(k==='out'){push({m:L.min,side:'u',t:`🔁 <b>${ME}</b> é substituído e sai de campo`,k:'nme'});api.flash('Você foi substituído')}chkOn()},
  note(t){push({m:L.min,side:'u',t,k:'nme'})},
  async event(e,gu,gt){const k=L.skip?0:spd()===3?.4:1;const mine=e.mine;
   // foco na defesa: às vezes você salva um gol certo
   if(e.t==='g'&&!e.us&&onPitch()&&S.pos!=='GOL'){const p=(n.foc<0?.24:.05)*(n.eff/3)*(NS_DEFB[S.pos]||.6)*(n.en<25?.6:1);if(ch(p)){x.x.gt=(x.x.gt||0)-1;x.x.rm.push({m:e.m,w:e.w});x.x.blk=(x.x.blk||0)+1;L.gu=gu;L.gt=gt;push({m:e.m,side:'u',t:`🛡️ <b>${ME}</b> salva em cima da linha! Era gol de ${esc(nsShort(e.w))}`,k:'nme'});api.flash('Que salvada!');setScore();if(k)await sleep(1400*k);return}}
   if(e.t==='g'){L.gu=gu;L.gt=gt;setScore();const w=esc(nsShort(e.w));push({m:e.m,side:e.us?'u':'t',t:e.us?(mine?`⚽ GOL! <b>${ME}</b> marca!`:`⚽ GOL de ${w}!${e.ast?` Assistência de <b>${ME}</b>`:''}`):`⚽ Gol de ${w}`,k:'ngl'+(mine||e.ast?' nme':'')});api.flash(e.us?(mine?'GOOOOL! É SEU!':`GOL do ${us.n}!`):`Gol do ${th.n}…`);goalFx(!!e.us);if(k)await sleep(2000*k);return}
   let r=null;const w=esc(nsShort(e.w||''));
   if(e.t==='c'&&e.missed)r={side:'u',t:`<b>${ME}</b> perde a chance!`,k:'nme nbad'};
   else if(e.t==='c')r={side:e.us?'u':'t',t:esc(pick(e.us?LIVE_TXT.c_us:LIVE_TXT.c_th).replace('{w}',nsShort(e.w||''))),k:mine?'nme':''};
   else if(e.t==='y')r={side:'u',t:`🟨 Amarelo para <b>${ME}</b>`,k:'nme'};
   else if(e.t==='r'){r={side:'u',t:`🟥 <b>${ME}</b> expulso!`,k:'nme nbad'};L.out=true}
   else if(e.t==='inj'){r={side:'u',t:`🚑 <b>${ME}</b> sente e sai de campo`,k:'nme nbad'};L.out=true}
   else if(e.t==='in'){chkOn();if(!L.entered){L.entered=true;r={side:'u',t:`🔥 VOCÊ ENTROU EM CAMPO!<small>Agora é com você, ${ME}</small>`,k:'nme nin'}}}
   else if(e.t==='pmiss')r={side:e.us?'u':'t',t:`❌ Pênalti perdido por ${w}`,k:e.mine?'nme nbad':''};
   else if(e.t==='dsr')r={side:'u',t:`🛡️ Desarme de <b>${ME}</b> em ${w}`,k:'nme'};
   else if(e.t==='ppok')r={side:'u',t:`🎯 Passe na medida de <b>${ME}</b>`,k:'nme'};
   else if(e.t==='ppx')r={side:'u',t:`O passe de <b>${ME}</b> é cortado`,k:'nme nbad'};
   else if(e.t==='gks')r={side:'u',t:`🧤 Defesaça de <b>${ME}</b> em chute de ${w}!`,k:'nme'};
   else if(e.t==='psave')r={side:'u',t:`🧤 Pênalti defendido!`,k:e.mine?'nme':''};
   if(r){r.m=e.m;push(r);chkOn();if(k)await sleep(900*k)}},
  finish(f){return new Promise(res=>{L.ended=true;x.ended=true;const[hg,ag]=sc();draw();const end=document.getElementById('nlEnd');const cls=f.win===true?'good':f.win===false?'bad':'';
   if(end)end.innerHTML=`<div class="nsl-fin"><b class="${cls}">${esc(f.msg||'Fim de jogo')}</b><span>${esc(H.n)} ${hg} – ${ag} ${esc(A.n)}</span>${f.agg?`<small>Agregado ${f.agg[0]}–${f.agg[1]}</small>`:''}<button class="btn wide" id="lok">Continuar</button></div>`;
   const b=document.getElementById('lok');if(!b){res();return}b.focus({preventScroll:true});b.onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res()}})}};
 x.api=api;L.wasOn=onPitch();L.entered=L.wasOn;draw();return api}
{const _s0=IO_UI.live.start;IO_UI.live.start=async function(m){if(!nsOn()||!m||!m.part)return _s0.apply(this,arguments);try{LIVE_USED=true}catch(e){}return nsLiveStart(m)}}
// conta chances e passes; "pular pro fim" resolve os lances sem abrir o 3D
{const _chN=IO_UI.chance;IO_UI.chance=async function(c){const x=NSSM.cur;if(!nsOn()||!x||x.inX)return _chN(c);x.x.ch=(x.x.ch||0)+1;let ok;
  NM.heroPasses=0;NM.drib=0;if(x.skip){ok=nsAutoChance(c);NM.selfGoal=false;NM.dmAssist=false}else ok=await _chN(c);
  {const hp=NM.heroPasses||0,dr=NM.drib||0;NM.heroPasses=0;NM.drib=0;x.x.ps=(x.x.ps||0)+hp;x.x.dr=(x.x.dr||0)+dr;const ME=nsSur();const ap=x.api;if(ap&&ap.note&&(hp||dr)&&!ok)ap.note(`✓ ${[hp?`${hp} passe${hp>1?'s':''} certo${hp>1?'s':''}`:'',dr?`${dr} drible${dr>1?'s':''}`:''].filter(Boolean).join(' e ')} de <b>${esc(ME)}</b>`)}
  if(ok&&['pass','long','cross','build'].includes(c.type))x.x.ps=(x.x.ps||0)+1;if(ok&&c.type==='tackle')x.x.tk=(x.x.tk||0)+1;return ok}}
// no "tudo no 3D" o esforço/foco não aparece, mas a energia gasta igual

// ---------- depois do apito: aplica extras, energia, estatísticas, relações, estrela ----------
{const _pmN=playMine;playMine=async function(o,io){if(!nsOn())return _pmN(o,io);const n=nsEnsure();
  const prev=NSSM.cur;const cur={o,x:{gu:0,gt:0,g:0,a:0,ch:0,ps:0,tk:0,blk:0,sc:[],rm:[]},live:null,skip:false};NSSM.cur=cur;let r;
  try{r=await _pmN(o,io)}finally{NSSM.cur=prev}
  try{const x=cur.x;const me=r.me;
   if(x.gu||x.gt||x.rm.length){r.gu+=x.gu;r.gt+=x.gt;if(me){me.g+=x.g;me.a+=x.a}
    for(const q of x.rm){const i=r.scorers.findIndex(s=>!s.us&&s.m===q.m&&s.w===q.w);if(i>=0)r.scorers.splice(i,1)}
    r.scorers.push(...x.sc);r.scorers.sort((a,b)=>a.m-b.m);r.gt=Math.max(0,r.gt)}
   if(me&&me.play&&me.nota!=null){me.nota=Math.round(clamp(me.nota+x.g*.85+x.a*.5+x.blk*.3+Math.min(.4,(x.dr||0)*.12),3,10)*10)/10}
   if(me&&me.play){const L=cur.live;if(!L||!L.drained){n.en=clamp(n.en-nsDrain(me.min,n.eff),0,100)}}
   const post=nsAfterMatch(r,o,cur);NSSM.items.push({me,post});(NSSM.post||(NSSM.post=[])).push(post)}catch(e){console.error(e)}
  return r}}
function nsIs3D(){try{return lanceMode()==='jogar'&&!L3D.failed}catch(e){return false}}
// lance com cena pedida (falta, pênalti, escanteio)
{const _scN=l3dScene;const ALT={falta:'faltaLonge',faltaLonge:'falta',escanteio:'escCurto',escCurto:'escanteio',escCab:'cabeca',cabeca:'escCab'};
 l3dScene=function(o){const cur=NSSM.cur;let sc=o&&o.scen?o.scen:_scN(o);if(cur){const U=cur.usedSc||(cur.usedSc=new Set());if(U.has(sc)){if(o&&o.scen){if(ALT[sc]&&!U.has(ALT[sc]))sc=ALT[sc]}else{let g=0;while(U.has(sc)&&g++<14)sc=_scN(o)}}U.add(sc)}return sc}}
// o lance conta passes certos e dribles do seu jogador
{const _lr=l3dResult;l3dResult=function(o,res){const r=_lr(o,res);try{NM.heroPasses=(res&&res.passes)||0;NM.drib=(res&&res.drib)||0}catch(e){}return r}}
function nsMotm(me,res){return!!(me&&me.play&&me.nota!=null&&(me.nota>=8.2||(me.nota>=7.6&&res==='V')||me.g>=3||(me.nota>=7.3&&me.g+me.a>=2&&res!=='D')))}
function nsAfterMatch(r,o,cur){const n=S.n;const me=r.me;const x=cur.x;const res=r.gu>r.gt?'V':r.gu<r.gt?'D':'E';const kind=o.kind||'club';
 const rel0={...n.rel},st0={l:n.star.l,p:n.star.p};const motm=nsMotm(me,res);let ps=0,chN=0;const ach0=Object.keys(n.ach).length;
 if(me&&me.play){const B=kind==='nat'?[n.is]:[n.ss,n.cs];
  ps=(x.ps||0)+Math.round(me.min/90*R(3,9)*(NS_PASSB[S.pos]||1)*(n.sk.vis.l/70));chN=Math.max(x.ch||0,me.g+(x.ch?0:RI(0,2)));
  for(const b of B){b.ap++;b.g+=me.g;b.a+=me.a;if(me.g>=3)b.ht++;b.ps+=ps;b.ch+=chN;if(motm)b.motm++}
  const nt=me.nota;const dC=nt>=8?5:nt>=7.2?3:nt>=6.5?1:nt<5?-5:nt<5.8?-3:0;
  const dT=(res==='V'?2:res==='D'?-2:0)+(me.a?2:0)+(ps>=10?1:0);const dF=me.g*3+(res==='V'?1:res==='D'?-2:0)+(motm?3:0)+(nt<5.5?-3:0);
  n.rel.coach=clamp(n.rel.coach+dC,0,100);n.rel.team=clamp(n.rel.team+dT,0,100);n.rel.fans=clamp(n.rel.fans+dF,0,100);if(nsHasSp()&&nt>=7.5)n.rel.spon=clamp(n.rel.spon+2,0,100);
  const imp=(o.decisive||/final|semi/i.test(o.label||'')?1.5:1)*(kind==='nat'?1.3:1);
  nsStarAdd(Math.max(1,((nt-6)*8+me.g*8+me.a*5+(motm?12:0)+(res==='V'?2:0))*imp));
  {const ks=NSK.map(x=>x[0]).sort((a,b)=>nsImp(b)-nsImp(a)+R(-1.2,1.2)).slice(0,2);for(const k of ks)nsAddP(k,RI(2,5))}
  if(n.boot&&n.bootLeft>0){n.bootLeft--;if(n.bootLeft<=0){(S.st.lifeNews=S.st.lifeNews||[]).push('Sua chuteira gastou. Hora de comprar outra.');n.boot=null;try{toast({ic:'👟',title:'Chuteira gasta',txt:'Compre outra na loja.',ms:2400})}catch(e){}}}}
 const isLg=!!(S.st&&club()&&o.comp===LG[club().l].n);
 const unlocked=[];try{unlocked.push(...nsAchCheck({ps,a:me&&me.a||0,g:me&&me.g||0,nota:me&&me.nota,win:res==='V'&&isLg&&me&&me.play,motm,en:n.en},true))}catch(e){}
 nsSync();
 return{o,r,me,res,ps,ch:chN,motm,rel0,rel1:{...n.rel},st0,st1:{l:n.star.l,p:n.star.p},ach:unlocked,x:{...x},kind,isLg,us:o.us,them:o.them,home:o.home,neutral:o.neutral}}

// a decisão da semana (pop-up) espera as telas do pós-jogo terminarem
{const _bwN=bindWeek;bindWeek=function(...a){if(NSSM.inPost)return;return _bwN.apply(this,a)}}
// ---------- telas depois do jogo ----------
function nsPostHost(){let h=document.getElementById('nspost');if(!h){h=document.createElement('div');h.id='nspost';document.body.appendChild(h)}h.hidden=false;return h}
function nsPostScreen(html,bind){return new Promise(res=>{const h=nsPostHost();h.innerHTML=`<div class="nspost">${html}</div>`;h.scrollTop=0;try{if(bind)bind(h,res)}catch(e){console.error(e)}
 const c=h.querySelector('[data-pc]');if(c)c.onclick=()=>res(c.dataset.pc)})}
function nsPostClose(){const h=document.getElementById('nspost');if(h){h.hidden=true;h.innerHTML=''}}
function nsRelChips(p){return NS_REL.map(([k,nm])=>{const d=Math.round(p.rel1[k]-p.rel0[k]);if(!d||(k==='gf'&&!S.gf)||(k==='spon'&&!nsHasSp()))return'';return`<span class="nsd ${d>0?'up':'down'}">${nm} ${d>0?'+':''}${d}</span>`}).join('')}
function nsStarRowHTML(p){const lvUp=p.st1.l>p.st0.l;return`<div class="nspst"><span class="ic">⭐<i>${p.st1.l}</i></span><div><b>Nível de estrela${lvUp?` · subiu pro ${p.st1.l}!`:''}</b><span class="nsmb star"><i id="psStar" style="width:${lvUp?0:Math.round(p.st0.p)}%"></i></span></div></div>`}
function nsSideName(s){return esc(s&&s.n||'')}
async function nsPostMatch(){const posts=(NSSM.post||[]).slice();NSSM.post=[];if(!posts.length&&!(S.n&&S.n.wk))return;
 const n=S.n;
 for(const p of posts){const r=p.r,me=p.me;const home=p.neutral?true:p.home;const[hg,ag]=home?[r.gu,r.gt]:[r.gt,r.gu];const H=home?p.us:p.them,A=home?p.them:p.us;
  const head=`<div class="nsp-res"><span class="nspc">${esc(p.o.comp)}${p.o.label?' · '+esc(p.o.label):''}</span><div class="sc"><span>${nsSideName(H)}</span><b>${hg} – ${ag}</b><span>${nsSideName(A)}</span></div></div>`;
  let body;
  if(me&&me.play){const nt=me.nota;
   body=`<h2 class="nsp-t">${p.motm?'⭐ Estrela do jogo!':p.res==='V'?'Vitória':p.res==='D'?'Derrota':'Empate'}</h2>${head}
   <div class="nsp-stats">${[['Chances',p.ch],['Gols',me.g],['Assistências',me.a],['Passes certos',p.ps],['Minutos',me.min]].map(([t,v])=>`<div><span>${t}</span><b>${v}</b></div>`).join('')}<div class="nota ${nt>=7.5?'good':nt<6?'bad':''}"><span>Nota do jogo</span><b>${fmt1(nt)}</b></div></div>
   <div class="nsp-rel">${nsRelChips(p)||'<span class="muted">Relações sem mudança</span>'}</div>${nsStarRowHTML(p)}
   ${p.ach.length?`<div class="nsp-ach">${p.ach.map(a=>`<div><span>🏅</span><b>${esc(a.t)}</b></div>`).join('')}</div>`:''}`}
  else{const why=me&&me.why;body=`<h2 class="nsp-t">${why==='lesionado'?'🚑 Fora por lesão':why==='suspenso'?'🟥 Suspenso':why==='base'?'🌱 Jogo do profissional':'🪑 No banco'}</h2>${head}<p class="muted">${why==='banco'?'O técnico não te colocou. Treinar e melhorar a relação com ele ajuda.':why==='lesionado'?`Mais ${S.st.injLeft} jogo${S.st.injLeft===1?'':'s'} de recuperação.`:'Você assistiu de fora.'}</p><div class="nsp-rel">${nsRelChips(p)}</div>`}
  await nsPostScreen(body+`<button class="btn wide" data-pc="ok">Continuar</button>`,h=>{setTimeout(()=>{const s=h.querySelector('#psStar');if(s)s.style.width=Math.round(p.st1.p)+'%'},80)});
  if(me&&me.play&&(p.motm||me.g>=2||me.nota<=5||(n.cs.g===me.g&&me.g>0)||(n.cs.ap===1)))await nsPostScreen(nsPaperHTML(p)+`<button class="btn wide" data-pc="ok">Continuar</button>`)}
 if(n.wk&&!n.wk.shown){n.wk.shown=true;await nsWeekScreen()}
 const R0=S.st&&S.st.nsRound;if(R0&&!R0.shown&&posts.some(p=>p.isLg)){R0.shown=true;await nsRoundScreen()}
 nsPostClose()}
function nsPaperHTML(p){const me=p.me;const c=club();const opp=p.them&&p.them.n||'adversário';const first=(S.name||'').split(' ')[0],sur=nsSur();const r=typeof npRand==='function'?npRand(hash(S.name+S.year+S.st.idx)):Math.random;
 let kick='NOTÍCIAS DO ESPORTE',head,txt,ic='⭐';
 if(me.g>=3){head='HAT-TRICK!';ic='⚽';txt=`${S.name} marcou ${me.g} vezes contra o ${opp} e levou a bola pra casa. Nas arquibancadas, a torcida já fala em ídolo.`}
 else if(n0(S.n.cs.ap)===1){head='NASCE UMA ESTRELA?';ic='🌟';txt=`Estreia de ${S.name} pelo ${c.n}: nota ${fmt1(me.nota)}${me.g?` e gol`:''}. Quem viu de perto garante que o garoto tem algo diferente.`}
 else if(p.motm){head='ESTRELA DO JOGO!';txt=`${first} ${sur} foi o melhor em campo ${p.res==='V'?'na vitória':p.res==='D'?'mesmo na derrota':'no empate'} do ${p.o.us&&p.o.us.n||c.n} contra o ${opp}${me.g?`, com ${me.g} gol${me.g>1?'s':''}`:''}${me.a?`${me.g?' e':', com'} ${me.a} assistência${me.a>1?'s':''}`:''}. ${['O técnico rasgou elogios na coletiva.','Olheiros de clubes maiores estavam no estádio.','Nas redes, o nome dele ficou entre os assuntos mais comentados.','Os companheiros fizeram fila pra abraçar o camisa '+(S.shirt||S.num)+'.'][Math.floor(r()*4)]}`}
 else if(me.g>=2){head='DOBLETE!';ic='⚽';txt=`Dois gols de ${S.name} contra o ${opp}. A fase é boa e a torcida sabe disso.`}
 else if(me.g>0){head='PRIMEIRO GOL!';ic='⚽';txt=`${S.name} desencantou contra o ${opp}. O primeiro de muitos?`}
 else{head='NOITE PARA ESQUECER';ic='📉';kick='CADERNO DE ESPORTES';txt=`Nota ${fmt1(me.nota)} para ${S.name} contra o ${opp}. A cobrança vai aumentar no próximo treino.`}
 return`<div class="nspaper"><div class="kick">${kick}</div><div class="hd"><span>${ic}</span><b>${head}</b></div><p>${esc(txt)}</p><small>${esc(c.n)} · ${seasonLbl(S.year)}</small></div>`}
const n0=v=>v|0;
function nsWeekScreen(){const n=S.n;const w=n.wk;const R=w.rows;const m=v=>v?nsK(v):'—';const pl=v=>v?'+'+nsK(v):'—';
 const html=`<h2 class="nsp-t">Atualização semanal</h2>
 <table class="nstab nswk"><thead><tr><th>Dinheiro</th><th>Básico</th><th>Agente</th></tr></thead><tbody>
 <tr><th>Salário (líquido)</th><td>${m(R.sal[0])}</td><td>${pl(R.sal[1])}</td></tr>
 <tr><th>Bônus por gol (${R.gN})</th><td>${m(R.g[0])}</td><td>${pl(R.g[1])}</td></tr>
 <tr><th>Bônus por assistência (${R.aN})</th><td>${m(R.a[0])}</td><td>${pl(R.a[1])}</td></tr>
 <tr><th>Patrocínio${S.captain?' (capitão +10%)':''}</th><td>${m(R.sp[0])}</td><td>${pl(R.sp[1])}</td></tr>${w.rent?`<tr><th>Aluguéis e imóveis</th><td>${m(w.rent)}</td><td></td></tr>`:''}
 <tr class="tot"><th>Total da semana</th><td colspan="2">${nsK(w.tot)}</td></tr></tbody></table>
 <table class="nstab nswk"><thead><tr><th>Energia</th><th>Básico</th><th>Treinador</th></tr></thead><tbody>
 <tr><th>Dias de descanso (6)</th><td>+${w.base}%</td><td>${w.coach?'+'+w.coach+'%':'sem contrato'}</td></tr><tr><th>Imóveis</th><td>${w.props?'+'+w.props+'%':'—'}</td><td></td></tr>
 <tr class="tot"><th>Energia agora</th><td colspan="2"><span class="nsmb"><i style="width:${Math.round(w.en)}%"></i></span> ${Math.round(w.en)}%</td></tr></tbody></table>
 ${w.drops.length?`<div class="nsp-warn">⚠️ Sem treino, caiu: ${[...new Set(w.drops)].join(', ')}</div>`:''}${w.autoN?`<div class="nsp-ok">🏋️ Treino automático: ${w.autoN} sessão${w.autoN>1?'ões':''}</div>`:''}
 <div class="nsp-btns"><button class="btn ghost" id="wkAg">💼 Agente</button><button class="btn ghost" id="wkCo">🪑 Treinador</button><button class="btn" data-pc="ok">Continuar</button></div>`;
 return nsPostScreen(html,(h,res)=>{h.querySelector('#wkAg').onclick=async()=>{h.hidden=true;await nsContractSheet0();h.hidden=false};h.querySelector('#wkCo').onclick=async()=>{h.hidden=true;await nsCoachTalk();h.hidden=false}})}
// versão sem re-render do hub (para usar no meio da sequência)
async function nsContractSheet0(){const keep=renderHub;renderHub=function(){};try{await nsContractSheet()}finally{renderHub=keep}}
async function nsCoachTalk(){const n=S.n;const k=await nsPop({ic:'🪑',title:`Treinador · relação ${Math.round(n.rel.coach)}%`,txt:'O que você quer falar com ele?',opts:[['start','🗣️ Quero ser titular'],['pen','🎯 Quero bater os pênaltis'],['fk','🧱 Quero bater as faltas']],ok:'Nada, valeu'});
 if(k==='start'){if(ch(clamp(n.rel.coach/120+(S.ovr-club().s)/30,.05,.9))){n.promise=2;await nsPop({ic:'👍',title:'Combinado',txt:'Ele prometeu te dar chance nos próximos 2 jogos.'})}else{n.rel.coach=clamp(n.rel.coach-5,0,100);await nsPop({ic:'😠',title:'Não gostou',txt:'"Quem escala sou eu." Relação −5.'})}}
 else if(k==='pen'||k==='fk'){const r=askTaker(k);await nsPop({ic:'🎯',title:k==='pen'?'Pênaltis':'Faltas',txt:r.txt,chips:r.chips})}}
{const _partP=participation;participation=function(kind,o){const p=_partP(kind,o);try{const n=S.n;if(nsOn()&&n.promise>0&&kind==='club'&&!S.youth&&(p.why==='banco'||(p.play&&!p.start))){n.promise--;return{play:true,start:true,min:ch(.3)?RI(60,85):90,role:p.role||'Rotação'}}}catch(e){}return p}}
function nsRoundScreen(){const st=S.st;const R0=st.nsRound;let tab=false;
 const draw=h=>{h.querySelector('.nspost').innerHTML=`<h2 class="nsp-t">${tab?esc(LG[st.lg||club().l].n):`Rodada ${R0.r+1}`}</h2><div class="nsp-rd">${tab?nsTableHTML():nsRoundHTML()}</div><div class="nsp-btns"><button class="btn ghost" id="rdT">${tab?'⚽ Rodada':'📊 Tabela'}</button><button class="btn" id="rdOk">Continuar ➜</button></div>`;
  h.querySelector('#rdT').onclick=()=>{tab=!tab;draw(h)}};
 return new Promise(res=>{const h=nsPostHost();h.innerHTML='<div class="nspost"></div>';draw(h);h.addEventListener('click',function f(e){if(e.target&&e.target.id==='rdOk'){h.removeEventListener('click',f);res()}})})}
function nsTableHTML(){const st=S.st;const T=sortTable(st.table);const me=S.club;const R0=st.nsRound||{prev:{}};
 return`<table class="nstab nslt"><thead><tr><th>#</th><th>Time</th><th>J</th><th>V</th><th>E</th><th>D</th><th>SG</th><th>Pts</th></tr></thead><tbody>${T.map((x,i)=>{const c=CLUB[x.id];const pv=R0.prev&&R0.prev[x.id];const mv=pv?pv-(i+1):0;
  return`<tr class="${x.id===me?'me':''}"><td>${i+1}${mv?`<i class="${mv>0?'up':'dn'}">${mv>0?'▲':'▼'}</i>`:''}</td><td class="cl">${esc(c?(c.a||mkAbbr(c.n)):x.id)}</td><td>${x.j}</td><td>${x.v}</td><td>${x.e}</td><td>${x.d}</td><td>${x.gp-x.gc}</td><td><b>${x.p}</b></td></tr>`}).join('')}</tbody></table>`}

// ---------- visual ----------
{const st=document.createElement('style');st.textContent=`
#overlay:has(.nslive){padding:0;background:var(--pitch);place-items:stretch;grid-template-columns:minmax(0,1fr);overflow:hidden}
.nslive{width:100%;min-width:0;overflow:hidden;max-width:720px;height:100dvh;margin:0 auto;display:flex;flex-direction:column;gap:6px;padding:calc(8px + env(safe-area-inset-top,0px)) 10px calc(8px + env(safe-area-inset-bottom,0px));text-align:left}
.nsl-top{display:flex;align-items:center;gap:8px;min-width:0}.nsl-top .nspc{flex:1;min-width:0;font:800 13px var(--f-body);color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nsl-top .clk{font:900 22px var(--f-display);min-width:48px;text-align:center}
.nsl-top .spd{display:flex;gap:4px}.nsl-top .spd button{border:1px solid var(--line-2);background:var(--panel);color:var(--chalk);border-radius:8px;padding:5px 9px;font:800 13px var(--f-body)}.nsl-top .spd button.on{background:var(--accent);color:var(--accent-ink)}
.nsl-score{display:grid;grid-template-columns:1fr 46px 46px 1fr;border-radius:10px;overflow:hidden;border:1px solid var(--line-2)}.nsl-score .tm{padding:10px 8px;font:800 18px var(--f-display);letter-spacing:.3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-align:center}.nsl-score b{display:grid;place-items:center;background:#0a1610;font:900 28px var(--f-display)}
.nsl-agg{font:700 12.5px var(--f-body);color:var(--muted);text-align:center}
.nsl-time{height:5px;background:#07130d;border-radius:9px;overflow:hidden}.nsl-time i{display:block;height:100%;background:var(--accent);transition:width .3s}
.nsl-feed{flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;gap:3px}
.nfr{display:grid;grid-template-columns:40px 1fr;align-items:center;background:var(--c);color:var(--k);border-radius:6px;padding:7px 10px;font:700 15px var(--f-body);animation:nfin .25s ease-out}.nfr>b{font:800 13px var(--f-mono);opacity:.85}.nfr>span{text-align:center}.nfr>span b{font-weight:900}.nfr.nme{box-shadow:inset 0 0 0 2px #f2c443}.nfr.nbad{filter:saturate(.6) brightness(.85)}.nfr.ngl{font-size:17px;padding:10px;font-weight:900}.nfr.nht{background:#1d2a22;color:var(--muted)}
.nfr.ndim{opacity:.34;filter:grayscale(1) brightness(.8);box-shadow:none}
.nsl-feed.off{background:repeating-linear-gradient(135deg,rgba(0,0,0,.18) 0 10px,rgba(0,0,0,.08) 10px 20px);border-radius:10px}
.nsl-off{align-self:center;background:#0c1510;color:#cfd8cf;border:1.5px dashed rgba(255,255,255,.28);border-radius:999px;padding:6px 14px;font:800 13px var(--f-body);letter-spacing:.02em}
.nsl-off[hidden]{display:none}
.nsl-ctl.off{opacity:.45;filter:grayscale(.7)}
.nfr.nin{grid-template-columns:40px 1fr;background:linear-gradient(90deg,#ffd84a,#ff8a1f);color:#1b1200;font:900 20px var(--f-display,var(--f-body));letter-spacing:.02em;padding:14px 10px;box-shadow:0 0 0 3px #fff3,0 8px 26px rgba(255,170,40,.55);animation:ninPop .7s cubic-bezier(.2,1.6,.4,1)}
.nfr.nin>b{color:#1b1200}
.nfr.nin small{display:block;font:700 13px var(--f-body);opacity:.8;letter-spacing:0;margin-top:2px}
@keyframes ninPop{0%{transform:scale(.6);opacity:0}100%{transform:none;opacity:1}}
.nslive.enter{animation:nsEnter 1.2s ease-out}
@keyframes nsEnter{0%{box-shadow:inset 0 0 0 0 rgba(255,216,74,0)}20%{box-shadow:inset 0 0 0 6px rgba(255,216,74,.95),inset 0 0 80px rgba(255,216,74,.45)}100%{box-shadow:inset 0 0 0 0 rgba(255,216,74,0)}}
@keyframes nfin{from{transform:translateY(8px);opacity:0}}
.nsl-msg{min-height:22px;text-align:center;font:800 15px var(--f-body);color:var(--gold)}.nsl-msg.pop{animation:nspop .4s}@keyframes nspop{50%{transform:scale(1.06)}}
.nslive.gfx .nsl-score{animation:nsgf 1s}.nslive.gfx.bad .nsl-score{animation:nsgb 1s}@keyframes nsgf{30%{box-shadow:0 0 0 4px #8be08a}}@keyframes nsgb{30%{box-shadow:0 0 0 4px #ff6a5c}}
.nsl-ctl{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);gap:8px;align-items:stretch}.nsl-ctl[hidden]{display:none}
.nsl-eff,.nsl-foc{display:grid;gap:4px;background:var(--panel);border:1px solid var(--line-2);border-radius:12px;padding:6px 8px}.nsl-eff small,.nsl-foc small{font:800 11.5px var(--f-body);color:var(--muted);text-transform:uppercase;text-align:center}
.nsl-eff>div,.nsl-foc>div{display:flex;align-items:center;justify-content:center;gap:6px}.nsl-eff button{width:38px;height:38px;border-radius:10px;border:1px solid var(--line-2);background:var(--panel-2);color:var(--chalk);font:900 22px var(--f-body)}
#nlEv{display:flex;gap:3px}#nlEv i{width:9px;height:20px;border-radius:3px;background:#0a1610;border:1px solid var(--line-2)}#nlEv i.on{background:var(--accent);border-color:var(--accent)}
.nsl-foc button{width:42px;height:38px;border-radius:10px;border:1px solid var(--line-2);background:var(--panel-2);font-size:19px}.nsl-foc button.on{background:var(--accent);border-color:#ffb27a}
.nsl-dr{width:64px;border-radius:12px;border:1px solid #ff8a7a;background:linear-gradient(180deg,#b3261e,#7d1712);font-size:24px;color:#fff;display:grid;place-items:center}.nsl-dr small{font:800 12px var(--f-body)}.nsl-dr:disabled{opacity:.35;filter:grayscale(1)}
.nsl-en{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;font:800 13px var(--f-body);color:var(--muted)}.nsl-en .nsmb{height:12px}.nsl-en b{color:var(--chalk)}
.nsl-ht,.nsl-fin{display:grid;gap:8px;justify-items:center;text-align:center;background:var(--panel);border:1px solid var(--line-2);border-radius:14px;padding:12px}.nsl-ht b,.nsl-fin b{font:900 22px var(--f-display)}.nsl-ht .row{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}.nsl-fin b.good{color:var(--good)}.nsl-fin b.bad{color:var(--bad)}.nsl-fin span{font:800 16px var(--f-body)}
#nspost{position:fixed;inset:0;z-index:19;background:rgba(5,14,9,.94);overflow:auto;display:grid;place-items:center;padding:calc(12px + env(safe-area-inset-top,0px)) 12px calc(12px + env(safe-area-inset-bottom,0px))}#nspost[hidden]{display:none}
.nspost{width:100%;max-width:560px;display:grid;gap:10px;background:var(--panel);border:1px solid var(--line-2);border-radius:18px;padding:16px;animation:blfade .2s}
.nsp-t{margin:0;text-align:center;font:900 26px var(--f-display);letter-spacing:.4px}
.nsp-res{display:grid;gap:4px;text-align:center}.nsp-res .nspc{font:700 12.5px var(--f-body);color:var(--muted)}.nsp-res .sc{display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;font:800 15px var(--f-body)}.nsp-res .sc b{font:900 26px var(--f-display)}.nsp-res .sc span:first-child{text-align:right}.nsp-res .sc span:last-child{text-align:left}
.nsp-stats{display:grid;gap:3px}.nsp-stats div{display:grid;grid-template-columns:1fr 80px;background:#0d2118;border-radius:8px;padding:8px 12px;font:700 15px var(--f-body)}.nsp-stats b{text-align:right;font:800 17px var(--f-display)}.nsp-stats .nota{background:#1d4a2c}.nsp-stats .nota.good{background:#2f7a45}.nsp-stats .nota.bad{background:#6b241c}.nsp-stats .nota b{font-size:22px}
.nsp-rel{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}.nsd{padding:6px 10px;border-radius:9px;font:800 13.5px var(--f-body)}.nsd.up{background:#2f9e44;color:#fff}.nsd.down{background:#8a3329;color:#fff}
.nspst{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:center;background:#0d2118;border-radius:12px;padding:8px 12px}.nspst .ic{font-size:30px;position:relative}.nspst .ic i{position:absolute;inset:0;display:grid;place-items:center;font:900 12px var(--f-body);font-style:normal;color:#3b2a00;top:3px}.nspst b{display:block;font:800 14px var(--f-body);margin-bottom:4px}.nspst .nsmb i{transition:width 1.2s ease-out}
.nsp-ach{display:grid;gap:4px}.nsp-ach div{display:flex;gap:8px;align-items:center;background:linear-gradient(90deg,#3a7d2a,#245a1d);border-radius:10px;padding:8px 12px;font:800 14px var(--f-body)}
.nspaper{background:#f3efe3;color:#1b1b1b;border-radius:12px;padding:16px;display:grid;gap:8px;text-align:center;font-family:Georgia,serif}.nspaper .kick{font:900 13px var(--f-body);letter-spacing:2px;color:#b3261e}.nspaper .hd{display:grid;gap:6px;justify-items:center}.nspaper .hd span{font-size:54px}.nspaper .hd b{font:900 32px var(--f-display);letter-spacing:.5px;line-height:1}.nspaper p{margin:0;font-size:17px;line-height:1.45}.nspaper small{color:#666}
.nswk{background:#0d2118;border-radius:12px;overflow:hidden}.nswk tbody th{font-size:13.5px}.nswk td{white-space:nowrap}.nswk tr.tot th,.nswk tr.tot td{background:#1d4a2c;color:var(--chalk);font-weight:800}.nswk .nsmb{display:inline-block;width:110px;vertical-align:middle}
.nsp-warn{background:#3d3214;border:1px solid #7a6326;border-radius:10px;padding:8px 10px;font:700 13.5px var(--f-body)}.nsp-ok{background:#173f25;border:1px solid #2f7a45;border-radius:10px;padding:8px 10px;font:700 13.5px var(--f-body)}
.nsp-btns{display:grid;grid-template-columns:1fr 1fr;gap:8px}.nsp-btns .btn:last-child{grid-column:1/-1}.nsp-btns .btn:only-child,.nsp-btns .btn:nth-child(2):last-child{grid-column:auto}
.nsp-rd{max-height:60dvh;overflow:auto}.nslt td,.nslt th{padding:5px 4px;font-size:13.5px}.nslt tr.me td{background:#1d5a2c;color:#fff}.nslt i{font-style:normal;font-size:9px;margin-left:2px}.nslt i.up{color:var(--good)}.nslt i.dn{color:var(--bad)}
@media (max-width:420px){.nfr{font-size:13.5px;padding:6px 8px;grid-template-columns:34px 1fr}.nsl-score{grid-template-columns:1fr 38px 38px 1fr}.nsl-score .tm{font-size:15px}.nsl-score b{font-size:24px}.nsl-ctl{gap:6px}.nsl-eff,.nsl-foc{padding:5px 4px}.nsl-eff>div,.nsl-foc>div{gap:3px}.nsl-eff button{width:28px;height:34px;font-size:18px}#nlEv{gap:2px}#nlEv i{width:7px}.nsl-foc button{width:30px;height:34px;font-size:16px}.nsl-dr{width:50px}.nsl-top .spd button{padding:5px 7px}.nsl-top .clk{font-size:19px;min-width:38px}.nswk th,.nswk td{font-size:12px;padding:5px 3px}.nswk .nsmb{width:70px}}
@media (max-height:700px){.nfr{padding:5px 8px}.nsl-score .tm{padding:7px}}
`;document.head.appendChild(st)}
