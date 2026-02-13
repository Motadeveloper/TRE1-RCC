let dadosOriginais = [];
let paginaAtual = 1;
const itensPorPagina = 10;

let filtroCursoAtivo = null;      
let filtroResultadoAtivo = null;  
let termoBusca = "";              

const loader = document.getElementById("loader");
const lessonsContainer = document.getElementById("lessons");
const inputBusca = document.getElementById("busca");
const btnClear = document.querySelector(".btn-clear");

// Controla paginação superior e inferior


const paginations = document.querySelectorAll(".pagination");


// Carregamento

function showLoader() {
  loader.style.display = "flex";
  lessonsContainer.style.display = "none";

  // Esconde paginação durante carregamento
  paginations.forEach(p => p.style.display = "none");
}

function hideLoader() {
  loader.style.display = "none";
  lessonsContainer.style.display = "block";
}


// Avatar API Habbo Hotel


function treinadorAvatar(user) {
  return `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${encodeURIComponent(user)}&headonly=1&head_direction=10&size=m`;
}

function alunoAvatar(user) {
  return `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${encodeURIComponent(user)}&headonly=1&head_direction=4&size=m`;
}


// Formatação da Data


function formatarData(valor) {
  if (!valor) return "";
  const data = new Date(valor);
  return data.toLocaleString("pt-BR");
}



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


// Filtro e Busca


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


// Aplicação de Filtros


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


// Renderização da Pesquisa


function renderFAQ(dados) {
  lessonsContainer.innerHTML = "";

  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;

  dados.slice(inicio, fim).forEach(item => {

    const alunos = item.alunos || [];
    const temMultiplosAlunos = alunos.length > 1;

    let statusClass = "";
    const resultado = (item.resultado || "").toLowerCase();

    if (!temMultiplosAlunos) {
      if (resultado.includes("aprov")) statusClass = "aprovado";
      else if (resultado.includes("caiu")) statusClass = "caiu";
      else statusClass = "reprovado";
    } else {
      statusClass = "multi-alunos";
    }

    const alunosHtml = alunos.map(aluno => `
        <div class="aluno">
          <img src="${alunoAvatar(aluno.nome)}">
          <div class="info">
            <strong>${aluno.nome}</strong><br>
            <span class="role">${aluno.status || ""}</span>
          </div>
        </div>
    `).join("");

    lessonsContainer.innerHTML += `
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



// Paginação


function atualizarPaginacao(dados) {

  const totalPaginas = Math.max(1, Math.ceil(dados.length / itensPorPagina));

  const texto = `Página ${paginaAtual} de ${totalPaginas}`;

  const pageInfo = document.getElementById("pageInfo");
  const pageInfoTop = document.getElementById("pageInfoTop");

  if (pageInfo) pageInfo.innerText = texto;
  if (pageInfoTop) pageInfoTop.innerText = texto;

  if (totalPaginas > 1) {
    paginations.forEach(p => p.style.display = "flex");
  } else {
    paginations.forEach(p => p.style.display = "none");
  }
}


function nextPage() {
  const dados = obterDadosAtuais();
  const totalPaginas = Math.ceil(dados.length / itensPorPagina);

  if (paginaAtual < totalPaginas) {
    paginaAtual++;
    trocarPagina(dados);
  }
}

function prevPage() {
  if (paginaAtual > 1) {
    paginaAtual--;
    const dados = obterDadosAtuais();
    trocarPagina(dados);
  }
}


// Troca de pagina da listagem


function trocarPagina(dados) {
  showLoader();

  setTimeout(() => {
    renderFAQ(dados);
    atualizarPaginacao(dados);
    hideLoader();
  }, 300);
}

// Filtro Botões e Select

const selectCurso = document.getElementById("selectCurso");
const selectResultado = document.getElementById("selectResultado");

// Botões pro curso


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

// Rederização da filtragem por Curso

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



// Select Mobile


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

// Renderização do Select Mobile



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


// Busca por Treinadores


if (inputBusca) {
  inputBusca.addEventListener("input", () => {
    termoBusca = inputBusca.value.trim().toLowerCase();
    paginaAtual = 1;
    aplicarFiltros();
  });
}




// Clear da Pesquisa


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
