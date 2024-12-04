import RateLimiter from "./rateLimiter";
import { MatchV5DTOs } from "./riot-api";

export const DATA_DRAGON_BASE_URL =
  "https://ddragon.leagueoflegends.com/cdn/14.23.1";

const LOL_MATCH_API_BASE_URL =
  "https://europe.api.riotgames.com/lol/match/v5/matches";

const riotApiRateLimiter = new RateLimiter({
  maxRequestsPerSecond: 20,
  maxRequestsPer2Minutes: 100,
});

export async function fetchHelper<T>(url: string, options: RequestInit = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Status: ${response.status} -  Failed to fetch ${url}`);
  }

  return (await response.json()) as T;
}

export async function fetchFromRiotApi<T>(
  url: string,
  options: RequestInit = {},
) {
  return riotApiRateLimiter.execute(async () =>
    fetchHelper<T>(url, {
      ...options,
      headers: {
        ...options.headers,
        "X-Riot-Token": process.env.RIOT_API_KEY!,
      },
    }),
  );
}

export async function getMatchList({ page = 1 } = {}) {
  const PER_PAGE = 10;

  const matchIds = await fetchFromRiotApi<string[]>(
    `${LOL_MATCH_API_BASE_URL}/by-puuid/${process.env.RIOT_ACCOUNT_PUUID}/ids?queue=420&startTime=1710264413&start=${(page - 1) * PER_PAGE}&count=${PER_PAGE}`,
  );

  return {
    matchIds,
    nextPage: matchIds.length === PER_PAGE ? page + 1 : null,
  };
}

export async function getMatchDetails(matchId: string) {
  const matchDetails = (await fetchFromRiotApi(
    `${LOL_MATCH_API_BASE_URL}/${matchId}`,
  )) as MatchV5DTOs.MatchDto;

  const playerParticipation = matchDetails.info.participants.find(
    (p) => p.puuid === process.env.RIOT_ACCOUNT_PUUID,
  );

  if (!playerParticipation) {
    throw new Error("Player not found in match");
  }

  return {
    id: matchDetails.metadata.matchId,
    timestamp: matchDetails.info.gameCreation,
    championKey: String(playerParticipation?.championId),
    win: !!playerParticipation?.win,
    playerStats: {
      kills: playerParticipation?.kills,
      deaths: playerParticipation?.deaths,
      assists: playerParticipation?.assists,
    },
  };
}
