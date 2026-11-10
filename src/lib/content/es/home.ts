/**
 * Spanish copy for the `/es` home page.
 *
 * Mirrors the English home page section for section. The claims here are the
 * same claims, made in Spanish — nothing may be added that the English page
 * would not be allowed to say: no "best price", no invented numbers.
 *
 * Neutral US/Latin-American Spanish, formal "usted" register.
 */


export const esMeta = {
  // `buildMetadata` appends " | <site name>", so the brand is not repeated here.
  title: "Vuelos, hoteles, renta de autos y cruceros con un agente real",
  description:
    "Vuelos, hoteles, renta de autos, cruceros y aviones privados, reservados con un agente de viajes real: el precio completo desglosado antes de pagar y las reglas de la tarifa explicadas desde el principio.",
};

export const esNumberWords = ["Cero", "Una", "Dos", "Tres", "Cuatro", "Cinco", "Seis", "Siete"] as const;

export const esHero = {
  titleSuffix: "maneras de viajar.",
  titleLine2: "Un solo precio honesto.",
  intro:
    "Busque vuelos, hoteles y aviones privados, o llame y un agente real le reserva cualquier viaje: le explicamos el precio completo y no se le cobra nada hasta que usted diga que sí.",
  tabsLabel: "¿Qué desea reservar?",
  proof: {
    itemised: "Desglose antes de pagar",
    rules: "Reglas desde el principio",
    agents: (hours: string) => `Agentes reales, ${hours}`,
  },
};

/** Vertical labels, keyed by the `verticalCatalogue` key. */
export const esVerticals: Record<string, { label: string; blurb: string }> = {
  flights: {
    label: "Vuelos",
    blurb: "Indíquenos la ruta y un agente le dará el precio.",
  },
  hotels: {
    label: "Hoteles",
    blurb: "Habitaciones cotizadas en total, no por noche.",
  },
  cars: {
    label: "Renta de autos",
    blurb: "Las sorpresas del mostrador, resueltas de antemano.",
  },
  cruises: {
    label: "Cruceros",
    blurb: "Lo que incluye la tarifa, detallado.",
  },
  privateJets: {
    label: "Aviones privados",
    blurb: "El chárter se cotiza por aeronave, no por asiento.",
  },
};

export const esServices = {
  eyebrow: "Lo que reservamos",
  title: "Todo tipo de viaje, una sola agencia",
  description: "Busque en línea o llame: un agente real lo reserva con usted.",
  vacations: {
    label: "Paquetes vacacionales",
    blurb: "Vuelo, hotel y extras planeados como un solo viaje.",
  },
};

export const esDealsSection = {
  eyebrow: "Ofertas",
  title: "Ofertas para todos los viajeros",
  description:
    "Vuelos, hoteles, cruceros y mucho más, además de ofertas para parejas, familias, grupos y clientes frecuentes.",
  seeAll: "Ver todas las ofertas",
};

export const esAbout = {
  eyebrow: "Sobre nosotros",
  title: (name: string) => `¿Por qué los viajeros reservan con ${name}?`,
  description:
    "Somos una agencia de viajes con agentes reales al teléfono de día y de noche. Cuéntenos el viaje: buscamos las opciones, le explicamos el precio total y lo reservamos con usted.",
  more: "Más información sobre nosotros",
  points: (hours: string) => [
    {
      key: "agents",
      title: "Agentes reales",
      body: `Disponibles ${hours}, por teléfono y por chat.`,
    },
    {
      key: "price",
      title: "Precio total primero",
      body: "Impuestos y cargos incluidos antes de pagar.",
    },
    {
      key: "rules",
      title: "Reglas explicadas",
      body: "Equipaje, cambios y cancelaciones por adelantado.",
    },
    {
      key: "trips",
      title: "Todo tipo de viaje",
      body: "Desde un solo vuelo hasta unas vacaciones completas.",
    },
  ],
};

export const esDestinations = {
  eyebrow: "Adónde vamos",
  description:
    "Guías breves y prácticas sobre lo que cambia la forma de planificar, no una lista de atracciones que podría encontrar en cualquier parte.",
  readGuide: "Leer la guía",
  bySlug: {
    london: {
      city: "Londres",
      country: "Reino Unido",
      summary:
        "Seis aeropuertos, barrios infinitos y un sistema de transporte que hace que todo sea accesible.",
    },
    madrid: {
      city: "Madrid",
      country: "España",
      summary:
        "Una capital que se acuesta tarde, cena todavía más tarde y conecta con toda la península ibérica.",
    },
    "mexico-city": {
      city: "Ciudad de México",
      country: "México",
      summary:
        "Una capital inmensa y de gran altitud, que se disfruta mejor barrio por barrio.",
    },
    lisbon: {
      city: "Lisboa",
      country: "Portugal",
      summary:
        "El salto transatlántico más corto desde la costa este de EE. UU., en una ciudad construida sobre colinas.",
    },
    bogota: {
      city: "Bogotá",
      country: "Colombia",
      summary:
        "Una capital de gran altitud y el punto de conexión con el resto de Colombia.",
    },
    rome: {
      city: "Roma",
      country: "Italia",
      summary:
        "Densa, con muchas capas, y mejor visitada fuera del pleno verano.",
    },
    "san-juan": {
      city: "San Juan",
      country: "Puerto Rico",
      summary:
        "El Caribe sin salir de la jurisdicción de EE. UU. y un centro de conexión para las islas del este.",
    },
    tokyo: {
      city: "Tokio",
      country: "Japón",
      summary:
        "Dos aeropuertos, un sistema ferroviario excepcional y una ciudad que premia planificar por distritos.",
    },
  } as Record<string, { city: string; country: string; summary: string }>,
};

export const esBlog = {
  eyebrow: "Blog",
  description:
    "Categorías tarifarias, reglas de conexión y qué es en realidad el deducible de un auto rentado. Explicaciones, no promesas: aquí nadie le dice que reserve un martes.",
  read: "Leer",
  minutes: (n: number) => `${n} min de lectura`,
  categories: {
    Planning: "Planificación",
    Flying: "Vuelos",
    Money: "Dinero",
    Destinations: "Destinos",
  } as Record<string, string>,
  articles: {
    "how-airline-pricing-actually-works": {
      title: "Cómo funcionan realmente los precios de las aerolíneas",
      summary:
        "Por qué el mismo asiento cuesta distinto según el día, y qué significa eso para cuándo reservar.",
    },
    "what-to-check-before-you-book-a-connection": {
      title: "Qué revisar antes de reservar una conexión",
      summary:
        "El tiempo de conexión es el número menos examinado de un itinerario y el que con más probabilidad arruina un viaje.",
    },
    "reading-a-hotel-rate-before-you-book": {
      title: "Cómo leer la tarifa de un hotel antes de reservar",
      summary:
        "Cargos por resort, impuestos de la ciudad y la diferencia entre una tarifa reembolsable y una prepagada.",
    },
    "car-hire-without-the-desk-surprise": {
      title: "Renta de autos sin sorpresas en el mostrador",
      summary:
        "El deducible, la política de combustible y el conductor adicional: las tres cosas que deciden lo que realmente paga.",
    },
    "choosing-a-first-cruise": {
      title: "Cómo elegir su primer crucero",
      summary:
        "El tamaño del barco, el ritmo del itinerario y lo que la tarifa incluye y no incluye.",
    },
    "travel-documents-and-entry-rules": {
      title: "Pasaportes, visas y las reglas que toman por sorpresa a la gente",
      summary:
        "Plazos de vigencia, prueba de viaje de salida y por qué la aerolínea revisa antes que la frontera.",
    },
  } as Record<string, { title: string; summary: string }>,
};

export const esSignUp = {
  title: "Regístrese y gane recompensas",
  body: "Cree una cuenta gratuita para acceder a ofertas exclusivas para miembros y administrar sus viajes en un solo lugar.",
  button: "Regístrese gratis",
  benefits: {
    fares: "Tarifas y ofertas exclusivas",
    members: "Ofertas solo para miembros",
    early: "Acceso anticipado",
    manage: "Administre sus reservas",
  },
};

export const esFaq = {
  eyebrow: "Preguntas frecuentes",
  description:
    "Qué reservamos, cuánto cobramos y qué pasa si cambian sus planes. Respuestas claras antes de que se comprometa.",
  items: [
    {
      question: "¿Qué puede reservar por mí?",
      answer:
        "Vuelos, hoteles, renta de autos y cruceros. Llámenos, o cuéntenos qué necesita a través del sitio, y un agente le responde con opciones cotizadas en su totalidad: el mismo proceso y el mismo desglose de precio en cada caso.",
    },
    {
      question: "¿Son una aerolínea, un hotel o una línea de cruceros?",
      answer:
        "Ninguno de los tres. Somos una agencia de viajes y organizamos viajes como agentes de las aerolíneas, los hoteles, las empresas de renta de autos y las líneas de cruceros que realmente los prestan. Sus propios términos —condiciones de transporte, reglas tarifarias, condiciones de reserva, contratos de renta— rigen lo que usted compra.",
    },
    {
      question: "¿Cobran una tarifa de servicio?",
      answer:
        "Sí, y aparece como una línea aparte en cada cotización antes de que usted pague, sin importar para qué servicio sea. Nuestra tabla completa de tarifas está publicada en la página de tarifas y cargos; no se añade nada en el paso de pago.",
    },
    {
      question: "¿El precio que veo es el precio final?",
      answer:
        "El total que cotizamos incluye lo que cobra el proveedor, los impuestos y cargos obligatorios que lo acompañan y nuestra tarifa de servicio. Eso significa los cargos impuestos por la aerolínea en un vuelo, los cargos de ciudad y de resort en un hotel, los cargos obligatorios de renta en un auto, y los cargos portuarios, impuestos y propinas en un crucero. Los extras opcionales que se compran directamente al proveedor no están incluidos, salvo que la cotización lo indique.",
    },
    {
      question: "¿Puedo cambiar o cancelar después de reservar?",
      answer:
        "Depende de las reglas del proveedor para lo que usted reservó, y son distintas: las reglas tarifarias de una aerolínea, el plazo de cancelación de un hotel, los términos de una empresa de renta de autos, el calendario de cancelación de una línea de cruceros. Le decimos cuáles aplican antes de que pague. No cobramos ninguna tarifa propia por procesar un cambio o una cancelación: usted paga solo lo que cobra el proveedor según sus propias reglas.",
    },
  ],
};

export const esNewsletter = {
  title: "Noticias de viaje, de vez en cuando",
  body: "Nuevas rutas y travesías, cambios de temporada en los lugares que cubrimos y ofertas que de verdad merecen su atención.",
};
