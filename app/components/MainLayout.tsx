"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";
import React from "react";
import { twMerge } from "tailwind-merge";
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

  const mostPlayedChampions = React.useMemo(() => {
    return champions
      ?.filter((champion) => champion.matches.length > 0)
      .sort((a, b) => b.matches.length - a.matches.length)
      .slice(0, 3);
  }, [champions]);

  const amountChampionsDone = React.useMemo(() => {
    return champions?.filter((champion) => champion.wins).length;
  }, [champions]);

  useUpdateMatchesEffect();

  if (!champions) {
    return null;
  }

  return (
    <div className="space-y-10">
      {currentChampion ? (
        <div className="flex flex-col items-center">
          <SubHeadline className="mb-2">Aktueller Champion</SubHeadline>
          <CurrentChampionBox champion={currentChampion} />
        </div>
      ) : (
        <div className="text-center text-green-500 text-2xl md:text-3xl">
          Challenge completed! Congratulations! 🎉
        </div>
      )}

      <div className="flex gap-8 md:gap-x-[8%] flex-wrap sm:flex-nowrap sm:justify-evenly">
        {upcomingChampions.length > 0 && (
          <div>
            <SubHeadline>Nächste Champions</SubHeadline>
            <ul className="flex flex-row gap-3 md:gap-4">
              {upcomingChampions?.map((champion) => (
                <li key={champion.id} className="flex">
                  <ChampionAvatar champion={champion} className="w-28" />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <SubHeadline>Meisten Versuche</SubHeadline>
          <ul className="flex flex-row gap-3 md:gap-4">
            {mostPlayedChampions?.map((champion) => (
              <li
                key={champion.id}
                className="flex flex-col justify-start items-center"
              >
                <ChampionAvatar
                  champion={champion}
                  className="w-28 border-2 border-red-950"
                />
                <div className="mt-1">
                  <strong>{champion.matches.length}</strong> Versuche
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div>
        <SubHeadline>
          Alle Champions ({amountChampionsDone} / {champions.length})
        </SubHeadline>

        <ul className="grid grid-cols-[repeat(auto-fill,minmax(clamp(10%,100px,30%),1fr))] gap-4">
          {champions.map((champion) => (
            <li
              key={champion.id}
              className={`border ${champion.wins ? "border-2 border-green-950" : ""} ${champion === currentChampion ? "border-2 border-foreground/75" : ""}`}
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
