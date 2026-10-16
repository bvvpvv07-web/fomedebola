// ================== JORNADA: empresário, peneira-tutorial, tutorial guiado e história ==================

// ---------- EMPRESÁRIO ----------
const AGENTS={
 tubarao:{n:'Rui "Tubarão" Monteiro',t:'Empresário tubarão',ic:'🦈',d:'Famoso, agressivo, tem o telefone de todo presidente de clube.',
  pros:['Propostas de clubes maiores','Salários 20% maiores','5 ligações por temporada','Sua fama cresce mais rápido'],cons:['Fica com 15% do seu salário','Disciplina cai com o tempo','A diretoria desconfia dele']},
 normal:{n:'Agência Passo a Passo',t:'Agência séria',ic:'🤝',d:'Planejamento de carreira com calma, foco em você evoluir.',
  pros:['Treinos rendem 15% mais XP','Empréstimos e renovações equilibrados','4 ligações por temporada'],cons:['Fica com 8% do seu salário','Propostas no seu nível, sem saltos grandes']},
 pai:{n:'Seu pai',t:'A família cuida de tudo',ic:'👨‍👦',d:'Ninguém te defende como ele. Mas ele conhece pouca gente no futebol.',
  pros:['Não cobra comissão','Sua cabeça e a relação com seus pais sobem','Renovações mais fáceis'],cons:['Propostas de clubes menores','Só 3 ligações por temporada','Salários 5% menores']},
};
const AG_FX={tubarao:{wage:1.2,com:.15,xp:1,fama:.08,disc:-.06,board:-.04},normal:{wage:1,com:.08,xp:1.15},pai:{wage:.95,com:0,xp:1,pais:.35,cab:.06,renew:.35}};
try{const ev=EV.find(e=>e.id==='empresario');if(ev)ev.c=()=>false}catch(e){}
function agentCardHTML(k,a,on){return`<button class="agc ${on?'on':''}" data-ag="${k}"><div class="agc-h"><span class="agc-ic">${a.ic}</span><div><b>${esc(a.n)}</b><small>${esc(a.t)}</small></div></div><p>${esc(a.d)}</p><ul class="agl up">${a.pros.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><ul class="agl down">${a.cons.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></button>`}
function setAgent(k,first){S.agent=k;S.agentUses=AGENT_QUOTA[k]||3;
 if(first){if(k==='pai'){S.pais=clamp((S.pais??75)+10,0,100);S.life.cab=clamp(S.life.cab+5,0,100)}if(k==='tubarao'){S.life.fama=clamp(S.life.fama+5,0,100)}}}
function pickAgent(){return new Promise(res=>{
 document.body.classList.remove('onescreen','plan1','rep1');
 $app.innerHTML=`<header class="ph"><div class="ph-in"><span class="flagbox">${NATS[S.nat].f}</span><div class="who"><b>${esc(S.name)} <span style="color:var(--muted);font-weight:600">#${S.num}</span></b><span>15 anos · ${POS[S.pos].n} · sem clube</span></div><div class="ovr"><b class="mono">${S.ovr}</b><small>OVR</small></div></div></header>
 <div class="wrap">${journeyHTML('ob',2,'Antes da peneira, escolha quem vai cuidar da sua carreira.')}
 <section class="card agpick"><div class="eyebrow">Antes da peneira</div><h2 class="h2">Quem vai cuidar da sua carreira?</h2>
 <p class="muted" style="margin:0">Essa escolha mexe em tudo: as propostas que chegam, seu salário, a comissão, sua cabeça e suas relações. Dá pra trocar <b>uma única vez</b> durante a carreira.</p>
 <div class="agcards">${Object.entries(AGENTS).map(([k,a])=>agentCardHTML(k,a)).join('')}</div></section></div>`;
 scrollTo(0,0);
 $app.querySelectorAll('[data-ag]').forEach(b=>b.onclick=()=>{const k=b.dataset.ag;setAgent(k,true);S.agentPicked=true;S.tips=S.tips||{};S.tips.one=true;
  $app.querySelectorAll('[data-ag]').forEach(x=>x.classList.toggle('on',x===b));
  toast({ic:AGENTS[k].ic,title:AGENTS[k].n,txt:'Agora é com você. A peneira começa.',ms:2200});setTimeout(res,650)});
})}
// efeitos do empresário em tudo
const _mkOfferAG=mkOffer;mkOffer=function(x,mul){const o=_mkOfferAG(x,mul);const f=AG_FX[S.agent]||{};if(o&&f.wage&&!o.loan)o.wage=Math.max(1,Math.round(o.wage*f.wage));return o};
const _payWeekAG=payWeek;payWeek=function(n){const f=AG_FX[S.agent]||{};const before=S.din;_payWeekAG(n);if(f.com&&S.st){const w=S.wage*52/1000*.5/Math.max(1,n);const c=w*f.com;S.din-=c;S.agentPaid=(S.agentPaid||0)+c}};
const _lifeTickAG=lifeTick;lifeTick=function(...a){const r=_lifeTickAG.apply(this,a);const f=AG_FX[S.agent]||{};try{
 if(f.fama)S.life.fama=clamp(S.life.fama+f.fama,0,100);if(f.disc)S.life.disc=clamp(S.life.disc+f.disc,0,100);if(f.board)S.board=clamp(S.board+f.board,0,100);
 if(f.pais)S.pais=clamp((S.pais??75)+f.pais,0,100);if(f.cab)S.life.cab=clamp(S.life.cab+f.cab,0,100)}catch(e){}return r};
const _weeklyAG=weeklyTraining;weeklyTraining=async function(k){const f=AG_FX[S.agent]||{};const snap={...(S.xp||{})};const r=await _weeklyAG(k);
 if(f.xp>1&&S.xp){for(const a in S.xp){const d=(S.xp[a]||0)-(snap[a]||0);if(d>0){const b=Math.round(d*(f.xp-1));S.xp[a]+=b;if(b&&r&&r.chips)r.chips.push([`+${b} XP (agência)`,'gold'])}}}return r};
const _negAG=negotiate;negotiate=function(off){const f=AG_FX[S.agent]||{};const r=_negAG(off);if(!r.ok&&f.renew&&ch(f.renew)){off.withdrawn=false;off.wage=Math.round(off.wage*1.08);return{ok:true,txt:`Seu pai segurou a reunião até a diretoria ceder: €${off.wage} mil por semana.`}}return r};
// troca única
function agentSwapPopup(why){
 if(S.agentSwapped)return Promise.resolve(null);
 const others=Object.keys(AGENTS).filter(k=>k!==S.agent);const cur=AGENTS[S.agent]||AGENTS.normal;
 return choicePopup({tag:'Empresário',tagc:'vida',eyebrow:'Só dá pra trocar uma vez',ic:'📞',
  title:why==='offer'?'Outro empresário quer te representar':'Trocar de empresário?',
  text:`Hoje quem cuida de você é ${cur.n}. ${why==='offer'?'Depois da última temporada, outra opção bateu na sua porta.':''} Se trocar, não tem volta.`,
  options:[...others.map(k=>`${AGENTS[k].ic} ${AGENTS[k].n}: ${AGENTS[k].pros[0].toLowerCase()}`),`Ficar com ${cur.n}`],
  pick:i=>{if(i>=others.length)return{txt:'Tudo segue como está.',chips:[]};const k=others[i];setAgent(k,false);S.agentSwapped=true;
   if(k==='pai'){S.pais=clamp((S.pais??75)+12,0,100)}if(cur===AGENTS.pai){S.pais=clamp((S.pais??75)-10,0,100)}
   return{txt:`${AGENTS[k].n} agora cuida da sua carreira. ${k==='tubarao'?'O telefone não para de tocar.':k==='pai'?'Seu pai chorou ao assinar o papel.':'Primeira reunião: planilha, metas e paciência.'}`,chips:[[AGENTS[k].pros[0],'up'],[AGENTS[k].cons[0],'down']]}}});
}
if(typeof oneScreenHub==='function'){const _oshAG=oneScreenHub;oneScreenHub=function(...a){const r=_oshAG.apply(this,a);try{const dm=document.getElementById('dockM');if(dm&&!S.agentSwapped&&!document.getElementById('agSwap')){dm.insertAdjacentHTML('beforeend','<button class="dmi" id="agSwap">🔄 Trocar de empresário (1x)</button>');document.getElementById('agSwap').onclick=()=>agentSwapPopup('menu').then(()=>renderHub())}}catch(e){}return r}}

// ---------- PENEIRA = TUTORIAL ----------
const COACH={n:'Professor Tião',r:'Coordenador da peneira',ic:'🧢'};
const PEN_ST_OUT=[
 {k:'pass',ic:'🎯',n:'Passe',at:'PAS',how:['Encoste o dedo e <b>arraste na direção do passe</b>. Aparece a seta amarela com a força em %.','As linhas pontilhadas mostram o cone de precisão. O tempo fica lento enquanto você mira.','Mire no <b>companheiro com anel azul</b> e solte. Seta maior, passe mais forte.'],tip:'Passe, lançamento e cruzamento usam esse mesmo gesto nos jogos.'},
 {k:'dribble',ic:'⚡',n:'Drible',at:'DRI',how:['Você corre sozinho com a bola. O marcador vem de frente.','Quando o anel em volta dele fechar no <b>dourado</b>, <b>arraste o dedo pro lado da seta verde</b>: é pra lá que você dribla.','Pernas abertas (seta azul)? <b>Arraste pra cima</b>: caneta!'],tip:'Cedo demais ele lê o drible; tarde demais ele toma a bola. Sincronia é tudo.'},
 {k:'finish',ic:'🥅',n:'Finalização',at:'FIN',how:['<b>Seta longa</b> = chute forte. Perto de 100% a bola sobe demais.','Mire nos cantos. Bola no meio, o goleiro pega.','Logo depois de chutar, <b>arraste o dedo pro lado</b> pra dar efeito.'],tip:'Nos jogos, cada lance desses pode virar gol de verdade na súmula.'},
 {k:'header',ic:'🤯',n:'Cabeçada',at:'FIS',how:['O cruzamento vem lá da ponta.','<b>Mire antes</b>: arraste na direção do gol e segure o dedo.','Ele cabeceia sozinho quando a bola chegar.'],tip:'Escanteio e cruzamento viram gol pra quem sobe no tempo certo.'},
 {k:'fk',ic:'🌀',n:'Falta',at:'FIN',how:['Arraste <b>na direção do gol</b>, por fora da barreira, e solte.','<b>Logo depois</b>, arraste o dedo pro lado: a bola curva.','Força em torno de 75% passa por cima da barreira e cai no gol.'],tip:'Quem bate bem falta pode pedir a cobrança ao treinador.'},
];
const PEN_ST_GK=[
 {k:'keeper',ic:'🧤',n:'Reflexo',at:'REF',how:['O atacante vai chutar.','Na hora do chute, <b>arraste do goleiro até onde a bola vai</b>.','Pular antes da hora entrega o outro canto.'],tip:'Nos jogos, os chutes contra o seu gol aparecem assim.'},
 {k:'keeper',ic:'🧤',n:'Bola no ângulo',at:'REF',how:['Agora ele vai caprichar.','Arraste pro alto pra voar no ângulo.','Quanto melhor seu REF, mais longe você alcança.'],tip:'Defesa difícil vale nota alta.'},
 {k:'long',ic:'🚀',n:'Reposição',at:'PAS',how:['Goleiro também joga com os pés.','<b>Seta longa</b> pra lançar no companheiro lá na frente.','Mire no anel azul.'],tip:'Reposição boa começa contra-ataque.'},
];
function penStations(){return S.pos==='GOL'?PEN_ST_GK:PEN_ST_OUT}
function demoSVG(k){const gk=k==='keeper';if(k==='dribble')return`<svg class="demo" viewBox="0 0 160 110"><rect width="160" height="110" rx="10" fill="#3a9a3e"/><ellipse cx="80" cy="52" rx="30" ry="10" fill="none" stroke="#f2c443" stroke-width="3" class="dring"/><rect x="74" y="28" width="12" height="22" rx="4" fill="#f4f4f4"/><path d="M88 52 L118 46" stroke="#6eff96" stroke-width="4" stroke-linecap="round"/><path d="M118 46l-8-5v10z" fill="#6eff96"/><path d="M68 40v14" stroke="#ff5046" stroke-width="4"/><circle cx="80" cy="88" r="5" fill="#fff"/><g class="dfinger sw"><text x="-7" y="6" font-size="16">👆</text></g></svg>`;
 return`<svg class="demo" viewBox="0 0 160 110"><defs><linearGradient id="dg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2e7d32"/><stop offset="1" stop-color="#4caf50"/></linearGradient></defs><rect width="160" height="110" rx="10" fill="url(#dg)"/>
 <path d="M50 22h60v18H50z" fill="none" stroke="#fff" stroke-width="2"/><circle cx="80" cy="${gk?60:78}" r="5" fill="#fff" class="${gk?'dball':''}"/>
 ${gk?'<g class="dkeeper"><rect x="74" y="26" width="12" height="16" rx="4" fill="#3cdc5a"/></g>':'<path class="dline" d="M80 78 Q 92 52 98 30" stroke="#ffd34a" stroke-width="3" stroke-dasharray="4 4" fill="none"/>'}
 <g class="dfinger ${gk?'gk':''}"><circle cx="0" cy="0" r="9" fill="rgba(255,255,255,.35)" stroke="#fff"/><text x="-7" y="6" font-size="16">👆</text></g></svg>`}
function coachCard(st,i,n){return new Promise(res=>{
 $ov.hidden=false;
 $ov.innerHTML=`<div class="ovwrap coachc"><div class="cc-top"><span class="cc-av">${COACH.ic}</span><div><b>${COACH.n}</b><small>${COACH.r}</small></div><span class="tag campo">Estação ${i+1} de ${n}</span></div>
 <div class="cc-ic">${st.ic}</div><h2 class="pkh">${esc(st.n)}</h2>${demoSVG(st.k)}
 <ol class="cc-how">${st.how.map(h=>`<li>${h}</li>`).join('')}</ol><p class="cc-tip">💡 ${esc(st.tip)}</p>
 <p class="muted" style="font-size:12.5px;margin:4px 0 10px">É treino: errar aqui só tira um pouquinho da impressão dos olheiros.</p>
 <button class="btn wide" id="ccGo">Bora!</button></div>`;
 document.getElementById('ccGo').onclick=()=>{SFX.ctx();res()};
})}
const COACH_OK=['Isso! Foi exatamente o que eu pedi.','Olha só… os olheiros anotaram.','Bonito! Faz de novo no jogo-treino.','Tem qualidade, hein.'];
const COACH_BAD=['Calma, respira. No jogo vai sair.','Faltou pouco. Entendeu o movimento?','Errou, mas é assim que se aprende.','Na próxima você acerta.'];
async function penCircuit(){
 PEN.circ=PEN.circ||[];const sts=penStations();const i=PEN.circ.length;
 if(i>=sts.length){PEN.step=4;renderPeneira();return}
 const rows=sts.map((s,j)=>{const r=PEN.circ[j];return`<div class="pst ${r?(r.ok?'ok':'bad'):j===i?'on':''}"><span class="pst-ic">${r?(r.ok?'✓':'✗'):s.ic}</span><div><b>${esc(s.n)}</b><small>${r?esc(r.txt):j===i?'Próxima':'Aguardando'}</small></div>${r?`<span class="chip ${r.d>=0?'up':'down'}">${r.d>=0?'+':''}${r.d}</span>`:''}</div>`}).join('');
 penShell(`<section class="card" style="display:grid;gap:12px"><div class="row" style="gap:10px;align-items:center"><span class="cc-av sm">${COACH.ic}</span><div><div class="eyebrow">Circuito de habilidades</div><b>${COACH.n}</b></div></div>
 <p class="muted" style="margin:0">${i===0?`"Aqui vocês vão aprender tudo que acontece num jogo de verdade. Cada estação é um lance que vai aparecer na sua carreira. Presta atenção."`:`"Próxima estação. ${i===sts.length-1?'É a última, capricha.':'Tá indo bem.'}"`}</p>
 <div class="psts">${rows}</div><button class="btn wide" id="pstGo">${i===0?'Começar o circuito':'Próxima estação'}</button></section>`);
 document.getElementById('pstGo').onclick=async()=>{const st=sts[i];await coachCard(st,i,sts.length);
  const sk=clamp((typeof skillOf==='function'?skillOf(st.at):.6)+.12,.3,.95);
  const r=await nssMoment({kind:st.k,comp:'Peneira',title:st.n,skill:sk,keeper:.3,planned:true,defs:2,need:2,speed:.9,okTxt:'Boa!'});
  const d=r.ok?(r.perfect?RI(7,10):RI(4,7)):-RI(1,3);const txt=r.ok?(r.perfect?'Perfeito':'Acertou'):'Errou';
  PEN.circ.push({ok:r.ok,d,txt,at:st.at,perfect:!!r.perfect});penLog(`Estação de ${st.n.toLowerCase()}: ${txt.toLowerCase()}`,d);
  toast({ic:COACH.ic,title:COACH.n,txt:(r.ok?COACH_OK:COACH_BAD)[i%4],ms:2600});penCircuit()};
}
const _renderPenJ=renderPeneira;
renderPeneira=function(){if(PEN.step===3)return penCircuit();return _renderPenJ()};
// história + empresário antes da peneira
const _startPenJ=startPeneira;
startPeneira=async function(){
 if(!S.agentPicked){await storyChapter(storyIntro());await pickAgent()}
 PEN.circ=[];return _startPenJ()};

// ---------- TUTORIAL GUIADO (coachmarks) ----------
let TOUR=null;
function coachTour(key,steps){
 S.tips=S.tips||{};if(S.tips[key]||TOUR)return;
 const list=steps.filter(s=>document.querySelector(s.sel));if(!list.length)return;S.tips[key]=true;
 let i=0;const host=document.createElement('div');host.id='tour';document.body.appendChild(host);TOUR=host;
 const close=()=>{host.remove();TOUR=null;removeEventListener('resize',draw)};
 function draw(){const s=list[i];const el=document.querySelector(s.sel);if(!el){i++;if(i>=list.length)return close();return draw()}
  el.scrollIntoView({block:'nearest'});const r=el.getBoundingClientRect();const pad=6;
  const top=r.bottom+12+180<innerHeight?r.bottom+12:Math.max(12,r.top-12-190);
  host.innerHTML=`<div class="tr-hole" style="left:${r.left-pad}px;top:${r.top-pad}px;width:${r.width+pad*2}px;height:${r.height+pad*2}px"></div>
  <div class="tr-bub" style="top:${top}px"><div class="tr-h"><span class="cc-av sm">${COACH.ic}</span><b>${esc(s.t)}</b><small>${i+1}/${list.length}</small></div><p>${s.d}</p>
  <div class="tr-act"><button class="lnk" id="trSkip">Pular tutorial</button><button class="btn small" id="trNx">${i===list.length-1?'Entendi!':'Próximo'}</button></div></div>`;
  document.getElementById('trNx').onclick=()=>{i++;if(i>=list.length)close();else draw()};document.getElementById('trSkip').onclick=close}
 addEventListener('resize',draw);setTimeout(draw,60);
}
const TOUR_HUB=[
 {sel:'.ph',t:'Este é você',d:'Idade, posição, clube e <b>OVR</b>, o seu nível atual. Ele sobe com treino, jogos e boas escolhas.'},
 {sel:'.week, .blockcard',t:'A semana até o jogo',d:'Cada dia livre você escolhe uma atividade. No dia marcado tem jogo. No modo rápido, os jogos vêm em blocos.'},
 {sel:'[data-wt="treino"]',t:'Treinar',d:'Os mesmos minigames da peneira. Cada treino dá <b>XP</b> nos atributos; XP cheio vira +1 de atributo.'},
 {sel:'[data-wt="rel"]',t:'Relações',d:'Namorada, pais, técnico e diretoria. <b>Técnico feliz te escala mais</b>; pais por perto seguram sua cabeça.'},
 {sel:'[data-wt="loja"]',t:'Loja',d:'Chuteiras melhoram atributos de verdade. O dinheiro do salário serve pra isso.'},
 {sel:'[data-wt="imoveis"]',t:'Imóveis',d:'Casa pros pais, apartamento pra alugar. Patrimônio que rende.'},
 {sel:'[data-wt="cassino"]',t:'Cassino',d:'Cavalos, roleta, caça-níquel e 21. Diverte, mas perder demais derruba sua cabeça.'},
 {sel:'[data-wt="vida"]',t:'Vida',d:'Hobbies, música… e escolhas perigosas que podem acabar com a carreira.'},
 {sel:'#wRest',t:'Descansar',d:'Recupera o corpo. Jogar cansado aumenta o risco de lesão.'},
 {sel:'.hubnav',t:'Tudo numa tela',d:'Jogos, tabela, copas, troféus e o seu jogador ficam nesses botões.'},
 {sel:'#dockMore',t:'Mais opções',d:'Trocar modo rápido/completo, ligar pro empresário, <b>trocar de empresário uma vez</b> e simular.'},
 {sel:'#a1',t:'Hora do jogo',d:'Quando estiver pronto, jogue. Lances importantes viram minigame e decisões aparecem na tela.'},
];
const TOUR_PLAN=[
 {sel:'.behs',t:'Seu estilo',d:'Como você vive a temporada: mais profissional rende mais em campo; vida de estrela dá fama e risco.'},
 {sel:'[data-pt="train"]',t:'Treino da pré-temporada',d:'Um minigame valendo forma e atributos antes de a bola rolar.'},
 {sel:'[data-pt="reqs"]',t:'Pedidos ao clube',d:'Peça camisa, braçadeira, aumento ou renovação. A diretoria pode negar.'},
 {sel:'[data-pt="agent"]',t:'Empresário',d:'Ligações por temporada pra buscar clube ou empréstimo. Depende de quem você escolheu.'},
 {sel:'[data-pt="life"]',t:'Vida e loja',d:'Compras e relações também ficam aqui.'},
 {sel:'.ctabar',t:'Começar',d:'Quando estiver tudo certo, comece a temporada.'},
];
const _renderHubJ=renderHub;renderHub=function(...a){const r=_renderHubJ.apply(this,a);try{if(S&&S.agentPicked&&$ov.hidden)setTimeout(()=>{if($ov.hidden)coachTour('tourHub',TOUR_HUB)},350)}catch(e){}return r};
const _renderPlanJ=renderPlanning;renderPlanning=function(...a){const r=_renderPlanJ.apply(this,a);try{if(S&&S.agentPicked)setTimeout(()=>{if($ov.hidden)coachTour('tourPlan',TOUR_PLAN)},350)}catch(e){}return r};
const _shellJ=shell;shell=function(...a){if(TOUR){TOUR.remove();TOUR=null}return _shellJ.apply(this,a)};

// ---------- HISTÓRIA ----------
function first(){return(S.name||'').trim().split(/\s+/)[0]}
function pickT(a){return a[(Math.random()*a.length)|0]}
function storyLog(){S.story=S.story||{seen:{},log:[]};return S.story}
function storyChapter(ch){return new Promise(res=>{
 const st=storyLog();if(ch.key&&st.seen[ch.key]){res();return}if(ch.key)st.seen[ch.key]=true;
 const n=st.log.length+1;st.log.push({n,title:ch.title,txt:ch.txt,ic:ch.ic,age:S.age,year:S.year});
 $ov.hidden=false;
 $ov.innerHTML=`<div class="ovwrap story"><div class="st-glow"></div><div class="eyebrow st-eb">Capítulo ${n}</div><div class="st-ic">${ch.ic||'📖'}</div><h2 class="st-t">${esc(ch.title)}</h2>
 <p class="st-txt" id="stTxt"></p><div class="st-meta">${esc(S.name)}${ch.key==='intro'?'':' · '+S.age+' anos'}${S.club&&CLUB[S.club]?' · '+esc(CLUB[S.club].n):''}</div><button class="btn wide" id="stOk" style="opacity:0">Continuar</button></div>`;
 const el=document.getElementById('stTxt');const full=ch.txt;let i=0;const sp=reduced?full.length:2;
 const btn=document.getElementById('stOk');
 const tick=()=>{i=Math.min(full.length,i+sp);el.textContent=full.slice(0,i);if(i<full.length)t=setTimeout(tick,16);else btn.style.opacity=1};let t=setTimeout(tick,500);
 $ov.querySelector('.story').onclick=e=>{if(e.target.id==='stOk')return;if(i<full.length){i=full.length;el.textContent=full;btn.style.opacity=1}};
 btn.onclick=()=>{clearTimeout(t);$ov.hidden=true;$ov.innerHTML='';res()};
})}
function storyIntro(){const nat=NATS[S.nat];const pos=POS[S.pos].n.toLowerCase();const heart=S.heart&&CLUB[S.heart]?CLUB[S.heart].n:null;
 return{key:'intro',ic:'🌅',title:'O campinho',txt:`${pickT(['Num campinho de terra','Numa quadra de cimento rachado','Num terreno baldio com traves de bambu'])} ${nat.n==='Brasil'?'do interior do Brasil':'em '+nat.n}, um garoto de 15 anos chamado ${first()} ${pickT(['passava as tardes inteiras atrás da bola','gastava a sola do tênis todo mês','era sempre o primeiro escolhido no par ou ímpar'])}. Jogava de ${pos}${heart?`, sonhava com a camisa do ${heart}`:''} e tinha uma chuteira emprestada do primo. ${pickT(['A mãe dizia pra estudar. O pai dizia pra não desistir.','Na rua todo mundo dizia que ele ia longe. Ninguém dizia como.','O sonho era simples: viver de futebol.'])} Agora, a primeira porta: a peneira.`}}
function storyAcademy(){const c=CLUB[S.club];return{key:'academia',ic:'🏟️',title:'A camisa da base',txt:`O ${c.n} ficou com ${first()}. ${pickT(['Ele assinou o contrato de formação na mesa da cozinha, com a mãe chorando do lado.','Na primeira noite no alojamento, quase não dormiu de ansiedade.','A mala tinha duas camisas, um par de chuteiras e muita vontade.'])} Agora começa a base: ${pickT(['treino de manhã, escola à tarde e jogo no fim de semana.','competições de base, olheiros e uma regra clara: até os 20 anos, ou sobe, ou fica pelo caminho.'])} ${AGENTS[S.agent]?`Quem cuida dos contratos é ${AGENTS[S.agent].n}.`:''}`}}
function storySeason(ls){
 const r=ls.row||{};const c=CLUB[r.club]||club();const cn=c?c.n:'';const T=(ls.titles||[]);const A=(ls.awards||[]);const N=(ls.news||[]).map(x=>x.t);
 const has=k=>T.some(t=>(t.ic||t.t)===k);let g=r.goals||0,j=r.games||0,nt=r.nota||0;const B=ls.stats&&ls.stats.Base;if(B&&!j){j=B.j||0;g=B.g||0;nt=B.nn?B.ns/B.nn:nt}const gk=S.pos==='GOL';
 let ic='📖',title,lead;
 if(A.some(a=>a.t==='bola')){ic='🏆';title='O melhor do mundo';lead=`Paris, smoking, flashes. O nome anunciado foi o de ${first()}. O garoto do campinho levou a Bola de Ouro.`}
 else if(has('copa_mundo')){ic='🌍';title='Campeão do mundo';lead=`${first()} levantou a Copa do Mundo. Um país inteiro na rua por causa de um grupo de jogadores, e ele era um deles.`}
 else if(has('liberta')||has('orelhas')){ic='🏆';title='Glória continental';lead=`O ${cn} conquistou o continente, e ${first()} estava em campo na noite que a cidade nunca vai esquecer.`}
 else if(N.includes('promo')){ic='🎉';title='O garoto subiu';lead=`Depois de ${S.age>=19?'muita espera':'pouco tempo'} na base, ${first()} foi chamado pro time profissional do ${cn}. O vestiário de cima tem outro cheiro.`}
 else if(N.includes('nopromo')&&S.flags&&S.flags.release){ic='🎒';title='Recomeço';lead=`O ${cn} não acreditou nele. Aos ${S.age} anos, ${first()} arrumou a mala e foi provar o contrário em outro lugar.`}
 else if(has('liga')){ic='🥇';title='Campeão!';lead=`O ${cn} foi campeão${r.lg?' da '+r.lg:''}. ${first()} ${j>25?'foi peça fundamental':'fez parte do grupo'} e vai lembrar dessa volta olímpica pra sempre.`}
 else if(T.length&&!has('base')){ic='🏅';title='Taça no armário';lead=`Teve taça: ${T.map(t=>t.n).slice(0,2).join(' e ')}. ${first()} começa a colecionar histórias pra contar.`}
 else if(has('base')){ic='🌱';title='Campeão na base';lead=`O ${cn} foi campeão na base e ${first()} começou a ser notado pelos treinadores de cima.`}
 else if(r.move==='down'){ic='📉';title='O fundo do poço';lead=`O ${cn} caiu. No vestiário, silêncio. ${first()} saiu do estádio pela porta dos fundos.`}
 else if(r.move==='up'){ic='📈';title='Subindo de divisão';lead=`Acesso! O ${cn} subiu, e ${first()} ajudou a escrever essa página.`}
 else if(!gk&&g>=20){ic='⚽';title='Artilheiro';lead=`${g} gols na temporada. A torcida do ${cn} já canta o nome de ${first()}.`}
 else if(gk&&(r.cs||0)>=15){ic='🧤';title='Muralha';lead=`${r.cs} jogos sem sofrer gol. Atrás de ${first()} não passa nada.`}
 else if(j<8&&!S.youth){ic='🪑';title='Banco de reservas';lead=`Pouco espaço no ${cn}: ${j} jogos. ${first()} passou a temporada olhando do banco e engolindo seco.`}
 else if(S.age>=33){ic='⏳';title='O tempo não para';lead=`Aos ${S.age}, o corpo já reclama no dia seguinte. Mas ${first()} ainda sabe o que fazer com a bola.`}
 else if(nt>=7.3){ic='🚀';title='Em ascensão';lead=`Temporada de gente grande no ${cn}: nota ${fmt2(nt)}. Os olheiros de clubes maiores começaram a aparecer.`}
 else if(nt&&nt<6.4){ic='🌧️';title='Temporada pra esquecer';lead=`Nada deu certo no ${cn}. Nota ${fmt2(nt)}. ${first()} precisa reagir.`}
 else{ic='🧱';title=S.youth?'Tijolo por tijolo':'Construindo o nome';lead=`${S.youth?'Mais uma temporada na base do':'Mais uma temporada no'} ${cn}: ${j} jogos${gk?'':`, ${g} gols`}. Sem alarde, ${first()} vai ganhando espaço.`}
 const extra=[];
 if(A.length&&!A.some(a=>a.t==='bola'))extra.push(`Ainda levou ${A.map(a=>a.n).slice(0,2).join(' e ')}.`);
 if(r.delta>=3)extra.push(`Evoluiu muito: +${r.delta} de OVR.`);else if(r.delta<=-2)extra.push(`O nível caiu ${-r.delta} pontos.`);
 if(S.rel==='casado'&&!storyLog().seen.casou){storyLog().seen.casou=1;extra.push('Fora de campo, o casamento trouxe paz.')}
 if(S.filhos&&!storyLog().seen['filho'+S.filhos]){storyLog().seen['filho'+S.filhos]=1;extra.push(S.filhos===1?'E nasceu o primeiro filho.':'A família cresceu.')}
 if(S.ficha>=1&&!storyLog().seen.ficha){storyLog().seen.ficha=1;extra.push('A ficha na polícia, porém, virou assunto em todo canto.')}
 return{key:'s'+(r.year??S.year),ic,title,txt:lead+(extra.length?' '+extra.join(' '):'')};
}
function storyRetire(card){const t=TIERS[card.tier]?TIERS[card.tier][1]:'';return{key:'fim',ic:'👋',title:'A despedida',txt:`${card.tot.games} jogos, ${S.pos==='GOL'?card.tot.cs+' sem sofrer gol':card.tot.goals+' gols'}, ${card.nTitles} títulos. O garoto do campinho pendura as chuteiras. ${pickT(['No último jogo, o estádio inteiro aplaudiu de pé.','Ele saiu de campo devagar, olhando cada canto do gramado.','Os filhos entraram em campo pra última foto.'])} Na história do futebol, o nome de ${S.name} fica como: ${t}.`}}
// ganchos
const _startPreJ=startPreseason;startPreseason=function(...a){
 const firstPre=S&&S.agentPicked&&!(S.story&&S.story.seen.academia)&&S.club;
 if(firstPre){storyChapter(storyAcademy()).then(()=>_startPreJ.apply(this,a));return}
 const r=_startPreJ.apply(this,a);
 try{if(S.agentPicked&&!S.agentSwapped&&!S.flags.agOffer&&S.age>=19&&!S.youth&&S.lastSeason&&((S.lastSeason.nota||7)<6.5||ch(.25))){S.flags.agOffer=true;setTimeout(()=>{if($ov.hidden)agentSwapPopup('offer').then(o=>{if(o)renderPlanning()})},500)}}catch(e){}
 return r};
const _seShowJ=runSeasonEndShow;runSeasonEndShow=async function(ls){await _seShowJ(ls);try{if(S.agentPicked&&ls)await storyChapter(storySeason(ls))}catch(e){console.error(e)}};
if(typeof retireShow==='function'){const _rsJ=retireShow;retireShow=async function(card){try{if(S.agentPicked)await storyChapter(storyRetire(card))}catch(e){}return _rsJ(card)}}
// livro da carreira no painel do jogador
const _ohpJ=openHubPanel;openHubPanel=function(k){_ohpJ(k);if(k!=='jogador')return;const b=document.getElementById('ppB');const st=S.story;if(!b||!st||!st.log.length)return;
 b.insertAdjacentHTML('beforeend',`<section class="card book"><div class="eyebrow">📖 Sua história</div>${st.log.slice().reverse().map(c=>`<details class="bk"><summary><span>${c.ic||'📖'}</span><b>Cap. ${c.n} · ${esc(c.title)}</b><small>${c.age} anos</small></summary><p>${esc(c.txt)}</p></details>`).join('')}</section>`)};
