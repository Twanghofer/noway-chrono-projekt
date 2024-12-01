import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import React from "react";

export function useUpdateChampionsEffect() {
  const updateChampions = useAction(api.champions.update);

  const hasUpdatedChampions = React.useRef(false);

  React.useEffect(() => {
    if (!hasUpdatedChampions.current) {
      updateChampions();
      hasUpdatedChampions.current = true;
    }
  }, []);
}

export function useUpdateMatchesEffect() {
  const updateMatches = useAction(api.matches.update);

  const hasUpdatedMatches = React.useRef(false);

  React.useEffect(() => {
    if (!hasUpdatedMatches.current) {
      updateMatches();
      hasUpdatedMatches.current = true;
    }
  }, []);
}
