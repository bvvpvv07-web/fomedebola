// ================== MOMENTOS DE DECISÃO (no lugar da jogabilidade dentro dos jogos) ==================
// Enquanto a jogabilidade dos lances é refeita, todo lance vira uma decisão: você lê a situação, escolhe
// o que fazer e o resultado sai dos seus atributos, da situação e de um pouco de sorte.
// Também entram vários momentos de jogo novos (provocação, árbitro, cansaço, fair play, comemoração...).
const DECIDE_MODE=true;
const NM_LANCE=nssMoment; // o motor de lances fica guardado pra quando voltar
const DM_ATTR={FIN:'Finalização',PAS:'Passe',DRI:'Drible',VEL:'Velocidade',FIS:'Físico',MEN:'Mental',DEF:'Defesa',REF:'Reflexo'};
function dmSk(k){try{return typeof skillOf==='function'?skillOf(k):.6}catch(e){return .6}}
// o = {t:opção, a:atributo, b:chance base, ok/bad: textos, big/badBig, perf: jogada de craque, ast: vira assistência, last: texto pro pênalti}
const DM_LANCE={
 finish:[
  {ic:'🥅',t:'Cara a cara com o goleiro',d:'Lançamento nas costas da zaga. Você domina e só tem o goleiro pela frente.',o:[
   {t:'Bater rasteiro no canto',a:'FIN',b:.62,ok:'Rasteiro, colado na trave. Sem chance pro goleiro.',bad:'O goleiro se esticou todo e tirou com a ponta dos dedos.'},
   {t:'Driblar o goleiro',a:'DRI',b:.5,perf:true,ok:'Corte seco, goleiro no chão, gol de quem tem calma.',bad:'Ele leu o drible e abraçou a bola.'},
   {t:'Cavadinha',a:'FIN',b:.4,perf:true,ok:'Cavadinha por cima, a bola morre na rede. O estádio explode.',bad:'Pegou embaixo demais. A bola subiu e o goleiro segurou.'},
   {t:'Rolar pro companheiro livre',a:'PAS',b:.68,ast:true,ok:'Você rola, ele só empurra. Gol do time e assistência sua.',bad:'O zagueiro voltou de carrinho e cortou o passe.'}]},
  {ic:'💥',t:'Sobra na entrada da área',d:'A bola espirra na zaga e cai no seu pé, a uns 20 metros do gol.',o:[
   {t:'Bater de primeira, forte',a:'FIN',b:.4,perf:true,ok:'Pancada de primeira no ângulo! Golaço.',bad:'Pegou mal e a bola foi pra arquibancada.'},
   {t:'Dominar e ajeitar pro pé bom',a:'FIN',b:.5,ok:'Ajeitou, olhou e colocou no canto. Gol.',bad:'Enquanto você ajeitava, o volante chegou e travou.'},
   {t:'Tocar pro lado e infiltrar',a:'PAS',b:.55,ast:true,ok:'Tabela rápida, o companheiro finaliza e marca. Assistência sua.',bad:'A tabela não saiu, a bola ficou com a zaga.'}]},
  {ic:'🎯',t:'Bola cruzada no segundo pau',d:'Cruzamento passa por todo mundo e chega em você, meio sem ângulo.',o:[
   {t:'Bater de chapa, de primeira',a:'FIN',b:.48,ok:'Chapa firme no contrapé. Gol!',bad:'Sem ângulo, a bola bateu no lado de fora da rede.'},
   {t:'Cabecear pro meio da área',a:'PAS',b:.52,ast:true,ok:'Escorou pro meio e o centroavante só empurrou. Assistência sua.',bad:'O goleiro saiu e socou a bola.'},
   {t:'Tentar de voleio',a:'FIN',b:.3,perf:true,ok:'VOLEIO! A bola entrou no ângulo. Gol pra passar na TV.',bad:'O voleio saiu torto, lá no alto.'}]},
  {ic:'🏃',t:'Contra-ataque, você conduzindo',d:'Puxa o contra-ataque em velocidade. Um zagueiro na frente, um companheiro correndo à esquerda.',o:[
   {t:'Ir pra cima e finalizar',a:'VEL',b:.46,ok:'Passou na velocidade e bateu cruzado. Gol!',bad:'O zagueiro acompanhou e bloqueou o chute.'},
   {t:'Tocar na hora certa',a:'PAS',b:.6,ast:true,ok:'Esperou o zagueiro vir e tocou. Companheiro livre: gol, assistência sua.',bad:'Passou um segundo atrasado, impedimento marcado.'},
   {t:'Parar e esperar o time',a:'MEN',b:.3,ok:'Segurou, o time chegou e você achou o chute no rebote. Gol.',bad:'A defesa se fechou e o lance morreu.'}]},
 ],
 chip:[{ic:'🧤',t:'O goleiro saiu do gol!',d:'Você recebe na entrada da área e o goleiro sai correndo na sua direção.',o:[
   {t:'Cavadinha por cima dele',a:'FIN',b:.55,perf:true,ok:'Cobertura perfeita! A bola passou por cima e entrou devagarinho.',bad:'Faltou força. O goleiro voltou e pegou em cima da linha.'},
   {t:'Driblar pro lado',a:'DRI',b:.5,ok:'Deixou o goleiro no chão e entrou com bola e tudo.',bad:'O goleiro se jogou e tirou a bola do seu pé.'},
   {t:'Bater forte antes dele chegar',a:'FIN',b:.4,ok:'Bateu firme no canto antes do goleiro fechar. Gol.',bad:'A bola bateu no corpo do goleiro.'}]}],
 combo:[{ic:'🔁',t:'Tabela na entrada da área',d:'Você e o camisa 10 trocando passes curtos na frente da zaga.',o:[
   {t:'Devolver de primeira e infiltrar',a:'PAS',b:.55,perf:true,ok:'Tabela de craque! Você recebe na frente do goleiro e marca.',bad:'O zagueiro adivinhou a devolução e cortou.'},
   {t:'Fingir a tabela e chutar',a:'FIN',b:.45,ok:'Todo mundo esperou o passe. Você bateu e fez o gol.',bad:'O chute saiu prensado na zaga.'},
   {t:'Segurar e girar',a:'DRI',b:.42,ok:'Girou em cima do volante e bateu no canto. Gol.',bad:'Cercado por dois, perdeu a bola.'}]}],
 dribble:[
  {ic:'🕺',t:'Um contra um na ponta',d:'O lateral está sozinho com você, dando espaço pra dentro.',o:[
   {t:'Corte pra dentro e chute',a:'DRI',b:.48,ok:'Cortou pra dentro e bateu colocado. Gol!',bad:'O lateral fechou o corte e travou.'},
   {t:'Caneta',a:'DRI',b:.32,perf:true,ok:'CANETA! E ainda bateu cruzado pro gol. A torcida foi à loucura.',bad:'Ele fechou as pernas. Bola perdida.'},
   {t:'Ir pro fundo e cruzar',a:'VEL',b:.55,ast:true,ok:'Ganhou na corrida, cruzou rasteiro e o centroavante marcou. Assistência.',bad:'O cruzamento bateu no zagueiro e saiu.'}]},
  {ic:'🌀',t:'Cercado por dois no meio',d:'Dois marcadores fecham você perto da meia-lua.',o:[
   {t:'Elástico e arrancada',a:'DRI',b:.36,perf:true,ok:'Elástico, passou pelos dois e bateu pro gol. Que jogada!',bad:'Tentou o elástico e o segundo marcador tomou a bola.'},
   {t:'Proteger e esperar a falta',a:'FIS',b:.6,ok:'Segurou o tranco e ganhou a falta na entrada da área. Na cobrança, o companheiro marcou e o lance foi seu.',bad:'Os dois te desarmaram no braço.'},
   {t:'Tocar de lado rápido',a:'PAS',b:.65,ast:true,ok:'Saiu da pressão com um toque e a jogada terminou em gol. Assistência sua.',bad:'O passe saiu curto e foi interceptado.'}]}],
 header:[{ic:'🎯',t:'Escanteio na área',d:'A bola vem fechada na marca do pênalti, você e o zagueiro sobem juntos.',o:[
   {t:'Testada firme pro chão',a:'FIS',b:.46,ok:'Subiu mais alto e testou pro chão. Gol de cabeça!',bad:'O zagueiro subiu junto e a bola saiu fraca.'},
   {t:'Desviar de leve pro canto',a:'FIN',b:.4,perf:true,ok:'Raspou de leve, a bola mudou de direção e entrou no canto. Gol!',bad:'O desvio saiu pela linha de fundo.'},
   {t:'Escorar pro meio',a:'PAS',b:.5,ast:true,ok:'Escorou pro meio e o companheiro fuzilou. Assistência de cabeça.',bad:'O goleiro saiu e socou a bola.'}]},
  {ic:'🚀',t:'Cruzamento na corrida',d:'O lateral cruza forte, você vem de trás em velocidade.',o:[
   {t:'Mergulhar de peixinho',a:'VEL',b:.4,perf:true,ok:'PEIXINHO! Gol de cabeça na raça.',bad:'Chegou um passo atrasado.'},
   {t:'Cabecear no contrapé do goleiro',a:'FIN',b:.45,ok:'Cabeçada cruzada, no contrapé. Gol.',bad:'Pegou de raspão e a bola foi pra fora.'}]}],
 fk:[{ic:'🧱',t:'Falta na entrada da área',d:'A barreira está armada com quatro jogadores. O goleiro pede pra fechar o canto.',o:[
   {t:'Por cima da barreira, no ângulo',a:'FIN',b:.32,perf:true,ok:'Por cima da barreira e no ângulo! Golaço de falta.',bad:'Raspou o travessão e saiu.'},
   {t:'Rasteiro, por baixo da barreira',a:'FIN',b:.3,ok:'A barreira pulou e a bola passou por baixo. Gol!',bad:'O último da barreira ficou no chão e bloqueou.'},
   {t:'Forte no canto do goleiro',a:'FIN',b:.28,ok:'Pancada no canto do goleiro, pegou ele no contrapé. Gol.',bad:'O goleiro estava bem posicionado e defendeu.'},
   {t:'Tocar pro lado e alguém chutar',a:'PAS',b:.36,ast:true,ok:'Jogada ensaiada: você rolou e o companheiro bateu no canto. Assistência.',bad:'A zaga saiu rápido e bloqueou.'}]}],
 pass:[
  {ic:'👟',t:'Você tem a bola no meio',d:'Um companheiro dá a diagonal nas costas da zaga, outro pede no pé.',o:[
   {t:'Enfiar a bola na diagonal',a:'PAS',b:.48,perf:true,ok:'Passe milimétrico, ele saiu cara a cara e marcou. Assistência sua.',bad:'O zagueiro leu o passe e interceptou.'},
   {t:'Tocar curto e aproximar',a:'PAS',b:.6,ok:'A troca de passes rápida terminou em gol. Assistência sua.',bad:'O time rodou a bola e o ataque esfriou.'},
   {t:'Lançar por cima da zaga',a:'PAS',b:.4,ok:'Lançamento de 40 metros na medida. Ele dominou e fez. Assistência sua.',bad:'Saiu longo demais, tiro de meta.'}]},
  {ic:'⚡',t:'Meia-lua, zaga mal posicionada',d:'Você recebe de costas e vê o atacante se desmarcando.',o:[
   {t:'Passe de calcanhar',a:'PAS',b:.35,perf:true,ok:'Calcanhar no espaço, o atacante só tocou na saída do goleiro. Assistência de luxo.',bad:'O calcanhar saiu sem força.'},
   {t:'Girar e enfiar',a:'DRI',b:.45,ok:'Girou e enfiou. Gol do companheiro, assistência sua.',bad:'Ao girar, o volante desarmou.'},
   {t:'Abrir na ponta',a:'PAS',b:.58,ok:'Abriu na ponta, o cruzamento veio e o centroavante marcou. Assistência sua no lance.',bad:'O ponta errou o cruzamento.'}]}],
 long:[{ic:'🎯',t:'Lançamento do campo de defesa',d:'Seu atacante dispara nas costas do lateral.',o:[
   {t:'Lançar longo, de primeira',a:'PAS',b:.42,perf:true,ok:'Lançamento de 50 metros na corrida dele. Gol, assistência sua.',bad:'A bola correu demais e saiu pela linha de fundo.'},
   {t:'Lançar alto, pra ele disputar',a:'PAS',b:.5,ok:'Ele ganhou no alto, ajeitou e fez. Assistência sua.',bad:'O zagueiro ganhou de cabeça.'},
   {t:'Sair jogando curto',a:'MEN',b:.55,ok:'Saída limpa, o time trocou passes e chegou ao gol. A jogada começou em você.',bad:'A pressão alta roubou a bola.'}]}],
 cross:[{ic:'↪️',t:'Você chegou na linha de fundo',d:'Na área: centroavante no primeiro pau, meia chegando atrasado no segundo.',o:[
   {t:'Cruzar rasteiro, pra trás',a:'PAS',b:.52,ok:'Rasteiro pra trás, o meia chegou batendo. Gol, assistência sua.',bad:'O zagueiro se jogou e cortou o cruzamento.'},
   {t:'Cruzar alto no segundo pau',a:'PAS',b:.45,ok:'Cruzamento na cabeça do centroavante. Gol! Assistência sua.',bad:'O goleiro saiu do gol e encaixou.'},
   {t:'Tocar curto pro lateral que passou',a:'PAS',b:.48,ok:'Tabelou com o lateral, ele cruzou de primeira e saiu o gol. Assistência sua.',bad:'O lateral demorou e a zaga fechou.'}]}],
 pen:[{ic:'⚪',t:'Pênalti! A bola é sua',d:'O goleiro dança em cima da linha. O estádio inteiro em silêncio.',o:[
   {t:'Rasteiro no canto esquerdo',a:'FIN',b:.72,ok:'Rasteiro no canto, goleiro do outro lado. Gol!',bad:'O goleiro adivinhou o canto e defendeu.',last:'O goleiro segurou.'},
   {t:'Forte no ângulo direito',a:'FIN',b:.66,ok:'Na gaveta! Sem chance.',bad:'Pegou forte demais e mandou pra fora.',last:'Pra fora!'},
   {t:'Paradinha e deslocar',a:'MEN',b:.7,perf:true,ok:'Paradinha, goleiro caiu primeiro e você rolou do outro lado. Gol!',bad:'O goleiro esperou até o fim e espalmou.',last:'Espalmou!'},
   {t:'Cavadinha no meio',a:'MEN',b:.56,perf:true,ok:'Cavadinha! Que frieza. Gol!',bad:'O goleiro ficou parado no meio e pegou fácil.',last:'O goleiro segurou.'}]}],
 keeper:[
  {ic:'🧤',t:'Chute à queima-roupa!',d:'O atacante recebe livre na pequena área e vai bater.',o:[
   {t:'Fechar o ângulo e abrir os braços',a:'REF',b:.48,ok:'Saiu na hora certa e a bola bateu no seu corpo. Defesaça!',bad:'Ele bateu por baixo das suas pernas.'},
   {t:'Esperar em pé até o último segundo',a:'MEN',b:.42,ok:'Esperou até ele bater e voou no canto. Que defesa!',bad:'O chute saiu no canto que você não esperava.'},
   {t:'Sair nos pés dele',a:'FIS',b:.38,perf:true,ok:'Saiu nos pés com coragem e ficou com a bola.',bad:'Ele tocou por cima de você.'}]},
  {ic:'🚀',t:'Chute de longe com efeito',d:'O meia acerta uma pancada de fora da área, a bola vem fazendo curva.',o:[
   {t:'Espalmar pra escanteio',a:'REF',b:.6,ok:'Espalmou por cima do travessão. Escanteio.',bad:'A curva enganou e a bola entrou.'},
   {t:'Tentar encaixar',a:'REF',b:.45,perf:true,ok:'Encaixou firme! Nada de rebote.',bad:'A bola escapou das mãos e entrou.'}]}],
 tackle:[
  {ic:'🛡️',t:'O atacante vem pra cima',d:'Contra-ataque deles. Ele conduz rápido e só você está entre ele e o gol.',o:[
   {t:'Dar o bote quando a bola sair do pé',a:'DEF',b:.5,perf:true,ok:'Esperou o toque mais longo e tirou limpo. Desarme!',bad:'Ele puxou pro lado e passou.',last:'Driblado.'},
   {t:'Acompanhar e fechar o chute',a:'VEL',b:.55,ok:'Foi junto, de frente, e ele chutou em você.',bad:'Ele cortou pro meio e bateu no canto.',last:'Passou por você.'},
   {t:'Dar o carrinho',a:'FIS',b:.4,ok:'Carrinho perfeito, só na bola!',bad:'Chegou atrasado e derrubou. Falta perigosa.',last:'Falta.'}]},
  {ic:'✂️',t:'Vão tocar pro centroavante',d:'O ponta deles vai cruzar rasteiro pro atacante que você marca.',o:[
   {t:'Antecipar e cortar a linha do passe',a:'DEF',b:.5,perf:true,ok:'Leu o passe e cortou na frente dele!',bad:'Antecipou cedo demais e ele ficou livre.',last:'Ficou livre.'},
   {t:'Ficar colado no atacante',a:'FIS',b:.55,ok:'Grudou nele e ele nem conseguiu finalizar.',bad:'Ele girou em cima de você e chutou.',last:'Girou e chutou.'}]}],
 keeperPen:[{ic:'🧤',t:'Pênalti contra',d:'O batedor ajeita a bola e olha pro seu canto esquerdo.',o:[
   {t:'Pular no canto que ele olhou',a:'REF',b:.32,ok:'Ele bateu onde olhou e você voou junto. DEFENDEU!',bad:'Era blefe. Ele bateu do outro lado.',last:'Foi no canto.'},
   {t:'Pular no outro canto',a:'REF',b:.32,ok:'Você leu o blefe e espalmou! DEFENDEU!',bad:'Ele bateu exatamente onde olhou.',last:'Foi no canto.'},
   {t:'Ficar no meio',a:'MEN',b:.22,perf:true,ok:'Ele tentou a cavadinha e você ficou parado esperando. DEFENDEU!',bad:'Ele bateu no canto, sem chance.',last:'Foi no canto.'},
   {t:'Esperar até o último segundo',a:'MEN',b:.3,ok:'Esperou ele bater e foi buscar. DEFENDEU!',bad:'A bola foi forte demais pro tempo de reação.',last:'Foi no canto.'}]}],
};
// momentos de jogo (fora dos lances de gol)
const DM_MATCH=[
 {id:'provoca',ic:'😤',t:'O zagueiro está te provocando',d:'Ele passou o jogo inteiro falando no seu ouvido e dando pisão escondido.',o:[
  {t:'Ignorar e jogar',a:'MEN',b:.75,ok:'Você respondeu com futebol. A torcida aplaudiu.',bad:'Ficou com a cabeça quente e sumiu do jogo por uns minutos.',fx:{cab:2},fxBad:{cab:-2}},
  {t:'Responder com um drible humilhante',a:'DRI',b:.45,ok:'Chapéu nele! Ele ficou louco e levou amarelo.',bad:'Tentou humilhar e perdeu a bola. Ele riu.',fx:{fama:3},fxBad:{cab:-3}},
  {t:'Dar uma entrada mais forte',a:'FIS',b:.35,ok:'Chegou firme na bola. Ele parou de falar.',bad:'O árbitro viu tudo. Cartão amarelo pra você.',fx:{},fxBad:{disc:-3},yBad:true}]},
 {id:'simula',ic:'🎭',t:'Contato na área',d:'O zagueiro encosta em você dentro da área. Dá pra cair.',o:[
  {t:'Seguir de pé e tentar a jogada',a:'DRI',b:.4,ok:'Seguiu de pé e bateu cruzado. GOL!',bad:'Perdeu o equilíbrio e a bola saiu.',goal:true},
  {t:'Cair e pedir pênalti',a:'MEN',b:.3,ok:'O árbitro deu! Pênalti convertido pelo batedor do time.',bad:'O VAR chamou: simulação. Cartão amarelo.',assistOk:true,yBad:true,fxBad:{fama:-2}},
  {t:'Proteger e esperar o apoio',a:'FIS',b:.6,ok:'Segurou a bola e tocou pro companheiro, que chutou e fez. Assistência.',bad:'A zaga se recompôs.',ast:true}]},
 {id:'arbitro',ic:'🟨',t:'O árbitro marcou contra vocês',d:'Falta inexistente, e o time inteiro cercou o juiz.',o:[
  {t:'Puxar o time e pedir calma',a:'MEN',b:.8,ok:'Você acalmou todo mundo. O treinador gostou.',bad:'Ninguém te ouviu, mas você ficou fora da confusão.',fx:{board:2,cab:1}},
  {t:'Reclamar firme com o árbitro',a:'MEN',b:.4,ok:'Ele ouviu e disse que vai prestar mais atenção.',bad:'Cartão amarelo por reclamação.',yBad:true,fx:{fama:1}},
  {t:'Bater boca com todo mundo',a:'MEN',b:.15,ok:'Sobrou pra todo mundo, menos pra você.',bad:'Perdeu a cabeça: cartão vermelho direto!',rBad:true,fxBad:{disc:-6,fama:-3}}]},
 {id:'cansaco',ic:'🥵',t:'Aos 75 minutos, você está morto',d:'As pernas pesam. O preparador físico olha pra você do banco.',o:[
  {t:'Pedir pra sair',a:'MEN',b:.9,ok:'Saiu aplaudido. Corpo preservado.',bad:'Saiu e o time sentiu.',fx:{corpo:2}},
  {t:'Seguir no sacrifício',a:'FIS',b:.55,ok:'Na raça, ainda deu um passe que virou gol. Assistência!',bad:'Sentiu a coxa. Lesão leve.',ast:true,injBad:2},
  {t:'Ficar mais recuado e economizar',a:'MEN',b:.7,ok:'Segurou o resultado ajudando na marcação.',bad:'Fez pouco, mas também não comprometeu.'}]},
 {id:'falta_comp',ic:'🤝',t:'Quem bate a falta?',d:'Falta perigosa. O camisa 10 do seu time já pegou a bola.',o:[
  {t:'Deixar ele bater',a:'MEN',b:.35,ok:'Ele bateu no ângulo e veio te abraçar. Vestiário unido.',bad:'Ele mandou na barreira.',fx:{cab:2},assistOk:false,teamGoal:true},
  {t:'Pedir a bola',a:'FIN',b:.3,ok:'Você bateu e fez um golaço de falta!',bad:'Mandou por cima. Ele te olhou torto.',goal:true,fxBad:{cab:-2}},
  {t:'Jogada ensaiada: você rola pra ele',a:'PAS',b:.34,ok:'Rolou e ele bateu forte. Gol, assistência sua.',bad:'A barreira saiu e bloqueou.',ast:true}]},
 {id:'dividida',ic:'⚔️',t:'Bola dividida no meio-campo',d:'Bola dividida, o volante adversário vem de carrinho.',o:[
  {t:'Entrar firme na bola',a:'FIS',b:.6,ok:'Ganhou a dividida e puxou o contra-ataque.',bad:'Chegou atrasado: cartão amarelo.',yBad:true},
  {t:'Tirar o pé',a:'MEN',b:.85,ok:'Preservou o corpo, o time recuperou na sequência.',bad:'O adversário saiu com a bola.'},
  {t:'Dar um toque antes dele chegar',a:'DRI',b:.45,ok:'Tocou antes e ele passou direto. Contra-ataque que terminou em gol do time. Assistência!',bad:'Ele chegou junto e você sentiu o tornozelo.',ast:true,injBad:1}]},
 {id:'fairplay',ic:'🏳️',t:'Adversário caído no chão',d:'Um jogador deles ficou caído. Você está com a bola no ataque.',o:[
  {t:'Botar a bola pra fora',a:'MEN',b:.95,ok:'Fair play. O estádio inteiro aplaudiu, até a torcida rival.',bad:'Gesto bonito, ninguém esquece.',fx:{fama:2,cab:1}},
  {t:'Seguir a jogada',a:'FIN',b:.45,ok:'Seguiu e fez o gol. Mas os rivais ficaram furiosos com você.',bad:'Seguiu e perdeu a bola. Vaias.',goal:true,fx:{fama:-2},fxBad:{fama:-3}}]},
 {id:'escanteio',ic:'⏱️',t:'Último minuto, escanteio a favor',d:'Acréscimos. O técnico grita pra todo mundo subir.',o:[
  {t:'Subir pra área',a:'FIS',b:.3,ok:'Subiu mais que todo mundo: GOL nos acréscimos!',bad:'A zaga afastou e o contra-ataque quase saiu.',goal:true},
  {t:'Ficar na entrada da área pro rebote',a:'FIN',b:.25,ok:'Sobrou na entrada da área e você mandou de primeira. Gol!',bad:'O rebote não veio.',goal:true},
  {t:'Ficar atrás segurando o contra-ataque',a:'DEF',b:.85,ok:'Segurou o contra-ataque e o resultado.',bad:'Nada aconteceu.'}]},
 {id:'comemora',ic:'🎉',t:'O time fez um gol',d:'O estádio explodiu. Todos correm pra comemorar.',o:[
  {t:'Correr pra torcida',a:'MEN',b:.95,ok:'A torcida cantou seu nome.',bad:'A torcida cantou seu nome.',fx:{fans:3,fama:1}},
  {t:'Provocar a torcida rival',a:'MEN',b:.6,ok:'Viralizou. Odiado por uns, idolatrado por outros.',bad:'Cartão amarelo por provocação.',yBad:true,fx:{fama:4,disc:-2}},
  {t:'Abraçar o banco de reservas',a:'MEN',b:.95,ok:'O vestiário gostou. Time unido.',bad:'O vestiário gostou.',fx:{cab:2,board:1}}],cond:o=>o.gu>0},
 {id:'lesao',ic:'🩹',t:'Você sentiu a coxa',d:'Uma fisgada depois de um pique. O médico pergunta se dá pra continuar.',o:[
  {t:'Pedir substituição',a:'MEN',b:.9,ok:'Saiu na hora certa. Nada grave.',bad:'Saiu na hora certa.',fx:{corpo:1}},
  {t:'Continuar com dor',a:'FIS',b:.45,ok:'Aguentou e ainda participou do gol. Assistência!',bad:'Piorou. Vai ficar uns jogos fora.',ast:true,injBad:3}]},
 {id:'contra',ic:'💨',t:'Contra-ataque 3 contra 2',d:'Você puxa no meio, um companheiro de cada lado.',o:[
  {t:'Tocar pro da direita',a:'PAS',b:.55,ok:'Passe na medida, ele bateu cruzado. Gol, assistência sua!',bad:'Passe forte demais, saiu.',ast:true},
  {t:'Ir até o fim e bater',a:'FIN',b:.4,ok:'Foi até o fim e bateu no canto. GOL!',bad:'O zagueiro fechou e o goleiro defendeu.',goal:true},
  {t:'Fingir o passe e cortar',a:'DRI',b:.38,perf:true,ok:'Fingiu, cortou o zagueiro e tocou na saída do goleiro. Golaço!',bad:'O zagueiro não caiu na finta.',goal:true}]},
 {id:'goleiro_rep',ic:'🧤',t:'Você está com a bola nas mãos',d:'O time adversário está todo no ataque e tem gente sua livre lá na frente.',pos:'GOL',o:[
  {t:'Reposição longa e rápida',a:'PAS',b:.4,ok:'Lançamento com a mão até o meio-campo e contra-ataque que virou gol. Assistência de goleiro!',bad:'A bola foi direto pra zaga deles.',ast:true},
  {t:'Segurar e esfriar o jogo',a:'MEN',b:.9,ok:'Esfriou o jogo. O time respirou.',bad:'O árbitro deu um aviso pela demora.'}]},
];
// ---------- UI ----------
function dmChanceLbl(p){return p>=.6?['Alta','hi']:p>=.4?['Média','md']:['Baixa','lo']}
function dmPopup(sc,ctx){return new Promise(res=>{
 const opts=sc.o.map(o=>({...o,p:clamp(o.b+(dmSk(o.a)-.6)*.55+(ctx.bonus||0),.05,.95)}));
 $ov.hidden=false;$ov.innerHTML=`<div class="ovwrap dmpop"><div class="dm-top"><span class="dm-min mono">${ctx.min!=null?ctx.min+"'":'⚽'}</span><span class="eyebrow">${esc(ctx.comp||'')}</span><span class="dm-tag">${esc(ctx.tag||'Decisão')}</span></div>
 <div class="dm-ic">${sc.ic||'⚡'}</div><h2 class="dm-t">${esc(ctx.title||sc.t)}</h2><p class="dm-d">${esc(sc.d)}</p>
 <div class="dm-opts">${opts.map((o,i)=>{const[l,k]=dmChanceLbl(o.p);return`<button class="dm-o" data-i="${i}" style="animation-delay:${.15+i*.07}s"><span class="dm-ot">${esc(o.t)}</span><span class="dm-meta"><small>${esc(DM_ATTR[o.a]||'')}</small><i class="dm-ch ${k}">${l}</i></span></button>`}).join('')}</div><div id="dmR"></div></div>`;
 $ov.querySelectorAll('.dm-o').forEach(b=>b.onclick=async()=>{const o=opts[+b.dataset.i];$ov.querySelectorAll('.dm-o').forEach(x=>{x.disabled=true;if(x!==b)x.classList.add('fade')});b.classList.add('picked');
  const R=document.getElementById('dmR');R.innerHTML='<div class="suspense"><i></i><i></i><i></i></div>';try{SFX.tone({f:520,f2:780,dur:.25,gain:.05})}catch(e){}
  await sleep(950);const ok=ch(o.p);const out=ctx.resolve?ctx.resolve(o,ok):{big:ok?'DEU CERTO!':'NÃO DEU',good:ok};
  try{if(ok){SFX.roar&&ok&&out.big&&/GOL|DEFEND|ASSIST/.test(out.big)?SFX.roar():SFX.tone({f:880,dur:.15,gain:.08})}else SFX.ooh()}catch(e){}
  R.innerHTML=`<div class="dm-res ${out.good?'good':'bad'}"><b>${esc(out.big)}</b><p>${esc(ok?o.ok:o.bad)}</p>${out.chips&&out.chips.length?`<div class="chipsrow">${out.chips.map(([t,k])=>`<span class="chip ${k}">${esc(t)}</span>`).join('')}</div>`:''}</div><button class="btn wide" id="dmOk" style="margin-top:10px">Continuar</button>`;
  document.getElementById('dmOk').onclick=()=>{$ov.hidden=true;$ov.innerHTML='';res({o,ok,out})}})})}
// ---------- substitui o lance jogável ----------
async function decisionMoment(o){const K=o.kind||'finish';const DEF=K==='tackle';const GK=K==='keeper'||DEF;
 NM.netHit=null;NM.intc=null;NM.last='';NM.grade=null;NM.why='';NM.dmAssist=false;
 let pool=DEF?DM_LANCE.tackle:GK?(o.pen?DM_LANCE.keeperPen:DM_LANCE.keeper):(DM_LANCE[K]||DM_LANCE.finish);
 const sc=pick(pool);
 // conselho do adversário: goleiro bom e lance não planejado ficam mais difíceis
 const bonus=(o.planned?.08:-.04)-((o.keeper??.45)-.45)*.3+((o.skill??.6)-.6)*.25+(/Peneira|Treino|Pelada|Pátio/i.test(o.comp||'')?.08:0);
 const isPassK=['pass','long','cross'].includes(K);
 const r=await dmPopup(sc,{comp:o.comp,min:o.min,title:o.title&&!/^(finish|pass|keeper)$/.test(o.title)?o.title:sc.t,tag:DEF?'Desarme':GK?'Defesa':({pass:'Passe',long:'Lançamento',cross:'Cruzamento',dribble:'Drible',header:'Cabeçada',fk:'Falta',pen:'Pênalti',chip:'Cobertura',combo:'Tabela'})[K]||'Finalização',bonus,
  resolve:(op,ok)=>{const ast=!!op.ast&&!GK;let big;
   if(DEF)big=ok?'DESARMOU!':'PASSOU';else if(GK)big=ok?'DEFENDEU!':'GOL DELES';else if(ok)big=ast||isPassK&&!op.mine?'ASSISTÊNCIA!':'GOOOL!';else big=K==='pen'?(op.last==='Pra fora!'?'PRA FORA!':'DEFENDEU!'):'NÃO DEU';
   return{big,good:ok,chips:ok?[[op.perf?'Jogada de craque':'Boa escolha','up']]:[['Faltou pouco','down']]}}});
 const ok=r.ok;const op=r.o;
 if(ok&&op.ast&&!GK&&!isPassK&&o.kind!=='pen')NM.dmAssist=true; // vira assistência em vez de gol seu
 NM.last=ok?(DEF?(o.okTxt||'DESARMOU!'):GK?(o.okTxt||'DEFENDEU!'):(o.okTxt||'GOL!')):(op.last||(GK?'Foi no canto.':K==='pen'?'O goleiro segurou.':isPassK?'Interceptado.':'Pra fora!'));
 const perfect=ok&&(!!op.perf||op.p<.4);NM.grade=ok?(perfect?92:76):40;NM.why=op.t;
 try{if(typeof tele==='function');}catch(e){}
 return{ok,perfect,grade:NM.grade}}
if(DECIDE_MODE){nssMoment=decisionMoment}
// ---------- momentos de jogo novos ----------
async function matchDecision(ctx){const pool=DM_MATCH.filter(m=>(!m.pos||m.pos===S.pos)&&(m.pos||S.pos!=='GOL'||['arbitro','cansaco','fairplay','comemora','lesao','provoca'].includes(m.id))&&(!m.cond||m.cond(ctx)));
 const used=(S.st&&S.st.dmUsed)||[];let cand=pool.filter(m=>!used.includes(m.id));if(!cand.length)cand=pool;const sc=pick(cand);if(S.st){S.st.dmUsed=used.concat(sc.id).slice(-6)}
 const r=await dmPopup(sc,{comp:ctx.comp,min:ctx.min,tag:'Momento de jogo',bonus:0,resolve:(op,ok)=>{const ch2=[];const fx=ok?(op.fx||{}):(op.fxBad||op.fx||{});
   for(const k in fx){if(!fx[k])continue;const lb={cab:'Cabeça',fama:'Fama',disc:'Disciplina',corpo:'Corpo',board:'Diretoria',fans:'Torcida'}[k];ch2.push([`${fx[k]>0?'+':''}${fx[k]} ${lb}`,fx[k]>0?'up':'down'])}
   if(!ok&&op.yBad)ch2.push(['Cartão amarelo','down']);if(!ok&&op.rBad)ch2.push(['Cartão vermelho','down']);if(!ok&&op.injBad)ch2.push(['Lesão','down']);
   const big=ok?(op.goal?'GOOOL!':op.ast?'ASSISTÊNCIA!':op.assistOk?'PÊNALTI!':op.teamGoal?'GOL DO TIME!':'BOA!'):(op.rBad?'EXPULSO!':op.yBad?'AMARELO':op.injBad?'LESÃO':'NÃO DEU');return{big,good:ok&&!(op.fx&&Object.values(op.fx).some(v=>v<0)),chips:ch2}}});
 const op=r.o,ok=r.ok;const fx=ok?(op.fx||{}):(op.fxBad||op.fx||{});
 try{for(const k of['cab','fama','disc','corpo'])if(fx[k])S.life[k]=clamp(S.life[k]+fx[k],0,100);if(fx.board)S.board=clamp((S.board??50)+fx.board,0,100);if(fx.fans&&S.club){S.fans=S.fans||{};S.fans[S.club]=clamp((S.fans[S.club]??55)+fx.fans,0,100)}}catch(e){}
 return{goal:ok&&!!op.goal,assist:ok&&!!(op.ast||op.assistOk||op.teamGoal),teamOnly:ok&&(op.assistOk&&!op.ast||op.teamGoal),y:!ok&&!!op.yBad,r:!ok&&!!op.rBad,inj:!ok&&op.injBad?op.injBad:0}}
IO_UI.matchDecision=matchDecision;
// ---------- estilo ----------
{const st=document.createElement('style');st.textContent=`
.dmpop{max-width:520px}.dm-top{display:flex;align-items:center;gap:8px;margin-bottom:6px}.dm-min{background:var(--accent);color:#1b0d03;font-weight:900;border-radius:8px;padding:2px 8px}.dm-tag{margin-left:auto;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.06em;color:var(--gold)}
.dm-ic{font-size:44px;line-height:1;margin:6px 0;animation:cwPop .45s cubic-bezier(.2,1.4,.4,1) both}.dm-t{font-family:var(--f-display);font-weight:900;font-size:clamp(24px,7vw,32px);line-height:1.02;margin:0 0 6px;text-transform:uppercase;font-style:italic}.dm-d{color:var(--muted);margin:0 0 12px}
.dm-opts{display:grid;gap:8px}.dm-o{display:flex;align-items:center;gap:10px;text-align:left;padding:13px 14px;border-radius:14px;background:rgba(255,255,255,.05);border:1px solid var(--line-2);color:var(--chalk);font:inherit;animation:pop .35s both}
.dm-o:hover{border-color:var(--gold)}.dm-ot{flex:1;font-weight:700}.dm-meta{display:grid;justify-items:end;gap:2px}.dm-meta small{font-size:10px;color:var(--muted)}.dm-ch{font-style:normal;font-size:11px;font-weight:800;padding:2px 8px;border-radius:999px}.dm-ch.hi{background:rgba(60,220,90,.18);color:#7dff9a}.dm-ch.md{background:rgba(242,196,67,.18);color:#f2c443}.dm-ch.lo{background:rgba(255,90,74,.16);color:#ff8a7a}
.dm-o.picked{border-color:var(--gold);background:rgba(242,196,67,.14)}.dm-o.fade{opacity:.35}
.dm-res{margin-top:12px;padding:12px 14px;border-radius:14px;animation:cwPop .4s both}.dm-res b{display:block;font-family:var(--f-display);font-weight:900;font-size:30px;font-style:italic}.dm-res.good{background:linear-gradient(135deg,rgba(60,220,90,.18),rgba(242,196,67,.12))}.dm-res.good b{color:#7dff9a}.dm-res.bad{background:rgba(255,90,74,.1)}.dm-res.bad b{color:#ff8a7a}.dm-res p{margin:4px 0 0}`;document.head.appendChild(st)}

// peneira: sem aula de gesto enquanto os lances viram decisões
if(DECIDE_MODE&&typeof coachCard==='function'){coachCard=function(st){try{toast({ic:COACH.ic,title:COACH.n,txt:`Estação de ${st.n.toLowerCase()}: leia a jogada e escolha bem.`,ms:2200})}catch(e){}return Promise.resolve()}}
