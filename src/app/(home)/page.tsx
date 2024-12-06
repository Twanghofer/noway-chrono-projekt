import { api } from "@/convex/_generated/api";
import { fetchAction, preloadQuery } from "convex/nextjs";
import HomeLayout from "./components/HomeLayout";

export default async function Home() {
  await fetchAction(api.champions.update);
  await fetchAction(api.matches.update);

  const preloadedChampionListQuery = await preloadQuery(
    api.champions.listWithStats,
  );

  return (
    <main>
      <HomeLayout preloadedChampionListQuery={preloadedChampionListQuery} />
    </main>
  );
}
