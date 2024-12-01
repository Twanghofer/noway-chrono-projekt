import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import MainLayout from "./components/MainLayout";

export default async function Home() {
  const preloadedChampionList = await preloadQuery(api.champions.listWithStats);

  return (
    <main>
      <MainLayout preloadedChampionList={preloadedChampionList} />
    </main>
  );
}
