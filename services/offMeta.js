document.addEventListener("planilhaPronta", (e) => {
  montarRanking(e.detail);
});

function montarRanking(dados) {
  if (!Array.isArray(dados)) return;

  const mapa = {};

  dados.forEach(item => {
    /* ==========================
       NORMALIZAR TREINADOR
    ========================== */
    const treinadorOriginal = (item.treinador || "").trim();
    if (!treinadorOriginal) return;

    const treinadorKey = treinadorOriginal.toLowerCase();

    const curso = (item.curso || "").trim().toUpperCase();
    if (!curso) return;

    /* ==========================
       CRIAR TREINADOR NO MAPA
    ========================== */
    if (!mapa[treinadorKey]) {
      mapa[treinadorKey] = { nick: treinadorOriginal, aulas: 0, pontos: 0 };
    }

    /* ==========================
       PROCESSAR ALUNOS
    ========================== */
    let alunos = [];

    if (Array.isArray(item.alunos)) {
      alunos = item.alunos
        .map(a => (a.nome || "").trim())
        .filter(nome => nome && nome.toLowerCase() !== "não houve" && nome.toLowerCase() !== "nao houve");

      // remove duplicados
      alunos = [...new Set(alunos)];
    }

    /* ==========================
       CONTAR AULA
    ========================== */
    mapa[treinadorKey].aulas += 1;

    /* ==========================
       CALCULAR PONTOS
    ========================== */
    const valorCurso = curso === "CFS" ? 60 : curso === "CAS" ? 40 : 0;
    if (valorCurso === 0) return;

    mapa[treinadorKey].pontos += alunos.length > 0 ? valorCurso * alunos.length : valorCurso;
  });

  /* ==========================
     FILTRAR FORA DA META (<100)
  ========================== */
  const foraDaMeta = Object.values(mapa)
    .filter(t => t.pontos < 100)
    .sort((a, b) => b.pontos - a.pontos || a.nick.localeCompare(b.nick, "pt-BR"));

  /* ==========================
     RENDER HTML
  ========================== */
  const rankingList = document.getElementById("rankingList");
  if (!rankingList) return;
  rankingList.innerHTML = "";

  foraDaMeta.forEach((t, index) => {
    const avatar = `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${encodeURIComponent(t.nick)}&direction=3&head_direction=3&gesture=sml&size=l`;

    rankingList.innerHTML += `
      <div class="ranking-item">
        <div class="avatar" style="background-image: url('${avatar}');"></div>
        <div class="info">
          <h3>${t.nick}</h3>
          <p>Aulas: ${t.aulas}</p>
        </div>
        <div class="points" style="color:red;">
          ${t.pontos} pts
        </div>
      </div>
    `;
  });
}
