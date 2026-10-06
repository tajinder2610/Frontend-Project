import type { Metadata } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";
import "../index.css";
import "../App.css";

export const metadata: Metadata = {
  title: "Dope Moviez",
  description: "Discover trending movies and manage your watchlist.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}