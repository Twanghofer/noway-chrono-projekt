"use client";

import { api } from "@/convex/_generated/api";
import { Preloaded, usePreloadedQuery } from "convex/react";

export default function MessageList(props: {
  preloaded: Preloaded<typeof api.messages.list>;
}) {
  const messages = usePreloadedQuery(props.preloaded);

  return (
    <ul>
      {messages.map((message) => (
        <li key={message._id}>{message.body}</li>
      ))}
    </ul>
  );
}
