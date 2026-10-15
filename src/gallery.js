// ================== GALERIA DE TÍTULOS ==================
const TITLE_RANK={copa_mundo:0,cont:1,mun:2,int:3,liga:4,nat:5,olimp:6,copa:7,lcup:8,usc:9,rec:9,super:10,est:11};
const AWARD_RANK={bola:0,bola_top3:1,craque_copa:2,revelacao:3,chuteira:4,luva:5,selecao:6,craque_liga:7,posicao:8,artilheiro:9};
function groupTitles(list){const g={};for(const t of list){const k=t.n;(g[k]=g[k]||{n:t.n,ic:t.ic||t.t,t:t.t,y:[],clubs:[]}).y.push(t.year+1);if(t.club&&!g[k].clubs.includes(t.club))g[k].clubs.push(t.club)}return Object.values(g).sort((a,b)=>(TITLE_RANK[a.t]??20)-(TITLE_RANK[b.t]??20)||b.y.length-a.y.length)}
function groupAwards(list){const g={};for(const a of list){const t=a.t==='craque_copa'?'craque_copa':a.t;const n=a.t==='bola_top3'?'Pódio da Bola de Ouro':a.n.replace(/ · .*/,'');(g[n]=g[n]||{n,ic:t,t,y:[]}).y.push(a.year+1)}return Object.values(g).sort((a,b)=>(AWARD_RANK[a.t]??20)-(AWARD_RANK[b.t]??20)||b.y.length-a.y.length)}
function galCard(g,i){return`<button class="gcard" data-g="${i}" style="animation-delay:${Math.min(i,12)*.05}s"><span class="gcount mono">${g.y.length}×</span><div class="gtro">${TROPHY(g.ic,g.clubs&&g.clubs[0]&&CLUB[g.clubs[0]]?{c1:CLUB[g.clubs[0]].c1,c2:CLUB[g.clubs[0]].c2,n:g.n}:{n:g.n})}</div><div class="gshelf"></div><b class="gname">${esc(g.n)}</b><span class="gyears mono">${g.y.slice(0,6).join(' · ')}${g.y.length>6?' …':''}</span>${g.clubs&&g.clubs.length?`<span class="gclubs">${g.clubs.slice(0,4).map(id=>shieldHTML(CLUB[id]||{id,n:id},'sm')).join('')}</span>`:''}</button>`}
function wishlist(){
 if(!S||!S.club)return[];const c=club();const L=LG[c.l];const C=COUNTRY[c.country];
 const have=new Set([...S.titles.map(t=>t.n),...S.awards.map(a=>a.n)]);
 const w=[[L.n,'liga'],[C.cup,'copa'],[C.conf==='EU'?'Champions League':C.conf==='SA'?'Libertadores':Object.values(CONT_INFO).find(x=>x)?.n,'C'],['Copa do Mundo','copa_mundo'],[NAT_CUP[NATS[S.nat].c],'nat'],['Bola de Ouro','bola'],[S.pos==='GOL'?'Luva de Ouro':'Chuteira de Ouro',S.pos==='GOL'?'luva':'chuteira']];
 if(S.age<=21)w.splice(6,0,['Golden Boy','revelacao']);
 return w.filter(([n])=>n&&!have.has(n)).map(([n,ic])=>({n,ic:ic==='C'?(n==='Champions League'?'orelhas':n==='Libertadores'?'liberta':'cont2'):ic}));
}
function galleryHTML(titles,awards,opts={}){
 const T=groupTitles(titles),A=groupAwards(awards);const nT=titles.length,nA=awards.filter(a=>a.t!=='bola_top3').length;
 const f=opts.filter||'all';
 const sec=(lbl,arr,off)=>arr.length?`<div class="galsec"><div class="eyebrow">${lbl}</div><div class="gal">${arr.map((g,i)=>galCard(g,off+i)).join('')}</div></div>`:'';
 const wl=opts.wish?wishlist():[];
 return`<div class="galhead"><div class="galstat"><b class="mono">${nT}</b><span>títulos</span></div><div class="galstat"><b class="mono">${nA}</b><span>prêmios</span></div><div class="galstat"><b class="mono">${awards.filter(a=>a.t==='bola').length}</b><span>Bolas de Ouro</span></div></div>
 <div class="tabs galtabs">${[['all','Tudo'],['team','Coletivos'],['ind','Individuais']].map(([k,n])=>`<button class="tab ${f===k?'on':''}" data-gf="${k}">${n}</button>`).join('')}</div>
 ${f!=='ind'?sec('Títulos coletivos',T,0)||(f==='team'?'<div class="muted">Nenhum título ainda. A primeira taça vem aí.</div>':''):''}
 ${f!=='team'?sec('Prêmios individuais',A,100)||(f==='ind'?'<div class="muted">Nenhum prêmio individual ainda.</div>':''):''}
 ${f==='all'&&!T.length&&!A.length?'<div class="muted">A estante está vazia. Cada título e prêmio que você ganhar aparece aqui.</div>':''}
 ${wl.length&&f==='all'?`<div class="galsec"><div class="eyebrow">Na mira</div><div class="gal wish">${wl.map(g=>`<div class="gcard locked"><div class="gtro">${TROPHY(g.ic,{n:g.n})}</div><div class="gshelf"></div><b class="gname">${esc(g.n)}</b><span class="gyears">Ainda não</span></div>`).join('')}</div></div>`:''}
 <div id="gdetail"></div>`;
}
function bindGallery(titles,awards,rerender){
 const T=groupTitles(titles),A=groupAwards(awards);
 document.querySelectorAll('[data-gf]').forEach(b=>b.onclick=()=>rerender(b.dataset.gf));
 document.querySelectorAll('.gcard[data-g]').forEach(b=>b.onclick=()=>{const i=+b.dataset.g;const g=i>=100?A[i-100]:T[i];if(!g)return;
  $ov.hidden=false;$ov.innerHTML=`<div class="ovwrap celeb"><div class="rays"></div><div class="eyebrow">${i>=100?'Prêmio individual':'Título coletivo'}</div>
  <div class="tro-stage"><div class="tro rise">${TROPHY(g.ic,g.clubs&&g.clubs[0]&&CLUB[g.clubs[0]]?{c1:CLUB[g.clubs[0]].c1,c2:CLUB[g.clubs[0]].c2,n:g.n}:{n:g.n})}</div><div class="plinth"></div></div>
  <h2 class="champ" style="font-size:56px">${g.y.length}×</h2><div class="cname">${esc(g.n)}</div>
  <div class="gyrs">${g.y.map(y=>`<span class="chip gold">${y}</span>`).join('')}</div>
  ${g.clubs&&g.clubs.length?`<div class="row" style="justify-content:center;margin-top:10px">${g.clubs.map(id=>`<span class="row" style="gap:6px">${shieldHTML(CLUB[id]||{id,n:id},'sm')}<span>${esc((CLUB[id]||{n:id}).n)}</span></span>`).join('')}</div>`:''}
  <button class="btn wide" id="celOk" style="margin-top:14px">Fechar</button></div>`;
  document.getElementById('celOk').onclick=()=>{$ov.hidden=true;$ov.innerHTML=''}});
}
