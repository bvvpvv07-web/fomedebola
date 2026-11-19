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
// Loja: só o que se compra. Conquistas e troféus ficam na aba Carreira; BETTIGER e estábulo, na Vida.
function nsItensHTML(){const n=S.n;const bt=nsBootStats();const drinks=Object.values(n.dr).reduce((s,x)=>s+x,0);
 const T=[['nsShopB','🏎️','Patrimônio','Carros, casas e estilo de vida'],['nsDrShopB','🥤','Energéticos',drinks?`${drinks} na mochila`:'Recuperam energia'],
  ['nsBootShopB','👟','Chuteiras',bt?`${bt.n} · ${n.bootLeft} jogos`:'Dão habilidades especiais'],['nsLookB','🎨','Visual e camisa','Cabelo, barba, nome e número']];
 return`<div class="nsx-grid big">${T.map(([id,ic,t,s])=>`<button class="nsx-tile" id="${id}"><span>${ic}</span><b>${t}</b><small>${esc(s)}</small></button>`).join('')}</div>`}
function nsCarreiraTiles(){const achP=typeof nsAchPct==='function'?nsAchPct():0;const T=(S.titles||[]).length;
 return`<div class="nsx-grid">${[['nsAchB','🏅','Conquistas',`${String(achP).replace('.',',')}% completas`],['nsTrophyB','🏆','Sala de troféus',`${T} título${T===1?'':'s'}`]].map(([id,ic,t,s])=>`<button class="nsx-tile" id="${id}"><span>${ic}</span><b>${t}</b><small>${esc(s)}</small></button>`).join('')}</div>`}
{const _hh5=nsHubHTML;nsHubHTML=function(){let h=_hh5.apply(this,arguments);
 try{if(NS_TAB==='status'||NS_TAB==='itens')h=h.replace(/<div class="nsh-body" id="nsBody">[\s\S]*?<\/div>\s*<div class="nsh-tick">/,`<div class="nsh-body" id="nsBody">${NS_TAB==='itens'?nsItensHTML():nsInicioHTML()}</div>\n <div class="nsh-tick">`);
  if(NS_TAB==='estats')h=h.replace(/(<div class="nsh-body" id="nsBody">[\s\S]*?)(<\/div>\s*<div class="nsh-tick">)/,(m,a,b)=>a+nsCarreiraTiles()+b);
  const dot=k=>k==='contrato'&&(S.n.offers||[]).length||k==='patro'&&S.n.spOffer?' dot':'';
  const tabs=[['status','Início','Início'],['itens','Loja','Loja'],['contrato','Contrato','Contrato'],['patro','Patrocínio','Marcas'],['estats','Carreira','Carreira']].map(([k,t,sh])=>`<button data-nt="${k}" class="${NS_TAB===k?'on':''}${dot(k)}"><span class="l">${t}</span><span class="s">${sh}</span></button>`).join('');
  h=h.replace(/<div class="nsh-sub">[\s\S]*?<span class="mono gold">[^<]*<\/span><\/div>/,`<div class="nsh-sub nsx-tabs"><div class="nstabs n5">${tabs}</div></div>`);
  h=h.replace('<button class="nsico" id="nsCfg"',`<span class="nshero-cash">💰 ${money(S.din)}</span><button class="nsico" id="nsCfg"`)}catch(e){console.error(e)}
 return h}}
{const _rnh5=nsRenderHub;nsRenderHub=function(){const r=_rnh5.apply(this,arguments);try{const on=(id,fn)=>{const e=document.getElementById(id);if(e)e.onclick=fn};
  on('nsFofoB',()=>nsNews());on('nsTrB',()=>nsOpen(nsHabPage()));on('nsDrB2',()=>{const d=Object.values(S.n.dr).reduce((s,x)=>s+x,0);if(d)nsDrinkPick();else nsOpen(nsShopPage('dr'))});
  on('nsTrophyB',()=>nsOpen(nsTrophyPage()));on('nsBetB',()=>nsOpen(nsCasinoPage()));on('nsStableB',()=>nsOpen(nsStablePage()));on('nsLookB',()=>nsOpen(nsLookPage()))}catch(e){console.error(e)}return r}}
// Vida: o Fofocagram aparece grande, com o nome certo
{const _vp=nsVidaPage;nsVidaPage=function(){const pg=_vp.apply(this,arguments);const h0=pg.html;pg.html=()=>{let h=h0();h=h.replace(/<button class="nsc b" id="nsNews2">[\s\S]*?<\/button>/,'').replace('<div class="nsv-more">',nsFofoBtn('nsNews2','sm')+'<div class="nsv-more one">');return h};
 pg.nav=(pg.nav||[]).map(x=>/Cassino/.test(x.t)?{...x,ic:'🐯',t:'BETTIGER'}:x);return pg}}
if(typeof TOUR_HUB!=='undefined'){TOUR_HUB.push({sel:'#nsFofoB',t:'Fofocagram',d:'O Nardo Meses posta tudo da sua vida: namoro, balada, compras, briga com o técnico. Fama sobe, mas cuidado com o que ele descobre.'},{sel:'[data-nt="itens"]',t:'Loja',d:'Patrimônio (carros e casas), energéticos, chuteiras e o seu visual.'},{sel:'[data-nt="estats"]',t:'Carreira',d:'Seus números, conquistas e a sala de troféus.'})}

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
.nsx-grid.big .nsx-tile{min-height:150px;grid-template-columns:1fr;grid-template-rows:auto auto auto;justify-items:center;text-align:center;row-gap:6px}
.nsx-grid.big .nsx-tile>span{grid-row:auto;font-size:56px}
.nsh-body .nsst+.nsx-grid{margin-top:12px}
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
 .nsx-tabs .nstabs.n5 button{font-size:12px;letter-spacing:-.02em;min-height:44px;padding:0 1px}.nsx-tabs .nstabs.n5 .l{display:none}.nsx-tabs .nstabs.n5 .s{display:inline}
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

// Habilidades: o botão de treino diz a jogada que você vai treinar (Drible, Passe, Finalização…)
{const _hp2=nsHabPage;nsHabPage=function(){const p=_hp2();const h0=p.html;p.html=()=>{let h=h0();
  h=h.replace(/<button class="nshr-go( done)?" data-tr="(\w+)"([^>]*)>›<\/button>/g,(m,dn,k,rest)=>{const[ic,nm]=nsTrNm(k);return`<button class="nshr-go tr2${dn||''}" data-tr="${k}"${rest}><span>${ic}</span><small>${nm}</small></button>`});return h};return p}}
{const st=document.createElement('style');st.textContent=`
.nshr-go.tr2{width:auto;min-width:104px;display:grid;justify-items:center;align-content:center;gap:2px;padding:6px 8px}
.nshr-go.tr2 span{font-size:26px;line-height:1}
.nshr-go.tr2 small{font:900 13px var(--f-body);white-space:nowrap}
@media (max-width:560px){.nshr-go.tr2{min-width:78px}.nshr-go.tr2 span{font-size:20px}.nshr-go.tr2 small{font-size:11px}}`;document.head.appendChild(st)}

// ================= AGENTES E TREINADORES COM NOME =================
// Agentes: o Pai (barato, de confiança), o Passo a Passo (constrói a carreira) e o Tubarão (os melhores contratos).
// Treinadores: Professor Juninho, Preparador Bigode e, no 3 estrelas, uma lenda do futebol.
function nsLegTr(){const n=S.n;if(!n.trLeg){let L=[];try{L=LEGENDS.filter(x=>x[1]==='🇧🇷').map(x=>x[0])}catch(e){}if(!L.length)L=['Lenda'];n.trLeg=pick(L)}return n.trLeg}
const NS_STAFF_P={ag:[{nick:'Pai',ic:'👨',look:{custom:{skin:'#c68642',hairC:'#8a8a8a',style:'buzz',beard:'barba',acc:''}},say:'"Filho, eu cuido de você. Não cobro quase nada."'},
  {nick:'Passo a Passo',ic:'🧑‍💼',look:{custom:{skin:'#e0ac69',hairC:'#2b1a0e',style:'lateral',beard:'',acc:''}},say:'"Sem pressa. Cada passo no momento certo."'},
  {nick:'Tubarão',ic:'🦈',look:{custom:{skin:'#f1c27d',hairC:'#111',style:'quiff',beard:'cavanhaque',acc:'brinco'}},say:'"Eu arranco até o último centavo da diretoria."'}],
 tr:[{nick:'Professor Juninho',ic:'🏃',look:{custom:{skin:'#8d5524',hairC:'#111',style:'cacheado',beard:'',acc:''}},say:'"Cone, escada e muita vontade."'},
  {nick:'Preparador Bigode',ic:'🧑‍🏫',look:{custom:{skin:'#e0ac69',hairC:'#5a3a1a',style:'buzz',beard:'barba',acc:''}},say:'"Ciência do esporte: carga certa, descanso certo."'},
  {nick:'Lenda',ic:'🌟',look:{custom:{skin:'#a0662f',hairC:'#d9d9d9',style:'bald',beard:'barba',acc:''}},say:'"Eu já ganhei tudo. Agora te ensino como."'}]};
try{const A=NS_STAFF.ag,T=NS_STAFF.tr;
 A[0].n='Seu pai';A[0].d='A família cuida de tudo: confiança total e quase de graça. +8% em salário, bônus e patrocínio.';
 A[1].n='Agência Passo a Passo';A[1].d='Planejamento com calma, um passo de cada vez. +15% em tudo e mais marcas te procurando.';
 A[2].n='Rui "Tubarão" Monteiro';A[2].d='Agressivo, tem o telefone de todo presidente. +25% em tudo e segura um erro na renovação.';
 T[0].n='Professor Juninho';T[0].d='Treinador de bairro, muita disposição. +10% de energia por semana e treino 10% melhor.';
 T[1].n='Preparador Bigode';T[1].d='Preparador físico profissional. +20% de energia por semana e treino 20% melhor.';
 Object.defineProperty(T[2],'n',{get(){return nsLegTr()},configurable:true});T[2].d='Uma lenda do futebol vira seu treinador pessoal. +30% de energia por semana e treino 35% melhor.'}catch(e){console.error(e)}
// quem saiu fica lembrado pra renovar
{const _sw=nsStaffWeek;nsStaffWeek=function(st){const n=S.n;const was={ag:n.staff&&n.staff.ag&&n.staff.ag.t,tr:n.staff&&n.staff.tr&&n.staff.tr.t};const r=_sw.apply(this,arguments);n.staffLast=n.staffLast||{};for(const k of['ag','tr'])if(was[k]&&!n.staff[k])n.staffLast[k]=was[k];return r}}
nsStaffPage=function(){return{t:'Agente e treinador',cls:'staff',html:()=>{const n=S.n;nsMig();const c=club()||{};
  const card=(k,x)=>{const P=NS_STAFF_P[k][x.t-1];const cur=n.staff[k];const on=cur&&cur.t===x.t;const was=!cur&&n.staffLast&&n.staffLast[k]===x.t;let face='';try{face=faceSVG(P.look,k==='ag'?'#1f2a44':'#1d6b3a','#fff')}catch(e){}
   return`<div class="nsx-staff ${on?'on':''}"><i class="av">${face}</i><div class="tx"><small>${k==='ag'?'Agente':'Treinador pessoal'} · ${'★'.repeat(x.t)}</small><b>${esc(x.n)}</b><em>${esc(P.say)}</em><span>${esc(x.d)}</span>${on?`<span class="good">Contratado · faltam ${cur.wk} semanas</span>`:was?'<span class="warn">O contrato acabou. Renove pra continuar.</span>':''}</div>
    <button class="btn ${on?'ghost':''}" data-hs="${k}:${x.t}">${on||was?'Renovar':'Contratar'}<small>${money(x.p)} · ${NS_STAFF_WK} sem.</small></button></div>`};
  return`<div class="nsx-sh"><b>💼 Agentes</b><small>Ganham parte do que você recebe e conseguem clubes e marcas.</small></div>${NS_STAFF.ag.map(x=>card('ag',x)).join('')}
  <div class="nsx-sh"><b>⏱️ Treinadores pessoais</b><small>Mais energia toda semana e treino que rende mais.</small></div>${NS_STAFF.tr.map(x=>card('tr',x)).join('')}`},
 bind:B=>B.querySelectorAll('[data-hs]').forEach(b=>b.onclick=async()=>{const[k,t]=b.dataset.hs.split(':');const x=NS_STAFF[k][+t-1];const cur=S.n.staff[k];
  if(cur&&cur.t!==x.t){const q=await nsPop({ic:'📝',title:`Trocar por ${x.n}?`,txt:'O contrato atual é cancelado sem reembolso.',opts:[['y','Trocar']],ok:'Cancelar'});if(q!=='y')return}
  if(!nsPay(x.p))return;S.n.staff[k]={t:x.t,wk:NS_STAFF_WK};if(S.n.staffLast)S.n.staffLast[k]=0;toast({ic:NS_STAFF_P[k][x.t-1].ic,title:`${x.n} ${cur&&cur.t===x.t?'renovado':'contratado'}`,txt:`${NS_STAFF_WK} semanas`,ms:2000});nsRefresh()})}};

// ================= PATROCÍNIO É DIFÍCIL =================
// Marca só aparece com estrela: até nível 2 nenhuma; depois uma a cada 2 níveis. E entre uma e outra passam semanas.
function nsSpCap(){const l=(S.n&&S.n.star&&S.n.star.l)||1;return clamp(Math.floor((l-1)/2),0,NS_SCAT.length)}
nsSpOffer=function(force){const n=S.n;const free=NS_SCAT.filter(c=>!n.sps[c[0]]);if(!free.length)return null;const ag=(n.staff.ag&&NS_STAFF.ag[n.staff.ag.t-1])||{sp:0};
 if(Object.keys(n.sps).length>=nsSpCap())return null;
 if(!force&&n.week-(n.spLastW??-99)<8)return null;
 const p=force?clamp(.08+n.star.l*.025+n.rel.fans/400+ag.sp,.05,.5):clamp(.04+n.rel.fans/700+ag.sp*.6,.03,.2);if(!ch(p))return null;
 const c=pick(free);const used=new Set(Object.values(n.sps).map(x=>x.b));const b=pick(NS_BRANDS.filter(x=>!used.has(x)))||pick(NS_BRANDS);
 const w=Math.max(1,Math.min(Math.max(2,Math.round((S.wage||1)*.7)),Math.round((n.star.l**1.3)*(.35+n.rel.fans/130)*c[3]*R(.8,1.2))));
 n.spLastW=n.week;return{cat:c[0],b,w,wk:RI(20,40)}};
{const _spt=nsSpTabHTML;nsSpTabHTML=function(){const h=_spt();const cap=nsSpCap();const k=Object.keys(S.n.sps).length;
 return`<div class="nsx-note">⭐ Com estrela nível ${S.n.star.l} as marcas aceitam até <b>${cap}</b> patrocínio${cap===1?'':'s'} (você tem ${k}). ${cap<=k?`Suba pro nível ${(cap+1)*2+1} pra caber mais um.`:'Elas demoram a aparecer: jogue bem e ganhe os fãs.'}</div>`+h}}

// ================= RENOVAÇÃO: JOGO DO NÚMERO DA CAMISA =================
// Sai um número de camisa. O próximo é maior ou menor? Acertou: a proposta melhora. Errou: a diretoria encerra e você perde a renovação.
// Pare quando quiser e assine. O Tubarão segura um erro.
function nsRenewGame(o){return new Promise(res=>{const n=S.n;const c=club();const agT=(n.staff.ag&&n.staff.ag.t)||0;const mul=1+agT*.15;
 const INC=[.06,.08,.1,.12,.15].map(x=>x*mul);let cur=clamp(S.shirt||S.num||9,1,99),round=0,wage=o.wage,years=o.years,saved=agT>=3,msg='',cls='';
 const h=document.createElement('div');h.className='nsx-rg-host';document.body.appendChild(h);
 const draw=(rev)=>{h.innerHTML=`<div class="nsx-rg"><div class="rg-hd">${shieldHTML(c,'sm')}<b>Renovação · ${esc(c.n)}</b></div>
  <p class="rg-how">O próximo número de camisa vai ser <b>MAIOR</b> ou <b>MENOR</b>? Acertou, a proposta melhora. Errou, a diretoria encerra a conversa e você <b>perde a renovação</b>. Assine quando quiser.</p>
  <div class="rg-cards"><div class="rg-shirt" style="--c1:${c.c1||'#ff7a2b'}"><i>${cur}</i><small>agora</small></div><div class="rg-shirt q ${rev!=null?'rev':''}"><i>${rev!=null?rev:'?'}</i><small>próximo</small></div></div>
  <div class="rg-offer"><span>Proposta</span><b>${nsK(wage)}/semana · ${years} ano${years>1?'s':''}</b><small>${wage>o.wage?`+${Math.round((wage/o.wage-1)*100)}% sobre a primeira`:'a primeira oferta da diretoria'}${round<5?` · próximo acerto: +${Math.round(INC[round]*100)}%`:''}</small></div>
  <div class="rg-steps">${[0,1,2,3,4].map(i=>`<i class="${i<round?'ok':''}"></i>`).join('')}</div>
  <div class="rg-msg ${cls}">${msg}</div>
  ${rev!=null?'':`<div class="rg-row2"><button class="btn big up" data-g="1">⬆ MAIOR</button><button class="btn big dn" data-g="-1">⬇ MENOR</button></div>`}
  <button class="btn wide rg-sign" data-s="1" ${rev!=null?'disabled':''}>✍️ Assinar · ${nsK(wage)}/sem</button></div>`;
  h.querySelectorAll('[data-g]').forEach(b=>b.onclick=()=>guess(+b.dataset.g));const sb=h.querySelector('[data-s]');if(sb)sb.onclick=()=>{h.remove();res({wage,years})}};
 const guess=g=>{let nx;do{nx=RI(1,99)}while(nx===cur);const ok=g>0?nx>cur:nx<cur;
  if(ok){wage=Math.round(wage*(1+INC[round])*100)/100;if(round===2)years++;round++;msg=`✓ ${nx}! A proposta subiu.`;cls='good';try{SFX.tick&&SFX.tick()}catch(e){}}
  else if(saved){saved=false;msg=`✕ Deu ${nx}. O Tubarão segurou a conversa: mais uma chance.`;cls='warn'}
  else{draw(nx);const m=h.querySelector('.rg-msg');m.className='rg-msg bad';m.textContent=`✕ Deu ${nx}. A diretoria encerrou a conversa.`;setTimeout(()=>{h.remove();res(null)},1700);return}
  draw(nx);setTimeout(()=>{cur=nx;if(round>=5){h.remove();res({wage,years});return}draw()},900)};
 draw()})}
nsRenew=async function(){const c=club();const n=S.n;if(S.loan){await nsPop({ic:'🔁',title:'Emprestado',txt:'Renovação só com o clube dono do seu passe.'});return}
 if(S.contract>1){await nsPop({ic:'✍️',title:'Ainda não',txt:`Seu contrato vai até ${S.year+S.contract}. A diretoria só conversa quando faltar 1 ano.`});return}
 if(n.renewBan===S.year){await nsPop({ic:'🚪',title:'Conversa encerrada',txt:'Você perdeu a renovação nesta temporada. No fim do ano procure outro clube com o agente.'});return}
 const o=renewalOffer();if(!o||o.refuse){await nsPop({ic:'🙅',title:'A diretoria não quer renovar',txt:'Melhore as atuações e a relação com o técnico. Ou procure outro clube com o agente.'});return}
 const r=await nsRenewGame(o);
 if(!r){n.renewBan=S.year;await nsPop({ic:'💔',title:'Perdeu a renovação',txt:`O ${c.n} não renova mais nesta temporada. Seu contrato acaba em ${S.year+Math.max(0,S.contract)}.`});renderHub();return}
 S.contract=r.years+(S.contract>0?S.contract:0);S.wage=r.wage;nsSync();try{nsAchHit('contrato')}catch(e){}
 await nsPop({ic:'✍️',title:'Contrato renovado!',txt:`${r.years} anos, ${nsK(r.wage)} por semana. Bônus por gol e assistência acompanham o salário.`});renderHub()};

// ================= QUEBRA-CABEÇA COM O TÉCNICO E O ELENCO =================
// 3 fotos com peças viradas: toque pra girar. 0 = perde relação · 1 = pouco · 2 = mais · 3 = avanço total.
function nsPzImg(k,i){const c=club()||{};const c1=c.c1||'#c8102e',c2=c.c2||'#fff';const looks=[{custom:{skin:'#e0ac69',hairC:'#3a2a1a',style:'buzz',beard:'barba',acc:''}},{custom:{skin:'#8d5524',hairC:'#111',style:'afro',beard:'',acc:''}},S.face||{preset:0}];
 const lab=k==='coach'?['O TÉCNICO','NO TREINO','VOCÊ'][i]:['O ELENCO','RESENHA','VOCÊ'][i];let f='';try{f=faceSVG(looks[i],c1,c2).replace('<svg','<svg x="45" y="20" width="210" height="210"')}catch(e){}
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="#0d2a1c"/></linearGradient></defs><rect width="300" height="300" fill="url(#g)"/>${[0,1,2,3,4,5].map(j=>`<path d="M${-60+j*70} 300 L${40+j*70} 0" stroke="${c2}" stroke-opacity=".18" stroke-width="16"/>`).join('')}<circle cx="38" cy="38" r="18" fill="${c2}" fill-opacity=".85"/><path d="M262 20 l18 18 -18 18z" fill="#ffd84a"/>${f}<rect x="0" y="238" width="300" height="62" fill="#000" fill-opacity=".55"/><text x="150" y="281" font-family="system-ui,sans-serif" font-size="36" font-weight="900" fill="#fff" text-anchor="middle">${lab}</text></svg>`;
 return'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)}
function nsPuzzle(k){return new Promise(res=>{const nm=k==='coach'?'o técnico':'o elenco';const h=document.createElement('div');h.className='nsx-rg-host';document.body.appendChild(h);let round=0,won=0,timer=null;
 const RT=[3,4,5],TT=[14,13,12];
 const start=()=>{const img=nsPzImg(k,round);const rot=Array(9).fill(0);const idx=[...Array(9).keys()].sort(()=>Math.random()-.5).slice(0,RT[round]);idx.forEach(i=>rot[i]=RI(1,3));let left=TT[round],done=false;
  const paint=()=>{h.innerHTML=`<div class="nsx-rg pz"><div class="rg-hd"><b>🧩 Quebra-cabeça com ${nm}</b></div><p class="rg-how">Toque nas peças pra girar e monte a foto antes do tempo acabar. Rodada <b>${round+1} de 3</b>.</p>
   <div class="pzt"><i style="width:${left/TT[round]*100}%"></i></div><div class="pzg">${rot.map((r,i)=>`<button data-p="${i}" style="background-image:url('${img}');background-position:${(i%3)*50}% ${Math.floor(i/3)*50}%;transform:rotate(${r*90}deg)" class="${r?'':'ok'}"></button>`).join('')}</div>
   <div class="rg-steps">${[0,1,2].map(i=>`<i class="${i<round?(i<won?'ok':'no'):''}"></i>`).join('')}</div></div>`;
   h.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{if(done)return;const i=+b.dataset.p;rot[i]=(rot[i]+1)%4;b.style.transform=`rotate(${rot[i]*90}deg)`;b.classList.toggle('ok',!rot[i]);try{SFX.tick&&SFX.tick()}catch(e){}if(rot.every(r=>!r))finish(true)})};
  const finish=ok=>{if(done)return;done=true;clearInterval(timer);if(ok)won++;const g=h.querySelector('.pzg');if(g)g.classList.add(ok?'win':'lose');setTimeout(()=>{round++;if(round>=3){h.remove();res(won)}else start()},ok?700:1000)};
  paint();timer=setInterval(()=>{left-=.25;const t=h.querySelector('.pzt i');if(t)t.style.width=Math.max(0,left/TT[round]*100)+'%';if(left<=0)finish(false)},250)};
 start()})}
{const _ra=nsRelAct;nsRelAct=async function(k){if(k!=='coach'&&k!=='team')return _ra.apply(this,arguments);const n=S.n;const nm=NS_REL.find(x=>x[0]===k)[1];
 n.relPz=n.relPz||{};if(n.relPz[k]===n.week){await nsPop({ic:'🗓️',title:'Já foi essa semana',txt:`Você já fez o quebra-cabeça com ${k==='coach'?'o técnico':'o elenco'} nesta rodada. Jogue a próxima partida.`});return}
 const cost=10;if(n.en<cost){toast({ic:'❤️',title:'Sem energia',txt:`Precisa de ${cost}% de energia.`,ms:2000});return}
 const q=await nsPop({ic:'🧩',title:`${nm}: quebra-cabeça`,txt:`3 fotos pra montar girando as peças. Acertou as 3: relação sobe muito. 2: sobe bem. 1: sobe pouco. Nenhuma: cai. Custa ${cost}% de energia.`,opts:[['go','▶ Começar']],ok:'Voltar'});if(q!=='go')return;
 n.en-=cost;n.relPz[k]=n.week;const h=nsHost();const was=!h.hidden;const won=await nsPuzzle(k);
 const d=[-6,3,7,14][won];const b=n.rel[k];n.rel[k]=clamp(b+d,0,100);nsSync();
 await nsPop({ic:won===3?'🔥':won===2?'👍':won===1?'🙂':'😬',title:won===3?'Montou tudo!':won?`${won} de 3`:'Não montou nenhuma',html:`<div class="nsx-relbar"><b>${nm}</b><span class="nsmb"><i style="width:${Math.round(n.rel[k])}%"></i></span><em class="${d>=0?'up':'down'}">${d>=0?'+':''}${Math.round(n.rel[k]-b)}</em></div>`,txt:won===3?'Avanço total na relação.':won?'A relação melhorou.':'Ficou um clima ruim.'});if(was)nsRefresh()}}

// ================= MAIS DA VIDA: A CIDADE =================
// Cada lugar abre as coisas que dá pra fazer ali, com cara de jogo.
const NS_PLACES=[['med','🏥','Hospital','Médico, fisio, psicólogo','#0f7d84',()=>medActs()],['gym','🏋️','Academia','Força e corpo','#3d5a80',()=>[gymAct()]],['balada','🪩','Balada','Sair com a galera','#7b2cbf',()=>[baladaAct()]],
 ['ferias','✈️','Viagem','Férias longe de tudo','#2a9df4',()=>feriasActs()],['est','🎓','Escola','Faculdade, livros, idiomas','#6a4c93',()=>estudoActs()],['hob','🎸','Hobbies','Música, luta, pesca, tatuagem','#c75000',()=>hobbyActs()],
 ['fam','👨‍👩‍👧','Família','Filhos e pets','#d1495b',()=>[adocaoAct(),...petActs()]],['bet','🐯','BETTIGER','Apostas e cassino','#a67c00',null],['stb','🐎','Estábulo','Cavalos de corrida','#6b4f2a',null],
 ['lot','🎟️','Loteria','Bilhete e raspadinha','#2b9348',()=>lotActs()],['crime','🦹','Lado errado','Crime, racha… e polícia','#5c0f14',()=>[...crimeActs(),licAct()]],['proc','⚖️','Tribunal','Processar alguém','#3c4048',()=>processoActs()],
 ['emig','🌍','Morar fora','Jogar em outro país','#1b4965',null],['rest','😴','Casa','Descansar','#33415c',()=>[restAct()]]];
function nsPlacePage(P){const[k,ic,t,d,col,get]=P;return{t,cls:'place',html:()=>{const A=get();const intro=k==='crime'?`<div class="nsx-note bad">🚨 Polícia de olho: ${Math.round(S.heat||0)} · Ficha: ${S.ficha?S.ficha+' passagem'+(S.ficha>1?'s':''):'limpa'}</div>`:'';
  return`<div class="nsx-place-hd" style="--pc:${col}"><span>${ic}</span><div><b>${t}</b><small>${esc(d)} · ${S.tempo!=null?`${S.tempo} dia${S.tempo===1?'':'s'} livre${S.tempo===1?'':'s'} até o jogo`:''}</small></div></div>${intro}
  <div class="nsx-acts">${A.filter(Boolean).map(a=>{const why=blActWhy(a);return`<button class="nsx-actc ${why?'off':''} ${a.warn?'warn':''}" data-a="${esc(a.id)}"><span>${a.ic}</span><div><b>${esc(a.n)}</b><small>${esc(a.d||'')}</small>${why?`<em>${esc(why)}</em>`:''}</div><i>${costLbl(a.c,a.t)}${a.mg?' · 🎮':''}</i></button>`}).join('')||'<p class="muted">Nada por aqui agora.</p>'}</div>`},
 bind:B=>B.querySelectorAll('[data-a]').forEach(b=>b.onclick=async()=>{const a=get().filter(Boolean).find(x=>x.id===b.dataset.a);if(!a)return;await blRunAct(a);nsRefresh()})}}
function nsMaisVidaPage(){return{t:'Mais da vida',cls:'city',html:()=>`<p class="muted nshelp">Escolha um lugar da cidade. Cada coisa gasta dias livres até o próximo jogo${S.tempo!=null?` (você tem <b>${S.tempo}</b>)`:''}.</p>
  <div class="nsx-city">${NS_PLACES.map(([k,ic,t,d,col])=>{const kid=(k==='bet'||k==='lot')&&S.age<18;return`<button class="nsx-pl ${kid?'off':''}" data-pl="${k}" style="--pc:${col}"><span>${ic}</span><b>${t}</b><small>${kid?'A partir dos 18 anos':esc(d)}</small></button>`}).join('')}</div>`,
 bind:B=>B.querySelectorAll('[data-pl]').forEach(b=>b.onclick=()=>{const k=b.dataset.pl;const P=NS_PLACES.find(x=>x[0]===k);if(b.classList.contains('off'))return toast({ic:'🔞',title:'A partir dos 18 anos',ms:1800});
  if(k==='bet')return nsPush(nsCasinoPage());if(k==='stb')return nsPush(nsStablePage());if(k==='emig'){try{nsHost().hidden=true;blOpen(emigPage())}catch(e){console.error(e);nsHost().hidden=false}return}
  nsPush(nsPlacePage(P))})}}
{const _vp2=nsVidaPage;nsVidaPage=function(){const pg=_vp2.apply(this,arguments);const b0=pg.bind;pg.bind=B=>{b0(B);const m=B.querySelector('#nsMoreB');if(m)m.onclick=()=>nsPush(nsMaisVidaPage())};
 const h0=pg.html;pg.html=()=>h0().replace(/<button class="nsc b" id="nsMoreB">[\s\S]*?<\/button>/,`<button class="nsx-more" id="nsMoreB"><span>🏙️</span><div><b>Mais da vida</b><small>Hospital, academia, balada, viagem, escola, BETTIGER, estábulo, lado errado…</small></div><em>›</em></button>`);
 pg.nav=(pg.nav||[]).map(x=>/BETTIGER|Cassino/.test(x.t)?{ic:'🏙️',t:'Cidade',fn:()=>nsPush(nsMaisVidaPage())}:x);return pg}}

{const st=document.createElement('style');st.textContent=`
.nsx-sh{display:grid;gap:2px;margin:6px 2px 2px}.nsx-sh b{font:900 18px var(--f-display)}.nsx-sh small{color:var(--muted);font:700 13px var(--f-body)}
.nsx-staff{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;padding:12px;border-radius:16px;border:1px solid var(--line-2);background:linear-gradient(180deg,#1d4a33,#123425)}
.nsx-staff.on{border-color:#7fe08a;box-shadow:0 0 0 2px #7fe08a55}
.nsx-staff .av{width:70px;height:70px;border-radius:16px;overflow:hidden;background:#0c1a12;border:2px solid rgba(255,255,255,.2)}.nsx-staff .av svg{width:100%;height:100%;display:block}
.nsx-staff .tx{display:grid;gap:2px;min-width:0}.nsx-staff .tx small{font:800 12px var(--f-body);color:#ffd84a;text-transform:uppercase;letter-spacing:.04em}
.nsx-staff .tx b{font:900 19px var(--f-display)}.nsx-staff .tx em{font:italic 700 13px var(--f-body);color:#cfe3d6}.nsx-staff .tx span{font:600 12.5px var(--f-body);color:var(--muted)}
.nsx-staff .tx .good{color:var(--good);font-weight:800}.nsx-staff .tx .warn{color:#ffb347;font-weight:800}
.nsx-staff .btn{display:grid;justify-items:center;gap:2px;min-width:112px}.nsx-staff .btn small{font:700 11.5px var(--f-body);opacity:.85}
.nsx-note{padding:10px 12px;border-radius:12px;background:#10261b;border:1px solid var(--line-2);font:700 13.5px var(--f-body);color:#d7e8dc;margin-bottom:8px}.nsx-note.bad{background:#3a1512;border-color:#8a3329}
.nsx-rg-host{position:fixed;inset:0;z-index:31;display:grid;place-items:center;padding:16px;background:rgba(3,10,6,.82);animation:blfade .15s}
.nsx-rg{width:min(560px,100%);display:grid;gap:12px;padding:18px;border-radius:22px;background:linear-gradient(180deg,#173d2a,#0b2216);border:1px solid #3f8c63;box-shadow:0 20px 60px rgba(0,0,0,.6);text-align:center;color:var(--chalk)}
.nsx-rg .rg-hd{display:flex;gap:10px;align-items:center;justify-content:center}.nsx-rg .rg-hd b{font:900 21px var(--f-display)}
.nsx-rg .rg-how{margin:0;font:600 14px/1.4 var(--f-body);color:#cfe3d6}
.nsx-rg .rg-cards{display:flex;gap:18px;justify-content:center}
.nsx-rg .rg-shirt{width:130px;height:150px;display:grid;place-items:center;align-content:center;border-radius:18px 18px 26px 26px;background:linear-gradient(180deg,var(--c1,#ff7a2b),#a83a00);box-shadow:inset 0 -10px 0 rgba(0,0,0,.2),0 8px 20px rgba(0,0,0,.4);position:relative}
.nsx-rg .rg-shirt i{font:900 64px/1 var(--f-display);font-style:normal;color:#fff;text-shadow:0 3px 0 rgba(0,0,0,.3)}.nsx-rg .rg-shirt small{font:800 12px var(--f-body);text-transform:uppercase;opacity:.85}
.nsx-rg .rg-shirt.q{background:linear-gradient(180deg,#2b3d34,#14221b)}.nsx-rg .rg-shirt.q.rev{background:linear-gradient(180deg,#ffd84a,#c79100);animation:ninPop .5s}.nsx-rg .rg-shirt.q.rev i{color:#1b1200;text-shadow:none}
.nsx-rg .rg-offer{display:grid;gap:2px;padding:10px;border-radius:14px;background:#0a1a12}.nsx-rg .rg-offer span{font:800 12px var(--f-body);color:var(--muted);text-transform:uppercase}.nsx-rg .rg-offer b{font:900 22px var(--f-display);color:#ffd84a}.nsx-rg .rg-offer small{font:700 12.5px var(--f-body);color:#a9c6b4}
.nsx-rg .rg-steps{display:flex;gap:6px;justify-content:center}.nsx-rg .rg-steps i{width:28px;height:8px;border-radius:4px;background:#2a3a30}.nsx-rg .rg-steps i.ok{background:#5fd06a}.nsx-rg .rg-steps i.no{background:#d64b3c}
.nsx-rg .rg-msg{min-height:20px;font:900 16px var(--f-body)}.nsx-rg .rg-msg.good{color:var(--good)}.nsx-rg .rg-msg.bad{color:#ff6b5b}.nsx-rg .rg-msg.warn{color:#ffb347}
.nsx-rg .rg-row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}.nsx-rg .btn.big{font:900 22px var(--f-display);padding:16px 8px}.nsx-rg .btn.up{background:linear-gradient(180deg,#43b55b,#21813a)}.nsx-rg .btn.dn{background:linear-gradient(180deg,#e0533f,#9e2a1c)}
.nsx-rg .rg-sign{font-size:17px}
.nsx-rg.pz .pzt{height:10px;border-radius:5px;background:#0a1a12;overflow:hidden}.nsx-rg.pz .pzt i{display:block;height:100%;background:linear-gradient(90deg,#ffd84a,#ff7a2b);transition:width .25s linear}
.nsx-rg .pzg{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;width:min(360px,78vw);aspect-ratio:1;margin:0 auto;padding:3px;border-radius:14px;background:#0a1a12}
.nsx-rg .pzg button{border:0;padding:0;background-size:300% 300%;border-radius:6px;transition:transform .15s;box-shadow:inset 0 0 0 2px rgba(255,216,74,.7)}
.nsx-rg .pzg button.ok{box-shadow:none}.nsx-rg .pzg.win{box-shadow:0 0 0 4px #5fd06a}.nsx-rg .pzg.lose{box-shadow:0 0 0 4px #d64b3c;opacity:.75}
.nsx-relbar{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;font:800 15px var(--f-body)}.nsx-relbar em{font:900 20px var(--f-display);font-style:normal}.nsx-relbar em.up{color:var(--good)}.nsx-relbar em.down{color:#ff6b5b}
.nsx-more{display:flex;align-items:center;gap:14px;width:100%;padding:16px;border-radius:18px;border:0;text-align:left;color:#fff;background:linear-gradient(115deg,#1b4965,#5c2a9d 55%,#c75000);box-shadow:0 6px 20px rgba(0,0,0,.35)}
.nsx-more>span{font-size:40px}.nsx-more b{display:block;font:900 22px var(--f-display)}.nsx-more small{font:700 13px var(--f-body);opacity:.9}.nsx-more em{margin-left:auto;font:900 30px var(--f-body);font-style:normal}
.nsx-city{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.nsx-pl{display:grid;justify-items:center;align-content:center;gap:4px;min-height:118px;padding:12px 8px;border-radius:18px;border:0;color:#fff;text-align:center;background:linear-gradient(160deg,var(--pc),#0b1a12 120%);box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 4px 0 rgba(0,0,0,.35)}
.nsx-pl>span{font-size:42px;line-height:1;filter:drop-shadow(0 3px 2px rgba(0,0,0,.4))}.nsx-pl b{font:900 17px var(--f-display)}.nsx-pl small{font:700 12px var(--f-body);opacity:.85}.nsx-pl.off{filter:grayscale(.8);opacity:.6}
.nsx-pl:active,.nsx-actc:active{transform:translateY(2px)}
.nsx-place-hd{display:flex;gap:14px;align-items:center;padding:18px;border-radius:20px;color:#fff;background:linear-gradient(135deg,var(--pc),#0b1a12);margin-bottom:10px}.nsx-place-hd>span{font-size:54px}.nsx-place-hd b{font:900 26px var(--f-display);display:block}.nsx-place-hd small{font:700 13px var(--f-body);opacity:.9}
.nsx-acts{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.nsx-actc{display:grid;grid-template-columns:auto 1fr;grid-template-rows:1fr auto;column-gap:10px;align-items:center;text-align:left;padding:14px;border-radius:16px;border:1px solid var(--line-2);color:var(--chalk);background:linear-gradient(180deg,#1d4a33,#123425)}
.nsx-actc>span{grid-row:1/3;font-size:34px}.nsx-actc b{font:900 16px var(--f-display)}.nsx-actc small{display:block;font:600 12.5px var(--f-body);color:#a9c6b4}.nsx-actc em{display:block;font:800 12px var(--f-body);color:#ffb347;font-style:normal}
.nsx-actc i{font:800 12px var(--f-body);font-style:normal;color:#ffd84a}.nsx-actc.off{opacity:.55}.nsx-actc.warn{border-color:#8a3329;background:linear-gradient(180deg,#3a1512,#220c0a)}
@media (max-width:560px){.nsx-city{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.nsx-pl{min-height:92px}.nsx-pl>span{font-size:32px}.nsx-acts{grid-template-columns:1fr}
 .nsx-staff{grid-template-columns:auto 1fr}.nsx-staff .btn{grid-column:1/-1}.nsx-staff .av{width:56px;height:56px}.nsx-rg .rg-shirt{width:104px;height:124px}.nsx-rg .rg-shirt i{font-size:50px}}
`;document.head.appendChild(st)}

// ================= SALÁRIO EXPLICADO =================
{const _ct=nsCtTabHTML;nsCtTabHTML=function(){let h=_ct();const ct=nsCt()||{};const agp=Math.round(nsAgentPct()*100);
 h=h.replace(/(<tr><th>Bônus por assistência<\/th><td>[^<]*<\/td><\/tr>)/,`$1<tr><th>Bônus por passe certo</th><td>${nsK2(ct.pb||0)}</td></tr><tr><th>Bônus por finalização</th><td>${nsK2(ct.fb||0)}</td></tr>`);
 return`<div class="nsx-note">💡 <b>Como você ganha:</b> toda semana entra o salário (metade vai pra impostos) e mais um bônus por cada gol, assistência, passe certo e finalização do jogo. Marcas pagam por jogo. ${agp?`Seu agente põe +${agp}% em tudo.`:'Um agente aumenta tudo.'}</div>`+h}}
{const st=document.createElement('style');st.textContent=`
.nsp-step{font:900 12px var(--f-body);letter-spacing:.12em;text-transform:uppercase;color:#ffd84a;text-align:center}
.nsx-rrs{display:grid;gap:10px}
.nsx-rr{display:grid;grid-template-columns:auto 1fr auto auto;gap:12px;align-items:center;padding:12px 14px;border-radius:16px;background:linear-gradient(180deg,#1d4a33,#123425);border:1px solid var(--line-2)}
.nsx-rr .ic{font-size:30px}.nsx-rr .mid{display:grid;gap:5px;min-width:0}.nsx-rr .mid b{font:900 17px var(--f-display)}.nsx-rr .mid small{font:700 12.5px var(--f-body);color:#a9c6b4}
.nsx-rr .bar{position:relative;height:12px;border-radius:6px;background:#0a1a12;overflow:hidden}.nsx-rr .bar i{position:absolute;top:0;bottom:0;left:0;border-radius:6px}
.nsx-rr .bar .base{background:#4f8a66}.nsx-rr .bar .dlt{transition:width .9s cubic-bezier(.2,.8,.2,1)}
.nsx-rr.up .bar .dlt{background:linear-gradient(90deg,#7fe08a,#c8ff9a);box-shadow:0 0 10px #7fe08a}.nsx-rr.down .bar .dlt{background:repeating-linear-gradient(135deg,#d64b3c 0 6px,#8a2a20 6px 12px)}
.nsx-rr em{font:900 24px var(--f-display);font-style:normal;min-width:52px;text-align:right}.nsx-rr.up em{color:#7fe08a}.nsx-rr.down em{color:#ff6b5b}.nsx-rr em{color:var(--muted)}
.nsx-rr.up em{color:#7fe08a}.nsx-rr.down em{color:#ff6b5b}.nsx-rr .v{font:800 13px var(--f-mono);color:var(--muted)}
.nsx-mns{display:grid;gap:8px}
.nsx-mn{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;padding:10px 14px;border-radius:14px;background:#10261b;border:1px solid var(--line-2)}
.nsx-mn>span{font-size:26px}.nsx-mn b{font:900 16px var(--f-display);display:block}.nsx-mn small{font:700 12.5px var(--f-body);color:#a9c6b4}.nsx-mn em{font:900 18px var(--f-mono);font-style:normal;color:#ffd84a}
.nsx-mn.zero{opacity:.55}.nsx-mn.zero em{color:var(--muted)}
.nsx-en{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;padding:10px 14px;border-radius:14px;background:#10261b;border:1px solid var(--line-2);font:800 14px var(--f-body)}
.nsx-en .bar{height:12px;border-radius:6px;background:#0a1a12;overflow:hidden}.nsx-en .bar i{display:block;height:100%;background:linear-gradient(90deg,#3fae4c,#7fe08a)}.nsx-en small{grid-column:1/-1;color:#a9c6b4;font-weight:700}
`;document.head.appendChild(st)}

// ================= COMEÇO DE CARREIRA: DA RUA DIRETO PRO CAMPO =================
// O empresário escolhido antes da peneira (Seu pai, Passo a Passo ou Tubarão) já começa contratado.
{const _mg=nsMig;nsMig=function(){_mg.apply(this,arguments);try{const n=S.n;if(n&&n.staff&&S.agent&&!n.agStartDone){n.agStartDone=true;if(!n.staff.ag)n.staff.ag={t:{pai:1,normal:2,tubarao:3}[S.agent]||1,wk:NS_STAFF_WK}}}catch(e){}}}
// Infância: só o racha na rua (sem a quadra). Ele já ensina as mecânicas novas.
kidPrologue=async function(){S.childhood={pen:0};const can3d=lanceMode()==='jogar'&&!L3D.failed;const n=first();const br=NATS[S.nat]&&NATS[S.nat].n==='Brasil';S.age=10;
 const c1=await kidCard({eb:'Prólogo · A rua',ic:'🩴',title:'10 anos · O racha',log:true,
  txt:`${br?'Rua de paralelepípedo, fim de tarde.':'Fim de tarde na rua de casa.'} ${n} joga descalço e o gol é um par de chinelos: vira com 2, acaba com 4. Aqui você aprende o jogo. A bola chega rolando e você bate de primeira (arraste e solte). No 1 contra 1, arraste pro lado na hora certa pra driblar; ↑↑ é carretilha. E quando alguém grita "CARRO!", todo mundo pra calçada.`,
  ok:can3d?'Jogar o racha ▶':'Ver o racha',alt:can3d?'Só ver o resultado':null});
 const r1=await kidMatch(KID.rua,can3d&&c1!=='alt');const g1=kidGains(KID.rua,r1);
 await kidCard({eb:'Racha na rua',ic:r1.win===true?'🏆':r1.win===false?'🩹':'🍲',title:r1.win===true?'Ganhou o racha':r1.win===false?'Perdeu o racha':'Hora da janta',score:kidScore(KID.rua,r1),
  txt:kidResTxt(KID.rua,r1)+` Quatro anos depois, um olheiro passa pela rua e chama ${n} pra uma peneira de verdade, num campo de grama.`,chips:g1});
 S.age=14;S.childhood.done=1};
// Peneira enxuta: local → circuito com os lances do jogo (tutorial) → olheiros
const PEN_ST_NEW=[
 {k:'finish',scen:'area',ic:'⚡',n:'Bola viva',at:'FIN',how:['O companheiro toca e a bola chega <b>em movimento</b>, em câmera lenta. Ela não para no seu pé.','<b>Arraste pra trás e solte</b> pra bater de primeira. Um <b>toque</b> domina a bola.','A seta mostra direção e força. Mire no canto.'],tip:'Nos jogos, quase toda bola chega assim.'},
 {k:'dribble',scen:'driblar',ic:'🌀',n:'Drible',at:'DRI',how:['Você corre com a bola e os marcadores vêm <b>um de cada vez</b>.','Quando aparecer <b>AGORA</b>, arraste pro lado pra driblar. <b>↑↑</b> (dois toques pra cima) faz a carretilha.','Passou por eles? Chute ou toque pro companheiro.'],tip:'Cedo demais não adianta; tarde demais ele toma a bola.'},
 {k:'pass',scen:'enfiada',passOnly:true,ic:'🎯',n:'Passe',at:'PAS',how:['<b>Arraste a partir da bola</b> e solte: o lado é a direção, o comprimento é a força.','A mira é livre, não gruda em ninguém. Verde = livre, laranja = marcado.','Passe certo rende dinheiro e relação com o elenco.'],tip:'Toque no campo pra correr pro espaço quando a bola estiver com o companheiro.'},
 {k:'header',scen:'escCab',ic:'🗣️',n:'Escanteio',at:'FIS',how:['O companheiro cobra o escanteio e a bola vem <b>voando</b> na sua direção.','Na câmera lenta, <b>arraste e solte</b> pra cabecear pro gol.','Se não bater, a bola passa direto.'],tip:'Cabeçada pra baixo é a mais difícil pro goleiro.'},
 {k:'pen',scen:'penalti',ic:'⚪',n:'Pênalti',at:'FIN',how:['A câmera fica atrás de você, olhando o goleiro.','<b>Puxe pra trás</b> e solte: o lado escolhe o canto, o comprimento é a força.','Depois toque na bola pra dar efeito.'],tip:'Mais forte é mais alto e mais arriscado.'}];
penStations=function(){return S.pos==='GOL'?PEN_ST_GK:PEN_ST_NEW};
penCircuit=async function(){PEN.circ=PEN.circ||[];const sts=penStations();const i=PEN.circ.length;
 if(i>=sts.length){PEN.step=6;renderPeneira();return}
 const rows=sts.map((s,j)=>{const r=PEN.circ[j];return`<div class="pst ${r?(r.ok?'ok':'bad'):j===i?'on':''}"><span class="pst-ic">${r?(r.ok?'✓':'✗'):s.ic}</span><div><b>${esc(s.n)}</b><small>${r?esc(r.txt):j===i?'Próxima':'Aguardando'}</small></div>${r?`<span class="chip ${r.d>=0?'up':'down'}">${r.d>=0?'+':''}${r.d}</span>`:''}</div>`}).join('');
 penShell(`<section class="card" style="display:grid;gap:12px"><div class="row" style="gap:10px;align-items:center"><span class="cc-av sm">${COACH.ic}</span><div><div class="eyebrow">Peneira · circuito de lances</div><b>${COACH.n}</b></div></div>
 <p class="muted" style="margin:0">${i===0?`"Cada estação é um lance que vai acontecer na sua carreira. Os olheiros estão na grade, anotando tudo."`:`"Próxima. ${i===sts.length-1?'É a última, capricha.':'Tá indo bem.'}"`}</p>
 <div class="psts">${rows}</div><button class="btn wide" id="pstGo">${i===0?'Começar':'Próxima estação'}</button></section>`);
 document.getElementById('pstGo').onclick=async()=>{const st=sts[i];await coachCard(st,i,sts.length);
  const sk=clamp((typeof skillOf==='function'?skillOf(st.at):.6)+.12,.3,.95);
  const r=await nssMoment({kind:st.k,scen:st.scen,passOnly:!!st.passOnly,pen:st.k==='pen',comp:'Peneira',title:st.n,skill:sk,keeper:.3,planned:true,defs:2,need:2,speed:.9,okTxt:'Boa!'});
  const d=r.ok?(r.perfect?RI(8,12):RI(5,8)):-RI(1,3);const txt=r.ok?(r.perfect?'Perfeito':'Acertou'):'Errou';
  PEN.circ.push({ok:r.ok,d,txt,at:st.at,perfect:!!r.perfect});penLog(`${st.n}: ${txt.toLowerCase()}`,d);
  toast({ic:COACH.ic,title:COACH.n,txt:(r.ok?COACH_OK:COACH_BAD)[i%4],ms:2600});penCircuit()}};
{const _rpN=renderPeneira;renderPeneira=function(){if(PEN.step===1||PEN.step===2)PEN.step=3;if(PEN.step===4||PEN.step===5)PEN.step=6;return _rpN.apply(this,arguments)}}
{const _ps=penShell;penShell=function(inner){_ps(inner);try{const pr=$app.querySelector('.penprog');if(pr){const st=PEN.step;pr.innerHTML=[['Local',0],['Circuito de lances',3],['Olheiros',6]].map(([t,k])=>`<span class="${st>k?'done':st===k?'on':''}">${t}</span>`).join('')}
  const j=$app.querySelector('.journey .jtip, .journey p');if(j&&PEN.step===0)j.textContent='Escolha onde fazer a peneira. Depois vem o circuito: cada estação ensina um lance do jogo, e os olheiros decidem.'}catch(e){}}}

// ================= MERCADO NEGRO =================
// Anabolizante e cia.: sobem a habilidade na hora, mas deixam rastro. Depois de cada jogo pode cair no antidoping:
// deu positivo, você é preso. O risco cai um pouco por semana.
const NS_BLACK=[
 {id:'anab',ic:'💉',n:'Anabolizante',d:'+4 Força e +2 Velocidade na hora.',p:.025,r:35,sk:{for:4,vel:2}},
 {id:'estim',ic:'💊',n:'Estimulante',d:'Energia volta a 100%.',p:.01,r:18,en:true},
 {id:'epo',ic:'🩸',n:'Doping sanguíneo',d:'+5 Velocidade. O corpo aguenta mais.',p:.04,r:40,sk:{vel:5}},
 {id:'hgh',ic:'🧪',n:'Hormônio do crescimento',d:'+2 em todas as habilidades.',p:.06,r:50,sk:{vel:2,for:2,tec:2,vis:2,bp:2}},
 {id:'mask',ic:'🧼',n:'Mascarador',d:'Esconde o rastro no exame (−40 de risco). Nem sempre funciona.',p:.03,r:-40,mask:true}];
function nsDopeP(){const r=(S.n&&S.n.dopeR)||0;return r>0?Math.min(.6,r/100*.38):0}
function nsBlackPage(){return{t:'Mercado negro',cls:'place',html:()=>{const n=S.n;const P=Math.round(nsDopeP()*100);
 return`<div class="nsx-place-hd" style="--pc:#2d1b4e"><span>🕶️</span><div><b>Mercado negro</b><small>Beco atrás do estádio. Ninguém viu nada.</small></div></div>
 <div class="nsx-note bad">🧫 Antidoping: chance de dar <b>positivo</b> no próximo jogo: <b>${P}%</b>. Positivo = <b>preso</b>, contrato rescindido e as marcas vão embora. O rastro some aos poucos a cada semana.<div class="nsx-risk"><i style="width:${Math.min(100,(n.dopeR||0))}%"></i></div></div>
 <div class="nsx-acts">${NS_BLACK.map(x=>`<button class="nsx-actc warn" data-bk="${x.id}"><span>${x.ic}</span><div><b>${esc(x.n)}</b><small>${esc(x.d)}</small>${x.r>0?`<em>Risco +${x.r}</em>`:''}</div><i>${money(x.p)}</i></button>`).join('')}</div>`},
 bind:B=>B.querySelectorAll('[data-bk]').forEach(b=>b.onclick=async()=>{const x=NS_BLACK.find(y=>y.id===b.dataset.bk);const n=S.n;
  const q=await nsPop({ic:x.ic,title:x.n,txt:`${x.d} ${x.r>0?`O risco no exame sobe ${x.r} pontos.`:''} Custa ${money(x.p)}.`,opts:[['y','Comprar e usar']],ok:'Melhor não'});if(q!=='y')return;
  if(!nsPay(x.p))return;
  if(x.mask){if(ch(.7)){n.dopeR=Math.max(0,(n.dopeR||0)-40);toast({ic:'🧼',title:'Rastro mascarado',txt:'Por enquanto…',ms:2000})}else{n.dopeR=Math.min(100,(n.dopeR||0)+10);toast({ic:'⚠️',title:'Mascarador falsificado',txt:'Não funcionou e ainda deixou mais rastro.',ms:2400})}}
  else{n.dopeR=Math.min(100,(n.dopeR||0)+x.r);if(x.sk)for(const k in x.sk){n.sk[k].l=Math.min(99,n.sk[k].l+x.sk[k])}if(x.en)n.en=100;n.dopeN=(n.dopeN||0)+1;nsSync();toast({ic:x.ic,title:'Fez efeito',txt:x.sk?Object.entries(x.sk).map(([k,v])=>`+${v} ${NSK.find(z=>z[0]===k)[1]}`).join(' · '):'Energia 100%',ms:2200})}
  nsRefresh()})}}
function nsDopeCaught(){const n=S.n;const g=RI(8,14);n.dopeR=0;n.dopeCaught=(n.dopeCaught||0)+1;
 for(const k in n.sk)n.sk[k].l=Math.max(1,n.sk[k].l-2);n.rel.fans=clamp(n.rel.fans-25,0,100);n.rel.coach=clamp(n.rel.coach-20,0,100);n.sps={};
 prisonNow(g);const m=(S.pendingMoments||[]).slice().reverse().find(x=>x.k==='preso');if(m){m.eyebrow='Antidoping';m.big='POSITIVO!';m.title='O exame antidoping deu positivo. A polícia te leva direto do vestiário.';m.lines=[`Preso por ${g} jogos`,'As marcas cancelaram os contratos','Torcida e técnico revoltados']}}
{const _wkD=nsWeek;nsWeek=function(info){const r=_wkD.apply(this,arguments);try{const n=S.n;if(n&&n.dopeR)n.dopeR=Math.max(0,n.dopeR-8)}catch(e){}return r}}
{const _pmD=playMine;playMine=async function(o,io){const L0=(NSSM.post||[]).length;const r=await _pmD.apply(this,arguments);
 try{const n=S.n;const p=(NSSM.post||[])[L0];if(n&&n.dopeR>0&&p&&p.me&&p.me.play&&!(typeof inPrison==='function'&&inPrison())&&ch(nsDopeP()))nsDopeCaught()}catch(e){console.error(e)}return r}}
NS_PLACES.splice(NS_PLACES.findIndex(x=>x[0]==='crime')+1,0,['negro','🕶️','Mercado negro','Anabolizante e cia. · proibido','#2d1b4e',null]);
{const _mvp=nsMaisVidaPage;nsMaisVidaPage=function(){const pg=_mvp();const b0=pg.bind;const h0=pg.html;
 pg.html=()=>h0().replace(/<button class="nsx-pl( off)?" data-pl="negro"([^>]*)><span>🕶️<\/span><b>Mercado negro<\/b><small>[^<]*<\/small>/,(m,o,rest)=>`<button class="nsx-pl${S.age<18?' off':''}" data-pl="negro"${rest}><span>🕶️</span><b>Mercado negro</b><small>${S.age<18?'A partir dos 18 anos':'Anabolizante e cia. · proibido'}</small>`);
 pg.bind=B=>{b0(B);const e=B.querySelector('[data-pl="negro"]');if(e)e.onclick=()=>{if(S.age<18)return toast({ic:'🔞',title:'A partir dos 18 anos',ms:1800});nsPush(nsBlackPage())}};return pg}}

// ================= ARTILHARIA NA TELA PRINCIPAL =================
function nsRace(){const st=S.st;const c=club();if(!st||!c||!st.table||!st.lg||typeof campRace!=='function')return null;const wk=(st.nsWk||0)+'|'+(st.r||0);
 if(st._race&&st._race.k===wk)return st._race.v;let v=null;try{const rows=sortTable(st.table,st.lg);const lgS=(st.stats&&st.stats['Liga'])||{g:0,a:0};if(rows.some(r=>r.j>0)||true)v=campRace(st.lg,rows,c.id,lgS.g||0,lgS.a||0)}catch(e){console.warn(e)}st._race={k:wk,v};return v}
function nsArtCard(){const R=nsRace();if(!R||!R.gl.length)return'';const L=LG[S.st.lg];const top=R.gl[0];const mi=R.gl.findIndex(x=>x.me);const me=R.gl[mi];const tc=CLUB[top.club];
 const lead=top.v===0?'Ninguém marcou ainda':top.me?`Você lidera com ${top.v} gol${top.v===1?'':'s'}!`:`${esc(top.n)}${tc?` (${esc(tc.n)})`:''} · ${top.v} gol${top.v===1?'':'s'}`;
 return`<button class="nsx-art ${top.me&&top.v?'lead':''}" id="nsArtB"><span>⚽</span><div><small>Artilharia · ${esc(L?L.n:'Liga')}</small><b>${lead}</b></div><em>${S.pos==='GOL'?'ver':me?`Você: ${mi+1}º · ${me.v}`:'ver'}</em></button>`}
function nsArtPage(){let tab='gl';return{t:'Artilharia',cls:'art',html:()=>{const R=nsRace();if(!R)return'<p class="muted">A liga ainda não começou.</p>';const L=LG[S.st.lg];const list=tab==='gl'?R.gl:R.as;const mi=list.findIndex(x=>x.me);
  return`<div class="nsx-sh"><b>${tab==='gl'?'⚽ Artilheiros':'🎯 Garçons'} · ${esc(L.n)}</b><small>${tab==='gl'?'Quem mais fez gol na liga até agora.':'Quem mais deu assistência na liga.'} ${mi>=0&&list[0]?(mi===0&&list[0].v?'Você está na frente!':`Faltam ${list[0].v-list[mi].v} pra você alcançar o líder.`):''}</small></div>
  <div class="nstabs n2 nsx-art-t"><button data-at="gl" class="${tab==='gl'?'on':''}">Gols</button><button data-at="as" class="${tab==='as'?'on':''}">Assistências</button></div>
  <div class="nsx-art-l">${(()=>{const u=tab==='gl'?'gols':'assist.';const row=(x,i)=>{const c=CLUB[x.club];return`<div class="cp-rr nsx-rr2 ${x.me?'me':''}"><span class="pos mono">${i+1}º</span>${c?shieldHTML(c):''}<div class="nm"><b>${esc(x.n)}${x.me?' (você)':''}</b><small>${esc(c?c.n:'')}</small></div><span class="v mono">${x.v}<small> ${u}</small></span></div>`};
   const top=list.slice(0,15).map(row).join('');return top+(mi>=15?`<div class="cp-gap">···</div>${row(list[mi],mi)}`:'')||'<p class="muted">Ninguém marcou ainda.</p>'})()}</div>`},
 bind:B=>B.querySelectorAll('[data-at]').forEach(b=>b.onclick=()=>{tab=b.dataset.at;nsRefresh()})}}
{const _ini=nsInicioHTML;nsInicioHTML=function(){const h=_ini();const a=nsArtCard();return a?h.replace(/<\/div>$/,a+'</div>'):h}}
{const _rnA=nsRenderHub;nsRenderHub=function(){const r=_rnA.apply(this,arguments);try{const e=document.getElementById('nsArtB');if(e)e.onclick=()=>nsOpen(nsArtPage())}catch(e){}return r}}

// ================= PRÊMIOS DO ANO: SEMPRE MOSTRA QUEM GANHOU =================
{const _rse=runSeasonEndShow;runSeasonEndShow=async function(ls){const r=await _rse.apply(this,arguments);try{const Y=(ls&&ls.yearWinners||[]).filter(x=>x.w);if(Y.length){const ic={bola:'⚽🏆',gb:'🌟',chut:'👟',luva:'🧤'};
  await campPop({ic:'🏆',eyebrow:`Prêmios de ${S.year}`,title:'Os vencedores do ano',body:`<div class="nsx-yw">${Y.map(x=>{const c=x.w.club&&CLUB[x.w.club];return`<div class="${x.w.me?'me':''}"><span>${ic[x.k]||'🏅'}</span><div><small>${esc(x.n)}</small><b>${x.w.f||''} ${esc(x.w.n)}${x.w.me?' (VOCÊ!)':''}</b>${c?`<em>${esc(c.n)}</em>`:''}</div></div>`}).join('')}</div>`,last:true})}}catch(e){console.warn(e)}return r}}
function nsBolaPage(){return{t:'Bola de Ouro',cls:'bola',html:()=>{const H=((typeof W!=='undefined'&&W.bolaHist)||[]).slice().reverse();
 return`<div class="nsx-place-hd" style="--pc:#a67c00"><span>⚽</span><div><b>Bola de Ouro</b><small>O melhor jogador do mundo, todo ano. ${(S.awards||[]).filter(a=>a.t==='bola').length?`Você já ganhou ${(S.awards||[]).filter(a=>a.t==='bola').length}!`:'Seu nome ainda não está aqui.'}</small></div></div>
 ${H.length?`<div class="nsx-yw">${H.map(x=>{const c=x.club&&CLUB[x.club];return`<div class="${x.me?'me':''}"><span class="mono">${x.y}</span><div><b>${x.f||''} ${esc(x.n)}${x.me?' (VOCÊ!)':''}</b>${c?`<em>${esc(c.n)}</em>`:''}</div></div>`}).join('')}</div>`:'<p class="muted">A primeira cerimônia é no fim desta temporada.</p>'}`}}}
{const _ct2=nsCarreiraTiles;nsCarreiraTiles=function(){const h=_ct2();const H=(typeof W!=='undefined'&&W.bolaHist)||[];const last=H[H.length-1];
 return h.replace(/<\/div>$/,`<button class="nsx-tile" id="nsBolaB"><span>⚽</span><b>Bola de Ouro</b><small>${last?`${last.y}: ${esc(last.n)}`:'Cerimônia no fim do ano'}</small></button><button class="nsx-tile" id="nsArtB2"><span>🥇</span><b>Artilharia</b><small>Gols e assistências da liga</small></button></div>`)}}
{const _rnB=nsRenderHub;nsRenderHub=function(){const r=_rnB.apply(this,arguments);try{const e=document.getElementById('nsBolaB');if(e)e.onclick=()=>nsOpen(nsBolaPage());const a=document.getElementById('nsArtB2');if(a)a.onclick=()=>nsOpen(nsArtPage())}catch(e){}return r}}
{const st=document.createElement('style');st.textContent=`
.nsx-risk{height:10px;border-radius:5px;background:#1a0c0b;overflow:hidden;margin-top:8px}.nsx-risk i{display:block;height:100%;background:linear-gradient(90deg,#ffb347,#ff3b2f)}
.nsx-art{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;width:100%;padding:14px 16px;border-radius:18px;border:1px solid #d6a21e66;text-align:left;color:var(--chalk);background:linear-gradient(110deg,#2c2205,#13261a 70%)}
.nsx-art>span{font-size:34px}.nsx-art small{display:block;font:900 12px var(--f-body);color:#ffd84a;text-transform:uppercase;letter-spacing:.06em}.nsx-art b{display:block;font:900 18px var(--f-display);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nsx-art em{font:900 15px var(--f-mono);font-style:normal;color:#ffd84a;white-space:nowrap}.nsx-art.lead{border-color:#ffd84a;box-shadow:0 0 0 2px #ffd84a55}
.nsx-art-t{display:grid;grid-template-columns:1fr 1fr;margin:8px 0}.nsx-art-t button{min-height:44px;font:900 15px var(--f-body)}
.nsx-art-l{display:grid;gap:4px}.nsx-rr2{padding:10px 12px;background:#10261b;border:1px solid var(--line-2)}.nsx-rr2.me{background:#3a2e08;border-color:#ffd84a}
.nsx-yw{display:grid;gap:8px}.nsx-yw>div{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center;padding:10px 12px;border-radius:14px;background:#10261b;border:1px solid var(--line-2)}
.nsx-yw>div.me{background:#3a2e08;border-color:#ffd84a}.nsx-yw span{font-size:26px;min-width:44px;text-align:center}.nsx-yw span.mono{font-size:15px;font-weight:900;color:#ffd84a}
.nsx-yw small{display:block;font:800 12px var(--f-body);color:#ffd84a;text-transform:uppercase}.nsx-yw b{font:900 17px var(--f-display)}.nsx-yw em{display:block;font:700 12.5px var(--f-body);font-style:normal;color:#a9c6b4}
@media (max-width:560px){.nsx-art{padding:10px 12px}.nsx-art>span{font-size:26px}.nsx-art b{font-size:14px}.nsx-art em{font-size:12px}}
`;document.head.appendChild(st)}

// ================= INÍCIO SEM ROLAGEM =================
// Vai compactando em níveis até tudo caber na tela (nunca some o próximo jogo nem o Fofocagram).
function nsFitHome(){const nsh=document.querySelector('.nsh'),body=document.getElementById('nsBody');if(!nsh||!body)return;
 if(NS_TAB!=='status'){delete nsh.dataset.fit;nsh.classList.remove('nsx-home');return}nsh.classList.add('nsx-home');
 const over=()=>nsh.scrollHeight>nsh.clientHeight+1||body.scrollHeight>body.clientHeight+1;
 for(let l=0;l<=7;l++){nsh.dataset.fit=l;if(!over())return}}
{const _rnF=nsRenderHub;nsRenderHub=function(){const r=_rnF.apply(this,arguments);try{nsFitHome();requestAnimationFrame(nsFitHome);setTimeout(nsFitHome,300)}catch(e){}return r}}
{let t=0;window.addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(()=>{try{if(document.body.classList.contains('nshub'))nsFitHome()}catch(e){}},120)})}
{const st=document.createElement('style');const F=n=>[...Array(8-n)].map((_,i)=>`.nsh[data-fit="${n+i}"]`).join(',');
 const sel=(n,x)=>F(n).split(',').map(a=>a+' '+x).join(',');
 st.textContent=`
.nsh.nsx-home #nsBody{overflow:hidden}
${sel(1,'.nsx')}{gap:8px}
${F(1)}{gap:8px}
${sel(1,'.nsx-fofo.big')}{padding:10px 14px}
${sel(1,'.nsx-fofo .lg')}{font-size:26px}
${sel(1,'.nsx-fofo .av')}{width:40px;height:40px}
${sel(1,'.nsx-st')}{padding:10px;gap:6px}
${sel(1,'.nsx-st b')}{font-size:22px}
${sel(1,'.nsx-act')}{min-height:62px;padding:10px 12px}
${sel(1,'.nsx-act>span')}{font-size:30px}
${sel(1,'.nsx-act b')}{font-size:19px}
${sel(1,'.nsx .nsnext')}{padding:10px;gap:4px}
${sel(1,'.nsx-art')}{padding:9px 12px}
${sel(1,'.nsx-art>span')}{font-size:26px}
${sel(2,'.nsx-st .nsmb')},${sel(2,'.nsx-act small')},${sel(2,'.nsx .nsnext .wk')}{display:none}
${sel(2,'.nsx-fofo.big')}{flex-direction:row;align-items:center}
${sel(2,'.nsx-fofo .tx small')}{display:none}
${sel(2,'.nsx-act')}{min-height:52px}
${sel(3,'.nsx-3')}{display:none}
${sel(4,'.nsweek')}{display:none}
${sel(5,'.nsx-fofo .lg')}{font-size:21px}
${sel(5,'.nsx-fofo.big')}{padding:7px 12px}
${sel(5,'.nsx-fofo .av')}{width:32px;height:32px;border-width:2px}
${sel(5,'.nsx-act')}{min-height:44px;padding:6px 10px}
${sel(5,'.nsx-act>span')}{font-size:22px}
${sel(5,'.nsx-act b')}{font-size:16px}
${sel(5,'.nsx .nsnext .tm b')}{font-size:15px}
${sel(6,'.nsx-art small')}{display:none}
${sel(6,'.nsx-art')}{padding:6px 10px}
${sel(7,'.nsx-art')}{display:none}
${sel(7,'.nsx-2')}{display:none}
`;document.head.appendChild(st)}
