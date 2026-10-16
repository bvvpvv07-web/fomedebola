// ================== TORCIDA + VIDA PESSOAL COM PESO ==================
function fansOf(id){S.fans=S.fans||{};if(id&&S.fans[id]==null){S.fans[id]=(S.heart===id?65:50)+(S.idols&&S.idols.includes(id)?20:0)}return id?S.fans[id]:50}
function fansCur(){return S&&S.club?fansOf(S.club):50}
function fansAdd(d,id){id=id||(S&&S.club);if(!id)return 0;const v=fansOf(id);S.fans[id]=clamp(v+d,0,100);return S.fans[id]-v}
function fansMood(v){return v>=85?['Ídolo da arquibancada','#f2c443']:v>=65?['Te apoia','#6fdc8c']:v>=40?['Desconfiada','#cfd6c8']:v>=20?['Na bronca','#ff9a5a']:['Pede sua saída','#ff5a4a']}
// humor geral da vida: pesa em campo
function lifeMod(){if(!S||!S.life)return 0;const L=S.life;let m=(L.cab-55)/40+(L.corpo-60)/55+((S.pais??70)-55)/160+(fansCur()-50)/120;
 if(S.gf)m+=(S.gf.v-50)/130;if(S.st&&S.st.injLeft>0)m-=.2;return clamp(m,-1,1)}
function lifeImpact(){return Math.round(lifeMod()*6)/10} // até ±0,6 na nota
// nota e lances sentem a vida
const _playMineT=playMine;playMine=async function(o,io){const r=await _playMineT(o,io);try{
 if(r&&r.me&&r.me.play&&r.me.nota!=null&&!(typeof HIDDEN_PRO!=='undefined'&&HIDDEN_PRO)){r.me.nota=Math.round(clamp(r.me.nota+lifeImpact(),3,10)*10)/10;
  if((o.kind||'club')==='club'&&!S.youth){const win=r.gu>r.gt,loss=r.gu<r.gt;let d=(r.me.nota-6.6)*1.7+r.me.g*1.3+r.me.a*.6+(win?.6:loss?-.5:0)+(r.me.r?-3:0);
   if(o.label&&/Final/i.test(o.label))d*=2;d*=.3;const v=fansCur();d*=d>0?Math.max(.15,1-v/115):(.45+v/110);fansAdd(d)}}
 else if(r&&r.me&&!r.me.play&&(o.kind||'club')==='club'&&!S.youth&&r.me.why==='banco')fansAdd(-.15);
}catch(e){}return r};
if(typeof skillOf==='function'){const _skT=skillOf;skillOf=function(k){return clamp(_skT(k)+lifeMod()*.06,.08,.98)}}
// torcida mexe na escalação
const _partT=participation;participation=function(kind,o){const r=_partT(kind,o);try{if(kind==='club'&&!r.play&&r.why==='banco'&&fansCur()>=80&&ch(.18))return{play:true,start:false,min:RI(10,30),role:r.role,fans:true};
 if(kind==='club'&&r.play&&r.start&&fansCur()<18&&ch(.25))return{play:true,start:false,min:RI(8,25),role:r.role}}catch(e){}return r};
// efeitos fora de campo também mexem com a torcida
const _applyFxT=applyFx;applyFx=function(fx){const chips=_applyFxT(fx);try{if(fx&&S&&S.club&&!S.youth){let d=fx.torc||0;if(fx.preso)d-=15;if(fx.fama&&fx.fama<0)d+=fx.fama*.6;if(fx.board&&fx.board<=-6)d-=2;
 if(d){const got=fansAdd(d);if(Math.round(got))chips.push([`${got>0?'+':'−'}${Math.abs(Math.round(got))} Torcida`,got>0?'up':'down'])}}}catch(e){}return chips};
// trocou de clube: a nova torcida começa do zero (mas lembra de quem já foi ídolo)
const _acceptT=acceptOffer;acceptOffer=function(o){const r=_acceptT(o);try{fansOf(S.club)}catch(e){}return r};
// fim de temporada: veredito da torcida
const _endT=endSeason;endSeason=function(){const id=S.club;const wasYouth=S.youth;const ls=_endT();try{
 if(!ls||wasYouth||!id)return ls;const v0=fansOf(id);
 const T=(ls.titles||[]).filter(t=>t.t!=='base');fansAdd(T.length*7,id);if(ls.myMove&&ls.myMove.dir==='down')fansAdd(-10,id);if(ls.myMove&&ls.myMove.dir==='up')fansAdd(6,id);
 const v=fansOf(id);const c=CLUB[id];const seasons=(S.clubs[id]&&S.clubs[id].seasons)||0;ls.fans={from:Math.round(v0),to:Math.round(v)};
 // ídolo pela arquibancada
 if(v>=88&&seasons>=3&&!S.idols.includes(id)){S.idols.push(id);S.life.fama=clamp(S.life.fama+8,0,100);ls.news.push({t:'idolo',club:id,txt:`A torcida do ${c.n} te elegeu ídolo. Seu nome virou música na arquibancada.`})}
 if(v>=96&&seasons>=8&&S.idols.includes(id)&&!S.statues.includes(id)){S.statues.push(id);ls.news.push({t:'estatua',club:id,txt:`Uma campanha da torcida vai erguer sua estátua na porta do estádio do ${c.n}.`})}
 // a torcida te tira do time…
 if(v<15&&!S.loan){S.flags.release=true;S.board=clamp(S.board-10,0,100);ls.news.push({t:'torcida',club:id,txt:`A torcida do ${c.n} pichou o muro do CT pedindo sua saída. A diretoria vai te negociar.`})}
 // …ou te salva
 else if(v>=72&&(S.flags.release||S.board<25||S.life.disc<30)){S.flags.release=false;S.flags.fanSaved=true;S.board=clamp(S.board+15,0,100);ls.news.push({t:'torcida',club:id,txt:`A diretoria pensou em te vender, mas a torcida do ${c.n} fez um abaixo-assinado com milhares de nomes. Você fica.`})}
}catch(e){console.error(e)}return ls};
// a torcida também protege na janela
const _wsT=windowState;windowState=function(){const r=_wsT();try{if(r.release&&S.flags.release!=='youth'&&fansCur()>=72){r.release=false;r.stay=true}}catch(e){}return r};

// ---------- eventos da torcida ----------
EV.push(
{id:'protesto',k:'vida',a:[18,40],c:()=>!S.youth&&fansCur()<30,t:'Protesto no CT',d:()=>`Uns cem torcedores do ${club().n} cercaram o CT. Faixas com seu nome riscado.`,o:[
 ['Descer e conversar com eles',()=>ch(.55)?['Você ouviu, prometeu suor. Alguns até aplaudiram.',{torc:12,cab:-2}]:['Viraram as costas e continuaram gritando.',{torc:-4,cab:-6}],1],
 ['Sair pelos fundos',()=>['Escapou, mas a foto do carro saindo virou meme.',{torc:-6,cab:-3}]],
 ['Mandar um recado duro nas redes',()=>ch(.25)?['Parte da torcida gostou da personalidade.',{torc:6,fama:4}]:['Jogou gasolina no fogo.',{torc:-14,board:-5}]]]},
{id:'faixa',k:'vida',a:[18,40],c:()=>!S.youth&&fansCur()>=75,t:'Faixa no estádio',d:()=>`A organizada do ${club().n} estendeu uma faixa gigante com seu rosto.`,o:[
 ['Agradecer beijando o escudo',()=>['A arquibancada veio abaixo.',{torc:6,cab:4,fama:2}],1],
 ['Tirar foto com a faixa e postar',()=>['Milhões de curtidas.',{fama:5,torc:3}]],
 ['Ficar na sua',()=>['Humildade também agrada.',{torc:2}]]]},
{id:'rival',k:'vida',a:[18,40],c:()=>!S.youth,t:'Provocação do rival',d:()=>'O maior rival publicou um vídeo zoando você depois do último clássico.',o:[
 ['Responder com deboche',()=>ch(.5)?['Sua torcida amou. A deles, odiou.',{torc:8,fama:3,disc:-2}]:['Virou polêmica e o técnico te chamou.',{torc:3,disc:-5,board:-3}]],
 ['Responder dentro de campo',()=>['Guardou pra quando a bola rolar.',{forma:2,cab:2}],1],
 ['Ignorar',()=>['Postura de profissional.',{disc:2}]]]},
{id:'crianca',k:'vida',a:[17,40],c:()=>!S.youth,t:'O menino da arquibancada',d:()=>'No fim do jogo, um menino chora na grade segurando um cartaz: "ME DÁ SUA CAMISA?"',o:[
 ['Pular a placa e entregar a camisa',()=>['O vídeo rodou o país. A torcida te adotou.',{torc:9,fama:4,cab:3}],1],
 ['Jogar a camisa de longe',()=>['Um adulto pegou antes dele.',{torc:-2}]],
 ['Ir pro vestiário',()=>['Ninguém viu. Ou quase ninguém.',{}]]]},
{id:'aeroporto',k:'vida',a:[18,40],c:()=>!S.youth&&fansCur()<45&&S.st&&S.st.forma<0,t:'Cobrança no aeroporto',d:()=>'Na volta de uma derrota, torcedores esperam o elenco no desembarque.',o:[
 ['Parar e ouvir a cobrança',()=>['Ouviu calado. Respeitaram.',{torc:6,cab:-3}],1],
 ['Passar de fone e capuz',()=>['"Mercenário!" ecoou no saguão.',{torc:-7}]],
 ['Bater boca',()=>['A polícia teve que separar.',{torc:-12,disc:-6,heat:5}]]]}
);

// ---------- MINIGAMES DA VIDA ----------
function lifeFrame(o,inner){$ov.hidden=false;$ov.innerHTML=`<div class="ovwrap lifemg ${o.cls||''}"><div class="lm-top"><span class="tag vida">${esc(o.tag)}</span><span class="eyebrow">${esc(o.sub||'')}</span></div><h2 class="pkh">${esc(o.title)}</h2><p class="lm-hint">${o.hint}</p>${inner}<div class="pkres" id="mgRes"></div></div>`}
// 1) Sessão de autógrafos: toque nos torcedores antes de irem embora
function mgAutografos(){return new Promise(res=>{
 lifeFrame({tag:'Torcida',sub:'Sessão de autógrafos',title:'Fila de autógrafos',hint:'Toque nas <b>camisas e cadernos</b> antes que o torcedor desista. Cuidado com o <b>📸 paparazzi</b>.'},`<div class="aut" id="aut"><div class="aut-hud"><span id="autT">⏱ 15</span><span id="autS">✍️ 0</span><span id="autC"></span></div></div>`);
 const box=document.getElementById('aut');let score=0,miss=0,combo=0,t=15,done=false;const items=['👕','📓','⚽','🧢','🖼️','👕'];
 const spawn=()=>{if(done)return;const bad=ch(.14);const e=document.createElement('button');e.className='autit'+(bad?' bad':'');e.textContent=bad?'📸':items[(Math.random()*items.length)|0];
  e.style.left=R(4,80)+'%';e.style.top=R(16,78)+'%';const life=R(900,1500)-Math.min(400,score*12);e.style.setProperty('--life',life+'ms');box.appendChild(e);
  const kill=setTimeout(()=>{if(e.isConnected){e.remove();if(!bad){miss++;combo=0;upd()}}},life);
  e.onpointerdown=ev=>{ev.preventDefault();clearTimeout(kill);if(bad){score=Math.max(0,score-3);combo=0;SFX.tone({f:200,dur:.2,gain:.15,type:'square'});e.classList.add('hitbad')}else{combo++;score+=1+(combo>=5?1:0);SFX.tone({f:600+combo*40,dur:.08,gain:.1});e.classList.add('hit')}setTimeout(()=>e.remove(),220);upd()}};
 const upd=()=>{(document.getElementById('autS')||{}).textContent='✍️ '+score;(document.getElementById('autC')||{}).textContent=combo>=5?`🔥 x${combo}`:''};
 const sp=setInterval(spawn,430);const tm=setInterval(()=>{t--;(document.getElementById('autT')||{}).textContent='⏱ '+t;if(t<=0)end()},1000);
 function end(){if(done)return;done=true;clearInterval(sp);clearInterval(tm);const ok=score>=14;swEnd(ok,`${score} autógrafos`,score>=22).then(()=>res({score,ok,perfect:score>=22}))}
})}
// 2) Coletiva de imprensa: responda antes do tempo acabar
const PRESS_Q=[
 {q:'"O time não vem bem. A culpa é do técnico?"',a:[['Todo mundo tem culpa, eu também.',{torc:4,coach:6}],['Algumas escolhas não ajudam.',{coach:-10,fama:3,torc:2}],['Pergunta pra ele, ué.',{coach:-6,fama:4,torc:-2}]]},
 {q:'"Você sairia do clube por uma proposta melhor?"',a:[['Aqui é minha casa.',{torc:8,board:3}],['Futebol é dinâmico, nunca se sabe.',{torc:-6,fama:2}],['Meu empresário cuida disso.',{torc:-3}]]},
 {q:'"O que achou da provocação do rival?"',a:[['Respondo em campo.',{torc:5,disc:2}],['Eles vivem falando da gente.',{torc:7,fama:3,disc:-2}],['Nem vi.',{torc:1}]]},
 {q:'"E a vida fora de campo? Foi visto na balada…"',a:[['Folga é folga, mas sou profissional.',{board:2,torc:2}],['Minha vida pessoal não é assunto.',{fama:2,torc:-1}],['Tava comemorando o gol, ué!',{fama:4,torc:3,board:-4}]]},
 {q:'"Qual é o seu sonho no futebol?"',a:[['Ganhar tudo com essa camisa.',{torc:7}],['Seleção e Bola de Ouro.',{fama:4}],['Dar uma casa pros meus pais.',{cab:3,torc:3}]]},
 {q:'"A torcida vaiou você no último jogo. Magoou?"',a:[['Eles têm o direito. Vou virar o jogo.',{torc:8,cab:-1}],['Magoou sim, sou humano.',{torc:2,cab:2}],['Vaia de quem não joga não me afeta.',{torc:-12,fama:3}]]},
];
function mgColetiva(){return new Promise(res=>{
 const qs=shuffle(PRESS_Q.slice()).slice(0,3);let i=0;const tot={};let late=0;
 const step=()=>{if(i>=qs.length){const tor=tot.torc||0;swEnd(tor>=6,tor>=6?'A coletiva repercutiu bem':'Foi uma coletiva morna',tor>=14).then(()=>res({fx:tot,late}));return}
  const q=qs[i];const T=4500;
  lifeFrame({tag:'Imprensa',sub:`Pergunta ${i+1} de ${qs.length}`,title:'Coletiva de imprensa',hint:'Responda <b>antes do tempo acabar</b>. Silêncio pega mal.',cls:'press'},
   `<div class="press-mics">🎙️🎙️🎙️</div><div class="press-q">${esc(q.q)}</div><div class="press-t"><i id="prT"></i></div><div class="choices">${shuffle(q.a.map((a,j)=>[a,j])).map(([a,j])=>`<button class="choice" data-pa="${j}"><span>${esc(a[0])}</span><span class="arrow">→</span></button>`).join('')}</div>`);
  const bar=document.getElementById('prT');bar.style.transition=`width ${T}ms linear`;requestAnimationFrame(()=>requestAnimationFrame(()=>bar.style.width='0%'));
  let ans=false;const to=setTimeout(()=>{if(ans)return;ans=true;late++;tot.torc=(tot.torc||0)-3;tot.fama=(tot.fama||0)-1;toast({ic:'😶',title:'Silêncio constrangedor',ms:1500});i++;setTimeout(step,500)},T);
  $ov.querySelectorAll('[data-pa]').forEach(b=>b.onclick=()=>{if(ans)return;ans=true;clearTimeout(to);const fx=q.a[+b.dataset.pa][1];for(const k in fx)tot[k]=(tot[k]||0)+fx[k];b.classList.add('picked');SFX.tone({f:520,dur:.1,gain:.08});i++;setTimeout(step,450)})};
 step();
})}
// 3) Encontro: toque quando o coração estiver no ponto
function mgEncontro(name){return new Promise(res=>{
 lifeFrame({tag:'Amor',sub:name?`Encontro com ${name}`:'Primeiro encontro',title:name?'Noite a dois':'Puxar conversa',hint:'Toque quando o coração <b>encher o anel dourado</b>. 5 momentos da noite.',cls:'date'},
  `<div class="date-st"><div class="date-ring"></div><div class="date-heart" id="dh">❤️</div></div><div class="date-lines" id="dl"></div><button class="btn wide" id="dTap">Agora!</button>`);
 const lines=['Elogio na hora certa','Piada que funcionou','Escutou com atenção','Pediu a sobremesa certa','Despedida perfeita'];
 const lbad=['Falou de futebol demais','Olhou o celular','Silêncio esquisito','Esqueceu o nome do cachorro dela','Tropeçou na saída'];
 let k=0,good=0,t0=performance.now();const per=1100;const h=document.getElementById('dh');let raf;
 const loop=now=>{const ph=((now-t0)%per)/per;const sc=.55+.75*Math.sin(ph*Math.PI);h.style.transform=`scale(${sc})`;h.dataset.sc=sc;raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
 const tap=()=>{if(k>=5)return;const sc=+h.dataset.sc;const ok=sc>1.12;if(ok)good++;document.getElementById('dl').insertAdjacentHTML('beforeend',`<span class="chip ${ok?'up':'down'}">${ok?'💘 '+lines[k]:'💔 '+lbad[k]}</span>`);SFX.tone({f:ok?660:180,dur:.12,gain:.12,type:ok?'sine':'square'});k++;
  if(k>=5){cancelAnimationFrame(raf);swEnd(good>=3,good>=4?'Noite perfeita':good>=3?'Rolou química':'Não foi dessa vez',good===5).then(()=>res({good}))}};
 document.getElementById('dTap').onclick=tap;h.onclick=tap;
})}
// ações novas nas relações
const _relActT=relActions;relActions=function(){const a=_relActT();try{
 if(S.club&&!S.youth){a.push({who:'torc',id:'autografos',n:'Sessão de autógrafos',t:1,c:0,d:'Minigame: atender a fila de torcedores.'});
  a.push({who:'torc',id:'coletiva',n:'Dar entrevista coletiva',t:1,c:0,d:'Minigame: responder a imprensa a tempo.'});
  a.push({who:'torc',id:'organizada',n:'Visitar a sede da organizada',t:1,c:.002,d:'Churrasco com os líderes da torcida.'})}
 else a.push({who:'torc',id:'autografos',n:'Autógrafos na escolinha',t:1,c:0,d:'Minigame: a molecada do bairro quer seu autógrafo.'});
 if(S.gf)a.push({who:'gf',id:'encontro',n:'Noite especial',t:1,c:.006,d:`Minigame: um encontro caprichado com ${S.gf.n}.`});
 else a.push({who:'gf',id:'encontro',n:'Chamar alguém pra sair',t:1,c:.003,d:'Minigame: o primeiro encontro.'});
 a.push({who:'pais',id:'pelada',n:'Racha no campinho do bairro',t:1,c:0,d:'Minigame: jogar com os amigos de infância.'});
}catch(e){}return a};
const LIFE_ASYNC={autografos:1,coletiva:1,encontro:1,pelada:1};
async function doRelAsync(id){
 if(id==='autografos'){const r=await mgAutografos();const fx=S.youth||!S.club?{fama:Math.round(r.score/8),cab:2}:{torc:Math.min(8,Math.round(r.score/3)),fama:Math.min(3,Math.round(r.score/10))};if(!r.ok)fx.cab=-1;return{txt:r.ok?`Você assinou ${r.score} camisas. Saiu com a mão doendo e o coração cheio.`:`Só ${r.score} autógrafos. Teve gente que foi embora chateada.`,chips:applyFx(fx)}}
 if(id==='coletiva'){const r=await mgColetiva();const fx={...r.fx};if(fx.torc)fx.torc=Math.round(fx.torc*.5);if(fx.fama)fx.fama=Math.round(fx.fama*.6);const coach=fx.coach||0;delete fx.coach;if(coach)S.coach=clamp((S.coach??50)+coach,0,100);const ch2=applyFx(fx);if(coach)ch2.push([`${coach>0?'+':'−'}${Math.abs(coach)} Técnico`,coach>0?'up':'down']);return{txt:r.late?'Você travou em uma pergunta e isso virou meme.':'Suas falas viraram manchete.',chips:ch2}}
 if(id==='encontro'){const r=await mgEncontro(S.gf&&S.gf.n);if(S.gf){S.gf.v=clamp(S.gf.v+(r.good*5-8),0,100);return{txt:r.good>=3?`${S.gf.n} disse que foi a melhor noite em meses.`:`${S.gf.n} voltou pra casa calada.`,chips:applyFx({cab:r.good>=3?4:-3})}}
  if(r.good>=3){S.gf={n:pick(GF_NAMES),v:50+r.good*4};S.rel='namorando';return{txt:`Deu certo! Você e ${S.gf.n} estão namorando.`,chips:applyFx({cab:5})}}return{txt:'Foi simpático, mas não passou disso.',chips:applyFx({cab:-1})}}
 if(id==='pelada'){const r=await nssMoment({kind:ch(.5)?'dribble':'finish',comp:'Pelada no bairro',title:'Racha com os amigos',skill:.85,keeper:.25,planned:true,need:2,speed:.8,okTxt:'Golaço no racha!'});S.pais=clamp((S.pais??70)+6,0,100);return{txt:r.ok?'Golaço no campinho onde tudo começou. Os amigos te carregaram nos ombros.':'Levou um chapéu do seu amigo de infância. Riram até de noite.',chips:applyFx({cab:r.ok?6:4,corpo:-1})}}
}
const _relHTMLT=relHTML;relHTML=function(){let h=_relHTMLT();try{const acts=relActions().filter(a=>a.who==='torc');const v=fansCur();const[md,col]=fansMood(v);
 const card=`<section class="card relcard fancard"><div class="relhd"><span class="relic">📣</span><div><b>Torcida${S.club&&CLUB[S.club]?' do '+esc(CLUB[S.club].n):''}</b><span class="muted" style="color:${col}">${md}</span></div></div>${meterHTML('Apoio',v,col)}
 <div class="muted" style="font-size:12.5px;margin:2px 0 6px">${v>=72?'Com esse apoio, a torcida te protege se a diretoria quiser te vender.':v<20?'Se continuar assim, a torcida força sua saída no fim da temporada.':'Gols, notas altas, títulos e atitudes fora de campo mexem com ela. Com apoio alto por 3 temporadas, você vira ídolo.'}</div>
 <div class="relacts">${acts.map(a=>`<button class="relbtn" data-rel="${a.id}" ${canPay(a.c,a.t)?'':'disabled'}><b>${esc(a.n)}</b><span>${esc(a.d)}</span><em>${costLbl(a.c,a.t)}</em></button>`).join('')}</div></section>`;
 h=card+h}catch(e){}return h};
const _doRelT=doRel;doRel=function(id){
 if(id==='organizada'){const ok=ch(.65);return{txt:ok?'Churrasco, fotos e uma camisa assinada pra sede. Agora você é "da casa".':'Um dos líderes cobrou sua última atuação na frente de todo mundo.',chips:applyFx(ok?{torc:9,disc:-1}:{torc:2,cab:-3})}}
 return _doRelT(id)};
const _bindLifeT=bindLife;bindLife=function(){_bindLifeT();try{$app.querySelectorAll('[data-rel]').forEach(b=>{if(!LIFE_ASYNC[b.dataset.rel])return;b.onclick=async()=>{const a=relActions().find(x=>x.id===b.dataset.rel);if(!a||!canPay(a.c,a.t))return;S.tempo-=a.t;S.din-=a.c;if(a.t)dayLog({gf:'❤️',tec:'📋',pais:'🏠',dir:'💼',torc:'📣'}[a.who],a.n);LIFE_MSG=await doRelAsync(a.id);lifeRefresh()}})}catch(e){console.error(e)}};
// término quando o namoro esfria
const _lifeTickT=lifeTick;lifeTick=function(...a){const r=_lifeTickT.apply(this,a);try{if(S.gf&&S.gf.v<12&&ch(.2)){const n=S.gf.n;S.gf=null;S.rel=S.rel==='casado'?'divorciado':'solteiro';S.life.cab=clamp(S.life.cab-15,0,100);if(typeof toast==='function')toast({ic:'💔',title:`${n} terminou com você`,txt:'Faltou atenção. A cabeça vai sentir nos jogos.',ms:4200})}}catch(e){}return r};

// ---------- faixa de estado no hub (vida pesa em campo) ----------
function lifeStripHTML(){const L=S.life;const v=fansCur();const heart=S.gf?S.gf.v:(S.pais??70);const imp=lifeImpact();
 const m=(ic,lbl,val,col)=>`<div class="ls-m" title="${lbl}"><span>${ic}</span><div><small>${Math.round(val)}</small><i><s style="width:${clamp(val,0,100)}%;background:${col}"></s></i></div></div>`;
 return`<button class="lifestrip" id="lifeStrip" aria-label="Vida fora de campo">${m('🧠','Cabeça',L.cab,'#8fd3ff')}${m('💪','Corpo',L.corpo,'#7dff9a')}${m(S.gf?'❤️':'🏠',S.gf?'Amor':'Família',heart,'#ff8fb3')}${m('📣','Torcida',S.youth?50:v,fansMood(v)[1])}
 <div class="ls-imp ${imp>0?'up':imp<0?'down':''}"><b>${imp>0?'+':''}${imp.toFixed(1)}</b><small>na nota</small></div></button>`}
if(typeof oneScreenHub==='function'){const _oshT=oneScreenHub;oneScreenHub=function(...a){const r=_oshT.apply(this,a);try{
 const w=$app.querySelector('.wrap');const j=w&&w.querySelector(':scope > .journey');if(w&&S.st&&!S.st.done&&!PAUSE&&!(S.tips&&!S.tips.tourHub)){const dec=isDecisive(nextItem());if(!dec&&j&&!document.getElementById('lifeStrip')){j.insertAdjacentHTML('afterend',lifeStripHTML());j.remove();document.getElementById('lifeStrip').onclick=()=>{WEEK_TAB='rel';renderHub()}}}
}catch(e){console.error(e)}return r}}
