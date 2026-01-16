import { useApiQuery } from "./ApiUtils";
import {
  IssueBounty,
  Competition,
  EloScore,
  EloHistory,
  IssuesStats,
  EloStats,
} from "./models/Issues";

// Issues
export const useIssues = (status?: string) =>
  useApiQuery<IssueBounty[]>(
    "useIssues",
    "/issues",
    undefined,
    status ? { status } : undefined,
  );

export const useIssuesStats = () =>
  useApiQuery<IssuesStats>("useIssuesStats", "/issues/stats");

export const useIssue = (id: number) =>
  useApiQuery<IssueBounty>(
    "useIssue",
    `/issues/${id}`,
    undefined,
    undefined,
    !!id,
  );

// Competitions
export const useActiveCompetitions = () =>
  useApiQuery<Competition[]>("useActiveCompetitions", "/competitions/active");

export const useCompetitions = (status?: string, miner?: string) =>
  useApiQuery<Competition[]>("useCompetitions", "/competitions", undefined, {
    status,
    miner,
  });

export const useMinerCompetitions = (hotkey: string) =>
  useApiQuery<Competition[]>(
    "useMinerCompetitions",
    `/competitions/miner/${hotkey}`,
    undefined,
    undefined,
    !!hotkey,
  );

// ELO
export const useEloLeaderboard = (limit?: number) =>
  useApiQuery<EloScore[]>(
    "useEloLeaderboard",
    "/elo",
    undefined,
    limit ? { limit } : undefined,
  );

export const useMinerElo = (hotkey: string) =>
  useApiQuery<EloScore>(
    "useMinerElo",
    `/elo/${hotkey}`,
    undefined,
    undefined,
    !!hotkey,
  );

export const useMinerEloHistory = (hotkey: string) =>
  useApiQuery<EloHistory[]>(
    "useMinerEloHistory",
    `/elo/${hotkey}/history`,
    undefined,
    undefined,
    !!hotkey,
  );

export const useEloStats = () =>
  useApiQuery<EloStats>("useEloStats", "/elo/stats");

export const useEligibleMiners = () =>
  useApiQuery<EloScore[]>("useEligibleMiners", "/elo/eligible");
