import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GuessOps - AWS User Groups Vadodara",
  description: "Interactive AWS cloud knowledge challenge designed for the AWS community. Community-driven learning and knowledge sharing platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>GuessOps - AWS User Groups Vadodara</title>
        <meta name="description" content="Interactive AWS cloud knowledge challenge designed for the AWS community. Community-driven learning and knowledge sharing platform." />
        <link rel="icon" href="https://communityday.awsugvad.in/images/Logo%20_%20AWS%20UG%20Vadodara.svg" type="image/svg+xml" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
