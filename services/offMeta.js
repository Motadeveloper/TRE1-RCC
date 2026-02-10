document.addEventListener("planilhaPronta", (e) => {
  montarRanking(e.detail);
});

function montarRanking(dados) {
  if (!Array.isArray(dados)) return;

  const mapa = {};

  dados.forEach(item => {
    const treinador = (item.treinador || "").trim();
    const curso = (item.curso || "").trim().toUpperCase();

    if (!treinador || !curso) return;

    if (!mapa[treinador]) {
      mapa[treinador] = { nick: treinador, aulas: 0, pontos: 0 };
    }

    mapa[treinador].aulas += 1;

    if (curso === "CFS") mapa[treinador].pontos += 60;
    if (curso === "CAS") mapa[treinador].pontos += 40;
  });

  const ranking = Object.values(mapa)
    .sort((a, b) => {
      if (b.pontos !== a.pontos) {
        return b.pontos - a.pontos;
      }
      return a.nick.localeCompare(b.nick, "pt-BR");
    })
    .filter(t => t.pontos < 100);

  const rankingList = document.getElementById("rankingList");
  if (!rankingList) return;

  rankingList.innerHTML = "";

  ranking.forEach(t => {
    const avatar = `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${encodeURIComponent(t.nick)}&direction=3&head_direction=3&gesture=sml&size=l`;

    rankingList.innerHTML += `
      <div class="ranking-item">
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
