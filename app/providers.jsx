"use client";

import { NextUIProvider } from "@heroui/react";

export default function ClientProvider({ children }) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
