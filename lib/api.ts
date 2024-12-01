import { nowaySummonerDetails } from "./constants";
import { MatchV5DTOs } from "./riot-api";

const LOL_MATCH_API_BASE_URL =
  "https://europe.api.riotgames.com/lol/match/v5/matches";

export async function fetchHelper<T>(url: string, options: RequestInit = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}`);
  }

  return (await response.json()) as T;
}

export async function fetchFromRiotApi<T>(
  url: string,
  options: RequestInit = {},
) {
  return fetchHelper<T>(url, {
    ...options,
    headers: {
      ...options.headers,
      "X-Riot-Token": process.env.RIOT_API_KEY!,
    },
  });
}

export async function getMatchListByPuuid(puuid: string) {
  return fetchFromRiotApi<string[]>(
    `${LOL_MATCH_API_BASE_URL}/by-puuid/${puuid}/ids`,
  );
}

export async function getMatchDetails(matchId: string) {
  const matchDetails = (await fetchFromRiotApi(
    `${LOL_MATCH_API_BASE_URL}/${matchId}`,
  )) as MatchV5DTOs.MatchDto;

  const playerParticipation = matchDetails.info.participants.find(
    (p) => p.puuid === nowaySummonerDetails.puuid,
  );

  return {
    id: matchDetails.metadata.matchId,
    timestamp: matchDetails.info.gameCreation,
    championId: playerParticipation?.championId,
    win: Boolean(playerParticipation?.win),
  };
}
