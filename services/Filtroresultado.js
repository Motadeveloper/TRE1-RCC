document.addEventListener("DOMContentLoaded", function () {
  const selectResultado = document.getElementById("filtroResultado");
  const alertaSemRegistro = document.getElementById("sem-registro");

  if (!selectResultado) return;

  selectResultado.addEventListener("change", function () {
    const valor = this.value.toLowerCase();

    // 🔹 se estiver vazio, mostra tudo e esconde alerta
    if (!valor) {
      renderTabela(dadosOriginais);
      if (alertaSemRegistro) alertaSemRegistro.style.display = "none";
      return;
    }

    const filtrados = dadosOriginais.filter(item =>
      item.resultado &&
      item.resultado.toLowerCase().includes(valor)
    );

    // 🔥 controla alerta
    if (filtrados.length === 0) {
      if (alertaSemRegistro) alertaSemRegistro.style.display = "block";
    } else {
      if (alertaSemRegistro) alertaSemRegistro.style.display = "none";
    }

    renderTabela(filtrados);
  });
});
