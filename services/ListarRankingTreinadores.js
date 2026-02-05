document.addEventListener("dadosPlanilhaProntos", (e) => {
  montarRanking(e.detail);
});

function montarRanking(dados) {
  const mapa = {};

  // Monta o mapa de treinadores
  dados.forEach(item => {
    const treinador = item.treinador.trim();
    const curso = item.curso.trim().toUpperCase();
    if (!treinador || !curso) return;

    if (!mapa[treinador]) {
      mapa[treinador] = { nick: treinador, aulas: 0, pontos: 0 };
    }

    mapa[treinador].aulas += 1;

    if (curso === "CFS") mapa[treinador].pontos += 60;
    if (curso === "CAS") mapa[treinador].pontos += 40;
  });

  // Ordena do maior para o menor
  const ranking = Object.values(mapa)
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, 5); // pega top 5

  const rankingList = document.getElementById("rankingList");
  if (!rankingList) return;

  rankingList.innerHTML = "";

  ranking.forEach((t, index) => {
    // Define classe de cor
    let classe = "";
    if (index === 0) classe = "gold";
    if (index === 1) classe = "silver";
    if (index === 2) classe = "bronze";

    const avatar = `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${encodeURIComponent(t.nick)}&direction=3&head_direction=3&gesture=sml&size=l`;

    rankingList.innerHTML += `
      <div class="ranking-item ${classe}">
        <span class="position">${index + 1}º</span>
        <div class="avatar" style="background-image: url('${avatar}'); background-size: cover;"></div>
        <div class="info">
          <h3>${t.nick}</h3>
          <p>Aulas: ${t.aulas}</p>
        </div>
        <div class="points">${t.pontos}%</div>
      </div>
    `;
  });
}
