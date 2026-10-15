// ================== CARREIRA COMEÇA NA BASE (só competições de base até subir) ==================
var HIDDEN_PRO=false;
function isHiddenPro(it){const st=S&&S.st;if(!st||!S.youth||!it)return false;if(['yl','debut','ev','intl'].includes(it.k))return false;const c=it.cid&&st.comps[it.cid];if(c&&c.youth)return false;if(it.k==='lg'&&st.debutNext)return false;return true}
const _processItemY=processItem;
processItem=async function(it,io){
 if(isHiddenPro(it)){const n=S.st.log.length;HIDDEN_PRO=true;try{await _processItemY(it,IO_AUTO)}finally{HIDDEN_PRO=false}S.st.log.length=n;return null}
 return _processItemY(it,io);
};
const _isDecisiveY=isDecisive;isDecisive=function(it){if(isHiddenPro(it))return false;return _isDecisiveY(it)};
const visItem=it=>it.k!=='ev'&&it.k!=='debut'&&!isHiddenPro(it);
nextItem=function(){const st=S.st;if(!st)return null;for(let i=st.idx;i<st.cal.length;i++){if(visItem(st.cal[i]))return st.cal[i]}return null};
blockEnd=function(st){const ms=[];st.cal.forEach((it,i)=>{if(visItem(it))ms.push(i)});const n=ms.length;if(!n)return st.cal.length;const cuts=[1,2,3].map(k=>ms[Math.max(0,Math.floor(n*k/4)-1)]+1);cuts.push(st.cal.length);return cuts.find(c=>c>st.idx)||st.cal.length};
blockInfo=function(st){const ms=[];st.cal.forEach((it,i)=>{if(visItem(it))ms.push(i)});const n=Math.max(1,ms.length);const played=ms.filter(i=>i<st.idx).length;const b=Math.min(4,Math.floor(played/(n/4))+1);const nextEnd=blockEnd(st);const left=ms.filter(i=>i>=st.idx&&i<nextEnd).length;return{b,n,played,left}};
const _nextMatchInfoY=nextMatchInfo;
nextMatchInfo=function(){if(!S.youth)return _nextMatchInfoY();const st=S.st;const save=st.idx;const it=nextItem();if(!it)return null;const i=st.cal.indexOf(it);st.idx=i;try{return _nextMatchInfoY()}finally{st.idx=save}};
// só competições de base nas abas e na pré-temporada
function withYouthComps(fn){const st=S.st;if(!S.youth||!st)return fn();const all=st.comps;st.comps=Object.fromEntries(Object.entries(all).filter(([k,c])=>c.youth));try{return fn()}finally{st.comps=all}}
const _tabContentY=tabContent;
tabContent=function(){
 const st=S.st;
 if(S.youth&&TAB==='tabela'&&st.comps.yl&&st.comps.yl.gtab){const c=st.comps.yl;const t=sortTable(c.gtab);
  return`<div class="eyebrow">${esc(c.n)} · ${seasonLbl(S.year)}</div><div style="overflow-x:auto"><table class="std"><thead><tr><th></th><th>#  CLUBE</th><th>P</th><th>J</th><th>V</th><th>E</th><th>D</th><th>SG</th></tr></thead><tbody>${t.map((x,i)=>`<tr class="${x.id===S.club?'me':''}"><td class="zone ${i===0?'c':''}"></td><td><span style="display:inline-flex;gap:6px;align-items:center"><span class="mono muted">${i+1}</span>${shieldHTML(CLUB[x.id],'sm')}${esc(CLUB[x.id].n)} <span class="muted">${esc(ysuf(x.id))}</span></span></td><td class="mono"><b>${x.p}</b></td><td class="mono">${x.j}</td><td class="mono">${x.v}</td><td class="mono">${x.e}</td><td class="mono">${x.d}</td><td class="mono">${x.gp-x.gc}</td></tr>`).join('')}</tbody></table></div><div class="legend-z"><span><i style="background:var(--accent)"></i>Campeão da base</span></div>`}
 if(S.youth&&TAB==='copas')return withYouthComps(_tabContentY);
 return _tabContentY();
};
const _renderPlanningY=renderPlanning;renderPlanning=function(...a){return withYouthComps(()=>_renderPlanningY.apply(this,a))};
// fim de temporada da base: sem títulos do profissional
const _endSeasonY=endSeason;
endSeason=function(){
 const st=S.st;const wasYouth=S.youth&&!S.flags.debuted;
 if(wasYouth){st.titles=st.titles.filter(t=>t.t==='base');st.noPro=true}
 const ls=_endSeasonY();
 if(wasYouth&&ls){ls.youthSeason=true;ls.myMove=null;if(st.comps.yl){ls.leagueName=st.comps.yl.n;ls.rank=st.comps.yl.rank||ls.rank}}
 return ls;
};
// carreiras novas começam na base
const _finishDraftY=finishDraft;finishDraft=function(){_finishDraftY();if(S){S.flags.pro=false}};
// visão da base: tabela, estatísticas e nome da liga são os do sub-20
function withYouthView(fn){const st=S&&S.st;if(!S||!S.youth||!st||!st.comps.yl||!st.comps.yl.gtab)return fn();
 const tb=st.table,ss=st.stats,L=LG[st.lg],ln=L.n;st.table=st.comps.yl.gtab;st.stats={Y:ss.Base||{j:0,g:0,a:0,ns:0,nn:0,cs:0}};L.n=st.comps.yl.n;
 try{return fn()}finally{st.table=tb;st.stats=ss;L.n=ln}}
const _blockCardY=blockCardHTML;blockCardHTML=function(...a){return withYouthView(()=>_blockCardY.apply(this,a))};
if(typeof oneScreenHub==='function'){const _oshY=oneScreenHub;oneScreenHub=function(...a){return withYouthView(()=>_oshY.apply(this,a))}}
