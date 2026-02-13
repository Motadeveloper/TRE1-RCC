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

    if (typeof item.alunos === "string") {
      alunos = item.alunos
        .split("/")
        // remove status tipo (caiu)
        .map(a => a.replace(/\(.*?\)/gi, ""))
        .map(a => a.trim())
        // remove vazios e "Não houve"
        .filter(a =>
          a.length > 0 &&
          a.toLowerCase() !== "não houve" &&
          a.toLowerCase() !== "nao houve"
        );

      // remove duplicados
      alunos = [...new Set(alunos)];

      // ✅ Mantemos todos os alunos, sem limitar a 3
      // alunos = alunos.slice(0, 3); <-- removido
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

    // cada aluno vale valorCurso pontos, ou valorCurso se não houver alunos
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
