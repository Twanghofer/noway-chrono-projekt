import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { api } from "@/convex/_generated/api";
import { FunctionReturnType } from "convex/server";
import { useFormatter } from "next-intl";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function ChampionAvatar(
  props: Readonly<{
    champion: FunctionReturnType<typeof api.champions.listWithStats>[number];
    className?: string;
    lazyLoad?: boolean;
  }>,
) {
  const format = useFormatter();

  const latestMatch = React.useMemo(
    () =>
      props.champion?.matches.reduce((prev, current) => {
        return prev.timestamp > current.timestamp ? prev : current;
      }, props.champion.matches[0]),
    [props.champion],
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="w-full">
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${props.champion.id}.png`}
            className={twMerge("aspect-square", props.className)}
            alt={props.champion.name}
            width={128}
            height={128}
            loading={props.lazyLoad ? "lazy" : "eager"}
          />
        </TooltipTrigger>
        <TooltipContent>
          <strong className="text-sm mb-3"> {props.champion.name} </strong>

          <div>
            Release date:{" "}
            {format.dateTime(new Date(props.champion.releaseDate), {
              dateStyle: "medium",
            })}
          </div>

          {latestMatch && (
            <div>
              Abgeschlossen am:{" "}
              {format.dateTime(new Date(latestMatch.timestamp), {
                dateStyle: "medium",
              })}
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
