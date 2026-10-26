// ===================== PARTIDA EM LANCES =====================
// Na carreira, a partida inteira acontece aqui dentro, sem sair do estádio: placar e relógio correndo, os lances
// do seu jogador entram um atrás do outro (sem tela de apresentação, só um letreiro de 1 s), os gols dos outros
// aparecem num lance automático rápido e no fim vem o resumo com a sua nota. Cada acerto soma na sequência 🔥
// e mexe na nota ao vivo. O jogo da carreira manda ordens {type:'ml-sess',op,id} e espera {type:'ml-sess-ok',id}.
// No protótipo, a aba "Partida" roda a mesma coisa com uma partida sorteada aqui mesmo.
// o outro gol (fundo do campo), só de enfeite: deixa o tiro de meta e a saída do goleiro com cara de campo inteiro
const GOAL2=(()=>{const g2=goalG.clone();g2.rotation.y=Math.PI;g2.position.set(0,0,105);const ln=g2.children.find(c=>c.isLineSegments);if(ln)ln.geometry=NET.geo.clone();scene.add(g2);return g2})();
const SRI=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const SS={on:false,score:[0,0],min:0,nota:6,streak:0,best:0,won:0,tot:0,feed:[],skip:false,local:false,ang:0,focus:new T.Vector3(0,0,52)};
const ssInk=hex=>{const h=(hex||'#000').replace('#','');const n=parseInt(h.length===3?h.split('').map(c=>c+c).join(''):h,16)||0;return((n>>16&255)*.3+(n>>8&255)*.59+(n&255)*.11)>150?'#10251a':'#ffffff'};
const ssEsc=t=>String(t==null?'':t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ssSleep=ms=>new Promise(r=>setTimeout(r,SS.skip?0:ms));
// ---------- placar, relógio, nota e sequência ----------
function ssHud(){const TT=SS.total||90;$('ssS').textContent=`${SS.score[0]}–${SS.score[1]}`;$('ssM').textContent=Math.min(TT,SS.min|0)+"'";$('ssC').style.width=Math.min(100,SS.min/TT*100)+'%';$('ssN').textContent=SS.nota.toFixed(1);
 const k=$('ssK');k.hidden=SS.streak<2;if(SS.streak>=2)k.innerHTML=`🔥 <b>${SS.streak}</b> seguidas`}
function ssNota(d){SS.nota=clamp(SS.nota+d,3,10);ssHud();if(Math.abs(d)<.05)return;const f=$('ssNd');f.className='';void f.offsetWidth;f.textContent=(d>0?'+':'')+d.toFixed(1);f.className='on '+(d>0?'up':'dn')}
function ssFeed(html,cls){const f=$('ssF');const el=document.createElement('div');el.className='ssl '+(cls||'');el.innerHTML=html;f.prepend(el);while(f.children.length>3)f.lastElementChild.remove();setTimeout(()=>el.classList.add('old'),4200)}
let ssBanT=0;function ssBanner(big,small,ms,cls){const b=$('ssBan');b.className='';void b.offsetWidth;b.innerHTML=`<b>${big}</b>${small?`<small>${small}</small>`:''}`;b.className='on '+(cls||'');clearTimeout(ssBanT);if(ms)ssBanT=setTimeout(()=>{b.className=''},ms)}
function ssBanHide(){clearTimeout(ssBanT);$('ssBan').className=''}
// ---------- entre um lance e outro: os times em campo e a câmera passeando ----------
function ssAmbient(){S.mode='sess';S.auto=false;S.ts=1;$('top').hidden=true;$('bCam').hidden=true;$('bAng').hidden=true;$('hint').hidden=true;$('after').hidden=true;$('contact').hidden=true;$('edges').hidden=true;hideArrow();
 const bn=$('banner');if(S.state!=='result'||S.now-S.resT>1.2){bn.className='';bn.innerHTML=''}
 const E=KG.cur?KIDENV[KG.cur]:null;SS.focus.set(clamp(S.ball.p.x,E?-3:-20,E?3:20),0,clamp(S.ball.p.z,E?4:8,E?E.len-4:97));const d=new T.Vector3().subVectors(camPos,SS.focus);SS.ang=Math.atan2(d.x,d.z)}
function ssAmbientStep(dt){SS.ang+=dt*.16;const f=SS.focus;const rr=KG.cur?13:23;const p=new T.Vector3(f.x+Math.sin(SS.ang)*rr,KG.cur?6.5:9.5,f.z+Math.cos(SS.ang)*rr);camLim(p);
 const k=1-Math.exp(-dt*1.6);camPos.lerp(p,k);camLook.lerp(new T.Vector3(f.x,.9,f.z),1-Math.exp(-dt*2.2));cam.position.copy(camPos);cam.lookAt(camLook);
 sun.position.set(camLook.x-22,48,camLook.z+26);sun.target.position.copy(camLook);idleAI(dt);if(KG.carRun)kidCarStep(dt);if(S.ball.v.lengthSq()>.01){stepBall(S.ball,dt);netCollide(S.ball,dt);collideStadium(S.ball)}stepGuards(dt)}
// ---------- abrir a partida ----------
function ssStart(info){return new Promise(res=>{S.paused=false;last=performance.now();S.embedDone=false;SS.info=info||{};SS.cfg=SS.info.cfg||{};applyCfg(SS.cfg);
 Object.assign(SS,{on:true,score:[0,0],min:0,nota:6,streak:0,best:0,won:0,tot:0,skip:false,lanceMin:-1,goalsShown:0,total:SS.info.total||90,carAt:SS.info.env==='street'?SRI(4,(SS.info.total||20)-3):999});$('ssF').innerHTML='';
 const us=SS.info.usC||[OUR.shirt,OUR.shirt2],th=SS.info.themC||[THEM.shirt,THEM.shirt2];
 for(const [id,c,ab] of [['ssA',us,SS.info.usAbbr||'NÓS'],['ssB',th,SS.info.themAbbr||'ELES']]){const e=$(id);e.textContent=ab;e.style.background=c[0];e.style.color=ssInk(c[0])}
 S.ch=null;if(SS.cfg.env)setEnv(SS.cfg.env);startScen(SS.info.tableau||'saida');S.introOpen=true;ssAmbient();document.body.classList.add('ss-on');$('ss').hidden=false;$('menu').hidden=true;ssHud();
 $('ssInC').textContent=[SS.info.comp,SS.info.label].filter(Boolean).join(' · ')||'Partida';
 $('ssInT').innerHTML=`<span style="background:${us[0]};color:${ssInk(us[0])}">${ssEsc(SS.info.usAbbr||'NÓS')}</span> × <span style="background:${th[0]};color:${ssInk(th[0])}">${ssEsc(SS.info.themAbbr||'ELES')}</span>`;
 $('ssInD').textContent=`${SS.info.usName||''} contra ${SS.info.themName||''}`;$('ssIn').hidden=false;
 $('ssGo').onclick=()=>{sfxUnlock();$('ssIn').hidden=true;S.introOpen=false;sfx('whistle');res({go:true})};
 $('ssSim').onclick=()=>{$('ssIn').hidden=true;ssClose();res({skip:true})}})}
function ssClose(){SS.on=false;$('ss').hidden=true;document.body.classList.remove('ss-on');ssBanHide();S.auto=false;S.ts=1}
// ---------- relógio correndo até o próximo acontecimento ----------
const SS_AMB=[w=>`${w} troca passes no meio`,w=>`${w} tenta pela direita`,w=>`${w} gira a bola na defesa`,w=>`Escanteio pro ${w}`,w=>`Falta no meio-campo`,w=>`${w} pressiona a saída de bola`,w=>`Lançamento do ${w}, a zaga afasta`,w=>`Cruzamento do ${w}, ninguém alcança`];
async function ssClock(to){if(!SS.on)return;if(S.mode!=='sess')ssAmbient();const TT=SS.total||90,HT=SS.info.half??(TT===90?45:0);to=Math.min(TT,to);
 while(SS.min<to){SS.min++;ssHud();if(SS.skip)continue;
  if(SS.min===SS.carAt&&!SS.skip){SS.carAt=999;ssBanner('🚗 OLHA O CARRO!','para tudo',1600);await kidCarPass()}
  if(HT&&SS.min===HT){ssBanner('INTERVALO',`${SS.info.usAbbr||''} ${SS.score[0]} × ${SS.score[1]} ${SS.info.themAbbr||''}`,1100);sfx('whistle');await ssSleep(1150)}
  else if(SS.min%9===0&&SS.min<to-2&&Math.random()<.7){ssFeed(`<b>${SS.min}'</b>${ssEsc(pick(SS_AMB)(Math.random()<.5?SS.info.usName||'Seu time':SS.info.themName||'O rival'))}`,'amb')}
  await ssSleep(SS.min>=TT-10?60:(TT<60?110:38))}}
// ---------- acontecimentos do jogo ----------
async function ssEvent(e,gu,gt){if(!SS.on)return;const us=!!e.us,name=ssEsc(e.w||'');const m=e.m|0;
 if(e.t==='g'){SS.score=[gu,gt];ssHud();
  const fromLance=e.mine||e.ast||Math.abs(m-SS.lanceMin)<=0;
  ssFeed(`<b>${m}'</b>⚽ GOL${us?'':' deles'}! ${name}${e.ast?' <i>(sua assistência)</i>':''}`,us?(e.mine?'me gl':'gl'):'th gl');
  if(e.mine)ssNota(.6);else if(e.ast)ssNota(.4);else if(!us)ssNota(SS.info.def?-.3:-.1);
  if(!fromLance&&!SS.skip){await ssAutoGoal(us,e.w,m);return}
  if(!SS.skip){ssBanner(us?(e.mine?'GOOOL! É SEU!':'GOL!'):'GOL DELES',`${name} ${m}'`,1300,us?'good':'bad');await ssSleep(1200)}return}
 const L={c:e.missed?`❌ Você perdeu a chance`:`${us?'⚡':'⚠️'} Chance ${us?'do '+ssEsc(SS.info.usName||'seu time'):'deles'}: ${name}`,y:'🟨 Amarelo pra você',r:'🟥 Você foi expulso!',inj:'🚑 Você sentiu e pediu pra sair',in:'🔁 Você entra em campo',pmiss:`❌ Pênalti perdido por ${name}`,dsr:`🛡️ Desarme em cima de ${name}`,ppok:'🎯 Passe na medida, você armou a jogada',ppx:'❌ Seu passe foi cortado',gks:`🧤 Defesa no chute de ${name}`,psave:`🧤 Pênalti defendido`}[e.t];
 if(!L)return;ssFeed(`<b>${m}'</b>${L}`,e.mine||['y','r','inj','in','dsr','gks','ppok','ppx'].includes(e.t)?'me':'');
 if(e.t==='y')ssNota(-.2);else if(e.t==='r')ssNota(-1.2);else if(e.t==='in'){ssBanner('VOCÊ ENTRA',`${m}'`,900);await ssSleep(800)}
 if(!SS.skip)await ssSleep(e.t==='c'?420:300)}
// gol de outro: um lance automático rápido (o time chuta no canto, o goleiro não alcança)
const SS_AUTO_US=['area','mano','rebote','longe','contra3'],SS_AUTO_TH=['gkShot','gkShot','gkMano','gkCab'];
const SS_AUTO={street:[['rua1','rua4'],null],futsal:[['fs1','fs2'],['fsGk']]};
function ssAutoGoal(us,who,m){return new Promise(res=>{const kl=KG.cur&&SS_AUTO[KG.cur];if(kl&&!kl[us?0:1]){ssBanner(us?'GOL!':'GOL DELES',`${ssEsc(who||'')} ${m}'`,1400,us?'good':'bad');setTimeout(res,1300);return}const keep=S.heroCfg;if(!(SS.info.heroGK&&!us))S.heroCfg=null;S.ch=null;
 startScen(pick(kl?kl[us?0:1]:us?SS_AUTO_US:SS_AUTO_TH));S.heroCfg=keep;S.auto=true;S.autoNoSave=us;S.ts=1.25;S.introOpen=false;$('top').hidden=true;$('hint').hidden=true;$('bCam').hidden=true;$('bAng').hidden=true;
 ssBanner(us?'⚡ ATAQUE':'⚠️ PERIGO',`${m}'`,800,us?'':'bad');
 S.noNoise=true;if(us){setTimeout(()=>{if(!S.auto||S.state!=='aim')return;S.carrier=S.carrier||S.mates[0];const sh=aiShot();S.aim={dir:sh.dir,power:sh.pw,label:'CHUTE'};hideArrow();startKick(sh.u,sh.v)},650)}else S.gkT=.7;
 let t=0;const done=()=>{S.autoNoSave=false;S.noNoise=false;setTimeout(()=>{const bn=$('banner');bn.className='show '+(us?'good':'bad');bn.innerHTML=`<b>${us?'GOL!':'GOL DELES'}</b><small>${ssEsc(who||'')} ${m}'</small>`},60);
   setTimeout(()=>{S.auto=false;S.ts=1;res()},1700)};
 const iv=setInterval(()=>{t+=100;if(S.state==='result'||t>5200){clearInterval(iv);done()}},100)})}
// ---------- um lance do seu jogador dentro da partida ----------
function ssLance(c){S.paused=false;last=performance.now();S.ch=null;S.score={g:0,n:0};S.embedDone=false;S.auto=false;S.ts=1;applyCfg({...SS.cfg,...c});startScen(c.scen);S.passGoal=c.goal==='pass'?1:0;
 SS.lanceMin=c.min|0;$('top').hidden=true;$('hint').hidden=true;$('score').hidden=true;S.introOpen=true;
 const how=S.passGoal?'Ache o companheiro livre':S.role==='def'?'Toque na hora do bote':S.role==='gk'?'Arraste pro lado do chute':'Puxe da bola pra trás';
 ssBanner(`${c.min?c.min+"' · ":''}${ssEsc((c.head||SC[c.scen].n).replace(/!$/,''))}`,how,0,'lance');clearTimeout(SS.goT);SS.goT=setTimeout(ssGo,1250)}
function ssGo(){clearTimeout(SS.goT);if(!S.introOpen||!SS.on)return;S.introOpen=false;ssBanHide();setHint()}
canvas.addEventListener('pointerdown',()=>{if(SS.on&&S.introOpen&&S.mode==='play'&&!S.auto&&$('ssIn').hidden)ssGo()},true);
function ssGood(res){if(res.role==='def')return!res.goal&&res.kind!=='falta';if(res.role==='gk')return!res.goal;return!!res.goal||res.kind==='passok'}
function ssAfterLance(res){if(res.skip)return;const g=ssGood(res);SS.tot++;
 if(g){SS.won++;SS.streak++;SS.best=Math.max(SS.best,SS.streak);ssNota(.3+Math.min(.3,(SS.streak-1)*.1));if(SS.streak===3)setTimeout(()=>ssBanner('🔥 EM CHAMAS!','3 lances seguidos',1100,'good'),900);else if(SS.streak===5)setTimeout(()=>ssBanner('🔥🔥 IMPARÁVEL!','5 seguidos',1100,'good'),900)}
 else{SS.streak=0;ssNota(-.15)}ssHud()}
{const _ep=embedPlay;embedPlay=function(c){if(c&&c.sess&&SS.on)return ssLance(c);return _ep(c)}}
{const _es=embedSend;embedSend=function(res){if(SS.on){S.embedDone=true;ssAfterLance(res||{});if(SS.local){const f=SS.localCb;SS.localCb=null;if(f)f(res)}else{try{parent.postMessage({type:'ml-result',res},'*')}catch(e){}}return}return _es(res)}}
// ---------- fim de jogo ----------
function ssEnd(f,me,scorers){return new Promise(res=>{if(!SS.on)return res();if(S.mode!=='sess')ssAmbient();SS.min=SS.total||90;if(f&&f.gu!=null)SS.score=[f.gu,f.gt];ssHud();sfx('whistle');setTimeout(()=>sfx('whistle'),450);
 const us=SS.info.usC||[OUR.shirt],th=SS.info.themC||[THEM.shirt];const nota=me&&me.nota!=null?me.nota:SS.nota;
 $('ssEndS').innerHTML=`<span style="background:${us[0]};color:${ssInk(us[0])}">${ssEsc(SS.info.usAbbr||'NÓS')}</span><b>${SS.score[0]} × ${SS.score[1]}</b><span style="background:${th[0]};color:${ssInk(th[0])}">${ssEsc(SS.info.themAbbr||'ELES')}</span>`;
 $('ssEndM').textContent=(f&&f.msg)||'Fim de jogo.';$('ssEndM').className=f&&f.win===true?'good':f&&f.win===false?'bad':'';
 $('ssEndG').innerHTML=(scorers||[]).length?scorers.map(s=>`<li class="${s.us?'us':'th'}"><b>${s.m}'</b> ${ssEsc(s.w)}</li>`).join(''):'<li>Sem gols.</li>';
 $('ssEndN').innerHTML=`<div><b>${(+nota).toFixed(1)}</b><small>sua nota</small></div><div><b>${me&&me.g||0}</b><small>gols</small></div><div><b>${me&&me.a||0}</b><small>assist.</small></div><div><b>${SS.won}/${SS.tot}</b><small>lances</small></div><div><b>${SS.best}</b><small>🔥 seguidos</small></div>`;
 $('ssEnd').hidden=false;$('ssEndOk').onclick=()=>{$('ssEnd').hidden=true;ssClose();S.paused=!SS.local;res()}})}
// ---------- botão ⏭: simula o resto sem lances ----------
$('ssSkip').onclick=()=>{if(!SS.on||SS.skip)return;SS.skip=true;ssBanner('SIMULANDO…','',900);if(SS.local&&S.mode==='play'&&!S.embedDone){S.embedDone=true;const f=SS.localCb;SS.localCb=null;if(f)f({skip:true})}else if(!SS.local&&S.mode==='play'&&!S.embedDone){embedSend({skip:true})}try{parent.postMessage({type:'ml-sess-skip'},'*')}catch(e){}};
// ---------- ordens vindas da carreira ----------
if(EMBED)addEventListener('message',async e=>{const d=e.data||{};if(d.type!=='ml-sess')return;resize();let out={};
 try{if(d.op==='start')out=await ssStart(d.info);else if(d.op==='clock')await ssClock(d.to);else if(d.op==='event')await ssEvent(d.e||{},d.gu|0,d.gt|0);else if(d.op==='flash'){if(!SS.skip&&SS.on)ssBanner(ssEsc(d.txt||''),'',900)}else if(d.op==='end')await ssEnd(d.f||{},d.me||{},d.scorers||[])}catch(err){out={err:String(err)}}
 try{parent.postMessage({type:'ml-sess-ok',id:d.id,op:d.op,...out,skipAll:SS.skip},'*')}catch(_){}});
// ---------- protótipo: uma partida sorteada aqui mesmo ----------
const SS_POS={ATA:['area','mano','cabeca','voleio','rebote','pivo','contra3'],MEI:['tabela','contra3','area','longe','falta','lanca'],ZAG:['desarme','corte','desarme','saida','cabeca','escanteio'],GOL:['gkShot','gkPen','gkMano','gkCab','gkFk','tiroMeta']};
const SS_KID={RUA:{env:'street',total:20,half:0,tab:'rua1',L:['rua1','rua2','rua3','rua4','rua1','rua4'],us:'Rua 9',th:'Rua 7',ua:'R9',ta:'R7',comp:'Racha na rua · 10 anos',label:'Vira 2, acaba 4'},FUT:{env:'futsal',total:40,half:20,tab:'fs1',L:['fs1','fs2','fs3','fs4','fs2'],us:'Vila Esperança',th:'Jardim América',ua:'VIL',ta:'JAR',comp:'Futsal do bairro · 12 anos',label:'Final do campeonato'}};
async function ssDemo(pos){const keepE=S.embed;S.embed=true;SS.local=true;const K=SS_KID[pos];
 const r=await ssStart(K?{usName:K.us,themName:K.th,usAbbr:K.ua,themAbbr:K.ta,comp:K.comp,label:K.label,total:K.total,half:K.half,tableau:K.tab,env:K.env,cfg:{env:K.env},usC:K.env==='futsal'?['#ffd23c','#10356b']:['#f2c94c','#222'],themC:K.env==='futsal'?['#d62828','#fff']:['#c99368','#222']}:{usName:'Fome FC',themName:'Rivais FC',usAbbr:'FOM',themAbbr:'RIV',comp:'Amistoso',label:'Partida em lances',heroGK:pos==='GOL',def:pos==='ZAG'||pos==='GOL'});
 const back=()=>{S.embed=keepE;SS.local=false;if(KG.cur)setEnv('stadium');showMenu()};
 if(r.skip)return back();
 const TT=K?K.total:90;const ev=[];const nL=K?K.L.length-SRI(0,1):SRI(5,7);for(let i=0;i<nL;i++)ev.push({m:SRI(2,TT-2),k:'lance'});for(let i=0,n=SRI(1,3);i<n;i++)ev.push({m:SRI(2,TT-1),k:'goal',us:Math.random()<.5});for(let i=0;i<3;i++)ev.push({m:SRI(3,TT-3),k:'c',us:Math.random()<.5});ev.sort((a,b)=>a.m-b.m);let li=0;
 let gu=0,gt=0,g=0;const sc=[];const names=['Lucas','Rafael','Diego','Bruno','Caio','Vitor'];
 for(const e of ev){if(SS.skip)break;await ssClock(e.m);if(SS.skip)break;
  if(e.k==='lance'){const scen=K?K.L[li++%K.L.length]:pick(SS_POS[pos]||SS_POS.ATA);ssBanner('⚡ A bola é sua…','',700);await ssSleep(500);const res=await new Promise(ok=>{SS.localCb=ok;ssLance({scen,min:e.m,head:SC[scen].n})});
   if(res.skip)break;const role=res.role;if(role==='atk'&&res.goal){gu++;g++;sc.push({m:e.m,w:'Você',us:true});await ssEvent({t:'g',us:true,mine:true,w:'Você',m:e.m},gu,gt)}else if(role==='gk'&&res.goal){gt++;sc.push({m:e.m,w:pick(names),us:false});await ssEvent({t:'g',us:false,w:'Atacante deles',m:e.m},gu,gt)}else if(role==='def'&&res.goal){gt++;sc.push({m:e.m,w:pick(names),us:false});await ssEvent({t:'g',us:false,w:'Atacante deles',m:e.m},gu,gt)}}
  else if(e.k==='goal'){if(e.us)gu++;else gt++;const w=pick(names);sc.push({m:e.m,w,us:e.us});await ssEvent({t:'g',us:e.us,w,m:e.m},gu,gt)}
  else await ssEvent({t:'c',us:e.us,w:pick(names),m:e.m},gu,gt)}
 await ssClock(TT);await ssEnd({msg:gu>gt?'Vitória!':gu<gt?'Derrota.':'Empate.',win:gu>gt?true:gu<gt?false:null,gu,gt},{nota:SS.nota,g,a:0},sc);
 back()}
