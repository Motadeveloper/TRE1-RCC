const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1h3NkZEERfH5e5_Y3YMzV9qFVPgntxMn96XubDggX6Xo/gviz/tq?tqx=out:csv&gid=531506560";

/* ===================================================
   CARD
=================================================== */

function criarCard(nick) {
  const card = document.createElement("div");
  card.classList.add("habbo-card");

  card.innerHTML = `
    <div class="habbo-avatar">
      <img src="https://www.habbo.com.br/habbo-imaging/avatarimage?user=${encodeURIComponent(nick)}&direction=3&head_direction=3&gesture=sml&size=l">
    </div>
    <div class="habbo-name">${nick}</div>
  `;

  return card;
}

function renderCards(container, nicks) {
  container.innerHTML = "";

  const unicos = [...new Set(nicks)];

  unicos.forEach((nick, index) => {
    const card = criarCard(nick);
    container.appendChild(card);

    setTimeout(() => {
      card.classList.add("enter");
    }, index * 100);
  });
}

/* ===================================================
   CSV PARSER (COLUNA A = CARGO | B = NICK)
=================================================== */

function limpar(valor) {
  return valor.replace(/^"+|"+$/g, "").trim();
}

function parseCSV(csv) {
  return csv.split("\n").map(linha => {
    const colunas = linha.split(",");

    return {
      cargo: limpar(colunas[0] || ""),
      nick: limpar(colunas[1] || "")
    };
  });
}

/* ===================================================
   FETCH + FILTRO
=================================================== */

async function carregarMembros() {
  try {
    const res = await fetch(SHEET_URL);
    const csv = await res.text();

    const linhas = parseCSV(csv);

    const lider = [];
    const vices = [];
    const ministros = [];
    const novos = [];

    linhas.forEach(({ cargo, nick }) => {
      if (!cargo || !nick) return;

      const c = cargo.toLowerCase();

      // ignora cabeçalho
      if (c === "cargo") return;

      if (c === "líder") lider.push(nick);

      else if (c.includes("vice")) vices.push(nick);

      else if (c.includes("minist")) ministros.push(nick);

      else if (c === "tre.1") novos.push(nick);
    });

    /* RENDER */

    renderCards(
      document.getElementById("liderViceContainer"),
      [...lider, ...vices]
    );

    renderCards(
      document.getElementById("ministrosContainer"),
      ministros
    );

    renderCards(
      document.getElementById("novosContainer"),
      novos.slice(-4).reverse()
    );

  } catch (erro) {
    console.error("Erro ao carregar planilha:", erro);
  }
}

/* iniciar */
carregarMembros();