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
const _prisonNowF=prisonNow;prisonNow=function(n){const was=inPrison();_prisonNowF(n);try{if(!was&&S.club&&!S.youth&&!S.prisonFired){const c=club();S.prisonFired={club:c.id,s:c.s};S.prisonClub=null;S.contract=0;S.wage=0;S.captain=false;S.taker={pen:false,fk:false};S.agreed=null;S.prisonOffers=false;S.loan=null;
  (S.pendingMoments=S.pendingMoments||[]).push({k:'rescisao',emoji:'📄',eyebrow:c.n,big:'CONTRATO RESCINDIDO',title:`Você foi preso e o ${c.n} rescindiu seu contrato na hora. Agora você está sem clube.`,lines:['Salário cortado','Nenhum clube liga enquanto você estiver preso','Quando sair, só clubes menores vão te querer']})}}catch(e){}};
// ao sair da prisão o clube rescinde e você fica sem clube
function prisonRelease(){if(S.prisonClub&&!S.prisonFired){S.prisonFired=S.prisonClub;S.contract=0;S.wage=0}S.prisonClub=null;const PC=S.prisonFired;if(!PC||S.foragido)return;
 (S.pendingMoments=S.pendingMoments||[]).push({k:'liberdade',emoji:'🔓',eyebrow:'Liberdade',big:'VOCÊ ESTÁ SOLTO',title:'Saiu da prisão sem clube. Seu empresário começou a ligar e alguns clubes menores toparam conversar.',lines:['Os grandes sumiram','Clubes menores interessados','Escolha bem o recomeço']});S.prisonOffers=true}
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

// preso: sem clube, sem proposta, sem janela. Só depois de solto aparecem os clubes menores.
{const _genP=genOffers;genOffers=function(lf){if(inPrison()&&S.prisonFired)return[];return _genP(lf)}}
{const _asP=afterSeason;afterSeason=function(){if(inPrison()&&S.prisonFired&&S.club===S.prisonFired.club&&!S.agreed){toast({ic:'🔒',title:'Sem clube',txt:'Você segue preso. Nenhum clube liga enquanto você estiver lá dentro.',ms:3600});S.agentUses=AGENT_QUOTA[S.agent]||3;return startPreseason()}return _asP()}}
{const _hdP=header;header=function(){let h=_hdP();try{if(S.prisonFired&&S.club===S.prisonFired.club){const c=CLUB[S.club];const tag=inPrison()?'Sem clube · preso':S.agreed&&CLUB[S.agreed.club]?`Sem clube · acertado com ${CLUB[S.agreed.club].n}`:'Sem clube';h=h.replace(`${c.n}${S.loan?' (emprestado)':''} · ${LG[c.l].n}`,esc(tag)).replace(shieldHTML(c),`<span class="flagbox">${NATS[S.nat].f}</span>`)}}catch(e){}return h}}

// ================== COPA DO PAVILHÃO: o campeonato interno do presídio ==================
// Seis times da cadeia em pontos corridos (5 rodadas, uma por semana) e final entre os dois primeiros.
// Seu jogo é no pátio: 2 lances (3 na final). No 3D é chão de barro, colete laranja × colete listrado e policiais em volta.
// Passou a semana sem jogar? A rodada é simulada. Campeão ganha respeito e um jogo a menos de pena.
const PCUP_T=[
 {id:'p4',n:'Pavilhão 4',a:'#ff7a1a',b:'#ff7a1a',s:1.1,me:true},{id:'r2',n:'Raio 2',a:'#f1f1f1',b:'#161616',s:1.55},{id:'ab',n:'Ala B',a:'#2f5fae',b:'#16336e',s:1.25},
 {id:'cz',n:'Cozinha FC',a:'#e8e2d0',b:'#c0392b',s:1.0},{id:'g7',n:'Galeria 7',a:'#2e8b57',b:'#123d26',s:1.35},{id:'sg',n:'Seguro',a:'#8b9096',b:'#3a3d42',s:.9}];
function pcT(id){return PCUP_T.find(t=>t.id===id)}
function pcPois(l){const L=Math.exp(-l);let k=0,p=1;do{k++;p*=Math.random()}while(p>L);return k-1}
function pcIdx(){const C=S.prison&&S.prison.cup;return C?(S.prison.week||0)-C.w0:0}
function pcNew(){const P=S.prison;const ids=PCUP_T.map(t=>t.id);const a=ids.slice();const rounds=[];
 for(let r=0;r<5;r++){const pr=[];for(let i=0;i<3;i++)pr.push(r%2?[a[5-i],a[i]]:[a[i],a[5-i]]);rounds.push(pr);a.splice(1,0,a.pop())}
 S.prisonCupEd=(S.prisonCupEd||0)+1;P.cup={ed:S.prisonCupEd,w0:P.week||0,rounds,res:[],tab:Object.fromEntries(ids.map(id=>[id,{j:0,v:0,e:0,d:0,gp:0,gc:0,pts:0}])),fin:null,done:false,champ:null,myG:0,note:null}}
function pcSorted(){const C=S.prison.cup;return PCUP_T.map(t=>({...t,...C.tab[t.id]})).sort((x,y)=>y.pts-x.pts||(y.gp-y.gc)-(x.gp-x.gc)||y.gp-x.gp||(x.me?-1:y.me?1:0))}
function pcPairs(i){const C=S.prison.cup;if(i<5)return C.rounds[i];if(!C.fin){const s=pcSorted();C.fin=[s[0].id,s[1].id]}return[C.fin]}
function pcStr(id){return id==='p4'?clamp(.9+(S.prison.resp||0)/120+(S.ovr-60)/70,.8,2.2):pcT(id).s}
function pcResolve(i,mine){const P=S.prison,C=P.cup;if(C.res[i])return C.res[i];const out=[];
 for(const [a,b] of pcPairs(i)){const me=a==='p4'||b==='p4';let ga,gb,my=0,pen=null;
  if(me&&mine){const us=a==='p4';ga=us?mine.g:mine.og;gb=us?mine.og:mine.g;my=mine.myG;if(i===5&&ga===gb)pen=(mine.penWin?us:!us)?'a':'b'}
  else{ga=pcPois(pcStr(a)*.95);gb=pcPois(pcStr(b)*.85);if(i===5&&ga===gb)pen=ch(.5)?'a':'b'}
  out.push({a,b,ga,gb,my,pen});
  if(i<5)for(const [x,gx,gy] of[[a,ga,gb],[b,gb,ga]]){const t=C.tab[x];t.j++;t.gp+=gx;t.gc+=gy;if(gx>gy){t.v++;t.pts+=3}else if(gx===gy){t.e++;t.pts++}else t.d++}
  if(me&&!mine){const us=a==='p4';C.note=`Você não entrou em campo na ${i===5?'final':(i+1)+'ª rodada'}: Pavilhão 4 ${us?ga:gb} × ${us?gb:ga} ${pcT(us?b:a).n}.`}}
 C.res[i]=out;C.myG+=out.reduce((s,r)=>s+(r.my||0),0);
 if(i===5){const f=out[0];const w=f.ga>f.gb||(f.ga===f.gb&&f.pen==='a')?f.a:f.b;C.champ=w;C.done=true;
  if(w==='p4'){P.resp=clamp((P.resp||0)+20,0,100);P.left=Math.max(1,P.left-1);S.prisonCups=(S.prisonCups||0)+1;try{blog('🏆',`Campeão da Copa do Pavilhão (${C.ed}ª edição)`)}catch(e){}}}
 return out}
function pcSync(){const P=S.prison;if(!P||!(P.left>0))return;if(!P.cup||(P.cup.done&&pcIdx()>5))pcNew();const k=pcIdx();for(let i=0;i<Math.min(k,6);i++)if(!P.cup.res[i])pcResolve(i,null)}
function pcBadge(t,big){const st=t.id!=='p4';return`<span class="pcb ${big?'big':''}" style="--a:${t.a};--b:${t.b}" data-s="${st?1:0}"></span>`}
function pcHTML(){const P=S.prison,C=P.cup;if(!C)return'';const i=pcIdx();const sorted=pcSorted();const myPair=i<=5?pcPairs(i).find(([a,b])=>a==='p4'||b==='p4'):null;const r=C.res[i];
 const stage=i<5?`Rodada ${i+1} de 5`:i===5?'Final':'Encerrada';
 let main='';
 if(i<=5&&myPair&&!r){const opp=pcT(myPair[0]==='p4'?myPair[1]:myPair[0]);main=`<div class="pc-m"><div class="pc-t">${pcBadge(pcT('p4'),1)}<b>Pavilhão 4</b><small>colete laranja</small></div><span class="pc-x">×</span><div class="pc-t">${pcBadge(opp,1)}<b>${esc(opp.n)}</b><small>colete listrado</small></div></div>
  <button class="btn wide pc-go" id="pcGo">⚽ ${i===5?'Jogar a final':'Jogar no pátio'}</button><p class="pc-note">${i===5?'Três lances valendo a taça.':'Dois lances. Se passar a semana sem jogar, o jogo é simulado.'}</p>`}
 else if(r){const m=r.find(x=>x.a==='p4'||x.b==='p4');if(m){const us=m.a==='p4';const g=us?m.ga:m.gb,og=us?m.gb:m.ga;const opp=pcT(us?m.b:m.a);const w=g>og||(g===og&&m.pen===(us?'a':'b'));
   main=`<div class="pc-done ${w?'w':g===og?'e':'l'}"><b>${w?(i===5?'CAMPEÃO!':'Vitória'):g===og?'Empate':'Derrota'}</b><span class="mono">Pavilhão 4 ${g} × ${og} ${esc(opp.n)}${m.pen?' (pên.)':''}</span><small>${m.my?`${m.my} gol${m.my>1?'s':''} seu${m.my>1?'s':''}`:'Você não marcou'} · próxima rodada na semana que vem</small></div>`}
  else if(i===5){const f=r[0];main=`<div class="pc-done e"><b>Final sem o Pavilhão 4</b><span class="mono">${esc(pcT(f.a).n)} ${f.ga} × ${f.gb} ${esc(pcT(f.b).n)}</span><small>Campeão: ${esc(pcT(C.champ).n)}</small></div>`}}
 else if(i===5&&!myPair){const f=pcPairs(5)[0];main=`<div class="pc-done e"><b>Seu time ficou fora da final</b><span class="mono">${esc(pcT(f[0]).n)} × ${esc(pcT(f[1]).n)}</span><small>A final é nesta semana.</small></div>`}
 if(C.done&&C.champ==='p4')main=`<div class="pc-champ"><span>🏆</span><div><b>Campeão da Copa do Pavilhão</b><small>+20 de respeito e um jogo a menos de pena. Nova edição na semana que vem.</small></div></div>`+main;
 const last=C.res.length?C.res[C.res.length-1]:null;const li=C.res.length-1;
 return`<section class="pcup"><div class="pc-h"><span class="pc-tr">🏆</span><div><b>Copa do Pavilhão</b><small>${C.ed}ª edição · ${stage}</small></div><span class="chip">${S.prisonCups?`${S.prisonCups} título${S.prisonCups>1?'s':''}`:'Valendo respeito'}</span></div>
  ${C.note?`<p class="pc-warn">${esc(C.note)}</p>`:''}${main}
  <table class="pc-tab"><thead><tr><th>#</th><th>Time</th><th>J</th><th>SG</th><th>P</th></tr></thead><tbody>${sorted.map((t,k)=>`<tr class="${t.me?'me':''} ${k<2?'fin':''}"><td class="mono">${k+1}</td><td>${pcBadge(t)} ${esc(t.n)}</td><td class="mono">${t.j}</td><td class="mono">${t.gp-t.gc>0?'+':''}${t.gp-t.gc}</td><td class="mono"><b>${t.pts}</b></td></tr>`).join('')}</tbody></table>
  ${last?`<div class="pc-res"><small>${li===5?'Final':`${li+1}ª rodada`}</small>${last.map(x=>`<div class="${x.a==='p4'||x.b==='p4'?'me':''}"><span>${esc(pcT(x.a).n)}</span><b class="mono">${x.ga} × ${x.gb}${x.pen?' p':''}</b><span>${esc(pcT(x.b).n)}</span></div>`).join('')}</div>`:''}
  <p class="pc-foot">Os dois primeiros fazem a final · Seus gols na copa: <b>${C.myG}</b></p></section>`}
async function pcPlay(){const P=S.prison;pcSync();const C=P.cup;const i=pcIdx();if(i>5||C.res[i])return;const pair=pcPairs(i).find(([a,b])=>a==='p4'||b==='p4');if(!pair)return;
 const opp=pcT(pair[0]==='p4'?pair[1]:pair[0]);let myG=0,ast=0;const N=i===5?3:2;const sk=clamp(.5+(S.ovr-60)/90+(S.life&&S.life.corpo?(S.life.corpo-50)/400:0),.35,.9);
 for(let k=0;k<N;k++){const kind=pick(['finish','dribble','finish','pass']);const r=await nssMoment({kind,comp:'Copa do Pavilhão',env:'prison',title:k===0?`${i===5?'Final':(i+1)+'ª rodada'} · Pavilhão 4 × ${opp.n}`:k===N-1?'Último lance':'Mais um lance',skill:sk,keeper:.3+opp.s*.08,planned:true,min:k===0?RI(4,35):k===N-1?RI(70,89):RI(40,65)});
  if(r&&r.ok){if(kind==='pass')ast++;else myG++}}
 const g=myG+ast+pcPois(.35+(P.resp||0)/220),og=pcPois(opp.s*.85);let penWin=null;
 if(i===5&&g===og){const r=await nssMoment({kind:'pen',comp:'Copa do Pavilhão',env:'prison',title:'Final empatada: pênalti decisivo',skill:sk,keeper:.4,planned:true});penWin=!!(r&&r.ok)}
 C.note=null;pcResolve(i,{g,og,myG,penWin});const w=g>og||(g===og&&penWin);
 const dr=w?(i===5?0:4):g===og?1:-2;P.resp=clamp((P.resp||0)+dr+myG*2,0,100);const chips=applyFx(w?{cab:3}:g===og?{}:{cab:-2});if(dr+myG*2)chips.unshift([`${dr+myG*2>0?'+':'−'}${Math.abs(dr+myG*2)} Respeito`,dr+myG*2>0?'up':'down']);
 if(i===5&&w)chips.unshift(['🏆 Campeão','up'],['−1 jogo de pena','up']);
 try{await blResult({ic:w?(i===5?'🏆':'⚽'):g===og?'🤝':'😤',title:w?(i===5?'Campeão da Copa do Pavilhão!':'Vitória no pátio'):g===og?'Empate no pátio':'Derrota no pátio',txt:`Pavilhão 4 ${g} × ${og} ${opp.n}${g===og&&i===5?' (decidido no pênalti)':''}. ${myG?`Você fez ${myG}.`:'Você não marcou.'}${ast?` ${ast} assistência${ast>1?'s':''}.`:''}`,chips})}catch(e){}
 renderPrison()}
{const _rp=renderPrison;renderPrison=function(...a){try{pcSync()}catch(e){console.error(e)}const r=_rp.apply(this,a);try{
  const ph=$app.querySelector('.jph .ph-in');if(ph&&!ph.querySelector('.menu'))ph.insertAdjacentHTML('afterbegin','<button class="menu" onclick="askHome()" aria-label="Sair para o início"><span class="mi">‹</span><span class="ml">Sair</span></button>');
  const jh=$app.querySelector('.jwrap > .jhead'),ja=$app.querySelector('.jwrap > .jacts');
  if(jh&&ja&&S.prison.cup){const g=document.createElement('div');g.className='jgrid';jh.before(g);const ca=document.createElement('div');ca.className='jcol';ca.append(jh,ja);g.insertAdjacentHTML('beforeend',pcHTML());g.append(ca);
   const b=document.getElementById('pcGo');if(b)b.onclick=()=>{b.disabled=true;pcPlay().catch(e=>{console.error(e);renderPrison()})}}}catch(e){console.error(e)}return r}}
{const st=document.createElement('style');st.textContent=`
body.jail .ph .menu{margin-right:8px}@media (max-width:699px){body.jail .jph .jbadge{display:none}}
.jgrid{display:grid;gap:12px;align-items:start}.jcol{display:grid;gap:10px;align-content:start}
.pcup{display:grid;gap:10px;padding:14px;border-radius:16px;background:linear-gradient(180deg,#3f3a33,#302d29);border:1px solid #6a5a45;box-shadow:inset 0 3px 0 #ff7a1a}
.pc-h{display:flex;align-items:center;gap:10px}.pc-h>div{display:grid;flex:1}.pc-h b{font:900 italic 22px/1 var(--f-display);text-transform:uppercase}.pc-h small{color:#c9b8a3;font-size:12.5px}.pc-tr{font-size:30px}
.pcb{display:inline-block;width:14px;height:14px;border-radius:50%;vertical-align:-2px;background:var(--a);border:2px solid #1d1c1a}.pcb[data-s="1"]{background:repeating-linear-gradient(0deg,var(--a) 0 3px,var(--b) 3px 6px)}
.pcb.big{width:44px;height:44px;border-width:3px}.pcb.big[data-s="1"]{background:repeating-linear-gradient(0deg,var(--a) 0 6px,var(--b) 6px 12px)}
.pc-m{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px;padding:12px 8px;border-radius:14px;background:radial-gradient(90% 120% at 50% 100%,rgba(181,108,60,.55),transparent 70%),#2a2724;border:1px solid #5a5045}
.pc-t{display:grid;justify-items:center;gap:4px;text-align:center}.pc-t b{font-size:15px}.pc-t small{font-size:11.5px;color:#c9b8a3}.pc-x{font:900 italic 26px var(--f-display);color:#ffb27a}
.pc-go{background:linear-gradient(180deg,#ff8a2a,#e0661a)!important;color:#1d0c02!important}.pc-note{margin:-2px 0 0;font-size:12.5px;color:#c9b8a3;text-align:center}
.pc-done{display:grid;gap:3px;padding:10px 12px;border-radius:12px;background:#2a2724;border-left:4px solid #8b9096}.pc-done.w{border-color:var(--good)}.pc-done.l{border-color:var(--bad)}.pc-done b{font:900 italic 20px var(--f-display);text-transform:uppercase}.pc-done small{color:#c9b8a3}
.pc-champ{display:flex;gap:12px;align-items:center;padding:12px;border-radius:12px;background:linear-gradient(90deg,rgba(242,196,67,.25),transparent);border:1px solid var(--gold)}.pc-champ>span{font-size:38px}.pc-champ div{display:grid}.pc-champ b{color:var(--gold);font-size:16px}.pc-champ small{color:#e6dcc8}
.pc-warn{margin:0;padding:8px 10px;border-radius:10px;background:rgba(255,90,74,.12);border:1px solid rgba(255,90,74,.4);font-size:13px}
.pc-tab{width:100%;border-collapse:collapse;font-size:13.5px}.pc-tab th{font:600 11.5px var(--f-body);color:#c9b8a3;text-align:left;padding:4px 6px;border-bottom:1px solid #5a5045}.pc-tab th:nth-child(n+3),.pc-tab td:nth-child(n+3){text-align:right}
.pc-tab td{padding:6px;border-bottom:1px solid rgba(255,255,255,.06)}.pc-tab tr.fin td:first-child{box-shadow:inset 3px 0 0 #ffb27a}.pc-tab tr.me td{background:rgba(255,122,26,.16);font-weight:800}
.pc-res{display:grid;gap:4px}.pc-res small{color:#c9b8a3;font-size:12px}.pc-res div{display:grid;grid-template-columns:1fr auto 1fr;gap:8px;font-size:13px;padding:4px 8px;border-radius:8px;background:rgba(0,0,0,.18)}.pc-res div span:last-child{text-align:right}.pc-res div.me{background:rgba(255,122,26,.16)}
.pc-foot{margin:0;font-size:12.5px;color:#c9b8a3}
@media (min-width:700px){.jwrap{max-width:none!important;padding-left:24px!important;padding-right:24px!important}.jgrid{grid-template-columns:minmax(0,1fr) minmax(0,1.1fr)}.jgrid>.pcup{order:2}.jacts{grid-template-columns:repeat(2,minmax(0,1fr))!important}.jcell{height:230px}}
@media (min-width:1100px){.jwrap{padding-left:32px!important;padding-right:32px!important}.jgrid{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}}
`;document.head.appendChild(st)}
