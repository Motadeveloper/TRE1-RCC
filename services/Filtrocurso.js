document.addEventListener("DOMContentLoaded", function () {
  const selectCurso = document.getElementById("filtroCurso");

  if (!selectCurso) return;

  selectCurso.addEventListener("change", function () {
    const valor = this.value.toLowerCase();

    // se estiver vazio, mostra tudo
    if (!valor) {
      renderTabela(dadosOriginais);
      return;
    }

    const filtrados = dadosOriginais.filter(item =>
      item.curso.toLowerCase() === valor
    );

    renderTabela(filtrados);
  });
});
