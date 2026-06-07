import { cn } from "@/lib/utils";

/** Small German / Swiss flag chip for the imprint + offices. Decorative. */
export function CountryFlag({
  country,
  className,
}: {
  country: "de" | "ch";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block shrink-0 overflow-hidden rounded shadow-sm ring-1 ring-black/10",
        country === "de" ? "h-6 w-9" : "h-6 w-6",
        className,
      )}
      aria-hidden
    >
      {country === "de" ? (
        <svg viewBox="0 0 5 3" className="block h-full w-full">
          <rect width="5" height="1" y="0" fill="#000000" />
          <rect width="5" height="1" y="1" fill="#DD0000" />
          <rect width="5" height="1" y="2" fill="#FFCE00" />
        </svg>
      ) : (
        <svg viewBox="0 0 32 32" className="block h-full w-full">
          <rect width="32" height="32" fill="#D52B1E" />
          <rect x="13" y="6" width="6" height="20" fill="#ffffff" />
          <rect x="6" y="13" width="20" height="6" fill="#ffffff" />
        </svg>
      )}
    </span>
  );
}
