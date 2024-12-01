import { Doc } from "@/convex/_generated/dataModel";
import { twMerge } from "tailwind-merge";

export default function ChampionAvatar(
  props: Readonly<{
    champion: Doc<"champions">;
    className?: string;
  }>,
) {
  return (
    <img
      src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${props.champion.id}.png`}
      className={twMerge("aspect-square", props.className)}
      alt={props.champion.name}
      title={props.champion.name}
      width={128}
      height={128}
    />
  );
}
