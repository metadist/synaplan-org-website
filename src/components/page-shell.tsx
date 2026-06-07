import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHero({
  kicker,
  title,
  lead,
}: {
  kicker: string;
  title: string;
  lead?: string;
}) {
  return (
    <section className="border-b border-border bg-page-tint">
      <div className="container-wide section-padding py-16 sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#002c92]">
          {kicker}
        </p>
        <h1 className="mt-4 max-w-4xl text-balance text-3xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {lead ? (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {lead}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function Section({
  children,
  tinted = false,
  className,
}: {
  children: ReactNode;
  tinted?: boolean;
  className?: string;
}) {
  return (
    <section className={cn(tinted && "bg-surface", className)}>
      <div className="container-wide section-padding py-16 sm:py-20">{children}</div>
    </section>
  );
}

export function SectionHeading({
  kicker,
  title,
  lead,
}: {
  kicker?: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="max-w-3xl">
      {kicker ? (
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#002c92]">
          {kicker}
        </p>
      ) : null}
      <h2 className="mt-3 text-balance text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{lead}</p>
      ) : null}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-7",
        className,
      )}
    >
      {children}
    </div>
  );
}
