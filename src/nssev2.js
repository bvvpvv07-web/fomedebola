// ============ MAIS 150 EVENTOS (total 200) ============
{const nsW=k=>k*1e-6; // valores relativos ao salário: convertidos na hora de aplicar (nsEvFx)
 const O=(l,t,f)=>[l,()=>[typeof t==='function'?t():t,f||{}]],OC=(l,p,t1,f1,t2,f2)=>[l,()=>ch(p)?[t1,f1||{}]:[t2,f2||{}]];
 const E=(id,ar,t,d,o,x)=>({id,ar,t,d,o,...(x||{})});const GF={c:()=>!!S.gf},SP={c:()=>typeof nsHasSp==='function'&&nsHasSp()},CAR={c:()=>nsHasV()},HOME={c:()=>nsHasP()},HOR={c:()=>nsHasH()},A18={a:18},A16={a:16};
 const gfN=()=>S.gf?S.gf.n:'Ela';
NS_EV.push(
 // ---------- TÉCNICO ----------
 E('c2_cap','coach','Braçadeira','O técnico pergunta se você topa ser capitão no próximo jogo, já que o titular está machucado.',[O('Aceitar com orgulho','Liderou o time no vestiário.',{rel:{coach:6,team:3},happy:4}),O('Indicar um veterano','Os mais velhos respeitaram o gesto.',{rel:{team:6,coach:2}})]),
 E('c2_dieta','coach','Dieta nova','O técnico mandou o elenco cortar doce e refrigerante. Você ama um açaí depois do treino.',[O('Seguir à risca','Corpo mais leve.',{en:6,rel:{coach:3},happy:-3}),OC('Comer escondido',.6,'Ninguém viu.',{happy:3},'O nutricionista te pegou no flagra.',{rel:{coach:-5}})]),
 E('c2_banco','coach','Conversa franca','O técnico diz que você vai começar no banco porque está abaixo nos treinos.',[O('Pedir uma chance e treinar dobrado','Ele gostou da resposta.',{rel:{coach:5},en:-8,sk:{tec:1}}),O('Aceitar calado','Ok. Agora é mostrar em campo.',{rel:{coach:1},happy:-3}),OC('Dizer que ele está errado',.3,'Ele reconheceu e te escalou!',{rel:{coach:3}},'Ele não gostou nada.',{rel:{coach:-9}})]),
 E('c2_tat','coach','Tática nova','O técnico apresentou um esquema novo e pediu opinião dos jogadores.',[OC('Sugerir uma mudança',.55,'Ele adotou a sua ideia!',{rel:{coach:7},sk:{vis:1}},'Ele achou que você quis aparecer.',{rel:{coach:-3}}),O('Concordar com tudo','Reunião tranquila.',{rel:{coach:1}})]),
 E('c2_folga','coach','Pedido de folga','Seu aniversário cai no dia do treino. Dá pra pedir folga ao técnico.',[OC('Pedir folga',.5,'Ele liberou e ainda mandou bolo.',{happy:6,en:6},'Negou e ficou com cara feia.',{rel:{coach:-3}}),O('Treinar e comemorar à noite','Profissional.',{rel:{coach:3}})]),
 // ---------- ELENCO ----------
 E('t2_novato','team','Garoto da base','Um garoto da base subiu pro profissional e está perdido no vestiário.',[O('Adotar o garoto','Ele vai lembrar disso pra sempre.',{rel:{team:6},happy:3}),O('Deixar ele se virar','Cada um com seus problemas.',{})]),
 E('t2_briga','team','Briga no treino','Dois companheiros saíram no tapa no treino e o vestiário rachou.',[OC('Separar e conversar',.7,'Fizeram as pazes por sua causa.',{rel:{team:7,coach:3}},'Sobrou um empurrão pra você.',{rel:{team:2},en:-5}),O('Ficar de fora','Clima pesado por dias.',{rel:{team:-2}})]),
 E('t2_vaq','team','Vaquinha','O elenco está fazendo vaquinha pra ajudar o roupeiro que teve a casa alagada.',[O('Colocar uma boa quantia','O roupeiro te abraçou chorando.',{din:-nsW(.4),rel:{team:6,fans:2},happy:5}),O('Colocar um pouco','Ajudou.',{din:-nsW(.1),rel:{team:2}}),O('Não colocar nada','Repararam.',{rel:{team:-5}})]),
 E('t2_grupo','team','Grupo do elenco','No grupo de mensagens do elenco, um áudio seu reclamando do técnico vazou.',[O('Pedir desculpa ao técnico','Ele aceitou, mas anotou.',{rel:{coach:-2,team:2}}),OC('Dizer que era montagem',.4,'Colou.',{},'Ninguém acreditou.',{rel:{coach:-7,team:-3}})]),
 E('t2_jogo','team','Noite de videogame','Os companheiros marcaram campeonato de videogame na concentração.',[OC('Entrar pra ganhar',.5,'Campeão da concentração!',{rel:{team:5},happy:4,en:-4},'Eliminado na primeira. Zoação garantida.',{rel:{team:4},en:-4}),O('Dormir cedo','Descansado pro jogo.',{en:6})]),
 // ---------- TORCIDA ----------
 E('f2_hino','fans','Música da torcida','A torcida criou uma música com o seu nome.',[O('Gravar vídeo cantando junto','Delírio na arquibancada.',{rel:{fans:8},star:.4}),O('Agradecer nas redes','Torcida feliz.',{rel:{fans:3}})]),
 E('f2_cobranca','fans','Cobrança no aeroporto','Depois de uma derrota, torcedores cobram o elenco no desembarque.',[OC('Parar e conversar',.6,'Saíram te aplaudindo.',{rel:{fans:6}},'Discussão feia, foi parar na TV.',{rel:{fans:-5,coach:-2}}),O('Sair pela porta lateral','Chamaram de covarde.',{rel:{fans:-4}})]),
 E('f2_tattoo','fans','Tatuagem de fã','Um torcedor tatuou o seu rosto no braço e quer te conhecer.',[O('Receber ele no CT','Momento emocionante.',{rel:{fans:6},happy:3}),O('Mandar um vídeo','Ele ficou feliz.',{rel:{fans:2}})]),
 E('f2_camisa','fans','Camisa jogada','Um menino pediu sua camisa na saída do campo.',[O('Dar a camisa','O vídeo rodou o país.',{rel:{fans:7},star:.3}),O('Dar a munhequeira','Ele ficou feliz igual.',{rel:{fans:3}})]),
 E('f2_rival','fans','Provocação','Torcedores rivais te provocam no restaurante.',[O('Rir e pagar a conta deles','Viralizou como classe.',{din:-nsW(.1),rel:{fans:5},star:.3}),OC('Responder à altura',.4,'Ganhou o duelo de piadas.',{rel:{fans:3}},'Virou bate-boca.',{rel:{fans:-4,coach:-2}}),O('Ignorar','Paz.',{})]),
 // ---------- NAMORADA ----------
 E('g2_pet','gf','Cachorro novo',()=>`${gfN()} quer adotar um cachorro, mas você viaja muito.`,[O('Adotar','Família aumentou.',{rel:{gf:7},happy:5,din:-nsW(.05)}),O('Propor esperar','Ela entendeu, meio triste.',{rel:{gf:-3}})],GF),
 E('g2_ciume','gf','Ciúme',()=>`${gfN()} viu uma foto sua com uma fã e ficou chateada.`,[O('Conversar e explicar','Tudo esclarecido.',{rel:{gf:3}}),O('Postar foto com ela','Ela amou.',{rel:{gf:6,fans:1}}),O('Dizer que é exagero','Brigaram feio.',{rel:{gf:-8}})],GF),
 E('g2_niver','gf','Aniversário dela',()=>`O aniversário de ${gfN()} é no dia do jogo.`,[O('Festa surpresa depois do jogo','Ela chorou de emoção.',{rel:{gf:9},din:-nsW(.3),en:-6}),O('Dedicar um gol','Combinado. Agora é marcar!',{rel:{gf:3}}),O('Comemorar outro dia','Ela ficou quieta.',{rel:{gf:-4}})],GF),
 E('g2_morar','gf','Morar junto',()=>`${gfN()} sugere morarem juntos.`,[O('Topar','Casa nova, vida nova.',{rel:{gf:10},happy:6}),O('Pedir mais tempo','Ela ficou insegura.',{rel:{gf:-5}})],GF),
 E('g2_redes','gf','Fã da namorada',()=>`${gfN()} está bombando nas redes e quer gravar conteúdo com você.`,[O('Gravar','Os seguidores amaram o casal.',{rel:{gf:6,fans:3},en:-4}),O('Preferir privacidade','Ela respeitou.',{rel:{gf:-1}})],GF),
 // ---------- MARCAS ----------
 E('s2_evento','spon','Evento da marca','Uma marca sua quer você num evento de lançamento na véspera do jogo.',[O('Ir rapidinho','Marca feliz, você cansado.',{rel:{spon:6},en:-10,din:nsW(.3)}),O('Mandar vídeo','Aceitaram, sem empolgação.',{rel:{spon:1}})],SP),
 E('s2_concor','spon','Concorrente','Você foi fotografado usando produto da concorrente da sua marca.',[O('Pedir desculpas publicamente','Ficou tudo bem.',{rel:{spon:-2}}),OC('Dizer que foi presente',.5,'Colou.',{},'Multa contratual.',{din:-nsW(.8),rel:{spon:-6}})],SP),
 E('s2_bonus','spon','Bônus por gol','Uma marca oferece bônus extra se você comemorar gol com o gesto deles.',[O('Aceitar','Mais um dinheirinho por gol.',{rel:{spon:5},din:nsW(.2)}),O('Recusar: comemoração é sua','A torcida curtiu a atitude.',{rel:{fans:2,spon:-2}})],SP),
 E('s2_comer','spon','Comercial de TV','Uma marca quer gravar comercial com você. Dia inteiro de gravação.',[O('Gravar','Comercial no horário nobre.',{din:nsW(1),star:.5,en:-12,rel:{spon:5}}),O('Pedir algo mais curto','Fizeram uma versão menor.',{din:nsW(.3),rel:{spon:2}})],{c:()=>S.n.star.l>=2}),
 // ---------- AGENTE ----------
 E('a2_luvas','ag','Luvas do contrato','Seu agente diz que dá pra pedir luvas (bônus de assinatura) na próxima negociação, mas pode azedar a conversa.',[O('Mandar pedir','Anotado pra próxima negociação.',{happy:2}),O('Deixar quieto','Conversa tranquila.',{rel:{coach:1}})]),
 E('a2_imagem','ag','Direito de imagem','Seu agente propõe abrir uma empresa pra cuidar da sua imagem.',[O('Abrir a empresa','Custa, mas profissionaliza.',{din:-nsW(.5),rel:{spon:4}}),O('Não precisa','Simples assim.',{})]),
 E('a2_sumiu','ag','Agente sumido','Seu agente não responde há dias.',[O('Mandar mensagem firme','Ele apareceu se desculpando.',{happy:1}),O('Ir no escritório dele','Ele estava num evento no exterior.',{en:-4})],{c:()=>!!(S.n.staff&&S.n.staff.ag)}),
 E('a2_amigo','ag','Amigo empresário','Um amigo de infância quer virar seu empresário, sem experiência nenhuma.',[O('Dar uma chance pra ele ajudar com redes','Ele é bom nisso!',{rel:{fans:3}}),O('Recusar com carinho','Ele entendeu.',{})]),
 // ---------- TREINADOR ----------
 E('r2_yoga','tr','Yoga','Seu preparador sugere aulas de yoga pra flexibilidade.',[O('Fazer','Corpo solto, menos dor.',{en:8,sk:{tec:1},din:-nsW(.05)}),O('Achar frescura','Ok.',{})]),
 E('r2_gps','tr','Colete GPS','O preparador mostrou que você corre menos que a média no segundo tempo.',[O('Treino de resistência','Mais fôlego.',{sk:{for:1},en:-10}),O('Dizer que é estratégia','Ele riu.',{})]),
 E('r2_sono','tr','Dormir melhor','O preparador quer controlar seu sono com um relógio inteligente.',[O('Topar','Dormindo como um bebê.',{en:10,din:-nsW(.05)}),O('Recusar','Você dorme como quer.',{})]),
 E('r2_campo','tr','Treino na areia','O preparador quer treinar arrancada na praia no domingo.',[O('Ir','Pernas pegando fogo.',{sk:{vel:1},en:-12,happy:2}),O('Pedir pra adiar','Domingo de descanso.',{en:6})]),
 // ---------- FOFOCAGRAM ----------
 E('n2_jantar','fofo','Jantar flagrado','O Nardo postou foto sua jantando com uma pessoa misteriosa.',[O('Explicar que é sua prima','Ninguém acreditou, mas passou.',{}),O('Não comentar','O mistério rendeu seguidores.',{star:.3}),O('Processar o Nardo','Ele postou mais três fotos.',{din:-nsW(.3),rel:{fans:-2}})],A16),
 E('n2_carro','fofo','Carro novo no story','O Nardo diz que você comprou um carrão enquanto o time vai mal.',[O('Mostrar que foi presente','Torcida aliviou.',{}),O('Mandar um “cada um com seu dinheiro”','Torcida irritada.',{rel:{fans:-5},star:.3})],CAR),
 E('n2_treino','fofo','Atrasado pro treino','O Nardo filmou você chegando atrasado no CT.',[O('Pedir desculpa ao grupo','Assunto encerrado.',{rel:{team:2}}),O('Dizer que foi trânsito','Meio mundo duvidou.',{rel:{coach:-3}})]),
 E('n2_live','fofo','Live do Nardo','O Nardo te convida pra uma live dele, ao vivo e sem roteiro.',[OC('Ir',.5,'Você brilhou. Engraçado e humilde.',{star:.6,rel:{fans:4}},'Falou besteira sobre o técnico.',{rel:{coach:-6},star:.4}),O('Recusar','Ele vai se vingar…',{})]),
 E('n2_casa','fofo','Casa à venda','O Nardo diz que você vai sair do clube porque colocou a casa à venda.',[O('Desmentir em vídeo','Torcida tranquila.',{rel:{fans:3}}),O('Deixar no ar','Especulação no mercado.',{rel:{fans:-3}})],HOME),
 // ---------- TREINO ----------
 E('tr2_rach','train','Rachão','Treino recreativo: titulares contra reservas, valendo churrasco.',[OC('Jogar sério',.55,'Seu time ganhou e você fez golaço.',{sk:{tec:1},rel:{team:3}},'Perdeu e vai pagar o churrasco.',{din:-nsW(.1)}),O('Jogar de leve','Sem lesão.',{en:4})]),
 E('tr2_lua','train','Treino debaixo de chuva','Temporal no CT e o técnico manteve o treino.',[O('Treinar com tudo','Lama e evolução.',{sk:{for:1},en:-8}),O('Treinar mais leve','Sem gripe.',{})]),
 E('tr2_extra','train','Fica depois do treino','Você pode ficar depois do treino batendo na bola.',[O('Ficar 1 hora','Pé mais calibrado.',{sk:{bp:1},en:-8}),O('Ir pra casa','Descanso.',{en:4})]),
 E('tr2_novo','train','Exercício novo','O auxiliar inventou um circuito de passe complicado.',[OC('Encarar',.6,'Pegou o jeito rápido.',{sk:{vis:1}},'Errou muito, mas aprendeu.',{sk:{vis:1},happy:-2}),O('Fazer o básico','Ok.',{})]),
 E('tr2_drone','train','Drone no treino','O clube começou a filmar os treinos com drone pra análise.',[O('Pedir os vídeos pra estudar','Aprendeu com os erros.',{sk:{vis:1},rel:{coach:2}}),O('Nem ligar','Ok.',{})]),
 // ---------- ENERGÉTICO ----------
 E('d2_novo','drink','Sabor novo','Lançaram um energético sabor açaí. O nutricionista está desconfiado.',[O('Experimentar','Gostoso e deu gás.',{en:10}),O('Ficar no de sempre','Seguro.',{})]),
 E('d2_vicio','drink','Energético demais','Você está tomando energético todo dia e o médico do clube percebeu.',[O('Diminuir','Sono melhorou.',{en:5,rel:{coach:2}}),O('Continuar','Dormindo mal.',{en:-8})]),
 E('d2_pat','drink','Marca de energético','Uma marca de energético quer patrocinar seus treinos com produto grátis.',[O('Aceitar','+3 energéticos.',{dr:3}),O('Recusar','Ok.',{})]),
 // ---------- CHUTEIRA ----------
 E('b2_sorte','boot','Chuteira da sorte','Você fez gol com uma chuteira velha e agora não quer trocar.',[O('Usar até rasgar','Superstição é tudo.',{happy:4}),O('Aposentar e emoldurar','Virou relíquia.',{happy:2})]),
 E('b2_cor','boot','Cor polêmica','Sua chuteira nova é da cor do rival.',[O('Usar mesmo assim','Torcida chiou.',{rel:{fans:-4}}),O('Pintar de outra cor','Problema resolvido.',{din:-nsW(.02)})]),
 E('b2_trava','boot','Trava errada','Gramado molhado e você está com chuteira de trava curta.',[O('Trocar pela de trava alta','Firmeza total.',{}),OC('Jogar assim',.5,'Deu certo.',{},'Escorregou no lance decisivo.',{rel:{coach:-3}})]),
 // ---------- VISUAL ----------
 E('l2_platin','look','Cabelo platinado','Seus amigos te desafiam a platinar o cabelo.',[OC('Platinar',.6,'Ficou estiloso!',{rel:{fans:3},happy:4},'Ficou amarelo. Virou meme.',{star:.3,happy:-2}),O('Recusar','Clássico.',{})]),
 E('l2_barba','look','Barba de promessa','O elenco combinou de não fazer a barba até sair do jejum de vitórias.',[O('Entrar na promessa','Elenco unido.',{rel:{team:4}}),O('Fazer a barba','Visual limpo.',{})]),
 E('l2_tatu','look','Tatuagem nova','Um tatuador famoso quer fazer uma tatuagem grande em você.',[O('Fazer','Ficou bonita. Doeu.',{happy:4,din:-nsW(.1)}),O('Pensar mais','Tatuagem é pra sempre.',{})]),
 E('l2_roupa','look','Estilista','Um estilista quer montar seu look pra premiação.',[O('Aceitar','Estiloso na foto.',{star:.3,din:-nsW(.2)}),O('Ir de terno simples','Elegante.',{})]),
 // ---------- CARRO ----------
 E('v2_multa','car','Multa','Chegou uma multa por excesso de velocidade.',[O('Pagar','Lição aprendida.',{din:-nsW(.05)}),O('Recorrer','Perdeu tempo e pagou mais.',{din:-nsW(.08)})],CAR),
 E('v2_carona','car','Carona','Um companheiro sem carro pede carona todo dia.',[O('Dar carona','Amizade forte.',{rel:{team:4}}),O('Inventar desculpa','Ele percebeu.',{rel:{team:-2}})],CAR),
 E('v2_roubo','car','Tentativa de roubo','Tentaram roubar seu carro na porta do restaurante.',[O('Instalar segurança','Mais tranquilo.',{din:-nsW(.2)}),O('Trocar de carro','Dor de cabeça.',{din:-nsW(.5),happy:-2})],CAR),
 E('v2_tune','car','Personalizar','Uma oficina quer personalizar seu carro com as cores do clube.',[O('Personalizar','A torcida enlouqueceu.',{rel:{fans:4},din:-nsW(.3)}),O('Deixar original','Discreto.',{})],CAR),
 // ---------- CASA ----------
 E('h2_festa','home','Festa em casa','Os amigos querem fazer festa na sua casa no fim de semana.',[O('Liberar a casa','Festa lendária.',{happy:6,en:-10,din:-nsW(.2)}),O('Algo menor','Churrasco tranquilo.',{happy:3})],HOME),
 E('h2_piscina','home','Piscina','Dá pra construir uma piscina na sua casa.',[O('Construir','Recuperação na água.',{din:-nsW(2),en:6,happy:4}),O('Não agora','Ok.',{})],HOME),
 E('h2_ladrao','home','Alarme disparou','O alarme da sua casa disparou de madrugada.',[O('Chamar a polícia','Era um gato.',{}),O('Ir ver sozinho','Era um gato. Mas que susto.',{happy:-2})],HOME),
 E('h2_gym','home','Academia em casa','Um vendedor oferece equipamentos de academia pra casa.',[O('Montar academia','Treino extra sem sair.',{din:-nsW(.8),sk:{for:1}}),O('Recusar','Vai na academia do clube.',{})],HOME),
 // ---------- ESTILO DE VIDA ----------
 E('x2_relog','lux','Relógio de luxo','Uma marca de relógios suíços oferece um modelo com desconto.',[O('Comprar','Pulso pesado.',{din:-nsW(2),happy:5}),O('Recusar','O celular mostra a hora.',{})],A16),
 E('x2_iate','lux','Passeio de iate','Um empresário te convida pra um passeio de iate.',[O('Ir','Dia incrível.',{happy:6,en:-5}),OC('Perguntar o que ele quer',.5,'Ele só é fã mesmo.',{happy:2},'Queria te vender um negócio duvidoso.',{})],A18),
 E('x2_chef','lux','Chef particular','Contratar um chef particular pra comida saudável?',[O('Contratar','Comida top todo dia.',{din:-nsW(.8),en:6}),O('Cozinhar sozinho','Ovo e arroz.',{})]),
 E('x2_mansao','lux','Leilão de arte','Um amigo te leva num leilão de arte.',[OC('Arrematar um quadro',.4,'O quadro valorizou!',{din:nsW(1)},'Era falso.',{din:-nsW(1.5)}),O('Só olhar','Tarde cultural.',{happy:2})],A18),
 // ---------- BETTIGER ----------
 E('bt2_bonus','bet','Bônus de boas-vindas','O BETTIGER te dá giros grátis no tigrinho.',[OC('Girar',.4,'Saiu a carta!',{din:nsW(.4)},'Nada.',{}),O('Ignorar','Nem abriu.',{})],A18),
 E('bt2_divida','bet','Amigo endividado','Um companheiro perdeu muito em aposta e pede ajuda.',[O('Emprestar','Ele prometeu parar.',{din:-nsW(.6),rel:{team:4}}),O('Indicar ajuda profissional','Ele agradeceu depois.',{rel:{team:2}})],A18),
 E('bt2_aviao','bet','Avião subindo','Seu amigo jura que o “aviãozinho” vai até 10x.',[OC('Apostar e sair no 2x',.55,'Lucrou um pouco.',{din:nsW(.2)},'Caiu no 1,5x.',{din:-nsW(.2)}),O('Não apostar','Prudente.',{})],A18),
 E('bt2_propag','bet','Propaganda de casa de aposta','Uma casa de apostas quer você na propaganda.',[O('Aceitar','Dinheiro bom, crítica também.',{din:nsW(1.5),rel:{fans:-3}}),O('Recusar','Imagem limpa.',{rel:{fans:2}})],{a:18,c:()=>S.n.star.l>=2}),
 // ---------- ESTÁBULO ----------
 E('hs2_jockey','horse','Jóquei famoso','Um jóquei famoso quer montar seu cavalo na próxima corrida.',[O('Contratar','Mais chance de vitória.',{din:-nsW(.3),happy:3}),O('Ficar com o atual','Fidelidade.',{})],HOR),
 E('hs2_venda','horse','Proposta pelo cavalo','Um sheik quer comprar seu melhor cavalo.',[O('Vender','Lucro alto.',{din:nsW(3)}),O('Não vender','Ele é da família.',{happy:3})],HOR),
 E('hs2_potro','horse','Nasceu um potro','Uma égua do seu estábulo teve um potro.',[O('Batizar com o nome do clube','A torcida amou.',{rel:{fans:3},happy:4}),O('Batizar com o nome da sua mãe','Ela chorou.',{happy:5})],HOR),
 // ---------- MERCADO NEGRO ----------
 E('k2_receita','black','Receita falsa','Um médico de fachada oferece receita pra “remédio de força”.',[O('Aceitar','Fez efeito… e rastro.',{sk:{for:2},dope:25}),O('Recusar','Corpo limpo.',{})],A18),
 E('k2_exame','black','Exame surpresa','Boato: antidoping surpresa esta semana.',[O('Ficar tranquilo','Nada a temer.',{}),O('Comprar mascarador no beco','Talvez funcione.',{din:-nsW(.3),dope:-15})],{a:18,c:()=>(S.n.dopeR||0)>0}),
 E('k2_denun','black','Colega dopado','Você desconfia que um companheiro está usando substância proibida.',[O('Conversar com ele','Ele prometeu parar.',{rel:{team:3}}),O('Avisar o médico','Ele foi afastado. Clima estranho.',{rel:{coach:4,team:-4}}),O('Fingir que não viu','Problema dele.',{})],A18),
 // ---------- HOSPITAL ----------
 E('m2_gripe','med','Gripe forte','Você acordou com febre na véspera do jogo.',[O('Ir ao médico do clube','Remédio e repouso.',{en:-10}),O('Jogar assim mesmo','Sofreu em campo.',{en:-25,rel:{coach:2}})]),
 E('m2_dente','med','Dor de dente','Um siso está te matando de dor.',[O('Arrancar logo','Dois dias inchado.',{en:-8,din:-nsW(.05)}),O('Aguentar','Dor constante.',{happy:-4})]),
 E('m2_check','med','Check-up','O clube oferece check-up completo.',[O('Fazer','Tudo em ordem.',{happy:2}),O('Pular','Ok.',{})]),
 E('m2_fisio','med','Fisio particular','Um fisioterapeuta famoso oferece sessões particulares.',[O('Contratar','Recuperação mais rápida.',{din:-nsW(.4),en:12}),O('Usar o do clube','Também é bom.',{})]),
 // ---------- ACADEMIA ----------
 E('gy2_proteina','gym','Suplemento','O personal recomenda um suplemento caro.',[O('Comprar','Ganhou massa.',{din:-nsW(.1),sk:{for:1}}),O('Comida de verdade','Arroz e frango.',{})]),
 E('gy2_luta','gym','Aula de luta','A academia tem aula de boxe à noite.',[O('Fazer','Reflexo e fôlego.',{sk:{for:1},en:-8}),O('Pular','Descanso.',{en:4})]),
 E('gy2_selfie','gym','Selfie na academia','Você está com o shape em dia. Postar?',[O('Postar','Choveu like.',{rel:{fans:2},star:.2}),O('Treinar quieto','Foco.',{})]),
 // ---------- BALADA ----------
 E('p2_niver','party','Aniversário de famoso','Um cantor famoso te convida pro aniversário dele.',[O('Ir','Fotos com celebridades.',{star:.4,en:-12,happy:5}),O('Mandar presente','Educado.',{din:-nsW(.05)})],A16),
 E('p2_briga','party','Confusão na boate','Começou uma briga perto de você na boate.',[O('Sair na hora','Esperto.',{}),OC('Tentar apartar',.4,'Virou herói da noite.',{rel:{fans:3}},'Saiu na foto no meio da briga.',{rel:{coach:-6,fans:-3}})],A18),
 E('p2_show','party','Show na véspera','Seu cantor favorito faz show na véspera do jogo.',[O('Ir e voltar cedo','Valeu a pena.',{happy:5,en:-6}),O('Ficar em casa','Jogo é jogo.',{en:4})]),
 // ---------- VIAGEM ----------
 E('tp2_milhas','trip','Milhas acumuladas','Você tem milhas pra uma viagem de primeira classe.',[O('Viajar nas férias','Luxo total.',{happy:6}),O('Doar pra um torcedor','Gesto lindo.',{rel:{fans:6}})]),
 E('tp2_atraso','trip','Voo atrasado','O voo do time atrasou 6 horas.',[O('Dormir no aeroporto','Dor nas costas.',{en:-10}),O('Jogar baralho com o elenco','Resenha boa.',{rel:{team:4},en:-6})]),
 E('tp2_cidade','trip','Cidade do jogo fora','O jogo fora é numa cidade turística.',[O('Passear com o elenco','Fotos lindas.',{rel:{team:3},en:-4}),O('Ficar no hotel','Concentração.',{rel:{coach:2}})]),
 // ---------- ESCOLA ----------
 E('e2_ingles','edu','Aulas de inglês','Uma escola oferece inglês intensivo pra jogadores.',[O('Fazer','Already speaking!',{happy:3,en:-4,din:-nsW(.05)}),O('Deixar pra depois','Ok.',{})]),
 E('e2_palestra','edu','Palestra na escola','Uma escola pública te convida pra falar com os alunos.',[O('Ir','As crianças amaram.',{rel:{fans:5},happy:4}),O('Mandar vídeo','Simpático.',{rel:{fans:1}})]),
 E('e2_livro','edu','Livro de finanças','Seu agente te deu um livro sobre investir dinheiro.',[O('Ler','Aprendeu a cuidar do dinheiro.',{din:nsW(.2)}),O('Usar de peso de porta','Ok.',{})]),
 // ---------- HOBBIES ----------
 E('hb2_pesca','hob','Pescaria','Um amigo te chama pra pescar no domingo.',[O('Ir','Paz total.',{happy:5,en:4}),O('Ficar em casa','Ok.',{})]),
 E('hb2_game','hob','Torneio de videogame','Um torneio de futebol virtual chama jogadores reais.',[OC('Jogar',.5,'Campeão! Viralizou.',{star:.4,rel:{fans:3}},'Perdeu pra um garoto de 12 anos.',{rel:{fans:1}}),O('Recusar','Ok.',{})]),
 E('hb2_violao','hob','Violão','Você quer aprender violão.',[O('Contratar professor','Já toca três músicas.',{happy:5,din:-nsW(.05)}),O('Aprender pela internet','Devagar.',{happy:2})]),
 // ---------- FAMÍLIA ----------
 E('fm2_mae','fam','Saudade da mãe','Sua mãe liga dizendo que está com saudade.',[O('Visitar no dia de folga','Abraço de mãe.',{happy:7,en:-4}),O('Mandar flores','Ela ficou feliz.',{happy:3,din:-nsW(.02)})]),
 E('fm2_irmao','fam','Irmão quer jogar','Seu irmão mais novo quer fazer peneira no seu clube.',[O('Ajudar ele a treinar','Ele está evoluindo.',{happy:4,en:-4}),O('Deixar ele seguir o caminho dele','Respeito.',{})]),
 E('fm2_avo','fam','Avô doente','Seu avô está internado e pergunta por você.',[O('Ir visitar','Ele ficou radiante.',{happy:5,en:-6}),O('Ligar por vídeo','Ele gostou.',{happy:2})]),
 E('fm2_tio','fam','Tio na política','Um tio candidato quer usar sua imagem na campanha.',[O('Recusar: futebol é futebol','Família um pouco chateada.',{happy:-2,rel:{fans:2}}),O('Ajudar o tio','Metade da torcida não gostou.',{rel:{fans:-6}})]),
 // ---------- LOTERIA ----------
 E('lt2_bolao','lot','Bolão do elenco','O elenco fez bolão da loteria acumulada.',[OC('Entrar',.08,'GANHARAM! Prêmio dividido.',{din:nsW(5),rel:{team:5}},'Não deu nada.',{din:-nsW(.02),rel:{team:2}}),O('Ficar de fora','E se ganharem?',{})],A18),
 E('lt2_raspa','lot','Raspadinha','Um torcedor te dá uma raspadinha de presente.',[OC('Raspar',.2,'Ganhou um troco!',{din:nsW(.1)},'Nada.',{}),O('Guardar de lembrança','Ok.',{})],A18),
 // ---------- LADO ERRADO ----------
 E('cr2_carro','crime','Carro sem procedência','Um conhecido oferece um carrão muito barato, sem documento.',[O('Recusar','Esperto.',{}),O('Comprar','Bonito… e perigoso.',{heat:25,happy:4,din:-nsW(.5)})],A18),
 E('cr2_rifa','crime','Rifa falsa','Alguém está fazendo rifa com seu nome sem permissão.',[O('Denunciar','Golpista preso.',{rel:{fans:3}}),O('Deixar pra lá','Torcedores enganados.',{rel:{fans:-3}})]),
 E('cr2_fuga','crime','Blitz','Você é parado numa blitz e esqueceu a carteira de motorista.',[O('Explicar e aceitar a multa','Resolvido.',{din:-nsW(.05)}),OC('Oferecer “um agrado”',.5,'Passou.',{heat:15},'Era corregedoria. Preso!',{preso:4,rel:{fans:-8}})],{a:18,c:()=>nsHasV()}),
 E('cr2_amigo','crime','Amigo procurado','Um amigo de infância procurado pela polícia pede pra se esconder na sua casa.',[O('Recusar','Doeu, mas foi certo.',{happy:-3}),O('Esconder','Polícia de olho em você.',{heat:35})],A18),
 // ---------- TRIBUNAL ----------
 E('lw2_vizinho','law','Vizinho processa','O vizinho diz que a bola da sua casa quebrou a janela dele.',[O('Pagar a janela','Paz no condomínio.',{din:-nsW(.05)}),O('Brigar na justiça','Perdeu tempo e dinheiro.',{din:-nsW(.2)})],HOME),
 E('lw2_imagem','law','Uso de imagem','Uma loja usa sua foto sem autorização.',[OC('Processar',.7,'Ganhou indenização.',{din:nsW(.8)},'Perdeu por detalhe.',{din:-nsW(.2)}),O('Mandar notificação','Tiraram a foto.',{})]),
 E('lw2_clube','law','Processo contra o clube','O clube te deve bônus e não pagou. Dá pra entrar na justiça.',[O('Entrar na justiça','Recebeu, mas a diretoria ficou fria.',{din:nsW(1),rel:{coach:-4}}),O('Negociar','Pagaram parcelado.',{din:nsW(.4)})]),
 // ---------- EXTERIOR ----------
 E('ab2_arabia','abroad','Proposta milionária','Um clube árabe acena com salário enorme.',[O('Pedir ao agente pra conversar',()=>{try{const c=CLUBS.filter(x=>x.l&&/SAU|KSA|ARA/.test(x.l));const o=nsOfferFrom(pick(c.length?c:CLUBS));if(o){S.n.offers=S.n.offers||[];S.n.offers.push(o);return'Proposta no Mercado!'}}catch(e){}return'Eles desistiram.'},{}),O('Dizer que o sonho é a Europa','Torcida gostou.',{rel:{fans:2}})],{c:()=>S.n.star.l>=3}),
 E('ab2_idioma','abroad','Aprender o idioma','Você joga fora e ainda não fala a língua local.',[O('Aulas intensivas','Já conversa com o elenco.',{rel:{team:5},en:-4}),O('Usar tradutor','Funciona mais ou menos.',{})],{c:()=>{try{return LG[club().l].c!=='BRA'}catch(e){return false}}}),
 E('ab2_saudade','abroad','Saudade de casa','Você sente falta da comida e da família.',[O('Trazer a família','Tudo melhor.',{happy:8,din:-nsW(.5)}),O('Achar um restaurante brasileiro','Feijão salvou.',{happy:3})],{c:()=>{try{return LG[club().l].c!=='BRA'}catch(e){return false}}}),
 // ---------- CONTRATO ----------
 E('ct2_aum','ct','Pedir aumento','Você está jogando bem. Hora de pedir aumento?',[OC('Pedir',.45,'A diretoria deu um aumento!',{din:nsW(.5),happy:4},'Disseram que só na renovação.',{happy:-2}),O('Esperar a renovação','Paciência.',{})]),
 E('ct2_multa','ct','Multa rescisória','Você descobre que sua multa é baixa e clubes grandes sabem disso.',[O('Pedir pra aumentar a multa','O clube adorou.',{rel:{coach:3}}),O('Deixar como está','Porta aberta.',{})]),
 E('ct2_luvas','ct','Bônus de permanência','A diretoria oferece bônus se você prometer ficar até o fim do ano.',[O('Aceitar','Dinheiro na conta.',{din:nsW(.8),rel:{coach:2}}),O('Recusar','Liberdade.',{})]),
 // ---------- MERCADO ----------
 E('mk2_janela','mkt','Janela aberta','A janela de transferências abriu e seu nome está na lista de vários clubes.',[O('Pedir pro agente sondar',()=>{try{const o=nsOfferFrom(pick(CLUBS.filter(x=>Math.abs(x.s-(club().s||60))<10&&x.id!==club().id)));if(o){S.n.offers=S.n.offers||[];S.n.offers.push(o);return'Chegou proposta!'}}catch(e){}return'Ninguém fez proposta.'},{}),O('Dizer que fica','Torcida feliz.',{rel:{fans:3}})]),
 E('mk2_troca','mkt','Troca','O clube quer te usar numa troca com outro clube.',[O('Aceitar conversar','O técnico ficou surpreso.',{rel:{coach:-2}}),O('Recusar','O clube respeitou.',{rel:{fans:2}})]),
 E('mk2_empr','mkt','Empréstimo','Um clube menor quer você emprestado pra jogar mais.',[O('Topar ouvir',()=>{try{const o=nsOfferFrom(pick(CLUBS.filter(x=>x.s<(club().s||60)&&x.s>(club().s||60)-15)));if(o){S.n.offers=S.n.offers||[];S.n.offers.push(o);return'Proposta no Mercado.'}}catch(e){}return'Não deu em nada.'},{}),O('Brigar pela vaga aqui','O técnico gostou.',{rel:{coach:3}})]),
 // ---------- TROFÉUS ----------
 E('tf2_replica','troph','Réplica da taça','Uma loja quer vender réplicas da taça que você ganhou.',[O('Autorizar com o seu nome','Vendeu muito.',{din:nsW(.3),rel:{fans:3}}),O('Recusar','Ok.',{})],{c:()=>(S.titles||[]).length>0}),
 E('tf2_desfile','troph','Desfile do título','A cidade quer fazer desfile em carro aberto.',[O('Ir em cima do caminhão','Inesquecível.',{rel:{fans:8},happy:6,en:-8}),O('Ir e voltar cedo','Ótimo.',{rel:{fans:4}})],{c:()=>(S.titles||[]).length>0}),
 E('tf2_premio','troph','Melhor do mês','Você foi eleito melhor jogador do mês pela torcida.',[O('Agradecer em vídeo','Torcida feliz.',{rel:{fans:4},star:.3}),O('Dedicar ao elenco','Elenco unido.',{rel:{team:4}})],{c:()=>S.n.star.l>=2}),
 // ---------- ARTILHARIA ----------
 E('ar2_aposta','art','Aposta com o artilheiro','O artilheiro rival te desafia: quem fizer mais gols paga um jantar.',[O('Aceitar','Motivação extra.',{happy:3,rel:{fans:2}}),O('Recusar','Sem pressão.',{})]),
 E('ar2_jejum','art','Jejum de gols','Você está há vários jogos sem marcar e a imprensa comenta.',[O('Treino extra de finalização','Pé calibrado.',{sk:{for:1},en:-8}),O('Ignorar a imprensa','Cabeça fria.',{happy:2})],{c:()=>S.pos!=='GOL'}),
 E('ar2_bola','art','Bola do hat-trick','Você guardou a bola de um jogo especial. Um colecionador quer comprar.',[O('Vender','Bom dinheiro.',{din:nsW(.4)}),O('Guardar','Lembrança.',{happy:3})]),
 // ---------- FAMA ----------
 E('tv2_reality','tv','Reality show','Um reality show quer você como convidado especial.',[O('Participar','Fama nas alturas.',{star:.7,en:-10,rel:{coach:-3}}),O('Recusar','Foco no futebol.',{rel:{coach:2}})],{c:()=>S.n.star.l>=3}),
 E('tv2_podcast','tv','Podcast','Um podcast famoso quer você numa entrevista longa.',[OC('Ir',.6,'Entrevista ótima.',{star:.5,rel:{fans:3}},'Uma fala polêmica viralizou.',{rel:{coach:-4,fans:-2},star:.4}),O('Recusar','Ok.',{})]),
 E('tv2_album','tv','Figurinha','Você está no álbum de figurinhas do campeonato.',[O('Comprar pacotes pra achar a sua','Achou! Foto épica.',{happy:4,din:-nsW(.02)}),O('Pedir pro clube','Ganhou uma caixa.',{happy:2})]),
 E('tv2_novela','tv','Participação em novela','Uma novela quer uma cena com você.',[O('Gravar','Atuou mal, mas virou meme bom.',{star:.5,en:-6}),O('Recusar','Cada um no seu.',{})],{c:()=>S.n.star.l>=3}),
 E('tv2_doc','tv','Documentário','Uma plataforma quer gravar um documentário sobre sua vida.',[O('Topar','Mostrou suas origens.',{star:.6,rel:{fans:5},en:-6}),O('Não agora','Privacidade.',{})],{c:()=>S.n.star.l>=4}),
 // ---------- EXTRAS MISTOS ----------
 E('x3_doacao','fans','Campanha solidária','A cidade sofreu com enchentes. O clube organizou doações.',[O('Doar uma boa quantia','Herói fora de campo.',{din:-nsW(1),rel:{fans:8},happy:5}),O('Ajudar a carregar caminhões','Gesto simples e forte.',{rel:{fans:5},en:-8})]),
 E('x3_escola','fam','Escolinha com seu nome','Seu bairro quer abrir uma escolinha de futebol com seu nome.',[O('Bancar a escolinha','Orgulho do bairro.',{din:-nsW(1.5),happy:7,rel:{fans:4}}),O('Emprestar o nome','Ajudou do seu jeito.',{rel:{fans:2}})]),
 E('x3_mascote','team','Fantasia de mascote','Um companheiro aposta que você não tem coragem de entrar vestido de mascote no treino.',[O('Aceitar o desafio','O técnico chorou de rir.',{rel:{team:5,coach:2}}),O('Recusar','Sem graça.',{})]),
 E('x3_juiz','coach','Reclamação do árbitro','No último jogo você reclamou muito do árbitro e a federação pode punir.',[O('Pedir desculpas públicas','Escapou da punição.',{rel:{coach:2}}),O('Manter a crítica','Multa da federação.',{din:-nsW(.2),rel:{fans:2}})]),
 E('x3_hino','fans','Hino nacional','Você foi chamado pra cantar o hino no evento do clube.',[OC('Cantar',.5,'Emocionou todo mundo.',{rel:{fans:5}},'Esqueceu a letra no meio.',{star:.3,rel:{fans:1}}),O('Pedir pra outro','Ok.',{})]),
 E('x3_cachorro','home','Cachorro abandonado','Um cachorro abandonado aparece no CT e fica atrás de você.',[O('Adotar','Novo melhor amigo.',{happy:6,rel:{fans:3}}),O('Levar pra um abrigo','Ele foi adotado depois.',{happy:2})]),
 E('x3_dente','look','Lentes nos dentes','Um dentista oferece lentes de porcelana de graça em troca de post.',[O('Fazer','Sorriso de estrela.',{rel:{fans:1},happy:3}),O('Recusar','Sorriso natural.',{})]),
 E('x3_biografia','edu','Biografia','Uma editora quer escrever sua biografia.',[O('Topar','Livro nas livrarias.',{din:nsW(.5),star:.4}),O('Ainda é cedo','Muita história pela frente.',{})],{c:()=>S.age>=24}),
 E('x3_cafe','lux','Cafeteria','Um amigo quer abrir uma cafeteria com você de sócio.',[OC('Investir',.5,'A cafeteria bombou!',{din:nsW(1)},'Fechou em seis meses.',{din:-nsW(1.2)}),O('Recusar','Ok.',{})],A18),
 E('x3_quadra','fam','Quadra do bairro','A quadra onde você começou está abandonada.',[O('Reformar a quadra','O bairro fez festa.',{din:-nsW(1),happy:6,rel:{fans:4}}),O('Postar pedindo ajuda à prefeitura','Reformaram meses depois.',{rel:{fans:2}})]),
 E('x3_ex','gf','Ex reaparece','Uma ex manda mensagem dizendo que sente sua falta.',[O('Responder com educação e encerrar','Maduro.',{}),O('Mostrar pra namorada','Ela gostou da sinceridade.',{rel:{gf:5}}),OC('Responder demais',.3,'Nada aconteceu.',{},'Vazou print. Crise!',{rel:{gf:-12},star:.3})],GF),
 E('x3_selecao','coach','Convocação de base','A seleção de base te chamou pra um período de treinos.',[O('Ir com tudo','Experiência valiosa.',{sk:{tec:1,vis:1},en:-10,star:.3}),O('Pedir dispensa','O clube agradeceu.',{rel:{coach:3}})],{c:()=>S.age<=21}),
 E('x3_estadio','fans','Visita guiada','O clube quer que você apareça de surpresa no tour do estádio.',[O('Aparecer','Turistas em êxtase.',{rel:{fans:5},en:-3}),O('Não dá hoje','Ok.',{})]),
 E('x3_nutri','train','Balança','A pesagem semanal mostrou 2 kg acima.',[O('Dieta rigorosa','Voltou ao peso.',{en:-4,rel:{coach:2}}),O('Treino extra','Queimou tudo.',{en:-10,sk:{for:1}})]),
 E('x3_moto','car','Moto','Você quer comprar uma moto, mas o contrato proíbe.',[O('Respeitar o contrato','Profissional.',{}),OC('Comprar escondido',.6,'Ninguém soube.',{happy:5,din:-nsW(.3)},'O clube descobriu. Multa!',{din:-nsW(1),rel:{coach:-5}})],A18),
 E('x3_bet2','bet','Grupo de apostas','Te adicionaram num grupo que vende “dicas certeiras”.',[O('Sair do grupo','Livre de golpe.',{}),OC('Comprar a dica',.2,'Acertou!',{din:nsW(.5)},'Golpe, claro.',{din:-nsW(.3)})],A18),
 E('x3_vovo','fam','Receita da vó','Sua avó manda marmita toda semana pro CT.',[O('Dividir com o elenco','Fã-clube da sua avó.',{rel:{team:5},happy:4}),O('Guardar só pra você','Comida de vó é sagrada.',{happy:5})]),
 E('x3_eleicao','tv','Pergunta política','Um repórter pede sua opinião sobre a eleição.',[O('Dizer que prefere falar de futebol','Saiu bem.',{}),O('Opinar','Metade da torcida amou, a outra odiou.',{rel:{fans:-4},star:.3})]),
 E('x3_cachaca','party','Comemoração do título regional','O elenco quer comemorar a noite toda.',[O('Comemorar junto','Elenco unido.',{rel:{team:6},en:-15,happy:5}),O('Comemorar e ir cedo','Equilíbrio.',{rel:{team:3},en:-5})],{a:18,c:()=>(S.titles||[]).length>0}),
 E('x4_fa','fans','Fã-clube oficial','Torcedores querem fundar seu fã-clube oficial e pedem uma camisa autografada por mês.',[O('Apoiar o fã-clube','Seu nome nas arquibancadas.',{rel:{fans:6},star:.3}),O('Agradecer, mas sem compromisso','Ok.',{rel:{fans:1}})]),
 E('x4_meme','fofo','Virou meme','Um lance seu errado virou o meme da semana no Fofocagram.',[O('Entrar na brincadeira','A internet te abraçou.',{rel:{fans:4},star:.4}),O('Ficar bravo nas redes','O meme ficou maior.',{rel:{fans:-3},star:.3})]),
 E('x4_disc','coach','Discurso no vestiário','O técnico pede pra você falar com o grupo antes da decisão.',[OC('Fazer um discurso de arrepiar',.6,'O time entrou em campo pegando fogo.',{rel:{team:6,coach:4}},'Gaguejou e alguém riu.',{rel:{team:1}}),O('Passar a palavra pro capitão','Humilde.',{rel:{team:2}})]),
 E('x4_gelo','med','Banheira de gelo','O fisiologista recomenda banheira de gelo depois de cada jogo.',[O('Encarar o gelo','Recuperação bem mais rápida.',{en:10,happy:-2}),O('Preferir massagem','Relaxante.',{en:5,din:-nsW(.05)})]),
 E('x4_app','car','Motorista rival','Você pegou um carro de aplicativo e o motorista é torcedor fanático do rival.',[O('Puxar papo e rir junto','Ele pediu foto no fim.',{rel:{fans:2},happy:2}),O('Ficar quieto o caminho todo','Viagem silenciosa.',{})],{c:()=>!nsHasV()})
);}
