/* =====================================================
   URLS DAS PLANILHAS
===================================================== */

// PLANILHA MEMBROS
const SHEET_MEMBROS =
"https://docs.google.com/spreadsheets/d/1h3NkZEERfH5e5_Y3YMzV9qFVPgntxMn96XubDggX6Xo/gviz/tq?tqx=out:csv&gid=531506560";

// PLANILHA TREINAMENTOS
const SHEET_TREINOS =
"https://docs.google.com/spreadsheets/d/1Z6lGuzi7IJ6Hmig1DDcCCFydqVhbrC3ACF9QdnLNJ4U/gviz/tq?tqx=out:csv&gid=1415039919";


/* =====================================================
   PARSER CSV GENÉRICO
===================================================== */
function parseCSV(text) {
  return text.split("\n")
    .map(linha => linha.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g))
    .filter(Boolean)
    .map(cols => cols.map(c => c.replace(/"/g,"").trim()));
}


/* =====================================================
   BUSCAR PLANILHA
===================================================== */
async function fetchSheet(url, nome) {

  const res = await fetch(url);
  const text = await res.text();

  //console.log(`📄 CSV bruto (${nome}):`, text);

  const data = parseCSV(text);

  //console.log(`✅ CSV parseado (${nome}):`, data);

  return data;
}


/* =====================================================
   CARREGAR TUDO
===================================================== */
async function iniciarRanking() {

  try {

    /* =========================
       BUSCAR AS DUAS PLANILHAS
    ========================= */

    const membrosCSV = await fetchSheet(SHEET_MEMBROS, "MEMBROS");
    const treinosCSV = await fetchSheet(SHEET_TREINOS, "TREINOS");


    /* =========================
       MAPA DE CARGOS
    ========================= */

    const cargos = {};

    membrosCSV.slice(1).forEach(row => {

      const cargo = row[0];
      const nick = row[1];

      if (!cargo || !nick) return;

      cargos[nick.toLowerCase()] = cargo.toLowerCase();
    });

    //console.log("🧩 MAPA DE CARGOS:", cargos);


    /* =====================================================
       DESCOBRIR COLUNAS DINAMICAMENTE (FIX DEFINITIVO)
    ===================================================== */

    const header = treinosCSV[0];

    const COL = {
      treinador: header.indexOf("Treinador"),
      curso: header.indexOf("Curso"),
      alunos: header.indexOf("Alunos")
    };

    //console.log("📌 COLUNAS DETECTADAS:", COL);

    if (COL.treinador === -1) {
      console.error("❌ Não encontrou coluna TREINADOR");
      return;
    }


    /* =========================
       PROCESSAR TREINOS
    ========================= */

    const mapa = {};

    treinosCSV.slice(1).forEach(row => {

      const treinador = row[COL.treinador];
      const curso = (row[COL.curso] || "").toUpperCase();
      const alunosRaw = row[COL.alunos] || "";

      if (!treinador || !curso) return;

      const key = treinador.toLowerCase();

      if (!mapa[key]) {
        mapa[key] = {
          nick: treinador,
          aulas: 0,
          pontos: 0
        };
      }

      mapa[key].aulas++;

      /* ======================
         TRATAR ALUNOS
      ====================== */

      let alunos = alunosRaw
        .split(",")
        .map(a => a.trim())
        .filter(a =>
          a &&
          !a.toLowerCase().includes("não houve") &&
          !a.toLowerCase().includes("nao houve")
        );

      alunos = [...new Set(alunos)];

      const valorCurso =
        curso === "CFS" ? 60 :
        curso === "CAS" ? 40 : 0;

      mapa[key].pontos +=
        alunos.length
          ? alunos.length * valorCurso
          : valorCurso;

    });

    //console.log("📊 RANKING BRUTO:", mapa);


    /* =========================
       FILTRO FINAL
    ========================= */

    const rankingFinal = Object.values(mapa)
      .filter(t => {

        if (t.pontos >= 100) return false;

        const cargo = cargos[t.nick.toLowerCase()] || "";

        return cargo.includes("tre.1");
      })
      .sort((a,b)=>
        b.pontos - a.pontos ||
        a.nick.localeCompare(b.nick,"pt-BR")
      );

    //console.log("🏆 RANKING FINAL:", rankingFinal);

    renderRanking(rankingFinal);

  } catch (e) {
    console.error("❌ ERRO GERAL:", e);
  }
}


/* =====================================================
   RENDER
===================================================== */
function renderRanking(lista) {

  const rankingList = document.getElementById("rankingList");
  if (!rankingList) return;

  rankingList.innerHTML = "";

  lista.forEach(t => {

    const avatar =
      `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${encodeURIComponent(t.nick)}&direction=3&head_direction=3&gesture=sml&size=l`;

    rankingList.innerHTML += `
      <div class="ranking-item">
        <div class="avatar" style="background-image:url('${avatar}')"></div>
        <div class="info">
          <h3>${t.nick}</h3>
          <p>Aulas: ${t.aulas}</p>
        </div>
        <div class="points" style="color:red">
          ${t.pontos} pts
        </div>
      </div>
    `;
  });

}


/* =====================================================
   START
===================================================== */

iniciarRanking();