// ================== TREINO JOGÁVEL, NEGOCIAÇÃO, MERCADO E TELAS SEM ROLAGEM ==================
// Treino: cada habilidade tem um minigame com 3 vidas; 3 sessões por rodada. Quanto mais acertos, mais sobe.
// Contrato: negociação é um minigame (pare o ponteiro na zona de acordo); paciência do clube = 3 corações.
// Mercado: propostas chegam durante a temporada; com agente você pede um clube, uma liga ou clubes de X estrelas
// (o nível do agente decide o alcance); empréstimo. Tudo que é lista vira página (sem barra de rolagem).

// ---------- minigames de treino ----------
const NS_TG={vel:{n:'Arrancada',ic:'⚡',how:'Toque no cone que acender antes que ele apague. Cone vermelho: NÃO toque.'},
 for:{n:'Chute forte',ic:'💪',how:'Toque em CHUTAR quando o ponteiro estiver na faixa verde. A cada acerto a faixa diminui.'},
 tec:{n:'Embaixadinhas',ic:'🎯',how:'Toque na tela quando a bola cair dentro do círculo do pé. Não deixe cair!'},
 vis:{n:'Passe certo',ic:'👁️',how:'Toque no companheiro (azul) que estiver LIVRE, longe dos marcadores vermelhos. Seja rápido.'},
 bp:{n:'Cobrança de falta',ic:'🧱',how:'Toque em TRAVAR pra fixar a mira na horizontal e de novo na vertical. Acerte o alvo.'}};
function tgVel(A,G){A.innerHTML=`<div class="tgv">${[...Array(9)].map((_,i)=>`<button class="cone" data-i="${i}"><span>🔺</span></button>`).join('')}</div><div class="tgbar"><i id="tgT"></i></div>`;
 const cs=[...A.querySelectorAll('.cone')];let cur=-1,red=false,t0=0,win=1150,alive=true,raf;
 const next=()=>{cs.forEach(c=>c.className='cone');let i;do{i=RI(0,8)}while(i===cur);cur=i;red=G.score>=4&&ch(.22);cs[i].className='cone '+(red?'red':'on');t0=performance.now();win=Math.max(400,1150*Math.pow(.94,G.score))};
 cs.forEach(c=>c.onpointerdown=e=>{e.preventDefault();if(!alive||!G.on)return;const i=+c.dataset.i;if(i===cur&&!red){c.className='cone ok';G.hit();setTimeout(next,90)}else if(i===cur&&red){G.miss('Era vermelho!');next()}else G.miss('Cone errado')});
 const tick=t=>{if(!alive)return;const el=t-t0;const bar=document.getElementById('tgT');if(bar)bar.style.width=Math.max(0,100-el/win*100)+'%';if(el>win&&G.on){if(red)next();else{G.miss('Demorou!');next()}}raf=requestAnimationFrame(tick)};
 next();raf=requestAnimationFrame(tick);return()=>{alive=false;cancelAnimationFrame(raf)}}
function tgFor(A,G){A.innerHTML=`<div class="tgf"><div class="meter"><i class="band" id="fB"></i><i class="needle" id="fN"></i></div><div class="tgf-r"><div class="ballz" id="fBall">⚽</div><button class="btn big" id="fK">CHUTAR!</button></div></div>`;
 let ph=0,sp=1.5,band=[.7,.88],alive=true,raf,last=performance.now();
 const setBand=()=>{const w=Math.max(.07,.2-G.score*.012);const c=R(.35+w/2,.95-w/2);band=[c-w/2,c+w/2];const b=document.getElementById('fB');if(b){b.style.bottom=band[0]*100+'%';b.style.height=(band[1]-band[0])*100+'%'}};
 const val=()=>(Math.sin(ph)+1)/2;
 const tick=t=>{if(!alive)return;const dt=Math.min(.05,(t-last)/1000);last=t;ph+=dt*sp*Math.PI;const n=document.getElementById('fN');if(n)n.style.bottom=`calc(${val()*100}% - 3px)`;raf=requestAnimationFrame(tick)};
 document.getElementById('fK').onpointerdown=e=>{e.preventDefault();if(!alive||!G.on)return;const v=val();const b=document.getElementById('fBall');
  if(v>=band[0]-.01&&v<=band[1]+.01){G.hit();if(b){b.classList.remove('fly');void b.offsetWidth;b.classList.add('fly')}sp=Math.min(4.4,sp*1.08);setBand()}else G.miss(v>band[1]?'Isolou!':'Fraco demais')};
 setBand();raf=requestAnimationFrame(tick);return()=>{alive=false;cancelAnimationFrame(raf)}}
function tgTec(A,G){A.innerHTML=`<div class="tgt" id="tT"><div class="zone" id="tZ"></div><div class="ball" id="tB">⚽</div><div class="foot">🦶</div><small>toque em qualquer lugar</small></div>`;
 const box=document.getElementById('tT');let y=8,vy=0,x=50,vx=0,g=80,alive=true,raf,last=performance.now();const Z=[72,92];
 const reset=()=>{y=6;vy=0;x=R(38,62);vx=0};
 const tick=t=>{if(!alive)return;const dt=Math.min(.04,(t-last)/1000);last=t;if(G.on){vy+=g*dt;y+=vy*dt;x+=vx*dt;if(x<12){x=12;vx=-vx}if(x>88){x=88;vx=-vx}if(y>104){G.miss('Deixou cair!');reset()}}
  const b=document.getElementById('tB');if(b){b.style.top=y+'%';b.style.left=x+'%'}const z=document.getElementById('tZ');if(z)z.classList.toggle('hot',vy>0&&y>=Z[0]-4&&y<=Z[1]+4);raf=requestAnimationFrame(tick)};
 box.onpointerdown=e=>{e.preventDefault();if(!alive||!G.on)return;if(vy>0&&y>=Z[0]-4&&y<=Z[1]+4){G.hit();vy=-(96+Math.min(44,G.score*2.2));vx=R(-24,24)*(1+G.score*.04);g=Math.min(250,80+G.score*8)}else if(vy>0&&y<Z[0]-4&&y>30){G.miss('Cedo demais');reset()}};
 reset();raf=requestAnimationFrame(tick);return()=>{alive=false;cancelAnimationFrame(raf)}}
function tgVis(A,G){A.innerHTML=`<div class="tgp" id="pF"></div><div class="tgbar"><i id="tgT"></i></div>`;const F=document.getElementById('pF');
 const mates=[...Array(5)].map((_,i)=>({x:12+i*19,y:R(22,62)}));const defs=[...Array(4)].map(()=>({ph:R(0,6),sx:R(.6,1.2),sy:R(.6,1.2),ax:R(14,30),ay:R(10,22),cx:R(20,80),cy:R(28,62),x:50,y:50}));
 F.innerHTML=mates.map((m,i)=>`<button class="mate" data-i="${i}" style="left:${m.x}%;top:${m.y}%"><span>${[7,8,9,10,11][i]}</span></button>`).join('')+defs.map((d,i)=>`<i class="def" id="pd${i}"></i>`).join('')+'<i class="me">⚽</i>';
 let t0=performance.now(),win=2700,alive=true,raf,spd=1;const free=i=>defs.every(d=>Math.hypot(d.x-mates[i].x,(d.y-mates[i].y)*1.15)>13);
 const tick=t=>{if(!alive)return;const s=t/1000*spd;defs.forEach((d,i)=>{d.x=clamp(d.cx+Math.sin(s*d.sx+d.ph)*d.ax,5,95);d.y=clamp(d.cy+Math.cos(s*d.sy+d.ph)*d.ay,10,78);const e=document.getElementById('pd'+i);if(e){e.style.left=d.x+'%';e.style.top=d.y+'%'}});
  const el=t-t0;const bar=document.getElementById('tgT');if(bar)bar.style.width=Math.max(0,100-el/win*100)+'%';if(el>win&&G.on){G.miss('Demorou!');t0=t}raf=requestAnimationFrame(tick)};
 F.querySelectorAll('.mate').forEach(b=>b.onpointerdown=e=>{e.preventDefault();if(!alive||!G.on)return;const i=+b.dataset.i;if(free(i)){G.hit();b.classList.add('ok');setTimeout(()=>b.classList.remove('ok'),200);spd=Math.min(2.4,spd*1.07);win=Math.max(1150,2700*Math.pow(.95,G.score));t0=performance.now();mates[i].y=R(22,64);b.style.top=mates[i].y+'%'}else G.miss('Tinha marcador!')});
 raf=requestAnimationFrame(tick);return()=>{alive=false;cancelAnimationFrame(raf)}}
function tgBp(A,G){A.innerHTML=`<div class="tgk"><div class="goal" id="kG"><i class="tg" id="kT"></i><i class="cx" id="kX"></i><i class="cy" id="kY"></i><i class="hitm" id="kH"></i></div><div class="wall">🧍🧍🧍🧍</div><button class="btn big" id="kB">TRAVAR</button></div>`;
 let phase=0,px=50,py=50,ph=0,sp=1,tx=50,ty=50,tr=14,alive=true,raf,last=performance.now();
 const newT=()=>{tr=Math.max(6,15-G.score*.7);tx=R(10+tr/2,90-tr/2);ty=R(22,78);const G0=document.getElementById('kG');const W=G0.clientWidth;const t=document.getElementById('kT');t.style.left=tx+'%';t.style.top=ty+'%';t.style.width=t.style.height=(tr/100*W*2)+'px';phase=0;ph=R(0,6);document.getElementById('kY').style.display='none';document.getElementById('kH').style.display='none';document.getElementById('kB').textContent='TRAVAR ↔'};
 const tick=t=>{if(!alive)return;const dt=Math.min(.05,(t-last)/1000);last=t;ph+=dt*sp*2.4;const v=(Math.sin(ph)+1)/2*100;if(phase===0)px=v;else if(phase===1)py=v;
  const X=document.getElementById('kX'),Y=document.getElementById('kY');if(X)X.style.left=px+'%';if(Y)Y.style.top=py+'%';raf=requestAnimationFrame(tick)};
 document.getElementById('kB').onpointerdown=e=>{e.preventDefault();if(!alive||!G.on)return;
  if(phase===0){phase=1;ph=R(0,6);const Y=document.getElementById('kY');Y.style.display='block';document.getElementById('kB').textContent='TRAVAR ↕';return}
  if(phase!==1)return;phase=2;const G0=document.getElementById('kG');const W=G0.clientWidth,H=G0.clientHeight;const d=Math.hypot((px-tx)/100*W,(py-ty)/100*H);const hm=document.getElementById('kH');hm.style.display='block';hm.style.left=px+'%';hm.style.top=py+'%';
  if(d<=tr/100*W){G.hit();hm.textContent='⚽';sp=Math.min(2.6,sp*1.07)}else{G.miss(d<tr/100*W*1.8?'Na trave!':'Pra fora!');hm.textContent='✖'}setTimeout(()=>{if(alive&&G.on)newT()},650)};
 setTimeout(newT,30);raf=requestAnimationFrame(tick);return()=>{alive=false;cancelAnimationFrame(raf)}}
const NS_TGF={vel:tgVel,for:tgFor,tec:tgTec,vis:tgVis,bp:tgBp};
function nsTrainGame(k){return new Promise(res=>{const T=NS_TG[k];const best=(S.n.tbest||{})[k]||0;
 $ov.hidden=false;$ov.innerHTML=`<div class="nstg"><div class="nstg-top"><b>${T.ic} ${esc(T.n)}</b><span class="lv" id="tgL">❤️❤️❤️</span><span class="sc">Acertos <b id="tgS">0</b></span></div><div class="nstg-a" id="tgA"></div><div class="nstg-m" id="tgM"></div></div>`;
 const A=document.getElementById('tgA');A.innerHTML=`<div class="nstg-in"><span>${T.ic}</span><b>${esc(T.n)}</b><p>${esc(T.how)}</p><p class="muted">3 vidas · recorde ${best} acerto${best===1?'':'s'}</p><button class="btn big" id="tgGo">Começar</button></div>`;
 const G={score:0,lives:3,on:false,stop:null,
  hit(){G.score++;const s=document.getElementById('tgS');if(s)s.textContent=G.score;const m=document.getElementById('tgM');if(m){m.textContent=pick(['Boa!','Isso!','Show!','Perfeito!','Mais um!']);m.className='nstg-m good'}try{SFX.tick&&SFX.tick()}catch(e){}},
  miss(t){if(!G.on)return;G.lives--;const l=document.getElementById('tgL');if(l)l.textContent='❤️'.repeat(G.lives)+'🖤'.repeat(3-G.lives);const m=document.getElementById('tgM');if(m){m.textContent=t||'Errou';m.className='nstg-m bad'}const a=document.querySelector('.nstg');if(a&&!reduced){a.classList.remove('shake');void a.offsetWidth;a.classList.add('shake')}if(G.lives<=0)G.end()},
  end(){G.on=false;if(G.stop)G.stop();setTimeout(()=>res(G.score),650)}};
 document.getElementById('tgGo').onclick=()=>{G.on=true;A.innerHTML='';G.stop=NS_TGF[k](A,G)}})}
async function nsTrainSession(k){const n=S.n;const cost=nsTrainCost();
 if((n.trainW||0)>=NS_TRAIN_MAX){await nsPop({ic:'🗓️',title:'Treinos da rodada feitos',txt:'Você já fez as 3 sessões desta rodada. Jogue a próxima partida pra liberar mais.'});return}
 if(n.en<cost){const q=await nsPop({ic:'❤️',title:'Sem energia pra treinar',txt:`O treino gasta ${cost}% e você está com ${Math.round(n.en)}%.`,opts:[['dr','🥤 Tomar energético']],ok:'Voltar'});if(q==='dr')await nsDrinkPick();return}
 n.en=clamp(n.en-cost,0,100);const h=nsHost();const was=!h.hidden;h.hidden=true;let sc=0;try{sc=await nsTrainGame(k)}catch(e){console.error(e)}$ov.hidden=true;$ov.innerHTML='';if(was)h.hidden=false;
 n.tbest=n.tbest||{};const rec=sc>(n.tbest[k]||0);if(rec)n.tbest[k]=sc;
 const mul=clamp(.45+sc*.11,.45,2.8);const g=nsGain(k,mul);const s=n.sk[k];const l0=s.l;nsAddP(k,g);n.last[k]=n.week;n.trainW=(n.trainW||0)+1;n.trainT=(n.trainT||0)+1;if(n.rel.coach<100&&sc>=6)n.rel.coach=clamp(n.rel.coach+1,0,100);nsSync();try{nsAchCheck()}catch(e){}
 const nm=NSK.find(x=>x[0]===k)[1];
 await nsPop({ic:sc>=10?'🔥':sc>=5?'👍':'😅',title:sc>=10?'Treino de craque!':sc>=5?'Bom treino':'Treino fraco',html:`<div class="nstg-res"><b>${sc}</b><span>acerto${sc===1?'':'s'}${rec?' · NOVO RECORDE':''}</span></div>`,txt:`${nm}: +${g}% de progresso${s.l>l0?` e subiu pro nível ${s.l}!`:'.'} Sessões: ${n.trainW} de ${NS_TRAIN_MAX}.`});nsRefresh()}
// Habilidades: › abre o minigame da habilidade
{const _hp=nsHabPage;nsHabPage=function(){const p=_hp();const html0=p.html;
 p.html=()=>{const n=S.n;const left=NS_TRAIN_MAX-(n.trainW||0);let h=html0();
  h=h.replace(/<p class="muted nshelp">[\s\S]*?<\/p>/,`<div class="nsses"><span>Treinos da rodada</span>${[0,1,2].map(i=>`<i class="${i<(n.trainW||0)?'used':''}"></i>`).join('')}<b>${left>0?`${left} restante${left>1?'s':''} · −${nsTrainCost()}% energia cada`:'feitos! Jogue a partida'}</b></div>`);
  if(left<=0)h=h.replace(/<button class="nshr-go"/g,'<button class="nshr-go done"');
  h=h.replace(/<div class="nsauto">[\s\S]*$/,`<label class="nsauto2"><span>🤖 Treino automático</span><select class="input" id="hAuto">${[['off','Desligado'],['eq','Equilibrado'],...NSK.map(([k,nm])=>[k,nm])].map(([k,t])=>`<option value="${k}" ${(n.auto||'off')===k?'selected':''}>${t}</option>`).join('')}</select></label>`);return h};
 const b0=p.bind;p.bind=B=>{b0(B);B.querySelectorAll('[data-tr]').forEach(b=>b.onclick=()=>nsTrainSession(b.dataset.tr));const au=B.querySelector('#hAuto');if(au)au.onchange=()=>{S.n.auto=au.value;toast({ic:'🤖',title:au.value==='off'?'Treino automático desligado':'Treino automático ligado',txt:au.value==='off'?'':'Usa as sessões que sobrarem no fim da rodada.',ms:1800})}};
 p.nav=[{ic:'🥤',t:'Bebida',fn:()=>nsDrinkPick()},{ic:'⏱️',t:'Treinador',fn:()=>nsPush(nsStaffPage())},{ic:'📊',t:'Ranking',fn:nsRanking}];return p}}

// ---------- negociação: minigame ----------
nsNegotiate=function(o,opt={}){const n=S.n;if(!n||!S.wage)return;const c=club();const ct=nsCt();const terms={wage:S.wage,gb:ct.gb,ab:ct.ab};let hearts=3;const tries={wage:0,gb:0,ab:0};let msg='',mcls='';
 const agp=nsAgentPct();const zone=()=>clamp(.15+agp*.6+(n.star.l-3)*.01+(S.ovr-c.s)/140,.08,.36);
 const host=document.createElement('div');host.className='nspop-host neg';document.body.appendChild(host);
 const draw=()=>{host.innerHTML=`<div class="nspop nsneg2"><div class="nspop-h"><span>📝</span><b>${opt.title||'Contrato'} · ${esc(c.n)}</b></div>
  <div class="nsneg-pat">Paciência do clube <span>${'❤️'.repeat(hearts)}${'🖤'.repeat(3-hearts)}</span></div>
  <div class="nsneg">${[['wage','Salário/semana'],['gb','Bônus por gol'],['ab','Bônus por assist.']].map(([k,t])=>`<div class="nsneg-r"><span>${t}</span><b>${nsK(terms[k])}</b><button class="btn small" data-ask="${k}" ${hearts<=0||tries[k]>=3?'disabled':''}>${tries[k]>=3?'Fechado':'Pedir +'}</button></div>`).join('')}</div>
  <div class="nsneg-msg ${mcls}">${esc(msg||'Toque em "Pedir +" e pare o ponteiro na faixa verde.')}</div>
  <div class="nspop-btns"><button class="btn" id="negOk">✍️ Assinar</button></div></div>`;
  host.querySelectorAll('[data-ask]').forEach(b=>b.onclick=()=>meter(b.dataset.ask));host.querySelector('#negOk').onclick=sign};
 const meter=k=>{tries[k]++;const w=zone()*(1-tries[k]*.12);const c0=R(.15+w/2,.85-w/2);const z=[c0-w/2,c0+w/2],y=[z[0]-w*.45,z[1]+w*.45];let ph=R(0,6),sp=1.1+tries[k]*.35+(3-hearts)*.15,on=true,raf,last=performance.now(),v=0;
  host.querySelector('.nspop').innerHTML=`<div class="nspop-h"><span>🤝</span><b>Pare na faixa verde</b></div><div class="nsmeter"><i class="y" style="left:${y[0]*100}%;width:${(y[1]-y[0])*100}%"></i><i class="g" style="left:${z[0]*100}%;width:${(z[1]-z[0])*100}%"></i><i class="p" id="mP"></i></div><p class="muted">Verde = acordo bom · amarelo = pouquinho · fora = o clube perde a paciência</p><button class="btn big wide" id="mStop">FECHAR!</button>`;
  const tick=t=>{if(!on)return;const dt=Math.min(.05,(t-last)/1000);last=t;ph+=dt*sp*2.6;v=(Math.sin(ph)+1)/2;const p=document.getElementById('mP');if(p)p.style.left=`calc(${v*100}% - 3px)`;raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick);
  host.querySelector('#mStop').onpointerdown=e=>{e.preventDefault();if(!on)return;on=false;cancelAnimationFrame(raf);
   if(v>=z[0]&&v<=z[1]){const inc=k==='wage'?R(1.07,1.12):R(1.15,1.28);terms[k]=Math.round(terms[k]*inc+(k==='wage'?0:1));msg=`Fechado: ${nsK(terms[k])}!`;mcls='good'}
   else if(v>=y[0]&&v<=y[1]){terms[k]=Math.round(terms[k]*(k==='wage'?1.03:1.08)+(k==='wage'?0:.5));msg=`Subiu um pouco: ${nsK(terms[k])}.`;mcls=''}
   else{hearts--;msg=hearts>0?'O clube não gostou. Cuidado.':'O clube cansou. Assine o que está na mesa.';mcls='bad'}setTimeout(draw,350)}};
 const sign=()=>{S.wage=terms.wage;n.ct={wage:S.wage,rg:terms.gb/Math.max(1,S.wage),ra:terms.ab/Math.max(1,S.wage),gb:terms.gb,ab:terms.ab};host.remove();try{nsAchHit('contrato')}catch(e){}try{saveNow('season')}catch(e){}toast({ic:'✍️',title:'Contrato assinado',txt:`${nsK(S.wage)} por semana · até ${S.year+Math.max(0,S.contract)}`,ms:2400});try{if(document.body.classList.contains('nshub'))renderHub()}catch(e){}};
 draw()};

// ---------- mercado: propostas, agente e empréstimo ----------
const NS_AGCALLS=[0,2,4,6];
function nsAgTier(){const a=S.n&&S.n.staff&&S.n.staff.ag;return a?a.t:0}
function nsForm(){try{const t=Object.values(S.st.stats||{}).reduce((a,s)=>({ns:a.ns+(s.ns||0),nn:a.nn+(s.nn||0)}),{ns:0,nn:0});return t.nn?t.ns/t.nn:6.5}catch(e){return 6.5}}
function nsClubP(c,bonus){return logi((S.ovr-c.s+2+bonus+(S.n.star.l-4)*.35+(nsForm()-6.8)*2.2+(S.heart===c.id?2:0))/2.6)}
function nsOfferFrom(c){return{...mkOffer(c),heart:S.heart===c.id,wk:6}}
function nsMarketWeek(){const n=S.n;if(!n||S.youth||S.agreed||S.loan)return;n.offers=(n.offers||[]).filter(o=>--o.wk>0&&CLUB[o.club]);
 if(n.offers.length>=3)return;const f=nsForm();const p=clamp(.02+n.star.l*.006+Math.max(0,f-6.6)*.07+(n.rel.fans-50)/2500,0,.3);if(!ch(p))return;
 const tgt=S.ovr+n.star.l*.3+(f-6.8)*2.5+randn()*3;const pool=CLUBS.filter(c=>c.id!==S.club&&c.s>=tgt-7&&c.s<=tgt+3&&!n.offers.some(o=>o.club===c.id));if(!pool.length)return;
 const c=pick(pool);n.offers.push(nsOfferFrom(c));n.newOffer=c.id}
{const _wk=nsWeek;nsWeek=function(){const r=_wk.apply(this,arguments);try{nsMarketWeek()}catch(e){console.error(e)}return r}}
{const _bsM=buildSeason;buildSeason=function(...a){const r=_bsM.apply(this,a);try{if(S.n){S.n.agCalls=NS_AGCALLS[nsAgTier()];S.n.offers=[]}}catch(e){}return r}}
{const _pmM=nsPostMatch;nsPostMatch=async function(){const r=await _pmM.apply(this,arguments);try{const n=S.n;if(n&&n.newOffer&&CLUB[n.newOffer]){const c=CLUB[n.newOffer];n.newOffer=null;const k=await nsPop({ic:'📩',title:`Proposta do ${c.n}`,html:`<div class="nsoff1">${shieldHTML(c,'lg')}<div><b>${esc(c.n)}</b><small>${esc(LG[c.l].n)} · ${'★'.repeat(stars(c.s))}</small></div></div>`,txt:'Um clube quer você. A mudança acontece no fim da temporada.',opts:[['v','Ver proposta']],ok:'Depois'});if(k==='v'){NS_MK='prop';nsOpen(nsMarketPage())}}}catch(e){console.error(e)}return r}}
let NS_MK='prop',NS_MKRES=null,NS_MKSTAR=3;
function nsOfferCard(o,i,src){const c=CLUB[o.club];if(!c)return'';const L=LG[c.l];return`<div class="nsoff"><div class="hd">${shieldHTML(c,'lg')}<div><b>${esc(c.n)}${o.loan?' <em>empréstimo</em>':''}${o.heart?' ♥':''}</b><small>${esc(L.n)} · ${'★'.repeat(stars(c.s))}${'☆'.repeat(5-stars(c.s))}</small></div></div>
 <div class="ft"><span>${o.loan?'1 temporada':o.years+' anos'}</span><span>${nsK(o.wage)}/sem</span><span>${esc(o.role)}</span>${o.wk?`<span class="muted">expira em ${o.wk} sem.</span>`:''}</div>
 <div class="bt"><button class="btn small" data-acc="${src}:${i}">Aceitar</button>${src==='p'?`<button class="btn ghost small" data-rej="${i}">Recusar</button>`:''}</div></div>`}
function nsMarketPage(){return{t:'Mercado',cls:'market',html:()=>{const n=S.n;n.offers=n.offers||[];if(n.agCalls==null)n.agCalls=NS_AGCALLS[nsAgTier()];const ag=S.agreed;const tier=nsAgTier();
  let body='';
  if(ag&&CLUB[ag.club])body+=`<div class="nsagreed">${shieldHTML(CLUB[ag.club],'sm')}<div><b>${ag.loan?'Empréstimo acertado':'Transferência acertada'}: ${esc(CLUB[ag.club].n)}</b><small>Você se muda no fim da temporada.</small></div><button class="btn ghost small" id="mkUndo">Desfazer</button></div>`;
  if(NS_MK==='prop')body+=n.offers.length?`<div class="nsoffs" data-pg>${n.offers.map((o,i)=>nsOfferCard(o,i,'p')).join('')}</div>`:`<div class="nsempty"><span>📭</span><b>Nenhuma proposta agora</b><p class="muted">Boas notas, gols e nível de estrela fazem os clubes te procurarem. Ou peça ao seu agente.</p></div>`;
  else if(NS_MK==='ag'){
   if(!tier)body+=`<div class="nsempty"><span>💼</span><b>Você não tem agente</b><p class="muted">Com agente você pede um clube, uma liga ou clubes de um nível. Quanto melhor o agente, mais alto ele alcança e mais ligações ele faz.</p><button class="btn" id="mkHire">Contratar agente</button></div>`;
   else{const lgOpts=Object.entries(LG).map(([k,v])=>`<option value="${k}">${COUNTRY[v.c].f} ${esc(v.n)}</option>`).join('');
    const clubOpts=Object.keys(LG).map(l=>`<optgroup label="${esc(LG[l].n)}">${CLUBS.filter(c=>c.l===l&&c.id!==S.club).sort((a,b)=>b.s-a.s).map(c=>`<option value="${esc(c.id)}">${esc(c.n)} ${'★'.repeat(stars(c.s))}</option>`).join('')}</optgroup>`).join('');
    body+=`<div class="nsag-h"><span>💼 ${esc(NS_STAFF.ag[tier-1].n)}</span><b>${n.agCalls} ligaç${n.agCalls===1?'ão':'ões'} nesta temporada</b></div>
    <div class="nsag-g"><label>Um clube<select class="input" id="mkClub">${clubOpts}</select></label><button class="btn small" data-call="club" ${n.agCalls<=0?'disabled':''}>Ligar</button>
    <label>Uma liga<select class="input" id="mkLg">${lgOpts}</select></label><button class="btn small" data-call="lg" ${n.agCalls<=0?'disabled':''}>Ligar</button>
    <label>Clubes de<span class="nsag-st">${[1,2,3,4,5].map(k=>`<button class="${NS_MKSTAR===k?'on':''}" data-st="${k}">${k}★</button>`).join('')}</span></label><button class="btn small" data-call="st" ${n.agCalls<=0?'disabled':''}>Ligar</button></div>`;
    if(NS_MKRES)body+=`<div class="nsmkres"><p>${esc(NS_MKRES.txt)}</p><div class="nsoffs" data-pg>${(NS_MKRES.offers||[]).map((o,i)=>nsOfferCard(o,i,'r')).join('')}</div></div>`}}
  else{if(!canLoan())body+=`<div class="nsempty"><span>🔁</span><b>${S.loan?'Você já está emprestado':'Empréstimo indisponível'}</b><p class="muted">${S.loan?'Volta pro seu clube no fim da temporada.':'Com contrato acabando, o clube não empresta. Renove antes.'}</p></div>`;
   else{if(!NS_MKRES||!NS_MKRES.loan)NS_MKRES={loan:true,txt:'Esses clubes topam te receber emprestado por uma temporada.',offers:loanOffers(null,3)};body+=`<p class="muted nshelp">${esc(NS_MKRES.txt)}</p><div class="nsoffs" data-pg>${NS_MKRES.offers.map((o,i)=>nsOfferCard(o,i,'r')).join('')}</div>`}}
  return`<div class="nstabs wide three">${[['prop',`📩 Propostas${n.offers.length?` (${n.offers.length})`:''}`],['ag','💼 Agente'],['loan','🔁 Empréstimo']].map(([k,t])=>`<button class="${NS_MK===k?'on':''}" data-mk="${k}">${t}</button>`).join('')}</div>${body}`},
 bind:B=>{const n=S.n;B.querySelectorAll('[data-mk]').forEach(b=>b.onclick=()=>{NS_MK=b.dataset.mk;NS_MKRES=null;nsRefresh()});
  const hire=B.querySelector('#mkHire');if(hire)hire.onclick=()=>nsPush(nsStaffPage());
  const undo=B.querySelector('#mkUndo');if(undo)undo.onclick=()=>{S.agreed=null;S.board=clamp(S.board-4,0,100);toast({ic:'↩️',title:'Acerto desfeito',ms:1800});nsRefresh()};
  B.querySelectorAll('[data-st]').forEach(b=>b.onclick=()=>{NS_MKSTAR=+b.dataset.st;B.querySelectorAll('[data-st]').forEach(x=>x.classList.toggle('on',x===b))});
  B.querySelectorAll('[data-call]').forEach(b=>b.onclick=()=>{if(n.agCalls<=0)return;n.agCalls--;const t=nsAgTier();const bonus=[0,.5,2,3.5][t];const kind=b.dataset.call;
   if(kind==='club'){const c=CLUB[B.querySelector('#mkClub').value];const reach=stars(c.s)-stars(S.ovr+2+t*2);if(reach>t){NS_MKRES={txt:`O ${c.n} é alto demais pro seu agente agora. Contrate um agente melhor ou suba de nível.`,offers:[]}}else NS_MKRES=ch(nsClubP(c,bonus))?{txt:`O ${c.n} topou e mandou proposta!`,offers:[nsOfferFrom(c)]}:{txt:pick([`O ${c.n} agradeceu, mas não tem interesse agora.`,`O ${c.n} acha que você ainda não está no nível deles.`]),offers:[]}}
   else if(kind==='lg'){const l=B.querySelector('#mkLg').value;const cand=shuffle(CLUBS.filter(c=>c.l===l&&c.id!==S.club&&stars(c.s)<=stars(S.ovr+2+t*2)+t)).slice(0,6);const offs=cand.filter(c=>ch(nsClubP(c,bonus))).slice(0,3).map(nsOfferFrom);NS_MKRES=offs.length?{txt:`Seu agente ligou pra clubes da ${LG[l].n}.`,offers:offs}:{txt:`Nenhum clube da ${LG[l].n} se interessou.`,offers:[]}}
   else{const k=NS_MKSTAR;if(k>stars(S.ovr+2+t*2)+t){NS_MKRES={txt:`Clubes ${k}★ estão fora do alcance do seu agente agora.`,offers:[]}}else{const cand=shuffle(CLUBS.filter(c=>stars(c.s)===k&&c.id!==S.club)).slice(0,8);const offs=cand.filter(c=>ch(nsClubP(c,bonus+1))).slice(0,3).map(nsOfferFrom);NS_MKRES=offs.length?{txt:`Clubes ${k}★ interessados:`,offers:offs}:{txt:`Nenhum clube ${k}★ quis agora.`,offers:[]}}}
   nsRefresh()});
  B.querySelectorAll('[data-rej]').forEach(b=>b.onclick=()=>{n.offers.splice(+b.dataset.rej,1);nsRefresh()});
  B.querySelectorAll('[data-acc]').forEach(b=>b.onclick=async()=>{const[src,i]=b.dataset.acc.split(':');const o=src==='p'?n.offers[+i]:(NS_MKRES&&NS_MKRES.offers||[])[+i];if(!o)return;const c=CLUB[o.club];
   const q=await nsPop({ic:'✍️',title:o.loan?`Ir emprestado pro ${c.n}?`:`Acertar com o ${c.n}?`,txt:o.loan?'Você joga lá a próxima temporada e depois volta.':`${o.years} anos, ${nsK(o.wage)} por semana. Você termina esta temporada e se muda na janela. A diretoria atual não vai gostar.`,opts:[['y','✓ Acertar']],ok:'✕ Cancelar'});if(q!=='y')return;
   S.agreed={...o,stay:false};delete S.agreed.wk;S.board=clamp(S.board-(o.loan?3:12),0,100);if(src==='p')n.offers.splice(+i,1);NS_MKRES=null;toast({ic:'🤝',title:'Acertado!',txt:`Você vai pro ${c.n} no fim da temporada.`,ms:2600});try{saveNow('season')}catch(e){}nsRefresh()})},
 nav:[{ic:'💼',t:'Contratar agente',fn:()=>nsPush(nsStaffPage())}]}}
// aba Contrato ganha o botão do mercado (no lugar do antigo "bônus, mercado…")
{const _ct=nsCtTabHTML;nsCtTabHTML=function(){const n=S.n;const k=(n.offers||[]).length;return _ct().replace(/<button class="nsc b" id="ctMore">[\s\S]*?<\/button>/,`<button class="nsc b ${k?'hot':''}" id="ctMkt"><span>🔁</span><div><b>Mercado${k?` · ${k} proposta${k>1?'s':''}`:''}</b><small>propostas, agente, empréstimo</small></div></button>`)}}
{const _bt=nsBindTabs;nsBindTabs=function(){_bt();const e=document.getElementById('ctMkt');if(e)e.onclick=()=>nsOpen(nsMarketPage());const r=document.getElementById('ctRenew');if(r)r.onclick=nsRenew}}
nsRenew=async function(){const c=club();if(S.loan){await nsPop({ic:'🔁',title:'Emprestado',txt:'Renovação só com o clube dono do seu passe.'});return}
 if(S.contract>1){await nsPop({ic:'✍️',title:'Ainda não',txt:`Seu contrato vai até ${S.year+S.contract}. A diretoria só conversa quando faltar 1 ano.`});return}
 const o=renewalOffer();if(!o||o.refuse){await nsPop({ic:'🙅',title:'A diretoria não quer renovar',txt:'Melhore as atuações e a relação com o técnico. Ou veja o mercado.'});return}
 S.contract=o.years+(S.contract>0?S.contract:0);S.wage=o.wage;nsSync();nsNegotiate({club:c.id,years:o.years,wage:o.wage},{title:'Renovação'})};

// ---------- telas sem rolagem: listas viram páginas ----------
const NSPG={};
function nsPaginate(B,key){const L=B.querySelector('[data-pg]');if(!L)return;const items=[...L.children];if(items.length<2)return;items.forEach(i=>i.hidden=false);
 const old=B.querySelector('.nspager');if(old)old.remove();if(B.scrollHeight<=B.clientHeight+2)return;
 const bar=document.createElement('div');bar.className='nspager';bar.innerHTML='<button data-pp="-1" aria-label="Anterior">◀</button><span></span><button data-pp="1" aria-label="Próxima">▶</button>';L.after(bar);
 let per=items.length;while(per>1){items.forEach((it,i)=>it.hidden=i>=per);if(B.scrollHeight<=B.clientHeight+2)break;per--}
 const pages=Math.ceil(items.length/per);let pg=clamp(NSPG[key]||0,0,pages-1);
 const show=()=>{items.forEach((it,i)=>it.hidden=Math.floor(i/per)!==pg);bar.querySelector('span').textContent=`${pg+1} / ${pages}`;bar.querySelector('[data-pp="-1"]').disabled=pg===0;bar.querySelector('[data-pp="1"]').disabled=pg===pages-1;NSPG[key]=pg};
 bar.querySelectorAll('[data-pp]').forEach(b=>b.onclick=()=>{pg=clamp(pg+ +b.dataset.pp,0,pages-1);show()});show()}
{const _d=nsDraw;nsDraw=function(keep){_d.apply(this,arguments);try{const B=document.getElementById('nspB');const p=NSP.stack[NSP.stack.length-1];if(B&&p){
  if(!B.querySelector('[data-pg]')){const cand=B.querySelector('.nsshop')||B.querySelector('.nslg tbody')||B.querySelector('.nslk-fo');if(cand)cand.setAttribute('data-pg','')}
  nsPaginate(B,p.t+'|'+(p.cls||'')+'|'+NS_SHOP+NS_LSUB+NS_LT+NS_MK+NS_LK)}}catch(e){console.error(e)}}}
// conquistas: a lista vira páginas também
{const _ap=nsAchPage;nsAchPage=function(){const p=_ap();const h0=p.html;p.html=()=>h0().replace(/(<\/div>)(<div class="nsach )/,'$1<div class="nsachl" data-pg>$2')+'</div>';return p}}

// ---------- tela principal mais didática: o que fazer nesta semana ----------
function nsWeekStrip(){const n=S.n;const st=S.st;if(!st||st.done)return'';const left=NS_TRAIN_MAX-(n.trainW||0);const offs=(n.offers||[]).length;
 const pills=[];
 pills.push(`<button class="nsw ${left>0&&n.en>=nsTrainCost()?'do':'ok'}" id="nwTr"><span>🏋️</span>Treinos ${n.trainW||0}/${NS_TRAIN_MAX}</button>`);
 if(n.en<40)pills.push(`<button class="nsw warn" id="nwEn"><span>🥤</span>Energia ${Math.round(n.en)}%</button>`);
 if(offs)pills.push(`<button class="nsw hot" id="nwOf"><span>📩</span>${offs} proposta${offs>1?'s':''}</button>`);
 if(n.spOffer)pills.push(`<button class="nsw hot" id="nwSp"><span>🤝</span>Marca</button>`);
 if(S.agreed&&CLUB[S.agreed.club])pills.push(`<span class="nsw ok"><span>✈️</span>${esc(CLUB[S.agreed.club].a||mkAbbr(CLUB[S.agreed.club].n))} no fim do ano</span>`);
 pills.push(`<span class="nsw nx"><span>➜</span>depois: Jogar</span>`);
 return`<div class="nsweek">${pills.join('')}</div>`}
{const _hh2=nsHubHTML;nsHubHTML=function(){let h=_hh2.apply(this,arguments);
 h=h.replace(/<button class="nshint" id="nsHintB">[\s\S]*?<\/button>/,'');
 h=h.replace('<div class="nsh-sub">',nsWeekStrip()+'<div class="nsh-sub">');
 const left=NS_TRAIN_MAX-((S.n&&S.n.trainW)||0);if(left>0)h=h.replace('<button id="nsHab"><span>⚽</span>',`<button id="nsHab"><i class="nsbadge">${left}</i><span>⚽</span>`);
 const k=(S.n.offers||[]).length;if(k)h=h.replace('data-nt="contrato" class="','data-nt="contrato" class="dot ');
 return h}}
{const _rnh2=nsRenderHub;nsRenderHub=function(){const r=_rnh2.apply(this,arguments);try{const on=(id,fn)=>{const e=document.getElementById(id);if(e)e.onclick=fn};
  on('nwTr',()=>nsOpen(nsHabPage()));on('nwEn',()=>nsDrinkPick());on('nwOf',()=>{NS_MK='prop';nsOpen(nsMarketPage())});on('nwSp',async()=>{await nsSpOfferPop();renderHub()});
  // telas baixas: tira o que é extra até caber sem rolagem
  const body=document.getElementById('nsBody');const nsh=document.querySelector('.nsh');if(body&&nsh&&NS_TAB!=='status'){for(const sel of['.nsnext .last','.nsnext','.ns3b em']){if(nsh.scrollHeight<=nsh.clientHeight+1&&body.scrollHeight<=body.clientHeight+1)break;document.querySelectorAll(sel).forEach(e=>e.remove())}}}catch(e){console.error(e)}return r}}
if(typeof TOUR_HUB!=='undefined'){TOUR_HUB.splice(2,0,{sel:'.nsweek',t:'Sua semana',d:'O que dá pra fazer antes do jogo: <b>3 treinos</b> por rodada, energia, propostas de clubes e marcas.'});TOUR_HUB.push({sel:'[data-nt="contrato"]',t:'Contrato e mercado',d:'Renove com minigame de negociação, veja propostas, peça clubes ao agente ou vá emprestado.'})}

{const st=document.createElement('style');st.textContent=`
/* ---------- design: botões com volume, barras com rótulo dentro ---------- */
.nsc.b,.ns3b,.nsh-nav button,.nsnb,.nshr-m,.nsrel-m,.nsrow,.nsbt,.nshorse{box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 2px 0 rgba(0,0,0,.35);transition:transform .08s}
.nsc.b:active,.ns3b:active,.nsh-nav button:active,.nsnb:active,.nshr-go:active,.nsrel-go:active{transform:translateY(2px);box-shadow:none}
.nsh-nav button{background:linear-gradient(180deg,#2a6a49,#174a31 60%,#123b27);border-color:#3f8c63}.nsh-nav .go{background:linear-gradient(180deg,#ffa25e,#ff7a2b 55%,#e85f10);box-shadow:0 0 0 2px #ffb27a55,0 3px 0 #9c3d06}
.nsh-nav button{position:relative}.nsbadge{position:absolute;top:4px;right:8px;min-width:20px;height:20px;border-radius:10px;background:#ff3b30;color:#fff;font:900 12px var(--f-body);font-style:normal;display:grid;place-items:center;box-shadow:0 0 0 2px #0b2117}
.nshr-go{background:linear-gradient(180deg,#5fd06a,#2e9c3e 60%,#21813a);box-shadow:0 3px 0 #145a26}.nshr-go.done{background:#2a3a30;border-color:#3a4a40;color:#6f8a77;box-shadow:none}
.nshr-m{position:relative;overflow:hidden}.nshr-m .nsmb{height:12px}
.nsrel-m{position:relative;overflow:hidden;min-height:58px}.nsrel-go{background:linear-gradient(180deg,#f4f4f4,#cfd6d1);border-color:#e8ece9;box-shadow:0 3px 0 #7f8a84}
.nsrel.off .nsrel-go{opacity:.75}
.nstabs button.dot::after{content:'';display:inline-block;width:7px;height:7px;border-radius:50%;background:#ff3b30;margin-left:4px;vertical-align:2px}
.nsc.hot{border-color:#ff9f1c;background:linear-gradient(180deg,#5a3a12,#3d2810)}
/* ---------- faixa da semana ---------- */
.nsweek{display:flex;gap:6px;flex-wrap:wrap}.nsw{display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:5px 10px;font:800 12.5px var(--f-body);border:1px solid var(--line-2);background:var(--panel);color:var(--chalk)}.nsw span{font-size:14px}
.nsw.do{background:linear-gradient(180deg,#3fae4c,#21813a);border-color:#6fd06c;animation:nsglow 1.6s ease-in-out infinite}.nsw.ok{color:var(--muted)}.nsw.warn{background:#5a1f19;border-color:#b0261c}.nsw.hot{background:#5a3a12;border-color:#ff9f1c}.nsw.nx{background:none;border-style:dashed;color:var(--muted)}
@keyframes nsglow{50%{box-shadow:0 0 0 3px #6fd06c44}}
.nsses{display:flex;align-items:center;gap:6px;flex-wrap:wrap;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:8px 12px;font:700 13px var(--f-body);color:var(--muted)}.nsses i{width:16px;height:16px;border-radius:50%;background:#3fae4c;box-shadow:inset 0 -2px 0 #1d6b2a}.nsses i.used{background:#2a3a30;box-shadow:none}.nsses b{color:var(--chalk)}
/* ---------- páginas ---------- */
.nspager{display:flex;align-items:center;justify-content:center;gap:14px;padding:4px 0}.nspager button{width:52px;height:40px;border-radius:12px;border:1px solid var(--line-2);background:linear-gradient(180deg,var(--panel-2),var(--panel));color:var(--chalk);font-size:18px}.nspager button:disabled{opacity:.3}.nspager span{font:800 14px var(--f-body);color:var(--muted);min-width:56px;text-align:center}
[data-pg]>[hidden]{display:none!important}
.nslg .std td.zone{width:6px;min-width:6px;max-width:6px;padding:0}.nslg .std{width:100%}.nslg .std td:nth-child(2){width:62%}
.nsachl{display:grid;gap:6px}
.nsauto2{display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--panel);border:1px solid var(--line);border-radius:12px;padding:6px 10px;font:700 13px var(--f-body);color:var(--muted)}.nsauto2 select{max-width:52%}
/* ---------- treino jogável ---------- */
#overlay:has(.nstg){padding:0;place-items:stretch;grid-template-columns:minmax(0,1fr);background:var(--pitch)}
.nstg{width:100%;max-width:720px;margin:0 auto;height:100dvh;display:flex;flex-direction:column;gap:8px;padding:calc(10px + env(safe-area-inset-top,0px)) 12px calc(10px + env(safe-area-inset-bottom,0px))}.nstg.shake{animation:nsshk .3s}@keyframes nsshk{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.nstg-top{display:flex;align-items:center;gap:10px;background:var(--panel);border:1px solid var(--line-2);border-radius:14px;padding:10px 12px}.nstg-top b{flex:1;font:900 20px var(--f-display);letter-spacing:.3px}.nstg-top .lv{font-size:20px;letter-spacing:2px}.nstg-top .sc{font:700 13px var(--f-body);color:var(--muted)}.nstg-top .sc b{font-size:22px;color:var(--gold)}
.nstg-a{flex:1;min-height:0;position:relative;border-radius:16px;overflow:hidden;background:repeating-linear-gradient(180deg,#2f7d3c 0 44px,#2a7336 44px 88px);border:1px solid var(--line-2);display:flex;flex-direction:column}
.nstg-m{min-height:30px;text-align:center;font:900 20px var(--f-display)}.nstg-m.good{color:var(--good)}.nstg-m.bad{color:var(--bad)}
.nstg-in{margin:auto;display:grid;gap:10px;justify-items:center;text-align:center;padding:20px;max-width:420px;background:rgba(5,14,9,.82);border-radius:18px}.nstg-in>span{font-size:56px}.nstg-in b{font:900 26px var(--f-display)}.nstg-in p{margin:0;line-height:1.4}
.btn.big{font-size:20px;padding:16px 24px}
.tgbar{height:8px;background:#0006}.tgbar i{display:block;height:100%;background:linear-gradient(90deg,#ff5a4a,#f2c443,#8be08a)}
.tgv{flex:1;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-content:center;justify-items:center;gap:3vmin;padding:4vmin}.cone{width:min(100%,24vmin);aspect-ratio:1;border:0;border-radius:50%;background:radial-gradient(circle at 50% 40%,#3d8f4a,#245c2e);display:grid;place-items:center;font-size:7vmin;opacity:.45;transition:transform .08s}.cone.on{opacity:1;background:radial-gradient(circle,#ffe36b,#ff9f1c);transform:scale(1.08);box-shadow:0 0 24px #ffd23c}.cone.red{opacity:1;background:radial-gradient(circle,#ff7a6a,#b0261c);box-shadow:0 0 20px #ff3b30}.cone.ok{background:#8be08a}
.tgf{flex:1;display:grid;grid-template-columns:110px 1fr;gap:16px;padding:20px;align-items:stretch}.tgf .meter{position:relative;border-radius:16px;background:linear-gradient(0deg,#0d2118,#1d4a2c);border:2px solid #ffffff30;overflow:hidden}.tgf .band{position:absolute;left:0;right:0;background:linear-gradient(90deg,#3fae4c,#8be08a);box-shadow:0 0 14px #8be08a}.tgf .needle{position:absolute;left:-4px;right:-4px;height:6px;background:#fff;border-radius:3px;box-shadow:0 0 8px #000}
.tgf-r{display:grid;align-content:space-between;justify-items:center;padding:10px 0}.ballz{font-size:60px}.ballz.fly{animation:nsfly .55s ease-out}@keyframes nsfly{to{transform:translate(40px,-200px) scale(.4);opacity:0}}
.tgt{flex:1;position:relative;touch-action:none}.tgt .ball{position:absolute;font-size:44px;transform:translate(-50%,-50%);will-change:top,left}.tgt .zone{position:absolute;left:10%;right:10%;top:72%;height:20%;border-radius:50%;border:4px dashed #ffffff60}.tgt .zone.hot{border-color:#f2c443;background:#f2c44322}.tgt .foot{position:absolute;bottom:2%;left:50%;transform:translateX(-50%);font-size:38px}.tgt small{position:absolute;top:8px;left:0;right:0;text-align:center;color:#fff9;font-weight:700}
.tgp{flex:1;position:relative}.tgp .mate{position:absolute;width:52px;height:52px;margin:-26px 0 0 -26px;border-radius:50%;border:3px solid #fff;background:radial-gradient(circle at 40% 35%,#6fb7ff,#1d5fbf);color:#fff;font:900 18px var(--f-display);transition:top .3s}.tgp .mate.ok{background:#8be08a}.tgp .def{position:absolute;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#ff8a7a,#b0261c);border:2px solid #fff8;pointer-events:none}.tgp .me{position:absolute;left:50%;bottom:4%;transform:translateX(-50%);font-size:34px}
.tgk{flex:1;display:grid;grid-template-rows:1fr auto auto;gap:10px;padding:14px;align-items:center;justify-items:center}.tgk .goal{position:relative;width:100%;max-width:680px;aspect-ratio:2.4/1;border:6px solid #f4f4f4;border-bottom:0;background:repeating-linear-gradient(90deg,#ffffff18 0 2px,transparent 2px 16px),repeating-linear-gradient(0deg,#ffffff18 0 2px,transparent 2px 16px),#ffffff10;align-self:end}
.tgk .tg{position:absolute;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,#ffd23c 0 22%,#ff7a2b 23% 45%,#ffd23c 46% 70%,#ff7a2b 71%);opacity:.9}.tgk .cx{position:absolute;top:0;bottom:0;width:4px;margin-left:-2px;background:#fff;box-shadow:0 0 8px #000}.tgk .cy{position:absolute;left:0;right:0;height:4px;margin-top:-2px;background:#fff;box-shadow:0 0 8px #000;display:none}.tgk .hitm{position:absolute;transform:translate(-50%,-50%);font-size:28px;display:none}.tgk .wall{font-size:42px;letter-spacing:-6px}
.nstg-res{display:grid;justify-items:center}.nstg-res b{font:900 54px var(--f-display);color:var(--gold);line-height:1}.nstg-res span{font:800 13px var(--f-body);color:var(--muted)}
/* ---------- negociação ---------- */
.nsneg2 .nsneg-pat{display:flex;justify-content:space-between;align-items:center;font:700 13px var(--f-body);color:var(--muted)}.nsneg2 .nsneg-pat span{font-size:18px;letter-spacing:2px}
.nsmeter{position:relative;height:56px;border-radius:14px;background:linear-gradient(180deg,#5a1f19,#3d1410);border:2px solid #ffffff30;overflow:hidden}.nsmeter .y{position:absolute;top:0;bottom:0;background:#a8861d}.nsmeter .g{position:absolute;top:0;bottom:0;background:linear-gradient(180deg,#5fd06a,#2e9c3e)}.nsmeter .p{position:absolute;top:-4px;bottom:-4px;width:6px;background:#fff;border-radius:3px;box-shadow:0 0 10px #000}
/* ---------- mercado ---------- */
.nsoffs{display:grid;gap:8px}.nsoff{display:grid;gap:8px;background:linear-gradient(180deg,var(--panel-2),var(--panel));border:1px solid var(--line-2);border-radius:14px;padding:10px 12px}.nsoff .hd{display:flex;gap:10px;align-items:center}.nsoff .hd b{display:block;font:800 18px var(--f-display)}.nsoff .hd em{font-style:normal;font-size:12px;background:#1f6bff;color:#fff;border-radius:6px;padding:1px 6px;vertical-align:3px}.nsoff .hd small{color:var(--gold);font-weight:700}
.nsoff .ft{display:flex;flex-wrap:wrap;gap:6px}.nsoff .ft span{background:#0d2118;border-radius:8px;padding:4px 8px;font:700 12.5px var(--f-body)}.nsoff .bt{display:flex;gap:8px}.nsoff .bt .btn{flex:1}
.nsoff1{display:flex;gap:12px;align-items:center;justify-content:center}.nsoff1 b{display:block;font:800 20px var(--f-display)}.nsoff1 small{color:var(--gold)}
.nsagreed{display:flex;gap:10px;align-items:center;background:#173f25;border:1px solid #2f7a45;border-radius:12px;padding:8px 10px}.nsagreed div{flex:1}.nsagreed small{display:block;color:var(--muted)}
.nsag-h{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;font:700 13.5px var(--f-body);color:var(--muted)}.nsag-h b{color:var(--chalk)}
.nsag-g{display:grid;grid-template-columns:1fr auto;gap:8px 10px;align-items:end;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:10px}.nsag-g label{display:grid;gap:4px;font:700 12.5px var(--f-body);color:var(--muted)}.nsag-g select{width:100%}
.nsag-st{display:flex;gap:4px}.nsag-st button{flex:1;padding:8px 0;border-radius:10px;border:1px solid var(--line-2);background:var(--panel-2);color:var(--gold);font:800 13px var(--f-body)}.nsag-st button.on{background:var(--accent);color:var(--accent-ink)}
.nsmkres{display:grid;gap:8px}.nsmkres p{margin:0;font-weight:700}
@media (max-height:760px){.nsweek .nsw.nx{display:none}.nsw{padding:4px 8px;font-size:12px}}
`;document.head.appendChild(st)}
