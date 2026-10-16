// ================== VIDA ESTILO "LIFE": hobbies, música, crime, mini games, decisões malucas ==================
function ensureLife2(){ensureLife();S.heat??=0;S.music??={inst:null,lvl:0,songs:0};S.ficha??=0;S.trafico??=false;S.hob??={};S.pendingMoments??=[]}

// ---------- efeitos novos ----------
const _applyFx1=applyFx;
applyFx=function(fx){
 const chips=_applyFx1(fx);if(!fx)return chips;ensureLife2();
 if(fx.heat){S.heat=clamp(S.heat+fx.heat,0,100);chips.push([`${fx.heat>0?'+':'−'}${Math.abs(fx.heat)} Polícia de olho`,fx.heat>0?'down':'up'])}
 if(fx.music){S.music.lvl=clamp(S.music.lvl+fx.music,0,100);chips.push([`+${fx.music} Música`,'up'])}
 if(fx.ficha){S.ficha+=fx.ficha;chips.push(['Ficha criminal','down'])}
 if(fx.preso){prisonNow(fx.preso);chips.push([`Preso: fora ${fx.preso} jogos`,'down'])}
 return chips;
};
function prisonNow(n){
 const st=S.st;if(st)st.suspLeft+=n;S.ficha++;S.life.fama=clamp(S.life.fama-12,0,100);S.board=clamp(S.board-25,0,100);S.coach=clamp((S.coach??50)-15,0,100);S.heat=Math.max(0,S.heat-40);
 if(S.trafico||S.ficha>=2){S.flags.release=true}
 S.pendingMoments.push({k:'preso',emoji:'🚔',eyebrow:'Plantão policial',big:'PRESO!',title:S.trafico?'A polícia estourou o esquema. Seu nome está em todos os jornais.':'Você foi pego em flagrante.',lines:[`Fora por ${n} jogos`,S.flags.release?'O clube quer rescindir':'A diretoria está furiosa','Ficha criminal: '+S.ficha]});
}
// risco semanal
const _lifeTick0=lifeTick;
lifeTick=function(me){
 _lifeTick0(me);ensureLife2();
 if(S.trafico){const g=R(.008,.03)*(1+S.ficha*.2);S.din+=g;S.heat=clamp(S.heat+4,0,100);S.life.disc=clamp(S.life.disc-.6,0,100)}
 S.heat=Math.max(0,S.heat-1.2);
 const p=Math.max(0,S.heat-25)/420+(S.trafico?.012:0);
 if(S.heat>0&&ch(p)){const n=S.trafico?RI(10,20):RI(3,8);prisonNow(n);(S.st.lifeNews=S.st.lifeNews||[]).push(`Você foi preso e vai ficar ${n} jogos fora.`)}
};

// ---------- mini games ----------
function mgRhythm(o){
 return new Promise(res=>{
  const N=o.notes||8,gap=o.gap||650,speed=o.speed||.28;const t0=performance.now()+900;const times=Array.from({length:N},(_,i)=>t0+i*gap+(i%3===2?gap*.5:0));
  mgFrame({...o,type:'rhythm'},`<div class="rhy" id="rhy"><div class="rhy-hit"></div>${times.map((_,i)=>`<span class="rnote" id="rn${i}">${['🎵','🎶','🥁','🎸'][i%4]}</span>`).join('')}</div>
  <button class="btn wide mgbtn" id="rGo">${esc(o.btn||'Tocar!')}</button><div class="mono muted" id="rStat" style="margin-top:6px">0 de ${N}</div>`);
  const hitX=18;let hits=0,perf=0,done=false;const judged=new Array(N).fill(false);
  const els=times.map((_,i)=>document.getElementById('rn'+i));
  const sp=o.speed||.06;
  const tick=t=>{if(done)return;let alive=false;times.forEach((tt,i)=>{const px=hitX+(tt-t)*sp;els[i].style.left=px+'%';if(!judged[i]&&t-tt>170){judged[i]=true;els[i].classList.add('miss')}if(!judged[i])alive=true});if(!alive){finish();return}requestAnimationFrame(tick)};
  requestAnimationFrame(tick);
  const tap=()=>{if(done)return;const t=performance.now();let bi=-1,bd=1e9;times.forEach((tt,i)=>{if(judged[i])return;const d=Math.abs(t-tt);if(d<bd){bd=d;bi=i}});if(bi<0)return;
   if(bd<=150){judged[bi]=true;hits++;if(bd<=60)perf++;els[bi].classList.add('hit')}else if(bd<=300){judged[bi]=true;els[bi].classList.add('miss')}
   (document.getElementById('rStat')||{}).textContent=`${hits} de ${N}${perf?` · ${perf} perfeitos`:''}`};
  document.getElementById('rGo').onclick=tap;
  const finish=async()=>{if(done)return;done=true;(document.getElementById('rGo')||{}).disabled=true;const ok=hits>=Math.ceil(N*.6);await mgEnd(ok,ok?(hits===N?'Show perfeito!':`Mandou bem: ${hits}/${N}`):`Desafinou: ${hits}/${N}`,hits===N);res({ok,hits,perf,of:N})};
 });
}
function mgLockpick(o){
 return new Promise(async res=>{
  const pins=o.pins||3;let ok=0,miss=0;
  for(let p=0;p<pins&&miss<2;p++){
   const r=await new Promise(rs=>{
    const spot=R(40,320),w=o.w||34,per=o.per||1300;
    mgFrame({...o,type:'lock'},`<div class="lock"><svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="80" fill="#0b1a12" stroke="rgba(236,240,226,.3)" stroke-width="4"/><path d="${arc(100,100,80,spot-w/2,spot+w/2)}" stroke="var(--good)" stroke-width="12" fill="none" stroke-linecap="round"/><line id="lkN" x1="100" y1="100" x2="100" y2="24" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="100" r="10" fill="var(--gold)"/></svg></div>
    <button class="btn wide mgbtn" id="lkGo">Destravar!</button><div class="mono muted" style="margin-top:6px">Pino ${p+1} de ${pins} · erros ${miss}/2</div>`);
    const n=document.getElementById('lkN');const t0=performance.now();let a=0,done=false;
    const tick=t=>{if(done)return;a=((t-t0)/per*360)%360;n.setAttribute('transform',`rotate(${a} 100 100)`);requestAnimationFrame(tick)};requestAnimationFrame(tick);
    document.getElementById('lkGo').onclick=()=>{if(done)return;done=true;let d=Math.abs(a-spot);d=Math.min(d,360-d);rs(d<=w/2)};
    setTimeout(()=>{if(!done){done=true;rs(false)}},6000);
   });
   if(r)ok++;else miss++;
   const el=document.getElementById('mgRes');if(el)el.innerHTML=`<span class="${r?'good':'bad'}">${r?'Clique!':'Travou'}</span>`;await sleep(500);
  }
  const win=ok>=pins;await mgEnd(win,win?'Destravou!':'O alarme disparou!');res({ok:win});
 });
}
function arc(cx,cy,r,a0,a1){const p=a=>{const t=(a-90)*Math.PI/180;return[cx+r*Math.cos(t),cy+r*Math.sin(t)]};const[x0,y0]=p(a0),[x1,y1]=p(a1);return`M${x0} ${y0} A${r} ${r} 0 ${a1-a0>180?1:0} 1 ${x1} ${y1}`}
function mgEscape(o){
 return new Promise(async res=>{
  const cues=[['Viatura fechando pela ESQUERDA','right'],['Viatura fechando pela DIREITA','left'],['Bloqueio na frente: beco à esquerda','left'],['Helicóptero na rua da direita','left'],['Sirene vindo da esquerda','right']];
  let hits=0;const R0=4;
  for(let i=0;i<R0;i++){const[cue,ans]=pick(cues);const win=(o.window||1300)-i*90;
   const a=await new Promise(r=>{mgFrame({...o,type:'escape'},`<div class="mgcue">🚨 ${esc(cue)}</div><div class="mgtimer"><i id="mgT"></i></div><div class="mgdirs" style="grid-template-columns:1fr 1fr"><button class="mgd" data-a="left">← Esquerda</button><button class="mgd" data-a="right">Direita →</button></div><div class="mono muted" style="margin-top:8px">Rua ${i+1} de ${R0} · escapou ${hits}</div>`);
    const T=document.getElementById('mgT');T.style.transition=`width ${win}ms linear`;requestAnimationFrame(()=>requestAnimationFrame(()=>T.style.width='0%'));let d=false;const to=setTimeout(()=>{if(!d){d=true;r(null)}},win);
    $ov.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{if(d)return;d=true;clearTimeout(to);r(b.dataset.a)})});
   if(a===ans)hits++;const el=document.getElementById('mgRes');if(el)el.innerHTML=`<span class="${a===ans?'good':'bad'}">${a===ans?'Despistou!':'Quase te pegaram'}</span>`;await sleep(500)}
  const ok=hits>=3;await mgEnd(ok,ok?'Sumiu na quebrada!':'Cercado pela polícia!');res({ok});
 });
}
// ---------- caça-níquel ----------
const SLOT=['⚽','🍒','🍀','💎','7️⃣','🏆'];
function slotMachine(){
 return new Promise(res=>{let bet=betOpts()[0]||0,net=0,spins=0;const SUM={txt:'Você foi embora sem jogar.',chips:[]};
  const draw=(reels,msg,spinning)=>{$ov.hidden=false;$ov.innerHTML=`<div class="ovwrap casino-ov"><div class="row" style="justify-content:space-between"><span class="eyebrow">Caça-níquel · caixa ${money(S.din)}</span><span class="tag">🎰 Slot</span></div><h2 class="pkh">Caça-níquel</h2>
   <div class="slots3 ${spinning?'spin':''}">${reels.map(r=>`<div class="reel">${r}</div>`).join('')}</div>
   <div class="muted" style="font-size:12.5px;text-align:center">3 iguais: 🏆 50x · 7️⃣ 25x · 💎 15x · outros 6x · 2 iguais: 1,5x</div>
   <div class="betrow"><span class="eyebrow">Aposta</span>${betOpts().map(v=>`<button class="lmbtn ${bet===v?'on':''}" data-b="${v}">${money(v)}</button>`).join('')}</div>
   <div class="pkres">${msg||''}</div><div class="actions"><button class="btn" id="sGo" ${!bet||S.din<bet||spinning||spins>=6?'disabled':''}>Girar</button><button class="btn ghost" id="sOut">Ir embora</button></div></div>`;
   $ov.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{bet=+b.dataset.b;draw(reels,msg)});
   const o=document.getElementById('sOut');if(o)o.onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res(SUM)};
   const g=document.getElementById('sGo');if(g)g.onclick=spin};
  const spin=async()=>{S.din-=bet;spins++;let reels=['❔','❔','❔'];
   const w=[3,4,3,2,1.2,.6];const pickS=()=>{const t=w.reduce((a,b)=>a+b,0);let x=rnd()*t;for(let i=0;i<6;i++){x-=w[i];if(x<=0)return SLOT[i]}return SLOT[0]};
   const fin=[pickS(),pickS(),pickS()];
   for(let k=0;k<(reduced?2:14);k++){reels=reels.map((r,i)=>k>=8+i*2?fin[i]:SLOT[RI(0,5)]);draw(reels,'',true);await sleep(70)}
   reels=fin;let mult=0;const[a,b,c]=fin;
   if(a===b&&b===c)mult=a==='🏆'?50:a==='7️⃣'?25:a==='💎'?15:6;else if(a===b||b===c||a===c)mult=1.5;
   const pay=bet*mult;S.din+=pay;net+=pay-bet;S.casino.net+=pay-bet;
   SUM.txt=net>=0?`Saiu do caça-níquel com ${money(net)} a mais.`:`Perdeu ${money(-net)} no caça-níquel.`;SUM.chips=[[`${net>=0?'+':'−'}${money(Math.abs(net))}`,net>=0?'up':'down']];
   draw(reels,mult>=6?`<span class="good">JACKPOT! +${money(pay)}</span>`:mult?`<span class="good">+${money(pay)}</span>`:`<span class="bad">Nada. −${money(bet)}</span>`)};
  draw(['❔','❔','❔'],'');
 });
}
// ---------- 21 (blackjack) ----------
function blackjack(){
 return new Promise(res=>{let bet=betOpts()[0]||0,net=0,hands=0;const SUM={txt:'Você foi embora sem jogar.',chips:[]};
  const card=()=>{const v=RI(1,13);return{v,n:v===1?'A':v>10?['J','Q','K'][v-11]:String(v),s:pick(['♠','♥','♦','♣'])}};
  const val=h=>{let s=0,a=0;for(const c of h){s+=c.v>10?10:c.v===1?11:c.v;if(c.v===1)a++}while(s>21&&a){s-=10;a--}return s};
  let P=[],D=[],phase='bet',msg='';
  const ch2=c=>`<span class="pcard ${c.s==='♥'||c.s==='♦'?'red':''}">${c.n}<small>${c.s}</small></span>`;
  const draw=()=>{$ov.hidden=false;$ov.innerHTML=`<div class="ovwrap casino-ov"><div class="row" style="justify-content:space-between"><span class="eyebrow">Mesa de 21 · caixa ${money(S.din)}</span><span class="tag">🃏 21</span></div><h2 class="pkh">Vinte e um</h2>
   <div class="bjrow"><span class="eyebrow">Banca ${phase==='end'?val(D):''}</span><div>${D.map((c,i)=>phase==='play'&&i===1?'<span class="pcard back">?</span>':ch2(c)).join('')}</div></div>
   <div class="bjrow"><span class="eyebrow">Você ${P.length?val(P):''}</span><div>${P.map(ch2).join('')}</div></div>
   <div class="pkres">${msg}</div>
   ${phase==='play'?`<div class="actions"><button class="btn" id="bHit">Pedir carta</button><button class="btn ghost" id="bStand">Parar</button></div>`:`<div class="betrow"><span class="eyebrow">Aposta</span>${betOpts().map(v=>`<button class="lmbtn ${bet===v?'on':''}" data-b="${v}">${money(v)}</button>`).join('')}</div><div class="actions"><button class="btn" id="bDeal" ${!bet||S.din<bet||hands>=5?'disabled':''}>Dar as cartas</button><button class="btn ghost" id="bOut">Ir embora</button></div>`}</div>`;
   $ov.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{bet=+b.dataset.b;draw()});
   const on=(id,f)=>{const e=document.getElementById(id);if(e)e.onclick=f};
   on('bOut',()=>{$ov.hidden=true;$ov.innerHTML='';res(SUM)});
   on('bDeal',()=>{S.din-=bet;hands++;P=[card(),card()];D=[card(),card()];phase='play';msg='';if(val(P)===21)return end();draw()});
   on('bHit',()=>{P.push(card());if(val(P)>21)return end();draw()});
   on('bStand',()=>end());
  };
  const end=()=>{while(val(D)<17)D.push(card());const p=val(P),d=val(D);let pay=0;
   if(p>21)msg='<span class="bad">Estourou!</span>';else if(p===21&&P.length===2&&!(d===21&&D.length===2)){pay=bet*2.5;msg='<span class="good">BLACKJACK!</span>'}else if(d>21||p>d){pay=bet*2;msg='<span class="good">Você ganhou!</span>'}else if(p===d){pay=bet;msg='Empate'}else msg='<span class="bad">A banca ganhou</span>';
   S.din+=pay;net+=pay-bet;S.casino.net+=pay-bet;phase='end';
   SUM.txt=net>=0?`Saiu da mesa de 21 com ${money(net)} a mais.`:`Perdeu ${money(-net)} no 21.`;SUM.chips=[[`${net>=0?'+':'−'}${money(Math.abs(net))}`,net>=0?'up':'down']];draw()};
  draw();
 });
}

// ---------- atividades da aba Vida ----------
const INSTR={violao:'🎸 Violão',pandeiro:'🪘 Pandeiro',bateria:'🥁 Bateria',teclado:'🎹 Teclado',cavaco:'🪕 Cavaquinho'};
function lifeActs(){
 ensureLife2();const A=[];const age=S.age;const m=S.music;
 A.push({g:'Hobbies',id:'luta',ic:'🥊',n:'Treino de luta',d:'Muay thai com um ex-campeão. Ganha físico, mas pode machucar.',t:1,c:.002});
 A.push({g:'Hobbies',id:'livro',ic:'📚',n:'Ler um livro',d:'Biografia de um craque. Cabeça mais forte.',t:1,c:0});
 A.push({g:'Hobbies',id:'idioma',ic:'🗣️',n:'Aula de idioma',d:'3 aulas e você aprende o básico.',t:1,c:.003});
 A.push({g:'Hobbies',id:'meditar',ic:'🧘',n:'Meditar',d:'Respira. A cabeça agradece.',t:1,c:0});
 A.push({g:'Hobbies',id:'redes',ic:'📱',n:'Postar nas redes',d:'Pode viralizar. Pode dar polêmica.',t:0,c:0});
 A.push({g:'Hobbies',id:'tattoo',ic:'🖋️',n:'Fazer uma tatuagem',d:'Fama sobe. Sua mãe não vai gostar.',t:1,c:.004});
 A.push({g:'Hobbies',id:'caridade',ic:'🤝',n:'Ação social',d:'Doar e visitar uma ONG.',t:1,c:.02});
 A.push({g:'Hobbies',id:'pesca',ic:'🎣',n:'Pescaria com os amigos',d:'Um dia longe de tudo.',t:1,c:.001});
 A.push({g:'Música',id:'praticar',ic:m.inst?INSTR[m.inst].split(' ')[0]:'🎵',n:m.inst?`Praticar ${INSTR[m.inst].split(' ')[1]}`:'Aprender um instrumento',d:m.inst?'Mini game de ritmo. Quanto melhor, mais você evolui.':'Escolha um instrumento e comece a tocar.',t:1,c:m.inst?0:.003,mg:true});
 if(m.lvl>=30)A.push({g:'Música',id:'pagode',ic:'🎤',n:'Tocar no pagode dos amigos',d:'A galera filma tudo.',t:1,c:0});
 if(m.lvl>=55)A.push({g:'Música',id:'gravar',ic:'💿',n:'Gravar uma música',d:'Estúdio de verdade. Pode estourar ou flopar.',t:1,c:.03});
 if(m.lvl>=85)A.push({g:'Música',id:'show',ic:'🏟️',n:'Fazer um show',d:'Casa cheia. Cachê alto.',t:2,c:0});
 if(age>=16){
  A.push({g:'Lado errado',id:'pichar',ic:'🎨',n:'Pichar o muro do rival',d:'A torcida ama. A polícia nem tanto.',t:1,c:0,crime:1});
  A.push({g:'Lado errado',id:'carro',ic:'🚗',n:'Tentar furtar um carro',d:'Mini game: destrave a fechadura e fuja.',t:1,c:0,crime:1,mg:true});
  A.push({g:'Lado errado',id:'bicho',ic:'🐍',n:'Bancar o jogo do bicho',d:'Dinheiro fácil, polícia atrás.',t:1,c:0,crime:1});
  A.push({g:'Lado errado',id:'trafico',ic:'💊',n:S.trafico?'Sair do esquema':'Entrar no esquema do tráfico',d:S.trafico?'Sair pode custar caro.':'Dinheiro toda semana. Se cair, a carreira cai junto.',t:1,c:0,crime:1});
  if(S.heat>=20)A.push({g:'Lado errado',id:'suborno',ic:'💼',n:'Molhar a mão do delegado',d:'Baixa a pressão da polícia.',t:0,c:Math.max(.05,S.heat/300),crime:1});
 }
 return A;
}
async function doLifeAct(id){
 ensureLife2();const m=S.music;let txt='',fx={};
 if(id==='luta'){if(ch(.85)){S.xp.FIS=(S.xp.FIS||0)+18;txt='Saiu mais forte do tatame.';fx={corpo:2,cab:2}}else{txt='Levou um chute na costela.';fx={inj:.05}}}
 else if(id==='livro'){S.xp.MEN=(S.xp.MEN||0)+15;txt='Leu de uma vez só. Ideias novas na cabeça.';fx={cab:3}}
 else if(id==='idioma'){S.hob.lang=(S.hob.lang||0)+1;const target=['en','es','it','fr','de'].find(l=>!S.langs.includes(l));if(S.hob.lang>=3&&target){S.hob.lang=0;txt='Formou no básico!';fx={lang:target,cab:2}}else{txt=`Aula ${S.hob.lang} de 3.`;fx={cab:1}}}
 else if(id==='meditar'){txt='Paz interior desbloqueada.';fx={cab:5,disc:1}}
 else if(id==='redes'){const r=rnd();if(r<.25){txt='Seu vídeo viralizou! Milhões de views.';fx={fama:6,cab:2}}else if(r<.45){txt='Polêmica! Interpretaram tudo errado.';fx={fama:2,board:-4,cab:-4}}else{txt='Poucos likes. A internet é cruel.';fx={cab:-1}}}
 else if(id==='tattoo'){txt=pick(['Tatuou o rosto da sua avó no braço.','Tatuou a taça da Champions nas costas. Ainda não ganhou.','Tatuou seu próprio número no pescoço.']);fx={fama:2,pais:-6}}
 else if(id==='caridade'){txt='As crianças da ONG vão lembrar desse dia pra sempre.';fx={fama:4,cab:4,board:3}}
 else if(id==='pesca'){txt=ch(.5)?'Pescou um tucunaré de 6 kg!':'Não pegou nada, mas riu muito.';fx={cab:4}}
 else if(id==='praticar'){
  if(!m.inst){return{pickInst:true}}
  const r=await mgRhythm({comp:'Música',title:`Ensaiando ${INSTR[m.inst].split(' ')[1]}`,sub:'Toque quando a nota passar pela linha.',notes:8,gap:Math.max(430,720-m.lvl*2.5),speed:.06});
  const g=Math.round(r.hits*1.6+r.perf);txt=r.ok?'Evoluiu no ensaio.':'Ensaio ruim, mas dá pra melhorar.';fx={music:Math.max(1,g),cab:2}}
 else if(id==='pagode'){txt=ch(.6)?'O vídeo do pagode bombou!':'Foi divertido, mas virou a noite.';fx={fama:3,cab:4,disc:-2,forma:-1}}
 else if(id==='gravar'){m.songs++;if(ch(.3+m.lvl/250)){txt='A música estourou! Tocando em todas as rádios.';fx={fama:8,din:.08+m.lvl/1000,cab:5}}else{txt='Flopou. Os comentários foram impiedosos.';fx={cab:-5,fama:1}}}
 else if(id==='show'){txt='Estádio lotado cantando sua música!';fx={fama:10,din:.4,cab:6,disc:-3,forma:-2}}
 else if(id==='pichar'){if(ch(.75)){txt='O muro amanheceu com o seu recado. A torcida rival surtou.';fx={fama:3,heat:8}}else{txt='Um guarda te viu correndo.';fx={heat:18,board:-3}}}
 else if(id==='carro'){
  const a=await mgLockpick({comp:'Madrugada',title:'Destrave a fechadura',sub:'Toque quando a agulha passar pela faixa verde.',pins:3,per:1250,w:38});
  if(a.ok){const v=R(.005,.04);txt=`Levou o carro e vendeu no desmanche por ${money(v)}.`;fx={din:v,heat:18,disc:-4}}
  else{const e=await mgEscape({comp:'Fuga',title:'A polícia chegou!',sub:'Escolha o lado certo pra escapar.',window:1400});
   if(e.ok){txt='Fugiu por pouco. Ninguém viu seu rosto… acha.';fx={heat:25,cab:-4}}else{txt='Te pegaram com a chave de fenda na mão.';fx={preso:RI(4,8),din:-.02}}}}
 else if(id==='bicho'){if(ch(.7)){const v=R(.01,.05);txt=`A banca rendeu ${money(v)} essa semana.`;fx={din:v,heat:12,disc:-2}}else{txt='Deu batida na banca. Você saiu pelos fundos.';fx={heat:22}}}
 else if(id==='trafico'){
  if(!S.trafico){S.trafico=true;txt='Você entrou no esquema. O dinheiro vai cair toda semana. A polícia também vai começar a olhar.';fx={heat:15,disc:-6,din:.03}}
  else{if(ch(.6)){S.trafico=false;txt='Você saiu. Pagou caro pelo silêncio.';fx={din:-Math.max(.05,S.din*.15),cab:-4,heat:-10}}else{txt='Os caras não deixaram você sair tão fácil. Ameaçaram sua família.';fx={cab:-10,pais:-10,heat:5}}}}
 else if(id==='suborno'){if(ch(.75)){txt='O delegado "esqueceu" seu nome.';fx={heat:-35}}else{txt='Era operação da corregedoria. Flagrante de suborno!';fx={preso:RI(6,12)}}}
 return{txt,chips:applyFx(fx)};
}
function lifeVidaHTML(){
 ensureLife2();const acts=lifeActs();const groups=[...new Set(acts.map(a=>a.g))];const m=S.music;
 const status=`<div class="vstat"><div><span>🎵 Música</span><b>${m.inst?INSTR[m.inst]:'—'} · nível ${Math.round(m.lvl)}</b><i><s style="width:${m.lvl}%"></s></i></div><div class="${S.heat>=40?'hot':''}"><span>🚨 Polícia de olho</span><b>${Math.round(S.heat)}${S.trafico?' · no esquema':''}</b><i><s style="width:${S.heat}%;background:var(--bad)"></s></i></div><div><span>📁 Ficha criminal</span><b>${S.ficha?S.ficha+' passagem'+(S.ficha>1?'s':''):'Limpa'}</b></div></div>`;
 const pickI=LIFE_PICKI?`<div class="card" style="display:grid;gap:8px"><b>Qual instrumento?</b><div class="relacts">${Object.entries(INSTR).map(([k,n])=>`<button class="relbtn" data-inst="${k}"><b>${n}</b></button>`).join('')}</div></div>`:'';
 return`<section class="card" style="display:grid;gap:12px">${status}${pickI}${groups.map(g=>`<div class="vgrp ${g==='Lado errado'?'crime':''}"><div class="eyebrow">${g==='Lado errado'?'⚠️ Lado errado · cada escolha tem consequência':g}</div><div class="relacts">${acts.filter(a=>a.g===g).map(a=>`<button class="relbtn" data-life="${a.id}" ${canPay(a.c,a.t)?'':'disabled'}><b>${a.ic} ${esc(a.n)}</b><span>${esc(a.d)}</span><em>${costLbl(a.c,a.t)}${a.mg?' · 🎮 mini game':''}</em></button>`).join('')}</div></div>`).join('')}</section>`;
}
let LIFE_PICKI=false;
function bindVida(){
 $app.querySelectorAll('[data-inst]').forEach(b=>b.onclick=()=>{S.music.inst=b.dataset.inst;LIFE_PICKI=false;S.din-=.003;LIFE_MSG={txt:`Comprou um ${INSTR[b.dataset.inst]}. Agora é praticar!`,chips:[]};lifeRefresh()});
 $app.querySelectorAll('[data-life]').forEach(b=>b.onclick=async()=>{const a=lifeActs().find(x=>x.id===b.dataset.life);if(!a||!canPay(a.c,a.t))return;
  if(a.id==='praticar'&&!S.music.inst){LIFE_PICKI=true;lifeRefresh();return}
  S.tempo-=a.t;S.din-=a.c;if(a.t)dayLog(a.ic,a.n);const r=await doLifeAct(a.id);LIFE_MSG=r;
  // XP vira atributo
  for(const k of ['FIS','MEN'])if((S.xp[k]||0)>=100){S.xp[k]-=100;S.attrs[k]=clamp(S.attrs[k]+1,1,99);LIFE_MSG.chips.push([`+1 ${ATTR_NAME[k]}`,'up'])}
  lifeRefresh();showPendingMoments()});
}
async function showPendingMoments(){ensureLife2();while(S.pendingMoments.length){const m=S.pendingMoments.shift();await momentUI(m)}}

// ---------- aba Vida na semana e na tela de vida ----------
const _weekHTML0=weekHTML;
weekHTML=function(){
 let h=_weekHTML0();
 h=h.replace('<button class="wact" id="wRest"',`<button class="wact ${WEEK_TAB==='vida'?'on':''}" data-wt="vida"><span>🎲</span>Vida</button><button class="wact" id="wRest"`);
 if(WEEK_TAB==='vida'){
  const today=S.tempo>0?DOWL[S.week.days[S.week.days.length-S.tempo]]:null;
  h=h.replace('<div class="wacts">',`${''}<div class="wacts">`);
  h+= `<div class="sheetbg" id="shBg"><div class="sheet" role="dialog" aria-label="Vida"><div class="shgrab"></div><div class="shhead"><div><b>🎲 Vida</b><span class="muted">${today?today+' · ':''}${S.tempo} dia${S.tempo===1?'':'s'} livre${S.tempo===1?'':'s'} · ${money(S.din)}</span></div><button class="shx" id="shX" aria-label="Fechar">✕</button></div>${LIFE_MSG?`<div class="outcome"><p>${esc(LIFE_MSG.txt)}</p><div class="chipsrow">${(LIFE_MSG.chips||[]).map(([t,k])=>`<span class="chip ${k}">${esc(t)}</span>`).join('')}</div></div>`:''}<div class="shbody">${lifeVidaHTML()}</div></div></div>`;
 }
 // decisão da semana
 const ev=S.week&&S.week.ev&&!S.week.evDone?WILD.find(e=>e.id===S.week.ev):null;
 if(ev){h=h.replace('<section class="card todo">',`<section class="card wildev"><div class="row"><span class="tag vida">Aconteceu</span><span class="eyebrow">decida agora</span></div><h3>${esc(ev.t)}</h3><p>${esc(S.week.evD||'')}</p><div class="choices">${ev.o.map((o,i)=>`<button class="choice" data-wild="${i}"><span>${esc(o[0])}</span><span class="arrow">→</span></button>`).join('')}</div></section><section class="card todo">`)}
 return h;
};
const _bindWeek0=bindWeek;
bindWeek=function(){_bindWeek0();bindVida();
 $app.querySelectorAll('[data-wild]').forEach(b=>b.onclick=()=>{const ev=WILD.find(e=>e.id===S.week.ev);const[txt,fx]=ev.o[+b.dataset.wild][1]();S.week.evDone=true;LIFE_MSG={txt,chips:applyFx(fx)};(S.st.evlog=S.st.evlog||[]).push({t:ev.t,txt});KEEPSC=true;renderHub();showPendingMoments()});
 if(S.pendingMoments&&S.pendingMoments.length)showPendingMoments();
};
const _newWeek0=newWeek;
newWeek=function(){_newWeek0();ensureLife2();const pool=WILD.filter(e=>(!e.a||(S.age>=e.a[0]&&S.age<=e.a[1]))&&(!e.c||e.c())&&!(S.wildSeen||[]).includes(e.id));
 if(pool.length&&ch(.4)){const e=pick(pool);S.week.ev=e.id;S.week.evD=typeof e.d==='function'?e.d():e.d;S.wildSeen=(S.wildSeen||[]).concat(e.id).slice(-40)}};
// tela de vida (pré-temporada) ganha a aba
const _renderLife0=renderLife;
renderLife=function(){_renderLife0();const tabs=$app.querySelector('.tabs');if(tabs&&!tabs.querySelector('[data-lt="vida"]'))tabs.insertAdjacentHTML('beforeend',`<button class="tab ${LIFE_TAB==='vida'?'on':''}" data-lt="vida">Vida</button>`);
 const vb=tabs&&tabs.querySelector('[data-lt="vida"]');if(vb)vb.onclick=()=>{LIFE_TAB='vida';LIFE_MSG=null;renderLife()};
 if(LIFE_TAB==='vida'){tabs.nextElementSibling&&tabs.nextElementSibling.remove();tabs.insertAdjacentHTML('afterend',lifeVidaHTML());bindVida()}};
// cassino ganha slot e 21
const _casinoHTML0=casinoHTML;
casinoHTML=function(){let h=_casinoHTML0();return h.replace('</div></section>',`<button class="casg" data-cas2="slot" ${S.tempo>=1?'':'disabled'}><span>🎰</span><b>Caça-níquel</b><small>3 iguais = jackpot</small></button><button class="casg" data-cas2="bj" ${S.tempo>=1?'':'disabled'}><span>🃏</span><b>Vinte e um</b><small>Chegue perto de 21</small></button></div></section>`)};
const _bindLife0=bindLife;
bindLife=function(){_bindLife0();$app.querySelectorAll('[data-cas2]').forEach(b=>b.onclick=async()=>{if(S.tempo<1)return;S.tempo-=1;S.casino.visits++;dayLog('🎰','Cassino');const chips=applyFx({disc:-2});const r=b.dataset.cas2==='slot'?await slotMachine():await blackjack();LIFE_MSG={txt:r.txt,chips:[...chips,...(r.chips||[])]};lifeRefresh()})};

// ---------- decisões malucas ----------
const WILD=[
{id:'sheik',a:[18,40],t:'Proposta do sheik',d:'Um sheik quer comprar sua chuteira usada por €200 mil. Mas só se você entregar descalço, ao vivo, numa live.',o:[['Aceitar e fazer a live',()=>['A live bateu recorde. Você ficou famoso no mundo árabe.',{din:.2,fama:6,board:-3}]],['Recusar com classe',()=>['O sheik respeitou. Mandou um camelo de presente.',{cab:3}]]]},
{id:'et',t:'Luz estranha no céu',d:'Voltando do treino, uma luz fortíssima para em cima do seu carro.',o:[['Parar e acenar',()=>ch(.5)?['Nada aconteceu, mas você acordou chutando com as duas pernas.',{ovr:1,cab:-2}]:['Você perdeu 3 horas de memória e o treino seguinte.',{forma:-2,coach:-5}]],['Acelerar e fugir',()=>['Multa por excesso de velocidade.',{din:-.002,heat:3}]]]},
{id:'macumba',t:'Despacho na porta',d:'Apareceu uma galinha preta, farofa e velas na porta da sua casa. Bilhete: "pro artilheiro rival".',o:[['Chamar um pai de santo pra desfazer',()=>['Corpo fechado. Você se sente invencível.',{cab:6,din:-.003}]],['Ignorar e postar rindo',()=>ch(.5)?['Virou meme, a torcida amou.',{fama:4}]:['Na semana seguinte, torceu o tornozelo.',{inj:.06,cab:-4}]]]},
{id:'bbb',a:[18,40],t:'Convite do reality',d:'Um reality show quer você no elenco no meio da temporada.',o:[['Aceitar (largar o futebol por 3 meses)',()=>['Ganhou milhões de seguidores e perdeu a vaga no time.',{fama:15,coach:-25,board:-15,forma:-4,din:.15}]],['Recusar',()=>['O técnico gostou do compromisso.',{coach:6}],1]]},
{id:'mega',t:'Bilhete premiado',d:'Seu tio jura que o bilhete da Mega-Sena que vocês dividiram deu a quina.',o:[['Ir com ele conferir',()=>ch(.4)?['Deu mesmo! Dividiram o prêmio.',{din:.12,cab:5}]:['Era o concurso da semana passada.',{cab:-2}]],['Deixar ele resolver',()=>ch(.5)?['Ele sumiu com o prêmio.',{pais:-8,cab:-3}]:['Ele te deu sua parte.',{din:.05}]]]},
{id:'funk',a:[16,40],t:'Feat com MC',d:'Um MC famoso quer gravar um funk com você cantando o refrão.',o:[['Gravar',()=>ch(.5)?['Hit do verão! Tocou até no vestiário.',{fama:8,din:.05,music:10}]:['Desafinou feio. Virou piada.',{fama:2,cab:-4}]],['Só aparecer no clipe',()=>['Clipe com 50 milhões de views.',{fama:5}]],['Recusar',()=>['Foco total.',{disc:2}]]]},
{id:'boxe',a:[18,40],t:'Desafio de luta',d:'Um influencer te desafiou pra uma luta de boxe beneficente. Valendo €300 mil.',o:[['Aceitar e treinar',()=>ch(.55)?['Nocaute no 2º round!',{fama:10,din:.3,corpo:-3}]:['Apanhou feio e quebrou o nariz.',{inj:.12,fama:4,din:.1}]],['Recusar',()=>['Ele te chamou de amarelão nas redes.',{fama:-2,cab:-2}]]]},
{id:'harmon',a:[18,40],t:'Harmonização facial',d:'Seu empresário acha que você precisa de "um rosto mais vendável".',o:[['Fazer',()=>ch(.5)?['Ficou bonitão. Patrocínio novo.',{fama:5,din:.04}]:['Ficou irreconhecível. Memes por semanas.',{fama:3,cab:-6}]],['Tô bem assim',()=>['Autoestima em dia.',{cab:3}],1]]},
{id:'varzea',a:[20,40],t:'Comprar um time de várzea',d:'O time do seu bairro está quebrando. Por €80 mil ele vira seu.',o:[['Comprar',()=>['Agora você é dono do Unidos da Quebrada. A comunidade te idolatra.',{din:-.08,fama:4,cab:6}]],['Patrocinar só a camisa',()=>['Seu nome na camisa do time do bairro.',{din:-.01,fama:2,cab:3}]],['Deixar pra lá',()=>['O campo virou estacionamento.',{cab:-3}]]]},
{id:'cripto',a:[18,40],t:'Moeda digital',d:'Um amigo quer lançar a "Fome Coin" com a sua cara.',o:[['Lançar',()=>ch(.35)?['A moeda subiu 4000%. Você vendeu no topo.',{din:.5,fama:3}]:['Rug pull. Os torcedores perderam dinheiro e culpam você.',{fama:-8,board:-6,heat:15}]],['Recusar',()=>['Sábio.',{disc:2}],1]]},
{id:'vidente',t:'A vidente',d:'Uma vidente te parou na rua: "Vejo uma lesão no seu joelho direito".',o:[['Pagar pra ela "proteger"',()=>['Ela acendeu uma vela. Você se sentiu protegido.',{din:-.001,cab:3}]],['Rir e seguir',()=>ch(.2)?['Três dias depois… o joelho.',{inj:.08}]:['Nada aconteceu.',{}]]]},
{id:'transito',a:[18,40],t:'Briga no trânsito',d:'Um motorista bateu no seu carro e saiu xingando sua mãe.',o:[['Descer e tirar satisfação',()=>ch(.5)?['Virou vídeo viral de briga. A diretoria odiou.',{fama:3,board:-8,heat:8}]:['Ele te reconheceu e pediu foto.',{fama:1}]],['Respirar e chamar o seguro',()=>['Resolvido. Cabeça no lugar.',{disc:3}],1]]},
{id:'leao',a:[22,40],t:'Um leão de estimação',d:'Um jogador famoso tem um tigre. Você pode comprar um filhote de leão.',o:[['Comprar o leão',()=>ch(.5)?['O leão virou mascote da torcida.',{fama:6,din:-.15}]:['O Ibama apreendeu. Multa e escândalo.',{din:-.1,fama:-4,heat:10}]],['Adotar um vira-lata',()=>['O Caramelo virou estrela nas suas redes.',{fama:3,cab:5}],1]]},
{id:'promessa',t:'Promessa',d:'Você prometeu subir a escadaria da igreja de joelhos se fizesse gol no clássico. Fez.',o:[['Cumprir a promessa',()=>['Os joelhos sofreram, a alma ficou leve.',{cab:6,corpo:-2}]],['Esquecer',()=>['Na rodada seguinte, bola na trave três vezes.',{cab:-4,forma:-1}]]]},
{id:'ladrao',a:[18,40],t:'Invasão em casa',d:'Ladrões entraram na sua casa durante o jogo e levaram suas medalhas.',o:[['Oferecer recompensa nas redes',()=>ch(.6)?['Devolveram tudo com bilhete de desculpas.',{fama:2,din:-.01}]:['Ninguém apareceu.',{cab:-5}]],['Contratar seguranças',()=>['Casa blindada.',{din:-.03,cab:2}]]]},
{id:'sosia',a:[19,40],t:'Seu sósia',d:'Um sósia seu está aplicando golpes usando seu nome.',o:[['Processar',()=>['Ganhou na justiça. Ele virou seu fã.',{din:.01,cab:2}]],['Contratar ele como dublê',()=>['Agora ele vai nos eventos chatos no seu lugar.',{cab:5,fama:-1}]]]},
{id:'nome',t:'Mudar de nome?',d:'Seu empresário sugere mudar seu nome artístico pra algo mais "marcante".',o:[['Virar "Fominha"',()=>['Pegou! A narração ama.',{fama:4}]],['Manter o nome',()=>['Nome de família, com orgulho.',{pais:6,cab:2}],1]]},
{id:'organizada',a:[17,40],c:()=>S.st&&S.st.forma<0,t:'Visita da organizada',d:'Membros da organizada apareceram no CT cobrando raça depois da má fase.',o:[['Encarar e conversar',()=>ch(.6)?['Saíram de lá te aplaudindo.',{cab:4,fama:2}]:['Bateram boca. Saiu na TV.',{cab:-6,board:-4}]],['Sair pelos fundos',()=>['Te chamaram de covarde nas faixas.',{fama:-3,cab:-3}]]]},
{id:'heranca',t:'Herança misteriosa',d:'Um advogado diz que um tio-avô que você nunca conheceu te deixou uma fazenda… com dívidas.',o:[['Aceitar a herança',()=>ch(.5)?['A fazenda valia mais que as dívidas!',{din:.25}]:['As dívidas eram maiores.',{din:-.1,cab:-4}]],['Recusar',()=>['Nada muda.',{}]]]},
{id:'tiktok',a:[15,40],t:'Dancinha',d:'Seu time quer que você faça a dancinha do momento depois do gol.',o:[['Fazer a dancinha',()=>ch(.6)?['Viralizou. Até o técnico dançou.',{fama:5,coach:2}]:['Errou o passo. Virou meme eterno.',{fama:3,cab:-3}]],['Comemoração clássica',()=>['Respeito.',{}]]]},
{id:'policia_porta',c:()=>S.heat>=35,t:'Batida na porta',d:'São 6 da manhã. Tem polícia na porta com um mandado.',o:[['Abrir e colaborar',()=>ch(.5)?['Não acharam nada. Mas a imprensa viu tudo.',{fama:-6,board:-8,heat:-15}]:['Acharam provas.',{preso:RI(5,10)}]],['Fugir pelos fundos',()=>ch(.4)?['Escapou… por enquanto.',{heat:20,cab:-8}]:['Te pegaram no muro.',{preso:RI(8,14)}]],['Ligar pro advogado',()=>['O advogado resolveu, mas cobrou caro.',{din:-Math.max(.05,S.din*.1),heat:-20}],1]]},
{id:'chefao',c:()=>S.trafico,t:'Recado do chefão',d:'O chefão do esquema quer que você "esqueça" uma bola pra entregar o jogo de domingo.',o:[['Obedecer',()=>['Vocês perderam. Ninguém desconfiou… ainda.',{din:.06,cab:-8,heat:15,coach:-8}]],['Recusar',()=>ch(.5)?['Ele respeitou sua coragem.',{cab:2}]:['Ameaças de morte. Você vive com segurança armada.',{cab:-12,din:-.02}]],['Denunciar tudo',()=>{S.trafico=false;return['Delação premiada. Fora do esquema, mas jurado.',{heat:-40,cab:-6,fama:-3}]}]]},
{id:'onlyfan',a:[18,40],t:'Proposta indecente',d:'Uma marca de cueca quer você numa campanha em outdoor gigante na avenida principal.',o:[['Topar',()=>['Parou o trânsito. Literalmente.',{fama:7,din:.06,pais:-4}]],['Só de chuteira e meião',()=>['Campanha divertida, todo mundo gostou.',{fama:3,din:.03}]],['Recusar',()=>['Sua mãe agradece.',{pais:5}]]]},
{id:'avo',t:'Ligação da avó',d:'Sua avó ligou dizendo que viu você "jogando mole" na TV.',o:[['Prometer um gol pra ela',()=>['Motivação extra.',{forma:2,cab:3}],1],['Explicar a tática',()=>['Ela dormiu no meio da explicação.',{cab:1}]]]},
{id:'chuteira_rosa',t:'Chuteira rosa',d:'A marca mandou uma chuteira rosa-choque com glitter.',o:[['Jogar com ela',()=>ch(.5)?['Fez gol e a chuteira esgotou.',{fama:4,din:.02}]:['Jogou mal. "Culpa da chuteira", disse a imprensa.',{cab:-3}]],['Devolver',()=>['Preto básico.',{}]]]},
];
EV.push(...WILD.filter(w=>!['policia_porta','chefao'].includes(w.id)).slice(0,10).map(w=>({...w,id:'w_'+w.id,k:'vida',a:w.a||[16,40],c:w.c||(()=>true),d:()=>typeof w.d==='function'?w.d():w.d})));

// ---------- abertura da peneira ----------
function penWelcome(){
 return new Promise(res=>{
  $ov.hidden=false;const nat=NATS[S.nat];
  $ov.innerHTML=`<div class="ovwrap celeb penwel"><div class="rays"></div><div class="spot"></div>
  <div class="gates"><i></i><i></i></div>
  <div class="eyebrow">Capítulo 1</div>
  <div class="whistle" style="font-size:clamp(34px,10vw,52px)">BEM-VINDO<br>À PENEIRA</div>
  <div class="pcardw"><div class="pc-top"><b class="mono">${S.ovr}</b><span>${S.pos}</span><span class="pc-flag">${nat.f}</span></div><div class="pc-name">${esc(S.name)}</div><div class="pc-sub">#${S.num} · 15 anos · ${esc(POS[S.pos].n)}</div><div class="pc-pot">Potencial ${'★'.repeat(Math.round(prospectStars(S.pot)))}</div></div>
  <p class="muted" style="margin:10px 0 14px">Centenas de garotos. Poucas vagas. Os olheiros estão na arquibancada.<br><b style="color:var(--chalk)">Mostre quem você é.</b></p>
  <button class="btn wide" id="celOk">Entrar em campo</button></div>`;
  document.getElementById('celOk').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res()};
 });
}
const _startPen0=startPeneira;
startPeneira=async function(){PEN.celebrated=false;await penWelcome();_startPen0()};
const _penResult0=peneiraResult;
peneiraResult=function(...a){const r=_penResult0.apply(this,a);try{if(PEN.interested&&PEN.interested.length&&!PEN.celebrated){PEN.celebrated=true;momentUI({k:'aprovado',emoji:'✅',eyebrow:'Peneira',big:'APROVADO!',title:`${PEN.interested.length} clube${PEN.interested.length>1?'s':''} quer${PEN.interested.length>1?'em':''} você`,lines:PEN.interested.map(c=>c.n)})}}catch(e){}return r};
