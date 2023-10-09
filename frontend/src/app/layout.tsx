import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ProviderLayout from "./provider-layout";
import MainLayoutV2 from "./main-layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Documex",
  description: `Frontend for Documex. Explore your local documentation`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ProviderLayout>
          <MainLayoutV2>{children}</MainLayoutV2>
        </ProviderLayout>
      </body>
    </html>
  );
}
