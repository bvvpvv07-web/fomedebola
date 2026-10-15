// ================== PENEIRA ==================
const PEN={};
const VENUES={
 grande:{n:'Peneira de clube grande',d:'Centenas de garotos e poucas vagas. Se brilhar, os gigantes te querem.',diff:8,tier:.85,crowd:'300 garotos, 4 vagas'},
 regional:{n:'Peneira regional',d:'Clubes médios assistindo. Equilíbrio entre chance e concorrência.',diff:0,tier:.5,crowd:'120 garotos, 10 vagas'},
 festival:{n:'Festival de escolinhas',d:'Vários olheiros, menos pressão. Mais fácil aparecer, mas os clubes são menores.',diff:-8,tier:.22,crowd:'Muitos olheiros de clubes pequenos'},
};
const FOCUS={
 fisico:{n:'Físico',d:'Academia, tiros e resistência',attrs:['VEL','FIS']},
 tecnica:{n:'Técnica',d:'Fundamentos, passe e finalização',attrs:S0=>S0.pos==='GOL'?['REF','PAS']:['FIN','DRI','PAS']},
 mental:{n:'Cabeça',d:'Leitura de jogo, calma e liderança',attrs:['MEN','DEF']},
};
function penShell(inner){
 $app.innerHTML=`<header class="ph"><div class="ph-in"><span class="flagbox">${NATS[S.nat].f}</span><div class="who"><b>${esc(S.name)} <span style="color:var(--muted);font-weight:600">#${S.num}</span></b><span>15 anos · ${POS[S.pos].n} · sem clube</span></div><div class="ovr"><b class="mono">${S.ovr}</b><small>OVR</small></div></div></header>
 <div class="wrap">${journeyHTML('ob',2,PEN.step===0?'Escolha onde fazer a peneira. Depois são 5 etapas rápidas até os olheiros decidirem.':'Cada etapa mexe na impressão dos olheiros. Quanto mais alta, melhores os clubes.')}${PEN.step>0?`<div class="penprog">${['Local','Preparação','Teste físico','Jogo-treino','Pênalti','Olheiros'].map((t,i)=>`<span class="${i<PEN.step?'done':i===PEN.step?'on':''}">${t}</span>`).join('')}</div>
 <section class="card penscore"><div class="eyebrow">Impressão dos olheiros</div><div class="pbar"><i style="width:${clamp(PEN.score,0,100)}%"></i></div><b class="mono">${Math.round(PEN.score)}</b></section>`:''}${inner}</div>`;
 scrollTo(0,0);
}
function penLog(txt,delta){PEN.log.push({txt,delta});PEN.score=clamp(PEN.score+delta,0,100)}
function startPeneira(){PEN.step=0;PEN.score=40+(S.pot-75)*.9;PEN.log=[];PEN.venue=null;renderPeneira()}
function renderPeneira(){
 const st=PEN.step;
 if(st===0){
  penShell(`<section class="card" style="display:grid;gap:12px"><h2 class="h2">Onde você vai fazer a peneira?</h2>
  <p class="muted" style="margin:0;max-width:58ch">Você tem 15 anos e uma chuteira emprestada do primo. O que acontecer nos próximos dias decide quem vai te querer.</p>
  <div class="behs">${Object.entries(VENUES).map(([k,v])=>`<button class="beh" data-v="${k}"><b>${v.n}</b><span>${v.d}</span><span class="mono" style="display:block;margin-top:6px;color:var(--gold);font-size:11px">${v.crowd}</span></button>`).join('')}</div></section>`);
  $app.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>{PEN.venue=b.dataset.v;PEN.score-=VENUES[PEN.venue].diff*.4;PEN.step=1;renderPeneira()});return;
 }
 if(st===1){
  penShell(`<section class="card" style="display:grid;gap:12px"><div class="eyebrow">Três semanas antes</div><h2 class="h2">Como você se prepara?</h2>
  <p class="muted" style="margin:0">Seu treinador da escolinha monta um plano. Isso muda seus atributos de verdade.</p>
  <div class="behs">${Object.entries(FOCUS).map(([k,v])=>{const at=typeof v.attrs==='function'?v.attrs(S):v.attrs;return`<button class="beh" data-f="${k}"><b>${v.n}</b><span>${v.d}</span><span class="mono" style="display:block;margin-top:6px;color:var(--good);font-size:11px">+ ${at.map(a=>ATTR_NAME[a]).join(', ')}</span></button>`}).join('')}</div></section>`);
  $app.querySelectorAll('[data-f]').forEach(b=>b.onclick=()=>{const v=FOCUS[b.dataset.f];const at=typeof v.attrs==='function'?v.attrs(S):v.attrs;const gains=[];
   for(const a of at){const g=RI(1,3);S.attrs[a]=clamp(S.attrs[a]+g,10,99);gains.push(`+${g} ${ATTR_NAME[a]}`)}
   const old=S.ovr;const nf=fit(S.attrs,S.pos);S.pot=clamp(S.pot+Math.round((nf-fit({...S.attrs,...Object.fromEntries(at.map(a=>[a,S.attrs[a]-1]))},S.pos))*.5),40,99);S.ovr=clamp(S.ovr+(ch(.6)?1:0),40,80);
   PEN.prep=gains;penLog(`Preparação de ${v.n.toLowerCase()}: ${gains.join(', ')}`,RI(2,5));PEN.step=2;renderPeneira()});return;
 }
 if(st===2){
  const gk=S.pos==='GOL';
  penShell(`<section class="card ev"><div class="row"><span class="tag campo">Decisão 1</span><span class="eyebrow">Dia da peneira · 8h da manhã</span></div>
  <h2>${gk?'O teste dos goleiros':'O teste de velocidade'}</h2><p>${gk?'Vinte goleiros, um só treinador de goleiros. Ele chuta forte, cruzado, e você está no fim da fila.':'Tiros de 30 metros. Você está na última bateria e o garoto do lado é o mais rápido da peneira.'}</p>
  <div class="choices">${(gk?[['Pedir pra ir primeiro e mostrar personalidade','a'],['Esperar e estudar os chutes dele','b'],['Pular em tudo, até nas bolas impossíveis','c']]:[['Sair com tudo desde a largada','a'],['Correr no seu ritmo e guardar energia pro jogo','b'],['Tirar a chuteira emprestada e correr descalço','c']]).map(([t,k])=>`<button class="choice" data-c="${k}"><span>${t}</span><span class="arrow">→</span></button>`).join('')}</div><div id="res"></div></section>`);
  $app.querySelectorAll('.choice').forEach(b=>b.onclick=async()=>{$app.querySelectorAll('.choice').forEach(x=>x.disabled=true);b.classList.add('picked');document.getElementById('res').innerHTML='<div class="suspense"><i></i><i></i><i></i></div>';await sleep(900);
   const k=b.dataset.c;const sp=(gk?CA().REF:CA().VEL)-70;let txt,d;
   if(k==='a'){if(ch(clamp(.5+sp/60,.15,.9))){txt=gk?'Duas defesas seguidas. O treinador de goleiros parou de chutar e anotou seu nome.':'Venceu a bateria com folga. Os olheiros cutucaram um ao outro.';d=RI(9,14)}else{txt=gk?'Levou um frango no primeiro chute. Silêncio.':'Sentiu a coxa no fim da corrida. Vai jogar no sacrifício.';d=-RI(4,8);S.life.corpo=clamp(S.life.corpo-6,0,100)}}
   else if(k==='b'){txt=gk?'Você leu o padrão dos chutes e fez as defesas mais bonitas da manhã.':'Tempo mediano, mas chegou inteiro pro jogo-treino.';d=gk?RI(5,9):RI(2,5);PEN.fresh=true}
   else{if(ch(.4)){txt=gk?'Voou no ângulo numa bola que ninguém pegaria. Aplausos dos pais na grade.':'Todo mundo riu, até você cruzar a linha em primeiro.';d=RI(10,16);S.life.fama=clamp(S.life.fama+3,0,100)}else{txt=gk?'Bateu a cabeça na trave. Ficou tonto mas seguiu.':'Cortou o pé numa pedra no campo de terra.';d=-RI(5,9)}}
   penLog(txt,d);document.getElementById('res').innerHTML=`<div class="outcome"><p>${esc(txt)}</p><div class="chipsrow"><span class="chip ${d>=0?'up':'down'}">${d>=0?'+':''}${d} impressão</span></div></div><button class="btn wide" id="nx" style="margin-top:12px">Continuar</button>`;
   document.getElementById('nx').onclick=()=>{PEN.step=3;renderPeneira()}});return;
 }
 if(st===3){
  penShell(`<section class="card" style="display:grid;gap:12px"><div class="eyebrow">Jogo-treino · 30 minutos</div><h2 class="h2">Colete laranja contra colete azul</h2>
  <p class="muted" style="margin:0">Você começa jogando. Os olheiros estão na arquibancada de madeira com pranchetas. No meio do jogo, um lance vai ser seu.</p>
  <button class="btn wide" id="go">Entrar em campo</button></section>`);
  document.getElementById('go').onclick=peneiraMatch;return;
 }
 if(st===4){
  penShell(`<section class="card" style="display:grid;gap:12px"><div class="eyebrow">Fim do jogo-treino</div><h2 class="h2">"Vem cá, ${esc(S.name.split(' ')[0])}."</h2>
  <p class="muted" style="margin:0">${S.pos==='GOL'?'O coordenador escolhe o melhor batedor da peneira e manda você pro gol. Um pênalti, valendo a vaga.':'O coordenador coloca a bola na marca. Um pênalti, pra ver se você treme quando vale alguma coisa.'}</p>
  <button class="btn wide" id="go">${S.pos==='GOL'?'Ir pro gol':'Pegar a bola'}</button></section>`);
  document.getElementById('go').onclick=async()=>{
   const us={id:'pen_a',n:'Colete laranja',c1:'#ff7a2b',c2:'#151515',a:'LAR'},them={id:'pen_b',n:'Colete azul',c1:'#2f6fd6',c2:'#ffffff',a:'AZU'};
   const r=await IO_UI.penalty({mode:S.pos==='GOL'?'save':'shoot',comp:'Peneira',min:30,us,them,taker:'O melhor batedor da peneira'});
   const good=S.pos==='GOL'?!r.goal:r.goal;const d=good?RI(10,15):-RI(6,10);
   penLog(S.pos==='GOL'?(good?'Pegou o pênalti decisivo da peneira.':'Tomou o gol no pênalti da peneira.'):(good?'Converteu o pênalti com frieza.':'Perdeu o pênalti na frente dos olheiros.'),d);
   PEN.step=5;renderPeneira()};return;
 }
 if(st===5)return peneiraResult();
}
async function peneiraMatch(){
 const us={id:'pen_a',n:'Colete laranja',c1:'#ff7a2b',c2:'#151515',a:'LAR'},them={id:'pen_b',n:'Colete azul',c1:'#2f6fd6',c2:'#ffffff',a:'AZU'};
 const keep=S.liveSpeed;S.liveSpeed=keep===0?3:keep;
 const live=await IO_UI.live.start({o:{comp:'Peneira',label:'Jogo-treino'},us,them,home:true,neutral:true});
 let gu=0,gt=0;const gk=S.pos==='GOL';
 const filler=[[5,{t:'c',us:true,w:fakeName()}],[9,{t:'c',us:false,w:fakeName()}],[13,{t:'c',us:true,mine:true,w:S.name}]];
 for(const[m,e]of filler){await live.until(m);await live.event({...e,m},gu,gt)}
 await live.until(18);live.flash('O lance é seu…');await sleep(900);
 // Decisão 2
 const opts=gk?[['Sair do gol com tudo','out',.42+(CA().VEL-65)/120],['Esperar e fechar o ângulo','wait',.38+(CA().REF-65)/110],['Gritar com a zaga e posicionar','talk',.5+(CA().MEN-65)/140]]
  :[['Chutar de primeira','shoot',.3+(CA().FIN-65)/90],['Driblar o zagueiro e entrar na área','dribble',.28+(CA().DRI-65)/90],['Tocar pro companheiro livre','pass',.42+(CA().PAS-65)/120]];
 const pickD=await new Promise(res=>{$ov.hidden=false;$ov.innerHTML=`<div class="ovwrap ev" style="text-align:left"><div class="row"><span class="tag campo">Decisão 2</span><span class="eyebrow">18' · jogo-treino</span></div>
  <h2 class="pkh" style="text-align:left">${gk?'Contra-ataque! O atacante deles sai cara a cara':'A bola sobra pra você na entrada da área'}</h2><p class="muted">${gk?'Seu zagueiro escorregou. Os olheiros levantam da cadeira.':'Um zagueiro na frente, um companheiro livre na esquerda, o goleiro adiantado.'}</p>
  <div class="choices">${opts.map((o,i)=>`<button class="choice" data-i="${i}"><span>${o[0]}</span><span class="arrow">→</span></button>`).join('')}</div></div>`;
  $ov.querySelectorAll('[data-i]').forEach(b=>b.onclick=()=>res(+b.dataset.i))});
 const[lbl,key,p]=opts[pickD];const ok=ch(clamp(p,.12,.85));
 live.redraw();
 let d;
 if(gk){if(ok){await live.event({t:'psave',us:false,w:fakeName(),m:18,mine:true},gu,gt);d=RI(10,15)}else{gt++;await live.event({t:'g',us:false,w:fakeName(),m:18},gu,gt);d=-RI(5,8)}}
 else{if(ok){gu++;await live.event({t:'g',us:true,mine:key!=='pass',ast:key==='pass',w:key==='pass'?fakeName():S.name,m:18},gu,gt);d=key==='dribble'?RI(13,18):RI(9,13)}else{await live.event({t:'c',us:true,mine:true,w:S.name,m:18},gu,gt);d=-RI(4,7)}}
 penLog(gk?(ok?`Lance decisivo (${lbl.toLowerCase()}): salvou o gol.`:`Lance decisivo (${lbl.toLowerCase()}): levou o gol.`):(ok?`Lance decisivo (${lbl.toLowerCase()}): ${key==='pass'?'assistência':'gol'}!`:`Lance decisivo (${lbl.toLowerCase()}): não deu certo.`),d);
 for(const[m,e]of[[23,{t:'c',us:false,w:fakeName()}],[27,{t:'c',us:true,w:fakeName()}]]){await live.until(m);await live.event({...e,m},gu,gt)}
 if(!gk&&ch(.3+(CA().FIN-70)/100)){await live.until(29);gu++;await live.event({t:'g',us:true,mine:true,w:S.name,m:29},gu,gt);penLog('Ainda fez mais um no fim do jogo-treino.',RI(4,7))}
 await live.until(30);
 await live.finish({msg:d>0?'Os olheiros anotaram seu nome.':'Os olheiros cochicham entre si.',win:d>0?true:null});
 S.liveSpeed=keep;PEN.step=4;renderPeneira();
}
function peneiraResult(){
 const V=VENUES[PEN.venue];const nat=NATS[S.nat];const home=countryClubs(nat.home).sort((a,b)=>b.s-a.s);
 const sc=PEN.score;const tgt=clamp(V.tier+(sc-50)/90,0,1);
 const idx=Math.round((1-tgt)*(home.length-1));
 const band=home.slice(Math.max(0,idx-6),Math.min(home.length,idx+6));
 let scouts=shuffle(band).slice(0,5);
 if(sc>=82&&COUNTRY[nat.home].conf!=='EU'){const eu=shuffle(CLUBS.filter(x=>COUNTRY[x.country].conf==='EU'&&x.s>=78));scouts.push(eu[0])}
 if(S.heart&&CLUB[S.heart]&&CLUB[S.heart].country===nat.home&&!scouts.find(x=>x.id===S.heart))scouts.push(CLUB[S.heart]);
 scouts=scouts.slice(0,6);
 const want=c=>{const need=55+(c.s-home[Math.round(home.length/2)].s)*1.6+V.diff*.3;return sc+randn()*8>=need};
 let res=scouts.map(c=>({c,ok:want(c)}));
 if(!res.some(r=>r.ok)){const small=home.slice(-8);res.push({c:pick(small),ok:true})}
 PEN.interested=res.filter(r=>r.ok).sort((a,b)=>b.c.s-a.c.s).slice(0,3).map(r=>r.c);
 if(sc>=75)S.pot=clamp(S.pot+1,40,99);
 penShell(`<section class="card" style="display:grid;gap:12px"><div class="eyebrow">O resultado da peneira</div><h2 class="h2">Quem te quer?</h2>
 <div class="lines">${PEN.log.map(l=>`<div class="line"><span style="white-space:normal">${esc(l.txt)}</span><span class="r" style="color:${l.delta>=0?'var(--good)':'var(--bad)'}">${l.delta>=0?'+':''}${l.delta}</span></div>`).join('')}</div>
 <div class="eyebrow" style="margin-top:6px">Olheiros presentes</div>
 <div class="scouts">${res.map((r,i)=>`<div class="scout" style="animation-delay:${.4+i*.45}s">${shieldHTML(r.c)}<div class="info"><b>${esc(r.c.n)}</b><span>${esc(LG[r.c.l].n)}</span></div><span class="verdict ${r.ok?'ok':'no'}" style="animation-delay:${.7+i*.45}s">${r.ok?'Interessado':'Não dessa vez'}</span></div>`).join('')}</div>
 <button class="btn wide" id="go" style="animation:pop .4s ${.9+res.length*.45}s both">Ver as propostas</button></section>`);
 document.getElementById('go').onclick=()=>renderAcademy();
}
// propostas da base vindas da peneira
academyOffers=function(){
 const list=(PEN.interested&&PEN.interested.length?PEN.interested:null);
 if(!list){const nat=NATS[S.nat];const home=countryClubs(nat.home).sort((a,b)=>b.s-a.s);return shuffle(home.slice(5,25)).slice(0,3).map(x=>({club:x.id,years:3,wage:Math.max(1,Math.round(wageFor(x,S.ovr)*.6)),role:'Base',academy:true}))}
 return list.map(x=>({club:x.id,years:3,wage:Math.max(1,Math.round(wageFor(x,S.ovr)*.5)),role:'Base',academy:true,heart:x.id===S.heart}));
};

// ================== MARCOS (estreia, promoção) ==================
function milestoneUI(m){
 return new Promise(res=>{
  $ov.hidden=false;const c=club();
  $ov.innerHTML=`<div class="ovwrap celeb"><div class="rays"></div><div class="eyebrow">${m.k==='debut'?'Um dia pra nunca esquecer':'Base concluída'}</div>
  <div class="tro-stage" style="height:min(200px,30vh)"><div class="jersey rise" style="--c1:${c.c1};--c2:${c.c2}"><svg viewBox="0 0 120 120"><path d="M38 14l22 8 22-8 26 16-12 22-12-6v60H36V46l-12 6-12-22z" fill="${c.c1}" stroke="${c.c2}" stroke-width="3"/><text x="60" y="84" text-anchor="middle" font-family="Saira Condensed,Arial Narrow,sans-serif" font-weight="900" font-size="38" fill="${c.c2}">${S.shirt}</text></svg></div><div class="plinth"></div></div>
  <h2 class="champ" style="font-size:40px">${esc(m.title)}</h2><div class="cname">${esc(m.sub||'')}</div>
  <div class="lines" style="margin:12px 0">${(m.lines||[]).map(l=>`<div class="line"><span>${esc(l)}</span></div>`).join('')}</div>
  <button class="btn wide" id="celOk">Continuar</button></div>`;
  confetti($ov,clubColors(S.club),3200);
  document.getElementById('celOk').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res()};
 });
}
IO_UI.milestone=milestoneUI;

// ================== CARD DO PROSPECTO ==================
let PROSPECT_OPEN=false;
function starRow(v){let s='';for(let i=1;i<=5;i++)s+=v>=i?'<i>★</i>':v>=i-.5?'<i class="hs">★</i>':'<i class="es">★</i>';return s}
function prospectCard(){
 const pr=prospectRank();const me=club();
 const P=POS[S.pos];const ws=Object.entries(P.w).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
 const strong=ATTRS.filter(k=>ws.includes(k)).sort((a,b)=>S.attrs[b]-S.attrs[a]).slice(0,2);
 const weak=ws.slice(0,4).sort((a,b)=>S.attrs[a]-S.attrs[b])[0];
 const unc=Math.max(2,6-(S.st&&S.st.log?Math.floor(S.st.log.filter(r=>r.me&&r.me.play).length/4):0));
 const lo=clamp(S.pot-unc,S.ovr,99),hi=clamp(S.pot+Math.ceil(unc/2),S.ovr,99);
 const stars=prospectStars(S.pot);
 const tag=pr.rank<=3?'Joia rara':pr.rank<=10?'Top 10 do país':pr.rank<=25?'Promessa':'Em observação';
 const top=pr.list.slice(0,10);if(pr.rank>10)top.push(pr.list[pr.rank-1]);
 return`<section class="card prospect">
  <div class="row" style="justify-content:space-between"><span class="eyebrow">Prospecto · relatório dos olheiros</span><span class="chip gold">${tag}</span></div>
  <div class="prgrid">
   <div class="prrank"><b>#${pr.rank}</b><span>de ${pr.total} no ${esc(COUNTRY[me.country].n||me.country)}</span></div>
   <div class="prinfo"><div class="prstars" title="${stars} estrelas">${starRow(stars)}</div>
    <div class="muted" style="font-size:13.5px">Potencial estimado <b style="color:var(--chalk)">${lo}–${hi}</b> · hoje ${S.ovr}</div>
    <div class="chipsrow" style="margin-top:6px">${strong.map(k=>`<span class="chip up">+ ${ATTR_NAME[k]}</span>`).join('')}${weak&&!strong.includes(weak)?`<span class="chip down">− ${ATTR_NAME[weak]}</span>`:''}</div></div>
  </div>
  <button class="btn ghost small" id="prRank">${PROSPECT_OPEN?'Fechar ranking':'Ver ranking de prospectos'}</button>
  ${PROSPECT_OPEN?`<div class="prlist">${top.map(x=>{const i=pr.list.indexOf(x)+1;return`<div class="prrow ${x.me?'me':''}"><b class="mono">${i}</b>${shieldHTML(CLUB[x.club],'sm')}<div class="nomtxt"><b>${esc(x.n)}</b><span>${x.pos} · ${x.age} anos · ${esc(CLUB[x.club].n)} ${x.me?'':esc(ysuf(x.club))}</span></div><span class="prstars sm">${starRow(prospectStars(x.pot))}</span></div>`}).join('')}</div>
  <div class="muted" style="font-size:12.5px">O ranking muda com suas notas na base. Os prospectos rivais aparecem nos jogos da base.</div>`:''}
 </section>`;
}
