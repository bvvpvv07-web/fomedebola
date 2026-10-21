// ================== ÁRVORE DE HABILIDADES GRANDE: 8 trilhas × 30 = 240 habilidades ==================
// Bem mais difícil: o XP por nível cresce rápido, cada nível de habilidade custa mais pontos (1, 2, 3, 5 e 8),
// e pra subir de nível na trilha você precisa ter habilidades nela, OVR mínimo e, no topo, feitos de carreira.
// Pontos extras vêm de títulos, prêmios e marcas (gols, jogos, assistências).
// As 12 habilidades antigas continuam com o mesmo id e o mesmo efeito, agora dentro das trilhas.
const SK_COST=[0,1,2,3,5,8],SK_NEED=[0,0,3,7,12,18],SK_OVR=[0,0,0,68,76,83];
const SK_BR=[
 {k:'fin',n:'Finalização',ic:'🎯',col:'#ff6a3d',feat:['g',[100,150,200,300]],t:[
  ['Chute colocado',{FIN:1}],['Bate-pronto',{FIN:1}],['Peito do pé',{FIN:1}],['Chute cruzado',{FIN:1}],['Pé fraco I',{FIN:1}],['Rebote',{FIN:1,lance:1}],['Cabeçada firme',{FIN:1}],['Frieza I',{perf:.1}],
  ['Chute de fora I',{FIN:1}],['Cavadinha',{FIN:1,lance:1}],['Finalização de primeira',{FIN:1}],['Pé fraco II',{FIN:1}],['Pênalti seguro',{FIN:1,MEN:1}],['Faro de gol',{perf:.2}],['Voleio',{FIN:1}],
  ['Pé calibrado',{FIN:1,lance:2},'pe','Chutes 18% mais precisos nos lances.'],['Chute de fora II',{FIN:2}],['Cobrança de falta',{FIN:1,PAS:1}],['Matador',{perf:.3}],['Frieza II',{MEN:1,perf:.1}],['Bicicleta',{FIN:1,lance:2}],
  ['Artilheiro nato',{FIN:2,perf:.2}],['Chute de canhão',{FIN:2}],['Pé fraco III',{FIN:2}],['Folha seca',{FIN:1,PAS:1,lance:2}],['Instinto',{perf:.4}],
  ['Decisivo',{perf:.5},'decisivo','+1,5 de desempenho em todo jogo.'],['Goleador histórico',{FIN:3}],['Rei do pênalti',{FIN:2,MEN:2,lance:3}],['Lenda da área',{FIN:2,perf:.5,fama:2}]]},
 {k:'cri',n:'Criação',ic:'🧠',col:'#3fa2ff',feat:['a',[60,90,130,180]],t:[
  ['Passe curto',{PAS:1}],['Domínio orientado',{PAS:1}],['Passe de primeira',{PAS:1}],['Tabela',{PAS:1}],['Inversão de jogo',{PAS:1}],['Cruzamento I',{PAS:1}],['Leitura de jogo I',{MEN:1}],['Calma com a bola',{PAS:1}],
  ['Lançamento I',{PAS:1}],['Passe em profundidade',{PAS:1,lance:1}],['Cruzamento II',{PAS:1}],['Trivela',{PAS:1}],['Leitura de jogo II',{MEN:1}],['Assistente',{perf:.2}],['Escanteio na cabeça',{PAS:1}],
  ['Visão de jogo',{PAS:1,lance:2},'visao','Passes mais certeiros e a assistência puxa mais pro companheiro.'],['Lançamento II',{PAS:2}],['Passe sem olhar',{PAS:1,lance:1}],['Maestro',{PAS:1,MEN:1}],['Ritmo do jogo',{perf:.3}],['Bola parada',{PAS:2}],
  ['Garçom',{PAS:2,perf:.2}],['Passe de letra',{PAS:1,lance:2}],['Cérebro do time',{MEN:2,PAS:1}],['Lançamento III',{PAS:2}],['Assistência perfeita',{lance:3}],
  ['Camisa 10',{PAS:3,perf:.3}],['Gênio',{PAS:2,MEN:2}],['Regente',{PAS:2,perf:.5}],['Lenda do passe',{PAS:3,fama:2}]]},
 {k:'dri',n:'Drible',ic:'🪄',col:'#b46cff',feat:['j',[150,200,300,400]],t:[
  ['Condução',{DRI:1}],['Ginga',{DRI:1}],['Corte seco',{DRI:1}],['Pedalada',{DRI:1}],['Proteção de bola',{DRI:1}],['Equilíbrio',{DRI:1}],['Finta de corpo',{DRI:1}],['Caneta',{DRI:1,lance:1}],
  ['Elástico',{DRI:1}],['Chapéu',{DRI:1,lance:1}],['Arrancada com bola',{DRI:1,VEL:1}],['Drible da vaca',{DRI:1}],['Lambreta',{DRI:1}],['Malandragem',{perf:.2}],['Um contra um I',{DRI:1,lance:1}],
  ['Drible curto',{DRI:1,lance:2},'drible','Dribles dão mais certo e o marcador desarma menos.'],['Roleta',{DRI:2}],['Um contra um II',{DRI:1,lance:2}],['Imprevisível',{perf:.3}],['Controle total',{DRI:2}],['Ginga brasileira',{DRI:1,fama:1}],
  ['Driblador nato',{DRI:2,perf:.2}],['Dança com a bola',{DRI:2}],['Fura-retranca',{lance:3}],['Elástico duplo',{DRI:2}],['Arte',{DRI:1,fama:2}],
  ['Mágico',{DRI:3,perf:.3}],['Joga bonito',{DRI:2,fama:3}],['Inmarcável',{DRI:2,lance:4}],['Lenda do drible',{DRI:3,perf:.4}]]},
 {k:'vel',n:'Velocidade',ic:'⚡',col:'#f2c443',feat:['j',[120,180,250,350]],t:[
  ['Passada',{VEL:1}],['Largada',{VEL:1}],['Aceleração I',{VEL:1}],['Fôlego I',{VEL:1}],['Pique',{VEL:1}],['Agilidade',{VEL:1}],['Mudança de direção',{VEL:1}],['Coordenação',{VEL:1}],
  ['Aceleração II',{VEL:1}],['Velocidade final',{VEL:1}],['Fôlego II',{VEL:1}],['Contra-ataque',{perf:.2}],['Explosão',{VEL:1}],['Recuperação de bola',{VEL:1,DEF:1}],['Sprint repetido',{VEL:1}],
  ['Arranque',{VEL:1,lance:2},'arranque','Mais rápido com e sem bola nos lances.'],['Flecha',{VEL:2}],['Diagonal',{VEL:1,FIN:1}],['Motor',{perf:.3}],['Aceleração III',{VEL:2}],['Ninguém alcança',{lance:2}],
  ['Foguete',{VEL:2,perf:.2}],['Turbo',{VEL:2}],['Velocista',{VEL:2}],['Atropelo',{VEL:1,FIS:1,lance:2}],['Pulmão de aço',{VEL:1,inj:5}],
  ['Relâmpago',{VEL:3,perf:.3}],['O mais rápido do mundo',{VEL:3,fama:2}],['Imparável',{VEL:2,lance:4}],['Lenda da velocidade',{VEL:3,perf:.4}]]},
 {k:'fis',n:'Físico',ic:'💪',col:'#3cdc5a',feat:['j',[200,280,360,450]],t:[
  ['Musculação',{FIS:1}],['Core',{FIS:1}],['Alongamento',{inj:4}],['Sono regrado',{sau:.1}],['Hidratação',{sau:.1}],['Força',{FIS:1}],['Impulsão',{FIS:1}],['Resistência I',{FIS:1}],
  ['Pulmão',{FIS:1,inj:6},'pulmao','Risco de lesão 25% menor.'],['Pré-treino',{inj:5}],['Resistência II',{FIS:1}],['Jogo aéreo',{FIS:1}],['Ombro a ombro',{FIS:1}],['Recuperação I',{recov:10}],['Crioterapia',{recov:8}],
  ['Tanque',{FIS:2}],['Blindado',{inj:8}],['Recuperação II',{recov:12}],['Gigante',{FIS:2}],['Atleta completo',{FIS:1,VEL:1}],['Saúde de ferro',{sau:.2,inj:5}],
  ['Corpo de aço',{recov:15},'aco','Lesões 40% mais curtas.'],['Muralha física',{FIS:2}],['Nunca se machuca',{inj:10}],['Força bruta',{FIS:2,perf:.1}],['Genética',{sau:.3,age:10}],
  ['Longevidade',{age:15},'longe','Depois dos 31, metade da queda de nível por idade.'],['Máquina',{FIS:3,inj:8}],['Imortal',{age:20,sau:.3}],['Lenda física',{FIS:3,perf:.3}]]},
 {k:'def',n:'Defesa e gol',ic:'🛡️',col:'#20c4bd',feat:['j',[150,220,300,400]],t:[
  ['Posicionamento',{DEF:1}],['Marcação',{DEF:1}],['Desarme',{DEF:1}],['Reflexo I',{REF:1}],['Saída do gol',{REF:1}],['Antecipação',{DEF:1}],['Cobertura',{DEF:1}],['Mãos firmes',{REF:1}],
  ['Carrinho limpo',{DEF:1}],['Interceptação',{DEF:1}],['Jogo aéreo defensivo',{DEF:1,FIS:1}],['Reflexo II',{REF:1}],['Defesa de pênalti',{REF:1,lance:1}],['Pegada',{REF:1}],['Leitura defensiva',{DEF:1,MEN:1}],
  ['Xerife',{DEF:2}],['Paredão',{REF:2}],['Bote certo',{DEF:1,lance:2}],['Voo',{REF:1,lance:2}],['Líder da defesa',{DEF:1,board:1}],['Jogo com os pés',{REF:1,PAS:1}],
  ['Zagueiro de seleção',{DEF:2,perf:.2}],['Muralha',{REF:2,perf:.2}],['Desarme perfeito',{DEF:2}],['Reflexo felino',{REF:2}],['Imbatível',{lance:3}],
  ['Xerife lendário',{DEF:3,perf:.3}],['São goleiro',{REF:3,perf:.3}],['Intransponível',{DEF:2,REF:2}],['Lenda da defesa',{DEF:2,REF:1,fama:2}]]},
 {k:'men',n:'Mental',ic:'🧘',col:'#8fd3ff',feat:['t',[2,4,6,9]],t:[
  ['Foco',{MEN:1}],['Concentração',{MEN:1}],['Disciplina tática',{MEN:1}],['Autoconfiança',{fel:.1}],['Respiração',{MEN:1}],['Estudo de adversário',{xp:3}],['Rotina de campeão',{xp:3}],['Paciência',{MEN:1}],
  ['Frieza',{MEN:1,perf:.1}],['Resiliência',{fel:.15}],['Mentalidade vencedora',{perf:.2}],['Aprendiz',{xp:5}],['Calma sob pressão',{MEN:1,lance:1}],['Liderança I',{board:1}],['Inteligência tática',{MEN:1,int:1}],
  ['Clutch',{perf:.3}],['Mente blindada',{fel:.2,MEN:1}],['Professor',{xp:6}],['Leitura do jogo',{MEN:2}],['Ambição',{xp:4,perf:.1}],['Capitão',{board:2}],
  ['Monstro mental',{MEN:2,perf:.2}],['Obsessão',{xp:8}],['Sangue frio',{lance:3}],['Gestão de pressão',{fel:.25}],['Vencedor',{perf:.4}],
  ['Mentalidade de campeão',{MEN:3,perf:.4}],['Sábio',{xp:12,int:2}],['Zen',{fel:.4,MEN:2}],['Lenda mental',{MEN:3,perf:.3}]]},
 {k:'est',n:'Estrela',ic:'⭐',col:'#ff7aa8',feat:['f',[55,65,75,90]],t:[
  ['Redes sociais',{fama:1}],['Simpatia',{fans:1}],['Boa imagem',{apa:1}],['Entrevistas',{fama:1}],['Marketing pessoal',{din:.0005}],['Autógrafos',{fans:1}],['Postura',{board:1}],['Estilo',{apa:1}],
  ['Carisma',{fama:1},'carisma','+3 de fama todo fim de temporada.'],['Negociação I',{wage:3}],['Garoto-propaganda',{din:.001}],['Querido da torcida',{fans:2}],['Relações públicas',{board:1}],['Influencer',{fama:1}],['Visual de capa',{apa:2}],
  ['Negociador',{wage:4},'negocia','Propostas com salário 10% maior.'],['Ídolo jovem',{fans:2,fama:1}],['Contrato de imagem',{din:.002}],['Marca pessoal',{fama:2}],['Diplomata',{board:2}],['Ícone fashion',{apa:2,fama:1}],
  ['Líder',{board:2},'lider','+4 de diretoria por temporada e mais chance de ser capitão.'],['Estrela global',{fama:3}],['Empresário de si',{wage:5}],['Investidor',{din:.004}],['Embaixador do clube',{fans:3}],
  ['Ídolo',{fans:3},'idolo','A torcida do seu clube sobe toda temporada e sua cabeça fica mais forte.'],['Lenda viva',{fama:4,fans:2}],['Bilionário',{din:.01,wage:5}],['Rei do marketing',{fama:3,din:.006}]]},
];
const SK_TIERS=[8,7,6,5,4];
const SK=[];const SKI={};
SK_BR.forEach((b,bi)=>{let k=0;SK_TIERS.forEach((n,ti)=>{for(let j=0;j<n;j++,k++){const [nm,fx,id,d]=b.t[k];const node={id:id||`${b.k}${ti+1}${'abcdefgh'[j]}`,br:bi,tier:ti+1,n:nm,fx,d:d||null,old:!!id};if(ti===4)node.feat=[b.feat[0],b.feat[1][j]];SK.push(node);SKI[node.id]=node}})});
const SK_FX_NAME={xp:'XP',inj:'risco de lesão',recov:'tempo de lesão',wage:'salário',fama:'fama/temporada',fans:'torcida/temporada',board:'diretoria/temporada',fel:'felicidade/semana',sau:'saúde/semana',perf:'desempenho',din:'por semana',lance:'nos lances',age:'queda por idade',int:'inteligência/temporada',apa:'aparência/temporada'};
function skFxTxt(fx){return Object.entries(fx).map(([k,v])=>ATTR_NAME[k]?`+${v} ${ATTR_NAME[k]}`:k==='inj'||k==='recov'||k==='age'?`−${v}% ${SK_FX_NAME[k]}`:k==='xp'||k==='wage'||k==='lance'?`+${k==='lance'?v*3:v}% ${SK_FX_NAME[k]}`:k==='din'?`+${money(v)} ${SK_FX_NAME[k]}`:k==='perf'?`+${v.toFixed(1)} ${SK_FX_NAME[k]}`:`+${v} ${SK_FX_NAME[k]}`).join(' · ')}
const SK_FEAT={g:['gols na carreira','⚽'],a:['assistências na carreira','🅰️'],j:['jogos na carreira','🏟️'],t:['títulos','🏆'],f:['de fama','⭐']};

// ---------- estado e pontos ----------
function rpgS(){if(!S)return null;S.rpg=S.rpg||{lvl:1,xp:0,pts:0,has:{},total:0};const R0=S.rpg;R0.ms=R0.ms||{};if(R0.seenT==null)R0.seenT=(S.titles||[]).length;if(R0.seenA==null)R0.seenA=(S.awards||[]).length;R0.v=2;return R0}
function rpgNeed(l){return Math.round(90+14*Math.pow(l,1.35))}
function skSum(k){const R0=S&&S.rpg;if(!R0)return 0;let s=0;for(const id in R0.has){const n=SKI[id];if(n&&n.fx[k])s+=n.fx[k]}return s}
function skCount(bi){const R0=rpgS();return SK.filter(n=>n.br===bi&&R0.has[n.id]).length}
function careerTot(){let g=0,a=0,j=0;for(const h of(S.history||[])){g+=h.goals||0;a+=h.assists||0;j+=h.games||0}
 try{if(S.st&&!S.st.done)for(const v of Object.values(S.st.stats||{})){if(v&&typeof v==='object'){g+=v.g||0;a+=v.a||0;j+=v.j||0}}}catch(e){}
 return{g,a,j,t:(S.titles||[]).length,f:Math.round(S.life.fama||0)}}
function skWhy(n){const R0=rpgS();if(R0.has[n.id])return null;const cnt=skCount(n.br);
 if(cnt<SK_NEED[n.tier])return`Precisa de ${SK_NEED[n.tier]} habilidades de ${SK_BR[n.br].n} (tem ${cnt})`;
 if(S.ovr<SK_OVR[n.tier])return`Precisa de OVR ${SK_OVR[n.tier]}`;
 if(n.feat){const T=careerTot();const[k,v]=n.feat;if(T[k]<v)return`Precisa de ${v} ${SK_FEAT[k][0]} (tem ${T[k]})`}
 if(R0.pts<SK_COST[n.tier])return`Custa ${SK_COST[n.tier]} ponto${SK_COST[n.tier]>1?'s':''} (tem ${R0.pts})`;
 return null}
function rpgHas(id){try{return!!(S&&S.rpg&&S.rpg.has[id])}catch(e){return false}}
function skUnlock(id){const R0=rpgS();const n=SKI[id];if(!n||skWhy(n))return false;R0.pts-=SK_COST[n.tier];R0.has[id]=true;try{saveNow('rpg')}catch(e){}return true}
// XP: o mesmo de antes (jogos, lances, treino, balanço), com bônus de XP da árvore
rpgGain=function(n,why){const R0=rpgS();if(!R0||!(n>0))return;n=Math.round(n*(1+Math.min(60,skSum('xp'))/100));R0.xp+=n;R0.total+=n;let up=0;while(R0.xp>=rpgNeed(R0.lvl)){R0.xp-=rpgNeed(R0.lvl);R0.lvl++;R0.pts++;up++}
 if(up){try{toast({ic:'⬆️',title:`Nível ${R0.lvl}!`,txt:`+${up} ponto${up>1?'s':''} de habilidade. Vá em Treino → Árvore.`,ms:3600,kind:'gold'})}catch(e){}}return up};
// marcos e títulos dão pontos extras
function skMilestones(){const R0=rpgS();const T=careerTot();let add=0;const msg=[];
 const M=[['g',[50,100,200,300,400,500],2,'gols'],['j',[100,200,300,400,500,600],1,'jogos'],['a',[50,100,150,200],1,'assistências']];
 for(const[k,list,pts,lbl]of M)for(const v of list){const key=k+v;if(T[k]>=v&&!R0.ms[key]){R0.ms[key]=1;add+=pts;msg.push(`${v} ${lbl}`)}}
 const nt=(S.titles||[]).length,na=(S.awards||[]).length;if(nt>R0.seenT){add+=nt-R0.seenT;msg.push(`${nt-R0.seenT} título${nt-R0.seenT>1?'s':''}`);R0.seenT=nt}if(na>R0.seenA){add+=(na-R0.seenA)*2;msg.push(`${na-R0.seenA} prêmio${na-R0.seenA>1?'s':''}`);R0.seenA=na}
 if(add){R0.pts+=add;try{toast({ic:'🌟',title:`+${add} ponto${add>1?'s':''} de habilidade`,txt:msg.join(' · '),ms:4200,kind:'gold'})}catch(e){}}return add}

// ---------- efeitos ----------
function skAttrBonus(){const o={};for(const k of ATTRS){const v=skSum(k);if(v)o[k]=Math.min(8,v)}return o}
{const _bb=bootBonus;bootBonus=function(){const a={..._bb()};const s=skAttrBonus();for(const k in s)a[k]=(a[k]||0)+s[k];return a}}
// bootBonus antes só valia com chuteira; agora a árvore vale sempre
effAttrs=function(){const A={...CA()};const b=bootBonus();for(const k in b)A[k]=clamp((A[k]||0)+b[k],1,99);return A};
{const _bp=bootPerf;bootPerf=function(){return _bp()+Math.min(2.5,skSum('perf'))}}
function rpgInjK(){return(rpgHas('pulmao')?.75:1)*(1-Math.min(50,skSum('inj'))/100)}
{const _wf=wageFor;wageFor=function(c,ovr){const w=_wf(c,ovr);return Math.round(w*(1+Math.min(30,skSum('wage'))/100))}}
{const _nm=nssMoment;nssMoment=async function(o){const b=Math.min(.18,skSum('lance')*.012);return _nm(b&&o?{...o,skill:clamp((o.skill??.6)+b,.1,.98)}:o)}}
{const _pm=playMine;playMine=async function(o,io){const inj0=S.st?S.st.injLeft||0:0;const r=await _pm(o,io);try{const rc=Math.min(45,skSum('recov'));if(rc&&S.st&&S.st.injLeft>inj0+1){const cut=Math.round((S.st.injLeft-inj0)*rc/100);S.st.injLeft=Math.max(inj0+1,S.st.injLeft-cut)}}catch(e){}return r}}
{const _lt=lifeTick;lifeTick=function(me){const r=_lt(me);try{const f=Math.min(.8,skSum('fel'));if(f)S.life.cab=clamp(S.life.cab+f,0,100);const s=Math.min(.6,skSum('sau'));if(s&&S.life.sau!=null)S.life.sau=clamp(S.life.sau+s,0,100);const d=skSum('din');if(d)S.din+=d}catch(e){}return r}}
{const _es=endSeason;endSeason=function(...a){const ovr0=S.ovr,age0=S.age;const r=_es.apply(this,a);try{
 const ag=Math.min(40,skSum('age'));if(ag&&age0>=31&&S.ovr<ovr0){const back=Math.floor((ovr0-S.ovr)*ag/100);if(back)S.ovr+=back}
 const L=S.life;L.fama=clamp(L.fama+skSum('fama'),0,100);S.board=clamp((S.board??50)+skSum('board'),0,100);if(S.club){S.fans=S.fans||{};S.fans[S.club]=clamp((S.fans[S.club]??55)+skSum('fans'),0,100)}
 if(L.int!=null)L.int=clamp(L.int+skSum('int'),0,100);if(L.apa!=null)L.apa=clamp(L.apa+skSum('apa'),0,100);
 skMilestones()}catch(e){console.error(e)}return r}}

// ---------- tela da árvore (página do menu) ----------
let SK_TAB=0;
function skHead(){const R0=rpgS();const need=rpgNeed(R0.lvl);const n=Object.keys(R0.has).filter(id=>SKI[id]).length;
 return`<div class="sk-head"><div class="rpg-lv"><small>NÍVEL</small><b class="mono">${R0.lvl}</b></div><div class="sk-hm"><div class="sk-ht"><b>${R0.pts} ponto${R0.pts===1?'':'s'}</b><span>${n}/240 habilidades</span></div><div class="pbar rpg-bar"><i style="width:${Math.round(R0.xp/need*100)}%"></i></div><small class="mono">${R0.xp}/${need} XP até o nível ${R0.lvl+1}</small></div></div>`}
function skPage(){return{t:'Árvore de habilidades',col:'tree',html:()=>{const R0=rpgS();const b=SK_BR[SK_TAB];const cnt=skCount(SK_TAB);
 const tabs=`<div class="sk-tabs">${SK_BR.map((x,i)=>`<button class="sk-tab ${i===SK_TAB?'on':''}" data-skt="${i}" style="--c:${x.col}"><span>${x.ic}</span><b>${x.n}</b><small>${skCount(i)}/30</small></button>`).join('')}</div>`;
 const tiers=[1,2,3,4,5].map(t=>{const nodes=SK.filter(n=>n.br===SK_TAB&&n.tier===t);const open=cnt>=SK_NEED[t]&&S.ovr>=SK_OVR[t];
  const req=[SK_NEED[t]?`${SK_NEED[t]} habilidades na trilha`:null,SK_OVR[t]?`OVR ${SK_OVR[t]}`:null,t===5?'feito de carreira':null].filter(Boolean).join(' · ');
  return`<div class="sk-tier ${open?'':'shut'}"><div class="sk-th"><b>${['','I','II','III','IV','V'][t]}</b><span>${SK_COST[t]} ponto${SK_COST[t]>1?'s':''} cada</span><small>${open?'✓ liberado':'🔒 '+req}</small></div>
  <div class="sk-grid">${nodes.map(n=>{const on=R0.has[n.id],why=on?null:skWhy(n);return`<button class="sk-n ${on?'on':why?'lock':'can'} ${n.old||t===5?'key':''}" data-sk="${n.id}" style="--c:${b.col}"><b>${on?'✓ ':why?'':'＋ '}${esc(n.n)}</b><small>${esc(n.d||skFxTxt(n.fx))}</small>${n.feat&&!on?`<em>${SK_FEAT[n.feat[0]][1]} ${n.feat[1]} ${SK_FEAT[n.feat[0]][0]}</em>`:''}</button>`}).join('')}</div></div>`}).join('');
 return`${skHead()}<p class="sk-help">Cada nível dá 1 ponto. Títulos, prêmios e marcas da carreira dão pontos extras. Quanto mais alto o nível da trilha, mais caro e mais exigente.</p>${tabs}<div class="sk-br" style="--c:${b.col}"><div class="sk-bh"><span>${b.ic}</span><div><b>${b.n}</b><small>${cnt}/30 destravadas</small></div></div>${tiers}</div>`},
 bind:root=>{root.querySelectorAll('[data-skt]').forEach(x=>x.onclick=()=>{SK_TAB=+x.dataset.skt;blRefresh(true)});
  root.querySelectorAll('[data-sk]').forEach(x=>x.onclick=async()=>{const n=SKI[x.dataset.sk];const R0=rpgS();const on=R0.has[n.id],why=on?null:skWhy(n);
   const r=await blResult({ic:SK_BR[n.br].ic,title:n.n,txt:(n.d?n.d+' ':'')+skFxTxt(n.fx),chips:[[`Nível ${['','I','II','III','IV','V'][n.tier]} · ${SK_COST[n.tier]} ponto${SK_COST[n.tier]>1?'s':''}`,'gold'],...(why?[[why,'down']]:[])],btn:on?'Já destravada':why?'Ok':`Destravar (${SK_COST[n.tier]} pt)`,alt:!on&&!why?'Agora não':null});
   if(r==='ok'&&!on&&!why&&skUnlock(n.id)){try{SFX.tone({f:880,dur:.12,gain:.1})}catch(e){}toast({ic:'✨',title:n.n,txt:skFxTxt(n.fx),ms:2400});blRefresh()}})}}}
// card antigo do início não aparece mais (o nível fica no Treino)
rpgCardHTML=function(){return''};
{const st=document.createElement('style');st.textContent=`
.sk-head{display:flex;gap:12px;align-items:center;padding:12px 14px;border-radius:var(--r-lg);background:var(--panel-2);border:1px solid var(--line)}.sk-head .rpg-lv{flex:0 0 auto}.sk-hm{flex:1;display:grid;gap:5px;min-width:0}.sk-ht{display:flex;justify-content:space-between;gap:8px;align-items:baseline}.sk-ht b{font-size:16px}.sk-ht span{color:var(--muted);font-size:13px}.sk-hm small{color:var(--muted)}
.sk-help{margin:4px 2px;font-size:13px;color:var(--muted)}
.sk-tabs{display:flex;gap:6px;overflow-x:auto;padding:2px 0 6px;scrollbar-width:none;min-height:82px}.sk-tabs::-webkit-scrollbar{display:none}
.sk-tab{flex:0 0 auto;display:grid;justify-items:center;gap:1px;min-width:80px;padding:8px 6px;border-radius:var(--r-md);border:2px solid var(--line);background:var(--panel);color:var(--chalk);font:inherit}.sk-tab span{font-size:22px}.sk-tab b{font-size:12px}.sk-tab small{font:600 11px var(--f-mono);color:var(--muted)}
.sk-tab.on{border-color:var(--c);background:color-mix(in srgb,var(--c) 18%,var(--panel))}
.sk-br{display:grid;gap:8px;grid-template-columns:minmax(0,1fr);min-width:0}.sk-bh{display:flex;gap:10px;align-items:center;padding:10px 14px;border-radius:var(--r-md);background:var(--c);color:var(--ink)}.sk-bh>span{font-size:28px}.sk-bh b{font:900 italic 24px/1 var(--f-display);text-transform:uppercase}.sk-bh small{display:block;font-weight:700;opacity:.8}
.sk-tier{display:grid;gap:8px;grid-template-columns:minmax(0,1fr);min-width:0;padding:10px;border-radius:var(--r-md);background:var(--panel);border:1px solid var(--line)}.sk-tier.shut{background:rgba(20,52,36,.55)}
.sk-th{display:flex;align-items:baseline;gap:10px}.sk-th b{font:900 italic 20px var(--f-display);min-width:28px;color:var(--c)}.sk-th span{font-size:12.5px;font-weight:700;color:var(--chalk)}.sk-th small{margin-left:auto;font-size:12px;color:var(--muted);text-align:right;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sk-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}
.sk-n{display:grid;gap:3px;align-content:start;text-align:left;padding:9px 10px;border-radius:10px;border:1px solid var(--line-2);background:rgba(5,16,10,.35);color:var(--chalk);font:inherit;min-height:60px}
.sk-n b{font-size:13.5px;line-height:1.15}.sk-n small{font-size:11.5px;color:var(--muted);line-height:1.25}.sk-n em{font-style:normal;font-size:11px;font-weight:700;color:var(--gold)}
.sk-n.on{border-color:var(--c);background:color-mix(in srgb,var(--c) 22%,transparent)}.sk-n.on small{color:var(--chalk)}
.sk-n.can{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 14%,transparent);box-shadow:0 0 0 1px var(--accent)}.sk-n.lock{opacity:.55}.sk-n.key{border-width:2px}
@media (min-width:700px){.sk-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
`;document.head.appendChild(st)}
