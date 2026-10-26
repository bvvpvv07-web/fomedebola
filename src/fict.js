// ================== VERSÃO FICTÍCIA ==================
// Clubes, lendas e estrelas ganham nomes inventados, sempre os mesmos (sorteados a partir do código de cada um),
// e os escudos são desenhados aqui. O build tira as imagens e os nomes reais; FICT_REAL_H traz só a "impressão"
// (hash) dos nomes reais, pra o sorteio nunca cair num nome de verdade. O editor (editor.js) muda por cima disso.
const FICT={used:new Set(),abbr:{},patch:null};
const fN=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/[^a-z0-9]/g,'');
const FICT_REAL=new Set(typeof FICT_REAL_H!=='undefined'?FICT_REAL_H:[]);
function fictBad(n){const k=fN(n);return!k||FICT_REAL.has(hash(k))||FICT.used.has(k)}
const fpk=(r,a)=>a[Math.floor(r()*a.length)];
const fwk=(r,a)=>{const t=a.reduce((s,x)=>s+x[1],0);let v=r()*t;for(const x of a){v-=x[1];if(v<=0)return x[0]}return a[0][0]};
// ---------- lugares inventados por língua ----------
const FP={
 pt:{A:[['Vale','m'],['Serra','f'],['Porto','m'],['Vila','f'],['Monte','m'],['Campo','m'],['Ribeira','f'],['Lagoa','f'],['Barra','f'],['Ponte','f'],['Morro','m'],['Praia','f'],['Rio','m'],['Arraial','m'],['Cachoeira','f'],['Engenho','m'],['Planalto','m'],['Várzea','f'],['Recanto','m'],['Chapada','f'],['Pedra','f'],['Ilha','f'],['Areia','f'],['Bosque','m']],
  B:[['Verde'],['Azul'],['Alegre'],['Dourado','Dourada'],['Bonito','Bonita'],['Novo','Nova'],['Grande'],['Formoso','Formosa'],['Claro','Clara'],['Alto','Alta'],['Real'],['Belo','Bela'],['Branco','Branca'],['Velho','Velha'],['Bravo','Brava'],['Santo','Santa'],['Preto','Preta'],['Largo','Larga'],['Fundo','Funda'],['do Sol'],['das Pedras'],['da Mata'],['do Norte'],['do Sul'],['das Flores'],['dos Coqueiros'],['da Serra'],['do Mar'],['das Águas'],['do Oeste'],['dos Ventos'],['de Ouro'],['de Prata'],['do Rei']]},
 es:{A:[['Valle','m'],['Sierra','f'],['Puerto','m'],['Villa','f'],['Monte','m'],['Río','m'],['Campo','m'],['Costa','f'],['Peña','f'],['Torre','f'],['Llano','m'],['Vega','f'],['Cerro','m'],['Mesa','f'],['Ribera','f'],['Fuente','f'],['Arroyo','m'],['Loma','f'],['Playa','f'],['Pinar','m']],
  B:[['Verde'],['Alto','Alta'],['Real'],['Nuevo','Nueva'],['Dorado','Dorada'],['Blanco','Blanca'],['Bravo','Brava'],['Claro','Clara'],['Hermoso','Hermosa'],['Viejo','Vieja'],['Grande'],['Azul'],['del Sol'],['del Mar'],['de Oro'],['del Norte'],['del Sur'],['de la Luna'],['de las Flores'],['del Rey'],['de Plata'],['del Viento']]}};
const FJ={ // pedaços que se juntam numa palavra só
 en:{A:['Ash','Black','Bram','Brook','Castle','Clay','Elm','Fair','Green','Hart','Holl','King','Lock','Mill','North','Oak','Red','Rose','Silver','Stone','West','White','Wolf','Burn','Cole','Dun','Fen','Thorn','Marl','Hather','Bright','Sand','Salt','Chalk','Raven','Hazel','Lark','Fox'],B:['ford','bury','ham','ton','wick','mouth','field','gate','dale','ley','borough','chester','stead','well','worth','minster','port','by','combe','hurst','ridge','moor','croft','haven']},
 it:{A:['Monte','Castel','Borgo','Villa','Colle','Poggio','Rocca','Fonte','Campo','Torre'],B:['verde','alto','fiore','rosso','bello','nuovo','mare','sole','chiaro','doro','azzurro','grande','lungo','santo','franco','vecchio','lieto','forte']},
 de:{A:['Rhein','Wald','Berg','Linden','Eichen','Hohen','Neu','Sonnen','Stein','Tann','Wiesen','Rosen','Falken','Adler','Hirsch','Buchen','Erlen','Kirch','Mühl','Kron','Fels','Grün','Silber','Gold','Eisen'],B:['stadt','berg','burg','feld','hausen','heim','dorf','tal','bach','au','brück','wald','furt','stein','hagen','hof']},
 fr:{A:['Beau','Bel','Mont','Val','Ville','Bois','Fort','Clair','Roche','Port','Pont','Haut','Grand','Champ','Mer','Blanc'],B:['mont','lieu','champ','fort','pré','val','bourg','court','ville','mer','rive','lac','bois','roc','nay','cy']},
 nl:{A:['Zand','Water','Dijk','Molen','Brug','Veen','Hoog','Oost','West','Noord','Zuid','Berg','Linde','Eik','Groen','Duin','Wind','Kas','Wil','Ber','Bloem','Vos'],B:['dam','dijk','veen','hoven','burg','wijk','horst','stad','meer','vliet','haven','huizen','bergen','sloot','hout','dorp']},
 us:{A:['Bay','Lake','Pine','River','Stone','Silver','Golden','Red','Iron','Cedar','Maple','Harbor','Sun','Prairie','Canyon','Desert','Coast','Summit','Eagle','Granite','Copper','Blue','Ocean','Storm'],B:['ville','ton',' Valley',' Springs',' Falls',' Ridge',' Bay',' City',' Point',' Heights',' Creek',' Park']}};
const F_TUPI=['Tabajara','Tamoios','Guaraci','Itapuã','Jacuípe','Juruá','Ubirajara','Jaçanã','Piratini','Caiçara','Tapajós','Xingu','Araguari','Itaúna','Ibitinga','Iporã','Jupiá','Tibagi','Anhumas','Ivaí','Paraguaçu','Itapira','Jaraguá','Sapucaí','Mogiana','Paranaíba','Juquiá','Aracati','Potengi','Ibiapaba','Pajeú','Acaraú','Jaguaribe','Itapicuru','Mearim','Gurupi','Javari','Purus','Iguatemi','Aimberê','Tupinambá','Potira','Moacir','Jurema','Itaparica','Camboriú','Iracema','Araripe','Ubatã','Itaquera'];
const F_AR=['Nojoom','Fajr','Sahel','Wadi','Majd','Najma','Sukoor','Qamar','Shams','Bahr','Jabal','Nakheel','Rimal','Ward','Fursan','Sharq','Gharb','Nour','Amal','Wafa','Taj','Kawkab','Burj','Waha','Thuraya','Asifa','Barq','Saqr','Fahd','Nasim','Durra','Yasmin','Fanar','Manar','Hamra','Sahra','Riyah','Sanabel'];
const F_JP=['Sakura','Kaze','Hoshi','Umi','Yama','Sora','Hikari','Tsubasa','Raijin','Kumo','Taiyo','Ryu','Tora','Kawa','Mori'],F_JPY=['FC','United','Stars','Dragons','Tigers','Phoenix','Waves','Blaze'];
const F_AF=['Sahara','Atlas','Kilima','Savane','Baobab','Delta','Oasis','Kalahari','Zambeze','Okavango','Simba','Tembo','Jua','Nyota','Mvua'];
function fPlace(r,L){const P=FP[L];const[a,g]=fpk(r,P.A);const b=fpk(r,P.B);return a+' '+(b.length>1&&g==='f'?b[1]:b[0])}
function fJoin(r,L){const P=FJ[L];const a=fpk(r,P.A),b=fpk(r,P.B);if(b[0]===' ')return a+b;let w=(a+b).toLowerCase();return w[0].toUpperCase()+w.slice(1)}
const FSTY={
 br:[['{P}',5],['{P} FC',3],['Esporte Clube {P}',1],['Atlético {P}',2],['União {P}',2],['Grêmio {P}',1],['Operário {P}',1],['Ferroviário {P}',1],['Comercial {P}',1],['Independente {P}',1],['Real {P}',1],['Sociedade {P}',1]],
 pt:[['{P}',3],['Sporting {P}',2],['{P} FC',2],['CD {P}',1],['União de {P}',1],['Vitória de {P}',1],['Desportivo de {P}',1],['Atlético {P}',1]],
 en:[['{P} United',3],['{P} City',3],['{P} Town',2],['{P} Rovers',2],['{P} Athletic',2],['{P} Albion',1],['{P} Wanderers',1],['{P} FC',2],['{P} Rangers',1],['{P} County',1]],
 es:[['Real {P}',2],['Deportivo {P}',2],['Atlético {P}',2],['{P} CF',2],['Unión {P}',1],['Racing {P}',1],['Sporting {P}',1],['CD {P}',1],['{P}',2]],
 ar_es:[['Club Atlético {P}',1],['Deportivo {P}',2],['Racing {P}',1],['Unión {P}',1],['Sportivo {P}',1],['Gimnasia de {P}',1],['Defensores de {P}',1],['Atlético {P}',2],['Juventud {P}',1],['{P}',2]],
 mx:[['Club {P}',2],['Deportivo {P}',2],['{P} FC',2],['Atlético {P}',1],['Real {P}',1],['Halcones de {P}',1],['Jaguares de {P}',1]],
 it:[['AC {P}',2],['US {P}',2],['{P} Calcio',2],['Sporting {P}',1],['Virtus {P}',1],['Real {P}',1],['AS {P}',2],['FC {P}',1],['{P}',2]],
 de:[['FC {P}',3],['SV {P}',2],['VfB {P}',1],['TSV {P}',1],['Borussia {P}',1],['SC {P}',1],['Eintracht {P}',1],['1. FC {P}',1],['SpVgg {P}',1],['Fortuna {P}',1],['Union {P}',1],['VfL {P}',1]],
 fr:[['Olympique {P}',2],['AS {P}',2],['FC {P}',2],['Stade {P}',2],['Racing {P}',1],['US {P}',1],['SC {P}',1],['AJ {P}',1],['{P}',2]],
 nl:[['FC {P}',3],['SC {P}',2],['{P} FC',1],['VV {P}',1],['SV {P}',1],['{P} Boys',1],['Sparta {P}',1],['Fortuna {P}',1],['{P}',2]],
 us:[['{P} FC',3],['{P} United',2],['Real {P}',1],['{P} SC',2],['{P} Athletic',1],['{P} Rush',1],['{P} Storm',1],['{P} Comets',1],['{P} Rapids',1]]};
function fictClubName(id,c,r){
 const cty=c.country||null,ext=c.ext||null;
 const sty=cty==='BRA'?'br':cty==='POR'?'pt':cty==='ENG'?'en':cty==='ESP'?'es':cty==='ARG'?'ar_es':cty==='ITA'?'it':cty==='GER'?'de':cty==='FRA'?'fr':cty==='NED'?'nl':cty==='USA'?'us':cty==='KSA'?'ar':
  ext==='NA'?'mx':ext==='AS'?(/^Al[- ]/.test(id)?'ar':'jp'):ext==='AF'?(/^Al[- ]|^Pyr|^Wyd/.test(id)?'ar':'af'):'en';
 if(sty==='ar')return fpk(r,[`Al-${fpk(r,F_AR)}`,`Al-${fpk(r,F_AR)}`,`Al-${fpk(r,F_AR)}`,`${fpk(r,F_AR)} Club`]);
 if(sty==='jp')return`${fpk(r,F_JP)} ${fpk(r,F_JPY)}`;
 if(sty==='af'){const x=fpk(r,F_AF);return fpk(r,[`${x} Stars`,`${x} United`,`Espoir de ${x}`,`${x} Lions`,`Étoile du ${x}`])}
 let P;if(sty==='br'||sty==='pt')P=sty==='br'&&r()<.3?fpk(r,F_TUPI):fPlace(r,'pt');else if(sty==='es'||sty==='ar_es'||sty==='mx')P=fPlace(r,'es');
 else P=fJoin(r,sty==='en'?'en':sty);
 return fwk(r,FSTY[sty]).replace('{P}',P)}
// sigla: pula as palavras genéricas (FC, Atlético, United…) e usa as que dão nome ao clube
const F_GEN=new Set(['fc','sc','ac','as','us','cf','cd','sv','vfb','tsv','vfl','spvgg','1','esporte','clube','atletico','sociedade','uniao','gremio','operario','ferroviario','comercial','independente','real','desportivo','deportivo','club','union','racing','sporting','olympique','stade','united','city','town','rovers','athletic','albion','wanderers','rangers','county','calcio','virtus','pro','borussia','eintracht','fortuna','juniors','sportivo','gimnasia','defensores','juventud','vitoria','de','da','do','das','dos','del','di','du','la','las','los','boys','vv','aj','en','avant','sparta','halcones','jaguares','stars','lions','espoir','etoile','rush','storm','wolves','comets']);
function fictAbbr(n,taken){const W=n.replace(/-/g,' ').split(/\s+/).map(w=>w.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^A-Za-z]/g,'')).filter(Boolean);
 let D=W.filter(w=>!F_GEN.has(w.toLowerCase())&&!/^al$/i.test(w));if(!D.length)D=W;const U=s=>s.toUpperCase();
 const opts=[];if(D.length>=2)opts.push(D[0][0]+D[1].slice(0,2),D[0].slice(0,2)+D[1][0],D[0][0]+D[1][0]+(D[1][1]||'X'));opts.push(D[0].slice(0,3),D[0][0]+D[0].slice(2,4),D[0][0]+(D[0][1]||'X')+(D[0][3]||D[0][2]||'X'));
 for(const o of opts){const a=U(o).padEnd(3,'X');if(!taken.has(a)){taken.add(a);return a}}
 for(let i=2;i<10;i++){const a=U(D[0].slice(0,2))+i;if(!taken.has(a)){taken.add(a);return a}}return U(D[0].slice(0,3))}
// ---------- pessoas (lendas e estrelas) ----------
const F_NICK=['Tião','Juca','Zeca','Biro','Toninho','Pepeu','Bita','Lelo','Babá','Cacá','Fefé','Gegê','Lulu','Nonô','Pipo','Quim','Tatá','Vadão','Xodó','Zuzu','Bolinha','Foguinho','Canela','Baiano','Mineiro','Paraíba','Tuca','Dinho','Nego','Lalá','Tinho','Bebeco','Duda','Tico','Marujo','Russo','Galego','Bigode','Formiga','Pelado'];
const F_NA={BRA:'pt',POR:'pt',ESP:'es',ARG:'es',URU:'es',COL:'es',MEX:'es',CHI:'es',PAR:'es',PER:'es',ECU:'es',VEN:'es',BOL:'es',ENG:'en',USA:'en',SCO:'en',WAL:'en',IRL:'en',ITA:'it',GER:'de',AUT:'de',SUI:'de',FRA:'fr',BEL:'fr',NED:'nl',KSA:'ar',EGY:'ar',MAR:'ar',ALG:'ar',TUN:'ar'};
let F_FLAGNAT=null;function fictNatOfFlag(f){if(!F_FLAGNAT){F_FLAGNAT={};try{for(const k in FLAG)F_FLAGNAT[FLAG[k]]=k}catch(e){}}return F_FLAGNAT[f]||null}
function fictPerson(seed,nat,legend){const r=seeded(hash('p:'+seed));const L=F_NA[nat];
 for(let t=0;t<30;t++){let n;
  if(nat==='BRA'&&r()<(legend?.55:.3))n=fpk(r,F_NICK);
  else if(L&&typeof YNAMES!=='undefined'&&YNAMES[L]){const P=YNAMES[L];n=fpk(r,P.f)+' '+fpk(r,P.l)}
  else n=fpk(r,FIRST)+' '+fpk(r,LAST);
  const bad=n.split(' ').some(w=>w.length>=3&&FICT_REAL.has(hash(fN(w))))||FICT_REAL.has(hash(fN(n)));
  if(!bad&&!FICT.used.has(fN(n))){FICT.used.add(fN(n));return n}}
 return fakeName(r)}
// estrela atual: chamado pelo jogo quando monta o mundo e o álbum
const F_STAR={};function fictP(n,nat){if(!/^#\d+$/.test(String(n).trim()))return n;const k=String(n).trim();return F_STAR[k]||(F_STAR[k]=fictPerson('s'+k,nat,false))}
// ---------- aplica nos dados ----------
const FICT_IS=typeof FICT_ON!=='undefined'?FICT_ON:true;
function fictGenClubs(){if(FICT.names.done)return;FICT.used.clear();const taken={};
 // versão oficial: o "nome de fábrica" é o nome real; o editor muda por cima
 if(!FICT_IS){for(const id in CLUB)FICT.names[id]={n:CLUB[id].n,a:CLUB[id].a};FICT.names.done=true;return}
 for(const id in CLUB){const c=CLUB[id];const r=seeded(hash('club:'+id));let n=null;
  for(let t=0;t<40;t++){const x=fictClubName(id,c,r);if(x.length<=22&&!fictBad(x)){n=x;break}}
  if(!n)n='Clube '+id.slice(0,2).toUpperCase()+(hash(id)%97);
  FICT.used.add(fN(n));const lk=c.l||c.ext||'x';taken[lk]=taken[lk]||new Set();FICT.names[id]={n,a:fictAbbr(n,taken[lk])}}
 for(let i=0;i<LEGENDS.length;i++){const L=LEGENDS[i];if(/^#\d+$/.test(L[0]))L[0]=fictPerson('l'+i,fictNatOfFlag(L[1]),true)}
 FICT.names.done=true}
FICT.names={};FICT.legend0=null;
function fictPatch(){if(FICT.patch)return FICT.patch;let p=null;try{p=JSON.parse(localStorage.getItem('fdb_patch')||'null')}catch(e){}FICT.patch=p&&typeof p==='object'?p:{v:1,clubs:{},leagues:{},players:{}};
 FICT.patch.clubs=FICT.patch.clubs||{};FICT.patch.leagues=FICT.patch.leagues||{};FICT.patch.players=FICT.patch.players||{};return FICT.patch}
function applyFict(){fictGenClubs();const P=fictPatch();
 if(!FICT.legend0)FICT.legend0=LEGENDS.map(L=>L[0]);
 for(const id in CLUB){const c=CLUB[id],f=FICT.names[id];if(!f)continue;const p=P.clubs[id]||{};
  c.n=p.n||f.n;c.a=p.a||f.a;if(!c.c10){c.c10=c.c1;c.c20=c.c2}c.c1=p.c1||c.c10;c.c2=p.c2||c.c20;c.img=p.img||null}
 if(!FICT.lg0){FICT.lg0={};for(const k in LG)FICT.lg0[k]=LG[k].n}
 for(const k in LG)LG[k].n=P.leagues[k]||FICT.lg0[k];
 LEGENDS.forEach((L,i)=>{L[0]=P.players['l'+i]||FICT.legend0[i]})}
// CLUB é remontado em alguns lugares (nova carreira, carregar): o nome inventado volta junto
{const _bcF=buildClubs;buildClubs=function(...a){const r=_bcF.apply(this,a);try{applyFict()}catch(e){console.warn('fict',e)}return r}}
applyFict();
// ---------- escudo desenhado ----------
const F_SH=['M30 2 L56 9 V34 C56 52 44 63 30 69 C16 63 4 52 4 34 V9 Z','M4 5 H56 V32 C56 51 44 61 30 69 C16 61 4 51 4 32 Z','M6 3 H54 V45 C54 57 42 64 30 68 C18 64 6 57 6 45 Z','M30 2 L57 18 V50 L30 68 L3 50 V18 Z','M30 3 C46 3 57 9 57 9 V36 C57 53 44 63 30 68 C16 63 3 53 3 36 V9 C3 9 14 3 30 3 Z'];
function fictCrest(c){const h=hash('crest:'+(c.id||c.n));const c1=c.c1||'#555',c2=c.c2||'#ddd';const dk=l3Dark(c1)?c2:'#111';
 const sh=h%6===5?null:F_SH[h%5];const pat=(h>>>3)%7;const id='cr'+(h%100000);
 let P='';switch(pat){
  case 1:for(let x=8;x<60;x+=12)P+=`<rect x="${x}" y="0" width="6" height="72" fill="${c2}"/>`;break;
  case 2:P=`<rect x="30" y="0" width="30" height="72" fill="${c2}"/>`;break;
  case 3:P=`<polygon points="0,14 14,0 60,46 60,62 46,72" fill="${c2}"/>`;break;
  case 4:for(let y=10;y<72;y+=14)P+=`<rect x="0" y="${y}" width="60" height="7" fill="${c2}"/>`;break;
  case 5:P=`<polygon points="0,30 30,48 60,30 60,42 30,60 0,42" fill="${c2}"/>`;break;
  case 6:P=`<rect x="30" y="0" width="30" height="36" fill="${c2}"/><rect x="0" y="36" width="30" height="36" fill="${c2}"/>`;break}
 const a=esc(String(c.a||'').slice(0,3));const big=String(c.a||'')[0]||'';const stars=c.s>=84?3:c.s>=80?2:c.s>=76?1:0;
 const st=stars?Array.from({length:stars},(_,i)=>{const x=30+(i-(stars-1)/2)*9;return`<path transform="translate(${x} ${sh?-1:1}) scale(.34)" d="M0-10 2.9-3.1 10-3.1 4.3 1.2 6.5 8.1 0 4 -6.5 8.1 -4.3 1.2 -10-3.1 -2.9-3.1Z" fill="#f2c443"/>`}).join(''):'';
 const body=sh?`<clipPath id="${id}"><path d="${sh}"/></clipPath><g clip-path="url(#${id})"><rect width="60" height="72" fill="${c1}"/>${P}</g><path d="${sh}" fill="none" stroke="${dk}" stroke-width="2.6"/>`
  :`<clipPath id="${id}"><circle cx="30" cy="36" r="27"/></clipPath><g clip-path="url(#${id})"><rect width="60" height="72" fill="${c1}"/>${P}</g><circle cx="30" cy="36" r="27" fill="none" stroke="${dk}" stroke-width="2.6"/><circle cx="30" cy="36" r="21.5" fill="none" stroke="${c2}" stroke-width="1.4" opacity=".8"/>`;
 const plate=`<rect x="13" y="${sh?27:28}" width="34" height="17" rx="4" fill="${c1}" stroke="${dk}" stroke-width="1.6"/><text x="30" y="${sh?40:41}" text-anchor="middle" font-family="Saira Condensed,Arial Narrow,sans-serif" font-weight="900" font-size="13.5" fill="${pickInk(c1)}" letter-spacing=".4">${a||esc(big)}</text>`;
 return`<svg viewBox="0 0 60 72" xmlns="http://www.w3.org/2000/svg">${body}${plate}${st?`<g transform="translate(0 ${sh?13:15})">${st}</g>`:''}</svg>`}
function l3Dark(h){h=String(h||'#000').replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h,16)||0;const r=n>>16&255,g=n>>8&255,b=n&255;return(.299*r+.587*g+.114*b)<60}
// escudo: imagem do editor > escudo enviado no Claude > escudo desenhado
{const _shF=shieldHTML;shieldHTML=function(c,size=''){if(!c)return'';if(c.nat||(c.f&&!c.c1))return _shF(c,size);const cc=CLUB[c.id]||c;
  if(cc.img)return`<span class="shield img ${size}" title="${esc(cc.n)}"><img src="${esc(cc.img)}" alt="" loading="lazy"></span>`;
  if(!FICT_IS){const up=typeof CLOUD!=='undefined'&&CLOUD.badges&&CLOUD.badges[c.id];const ab=!up&&c.id&&typeof ASSET_B!=='undefined'&&(ASSET_B[normName(c.id)]||ASSET_B[normName(cc.n)]);
   if(ab)return`<span class="shield img ${size}" title="${esc(cc.n)}"><img src="${ab}" alt="" loading="lazy"></span>`;return _shF(c,size)}
  const up=typeof CLOUD!=='undefined'&&CLOUD.badges&&CLOUD.badges[c.id];const ab=typeof ASSET_B!=='undefined'&&Object.keys(ASSET_B).length;if(up||ab)return _shF(c,size);
  return`<span class="shield img crest ${size}" title="${esc(cc.n)}">${fictCrest(cc)}</span>`}}
// sigla do nome inventado (placar do 3D, tabelas)
{const _mkF=mkAbbr;mkAbbr=function(n){const c=FICT.byName&&FICT.byName[n];return c?c.a:_mkF(n)}}
{const _afF=applyFict;applyFict=function(){_afF();FICT.byName={};for(const id in CLUB)FICT.byName[CLUB[id].n]=CLUB[id]}}
applyFict();
{const st=document.createElement('style');st.textContent='.shield.crest svg{width:100%;height:100%;display:block;overflow:visible}';document.head.appendChild(st)}
// textos guardados antes da versão fictícia (cartas do ranking, ligas no histórico): troca pelos nomes novos
const F_TXT=(typeof FICT_TXT!=='undefined'?FICT_TXT:[]).map(([a,b])=>{try{return[new TextDecoder().decode(Uint8Array.from(atob(a),c=>c.charCodeAt(0))),b]}catch(e){return null}}).filter(Boolean).sort((x,y)=>y[0].length-x[0].length);
function fictText(s){if(typeof s!=='string'||!F_TXT.length)return s;for(const[a,b]of F_TXT)if(s.includes(a))s=s.split(a).join(b);return s}
