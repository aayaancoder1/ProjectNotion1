import "./globals.css";

export const metadata = {
  title: "Student OS",
  description: "Student OS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
