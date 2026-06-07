import { cn } from "@/lib/utils";

type SynaplanLogoProps = {
  /**
   * `light` — dark glyph on light UI (site header).
   * `dark` — white logo on dark UI (footer).
   */
  variant: "light" | "dark";
  className?: string;
  /** Shorter height on very small screens */
  size?: "default" | "compact";
  alt?: string;
};

/** Brand mark from `/public/synaplan_logo.svg` (wordmark + icon). */
export function SynaplanLogo({
  variant,
  className,
  size = "default",
  alt = "Synaplan",
}: SynaplanLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/synaplan_logo.svg"
      alt={alt}
      width={151}
      height={33}
      decoding="async"
      className={cn(
        "w-auto shrink-0 object-contain object-left",
        size === "compact" ? "h-6 sm:h-7" : "h-7 sm:h-8",
        variant === "light" && "brightness-0",
        variant === "dark" && "opacity-95",
        className,
      )}
    />
  );
}
