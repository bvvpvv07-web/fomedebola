// ================== FEED DE NOTÍCIAS NO INÍCIO (estilo Instagram) ==================
// O jornal virou um carrossel de posts: a manchete sobre você, o seu próprio post, o futebol da rodada,
// a fofoca, o patrocinado e o mundo. Arrasta pro lado; toca no post pra abrir inteiro com comentários.
// Embaixo, compacto: o próximo jogo com a semana, os últimos resultados e a tabela.
// Tudo cabe numa tela, sem rolar pra baixo. A edição completa do jornal continua no botão 🗞️.
const FD={likes:{},posts:[],i:0};
const fdSlug=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
function fdK(n){n=Math.round(n);return n>=1e6?(n/1e6).toFixed(1).replace('.',',')+' mi':n>=1e3?(n/1e3).toFixed(1).replace('.',',').replace(',0','')+' mil':String(n)}
function fdAcc(kind){const c=club()||{};const fama=(S.life&&S.life.fama)||0;
 if(kind==='me'){const c1=c.c1||'#c8102e',c2=c.c2||'#fff';return{h:fdSlug(S.name)+(S.shirt||S.num||''),av:`<span class="fd-av face">${faceSVG(S.face||{preset:0},c1,c2)}</span>`,ver:fama>=45}}
 if(kind==='club')return{h:fdSlug(c.n||'clube'),av:`<span class="fd-av crest">${shieldHTML(c,'sm')}</span>`,ver:true};
 const A={gazeta:['gazetadabola','G','#f2efe6','#111',true],mercado:['centraldomercado','💸','#14321f','#fff',false],mundo:['gazeta.mundo','🌎','#16314a','#fff',true],fofoca:['fofocadabola','👀','#4a1640','#fff',false]}[kind]||['gazetadabola','G','#f2efe6','#111',true];
 return{h:A[0],av:`<span class="fd-av" style="background:${A[2]};color:${A[3]}">${A[1]}</span>`,ver:A[4]}}
const FD_COM={good:['QUE JOGADOR 🔥🔥','Esse aí vai longe','Respeita o camisa {n}!','Craque demais, não tem jeito','Meu ídolo 😍','Bola de Ouro já'],
 bad:['Tá devendo…','Banco nele, professor','Já foi melhor 😬','Calma, fase ruim passa','Acredito na volta por cima'],
 calm:['Bora pra cima!','Tô de olho nesse garoto','Vai dar certo 🙏','Próximo jogo é nosso','Fé no trabalho 💪'],
 news:['Não acredito 😮','Alguém explica?','Já era hora','Fonte?','Kkkkkkk','Isso aí vai dar o que falar']};
const FD_FANS=['torcedor_raiz','arquibancada.viva','ze_do_radio','maria.bola','pai_do_craque','lele.futebol','resenha_fc','ultra_fiel','joaozinho2009','tia_da_pipoca','bolanarede','camisa_12'];
function fdPosts(){const st=S.st;const seed=(S.year*1000+st.idx*7+(st.log||[]).length*31+(S.cid?S.cid.length:0));const r=npRand(seed);
 const lead=npLead(r),fut=npFootball(r),gente=npGente();const w1=npPick(r,NP_WORLD);
 const fama=(S.life&&S.life.fama)||0;const base=800+fama*fama*14+(S.ovr-50)*120;const P=[];
 const mood=lead.mood||({'Polícia':'bad','Taça':'good','Show':'good','Destaque':'good','Departamento médico':'bad','Tribunal':'bad','Cobrança':'bad'}[lead.kick])||(/vitória|vence/.test(lead.title)?'good':'calm');
 P.push({id:'lead',acc:'gazeta',t:'1 h',tag:lead.kick,media:lead.photo,title:lead.title,deck:lead.deck,body:lead.body,likes:base*(1.4+r()),mood,lead});
 // o seu próprio post: a frase da semana e a ficha
 const T=npMyGoals();let nt=0,nn=0;try{for(const v of Object.values(st.stats||{})){if(v&&v.nn){nt+=v.ns||0;nn+=v.nn}}}catch(e){}
 const gk=S.pos==='GOL';let cs=0;try{for(const v of Object.values(st.stats||{}))cs+=v.cs||0}catch(e){}
 const q=npPick(r,NP_Q[mood==='bad'&&typeof inPrison==='function'&&inPrison()?'jail':mood]||NP_Q.calm);const c=club()||{};
 P.push({id:'me',acc:'me',t:'3 h',media:`<div class="fd-card" style="--c1:${c.c1||'#c8102e'};--c2:${c.c2||'#fff'}"><span class="fd-q">“${esc(q)}”</span><div class="fd-st"><span><b>${T.j}</b>jogos</span><span><b>${gk?cs:T.g}</b>${gk?'s/ sofrer':'gols'}</span><span><b>${T.a}</b>assist.</span><span><b>${nn?(nt/nn).toFixed(1):'–'}</b>nota</span></div></div>`,title:q,deck:'',body:'',likes:base*(.9+r()*.6),mood});
 fut.forEach((s,i)=>P.push({id:'fut'+i,acc:s.kick==='Mercado'?'mercado':i===1?'club':'gazeta',t:(4+i*3)+' h',tag:s.kick,media:s.photo,title:s.title,deck:'',body:s.body,likes:base*(.25+r()*.5),mood:'news'}));
 if(gente.length){const g=gente[0];P.push({id:'gente',acc:'fofoca',t:'6 h',tag:'Fora de campo',media:npIconPhoto(g.ic,false),title:g.t,deck:'',body:gente.slice(1).map(x=>x.ic+' '+x.t).join('\n'),likes:base*(.5+r()*.8),mood:'news'})}
 const brand=typeof BT_BRANDS!=='undefined'?npPick(r,Object.values(BT_BRANDS).filter(b=>!b.gk)):null;
 if(brand)P.push({id:'ad',acc:'brand',brand,t:'Patrocinado',tag:'Patrocinado',media:`<div class="np-ph icon fd-ad"><span>${brand.ic}</span><b>${esc(brand.n)}</b></div>`,title:`${brand.n}: a chuteira dos craques.`,deck:'',body:'Já nas lojas. Toque em Loja pra ver os modelos.',likes:base*(.1+r()*.2),mood:'news'});
 P.push({id:'mundo',acc:'mundo',t:'1 d',tag:'Mundo',media:npIconPhoto(w1[0],false),title:w1[1],deck:'',body:w1[2],likes:2000+r()*30000,mood:'news'});
 for(const p of P){p.cm=Math.round(p.likes*(.02+r()*.03));p.coms=[0,1,2].map(()=>({u:npPick(r,FD_FANS),t:npPick(r,FD_COM[p.mood]||FD_COM.news).replace('{n}',S.shirt||S.num||10)}))}
 return P}
function fdAccOf(p){if(p.acc==='brand')return{h:fdSlug(p.brand.n)+'.oficial',av:`<span class="fd-av" style="background:#111;color:#fff">${p.brand.ic}</span>`,ver:true};return fdAcc(p.acc)}
function fdPostHTML(p,i){const a=fdAccOf(p);const liked=!!FD.likes[p.id];
 return`<article class="fd-post" data-fi="${i}"><header>${a.av}<b>${esc(a.h)}</b>${a.ver?'<i class="fd-ver">✓</i>':''}<span class="fd-t">${p.t==='Patrocinado'?'Patrocinado':'· '+esc(p.t)}</span></header>
 <div class="fd-media" data-fm="${i}">${p.media}${p.tag&&p.tag!=='Patrocinado'?`<span class="fd-tag">${esc(p.tag)}</span>`:''}</div>
 <div class="fd-act"><button class="fd-like ${liked?'on':''}" data-fl="${i}" aria-label="Curtir">${liked?'♥':'♡'}</button><button data-fo="${i}" aria-label="Comentários">💬</button><span class="fd-lk">${fdK(p.likes+(liked?1:0))} curtidas</span></div>
 <p class="fd-cap" data-fo="${i}"><b>${esc(a.h)}</b> ${esc(p.title)}${p.deck?(/[.!?…:]$/.test(p.title)?' ':'. ')+esc(p.deck):''}</p></article>`}
function fdOpen(i){const p=FD.posts[i];if(!p)return;const a=fdAccOf(p);const liked=!!FD.likes[p.id];
 let extra='';if(p.lead){try{extra=npQuoteHTML(npRand(7),p.lead)}catch(e){}}
 $ov.hidden=false;$ov.innerHTML=`<div class="ovwrap fd-big"><button class="fd-x" id="fdX" aria-label="Fechar">✕</button><article class="fd-post open"><header>${a.av}<b>${esc(a.h)}</b>${a.ver?'<i class="fd-ver">✓</i>':''}<span class="fd-t">${p.t==='Patrocinado'?'Patrocinado':'· '+esc(p.t)}</span></header>
 <div class="fd-media">${p.media}${p.tag&&p.tag!=='Patrocinado'?`<span class="fd-tag">${esc(p.tag)}</span>`:''}</div>
 <div class="fd-act"><button class="fd-like ${liked?'on':''}" id="fdL">${liked?'♥':'♡'}</button><span class="fd-lk">${fdK(p.likes+(liked?1:0))} curtidas</span></div>
 <div class="fd-full"><p><b>${esc(a.h)}</b> <strong>${esc(p.title)}</strong></p>${p.deck?`<p>${esc(p.deck)}</p>`:''}${p.body?`<p>${esc(p.body).replace(/\n/g,'<br>')}</p>`:''}${extra}
 <div class="fd-coms"><small>Ver todos os ${fdK(p.cm)} comentários</small>${p.coms.map(c=>`<p><b>${esc(c.u)}</b> ${esc(c.t)}</p>`).join('')}</div></div></article></div>`;
 const close=()=>{$ov.hidden=true;$ov.innerHTML=''};document.getElementById('fdX').onclick=close;$ov.onclick=e=>{if(e.target===$ov){close();$ov.onclick=null}};
 document.getElementById('fdL').onclick=()=>{FD.likes[p.id]=!FD.likes[p.id];fdOpen(i);fdSync()}}
function fdSync(){document.querySelectorAll('[data-fl]').forEach(b=>{const p=FD.posts[+b.dataset.fl];if(!p)return;const on=!!FD.likes[p.id];b.classList.toggle('on',on);b.textContent=on?'♥':'♡';const lk=b.parentElement.querySelector('.fd-lk');if(lk)lk.textContent=fdK(p.likes+(on?1:0))+' curtidas'})}
function fdNextHTML(){const st=S.st;const nm=typeof nextMatchInfo==='function'?nextMatchInfo():null;const me=club();
 const dec=typeof isDecisive==='function'&&isDecisive(nextItem());let blk='';try{if(S.fast&&!dec){const b=blockInfo(st);blk=`Bloco ${b.b} de 4`}}catch(e){}
 if(!nm)return`<section class="fd-next card"><div class="fd-nh"><span>Calendário</span><span>${esc(typeof nextLabel==='function'?nextLabel():'')}</span></div><div class="fd-week"></div></section>`;
 const oppC=nm.opp?CLUB[nm.opp]:null;const H=nm.home!==false;const A=H?me:oppC||{n:'A definir'},B=H?oppC||{n:'A definir'}:me;
 return`<section class="fd-next card ${dec?'live':''}"><div class="fd-nh"><span>Próximo jogo</span><span>${esc(nm.comp)}${nm.label?' · '+esc(nm.label):''}</span></div>
 <div class="fd-vs"><div class="fd-tm">${shieldHTML(A)}<span>${esc(A.n)}</span></div><div class="fd-mx"><b>${H?'Casa':'Fora'}</b>${dec?'<em>ao vivo</em>':blk?`<em>${blk}</em>`:''}</div><div class="fd-tm r"><span>${esc(B.n)}</span>${shieldHTML(B)}</div></div><div class="fd-week"></div></section>`}
function fdMiniHTML(){const st=S.st;const L=(st.log||[]).filter(x=>x.k==='match').slice(-3).reverse();
 const games=L.length?L.map(m=>{const opp=m.home.id===S.club?m.away:m.home;const g=m.me&&m.me.play?`${m.me.g?m.me.g+'G ':''}${m.me.nota!=null?m.me.nota.toFixed(1):''}`:'–';
  return`<div class="fd-g"><span class="npg-w ${m.wdl}">${m.wdl||'–'}</span>${shieldHTML(opp,'sm')}<b class="mono">${m.hg}–${m.ag}</b><small class="mono">${esc(g)}</small></div>`}).join(''):'<p class="muted">Ainda sem jogos.</p>';
 let tbl='';try{const t=sortTable(st.table);const k=t.findIndex(x=>x.id===S.club);const idx=k<=0?[0,1,2]:k>=t.length-1?[0,k-1,k]:[0,k,k+1];
  tbl=[...new Set(idx)].filter(i=>t[i]).map(i=>{const x=t[i];const c=CLUB[x.id]||{n:x.id};return`<div class="fd-r ${x.id===S.club?'me':''}"><span class="mono">${i+1}</span>${shieldHTML(c,'sm')}<b>${esc(c.a||c.n)}</b><span class="mono">${x.p}</span></div>`}).join('')}catch(e){}
 return`<div class="fd-row"><button class="fd-mini card" id="fdG"><div class="fd-mh"><b>Jogos</b><em>ver todos ›</em></div>${games}</button><button class="fd-mini card" id="fdT"><div class="fd-mh"><b>${esc(LG[st.lg]?LG[st.lg].n:'Tabela')}</b><em>tabela ›</em></div>${tbl}</button></div>`}
function fdHTML(){FD.posts=fdPosts();FD.i=0;
 return`<section class="fd"><div class="fd-h"><b>Notícias</b><span class="fd-n" id="fdN">1/${FD.posts.length}</span><button class="fd-arw" data-fd="-1" aria-label="Anterior">‹</button><button class="fd-arw" data-fd="1" aria-label="Próxima">›</button><button class="fd-paper" id="fdPaper" title="Jornal completo">🗞️</button></div>
 <div class="fd-track" id="fdTrack">${FD.posts.map(fdPostHTML).join('')}</div><div class="fd-dots" id="fdDots">${FD.posts.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div></section>`}
npHub=function(){if(!document.body.classList.contains('blhub'))return;const w=$app.querySelector('.wrap.hubw');if(!w||!S.st)return;
 const md=w.querySelector(':scope > .matchday, :scope > .blockcard');const wk=md&&md.querySelector('.week');
 const feed=w.querySelector(':scope > .bl-feed');if(feed)feed.remove();w.querySelectorAll(':scope > .np-wrap, :scope > .fd-wrap').forEach(x=>x.remove());
 const box=document.createElement('div');box.className='fd-wrap';box.innerHTML=fdHTML()+fdNextHTML()+fdMiniHTML();
 if(md){md.replaceWith(box)}else{const first=w.querySelector(':scope > .ev, :scope > section.card');if(first)first.after(box);else w.prepend(box)}
 if(wk){const slot=box.querySelector('.fd-week');if(slot)slot.appendChild(wk)}else{const s=box.querySelector('.fd-week');if(s)s.remove()}
 document.body.classList.add('fdhub');fdBind(box)};
function fdBind(box){const tr=box.querySelector('#fdTrack');const dots=[...box.querySelectorAll('#fdDots i')];const N=box.querySelector('#fdN');
 const cur=()=>{const p=tr.querySelector('.fd-post');if(!p)return 0;const w=p.offsetWidth+parseFloat(getComputedStyle(tr).columnGap||10);return Math.max(0,Math.min(FD.posts.length-1,Math.round(tr.scrollLeft/w)))};
 let raf=0;tr.addEventListener('scroll',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const i=cur();FD.i=i;dots.forEach((d,k)=>d.classList.toggle('on',k===i));if(N)N.textContent=`${i+1}/${FD.posts.length}`})},{passive:true});
 box.querySelectorAll('[data-fd]').forEach(b=>b.onclick=()=>{const p=tr.querySelector('.fd-post');const w=p.offsetWidth+parseFloat(getComputedStyle(tr).columnGap||10);tr.scrollBy({left:w*+b.dataset.fd,behavior:'smooth'})});
 box.querySelectorAll('[data-fo]').forEach(el=>el.onclick=()=>fdOpen(+el.dataset.fo));
 box.querySelectorAll('[data-fl]').forEach(b=>b.onclick=e=>{e.stopPropagation();const p=FD.posts[+b.dataset.fl];FD.likes[p.id]=!FD.likes[p.id];fdSync();if(FD.likes[p.id]){b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop')}});
 // na foto: toque simples abre o post, toque duplo curte (igual ao Instagram)
 box.querySelectorAll('[data-fm]').forEach(m=>{let t=0,tm=0;m.addEventListener('click',()=>{const i=+m.dataset.fm;const n=Date.now();
  if(n-t<320){clearTimeout(tm);t=0;const p=FD.posts[i];if(p&&!FD.likes[p.id]){FD.likes[p.id]=true;fdSync()}m.classList.remove('heart');void m.offsetWidth;m.classList.add('heart');return}
  t=n;tm=setTimeout(()=>{t=0;fdOpen(i)},320)})});
 const g=box.querySelector('#fdG');if(g)g.onclick=()=>openHubPanel('jogos');const tb=box.querySelector('#fdT');if(tb)tb.onclick=()=>openHubPanel('tabela');
 const pp=box.querySelector('#fdPaper');if(pp)pp.onclick=()=>{$ov.hidden=false;$ov.innerHTML=`<div class="ovwrap fd-paperov"><button class="fd-x" id="fdX">✕</button>${npHTML()}</div>`;document.getElementById('fdX').onclick=()=>{$ov.hidden=true;$ov.innerHTML=''}}}
if(typeof TOUR_HUB!=='undefined'){const s=TOUR_HUB.find(x=>x.sel==='.np');if(s){s.sel='.fd';s.t='Notícias';s.d='Toda rodada chegam posts novos: a manchete sobre você, o seu post, o futebol, a fofoca e o mundo. Arraste pro lado e toque pra abrir. Embaixo, o próximo jogo, os resultados e a tabela.'}}
{const st=document.createElement('style');st.textContent=`
.fd-wrap{display:grid;gap:10px;min-width:0}
.fd{display:grid;gap:6px;min-width:0}
.fd-h{display:flex;align-items:center;gap:8px;padding:0 2px}.fd-h b{font:800 15px var(--f-display);letter-spacing:.06em;text-transform:uppercase}
.fd-n{font:600 12px var(--f-mono,monospace);color:var(--muted);margin-right:auto}
.fd-arw,.fd-paper{border:1px solid var(--line-2);background:var(--panel);color:var(--chalk);border-radius:999px;width:30px;height:30px;display:grid;place-items:center;font-size:18px;line-height:1;cursor:pointer;padding:0}
.fd-paper{font-size:15px}
@media (hover:none){.fd-arw{display:none}}
.fd-track{display:grid;grid-auto-flow:column;grid-auto-columns:min(78%,290px);column-gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;padding:0 2px 2px;overscroll-behavior-x:contain}
.fd-track::-webkit-scrollbar{display:none}
@media (min-width:700px){.fd-track{grid-auto-columns:min(42%,300px)}}
@media (min-width:1050px){.fd-track{grid-auto-columns:min(31%,300px)}}
.fd-post{scroll-snap-align:start;background:var(--panel);border:1px solid var(--line);border-radius:14px;overflow:hidden;display:grid;min-width:0}
.fd-post header{display:flex;align-items:center;gap:7px;padding:7px 9px;min-width:0}
.fd-post header b{font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fd-ver{display:inline-grid;place-items:center;width:14px;height:14px;border-radius:50%;background:#3897f0;color:#fff;font:900 9px/1 sans-serif;font-style:normal;flex:none}
.fd-t{color:var(--muted);font-size:12px;white-space:nowrap;margin-left:auto}
.fd-av{flex:none;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font:900 13px var(--f-display);overflow:hidden;box-shadow:0 0 0 2px var(--panel),0 0 0 3.5px #e1306c}
.fd-av.face{background:#e9e4da}.fd-av.face svg,.fd-av.face img{width:170%;height:auto;margin-top:22%;display:block}
.fd-av.crest{background:#fff}.fd-av.crest .shield{width:20px;height:23px}
.fd-media{position:relative;height:clamp(92px,16.5vh,200px);overflow:hidden;cursor:pointer;background:#111}
.fd-media .np-ph{position:absolute;inset:0;height:auto!important;border:0}
.fd-media .np-ph-face{width:min(150px,46%)}
.fd-media .np-ph-badge{font-size:14px;padding:2px 7px;top:8px;right:8px}
.fd-media .np-ph.icon span{font-size:clamp(40px,7vh,72px)}
.fd-media .np-ph.match .shield,.fd-media .np-ph.crest .shield{width:clamp(40px,6vh,62px);height:clamp(46px,7vh,70px)}
.fd-media .np-mt b{font-size:clamp(22px,4vh,34px)}
.fd-tag{position:absolute;left:8px;bottom:8px;background:rgba(0,0,0,.62);color:#fff;font:800 10.5px var(--f-body);letter-spacing:.08em;text-transform:uppercase;padding:3px 7px;border-radius:6px;backdrop-filter:blur(4px)}
.fd-media.heart::after{content:"♥";position:absolute;inset:0;display:grid;place-items:center;color:#fff;font-size:80px;text-shadow:0 4px 18px rgba(0,0,0,.5);animation:fdHeart .8s ease both;pointer-events:none}
@keyframes fdHeart{0%{transform:scale(.2);opacity:0}25%{transform:scale(1.15);opacity:1}60%{transform:scale(1);opacity:1}100%{transform:scale(1);opacity:0}}
.fd-act{display:flex;align-items:center;gap:4px;padding:3px 6px 0}
.fd-act button{border:0;background:none;color:var(--chalk);font-size:20px;line-height:1;padding:3px 4px;cursor:pointer}
.fd-like.on{color:#ff3b5c}.fd-like.pop{animation:pop .35s}
.fd-lk{margin-left:auto;font-size:12px;font-weight:700;padding-right:4px}
.fd-cap{margin:0;padding:2px 10px 9px;font-size:13px;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;cursor:pointer}
.fd-cap b{margin-right:3px}
.fd-dots{display:flex;justify-content:center;gap:5px}.fd-dots i{width:6px;height:6px;border-radius:50%;background:var(--line-2);transition:.2s}.fd-dots i.on{background:#3897f0;transform:scale(1.15)}
.fd-card{position:absolute;inset:0;display:grid;align-content:center;gap:10px;padding:12px 14px;background:linear-gradient(150deg,var(--c1),color-mix(in srgb,var(--c1) 50%,#000));color:#fff}
.fd-q{font:700 italic clamp(14px,2.2vh,19px)/1.25 "Playfair Display",Georgia,serif;text-shadow:0 1px 2px rgba(0,0,0,.4)}
.fd-st{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}.fd-st span{display:grid;text-align:center;font-size:10.5px;text-transform:uppercase;letter-spacing:.04em;opacity:.9;background:rgba(0,0,0,.25);border-radius:7px;padding:4px 2px}.fd-st b{font:900 17px var(--f-display);letter-spacing:0}
.np-ph.fd-ad{display:grid;place-items:center;align-content:center;gap:4px;background:linear-gradient(135deg,#111,#3a3a3a)}.np-ph.fd-ad b{color:#fff;font:900 22px var(--f-display);letter-spacing:.08em;text-transform:uppercase}
.fd-next{padding:9px 12px;display:grid;gap:6px}.fd-next.live{border-color:#ff6a12;box-shadow:0 0 0 1px rgba(255,106,18,.35)}
.fd-nh{display:flex;justify-content:space-between;gap:8px;font-size:11.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);font-weight:700}.fd-nh span:last-child{text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fd-vs{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:8px}
.fd-tm{display:flex;align-items:center;gap:8px;min-width:0}.fd-tm.r{justify-content:flex-end}.fd-tm span{font-weight:700;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fd-tm .shield{flex:none}
.fd-mx{display:grid;text-align:center}.fd-mx b{font:800 13px var(--f-display);text-transform:uppercase;letter-spacing:.06em}.fd-mx em{font-style:normal;font-size:11px;color:var(--gold);font-weight:700}
.fd-week .week{margin:0}
.fd-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.fd-mini{display:grid;gap:4px;align-content:start;text-align:left;padding:8px 10px;cursor:pointer;color:inherit;font:inherit;min-width:0}
.fd-mh{display:flex;justify-content:space-between;align-items:baseline;gap:6px;margin-bottom:2px;min-width:0}.fd-mh b{font:800 12.5px var(--f-display);text-transform:uppercase;letter-spacing:.05em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fd-mh em{font-style:normal;font-size:11px;color:var(--muted);white-space:nowrap}
.fd-g,.fd-r{display:flex;align-items:center;gap:6px;font-size:12.5px;min-width:0}.fd-g .shield,.fd-r .shield{width:18px;height:21px;flex:none}.fd-g b{margin-left:2px}.fd-g small{margin-left:auto;color:var(--muted)}
.fd-g .npg-w{width:18px;height:18px;font-size:10.5px}
.fd-r span:first-child{width:18px;color:var(--muted)}.fd-r b{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fd-r.me{color:var(--gold);font-weight:800}.fd-r.me span:first-child{color:var(--gold)}
.fd-mini .muted{margin:0;font-size:12px}
.fd-big{max-width:440px;width:100%;position:relative;padding:0;background:none;border:0;box-shadow:none}
.fd-big .fd-post{border-radius:16px}.fd-big .fd-media{height:min(300px,40vh);cursor:default}
.fd-full{padding:4px 12px 14px;display:grid;gap:8px;font-size:14px;line-height:1.45}.fd-full p{margin:0}
.fd-full .np-q{margin:2px 0;font-size:15px}.fd-full .np-fic{margin:0}
.fd-coms{display:grid;gap:5px;border-top:1px solid var(--line);padding-top:8px}.fd-coms small{color:var(--muted)}.fd-coms p{font-size:13.5px}
.fd-x{position:absolute;top:-12px;right:-6px;z-index:2;width:34px;height:34px;border-radius:50%;border:1px solid var(--line-2);background:var(--panel);color:var(--chalk);font-size:16px;cursor:pointer}
.fd-paperov{max-width:820px;width:100%;position:relative;padding:0;background:none;border:0}.fd-paperov .fd-x{top:6px;right:6px}
@media (max-height:720px){.fd-cap{-webkit-line-clamp:1}.fd-dots{display:none}.fd-mini .fd-g:nth-of-type(n+4){display:none}}
/* o feed ocupa o espaço que sobra na tela: em tela alta a foto do post cresce, em tela baixa fica no mínimo */
body.fdhub.onescreen #app>.wrap.hubw>.fd-wrap{flex:1 0 auto;display:flex;flex-direction:column;gap:10px}
body.fdhub.onescreen .fd{flex:1 0 auto;display:flex;flex-direction:column}
body.fdhub.onescreen .fd-track{flex:1 0 auto}
body.fdhub.onescreen .fd-post{display:flex;flex-direction:column}
body.fdhub.onescreen .fd-media{flex:1 1 auto;height:auto;min-height:clamp(92px,16.5vh,200px);max-height:min(44vh,330px)}
.fd-post{align-content:start}
.fd-cap{flex:none;padding:2px 10px 0;margin-bottom:9px;max-height:calc(2 * 1.35em + 2px)}
@media (max-height:720px){.fd-cap{max-height:calc(1.35em + 2px);margin-bottom:7px}}
/* post aberto: legenda alinhada à esquerda, frase e ficha no tema escuro */
.fd-big{text-align:left}.fd-big .fd-post header{padding-right:42px}.fd-full .np-q{--ink:var(--chalk);border-left-color:var(--gold);color:var(--chalk)}.fd-full .np-q cite{color:var(--muted)}
.fd-full .np-fic{--ink:var(--line-2);border-color:var(--line-2);border-radius:10px;overflow:hidden}.fd-full .np-fic b{background:rgba(255,255,255,.06);color:var(--chalk)}
.fd-full .np-fic span{color:var(--chalk);border-left-color:var(--line)}.fd-full .np-fic i{color:var(--muted)}
/* celular baixo (SE e menores): tira jogos/tabela do início (estão em Competições) e encolhe o post */
@media (max-height:700px){.fd-row{display:none}body.fdhub.onescreen .fd-media{min-height:84px}.fd-post header{padding:4px 9px}.fd-wrap{gap:8px}}
`;document.head.appendChild(st)}
