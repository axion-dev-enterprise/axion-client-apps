// src/utils/storeHours.js
// Horário de Funcionamento Oficial da Pizzaria Anne & Tom
// Terça a Domingo, das 18:00 às 23:30 (Segunda-feira: Fechado)

export const checkStoreOpenStatus = () => {
  const now = new Date();
  
  // Converte para o fuso horário de Brasília (UTC-3)
  const spTimeStr = now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" });
  const spDate = new Date(spTimeStr);

  const dayOfWeek = spDate.getDay(); // 0: Domingo, 1: Segunda, 2: Terça, ..., 6: Sábado
  const hours = spDate.getHours();
  const minutes = spDate.getMinutes();

  // Segunda-feira (1): Fechado o dia todo
  if (dayOfWeek === 1) {
    return {
      isOpen: false,
      reason: "Segunda-feira o restaurante é fechado para descanso da equipe.",
      nextOpening: "Terça-feira às 18:00",
      hoursText: "Ter a Dom: 18:00 às 23:30 (Segunda fechado)"
    };
  }

  // Horário de abertura: 18:00 (1080 min) a 23:30 (1410 min)
  const currentMinutes = hours * 60 + minutes;
  const openMinutes = 18 * 60; // 18:00
  const closeMinutes = 23 * 60 + 30; // 23:30

  const isOpen = currentMinutes >= openMinutes && currentMinutes <= closeMinutes;

  if (!isOpen) {
    let nextMsg = "Hoje às 18:00";
    if (currentMinutes > closeMinutes) {
      nextMsg = dayOfWeek === 0 ? "Terça-feira às 18:00" : "Amanhã às 18:00";
    }

    return {
      isOpen: false,
      reason: "Estamos fora do horário de atendimento no momento.",
      nextOpening: nextMsg,
      hoursText: "Ter a Dom: 18:00 às 23:30 (Segunda fechado)"
    };
  }

  return {
    isOpen: true,
    reason: "Aberto agora para entregas e retiradas!",
    estimatedDeliveryTime: "35 - 45 min",
    hoursText: "Ter a Dom: 18:00 às 23:30"
  };
};
