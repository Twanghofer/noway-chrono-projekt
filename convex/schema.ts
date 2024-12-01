import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const championSchema = {
  name: v.string(),
  id: v.string(),
  key: v.string(),
  releaseDate: v.string(),
  imageUrl: v.string(),
};

export const matchSchema = {
  id: v.string(),
  champion: v.id("champions"),
  win: v.boolean(),
};

export default defineSchema({
  champions: defineTable(championSchema).index("by_champion_id", ["id"]),
  matches: defineTable(matchSchema).index("by_match_id", ["id"]),
});
