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
      mapa[treinadorKey] = {
        nick: treinadorOriginal,
        aulas: 0,
        pontos: 0
      };
    }

    /* ==========================
       PROCESSAR ALUNOS
    ========================== */

    let alunos = [];

    if (Array.isArray(item.alunos)) {

      alunos = item.alunos
        .map(a => (a.nome || "").trim())
        .filter(nome =>
          nome.length > 0 &&
          nome.toLowerCase() !== "não houve" &&
          nome.toLowerCase() !== "nao houve"
        );

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

    const valorCurso =
      curso === "CFS" ? 60 :
      curso === "CAS" ? 40 :
      0;

    if (valorCurso === 0) return;

    if (alunos.length > 0) {
      mapa[treinadorKey].pontos += valorCurso * alunos.length;
    } else {
      mapa[treinadorKey].pontos += valorCurso;
    }

  });

  /* ==========================
     GERAR RANKING
  ========================== */

  const ranking = Object.values(mapa)
    .sort((a, b) => b.pontos - a.pontos);

  renderRanking(ranking);
}

/* ==========================
   RENDER HTML
========================== */

function renderRanking(ranking) {

  const rankingList = document.getElementById("rankingList");
  if (!rankingList) return;

  rankingList.innerHTML = "";

  ranking.forEach((t, index) => {

    let classe = "";
    if (index === 0) classe = "gold";
    else if (index === 1) classe = "silver";
    else if (index === 2) classe = "bronze";

    const avatar =
      `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${encodeURIComponent(t.nick)}&direction=3&head_direction=3&gesture=sml&size=l`;

    const corPontos = t.pontos >= 100 ? "green" : "red";

    rankingList.innerHTML += `
      <div class="ranking-item ${classe}">
        
        <span class="position">${index + 1}º</span>

        <div class="avatar"
             style="background-image:url('${avatar}')">
        </div>

        <div class="info">
          <h3>${t.nick}</h3>
          <p>Aulas: ${t.aulas}</p>
        </div>

        <div class="points" style="color:${corPontos}">
          ${t.pontos} pts
        </div>

      </div>
    `;
  });

}
