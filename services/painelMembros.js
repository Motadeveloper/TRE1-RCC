function openMember(card){

  const nome = card.dataset.nome || "Nando";
  const cargo = card.dataset.cargo || "-";

  const panel = document.getElementById("memberPanel");
  panel.classList.add("active");

  /* nome */
  document.getElementById("panelNome").innerText = nome;
  document.getElementById("panelCargoBadge").innerText = cargo;

  /* avatar HABBO automático */
  document.getElementById("panelAvatar").src =
    `https://www.habbo.com.br/habbo-imaging/avatarimage?user=${nome}&size=l&direction=3&head_direction=3&gesture=sml`;

  /* infos */
  document.getElementById("panelEntrada").innerText = card.dataset.entrada || "-";
  document.getElementById("panelPromocao").innerText = card.dataset.promocao || "-";
  document.getElementById("panelPendente").innerText = card.dataset.pendente || "-";
  document.getElementById("panelSubgrupo").innerText = card.dataset.subgrupo || "-";
  document.getElementById("panelCE").innerText = card.dataset.ce || "-";
  document.getElementById("panelAdv").innerText = card.dataset.adv || "-";
  document.getElementById("panelRebaixamento").innerText = card.dataset.rebaixamento || "-";
  document.getElementById("panelLicencaInicio").innerText = card.dataset.licenca_inicio || "-";
  document.getElementById("panelLicencaDias").innerText = card.dataset.licenca_dias || "-";
  document.getElementById("panelLicencaFim").innerText = card.dataset.licenca_fim || "-";
}

function closePanel(){
  document.getElementById("memberPanel")
    .classList.remove("active");
}