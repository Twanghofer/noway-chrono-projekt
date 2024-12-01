"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";

export default function ChampionList(
  props: Readonly<{
    prefetchedChampions: Preloaded<typeof api.champions.list>;
  }>,
) {
  const champions = usePreloadedQuery(props.prefetchedChampions);

  return (
    <div>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
        {champions?.map((champion, index) => (
          <li key={champion.id}>
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${champion.id}.png`}
              alt={champion.name}
              width={128}
              height={128}
              loading={index < 25 ? "eager" : "lazy"}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
