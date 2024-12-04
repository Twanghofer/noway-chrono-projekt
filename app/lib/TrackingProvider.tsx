"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import React from "react";

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      person_profiles: "identified_only",
    });
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
