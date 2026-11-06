"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const READY_URL = "/api/hosted-ready";

type ProbeState = "checking" | "up" | "down" | "unknown";

export function StatusProbe() {
  const t = useTranslations("status.probe");
  const [state, setState] = useState<ProbeState>("checking");

  useEffect(() => {
    const controller = new AbortController();
    let timedOut = false;
    const timer = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 8000);

    fetch(READY_URL, { signal: controller.signal, cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          setState("down");
          return;
        }
        const body = (await response.json()) as { state?: ProbeState };
        setState(body.state === "up" || body.state === "down" ? body.state : "unknown");
      })
      .catch(() => {
        if (controller.signal.aborted && !timedOut) {
          return;
        }
        setState("unknown");
      })
      .finally(() => window.clearTimeout(timer));

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <p
      className="rounded-2xl border border-border bg-card p-5 text-base font-semibold text-foreground"
      role="status"
      aria-live="polite"
    >
      {t(state)}
    </p>
  );
}
