function formatarData(valor) {
  if (typeof valor === "string" && valor.startsWith("Date(")) {
    const partes = valor
      .replace("Date(", "")
      .replace(")", "")
      .split(",")
      .map(Number);

    const data = new Date(
      partes[0],
      partes[1],
      partes[2],
      partes[3] || 0,
      partes[4] || 0,
      partes[5] || 0
    );

    return data.toLocaleString("pt-BR");
  }

  return valor || "";
}
