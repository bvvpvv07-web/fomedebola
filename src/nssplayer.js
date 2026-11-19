// ================== SEU CRAQUE: VISUAL, CAMISA, STAFF, PATROCÍNIOS E RELAÇÕES (estilo NSS) ==================
// Personalizar o jogador (pele, cabelo, barba, acessório, chuteira, nome e número na camisa) — vale no 3D.
// No lance só o seu jogador é seu: os companheiros jogam pela IA (o motor recebe onlyHero). Escudo no peito.
// Contrato com agente e treinador pessoal, patrocínios por categoria pagos por jogo, propostas de marcas,
// ações de relacionamento com pergunta antes (✓/✕) e corrida de cavalos com pista de verdade.
const NS_STAFF={
 ag:[{t:1,n:'Agente Amador',p:.02,pct:.08,sp:.04,d:'+8% em salário, bônus e patrocínio. Um pouco mais de propostas.'},{t:2,n:'Agente Profissional',p:.15,pct:.15,sp:.08,d:'+15% em tudo e mais marcas te procurando.'},{t:3,n:'Agente Especialista',p:.6,pct:.25,sp:.14,d:'+25% em tudo, negocia contrato muito melhor.'}],
 tr:[{t:1,n:'Treinador Amador',p:.02,en:10,tg:.1,d:'+10% de energia por semana e treino 10% melhor.'},{t:2,n:'Treinador Profissional',p:.15,en:20,tg:.2,d:'+20% de energia por semana e treino 20% melhor.'},{t:3,n:'Treinador Especialista',p:.6,en:30,tg:.35,d:'+30% de energia por semana e treino 35% melhor.'}]};
const NS_STAFF_WK=40;
const NS_SCAT=[['boot','Chuteiras','👟',1.2],['drink','Bebida esportiva','🥤',.8],['sport','Roupas esportivas','🎽',1],['casual','Roupa casual','👕',.7],['food','Comida','🍔',.6],['cosm','Cosméticos','🧴',.6],['watch','Relógio','⌚',.9],['elec','Eletrônicos','📱',.9],['jewel','Joias','💍',.8],['car','Carro','🚗',1.3]];
function nsMig(){const n=S&&S.n;if(!n)return;n.sps=n.sps||{};n.staff=n.staff||{ag:null,tr:null};n.look=n.look||{name:'',boot:''};
 if(n.spon){n.sps.sport={b:n.spon.n,w:n.spon.w,wk:30};n.spon=null}}
{const _nsS=nsSync;nsSync=function(){try{nsMig()}catch(e){}return _nsS.apply(this,arguments)}}
function nsShirtName(){const n=S.n;const v=(n&&n.look&&n.look.name||'').trim();if(v)return v;const p=(S.name||'').trim().split(/\s+/);return p.length>1?p[p.length-1]:p[0]||'CRAQUE'}

// ---------- patrocínios ----------
function nsSpOffer(force){const n=S.n;const free=NS_SCAT.filter(c=>!n.sps[c[0]]);if(!free.length)return null;const ag=(S.n.staff.ag&&NS_STAFF.ag[S.n.staff.ag.t-1])||{sp:0};
 const p=force?clamp(.2+n.star.l*.05+n.rel.fans/250+ag.sp,.1,.9):clamp(.05+n.star.l*.012+n.rel.fans/1000+ag.sp,.02,.45);if(!ch(p))return null;
 const c=pick(free);const used=new Set(Object.values(n.sps).map(x=>x.b));const b=pick(NS_BRANDS.filter(x=>!used.has(x)))||pick(NS_BRANDS);
 const w=Math.max(1,Math.min(Math.max(2,Math.round((S.wage||1)*.7)),Math.round((n.star.l**1.3)*(.35+n.rel.fans/130)*c[3]*R(.8,1.2))));
 return{cat:c[0],b,w,wk:RI(20,40)}}
function nsSpWeek(st){const n=S.n;nsMig();if(nsHasSp()){n.rel.spon=clamp(n.rel.spon-.8,0,100);
  for(const k of Object.keys(n.sps)){const s=n.sps[k];s.wk--;const cat=NS_SCAT.find(c=>c[0]===k);
   if(s.wk<=0||(n.rel.spon<15&&ch(.25))){(st.lifeNews=st.lifeNews||[]).push(s.wk<=0?`Acabou o contrato com a ${s.b} (${cat?cat[1]:k}).`:`A ${s.b} cancelou o patrocínio: a relação esfriou.`);delete n.sps[k]}}}
 if(!n.spOffer){const o=nsSpOffer(false);if(o)n.spOffer=o}}
async function nsSpOfferPop(){const n=S.n;const o=n&&n.spOffer;if(!o)return;const cat=NS_SCAT.find(c=>c[0]===o.cat);
 const k=await nsPop({ic:'📩',title:'Proposta de patrocínio',txt:`A ${o.b} quer você na campanha de ${cat[1].toLowerCase()}: ${nsK(o.w)} por jogo durante ${o.wk} semanas.`,opts:[['y','✓ Aceitar']],ok:'✕ Recusar'});
 n.spOffer=null;if(k==='y'){n.sps[o.cat]={b:o.b,w:o.w,wk:o.wk};n.rel.spon=Math.max(n.rel.spon,55);try{nsAchHit('spon')}catch(e){}toast({ic:cat[2],title:`${o.b} fechado!`,txt:`+${nsK(o.w)} por jogo`,ms:2200})}}
// as propostas aparecem no fim da sequência do pós-jogo
{const _pmN2=nsPostMatch;nsPostMatch=async function(){const r=await _pmN2.apply(this,arguments);try{await nsSpOfferPop()}catch(e){}try{const st=nsStaffExpired();if(st)await nsPop({ic:'📄',title:'Contrato terminou',txt:st,opts:[['h','Renovar']],ok:'Depois'}).then(k=>{if(k==='h')nsOpen(nsStaffPage())})}catch(e){}return r}}
// ---------- staff (agente e treinador pessoal) ----------
function nsStaffWeek(st){const n=S.n;nsMig();for(const k of['ag','tr']){const s=n.staff[k];if(!s)continue;s.wk--;if(s.wk<=0){n.staff[k]=null;n.staffEnd=(n.staffEnd||[]).concat(NS_STAFF[k][s.t-1].n)}}}
function nsStaffExpired(){const n=S.n;if(!n.staffEnd||!n.staffEnd.length)return null;const t=`Terminou o contrato do ${n.staffEnd.join(' e do ')}.`;n.staffEnd=[];return t}
function nsStaffPage(){return{t:'Agente e treinador',cls:'staff',html:()=>{const n=S.n;nsMig();
  const row=(k,x)=>{const cur=n.staff[k];const on=cur&&cur.t===x.t;return`<div class="nsrow ${on?'owned':''}"><span class="ic">${k==='ag'?'💼':'⏱️'}<i>${'★'.repeat(x.t)}</i></span><div class="mid"><b>${esc(x.n)}</b><small>${esc(x.d)}</small>${on?`<small class="good">Contratado · ${cur.wk} semanas</small>`:''}</div><div class="act"><button class="btn small ${on?'ghost':''}" data-hs="${k}:${x.t}">${on?'Renovar':''} ${money(x.p)}</button></div></div>`};
  return`<p class="muted nshelp">Contrato de ${NS_STAFF_WK} semanas. O agente aparece na coluna "Agente" do dinheiro da semana; o treinador na coluna "Treinador" da energia.</p>
  <div class="eyebrow">Agente</div>${NS_STAFF.ag.map(x=>row('ag',x)).join('')}<div class="eyebrow" style="margin-top:6px">Treinador pessoal</div>${NS_STAFF.tr.map(x=>row('tr',x)).join('')}`},
 bind:B=>B.querySelectorAll('[data-hs]').forEach(b=>b.onclick=async()=>{const[k,t]=b.dataset.hs.split(':');const x=NS_STAFF[k][+t-1];const cur=S.n.staff[k];
  if(cur&&cur.t!==x.t){const q=await nsPop({ic:'📝',title:`Trocar por ${x.n}?`,txt:'O contrato atual é cancelado sem reembolso.',opts:[['y','Trocar']],ok:'Cancelar'});if(q!=='y')return}
  if(!nsPay(x.p))return;S.n.staff[k]={t:x.t,wk:NS_STAFF_WK};toast({ic:k==='ag'?'💼':'⏱️',title:`${x.n} contratado`,txt:`${NS_STAFF_WK} semanas`,ms:2000});nsRefresh()})}}

// ---------- abas novas da tela principal: Contrato e Patrocínio ----------
function nsMarketValue(){const a=S.age;const af=a<=21?1.6:a<=24?1.3:a<=28?1:a<=31?.6:.3;return Math.max(.01,.08*Math.pow(1.17,S.ovr-50)*af*(1+Math.max(0,(S.pot||S.ovr)-S.ovr)/40))}
function nsCtTabHTML(){const n=S.n;const c=club();const ct=nsCt();let pos='';try{const T=sortTable(S.st.table);const i=T.findIndex(x=>x.id===c.id);if(i>=0)pos=` · ${i+1}º`}catch(e){}
 const ag=n.staff.ag?NS_STAFF.ag[n.staff.ag.t-1]:null,tr=n.staff.tr?NS_STAFF.tr[n.staff.tr.t-1]:null;
 return`<table class="nstab nsct"><tbody><tr><th>Clube</th><td>${shieldHTML(c,'sm')} ${esc(c.n)}${S.loan?' (emprestado)':''}</td></tr><tr><th>Liga</th><td>${esc(LG[c.l].n)}${pos}</td></tr>
 <tr><th>Salário</th><td>${nsK(ct.wage)} / semana</td></tr><tr><th>Bônus por gol</th><td>${nsK(ct.gb)}</td></tr><tr><th>Bônus por assistência</th><td>${nsK(ct.ab)}</td></tr><tr><th>Contrato até</th><td>${S.year+Math.max(0,S.contract)}</td></tr></tbody></table>
 <div class="nsg"><button class="nsc b" id="ctRenew"><span>✍️</span>Renovar contrato</button><div class="nsc"><span>💶</span><div><small>Valor de mercado</small>${money(nsMarketValue())}</div></div>
 <button class="nsc b" id="ctAg"><span>💼</span><div><b>Agente</b><small>${ag?`${esc(ag.n.replace('Agente ',''))} · ${n.staff.ag.wk} sem.`:'Sem contrato'}</small></div></button><button class="nsc b" id="ctTr"><span>⏱️</span><div><b>Treinador</b><small>${tr?`${esc(tr.n.replace('Treinador ',''))} · ${n.staff.tr.wk} sem.`:'Sem contrato'}</small></div></button>
 <button class="nsc b" id="ctRaise"><span>💰</span>Pedir aumento</button><button class="nsc b" id="ctMore"><span>📋</span>Bônus, mercado, bolas paradas</button></div>`}
function nsSpTabHTML(){const n=S.n;nsMig();const tot=nsSpW();const agp=nsAgentPct();const cap=S.captain?.1:0;
 return`<table class="nstab nssp"><tbody>${NS_SCAT.map(([k,nm,ic])=>{const s=n.sps[k];return`<tr class="${s?'on':''}"><th>${ic} ${nm}</th><td>${s?`<small>${esc(s.b)} · ${s.wk} sem.</small> ${nsK(s.w)}`:'—'}</td></tr>`}).join('')}
 <tr class="tot"><th>Total por jogo</th><td>${nsK(tot)}</td></tr></tbody></table>
 <div class="nssp-x"><span>Agente +${nsK(tot*agp)}</span><span>Capitão +${nsK(tot*cap)}</span></div>
 ${n.spOffer?`<button class="nshint" id="spOff">📩 Proposta da ${esc(n.spOffer.b)} esperando resposta</button>`:`<button class="nsc b" id="spFind" style="justify-content:center"><span>🔎</span>Procurar patrocinador</button>`}`}
function nsBindTabs(){const on=(id,fn)=>{const e=document.getElementById(id);if(e)e.onclick=fn};
 on('ctRenew',nsRenew);on('ctAg',()=>nsOpen(nsStaffPage()));on('ctTr',()=>nsOpen(nsStaffPage()));
 on('ctRaise',async()=>{const r=askRaise();nsSync();await nsPop({ic:r.ok?'💰':'🙅',title:r.ok?'Aumento!':'Não rolou',txt:r.txt,chips:r.chips});renderHub()});on('ctMore',()=>nsContractSheet());
 on('spOff',async()=>{await nsSpOfferPop();renderHub()});on('spFind',async()=>{const n=S.n;if(n.en<10){toast({ic:'❤️',title:'Sem energia',txt:'Procurar marca gasta 10% de energia.',ms:2000});return}n.en-=10;const o=nsSpOffer(true);if(o){n.spOffer=o;await nsSpOfferPop()}else await nsPop({ic:'📵',title:'Nenhuma marca topou',txt:'Suba o nível de estrela, ganhe os fãs ou contrate um agente.'});renderHub()});
 on('nsLookB',()=>nsOpen(nsLookPage()));on('nsNameB',()=>nsOpen(nsLookPage()))}
async function nsRenew(){const c=club();if(S.loan){await nsPop({ic:'🔁',title:'Emprestado',txt:'Renovação só com o clube dono do seu passe.'});return}
 if(S.contract>1){await nsPop({ic:'✍️',title:'Ainda não',txt:`Seu contrato vai até ${S.year+S.contract}. A diretoria só conversa quando faltar 1 ano.`});return}
 const o=renewalOffer();if(!o||o.refuse){await nsPop({ic:'🙅',title:'A diretoria não quer renovar',txt:'Melhore as atuações e a relação com o técnico. Ou procure outro clube com o agente.'});return}
 const k=await nsPop({ic:'✍️',title:`Renovação · ${c.n}`,txt:`${o.years} anos, ${nsK(o.wage)} por semana. Dá pra negociar salário e bônus na próxima tela.`,opts:[['y','Negociar']],ok:'Agora não'});if(k!=='y')return;
 S.contract=o.years+(S.contract>0?S.contract:0);S.wage=o.wage;nsSync();nsNegotiate({club:c.id,years:o.years,wage:o.wage});renderHub()}
// tela principal: 4 abas, nome clicável e o botão do visual no lugar do contrato
{const _hh=nsHubHTML;nsHubHTML=function(){let h=_hh.apply(this,arguments);
  h=h.replace(/<div class="nstabs"><button data-nt="status"[\s\S]*?<\/div><span class="mono gold">/,`<div class="nstabs n4">${[['status','Status'],['contrato','Contrato'],['patro','Patroc.'],['estats','Estats']].map(([k,t])=>`<button data-nt="${k}" class="${NS_TAB===k?'on':''}">${t}</button>`).join('')}</div><span class="mono gold">`);
  h=h.replace(/<button class="nsc b" id="nsCtB">[\s\S]*?<\/button>/,`<button class="nsc b" id="nsLookB"><span>🎨</span>Visual e camisa</button>`);
  h=h.replace('<div class="nsname">','<div class="nsname" id="nsNameB" role="button" tabindex="0">');
  if(NS_TAB==='contrato'||NS_TAB==='patro'){h=h.replace(/<div class="nsh-body" id="nsBody">[\s\S]*?<\/div>\s*<div class="nsh-tick">/,`<div class="nsh-body" id="nsBody">${NS_TAB==='contrato'?nsCtTabHTML():nsSpTabHTML()}</div>\n <div class="nsh-tick">`)}
  return h}}
{const _rnh=nsRenderHub;nsRenderHub=function(){const r=_rnh.apply(this,arguments);try{nsBindTabs()}catch(e){console.error(e)}return r}}

// ---------- visual do jogador e camisa ----------
let NS_LK='pele';
function nsFaceC(){if(!S.face)S.face={preset:0};if(!S.face.custom){const L=faceLook(S.face);S.face.custom={skin:L.skin,hairC:L.hair,style:FX_STY.some(x=>x[0]===L.style)?L.style:'buzz',beard:L.beard||'',acc:L.band&&L.ear?'ambos':L.band?'faixa':L.ear?'brinco':''}}return S.face.custom}
const NS_BOOTC=['#151515','#ffffff','#ffd400','#ff3b30','#1fa3ff','#34c759','#ff7a2b','#c9a0ff','#f2c443','#ff4fa3'];
function nsLookPage(){return{t:'Seu craque',cls:'look',html:()=>{const n=S.n;nsMig();const C=nsFaceC();const c=club()||{};const kit=[c.c1||'#c8102e',c.c2||'#ffffff'];const nm=nsShirtName();
  const sw=(arr,cur,attr)=>`<div class="nslk-sw">${arr.map(v=>`<button class="${cur===v?'on':''}" data-${attr}="${v}" style="background:${v}" aria-label="${v}"></button>`).join('')}</div>`;
  const fo=(arr,key,attr,mod)=>`<div class="nslk-fo">${arr.map(([v,t])=>`<button class="${(C[key]||'')===v?'on':''}" data-${attr}="${v}">${faceSVG({custom:{...C,...mod,[key]:v}},kit[0],kit[1])}<small>${t}</small></button>`).join('')}</div>`;
  let opts='';
  if(NS_LK==='pele')opts=sw(FX_SKINS,C.skin,'sk');
  else if(NS_LK==='cabelo')opts=fo(FX_STY,'style','st',{beard:'',acc:''});
  else if(NS_LK==='cor')opts=sw(FX_HAIRC,C.hairC,'hc');
  else if(NS_LK==='barba')opts=fo(FX_BEARD,'beard','bd',{});
  else if(NS_LK==='acc')opts=fo(FX_ACC,'acc','ac',{});
  else if(NS_LK==='bota')opts=`${sw(NS_BOOTC,n.look.boot||'#151515','bc')}<p class="muted nshelp">${nsBootStats()?'Com chuteira da loja calçada, vale a cor dela no jogo.':'A cor aparece nos seus lances em 3D.'}</p>`;
  else opts=`<div class="nslk-shirt"><label>Nome na camisa<input class="input" id="lkName" maxlength="12" value="${esc(n.look.name||'')}" placeholder="${esc(nm)}"></label>
   <div class="nslk-num"><span>Número</span><button class="btn ghost small" id="lkM">−</button><b id="lkN">${S.shirt||S.num}</b><button class="btn ghost small" id="lkP">+</button></div><button class="btn ghost small" id="lkSur">Usar o sobrenome</button></div>`;
  return`<div class="nslk-prev"><div class="face">${faceSVG(S.face,kit[0],kit[1])}</div>
   <div class="jer back" style="--c1:${kit[0]};--c2:${kit[1]};--ink:${pickInk(kit[0])}"><span>${esc(nm.toUpperCase())}</span><b>${S.shirt||S.num}</b><i class="boots" style="background:${(nsBootStats()||{}).col||n.look.boot||'#151515'}"></i></div>
   <div class="jer front" style="--c1:${kit[0]};--c2:${kit[1]}">${shieldHTML(c,'sm')}</div></div>
  <div class="nstabs wide lk">${[['pele','Pele'],['cabelo','Cabelo'],['cor','Cor'],['barba','Barba'],['acc','Acessório'],['bota','Chuteira'],['camisa','Camisa']].map(([k,t])=>`<button class="${NS_LK===k?'on':''}" data-lk="${k}">${t}</button>`).join('')}</div>
  <div class="nslk-opts">${opts}</div>${S.face.photo?'<p class="muted nshelp">Sua foto continua no perfil; no campo vale este visual.</p>':''}`},
 bind:B=>{const C=nsFaceC();const n=S.n;const set=(k,v)=>{C[k]=v;try{saveNow('look')}catch(e){}nsRefresh()};
  B.querySelectorAll('[data-lk]').forEach(b=>b.onclick=()=>{NS_LK=b.dataset.lk;nsRefresh()});
  B.querySelectorAll('[data-sk]').forEach(b=>b.onclick=()=>set('skin',b.dataset.sk));B.querySelectorAll('[data-hc]').forEach(b=>b.onclick=()=>set('hairC',b.dataset.hc));
  B.querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>set('style',b.dataset.st));B.querySelectorAll('[data-bd]').forEach(b=>b.onclick=()=>set('beard',b.dataset.bd));B.querySelectorAll('[data-ac]').forEach(b=>b.onclick=()=>set('acc',b.dataset.ac));
  B.querySelectorAll('[data-bc]').forEach(b=>b.onclick=()=>{n.look.boot=b.dataset.bc;nsRefresh()});
  const nmI=B.querySelector('#lkName');if(nmI){nmI.onchange=()=>{n.look.name=nmI.value.replace(/[<>]/g,'').trim().slice(0,12);nsRefresh()}}
  const num=d=>{S.shirt=clamp((S.shirt||S.num||9)+d,1,99);const e=B.querySelector('#lkN');if(e)e.textContent=S.shirt;const j=B.querySelector('.jer.back b');if(j)j.textContent=S.shirt};
  const m=B.querySelector('#lkM'),p=B.querySelector('#lkP'),su=B.querySelector('#lkSur');if(m)m.onclick=()=>num(-1);if(p)p.onclick=()=>num(1);if(su)su.onclick=()=>{n.look.name='';nsRefresh()}},
 nav:[{ic:'🎲',t:'Aleatório',fn:()=>{const C=nsFaceC();Object.assign(C,{skin:pick(FX_SKINS),hairC:pick(FX_HAIRC),style:pick(FX_STY)[0],beard:ch(.5)?'':pick(FX_BEARD)[0],acc:ch(.7)?'':pick(FX_ACC)[0]});nsRefresh()}}]}}
// lance em 3D: escudo no peito dos dois times, nome nas costas, visual completo e só o seu jogador controlado
function nsCrestOf(side){if(!side)return null;const c=(side.id&&CLUB[side.id])||side;let c1=c.c1,c2=c.c2;if(!c1){try{const t=teamColors(side);c1=t[0];c2=t[1]}catch(e){c1='#c8102e';c2='#ffffff'}}
 const out={c1,c2:c2||'#ffffff',ab:String(c.a||(side.nat?side.id:'')||mkAbbr(c.n||'')).slice(0,3)};
 try{const d=document.createElement('div');d.innerHTML=shieldHTML(side,'');const im=d.querySelector('img');const src=im&&im.getAttribute('src');if(src&&!/^\/_blob\//.test(src))out.img=new URL(src,location.href).href}catch(e){}return out}
{const _cfgP=l3dCfg;l3dCfg=function(o){const c=_cfgP(o);try{if(S){c.onlyHero=true;const pr=c.env==='prison';const ctx=L3D.ctx||{};
  if(!pr){const us=ctx.us||club(),th=ctx.them;if(c.us&&us)c.us.crest=nsCrestOf(us);if(c.them&&th)c.them.crest=nsCrestOf(th)}
  if(c.hero){const L=faceLook(S.face||{preset:0});c.hero.style=L.style||c.hero.style;c.hero.beard=L.beard||'';c.hero.ear=!!L.ear;c.hero.skin=L.skin||c.hero.skin;c.hero.hair=L.hair||c.hero.hair;c.hero.num=S.shirt||S.num||9;
   if(!pr)c.hero.name=nsShirtName();const lk=S.n&&S.n.look;if(lk&&lk.boot&&!nsBootStats()&&!pr)c.hero.boot=lk.boot}}}catch(e){console.error(e)}return c}}

// ---------- relações: cada ação vem com uma situação e você decide (✓/✕) ----------
const NS_RSIT={
 coach:[['O técnico chamou pra ver vídeo do próximo adversário depois do treino.','en',15],['O auxiliar te desafiou a ficar batendo falta até escurecer.','en',18],['Convidar o técnico pra um churrasco de domingo na sua casa.','money',.5],['Chegar uma hora mais cedo no CT a semana inteira.','en',20]],
 team:[['O elenco quer um churrasco com pagode na sua casa.','money',.35],['Pagar o jantar de aniversário do capitão.','money',.3],['Campeonato de videogame valendo pizza na concentração.','en',10],['Levar a turma do sub-20 pra conhecer o vestiário.','en',12]],
 fans:[['Jantar beneficente com a torcida, pra ajudar o projeto social do clube.','en',25],['Visitar uma escolinha de futebol do bairro.','en',20],['Sessão de autógrafos no shopping.','en',15],['Responder os torcedores numa live de uma hora.','en',10]],
 gf:[['Levar a namorada pra jantar num restaurante chique.','money',.2],['Fim de semana na praia com ela.','money',.45],['Flores e chocolate de surpresa.','money',.08],['Maratona de série no sofá.','en',8]],
 gf0:[['Um amigo quer te apresentar alguém numa festa.','money',.12],['Aniversário de uma amiga da sua irmã. Vai ter gente nova.','money',.08],['Baixar um aplicativo de namoro e marcar um café.','money',.05]],
 spon:[['Gravar um comercial pra uma marca que te patrocina.','en',20],['Posar pra campanha nas redes da marca.','en',12],['Evento de lançamento de produto à noite.','en',18]]};
nsRelInfo=function(k){const n=S.n;
 if(k==='coach')return{d:'Gosta de você = mais chances de ser titular e um pouco mais de energia na semana.',act:'Conversar com o técnico',sub:'situações da semana'};
 if(k==='team')return{d:'Elenco do seu lado = mais bolas pra você e rendimento melhor.',act:'Programa com o elenco',sub:'situações da semana'};
 if(k==='fans')return{d:'Fãs = valor do patrocínio, fama e moral nos jogos grandes.',act:'Ação com a torcida',sub:'situações da semana'};
 if(k==='gf')return S.gf?{d:`${S.gf.n}${S.rel==='casado'?' (casados)':''}. Namorada feliz = você feliz.`,act:n.rel.gf>=85&&S.rel!=='casado'?'Pedir em casamento':'Programa a dois',sub:n.rel.gf>=85&&S.rel!=='casado'?`−${nsK(nsRelCost('ring'))}`:'situações da semana'}:{d:'Solteiro. Uma namorada deixa você mais feliz (e gasta dinheiro).',act:'Conhecer alguém',sub:'situações da semana'};
 return nsHasSp()?{d:`${Object.keys(n.sps).length} marca(s) pagando ${nsK(nsSpW())} por jogo. Se a relação esfriar, elas saem.`,act:'Compromisso com as marcas',sub:'situações da semana'}:{d:'Sem patrocinador. Nível de estrela, fãs e um bom agente atraem marcas.',act:'Procurar patrocinador',sub:'−10% energia'}};
nsRelAct=async function(k){const n=S.n;let txt='',chips=[],ic='✅';const nm=NS_REL.find(x=>x[0]===k)[1];
 const up=(r,v)=>{const b=n.rel[r];n.rel[r]=clamp(b+v,0,100);const d=Math.round(n.rel[r]-b);if(d)chips.push([`${NS_REL.find(x=>x[0]===r)[1]} ${d>=0?'+':''}${d}`,d>=0?'up':'down'])};
 // casamento e busca de patrocínio continuam diretos
 if(k==='gf'&&S.gf&&n.rel.gf>=85&&S.rel!=='casado'){const cost=nsRelCost('ring');const q=await nsPop({ic:'💍',title:'Pedir em casamento?',txt:`A aliança custa ${nsK(cost)}.`,opts:[['y','✓ Pedir']],ok:'✕ Ainda não'});if(q!=='y')return;
  if(S.din*1000<cost){toast({ic:'💸',title:'Sem dinheiro',txt:`Precisa de ${nsK(cost)}.`,ms:2000});return}S.din-=cost/1000;if(ch(.85)){S.rel='casado';up('gf',10);ic='💍';txt=`${S.gf.n} disse SIM!`;try{nsAchHit('casar')}catch(e){}}else{up('gf',-15);ic='💔';txt=`${S.gf.n} pediu mais tempo.`}
  nsSync();await nsPop({ic,title:nm,txt,chips});nsRefresh();return}
 if(k==='spon'&&!nsHasSp()){if(n.en<10){toast({ic:'❤️',title:'Sem energia',txt:'Precisa de 10% de energia.',ms:2000});return}n.en-=10;const o=nsSpOffer(true);if(o){n.spOffer=o;await nsSpOfferPop()}else await nsPop({ic:'📵',title:'Nenhuma marca topou',txt:'Suba o nível de estrela, ganhe os fãs ou contrate um agente.'});nsRefresh();return}
 const pool=k==='gf'&&!S.gf?NS_RSIT.gf0:NS_RSIT[k];const[sit,kind,amt]=pick(pool);const w=Math.max(1,S.wage||1);const cost=kind==='en'?amt:Math.max(1,Math.round(w*amt*(k==='gf'||k==='gf0'?1:1)+ (kind==='money'?1:0)));
 const costTxt=kind==='en'?`${cost}% da sua ENERGIA`:nsK(cost);
 const q=await nsPop({ic:NS_REL.find(x=>x[0]===k)[2],title:nm,txt:`${sit} Isso melhora a relação, mas custa ${costTxt}.`,opts:[['y','✓ Topar']],ok:'✕ Agora não'});if(q!=='y')return;
 if(kind==='en'){if(n.en<cost){toast({ic:'❤️',title:'Sem energia',txt:`Precisa de ${cost}% de energia.`,ms:2000});return}n.en-=cost}else{if(S.din*1000<cost){toast({ic:'💸',title:'Sem dinheiro',txt:`Precisa de ${nsK(cost)}.`,ms:2000});return}S.din-=cost/1000}
 const big=kind==='en'?cost/2:8+Math.min(6,amt*10);
 if(k==='coach'){up('coach',Math.round(R(5,8)+big/6));if(kind==='en'){const kk=nsWeakest();const g=nsGain(kk,.4);nsAddP(kk,g);n.last[kk]=n.week;chips.push([`${NSK.find(x=>x[0]===kk)[1]} +${g}%`,'gold'])}txt='O técnico notou o seu esforço.'}
 else if(k==='team'){up('team',RI(8,13));txt='Resenha boa. O elenco agora te passa mais a bola.'}
 else if(k==='fans'){up('fans',Math.round(R(6,9)+big/5));nsStarAdd(3);txt='A torcida adorou. Vai ter faixa com o seu nome no próximo jogo.'}
 else if(k==='gf'&&S.gf){up('gf',RI(9,15));ic='🌹';txt=`${S.gf.n} adorou.`}
 else if(k==='gf'){const p=clamp(.28+n.star.l*.025+n.ls/250+n.happy/400,.2,.85);if(ch(p)){S.gf={n:pick(GF_NAMES),v:55};S.rel=S.rel==='solteiro'?'namorando':S.rel;n.rel.gf=55;ic='🌹';txt=`Você conheceu ${S.gf.n}. Estão namorando!`;chips.push(['Namorando','up'])}else{ic='🙃';txt='Não rolou dessa vez. Mais estrela e estilo de vida ajudam.'}}
 else if(k==='spon'){up('spon',RI(10,16));const bon=Math.round(nsSpW()*3);S.din+=bon/1000;if(bon)chips.push([`+${nsK(bon)}`,'gold']);txt='As marcas ficaram felizes e pagaram um extra.'}
 nsSync();await nsPop({ic,title:nm,txt,chips});nsRefresh()};

// ---------- corrida de cavalos com pista ----------
function nsRaceScene(field,title,pickI){return new Promise(res=>{const L=field.length;
 $ov.hidden=false;$ov.innerHTML=`<div class="nsrace"><div class="nsr-sky"><b>${esc(title)}</b></div><div class="nsr-stand"></div><div class="nsr-board">${'<span>★ FOME DE BOLA ★</span>'.repeat(6)}</div>
  <div class="nsr-track">${field.map((h,i)=>`<div class="nsr-lane"><div class="nsr-hz" id="rz${i}"><i style="background:${h.col}"></i><span>🏇</span></div></div>`).join('')}<div class="nsr-fin"></div></div>
  <div class="nsr-res" id="rzRes"><div class="nsr-wait">Largada…</div></div></div>`;
 const pos=field.map(()=>0),fin=[],els=field.map((_,i)=>document.getElementById('rz'+i));let t0=performance.now();
 const step=()=>{const t=(performance.now()-t0)/1000;if(t>.9){for(let i=0;i<L;i++){if(pos[i]>=100)continue;pos[i]+=field[i].sp*(reduced?9:.55)*(.5+rnd()*1)*(1+Math.sin(t*2+i)*.15);if(pos[i]>=100){pos[i]=100;fin.push(i)}}}
  for(let i=0;i<L;i++)els[i].style.left=`calc(${pos[i]*.86}% )`;
  if(fin.length<L){requestAnimationFrame(step);return}
  document.getElementById('rzRes').innerHTML=fin.map((i,j)=>`<div class="nsr-row"><b>${j+1}º</b><span>${i===pickI?'💰':''}</span><em style="color:${field[i].col}">${esc(field[i].n)}</em>${field[i].me?'<small>seu</small>':''}</div>`).join('');res(fin)};
 requestAnimationFrame(step)})}
const NS_SILK=['#ff3b30','#ffd400','#1f6bff','#00d4ff','#ff2bd6','#2bff4a','#ff8c1a','#ffffff'];
nsHorseRaceMine=async function(i){const n=S.n;const h=n.horses[i];if(!h||h.rw===n.week)return;
 const k=await nsPop({ic:'🏁',title:`Inscrever ${h.n}`,txt:`Força ${Math.round(h.f)}. Prêmio: 1º = 6× a inscrição, 2º = 2,5×, 3º = 1,2×.`,opts:NS_RACES.map(r=>[r.k,`${r.n} · inscrição ${money(r.fee)} · rivais ~${r.m}`]),ok:'Cancelar'});
 const rc=NS_RACES.find(r=>r.k===k);if(!rc||!nsPay(rc.fee))return;h.rw=n.week;
 const used=new Set([h.n]);const field=[{n:h.n,f:h.f,me:true}];for(let j=0;j<5;j++){const nm=pick(NS_HN.filter(x=>!used.has(x)));used.add(nm);field.push({n:nm,f:clamp(rc.m+randn()*7,25,98)})}
 const order=shuffle(field);order.forEach((x,j)=>{x.col=NS_SILK[j];x.sp=x.f/70*(.9+rnd()*.25)});const me=order.findIndex(x=>x.me);
 const fin=await nsRaceScene(order,rc.n,me);const place=fin.indexOf(me)+1;const mult=place===1?6:place===2?2.5:place===3?1.2:0;const pay=rc.fee*mult;S.din+=pay;h.r++;h.earn+=pay;if(place===1){h.w++;n.horseW=(n.horseW||0)+1}
 await new Promise(r=>{const box=document.getElementById('rzRes');box.insertAdjacentHTML('beforeend',`<div class="nsr-out ${place<=3?'good':'bad'}">${esc(h.n)} chegou em ${place}º${pay?` · +${money(pay)}`:''}</div><button class="btn wide" id="rzOk">Continuar</button>`);document.getElementById('rzOk').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';r()}});
 try{nsAchCheck()}catch(e){}nsRefresh()};
// apostas no hipódromo do cassino com a pista nova
horseRace=function(){return new Promise(res=>{const SUM={txt:'Você foi embora sem apostar.',chips:[]};let net=0;
 const mk=()=>{const hs=shuffle(HORSES).slice(0,6).map((n,i)=>({n,s:R(.8,1.25),col:NS_SILK[i]}));const tot=hs.reduce((s,h)=>s+h.s**6,0);hs.forEach(h=>{h.p=h.s**6/tot;h.odd=Math.max(1.5,Math.round((.82/h.p)*2)/2);h.sp=h.s*1.05;h.st=clamp(Math.round(h.p*14),1,5)});return hs};
 let hs=mk(),pickI=null,bet=betOpts()[0]||0;
 const draw=()=>{$ov.hidden=false;$ov.innerHTML=`<div class="ovwrap nsbet"><div class="nsbet-h"><span>Banco <b>${money(S.din)}</b></span><span>Aposta <b>${money(bet)}</b></span></div>
  <div class="nsbet-l">${hs.map((h,i)=>`<button class="${pickI===i?'on':''}" data-h="${i}"><b style="background:${h.col}">${i+1}</b><span class="st">${'★'.repeat(h.st)}${'☆'.repeat(5-h.st)}</span><em>${esc(h.n)}</em><small>${h.odd.toFixed(1).replace('.',',')}×</small></button>`).join('')}</div>
  <div class="betrow">${betOpts().map(v=>`<button class="lmbtn ${bet===v?'on':''}" data-b="${v}">${money(v)}</button>`).join('')||'<span class="muted">Sem dinheiro pra apostar</span>'}</div>
  <div class="actions" style="margin-top:10px"><button class="btn" id="hGo" ${pickI==null||!bet||S.din<bet?'disabled':''}>🏁 Apostar</button><button class="btn ghost" id="hOut">Ir embora</button></div></div>`;
  $ov.querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>{pickI=+b.dataset.h;draw()});$ov.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{bet=+b.dataset.b;draw()});
  document.getElementById('hOut').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res(SUM)};
  document.getElementById('hGo').onclick=async()=>{S.din-=bet;const fin=await nsRaceScene(hs,'Hipódromo',pickI);const ok=fin[0]===pickI;const pay=ok?bet*hs[pickI].odd:0;S.din+=pay;net+=pay-bet;S.casino.net+=pay-bet;
   SUM.txt=net>=0?`Saiu do hipódromo com ${money(net)} a mais.`:`Perdeu ${money(-net)} nos cavalos.`;SUM.chips=[[`${net>=0?'+':'−'}${money(Math.abs(net))}`,net>=0?'up':'down']];
   const box=document.getElementById('rzRes');box.insertAdjacentHTML('beforeend',`<div class="nsr-out ${ok?'good':'bad'}">${ok?`Deu ${esc(hs[pickI].n)}! +${money(pay)}`:`Deu ${esc(hs[fin[0]].n)}. Perdeu ${money(bet)}`}</div><div class="row" style="display:flex;gap:8px"><button class="btn" id="rzAg">De novo</button><button class="btn ghost" id="rzOut">Ir embora</button></div>`);
   document.getElementById('rzAg').onclick=()=>{hs=mk();pickI=null;bet=Math.min(bet,betOpts().slice(-1)[0]||0);draw()};document.getElementById('rzOut').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res(SUM)}}};
 draw()})};

{const st=document.createElement('style');st.textContent=`
.nstabs.n4 button{padding:6px 10px;font-size:12.5px}
.nsct td{text-align:left}.nsct td .shield{vertical-align:middle}.nssp td{text-align:right;white-space:nowrap}.nssp td small{color:var(--muted);margin-right:6px;font-weight:600}.nssp tr.on th{color:var(--chalk)}.nssp tr.tot th,.nssp tr.tot td{background:#1d4a2c;color:#fff}
.nssp-x{display:flex;justify-content:space-between;gap:8px;background:#0d2118;border-radius:10px;padding:8px 12px;font:800 13.5px var(--f-body);color:var(--muted)}
.nsrow .ic i{display:block;font-style:normal;font-size:10px;color:var(--gold);line-height:1}.nsrow small.good{color:var(--good)}
.nsname{cursor:pointer}
.nslk-prev{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;align-items:end;justify-items:center;background:radial-gradient(circle at 50% 30%,#1d4a2c,#0d2118);border-radius:16px;padding:12px}
.nslk-prev .face{width:100%;max-width:150px}.nslk-prev .face svg,.nslk-prev .face img{width:100%;height:auto;display:block;border-radius:12px}
.jer{position:relative;width:100%;max-width:120px;aspect-ratio:1/1.05;background:var(--c1);border-radius:18px 18px 10px 10px;display:grid;place-items:center;color:var(--ink,#fff);box-shadow:inset 0 -10px 0 rgba(0,0,0,.12)}
.jer.back{grid-template-rows:auto 1fr;padding-top:12px}.jer.back span{font:900 15px var(--f-display);letter-spacing:.5px;max-width:92%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.jer.back b{font:900 52px var(--f-display);line-height:1}
.jer.back .boots{position:absolute;bottom:-14px;left:50%;width:56px;height:12px;margin-left:-28px;border-radius:6px 6px 3px 3px;box-shadow:0 0 0 2px #0006}
.jer.front{align-items:start;justify-items:end;padding:16px 18px}.jer.front .shield{transform:scale(1.1)}
.nstabs.wide.lk{grid-template-columns:repeat(7,1fr)}.nstabs.wide.lk button{font-size:11.5px;padding:8px 0}
.nslk-sw{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;padding:6px}.nslk-sw button{width:46px;height:46px;border-radius:50%;border:3px solid #0006}.nslk-sw button.on{border-color:var(--accent);box-shadow:0 0 0 3px #ff7a2b55}
.nslk-fo{display:grid;grid-template-columns:repeat(auto-fill,minmax(86px,1fr));gap:8px}.nslk-fo button{display:grid;gap:4px;justify-items:center;padding:6px;border-radius:12px;border:2px solid var(--line-2);background:var(--panel-2);color:var(--chalk)}.nslk-fo button.on{border-color:var(--accent)}.nslk-fo svg{width:64px;height:auto}.nslk-fo small{font:700 11.5px var(--f-body)}
.nslk-shirt{display:grid;gap:10px;padding:6px}.nslk-shirt label{display:grid;gap:6px;font:700 13px var(--f-body);color:var(--muted)}.nslk-num{display:flex;align-items:center;gap:12px;font:700 14px var(--f-body);color:var(--muted)}.nslk-num b{font:900 30px var(--f-display);color:var(--chalk);min-width:44px;text-align:center}
#overlay:has(.nsrace){padding:0;place-items:stretch;grid-template-columns:minmax(0,1fr)}
.nsrace{width:100%;max-width:760px;margin:0 auto;min-height:100dvh;display:flex;flex-direction:column;background:#2b5d1f;overflow:hidden}
.nsr-sky{height:16vh;min-height:70px;background:linear-gradient(180deg,#5d6aa8,#b9d3ef);display:grid;place-items:center}.nsr-sky b{font:900 26px var(--f-display);color:#fff;text-shadow:0 2px 0 #0005;letter-spacing:.5px}
.nsr-stand{height:12vh;min-height:56px;background:radial-gradient(circle,#e64a4a 1.2px,transparent 1.6px) 0 0/11px 9px,radial-gradient(circle,#f5f5f5 1.2px,transparent 1.6px) 5px 4px/13px 10px,linear-gradient(180deg,#6b7280,#4b5563)}
.nsr-board{display:flex;gap:30px;white-space:nowrap;overflow:hidden;background:#f4f4f4;border-top:4px solid #ccc;border-bottom:4px solid #999;padding:4px 0;font:900 15px var(--f-display);color:#2f4f9f}
.nsr-track{position:relative;flex:1;min-height:42vh;background:repeating-linear-gradient(90deg,#4f9a33 0 60px,#57a63a 60px 120px);border-top:6px solid #ddd;border-bottom:6px solid #ddd;display:grid;padding:6px 0}
.nsr-lane{position:relative;border-bottom:1px dashed #ffffff30}.nsr-hz{position:absolute;left:0;top:50%;transform:translateY(-50%) scaleX(-1);font-size:clamp(30px,6vh,52px);line-height:1;filter:drop-shadow(0 4px 2px #0005)}.nsr-hz i{position:absolute;right:28%;top:6%;width:30%;height:30%;border-radius:50%;box-shadow:0 0 0 2px #0006}
.nsr-fin{position:absolute;right:6%;top:0;bottom:0;width:8px;background:repeating-linear-gradient(180deg,#fff 0 10px,#111 10px 20px)}
.nsr-res{background:#24461a;padding:12px 16px;display:grid;gap:4px;min-height:22vh}.nsr-wait{color:#cfe8c0;font:800 18px var(--f-body);text-align:center;padding-top:20px}
.nsr-row{display:grid;grid-template-columns:44px 30px 1fr auto;gap:6px;align-items:center}.nsr-row b{font:900 24px var(--f-display);color:#fff}.nsr-row em{font:900 22px var(--f-display);font-style:normal;text-shadow:0 1px 0 #0008}.nsr-row small{color:#fff;opacity:.7}
.nsr-out{font:900 22px var(--f-display);text-align:center;margin:8px 0}.nsr-out.good{color:var(--good)}.nsr-out.bad{color:#ffb3aa}
.nsbet{display:grid;gap:10px}.nsbet-h{display:flex;justify-content:space-between;font:700 14px var(--f-body);color:var(--muted)}.nsbet-h b{color:var(--gold)}
.nsbet-l{display:grid;gap:5px}.nsbet-l button{display:grid;grid-template-columns:40px 80px 1fr auto;gap:8px;align-items:center;padding:8px 10px;border-radius:10px;border:2px solid var(--line-2);background:var(--panel-2);color:var(--chalk);text-align:left}.nsbet-l button.on{border-color:var(--accent)}.nsbet-l b{display:grid;place-items:center;width:34px;height:34px;border-radius:8px;color:#111;font:900 18px var(--f-display)}.nsbet-l .st{color:var(--gold);letter-spacing:-1px}.nsbet-l em{font-style:normal;font-weight:800}.nsbet-l small{font:800 14px var(--f-body);color:var(--gold)}
@media (max-width:420px){.nstabs.n4 button{padding:6px 7px;font-size:11.5px}.nslk-prev{gap:6px;padding:8px}.jer.back b{font-size:40px}.nstabs.wide.lk button{font-size:10.5px}}
`;document.head.appendChild(st)}
