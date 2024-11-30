import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import MessageList from "./components/MessageList";

export default async function Home() {
  const preloaded = await preloadQuery(api.messages.list);

  return (
    <main className="mx-auto w-full max-w-screen-md flex-1 p-4">
      <MessageList preloaded={preloaded} />
    </main>
  );
}
