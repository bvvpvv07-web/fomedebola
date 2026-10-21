// ================== TELA ÚNICA (sem rolagem) dentro da carreira ==================
// ---------- página/painel por cima ----------
let PANEL=null;
function panelHost(){let h=document.getElementById('panel');if(!h){h=document.createElement('div');h.id='panel';h.hidden=true;document.body.appendChild(h)}return h}
function openPanelHTML(title,html,after){
 const h=panelHost();h.hidden=false;document.body.classList.add('noscroll');
 h.innerHTML=`<div class="pp"><div class="pp-h"><button class="pp-x" id="ppX" aria-label="Voltar"><span>‹</span>Voltar</button><b>${title}</b></div><div class="pp-b" id="ppB">${html}</div></div>`;
 document.getElementById('ppX').onclick=closePanel;if(after)after(document.getElementById('ppB'));
}
function openPanelNode(title,node,key){
 openPanelHTML(title,'');document.getElementById('ppB').appendChild(node);PANEL=key||null;
}
function closePanel(){const h=panelHost();h.hidden=true;h.innerHTML='';PANEL=null;document.body.classList.remove('noscroll')}
const HUBP={jogos:'📋 Jogos',tabela:'📊 Tabela',copas:'🏆 Copas',trofeus:'🏅 Troféus',jogador:'👤 Jogador'};
function openHubPanel(k){
 PANEL='hub:'+k;
 if(k==='jogador'){TAB='stats';openPanelHTML(HUBP[k],`${S.youth?prospectCard():''}${lifePanel()}<section class="card" style="display:grid;gap:8px"><div class="eyebrow">Números da temporada</div>${tabContent()}</section>${histTable(true)}`,b=>{const pr=b.querySelector('#prRank');if(pr)pr.onclick=()=>{PROSPECT_OPEN=!PROSPECT_OPEN;openHubPanel('jogador')}});return}
 TAB=k;openPanelHTML(HUBP[k],`<section class="card" style="display:grid;gap:8px">${tabContent()}</section>`,()=>{if(k==='trofeus')bindGallery(S.titles,S.awards,f=>{GALF=f;openHubPanel('trofeus')})});
}

// ---------- HUB ----------
const _renderHubOS=renderHub;
renderHub=function(...a){
 const r=_renderHubOS.apply(this,a);
 try{oneScreenHub()}catch(e){console.error(e)}
 return r;
};
function oneScreenHub(){
 const w=$app.querySelector('.wrap');if(!w||!S.st)return;
 document.body.classList.add('onescreen');w.classList.add('hubw');
 // remove o que fazia rolar
 w.querySelectorAll(':scope > .mcard, :scope > .tip, :scope > .hist, :scope > .row').forEach(e=>e.remove());
 [...w.querySelectorAll(':scope > section.card')].forEach(sec=>{if(sec.querySelector('.eyebrow')&&/Últimos resultados/.test(sec.querySelector('.eyebrow').textContent))sec.remove();if(sec.querySelector('.life'))sec.remove();if(sec.classList.contains('prospect'))sec.remove()});
 const tabs=w.querySelector(':scope > .tabs');if(tabs){const nx=tabs.nextElementSibling;if(nx&&nx.matches('section.card'))nx.remove();tabs.remove()}
 // barra de páginas
 if(!S.st.done){
  const nav=document.createElement('div');nav.className='hubnav';
  nav.innerHTML=Object.entries(HUBP).map(([k,t])=>{const[ic,...n]=t.split(' ');let badge='';if(k==='jogos'&&LASTR.length)badge=`<i>${LASTR.filter(r=>r.k==='match').length||''}</i>`;if(k==='tabela'){const t2=sortTable(S.st.table);const p=t2.findIndex(x=>x.id===S.club)+1;if(p)badge=`<i class="pos">${p}º</i>`}if(k==='jogador'&&S.youth)badge='<i>⭐</i>';return`<button data-hp="${k}"><span>${ic}</span>${n.join(' ')}${badge}</button>`}).join('');
  const todo=w.querySelector(':scope > .todo');if(todo)todo.after(nav);else w.appendChild(nav);
  nav.querySelectorAll('[data-hp]').forEach(b=>b.onclick=()=>openHubPanel(b.dataset.hp));
 }
 // menu do dock ganha "simular até a aposentadoria"
 const dm=document.getElementById('dockM');if(dm&&!document.getElementById('fastAll2')){dm.insertAdjacentHTML('beforeend','<button class="dmi" id="fastAll2">🏁 Simular até a aposentadoria</button>');document.getElementById('fastAll2').onclick=()=>fastForward()}
 if(PANEL&&PANEL.startsWith('hub:'))openHubPanel(PANEL.slice(4));
 // primeira vez: dica rápida em toast
 S.tips=S.tips||{};if(!S.tips.one&&typeof toast==='function'){S.tips.one=true;toast({ic:'👆',title:'Tudo numa tela',txt:'Jogos, tabela, copas e troféus estão nos botões. ⚽ embaixo joga.',ms:4200})}
}
// sair do hub limpa o modo
const _shellOS=shell;
shell=function(inner,opts={}){document.body.classList.remove('onescreen','plan1','rep1');return _shellOS(inner,opts)};
const _pageOS=page;page=function(...a){document.body.classList.remove('onescreen','plan1','rep1');closePanel();return _pageOS.apply(this,a)};

// ---------- PRÉ-TEMPORADA ----------
let PLAN_PANEL=null;
const _renderPlanningOS=renderPlanning;
renderPlanning=function(...a){
 const r=_renderPlanningOS.apply(this,a);
 try{oneScreenPlanning()}catch(e){console.error(e)}
 return r;
};
function oneScreenPlanning(){
 const w=$app.querySelector('.wrap');if(!w)return;
 document.body.classList.add('onescreen','plan1');w.classList.add('planw');
 w.querySelectorAll(':scope > .lifefold, :scope > .hist, :scope > .row').forEach(e=>e.remove());
 const secs=[...w.querySelectorAll(':scope > .step')];
 const train=secs.find(s=>/Treino/.test(s.textContent)&&s.querySelector('.stepttl b')&&s.querySelector('.stepttl b').textContent==='2');
 const reqs=w.querySelector(':scope > details.fold');
 const loan=[...w.querySelectorAll(':scope > section.card.plan')].find(s=>s.querySelector('[data-loan]'));
 const more=w.querySelector(':scope > .moreopts');
 const tiles=document.createElement('div');tiles.className='plantiles';
 const T=[];
 if(loan)T.push(['loan','🔁','Proposta de empréstimo','O clube quer te emprestar',loan,true]);
 if(train)T.push(['train','🏋️','Treino','Mini game da pré-temporada',train]);
 if(reqs){reqs.open=true;const renew=!S.loan&&S.contract<=1;T.push(['reqs','📝','Pedidos ao clube',renew?'Inclui a renovação':'Camisa, braçadeira, aumento',reqs,renew])}
 T.push(['agent','📞','Empresário',`${S.agentUses} ligações`,null]);
 T.push(['life','🏠','Vida e loja','Compras, relações',null]);
 tiles.innerHTML=T.map(([k,ic,n,d,,hot])=>`<button class="ptile ${hot?'hot':''}" data-pt="${k}"><span>${ic}</span><b>${n}</b><small>${d}</small></button>`).join('');
 [train,reqs,loan,more].forEach(n=>n&&n.remove());
 const style=secs.find(s=>s.querySelector('.behs [data-beh]'));
 (style||w.lastElementChild).after(tiles);
 const cta=w.querySelector(':scope > .ctabar');if(cta)w.appendChild(cta);
 tiles.querySelectorAll('[data-pt]').forEach(b=>b.onclick=()=>{const k=b.dataset.pt;const t=T.find(x=>x[0]===k);
  if(k==='agent'){openAgent(()=>renderPlanning(),{market:true});return}
  if(k==='life'){openLife(renderPlanning);return}
  PLAN_PANEL=k;openPanelNode(`${t[1]} ${t[2]}`,t[4],'plan:'+k)});
 if(PANEL&&PANEL.startsWith('plan:')){const k=PANEL.slice(5);const t=T.find(x=>x[0]===k);if(t&&t[4])openPanelNode(`${t[1]} ${t[2]}`,t[4],'plan:'+k);else closePanel()}
}
const _startPreOS=startPreseason;
startPreseason=function(...a){closePanel();return _startPreOS.apply(this,a)};

// ---------- BALANÇO ----------
const _renderReportOS=renderReport;
renderReport=function(ls){
 const r=_renderReportOS.call(this,ls);
 try{
  const w=$app.querySelector('.wrap');document.body.classList.add('onescreen','rep1');w.classList.add('repw');
  w.querySelectorAll(':scope > .lifefold, :scope > .hist, :scope > .row').forEach(e=>e.remove());
  const card=w.querySelector(':scope > section.card');const blocks=[];
  card.querySelectorAll(':scope > div').forEach(d=>{const e=d.querySelector(':scope > .eyebrow');if(e&&/Prêmios individuais|Vencedores do ano/.test(e.textContent))blocks.push([e.textContent,d])});
  const news=[...card.querySelectorAll(':scope > .news')].slice(1);
  if(blocks.length||news.length){
   const tiles=document.createElement('div');tiles.className='plantiles';
   const T=[];const aw=blocks.find(b=>/Prêmios/.test(b[0]));const yw=blocks.find(b=>/Vencedores/.test(b[0]));
   if(aw)T.push(['aw','🏅','Seus prêmios',`${ls.awards.length} no ano`,aw[1]]);
   if(yw)T.push(['yw','🌍','Vencedores do ano','Bola de Ouro e mais',yw[1]]);
   if(news.length){const box=document.createElement('div');box.style.cssText='display:grid;gap:8px';news.forEach(n=>box.appendChild(n));T.push(['nw','📰','Notícias',`${news.length} novidade${news.length>1?'s':''}`,box])}
   tiles.innerHTML=T.map(([k,ic,n,d])=>`<button class="ptile ${k==='aw'?'hot':''}" data-rt="${k}"><span>${ic}</span><b>${n}</b><small>${d}</small></button>`).join('');
   blocks.forEach(b=>b[1].remove());card.appendChild(tiles);
   tiles.querySelectorAll('[data-rt]').forEach(b=>b.onclick=()=>{const t=T.find(x=>x[0]===b.dataset.rt);openPanelNode(`${t[1]} ${t[2]}`,t[4].cloneNode(true))});
  }
 }catch(e){console.error(e)}
 return r;
};
