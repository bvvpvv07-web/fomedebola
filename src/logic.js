// ================== UTIL ==================
const rnd=()=>Math.random();
const R=(a,b)=>a+rnd()*(b-a);
const RI=(a,b)=>Math.floor(R(a,b+1));
const pick=a=>a[Math.floor(rnd()*a.length)];
const ch=p=>rnd()<p;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const randn=()=>{let u=0,v=0;while(!u)u=rnd();while(!v)v=rnd();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v)};
const logi=x=>1/(1+Math.exp(-x));
const poisson=l=>{if(l<=0)return 0;const L=Math.exp(-l);let k=0,p=1;do{k++;p*=rnd()}while(p>L);return k-1};
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const wpick=(arr,wf)=>{const ws=arr.map(wf);const t=ws.reduce((s,x)=>s+x,0);let r=rnd()*t;for(let i=0;i<arr.length;i++){r-=ws[i];if(r<=0)return arr[i]}return arr[arr.length-1]};
const hash=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
const seeded=seed=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const fit=(attrs,pos)=>{let s=0;for(const k in POS[pos].w)s+=POS[pos].w[k]*(attrs[k]||0);return Math.round(s)};
// atributos atuais: o perfil sorteado é o teto; o valor de hoje acompanha o OVR
function curAttrs(){const b=S.attrs;const w=POS[S.pos].w;let f=0;for(const k in w)f+=w[k]*(b[k]||0);const gap=f-S.ovr;const o={};for(const k of ATTRS){o[k]=clamp(Math.round(b[k]-gap*(w[k]?1:.85)),15,99)}return o}
const CA=curAttrs;
const stars=s=>s>=86?5:s>=81?4:s>=76?3:s>=70?2:1;
const fakeName=(r=rnd)=>`${FIRST[Math.floor(r()*FIRST.length)]} ${LAST[Math.floor(r()*LAST.length)]}`;
const seasonLbl=y=>`${y}/${String((y+1)%100).padStart(2,'0')}`;
const money=v=>{const a=Math.abs(v);return a>=1?`€${a.toFixed(1).replace('.',',')} mi`:`€${Math.round(a*1000)} mil`};

// ================== CLUBES ==================
const CLUBS=[];const CLUB={};
function mkAbbr(n){return ABBR[n]||n.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^A-Za-z]/g,'').slice(0,3).toUpperCase()}
function buildClubs(){
 CLUBS.length=0;for(const k in CLUB)delete CLUB[k];
 for(const l in CLUB_SRC)for(const row of CLUB_SRC[l].split(';')){const[n,s,c1,c2,uf]=row.split('|');const c={id:n,n,s:+s,base:+s,l,c1,c2,uf:uf||null,a:mkAbbr(n),country:LG[l].c};CLUBS.push(c);CLUB[n]=c}
 for(const conf in EXT_SRC)for(const row of EXT_SRC[conf].split(';')){const[n,s,c1,c2]=row.split('|');CLUB[n]={id:n,n,s:+s,base:+s,l:null,ext:conf,c1,c2,a:mkAbbr(n)}}
}
buildClubs();
const getClub=id=>CLUB[id];
const leagueClubs=l=>CLUBS.filter(c=>c.l===l);
const countryClubs=c=>CLUBS.filter(x=>x.country===c);
const LANG_NAME={pt:'português',en:'inglês',es:'espanhol',it:'italiano',de:'alemão',fr:'francês',nl:'holandês',ar:'árabe',ja:'japonês',ko:'coreano',hr:'croata'};
const allNations=()=>[...Object.entries(NATS).map(([k,v])=>({id:k,n:v.n,f:v.f,s:v.s,c:v.c,nat:true})),...OTHER_NATS.map(([k,n,f,s,c])=>({id:k,n,f,s,c,nat:true}))];

// ================== MUNDO ==================
let S=null,W=null;
function initWorld(){
 W={pos:{},champ:{},cupwin:{},lcupwin:{},contwin:{},stars:[],year:2026,history:[]};
 for(const l in LG){const cl=leagueClubs(l).sort((a,b)=>b.s-a.s);cl.forEach((c,i)=>W.pos[c.id]=i+1);W.champ[l]=cl[0].id}
 for(const c in COUNTRY){const cl=countryClubs(c).filter(x=>LG[x.l].tier===1).sort((a,b)=>b.s-a.s);W.cupwin[c]=cl[1]?cl[1].id:cl[0].id;W.lcupwin[c]=cl[2]?cl[2].id:cl[0].id}
 W.contwin={UCL:'Paris Saint-Germain',UEL:'Tottenham',UECL:'Chelsea',LIB:'Flamengo',SUD:'Lanús',CCC:'Cruz Azul',ACL:'Al-Ahli'};
 W.stars=STAR_SRC.split(';').map(x=>x.trim()).filter(Boolean).map(r=>{const[n,club,pos,nat,born,rt]=r.split('|');return{n,club,pos,nat,born:+born,r:+rt,real:true}}).filter(s=>CLUB[s.club]);
}
function roster(id){
 const real=W.stars.filter(s=>s.club===id).map(s=>({n:s.n,pos:s.pos}));
 const rr=seeded(hash(id+'#'));const fakePos=['ATA','PE','PD','SA','MEI','MC','VOL','ZAG','LE','LD','ME','MD','ATA'];
 const fakes=fakePos.map(p=>({n:fakeName(rr),pos:p}));
 return real.concat(fakes);
}
function natRoster(code){
 const real=W.stars.filter(s=>s.nat===code).map(s=>({n:s.n,pos:s.pos}));
 const rr=seeded(hash(code+'@'));return real.concat(['ATA','PE','PD','SA','MEI','MC','ATA'].map(p=>({n:fakeName(rr),pos:p})));
}
const ATK={ATA:5,SA:4,PE:4,PD:4,PON:4,MEI:3,ME:2.5,MD:2.5,MC:2,VOL:1,LE:1,LD:1,LAT:1,ZAG:1,GOL:0.01};
function scorerFrom(list,exclude){const l=list.filter(p=>p.n!==exclude);return wpick(l,p=>(ATK[p.pos]||1)*(p.star?2.2:1)).n}

// ================== JOGADOR ==================
function newCareer(o){
 initWorld();
 const nat=NATS[o.nat];const D=DIFF[o.diff];const f=fit(o.attrs,o.pos);
 const pot=clamp(Math.round(f*.9+7+D.pot+randn()*3),45,99);
 S={name:o.name,num:o.num,shirt:o.num,nat:o.nat,pos:o.pos,startPos:o.pos,diff:o.diff,attrs:{...o.attrs},pot,
  ovr:clamp(Math.round(40+(pot-40)*.42+randn()*1.5),40,72),age:16,year:2026,club:null,contract:0,wage:1,
  life:{cab:60,corpo:70,disc:60,fama:4},din:0.02,rel:'solteiro',filhos:0,langs:[nat.lang],langYears:{},
  agent:'normal',agentUses:3,history:[],titles:[],awards:[],clubs:{},peak:0,peakAge:16,caps:0,natGoals:0,
  flags:{},used:{},heart:o.heart||null,behavior:'equilibrado',taker:{pen:false,fk:false},captain:false,board:60,
  firstClub:null,loan:null,idols:[],statues:[],done:false,carry:0,adapt:false,lastSeason:null,retiredReason:'',st:null,notes:[]};
 S.peak=S.ovr;return S;
}
const D=()=>DIFF[S.diff];
const club=()=>CLUB[S.club];
const lg=()=>LG[club().l];
function roleFor(ovr,str,age){const d=ovr-str;if(d>=-1)return'Titular';if(d>=-5)return'Rotação';if(d>=-11||age>19)return'Reserva';return'Base'}
function wageFor(c,ovr){const wm=c.l?LG[c.l].wm:.4;return Math.max(1,Math.round(((Math.max(ovr,46)-45)**2)/10*wm*(c.s/80)))}
const BEH={
 profissional:{n:'Profissional ao extremo',d:'Dorme cedo, treina a mais, zero balada.',perf:.8,end:{disc:5,corpo:4,cab:-3,fama:-1}},
 equilibrado:{n:'Equilibrado',d:'Faz o trabalho e curte quando dá.',perf:0,end:{cab:2}},
 estrela:{n:'Vida de estrela',d:'Festas, redes sociais, viagens. Fama sobe, rendimento cai.',perf:-1.3,end:{cab:6,fama:6,disc:-8,corpo:-6}},
};

// ================== EFEITOS ==================
const FX_NAME={ovr:'OVR',cab:'Cabeça',corpo:'Corpo',disc:'Disciplina',fama:'Fama',forma:'Forma',board:'Diretoria'};
function applyFx(fx){
 const chips=[];if(!fx)return chips;const st=S.st;
 for(const k of['ovr','forma','cab','corpo','disc','fama','board']){
  if(!fx[k])continue;const v=Math.round(fx[k]);
  if(k==='ovr'){S.ovr=clamp(S.ovr+v,30,99);if(S.ovr>S.peak){S.peak=S.ovr;S.peakAge=S.age}}
  else if(k==='forma'){if(st)st.forma+=v}
  else if(k==='board'){S.board=clamp(S.board+v,0,100)}
  else S.life[k]=clamp(S.life[k]+v,0,100);
  chips.push([`${v>0?'+':'−'}${Math.abs(v)} ${FX_NAME[k]}`,v>0?'up':'down']);
 }
 if(fx.pot){S.pot=clamp(S.pot+fx.pot,40,99);chips.push([fx.pot>0?'↑ Potencial':'↓ Potencial',fx.pot>0?'up':'down'])}
 if(fx.din){S.din=Math.max(0,S.din+fx.din);chips.push([`${fx.din>0?'+':'−'}${money(fx.din)}`,fx.din>0?'up':'down'])}
 if(fx.inj&&st){const m=Math.max(1,Math.round(fx.inj*40));st.injLeft+=m;chips.push([`Lesão: fora ${m} jogos`,'down'])}
 if(fx.susp&&st){st.suspLeft+=fx.susp;chips.push([`Suspenso ${fx.susp} jogos`,'down'])}
 if(fx.lang&&!S.langs.includes(fx.lang)){S.langs.push(fx.lang);chips.push([`Fala ${LANG_NAME[fx.lang]}`,'up'])}
 if(fx.rel){S.rel=fx.rel;chips.push([fx.rel==='casado'?'Casado':fx.rel==='namorando'?'Namorando':'Solteiro',''])}
 if(fx.filho){S.filhos++;chips.push([S.filhos===1?'Primeiro filho':`${S.filhos}º filho`,'up'])}
 if(fx.agent){S.agent=fx.agent;S.agentUses=fx.agent==='tubarao'?4:fx.agent==='pai'?2:3;chips.push([fx.agent==='tubarao'?'Empresário tubarão':fx.agent==='pai'?'Pai empresário':'Agência séria',''])}
 if(fx.pos){const old=fit(S.attrs,S.pos),nw=fit(S.attrs,fx.pos);S.pos=fx.pos;S.pot=clamp(S.pot+(nw-old),40,99);S.ovr=clamp(S.ovr+Math.round((nw-old)*.6)-1,30,99);chips.push([`Agora é ${POS[fx.pos].n}`,'gold'])}
 if(fx.window){S.flags.window=true;chips.push(['Janela de transferência aberta','gold'])}
 if(fx.release){S.flags.release=true;chips.push(['Clube quer te negociar','down'])}
 if(fx.scout){S.flags.scout=true;chips.push(['Olheiros de olho','gold'])}
 if(fx.risk&&st){st.injRisk+=fx.risk}
 return chips;
}

// ================== EVENTOS ==================
const finP=()=>clamp(.5+(CA().FIN-70)/90+(S.life.cab-50)/300,.2,.92);
const EV=[
{id:'festa',k:'vida',a:[16,36],t:'Festa na véspera do clássico',d:()=>'Seus amigos alugaram uma mansão pra comemorar um aniversário. O clássico é amanhã às 16h.',o:[
 ['Só dou uma passada',()=>ch(.55)?['Você saiu cedo e ninguém viu. Cabeça leve.',{cab:3}]:['Alguém postou um story com você no fundo. O técnico viu.',{disc:-8,fama:2,forma:-2}]],
 ['Fico em casa e durmo cedo',()=>['Dormiu nove horas e acordou voando.',{disc:4,forma:2}],1],
 ['Vou e fico até o fim',()=>ch(.6)?['Noite histórica. O corpo cobrou a conta no jogo.',{cab:5,disc:-12,fama:4,forma:-4}]:['Um vídeo vazou às 4h. Multa do clube e afastamento.',{disc:-16,fama:6,din:-.1,susp:3,forma:-3,board:-10}]]]},
{id:'personal',k:'vida',a:[18,38],c:()=>S.din>=.25,t:'Preparador físico particular',d:()=>`Um preparador que já cuidou de seleções oferece trabalho integral. Custa ${money(Math.max(.15,S.din*.12))} por ano.`,o:[
 ['Contratar',()=>{const c=-Math.max(.15,S.din*.12);return ch(.82)?['Rotina de atleta de elite. O corpo respondeu.',{din:c,corpo:12,risk:-.01}]:['Carga pesada demais no começo. Uma fisgada te tirou umas semanas.',{din:c,corpo:6,inj:.1}]}],
 ['Seguir só com o clube',()=>['Nada muda.',{}],1]]},
{id:'dieta',k:'vida',a:[17,38],t:'Dieta nova',d:()=>'O nutricionista diz que seu corpo vai cobrar caro daqui a uns anos se a alimentação continuar assim.',o:[
 ['Dieta rígida, sem exceção',()=>ch(.7)?['Perdeu gordura e ganhou explosão.',{corpo:9,forma:1}]:['Sofreu demais com a restrição. A cabeça sentiu.',{corpo:5,cab:-7}]],
 ['Ajustar aos poucos',()=>['Mudança pequena, mas constante.',{corpo:4}],1],
 ['Como o que quiser',()=>['Feliz por enquanto.',{corpo:-6,cab:4}]]]},
{id:'celebridade',k:'vida',a:[19,34],c:()=>S.life.fama>=35&&S.rel==='solteiro',t:'Mensagem de uma cantora famosa',d:()=>'Uma cantora com milhões de seguidores começou a curtir suas fotos e mandou mensagem.',o:[
 ['Assumir o namoro em público',()=>ch(.55)?['Casal do momento. Capa de revista.',{fama:14,cab:6,rel:'namorando'}]:['Término público três meses depois. Memes por todo lado.',{fama:9,cab:-12,forma:-3}]],
 ['Namorar longe das câmeras',()=>ch(.6)?['Relação tranquila e discreta.',{cab:8,rel:'namorando'}]:['Não deu certo, mas ninguém ficou sabendo.',{cab:-2}]],
 ['Responder com educação e só',()=>['Foco total no futebol.',{disc:3}],1]]},
{id:'namorada',k:'vida',a:[17,32],c:()=>S.rel==='solteiro',t:'Alguém especial',d:()=>'Você conheceu alguém fora do futebol que te faz esquecer a pressão.',o:[
 ['Investir no relacionamento',()=>ch(.75)?['Começaram a namorar. Você anda mais leve.',{cab:9,rel:'namorando'}]:['Ela não aguentou sua rotina de viagens.',{cab:-5}]],
 ['Agora não, carreira primeiro',()=>['Foco no futebol.',{disc:3,cab:-2}],1]]},
{id:'casamento',k:'vida',a:[21,36],c:()=>S.rel==='namorando',t:'Hora de casar?',d:()=>'Vocês estão juntos há um tempo. A família pergunta quando sai o casamento.',o:[
 ['Pedir em casamento',()=>['Festa linda. Estabilidade em casa.',{cab:10,din:-.08,rel:'casado'}],1],
 ['Ainda não',()=>ch(.5)?['Ela entendeu. Por enquanto.',{}]:['Ela terminou. Doeu.',{cab:-10,rel:'solteiro',forma:-2}]]]},
{id:'filho',k:'vida',a:[22,38],c:()=>S.rel!=='solteiro'&&S.filhos<3,t:'Vem um bebê aí',d:()=>'Vocês vão ter um filho. O parto deve cair na semana de uma decisão.',o:[
 ['Estar no parto, mesmo perdendo o jogo',()=>['Você viu seu filho nascer. Nada paga isso.',{cab:12,filho:1,forma:-1,fama:2}],1],
 ['Jogar a decisão e correr pro hospital',()=>ch(.5)?['Fez gol, dedicou e chegou a tempo.',{cab:8,fama:6,filho:1,forma:2}]:['Chegou depois. A família cobrou.',{cab:-8,filho:1}]]]},
{id:'carro',k:'vida',a:[19,38],c:()=>S.din>=.6,t:'Esportivo na garagem',d:()=>'Uma concessionária oferece um esportivo de €400 mil com desconto de jogador.',o:[
 ['Comprar',()=>ch(.85)?['Chegou ao CT roncando o motor.',{din:-.4,fama:3,cab:3}]:['Bateu numa curva molhada. Nada grave, mas ficou fora.',{din:-.4,inj:.12,fama:4,disc:-5}]],
 ['Não preciso disso',()=>['Dinheiro na conta.',{disc:2}],1]]},
{id:'apostas',k:'vida',a:[18,36],t:'Grupo de apostas',d:()=>'Um colega de elenco te chama pra um grupo de apostas esportivas.',o:[
 ['Entrar no grupo',()=>{const r=rnd();return r<.45?['Ganhou um pouco, perdeu um pouco.',{cab:-3}]:r<.8?['Perdeu bem mais do que imaginava.',{din:-Math.max(.1,S.din*.15),cab:-8}]:['A federação investigou o grupo. Você foi suspenso.',{susp:8,fama:-14,disc:-15,board:-15}]}],
 ['Recusar e alertar o colega',()=>['O colega saiu também. O vestiário te respeita mais.',{disc:5,cab:2}],1],
 ['Recusar calado',()=>['Você ficou fora da confusão.',{}]]]},
{id:'investimento',k:'vida',a:[21,40],c:()=>S.din>=.8,t:'Negócio do amigo',d:()=>`Um amigo de infância quer ${money(S.din*.25)} pra abrir uma rede de restaurantes.`,o:[
 ['Investir',()=>{const v=S.din*.25;return ch(.4)?['A rede deu certo. Dinheiro dobrou.',{din:v,cab:4}]:['Faliu em um ano.',{din:-v,cab:-5}]}],
 ['Recusar',()=>ch(.7)?['Ele entendeu.',{}]:['A amizade esfriou.',{cab:-5}],1]]},
{id:'idioma',k:'vida',a:[16,34],c:()=>S.club&&(!S.langs.includes(COUNTRY[club().country].lang)||!S.langs.includes('en')),t:'Aulas de idioma',d:()=>{const l=!S.langs.includes(COUNTRY[club().country].lang)?COUNTRY[club().country].lang:'en';return `O clube oferece aulas de ${LANG_NAME[l]} três vezes por semana, depois do treino.`},o:[
 ['Fazer as aulas',()=>{const l=!S.langs.includes(COUNTRY[club().country].lang)?COUNTRY[club().country].lang:'en';return ['Você já dá entrevista sem tradutor.',{lang:l,disc:3,cab:3}]},1],
 ['Deixar pra depois',()=>['O cansaço venceu.',{}]]]},
{id:'psicologa',k:'vida',a:[16,40],c:()=>S.life.cab<55,t:'Cabeça cheia',d:()=>'Você anda dormindo mal e explodindo com pouco. O clube tem uma psicóloga do esporte.',o:[
 ['Começar acompanhamento',()=>['Aos poucos, a cabeça voltou pro lugar.',{cab:16}],1],
 ['Resolver sozinho',()=>ch(.45)?['Você deu um jeito.',{cab:4}]:['Piorou. Afetou seus jogos.',{cab:-8,forma:-3}]]]},
{id:'post',k:'vida',a:[17,40],c:()=>S.life.fama>=25,t:'Post antigo viralizou',d:()=>'Uma postagem sua de anos atrás voltou à tona e está gerando polêmica.',o:[
 ['Pedir desculpas publicamente',()=>['A poeira baixou rápido.',{fama:-3,disc:3}],1],
 ['Rebater os críticos',()=>ch(.4)?['A torcida ficou do seu lado.',{fama:8}]:['Virou uma guerra nas redes.',{fama:-12,disc:-6,cab:-6}]],
 ['Sair das redes por um mês',()=>['Silêncio e paz.',{cab:6,fama:-4}]]]},
{id:'social',k:'vida',a:[20,40],c:()=>S.din>=.3,t:'O campinho do seu bairro',d:()=>'O campo onde você aprendeu a jogar está abandonado. A comunidade pede ajuda.',o:[
 ['Bancar a reforma inteira',()=>['Inauguraram com o seu nome.',{din:-Math.max(.15,S.din*.06),fama:8,cab:9}],1],
 ['Mandar camisas autografadas',()=>['Ajudou um pouco.',{fama:1}]],
 ['Não é comigo',()=>['Saiu uma matéria criticando.',{fama:-5}]]]},
{id:'empresario',k:'vida',a:[16,19],once:1,t:'Quem cuida da sua carreira?',d:()=>'Três propostas para te representar chegaram na mesma semana.',o:[
 ['Empresário tubarão, famoso e agressivo',()=>['Ele promete clubes grandes. E cobra caro.',{agent:'tubarao',disc:-3}]],
 ['Agência pequena e séria',()=>['Planejamento de carreira passo a passo.',{agent:'normal',cab:4}],1],
 ['Seu pai cuida de tudo',()=>['Ninguém te defende como ele. Mas ele conhece pouca gente.',{agent:'pai',cab:8}]]]},
{id:'parente',k:'vida',a:[19,40],c:()=>S.din>=.15,t:'Pedido da família',d:()=>'Um tio pede dinheiro emprestado pra quitar dívidas.',o:[
 ['Emprestar',()=>ch(.5)?['Ele devolveu tudo e ainda agradeceu em público.',{cab:4}]:['O dinheiro nunca voltou.',{din:-Math.max(.05,S.din*.06),cab:-5}],1],
 ['Negar',()=>['Clima pesado no almoço de domingo.',{cab:-4}]]]},
{id:'reality',k:'vida',a:[25,38],c:()=>S.life.fama>=55,t:'Convite pra reality show',d:()=>'Uma emissora oferece €1 milhão pra você participar de um reality nas férias.',o:[
 ['Aceitar',()=>['Audiência alta. Pré-temporada perdida.',{din:1,fama:12,corpo:-7,disc:-5}]],
 ['Recusar',()=>['Férias normais.',{disc:2}],1]]},
{id:'rap',k:'vida',a:[18,38],c:()=>S.life.fama>=40,t:'Participação num rap',d:()=>'Um rapper que está no topo das paradas quer você no clipe novo.',o:[
 ['Gravar o clipe',()=>ch(.6)?['O som estourou. Seu verso virou meme bom.',{fama:12,din:.3}]:['Flopou. Os rivais cantam seu verso pra zoar.',{fama:-3,cab:-5}]],
 ['Recusar',()=>['Foco no campo.',{}],1]]},
{id:'patrocinio',k:'vida',a:[19,38],c:()=>S.life.fama>=45,t:'Marca de chuteiras',d:()=>'Uma fabricante global quer você como garoto-propaganda.',o:[
 ['Contrato longo e seguro',()=>['Dinheiro garantido por anos.',{din:+(S.life.fama/45).toFixed(2)}],1],
 ['Lançar sua própria linha',()=>ch(.4)?['Sua chuteira esgotou em horas.',{din:+(S.life.fama/18).toFixed(2),fama:8}]:['Encalhou nas lojas.',{din:-.4,fama:-4}]],
 ['Recusar, uso a que eu gosto',()=>['Nada muda.',{}]]]},
{id:'ferias',k:'vida',a:[17,38],pre:1,t:'Férias',d:()=>'Três semanas de folga antes da pré-temporada.',o:[
 ['Curtir 100%',()=>['Voltou feliz e acima do peso.',{cab:8,corpo:-6}]],
 ['Metade descanso, metade treino',()=>['Equilíbrio.',{cab:3,corpo:2}],1],
 ['Treinar todos os dias',()=>ch(.8)?['Chegou voando na pré-temporada.',{corpo:7,cab:-4,forma:2}]:['Fadiga muscular. Começou a temporada machucado.',{corpo:2,cab:-4,inj:.08}]]]},
{id:'avo',k:'vida',a:[19,36],once:1,t:'Uma perda na família',d:()=>'Seu avô, que te levava nos treinos quando criança, faleceu na véspera de um jogo importante.',o:[
 ['Pedir folga e ir ao velório',()=>['O clube apoiou. Você voltou mais forte depois.',{cab:4}],1],
 ['Jogar e dedicar a ele',()=>ch(.5)?['Fez o gol da vitória e apontou pro céu.',{cab:8,fama:6,forma:2}]:['Não conseguiu jogar bem. Ficou abalado por semanas.',{cab:-12,forma:-3}]]]},
{id:'amigos',k:'vida',a:[18,36],t:'A turma do bairro',d:()=>'Seus amigos de infância querem que você pague uma viagem pra todo mundo.',o:[
 ['Bancar a viagem',()=>['Lembrou quem você é.',{din:-.05,cab:6}],1],
 ['Recusar',()=>['Alguns pararam de te chamar.',{cab:-3}]]]},
{id:'games',k:'vida',a:[16,30],t:'Madrugadas no videogame',d:()=>'Você tem virado as noites jogando online com outros jogadores.',o:[
 ['Cortar de vez',()=>['Dormindo melhor.',{disc:5,corpo:3,cab:-2}]],
 ['Limitar até meia-noite',()=>['Meio termo.',{corpo:2}],1],
 ['Continuar',()=>['O sono foi pro espaço.',{corpo:-6,forma:-2,cab:3}]]]},
{id:'casapais',k:'vida',a:[18,32],once:1,c:()=>S.din>=.4,t:'Casa pros seus pais',d:()=>'Seus pais ainda moram de aluguel no bairro onde você cresceu.',o:[
 ['Comprar a casa dos sonhos deles',()=>['Sua mãe chorou na entrega das chaves.',{din:-Math.max(.3,S.din*.12),cab:14,fama:3}],1],
 ['Esperar o próximo contrato',()=>['Fica pra depois.',{cab:-2}]]]},
{id:'suplemento',k:'vida',a:[18,38],t:'Suplemento milagroso',d:()=>'Um "nutricionista" de fora do clube oferece um suplemento importado que promete explosão muscular.',o:[
 ['Usar escondido',()=>ch(.6)?['Você sentiu diferença.',{corpo:5,forma:2}]:['Caiu no antidoping. Suspensão pesada.',{susp:20,fama:-20,disc:-20,board:-25}]],
 ['Mostrar pro médico do clube',()=>['O médico vetou. Você agradeceu.',{disc:4}],1]]},
{id:'cirurgia',k:'vida',a:[19,37],t:'Dor no joelho',d:()=>'O médico vê uma lesão no menisco. Dá pra operar agora e perder vários jogos, ou fazer infiltração e seguir jogando.',o:[
 ['Operar agora',()=>['Recuperação longa, joelho novo.',{inj:.4,corpo:8}],1],
 ['Infiltração e seguir',()=>ch(.55)?['Aguentou a temporada inteira.',{}]:['O joelho estourou de vez semanas depois.',{inj:.55,corpo:-12,pot:-2,ovr:-1}]]]},
{id:'mudarpais',k:'vida',a:[16,34],c:()=>S.adapt,t:'Saudade de casa',d:()=>'Tudo é diferente no país novo: comida, frio, idioma. Você está isolado.',o:[
 ['Trazer a família pra morar junto',()=>['Casa cheia, cabeça no lugar.',{cab:10,din:-.05}],1],
 ['Se enturmar com o elenco',()=>ch(.6)?['Fez amigos e aprendeu rápido o idioma.',{cab:6,lang:COUNTRY[club().country].lang}]:['Não se encaixou.',{cab:-8,forma:-2}]],
 ['Aguentar sozinho',()=>['Os resultados caíram.',{cab:-8,forma:-3}]]]},
// ---- CAMPO ----
{id:'banco',k:'campo',a:[17,38],t:'Barrado no clássico',d:()=>'O técnico te deixou no banco no maior jogo do ano e não explicou o porquê.',o:[
 ['Treinar dobrado em silêncio',()=>ch(.6)?['Recuperou a vaga com sobras.',{forma:3,disc:6}]:['Ficou mais umas rodadas no banco.',{disc:4,forma:-1}],1],
 ['Reclamar na imprensa',()=>ch(.35)?['A torcida comprou sua briga e o técnico recuou.',{fama:5,forma:2}]:['O vestiário rachou. A diretoria não gostou.',{disc:-10,forma:-3,board:-12,release:1}]],
 ['Pedir pra sair do clube',()=>['A diretoria vai ouvir propostas.',{window:1,cab:-2,board:-5}]]]},
{id:'posicao',k:'campo',a:[17,33],c:()=>NEIGH[S.pos].length>0,t:'Nova função em campo',d:()=>{const np=pick(NEIGH[S.pos]);S._np=np;const a=fit(S.attrs,S.pos),b=fit(S.attrs,np);return `O técnico quer te usar como ${POS[np].n.toLowerCase()}. Pelos seus atributos, seu encaixe lá seria ${b} (hoje, como ${POS[S.pos].n.toLowerCase()}: ${a}). A nova função muda gols, lesões e prêmios.`},o:[
 ['Aceitar a nova função',()=>['Você foi pra nova posição.',{pos:S._np,forma:-1}]],
 ['Recusar e brigar pela sua posição',()=>ch(.6)?['O técnico respeitou.',{disc:-2}]:['Foi pro banco por um tempo.',{forma:-3,disc:-4}]],
 ['Aceitar só por alguns jogos',()=>['Você quebrou o galho e voltou.',{disc:5,forma:-2,board:3}],1]]},
{id:'provoca',k:'campo',a:[17,38],t:'Provocação do rival',d:()=>'O zagueiro adversário te provoca o jogo inteiro e já pisou no seu pé duas vezes.',o:[
 ['Responder com futebol',()=>ch(.5)?['Foi pra cima dele e decidiu o jogo.',{fama:5,forma:2}]:['Não conseguiu nada.',{}],1],
 ['Revidar',()=>ch(.5)?['Expulso. Gancho de três jogos.',{susp:3,disc:-6,fama:2}]:['Ele caiu na pilha e foi expulso.',{fama:4}]],
 ['Ignorar e pedir proteção ao juiz',()=>['Saiu de campo inteiro.',{cab:2}]]]},
{id:'treinoextra',k:'campo',a:[16,36],t:'Treino extra',d:()=>'O auxiliar técnico se oferece pra ficar uma hora a mais com você depois de todo treino.',o:[
 ['Topo, todo dia',()=>ch(.72)?['Seu fundamento evoluiu visivelmente.',{ovr:1,pot:1,disc:4}]:['Fadiga acumulada. Lesão muscular.',{corpo:-5,inj:.1}]],
 ['Duas vezes por semana',()=>['Evolução lenta e segura.',{disc:2,forma:1}],1],
 ['Prefiro descansar',()=>['Recuperação em dia.',{corpo:3}]]]},
{id:'sacrificio',k:'campo',a:[18,38],t:'Jogo grande no sacrifício',d:()=>'O jogo mais importante do mês é sábado e você sente a coxa. O médico diz que é risco.',o:[
 ['Jogar com infiltração',()=>ch(.5)?['Jogou mancando e foi decisivo.',{fama:8,cab:6,forma:2}]:['Rompeu o músculo aos 20 minutos.',{inj:.3,pot:-1,cab:-6}]],
 ['Ser poupado',()=>['Ficou de fora e se recuperou.',{disc:2,fama:-2}],1]]},
{id:'vaia',k:'campo',a:[18,38],t:'Vaias da torcida',d:()=>'Depois de três jogos ruins, a torcida vaiou seu nome no anúncio da escalação.',o:[
 ['Beijar o escudo depois do gol',()=>['Parte da torcida voltou a cantar seu nome.',{fama:3,cab:2}],1],
 ['Mandar a torcida calar a boca',()=>ch(.3)?['Fez gol e a provocação virou mito.',{fama:8}]:['A diretoria não gostou.',{fama:-10,disc:-6,board:-15,release:1}]],
 ['Pedir desculpas nas redes',()=>['A poeira baixou.',{cab:-2}]]]},
{id:'olheiro',k:'campo',a:[16,21],t:'Olheiro na arquibancada',d:()=>'Um olheiro de um gigante europeu vai assistir ao próximo jogo.',o:[
 ['Jogar pro time',()=>ch(.5)?['Ele anotou seu nome mesmo assim.',{scout:1,forma:1}]:['Jogo coletivo, nada demais.',{forma:1}],1],
 ['Querer aparecer e jogar sozinho',()=>ch(.42)?['Dois gols e um drible absurdo.',{scout:1,fama:8}]:['Perdeu bolas bobas. Técnico irritado.',{fama:-3,disc:-4,forma:-2}]]]},
{id:'sub20',k:'campo',a:[16,20],c:()=>S.ovr>=NATS[S.nat].s-22,t:'Convocação pra base da seleção',d:()=>'A seleção sub-20 te convocou, mas o torneio coincide com jogos decisivos do clube.',o:[
 ['Ir pra seleção',()=>ch(.4)?['Campeão do torneio e eleito destaque.',{fama:10,ovr:1}]:['Boa experiência, eliminados nas quartas.',{fama:4,forma:-1}]],
 ['Ficar no clube',()=>['Ganhou minutos no profissional.',{forma:2,disc:2,board:4}],1]]},
{id:'veterano',k:'campo',a:[16,23],t:'O veterano do elenco',d:()=>'Um veterano pegou no seu pé desde o primeiro dia.',o:[
 ['Bater de frente',()=>ch(.4)?['Ganhou o respeito dele.',{cab:5}]:['Clima péssimo no vestiário.',{cab:-8,forma:-2}]],
 ['Pedir conselhos a ele',()=>ch(.7)?['Virou seu mentor.',{cab:6,ovr:1,disc:3}]:['Ele deu de ombros.',{}],1],
 ['Ignorar',()=>['Nada muda.',{}]]]},
{id:'tatica',k:'campo',a:[17,38],t:'Técnico novo',d:()=>'O novo técnico quer pressão alta, intensidade total e muito sacrifício defensivo.',o:[
 ['Abraçar o estilo',()=>['Virou peça-chave do esquema.',{corpo:-4,forma:3,disc:3}],1],
 ['Pedir liberdade pra jogar do seu jeito',()=>ch(.45)?['Ele deu liberdade.',{forma:3}]:['Perdeu espaço.',{forma:-4,disc:-4}]]]},
{id:'rival',k:'campo',a:[19,38],t:'Pergunta indiscreta',d:()=>'Um repórter pergunta se você jogaria no maior rival do seu clube.',o:[
 ['Nunca. Sou daqui.',()=>['A torcida amou.',{fama:4,board:4}]],
 ['No futebol tudo é possível',()=>['Faixa de protesto no CT.',{fama:-3,cab:-3}]],
 ['Desconversar',()=>['Resposta morna.',{}],1]]},
{id:'reservaluxo',k:'campo',a:[32,42],t:'Reserva de luxo',d:()=>'O técnico quer te poupar e te usar só nos jogos grandes.',o:[
 ['Aceitar o novo papel',()=>['O corpo agradeceu.',{corpo:8,cab:4,forma:-1}],1],
 ['Brigar pela titularidade',()=>ch(.5)?['Ainda tem lenha.',{forma:3}]:['Lesão muscular.',{inj:.25,corpo:-4}]]]},
{id:'mentor',k:'campo',a:[29,40],t:'O garoto da base',d:()=>'Um garoto de 17 anos joga na sua posição e já ganha minutos.',o:[
 ['Virar mentor dele',()=>['Ele te chama de ídolo nas entrevistas.',{cab:6,fama:4,forma:-1}],1],
 ['Competir duro',()=>['Você manteve a vaga por enquanto.',{forma:2,disc:2}]]]},
{id:'greve',k:'campo',a:[20,38],c:()=>S.life.fama>=40,t:'Salários atrasados',d:()=>'O clube está há três meses sem pagar parte do elenco.',o:[
 ['Liderar o protesto dos jogadores',()=>ch(.5)?['Salários pagos. O elenco te idolatra.',{cab:4,fama:4,disc:2}]:['A diretoria te colocou na lista de dispensa.',{release:1,fama:3,board:-20}]],
 ['Ficar quieto e jogar',()=>['Você seguiu.',{cab:-3}],1],
 ['Pedir pra sair',()=>['Vai ouvir propostas.',{window:1,board:-5}]]]},
];
function pickEvents(kind){
 const used=S.used;const yr=S.year;
 const ok=e=>S.age>=e.a[0]&&S.age<=e.a[1]&&(!e.c||e.c())&&!(e.once&&used[e.id])&&!(used[e.id]&&yr-used[e.id]<4);
 const pool=k=>shuffle(EV.filter(e=>e.k===k&&!e.y&&ok(e)));
 let e=null;
 if(kind==='pre'){const emp=EV.find(x=>x.id==='empresario');if(S.age<=17&&ok(emp))e=emp;else if(S.adapt&&ok(EV.find(x=>x.id==='mudarpais')))e=EV.find(x=>x.id==='mudarpais');else e=pool('vida')[0]}
 else{const yev=shuffle(EV.filter(x=>x.y&&ok(x)));e=(S.youth&&yev.length&&ch(.65))?yev[0]:(pool(ch(.5)?'campo':'vida')[0]||pool('campo')[0])}
 if(e)used[e.id]=yr;return e;
}
function resolveOption(ev,i){const[txt,fx]=ev.o[i][1]();const chips=applyFx(fx);return{txt,chips}}
function autoOption(ev){try{ev.d()}catch(e){}const s=ev.o.findIndex(o=>o[2]);return s>=0?s:0}

// ================== PÊNALTIS ==================
// zonas 0..5: 0-2 alto (E,C,D), 3-5 baixo (E,C,D)
function kickOutcome(zone,dive,skill,press=0){
 const top=zone<3,col=zone%3,dcol=dive%3,dtop=dive<3;
 const miss=clamp((top?(col===1?.07:.17):(col===1?.02:.07))-(skill-75)/260+press,.01,.35);
 if(ch(miss))return'fora';
 if(col===dcol){const save=col===1?(dtop===top?.8:.55):(top===dtop?.72:(top?.25:.5));return ch(save)?'defesa':'gol'}
 return'gol';
}
const aiDive=()=>wpick([0,1,2,3,4,5],z=>[.15,.06,.15,.27,.1,.27][z]);
const aiShot=()=>wpick([0,1,2,3,4,5],z=>[.12,.06,.12,.3,.1,.3][z]);
function gkSave(zone,dive){ // jogador é goleiro
 const top=zone<3,col=zone%3,dcol=dive%3,dtop=dive<3;
 const miss=top?.12:.04;if(ch(miss))return'fora';
 if(col!==dcol)return'gol';
 const base=col===1?(top===dtop?.85:.6):(top===dtop?.7:(top?.3:.5));
 return ch(clamp(base+(CA().REF-75)/120,.1,.95))?'defesa':'gol';
}
const IO_AUTO={
 async penalty(o){if(o.mode==='shoot'){const r=kickOutcome(aiShot(),aiDive(),CA().FIN);return{goal:r==='gol',res:r}}const r=gkSave(aiShot(),aiDive());return{goal:r==='gol',res:r}},
 async shootout(o){return autoShootout(o)},
 async event(ev){return resolveOption(ev,autoOption(ev))},
};
function autoShootout(o){
 // o: {usS, themS, iAmIn, isGK}
 let a=0,b=0;const log=[];const pu=clamp(.74+(o.usS-o.themS)/120,.6,.86),pt=clamp(.74+(o.themS-o.usS)/120,.6,.86);
 for(let i=0;i<5;i++){
  let g=ch(pu);if(o.iAmIn&&!o.isGK&&i===o.myIdx)g=kickOutcome(aiShot(),aiDive(),CA().FIN)==='gol';
  a+=g;log.push([1,g]);
  let h=ch(pt);if(o.iAmIn&&o.isGK)h=gkSave(aiShot(),aiDive())==='gol';
  b+=h;log.push([0,h]);
  if(a>b+(4-i)||b>a+(4-i))break;
 }
 let k=0;while(a===b&&k<20){const g=ch(pu),h=ch(pt);a+=g;b+=h;log.push([1,g],[0,h]);k++}
 if(a===b)a++;
 return{win:a>b,a,b,log};
}

// ================== PARTIDAS ==================
function quickScore(sh,sa,adv=2){const d=sh+adv-sa;return[poisson(1.3*Math.exp(d/19)),poisson(1.18*Math.exp(-d/19))]}
function participation(kind,o){
 const st=S.st;
 if(st.injLeft>0)return{play:false,why:'lesionado'};
 if(kind==='club'&&st.suspLeft>0)return{play:false,why:'suspenso'};
 if(typeof HIDDEN_PRO!=='undefined'&&HIDDEN_PRO)return{play:false,why:'base'};
 if(kind==='club'&&S.youth&&!(o&&(o.youthS||o.debut))){if(!S.flags.debuted||!ch(.12))return{play:false,why:'base'};const st0=ch(.2);return{play:true,start:st0,min:st0?RI(55,80):RI(8,25),role:'Base'}}
 if(o&&o.debut){const st0=ch(.4);return{play:true,start:st0,min:st0?RI(60,90):RI(15,30),role:'Rotação'}}
 const role=kind==='nat'?(st.natStarter?'Titular':'Reserva'):roleFor(S.ovr,(o&&o.youthS)||club().s,S.age);
 let pS={Titular:.9,'Rotação':.5,Reserva:.14,Base:.03}[role]+(S.life.disc-55)/400+st.forma/40+(S.captain?.05:0)+((S.coach??50)-50)/300;
 if(o&&o.rotate)pS+=role==='Titular'?-.25:.35;
 if(ch(clamp(pS,0,.98)))return{play:true,start:true,min:ch(.22)?RI(60,85):90,role};
 const pSub={Titular:.8,'Rotação':.6,Reserva:.42,Base:.1}[role];
 if(ch(pSub))return{play:true,start:false,min:RI(8,35),role};
 return{play:false,why:'banco',role};
}
// Jogo com o jogador. o={us:{id,n,s,...},them:{...},home:bool,neutral,comp,label,kind:'club'|'nat',cat}
async function playMine(o,io){
 if(S.youth&&o.kind!=="nat"&&!o.youthS&&!o.debut)o={...o,live:false};
 const st=S.st;const kind=o.kind||'club';
 const part=participation(kind,o);
 const base=o.us.s;
 const perf=S.ovr+(typeof bootPerf==='function'?bootPerf()*.8:0)+clamp(st.forma,-5,3)+clamp((S.life.cab-55)/14,-3,2)+BEH[S.behavior].perf+(S.captain?.5:0)+randn()*3;
 const imp=(part.role==='Titular'?.24:.12);
 const usS=base+(part.play?(perf-base)*imp*(part.min/90):(part.role==='Titular'?-.8:0));
 const adv=o.neutral?0:(o.home?2.2:-2.2);
 const d=usS-o.them.s+adv;
 const gu0=poisson(1.3*Math.exp(d/19)),gt0=poisson(1.18*Math.exp(-d/19));
 const P=POS[S.pos];
 const share=part.play?clamp(P.sg*clamp(1+(perf-base)/18,.4,1.7)*(part.min/90),0,.45):0;
 const ashare=part.play?clamp(P.sa*clamp(1+(perf-base)/18,.4,1.7)*(part.min/90),0,.4):0;
 const usR=sideRoster(o.us,kind==='nat');const thR=sideRoster(o.them);
 // janela em campo
 const onFrom=part.play?(part.start?0:90-part.min):999,onTo=part.play?(part.start?part.min:90):-1;
 const onPitch=m=>m>=onFrom&&m<=onTo;
 const mMine=()=>RI(Math.max(1,onFrom),Math.max(Math.max(1,onFrom),onTo));
 const tl=[];
 for(let i=0;i<gu0;i++){const mine=ch(share);const ast=!mine&&ch(ashare);tl.push({m:mine||ast?mMine():RI(1,90),t:'g',us:true,mine,ast,w:mine?S.name:scorerFrom(usR,S.name)})}
 for(let i=0;i<gt0;i++)tl.push({m:RI(1,90),t:'g',us:false,w:scorerFrom(thR)});
 if(ch(.11))tl.push({m:RI(5,90),t:'pf'});
 if(ch(.09))tl.push({m:RI(5,90),t:'pa'});
 if(part.play&&S.taker.fk&&S.pos!=='GOL'&&ch(.16)&&ch(clamp(.1+(CA().FIN+CA().PAS-150)/320,.04,.32)))tl.push({m:mMine(),t:'g',us:true,mine:true,fk:true,w:S.name+' (falta)'});
 // cartões e lesão
 let y=0,r=0,inj=0;
 if(part.play){
  const pc=(['VOL','ZAG'].includes(S.pos)?.2:.1)+(55-S.life.disc)/400;
  if(ch(clamp(pc,.03,.4))){y=1;tl.push({m:mMine(),t:'y'})}
  if(ch(clamp(.012+(55-S.life.disc)/1500,.004,.05))){r=1;y=0;tl.push({m:mMine(),t:'r'})}
  const pI=(S.perks&&S.perks.prep?.8:1)*P.inj/34*(1.55-S.life.corpo/100)*(S.age>29?1+(S.age-29)*.07:1)*D().inj*(part.min/90)+st.injRisk/30;
  if(ch(pI)){const sev=rnd();inj=sev<.7?RI(1,3):sev<.95?RI(4,10):RI(14,30);tl.push({m:mMine(),t:'inj',n:inj})}
  if(!part.start)tl.push({m:onFrom,t:'in'});
 }
 // lances para dar tensão
 const nf=RI(4,8);for(let i=0;i<nf;i++){const us=ch(clamp(.5+d/40,.2,.8));const mine=us&&part.play&&ch(.3);tl.push({m:mine?mMine():RI(1,90),t:'c',us,mine,w:mine?S.name:us?scorerFrom(usR,S.name):scorerFrom(thR)})}
 tl.sort((a,b)=>a.m-b.m);
 const live=o.live&&io.live?await io.live.start({o,us:o.us,them:o.them,home:o.home,neutral:o.neutral,agg:o.agg,part}):null;
 let gu=0,gt=0,myG=0,myA=0,penNote=null,fkNote=false;const scorers=[];
 let interN=0;
 for(let e of tl){
  if(live)await live.until(e.m);
  if(io.chance&&part.play&&interN<(live?3:2)&&onPitch(e.m)&&(typeof lancesWanted!=='function'||lancesWanted(live))){
   let c=null;
   if(e.t==='g'&&e.us&&e.mine)c={type:chanceType(e),planned:true};
   else if(e.t==='g'&&e.us&&e.ast&&typeof assistType==='function')c={type:assistType(),planned:true,ast:true};
   else if(e.t==='c'&&e.us&&e.mine&&ch(.6))c={type:chanceType(e),planned:false};
   else if(e.t==='c'&&e.us&&!e.mine&&S.pos!=='GOL'&&typeof assistType==='function'&&ch(.22))c={type:assistType(),planned:false,ast:true};
   else if(S.pos==='GOL'&&!e.us&&(e.t==='g'||e.t==='c')&&ch(e.t==='g'?.75:.35))c={type:'reflex',planned:e.t==='g'};
   if(c){interN++;if(live){live.flash(c.type==='reflex'?'⚠️ Perigo no seu gol!':c.ast?'⚡ Você tem a bola pra criar…':'⚡ A bola é sua…');await sleep(S.liveSpeed===3?600:1400)}
    const ok=await io.chance({...c,comp:o.comp,min:e.m});if(live)live.redraw();
    if(c.type==='reflex'){if(e.t==='g'&&ok)e={...e,t:'gks'};else if(e.t==='c'&&!ok)e={...e,t:'g'};else if(e.t==='c'&&ok)e={...e,t:'gks'}}
    else if(c.ast){if(e.t==='g'&&!ok)e={...e,t:'c',ast:false};else if(e.t==='c'&&ok)e={...e,t:'g',ast:true,mine:false}}
    else if(e.t==='g'&&!ok)e={...e,t:'c',fk:false,missed:true};
    else if(e.t==='c'&&ok)e={...e,t:'g',w:S.name,mine:true}}
  }
  let feed=null;
  if(e.t==='g'){if(e.us){gu++;if(e.mine)myG++;if(e.ast)myA++;if(e.fk)fkNote=true}else gt++;scorers.push({m:e.m,w:e.w,us:e.us});feed={...e,gu,gt}}
  else if(e.t==='pf'){
   if(onPitch(e.m)&&S.taker.pen&&S.pos!=='GOL'){
    if(live)live.flash('PÊNALTI PRA VOCÊS! A bola é sua.');
    const rr=await io.penalty({mode:'shoot',ctx:'match',comp:o.comp,them:o.them,us:o.us,min:e.m});if(live)live.redraw();
    penNote=rr.goal?'convertido':(rr.res==='fora'?'pra fora':'defendido');
    if(rr.goal){gu++;myG++;scorers.push({m:e.m,w:S.name+' (pên.)',us:true});feed={t:'g',us:true,mine:true,w:S.name+' (pên.)',m:e.m,gu,gt}}else feed={t:'pmiss',us:true,mine:true,m:e.m,w:S.name}
   }else{const w=scorerFrom(usR,S.name);if(ch(.76)){gu++;scorers.push({m:e.m,w:w+' (pên.)',us:true});feed={t:'g',us:true,w:w+' (pên.)',m:e.m,gu,gt}}else feed={t:'pmiss',us:true,w,m:e.m}}
  }
  else if(e.t==='pa'){
   const w=scorerFrom(thR);
   if(onPitch(e.m)&&S.pos==='GOL'){
    if(live)live.flash('Pênalti contra! Você no gol.');
    const rr=await io.penalty({mode:'save',ctx:'match',comp:o.comp,them:o.them,us:o.us,min:e.m,taker:w});if(live)live.redraw();
    if(rr.goal){gt++;scorers.push({m:e.m,w:w+' (pên.)',us:false});feed={t:'g',us:false,w:w+' (pên.)',m:e.m,gu,gt}}else{penNote=rr.res==='defesa'?'defendeu pênalti':'pênalti pra fora';feed={t:'psave',us:false,w,m:e.m,mine:rr.res==='defesa'}}
   }else if(ch(.76)){gt++;scorers.push({m:e.m,w:w+' (pên.)',us:false});feed={t:'g',us:false,w:w+' (pên.)',m:e.m,gu,gt}}else feed={t:'pmiss',us:false,w,m:e.m}
  }
  else feed=e;
  if(live&&feed)await live.event(feed,gu,gt);
 }
 if(live)await live.until(90);
 if(part.play&&kind==='club'){if(inj){if(inj>=14){S.pot=clamp(S.pot-RI(1,3),40,99);S.life.corpo=clamp(S.life.corpo-8,0,100)}st.injLeft+=inj;st.injLog.push(inj)}if(r)st.suspLeft+=1;if(y){st.yellows++;if(st.yellows%5===0)st.suspLeft+=1}}
 else if(part.play&&inj){st.injLeft+=inj;st.injLog.push(inj)}
 if(!part.play){if(st.injLeft>0&&part.why==='lesionado')st.injLeft--;else if(kind==='club'&&st.suspLeft>0&&part.why==='suspenso')st.suspLeft--}
 else if(st.injLeft>0&&!inj)st.injLeft--;
 const cs=part.play&&S.pos==='GOL'&&gt===0&&part.min>=60;
 let nota=null;
 if(part.play){nota=6.35+(gu>gt?.4:gu<gt?-.35:0)+myG*.85+myA*.5+(S.pos==='GOL'?(gt===0?.8:-.25*gt):0)+(perf-base)/18+(penNote==='defendeu pênalti'?.8:0)+randn()*.45-(r?1.5:0);nota=Math.round(clamp(nota,3,10)*10)/10}
 const me={play:part.play,why:part.why,start:part.start,min:part.play?part.min:0,g:myG,a:myA,nota,y,r,cs,inj,pen:penNote,fk:fkNote};
 return{gu,gt,me,scorers,perf,live};
}
// Registra nas estatísticas
function isDecisive(it){
 const st=S.st;if(!st||!it)return false;const me=club();if(!me)return false;
 if(it.k==='ko'){const c=st.comps[it.cid];if(!c||!c.alive)return false;const rd=c.rounds[c.stage];return!!rd&&(S.fast?rd.n==='Final':/Final|Semifinal/.test(rd.n))}
 if(it.k==='lg'){const L=LG[st.lg];const last=st.rounds.length-1;if(L.po)return it.r===last;const left=st.rounds.length-it.r;if(left>(S.fast?1:3))return false;
  const t=sortTable(st.table);const i=t.findIndex(x=>x.id===me.id);if(i<0)return false;const p=t[i].p,m=3*left;const near=k=>k>=0&&k<t.length&&k!==i&&Math.abs(t[k].p-p)<=m;
  if(i===0?near(1):near(0))return true;const up=L.prev?LG[L.prev].down:0;if(up&&(i<up?near(up):near(up-1)))return true;const dn=L.down||0;if(dn&&(i>=t.length-dn?near(t.length-dn-1):near(t.length-dn)))return true;return false}
 if(it.k==='yl'){const c=st.comps.yl;return!!c&&it.i===c.opps.length-1}
 return false;
}
function leagueOutcome(it){
 const st=S.st;const me=club();const L=LG[st.lg];if(L.po)return{};const t=sortTable(st.table);const i=t.findIndex(x=>x.id===me.id);if(i<0)return{};
 const left=st.rounds.length-1-it.r;const m=3*left;const p=t[i].p;const stat=`${p} pontos · ${t[i].v} vitórias`;
 const o={stat};if(i===0&&t[1]&&p-t[1].p>m)o.title=true;
 const up=L.prev?LG[L.prev].down:0;if(up&&i<up&&t[up]&&p-t[up].p>m)o.up=true;
 const dn=L.down||0;if(dn&&left===0&&i>=t.length-dn)o.down=true;return o;
}
function blockEnd(st){const ms=[];st.cal.forEach((it,i)=>{if(it.k!=='ev'&&it.k!=='debut')ms.push(i)});const n=ms.length;const cuts=[1,2,3].map(k=>ms[Math.floor(n*k/4)-1]+1);cuts.push(st.cal.length);return cuts.find(c=>c>st.idx)||st.cal.length}
function blockInfo(st){const ms=[];st.cal.forEach((it,i)=>{if(it.k!=='ev'&&it.k!=='debut')ms.push(i)});const n=ms.length;const played=ms.filter(i=>i<st.idx).length;const b=Math.min(4,Math.floor(played/(n/4))+1);const nextEnd=blockEnd(st);const left=ms.filter(i=>i>=st.idx&&i<nextEnd).length;return{b,n,played,left}}
function nextItem(){const st=S.st;if(!st)return null;for(let i=st.idx;i<st.cal.length;i++){const it=st.cal[i];if(it.k!=='ev'&&it.k!=='debut')return it}return null}
function wantLive(kind){const m=S.liveMode||'decisivos';if(m==='off')return false;if(m==='all')return true;return kind==='ko'||kind==='tg'}
function record(cat,me){
 const st=S.st;const s=st.stats[cat]||(st.stats[cat]={j:0,g:0,a:0,cs:0,ns:0,nn:0,min:0});
 if(me.play){s.j++;s.g+=me.g;s.a+=me.a;s.cs+=me.cs?1:0;s.min+=me.min;if(me.nota!=null){s.ns+=me.nota;s.nn++}}
 if(cat!=='Seleção'&&!(me&&me.why==='base')&&typeof lifeTick==='function')lifeTick(me);
}

// ================== TEMPORADA ==================
function roundRobin(ids){
 const t=ids.slice();if(t.length%2)t.push(null);const n=t.length;const rounds=[];
 for(let r=0;r<n-1;r++){const pr=[];for(let i=0;i<n/2;i++){const a=t[i],b=t[n-1-i];if(a&&b)pr.push(r%2?[b,a]:[a,b])}rounds.push(pr);t.splice(1,0,t.pop())}
 return rounds.concat(rounds.map(r=>r.map(([a,b])=>[b,a])));
}
function contParticipants(comp){
 const out=[];
 for(const c in COUNTRY){const C=COUNTRY[c];const sl=C.slots[comp];
  if(sl){const top=leagueClubs(C.top);for(const x of top){const p=W.pos[x.id];if(p>=sl[0]&&p<=sl[1])out.push(x.id)}}
  if(C.cupTo===comp&&W.cupwin[c]&&!out.includes(W.cupwin[c])&&CLUB[W.cupwin[c]].l===C.top){const already=Object.keys(C.slots).some(k=>{const s=C.slots[k];const p=W.pos[W.cupwin[c]];return p>=s[0]&&p<=s[1]&&(k==='UCL'||k==='LIB')});if(!already)out.push(W.cupwin[c])}
 }
 if(comp==='CCC')for(const x of EXT_SRC.NA.split(';'))out.push(x.split('|')[0]);
 if(comp==='ACL')for(const x of EXT_SRC.AS.split(';'))out.push(x.split('|')[0]);
 return[...new Set(out)];
}
const CONT_INFO={
 UCL:{n:'Champions League',ic:'orelhas',kind:'lp',m:8,top:16,po:10,pts:20,ko:['Oitavas','Quartas','Semifinal'],fin:'Final'},
 UEL:{n:'Europa League',ic:'cont2',kind:'lp',m:8,top:16,po:10,pts:7,ko:['Oitavas','Quartas','Semifinal'],fin:'Final'},
 UECL:{n:'Conference League',ic:'cont3',kind:'lp',m:6,top:13,po:8,pts:4,ko:['Oitavas','Quartas','Semifinal'],fin:'Final'},
 LIB:{n:'Libertadores',ic:'liberta',kind:'grp',adv:2,pts:13,ko:['Oitavas','Quartas','Semifinal'],fin:'Final'},
 SUD:{n:'Copa Sul-Americana',ic:'cont2',kind:'grp',adv:2,pts:5,ko:['Oitavas','Quartas','Semifinal'],fin:'Final'},
 CCC:{n:'Concachampions',ic:'cont2',kind:'ko',pts:5,ko:['Oitavas','Quartas','Semifinal'],fin:'Final'},
 ACL:{n:'AFC Champions League Elite',ic:'cont2',kind:'lp',m:8,top:13,po:99,pts:6,ko:['Oitavas','Quartas','Semifinal'],fin:'Final'},
};
const TITLE_PTS={base:.5,liga:0,copa:3,lcup:2,super:1,est:1,usc:2,rec:2,int:6,mun:12,copa_mundo:30,nat:12,olimp:6};
function myContComp(c){
 const C=COUNTRY[c.country];if(!C||LG[c.l].tier!==1)return null;
 for(const k in C.slots){const sl=C.slots[k];const p=W.pos[c.id];if(p>=sl[0]&&p<=sl[1])return k}
 if(W.cupwin[c.country]===c.id)return C.cupTo;
 return null;
}
function oppPool(ids,exclude){return ids.filter(i=>i!==exclude).map(i=>CLUB[i]).filter(Boolean)}
function pickOpp(pool,stage,stages){const f=stage/Math.max(1,stages-1);return wpick(pool,c=>Math.exp((c.s-70)*(.03+.17*f)))}

function buildSeason(){
 const me=club();const L=LG[me.l];const C=COUNTRY[me.country];
 const ids=leagueClubs(me.l).map(c=>c.id);
 let rounds=roundRobin(shuffle(ids));if(L.rr)rounds=rounds.slice(0,rounds.length/2);
 const table={};ids.forEach(id=>table[id]={id,p:0,j:0,v:0,e:0,d:0,gp:0,gc:0});
 const st={cal:[],idx:0,table,rounds,lg:me.l,comps:{},log:[],stats:{},yellows:0,injLeft:0,suspLeft:0,injRisk:0,injLog:[],forma:S.carry||0,natStarter:false,titles:[],finals:[],evlog:[],done:false};
 S.st=st;
 S.youth=S.age<=19&&!S.loan&&(S.flags.pro===false||(S.flags.pro===undefined&&S.ovr<me.s-6&&S.promotedAt!==me.id));
 if(S.adapt){st.forma-=3;S.life.cab=clamp(S.life.cab-5,0,100)}
 const R=rounds.length;const cal=[];
 const mkKO=(id,n,ic,t,rounds,opts={})=>{st.comps[id]={id,n,ic,t,kind:'ko',rounds,stage:0,alive:true,path:[],...opts};return st.comps[id]};
 const pre=[];
 // pré-temporada: evento
 pre.push({k:'ev',when:'pre'});
 // supercopas
 const lastChamp=W.champ[C.top],lastCup=W.cupwin[me.country];
 if(C.sup&&(lastChamp===me.id||lastCup===me.id)){
  let opp=lastChamp===me.id?lastCup:lastChamp;if(opp===me.id){const tl=leagueClubs(C.top).sort((a,b)=>W.pos[a.id]-W.pos[b.id]);opp=tl.find(x=>x.id!==me.id).id}
  mkKO('sup',C.sup,'super','super',[{n:'Final',legs:1,neutral:true,opp}]);pre.push({k:'ko',cid:'sup'});
 }
 if(W.contwin.UCL===me.id||W.contwin.UEL===me.id){const o=W.contwin.UCL===me.id?W.contwin.UEL:W.contwin.UCL;if(o&&o!==me.id){mkKO('usc','Supercopa da UEFA','super','usc',[{n:'Final',legs:1,neutral:true,opp:o}]);pre.push({k:'ko',cid:'usc'})}}
 if(W.contwin.LIB===me.id||W.contwin.SUD===me.id){const o=W.contwin.LIB===me.id?W.contwin.SUD:W.contwin.LIB;if(o&&o!==me.id){mkKO('rec','Recopa Sul-Americana','super','rec',[{n:'Final',legs:2,opp:o}]);pre.push({k:'ko',cid:'rec'})}}
 // estadual
 if(me.country==='BRA'&&me.uf&&UF_EST[me.uf]){
  const pool=CLUBS.filter(x=>x.uf===me.uf&&x.id!==me.id).map(x=>x.id);
  st.comps.est={id:'est',n:UF_EST[me.uf],ic:'est',t:'est',kind:'est',pool,grp:[],pts:0,stage:0,alive:true,path:[],rounds:[{n:'Quartas',legs:1},{n:'Semifinal',legs:1},{n:'Final',legs:2}]};
  for(let i=0;i<3;i++)pre.push({k:'est',i});for(let i=0;i<3;i++)pre.push({k:'ko',cid:'est'});
 }
 // copa nacional
 const tier=L.tier;
 let cupR;
 if(me.country==='BRA')cupR=tier===1&&myContComp(me)==='LIB'?['Oitavas','Quartas','Semifinal','Final']:tier===1?['3ª fase','Oitavas','Quartas','Semifinal','Final']:['1ª fase','2ª fase','3ª fase','Oitavas','Quartas','Semifinal','Final'];
 else if(me.country==='ENG')cupR=['3ª rodada','4ª rodada','5ª rodada','Quartas','Semifinal','Final'];
 else cupR=tier===1?['16 avos','Oitavas','Quartas','Semifinal','Final']:['1ª fase','16 avos','Oitavas','Quartas','Semifinal','Final'];
 const cpool=countryClubs(me.country).map(c=>c.id);
 mkKO('cup',C.cup,'copa','copa',cupR.map((n,i)=>({n,legs:C.cupLegs&&i>=cupR.length-5&&n!=='Final'?2:(C.cupLegs&&n==='Final'?2:1),neutral:!C.cupLegs&&n==='Final',rotate:i<2&&tier===1})),{pool:cpool});
 const items=[];// [pos(0..1), item]
 cupR.forEach((_,i)=>items.push([.06+.86*(i/(cupR.length-1||1))*.95,{k:'ko',cid:'cup'}]));
 if(C.lcup&&(me.country!=='POR'||tier===1)){
  const lr=me.country==='ENG'?['2ª rodada','3ª rodada','4ª rodada','Quartas','Semifinal','Final']:['Quartas','Semifinal','Final'];
  const lp=countryClubs(me.country).filter(x=>LG[x.l].tier<=2).map(x=>x.id);
  mkKO('lcup',C.lcup,'lcup','lcup',lr.map((n,i)=>({n,legs:n==='Semifinal'&&me.country==='ENG'?2:1,neutral:n==='Final',rotate:i<2})),{pool:lp});
  lr.forEach((_,i)=>items.push([.1+.6*(i/(lr.length-1)),{k:'ko',cid:'lcup'}]));
 }
 // continental
 const cc=myContComp(me);
 if(cc){
  const I=CONT_INFO[cc];const parts=contParticipants(cc);if(!parts.includes(me.id))parts.push(me.id);
  const comp={id:'cont',code:cc,n:I.n,ic:I.ic,t:'cont',pts:I.pts,kind:I.kind,pool:parts,stage:0,alive:true,path:[],gm:[],lpPts:0,grp:null,
   rounds:(I.kind==='lp'&&I.po<99?[{n:'Playoff',legs:2,po:true}]:[]).concat(I.ko.map(n=>({n,legs:2}))).concat([{n:I.fin,legs:cc==='CCC'?1:1,neutral:true}])};
  st.comps.cont=comp;
  if(I.kind==='lp'){const opps=shuffle(oppPool(parts,me.id)).slice(0,I.m);comp.gm=opps.map((o,i)=>({opp:o.id,home:i%2===0}));comp.gm.forEach((_,i)=>items.push([.08+.42*(i/(I.m-1)),{k:'grp',cid:'cont',i}]))}
  else if(I.kind==='grp'){const op=shuffle(oppPool(parts,me.id));const g=[me.id,...op.slice(0,3).map(x=>x.id)];comp.grp=g;comp.gtab={};g.forEach(id=>comp.gtab[id]={id,p:0,j:0,gp:0,gc:0});
   const sched=[[1,2,3],[2,3,1],[3,1,2],[1,2,3],[2,3,1],[3,1,2]];comp.gm=sched.map((s,i)=>({opp:g[s[0]],home:i<3?i%2===0:i%2===1,other:[g[s[1]],g[s[2]]]}));
   comp.gm.forEach((_,i)=>items.push([.1+.4*(i/5),{k:'grp',cid:'cont',i}]))}
  comp.rounds.forEach((r,i)=>items.push([r.po?.53:Math.min(.985,.58+.13*(i-(comp.rounds[0].po?1:0))),{k:'ko',cid:'cont'}]));
 }
 // intercontinental (dezembro): campeão continental da temporada anterior
 if(W.contwin.UCL===me.id||W.contwin.LIB===me.id||W.contwin.CCC===me.id||W.contwin.ACL===me.id){
  const isEU=W.contwin.UCL===me.id;
  const rounds=isEU?[{n:'Final',legs:1,neutral:true}]:[{n:'Semifinal',legs:1,neutral:true},{n:'Final',legs:1,neutral:true,opp:W.contwin.UCL}];
  mkKO('int','Copa Intercontinental','globo','int',rounds,{pool:[W.contwin.LIB,W.contwin.CCC,W.contwin.ACL,'Al Ahly','Pyramids'].filter(x=>x&&x!==me.id)});
  rounds.forEach((_,i)=>items.push([.45+i*.02,{k:'ko',cid:'int'}]));
 }
 // datas FIFA
 [.22,.47,.72].forEach(p=>items.push([p,{k:'intl'}]));
 // eventos de meio de temporada
 [.3,.62].forEach(p=>items.push([p,{k:'ev',when:'mid'}]));
 if(S.youth)addYouthToSeason(st,me,pre,items);
 // monta calendário
 const main=[];
 for(let r=0;r<R;r++){main.push({k:'lg',r});const lo=r/R,hi=(r+1)/R;for(const[p,it]of items)if(p>=lo&&p<hi)main.push(it)}
 for(const[p,it]of items)if(p>=1)main.push(it);
 // pós-temporada
 const post=[];
 if(L.po){mkKO('mlscup','MLS Cup','liga','liga',[{n:'Quartas',legs:1},{n:'Semifinal',legs:1},{n:'Final',legs:1}],{po:true,pool:[]});for(let i=0;i<3;i++)post.push({k:'ko',cid:'mlscup'})}
 const endYear=S.year+1;
 if(endYear%4===1){ // Mundial de Clubes (2029, 2033...)
  const champs=Object.values(W.contwin).filter(Boolean);
  const top=CLUBS.filter(x=>LG[x.l].tier===1).sort((a,b)=>b.s-a.s).slice(0,14).map(x=>x.id);
  const field=[...new Set([...champs,...top])];
  if(field.includes(me.id)){
   st.comps.mun={id:'mun',n:'Mundial de Clubes da FIFA',ic:'mundial',t:'mun',kind:'est',pool:field.concat(['Al Ahly','Club América','Al-Sadd','Auckland City','Monterrey','Ulsan HD']),grp:[],pts:0,stage:0,alive:true,path:[],rounds:[{n:'Oitavas',legs:1,neutral:true},{n:'Quartas',legs:1,neutral:true},{n:'Semifinal',legs:1,neutral:true},{n:'Final',legs:1,neutral:true}],neutral:true,label:'Fase de grupos'};
   for(let i=0;i<3;i++)post.push({k:'est',i,cid:'mun'});for(let i=0;i<4;i++)post.push({k:'ko',cid:'mun'});
  }
 }
 // torneios de seleções
 const nat=NATS[S.nat];
 const tours=[];
 if(endYear%4===2)tours.push({id:'wc',n:'Copa do Mundo',ic:'copa_mundo',t:'copa_mundo',ko:['16 avos','Oitavas','Quartas','Semifinal','Final'],pool:allNations().filter(x=>x.id!==S.nat)});
 if(endYear%4===0){tours.push({id:'natc',n:NAT_CUP[nat.c],ic:'nat',t:'nat',ko:['Quartas','Semifinal','Final'],pool:allNations().filter(x=>x.id!==S.nat&&x.c===nat.c)});
  if(S.age<=23||S.ovr>=86)tours.push({id:'oly',n:'Olimpíadas',ic:'olimp',t:'olimp',ko:['Quartas','Semifinal','Final'],pool:allNations().filter(x=>x.id!==S.nat),u23:true})}
 for(const t of tours){
  if(t.pool.length<5)t.pool=t.pool.concat(allNations().filter(x=>x.id!==S.nat&&!t.pool.includes(x)).slice(0,6));
  st.comps[t.id]={...t,kind:'tour',grp:[],pts:0,stage:0,alive:true,path:[],rounds:t.ko.map(n=>({n,legs:1,neutral:true})),qualified:t.id!=='wc'||ch(clamp(logi((nat.s-74)/2.5),.1,.99)),label:'Fase de grupos'};
  for(let i=0;i<3;i++)post.push({k:'tg',cid:t.id,i});t.ko.forEach(()=>post.push({k:'ko',cid:t.id}));
 }
 st.cal=pre.concat(main).concat(post);
 // chave de copa da MLS e totais
 return st;
}

// Pontuação de tabela
function tabAdd(tab,h,a,gh,ga){const H=tab[h],A=tab[a];if(!H||!A)return;H.j++;A.j++;H.gp+=gh;H.gc+=ga;A.gp+=ga;A.gc+=gh;if(gh>ga){H.v++;H.p+=3;A.d++}else if(gh<ga){A.v++;A.p+=3;H.d++}else{H.e++;A.e++;H.p++;A.p++}}
function sortTable(tab){return Object.values(tab).sort((a,b)=>b.p-a.p||(b.gp-b.gc)-(a.gp-a.gc)||b.gp-a.gp||b.v-a.v)}

function clubSide(id){const c=CLUB[id];return{id,n:c.n,s:c.s+randn()*1.2,c1:c.c1,c2:c.c2,a:c.a}}
function natSide(n){return{id:n.id,n:n.n,f:n.f,s:n.s+randn()*1.2,nat:true}}

async function processItem(it,io){
 if(it.k==='yl'||it.k==='debut')return processYouth(it,io);
 const st=S.st;const me=club();
 if(it.k==='lg'){
  if(typeof payWeek==='function')payWeek(st.rounds.length);
  const pairs=st.rounds[it.r].slice().sort((x,y)=>(x.includes(me.id)?1:0)-(y.includes(me.id)?1:0));let res=null;
  for(const[h,a]of pairs){
   if(h===me.id||a===me.id){
    const home=h===me.id;const deb=!!st.debutNext;const dec=isDecisive(it);const r=await playMine({us:clubSide(me.id),them:clubSide(home?a:h),home,comp:LG[me.l].n,label:deb?`Rodada ${it.r+1} · SUA ESTREIA`:`Rodada ${it.r+1}${dec?' · DECISIVA':''}`,live:wantLive('lg')||deb||dec,debut:deb,decisive:dec},io);
    {const gh0=home?r.gu:r.gt,ga0=home?r.gt:r.gu;tabAdd(st.table,h,a,gh0,ga0);r._added=true}
    const lgOut=leagueOutcome(it);
    if(r.live)await r.live.finish({msg:lgOut.title?'É CAMPEÃO!':lgOut.up?'ACESSO GARANTIDO!':lgOut.down?'Rebaixado.':deb?'Fim do jogo da sua estreia.':'Fim de jogo.',win:lgOut.title||lgOut.up?true:lgOut.down?false:null,final:!!(lgOut.title||lgOut.up)});
    if(lgOut.title&&!st.lgCeleb&&io.celebrate){st.lgCeleb=true;st.celebrated=st.celebrated||[];st.celebrated.push(LG[me.l].n);await io.celebrate({t:'liga',n:LG[me.l].n,ic:'liga',club:me.id,clinch:it.r<st.rounds.length-1,stat:lgOut.stat})}
    if(lgOut.up&&!st.upCeleb&&io.celebrate){st.upCeleb=true;st.celebrated=st.celebrated||[];st.celebrated.push('__acesso');await io.celebrate({t:'acesso',n:`Acesso à ${LG[LG[me.l].prev].n}`,club:me.id,stat:lgOut.stat})}
    if(deb){st.debutNext=false;S.flags.debuted=true;S.life.fama=clamp(S.life.fama+3,0,100);if(io.milestone)await io.milestone({k:'debut',title:'Estreia no profissional',sub:`${me.n} × ${CLUB[home?a:h].n}`,lines:[r.me.g?`Marcou ${r.me.g} gol${r.me.g>1?'s':''} na estreia!`:r.me.a?'Deu assistência na estreia!':`${r.me.min} minutos em campo`,`Nota ${r.me.nota??'—'}`]})}
    const gh=home?r.gu:r.gt,ga=home?r.gt:r.gu;if(!r._added)tabAdd(st.table,h,a,gh,ga);record('Liga',r.me);
    res=mkRes(LG[me.l].n,`Rodada ${it.r+1}`,h,a,gh,ga,r,home,null,'lg');
   }else{const[gh,ga]=quickScore(CLUB[h].s,CLUB[a].s);tabAdd(st.table,h,a,gh,ga)}
  }
  if(!res)return{k:'bye',txt:`Rodada ${it.r+1}: folga`};
  return res;
 }
 if(it.k==='est'){
  const cid=it.cid||'est';const comp=st.comps[cid];
  const pool=comp.pool.filter(x=>CLUB[x]);let oppId=pool.length?wpick(pool,x=>Math.exp((CLUB[x].s-60)/8)):null;
  let them=oppId?clubSide(oppId):{id:'Interior',n:pick(['Rival do interior','Time da capital','Clube tradicional']),s:R(48,56),c1:'#555',c2:'#ccc',a:'INT'};
  const home=comp.neutral?true:ch(.5);
  const r=await playMine({us:clubSide(me.id),them,home,neutral:!!comp.neutral,comp:comp.n,label:`${comp.label||'1ª fase'} · jogo ${it.i+1}`,rotate:cid==='est',live:wantLive(cid==='mun'?'tg':'grp')},io);if(r.live)await r.live.finish({msg:'Fim de jogo.'});
  comp.pts+=r.gu>r.gt?3:r.gu===r.gt?1:0;record(cid==='mun'?'Continental':'Copas',r.me);
  const res=mkRes(comp.n,`${comp.label||'1ª fase'} · jogo ${it.i+1}`,home?me.id:them.id,home?them.id:me.id,home?r.gu:r.gt,home?r.gt:r.gu,r,home,null,cid,home?null:them,home?them:null);
  comp.path.push(res);
  if(it.i===2){const q=comp.pts>=7||(comp.pts>=4&&ch(.7))||(comp.pts>=3&&ch(.3));if(!q){comp.alive=false;comp.out='Fase de grupos';res.note=`Eliminado na fase de grupos (${comp.pts} pts)`}else res.note=`Classificado (${comp.pts} pts)`}
  return res;
 }
 if(it.k==='grp'){
  const comp=st.comps[it.cid];const g=comp.gm[it.i];
  const them=clubSide(g.opp);const r=await playMine({us:clubSide(me.id),them,home:g.home,comp:comp.n,label:comp.kind==='grp'?`Fase de grupos · ${it.i+1}ª rodada`:`Fase de liga · ${it.i+1}ª rodada`,live:wantLive('grp')},io);if(r.live)await r.live.finish({msg:'Fim de jogo.'});
  record('Continental',r.me);comp.lpPts+=r.gu>r.gt?3:r.gu===r.gt?1:0;
  const h=g.home?me.id:g.opp,a=g.home?g.opp:me.id,gh=g.home?r.gu:r.gt,ga=g.home?r.gt:r.gu;
  if(comp.gtab){tabAdd(comp.gtab,h,a,gh,ga);if(g.other){const[x,y]=g.other;const[q1,q2]=quickScore(CLUB[x].s,CLUB[y].s);tabAdd(comp.gtab,x,y,q1,q2)}}
  const res=mkRes(comp.n,comp.kind==='grp'?`Grupo · ${it.i+1}ª rodada`:`Fase de liga · ${it.i+1}ª rodada`,h,a,gh,ga,r,g.home,null,'cont');comp.path.push(res);
  if(it.i===comp.gm.length-1){
   const I=CONT_INFO[comp.code];
   if(comp.kind==='lp'){if(comp.lpPts>=I.top){comp.stage=comp.rounds[0].po?1:0;res.note=`${comp.lpPts} pts: direto pras oitavas`}else if(comp.lpPts>=I.po&&comp.rounds[0].po){comp.stage=0;res.note=`${comp.lpPts} pts: vai pro playoff`}else{comp.alive=false;comp.out='Fase de liga';res.note=`${comp.lpPts} pts: eliminado`}}
   else{const t=sortTable(comp.gtab);const pos=t.findIndex(x=>x.id===me.id)+1;comp.gpos=pos;if(pos<=I.adv){comp.stage=0;res.note=`${pos}º do grupo: classificado`}else{comp.alive=false;comp.out='Fase de grupos';res.note=`${pos}º do grupo: eliminado`}}
  }
  return res;
 }
 if(it.k==='tg'){
  const comp=st.comps[it.cid];const nat=NATS[S.nat];
  if(it.i===0){
   if(!comp.qualified){comp.alive=false;comp.out='Não se classificou';return{k:'info',txt:`${nat.f} ${nat.n} não se classificou pra ${comp.n}.`,comp:comp.n}}
   const called=S.ovr>=nat.s-6-(S.life.fama-50)/25+randn()*1.5||(comp.u23&&S.ovr>=nat.s-14);
   comp.called=called;st.natStarter=S.ovr>=nat.s-1+randn();
   if(!called){comp.alive=false;comp.out='Não convocado';comp.sim=true;return{k:'info',txt:`Você não foi convocado pra ${comp.n}.`,comp:comp.n}}
   comp.grp=shuffle(comp.pool).slice(0,3);
  }
  if(!comp.alive)return null;
  const them=natSide(comp.grp[it.i]);
  const r=await playMine({us:natSide({id:S.nat,...nat}),them,home:true,neutral:true,comp:comp.n,label:`Fase de grupos · jogo ${it.i+1}`,kind:'nat',live:wantLive('tg')},io);if(r.live)await r.live.finish({msg:'Fim de jogo.'});
  comp.pts+=r.gu>r.gt?3:r.gu===r.gt?1:0;record('Seleção',r.me);S.caps+=r.me.play?1:0;S.natGoals+=r.me.g;
  const res=mkRes(comp.n,`Fase de grupos · jogo ${it.i+1}`,S.nat,them.id,r.gu,r.gt,r,true,null,it.cid,{id:S.nat,n:nat.n,f:nat.f,nat:true},them);comp.path.push(res);
  if(it.i===2){const q=comp.pts>=6||(comp.pts>=4&&ch(.8))||(comp.pts>=3&&ch(.45));if(!q){comp.alive=false;comp.out='Fase de grupos';res.note='Eliminados na fase de grupos'}else res.note=`Classificados (${comp.pts} pts)`}
  return res;
 }
 if(it.k==='ko'){
  const comp=st.comps[it.cid];if(!comp||!comp.alive)return null;
  if(comp.stage>=comp.rounds.length)return null;
  const rd=comp.rounds[comp.stage];
  if(comp.kind==='lp'||comp.code){} // continental handled below
  // MLS: só playoffs se ficou entre os 8
  if(it.cid==='mlscup'&&comp.stage===0){const t=sortTable(st.table);const p=t.findIndex(x=>x.id===me.id)+1;if(p>8){comp.alive=false;comp.out='Fora dos playoffs';return{k:'info',txt:`${p}º lugar: fora dos playoffs da MLS.`,comp:comp.n}}comp.pool=t.slice(0,8).map(x=>x.id)}
  const isNat=comp.kind==='tour';
  let them;
  if(isNat){const o=wpick(comp.pool.filter(x=>!comp.grp.includes(x)),x=>Math.exp((x.s-70)*(.05+.12*comp.stage/comp.rounds.length)));them=natSide(o)}
  else if(rd.opp)them=clubSide(rd.opp);
  else{let pool=oppPool(comp.pool||[],me.id);if(it.cid==='est'||it.cid==='mun')pool=oppPool(comp.pool,me.id);if(!pool.length)pool=oppPool(countryClubs(me.country).map(x=>x.id),me.id);them=clubSide(pickOpp(pool,comp.stage,comp.rounds.length).id)}
  let usSide=isNat?natSide({id:S.nat,...NATS[S.nat]}):clubSide(me.id);
  if(comp.youth){them=youthSide(them.id);usSide=youthSide(me.id)}
  const cat=comp.youth?'Base':isNat?'Seleção':(it.cid==='cont'||it.cid==='int'||it.cid==='usc'||it.cid==='rec'||it.cid==='mun')?'Continental':it.cid==='mlscup'?'Liga':'Copas';
  const legs=[];let ag=0,at=0;
  for(let l=0;l<(rd.legs||1);l++){
   const home=rd.neutral?true:(rd.legs===2?l===1:ch(.5));
   const lbl=rd.n+(rd.legs===2?` · ${l?'volta':'ida'}`:'');
   const r=await playMine({us:usSide,them,home,neutral:!!rd.neutral,comp:comp.n,label:lbl,kind:isNat?'nat':'club',rotate:rd.rotate,youthS:comp.youth?usSide.s:null,live:wantLive('ko')||isDecisive(it),agg:l===1?[ag,at]:null,final:rd.n==='Final'},io);
   ag+=r.gu;at+=r.gt;record(cat,r.me);if(isNat){S.caps+=r.me.play?1:0;S.natGoals+=r.me.g}
   legs.push({r,home});
   if(r.live){const last=l===(rd.legs||1)-1;const tie=last&&ag===at;const decided=last&&!tie;
    await r.live.finish({agg:rd.legs===2&&last?[ag,at]:null,msg:tie?'Empate! Vai pros pênaltis.':decided?(ag>at?(rd.n==='Final'?'É CAMPEÃO!':'Classificado!'):(rd.n==='Final'?'Vice-campeão.':'Eliminado.')):'Fim do primeiro jogo.',win:decided?ag>at:null,final:rd.n==='Final'})}
  }
  let pens=null;
  if(ag===at){
   const lastMe=legs[legs.length-1].r.me;
   pens=await io.shootout({usS:usSide.s,themS:them.s,iAmIn:lastMe.play&&lastMe.min>0&&!lastMe.r,isGK:S.pos==='GOL',myIdx:S.taker.pen?0:2,comp:comp.n,round:rd.n,us:usSide,them,final:rd.n==='Final'});
  }
  const win=pens?pens.win:ag>at;
  if(win&&comp.stage+1>=comp.rounds.length&&io.celebrate){st.celebrated=st.celebrated||[];st.celebrated.push(comp.n);await io.celebrate({t:comp.t,n:comp.n,ic:comp.ic,code:comp.code||null,club:isNat?null:me.id,nat:isNat?S.nat:null})}
  const out=[];
  legs.forEach(({r,home},i)=>{const last=i===legs.length-1;const usI=isNat?{id:S.nat,n:NATS[S.nat].n,f:NATS[S.nat].f,nat:true}:null;
   const res=mkRes(comp.n,rd.n+(rd.legs===2?` · ${i?'volta':'ida'}`:''),home?usSide.id:them.id,home?them.id:usSide.id,home?r.gu:r.gt,home?r.gt:r.gu,r,home,last&&pens?(home?[pens.a,pens.b]:[pens.b,pens.a]):null,it.cid,comp.youth?(home?usSide:them):home?usI:them.nat?them:null,comp.youth?(home?them:usSide):home?(them.nat?them:null):usI);
   if(last){res.agg=rd.legs===2?[ag,at]:null;res.koWin=win;res.final=rd.n==='Final';res.note=win?(rd.n==='Final'?'CAMPEÃO':'Classificado'):(rd.n==='Final'?'Vice-campeão':'Eliminado')}
   comp.path.push(res);out.push(res)});
  if(win){comp.stage++;if(comp.stage>=comp.rounds.length){comp.won=true;comp.alive=false;st.titles.push({t:comp.t,n:comp.n,club:isNat?null:me.id,ic:comp.ic,code:comp.code||null})}}
  else{comp.alive=false;comp.out=rd.n}
  return{k:'multi',list:out};
 }
 if(it.k==='intl'){
  const nat=NATS[S.nat];
  const called=S.age>=18&&(S.ovr>=nat.s-7-(S.life.fama-50)/25+randn()*2);
  if(!called){S.st.natCalled=S.st.natCalled||false;return{k:'info',txt:`Data FIFA: você não foi convocado pela seleção.`,comp:'Seleção'}}
  st.natCalled=true;st.natStarter=S.ovr>=nat.s-1+randn()*1.5;
  const out=[];
  for(let i=0;i<2;i++){const them=natSide(pick(allNations().filter(x=>x.id!==S.nat)));
   const r=await playMine({us:natSide({id:S.nat,...nat}),them,home:ch(.5),comp:(S.year+1)%4===2?'Eliminatórias':'Amistoso',label:'Data FIFA',kind:'nat'},io);
   record('Seleção',r.me);S.caps+=r.me.play?1:0;S.natGoals+=r.me.g;
   out.push(mkRes(r?((S.year+1)%4===2?'Eliminatórias':'Amistoso internacional'):'', 'Data FIFA',S.nat,them.id,r.gu,r.gt,r,true,null,'intl',{id:S.nat,n:nat.n,f:nat.f,nat:true},them));}
  return{k:'multi',list:out};
 }
 return null;
}
function mkRes(comp,label,h,a,hg,ag,r,meHome,pens,cid,hOverride,aOverride){
 const hs=hOverride||(CLUB[h]?{id:h,n:CLUB[h].n,c1:CLUB[h].c1,c2:CLUB[h].c2,a:CLUB[h].a}:{id:h,n:h});
 const as=aOverride||(CLUB[a]?{id:a,n:CLUB[a].n,c1:CLUB[a].c1,c2:CLUB[a].c2,a:CLUB[a].a}:{id:a,n:a});
 const usG=meHome?hg:ag,thG=meHome?ag:hg;
 let wdl=usG>thG?'V':usG<thG?'D':'E';if(pens)wdl=(meHome?pens[0]>pens[1]:pens[1]>pens[0])?'V':'D';
 const res={k:'match',comp,label,home:hs,away:as,hg,ag,pens,me:r.me,scorers:r.scorers.map(s=>({...s,side:s.us?(meHome?'h':'a'):(meHome?'a':'h')})),wdl,cid,y:S.year};
 S.st.log.push(res);return res;
}

// Avança. Retorna lista de resultados ou {pause:'ev'}
async function stepSeason(io,mode){
 const st=S.st;const out=[];
 while(st.idx<st.cal.length){
  const it=st.cal[st.idx];
  if(it.k==='ev'){
   const ev=pickEvents(it.when);st.idx++;
   if(!ev)continue;
   if(mode==='auto'||mode==='sim'){const r=await io.event(ev);st.evlog.push({t:ev.t,txt:r.txt});continue}
   return{results:out,pause:{ev}};
  }
  if((mode==='auto'||mode==='block')&&isDecisive(it)&&!st.noStop&&(typeof visItem!=='function'||visItem(it)))return{results:out,stop:it};
  const r=await processItem(it,io);st.idx++;
  if(r){if(r.k==='multi')out.push(...r.list);else out.push(r)}
  if(r&&io.moment&&typeof postMatchMoments==='function')await postMatchMoments(r.k==='multi'?r.list:[r],io);
  if(mode==='one'&&r&&(r.k==='match'||r.k==='multi')&&(typeof visItem!=='function'||visItem(it)))break;
  if(mode==='block'&&st.idx>=blockEnd(st))break;
 }
 if(st.idx>=st.cal.length)st.done=true;
 return{results:out};
}

// ================== FIM DE TEMPORADA ==================
function endSeason(){
 const st=S.st;const me=club();const L=LG[me.l];const C=COUNTRY[me.country];
 const table=sortTable(st.table);const rank=table.findIndex(x=>x.id===me.id)+1;
 const titles=st.titles.slice();
 const isMLS=!!L.po;
 if(!isMLS&&rank===1&&!st.noPro)titles.unshift({t:'liga',n:L.n,club:me.id,ic:'liga',lg:me.l});
 if(isMLS&&rank===1&&!st.noPro)titles.push({t:'lcup',n:'Supporters’ Shield',club:me.id,ic:'lcup'});
 const mlsWon=st.comps.mlscup&&st.comps.mlscup.won;
 if(mlsWon){const i=titles.findIndex(t=>t.n==='MLS Cup');if(i>=0){titles[i].t='liga';titles[i].lg=me.l}}
 // ---- mundo: classificações de todas as ligas ----
 const order={};
 for(const l in LG){
  if(l===me.l){order[l]=table.map(x=>x.id);continue}
  const cl=leagueClubs(l);const noise=LG[l].tier>=2?4:3.4;
  order[l]=cl.map(c=>({id:c.id,v:c.s+randn()*noise})).sort((a,b)=>b.v-a.v).map(x=>x.id);
 }
 for(const l in order)order[l].forEach((id,i)=>W.pos[id]=i+1);
 for(const l in LG)W.champ[l]=order[l][0];
 if(isMLS&&!mlsWon){W.champ[me.l]=order[me.l][RI(0,3)]}
 // copas
 for(const c in COUNTRY){
  const cand=countryClubs(c);
  if(c===me.country&&st.comps.cup){W.cupwin[c]=st.comps.cup.won?me.id:wpick(cand.filter(x=>x.id!==me.id),x=>Math.exp((x.s-70)/4)).id}
  else W.cupwin[c]=wpick(cand,x=>Math.exp((x.s-70)/4)).id;
 }
 // continentais
 for(const k in CONT_INFO){
  if(st.comps.cont&&st.comps.cont.code===k&&st.comps.cont.won){W.contwin[k]=me.id;continue}
  const parts=contParticipants(k).filter(x=>x!==me.id||!(st.comps.cont&&st.comps.cont.code===k));
  if(parts.length)W.contwin[k]=wpick(parts.map(x=>CLUB[x]).filter(Boolean),x=>Math.exp((x.s-75)/2.5)).id;
 }
 // ---- acesso e rebaixamento ----
 const moves=[];let myMove=null;
 for(const l in LG){const Lx=LG[l];if(!Lx.next||!Lx.down)continue;
  const down=order[l].slice(-Lx.down),up=order[Lx.next].slice(0,Lx.down);
  for(const id of down){CLUB[id].l=Lx.next;moves.push([id,'down',Lx.next]);if(id===me.id)myMove={dir:'down',to:Lx.next}}
  for(const id of up){CLUB[id].l=l;moves.push([id,'up',l]);if(id===me.id)myMove={dir:'up',to:l}}
 }
 if(myMove){if(myMove.dir==='up')titles.push(...(rank===1&&LG[myMove.to]?[]:[]))}
 // força dos clubes varia
 for(const c of CLUBS){const tierPull=LG[c.l].tier===1?0:-.4;c.s=clamp(Math.round((c.s+(c.base-c.s)*.12+randn()*1.1+tierPull)*10)/10,45,92)}
 // ---- estrelas reais envelhecem ----
 const y=S.year+1;
 for(const s of W.stars){const age=y-s.born;s.r+=age<=23?RI(0,2):age<=28?RI(-1,1):age<=31?-RI(0,2):-RI(1,3);if(s.pos==='GOL'&&age<=34)s.r+=1}
 W.stars=W.stars.filter(s=>{const age=y-s.born;return!(age>=(s.pos==='GOL'?41:37)||s.r<72)});
 for(let i=0;i<3;i++){const tops=CLUBS.filter(c=>LG[c.l].tier===1).sort((a,b)=>b.s-a.s).slice(0,16);W.stars.push({n:fakeName(),club:pick(tops).id,pos:pick(['ATA','PE','PD','MEI','MC','ZAG','SA','GOL','VOL','LE','LD','ME','MD']),nat:pick(Object.keys(NATS)),born:y-19,r:RI(75,80),real:false,grow:RI(86,93)})}
 for(const s of W.stars)if(!s.real&&s.grow&&s.r<s.grow)s.r+=RI(1,3);
 // ---- prêmios e cerimônias ----
 const tot=Object.entries(st.stats).filter(([k])=>k!=='Base').map(([,v])=>v).reduce((a,s)=>({j:a.j+s.j,g:a.g+s.g,a:a.a+s.a,cs:a.cs+s.cs,ns:a.ns+s.ns,nn:a.nn+s.nn,min:a.min+s.min}),{j:0,g:0,a:0,cs:0,ns:0,nn:0,min:0});
 const nota=tot.nn?tot.ns/tot.nn:null;
 const lgS=st.stats['Liga']||{g:0,cs:0,j:0,a:0};
 const awards=[];const cer=[];const thr=D().thr;const P=POS[S.pos];const nat=NATS[S.nat];
 const meNom={n:S.name,f:nat.f,club:me.id,me:true};
 const nomOf=s=>({n:s.n,f:FLAG[s.nat]||'🏳️',club:s.club});
 const starsWhere=(f,k)=>shuffle(W.stars.filter(f)).sort((a,b)=>b.r-a.r).slice(0,k).map(nomOf);
 const fill=(arr,k)=>{while(arr.length<k)arr.push({n:fakeName(),f:pick(FLAG_LIST),club:null});return arr};
 const mkCer=(o,meWon,rivals,k=3)=>{const noms=meWon?[meNom,...rivals.slice(0,k-1)]:[...rivals.slice(0,1),meNom,...rivals.slice(1,k-1)];fill(noms,k);return{...o,noms:shuffle(noms),winner:meWon?S.name:noms.find(x=>!x.me).n}};
 const bigT=titles.filter(t=>['liga','cont','copa_mundo','nat','mun'].includes(t.t));
 const tb=t=>t.t==='liga'?(LG[t.lg]&&LG[t.lg].tier===1?(LG[t.lg].lp>=8?2.5:1.2):0):t.t==='cont'?(t.code==='UCL'?6:t.code==='LIB'?2.5:1):t.t==='copa_mundo'?6:t.t==='nat'?2.5:t.t==='mun'?2:0;
 // Bola de Ouro (sempre tem vencedor)
 let bola=null;
 const mineB=tot.j>=20?S.ovr+((nota||6.5)-7.1)*3+Math.min((tot.g*P.bw+tot.a*.35)/8,4)+bigT.reduce((s,t)=>s+tb(t),0)+P.bola*.5+L.bp*.35+thr-2+randn()*2:-99;
 const cands=W.stars.filter(s=>y-s.born>=18).map(s=>{const c=CLUB[s.club];let b=s.r+(POS[s.pos].bola*.5)+randn()*2.2;if(c&&W.champ[c.l]===c.id&&LG[c.l].tier===1)b+=LG[c.l].lp>=8?2.5:1;if(W.contwin.UCL===s.club)b+=6;if(c&&LG[c.l].bp<-10)b-=4;return{...nomOf(s),b}});
 cands.push({...meNom,b:mineB});cands.sort((a,b)=>b.b-a.b);
 const place=cands.findIndex(x=>x.me)+1;
 const top10=cands.slice(0,10).map(({b,...x})=>x);
 if(place<=3){bola={place,podium:top10.slice(0,3)};awards.push({t:place===1?'bola':'bola_top3',n:place===1?'Bola de Ouro':`Bola de Ouro · ${place}º lugar`,podium:top10.slice(0,3)})}
 st.bolaTop=top10.slice(0,3);st.bolaPlace=place;
 W.bolaHist=W.bolaHist||[];W.bolaHist.push({y:S.year+1,...top10[0]});
 const yearWinners=[{k:'bola',n:'Bola de Ouro',w:top10[0]}];
 // Golden Boy
 const youngR=starsWhere(s=>y-s.born<=21,4);
 if(S.age<=21&&tot.j>=20&&S.ovr>=74){
  const won=tot.j>=25&&nota>=7.05&&S.ovr>=79+thr&&ch(.7);
  const c=mkCer({k:'gb',ic:'revelacao',title:'Golden Boy',sub:'Melhor jogador sub-21 do mundo'},won,youngR);cer.push(c);
  if(won)awards.push({t:'revelacao',n:'Golden Boy',d:'Melhor jogador sub-21 do mundo'});
  yearWinners.push({k:'gb',n:'Golden Boy',w:won?meNom:c.noms.find(x=>x.n===c.winner)});
 }else yearWinners.push({k:'gb',n:'Golden Boy',w:youngR[0]||fill([],1)[0]});
 // Chuteira de Ouro (Europa)
 const strikers=starsWhere(s=>['ATA','SA','PE','PD','PON'].includes(s.pos)&&CLUB[s.club]&&COUNTRY[CLUB[s.club].country]&&COUNTRY[CLUB[s.club].country].conf==='EU',4);
 const chutWin=S.pos!=='GOL'&&C.conf==='EU'&&L.tier===1&&lgS.g>=30+thr+randn()*3;
 if(S.pos!=='GOL'&&C.conf==='EU'&&L.tier===1&&lgS.g>=18){const c=mkCer({k:'chut',ic:'chuteira',title:'Chuteira de Ouro',sub:'Maior artilheiro das ligas da Europa',stat:`Você: ${lgS.g} gols na liga`},chutWin,strikers);cer.push(c);yearWinners.push({k:'chut',n:'Chuteira de Ouro',w:chutWin?meNom:c.noms.find(x=>x.n===c.winner)})}
 else yearWinners.push({k:'chut',n:'Chuteira de Ouro',w:strikers[0]});
 if(chutWin)awards.push({t:'chuteira',n:'Chuteira de Ouro',d:`${lgS.g} gols na liga`});
 // Luva de Ouro
 const gks=starsWhere(s=>s.pos==='GOL',4);
 const luvaWin=S.pos==='GOL'&&L.tier===1&&lgS.cs>=Math.round(lgS.j*.42)+thr&&lgS.j>=25&&nota>=7;
 if(S.pos==='GOL'&&L.tier===1&&lgS.cs>=10){const c=mkCer({k:'luva',ic:'luva',title:'Luva de Ouro',sub:'Melhor goleiro do mundo',stat:`Você: ${lgS.cs} jogos sem sofrer gol`},luvaWin,gks);cer.push(c);yearWinners.push({k:'luva',n:'Luva de Ouro',w:luvaWin?meNom:c.noms.find(x=>x.n===c.winner)})}
 else yearWinners.push({k:'luva',n:'Luva de Ouro',w:gks[0]});
 if(luvaWin)awards.push({t:'luva',n:'Luva de Ouro',d:`${lgS.cs} jogos sem sofrer gol na liga`});
 // prêmios da liga
 const inLg=f=>starsWhere(s=>CLUB[s.club]&&CLUB[s.club].l===me.l&&f(s),3);
 const fakeLg=k=>{const out=[];const pool=leagueClubs(me.l).filter(c=>c.id!==me.id).sort((a,b)=>b.s-a.s).slice(0,6);for(let i=0;i<k;i++){const c=pick(pool);const rr=roster(c.id).filter(p=>p.pos!=='GOL');out.push({n:pick(rr).n,f:FLAG[c.country]||COUNTRY[c.country].f,club:c.id})}return out};
 const lgRiv=f=>{const a=inLg(f);return a.length>=2?a:a.concat(fakeLg(3-a.length))};
 const rivalTop=(L.tier===1?(L.lp>=8?22:18):15)+randn()*4+(W.stars.some(s=>CLUB[s.club]&&CLUB[s.club].l===me.l&&s.pos==='ATA'&&s.r>=87)?5:0);
 const artWin=S.pos!=='GOL'&&lgS.g>=rivalTop&&lgS.g>=8;
 if(S.pos!=='GOL'&&lgS.g>=Math.max(10,rivalTop-6)){const c=mkCer({k:'art',ic:'artilheiro',title:`Artilheiro da ${L.n}`,sub:'Quem mais fez gols no campeonato',stat:`Você: ${lgS.g} gols`},artWin,lgRiv(s=>['ATA','SA','PE','PD','PON'].includes(s.pos)));cer.push(c)}
 if(artWin)awards.push({t:'artilheiro',n:`Artilheiro da ${L.n}`,d:`${lgS.g} gols`});
 const posWin=lgS.j>=20&&nota>=7.2&&ch(clamp(.35+(nota-7.2)*1.2+(S.ovr-me.s)/20,.15,.9));
 if(lgS.j>=20&&nota>=6.85){const pn=POS[S.pos].n;const c=mkCer({k:'pos',ic:'posicao',title:`Melhor ${pn.toLowerCase()} da ${L.n}`,sub:'Seleção do campeonato',stat:`Nota média ${(nota||0).toFixed(2).replace('.',',')}`},posWin,lgRiv(s=>s.pos===S.pos||NEIGH[S.pos].includes(s.pos)));cer.push(c)}
 if(posWin)awards.push({t:'posicao',n:`Melhor ${POS[S.pos].n.toLowerCase()} da ${L.n}`,d:'Seleção do campeonato'});
 const craqueWin=rank<=3&&nota>=7.45&&lgS.j>=20;
 if(lgS.j>=20&&nota>=7.0){const c=mkCer({k:'liga',ic:'craque_liga',title:`Craque da ${L.n}`,sub:'Melhor jogador do campeonato',stat:`${rank}º lugar com o ${me.n}`},craqueWin,lgRiv(()=>true));cer.push(c)}
 if(craqueWin)awards.push({t:'craque_liga',n:`Craque da ${L.n}`,d:'Melhor jogador do campeonato'});
 if(tot.j>=25&&nota>=7.35&&S.ovr>=85&&L.bp>=-9)awards.push({t:'selecao',n:'Seleção da Temporada',d:`Melhor ${POS[S.pos].n.toLowerCase()} do ano`});
 const wc=st.comps.wc;
 if(wc&&wc.called){const g=wc.path.reduce((s,r)=>s+(r.me&&r.me.g||0),0);if(g>=5)awards.push({t:'chuteira',n:'Chuteira de Ouro da Copa',d:`${g} gols na Copa`});const ns=wc.path.filter(r=>r.me&&r.me.nota).map(r=>r.me.nota);if(ns.length>=5&&ns.reduce((a,b)=>a+b,0)/ns.length>=7.7&&['Semifinal','Final'].includes(wc.out||'Final'))awards.push({t:'bola',n:'Bola de Ouro da Copa',d:'Melhor jogador do Mundial',minor:true})}
 // ordem: liga, posição, artilheiro, golden boy, chuteira, luva, bola de ouro (principal)
 const ORD={pos:0,art:1,liga:2,gb:3,chut:4,luva:5};cer.sort((a,b)=>ORD[a.k]-ORD[b.k]);
 if(place<=10&&tot.j>=20)cer.push({k:'bola',ic:'bola',title:'Bola de Ouro',sub:`Cerimônia ${S.year+1}`,top10,place,winner:top10[0].n});
 // ---- registros ----
 const cs=S.clubs[me.id]||(S.clubs[me.id]={seasons:0,games:0,goals:0,assists:0,cs:0,titles:[],first:S.year});
 const clubGames=tot.j-(st.stats['Seleção']?st.stats['Seleção'].j:0);
 cs.seasons++;cs.games+=clubGames;cs.goals+=tot.g-(st.stats['Seleção']?st.stats['Seleção'].g:0);cs.assists+=tot.a-(st.stats['Seleção']?st.stats['Seleção'].a:0);cs.cs+=tot.cs;
 for(const t of titles){S.titles.push({...t,year:S.year});if(t.club===me.id)cs.titles.push({t:t.t,n:t.n})}
 for(const a of awards)if(!a.minor||a.t!=='bola')S.awards.push({...a,year:S.year});else S.awards.push({...a,t:'craque_copa',year:S.year});
 // vida
 const be=BEH[S.behavior].end;for(const k in be)S.life[k]=clamp(S.life[k]+be[k],0,100);
 S.life.fama=clamp(S.life.fama+((nota||6)-6.8)*5+titles.length*2+awards.length*4-2+(L.tier===1?1:-1)+(L.bp>-5?1:0),0,100);
 S.life.cab=clamp(S.life.cab+(58-S.life.cab)*.15+(titles.length?3:0)+(S.heart===me.id?4:0),0,100);
 if(S.age>=29)S.life.corpo=clamp(S.life.corpo-(S.age>=32?4:2),0,100);
 if(typeof lifeSeasonEnd==='function')lifeSeasonEnd();else S.din+=S.wage*52/1000*.5;
 if(S.rel!=='solteiro')S.life.cab=clamp(S.life.cab+1,0,100);
 const lang=COUNTRY[me.country].lang;if(!S.langs.includes(lang)){S.langYears[lang]=(S.langYears[lang]||0)+1;if(S.langYears[lang]>=2)S.langs.push(lang)}
 S.adapt=false;
 S.board=clamp(S.board+((nota||6.5)-6.8)*10+titles.length*4+(myMove&&myMove.dir==='down'?-10:0),0,100);
 // evolução
 const a=S.age;const share=clamp(Math.max((st.stats['Liga']?st.stats['Liga'].min:0)/(st.rounds.length*90),(st.stats['Base']?st.stats['Base'].min:0)/(14*90)*.65),0,1);
 const discM=.7+S.life.disc/170,bodyM=.85+S.life.corpo/400;let d;
 if(a<P.peak){const gap=Math.max(0,S.pot-S.ovr);const rate=.06+.16*share+(a<=21?clamp((me.s-70)/110,-.08,.14):0);d=gap*rate*discM*bodyM+randn()*1.3+st.forma*.12;if(ch(.1))S.pot=clamp(S.pot-RI(1,3),40,99)}
 else if(a<=P.peak+2){d=randn()*1+(S.life.disc-55)/60+(S.ovr<S.pot-3?1:0)}
 else{const yrs=a-P.peak-2;d=-(P.decl*1.3*(1+yrs*.45)*(1.4-S.life.corpo/100*.6)*D().decl)+randn()*1}
 d=Math.round(d);const before=S.ovr;if(d>0)d=Math.max(0,Math.min(d,S.pot+1-S.ovr));S.ovr=clamp(S.ovr+d,30,99);
 if(S.ovr>S.peak){S.peak=S.ovr;S.peakAge=S.age+1}
 // ídolo / estátua
 const news=[];
 for(const[id,v]of Object.entries(S.clubs)){
  const c=CLUB[id];if(!c)continue;
  const big=(v.games||0)<15?0:v.titles.reduce((s,t)=>s+(t.t==='base'?0:['est','super','usc','rec'].includes(t.t)?.5:1),0);
  const need=Math.max(1,stars(c.base)-(S.heart===id?1:0));
  if(!S.idols.includes(id)&&(big>=need||(v.seasons>=7&&v.games>=220))){S.idols.push(id);S.life.fama=clamp(S.life.fama+8,0,100);news.push({t:'idolo',club:id,txt:`Você virou ídolo do ${c.n}.`})}
  const contAt=v.titles.filter(t=>t.t==='cont').length;
  if(S.idols.includes(id)&&!S.statues.includes(id)&&(big>=need+3||v.seasons>=10||contAt>=2)){S.statues.push(id);news.push({t:'estatua',club:id,txt:`O ${c.n} vai erguer uma estátua sua na porta do estádio.`})}
 }
 if(S.youth){try{const pr=prospectRank(me.country);const prev=S.prospectRank;S.prospectRank=pr.rank;news.push({t:'prospecto',club:me.id,txt:`Você terminou o ano como o ${pr.rank}º melhor prospecto do país${prev?` (era ${prev}º)`:''}. Potencial de ${prospectStars(S.pot)} estrelas.`})}catch(e){}}
 const promo=youthPromotion(st,me);if(promo)news.push(promo);
 const tblRank=rank;
 const row={year:S.year,age:S.age,club:me.id,lg:L.n,tier:L.tier,pos:S.pos,ovr:before,delta:S.ovr-before,games:tot.j,goals:tot.g,assists:tot.a,cs:S.pos==='GOL'?tot.cs:null,nota:nota?Math.round(nota*100)/100:null,rank:tblRank,size:table.length,titles:titles.map(t=>t.ic||t.t),awards:awards.map(a=>a.t),loan:!!S.loan,move:myMove?myMove.dir:null};
 if(st.stats.Base){const b=st.stats.Base;row.youth={j:b.j,g:b.g,a:b.a,n:b.nn?Math.round(b.ns/b.nn*100)/100:null}}
 S.history.push(row);
 S.lastSeason={row,titles,awards,bola,rank,table,news,myMove,nota,tot,stats:st.stats,comps:st.comps,leagueName:L.n,cer,yearWinners,celebrated:st.celebrated||[]};
 S.carry=clamp(Math.round(((nota||6.3)-6.9)*1.2),-3,2);st.ended=true;
 S.contract--;S.age++;S.year++;W.year=S.year;
 return S.lastSeason;
}
function mustRetire(){
 if(S.age>=41)return'Aos 41 anos, o corpo disse chega.';
 if(S.age>=35&&S.ovr<62)return'Sem nível pra seguir jogando profissionalmente.';
 if(S.age>=33&&S.ovr<55)return'Sem nível pra seguir jogando profissionalmente.';
 return null;
}

// ================== PEDIDOS AO CLUBE ==================
function seasonsAt(){return(S.clubs[S.club]||{seasons:0}).seasons}
function askShirt(n){
 if(n===S.shirt)return{ok:true,txt:'Você já usa essa camisa.'};
 const c=club();let p=clamp(.25+(S.ovr-c.s)/12+(S.life.fama-40)/150+seasonsAt()/10-([10,9,7].includes(n)?.1:0),.05,.95);
 if(ch(p)){S.shirt=n;S.life.fama=clamp(S.life.fama+2,0,100);return{ok:true,txt:`A camisa ${n} é sua.`,chips:[['+2 Fama','up']]}}
 S.life.cab=clamp(S.life.cab-3,0,100);return{ok:false,txt:`O dono da ${n} não abriu mão. Fica pra próxima.`,chips:[['−3 Cabeça','down']]};
}
function askArmband(){
 if(S.captain)return{ok:true,txt:'Você já é o capitão.'};
 const c=club();const p=clamp(.08+(S.ovr-c.s)/10+(S.life.disc-50)/100+seasonsAt()*.08+(S.age-24)*.03,.02,.9);
 if(ch(p)){S.captain=true;S.life.fama=clamp(S.life.fama+4,0,100);S.life.disc=clamp(S.life.disc+3,0,100);return{ok:true,txt:'O técnico te entregou a braçadeira.',chips:[['Capitão','gold'],['+4 Fama','up']]}}
 S.life.cab=clamp(S.life.cab-4,0,100);S.board=clamp(S.board-3,0,100);return{ok:false,txt:'O técnico disse que ainda não é a hora.',chips:[['−4 Cabeça','down']]};
}
function askTaker(kind){
 if(S.pos==='GOL')return{ok:false,txt:'Goleiro não entra na fila de cobranças.'};
 if(S.taker[kind])return{ok:true,txt:'Você já é o cobrador.'};
 const c=club();const skill=kind==='pen'?CA().FIN:(CA().FIN+CA().PAS)/2;
 const p=clamp(.3+(skill-75)/40+(S.ovr-c.s)/15,.05,.95);
 if(ch(p)){S.taker[kind]=true;return{ok:true,txt:kind==='pen'?'Você é o batedor oficial de pênaltis.':'As faltas são suas.',chips:[[kind==='pen'?'Cobrador de pênaltis':'Cobrador de faltas','gold']]}}
 return{ok:false,txt:'O técnico manteve o batedor atual.'};
}
function askRaise(){
 if(S.loan)return{ok:false,txt:'Emprestado não pede aumento.'};
 const last=S.history[S.history.length-1];const c=club();
 const p=clamp(.35+((last&&last.nota||6.8)-6.9)*.5+(S.ovr-c.s)/12+(S.board-60)/100,.05,.9);
 if(ch(p)){const inc=R(1.15,1.4);S.wage=Math.round(S.wage*inc);return{ok:true,txt:`Aumento aprovado: agora €${S.wage} mil por semana.`,chips:[[`+${Math.round((inc-1)*100)}% salário`,'up']]}}
 S.board=clamp(S.board-12,0,100);S.life.cab=clamp(S.life.cab-3,0,100);return{ok:false,txt:'A diretoria negou e não gostou do pedido.',chips:[['−12 Diretoria','down']]};
}
function renewalOffer(){
 const c=club();if(S.loan||S.contract>1)return null;
 const wants=(S.ovr>=c.s-9||S.age<=20)&&S.board>=25&&!(S.age>=33&&S.ovr<c.s-4);
 if(!wants)return{refuse:true};
 return{years:S.age>=31?RI(1,2):RI(2,4),wage:Math.round(Math.max(S.wage,wageFor(c,S.ovr))*R(1,1.12))};
}
function negotiate(off){if(ch(clamp(.35+(S.board-50)/100+(S.ovr-club().s)/15,.1,.85))){off.wage=Math.round(off.wage*1.15);return{ok:true,txt:`A diretoria topou: €${off.wage} mil por semana.`}}off.withdrawn=true;return{ok:false,txt:'A diretoria encerrou a conversa. Seu contrato vai acabar.'}}

// ================== MERCADO ==================
function windowState(){
 const ls=S.lastSeason;const c=club();
 if(S.loan)return{open:true,forced:'loanEnd'};
 let release=S.flags.release==='youth'||(!!S.flags.release&&ch(.65));
 if(!release&&ls&&(ls.row.games<12)&&S.age>21&&ch(.35))release=true;
 if(!release&&S.board<20&&ch(.5))release=true;
 if(!release&&S.life.disc<25&&ch(.3))release=true;
 const relegatedStar=ls&&ls.myMove&&ls.myMove.dir==='down'&&S.ovr>=c.s+2;
 if(S.contract<=0){const wants=!S.flags.renewRefused&&(S.ovr>=c.s-9||S.age<=20)&&!(S.age>=33&&S.ovr<c.s-4)&&!release&&S.board>=20;return{open:true,renew:wants,release}}
 const great=ls&&ls.nota>=7.5&&c.s<S.ovr-2&&ch(.7);
 const open=release||relegatedStar||S.flags.window||great||S.flags.scout||(ls&&ls.row.games<15&&ch(.6))||ch(.25)||(S.heart&&S.heart!==c.id&&ch(.15));
 return{open,stay:!release,release,relegatedStar};
}
function mkOffer(x,mul){const m=mul?mul(x):1;return{club:x.id,years:x.s>=S.ovr+3&&S.age<26?RI(4,5):S.age>=32?RI(1,2):RI(2,4),wage:Math.round(wageFor(x,S.ovr)*m*R(.9,1.15)),role:roleFor(S.ovr,x.s,S.age)}}
function genOffers(leagueFilter){
 const c=club();const ag=S.agent==='tubarao'?2.5:S.agent==='pai'?-2:0;const ls=S.lastSeason;
 const target=S.ovr+1+(S.life.fama-50)/15+(ls&&ls.nota?(ls.nota-7)*3:0)+ag+(S.flags.scout?3:0)+randn()*2;
 const out=[];const exclude=new Set([c.id,S.loan&&S.loan.parent]);
 let base=CLUBS.filter(x=>!exclude.has(x.id));
 if(leagueFilter)base=base.filter(x=>x.l===leagueFilter);
 let cand=base.filter(x=>x.s>=target-9&&x.s<=target+3);
 if(cand.length<2)cand=base.slice().sort((a,b)=>Math.abs(a.s-target)-Math.abs(b.s-target)).slice(0,4);
 const scored=shuffle(cand).sort((a,b)=>Math.abs(a.s-target+2)-Math.abs(b.s-target+2)+R(-3,3));
 for(const x of scored){if(out.length>=2)break;out.push(mkOffer(x))}
 if(!leagueFilter){
  if(S.age>=31){const late=shuffle(CLUBS.filter(x=>['USA1','KSA1','BRA1'].includes(x.l)&&!exclude.has(x.id)&&x.s<=S.ovr+6));if(late[0])out[out.length-1]=mkOffer(late[0],x=>x.l==='KSA1'?1.5:1.2);if(S.firstClub&&!exclude.has(S.firstClub)&&ch(.45))out[0]={...mkOffer(CLUB[S.firstClub]),home:true}}
  if(S.heart&&!exclude.has(S.heart)&&S.ovr>=CLUB[S.heart].s-8&&ch(.4))out[0]={...mkOffer(CLUB[S.heart]),heart:true};
  if(S.age<=21&&!S.loan&&ls&&ls.row.games<15&&c.s>=S.ovr+8){const lo=shuffle(CLUBS.filter(x=>x.id!==c.id&&x.s>=S.ovr-2&&x.s<=S.ovr+3));if(lo[0])out[out.length-1]={...mkOffer(lo[0]),loan:true,years:1,wage:S.wage}}
 }
 S.flags.scout=false;
 return out;
}
function stayOffer(){const c=club();return{club:c.id,stay:true,years:S.contract>0?S.contract:RI(2,3),wage:S.contract>0?S.wage:Math.round(Math.max(S.wage,wageFor(c,S.ovr))*R(1,1.1)),role:roleFor(S.ovr,c.s,S.age),renew:S.contract<=0}}
function acceptOffer(o){
 const changed=!o.stay&&o.club!==S.club;
 if(o.stay){S.contract=o.years;S.wage=o.wage}
 else if(o.loan){S.loan={parent:S.club,contract:S.contract,wage:S.wage};S.club=o.club;S.contract=1}
 else{S.club=o.club;S.contract=o.years;S.wage=o.wage;S.loan=null;if(!S.langs.includes(COUNTRY[club().country].lang))S.adapt=true}
 if(changed){S.captain=false;S.taker={pen:false,fk:false};S.board=60;S.shirt=S.num}
 if(!S.firstClub)S.firstClub=S.club;
 S.flags.window=false;S.flags.release=false;S.flags.renewRefused=false;
}
function endLoan(){if(!S.loan)return;S.club=S.loan.parent;S.contract=S.loan.contract;S.wage=S.loan.wage;S.loan=null;S.flags.window=true;S.captain=false;S.taker={pen:false,fk:false}}
function academyOffers(){
 const nat=NATS[S.nat];const home=countryClubs(nat.home).sort((a,b)=>b.s-a.s);
 const big=home.slice(0,Math.ceil(home.length*.2)),mid=home.slice(Math.ceil(home.length*.2),Math.ceil(home.length*.55)),small=home.slice(Math.ceil(home.length*.55));
 const potBand=S.pot>=90?3:S.pot>=84?2:1;const out=[];
 if(potBand>=2||ch(.35))out.push(pick(big));out.push(pick(mid));out.push(pick(small.length?small:mid));
 if(potBand===3&&COUNTRY[nat.home].conf!=='EU'&&ch(.6)){const eu=CLUBS.filter(x=>COUNTRY[x.country].conf==='EU'&&x.s>=80);out[out.length-1]=pick(eu)}
 if(S.heart&&ch(.5)&&CLUB[S.heart].country===nat.home)out[0]=CLUB[S.heart];
 const uniq=[...new Map(out.map(x=>[x.id,x])).values()];
 while(uniq.length<3){const x=pick(home);if(!uniq.find(u=>u.id===x.id))uniq.push(x)}
 return uniq.slice(0,3).map(x=>({club:x.id,years:3,wage:Math.max(1,Math.round(wageFor(x,S.ovr)*.6)),role:roleFor(S.ovr,x.s,16),academy:true,heart:x.id===S.heart}));
}

// ================== LEGADO ==================
const TIERS=[
 [0,'Ficou pelo caminho','O futebol engoliu mais um'],
 [70,'Jogador comum','Onde a maioria termina'],
 [120,'Sensação de uma temporada','Teve seu momento'],
 [175,'Profissional de respeito','Carreira sólida'],
 [240,'Estrela','Nome conhecido no mundo todo'],
 [310,'Ídolo eterno','Estátua na porta do estádio'],
 [390,'Jogador histórico','Entra em qualquer seleção da década'],
 [470,'Melhor da geração','Exige 1 Bola de Ouro'],
 [600,'Top 10 da história','Exige 2 Bolas de Ouro'],
 [720,'No debate do maior','Exige 3 Bolas de Ouro'],
 [860,'O Predestinado','5 Bolas de Ouro e uma Copa do Mundo'],
];
function totals(){const h=S.history;return{games:h.reduce((s,x)=>s+x.games,0),goals:h.reduce((s,x)=>s+x.goals,0),assists:h.reduce((s,x)=>s+x.assists,0),cs:h.reduce((s,x)=>s+(x.cs||0),0)}}
function legacy(){
 const t=S.titles,aw=S.awards;const cnt=k=>t.filter(x=>x.t===k).length;let pts=0;
 for(const x of t){
  if(x.t==='liga'){const l=LG[x.lg]||{lp:2};pts+=l.lp}
  else if(x.t==='cont')pts+=(CONT_INFO[x.code]||{pts:5}).pts*.8;
  else pts+=TITLE_PTS[x.t]||1;
 }
 const ac=k=>aw.filter(a=>a.t===k).length;
 pts+=ac('bola')*35+ac('bola_top3')*8+ac('chuteira')*8+ac('luva')*12+ac('selecao')*4+ac('revelacao')*4+ac('craque_liga')*3+ac('artilheiro')*3+ac('craque_copa')*8;
 pts+=Math.max(0,S.peak-70)*2.2;
 const tot=totals();pts+=tot.games*.03;
 const PN={GOL:0,ZAG:3.5,LE:2.5,LD:2.5,LAT:2.5,VOL:3,MC:2,ME:1.8,MD:1.8,MEI:1.3,PE:1.2,PD:1.2,PON:1.2,SA:1.1,ATA:1};
 pts+=S.pos==='GOL'?tot.cs*.07:(tot.goals+tot.assists*.7)*PN[S.pos]*.18;
 pts+=S.caps*.08+S.idols.length*8+S.statues.length*10;
 pts=Math.round(pts);
 const bolas=ac('bola');let tier=0;for(let i=0;i<TIERS.length;i++)if(pts>=TIERS[i][0])tier=i;
 if(tier>=7&&bolas<1)tier=6;if(tier>=8&&bolas<2)tier=7;if(tier>=9&&bolas<3)tier=8;if(tier>=10&&(bolas<5||cnt('copa_mundo')<1))tier=9;
 return{pts,tier,bolas};
}
function nickname(){
 const L=legacy();const ac=k=>S.awards.filter(a=>a.t===k).length;const tot=totals();
 if(L.tier>=10)return'O Predestinado';
 if(ac('bola')>=3)return'O Rei da Bola';
 if(S.titles.some(t=>t.t==='copa_mundo'))return'O Campeão do Mundo';
 if(S.statues.length)return`Estátua no ${CLUB[S.statues[0]].n}`;
 if(ac('chuteira')>=2)return'O Matador';
 if(ac('luva')>=2)return'O Paredão';
 if(tot.goals>=400)return'Máquina de Gols';
 if(tot.assists>=200)return'O Garçom';
 if(S.idols.length>=2)return'Ídolo de Várias Torcidas';
 if(S.idols.length===1)return`Lenda do ${CLUB[S.idols[0]].n}`;
 if(S.titles.length>=12)return'Colecionador de Taças';
 if(Object.keys(S.clubs).length>=7)return'O Andarilho';
 if(S.life.fama>=80)return'Popstar';
 if(L.tier<=1)return'Promessa que Não Vingou';
 return'O Operário';
}
function autoOffer(offers){
 let best=null,bs=-1e9;
 for(const o of offers){const c=CLUB[o.club];const rs={Titular:4,'Rotação':0,Reserva:-7,Base:-9}[o.role];
  const sc=S.age>=33?o.wage/30+rs:c.s+rs+(o.stay?1:0)+(o.loan?3:0)+(o.heart?2:0);if(sc>bs){bs=sc;best=o}}
 return best;
}
