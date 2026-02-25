function criarCard(nick) {
  const card = document.createElement("div");
  card.classList.add("habbo-card");

  card.innerHTML = `
    <div class="habbo-avatar">
      <img src="https://www.habbo.com.br/habbo-imaging/avatarimage?user=${encodeURIComponent(nick)}&direction=3&head_direction=3&gesture=sml&size=l">
    </div>
    <div class="habbo-name">${nick}</div>
  `;

  return card;
}

// Função para renderizar cards com animação sequencial
function renderCards(container, cardsArray) {
  // Primeiro, adicionar todos os cards ao container
  const cards = cardsArray.map(nick => {
    const card = criarCard(nick);
    container.appendChild(card);
    return card;
  });

  // Depois, adicionar animação sequencial
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("enter");
    }, index * 100); // 100ms entre cada card
  });
}

// Dados de exemplo
const lider = ["benjlfbaby"];
const vices = ["BeGomes94.","claryflyy."];
const ministros = ["andrej0128s","kaah_.","bi4858","Dr.jack-","Mwdeiros","Stynte-BAN","diego21927","Kesie"];
const novos = ["BomPolicial-.","xSkull","Lukezeraaa","GuilhermeK="];

// Containers
const liderViceContainer = document.getElementById("liderViceContainer");
const ministrosContainer = document.getElementById("ministrosContainer");
const novosContainer = document.getElementById("novosContainer");

// Renderização
renderCards(liderViceContainer, lider.concat(vices));
renderCards(ministrosContainer, ministros);
renderCards(novosContainer, novos);