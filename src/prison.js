// ================== PRISÃO: o jogo muda de cara enquanto você cumpre a pena ==================
function inPrison(){return!!(S&&S.prison&&S.prison.left>0)}
const _prisonNowP=prisonNow;prisonNow=function(n){_prisonNowP(n);try{if(S.st)S.st.suspLeft=Math.max(0,(S.st.suspLeft||0)-n);const P0=S.prison||{left:0,total:0,resp:25,cig:0};S.prison={...P0,left:P0.left+n,total:P0.total+n,acts:3,visit:false};WEEK_TAB=null}catch(e){}};
const _partP=participation;participation=function(kind,o){if(inPrison())return{play:false,why:'preso'};return _partP(kind,o)};
const _playMineP=playMine;playMine=async function(o,io){const was=inPrison();const r=await _playMineP(o,io);try{if(was&&(o.kind||'club')==='club'){S.prison.left--;S.prison.acts=3;S.prison.visit=false;S.prison.week=(S.prison.week||0)+1;
 if(S.prison.left<=0){const P0=S.prison;S.prison={left:0,total:0,resp:P0.resp,cig:P0.cig};(S.pendingMoments=S.pendingMoments||[]).push({k:'livre',emoji:'🕊️',eyebrow:'Alvará de soltura',big:'LIBERDADE!',title:'O portão abriu. Lá fora, o futebol esperou por você.',lines:[`Cumpriu ${P0.total} jogos de pena`,P0.resp>=60?'Saiu respeitado lá dentro':'Saiu sem olhar pra trás','Hora de reconstruir a carreira']})}}}catch(e){}return r};
// ---------- tela da prisão ----------
let JAIL_MSG=null;
const JAIL_ACTS=[
 {id:'patio',ic:'⚽',n:'Racha no pátio',d:'Minigame. Ganhe respeito com a bola no pé.'},
 {id:'cozinha',ic:'🍳',n:'Trabalhar na cozinha',d:'Minigame de ritmo. Trabalho reduz a pena.'},
 {id:'domino',ic:'🁫',n:'Dominó valendo cigarro',d:'Minigame. Cigarro é a moeda daqui.'},
 {id:'academia',ic:'🏋️',n:'Academia improvisada',d:'Garrafas de água como peso. Corpo em dia.'},
 {id:'estudar',ic:'📚',n:'Estudar na biblioteca',d:'Cabeça mais forte. Pode reduzir a pena.'},
 {id:'visita',ic:'👨‍👩‍👦',n:'Dia de visita',d:'Uma vez por semana. Família e amor.'},
 {id:'advogado',ic:'⚖️',n:'Chamar o advogado',d:'Custa caro. Pode tirar jogos da pena.'},
 {id:'fuga',ic:'🗝️',n:'Tentar fugir',d:'Minigame: labirinto, guardas e holofote. Risco altíssimo.'},
];
function renderPrison(){
 const P=S.prison;document.body.classList.add('jail');document.body.classList.remove('onescreen','plan1','rep1');closePanel&&closePanel();
 const pct=Math.round((1-P.left/Math.max(1,P.total))*100);
 $app.innerHTML=`<header class="ph jph"><div class="ph-in"><span class="jbadge">🔒</span><div class="who"><b>${esc(S.name)} <span style="color:#c9b8a3;font-weight:600">· detento nº ${String(S.num).padStart(2,'0')}${(S.year%100)}</span></b><span>Presídio Estadual · ${S.age} anos</span></div><div class="ovr"><b class="mono">${S.ovr}</b><small>OVR</small></div></div></header>
 <div class="wrap jwrap">
  <section class="jcell"><div class="jbars"></div><div class="jfig"><svg viewBox="0 0 60 110"><rect x="18" y="0" width="24" height="22" rx="3" fill="${(S.face&&!S.face.photo&&FACES[S.face.preset||0].skin)||'#c98d62'}"/><rect x="16" y="22" width="28" height="40" fill="#ff7a1a"/><rect x="18" y="62" width="10" height="40" fill="#e46a10"/><rect x="32" y="62" width="10" height="40" fill="#e46a10"/><rect x="8" y="24" width="8" height="32" fill="#ff7a1a"/><rect x="44" y="24" width="8" height="32" fill="#ff7a1a"/><text x="30" y="46" text-anchor="middle" font-size="9" font-weight="900" fill="#1a1a1a">${S.num}</text></svg></div><div class="jbunk">🛏️</div><div class="jlight"></div>
   <div class="jtxt"><div class="eyebrow" style="color:#ffb27a">Cumprindo pena</div><b>Faltam ${P.left} jogo${P.left>1?'s':''}</b><div class="jbar"><i style="width:${pct}%"></i></div><small>O time joga sem você. Lá fora, a vida segue.</small></div></section>
  <div class="jstats"><span>🛡️ Respeito <b>${Math.round(P.resp)}</b></span><span>🧠 Cabeça <b>${Math.round(S.life.cab)}</b></span><span>💪 Corpo <b>${Math.round(S.life.corpo)}</b></span><span>🚬 <b>${P.cig||0}</b></span></div>
  ${JAIL_MSG?`<div class="outcome jmsg"><p>${esc(JAIL_MSG.txt)}</p><div class="chipsrow">${(JAIL_MSG.chips||[]).map(([t,k])=>`<span class="chip ${k}">${esc(t)}</span>`).join('')}</div></div>`:''}
  <div class="jhead"><b>Ações na semana</b><span class="chip">${P.acts} de 3</span></div>
  <div class="jacts">${JAIL_ACTS.map(a=>{const off=P.acts<=0||(a.id==='visita'&&P.visit)||(a.id==='advogado'&&S.din<.03);return`<button class="jact" data-ja="${a.id}" ${off?'disabled':''}><span>${a.ic}</span><b>${a.n}</b><small>${a.d}</small></button>`}).join('')}</div>
 </div>
 <div class="dock jdock"><div class="dock-in"><button class="btn playbtn" id="jNext">⏭️ Passar a semana<small>${PAUSE?'':'O time joga sem você'}</small></button></div></div>`;
 $app.querySelectorAll('[data-ja]').forEach(b=>b.onclick=()=>jailAct(b.dataset.ja));
 document.getElementById('jNext').onclick=async()=>{JAIL_MSG=null;if(PAUSE){renderHubP0();return}await advance('one')};
 if(!P.evWeek||P.evWeek!==P.week){P.evWeek=P.week;if(ch(.45))setTimeout(()=>jailEvent(),400)}
}
async function jailAct(id){const P=S.prison;if(P.acts<=0)return;let txt='',fx={},dr=0,dl=0;
 if(id==='patio'){const r=await nssMoment({kind:ch(.5)?'dribble':'finish',comp:'Pátio da prisão',title:'Racha no pátio',skill:.78,keeper:.3,planned:true,need:2,speed:.85,okTxt:'Golaço no pátio!'});dr=r.ok?10:-3;txt=r.ok?'O pátio parou pra ver. Até os guardas aplaudiram.':'Levou um carrinho de um cara de 2 metros. Riram de você.';fx={cab:r.ok?4:-2,corpo:-1}}
 else if(id==='cozinha'){const r=await mgRhythm({comp:'Cozinha',title:'Picar cebola no ritmo',sub:'Toque quando a faca passar pela linha.',notes:8,gap:620,speed:.06});if(r.hits>=6){dl=1;txt='Trabalho exemplar. O juiz concedeu remição: um jogo a menos.'}else{txt='Chorou de cebola e queimou o arroz.';}fx={disc:3};dr=r.hits>=6?2:0}
 else if(id==='domino'){const r=await mgDomino();if(r.win){P.cig=(P.cig||0)+r.pts;dr=6;txt=`Ganhou ${r.pts} maços de cigarro. Respeito na mesa.`}else{dr=-2;P.cig=Math.max(0,(P.cig||0)-1);txt='Perdeu feio. O "Professor" da cela 3 não perdoa.'}}
 else if(id==='academia'){S.xp=S.xp||{};S.xp.FIS=(S.xp.FIS||0)+12;txt='Barra fixa com o colchão de peso. O corpo agradece.';fx={corpo:5};dr=2}
 else if(id==='estudar'){S.xp=S.xp||{};S.xp.MEN=(S.xp.MEN||0)+12;if(ch(.3)){dl=1;txt='Concluiu um curso. Remição: um jogo a menos.'}else txt='Leu dois livros na semana. A cabeça respira.';fx={cab:4}}
 else if(id==='visita'){P.visit=true;S.pais=clamp((S.pais??60)+10,0,100);if(S.gf)S.gf.v=clamp(S.gf.v+(ch(.7)?8:-10),0,100);txt=S.gf?`Sua mãe e ${S.gf.n} vieram. Choraram os três.`:'Sua mãe trouxe bolo de fubá e um abraço longo.';fx={cab:7}}
 else if(id==='advogado'){const c=Math.max(.03,S.din*.08);S.din-=c;if(ch(.55)){dl=RI(1,3);txt=`O habeas corpus parcial saiu: ${dl} jogo${dl>1?'s':''} a menos. Custou ${money(c)}.`}else txt=`O juiz negou o pedido. Foram ${money(c)} pro ralo.`}
 else if(id==='fuga'){const r=await mgFuga();if(r.ok){S.prison={left:0,total:0,resp:P.resp+15,cig:P.cig};S.foragido=true;S.flags.release=true;applyFx({heat:60,fama:-10,torc:-15});JAIL_MSG=null;(S.pendingMoments=S.pendingMoments||[]).push({k:'fuga',emoji:'🏃',eyebrow:'Plantão',big:'FORAGIDO!',title:'Você pulou o muro. Agora toda a polícia te procura.',lines:['O clube rompeu o contrato','A polícia está de olho (calor alto)','Qualquer deslize, e você volta pra cela']});renderHub();return}
  dl=-4;dr=5;txt='Te pegaram no alambrado. +4 jogos de pena, mas a cadeia inteira comentou a tentativa.';fx={cab:-4}}
 P.acts--;if(dl){P.left=Math.max(1,P.left-dl)}if(dr)P.resp=clamp(P.resp+dr,0,100);
 const chips=applyFx(fx);if(dr)chips.push([`${dr>0?'+':'−'}${Math.abs(dr)} Respeito`,dr>0?'up':'down']);if(dl>0)chips.push([`−${dl} jogo${dl>1?'s':''} de pena`,'up']);if(dl<0)chips.push([`+${-dl} jogos de pena`,'down']);
 JAIL_MSG={txt,chips};renderPrison()}
// eventos da prisão
const JAIL_EV=[
 {t:'Briga no refeitório',d:'Um detento derrubou sua bandeja de propósito. Todo mundo está olhando.',o:[['Partir pra cima',()=>ch(.5)?['Você ganhou a briga. Ninguém mexe mais com você.',{resp:15,cab:-2,pena:1}]:['Apanhou feio e ainda foi pra solitária.',{resp:-5,corpo:-8,pena:1}]],['Pegar outra bandeja em silêncio',()=>['Engoliu seco. Alguns acharam fraqueza.',{resp:-6,cab:2}]],['Fazer piada e oferecer sua sobremesa',()=>ch(.6)?['Ele riu. Virou seu parceiro.',{resp:5,cab:3}]:['Ele não achou graça.',{resp:-3}]]]},
 {t:'A facção te chama',d:'O "chefe" do pavilhão quer você no time de futebol da facção. E em outras coisas.',o:[['Aceitar só o futebol',()=>['Ganhou proteção. E uma dívida.',{resp:10,heat:10}]],['Recusar com educação',()=>ch(.6)?['Respeitaram sua decisão.',{resp:2}]:['Começaram a te ameaçar.',{cab:-8,resp:-4}]],['Entrar de vez',()=>['Agora você é "da casa". A polícia vai saber.',{resp:20,heat:25,pena:2}]]]},
 {t:'Carcereiro corrupto',d:'Um guarda oferece celular e comida de fora em troca de dinheiro.',o:[['Pagar',()=>ch(.75)?['Vida mais leve por uns dias.',{din:-.02,cab:5}]:['Era armadilha. Revista na cela.',{din:-.02,pena:2,resp:-2}]],['Recusar',()=>['Ele anotou seu nome.',{}]]]},
 {t:'Jogo do seu time na TV',d:'O pavilhão inteiro assiste. Seu time perdeu e você está aqui dentro.',o:[['Torcer em silêncio',()=>['Doeu ver de longe.',{cab:-3}]],['Comentar o jogo pros presos',()=>['Virou o "comentarista" da cadeia.',{resp:6,cab:2}]]]},
];
function jailEvent(){if(!inPrison()||!$ov.hidden)return;const ev=pick(JAIL_EV);
 choicePopup({tag:'Prisão',tagc:'crime',eyebrow:'Pavilhão 4',ic:'🔒',title:ev.t,text:ev.d,options:ev.o.map(o=>o[0]),pick:i=>{const[txt,fx]=ev.o[i][1]();const P=S.prison;const f={...fx};const chips=[];
  if(f.resp){P.resp=clamp(P.resp+f.resp,0,100);chips.push([`${f.resp>0?'+':'−'}${Math.abs(f.resp)} Respeito`,f.resp>0?'up':'down']);delete f.resp}if(f.pena){P.left+=f.pena;P.total+=f.pena;chips.push([`+${f.pena} jogos de pena`,'down']);delete f.pena}
  chips.push(...applyFx(f));return{txt,chips}}}).then(()=>renderPrison())}
// troca o hub pela prisão
const renderHubP0=renderHub;renderHub=function(...a){if(inPrison()&&S.st&&!S.st.done&&!PAUSE){return renderPrison()}document.body.classList.remove('jail');return renderHubP0.apply(this,a)};
const _shellP=shell;shell=function(...a){document.body.classList.remove('jail');return _shellP.apply(this,a)};
const _planP=renderPlanning;renderPlanning=function(...a){const r=_planP.apply(this,a);try{if(inPrison()){const w=$app.querySelector('.wrap');if(w)w.insertAdjacentHTML('afterbegin',`<section class="card jnote">🔒 Você continua preso: faltam <b>${S.prison.left}</b> jogos. O clube planeja a temporada sem você.</section>`)}}catch(e){}return r};
// dominó: escolha a pedra certa
function mgDomino(){return new Promise(res=>{let me=0,op=0,r=0;
 const round=()=>{if(r>=5){const win=me>op;swEnd(win,win?`Venceu ${me} x ${op}`:`Perdeu ${me} x ${op}`,me>=4).then(()=>res({win,pts:me}));return}
  const tiles=[0,1,2].map(()=>[RI(0,6),RI(0,6)]);const opT=[RI(0,6),RI(0,6)];
  lifeFrame({tag:'Prisão',sub:`Rodada ${r+1} de 5 · ${me} x ${op}`,title:'Dominó no pavilhão',hint:'Escolha uma pedra virada. A soma maior vence a rodada. O "Professor" já escolheu a dele.',cls:'domino'},
   `<div class="dom-op"><span>Professor</span><div class="dtile back"></div></div><div class="dom-me">${tiles.map((t,i)=>`<button class="dtile back" data-t="${i}"></button>`).join('')}</div>`);
  $ov.querySelectorAll('[data-t]').forEach(b=>b.onclick=()=>{$ov.querySelectorAll('[data-t]').forEach(x=>x.disabled=true);const t=tiles[+b.dataset.t];const mine=t[0]+t[1],his=opT[0]+opT[1];
   const pip=(t)=>`<span>${t[0]}</span><i></i><span>${t[1]}</span>`;b.classList.remove('back');b.innerHTML=pip(t);const o=$ov.querySelector('.dom-op .dtile');o.classList.remove('back');o.innerHTML=pip(opT);
   if(mine>his)me++;else if(his>mine)op++;SFX.tone({f:mine>his?720:200,dur:.12,gain:.1});r++;setTimeout(round,900)})};
 round()})}
// fuga: labirinto com guardas e holofote
function mgFuga(){return new Promise(res=>{
 const W=11,H=13;const g=mazeGen(W,H);const me={x:1,y:H-2};const exit={x:W-2,y:1};g[exit.y][exit.x]=0;g[me.y][me.x]=0;
 const free=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(!g[y][x]&&Math.abs(x-me.x)+Math.abs(y-me.y)>6)free.push([x,y]);
 const guards=shuffle(free).slice(0,2).map(([x,y])=>({x,y}));let lightX=0,t=30,over=false,tick=0;
 $ov.hidden=false;
 $ov.innerHTML=`<div class="ovwrap lifemg heist"><div class="lm-top"><span class="tag crime">Prisão</span><span class="eyebrow">3h da manhã</span></div><h2 class="pkh">Fuga do pavilhão</h2>
 <p class="lm-hint">Chegue ao <b>muro 🧱</b> sem ser visto. Fuja dos <b>👮 guardas</b> e não fique na <b>luz do holofote</b>.</p>
 <div class="hz-hud"><span id="fzT">⏱ 30</span><span id="fzA"></span></div><div class="hz jz" id="fz" style="grid-template-columns:repeat(${W},1fr)"></div>
 <div class="hz-pad"><button data-mv="0,-1">▲</button><div><button data-mv="-1,0">◀</button><button data-mv="1,0">▶</button></div><button data-mv="0,1">▼</button></div><div class="pkres" id="mgRes"></div></div>`;
 const box=document.getElementById('fz');
 const lit=(x)=>Math.abs(x-lightX)<=0;
 const draw=()=>{let h='';for(let y=0;y<H;y++)for(let x=0;x<W;x++){let c=g[y][x]?'w':'f';if(!g[y][x]&&lit(x))c+=' lit';let ic='';if(x===exit.x&&y===exit.y)ic='🧱';if(guards.some(q=>q.x===x&&q.y===y))ic='👮';if(me.x===x&&me.y===y)ic='🏃';h+=`<i class="${c}">${ic}</i>`}box.innerHTML=h};
 const bfs=(sx,sy,tx,ty)=>{const q=[[sx,sy]];const prev={};prev[sx+','+sy]=null;while(q.length){const[x,y]=q.shift();if(x===tx&&y===ty)break;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=nx+','+ny;if(g[ny]&&g[ny][nx]===0&&!(k in prev)){prev[k]=[x,y];q.push([nx,ny])}}}let k=tx+','+ty;if(!(k in prev))return null;let cur=[tx,ty],p=prev[k];while(p&&!(p[0]===sx&&p[1]===sy)){cur=p;p=prev[p[0]+','+p[1]]}return cur};
 const caught=()=>guards.some(q=>q.x===me.x&&q.y===me.y)||lit(me.x)&&tick%3===0&&me.y>1&&ch(.5);
 const end=ok=>{if(over)return;over=true;clearInterval(ti);clearInterval(gi);removeEventListener('keydown',kh);swEnd(ok,ok?'Pulou o muro!':'Pego na fuga',ok).then(()=>res({ok}))};
 const move=(dx,dy)=>{if(over)return;const nx=me.x+dx,ny=me.y+dy;if(!g[ny]||g[ny][nx])return;me.x=nx;me.y=ny;SFX.tone({f:260,dur:.04,gain:.05});if(nx===exit.x&&ny===exit.y)return end(true);if(guards.some(q=>q.x===nx&&q.y===ny))return end(false);draw()};
 $ov.querySelectorAll('[data-mv]').forEach(b=>b.onclick=()=>{const[dx,dy]=b.dataset.mv.split(',').map(Number);move(dx,dy)});
 let sp=null;box.addEventListener('pointerdown',e=>{sp={x:e.clientX,y:e.clientY}});box.addEventListener('pointerup',e=>{if(!sp)return;const dx=e.clientX-sp.x,dy=e.clientY-sp.y;sp=null;if(Math.hypot(dx,dy)<14)return;Math.abs(dx)>Math.abs(dy)?move(Math.sign(dx),0):move(0,Math.sign(dy))});
 const kh=e=>{const m={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[e.key];if(m){e.preventDefault();move(...m)}};addEventListener('keydown',kh);
 const ti=setInterval(()=>{t--;(document.getElementById('fzT')||{}).textContent='⏱ '+t;if(t<=0)end(false)},1000);
 let ld=1;const gi=setInterval(()=>{if(over)return;tick++;if(tick%2===0){lightX+=ld;if(lightX>=W-1||lightX<=0)ld=-ld}
  for(const q of guards){const near=Math.abs(q.x-me.x)+Math.abs(q.y-me.y)<=4;let n=null;if(near&&tick%2===0)n=bfs(q.x,q.y,me.x,me.y);else if(tick%3===0){const o=[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>[q.x+dx,q.y+dy]).filter(([x,y])=>g[y]&&g[y][x]===0);if(o.length)n=pick(o)}if(n){q.x=n[0];q.y=n[1]}}
  if(lit(me.x)&&ch(.18)){(document.getElementById('fzA')||{}).textContent='🔦 Te viram!';return end(false)}
  if(guards.some(q=>q.x===me.x&&q.y===me.y))return end(false);draw()},300);
 draw()})}

// ---------- preso perde o contrato; ao sair, só clubes menores fazem proposta ----------
const _prisonNowF=prisonNow;prisonNow=function(n){const was=inPrison();_prisonNowF(n);try{if(!was&&S.club&&!S.youth&&!S.prisonFired){const c=club();S.prisonClub={club:c.id,s:c.s};S.wage=0;S.captain=false;S.taker={pen:false,fk:false};S.agreed=null;S.prisonOffers=false}}catch(e){}};
// ao sair da prisão o clube rescinde e você fica sem clube
function prisonRelease(){const PC=S.prisonClub;if(!PC||S.foragido)return;S.prisonClub=null;S.prisonFired=PC;S.contract=0;S.wage=0;const cn=CLUB[PC.club]?CLUB[PC.club].n:'clube';
 (S.pendingMoments=S.pendingMoments||[]).push({k:'rescisao',emoji:'📄',eyebrow:cn,big:'CONTRATO RESCINDIDO',title:`Você saiu da prisão, mas o ${cn} rompeu seu contrato. Agora você está sem clube.`,lines:['Salário cortado','Só clubes menores vão te querer','Escolha bem o recomeço']});S.prisonOffers=true}
function lowerOffers(){const F=S.prisonFired||{s:S.ovr+4};const cap=Math.min(F.s-6,S.ovr+1);const home=CLUB[F.club]?CLUB[F.club].country:null;
 let pool=CLUBS.filter(x=>x.id!==F.club&&x.s<=cap&&x.s>=cap-16);if(pool.length<3)pool=CLUBS.filter(x=>x.id!==F.club&&x.s<=cap).sort((a,b)=>b.s-a.s).slice(0,10);
 const same=shuffle(pool.filter(x=>x.country===home)),abroad=shuffle(pool.filter(x=>x.country!==home));const pick=[...same.slice(0,2),...abroad.slice(0,1)];while(pick.length<3&&pool.length>pick.length){const x=pool.find(y=>!pick.includes(y));if(!x)break;pick.push(x)}
 return pick.map(x=>({...mkOffer(x,()=>.65),years:RI(1,2),fresh:true}))}
function releaseOffersPopup(){if(!S.prisonOffers||!$ov.hidden)return;S.prisonOffers=false;const offs=lowerOffers();const F=S.prisonFired;
 $ov.hidden=false;$ov.innerHTML=`<div class="ovwrap"><div class="eyebrow">Recomeço · ${S.age} anos</div><h2 class="pkh" style="margin:6px 0 4px">Quem ainda aposta em você</h2>
  <p class="muted" style="margin:0 0 12px">${F&&CLUB[F.club]?`O ${esc(CLUB[F.club].n)} não quer mais saber. `:''}Os grandes sumiram. Estes clubes topam te dar uma chance: você assina agora e estreia na próxima temporada.</p>
  <div class="offers">${offs.map((o,i)=>offerCard(o,i)).join('')}</div><button class="btn ghost wide" id="relWait" style="margin-top:10px">Esperar a janela e ver o que aparece</button></div>`;
 $ov.querySelectorAll('[data-off]').forEach(b=>b.onclick=()=>{const o=offs[+b.dataset.off];S.agreed=o;$ov.hidden=true;$ov.innerHTML='';toast({ic:'✍️',title:`Acertado com o ${CLUB[o.club].n}`,txt:'Você treina por conta própria e estreia na próxima temporada.',ms:3600});saveNow('season');renderHub()});
 document.getElementById('relWait').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';toast({ic:'⏳',title:'Esperando a janela',txt:'No fim da temporada, só clubes menores vão ligar.',ms:3200});renderHub()}}
// soltou: liga as propostas
const _playMineF=playMine;playMine=async function(o,io){const was=inPrison();const r=await _playMineF(o,io);try{if(was&&!inPrison())prisonRelease()}catch(e){}return r};
// sem clube até a próxima temporada
const _partF=participation;participation=function(kind,o){if(kind==='club'&&S.prisonFired&&!inPrison()&&S.club===S.prisonFired.club)return{play:false,why:'semclube'};return _partF(kind,o)};
const _renderHubF=renderHub;renderHub=function(...a){const r=_renderHubF.apply(this,a);try{if(S.prisonOffers&&!inPrison())setTimeout(()=>{if(!(S.pendingMoments&&S.pendingMoments.length))releaseOffersPopup()},900)}catch(e){}return r};
// fim da temporada sem acerto: mercado só de clubes menores
const _wsF=windowState;windowState=function(){if(S.prisonFired&&S.club===S.prisonFired.club&&!S.agreed)return{open:true,release:true,stay:false};return _wsF()};
const _genOffF=genOffers;genOffers=function(lf){if(S.prisonFired&&S.club===S.prisonFired.club&&!lf)return lowerOffers().slice(0,2);return _genOffF(lf)};
const _accF=acceptOffer;acceptOffer=function(o){_accF(o);if(S.prisonFired&&S.club!==S.prisonFired.club){S.prisonFired=null;S.prisonOffers=false}};
