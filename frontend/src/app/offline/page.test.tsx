import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi, afterEach } from "vitest";
import OfflinePage from "./page";

const OFFLINE_STATUS_KEY = "tycoon.offline.last-known-status";

const originalOnLineDescriptor = Object.getOwnPropertyDescriptor(
  window.navigator,
  "onLine",
);

describe("Offline Page - Runtime behavior", () => {
  beforeEach(() => {
    if (originalOnLineDescriptor) {
      Object.defineProperty(window.navigator, "onLine", {
        value: false,
        configurable: true,
      });
    }

    sessionStorage.clear();
  });

  afterEach(() => {
    if (originalOnLineDescriptor) {
      Object.defineProperty(window.navigator, "onLine", originalOnLineDescriptor);
    }

    vi.restoreAllMocks();
  });

  test("renders the offline shell and fallback state", async () => {
    render(await OfflinePage());

    expect(screen.getByRole("heading", { name: "Offline Shell" })).toBeInTheDocument();
    expect(
      screen.getByText(/you are currently offline\. reconnect to resume live multiplayer gameplay\./i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to home" })).toHaveAttribute("href", "/");
  });

  test("updates to online status after reconnect", async () => {
    render(await OfflinePage());

    expect(await screen.findByText(/currently offline/i)).toBeInTheDocument();

    act(() => {
      if (originalOnLineDescriptor) {
        Object.defineProperty(window.navigator, "onLine", {
          value: true,
          configurable: true,
        });
      }
      window.dispatchEvent(new Event("online"));
    });

    expect(await screen.findByText(/a connection is available/i)).toBeInTheDocument();
  });

  test("loads the last known connection state from storage", async () => {
    sessionStorage.setItem(OFFLINE_STATUS_KEY, "online");

    render(await OfflinePage());

    expect(await screen.findByText(/last known connection state: online/i)).toBeInTheDocument();
  });
});
