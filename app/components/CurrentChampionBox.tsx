"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import { useFormatter } from "next-intl";
import Link from "next/link";
import React from "react";
import ChampionAvatar from "./ChampionAvatar";

export default function CurrentChampionBox(
  props: Readonly<{
    champion: FunctionReturnType<typeof api.champions.listWithStats>[number];
  }>,
) {
  const format = useFormatter();

  const currentChampionStats = React.useMemo(() => {
    return props.champion?.matches.reduce(
      (acc, match) => {
        acc.wins += match.win ? 1 : 0;
        acc.losses += match.win ? 0 : 1;

        return acc;
      },
      { wins: 0, losses: 0 },
    );
  }, [props.champion]);

  return (
    <div className="flex flex-row gap-4 flex-wrap">
      <div>
        <ChampionAvatar champion={props.champion} className="self-start" />
        <div className="text-center text-lg font-medium">
          {currentChampionStats?.wins} - {currentChampionStats?.losses}
        </div>
      </div>

      {props.champion.matches && (
        <ul className="space-y-3 flex-grow md:flex-grow-0 md:w-fit min-w-80 max-w-full">
          {props.champion.matches.slice(0, 3).map((match) => (
            <li
              key={match.id}
              className={`min-h-24 p-3 rounded-lg ${match.win ? "bg-green-900" : "bg-red-900"}`}
            >
              <div className="flex gap-5 items-center justify-between">
                <div className="space-y-1.5">
                  <ChampionAvatar
                    champion={props.champion}
                    className="w-8 h-8 rounded-full size-14"
                  />
                  <div className="capitalize text-xs opacity-75 self-start">
                    {format.relativeTime(match.timestamp)}
                  </div>
                </div>

                <div>
                  {match.playerStats.kills} /{" "}
                  <span className="font-medium text-red-400">
                    {match.playerStats.deaths}
                  </span>{" "}
                  / {match.playerStats.assists}
                </div>

                <Button className="ml-auto" asChild>
                  <Link
                    href={`https://www.deeplol.gg/summoner/euw/MatheMann4u-EUW/matches/${match.id}`}
                    target="_blank"
                  >
                    Details
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
