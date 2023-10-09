"use client";

import { StateStoreProvider } from "./_context/state-store-context";

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StateStoreProvider>{children}</StateStoreProvider>;
}
