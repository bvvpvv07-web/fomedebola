// ================== V5: sem draft, OVR nasce na peneira, copas ao vivo, balanço por competição, aposentadoria, assalto ==================

// ---------- sem draft: o jogador nasce cru e a peneira define o nível ----------
JOURNEY.ob=['Jogador','Empresário','Peneira','Clube'];
function baseAttrs(pos){const w=POS[pos].w||{};const A={};const mx=Math.max(...ATTRS.map(k=>w[k]||0),.01);ATTRS.forEach(k=>{A[k]=Math.round(42+(w[k]||0)/mx*14+R(-2,2))});return A}
startDraft=function(){DR.attrs=baseAttrs(CR.pos);finishDraft()};
const _finishDraftV5=finishDraft;finishDraft=function(){_finishDraftV5();if(S){S.ovrHidden=true;S.ovr=45;S.pot=70;S.peak=45}};
// telas da peneira mostram "?" no OVR enquanto ninguém sabe seu nível
const _penShellV5=penShell;penShell=function(inner){_penShellV5(inner);try{if(S.ovrHidden){const o=$app.querySelector('.ph .ovr b');if(o)o.textContent='?'}}catch(e){}};
const _pickAgentV5=pickAgent;pickAgent=function(){const p=_pickAgentV5();try{if(S.ovrHidden){const o=$app.querySelector('.ph .ovr b');if(o)o.textContent='?'}const j=$app.querySelector('.journey');if(j)j.outerHTML=journeyHTML('ob',1,'Antes da peneira, escolha quem vai cuidar da sua carreira.')}catch(e){}return p};
function peneiraRating(){
 const sc=clamp(PEN.score||40,0,100);const D=DIFF[S.diff]||{pot:0};const A={...S.attrs};
 for(const c of(PEN.circ||[])){if(!c.at)continue;A[c.at]=clamp((A[c.at]||45)+(c.perfect?8:c.ok?5:-2),30,80)}
 const ovr=clamp(Math.round(45+sc*.2+R(-1,1)),44,68);
 const pot=clamp(Math.round(ovr+15+(sc-50)*.18+(D.pot||0)+randn()*2.5),ovr+6,95);
 return{A,ovr,pot,sc}}
function revealOVR(){return new Promise(res=>{
 const r=peneiraRating();S.attrs=r.A;S.ovr=r.ovr;S.pot=r.pot;S.peak=r.ovr;S.peakAge=S.age;S.ovrHidden=false;
 const circ=PEN.circ||[];const ok=circ.filter(c=>c.ok).length;const top=Object.entries(S.attrs).filter(([k])=>(POS[S.pos].w[k]||0)>0).sort((a,b)=>b[1]-a[1]).slice(0,3);
 const stars=Math.max(1,Math.min(5,Math.round((r.pot-60)/7)));
 $ov.hidden=false;
 $ov.innerHTML=`<div class="ovwrap reveal"><div class="eyebrow" style="color:var(--gold);letter-spacing:.25em">O veredito dos olheiros</div>
 <div class="rv-card"><div class="rv-ovr mono" id="rvO">40</div><div class="rv-lbl">OVR inicial</div><div class="rv-pot">Potencial ${'★'.repeat(stars)}${'☆'.repeat(5-stars)}</div></div>
 <div class="rv-why"><div><b>${ok}/${circ.length||5}</b><small>circuito</small></div><div><b>${Math.round(r.sc)}</b><small>impressão</small></div><div><b>${esc(POS[S.pos].n)}</b><small>posição</small></div></div>
 <div class="rv-attrs">${top.map(([k,v])=>`<div><span>${ATTR_NAME[k]}</span><i><s style="width:${v}%"></s></i><b class="mono">${v}</b></div>`).join('')}</div>
 <p class="muted" style="font-size:13px;margin:6px 0 10px">Seu nível nasceu do que você fez na peneira. Daqui pra frente ele cresce com treino, vida em ordem e temporadas boas.</p>
 <button class="btn wide" id="rvOk" style="opacity:0">Ver quem te quer</button></div>`;
 const el=document.getElementById('rvO');let v=40;const tick=()=>{v=Math.min(r.ovr,v+1);el.textContent=v;if(v<r.ovr)setTimeout(tick,reduced?0:45);else{el.classList.add('pop');SFX.tone({f:880,dur:.18,gain:.12});document.getElementById('rvOk').style.opacity=1}};setTimeout(tick,500);
 document.getElementById('rvOk').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res()};
})}
const _penResultV5=peneiraResult;peneiraResult=function(...a){if(S.ovrHidden){revealOVR().then(()=>_penResultV5.apply(this,a));return}return _penResultV5.apply(this,a)};
// circuito guarda o atributo de cada estação
// desenvolvimento: treino e vida somam no fim da temporada
const _weeklyV5=weeklyTraining;weeklyTraining=async function(k){const r=await _weeklyV5(k);if(S.st)S.st.trains=(S.st.trains||0)+1;return r};
const _endV5=endSeason;endSeason=function(){const st=S.st;const trains=st&&st.trains||0;const lm=typeof lifeMod==='function'?lifeMod():0;const ls=_endV5();try{
 if(ls){let b=0;const why=[];if(trains>=10){b++;why.push(`${trains} treinos`)}if(lm>=.35){b++;why.push('vida em ordem')}if(lm<=-.35){b--;why.push('vida bagunçada')}
  if(b>0)b=Math.max(0,Math.min(b,S.pot+1-S.ovr));if(b){S.ovr=clamp(S.ovr+b,30,99);if(S.ovr>S.peak){S.peak=S.ovr;S.peakAge=S.age}if(ls.row)ls.row.delta=(ls.row.delta||0)+b;
   ls.news.push({t:'dev',club:S.club,txt:b>0?`Evolução extra (+${b} OVR): ${why.join(' e ')}.`:`Você perdeu rendimento (${b} OVR): ${why.join(' e ')}.`})}}
}catch(e){}return ls};
// textos
try{const hk=document.createElement('style');hk.textContent='';document.head.appendChild(hk)}catch(e){}

// ---------- todo jogo de copa é ao vivo ----------
const _isDecV5=isDecisive;isDecisive=function(it){try{if(it&&(it.k==='ko'||it.k==='grp')){const c=S.st.comps[it.cid];if(c&&c.alive!==false)return true}}catch(e){}return _isDecV5(it)};
const _wantLiveV5=wantLive;wantLive=function(kind){const m=S.liveMode||'decisivos';if(m!=='off'&&(kind==='ko'||kind==='grp'||kind==='tg'))return true;return _wantLiveV5(kind)};

// ---------- balanço: como foi cada competição ----------
function compResult(c){if(!c)return'';if(c.won)return'🏆 Campeão';if(c.out)return`eliminado · ${c.out}`;
 if(c.alive===false&&c.rounds&&c.rounds.length){const rd=c.rounds[Math.min(c.stage,c.rounds.length-1)];return rd?(rd.n==='Final'?'🥈 Vice-campeão':`eliminado · ${rd.n}`):'eliminado'}
 if(c.kind==='yl'||c.gtab)return c.rank?`${c.rank}º lugar`:'Fase de grupos';return'Participou'}
function compsHTML(ls){const rows=[];
 if(ls.leagueName&&!ls.youthSeason)rows.push([LG[(CLUB[ls.row&&ls.row.club]||club()).l]?'🏟️':'🏟️',ls.leagueName,`${ls.rank}º lugar${ls.myMove?ls.myMove.dir==='up'?' · subiu':' · caiu':''}`,ls.rank===1]);
 for(const[k,c]of Object.entries(ls.comps||{})){if(ls.youthSeason&&!c.youth)continue;rows.push([c.won?'🏆':c.youth?'🌱':'🏆',c.n,compResult(c),!!c.won])}
 const st=ls.stats||{};const cats=Object.entries(st).filter(([k,v])=>v&&v.j);
 return`<div class="cmp-list">${rows.map(([ic,n,r,w])=>`<div class="cmp ${w?'win':''}"><span>${ic}</span><b>${esc(n)}</b><em>${esc(r)}</em></div>`).join('')}</div>
 ${cats.length?`<div class="eyebrow" style="margin-top:12px">Seus números por torneio</div><table class="std cmp-t"><thead><tr><th></th><th>J</th><th>${S.pos==='GOL'?'SG':'G'}</th><th>A</th><th>Nota</th></tr></thead><tbody>${cats.map(([k,v])=>`<tr><td>${esc(k)}</td><td class="mono">${v.j}</td><td class="mono">${S.pos==='GOL'?v.cs||0:v.g}</td><td class="mono">${v.a}</td><td class="mono">${v.nn?fmt2(v.ns/v.nn):'—'}</td></tr>`).join('')}</tbody></table>`:''}`}
const _renderReportV5=renderReport;renderReport=function(ls){const r=_renderReportV5(ls);try{
 const card=$app.querySelector('.wrap > section.card');if(!card||!ls)return r;
 const chips=[];if(ls.leagueName&&!ls.youthSeason)chips.push(`${ls.rank}º ${ls.leagueName}`);for(const c of Object.values(ls.comps||{})){if(ls.youthSeason&&!c.youth)continue;chips.push(`${c.won?'🏆 ':''}${c.n}: ${compResult(c).replace('🏆 ','').replace('🥈 ','')}`)}
 const strip=document.createElement('div');strip.className='cmp-strip';strip.innerHTML=chips.slice(0,6).map(t=>`<span class="chip ${/Campeão/.test(t)?'gold':''}">${esc(t)}</span>`).join('');
 const tiles=card.querySelector('.plantiles');const btn=document.createElement('button');btn.className='ptile hot';btn.innerHTML='<span>🏟️</span><b>Competições</b><small>Como foi em cada uma</small>';
 btn.onclick=()=>openPanelHTML('🏟️ Competições',`<section class="card" style="display:grid;gap:8px">${compsHTML(ls)}</section>`);
 if(tiles)tiles.prepend(btn);else{const t=document.createElement('div');t.className='plantiles';t.appendChild(btn);card.appendChild(t)}
 card.insertBefore(strip,card.querySelector('.plantiles'));
}catch(e){console.error(e)}return r};

// ---------- aposentadoria: cutscene + história da vida ----------
function lifeSummary(){const L=[];if(S.rel==='casado'&&S.gf)L.push(`casado com ${S.gf.n}`);else if(S.rel==='divorciado')L.push('divorciado');if(S.filhos)L.push(`${S.filhos} filho${S.filhos>1?'s':''}`);
 if(S.props&&S.props.includes('paisCasa'))L.push('deu uma casa pros pais');if(S.ficha)L.push(`${S.ficha} passagem${S.ficha>1?'ns':''} pela polícia`);if(S.music&&S.music.songs)L.push(`${S.music.songs} música${S.music.songs>1?'s':''} gravada${S.music.songs>1?'s':''}`);return L}
function retireEpilogue(card){const rich=S.din>=5,broke=S.din<.3;const idol=S.idols&&S.idols.length;const ficha=S.ficha>=2;const fam=S.rel==='casado'||S.filhos;
 if(ficha)return'Longe dos gramados, a vida cobrou a conta. Os processos tomaram tempo e dinheiro. Ele diz que, se pudesse, faria tudo diferente fora de campo.';
 if(broke)return'O dinheiro foi embora mais rápido que os anos. Hoje ele treina garotos numa escolinha de bairro e diz que nunca foi tão feliz ensinando.';
 if(idol&&rich)return`Virou embaixador do ${CLUB[S.idols[0]]?CLUB[S.idols[0]].n:'clube'} e comentarista na TV. Nas arquibancadas, o nome dele ainda é cantado.`;
 if(S.music&&S.music.lvl>=70)return'Trocou a chuteira pelo microfone. Os shows lotam, e no meio de cada um a banda toca o hino do clube onde ele foi feliz.';
 if(fam)return'Voltou pra cidade natal, construiu a casa dos sonhos perto dos pais e vê os filhos jogando no mesmo campinho onde tudo começou.';
 if(rich)return'Investiu bem, abriu um centro de treinamento e hoje é dono de um clube da série D. Diz que o próximo craque já está lá.';
 return'Pendurou as chuteiras sem alarde. De vez em quando aparece numa pelada de fim de semana, e todo mundo ainda quer jogar no time dele.'}
function retireCutscene(card){return new Promise(res=>{
 const c=CLUB[S.club]||{};const[c1,c2]=[c.c1||'#ff7a2b',c.c2||'#fff'];const t=TIERS[card.tier]?TIERS[card.tier][1]:'';const first=(S.history[0]&&CLUB[S.history[0].club])?CLUB[S.history[0].club].n:'';
 const life=lifeSummary();const slides=[
  {ic:'🏟️',h:'O último jogo',p:`${c.n||'O estádio'} lotado. ${S.age} anos. A torcida sabe que é a despedida de ${S.name.split(' ')[0]}.`},
  {ic:'👣',h:'Onde tudo começou',p:`Começou aos 16 no ${first}. Foram ${card.history.length} temporadas, ${card.clubs.length} clube${card.clubs.length>1?'s':''} e o auge com ${card.peak} de OVR aos ${card.peakAge} anos.`},
  {ic:'🏆',h:'O que ficou',p:`${card.tot.games} jogos, ${S.pos==='GOL'?card.tot.cs+' sem sofrer gol':card.tot.goals+' gols'}, ${card.nTitles} títulos${card.bolas?`, ${card.bolas} Bola${card.bolas>1?'s':''} de Ouro`:''}.${S.idols.length?` Ídolo de ${S.idols.map(id=>CLUB[id]?CLUB[id].n:id).join(' e ')}.`:''}`},
  {ic:'🏠',h:'A vida',p:life.length?`Fora de campo: ${life.join(', ')}. Patrimônio de ${money(S.din)}.`:`Fora de campo, uma vida discreta. Patrimônio de ${money(S.din)}.`},
  {ic:'🌅',h:'E depois?',p:retireEpilogue(card)},
 ];
 let i=0;
 $ov.hidden=false;
 $ov.innerHTML=`<div class="ovwrap cut" style="--c1:${c1};--c2:${c2}"><div class="cut-sky"><i></i><i></i><i></i></div><div class="cut-crowd"></div><div class="cut-pitch"></div>
 <div class="cut-player"><svg viewBox="0 0 60 120"><circle cx="30" cy="14" r="10" fill="#1a1a1a"/><path d="M14 30h32l-4 40H18z" fill="${c1}"/><path d="M18 70h24l-2 14H20z" fill="#111"/><path d="M20 84l-4 34h8l6-30 6 30h8l-4-34z" fill="#1a1a1a"/><path d="M14 32l-8 30 6 2 8-26zM46 32l8 30-6 2-8-26z" fill="${c1}"/><text x="30" y="56" text-anchor="middle" font-size="16" font-weight="900" fill="${c2}">${S.shirt||S.num}</text></svg></div>
 <div class="cut-txt" id="cutT"></div><div class="cut-dots">${slides.map((_,k)=>`<i data-k="${k}"></i>`).join('')}</div><button class="btn wide" id="cutNx">Próximo</button><div class="cut-tier">${esc(t)}</div></div>`;
 const show=()=>{const s=slides[i];document.getElementById('cutT').innerHTML=`<div class="cut-ic">${s.ic}</div><h2>${esc(s.h)}</h2><p>${esc(s.p)}</p>`;$ov.querySelectorAll('.cut-dots i').forEach((d,k)=>d.classList.toggle('on',k<=i));document.getElementById('cutNx').textContent=i===slides.length-1?'Ver a carta final':'Próximo';if(i===0){SFX.roar()}};
 show();document.getElementById('cutNx').onclick=()=>{i++;if(i>=slides.length){$ov.hidden=true;$ov.innerHTML='';res();return}show()};
})}
if(typeof retireShow==='function'){const _rsV5=retireShow;retireShow=async function(card){try{await retireCutscene(card)}catch(e){console.error(e)}return _rsV5(card)}}
// história da despedida coerente com a vida
storyRetire=function(card){const t=TIERS[card.tier]?TIERS[card.tier][1]:'';const life=lifeSummary();return{key:'fim',ic:'👋',title:'A despedida',txt:`${card.tot.games} jogos, ${S.pos==='GOL'?card.tot.cs+' sem sofrer gol':card.tot.goals+' gols'}, ${card.nTitles} títulos. ${life.length?'Fora de campo: '+life.join(', ')+'. ':''}${retireEpilogue(card)} Na história do futebol, o nome de ${S.name} fica como: ${t}.`}};

// ---------- assalto a casa: labirinto, joias e polícia ----------
function mazeGen(w,h){const g=Array.from({length:h},()=>Array(w).fill(1));const st=[[1,1]];g[1][1]=0;
 while(st.length){const[x,y]=st[st.length-1];const nb=shuffle([[2,0],[-2,0],[0,2],[0,-2]]).map(([dx,dy])=>[x+dx,y+dy,dx,dy]).filter(([nx,ny])=>nx>0&&ny>0&&nx<w-1&&ny<h-1&&g[ny][nx]===1);
  if(!nb.length){st.pop();continue}const[nx,ny,dx,dy]=nb[0];g[y+dy/2][x+dx/2]=0;g[ny][nx]=0;st.push([nx,ny])}
 for(let k=0;k<Math.floor(w*h/14);k++){const x=RI(1,w-2),y=RI(1,h-2);if(g[y][x]===1&&((g[y][x-1]===0&&g[y][x+1]===0)||(g[y-1]&&g[y-1][x]===0&&g[y+1]&&g[y+1][x]===0)))g[y][x]=0}
 return g}
function mgAssalto(){return new Promise(res=>{
 const W=11,H=13;const g=mazeGen(W,H);const free=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++)if(!g[y][x])free.push([x,y]);
 const me={x:1,y:1};const exit={x:1,y:1};const far=free.sort((a,b)=>(b[0]+b[1])-(a[0]+a[1]));
 const loot=shuffle(far.slice(0,Math.floor(far.length*.6))).slice(0,5).map(([x,y],i)=>({x,y,ic:['💎','💰','⌚','📺','💍'][i],v:[.012,.008,.006,.004,.01][i]}));
 const cop={x:far[0][0],y:far[0][1],on:false};const dog={x:far[3][0],y:far[3][1]};let got=[],t=35,over=false,alarm=false;
 $ov.hidden=false;
 $ov.innerHTML=`<div class="ovwrap lifemg heist"><div class="lm-top"><span class="tag crime">Lado errado</span><span class="eyebrow">Madrugada</span></div><h2 class="pkh">Assalto à mansão</h2>
 <p class="lm-hint">Pegue as joias e volte pra <b>porta 🚪</b>. Fuja do <b>👮 policial</b> e do <b>🐕 cachorro</b>. Arraste na casa ou use as setas.</p>
 <div class="hz-hud"><span id="hzT">⏱ 35</span><span id="hzL">💼 0/${loot.length}</span><span id="hzA"></span></div><div class="hz" id="hz" style="grid-template-columns:repeat(${W},1fr)"></div>
 <div class="hz-pad"><button data-mv="0,-1">▲</button><div><button data-mv="-1,0">◀</button><button data-mv="1,0">▶</button></div><button data-mv="0,1">▼</button></div><div class="pkres" id="mgRes"></div></div>`;
 const box=document.getElementById('hz');
 const draw=()=>{let h='';for(let y=0;y<H;y++)for(let x=0;x<W;x++){let c=g[y][x]?'w':'f',ic='';if(x===exit.x&&y===exit.y)ic='🚪';const l=loot.find(q=>q.x===x&&q.y===y);if(l)ic=l.ic;if(dog.x===x&&dog.y===y)ic='🐕';if(cop.on&&cop.x===x&&cop.y===y)ic='👮';if(me.x===x&&me.y===y)ic='🥷';h+=`<i class="${c}">${ic}</i>`}box.innerHTML=h;document.getElementById('hzL').textContent=`💼 ${got.length}/${loot.length}`};
 const bfs=(sx,sy,tx,ty)=>{const q=[[sx,sy]];const prev={};prev[sx+','+sy]=null;while(q.length){const[x,y]=q.shift();if(x===tx&&y===ty)break;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=nx+','+ny;if(g[ny]&&g[ny][nx]===0&&!(k in prev)){prev[k]=[x,y];q.push([nx,ny])}}}
  let k=tx+','+ty;if(!(k in prev))return null;let cur=[tx,ty],p=prev[k];while(p&&!(p[0]===sx&&p[1]===sy)){cur=p;p=prev[p[0]+','+p[1]]}return cur};
 const caught=()=>(cop.on&&cop.x===me.x&&cop.y===me.y)||(dog.x===me.x&&dog.y===me.y);
 const end=(kind)=>{if(over)return;over=true;clearInterval(ti);clearInterval(ci);const val=got.reduce((s,q)=>s+q.v,0);
  swEnd(kind==='ok',kind==='ok'?`Saiu com ${got.length} ite${got.length===1?'m':'ns'}`:kind==='dog'?'O cachorro te pegou!':kind==='cop'?'Algemado!':'O tempo acabou',kind==='ok'&&got.length===loot.length).then(()=>res({kind,got:got.length,val}))};
 const move=(dx,dy)=>{if(over)return;const nx=me.x+dx,ny=me.y+dy;if(!g[ny]||g[ny][nx])return;me.x=nx;me.y=ny;SFX.tone({f:300,dur:.04,gain:.05});
  const i=loot.findIndex(q=>q.x===nx&&q.y===ny);if(i>=0){got.push(loot.splice(i,1)[0]);SFX.tone({f:900,dur:.1,gain:.1});if(!alarm&&ch(.35)){alarm=true;cop.on=true;document.getElementById('hzA').textContent='🚨 ALARME!';SFX.whistle()}}
  if(caught())return end(dog.x===me.x&&dog.y===me.y?'dog':'cop');if(nx===exit.x&&ny===exit.y&&got.length)return end('ok');draw()};
 $ov.querySelectorAll('[data-mv]').forEach(b=>b.onclick=()=>{const[dx,dy]=b.dataset.mv.split(',').map(Number);move(dx,dy)});
 let sp=null;box.addEventListener('pointerdown',e=>{sp={x:e.clientX,y:e.clientY}});box.addEventListener('pointerup',e=>{if(!sp)return;const dx=e.clientX-sp.x,dy=e.clientY-sp.y;sp=null;if(Math.hypot(dx,dy)<14)return;Math.abs(dx)>Math.abs(dy)?move(Math.sign(dx),0):move(0,Math.sign(dy))});
 const kh=e=>{const m={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]}[e.key];if(m){e.preventDefault();move(...m)}};addEventListener('keydown',kh);
 const ti=setInterval(()=>{t--;document.getElementById('hzT').textContent='⏱ '+t;if(t===24&&!cop.on){cop.on=true;document.getElementById('hzA').textContent='🚔 Polícia chegou';SFX.whistle()}if(t<=0)end('time')},1000);
 let tickN=0;const ci=setInterval(()=>{if(over){removeEventListener('keydown',kh);return}tickN++;
  if(cop.on&&tickN%2===0){const n=bfs(cop.x,cop.y,me.x,me.y);if(n){cop.x=n[0];cop.y=n[1]}}
  if(tickN%3===0){const opts=[[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>[dog.x+dx,dog.y+dy]).filter(([x,y])=>g[y]&&g[y][x]===0);const near=Math.abs(dog.x-me.x)+Math.abs(dog.y-me.y)<=4;let n=near?bfs(dog.x,dog.y,me.x,me.y):null;if(!n&&opts.length)n=pick(opts);if(n){dog.x=n[0];dog.y=n[1]}}
  if(caught())return end(dog.x===me.x&&dog.y===me.y?'dog':'cop');draw()},260);
 draw();
})}
const _lifeActsV5=lifeActs;lifeActs=function(){const A=_lifeActsV5();try{if(S.age>=16){const i=A.findIndex(a=>a.id==='carro');A.splice(i>=0?i+1:A.length,0,{g:'Lado errado',id:'casa',ic:'🏚️',n:'Assaltar uma mansão',d:'Mini game: labirinto, joias, cachorro e polícia.',t:1,c:0,crime:1,mg:true})}}catch(e){}return A};
const _doLifeV5=doLifeAct;doLifeAct=async function(id){if(id!=='casa')return _doLifeV5(id);ensureLife2();
 const r=await mgAssalto();let txt,fx;
 if(r.kind==='ok'){txt=`Saiu pela porta dos fundos com ${r.got} ite${r.got===1?'m':'ns'}. Rendeu ${money(r.val)} no receptador.`;fx={din:r.val,heat:10+r.got*4,disc:-5,torc:-2}}
 else if(r.kind==='time'){txt='O dia clareou e você saiu de mãos vazias. Um vizinho filmou tudo.';fx={heat:20,fama:-3}}
 else{txt=r.kind==='dog'?'O cachorro te segurou até a polícia chegar. Foto na delegacia em todo jornal.':'Algemado no corredor da mansão. Foto na delegacia em todo jornal.';fx={preso:RI(5,10),fama:-6}}
 const chips=applyFx(fx);return{txt,chips}};

// ---------- chuteiras com mais peso ----------
try{BOOTS.forEach(b=>{const pts=Object.values(b.b).reduce((a,c)=>a+c,0);b.mg=Math.round(pts*6);b.d=b.d+` Nos lances: +${b.mg}% de precisão${b.b.FIN?' e efeito':''}${b.b.DRI?', janela do drible maior':''}.`})}catch(e){}
// legenda do lance com a cor dos times (ver fx.js) e chuteira gasta por jogo
const _playMineV5=playMine;playMine=async function(o,io){const r=await _playMineV5(o,io);try{if(r&&r.me&&r.me.play&&S.boot&&S.bootLeft>0){if(S.bootLeft===5&&typeof toast==='function')toast({ic:'👟',title:'Chuteira gastando',txt:'Faltam 5 jogos. Compre outra na Loja.',ms:3200})}}catch(e){}return r};
