// Menu Lateral 

const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const content = document.getElementById("content");

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("open");
  content.classList.toggle("shift");
});





// Fechar Menu



const menuLinks = document.querySelectorAll("#sidebar a");

menuLinks.forEach(link => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("open");
    content.classList.remove("shift");
  });
});



// Contador de Meta Semanal ( SÁBADO 23:59 )


function nextSaturdayReset() {
  const now = new Date();
  const day = now.getDay();
  const diff = (6 - day + 7) % 7;

  let nextSat = new Date(now);
  nextSat.setDate(now.getDate() + diff);
  nextSat.setHours(23, 59, 0, 0);

  if (nextSat <= now) {
    nextSat.setDate(nextSat.getDate() + 7);
  }
  return nextSat;
}

function updateCounter() {
  const now = new Date();
  const target = nextSaturdayReset();
  const diff = target - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  let parts = [];

  if (days > 0) parts.push(`${days} ${days === 1 ? 'dia' : 'dias'}`);
  if (hours > 0) parts.push(`${hours} ${hours === 1 ? 'hora' : 'horas'}`);
  if (minutes > 0) parts.push(`${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`);
  if (seconds > 0) parts.push(`${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`);

  if (parts.length === 0) {
    parts.push("0 segundos");
  }

  document.getElementById("time").innerText =
    `Faltam ${parts.join(", ")} para fim da meta semanal.`;

  const counter = document.getElementById("counter");
  if (diff <= 30 * 60 * 1000) {
    counter.classList.add("alert");
  } else {
    counter.classList.remove("alert");
  }
}

setInterval(updateCounter, 1000);
updateCounter();
