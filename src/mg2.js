// ================== MINIGAMES 2: treino, academia, estudos, loteria, crime e carteira ==================
// Todos usam a mesma moldura dos minigames da vida (lifeFrame) e devolvem {ok, perfect, score}.
const m2beep=(f,d=.08,g=.07)=>{try{SFX.tone({f,dur:d,gain:g})}catch(e){}};
const m2end=(ok,txt,perfect)=>mgEnd(ok,txt,perfect);

// 1) EMBAIXADINHAS: toque quando a bola cair na faixa verde, perto do pé
function mgEmbaixadinha(o={}){return new Promise(res=>{
 lifeFrame({tag:'Treino',sub:'Habilidade',title:o.title||'Embaixadinhas',hint:'Toque quando a bola descer até a <b>faixa verde</b>. Cedo ou tarde demais, ela cai.'},
  `<div class="m2-emb" id="emb"><div class="m2-emb-cnt" id="embC">0</div><div class="m2-emb-zone" id="embZ"></div><div class="m2-emb-ball" id="embB">⚽</div><div class="m2-emb-foot">🦶</div></div><button class="btn wide mgbtn" id="embGo">Tocar!</button>`);
 const box=document.getElementById('emb'),B=document.getElementById('embB'),Z=document.getElementById('embZ'),C=document.getElementById('embC');
 let y=.9,v=0,g=1.55,zone=.24,n=0,done=false,last=performance.now();const skill=o.skill??.6;zone=.2+skill*.08;
 Z.style.height=(zone*100)+'%';
 const draw=()=>{B.style.bottom=`calc(${y*86}% + 8px)`;B.style.transform=`translateX(-50%) rotate(${n*47}deg)`};
 const tick=t=>{if(done)return;if(!B.isConnected){done=true;res({ok:false,perfect:false,score:n});return}const dt=Math.min(.05,(t-last)/1000);last=t;v-=g*dt;y+=v*dt;if(y<=0){y=0;draw();finish('A bola caiu!');return}draw();requestAnimationFrame(tick)};
 let tLast=0;const tap=()=>{if(done)return;const now=performance.now();if(now-tLast<160||(v>0&&y<zone*1.6))return;if(y<=zone&&v<0){tLast=now;n++;C.textContent=n;m2beep(520+n*12);const sweet=Math.abs(y-zone*.5)<zone*.22;v=Math.sqrt(2*g*(.72+R(-.06,.1)));g*=1.035;zone=Math.max(.11,zone*.985);Z.style.height=(zone*100)+'%';if(sweet)box.classList.add('sweet'),setTimeout(()=>box.classList.remove('sweet'),160)}else finish(y>zone?'Tocou cedo demais':'Errou o tempo')};
 const finish=async txt=>{if(done)return;done=true;const eg=document.getElementById('embGo');if(eg)eg.disabled=true;const ok=n>=(o.need||8);const perfect=n>=(o.perfect||20);await m2end(ok,`${n} embaixadinhas · ${txt}`,perfect);res({ok,perfect,score:n})};
 document.getElementById('embGo').onclick=tap;box.onclick=tap;draw();requestAnimationFrame(t=>{last=t;requestAnimationFrame(tick)});
 setTimeout(()=>finish('Tempo esgotado'),45000);
})}

// 2) TIRO DE 40 METROS: alterne os pés o mais rápido que puder
function mgSprint(o={}){return new Promise(res=>{
 lifeFrame({tag:'Treino',sub:'Velocidade',title:'Tiro de 40 metros',hint:'Alterne <b>esquerdo</b> e <b>direito</b> sem errar o pé. Pé repetido faz você tropeçar.'},
  `<div class="m2-run" id="run">${['Você','Rival','Rival'].map((n,i)=>`<div class="m2-lane ${i?'':'me'}"><span>${n}</span><b id="rn${i}">🏃</b></div>`).join('')}<div class="m2-fin"></div></div>
  <div class="m2-feet"><button class="btn mgbtn" id="ftL">🦶 Esquerdo</button><button class="btn mgbtn" id="ftR">Direito 🦶</button></div><div class="mono muted" id="runT" style="font-size:13px">Prepare-se…</div>`);
 const P=[0,0,0],sp=[0,(o.rival||7.2)*R(.94,1.02),(o.rival||7.2)*R(.9,.99)];let lastF=null,started=false,done=false,t0=0,stun=0;
 const alive=()=>!!document.getElementById('run');const draw=()=>{if(!alive())return;P.forEach((p,i)=>{document.getElementById('rn'+i).style.left=`calc(${Math.min(40,p)/40*86}% )`})};
 const step=f=>{if(!started||done||stun>performance.now())return;if(f===lastF){stun=performance.now()+380;document.getElementById('run').classList.add('stum');setTimeout(()=>document.getElementById('run').classList.remove('stum'),380);lastF=null;return}lastF=f;P[0]+=1.08;m2beep(f==='L'?300:360,.04,.04);draw();if(P[0]>=40)end()};
 const end=async()=>{if(done)return;done=true;const t=(performance.now()-t0)/1000;const place=1+P.slice(1).filter(p=>p>=40||p>P[0]).length;const ok=place<=2;const perfect=place===1&&t<5.4;
  if(alive())document.getElementById('runT').textContent=`${t.toFixed(2)} s`;await m2end(ok,place===1?`Primeiro lugar! ${t.toFixed(2)} s`:place===2?`Segundo · ${t.toFixed(2)} s`:'Ficou pra trás',perfect);res({ok,perfect,score:place,time:t})};
 document.getElementById('ftL').onclick=()=>step('L');document.getElementById('ftR').onclick=()=>step('R');
 let last=0;const tick=ts=>{if(done)return;if(!alive()){done=true;res({ok:false,perfect:false,score:3});return}const dt=last?Math.min(.05,(ts-last)/1000):0;last=ts;if(started){for(let i=1;i<3;i++)P[i]+=sp[i]*dt;draw();if(P[1]>=40&&P[2]>=40&&P[0]<40){end();return}document.getElementById('runT').textContent=((ts-t0)/1000).toFixed(1)+' s'}requestAnimationFrame(tick)};
 const T=document.getElementById('runT');setTimeout(()=>{if(!alive())return;T.textContent='3…';m2beep(440)},300);setTimeout(()=>{T.textContent='2…';m2beep(440)},900);setTimeout(()=>{T.textContent='1…';m2beep(440)},1500);
 setTimeout(()=>{if(!alive())return;T.textContent='VAI!';m2beep(880,.14);started=true;t0=performance.now();requestAnimationFrame(tick)},2100);draw();
 setTimeout(()=>{if(!done)end()},20000);
})}

// 3) ACADEMIA: segure pra carregar e solte na faixa verde
function mgLift(o={}){return new Promise(res=>{
 const reps=o.reps||5;lifeFrame({tag:'Academia',sub:o.sub||'Força',title:o.title||'Série de agachamento',hint:'<b>Segure</b> o botão pra subir a carga e <b>solte</b> dentro da faixa verde.'},
  `<div class="m2-lift"><div class="m2-lift-bar"><i id="lfZ"></i><s id="lfF"></s></div><div class="m2-lift-w" id="lfW">🏋️</div></div><div class="mono" id="lfC" style="font-size:14px">Repetição 1 de ${reps}</div><button class="btn wide mgbtn" id="lfGo">Segure aqui</button>`);
 const Z=document.getElementById('lfZ'),F=document.getElementById('lfF'),W=document.getElementById('lfW'),btn=document.getElementById('lfGo');
 let rep=0,hits=0,perf=0,hold=false,x=0,z0=.6,zw=.16,done=false,last=0;
 const setZ=()=>{zw=clamp(.2-rep*.012+(o.skill??.5)*.04,.09,.24);z0=R(.45,.88-zw);Z.style.left=(z0*100)+'%';Z.style.width=(zw*100)+'%'};setZ();
 const tick=t=>{if(done)return;if(!F.isConnected){done=true;res({ok:false,perfect:false,score:hits});return}const dt=last?Math.min(.05,(t-last)/1000):0;last=t;if(hold){x+=dt*(.55+rep*.07);if(x>=1){x=1;release()}}else x=Math.max(0,x-dt*1.6);F.style.width=(x*100)+'%';W.style.transform=`translateY(${-x*26}px)`;requestAnimationFrame(tick)};
 const release=()=>{if(!hold)return;hold=false;const ok=x>=z0&&x<=z0+zw;const p=ok&&Math.abs(x-(z0+zw/2))<zw*.2;hits+=ok;perf+=p;m2beep(ok?660:180,.1);
  document.getElementById('lfC').textContent=ok?(p?'Perfeito!':'Boa!'):'Perdeu a série';rep++;if(rep>=reps){finish();return}setTimeout(()=>{if(!done){x=0;setZ();document.getElementById('lfC').textContent=`Repetição ${rep+1} de ${reps}`}},500)};
 const finish=async()=>{done=true;btn.disabled=true;const ok=hits>=Math.ceil(reps*.6);await m2end(ok,`${hits} de ${reps} repetições`,perf>=reps-1);res({ok,perfect:perf>=reps-1,score:hits})};
 const down=e=>{e.preventDefault();if(done)return;hold=true};const up=e=>{e.preventDefault();release()};
 btn.addEventListener('pointerdown',down);btn.addEventListener('pointerup',up);btn.addEventListener('pointerleave',up);btn.addEventListener('pointercancel',up);
 requestAnimationFrame(tick);setTimeout(()=>{if(!done)finish()},40000);
})}

// 4) MEMÓRIA TÁTICA: repita a sequência de jogadas
function mgMemory(o={}){return new Promise(res=>{
 lifeFrame({tag:o.tag||'Treino',sub:o.sub||'Leitura tática',title:o.title||'Memória tática',hint:'Veja a jogada acender e <b>repita na mesma ordem</b>.'},
  `<div class="m2-mem" id="mem">${Array.from({length:9},(_,i)=>`<button class="m2-cell" data-c="${i}" disabled>${['🧤','🛡️','🛡️','🎯','⚙️','🎯','⚡','⚽','⚡'][i]}</button>`).join('')}</div><div class="mono" id="memT" style="font-size:14px">Olhe a jogada…</div>`);
 const cells=[...document.querySelectorAll('#mem .m2-cell')];const MT=document.getElementById('memT');const rounds=o.rounds||3;let r=0,seq=[],inp=[],done=false,score=0;
 const flash=(i,ms)=>new Promise(ok=>{cells[i].classList.add('on');m2beep(300+i*60,.1);setTimeout(()=>{cells[i].classList.remove('on');setTimeout(ok,120)},ms)});
 const play=async()=>{const len=(o.start||4)+r;seq=[];for(let i=0;i<len;i++){let c;do{c=RI(0,8)}while(seq.length&&c===seq[seq.length-1]);seq.push(c)}
  MT.textContent=`Jogada ${r+1} de ${rounds} · ${len} passes`;cells.forEach(c=>c.disabled=true);await sleep(450);for(const i of seq)await flash(i,Math.max(260,520-r*60));
  inp=[];cells.forEach(c=>c.disabled=false);MT.textContent='Sua vez!'};
 cells.forEach(c=>c.onclick=async()=>{if(done)return;const i=+c.dataset.c;inp.push(i);c.classList.add('on');setTimeout(()=>c.classList.remove('on'),150);
  if(seq[inp.length-1]!==i){done=true;cells.forEach(x=>x.disabled=true);const ok=score>=Math.ceil(rounds/2);await m2end(ok,`Errou a ordem · ${score} de ${rounds}`,false);res({ok,perfect:false,score});return}
  m2beep(500+inp.length*40,.06);if(inp.length===seq.length){score++;r++;if(r>=rounds){done=true;await m2end(true,'Leu a jogada toda!',true);res({ok:true,perfect:true,score});return}play()}});
 play();
})}

// 5) PÊNALTIS: escolha o canto e acerte a força
function mgPenalties(o={}){return new Promise(async res=>{
 const n=o.n||5;let gols=0,perf=0;
 for(let k=0;k<n;k++){
  const r=await new Promise(rr=>{lifeFrame({tag:'Treino',sub:`Cobrança ${k+1} de ${n} · ${gols} gol${gols===1?'':'s'}`,title:'Pênaltis',hint:'Toque no <b>canto</b> e depois pare a agulha na faixa verde.'},
   `<div class="m2-goal" id="pg">${Array.from({length:6},(_,i)=>`<button class="m2-gz" data-z="${i}"></button>`).join('')}<span class="m2-gk" id="pgk">🧤</span></div><div class="mgbar oneway" id="pbar" style="opacity:.35"><div class="mgzone" id="pzn"></div><div class="mgneedle" id="pN"></div></div><button class="btn wide mgbtn" id="pGo" disabled>Bater!</button>`);
   let zone=null,x=0,run=false,done=false;const zw=clamp(.17+(o.skill??.5)*.1,.12,.3),z0=R(.5,.85-zw);const zn=document.getElementById('pzn');zn.style.left=(z0*100)+'%';zn.style.width=(zw*100)+'%';
   document.querySelectorAll('#pg .m2-gz').forEach(b=>b.onclick=()=>{if(zone!=null)return;zone=+b.dataset.z;b.classList.add('pick');document.getElementById('pbar').style.opacity=1;const go=document.getElementById('pGo');go.disabled=false;run=true;const t0=performance.now();
    const tick=t=>{if(!run)return;x=(t-t0)/900;if(x>=1){x=1;shoot(false)}document.getElementById('pN').style.left=(x*100)+'%';if(run)requestAnimationFrame(tick)};requestAnimationFrame(tick);go.onclick=()=>shoot(true)});
   const shoot=async tap=>{if(done)return;done=true;run=false;document.getElementById('pGo').disabled=true;const good=tap&&x>=z0&&x<=z0+zw;const p=good&&Math.abs(x-(z0+zw/2))<zw*.2;
    const gkz=ch(.36)?zone:RI(0,5);const gk=document.getElementById('pgk');const col=gkz%3;gk.style.left=['18%','50%','82%'][col];gk.style.top=gkz<3?'22%':'62%';
    const saved=good&&!p&&(gkz===zone||(gkz%3===zone%3&&ch(.5)));const out=!good&&ch(.6);const goal=good&&!saved;
    await m2end(goal,goal?(p?'Golaço no ângulo!':'Gol!'):saved?'O goleiro pegou':out?'Pra fora!':'Bateu mal, o goleiro defendeu',p&&goal);rr({goal,p})};
  });gols+=r.goal;perf+=r.p&&r.goal}
 res({ok:gols>=Math.ceil(n*.6),perfect:gols===n,score:gols});
})}

// 6) QUIZ: perguntas de futebol (regras e história)
const QUIZ=[
 ['Quantos jogadores cada time tem em campo no começo do jogo?',['11','10','12','9'],0],
 ['Quanto tempo dura um jogo oficial, sem acréscimos?',['90 minutos','80 minutos','100 minutos','120 minutos'],0],
 ['A que distância do gol fica a marca do pênalti?',['11 metros','9,15 metros','16,5 metros','12 metros'],0],
 ['Qual a largura oficial do gol?',['7,32 m','6,50 m','8,00 m','7,00 m'],0],
 ['Qual a altura oficial do gol?',['2,44 m','2,20 m','2,60 m','2,30 m'],0],
 ['A que distância a barreira precisa ficar numa falta?',['9,15 m','11 m','7 m','5 m'],0],
 ['Em qual destes lances NÃO existe impedimento?',['Escanteio','Passe de calcanhar','Lançamento longo','Cruzamento'],0],
 ['Quantos pontos vale uma vitória nos campeonatos de pontos corridos?',['3','2','1','4'],0],
 ['Quanto dura a prorrogação?',['2 tempos de 15 min','2 tempos de 10 min','1 tempo de 20 min','2 tempos de 20 min'],0],
 ['Que cartão expulsa o jogador direto?',['Vermelho','Amarelo','Azul','Verde'],0],
 ['Dois cartões amarelos no mesmo jogo resultam em…',['Expulsão','Multa','Nada','Pênalti'],0],
 ['Quantas Copas do Mundo o Brasil ganhou?',['5','4','6','3'],0],
 ['Quem ganhou a Copa do Mundo de 2002?',['Brasil','Alemanha','França','Itália'],0],
 ['Quem ganhou a Copa do Mundo de 2022?',['Argentina','França','Brasil','Croácia'],0],
 ['Quem ganhou a Copa do Mundo de 2014?',['Alemanha','Argentina','Brasil','Espanha'],0],
 ['Em que país foi a Copa do Mundo de 2014?',['Brasil','Rússia','África do Sul','Alemanha'],0],
 ['Quem ganhou a Copa do Mundo de 2010?',['Espanha','Holanda','Alemanha','Brasil'],0],
 ['Quem ganhou a Copa do Mundo de 2018?',['França','Croácia','Bélgica','Inglaterra'],0],
 ['Quem foi campeão da primeira Copa do Mundo, em 1930?',['Uruguai','Argentina','Brasil','Itália'],0],
 ['Qual seleção ganhou a Copa de 1970 com Pelé?',['Brasil','Itália','Alemanha','Inglaterra'],0],
 ['O goleiro pode pegar com a mão um recuo intencional com o pé de um companheiro?',['Não','Sim','Só dentro da pequena área','Só no segundo tempo'],0],
 ['O que acontece quando a bola sai pela linha de fundo depois de tocar por último num defensor?',['Escanteio','Tiro de meta','Lateral','Bola ao chão'],0],
 ['Gol olímpico é o gol feito…',['Direto de escanteio','De bicicleta','Do meio de campo','De cabeça'],0],
 ['Quantos jogadores no mínimo um time precisa ter em campo pro jogo continuar?',['7','8','6','9'],0],
 ['Hat-trick é quando um jogador faz…',['3 gols no mesmo jogo','2 gols seguidos','Gol de falta','Gol contra'],0],
 ['Qual é o raio do círculo central?',['9,15 m','10 m','11 m','7,32 m'],0],
 ['Quem marca o pênalti na disputa por pênaltis primeiro?',['Quem ganhar o sorteio decide','Sempre o mandante','Sempre o visitante','Quem tem mais pontos'],0],
 ['Quantos árbitros assistentes (bandeirinhas) trabalham no campo?',['2','1','3','4'],0],
 ['Qual é a duração de cada tempo no futebol profissional?',['45 minutos','40 minutos','50 minutos','30 minutos'],0],
 ['O que é "carrinho por trás" numa disputa perigosa?',['Falta, podendo dar cartão','Lance limpo','Impedimento','Tiro livre indireto sempre'],0],
];
function mgQuiz(o={}){return new Promise(async res=>{
 const n=o.n||3;const pool=shuffle(QUIZ.slice()).slice(0,n);let score=0;
 for(let k=0;k<n;k++){const [q,ops,ci]=pool[k];const order=shuffle(ops.map((t,i)=>({t,i})));
  const ok=await new Promise(rr=>{lifeFrame({tag:o.tag||'Estudos',sub:`Pergunta ${k+1} de ${n} · ${score} certa${score===1?'':'s'}`,title:o.title||'Quiz de futebol',hint:esc(q)},
   `<div class="m2-quiz">${order.map(x=>`<button class="m2-q" data-i="${x.i}">${esc(x.t)}</button>`).join('')}</div><div class="m2-qt"><i id="qT"></i></div>`);
   let done=false;const t0=performance.now(),lim=12000;const T=document.getElementById('qT');const tick=t=>{if(done)return;const f=1-(t-t0)/lim;T.style.width=Math.max(0,f*100)+'%';if(f<=0){pickA(-1);return}requestAnimationFrame(tick)};requestAnimationFrame(tick);
   const pickA=async i=>{if(done)return;done=true;const right=i===ci;document.querySelectorAll('.m2-q').forEach(b=>{b.disabled=true;if(+b.dataset.i===ci)b.classList.add('ok');else if(+b.dataset.i===i)b.classList.add('bad')});m2beep(right?760:160,.12);
    await m2end(right,right?'Certa!':i<0?'Acabou o tempo':`Era: ${ops[ci]}`,false);rr(right)};
   document.querySelectorAll('.m2-q').forEach(b=>b.onclick=()=>pickA(+b.dataset.i))});
  score+=ok}
 res({ok:score>=Math.ceil(n*.6),perfect:score===n,score});
})}

// 7) PROVA DE DIREÇÃO: desvie dos cones mudando de faixa
function mgDriving(o={}){return new Promise(res=>{
 lifeFrame({tag:'Detran',sub:'Prova prática',title:'Prova de direção',hint:'Troque de faixa pra <b>desviar dos cones</b>. Bateu duas vezes, reprovou.'},
  `<div class="m2-road" id="road"><div class="m2-car" id="car">🚗</div></div><div class="m2-feet"><button class="btn mgbtn" id="dvL">⬅️</button><button class="btn mgbtn" id="dvR">➡️</button></div><div class="mono" id="dvT" style="font-size:13px">12 s · 0 batidas</div>`);
 const road=document.getElementById('road'),car=document.getElementById('car');let lane=1,obs=[],hits=0,done=false,t0=performance.now(),last=0,spawn=0;const dur=o.dur||12;
 const setCar=()=>car.style.left=`${16.6+lane*33.3}%`;setCar();
 document.getElementById('dvL').onclick=()=>{lane=Math.max(0,lane-1);setCar()};document.getElementById('dvR').onclick=()=>{lane=Math.min(2,lane+1);setCar()};
 const tick=t=>{if(done)return;if(!road.isConnected){done=true;res({ok:false,perfect:false,score:2});return}const dt=last?Math.min(.05,(t-last)/1000):0;last=t;const el=(t-t0)/1000;spawn-=dt;
  if(spawn<=0){spawn=Math.max(.42,.95-el*.04);const l=RI(0,2);const e=document.createElement('span');e.className='m2-cone';e.textContent=ch(.25)?'🚙':'🚧';e.style.left=`${16.6+l*33.3}%`;road.appendChild(e);obs.push({l,y:-.1,e})}
  for(const ob of obs){ob.y+=dt*(.62+el*.03);ob.e.style.top=(ob.y*100)+'%';if(!ob.hit&&ob.y>.78&&ob.y<.94&&ob.l===lane){ob.hit=true;hits++;road.classList.add('hit');m2beep(140,.15,.09);setTimeout(()=>road.classList.remove('hit'),200)}}
  obs=obs.filter(ob=>{if(ob.y>1.1){ob.e.remove();return false}return true});
  document.getElementById('dvT').textContent=`${Math.max(0,dur-el).toFixed(0)} s · ${hits} batida${hits===1?'':'s'}`;
  if(hits>=2){finish();return}if(el>=dur){finish();return}requestAnimationFrame(tick)};
 const finish=async()=>{done=true;const ok=hits<2;await m2end(ok,ok?(hits?'Aprovado, por pouco!':'Aprovado sem nenhum erro!'):'Reprovado',ok&&!hits);res({ok,perfect:ok&&!hits,score:hits})};
 requestAnimationFrame(tick);
})}

// 8) LOTERIA: escolha 6 números de 1 a 25
function mgLottery(o={}){return new Promise(res=>{
 const pickN=6;let picks=[];
 lifeFrame({tag:'Loteria',sub:'Bilhete',title:'Mega da Bola',hint:`Escolha <b>${pickN} números</b>. Acertou 3 já leva prêmio. Acertou os 6, fica rico.`},
  `<div class="m2-lot" id="lot">${Array.from({length:25},(_,i)=>`<button class="m2-ln" data-n="${i+1}">${i+1}</button>`).join('')}</div><div class="m2-draw" id="ldraw"></div><button class="btn wide mgbtn" id="lGo" disabled>Sortear</button><button class="lnk" id="lAuto" style="margin-top:4px">Surpresinha</button>`);
 const go=document.getElementById('lGo');const upd=()=>{document.querySelectorAll('.m2-ln').forEach(b=>b.classList.toggle('on',picks.includes(+b.dataset.n)));go.disabled=picks.length!==pickN;go.textContent=picks.length===pickN?'Sortear':`Faltam ${pickN-picks.length}`};
 document.querySelectorAll('.m2-ln').forEach(b=>b.onclick=()=>{const n=+b.dataset.n;if(picks.includes(n))picks=picks.filter(x=>x!==n);else if(picks.length<pickN)picks.push(n);upd()});
 document.getElementById('lAuto').onclick=()=>{picks=shuffle(Array.from({length:25},(_,i)=>i+1)).slice(0,pickN);upd()};upd();
 go.onclick=async()=>{go.disabled=true;document.getElementById('lAuto').remove();document.querySelectorAll('.m2-ln').forEach(b=>b.disabled=true);const draw=shuffle(Array.from({length:25},(_,i)=>i+1)).slice(0,pickN).sort((a,b)=>a-b);const D=document.getElementById('ldraw');
  for(const n of draw){await sleep(reduced?120:520);D.insertAdjacentHTML('beforeend',`<b class="${picks.includes(n)?'hit':''}">${n}</b>`);m2beep(picks.includes(n)?880:420,.08)}
  const hits=draw.filter(n=>picks.includes(n)).length;const prize=[0,0,0,.004,.06,1.5,25][hits];
  await m2end(prize>0,hits>=3?`${hits} acertos! Prêmio de ${money(prize)}`:`${hits} acerto${hits===1?'':'s'}. Não foi dessa vez.`,hits>=5);res({ok:prize>0,perfect:hits>=5,score:hits,prize})};
})}

// 9) RASPADINHA: três iguais ganha
function mgScratch(){return new Promise(res=>{
 const SY=['⚽','⚽','⚽','🏆','🏆','💰','💰','🍀','👟'];const grid=shuffle(SY.slice());
 lifeFrame({tag:'Loteria',sub:'Raspadinha',title:'Raspadinha do Craque',hint:'Raspe as <b>9 casas</b>. Três iguais = prêmio.'},`<div class="m2-scr" id="scr">${grid.map((s,i)=>`<button class="m2-sc" data-i="${i}"><span>${s}</span></button>`).join('')}</div>`);
 let opened=0,done=false;document.querySelectorAll('.m2-sc').forEach(b=>b.onclick=async()=>{if(b.classList.contains('open')||done)return;b.classList.add('open');opened++;m2beep(500+opened*30,.05);
  if(opened===9){done=true;const cnt={};grid.forEach(s=>cnt[s]=(cnt[s]||0)+1);const win=Object.entries(cnt).filter(([,c])=>c>=3).map(([s])=>s);const val={'⚽':.003,'🏆':.02,'💰':.1};const prize=win.reduce((a,s)=>a+(val[s]||0),0);
   await m2end(prize>0,prize?`Ganhou ${money(prize)}!`:'Nada dessa vez.',prize>=.02);res({ok:prize>0,perfect:prize>=.02,prize})}})});
}

// 10) BATEDOR DE CARTEIRA: só pegue quando ele estiver distraído
function mgPickpocket(o={}){return new Promise(res=>{
 lifeFrame({tag:'Lado errado',sub:'Centro da cidade',title:'Batedor de carteira',hint:'Pegue a carteira só quando a vítima estiver <b>📱 distraída</b>. Se ela olhar, você está frito.'},
  `<div class="m2-pp"><div class="m2-vic" id="vic">🧍</div><div class="m2-eye" id="eye">👀</div><div class="m2-loot" id="loot">💰 0/3</div></div><button class="btn wide mgbtn" id="ppGo">Pegar!</button>`);
 let state='look',grabs=0,done=false,timer=null;const eye=document.getElementById('eye');
 const next=()=>{if(done)return;if(!eye.isConnected){done=true;res({ok:false,perfect:false,score:grabs});return}state=state==='look'?'dist':'look';if(state==='dist'&&ch(.22))state='fake';eye.textContent=state==='look'?'👀':state==='fake'?'📱👀':'📱';eye.className='m2-eye '+state;timer=setTimeout(next,state==='look'?R(700,1600):state==='fake'?R(260,420):R(520,900))};
 next();
 document.getElementById('ppGo').onclick=async()=>{if(done)return;if(state==='dist'){grabs++;m2beep(700,.06);document.getElementById('loot').textContent=`💰 ${grabs}/3`;state='look';eye.textContent='👀';eye.className='m2-eye look';clearTimeout(timer);timer=setTimeout(next,R(500,1100));if(grabs>=3){done=true;clearTimeout(timer);await m2end(true,'Saiu de fininho com três carteiras.',true);res({ok:true,perfect:true,score:grabs})}}
  else{done=true;clearTimeout(timer);m2beep(150,.2,.1);await m2end(false,'"Pega ladrão!"',false);res({ok:false,perfect:false,score:grabs,caught:true})}};
 setTimeout(async()=>{if(done)return;done=true;clearTimeout(timer);await m2end(grabs>0,grabs?`Levou ${grabs} carteira${grabs>1?'s':''} e saiu antes de chamar atenção.`:'Amarelou e foi embora.',false);res({ok:grabs>0,perfect:false,score:grabs})},16000);
})}

// 11) ASSALTO A RESIDÊNCIA: entre de cômodo em cômodo, mas o alarme pode tocar
function mgBurglary(){return new Promise(res=>{
 const rooms=[['🛋️','Sala',.004],['🍳','Cozinha',.002],['🛏️','Quarto',.012],['💼','Escritório',.02],['🔐','Cofre',.06]];let i=0,loot=0,done=false;
 const draw=()=>{lifeFrame({tag:'Lado errado',sub:'Madrugada',title:'Assalto a residência',hint:`Cada cômodo rende mais, mas a chance do <b>alarme</b> tocar sobe. Fuja quando quiser.`},
  `<div class="m2-house">${rooms.map((r,k)=>`<div class="m2-room ${k<i?'done':k===i?'cur':''}"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}</div><div class="mono" style="font-size:15px">Saque: ${money(loot)} · alarme ${Math.round((.08+i*.11)*100)}%</div>
  <div class="m2-feet">${i<rooms.length?`<button class="btn mgbtn" id="bgIn">Entrar: ${rooms[i][1]}</button>`:''}<button class="btn ghost mgbtn" id="bgOut">Fugir com o que tem</button></div>`);
  const bi=document.getElementById('bgIn');if(bi)bi.onclick=async()=>{if(done)return;if(ch(.08+i*.11)){done=true;m2beep(1200,.4,.1);const e=await mgEscape({comp:'Fuga',title:'O alarme disparou!',sub:'Escolha o lado certo pra escapar.',window:1300});res({ok:e.ok,alarm:true,loot:e.ok?loot*.5:0,caught:!e.ok});return}
   loot+=rooms[i][2]*R(.6,1.5);i++;m2beep(600,.06);draw()};
  document.getElementById('bgOut').onclick=async()=>{if(done)return;done=true;await m2end(loot>0,loot?`Saiu com ${money(loot)}.`:'Saiu sem nada.',i>=4);res({ok:loot>0,loot,perfect:i>=4})}};
 draw();
})}

// estilos
{const st=document.createElement('style');st.textContent=`
.m2-emb{position:relative;height:260px;border-radius:18px;background:linear-gradient(180deg,#123a24,#0c2a19);border:1px solid rgba(255,255,255,.1);overflow:hidden;touch-action:manipulation}
.m2-emb.sweet{box-shadow:inset 0 0 0 3px #f2c443}.m2-emb-zone{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(0deg,rgba(60,220,90,.45),rgba(60,220,90,.08));border-top:2px dashed #3cdc5a}
.m2-emb-ball{position:absolute;left:50%;font-size:38px;line-height:1;will-change:bottom,transform}.m2-emb-foot{position:absolute;left:50%;bottom:-2px;transform:translateX(-50%) scaleX(-1);font-size:34px;opacity:.85}
.m2-emb-cnt{position:absolute;top:8px;left:0;right:0;font:900 italic 46px var(--f-display);color:#fff;opacity:.9}
.m2-run{position:relative;display:grid;gap:6px;padding:8px;border-radius:14px;background:#0c2a19;border:1px solid rgba(255,255,255,.08)}.m2-run.stum{animation:m2shake .3s}
.m2-lane{position:relative;height:38px;border-radius:10px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.05) 0 10%,rgba(255,255,255,.02) 10% 20%)}.m2-lane span{position:absolute;left:6px;top:2px;font-size:10px;color:var(--muted)}.m2-lane.me{background-color:rgba(255,106,18,.16)}
.m2-lane b{position:absolute;top:4px;font-size:26px;transform:scaleX(-1);transition:left .08s linear}.m2-fin{position:absolute;right:16px;top:4px;bottom:4px;width:4px;background:repeating-linear-gradient(180deg,#fff 0 6px,#111 6px 12px)}
.m2-feet{display:grid;grid-template-columns:1fr 1fr;gap:8px}.m2-feet .btn{min-height:56px;font-size:16px;touch-action:manipulation}
@keyframes m2shake{0%,100%{transform:none}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.m2-lift{display:grid;gap:10px;justify-items:center;padding:10px 0}.m2-lift-bar{position:relative;width:100%;height:22px;border-radius:12px;background:rgba(255,255,255,.08);overflow:hidden}
.m2-lift-bar i{position:absolute;top:0;bottom:0;background:rgba(60,220,90,.45);border-left:2px solid #3cdc5a;border-right:2px solid #3cdc5a}.m2-lift-bar s{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,#ff9a3c,#ff5a1f);opacity:.8}
.m2-lift-w{font-size:54px;transition:transform .05s}
#lfGo{user-select:none;-webkit-user-select:none;touch-action:none;min-height:64px}
.m2-mem{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:10px;border-radius:16px;background:linear-gradient(180deg,#1f7a3c,#155c2c);border:2px solid rgba(255,255,255,.35)}
.m2-cell{aspect-ratio:1.4;border-radius:12px;border:1px solid rgba(255,255,255,.25);background:rgba(0,0,0,.18);font-size:24px;color:#fff}.m2-cell.on{background:#f2c443;transform:scale(1.06)}.m2-cell:disabled{opacity:1}
.m2-goal{position:relative;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,64px);gap:3px;padding:6px;border:5px solid #fff;border-bottom:none;border-radius:6px 6px 0 0;background:repeating-linear-gradient(45deg,rgba(255,255,255,.08) 0 6px,transparent 6px 12px),#0c2a19}
.m2-gz{border:1px dashed rgba(255,255,255,.3);border-radius:8px;background:transparent}.m2-gz.pick{background:rgba(242,196,67,.45)}.m2-gk{position:absolute;left:50%;top:62%;transform:translate(-50%,-50%);font-size:34px;transition:all .35s;pointer-events:none}
.m2-quiz{display:grid;gap:8px}.m2-q{padding:12px;border-radius:12px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.06);color:inherit;font:600 15px var(--f-body,inherit);text-align:left}
.m2-q.ok{background:rgba(60,220,90,.35);border-color:#3cdc5a}.m2-q.bad{background:rgba(255,80,60,.35);border-color:#ff5a4a}.m2-qt{height:6px;border-radius:4px;background:rgba(255,255,255,.1);overflow:hidden}.m2-qt i{display:block;height:100%;background:#f2c443}
.m2-road{position:relative;height:300px;border-radius:14px;overflow:hidden;background:repeating-linear-gradient(90deg,#3a3f45 0 32.8%,#d8d8d8 32.8% 33.3%,#3a3f45 33.3% 66.1%,#d8d8d8 66.1% 66.6%,#3a3f45 66.6% 100%)}.m2-road.hit{box-shadow:inset 0 0 0 4px #ff5a4a}
.m2-car{position:absolute;bottom:6%;transform:translateX(-50%) rotate(-90deg);font-size:36px;transition:left .12s}.m2-cone{position:absolute;transform:translate(-50%,-50%);font-size:30px}
.m2-lot{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}.m2-ln{aspect-ratio:1;border-radius:50%;border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.06);color:#fff;font:800 16px var(--f-mono,monospace)}.m2-ln.on{background:#2bd46a;color:#062;border-color:#2bd46a}
.m2-draw{display:flex;gap:6px;justify-content:center;min-height:40px;flex-wrap:wrap}.m2-draw b{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;background:#fff;color:#111;font:800 16px var(--f-mono,monospace);animation:m2pop .3s}.m2-draw b.hit{background:#f2c443}
@keyframes m2pop{from{transform:scale(.2)}to{transform:none}}
.m2-scr{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.m2-sc{aspect-ratio:1;border-radius:12px;border:none;background:repeating-linear-gradient(45deg,#b9b9b9 0 6px,#a3a3a3 6px 12px);font-size:36px}.m2-sc span{visibility:hidden}.m2-sc.open{background:#fff8e0}.m2-sc.open span{visibility:visible}
.m2-pp{position:relative;height:200px;border-radius:14px;background:linear-gradient(180deg,#2c3540,#1a2128);display:grid;place-items:center}.m2-vic{font-size:90px}.m2-eye{position:absolute;top:14px;right:16px;font-size:30px;padding:4px 10px;border-radius:12px;background:rgba(255,80,60,.3)}
.m2-eye.dist{background:rgba(60,220,90,.35)}.m2-eye.fake{background:rgba(242,196,67,.4)}.m2-loot{position:absolute;bottom:10px;left:12px;font:800 16px var(--f-mono,monospace)}
.m2-house{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}.m2-room{display:grid;gap:2px;justify-items:center;padding:8px 2px;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);font-size:11px}.m2-room span{font-size:24px}
.m2-room.done{opacity:.4}.m2-room.cur{border-color:#f2c443;background:rgba(242,196,67,.15)}`;document.head.appendChild(st)}
