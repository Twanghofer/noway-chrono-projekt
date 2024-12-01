"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import React from "react";
import { useUpdateMatchesEffect } from "../lib/useUpdateEffect";
import ChampionAvatar from "./ChampionAvatar";

export default function ChampionList(
  props: Readonly<{
    preloadedChampionList: Preloaded<typeof api.champions.list>;
  }>,
) {
  const champions = usePreloadedQuery(props.preloadedChampionList);

  const currentChampion = React.useMemo(() => {
    return champions?.find((champion) => !champion.hasWonWithChampion);
  }, [champions]);

  const upcomingChampions = React.useMemo(() => {
    return champions
      ?.filter(
        (champion) =>
          !champion.hasWonWithChampion && champion !== currentChampion,
      )
      .slice(0, 3);
  }, [champions, currentChampion]);

  useUpdateMatchesEffect();

  return (
    <div className="space-y-9">
      <h1 className="text-6xl">Chrono Projekt</h1>

      <div className="flex flex-row">
        <div className="flex-grow">
          <h2 className="text-3xl">Aktueller Champion</h2>
          <div className="mt-5">
            {currentChampion ? (
              <ChampionAvatar champion={currentChampion} />
            ) : (
              "Challenge completed!"
            )}
          </div>
        </div>

        <div>
          <h2 className="text-3xl">Nächste Champions</h2>
          <ul className="mt-5 space-y-5">
            {upcomingChampions?.map((champion) => (
              <li key={champion.id} className="flex justify-center">
                <ChampionAvatar champion={champion} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <h2 className="text-3xl">Champion List</h2>

        <ul className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 mt-4">
          {champions?.map((champion) => (
            <li
              key={champion.id}
              className={`border ${champion.hasWonWithChampion ? "border-green-500" : ""}`}
              title={`Release Datum: ${new Date(champion.releaseDate).toLocaleDateString("de-DE")}`}
            >
              <ChampionAvatar champion={champion} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
