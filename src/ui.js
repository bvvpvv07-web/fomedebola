// ================== UI ==================
const $app=document.getElementById('app');const $ov=document.getElementById('overlay');
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt1=v=>v==null?'—':Number(v).toFixed(1).replace('.',',');
const fmt2=v=>v==null?'—':Number(v).toFixed(2).replace('.',',');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep=ms=>new Promise(r=>setTimeout(r,reduced?0:ms));
function pickInk(c1){const hex=(c1||'#555').replace('#','');const n=parseInt(hex.length===3?hex.split('').map(x=>x+x).join(''):hex,16);const r=n>>16,g=(n>>8)&255,b=n&255;return(r*299+g*587+b*114)/1000>150?'#151515':'#fff'}
function shieldHTML(c,size=''){
 if(!c)return'';
 if(c.nat||(c.f&&!c.c1))return`<span class="flagbox" title="${esc(c.n)}">${c.f||'🏳️'}</span>`;
 const bid=typeof CLOUD!=='undefined'&&CLOUD.badges[c.id];if(bid)return`<span class="shield img ${size}" title="${esc(c.n)}"><img src="/_blob/${esc(bid)}" alt=""></span>`;
 {const cn=(CLUB[c.id]&&CLUB[c.id].n)||c.n;const ab=typeof ASSET_B!=='undefined'&&ASSET_B[normName(cn)];if(ab)return`<span class="shield img ${size}" title="${esc(cn)}"><img src="${ab}" alt="" loading="lazy"></span>`}
 const cc=CLUB[c.id]||c;const c1=cc.c1||'#555',c2=cc.c2||'#ccc',a=cc.a||String(cc.n||'').slice(0,3).toUpperCase();
 return`<span class="shield ${size}" style="background:linear-gradient(135deg,${c1} 0 55%,${c2} 55%);color:${pickInk(c1)}" title="${esc(cc.n)}"><span style="background:${c1};padding:0 3px;border-radius:3px">${esc(a)}</span></span>`;
}
const starsHTML=s=>'★'.repeat(stars(s))+'<span style="opacity:.25">'+'★'.repeat(5-stars(s))+'</span>';
const ICONS={
 liga:'<svg viewBox="0 0 32 32"><path d="M16 3l11 4v8c0 7-5 12-11 14C10 27 5 22 5 15V7z" fill="currentColor" opacity=".25"/><path d="M16 3l11 4v8c0 7-5 12-11 14C10 27 5 22 5 15V7z" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 10l1.8 3.7 4 .6-2.9 2.8.7 4L16 19.2 12.4 21l.7-4-2.9-2.8 4-.6z" fill="currentColor"/></svg>',
 copa:'<svg viewBox="0 0 32 32"><path d="M9 5h14v6a7 7 0 0 1-14 0z" fill="currentColor"/><path d="M9 7H5c0 4 2 6 5 6M23 7h4c0 4-2 6-5 6" fill="none" stroke="currentColor" stroke-width="2"/><path d="M13 18h6l1 5h-8z" fill="currentColor"/><rect x="9" y="24" width="14" height="3" rx="1" fill="currentColor"/></svg>',
 lcup:'<svg viewBox="0 0 32 32"><ellipse cx="16" cy="12" rx="11" ry="5" fill="currentColor"/><path d="M13 16h6l1 7h-8z" fill="currentColor"/><rect x="9" y="24" width="14" height="3" rx="1" fill="currentColor"/></svg>',
 super:'<svg viewBox="0 0 32 32"><path d="M11 6h10l-1 8a4 4 0 0 1-8 0z" fill="currentColor"/><path d="M14 17h4v6h-4z" fill="currentColor"/><path d="M10 24h12l1 3H9z" fill="currentColor"/><circle cx="16" cy="3.5" r="2" fill="currentColor"/></svg>',
 est:'<svg viewBox="0 0 32 32"><path d="M8 4h16v8a8 8 0 0 1-16 0z" fill="currentColor"/><path d="M16 9l1.2 2.4 2.6.4-1.9 1.8.5 2.6-2.4-1.2-2.4 1.2.5-2.6-1.9-1.8 2.6-.4z" fill="#241a00"/><path d="M14 20h4v4h-4z" fill="currentColor"/><path d="M8 25h16v3H8z" fill="currentColor"/></svg>',
 orelhas:'<svg viewBox="0 0 32 32"><path d="M11 4h10v8a5 5 0 0 1-10 0z" fill="currentColor"/><path d="M11 6C4 4 3 15 11 14M21 6c7-2 8 9 0 8" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M14 16h4l2 8h-8z" fill="currentColor"/><rect x="9" y="25" width="14" height="3" rx="1" fill="currentColor"/></svg>',
 liberta:'<svg viewBox="0 0 32 32"><path d="M10 7h12l-2 8a4 4 0 0 1-8 0z" fill="currentColor"/><circle cx="16" cy="4.5" r="2.5" fill="currentColor"/><path d="M13 18h6l2 7H11z" fill="currentColor"/><rect x="8" y="25" width="16" height="3" rx="1" fill="currentColor"/></svg>',
 cont2:'<svg viewBox="0 0 32 32"><path d="M10 4h12v7a6 6 0 0 1-12 0z" fill="currentColor"/><path d="M10 6C4 6 3 13 9 15M22 6c6 0 7 7 1 9" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M14 17h4l1.5 7h-7z" fill="currentColor"/><rect x="9" y="25" width="14" height="3" rx="1" fill="currentColor"/></svg>',
 cont3:'<svg viewBox="0 0 32 32"><path d="M12 4h8l2 12h-12z" fill="currentColor"/><path d="M14 17h4v7h-4z" fill="currentColor"/><rect x="9" y="25" width="14" height="3" rx="1" fill="currentColor"/></svg>',
 globo:'<svg viewBox="0 0 32 32"><circle cx="16" cy="11" r="7.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M8.5 11h15M16 3.5c3 3 3 12 0 15M16 3.5c-3 3-3 12 0 15" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M12 19h8l1 5H11z" fill="currentColor"/><rect x="9" y="25" width="14" height="3" rx="1" fill="currentColor"/></svg>',
 mundial:'<svg viewBox="0 0 32 32"><circle cx="16" cy="11" r="8" fill="currentColor"/><path d="M8 11h16M16 3c3.5 3 3.5 13 0 16M16 3c-3.5 3-3.5 13 0 16" fill="none" stroke="#241a00" stroke-width="1.2"/><path d="M11 20h10l2 5H9z" fill="currentColor"/><rect x="8" y="26" width="16" height="3" rx="1" fill="currentColor"/></svg>',
 copa_mundo:'<svg viewBox="0 0 32 32"><circle cx="16" cy="9" r="6.5" fill="currentColor"/><path d="M10 13c1 4 3 6 3 12h6c0-6 2-8 3-12" fill="currentColor"/><path d="M13 9h6M16 4v10" stroke="#241a00" stroke-width="1.2"/><rect x="10" y="25" width="12" height="3.5" rx="1" fill="currentColor"/></svg>',
 nat:'<svg viewBox="0 0 32 32"><path d="M8 4h16l-2 10a6 6 0 0 1-12 0z" fill="currentColor"/><path d="M14 19h4v5h-4z" fill="currentColor"/><path d="M9 25h14l1 3H8z" fill="currentColor"/><path d="M16 6l1.2 2.5 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4z" fill="#241a00"/></svg>',
 olimp:'<svg viewBox="0 0 32 32"><path d="M10 3l6 9 6-9" fill="none" stroke="currentColor" stroke-width="2.6"/><circle cx="16" cy="20" r="8" fill="currentColor"/><circle cx="16" cy="20" r="4.5" fill="none" stroke="#241a00" stroke-width="1.4"/></svg>',
 bola:'<svg viewBox="0 0 32 32"><circle cx="16" cy="13" r="10" fill="currentColor"/><path d="M16 7l4 3-1.5 5h-5L12 10z" fill="#241a00"/><path d="M11 24h10l1 4H10z" fill="currentColor"/></svg>',
 bola_top3:'<svg viewBox="0 0 32 32"><circle cx="16" cy="14" r="10" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M16 8l4 3-1.5 5h-5L12 11z" fill="currentColor"/></svg>',
 chuteira:'<svg viewBox="0 0 32 32"><path d="M5 10h8l2 6 10 3c2 .6 3 2 3 4v2H5z" fill="currentColor"/><path d="M8 27v2M13 27v2M19 27v2M25 27v2" stroke="currentColor" stroke-width="2"/></svg>',
 luva:'<svg viewBox="0 0 32 32"><path d="M9 14V7a2 2 0 0 1 4 0v6V5a2 2 0 0 1 4 0v8V6a2 2 0 0 1 4 0v8-5a2 2 0 0 1 4 0v10c0 6-4 10-9 10s-8-3-9-7l-2-6a2 2 0 0 1 4-1z" fill="currentColor"/></svg>',
 selecao:'<svg viewBox="0 0 32 32"><path d="M16 3l3.6 7.6 8.4 1.1-6.1 5.8 1.5 8.3L16 21.8 8.6 25.8l1.5-8.3L4 11.7l8.4-1.1z" fill="currentColor"/></svg>',
 revelacao:'<svg viewBox="0 0 32 32"><path d="M16 4v24M8 10c4 0 8 2 8 8M24 8c-4 0-8 3-8 8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
 craque_liga:'<svg viewBox="0 0 32 32"><rect x="7" y="4" width="18" height="22" rx="3" fill="currentColor"/><path d="M16 9l1.8 3.7 4 .6-2.9 2.8.7 4L16 18.2 12.4 20l.7-4-2.9-2.8 4-.6z" fill="#241a00"/></svg>',
 artilheiro:'<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="11" fill="currentColor"/><path d="M16 9l4.5 3.3-1.7 5.2h-5.6l-1.7-5.2z" fill="#241a00"/><path d="M16 9v-4M20.5 12.3l4-1.5M18.8 17.5l2.6 3.6M13.2 17.5l-2.6 3.6M11.5 12.3l-4-1.5" stroke="#241a00" stroke-width="1.4"/></svg>',
 craque_copa:'<svg viewBox="0 0 32 32"><circle cx="16" cy="13" r="10" fill="currentColor"/><path d="M10 13h12M16 3c3 3 3 17 0 20M16 3c-3 3-3 17 0 20" fill="none" stroke="#241a00" stroke-width="1.2"/><path d="M11 24h10l1 4H10z" fill="currentColor"/></svg>',
 idolo:'<svg viewBox="0 0 32 32"><path d="M16 27s-11-6.5-11-14a6 6 0 0 1 11-3.3A6 6 0 0 1 27 13c0 7.5-11 14-11 14z" fill="currentColor"/></svg>',
 estatua:'<svg viewBox="0 0 32 32"><circle cx="16" cy="6" r="3.5" fill="currentColor"/><path d="M12 10h8l1 9h-3v5h-4v-5h-3z" fill="currentColor"/><rect x="8" y="25" width="16" height="4" rx="1" fill="currentColor"/></svg>',
};
let ICON=k=>ICONS[k]||ICONS.copa;

function hallLoad(){try{return JSON.parse(localStorage.getItem('fdb_hall2')||'[]')}catch(e){return[]}}
function hallSave(e){try{const h=hallLoad();h.push(e);h.sort((a,b)=>b.pts-a.pts);localStorage.setItem('fdb_hall2',JSON.stringify(h.slice(0,12)))}catch(e){}}

// ---------- CREATE ----------
const CR={name:'',nat:'BRA',pos:'ATA',diff:'pro',num:9,heart:''};
function heartOptions(){
 let h='<option value="">Nenhum</option>';
 for(const l in LG){h+=`<optgroup label="${esc(LG[l].n)}">`+CLUBS.filter(c=>c.l===l).sort((a,b)=>a.n.localeCompare(b.n)).map(c=>`<option value="${esc(c.id)}" ${CR.heart===c.id?'selected':''}>${esc(c.n)}</option>`).join('')+'</optgroup>'}
 return h;
}
function renderCreate(){
 const p=POS[CR.pos];
 $app.innerHTML=`<div class="wrap">
 <div class="phead"><h2>Quem é você?</h2><p>Quatro escolhas rápidas. A posição é a mais importante: ela muda gols, lesões e prêmios.</p></div>
 <section class="card step" style="display:grid;gap:16px"><div class="stepttl"><b>1</b>Nome, número e país</div>
  <div class="row" style="align-items:flex-end">
   <div class="field" style="flex:3;min-width:180px"><label class="eyebrow" for="nm">Nome</label><input class="input" id="nm" maxlength="18" placeholder="Como vão te chamar na narração" value="${esc(CR.name)}"></div>
   <div class="field" style="flex:1;min-width:80px"><label class="eyebrow" for="num">Número</label><input class="input mono" id="num" type="number" min="1" max="99" value="${CR.num}"></div>
  </div>
  <div class="field"><span class="eyebrow">Nacionalidade · deslize para ver mais</span><div class="chips scrollx">${Object.entries(NATS).map(([k,v])=>`<button class="opt ${CR.nat===k?'on':''}" data-nat="${k}">${v.f} ${v.n}</button>`).join('')}</div></div>
  <div class="field"><label class="eyebrow" for="heart">Time do coração · opcional</label><select class="input" id="heart">${heartOptions()}</select><span class="muted" style="font-size:13px">Jogar por ele te deixa mais feliz, pede um título a menos pra virar ídolo e ele pode te ligar no mercado.</span></div>
 </section>
 <section class="card step" style="display:grid;gap:12px">
  <div class="stepttl"><b>2</b>Sua posição<span>toque no campo</span></div>
  <div class="pitch">
   <div class="ln" style="left:-2px;right:-2px;top:50%;height:0;border-width:2px 0 0"></div>
   <div class="ln" style="left:50%;top:50%;width:26%;aspect-ratio:1;border-radius:50%;transform:translate(-50%,-50%)"></div>
   <div class="ln" style="left:22%;right:22%;bottom:-2px;height:17%"></div>
   <div class="ln" style="left:36%;right:36%;bottom:-2px;height:6%"></div>
   <div class="ln" style="left:22%;right:22%;top:-2px;height:17%"></div>
   ${POS_ORDER.map(k=>`<button class="pbtn ${CR.pos===k?'on':''}" data-pos="${k}" style="left:${POS[k].x}%;top:${POS[k].y}%">${k}</button>`).join('')}
  </div>
  <div><b style="font-family:var(--f-display);font-size:24px">${p.n}</b> <span class="muted">· mais pesam: ${Object.entries(p.w).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${ATTR_NAME[k]} ${Math.round(v*100)}%`).join(', ')}</span></div>
  <div class="posinfo">${p.info.map(t=>`<div><small>Característica</small><b>${t}</b></div>`).join('')}</div>
 </section>
 <section class="card step" style="display:grid;gap:10px">
  <div class="stepttl"><b>3</b>Dificuldade</div>
  <div class="chips">${Object.entries(DIFF).map(([k,v])=>`<button class="opt ${CR.diff===k?'on':''}" data-diff="${k}">${v.n}</button>`).join('')}</div>
  <div class="muted">${DIFF[CR.diff].d}</div>
 </section>
 <section class="card step" style="display:grid;gap:10px">
  <div class="stepttl"><b>4</b>Ritmo do jogo<span>dá pra trocar depois</span></div>
  <div class="behs"><button class="beh ${CR.fast!==false?'on':''}" data-fast="1"><b>⚡ Rápido</b><span>Temporada em 4 blocos. Só as finais ao vivo. Uma carreira em poucos minutos.</span></button><button class="beh ${CR.fast===false?'on':''}" data-fast="0"><b>🗓️ Completo</b><span>Semana a semana: dias livres, lances em todo jogo, mata-mata ao vivo.</span></button></div>
 </section>
 <div class="ctabar"><button class="btn wide cta" id="next">Ir para a peneira →</button><span class="ctahint" id="nextHint">${CR.name.trim()?'':'Falta só o seu nome lá em cima.'}</span></div></div>`;
 const nm=document.getElementById('nm');nm.oninput=()=>{CR.name=nm.value;const h=document.getElementById('nextHint');if(h)h.textContent=CR.name.trim()?'':'Falta só o seu nome lá em cima.'};
 const num=document.getElementById('num');num.oninput=()=>CR.num=clamp(parseInt(num.value)||10,1,99);
 document.getElementById('heart').onchange=e=>CR.heart=e.target.value;
 $app.querySelectorAll('[data-nat]').forEach(b=>b.onclick=()=>{CR.nat=b.dataset.nat;renderCreate()});
 $app.querySelectorAll('[data-pos]').forEach(b=>b.onclick=()=>{CR.pos=b.dataset.pos;renderCreate()});
 $app.querySelectorAll('[data-diff]').forEach(b=>b.onclick=()=>{CR.diff=b.dataset.diff;renderCreate()});
 $app.querySelectorAll('[data-fast]').forEach(b=>b.onclick=()=>{CR.fast=b.dataset.fast==='1';renderCreate()});
 document.getElementById('next').onclick=()=>{if(!CR.name.trim()){nm.focus();nm.placeholder='Digite um nome pra continuar';nm.style.borderColor='var(--accent)';return}startDraft()};
}

// ---------- DRAFT ----------
const DR={};
function startDraft(){DR.attrs={};DR.round=0;DR.re=DIFF[CR.diff].re;DR.bag=LEGENDS.map((_,i)=>i);drawLegend();renderDraft()}
function drawLegend(){
 const wOf=i=>{const p=LEGENDS[i][2];if(p===CR.pos)return CR.pos==='GOL'?7:3;if(NEIGH[CR.pos].includes(p))return 1.8;return 1};
 const i=wpick(DR.bag,wOf);DR.bag=DR.bag.filter(x=>x!==i);const L=LEGENDS[i];const pen=CR.diff==='lenda'?-3:CR.diff==='amador'?1:0;
 DR.leg={n:L[0],f:L[1],pos:L[2],ovr:L[3],vals:Object.fromEntries(ATTRS.map((k,j)=>[k,clamp(L[4][j]+RI(-2,1)+pen,10,99)]))};
}
function renderDraft(){
 const w=POS[CR.pos].w;const cur={...DR.attrs};ATTRS.forEach(k=>{if(cur[k]==null)cur[k]=50});
 const L=DR.leg;
 $app.innerHTML=`<div class="wrap">
 <div class="phead"><h2>Roube dos Ícones</h2><p>Cada Ícone oferece um atributo. Toque num quadro laranja para pegar. Quanto maior o <b>peso</b>, mais ele importa para ${esc(POS[CR.pos].n.toLowerCase())}.</p>
 <div class="rounds">${Array.from({length:8},(_,i)=>`<i class="${i<DR.round?'done':i===DR.round?'on':''}"></i>`).join('')}<span>Roubo ${DR.round+1} de 8</span></div></div>
 <section class="card legend"><div class="face"><span class="mono" style="font-size:24px">${L.ovr}</span></div>
  <div style="flex:1;min-width:0"><div class="eyebrow">${L.f} ${POS[L.pos].n} · Ícone FC 27</div><h3 style="font-size:30px;font-weight:900;margin-top:4px">${esc(L.n)}</h3><div class="muted" style="font-size:14px">Escolha um atributo vazio. Ele vira seu e a lenda perde.</div></div></section>
 <div class="slots">${ATTRS.map(k=>{const f=DR.attrs[k]!=null;const wt=w[k]||0;return`<button class="slot ${f?'filled':'take'} ${!wt?'useless':''}" data-a="${k}" ${f?'disabled':''}><span class="k">${k}</span><span class="v mono">${f?DR.attrs[k]:L.vals[k]}</span><span class="w">${ATTR_NAME[k]} · ${wt?`peso ${Math.round(wt*100)}%`:'não conta'}</span></button>`}).join('')}</div>
 <section class="card potbar"><div><div class="eyebrow">Encaixe atual</div><div class="potnum mono">${fit(cur,CR.pos)}</div><div class="muted" style="font-size:12px">vazios contam como 50</div></div>
  <div class="mini">${POS_ORDER.map(k=>{const v=fit(cur,k);return`<div class="${k===CR.pos?'me':''}"><i><s style="height:${clamp((v-40)/59*100,4,100)}%"></s></i>${k}<br>${v}</div>`}).join('')}</div></section>
 <div class="row"><button class="btn ghost small" id="re" ${DR.re<=0?'disabled':''}>Sortear outra lenda (${DR.re})</button><span class="muted" style="font-size:13px">O teto real ainda tem um fator surpresa.</span></div></div>`;
 $app.querySelectorAll('.slot.take').forEach(b=>b.onclick=()=>{DR.attrs[b.dataset.a]=L.vals[b.dataset.a];DR.round++;if(DR.round>=8)finishDraft();else{drawLegend();renderDraft()}});
 document.getElementById('re').onclick=()=>{if(DR.re<=0)return;DR.re--;drawLegend();renderDraft()};
}
function finishDraft(){newCareer({name:CR.name.trim(),num:CR.num,nat:CR.nat,pos:CR.pos,diff:CR.diff,attrs:DR.attrs,heart:CR.heart||null});S.fast=CR.fast!==false;startPeneira()}

// ---------- SHELL ----------
function header(){
 const c=S.club?CLUB[S.club]:null;const nat=NATS[S.nat];
 const sub=c?`${c.n}${S.loan?' (emprestado)':''} · ${LG[c.l].n}`:'Sem clube · peneira';
 return`<header class="ph"><div class="ph-in"><button class="menu" onclick="goHome()" aria-label="Início">☰</button>${c?shieldHTML(c):`<span class="flagbox">${nat.f}</span>`}
 <div class="who"><b>${esc(S.name)} <span style="color:var(--muted);font-weight:600">#${S.shirt}</span>${S.captain?' <span class="tag sel" style="vertical-align:3px">C</span>':''}</b><span>${nat.f} ${S.age} anos · ${POS[S.pos].n} · ${esc(sub)}</span></div>
 <div class="ovr"><b class="mono">${S.ovr}</b><small>OVR</small></div></div></header>`;
}
function lifePanel(){
 const bar=(v,lbl,col)=>`<div class="bar"><small><span>${lbl}</span><span class="mono">${Math.round(v)}</span></small><i><s style="width:${v}%;background:${col}"></s></i></div>`;
 const famTxt=S.rel==='casado'?'Casado':S.rel==='namorando'?'Namorando':'Solteiro';
 const A=CA(),E=typeof effAttrs==='function'?effAttrs():A,W=POS[S.pos].w;
 const attrHTML=`<div class="attrs">${ATTRS.filter(k=>S.pos==='GOL'||k!=='REF').map(k=>{const v=A[k],b=E[k]-v;return`<div class="attr ${W[k]?'key':''}"><span>${ATTR_NAME[k]}</span><b class="mono">${v}${b>0?`<em>+${b}</em>`:''}</b><i><s style="width:${clamp((v-15)/84*100,3,100)}%"></s></i></div>`}).join('')}</div>`;
 return`<section class="card"><div class="row" style="justify-content:space-between"><span class="eyebrow">Atributos hoje</span><span class="eyebrow">OVR ${S.ovr} · pot. ${S.pot}</span></div>${attrHTML}<div class="life" style="margin-top:12px">${bar(S.life.cab,'Cabeça','var(--blue)')}${bar(S.life.corpo,'Corpo','var(--good)')}${bar(S.life.disc,'Disciplina','var(--chalk)')}${bar(S.life.fama,'Fama','var(--gold)')}</div>
 <div class="lifemeta"><span class="chip">Diretoria ${Math.round(S.board)}</span><span class="chip">Patrimônio ${money(S.din+(typeof propValue==='function'?propValue():0))}</span>${S.gf?`<span class="chip">❤ ${esc(S.gf.n)}</span>`:''}${S.boot&&S.bootLeft>0?`<span class="chip gold">👟 ${esc(BOOTS.find(b=>b.id===S.boot).n)}</span>`:''}<span class="chip">${famTxt}${S.filhos?` · ${S.filhos} filho${S.filhos>1?'s':''}`:''}</span><span class="chip">Fala ${S.langs.map(l=>LANG_NAME[l]).join(', ')}</span>${S.club?`<span class="chip">€${S.wage} mil/sem · ${Math.max(0,S.contract)} ano${S.contract===1?'':'s'}</span>`:''}${S.taker.pen?'<span class="chip gold">Pênaltis</span>':''}${S.taker.fk?'<span class="chip gold">Faltas</span>':''}${S.heart?`<span class="chip">♥ ${esc(CLUB[S.heart].n)}</span>`:''}${S.idols.map(id=>`<span class="chip gold">Ídolo · ${esc(CLUB[id].n)}</span>`).join('')}${S.statues.map(id=>`<span class="chip gold">Estátua · ${esc(CLUB[id].n)}</span>`).join('')}</div></section>`;
}
function histTable(open){
 if(!S.history.length)return'';const gk=S.history.some(h=>h.pos==='GOL');
 return`<details class="hist" ${open?'open':''}><summary><span>Carreira</span><span class="mono muted" style="font-size:14px">${S.history.length} temp.</span></summary><div class="tbl"><table>
 <thead><tr><th>IDADE</th><th>CLUBE</th><th>LIGA</th><th>OVR</th><th>J</th><th>G</th><th>A</th>${gk?'<th>SG</th>':''}<th>NOTA</th><th>POS</th><th>TÍT</th></tr></thead><tbody>
 ${S.history.map(h=>{const c=CLUB[h.club];return`<tr><td class="mono">${h.age}</td><td class="club">${shieldHTML(c,'sm')}<span>${esc(c.n)}${h.loan?' <span class="muted">(emp.)</span>':''}</span></td><td>${esc(h.lg)}${h.youth?` <span class="muted" style="font-size:11px">· base ${h.youth.j}j ${h.youth.g}g</span>`:''}${h.move==='up'?' <span class="up">▲</span>':h.move==='down'?' <span class="down">▼</span>':''}</td><td class="mono">${h.ovr}<span class="${h.delta>=0?'up':'down'}" style="font-size:11px"> ${h.delta>0?'+':''}${h.delta||''}</span></td><td class="mono">${h.games}</td><td class="mono">${h.goals}</td><td class="mono">${h.assists}</td>${gk?`<td class="mono">${h.cs??'—'}</td>`:''}<td class="mono">${fmt2(h.nota)}</td><td class="mono">${h.rank}º</td><td style="color:var(--gold)">${h.titles.length||''}${h.awards.includes('bola')?' ●':''}</td></tr>`}).join('')}
 </tbody></table></div></details>`;
}
function shell(inner,opts={}){
 $app.innerHTML=header()+`<div class="wrap">${inner}${opts.noLife?'':opts.lifeFold?`<details class="hist lifefold"><summary><span>Seu jogador</span><span class="mono muted" style="font-size:14px">OVR ${S.ovr} · pot. ${S.pot}</span></summary>${lifePanel()}</details>`:lifePanel()}${opts.noHist?'':histTable(opts.histOpen)}
 ${S.club&&!opts.noFast?'<div class="row" style="justify-content:center"><button class="btn ghost small" id="fastAll">Simular até a aposentadoria</button></div>':''}</div>`;
 const f=document.getElementById('fastAll');if(f)f.onclick=fastForward;
 if(!opts.keepScroll)scrollTo(0,0);
}

// ---------- OFERTAS ----------
function offerCard(o,i){
 const c=CLUB[o.club];const L=LG[c.l];const foreign=!S.langs.includes(COUNTRY[c.country].lang);
 const title=o.stay?(o.renew?`Renovar com o ${c.n}`:`Ficar no ${c.n}`):o.loan?`Empréstimo · ${c.n}`:o.buy?`Ficar em definitivo · ${c.n}`:o.home?`Voltar pra casa · ${c.n}`:o.heart?`♥ ${c.n}`:c.n;
 return`<button class="offer ${o.stay?'stay':''}" data-off="${i}">${shieldHTML(c,'lg')}
 <div style="min-width:0"><h3>${esc(title)}</h3><div class="meta">${COUNTRY[c.country].f} ${esc(L.n)} · <span class="stars">${starsHTML(c.s)}</span></div>
 <div class="terms"><span class="chip">€${o.wage} mil/sem</span><span class="chip">${o.years} ano${o.years>1?'s':''}</span>${foreign?`<span class="chip down">Idioma: ${LANG_NAME[COUNTRY[c.country].lang]}</span>`:''}${o.loan?'<span class="chip gold">Volta após 1 temporada</span>':''}${o.buy?'<span class="chip gold">Quer te comprar</span>':''}${o.heart?'<span class="chip gold">Time do coração</span>':''}${o.academy?'<span class="chip">Categoria de base</span>':''}</div></div>
 <span class="role ${o.role}">${o.role}</span></button>`;
}
function renderAcademy(){
 const offers=academyOffers();
 shell(`<div class="phead"><h2>${offers.length===1?'1 clube te quer':offers.length+' clubes te querem'}</h2><p>Toque no clube onde quer começar. Clube grande treina melhor, mas você joga menos. Clube pequeno te dá minutos. Fora do país, sem falar a língua, pesa na cabeça.</p></div>
 <div class="offers">${offers.map((o,i)=>offerCard(o,i)).join('')}</div>`,{noFast:true,lifeFold:true,noHist:true});
 $app.querySelectorAll('[data-off]').forEach(b=>b.onclick=()=>{acceptOffer(offers[+b.dataset.off]);startPreseason()});
}

// ---------- PRÉ-TEMPORADA ----------
let REQ={},RENEW=null,RENEW_MSG='';
function startPreseason(){S.agentUses=AGENT_QUOTA[S.agent]||3;LOANPROP=null;if(!S.loan&&S.club&&S.contract>=1&&S.age<=23&&['Reserva','Base'].includes(roleFor(S.ovr,club().s,S.age))&&ch(.65))LOANPROP=loanOffers(null,2);if(!S.cid)S.cid='c'+Date.now().toString(36)+Math.floor(Math.random()*1e6).toString(36);buildSeason();REQ={};RENEW=renewalOffer();RENEW_MSG='';LASTR=[];PAUSE=null;TAB='jogos';renderPlanning();saveNow('pre')}
function reqRow(id,title,desc,ctrl){const r=REQ[id];return`<div class="req"><div class="lbl"><b>${title}</b><span>${desc}</span></div>${r?'':ctrl}${r?`<div class="out"><span class="chip ${r.ok?'up':'down'}">${r.ok?'Aceito':'Negado'}</span> ${esc(r.txt)}</div>`:''}</div>`}
function renderPlanning(){
 const c=club();const L=LG[c.l];const st=S.st;
 const comps=Object.values(st.comps).filter(x=>x.kind!=='tour').map(x=>x.n);
 const tours=Object.values(st.comps).filter(x=>x.kind==='tour').map(x=>x.n);
 let renewHTML='';
 if(!S.loan&&S.contract<=1){
  if(RENEW&&RENEW.refuse)renewHTML=`<div class="req"><div class="lbl"><b>Renovação</b><span>O ${esc(c.n)} avisou que não vai renovar. Seu contrato acaba no fim desta temporada.</span></div></div>`;
  else if(RENEW&&!RENEW.done&&!RENEW.withdrawn)renewHTML=`<div class="req"><div class="lbl"><b>Proposta de renovação</b><span>${RENEW.years} anos · €${RENEW.wage} mil/sem</span></div><button class="btn small" id="rnA">Assinar</button><button class="btn ghost small" id="rnN">Pedir mais</button><button class="btn ghost small" id="rnR">Recusar</button>${RENEW_MSG?`<div class="out">${esc(RENEW_MSG)}</div>`:''}</div>`;
  else if(RENEW)renewHTML=`<div class="req"><div class="lbl"><b>Renovação</b><span>${esc(RENEW_MSG)}</span></div></div>`;
 }
 shell(`<section class="card plan">
 <div class="row" style="gap:14px">${shieldHTML(c,'lg')}<div style="flex:1;min-width:0"><div class="eyebrow">Pré-temporada ${seasonLbl(S.year)}</div><h2 style="font-size:34px;font-weight:900;margin-top:4px">${esc(c.n)}</h2><div class="muted">${esc(L.n)} · ${comps.map(esc).join(' · ')}</div>${tours.length?`<div class="muted" style="margin-top:4px">Fim da temporada: ${tours.map(esc).join(' · ')}</div>`:''}</div><span class="role ${roleFor(S.ovr,c.s,S.age)}">${roleFor(S.ovr,c.s,S.age)}</span></div>
 </section>
 <section class="card plan step"><div class="stepttl"><b>1</b>Seu estilo na temporada</div>
 <div class="behs">${Object.entries(BEH).map(([k,b])=>`<button class="beh ${S.behavior===k?'on':''}" data-beh="${k}"><b>${b.n}</b><span>${b.d}</span></button>`).join('')}</div></section>
 ${LOANPROP&&LOANPROP.length?`<section class="card plan"><div class="eyebrow">O ${esc(c.n)} quer te emprestar</div><p class="muted" style="margin:0">Você vai jogar pouco aqui. O clube sugere uma temporada emprestado pra ganhar minutos e voltar melhor.</p><div class="offers">${LOANPROP.map((o,i)=>offerCard(o,i).replace('data-off=','data-loan=')).join('')}</div><button class="btn ghost small" id="loanNo">Prefiro ficar e brigar por vaga</button></section>`:''}
 <section class="card plan step"><div class="stepttl"><b>2</b>Treino da pré-temporada<span>opcional</span></div>${REQ.train?`<div class="line"><span>${esc(REQ.train.txt)}</span><span class="r">${REQ.train.chips.map(([t,k])=>`<span class="chip ${k}">${esc(t)}</span>`).join(' ')}</span></div>`:`<p class="muted" style="margin:0">Mostre serviço pro técnico. Ir bem dá forma pro começo da temporada e pode subir um atributo.</p><div class="behs">${(S.pos==='GOL'?[['reflex','Reflexos','Máquina de chutes, 3 bolas'],['header','Saída aérea','Bolas alçadas na área']]:[['finish','Finalização','3 chutes, a agulha fica mais rápida'],['dribble','Circuito de drible','Leia o zagueiro 3 vezes'],['header','Cabeceio','Bolas alçadas na área']]).map(([k,n,d])=>`<button class="beh" data-tr="${k}"><b>${n}</b><span>${d}</span></button>`).join('')}</div>`}</section>
 <details class="card plan step fold" ${Object.keys(REQ).some(k=>k!=='train')||(RENEW&&!RENEW.done&&!S.loan&&S.contract<=1)?'open':''}><summary class="stepttl"><b>3</b>Pedidos ao clube<span>opcional · camisa, braçadeira, pênaltis, aumento${!S.loan&&S.contract<=1?', renovação':''}</span><em>›</em></summary><div class="reqs">
 ${reqRow('shirt','Pedir outra camisa',`Hoje você usa a ${S.shirt}.`,`<input class="input mono" id="shirtN" type="number" min="1" max="99" value="10" style="width:80px"><button class="btn small" id="rqShirt">Pedir</button>`)}
 ${reqRow('arm','Pedir a braçadeira',S.captain?'Você já é o capitão.':'Depende do seu nível, tempo de casa, idade e disciplina.',S.captain?'':`<button class="btn small" id="rqArm">Pedir</button>`)}
 ${S.pos!=='GOL'?reqRow('pen','Bater os pênaltis',S.taker.pen?'Você já é o batedor.':'Você cobra pessoalmente cada pênalti que o time ganhar.',S.taker.pen?'':`<button class="btn small" id="rqPen">Pedir</button>`):''}
 ${S.pos!=='GOL'?reqRow('fk','Bater as faltas',S.taker.fk?'Você já cobra as faltas.':'Faltas diretas viram chances de gol.',S.taker.fk?'':`<button class="btn small" id="rqFk">Pedir</button>`):''}
 ${!S.loan?reqRow('raise','Pedir aumento',`Hoje: €${S.wage} mil/sem. Se negarem, a diretoria fica de cara feia.`,`<button class="btn small" id="rqRaise">Pedir</button>`):''}
 ${renewHTML}
 </div></details>
 <div class="moreopts"><span class="eyebrow">Também dá pra fazer agora</span><div class="row"><button class="btn ghost small" id="agOpen2">📞 Empresário · ${S.agentUses}</button><button class="btn ghost small" id="lifeOpen2">🏠 Vida, loja e cassino</button></div></div>
 <div class="ctabar"><button class="btn wide cta" id="startS">⚽ Começar a temporada</button></div>`,{noFast:true,lifeFold:true});
 $app.querySelectorAll('[data-beh]').forEach(b=>b.onclick=()=>{S.behavior=b.dataset.beh;renderPlanning()});
 const on=(id,fn)=>{const e=document.getElementById(id);if(e)e.onclick=fn};
 on('rqShirt',()=>{const n=clamp(parseInt(document.getElementById('shirtN').value)||10,1,99);REQ.shirt=askShirt(n);renderPlanning()});
 on('rqArm',()=>{REQ.arm=askArmband();renderPlanning()});
 on('rqPen',()=>{REQ.pen=askTaker('pen');renderPlanning()});
 on('rqFk',()=>{REQ.fk=askTaker('fk');renderPlanning()});
 on('rqRaise',()=>{REQ.raise=askRaise();renderPlanning()});
 on('rnA',()=>{S.contract=RENEW.years+(S.contract>0?S.contract:0);S.wage=RENEW.wage;RENEW.done=true;RENEW_MSG=`Contrato renovado até ${S.year+S.contract}.`;renderPlanning()});
 on('rnN',()=>{const r=negotiate(RENEW);RENEW_MSG=r.txt;if(!r.ok){S.flags.renewRefused=true}renderPlanning()});
 on('rnR',()=>{RENEW.done=true;S.flags.renewRefused=true;RENEW_MSG='Você recusou. Vai sair de graça no fim do contrato.';renderPlanning()});
 $app.querySelectorAll('[data-tr]').forEach(b=>b.onclick=async()=>{const r=await playTraining(b.dataset.tr);REQ.train={txt:`Treino: ${r.hits} de ${r.of} bons`,chips:r.chips};renderPlanning()});
 on('agOpen2',()=>openAgent(()=>renderPlanning(),{market:true}));
 on('lifeOpen2',()=>openLife(renderPlanning));
 $app.querySelectorAll('[data-loan]').forEach(b=>b.onclick=()=>{const o=LOANPROP[+b.dataset.loan];LOANPROP=null;acceptOffer(o);const keep=S.agentUses;startPreseason();S.agentUses=keep;LOANPROP=null;renderPlanning()});
 on('loanNo',()=>{LOANPROP=null;S.board=clamp(S.board-3,0,100);renderPlanning()});
 on('startS',()=>{renderHub();saveNow('season')});
}

// ---------- HUB DA TEMPORADA ----------
let GALF='all';let LOANPROP=null;let LASTR=[],PAUSE=null,TAB='jogos',BUSY=false,EVRES=null;
function resRow(r,big){
 if(r.k==='info')return`<div class="res"><span class="wdl X">·</span><div class="mid"><small>${esc(r.comp||'')}</small><b>${esc(r.txt)}</b></div><span></span></div>`;
 if(r.k==='bye')return'';
 const m=r.me;const mine=m.play?`<b>${m.g?`${m.g}G `:''}${m.a?`${m.a}A `:''}${fmt1(m.nota)}</b>${m.min}'${m.y?' 🟨':''}${m.r?' 🟥':''}${m.cs?' SG':''}`:`<b>—</b>${m.why==='lesionado'?'lesionado':m.why==='suspenso'?'suspenso':m.why==='base'?'na base':'banco'}`;
 const score=`${r.hg}–${r.ag}${r.pens?` <span class="muted">(${r.pens[0]}–${r.pens[1]} pên.)</span>`:''}${r.agg?` <span class="muted">agr. ${r.agg[0]}–${r.agg[1]}</span>`:''}`;
 return`<div class="res ${big?'big':''} ${r.final&&r.koWin?'title':''}"><span class="wdl ${r.wdl}">${r.wdl}</span><div class="mid"><small>${esc(r.comp)} · ${esc(r.label)}</small><b>${shieldHTML(r.home,'sm')}<span>${esc(r.home.n)}</span><span class="sc">${score}</span><span>${esc(r.away.n)}</span>${shieldHTML(r.away,'sm')}</b>${r.note?`<small style="color:${r.koWin===false?'var(--bad)':'var(--gold)'}">${esc(r.note)}</small>`:''}</div><div class="mine">${mine}</div></div>`;
}
function matchCard(r){
 if(r.k!=='match')return resRow(r,true);
 const m=r.me;const hs=r.scorers.filter(s=>s.side==='h'),as=r.scorers.filter(s=>s.side==='a');const rows=Math.max(hs.length,as.length);
 let sc='';for(let i=0;i<rows;i++){const a=hs[i],b=as[i];sc+=`<div class="${a&&a.w.startsWith(S.name)?'me':''}">${a?`${a.m}' ${esc(a.w)}`:''}</div><div class="a ${b&&b.w.startsWith(S.name)?'me':''}">${b?`${esc(b.w)} ${b.m}'`:''}</div>`}
 const chips=[];if(m.play){chips.push([`${m.min} min`,'']);if(m.g)chips.push([`${m.g} gol${m.g>1?'s':''}`,'up']);if(m.a)chips.push([`${m.a} assist.`,'up']);if(m.cs)chips.push(['Sem sofrer gol','up']);if(m.nota!=null)chips.push([`Nota ${fmt1(m.nota)}`,m.nota>=7.5?'up':m.nota<6?'down':'']);if(m.pen)chips.push([`Pênalti ${m.pen}`,m.pen==='convertido'||m.pen==='defendeu pênalti'?'up':'down']);if(m.fk)chips.push(['Gol de falta','gold']);if(m.y)chips.push(['Amarelo','down']);if(m.r)chips.push(['Expulso','down']);if(m.inj)chips.push([`Lesão: ${m.inj} jogos fora`,'down'])}else chips.push([m.why==='lesionado'?'Fora: lesionado':m.why==='suspenso'?'Fora: suspenso':m.why==='base'?'Jogando na base':'Não saiu do banco','']);
 return`<section class="card mcard ${r.final&&r.koWin?'flash':''}"><div class="row" style="justify-content:space-between"><span class="eyebrow">${esc(r.comp)} · ${esc(r.label)}</span><span class="wdl ${r.wdl}" style="width:26px;height:26px;border-radius:6px;display:grid;place-items:center;font-family:var(--f-display);font-weight:900">${r.wdl}</span></div>
 <div class="mscore"><div class="t">${shieldHTML(r.home)}<span>${esc(r.home.n)}</span></div><div class="n mono">${r.hg}–${r.ag}</div><div class="t r"><span>${esc(r.away.n)}</span>${shieldHTML(r.away)}</div></div>
 ${r.pens?`<div style="text-align:center" class="mono muted">Pênaltis ${r.pens[0]}–${r.pens[1]}</div>`:''}${r.agg?`<div style="text-align:center" class="mono muted">Agregado ${r.agg[0]}–${r.agg[1]}</div>`:''}
 ${sc?`<div class="scorers">${sc}</div>`:''}
 <div class="myline">${chips.map(([t,k])=>`<span class="chip ${k}">${esc(t)}</span>`).join('')}</div>
 ${r.note?`<div class="line ${r.koWin?'win':''}"><span>${esc(r.note)}</span><span class="r">${r.koWin&&r.final?'🏆':''}</span></div>`:''}</section>`;
}
function nextLabel(){
 const st=S.st;for(let i=st.idx;i<st.cal.length;i++){const it=st.cal[i];
  if(it.k==='ev')return'Decisão fora/dentro de campo';
  if(it.k==='lg')return`${LG[st.lg].n} · rodada ${it.r+1}`;
  if(it.k==='intl')return'Data FIFA';
  const c=st.comps[it.cid||'est'];if(c&&c.alive){const rd=c.rounds[c.stage];return`${c.n}${it.k==='ko'&&rd?` · ${rd.n}`:''}`}
 }return'Fim da temporada';
}
let KEEPSC=false;
function renderHub(){
 ensureLife();const st=S.st;const c=club();
 let top='';
 if(PAUSE){
  const ev=PAUSE;
  top=`<section class="card ev"><div class="row"><span class="tag ${ev.k}">${ev.k==='vida'?'Fora de campo':'Em campo'}</span><span class="eyebrow">${seasonLbl(S.year)}</span></div>
  <h2>${esc(ev.t)}</h2><p>${esc(ev._d)}</p>
  <div class="choices">${ev.o.map((o,i)=>`<button class="choice" data-c="${i}" ${EVRES?'disabled':''}><span>${esc(o[0])}</span><span class="arrow">→</span></button>`).join('')}</div><div id="res">${EVRES?`<div class="outcome"><p>${esc(EVRES.txt)}</p><div class="chipsrow">${EVRES.chips.length?EVRES.chips.map(([t,k])=>`<span class="chip ${k}">${esc(t)}</span>`).join(''):'<span class="chip">Nada muda</span>'}</div></div><button class="btn wide" id="evc" style="margin-top:12px">Continuar</button>`:''}</div></section>`;
 }else if(st.done){
  top=`<section class="card" style="display:grid;gap:6px;text-align:center"><div class="eyebrow">Temporada ${seasonLbl(S.year)} encerrada</div><h3 style="font-family:var(--f-display);font-size:26px">Hora do balanço 🏁</h3><p class="muted" style="margin:0">Prêmios, títulos e o que vem por aí.</p></section><div class="ctabar"><button class="btn wide cta" id="endS">Ver o fim da temporada →</button></div>`;
 }else{
  top=`${weekHTML()}${st.injLeft>0||st.suspLeft>0||S.agreed||S.loan?`<section class="card hubctl">${st.injLeft>0?`<div class="line"><span>🚑 Lesionado</span><span class="r" style="color:var(--bad)">${st.injLeft} jogos</span></div>`:''}${st.suspLeft>0?`<div class="line"><span>🟥 Suspenso</span><span class="r" style="color:var(--bad)">${st.suspLeft} jogos</span></div>`:''}${S.agreed?`<span class="chip gold">Acertado: ${esc(CLUB[S.agreed.club].n)}</span>`:''}${S.loan?`<span class="chip">Emprestado pelo ${esc(CLUB[S.loan.parent].n)}</span>`:''}</section>`:''}
  <div class="dock"><div class="dock-in">
   <div class="dockmenu" id="dockM" hidden>
    <button class="dmi" id="aMode">${S.fast?'🗓️ Mudar para o modo Completo (semana a semana)':'⚡ Mudar para o modo Rápido (blocos)'}</button><button class="dmi" id="a2">⏩ Até a próxima decisão</button><button class="dmi" id="a3">⏭ Simular até o próximo jogo decisivo</button>${isDecisive(nextItem())?'<button class="dmi" id="a4">⏭ Simular este jogo sem assistir</button>':''}<button class="dmi" id="agOpen">📞 Falar com o empresário · ${S.agentUses??0}</button>
    <div class="livemode"><span class="eyebrow">Ao vivo</span>${[['decisivos','Mata-mata'],['all','Todos'],['off','Só decisivos']].map(([k,n])=>`<button class="lmbtn ${(S.liveMode||'decisivos')===k?'on':''}" data-lm="${k}">${n}</button>`).join('')}</div>
    <div class="livemode"><span class="eyebrow">Lances</span>${[['todos','Todos'],['decisivos','Só ao vivo'],['off','Off']].map(([k,n])=>`<button class="lmbtn ${(S.lances||'todos')===k?'on':''}" data-lc="${k}">${n}</button>`).join('')}</div>
   </div>
   <button class="dockmore" id="dockMore" aria-label="Mais opções">⋯</button>
   <button class="btn playbtn ${isDecisive(nextItem())?'decisive':''}" id="a1"><span>${!nextItem()?'🏁 Encerrar a temporada':isDecisive(nextItem())?'🔴 Jogar ao vivo':S.fast?`⏩ Jogar bloco ${blockInfo(st).b}/4`:`⚽ ${S.tempo>0?'Ir para o jogo':'Jogar agora'}`}</span><small>${(()=>{const nm=nextMatchInfo();if(!nextItem())return 'Simula o que falta e fecha o ano';if(S.fast&&!isDecisive(nextItem())){const be=blockEnd(st);const vis=typeof visItem==='function'?visItem:(()=>true);const left=st.cal.slice(st.idx,be).filter(it=>it.k!=='ev'&&it.k!=='debut'&&vis(it)).length;return left?`${left} jogo${left===1?'':'s'} de uma vez · finais ao vivo`:'Avança o calendário'}return nm?esc(nm.comp)+(nm.opp&&CLUB[nm.opp]?' · '+esc(CLUB[nm.opp].n):''):esc(nextLabel())})()}</small></button>
  </div></div>`;
 }
 const lastHTML=!PAUSE&&LASTR.length?(LASTR.length===1||LASTR.filter(r=>r.k==='match').length<=2?LASTR.map(r=>matchCard(r)).join(''):`<section class="card" style="display:grid;gap:6px"><div class="eyebrow">Últimos resultados</div>${LASTR.slice(-12).reverse().map(r=>resRow(r)).join('')}${LASTR.length>12?`<div class="muted" style="font-size:13px">e mais ${LASTR.length-12} jogos na aba Jogos</div>`:''}</section>`):'';
 const tabs=[['jogos','Jogos'],['tabela','Tabela'],['copas','Copas'],['trofeus','Troféus'],['stats','Números']];
 const one=LASTR.length===1;
 shell(`${one?lastHTML:''}${top}${S.youth?prospectCard():''}${one?'':lastHTML}<div class="tabs">${tabs.map(([k,n])=>`<button class="tab ${TAB===k?'on':''}" data-tab="${k}">${n}</button>`).join('')}</div><section class="card" style="display:grid;gap:8px">${tabContent()}</section>`,{keepScroll:BUSY||KEEPSC,noHist:false});KEEPSC=false;
 $app.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{TAB=b.dataset.tab;renderHub()});
 if(TAB==='trofeus')bindGallery(S.titles,S.awards,f=>{GALF=f;renderHub()});
 {const ao=document.getElementById('agOpen');if(ao)ao.onclick=()=>openAgent(()=>renderHub())}
 $app.querySelectorAll('[data-lm]').forEach(b=>b.onclick=()=>{S.liveMode=b.dataset.lm;KEEPSC=true;renderHub();const m=document.getElementById('dockM');if(m){m.hidden=false}});
 $app.querySelectorAll('[data-lc]').forEach(b=>b.onclick=()=>{S.lances=b.dataset.lc;KEEPSC=true;renderHub();const m=document.getElementById('dockM');if(m){m.hidden=false}});
 if(!PAUSE&&!st.done){bindWeek();const dm=document.getElementById('dockMore');if(dm)dm.onclick=()=>{const m=document.getElementById('dockM');m.hidden=!m.hidden;dm.classList.toggle('on',!m.hidden)}}else document.body.classList.remove('noscroll');
 {const pr=document.getElementById('prRank');if(pr)pr.onclick=()=>{PROSPECT_OPEN=!PROSPECT_OPEN;renderHub()}}
 const on=(id,fn)=>{const e=document.getElementById(id);if(e)e.onclick=fn};
 const clr=()=>{S.st.lifeNews=[];LIFE_MSG=null;WEEK_TAB=null;document.body.classList.remove('noscroll');const m=document.getElementById('dockM');if(m)m.hidden=true};on('a1',()=>{clr();advance(S.fast&&!isDecisive(nextItem())?'block':'one')});on('aMode',()=>{S.fast=!S.fast;clr();renderHub();saveNow('season')});on('a2',()=>{clr();advance('decision')});on('a3',()=>{clr();advance('auto')});on('a4',()=>{clr();advance('skip')});
 on('endS',async()=>{const ls=endSeason();saveNow('post');await runSeasonEndShow(ls);renderReport(ls)});
 $app.querySelectorAll('.ev .choice').forEach(b=>b.onclick=async()=>{
  if(EVRES)return;$app.querySelectorAll('.ev .choice').forEach(x=>x.disabled=true);b.classList.add('picked');
  document.getElementById('res').innerHTML='<div class="suspense"><i></i><i></i><i></i></div>';
  await sleep(900);EVRES=resolveOption(PAUSE,+b.dataset.c);S.st.evlog.push({t:PAUSE.t,txt:EVRES.txt});renderHub();
 });
 on('evc',()=>{PAUSE=null;EVRES=null;renderHub();saveNow('season')});
}
function tabContent(){
 const st=S.st;const me=club();
 if(TAB==='jogos'){if(!st.log.length)return'<div class="muted">Nenhum jogo ainda. A temporada começa no próximo clique.</div>';return st.log.slice().reverse().map(r=>resRow(r)).join('')}
 if(TAB==='tabela'){
  const L=LG[st.lg];const C=COUNTRY[L.c];const t=sortTable(st.table);
  const up=L.prev?LG[L.prev].down:0,down=L.down||0;
  const zone=i=>{const p=i+1;if(L.tier===1&&C.slots){for(const k in C.slots){const s=C.slots[k];if(p>=s[0]&&p<=s[1])return k==='UCL'||k==='LIB'||k==='CCC'||k==='ACL'?'c':'s'}}if(up&&p<=up)return'u';if(down&&p>t.length-down)return'd';if(L.po&&p<=8)return'c';return''};
  return`<div class="eyebrow">${esc(L.n)} · ${seasonLbl(S.year)}</div><div style="overflow-x:auto"><table class="std"><thead><tr><th></th><th>#  CLUBE</th><th>P</th><th>J</th><th>V</th><th>E</th><th>D</th><th>SG</th></tr></thead><tbody>
  ${t.map((x,i)=>`<tr class="${x.id===me.id?'me':''}"><td class="zone ${zone(i)}"></td><td><span style="display:inline-flex;gap:6px;align-items:center"><span class="mono muted">${String(i+1).padStart(2,' ')}</span>${shieldHTML(CLUB[x.id],'sm')}${esc(CLUB[x.id].n)}</span></td><td class="mono"><b>${x.p}</b></td><td class="mono">${x.j}</td><td class="mono">${x.v}</td><td class="mono">${x.e}</td><td class="mono">${x.d}</td><td class="mono">${x.gp-x.gc}</td></tr>`).join('')}</tbody></table></div>
  <div class="legend-z">${L.tier===1&&L.c!=='USA'?`<span><i style="background:var(--accent)"></i>${esc(CONT_INFO[Object.keys(C.slots)[0]].n)}</span>`:''}${L.tier===1&&Object.keys(C.slots).length>1?`<span><i style="background:var(--blue)"></i>Outros continentais</span>`:''}${L.po?'<span><i style="background:var(--accent)"></i>Playoffs</span>':''}${up?'<span><i style="background:var(--good)"></i>Acesso</span>':''}${down?'<span><i style="background:var(--bad)"></i>Rebaixamento</span>':''}</div>`;
 }
 if(TAB==='copas'){
  const comps=Object.values(st.comps);if(!comps.length)return'<div class="muted">Sem copas nesta temporada.</div>';
  return comps.map(c=>{const status=c.won?'<span class="status win">Campeão</span>':c.alive?(c.kind==='tour'&&!c.path.length?'<span class="status">Fim da temporada</span>':'<span class="status live">Em disputa</span>'):`<span class="status out">${esc(c.out||'Eliminado')}</span>`;
   let extra='';if(c.gtab){const t=sortTable(c.gtab);extra=`<table class="std">${c.youth?'<thead><tr><th></th><th>#  CLUBE</th><th>P</th><th>J</th><th>SG</th></tr></thead>':''}<tbody>${t.map((x,i)=>`<tr class="${x.id===me.id?'me':''}"><td class="zone ${c.youth&&i===0?'c':''}"></td><td><span style="display:inline-flex;gap:6px;align-items:center"><span class="mono muted">${i+1}</span>${shieldHTML(CLUB[x.id],'sm')}${esc(CLUB[x.id].n)}${c.youth?` <span class="muted">${esc(ysuf(x.id))}</span>`:''}</span></td><td class="mono"><b>${x.p}</b></td>${c.youth?`<td class="mono">${x.j}</td>`:''}<td class="mono">${x.gp-x.gc}</td></tr>`).join('')}</tbody></table>`}
   if(c.kind==='lp'&&c.path.length)extra=`<div class="muted mono" style="font-size:13px">Fase de liga: ${c.lpPts} pts</div>`;
   return`<div class="compbox"><div class="comphead">${ICON(c.ic)}<b>${esc(c.n)}</b>${status}</div>${extra}${c.path.map(r=>resRow(r)).join('')||'<div class="muted" style="font-size:13px">Ainda não começou.</div>'}</div>`}).join('');
 }
 if(TAB==='trofeus')return galleryHTML(S.titles,S.awards,{filter:GALF,wish:true});
 if(TAB==='stats'){
  const rows=Object.entries(st.stats);if(!rows.length)return'<div class="muted">Sem números ainda.</div>';
  const gk=S.pos==='GOL';
  return`<div style="overflow-x:auto"><table class="std"><thead><tr><th></th><th>COMPETIÇÃO</th><th>J</th><th>MIN</th><th>G</th><th>A</th>${gk?'<th>SG</th>':''}<th>NOTA</th></tr></thead><tbody>${rows.map(([k,s])=>`<tr><td></td><td>${k}</td><td class="mono">${s.j}</td><td class="mono">${s.min}</td><td class="mono">${s.g}</td><td class="mono">${s.a}</td>${gk?`<td class="mono">${s.cs}</td>`:''}<td class="mono">${s.nn?fmt2(s.ns/s.nn):'—'}</td></tr>`).join('')}</tbody></table></div>${st.evlog.length?`<div class="eyebrow" style="margin-top:8px">Decisões da temporada</div>${st.evlog.map(e=>`<div class="line"><span>${esc(e.t)}</span><span class="r muted" style="white-space:normal">${esc(e.txt)}</span></div>`).join('')}`:''}`;
 }
 return'';
}
async function advance(mode){
 if(BUSY)return;BUSY=true;
 const io=mode==='auto'||mode==='skip'||mode==='block'?IO_AUTO:IO_UI;
 try{
  const r=await stepSeason(io,mode==='auto'?'auto':mode==='block'?'block':mode==='one'||mode==='skip'?'one':'decision');
  LASTR=r.results;
  if(r.pause){PAUSE=r.pause.ev;PAUSE._d=PAUSE.d();EVRES=null}
 }catch(e){console.error(e)}
 BUSY=false;renderHub();saveNow('season');
}

// ---------- PÊNALTIS (UI) ----------
const ZPOS=[[17,30],[50,30],[83,30],[17,70],[50,70],[83,70]];
function goalHTML(){return`<div class="goalwrap"><div class="goal"><div class="keeper" id="kp"><i></i></div><div class="ball" id="ball"></div><div class="zones">${[0,1,2,3,4,5].map(z=>`<button data-z="${z}" aria-label="Zona ${z+1}"></button>`).join('')}</div></div><div class="grass"></div></div>`}
function waitZone(){return new Promise(res=>{$ov.querySelectorAll('[data-z]').forEach(b=>b.onclick=()=>{$ov.querySelectorAll('[data-z]').forEach(x=>x.disabled=true);res(+b.dataset.z)})})}
async function animKick(shot,dive,res){
 const kp=document.getElementById('kp'),ball=document.getElementById('ball');
 const[dx,dy]=ZPOS[dive];kp.style.left=dx+'%';kp.style.top=(dy+(dive<3?5:0))+'%';kp.style.transform=`translate(-50%,-50%) rotate(${dive%3===0?-35:dive%3===2?35:0}deg)`;
 let[bx,by]=ZPOS[shot];if(res==='fora'){by=shot<3?-12:by;bx=shot%3===0?-6:shot%3===2?106:bx}
 ball.style.left=bx+'%';ball.style.top=by+'%';ball.style.width='5%';
 await sleep(650);
}
const IO_UI={
 async penalty(o){
  return new Promise(async resolve=>{
   $ov.hidden=false;const save=o.mode==='save';
   $ov.innerHTML=`<div class="ovwrap"><div class="eyebrow">${esc(o.comp)} · ${o.min}'</div><h2 style="font-size:30px;font-weight:900;margin-top:4px">${save?`Pênalti contra! Você no gol`:`Pênalti! A bola é sua`}</h2><p class="muted" style="margin:6px 0 0">${save?'Toque onde você vai pular.':'Toque onde você vai bater. Cantos altos são indefensáveis, mas é fácil isolar.'}</p>${goalHTML()}<div class="pkres" id="pkr"></div><div id="pkc"></div></div>`;
   const z=await waitZone();let shot,dive,res;
   if(save){dive=z;shot=aiShot();res=gkSave(shot,dive)}else{shot=z;dive=aiDive();res=kickOutcome(shot,dive,S.attrs.FIN,(55-S.life.cab)/400)}
   await animKick(shot,dive,res);
   const good=save?res!=='gol':res==='gol';
   document.getElementById('pkr').innerHTML=`<span style="color:${good?'var(--good)':'var(--bad)'}">${res==='gol'?'GOL!':res==='defesa'?(save?'DEFENDEU!':'O goleiro pegou'):(save?'Pra fora!':'Isolou')}</span>`;
   document.getElementById('pkc').innerHTML='<button class="btn wide" id="pkok" style="margin-top:12px">Continuar</button>';
   document.getElementById('pkok').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';resolve({goal:res==='gol',res})};
  });
 },
 async shootout(o){
  return new Promise(async resolve=>{
   $ov.hidden=false;
   const pu=clamp(.74+(o.usS-o.themS)/120,.6,.86),pt=clamp(.74+(o.themS-o.usS)/120,.6,.86);
   const ku=[],kt=[];let a=0,b=0;
   const draw=(msg,showGoal)=>{$ov.innerHTML=`<div class="ovwrap"><div class="eyebrow">${esc(o.comp)} · ${esc(o.round)}</div><h2 style="font-size:28px;font-weight:900;margin-top:4px">Disputa de pênaltis</h2>
    <div class="tally"><div>${shieldHTML(o.us,'sm')}<b style="flex:1;text-align:left">${esc(o.us.n)}</b><span class="k">${ku.map(g=>`<i class="${g?'g':'m'}"></i>`).join('')}</span><b class="mono">${a}</b></div><div>${shieldHTML(o.them,'sm')}<b style="flex:1;text-align:left">${esc(o.them.n)}</b><span class="k">${kt.map(g=>`<i class="${g?'g':'m'}"></i>`).join('')}</span><b class="mono">${b}</b></div></div>
    <p class="muted" style="margin:10px 0 0">${msg}</p>${showGoal?goalHTML():''}<div class="pkres" id="pkr"></div><div id="pkc"></div></div>`};
   const early=()=>{const ru=Math.max(0,5-ku.length),rt=Math.max(0,5-kt.length);return a>b+rt||b>a+ru};
   for(let r=0;r<30;r++){
    let g;
    if(o.iAmIn&&!o.isGK&&r===o.myIdx){draw('Sua vez de bater. Escolha o canto.',true);const z=await waitZone();const dive=aiDive();const res=kickOutcome(z,dive,S.attrs.FIN,(55-S.life.cab)/300);await animKick(z,dive,res);g=res==='gol';document.getElementById('pkr').innerHTML=`<span style="color:${g?'var(--good)':'var(--bad)'}">${g?'GOL!':res==='defesa'?'Defendeu':'Pra fora'}</span>`;await sleep(900)}
    else{g=ch(pu);draw(`${esc(o.us.n)} cobra…`,false);await sleep(420)}
    ku.push(g);a+=g;if(r<5&&early())break;
    let h;
    if(o.iAmIn&&o.isGK){draw('Você no gol. Escolha pra onde pular.',true);const z=await waitZone();const shot=aiShot();const res=gkSave(shot,z);await animKick(shot,z,res);h=res==='gol';document.getElementById('pkr').innerHTML=`<span style="color:${!h?'var(--good)':'var(--bad)'}">${h?'Gol deles':res==='defesa'?'DEFENDEU!':'Pra fora!'}</span>`;await sleep(900)}
    else{h=ch(pt);draw(`${esc(o.them.n)} cobra…`,false);await sleep(420)}
    kt.push(h);b+=h;
    if(r<5){if(early())break;if(r===4&&a!==b)break}else if(a!==b)break;
   }
   if(a===b)a++;
   const win=a>b;
   draw(win?'Vocês venceram nos pênaltis!':'Eliminados nos pênaltis.',false);
   document.getElementById('pkr').innerHTML=`<span style="color:${win?'var(--good)':'var(--bad)'}">${a}–${b}</span>`;
   document.getElementById('pkc').innerHTML='<button class="btn wide" id="pkok" style="margin-top:12px">Continuar</button>';
   document.getElementById('pkok').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';resolve({win,a,b})};
  });
 },
 async event(ev){return resolveOption(ev,autoOption(ev))},
};

// ---------- FIM DE TEMPORADA ----------
function renderReport(ls){
 const c=CLUB[ls.row.club];const gk=S.pos==='GOL';const t=ls.tot;
 const L=ls.row;
 shell(`<section class="card ${ls.titles.length?'flash':''}" style="display:grid;gap:14px">
 <div class="row" style="gap:14px">${shieldHTML(c,'lg')}<div style="flex:1;min-width:0"><div class="eyebrow">Fim da temporada ${seasonLbl(L.year)} · ${L.age} anos</div><h2 style="font-size:34px;font-weight:900;margin-top:4px">${esc(c.n)}</h2><div class="muted">${esc(ls.leagueName)}: ${ls.rank}º lugar</div></div></div>
 <div class="stats"><div class="stat"><b class="mono">${t.j}</b><small>Jogos</small></div>${gk?`<div class="stat"><b class="mono">${t.cs}</b><small>Sem sofrer gol</small></div>`:`<div class="stat"><b class="mono">${t.g}</b><small>Gols</small></div>`}<div class="stat"><b class="mono">${t.a}</b><small>Assist.</small></div><div class="stat"><b class="mono">${fmt2(ls.nota)}</b><small>Nota média</small></div></div>
 ${ls.stats&&ls.stats.Base?`<div class="line"><span>Categoria de base</span><span class="r">${ls.stats.Base.j} jogos · ${ls.stats.Base.g} gols · ${ls.stats.Base.a} assist. · nota ${ls.stats.Base.nn?fmt2(ls.stats.Base.ns/ls.stats.Base.nn):'—'}</span></div>`:''}
 ${ls.myMove?`<div class="news">${ls.myMove.dir==='up'?ICON('liga'):'<span class="newsic">⬇️</span>'}<div><b>${ls.myMove.dir==='up'?'ACESSO!':'Rebaixado'}</b><div class="muted">${esc(c.n)} vai jogar a ${esc(LG[ls.myMove.to].n)}.</div></div></div>`:''}
 ${ls.titles.length?`<div><div class="eyebrow" style="margin-bottom:8px">Títulos</div><div class="trophies">${ls.titles.map((x,i)=>`<span class="troph" style="animation-delay:${i*.15}s">${ICON(x.ic||x.t)}${esc(x.n)}</span>`).join('')}</div></div>`:''}
 ${ls.awards.length?`<div style="display:grid;gap:8px"><div class="eyebrow">Prêmios individuais</div>${ls.awards.map(a=>`<div class="award ${a.t!=='bola_top3'?'won':''}"><span style="color:var(--gold);width:34px;height:34px;flex:none">${ICON(a.t)}</span><div style="flex:1;min-width:0"><b>${esc(a.n)}</b>${a.d?`<div class="muted" style="font-size:13px">${esc(a.d)}</div>`:''}${a.podium?`<div class="podium">${a.podium.map((p,i)=>`<div class="${p.me?'me':''}"><b>${i+1}º</b>${p.f} ${esc(p.n)}</div>`).join('')}</div>`:''}</div></div>`).join('')}</div>`:''}
 ${ls.yearWinners?`<div style="display:grid;gap:6px"><div class="eyebrow">Vencedores do ano</div>${ls.yearWinners.filter(x=>x.w).map(x=>`<div class="line yw ${x.w.me?'win':''}"><span style="display:flex;gap:8px;align-items:center;white-space:nowrap"><span class="miniTro">${TROPHY(x.k==='bola'?'bola':x.k==='gb'?'revelacao':x.k==='chut'?'chuteira':'luva')}</span>${esc(x.n)}</span><span class="r">${x.w.f||''} ${esc(x.w.n)}${x.k==='bola'&&!x.w.me&&S.st.bolaPlace<=30?` <span class="muted">· você: ${S.st.bolaPlace}º</span>`:''}</span></div>`).join('')}</div>`:''}
 ${ls.news.map(n=>`<div class="news">${ICON(n.t==='idolo'?'idolo':n.t==='promo'?'acesso':n.t==='nopromo'||n.t==='prospecto'?'revelacao':'estatua')}<div><b>${n.t==='idolo'?'Ídolo':n.t==='promo'?'Promovido ao profissional':n.t==='nopromo'?'Mais um ano na base':n.t==='prospecto'?'Ranking de prospectos':'Estátua'}</b><div class="muted">${esc(n.txt)}</div></div></div>`).join('')}
 </section>
 <div class="ctabar"><button class="btn wide cta" id="adv">Continuar →</button></div>`,{histOpen:false,lifeFold:true,noFast:true});
 document.getElementById('adv').onclick=afterSeason;
}

// ---------- MERCADO ----------
let OFFERS=[];
function afterSeason(){
 const r=mustRetire();if(r){S.retiredReason=r;return renderEnd()}
 S.agentUses=AGENT_QUOTA[S.agent]||3;
 if(S.agreed&&CLUB[S.agreed.club]){const o=S.agreed,from=S.club;S.agreed=null;if(S.loan)endLoan();acceptOffer(o);return renderAgreedMove(o,from)}
 const w=windowState();
 if(w.forced==='loanEnd'){const lc=S.club,ls=S.lastSeason;const good=ls&&ls.nota>=7&&S.ovr>=CLUB[lc].s-3;endLoan();return renderOffers({stay:true,loanBack:true,buyFrom:good?lc:null})}
 if(!w.open){if(S.age>=32)return renderOffers({stay:true,quiet:true});return startPreseason()}
 renderOffers(w);
}
function renderOffers(w,leagueFilter){
 const c=club();
 OFFERS=w.quiet?[]:genOffers(leagueFilter);
 const canStay=w.stay||w.renew||w.loanBack;if(w.buyFrom&&CLUB[w.buyFrom]){OFFERS=OFFERS.filter(o=>o.club!==w.buyFrom);OFFERS.unshift({...mkOffer(CLUB[w.buyFrom]),buy:true})}if(canStay)OFFERS.unshift(stayOffer());OFFERS=OFFERS.slice(0,3);
 const title=w.quiet?'Fim de temporada':w.loanBack?`De volta ao ${c.n}`:w.release?'O clube quer te negociar':S.contract<=0?'Seu contrato acabou':'Janela de transferências';
 const sub=w.quiet?'Nenhuma proposta chegou. Você pode seguir ou pendurar as chuteiras.':w.release?`O ${c.n} não conta mais com você.`:S.contract<=0&&!w.renew?`O ${c.n} não vai renovar.`:leagueFilter?`Seu empresário ligou pra clubes da ${LG[leagueFilter].n}.`:'Propostas na mesa. Papel no elenco define minutos, e minutos definem evolução.';
 const lgOpts=Object.entries(LG).map(([k,v])=>`<option value="${k}">${COUNTRY[v.c].f} ${esc(v.n)}</option>`).join('');
 shell(`<div class="phead"><div class="eyebrow">${seasonLbl(S.year)} · ${S.age} anos</div><h2>${esc(title)}</h2><p>${esc(sub)} ${OFFERS.length?'<b>Toque num card para assinar.</b>':''}</p></div>
 <div class="offers">${OFFERS.map((o,i)=>offerCard(o,i)).join('')}</div>
 <section class="card" style="display:grid;gap:10px"><div class="eyebrow">Empresário · ${S.agentUses} ligações</div><div class="row"><button class="btn small" id="agentM">📞 Ligar pra uma liga ou clube</button>${S.age>=32?'<button class="btn ghost small" id="ret">Pendurar as chuteiras</button>':''}</div></section>`,{lifeFold:true,noFast:true});
 $app.querySelectorAll('[data-off]').forEach(b=>b.onclick=()=>{acceptOffer(OFFERS[+b.dataset.off]);startPreseason()});
 const ag=document.getElementById('agentM');if(ag)ag.onclick=()=>openAgent(null,{market:true});
 const rt=document.getElementById('ret');if(rt)rt.onclick=()=>{S.retiredReason=`Decidiu parar aos ${S.age} anos.`;renderEnd()};
}

// ---------- SIMULAR CARREIRA ----------
async function fastForward(){
 if(BUSY)return;BUSY=true;
 $ov.hidden=false;$ov.innerHTML='<div class="ovwrap"><h2 style="font-size:28px;font-weight:900">Simulando a carreira…</h2><p class="muted" id="ffp"></p></div>';
 try{
  if(PAUSE){resolveOption(PAUSE,autoOption(PAUSE));PAUSE=null;EVRES=null}
  let guard=0;
  while(guard++<40){
   if(S.st&&!S.st.ended){if(!S.st.done)await stepSeason(IO_AUTO,'sim');endSeason();document.getElementById('ffp').textContent=`${S.age} anos · ${club().n}`;await sleep(0)}
   const r=mustRetire();if(r){S.retiredReason=r;break}
   if(S.age>=36&&S.ovr<70||S.age>=39){S.retiredReason=`Decidiu parar aos ${S.age} anos.`;break}
   if(S.agreed&&CLUB[S.agreed.club]){const o=S.agreed;S.agreed=null;if(S.loan)endLoan();acceptOffer(o);buildSeason();continue}
   const w=windowState();
   if(w.forced==='loanEnd')endLoan();
   else if(w.open){let o=genOffers();if(w.stay||w.renew)o.unshift(stayOffer());if(o.length)acceptOffer(autoOffer(o.slice(0,3)))}
   buildSeason();
  }
 }catch(e){console.error(e)}
 BUSY=false;$ov.hidden=true;$ov.innerHTML='';renderEnd();
}

