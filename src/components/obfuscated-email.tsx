"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

/** True only after client-side hydration (no setState-in-effect). */
function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * Renders an email address that is resistant to naive bot scraping:
 * - The plain `user@domain` string never appears in the static (SSR) HTML.
 * - SSR / no-JS fallback shows a human-readable, bot-resistant form
 *   ("db (at) synaplan (dot) com").
 * - After hydration it becomes a real `mailto:` link.
 */
export function ObfuscatedEmail({
  user,
  domain,
  className,
}: {
  user: string;
  domain: string;
  className?: string;
}) {
  const isClient = useIsClient();

  if (isClient) {
    const address = `${user}@${domain}`;
    return (
      <a href={`mailto:${address}`} className={className}>
        {address}
      </a>
    );
  }

  const obfDomain = domain.replace(/\./g, " (dot) ");
  return (
    <span className={className}>
      {user} (at) {obfDomain}
    </span>
  );
}
