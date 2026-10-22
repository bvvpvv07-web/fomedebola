// ================== JORNAL NO INÍCIO: Gazeta da Bola ==================
// No lugar do card do bloco, a primeira página de um jornal: manchete do seu jogador com foto,
// coluna de futebol, notícias do mundo, gente (sua vida fora de campo) e classificados.
// Embaixo: jogos (o próximo primeiro, depois os resultados) e, ao lado, a tabela da competição.
// As notícias mudam a cada rodada (sorteio com semente), então o jornal não troca toda hora.
function npRand(seed){let s=(seed>>>0)||7;return()=>{s^=s<<13;s^=s>>>17;s^=s<<5;return((s>>>0)%1e6)/1e6}}
const npPick=(r,a)=>a[Math.floor(r()*a.length)];
const npSur=()=>{const p=(S.name||'').trim().split(/\s+/);return p.length>1?p[p.length-1]:p[0]};
const npFirst=()=>(S.name||'').trim().split(/\s+/)[0];
const NP_WORLD=[
 ['🌧️','Frente fria derruba as temperaturas no Sul','Meteorologistas preveem mínima de 3 °C no fim de semana e geada em áreas de serra.'],
 ['🚀','Satélite brasileiro entra em órbita','O equipamento vai monitorar queimadas e o desmatamento em tempo real.'],
 ['☕','Preço do café sobe pela terceira semana seguida','Seca nas lavouras e exportação em alta explicam o cafezinho mais caro.'],
 ['🎸','Festival de música lota a orla','Mais de 200 mil pessoas passaram pelos palcos em três dias de shows.'],
 ['🏃','Maratona reúne 30 mil corredores','Prova teve recorde de inscritos e chegada debaixo de muito sol.'],
 ['🔬','Cientistas criam bola que não murcha','Material novo promete fim das bolas furadas nos campos de várzea.'],
 ['🌎','Eclipse poderá ser visto no domingo','Fenômeno começa no fim da tarde; especialistas pedem óculos de proteção.'],
 ['🚲','Cidade inaugura ciclovia de 40 km','Trajeto liga a zona leste ao centro e passa por três parques.'],
 ['🐢','Tartarugas voltam a desovar no litoral','Biólogos contam mais de 4 mil ninhos na temporada.'],
 ['💡','Apagão atinge quatro bairros','Energia voltou depois de duas horas; companhia investiga a causa.'],
 ['🎬','Filme nacional vence prêmio na Europa','Longa sobre um time de várzea emocionou o júri.'],
 ['🍞','Padaria centenária vira patrimônio','O pão francês da casa é o mesmo desde 1923, garantem os donos.'],
 ['🌊','Ressaca fecha praias por dois dias','Ondas de até 3 metros; a Marinha mantém o alerta.'],
 ['🛰️','Internet chega a vilas isoladas da Amazônia','Escolas ribeirinhas já usam a conexão nas aulas.'],
 ['🎨','Mural gigante colore viaduto','Artistas levaram 40 dias para pintar 2 mil metros quadrados.'],
 ['🐶','Feira de adoção encontra lar para 300 cães','Organizadores planejam nova edição no mês que vem.'],
 ['📚','Bienal do livro bate recorde de público','Literatura infantil foi a mais vendida.'],
 ['⛈️','Temporal derruba árvores na capital','Defesa Civil registrou 60 ocorrências em uma noite.'],
 ['🧪','Nova vacina contra gripe chega aos postos','Campanha começa pelos idosos e crianças.'],
 ['🎮','Campeonato de videogame lota ginásio','Final foi decidida no último minuto, como no futebol.'],
];
const NP_ADS=[
 ['🏫','Escolinha do Zé Pereira','Aulas de futebol pra crianças de 6 a 14 anos. Primeira aula grátis.'],
 ['🔧','Conserta-se chuteira','Trava nova, costura e cola. Entrega em 24 h. Falar com Seu Lauro.'],
 ['🏠','Aluga-se kitnet perto do CT','Ideal pra jogador da base. Mobiliada, com Wi-Fi.'],
 ['🥟','Pastel do Português','O pastel que os craques comem depois do treino. Aberto até meia-noite.'],
 ['🚌','Excursão pro jogo','Saída da praça às 14 h. Ida e volta com lanche.'],
 ['💈','Barbearia Pé de Ouro','Corte de jogador em 20 minutos. Hidratação grátis às terças.'],
];
// ---------- fotos (desenhadas com as peças do jogo) ----------
function npPlayerPhoto(opt={}){const c=S.club&&CLUB[S.club];const c1=(c&&c.c1)||'#c8102e',c2=(c&&c.c2)||'#fff';
 return`<div class="np-ph ${opt.bw?'bw':''} ${opt.jail?'jail':''}" style="--c1:${c1};--c2:${c2}"><div class="np-ph-crowd"></div><div class="np-ph-face">${faceSVG(S.face||{preset:0},c1,c2)}</div>${opt.badge?`<span class="np-ph-badge">${opt.badge}</span>`:''}${opt.jail?'<div class="np-ph-bars"></div>':''}</div>`}
function npMatchPhoto(r,bw){return`<div class="np-ph match ${bw?'bw':''}"><div class="np-mt">${shieldHTML(r.home,'lg')}<b>${r.hg}<i>×</i>${r.ag}</b>${shieldHTML(r.away,'lg')}</div></div>`}
function npCrestPhoto(c,bw){return`<div class="np-ph crest ${bw?'bw':''}" style="--c1:${c.c1||'#333'};--c2:${c.c2||'#fff'}">${shieldHTML(c,'lg')}</div>`}
function npIconPhoto(ic,bw=true){return`<div class="np-ph icon ${bw?'bw':''}"><span>${ic}</span></div>`}
// ---------- notícias ----------
function npLastMatch(){const L=(S.st&&S.st.log)||[];for(let i=L.length-1;i>=0;i--){if(L[i].k==='match')return L[i]}return null}
function npMyGoals(){let g=0,a=0,j=0;try{for(const v of Object.values(S.st.stats||{})){if(v&&typeof v==='object'){g+=v.g||0;a+=v.a||0;j+=v.j||0}}}catch(e){}return{g,a,j}}
function npLead(r){const c=club()||{n:'clube'};const sur=npSur(),first=npFirst();const m=npLastMatch();const st=S.st;const me=m&&m.me;const opp=m?(m.home.id===S.club?m.away:m.home):null;const T=npMyGoals();
 if(typeof inPrison==='function'&&inPrison())return{kick:'Polícia',title:`${sur} segue atrás das grades`,deck:`Faltam ${S.prison.left} jogo${S.prison.left>1?'s':''} de pena. No pátio, o craque virou atração.`,body:`Detentos e agentes contam que ${first} joga todo dia no chão de barro do presídio. Lá fora, o ${c.n} segue sem ele e a torcida se divide.`,photo:npPlayerPhoto({jail:true,badge:'🔒'})};
 if(st&&st.done){const pos=(()=>{try{return sortTable(st.table).findIndex(x=>x.id===S.club)+1}catch(e){return 0}})();return{kick:'Balanço',title:`Fim de temporada: ${c.n} termina em ${pos||'?'}º`,deck:`${sur} fecha o ano com ${T.g} gols e ${T.a} assistências em ${T.j} jogos.`,body:`A diretoria já planeja a próxima temporada. O nome de ${first} está no centro das conversas.`,photo:npPlayerPhoto({badge:`${pos||'?'}º`})}}
 const tl=st&&st.titles&&st.titles.length?st.titles[st.titles.length-1]:null;if(tl&&m&&m.final&&m.wdl==='V')return{kick:'Taça',title:`É CAMPEÃO! ${c.n} conquista ${tl.n}`,deck:`${sur} ergue a taça e a festa vai até de madrugada.`,body:`No vestiário, ${first} dedicou o título à família. "Desde o campinho eu sonhava com isso", disse, com a medalha no peito.`,photo:npPlayerPhoto({badge:'🏆'})};
 if(st&&st.injLeft>0)return{kick:'Departamento médico',title:`${sur} se machuca e desfalca o ${c.n}`,deck:`Previsão de ${st.injLeft} jogo${st.injLeft>1?'s':''} fora. O clube corre contra o tempo.`,body:`O atacante deixou o treino mancando. Os médicos falam em recuperação dentro do prazo, se não houver contratempos.`,photo:npPlayerPhoto({bw:false,badge:'🩹'})};
 if(st&&st.suspLeft>0)return{kick:'Tribunal',title:`Suspenso, ${sur} desfalca o ${c.n}`,deck:`Ele cumpre ${st.suspLeft} jogo${st.suspLeft>1?'s':''} de gancho.`,body:'O técnico já testa alternativas no treino. A torcida conta os dias.',photo:npPlayerPhoto({badge:'🟥'})};
 if(me&&me.play&&me.g>=3)return{kick:'Show',title:`${sur} faz ${me.g} e o ${c.n} atropela o ${opp.n}`,deck:`Hat-trick, nota ${me.nota??'-'} e a bola do jogo debaixo do braço.`,body:`Foi a melhor atuação de ${first} na temporada. A arquibancada gritou o nome dele até o apito final.`,photo:npPlayerPhoto({badge:'⚽⚽⚽'})};
 if(me&&me.play&&me.g>=1)return{kick:'Rodada',title:m.wdl==='V'?`Gol de ${sur} garante vitória do ${c.n}`:m.wdl==='E'?`${sur} marca, mas o ${c.n} só empata`:`${sur} marca, mas o ${c.n} perde para o ${opp.n}`,deck:`${m.home.n} ${m.hg} × ${m.ag} ${m.away.n} pelo ${m.comp}.`,body:`${first} chegou a ${T.g} gol${T.g===1?'':'s'} na temporada. ${T.g>=10?'Já é o assunto da rodada.':'A confiança cresce a cada jogo.'}`,photo:npPlayerPhoto({badge:'⚽'})};
 if(me&&me.play&&me.nota!=null&&me.nota>=7.8)return{kick:'Destaque',title:`${sur} comanda o ${c.n} e é eleito o melhor em campo`,deck:`Nota ${me.nota} contra o ${opp.n}.`,body:`Mesmo sem gol, ${first} participou de todas as jogadas importantes.`,photo:npPlayerPhoto({})};
 if(me&&me.play&&me.nota!=null&&me.nota<=5.6)return{kick:'Cobrança',title:`${sur} vai mal e a torcida cobra`,deck:`Nota ${me.nota} no jogo contra o ${opp.n}.`,body:`Nas redes, torcedores pedem mudança. O técnico saiu em defesa: "ele vai dar a volta por cima".`,photo:npPlayerPhoto({bw:true})};
 if(me&&me.play)return{kick:'Rodada',title:m.wdl==='V'?`${c.n} vence o ${opp.n} com ${sur} em campo`:m.wdl==='E'?`${c.n} empata com o ${opp.n}`:`${c.n} perde para o ${opp.n}`,deck:`${m.home.n} ${m.hg} × ${m.ag} ${m.away.n} pelo ${m.comp}. ${sur} jogou ${me.min} minutos${me.nota!=null?', nota '+me.nota:''}.`,body:m.wdl==='D'?`${first} saiu de cabeça baixa. "Agora é levantar e pensar no próximo", disse na saída do vestiário.`:`${first} cumpriu o papel e já pensa no próximo jogo. Na temporada, são ${T.g} gol${T.g===1?'':'s'} e ${T.a} assistência${T.a===1?'':'s'}.`,photo:npPlayerPhoto({bw:m.wdl==='D'}),mood:m.wdl==='D'?'bad':'calm'};
 if(me&&!me.play)return{kick:'Bastidores',title:`No ${me.why==='banco'?'banco':'aguardo'}, ${sur} espera a chance no ${c.n}`,deck:m?`${m.home.n} ${m.hg} × ${m.ag} ${m.away.n} pelo ${m.comp}.`:'',body:`${first} treina forte e conversa com a comissão técnica. "Quando a chance vier, eu vou estar pronto."`,photo:npPlayerPhoto({bw:true})};
 if(S.bl&&S.bl.want&&COUNTRY[S.bl.want])return{kick:'Mercado',title:`${sur} quer jogar na ${COUNTRY[S.bl.want].n}`,deck:'Empresário já conversa com clubes de lá.',body:`A diretoria do ${c.n} não comenta. Nos bastidores, a negociação esquenta.`,photo:npPlayerPhoto({badge:COUNTRY[S.bl.want].f})};
 return{kick:'Temporada',title:`${sur}, ${S.age} anos, é a aposta do ${c.n}`,deck:`Camisa ${S.shirt||S.num}, OVR ${S.ovr} e muita fome de bola.`,body:`Na apresentação, ${first} prometeu trabalho. "Vim pra fazer história aqui."`,photo:npPlayerPhoto({})}}
function npFootball(r){const out=[];const st=S.st;const c=club()||{};
 try{const t=sortTable(st.table);if(t[0]&&!t[0].j){const fav=t.map(x=>CLUB[x.id]).filter(Boolean).sort((x,y)=>(y.s||0)-(x.s||0))[0];if(fav)out.push({kick:LG[st.lg].n,title:fav.id===S.club?`${fav.n} começa o campeonato como favorito`:`Começa o campeonato: ${fav.n} é o favorito`,body:fav.id===S.club?'A cobrança é por título desde a primeira rodada.':`As casas de aposta apontam o ${fav.n}. O ${c.n} quer surpreender.`,photo:npCrestPhoto(fav,true)})}
  else{const ld=CLUB[t[0].id];if(ld){const mine=t.findIndex(x=>x.id===S.club)+1;out.push({kick:LG[st.lg].n,title:ld.id===S.club?`${ld.n} lidera com ${t[0].p} pontos`:`${ld.n} lidera; ${c.n} é o ${mine}º`,body:`${t[0].v} vitórias em ${t[0].j} jogos. ${t[t.length-1]&&CLUB[t[t.length-1].id]?CLUB[t[t.length-1].id].n+' segue na lanterna.':''}`,photo:npCrestPhoto(ld,true)})}}}catch(e){}
 const L=(st&&st.log)||[];const prev=L.filter(x=>x.k==='match').slice(-2,-1)[0];if(prev){const sc=(prev.scorers||[]).filter(s=>!s.us).slice(0,2).map(s=>s.w);out.push({kick:prev.comp,title:`${prev.home.n} ${prev.hg} × ${prev.ag} ${prev.away.n}`,body:`${prev.label||''}. ${sc.length?'Gols de '+sc.join(' e ')+'.':''}`,photo:npMatchPhoto(prev,true)})}
 const others=CLUBS.filter(x=>x.id!==S.club&&x.l===(st?st.lg:'')).slice();if(others.length>=2){const a=npPick(r,others),b=npPick(r,others.filter(x=>x!==a));const t=npPick(r,[`${a.n} prepara proposta por meia do ${b.n}`,`${a.n} demite o técnico depois de três derrotas`,`${a.n} anuncia reforço vindo da Europa`,`Clássico: ${a.n} e ${b.n} empatam no fim`,`${a.n} vende joia da base por €${Math.round(8+r()*40)} mi`]);out.push({kick:'Mercado',title:t,body:'Torcedores lotaram as redes comentando a novidade.',photo:npCrestPhoto(a,true)})}
 return out}
function npGente(){const B=S.bl||{log:[]};const lst=(B.log||[]).filter(e=>e.y===S.year).slice(0,4);const sur=npSur();
 const it=lst.map(e=>({ic:e.ic,t:e.t}));if(S.gf)it.push({ic:'❤️',t:`${sur} e ${S.gf.n} ${S.rel==='casado'?'comemoram mais um mês de casados':'foram vistos jantando juntos'}`});
 if(S.spons&&typeof BT_BRANDS!=='undefined')it.push({ic:'👟',t:`${sur} desfila com a nova ${BT_BRANDS[S.spons.brand].n}`});
 return it.slice(0,4)}
const NP_Q={good:['Trabalhei muito pra isso. A torcida merece.','Hoje deu certo, mas amanhã começa tudo de novo.','Sonhava com isso desde moleque no campinho.','O grupo está fechado. Ninguém segura a gente assim.'],bad:['Não tem desculpa. Vou trabalhar dobrado.','Futebol é isso: semana que vem tem resposta.','Ninguém está mais chateado do que eu.'],calm:['Cabeça no lugar e pé no chão. Um jogo de cada vez.','Estou feliz aqui e quero mais minutos.','O professor sabe o que faz. Vou estar pronto.'],jail:['Aqui dentro a gente aprende a dar valor à bola.','Quero sair, pagar o que devo e voltar a jogar.']};
function npQuoteHTML(r,lead){const T=npMyGoals();const k=lead.mood||({'Polícia':'jail','Taça':'good','Show':'good','Destaque':'good','Departamento médico':'bad','Tribunal':'bad','Cobrança':'bad'}[lead.kick])||(lead.kick==='Rodada'&&/vitória|vence/.test(lead.title)?'good':'calm');const q=npPick(r,NP_Q[k]||NP_Q.calm);
 let nt=0,nn=0;try{for(const v of Object.values(S.st.stats||{})){if(v&&v.nn){nt+=v.ns||0;nn+=v.nn}}}catch(e){}
 return`<blockquote class="np-q">“${esc(q)}”<cite>${esc(S.name)}</cite></blockquote><div class="np-fic"><b>Ficha na temporada</b><span><i>Jogos</i>${T.j}</span><span><i>${S.pos==='GOL'?'Sem sofrer':'Gols'}</i>${S.pos==='GOL'?(()=>{let c=0;try{for(const v of Object.values(S.st.stats||{}))c+=v.cs||0}catch(e){}return c})():T.g}</span><span><i>Assist.</i>${T.a}</span><span><i>Nota</i>${nn?(nt/nn).toFixed(1):'–'}</span><span><i>Geral</i>${S.ovr}</span></div>`}
function npHTML(){if(!S||!S.st)return'';const st=S.st;const seed=(S.year*1000+st.idx*7+(S.st.log||[]).length*31+(S.cid?S.cid.length:0));const r=npRand(seed);
 const lead=npLead(r),fut=npFootball(r),gente=npGente();const w1=npPick(r,NP_WORLD);let w2=npPick(r,NP_WORLD);if(w2===w1)w2=NP_WORLD[(NP_WORLD.indexOf(w1)+5)%NP_WORLD.length];
 const brand=typeof BT_BRANDS!=='undefined'?npPick(r,Object.values(BT_BRANDS).filter(b=>!b.gk)):null;const ad=npPick(r,NP_ADS);
 const nm=typeof nextMatchInfo==='function'?nextMatchInfo():null;const ed=(st.log||[]).filter(x=>x.k==='match').length+1;
 const city={BRA:'São Paulo',ENG:'Londres',ESP:'Madri',ITA:'Milão',GER:'Munique',FRA:'Paris',POR:'Lisboa',NED:'Amsterdã',ARG:'Buenos Aires',USA:'Nova York',KSA:'Riade'}[(club()||{}).country]||'São Paulo';
 return`<article class="np" lang="pt-BR">
 <header class="np-mast"><div class="np-meta"><span>${city}, temporada ${seasonLbl(S.year)}</span><span>Edição nº ${ed}</span><span>R$ 3,00</span></div><h2 class="np-title">Gazeta da Bola</h2><div class="np-sub">O jornal de quem tem fome de bola${nm?` · Hoje: ${esc(nm.comp)}${nm.opp&&CLUB[nm.opp]?' contra o '+esc(CLUB[nm.opp].n):''}`:''}</div></header>
 <div class="np-grid">
  <section class="np-lead"><div class="np-kick">${esc(lead.kick)}</div><h3>${esc(lead.title)}</h3><p class="np-deck">${esc(lead.deck)}</p><figure>${lead.photo}<figcaption>${esc(S.name)} · Foto: Gazeta</figcaption></figure><p class="np-body">${esc(lead.body)}</p>${npQuoteHTML(r,lead)}</section>
  <section class="np-col np-fut"><div class="np-sec">Futebol</div>${fut.map((s,i)=>`<div class="np-item ${i?'':'first'}"><div class="np-kick">${esc(s.kick)}</div>${i===0?`<figure>${s.photo}</figure>`:''}<h4>${esc(s.title)}</h4><p>${esc(s.body)}</p></div>`).join('')}</section>
  <section class="np-col np-mundo"><div class="np-sec">Mundo</div>${[w1,w2].map((w,i)=>`<div class="np-item">${i===0?`<figure>${npIconPhoto(w[0])}</figure>`:''}<h4>${esc(w[1])}</h4><p>${esc(w[2])}</p></div>`).join('')}</section>
  <section class="np-col np-gente"><div class="np-sec">Gente</div>${gente.length?gente.map(g=>`<p class="np-g"><span>${g.ic}</span>${esc(g.t)}</p>`).join(''):`<p class="np-g"><span>🗞️</span>Fora de campo, ${esc(npSur())} anda discreto. Os fotógrafos esperam.</p>`}</section>
  <section class="np-col np-ads"><div class="np-sec">Classificados</div>${brand?`<div class="np-ad big"><b>${brand.ic} ${esc(brand.n)}</b><span>A chuteira dos craques. Já nas lojas.</span></div>`:''}<div class="np-ad"><b>${ad[0]} ${esc(ad[1])}</b><span>${esc(ad[2])}</span></div></section>
 </div></article>`}
// ---------- jogos e tabela ----------
function npGamesHTML(){const st=S.st;const nm=typeof nextMatchInfo==='function'?nextMatchInfo():null;const me=club();const L=(st.log||[]).filter(x=>x.k==='match').slice(-10).reverse();
 const wk=$app.querySelector('.week');const dec=typeof isDecisive==='function'&&isDecisive(nextItem());let blk='';try{if(S.fast&&!dec){const b=blockInfo(st);blk=`Bloco ${b.b} de 4`}}catch(e){}
 const oppC=nm&&nm.opp?CLUB[nm.opp]:null;const H=nm&&nm.home!==false;
 const next=nm?`<div class="npg-next ${dec?'live':''}"><div class="npg-nh"><span>Próximo jogo</span><span>${esc(nm.comp)}${nm.label?' · '+esc(nm.label):''}</span></div>
  <div class="npg-vs">${shieldHTML(H?me:oppC||{n:'?'},'lg')}<div class="npg-x"><b>${H?'Casa':'Fora'}</b>${dec?'<em>ao vivo</em>':blk?`<em>${blk}</em>`:''}</div>${shieldHTML(H?oppC||{n:'?'}:me,'lg')}</div>
  <div class="npg-names"><span>${esc(H?me.n:oppC?oppC.n:'A definir')}</span><span>${esc(H?(oppC?oppC.n:'A definir'):me.n)}</span></div><div class="npg-week"></div></div>`:`<div class="npg-next"><div class="npg-nh"><span>Calendário</span><span>${esc(typeof nextLabel==='function'?nextLabel():'')}</span></div></div>`;
 const row=r=>{const my=r.home.id===S.club?'h':'a';const res=r.wdl;const m=r.me||{};const info=m.play?`${m.g?m.g+'G ':''}${m.a?m.a+'A ':''}${m.nota!=null?m.nota.toFixed(1):''}`:(m.why==='lesionado'||m.inj?'lesionado':m.why||'fora');
  return`<div class="npg-r"><span class="npg-w ${res}">${res||'–'}</span><div class="npg-rm"><small>${esc(r.comp)}${r.label?' · '+esc(r.label):''}</small><div class="npg-sc">${shieldHTML(r.home,'sm')}<b class="${my==='h'?'me':''}">${esc(r.home.a||r.home.n)}</b><span class="mono">${r.hg}–${r.ag}</span><b class="${my==='a'?'me':''}">${esc(r.away.a||r.away.n)}</b>${shieldHTML(r.away,'sm')}</div></div><span class="npg-i mono">${esc(info)}</span></div>`};
 const T=npMyGoals();let nt=0,nn=0;try{for(const v of Object.values(st.stats||{})){if(v&&v.nn){nt+=v.ns||0;nn+=v.nn}}}catch(e){}
 return`<section class="npg card"><div class="npg-h"><b>Jogos</b><button class="lnk" id="npAllG">Ver todos</button></div><div class="npg-sea"><div><b class="mono">${T.j}</b><span>jogos</span></div><div><b class="mono">${S.pos==='GOL'?(()=>{let c=0;try{for(const v of Object.values(st.stats||{}))c+=v.cs||0}catch(e){}return c})():T.g}</b><span>${S.pos==='GOL'?'sem sofrer':'gols'}</span></div><div><b class="mono">${T.a}</b><span>assist.</span></div><div><b class="mono">${nn?(nt/nn).toFixed(1):'–'}</b><span>nota</span></div></div>${next}<div class="npg-list">${L.length?L.map(row).join(''):'<p class="muted" style="margin:10px 0">A temporada ainda não começou. O primeiro jogo está aí em cima.</p>'}</div></section>`}
function npTableHTML(){const st=S.st;let t=[];try{t=sortTable(st.table)}catch(e){}if(!t.length)return'';const L=LG[st.lg];const n=t.length;const down=L.down||0;
 return`<section class="npt card"><div class="npg-h"><b>${esc(L.n)}</b><button class="lnk" id="npAllT">Completa</button></div><table class="npt-t"><thead><tr><th>#</th><th class="l">Clube</th><th>J</th><th>SG</th><th>P</th></tr></thead><tbody>
 ${t.map((x,i)=>{const c=CLUB[x.id]||{n:x.id};const z=i<4?'top':i>=n-down?'down':'';return`<tr class="${x.id===S.club?'me':''} ${z}"><td class="mono">${i+1}</td><td class="l"><span class="npt-c">${shieldHTML(c,'sm')}<span>${esc(c.n)}</span></span></td><td class="mono">${x.j}</td><td class="mono">${x.gp-x.gc>0?'+':''}${x.gp-x.gc}</td><td class="mono"><b>${x.p}</b></td></tr>`}).join('')}</tbody></table></section>`}
function npHub(){if(!document.body.classList.contains('blhub'))return;const w=$app.querySelector('.wrap.hubw');if(!w||!S.st)return;
 const md=w.querySelector(':scope > .matchday, :scope > .blockcard');const wk=md&&md.querySelector('.week');
 const feed=w.querySelector(':scope > .bl-feed');if(feed)feed.remove();
 const box=document.createElement('div');box.className='np-wrap';box.innerHTML=npHTML()+`<div class="np-row">${npGamesHTML()}${npTableHTML()}</div>`;
 if(md){md.replaceWith(box)}else{const first=w.querySelector(':scope > .ev, :scope > section.card');if(first)first.after(box);else w.prepend(box)}
 if(wk){const slot=box.querySelector('.npg-week');if(slot)slot.appendChild(wk)}
 const ag=document.getElementById('npAllG');if(ag)ag.onclick=()=>openHubPanel('jogos');const at=document.getElementById('npAllT');if(at)at.onclick=()=>openHubPanel('tabela')}
{const _rh=renderHub;renderHub=function(...a){const r=_rh.apply(this,a);try{npHub()}catch(e){console.error(e)}return r}}
// o tour aponta pro jornal
if(typeof TOUR_HUB!=='undefined'){const s=TOUR_HUB.find(x=>/semana/i.test(x.t));if(s){s.sel='.np';s.t='O jornal';s.d='Toda rodada sai uma edição nova: a manchete é sobre você, mais futebol, mundo e a sua vida fora de campo. Embaixo, os jogos e a tabela.'}}
{const st=document.createElement('style');st.textContent=`
body.blhub.onescreen #app>.wrap.hubw{display:flex!important;flex-direction:column}
.np-wrap{display:grid;gap:14px}
.np{--ink:#161514;--paper:#ecebe5;--rule:#1d1c1a;background:var(--paper);background-image:radial-gradient(rgba(0,0,0,.035) 1px,transparent 1.2px);background-size:3px 3px;color:var(--ink);border-radius:6px;padding:14px 14px 16px;box-shadow:0 18px 40px rgba(0,0,0,.45),0 0 0 1px rgba(0,0,0,.2);font-family:"Source Serif 4",Georgia,serif}
.np-mast{text-align:center;border-bottom:3px double var(--rule);padding-bottom:8px;margin-bottom:12px}
.np-meta{display:flex;justify-content:space-between;gap:8px;font:600 11px "Source Serif 4",Georgia,serif;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);padding:3px 0;margin-bottom:6px;font-variant:small-caps;letter-spacing:.04em}
.np-title{font:700 clamp(40px,11vw,72px)/.95 "UnifrakturCook","Old English Text MT",serif;margin:4px 0 2px;color:var(--ink);letter-spacing:0;text-transform:none}
.np-sub{font:italic 600 13px "Source Serif 4",Georgia,serif}
.np-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:12px}
.np-kick{font:700 12px "Source Serif 4",Georgia,serif;font-variant:small-caps;letter-spacing:.06em;color:#8a1c12}
.np-lead h3{font:900 clamp(30px,8.6vw,46px)/1.02 "Playfair Display",Georgia,serif;margin:2px 0 6px;color:var(--ink);text-transform:none;letter-spacing:-.01em}
.np-deck{font:italic 600 16px/1.35 "Source Serif 4",Georgia,serif;margin:0 0 8px}
.np figure{margin:0 0 8px}.np figcaption{font:italic 12px "Source Serif 4",Georgia,serif;color:#55524b;margin-top:3px}
.np-body,.np-item p,.np-g{font-size:14.5px;line-height:1.42;margin:0;text-align:justify;hyphens:auto}
.np-q{margin:12px 0 10px;padding:8px 0 8px 14px;border-left:4px solid var(--ink);font:italic 700 19px/1.25 "Playfair Display",Georgia,serif;color:var(--ink)}.np-q cite{display:block;margin-top:4px;font:600 12px var(--f-body);font-style:normal;color:#5b5b54}
.np-fic{display:flex;flex-wrap:wrap;gap:0;border:2px solid var(--ink);margin-top:6px}.np-fic b{flex:1 0 100%;padding:4px 8px;background:var(--ink);color:#ecebe5;font:700 11.5px var(--f-body);letter-spacing:.06em;text-transform:uppercase}.np-fic span{flex:1;display:grid;justify-items:center;padding:6px 2px;border-left:1px solid rgba(16,23,15,.25);font:700 20px "Playfair Display",Georgia,serif;color:var(--ink)}.np-fic span:nth-of-type(1){border-left:0}.np-fic i{font:600 10.5px var(--f-body);font-style:normal;color:#5b5b54}
.np-body::first-letter{float:left;font:900 46px/.8 "Playfair Display",Georgia,serif;margin:4px 6px 0 0}
.np-col{border-top:2px solid var(--rule);padding-top:6px;display:grid;gap:10px;align-content:start}
.np-sec{font:900 italic 20px "Playfair Display",Georgia,serif;border-bottom:1px solid var(--rule);padding-bottom:3px}
.np-item h4{font:800 18px/1.15 "Playfair Display",Georgia,serif;margin:2px 0 4px;color:var(--ink)}
.np-item+.np-item{border-top:1px solid rgba(0,0,0,.25);padding-top:8px}
.np-g{display:flex;gap:8px;align-items:flex-start;text-align:left}.np-g span{font-size:18px;line-height:1.1}.np-g+.np-g{border-top:1px dotted rgba(0,0,0,.35);padding-top:8px}
.np-ad{border:1px solid var(--rule);padding:8px 10px;display:grid;gap:2px;font-size:13px}.np-ad b{font:800 15px "Playfair Display",Georgia,serif}.np-ad.big{border-width:3px;text-align:center}.np-ad.big b{font-size:20px}
.np-ph{position:relative;height:200px;overflow:hidden;background:linear-gradient(160deg,var(--c1,#555),color-mix(in srgb,var(--c1,#555) 55%,#000));display:grid;place-items:end center;border:1px solid var(--rule)}
.np-ph-crowd{position:absolute;inset:0;background:radial-gradient(circle at 20% 30%,rgba(255,255,255,.25) 2px,transparent 3px) 0 0/14px 12px,radial-gradient(circle at 60% 70%,color-mix(in srgb,var(--c2,#fff) 45%,transparent) 2px,transparent 3px) 0 0/11px 10px;opacity:.55}
.np-ph-face{position:relative;width:min(220px,62%);margin-bottom:-6px}.np-ph-face svg,.np-ph-face img{width:100%;height:auto;display:block}
.np-ph-badge{position:absolute;top:10px;right:10px;padding:4px 10px;background:#fff;color:#111;font:900 18px "Playfair Display",Georgia,serif;border:2px solid #111}
.np-ph.bw,.np-col .np-ph{filter:grayscale(1) contrast(1.15)}
.np-ph.bw::after,.np-col .np-ph::after{content:"";position:absolute;inset:0;background:radial-gradient(rgba(0,0,0,.28) 1px,transparent 1.4px) 0 0/4px 4px;mix-blend-mode:multiply;pointer-events:none}
.np-ph.jail .np-ph-bars{position:absolute;inset:0;background:repeating-linear-gradient(90deg,transparent 0 26px,#2a2a2a 26px 34px);opacity:.9}
.np-col .np-ph{height:120px}
.np-ph.match{place-items:center;background:linear-gradient(180deg,#2d5b3c,#173825)}.np-mt{display:flex;gap:12px;align-items:center}.np-mt b{font:900 34px "Playfair Display",Georgia,serif;color:#fff}.np-mt i{font-style:normal;margin:0 4px;opacity:.7}
.np-ph.crest{place-items:center}.np-ph.crest .shield,.np-ph.match .shield{width:62px;height:70px}
.np-ph.icon{place-items:center;background:linear-gradient(160deg,#8a8f99,#3b3f46)}.np-ph.icon span{font-size:64px}
/* jogos e tabela */
.np-row{display:grid;grid-template-columns:minmax(0,1fr);gap:14px}
.npg,.npt{display:grid;gap:10px;padding:14px}
.npg-h{display:flex;justify-content:space-between;align-items:baseline}.npg-h b{font:900 italic 22px var(--f-display);text-transform:uppercase}.npg-h .lnk{color:var(--accent);font-weight:700;background:none;border:0}
.npg-next{display:grid;gap:8px;padding:12px;border-radius:var(--r-md,12px);background:radial-gradient(120% 90% at 50% 0%,rgba(242,196,67,.14),transparent 60%),var(--panel-2);border:1px solid rgba(242,196,67,.4)}.npg-next.live{border-color:var(--bad)}
.npg-nh{display:flex;justify-content:space-between;gap:8px;font-size:12.5px;font-weight:700;color:var(--muted)}.npg-nh span:first-child{color:var(--gold)}
.npg-vs{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;justify-items:center}.npg-vs .shield{width:56px;height:62px}.npg-x{display:grid;justify-items:center;gap:3px}.npg-x b{font:900 italic 26px var(--f-display);text-transform:uppercase;color:var(--gold)}.npg-x em{font-style:normal;font-size:11.5px;font-weight:800;padding:2px 8px;border-radius:999px;background:var(--bad);color:#fff}.npg-next:not(.live) .npg-x em{background:var(--panel-3);color:var(--chalk)}
.npg-names{display:grid;grid-template-columns:1fr 1fr;text-align:center;font-weight:700;font-size:14px}
.npg-week .week{margin:0}
.npg-list{display:grid;gap:6px}
.npg-sea{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.npg-sea div{display:grid;justify-items:center;padding:6px 4px;border-radius:10px;background:rgba(5,16,10,.35);border:1px solid var(--line)}.npg-sea b{font-size:20px}.npg-sea span{font-size:11.5px;color:var(--muted)}
.npg-r{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;background:rgba(5,16,10,.35);border:1px solid var(--line)}
.npg-w{flex:0 0 28px;height:28px;border-radius:8px;display:grid;place-items:center;font:900 15px var(--f-display);color:#111}.npg-w.V{background:var(--good)}.npg-w.D{background:var(--bad);color:#fff}.npg-w.E,.npg-w:not(.V):not(.D){background:#cfd6c8}
.npg-rm{display:grid;gap:2px;min-width:0;flex:1}.npg-rm small{font-size:11.5px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.npg-sc{display:flex;align-items:center;gap:6px;font-size:14px;min-width:0}.npg-sc .shield{width:20px;height:22px;flex:0 0 auto}.npg-sc b{font-weight:700;white-space:nowrap}.npg-sc b.me{color:var(--gold)}.npg-sc span{font-weight:700;padding:0 2px}
.npg-i{flex:0 0 auto;font-size:12px;color:var(--chalk);text-align:right;max-width:90px}
.npt-t{width:100%;border-collapse:collapse;font-size:13px}.npt-t th{font-size:11.5px;color:var(--muted);font-weight:700;text-align:center;padding:4px}.npt-t th.l,.npt-t td.l{text-align:left}
.npt-t td{padding:5px 4px;text-align:center;border-top:1px solid var(--line)}.npt-t tr.me td{background:rgba(242,196,67,.14);color:var(--gold);font-weight:800}.npt-t tr.top td:first-child{box-shadow:inset 3px 0 0 var(--good)}.npt-t tr.down td:first-child{box-shadow:inset 3px 0 0 var(--bad)}
.npt-c{display:flex;align-items:center;gap:6px;min-width:0}.npt-c .shield{width:18px;height:20px;flex:0 0 auto}.npt-c span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:150px}
@media (min-width:700px){
 .np{padding:20px 22px 22px}
 .np-grid{grid-template-columns:repeat(6,minmax(0,1fr));column-gap:18px;row-gap:14px}
 .np-lead{grid-column:1/5;padding-right:18px;border-right:1px solid var(--rule)}
 .np-fut{grid-column:5/7;border-top:0;padding-top:0}
 .np-mundo{grid-column:1/3}.np-gente{grid-column:3/5;padding-left:2px}.np-ads{grid-column:5/7}
 .np-lead figure{float:right;width:52%;margin:0 0 8px 14px}.np-ph{height:240px}
 .np-row{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);align-items:start}
}
@media (min-width:1100px){.np-lead h3{font-size:50px}.np-ph{height:270px}}
`;document.head.appendChild(st)}
