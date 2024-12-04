import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import HomeLayout from "./components/HomeLayout";

export default async function Home() {
  const preloadedChampionList = await preloadQuery(api.champions.listWithStats);

  return (
    <main>
      <HomeLayout preloadedChampionList={preloadedChampionList} />
    </main>
  );
}
