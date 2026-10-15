// ================== CATEGORIAS DE BASE ==================
const YOUTH_NAMES={
 BRA:{lg:'Brasileirão Sub-20',cup:'Copinha'},ENG:{lg:'Premier League 2',cup:'FA Youth Cup'},ESP:{lg:'División de Honor Juvenil',cup:'Copa del Rey Juvenil'},
 ITA:{lg:'Campionato Primavera',cup:'Coppa Italia Primavera'},GER:{lg:'U19 Bundesliga',cup:'DFB-Pokal Junioren'},FRA:{lg:'Championnat National U19',cup:'Coupe Gambardella'},
 POR:{lg:'Liga Revelação',cup:'Taça Revelação'},NED:{lg:'Divisie 1 O19',cup:'KNVB Beker O19'},ARG:{lg:'Torneo Proyección',cup:'Copa de la Reserva'},
 USA:{lg:'MLS NEXT',cup:'MLS NEXT Cup'},KSA:{lg:'Saudi U-21 League',cup:'Copa Saudita Sub-21'},
};
const YSUF={BRA:'Sub-20',ENG:'Sub-21',ESP:'Sub-19',ITA:'Primavera',GER:'Sub-19',FRA:'Sub-19',POR:'Sub-23',NED:'Sub-19',ARG:'Reserva',USA:'Sub-18',KSA:'Sub-21'};
const ysuf=id=>{const c=CLUB[id];return YSUF[c&&c.country]||'Sub-20'};
const youthSide=id=>{const c=CLUB[id];return{id,n:(c?c.n:id)+' '+ysuf(id),s:(c?c.s:60)-11+randn()*1.5,c1:c&&c.c1,c2:c&&c.c2,a:c&&c.a,youth:true}};
function addYouthToSeason(st,me,pre,items){
 const C=COUNTRY[me.country];const Y=YOUTH_NAMES[me.country]||{lg:'Liga Sub-20',cup:'Copa Sub-20'};
 const pool=countryClubs(me.country).filter(x=>x.id!==me.id).sort((a,b)=>b.s-a.s).slice(0,24).map(x=>x.id);
 const teams=[me.id,...shuffle(pool).slice(0,8)];
 // turno único, 9 times (método do círculo com folga)
 const sl=[...teams,null];const RR=[];
 for(let r=0;r<9;r++){const fx=[];for(let i=0;i<5;i++){const a=sl[i],b=sl[9-i];if(a&&b)fx.push(r%2?[b,a]:[a,b])}RR.push(fx);sl.splice(1,0,sl.pop())}
 RR.push(...RR.map(fx=>fx.map(([a,b])=>[b,a])));
 const myR=[],opps=[],homes=[];let bye=[];
 RR.forEach((fx,r)=>{const m=fx.find(f=>f.includes(me.id));if(!m){bye.push(r);return}myR.push(r);opps.push(m[0]===me.id?m[1]:m[0]);homes.push(m[0]===me.id)});
 const gtab={};for(const id of teams)gtab[id]={id,p:0,j:0,v:0,e:0,d:0,gp:0,gc:0};
 st.comps.yl={id:'yl',n:Y.lg,ic:'est',t:'base',kind:'yl',youth:true,opps,homes,myR,bye,RR,gtab,pts:0,gp:0,gc:0,stage:0,alive:true,path:[],rounds:[]};
 opps.forEach((_,i)=>items.push([.05+.9*(i/(opps.length-1)),{k:'yl',i}]));
 const useUYL=C.conf==='EU'&&myContComp(me)==='UCL';
 const cupN=useUYL?'UEFA Youth League':Y.cup;
 const rounds=me.country==='BRA'?['1ª fase','2ª fase','Oitavas','Quartas','Semifinal','Final']:['Oitavas','Quartas','Semifinal','Final'];
 const cpool=useUYL?contParticipants('UCL'):pool;
 st.comps.yc={id:'yc',n:cupN,ic:me.country==='BRA'?'copa':'cont3',t:'base',kind:'ko',youth:true,pool:cpool,stage:0,alive:true,path:[],rounds:rounds.map(n=>({n,legs:1,neutral:n==='Final'}))};
 if(me.country==='BRA')rounds.forEach(()=>pre.push({k:'ko',cid:'yc'}));
 else rounds.forEach((_,i)=>items.push([.35+.5*(i/(rounds.length-1)),{k:'ko',cid:'yc'}]));
 items.push([.5,{k:'debut'}]);
 items.push([.22,{k:'ev',when:'mid'}]);
}
async function processYouth(it,io){
 const st=S.st;const me=club();
 if(it.k==='yl'){
  const comp=st.comps.yl;const oid=comp.opps[it.i];const us=youthSide(me.id),them=youthSide(oid);const home=comp.homes?comp.homes[it.i]:it.i%2===0;
  const r=await playMine({us,them,home,comp:comp.n,label:`${it.i+1}ª rodada`,youthS:us.s,live:wantLive('grp')},io);if(r.live)await r.live.finish({msg:'Fim de jogo.'});
  record('Base',r.me);comp.pts+=r.gu>r.gt?3:r.gu===r.gt?1:0;comp.gp+=r.gu;comp.gc+=r.gt;
  const res=mkRes(comp.n,`${it.i+1}ª rodada`,home?me.id:oid,home?oid:me.id,home?r.gu:r.gt,home?r.gt:r.gu,r,home,null,'yl',home?us:them,home?them:us);comp.path.push(res);
  let rank;
  if(comp.gtab){
   tabAdd(comp.gtab,home?me.id:oid,home?oid:me.id,home?r.gu:r.gt,home?r.gt:r.gu);
   const sim=ri=>{for(const[a,b]of comp.RR[ri]){if(a===me.id||b===me.id)continue;const[g1,g2]=quickScore(youthStr(a),youthStr(b));tabAdd(comp.gtab,a,b,g1,g2)}};
   sim(comp.myR[it.i]);if(it.i===0){if(Array.isArray(comp.bye))comp.bye.forEach(sim);else if(comp.bye>=0)sim(comp.bye)}
   rank=sortTable(comp.gtab).findIndex(x=>x.id===me.id)+1;
  }
  if(it.i===comp.opps.length-1){
   if(!rank){const others=comp.opps.map(id=>Math.round(8*(1.1+(CLUB[id].s-me.s)/30)+R(-4,4)+R(3,6)));rank=1+others.filter(p=>p>comp.pts||(p===comp.pts&&ch(.5))).length}
   comp.rank=rank;
   if(rank===1){comp.won=true;st.titles.push({t:'base',n:comp.n,club:me.id,ic:'est'});res.note=`Campeões da ${comp.n}!`;if(io.celebrate)await io.celebrate({t:'base',n:comp.n,ic:'est',club:me.id});st.celebrated=st.celebrated||[];st.celebrated.push(comp.n)}
   else res.note=`${rank}º lugar · ${comp.n} (${comp.pts} pts)`;comp.alive=false;
  }else if(rank)res.note=`${rank}º na tabela · ${comp.n}`;
  return res;
 }
 if(it.k==='debut'){
  if(S.flags.debuted||!S.youth)return null;
  const b=st.stats.Base;const n=b&&b.nn?b.ns/b.nn:6.5;
  const p=clamp(.25+(n-6.8)*.45+(S.ovr-(me.s-10))/14+(S.life.disc-55)/150,.05,.9);
  if(ch(p)){st.debutNext=true;return{k:'info',comp:'Profissional',txt:`O técnico do profissional te chamou! Você está relacionado pro próximo jogo da ${LG[me.l].n}.`}}
  return{k:'info',comp:'Profissional',txt:'O técnico do profissional observou seus jogos na base, mas ainda não te chamou.'};
 }
 return null;
}
function youthPromotion(st,me){
 if(!S.youth)return null;
 const b=st.stats.Base;const n=b&&b.nn?b.ns/b.nn:6.3;
 let p=clamp(.12+(n-6.9)*.7+(S.ovr-(me.s-10))/10+(S.flags.debuted?.2:0)+(st.comps.yl&&st.comps.yl.won?.15:0)+(S.age>=18?.12:0),.03,.95);
 if(S.age>=19){if(n>=6.4||S.ovr>=me.s-14)p=1;else{S.flags.pro=true;S.flags.release='youth';return{t:'nopromo',club:me.id,txt:`Aos ${S.age+1} anos, o ${me.n} não te promoveu e te liberou. Hora de buscar outro clube como profissional.`}}}
 if(ch(p)){S.flags.pro=true;S.promotedAt=me.id;S.wage=Math.max(S.wage,Math.round(wageFor(me,S.ovr)*1.1));S.contract=Math.max(S.contract,3);S.life.fama=clamp(S.life.fama+4,0,100);return{t:'promo',club:me.id,txt:`Você foi promovido ao time principal do ${me.n}. Contrato profissional assinado.`}}
 return{t:'nopromo',club:me.id,txt:`Ainda não foi dessa vez: mais uma temporada na base do ${me.n}. Você tem até os 20 pra subir.`};
}

// eventos exclusivos da base
EV.push(
{id:'alojamento',k:'vida',y:1,a:[15,19],c:()=>S.youth,t:'Noite no alojamento',d:()=>'É sua primeira vez longe de casa. No alojamento da base, os garotos mais velhos planejam pular o muro pra ir num baile.',o:[
 ['Ir junto com eles',()=>ch(.5)?['Ninguém pegou. Você ficou amigo da turma.',{cab:6,disc:-6}]:['O coordenador pegou todo mundo. Suspenso dos jogos da base.',{susp:2,disc:-12,board:-8}]],
 ['Ficar e ligar pra sua mãe',()=>['Saudade apertou, mas a cabeça ficou no lugar.',{disc:5,cab:2}],1],
 ['Avisar o coordenador',()=>ch(.5)?['O clube gostou da sua atitude.',{disc:6,board:6}]:['Os garotos descobriram quem dedurou.',{cab:-8,disc:4}]]]},
{id:'treinopro',k:'campo',y:1,a:[15,19],c:()=>S.youth,t:'Treino com o profissional',d:()=>{const st=W.stars.filter(s=>s.club===S.club);S._idol=st.length?st.sort((a,b)=>b.r-a.r)[0].n:'o camisa 10 do time';return `Faltou gente no treino do time principal e te chamaram. ${S._idol} está do outro lado do campo.`},o:[
 ['Pedir dicas pra ele no fim',()=>ch(.7)?[`${S._idol} ficou meia hora te ensinando.`,{ovr:1,cab:5}]:['Ele estava com pressa e só deu um tapinha nas costas.',{cab:1}],1],
 ['Dar caneta nele no treino',()=>ch(.4)?['Todo mundo riu. O técnico anotou seu nome.',{fama:4,scout:1,forma:2}]:['Ele te deu uma entrada dura. Ficou mancando.',{inj:.06,cab:-3}]],
 ['Ficar na sua e correr muito',()=>['O preparador elogiou sua intensidade.',{disc:4,forma:1}]]]},
{id:'escola',k:'vida',y:1,a:[15,18],c:()=>S.youth,t:'Escola ou treino?',d:()=>'As provas do colégio caem na mesma semana da reta final da base.',o:[
 ['Estudar e fazer as provas',()=>['Passou de ano. Seus pais ficaram orgulhosos.',{cab:6,forma:-1}],1],
 ['Faltar as provas e treinar',()=>ch(.6)?['Voou nos jogos da semana.',{forma:3,cab:-3}]:['Reprovou e ficou de castigo em casa.',{cab:-8}]]]},
{id:'assedio',k:'vida',y:1,a:[15,19],c:()=>S.youth,t:'Empresários na porta de casa',d:()=>'Depois de dois jogos bons na base, três empresários apareceram na casa dos seus pais oferecendo dinheiro adiantado.',o:[
 ['Aceitar o dinheiro de um deles',()=>['A família respirou, mas agora você deve favor.',{din:.05,agent:'tubarao',disc:-3}]],
 ['Deixar o clube cuidar disso',()=>['O clube blindou você e renovou seu contrato de formação.',{board:6,cab:3}],1],
 ['Ignorar todos',()=>['Foco total na bola.',{disc:3}]]]},
{id:'copinha_estrela',k:'campo',y:1,a:[15,19],c:()=>S.youth,t:'Jogo televisionado da base',d:()=>'Vai passar na TV aberta. Os narradores já falam do "garoto promessa".',o:[
 ['Jogar simples e pro time',()=>ch(.7)?['Atuação madura. Os comentaristas elogiaram.',{fama:4,forma:2}]:['Passou despercebido.',{}],1],
 ['Partir pra cima e tentar a jogada da vida',()=>ch(.4)?['Golaço! O vídeo viralizou.',{fama:12,scout:1,forma:2}]:['Perdeu a bola e o time levou o gol.',{fama:-3,cab:-5,forma:-2}]]]},
{id:'primeirachuteira',k:'vida',y:1,a:[15,19],c:()=>S.youth,t:'Primeiro patrocínio',d:()=>'Uma marca oferece chuteiras de graça e um pequeno contrato.',o:[
 ['Assinar',()=>['Chuteira nova, foto nas redes.',{din:.02,fama:3}],1],
 ['Esperar uma marca maior',()=>ch(.4)?['Uma marca gigante apareceu depois.',{din:.06,fama:5}]:['Ninguém mais ligou.',{cab:-2}]]]}
);

// ================== ELENCOS DA BASE E PROSPECTOS ==================
const youthStr=id=>{const c=CLUB[id];return(c?c.s:60)-11};
const YPOS=['GOL','ZAG','ZAG','LE','LD','VOL','MC','MEI','ME','MD','PE','PD','SA','ATA','ATA','MC'];
const YNAMES={
 pt:{f:['Gabriel','Kauã','Vitor','Luiz','Pedro','João','Matheus','Gustavo','Davi','Kaique','Rian','Wesley','Thiago','Igor','Breno','Caio','Nathan','Ruan','Arthur','Luan','Enzo','Murilo','Yuri','Felipe','Samuel','Heitor','Diogo','Vinícius','Kauan','Erick'],l:['Silva','Souza','Santos','Oliveira','Lima','Pereira','Costa','Rodrigues','Almeida','Nascimento','Carvalho','Gomes','Ribeiro','Martins','Araújo','Barbosa','Rocha','Dias','Teixeira','Moura','Cardoso','Mendes','Freitas','Correia','Pinto','Batista','Monteiro','Vieira','Ramos','Cunha']},
 es:{f:['Mateo','Thiago','Santiago','Joaquín','Valentín','Bautista','Iker','Álvaro','Pablo','Hugo','Marcos','Nicolás','Facundo','Tomás','Lautaro','Gonzalo','Unai','Rodrigo','Adrián','Franco'],l:['García','Fernández','González','López','Martínez','Sánchez','Pérez','Gómez','Díaz','Romero','Álvarez','Torres','Ruiz','Molina','Navarro','Herrera','Medina','Castro','Ortega','Vega']},
 en:{f:['Harry','Jack','Oliver','Charlie','Alfie','Mason','Jayden','Tyler','Ethan','Callum','Kai','Rico','Leo','Archie','Ryan','Josh','Liam','Jamie','Ben','Noah'],l:['Smith','Jones','Taylor','Brown','Walker','Wright','Hall','Green','Hughes','Clarke','Phillips','Bennett','Morris','Ward','Cole','Mitchell','Parker','Turner','Reid','Kelly']},
 it:{f:['Lorenzo','Francesco','Matteo','Alessandro','Andrea','Gabriele','Riccardo','Tommaso','Edoardo','Federico','Simone','Pietro','Davide','Giorgio','Luca'],l:['Rossi','Russo','Ferrari','Esposito','Bianchi','Romano','Colombo','Ricci','Marino','Greco','Bruno','Gallo','Conti','De Luca','Costa']},
 de:{f:['Leon','Lukas','Finn','Jonas','Paul','Felix','Elias','Noah','Luca','Max','Tim','Jannik','Nico','Moritz','Lennart'],l:['Müller','Schmidt','Schneider','Fischer','Weber','Meyer','Wagner','Becker','Hoffmann','Koch','Richter','Klein','Wolf','Neumann','Krüger']},
 fr:{f:['Lucas','Hugo','Enzo','Nathan','Théo','Mathis','Rayan','Kylian','Yanis','Noah','Bilal','Moussa','Ibrahim','Adam','Malo'],l:['Martin','Bernard','Dubois','Thomas','Robert','Petit','Durand','Leroy','Moreau','Diallo','Traoré','Camara','Koné','Fofana','Lambert']},
 nl:{f:['Daan','Sem','Milan','Levi','Jesse','Thijs','Lucas','Ruben','Bram','Luuk','Jayden','Xavi','Noah','Tijn','Joep'],l:['de Jong','Jansen','de Vries','van Dijk','Bakker','Visser','Smit','Meijer','de Boer','Mulder','Bos','Vos','Peters','Hendriks','van den Berg']},
 ar:{f:['Mohammed','Abdullah','Faisal','Saud','Khalid','Turki','Nawaf','Fahad','Salem','Yasser','Hamad','Rakan','Ziyad','Abdulrahman','Majed'],l:['Al-Ghamdi','Al-Dossari','Al-Shehri','Al-Qahtani','Al-Otaibi','Al-Harbi','Al-Zahrani','Al-Mutairi','Al-Anazi','Al-Shammari','Al-Malki','Al-Juhani','Al-Subaie','Al-Amri','Al-Rashidi']}
};
const YLANG={BRA:'pt',POR:'pt',ESP:'es',ARG:'es',ENG:'en',USA:'en',ITA:'it',GER:'de',FRA:'fr',NED:'nl',KSA:'ar'};
function youthName(id,rr){
 const c=CLUB[id];const lg=YLANG[c&&c.country];const P=YNAMES[lg];
 if(!P||rr()<.12)return fakeName(rr);
 return P.f[Math.floor(rr()*P.f.length)]+' '+P.l[Math.floor(rr()*P.l.length)];
}
function youthProspect(id){
 const c=CLUB[id];const rr=seeded(hash(id+'#P'+((S&&S.year)||0)));
 const s=c?c.s:60;const age=16+Math.floor(rr()*3);
 const pot=Math.round(clamp(60+(s-60)*.5+rr()*16,64,93));
 const ovr=Math.round(clamp(38+(age-15)*5+(pot-75)*.45+rr()*6,42,72));
 const pos=YPOS[1+Math.floor(rr()*(YPOS.length-1))];
 return{n:youthName(id,rr),pos,age,pot,ovr,club:id,star:true};
}
function youthRoster(id){
 const rr=seeded(hash(id+'#Y'+((S&&S.year)||0)));
 const p=youthProspect(id);
 return[p,...YPOS.filter((_,i)=>i!==YPOS.indexOf(p.pos)).map(pos=>({n:youthName(id,rr),pos}))];
}
function sideRoster(side,nat){return nat||side.nat?natRoster(side.id):side.youth?youthRoster(side.id):roster(side.id)}
function myProspectScore(){
 const b=S.st&&S.st.stats&&S.st.stats.Base;const n=b&&b.nn?b.ns/b.nn:6.6;
 return S.ovr*.45+S.pot*.55+(n-6.6)*4+(S.life.fama-20)*.04;
}
function prospectRank(country){
 country=country||(club()?club().country:S.nat);
 const cl=countryClubs(country).filter(c=>LG[c.l].tier<=2);
 const list=cl.map(c=>{const p=youthProspect(c.id);return{...p,sc:p.ovr*.45+p.pot*.55}});
 list.push({n:S.name,pos:S.pos,age:S.age,pot:S.pot,ovr:S.ovr,club:S.club,me:true,sc:myProspectScore()});
 list.sort((a,b)=>b.sc-a.sc);
 return{list,rank:list.findIndex(x=>x.me)+1,total:list.length};
}
function prospectStars(pot){return pot>=90?5:pot>=85?4.5:pot>=81?4:pot>=77?3.5:pot>=73?3:pot>=68?2.5:2}
