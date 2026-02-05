const inputBusca = document.getElementById("busca");
const msgSemRegistro = document.getElementById("sem-registro");

inputBusca.addEventListener("input", function () {
  const termo = this.value.toLowerCase().trim();
  const linhas = document.querySelectorAll("#tabela-aulas tr");

  let encontrou = false;

  // 🔥 Se o campo estiver vazio, reseta tudo
  if (termo === "") {
    linhas.forEach(tr => (tr.style.display = ""));
    msgSemRegistro.style.display = "none";
    return;
  }

  linhas.forEach(tr => {
    const textoLinha = tr.innerText.toLowerCase();

    if (textoLinha.includes(termo)) {
      tr.style.display = "";
      encontrou = true;
    } else {
      tr.style.display = "none";
    }
  });

  // 🔥 Mostra alerta apenas se NÃO encontrou resultado
  msgSemRegistro.style.display = encontrou ? "none" : "block";
});
