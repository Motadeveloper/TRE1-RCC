let rankingDados = [];
let mapaTreinadores = {}; // mapa consolidado

document.addEventListener("dadosPlanilhaProntos", (e) => {
  rankingDados = e.detail;
  montarMapaTreinadores(rankingDados);
  montarRanking();
  atualizarEstatisticas();

  // Pesquisa automaticamente o 1º colocado
  const primeiro = Object.values(mapaTreinadores)
                      .sort((a, b) => b.pontos - a.pontos)[0];
  if (primeiro) pesquisarTreinador(primeiro.nick);
});

// Consolida dados por treinador
function montarMapaTreinadores(dados) {
  mapaTreinadores = {};

  dados.forEach(item => {
    const nick = item.treinador?.trim();
    const curso = item.curso?.trim().toUpperCase();
    let resultado = item.resultado?.toLowerCase() || ""; // pega o campo correto

    if (!nick || !curso) return;

    if (!mapaTreinadores[nick]) {
      mapaTreinadores[nick] = {
        nick: nick,
        aulas: 0,
        pontos: 0,
        aprovados: 0,
        reprovados: 0
      };
    }

    // Contabiliza aulas
    mapaTreinadores[nick].aulas += 1;

    // Pontos por curso
    if (curso === "CFS") mapaTreinadores[nick].pontos += 60;
    if (curso === "CAS") mapaTreinadores[nick].pontos += 40;

    // Conta aprovados/reprovados
    if (resultado.includes("aprov")) mapaTreinadores[nick].aprovados += 1;
    else mapaTreinadores[nick].reprovados += 1;
  });
}

// Monta o ranking top 5
function montarRanking() {
  const ranking = Object.values(mapaTreinadores)
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, 5);

  const rankingList = document.getElementById("rankingList");
  rankingList.innerHTML = "";

  ranking.forEach((t, index) => {
    const classe = index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : "";
    const avatar = `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${encodeURIComponent(t.nick)}&direction=3&head_direction=3&gesture=sml&size=l`;

    // Classe de cor dos pontos
    const pontosClasse = t.pontos >= 100 ? "pontos-verde" : "pontos-vermelho";

    rankingList.innerHTML += `
      <div class="ranking-item ${classe}">
        <span class="position">${index + 1}º</span>
        <div class="avatar" style="background-image: url('${avatar}'); background-size: cover;"></div>
        <div class="info">
          <h3>${t.nick}</h3>
          <p>Aulas: ${t.aulas}</p>
        </div>
        <div class="points ${pontosClasse}">${t.pontos}%</div>
      </div>
    `;
  });
}

// Pesquisa treinador (função reutilizável)
function pesquisarTreinador(nickname) {
  const nick = nickname.trim().toLowerCase();
  const treinador = Object.values(mapaTreinadores).find(t => t.nick.toLowerCase() === nick);
  const resultado = document.getElementById("pesquisaResultado");

  if (!treinador) {
    resultado.style.display = "none";
    return;
  }

  resultado.style.display = "block";
  const avatar = `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${encodeURIComponent(treinador.nick)}&direction=3&head_direction=3&gesture=sml&size=l`;

  document.getElementById("avatarPesquisa").style.backgroundImage = `url('${avatar}')`;
  document.getElementById("nickPesquisa").textContent = treinador.nick;
  document.getElementById("aulasPesquisa").textContent = `Aulas: ${treinador.aulas}`;
  document.getElementById("pontosPesquisa").textContent = `Pontos: ${treinador.pontos}`;
  
  // Adiciona aprovados/reprovados no perfil pesquisado
  const aprovadosEl = document.getElementById("aprovadosPesquisa");
  const reprovadosEl = document.getElementById("reprovadosPesquisa");

  if (aprovadosEl) aprovadosEl.textContent = `Aprovados: ${treinador.aprovados}`;
  if (reprovadosEl) reprovadosEl.textContent = `Reprovados: ${treinador.reprovados}`;

  // Meta semanal
  const metaAlert = document.getElementById("metaAlert");
  if (treinador.pontos >= 100) {
    metaAlert.textContent = "Bateu a meta semanal!";
    metaAlert.style.backgroundColor = "#16a34a"; // verde
  } else {
    metaAlert.textContent = "Fora da meta semanal!";
    metaAlert.style.backgroundColor = "#dc2626"; // vermelho
  }
}

// Pesquisa ao digitar no input
const inputPesquisa = document.getElementById("inputPesquisa");
inputPesquisa.addEventListener("input", () => {
  pesquisarTreinador(inputPesquisa.value);
});

// Atualiza os cards de estatísticas gerais
function atualizarEstatisticas() {
  let totalAulas = 0;
  let totalAprovados = 0;
  let totalReprovados = 0;

  Object.values(mapaTreinadores).forEach(t => {
    totalAulas += t.aulas;
    totalAprovados += t.aprovados;
    totalReprovados += t.reprovados;
  });

  document.getElementById("totalAulasNum").textContent = totalAulas;
  document.getElementById("totalAprovadosNum").textContent = totalAprovados;
  document.getElementById("totalReprovadosNum").textContent = totalReprovados;
}
