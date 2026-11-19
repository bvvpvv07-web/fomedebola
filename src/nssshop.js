// ================== LOJAS, ESTILO DE VIDA, CASSINO, ESTÁBULO, REALIZAÇÕES E PRÊMIOS ==================
// Energéticos (energia, e alguns também treino e relações), chuteiras com atributos, durabilidade e poderes especiais
// (que valem no lance em 3D), itens, veículos e imóveis que sobem o estilo de vida e recuperam energia,
// cassino com quatro jogos, estábulo com cavalos de corrida seus, medalhas de realizações e a sala de troféus.
const NS_DRINKS=[
 {id:'a',ic:'🥤',n:'Energético',d:'Recarrega 30% de energia.',en:30,p:.002},
 {id:'b',ic:'🧃',n:'Energético + Treino',d:'+25% de energia e progresso na habilidade mais fraca.',en:25,sk:1,skp:25,p:.006},
 {id:'c',ic:'🍹',n:'Energético + Moral',d:'+25% de energia e +4 em todas as relações.',en:25,rel:4,p:.006},
 {id:'d',ic:'⚡',n:'Energético Turbo',d:'+35% de energia, treino e +4 nas relações.',en:35,sk:1,skp:30,rel:4,p:.015},
 {id:'e',ic:'🏆',n:'Energético Lendário',d:'+60% de energia, +20% em TODAS as habilidades e +6 nas relações.',en:60,sk:3,skp:20,rel:6,p:.05},
];
const NS_AB={mira:['🎯','Mira','Chutes e passes mais certeiros no lance'],canhao:['💥','Canhão','Chute forte: o goleiro sofre mais'],curva:['🌀','Efeito','Bola com curva: falta e chute colocado'],muralha:['🧱','Muralha','Desarme e defesa mais fortes'],faro:['👃','Faro de gol','A bola chega mais em você durante o jogo']};
const NS_BOOTS=[
 {id:'nb1',ic:'👟',n:'Society Básica',vel:1,for:1,tec:1,g:15,p:.003,col:'#e9e6df'},
 {id:'nb2',ic:'⚡',n:'Raio Leve',vel:4,for:1,tec:2,g:30,p:.02,col:'#ffd400'},
 {id:'nb3',ic:'🧱',n:'Tanque',vel:1,for:4,tec:2,g:30,p:.02,ab:['muralha'],col:'#5a5f66'},
 {id:'nb4',ic:'🎯',n:'Toque Fino',vel:2,for:1,tec:4,g:30,p:.025,ab:['mira'],col:'#1fa3ff'},
 {id:'nb5',ic:'💥',n:'Trovão',vel:2,for:3,tec:3,g:40,p:.08,ab:['canhao'],col:'#ff3b30'},
 {id:'nb6',ic:'🌀',n:'Folha Seca',vel:2,for:2,tec:4,g:40,p:.09,ab:['curva'],col:'#34c759'},
 {id:'nb7',ic:'👃',n:'Faro de Gol',vel:3,for:3,tec:4,g:45,p:.25,ab:['faro'],col:'#ff7a2b'},
 {id:'nb8',ic:'🖤',n:'Elite Carbono',vel:5,for:4,tec:5,g:60,p:.9,ab:['mira','canhao'],col:'#151515'},
 {id:'nb9',ic:'👑',n:'Lendária Dourada',vel:6,for:6,tec:6,g:80,p:3,ab:['curva','faro','mira'],col:'#f2c443'},
];
const NS_ITEMS=[
 {id:'fone',ic:'🎧',n:'Fone de ouvido',p:.001,ls:1},{id:'console',ic:'🎮',n:'Videogame',p:.002,ls:2},{id:'cel',ic:'📱',n:'Celular top',p:.003,ls:2},
 {id:'tatu',ic:'🐉',n:'Tatuagem',p:.004,ls:3},{id:'tv',ic:'📺',n:'TV gigante',p:.006,ls:3},{id:'sinuca',ic:'🎱',n:'Mesa de sinuca',p:.008,ls:3},
 {id:'fliper',ic:'🕹️',n:'Fliperama',p:.012,ls:3},{id:'grife',ic:'🧥',n:'Roupas de grife',p:.03,ls:4},{id:'corrente',ic:'📿',n:'Corrente de ouro',p:.05,ls:5},
 {id:'relogio',ic:'⌚',n:'Relógio de luxo',p:.08,ls:6},{id:'arte',ic:'🖼️',n:'Quadro famoso',p:.6,ls:8},
];
const NS_VEH=[
 {id:'bike',ic:'🚲',n:'Bicicleta',p:.0008,ls:1},{id:'scooter',ic:'🛵',n:'Scooter',p:.004,ls:2},{id:'moto',ic:'🏍️',n:'Moto',p:.015,ls:4},
 {id:'popular',ic:'🚗',n:'Carro popular',p:.025,ls:4},{id:'suv',ic:'🚙',n:'SUV',p:.09,ls:7},{id:'esportivo',ic:'🏎️',n:'Carro esportivo',p:.35,ls:12},
 {id:'limo',ic:'🚘',n:'Limusine',p:.6,ls:12},{id:'heli',ic:'🚁',n:'Helicóptero',p:4,ls:18},{id:'iate',ic:'🛥️',n:'Iate',p:12,ls:22},{id:'jato',ic:'✈️',n:'Jatinho',p:30,ls:28},
];
const NS_PROPS=[
 {id:'ap',ic:'🏢',n:'Apartamento perto do CT',p:.25,en:3,ls:4,r:0,d:'Chega descansado no treino.'},
 {id:'paisCasa',ic:'🏠',n:'Casa para os seus pais',p:.4,en:2,ls:3,r:0,d:'Seus pais do seu lado pra sempre.',pais:true},
 {id:'aluguel',ic:'🏘️',n:'Apartamentos para alugar',p:.8,en:0,ls:2,r:.0012,d:'Renda de aluguel toda semana.'},
 {id:'chale',ic:'🏔️',n:'Chalé na serra',p:.9,en:6,ls:7,r:0,d:'Folga com ar puro.'},
 {id:'casa',ic:'🏡',n:'Casa com piscina',p:1.2,en:6,ls:8,r:0,d:'Recuperação na piscina.'},
 {id:'moinho',ic:'🌬️',n:'Moinho',p:1.4,en:2,ls:5,r:.0025,d:'Farinha que vira renda.'},
 {id:'estabulo',ic:'🐎',n:'Estábulo',p:1.6,en:2,ls:6,r:0,d:'Libera os seus cavalos de corrida.',stable:true},
 {id:'fazenda',ic:'🌾',n:'Fazenda',p:2,en:5,ls:8,r:.002,d:'Gado, sossego e renda.'},
 {id:'predio',ic:'🏬',n:'Prédio comercial',p:3,en:0,ls:3,r:.0046,d:'Renda alta e constante.'},
 {id:'vinhedo',ic:'🍇',n:'Vinhedo',p:4,en:4,ls:10,r:.006,d:'Vinho com o seu nome no rótulo.'},
 {id:'mansao',ic:'🏰',n:'Mansão',p:5,en:10,ls:14,r:0,d:'Capa de revista.'},
 {id:'castelo',ic:'🏯',n:'Castelo',p:25,en:15,ls:22,r:0,d:'Muralhas, torres e um campo de futebol no pátio.'},
 {id:'ilha',ic:'🏝️',n:'Ilha particular',p:60,en:20,ls:30,r:0,d:'O lugar mais longe possível da imprensa.'},
];
// a loja antiga de imóveis passa a usar a lista nova (aluguel e valor de venda continuam funcionando)
try{if(typeof PROPS!=='undefined'){PROPS.length=0;for(const p of NS_PROPS)PROPS.push({...p,fx:{}})}}catch(e){}
function nsOwned(kind,id){const n=S.n;return kind==='items'?n.items.includes(id):kind==='veh'?n.veh.includes(id):(S.props||[]).includes(id)}
function nsPay(p){if(S.din+1e-9<p){toast({ic:'💸',title:'Dinheiro insuficiente',txt:`Custa ${money(p)}. Você tem ${money(S.din)}.`,ms:2200});return false}S.din-=p;return true}
let NS_SHOP='dr',NS_LSUB='items';
function nsShopPage(tab){if(tab)NS_SHOP=tab;return{t:'Lojas',cls:'shop',html:()=>{const n=S.n;let body='';
  if(NS_SHOP==='dr')body=NS_DRINKS.map(d=>`<div class="nsrow"><span class="ic">${d.ic}</span><div class="mid"><b>${esc(d.n)}</b><small>${esc(d.d)}</small></div><div class="own">${n.dr[d.id]||0}</div><div class="act"><button class="btn small" data-bd="${d.id}">${money(d.p)}</button>${n.dr[d.id]?`<button class="btn ghost small" data-ud="${d.id}">Tomar</button>`:''}</div></div>`).join('');
  else if(NS_SHOP==='bt'){const cur=nsBootStats();body=`<div class="nsbt-h"><span></span><span></span><span>Vel</span><span>For</span><span>Téc</span><span>Jogos</span><span></span></div>`+NS_BOOTS.map(b=>{const on=cur&&cur.id===b.id;
   return`<div class="nsbt ${on?'on':''}"><span class="ic" style="--bc:${b.col}">${b.ic}</span><div class="nm"><b>${esc(b.n)}</b>${(b.ab||[]).map(a=>`<em title="${esc(NS_AB[a][2])}">${NS_AB[a][0]} ${NS_AB[a][1]}</em>`).join('')}</div><span>+${b.vel}</span><span>+${b.for}</span><span>+${b.tec}</span><span>${on?n.bootLeft+'/':''}${b.g}</span><button class="btn small ${on?'ghost':''}" data-bb="${b.id}">${on?'Trocar':money(b.p)}</button></div>`}).join('')+`<div class="nsabl">${Object.values(NS_AB).map(([ic,t,d])=>`<div><b>${ic} ${t}</b><span>${d}</span></div>`).join('')}</div>`}
  else{const L=NS_LSUB==='items'?NS_ITEMS:NS_LSUB==='veh'?NS_VEH:NS_PROPS;
   body=`<div class="nstabs wide three">${[['items','📱 Itens'],['veh','🚗 Veículos'],['props','🏡 Imóveis']].map(([k,t])=>`<button class="${NS_LSUB===k?'on':''}" data-ls="${k}">${t}</button>`).join('')}</div><div class="nsls-h">Estilo de vida ${nsBarHTML(n.ls,'ls')} <b>${n.ls}%</b></div>`+
   L.map(it=>{const own=nsOwned(NS_LSUB,it.id);const extra=NS_LSUB==='props'?[it.en?`+${it.en}% energia/sem`:'',it.r?`renda ${money(it.r*52)}/ano`:'',it.d||''].filter(Boolean).join(' · '):'';
    return`<div class="nsrow ${own?'owned':''}"><span class="ic">${it.ic}</span><div class="mid"><b>${esc(it.n)}</b><small>+${it.ls} estilo de vida${extra?' · '+esc(extra):''}</small></div><div class="act">${own?`<span class="chip up">✓ Seu</span>${NS_LSUB!=='items'?`<button class="btn ghost small" data-sl="${it.id}">Vender ${money(it.p*.7)}</button>`:''}`:`<button class="btn small" data-bl="${it.id}">${money(it.p)}</button>`}</div></div>`}).join('')}
  return`<div class="nstabs wide three">${[['dr','🥤 Energéticos'],['bt','👟 Chuteiras'],['ls','💎 Estilo de vida']].map(([k,t])=>`<button class="${NS_SHOP===k?'on':''}" data-sh="${k}">${t}</button>`).join('')}</div><div class="nsshop">${body}</div>`},
 bind:B=>{B.querySelectorAll('[data-sh]').forEach(b=>b.onclick=()=>{NS_SHOP=b.dataset.sh;nsRefresh()});B.querySelectorAll('[data-ls]').forEach(b=>b.onclick=()=>{NS_LSUB=b.dataset.ls;nsRefresh()});
  B.querySelectorAll('[data-bd]').forEach(b=>b.onclick=()=>{const d=NS_DRINKS.find(x=>x.id===b.dataset.bd);if(!nsPay(d.p))return;S.n.dr[d.id]=(S.n.dr[d.id]||0)+1;toast({ic:d.ic,title:`+1 ${d.n}`,ms:1200,group:'nsdr'});nsRefresh()});
  B.querySelectorAll('[data-ud]').forEach(b=>b.onclick=async()=>{const d=NS_DRINKS.find(x=>x.id===b.dataset.ud);const chips=nsDrink(d);await nsPop({ic:d.ic,title:d.n,txt:`Energia em ${Math.round(S.n.en)}%.`,chips});nsRefresh()});
  B.querySelectorAll('[data-bb]').forEach(b=>b.onclick=async()=>{const bt=NS_BOOTS.find(x=>x.id===b.dataset.bb);const k=await nsPop({ic:bt.ic,title:bt.n,html:`<div class="nsbtd"><span>Velocidade +${bt.vel}</span><span>Força +${bt.for}</span><span>Técnica +${bt.tec}</span><span>Dura ${bt.g} jogos</span></div>${(bt.ab||[]).map(a=>`<p><b>${NS_AB[a][0]} ${NS_AB[a][1]}:</b> ${esc(NS_AB[a][2])}</p>`).join('')}`,opts:[['buy',`Comprar por ${money(bt.p)}`]],ok:'Cancelar'});
   if(k!=='buy'||!nsPay(bt.p))return;S.n.boot=bt.id;S.n.bootLeft=bt.g;nsSync();try{nsAchCheck()}catch(e){}toast({ic:bt.ic,title:`Calçou a ${bt.n}`,txt:(bt.ab||[]).map(a=>NS_AB[a][1]).join(' + ')||'Mais rendimento em campo.',ms:2200});nsRefresh()});
  B.querySelectorAll('[data-bl]').forEach(b=>b.onclick=async()=>{const L=NS_LSUB==='items'?NS_ITEMS:NS_LSUB==='veh'?NS_VEH:NS_PROPS;const it=L.find(x=>x.id===b.dataset.bl);
   if(it.p>=.5){const k=await nsPop({ic:it.ic,title:it.n,txt:`Comprar por ${money(it.p)}? Você tem ${money(S.din)}.`,opts:[['y','Comprar']],ok:'Cancelar'});if(k!=='y')return}
   if(!nsPay(it.p))return;if(NS_LSUB==='items')S.n.items.push(it.id);else if(NS_LSUB==='veh')S.n.veh.push(it.id);else{S.props=S.props||[];S.props.push(it.id);if(it.pais)S.pais=100}
   nsLsCalc();S.n.happy=clamp(S.n.happy+Math.min(8,1+it.ls*.4),0,100);if(it.ls>=10)nsStarAdd(4);nsSync();try{nsAchCheck()}catch(e){}toast({ic:it.ic,title:`Comprou: ${it.n}`,txt:`Estilo de vida ${S.n.ls}%`,ms:1800});nsRefresh()});
  B.querySelectorAll('[data-sl]').forEach(b=>b.onclick=async()=>{const L=NS_LSUB==='veh'?NS_VEH:NS_PROPS;const it=L.find(x=>x.id===b.dataset.sl);const k=await nsPop({ic:it.ic,title:`Vender ${it.n}?`,txt:`Você recebe ${money(it.p*.7)}.`,opts:[['y','Vender']],ok:'Cancelar'});if(k!=='y')return;
   if(NS_LSUB==='veh')S.n.veh.splice(S.n.veh.indexOf(it.id),1);else{S.props.splice(S.props.indexOf(it.id),1);if(it.stable&&S.n.horses.length){S.din+=S.n.horses.reduce((s,h)=>s+nsHorsePrice(h)*.7,0);S.n.horses=[]}}S.din+=it.p*.7;nsLsCalc();nsSync();nsRefresh()})},
 nav:[{ic:'🎰',t:'Cassino',fn:()=>nsPush(nsCasinoPage())},{ic:'🐎',t:'Estábulo',fn:()=>nsPush(nsStablePage())}]}}
// poderes da chuteira no lance em 3D (e energia baixa atrapalha a mira)
{const _cfgN=l3dCfg;l3dCfg=function(o){const c=_cfgN(o);try{if(nsOn()){const b=nsBootStats();const ab=b&&b.ab||[];
  if(b&&c.hero)c.hero.boot=b.col;
  if(ab.includes('mira'))c.noiseK=(c.noiseK||1)*.75;if(ab.includes('canhao'))c.gkK=(c.gkK||0)-.35;if(ab.includes('curva')){c.noiseK=(c.noiseK||1)*.88;c.gkK=(c.gkK||0)-.15}
  if(ab.includes('muralha'))c.myGkK=(c.myGkK||1)+.15;if(ab.includes('faro'))c.noiseK=(c.noiseK||1)*.92;
  const e=S.n.en;if(e<35)c.noiseK=(c.noiseK||1)*(1+(35-e)/70)}}catch(e){}return c}}

// ---------- cassino ----------
function nsCasinoPage(){return{t:'Cassino',cls:'casino',html:()=>{const kid=S.age<18;
  return`<div class="nscas-bank"><span>Banco</span><b>${money(S.din)}</b><small>Resultado no cassino: <span class="${(S.casino&&S.casino.net||0)>=0?'good':'bad'}">${(S.casino&&S.casino.net||0)>=0?'+':'−'}${money(Math.abs(S.casino&&S.casino.net||0))}</span></small></div>
  ${kid?'<p class="muted">O cassino libera aos 18 anos.</p>':''}
  <div class="nscas">${[['bj','🃏','Vinte e um'],['rol','🎡','Roleta'],['slot','🎰','Caça-níquel'],['horse','🏇','Corrida de cavalos']].map(([k,ic,t])=>`<button class="nscas-b" data-cs="${k}" ${kid?'disabled':''}><span>${ic}</span><b>${t}</b></button>`).join('')}</div>
  <p class="muted nshelp">Aposta é diversão: perder faz parte. Ir demais ao cassino derruba a disciplina e a imprensa adora uma foto.</p>`},
 bind:B=>B.querySelectorAll('[data-cs]').forEach(b=>b.onclick=async()=>{const fn={bj:blackjack,rol:roulette,slot:slotMachine,horse:horseRace}[b.dataset.cs];if(!fn)return;
  ensureLife();S.casino.visits=(S.casino.visits||0)+1;S.life.disc=clamp(S.life.disc-1,0,100);try{await fn()}catch(e){console.error(e)}
  if(ch(S.life.fama>40?.1:.04)){S.n.rel.coach=clamp(S.n.rel.coach-3,0,100);toast({ic:'📸',title:'Paparazzi',txt:'Foto sua no cassino nas redes. O técnico não gostou.',ms:2600})}try{nsAchCheck()}catch(e){}nsRefresh()}),
 nav:[{ic:'🐎',t:'Meu estábulo',fn:()=>nsPush(nsStablePage())}]}}

// ---------- estábulo e cavalos de corrida ----------
const NS_HN=['Pé de Vento','Brisa do Sul','Cometa','Sultão','Tornado Azul','Dama da Noite','Pólvora','Garoa','Capitão','Jabuticaba','Saci','Trovoada','Peteca','Baronesa','Faísca Dourada','Lampião','Mandacaru','Ventarola','Rapadura','Boitatá','Iracema','Caramelo','Pirata','Sabiá'];
const NS_HC=['#8b5a2b','#3b2a1a','#d2b48c','#f5f5f5','#5c4033','#a0522d','#222','#c19a6b'];
function nsHasStable(){return(S.props||[]).includes('estabulo')}
function nsHorsePrice(h){return Math.round(.02*Math.pow(1.09,h.f-40)*(h.age>=8?.6:1)*1000)/1000}
function nsHorseStars(f){const s=clamp(Math.round((f-30)/13),1,5);return'★'.repeat(s)+'☆'.repeat(5-s)}
function nsHorseMarket(){const n=S.n;if(!n.hmk||n.hmk.wk!==n.week){const L=[];for(let i=0;i<3;i++){const f=clamp(Math.round(R(35,72)+randn()*6),30,88);const used=new Set([...n.horses.map(h=>h.n),...L.map(h=>h.n)]);L.push({id:'h'+Date.now().toString(36)+i,n:pick(NS_HN.filter(x=>!used.has(x))),f,pot:clamp(f+RI(4,22),f,97),age:RI(2,5),r:0,w:0,earn:0,col:pick(NS_HC)})}n.hmk={wk:n.week,L}}return n.hmk.L}
function nsStablePage(){return{t:'Meu estábulo',cls:'stable',html:()=>{const n=S.n;
  if(!nsHasStable())return`<div class="nsempty"><span>🐎</span><b>Você ainda não tem um estábulo</b><p class="muted">Compre o Estábulo na loja de imóveis pra ter cavalos de corrida seus: treine, inscreva em páreos e ganhe prêmios.</p><button class="btn" id="goProps">🏡 Ver imóveis</button></div>`;
  const mk=nsHorseMarket();
  return`<div class="nsst-h"><b>Cavalos ${n.horses.length}/4</b><span class="muted">Treino e corrida: uma vez por semana cada cavalo</span></div>
  ${n.horses.length?n.horses.map((h,i)=>`<div class="nshorse"><span class="hi" style="--hc:${h.col}">🐎</span><div class="mid"><b>${esc(h.n)}</b><small>${nsHorseStars(h.f)} · força ${Math.round(h.f)} · ${h.age} anos</small><small>${h.r} corridas · ${h.w} vitórias · prêmios ${money(h.earn)}</small></div>
   <div class="act"><button class="btn small" data-ht="${i}" ${h.tw===n.week?'disabled':''}>🏋️ ${money(nsHorseTrainCost(h))}</button><button class="btn small" data-hr="${i}" ${h.rw===n.week?'disabled':''}>🏁 Correr</button><button class="btn ghost small" data-hs="${i}">💰</button></div></div>`).join(''):'<p class="muted">Nenhum cavalo ainda. Escolha um no mercado abaixo.</p>'}
  <div class="eyebrow" style="margin-top:6px">Mercado desta semana</div>
  ${mk.map((h,i)=>`<div class="nshorse mk"><span class="hi" style="--hc:${h.col}">🐎</span><div class="mid"><b>${esc(h.n)}</b><small>${nsHorseStars(h.f)} · força ${h.f} · ${h.age} anos</small></div><div class="act"><button class="btn small" data-hb="${i}" ${n.horses.length>=4?'disabled':''}>${money(nsHorsePrice(h))}</button></div></div>`).join('')}`},
 bind:B=>{const g=B.querySelector('#goProps');if(g)g.onclick=()=>{NS_SHOP='ls';NS_LSUB='props';nsPush(nsShopPage())};const n=S.n;
  B.querySelectorAll('[data-hb]').forEach(b=>b.onclick=()=>{const h=nsHorseMarket()[+b.dataset.hb];if(!h||n.horses.length>=4)return;if(!nsPay(nsHorsePrice(h)))return;n.horses.push({...h});n.hmk.L.splice(+b.dataset.hb,1);try{nsAchCheck()}catch(e){}toast({ic:'🐎',title:`${h.n} é seu!`,ms:1800});nsRefresh()});
  B.querySelectorAll('[data-ht]').forEach(b=>b.onclick=()=>{const h=n.horses[+b.dataset.ht];if(!nsPay(nsHorseTrainCost(h)))return;h.tw=n.week;const g=h.f<h.pot?R(2,5):R(0,1.2);h.f=clamp(h.f+g,20,99);toast({ic:'🏋️',title:`${h.n} treinou`,txt:`Força ${Math.round(h.f)} (+${g.toFixed(1).replace('.',',')})`,ms:1800});nsRefresh()});
  B.querySelectorAll('[data-hs]').forEach(b=>b.onclick=async()=>{const i=+b.dataset.hs;const h=n.horses[i];const v=nsHorsePrice(h)*.8;const k=await nsPop({ic:'💰',title:`Vender ${h.n}?`,txt:`Oferta: ${money(v)}.`,opts:[['y','Vender']],ok:'Cancelar'});if(k!=='y')return;n.horses.splice(i,1);S.din+=v;nsRefresh()});
  B.querySelectorAll('[data-hr]').forEach(b=>b.onclick=()=>nsHorseRaceMine(+b.dataset.hr))},
 nav:[{ic:'🎰',t:'Cassino',fn:()=>nsPush(nsCasinoPage())}]}}
function nsHorseTrainCost(h){return Math.round((.004+h.f*.00015)*1000)/1000}
const NS_RACES=[{k:'c',n:'Páreo comum',fee:.005,m:45},{k:'q',n:'Clássico',fee:.02,m:62},{k:'g',n:'Grande Prêmio',fee:.08,m:78}];
async function nsHorseRaceMine(i){const n=S.n;const h=n.horses[i];if(!h||h.rw===n.week)return;
 const k=await nsPop({ic:'🏁',title:`Inscrever ${h.n}`,txt:`Força ${Math.round(h.f)}. Prêmio: 1º = 6× a inscrição, 2º = 2,5×, 3º = 1,2×.`,opts:NS_RACES.map(r=>[r.k,`${r.n} · inscrição ${money(r.fee)} · rivais ~${r.m}`]),ok:'Cancelar'});
 const rc=NS_RACES.find(r=>r.k===k);if(!rc||!nsPay(rc.fee))return;h.rw=n.week;
 const used=new Set([h.n]);const field=[{...h,me:true}];for(let j=0;j<5;j++){const nm=pick(NS_HN.filter(x=>!used.has(x)));used.add(nm);field.push({n:nm,f:clamp(rc.m+randn()*7,25,98),col:pick(NS_HC)})}
 const order=shuffle(field);for(const x of order)x.sp=x.f/70*(.9+rnd()*.25);
 await new Promise(res=>{$ov.hidden=false;$ov.innerHTML=`<div class="ovwrap nshrace"><div class="eyebrow">${esc(rc.n)}</div><h2 style="margin:4px 0 10px;font:900 26px var(--f-display)">${esc(h.n)} na pista</h2>
  <div class="nstrack">${order.map((x,j)=>`<div class="ln ${x.me?'me':''}"><span class="nm">${j+1}. ${esc(x.n)}</span><span class="hz" id="hz${j}" style="--hc:${x.col}">🏇</span></div>`).join('')}<i class="fin"></i></div><div id="hrRes" class="pkres"></div></div>`;
  const pos=order.map(()=>0);const fin=[];const els=order.map((_,j)=>document.getElementById('hz'+j));
  const step=()=>{let all=true;for(let j=0;j<order.length;j++){if(pos[j]>=100)continue;all=false;pos[j]+=order[j].sp*(reduced?8:.9)*(.6+rnd()*.8);if(pos[j]>=100){pos[j]=100;fin.push(j)}els[j].style.left=`calc(${pos[j]}% - ${pos[j]*.34}px)`}
   if(!all){requestAnimationFrame(step);return}
   const place=fin.findIndex(j=>order[j].me)+1;const mult=place===1?6:place===2?2.5:place===3?1.2:0;const pay=rc.fee*mult;S.din+=pay;h.r++;h.earn+=pay;if(place===1){h.w++;n.horseW=(n.horseW||0)+1}
   const hh=n.horses.find(z=>z.id===h.id);if(hh){hh.r=h.r;hh.w=h.w;hh.earn=h.earn;hh.rw=n.week}
   document.getElementById('hrRes').innerHTML=`<div class="${place<=3?'good':'bad'}" style="font:900 22px var(--f-display)">${place}º lugar${pay?` · +${money(pay)}`:''}</div><button class="btn wide" id="hrOk" style="margin-top:10px">Continuar</button>`;
   document.getElementById('hrOk').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res()}};requestAnimationFrame(step)});
 try{nsAchCheck()}catch(e){}nsRefresh()}
// cavalos envelhecem a cada temporada
{const _bsH=buildSeason;buildSeason=function(...a){const r=_bsH.apply(this,a);try{if(S.n&&S.n.horses)for(const h of S.n.horses){h.age++;if(h.age>=8)h.f=clamp(h.f-RI(2,6),20,99)}}catch(e){}return r}}

// ---------- realizações ----------
const NS_ACH=[
 ['contrato','Assine o primeiro contrato profissional',()=>!S.youth&&S.wage>0&&S.club],
 ['gol1','Marque um gol',()=>S.n.cs.g>=1],['ast1','Dê uma assistência',()=>S.n.cs.a>=1],['ps5','Acerte 5 passes num jogo',c=>c.ps>=5],
 ['motm1',"Ganhe o prêmio 'Estrela do jogo'",()=>S.n.cs.motm>=1],['win1','Vença um jogo da liga',c=>c.win],['ht1','Marque um hat-trick',()=>S.n.cs.ht>=1],
 ['ps10','Acerte 10 passes num jogo',c=>c.ps>=10],['ast3','Dê 3 assistências num jogo',c=>c.a>=3],['nota9','Tire nota 9 num jogo',c=>c.nota>=9],['nota10','Tire nota 10',c=>c.nota>=10],
 ['g10','10 gols na carreira',()=>S.n.cs.g>=10],['g50','50 gols na carreira',()=>S.n.cs.g>=50],['g100','100 gols na carreira',()=>S.n.cs.g>=100],['g250','250 gols na carreira',()=>S.n.cs.g>=250],['g500','500 gols na carreira',()=>S.n.cs.g>=500],
 ['a25','25 assistências na carreira',()=>S.n.cs.a>=25],['a100','100 assistências na carreira',()=>S.n.cs.a>=100],
 ['ap100','100 jogos na carreira',()=>S.n.cs.ap>=100],['ap300','300 jogos na carreira',()=>S.n.cs.ap>=300],['motm10','10 vezes Estrela do jogo',()=>S.n.cs.motm>=10],
 ['star5','Nível de estrela 5',()=>S.n.star.l>=5],['star10','Nível de estrela 10',()=>S.n.star.l>=10],['star20','Nível de estrela 20',()=>S.n.star.l>=20],
 ['ovr70','Chegue a OVR 70',()=>S.ovr>=70],['ovr80','Chegue a OVR 80',()=>S.ovr>=80],['ovr90','Chegue a OVR 90',()=>S.ovr>=90],['sk90','Leve uma habilidade a 90',()=>NSK.some(([k])=>S.n.sk[k].l>=90)],
 ['treino50','Treine 50 vezes',()=>(S.n.trainT||0)>=50],['drink1','Tome um energético',()=>(S.n.drunk||0)>=1],['boot1','Compre uma chuteira',()=>!!S.n.boot],['bootLend','Calce a Lendária Dourada',()=>S.n.boot==='nb9'],
 ['item1','Compre um item de estilo de vida',()=>S.n.items.length>0],['car','Compre um carro',()=>S.n.veh.some(v=>['popular','suv','esportivo','limo'].includes(v))],['house','Compre um imóvel',()=>(S.props||[]).length>0],
 ['ls50','Estilo de vida em 50%',()=>S.n.ls>=50],['castelo','Compre um castelo',()=>(S.props||[]).includes('castelo')],['estabulo','Tenha um estábulo',()=>nsHasStable()],
 ['cavalo','Compre um cavalo de corrida',()=>S.n.horses.length>0],['cavaloWin','Vença uma corrida com seu cavalo',()=>(S.n.horseW||0)>=1],['casino','Saia do cassino no lucro',()=>S.casino&&S.casino.net>0],
 ['gf','Arrume uma namorada',()=>!!S.gf],['casar','Case-se',()=>S.rel==='casado'],['spon','Feche um patrocínio',()=>nsHasSp()],
 ['mi1','Junte €1 milhão',()=>S.din>=1],['mi10','Junte €10 milhões',()=>S.din>=10],['mi100','Junte €100 milhões',()=>S.din>=100],
 ['title1','Ganhe um título',()=>(S.titles||[]).length>0],['liga','Seja campeão da liga',()=>(S.titles||[]).some(t=>t.t==='liga')],['cont','Ganhe um título continental',()=>(S.titles||[]).some(t=>t.t==='cont')],
 ['sel','Jogue pela seleção',()=>(S.caps||0)>=1||S.n.is.ap>=1],['bola','Ganhe a Bola de Ouro',()=>(S.awards||[]).some(a=>a.t==='bola')],
];
function nsAchPct(){const n=S.n;if(!n)return 0;return Math.round(Object.keys(n.ach).filter(k=>NS_ACH.some(a=>a[0]===k)).length/NS_ACH.length*1000)/10}
function nsAchCheck(ctx={},silent){const n=S.n;if(!n)return[];const out=[];for(const[id,t,f]of NS_ACH){if(n.ach[id])continue;let ok=false;try{ok=!!f(ctx)}catch(e){}if(ok){n.ach[id]=S.year;out.push({id,t});nsStarAdd(2)}}
 if(!silent)for(const a of out)toast({ic:'🏅',title:'Realização!',txt:a.t,ms:2600,group:'nsach'});return out}
function nsAchHit(id){const n=S.n;if(!n||n.ach[id])return;const a=NS_ACH.find(x=>x[0]===id);if(!a)return;n.ach[id]=S.year;nsStarAdd(2);toast({ic:'🏅',title:'Realização!',txt:a[1],ms:2600,group:'nsach'})}
function nsAchPage(){return{t:'Realizações',cls:'ach',html:()=>{const n=S.n;const p=nsAchPct();
  return`<div class="nsach-h"><b>${String(p).replace('.',',')}%</b>${nsBarHTML(p,'star')}<small>${Object.keys(n.ach).length} de ${NS_ACH.length}</small></div>${NS_ACH.map(([id,t])=>{const y=n.ach[id];return`<div class="nsach ${y?'on':''}"><span>${y?'🏅':'⚪'}</span><b>${esc(t)}</b><small>${y?seasonLbl(y):''}</small></div>`}).join('')}`}}}
// ---------- sala de troféus ----------
function nsTrophyPage(){return{t:'Prêmios',cls:'trophy',html:()=>{const n=S.n;const T=(S.titles||[]).length,A=(S.awards||[]).length;
  return`<div class="nstro-h"><div><b>${T}</b><small>Títulos</small></div><div><b>${A}</b><small>Prêmios</small></div><div><b>${n.cs.motm}</b><small>Estrela do jogo</small></div><div><b>${Object.keys(n.ach).length}</b><small>Medalhas</small></div></div>
  <div class="nstro">${galleryHTML(S.titles||[],S.awards||[],{filter:GALF,wish:true})}</div>`},
 bind:()=>{try{bindGallery(S.titles||[],S.awards||[],f=>{GALF=f;nsRefresh()})}catch(e){}},
 nav:[{ic:'🏅',t:'Realizações',fn:()=>nsPush(nsAchPage())}]}}

{const st=document.createElement('style');st.textContent=`
.nsshop{display:grid;gap:6px}.nstabs.wide.three{grid-template-columns:repeat(3,1fr)}
.nsrow{display:grid;grid-template-columns:44px 1fr auto auto;gap:10px;align-items:center;background:linear-gradient(180deg,var(--panel-2),var(--panel));border:1px solid var(--line-2);border-radius:14px;padding:8px 10px}.nsrow .ic{font-size:30px;text-align:center}.nsrow b{font:800 16px var(--f-body)}.nsrow small{display:block;font-size:12.5px;color:var(--muted);line-height:1.3}.nsrow .own{font:900 20px var(--f-display);min-width:28px;text-align:center}.nsrow .act{display:grid;gap:4px;justify-items:end}.nsrow.owned{border-color:#2f7a45}
.nsbt-h,.nsbt{display:grid;grid-template-columns:40px 1fr 36px 36px 36px 50px auto;gap:6px;align-items:center;text-align:center}.nsbt-h{font:800 11.5px var(--f-body);color:var(--muted);text-transform:uppercase}.nsbt{background:linear-gradient(180deg,var(--panel-2),var(--panel));border:1px solid var(--line-2);border-radius:12px;padding:8px}.nsbt.on{border-color:var(--good);background:#1d4a2c}.nsbt .ic{font-size:24px;border-bottom:4px solid var(--bc);border-radius:4px}.nsbt .nm{text-align:left}.nsbt .nm b{display:block;font:800 14.5px var(--f-body)}.nsbt .nm em{font-style:normal;font-size:11.5px;color:var(--blue);margin-right:6px}.nsbt>span{font:800 14px var(--f-body)}
.nsabl{display:grid;gap:4px;margin-top:6px}.nsabl div{display:grid;grid-template-columns:120px 1fr;gap:8px;font-size:13px}.nsabl span{color:var(--muted)}.nsbtd{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}.nsbtd span{background:#0d2118;border-radius:8px;padding:5px 9px;font:700 13px var(--f-body)}
.nsls-h{display:grid;grid-template-columns:auto 1fr auto;gap:8px;align-items:center;font:800 13px var(--f-body);color:var(--muted);margin:2px 0 4px}
.nscas-bank{display:grid;justify-items:center;gap:2px;background:#0d2118;border:1px solid var(--line-2);border-radius:14px;padding:10px}.nscas-bank span{font:800 12px var(--f-body);color:var(--muted);text-transform:uppercase}.nscas-bank b{font:900 28px var(--f-display);color:var(--gold)}.nscas-bank .good{color:var(--good)}.nscas-bank .bad{color:var(--bad)}
.nscas{display:grid;gap:8px}.nscas-b{display:flex;align-items:center;gap:14px;padding:14px 16px;border-radius:14px;border:1px solid var(--line-2);background:linear-gradient(180deg,#efefef,#cfcfcf);color:#222}.nscas-b span{font-size:34px}.nscas-b b{font:800 20px var(--f-display);letter-spacing:.3px}.nscas-b:disabled{opacity:.4}
.nsempty{display:grid;justify-items:center;gap:8px;text-align:center;padding:20px}.nsempty>span{font-size:54px}.nsempty b{font:800 20px var(--f-display)}
.nsst-h{display:flex;justify-content:space-between;align-items:baseline;gap:8px;flex-wrap:wrap}.nshorse{display:grid;grid-template-columns:44px 1fr auto;gap:10px;align-items:center;background:linear-gradient(180deg,var(--panel-2),var(--panel));border:1px solid var(--line-2);border-radius:14px;padding:8px 10px}.nshorse .hi{font-size:30px;filter:drop-shadow(0 2px 0 var(--hc))}.nshorse b{font:800 16px var(--f-body)}.nshorse small{display:block;font-size:12.5px;color:var(--muted)}.nshorse .act{display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end}.nshorse.mk{opacity:.95;border-style:dashed}
.nstrack{position:relative;display:grid;gap:4px;background:repeating-linear-gradient(90deg,#3a7d2a 0 40px,#357224 40px 80px);border-radius:12px;padding:8px 26px 8px 8px}.nstrack .ln{position:relative;height:30px;border-bottom:1px dashed #ffffff40}.nstrack .ln.me{background:#ffffff22;border-radius:6px}.nstrack .nm{position:absolute;left:4px;top:7px;font:700 11px var(--f-body);color:#fff9;white-space:nowrap}.nstrack .hz{position:absolute;left:0;top:0;font-size:24px;transform:scaleX(-1);filter:drop-shadow(0 2px 0 var(--hc))}.nstrack .fin{position:absolute;right:20px;top:0;bottom:0;width:4px;background:repeating-linear-gradient(180deg,#fff 0 6px,#111 6px 12px)}
.nsach-h{display:grid;justify-items:center;gap:4px;background:#0d2118;border-radius:14px;padding:10px}.nsach-h b{font:900 30px var(--f-display);color:var(--gold)}.nsach-h small{color:var(--muted)}
.nsach{display:grid;grid-template-columns:30px 1fr auto;gap:8px;align-items:center;background:var(--panel);border:1px solid var(--line);border-radius:10px;padding:8px 10px;color:var(--muted)}.nsach.on{background:linear-gradient(90deg,#2f7a45,#1d4a2c);color:#fff;border-color:#4caf50}.nsach b{font:700 14.5px var(--f-body)}.nsach span{font-size:20px}
.nstro-h{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.nstro-h div{display:grid;justify-items:center;background:#0d2118;border-radius:12px;padding:8px 4px}.nstro-h b{font:900 24px var(--f-display);color:var(--gold)}.nstro-h small{font-size:11.5px;color:var(--muted);text-align:center}
@media (max-width:420px){.nsbt-h,.nsbt{grid-template-columns:32px 1fr 26px 26px 26px 40px auto;gap:4px}.nsbt .nm b{font-size:13px}.nsrow{grid-template-columns:36px 1fr auto auto;gap:6px}.nsrow b{font-size:14.5px}}
`;document.head.appendChild(st)}
