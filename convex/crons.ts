import { cronJobs } from "convex/server";
import { api } from "./_generated/api";

const crons = cronJobs();

crons.interval("update-matches", { minutes: 30 }, api.matches.update);

export default crons;
