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

export function useUpdateChampionWinsEffect() {
  const updateChampionWins = useAction(api.matches.update);

  const hasUpdatedChampionWins = React.useRef(false);

  React.useEffect(() => {
    if (!hasUpdatedChampionWins.current) {
      updateChampionWins();
      hasUpdatedChampionWins.current = true;
    }
  }, []);
}
