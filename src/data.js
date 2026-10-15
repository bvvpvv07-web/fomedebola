// ================== DADOS ==================
const ATTRS=['VEL','FIN','PAS','DRI','DEF','FIS','MEN','REF'];
const ATTR_NAME={VEL:'Velocidade',FIN:'Finalização',PAS:'Passe',DRI:'Drible',DEF:'Defesa',FIS:'Físico',MEN:'Mentalidade',REF:'Reflexos'};
const POS={
 GOL:{n:'Goleiro',w:{REF:.45,MEN:.2,FIS:.15,DEF:.1,PAS:.1},sg:0,sa:.004,peak:30,decl:.55,inj:.09,bola:-14,bw:0,x:50,y:91,info:['Pico ~30 anos','Carreira longa','Bola de Ouro quase impossível','Disputa a Luva de Ouro']},
 ZAG:{n:'Zagueiro',w:{DEF:.4,FIS:.25,MEN:.15,VEL:.1,PAS:.1},sg:.05,sa:.025,peak:28,decl:.8,inj:.17,bola:-8,bw:1.2,x:50,y:79,info:['Pico ~28','Declínio lento','Bola de Ouro muito difícil','Muitos cartões e lesões']},
 LE:{n:'Lateral esquerdo',w:{VEL:.25,DEF:.25,PAS:.2,FIS:.1,DRI:.1,MEN:.1},sg:.03,sa:.1,peak:26,decl:1.1,inj:.16,bola:-8,bw:.8,x:14,y:72,info:['Pico ~26','Declínio rápido','Bola de Ouro muito difícil','Muitas assistências']},
 LD:{n:'Lateral direito',w:{VEL:.25,DEF:.25,PAS:.2,FIS:.1,DRI:.1,MEN:.1},sg:.03,sa:.1,peak:26,decl:1.1,inj:.16,bola:-8,bw:.8,x:86,y:72,info:['Pico ~26','Declínio rápido','Bola de Ouro muito difícil','Muitas assistências']},
 VOL:{n:'Volante',w:{DEF:.3,PAS:.25,FIS:.2,MEN:.2,VEL:.05},sg:.04,sa:.07,peak:28,decl:.8,inj:.17,bola:-6,bw:.9,x:50,y:65,info:['Pico ~28','Declínio lento','Bola de Ouro difícil','Leva muito cartão']},
 ME:{n:'Meia esquerda',w:{VEL:.2,PAS:.25,DRI:.2,MEN:.15,FIS:.1,DEF:.1},sg:.09,sa:.16,peak:27,decl:.95,inj:.15,bola:-1,bw:.7,x:14,y:47,info:['Pico ~27','Corredor pelo lado','Bola de Ouro possível','Muitos cruzamentos']},
 MD:{n:'Meia direita',w:{VEL:.2,PAS:.25,DRI:.2,MEN:.15,FIS:.1,DEF:.1},sg:.09,sa:.16,peak:27,decl:.95,inj:.15,bola:-1,bw:.7,x:86,y:47,info:['Pico ~27','Corredor pelo lado','Bola de Ouro possível','Muitos cruzamentos']},
 MC:{n:'Meio-campo',w:{PAS:.25,MEN:.2,DRI:.15,DEF:.15,FIS:.15,FIN:.1},sg:.08,sa:.12,peak:27,decl:.85,inj:.15,bola:-2,bw:.75,x:50,y:52,info:['Pico ~27','Equilibrado','Bola de Ouro possível','Precisa de tudo um pouco']},
 MEI:{n:'Meia armador',w:{PAS:.35,DRI:.25,MEN:.2,FIN:.15,VEL:.05},sg:.13,sa:.2,peak:27,decl:.9,inj:.14,bola:3,bw:.6,x:50,y:38,info:['Pico ~27','Rei das assistências','Bola de Ouro favorável','Bom batedor de falta']},
 PE:{n:'Ponta esquerda',w:{VEL:.3,DRI:.3,FIN:.15,PAS:.15,MEN:.1},sg:.18,sa:.17,peak:25,decl:1.25,inj:.17,bola:3,bw:.6,x:16,y:23,info:['Pico ~25','Declínio muito rápido','Bola de Ouro favorável','Lesões musculares']},
 PD:{n:'Ponta direita',w:{VEL:.3,DRI:.3,FIN:.15,PAS:.15,MEN:.1},sg:.18,sa:.17,peak:25,decl:1.25,inj:.17,bola:3,bw:.6,x:84,y:23,info:['Pico ~25','Declínio muito rápido','Bola de Ouro favorável','Lesões musculares']},
 SA:{n:'Segundo atacante',w:{FIN:.3,DRI:.2,PAS:.2,VEL:.15,MEN:.15},sg:.22,sa:.15,peak:26,decl:1.0,inj:.15,bola:3,bw:.55,x:50,y:25,info:['Pico ~26','Faz e cria gols','Bola de Ouro favorável','Versátil']},
 ATA:{n:'Centroavante',w:{FIN:.45,FIS:.15,VEL:.15,MEN:.15,DRI:.1},sg:.32,sa:.1,peak:26,decl:1.0,inj:.16,bola:4,bw:.55,x:50,y:11,info:['Pico ~26','Goleador nato','Bola de Ouro favorável','Disputa a Chuteira de Ouro']},
};
const POS_ORDER=['GOL','ZAG','LE','LD','VOL','MC','ME','MD','MEI','PE','PD','SA','ATA'];
const POS_ALIAS={PON:'PD',LAT:'LD'};POS.PON=POS.PD;POS.LAT=POS.LD;
const NEIGH={GOL:[],ZAG:['VOL','LE','LD'],LE:['ZAG','ME','PE'],LD:['ZAG','MD','PD'],VOL:['ZAG','MC'],MC:['VOL','MEI','ME','MD'],ME:['LE','MC','PE'],MD:['LD','MC','PD'],MEI:['MC','SA','PE','PD'],PE:['ME','SA','ATA'],PD:['MD','SA','ATA'],SA:['MEI','ATA','PE','PD'],ATA:['SA','PE','PD']};NEIGH.PON=NEIGH.PD;NEIGH.LAT=NEIGH.LD;
const DIFF={
 amador:{n:'Amador',d:'2 re-sorteios, lesões mais raras',re:2,pot:2,inj:.75,thr:-3,decl:.9},
 pro:{n:'Pro',d:'1 re-sorteio. O jogo como ele é.',re:1,pot:0,inj:1,thr:0,decl:1},
 lenda:{n:'Lenda',d:'Sem re-sorteio. Tudo pesa mais.',re:0,pot:-2,inj:1.25,thr:2,decl:1.1},
};

// Países (copas nacionais, supercopas, vagas continentais)
const COUNTRY={
 BRA:{n:'Brasil',f:'🇧🇷',conf:'SA',lang:'pt',cup:'Copa do Brasil',cupLegs:true,sup:'Supercopa do Brasil',top:'BRA1',slots:{LIB:[1,6],SUD:[7,12]},cupTo:'LIB'},
 ENG:{n:'Inglaterra',f:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',conf:'EU',lang:'en',cup:'FA Cup',lcup:'Carabao Cup',sup:'Community Shield',top:'ENG1',slots:{UCL:[1,4],UEL:[5,5],UECL:[6,6]},cupTo:'UEL'},
 ESP:{n:'Espanha',f:'🇪🇸',conf:'EU',lang:'es',cup:'Copa del Rey',sup:'Supercopa de España',top:'ESP1',slots:{UCL:[1,4],UEL:[5,5],UECL:[6,6]},cupTo:'UEL'},
 ITA:{n:'Itália',f:'🇮🇹',conf:'EU',lang:'it',cup:'Coppa Italia',sup:'Supercoppa Italiana',top:'ITA1',slots:{UCL:[1,4],UEL:[5,5],UECL:[6,6]},cupTo:'UEL'},
 GER:{n:'Alemanha',f:'🇩🇪',conf:'EU',lang:'de',cup:'DFB-Pokal',sup:'DFL-Supercup',top:'GER1',slots:{UCL:[1,4],UEL:[5,5],UECL:[6,6]},cupTo:'UEL'},
 FRA:{n:'França',f:'🇫🇷',conf:'EU',lang:'fr',cup:'Coupe de France',sup:'Trophée des Champions',top:'FRA1',slots:{UCL:[1,3],UEL:[4,4],UECL:[5,5]},cupTo:'UEL'},
 POR:{n:'Portugal',f:'🇵🇹',conf:'EU',lang:'pt',cup:'Taça de Portugal',lcup:'Taça da Liga',sup:'Supertaça Cândido de Oliveira',top:'POR1',slots:{UCL:[1,2],UEL:[3,3],UECL:[4,4]},cupTo:'UEL'},
 NED:{n:'Holanda',f:'🇳🇱',conf:'EU',lang:'nl',cup:'KNVB Beker',sup:'Johan Cruijff Schaal',top:'NED1',slots:{UCL:[1,2],UEL:[3,3],UECL:[4,4]},cupTo:'UEL'},
 ARG:{n:'Argentina',f:'🇦🇷',conf:'SA',lang:'es',cup:'Copa Argentina',sup:'Trofeo de Campeones',top:'ARG1',slots:{LIB:[1,4],SUD:[5,10]},cupTo:'LIB'},
 USA:{n:'Estados Unidos',f:'🇺🇸',conf:'NA',lang:'en',cup:'US Open Cup',sup:null,top:'USA1',slots:{CCC:[1,4]},cupTo:'CCC'},
 KSA:{n:'Arábia Saudita',f:'🇸🇦',conf:'AS',lang:'ar',cup:"King's Cup",sup:'Supercopa Saudita',top:'KSA1',slots:{ACL:[1,3]},cupTo:'ACL'},
};
// Ligas. rr=1: turno único. down/up: rebaixados/promovidos
const LG={
 BRA1:{n:'Brasileirão Série A',c:'BRA',tier:1,down:4,next:'BRA2',wm:.42,lp:5,bp:-9},
 BRA2:{n:'Brasileirão Série B',c:'BRA',tier:2,down:4,prev:'BRA1',next:'BRA3',wm:.13,lp:2,bp:-30},
 BRA3:{n:'Brasileirão Série C',c:'BRA',tier:3,down:4,prev:'BRA2',next:'BRA4',wm:.06,lp:1,bp:-40},
 BRA4:{n:'Brasileirão Série D',c:'BRA',tier:4,down:0,prev:'BRA3',wm:.03,lp:.5,bp:-50},
 ENG1:{n:'Premier League',c:'ENG',tier:1,down:3,next:'ENG2',wm:1,lp:9,bp:0},
 ENG2:{n:'Championship',c:'ENG',tier:2,down:0,prev:'ENG1',wm:.25,lp:2,bp:-25},
 ESP1:{n:'La Liga',c:'ESP',tier:1,down:3,next:'ESP2',wm:.85,lp:8,bp:0},
 ESP2:{n:'LaLiga Hypermotion',c:'ESP',tier:2,down:0,prev:'ESP1',wm:.2,lp:2,bp:-25},
 ITA1:{n:'Serie A',c:'ITA',tier:1,down:3,next:'ITA2',wm:.7,lp:8,bp:-1},
 ITA2:{n:'Serie B',c:'ITA',tier:2,down:0,prev:'ITA1',wm:.18,lp:2,bp:-25},
 GER1:{n:'Bundesliga',c:'GER',tier:1,down:2,next:'GER2',wm:.75,lp:8,bp:-1},
 GER2:{n:'2. Bundesliga',c:'GER',tier:2,down:0,prev:'GER1',wm:.2,lp:2,bp:-25},
 FRA1:{n:'Ligue 1',c:'FRA',tier:1,down:2,next:'FRA2',wm:.62,lp:6,bp:-3},
 FRA2:{n:'Ligue 2',c:'FRA',tier:2,down:0,prev:'FRA1',wm:.15,lp:2,bp:-25},
 POR1:{n:'Liga Portugal',c:'POR',tier:1,down:2,next:'POR2',wm:.32,lp:5,bp:-7},
 POR2:{n:'Liga Portugal 2',c:'POR',tier:2,down:0,prev:'POR1',wm:.07,lp:1,bp:-30},
 NED1:{n:'Eredivisie',c:'NED',tier:1,down:2,next:'NED2',wm:.32,lp:5,bp:-7},
 NED2:{n:'Eerste Divisie',c:'NED',tier:2,down:0,prev:'NED1',wm:.07,lp:1,bp:-30},
 ARG1:{n:'Liga Profesional',c:'ARG',tier:1,down:2,next:'ARG2',rr:1,wm:.24,lp:5,bp:-11},
 ARG2:{n:'Primera Nacional',c:'ARG',tier:2,down:0,prev:'ARG1',wm:.05,lp:1,bp:-35},
 USA1:{n:'MLS',c:'USA',tier:1,down:0,rr:1,po:8,wm:.55,lp:3,bp:-16},
 KSA1:{n:'Saudi Pro League',c:'KSA',tier:1,down:3,next:'KSA2',wm:1.6,lp:3,bp:-16},
 KSA2:{n:'Saudi First Division',c:'KSA',tier:2,down:0,prev:'KSA1',wm:.2,lp:1,bp:-35},
};
// Nome|força|cor1|cor2|UF
const CLUB_SRC={
BRA1:`Palmeiras|80|#006437|#fff|SP;Flamengo|80|#c8102e|#151515|RJ;Botafogo|76|#151515|#fff|RJ;Cruzeiro|76|#0033a0|#fff|MG;Fluminense|75|#7a1631|#00613c|RJ;Atlético-MG|75|#151515|#fff|MG;Corinthians|74|#f2f2f2|#151515|SP;São Paulo|74|#e30613|#151515|SP;Internacional|74|#e30613|#fff|RS;Bahia|74|#0a3d91|#e30613|BA;Grêmio|73|#0d80bf|#151515|RS;Bragantino|72|#fff|#d6001c|SP;Vasco|72|#151515|#fff|RJ;Santos|71|#fff|#151515|SP;Mirassol|70|#ffd200|#00843d|SP;Athletico-PR|70|#c8102e|#151515|PR;Coritiba|68|#00543d|#fff|PR;Vitória|68|#e30613|#151515|BA;Remo|67|#0a2a6b|#fff|PA;Chapecoense|66|#00843d|#fff|SC`,
BRA2:`Fortaleza|68|#0a3d91|#e30613|CE;Ceará|67|#151515|#fff|CE;Sport|67|#e30613|#151515|PE;Juventude|65|#00843d|#fff|RS;Criciúma|64|#ffd200|#151515|SC;Goiás|64|#00843d|#fff|GO;Novorizontino|64|#ffd200|#151515|SP;Cuiabá|64|#00843d|#ffd200|MT;América-MG|64|#00843d|#151515|MG;Avaí|63|#0a3d91|#fff|SC;Atlético-GO|63|#e30613|#151515|GO;CRB|62|#e30613|#fff|AL;Operário-PR|62|#151515|#fff|PR;Vila Nova|62|#e30613|#fff|GO;Ponte Preta|62|#151515|#fff|SP;Londrina|61|#4fa3e0|#fff|PR;Náutico|61|#e30613|#fff|PE;Athletic-MG|60|#151515|#fff|MG;Botafogo-SP|60|#e30613|#fff|SP;São Bernardo|60|#ffd200|#151515|SP`,
BRA3:`Guarani|60|#00843d|#fff|SP;Paysandu|60|#4fa3e0|#fff|PA;Ferroviária|59|#7a1631|#fff|SP;Figueirense|59|#151515|#fff|SC;Amazonas|58|#ffd200|#151515|AM;Brusque|58|#ffd200|#0a3d91|SC;Ituano|58|#e30613|#151515|SP;Santa Cruz|58|#e30613|#151515|PE;Botafogo-PB|57|#151515|#fff|PB;Caxias|57|#7a1631|#fff|RS;Inter de Limeira|57|#151515|#fff|SP;Volta Redonda|57|#ffd200|#151515|RJ;Anápolis|56|#e30613|#fff|GO;Confiança|56|#0a3d91|#fff|SE;Floresta|56|#00843d|#fff|CE;Maringá|56|#0a3d91|#fff|PR;Ypiranga|56|#00843d|#fff|RS;Barra|55|#0a3d91|#fff|SC;Itabaiana|55|#0a3d91|#fff|SE;Maranhão|54|#e30613|#0a3d91|MA`,
BRA4:`Portuguesa|55|#e30613|#00843d|SP;CSA|55|#0a3d91|#fff|AL;ABC|54|#151515|#fff|RN;América-RN|54|#e30613|#fff|RN;Sampaio Corrêa|54|#e30613|#ffd200|MA;Joinville|54|#e30613|#151515|SC;Tombense|53|#e30613|#fff|MG;Nova Iguaçu|53|#ff8c00|#151515|RJ;Retrô|53|#ffd200|#151515|PE;Manaus|52|#ffd200|#151515|AM;São José-RS|52|#0a3d91|#fff|RS;Brasil de Pelotas|52|#e30613|#151515|RS;Treze|52|#151515|#fff|PB;Campinense|52|#e30613|#151515|PB;Água Santa|52|#0a3d91|#e30613|SP;Velo Clube|52|#e30613|#fff|SP;Ferroviário|52|#151515|#e30613|CE;Aparecidense|51|#0a3d91|#fff|GO;Central|51|#151515|#fff|PE;Juazeirense|51|#e30613|#fff|BA`,
ENG1:`Liverpool|88|#c8102e|#f6eb61;Arsenal|88|#ef0107|#fff;Manchester City|87|#6cabdd|#1c2c5b;Chelsea|85|#034694|#fff;Newcastle|82|#151515|#fff;Manchester United|81|#da291c|#151515;Tottenham|81|#fff|#132257;Aston Villa|81|#670e36|#95bfe5;Crystal Palace|79|#1b458f|#c4122e;Nottingham Forest|78|#dd0000|#fff;Brighton|78|#0057b8|#fff;Bournemouth|77|#da291c|#151515;Brentford|76|#e30613|#fff;Fulham|76|#fff|#151515;Everton|76|#003399|#fff;West Ham|76|#7a263a|#1bb1e7;Wolves|75|#fdb913|#151515;Leeds|74|#fff|#1d428a;Sunderland|74|#eb172b|#fff;Burnley|73|#6c1d45|#99d6ea`,
ENG2:`Leicester|72|#003090|#fdbe11;Ipswich|72|#0044a9|#fff;Southampton|72|#d71920|#fff;Sheffield United|70|#ee2737|#fff;Middlesbrough|70|#e30613|#fff;Coventry|70|#6cabdd|#fff;Bristol City|68|#e30613|#fff;West Brom|68|#122f67|#fff;Norwich|68|#fff200|#00a650;Birmingham|68|#0000ff|#fff;Wrexham|68|#e30613|#fff;Millwall|67|#001d5e|#fff;Blackburn|67|#009ee0|#fff;Swansea|67|#fff|#151515;Hull City|67|#f5a12d|#151515;Watford|67|#fbee23|#ed2127;Stoke City|67|#e03a3e|#fff;Preston|66|#fff|#151515;QPR|66|#1d5ba4|#fff;Derby County|66|#fff|#151515;Portsmouth|66|#001489|#fff;Charlton|65|#d4021d|#fff;Oxford United|64|#fff200|#151515;Sheffield Wednesday|64|#0e00f7|#fff`,
ESP1:`Real Madrid|89|#fff|#b8952a;Barcelona|88|#a50044|#004d98;Atlético de Madrid|84|#cb3524|#fff;Villarreal|81|#ffe667|#005187;Athletic Club|80|#ee2523|#fff;Real Betis|79|#00954c|#fff;Real Sociedad|78|#0067b1|#fff;Celta|76|#8ac3ee|#c8102e;Rayo Vallecano|75|#fff|#e30613;Osasuna|75|#d91a21|#0a346f;Valencia|75|#fff|#151515;Girona|75|#d6001c|#fff;Sevilla|75|#fff|#d81920;Mallorca|74|#e20613|#151515;Getafe|74|#005999|#fff;Espanyol|74|#007fc8|#fff;Alavés|73|#0761af|#fff;Levante|72|#004d98|#a50044;Elche|72|#fff|#05642c;Real Oviedo|71|#0a3d91|#fff`,
ESP2:`Las Palmas|70|#ffe400|#0a3d91;Valladolid|69|#921b88|#fff;Leganés|69|#fff|#0a3d91;Deportivo La Coruña|69|#0a3d91|#fff;Almería|69|#e30613|#fff;Racing Santander|68|#fff|#00843d;Granada|68|#e30613|#fff;Sporting Gijón|67|#e30613|#fff;Málaga|67|#0a3d91|#fff;Cádiz|67|#ffe400|#0a3d91;Zaragoza|66|#fff|#0a3d91;Eibar|66|#a50044|#0a3d91;Castellón|66|#151515|#fff;Burgos|65|#fff|#151515;Huesca|65|#0a3d91|#a50044;Albacete|65|#fff|#151515;Córdoba|65|#fff|#00843d;Andorra|65|#0a3d91|#e30613;Mirandés|64|#e30613|#151515;Ceuta|63|#fff|#151515;Cultural Leonesa|63|#fff|#151515;Real Sociedad B|62|#0067b1|#fff`,
ITA1:`Inter de Milão|86|#010e80|#151515;Napoli|85|#12a0d7|#fff;Milan|83|#fb090b|#151515;Juventus|83|#fff|#151515;Atalanta|81|#1e71b8|#151515;Roma|81|#8e1f2f|#f0bc42;Bologna|79|#1a2f48|#a21c26;Como|79|#003d7c|#fff;Lazio|78|#87d8f7|#fff;Fiorentina|77|#482e92|#fff;Torino|75|#881f19|#fff;Udinese|74|#151515|#fff;Genoa|74|#a01c34|#0a2b5b;Sassuolo|74|#00a650|#151515;Cagliari|73|#a21c26|#0a2b5b;Parma|73|#ffe400|#0a2b5b;Lecce|72|#ffe400|#e30613;Verona|72|#0a2b5b|#ffe400;Cremonese|72|#a21c26|#9a9a9a;Pisa|71|#151515|#0a3d91`,
ITA2:`Monza|70|#e30613|#fff;Palermo|70|#f5a9c9|#151515;Empoli|69|#0a3d91|#fff;Venezia|69|#151515|#ff8c00;Sampdoria|67|#0a3d91|#fff;Spezia|67|#fff|#151515;Bari|66|#e30613|#fff;Modena|66|#ffe400|#0a3d91;Frosinone|66|#ffe400|#0a3d91;Cesena|65|#fff|#151515;Catanzaro|65|#ffe400|#e30613;Südtirol|64|#e30613|#fff;Juve Stabia|64|#ffe400|#0a3d91;Reggiana|64|#7a1631|#fff;Carrarese|63|#ffe400|#0a3d91;Mantova|63|#e30613|#fff;Padova|63|#fff|#e30613;Pescara|63|#0aa0e0|#fff;Virtus Entella|62|#0aa0e0|#fff;Avellino|62|#00843d|#fff`,
GER1:`Bayern de Munique|88|#dc052d|#fff;Borussia Dortmund|84|#fde100|#151515;Bayer Leverkusen|82|#e32221|#151515;RB Leipzig|81|#dd0741|#fff;Stuttgart|80|#fff|#e32219;Eintracht Frankfurt|80|#e1000f|#151515;Freiburg|78|#151515|#e30613;Hoffenheim|78|#1961b5|#fff;Wolfsburg|76|#65b32e|#fff;Borussia M'gladbach|76|#151515|#fff;Mainz|76|#c3141e|#fff;Union Berlin|75|#e30613|#fff;Werder Bremen|75|#1d9053|#fff;Augsburg|74|#ba3733|#00843d;Hamburger SV|74|#0a3d91|#fff;Köln|73|#fff|#e30613;Heidenheim|72|#e30613|#0a3d91;St. Pauli|72|#6b4226|#fff`,
GER2:`Holstein Kiel|70|#0a3d91|#fff;Bochum|70|#005ca9|#fff;Schalke 04|70|#004d9d|#fff;Hertha BSC|69|#005ca9|#fff;Hannover 96|68|#151515|#00843d;Kaiserslautern|68|#e30613|#fff;Nürnberg|67|#9e1a1a|#151515;Fortuna Düsseldorf|67|#e30613|#fff;Paderborn|67|#0a3d91|#151515;Darmstadt|67|#0a3d91|#fff;Karlsruhe|66|#0a3d91|#fff;Elversberg|66|#151515|#fff;Magdeburg|65|#0a3d91|#fff;Greuther Fürth|65|#00843d|#fff;Arminia Bielefeld|65|#151515|#0a3d91;Eintracht Braunschweig|64|#ffe400|#0a3d91;Dynamo Dresden|64|#ffe400|#151515;Preußen Münster|63|#00843d|#151515`,
FRA1:`Paris Saint-Germain|88|#004170|#da291c;Marseille|81|#2faee0|#fff;Monaco|80|#e51b22|#fff;Lille|79|#e01e13|#20325f;Lyon|79|#fff|#da0812;Lens|78|#ffe600|#e30613;Nice|77|#c8102e|#151515;Strasbourg|77|#0a3d91|#fff;Rennes|77|#e30613|#151515;Brest|75|#e30613|#fff;Toulouse|74|#6c2b8d|#fff;Nantes|73|#ffe400|#00843d;Auxerre|72|#fff|#0a3d91;Paris FC|72|#0a2b5b|#fff;Angers|71|#151515|#fff;Le Havre|71|#0aa0e0|#0a2b5b;Lorient|71|#ff8c00|#151515;Metz|70|#7a1631|#fff`,
FRA2:`Saint-Étienne|70|#00843d|#fff;Reims|70|#e30613|#fff;Montpellier|69|#0a2b5b|#ff8c00;Guingamp|66|#e30613|#151515;Troyes|66|#0a3d91|#fff;Amiens|65|#fff|#151515;Clermont|65|#e30613|#0a3d91;Dunkerque|65|#0a3d91|#fff;Annecy|64|#e30613|#fff;Laval|64|#ff8c00|#151515;Pau|64|#ffe400|#0a3d91;Grenoble|64|#0a3d91|#fff;Red Star|64|#00843d|#fff;Rodez|64|#e30613|#ffe400;Bastia|64|#0a3d91|#fff;Le Mans|63|#e30613|#ffe400;Nancy|63|#e30613|#fff;Boulogne|62|#e30613|#151515`,
POR1:`Sporting|81|#008057|#fff;Benfica|81|#e83030|#fff;Porto|81|#003893|#fff;Braga|77|#e30613|#fff;Vitória SC|73|#fff|#151515;Famalicão|72|#0a3d91|#fff;Santa Clara|71|#e30613|#fff;Gil Vicente|71|#e30613|#0a3d91;Estoril|70|#ffe400|#0a3d91;Casa Pia|69|#151515|#fff;Moreirense|69|#00843d|#fff;Rio Ave|69|#00843d|#fff;Arouca|69|#ffe400|#0a3d91;Nacional|68|#151515|#fff;Estrela Amadora|67|#e30613|#00843d;AVS|67|#e30613|#fff;Alverca|67|#e30613|#fff;Tondela|66|#ffe400|#00843d`,
POR2:`Farense|64|#151515|#fff;Marítimo|64|#00843d|#e30613;Chaves|63|#e30613|#0a3d91;Vizela|63|#0a3d91|#fff;Paços de Ferreira|63|#ffe400|#151515;Portimonense|63|#151515|#fff;Feirense|62|#0a3d91|#fff;Leixões|62|#e30613|#fff;Académico de Viseu|62|#151515|#fff;Torreense|62|#0a3d91|#fff;Benfica B|62|#e83030|#fff;Porto B|62|#003893|#fff;Sporting B|62|#008057|#fff;União de Leiria|62|#e30613|#fff;Oliveirense|61|#151515|#e30613;Penafiel|61|#e30613|#151515;Felgueiras|60|#e30613|#fff;Lusitânia Lourosa|60|#e30613|#fff`,
NED1:`PSV|80|#ed1c24|#fff;Feyenoord|79|#e30613|#fff;Ajax|78|#fff|#d2122e;AZ Alkmaar|76|#e30613|#fff;Twente|74|#e30613|#fff;Utrecht|74|#e30613|#fff;NEC|72|#e30613|#00843d;Go Ahead Eagles|71|#e30613|#ffe400;Heerenveen|71|#0a3d91|#fff;Sparta Rotterdam|69|#e30613|#fff;Groningen|69|#00843d|#fff;Fortuna Sittard|69|#ffe400|#00843d;PEC Zwolle|68|#0a3d91|#fff;Heracles|68|#fff|#151515;NAC Breda|68|#ffe400|#151515;Excelsior|67|#e30613|#151515;Telstar|66|#fff|#e30613;Volendam|66|#ff8c00|#fff`,
NED2:`Willem II|65|#e30613|#0a3d91;RKC Waalwijk|65|#ffe400|#0a3d91;Almere City|65|#e30613|#151515;ADO Den Haag|65|#ffe400|#00843d;Cambuur|64|#ffe400|#0a3d91;De Graafschap|63|#0a3d91|#fff;Roda JC|63|#ffe400|#151515;Emmen|62|#e30613|#fff;VVV-Venlo|62|#ffe400|#151515;Den Bosch|61|#e30613|#fff;Dordrecht|61|#e30613|#fff;MVV|61|#e30613|#fff;Helmond Sport|60|#ff8c00|#151515;TOP Oss|60|#e30613|#fff;FC Eindhoven|60|#0a3d91|#fff;Jong Ajax|60|#fff|#d2122e;Jong PSV|60|#ed1c24|#fff;Jong AZ|59|#e30613|#fff`,
ARG1:`River Plate|77|#fff|#e30613;Boca Juniors|76|#003c82|#f3b229;Racing|75|#6cace4|#fff;Estudiantes|73|#e30613|#fff;Independiente|72|#e30613|#fff;Vélez Sarsfield|72|#fff|#0a3d91;Talleres|72|#0a3d91|#fff;Rosario Central|72|#ffe400|#0a3d91;Lanús|72|#7a1631|#fff;San Lorenzo|71|#0a3d91|#e30613;Argentinos Juniors|71|#e30613|#fff;Newell's Old Boys|70|#151515|#e30613;Huracán|70|#fff|#e30613;Godoy Cruz|69|#0a3d91|#fff;Belgrano|69|#4fa3e0|#fff;Defensa y Justicia|69|#ffe400|#00843d;Tigre|68|#0a3d91|#e30613;Platense|68|#fff|#6b4226;Banfield|67|#00843d|#fff;Gimnasia La Plata|67|#fff|#0a2b5b;Unión|67|#e30613|#fff;Independiente Rivadavia|67|#0a3d91|#fff;Instituto|66|#e30613|#fff;Barracas Central|66|#e30613|#fff;Central Córdoba|66|#151515|#fff;Atlético Tucumán|66|#4fa3e0|#fff;Sarmiento|65|#00843d|#fff;Deportivo Riestra|64|#151515|#fff;San Martín de San Juan|64|#00843d|#151515;Aldosivi|64|#ffe400|#00843d`,
ARG2:`Colón|63|#e30613|#151515;Quilmes|62|#fff|#0a3d91;Ferro Carril Oeste|62|#00843d|#fff;Gimnasia de Mendoza|62|#151515|#fff;San Martín de Tucumán|62|#e30613|#fff;Chacarita|61|#e30613|#151515;Estudiantes de Río Cuarto|61|#0a3d91|#fff;Almirante Brown|60|#ffe400|#151515;Morón|60|#e30613|#fff;All Boys|60|#fff|#151515;Atlanta|60|#ffe400|#0a3d91;Temperley|60|#4fa3e0|#fff;Agropecuario|59|#00843d|#fff;Deportivo Madryn|59|#151515|#ffe400;Chaco For Ever|58|#151515|#fff;Tristán Suárez|58|#ffe400|#0a3d91`,
USA1:`Inter Miami|74|#f7b5cd|#231f20;LAFC|74|#151515|#c39e6d;Columbus Crew|72|#fedd00|#151515;Seattle Sounders|72|#5d9741|#236192;Philadelphia Union|72|#071b2c|#b19b69;FC Cincinnati|72|#f05323|#263b80;LA Galaxy|71|#00245d|#ffd200;NYCFC|71|#6cace4|#f15524;Orlando City|71|#633492|#fff;Vancouver Whitecaps|71|#00245e|#9dc2ea;NY Red Bulls|70|#ba0c2f|#fff;Atlanta United|70|#80000a|#221f1f;Charlotte FC|70|#1a85c8|#151515;Nashville SC|70|#ece83a|#1f1646;Minnesota United|70|#8cd2f4|#231f20;San Diego FC|70|#151515|#ff4f00;Chicago Fire|69|#7ccdef|#ff0000;Austin FC|69|#00b140|#151515;FC Dallas|69|#e81f3e|#2a4076;Toronto FC|68|#b81137|#fff;New England Revolution|68|#0a2240|#ce0e2d;Houston Dynamo|68|#ff6b00|#101820;Sporting Kansas City|68|#93b1d7|#002f65;Real Salt Lake|68|#b30838|#013a81;Colorado Rapids|68|#960a2c|#9cc2ea;Portland Timbers|68|#00482b|#d69a00;San Jose Earthquakes|68|#0067b1|#151515;CF Montréal|67|#151515|#0033a1;DC United|67|#151515|#ef3e42;St. Louis City|67|#dd004a|#0a1e2c`,
KSA1:`Al-Hilal|80|#005fbc|#fff;Al-Nassr|79|#ffd200|#0033a0;Al-Ahli|78|#00843d|#fff;Al-Ittihad|77|#ffd200|#151515;Al-Qadsiah|75|#e30613|#ffd200;Al-Ettifaq|72|#00843d|#e30613;Al-Shabab|72|#fff|#151515;Al-Taawoun|71|#ffe400|#151515;Al-Fateh|69|#0a3d91|#fff;Al-Khaleej|68|#ffe400|#00843d;Al-Fayha|68|#ff8c00|#0a3d91;Al-Riyadh|67|#e30613|#151515;Damac|67|#e30613|#ffe400;Al-Kholood|66|#e30613|#fff;Al-Okhdood|66|#0a3d91|#fff;Al-Hazem|66|#e30613|#fff;NEOM|66|#151515|#c39e6d;Al-Najma|64|#e30613|#fff`,
KSA2:`Al-Wehda|64|#e30613|#fff;Al-Raed|63|#e30613|#151515;Al-Orobah|62|#00843d|#fff;Abha|62|#00843d|#ffe400;Al-Tai|61|#151515|#ffe400;Al-Faisaly|61|#ff8c00|#151515;Al-Batin|60|#0a3d91|#fff;Al-Jabalain|60|#e30613|#fff;Al-Adalah|60|#00843d|#fff;Jeddah|60|#0a3d91|#fff;Al-Arabi|59|#e30613|#fff;Al-Jandal|59|#ffe400|#00843d`,
};
// Clubs fora das ligas jogáveis (só aparecem em torneios continentais/mundiais)
const EXT_SRC={
 NA:`Club América|75|#ffe400|#0a2b5b;Monterrey|75|#0a2b5b|#fff;Tigres|75|#ffd200|#0a3d91;Toluca|74|#e30613|#fff;Cruz Azul|73|#0a3d91|#fff;Pachuca|72|#fff|#0a3d91`,
 AS:`Al-Sadd|71|#fff|#151515;Al-Ain|71|#7b2c8f|#fff;Ulsan HD|70|#0a3d91|#ffd200;Vissel Kobe|70|#a50034|#151515;Shanghai Port|70|#e30613|#fff;Kawasaki Frontale|69|#4fa3e0|#151515;Persepolis|68|#e30613|#fff;Buriram United|67|#0a3d91|#ff8c00`,
 AF:`Al Ahly|73|#e30613|#fff;Pyramids|71|#0a2b5b|#fff;Mamelodi Sundowns|70|#ffe400|#0a3d91;Espérance de Tunis|69|#e30613|#ffe400;Wydad|68|#e30613|#fff`,
 OC:`Auckland City|56|#0a3d91|#fff`,
};
const ABBR={'Manchester City':'MCI','Manchester United':'MUN','Real Madrid':'RMA','Atlético de Madrid':'ATM','Atlético-MG':'CAM','Athletico-PR':'CAP','São Paulo':'SPFC','Paris Saint-Germain':'PSG','Bayern de Munique':'FCB','Inter de Milão':'INT','Bayer Leverkusen':'B04','Borussia Dortmund':'BVB','RB Leipzig':'RBL','Aston Villa':'AVL','Nottingham Forest':'NFO','Crystal Palace':'CRY','West Ham':'WHU','Real Sociedad':'RSO','Real Betis':'BET','Athletic Club':'ATH','Inter Miami':'MIA','LA Galaxy':'LAG','Boca Juniors':'BOC','River Plate':'RIV','Eintracht Frankfurt':'SGE','Vitória SC':'VSC','Botafogo-SP':'BFC','América-MG':'AMG','Ponte Preta':'PON','Vila Nova':'VNO','Operário-PR':'OPE',"Borussia M'gladbach":'BMG','AZ Alkmaar':'AZ','NY Red Bulls':'NYR','Seattle Sounders':'SEA','Columbus Crew':'CLB','Vélez Sarsfield':'VEL','Corinthians':'SCCP','Palmeiras':'SEP','Flamengo':'FLA','Fluminense':'FLU','Internacional':'SCI','Grêmio':'GRE','Cruzeiro':'CRU','Botafogo':'BOT','Bragantino':'RBB','Novorizontino':'NOV','Atlético-GO':'ACG','Athletic-MG':'ATC','São Bernardo':'SBE','Inter de Limeira':'ILI','Botafogo-PB':'BPB','Santa Cruz':'STA','Volta Redonda':'VRE','América-RN':'AMR','Sampaio Corrêa':'SAM','São José-RS':'SJO','Brasil de Pelotas':'BRP','Nova Iguaçu':'NIG','Água Santa':'AGS','Velo Clube':'VEL','Sheffield United':'SHU','Sheffield Wednesday':'SHW','West Brom':'WBA','Hull City':'HUL','Stoke City':'STK','Derby County':'DER','Oxford United':'OXF','Bristol City':'BRC','Las Palmas':'UDL','Deportivo La Coruña':'DEP','Racing Santander':'RAC','Sporting Gijón':'SPG','Real Sociedad B':'RSB','Cultural Leonesa':'CUL','Rayo Vallecano':'RAY','Real Oviedo':'OVI','Juve Stabia':'JST','Virtus Entella':'ENT','Union Berlin':'FCU','Werder Bremen':'SVW','Hamburger SV':'HSV','St. Pauli':'STP','Holstein Kiel':'KSV','Schalke 04':'S04','Hertha BSC':'BSC','Hannover 96':'H96','Fortuna Düsseldorf':'F95','Greuther Fürth':'SGF','Arminia Bielefeld':'DSC','Eintracht Braunschweig':'EBS','Dynamo Dresden':'SGD','Preußen Münster':'SCP','Paris FC':'PFC','Le Havre':'HAC','Saint-Étienne':'ASSE','Red Star':'RSF','Le Mans':'LMA','Santa Clara':'SCL','Gil Vicente':'GIL','Casa Pia':'CPA','Rio Ave':'RAV','Estrela Amadora':'EST','Paços de Ferreira':'PAC','Académico de Viseu':'ACV','Benfica B':'SLB','Porto B':'FCP','Sporting B':'SCP','União de Leiria':'UDL','Lusitânia Lourosa':'LUS','Go Ahead Eagles':'GAE','Sparta Rotterdam':'SPA','Fortuna Sittard':'FOR','PEC Zwolle':'PEC','NAC Breda':'NAC','Willem II':'WIL','RKC Waalwijk':'RKC','Almere City':'ALM','ADO Den Haag':'ADO','De Graafschap':'DGR','Roda JC':'RJC','VVV-Venlo':'VVV','Den Bosch':'DBO','Helmond Sport':'HEL','TOP Oss':'TOP','FC Eindhoven':'FCE','Jong Ajax':'JAJ','Jong PSV':'JPS','Jong AZ':'JAZ','Rosario Central':'CEN',"Newell's Old Boys":'NOB','San Lorenzo':'SLO','Argentinos Juniors':'ARJ','Godoy Cruz':'GOD','Defensa y Justicia':'DyJ','Gimnasia La Plata':'GLP','Independiente Rivadavia':'IRV','Barracas Central':'BAR','Central Córdoba':'CCO','Atlético Tucumán':'ATU','Deportivo Riestra':'RIE','San Martín de San Juan':'SMJ','Ferro Carril Oeste':'FER','Gimnasia de Mendoza':'GIM','San Martín de Tucumán':'SMT','Estudiantes de Río Cuarto':'ERC','Almirante Brown':'ALB','All Boys':'ALL','Deportivo Madryn':'MAD','Chaco For Ever':'CFE','Tristán Suárez':'TRS','Philadelphia Union':'PHI','FC Cincinnati':'CIN','Orlando City':'ORL','Vancouver Whitecaps':'VAN','Atlanta United':'ATL','Charlotte FC':'CLT','Nashville SC':'NSH','Minnesota United':'MIN','San Diego FC':'SD','Chicago Fire':'CHI','Austin FC':'ATX','FC Dallas':'DAL','Toronto FC':'TOR','New England Revolution':'NE','Houston Dynamo':'HOU','Sporting Kansas City':'SKC','Real Salt Lake':'RSL','Colorado Rapids':'COL','Portland Timbers':'POR','San Jose Earthquakes':'SJ','CF Montréal':'MTL','DC United':'DC','St. Louis City':'STL','Al-Hilal':'HIL','Al-Nassr':'NAS','Al-Ittihad':'ITT','Al-Ahli':'AHL','Al-Qadsiah':'QAD','Al-Ettifaq':'ETT','Al-Shabab':'SHA','Al-Taawoun':'TAA','Al-Fateh':'FAT','Al-Khaleej':'KHA','Al-Fayha':'FAY','Al-Riyadh':'RIY','Al-Kholood':'KHO','Al-Okhdood':'OKH','Al-Hazem':'HAZ','Al-Najma':'NAJ','Al-Wehda':'WEH','Al-Raed':'RAE','Al-Orobah':'ORO','Al-Tai':'TAI','Al-Faisaly':'FAI','Al-Batin':'BAT','Al-Jabalain':'JAB','Al-Adalah':'ADA','Al-Arabi':'ARB','Al-Jandal':'JAN','Club América':'AME','Al-Sadd':'SAD','Al-Ain':'AIN','Ulsan HD':'ULS','Vissel Kobe':'VIS','Shanghai Port':'SHP','Kawasaki Frontale':'KAW','Buriram United':'BUR','Al Ahly':'AHY','Mamelodi Sundowns':'SUN','Espérance de Tunis':'EST','Auckland City':'AUC','Cruz Azul':'CAZ'};

const UF_EST={SP:'Paulistão',RJ:'Campeonato Carioca',MG:'Campeonato Mineiro',RS:'Campeonato Gaúcho',PR:'Campeonato Paranaense',BA:'Campeonato Baiano',SC:'Campeonato Catarinense',PE:'Campeonato Pernambucano',CE:'Campeonato Cearense',GO:'Campeonato Goiano',PA:'Campeonato Paraense',AL:'Campeonato Alagoano',RN:'Campeonato Potiguar',PB:'Campeonato Paraibano',MA:'Campeonato Maranhense',SE:'Campeonato Sergipano',MT:'Campeonato Mato-Grossense',AM:'Campeonato Amazonense'};

// Seleções jogáveis
const NATS={
 BRA:{n:'Brasil',f:'🇧🇷',s:86,c:'SA',lang:'pt',home:'BRA'},
 ARG:{n:'Argentina',f:'🇦🇷',s:87,c:'SA',lang:'es',home:'ARG'},
 URU:{n:'Uruguai',f:'🇺🇾',s:81,c:'SA',lang:'es',home:'ARG'},
 COL:{n:'Colômbia',f:'🇨🇴',s:81,c:'SA',lang:'es',home:'ARG'},
 FRA:{n:'França',f:'🇫🇷',s:88,c:'EU',lang:'fr',home:'FRA'},
 ESP:{n:'Espanha',f:'🇪🇸',s:88,c:'EU',lang:'es',home:'ESP'},
 ENG:{n:'Inglaterra',f:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',s:87,c:'EU',lang:'en',home:'ENG'},
 POR:{n:'Portugal',f:'🇵🇹',s:86,c:'EU',lang:'pt',home:'POR'},
 GER:{n:'Alemanha',f:'🇩🇪',s:85,c:'EU',lang:'de',home:'GER'},
 NED:{n:'Holanda',f:'🇳🇱',s:83,c:'EU',lang:'nl',home:'NED'},
 ITA:{n:'Itália',f:'🇮🇹',s:83,c:'EU',lang:'it',home:'ITA'},
 BEL:{n:'Bélgica',f:'🇧🇪',s:81,c:'EU',lang:'fr',home:'NED'},
 CRO:{n:'Croácia',f:'🇭🇷',s:80,c:'EU',lang:'hr',home:'ITA'},
 MAR:{n:'Marrocos',f:'🇲🇦',s:81,c:'AF',lang:'ar',home:'FRA'},
 SEN:{n:'Senegal',f:'🇸🇳',s:78,c:'AF',lang:'fr',home:'FRA'},
 NGA:{n:'Nigéria',f:'🇳🇬',s:76,c:'AF',lang:'en',home:'POR'},
 JPN:{n:'Japão',f:'🇯🇵',s:79,c:'AS',lang:'ja',home:'NED'},
 KOR:{n:'Coreia do Sul',f:'🇰🇷',s:77,c:'AS',lang:'ko',home:'GER'},
 USA:{n:'Estados Unidos',f:'🇺🇸',s:77,c:'NA',lang:'en',home:'USA'},
 MEX:{n:'México',f:'🇲🇽',s:77,c:'NA',lang:'es',home:'USA'},
};
// Outras seleções (adversárias)
const OTHER_NATS=[['ECU','Equador','🇪🇨',78,'SA'],['PAR','Paraguai','🇵🇾',76,'SA'],['PER','Peru','🇵🇪',73,'SA'],['CHI','Chile','🇨🇱',74,'SA'],['VEN','Venezuela','🇻🇪',72,'SA'],['BOL','Bolívia','🇧🇴',68,'SA'],['CAN','Canadá','🇨🇦',76,'NA'],['CRC','Costa Rica','🇨🇷',71,'NA'],['PAN','Panamá','🇵🇦',71,'NA'],['JAM','Jamaica','🇯🇲',69,'NA'],['NOR','Noruega','🇳🇴',79,'EU'],['SUI','Suíça','🇨🇭',80,'EU'],['DEN','Dinamarca','🇩🇰',80,'EU'],['AUT','Áustria','🇦🇹',79,'EU'],['TUR','Turquia','🇹🇷',79,'EU'],['POL','Polônia','🇵🇱',77,'EU'],['SRB','Sérvia','🇷🇸',77,'EU'],['UKR','Ucrânia','🇺🇦',77,'EU'],['SWE','Suécia','🇸🇪',77,'EU'],['SCO','Escócia','🏴󠁧󠁢󠁳󠁣󠁴󠁿',75,'EU'],['EGY','Egito','🇪🇬',75,'AF'],['CIV','Costa do Marfim','🇨🇮',77,'AF'],['GHA','Gana','🇬🇭',74,'AF'],['CMR','Camarões','🇨🇲',74,'AF'],['ALG','Argélia','🇩🇿',76,'AF'],['TUN','Tunísia','🇹🇳',73,'AF'],['AUS','Austrália','🇦🇺',74,'AS'],['IRN','Irã','🇮🇷',75,'AS'],['KSA','Arábia Saudita','🇸🇦',72,'AS'],['QAT','Catar','🇶🇦',70,'AS'],['NZL','Nova Zelândia','🇳🇿',66,'OC']];
const FLAG={...Object.fromEntries(Object.entries(NATS).map(([k,v])=>[k,v.f])),...Object.fromEntries(OTHER_NATS.map(x=>[x[0],x[2]])),SVN:'🇸🇮',HUN:'🇭🇺',GEO:'🇬🇪',SVK:'🇸🇰',GUI:'🇬🇳',GAB:'🇬🇦',CZE:'🇨🇿',WAL:'🏴󠁧󠁢󠁷󠁬󠁳󠁿'};
const NAT_CUP={SA:'Copa América',EU:'Eurocopa',AF:'Copa Africana de Nações',AS:'Copa da Ásia',NA:'Copa Ouro'};

// Estrelas reais (elencos até meados de 2026): nome|clube|posição|país|nascimento|força
const STAR_SRC=`Kylian Mbappé|Real Madrid|ATA|FRA|1998|91;Vinícius Júnior|Real Madrid|PE|BRA|2000|89;Jude Bellingham|Real Madrid|MEI|ENG|2003|88;Federico Valverde|Real Madrid|MC|URU|1998|88;Thibaut Courtois|Real Madrid|GOL|BEL|1992|89;Trent Alexander-Arnold|Real Madrid|LD|ENG|1998|85;Aurélien Tchouaméni|Real Madrid|VOL|FRA|2000|84;Éder Militão|Real Madrid|ZAG|BRA|1998|84;Arda Güler|Real Madrid|MEI|TUR|2005|83;Dean Huijsen|Real Madrid|ZAG|ESP|2005|81;
Lamine Yamal|Barcelona|PD|ESP|2007|89;Raphinha|Barcelona|PE|BRA|1996|89;Pedri|Barcelona|MC|ESP|2002|88;Robert Lewandowski|Barcelona|ATA|POL|1988|86;Frenkie de Jong|Barcelona|MC|NED|1997|86;Jules Koundé|Barcelona|LD|FRA|1998|85;Joan García|Barcelona|GOL|ESP|2001|84;Pau Cubarsí|Barcelona|ZAG|ESP|2007|83;Gavi|Barcelona|MC|ESP|2004|83;
Julián Álvarez|Atlético de Madrid|ATA|ARG|2000|87;Jan Oblak|Atlético de Madrid|GOL|SVN|1993|87;Antoine Griezmann|Atlético de Madrid|SA|FRA|1991|84;Koke|Atlético de Madrid|MC|ESP|1992|82;Nico Williams|Athletic Club|PE|ESP|2002|85;Unai Simón|Athletic Club|GOL|ESP|1997|84;Mikel Oyarzabal|Real Sociedad|ATA|ESP|1997|83;Isco|Real Betis|MEI|ESP|1992|82;
Erling Haaland|Manchester City|ATA|NOR|2000|90;Rodri|Manchester City|VOL|ESP|1996|89;Gianluigi Donnarumma|Manchester City|GOL|ITA|1999|88;Phil Foden|Manchester City|MEI|ENG|2000|85;Bernardo Silva|Manchester City|MC|POR|1994|85;Rúben Dias|Manchester City|ZAG|POR|1997|86;Joško Gvardiol|Manchester City|ZAG|CRO|2002|85;Tijjani Reijnders|Manchester City|MC|NED|1998|84;Jérémy Doku|Manchester City|PE|BEL|2002|83;
Mohamed Salah|Liverpool|PD|EGY|1992|90;Virgil van Dijk|Liverpool|ZAG|NED|1991|89;Alisson|Liverpool|GOL|BRA|1992|89;Florian Wirtz|Liverpool|MEI|GER|2003|87;Alexis Mac Allister|Liverpool|MC|ARG|1998|87;Alexander Isak|Liverpool|ATA|SWE|1999|87;Ryan Gravenberch|Liverpool|MC|NED|2002|85;Dominik Szoboszlai|Liverpool|MC|HUN|2000|85;Hugo Ekitiké|Liverpool|ATA|FRA|2002|83;
Bukayo Saka|Arsenal|PD|ENG|2001|88;Martin Ødegaard|Arsenal|MEI|NOR|1998|87;Declan Rice|Arsenal|MC|ENG|1999|87;William Saliba|Arsenal|ZAG|FRA|2001|87;Gabriel Magalhães|Arsenal|ZAG|BRA|1997|87;David Raya|Arsenal|GOL|ESP|1995|86;Viktor Gyökeres|Arsenal|ATA|SWE|1998|85;Martín Zubimendi|Arsenal|VOL|ESP|1999|85;Eberechi Eze|Arsenal|MEI|ENG|1998|84;
Cole Palmer|Chelsea|MEI|ENG|2002|87;Moisés Caicedo|Chelsea|VOL|ECU|2001|86;Enzo Fernández|Chelsea|MC|ARG|2001|85;Reece James|Chelsea|LD|ENG|1999|84;João Pedro|Chelsea|ATA|BRA|2001|83;Estêvão|Chelsea|PD|BRA|2007|80;
Bruno Fernandes|Manchester United|MEI|POR|1994|86;Matheus Cunha|Manchester United|SA|BRA|1999|83;Bryan Mbeumo|Manchester United|PD|CMR|1999|83;Benjamin Šeško|Manchester United|ATA|SVN|2003|82;
Bruno Guimarães|Newcastle|MC|BRA|1997|86;Sandro Tonali|Newcastle|MC|ITA|2000|84;Anthony Gordon|Newcastle|PE|ENG|2001|83;Cristian Romero|Tottenham|ZAG|ARG|1998|85;Micky van de Ven|Tottenham|ZAG|NED|2001|83;Xavi Simons|Tottenham|MEI|NED|2003|83;Mohammed Kudus|Tottenham|PD|GHA|2000|82;
Emiliano Martínez|Aston Villa|GOL|ARG|1992|85;Ollie Watkins|Aston Villa|ATA|ENG|1995|83;Morgan Rogers|Aston Villa|MEI|ENG|2002|82;Jean-Philippe Mateta|Crystal Palace|ATA|FRA|1997|80;
Harry Kane|Bayern de Munique|ATA|ENG|1993|90;Joshua Kimmich|Bayern de Munique|VOL|GER|1995|88;Jamal Musiala|Bayern de Munique|MEI|GER|2003|88;Michael Olise|Bayern de Munique|PD|FRA|2001|87;Luis Díaz|Bayern de Munique|PE|COL|1997|86;Manuel Neuer|Bayern de Munique|GOL|GER|1986|85;Dayot Upamecano|Bayern de Munique|ZAG|FRA|1998|84;Alphonso Davies|Bayern de Munique|LE|CAN|2000|84;
Serhou Guirassy|Borussia Dortmund|ATA|GUI|1996|85;Gregor Kobel|Borussia Dortmund|GOL|SUI|1997|86;Karim Adeyemi|Borussia Dortmund|PE|GER|2002|80;Patrik Schick|Bayer Leverkusen|ATA|CZE|1996|81;Deniz Undav|Stuttgart|ATA|GER|1996|80;
Ousmane Dembélé|Paris Saint-Germain|PD|FRA|1997|90;Vitinha|Paris Saint-Germain|MC|POR|2000|89;Achraf Hakimi|Paris Saint-Germain|LD|MAR|1998|89;Khvicha Kvaratskhelia|Paris Saint-Germain|PE|GEO|2001|87;Nuno Mendes|Paris Saint-Germain|LE|POR|2002|87;Marquinhos|Paris Saint-Germain|ZAG|BRA|1994|86;João Neves|Paris Saint-Germain|MC|POR|2004|86;Willian Pacho|Paris Saint-Germain|ZAG|ECU|2001|85;Désiré Doué|Paris Saint-Germain|PD|FRA|2005|84;Lucas Chevalier|Paris Saint-Germain|GOL|FRA|2001|83;
Mason Greenwood|Marseille|PD|ENG|2001|83;Pierre-Emerick Aubameyang|Marseille|ATA|GAB|1989|79;Paul Pogba|Monaco|MC|FRA|1993|78;
Lautaro Martínez|Inter de Milão|ATA|ARG|1997|88;Nicolò Barella|Inter de Milão|MC|ITA|1997|87;Alessandro Bastoni|Inter de Milão|ZAG|ITA|1999|86;Hakan Çalhanoğlu|Inter de Milão|VOL|TUR|1994|85;Marcus Thuram|Inter de Milão|ATA|FRA|1997|84;Yann Sommer|Inter de Milão|GOL|SUI|1988|83;
Kevin De Bruyne|Napoli|MEI|BEL|1991|85;Scott McTominay|Napoli|MC|SCO|1996|85;Stanislav Lobotka|Napoli|VOL|SVK|1994|84;Romelu Lukaku|Napoli|ATA|BEL|1993|81;Rasmus Højlund|Napoli|ATA|DEN|2003|80;
Mike Maignan|Milan|GOL|FRA|1995|87;Rafael Leão|Milan|PE|POR|1999|85;Christian Pulisic|Milan|PD|USA|1998|84;Luka Modrić|Milan|MC|CRO|1985|83;
Gleison Bremer|Juventus|ZAG|BRA|1997|85;Kenan Yıldız|Juventus|PE|TUR|2005|83;Jonathan David|Juventus|ATA|CAN|2000|83;Dušan Vlahović|Juventus|ATA|SRB|2000|82;Ademola Lookman|Atalanta|PE|NGA|1997|84;Paulo Dybala|Roma|SA|ARG|1993|82;Nico Paz|Como|MEI|ARG|2004|82;
Diogo Costa|Porto|GOL|POR|1999|85;Francisco Trincão|Sporting|PD|POR|1999|82;
Cristiano Ronaldo|Al-Nassr|ATA|POR|1985|85;João Félix|Al-Nassr|SA|POR|1999|80;Sadio Mané|Al-Nassr|PE|SEN|1992|80;Theo Hernández|Al-Hilal|LE|FRA|1997|84;Rúben Neves|Al-Hilal|MC|POR|1997|82;Darwin Núñez|Al-Hilal|ATA|URU|1999|81;Kalidou Koulibaly|Al-Hilal|ZAG|SEN|1991|80;Karim Benzema|Al-Ittihad|ATA|FRA|1987|83;N'Golo Kanté|Al-Ittihad|VOL|FRA|1991|82;Ivan Toney|Al-Ahli|ATA|ENG|1996|82;Riyad Mahrez|Al-Ahli|PD|ALG|1991|81;
Lionel Messi|Inter Miami|SA|ARG|1987|86;Rodrigo De Paul|Inter Miami|MC|ARG|1994|81;Luis Suárez|Inter Miami|ATA|URU|1987|77;Son Heung-min|LAFC|PE|KOR|1992|84;Denis Bouanga|LAFC|PE|GAB|1994|80;
Giorgian de Arrascaeta|Flamengo|MEI|URU|1994|82;Jorginho|Flamengo|VOL|ITA|1991|80;Pedro|Flamengo|ATA|BRA|1997|79;Agustín Rossi|Flamengo|GOL|ARG|1995|78;Léo Pereira|Flamengo|ZAG|BRA|1996|77;
Gustavo Gómez|Palmeiras|ZAG|PAR|1993|79;Vitor Roque|Palmeiras|ATA|BRA|2005|78;Andreas Pereira|Palmeiras|MC|BRA|1996|78;Raphael Veiga|Palmeiras|MEI|BRA|1995|78;Weverton|Palmeiras|GOL|BRA|1987|76;
Memphis Depay|Corinthians|ATA|NED|1994|80;Rodrigo Garro|Corinthians|MEI|ARG|1997|77;Yuri Alberto|Corinthians|ATA|BRA|2001|76;Neymar Jr|Santos|PE|BRA|1992|81;Lucas Moura|São Paulo|MEI|BRA|1992|76;Matheus Pereira|Cruzeiro|MEI|BRA|1996|79;Kaio Jorge|Cruzeiro|ATA|BRA|2002|77;Cássio|Cruzeiro|GOL|BRA|1987|75;Hulk|Atlético-MG|ATA|BRA|1986|76;Philippe Coutinho|Vasco|MEI|BRA|1992|76;Pablo Vegetti|Vasco|ATA|ARG|1988|75;Alan Patrick|Internacional|MEI|BRA|1991|76;Everton Ribeiro|Bahia|MEI|BRA|1989|74;
Franco Armani|River Plate|GOL|ARG|1986|76;Leandro Paredes|Boca Juniors|MC|ARG|1994|79;Edinson Cavani|Boca Juniors|ATA|URU|1987|74`;

// Ícones do EA FC 27 (nome, país, posição, OVR). VEL FIN PAS DRI DEF FIS MEN REF
const LEGEND_SRC=`Sergio Agüero|🇦🇷|ATA|90|90,89,80,88,34,78,88,10
Karl-Heinz Rummenigge|🇩🇪|ATA|90|91,89,81,91,56,81,88,10
Raphaël Varane|🇫🇷|ZAG|90|82,51,68,76,90,84,91,14
Pepe|🇵🇹|ZAG|89|80,50,65,68,89,87,90,14
Pelé|🇧🇷|ATA|95|95,96,93,96,60,76,95,12
Diego Maradona|🇦🇷|MEI|95|92,93,92,97,40,76,93,10
Ronaldo|🇧🇷|ATA|94|97,95,81,95,45,79,90,10
Zinedine Zidane|🇫🇷|MEI|94|84,90,94,95,72,86,97,12
Ronaldinho|🇧🇷|MEI|93|91,91,91,96,40,79,88,10
Johan Cruyff|🇳🇱|SA|93|93,91,91,95,42,75,95,12
Ferenc Puskás|🇭🇺|SA|92|85,95,89,91,47,79,91,10
Garrincha|🇧🇷|PD|92|95,85,84,96,40,70,80,10
Paolo Maldini|🇮🇹|ZAG|92|85,55,80,79,94,86,96,15
Lev Yashin|🇷🇺|GOL|92|60,15,80,40,91,88,95,93
Bobby Charlton|🏴󠁧󠁢󠁥󠁮󠁧󠁿|MC|92|83,92,91,89,64,81,93,12
Gerd Müller|🇩🇪|ATA|92|82,96,72,86,40,80,92,10
Franz Beckenbauer|🇩🇪|ZAG|92|80,73,88,86,92,82,97,14
Andrés Iniesta|🇪🇸|MC|92|80,78,93,95,63,66,95,10
Cafu|🇧🇷|LD|91|92,68,84,87,86,82,88,12
Eusébio|🇵🇹|ATA|91|93,93,82,90,40,80,88,10
Marco van Basten|🇳🇱|ATA|91|85,94,80,90,40,80,90,10
Carlos Alberto|🇧🇷|LD|91|88,70,84,85,89,85,93,12
Franco Baresi|🇮🇹|ZAG|91|76,55,80,76,93,83,96,14
Zico|🇧🇷|MEI|91|86,92,92,93,45,70,90,10
Thierry Henry|🇫🇷|ATA|91|94,91,85,91,46,79,89,10
Gianluigi Buffon|🇮🇹|GOL|91|60,15,72,40,90,89,96,90
Roberto Baggio|🇮🇹|SA|91|85,92,89,93,40,70,90,10
Xavi|🇪🇸|MC|91|75,76,95,92,68,67,96,10
Zlatan Ibrahimović|🇸🇪|ATA|91|80,93,84,89,40,90,92,12
Oliver Kahn|🇩🇪|GOL|91|58,15,70,35,89,88,96,92
Andrea Pirlo|🇮🇹|MC|90|70,80,95,90,64,68,95,10
Iker Casillas|🇪🇸|GOL|90|62,14,70,40,86,85,92,92
Raúl|🇪🇸|ATA|90|87,91,83,89,40,72,91,10
Rivaldo|🇧🇷|MEI|90|86,91,88,91,45,76,86,10
Lothar Matthäus|🇩🇪|VOL|90|86,86,86,85,82,85,94,12
Roberto Carlos|🇧🇷|LE|90|93,82,84,84,82,85,84,12
Dennis Bergkamp|🇳🇱|SA|90|82,90,89,92,40,74,90,10
Alessandro Del Piero|🇮🇹|SA|90|85,90,87,91,40,68,90,10
George Best|🇬🇧|PE|90|92,88,85,95,40,70,78,10
Ruud Gullit|🇳🇱|MC|90|87,88,87,88,76,90,90,12
Bobby Moore|🏴󠁧󠁢󠁥󠁮󠁧󠁿|ZAG|90|74,55,79,72,92,82,96,14
Toni Kroos|🇩🇪|MC|90|64,80,95,85,70,72,94,12
Samuel Eto'o|🇨🇲|ATA|89|93,89,77,87,40,80,85,10
Alan Shearer|🏴󠁧󠁢󠁥󠁮󠁧󠁿|ATA|89|79,93,74,80,45,88,90,10
Hristo Stoichkov|🇧🇬|SA|89|87,90,85,89,40,76,82,10
Didier Drogba|🇨🇮|ATA|89|85,90,73,82,40,92,90,10
Jairzinho|🇧🇷|PD|89|93,87,80,90,45,80,84,10
Kenny Dalglish|🏴󠁧󠁢󠁳󠁣󠁴󠁿|SA|89|82,89,86,89,40,74,90,10
Peter Schmeichel|🇩🇰|GOL|89|60,15,74,40,87,88,94,90
Carles Puyol|🇪🇸|ZAG|89|80,50,70,68,92,87,95,14
Gary Lineker|🏴󠁧󠁢󠁥󠁮󠁧󠁿|ATA|89|87,91,76,82,40,70,88,10
Luís Figo|🇵🇹|PD|89|85,85,88,90,42,77,88,10
Emilio Butragueño|🇪🇸|ATA|89|85,88,80,88,40,68,88,10
Sócrates|🇧🇷|MEI|89|76,87,89,87,58,80,92,10
Hugo Sánchez|🇲🇽|ATA|89|85,92,76,85,40,78,88,10
Kaká|🇧🇷|MEI|89|90,87,86,89,45,74,86,10
Philipp Lahm|🇩🇪|LD|89|85,62,84,85,89,72,95,12
Fabio Cannavaro|🇮🇹|ZAG|89|82,50,70,70,91,84,93,14
Alessandro Nesta|🇮🇹|ZAG|89|80,48,74,72,92,82,92,14
Javier Zanetti|🇦🇷|LD|89|86,60,82,82,86,86,93,12
Ruud van Nistelrooy|🇳🇱|ATA|89|79,92,72,82,40,84,88,10
Eric Cantona|🇫🇷|SA|89|80,89,85,86,45,86,85,10
Marcelo|🇧🇷|LE|89|85,74,86,89,80,76,84,12
Francesco Totti|🇮🇹|SA|89|80,89,90,88,40,76,90,10
Rio Ferdinand|🏴󠁧󠁢󠁥󠁮󠁧󠁿|ZAG|88|81,50,74,72,89,82,92,14
Gareth Bale|🏴󠁧󠁢󠁷󠁬󠁳󠁿|PD|88|94,87,83,86,55,82,82,10
Steven Gerrard|🏴󠁧󠁢󠁥󠁮󠁧󠁿|MC|88|80,87,89,84,73,84,92,12
David Beckham|🏴󠁧󠁢󠁥󠁮󠁧󠁿|MC|88|79,83,93,82,62,74,88,10
Pavel Nedvěd|🇨🇿|MC|88|85,87,86,87,67,82,90,10
Michael Owen|🏴󠁧󠁢󠁥󠁮󠁧󠁿|ATA|88|94,88,72,85,40,66,84,10
Wayne Rooney|🏴󠁧󠁢󠁥󠁮󠁧󠁿|SA|88|83,89,84,86,60,85,86,10
Edwin van der Sar|🇳🇱|GOL|88|58,15,82,45,86,86,93,87
Petr Čech|🇨🇿|GOL|88|56,14,70,38,88,87,93,88
Robin van Persie|🇳🇱|ATA|88|80,90,84,87,40,74,86,10
Paul Scholes|🏴󠁧󠁢󠁥󠁮󠁧󠁿|MC|88|70,86,90,86,70,74,90,10
Miroslav Klose|🇩🇪|ATA|88|80,89,72,80,45,82,90,10
Laurent Blanc|🇫🇷|ZAG|88|72,62,80,74,88,82,92,14
Patrick Vieira|🇫🇷|VOL|88|78,72,84,82,87,88,92,12
Juan Román Riquelme|🇦🇷|MEI|88|68,84,93,91,40,72,88,10
Michael Laudrup|🇩🇰|MEI|88|84,84,90,91,40,68,88,10
Ronald Koeman|🇳🇱|ZAG|88|66,82,87,78,86,82,90,14
Gheorghe Hagi|🇷🇴|MEI|88|80,87,90,91,40,68,86,10
Fernando Hierro|🇪🇸|ZAG|88|72,70,82,74,88,84,93,14
Lilian Thuram|🇫🇷|ZAG|88|82,50,72,74,89,86,92,14
Franck Ribéry|🇫🇷|PE|88|88,82,84,91,40,70,80,10
Giorgio Chiellini|🇮🇹|ZAG|88|74,48,64,64,90,88,94,14
Andriy Shevchenko|🇺🇦|ATA|88|89,90,78,85,40,80,86,10
Bastian Schweinsteiger|🇩🇪|MC|88|74,82,87,84,76,82,92,12
Marcel Desailly|🇫🇷|ZAG|88|78,52,70,70,89,88,90,14
Frank Lampard|🏴󠁧󠁢󠁥󠁮󠁧󠁿|MC|87|74,88,86,82,66,80,90,10
Fernando Torres|🇪🇸|ATA|87|90,87,74,84,40,76,82,10
Xabi Alonso|🇪🇸|VOL|87|64,78,90,80,78,78,92,12
Ian Wright|🏴󠁧󠁢󠁥󠁮󠁧󠁿|ATA|87|88,88,72,84,40,76,82,10
Ian Rush|🏴󠁧󠁢󠁷󠁬󠁳󠁿|ATA|87|84,89,72,80,40,76,86,10
John Barnes|🏴󠁧󠁢󠁥󠁮󠁧󠁿|PE|87|86,82,82,88,45,76,84,10
Patrick Kluivert|🇳🇱|ATA|87|82,87,76,84,40,80,82,10
Davor Šuker|🇭🇷|ATA|87|80,89,76,85,40,74,84,10
Frank Rijkaard|🇳🇱|VOL|87|78,72,82,80,86,86,92,12
Claude Makélélé|🇫🇷|VOL|87|76,60,80,78,86,82,92,12
Emmanuel Petit|🇫🇷|VOL|87|74,72,84,78,82,82,86,12
Robert Pires|🇫🇷|PE|87|82,82,86,87,45,68,84,10
Nemanja Vidić|🇷🇸|ZAG|87|70,45,62,60,90,88,92,14
Gianfranco Zola|🇮🇹|SA|87|84,86,86,90,40,64,84,10
Hernán Crespo|🇦🇷|ATA|86|80,88,72,80,40,80,84,10
Gianluca Zambrotta|🇮🇹|LD|86|86,60,78,80,85,78,86,12
Michael Essien|🇬🇭|VOL|86|82,72,80,80,84,90,86,12
Ashley Cole|🏴󠁧󠁢󠁥󠁮󠁧󠁿|LE|86|88,55,78,80,85,74,84,12
Gennaro Gattuso|🇮🇹|VOL|86|75,62,74,72,86,88,94,12
Sol Campbell|🏴󠁧󠁢󠁥󠁮󠁧󠁿|ZAG|86|74,48,62,62,88,90,88,14
Juan Sebastián Verón|🇦🇷|MC|86|70,82,90,84,64,76,86,10
Roy Keane|🇮🇪|VOL|86|72,72,82,78,85,86,96,12
Henrik Larsson|🇸🇪|ATA|86|82,87,76,84,40,74,88,10
Luis Hernández|🇲🇽|ATA|86|86,86,70,82,40,72,80,10
Cha Bum-kun|🇰🇷|ATA|86|86,86,70,80,40,82,86,10`;
const LEGENDS=LEGEND_SRC.split('\n').map(r=>{const[n,f,p,o,v]=r.split('|');return[n,f,p,+o,v.split(',').map(Number)]});

const FIRST=['Lucas','Mateo','Kai','Enzo','Rafael','Theo','Jonas','Amadou','Diego','Luka','Hugo','Iker','Yuki','Sami','Bruno','Noah','Pablo','Kenji','Jamal','Marco','Aurélien','Tomás','Nico','Elias','Gabriel','Davi','Thiago','Matías','Joaquín','Felipe','Caio','Igor','Arthur','Leon','Finn','Malik','Oscar','Emil','Rúben','Dário'];
const LAST=['Varela','Okoye','Lindqvist','Duarte','Moreau','Kessler','Bianchi','Tanaka','Haddad','Romero','Vandermeer','Navarro','Sørensen','Mbaye','Albuquerque','Petrov','Castell','Ferraz','Nakamura','Ojeda','Ashworth','Delacroix','Brandt','Quintero','Siqueira','Peixoto','Moraes','Bastos','Lacerda','Fontes','Arriaga','Valdés','Mertens','Hofmann','Ricci','Lombardi','Carvalho','Teixeira','Gallo','Leclerc'];

const FLAG_LIST=[...Object.values(NATS).map(n=>n.f),...OTHER_NATS.map(x=>x[2])];

function TROPHY_NAMES(){const s=new Set();for(const l in LG)s.add(LG[l].n);for(const k in COUNTRY){const C=COUNTRY[k];[C.cup,C.lcup,C.sup].forEach(x=>x&&s.add(x))}Object.values(UF_EST).forEach(x=>s.add(x));
 ['Champions League','Europa League','Conference League','Libertadores','Copa Sul-Americana','Concachampions','AFC Champions League Elite','Supercopa da UEFA','Recopa Sul-Americana','Copa Intercontinental','Mundial de Clubes da FIFA','MLS Cup','Supporters’ Shield','Copa do Mundo','Olimpíadas',...Object.values(NAT_CUP),'Bola de Ouro','Pódio da Bola de Ouro','Golden Boy','Chuteira de Ouro','Luva de Ouro','Artilheiro','Craque da liga','Melhor da posição','Seleção da Temporada','Bola de Ouro da Copa','Chuteira de Ouro da Copa','Acesso'].forEach(x=>s.add(x));return[...s]}
