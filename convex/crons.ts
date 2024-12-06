import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.interval("update-matches", { minutes: 15 }, api.matches.update);

export default crons;
