// ================== JOGO A JOGO, FEED VERTICAL COM FOFOCAGRAM E CASSINO BETTIGER ==================
// Sem simulação em massa: cada jogo é jogado (ou simulado ali mesmo no ⏭). Sem tela de pré-temporada.
// Notícias viram um feed vertical estilo Instagram, com o @fofocagram do jornalista Nardo Meses.
// Cassino BETTIGER: Tigrinho (o tigre solta a carta), Avião, Bomba, apostas em outros esportes, cavalos, 21 e roleta.

// ---------- um jogo por vez ----------
{const _nsS2=nsSync;nsSync=function(){const r=_nsS2.apply(this,arguments);try{if(S&&S.n){S.fast=false;S.liveMode='all'}}catch(e){}return r}}
{const _ff=typeof fastForward==='function'?fastForward:null;if(_ff)fastForward=function(...a){if(nsOn()){toast({ic:'⚽',title:'Um jogo de cada vez',txt:'Jogue a partida ou use ⏭ dentro dela pra simular só aquele jogo.',ms:2600});return}return _ff.apply(this,a)}}
nsCfgSheet=function(){const v=S.matchMode||'old',lm=S.lanceMode||'jogar',lc=S.lances||'todos';
 nsPop({ic:'⚙️',title:'Opções do jogo',html:`<div class="nscfg">
  <div class="livemode"><span class="eyebrow">Partida</span><button class="lmbtn ${v==='old'?'on':''}" data-cf="mm:old">📋 Narração + lances 3D</button><button class="lmbtn ${v==='sess'?'on':''}" data-cf="mm:sess">🏟️ Tudo no 3D</button></div>
  <div class="livemode"><span class="eyebrow">Seus lances</span><button class="lmbtn ${lc!=='off'&&lm==='jogar'?'on':''}" data-cf="lm:jogar">🎮 Jogar</button><button class="lmbtn ${lc!=='off'&&lm==='decidir'?'on':''}" data-cf="lm:decidir">🧠 Decidir</button><button class="lmbtn ${lc==='off'?'on':''}" data-cf="lm:off">Automático</button></div>
  <p class="muted" style="margin:0;font-size:13px">Cada jogo é um por vez. Pra simular só o jogo de agora, toque em <b>⏭</b> durante a partida.</p></div>`,
  bind:h=>h.querySelectorAll('[data-cf]').forEach(b=>b.onclick=()=>{const[k,val]=b.dataset.cf.split(':');if(k==='mm')S.matchMode=val;else if(k==='lm'){if(val==='off')S.lances='off';else{S.lances='todos';S.lanceMode=val}}
   b.parentElement.querySelectorAll('.lmbtn').forEach(x=>x.classList.toggle('on',x===b));try{saveNow('opts')}catch(e){}})})};
// sem pré-temporada: depois do balanço e das propostas, direto pra tela principal
{const _rp=renderPlanning;renderPlanning=function(...a){try{if(nsOn()&&S.club&&S.st&&!(typeof inPrison==='function'&&inPrison())){PAUSE=null;EVRES=null;LASTR=[];renderHub();try{saveNow('season')}catch(e){}
  if(S.contract<=1&&!S.loan)setTimeout(()=>toast({ic:'✍️',title:'Contrato no último ano',txt:'Renove na aba Contrato (tem negociação).',ms:3200}),700);return}}catch(e){console.error(e)}return _rp.apply(this,a)}}
// faixa da semana: lembrete de renovação
{const _ws=nsWeekStrip;nsWeekStrip=function(){let h=_ws();if(h&&S.contract<=1&&!S.loan&&!S.agreed)h=h.replace('<span class="nsw nx">','<button class="nsw hot" id="nwRn"><span>✍️</span>Renovar</button><span class="nsw nx">');return h}}
{const _rnh3=nsRenderHub;nsRenderHub=function(){const r=_rnh3.apply(this,arguments);try{const e=document.getElementById('nwRn');if(e)e.onclick=()=>nsRenew()}catch(e){}return r}}

// ---------- feed vertical + @fofocagram (Nardo Meses) ----------
{const _fa=fdAcc;fdAcc=function(kind){if(kind==='nardo')return{h:'fofocagram',av:'<span class="fd-av" style="background:linear-gradient(45deg,#ff2bd6,#ffd400);color:#111">🗞️</span>',ver:true};return _fa(kind)}}
function nsGossip(){const n=S.n;const st=S.st;const r=npRand((S.year*97+((st&&st.nsWk)||0)*13+(S.name||'').length)>>>0);const nm=S.name,sur=nsSur();const c=club()||{n:'clube'};const L=[];
 const last=((st&&st.log)||[]).filter(x=>x.k==='match'&&x.me&&x.me.play).slice(-1)[0];
 if(S.gf)L.push(S.rel==='casado'?`Nardo apurou: ${nm} e ${S.gf.n} estão procurando casa maior. Vem herdeiro por aí? 👶`:`🚨 Flagra! ${nm} e ${S.gf.n} jantando à luz de velas. Fontes garantem: o clima é de aliança 💍`);
 else L.push(npPick(r,[`Solteiro e na pista! ${nm} foi visto saindo de uma festa às 4h da manhã. A torcida aprova? 🕺`,`Quem é a misteriosa que curtiu TODAS as fotos de ${sur}? Nardo está investigando 👀`]));
 if(n&&n.veh.some(v=>['esportivo','limo','heli','jato','iate'].includes(v)))L.push(`${nm} chegou no CT com brinquedo novo. Os colegas ficaram de boca aberta 🏎️`);
 if((S.props||[]).some(p=>['mansao','castelo','ilha','vinhedo'].includes(p)))L.push(`Exclusivo: ${nm} comprou um imóvel de cinema. Nardo esteve lá… do lado de fora 🏰`);
 if(S.casino&&S.casino.visits)L.push(`${nm} foi visto no BETTIGER apostando alto. O técnico sabe? 🤫🎰`);
 if(n&&(n.offers||[]).length){const o=CLUB[n.offers[0].club];if(o)L.push(`BOMBA! O ${o.n} quer ${nm}. O empresário não desmente 📞`)}
 if(S.agreed&&CLUB[S.agreed.club])L.push(`Nardo confirma: ${nm} já acertou com o ${CLUB[S.agreed.club].n}! A torcida do ${c.n} não vai gostar…`);
 if(n&&n.rel.coach<35)L.push(`Clima pesado no ${c.n}: ${sur} e o técnico não se falam no treino, garante uma fonte 🥶`);
 if(n&&n.rel.team>75)L.push(`${sur} pagou churrasco pro elenco e virou o queridinho do vestiário 🍖`);
 if(last&&last.me.nota!=null&&last.me.nota<5.5)L.push(`${nm} saiu do estádio sem falar com a imprensa depois da atuação apagada 🙊`);
 if(last&&last.me.nota>=8)L.push(`Depois da noite de craque, ${sur} comemorou num camarote VIP até de manhã 🥂`);
 L.push(npPick(r,[`${sur} mudou o corte de cabelo e a internet não perdoou 😂`,`${nm} foi visto num rodízio de pizza. Comeu 23 pedaços, segundo o garçom 🍕`,`${sur} curtiu post de ex? A gente viu 👀`,`${nm} apareceu com tatuagem nova. Nardo conta qual é amanhã 🐉`,`Fãs pedem ${sur} na seleção. Nardo também 🇧🇷`]));
 const pickN=[];const pool=L.slice();while(pickN.length<2&&pool.length){pickN.push(pool.splice(Math.floor(r()*pool.length),1)[0])}
 const COM=['kkkkkkk','fake news','Nardo nunca erra','deixa o menino em paz','EU SABIA','fonte: vozes da cabeça','👀👀👀','manda mais'];
 return pickN.map((t,i)=>({id:'nardo'+S.year+'_'+((st&&st.nsWk)||0)+'_'+i,acc:'nardo',t:i?'1 h':'agora',tag:'FOFOCA',title:t,deck:'',likes:Math.round(1200+((S.life&&S.life.fama)||5)**2*30*(1+r())),cm:Math.round(80+r()*900),
  coms:[0,1,2].map(()=>({u:npPick(r,FD_FANS),t:npPick(r,COM)})),body:'Nardo Meses · coluna do Fofocagram',
  media:`<div class="nsfofo"><b>🚨 FOFOCAGRAM</b><p>${esc(t)}</p><small>por Nardo Meses</small></div>`}))}
function nsFeedPage(){return{t:'Notícias',cls:'feed',html:()=>{let posts=[];try{posts=fdPosts()}catch(e){}const g=nsGossip();FD.posts=g.concat(posts);
  return`<div class="nsstories">${[['nardo','fofocagram'],['me','você'],['club','clube'],['gazeta','gazeta'],['mercado','mercado']].map(([k,t])=>{const a=fdAcc(k);return`<div><i>${a.av}</i><small>${esc(t)}</small></div>`}).join('')}</div>
  <div class="nsfeedv">${FD.posts.map((p,i)=>{try{return fdPostHTML(p,i)}catch(e){return''}}).join('')}</div>`},
 bind:B=>{B.querySelectorAll('[data-fo]').forEach(el=>el.onclick=()=>fdOpen(+el.dataset.fo));
  B.querySelectorAll('[data-fl]').forEach(b=>b.onclick=e=>{e.stopPropagation();const p=FD.posts[+b.dataset.fl];FD.likes[p.id]=!FD.likes[p.id];fdSync()});
  B.querySelectorAll('[data-fm]').forEach(m=>{let t=0;m.onclick=()=>{const now=Date.now();if(now-t<320){const p=FD.posts[+m.dataset.fm];FD.likes[p.id]=true;fdSync()}else setTimeout(()=>{if(Date.now()-t>=300)fdOpen(+m.dataset.fm)},330);t=now}})}}}
nsNews=function(){if(NSP.stack.length)nsPush(nsFeedPage());else nsOpen(nsFeedPage())};

// ---------- BETTIGER ----------
function btBetRow(bet,set){return`<div class="betrow">${betOpts().map(v=>`<button class="lmbtn ${bet===v?'on':''}" data-b="${v}">${money(v)}</button>`).join('')||'<span class="muted">Sem dinheiro pra apostar</span>'}</div>`}
function btFrame(t,body){$ov.hidden=false;$ov.innerHTML=`<div class="ovwrap btg"><div class="btg-h"><b>BETTIGER</b><span>${esc(t)}</span><em>Banco <i>${money(S.din)}</i></em></div>${body}</div>`}
function btSum(net,name){return{txt:net>=0?`Saiu do ${name} com ${money(net)} a mais.`:`Perdeu ${money(-net)} no ${name}.`,chips:[[`${net>=0?'+':'−'}${money(Math.abs(net))}`,net>=0?'up':'down']]}}
// Tigrinho: 3×3, 5 linhas, 🐯 é coringa; às vezes o tigre solta a carta (multiplicador e giro premiado)
const TG_SYM=[['🍬',38,3],['🍊',26,5],['🔔',16,8],['🧧',10,12],['💰',6,25],['🐯',4,100]];
function tigrinho(){return new Promise(res=>{let bet=betOpts()[0]||0,net=0,busy=false,grid=null,msg='Gire e torça pro tigre!',lines=[];
 const rs=()=>{const t=TG_SYM.reduce((s,x)=>s+x[1],0);let r=rnd()*t;for(const x of TG_SYM){r-=x[1];if(r<=0)return x[0]}return'🍬'};
 const LN=[[0,1,2],[3,4,5],[6,7,8],[0,4,8],[6,4,2]];
 const evalG=g=>{let win=0;const hit=[];for(const l of LN){const s=l.map(i=>g[i]);const base=s.find(x=>x!=='🐯')||'🐯';if(s.every(x=>x===base||x==='🐯')){const m=TG_SYM.find(x=>x[0]===base)[2];win+=m/5;hit.push(l)}}return{win,hit}};
 const draw=()=>{btFrame('🐯 Tigrinho',`<div class="tgr ${busy?'spin':''}">${(grid||Array(9).fill('🐯')).map((s,i)=>`<i class="${lines.some(l=>l.includes(i))?'hit':''}">${s}</i>`).join('')}</div><div class="btg-msg">${msg}</div>${btBetRow(bet)}
  <div class="actions"><button class="btn" id="tgSpin" ${busy||!bet||S.din<bet?'disabled':''}>🎰 Girar</button><button class="btn ghost" id="btOut">Sair</button></div><p class="muted btg-p">5 linhas · 🐯 vale por qualquer símbolo · 3 🐯 numa linha paga 20×</p>`);
  $ov.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{if(busy)return;bet=+b.dataset.b;draw()});document.getElementById('btOut').onclick=()=>{if(busy)return;$ov.hidden=true;$ov.innerHTML='';res(btSum(net,'Tigrinho'))};
  const sp=document.getElementById('tgSpin');if(sp)sp.onclick=spin};
 const spin=async()=>{if(busy||S.din<bet)return;busy=true;S.din-=bet;net-=bet;lines=[];msg='Girando…';
  for(let k=0;k<8;k++){grid=Array.from({length:9},rs);draw();await sleep(reduced?0:90)}
  grid=Array.from({length:9},rs);let{win,hit}=evalG(grid);let mult=1;
  if(ch(.07)){msg='🐯 O TIGRINHO SOLTOU A CARTA!';draw();await sleep(900);mult=pick([2,2,3,5,10]);const s=pick(TG_SYM.slice(0,4))[0];grid=grid.map((x,i)=>[0,4,8,1,7].includes(i)||ch(.4)?(ch(.3)?'🐯':s):x);({win,hit}=evalG(grid));msg=`🃏 Carta ×${mult}!`;draw();await sleep(700)}
  const pay=bet*win*mult;S.din+=pay;net+=pay;S.casino.net+=pay-bet;lines=hit;busy=false;msg=pay>0?`<span class="good">Ganhou ${money(pay)}${mult>1?` (carta ×${mult})`:''}!</span>`:'Não foi dessa vez.';draw()};
 draw()})}
// Avião: o multiplicador sobe até o avião sumir; retire antes
function aviao(){return new Promise(res=>{let bet=betOpts()[0]||0,net=0,state='bet',mult=1,crash=1,raf,t0=0,msg='Aposte e decole. Retire antes do avião sumir!';
 const draw=()=>{const p=Math.min(1,Math.log(mult)/Math.log(20));btFrame('✈️ Avião',`<div class="avi ${state}"><div class="avi-m ${state==='boom'?'bad':state==='out'?'good':''}" id="avM">${mult.toFixed(2).replace('.',',')}×</div><span class="avi-p" id="avP" style="left:${8+p*78}%;bottom:${10+p*70}%">${state==='boom'?'💥':'✈️'}</span></div><div class="btg-msg">${msg}</div>
  ${state==='fly'?'':btBetRow(bet)}<div class="actions">${state==='fly'?`<button class="btn big" id="avOut">💰 RETIRAR ${money(bet*mult)}</button>`:`<button class="btn" id="avGo" ${!bet||S.din<bet?'disabled':''}>🛫 Decolar</button><button class="btn ghost" id="btOut">Sair</button>`}</div>`);
  $ov.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{bet=+b.dataset.b;draw()});const o=document.getElementById('btOut');if(o)o.onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res(btSum(net,'Avião'))};
  const g=document.getElementById('avGo');if(g)g.onclick=go;const r=document.getElementById('avOut');if(r)r.onclick=cash};
 const go=()=>{if(S.din<bet)return;S.din-=bet;net-=bet;S.casino.net-=bet;crash=Math.max(1,Math.floor(.96/(1-rnd())*100)/100);mult=1;state='fly';msg='Subindo…';t0=performance.now();draw();
  const tick=t=>{if(state!=='fly')return;mult=Math.pow(Math.E,.08*(t-t0)/1000*(1+(t-t0)/12000));if(mult>=crash){mult=crash;state='boom';msg=`<span class="bad">O avião sumiu em ${crash.toFixed(2).replace('.',',')}×</span>`;draw();return}
   const m=document.getElementById('avM'),pl=document.getElementById('avP'),b=document.getElementById('avOut');const p=Math.min(1,Math.log(mult)/Math.log(20));if(m)m.textContent=mult.toFixed(2).replace('.',',')+'×';if(pl){pl.style.left=(8+p*78)+'%';pl.style.bottom=(10+p*70)+'%'}if(b)b.textContent=`💰 RETIRAR ${money(bet*mult)}`;raf=requestAnimationFrame(tick)};raf=requestAnimationFrame(tick)};
 const cash=()=>{if(state!=='fly')return;cancelAnimationFrame(raf);const pay=bet*mult;S.din+=pay;net+=pay;S.casino.net+=pay;state='out';msg=`<span class="good">Retirou em ${mult.toFixed(2).replace('.',',')}×: +${money(pay)}</span> (ia até ${crash.toFixed(2).replace('.',',')}×)`;draw()};
 draw()})}
// Bomba: 5×5 com bombas escondidas; cada casa livre aumenta o prêmio
function bomba(){return new Promise(res=>{let bet=betOpts()[0]||0,net=0,nb=3,state='bet',open=[],bombs=new Set(),mult=1,msg='Escolha quantas bombas e aposte. Retire quando quiser.';
 const multFor=k=>{let m=1;for(let i=0;i<k;i++)m*=(25-i)/(25-nb-i);return m*.97};
 const draw=()=>{btFrame('💣 Bomba',`<div class="bmb">${Array.from({length:25},(_,i)=>{const o=open.includes(i),b=bombs.has(i)&&state==='boom';return`<button data-c="${i}" class="${o?'ok':''} ${b?'bm':''}" ${state!=='play'||o?'disabled':''}>${o?'💎':b?'💣':''}</button>`}).join('')}</div><div class="btg-msg">${msg}</div>
  ${state==='play'?'':`<div class="betrow"><span class="eyebrow">Bombas</span>${[3,5,10].map(k=>`<button class="lmbtn ${nb===k?'on':''}" data-nb="${k}">${k}</button>`).join('')}</div>${btBetRow(bet)}`}
  <div class="actions">${state==='play'?`<button class="btn big" id="bmOut" ${open.length?'':'disabled'}>💰 RETIRAR ${money(bet*mult)}</button>`:`<button class="btn" id="bmGo" ${!bet||S.din<bet?'disabled':''}>Jogar</button><button class="btn ghost" id="btOut">Sair</button>`}</div>`);
  $ov.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{bet=+b.dataset.b;draw()});$ov.querySelectorAll('[data-nb]').forEach(b=>b.onclick=()=>{nb=+b.dataset.nb;draw()});
  const o=document.getElementById('btOut');if(o)o.onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res(btSum(net,'Bomba'))};
  const g=document.getElementById('bmGo');if(g)g.onclick=()=>{if(S.din<bet)return;S.din-=bet;net-=bet;S.casino.net-=bet;bombs=new Set(shuffle([...Array(25).keys()]).slice(0,nb));open=[];mult=1;state='play';msg=`${nb} bombas escondidas. Abra as casas!`;draw()};
  const c=document.getElementById('bmOut');if(c)c.onclick=()=>{const pay=bet*mult;S.din+=pay;net+=pay;S.casino.net+=pay;state='out';msg=`<span class="good">Retirou ${money(pay)} (${mult.toFixed(2).replace('.',',')}×)</span>`;bombs.forEach(()=>0);draw()};
  $ov.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{if(state!=='play')return;const i=+b.dataset.c;if(bombs.has(i)){state='boom';msg='<span class="bad">💥 BOMBA! Perdeu a aposta.</span>';draw();return}open.push(i);mult=multFor(open.length);msg=`${open.length} casa${open.length>1?'s':''} · ${mult.toFixed(2).replace('.',',')}×`;if(open.length>=25-nb){c&&0;const pay=bet*mult;S.din+=pay;net+=pay;S.casino.net+=pay;state='out';msg=`<span class="good">Limpou o campo! +${money(pay)}</span>`}draw()})};
 draw()})}
// Apostas em outros esportes (nada a ver com futebol)
const BT_SPORTS=[['🏓','Tênis de mesa',['Lin Zhao','Kowalski','Matsuda','Oliveira','Petrov','Haddad']],['🥌','Curling',['Suécia B','Canadá C','Escócia A','Japão Kita','Noruega']],['🤼','Sumô',['Takanoyama','Kotozakura','Hakuryu','Oyamazaki','Tochigiri']],['🐌','Corrida de lesmas',['Turbo','Gosminha','Relâmpago Lento','Dona Baba','Flash Molhado']],['♟️','Xadrez relâmpago',['Ivanova','Duarte','Mbeki','Nakamura','Sørlie']],['🎯','Dardos',['"Martelo" Price','"Foguete" Lins','"Mão Fria" Kemp','"Tio" Barros']],['🫏','Corrida de jegue',['Pé de Pano','Trovão do Sertão','Mimoso','Fubá']],['🪵','Arremesso de tora',['MacGregor','Lindqvist','Tavares','O\'Hara']],['🏸','Badminton',['Sato','Pereira','Nguyen','Larsen','Okafor']],['⚪','Bocha',['Seu Zé','Dona Cida','Seu Tonho','Dona Neide']]];
function btEvents(){const n=S.n;const wk=(S.st&&S.st.nsWk)||0;if(n.btEv&&n.btEv.wk===wk)return n.btEv.L;const L=shuffle(BT_SPORTS).slice(0,5).map((sp,i)=>{const[a,b]=shuffle(sp[2]).slice(0,2);const pa=R(.3,.7);const draw=['🥌','♟️','⚪'].includes(sp[0])?R(.08,.2):0;const pb=1-pa-draw;const o=p=>Math.max(1.05,Math.round(.92/p*100)/100);return{id:i,ic:sp[0],sp:sp[1],a,b,pa,pd:draw,pb,oa:o(pa),od:draw?o(draw):0,ob:o(pb),res:null}});n.btEv={wk,L};return L}
function apostas(){return new Promise(res=>{let bet=betOpts()[0]||0,net=0,sel=null,msg='Escolha um resultado, a aposta e confirme.';const L=btEvents();
 const draw=()=>{btFrame('🎲 Esportes',`<div class="bts">${L.map(e=>`<div class="bt-e ${e.res?'done':''}"><div class="bt-t"><span>${e.ic}</span><b>${esc(e.sp)}</b>${e.res?`<em>${esc(e.res)}</em>`:''}</div><div class="bt-o">${[['a',e.a,e.oa],...(e.od?[['d','Empate',e.od]]:[]),['b',e.b,e.ob]].map(([k,t,o])=>`<button class="${sel&&sel.id===e.id&&sel.k===k?'on':''}" data-e="${e.id}:${k}" ${e.res?'disabled':''}><small>${esc(t)}</small><b>${o.toFixed(2).replace('.',',')}</b></button>`).join('')}</div></div>`).join('')}</div>
  <div class="btg-msg">${msg}</div>${btBetRow(bet)}<div class="actions"><button class="btn" id="btGo" ${!sel||!bet||S.din<bet?'disabled':''}>✓ Apostar</button><button class="btn ghost" id="btOut">Sair</button></div>`);
  $ov.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{bet=+b.dataset.b;draw()});$ov.querySelectorAll('[data-e]').forEach(b=>b.onclick=()=>{const[i,k]=b.dataset.e.split(':');sel={id:+i,k};draw()});
  document.getElementById('btOut').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res(btSum(net,'BETTIGER'))};
  const g=document.getElementById('btGo');if(g)g.onclick=async()=>{const e=L.find(x=>x.id===sel.id);if(!e||e.res||S.din<bet)return;S.din-=bet;net-=bet;S.casino.net-=bet;msg='Rolando…';draw();await sleep(900);
   const r=rnd();const out=r<e.pa?'a':r<e.pa+e.pd?'d':'b';const name=out==='a'?e.a:out==='b'?e.b:'Empate';e.res=out==='d'?'Empate':`Venceu ${name}`;
   const odd=sel.k==='a'?e.oa:sel.k==='b'?e.ob:e.od;if(out===sel.k){const pay=bet*odd;S.din+=pay;net+=pay;S.casino.net+=pay;msg=`<span class="good">Acertou! +${money(pay)}</span>`}else msg=`<span class="bad">Deu ${esc(name)}. Perdeu ${money(bet)}.</span>`;sel=null;draw()}};
 draw()})}
nsCasinoPage=function(){return{t:'BETTIGER',cls:'casino',html:()=>{const kid=S.age<18;const nt=(S.casino&&S.casino.net)||0;
  return`<div class="btlogo"><b>BET<span>TIGER</span></b><small>o cassino do boleiro</small></div>
  <div class="nscas-bank"><span>Banco</span><b>${money(S.din)}</b><small>Saldo no BETTIGER: <span class="${nt>=0?'good':'bad'}">${nt>=0?'+':'−'}${money(Math.abs(nt))}</span></small></div>
  ${kid?'<p class="muted">O BETTIGER libera aos 18 anos.</p>':''}
  <div class="btgrid">${[['tig','🐯','Tigrinho','o tigre solta a carta'],['avi','✈️','Avião','retire antes de sumir'],['bmb','💣','Bomba','fuja das bombas'],['esp','🎲','Esportes','odds de tudo'],['horse','🏇','Cavalos','hipódromo'],['bj','🃏','Vinte e um','chegue a 21'],['rol','🎡','Roleta','cor ou número']].map(([k,ic,t,d])=>`<button class="btt" data-cs="${k}" ${kid?'disabled':''}><span>${ic}</span><b>${t}</b><small>${d}</small></button>`).join('')}</div>
  <p class="muted nshelp">Dinheiro do jogo, só diversão. Ir demais derruba a disciplina e a imprensa adora uma foto.</p>`},
 bind:B=>B.querySelectorAll('[data-cs]').forEach(b=>b.onclick=async()=>{const fn={tig:tigrinho,avi:aviao,bmb:bomba,esp:apostas,bj:blackjack,rol:roulette,horse:horseRace}[b.dataset.cs];if(!fn)return;
  ensureLife();S.casino.visits=(S.casino.visits||0)+1;S.life.disc=clamp(S.life.disc-1,0,100);try{await fn()}catch(e){console.error(e)}
  if(ch(S.life.fama>40?.1:.04)){S.n.rel.coach=clamp(S.n.rel.coach-3,0,100);toast({ic:'📸',title:'Paparazzi',txt:'Foto sua no BETTIGER nas redes. O técnico não gostou.',ms:2600})}try{nsAchCheck()}catch(e){}nsRefresh()}),
 nav:[{ic:'🐎',t:'Meu estábulo',fn:()=>nsPush(nsStablePage())}]}};
// o menu antigo da vida usa o mesmo cassino
try{if(typeof casinoActs==='function'){const _ca=casinoActs;casinoActs=function(){const L=_ca();const mk=(id,ic,n,d,fn)=>({id,ic,n,d,t:1,c:0,mg:true,req:()=>S.age<18?'A partir dos 18 anos':null,run:async()=>{S.casino.visits++;const chips=applyFx({disc:-2});const r=await fn();return{txt:r.txt||'',chips:[...chips,...(r.chips||[])]}}});
 const i=L.findIndex(x=>x.id==='cas_slot');const tg=mk('cas_tig','🐯','Tigrinho','O tigre solta a carta.',tigrinho);if(i>=0)L[i]=tg;else L.push(tg);
 L.push(mk('cas_avi','✈️','Avião','Retire antes do avião sumir.',aviao),mk('cas_bmb','💣','Bomba','Abra as casas sem achar bomba.',bomba),mk('cas_esp','🎲','Apostas esportivas','Odds de tênis de mesa, sumô, curling…',apostas));return L}}}catch(e){}

{const st=document.createElement('style');st.textContent=`
#fastAll{display:none!important}
.nsh-sub>span{white-space:nowrap}@media (max-width:420px){.nsh-sub{gap:4px;font-size:12px}.nstabs.n4 button{padding:6px 6px;font-size:11px}}
.nsfeedv{display:grid;gap:14px;justify-items:center;padding-bottom:10px}.nsfeedv .fd-media{height:auto;aspect-ratio:1/1;max-height:min(520px,60vh)}.nsfeedv .fd-media .nsfofo{position:absolute;inset:0;aspect-ratio:auto}.nsfeedv .fd-cap{display:block;-webkit-line-clamp:unset;overflow:visible}.nsfeedv .fd-post{width:100%;max-width:520px;flex:none;scroll-snap-align:none}
.nsp-b:has(.nsfeedv){overflow-y:auto;-webkit-overflow-scrolling:touch}
.nsstories{display:flex;gap:12px;justify-content:center;padding:4px 0 8px}.nsstories div{display:grid;justify-items:center;gap:3px}.nsstories i{display:grid;place-items:center;width:58px;height:58px;border-radius:50%;padding:3px;background:linear-gradient(45deg,#ffd400,#ff2bd6,#7a5cff)}.nsstories i .fd-av{width:52px;height:52px;border:3px solid var(--pitch);border-radius:50%;display:grid;place-items:center;font-size:22px;overflow:hidden}.nsstories small{font:700 11px var(--f-body);color:var(--muted)}
.nsfofo{aspect-ratio:1;display:grid;align-content:center;justify-items:center;gap:12px;padding:22px;text-align:center;background:linear-gradient(135deg,#ff2bd6,#ff7a2b 55%,#ffd400);color:#111}.nsfofo b{font:900 22px var(--f-display);letter-spacing:1px;background:#111;color:#ffd400;padding:4px 12px;border-radius:8px}.nsfofo p{margin:0;font:900 clamp(18px,4.6vw,26px)/1.2 var(--f-display)}.nsfofo small{font-weight:800;opacity:.75}
.btg{display:grid;gap:10px;text-align:center}.btg-h{display:flex;align-items:center;gap:10px;justify-content:space-between}.btg-h b{font:900 22px var(--f-display);background:linear-gradient(90deg,#ffd400,#ff7a2b);-webkit-background-clip:text;background-clip:text;color:transparent;letter-spacing:1px}.btg-h span{font:800 15px var(--f-body)}.btg-h em{font-style:normal;font:700 13px var(--f-body);color:var(--muted)}.btg-h em i{font-style:normal;color:var(--gold)}
.btg-msg{min-height:24px;font:800 16px var(--f-body)}.btg-msg .good{color:var(--good)}.btg-msg .bad{color:var(--bad)}.btg-p{margin:0;font-size:12.5px}.btg .betrow{justify-content:center}
.tgr{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;background:linear-gradient(180deg,#7a0f0f,#3d0606);border:4px solid #ffd400;border-radius:18px;padding:10px;max-width:340px;margin:0 auto;width:100%}.tgr i{font-style:normal;font-size:44px;display:grid;place-items:center;aspect-ratio:1;background:#fff8e1;border-radius:12px}.tgr.spin i{filter:blur(1px)}.tgr i.hit{background:#ffd400;box-shadow:0 0 14px #ffd400}
.avi{position:relative;height:clamp(170px,30vh,280px);border-radius:16px;background:linear-gradient(180deg,#0b1a3a,#1d3c8f);overflow:hidden}.avi.boom{background:linear-gradient(180deg,#3d0606,#7a0f0f)}.avi-m{position:absolute;inset:0;display:grid;place-items:center;font:900 54px var(--f-display);color:#fff}.avi-m.good{color:var(--good)}.avi-m.bad{color:#ffb3aa}.avi-p{position:absolute;font-size:40px;transform:translate(-50%,50%) rotate(-12deg)}
.bmb{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;max-width:330px;margin:0 auto;width:100%}.bmb button{aspect-ratio:1;border-radius:10px;border:1px solid #ffffff30;background:linear-gradient(180deg,#2a3a52,#1a2536);font-size:24px}.bmb button.ok{background:#1d5a2c}.bmb button.bm{background:#7a0f0f}
.bts{display:grid;gap:6px;text-align:left}.bt-e{background:var(--panel-2);border:1px solid var(--line-2);border-radius:12px;padding:6px 8px}.bt-e.done{opacity:.6}.bt-t{display:flex;gap:6px;align-items:center;font:800 13.5px var(--f-body)}.bt-t em{margin-left:auto;font-style:normal;color:var(--gold);font-size:12px}
.bt-o{display:flex;gap:6px;margin-top:4px}.bt-o button{flex:1;display:grid;gap:1px;padding:5px;border-radius:8px;border:1px solid var(--line-2);background:#0d2118;color:var(--chalk)}.bt-o button small{font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bt-o button b{color:var(--gold);font:900 15px var(--f-display)}.bt-o button.on{background:var(--accent);color:var(--accent-ink)}.bt-o button.on b{color:var(--accent-ink)}
.btlogo{display:grid;justify-items:center;padding:6px 0}.btlogo b{font:900 40px/1 var(--f-display);letter-spacing:2px;color:#fff;text-shadow:0 3px 0 #7a0f0f}.btlogo b span{color:#ffd400}.btlogo small{color:var(--muted);font-weight:700}
.btgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.btt{display:grid;grid-template-columns:auto 1fr;grid-template-areas:"ic t" "ic d";gap:0 10px;align-items:center;text-align:left;padding:10px 12px;border-radius:14px;border:1px solid #ffd40055;background:linear-gradient(180deg,#3a1d5a,#24103a);color:#fff;box-shadow:0 3px 0 #12081d}.btt span{grid-area:ic;font-size:30px}.btt b{grid-area:t;font:900 18px var(--f-display);letter-spacing:.3px}.btt small{grid-area:d;color:#d9c8f0;font-size:12px}.btt:disabled{opacity:.4}
.btt:last-child:nth-child(odd){grid-column:1/-1}
`;document.head.appendChild(st)}
