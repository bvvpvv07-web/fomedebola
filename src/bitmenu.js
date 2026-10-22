// ================== MENU PRINCIPAL ESTILO BITLIFE ==================
// Embaixo: Vida · Competições · [ AVANÇAR ] · Loja · Treino, com as barras de Felicidade, Saúde, Forma, Inteligência, Aparência e Fama.
// O botão do meio faz o que o jogo pede agora: ir pro jogo, jogar o bloco, jogar ao vivo ou fechar a temporada.
// Cada botão abre uma lista no estilo BitLife (cabeçalho laranja, linhas com emoji, título e descrição).

// ---------- painel em pilha ----------
const BL={stack:[],susp:false};
function blHost(){let h=document.getElementById('blp');if(!h){h=document.createElement('div');h.id='blp';h.hidden=true;document.body.appendChild(h)}return h}
function blOpen(page){BL.stack=[page];BL.susp=false;blDraw()}
function blPush(page){const b=document.getElementById('blB');if(b&&BL.stack.length)BL.stack[BL.stack.length-1]._sc=b.scrollTop;BL.stack.push(page);blDraw()}
function blBack(){BL.stack.pop();if(!BL.stack.length)return blClose();blDraw(false,true)}
function blClose(){const h=blHost();h.hidden=true;h.innerHTML='';BL.stack=[];BL.susp=false;document.body.classList.remove('bl-open');try{saveNow('season')}catch(e){}KEEPSC=true;try{renderHub()}catch(e){console.error(e)}}
function blRefresh(keep=true){if(BL.stack.length&&!BL.susp)blDraw(keep)}
function blSuspend(){BL.susp=true;blHost().hidden=true}
function blMeHTML(){if(!S)return'';const c=S.club&&CLUB[S.club];const fc=c?[c.c1,c.c2]:['#c8102e','#fff'];
 return`<div class="bl-me"><div class="bl-av">${faceSVG(S.face||{preset:0},fc[0],fc[1])}</div><div class="bl-mi"><b>${esc(S.name)}</b><span>${esc(POS[S.pos].n)}${c?' · '+esc(c.n):''} · ${S.age} anos</span></div><div class="bl-mm"><b>${money(S.din)}</b><span>📅 ${S.tempo||0} dia${S.tempo===1?'':'s'} livre${S.tempo===1?'':'s'}</span></div></div>`}
function blDraw(keep,back){const h=blHost();const p=BL.stack[BL.stack.length-1];const prevB=document.getElementById('blB');const sc=keep&&prevB?prevB.scrollTop:back?(p._sc||0):0;
 h.hidden=false;document.body.classList.add('bl-open');
 h.innerHTML=`<div class="blp ${p.col||''}"><div class="blp-h"><button class="blp-x" id="blX" aria-label="${BL.stack.length>1?'Voltar':'Voltar ao início'}"><span>‹</span>${BL.stack.length>1?'Voltar':'Início'}</button><b>${esc(p.t)}</b>${BL.stack.length>1?'<button class="blp-home" id="blH" aria-label="Fechar e voltar ao início">✕</button>':''}</div>${blMeHTML()}<div class="blp-b" id="blB">${p.html()}</div></div>`;
 document.getElementById('blX').onclick=()=>BL.stack.length>1?blBack():blClose();const bh=document.getElementById('blH');if(bh)bh.onclick=()=>blClose();
 const b=document.getElementById('blB');b.scrollTop=sc;try{if(p.bind)p.bind(b)}catch(e){console.error(e)}}
// fechar páginas antigas (Jogos, Tabela…) volta pro menu
{const _cp=closePanel;closePanel=function(...a){const r=_cp.apply(this,a);if(BL.susp&&BL.stack.length){BL.susp=false;blDraw(true)}return r}}

// ---------- popup (resultado / confirmação) ----------
function blPop2(){const h=document.createElement('div');h.className='bl-pophost';document.body.appendChild(h);return h}
function blResult(o){return new Promise(res=>{const h=blPop2();const opts=o.opts||[];
 h.innerHTML=`<div class="bl-pop"><div class="bl-poph">${esc(o.title||'')}</div><div class="bl-popb">${o.svg?`<div class="bl-psvg">${o.svg}</div>`:o.ic?`<div class="bl-pic">${o.ic}</div>`:''}${o.txt?`<p>${esc(o.txt)}</p>`:''}
  ${(o.chips||[]).length?`<div class="chipsrow bl-chips">${o.chips.map(([t,k])=>`<span class="chip ${k}">${esc(t)}</span>`).join('')}</div>`:''}
  ${opts.map(([k,t])=>`<button class="bl-pill" data-o="${k}">${esc(t)}</button>`).join('')}${o.btn!==null||!opts.length?`<button class="bl-pill" data-o="ok">${esc(o.btn||'Ok')}</button>`:''}${o.alt||opts.length?`<button class="bl-pill alt" data-o="alt">${esc(o.alt||'Fechar')}</button>`:''}</div></div>`;
 h.querySelectorAll('[data-o]').forEach(b=>b.onclick=()=>{h.remove();res(b.dataset.o)});
 h.onclick=e=>{if(e.target===h){h.remove();res('x')}}})}
// sair pro início sempre pergunta antes (o jogo fica salvo)
async function askHome(){try{if(S&&!S.done&&typeof blResult==='function'){const r=await blResult({ic:'🏠',title:'Sair da carreira?',txt:'Seu progresso fica salvo. Você volta pro menu inicial e pode continuar depois de onde parou.',btn:'Salvar e sair',alt:'Continuar jogando'});if(r!=='ok')return;if(BL.stack.length){const h=blHost();h.hidden=true;h.innerHTML='';BL.stack=[];BL.susp=false;document.body.classList.remove('bl-open')}}}catch(e){console.error(e)}goHome()}
function blWarn(t){try{toast({ic:'⛔',title:t,ms:2200})}catch(e){}}

// ---------- linhas ----------
function blRow(o){return`<button class="blr ${o.warn?'warn':''} ${o.big?'big':''}" data-k="${esc(o.k)}" ${o.dis?'aria-disabled="true"':''}><span class="blr-ic">${o.ic}</span><span class="blr-m"><b>${esc(o.t)}</b>${o.d?`<small>${esc(o.d)}</small>`:''}${o.why?`<em>${esc(o.why)}</em>`:''}</span>${o.cost?`<span class="blr-c">${o.cost}</span>`:''}${o.chev?'<span class="blr-ch">›</span>':''}</button>`}
function blActWhy(a){const r=a.req&&a.req();if(r)return r;if(!S.st||S.st.done)return'Só durante a temporada';if(a.t&&(S.tempo||0)<a.t)return a.t>1?`Precisa de ${a.t} dias livres`:'Sem dias livres até o jogo';if(a.c&&S.din<a.c)return`Precisa de ${money(a.c)}`;return null}
function blActRow(a){const why=blActWhy(a);return blRow({k:a.id,ic:a.ic,t:a.n,d:a.d,why,dis:!!why,warn:a.warn,cost:`${costLbl(a.c,a.t)}${a.mg?' · 🎮':''}`})}
function blXp(chips){for(const k of ATTRS){while((S.xp[k]||0)>=100){S.xp[k]-=100;S.attrs[k]=clamp(S.attrs[k]+1,1,99);chips.push([`+1 ${ATTR_NAME[k]}`,'up']);const w=(POS[S.pos].w[k]||0);if(S.ovr<S.pot+2&&ch(clamp(w*1.6,.05,.75))){S.ovr=clamp(S.ovr+1,30,99);if(S.ovr>S.peak){S.peak=S.ovr;S.peakAge=S.age}chips.push(['+1 OVR','up'])}}}}
async function blRunAct(a){const why=blActWhy(a);if(why){blWarn(why);return}
 if(a.warn&&!(S.bl&&S.bl.warned)){const r=await blResult({ic:'⚠️',title:'Lado errado',txt:'Crime pode dar prisão, suspensão, multa, rescisão de contrato e manchete no jornal. Ainda quer?',btn:'Quero mesmo assim',alt:'Desistir'});if(r!=='ok')return;ensureBL().warned=true}
 S.tempo-=a.t||0;S.din-=a.c||0;if(a.t)dayLog(a.ic,a.n);
 const lg0=ensureBL().log.length?ensureBL().log[0]:null;let r;try{r=await a.run()}catch(e){console.error(e);r={txt:'Algo deu errado.',chips:[]}}r=r||{txt:'',chips:[]};r.chips=r.chips||[];blXp(r.chips);
 if(ensureBL().log[0]===lg0)blog(a.ic,`${a.n}${r.txt?': '+r.txt:''}`.slice(0,140));
 await blResult({ic:r.ic||a.ic,title:r.title||a.n,txt:r.txt,chips:r.chips});
 try{await showPendingMoments()}catch(e){}try{saveNow('season')}catch(e){}
 if(typeof inPrison==='function'&&inPrison()){blClose();return}blRefresh()}
function blActsPage(t,get,col,intro){return{t,col,html:()=>{const acts=get();return`${intro?`<div class="bl-box">${intro()}</div>`:''}${acts.length?acts.map(blActRow).join(''):'<p class="bl-empty">Nada por aqui agora.</p>'}`},bind:root=>root.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const a=get().find(x=>x.id===b.dataset.k);if(a)blRunAct(a)})}}
function blMenuPage(t,col,items){return{t,col,html:()=>items().map(it=>it.page||it.go?blRow({...it,chev:true,dis:!!it.why}):it.act?blActRow(it.act):blRow(it)).join(''),bind:root=>root.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const it=items().find(x=>(x.act?x.act.id:x.k)===b.dataset.k);if(!it)return;if(it.act)return blRunAct(it.act);if(it.why){blWarn(it.why);return}if(it.go)return it.go();if(it.page)blPush(it.page())})}}

// ---------- VIDA ----------
const WHO_IC={gf:'❤️',tec:'📋',pais:'🏠',dir:'💼',torc:'📣'};
function relActsBL(){return relActions().map(a=>({id:a.id,ic:WHO_IC[a.who]||'❤️',n:a.n,d:a.d,t:a.t,c:a.c,who:a.who,run:async()=>LIFE_ASYNC[a.id]?await doRelAsync(a.id):doRel(a.id)}))}
function relPage(){return{t:'Relacionamentos',col:'rel',html:()=>{const acts=relActsBL();const meter=(lbl,v,col)=>`<div class="bl-meter"><span>${lbl}</span><i><s style="width:${clamp(v,0,100)}%;background:${col}"></s></i><b>${Math.round(v)}%</b></div>`;
 const B=ensureBL();const grp=(ic,title,sub,m,who,extra=[])=>`<div class="bl-person"><span>${ic}</span><div><b>${esc(title)}</b><small>${esc(sub)}</small>${m}</div></div>${acts.filter(a=>a.who===who).map(blActRow).join('')}${extra.map(blActRow).join('')}`;
 const v=typeof fansCur==='function'?fansCur():50;
 return grp('❤️',S.gf?S.gf.n:'Vida amorosa',S.gf?(S.rel==='casado'?'Casados':'Namorando'):'Solteiro',S.gf?meter('Relação',S.gf.v,'#ff7aa8'):'','gf')
  +grp('🏠','Família',`Pais${B.kids.length?' · '+B.kids.length+' filho'+(B.kids.length>1?'s':''):''}${B.pets.length?' · '+B.pets.map(p=>p.ic).join(''):''}`,meter('Pais',S.pais??70,'#2bd46a'),'pais',kidActs())
  +grp('📋','Técnico',S.coach>=70?'Confia em você':S.coach<=30?'Anda te escondendo no banco':'Relação normal',meter('Confiança',S.coach,'#ff8a1f'),'tec')
  +grp('💼','Diretoria',S.board>=70?'Te adora':'Pesa na renovação e no aumento',meter('Prestígio',S.board,'#3fa2ff'),'dir')
  +(S.club&&!S.youth?grp('📣','Torcida',typeof fansMood==='function'?fansMood(v)[0]:'',meter('Apoio',v,'#f2c443'),'torc'):'')},
 bind:root=>root.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const a=[...relActsBL(),...kidActs()].find(x=>x.id===b.dataset.k);if(a)blRunAct(a)})}}
function casinoActs(){const mk=(id,ic,n,d,fn)=>({id,ic,n,d,t:1,c:0,mg:true,req:()=>S.age<18?'A partir dos 18 anos':null,run:async()=>{S.casino.visits++;const chips=applyFx({disc:-2});const r=await fn();let extra='';if(ch(S.life.fama>40?.14:.05)){chips.push(...applyFx({board:-5,fama:1}));extra=' Um paparazzi te fotografou no cassino.'}return{txt:(r.txt||'')+extra,chips:[...chips,...(r.chips||[])]}}});
 return[mk('cas_horse','🐎','Corrida de cavalos','Escolha o cavalo e aposte.',horseRace),mk('cas_rol','🎡','Roleta','Cor, par ou ímpar, ou número.',roulette),mk('cas_slot','🎰','Caça-níquel','Três iguais = jackpot.',slotMachine),mk('cas_bj','🃏','Vinte e um','Chegue perto de 21 sem estourar.',blackjack)]}
function hobbyActs(){return lifeActs().filter(a=>a.g!=='Lado errado').map(a=>({id:'h_'+a.id,ic:a.ic,n:a.n,d:a.d,t:a.t,c:a.c,mg:a.mg,run:async()=>{if(a.id==='praticar'&&!S.music.inst){const pick2=await blResult({ic:'🎵',title:'Qual instrumento?',opts:Object.entries(INSTR).map(([k,n])=>[k,n]),btn:null,alt:'Cancelar'});if(!INSTR[pick2]){S.tempo+=a.t;S.din+=a.c;return{txt:'Fica pra próxima.',chips:[]}}S.music.inst=pick2;S.din-=.003;return{txt:`Comprou um ${INSTR[pick2]}. Agora é praticar!`,chips:[]}}return doLifeAct(a.id)}}))}
function restAct(){return{id:'descansar',ic:'😴',n:'Descansar',d:'Dia de sofá. O corpo agradece.',t:1,c:0,run:async()=>({txt:'Dia de descanso. Corpo agradece.',chips:applyFx({corpo:2,cab:1,sau:1})})}}
function visualPage(){const pickPage=(t,list,key,cost,fxk)=>({t,col:'vida',html:()=>{const c=S.club&&CLUB[S.club];const cur=faceLook(S.face||{preset:0});
  return`<div class="bl-box"><small>${cost?money(cost)+' · ':''}sem gastar dia. Muda seu rosto no jogo todo.</small></div><div class="bl-faces">${list.map(([k,n])=>{const f={custom:{...(S.face&&S.face.custom?S.face.custom:{skin:cur.skin,hairC:cur.hair,style:cur.style,beard:cur.beard,acc:''}),[key]:k}};const on=(S.face&&S.face.custom&&S.face.custom[key]===k);return`<button class="bl-face ${on?'on':''}" data-f="${esc(k)}">${faceSVG(f,c?c.c1:'#c8102e',c?c.c2:'#fff')}<small>${esc(n)}</small></button>`}).join('')}</div>`},
  bind:root=>root.querySelectorAll('[data-f]').forEach(b=>b.onclick=async()=>{if(S.face&&S.face.photo){blWarn('Você usa foto como rosto');return}if(S.din<cost){blWarn(`Precisa de ${money(cost)}`);return}const cu=blFaceCustom();if(!cu)return;cu[key]=b.dataset.f;S.din-=cost;const chips=applyFx({[fxk]:RI(1,3),cab:1});blog('💇',`Visual novo: ${t.toLowerCase()}`);await blResult({ic:'💇',title:'Visual novo!',txt:'Saiu do salão com outra cara.',chips});blRefresh()})});
 return blMenuPage('Visual','vida',()=>[
  {k:'cabelo',ic:'✂️',t:'Cortar o cabelo',d:'Escolha o corte.',page:()=>pickPage('Corte de cabelo',FX_STY,'style',.001,'apa')},
  {k:'cor',ic:'🎨',t:'Pintar o cabelo',d:'Loiro platinado? Por que não.',page:()=>pickPage('Cor do cabelo',FX_HAIRC.map((c,i)=>[c,['Preto','Castanho escuro','Castanho','Ruivo escuro','Loiro escuro','Loiro','Ruivo','Grisalho'][i]||'Cor']),'hairC',.002,'apa')},
  {k:'barba',ic:'🧔',t:'Barba',d:'Barba cheia, cavanhaque ou lisinho.',page:()=>pickPage('Barba',FX_BEARD,'beard',.0005,'apa')},
  {k:'acess',ic:'💍',t:'Acessórios',d:'Faixa no cabelo, brinco.',page:()=>pickPage('Acessórios',FX_ACC,'acc',.003,'fama')},
  {act:{id:'spa',ic:'💆',n:'Spa e skincare',d:'Tarde de cuidados.',t:1,c:.003,run:async()=>({txt:'Pele de bebê e cabeça leve.',chips:applyFx({apa:3,cab:3})})}},
 ])}
function emigPage(){return{t:'Emigrar',col:'vida',html:()=>{const B=ensureBL();const cur=S.club&&CLUB[S.club]&&CLUB[S.club].country;
 return`<div class="bl-box"><b>🌍 Jogar em outro país</b><small>Escolha o país e seu empresário vai trazer uma proposta de lá na próxima janela de transferências. Aprender a língua antes ajuda na adaptação.</small>${B.want?`<small>Pedido atual: <b>${COUNTRY[B.want].f} ${COUNTRY[B.want].n}</b></small>`:''}</div>
 ${emigList().filter(k=>k!==cur).map(k=>{const C=COUNTRY[k];const top=LG[C.top];return blRow({k,ic:C.f,t:C.n,d:`${top?top.n:''} · fala-se ${LANG_NAME[C.lang]||C.lang}`,cost:B.want===k?'✓ pedido':S.langs.includes(C.lang)?'fala a língua':''})}).join('')}
 ${B.want?blRow({k:'cancel',ic:'↩️',t:'Cancelar pedido',d:'Ficar onde está.'}):''}`},
 bind:root=>root.querySelectorAll('[data-k]').forEach(b=>b.onclick=async()=>{const B=ensureBL();const k=b.dataset.k;if(k==='cancel'){B.want=null;blRefresh();return}const C=COUNTRY[k];
  const r=await blResult({ic:C.f,title:`Jogar na ${C.n}?`,txt:S.club?'O clube vai saber que você quer sair. A diretoria não vai gostar.':'Seu empresário começa a ligar pros clubes de lá.',btn:'Pedir ao empresário',alt:'Cancelar'});if(r!=='ok')return;B.want=k;const chips=S.club?applyFx({board:-4}):[];blog(C.f,`Pediu pra jogar na ${C.n}`);await blResult({ic:'📞',title:'Pedido feito',txt:`Na próxima janela vem proposta da ${C.n}.`,chips});blRefresh()})}}
function vidaItems(){const B=ensureBL();return[
 {k:'rel',ic:'❤️',t:'Relacionamentos',d:'Amor, família, técnico, diretoria e torcida.',page:relPage},
 {k:'med',ic:'🩺',t:'Médico',d:B.sick?`Você está com ${B.sick.n.toLowerCase()}!`:'Clínico, fisioterapia, psicólogo, dentista…',page:()=>blActsPage('Médico',medActs,'vida')},
 {act:gymAct()},{act:baladaAct()},
 {k:'ferias',ic:'✈️',t:'Férias',d:'2 dias longe de tudo.',page:()=>blActsPage('Férias',feriasActs,'vida')},
 {k:'visual',ic:'💇',t:'Visual',d:'Cabelo, barba, acessórios e spa.',page:visualPage},
 {k:'est',ic:'🎓',t:'Estudos',d:`Faculdade, quiz, xadrez, livros, idiomas.${B.study.deg?` · ${B.study.deg} diploma${B.study.deg>1?'s':''}`:''}`,page:()=>blActsPage('Estudos',estudoActs,'vida')},
 {k:'hob',ic:'🎨',t:'Hobbies e música',d:'Luta, pesca, tatuagem, redes, instrumento.',page:()=>blActsPage('Hobbies e música',hobbyActs,'vida')},
 {k:'cas',ic:'🎰',t:'Cassino',d:'Cavalos, roleta, caça-níquel e 21.',why:S.age<18?'A partir dos 18 anos':null,page:()=>blActsPage('Cassino',casinoActs,'vida',()=>`<b>🎰 Cada noite no cassino tira um pouco da disciplina.</b><small>Saldo na vida: ${S.casino.net>=0?'+':'−'}${money(Math.abs(S.casino.net))}</small>`)},
 {k:'lot',ic:'🎟️',t:'Loteria',d:'Bilhete e raspadinha.',why:S.age<18?'A partir dos 18 anos':null,page:()=>blActsPage('Loteria',lotActs,'vida')},
 {k:'crime',ic:'🦹',t:'Crime',d:'Cometer um crime.',warn:true,why:S.age<16?'A partir dos 16 anos':null,page:()=>blActsPage('Crime',crimeActs,'crime',()=>`<b>🚨 Polícia de olho: ${Math.round(S.heat||0)}</b><small>Ficha: ${S.ficha?S.ficha+' passagem'+(S.ficha>1?'s':''):'limpa'}${S.trafico?' · no esquema':''}</small>`)},
 {k:'proc',ic:'⚖️',t:'Processos',d:'Processar alguém.',why:S.age<18?'A partir dos 18 anos':null,page:()=>blActsPage('Processos',processoActs,'vida')},
 {act:licAct()},
 {k:'emig',ic:'🌍',t:'Emigrar',d:B.want?`Pedido: ${COUNTRY[B.want].n}`:'Jogar em outro país.',page:emigPage},
 {act:adocaoAct()},
 {k:'pets',ic:'🐾',t:'Pets',d:B.pets.length?B.pets.map(p=>p.ic+' '+p.nome).join(' · '):'Adotar um bicho.',page:()=>blActsPage('Pets',petActs,'vida')},
 {act:restAct()},
]}
const vidaPage=()=>blMenuPage('Vida','vida',vidaItems);

// ---------- COMPETIÇÕES ----------
function compItems(){const st=S.st;let pos='';try{const t2=sortTable(st.table);const p=t2.findIndex(x=>x.id===S.club)+1;if(p)pos=`${p}º lugar`}catch(e){}
 const go=k=>()=>{blSuspend();openHubPanel(k)};const nm=typeof nextMatchInfo==='function'?nextMatchInfo():null;
 return[
 {k:'jogos',ic:'📋',t:'Jogos e resultados',d:nm?`Próximo: ${nm.comp}${nm.opp&&CLUB[nm.opp]?' · '+CLUB[nm.opp].n:''}`:'Calendário da temporada.',go:go('jogos')},
 {k:'tabela',ic:'📊',t:'Tabela',d:st?`${LG[st.lg].n}${pos?' · '+pos:''}`:'',go:go('tabela')},
 {k:'copas',ic:'🏆',t:'Copas e continentais',d:'Mata-mata, grupos e chaveamento.',go:go('copas')},
 {k:'trofeus',ic:'🏅',t:'Troféus e prêmios',d:`${(S.titles||[]).length} título${(S.titles||[]).length===1?'':'s'} · ${(S.awards||[]).length} prêmio${(S.awards||[]).length===1?'':'s'}`,go:go('trofeus')},
 {k:'jogador',ic:'👤',t:'Seu jogador',d:'Atributos, números e histórico.',go:go('jogador')},
 {k:'emp',ic:'📞',t:'Empresário',d:`${S.agentUses??0} ligações nesta temporada.`,go:()=>{blClose();openAgent(()=>renderHub())}},
]}
const compPage=()=>blMenuPage('Competições','comp',compItems);

// ---------- LOJA ----------
const CARS=[{id:'car_hatch',ic:'🚗',n:'Hatch popular',p:.015,fx:{cab:2}},{id:'car_suv',ic:'🚙',n:'SUV',p:.06,fx:{cab:3,fama:1}},{id:'car_classico',ic:'🚘',n:'Clássico restaurado',p:.12,fx:{cab:5,fama:2}},{id:'car_esp',ic:'🏎️',n:'Esportivo alemão',p:.2,fx:{cab:5,fama:3,disc:-1}},{id:'car_blind',ic:'🛻',n:'Blindado',p:.3,fx:{cab:3,sau:1}},{id:'car_super',ic:'🏁',n:'Superesportivo italiano',p:.6,fx:{cab:7,fama:5,disc:-2}},{id:'car_moto',ic:'🏍️',n:'Moto esportiva',p:.03,fx:{cab:4,disc:-1}}];
function shopPage(){return{t:'Produtos e serviços',col:'shop',html:()=>SHOP.map(p=>{const own=p.once&&S.owned.includes(p.id);const act2=p.perk&&S.perks[p.perk];return blRow({k:p.id,ic:{game:'🎮',grife:'👕',relogio:'⌚',carro:'🏎️',iate:'🛥️',prep:'🏃',nutri:'🥗',psico:'🧠'}[p.id]||'🛍️',t:p.n,d:p.d,cost:own?'✓ seu':act2?'✓ ativo':money(p.p),why:!own&&!act2&&S.din<p.p?`Falta ${money(p.p-S.din)}`:null,dis:own||act2||S.din<p.p})}).join(''),
 bind:root=>root.querySelectorAll('[data-k]').forEach(b=>b.onclick=async()=>{const x=SHOP.find(y=>y.id===b.dataset.k);if(!x||S.din<x.p||(x.once&&S.owned.includes(x.id))||(x.perk&&S.perks[x.perk]))return;S.din-=x.p;if(x.once)S.owned.push(x.id);if(x.perk)S.perks[x.perk]=true;blog('🛍️',`Comprou: ${x.n}`);await blResult({ic:'🛍️',title:'Comprado!',txt:x.n,chips:applyFx(x.fx)});blRefresh()})}}
function carsPage(){return{t:'Carros',col:'shop',html:()=>{const B=ensureBL();return`${B.lic?'':'<div class="bl-box"><b>🪪 Sem carteira</b><small>Dá pra comprar, mas dirigir sem habilitação dá blitz e polícia de olho. Tire a carteira em Vida.</small></div>'}${CARS.map(c=>{const own=B.cars.includes(c.id);return blRow({k:c.id,ic:c.ic,t:c.n,d:Object.entries(c.fx).map(([k,v])=>`${v>0?'+':''}${v} ${FX_NAME[k]}`).join(' · '),cost:own?'✓ na garagem':money(c.p),dis:own||S.din<c.p,why:!own&&S.din<c.p?`Falta ${money(c.p-S.din)}`:null})}).join('')}`},
 bind:root=>root.querySelectorAll('[data-k]').forEach(b=>b.onclick=async()=>{const B=ensureBL();const c=CARS.find(x=>x.id===b.dataset.k);if(!c||B.cars.includes(c.id)||S.din<c.p)return;S.din-=c.p;B.cars.push(c.id);blog(c.ic,`Comprou: ${c.n}`);await blResult({ic:c.ic,title:'Na garagem!',txt:`${c.n} zero quilômetro.`,chips:applyFx(c.fx)});blRefresh()})}}
function propsPage(){return{t:'Imóveis',col:'shop',html:()=>PROPS.map(p=>{const own=S.props.includes(p.id);return blRow({k:p.id,ic:{ap:'🏢',casa:'🏡',mansao:'🏰',paisCasa:'👪',aluguel:'🏘️',fazenda:'🐄',predio:'🏬'}[p.id]||'🏠',t:p.n,d:p.d+(p.r?` · rende ${money(p.r)}/sem`:''),cost:own?'✓ seu':money(p.p),dis:own||S.din<p.p,why:!own&&S.din<p.p?`Falta ${money(p.p-S.din)}`:null})}).join(''),
 bind:root=>root.querySelectorAll('[data-k]').forEach(b=>b.onclick=async()=>{const x=PROPS.find(y=>y.id===b.dataset.k);if(!x||S.din<x.p||S.props.includes(x.id))return;S.din-=x.p;S.props.push(x.id);if(x.pais)S.pais=100;blog('🏠',`Comprou: ${x.n}`);await blResult({ic:'🏠',title:'Escritura assinada!',txt:x.n,chips:applyFx(x.fx)});blRefresh()})}}
function assetsPage(){return{t:'Meus bens',col:'shop',html:()=>{const B=ensureBL();ensureBoots();const pv=typeof propValue==='function'?propValue():0;const cv=B.cars.reduce((s,id)=>{const c=CARS.find(x=>x.id===id);return s+(c?c.p*.6:0)},0);
 const li=(ic,t,d)=>`<div class="blr static"><span class="blr-ic">${ic}</span><span class="blr-m"><b>${esc(t)}</b>${d?`<small>${esc(d)}</small>`:''}</span></div>`;
 return`<div class="bl-box big"><small>Patrimônio</small><b>${money(S.din+pv+cv)}</b><small>Caixa ${money(S.din)} · Imóveis ${money(pv)} · Carros ${money(cv)}</small></div>
 ${S.props.map(id=>{const p=PROPS.find(x=>x.id===id);return p?li('🏠',p.n,p.r?`Aluguel ${money(p.r)}/sem`:''):''}).join('')}${B.cars.map(id=>{const c=CARS.find(x=>x.id===id);return c?li(c.ic,c.n,''):''}).join('')}
 ${S.owned.map(id=>{const p=SHOP.find(x=>x.id===id);return p?li('🛍️',p.n,''):''}).join('')}${S.bootsOwned.map(e=>{const b=btOf(e.id);return b?li('👟',b.n,`${e.left}/${b.g} jogos`):''}).join('')}${(S.bootWall||[]).length?li('🏆','Quadro de chuteiras',S.bootWall.join(', ')):''}
 ${!S.props.length&&!B.cars.length&&!S.owned.length&&!S.bootsOwned.length?'<p class="bl-empty">Nada ainda. Tudo começa com a primeira chuteira.</p>':''}`}}}
function lojaPage(){return{t:'Loja',col:'shop',html:()=>{ensureBoots();const cur=S.boot&&btOf(S.boot);
 return`<button class="bl-feat" data-k="boots"><div class="bl-feat-s">${cur?bootSVG(cur.id,{w:150}):bootSVG('raio3',{w:150})}</div><div class="bl-feat-m"><small>${cur?'No seu pé':'Destaque'}</small><b>👟 Chuteiras</b><span>${cur?esc(cur.n)+` · ${S.bootLeft} jogos`:'De Comum a Ícone. Sobem seus atributos.'}</span><em>${BOOTS.filter(b=>b.id!=='sig'&&(S.pos==='GOL'||!b.gk)).length} modelos · coleção ${S.bootsOwned.length}${S.spons?' · patrocinado':''}</em></div><span class="blr-ch">›</span></button>
 ${blRow({k:'shop',ic:'🛍️',t:'Produtos e serviços',d:'Preparador físico, nutricionista, psicólogo, luxo.',chev:true})}${blRow({k:'cars',ic:'🚗',t:'Carros',d:'Do popular ao superesportivo.',chev:true})}${blRow({k:'props',ic:'🏠',t:'Imóveis',d:'Casa, mansão, aluguel, fazenda.',chev:true})}${blRow({k:'bens',ic:'💎',t:'Meus bens',d:'Patrimônio e tudo que você tem.',chev:true})}`},
 bind:root=>root.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>blPush({boots:bootsPage,shop:shopPage,cars:carsPage,props:propsPage,bens:assetsPage}[b.dataset.k]()))}}

// ---------- TREINO ----------
function drillActs(){const ds=DRILLS.filter(d=>S.pos==='GOL'?(d.gk||['long','pass','tactic','sprint'].includes(d.k)):!d.gk);return ds.map(d=>({id:'dr_'+d.k,ic:d.ic,n:d.n,d:`${ATTR_NAME[d.a]} ${CA()[d.a]} · XP ${S.xp[d.a]||0}/100`,t:1,c:0,mg:true,req:()=>S.week&&S.week.trained?'Já fez o treino desta semana':null,run:async()=>{if(S.week)S.week.trained=true;const r=await weeklyTraining(d.k);return{txt:r.hits>=3?'Treino perfeito.':r.hits>=2?'Bom treino.':'Treino fraco hoje.',chips:r.chips}}}))}
function specialActs(){const A=effAttrs();const sk=k=>clamp((A[k]-40)/55,.1,.95);const g=(k,v)=>{S.xp[k]=(S.xp[k]||0)+v;return[`+${v} XP ${ATTR_NAME[k]}`,'gold']};const B=ensureBL();
 const list=[
 {id:'sp_emb',ic:'⚽',n:'Embaixadinhas',d:`Controle de bola. Recorde: ${B.emb||0}.`,t:1,c:0,mg:true,run:async()=>{const r=await mgEmbaixadinha({skill:sk('DRI')});const rec=r.score>(B.emb||0);if(rec)B.emb=r.score;rpgGain(4+Math.min(10,r.score/3));return{txt:`${r.score} embaixadinhas${rec?' · novo recorde!':''}`,chips:[g('DRI',Math.min(22,Math.round(r.score*.9))),...applyFx({forma:r.ok?1:0})]}}},
 {id:'sp_sprint',ic:'⚡',n:'Tiro de 40 metros',d:'Corrida contra dois companheiros.',t:1,c:0,mg:true,run:async()=>{const r=await mgSprint({rival:clamp(7.6-(A.VEL-60)/40,6.2,8.2)});rpgGain(r.ok?8:4);return{txt:r.score===1?'Ganhou a corrida!':r.score===2?'Segundo lugar.':'Ficou pra trás.',chips:[g('VEL',[0,18,12,6][r.score]||6),...applyFx({corpo:-1})]}}},
 {id:'sp_lift',ic:'🏋️',n:'Musculação',d:'Força e explosão.',t:1,c:0,mg:true,run:async()=>{const r=await mgLift({skill:sk('FIS'),title:'Série de força'});rpgGain(3+r.score);return{txt:`${r.score} de 5 repetições.`,chips:[g('FIS',r.score*4),...applyFx({corpo:Math.round(r.score/2),apa:r.score>=4?1:0})]}}},
 {id:'sp_mem',ic:'🧠',n:'Memória tática',d:'Repita a jogada do treinador.',t:1,c:0,mg:true,run:async()=>{const r=await mgMemory({});rpgGain(4+r.score*2);return{txt:r.ok?'Leu a jogada.':'Se perdeu na sequência.',chips:[g('MEN',r.score*6),...applyFx({int:r.score>=2?1:0})]}}},
 {id:'sp_pen',ic:'🥅',n:S.pos==='GOL'?'Reflexos':'Pênaltis',d:S.pos==='GOL'?'Máquina de chutes.':'5 cobranças contra o goleiro reserva.',t:1,c:0,mg:true,run:async()=>{if(S.pos==='GOL'){let h=0;for(let i=0;i<3;i++){const t=await mgReflex({type:'reflex',comp:'Treino',title:`Reflexo ${i+1} de 3`,sub:'Máquina de chutes.',window:820-i*90+(A.REF-70)*6});h+=t.ok}rpgGain(4+h*2);return{txt:`${h} de 3 defesas.`,chips:[g('REF',h*6)]}}
  const r=await mgPenalties({skill:sk('FIN')});rpgGain(3+r.score*2);return{txt:`${r.score} de 5 gols.`,chips:[g('FIN',r.score*4)]}}},
 {id:'sp_3d',ic:'🎮',n:'Treino no campo (3D)',d:'Um lance jogado no campo, com marcação.',t:1,c:0,mg:true,run:async()=>{const k=S.pos==='GOL'?'keeper':pick(['finish','pass','dribble','finish']);const r=await nssMoment({kind:k,comp:'Treino',title:'Treino coletivo',skill:clamp(S.ovr/100,.3,.9),keeper:.35,planned:true});const a=k==='pass'?'PAS':k==='dribble'?'DRI':k==='keeper'?'REF':'FIN';return{txt:r&&r.ok?'Mandou bem no coletivo.':'O técnico pediu mais.',chips:[g(a,r&&r.ok?(r.perfect?16:12):5),...applyFx({forma:r&&r.ok?1:0})]}}},
 ];return list}
function treinoPage(){return{t:'Treino',col:'tree',html:()=>`<button class="bl-feat tree" data-k="tree"><div class="bl-feat-s big">🌳</div><div class="bl-feat-m"><small>Nível ${rpgS().lvl} · ${rpgS().pts} ponto${rpgS().pts===1?'':'s'}</small><b>Árvore de habilidades</b><span>${Object.keys(rpgS().has).filter(id=>SKI[id]).length}/240 destravadas</span><div class="pbar rpg-bar"><i style="width:${Math.round(rpgS().xp/rpgNeed(rpgS().lvl)*100)}%"></i></div></div><span class="blr-ch">›</span></button>
 <h4 class="bl-sec">Treino da semana · 1 por semana</h4>${drillActs().map(blActRow).join('')}
 <h4 class="bl-sec">Treinos especiais · minigames</h4>${specialActs().map(blActRow).join('')}
 <h4 class="bl-sec">Recuperação</h4>${blActRow(restAct())}`,
 bind:root=>{root.querySelector('[data-k="tree"]').onclick=()=>blPush(skPage());root.querySelectorAll('[data-k]').forEach(b=>{if(b.dataset.k==='tree')return;b.onclick=()=>{const a=[...drillActs(),...specialActs(),restAct()].find(x=>x.id===b.dataset.k);if(a)blRunAct(a)}})}}}

// ---------- HUB ----------
function blStatsHTML(){ensureBL();const L=S.life;const bar=(ic,n,v)=>{const p=Math.round(clamp(v??0,0,100));const col=p>=66?'#2bd46a':p>=33?'#f2c443':'#ff5a4a';return`<div class="bl-st"><span>${ic} ${n}</span><i><s style="width:${p}%;background:${col}"></s></i><b>${p}%</b></div>`};
 return`<button class="bl-stats" id="blStats" aria-label="Seu jogador">${bar('😊','Felicidade',L.cab)}${bar('❤️','Saúde',L.sau)}${bar('💪','Forma',L.corpo)}${bar('🧠','Inteligência',L.int)}${bar('✨','Aparência',L.apa)}${bar('⭐','Fama',L.fama)}</button>`}
function blGoInfo(){const st=S.st;if(PAUSE)return{ic:'🤔',t:'DECIDA',dis:true};if(st.done)return{ic:'🏁',t:'BALANÇO',el:'endS'};const n=nextItem();if(!n)return{ic:'🏁',t:'FECHAR ANO',el:'a1'};
 if(isDecisive(n))return{ic:'🔴',t:'AO VIVO',el:'a1',hot:true};if(S.fast)return{ic:'⏩',t:`BLOCO ${blockInfo(st).b}/4`,el:'a1'};return{ic:'⚽',t:S.tempo>0?'IR PRO JOGO':'JOGAR',el:'a1'}}
function blNavHTML(){const g=blGoInfo();const B=S.bl||{};const dot=(on)=>on?'<i class="bl-dot"></i>':'';const R0=rpgS();
 return`<nav class="bl-nav"><button class="bl-nb" data-bl="vida" style="--c:var(--c-vida)"><span>🎲${dot(B.sick)}</span><b>Vida</b><small>Relações, saúde, lazer e o lado errado</small></button><button class="bl-nb" data-bl="comp" style="--c:var(--c-comp)"><span>🏆</span><b>Competições</b><small>Jogos, tabela, copas e troféus</small></button>
 <button class="bl-go ${g.hot?'hot':''}" id="blGo" ${g.dis?'disabled':''}><span>${g.ic}</span><b>${g.t}</b></button>
 <button class="bl-nb" data-bl="loja" style="--c:var(--c-loja)"><span>🛍️${dot(S.bootLeft>0&&S.bootLeft<=5||!S.boot)}</span><b>Loja</b><small>Chuteiras, carros e imóveis</small></button><button class="bl-nb" data-bl="treino" style="--c:var(--c-treino)"><span>🏋️${R0&&R0.pts?`<i class="bl-num">${R0.pts}</i>`:''}</span><b>Treino</b><small>Minigames e árvore de habilidades</small></button></nav>`}
function blFeedHTML(){const B=ensureBL();const st=S.st;const res=(st.log||[]).slice(-3).reverse();const lg=B.log.slice(0,5);if(!res.length&&!lg.length)return'';
 return`<section class="bl-feed"><div class="bl-fh">📰 Sua vida · ${S.age} anos</div>${res.map(r=>{try{return`<div class="bl-fl res">${resRow(r)}</div>`}catch(e){return''}}).join('')}${lg.map(e=>`<div class="bl-fl"><span>${e.ic}</span><p>${esc(e.t)}</p></div>`).join('')}</section>`}
function blHub(){const w=$app.querySelector('.wrap');document.body.classList.remove('blhub');const old=document.getElementById('blDock');if(old)old.remove();
 if(!w||!S||!S.st||!w.classList.contains('hubw')||(typeof inPrison==='function'&&inPrison()))return;
 ensureBL();document.body.classList.add('blhub');
 w.querySelectorAll(':scope > .rpgc, :scope > .hubnav, #lifeStrip, :scope > .journey').forEach(e=>e.remove());
 const todo=w.querySelector(':scope > .todo');if(todo)todo.remove();
 // a semana continua, mas as ações agora ficam nos menus
 const md=w.querySelector(':scope > .matchday, :scope > .blockcard');if(md&&!S.st.done&&!PAUSE)md.insertAdjacentHTML('afterend',blFeedHTML());
 // topo: saldo e opções
 const ph=$app.querySelector('.ph .ph-in');if(ph&&!ph.querySelector('.bl-money')){const ov=ph.querySelector('.ovr');ov.insertAdjacentHTML('beforebegin',`<div class="bl-money"><small>Saldo</small><b>${money(S.din)}</b></div>`);
  ov.insertAdjacentHTML('afterend','<button class="bl-gear" id="blGear" aria-label="Opções">⚙️</button>')}
 // com evento pendente ou temporada encerrada não existe o menu antigo: monta um menor com o que ainda vale
 if(!document.getElementById('dockM')){const m=document.createElement('div');m.className='dockmenu';m.id='dockM';m.hidden=true;
  m.innerHTML=`<div class="livemode"><span class="eyebrow">Jogada</span>${[['jogar','🎮 Jogar'],['decidir','🧠 Decidir']].map(([k,n])=>`<button class="lmbtn ${(S.lanceMode||'jogar')===k?'on':''}" data-l3m2="${k}">${n}</button>`).join('')}</div><button class="dmi" id="fastAll3">🏁 Simular até a aposentadoria</button>`;
  $app.appendChild(m);m.querySelectorAll('[data-l3m2]').forEach(b=>b.onclick=()=>{S.lanceMode=b.dataset.l3m2;try{saveNow('lanceMode')}catch(e){}m.querySelectorAll('[data-l3m2]').forEach(x=>x.classList.toggle('on',x===b))});
  const fa=m.querySelector('#fastAll3');fa.onclick=()=>{m.hidden=true;if(PAUSE){try{resolveOption(PAUSE,autoOption(PAUSE))}catch(e){}PAUSE=null;EVRES=null}fastForward()}}
 const dm=document.getElementById('dockM');if(dm){dm.hidden=true;dm.classList.add('bl-optmenu');document.body.appendChild(dm)}
 const dock=document.createElement('div');dock.id='blDock';dock.className='bl-dock';dock.innerHTML=blStatsHTML()+blNavHTML();$app.appendChild(dock);
 // o fim da página nunca fica escondido atrás da barra de baixo
 try{if(getComputedStyle(dock).position==='fixed')w.style.setProperty('padding-bottom',(dock.offsetHeight+18)+'px','important')}catch(e){}
 const gear=document.getElementById('blGear');if(gear&&dm)gear.onclick=e=>{e.stopPropagation();dm.hidden=!dm.hidden;if(!dm.hidden){const r=gear.getBoundingClientRect();dm.style.top=(r.bottom+6)+'px'}};
 if(dm)document.addEventListener('click',function off(e){if(!dm.isConnected){document.removeEventListener('click',off);return}if(!dm.hidden&&!dm.contains(e.target)&&e.target!==gear)dm.hidden=true});
 document.getElementById('blStats').onclick=()=>openHubPanel('jogador');
 dock.querySelectorAll('[data-bl]').forEach(b=>b.onclick=()=>{const k=b.dataset.bl;blOpen(k==='vida'?vidaPage():k==='comp'?compPage():k==='loja'?lojaPage():treinoPage())});
 document.getElementById('blGo').onclick=()=>{const g=blGoInfo();if(g.dis){const ev=$app.querySelector('.ev');if(ev)ev.scrollIntoView({behavior:'smooth'});return}const el=document.getElementById(g.el);if(el)el.click()};
}
{const _rh=renderHub;renderHub=function(...a){const r=_rh.apply(this,a);try{document.querySelectorAll('body > .bl-optmenu').forEach(x=>x.remove());blHub()}catch(e){console.error(e)}return r}}
{const _sh=shell;shell=function(...a){document.body.classList.remove('blhub');document.querySelectorAll('body > .bl-optmenu').forEach(x=>x.remove());return _sh.apply(this,a)}}
// tour do início explica o menu novo
if(typeof TOUR_HUB!=='undefined'){TOUR_HUB.length=0;TOUR_HUB.push(
 {sel:'.ph',t:'Este é você',d:'Idade, posição, clube, <b>saldo</b> e <b>OVR</b>. No ⚙️ ficam o modo rápido, o empresário e as opções de jogo.'},
 {sel:'.matchday, .blockcard',t:'Sua semana',d:'Próximo jogo e os dias livres até ele. Cada atividade gasta dias.'},
 {sel:'.bl-stats',t:'Sua vida em barras',d:'<b>Felicidade, Saúde, Forma, Inteligência, Aparência e Fama</b>. Tudo pesa em campo, nos contratos e nos patrocínios.'},
 {sel:'[data-bl="vida"]',t:'Vida',d:'Relacionamentos, médico, academia, balada, férias, estudos, cassino, loteria, processos, carteira, emigrar… e o lado errado.'},
 {sel:'[data-bl="comp"]',t:'Competições',d:'Jogos, tabela, copas, troféus, seu jogador e o empresário.'},
 {sel:'#blGo',t:'Avançar',d:'Vai pro jogo, joga o bloco ou passa <b>ao vivo</b> quando é decisivo.'},
 {sel:'[data-bl="loja"]',t:'Loja',d:'<b>Chuteiras</b> de Comum a Ícone, coleção, conserto, patrocínio. Também carros e imóveis.'},
 {sel:'[data-bl="treino"]',t:'Treino',d:'Treino da semana, minigames e a <b>árvore com 240 habilidades</b>. Difícil de completar.'})}

// ---------- estilos ----------
// Mesmo visual do resto do jogo: prancheta verde, giz e o laranja do colete só na ação.
// Cada área tem sua cor (Vida rosa, Competições dourado, Loja azul, Treino verde, Crime vermelho) usada como faixa.
{const st=document.createElement('style');st.textContent=`
body.blhub.onescreen .wrap{padding-bottom:calc(158px + env(safe-area-inset-bottom,0px))!important}
body.blhub .dock,body.blhub .ctabar,body.blhub .wacts{display:none!important}
body.blhub .ph .shield,body.blhub .ph .flagbox{display:none}body.blhub .ph .who b{font-size:16px}body.blhub .ph .who span{font-size:11.5px}
.bl-dock{position:fixed;left:0;right:0;bottom:0;z-index:12;margin:0 auto;max-width:760px;background:rgba(9,27,18,.97);backdrop-filter:blur(10px);border-top:1px solid var(--line-2);padding:8px 12px calc(6px + env(safe-area-inset-bottom,0px))}
.bl-stats{display:grid;grid-template-columns:1fr 1fr;gap:4px 14px;width:100%;margin:0 0 8px;padding:0;border:0;background:none;color:var(--chalk);font:inherit;text-align:left}
.bl-st{display:grid;grid-template-columns:auto 1fr 32px;align-items:center;gap:7px;font-size:11.5px;font-weight:700;color:var(--muted);white-space:nowrap}.bl-st span{min-width:88px}.bl-st i{height:6px;border-radius:4px;background:rgba(238,242,228,.1);overflow:hidden}.bl-st s{display:block;height:100%;border-radius:4px}.bl-st b{font:600 11px var(--f-mono);text-align:right;color:var(--chalk)}
.bl-nav{display:grid;grid-template-columns:1fr 1fr 1.3fr 1fr 1fr;align-items:end;gap:2px}
.bl-nb{display:grid;justify-items:center;gap:4px;padding:2px 0 0;border:0;background:none;color:var(--chalk);font:inherit}
.bl-nb span{position:relative;display:grid;place-items:center;width:44px;height:44px;border-radius:14px;background:color-mix(in srgb,var(--c) 20%,var(--panel));border:2px solid var(--c);font-size:21px}
.bl-nb b{font-size:11px;font-weight:700;color:var(--chalk)}.bl-nb small{display:none}
.bl-nb:active span{transform:translateY(2px)}
.bl-dot{position:absolute;top:-4px;right:-4px;width:12px;height:12px;border-radius:50%;background:var(--bad);border:2px solid var(--pitch)}
.bl-num{position:absolute;top:-7px;right:-9px;min-width:19px;height:19px;padding:0 4px;border-radius:10px;background:var(--gold);color:#241a00;font:700 11px/19px var(--f-mono);font-style:normal;border:2px solid var(--pitch)}
.bl-go{display:grid;justify-items:center;align-content:center;gap:1px;width:80px;height:80px;margin:-30px auto 0;border-radius:50%;border:4px solid var(--pitch);background:var(--accent);color:var(--accent-ink);box-shadow:0 5px 0 #b44a0c,0 10px 22px rgba(0,0,0,.45);font:inherit}
.bl-go span{font-size:26px;line-height:1}.bl-go b{font:900 italic 12px/1.02 var(--f-display);letter-spacing:.01em;text-align:center;max-width:66px;text-transform:uppercase}
.bl-go.hot{background:var(--bad);color:#fff;box-shadow:0 5px 0 #8a140d,0 10px 22px rgba(0,0,0,.45);animation:blpulse 1.6s infinite}.bl-go:disabled{filter:grayscale(.85);opacity:.65}.bl-go:active{transform:translateY(3px);box-shadow:0 2px 0 #b44a0c}
@keyframes blpulse{50%{box-shadow:0 5px 0 #8a140d,0 0 0 9px rgba(255,90,74,.22)}}
.bl-money{display:grid;justify-items:end;margin-left:auto;margin-right:8px;line-height:1.1}.bl-money small{font-size:10.5px;color:var(--muted)}.bl-money b{font:600 15px var(--f-mono);color:var(--gold)}
.ph .ph-in .who{min-width:0}.bl-gear{margin-left:6px;width:38px;height:38px;border-radius:12px;border:1px solid var(--line-2);background:var(--panel);font-size:17px}
.bl-optmenu{position:fixed!important;right:10px;left:auto!important;bottom:auto!important;top:60px;z-index:14;width:min(340px,calc(100vw - 20px));max-height:70vh;overflow:auto}
.bl-feed{display:grid;border-radius:var(--r-lg);background:var(--panel);border:1px solid var(--line);overflow:hidden}.bl-fh{padding:9px 14px;font:700 13px var(--f-body);color:var(--muted);border-bottom:1px solid var(--line)}
.bl-fl{display:flex;gap:10px;align-items:flex-start;padding:8px 14px;border-top:1px solid var(--line);font-size:13.5px}.bl-fl:first-of-type{border-top:0}.bl-fl span{font-size:17px}.bl-fl p{margin:0;line-height:1.35}.bl-fl.res{display:block;padding:4px 12px}
/* painel */
#blp{position:fixed;inset:0;z-index:18;background:var(--pitch);background-image:repeating-linear-gradient(180deg,var(--pitch) 0 72px,var(--pitch-2) 72px 144px)}#blp[hidden]{display:none}
.blp{--c:var(--accent);height:100%;display:flex;flex-direction:column;max-width:600px;margin:0 auto;background:transparent}
.blp.vida,.blp.rel{--c:var(--c-vida)}.blp.comp{--c:var(--c-comp)}.blp.shop{--c:var(--c-loja)}.blp.tree{--c:var(--c-treino)}.blp.crime{--c:var(--c-crime)}
.blp-h{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:12px;min-height:60px;padding:calc(8px + env(safe-area-inset-top,0px)) 12px 8px;background:var(--c);color:var(--ink)}
.blp-h b{grid-column:2;font:900 italic clamp(21px,6.2vw,30px)/1 var(--f-display);text-transform:uppercase;letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:2px}
.blp-x{grid-column:1;display:inline-flex;align-items:center;gap:5px;height:42px;padding:0 15px 0 10px;border-radius:999px;border:2px solid var(--ink);background:rgba(255,255,255,.3);color:var(--ink);font:800 15px/1 var(--f-body);white-space:nowrap}
.blp-x span{font-size:26px;line-height:.8;margin-top:-3px}
.blp-home{grid-column:3;width:42px;height:42px;border-radius:50%;border:2px solid var(--ink);background:rgba(255,255,255,.3);color:var(--ink);font:900 18px/1 var(--f-body);display:grid;place-items:center}
.blp-x:active,.blp-home:active{transform:translateY(1px);background:rgba(255,255,255,.45)}
.bl-me{display:flex;align-items:center;gap:10px;padding:9px 14px;background:rgba(5,16,10,.55);border-bottom:1px solid var(--line)}.bl-av{width:40px;height:40px;border-radius:50%;overflow:hidden;background:var(--panel-2);border:2px solid var(--c);flex:0 0 auto}.bl-av svg,.bl-av img{width:100%;height:100%;display:block}
.bl-mi{display:grid;min-width:0}.bl-mi b{font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bl-mi span{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bl-mm{margin-left:auto;display:grid;justify-items:end}.bl-mm b{font:600 17px var(--f-mono);color:var(--gold)}.bl-mm span{font-size:11.5px;color:var(--muted)}
.blp-b{flex:1;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;padding:10px 10px calc(28px + env(safe-area-inset-bottom,0px));display:grid;grid-template-columns:minmax(0,1fr);gap:6px;align-content:start;grid-auto-rows:max-content}.blp-b>*{min-width:0}
.blr{display:flex;align-items:center;gap:12px;width:100%;min-height:64px;padding:10px 14px;border:1px solid var(--line);border-radius:var(--r-md);background:var(--panel);color:var(--chalk);text-align:left;font:inherit}
.blr:hover{border-color:var(--line-2)}.blr:active{background:var(--panel-2)}.blr[aria-disabled=true]{background:rgba(20,52,36,.55)}.blr[aria-disabled=true] .blr-ic,.blr[aria-disabled=true] .blr-m b,.blr[aria-disabled=true] .blr-m small{opacity:.55}.blr.warn{box-shadow:inset 4px 0 0 var(--c-crime)}.blr.static{min-height:52px}
.blr-ic{flex:0 0 36px;font-size:28px;line-height:1;text-align:center}.blr-m{display:grid;gap:2px;min-width:0;flex:1}.blr-m b{font-size:16px;font-weight:700}.blr-m small{font-size:13px;color:var(--muted);line-height:1.3}.blr-m em{font-style:normal;font-size:12px;font-weight:700;color:var(--bad)}
.blr-c{flex:0 0 auto;max-width:112px;font-size:12px;font-weight:600;color:var(--muted);text-align:right}.blr-ch{flex:0 0 auto;font:700 26px/1 var(--f-body);color:var(--c);margin-left:2px}
.bl-sec{margin:12px 4px 2px;font:700 13px var(--f-body);color:var(--muted)}
.bl-box{display:grid;gap:4px;padding:12px 14px;border-radius:var(--r-md);background:var(--panel-2);border:1px solid var(--line)}.bl-box b{font-size:15px}.bl-box small{font-size:13px;color:var(--muted)}
.bl-box.big b{font:600 30px var(--f-mono);color:var(--gold)}.bl-box .btn{margin-top:6px}
.bl-row2{display:flex;gap:10px;align-items:center;padding:9px 11px;border-radius:var(--r-md);border:1px solid var(--line-2);background:var(--panel);color:var(--chalk);text-align:left;font:inherit}.bl-row2>span{font-size:24px}.bl-row2 div{display:grid;flex:1}.bl-row2 small{color:var(--muted)}.bl-row2 em{font-style:normal;font-weight:800;color:var(--accent)}
.bl-empty{margin:18px;color:var(--muted);text-align:center}
.bl-person{display:flex;gap:12px;align-items:center;margin-top:8px;padding:12px 14px;border-radius:var(--r-md);background:var(--panel-2);border:1px solid var(--line);border-left:4px solid var(--c)}.bl-person>span{font-size:30px}.bl-person>div{display:grid;gap:4px;flex:1}.bl-person b{font:800 italic 20px/1 var(--f-display);text-transform:uppercase}.bl-person small{color:var(--muted)}
.bl-meter{display:grid;grid-template-columns:76px 1fr 40px;gap:8px;align-items:center;font-size:12px;font-weight:700;color:var(--muted)}.bl-meter i{height:7px;border-radius:4px;background:rgba(238,242,228,.1);overflow:hidden}.bl-meter s{display:block;height:100%}.bl-meter b{font:600 12px var(--f-mono);text-align:right;color:var(--chalk)}
.bl-feat{--fc:var(--gold);display:flex;align-items:center;gap:12px;width:100%;padding:14px;border-radius:var(--r-lg);border:2px solid var(--fc);background:radial-gradient(120% 140% at 0% 0%,color-mix(in srgb,var(--fc) 24%,transparent),transparent 62%),var(--panel);color:var(--chalk);text-align:left;font:inherit}.bl-feat.tree{--fc:var(--c-treino)}
.bl-feat-s{flex:0 0 auto}.bl-feat-s.big{font-size:56px;width:80px;text-align:center}.bl-feat-m{display:grid;gap:3px;flex:1;min-width:0}
.bl-feat-m small{font-size:12px;font-weight:700;color:var(--fc)}.bl-feat-m b{font:900 italic 26px/1 var(--f-display);text-transform:uppercase}.bl-feat-m span{font-size:13.5px;color:var(--chalk)}.bl-feat-m em{font-style:normal;font-size:12.5px;color:var(--muted)}
.bl-faces{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:8px}.bl-face{display:grid;gap:4px;justify-items:center;padding:10px 4px;border-radius:var(--r-md);border:2px solid var(--line);background:var(--panel);color:var(--chalk);font:inherit}.bl-face svg,.bl-face img{width:72px;height:72px}.bl-face small{font-size:12.5px;font-weight:700}.bl-face.on{border-color:var(--accent)}
/* popup */
.bl-pophost{position:fixed;inset:0;z-index:19;display:grid;place-items:center;padding:20px;background:rgba(4,12,8,.7);animation:blfade .15s}
@keyframes blfade{from{opacity:0}}
.bl-pop{width:min(400px,100%);max-height:88vh;overflow:auto;border-radius:22px;background:var(--panel);border:1px solid var(--line-2);box-shadow:0 26px 60px rgba(0,0,0,.55)}
.bl-poph{padding:12px 16px;background:var(--accent);color:var(--accent-ink);font:900 italic 24px/1.05 var(--f-display);text-transform:uppercase}
.bl-popb{display:grid;gap:12px;justify-items:center;padding:18px 16px 16px;text-align:center}
.bl-popb p{margin:0;font-size:15.5px;line-height:1.45}.bl-pic{font-size:46px;line-height:1}.bl-psvg{display:grid;place-items:center;width:100%;padding:10px;border-radius:16px;background:radial-gradient(80% 80% at 50% 30%,rgba(238,242,228,.14),transparent 70%),var(--pitch)}.bl-chips{justify-content:center}
.bl-pill{width:100%;min-height:50px;border-radius:var(--r-md);border:0;background:var(--accent);color:var(--accent-ink);font:800 18px var(--f-display);letter-spacing:.03em;text-transform:uppercase;box-shadow:0 3px 0 #b44a0c}.bl-pill.alt{background:transparent;color:var(--chalk);border:1px solid var(--line-2);box-shadow:none;font-family:var(--f-body);font-weight:700;font-size:15px;text-transform:none;letter-spacing:0}
.bl-pill:active{transform:translateY(2px);box-shadow:0 1px 0 #b44a0c}
body.bl-open{overflow:hidden}
/* ---------- tablet ---------- */
@media (min-width:700px){
 body.blhub .mdt .shield.lg,body.blhub .shield.lg.qq{width:96px!important;height:108px!important}body.blhub .mdt b{font-size:20px!important}body.blhub .mdx b{font-size:52px!important}body.blhub .wday{padding:10px 4px!important}body.blhub .wday .wic{height:30px!important;font-size:24px!important}body.blhub .wday b{font-size:12.5px!important}body.blhub .matchday .eyebrow{font-size:14px}
 body.blhub.onescreen .wrap.hubw{width:100%;max-width:820px}
 body.blhub .ph-in{max-width:820px}
 .bl-dock{max-width:960px;border-radius:22px 22px 0 0;border:1px solid var(--line-2);border-bottom:0;padding:10px 22px calc(8px + env(safe-area-inset-bottom,0px))}
 .bl-stats{grid-template-columns:repeat(3,1fr);gap:6px 20px}.bl-st{font-size:12.5px}.bl-st b{font-size:12px}
 .bl-nb span{width:54px;height:54px;font-size:25px;border-radius:16px}.bl-nb b{font-size:12.5px}
 .bl-go{width:92px;height:92px;margin-top:-38px}.bl-go b{font-size:13px;max-width:76px}
 /* painéis ocupam a tela toda: linhas em colunas, nada de folha estreita no meio */
 .blp{max-width:none;width:100%}
 .blp-h{min-height:68px;padding:10px 24px;gap:16px}.blp-h b{font-size:32px}
 .bl-me{padding:10px 24px}
 .blp-b{padding:18px 24px 36px;gap:10px;grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}
 .blp-b>:not(.blr):not(.bl-row2){grid-column:1/-1}
 .blp-b>.bl-sec{margin:14px 2px 0}
 .blr{min-height:72px}
 .bl-pop{width:min(780px,100%)}
 .bl-popb{grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);align-items:center;justify-items:stretch;gap:12px 22px;padding:22px 24px;text-align:left}
 .bl-popb>*{grid-column:2}
 .bl-popb>.bl-pic,.bl-popb>.bl-psvg{grid-column:1;grid-row:1/span 12;align-self:stretch;display:grid;place-items:center;min-height:200px;border-radius:16px;background:radial-gradient(80% 80% at 50% 30%,rgba(238,242,228,.14),transparent 70%),var(--pitch)}
 .bl-popb>.bl-pic{font-size:96px}
 .bl-popb:not(:has(>.bl-pic,>.bl-psvg)){grid-template-columns:minmax(0,1fr);text-align:center}
 .bl-popb:not(:has(>.bl-pic,>.bl-psvg))>*{grid-column:1}
 .bl-popb .bl-chips{justify-content:flex-start}
 .bl-poph{font-size:28px;padding:14px 24px}
}
/* ---------- computador: mesa de técnico ---------- */
@media (min-width:1100px){
 body.blhub.onescreen #app{display:grid;grid-template-columns:minmax(0,1fr) 380px;grid-template-rows:auto minmax(0,1fr)}
 body.blhub #app>.ph{grid-column:1/-1}
 body.blhub .ph-in{max-width:none;padding-left:32px;padding-right:32px}
 body.blhub.onescreen #app>.wrap.hubw{grid-column:1;grid-row:2;max-width:1120px;width:100%;margin:0 auto;padding:24px 32px 32px!important;gap:16px!important;display:grid!important;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);align-content:start;align-items:start}
 body.blhub .wrap.hubw>*{grid-column:1/-1}
 body.blhub .wrap.hubw>.matchday,body.blhub .wrap.hubw>.blockcard{grid-column:1;grid-row:1/span 6;min-height:min(560px,calc(100dvh - 140px))}
 body.blhub .wrap.hubw>.bl-feed,body.blhub .wrap.hubw>.hubctl,body.blhub .wrap.hubw>.wildev{grid-column:2}
 .bl-dock{position:static;grid-column:2;grid-row:2;max-width:none;margin:0;display:flex;flex-direction:column;gap:18px;padding:22px 22px 28px;border-radius:0;border:0;border-left:1px solid var(--line-2);background:rgba(7,22,15,.92);overflow-y:auto}
 .bl-stats{grid-template-columns:1fr;gap:10px;margin:0;padding:16px;border-radius:var(--r-lg);background:var(--panel);border:1px solid var(--line);cursor:pointer}
 .bl-stats:hover{border-color:var(--line-2)}
 .bl-st{grid-template-columns:120px 1fr 40px;font-size:13.5px}.bl-st i{height:8px}.bl-st b{font-size:13px}
 .bl-nav{grid-template-columns:minmax(0,1fr);grid-template-areas:"go" "vida" "comp" "loja" "treino";gap:8px;align-items:stretch}
 .bl-nav [data-bl=vida]{grid-area:vida}.bl-nav [data-bl=comp]{grid-area:comp}.bl-nav [data-bl=loja]{grid-area:loja}.bl-nav [data-bl=treino]{grid-area:treino}
 .bl-go{grid-area:go;width:100%;height:auto;min-height:84px;margin:0 0 4px;border-radius:20px;border:0;grid-auto-flow:column;gap:12px;justify-content:center;box-shadow:0 5px 0 #b44a0c}
 .bl-go span{font-size:30px}.bl-go b{font-size:26px;max-width:none}
 .bl-go.hot{box-shadow:0 5px 0 #8a140d}
 .bl-nb{min-width:0;grid-template-columns:auto minmax(0,1fr);grid-template-rows:auto auto;justify-items:start;align-items:center;column-gap:14px;row-gap:2px;padding:10px 14px;border-radius:var(--r-lg);background:var(--panel);border:1px solid var(--line);text-align:left}
 .bl-nb:hover{border-color:var(--c)}.bl-nb span{grid-row:1/span 2;width:48px;height:48px}.bl-nb b{font:800 italic 19px/1 var(--f-display);text-transform:uppercase}.bl-nb small{display:block;font-size:12px;color:var(--muted);line-height:1.25}
 .blp{animation:blin .2s cubic-bezier(.2,1,.3,1) both}
 @keyframes blin{from{transform:translateY(14px);opacity:0}}
 .blp-h,.bl-me{padding-left:32px;padding-right:32px}
 .blp-b{padding:22px 32px 44px;gap:12px;grid-template-columns:repeat(auto-fill,minmax(340px,1fr))}
 .bl-optmenu{top:64px;right:400px}
}`;document.head.appendChild(st)}
// a dica antiga ("Tudo numa tela") não vale mais
if(typeof oneScreenHub==='function'){const _osh=oneScreenHub;oneScreenHub=function(...a){try{if(S){S.tips=S.tips||{};S.tips.one=true}}catch(e){}return _osh.apply(this,a)}}
