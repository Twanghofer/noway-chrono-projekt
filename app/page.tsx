import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import ChampionList from "./components/ChampionList";

export default async function Home() {
  const preloadedChampionList = await preloadQuery(api.champions.list);

  return (
    <main className="mx-auto w-full max-w-screen-lg flex-1 p-4">
      <ChampionList preloadedChampionList={preloadedChampionList} />
    </main>
  );
}
