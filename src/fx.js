// ================== TROFÉUS DESENHADOS ==================
let TRO_N=0;
const TROPHY_KINDS=['liga','copa','lcup','super','est','orelhas','liberta','cont2','cont3','globo','mundial','copa_mundo','nat','olimp','bola','bola_top3','chuteira','luva','revelacao','craque_liga','posicao','artilheiro','selecao','craque_copa','acesso'];
const TRO_LABEL={revelacao:'Golden Boy',chuteira:'Chuteira de Ouro',luva:'Luva de Ouro',artilheiro:'Artilheiro',craque_liga:'Craque da liga',posicao:'Melhor da posição',selecao:'Seleção da Temporada',craque_copa:'Bola de Ouro da Copa',bola:'Bola de Ouro',bola_top3:'Pódio da Bola de Ouro',acesso:'Acesso'};
const normName=t=>String(t||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\.[a-z0-9]+$/,'').replace(/[^a-z0-9]/g,'');
function trophyImg(n,kind){const m=(typeof CLOUD!=='undefined'&&CLOUD.trophies)||{};const up=m[normName(n)]||(TRO_LABEL[kind]&&m[normName(TRO_LABEL[kind])]);if(up)return'/_blob/'+up;const A=typeof ASSET_T!=='undefined'?ASSET_T:{};return A[normName(n)]||(TRO_LABEL[kind]&&A[normName(TRO_LABEL[kind])])||null}
function TROPHY(kind,o={}){
 {const im=trophyImg(o.n,kind);if(im)return`<img class="troimg" src="${esc(im)}" alt="">`}
 const id='t'+(++TRO_N);
 const G=`url(#${id}g)`,Sv=`url(#${id}s)`,B=`url(#${id}b)`,Cr=`url(#${id}c)`,Gr=`url(#${id}r)`;
 const c1=o.c1||'#c8102e',c2=o.c2||'#ffffff';
 const defs=`<defs>
 <linearGradient id="${id}g" x1="0" x2="1"><stop offset="0" stop-color="#7a4d0e"/><stop offset=".32" stop-color="#e9bf4f"/><stop offset=".5" stop-color="#fff4c4"/><stop offset=".68" stop-color="#e2ad34"/><stop offset="1" stop-color="#7a4d0e"/></linearGradient>
 <linearGradient id="${id}s" x1="0" x2="1"><stop offset="0" stop-color="#5b636d"/><stop offset=".32" stop-color="#d7dee5"/><stop offset=".5" stop-color="#ffffff"/><stop offset=".68" stop-color="#bcc5ce"/><stop offset="1" stop-color="#525a63"/></linearGradient>
 <linearGradient id="${id}b" x1="0" x2="1"><stop offset="0" stop-color="#140d08"/><stop offset=".5" stop-color="#3a2618"/><stop offset="1" stop-color="#140d08"/></linearGradient>
 <linearGradient id="${id}c" x1="0" x2="1"><stop offset="0" stop-color="#9fd8ff" stop-opacity=".55"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".9"/><stop offset="1" stop-color="#7cc4ff" stop-opacity=".5"/></linearGradient>
 <radialGradient id="${id}r" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#fff6cf"/><stop offset=".45" stop-color="#f0c544"/><stop offset="1" stop-color="#7a4d0e"/></radialGradient></defs>`;
 const baseBlack=(y=140,w=64)=>`<rect x="${60-w/2}" y="${y}" width="${w}" height="14" rx="2" fill="${B}"/><rect x="${60-w/2-6}" y="${y+14}" width="${w+12}" height="12" rx="2" fill="${B}"/><rect x="${60-w/4}" y="${y+4}" width="${w/2}" height="6" rx="1" fill="${G}"/>`;
 const metalBase=(F,y=136)=>`<path d="M44 ${y}h32l6 12H38z" fill="${F}"/><rect x="34" y="${y+12}" width="52" height="10" rx="3" fill="${F}"/>`;
 let b='';
 switch(kind){
 case 'liga':b=`<path d="M48 104h24l-3 22H51z" fill="${G}"/><ellipse cx="60" cy="128" rx="14" ry="4" fill="${G}"/>
  <path d="M28 30h64c0 44-12 70-32 74C40 100 28 74 28 30z" fill="${G}"/><ellipse cx="60" cy="30" rx="32" ry="6" fill="#fff1b8"/><ellipse cx="60" cy="30" rx="28" ry="4" fill="#b8861f"/>
  <path d="M28 40c-16 0-18 26 2 30M92 40c16 0 18 26-2 30" fill="none" stroke="${G}" stroke-width="5" stroke-linecap="round"/>
  <path d="M26 70l-6 34 8-6 4 8 2-36z" fill="${c1}"/><path d="M94 70l6 34-8-6-4 8-2-36z" fill="${c2}" stroke="${c1}" stroke-width=".8"/>
  <path d="M60 16l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z" fill="${G}"/>${baseBlack(132)}`;break;
 case 'copa':b=`<path d="M30 34h60c0 40-10 62-30 66-20-4-30-26-30-66z" fill="${Sv}"/><ellipse cx="60" cy="34" rx="30" ry="6" fill="#f4f7fa"/>
  <path d="M30 38c-22-4-22 34 0 40M90 38c22-4 22 34 0 40" fill="none" stroke="${Sv}" stroke-width="5"/>
  <path d="M40 26c0-10 40-10 40 0z" fill="${Sv}"/><circle cx="60" cy="15" r="5" fill="${Sv}"/>
  <path d="M52 100h16l2 30H50z" fill="${Sv}"/>${metalBase(Sv,128)}`;break;
 case 'lcup':b=`<ellipse cx="60" cy="40" rx="40" ry="10" fill="#fff1b8"/><path d="M20 40c4 26 22 38 40 38s36-12 40-38" fill="${G}"/><ellipse cx="60" cy="40" rx="35" ry="7" fill="#b8861f"/>
  <path d="M56 78h8v46h-8z" fill="${G}"/><path d="M46 92c0-6 28-6 28 0" fill="none" stroke="${G}" stroke-width="3"/>${metalBase(Sv,124)}`;break;
 case 'super':b=`<path d="M36 40h48c0 34-8 50-24 54-16-4-24-20-24-54z" fill="${G}"/><ellipse cx="60" cy="40" rx="24" ry="5" fill="#fff1b8"/>
  <path d="M60 52l4 8h9l-7 5 3 9-9-6-9 6 3-9-7-5h9z" fill="#7a4d0e"/><path d="M54 94h12v30H54z" fill="${G}"/>${baseBlack(124,52)}`;break;
 case 'est':b=`<circle cx="60" cy="62" r="42" fill="${G}"/><circle cx="60" cy="62" r="34" fill="none" stroke="#fff3c0" stroke-width="2" opacity=".7"/><circle cx="60" cy="62" r="28" fill="#c9952a"/>
  <path d="M60 42l6 12h13l-10 8 4 13-13-8-13 8 4-13-10-8h13z" fill="#fff3c0"/><path d="M50 104h20l4 30H46z" fill="${G}"/>${baseBlack(134,56)}`;break;
 case 'orelhas':b=`<path d="M38 18h44l-4 18c-2 30-8 54-18 60-10-6-16-30-18-60z" fill="${Sv}"/><ellipse cx="60" cy="18" rx="22" ry="4" fill="#ffffff"/>
  <path d="M40 30c-14 2-14 34 4 42M80 30c14 2 14 34-4 42" fill="none" stroke="${Sv}" stroke-width="4"/>
  <path d="M54 96h12v14H54z" fill="${Sv}"/><path d="M42 110h36l6 22H36z" fill="${Sv}"/><rect x="32" y="132" width="56" height="12" rx="3" fill="${Sv}"/>`;break;
 case 'liberta':b=`<path d="M40 26h40c0 30-6 48-20 52-14-4-20-22-20-52z" fill="${Sv}"/><ellipse cx="60" cy="26" rx="20" ry="4" fill="#fff"/><path d="M46 20c0-8 28-8 28 0z" fill="${Sv}"/><circle cx="60" cy="9" r="4" fill="${Sv}"/>
  <path d="M40 34c-10 0-10 20 2 24M80 34c10 0 10 20-2 24" fill="none" stroke="${Sv}" stroke-width="3"/><path d="M55 78h10v14H55z" fill="${Sv}"/>
  <path d="M36 92h48l6 60H30z" fill="${B}"/>${[0,1,2,3].map(i=>`<rect x="${40+(i%2)*21}" y="${104+Math.floor(i/2)*18}" width="17" height="11" rx="1" fill="${G}"/>`).join('')}<rect x="26" y="152" width="68" height="8" rx="2" fill="${B}"/>`;break;
 case 'cont2':b=`<path d="M34 28h52c0 38-10 58-26 62-16-4-26-24-26-62z" fill="${G}"/><ellipse cx="60" cy="28" rx="26" ry="5" fill="#fff1b8"/>
  <path d="M34 34c-18 0-18 30 4 34M86 34c18 0 18 30-4 34" fill="none" stroke="${Sv}" stroke-width="5"/><path d="M53 90h14l3 34H50z" fill="${Sv}"/>${baseBlack(124,56)}`;break;
 case 'cont3':b=`<path d="M48 14h24l6 70c0 10-8 16-18 16s-18-6-18-16z" fill="${Sv}"/><path d="M52 22h16l4 58H48z" fill="#ffffff" opacity=".35"/><ellipse cx="60" cy="14" rx="12" ry="3" fill="#fff"/>
  <path d="M54 100h12v20H54z" fill="${Sv}"/>${baseBlack(120,50)}`;break;
 case 'globo':b=`<circle cx="60" cy="44" r="30" fill="${Gr}"/><ellipse cx="60" cy="44" rx="12" ry="30" fill="none" stroke="#7a4d0e" stroke-width="1.6" opacity=".7"/><path d="M30 44h60M34 30h52M34 58h52" stroke="#7a4d0e" stroke-width="1.6" opacity=".7"/>
  <path d="M50 74h20l-4 30h-12z" fill="${G}"/><path d="M42 104h36l4 14H38z" fill="${G}"/>${baseBlack(118,60)}`;break;
 case 'mundial':b=`<ellipse cx="60" cy="50" rx="44" ry="12" fill="none" stroke="${G}" stroke-width="4" transform="rotate(-18 60 50)"/><circle cx="60" cy="50" r="26" fill="${Gr}"/><path d="M34 50h52M60 24v52" stroke="#7a4d0e" stroke-width="1.4" opacity=".6"/>
  <path d="M30 30l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" fill="#fff1b8"/><path d="M92 70l2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1z" fill="#fff1b8"/>
  <path d="M52 76h16l4 30H48z" fill="${G}"/>${baseBlack(106,62)}`;break;
 case 'copa_mundo':b=`<circle cx="60" cy="30" r="22" fill="${Gr}"/><path d="M38 30h44M60 8v44M44 16c10 8 22 8 32 0M44 44c10-8 22-8 32 0" stroke="#7a4d0e" stroke-width="1.4" fill="none" opacity=".6"/>
  <path d="M42 50c4 8 10 10 10 18v6h16v-6c0-8 6-10 10-18-8 6-28 6-36 0z" fill="${G}"/>
  <path d="M50 74h20l-2 40H52z" fill="${G}"/><path d="M52 82c6 4 10 4 16 0M52 92c6 4 10 4 16 0M52 102c6 4 10 4 16 0" stroke="#8a5a12" stroke-width="2" fill="none"/>
  <path d="M42 114h36l4 14H38z" fill="${G}"/><rect x="36" y="128" width="48" height="12" rx="3" fill="${G}"/><rect x="36" y="131" width="48" height="3" fill="#8a5a12" opacity=".5"/>`;break;
 case 'nat':b=`<path d="M32 36h56c0 36-10 56-28 60-18-4-28-24-28-60z" fill="${G}"/><ellipse cx="60" cy="36" rx="28" ry="5" fill="#fff1b8"/>
  <path d="M32 42c-16 0-16 26 4 30M88 42c16 0 16 26-4 30" fill="none" stroke="${G}" stroke-width="5"/>
  <path d="M60 4l5 11h12l-10 7 4 12-11-7-11 7 4-12-10-7h12z" fill="${G}"/><path d="M56 30v-6h8v6z" fill="${G}"/>
  <path d="M53 96h14l3 28H50z" fill="${G}"/>${baseBlack(124,58)}`;break;
 case 'olimp':b=`<path d="M38 4l22 50L82 4h-14L60 26 52 4z" fill="${c1}"/><path d="M52 4l8 22 8-22" fill="${c2}" opacity=".8"/>
  <circle cx="60" cy="96" r="40" fill="${Gr}"/><circle cx="60" cy="96" r="30" fill="none" stroke="#7a4d0e" stroke-width="2" opacity=".6"/><path d="M60 76l6 12h13l-10 8 4 13-13-8-13 8 4-13-10-8h13z" fill="#fff3c0"/>`;break;
 case 'bola':case 'bola_top3':{const F=kind==='bola'?Gr:`url(#${id}sv)`;b=(kind==='bola_top3'?`<defs><radialGradient id="${id}sv" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#c9d1d9"/><stop offset="1" stop-color="#5b636d"/></radialGradient></defs>`:'')+`<circle cx="60" cy="56" r="40" fill="${F}"/>
  <path d="M60 36l15 11-6 18H51l-6-18z" fill="#7a4d0e" opacity=".55"/><path d="M60 36V18M75 47l17-6M69 65l11 15M51 65L40 80M45 47l-17-6" stroke="#7a4d0e" stroke-width="2.2" opacity=".55"/>
  <path d="M28 40a36 36 0 0 1 22-20" stroke="#fff" stroke-width="4" fill="none" opacity=".55" stroke-linecap="round"/>
  <path d="M46 94h28l6 18H40z" fill="${kind==='bola'?G:Sv}"/>${baseBlack(112,60)}`}break;
 case 'chuteira':b=`<path d="M22 46h30l8 24 34 12c8 3 12 9 12 16v6H22z" fill="${G}"/><path d="M22 46h30l8 24" fill="none" stroke="#fff3c0" stroke-width="2" opacity=".6"/>
  <path d="M30 56h18M30 64h22" stroke="#7a4d0e" stroke-width="2" opacity=".6"/><path d="M28 104v8M44 104v8M64 104v8M84 104v8" stroke="${G}" stroke-width="4"/>${baseBlack(114,72)}`;break;
 case 'luva':b=`<path d="M40 70V30a6 6 0 0 1 12 0v30V20a6 6 0 0 1 12 0v40V24a6 6 0 0 1 12 0v38-20a6 6 0 0 1 12 0v40c0 22-14 32-30 32-14 0-24-8-28-20l-8-20a6 6 0 0 1 10-6z" fill="${G}"/>
  <path d="M46 96h36" stroke="#7a4d0e" stroke-width="3" opacity=".5"/>${baseBlack(118,64)}`;break;
 case 'revelacao':b=`<path d="M60 18l9 18 20 3-14 14 3 20-18-9-18 9 3-20-14-14 20-3z" fill="${G}"/>
  <path d="M26 60c0 26 16 42 34 46M94 60c0 26-16 42-34 46" fill="none" stroke="${G}" stroke-width="4"/>${[0,1,2,3,4].map(i=>`<ellipse cx="${30+i*2}" cy="${66+i*8}" rx="6" ry="3" fill="${G}" transform="rotate(-40 ${30+i*2} ${66+i*8})"/><ellipse cx="${90-i*2}" cy="${66+i*8}" rx="6" ry="3" fill="${G}" transform="rotate(40 ${90-i*2} ${66+i*8})"/>`).join('')}
  <path d="M54 106h12v14H54z" fill="${G}"/>${baseBlack(120,56)}`;break;
 case 'acesso':b=`<path d="M60 10l34 40H74v50H46V50H26z" fill="${G}"/><path d="M60 22l20 24H68v48H52V46H40z" fill="#fff3c0" opacity=".35"/>${baseBlack(108,64)}`;break;
 default:{const sym=kind==='artilheiro'?`<circle cx="60" cy="58" r="14" fill="#fff"/><path d="M60 50l7 5-3 8h-8l-3-8z" fill="#151515"/>`:kind==='craque_copa'?`<circle cx="60" cy="58" r="15" fill="${Gr}"/>`:`<path d="M60 42l5 11h12l-10 8 4 12-11-7-11 7 4-12-10-8h12z" fill="${G}"/>`;
  b=`<path d="M38 12h44l8 96H30z" fill="${Cr}" stroke="#bfe6ff" stroke-width="1.2"/><path d="M48 18h10l-6 84h-10z" fill="#fff" opacity=".35"/>${sym}${baseBlack(108,66)}`}
 }
 return`<svg viewBox="0 0 120 170" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}${b}</svg>`;
}
const _ICON0=ICON;
ICON=function(k){return TROPHY_KINDS.includes(k)?TROPHY(k):_ICON0(k)};

// ================== CONFETE ==================
function confetti(host,colors,ms=4200){
 if(reduced)return;
 const cv=document.createElement('canvas');cv.className='confetti';host.appendChild(cv);
 const ctx=cv.getContext('2d');const dpr=Math.min(2,window.devicePixelRatio||1);
 const fit=()=>{cv.width=host.clientWidth*dpr;cv.height=host.clientHeight*dpr};fit();
 const P=[];for(let i=0;i<170;i++)P.push({x:Math.random()*cv.width,y:-Math.random()*cv.height*.6,vx:(Math.random()-.5)*2*dpr,vy:(2+Math.random()*3.5)*dpr,r:Math.random()*Math.PI,vr:(Math.random()-.5)*.25,w:(5+Math.random()*6)*dpr,h:(3+Math.random()*5)*dpr,c:colors[i%colors.length]});
 const t0=performance.now();
 const step=t=>{const e=t-t0;ctx.clearRect(0,0,cv.width,cv.height);ctx.globalAlpha=e>ms-800?Math.max(0,(ms-e)/800):1;
  for(const p of P){p.x+=p.vx+Math.sin((t/400)+p.r)*.6*dpr;p.y+=p.vy;p.r+=p.vr;if(p.y>cv.height+20&&e<ms-1200){p.y=-10;p.x=Math.random()*cv.width}
   ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.fillStyle=p.c;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);ctx.restore()}
  if(e<ms&&cv.isConnected)requestAnimationFrame(step);else cv.remove()};
 requestAnimationFrame(step);
}
function clubColors(c){if(!c)return['#f2c443','#ffffff','#ff7a2b'];const cc=CLUB[c]||{};return[cc.c1||'#f2c443',cc.c2||'#ffffff','#f2c443','#fff4c4']}

// ================== CELEBRAÇÃO DE TÍTULO ==================
function celebrateUI(t){
 return new Promise(res=>{
  $ov.hidden=false;const c=t.club?CLUB[t.club]:null;const nat=t.nat?NATS[t.nat]:null;
  const kind=t.t==='acesso'?'acesso':(t.ic||t.t);
  $ov.innerHTML=`<div class="ovwrap celeb"><div class="rays"></div>
  <div class="eyebrow">${t.t==='acesso'?'Acesso garantido':'Título conquistado'}</div>
  <div class="tro-stage"><div class="tro rise">${TROPHY(kind,{c1:c?c.c1:'#f2c443',c2:c?c.c2:'#fff',n:t.n})}</div><div class="plinth"></div></div>
  <h2 class="champ">${t.t==='acesso'?'SUBIU!':'CAMPEÃO!'}</h2>
  <div class="cname">${esc(t.n)}</div>
  <div class="row" style="justify-content:center;margin:8px 0 14px">${c?shieldHTML(c,'lg'):nat?`<span style="font-size:40px">${nat.f}</span>`:''}<b style="font-size:18px">${esc(c?c.n:nat?nat.n:'')}</b></div>
  <button class="btn wide" id="celOk">Continuar</button></div>`;
  confetti($ov,clubColors(t.club));
  document.getElementById('celOk').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res()};
  document.getElementById('celOk').focus({preventScroll:true});
 });
}
IO_UI.celebrate=celebrateUI;

// ================== CENA DE PÊNALTI ==================
const PKZ=[[80,60],[160,56],[240,60],[80,116],[160,120],[240,116]];
const KO={x:160,y:105};
function sceneSVG(o){
 const kc=o.keeperColor||'#c6f432',sc=o.shooterColor||'#e8e8e8',sc2=o.shooterColor2||'#151515';
 return`<svg class="pkscene" viewBox="0 0 320 232" xmlns="http://www.w3.org/2000/svg">
 <defs><pattern id="net" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0 0L10 10M10 0L0 10" stroke="rgba(236,240,226,.28)" stroke-width=".8"/></pattern>
 <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07140d"/><stop offset="1" stop-color="#123323"/></linearGradient>
 <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f5a3a"/><stop offset="1" stop-color="#14402a"/></linearGradient></defs>
 <rect width="320" height="232" fill="url(#sky)"/>
 <g opacity=".5">${Array.from({length:22},(_,i)=>`<circle cx="${8+i*14.5}" cy="${10+(i%3)*5}" r="2.2" fill="rgba(255,255,255,${.15+(i%4)*.08})"/>`).join('')}</g>
 <rect y="142" width="320" height="90" fill="url(#grass)"/>
 ${[0,1,2,3].map(i=>`<rect y="${150+i*22}" width="320" height="11" fill="rgba(255,255,255,.035)"/>`).join('')}
 <path d="M10 142h300" stroke="rgba(236,240,226,.7)" stroke-width="1.5"/><path d="M70 142l-22 46h224l-22-46" fill="none" stroke="rgba(236,240,226,.45)" stroke-width="1.3"/>
 <ellipse cx="160" cy="200" rx="3.5" ry="1.6" fill="#fff"/>
 <g id="net"><rect x="42" y="30" width="236" height="112" fill="url(#net)"/><path d="M42 30l-8-8h252l-8 8" fill="rgba(236,240,226,.08)"/></g>
 <path d="M40 142V28h240v114" fill="none" stroke="#f4f6f0" stroke-width="5" stroke-linejoin="round"/>
 <g id="dots">${PKZ.map(([x,y],i)=>`<g class="zdot ${o.dotMode||'shoot'}" data-z="${i}" tabindex="0" role="button" aria-label="Zona ${i+1}"><rect x="${x-40}" y="${y-28}" width="80" height="56" fill="transparent"/><circle cx="${x}" cy="${y}" r="9" class="ring"/><circle cx="${x}" cy="${y}" r="3.5" class="core"/></g>`).join('')}</g>
 <g id="kp" style="transform-box:view-box;transform-origin:${KO.x}px ${KO.y}px">
  <g class="idle">
  <rect x="150" y="112" width="8" height="30" rx="3.5" fill="#1b1b1b"/><rect x="162" y="112" width="8" height="30" rx="3.5" fill="#1b1b1b"/>
  <rect x="148" y="139" width="11" height="5" rx="2" fill="#fff"/><rect x="161" y="139" width="11" height="5" rx="2" fill="#fff"/>
  <rect x="148" y="102" width="24" height="13" rx="4" fill="#222"/>
  <rect x="145" y="76" width="30" height="31" rx="9" fill="${kc}"/><path d="M145 90h30" stroke="rgba(0,0,0,.25)" stroke-width="3"/>
  <g id="armsDown"><path d="M147 82l-11 20" stroke="${kc}" stroke-width="7" stroke-linecap="round"/><path d="M173 82l11 20" stroke="${kc}" stroke-width="7" stroke-linecap="round"/><circle cx="135" cy="104" r="5" fill="#fff"/><circle cx="185" cy="104" r="5" fill="#fff"/></g>
  <g id="armsUp" opacity="0"><path d="M149 80l-3-34" stroke="${kc}" stroke-width="7" stroke-linecap="round"/><path d="M171 80l3-34" stroke="${kc}" stroke-width="7" stroke-linecap="round"/><circle cx="146" cy="43" r="5.5" fill="#fff"/><circle cx="174" cy="43" r="5.5" fill="#fff"/></g>
  <circle cx="160" cy="68" r="8.5" fill="#c98a5e"/><path d="M151.5 66a8.5 8.5 0 0 1 17 0z" fill="#2a1a10"/>
  </g></g>
 <g id="mark" opacity="0"><circle r="8" fill="none" stroke="#fff" stroke-width="1.5"/></g>
 <ellipse id="bshadow" cx="160" cy="203" rx="9" ry="2.5" fill="rgba(0,0,0,.45)"/>
 <g id="ball" style="transform:translate(160px,196px) scale(1.25)"><circle r="7" fill="#fff"/><path d="M0-3.2l3 2.2-1.1 3.4h-3.8L-3-1z" fill="#1d1d1d"/><path d="M0-7v3.8M6.7-2.2l-3.7 1.2M4.1 5.7L1.9 2.4M-4.1 5.7l2.2-3.3M-6.7-2.2L-3 -1" stroke="#1d1d1d" stroke-width="1"/></g>
 <g id="shooter" style="transform-box:view-box;transform-origin:130px 210px"><circle cx="128" cy="184" r="9.5" fill="#2a1a10"/><rect x="113" y="194" width="30" height="40" rx="9" fill="${sc}"/><text x="128" y="221" text-anchor="middle" font-family="Saira Condensed,Arial Narrow,sans-serif" font-weight="800" font-size="17" fill="${sc2}">${esc(o.shirt||'')}</text></g>
 </svg>`;
}
function diveParams(z){
 // rotação e deslocamento para as luvas chegarem ao alvo da zona
 const[tx,ty]=PKZ[z];const col=z%3,top=z<3;
 if(col===1)return top?{r:0,dx:0,dy:-6,up:true,hand:[160,46]}:{r:0,dx:0,dy:3,up:false,hand:[160,110]};
 const r=(col===0?-1:1)*(top?62:88);const th=r*Math.PI/180;
 const hx=KO.x+63*Math.sin(th),hy=KO.y-63*Math.cos(th);
 return{r,dx:tx-hx,dy:ty-hy,up:true,hand:[tx,ty]};
}
function anim(el,frames,opt){if(!el)return Promise.resolve();if(reduced||opt.instant){const f=frames[frames.length-1];for(const k in f)el.style[k]=f[k];return Promise.resolve()}const a=el.animate(frames,{fill:'forwards',...opt});return a.finished.catch(()=>{})}
function mountScene(host,o){
 host.innerHTML=sceneSVG(o);const svg=host.querySelector('svg');const $=s=>svg.querySelector(s);
 const sc={
  pick(mode){return new Promise(res=>{const d=$('#dots');d.style.display='';d.querySelectorAll('.zdot').forEach(g=>{g.classList.toggle('save',mode==='save');const go=()=>{d.style.display='none';res(+g.dataset.z)};g.onclick=go;g.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}}})})},
  hideDots(){$('#dots').style.display='none'},
  async kick(shot,dive,res,fast){
   const sp=fast?.55:1;const kp=$('#kp'),ball=$('#ball'),sh=$('#shooter'),sw=$('#bshadow');
   // corrida
   await anim(sh,[{transform:'translate(0px,0px)'},{transform:'translate(14px,-6px)'},{transform:'translate(22px,-10px) rotate(-6deg)'}],{duration:420*sp,easing:'ease-in'});
   const dp=diveParams(dive);
   let[tx,ty]=PKZ[shot];let end=null,extra=null;
   if(res==='fora'){const post=ch(.4);if(post){const side=shot%3===0?42:shot%3===2?278:(ch(.5)?42:278);if(shot%3===1&&shot<3){tx=160;ty=29}else{tx=side;ty=shot<3?50:110}extra=[tx+(tx<160?24:tx>160?-24:0),ty+60]}else{if(shot<3){ty=8;tx=tx+(shot%3-1)*12}else{tx=shot%3===0?24:shot%3===2?296:tx;ty=shot%3===1?20:ty}}}
   if(res==='defesa'){tx=dp.hand[0];ty=dp.hand[1];if(ch(.45))extra=[tx+(tx<160?-38:38),ty+46]}
   const up=svg.querySelector('#armsUp'),dn=svg.querySelector('#armsDown');
   setTimeout(()=>{if(dp.up){up.setAttribute('opacity','1');dn.setAttribute('opacity','0')}},70*sp);
   const pk=anim(kp,[{transform:'translate(0px,0px) rotate(0deg)'},{transform:`translate(${dp.dx}px,${dp.dy}px) rotate(${dp.r}deg)`}],{duration:430*sp,easing:'cubic-bezier(.2,.7,.3,1)',delay:60*sp});
   anim(sw,[{opacity:1},{opacity:0}],{duration:200*sp});
   const pb=anim(ball,[{transform:'translate(160px,196px) scale(1.25)'},{transform:`translate(${tx}px,${ty}px) scale(.78)`}],{duration:400*sp,easing:'cubic-bezier(.3,.6,.4,1)'});
   await Promise.all([pk,pb]);
   const mk=$('#mark');mk.setAttribute('transform',`translate(${PKZ[shot][0]} ${PKZ[shot][1]})`);mk.setAttribute('opacity','.7');
   if(res==='gol'){anim($('#net'),[{transform:'translate(0,0)'},{transform:'translate(0,4px)'},{transform:'translate(0,-2px)'},{transform:'translate(0,0)'}],{duration:420*sp});await anim(ball,[{transform:`translate(${tx}px,${ty}px) scale(.78)`},{transform:`translate(${tx}px,${Math.min(136,ty+40)}px) scale(.74)`}],{duration:300*sp,easing:'ease-in'})}
   else if(extra){await anim(ball,[{transform:`translate(${tx}px,${ty}px) scale(.78)`},{transform:`translate(${extra[0]}px,${extra[1]}px) scale(.9)`}],{duration:420*sp,easing:'ease-out'})}
   await sleep(250*sp);
  },
 };
 return sc;
}
function teamColors(side){if(!side)return['#e8e8e8','#151515'];if(side.nat){const m={BRA:['#ffdf00','#0a7a3c'],ARG:['#75aadb','#ffffff'],FRA:['#1d3c8f','#ffffff'],ESP:['#c60b1e','#ffc400'],ENG:['#ffffff','#1d3c8f'],POR:['#c8102e','#0a7a3c'],GER:['#ffffff','#151515'],NED:['#ff7f00','#ffffff'],ITA:['#1f5fbf','#ffffff'],URU:['#5cacee','#151515'],USA:['#ffffff','#1d3c8f'],MEX:['#0a7a3c','#ffffff']};return m[side.id]||['#e8e8e8','#151515']}const c=CLUB[side.id]||side;return[c.c1||'#e8e8e8',c.c2||'#151515']}
function inkFor(bg,fg){return pickInk(bg)===pickInk(fg)?pickInk(bg):fg}

IO_UI.penalty=function(o){
 return new Promise(async resolve=>{
  $ov.hidden=false;const save=o.mode==='save';
  const[sc1,sc2]=save?teamColors(o.them):teamColors(o.us);
  $ov.innerHTML=`<div class="ovwrap pk"><div class="eyebrow">${esc(o.comp)} · ${o.min}'</div><h2 class="pkh">${save?`Pênalti contra! Você no gol`:`Pênalti! A bola é sua`}</h2>
  <p class="muted" style="margin:4px 0 0">${save?`${esc(o.taker||'O batedor')} ajeita a bola. Toque onde você vai pular.`:'Toque no ponto onde vai bater. Alto no canto é indefensável, mas é fácil isolar.'}</p>
  <div class="scenebox" id="scn"></div><div class="pkres" id="pkr"></div><div id="pkc"></div></div>`;
  const sc=mountScene(document.getElementById('scn'),{keeperColor:save?'#c6f432':'#55d0ff',shooterColor:sc1,shooterColor2:inkFor(sc1,sc2),shirt:save?'':S.shirt,dotMode:save?'save':'shoot'});
  const z=await sc.pick(save?'save':'shoot');let shot,dive,res;
  if(save){dive=z;shot=aiShot();res=gkSave(shot,dive)}else{shot=z;dive=aiDive();res=kickOutcome(shot,dive,CA().FIN,(55-S.life.cab)/400)}
  await sc.kick(shot,dive,res);
  const good=save?res!=='gol':res==='gol';
  document.getElementById('pkr').innerHTML=`<span class="${good?'good':'bad'}">${res==='gol'?(save?'Gol deles':'GOL!'):res==='defesa'?(save?'DEFENDEU!':'O goleiro pegou'):(save?'Pra fora!':'Pra fora')}</span>`;
  document.getElementById('pkc').innerHTML='<button class="btn wide" id="pkok" style="margin-top:12px">Continuar</button>';
  const b=document.getElementById('pkok');b.focus({preventScroll:true});b.onclick=()=>{$ov.hidden=true;$ov.innerHTML='';resolve({goal:res==='gol',res})};
 });
};

IO_UI.shootout=function(o){
 return new Promise(async resolve=>{
  $ov.hidden=false;
  const pu=clamp(.74+(o.usS-o.themS)/120,.6,.86),pt=clamp(.74+(o.themS-o.usS)/120,.6,.86);
  const usR=sideRoster(o.us).filter(p=>p.pos!=='GOL'&&p.n!==S.name);
  const thR=sideRoster(o.them).filter(p=>p.pos!=='GOL');
  const usT=shuffle(usR).slice(0,12).map(p=>p.n),thT=shuffle(thR).slice(0,12).map(p=>p.n);
  const[uc1,uc2]=teamColors(o.us),[tc1,tc2]=teamColors(o.them);
  let myIdx=-1;let fast=false;
  const ku=[],kt=[];let a=0,b=0;
  const board=()=>`<div class="tally">${[[o.us,ku,a],[o.them,kt,b]].map(([sd,k,n])=>`<div>${shieldHTML(sd,'sm')}<b style="flex:1;text-align:left;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(sd.n)}</b><span class="k">${Array.from({length:Math.max(5,k.length)},(_,i)=>`<i class="${k[i]===undefined?'':k[i]?'g':'m'}"></i>`).join('')}</span><b class="mono" style="font-size:20px">${n}</b></div>`).join('')}</div>`;
  const frame=(msg,sub)=>{$ov.innerHTML=`<div class="ovwrap pk"><div class="eyebrow">${esc(o.comp)} · ${esc(o.round)}</div><h2 class="pkh">Disputa de pênaltis</h2>${board()}
   <div class="pkmsg"><b>${msg}</b>${sub?`<span class="muted">${sub}</span>`:''}</div><div class="scenebox" id="scn"></div><div class="pkres" id="pkr"></div><div id="pkc"></div>
   <div class="row" style="justify-content:center;margin-top:8px"><button class="btn ghost small" id="pkfast">${fast?'Rápido ligado':'Acelerar'}</button></div></div>`;
   const f=document.getElementById('pkfast');f.onclick=()=>{fast=true;f.textContent='Rápido ligado'}};
  // escolher a ordem
  if(o.iAmIn&&!o.isGK){
   myIdx=await new Promise(r=>{$ov.innerHTML=`<div class="ovwrap pk"><div class="eyebrow">${esc(o.comp)} · ${esc(o.round)}</div><h2 class="pkh">Vai pros pênaltis</h2>${board()}
    <p class="muted" style="margin:10px 0 12px">Em que ordem você bate? O primeiro tem menos pressão. O quinto pode decidir tudo.</p>
    <div class="order">${[1,2,3,4,5].map(n=>`<button class="ordbtn" data-o="${n-1}"><b>${n}º</b><span>${['Abre a série','Segundo','Meio da série','Quarto','A cobrança decisiva'][n-1]}</span></button>`).join('')}</div>
    <button class="btn ghost small" data-o="-1" style="margin-top:10px">Não quero bater</button></div>`;
    $ov.querySelectorAll('[data-o]').forEach(bt=>bt.onclick=()=>r(+bt.dataset.o))});
  }
  const kickOne=async(ours,idx)=>{
   const meKick=ours&&idx===myIdx;const meSave=!ours&&o.isGK;
   const taker=ours?(meKick?S.name:usT[idx%usT.length]):thT[idx%thT.length];
   const[c1,c2]=ours?[uc1,uc2]:[tc1,tc2];
   frame(`${idx+1}ª cobrança · ${esc(ours?o.us.n:o.them.n)}`,meKick?'Sua vez. Escolha o canto.':meSave?`${esc(taker)} vai bater. Você no gol: escolha o lado.`:`${esc(taker)} vai bater.`);
   const sc=mountScene(document.getElementById('scn'),{keeperColor:ours?'#55d0ff':'#c6f432',shooterColor:c1,shooterColor2:inkFor(c1,c2),shirt:meKick?S.shirt:'',dotMode:meSave?'save':'shoot'});
   let shot,dive,res;
   if((meKick||meSave)&&typeof nssMoment==='function'){const sk=k=>typeof skillOf==='function'?skillOf(k):.6;
    const rr=await nssMoment({kind:meKick?'pen':'keeper',pen:true,comp:o.comp,title:meKick?`${idx+1}ª cobrança: sua vez`:`${taker} vai bater`,skill:meKick?clamp(sk('FIN')-(55-S.life.cab)/300-(idx>=4?.05:0),.15,.95):sk('REF'),keeper:.5,okTxt:meKick?'GOL!':'DEFENDEU!'});
    const last=NM.last||'';res=meKick?(rr.ok?'gol':/segurou|Espalmou/.test(last)?'defesa':'fora'):(rr.ok?'defesa':/fora/i.test(last)?'fora':'gol');
    $ov.hidden=false;frame(`${idx+1}ª cobrança · ${esc(ours?o.us.n:o.them.n)}`,meKick?'Sua cobrança':'Você no gol');const sn=document.getElementById('scn');if(sn)sn.remove();
    const g=res==='gol';const good=ours?g:!g;document.getElementById('pkr').innerHTML=`<span class="${good?'good':'bad'}">${g?'GOL':res==='defesa'?'DEFENDEU':'PRA FORA'}</span>`;await sleep(800);return g}
   if(meKick){shot=await sc.pick('shoot');dive=aiDive();const press=(55-S.life.cab)/300+(idx>=4?.03:0);res=kickOutcome(shot,dive,CA().FIN,press)}
   else if(meSave){dive=await sc.pick('save');shot=aiShot();res=gkSave(shot,dive)}
   else{sc.hideDots();await sleep(fast?120:420);shot=aiShot();dive=aiDive();const p=ours?pu:pt;const want=ch(p);
    // escolhe um resultado coerente com a probabilidade
    res=want?'gol':(ch(.6)?'defesa':'fora');if(res==='gol'&&dive===shot)dive=(shot+2)%6;if(res==='defesa')dive=shot}
   await sc.kick(shot,dive,res,fast&&!meKick&&!meSave);
   const g=res==='gol';const good=ours?g:!g;
   document.getElementById('pkr').innerHTML=`<span class="${good?'good':'bad'}">${g?'GOL':res==='defesa'?'DEFENDEU':'PRA FORA'}</span>`;
   await sleep(meKick||meSave?900:(fast?250:650));
   return g;
  };
  const early=()=>{const ru=Math.max(0,5-ku.length),rt=Math.max(0,5-kt.length);return a>b+rt||b>a+ru};
  for(let r=0;r<30;r++){
   const g=await kickOne(true,r);ku.push(g);a+=g;if(r<5&&early())break;
   const h=await kickOne(false,r);kt.push(h);b+=h;
   if(r<5){if(early())break;if(r===4&&a!==b)break}else if(a!==b)break;
  }
  if(a===b)a++;
  const win=a>b;
  frame(win?'Vocês venceram nos pênaltis!':'Eliminados nos pênaltis.','');
  document.getElementById('scn').remove();
  document.getElementById('pkr').innerHTML=`<span class="${win?'good':'bad'}" style="font-size:56px">${a}–${b}</span>`;
  document.getElementById('pkc').innerHTML='<button class="btn wide" id="pkok" style="margin-top:12px">Continuar</button>';
  const bt=document.getElementById('pkok');bt.focus({preventScroll:true});bt.onclick=()=>{$ov.hidden=true;$ov.innerHTML='';resolve({win,a,b})};
 });
};

// ================== AO VIVO ==================
const LIVE_TXT={
 c_us:['{w} chuta e a bola passa raspando a trave','Defesa do goleiro em chute de {w}','{w} acerta o travessão!','Cabeçada de {w} pra fora','{w} arrisca de longe, pra fora'],
 c_th:['{w} assusta: chute pra fora','Que defesa! O goleiro tira o chute de {w}','{w} carimba a trave','Bola cruzada na área, ninguém completa'],
};
IO_UI.live={
 async start(m){
  const L={m,min:0,gu:0,gt:0,feed:[],flashMsg:'',ended:false};
  const speedMs=()=>({1:430,3:130,0:0})[S.liveSpeed??1]||0;const slow=()=>(S.liveSpeed??1)===1?1:(S.liveSpeed??1)===3?.35:0;
  const draw=()=>{
   $ov.hidden=false;const us=m.us,th=m.them;const home=m.neutral?true:m.home;
   const H=home?us:th,A=home?th:us;const hg=home?L.gu:L.gt,ag=home?L.gt:L.gu;
   $ov.innerHTML=`<div class="ovwrap live"><div class="row" style="justify-content:space-between"><span class="eyebrow">${esc(m.o.comp)} · ${esc(m.o.label)}</span><span class="livetag"><i></i>AO VIVO</span></div>
   <div class="score"><div class="team">${shieldHTML(H,'lg')}<span>${esc(H.n)}</span></div><div class="num mono"><span id="lh">${hg}</span>–<span id="la">${ag}</span></div><div class="team">${shieldHTML(A,'lg')}<span>${esc(A.n)}</span></div></div>
   ${m.agg?`<div class="mono muted" style="font-size:13px">Ida: ${m.agg[0]}–${m.agg[1]} pra ${esc(us.n)} · agregado <span id="lagg">${m.agg[0]+L.gu}–${m.agg[1]+L.gt}</span></div>`:''}
   <div class="clockbar"><i id="lbar" style="width:${L.min/90*100}%"></i></div><div class="clock" id="lclk">${L.ended?'Fim de jogo':L.min+"'"}</div>
   <div class="lmsg" id="lmsg">${esc(L.flashMsg)}</div>
   <div class="feed live-feed" id="lfeed">${L.feed.slice(0,8).map(f=>f).join('')}</div>
   <div id="lend"></div>
   <div class="row speed" style="justify-content:center">${[[1,'Normal'],[3,'Rápido'],[0,'Pular pro fim']].map(([k,n])=>`<button class="tab ${(S.liveSpeed??1)===k?'on':''}" data-sp="${k}">${n}</button>`).join('')}</div></div>`;
   $ov.querySelectorAll('[data-sp]').forEach(b=>b.onclick=()=>{S.liveSpeed=+b.dataset.sp;$ov.querySelectorAll('[data-sp]').forEach(x=>x.classList.toggle('on',x===b))});
  };
  const setMin=n=>{L.min=n;const c=document.getElementById('lclk'),b=document.getElementById('lbar');if(c)c.textContent=n+"'";if(b)b.style.width=(n/90*100)+'%'};
  const push=(html)=>{L.feed.unshift(html);const f=document.getElementById('lfeed');if(f){f.insertAdjacentHTML('afterbegin',html);while(f.children.length>8)f.lastElementChild.remove()}};
  draw();
  const api={
   async until(t){while(L.min<t){let ms=speedMs();setMin(L.min+1);if(L.min>=80)ms*=1.5;if(L.min===45){api.flash('Intervalo');push(`<div class="fl ht">Intervalo · ${L.gu}–${L.gt}</div>`);await sleep(2600*slow());api.flash('Começa o segundo tempo')}if(L.min===90){api.flash('Acréscimos… o juiz olha o relógio');await sleep(1800*slow())}if(ms)await sleep(ms)}},
   flash(t){L.flashMsg=t;const e=document.getElementById('lmsg');if(e)e.textContent=t},
   redraw(){L.flashMsg='';draw()},
   async event(e,gu,gt){
    const ms=speedMs();const k=slow();const mine=e.mine;const side=e.us?m.us.n:m.them.n;let html='',pause=1200*k;
    if(k&&(e.t==='g'||e.t==='c')){const box=document.getElementById('lmsg');const build=e.us?(mine?['A bola sobra pra você na área…','Você arranca em velocidade…','Você recebe livre na entrada da área…']:[`${side} chega com perigo…`,`Contra-ataque rápido do ${side}…`,`Bola levantada na área do adversário…`]):[`${side} ataca pelo meio…`,`Perigo! ${side} entra na área…`,`Contra-ataque do ${side}…`];api.flash(pick(build));if(box)box.classList.add('tense');await sleep((e.t==='g'?2200:1500)*k);if(box)box.classList.remove('tense');api.flash('')}
    if(e.t==='g'){L.gu=gu;L.gt=gt;const home=m.neutral?true:m.home;const hg=home?gu:gt,ag=home?gt:gu;const h=document.getElementById('lh'),a=document.getElementById('la');if(h){h.textContent=hg;a.textContent=ag}
     const ag2=document.getElementById('lagg');if(ag2&&m.agg)ag2.textContent=`${m.agg[0]+gu}–${m.agg[1]+gt}`;
     html=`<div class="fl gl ${e.us?'us':'th'} ${mine?'me':''}"><b>${e.m}'</b>⚽ GOL${e.us?'':' deles'}! ${esc(e.w)}${e.ast?' <span class="muted">(sua assistência)</span>':''}</div>`;pause=3000*k;api.flash(e.us?(mine?'GOOOOL! É SEU!':`GOL do ${side}!`):`Gol do ${side}…`);
     const box=$ov.querySelector('.ovwrap');if(box&&!reduced){box.classList.remove('goalflash','bad');void box.offsetWidth;box.classList.add('goalflash');if(!e.us)box.classList.add('bad')}}
    else if(e.t==='c'&&e.missed)html=`<div class="fl me bad"><b>${e.m}'</b>Você perdeu a chance!</div>`;
    else if(e.t==='c'){const pool=e.us?LIVE_TXT.c_us:LIVE_TXT.c_th;html=`<div class="fl ${mine?'me':''}"><b>${e.m}'</b>${esc(pick(pool).replace('{w}',e.w))}</div>`}
    else if(e.t==='y')html=`<div class="fl me"><b>${e.m}'</b>🟨 Amarelo pra você</div>`;
    else if(e.t==='r'){html=`<div class="fl me bad"><b>${e.m}'</b>🟥 Você foi expulso!</div>`;pause=2200*k}
    else if(e.t==='inj')html=`<div class="fl me bad"><b>${e.m}'</b>🚑 Você sentiu e pediu substituição</div>`;
    else if(e.t==='in')html=`<div class="fl me"><b>${e.m}'</b>🔁 Você entra em campo</div>`;
    else if(e.t==='pmiss')html=`<div class="fl ${e.mine?'me bad':''}"><b>${e.m}'</b>❌ Pênalti perdido por ${esc(e.w)}</div>`;
    else if(e.t==='gks')html=`<div class="fl me"><b>${e.m}'</b>🧤 Que defesa! Você parou ${esc(e.w)}</div>`;
    else if(e.t==='psave')html=`<div class="fl ${e.mine?'me':''}"><b>${e.m}'</b>🧤 Pênalti defendido! ${esc(e.w)} parou no goleiro</div>`;
    if(html){const sd=(e.us||e.mine||['y','r','inj','in','gks'].includes(e.t))?m.us:m.them;const tc=teamColors(sd);const ab=esc((sd.a||sd.n||'').slice(0,3).toUpperCase());html=html.replace('<div class="fl','<div style="--tc:'+tc[0]+';--tc2:'+tc[1]+'" class="fl tm').replace(/(<b>\d+'<\/b>)/,'$1<span class="tmb">'+ab+'</span>');push(html);if(pause)await sleep(pause)}
   },
   finish(f){
    return new Promise(res=>{L.ended=true;const c=document.getElementById('lclk');if(c)c.textContent='Fim de jogo';
     const end=document.getElementById('lend');const cls=f.win===true?'good':f.win===false?'bad':'';
     if(end)end.innerHTML=`${f.agg?`<div class="mono muted">Agregado ${f.agg[0]}–${f.agg[1]}</div>`:''}<h3 class="lfin ${cls}">${esc(f.msg)}</h3><button class="btn wide" id="lok">Continuar</button>`;
     const sp=$ov.querySelector('.speed');if(sp)sp.remove();
     const b=document.getElementById('lok');if(!b){res();return}b.focus({preventScroll:true});b.onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res()}});
   },
  };
  return api;
 }
};

// ================== CERIMÔNIAS ==================
function nomCard(n,cls=''){const c=n.club?CLUB[n.club]:null;return`<div class="nom ${cls} ${n.me?'me':''}">${c?shieldHTML(c):''}<div class="nomtxt"><b>${n.f||''} ${esc(n.n)}</b><span>${c?esc(c.n):''}</span></div></div>`}
function ceremonyUI(c){
 return new Promise(async res=>{
  $ov.hidden=false;
  const done=()=>{const b=document.getElementById('cerOk');b.disabled=false;b.scrollIntoView({block:'end',behavior:reduced?'auto':'smooth'});b.focus({preventScroll:true});b.onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res()}};
  if(c.k==='bola'){
   const yr=S.year;
   $ov.innerHTML=`<div class="ovwrap cer bola"><div class="spot"></div><div class="eyebrow">Cerimônia da Bola de Ouro · ${yr}</div><h2 class="pkh">Os 10 melhores do mundo</h2>
   <div class="rank10" id="r10"></div><div class="reveal" id="rev"></div><button class="btn wide" id="cerOk" disabled style="margin-top:12px">Continuar</button></div>`;
   const r10=document.getElementById('r10');
   for(let i=9;i>=3;i--){const n=c.top10[i];if(!n)continue;r10.insertAdjacentHTML('afterbegin',`<div class="r10row ${n.me?'me':''}"><b class="mono">${i+1}º</b><span class="r10n">${n.f||''} ${esc(n.n)}</span><span class="r10c">${n.club&&CLUB[n.club]?esc(CLUB[n.club].n):''}</span></div>`);await sleep(n.me?900:380)}
   const rev=document.getElementById('rev');
   for(const i of[2,1]){const n=c.top10[i];rev.innerHTML=`<div class="drum">${i+1}º lugar…</div>`;await sleep(1100);r10.insertAdjacentHTML('afterbegin',`<div class="r10row podium ${n.me?'me':''}"><b class="mono">${i+1}º</b><span class="r10n">${n.f||''} ${esc(n.n)}</span><span class="r10c">${n.club&&CLUB[n.club]?esc(CLUB[n.club].n):''}</span></div>`);rev.innerHTML='';await sleep(n.me?1000:500)}
   rev.innerHTML=`<div class="drum">E a Bola de Ouro ${yr} vai para…</div>`;rev.scrollIntoView({block:'center'});await sleep(1800);
   const w=c.top10[0];
   rev.innerHTML=`<div class="winner ${w.me?'me':''}"><div class="tro rise">${TROPHY('bola',{n:'Bola de Ouro'})}</div>${nomCard(w,'big')}${w.me?'<h3 class="champ">VOCÊ É O MELHOR DO MUNDO</h3>':''}</div>`;
   rev.scrollIntoView({block:'center',behavior:reduced?'auto':'smooth'});
   if(w.me)confetti($ov,['#f2c443','#fff4c4','#e2ad34','#ffffff'],5200);
   done();return;
  }
  $ov.innerHTML=`<div class="ovwrap cer"><div class="spot"></div><div class="eyebrow">${esc(c.sub||'Premiação')}</div><h2 class="pkh">${esc(c.title)}</h2>${c.stat?`<div class="muted mono" style="font-size:13px">${esc(c.stat)}</div>`:''}
  <div class="noms">${c.noms.map((n,i)=>`<div class="nomwrap" data-i="${i}">${nomCard(n)}</div>`).join('')}</div>
  <div class="reveal" id="rev"><div class="drum">E o vencedor é…</div></div><button class="btn wide" id="cerOk" disabled style="margin-top:12px">Continuar</button></div>`;
  await sleep(1600);
  const wi=c.noms.findIndex(n=>n.n===c.winner);const w=c.noms[wi];
  $ov.querySelectorAll('.nomwrap').forEach((el,i)=>el.classList.add(i===wi?'win':'lose'));
  document.getElementById('rev').innerHTML=`<div class="winner ${w.me?'me':''}"><div class="tro rise small">${TROPHY(c.ic,{n:c.title})}</div>${w.me?'<h3 class="champ">É SEU!</h3>':`<div class="muted">${esc(w.n)} levou. Fica pra próxima.</div>`}</div>`;
  if(w.me)confetti($ov,['#f2c443','#fff4c4','#ffffff'],3600);
  done();
 });
}
async function runSeasonEndShow(ls){
 for(const c of ls.cer||[])await ceremonyUI(c);
 const seen=new Set(ls.celebrated||[]);
 for(const t of ls.titles){if(seen.has(t.n))continue;seen.add(t.n);await celebrateUI(t)}
 for(const n of ls.news||[])if(n.t==='promo')await milestoneUI({k:'promo',title:'PARABÉNS, VOCÊ É PROFISSIONAL!',sub:'Promovido ao time principal do '+CLUB[n.club].n,lines:['Contrato profissional assinado','Agora você joga as competições do time de cima','A partir de agora você treina com o time principal']});
 if(!ls.youthSeason&&ls.myMove&&ls.myMove.dir==='up'&&!(ls.celebrated||[]).includes('__acesso'))await celebrateUI({t:'acesso',n:`Acesso à ${LG[ls.myMove.to].n}`,club:ls.row.club});
}
