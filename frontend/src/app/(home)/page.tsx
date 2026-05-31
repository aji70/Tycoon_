// app/(home)/page.tsx
// Server component that renders the main home page
import type { ReactNode } from "react";
import HomeClient from "@/clients/HomeClient";
import { generatePageMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = generatePageMetadata({
  title: "Home",
  description:
    "Experience the ultimate tycoon gaming platform with immersive gameplay, AI-powered opponents, and real-time multiplayer action.",
  canonicalPath: "/",
  keywords: [
    "tycoon",
    "board game",
    "multiplayer",
    "strategy game",
    "gaming platform",
  ],
});

/**
 * Home Page Component
 * 
 * Server component that renders the main home page with client-side interactive elements.
 * Handles metadata generation and delegates interactive content to HomeClient.
 * 
 * @returns {ReactNode} The rendered home page
 */
export default function Home(): ReactNode {
  return <HomeClient />;
}
