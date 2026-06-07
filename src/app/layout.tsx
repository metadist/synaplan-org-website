// Root layout is a pass-through: the real <html>/<body> live in
// app/[locale]/layout.tsx so the document `lang` attribute matches the locale.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
