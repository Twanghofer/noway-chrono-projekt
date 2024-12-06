"use client";

import { api } from "@/convex/_generated/api";
import { Progress } from "@/src/components/ui/progress";
import { Preloaded, usePreloadedQuery } from "convex/react";
import React from "react";
import { twMerge } from "tailwind-merge";
import useChampionAnalytics from "../lib/useChampionAnalytics";
import { useUpdateMatchesEffect } from "../lib/useUpdateEffect";
import ChampionAvatar from "./ChampionAvatar";
import CurrentChampionBox from "./CurrentChampionBox";

export default function HomeLayout(
  props: Readonly<{
    preloadedChampionListQuery: Preloaded<typeof api.champions.listWithStats>;
  }>,
) {
  const champions = usePreloadedQuery(props.preloadedChampionListQuery);

  const {
    currentChampion,
    upcomingChampions,
    mostPlayedChampions,
    amountChampionsDone,
    percentageChampionsDone,
  } = useChampionAnalytics(champions);

  useUpdateMatchesEffect();

  if (!champions.length) {
    return null;
  }

  return (
    <div className="space-y-10">
      <div className="space-y-8 md:space-y-10">
        {currentChampion && (
          <div className="flex flex-col items-center">
            <SubHeadline className="mb-2">Aktueller Champion</SubHeadline>
            <CurrentChampionBox champion={currentChampion} />
          </div>
        )}

        <div className="w-5/6 max-w-md mx-auto space-y-2 first:my-10 md:first:my-16">
          <Progress value={percentageChampionsDone} color="red" />

          <div className="text-center">
            {percentageChampionsDone !== 100 ? (
              <div>
                Challenge zu{" "}
                <span className="font-bold">
                  {Math.floor(percentageChampionsDone)}%
                </span>{" "}
                abgeschlossen
              </div>
            ) : (
              <div className="text-green-500">
                Challenge completed! Congrats! 🎉
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-8 md:gap-x-[8%] flex-wrap sm:flex-nowrap sm:justify-evenly">
        {upcomingChampions.length > 0 && (
          <div>
            <SubHeadline>Nächste Champions</SubHeadline>

            <ul className="flex flex-row gap-3 md:gap-4">
              {upcomingChampions?.map((champion) => (
                <li key={champion.id} className="flex">
                  <ChampionAvatar champion={champion} className="w-32" />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <SubHeadline>Meisten Versuche</SubHeadline>

          <ul className="flex flex-row gap-3 md:gap-4">
            {mostPlayedChampions?.map((champion) => (
              <li key={champion.id} className="flex flex-col items-center">
                <ChampionAvatar
                  champion={champion}
                  className="w-32 border-2 border-red-950"
                />
                <div className="mt-1">{champion.matches.length} Versuche</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <SubHeadline>
          Alle Champions ({amountChampionsDone} / {champions.length})
        </SubHeadline>

        <ul className="grid grid-cols-[repeat(auto-fill,minmax(clamp(10%,115px,30%),1fr))] gap-3 sm:gap-4">
          {champions.map((champion) => (
            <li
              key={champion.id}
              className={`border ${champion.wins ? "border-2 border-green-950" : ""} ${champion === currentChampion ? "border-2 border-foreground/75" : ""}`}
            >
              <ChampionAvatar
                champion={champion}
                className="w-full"
                lazyLoad={true}
              />

              <div className="text-center px-1.5 py-2">
                <h3 className="font-medium">{champion.name}</h3>

                <div className="text-sm font-light">
                  {champion.matches.length > 0 &&
                    (champion.losses ? (
                      <div>
                        {champion.wins} - {champion.losses}
                      </div>
                    ) : (
                      <div className={!champion.losses ? "text-green-500" : ""}>
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
  );
}

function SubHeadline(
  props: Readonly<{ children: React.ReactNode; className?: string }>,
) {
  return (
    <h2
      className={twMerge(
        "text-xl md:text-2xl mb-3 font-medium",
        props.className,
      )}
    >
      {props.children}
    </h2>
  );
}
