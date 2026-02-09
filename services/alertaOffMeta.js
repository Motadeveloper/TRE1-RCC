document.addEventListener("planilhaPronta", (e) => {
  atualizarBadgeMeta(e.detail);
});

function atualizarBadgeMeta(dados) {
  if (!Array.isArray(dados)) return;

  const mapa = {};

  dados.forEach(item => {
    const treinador = (item.treinador || "").trim();
    const curso = (item.curso || "").trim().toUpperCase();

    if (!treinador) return;
    if (!curso) return;

    if (!mapa[treinador]) {
      mapa[treinador] = { nick: treinador, pontos: 0 };
    }

    if (curso === "CFS") mapa[treinador].pontos += 60;
    if (curso === "CAS") mapa[treinador].pontos += 40;
  });

  const foraDaMeta = Object.values(mapa).filter(t => t.pontos < 100).length;

  const badgeMeta = document.getElementById("badgeMeta");
  if (!badgeMeta) return;

  if (foraDaMeta > 0) {
    badgeMeta.textContent = foraDaMeta;
    badgeMeta.style.display = "inline-block";
  } else {
    badgeMeta.style.display = "none";
  }
}
