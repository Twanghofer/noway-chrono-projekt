"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import React from "react";
import { useUpdateMatchesEffect } from "../lib/useUpdateEffect";
import ChampionAvatar from "./ChampionAvatar";
import CurrentChampionBox from "./CurrentChampionBox";

export default function MainLayout(
  props: Readonly<{
    preloadedChampionList: Preloaded<typeof api.champions.listWithStats>;
  }>,
) {
  const champions = usePreloadedQuery(props.preloadedChampionList);

  const currentChampion = React.useMemo(() => {
    return champions?.find((champion) => !champion.wins);
  }, [champions]);

  const upcomingChampions = React.useMemo(() => {
    return champions
      ?.filter((champion) => !champion.wins && champion !== currentChampion)
      .slice(0, 3);
  }, [champions, currentChampion]);

  useUpdateMatchesEffect();

  return (
    <main>
      <h1 className="text-4xl md:text-6xl py-3 md:py-8 mb-6 md:mb-10 border-b">
        Chrono Projekt
      </h1>

      <div className="space-y-10 ">
        {currentChampion ? (
          <div className="flex flex-col gap-8 md:flex-row md:gap-6">
            <div className="flex-grow">
              <SubHeadline>Aktueller Champion</SubHeadline>
              <div>
                <CurrentChampionBox champion={currentChampion} />
              </div>
            </div>

            <div>
              <SubHeadline>Nächste Champions</SubHeadline>
              <ul className="flex flex-row gap-4 md:block md:space-y-5">
                {upcomingChampions?.map((champion) => (
                  <li key={champion.id} className="flex">
                    <ChampionAvatar champion={champion} className="size-28" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center text-green-500 text-3xl">
            Challenge completed! Congratulations! 🎉
          </div>
        )}

        <div>
          <SubHeadline>Alle Champions</SubHeadline>

          <ul className="grid grid-cols-[repeat(auto-fill,minmax(clamp(12%,90px,30%),1fr))] gap-4">
            {champions?.map((champion) => (
              <li
                key={champion.id}
                className={`border ${champion.wins ? "border-2 border-green-900" : ""} ${champion === currentChampion ? "border-2 border-foreground/75" : ""}`}
                title={`Release Datum: ${new Date(champion.releaseDate).toLocaleDateString("de-DE")}`}
              >
                <ChampionAvatar champion={champion} className="w-full" />

                <div className="text-center p-1.5">
                  <h3 className="font-medium">{champion.name}</h3>

                  <div className="text-sm">
                    {champion.matches.length > 0 &&
                      (champion.losses ? (
                        <div>
                          {champion.wins} - {champion.losses}
                        </div>
                      ) : (
                        <div
                          className={!champion.losses ? "text-green-500" : ""}
                        >
                          Perfect
                        </div>
                      ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

function SubHeadline(props: Readonly<{ children: React.ReactNode }>) {
  return (
    <h2 className="text-xl md:text-2xl mb-3 font-medium">{props.children}</h2>
  );
}
