import { ChampionWithStats } from "@/convex/champions";
import React from "react";

export default function useChampionAnalytics(champions: ChampionWithStats[]) {
  const currentChampion = React.useMemo(() => {
    return champions?.find((champion) => !champion.wins);
  }, [champions]);

  const upcomingChampions = React.useMemo(() => {
    return champions
      ?.filter((champion) => !champion.wins && champion !== currentChampion)
      .slice(0, 3);
  }, [champions, currentChampion]);

  const mostPlayedChampions = React.useMemo(() => {
    return champions
      ?.filter((champion) => champion.matches.length > 0)
      .sort((a, b) => b.matches.length - a.matches.length)
      .slice(0, 3);
  }, [champions]);

  const amountChampionsDone = React.useMemo(() => {
    return champions?.filter((champion) => champion.wins).length;
  }, [champions]);

  const percentageChampionsDone = React.useMemo(() => {
    return (amountChampionsDone / champions.length) * 100;
  }, [amountChampionsDone, champions]);

  return {
    currentChampion,
    upcomingChampions,
    mostPlayedChampions,
    amountChampionsDone,
    percentageChampionsDone,
  };
}
