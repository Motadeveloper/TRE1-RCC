let rankingDados = [];
window.mapaTreinadores = {}; // GLOBAL

/* ==========================
   PROCESSAR PLANILHA
========================== */
function processarPlanilha(dados) {
  rankingDados = dados;
  montarMapaTreinadores(rankingDados);
  montarRanking();

  // Pega o primeiro lugar do ranking
  const primeiro = Object.values(window.mapaTreinadores)
                      .sort((a, b) => b.pontos - a.pontos)[0];

  if (primeiro) {
    requestAnimationFrame(() => {
      const inputPesquisa = document.getElementById("inputPesquisa");
      if (inputPesquisa) {
        inputPesquisa.value = primeiro.nick;

        // Dispara a pesquisa automaticamente
        inputPesquisa.dispatchEvent(new Event("input"));
      }
    });
  }
}

/* ==========================
   EVENTO DE PLANILHA CARREGADA
========================== */
document.addEventListener("planilhaPronta", (e) => {
  processarPlanilha(e.detail);
});

// Se a planilha já estiver carregada antes do script ser executado
if (window.dadosPlanilha && window.dadosPlanilha.length > 0) {
  processarPlanilha(window.dadosPlanilha);
}

/* ==========================
   MONTAR MAPA DE TREINADORES
========================== */
function montarMapaTreinadores(dados) {
  window.mapaTreinadores = {};

  dados.forEach(item => {
    const nick = item.treinador?.trim();
    const curso = item.curso?.trim().toUpperCase();

    if (!nick || !curso) return;

    if (!window.mapaTreinadores[nick]) {
      window.mapaTreinadores[nick] = {
        nick: nick,
        aulas: 0,
        pontos: 0,
        aprovados: 0,
        reprovados: 0
      };
    }

    /* ==========================
       PROCESSAR ALUNOS COM STATUS
    ========================== */
    let alunos = [];
    if (Array.isArray(item.alunos)) {
      alunos = item.alunos
        .map(a => ({
          nome: (a.nome || "").trim(),
          status: (a.status || "").toLowerCase()
        }))
        .filter(a => a.nome.length > 0 &&
                     a.nome.toLowerCase() !== "não houve" &&
                     a.nome.toLowerCase() !== "nao houve");

      // remove duplicados
      const nomesUnicos = new Set();
      alunos = alunos.filter(a => {
        if (nomesUnicos.has(a.nome)) return false;
        nomesUnicos.add(a.nome);
        return true;
      });
    }

    /* ==========================
       CONTAR AULA
    ========================== */
    window.mapaTreinadores[nick].aulas += 1;

    /* ==========================
       CALCULAR PONTOS POR ALUNO
    ========================== */
    const valorCurso =
      curso === "CFS" ? 60 :
      curso === "CAS" ? 40 :
      0;

    if (valorCurso > 0) {
      if (alunos.length > 0) {
        alunos.forEach(a => {
          window.mapaTreinadores[nick].pontos += valorCurso;

          // contabilizar aprovação/reprovação
          if (a.status.includes("aprov")) window.mapaTreinadores[nick].aprovados += 1;
          else window.mapaTreinadores[nick].reprovados += 1;
        });
      } else {
        // Caso não haja nenhum aluno, ainda soma valor da aula
        window.mapaTreinadores[nick].pontos += valorCurso;
      }
    }
  });
}

/* ==========================
   MONTAR RANKING
========================== */
function montarRanking() {
  const ranking = Object.values(window.mapaTreinadores)
    .sort((a, b) => b.pontos - a.pontos)
    .slice(0, 5);

  const rankingList = document.getElementById("rankingList");
  if (!rankingList) return;

  rankingList.innerHTML = "";

  ranking.forEach((t, index) => {
    const classe = index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : "";
    const avatar = `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${encodeURIComponent(t.nick)}&direction=3&head_direction=3&gesture=sml&size=l`;
    const pontosClasse = t.pontos >= 100 ? "pontos-verde" : "pontos-vermelho";

    rankingList.innerHTML += `
      <div class="ranking-item ${classe}">
        <span class="position">${index + 1}º</span>
        <div class="avatar" style="background-image: url('${avatar}'); background-size: cover;"></div>
        <div class="info">
          <h3>${t.nick}</h3>
          <p>Aulas: ${t.aulas}</p>
        </div>
        <div class="points ${pontosClasse}">${t.pontos} pts</div>
      </div>
    `;
  });
}

/* ==========================
   PESQUISAR TREINADOR
========================== */
function pesquisarTreinador(nickname) {
  const nick = nickname.trim().toLowerCase();
  const mapaTreinadores = window.mapaTreinadores || {};
  const resultado = document.getElementById("pesquisaResultado");

  if (!resultado) return;

  if (!nick) {
    resultado.style.display = "none";
    return;
  }

  const treinador = Object.values(mapaTreinadores).find(
    t => t.nick.toLowerCase() === nick
  );

  if (!treinador) {
    resultado.style.display = "block";
    resultado.innerHTML = `
      <div class="alert-erro">
        Esse treinador não existe ou não tem dados registrados no TRE1.
      </div>
    `;
    return;
  }

  resultado.style.display = "block";

  resultado.innerHTML = `
    <div class="avatar" id="avatarPesquisa"></div>
    <h3 id="nickPesquisa">${treinador.nick}</h3>
    <p id="aulasPesquisa">Aulas: ${treinador.aulas}</p>
    <p id="pontosPesquisa">Pontos: ${treinador.pontos}</p>
    <div class="meta-alert ${treinador.pontos >= 100 ? "meta-bateu" : "meta-fora"}">
      ${treinador.pontos >= 100 ? "Bateu a meta semanal!" : "Fora da meta semanal!"}
    </div>
  `;

  const avatarPesquisa = document.getElementById("avatarPesquisa");
  if (avatarPesquisa)
    avatarPesquisa.style.backgroundImage = `url('https://www.habbo.com.br/habbo-imaging/avatarimage?user=${encodeURIComponent(treinador.nick)}&direction=3&head_direction=3&gesture=sml&size=l')`;
}

/* ==========================
   EVENTO DE INPUT DE PESQUISA
========================== */
const inputPesquisa = document.getElementById("inputPesquisa");
if (inputPesquisa) {
  inputPesquisa.addEventListener("input", () => {
    pesquisarTreinador(inputPesquisa.value);
  });
}
