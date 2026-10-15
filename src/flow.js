// ================== FLUXO DIDÁTICO: mapa de etapas + dicas ==================
const JOURNEY={ob:['Jogador','Ícones','Peneira','Clube'],ss:['Pré-temporada','Temporada','Balanço','Mercado']};
function journeyHTML(g,i,hint,yr){
 const st=JOURNEY[g];
 return`<nav class="journey" aria-label="Etapas"><div class="jlbl">${g==='ob'?'Começo da carreira':`Ciclo da temporada${yr!=null?' '+seasonLbl(yr):S&&S.year?' '+seasonLbl(S.year):''}`}</div><ol>${st.map((t,k)=>`<li class="${k<i?'done':k===i?'on':''}"><i>${k<i?'✓':k+1}</i><span>${t}</span></li>`).join('')}</ol>${hint?`<p class="jhint">👉 ${hint}</p>`:''}</nav>`;
}
function addJourney(g,i,hint,yr){const w=$app.querySelector('.wrap');if(!w||w.querySelector(':scope > .journey'))return;w.insertAdjacentHTML('afterbegin',journeyHTML(g,i,hint,yr))}
(function(){
 const wrap=(name,after)=>{const f=window[name];if(typeof f!=='function')return;window[name]=function(...a){const r=f.apply(this,a);try{after(...a)}catch(e){console.error(e)}return r}};
 wrap('renderCreate',()=>addJourney('ob',0,'Preencha os 3 blocos e toque no botão laranja lá embaixo.'));
 wrap('renderDraft',()=>addJourney('ob',1,'8 roubos. Prefira atributos com peso alto na sua posição.'));
 wrap('renderAcademy',()=>addJourney('ob',3,'Escolha seu primeiro clube. A carreira começa logo depois.'));
 wrap('renderPlanning',()=>addJourney('ss',0,'Escolha seu estilo, faça o treino se quiser e toque em Começar a temporada.'));
 wrap('renderReport',ls=>addJourney('ss',2,'Veja como foi seu ano. Depois vem o mercado.',ls&&ls.row?ls.row.year:undefined));
 wrap('renderOffers',()=>addJourney('ss',3,'Escolha onde jogar a próxima temporada.'));
 wrap('renderHub',()=>{
  if(!S.st)return;
  const dec=!PAUSE&&!S.st.done&&isDecisive(nextItem());const hint=PAUSE?'Uma decisão apareceu. Escolha uma opção para seguir.':S.st.done?'A temporada acabou. Toque em Ver o fim da temporada.':dec?'Jogo decisivo! Ele passa ao vivo. Toque em 🔴 Jogar ao vivo.':S.fast?'Toque em ⏩ Jogar bloco. Entre um bloco e outro, aproveite a folga.':'Use os dias livres e toque em ⚽ Ir para o jogo.';
  addJourney('ss',S.st.done?2:1,hint);
  S.tips=S.tips||{};
  if(!S.tips.week&&!S.fast&&!PAUSE&&!S.st.done){const j=$app.querySelector('.wrap > .journey');if(j&&!document.getElementById('tipWeek')){j.insertAdjacentHTML('afterend',`<section class="tip" id="tipWeek"><b>Como funciona a semana</b><ol><li><b>Dias livres</b> até o jogo: treine, cuide das relações, compre coisas ou descanse. Cada ação gasta 1 dia.</li><li>Quando quiser, toque em <b>⚽ Ir para o jogo</b> lá embaixo.</li><li>Nos lances, você joga: drible, passe, chute, falta.</li><li>Resultados, tabela e troféus ficam nas abas mais abaixo.</li></ol><button class="btn small" id="tipOk">Entendi</button></section>`);
   document.getElementById('tipOk').onclick=()=>{S.tips.week=true;const t=document.getElementById('tipWeek');if(t)t.remove();saveNow('season')}}}
 });
})();
