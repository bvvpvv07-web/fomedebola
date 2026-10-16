// ================== VIDA, DINHEIRO, RELAÇÕES, CASSINO (estilo New Star) ==================
function ensureLife(){
 if(!S)return;
 S.coach??=50;S.pais??=75;S.tempo??=2;S.xp??={};S.owned??=[];S.props??=[];S.perks??={};
 S.bootsOwned??=[];S.boot??=null;S.bootLeft??=0;S.gf??=(S.rel&&S.rel!=='solteiro'?{n:pick(GF_NAMES),v:65}:null);
 S.lances??='todos';S.casino??={net:0,visits:0};
}
const GF_NAMES=['Ana Clara','Bruna','Camila','Duda','Fernanda','Giovanna','Isabela','Júlia','Larissa','Letícia','Manu','Mariana','Natália','Rafaela','Sofia','Valentina','Bianca','Carol','Lívia','Yasmin'];
const TEMPO_MAX=5;

// ---------- chuteiras ----------
const BOOTS=[
 {id:'b1',n:'Chuteira de society',p:.004,g:30,b:{VEL:1},d:'Melhor que a do campinho.'},
 {id:'b2',n:'Speed Pro',p:.06,g:45,b:{VEL:2,DRI:1},d:'Leve, feita pra arrancada.'},
 {id:'b3',n:'Control Touch',p:.06,g:45,b:{PAS:2,DRI:1},d:'Toque de bola na ponta da chuteira.'},
 {id:'b4',n:'Striker X',p:.18,g:55,b:{FIN:3},d:'Cabedal pensado pro chute.'},
 {id:'b5',n:'Grip Defender',p:.12,g:55,b:{DEF:2,FIS:2},d:'Trava firme, dividida segura.'},
 {id:'b6',n:'Luva Reflex Elite',p:.12,g:55,b:{REF:3},d:'Luva de goleiro com grip extra.',gk:true},
 {id:'b7',n:'Elite Carbon',p:.6,g:70,b:{FIN:2,VEL:2,DRI:2,PAS:1},d:'Placa de carbono. Topo de linha.'},
 {id:'b8',n:'Dourada Lendária',p:1.8,g:90,b:{FIN:3,VEL:3,DRI:3,PAS:2,FIS:1},d:'Edição limitada, numerada.'},
];
function bootBonus(){if(!S.boot||S.bootLeft<=0)return{};const b=BOOTS.find(x=>x.id===S.boot);return b?b.b:{}}
function effAttrs(){const A={...CA()};const b=bootBonus();for(const k in b)A[k]=clamp((A[k]||0)+b[k],1,99);return A}
function bootPerf(){return fit(effAttrs(),S.pos)-fit(CA(),S.pos)}

// ---------- produtos e serviços ----------
const SHOP=[
 {id:'game',n:'Videogame de última geração',p:.003,fx:{cab:3},d:'Pra desligar a cabeça depois do treino.'},
 {id:'grife',n:'Roupas de grife',p:.015,fx:{fama:2,cab:2},d:'Chegar no estádio no estilo.'},
 {id:'relogio',n:'Relógio de luxo',p:.08,fx:{fama:4,cab:3,disc:-1},d:'Ouro e diamante no pulso.',once:true},
 {id:'carro',n:'Carro esportivo',p:.35,fx:{fama:6,cab:5,disc:-3},d:'V8 na garagem.',once:true},
 {id:'iate',n:'Iate',p:4,fx:{fama:10,cab:8,disc:-4},d:'Férias em alto mar.',once:true},
 {id:'prep',n:'Preparador físico particular',p:.2,fx:{corpo:10},perk:'prep',d:'Menos lesões nesta temporada.'},
 {id:'nutri',n:'Nutricionista',p:.06,fx:{corpo:6,forma:1},perk:'nutri',d:'Corpo em dia nesta temporada.'},
 {id:'psico',n:'Psicólogo do esporte',p:.05,fx:{cab:8},perk:'psico',d:'Cabeça mais firme nesta temporada.'},
];
// ---------- imóveis ----------
const PROPS=[
 {id:'ap',n:'Apartamento perto do CT',p:.25,fx:{cab:4},r:0,d:'Chega descansado no treino.'},
 {id:'casa',n:'Casa com piscina',p:1.2,fx:{cab:8},r:0,d:'Libera o churrasco com o elenco.'},
 {id:'mansao',n:'Mansão',p:5,fx:{cab:12,fama:5},r:0,d:'Capa de revista.'},
 {id:'paisCasa',n:'Casa para os seus pais',p:.4,fx:{cab:6,fama:2},r:0,d:'Seus pais ficam pra sempre do seu lado.',pais:true},
 {id:'aluguel',n:'Apartamentos para alugar',p:.8,fx:{},r:.0012,d:'Renda de aluguel toda semana.'},
 {id:'fazenda',n:'Fazenda',p:2,fx:{cab:6},r:.002,d:'Gado, sossego e um pouco de renda.'},
 {id:'predio',n:'Prédio comercial',p:3,fx:{},r:.0046,d:'Renda alta e constante.'},
];
const propValue=()=>(S.props||[]).reduce((s,id)=>{const p=PROPS.find(x=>x.id===id);return s+(p?p.p*.9:0)},0);
const rentWeek=()=>(S.props||[]).reduce((s,id)=>{const p=PROPS.find(x=>x.id===id);return s+(p?p.r:0)},0);

// ---------- efeitos semanais ----------
function payWeek(nRounds){
 const st=S.st;const full=S.wage*52/1000*.5;const w=full/Math.max(1,nRounds);
 st.paid=(st.paid||0)+w;S.din+=w+rentWeek()*52/Math.max(1,nRounds);
}
function lifeTick(me){
 ensureLife();
 newWeek();
 if(me&&me.play&&me.nota!=null){if(me.nota>=7.5)S.coach=clamp(S.coach+2,0,100);else if(me.nota<=5.6)S.coach=clamp(S.coach-2,0,100)}
 S.coach+= (50-S.coach)*.01;
 if(!S.props.includes('paisCasa'))S.pais=clamp(S.pais-.25,0,100);
 if(S.pais<30)S.life.cab=clamp(S.life.cab-.2,0,100);else if(S.pais>75)S.life.cab=clamp(S.life.cab+.15,0,100);
 if(S.gf){S.gf.v=clamp(S.gf.v-(S.rel==='casado'?.5:1),0,100);
  if(S.gf.v>=70)S.life.cab=clamp(S.life.cab+.25,0,100);
  if(S.gf.v<12&&ch(.15)){const c=S.rel==='casado';const lost=c?S.din*.3:0;S.din-=lost;S.life.cab=clamp(S.life.cab-12,0,100);
   (S.st.lifeNews=S.st.lifeNews||[]).push(c?`Divórcio: ${S.gf.n} pediu a separação. A partilha levou ${money(lost)}.`:`${S.gf.n} terminou com você. Disse que você só pensa em futebol.`);
   S.gf=null;S.rel='solteiro'}}
 if(S.boot&&me&&me.play){S.bootLeft--;if(S.bootLeft<=0){(S.st.lifeNews=S.st.lifeNews||[]).push('Sua chuteira gastou. Hora de comprar outra.');S.boot=null}}
}
function lifeSeasonEnd(){ensureLife();S.perks={};const st=S.st;const full=S.wage*52/1000*.5;S.din+=Math.max(0,full-(st.paid||0))}

// ---------- lances em todos os jogos ----------
function lancesWanted(live){const m=S.lances||'todos';if(m==='off')return false;if(m==='decisivos')return!!live;return true}
function assistType(){const p=S.pos;const r=rnd();if(['LE','LD','ME','MD','PE','PD'].includes(p))return r<.6?'cross':'pass';if(['ZAG','VOL','GOL'].includes(p))return r<.6?'long':'pass';if(['MC','MEI'].includes(p))return r<.65?'pass':'long';return'pass'}

// ---------- mini games novos ----------
MG_NAMES.pass='Passe';MG_NAMES.long='Lançamento';MG_NAMES.cross='Cruzamento';
function mgPass(o){
 return new Promise(res=>{
  const nd=o.defs||2,sp=o.speed||1;const lanes=[18,50,82];
  mgFrame(o,`<div class="mgpass" id="mgP"><div class="mgp-line"></div>${lanes.map((x,i)=>`<button class="mgmate" data-i="${i}" style="left:${x}%">${['◀','▲','▶'][i]}<small>${['Esquerda','Centro','Direita'][i]}</small></button>`).join('')}${Array.from({length:nd},(_,i)=>`<i class="mgdef" id="mgD${i}"></i>`).join('')}<span class="mgme">⚽</span></div>
  <div class="mgtimer"><i id="mgT"></i></div><div class="muted" style="font-size:12.5px;margin-top:6px">Toque no companheiro que estiver livre (sem marcador na frente).</div>`);
  const ds=[...Array(nd)].map((_,i)=>document.getElementById('mgD'+i));const ph=[...Array(nd)].map(()=>R(0,6.28));const sps=[...Array(nd)].map((_,i)=>(.0016+i*.0007)*sp);
  const mates=[...$ov.querySelectorAll('.mgmate')];let done=false,xs=[];const t0=performance.now();
  const tick=t=>{if(done)return;xs=ds.map((d,i)=>50+40*Math.sin(ph[i]+(t-t0)*sps[i]));ds.forEach((d,i)=>d.style.left=xs[i]+'%');
   mates.forEach((m,i)=>m.classList.toggle('covered',xs.some(x=>Math.abs(x-lanes[i])<11)));requestAnimationFrame(tick)};
  requestAnimationFrame(tick);
  const win=o.window||2600;const T=document.getElementById('mgT');T.style.transition=`width ${win}ms linear`;requestAnimationFrame(()=>requestAnimationFrame(()=>T.style.width='0%'));
  const finish=async(i)=>{if(done)return;done=true;mates.forEach(m=>m.disabled=true);
   const ok=i!=null&&!xs.some(x=>Math.abs(x-lanes[i])<11);const perfect=ok&&xs.every(x=>Math.abs(x-lanes[i])>22);
   await mgEnd(ok,i==null?'Demorou e perdeu a bola':ok?(o.okTxt||'Passe perfeito!'):'Interceptado!',perfect);res({ok,perfect})};
  mates.forEach(m=>m.onclick=()=>finish(+m.dataset.i));setTimeout(()=>finish(null),win);
 });
}
async function mgLong(o){
 const cross=o.type==='cross';
 const a=await mgTiming({...o,title:cross?'Cruzamento: a direção':'Lançamento: a direção',sub:cross?'Mire no companheiro que entra na área.':'Mire na corrida do atacante.',zone:o.zone,period:1000,btn:'Mirar!',okTxt:'Boa direção',failTxt:'Direção errada'});
 if(!a.ok)return{ok:false};
 const b=await mgTiming({...o,title:cross?'Cruzamento: a força':'Lançamento: a força',sub:'Nem curto, nem longo demais.',zone:o.zone*.9,period:1200,oneWay:true,btn:cross?'Cruzar!':'Lançar!',okTxt:o.okTxt||'Na medida!',failTxt:'Saiu pela linha de fundo'});
 return{ok:b.ok,perfect:a.perfect&&b.perfect};
}
const _runChance0=runChance;
runChance=async function(c){
 const A=effAttrs();const pl=c.planned;
 if(c.type==='pass')return(await mgPass({...c,title:pl?'Linha de passe aberta!':'Contra-ataque!',sub:'Seus companheiros se movem, a marcação também.',defs:pl?2:3,speed:(pl?1:1.3)*clamp(1-(A.PAS-70)/120,.6,1.4),window:(pl?2800:2100)+(A.PAS-70)*12,okTxt:'Passe pra gol!'})).ok;
 if(c.type==='long'||c.type==='cross')return(await mgLong({...c,zone:(pl?.26:.16)+(A.PAS-70)/240,okTxt:c.type==='cross'?'Cruzou na cabeça!':'Lançou na medida!'})).ok;
 return await _runChance0({...c,_A:A});
};
IO_UI.chance=async c=>runChance(c);

// ---------- treino semanal ----------
const DRILLS=[
 {k:'finish',n:'Finalização',a:'FIN',ic:'🎯'},{k:'dribble',n:'Drible',a:'DRI',ic:'🌀'},{k:'pass',n:'Passe',a:'PAS',ic:'🎯'},
 {k:'long',n:'Lançamento',a:'PAS',ic:'📐'},{k:'fk',n:'Cobrança de falta',a:'FIN',ic:'🧱'},{k:'header',n:'Cabeceio',a:'FIS',ic:'⬆️'},
 {k:'sprint',n:'Tiro de velocidade',a:'VEL',ic:'⚡'},{k:'reflex',n:'Reflexos',a:'REF',ic:'🧤',gk:true},{k:'tactic',n:'Leitura tática',a:'MEN',ic:'🧠'},
];
async function weeklyTraining(k){
 const A=effAttrs();const d=DRILLS.find(x=>x.k===k);let hits=0,perf=0,of=3;
 const tt=(title,sub,zone,period,oneWay,btn)=>mgTiming({type:k==='header'?'header':'finish',comp:'Treino',title,sub,zone,period,oneWay,btn});
 if(k==='finish'||k==='header'||k==='sprint'||k==='tactic'){for(let i=0;i<3;i++){const z=k==='finish'?.2+(A.FIN-70)/220:k==='header'?.18+(A.FIS-70)/260:k==='sprint'?.17+(A.VEL-70)/240:.18+(A.MEN-70)/240;
   const t=await tt(`${d.n} ${i+1} de 3`,k==='sprint'?'Largue no apito, nem antes nem depois.':k==='tactic'?'Pare o vídeo no momento exato da jogada.':'O auxiliar alimenta, você executa.',z,1000-i*110,k==='header'||k==='sprint',k==='sprint'?'Largar!':k==='tactic'?'Parar!':k==='header'?'Cabecear!':'Chutar!');hits+=t.ok;perf+=t.perfect?1:0}}
 else if(k==='dribble'){const t=await mgDribble({type:'dribble',comp:'Treino',title:'Circuito de drible',sub:'Leia o marcador.',need:2,window:1200+(A.DRI-70)*12});hits=t.ok?(t.perfect?3:2):1;perf=t.perfect?1:0}
 else if(k==='pass'){for(let i=0;i<3;i++){const t=await mgPass({type:'pass',comp:'Treino',title:`Rondo ${i+1} de 3`,sub:'Ache o companheiro livre.',defs:2,speed:1+i*.15,window:2400-i*200+(A.PAS-70)*10});hits+=t.ok;perf+=t.perfect?1:0}}
 else if(k==='long'){for(let i=0;i<2;i++){const t=await mgLong({type:'long',comp:'Treino',zone:.2+(A.PAS-70)/240});hits+=t.ok?1.5:0;perf+=t.perfect?1:0}}
 else if(k==='fk'){for(let i=0;i<2;i++){const t=await mgFreeKick({type:'fk',comp:'Treino',title:`Falta ${i+1} de 2`,sub:'Barreira de bonecos.',zone:.2+(A.FIN+A.PAS-140)/400});hits+=t.ok?1.5:0;perf+=t.perfect?1:0}}
 else if(k==='reflex'){for(let i=0;i<3;i++){const t=await mgReflex({type:'reflex',comp:'Treino',title:`Reflexo ${i+1} de 3`,sub:'Máquina de chutes.',window:820-i*90+(A.REF-70)*6});hits+=t.ok}}
 hits=Math.round(hits);
 const chips=[];const st=S.st;
 if(st){const f=hits>=3?2:hits>=2?1:0;st.forma+=f;if(f)chips.push([`+${f} Forma`,'up'])}
 const gain=hits*4+perf*3+(S.perks.psico?2:0);S.xp[d.a]=(S.xp[d.a]||0)+gain;chips.push([`+${gain} XP ${ATTR_NAME[d.a]}`,'gold']);
 if(S.xp[d.a]>=100){S.xp[d.a]-=100;S.attrs[d.a]=clamp(S.attrs[d.a]+1,1,99);chips.push([`+1 ${ATTR_NAME[d.a]}`,'up']);
  const w=(POS[S.pos].w[d.a]||0);if(S.ovr<S.pot+2&&ch(clamp(w*1.6,.05,.75))){S.ovr=clamp(S.ovr+1,30,99);if(S.ovr>S.peak){S.peak=S.ovr;S.peakAge=S.age}chips.push(['+1 OVR','up'])}}
 S.coach=clamp(S.coach+(hits>=2?2:0),0,100);
 return{hits,chips};
}

// ---------- ações de relacionamento ----------
function relActions(){
 const a=[];const hasCasa=S.props.includes('casa')||S.props.includes('mansao');
 if(!S.gf){a.push({who:'gf',id:'balada',n:'Sair pra conhecer alguém',t:1,c:.003,d:'Balada, festa de amigo, aplicativo.'})}
 else{a.push({who:'gf',id:'jantar',n:'Jantar romântico',t:1,c:.004,d:`Levar ${S.gf.n} num restaurante bom.`});
  a.push({who:'gf',id:'viagem',n:'Viagem a dois',t:2,c:.05,d:'Fim de semana longe de tudo.'});
  a.push({who:'gf',id:'presente',n:'Dar um presente caro',t:0,c:.025,d:'Joia, bolsa, flores.'});
  if(S.rel==='namorando'&&S.gf.v>=80)a.push({who:'gf',id:'pedido',n:'Pedir em casamento',t:1,c:.04,d:'Aliança e coragem.'})}
 a.push({who:'tec',id:'extra',n:'Ficar depois do treino',t:1,c:0,d:'Mostrar serviço pro técnico.'});
 a.push({who:'tec',id:'conversa',n:'Pedir mais minutos',t:1,c:0,d:'Conversa franca na sala dele.'});
 if(hasCasa)a.push({who:'tec',id:'churras',n:'Churrasco pro elenco',t:1,c:.01,d:'Na sua casa com piscina.'});
 a.push({who:'pais',id:'visita',n:'Visitar seus pais',t:1,c:.001,d:'Almoço de domingo em casa.'});
 a.push({who:'pais',id:'mesada',n:'Mandar dinheiro pra família',t:0,c:.02,d:'Ajudar nas contas de casa.'});
 a.push({who:'dir',id:'reuniao',n:'Reunião com o presidente',t:1,c:0,d:'Falar do seu futuro no clube.'});
 a.push({who:'dir',id:'social',n:'Ação social do clube',t:1,c:0,d:'Visitar hospital infantil com o clube.'});
 return a;
}
function doRel(id){
 const st=S.st;let txt='',fx={};
 if(id==='balada'){if(ch(.5+S.life.fama/250)){S.gf={n:pick(GF_NAMES),v:55};S.rel='namorando';txt=`Você conheceu ${S.gf.n}. Começaram a namorar.`;fx={cab:4,disc:-2}}else{txt='Ficou até tarde e não rolou nada.';fx={disc:-3,forma:-1}}}
 else if(id==='jantar'){S.gf.v=clamp(S.gf.v+12,0,100);txt=`${S.gf.n} adorou a noite.`;fx={cab:2}}
 else if(id==='viagem'){S.gf.v=clamp(S.gf.v+25,0,100);txt='Voltaram mais apaixonados que nunca.';fx={cab:5,forma:-1}}
 else if(id==='presente'){S.gf.v=clamp(S.gf.v+8,0,100);txt=`${S.gf.n} postou o presente nas redes.`;fx={fama:1}}
 else if(id==='pedido'){if(ch(.85)){S.rel='casado';S.gf.v=clamp(S.gf.v+15,0,100);txt=`${S.gf.n} disse SIM! Casamento marcado.`;fx={cab:10,fama:4}}else{S.gf.v=clamp(S.gf.v-20,0,100);txt='Ela pediu um tempo pra pensar.';fx={cab:-6}}}
 else if(id==='extra'){S.coach=clamp(S.coach+7,0,100);txt='O técnico viu você treinando sozinho no fim da tarde.';fx={forma:1,corpo:-1}}
 else if(id==='conversa'){const good=S.st&&(S.st.forma>0||S.coach>=60);if(good&&ch(.6)){S.coach=clamp(S.coach+5,0,100);txt='Ele prometeu mais chances nos próximos jogos.';fx={cab:3}}else{S.coach=clamp(S.coach-8,0,100);txt='Ele não gostou da cobrança. "Quem decide sou eu."';fx={cab:-3}}}
 else if(id==='churras'){S.coach=clamp(S.coach+10,0,100);txt='Churrasco na piscina. O grupo ficou mais unido.';fx={cab:4,disc:-1,forma:1}}
 else if(id==='visita'){S.pais=clamp(S.pais+15,0,100);txt='Sua mãe fez sua comida favorita.';fx={cab:4}}
 else if(id==='mesada'){S.pais=clamp(S.pais+10,0,100);txt='Seu pai ficou emocionado com a ajuda.';fx={cab:2}}
 else if(id==='reuniao'){const g=S.st&&S.st.forma>=0&&S.ovr>=club().s-4;if(g){txt='O presidente elogiou sua temporada.';fx={board:6}}else{txt='Ele foi frio. Quer ver mais em campo.';fx={board:-2}}}
 else if(id==='social'){txt='A visita saiu em todos os jornais.';fx={board:5,fama:2,cab:2}}
 return{txt,chips:applyFx(fx)};
}

// ---------- tela de vida ----------
let LIFE_TAB='rel',LIFE_MSG=null,LIFE_BACK=null;
function meterHTML(lbl,v,col){return`<div class="bar"><small><span>${lbl}</span><span>${Math.round(v)}</span></small><i><s style="width:${clamp(v,0,100)}%;background:${col}"></s></i></div>`}
function tempoDots(){let s='';for(let i=1;i<=TEMPO_MAX;i++)s+=`<i class="${S.tempo>=i?'on':S.tempo>=i-.5?'half':''}"></i>`;return`<span class="tdots" title="Tempo livre">${s}</span>`}
function openLife(back){LIFE_BACK=back||renderHub;LIFE_MSG=null;LIFE_CTX='page';ensureLife();renderLife()}
function renderLife(){
 ensureLife();
 const tabs=[['rel','Relações'],['treino','Treino'],['loja','Loja'],['imoveis','Imóveis'],['cassino','Cassino']];
 const head=`<section class="card lifehead"><div class="row" style="justify-content:space-between"><div><div class="eyebrow">Vida fora de campo</div><h2 class="h2" style="font-size:34px">Sua semana</h2></div><button class="btn ghost small" id="lfBack">← Voltar</button></div>
  <div class="lifestats"><div><span class="eyebrow">Dias livres</span><b>${S.tempo}</b><small class="muted">até o próximo jogo</small></div><div><span class="eyebrow">Caixa</span><b>${money(S.din)}</b><small class="muted">€${S.wage} mil/sem${rentWeek()?` + aluguel ${money(rentWeek())}/sem`:''}</small></div><div><span class="eyebrow">Patrimônio</span><b>${money(S.din+propValue())}</b><small class="muted">${S.props.length} imóve${S.props.length===1?'l':'is'}</small></div></div>
  ${LIFE_MSG?`<div class="outcome"><p>${esc(LIFE_MSG.txt)}</p><div class="chipsrow">${(LIFE_MSG.chips||[]).map(([t,k])=>`<span class="chip ${k}">${esc(t)}</span>`).join('')}</div></div>`:''}</section>`;
 let body='';
 if(LIFE_TAB==='rel')body=relHTML();else if(LIFE_TAB==='treino')body=trainHTML();else if(LIFE_TAB==='loja')body=shopHTML();else if(LIFE_TAB==='imoveis')body=propsHTML();else body=casinoHTML();
 shell(`${head}<div class="tabs">${tabs.map(([k,n])=>`<button class="tab ${LIFE_TAB===k?'on':''}" data-lt="${k}">${n}</button>`).join('')}</div>${body}`,{noHist:true,noFast:true});
 $app.querySelectorAll('[data-lt]').forEach(b=>b.onclick=()=>{LIFE_TAB=b.dataset.lt;LIFE_MSG=null;renderLife()});
 document.getElementById('lfBack').onclick=()=>{saveNow('season');(LIFE_BACK||renderHub)()};
 bindLife();
}
function canPay(c,t){return S.din>=c&&S.tempo>=t}
function costLbl(c,t){const p=[];if(t)p.push(`${t} dia${t>1?'s':''}`);if(c)p.push(money(c));return p.join(' · ')||'grátis'}
function relHTML(){
 const acts=relActions();const card=(who,title,sub,meter)=>`<section class="card relcard"><div class="relhd"><span class="relic">${{gf:'❤️',tec:'📋',pais:'🏠',dir:'💼'}[who]}</span><div><b>${title}</b><span class="muted">${sub}</span></div></div>${meter}
  <div class="relacts">${acts.filter(a=>a.who===who).map(a=>`<button class="relbtn" data-rel="${a.id}" ${canPay(a.c,a.t)?'':'disabled'}><b>${esc(a.n)}</b><span>${esc(a.d)}</span><em>${costLbl(a.c,a.t)}</em></button>`).join('')}</div></section>`;
 const tecEff=S.coach>=70?'Ele confia em você: mais minutos.':S.coach<=30?'Ele anda te escondendo no banco.':'Relação normal.';
 return card('gf',S.gf?S.gf.n:'Vida amorosa',S.gf?(S.rel==='casado'?'Casados':'Namorando')+(S.gf.v<25?' · ela está distante':''):'Solteiro',S.gf?meterHTML('Relação',S.gf.v,'#ff7aa8'):'<div class="muted" style="font-size:13px">Um bom relacionamento deixa a cabeça leve. Abandonar costuma acabar mal.</div>')
  +card('tec','Técnico',tecEff,meterHTML('Confiança',S.coach,'var(--accent)'))
  +card('pais','Seus pais',S.pais<30?'Sentem sua falta e isso pesa na sua cabeça.':'Torcem por você em cada jogo.',meterHTML('Proximidade',S.pais,'var(--good)'))
  +card('dir','Diretoria',S.board>=70?'Pedidos de aumento e braçadeira ficam mais fáceis.':'Pesa na renovação, aumento e braçadeira.',meterHTML('Prestígio',S.board,'var(--blue)'));
}
function trainHTML(){
 const ds=DRILLS.filter(d=>S.pos==='GOL'?(d.gk||['long','pass','tactic','sprint'].includes(d.k)):!d.gk);
 return`<section class="card" style="display:grid;gap:10px"><div class="eyebrow">Treino extra · 1 dia · 1 por semana${S.week&&S.week.trained?' · já treinou esta semana':''}</div><div class="muted" style="font-size:13.5px">Cada treino dá forma e XP no atributo. Com 100 XP o atributo sobe e pode subir seu OVR.</div>
 <div class="drills">${ds.map(d=>{const xp=S.xp[d.a]||0;return`<button class="drill" data-dr="${d.k}" ${S.tempo>=1&&!(S.week&&S.week.trained)?'':'disabled'}><span class="dric">${d.ic}</span><b>${d.n}</b><span class="muted">${ATTR_NAME[d.a]} ${CA()[d.a]}</span><i class="xpb"><s style="width:${xp}%"></s></i></button>`}).join('')}</div></section>`;
}
function shopHTML(){
 const cur=S.boot&&BOOTS.find(b=>b.id===S.boot);
 const bl=BOOTS.filter(b=>S.pos==='GOL'?true:!b.gk);
 return`<section class="card" style="display:grid;gap:10px"><div class="eyebrow">Chuteiras</div>
 <div class="muted" style="font-size:13.5px">${cur?`Usando <b style="color:var(--chalk)">${esc(cur.n)}</b> · dura mais ${S.bootLeft} jogos · ${Object.entries(cur.b).map(([k,v])=>`+${v} ${k}`).join(' ')} (OVR efetivo ${bootPerf()>=0?'+':''}${bootPerf()})`:'Sem chuteira especial. Comprar melhora seus atributos dentro de campo.'}</div>
 <div class="shopgrid">${bl.map(b=>`<button class="shopit" data-boot="${b.id}" ${S.din>=b.p?'':'disabled'}><b>${esc(b.n)}</b><span class="muted">${esc(b.d)}</span><span class="chipsrow">${Object.entries(b.b).map(([k,v])=>`<span class="chip up">+${v} ${ATTR_NAME[k]}</span>`).join('')}</span><em>${money(b.p)} · ${b.g} jogos</em></button>`).join('')}</div></section>
 <section class="card" style="display:grid;gap:10px"><div class="eyebrow">Produtos e serviços</div>
 <div class="shopgrid">${SHOP.map(p=>{const own=p.once&&S.owned.includes(p.id);const act=p.perk&&S.perks[p.perk];return`<button class="shopit" data-shop="${p.id}" ${own||act||S.din<p.p?'disabled':''}><b>${esc(p.n)}</b><span class="muted">${esc(p.d)}</span><span class="chipsrow">${Object.entries(p.fx).map(([k,v])=>`<span class="chip ${v>0?'up':'down'}">${v>0?'+':''}${v} ${FX_NAME[k]||k}</span>`).join('')}</span><em>${own?'Você já tem':act?'Ativo nesta temporada':money(p.p)}</em></button>`}).join('')}</div></section>`;
}
function propsHTML(){
 return`<section class="card" style="display:grid;gap:10px"><div class="eyebrow">Imóveis</div><div class="muted" style="font-size:13.5px">Imóveis entram no seu patrimônio. Alguns pagam aluguel toda semana.</div>
 <div class="shopgrid">${PROPS.map(p=>{const own=S.props.includes(p.id);return`<button class="shopit ${own?'owned':''}" data-prop="${p.id}" ${own||S.din<p.p?'disabled':''}><b>${esc(p.n)}</b><span class="muted">${esc(p.d)}</span><span class="chipsrow">${Object.entries(p.fx).map(([k,v])=>`<span class="chip up">+${v} ${FX_NAME[k]}</span>`).join('')}${p.r?`<span class="chip gold">+${money(p.r)}/sem</span>`:''}${p.pais?'<span class="chip up">Pais 100</span>':''}</span><em>${own?'Seu':money(p.p)}</em></button>`}).join('')}</div></section>`;
}
function casinoHTML(){
 if(S.age<18)return`<section class="card"><div class="eyebrow">Cassino</div><p class="muted">Só a partir dos 18 anos.</p></section>`;
 return`<section class="card casino" style="display:grid;gap:12px"><div class="row" style="justify-content:space-between"><div class="eyebrow">Cassino · 1 dia (uma noite)</div><span class="chip ${S.casino.net>=0?'up':'down'}">Saldo na vida: ${S.casino.net>=0?'+':'−'}${money(S.casino.net)}</span></div>
 <div class="muted" style="font-size:13.5px">Cada noite no cassino tira um pouco da sua disciplina. Se a imprensa flagrar, a diretoria não gosta.</div>
 <div class="casgames"><button class="casg" data-cas="horse" ${S.tempo>=1?'':'disabled'}><span>🐎</span><b>Corrida de cavalos</b><small>Escolha o cavalo e aposte</small></button><button class="casg" data-cas="roleta" ${S.tempo>=1?'':'disabled'}><span>🎡</span><b>Roleta</b><small>Cor, par/ímpar ou número</small></button></div></section>`;
}
function bindLife(){
 $app.querySelectorAll('[data-rel]').forEach(b=>b.onclick=()=>{const a=relActions().find(x=>x.id===b.dataset.rel);if(!a||!canPay(a.c,a.t))return;S.tempo-=a.t;S.din-=a.c;if(a.t)dayLog({gf:'❤️',tec:'📋',pais:'🏠',dir:'💼'}[a.who],a.n);LIFE_MSG=doRel(a.id);lifeRefresh()});
 $app.querySelectorAll('[data-dr]').forEach(b=>b.onclick=async()=>{if(S.tempo<1||(S.week&&S.week.trained))return;S.tempo-=1;if(S.week)S.week.trained=true;const r=await weeklyTraining(b.dataset.dr);dayLog('🏋️',DRILLS.find(d=>d.k===b.dataset.dr).n);LIFE_MSG={txt:r.hits>=3?'Treino perfeito.':r.hits>=2?'Bom treino.':'Treino fraco hoje.',chips:r.chips};lifeRefresh()});
 $app.querySelectorAll('[data-boot]').forEach(b=>b.onclick=()=>{const x=BOOTS.find(y=>y.id===b.dataset.boot);if(S.din<x.p)return;S.din-=x.p;S.boot=x.id;S.bootLeft=x.g;LIFE_MSG={txt:`Chuteira nova: ${x.n}.`,chips:Object.entries(x.b).map(([k,v])=>[`+${v} ${ATTR_NAME[k]}`,'up'])};lifeRefresh()});
 $app.querySelectorAll('[data-shop]').forEach(b=>b.onclick=()=>{const x=SHOP.find(y=>y.id===b.dataset.shop);if(S.din<x.p)return;S.din-=x.p;if(x.once)S.owned.push(x.id);if(x.perk)S.perks[x.perk]=true;LIFE_MSG={txt:`Comprou: ${x.n}.`,chips:applyFx(x.fx)};lifeRefresh()});
 $app.querySelectorAll('[data-prop]').forEach(b=>b.onclick=()=>{const x=PROPS.find(y=>y.id===b.dataset.prop);if(S.din<x.p||S.props.includes(x.id))return;S.din-=x.p;S.props.push(x.id);if(x.pais)S.pais=100;LIFE_MSG={txt:`Escritura assinada: ${x.n}.`,chips:applyFx(x.fx)};lifeRefresh()});
 $app.querySelectorAll('[data-cas]').forEach(b=>b.onclick=async()=>{if(S.tempo<1)return;S.tempo-=1;S.casino.visits++;dayLog('🎰','Cassino');const chips=applyFx({disc:-2});
  const r=b.dataset.cas==='horse'?await horseRace():await roulette();
  let extra='';if(ch(S.life.fama>40?.14:.05)){chips.push(...applyFx({board:-5,fama:1}));extra=' Um paparazzi te fotografou no cassino.'}
  LIFE_MSG={txt:r.txt+extra,chips:[...chips,...(r.chips||[])]};lifeRefresh()});
}

// ---------- corrida de cavalos ----------
const HORSES=['Relâmpago','Trovão Negro','Pé de Pano','Estrela Dalva','Ventania','Faísca','Barão','Pingo de Ouro','Furacão','Sereno','Tempestade','Corisco'];
function betOpts(){return[.001,.01,.05,.25,1].filter(v=>v<=S.din+1e-9)}
function horseRace(){
 return new Promise(res=>{
  const hs=shuffle(HORSES).slice(0,6).map((n,i)=>({n,s:R(.8,1.25),c:['#ff7a2b','#7cc4ff','#a6e39a','#f2c443','#ff6a5c','#c9a0ff'][i]}));
  const tot=hs.reduce((s,h)=>s+h.s**6,0);hs.forEach(h=>{h.p=h.s**6/tot;h.odd=Math.max(1.5,Math.round((.82/h.p)*2)/2)});
  let pickI=null,bet=betOpts()[0]||0;let bets=0;
  const draw=(phase,msg)=>{$ov.hidden=false;$ov.innerHTML=`<div class="ovwrap casino-ov"><div class="row" style="justify-content:space-between"><span class="eyebrow">Hipódromo · caixa ${money(S.din)}</span><span class="tag">🐎 Corrida</span></div><h2 class="pkh">Corrida de cavalos</h2>
   <div class="track" id="trk">${hs.map((h,i)=>`<div class="lane"><span class="hnum">${i+1}</span><span class="horse" id="h${i}" style="--c:${h.c}">🏇</span></div>`).join('')}<div class="finish"></div></div>
   ${phase==='bet'?`<div class="hlist">${hs.map((h,i)=>`<button class="hopt ${pickI===i?'on':''}" data-h="${i}"><i style="background:${h.c}"></i><b>${i+1}. ${esc(h.n)}</b><em>${h.odd.toFixed(1).replace('.',',')}x</em></button>`).join('')}</div>
   <div class="betrow"><span class="eyebrow">Aposta</span>${betOpts().map(v=>`<button class="lmbtn ${bet===v?'on':''}" data-b="${v}">${money(v)}</button>`).join('')||'<span class="muted">Sem dinheiro pra apostar</span>'}</div>
   <div class="actions" style="margin-top:10px"><button class="btn" id="hGo" ${pickI==null||!bet||S.din<bet?'disabled':''}>Apostar e largar</button><button class="btn ghost" id="hOut">Ir embora</button></div>`:`<div class="pkres" id="hRes">${msg||''}</div>${phase==='end'?`<div class="actions"><button class="btn" id="hAgain" ${bets<3&&betOpts().length?'':'disabled'}>Outra corrida</button><button class="btn ghost" id="hOut">Ir embora</button></div>`:''}`}</div>`;
   $ov.querySelectorAll('[data-h]').forEach(b=>b.onclick=()=>{pickI=+b.dataset.h;draw('bet')});
   $ov.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{bet=+b.dataset.b;draw('bet')});
   const out=document.getElementById('hOut');if(out)out.onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res(SUM)};
   const go=document.getElementById('hGo');if(go)go.onclick=run;
   const ag=document.getElementById('hAgain');if(ag)ag.onclick=()=>{hs.forEach(h=>{h.s=R(.8,1.25)});const t=hs.reduce((s,h)=>s+h.s**6,0);hs.forEach(h=>{h.p=h.s**6/t;h.odd=Math.max(1.5,Math.round((.82/h.p)*2)/2)});pickI=null;bet=betOpts()[0]||0;draw('bet')};
  };
  const SUM={txt:'Você foi embora sem apostar.',chips:[]};let net=0;
  const run=()=>{S.din-=bet;bets++;draw('race');
   const pos=hs.map(()=>0);const els=hs.map((_,i)=>document.getElementById('h'+i));let win=-1;
   const step=()=>{for(let i=0;i<hs.length;i++){pos[i]+=(hs[i].s*.55+rnd()*.9)*(reduced?6:1.1);if(pos[i]>=100&&win<0)win=i;els[i].style.left=`calc(${Math.min(pos[i],100)}% - ${Math.min(pos[i],100)*.3}px)`}
    if(win<0){requestAnimationFrame(step);return}
    const ok=win===pickI;const pay=ok?bet*hs[pickI].odd:0;S.din+=pay;net+=pay-bet;S.casino.net+=pay-bet;
    SUM.txt=net>=0?`Saiu do hipódromo com ${money(net)} a mais.`:`Perdeu ${money(-net)} nos cavalos.`;SUM.chips=[[`${net>=0?'+':'−'}${money(net)}`,net>=0?'up':'down']];
    draw('end',ok?`<span class="good">${esc(hs[win].n)} venceu! +${money(pay)}</span>`:`<span class="bad">Deu ${esc(hs[win].n)}. Perdeu ${money(bet)}</span>`);
    hs.forEach((h,i)=>{const e=document.getElementById('h'+i);if(e)e.style.left=`calc(${Math.min(pos[i],100)}% - ${Math.min(pos[i],100)*.3}px)`})};
   requestAnimationFrame(step)};
  draw('bet');
 });
}
// ---------- roleta ----------
const RED=[1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36];
function roulette(){
 return new Promise(res=>{
  let sel=null,bet=betOpts()[0]||0,spins=0,net=0;const SUM={txt:'Você foi embora sem apostar.',chips:[]};
  const draw=(phase,msg,n)=>{$ov.hidden=false;$ov.innerHTML=`<div class="ovwrap casino-ov"><div class="row" style="justify-content:space-between"><span class="eyebrow">Roleta · caixa ${money(S.din)}</span><span class="tag">🎡 Roleta</span></div><h2 class="pkh">Roleta</h2>
   <div class="wheel ${n!=null?(n===0?'z':RED.includes(n)?'r':'b'):''}" id="whl">${n!=null?n:'?'}</div>
   ${phase!=='spin'?`<div class="rbets">${[['red','Vermelho','2x'],['black','Preto','2x'],['even','Par','2x'],['odd','Ímpar','2x'],['low','1–18','2x'],['high','19–36','2x']].map(([k,l,m])=>`<button class="hopt ${sel===k?'on':''}" data-r="${k}"><b>${l}</b><em>${m}</em></button>`).join('')}</div>
   <div class="numgrid">${Array.from({length:37},(_,i)=>`<button class="rn ${i===0?'z':RED.includes(i)?'r':'b'} ${sel===i?'on':''}" data-n="${i}">${i}</button>`).join('')}</div><div class="muted" style="font-size:12px">Número exato paga 36x.</div>
   <div class="betrow"><span class="eyebrow">Aposta</span>${betOpts().map(v=>`<button class="lmbtn ${bet===v?'on':''}" data-b="${v}">${money(v)}</button>`).join('')||'<span class="muted">Sem dinheiro</span>'}</div>
   <div class="pkres">${msg||''}</div>
   <div class="actions"><button class="btn" id="rGo" ${sel==null||!bet||S.din<bet||spins>=4?'disabled':''}>Girar</button><button class="btn ghost" id="rOut">Ir embora</button></div>`:''}</div>`;
   $ov.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{sel=b.dataset.r;draw('bet')});
   $ov.querySelectorAll('[data-n]').forEach(b=>b.onclick=()=>{sel=+b.dataset.n;draw('bet')});
   $ov.querySelectorAll('[data-b]').forEach(b=>b.onclick=()=>{bet=+b.dataset.b;draw('bet')});
   const o=document.getElementById('rOut');if(o)o.onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res(SUM)};
   const g=document.getElementById('rGo');if(g)g.onclick=spin;
  };
  const spin=async()=>{S.din-=bet;spins++;draw('spin',null,0);const w=document.getElementById('whl');const n=RI(0,36);
   for(let i=0;i<(reduced?2:22);i++){const k=RI(0,36);w.textContent=k;w.className='wheel spin '+(k===0?'z':RED.includes(k)?'r':'b');await sleep(60+i*9)}
   const win=typeof sel==='number'?n===sel:n!==0&&(sel==='red'?RED.includes(n):sel==='black'?!RED.includes(n):sel==='even'?n%2===0:sel==='odd'?n%2===1:sel==='low'?n<=18:n>=19);
   const pay=win?bet*(typeof sel==='number'?36:2):0;S.din+=pay;net+=pay-bet;S.casino.net+=pay-bet;
   SUM.txt=net>=0?`Saiu da roleta com ${money(net)} a mais.`:`Perdeu ${money(-net)} na roleta.`;SUM.chips=[[`${net>=0?'+':'−'}${money(net)}`,net>=0?'up':'down']];
   draw('bet',win?`<span class="good">Deu ${n}! +${money(pay)}</span>`:`<span class="bad">Deu ${n}. Perdeu ${money(bet)}</span>`,n)};
  draw('bet');
 });
}

// ---------- eventos de relacionamento ----------
EV.push(
{id:'gf_aniver',k:'vida',a:[17,40],c:()=>S.gf&&S.gf.v<70,t:'Aniversário dela',d:()=>`O aniversário da ${S.gf.n} cai na véspera de um jogo importante. Ela conta com você na festa.`,o:[
 ['Ir na festa e voltar cedo',()=>ch(.6)?['Foi e voltou cedo. Todo mundo feliz.',{cab:3,gfv:12}]:['A festa esticou e você dormiu mal.',{forma:-2,gfv:15}]],
 ['Ficar concentrado',()=>['Ela entendeu… mais ou menos.',{gfv:-15,forma:1}],1],
 ['Mandar um presente caro',()=>['Ela gostou, mas queria você lá.',{din:-.02,gfv:4}]]]},
{id:'tec_cobra',k:'campo',a:[17,40],c:()=>S.club&&S.coach<35,t:'O técnico te cobra em público',d:()=>'Na coletiva, o técnico disse que você "precisa render muito mais pra jogar".',o:[
 ['Responder nas redes',()=>['A torcida gostou, o técnico não.',{fama:3,coach:-15,board:-4}]],
 ['Pedir uma conversa a sós',()=>ch(.6)?['Vocês se acertaram.',{coach:12,cab:3}]:['Ele manteve a posição.',{coach:2}],1],
 ['Calar e treinar dobrado',()=>['O silêncio falou alto.',{coach:8,forma:1,corpo:-2}]]]},
{id:'pais_saudade',k:'vida',a:[16,40],c:()=>S.pais<45,t:'Saudade de casa',d:()=>'Sua mãe ligou chorando. Faz tempo que você não aparece.',o:[
 ['Pegar um voo na folga',()=>['Abraço de mãe resolve tudo.',{pais:30,cab:6,forma:-1}],1],
 ['Trazer os dois pra passar uma semana',()=>['Casa cheia de novo.',{pais:25,din:-.01,cab:5}]],
 ['Prometer ir no fim da temporada',()=>['Ela disse que entende.',{pais:-5,cab:-3}]]]},
{id:'pres_jantar',k:'vida',a:[18,40],c:()=>S.club&&S.board>=55,t:'Convite do presidente',d:()=>'O presidente te convidou pra um jantar com patrocinadores do clube.',o:[
 ['Ir e ser simpático',()=>['Os patrocinadores adoraram você.',{board:8,fama:3,din:.02}],1],
 ['Recusar educadamente',()=>['Ele não insistiu.',{board:-3}]]]}
);
// efeitos extras usados pelos eventos
const _applyFx0=applyFx;
applyFx=function(fx){
 const chips=_applyFx0(fx);if(!fx)return chips;ensureLife();
 if(fx.gfv&&S.gf){S.gf.v=clamp(S.gf.v+fx.gfv,0,100);chips.push([`${fx.gfv>0?'+':'−'}${Math.abs(fx.gfv)} Relação`,fx.gfv>0?'up':'down'])}
 if(fx.coach){S.coach=clamp(S.coach+fx.coach,0,100);chips.push([`${fx.coach>0?'+':'−'}${Math.abs(fx.coach)} Técnico`,fx.coach>0?'up':'down'])}
 if(fx.pais){S.pais=clamp(S.pais+fx.pais,0,100);chips.push([`${fx.pais>0?'+':'−'}${Math.abs(fx.pais)} Pais`,fx.pais>0?'up':'down'])}
 return chips;
};

// ================== SEMANA (tela única até o dia do jogo) ==================
const DOW=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];const DOWL=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
let LIFE_CTX='page',WEEK_TAB=null,SHEET_SCROLL=0;
function lifeRefresh(){if(LIFE_CTX==='hub'){KEEPSC=true;renderHub()}else renderLife()}
function newWeek(){
 const md=S.week&&S.week.md===0?3:0;const from=md===3?1:4;const n=md===3?2:3;
 S.week={md,days:Array.from({length:n},(_,i)=>(from+i)%7),log:[],trained:false};S.tempo=n;
}
function dayLog(ic,t){if(!S.week)newWeek();S.week.log.push({ic,t})}
function nextMatchInfo(){
 const st=S.st;const me=club();if(!st)return null;
 for(let i=st.idx;i<st.cal.length;i++){const it=st.cal[i];
  if(it.k==='lg'){const pr=(st.rounds[it.r]||[]).find(p=>p[0]===me.id||p[1]===me.id);if(!pr)continue;const home=pr[0]===me.id;return{comp:LG[st.lg].n,label:`Rodada ${it.r+1}`,opp:home?pr[1]:pr[0],home}}
  if(it.k==='yl'){const c=st.comps.yl;if(!c)continue;return{comp:c.n,label:`${it.i+1}ª rodada`,opp:c.opps[it.i],home:c.homes?c.homes[it.i]:true,youth:true}}
  if(it.k==='grp'){const c=st.comps[it.cid];const g=c&&c.gm&&c.gm[it.i];if(g)return{comp:c.n,label:c.kind==='grp'?'Fase de grupos':'Fase de liga',opp:g.opp,home:g.home}}
  if(it.k==='ko'||it.k==='est'||it.k==='tg'){const c=st.comps[it.cid||'est'];if(!c||!c.alive)continue;const rd=c.rounds&&c.rounds[c.stage];return{comp:c.n,label:it.k==='est'?'Fase de grupos':rd?rd.n:'',opp:rd&&rd.opp||null,youth:!!c.youth}}
 }
 return null;
}
function weekHTML(){
 ensureLife();if(!S.week)newWeek();
 const me=club();const nm=nextMatchInfo();const w=S.week;const used=w.days.length-S.tempo;
 const oppC=nm&&nm.opp?CLUB[nm.opp]:null;
 const nameOf=c=>c?(nm.youth?`${c.n} ${ysuf(c.id)}`:c.n):'A definir';
 const mdTile=`<div class="wday match"><span>${DOW[w.md]}</span><div class="wmatch">${oppC?shieldHTML(oppC,'sm'):'<span class="qq">?</span>'}</div><b>JOGO</b></div>`;
 const tiles=w.days.map((d,i)=>{const lg=w.log[i];const cur=i===used;return`<div class="wday ${lg?'done':''} ${cur?'cur':''}"><span>${DOW[d]}</span><div class="wic">${lg?lg.ic:cur?'👉':'·'}</div><b>${lg?esc(lg.t):cur?'Hoje':'Livre'}</b></div>`}).join('');
 const today=S.tempo>0?DOWL[w.days[used]]:null;
 const tabs=[['treino','🏋️','Treinar'],['rel','❤️','Relações'],['loja','🛍️','Loja'],['imoveis','🏠','Imóveis'],['cassino','🎰','Cassino']];
 let body='';if(WEEK_TAB==='rel')body=relHTML();else if(WEEK_TAB==='treino')body=trainHTML();else if(WEEK_TAB==='loja')body=shopHTML();else if(WEEK_TAB==='imoveis')body=propsHTML();else if(WEEK_TAB==='cassino')body=casinoHTML();
 return`<section class="matchday">
  <div class="mdlights"><i></i><i></i></div>
  <div class="mdtop"><span class="eyebrow">Próximo jogo${nm?` · ${esc(nm.comp)}`:''}</span><span class="eyebrow">${nm?esc(nm.label):''}</span></div>
  ${isDecisive(nextItem())?'<span class="livebadge"><i></i>Jogo decisivo · vai passar ao vivo</span>':''}
  ${nm?`<div class="mdvs"><div class="mdt">${shieldHTML(nm.youth?{...me,n:me.n}:me,'lg')}<b>${esc(nm.youth?`${me.n} ${ysuf(me.id)}`:me.n)}</b></div><div class="mdx"><b>${DOW[w.md]}</b><span>${nm.home===false?'fora':nm.home?'em casa':''}</span></div><div class="mdt">${oppC?shieldHTML(oppC,'lg'):'<span class="shield lg qq">?</span>'}<b>${esc(nameOf(oppC))}</b></div></div>`:`<div class="mdvs"><b style="font-family:var(--f-display);font-size:24px">${esc(nextLabel())}</b></div>`}
  <div class="week">${tiles}${mdTile}</div>
  ${(S.st.lifeNews||[]).length?`<div class="wnews">${S.st.lifeNews.map(t=>`<div>💬 ${esc(t)}</div>`).join('')}</div>`:''}
 </section>
 <section class="card todo">
  <div class="row" style="justify-content:space-between;align-items:baseline"><h3 class="todoh">${today?`${today}`:'Semana cheia. Bora pro jogo!'}</h3><span class="chip">${S.tempo} dia${S.tempo===1?'':'s'} livre${S.tempo===1?'':'s'} · ${money(S.din)}</span></div>
  ${LIFE_MSG&&!body?`<div class="outcome"><p>${esc(LIFE_MSG.txt)}</p><div class="chipsrow">${(LIFE_MSG.chips||[]).map(([t,k])=>`<span class="chip ${k}">${esc(t)}</span>`).join('')}</div></div>`:''}
  <div class="wacts">${tabs.map(([k,ic,n])=>`<button class="wact ${WEEK_TAB===k?'on':''}" data-wt="${k}"><span>${ic}</span>${n}</button>`).join('')}<button class="wact" id="wRest" ${S.tempo>0?'':'disabled'}><span>😴</span>Descansar</button></div>
  ${body?(()=>{const t=tabs.find(x=>x[0]===WEEK_TAB);return`<div class="sheetbg" id="shBg"><div class="sheet" role="dialog" aria-label="${t[2]}"><div class="shgrab"></div>
   <div class="shhead"><div><b>${t[1]} ${t[2]}</b><span class="muted">${today?today+' · ':''}${S.tempo} dia${S.tempo===1?'':'s'} livre${S.tempo===1?'':'s'} · ${money(S.din)}</span></div><button class="shx" id="shX" aria-label="Fechar">✕</button></div>
   ${LIFE_MSG?`<div class="outcome"><p>${esc(LIFE_MSG.txt)}</p><div class="chipsrow">${(LIFE_MSG.chips||[]).map(([t,k])=>`<span class="chip ${k}">${esc(t)}</span>`).join('')}</div></div>`:''}
   <div class="shbody">${body}</div></div></div>`})():''}
 </section>`;
}
function bindWeek(){
 $app.querySelectorAll('[data-wt]').forEach(b=>b.onclick=()=>{WEEK_TAB=WEEK_TAB===b.dataset.wt?null:b.dataset.wt;LIFE_MSG=null;SHEET_SCROLL=0;KEEPSC=true;renderHub()});
 const r=document.getElementById('wRest');if(r)r.onclick=()=>{if(S.tempo<1)return;S.tempo--;dayLog('😴','Descanso');LIFE_MSG={txt:'Dia de descanso. Corpo agradece.',chips:applyFx({corpo:2,cab:1})};KEEPSC=true;renderHub()};
 LIFE_CTX='hub';bindLife();
 document.body.classList.toggle('noscroll',!!WEEK_TAB);
 const close=()=>{WEEK_TAB=null;KEEPSC=true;renderHub()};
 const x=document.getElementById('shX');if(x)x.onclick=close;
 const bg=document.getElementById('shBg');if(bg){bg.onclick=e=>{if(e.target===bg)close()};const sh=bg.querySelector('.sheet');const sp=bg.dataset.sp;if(SHEET_SCROLL)sh.scrollTop=SHEET_SCROLL;sh.onscroll=()=>{SHEET_SCROLL=sh.scrollTop}}
}
