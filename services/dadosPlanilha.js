const url =
  "https://docs.google.com/spreadsheets/d/1Z6lGuzi7IJ6Hmig1DDcCCFydqVhbrC3ACF9QdnLNJ4U/gviz/tq?gid=1415039919&tqx=out:json";

window.dadosPlanilha = [];

function carregarPlanilha() {
  return fetch(url)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(
        text.substring(text.indexOf("{"), text.lastIndexOf("}") + 1)
      );

      const rows = json.table.rows;

      window.dadosPlanilha = rows
        .filter(r => r.c)
        .map(r => {
          const alunosRaw = (r.c[8]?.v || "")
            .split("/")
            .map(a => a.trim())
            .filter(Boolean);

          const status1 = r.c[9]?.v || "";
          const status2 = r.c[10]?.v || "";
          const status3 = r.c[11]?.v || "";

          const alunos = alunosRaw.map((nome, index) => {
            const status =
              index === 0 ? status1 :
              index === 1 ? status2 :
              index === 2 ? status3 : "";

            return { nome, status };
          });

          return {
            dataHora: r.c[1]?.v || "",
            treinador: r.c[2]?.v || "",
            curso: r.c[3]?.v || "",
            inicio: r.c[4]?.v || "",
            termino: r.c[5]?.v || "",
            duracao: r.c[6]?.v || "",
            local: r.c[7]?.v || "",
            aluno: r.c[8]?.v || "",
            alunos,
            resultado: r.c[9]?.v || "",
            comentario: r.c[13]?.v || "-x-",
            tutoria: r.c[12]?.v || ""
          };
        });

      document.dispatchEvent(
        new CustomEvent("planilhaPronta", { detail: window.dadosPlanilha })
      );
    })
    .catch(err => {
      console.error("Erro ao carregar a planilha:", err);
    });
}

// 🔥 AGORA SIM — espera terminar o fetch
carregarPlanilha().finally(() => {
  if (window.finalizarLoader) {
    window.finalizarLoader();
  }
});
