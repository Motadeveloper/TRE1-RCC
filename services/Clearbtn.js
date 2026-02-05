document.addEventListener('DOMContentLoaded', function () {
  const inputBusca = document.getElementById('busca');
  const selectCurso = document.getElementById('filtroCurso');
  const btnLimpar = document.querySelector('.btn-clear');

  if (btnLimpar) {
    btnLimpar.addEventListener('click', function () {

      // 🔹 limpa o campo de busca
      if (inputBusca) {
        inputBusca.value = '';
        inputBusca.dispatchEvent(new Event('input'));
      }

      // 🔹 reseta o select Curso para "Curso"
      if (selectCurso) {
        selectCurso.value = '';
        selectCurso.dispatchEvent(new Event('change'));
      }

      // foco opcional
      if (inputBusca) {
        inputBusca.focus();
      }
    });
  }
});
