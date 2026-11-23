// ================== PACOTINHOS: CHUTEIRAS, PEDAÇOS E VISUAL ==================
// Pacotes comprados com dinheiro do jogo (ou gemas 💠, que você ganha jogando). Cada carta é uma chuteira inteira,
// pedaços de uma chuteira (junte todos e ela é montada) ou um item de visual: uniforme especial do time, meião,
// segunda pele e faixa. Chuteira de pacote é sua pra sempre (não gasta) e sobe de nível quando vem repetida.
// As chances de cada raridade ficam abertas na tela do pacote. Não existe compra com dinheiro de verdade.
const PK_RAR=[{n:'Comum',c:'#9aa8a1',g:'#56625c'},{n:'Rara',c:'#3d9bff',g:'#123f7a'},{n:'Épica',c:'#b26bff',g:'#4a1f7d'},{n:'Lendária',c:'#ffc83d',g:'#7a5300'},{n:'Ícone',c:'#25f0a8',g:'#0b6b4a'}];
const PK_FRAG=[4,6,8,12,20];
const PK_BR=[
 ['tro','Trovão',[.25,.5,.25],'#ff3b30','bolt',['canhao','mira','faro']],['fol','Folha Seca',[.2,.2,.6],'#34c759','swirl',['curva','mira','faro']],
 ['rai','Raio',[.6,.15,.25],'#ffd400','bolt',['faro','mira','canhao']],['cra','Craque',[.34,.33,.33],'#1fa3ff','star',['mira','curva','faro']],
 ['mur','Muralha',[.2,.55,.25],'#7d8590','shield',['muralha','canhao','mira']],['fen','Fenômeno',[.42,.36,.22],'#ff7a2b','star',['faro','canhao','curva']],
 ['mae','Maestro',[.15,.25,.6],'#7b5cff','wave',['mira','curva','faro']],['gin','Ginga',[.42,.1,.48],'#ff2fa0','wave',['curva','faro','mira']],
 ['pan','Pantera',[.5,.3,.2],'#1d1f24','chev',['canhao','faro','mira']],['cob','Cobra',[.35,.2,.45],'#3ccf8e','swirl',['mira','curva','canhao']],
 ['fur','Furacão',[.45,.4,.15],'#00c2ff','chev',['canhao','faro','curva']],['rei','Rei',[.3,.3,.4],'#f2c443','shield',['faro','mira','curva']]];
const PK_MOD=[['Street',0],['Treino',0],['Pro',1],['Velocity',1],['Turbo',2],['Elite',2],['Ultra',3],['Supreme',3]];
const PK_WAY=[['Original',null,null],['Noturna','#151a24','#3a4252'],['Neon','#c6ff1a','#111'],['Ártica','#eaf5ff','#7fb8e6'],['Sangue','#b3001b','#1a0005'],['Carbono','#2b2f36','#9aa3ad'],['Oceano','#0b5fa5','#7fe3ff'],['Pôr do sol','#ff7a2b','#ffd23c']];
const PK_TOT=[10,18,27,36,48];
const PK_BOOTS=(()=>{const L=[];PK_BR.forEach(([bk,bn,pr,col,mk,abs],bi)=>{
 const mk1=(id,n,r,c1,c2,way)=>{const T=PK_TOT[r]+((bi*7+n.length)%3)-1;const v=Math.max(1,Math.round(T*pr[0])),f=Math.max(1,Math.round(T*pr[1])),t=Math.max(1,T-v-f);
  L.push({id,n,brand:bk,bn,r,vel:v,for:f,tec:t,ab:abs.slice(0,[0,1,1,2,3][r]),col:c1,c2,mk,way,ic:'👟',pk:true})};
 PK_MOD.forEach(([mn,r],mi)=>{for(let j=0;j<3;j++){const w=PK_WAY[(bi+mi+j*3)%PK_WAY.length];const c1=w[1]||col,c2=w[2]||(col==='#1d1f24'?'#f2f2f2':'#ffffff');mk1(`${bk}-${mi}-${j}`,`${bn} ${mn}${w[1]?' '+w[0]:''}`,r,c1,c2,w[0])}});
 mk1(`${bk}-x`,`${bn} Ícone`,4,'#0f1512',col,'Ícone')});return L})();
const PK_COS=(()=>{const L=[];const add=(slot,id,n,r,a)=>L.push({slot,id:slot+'-'+id,n,r,...a});
 [['ouro','Edição Ouro',3,{s:'#d9b23a',s2:'@1',sh:'#1b1b1b',so:'#d9b23a'}],['black','Black',2,{s:'#141414',s2:'@1',sh:'#141414',so:'#141414'}],['branca','Toda Branca',1,{s:'#f4f4f4',s2:'@1',sh:'#f4f4f4',so:'#f4f4f4'}],
  ['retro','Retrô',1,{s:'@1',s2:'#ffffff',sh:'#ffffff',so:'@1'}],['neon','Neon',2,{s:'#c6ff1a',s2:'#111111',sh:'#111111',so:'#c6ff1a'}],['camu','Camuflada',2,{s:'#4b5d3a',s2:'#c9b98a',sh:'#2f3a24',so:'#4b5d3a'}],
  ['carnaval','Carnaval',3,{s:'#ff2fa0',s2:'#ffd400',sh:'#1a0a3a',so:'#ff2fa0'}],['esmeralda','Esmeralda',3,{s:'#0f7a52',s2:'#ffd23c',sh:'#06281b',so:'#0f7a52'}],['gelo','Gelo',1,{s:'#bfe6ff',s2:'#0b3b66',sh:'#0b3b66',so:'#bfe6ff'}],
  ['lava','Lava',2,{s:'#ff4a1a',s2:'#2a0a00',sh:'#2a0a00',so:'#ff4a1a'}],['galaxia','Galáxia',3,{s:'#2b1b5c',s2:'#9be7ff',sh:'#120a2a',so:'#2b1b5c'}],['vinho','Vinho',0,{s:'#6b1028',s2:'#f2d3a0',sh:'#3a0814',so:'#6b1028'}],
  ['verdeamarela','Verde-amarela',2,{s:'#ffd400',s2:'#119a3c',sh:'#1340a8',so:'#ffffff'}],['treino','Treino',0,{s:'#3a4652',s2:'@1',sh:'#232b33',so:'#3a4652'}],['grafite','Grafite',0,{s:'#4a4f57',s2:'#ffffff',sh:'#4a4f57',so:'#4a4f57'}],
  ['diamante','Diamante',4,{s:'#e8fbff',s2:'#25f0a8',sh:'#0b2a36',so:'#e8fbff'}]].forEach(([id,n,r,k])=>add('kit',id,n,r,{k}));
 [['branco','Branco',0,'#f2f2f2'],['preto','Preto',0,'#141414'],['vermelho','Vermelho',0,'#d6262e'],['azul','Azul',0,'#1f5fd8'],['amarelo','Amarelo',1,'#ffd400'],['rosa','Rosa choque',1,'#ff2fa0'],['laranja','Laranja',1,'#ff7a2b'],['neon','Neon',2,'#c6ff1a'],['roxo','Roxo',2,'#7b2cbf'],['ouro','Dourado',3,'#d9b23a'],['ciano','Ciano',2,'#00e1ff'],['esm','Esmeralda',4,'#25f0a8']].forEach(([id,n,r,c])=>add('socks',id,`Meião ${n}`,r,{c}));
 [['branca','Branca',0,'#f2f2f2'],['preta','Preta',0,'#141414'],['cinza','Cinza',0,'#7d8590'],['azul','Azul',1,'#1f5fd8'],['vermelha','Vermelha',1,'#d6262e'],['neon','Neon',2,'#c6ff1a'],['roxa','Roxa',2,'#7b2cbf'],['dourada','Dourada',3,'#d9b23a'],['ciano','Ciano',2,'#00e1ff'],['esm','Esmeralda',4,'#25f0a8']].forEach(([id,n,r,c])=>add('tee',id,`Segunda pele ${n}`,r,{c}));
 [['branca','Branca',0,'#ffffff'],['preta','Preta',0,'#141414'],['vermelha','Vermelha',1,'#d6262e'],['azul','Azul',1,'#1f5fd8'],['rosa','Rosa',1,'#ff2fa0'],['neon','Neon',2,'#c6ff1a'],['laranja','Laranja',2,'#ff7a2b'],['dourada','Dourada',3,'#d9b23a'],['arco','Arco-íris',3,'#ff3bd4'],['esm','Esmeralda',4,'#25f0a8']].forEach(([id,n,r,c])=>add('band',id,`Faixa ${n}`,r,{c}));
 return L})();
const PK_SLOT={kit:['👕','Uniforme especial','O time inteiro usa nos seus lances'],socks:['🧦','Meião','Só o seu jogador'],tee:['🦾','Segunda pele','Manga por baixo da camisa'],band:['🎀','Faixa','Faixa no cabelo']};
// pacotes: cartas, preço em dinheiro do jogo (milhões) e/ou gemas, chance de cada raridade e de cada tipo de carta
const PK_PACKS=[
 {id:'bronze',n:'Bronze',ic:'🥉',k:3,p:.03,g:8,odds:[70,24,5,1,0],mix:[35,45,20],cl:['#b8743c','#5a3216']},
 {id:'prata',n:'Prata',ic:'🥈',k:4,p:.15,g:20,odds:[48,35,13,3.5,.5],mix:[40,40,20],cl:['#c9d3dc','#4f5b66']},
 {id:'ouro',n:'Ouro',ic:'🥇',k:5,p:.8,g:45,odds:[22,40,26,10,2],mix:[45,35,20],min:2,cl:['#ffd65a','#8a5a00']},
 {id:'lenda',n:'Lendário',ic:'💎',k:5,p:4,g:110,odds:[0,28,46,21,5],mix:[55,30,15],min:3,cl:['#25f0a8','#0b4a36']},
 {id:'kit',n:'Visual',ic:'👕',k:3,p:.25,g:15,odds:[42,36,16,5,1],mix:[0,0,100],cl:['#ff7ad9','#4a1050']}];
function pkN(){const n=S.n;if(!n.pk)n.pk={own:{},frag:{},cos:[],eq:{},free:0,games:0,opened:0,pity:0,gift:false};n.gems=n.gems||0;return n.pk}
function pkBoot(id){return PK_BOOTS.find(b=>b.id===id)}
function pkCos(id){return PK_COS.find(c=>c.id===id)}
function pkWR(w){const t=w.reduce((s,x)=>s+x,0);let r=Math.random()*t;for(let i=0;i<w.length;i++){r-=w[i];if(r<=0)return i}return w.length-1}
function pkMoneyOk(p){return S.din+1e-9>=p}
// chuteira do pacote calçada: mesma forma das chuteiras da loja, com nível e sem desgaste
function pkBootStats(id){const b=pkBoot(id);if(!b)return null;const lv=(pkN().own[id]||{}).lv||1;const k=(lv-1)*2;return{...b,id:'pk:'+id,pid:id,lv,vel:b.vel+k,for:b['for']+k,tec:b.tec+k,g:999}}
{const _bs=nsBootStats;nsBootStats=function(){try{const n=S.n;if(n&&typeof n.boot==='string'&&n.boot.startsWith('pk:'))return pkBootStats(n.boot.slice(3))}catch(e){}return _bs.apply(this,arguments)}}
{const _bt=nsBootTier;nsBootTier=function(b){if(b&&b.pk)return[2,4,6,8,9][b.r]+Math.floor(((b.lv||1)-1)/2);return _bt(b)}}
function pkEquip(id){const n=S.n;pkN().eq.boot=id;n.boot='pk:'+id;n.bootLeft=999;try{nsSync()}catch(e){}}
// sortear uma carta
function pkRoll(pack,forceMin){const P=pkN();let r=pkWR(pack.odds);if(forceMin!=null&&r<forceMin)r=forceMin;
 let kind=['boot','frag','cos'][pkWR(pack.mix)];
 if(kind==='cos'){const L=PK_COS.filter(c=>c.r===r);if(!L.length)kind='boot';else return{kind,id:pick(L).id,r}}
 const B=PK_BOOTS.filter(b=>b.r===r);
 if(kind==='frag'){const started=B.filter(b=>P.frag[b.id]&&!P.own[b.id]);const b=started.length&&ch(.55)?pick(started):pick(B);return{kind,id:b.id,r,q:RI(2,r>=3?4:3)+(r===4?1:0)}}
 return{kind:'boot',id:pick(B).id,r}}
function pkApply(c){const P=pkN();const n=S.n;
 if(c.kind==='boot'){const o=P.own[c.id];if(!o){P.own[c.id]={lv:1,t:Date.now()};c.isNew=true}else if(o.lv<5){o.lv++;c.up=o.lv}else{const g=[1,2,4,8,15][c.r];n.gems+=g;c.gem=g}}
 else if(c.kind==='frag'){if(P.own[c.id]){const g=[1,1,2,3,5][c.r];n.gems+=g;c.gem=g;c.dupFrag=true}else{P.frag[c.id]=(P.frag[c.id]||0)+c.q;c.have=P.frag[c.id];c.need=PK_FRAG[c.r];if(c.have>=c.need){delete P.frag[c.id];P.own[c.id]={lv:1,t:Date.now()};c.built=true;c.have=c.need}}}
 else{if(!P.cos.includes(c.id)){P.cos.push(c.id);c.isNew=true}else{const g=[1,1,2,4,8][c.r];n.gems+=g;c.gem=g}}
 return c}
function pkOpenCards(pack){const P=pkN();const out=[];for(let i=0;i<pack.k;i++)out.push(pkRoll(pack,i===pack.k-1&&pack.min!=null?pack.min:null));
 const best=Math.max(...out.map(c=>c.r));P.pity=best>=3?0:(P.pity||0)+1;
 if(P.pity>=15&&pack.mix[2]<100){out[out.length-1]=pkRoll({...pack,odds:[0,0,0,90,10]},3);P.pity=0}
 out.forEach(pkApply);P.opened=(P.opened||0)+1;out.sort((a,b)=>a.r-b.r);return out}
// desenhos
function pkBootSVG(b,w=110){const c1=b.col,c2=b.c2||'#fff',c3='#101418';const mark={bolt:`<path d="M54 26 L44 38 L52 38 L46 50 L62 34 L54 34 L60 26 Z" fill="${c2}"/>`,wave:`<path d="M34 40 Q44 30 54 40 T74 40 T94 38" stroke="${c2}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
 star:`<path d="M58 26 L61 34 L70 34 L63 39 L66 47 L58 42 L50 47 L53 39 L46 34 L55 34 Z" fill="${c2}"/>`,shield:`<path d="M40 30 L80 26 L96 34 L94 44 L42 46 Z" fill="${c2}" opacity=".9"/>`,
 swirl:`<path d="M36 44 Q50 22 66 36 Q78 46 92 32" stroke="${c2}" stroke-width="5" fill="none" stroke-linecap="round"/>`,chev:`<path d="M38 46 L52 30 L58 30 L46 46 Z M52 46 L66 30 L72 30 L60 46 Z" fill="${c2}"/>`}[b.mk]||'';
 return`<svg viewBox="0 0 124 66" width="${w}" class="pk-boot"><path d="M8 46 L116 46 Q118 53 110 54 L16 54 Q7 54 8 46 Z" fill="${c3}"/><g fill="${b.r>=3?'#ffd23c':c3}"><path d="M18 54 h7 l-1 7 h-5 z"/><path d="M33 54 h7 l-1 7 h-5 z"/><path d="M70 54 h7 l-1 7 h-5 z"/><path d="M86 54 h7 l-1 7 h-5 z"/></g>
 <path d="M10 47 L10 26 Q10 15 22 13 L36 12 Q46 18 57 13 L64 11 Q75 20 90 26 Q110 32 116 40 Q118 46 112 47 Z" fill="${c1}" stroke="rgba(0,0,0,.3)" stroke-width="1.5"/><path d="M10 26 Q10 15 22 13 L36 12 Q46 18 57 13 L58 18 Q46 23 36 17 L22 18 Q15 20 14 28 Z" fill="${c2}" opacity=".85"/>${mark}
 <path d="M96 30 Q108 34 112 40" stroke="rgba(255,255,255,.45)" stroke-width="3" fill="none" stroke-linecap="round"/><text x="24" y="42" font-size="6.5" font-weight="900" fill="${c2}" font-family="sans-serif">${esc(b.bn.toUpperCase())}</text></svg>`}
function pkKitCols(c){const cl=(typeof club==='function'&&club())||{};const r=v=>v==='@1'?(cl.c1||'#ff6a12'):v;return{s:r(c.k.s),s2:r(c.k.s2),sh:r(c.k.sh),so:r(c.k.so)}}
function pkCosSVG(c,w=90){if(c.slot==='kit'){const k=pkKitCols(c);return`<svg viewBox="0 0 100 90" width="${w}"><path d="M30 8 L42 4 Q50 12 58 4 L70 8 L92 22 L82 38 L72 32 L72 84 L28 84 L28 32 L18 38 L8 22 Z" fill="${k.s}" stroke="rgba(0,0,0,.3)" stroke-width="2"/><path d="M42 4 Q50 12 58 4 L56 10 Q50 16 44 10 Z" fill="${k.s2}"/><path d="M8 22 L18 38 L22 35 L13 20 Z M92 22 L82 38 L78 35 L87 20 Z" fill="${k.s2}"/><rect x="28" y="72" width="44" height="6" fill="${k.s2}" opacity=".8"/></svg>`}
 if(c.slot==='socks')return`<svg viewBox="0 0 100 90" width="${w}"><path d="M38 4 H62 V52 Q62 60 70 64 L84 70 Q92 76 86 84 H44 Q34 84 34 74 V4 Z" transform="translate(4 0)" fill="${c.c}" stroke="rgba(0,0,0,.3)" stroke-width="2"/><rect x="38" y="8" width="28" height="6" fill="rgba(255,255,255,.55)"/><rect x="38" y="18" width="28" height="4" fill="rgba(255,255,255,.35)"/></svg>`;
 if(c.slot==='tee')return`<svg viewBox="0 0 100 90" width="${w}"><path d="M20 30 Q30 18 46 20 L82 30 Q90 34 88 44 L84 70 Q82 78 74 76 L60 72 L62 46 L40 46 Q26 46 20 30 Z" fill="${c.c}" stroke="rgba(0,0,0,.3)" stroke-width="2"/><path d="M60 72 L74 76 L76 66 L62 63 Z" fill="rgba(255,255,255,.35)"/></svg>`;
 return`<svg viewBox="0 0 100 90" width="${w}"><circle cx="50" cy="50" r="30" fill="#2a2f35"/><path d="M18 40 Q50 22 82 40 L82 52 Q50 34 18 52 Z" fill="${c.c}" stroke="rgba(0,0,0,.3)" stroke-width="2"/></svg>`}
function pkCardHTML(c,i){const R=PK_RAR[c.r];let art='',nm='',sub='',tag='';
 if(c.kind==='cos'){const x=pkCos(c.id);art=pkCosSVG(x,86);nm=x.n;sub=PK_SLOT[x.slot][1];tag=c.isNew?'NOVO':c.gem?`+${c.gem} 💠`:''}
 else{const b=pkBoot(c.id);art=pkBootSVG(b,108);nm=b.n;
  if(c.kind==='frag'){sub=c.dupFrag?'Pedaços de chuteira que já é sua':c.built?'Chuteira montada!':`Pedaços ${c.have}/${c.need}`;tag=c.dupFrag?`+${c.gem} 💠`:c.built?'MONTOU!':`+${c.q} pedaços`;art=`<div class="pk-frag">${art}<i style="--p:${Math.round(100*(c.have||0)/(c.need||1))}%"></i></div>`}
  else{sub=`Vel +${b.vel} · For +${b['for']} · Téc +${b.tec}`;tag=c.isNew?'NOVA':c.up?`NÍVEL ${c.up}`:c.gem?`+${c.gem} 💠`:''}}
 return`<button class="pkc r${c.r}" data-i="${i}" style="--rc:${R.c};--rg:${R.g}"><div class="pkc-in"><div class="pkc-b"><span>FDB</span></div><div class="pkc-f"><em>${R.n}</em><div class="pkc-art">${art}</div><b>${esc(nm)}</b><small>${esc(sub)}</small>${tag?`<i class="pkc-tag">${esc(tag)}</i>`:''}</div></div></button>`}
// abertura do pacote
async function pkOpen(pack,via){const n=S.n;const P=pkN();
 if(via==='free'){if(P.free<1)return;P.free--}else if(via==='gems'){if(n.gems<pack.g){toast({ic:'💠',title:'Gemas insuficientes',txt:`Custa ${pack.g} 💠. Você tem ${n.gems}.`,ms:2200});return}n.gems-=pack.g}
 else{if(!pkMoneyOk(pack.p)){toast({ic:'💸',title:'Dinheiro insuficiente',txt:`Custa ${money(pack.p)}. Você tem ${money(S.din)}.`,ms:2200});return}S.din-=pack.p}
 const cards=pkOpenCards(pack);try{nsSync();saveNow('pk')}catch(e){}
 return new Promise(res=>{const h=document.createElement('div');h.className='pk-host';document.body.appendChild(h);
  h.innerHTML=`<div class="pk-stage"><div class="pk-pack" style="--a:${pack.cl[0]};--b:${pack.cl[1]}"><span>${pack.ic}</span><b>Pacotinho ${esc(pack.n)}</b><small>${pack.k} cartas</small></div>
   <div class="pk-cards" hidden>${cards.map(pkCardHTML).join('')}</div><div class="pk-btns" hidden><button class="btn" id="pkAll">Revelar tudo</button></div>
   <div class="pk-btns pk-end" hidden><button class="btn" id="pkCol">Ver coleção</button><button class="btn ghost" id="pkAgain">Abrir outro</button><button class="btn ghost" id="pkClose">Fechar</button></div></div>`;
  const $=s=>h.querySelector(s);const left=()=>h.querySelectorAll('.pkc:not(.on)').length;
  const done=k=>{h.remove();res(k)};
  const flip=el=>{if(el.classList.contains('on'))return;el.classList.add('on');if(+el.className.match(/r(\d)/)[1]>=3){h.classList.add('shine');setTimeout(()=>h.classList.remove('shine'),900)}if(!left()){$('.pk-btns').hidden=true;$('.pk-end').hidden=false}};
  setTimeout(()=>{$('.pk-pack').classList.add('burst');setTimeout(()=>{$('.pk-pack').hidden=true;$('.pk-cards').hidden=false;$('.pk-btns').hidden=false},420)},650);
  h.querySelectorAll('.pkc').forEach(el=>el.onclick=()=>flip(el));
  $('#pkAll').onclick=()=>{[...h.querySelectorAll('.pkc:not(.on)')].forEach((el,i)=>setTimeout(()=>flip(el),i*260))};
  $('#pkCol').onclick=()=>done('col');$('#pkClose').onclick=()=>done('close');$('#pkAgain').onclick=()=>done('again')})}
async function pkBuy(id,via){const pack=PK_PACKS.find(p=>p.id===id);if(!pack)return;
 if(via==='money'&&pack.p>=1){const k=await nsPop({ic:pack.ic,title:`Pacotinho ${pack.n}`,txt:`Abrir por ${money(pack.p)}? Você tem ${money(S.din)}.`,opts:[['y','Abrir']],ok:'Cancelar'});if(k!=='y')return}
 const r=await pkOpen(pack,via);if(r==='col')nsPush0(nsColPage());else if(r==='again'){nsRefresh();const P=pkN();const v=via==='free'&&P.free<1?'money':via;pkBuy(id,v)}else nsRefresh()}
function pkOddsHTML(p){const tot=p.odds.reduce((s,x)=>s+x,0);return`<div class="pk-odds">${p.odds.map((o,i)=>o?`<span style="--rc:${PK_RAR[i].c}">${PK_RAR[i].n} <b>${String(+(o/tot*100).toFixed(1)).replace('.',',')}%</b></span>`:'').join('')}${p.min!=null?`<span class="g">Última carta: ${PK_RAR[p.min].n} ou melhor</span>`:''}</div>`}
function nsPackPage(){return{t:'Pacotinhos',cls:'pk',html:()=>{const n=S.n;const P=pkN();
  const ownB=Object.keys(P.own).length,ownC=P.cos.length;const nx=4-((P.games||0)%4);
  return`<div class="pk-top"><div><span>💰</span><b>${money(S.din)}</b></div><div><span>💠</span><b>${n.gems}</b><small>gemas</small></div><div><span>🎁</span><b>${P.free}</b><small>grátis</small></div></div>
  <p class="nshelp pk-help">Cada carta é uma <b>chuteira</b>, <b>pedaços</b> de uma chuteira (junte e ela é montada) ou <b>visual</b>. Chuteira de pacote não gasta e sobe de nível quando vem repetida. Você ganha 💠 jogando e um pacote Bronze grátis a cada 4 jogos (falta${nx>1?'m':''} ${nx}).</p>
  <div class="pk-list">${PK_PACKS.map(p=>`<div class="pk-item"><div class="pk-art" style="--a:${p.cl[0]};--b:${p.cl[1]}"><span>${p.ic}</span></div><div class="pk-mid"><b>Pacotinho ${esc(p.n)}</b><small>${p.k} cartas · ${p.mix[2]===100?'só visual':'chuteiras, pedaços e visual'}</small>${pkOddsHTML(p)}</div>
   <div class="pk-buy">${p.id==='bronze'&&P.free?`<button class="btn small" data-pf="${p.id}">Grátis (${P.free})</button>`:''}<button class="btn small ${pkMoneyOk(p.p)?'':'ghost'}" data-pm="${p.id}">${money(p.p)}</button><button class="btn small ghost" data-pg="${p.id}">💠 ${p.g}</button></div></div>`).join('')}</div>
  <button class="pk-colbtn" id="pkColB"><span>🗂️</span><div><b>Sua coleção</b><small>${ownB}/${PK_BOOTS.length} chuteiras · ${ownC}/${PK_COS.length} itens de visual</small></div><i>›</i></button>`},
 bind:B=>{B.querySelectorAll('[data-pf]').forEach(b=>b.onclick=()=>pkBuy(b.dataset.pf,'free'));B.querySelectorAll('[data-pm]').forEach(b=>b.onclick=()=>pkBuy(b.dataset.pm,'money'));
  B.querySelectorAll('[data-pg]').forEach(b=>b.onclick=()=>pkBuy(b.dataset.pg,'gems'));const c=B.querySelector('#pkColB');if(c)c.onclick=()=>nsPush(nsColPage())},
 nav:[{ic:'🗂️',t:'Coleção',fn:()=>nsPush(nsColPage())}]}}
let PK_TAB='boot',PK_FR=-1;
function nsColPage(){return{t:'Coleção',cls:'pk',html:()=>{const P=pkN();const n=S.n;let body='';
  const tabs=`<div class="nstabs wide three">${[['boot','👟 Chuteiras'],['frag','🧩 Pedaços'],['cos','👕 Visual']].map(([k,t])=>`<button class="${PK_TAB===k?'on':''}" data-pt="${k}">${t}</button>`).join('')}</div>`;
  const rf=`<div class="pk-rf">${[-1,0,1,2,3,4].map(r=>`<button class="${PK_FR===r?'on':''}" data-rf="${r}" style="--rc:${r<0?'#cfe8d5':PK_RAR[r].c}">${r<0?'Todas':PK_RAR[r].n}</button>`).join('')}</div>`;
  if(PK_TAB==='boot'){const eq=n.boot&&String(n.boot).startsWith('pk:')?n.boot.slice(3):null;const L=PK_BOOTS.filter(b=>P.own[b.id]&&(PK_FR<0||b.r===PK_FR)).sort((a,b)=>b.r-a.r||((P.own[b.id].lv||1)-(P.own[a.id].lv||1)));
   body=rf+(L.length?`<div class="pk-grid">${L.map(b=>{const lv=P.own[b.id].lv||1,k=(lv-1)*2;return`<div class="pk-cell ${eq===b.id?'eq':''}" style="--rc:${PK_RAR[b.r].c};--rg:${PK_RAR[b.r].g}"><em>${PK_RAR[b.r].n} · Nv ${lv}</em>${pkBootSVG(b,96)}<b>${esc(b.n)}</b><small>Vel +${b.vel+k} · For +${b['for']+k} · Téc +${b.tec+k}</small>${b.ab.length?`<small class="ab">${b.ab.map(a=>NS_AB[a][0]+' '+NS_AB[a][1]).join(' · ')}</small>`:''}${eq===b.id?'<span class="chip up">Calçada</span>':`<button class="btn small" data-eb="${b.id}">Calçar</button>`}</div>`}).join('')}</div>`:`<p class="nshelp">Nenhuma chuteira${PK_FR>=0?' dessa raridade':''} ainda. Abra pacotinhos!</p>`)}
  else if(PK_TAB==='frag'){const L=Object.entries(P.frag).map(([id,q])=>({b:pkBoot(id),q})).filter(x=>x.b&&(PK_FR<0||x.b.r===PK_FR)).sort((a,b)=>b.q/PK_FRAG[b.b.r]-a.q/PK_FRAG[a.b.r]);
   body=rf+(L.length?`<div class="pk-grid">${L.map(({b,q})=>`<div class="pk-cell" style="--rc:${PK_RAR[b.r].c};--rg:${PK_RAR[b.r].g}"><em>${PK_RAR[b.r].n}</em><div class="pk-frag">${pkBootSVG(b,96)}<i style="--p:${Math.round(100*q/PK_FRAG[b.r])}%"></i></div><b>${esc(b.n)}</b><small>${q}/${PK_FRAG[b.r]} pedaços</small></div>`).join('')}</div>`:'<p class="nshelp">Sem pedaços guardados. Os pedaços aparecem nos pacotinhos.</p>')}
  else{const eq=P.eq||{};body=Object.entries(PK_SLOT).map(([s,[ic,t,d]])=>{const L=PK_COS.filter(c=>c.slot===s);const own=L.filter(c=>P.cos.includes(c.id));
    return`<div class="pk-slot"><div class="pk-sh"><b>${ic} ${t}</b><small>${esc(d)} · ${own.length}/${L.length}</small>${eq[s]?`<button class="btn ghost small" data-uq="${s}">Tirar</button>`:''}</div><div class="pk-row">${L.map(c=>{const has=P.cos.includes(c.id);return`<button class="pk-cos ${has?'':'lock'} ${eq[s]===c.id?'eq':''}" ${has?`data-qc="${c.id}"`:'disabled'} style="--rc:${PK_RAR[c.r].c}">${has?pkCosSVG(c,54):'<span>?</span>'}<small>${has?esc(c.n.replace(/^(Meião|Segunda pele|Faixa) /,'')):PK_RAR[c.r].n}</small></button>`}).join('')}</div></div>`}).join('')}
  return`<div class="pk-top"><div><span>👟</span><b>${Object.keys(P.own).length}/${PK_BOOTS.length}</b><small>chuteiras</small></div><div><span>👕</span><b>${P.cos.length}/${PK_COS.length}</b><small>visual</small></div><div><span>💠</span><b>${n.gems}</b><small>gemas</small></div></div>${tabs}${body}`},
 bind:B=>{B.querySelectorAll('[data-pt]').forEach(b=>b.onclick=()=>{PK_TAB=b.dataset.pt;nsRefresh()});B.querySelectorAll('[data-rf]').forEach(b=>b.onclick=()=>{PK_FR=+b.dataset.rf;nsRefresh()});
  B.querySelectorAll('[data-eb]').forEach(b=>b.onclick=()=>{const x=pkBoot(b.dataset.eb);pkEquip(x.id);toast({ic:'👟',title:`Calçou a ${x.n}`,txt:'Chuteira de pacote não gasta.',ms:1800});nsRefresh()});
  B.querySelectorAll('[data-qc]').forEach(b=>b.onclick=()=>{const c=pkCos(b.dataset.qc);const P=pkN();P.eq=P.eq||{};P.eq[c.slot]=c.id;try{saveNow('pk')}catch(e){}toast({ic:PK_SLOT[c.slot][0],title:c.n,txt:'Aparece nos seus lances.',ms:1500});nsRefresh()});
  B.querySelectorAll('[data-uq]').forEach(b=>b.onclick=()=>{const P=pkN();delete P.eq[b.dataset.uq];nsRefresh()})},
 nav:[{ic:'🎁',t:'Pacotinhos',fn:()=>nsPush(nsPackPage())}]}}
// visual no lance em 3D: uniforme especial (time todo), meião, segunda pele e faixa (só você)
{const _cfgPk=l3dCfg;l3dCfg=function(o){const c=_cfgPk(o);try{if(nsOn()&&S.n&&S.n.pk&&c.env!=='prison'){const eq=S.n.pk.eq||{};
  if(eq.kit&&c.us){const x=pkCos(eq.kit);if(x){const k=pkKitCols(x);Object.assign(c.us,{shirt:k.s,shirt2:k.s2,shorts:k.sh,socks:k.so});delete c.us.stripe;
    if(c.them&&l3dDist(c.us.shirt,c.them.shirt)<110){const alt=l3dDist(c.us.shirt,'#ffffff')>140?'#ffffff':'#151515';c.them={...c.them,shirt:alt,shirt2:alt==='#ffffff'?'#151515':'#ffffff',shorts:alt,socks:alt};delete c.them.stripe}}}
  if(c.hero){const g=s=>{const x=eq[s]&&pkCos(eq[s]);return x&&x.c};if(g('socks'))c.hero.socks=g('socks');if(g('tee'))c.hero.tee=g('tee');if(g('band'))c.hero.band=g('band')}}}catch(e){console.error(e)}return c}}
// ganhar jogando: gemas por jogo, gol e craque do jogo; pacote Bronze grátis a cada 4 jogos
{const _amPk=nsAfterMatch;nsAfterMatch=function(r,o,cur){const out=_amPk.apply(this,arguments);try{const n=S.n;const P=pkN();const me=r&&r.me;
  if(me&&me.play){const res=r.gu>r.gt?'V':r.gu<r.gt?'D':'E';let g=1+Math.min(3,me.g||0)+(res==='V'?1:0)+(nsMotm(me,res)?3:0);n.gems+=g;P.games=(P.games||0)+1;
   if(P.games%4===0){P.free++;setTimeout(()=>toast({ic:'🎁',title:'Pacotinho Bronze grátis!',txt:'Abra na Loja › Pacotinhos.',ms:2600,group:'pk'}),1800)}
   else setTimeout(()=>toast({ic:'💠',title:`+${g} gemas`,txt:`Você tem ${n.gems} 💠 pros pacotinhos.`,ms:1800,group:'pk'}),1800)}
  if(n.boot==null&&P.eq&&P.eq.boot&&P.own[P.eq.boot])pkEquip(P.eq.boot);
  if(typeof n.boot==='string'&&n.boot.startsWith('pk:'))n.bootLeft=999}catch(e){console.error(e)}return out}}
// presente de boas-vindas na primeira visita
function pkGift(){const P=pkN();if(P.gift)return;P.gift=true;P.free+=1;S.n.gems+=45;toast({ic:'🎁',title:'Presente: pacote Bronze + 45 💠',txt:'Dá pra abrir um Ouro com as gemas.',ms:2600})}
// Loja: pacotinhos e coleção em destaque
{const _ih=nsItensHTML;nsItensHTML=function(){let h=_ih.apply(this,arguments);try{const P=pkN();const ownB=Object.keys(P.own).length;
  h=h.replace(/(\$?)(\d+) jogos/,(m,a,g)=>+g>=999?'não gasta':m);
  h=h.replace('<div class="nsx-grid big">',`<div class="nsx-grid big"><button class="nsx-tile pk-tile" id="nsPackB"><span>🎁</span><b>Pacotinhos</b><small>${!P.gift?'🎁 Presente esperando!':`${P.free?`${P.free} grátis · `:''}💠 ${S.n.gems} gemas`}</small></button><button class="nsx-tile" id="nsColB"><span>🗂️</span><b>Coleção</b><small>${ownB}/${PK_BOOTS.length} chuteiras</small></button>`)}catch(e){console.error(e)}return h}}
{const _rhPk=nsRenderHub;nsRenderHub=function(){const r=_rhPk.apply(this,arguments);try{const on=(id,fn)=>{const e=document.getElementById(id);if(e)e.onclick=fn};
  on('nsPackB',()=>{pkGift();nsOpen(nsPackPage())});on('nsColB',()=>nsOpen(nsColPage()))}catch(e){console.error(e)}return r}}
// na loja de chuteiras, um atalho pros pacotinhos
{const _spPk=nsShopPage;nsShopPage=function(tab){const p=_spPk(tab);const h0=p.html;p.html=()=>{let h=h0();try{if(NS_SHOP==='bt')h=h.replace('<div class="nsshop">',`<div class="nsshop"><button class="pk-colbtn" data-pkgo="1"><span>🎁</span><div><b>Pacotinhos</b><small>Chuteiras que não gastam, pedaços e visual · 💠 ${S.n.gems}</small></div><i>›</i></button>`)}catch(e){}return h};
 const b0=p.bind;p.bind=B=>{b0(B);const g=B.querySelector('[data-pkgo]');if(g)g.onclick=()=>{pkGift();nsPush(nsPackPage())}};return p}}
(function(){const st=document.createElement('style');st.id='nsPack';st.textContent=`
.pk-top{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:2px 0 10px}.pk-top>div{background:#0f241b;border:1px solid #1d3b2e;border-radius:12px;padding:8px 10px;display:grid;grid-template-columns:auto 1fr;align-items:center;column-gap:6px}
.pk-top span{font-size:20px;grid-row:span 2}.pk-top b{font-size:16px;color:#eafff4}.pk-top small{font-size:11px;color:#8fb7a3}
.pk-help{font-size:13px;margin:0 0 10px}.pk-list{display:grid;gap:10px}
.pk-item{display:grid;grid-template-columns:64px 1fr;gap:10px;align-items:center;background:#0f241b;border:1px solid #1d3b2e;border-radius:14px;padding:10px}
.pk-art{width:64px;height:84px;border-radius:10px;background:linear-gradient(160deg,var(--a),var(--b));display:grid;place-items:center;box-shadow:inset 0 0 0 2px rgba(255,255,255,.25),0 6px 14px rgba(0,0,0,.35);font-size:30px;position:relative;overflow:hidden}
.pk-art:after{content:'';position:absolute;inset:-40% -60%;background:linear-gradient(100deg,transparent 40%,rgba(255,255,255,.35) 50%,transparent 60%);animation:pkSh 3.2s infinite}
@keyframes pkSh{0%{transform:translateX(-60%)}60%,100%{transform:translateX(60%)}}
.pk-mid b{display:block;font-size:16px;color:#eafff4}.pk-mid small{color:#8fb7a3;font-size:12.5px}
.pk-odds{display:flex;flex-wrap:wrap;gap:4px 8px;margin-top:5px}.pk-odds span{font-size:11px;color:var(--rc,#cfe8d5);font-weight:700}.pk-odds span b{color:#eafff4}.pk-odds .g{color:#8fb7a3;font-weight:600}
.pk-buy{grid-column:1/-1;display:flex;gap:6px;justify-content:flex-end;flex-wrap:wrap}
.pk-colbtn{width:100%;margin:12px 0 4px;display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;text-align:left;background:linear-gradient(135deg,#123a2a,#0d2219);border:1px solid #1fc98b55;border-radius:14px;padding:12px;color:#eafff4;cursor:pointer}
.pk-colbtn span{font-size:24px}.pk-colbtn b{display:block}.pk-colbtn small{color:#8fb7a3}.pk-colbtn i{font-style:normal;font-size:22px;color:#1fc98b}
.nsx-tile.pk-tile{background:linear-gradient(140deg,#ffcf4a33,#b26bff33,#25f0a833)!important;border-color:#ffd65a88!important}
.pk-rf{display:flex;gap:6px;overflow-x:auto;margin:6px 0 10px;padding-bottom:2px;flex:none;min-height:34px}.pk-rf button{flex:none;border:1px solid #1d3b2e;background:#0f241b;color:var(--rc);border-radius:999px;padding:5px 11px;font-weight:800;font-size:12px}.pk-rf button.on{background:var(--rc);color:#06150f}
.pk-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:9px}
.pk-cell{position:relative;background:radial-gradient(120% 90% at 50% 0,var(--rg),#0c1d16 70%);border:1px solid var(--rc);border-radius:14px;padding:9px;display:grid;justify-items:center;gap:3px;text-align:center}
.pk-cell.eq{box-shadow:0 0 0 2px #1fc98b,0 0 18px #1fc98b66}.pk-cell em{font-style:normal;font-size:10.5px;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:var(--rc)}
.pk-cell b{font-size:13.5px;color:#eafff4;line-height:1.15}.pk-cell small{font-size:11.5px;color:#a9cbb9}.pk-cell small.ab{color:#ffd23c}.pk-cell .btn{margin-top:4px}
.pk-frag{position:relative;display:grid;place-items:center}.pk-frag svg{filter:grayscale(.55) brightness(.8)}.pk-frag i{position:absolute;left:8%;right:8%;bottom:-3px;height:6px;border-radius:9px;background:#0006;overflow:hidden}
.pk-frag i:after{content:'';position:absolute;left:0;top:0;bottom:0;width:var(--p);background:var(--rc,#1fc98b);border-radius:9px}
.pk-slot{background:#0f241b;border:1px solid #1d3b2e;border-radius:14px;padding:10px;margin-bottom:10px}.pk-sh{display:flex;align-items:center;gap:8px;margin-bottom:8px}.pk-sh b{color:#eafff4}.pk-sh small{color:#8fb7a3;flex:1}
.pk-row{display:flex;gap:7px;overflow-x:auto;padding-bottom:3px}.pk-cos{flex:none;width:76px;display:grid;justify-items:center;gap:2px;background:#0b1a14;border:1px solid var(--rc);border-radius:12px;padding:6px 4px;color:#cfe8d5}
.pk-cos.eq{box-shadow:0 0 0 2px #1fc98b;background:#123a2a}.pk-cos.lock{opacity:.45;border-style:dashed}.pk-cos.lock span{font-size:26px;height:54px;display:grid;place-items:center;color:var(--rc)}.pk-cos small{font-size:10.5px;line-height:1.1;text-align:center}
.pk-host{position:fixed;inset:0;z-index:9500;background:radial-gradient(90% 70% at 50% 30%,#134a33f2,#030b07f7);display:grid;place-items:center;padding:16px;animation:fadeIn .2s both}
.pk-host.shine{animation:pkFl .9s}@keyframes pkFl{0%{background-color:#fff3}100%{background-color:transparent}}
.pk-stage{width:min(760px,100%);display:grid;justify-items:center;gap:16px}
.pk-pack{width:170px;height:230px;border-radius:18px;background:linear-gradient(160deg,var(--a),var(--b));display:grid;place-items:center;align-content:center;gap:6px;color:#fff;text-shadow:0 2px 6px #0008;box-shadow:inset 0 0 0 3px rgba(255,255,255,.3),0 20px 50px #000a;animation:pkWob .65s ease-in-out}
.pk-pack span{font-size:58px}.pk-pack b{font-size:18px}.pk-pack.burst{animation:pkBurst .42s ease-in forwards}
@keyframes pkWob{0%,100%{transform:rotate(0)}20%{transform:rotate(-5deg) scale(1.03)}40%{transform:rotate(5deg) scale(1.05)}60%{transform:rotate(-4deg) scale(1.06)}80%{transform:rotate(3deg) scale(1.08)}}
@keyframes pkBurst{to{transform:scale(1.7);opacity:0;filter:brightness(2.2)}}
.pk-cards{display:flex;flex-wrap:wrap;justify-content:center;gap:10px}.pkc{width:min(30vw,140px);aspect-ratio:3/4.3;perspective:900px;background:none;border:0;padding:0;cursor:pointer;animation:pkIn .35s both}
.pkc:nth-child(2){animation-delay:.06s}.pkc:nth-child(3){animation-delay:.12s}.pkc:nth-child(4){animation-delay:.18s}.pkc:nth-child(5){animation-delay:.24s}@keyframes pkIn{from{transform:translateY(30px) scale(.8);opacity:0}}
.pkc-in{position:relative;width:100%;height:100%;transition:transform .55s cubic-bezier(.3,1.3,.5,1);transform-style:preserve-3d}.pkc.on .pkc-in{transform:rotateY(180deg)}
.pkc-b,.pkc-f{position:absolute;inset:0;border-radius:14px;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.pkc-b{background:repeating-linear-gradient(45deg,#0f3324 0 10px,#0b2a1d 10px 20px);border:2px solid #1fc98b88;display:grid;place-items:center;box-shadow:0 10px 24px #0009}.pkc-b span{font-weight:900;font-style:italic;color:#1fc98b;font-size:22px;letter-spacing:.06em}
.pkc.r3 .pkc-b,.pkc.r4 .pkc-b{border-color:var(--rc);box-shadow:0 0 22px var(--rc)}
.pkc-f{transform:rotateY(180deg);background:radial-gradient(120% 80% at 50% 0,var(--rg),#0b1712 72%);border:2px solid var(--rc);display:grid;grid-template-rows:auto 1fr auto auto;justify-items:center;align-items:center;padding:8px 6px;gap:2px;color:#eafff4;text-align:center;overflow:hidden}
.pkc.r3.on .pkc-f,.pkc.r4.on .pkc-f{box-shadow:0 0 28px var(--rc)}.pkc.r3 .pkc-f:after,.pkc.r4 .pkc-f:after{content:'';position:absolute;inset:-50%;background:linear-gradient(100deg,transparent 42%,rgba(255,255,255,.4) 50%,transparent 58%);animation:pkSh 2.4s infinite}
.pkc-f em{justify-self:start;margin-left:4px;font-style:normal;font-size:10px;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:var(--rc)}.pkc-art{display:grid;place-items:center;max-width:100%}.pkc-art svg{max-width:100%;height:auto}
.pkc-f b{font-size:12.5px;line-height:1.15}.pkc-f small{font-size:10.5px;color:#a9cbb9}.pkc-tag{position:absolute;top:24px;right:6px;font-style:normal;font-size:9.5px;font-weight:900;background:var(--rc);color:#06150f;border-radius:6px;padding:2px 5px}
.pk-btns{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
`;document.head.appendChild(st)})();
