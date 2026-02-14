document.addEventListener("DOMContentLoaded", () => {

  const loader = document.getElementById("globalLoader");
  const loaderMessage = document.getElementById("loaderMessage");

  const mensagens = [
    "Baixando dados do TRE",
    "Aguarde, carregando dados"
  ];

  let indexMensagem = 0;

  const intervaloMensagem = setInterval(() => {
    indexMensagem = (indexMensagem + 1) % mensagens.length;
    loaderMessage.textContent = mensagens[indexMensagem];
  }, 2000);

  // função global para esconder
  window.finalizarLoader = function () {
    clearInterval(intervaloMensagem);
    loader.classList.add("hide");
  };

});
