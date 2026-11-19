// ============ NSS · tela principal mais clara ============
// Primeira aba só com o essencial (fofoca, como você está, treinar, energético, próximo jogo).
// Lojas, chuteiras, visual, conquistas, troféus, BETTIGER e estábulo vão pra aba "Loja". Abas e botões maiores.
function nsFofoN(){try{return nsGossip().length}catch(e){return 0}}
function nsFofoBtn(id,cls){const n=nsFofoN();let av='';try{av=faceSVG(NS_NARDO,'#ff2bd6','#111')}catch(e){}
 return`<button class="nsx-fofo ${cls||''}" id="${id}" aria-label="Abrir o Fofocagram"><span class="lg">FOFOCAGRAM</span><span class="who"><i class="av">${av}</i><span class="tx"><b>@nardomeses</b><small>${n?`${n} fofoca${n>1?'s':''} nova${n>1?'s':''} sobre você`:'o que estão falando de você'}</small></span><em>›</em></span></button>`}
function nsInicioHTML(){const n=S.n;const skAvg=Math.round(NSK.reduce((s,[k])=>s+n.sk[k].l,0)/5);const drinks=Object.values(n.dr).reduce((s,x)=>s+x,0);
 const left=Math.max(0,NS_TRAIN_MAX-(n.trainW||0));const hf=n.happy>=70?'😄':n.happy>=45?'🙂':n.happy>=25?'😐':'😞';
 return`<div class="nsx">${nsFofoBtn('nsFofoB','big')}
  <div class="nsx-3">
   <button class="nsx-st" id="nsHabB"><small>Habilidades</small><b>⚽ ${skAvg}</b>${nsBarHTML(skAvg)}</button>
   <button class="nsx-st" id="nsHapB"><small>Felicidade</small><b>${hf} ${Math.round(n.happy)}%</b>${nsBarHTML(n.happy,'hap')}</button>
   <button class="nsx-st" id="nsLsB"><small>Estilo de vida</small><b>💎 ${n.ls}%</b>${nsBarHTML(n.ls,'ls')}</button></div>
  <div class="nsx-2">
   <button class="nsx-act tr ${left?'hot':'done'}" id="nsTrB"><span>🏋️</span><div><b>Treinar</b><small>${left?`${left} de ${NS_TRAIN_MAX} treinos livres`:'Treinos da rodada feitos'}</small></div></button>
   <button class="nsx-act dr ${drinks?'':'off'}" id="nsDrB2"><span>🥤</span><div><b>Energético</b><small>${drinks?`${drinks} na mochila · tomar`:'Mochila vazia · comprar'}</small></div></button></div>
  ${nsNextCard().replace('<div class="nsnext">',`<div class="nsnext"><span class="wk">Ano ${nsSeasonNo()} · Semana ${((S.st&&S.st.nsWk)||0)+1}</span>`)}</div>`}
function nsItensHTML(){const n=S.n;const bt=nsBootStats();const drinks=Object.values(n.dr).reduce((s,x)=>s+x,0);const achP=typeof nsAchPct==='function'?nsAchPct():0;const nh=(n.horses||[]).length;
 const T=[['nsShopB','🛒','Lojas','Estilo de vida, carros e casas'],['nsDrShopB','🥤','Energéticos',drinks?`${drinks} na mochila`:'Recuperam energia'],
  ['nsBootShopB','👟','Chuteiras',bt?`${bt.n} · ${n.bootLeft} jogos`:'Dão habilidades especiais'],['nsLookB','🎨','Visual e camisa','Cabelo, barba, nome e número'],
  ['nsAchB','🏅','Conquistas',`${String(achP).replace('.',',')}% completas`],['nsTrophyB','🏆','Sala de troféus',`${(S.titles||[]).length} título${(S.titles||[]).length===1?'':'s'}`],
  ['nsBetB','🐯','BETTIGER','Apostas e cassino'],['nsStableB','🐎','Estábulo',nh?`${nh} cavalo${nh>1?'s':''}`:'Cavalos de corrida']];
 return`<div class="nsx-grid">${T.map(([id,ic,t,s])=>`<button class="nsx-tile" id="${id}"><span>${ic}</span><b>${t}</b><small>${esc(s)}</small></button>`).join('')}</div>`}
{const _hh5=nsHubHTML;nsHubHTML=function(){let h=_hh5.apply(this,arguments);
 try{if(NS_TAB==='status'||NS_TAB==='itens')h=h.replace(/<div class="nsh-body" id="nsBody">[\s\S]*?<\/div>\s*<div class="nsh-tick">/,`<div class="nsh-body" id="nsBody">${NS_TAB==='itens'?nsItensHTML():nsInicioHTML()}</div>\n <div class="nsh-tick">`);
  const dot=k=>k==='contrato'&&(S.n.offers||[]).length||k==='patro'&&S.n.spOffer?' dot':'';
  const tabs=[['status','Início','Início'],['itens','Loja','Loja'],['contrato','Contrato','Contrato'],['patro','Patrocínio','Marcas'],['estats','Estatísticas','Números']].map(([k,t,sh])=>`<button data-nt="${k}" class="${NS_TAB===k?'on':''}${dot(k)}"><span class="l">${t}</span><span class="s">${sh}</span></button>`).join('');
  h=h.replace(/<div class="nsh-sub">[\s\S]*?<span class="mono gold">[^<]*<\/span><\/div>/,`<div class="nsh-sub nsx-tabs"><div class="nstabs n5">${tabs}</div></div>`);
  h=h.replace('<button class="nsico" id="nsCfg"',`<span class="nshero-cash">💰 ${money(S.din)}</span><button class="nsico" id="nsCfg"`)}catch(e){console.error(e)}
 return h}}
{const _rnh5=nsRenderHub;nsRenderHub=function(){const r=_rnh5.apply(this,arguments);try{const on=(id,fn)=>{const e=document.getElementById(id);if(e)e.onclick=fn};
  on('nsFofoB',()=>nsNews());on('nsTrB',()=>nsOpen(nsHabPage()));on('nsDrB2',()=>{const d=Object.values(S.n.dr).reduce((s,x)=>s+x,0);if(d)nsDrinkPick();else nsOpen(nsShopPage('dr'))});
  on('nsTrophyB',()=>nsOpen(nsTrophyPage()));on('nsBetB',()=>nsOpen(nsCasinoPage()));on('nsStableB',()=>nsOpen(nsStablePage()));on('nsLookB',()=>nsOpen(nsLookPage()))}catch(e){console.error(e)}return r}}
// Vida: o Fofocagram aparece grande, com o nome certo
{const _vp=nsVidaPage;nsVidaPage=function(){const pg=_vp.apply(this,arguments);const h0=pg.html;pg.html=()=>{let h=h0();h=h.replace(/<button class="nsc b" id="nsNews2">[\s\S]*?<\/button>/,'').replace('<div class="nsv-more">',nsFofoBtn('nsNews2','sm')+'<div class="nsv-more one">');return h};
 pg.nav=(pg.nav||[]).map(x=>/Cassino/.test(x.t)?{...x,ic:'🐯',t:'BETTIGER'}:x);return pg}}
if(typeof TOUR_HUB!=='undefined'){TOUR_HUB.push({sel:'#nsFofoB',t:'Fofocagram',d:'O Nardo Meses posta tudo da sua vida: namoro, balada, compras, briga com o técnico. Fama sobe, mas cuidado com o que ele descobre.'},{sel:'[data-nt="itens"]',t:'Loja',d:'Lojas, chuteiras, visual, conquistas, troféus, BETTIGER e estábulo ficam aqui.'})}

{const st=document.createElement('style');st.textContent=`
body.nshub .nsh-tick{display:none}
body.nshub .nsh{gap:12px}
.nshero-tb .nshero-cash{margin-left:auto;font:900 15px var(--f-mono);color:#ffd84a;background:rgba(0,0,0,.35);border:1px solid rgba(255,216,74,.35);border-radius:999px;padding:6px 12px;white-space:nowrap}
.nsx-tabs{display:block}
.nsx-tabs .nstabs.n5{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px;padding:5px;border-radius:16px;width:100%;background:#071710;border:1px solid var(--line-2)}
.nsx-tabs .nstabs.n5 button{font:900 16px var(--f-body);padding:0 2px;min-height:50px;border-radius:12px;color:#bcd3c4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nsx-tabs .nstabs.n5 .s{display:none}
.nsx-tabs .nstabs.n5 button.on{background:linear-gradient(180deg,#ffa25e,#ff7a2b);color:#1d0c02;box-shadow:0 2px 0 #9c3d06}
.nsx{display:flex;flex-direction:column;gap:12px}
.nsx-fofo{position:relative;display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;padding:16px 18px;border:0;border-radius:20px;color:#fff;text-align:left;overflow:hidden;
 background:linear-gradient(115deg,#feda75 0%,#fa7e1e 22%,#d62976 52%,#962fbf 78%,#4f5bd5 100%);box-shadow:0 6px 22px rgba(214,41,118,.35),inset 0 1px 0 rgba(255,255,255,.35)}
.nsx-fofo::after{content:'';position:absolute;inset:0;background:radial-gradient(60% 120% at 0% 0%,rgba(255,255,255,.28),transparent 60%);pointer-events:none}
.nsx-fofo .lg{font:italic 900 34px/1 var(--f-display);letter-spacing:.01em;text-shadow:0 2px 0 rgba(0,0,0,.25)}
.nsx-fofo .who{display:flex;align-items:center;gap:10px;min-width:0}
.nsx-fofo .av{width:52px;height:52px;border-radius:50%;flex:none;overflow:hidden;background:#fff;border:3px solid #fff;box-shadow:0 0 0 2px #d62976}
.nsx-fofo .av svg{width:100%;height:100%;display:block}
.nsx-fofo .tx{display:grid;gap:2px;min-width:0}
.nsx-fofo .tx b{font:900 16px var(--f-body)}
.nsx-fofo .tx small{font:700 14px var(--f-body);opacity:.95;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nsx-fofo em{font:900 34px var(--f-body);font-style:normal;opacity:.9}
.nsx-fofo:active{transform:translateY(2px)}
.nsx-fofo.sm{padding:12px 14px;border-radius:16px;grid-column:1/-1}
.nsx-fofo.sm .lg{font-size:24px}.nsx-fofo.sm .av{width:40px;height:40px}.nsx-fofo.sm em{font-size:26px}
.nsx-3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.nsx-st{display:grid;gap:8px;justify-items:start;text-align:left;padding:14px;border-radius:16px;border:1px solid var(--line-2);background:linear-gradient(180deg,#1d4a33,#123425);color:var(--chalk);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 2px 0 rgba(0,0,0,.35)}
.nsx-st small{font:800 13px var(--f-body);color:#a9c6b4;text-transform:uppercase;letter-spacing:.04em}
.nsx-st b{font:900 28px var(--f-display);line-height:1}
.nsx-st .nsmb{width:100%;height:10px}
.nsx-2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.nsx-act{display:flex;align-items:center;gap:14px;padding:16px;min-height:88px;border-radius:18px;border:1px solid var(--line-2);text-align:left;color:var(--chalk);background:linear-gradient(180deg,#1f4c66,#133246);box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 3px 0 rgba(0,0,0,.4)}
.nsx-act>span{font-size:40px;line-height:1;flex:none}
.nsx-act b{display:block;font:900 22px var(--f-display)}
.nsx-act small{display:block;font:700 14px var(--f-body);opacity:.85;margin-top:2px}
.nsx-act.tr{background:linear-gradient(180deg,#2a6a49,#174a31)}
.nsx-act.tr.hot{background:linear-gradient(180deg,#43b55b,#21813a);border-color:#7fe08a;animation:nsglow 1.8s ease-in-out infinite}
.nsx-act.off{opacity:.75}
.nsx-act:active,.nsx-st:active,.nsx-tile:active{transform:translateY(2px);box-shadow:none}
.nsx .nsnext{padding:16px;border-radius:18px;gap:8px}
.nsx .nsnext .wk{font:900 13px var(--f-body);color:#ffd84a;text-transform:uppercase;letter-spacing:.06em}
.nsx .nsnext .tm b{font-size:24px}
.nsx .nsnext .tm .shield{transform:scale(1.25)}
.nsx-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.nsx-tile{display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:14px;align-items:center;text-align:left;padding:16px;min-height:96px;border-radius:18px;border:1px solid var(--line-2);color:var(--chalk);background:linear-gradient(180deg,#1d4a33,#123425);box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 3px 0 rgba(0,0,0,.4)}
.nsx-tile>span{grid-row:1/3;font-size:42px;line-height:1}
.nsx-tile b{font:900 21px var(--f-display);align-self:end}
.nsx-tile small{font:700 14px var(--f-body);color:#a9c6b4;align-self:start}
#nsBetB{background:linear-gradient(180deg,#3a2a06,#1c1403);border-color:#d6a21e}
#nsBetB b{color:#ffcf3a}
body.nshub .nsweek{gap:8px}
body.nshub .nsweek .nsw.nx{display:none}
.nsv-more.one{grid-template-columns:1fr}
.fgram-h b{font-size:36px!important;font-style:italic;letter-spacing:.01em}
@media (min-height:900px) and (min-width:600px){
 .nsx{gap:16px}
 .nsx-fofo.big{padding:26px 22px}.nsx-fofo.big .lg{font-size:42px}.nsx-fofo.big .av{width:60px;height:60px}
 .nsx-st{padding:18px;gap:10px}.nsx-st b{font-size:34px}
 .nsx-act{min-height:112px;padding:20px}.nsx-act>span{font-size:48px}.nsx-act b{font-size:26px}.nsx-act small{font-size:15px}
 .nsx .nsnext{padding:22px}.nsx .nsnext .tm b{font-size:28px}.nsx .nsnext .tm .shield{transform:scale(1.6);margin:0 8px}
 .nsx-grid{gap:14px}.nsx-tile{min-height:116px}.nsx-tile>span{font-size:50px}.nsx-tile b{font-size:23px}.nsx-tile small{font-size:15px}}
body.nshub .nsw{font-size:15px;padding:9px 14px;min-height:42px}
body.nshub .nsw span{font-size:18px}
body.nshub .nsh-nav{gap:10px}
body.nshub .nsh-nav button{padding:12px 6px;min-height:78px;border-radius:18px}
body.nshub .nsh-nav span{font-size:32px}
body.nshub .nsh-nav small{font-size:17px;font-weight:900}
@media (max-width:560px){
 .nsx-tabs .nstabs.n5 button{font-size:13px;min-height:44px}.nsx-tabs .nstabs.n5 .l{display:none}.nsx-tabs .nstabs.n5 .s{display:inline}
 .nsx-fofo{padding:12px 14px;border-radius:16px}.nsx-fofo .lg{font-size:24px}.nsx-fofo .av{width:40px;height:40px}.nsx-fofo .tx b{font-size:13px}.nsx-fofo .tx small{font-size:12px}.nsx-fofo em{display:none}
 .nsx-fofo.big{flex-direction:column;align-items:flex-start;gap:8px}
 .nsx-st{padding:10px;gap:6px}.nsx-st small{font-size:11px}.nsx-st b{font-size:20px}
 .nsx-act{padding:12px;min-height:70px;gap:10px}.nsx-act>span{font-size:30px}.nsx-act b{font-size:18px}.nsx-act small{font-size:12px}
 .nsx .nsnext .tm b{font-size:17px}
 .nsx-grid{gap:8px}.nsx-tile{padding:12px;min-height:76px;column-gap:10px}.nsx-tile>span{font-size:32px}.nsx-tile b{font-size:17px}.nsx-tile small{font-size:12px}
 body.nshub .nsw{font-size:13px;padding:6px 10px;min-height:36px}
 body.nshub .nsh-nav button{min-height:64px}body.nshub .nsh-nav span{font-size:26px}body.nshub .nsh-nav small{font-size:14px}
 .nshero-tb .nshero-cash{font-size:13px;padding:4px 9px}}
@media (max-height:760px){.nsx-fofo.big{padding:10px 14px}.nsx-act{min-height:62px}.nsx .nsnext{padding:10px}}
`;document.head.appendChild(st)}
