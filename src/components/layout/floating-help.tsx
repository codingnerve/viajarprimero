"use client";

import { useState } from "react";

import { ChatWidget } from "@/components/layout/chat-widget";
import { TravelHelpBubble } from "@/components/layout/travel-help-bubble";
import { configured } from "@/lib/config/placeholders";
import { useLocale } from "@/hooks/use-locale";
import { phoneFor } from "@/lib/config/site";

/**
 * Owns the one piece of state the two floating corner widgets share: whether
 * the travel-help bubble is on screen.
 *
 * They collide otherwise. The bubble is a full-width card in the bottom
 * gutter on phones, which is exactly where the chat launcher sits, so while
 * the bubble is up the launcher shrinks to an arrow above it and its panel
 * opens higher. Dismissing the bubble has to put the launcher back down in
 * the corner — that is a single flag, and it lives here rather than in a
 * context because `RootLayout` is the only place either widget is mounted.
 *
 * The `configured()` gate lives here too, for the same reason: `ChatWidget`
 * has to know whether the bubble will actually render, and an unset
 * `TODO_PHONE` means it never does.
 *
 * Dismissal is plain component state, not persisted: `RootLayout` does not
 * remount across client-side navigation, so closing it holds for the rest of
 * the visit without needing storage.
 */
export function FloatingHelp() {
  const [dismissed, setDismissed] = useState(false);

  const line = phoneFor(useLocale());
  const phone = configured(line.phone);
  const phoneDisplay = configured(line.phoneDisplay);
  const bubbleShown = Boolean(phone && phoneDisplay) && !dismissed;

  return (
    <>
      {bubbleShown && phone && phoneDisplay && (
        <TravelHelpBubble
          phone={phone}
          phoneDisplay={phoneDisplay}
          onDismiss={() => setDismissed(true)}
        />
      )}
      <ChatWidget yieldBottomGutter={bubbleShown} />
    </>
  );
}
