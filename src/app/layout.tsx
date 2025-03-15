import type { Metadata } from "next";
import { nunito, sigmaOne } from "./fonts";
import "./globals.css";
import { ClientBody } from "./ClientBody";

export const metadata: Metadata = {
  title: "TASK Shockers | Free IO Game",
  description: "The world's best egg-based shooter! Complete your tasks before the enemy eggs get you!",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={`${nunito.variable} ${sigmaOne.variable} font-nunito bg-shellshock-lightBlue`}>
        <ClientBody>
          {children}
        </ClientBody>
      </body>
    </html>
  );
}
