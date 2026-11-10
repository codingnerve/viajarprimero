/**
 * Tawk.to live chat (free, unlimited agents; agents reply from tawk.to or its
 * phone app).
 *
 * Set NEXT_PUBLIC_TAWK_PROPERTY_ID and NEXT_PUBLIC_TAWK_WIDGET_ID — both are in
 * the widget's direct chat link, https://tawk.to/chat/<property>/<widget>.
 *
 * The script loads only when someone first opens the chat, and Tawk's own
 * bubble stays hidden: the site's chat button opens it and minimising hides it
 * again. Browser-only — call from event handlers.
 */

interface TawkApi {
  onLoad?: () => void;
  onChatMinimized?: () => void;
  hideWidget?: () => void;
  showWidget?: () => void;
  maximize?: () => void;
}

declare global {
  interface Window {
    Tawk_API?: TawkApi;
    Tawk_LoadStart?: Date;
  }
}

const PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID;
const WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID;

let status: "idle" | "loading" | "ready" = "idle";

export const tawkConfigured = () => Boolean(PROPERTY_ID && WIDGET_ID);

/** Opens Tawk.to chat. Returns false when it is not configured. */
export function openTawkChat(): boolean {
  if (!tawkConfigured()) return false;

  const existing = window.Tawk_API;
  if (status === "ready" && existing) {
    existing.showWidget?.();
    existing.maximize?.();
    return true;
  }
  if (status === "loading") return true;

  status = "loading";
  const api: TawkApi = existing ?? {};
  window.Tawk_API = api;
  window.Tawk_LoadStart = new Date();

  api.onLoad = () => {
    status = "ready";
    api.maximize?.();
  };
  api.onChatMinimized = () => api.hideWidget?.();

  const script = document.createElement("script");
  script.async = true;
  script.charset = "UTF-8";
  script.src = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;
  script.setAttribute("crossorigin", "*");
  document.body.appendChild(script);

  return true;
}
