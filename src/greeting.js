function createGreeting(name) {
  const normalizedName = name?.trim().slice(0, 50) || "visitante";
  return `Ola, ${normalizedName}! Bem-vindo a aplicacao de exemplo.`;
}

module.exports = { createGreeting };
