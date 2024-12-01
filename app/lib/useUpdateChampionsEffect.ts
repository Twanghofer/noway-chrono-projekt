import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import React from "react";

export default function useUpdateChampionsEffect() {
  const updateChampions = useAction(api.champions.update);

  const hasUpdatedChampions = React.useRef(false);

  React.useEffect(() => {
    if (!hasUpdatedChampions.current) {
      updateChampions();
      hasUpdatedChampions.current = true;
    }
  }, []);
}
