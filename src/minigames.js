// ================== MINI GAMES ==================
const MG_NAMES={finish:'Finalização',header:'Cabeçada',dribble:'Drible',reflex:'Reflexo',fk:'Falta'};
function mgFrame(o,body){
 $ov.hidden=false;
 $ov.innerHTML=`<div class="ovwrap mg"><div class="row" style="justify-content:space-between"><span class="eyebrow">${esc(o.comp||'')}${o.min!=null?` · ${o.min}'`:''}</span><span class="tag campo">${esc(MG_NAMES[o.type]||'Lance')}</span></div>
 <h2 class="pkh">${esc(o.title)}</h2><p class="muted" style="margin:4px 0 10px">${esc(o.sub||'')}</p><div id="mgArea">${body}</div><div class="pkres" id="mgRes"></div></div>`;
}
function mgEnd(ok,txt,perfect){
 return new Promise(r=>{const el=document.getElementById('mgRes');if(el)el.innerHTML=`<span class="${ok?'good':'bad'}">${esc(txt)}</span>${perfect?'<div class="mono" style="font-size:12px;color:var(--gold)">PERFEITO</div>':''}`;
  setTimeout(()=>{$ov.hidden=true;$ov.innerHTML='';r()},reduced?300:1300)});
}
// Barra de tempo: agulha vai e volta, toque pra parar na zona verde
function mgTiming(o){
 return new Promise(res=>{
  const zw=clamp(o.zone,.06,.6);const zc=o.oneWay?R(.62,.82):R(.3,.7);const z0=clamp(zc-zw/2,0,1-zw);
  mgFrame(o,`<div class="mgbar ${o.oneWay?'oneway':''}"><div class="mgzone" style="left:${z0*100}%;width:${zw*100}%"><i style="left:${35}%;width:30%"></i></div><div class="mgneedle" id="mgN"></div>${o.oneWay?'<span class="mghead">⚽</span>':''}</div>
  <button class="btn wide mgbtn" id="mgGo">${esc(o.btn||'Chutar!')}</button><div class="muted" style="font-size:12.5px;margin-top:6px">Toque quando a agulha estiver na faixa verde${o.oneWay?' (a bola passa uma vez só)':''}.</div>`);
  const n=document.getElementById('mgN');let t0=performance.now(),x=0,done=false;const per=o.period||1100;
  const tick=t=>{if(done)return;const e=(t-t0)/per;if(o.oneWay){x=e;if(x>=1){finish(false,true);return}}else{const f=e%2;x=f<1?f:2-f}n.style.left=(x*100)+'%';requestAnimationFrame(tick)};
  requestAnimationFrame(tick);
  const finish=async(tap,late)=>{if(done)return;done=true;const ok=tap&&x>=z0&&x<=z0+zw;const perfect=ok&&Math.abs(x-(z0+zw/2))<=zw*.15;
   document.getElementById('mgGo').disabled=true;await mgEnd(ok,ok?(o.okTxt||'Na mosca!'):late?'Passou do tempo':(o.failTxt||'Errou o tempo'),perfect);res({ok,perfect})};
  document.getElementById('mgGo').onclick=()=>finish(true);
  setTimeout(()=>finish(false,true),8000);
 });
}
// Drible: leia o zagueiro e vá pro outro lado
function mgDribble(o){
 return new Promise(async res=>{
  const rounds=3;const need=o.need||2;let hits=0;
  const cues=[['O zagueiro fecha pela DIREITA','left'],['O zagueiro fecha pela ESQUERDA','right'],['O zagueiro abre as pernas','nut']];
  for(let i=0;i<rounds;i++){
   const[cue,ans]=pick(cues);const win=o.window||1400;
   const pickA=await new Promise(r=>{
    mgFrame(o,`<div class="mgdrib"><div class="mgcue">${esc(cue)}</div><div class="mgtimer"><i id="mgT"></i></div>
    <div class="mgdirs"><button class="mgd" data-a="left">← Esquerda</button><button class="mgd" data-a="nut">↑ Caneta</button><button class="mgd" data-a="right">Direita →</button></div>
    <div class="mono muted" style="margin-top:8px">Lance ${i+1} de ${rounds} · acertos ${hits}</div></div>`);
    const T=document.getElementById('mgT');T.style.transition=`width ${win}ms linear`;requestAnimationFrame(()=>requestAnimationFrame(()=>T.style.width='0%'));
    let d=false;const to=setTimeout(()=>{if(!d){d=true;r(null)}},win);
    $ov.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{if(d)return;d=true;clearTimeout(to);r(b.dataset.a)});
   });
   const ok=pickA===ans;if(ok)hits++;
   const el=document.getElementById('mgRes');if(el)el.innerHTML=`<span class="${ok?'good':'bad'}">${ok?'Passou!':pickA?'Ele leu a jogada':'Demorou demais'}</span>`;
   await sleep(650);
  }
  const ok=hits>=need;await mgEnd(ok,ok?(o.okTxt||`Driblou ${hits} de ${rounds}`):(o.failTxt||`Perdeu a bola (${hits} de ${rounds})`),hits===rounds);res({ok,perfect:hits===rounds});
 });
}
// Reflexo do goleiro: a bola aparece num canto, toque rápido
function mgReflex(o){
 return new Promise(res=>{
  mgFrame(o,`<div class="mggoal">${[0,1,2,3,4,5].map(z=>`<button class="mgz" data-z="${z}" aria-label="Canto ${z+1}"></button>`).join('')}</div><div class="muted" style="font-size:12.5px;margin-top:6px">Fique atento. Toque no canto onde a bola aparecer.</div>`);
  let done=false,target=-1;const win=o.window||800;
  const zs=$ov.querySelectorAll('.mgz');
  const finish=async(ok,txt)=>{if(done)return;done=true;zs.forEach(z=>z.disabled=true);await mgEnd(ok,txt);res({ok})};
  zs.forEach(z=>z.onclick=()=>{if(target<0){finish(false,'Pulou antes da hora');return}finish(+z.dataset.z===target,+z.dataset.z===target?'DEFENDEU!':'Pulou pro lado errado')});
  setTimeout(()=>{if(done)return;target=RI(0,5);zs[target].classList.add('ball');setTimeout(()=>finish(false,'Não deu tempo'),win)},RI(600,1500));
 });
}
// Falta: escolha o canto e acerte a força
function mgFreeKick(o){
 return new Promise(async res=>{
  const zone=await new Promise(r=>{
   mgFrame(o,`<div class="mggoal fk">${[0,1,2,3,4,5].map(z=>`<button class="mgz pick" data-z="${z}"><span>${z<3?(z===1?'Meio alto':'Ângulo'):'Rasteira'}</span></button>`).join('')}<div class="wall"><i></i><i></i><i></i><i></i></div></div><div class="muted" style="font-size:12.5px;margin-top:6px">Escolha onde bater. No ângulo é mais difícil acertar o tempo, mas o goleiro não chega.</div>`);
   $ov.querySelectorAll('.mgz').forEach(b=>b.onclick=()=>r(+b.dataset.z));
  });
  const corner=zone===0||zone===2,low=zone>=3;
  const zw=o.zone*(corner?.8:low?1.3:1.05);
  const t=await mgTiming({...o,zone:zw,period:950,title:'Acerte a força',sub:corner?'No ângulo, a força tem que ser exata.':low?'Rasteira: a barreira pode pular, mas pode bater nela.':'No meio alto, por cima da barreira.',btn:'Bater!'});
  let ok=t.ok;if(ok&&!corner)ok=ch(low?.55:.6)||t.perfect;
  if(t.ok&&!ok){$ov.hidden=false;mgFrame(o,'');await mgEnd(false,low?'Bateu na barreira':'O goleiro espalmou')}
  else if(ok&&t.ok){$ov.hidden=false;mgFrame(o,'');await mgEnd(true,'GOLAÇO DE FALTA!',t.perfect)}
  res({ok,perfect:t.perfect});
 });
}
// Dispara o mini game certo
async function runChance(c){
 const A=c._A||CA();const pl=c.planned;
 if(c.type==='finish')return(await mgTiming({...c,title:pl?'Você tem a chance!':'Meia chance!',sub:pl?'Sozinho na área, o goleiro vem saindo.':'Sobrou pra você, mas de longe e marcado.',zone:(pl?.3:.13)+(A.FIN-70)/220,period:pl?1150:900,okTxt:'GOL!',failTxt:'Pra fora!'})).ok;
 if(c.type==='header')return(await mgTiming({...c,title:'Cruzamento na área!',sub:'Suba no tempo certo da bola.',zone:(pl?.24:.12)+(A.FIS-70)/260,period:pl?1500:1200,oneWay:true,btn:'Cabecear!',okTxt:'GOL DE CABEÇA!',failTxt:'Cabeceou pra fora'})).ok;
 if(c.type==='dribble')return(await mgDribble({...c,title:'Um contra um!',sub:'Leia o zagueiro e vá pro lado contrário.',need:pl?2:3,window:(pl?1500:1150)+(A.DRI-70)*14,okTxt:pl?'Driblou e marcou!':'Driblou geral e marcou!'})).ok;
 if(c.type==='fk')return(await mgFreeKick({...c,title:'Falta na entrada da área',sub:'A barreira está armada.',zone:(pl?.26:.14)+(A.FIN+A.PAS-140)/400})).ok;
 if(c.type==='reflex')return(await mgReflex({...c,title:pl?'Chute à queima-roupa!':'Chute de longe!',sub:pl?'Ele pegou de primeira dentro da área.':'A bola vem com efeito.',window:(pl?520:900)+(A.REF-70)*7})).ok;
 return false;
}
IO_UI.chance=async c=>runChance(c);
function chanceType(e){
 if(e.fk)return'fk';const p=S.pos;const r=rnd();
 if(['ATA','SA'].includes(p))return r<.5?'finish':r<.75?'header':'dribble';
 if(['PE','PD','ME','MD','MEI'].includes(p))return r<.45?'dribble':r<.85?'finish':'header';
 if(p==='ZAG')return r<.7?'header':'finish';
 return r<.6?'finish':r<.8?'header':'dribble';
}

// ================== TREINO (pré-temporada) ==================
async function playTraining(kind){
 const A=CA();let r;
 if(kind==='finish'){let hits=0,perf=0;for(let i=0;i<3;i++){const t=await mgTiming({type:'finish',comp:'Treino',title:`Finalização ${i+1} de 3`,sub:'O preparador cruza, você finaliza.',zone:.2+(A.FIN-70)/220,period:1000-i*120,okTxt:'Gol!',failTxt:'Pra fora'});hits+=t.ok;perf+=t.perfect}r={hits,perf,of:3,attr:'FIN'}}
 else if(kind==='dribble'){const t=await mgDribble({type:'dribble',comp:'Treino',title:'Circuito de drible',sub:'Leia o cone humano.',need:2,window:1200+(A.DRI-70)*12});r={hits:t.ok?(t.perfect?3:2):1,perf:t.perfect?1:0,of:3,attr:'DRI'}}
 else if(kind==='reflex'){let hits=0;for(let i=0;i<3;i++){const t=await mgReflex({type:'reflex',comp:'Treino',title:`Reflexo ${i+1} de 3`,sub:'Bolas disparadas pela máquina.',window:800-i*90+(A.REF-70)*6});hits+=t.ok}r={hits,perf:hits===3?1:0,of:3,attr:'REF'}}
 else{const t=await mgTiming({type:'header',comp:'Treino',title:'Treino de cabeceio',sub:'Bolas alçadas na área.',zone:.18+(A.FIS-70)/260,period:1300,oneWay:true,btn:'Cabecear!'});r={hits:t.ok?3:1,perf:t.perfect?1:0,of:3,attr:'FIS'}}
 const out=[];
 if(r.hits>=3){S.st.forma+=2;out.push(['+2 Forma','up'])}else if(r.hits===2){S.st.forma+=1;out.push(['+1 Forma','up'])}else{out.push(['Treino fraco','down'])}
 if(r.perf>=1&&ch(.6)){S.attrs[r.attr]=clamp(S.attrs[r.attr]+1,10,99);out.push([`+1 ${ATTR_NAME[r.attr]}`,'gold']);if(ch(.5)){S.ovr=clamp(S.ovr+1,30,99);out.push(['+1 OVR','up'])}}
 return{...r,chips:out};
}
