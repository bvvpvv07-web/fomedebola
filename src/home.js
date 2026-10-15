// ================== INÍCIO MOBILE: perfis, carreiras, ranking ==================
// Perfis locais (várias pessoas no mesmo aparelho/conta)
const PROF_KEY='fdb3_profiles';
const PROF_EMOJI=['⚽','🦁','🔥','⭐','🐐','🦅','👑','🚀','🎯','🧤'];
function profiles(){let p=null;try{p=JSON.parse(localStorage.getItem(PROF_KEY)||'null')}catch(e){}
 if(!p||!p.list||!p.list.length)p={active:'p0',list:[{id:'p0',name:(CLOUD.me&&CLOUD.me.name)||'Jogador',emoji:'⚽'}]};return p}
function saveProfiles(p){try{localStorage.setItem(PROF_KEY,JSON.stringify(p))}catch(e){}}
function activeProfile(){const p=profiles();return p.list.find(x=>x.id===p.active)||p.list[0]}

// ---------- salvar com perfil ----------
function buildBody(phase){
 S.phase=phase;S.pauseId=PAUSE?PAUSE.id:null;if(!S.profile)S.profile=activeProfile().id;
 const data=JSON.stringify({v:3,S,W,clubs:CLUBS.map(c=>[c.id,c.l,Math.round(c.s*10)/10]),req:REQ,renew:RENEW,renewMsg:RENEW_MSG});
 const c=S.club?CLUB[S.club]:null;const L=S.done?legacy():null;
 return{meta:{cid:S.cid,name:S.name,nat:S.nat,pos:S.pos,age:S.age,club:c?c.n:'',clubId:S.club,ovr:S.ovr,peak:S.peak,phase,done:!!S.done,tier:L?L.tier:null,pts:L?L.pts:null,year:S.year,fast:!!S.fast,titles:(S.titles||[]).length,profile:S.profile,updated:Date.now()},data};
}
async function listSaves(all){
 let list=[];
 if(online()){try{const q=await CLOUD.db.collection('data/users/'+CLOUD.uid).get();list=q.docs.map(d=>({...d.data().meta,src:'conta'}))}catch(e){}}
 const ix=localIndex();for(const k in ix)if(!list.find(x=>x.cid===k))list.push({...ix[k],src:'aparelho'});
 const pid=activeProfile().id;if(!all)list=list.filter(x=>(x.profile||'p0')===pid);
 return list.sort((a,b)=>b.updated-a.updated);
}

// ---------- navegação inferior ----------
function navHTML(active){
 const pr=activeProfile();
 return`<header class="htop"><div class="htop-in"><button class="brand" data-nav="home"><span>Fome</span><span>de Bola</span></button><button class="profchip" data-nav="account"><span class="pe">${pr.emoji}</span><span class="pn">${esc(pr.name)}</span><span class="psw">trocar</span></button></div></header>`;
}
function bottomNav(active){
 const tabs=[['home','🏠','Início'],['careers','📁','Carreiras'],['ranking','🏆','Ranking'],['account','👤','Perfil']];
 return`<nav class="bnav">${tabs.map(([k,ic,n])=>`<button class="${active===k?'on':''}" data-nav="${k}"><span>${ic}</span>${n}</button>`).join('')}</nav>`;
}
function bindNav(){document.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{const k=b.dataset.nav;CLOUD.screen=k;if(k==='home')renderIntro();else if(k==='careers')renderCareers();else if(k==='ranking')renderRanking();else renderProfile()})}
function rerenderNav(){const s=CLOUD.screen;if(s==='home')renderIntro();else if(s==='careers')renderCareers();else if(s==='ranking')renderRanking();else if(s==='account')renderProfile();else if(s==='tools')renderAccount()}
function page(active,inner){document.body.classList.remove('noscroll');$app.innerHTML=navHTML(active)+`<div class="wrap hwrap">${inner}</div>`+bottomNav(active==='tools'?'account':active);bindNav();scrollTo(0,0)}

// ---------- confirmação ----------
function confirmPop(title,text,okLbl){return new Promise(res=>{$ov.hidden=false;$ov.innerHTML=`<div class="ovwrap decpop campo" style="text-align:center"><div class="dp-ic">🗑️</div><h2 class="dp-t">${esc(title)}</h2><p class="dp-d">${esc(text)}</p><div class="actions" style="margin-top:14px"><button class="btn" id="cfY" style="background:linear-gradient(180deg,#ff6a5c,#d8392b);color:#fff">${esc(okLbl||'Apagar')}</button><button class="btn ghost" id="cfN">Cancelar</button></div></div>`;
 document.getElementById('cfY').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res(true)};document.getElementById('cfN').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res(false)}})}

// ---------- cards de carreira ----------
const PHASE_LBL={pre:'Pré-temporada',season:'Temporada',post:'Fim de temporada',end:'Encerrada'};
function careerCard(x,big){
 const c=CLUB[x.clubId]||CLUB[x.club]||CLUBS.find(k=>k.n===x.club);const nat=NATS[x.nat];
 if(x.done){return`<div class="ccard done"><div class="cc-l">${c?shieldHTML(c):`<span class="flagbox">${nat?nat.f:''}</span>`}</div><div class="cc-m"><b>${esc(x.name)} <span>${nat?nat.f:''} ${esc(x.pos)}</span></b><span class="cc-tier">${esc(TIERS[x.tier||0][1])}</span><small>${x.pts||0} pts de legado · auge ${x.peak||x.ovr}</small></div><div class="cc-r"><button class="btn small" data-view="${x.cid}">Ver</button><button class="ccmore" data-more="${x.cid}" aria-label="Mais">⋯</button></div></div>`}
 return`<div class="ccard ${big?'big':''}"><div class="cc-l">${c?shieldHTML(c,big?'lg':''):`<span class="flagbox">${nat?nat.f:''}</span>`}<span class="cc-ovr">${x.ovr}</span></div><div class="cc-m"><b>${esc(x.name)} <span>${nat?nat.f:''} ${esc(x.pos)}</span></b><span>${esc(x.club||'Sem clube')} · ${x.age} anos</span><small>${seasonLbl(x.year||2026)} · ${PHASE_LBL[x.phase]||'Em andamento'}${x.fast?' · ⚡ rápido':''}${x.titles?` · ${x.titles} título${x.titles>1?'s':''}`:''}</small></div><div class="cc-r">${big?'':`<button class="btn small" data-load="${x.cid}">Jogar</button>`}<button class="ccmore" data-more="${x.cid}" aria-label="Mais">⋯</button></div></div>`;
}
function bindSaveRows(list){
 document.querySelectorAll('[data-load],[data-view]').forEach(b=>b.onclick=()=>loadSave(b.dataset.load||b.dataset.view));
 document.querySelectorAll('[data-more]').forEach(b=>b.onclick=()=>careerMenu((list||[]).find(x=>x.cid===b.dataset.more)||{cid:b.dataset.more}));
}
function careerMenu(x){
 $ov.hidden=false;
 $ov.innerHTML=`<div class="ovwrap sheetmenu"><div class="shgrab"></div><b class="sm-t">${esc(x.name||'Carreira')}</b><span class="muted" style="font-size:13px">${esc(x.club||'')} ${x.src?`· salva ${x.src==='conta'?'na sua conta':'neste aparelho'}`:''}</span>
 <div class="sm-list">${x.done?`<button data-act="view">🏅 Ver o card da carreira</button><button data-act="share">📤 Compartilhar no ranking</button>`:`<button data-act="load">▶ Continuar jogando</button>`}<button data-act="del" class="danger">🗑️ Apagar carreira</button><button data-act="close">Fechar</button></div></div>`;
 $ov.querySelectorAll('[data-act]').forEach(b=>b.onclick=async()=>{const a=b.dataset.act;$ov.hidden=true;$ov.innerHTML='';
  if(a==='load'||a==='view')loadSave(x.cid);
  else if(a==='share'){const ok=await loadSave(x.cid);if(ok){const sb=document.getElementById('shareBtn');if(sb){sb.scrollIntoView({behavior:'smooth',block:'center'});sb.click()}}}
  else if(a==='del'){if(await confirmPop('Apagar carreira?',`${x.name||'Esta carreira'} vai sumir de vez. Não dá pra desfazer.`)){await deleteSave(x.cid);toast({ic:'🗑️',title:'Carreira apagada',ms:2200});rerenderNav()}}});
}

// ---------- INÍCIO ----------
async function renderIntro(){
 CLOUD.screen='home';
 const list=CLOUD.ready?await listSaves():[];if(CLOUD.screen!=='home')return;
 const live=list.filter(x=>!x.done),done=list.filter(x=>x.done).sort((a,b)=>(b.pts||0)-(a.pts||0));
 const cur=live[0];const pr=activeProfile();
 page('home',`
 ${cur?`<section class="continue"><div class="eyebrow">Continuar de onde parou</div>${careerCard(cur,true)}<button class="btn wide big" id="cont0">▶ Continuar</button></section>`:`<section class="hero hhero"><div class="floods"><i></i><i></i></div><div class="eyebrow">Simulador de carreira · futebol</div><h1 class="logo"><span class="l1">Fome</span><span class="l2">de Bola</span></h1><p class="lede">Da peneira à Bola de Ouro. Roube atributos dos Ícones, jogue os lances, viva a vida fora de campo.</p></section>`}
 <button class="newcar ${cur?'':'primary'}" id="go"><span>＋</span><div><b>Nova carreira</b><small>${cur?'Começar outra do zero':'Crie seu jogador em 1 minuto'}</small></div><em>→</em></button>
 ${live.length>1?`<section class="hsec"><div class="hsec-h"><span class="eyebrow">Outras em andamento · ${live.length-1}</span><button class="lnk" data-nav="careers">ver todas</button></div>${live.slice(1,4).map(x=>careerCard(x)).join('')}</section>`:''}
 ${done.length?`<section class="hsec"><div class="hsec-h"><span class="eyebrow">Suas lendas</span><button class="lnk" data-nav="careers">ver todas</button></div>${done.slice(0,3).map(x=>careerCard(x)).join('')}</section>`:''}
 <section class="hsec" id="rkTeaser"><div class="hsec-h"><span class="eyebrow">🏆 Top do ranking</span><button class="lnk" data-nav="ranking">ver ranking</button></div><div class="muted" style="font-size:13px">Carregando…</div></section>
 ${!cur&&!done.length?`<details class="hsec howto"><summary>Como funciona <em>›</em></summary><ol><li><b>Crie seu jogador</b> e roube 8 atributos dos Ícones.</li><li><b>Peneira:</b> mostre serviço e escolha seu primeiro clube.</li><li><b>Temporadas</b> em blocos rápidos ou semana a semana, com lances, finais ao vivo e decisões de vida.</li><li><b>Legado:</b> títulos, Bola de Ouro, estátua e ranking.</li></ol></details>`:''}
 <p class="foot">Sem afiliação com clubes, ligas, federações ou com a EA. Nomes reais só para identificação.</p>`);
 document.getElementById('go').onclick=()=>{CLOUD.screen='game';renderCreate()};
 const c0=document.getElementById('cont0');if(c0)c0.onclick=()=>loadSave(cur.cid);
 bindSaveRows(list);
 rankTop(3).then(rows=>{const el=document.getElementById('rkTeaser');if(!el||CLOUD.screen!=='home')return;const h=el.querySelector('.muted');
  if(!rows.length){h.textContent=online()||CLOUD.web?'Ninguém no ranking ainda. Seja o primeiro!':'O ranking aparece quando o jogo é aberto pelo Claude com login.';return}
  h.outerHTML=rows.map((r,i)=>`<button class="rkmini" data-code="${esc(r.owner+'.'+r.cid)}"><span class="rkm-n">${['🥇','🥈','🥉'][i]}</span><div><b>${esc(r.name)} <span class="muted" style="font-weight:500">${r.flag} ${esc(r.pos)}</span></b><small>${esc(TIERS[r.tier][1])}</small></div><span class="mono">${r.pts}</span></button>`).join('');
  el.querySelectorAll('[data-code]').forEach(b=>b.onclick=()=>openShared(b.dataset.code))});
}
async function rankTop(n){if(!CLOUD.db)return[];let rows=[];try{const q=await CLOUD.db.collection('shared').limit(300).get();for(const d of q.docs){for(const x of (d.data().items||[]))rows.push({...x,owner:d.id})}}catch(e){}return rows.sort((a,b)=>b.pts-a.pts).slice(0,n)}

// ---------- CARREIRAS ----------
let CAR_TAB='live';
async function renderCareers(){
 CLOUD.screen='careers';
 page('careers','<section class="card"><div class="muted">Carregando suas carreiras…</div></section>');
 const list=await listSaves();if(CLOUD.screen!=='careers')return;
 const live=list.filter(x=>!x.done),done=list.filter(x=>x.done).sort((a,b)=>(b.pts||0)-(a.pts||0));
 const show=CAR_TAB==='live'?live:done;
 page('careers',`<div class="phead"><h2>Suas carreiras</h2><p>${online()?'Salvas na sua conta: abrem em qualquer aparelho.':'Salvas neste aparelho.'} Perfil: <b>${esc(activeProfile().emoji+' '+activeProfile().name)}</b></p></div>
 <div class="tabs"><button class="tab ${CAR_TAB==='live'?'on':''}" data-ct="live">Em andamento · ${live.length}</button><button class="tab ${CAR_TAB==='done'?'on':''}" data-ct="done">Encerradas · ${done.length}</button></div>
 <section class="hsec">${show.map(x=>careerCard(x)).join('')||`<div class="empty">${CAR_TAB==='live'?'Nenhuma carreira em andamento.':'Quando você se aposentar, a carreira aparece aqui com o card e o legado.'}</div>`}</section>
 <button class="newcar" id="go"><span>＋</span><div><b>Nova carreira</b><small>Crie outro jogador</small></div><em>→</em></button>
 <details class="hsec howto"><summary>Abrir carreira de um amigo <em>›</em></summary><div class="row" style="margin-top:8px"><input class="input mono" id="code" placeholder="Cole o código" style="flex:1;min-width:0"><button class="btn small" id="openCode">Abrir</button></div><div class="muted" id="codeMsg" style="font-size:13px;margin-top:6px"></div></details>`);
 bindSaveRows(list);
 document.querySelectorAll('[data-ct]').forEach(b=>b.onclick=()=>{CAR_TAB=b.dataset.ct;renderCareers()});
 document.getElementById('go').onclick=()=>{CLOUD.screen='game';renderCreate()};
 document.getElementById('openCode').onclick=async()=>{const v=document.getElementById('code').value.trim();const ok=await openShared(v);if(!ok)document.getElementById('codeMsg').textContent='Não encontrei essa carreira. Confira o código.'};
}

// ---------- PERFIL (trocar de conta) ----------
function renderProfile(){
 CLOUD.screen='account';const p=profiles();const me=CLOUD.me;
 page('account',`<div class="phead"><h2>Perfil</h2><p>Cada perfil tem suas próprias carreiras. Use um pra cada pessoa que joga neste aparelho.</p></div>
 <section class="hsec"><div class="hsec-h"><span class="eyebrow">Quem está jogando?</span></div>
  <div class="profs">${p.list.map(x=>`<button class="prof ${x.id===p.active?'on':''}" data-prof="${x.id}"><span class="pe">${x.emoji}</span><b>${esc(x.name)}</b>${x.id===p.active?'<small>ativo</small>':'<small>trocar</small>'}</button>`).join('')}<button class="prof add" id="pAdd"><span class="pe">＋</span><b>Novo perfil</b><small>outra pessoa</small></button></div>
 </section>
 <section class="hsec"><div class="hsec-h"><span class="eyebrow">Perfil ativo</span></div>
  <div class="row"><input class="input" id="pName" maxlength="16" value="${esc(activeProfile().name)}" style="flex:1;min-width:0"><button class="btn small" id="pSave">Salvar nome</button></div>
  <div class="emojis">${PROF_EMOJI.map(e=>`<button class="${activeProfile().emoji===e?'on':''}" data-emo="${e}">${e}</button>`).join('')}</div>
  ${p.list.length>1?`<button class="btn ghost small" id="pDel" style="justify-self:start;color:#ffb3aa">Apagar este perfil</button>`:''}
 </section>
 <section class="hsec"><div class="hsec-h"><span class="eyebrow">Conta e nuvem</span></div>
  <div class="account">${online()?`${me&&me.avatarUrl?`<img class="avbig" src="${me.avatarUrl}" alt="">`:''}<div><b>${esc(me&&me.name||'Conectado')}</b><div class="muted" style="font-size:13.5px">Conectado pela sua conta Claude. Carreiras salvas na nuvem e no ranking. Pra trocar a conta Claude, saia e entre com outra no app do Claude.</div></div>`:`<div><b>Jogando sem login</b><div class="muted" style="font-size:13.5px">${CLOUD.web?'As carreiras ficam salvas neste aparelho. Pra entrar no ranking, use o botão Compartilhar quando a carreira acabar.':'As carreiras ficam neste aparelho. Abra o jogo pelo Claude com sua conta pra salvar na nuvem e entrar no ranking.'}</div></div>`}</div>
 </section>
 ${CLOUD.owner&&CLOUD.assets?`<button class="newcar" id="tools"><span>🛠️</span><div><b>Ferramentas do dono</b><small>Escudos e ilustrações das taças</small></div><em>→</em></button>`:''}
 <section class="hsec"><div class="muted" style="font-size:13px">Carreiras salvas são só suas. Só fica pública uma carreira que você mandar pro ranking.</div></section>`);
 document.querySelectorAll('[data-prof]').forEach(b=>b.onclick=()=>{const q=profiles();q.active=b.dataset.prof;saveProfiles(q);toast({ic:activeProfile().emoji,title:`Perfil: ${activeProfile().name}`,ms:2000});renderProfile()});
 document.getElementById('pAdd').onclick=()=>{const q=profiles();const id='p'+Date.now().toString(36);q.list.push({id,name:'Jogador '+(q.list.length+1),emoji:PROF_EMOJI[q.list.length%PROF_EMOJI.length]});q.active=id;saveProfiles(q);renderProfile();setTimeout(()=>{const i=document.getElementById('pName');if(i){i.focus();i.select()}},50)};
 document.getElementById('pSave').onclick=()=>{const q=profiles();const a=q.list.find(x=>x.id===q.active);a.name=(document.getElementById('pName').value.trim()||a.name).slice(0,16);saveProfiles(q);toast({ic:'✅',title:'Nome salvo',ms:1800});renderProfile()};
 document.querySelectorAll('[data-emo]').forEach(b=>b.onclick=()=>{const q=profiles();q.list.find(x=>x.id===q.active).emoji=b.dataset.emo;saveProfiles(q);renderProfile()});
 const d=document.getElementById('pDel');if(d)d.onclick=async()=>{if(await confirmPop('Apagar perfil?','O perfil sai da lista. As carreiras dele continuam salvas e voltam se você criar um perfil com o mesmo nome.','Apagar perfil')){const q=profiles();q.list=q.list.filter(x=>x.id!==q.active);q.active=q.list[0].id;saveProfiles(q);renderProfile()}};
 const t=document.getElementById('tools');if(t)t.onclick=()=>{CLOUD.screen='tools';renderAccount();const w=$app.querySelector('.wrap');if(w)w.insertAdjacentHTML('afterbegin','<button class="lnk" id="tBack" style="justify-self:start">← Perfil</button>');const bb=document.getElementById('tBack');if(bb)bb.onclick=()=>renderProfile()};
}

// ---------- BOOT ----------
renderIntro();
initCloud().then(()=>{const h=(location.hash||'').replace('#','');if(h.startsWith('share.'))openShared(h.slice(6))});
