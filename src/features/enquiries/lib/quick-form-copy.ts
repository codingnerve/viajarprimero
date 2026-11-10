import { verticalCopy } from "@/features/enquiries/lib/enquiry";
import type { EnquiryVertical } from "@/features/enquiries/types";
import type { Locale } from "@/types/locale";

/**
 * Display strings for the quick enquiry form, per locale and vertical.
 *
 * Which cells a vertical shows (`end`, `origin`, `vehicle`, the picklists) is
 * still decided by `verticalCopy`; this module only supplies the words. The
 * English entries are read from `verticalCopy` so they cannot drift from it.
 * Picklist contents (ports, states, car classes, regions) are data and stay as
 * they are.
 */
export interface VerticalQuickCopy {
  /** Short vertical name. */
  label: string;
  /** aria-label of the whole form. */
  ariaLabel: string;
  destinationLabel: string;
  destinationPlaceholder: string;
  destinationMissing: string;
  startLabel: string;
  startMissing: string;
  end: { label: string; missing: string; beforeStart: string } | null;
  origin: { question: string; placeholder: string; missing: string } | null;
  vehicle: { label: string; placeholder: string; missing: string } | null;
}

export interface QuickFormCopy {
  verticals: Record<EnquiryVertical, VerticalQuickCopy>;
  datePassed: string;
  noPortMatch: (query: string) => string;
  noRegionMatch: (query: string) => string;
  noClassMatch: (query: string) => string;
  submit: string;
  disclaimer: string;
}

const VERTICALS: readonly EnquiryVertical[] = [
  "stay",
  "car",
  "cruise",
  "jet",
  "vacation",
];

function englishVertical(vertical: EnquiryVertical): VerticalQuickCopy {
  const source = verticalCopy[vertical];
  return {
    label: source.label,
    ariaLabel: `${source.label} quote request`,
    destinationLabel: source.destinationLabel,
    destinationPlaceholder: source.destinationPlaceholder,
    destinationMissing: source.destinationMissing,
    startLabel: source.startLabel,
    startMissing: source.startMissing,
    end: source.end
      ? {
          label: source.end.label,
          missing: source.end.missing,
          beforeStart: `The ${source.end.label.toLowerCase()} cannot be before the ${source.startLabel.toLowerCase()}.`,
        }
      : null,
    origin: source.origin
      ? {
          question: source.origin.question,
          placeholder: source.origin.placeholder,
          missing: source.origin.missing,
        }
      : null,
    vehicle: source.vehicle
      ? {
          label: source.vehicle.label,
          placeholder: source.vehicle.placeholder,
          missing: source.vehicle.missing,
        }
      : null,
  };
}

const enVerticals = Object.fromEntries(
  VERTICALS.map((vertical) => [vertical, englishVertical(vertical)]),
) as Record<EnquiryVertical, VerticalQuickCopy>;

export const quickFormCopy: Record<Locale, QuickFormCopy> = {
  en: {
    verticals: enVerticals,
    datePassed: "That date has passed.",
    noPortMatch: (query) => `No port matches “${query}”.`,
    noRegionMatch: (query) => `No region matches “${query}”.`,
    noClassMatch: (query) => `No class matches “${query}”.`,
    submit: "Continue",
    disclaimer:
      "A request, not a booking. Nothing is held and nothing is charged.",
  },
  es: {
    verticals: {
      stay: {
        label: "Hotel",
        ariaLabel: "Solicitud de cotización de hotel",
        destinationLabel: "Ciudad o zona",
        destinationPlaceholder: "Ciudad, zona u hotel",
        destinationMissing: "Indique en qué ciudad o zona necesita una habitación.",
        startLabel: "Entrada",
        startMissing: "Agregue la fecha de entrada.",
        end: {
          label: "Salida",
          missing: "Agregue la fecha de salida.",
          beforeStart: "La salida no puede ser anterior a la entrada.",
        },
        origin: null,
        vehicle: null,
      },
      car: {
        label: "Renta de autos",
        ariaLabel: "Solicitud de cotización de renta de autos",
        destinationLabel: "Lugar de recogida",
        destinationPlaceholder: "Elija un estado",
        destinationMissing: "Indique en qué estado recogerá el auto.",
        startLabel: "Fecha de recogida",
        startMissing: "Agregue la fecha de recogida.",
        end: {
          label: "Fecha de devolución",
          missing: "Agregue la fecha de devolución.",
          beforeStart:
            "La fecha de devolución no puede ser anterior a la fecha de recogida.",
        },
        origin: null,
        vehicle: {
          label: "Tipo de auto",
          placeholder: "Elija una clase",
          missing: "Indique aproximadamente qué tamaño de auto necesita.",
        },
      },
      cruise: {
        label: "Crucero",
        ariaLabel: "Solicitud de cotización de crucero",
        destinationLabel: "¿A dónde desea ir?",
        destinationPlaceholder: "Caribe, Mediterráneo, Alaska…",
        destinationMissing: "Indique a dónde le gustaría navegar.",
        startLabel: "Fecha de zarpe",
        startMissing: "Indique aproximadamente cuándo desea zarpar.",
        end: null,
        origin: {
          question: "¿Desde dónde desea zarpar?",
          placeholder: "Elija un puerto de salida",
          missing: "Indique desde qué puerto le gustaría zarpar.",
        },
        vehicle: null,
      },
      vacation: {
        label: "Paquete vacacional",
        ariaLabel: "Solicitud de cotización de paquete vacacional",
        destinationLabel: "Destino",
        destinationPlaceholder: "Ciudad, isla o región",
        destinationMissing: "Indique a dónde desea ir.",
        startLabel: "Salida",
        startMissing: "Agregue la fecha de salida.",
        end: {
          label: "Regreso",
          missing: "Agregue la fecha de regreso.",
          beforeStart: "El regreso no puede ser anterior a la salida.",
        },
        origin: {
          question: "¿Desde dónde volará?",
          placeholder: "Ciudad o aeropuerto",
          missing: "Indique desde qué aeropuerto volaría.",
        },
        vehicle: null,
      },
      jet: {
        label: "Avión privado",
        ariaLabel: "Solicitud de cotización de avión privado",
        destinationLabel: "Llegada a",
        destinationPlaceholder: "Aeropuerto o ciudad",
        destinationMissing: "Indique a dónde va el vuelo.",
        startLabel: "Fecha de salida",
        startMissing: "Agregue la fecha de salida.",
        end: {
          label: "Fecha de regreso",
          missing: "Agregue la fecha de regreso.",
          beforeStart:
            "La fecha de regreso no puede ser anterior a la fecha de salida.",
        },
        origin: {
          question: "Salida desde",
          placeholder: "Aeropuerto o ciudad",
          missing: "Indique desde dónde sale el vuelo.",
        },
        vehicle: null,
      },
    },
    datePassed: "Esa fecha ya pasó.",
    noPortMatch: (query) => `Ningún puerto coincide con “${query}”.`,
    noRegionMatch: (query) => `Ninguna región coincide con “${query}”.`,
    noClassMatch: (query) => `Ninguna clase coincide con “${query}”.`,
    submit: "Continuar",
    disclaimer:
      "Una solicitud, no una reserva. No se retiene ni se cobra nada.",
  },
};
