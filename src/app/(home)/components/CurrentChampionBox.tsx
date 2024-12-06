"use client";

import { ChampionWithStats } from "@/convex/champions";
import { Button } from "@/src/components/ui/button";
import { useFormatter } from "next-intl";
import Link from "next/link";
import ChampionAvatar from "./ChampionAvatar";

export default function CurrentChampionBox(
  props: Readonly<{
    champion: ChampionWithStats;
  }>,
) {
  const format = useFormatter();

  return (
    <div>
      <div className="mb-2 flex flex-col items-center">
        <h3 className="text-5xl font-medium">{props.champion.name}</h3>

        <p className="opacity-50 font-light mt-1">
          Release date:{" "}
          {format.dateTime(new Date(props.champion.releaseDate), {
            dateStyle: "medium",
          })}
        </p>
      </div>

      <div className="flex flex-row gap-4 flex-wrap mt-5 justify-center">
        <div>
          <ChampionAvatar
            champion={props.champion}
            className="self-start w-36"
          />

          <div className="text-center text-lg font-medium">
            {props.champion.wins} - {props.champion.losses}
          </div>
        </div>

        {props.champion.matches.length > 0 && (
          <ul className="space-y-3 flex-grow sm:flex-grow-0 md:w-fit min-w-24 sm:min-w-96 max-w-full">
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

                  <Button asChild>
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
    </div>
  );
}
