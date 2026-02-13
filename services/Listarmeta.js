let rankingDados = [];
window.mapaTreinadores = {}; // GLOBAL

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

document.addEventListener("planilhaPronta", (e) => {
  processarPlanilha(e.detail);
});



// Se a planilha já estiver carregada antes do script ser executado


if (window.dadosPlanilha && window.dadosPlanilha.length > 0) {
  processarPlanilha(window.dadosPlanilha);
}



function montarMapaTreinadores(dados) {
  window.mapaTreinadores = {};

  dados.forEach(item => {
    const nick = item.treinador?.trim();
    const curso = item.curso?.trim().toUpperCase();
    let resultado = item.resultado?.toLowerCase() || "";

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

    window.mapaTreinadores[nick].aulas += 1;

    if (curso === "CFS") window.mapaTreinadores[nick].pontos += 60;
    if (curso === "CAS") window.mapaTreinadores[nick].pontos += 40;

    if (resultado.includes("aprov")) window.mapaTreinadores[nick].aprovados += 1;
    else window.mapaTreinadores[nick].reprovados += 1;
  });
}

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
        <div class="points ${pontosClasse}">${t.pontos}%</div>
      </div>
    `;
  });
}

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

const inputPesquisa = document.getElementById("inputPesquisa");
if (inputPesquisa) {
  inputPesquisa.addEventListener("input", () => {
    pesquisarTreinador(inputPesquisa.value);
  });
}
