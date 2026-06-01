import type React from "react";
import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import OfflinePageContent from "./OfflinePageContent";

export const metadata: Metadata = generatePageMetadata({
  title: "Offline",
  description:
    "Tycoon is offline right now. Reconnect to keep live game state in sync and continue playing.",
  canonicalPath: "/offline",
  keywords: ["offline", "pwa", "tycoon"],
});

export default function OfflinePage(): React.ReactNode {
  return <OfflinePageContent />;
}
