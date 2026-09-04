// src/utils/deliveryFee.js
// Cálculo Dinâmico da Taxa de Entrega por CEP (São Paulo / Zona Norte / Centro)

export const calculateDeliveryFeeByCep = async (cepInput) => {
  const cleanedCep = String(cepInput || "").replace(/\D/g, "");
  if (!cleanedCep || cleanedCep.length !== 8) {
    return { ok: false, error: "CEP inválido. Informe um CEP com 8 dígitos." };
  }

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
    if (!res.ok) throw new Error("Erro na consulta ViaCEP.");
    const data = await res.json();

    if (data.erro) {
      return { ok: false, error: "CEP não encontrado na base dos Correios." };
    }

    const city = data.localidade || "";
    const neighborhood = data.bairro || "";
    const street = data.logradouro || "";
    const uf = data.uf || "";

    if (uf !== "SP") {
      return {
        ok: false,
        outOfRange: true,
        error: "🚫 Desculpe! Entregamos apenas no Estado de SP no momento.",
      };
    }

    const lowerCity = city.toLowerCase();
    const allowedCities = ["são paulo", "guarulhos", "osasco", "santo andré", "são bernardo do campo", "são caetano do sul"];
    if (!allowedCities.some((c) => lowerCity.includes(c))) {
      return {
        ok: false,
        outOfRange: true,
        error: `🚫 Desculpe! Não entregamos em ${city} no momento. Raio de cobertura: São Paulo e Grande SP.`,
      };
    }

    // Tabela de zonas de frete baseada na localidade/bairro
    let fee = 8.90; // Taxa padrão Zona Norte SP
    const lowerNeigh = neighborhood.toLowerCase();

    if (
      lowerNeigh.includes("santana") ||
      lowerNeigh.includes("tucuruvi") ||
      lowerNeigh.includes("mandaqui") ||
      lowerNeigh.includes("tremembé") ||
      lowerNeigh.includes("carandiru") ||
      lowerNeigh.includes("casa verde") ||
      lowerNeigh.includes("limão")
    ) {
      fee = 6.90; // Zona de Entrega Expressa Anne & Tom
    } else if (
      lowerNeigh.includes("centro") ||
      lowerNeigh.includes("sé") ||
      lowerNeigh.includes("bela vista") ||
      lowerNeigh.includes("pinheiros") ||
      lowerNeigh.includes("lapa") ||
      lowerNeigh.includes("mooca")
    ) {
      fee = 11.90;
    } else {
      fee = 14.90;
    }

    return {
      ok: true,
      fee,
      address: {
        street,
        neighborhood,
        city,
        uf,
        cep: cleanedCep,
      },
    };
  } catch (err) {
    console.error("[DeliveryFee] Erro na consulta de CEP:", err);
    return { ok: false, error: "Não foi possível validar o CEP no momento." };
  }
};
