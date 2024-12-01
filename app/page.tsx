import ChampionList from "./components/ChampionList";

export default async function Home() {
  return (
    <main className="mx-auto w-full max-w-screen-lg flex-1 p-4">
      <ChampionList />
    </main>
  );
}
