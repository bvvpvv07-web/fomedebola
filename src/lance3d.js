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
 if(d.type==='ml-result'&&L3D._res){const r=L3D._res;L3D._res=null;L3D.frame.classList.remove('on');document.body.classList.remove('l3d-on');r(d.res||{skip:true})}});
// cena do motor pra cada tipo de lance
function l3dScene(o){const K=o.kind||'finish';
 if(K==='keeper')return o.pen?'gkPen':pick(['gkShot','gkShot','gkFk','gkMano','gkCab']);
 if(K==='pen')return'penalti';if(K==='fk')return'falta';if(K==='chip')return'mano';if(K==='combo')return'tabela';if(K==='header')return pick(['cabeca','cabeca','voleio']);
 if(K==='long')return pick(['lanca','lanca','saida','contra3']);if(K==='cross')return pick(['cruz','cruz','escanteio','escCurto','lateral']);
 if(K==='pass')return o.planned?pick(['contra','saida','contra3']):pick(['contra','saida','tabela','area','contra3','pivo']);
 if(K==='dribble')return pick(['mano','area','contra','pivo','lateral']);
 return o.planned?pick(['mano','area','contra','rebote','voleio']):pick(['area','longe','contra','rebote','voleio','pivo'])}
const L3D_HAIR={buzz:'buzz',lateral:'quiff',quiff:'quiff',afro:'afro',cacheado:'afro',long:'long',dreads:'long',moicano:'quiff',coque:'long',bald:'bald'};
function l3dDist(a,b){const p=h=>{h=(h||'#000').replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h,16)||0;return[n>>16&255,n>>8&255,n&255]};const x=p(a),y=p(b);return Math.hypot(x[0]-y[0],x[1]-y[1],x[2]-y[2])}
function l3dKit(c){const c1=(c&&c.c1)||'#ff6a12',c2=(c&&c.c2)||'#ffffff';return{shirt:c1,shirt2:c2,shorts:l3dDist(c1,c2)>120?c2:'#1b1f24',socks:c1}}
function l3dCfg(o){const ctx=L3D.ctx||{};const us=ctx.us||club()||null,them=ctx.them||null;
 const U=l3dKit(us);let Tm=them?l3dKit(them):{shirt:'#2f6fe0',shirt2:'#ffffff',shorts:'#13285a',socks:'#2f6fe0'};
 if(l3dDist(U.shirt,Tm.shirt)<110){const alt=them&&l3dDist(U.shirt,them.c2||'#fff')>=110?them.c2:(l3dDist(U.shirt,'#ffffff')>140?'#ffffff':'#151515');Tm={shirt:alt,shirt2:alt==='#ffffff'?'#151515':'#ffffff',shorts:alt,socks:alt}}
 let hero={num:S.num||9};try{const L=faceLook(S.face||{preset:0});hero={num:S.num||9,skin:L.skin,hair:L.hair,style:L3D_HAIR[L.style]||'buzz',beard:!!L.beard,band:!!L.band}}catch(e){}
 const sk=clamp(o.skill??.6,.1,.98),kp=clamp(o.keeper??.45,.1,.9);const sc=l3dScene(o);const GK=sc.startsWith('gk');
 const tag=GK?'Defesa':({pass:'Passe',long:'Lançamento',cross:'Cruzamento',dribble:'Um contra um',header:'Cabeçada',fk:'Falta',pen:'Pênalti',chip:'Cobertura',combo:'Tabela'})[o.kind]||'Finalização';
 return{scen:sc,us:U,them:Tm,gkUs:{shirt:'#20c4bd',shirt2:'#0b2626',shorts:'#0b2626',socks:'#20c4bd'},hero,min:o.min||0,
  title:`${o.min?o.min+"' · ":''}${o.comp||tag}`,head:o.title&&!/^(finish|pass|keeper)$/.test(o.title)?o.title:tag,desc:null,
  noiseK:clamp(1.45-.9*sk,.5,1.3),gkK:clamp((kp-.45)*4,-1,1),myGkK:.85+.3*sk,shNoise:clamp(1.6-(((them&&them.s)||70)-50)/50,.75,1.4),
  crowd:[U.shirt,U.shirt2,Tm.shirt]}}
// no presídio o lance é no pátio: chão de barro, coletes laranja × listrado, policiais em volta e sem torcida
{const _cfg=l3dCfg;l3dCfg=function(o){const c=_cfg(o);try{if(o.env==='prison'||(typeof inPrison==='function'&&inPrison())||/presídio|prisão|pátio/i.test(o.comp||'')){c.env='prison';delete c.us;delete c.them;delete c.gkUs;c.crowd=null;if(c.hero)c.hero.boot='#e9e6df'}}catch(e){}return c}}
function l3dResult(o,res){const K=o.kind||'finish';const GK=K==='keeper';const isPassK=['pass','long','cross'].includes(K);const train=/Peneira|Treino/i.test(o.comp||'');
 NM.netHit=null;NM.intc=null;NM.dmAssist=false;NM.selfGoal=false;let ok;
 if(GK){ok=o.pen?(res.kind==='save'||res.kind==='claim'):!res.goal;NM.last=res.goal?'Foi no canto.':ok?(o.okTxt||'DEFENDEU!'):'Pra fora!'}
 else{ok=!!res.goal||(train&&isPassK&&res.chain>=1);
  if(res.goal){if(isPassK||o.ast){if(res.heroGoal)NM.selfGoal=true}else if(!res.heroGoal&&res.heroAssist&&K!=='pen')NM.dmAssist=true}
  NM.last=ok?(o.okTxt||'GOL!'):res.kind==='off'?'Impedimento.':res.kind==='tackle'?'Desarmado.':res.kind==='block'?'Bloqueado.':K==='pen'?(res.kind==='save'||res.kind==='claim'?'O goleiro segurou.':'Pra fora!'):isPassK?'Interceptado.':res.kind==='save'||res.kind==='claim'?'O goleiro pegou.':'Pra fora!'}
 const perfect=ok&&!!(res.fk||res.header||res.chain>=2||(GK&&res.dived&&res.kind==='save')||res.caught);NM.grade=ok?(perfect?92:78):40;NM.why='Lance jogado';
 return{ok,perfect,grade:NM.grade}}
async function lance3dPlay(o){
 if(!L3D.frame||!L3D._loaded){try{toast({ic:'⚽',title:'Abrindo o lance',txt:'Carregando o campo em 3D…',ms:1600})}catch(e){}}
 await l3dBoot();L3D._loaded=true;const cfg=l3dCfg(o);
 L3D.frame.classList.add('on');document.body.classList.add('l3d-on');
 const res=await new Promise(r=>{L3D._res=r;L3D.frame.contentWindow.postMessage({type:'ml-play',cfg},'*')});
 return res}
// liga no lugar do momento de decisão (fica por baixo do XP do rpg.js, que vem depois)
{const _nmDecide=nssMoment;nssMoment=async function(o){if(lanceMode()!=='jogar'||L3D.failed)return _nmDecide(o);
  let res;try{res=await lance3dPlay(o)}catch(e){L3D.failed=true;try{toast({ic:'⚠️',title:'Lance 3D indisponível',txt:'Seguindo com os momentos de decisão.',ms:2600})}catch(_){}return _nmDecide(o)}
  if(!res||res.skip)return _nmDecide(o);return l3dResult(o,res)}}
// guarda os dois times do jogo atual pras cores
{const _pm=playMine;playMine=async function(o,io){L3D.ctx={us:o&&o.us,them:o&&o.them};try{return await _pm(o,io)}finally{L3D.ctx=null}}}
// pré-carrega o 3D quando a carreira está aberta e o modo é jogar
{const _rh=renderHub;renderHub=function(...a){const r=_rh.apply(this,a);try{if(lanceMode()==='jogar'&&!L3D.ready&&!L3D._sched){L3D._sched=true;const go=()=>{if(!L3D.ready)l3dBoot().catch(()=>{})};setTimeout(()=>{if(window.requestIdleCallback)requestIdleCallback(go,{timeout:5000});else go()},1500)}}catch(e){}return r}}
{const st=document.createElement('style');st.textContent=`.l3d{position:fixed;inset:0;width:100%;height:100%;border:0;z-index:9999;display:none;background:#0d1f15}.l3d.on{display:block}body.l3d-on{overflow:hidden}`;document.head.appendChild(st)}
// peneira: o técnico explica do jeito certo pra cada modo
if(typeof coachCard==='function'){const _cc=coachCard;coachCard=function(st,...a){if(lanceMode()==='jogar'&&!L3D.failed){try{toast({ic:COACH.ic,title:COACH.n,txt:st.k==='keeper'?`Estação de ${st.n.toLowerCase()}: arraste pro lado do chute pra voar.`:`Estação de ${st.n.toLowerCase()}: puxe da bola pra trás e toque nela pra dar efeito.`,ms:2600})}catch(e){}return Promise.resolve()}return _cc(st,...a)}}
