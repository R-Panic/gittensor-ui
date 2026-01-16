export interface IssueBounty {
  id: number;
  githubUrl: string;
  repositoryFullName: string;
  issueNumber: number;
  bountyAmount: string;
  targetBounty: string;
  status:
    | "registered"
    | "active"
    | "in_competition"
    | "completed"
    | "cancelled";
  solverHotkey: string | null;
  winningPrUrl: string | null;
  registeredAtBlock: number;
  createdAt: string;
  completedAt: string | null;
}

export interface Competition {
  id: number;
  issueId: number;
  miner1Hotkey: string;
  miner2Hotkey: string;
  miner1GithubId: string | null;
  miner2GithubId: string | null;
  startBlock: number;
  submissionWindowEndBlock: number;
  deadlineBlock: number;
  status: "active" | "completed" | "timed_out" | "cancelled";
  winnerHotkey: string | null;
  winningPrUrl: string | null;
  payoutAmount: string | null;
  outcomeType: string | null;
}

export interface EloScore {
  uid: number;
  hotkey: string;
  elo: number;
  wins: number;
  losses: number;
  lastCompetitionAt: string | null;
  isEligible: boolean;
}

export interface EloHistory {
  id: number;
  hotkey: string;
  competitionId: number | null;
  oldElo: number;
  newElo: number;
  changeReason: "win" | "loss" | "timeout" | "initial" | "decay";
  opponentHotkey: string | null;
  opponentElo: number | null;
  createdAt: string;
}

export interface IssuesStats {
  totalIssues: number;
  activeIssues: number;
  completedIssues: number;
  totalBountyPool: string;
  totalPayouts: string;
}

export interface EloStats {
  totalMiners: number;
  eligibleMiners: number;
  avgElo: number;
  highestElo: number;
  totalCompetitions: number;
}
