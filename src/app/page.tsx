import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="mx-auto w-full max-w-screen-md flex-1 p-4">Initial</main>
    </HydrateClient>
  );
}
