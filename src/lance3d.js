// ================== LANCE 3D: o Modo Lance dentro da carreira ==================
// Com "Jogar os lances" ligado, cada lance da carreira (jogo, peneira, pelada, pênaltis) abre o motor 3D
// num iframe por cima da tela, com as cores dos dois times, o seu rosto e o seu número. O resultado volta
// pro jogo como gol, assistência, defesa ou erro. "Só decisão" mantém os momentos de decisão de antes.
// A escolha fica em S.lanceMode ('jogar' | 'decidir'). Se o 3D não carregar, cai na decisão sozinho.
const L3D={frame:null,ready:null,_ready:null,_res:null,ctx:null,failed:false};
function lanceMode(){return(S&&S.lanceMode)||'jogar'}
function l3dBoot(){if(L3D.ready)return L3D.ready;
 L3D.ready=new Promise((res,rej)=>{L3D._ready=res;L3D._fail=rej;const f=document.createElement('iframe');f.className='l3d';f.title='Lance em 3D';
  f.srcdoc='<script>window.ML_EMBED=1<\/script>'+L3D_HTML;document.body.appendChild(f);L3D.frame=f;setTimeout(()=>rej(new Error('lance3d: timeout')),15000)});
 L3D.ready.catch(()=>{L3D.failed=true});return L3D.ready}
addEventListener('message',e=>{const d=e.data||{};if(!L3D.frame||e.source!==L3D.frame.contentWindow)return;
 if(d.type==='ml-ready'&&L3D._ready)L3D._ready();if(d.type==='ml-fail'&&L3D._fail)L3D._fail(new Error('lance3d: three.js não carregou'));
 if(d.type==='ml-result'&&L3D._res){const r=L3D._res;L3D._res=null;if(!SESS.on){L3D.frame.classList.remove('on');document.body.classList.remove('l3d-on')}r(d.res||{skip:true})}});
// cena do motor pra cada tipo de lance
// cada posição tem os seus lances: zagueiro desarma e sai jogando, lateral cruza, volante lança, meia tabela, ponta dribla, atacante finaliza
const L3D_POS={
 GOL:{pass:['tiroMeta'],long:['tiroMeta'],cross:['tiroMeta']},
 ZAG:{pass:['saida','virada','lanca'],long:['lanca','saida'],cross:['escanteio','cabeca'],finish:['cabeca','escanteio','rebote'],dribble:['saida'],header:['cabeca','escanteio']},
 LD:{pass:['virada','contra','saida','lateral'],long:['lanca'],cross:['cruz','lateral','escCurto'],finish:['longe','contra'],dribble:['lateral','contra']},
 LE:{pass:['virada','contra','saida','lateral'],long:['lanca'],cross:['cruz','lateral','escCurto'],finish:['longe','contra'],dribble:['lateral','contra']},
 VOL:{pass:['saida','virada','enfiada','lanca'],long:['lanca','saida'],cross:['escanteio'],finish:['longe','faltaLonge','rebote'],dribble:['saida']},
 MC:{pass:['tabela','virada','enfiada','lanca'],long:['lanca','contra3'],cross:['escCurto','cruz'],finish:['longe','area','faltaLonge'],dribble:['area','contra']},
 ME:{pass:['contra','tabela','virada'],long:['lanca'],cross:['cruz','escCurto'],finish:['area','longe'],dribble:['mano','lateral']},
 MD:{pass:['contra','tabela','virada'],long:['lanca'],cross:['cruz','escCurto'],finish:['area','longe'],dribble:['mano','lateral']},
 MEI:{pass:['enfiada','tabela','contra3'],long:['lanca'],cross:['escCurto'],finish:['area','longe','voleio','falta'],dribble:['area','pivo','mano']},
 PE:{pass:['contra3','enfiada','contra'],long:['contra3'],cross:['cruz','lateral'],finish:['area','mano','contra'],dribble:['mano','lateral','area']},
 PD:{pass:['contra3','enfiada','contra'],long:['contra3'],cross:['cruz','lateral'],finish:['area','mano','contra'],dribble:['mano','lateral','area']},
 SA:{pass:['tabela','pivo','enfiada'],long:['contra3'],cross:['cruz'],finish:['area','voleio','rebote','mano'],dribble:['pivo','mano','area']},
 ATA:{pass:['pivo','tabela'],long:['contra3'],cross:['cruz'],finish:['area','mano','rebote','voleio','pivo'],dribble:['mano','pivo','area'],header:['cabeca','voleio']}};
function l3dScene(o){const K=o.kind||'finish';const pos=(S&&S.pos)||'ATA';const P=L3D_POS[pos]||{};
 if(K==='tackle')return pick(['desarme','desarme','corte']);
 if(K==='keeper')return o.pen?'gkPen':pick(['gkShot','gkShot','gkFk','gkMano','gkCab']);
 if(K==='pen')return'penalti';if(K==='fk')return pick(['falta','falta','faltaLonge']);if(K==='chip')return'mano';if(K==='combo')return'tabela';
 if(K==='header')return pick(P.header||['cabeca','cabeca','voleio']);
 const base={long:['lanca','lanca','saida','contra3'],cross:['cruz','cruz','escanteio','escCurto','lateral'],pass:o.planned?['contra','saida','contra3']:['contra','saida','tabela','area','contra3','pivo'],dribble:['mano','area','contra','pivo','lateral'],
  finish:o.planned?['mano','area','contra','rebote','voleio']:['area','longe','contra','rebote','voleio','pivo']}[K]||['area'];
 if(o.passOnly){const L=(P.pass||[]).concat(P.long||[]).filter(x=>x!=='area');return pick(L.length?L:['saida','virada','enfiada','tabela'])}
 const mine=P[K];if(pos==='GOL'&&mine)return pick(mine);return pick(mine&&Math.random()<.75?mine:base)}
const L3D_HAIR={buzz:'buzz',lateral:'quiff',quiff:'quiff',afro:'afro',cacheado:'afro',long:'long',dreads:'long',moicano:'quiff',coque:'long',bald:'bald'};
function l3dDist(a,b){const p=h=>{h=(h||'#000').replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h,16)||0;return[n>>16&255,n>>8&255,n&255]};const x=p(a),y=p(b);return Math.hypot(x[0]-y[0],x[1]-y[1],x[2]-y[2])}
function l3dKit(c){const c1=(c&&c.c1)||'#ff6a12',c2=(c&&c.c2)||'#ffffff';return{shirt:c1,shirt2:c2,shorts:l3dDist(c1,c2)>120?c2:'#1b1f24',socks:c1}}
function l3dCfg(o){const ctx=L3D.ctx||{};const us=ctx.us||club()||null,them=ctx.them||null;
 const U=l3dKit(us);let Tm=them?l3dKit(them):{shirt:'#2f6fe0',shirt2:'#ffffff',shorts:'#13285a',socks:'#2f6fe0'};
 if(l3dDist(U.shirt,Tm.shirt)<110){const alt=them&&l3dDist(U.shirt,them.c2||'#fff')>=110?them.c2:(l3dDist(U.shirt,'#ffffff')>140?'#ffffff':'#151515');Tm={shirt:alt,shirt2:alt==='#ffffff'?'#151515':'#ffffff',shorts:alt,socks:alt}}
 let hero={num:S.num||9};try{const L=faceLook(S.face||{preset:0});hero={num:S.num||9,skin:L.skin,hair:L.hair,style:L3D_HAIR[L.style]||'buzz',beard:!!L.beard,band:!!L.band}}catch(e){}
 const sk=clamp(o.skill??.6,.1,.98),kp=clamp(o.keeper??.45,.1,.9);const sc=l3dScene(o);const GK=sc.startsWith('gk');
 const tag=o.passOnly?'Construção':o.kind==='tackle'?'Desarme':GK?'Defesa':({pass:'Passe',long:'Lançamento',cross:'Cruzamento',dribble:'Um contra um',header:'Cabeçada',fk:'Falta',pen:'Pênalti',chip:'Cobertura',combo:'Tabela'})[o.kind]||'Finalização';
 return{scen:sc,goal:o.passOnly?'pass':null,us:U,them:Tm,gkUs:{shirt:'#20c4bd',shirt2:'#0b2626',shorts:'#0b2626',socks:'#20c4bd'},hero,min:o.min||0,
  title:`${o.min?o.min+"' · ":''}${o.comp||tag}`,head:o.title&&!/^(finish|pass|keeper)$/.test(o.title)?o.title:tag,desc:null,
  noiseK:clamp(1.45-.9*sk,.5,1.3),gkK:clamp((kp-.45)*4,-1,1),myGkK:.85+.3*sk,shNoise:clamp(1.6-(((them&&them.s)||70)-50)/50,.75,1.4),
  crowd:[U.shirt,U.shirt2,Tm.shirt]}}
// no presídio o lance é no pátio: chão de barro, coletes laranja × listrado, policiais em volta e sem torcida
{const _cfg=l3dCfg;l3dCfg=function(o){const c=_cfg(o);try{if(o.env==='prison'||(typeof inPrison==='function'&&inPrison())||/presídio|prisão|pátio/i.test(o.comp||'')){c.env='prison';delete c.us;delete c.them;delete c.gkUs;c.crowd=null;if(c.hero)c.hero.boot='#e9e6df'}}catch(e){}return c}}
function l3dResult(o,res){const K=o.kind||'finish';
 if(o.passOnly){NM.netHit=null;NM.intc=null;NM.dmAssist=false;NM.selfGoal=false;const ok=!!res.goal||res.kind==='passok'||(res.chain|0)>=1;NM.last=res.goal?'Golaço da jogada!':ok?'Passe na medida!':res.kind==='off'?'Impedimento.':'Passe cortado.';NM.grade=res.goal?94:ok?80:40;NM.why='Lance de passe';return{ok,perfect:!!res.goal,grade:NM.grade}}
 if(K==='tackle'){NM.netHit=null;NM.intc=null;NM.dmAssist=false;NM.selfGoal=false;const won=['desarme','corte','block'].includes(res.kind);const ok=!res.goal&&res.kind!=='falta';
  NM.last=res.kind==='desarme'?'Desarmou!':res.kind==='corte'?'Cortou!':res.kind==='block'?'Bloqueou!':res.kind==='falta'?'Falta.':res.goal?'Gol deles.':ok?'O goleiro salvou.':'Passou por você.';
  NM.grade=won?92:ok?62:40;NM.why='Lance de defesa';return{ok,perfect:won,grade:NM.grade}}
 const GK=K==='keeper';const isPassK=['pass','long','cross'].includes(K);const train=/Peneira|Treino/i.test(o.comp||'');
 NM.netHit=null;NM.intc=null;NM.dmAssist=false;NM.selfGoal=false;let ok;
 if(GK){ok=o.pen?(res.kind==='save'||res.kind==='claim'):!res.goal;NM.last=res.goal?'Foi no canto.':ok?(o.okTxt||'DEFENDEU!'):'Pra fora!'}
 else{ok=!!res.goal||(train&&isPassK&&res.chain>=1);
  if(res.goal){if(isPassK||o.ast){if(res.heroGoal)NM.selfGoal=true}else if(!res.heroGoal&&res.heroAssist&&K!=='pen')NM.dmAssist=true}
  NM.last=ok?(o.okTxt||'GOL!'):res.kind==='off'?'Impedimento.':res.kind==='tackle'?'Desarmado.':res.kind==='block'?'Bloqueado.':K==='pen'?(res.kind==='save'||res.kind==='claim'?'O goleiro segurou.':'Pra fora!'):isPassK?'Interceptado.':res.kind==='save'||res.kind==='claim'?'O goleiro pegou.':'Pra fora!'}
 const perfect=ok&&!!(res.fk||res.header||res.chain>=2||(GK&&res.dived&&res.kind==='save')||res.caught);NM.grade=ok?(perfect?92:78):40;NM.why='Lance jogado';
 return{ok,perfect,grade:NM.grade}}
async function lance3dPlay(o){
 if(!L3D.frame||!L3D._loaded){try{toast({ic:'⚽',title:'Abrindo o lance',txt:'Carregando o campo em 3D…',ms:1600})}catch(e){}}
 await l3dBoot();L3D._loaded=true;const cfg=l3dCfg(o);if(SESS.on)cfg.sess=true;
 L3D.frame.classList.add('on');document.body.classList.add('l3d-on');
 const res=await new Promise(r=>{L3D._res=r;L3D.frame.contentWindow.postMessage({type:'ml-play',cfg},'*')});
 return res}
// liga no lugar do momento de decisão (fica por baixo do XP do rpg.js, que vem depois)
{const _nmDecide=nssMoment;nssMoment=async function(o){if(SESS.skipAll)return l3dAuto(o);if(lanceMode()!=='jogar'||L3D.failed)return SESS.on?l3dAuto(o):_nmDecide(o);
  let res;try{res=await lance3dPlay(o)}catch(e){L3D.failed=true;try{toast({ic:'⚠️',title:'Lance 3D indisponível',txt:'Seguindo com os momentos de decisão.',ms:2600})}catch(_){}return _nmDecide(o)}
  if(!res||res.skip)return SESS.on||SESS.skipAll?l3dAuto(o):_nmDecide(o);return l3dResult(o,res)}}
// guarda os dois times do jogo atual pras cores
{const _pm=playMine;playMine=async function(o,io){L3D.ctx={us:o&&o.us,them:o&&o.them};try{return await _pm(o,io)}finally{L3D.ctx=null}}}
// pré-carrega o 3D quando a carreira está aberta e o modo é jogar
{const _rh=renderHub;renderHub=function(...a){const r=_rh.apply(this,a);try{if(lanceMode()==='jogar'&&!L3D.ready&&!L3D._sched){L3D._sched=true;const go=()=>{if(!L3D.ready)l3dBoot().catch(()=>{})};setTimeout(()=>{if(window.requestIdleCallback)requestIdleCallback(go,{timeout:5000});else go()},1500)}}catch(e){}return r}}
{const st=document.createElement('style');st.textContent=`.l3d{position:fixed;inset:0;width:100%;height:100%;border:0;z-index:9999;display:none;background:#0d1f15}.l3d.on{display:block}body.l3d-on{overflow:hidden}`;document.head.appendChild(st)}
// peneira: o técnico explica do jeito certo pra cada modo
if(typeof coachCard==='function'){const _cc=coachCard;coachCard=function(st,...a){if(lanceMode()==='jogar'&&!L3D.failed){try{toast({ic:COACH.ic,title:COACH.n,txt:st.k==='keeper'?`Estação de ${st.n.toLowerCase()}: arraste pro lado do chute pra voar.`:`Estação de ${st.n.toLowerCase()}: puxe da bola pra trás e toque nela pra dar efeito.`,ms:2600})}catch(e){}return Promise.resolve()}return _cc(st,...a)}}
// ================== PARTIDA EM LANCES ==================
// Com "Jogar" ligado, o jogo em que você entra em campo acontece inteiro no estádio 3D: o relógio corre, os seus lances
// entram um atrás do outro sem tela de apresentação, os gols dos outros aparecem num lance rápido e no fim vem o
// resumo com a sua nota. É o "ao vivo" da carreira (live) passando dentro do motor. ⚙️ › Partida volta pro jeito antigo.
const SESS={on:false,skipAll:false,me:null,scorers:null,seq:0,wait:{}};
function sessWanted(){return lanceMode()==='jogar'&&!L3D.failed&&(S.matchMode||'sess')==='sess'}
function sessCall(op,data){return new Promise(r=>{const id=++SESS.seq;SESS.wait[id]=r;try{L3D.frame.contentWindow.postMessage({type:'ml-sess',op,id,...(data||{})},'*')}catch(e){delete SESS.wait[id];r({})}})}
addEventListener('message',e=>{const d=e.data||{};if(!L3D.frame||e.source!==L3D.frame.contentWindow)return;
 if(d.type==='ml-sess-ok'){if(d.skipAll)SESS.skipAll=true;const r=SESS.wait[d.id];if(r){delete SESS.wait[d.id];r(d)}}
 if(d.type==='ml-sess-skip')SESS.skipAll=true});
// lance resolvido sem jogar (⏭ ou "Simular"): a chance depende da sua habilidade
function l3dAuto(o){const sk=clamp(o.skill??.6,.1,.98),kp=clamp(o.keeper??.45,.1,.9);const K=o.kind||'finish';
 const p=K==='tackle'?clamp(.35+.45*sk,.2,.8):K==='keeper'?clamp(.3+.4*sk,.15,.75):clamp(.22+.5*sk-.3*kp,.1,.75);const ok=Math.random()<p;
 NM.netHit=null;NM.intc=null;NM.dmAssist=false;NM.selfGoal=false;NM.last=ok?(o.okTxt||'Deu certo!'):'Não deu.';NM.grade=ok?70:42;NM.why='Simulado';return{ok,perfect:false,grade:NM.grade}}
function sessInfo(m){const base=l3dCfg({kind:'finish'});const us=m.us,th=m.them;const tc=x=>{try{return teamColors(x)}catch(e){return['#e8e8e8','#151515']}};
 return{cfg:{us:base.us,them:base.them,gkUs:base.gkUs,hero:base.hero,crowd:base.crowd,env:base.env},usName:us.n,themName:th.n,usAbbr:mkAbbr(us.n),themAbbr:mkAbbr(th.n),usC:[base.us&&base.us.shirt||tc(us)[0],tc(us)[1]],themC:[base.them&&base.them.shirt||tc(th)[0],tc(th)[1]],
  comp:m.o&&m.o.comp,label:m.o&&m.o.label,home:m.home,heroGK:S.pos==='GOL',def:['GOL','ZAG','LD','LE','VOL'].includes(S.pos)}}
const IO_LIVE0=IO_UI.live;
const SESS_LIVE={sess:true,async start(m){
  const fallback=()=>m.o&&m.o.__live0?IO_LIVE0.start(m):null;
  if(!m.part||!m.part.play||!sessWanted())return fallback();
  try{await l3dBoot();L3D._loaded=true}catch(e){return fallback()}
  SESS.on=true;SESS.skipAll=false;SESS.me=null;SESS.scorers=null;L3D.frame.classList.add('on');document.body.classList.add('l3d-on');
  const r=await sessCall('start',{info:sessInfo(m)});
  if(!r||r.skip||r.err){SESS.on=false;SESS.skipAll=!!(r&&r.skip);L3D.frame.classList.remove('on');document.body.classList.remove('l3d-on');return fallback()}
  let done=false;
  const api={sess:true,
   async until(t){if(SESS.skipAll&&!SESS.on)return;await sessCall('clock',{to:t})},
   flash(t){if(SESS.on&&!SESS.skipAll)try{L3D.frame.contentWindow.postMessage({type:'ml-sess',op:'flash',txt:t},'*')}catch(e){}},
   redraw(){},
   async event(e,gu,gt){await sessCall('event',{e:{t:e.t,us:!!e.us,mine:!!e.mine,ast:!!e.ast,missed:!!e.missed,w:e.w,m:e.m},gu,gt})},
   async finish(f){if(done)return;done=true;const me=SESS.me||{};
    await sessCall('end',{f:{msg:f&&f.msg,win:f&&f.win,gu:SESS.gu,gt:SESS.gt},me:{nota:me.nota,g:me.g,a:me.a},scorers:(SESS.scorers||[]).map(s=>({m:s.m,w:s.w,us:s.us}))});
    SESS.on=false;SESS.skipAll=false;L3D.frame.classList.remove('on');document.body.classList.remove('l3d-on')}};
  SESS.api=api;return api}};
// pênalti dentro da partida em lances: no 3D também
async function sessPenalty(o){if(o.mode==='shoot'){const sk=typeof skillOf==='function'?skillOf('FIN'):.6;const r=await nssMoment({kind:'pen',title:'Pênalti!',skill:sk,keeper:.5,okTxt:'GOL!',comp:o.comp,min:o.min});return{goal:!!r.ok,res:r.ok?'gol':'defesa'}}
 const sk=typeof skillOf==='function'?skillOf('REF'):.6;const r=await nssMoment({kind:'keeper',pen:true,title:'Pênalti contra',skill:sk,keeper:.5,okTxt:'DEFENDEU!',comp:o.comp,min:o.min});return{goal:!r.ok,res:r.ok?'defesa':'gol'}}
{const _pm3=playMine;playMine=async function(o,io){
  if(!io||io===IO_AUTO||!io.chance||!sessWanted())return _pm3(o,io);
  const o2={...o,__live0:!!o.live,live:true};
  const io2={...io,live:SESS_LIVE,matchDecision:null,penalty:async x=>SESS.on?sessPenalty(x):io.penalty(x)};
  const r=await _pm3(o2,io2);SESS.skipAll=false;
  if(r&&r.live&&r.live.sess){SESS.me=r.me;SESS.scorers=r.scorers;SESS.gu=r.gu;SESS.gt=r.gt;const L=r.live;
   // quem chamou fecha com a mensagem certa (campeão, classificado...); se ninguém fechar, fecha sozinho
   setTimeout(()=>{L.finish({msg:'Fim de jogo.',win:r.gu>r.gt?true:r.gu<r.gt?false:null})},0)}
  return r}}
// ⚙️ › Partida: lances em sequência (novo) ou o jeito antigo
function smRowHTML(){const v=S.matchMode||'sess';return`<div class="livemode" id="smRow"><span class="eyebrow">Partida</span>${[['sess','🏟️ Em lances'],['old','📋 Clássica']].map(([k,n])=>`<button class="lmbtn ${v===k?'on':''}" data-sm="${k}">${n}</button>`).join('')}</div>`}
function smEnsureRow(){const m=document.getElementById('dockM');if(!m||!S||m.querySelector('#smRow'))return;const j=m.querySelector('[data-l3m],[data-l3m2]');const row=j?j.closest('.livemode'):null;if(row)row.insertAdjacentHTML('afterend',smRowHTML());else m.insertAdjacentHTML('afterbegin',smRowHTML());
 m.querySelectorAll('[data-sm]').forEach(b=>b.onclick=ev=>{ev.stopPropagation();S.matchMode=b.dataset.sm;try{saveNow('matchMode')}catch(e){}m.querySelectorAll('[data-sm]').forEach(x=>x.classList.toggle('on',x===b))})}
{const _rh3=renderHub;renderHub=function(...a){const r=_rh3.apply(this,a);try{smEnsureRow();setTimeout(()=>{try{smEnsureRow()}catch(e){}},0)}catch(e){}
  try{if(S&&!S.sessTold&&sessWanted()&&!S.youth){S.sessTold=1;setTimeout(()=>{try{toast({ic:'🏟️',title:'Partida em lances',txt:'Agora o jogo inteiro passa no estádio e os seus lances vêm em sequência. Acerte seguido pra ficar em chamas. ⚙️ › Partida troca.',ms:5200})}catch(e){}},900)}}catch(e){}
  return r}}
