// ================== MODO RÁPIDO (temporada em 4 blocos) ==================
function blockCardHTML(){
 const st=S.st;const me=club();const L=LG[st.lg];const bi=blockInfo(st);
 const t=sortTable(st.table);const pos=t.findIndex(x=>x.id===me.id)+1;
 let j=0,g=0,a=0,ns=0,nn=0;for(const k in st.stats){if(k==='Base')continue;const s=st.stats[k];j+=s.j;g+=s.g;a+=s.a;ns+=s.ns;nn+=s.nn}
 const ms=(LASTR||[]).filter(r=>r.k==='match');const V=ms.filter(r=>r.wdl==='V').length,E=ms.filter(r=>r.wdl==='E').length,D=ms.filter(r=>r.wdl==='D').length;const mg=ms.reduce((s,r)=>s+(r.me&&r.me.g||0),0);
 const nx=nextItem();const dec=isDecisive(nx);const nm=nextMatchInfo();
 const pct=Math.round(bi.played/bi.n*100);
 return`<section class="blockcard"><div class="mdlights"><i></i><i></i></div>
  <div class="mdtop"><span class="eyebrow">⚡ Modo rápido · ${esc(L.n)}</span><span class="eyebrow">${seasonLbl(S.year)}</span></div>
  <div class="bkhead"><div><b>Bloco ${bi.b}</b><span>de 4</span></div><div class="bkpos"><b>${pos}º</b><span>na tabela</span></div></div>
  <div class="bkbar"><i style="width:${pct}%"></i>${[25,50,75].map(x=>`<em style="left:${x}%"></em>`).join('')}</div>
  <div class="bkstats"><div><b>${j}</b><span>jogos</span></div><div><b>${S.pos==='GOL'?Object.values(st.stats).reduce((s,x)=>s+(x.cs||0),0):g}</b><span>${S.pos==='GOL'?'sem sofrer':'gols'}</span></div><div><b>${a}</b><span>assist.</span></div><div><b>${nn?fmt2(ns/nn):'—'}</b><span>nota</span></div></div>
  ${ms.length?`<div class="bklast"><span class="eyebrow">Último bloco</span><span><b class="v">${V}V</b> <b class="e">${E}E</b> <b class="d">${D}D</b>${S.pos!=='GOL'?` · ${mg} gol${mg===1?'':'s'} seu${mg===1?'':'s'}`:''}</span></div>`:''}
  ${dec&&nm?`<span class="livebadge"><i></i>A seguir: ${esc(nm.comp)} · ${esc(nm.label)} ao vivo</span>`:`<div class="bknext">Próximo bloco: ${bi.left} jogo${bi.left===1?'':'s'}</div>`}
 </section>`;
}
const _weekHTMLf=weekHTML;
weekHTML=function(){
 let h=_weekHTMLf();if(!S.fast)return h;
 h=h.replace(/<section class="matchday">[\s\S]*?<\/section>/,blockCardHTML());
 h=h.replace(/<h3 class="todoh">[^<]*<\/h3>/,`<h3 class="todoh">${S.tempo>0?'Folga entre blocos':'Folga usada. Bora pro próximo bloco!'}</h3>`);
 return h;
};
