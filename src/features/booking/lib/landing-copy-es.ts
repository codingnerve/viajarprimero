import type { LandingCopy } from "@/features/booking/lib/landing-copy";

/**
 * Spanish for `/esflights`. Written for a US Hispanic audience in the formal
 * "usted" register, like the rest of the Spanish chrome in `lib/content/es`.
 */
export const landingCopyEs: LandingCopy = {
  lang: "es",
  crumbs: { home: "Inicio", page: "Reservar vuelos" },
  hero: {
    badge: (hours) => `Mesa de vuelos abierta ${hours}`,
    titleTop: "Una llamada.",
    titleBottom: "Su tarifa completa,",
    titleEm: "desglosada.",
    intro:
      "Dígale a un agente de viajes a dónde y cuándo. Usted escucha la tarifa aérea, los impuestos y cargos de la aerolínea y nuestra tarifa de servicio —más las reglas tarifarias de ese boleto— antes de pagar nada.",
    call: (display) => `Llamar al ${display}`,
    how: "Cómo es la llamada",
    passLabel: "Pase de abordar",
    seat: "Asiento: suyo",
    fields: [
      { label: "Origen", hint: "ciudad o aeropuerto" },
      { label: "Destino", hint: "ciudad o aeropuerto" },
      { label: "Salida", hint: "fecha" },
      { label: "Viajeros", hint: "cuántos" },
    ],
    ready: "Tenga estos cuatro datos a la mano y nosotros hacemos el resto.",
    desk: "Llame a la mesa de vuelos",
    ariaCall: (display) => `Llamar al ${display}`,
  },
  ticker: [
    "Agentes de viajes reales",
    "Precio completo antes de pagar",
    "Reglas tarifarias explicadas desde el inicio",
  ],
  steps: {
    eyebrow: "Cómo es la llamada",
    title: "Pasan tres cosas, en este orden.",
    intro:
      "Sin tablas de tarifas que descifrar y sin un total que crece al pagar. Usted habla con una persona y el precio llega en partes claras.",
    items: [
      {
        title: "Diga a dónde y cuándo",
        body: "Ruta, fechas y cuántas personas viajan. Si sus fechas son flexibles, dígalo: cambia lo que buscamos.",
      },
      {
        title: "Escuche el precio completo",
        body: "La tarifa aérea, los impuestos y cargos impuestos por la aerolínea, y nuestra tarifa de servicio, en líneas separadas. Luego, las reglas tarifarias de ese boleto exacto: cambios, reembolsos y equipaje.",
      },
      {
        title: "Decida y luego pague",
        body: "No se reserva nada hasta que usted diga que sí. Si la respuesta es no, cuelga sin haber pagado nada.",
      },
    ],
  },
  receipt: {
    header: "Su cotización · leída en voz alta y luego confirmada",
    lines: [
      { label: "Tarifa aérea", note: "la tarifa de la aerolínea para sus fechas" },
      {
        label: "Impuestos y cargos de la aerolínea",
        note: "desglosados, no mezclados",
      },
      { label: "Nuestra tarifa de servicio", note: "indicada en su propia línea" },
    ],
    onCall: "en la llamada",
    total: "Total, antes de pagar",
    totalValue: "un solo número",
    rules:
      "Más las reglas tarifarias de este boleto, explicadas: cambios, cancelaciones y equipaje.",
    eyebrow: "El precio",
    title: "Armado línea por línea, para que nada se esconda en el total.",
    body: "Una tarifa de anuncio es solo la primera línea de un boleto. Le leemos todas, incluida la nuestra, y usted puede preguntar por cualquiera antes de que salga una tarjeta.",
    cta: (display) => `Pida su cotización · ${display}`,
  },
  routes: {
    eyebrow: "Salidas",
    title: "Las rutas por las que más llaman.",
    to: "a",
    nonstop: (duration) => `Directo, aprox. ${duration}`,
    connection: "Requiere conexión",
    best: "Mejor época",
    callAbout: "Llamar por esta ruta",
    callShort: "Llamar",
    ariaCall: (display, from, to) => `Llamar al ${display} por ${from} a ${to}`,
    showMonths: false,
  },
  faq: {
    eyebrow: "Preguntas",
    title: "Antes de llamar",
    items: (phone, siteName) => [
      {
        question: "¿Pago antes de saber el precio completo?",
        answer:
          "No. Un agente le da la tarifa aérea, los impuestos y cargos impuestos por la aerolínea y nuestra tarifa de servicio, y le explica las reglas tarifarias de ese boleto, antes de que usted pague.",
      },
      {
        question: "¿Quién contesta el teléfono?",
        answer: `Un agente de viajes de ${siteName}, ${phone.hours}. Llame al ${phone.display}.`,
      },
      {
        question: "¿Son una aerolínea?",
        answer: `No. ${siteName} es una agencia de viajes que reserva vuelos en nombre de las aerolíneas. La aerolínea fija la tarifa y sus reglas; nosotros se las explicamos.`,
      },
      {
        question: "¿Qué debo tener listo al llamar?",
        answer:
          "De dónde y a dónde vuela, sus fechas de viaje y cuántas personas viajan. El nombre de cada viajero, tal como aparece en su pasaporte o identificación, hace falta para reservar, no para obtener un precio.",
      },
      {
        question: "¿Puedo cambiar o cancelar un boleto después?",
        answer:
          "Depende de las reglas tarifarias del boleto, por eso las repasamos con usted antes. Nuestra página de reembolsos y cancelaciones explica cómo manejamos las solicitudes.",
      },
    ],
  },
  closing: {
    eyebrow: "Listos cuando usted lo esté",
    title: "Diga la ruta. Escuche el precio.",
    hours: (hours) => `Agentes de viajes reales, ${hours}.`,
    button: "Llamar ahora",
    disclaimer: (siteName) =>
      `${siteName} es una agencia de viajes, no una aerolínea. Las tarifas y sus reglas las fijan las aerolíneas y se confirman con usted antes de reservar nada.`,
  },
};
