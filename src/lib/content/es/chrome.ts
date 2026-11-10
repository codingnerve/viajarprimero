/**
 * Spanish copy for the site chrome: header, mobile menu, footer, cookie banner
 * and the floating help bubble.
 *
 * Written for a US Hispanic audience, in the formal "usted" register. Labels
 * are keyed by the English nav `href`, so the English config stays the single
 * source of which links exist — a link added there falls back to its English
 * label here until someone writes the Spanish one.
 *
 * Links point at the same English pages. Once a visitor is on `/es`, the proxy
 * keeps them on the browser-translated `/es/...` version of those pages.
 */

export const esChrome = {
  skipToMain: "Saltar al contenido principal",

  nav: {
    "/flights": "Vuelos",
    "/private-jets": "Jets privados",
    "/cruises": "Cruceros",
    "/hotels": "Hoteles",
    "/car-rentals": "Autos",
    "/trains": "Trenes",
    "/vacations": "Paquetes",
    "/about": "Nosotros",
    "/deals": "Ofertas",
    "/reviews": "Reseñas",
    "/travel-blog": "Blog",
    "/customer-support": "Atención al cliente",
    "/contact": "Contáctenos",
  } as Record<string, string>,

  strip: (hours: string) => `Agentes de viaje reales, ${hours}`,
  homeLabel: (name: string) => `${name} — inicio`,
  helpNavLabel: "Ayuda",
  mainNavLabel: "Principal",
  siteNavLabel: "Sitio",

  manageTrips: "Administrar mis viajes",

  call: {
    label: "Llame a nuestros agentes",
    aria: (phone: string) => `Llame a nuestros agentes de viaje: ${phone}`,
    mobile: (phone: string) => `Llamar al ${phone}`,
  },

  menu: { open: "Abrir menú", close: "Cerrar menú" },

  language: {
    select: "Seleccione su idioma",
    aria: (label: string) => `Idioma: ${label}`,
  },

  deals: {
    open: "Abrir menú de ofertas",
    close: "Cerrar menú de ofertas",
    seeAll: "Ver todas las ofertas →",
  },

  footer: {
    columns: {
      Book: "Reservar",
      "Traveller tools": "Herramientas para el viajero",
      Company: "Empresa",
      Legal: "Legal",
    } as Record<string, string>,
    links: {
      "/flights": "Vuelos",
      "/hotels": "Hoteles",
      "/car-rentals": "Renta de autos",
      "/cruises": "Cruceros",
      "/trains": "Trenes",
      "/vacations": "Paquetes vacacionales",
      "/private-jets": "Aviones privados",
      "/deals": "Ofertas",
      "/manage-booking": "Administrar una reserva",
      "/destinations": "Destinos",
      "/guides": "Guías de viaje",
      "/travel-blog": "Blog",
      "/airlines": "Aerolíneas",
      "/airports": "Aeropuertos",
      "/online-check-in": "Check-in en línea",
      "/baggage-information": "Información de equipaje",
      "/about": "Sobre nosotros",
      "/how-it-works": "Cómo funciona",
      "/contact": "Contáctenos",
      "/reviews": "Reseñas",
      "/customer-support": "Atención al cliente",
      "/site-map": "Mapa del sitio",
      "/privacy-policy": "Política de privacidad",
      "/your-privacy-choices": "Sus opciones de privacidad",
      "/cookie-policy": "Política de cookies",
      "/terms-and-conditions": "Términos y condiciones",
      "/refund-and-cancellation-policy": "Reembolsos y cancelaciones",
      "/fees-and-charges": "Tarifas y cargos",
      "/disclaimer": "Aviso legal",
      "/accessibility-statement": "Accesibilidad",
      "/photo-credits": "Créditos de fotos",
    } as Record<string, string>,
    cookieChoices: "Opciones de cookies",
    ctaTitle: "¿Listo para planear su viaje?",
    ctaBody:
      "Llame a un agente real o envíenos los detalles: el precio completo va antes de que usted pague.",
    ctaCall: (phone: string) => `Llamar al ${phone}`,
    ctaQuote: "Solicitar cotización",
    agency: (name: string) =>
      `${name} es una agencia de viajes y corredor de vuelos chárter. Organizamos viajes aéreos, alojamiento, renta de autos, cruceros y vuelos privados como agente de las aerolíneas, hoteles, empresas de renta de autos, líneas de cruceros y transportistas aéreos con licencia que los operan; no somos una aerolínea, hotel, empresa de renta de autos, línea de cruceros ni transportista aéreo, y no somos propietarios, operadores ni tripulantes de ninguna aeronave, barco o vehículo. Las condiciones de transporte, las condiciones de reserva y las reglas tarifarias de cada proveedor rigen lo que usted compra. Los precios y la disponibilidad los proporcionan esos operadores y cambian hasta que la reserva se confirma y se emite el boleto.`,
    sellerOfTravel: (state: string, scheme: string, number: string) =>
      `Vendedor de viajes registrado en ${state}, ${scheme} ${number}`,
    californiaNotApproval:
      "El registro como vendedor de viajes en California no constituye una aprobación del Estado de California.",
    californiaNotParticipant:
      "No participamos en el Fondo de Restitución para Consumidores de Viajes de California.",
    californiaParticipant:
      "Participamos en el Fondo de Restitución para Consumidores de Viajes de California.",
    rights: "Todos los derechos reservados.",
  },

  cookie: {
    title: "Cookies en este sitio",
    intro: "Usamos cookies para que el sitio funcione y, con su permiso, para medir cómo se usa. Lea nuestra",
    policy: "política de cookies",
    gpc: "Su navegador envía una señal de Control Global de Privacidad. La tratamos como una exclusión voluntaria, por lo que las cookies de marketing permanecen desactivadas, elija lo que elija aquí.",
    legend: "Categorías de cookies",
    essential: "Esenciales",
    essentialBody:
      "necesarias para que el sitio funcione, incluido recordar esta elección. Siempre activas.",
    analytics: "Analíticas",
    analyticsBody: "medición agregada de cómo se usan las páginas.",
    marketing: "Marketing",
    marketingBody: "medir qué anuncios llevan a una reserva.",
    marketingOff:
      "Desactivadas, porque su navegador envía una señal de Control Global de Privacidad.",
    save: "Guardar mis opciones",
    acceptAll: "Aceptar todas",
    reject: "Rechazar las no esenciales",
    choose: "Elegir categorías",
  },

  bubble: {
    tag: "Ayuda de viaje",
    dismiss: "Cerrar ayuda de viaje",
    talk: "Hable con un especialista en viajes",
    aria: (phone: string) => `Llame a nuestros agentes de viaje: ${phone}`,
  },
};

/** Deal-category labels for the header's "Ofertas" dropdown and the home grid. */
export const esDealGroups: Record<string, string> = {
  "Flight deals": "Ofertas de vuelos",
  "By service": "Por servicio",
  "By traveller": "Por viajero",
  "For our customers": "Para nuestros clientes",
};

export const esDeals: Record<string, { label: string; description: string }> = {
  "last-minute-flight-deals": {
    label: "Ofertas de vuelos de último minuto",
    description: "¿Sale pronto? Revisamos los asientos que aún quedan para sus fechas.",
  },
  "coupon-deals": {
    label: "Ofertas con cupones y códigos promocionales",
    description:
      "Comparamos los cupones de nuestros socios y nuestros propios códigos con su ruta, y aplicamos el que dé el precio más bajo.",
  },
  "business-class-flights": {
    label: "Vuelos en clase ejecutiva",
    description:
      "Tarifas negociadas y de consolidador en clase ejecutiva, cuando hay alguna disponible para su ruta.",
  },
  "top-airline-deals": {
    label: "Mejores ofertas de aerolíneas",
    description: "Ofertas vigentes de las principales aerolíneas de EE. UU. e internacionales.",
  },
  "student-travel-deals": {
    label: "Ofertas para estudiantes",
    description: "Tarifas para estudiantes que viajan al campus, a casa o al extranjero.",
  },
  "deals-for-seniors": {
    label: "Ofertas para personas mayores",
    description: "Tarifas para personas mayores y ayuda con asistencia, asientos y equipaje.",
  },
  "flight-hotel-deals": {
    label: "Ofertas de vuelo + hotel",
    description:
      "Reservados juntos, el total suele ser menor que por separado; el agente revisa ambas opciones para sus fechas.",
  },
  "hotel-deals": {
    label: "Ofertas de hoteles",
    description:
      "Tarifas negociadas y de socios en las ciudades y los centros turísticos a los que usted va.",
  },
  "car-deals": {
    label: "Ofertas de renta de autos",
    description: "Ofertas de renta en aeropuertos y en ubicaciones de la ciudad.",
  },
  "cruise-deals": {
    label: "Ofertas de cruceros",
    description:
      "Ofertas de navegación, mejoras de camarote y crédito a bordo, cuando la línea las ofrece.",
  },
  "private-jet-deals": {
    label: "Ofertas de aviones privados",
    description: "Vuelos vacíos y ofertas de chárter de solo ida.",
  },
  "vacation-deals": {
    label: "Ofertas de vacaciones",
    description: "Paquetes de operadores con vuelo, hospedaje y traslados cotizados como uno solo.",
  },
  "couples-deals": {
    label: "Ofertas para parejas",
    description: "Viajes para dos: escapadas, paseos por la ciudad y estancias en la playa.",
  },
  "honeymoon-deals": {
    label: "Ofertas de luna de miel",
    description:
      "Paquetes de luna de miel con mejoras de habitación en los hoteles que las ofrecen.",
  },
  "family-deals": {
    label: "Ofertas familiares",
    description: "Habitaciones familiares, tarifas para niños y viajes pensados para los más pequeños.",
  },
  "newborn-deals": {
    label: "Ofertas para recién nacidos",
    description: "Viajar con un bebé: tarifas para infantes, asientos con cuna y cunas de hotel.",
  },
  "solo-traveller-deals": {
    label: "Ofertas para viajeros solos",
    description: "Habitaciones individuales y tarifas para un viajero sin el recargo habitual.",
  },
  "group-deals": {
    label: "Ofertas para grupos",
    description: "Tarifas de grupo y bloques de habitaciones para 10 o más viajeros.",
  },
  "existing-customer-deals": {
    label: "Ofertas para clientes frecuentes",
    description: "¿Ya reservó con nosotros? Pida su oferta de cliente frecuente.",
  },
  "double-deals": {
    label: "Ofertas dobles",
    description:
      "Si un proveedor permite aplicar dos ofertas a la misma reserva, aplicamos ambas. No todas las ofertas se pueden combinar; el agente le indicará cuáles sí.",
  },
};
