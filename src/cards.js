// ================== CARTAS, ROSTOS, DRAFT NOVO, APOSENTADORIA, ESTÁTUA ==================
// ---------- rostos (presets) ----------
const FACES=[
 {n:'Cacheado',skin:'#6b4226',hair:'#120c08',style:'afro'},
 {n:'Barbudo',skin:'#b07a50',hair:'#1a120c',style:'buzz',beard:true},
 {n:'Topete',skin:'#f0c9a4',hair:'#d6a640',style:'quiff'},
 {n:'Cabeludo',skin:'#8d5a3b',hair:'#2a1a10',style:'long',band:true},
];
function faceSVG(face,shirt,shirt2,opt={}){
 if(face&&face.photo)return`<img class="facephoto ${opt.bronze?'bronze':''}" src="${face.photo}" alt="">`;
 const F=FACES[(face&&face.preset)||0]||FACES[0];const sk=opt.bronze?'url(#brz)':F.skin,hr=opt.bronze?'#5a3a1a':F.hair,sh=opt.bronze?'url(#brz)':(shirt||'#c8102e'),sh2=opt.bronze?'#7a5228':(shirt2||'#fff');
 const hair={afro:`<path d="M58 62c-6-26 14-44 42-44s48 18 42 44c-4-8-10-12-16-14-8-10-44-10-52 0-6 2-12 6-16 14z" fill="${hr}"/><circle cx="62" cy="48" r="12" fill="${hr}"/><circle cx="138" cy="48" r="12" fill="${hr}"/><circle cx="100" cy="26" r="16" fill="${hr}"/>`,
  buzz:`<path d="M64 60c0-24 16-38 36-38s36 14 36 38c-6-10-18-16-36-16s-30 6-36 16z" fill="${hr}" opacity=".9"/>`,
  quiff:`<path d="M62 62c-2-28 18-44 40-44 24 0 40 12 38 36-4-6-10-8-14-8 2-8-6-16-18-16-14 0-30 8-46 32z" fill="${hr}"/><path d="M86 22c10-10 34-10 46 4-14-4-30-2-46-4z" fill="${hr}"/>`,
  long:`<path d="M60 64c-4-30 16-46 40-46s44 16 40 46l2 40c-6-6-10-18-10-30-6-12-58-12-64 0 0 12-4 24-10 30z" fill="${hr}"/>`}[F.style];
 const beard=F.beard?`<path d="M72 92c4 24 16 32 28 32s24-8 28-32c-6 8-14 10-28 10s-22-2-28-10z" fill="${hr}" opacity=".85"/>`:'';
 const band=F.band?`<rect x="64" y="50" width="72" height="8" rx="4" fill="${opt.bronze?'#7a5228':'#fff'}" opacity=".9"/>`:'';
 return`<svg class="facesvg" viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="brz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9a066"/><stop offset=".5" stop-color="#8a5a2b"/><stop offset="1" stop-color="#4a2e14"/></linearGradient></defs>
 <path d="M26 200c4-40 30-58 74-58s70 18 74 58z" fill="${sh}"/><path d="M84 142l16 16 16-16" fill="none" stroke="${sh2}" stroke-width="6"/>
 <rect x="88" y="112" width="24" height="32" rx="8" fill="${sk}"/>
 <ellipse cx="100" cy="76" rx="38" ry="46" fill="${sk}"/><ellipse cx="62" cy="80" rx="7" ry="11" fill="${sk}"/><ellipse cx="138" cy="80" rx="7" ry="11" fill="${sk}"/>
 ${hair}${band}
 <path d="M80 70q8-5 15 0M105 70q8-5 15 0" stroke="${opt.bronze?'#3a2410':'#1a120c'}" stroke-width="3" fill="none" stroke-linecap="round"/>
 <circle cx="88" cy="80" r="3.5" fill="${opt.bronze?'#3a2410':'#1a120c'}"/><circle cx="112" cy="80" r="3.5" fill="${opt.bronze?'#3a2410':'#1a120c'}"/>
 <path d="M100 84q-4 12 2 14" stroke="${opt.bronze?'#3a2410':'rgba(0,0,0,.35)'}" stroke-width="2.5" fill="none"/>
 <path d="M88 104q12 9 24 0" stroke="${opt.bronze?'#3a2410':'#5a2a1a'}" stroke-width="3" fill="none" stroke-linecap="round"/>${beard}</svg>`;
}
// ---------- carta estilo FUT ----------
function cardTier(ovr,special){if(special)return special;return ovr>=86?'gold rare':ovr>=75?'gold':ovr>=65?'silver':'bronze'}
const STAT6=[['VEL','RIT'],['FIN','FIN'],['PAS','PAS'],['DRI','DRI'],['DEF','DEF'],['FIS','FÍS']];
const STAT6GK=[['REF','REF'],['MEN','POS'],['PAS','PAS'],['VEL','VEL'],['DEF','DEF'],['FIS','FÍS']];
function playerCard(o){
 const A=o.attrs||{};const st=o.pos==='GOL'?STAT6GK:STAT6;const c=o.club?CLUB[o.club]:null;
 return`<div class="fut2 ${o.tier||cardTier(o.ovr)} ${o.size||''}">
  <div class="f2-bg"></div><div class="f2-shine"></div>
  <div class="f2-l"><b>${o.ovr}</b><span>${esc(o.pos)}</span><i>${o.flag||''}</i>${c?`<div class="f2-club">${shieldHTML(c,'sm')}</div>`:''}</div>
  <div class="f2-face">${faceSVG(o.face,c&&c.c1,c&&c.c2)}</div>
  <div class="f2-name">${esc(o.name)}</div>
  <div class="f2-stats">${st.map(([k,l])=>`<div><b>${A[k]??'—'}</b><span>${l}</span></div>`).join('')}</div>
  ${o.label?`<div class="f2-lbl">${esc(o.label)}</div>`:''}
 </div>`;
}
function myCard(extra={}){return playerCard({ovr:S.ovr,pos:S.pos,name:S.name,flag:NATS[S.nat].f,club:S.club,attrs:typeof effAttrs==='function'?effAttrs():CA(),face:S.face,...extra})}

// ---------- draft: jogadores reais 80+ da posição ----------
function starVals(pos,r,seed){const rr=seeded(hash(seed));const w=POS[pos].w;const o={};
 for(const k of ATTRS){let v;if(pos==='GOL')v=k==='REF'?r+4:w[k]?r-6+w[k]*20:r-30;else v=k==='REF'?12+rr()*14:w[k]?r-4+w[k]*24:r-22;o[k]=Math.round(clamp(v+(rr()-.5)*8,25,97))}return o}
let DRAFT_POOL=null;
function buildDraftPool(){
 const icons=LEGENDS.map(L=>({n:L[0],f:L[1],pos:L[2],ovr:L[3],vals:Object.fromEntries(ATTRS.map((k,j)=>[k,L[4][j]])),icon:true}));
 const stars=STAR_SRC.split(';').map(x=>x.trim()).filter(Boolean).map(r=>{const[n,club,pos,nat,born,rt]=r.split('|');return{n,club,pos:POS_ALIAS[pos]||pos,f:FLAG[nat]||'🏳️',ovr:+rt}}).filter(s=>s.ovr>=80&&POS[s.pos]).map(s=>({...s,vals:starVals(s.pos,s.ovr,s.n)}));
 DRAFT_POOL=icons.concat(stars);
}
function drawLegend(){
 if(!DRAFT_POOL)buildDraftPool();
 if(!DR.pool||DR.poolPos!==CR.pos){DR.poolPos=CR.pos;DR.pool=DRAFT_POOL.map((_,i)=>i).filter(i=>{const p=DRAFT_POOL[i].pos;return p===CR.pos||NEIGH[CR.pos].includes(p)||(CR.pos==='GOL'?false:false)})}
 let bag=DR.pool.filter(i=>!(DR.used||[]).includes(i));if(bag.length<3)bag=DR.pool.slice();
 const i=wpick(bag,j=>DRAFT_POOL[j].pos===CR.pos?3:1);DR.used=(DR.used||[]).concat(i);
 const L=DRAFT_POOL[i];const pen=CR.diff==='lenda'?-3:CR.diff==='amador'?1:0;
 DR.leg={n:L.n,f:L.f,pos:L.pos,ovr:L.ovr,icon:L.icon,club:L.club,vals:Object.fromEntries(ATTRS.map(k=>[k,clamp(L.vals[k]+RI(-2,1)+pen,10,99)]))};
}
const _startDraftC=startDraft;
startDraft=function(){DR.used=[];DR.pool=null;_startDraftC()};
const _renderDraftC=renderDraft;
renderDraft=function(){_renderDraftC();const L=DR.leg;const e=$app.querySelector('.legend .eyebrow');if(e)e.textContent=`${L.f} ${POS[L.pos].n} · ${L.icon?'Ícone FC 27':(L.club||'Carta')} · ${L.ovr}`;const h=$app.querySelector('.legend h3');if(h&&!L.icon)h.insertAdjacentHTML('beforeend',' <span class="chip gold" style="vertical-align:6px">Carta '+L.ovr+'</span>')};

// ---------- sem teto de overall ----------
// treino forte empurra o potencial pra cima
const _weeklyTrainingC=weeklyTraining;
weeklyTraining=async function(k){
 const before=S.ovr;const r=await _weeklyTrainingC(k);
 if(S.ovr>=S.pot){S.pot=Math.min(99,S.ovr+1);r.chips.push(['↑ Teto subiu','gold'])}
 else if(r.hits>=3&&ch(.22)){S.pot=Math.min(99,S.pot+1);r.chips.push(['↑ Potencial +1','gold'])}
 return r;
};

// ---------- rosto na criação ----------
const _renderCreateC=renderCreate;
renderCreate=function(){
 _renderCreateC();
 const first=$app.querySelector('.card.step');if(!first)return;
 CR.face=CR.face||{preset:0};
 const box=document.createElement('section');box.className='card step';box.style.cssText='display:grid;gap:10px';
 box.innerHTML=`<div class="stepttl"><b>★</b>Seu rosto na carta<span>escolha um ou use sua foto</span></div>
 <div class="facepick">${FACES.map((f,i)=>`<button class="fp ${!CR.face.photo&&CR.face.preset===i?'on':''}" data-face="${i}">${faceSVG({preset:i},'#c8102e','#fff')}<small>${f.n}</small></button>`).join('')}
 <label class="fp ${CR.face.photo?'on':''}">${CR.face.photo?`<img class="facephoto" src="${CR.face.photo}">`:'<span class="fpplus">📷</span>'}<small>Sua foto</small><input type="file" accept="image/*" id="facefile" hidden></label></div>`;
 first.after(box);
 box.querySelectorAll('[data-face]').forEach(b=>b.onclick=()=>{CR.face={preset:+b.dataset.face};renderCreate()});
 document.getElementById('facefile').onchange=e=>{const f=e.target.files[0];if(!f)return;const img=new Image();img.onload=()=>{const c=document.createElement('canvas');const s=Math.min(img.width,img.height);c.width=c.height=220;c.getContext('2d').drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,220,220);CR.face={photo:c.toDataURL('image/jpeg',.82)};renderCreate()};img.src=URL.createObjectURL(f)};
};
const _finishDraftC=finishDraft;
finishDraft=function(){_finishDraftC();if(S)S.face=CR.face||{preset:0}};

// carta na abertura da peneira
const _penWelcomeC=penWelcome;
penWelcome=function(){const p=_penWelcomeC();setTimeout(()=>{const c=$ov.querySelector('.pcardw');if(c)c.outerHTML=`<div class="penfut">${myCard({label:'Peneira'})}</div>`},0);return p};

// carta no painel do jogador
const _openHubPanelC=openHubPanel;
openHubPanel=function(k){_openHubPanelC(k);if(k==='jogador'){const b=document.getElementById('ppB');if(b)b.insertAdjacentHTML('afterbegin',`<div class="cardstage">${myCard()}<button class="btn ghost small" id="chFace">Trocar rosto</button></div>`);const cf=document.getElementById('chFace');if(cf)cf.onclick=()=>faceChooser(()=>openHubPanel('jogador'))}};
function faceChooser(done){
 $ov.hidden=false;$ov.innerHTML=`<div class="ovwrap"><h2 class="pkh">Seu rosto</h2><div class="facepick" style="margin-top:12px">${FACES.map((f,i)=>`<button class="fp ${!(S.face&&S.face.photo)&&(S.face||{}).preset===i?'on':''}" data-face="${i}">${faceSVG({preset:i},club()&&club().c1,club()&&club().c2)}<small>${f.n}</small></button>`).join('')}<label class="fp"><span class="fpplus">📷</span><small>Sua foto</small><input type="file" accept="image/*" id="facefile2" hidden></label></div><button class="btn wide ghost" id="fcX" style="margin-top:12px">Fechar</button></div>`;
 const close=()=>{$ov.hidden=true;$ov.innerHTML='';saveNow('season');done&&done()};
 $ov.querySelectorAll('[data-face]').forEach(b=>b.onclick=()=>{S.face={preset:+b.dataset.face};close()});
 document.getElementById('fcX').onclick=close;
 document.getElementById('facefile2').onchange=e=>{const f=e.target.files[0];if(!f)return;const img=new Image();img.onload=()=>{const c=document.createElement('canvas');const s=Math.min(img.width,img.height);c.width=c.height=220;c.getContext('2d').drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,220,220);S.face={photo:c.toDataURL('image/jpeg',.82)};close()};img.src=URL.createObjectURL(f)};
}

// ---------- aposentadoria: carta especial + animação por tipo de carreira ----------
function retireKind(t){return t>=9?{k:'goat',lbl:'ÍCONE',sub:'Lenda eterna'}:t>=6?{k:'star',lbl:'LENDA',sub:'Craque de época'}:t>=3?{k:'pro',lbl:'CARREIRA',sub:'Bom de bola'}:{k:'humble',lbl:'FIM DE JOGO',sub:'Valeu a tentativa'}}
function retireShow(card){
 return new Promise(async res=>{
  const R=retireKind(card.tier);const topClub=(card.clubs||[]).slice().sort((a,b)=>(b.games||0)-(a.games||0))[0];
  const show=html=>{$ov.hidden=false;$ov.innerHTML=`<div class="ovwrap retire ${R.k}">${html}</div>`};
  show(`<div class="rt-dark"><div class="whistle" style="font-size:clamp(30px,9vw,46px)">FIM DE CARREIRA</div><div class="cname" style="margin-top:10px">${esc(card.name)} pendurou as chuteiras</div></div>`);
  await sleep(reduced?200:1500);
  if(R.k==='star'||R.k==='goat'){
   for(const [ic,t] of [[card.flag,'Nacionalidade'],[card.pos,'Posição'],[topClub?shieldHTML({...CLUB[topClub.id]||topClub,id:topClub.id},'lg'):'⚽','Clube da vida']]){
    show(`<div class="rt-walk ${R.k}"><div class="rt-beam"></div><div class="rt-reveal">${ic}</div><div class="eyebrow" style="position:relative">${t}</div></div>`);await sleep(reduced?150:1000)}
  }
  const tierCls=R.k==='goat'?'icon':R.k==='star'?'gold rare':R.k==='pro'?'gold':'bronze';
  show(`${R.k!=='humble'?'<div class="rays"></div>':''}${R.k==='goat'?'<div class="bolt"><i></i><i></i></div>':''}
  <div class="eyebrow" style="position:relative">${R.sub}</div>
  <div class="rt-card">${playerCard({ovr:card.peak,pos:card.pos,name:card.name,flag:card.flag,club:topClub&&topClub.id,attrs:S&&S.attrs?CA():{},face:S&&S.face,tier:tierCls,label:R.lbl,size:'big'})}</div>
  <h2 class="champ" style="font-size:30px">${esc(TIERS[card.tier][1])}</h2><div class="cname">"${esc(card.nick)}" · ${card.pts} pts de legado</div>
  <div class="chipsrow" style="justify-content:center;margin:10px 0"><span class="chip">${card.tot.games} jogos</span><span class="chip">${card.pos==='GOL'?card.tot.cs+' sem sofrer':card.tot.goals+' gols'}</span><span class="chip gold">${card.nTitles} títulos</span>${card.bolas?`<span class="chip gold">${card.bolas}× Bola de Ouro</span>`:''}</div>
  <button class="btn wide" id="celOk">Ver o legado completo</button>`);
  if(R.k!=='humble')confetti($ov,R.k==='goat'?['#ffffff','#f2c443','#c9a0ff']:['#f2c443','#ff7a2b','#ffffff'],R.k==='goat'?7000:R.k==='star'?5000:2500);
  document.getElementById('celOk').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res()};
 });
}
const _renderEndC=renderEnd;
renderEnd=function(fromLoad){
 if(fromLoad)return _renderEndC(fromLoad);
 S.done=true;const card=cardData();retireShow(card).then(()=>_renderEndC(false));
};
// carta no card final
const _renderCardC=renderCard;
renderCard=function(k,opt={}){_renderCardC(k,opt);const old=$app.querySelector('.fut');if(old){const R=retireKind(k.tier);const top=(k.clubs||[]).slice().sort((a,b)=>(b.games||0)-(a.games||0))[0];old.outerHTML=`<div class="rt-card inpage">${playerCard({ovr:k.peak,pos:k.pos,name:k.name,flag:k.flag,club:top&&top.id,attrs:opt.own&&S?CA():(k.attrs||{}),face:opt.own&&S?S.face:k.face,tier:R.k==='goat'?'icon':R.k==='star'?'gold rare':R.k==='pro'?'gold':'bronze',label:R.lbl,size:'big'})}</div>`}};
const _cardDataC=cardData;
cardData=function(){const d=_cardDataC();d.face=S.face&&S.face.photo?{preset:0}:S.face;d.attrs=CA();return d};

// ---------- estátua ----------
function statueUI(clubId){
 return new Promise(res=>{const c=CLUB[clubId];
  $ov.hidden=false;$ov.innerHTML=`<div class="ovwrap statue"><div class="st-sky"></div><div class="spot"></div>
  <div class="eyebrow" style="position:relative">Homenagem eterna</div>
  <div class="st-stage"><div class="st-fig">${faceSVG(S.face,null,null,{bronze:true})}</div><div class="st-ped"><span>${esc(S.name.toUpperCase())}</span><small>${esc(c?c.n:'')}</small></div></div>
  <h2 class="champ" style="font-size:38px">ESTÁTUA!</h2><div class="cname">O ${esc(c?c.n:'clube')} ergueu sua estátua na porta do estádio</div>
  <div class="row" style="justify-content:center;margin:10px 0">${c?shieldHTML(c,'lg'):''}</div>
  <button class="btn wide" id="celOk">Continuar</button></div>`;
  confetti($ov,['#d9a066','#f2c443','#ffffff'],4500);
  document.getElementById('celOk').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res()};
 });
}
const _runSeasonEndShowC=runSeasonEndShow;
runSeasonEndShow=async function(ls){await _runSeasonEndShowC(ls);for(const n of ls.news||[]){if(n.t==='estatua')await statueUI(n.club);else if(n.t==='idolo'&&typeof momentUI==='function')await momentUI({k:'idolo',emoji:'🙌',eyebrow:'A torcida canta seu nome',big:'ÍDOLO!',title:n.txt,lines:[]})}};
