// ================== EMPRESÁRIO (a temporada toda) ==================
const AGENT_QUOTA={tubarao:5,normal:4,pai:3};
const AGENT_NAME={tubarao:'Empresário tubarão',normal:'Agência séria',pai:'Seu pai'};
function agentCallClub(id){
 const c=CLUB[id];if(!c||id===S.club)return{none:true,txt:'Esse já é o seu clube.'};
 const ag=S.agent==='tubarao'?2:S.agent==='pai'?-2:0;const ls=S.lastSeason;
 const form=S.st&&S.st.stats?(()=>{const t=Object.values(S.st.stats).reduce((a,s)=>({ns:a.ns+s.ns,nn:a.nn+s.nn}),{ns:0,nn:0});return t.nn?(t.ns/t.nn-6.9)*3:0})():0;
 const p=logi((S.ovr-c.s+3+ag+(S.life.fama-50)/20+form+(S.heart===id?2:0)+(ls&&ls.nota?(ls.nota-7)*2:0))/2.6);
 if(!ch(p))return{none:true,txt:pick([`O ${c.n} agradeceu, mas não tem interesse agora.`,`O diretor do ${c.n} disse que o elenco está fechado.`,`O ${c.n} acha que você ainda não está no nível deles.`])};
 return{offer:{...mkOffer(c),heart:S.heart===id},txt:`O ${c.n} topou conversar e mandou uma proposta.`};
}
function agentCallLeague(l){
 const offs=genOffers(l).slice(0,3);
 return offs.length?{offers:offs,txt:`Seu empresário ligou pra clubes da ${LG[l].n}.`}:{none:true,txt:`Nenhum clube da ${LG[l].n} se interessou.`};
}
let AGR={res:null,mode:'league',lg:null,clubId:null,loanLg:''};
function loanOffers(lgf,k=3){
 const exclude=new Set([S.club,S.loan&&S.loan.parent]);
 let pool=CLUBS.filter(x=>!exclude.has(x.id)&&x.s>=S.ovr-7&&x.s<=S.ovr+1&&(!lgf||x.l===lgf));
 if(pool.length<k)pool=CLUBS.filter(x=>!exclude.has(x.id)&&(!lgf||x.l===lgf)).sort((a,b)=>Math.abs(a.s-S.ovr+2)-Math.abs(b.s-S.ovr+2)).slice(0,6);
 return shuffle(pool).sort((a,b)=>b.s-a.s+R(-4,4)).slice(0,k).map(x=>({club:x.id,loan:true,years:1,wage:S.wage,role:roleFor(S.ovr,x.s,S.age)}));
}
function canLoan(){return!S.loan&&S.club&&S.contract>=(AG_MARKET?1:2)}
function agentPanel(){
 const lgOpts=Object.entries(LG).map(([k,v])=>`<option value="${k}" ${AGR.lg===k?'selected':''}>${COUNTRY[v.c].f} ${esc(v.n)}</option>`).join('');
 const clubOpts=Object.keys(LG).map(l=>`<optgroup label="${esc(LG[l].n)}">${CLUBS.filter(c=>c.l===l&&c.id!==S.club).sort((a,b)=>b.s-a.s).map(c=>`<option value="${esc(c.id)}" ${AGR.clubId===c.id?'selected':''}>${esc(c.n)} ${'★'.repeat(stars(c.s))}</option>`).join('')}</optgroup>`).join('');
 const r=AGR.res;const ag=S.agreed;
 return`<div class="ovwrap agent"><div class="row" style="justify-content:space-between"><span class="eyebrow">📞 ${AGENT_NAME[S.agent]||'Empresário'}</span><span class="chip ${S.agentUses>0?'':'down'}">${S.agentUses} ligações nesta temporada</span></div>
 <h2 class="pkh" style="text-align:left">Ligar pros clubes</h2>
 <p class="muted" style="margin:4px 0 10px;text-align:left;font-size:14px">${AG_MARKET?'Janela aberta: proposta aceita aqui vale na hora, antes da temporada começar.':`Proposta aceita durante a temporada vira acerto: você termina o ano no ${esc(club().n)} e se muda na janela. A diretoria atual não vai gostar.`}</p>
 ${ag?`<div class="news" style="text-align:left">${shieldHTML(CLUB[ag.club])}<div><b>${ag.loan?'Empréstimo acertado':'Acertado'} com o ${esc(CLUB[ag.club].n)}</b><div class="muted">${ag.loan?'1 temporada · volta depois':`${ag.years} anos · €${ag.wage} mil/sem`} · ${ag.role}. Muda no fim da temporada.</div></div><button class="btn ghost small" id="agCancel">Desfazer</button></div>`:''}
 <div class="tabs" style="margin-top:10px"><button class="tab ${AGR.mode==='league'?'on':''}" data-am="league">Uma liga</button><button class="tab ${AGR.mode==='club'?'on':''}" data-am="club">Um clube</button><button class="tab ${AGR.mode==='loan'?'on':''}" data-am="loan">Empréstimo</button></div>
 ${AGR.mode==='loan'&&!canLoan()?`<div class="muted" style="margin-top:10px;font-size:14px">${S.loan?'Você já está emprestado.':'Seu contrato acaba logo: renove antes de pedir empréstimo.'}</div>`:`<div class="row" style="margin-top:10px">${AGR.mode==='league'?`<select class="input" id="agSel" style="flex:1;min-width:200px">${lgOpts}</select>`:AGR.mode==='club'?`<select class="input" id="agSel" style="flex:1;min-width:200px">${clubOpts}</select>`:`<select class="input" id="agSel" style="flex:1;min-width:200px"><option value="">Qualquer liga</option>${lgOpts.replace(/ selected/g,'')}</select>`}<button class="btn small" id="agCall" ${S.agentUses<=0?'disabled':''}>${AGR.mode==='loan'?'Procurar':'Ligar'}</button></div>${AGR.mode==='loan'?'<div class="muted" style="font-size:13px;margin-top:6px">Uma temporada fora, jogando mais. Seu contrato e salário continuam com o clube atual, e você volta no fim. Se for bem, o clube do empréstimo pode querer te comprar.</div>':''}`}
 <div id="agOut" style="display:grid;gap:8px;margin-top:12px;text-align:left">${r?`<div class="muted">${esc(r.txt)}</div>${(r.offers||(r.offer?[r.offer]:[])).map((o,i)=>`<div class="agoff">${offerCard(o,i).replace('<button class="offer','<div class="offer').replace(/<\/button>$/,'</div>')}<button class="btn small" data-agacc="${i}">${AG_MARKET?(o.loan?'Ir emprestado agora':'Assinar agora'):(o.loan?'Acertar empréstimo pra próxima temporada':'Acertar pra próxima temporada')}</button></div>`).join('')}`:'<div class="muted" style="font-size:14px">Escolha uma liga ou um clube e peça pro empresário ligar.</div>'}</div>
 <button class="btn ghost wide" id="agClose" style="margin-top:12px">Fechar</button></div>`;
}
let AG_MARKET=false;
function openAgent(onClose,opt={}){AG_MARKET=!!opt.market;
 if(!S.agentUses&&S.agentUses!==0)S.agentUses=AGENT_QUOTA[S.agent]||3;
 if(!AGR.lg)AGR.lg=club().l;
 const draw=()=>{$ov.hidden=false;$ov.innerHTML=agentPanel();bind()};
 const bind=()=>{
  $ov.querySelectorAll('[data-am]').forEach(b=>b.onclick=()=>{AGR.mode=b.dataset.am;AGR.res=null;draw()});
  const sel=document.getElementById('agSel');
  if(sel){sel.onchange=()=>{if(AGR.mode==='league')AGR.lg=sel.value;else if(AGR.mode==='club')AGR.clubId=sel.value;else AGR.loanLg=sel.value};
  if(AGR.mode==='club'&&!AGR.clubId)AGR.clubId=sel.value;if(AGR.mode==='loan')sel.value=AGR.loanLg||'';
  document.getElementById('agCall').onclick=()=>{if(S.agentUses<=0)return;S.agentUses--;
   if(AGR.mode==='loan'){const offs=loanOffers(sel.value||null);AGR.res=offs.length?{offers:offs,txt:'Esses clubes topam te receber emprestado por uma temporada.'}:{none:true,txt:'Ninguém quis te receber emprestado agora.'}}
   else AGR.res=AGR.mode==='league'?agentCallLeague(sel.value):agentCallClub(sel.value);draw()}}
  $ov.querySelectorAll('[data-agacc]').forEach(b=>b.onclick=()=>{const r=AGR.res;const o=(r.offers||[r.offer])[+b.dataset.agacc];if(!o)return;
   if(AG_MARKET){$ov.hidden=true;$ov.innerHTML='';AGR.res=null;acceptOffer(o);startPreseason();return}
   S.agreed={...o,stay:false};S.board=clamp(S.board-(o.loan?3:12),0,100);S.life.cab=clamp(S.life.cab-2,0,100);AGR.res={txt:o.loan?`Fechado! Na próxima temporada você joga emprestado no ${CLUB[o.club].n}.`:`Fechado! Você assina com o ${CLUB[o.club].n} no fim da temporada.`};draw();saveNow(S.phase||'season')});
  const c=document.getElementById('agCancel');if(c)c.onclick=()=>{S.agreed=null;S.board=clamp(S.board-4,0,100);AGR.res={txt:'Acerto desfeito. O clube ficou chateado, mas segue a vida.'};draw()};
  document.getElementById('agClose').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';AGR.res=null;onClose&&onClose()};
 };
 draw();
}
function renderAgreedMove(o,from){
 const c=CLUB[o.club];
 shell(`<section class="card" style="display:grid;gap:14px"><div class="eyebrow">Transferência acertada</div><h2 class="h2">De malas prontas</h2>
 <p class="muted" style="margin:0">${o.loan?`Você vai jogar uma temporada emprestado no ${esc(c.n)} e depois volta pro ${esc(CLUB[from].n)}.`:`Você se despede do ${esc(CLUB[from].n)} e assina com o ${esc(c.n)}.`}</p>
 <div class="offers">${offerCard(o,0).replace('<button class="offer','<div class="offer').replace(/<\/button>$/,'</div>')}</div>
 <button class="btn wide" id="goNew">Começar no ${esc(c.n)}</button></section>`,{noFast:true});
 document.getElementById('goNew').onclick=()=>startPreseason();
}
