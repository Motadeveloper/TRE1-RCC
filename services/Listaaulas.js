/* =====================================================
   VARIÁVEIS GLOBAIS
   ===================================================== */
let dadosOriginais = [];
let paginaAtual = 1;
const itensPorPagina = 25;

let filtroCursoAtivo = null;      // cfs | cas | null
let filtroResultadoAtivo = null;  // aprovado | caiu | reprovado | null
let termoBusca = "";              // treinador ou aluno

const loader = document.getElementById("loader");
const lessonsContainer = document.getElementById("lessons");
const inputBusca = document.getElementById("busca");
const btnClear = document.querySelector(".btn-clear");

/* =====================================================
   LOADER
   ===================================================== */
function showLoader() {
  loader.style.display = "flex";
  lessonsContainer.style.display = "none";
}

function hideLoader() {
  loader.style.display = "none";
  lessonsContainer.style.display = "block";
}

/* =====================================================
   AVATARES
   ===================================================== */
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

/* =====================================================
   FORMATAÇÃO DE DATA
   ===================================================== */
function formatarData(valor) {
  if (!valor) return "";
  const data = new Date(valor);
  return data.toLocaleString("pt-BR");
}

/* =====================================================
   EVENTO DA PLANILHA
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
  aplicarFiltros();
});

/* =====================================================
   OBTÉM DADOS CONFORME FILTROS + BUSCA
   ===================================================== */
function obterDadosAtuais() {
  return dadosOriginais.filter(item => {
    const cursoOk =
      !filtroCursoAtivo ||
      (item.curso || "").toLowerCase().includes(filtroCursoAtivo);

    const resultadoOk =
      !filtroResultadoAtivo ||
      (item.resultado || "").toLowerCase().includes(filtroResultadoAtivo);

    const buscaOk =
      !termoBusca ||
      (item.treinador || "").toLowerCase().includes(termoBusca) ||
      (item.alunos || [])
        .map(a => a.nome.toLowerCase())
        .some(nome => nome.includes(termoBusca));

    return cursoOk && resultadoOk && buscaOk;
  });
}

/* =====================================================
   APLICA FILTROS
   ===================================================== */
function aplicarFiltros() {
  const dadosFiltrados = obterDadosAtuais();

  paginaAtual = 1;
  showLoader();

  setTimeout(() => {
    renderFAQ(dadosFiltrados);
    atualizarPaginacao(dadosFiltrados);
    hideLoader();
  }, 300);
}

/* =====================================================
   RENDERIZAÇÃO
   ===================================================== */
function renderFAQ(dados) {
  const container = document.getElementById("lessons");
  container.innerHTML = "";

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  dados.slice(inicio, fim).forEach(item => {

    const alunos = item.alunos || [];
    const temMultiplosAlunos = alunos.length > 1;

    // statusClass só é aplicado quando tem 1 aluno
    let statusClass = "";
    const resultado = (item.resultado || "").toLowerCase();

    if (!temMultiplosAlunos) {
      if (resultado.includes("aprov")) statusClass = "aprovado";
      else if (resultado.includes("caiu")) statusClass = "caiu";
      else statusClass = "reprovado";
    } else {
      statusClass = "multi-alunos"; // cor cinza apenas quando tem mais de 1 aluno
    }

    // monta HTML dos alunos
    const alunosHtml = alunos.map(aluno => {
      return `
        <div class="aluno">
          <img src="${alunoAvatar(aluno.nome)}">
          <div class="info">
            <strong>${aluno.nome}</strong><br>
            <span class="role">${aluno.status || ""}</span>
          </div>
        </div>
      `;
    }).join("");

    // status de todos os alunos no bloco Status
    const statusAlunosHtml = alunos.map(aluno => {
      return `<div class="status-aluno">
        <strong>${aluno.nome}</strong>: ${aluno.status || "Sem status"}
      </div>`;
    }).join("");

    container.innerHTML += `
      <details class="lesson ${statusClass}">
        <summary>
          <div class="person">
            <img src="${treinadorAvatar(item.treinador)}">
            <div class="info">
              <strong>${item.treinador}</strong><br>
              <span class="role">TREINADOR</span>
            </div>
          </div>

          <div class="resume">
            <span class="type">${item.curso}</span>
            <span class="datetime">${item.dataHora}</span>
          </div>

          <div class="person right">
            ${alunosHtml}
          </div>
        </summary>

        <div class="content">
          <div class="block"><strong>Início</strong> ${item.inicio}</div>
          <div class="block"><strong>Término</strong> ${item.termino}</div>
          <div class="block"><strong>Duração</strong> ${item.duracao}</div>
          <div class="block"><strong>Local</strong> ${item.local}</div>
          <div class="block comment">
            <strong>Comentário</strong>
            ${item.comentario || "Sem comentário"}
            <div class="block"><strong>Tutoria</strong> ${item.tutoria}</div>
          </div>
        </div>
      </details>
    `;
  });
}

/* =====================================================
   PAGINAÇÃO
   ===================================================== */
function atualizarPaginacao(dados) {
  const totalPaginas = Math.ceil(dados.length / itensPorPagina);
  document.getElementById("pageInfo").innerText =
    `Página ${paginaAtual} de ${totalPaginas || 1}`;
}

function nextPage() {
  const dados = obterDadosAtuais();
  if (paginaAtual < Math.ceil(dados.length / itensPorPagina)) {
    paginaAtual++;
    showLoader();
    setTimeout(() => {
      renderFAQ(dados);
      atualizarPaginacao(dados);
      hideLoader();
    }, 300);
  }
}

function prevPage() {
  if (paginaAtual > 1) {
    paginaAtual--;
    const dados = obterDadosAtuais();
    showLoader();
    setTimeout(() => {
      renderFAQ(dados);
      atualizarPaginacao(dados);
      hideLoader();
    }, 300);
  }
}

/* =====================================================
   FILTROS — BOTÕES E SELECTS
   ===================================================== */
const selectCurso = document.getElementById("selectCurso");
const selectResultado = document.getElementById("selectResultado");

/* --- Curso (botões) --- */
document.querySelectorAll(".btn-filtro.curso").forEach(botao => {
  botao.addEventListener("click", () => {
    const valor = botao.dataset.valor;
    filtroCursoAtivo = filtroCursoAtivo === valor ? null : valor;

    document.querySelectorAll(".btn-filtro.curso")
      .forEach(b => b.classList.remove("ativo"));

    if (filtroCursoAtivo) botao.classList.add("ativo");
    if (selectCurso) selectCurso.value = filtroCursoAtivo || "";

    aplicarFiltros();
  });
});

/* --- Resultado (botões) --- */
document.querySelectorAll(".btn-filtro.resultado").forEach(botao => {
  botao.addEventListener("click", () => {
    const valor = botao.dataset.valor;
    filtroResultadoAtivo = filtroResultadoAtivo === valor ? null : valor;

    document.querySelectorAll(".btn-filtro.resultado")
      .forEach(b => b.classList.remove("ativo"));

    if (filtroResultadoAtivo) botao.classList.add("ativo");
    if (selectResultado) selectResultado.value = filtroResultadoAtivo || "";

    aplicarFiltros();
  });
});

/* --- Curso (select mobile) --- */
if (selectCurso) {
  selectCurso.addEventListener("change", () => {
    filtroCursoAtivo = selectCurso.value || null;

    document.querySelectorAll(".btn-filtro.curso")
      .forEach(b => b.classList.remove("ativo"));

    if (filtroCursoAtivo) {
      document
        .querySelector(`.btn-filtro.curso[data-valor="${filtroCursoAtivo}"]`)
        ?.classList.add("ativo");
    }

    aplicarFiltros();
  });
}

/* --- Resultado (select mobile) --- */
if (selectResultado) {
  selectResultado.addEventListener("change", () => {
    filtroResultadoAtivo = selectResultado.value || null;

    document.querySelectorAll(".btn-filtro.resultado")
      .forEach(b => b.classList.remove("ativo"));

    if (filtroResultadoAtivo) {
      document
        .querySelector(`.btn-filtro.resultado[data-valor="${filtroResultadoAtivo}"]`)
        ?.classList.add("ativo");
    }

    aplicarFiltros();
  });
}

/* =====================================================
   BUSCA (TREINADOR / ALUNO)
   ===================================================== */
if (inputBusca) {
  inputBusca.addEventListener("input", () => {
    termoBusca = inputBusca.value.trim().toLowerCase();
    paginaAtual = 1;
    aplicarFiltros();
  });
}

/* =====================================================
   LIMPAR TODOS OS FILTROS
   ===================================================== */
if (btnClear) {
  btnClear.addEventListener("click", () => {
    filtroCursoAtivo = null;
    filtroResultadoAtivo = null;
    termoBusca = "";

    if (inputBusca) inputBusca.value = "";
    if (selectCurso) selectCurso.value = "";
    if (selectResultado) selectResultado.value = "";

    document.querySelectorAll(".btn-filtro")
      .forEach(btn => btn.classList.remove("ativo"));

    paginaAtual = 1;
    aplicarFiltros();
  });
}
