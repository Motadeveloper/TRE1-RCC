document.addEventListener("planilhaPronta", (e) => {
  montarRanking(e.detail);
});

function montarRanking(dados) {
  if (!Array.isArray(dados)) return;

  const mapa = {};

  dados.forEach(item => {
    const treinador = (item.treinador || "").trim();
    const curso = (item.curso || "").trim().toUpperCase();

    if (!treinador) return;
    if (!curso) return;

    if (!mapa[treinador]) {
      mapa[treinador] = { nick: treinador, aulas: 0, pontos: 0 };
    }

    mapa[treinador].aulas += 1;

    if (curso === "CFS") mapa[treinador].pontos += 60;
    if (curso === "CAS") mapa[treinador].pontos += 40;
  });

  const ranking = Object.values(mapa)
    .sort((a, b) => b.pontos - a.pontos)
    // Filtra apenas quem está fora da meta (< 100)
    .filter(t => t.pontos < 100);

  const rankingList = document.getElementById("rankingList");
  if (!rankingList) return;

  rankingList.innerHTML = "";

  ranking.forEach((t, index) => {
    let classe = "";
    if (index === 0) classe = "gold";
    if (index === 1) classe = "silver";
    if (index === 2) classe = "bronze";

    const avatar = `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${encodeURIComponent(t.nick)}&direction=3&head_direction=3&gesture=sml&size=l`;

    rankingList.innerHTML += `
      <div class="ranking-item ${classe}">
        <span class="position">${index + 1}º</span>
        <div class="avatar" style="background-image: url('${avatar}');"></div>
        <div class="info">
          <h3>${t.nick}</h3>
          <p>Aulas: ${t.aulas}</p>
        </div>
        <div class="points" style="color:red;">
          ${t.pontos}%
        </div>
      </div>
    `;
  });

  
}
