// ================== CONTA, SALVAMENTO, COMPARTILHAMENTO ==================
const CLOUD={trophies:{},db:null,user:null,assets:null,uid:null,me:null,owner:false,ready:false,badges:{},screen:'home'};
const newId=()=>'c'+Date.now().toString(36)+Math.floor(Math.random()*1e6).toString(36);
async function initCloud(){
 try{
  if(typeof WEB_CFG!=='undefined'){CLOUD.web=true;CLOUD.db=makeWebDb()}
  else if(window.claude&&window.claude.use){
   const[db,user,assets]=await Promise.all([claude.use('db'),claude.use('user'),claude.use('assets')]);
   CLOUD.db=db;CLOUD.user=user;CLOUD.assets=assets;
   if(user){CLOUD.uid=await user.id();CLOUD.me=await user.me();CLOUD.owner=await user.isOwner()}
   if(db){try{db.doc('config/trophies').onSnapshot(s=>{CLOUD.trophies=(s.exists&&s.data().map)||{}},()=>{})}catch(e){}}
   if(db){try{db.doc('config/badges').onSnapshot(s=>{CLOUD.badges=(s.exists&&s.data().map)||{};if(['home','careers','ranking','account'].includes(CLOUD.screen))rerenderNav()},()=>{})}catch(e){}}
  }
 }catch(e){}
 CLOUD.ready=true;rerenderNav();
}
const online=()=>!!(CLOUD.db&&CLOUD.uid);
function rerenderNav(){const s=CLOUD.screen;if(s==='home')renderIntro();else if(s==='careers')renderCareers();else if(s==='ranking')renderRanking();else if(s==='account')renderAccount()}

// ---------- salvar / carregar ----------
const LOCAL_IDX='fdb3_index';
function localIndex(){try{return JSON.parse(localStorage.getItem(LOCAL_IDX)||'{}')}catch(e){return{}}}
function localSet(cid,body){try{localStorage.setItem('fdb3_'+cid,JSON.stringify(body));const ix=localIndex();ix[cid]=body.meta;localStorage.setItem(LOCAL_IDX,JSON.stringify(ix))}catch(e){}}
function localGet(cid){try{return JSON.parse(localStorage.getItem('fdb3_'+cid)||'null')}catch(e){return null}}
function localDel(cid){try{localStorage.removeItem('fdb3_'+cid);const ix=localIndex();delete ix[cid];localStorage.setItem(LOCAL_IDX,JSON.stringify(ix))}catch(e){}}
function buildBody(phase){
 S.phase=phase;S.pauseId=PAUSE?PAUSE.id:null;
 const data=JSON.stringify({v:3,S,W,clubs:CLUBS.map(c=>[c.id,c.l,Math.round(c.s*10)/10]),req:REQ,renew:RENEW,renewMsg:RENEW_MSG});
 const c=S.club?CLUB[S.club]:null;const L=S.done?legacy():null;
 return{meta:{cid:S.cid,name:S.name,nat:S.nat,pos:S.pos,age:S.age,club:c?c.n:'',ovr:S.ovr,peak:S.peak,phase,done:!!S.done,tier:L?L.tier:null,pts:L?L.pts:null,year:S.year,updated:Date.now()},data};
}
let SAVING=false,DIRTY=null;const SAVE_STATE={msg:''};
async function saveNow(phase){
 if(!S||!S.cid)return;
 if(SAVING){DIRTY=phase;return}
 SAVING=true;
 try{const body=buildBody(phase);localSet(S.cid,body);
  if(online()){await CLOUD.db.collection('data/users/'+CLOUD.uid).doc(S.cid).set(body);SAVE_STATE.msg='Salvo na sua conta'}else SAVE_STATE.msg='Salvo neste aparelho';
 }catch(e){SAVE_STATE.msg=e&&e.code==='quota_exceeded'?'Espaço cheio: apague carreiras antigas':'Salvo neste aparelho'}
 SAVING=false;const el=document.getElementById('saveflag');if(el)el.textContent=SAVE_STATE.msg;
 if(DIRTY){const p=DIRTY;DIRTY=null;saveNow(p)}
}
async function listSaves(){
 let list=[];
 if(online()){try{const q=await CLOUD.db.collection('data/users/'+CLOUD.uid).get();list=q.docs.map(d=>({...d.data().meta,src:'conta'}))}catch(e){}}
 const ix=localIndex();for(const k in ix)if(!list.find(x=>x.cid===k))list.push({...ix[k],src:'aparelho'});
 return list.sort((a,b)=>b.updated-a.updated);
}
async function loadSave(cid){
 let body=null;
 if(online()){try{const d=await CLOUD.db.collection('data/users/'+CLOUD.uid).doc(cid).get();if(d.exists)body=d.data()}catch(e){}}
 if(!body)body=localGet(cid);
 if(!body)return false;
 const o=JSON.parse(body.data);
 buildClubs();for(const[id,l,s]of o.clubs)if(CLUB[id]){CLUB[id].l=l;CLUB[id].s=s}
 W=o.W;S=o.S;if(POS_ALIAS[S.pos])S.pos=POS_ALIAS[S.pos];for(const s of (W.stars||[]))if(POS_ALIAS[s.pos])s.pos=POS_ALIAS[s.pos];REQ=o.req||{};RENEW=o.renew||null;RENEW_MSG=o.renewMsg||'';
 PAUSE=S.pauseId?EV.find(e=>e.id===S.pauseId)||null:null;if(PAUSE){try{PAUSE._d=PAUSE.d()}catch(e){PAUSE=null}}
 EVRES=null;LASTR=[];TAB='jogos';CLOUD.screen='game';
 const ph=S.phase;
 if(S.done||ph==='end')renderEnd(true);
 else if(ph==='pre')renderPlanning();
 else if(ph==='post')afterSeason();
 else renderHub();
 return true;
}
async function deleteSave(cid){localDel(cid);if(online()){try{await CLOUD.db.collection('data/users/'+CLOUD.uid).doc(cid).delete()}catch(e){}}}
function goHome(){if(S&&S.cid&&!S.done){const ph=S.st&&S.st.ended?'post':(PAUSE||S.st&&S.st.idx>0)?'season':S.phase||'pre';saveNow(ph)}$ov.hidden=true;$ov.innerHTML='';buildClubs();CLOUD.screen='home';renderIntro()}

// ---------- navegação ----------
function navHTML(active){
 const tabs=[['home','Jogar'],['careers','Carreiras'],['ranking','Ranking'],['account',online()?'Conta':'Entrar']];
 const av=CLOUD.me&&CLOUD.me.avatarUrl?`<img class="av" src="${CLOUD.me.avatarUrl}" alt="">`:'';
 return`<nav class="topnav"><div class="topnav-in"><button class="brand" data-nav="home"><span>Fome</span><span>de Bola</span></button><div class="navtabs">${tabs.map(([k,n])=>`<button class="navtab ${active===k?'on':''}" data-nav="${k}">${k==='account'&&av?av:''}${n}</button>`).join('')}</div></div></nav>`;
}
function bindNav(){document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{const k=b.dataset.nav;CLOUD.screen=k;if(k==='home')renderIntro();else if(k==='careers')renderCareers();else if(k==='ranking')renderRanking();else renderAccount()})}
function page(active,inner){$app.innerHTML=navHTML(active)+`<div class="wrap">${inner}</div>`;bindNav();scrollTo(0,0)}

// ---------- INÍCIO ----------
async function renderIntro(){
 CLOUD.screen='home';
 const saves=CLOUD.ready?(await listSaves()).filter(x=>!x.done).slice(0,2):[];
 if(CLOUD.screen!=='home')return;
 page('home',`
 <section class="hero">
  <div class="floods"><i></i><i></i></div>
  <div class="eyebrow">Simulador de carreira · futebol</div>
  <h1 class="logo"><span class="l1">Fome</span><span class="l2">de Bola</span></h1>
  <p class="lede">Roube atributos dos Ícones do FC 27, escolha onde jogar e viva a carreira jogo a jogo: da Série D ao topo da Europa, com pênaltis decisivos, braçadeira, Bola de Ouro e estátua na porta do estádio.</p>
  <div class="row"><button class="btn big" id="go">Nova carreira</button>${saves[0]?`<button class="btn ghost big" id="cont0">Continuar</button>`:''}</div>
  <div class="strip"><div><b>22</b><span>ligas</span></div><div><b>380+</b><span>clubes</span></div><div><b>114</b><span>Ícones</span></div><div><b>11</b><span>degraus</span></div></div>
 </section>
 ${saves.length?`<section class="card"><div class="eyebrow" style="margin-bottom:10px">Em andamento</div><div class="clubs">${saves.map(x=>saveRow(x,true)).join('')}</div></section>`:''}
 <div class="how">
  <div><span class="num">01</span><b>Roube 8 atributos</b><span class="muted">Cada Ícone oferece um atributo. Cada posição pesa os atributos de um jeito: reflexo é ouro no gol e lixo no ataque.</span></div>
  <div><span class="num">02</span><b>Jogue cada partida</b><span class="muted">Tabela, copas, acesso e rebaixamento, estaduais, continentais, Mundial e Copa do Mundo de 4 em 4 anos.</span></div>
  <div><span class="num">03</span><b>Decida dentro e fora</b><span class="muted">Bata os pênaltis, peça a 10, a braçadeira e aumento. Festa ou dormir cedo? Cada escolha pesa.</span></div>
 </div>
 <section class="card"><div class="eyebrow" style="margin-bottom:10px">A escada do legado</div>
  <div class="ladder">${TIERS.map((t,i)=>`<div><b>${i+1}</b><span><span style="color:var(--chalk);font-weight:600">${esc(t[1])}</span> · ${esc(t[2])}</span></div>`).join('')}</div></section>
 <p class="foot">Sem afiliação com clubes, ligas, federações ou com a EA. Nomes reais só para identificação.</p>`);
 document.getElementById('go').onclick=()=>{CLOUD.screen='game';renderCreate()};
 const c0=document.getElementById('cont0');if(c0)c0.onclick=()=>loadSave(saves[0].cid);
 bindSaveRows();
}
function saveRow(x,compact){
 const c=CLUB[x.club]||CLUBS.find(k=>k.n===x.club);
 const status=x.done?`<span class="status win">${esc(TIERS[x.tier||0][1])}</span>`:`<span class="status live">${x.age} anos · OVR ${x.ovr}</span>`;
 return`<div class="clubrow">${c?shieldHTML(c):`<span class="flagbox">${NATS[x.nat]?NATS[x.nat].f:''}</span>`}<div class="info"><b>${esc(x.name)} <span class="muted" style="font-weight:500">${esc(x.pos)}</span></b><span>${esc(x.club||'')} · ${seasonLbl(x.year||2026)} · ${x.src==='conta'?'na sua conta':'neste aparelho'}</span></div>${status}
 <div class="rowbtns">${x.done?`<button class="btn small" data-view="${x.cid}">Ver</button>`:`<button class="btn small" data-load="${x.cid}">Continuar</button>`}${compact?'':`<button class="btn ghost small" data-del="${x.cid}">Apagar</button>`}</div></div>`;
}
function bindSaveRows(){
 document.querySelectorAll('[data-load],[data-view]').forEach(b=>b.onclick=()=>loadSave(b.dataset.load||b.dataset.view));
 document.querySelectorAll('[data-del]').forEach(b=>b.onclick=async()=>{if(b.dataset.armed){await deleteSave(b.dataset.del);renderCareers()}else{b.dataset.armed='1';b.textContent='Confirmar?';b.classList.remove('ghost')}});
}

// ---------- CARREIRAS ----------
async function renderCareers(){
 CLOUD.screen='careers';
 page('careers','<section class="card"><div class="muted">Carregando suas carreiras…</div></section>');
 const list=await listSaves();if(CLOUD.screen!=='careers')return;
 const live=list.filter(x=>!x.done),done=list.filter(x=>x.done);
 page('careers',`<div><div class="eyebrow">Minhas carreiras</div><h2 class="h2">Seu vestiário</h2><p class="muted" style="margin:6px 0 0">${online()?'Suas carreiras ficam salvas na sua conta e abrem em qualquer aparelho.':'Sem login: as carreiras ficam salvas só neste aparelho.'}</p></div>
 <section class="card"><div class="eyebrow" style="margin-bottom:10px">Em andamento · ${live.length}</div><div class="clubs">${live.map(x=>saveRow(x)).join('')||'<div class="muted">Nenhuma carreira em andamento.</div>'}</div></section>
 <section class="card"><div class="eyebrow" style="margin-bottom:10px">Encerradas · ${done.length}</div><div class="clubs">${done.map(x=>saveRow(x)).join('')||'<div class="muted">Quando você se aposentar, a carreira aparece aqui.</div>'}</div></section>
 <section class="card" style="display:grid;gap:10px"><div class="eyebrow">Abrir carreira de outra pessoa</div><div class="row"><input class="input mono" id="code" placeholder="Código de compartilhamento" style="flex:1;min-width:200px"><button class="btn small" id="openCode">Abrir</button></div><div class="muted" id="codeMsg" style="font-size:13px"></div></section>`);
 bindSaveRows();
 document.getElementById('openCode').onclick=async()=>{const v=document.getElementById('code').value.trim();const ok=await openShared(v);if(!ok)document.getElementById('codeMsg').textContent='Não encontrei essa carreira. Confira o código.'};
}

// ---------- CONTA ----------
function renderAccount(){
 CLOUD.screen='account';
 const me=CLOUD.me;
 const name=me&&me.name||'';
 const clubOpts=Object.keys(LG).map(l=>`<optgroup label="${esc(LG[l].n)}">${CLUBS.filter(c=>c.l===l).sort((a,b)=>a.n.localeCompare(b.n)).map(c=>`<option value="${esc(c.id)}">${esc(c.n)}${CLOUD.badges[c.id]?' ✓':''}</option>`).join('')}</optgroup>`).join('');
 page('account',`<div><div class="eyebrow">Conta</div><h2 class="h2">${online()?'Você está conectado':'Entrar'}</h2></div>
 <section class="card account">${online()?`<img class="avbig" src="${me.avatarUrl}" alt=""><div><b style="font-size:20px">${esc(name||'Jogador')}</b><div class="muted">Login pela sua conta Claude. Suas carreiras ficam salvas nela e abrem em qualquer aparelho.</div></div>`:`<div><b style="font-size:20px">Entre com sua conta Claude</b><div class="muted" style="margin-top:6px;max-width:58ch">O login usa a conta com que você abre o jogo no Claude: não precisa criar senha. Abra o jogo pelo app ou site do Claude com sua conta pra salvar carreiras na nuvem e aparecer no ranking. Sem login, tudo continua funcionando e fica salvo só neste aparelho.</div></div>`}</section>
 ${CLOUD.assets?`<section class="card" style="display:grid;gap:10px"><div class="eyebrow">Escudos dos clubes</div><div class="muted" style="font-size:14px">Escolha um clube e envie uma imagem (PNG, JPG, WEBP ou SVG). Ela substitui o escudo desenhado em todo o jogo, pra todo mundo que abrir.</div>
  <div class="row"><select class="input" id="bClub" style="flex:2;min-width:200px">${clubOpts}</select><input class="input" type="file" id="bFile" accept="image/png,image/jpeg,image/webp,image/svg+xml" style="flex:1;min-width:180px"></div>
  <div class="row"><button class="btn small" id="bUp">Enviar escudo</button><button class="btn ghost small" id="bDel">Voltar ao escudo desenhado</button><span class="muted" id="bMsg" style="font-size:13px"></span></div>
  <div class="row" id="bPrev"></div>
  <div class="divider"></div>
  <div class="eyebrow">Vários de uma vez</div><div class="muted" style="font-size:14px">Selecione várias imagens com o nome do clube no arquivo, por exemplo <span class="mono">Flamengo.png</span>, <span class="mono">Real Madrid.png</span> ou a sigla <span class="mono">FLA.png</span>. O jogo casa cada arquivo com o clube certo.</div>
  <div class="row"><input class="input" type="file" id="bMany" multiple accept="image/png,image/jpeg,image/webp,image/svg+xml" style="flex:1;min-width:200px"><button class="btn small" id="bManyUp">Enviar todos</button></div>
  <div id="bManyOut" class="muted" style="font-size:13px"></div></section>`:''}
 ${CLOUD.assets?`<section class="card" style="display:grid;gap:10px"><div class="eyebrow">Ilustrações das taças</div><div class="muted" style="font-size:14px">Envie as ilustrações com o nome da competição ou do prêmio no arquivo, por exemplo <span class="mono">Champions League.png</span>, <span class="mono">Copa do Brasil.png</span>, <span class="mono">Bola de Ouro.png</span>. Elas substituem os troféus desenhados nas celebrações, cerimônias e na galeria.</div>
  <div class="row"><input class="input" type="file" id="tMany" multiple accept="image/png,image/jpeg,image/webp,image/svg+xml" style="flex:1;min-width:200px"><button class="btn small" id="tManyUp">Enviar todas</button></div>
  <div id="tManyOut" class="muted" style="font-size:13px">${Object.keys(CLOUD.trophies||{}).length} ilustrações enviadas.</div></section>`:''}
 <section class="card"><div class="eyebrow" style="margin-bottom:8px">Privacidade</div><div class="muted" style="font-size:14px">Carreiras salvas são só suas. Só fica pública uma carreira que você mandar pro ranking pelo botão Compartilhar.</div></section>`);
 const bc=document.getElementById('bClub');
 if(bc){
  const prev=()=>{const c=CLUB[bc.value];document.getElementById('bPrev').innerHTML=c?`${shieldHTML(c,'lg')}<span>${esc(c.n)}</span>`:''};bc.onchange=prev;prev();
  const msg=t=>document.getElementById('bMsg').textContent=t;
  document.getElementById('bUp').onclick=async()=>{const f=document.getElementById('bFile').files[0];if(!f)return msg('Escolha uma imagem primeiro.');msg('Enviando…');
   try{const r=await CLOUD.assets.upload(f);const map={...CLOUD.badges,[bc.value]:r.id};await CLOUD.db.doc('config/badges').set({map});CLOUD.badges=map;msg('Escudo atualizado.');prev()}catch(e){msg(e&&e.code==='too_large'?'Imagem grande demais.':e&&e.code==='unsupported_type'?'Formato não aceito.':'Não deu pra enviar agora.')}};
  const norm=t=>t.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\.[a-z0-9]+$/,'').replace(/[^a-z0-9]/g,'');
  const idx={};for(const c of Object.values(CLUB)){idx[norm(c.n)]=c.id;if(c.a&&!idx[norm(c.a)])idx[norm(c.a)]=c.id}
  document.getElementById('bManyUp').onclick=async()=>{const files=[...document.getElementById('bMany').files];const out=document.getElementById('bManyOut');if(!files.length){out.textContent='Escolha as imagens primeiro.';return}
   const map={...CLOUD.badges};const ok=[],miss=[],fail=[];
   for(let i=0;i<files.length;i++){const f=files[i];const id=idx[norm(f.name)];out.textContent=`Enviando ${i+1} de ${files.length}…`;if(!id){miss.push(f.name);continue}
    try{const r=await CLOUD.assets.upload(f);map[id]=r.id;ok.push(id)}catch(e){fail.push(f.name);if(e&&e.code==='rate_limited')await new Promise(r=>setTimeout(r,1500))}}
   if(ok.length){try{await CLOUD.db.doc('config/badges').set({map});CLOUD.badges=map}catch(e){fail.push('(salvar mapa)')}}
   out.innerHTML=`${ok.length} escudos aplicados.${miss.length?`<br>Sem clube com esse nome: ${miss.map(esc).join(', ')}`:''}${fail.length?`<br>Falharam: ${fail.map(esc).join(', ')}`:''}`;prev()};
  const tUp=document.getElementById('tManyUp');if(tUp)tUp.onclick=async()=>{const files=[...document.getElementById('tMany').files];const out=document.getElementById('tManyOut');if(!files.length){out.textContent='Escolha as imagens primeiro.';return}
   const known=new Set(TROPHY_NAMES().map(normName));const map={...CLOUD.trophies};const ok=[],miss=[],fail=[];
   for(let i=0;i<files.length;i++){const f=files[i];const k=normName(f.name);out.textContent=`Enviando ${i+1} de ${files.length}…`;if(!known.has(k)){miss.push(f.name);continue}
    try{const r=await CLOUD.assets.upload(f);map[k]=r.id;ok.push(k)}catch(e){fail.push(f.name);if(e&&e.code==='rate_limited')await new Promise(r=>setTimeout(r,1500))}}
   if(ok.length){try{await CLOUD.db.doc('config/trophies').set({map});CLOUD.trophies=map}catch(e){fail.push('(salvar mapa)')}}
   out.innerHTML=`${ok.length} ilustrações aplicadas.${miss.length?`<br>Nome não reconhecido: ${miss.map(esc).join(', ')}`:''}${fail.length?`<br>Falharam: ${fail.map(esc).join(', ')}`:''}`};
  document.getElementById('bDel').onclick=async()=>{const map={...CLOUD.badges};const old=map[bc.value];if(!old)return msg('Esse clube já usa o escudo desenhado.');delete map[bc.value];try{await CLOUD.db.doc('config/badges').set({map});CLOUD.badges=map;try{await CLOUD.assets.delete(old)}catch(e){}msg('Voltou ao escudo desenhado.');prev()}catch(e){msg('Não deu agora.')}};
 }
}

// ---------- CARD DA CARREIRA ----------
function cardData(){
 const L=legacy();const tot=totals();const nat=NATS[S.nat];
 const groups={};for(const t of S.titles){(groups[t.n]=groups[t.n]||{ic:t.ic||t.t,n:t.n,y:[]}).y.push(t.year+1)}
 const aw={};for(const a of S.awards){const k=a.t==='bola_top3'?'Pódio da Bola de Ouro':a.n.replace(/ · .*/,'');(aw[k]=aw[k]||{t:a.t,n:k,y:[]}).y.push(a.year+1)}
 return{v:1,cid:S.cid,name:S.name,nat:S.nat,flag:nat.f,pos:S.pos,startPos:S.startPos,peak:S.peak,peakAge:S.peakAge,shirt:S.shirt,nick:nickname(),tier:L.tier,pts:L.pts,bolas:L.bolas,tot,caps:S.caps,natGoals:S.natGoals,
  titles:Object.values(groups).sort((a,b)=>b.y.length-a.y.length),nTitles:S.titles.length,awards:Object.values(aw),rawT:S.titles.map(t=>({t:t.t,n:t.n,ic:t.ic,club:t.club,year:t.year})),rawA:S.awards.map(a=>({t:a.t,n:a.n,year:a.year})),
  clubs:Object.entries(S.clubs).sort((a,b)=>a[1].first-b[1].first).map(([id,v])=>{const c=CLUB[id]||{};return{id,n:c.n||id,c1:c.c1,c2:c.c2,a:c.a,seasons:v.seasons,games:v.games,goals:v.goals,cs:v.cs,titles:v.titles.length,idol:S.idols.includes(id),statue:S.statues.includes(id),heart:S.heart===id}}),
  history:S.history.map(h=>({age:h.age,club:h.club,lg:h.lg,ovr:h.ovr,d:h.delta,j:h.games,g:h.goals,a:h.assists,cs:h.cs,n:h.nota,rk:h.rank,t:h.titles.length,b:h.awards.includes('bola')?1:0,mv:h.move})),
  retired:S.retiredReason,life:{din:S.din,rel:S.rel,filhos:S.filhos,fama:Math.round(S.life.fama),langs:S.langs.length},diff:S.diff,endYear:S.year};
}
function renderEnd(fromLoad){
 S.done=true;CLOUD.screen='game';const card=cardData();
 if(!fromLoad)hallSave({name:S.name,flag:card.flag,pos:S.pos,nick:card.nick,pts:card.pts,tier:card.tier});
 saveNow('end');
 renderCard(card,{own:true});
}
function renderCard(k,opt={}){
 const gk=k.pos==='GOL';
 const hist=`<details class="hist" open><summary><span>Carreira</span><span class="mono muted" style="font-size:14px">${k.history.length} temp.</span></summary><div class="tbl"><table><thead><tr><th>IDADE</th><th>CLUBE</th><th>LIGA</th><th>OVR</th><th>J</th><th>${gk?'SG':'G'}</th><th>A</th><th>NOTA</th><th>POS</th><th>TÍT</th></tr></thead><tbody>${k.history.map(h=>{const c=CLUB[h.club]||k.clubs.find(x=>x.id===h.club)||{n:h.club};return`<tr><td class="mono">${h.age}</td><td class="club">${shieldHTML({...c,id:h.club},'sm')}<span>${esc(c.n)}</span></td><td>${esc(h.lg)}${h.mv==='up'?' <span class="up">▲</span>':h.mv==='down'?' <span class="down">▼</span>':''}</td><td class="mono">${h.ovr}<span class="${h.d>=0?'up':'down'}" style="font-size:11px"> ${h.d>0?'+':''}${h.d||''}</span></td><td class="mono">${h.j}</td><td class="mono">${gk?(h.cs??'—'):h.g}</td><td class="mono">${h.a}</td><td class="mono">${fmt2(h.n)}</td><td class="mono">${h.rk}º</td><td style="color:var(--gold)">${h.t||''}${h.b?' ●':''}</td></tr>`}).join('')}</tbody></table></div></details>`;
 const body=`<section class="endhero">
 <div class="fut"><div class="shine"></div><div class="top"><div><div class="big mono">${k.peak}</div><div class="pos">${k.pos}</div><div style="font-size:28px;margin-top:4px">${k.flag}</div></div><div style="text-align:right"><div class="eyebrow" style="color:var(--gold)">Auge aos ${k.peakAge}</div><div class="mono" style="font-size:30px;font-weight:600;margin-top:6px">#${k.shirt}</div></div></div>
 <div class="name">${esc(k.name)}</div><div class="tier">${esc(k.nick)}</div>
 <div class="nums"><div><b class="mono">${k.tot.games}</b><small>JOGOS</small></div><div><b class="mono">${gk?k.tot.cs:k.tot.goals}</b><small>${gk?'SG':'GOLS'}</small></div><div><b class="mono">${k.nTitles}</b><small>TÍTULOS</small></div></div></div>
 <div class="endtitle"><div class="eyebrow">${esc(k.retired||'Fim de carreira')}</div><h2>${esc(TIERS[k.tier][1])}</h2><div class="muted">${esc(TIERS[k.tier][2])} · ${k.pts} pontos de legado</div></div></section>
 ${opt.own?`<section class="card share" style="display:grid;gap:10px"><div class="eyebrow">Compartilhar</div><div class="muted" style="font-size:14px">${online()||CLOUD.web?'Mande sua carreira pro ranking e gere um código pra qualquer pessoa abrir este card.':'Entre com sua conta Claude pra mandar a carreira pro ranking. O resumo em texto funciona sempre.'}</div>
  <div class="row">${online()||CLOUD.web?'<button class="btn" id="shareBtn">Compartilhar no ranking</button>':''}<button class="btn ghost" id="copy">Copiar resumo</button></div><div id="shareOut"></div></section>`:''}
 ${k.clubs.some(c=>c.statue||c.idol)?`<section class="card" style="display:grid;gap:8px">${k.clubs.filter(c=>c.statue).map(c=>`<div class="news">${ICON('estatua')}<div><b>Estátua no ${esc(c.n)}</b><div class="muted">Bronze na porta do estádio.</div></div></div>`).join('')}${k.clubs.filter(c=>c.idol&&!c.statue).map(c=>`<div class="news">${ICON('idolo')}<div><b>Ídolo do ${esc(c.n)}</b><div class="muted">Seu nome é cantado até hoje.</div></div></div>`).join('')}</section>`:''}
 <section class="card"><div class="eyebrow" style="margin-bottom:10px">Onde ficou</div><div class="tierlist">${TIERS.map((t,i)=>`<div class="${i===k.tier?'me':i<k.tier?'reached':''}"><b>${i+1}</b><span>${esc(t[1])}</span><span style="margin-left:auto;opacity:.7">${i>=7?esc(t[2]):t[0]+' pts'}</span></div>`).slice().reverse().join('')}</div></section>
 <section class="card"><div class="stats"><div class="stat"><b class="mono">${k.tot.goals}</b><small>Gols</small></div><div class="stat"><b class="mono">${k.tot.assists}</b><small>Assistências</small></div><div class="stat"><b class="mono">${k.caps}</b><small>Jogos seleção</small></div><div class="stat"><b class="mono">${k.natGoals}</b><small>Gols seleção</small></div></div></section>
 <section class="card" style="display:grid;gap:10px" id="galBox"><div class="eyebrow">Galeria de títulos</div><div id="galIn"></div></section>
 
 <section class="card"><div class="eyebrow" style="margin-bottom:10px">Clubes</div><div class="clubs">${k.clubs.map(c=>`<div class="clubrow">${shieldHTML(c)}<div class="info"><b>${esc(c.n)} ${c.statue?'<span class="idol">ESTÁTUA</span>':c.idol?'<span class="idol">ÍDOLO</span>':''}${c.heart?' <span class="chip">♥</span>':''}</b><span>${c.seasons} temp. · ${c.games} jogos · ${gk?c.cs+' SG':c.goals+' gols'} · ${c.titles} títulos</span></div></div>`).join('')}</div></section>
 <section class="card"><div class="eyebrow" style="margin-bottom:10px">Fora de campo</div><div class="lifemeta" style="margin:0"><span class="chip">Patrimônio ${money(k.life.din)}</span><span class="chip">${k.life.rel==='casado'?'Casado':k.life.rel==='namorando'?'Namorando':'Solteiro'}${k.life.filhos?` · ${k.life.filhos} filho${k.life.filhos>1?'s':''}`:''}</span><span class="chip gold">Fama ${k.life.fama}</span><span class="chip">${k.life.langs} idioma${k.life.langs>1?'s':''}</span>${k.pos!==k.startPos?`<span class="chip">Começou como ${k.startPos}</span>`:''}<span class="chip">Dificuldade ${esc(DIFF[k.diff]?DIFF[k.diff].n:'')}</span></div></section>
 ${hist}
 <div class="row">${opt.own?'<button class="btn" id="again">Jogar de novo</button>':''}<button class="btn ghost" id="home">${opt.back?'Voltar':'Início'}</button></div>`;
 if(opt.own)$app.innerHTML=header()+`<div class="wrap">${body}</div>`;else page(opt.nav||'ranking',body);
 scrollTo(0,0);
 const rawT=k.rawT||k.titles.flatMap(g=>g.y.map(y=>({t:g.ic,n:g.n,ic:g.ic,year:y-1}))),rawA=k.rawA||k.awards.flatMap(g=>g.y.map(y=>({t:g.t,n:g.n,year:y-1})));
 const galR=f=>{const el=document.getElementById('galIn');if(!el)return;el.innerHTML=galleryHTML(rawT,rawA,{filter:f});bindGallery(rawT,rawA,galR)};galR('all');
 const on=(id,fn)=>{const e=document.getElementById(id);if(e)e.onclick=fn};
 on('again',()=>{CR.name=k.name;buildClubs();CLOUD.screen='game';renderCreate()});
 on('home',()=>{if(opt.back)opt.back();else goHome()});
 const summary=()=>`${k.name} ${k.flag} ${k.pos} — ${TIERS[k.tier][1]} (${k.pts} pts)\n"${k.nick}" · auge ${k.peak} OVR\n${k.tot.games} jogos · ${gk?k.tot.cs+' jogos sem sofrer gol':k.tot.goals+' gols · '+k.tot.assists+' assistências'}\n${k.nTitles} títulos · ${k.bolas} Bola(s) de Ouro${k.code?`\nCódigo da carreira: ${k.code}`:''}${k.code&&CLOUD.web?`\n${webLink(k.code)}`:''}\nFome de Bola`;
 const copyText=async(t,btn)=>{try{await navigator.clipboard.writeText(t);btn.textContent='Copiado'}catch(e){document.getElementById('shareOut').innerHTML=`<textarea class="input" rows="7" readonly>${esc(t)}</textarea>`;document.querySelector('#shareOut textarea').select()}};
 on('copy',()=>copyText(summary(),document.getElementById('copy')));
 on('shareBtn',async()=>{const b=document.getElementById('shareBtn');b.disabled=true;b.textContent='Enviando…';
  const code=await shareCareer(k);
  if(code){k.code=code;document.getElementById('shareOut').innerHTML=`<div class="codebox"><div><div class="eyebrow">Código da carreira</div><b class="mono">${esc(code)}</b></div><button class="btn small" id="copyCode">Copiar código</button></div><div class="muted" style="font-size:13px;margin-top:6px">Já está no ranking. Quem abrir o jogo cola esse código em Carreiras pra ver seu card. ${CLOUD.web?`Ou mande o link direto: <span class="mono" style="word-break:break-all">${esc(webLink(code))}</span>`:'Pra outra pessoa abrir o jogo, compartilhe o link pelo menu de compartilhar do Claude.'}</div>`;b.textContent='No ranking';on('copyCode',()=>copyText(summary(),document.getElementById('copyCode')))}
  else{b.disabled=false;b.textContent='Tentar de novo';document.getElementById('shareOut').innerHTML='<div class="muted">Não deu pra compartilhar agora.</div>'}});
}

// ---------- RANKING / COMPARTILHAR ----------
async function shareCareer(k){
 if(CLOUD.web)return webShare(k);
 if(!online())return null;
 try{
  const uid=CLOUD.uid;
  await CLOUD.db.doc(`shared/${uid}/c/${k.cid}`).set({...k,owner:uid,at:Date.now()});
  const ref=CLOUD.db.doc('shared/'+uid);const cur=await ref.get();
  const items=((cur.exists&&cur.data().items)||[]).filter(x=>x.cid!==k.cid);
  items.push({cid:k.cid,name:k.name,flag:k.flag,pos:k.pos,tier:k.tier,pts:k.pts,nick:k.nick,peak:k.peak,t:k.nTitles,b:k.bolas,by:(typeof activeProfile==='function'?activeProfile().name:''),at:Date.now()});
  await ref.set({items:items.slice(-40)});
  return `${uid}.${k.cid}`;
 }catch(e){return null}
}
async function openShared(code){
 if(!CLOUD.db||!code)return false;
 const i=code.lastIndexOf('.');if(i<1)return false;
 const uid=code.slice(0,i),cid=code.slice(i+1);
 try{const d=await CLOUD.db.doc(`shared/${uid}/c/${cid}`).get();if(!d.exists)return false;const k=d.data();k.code=code;renderCard(k,{nav:'ranking',back:()=>renderRanking()});return true}catch(e){return false}
}
async function renderRanking(){
 CLOUD.screen='ranking';
 if(!CLOUD.db){page('ranking',`<div><div class="eyebrow">Ranking</div><h2 class="h2">As maiores carreiras</h2></div><section class="card"><div class="muted">O ranking aparece quando o jogo é aberto pelo Claude com login. Suas melhores carreiras neste aparelho:</div>${localHall()}</section>`);return}
 page('ranking','<section class="card"><div class="muted">Carregando o ranking…</div></section>');
 let rows=[];
 try{const q=await CLOUD.db.collection('shared').limit(300).get();for(const d of q.docs){const it=(d.data().items||[]);for(const x of it)rows.push({...x,owner:d.id})}}catch(e){}
 if(CLOUD.screen!=='ranking')return;
 rows.sort((a,b)=>b.pts-a.pts);rows=rows.slice(0,60);
 let names={};if(CLOUD.user){try{names=await CLOUD.user.profiles([...new Set(rows.map(r=>r.owner))])}catch(e){}}
 const pf=POS_FILTER;const shown=pf==='all'?rows:rows.filter(r=>pf==='GOL'?r.pos==='GOL':pf==='DEF'?['ZAG','LE','LD','LAT'].includes(r.pos):pf==='MEIO'?['VOL','MC','MEI','ME','MD'].includes(r.pos):['PE','PD','PON','SA','ATA'].includes(r.pos));
 page('ranking',`<div><div class="eyebrow">Ranking global</div><h2 class="h2">As maiores carreiras</h2></div>
 <div class="tabs">${[['all','Geral'],['GOL','Goleiros'],['DEF','Defensores'],['MEIO','Meio-campo'],['ATQ','Atacantes']].map(([k,n])=>`<button class="tab ${pf===k?'on':''}" data-pf="${k}">${n}</button>`).join('')}</div>
 <section class="card rank">${shown.length?shown.map((r,i)=>`<button class="rankrow" data-code="${esc(r.owner+'.'+r.cid)}"><span class="pos-n mono">${i+1}</span><span class="tierdot t${r.tier}">${r.tier+1}</span><div class="info"><b>${esc(r.name)} <span class="muted" style="font-weight:500">${r.flag} ${esc(r.pos)}</span></b><span>${esc(TIERS[r.tier][1])} · ${esc(r.nick)}${r.by?` · por ${esc(r.by)}`:names[r.owner]&&names[r.owner].name?` · por ${esc(names[r.owner].name)}`:''}</span></div><div class="mine"><b class="mono">${r.pts}</b>${r.t} tít · ${r.b} BO</div></button>`).join(''):'<div class="muted">Ninguém compartilhou uma carreira ainda. A sua pode ser a primeira.</div>'}</section>`);
 document.querySelectorAll('[data-pf]').forEach(b=>b.onclick=()=>{POS_FILTER=b.dataset.pf;renderRanking()});
 document.querySelectorAll('[data-code]').forEach(b=>b.onclick=()=>openShared(b.dataset.code));
}
let POS_FILTER='all';
function localHall(){const h=hallLoad();return h.length?`<div class="lines" style="margin-top:10px">${h.map((x,i)=>`<div class="line"><span>${i+1}. <b>${esc(x.name)}</b> <span class="muted">${x.flag} ${x.pos}</span></span><span class="r">${esc(TIERS[x.tier][1])} · ${x.pts}</span></div>`).join('')}</div>`:'<div class="muted" style="margin-top:8px">Nenhuma ainda.</div>'}


