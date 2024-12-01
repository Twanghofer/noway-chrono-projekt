"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import useUpdateChampionsEffect from "../lib/useUpdateChampionsEffect";

export default function ChampionList() {
  const champions = useQuery(api.champions.list);

  useUpdateChampionsEffect();

  return (
    <div>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4">
        {champions?.map((champion) => (
          <li key={champion.id}>
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${champion.id}.png`}
              alt={champion.name}
              width={128}
              height={128}
              loading="lazy"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
