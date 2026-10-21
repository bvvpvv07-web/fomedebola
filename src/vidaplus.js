// ================== VIDA COMPLETA (estilo BitLife): saúde, inteligência, aparência e tudo que dá pra fazer fora de campo ==================
// Felicidade = S.life.cab · Forma = S.life.corpo · Saúde, Inteligência e Aparência são novas.
// Saúde baixa aumenta lesão e derruba o rendimento; doenças aparecem e precisam de médico.
// Inteligência melhora contratos, processos e estudos. Aparência puxa fama, namoro e patrocínio.
function ensureBL(){if(!S)return;try{ensureLife2()}catch(e){try{ensureLife()}catch(_){}}const L=S.life;
 if(L.sau==null)L.sau=88;if(L.int==null)L.int=Math.round(R(38,62));if(L.apa==null)L.apa=Math.round(R(40,68));
 S.bl=S.bl||{};const B=S.bl;B.log=B.log||[];B.pets=B.pets||[];B.kids=B.kids||[];B.study=B.study||{p:0,deg:0};B.lic=B.lic||null;B.sick=B.sick||null;B.want=B.want||null;B.suits=B.suits||0;B.cars=B.cars||[];return B}
Object.assign(FX_NAME,{cab:'Felicidade',corpo:'Forma',forma:'Ritmo',sau:'Saúde',int:'Inteligência',apa:'Aparência'});
function blog(ic,t){const B=ensureBL();B.log.unshift({ic,t,y:S.year,a:S.age});if(B.log.length>60)B.log.length=60}
{const _af=applyFx;applyFx=function(fx){const chips=_af(fx);if(!fx||!S)return chips;ensureBL();
 for(const k of['sau','int','apa']){if(!fx[k])continue;const v=Math.round(fx[k]);S.life[k]=clamp(S.life[k]+v,0,100);chips.push([`${v>0?'+':'−'}${Math.abs(v)} ${FX_NAME[k]}`,v>0?'up':'down'])}
 return chips}}

// ---------- doenças ----------
const ILLS=[{n:'Gripe forte',sev:3,w:2},{n:'Virose',sev:2,w:1},{n:'Dengue',sev:6,w:3},{n:'Intoxicação alimentar',sev:4,w:1},{n:'Enxaqueca',sev:2,w:3},{n:'Amigdalite',sev:3,w:2},{n:'Pneumonia',sev:7,w:4},{n:'Gastrite',sev:3,w:3},{n:'Conjuntivite',sev:1,w:1},{n:'Labirintite',sev:4,w:2}];
function blInjK(){if(!S||!S.life||S.life.sau==null)return 1;const s=S.life.sau;return(1+Math.max(0,55-s)/70)*(S.bl&&S.bl.sick?1.15:1)}
{const _bp=bootPerf;bootPerf=function(){let v=_bp();try{const s=S.life.sau??80;if(s<45)v-=(45-s)/15;if(S.bl&&S.bl.sick)v-=Math.min(2,S.bl.sick.sev*.3)}catch(e){}return v}}
{const _wf=wageFor;wageFor=function(c,ovr){const w=_wf(c,ovr);try{const k=1+((S.life.int??50)-50)*.0008+((S.life.apa??50)-50)*.0004;return Math.round(w*k)}catch(e){return w}}}

// ---------- semana ----------
{const _lt=lifeTick;lifeTick=function(me){const r=_lt(me);try{const B=ensureBL(),L=S.life,st=S.st;const news=t=>{(st.lifeNews=st.lifeNews||[]).push(t)};
 // saúde: volta devagar pro normal da idade; lesão e doença derrubam
 const base=94-Math.max(0,S.age-29)*1.6;L.sau=clamp(L.sau+(base-L.sau)*.04,0,100);
 if(st&&st.injLeft>0)L.sau=clamp(L.sau-.8,0,100);
 if(B.sick){L.sau=clamp(L.sau-B.sick.sev*.8,0,100);L.cab=clamp(L.cab-.8,0,100);L.corpo=clamp(L.corpo-B.sick.sev*.3,0,100);B.sick.w--;if(B.sick.w<=0&&ch(.55)){news(`Você se curou: ${B.sick.n}.`);blog('💊',`Curou: ${B.sick.n}`);B.sick=null}}
 else if(ch(.018+Math.max(0,60-L.sau)/900+(L.corpo<40?.01:0))){const il=pick(ILLS);B.sick={...il};news(`Você está com ${il.n.toLowerCase()}. Vá ao médico.`);blog('🤒',il.n)}
 if(L.sau<14&&st&&!(st.injLeft>0)){st.injLeft=(st.injLeft||0)+2;L.sau=30;news('Você foi internado. Fora por 2 jogos.');blog('🏥','Internado')}
 // aparência e fama
 if(S.age>30)L.apa=clamp(L.apa-.04*(S.age-30)/4,0,100);
 L.fama=clamp(L.fama+((L.apa??50)-50)/700,0,100);
 // pets e filhos
 for(const p of B.pets){L.cab=clamp(L.cab+.2,0,100)}
 if(B.kids.length){L.cab=clamp(L.cab+.15*B.kids.length,0,100);S.din=Math.max(0,S.din-.0015*B.kids.length)}
 // carro sem carteira
 if(B.cars.length&&!B.lic&&ch(.05)){applyFx({heat:6});news('Você foi parado numa blitz sem carteira. Multa e polícia de olho.');S.din=Math.max(0,S.din-.003)}
 }catch(e){console.error(e)}return r}}
// emigrar: o empresário busca clubes no país escolhido
{const _go=genOffers;genOffers=function(lf){let out=_go(lf);try{const B=S.bl;if(!lf&&B&&B.want&&COUNTRY[B.want]){const c=club();if(c&&c.country===B.want){B.want=null;return out}
  const tgt=S.ovr+(S.life.fama-50)/15;let pool=CLUBS.filter(x=>x.country===B.want&&x.id!==S.club&&x.s>=tgt-11&&x.s<=tgt+3);
  if(!pool.length)pool=CLUBS.filter(x=>x.country===B.want&&x.id!==S.club).sort((a,b)=>Math.abs(a.s-tgt)-Math.abs(b.s-tgt)).slice(0,3);
  if(pool.length){const pk=pick(pool);const o={...mkOffer(pk),abroad:true};out=out.slice();if(out.length>=2)out[out.length-1]=o;else out.push(o)}}}catch(e){console.error(e)}return out}}

// ---------- atividades ----------
// {id, ic, n, d, t: dias, c: custo, req(): motivo pra bloquear, run(): {txt, chips}}
const act=(o)=>o;
const age18=()=>S.age<18?'A partir dos 18 anos':null;
function blFaceCustom(){if(S.face&&S.face.photo)return null;const L=faceLook(S.face);S.face={custom:{skin:L.skin,hairC:L.hair,style:L.style,beard:L.beard||'',acc:L.band&&L.ear?'ambos':L.band?'faixa':L.ear?'brinco':''}};return S.face.custom}

function medActs(){const B=ensureBL(),st=S.st;return[
 act({id:'clinico',ic:'🩺',n:B.sick?`Tratar ${B.sick.n.toLowerCase()}`:'Clínico geral',d:B.sick?'Receita, repouso e você volta 100%.':'Check-up de rotina. Previne doença.',t:1,c:.002,run:async()=>{if(B.sick){const n=B.sick.n;B.sick=null;blog('🩺',`Tratou: ${n}`);return{txt:`O médico passou o tratamento certo. ${n} curada.`,chips:applyFx({sau:10,cab:3})}}B.vac=S.year;return{txt:'Exames em dia. O médico disse que você é um touro.',chips:applyFx({sau:5})}}}),
 act({id:'fisio',ic:'🦵',n:'Fisioterapia',d:st&&st.injLeft>0?`Acelera a volta da lesão (${st.injLeft} jogos).`:'Prevenção de lesão e corpo solto.',t:1,c:.003,run:async()=>{if(st&&st.injLeft>1&&ch(.6)){st.injLeft--;return{txt:'O fisioterapeuta adiantou sua recuperação em 1 jogo.',chips:applyFx({corpo:3,sau:2})}}return{txt:'Sessão puxada. O corpo agradece.',chips:applyFx({corpo:4,sau:2})}}}),
 act({id:'psico',ic:'🧠',n:'Psicólogo',d:'Conversar sobre pressão, torcida e família.',t:1,c:.002,run:async()=>({txt:pick(['Saiu da sessão mais leve.','Chorou pela primeira vez em anos. Fez bem.','Aprendeu a respirar antes do pênalti.']),chips:applyFx({cab:7,disc:1})})}),
 act({id:'nutri',ic:'🥗',n:'Nutricionista',d:'Dieta de atleta pro mês.',t:0,c:.004,run:async()=>({txt:'Cardápio novo na geladeira. Nada de pastel na feira.',chips:applyFx({corpo:3,sau:3,apa:1})})}),
 act({id:'dentista',ic:'🦷',n:'Dentista',d:'Limpeza e clareamento.',t:1,c:.003,run:async()=>({txt:'Sorriso de comercial de pasta de dente.',chips:applyFx({apa:4,sau:1})})}),
 act({id:'plastica',ic:'💉',n:'Cirurgia plástica',d:'Muda o visual. Às vezes dá errado.',t:2,c:.05,req:age18,run:async()=>{if(ch(.78)){blog('💉','Cirurgia plástica');return{txt:'Ficou ótimo. Ninguém sabe dizer o que mudou, mas mudou.',chips:applyFx({apa:12,fama:2,cab:3})}}return{txt:'Ficou estranho. Virou meme na internet.',chips:applyFx({apa:-10,cab:-6,fama:2})}}}),
 act({id:'curandeiro',ic:'🪬',n:'Curandeiro',d:'Medicina alternativa. Fé é tudo.',t:1,c:.001,run:async()=>{const r=rnd();if(B.sick&&r<.3){const n=B.sick.n;B.sick=null;return{txt:`Chá de ervas e reza. Não é que ${n.toLowerCase()} passou?`,chips:applyFx({sau:4})}}if(r<.55)return{txt:'Saiu com uma pulseira de sementes e paz de espírito.',chips:applyFx({cab:3})};return{txt:'O chá te deu dor de barriga a noite toda.',chips:applyFx({sau:-4,cab:-2})}}}),
]}
function gymAct(){return act({id:'academia',ic:'🏋️',n:'Academia',d:'Série puxada. Minigame de força.',t:1,c:.001,mg:true,run:async()=>{const A=effAttrs();const r=await mgLift({skill:clamp((A.FIS-40)/55,.1,.95)});S.xp.FIS=(S.xp.FIS||0)+r.score*4;
 return{txt:r.ok?'Treino de monstro. O espelho aprovou.':'Pesou demais hoje.',chips:applyFx({corpo:r.score,apa:Math.round(r.score/2),sau:2})}}})}
function baladaAct(){return act({id:'balada',ic:'🪩',n:'Balada',d:'Sair com os amigos. Nunca se sabe como termina.',t:1,c:.004,req:age18,run:async()=>{const r=rnd();
 if(r<.38)return{txt:'Noite perfeita. Dançou até o sol nascer.',chips:applyFx({cab:5,disc:-2})};
 if(r<.56&&!S.gf){const n=pick(GF_NAMES);if(ch(.45+((S.life.apa??50)-50)/150+S.life.fama/300)){S.gf={n,v:55};S.rel='namorando';blog('❤️',`Começou a namorar ${n}`);return{txt:`Você conheceu ${n} na pista. Agora estão namorando.`,chips:applyFx({cab:6,disc:-2})}}return{txt:`Chamou ${n} pra dançar e levou um fora.`,chips:applyFx({cab:-3})}}
 if(r<.68)return{txt:'Uma foto sua com um copo na mão viralizou.',chips:applyFx({fama:2,board:-4,disc:-2})};
 if(r<.78){const e=await mgEscape({comp:'Balada',title:'Começou uma briga!',sub:'Saia pelo lado certo antes da polícia chegar.',window:1500});if(e.ok)return{txt:'Saiu de fininho antes do tumulto.',chips:applyFx({cab:-1})};blog('🚔','Briga na balada');return{txt:'Te filmaram no meio da confusão.',chips:applyFx({heat:12,fama:3,board:-6,cab:-4})}}
 if(r<.9)return{txt:'Ressaca braba no dia seguinte.',chips:applyFx({corpo:-3,forma:-2,sau:-2})};
 return{txt:'Encontrou um ídolo seu no camarote e trocaram telefone.',chips:applyFx({fama:3,cab:4})}}})}
function feriasActs(){const kids=ensureBL().kids.length;return[
 act({id:'praia',ic:'🏖️',n:'Praia no Nordeste',d:'Água de coco e pé na areia.',t:2,c:.01,run:async()=>({txt:'Voltou bronzeado e renovado.',chips:applyFx({cab:8,sau:3,apa:1})})}),
 act({id:'europa',ic:'🗼',n:'Eurotrip',d:'Paris, Roma, Barcelona. Cultura e fotos.',t:2,c:.06,run:async()=>({txt:'Conheceu museus que nem sabia que existiam.',chips:applyFx({cab:9,int:3,fama:1})})}),
 act({id:'dubai',ic:'🏙️',n:'Luxo em Dubai',d:'Hotel sete estrelas e ostentação.',t:2,c:.25,run:async()=>({txt:'Fotos no deserto, carro dourado, iate. A internet amou e odiou.',chips:applyFx({cab:12,fama:4,apa:1,disc:-2})})}),
 act({id:'retiro',ic:'🏔️',n:'Retiro espiritual',d:'Sem celular por 2 dias.',t:2,c:.005,run:async()=>({txt:'Silêncio, montanha e muita reflexão.',chips:applyFx({cab:7,disc:4,sau:4})})}),
 ...(kids?[act({id:'orlando',ic:'🎢',n:'Parque com os filhos',d:'Montanha-russa e fila de 2 horas.',t:2,c:.08,run:async()=>({txt:'Os filhos vão lembrar pra sempre. Você vai lembrar da fila.',chips:applyFx({cab:12,sau:-1})})})]:[]),
]}
function estudoActs(){const B=ensureBL();return[
 act({id:'faculdade',ic:'🎓',n:B.study.deg?`Pós-graduação (${B.study.p}/12)`:`Faculdade EAD de Gestão Esportiva (${B.study.p}/12)`,d:'Uma aula por vez. Com 12, você se forma.',t:1,c:.002,run:async()=>{B.study.p++;let txt='Assistiu às aulas e fez os trabalhos.';const fx={int:2};if(B.study.p>=12){B.study.p=0;B.study.deg++;fx.int=8;fx.fama=2;txt=B.study.deg>1?'Concluiu a pós-graduação!':'Formado! Diploma de Gestão Esportiva na parede.';blog('🎓',B.study.deg>1?'Pós-graduação':'Formou na faculdade')}return{txt,chips:applyFx(fx)}}}),
 act({id:'quiz',ic:'❓',n:'Quiz de futebol',d:'3 perguntas sobre regras e história.',t:1,c:0,mg:true,run:async()=>{const r=await mgQuiz({n:3});S.xp.MEN=(S.xp.MEN||0)+r.score*5;return{txt:r.score===3?'Gabaritou!':`${r.score} de 3 certas.`,chips:applyFx({int:r.score+(r.perfect?1:0)})}}}),
 act({id:'xadrez',ic:'♟️',n:'Clube de xadrez',d:'Minigame de memória: pensar três lances à frente.',t:1,c:0,mg:true,run:async()=>{const r=await mgMemory({tag:'Estudos',sub:'Xadrez',title:'Partida de xadrez',rounds:3,start:3});S.xp.MEN=(S.xp.MEN||0)+r.score*4;return{txt:r.ok?'Xeque-mate!':'Perdeu a partida, mas aprendeu.',chips:applyFx({int:1+r.score})}}}),
 act({id:'livro2',ic:'📚',n:'Ler um livro',d:'Biografia de um craque.',t:1,c:0,run:async()=>{S.xp.MEN=(S.xp.MEN||0)+12;return{txt:pick(['Leu de uma vez só.','Sublinhou metade das páginas.','Dormiu no capítulo 3, mas terminou.']),chips:applyFx({int:2,cab:2})}}}),
 act({id:'idioma2',ic:'🗣️',n:'Curso de idioma',d:'3 aulas e você aprende o básico.',t:1,c:.003,run:async()=>{const r=await doLifeAct('idioma');r.chips.push(...applyFx({int:1}));return r}}),
]}
function crimeActs(){const B=ensureBL();const base=(lifeActs().filter(a=>a.g==='Lado errado')).map(a=>act({id:a.id,ic:a.ic,n:a.n,d:a.d,t:a.t,c:a.c,mg:a.mg,warn:true,run:()=>doLifeAct(a.id)}));
 if(S.age<16)return[];return[
 act({id:'carteira_furto',ic:'👛',n:'Batedor de carteira',d:'Minigame: pegue só quando a vítima se distrair.',t:1,c:0,mg:true,warn:true,run:async()=>{const r=await mgPickpocket();if(r.caught){if(ch(.55)){const e=await mgEscape({comp:'Fuga',title:'Pega ladrão!',sub:'Escolha o lado certo pra escapar.',window:1400});if(e.ok)return{txt:'Correu mais que o segurança.',chips:applyFx({heat:14})}}blog('🚔','Preso por furto');return{txt:'O segurança te segurou até a polícia chegar.',chips:applyFx({preso:RI(2,5)})}}const v=r.score*R(.0004,.0025);return{txt:r.score?`Levou ${money(v)} em carteiras.`:'Não pegou nada.',chips:applyFx({din:v,heat:r.score*4,disc:-2})}}}),
 act({id:'assalto',ic:'🏚️',n:'Furto em casa de veraneio',d:'Minigame: entre de cômodo em cômodo e saia antes do alarme.',t:1,c:0,mg:true,warn:true,run:async()=>{const r=await mgBurglary();if(r.caught){blog('🚔','Preso por assalto');return{txt:'A polícia te cercou no quintal.',chips:applyFx({preso:RI(5,10),din:-.01})}}if(r.alarm)return{txt:`O alarme tocou, mas você fugiu com ${money(r.loot)}.`,chips:applyFx({din:r.loot,heat:22,disc:-4})};return{txt:r.loot?`Saiu com ${money(r.loot)} sem ninguém ver.`:'Desistiu na porta.',chips:applyFx({din:r.loot,heat:r.loot?12:2,disc:-3})}}}),
 act({id:'briga',ic:'👊',n:'Briga com torcida rival',d:'Encontro marcado no posto de gasolina.',t:1,c:0,warn:true,run:async()=>{const e=await mgEscape({comp:'Briga',title:'A polícia chegou!',sub:'Escolha o lado certo pra escapar.',window:1300});if(e.ok)return{txt:'Voltou com o olho roxo, mas ninguém te reconheceu.',chips:applyFx({sau:-5,apa:-2,heat:10})};blog('🚔','Briga de torcida');return{txt:'Seu rosto saiu no jornal da noite.',chips:applyFx({preso:RI(2,4),fama:4,board:-10})}}}),
 ...base,
 ...(S.club&&S.age>=18?[act({id:'manipula',ic:'🎲',n:'Manipular resultado',d:'Tomar um cartão de propósito por dinheiro de aposta. Se descobrirem, acabou.',t:0,c:0,warn:true,run:async()=>{if(ch(.22+(S.heat||0)/250)){blog('⚖️','Pego na manipulação');if(S.st)S.st.suspLeft=(S.st.suspLeft||0)+30;return{txt:'O esquema caiu na investigação. Você foi suspenso por 30 jogos.',chips:applyFx({fama:-15,board:-40,heat:30,ficha:1,cab:-15})}}const v=R(.08,.6)*(S.wage/40+.5);return{txt:`Tomou o amarelo combinado. ${money(v)} entraram numa conta no exterior.`,chips:applyFx({din:v,heat:15,disc:-6})}}})]:[]),
]}
function processoActs(){const B=ensureBL(),L=S.life;const odds=b=>clamp(b+(L.int-50)/220+L.fama/600,.08,.85);return[
 act({id:'proc_jorn',ic:'📰',n:'Processar um jornalista',d:'Ele te chamou de "mercenário" na TV.',t:1,c:.015,req:age18,run:async()=>{B.suits++;if(ch(odds(.42))){const v=R(.01,.06);blog('⚖️','Ganhou processo contra jornalista');return{txt:`O juiz deu ganho de causa. Indenização de ${money(v)}.`,chips:applyFx({din:v,fama:1,cab:3})}}return{txt:'Perdeu. O jornalista fez outra matéria sobre o processo.',chips:applyFx({fama:-1,cab:-3})}}}),
 act({id:'proc_clube',ic:'🏟️',n:'Processar o clube',d:'Direito de imagem atrasado. Ganhar custa caro na relação.',t:1,c:.03,req:()=>!S.club?'Você está sem clube':age18(),run:async()=>{B.suits++;if(ch(odds(.4))){const v=S.wage*R(4,10)/1000;return{txt:`Ganhou na Justiça do Trabalho: ${money(v)}. A diretoria não esquece.`,chips:applyFx({din:v,board:-25,cab:2})}}return{txt:'Perdeu a ação. O presidente comentou: "ingrato".',chips:applyFx({board:-15,cab:-4})}}}),
 act({id:'proc_emp',ic:'💼',n:'Processar o empresário',d:'Cobrança de comissões abusivas.',t:1,c:.02,req:age18,run:async()=>{B.suits++;if(ch(odds(.45))){const v=R(.02,.12);return{txt:`Acordo fechado: ele devolveu ${money(v)}.`,chips:applyFx({din:v,cab:3})}}return{txt:'O contrato era claro. Você pagou as custas.',chips:applyFx({din:-.01,cab:-3})}}}),
 act({id:'proc_viz',ic:'🏘️',n:'Processar o vizinho',d:'Festa toda noite antes de jogo.',t:1,c:.003,req:age18,run:async()=>{B.suits++;if(ch(odds(.55)))return{txt:'O juiz mandou baixar o som depois das 22h.',chips:applyFx({cab:4,sau:1})};return{txt:'Perdeu. Agora o vizinho toca pagode mais alto.',chips:applyFx({cab:-3})}}}),
]}
function licAct(){const B=ensureBL();if(B.lic)return act({id:'racha',ic:'🏎️',n:'Racha de madrugada',d:'Você tem carteira. Mas não deveria fazer isso.',t:1,c:0,warn:true,req:()=>B.cars.length?null:'Compre um carro na Loja',run:async()=>{if(ch(.3)){B.lic=null;blog('🚓','Perdeu a carteira');return{txt:'Blitz no fim da avenida. Carteira apreendida e manchete no jornal.',chips:applyFx({heat:15,fama:3,board:-8})}}return{txt:'Ganhou o racha. A adrenalina não sai do corpo.',chips:applyFx({cab:5,disc:-3})}}});
 return act({id:'habilitacao',ic:'🪪',n:'Tirar carteira de motorista',d:'Prova prática no minigame. Sem ela, carro só dá problema.',t:1,c:.002,mg:true,req:age18,run:async()=>{const r=await mgDriving();if(r.ok){B.lic={y:S.year};blog('🪪','Tirou carteira');return{txt:'Habilitado! Agora dá pra comprar carro na Loja.',chips:applyFx({cab:4})}}return{txt:'Reprovado. O examinador nem olhou na sua cara.',chips:applyFx({cab:-3})}}})}
function adocaoAct(){const B=ensureBL();return act({id:'adotar',ic:'🧸',n:'Adotar uma criança',d:'Uma família maior. Custa por semana.',t:1,c:.03,req:()=>S.age<24?'A partir dos 24 anos':B.kids.length>=5?'Já são 5 filhos':null,run:async()=>{const n=pick(['Lucas','Pedro','Ana','Maria','Gabriel','Helena','Miguel','Alice','Theo','Laura']);B.kids.push({n,y:S.year});S.filhos=(S.filhos||0)+1;blog('🧸',`Adotou ${n}`);return{txt:`${n} chegou em casa. A vida nunca mais vai ser a mesma.`,chips:applyFx({cab:10,fama:2,disc:2})}}})}
const PETS=[['🐶','Cachorro',.002],['🐱','Gato',.001],['🦜','Papagaio',.003],['🐴','Cavalo',.04]];
function petActs(){const B=ensureBL();return[...PETS.map(([ic,n,c])=>act({id:'pet_'+n,ic,n:`Adotar um ${n.toLowerCase()}`,d:'Companhia em casa. Felicidade toda semana.',t:0,c,req:()=>B.pets.length>=4?'Já tem 4 bichos':null,run:async()=>{const nome=pick(['Pelé','Gol','Bola','Craque','Tóbi','Mel','Zico','Pipoca','Paçoca','Romário']);B.pets.push({ic,n,nome});blog(ic,`Adotou ${nome}`);return{txt:`${nome} é o novo morador da casa.`,chips:applyFx({cab:5})}}})),
 ...(B.pets.length?[act({id:'passear',ic:'🦮',n:'Passear com os bichos',d:B.pets.map(p=>p.ic+' '+p.nome).join(' · '),t:1,c:0,run:async()=>({txt:'Tarde no parque com a turma.',chips:applyFx({cab:4,corpo:1,sau:1})})})]:[])]}
function kidActs(){const B=ensureBL();const a=[];if(B.kids.length)a.push(act({id:'brincar',ic:'🧒',n:'Brincar com os filhos',d:B.kids.map(k=>k.n).join(', '),t:1,c:0,run:async()=>({txt:pick(['Jogaram bola no quintal. Seu filho já chuta melhor que você.','Montaram um castelo de Lego gigante.','Assistiram desenho a tarde inteira.']),chips:applyFx({cab:7})})}));
 if(S.gf&&S.age>=20&&B.kids.length<5)a.push(act({id:'bebe',ic:'👶',n:'Tentar ter um filho',d:`Com ${S.gf.n}.`,t:1,c:0,run:async()=>{if(ch(.3)){const n=pick(['Davi','Enzo','Valentina','Sofia','Bernardo','Cecília','Arthur','Manuela']);B.kids.push({n,y:S.year});S.filhos=(S.filhos||0)+1;blog('👶',`Nasceu ${n}`);return{txt:`Vai ser pai! ${n} nasceu cheio de saúde.`,chips:applyFx({cab:12,fama:2})}}return{txt:'Não foi dessa vez.',chips:applyFx({cab:1})}}}));
 return a}
function lotActs(){return[
 act({id:'loteria',ic:'🎟️',n:'Loteria',d:'Escolha 6 números. Bilhete de €2 mil.',t:0,c:.002,mg:true,req:age18,run:async()=>{const r=await mgLottery();if(r.prize){S.din+=r.prize;if(r.score>=5)blog('🎟️',`Ganhou ${money(r.prize)} na loteria`)}return{txt:r.prize?`Prêmio de ${money(r.prize)}!`:'Nenhum prêmio.',chips:r.prize?[[`+${money(r.prize)}`,'up']]:[]}}}),
 act({id:'raspa',ic:'🎫',n:'Raspadinha',d:'€1 mil. Três iguais ganham.',t:0,c:.001,mg:true,req:age18,run:async()=>{const r=await mgScratch();if(r.prize)S.din+=r.prize;return{txt:r.prize?`Ganhou ${money(r.prize)}.`:'Nada.',chips:r.prize?[[`+${money(r.prize)}`,'up']]:[]}}}),
]}
const EMIG=['ENG','ESP','ITA','GER','FRA','POR','NED','BRA','ARG','USA','KSA','MEX','TUR','JPN'];
function emigList(){return EMIG.filter(k=>COUNTRY[k]&&CLUBS.some(c=>c.country===k))}
// ficha do jogador com as barras novas
{const _lp=lifePanel;lifePanel=function(){let h=_lp();try{const B=ensureBL(),L=S.life;const bar=(v,lbl,col)=>`<div class="bar"><small><span>${lbl}</span><span class="mono">${Math.round(v)}</span></small><i><s style="width:${clamp(v,0,100)}%;background:${col}"></s></i></div>`;
 h=h.replace('<span>Cabeça</span>','<span>Felicidade</span>').replace('<span>Corpo</span>','<span>Forma</span>');
 h=h.replace(/(<div class="life"[^>]*>)/,'$1'+bar(L.sau,'Saúde','#ff5a7a')+bar(L.int,'Inteligência','#8fd3ff')+bar(L.apa,'Aparência','#ffb3d1'));
 const extra=[B.sick?`<span class="chip down">🤒 ${esc(B.sick.n)}</span>`:'',B.lic?'<span class="chip">🪪 Habilitado</span>':'',B.kids.length?`<span class="chip">🧸 ${B.kids.map(k=>esc(k.n)).join(', ')}</span>`:'',B.pets.length?`<span class="chip">${B.pets.map(p=>p.ic+' '+esc(p.nome)).join(' ')}</span>`:'',B.study.deg?`<span class="chip">🎓 ${B.study.deg} diploma${B.study.deg>1?'s':''}</span>`:'',S.spons&&typeof BT_BRANDS!=='undefined'?`<span class="chip gold">🤝 ${esc(BT_BRANDS[S.spons.brand].n)}</span>`:''].join('');
 h=h.replace('<div class="lifemeta">','<div class="lifemeta">'+extra)}catch(e){console.error(e)}return h}}
