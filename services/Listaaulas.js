let dadosOriginais = [];
let paginaAtual = 1;
const itensPorPagina = 25;

const loader = document.getElementById("loader");
const lessonsContainer = document.getElementById("lessons");

function showLoader() {
  loader.style.display = "flex";
  lessonsContainer.style.display = "none";
}

function hideLoader() {
  loader.style.display = "none";
  lessonsContainer.style.display = "block";
}

function treinadorAvatar(user) {
  return `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${encodeURIComponent(
    user
  )}&headonly=1&head_direction=10&size=m`;
}

function alunoAvatar(user) {
  return `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${encodeURIComponent(
    user
  )}&headonly=1&head_direction=4&size=m`;
}

function formatarData(valor) {
  if (!valor) return "";
  const data = new Date(valor);
  return data.toLocaleString("pt-BR");
}

/* =====================================================
   🔔 AGUARDA OS DADOS DA PLANILHA (vindos de outro JS)
   ===================================================== */
document.addEventListener("planilhaPronta", (e) => {
  showLoader();

  dadosOriginais = e.detail.map(item => ({
    ...item,
    dataHora: formatarData(item.dataHora),
    inicio: formatarData(item.inicio),
    termino: formatarData(item.termino)
  }));

  paginaAtual = 1;
  renderFAQ(dadosOriginais);
  atualizarPaginacao(dadosOriginais);
  hideLoader();
});

/* =====================================================
   RENDERIZAÇÃO DA TABELA
   ===================================================== */
function renderFAQ(dados = dadosOriginais) {
  const container = document.getElementById("lessons");
  container.innerHTML = "";

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  const dadosParaRender = dados.slice(inicio, fim);

  dadosParaRender.forEach(item => {
    let statusClass = "reprovado";
    const resultado = (item.resultado || "").toLowerCase();

    if (resultado.includes("aprov")) statusClass = "aprovado";
    else if (resultado.includes("caiu")) statusClass = "caiu";

    container.innerHTML += `
      <details class="lesson ${statusClass}">
        <summary>
          <div class="person">
            <img src="${treinadorAvatar(item.treinador)}">
            <div class="info">
              <strong>${item.treinador}</strong>
              </br>
              <span class="role">TREINADOR</span>
            </div>
          </div>

          <div class="resume">
            <span class="type">${item.curso}</span>
            <span class="datetime">${item.dataHora}</span>
          </div>

          <div class="person right">
            <div class="info">
              <strong>${item.aluno}</strong>
              </br>
              <span class="role">ALUNO</span>
            </div>
            <img src="${alunoAvatar(item.aluno)}">
          </div>
        </summary>

        <div class="content">
          <div class="block"><strong>Início</strong>${item.inicio}</div>
          <div class="block"><strong>Término</strong>${item.termino}</div>
          <div class="block"><strong>Duração</strong>${item.duracao}</div>
          <div class="block"><strong>Local</strong>${item.local}</div>
          <div class="block"><strong>Status</strong>${item.resultado}</div>
          <div class="block"><strong>Tutoria</strong>${item.tutoria}</div>
          <div class="block comment">
            <strong>Comentário</strong>
            ${item.comentario || "Sem comentário"}
          </div>
        </div>
      </details>
    `;
  });

  atualizarPaginacao(dados);
}

/* =====================================================
   PAGINAÇÃO
   ===================================================== */
function atualizarPaginacao(dados = dadosOriginais) {
  const totalPaginas = Math.ceil(dados.length / itensPorPagina);
  document.getElementById("pageInfo").innerText =
    `Página ${paginaAtual} de ${totalPaginas}`;
}

function nextPage(dados = dadosOriginais) {
  const totalPaginas = Math.ceil(dados.length / itensPorPagina);
  if (paginaAtual < totalPaginas) {
    paginaAtual++;
    showLoader();
    setTimeout(() => {
      renderFAQ(dados);
      atualizarPaginacao(dados);
      hideLoader();
    }, 300);
  }
}

function prevPage(dados = dadosOriginais) {
  if (paginaAtual > 1) {
    paginaAtual--;
    showLoader();
    setTimeout(() => {
      renderFAQ(dados);
      atualizarPaginacao(dados);
      hideLoader();
    }, 300);
  }
}
