document.addEventListener("planilhaPronta", (e) => {
  atualizarBadgeMeta(e.detail);
});

function atualizarBadgeMeta(dados) {
  if (!Array.isArray(dados)) return;

  const mapa = {};

  dados.forEach(item => {
    // Normalizar treinador
    const treinadorOriginal = (item.treinador || "").trim();
    if (!treinadorOriginal) return;
    const treinadorKey = treinadorOriginal.toLowerCase();

    const curso = (item.curso || "").trim().toUpperCase();
    if (!curso) return;

    // Criar treinador no mapa se não existir
    if (!mapa[treinadorKey]) {
      mapa[treinadorKey] = { nick: treinadorOriginal, pontos: 0 };
    }

    // Processar alunos
    let alunos = [];
    if (Array.isArray(item.alunos)) {
      alunos = item.alunos
        .map(a => (a.nome || "").trim())
        .filter(nome => nome && nome.toLowerCase() !== "não houve" && nome.toLowerCase() !== "nao houve");

      // remove duplicados
      alunos = [...new Set(alunos)];
    }

    // Calcular pontos
    const valorCurso = curso === "CFS" ? 60 : curso === "CAS" ? 40 : 0;
    if (valorCurso === 0) return;

    mapa[treinadorKey].pontos += alunos.length > 0 ? valorCurso * alunos.length : valorCurso;
  });

  // Contar quem está fora da meta (<100 pontos)
  const foraDaMeta = Object.values(mapa).filter(t => t.pontos < 100).length;

  // Atualizar badge
  const badgeMeta = document.getElementById("badgeMeta");
  if (!badgeMeta) return;

  if (foraDaMeta > 0) {
    badgeMeta.textContent = foraDaMeta;
    badgeMeta.style.display = "inline-block";
  } else {
    badgeMeta.style.display = "none";
  }
}
