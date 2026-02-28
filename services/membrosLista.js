/* =========================
   URL GOOGLE SHEETS
========================= */

const SHEET_URL =
"https://docs.google.com/spreadsheets/d/1h3NkZEERfH5e5_Y3YMzV9qFVPgntxMn96XubDggX6Xo/gviz/tq?tqx=out:csv&gid=531506560";


/* =========================
   CRIAR CARD
========================= */
function criarCard(nick, cargo = "", destaque = false) {

  const card = document.createElement("div");
  card.className = "habbo-card";

  if (destaque) card.classList.add("lider-destaque");

  card.innerHTML = `
    <div class="habbo-avatar">
      <img src="https://www.habbo.com.br/habbo-imaging/avatarimage?user=${encodeURIComponent(nick)}&size=l">
    </div>

    <div class="habbo-name">${nick}</div>
    ${cargo ? `<div class="habbo-cargo">${cargo}</div>` : ""}
  `;

  return card;
}


/* =========================
   RENDER LISTA
========================= */
function renderLista(containerId, lista, mostrarCargo = false, destaque = false) {

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";

  const unicos = new Map();
  lista.forEach(m => unicos.set(m.nick, m));

  [...unicos.values()].forEach((m, index) => {

    const card = criarCard(
      m.nick,
      mostrarCargo ? m.cargo : "",
      destaque
    );

    /* CLICK → ABRIR PAINEL */
    card.addEventListener("click", () => openPanel(m));

    container.appendChild(card);

    setTimeout(() => {
      card.classList.add("enter");
    }, index * 80);
  });
}


/* =========================
   CLASSIFICAR CARGO
========================= */
function classificar(cargo) {

  const c = cargo.toLowerCase();

  if (c === "cargo") return null;

  if (c.includes("líder") && !c.includes("vice")) return "lider";
  if (c.includes("vice")) return "vice";
  if (c.includes("minist")) return "ministros";
  if (c.includes("estagi")) return "estagiarios";
  if (c.includes("graduador")) return "graduadores";
  if (c.includes("tre.3")) return "tre3";
  if (c.includes("tre.2")) return "tre2";
  if (c.includes("tre.1")) return "tre1";

  return null;
}


/* =========================
   PARSE CSV COMPLETO
========================= */
function parseCSV(text) {

  return text.split("\n")
    .map(linha => {

      const cols = linha.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
      if (!cols) return null;

      return {
        cargo: cols[0]?.replace(/"/g,"").trim(),
        nick: cols[1]?.replace(/"/g,"").trim(),
        entrada: cols[2]?.replace(/"/g,"").trim(),
        promo: cols[3]?.replace(/"/g,"").trim(),
        gp: cols[4]?.replace(/"/g,"").trim(),
        cmt: cols[5]?.replace(/"/g,"").trim(),
        cpt: cols[6]?.replace(/"/g,"").trim(),
        cdi: cols[7]?.replace(/"/g,"").trim(),
        ce: cols[8]?.replace(/"/g,"").trim(),
        adv: cols[9]?.replace(/"/g,"").trim(),
        r: cols[10]?.replace(/"/g,"").trim(),
        licencaInicio: cols[11]?.replace(/"/g,"").trim(),
        licencaDias: cols[12]?.replace(/"/g,"").trim(),
        licencaFim: cols[13]?.replace(/"/g,"").trim()
      };
    })
    .filter(Boolean);
}


/* =========================
   UTIL CAMPO PANEL
========================= */
function setCampo(id, valor) {

  const el = document.getElementById(id);
  if (!el) return;

  if (!valor) {
    el.parentElement.style.display = "none";
    return;
  }

  el.parentElement.style.display = "block";
  el.textContent = valor;
}


/* =========================
   ABRIR PAINEL
========================= */
function openPanel(m) {

  document.getElementById("memberPanel")
    .classList.add("active");

  document.getElementById("panelAvatar").src =
    `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${encodeURIComponent(m.nick)}&size=l&direction=3&head_direction=3`;

  document.getElementById("panelNome").textContent = m.nick;
  document.getElementById("panelCargoBadge").textContent = m.cargo;

  setCampo("panelEntrada", m.entrada);
  setCampo("panelPromocao", m.promo);

  setCampo(
    "panelPendente",
    m.gp ? "Sim — Possui graduação pendente" : ""
  );

  /* SUBGRUPO */
  let subgrupo = "";
  if (m.cdi) subgrupo = "Membro do CDI";
  else if (m.cpt) subgrupo = "Membro do CPT";
  else if (m.cmt) subgrupo = "Membro do CMT";

  setCampo("panelSubgrupo", subgrupo);

  setCampo(
    "panelCE",
    m.ce ? "Em Semana Especial" : ""
  );

  /* ADV COM ALERTA */
  const advEl = document.getElementById("panelAdv");

  if (m.adv) {
    advEl.parentElement.style.display = "block";
    advEl.textContent = `${m.adv} advertência(s)`;
    advEl.style.color = "#ffc107";
    advEl.style.fontWeight = "bold";
  } else {
    advEl.parentElement.style.display = "none";
  }

  setCampo(
    "panelRebaixamento",
    m.r ? "Rebaixado" : ""
  );

  setCampo("panelLicencaInicio", m.licencaInicio);
  setCampo("panelLicencaDias", m.licencaDias);
  setCampo("panelLicencaFim", m.licencaFim);
}


/* =========================
   FECHAR PAINEL
========================= */
function closePanel() {
  document.getElementById("memberPanel")
    .classList.remove("active");
}


/* =========================
   CARREGAR PLANILHA
========================= */
async function carregarMembros() {

  try {

    const res = await fetch(SHEET_URL);
    const csv = await res.text();

    const membros = parseCSV(csv);

    const grupos = {
      lider: [],
      vice: [],
      ministros: [],
      estagiarios: [],
      graduadores: [],
      tre3: [],
      tre2: [],
      tre1: []
    };

    membros.forEach(m => {

      if (!m.cargo || !m.nick) return;

      const grupo = classificar(m.cargo);
      if (grupo) grupos[grupo].push(m);
    });

    console.log("✅ Grupos:", grupos);

    /* RENDER */

    renderLista("liderContainer", grupos.lider, false, true);
    renderLista("viceContainer", grupos.vice);
    renderLista("ministrosContainer", grupos.ministros, true);
    renderLista("estagiariosContainer", grupos.estagiarios, true);
    renderLista("graduadoresContainer", grupos.graduadores);
    renderLista("tre3Container", grupos.tre3);
    renderLista("tre2Container", grupos.tre2);
    renderLista("tre1Container", grupos.tre1);

  } catch (e) {
    console.error("❌ Erro ao carregar planilha:", e);
  }
}


/* =========================
   START
========================= */

carregarMembros();