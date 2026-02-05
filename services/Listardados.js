const url = "https://docs.google.com/spreadsheets/d/1Z6lGuzi7IJ6Hmig1DDcCCFydqVhbrC3ACF9QdnLNJ4U/gviz/tq?gid=1415039919&tqx=out:json";

let dadosOriginais = [];

fetch(url)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(
      text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1)
    );

    const rows = json.table.rows;

    dadosOriginais = rows
      .filter(r => r.c)
      .map(r => ({
        dataHora: formatarData(r.c[1]?.v),
        treinador: r.c[2]?.v || "",
        curso: r.c[3]?.v || "",
        inicio: formatarData(r.c[4]?.v),
        termino: formatarData(r.c[5]?.v),
        duracao: r.c[6]?.v || "",
        aluno: r.c[7]?.v || "",
        local: r.c[8]?.v || "",
        resultado: r.c[9]?.v || ""
      }));

    renderTabela(dadosOriginais);

    /* 🔥 DISPARA EVENTO COM OS DADOS */
    document.dispatchEvent(
      new CustomEvent("dadosPlanilhaProntos", {
        detail: dadosOriginais
      })
    );
  })
  .catch(err => {
    console.error("Erro ao carregar a planilha:", err);
  });

function renderTabela(dados) {
  const tbody = document.getElementById("tabela-aulas");
  tbody.innerHTML = "";

  dados.forEach(item => {
    let badgeClass = "reprovado";
    const resultadoLower = item.resultado.toLowerCase();

    if (resultadoLower.includes("aprov")) badgeClass = "aprovado";
    else if (resultadoLower.includes("caiu")) badgeClass = "caiu";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.dataHora}</td>
      <td>${item.treinador}</td>
      <td>${item.curso}</td>
      <td>${item.inicio}</td>
      <td>${item.termino}</td>
      <td>${item.duracao}</td>
      <td>${item.aluno}</td>
      <td>${item.local}</td>
      <td><span class="badge ${badgeClass}">${item.resultado}</span></td>
    `;
    tbody.appendChild(tr);
  });
}
