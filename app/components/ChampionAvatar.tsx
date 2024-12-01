import { Doc } from "@/convex/_generated/dataModel";

export default function ChampionAvatar(
  props: Readonly<{
    champion: Doc<"champions">;
  }>,
) {
  return (
    <img
      src={`https://ddragon.leagueoflegends.com/cdn/14.23.1/img/champion/${props.champion.id}.png`}
      alt={props.champion.name}
      width={128}
      height={128}
    />
  );
}
