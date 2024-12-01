import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const championSchema = {
  name: v.string(),
  id: v.string(),
  key: v.string(),
  releaseDate: v.string(),
};

export default defineSchema({
  champions: defineTable(championSchema).index("by_champion_id", ["id"]),
  championWins: defineTable({
    championId: v.id("champions"),
    summonerId: v.string(),
    hasWon: v.boolean(),
  }),
});
