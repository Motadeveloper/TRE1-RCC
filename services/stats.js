const statsSection = document.querySelector('.stats');
const numbers = document.querySelectorAll('.number');

let hasAnimated = false;
let dadosProntos = false;
let totais = {
  aulas: 0,
  aprovados: 0,
  reprovados: 0
};

// 🔢 animação do número
const animateNumber = (el, target) => {
  const duration = 1200;
  const start = performance.now();

  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    el.textContent = Math.floor(progress * target);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  };

  requestAnimationFrame(update);
};

// 📊 recebe os dados da planilha
document.addEventListener("planilhaPronta", (e) => {
  const dados = e.detail;

  totais.aulas = dados.length;

  totais.aprovados = dados.filter(
    item => item.resultado?.toLowerCase() === "aprovado"
  ).length;

  totais.reprovados = dados.filter(
    item => item.resultado?.toLowerCase() === "reprovado"
  ).length;

  dadosProntos = true;
});

// 👀 observa o scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && dadosProntos && !hasAnimated) {
        statsSection.classList.add('visible');

        numbers.forEach(num => {
          const key = num.dataset.key;
          animateNumber(num, totais[key] || 0);
        });

        hasAnimated = true;
        observer.disconnect();
      }
    });
  },
  { threshold: 0.5 }
);

observer.observe(statsSection);