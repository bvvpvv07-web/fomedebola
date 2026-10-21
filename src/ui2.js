// ================== TELA INICIAL NOVA + CRIAÇÃO EM ETAPAS + ROSTOS MONTÁVEIS + SEM BARRAS DE ROLAGEM ==================

// ---------- rostos montáveis ----------
const FX_SKINS=['#f6d7bd','#f0c9a4','#e3b088','#c99368','#b07a50','#8d5a3b','#6b4226','#4a2c18'];
const FX_HAIRC=['#120c08','#2a1a10','#5a3a1e','#8a5a2b','#d6a640','#efd98f','#b0472a','#d8d8d8'];
const FX_STY=[['buzz','Raspado'],['lateral','Social'],['quiff','Topete'],['afro','Black'],['cacheado','Cacheado'],['long','Cabeludo'],['dreads','Dreads'],['moicano','Moicano'],['coque','Coque'],['bald','Careca']];
const FX_BEARD=[['','Sem barba'],['barba','Barba cheia'],['cavanhaque','Cavanhaque'],['bigode','Bigode'],['rala','Barba rala']];
const FX_ACC=[['','Nada'],['faixa','Faixa'],['brinco','Brinco'],['ambos','Faixa + brinco']];
const FX_VSTY={bald:'bald',moicano:'quiff',dreads:'long',coque:'buzz',cacheado:'afro',lateral:'buzz'};
function faceLook(face){
 if(face&&face.custom){const c=face.custom;return{skin:c.skin,hair:c.hairC,style:c.style,beard:c.beard||'',band:c.acc==='faixa'||c.acc==='ambos',ear:c.acc==='brinco'||c.acc==='ambos',vstyle:FX_VSTY[c.style]||c.style}}
 const F=FACES[(face&&face.preset)||0]||FACES[0];return{skin:F.skin,hair:F.hair,style:F.style,beard:F.beard?'barba':'',band:!!F.band,ear:false,vstyle:F.style}}
faceSVG=function(face,shirt,shirt2,opt={}){
 if(face&&face.photo)return`<img class="facephoto ${opt.bronze?'bronze':''}" src="${face.photo}" alt="">`;
 const L=faceLook(face);const B=opt.bronze;const sk=B?'url(#brz)':L.skin,hr=B?'#5a3a1a':L.hair,sh=B?'url(#brz)':(shirt||'#c8102e'),sh2=B?'#7a5228':(shirt2||'#fff');const ink=B?'#3a2410':'#1a120c';
 const H={
  buzz:`<path d="M64 60c0-24 16-38 36-38s36 14 36 38c-6-10-18-16-36-16s-30 6-36 16z" fill="${hr}" opacity=".9"/>`,
  lateral:`<path d="M62 64c-2-28 16-42 38-42s40 14 38 42c-4-10-8-14-12-16 0-6-6-10-14-10-14 0-28 4-38 12-6 4-10 8-12 14z" fill="${hr}"/><path d="M70 40q16-10 40-6" stroke="${B?'#7a5228':'rgba(255,255,255,.25)'}" stroke-width="2" fill="none"/>`,
  quiff:`<path d="M62 62c-2-28 18-44 40-44 24 0 40 12 38 36-4-6-10-8-14-8 2-8-6-16-18-16-14 0-30 8-46 32z" fill="${hr}"/><path d="M86 22c10-10 34-10 46 4-14-4-30-2-46-4z" fill="${hr}"/>`,
  afro:`<path d="M58 62c-6-26 14-44 42-44s48 18 42 44c-4-8-10-12-16-14-8-10-44-10-52 0-6 2-12 6-16 14z" fill="${hr}"/><circle cx="62" cy="48" r="12" fill="${hr}"/><circle cx="138" cy="48" r="12" fill="${hr}"/><circle cx="100" cy="26" r="16" fill="${hr}"/>`,
  cacheado:`<g fill="${hr}"><circle cx="70" cy="46" r="11"/><circle cx="86" cy="34" r="12"/><circle cx="104" cy="30" r="12"/><circle cx="121" cy="36" r="12"/><circle cx="133" cy="50" r="10"/><circle cx="66" cy="60" r="8"/><circle cx="136" cy="62" r="8"/><path d="M64 62c4-14 18-22 36-22s32 8 36 22c-10-8-22-10-36-10s-26 2-36 10z"/></g>`,
  long:`<path d="M60 64c-4-30 16-46 40-46s44 16 40 46l2 40c-6-6-10-18-10-30-6-12-58-12-64 0 0 12-4 24-10 30z" fill="${hr}"/>`,
  dreads:`<path d="M62 62c-2-26 16-40 38-40s40 14 38 40c-8-8-20-12-38-12s-30 4-38 12z" fill="${hr}"/><g stroke="${hr}" stroke-width="7" stroke-linecap="round"><path d="M64 62v44"/><path d="M74 56v54"/><path d="M126 56v54"/><path d="M136 62v44"/><path d="M84 52v22"/><path d="M116 52v22"/></g>`,
  moicano:`<path d="M88 20c4-6 20-6 24 0l4 32c-8-4-24-4-32 0z" fill="${hr}"/><path d="M66 62c2-14 10-22 20-26M134 62c-2-14-10-22-20-26" stroke="${hr}" stroke-width="3" opacity=".35" fill="none"/>`,
  coque:`<path d="M64 60c0-24 16-38 36-38s36 14 36 38c-6-10-18-16-36-16s-30 6-36 16z" fill="${hr}"/><circle cx="100" cy="18" r="12" fill="${hr}"/><rect x="92" y="26" width="16" height="5" rx="2" fill="${B?'#7a5228':'#222'}"/>`,
  bald:`<path d="M74 40q14-10 30-8" stroke="rgba(255,255,255,.35)" stroke-width="4" fill="none" stroke-linecap="round"/>`};
 const BR={barba:`<path d="M66 84c2 30 18 42 34 42s32-12 34-42c-4 10-10 16-18 18-6-6-26-6-32 0-8-2-14-8-18-18z" fill="${hr}" opacity=".9"/>`,
  cavanhaque:`<path d="M88 104q12 6 24 0l-2 14q-10 8-20 0z" fill="${hr}" opacity=".9"/><path d="M86 98q14-6 28 0" stroke="${hr}" stroke-width="4" fill="none"/>`,
  bigode:`<path d="M84 97q8-6 16-1 8-5 16 1-8 3-16 1-8 2-16-1z" fill="${hr}"/>`,
  rala:`<path d="M68 86c4 26 16 38 32 38s28-12 32-38" stroke="${hr}" stroke-width="10" fill="none" opacity=".35"/>`}[L.beard]||'';
 const band=L.band?`<rect x="62" y="50" width="76" height="8" rx="4" fill="${B?'#7a5228':'#fff'}" opacity=".95"/>`:'';
 const ear=L.ear?`<circle cx="62" cy="94" r="3.4" fill="${B?'#7a5228':'#ffd34a'}"/>`:'';
 return`<svg class="facesvg" viewBox="0 0 200 200" aria-hidden="true"><defs><linearGradient id="brz" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9a066"/><stop offset=".5" stop-color="#8a5a2b"/><stop offset="1" stop-color="#4a2e14"/></linearGradient></defs>
 <path d="M26 200c4-40 30-58 74-58s70 18 74 58z" fill="${sh}"/><path d="M84 142l16 16 16-16" fill="none" stroke="${sh2}" stroke-width="6"/>
 <rect x="88" y="112" width="24" height="32" rx="8" fill="${sk}"/>
 <ellipse cx="100" cy="76" rx="38" ry="46" fill="${sk}"/><ellipse cx="62" cy="80" rx="7" ry="11" fill="${sk}"/><ellipse cx="138" cy="80" rx="7" ry="11" fill="${sk}"/>
 ${H[L.style]||H.buzz}${band}${ear}
 <path d="M80 70q8-5 15 0M105 70q8-5 15 0" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>
 <circle cx="88" cy="80" r="3.5" fill="${ink}"/><circle cx="112" cy="80" r="3.5" fill="${ink}"/>
 <path d="M100 84q-4 12 2 14" stroke="${B?ink:'rgba(0,0,0,.35)'}" stroke-width="2.5" fill="none"/>
 <path d="M88 106q12 8 24 0" stroke="${B?ink:'#5a2a1a'}" stroke-width="3" fill="none" stroke-linecap="round"/>${BR}</svg>`};

// ---------- camisa (costas) com nome e número ----------
const NAT_KIT={BRA:['#ffd21f','#0a8a3a'],ARG:['#8cc4ea','#ffffff'],URU:['#5aa9e6','#ffffff'],COL:['#ffd21f','#1d3f9e'],FRA:['#1d3f9e','#ffffff'],ESP:['#c8102e','#ffd21f'],ENG:['#ffffff','#1d2b6e'],POR:['#c8102e','#0a7a3a'],GER:['#ffffff','#151515'],NED:['#ff7a1a','#ffffff'],ITA:['#1f5fbf','#ffffff'],BEL:['#c8102e','#151515'],CRO:['#ffffff','#c8102e'],MAR:['#c8102e','#0a7a3a'],SEN:['#ffffff','#0a8a3a'],NGA:['#0a8a3a','#ffffff'],JPN:['#1d3f9e','#ffffff'],KOR:['#c8102e','#151515'],USA:['#ffffff','#1d2b6e'],MEX:['#0a7a3a','#ffffff']};
function crKit(){const c=CR.heart&&CLUB[CR.heart];if(c)return[c.c1||'#ff7a2b',c.c2||'#fff'];return NAT_KIT[CR.nat]||['#ff7a2b','#ffffff']}
function jerseySVG(c1,c2,name,num,cls=''){const nm=(name||'').trim().split(/\s+/).slice(-1)[0].toUpperCase().slice(0,12)||'SEU NOME';const n=String(num||'');const ink=typeof pickInk==='function'?pickInk(c1):c2;
 const light=(()=>{const h=(c1||'#555').replace('#','');const v=parseInt(h.length===3?h.split('').map(x=>x+x).join(''):h,16);return((v>>16&255)*.3+(v>>8&255)*.59+(v&255)*.11)>165})();const txt=light?(c2&&c2.toLowerCase()!=='#ffffff'?c2:'#151515'):(c2||'#fff');
 return`<svg class="jersey2 ${cls}" viewBox="0 0 240 250" aria-label="Camisa ${esc(nm)} ${esc(n)}"><defs><linearGradient id="jsh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient></defs>
 <path d="M74 16l46 12 46-12 56 30-20 50-26-12v164H64V84L38 96 18 46z" fill="${c1}" stroke="rgba(0,0,0,.35)" stroke-width="3" stroke-linejoin="round"/>
 <path d="M18 46l20 50 26-12" fill="none" stroke="${c2}" stroke-width="5" opacity=".9"/><path d="M222 46l-20 50-26-12" fill="none" stroke="${c2}" stroke-width="5" opacity=".9"/>
 <path d="M96 22q24 14 48 0" fill="none" stroke="${c2}" stroke-width="6"/>
 <path d="M74 16l46 12 46-12 56 30-20 50-26-12v164H64V84L38 96 18 46z" fill="url(#jsh)"/>
 <text x="120" y="76" text-anchor="middle" font-family="Saira Condensed,Arial Narrow,sans-serif" font-weight="800" font-size="${nm.length>8?20:24}" letter-spacing="2" fill="${txt}">${esc(nm)}</text>
 <text x="120" y="190" text-anchor="middle" font-family="Saira Condensed,Arial Narrow,sans-serif" font-weight="900" font-size="${n.length>1?104:116}" fill="${txt}" stroke="${light?'rgba(0,0,0,.15)':'rgba(0,0,0,.35)'}" stroke-width="3" paint-order="stroke">${esc(n)}</text></svg>`}

// ---------- CRIAÇÃO EM ETAPAS (uma tela pra cada coisa, sem rolagem) ----------
const CW_STEPS=[['nome','Como vão te chamar?'],['numero','Qual é a sua camisa?'],['pais','De onde você é?'],['rosto','Monte seu rosto'],['time','Time do coração'],['posicao','Onde você joga?'],['dificuldade','Qual o desafio?'],['ritmo','Como você quer jogar?']];
let CWI=0,CWDIR=1,CWTAB='pele';
const NUM_TXT={1:'Camisa de goleiro raiz.',2:'Lateral que apoia.',3:'Zagueiro xerife.',4:'Zagueiro de respeito.',5:'Volante cão de guarda.',6:'Lateral de pé bom.',7:'Ponta que dribla todo mundo.',8:'Meia de muito fôlego.',9:'Centroavante: vive de gol.',10:'A camisa do craque. Pesa.',11:'Ponta veloz.',12:'Camisa da torcida.',13:'Pra quem não tem medo de azar.',14:'Camisa de lenda holandesa.',17:'Moderno e decisivo.',19:'Garoto prodígio.',20:'Camisa de quem chega pra jogar.',21:'Craque de seleção.',22:'Camisa de reserva que vira titular.',23:'Camisa de astro.',30:'Começo humilde.',77:'Diferentão.',99:'Ousado.'};
renderCreate=function(){
 CR.face=CR.face||{custom:{skin:FX_SKINS[3],hairC:FX_HAIRC[0],style:'buzz',beard:'',acc:''}};if(CR.face.preset!=null&&!CR.face.custom&&!CR.face.photo){const L=faceLook(CR.face);CR.face={custom:{skin:L.skin,hairC:L.hair,style:L.style,beard:L.beard,acc:L.band?'faixa':''}}}
 CR.num=CR.num||9;document.body.classList.add('cwmode','noscroll');
 const[k,title]=CW_STEPS[CWI];const kit=crKit();let body='';
 if(k==='nome'){const sug=[0,1,2].map(()=>{try{return fakeName()}catch(e){return'Davi Rocha'}});
  body=`<div class="cw-jer pop">${jerseySVG(kit[0],kit[1],CR.name,CR.num)}</div>
  <input class="input cw-in" id="cwNm" maxlength="18" placeholder="Seu nome de jogador" value="${esc(CR.name)}" autocomplete="off">
  <div class="cw-chips"><span class="muted">Sem ideia?</span>${sug.map(n=>`<button class="cw-chip" data-sug="${esc(n)}">${esc(n)}</button>`).join('')}</div>`}
 if(k==='numero'){const quick=[1,2,3,4,5,7,8,9,10,11,17,19,20,21,23,99];
  body=`<div class="cw-jer big pop">${jerseySVG(kit[0],kit[1],CR.name,CR.num)}</div>
  <div class="cw-num"><button class="cw-pm" id="cwM">−</button><b class="mono" id="cwNv">${CR.num}</b><button class="cw-pm" id="cwP">+</button></div>
  <div class="cw-flavor">${esc(NUM_TXT[CR.num]||'Esse número vai virar seu.')}</div>
  <div class="cw-grid n8">${quick.map(n=>`<button class="cw-nb ${CR.num===n?'on':''}" data-n="${n}">${n}</button>`).join('')}</div>`}
 if(k==='pais'){body=`<div class="cw-big">${NATS[CR.nat].f}<small>${esc(NATS[CR.nat].n)}</small></div><div class="cw-grid n5">${Object.entries(NATS).map(([c,v])=>`<button class="cw-flag ${CR.nat===c?'on':''}" data-nat="${c}"><span>${v.f}</span><small>${esc(v.n)}</small></button>`).join('')}</div>`}
 if(k==='rosto'){const C=CR.face.custom||{};const tabs=[['pele','Pele'],['cabelo','Cabelo'],['cor','Cor'],['barba','Barba'],['extra','Extra']];
  let opts='';
  if(CWTAB==='pele')opts=FX_SKINS.map(c=>`<button class="cw-sw ${C.skin===c?'on':''}" data-skin="${c}" style="background:${c}"></button>`).join('');
  if(CWTAB==='cor')opts=FX_HAIRC.map(c=>`<button class="cw-sw ${C.hairC===c?'on':''}" data-hc="${c}" style="background:${c}"></button>`).join('');
  if(CWTAB==='cabelo')opts=FX_STY.map(([s,n])=>`<button class="cw-fo ${C.style===s?'on':''}" data-sty="${s}">${faceSVG({custom:{...C,style:s,beard:'',acc:''}},kit[0],kit[1])}<small>${n}</small></button>`).join('');
  if(CWTAB==='barba')opts=FX_BEARD.map(([s,n])=>`<button class="cw-fo ${(C.beard||'')===s?'on':''}" data-bd="${s}">${faceSVG({custom:{...C,beard:s}},kit[0],kit[1])}<small>${n}</small></button>`).join('');
  if(CWTAB==='extra')opts=FX_ACC.map(([s,n])=>`<button class="cw-fo ${(C.acc||'')===s?'on':''}" data-acc="${s}">${faceSVG({custom:{...C,acc:s}},kit[0],kit[1])}<small>${n}</small></button>`).join('')+`<label class="cw-fo cw-photo"><span>📷</span><small>Usar foto</small><input type="file" accept="image/*" id="cwPh" hidden></label>`;
  body=`<div class="cw-face pop">${faceSVG(CR.face,kit[0],kit[1])}</div>
  <div class="cw-tabs">${tabs.map(([t,n])=>`<button class="${CWTAB===t?'on':''}" data-tab="${t}">${n}</button>`).join('')}</div>
  <div class="cw-opts ${CWTAB==='pele'||CWTAB==='cor'?'sw':''}">${opts}</div>
  <button class="cw-chip" id="cwRnd">🎲 Aleatório</button>`}
 if(k==='time'){const c=CR.heart&&CLUB[CR.heart];
  body=`<div class="cw-jer pop">${jerseySVG(kit[0],kit[1],CR.name,CR.num)}</div>
  <div class="cw-club">${c?shieldHTML(c,'lg'):'<span class="cw-noc">❔</span>'}<div><b>${c?esc(c.n):'Nenhum'}</b><small>${c?esc(LG[c.l].n):'Opcional'}</small></div></div>
  <select class="input cw-sel" id="cwHeart">${heartOptions()}</select>
  <p class="cw-note">Jogar por ele te deixa mais feliz, pede um título a menos pra virar ídolo e ele pode te ligar no mercado.</p>`}
 if(k==='posicao'){const p=POS[CR.pos];
  body=`<div class="pitch cw-pitch"><div class="ln" style="left:-2px;right:-2px;top:50%;height:0;border-width:2px 0 0"></div><div class="ln" style="left:50%;top:50%;width:26%;aspect-ratio:1;border-radius:50%;transform:translate(-50%,-50%)"></div><div class="ln" style="left:22%;right:22%;bottom:-2px;height:17%"></div><div class="ln" style="left:36%;right:36%;bottom:-2px;height:6%"></div><div class="ln" style="left:22%;right:22%;top:-2px;height:17%"></div>
   ${POS_ORDER.map(q=>`<button class="pbtn ${CR.pos===q?'on':''}" data-pos="${q}" style="left:${POS[q].x}%;top:${POS[q].y}%">${q}</button>`).join('')}</div>
  <div class="cw-posinfo"><b>${esc(p.n)}</b><small>Mais pesam: ${Object.entries(p.w).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([q,v])=>`${ATTR_NAME[q]} ${Math.round(v*100)}%`).join(' · ')}</small></div>`}
 if(k==='dificuldade'){const ic={amador:'🌱',pro:'⚽',lenda:'👑'};body=`<div class="cw-cards">${Object.entries(DIFF).map(([q,v])=>`<button class="cw-card ${CR.diff===q?'on':''}" data-diff="${q}"><span>${ic[q]||'⚽'}</span><div><b>${esc(v.n)}</b><small>${esc(v.d)}</small></div></button>`).join('')}</div>`}
 if(k==='ritmo'){body=`<div class="cw-cards"><button class="cw-card ${CR.fast!==false?'on':''}" data-fast="1"><span>⚡</span><div><b>Rápido</b><small>Temporada em 4 blocos. Só as finais ao vivo. Uma carreira em poucos minutos.</small></div></button><button class="cw-card ${CR.fast===false?'on':''}" data-fast="0"><span>🗓️</span><div><b>Completo</b><small>Semana a semana: dias livres, lances em todo jogo, mata-mata ao vivo.</small></div></button></div>
  <div class="cw-sum">${faceSVG(CR.face,kit[0],kit[1])}<div><b>${esc(CR.name||'Sem nome')} <span class="mono">#${CR.num}</span></b><small>${NATS[CR.nat].f} ${esc(POS[CR.pos].n)} · ${esc(DIFF[CR.diff].n)}${CR.heart&&CLUB[CR.heart]?' · ♥ '+esc(CLUB[CR.heart].n):''}</small></div></div>`}
 const last=CWI===CW_STEPS.length-1;
 $app.innerHTML=`<div class="cw"><div class="cw-top"><button class="cw-back" id="cwB" aria-label="Voltar">←</button><div class="cw-dots">${CW_STEPS.map((_,i)=>`<i class="${i<CWI?'done':i===CWI?'on':''}"></i>`).join('')}</div><span class="cw-cnt mono">${CWI+1}/${CW_STEPS.length}</span></div>
 <div class="cw-body ${CWDIR>0?'in-r':'in-l'}"><div class="eyebrow">Criação · passo ${CWI+1}</div><h2 class="cw-h">${esc(title)}</h2>${body}</div>
 <div class="cw-foot"><button class="btn wide cta ${last?'go':''}" id="cwN">${last?'Ir para a peneira →':'Próximo →'}</button></div></div>`;
 const go=d=>{if(d>0&&k==='nome'&&!CR.name.trim()){const i=document.getElementById('cwNm');i.classList.add('shake');i.placeholder='Digite um nome pra continuar';i.focus();setTimeout(()=>i.classList.remove('shake'),500);return}
  if(d>0&&last){document.body.classList.remove('cwmode','noscroll');CWI=0;startDraft();return}
  if(d<0&&CWI===0){document.body.classList.remove('cwmode','noscroll');try{renderIntro()}catch(e){}return}
  CWDIR=d;CWI=clamp(CWI+d,0,CW_STEPS.length-1);try{SFX.tone({f:d>0?620:420,dur:.06,gain:.05})}catch(e){}renderCreate()};
 document.getElementById('cwN').onclick=()=>go(1);document.getElementById('cwB').onclick=()=>go(-1);
 const $=s=>$app.querySelectorAll(s);
 const nm=document.getElementById('cwNm');if(nm){nm.oninput=()=>{CR.name=nm.value;const j=$app.querySelector('.cw-jer');if(j)j.innerHTML=jerseySVG(kit[0],kit[1],CR.name,CR.num)};nm.onkeydown=e=>{if(e.key==='Enter')go(1)};if(!CR.name)setTimeout(()=>nm.focus(),250)}
 $('[data-sug]').forEach(b=>b.onclick=()=>{CR.name=b.dataset.sug;renderCreate()});
 const setNum=n=>{CR.num=clamp(n,1,99);CWDIR=0;renderCreate()};
 const m=document.getElementById('cwM'),p2=document.getElementById('cwP');if(m)m.onclick=()=>setNum(CR.num-1);if(p2)p2.onclick=()=>setNum(CR.num+1);
 $('[data-n]').forEach(b=>b.onclick=()=>setNum(+b.dataset.n));
 $('[data-nat]').forEach(b=>b.onclick=()=>{CR.nat=b.dataset.nat;CWDIR=0;renderCreate()});
 $('[data-tab]').forEach(b=>b.onclick=()=>{CWTAB=b.dataset.tab;CWDIR=0;renderCreate()});
 const setF=o=>{CR.face={custom:{...(CR.face.custom||{}),...o}};CWDIR=0;renderCreate()};
 $('[data-skin]').forEach(b=>b.onclick=()=>setF({skin:b.dataset.skin}));$('[data-hc]').forEach(b=>b.onclick=()=>setF({hairC:b.dataset.hc}));
 $('[data-sty]').forEach(b=>b.onclick=()=>setF({style:b.dataset.sty}));$('[data-bd]').forEach(b=>b.onclick=()=>setF({beard:b.dataset.bd}));$('[data-acc]').forEach(b=>b.onclick=()=>setF({acc:b.dataset.acc}));
 const rnd=document.getElementById('cwRnd');if(rnd)rnd.onclick=()=>setF({skin:pick(FX_SKINS),hairC:pick(FX_HAIRC),style:pick(FX_STY)[0],beard:ch(.5)?'':pick(FX_BEARD)[0],acc:ch(.7)?'':pick(FX_ACC)[0]});
 const ph=document.getElementById('cwPh');if(ph)ph.onchange=e=>{const f=e.target.files[0];if(!f)return;const img=new Image();img.onload=()=>{const c=document.createElement('canvas');const s=Math.min(img.width,img.height);c.width=c.height=200;c.getContext('2d').drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,200,200);CR.face={photo:c.toDataURL('image/jpeg',.82),custom:CR.face.custom};CWDIR=0;renderCreate()};img.src=URL.createObjectURL(f)};
 const hs=document.getElementById('cwHeart');if(hs)hs.onchange=e=>{CR.heart=e.target.value;CWDIR=0;renderCreate()};
 $('[data-pos]').forEach(b=>b.onclick=()=>{CR.pos=b.dataset.pos;CWDIR=0;renderCreate()});
 $('[data-diff]').forEach(b=>b.onclick=()=>{CR.diff=b.dataset.diff;CWDIR=0;renderCreate()});
 $('[data-fast]').forEach(b=>b.onclick=()=>{CR.fast=b.dataset.fast==='1';CWDIR=0;renderCreate()});
};
{const _fd=finishDraft;finishDraft=function(...a){const f=CR.face;const r=_fd.apply(this,a);try{if(S&&f)S.face=f}catch(e){}return r}}

// ---------- TELA INICIAL NOVA ----------
const HOME_TAG=['Da peneira à Bola de Ouro.','Lances jogáveis: chute, passe, drible e cavadinha.','Champions, Libertadores, Copa do Mundo.','Fama, dinheiro, polêmica… e até prisão.','Seu empresário abre as portas. Seu futebol decide.'];
let HOME_T=null;
renderIntro=async function(){
 CLOUD.screen='home';clearInterval(HOME_T);
 const list=CLOUD.ready?await listSaves():[];if(CLOUD.screen!=='home')return;
 const live=list.filter(x=>!x.done),done=list.filter(x=>x.done);const cur=live[0];
 const kit=cur&&CLUB[cur.clubId]?[CLUB[cur.clubId].c1,CLUB[cur.clubId].c2]:['#ff7a2b','#ffffff'];
 page('home',`<div class="h2-home">
  <section class="h2-hero"><div class="h2-glow"></div><div class="h2-balls"><i>⚽</i><i>⚽</i><i>⚽</i></div>
   <div class="h2-left"><div class="eyebrow">Simulador de carreira · futebol</div><h1 class="logo h2-logo"><span class="l1">Fome</span><span class="l2">de Bola</span></h1><p class="h2-tag" id="h2Tag">${HOME_TAG[0]}</p></div>
   <div class="h2-shirt">${jerseySVG(kit[0],kit[1],cur?cur.name:'SEU NOME',cur?(cur.num||10):10)}</div></section>
  ${cur?`<button class="h2-cont" id="cont0"><span class="h2-ovr mono">${cur.ovr}</span><div><small>Continuar</small><b>${esc(cur.name)}</b><span>${esc(cur.club||'Sem clube')} · ${cur.age} anos · ${esc(PHASE_LBL[cur.phase]||'Em andamento')}</span></div><em>▶</em></button>`:''}
  <button class="h2-new ${cur?'':'pulse'}" id="go"><span>＋</span><div><b>Nova carreira</b><small>${cur?'Começar outra do zero':'Crie seu jogador em 8 toques'}</small></div><em>→</em></button>
  <div class="h2-tiles"><button data-nav="careers"><span>📁</span><b>${live.length}</b><small>Em andamento</small></button><button data-nav="careers"><span>🏅</span><b>${done.length}</b><small>Lendas</small></button><button data-nav="ranking"><span>🏆</span><b>Top</b><small>Ranking</small></button></div>
  <p class="foot h2-foot">Sem afiliação com clubes, ligas, federações ou com a EA. Nomes reais só para identificação.</p></div>`);
 document.body.classList.add('homefit');
 const fit=()=>{const w=$app.querySelector('.hwrap'),bn=$app.querySelector('.bnav');if(!w)return;const bnH=bn&&getComputedStyle(bn).position==='fixed'?bn.offsetHeight:0;w.style.height=Math.max(380,innerHeight-w.getBoundingClientRect().top-bnH-(bn&&bnH===0?bn.offsetHeight:0)-4)+'px'};fit();setTimeout(fit,60);
 document.getElementById('go').onclick=()=>{clearInterval(HOME_T);document.body.classList.remove('homefit');CLOUD.screen='game';CWI=0;renderCreate()};
 const c0=document.getElementById('cont0');if(c0)c0.onclick=()=>{clearInterval(HOME_T);document.body.classList.remove('homefit');loadSave(cur.cid)};
 $app.querySelectorAll('.h2-tiles [data-nav]').forEach(b=>b.addEventListener('click',()=>{clearInterval(HOME_T);document.body.classList.remove('homefit')}));
 let ti=0;HOME_T=setInterval(()=>{const el=document.getElementById('h2Tag');if(!el){clearInterval(HOME_T);return}ti=(ti+1)%HOME_TAG.length;el.classList.remove('in');void el.offsetWidth;el.textContent=HOME_TAG[ti];el.classList.add('in')},3200);
};
{const _pg=page;page=function(a,i){if(a!=='home')document.body.classList.remove('homefit');return _pg(a,i)}}

// ---------- estilo: sem barras de rolagem, telas que cabem, animações ----------
{const st=document.createElement('style');st.textContent=`
*{scrollbar-width:none}*::-webkit-scrollbar{display:none;width:0;height:0}
html,body{overflow-x:hidden;max-width:100vw}.scrollx{flex-wrap:wrap!important;overflow:visible!important}
body.cwmode,body.homefit{overflow:hidden;height:100dvh}
/* criação */
.cw{position:fixed;inset:0;display:flex;flex-direction:column;background:radial-gradient(120% 70% at 50% 0%,#1d4a32 0%,var(--pitch) 60%);z-index:5;max-width:560px;margin:0 auto}
.cw-top{display:flex;align-items:center;gap:12px;padding:12px 16px 4px}.cw-back{width:40px;height:40px;border-radius:12px;background:rgba(255,255,255,.07);border:1px solid var(--line);color:var(--chalk);font-size:18px}
.cw-dots{flex:1;display:flex;gap:5px}.cw-dots i{flex:1;height:5px;border-radius:3px;background:rgba(255,255,255,.12);transition:.3s}.cw-dots i.done{background:var(--accent)}.cw-dots i.on{background:var(--gold);box-shadow:0 0 10px rgba(242,196,67,.6)}
.cw-cnt{font-size:12px;color:var(--muted)}
.cw-body{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:6px 16px;text-align:center;overflow:hidden}
.cw-body.in-r{animation:cwR .32s ease both}.cw-body.in-l{animation:cwL .32s ease both}
@keyframes cwR{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}@keyframes cwL{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:none}}
.cw-h{font-family:var(--f-display);font-weight:900;font-size:clamp(28px,8vw,40px);line-height:1;margin:0;text-transform:uppercase;font-style:italic}
.cw-foot{padding:10px 16px calc(14px + env(safe-area-inset-bottom))}.cw-foot .cta.go{background:linear-gradient(180deg,#ffd34a,#f2a91a);color:#1a1200;animation:cwPulse 1.6s ease-in-out infinite}
@keyframes cwPulse{50%{transform:scale(1.03);box-shadow:0 0 24px rgba(242,196,67,.5)}}
.pop{animation:cwPop .45s cubic-bezier(.2,1.4,.4,1) both}@keyframes cwPop{from{transform:scale(.6) rotate(-6deg);opacity:0}}
.cw-jer{width:min(58vw,240px,30dvh)}.cw-jer.big{width:min(66vw,280px,36dvh)}.jersey2{width:100%;height:auto;filter:drop-shadow(0 14px 22px rgba(0,0,0,.45))}
.cw-in{font-size:22px;text-align:center;max-width:340px;font-weight:700;padding:14px}.cw-in.shake{animation:cwShake .4s}@keyframes cwShake{25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
.cw-chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center;font-size:13px}.cw-chip{padding:8px 12px;border-radius:999px;background:rgba(255,255,255,.07);border:1px solid var(--line-2);color:var(--chalk);font:inherit;font-size:13px}
.cw-num{display:flex;align-items:center;gap:18px}.cw-num b{font-size:46px;min-width:76px}.cw-pm{width:52px;height:52px;border-radius:50%;font-size:28px;background:rgba(255,255,255,.08);border:1px solid var(--line-2);color:var(--chalk)}
.cw-flavor{color:var(--gold);font-weight:700;font-size:14px;min-height:18px}
.cw-grid{display:grid;gap:6px;width:100%;max-width:420px}.cw-grid.n8{grid-template-columns:repeat(8,1fr)}.cw-grid.n5{grid-template-columns:repeat(5,1fr)}
.cw-nb{padding:9px 0;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid var(--line);color:var(--chalk);font-family:var(--f-display);font-weight:800;font-size:17px}.cw-nb.on{background:var(--accent);color:#1b0d03;border-color:var(--accent)}
.cw-big{font-size:min(16vw,72px,10dvh);line-height:1;display:grid;gap:2px}.cw-big small{font-size:15px;font-weight:800;color:var(--chalk)}
.cw-flag{display:grid;place-items:center;gap:2px;padding:6px 2px;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid var(--line);color:var(--chalk);min-width:0}.cw-flag span{font-size:min(7vw,30px,4.6dvh)}.cw-flag small{font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}.cw-flag.on{border-color:var(--gold);background:rgba(242,196,67,.16);transform:scale(1.06)}
.cw-face{width:min(42vw,170px,24dvh);aspect-ratio:1;border-radius:50%;overflow:hidden;background:radial-gradient(circle at 50% 35%,#2b6a48,#0f2a1d);border:3px solid var(--gold);box-shadow:0 10px 30px rgba(0,0,0,.4)}.cw-face svg,.cw-face img{width:100%;height:100%;object-fit:cover}
.cw-tabs{display:flex;gap:4px;padding:4px;border-radius:999px;background:rgba(0,0,0,.25)}.cw-tabs button{padding:8px 12px;border-radius:999px;border:0;background:none;color:var(--muted);font:inherit;font-weight:700;font-size:13px}.cw-tabs button.on{background:var(--chalk);color:#10261a}
.cw-opts{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;width:100%;max-width:420px}.cw-opts.sw{grid-template-columns:repeat(8,1fr)}
.cw-sw{aspect-ratio:1;border-radius:50%;border:3px solid rgba(255,255,255,.15)}.cw-sw.on{border-color:var(--gold);transform:scale(1.12);box-shadow:0 0 0 2px #10261a inset}
.cw-fo{display:grid;justify-items:center;gap:0;padding:4px 2px;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid var(--line);color:var(--chalk);min-width:0;cursor:pointer}.cw-fo svg{width:100%;max-width:56px;height:auto}.cw-fo small{font-size:10px;white-space:nowrap}.cw-fo.on{border-color:var(--gold);background:rgba(242,196,67,.16)}.cw-photo span{font-size:28px;line-height:56px}
.cw-club{display:flex;align-items:center;gap:12px;text-align:left}.cw-club b{display:block;font-size:20px;font-family:var(--f-display)}.cw-club small{color:var(--muted)}.cw-noc{font-size:32px}
.cw-sel{max-width:340px;font-size:16px}.cw-note{color:var(--muted);font-size:13px;max-width:340px;margin:0}
.cw-pitch{height:min(44dvh,400px);width:auto!important;max-width:100%;aspect-ratio:68/80}
.cw-posinfo{display:grid;gap:2px}.cw-posinfo b{font-family:var(--f-display);font-size:26px}.cw-posinfo small{color:var(--muted)}
.cw-cards{display:grid;gap:10px;width:100%;max-width:420px}.cw-card{display:flex;gap:14px;align-items:center;text-align:left;padding:16px;border-radius:18px;background:rgba(255,255,255,.05);border:1px solid var(--line-2);color:var(--chalk);transition:.2s}.cw-card>span{font-size:34px}.cw-card b{font-family:var(--f-display);font-size:22px;display:block}.cw-card small{color:var(--muted);font-size:13px}.cw-card.on{border-color:var(--gold);background:linear-gradient(135deg,rgba(242,196,67,.18),rgba(255,122,43,.08));transform:scale(1.02)}
.cw-sum{display:flex;gap:12px;align-items:center;padding:10px 14px;border-radius:16px;background:rgba(0,0,0,.25);text-align:left;max-width:420px;width:100%}.cw-sum svg,.cw-sum img{width:54px;height:54px;border-radius:50%;background:#123;flex:0 0 auto}.cw-sum small{color:var(--muted);display:block}
/* início */
body.homefit .hwrap{height:calc(100dvh - 58px - 64px - env(safe-area-inset-bottom));overflow:hidden;padding-top:8px!important;padding-bottom:8px!important;margin-bottom:0!important;min-height:0!important}
.h2-home{height:100%;display:flex;flex-direction:column;gap:10px}
.h2-hero{position:relative;flex:1;min-height:0;border-radius:24px;overflow:hidden;display:flex;align-items:center;gap:8px;padding:18px;background:linear-gradient(135deg,#123a26,#0b2016 55%,#20150a);border:1px solid var(--line)}
.h2-glow{position:absolute;inset:-40%;background:conic-gradient(from 0deg,transparent,rgba(255,122,43,.18),transparent 30%,rgba(242,196,67,.14),transparent 60%);animation:h2spin 12s linear infinite}@keyframes h2spin{to{transform:rotate(360deg)}}
.h2-balls i{position:absolute;font-style:normal;font-size:22px;opacity:.5;animation:h2fly 7s linear infinite}.h2-balls i:nth-child(1){left:8%;animation-delay:-1s}.h2-balls i:nth-child(2){left:55%;animation-delay:-3.5s;font-size:16px}.h2-balls i:nth-child(3){left:82%;animation-delay:-5.5s;font-size:28px}
@keyframes h2fly{from{top:110%;transform:rotate(0)}to{top:-15%;transform:rotate(540deg)}}
.h2-left{position:relative;flex:1.2;min-width:0;z-index:1}.h2-logo{font-size:clamp(48px,14vw,92px)!important;margin:6px 0 0}.h2-tag{font-weight:700;color:var(--chalk);min-height:2.6em;margin:10px 0 0;font-size:clamp(13px,3.6vw,16px)}.h2-tag.in{animation:h2tag .5s ease both}@keyframes h2tag{from{opacity:0;transform:translateY(8px)}}
.h2-shirt{position:relative;z-index:1;flex:1;max-width:44%;animation:h2float 4s ease-in-out infinite}@keyframes h2float{50%{transform:translateY(-10px) rotate(3deg)}}
.h2-cont{display:flex;align-items:center;gap:12px;text-align:left;padding:12px 14px;border-radius:18px;background:linear-gradient(135deg,rgba(242,196,67,.2),rgba(255,122,43,.1));border:1px solid rgba(242,196,67,.5);color:var(--chalk)}.h2-cont small{color:var(--gold);font-weight:800;text-transform:uppercase;font-size:11px;letter-spacing:.08em}.h2-cont b{display:block;font-size:18px}.h2-cont span{color:var(--muted);font-size:13px}.h2-cont div{flex:1;min-width:0}.h2-cont em{font-style:normal;font-size:22px;color:var(--gold)}
.h2-ovr{display:grid;place-items:center;width:50px;height:50px;border-radius:14px;background:var(--gold);color:#1a1200;font-weight:900;font-size:20px}
.h2-new{display:flex;align-items:center;gap:12px;text-align:left;padding:14px 16px;border-radius:18px;background:linear-gradient(180deg,#ff8a3d,#e85f14);border:0;color:#1b0d03}.h2-new span{font-size:28px;font-weight:900}.h2-new b{display:block;font-size:20px;font-family:var(--f-display)}.h2-new small{opacity:.8}.h2-new div{flex:1}.h2-new em{font-style:normal;font-size:24px}.h2-new.pulse{animation:cwPulse 1.8s ease-in-out infinite}
.h2-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.h2-tiles button{display:grid;justify-items:center;gap:0;padding:10px 4px;border-radius:16px;background:var(--panel);border:1px solid var(--line);color:var(--chalk)}.h2-tiles span{font-size:20px}.h2-tiles b{font-family:var(--f-display);font-size:20px}.h2-tiles small{color:var(--muted);font-size:11px}
.h2-foot{margin:0!important;font-size:10px!important;text-align:center;opacity:.6}
@media (max-height:700px){.h2-tiles{display:none}.h2-tag{min-height:0}.cw-jer.big{width:min(50vw,26dvh)}.cw-jer{width:min(46vw,24dvh)}.cw-num b{font-size:36px}.cw-pm{width:44px;height:44px}.cw-h{font-size:26px}.cw-nb{padding:6px 0}.h2-shirt{max-width:36%}}`;document.head.appendChild(st)}
