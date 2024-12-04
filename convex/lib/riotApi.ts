import RateLimiter from "./rateLimiter";
import { AccountDto, MatchDto } from "./riot-api";
import { customFetch } from "./utils";

const RIOT_API_BASE_URL = "https://europe.api.riotgames.com";

export const DATA_DRAGON_BASE_URL =
  "https://ddragon.leagueoflegends.com/cdn/14.23.1";

const riotApiRateLimiter = new RateLimiter({
  maxRequestsPerSecond: 20,
  maxRequestsPer2Minutes: 100,
});

export const fetchFromRiotApi = async <T>(
  url: string,
  options: RequestInit = {},
) =>
  await riotApiRateLimiter.execute(async () =>
    customFetch<T>(url, {
      ...options,
      headers: {
        ...options.headers,
        "X-Riot-Token": process.env.RIOT_API_KEY!,
      },
    }),
  );

export const getRiotAccountDetails = async ({
  gameName,
  tagLine,
}: {
  gameName: string;
  tagLine: string;
}) => {
  try {
    return await fetchFromRiotApi<AccountDto>(
      `${RIOT_API_BASE_URL}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
    );
  } catch (error) {
    console.error(error);

    // Return default PUUID if error occurs
    return {
      puuid: "RGAPI-2f6f79a6-6721-412c-b070-bcd3309218ba",
    };
  }
};

export const getMatchList = async (puuid: string, { page = 1 } = {}) => {
  const PER_PAGE = 10;

  const matchIds = await fetchFromRiotApi<string[]>(
    `${RIOT_API_BASE_URL}/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=420&startTime=1710264413&start=${(page - 1) * PER_PAGE}&count=${PER_PAGE}`,
  );

  return {
    matchIds,
    nextPage: matchIds.length === PER_PAGE ? page + 1 : null,
  };
};

export const getMatchDetails = async (matchId: string) =>
  (await fetchFromRiotApi(
    `${RIOT_API_BASE_URL}/lol/match/v5/matches/${matchId}`,
  )) as MatchDto;
