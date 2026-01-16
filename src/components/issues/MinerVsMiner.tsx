import React from "react";
import {
  Box,
  Card,
  Typography,
  Avatar,
  Chip,
  LinearProgress,
  Skeleton,
} from "@mui/material";
import { Competition, IssueBounty } from "../../api/models/Issues";
import EloRatingBadge from "./EloRatingBadge";

interface MinerVsMinerProps {
  competition: Competition;
  issue?: IssueBounty;
  miner1Elo?: number;
  miner2Elo?: number;
  currentBlock?: number;
  isLoading?: boolean;
}

/**
 * Truncate hotkey for display
 */
const truncateHotkey = (hotkey: string, startChars = 6, endChars = 4): string => {
  if (hotkey.length <= startChars + endChars) return hotkey;
  return `${hotkey.slice(0, startChars)}...${hotkey.slice(-endChars)}`;
};

/**
 * Calculate time remaining as percentage
 */
const calculateProgress = (
  startBlock: number,
  deadlineBlock: number,
  currentBlock: number,
): number => {
  if (currentBlock >= deadlineBlock) return 100;
  if (currentBlock <= startBlock) return 0;
  const total = deadlineBlock - startBlock;
  const elapsed = currentBlock - startBlock;
  return Math.min(100, (elapsed / total) * 100);
};

const MinerVsMiner: React.FC<MinerVsMinerProps> = ({
  competition,
  issue,
  miner1Elo,
  miner2Elo,
  currentBlock = 0,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card
        sx={{
          p: 2,
          backgroundColor: "#000000",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 3,
        }}
        elevation={0}
      >
        <Skeleton variant="text" width="60%" height={24} />
        <Skeleton variant="rectangular" height={80} sx={{ my: 2 }} />
        <Skeleton variant="text" width="100%" />
      </Card>
    );
  }

  const progress = calculateProgress(
    competition.startBlock,
    competition.deadlineBlock,
    currentBlock,
  );
  const blocksRemaining = Math.max(0, competition.deadlineBlock - currentBlock);
  const submissionOpen = currentBlock <= competition.submissionWindowEndBlock;

  return (
    <Card
      sx={{
        p: 2,
        backgroundColor: "#000000",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 3,
        transition: "all 0.2s",
        "&:hover": {
          borderColor: "rgba(255, 255, 255, 0.2)",
          transform: "translateY(-2px)",
        },
      }}
      elevation={0}
    >
      {/* Header: Repository/Issue info */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 2,
        }}
      >
        <Box>
          {issue && (
            <Typography
              component="a"
              href={issue.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#58a6ff",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {issue.repositoryFullName}#{issue.issueNumber}
            </Typography>
          )}
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "rgba(255, 255, 255, 0.5)",
              mt: 0.5,
            }}
          >
            Competition #{competition.id}
          </Typography>
        </Box>
        {issue && (
          <Chip
            label={`${issue.bountyAmount} TAO`}
            size="small"
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 600,
              backgroundColor: "rgba(63, 185, 80, 0.15)",
              color: "#3fb950",
              border: "1px solid rgba(63, 185, 80, 0.3)",
            }}
          />
        )}
      </Box>

      {/* Main Content: Two miners facing off */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          py: 2,
          px: 1,
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          borderRadius: 2,
          mb: 2,
        }}
      >
        {/* Miner 1 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: 1,
            minWidth: 0,
          }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              backgroundColor: "rgba(88, 166, 255, 0.2)",
              color: "#58a6ff",
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 700,
              mb: 1,
            }}
          >
            {(competition.miner1GithubId || competition.miner1Hotkey)
              .charAt(0)
              .toUpperCase()}
          </Avatar>
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.75rem",
              color: "#ffffff",
              textAlign: "center",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {truncateHotkey(competition.miner1Hotkey)}
          </Typography>
          {competition.miner1GithubId && (
            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              @{competition.miner1GithubId}
            </Typography>
          )}
          {miner1Elo !== undefined && (
            <Box sx={{ mt: 1 }}>
              <EloRatingBadge elo={miner1Elo} size="small" />
            </Box>
          )}
        </Box>

        {/* VS Separator */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            px: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "1.5rem",
              fontWeight: 800,
              background: "linear-gradient(135deg, #58a6ff 0%, #f97316 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            VS
          </Typography>
        </Box>

        {/* Miner 2 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: 1,
            minWidth: 0,
          }}
        >
          <Avatar
            sx={{
              width: 48,
              height: 48,
              backgroundColor: "rgba(249, 115, 22, 0.2)",
              color: "#f97316",
              fontFamily: '"JetBrains Mono", monospace',
              fontWeight: 700,
              mb: 1,
            }}
          >
            {(competition.miner2GithubId || competition.miner2Hotkey)
              .charAt(0)
              .toUpperCase()}
          </Avatar>
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.75rem",
              color: "#ffffff",
              textAlign: "center",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            {truncateHotkey(competition.miner2Hotkey)}
          </Typography>
          {competition.miner2GithubId && (
            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "rgba(255, 255, 255, 0.5)",
              }}
            >
              @{competition.miner2GithubId}
            </Typography>
          )}
          {miner2Elo !== undefined && (
            <Box sx={{ mt: 1 }}>
              <EloRatingBadge elo={miner2Elo} size="small" />
            </Box>
          )}
        </Box>
      </Box>

      {/* Progress bar showing time remaining */}
      <Box sx={{ mb: 1.5 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            "& .MuiLinearProgress-bar": {
              borderRadius: 3,
              background: submissionOpen
                ? "linear-gradient(90deg, #3fb950 0%, #58a6ff 100%)"
                : "linear-gradient(90deg, #f97316 0%, #ef4444 100%)",
            },
          }}
        />
      </Box>

      {/* Footer: Submission window and deadline info */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.7rem",
            color: submissionOpen ? "#3fb950" : "#f97316",
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          {submissionOpen ? "Submissions Open" : "Judging Phase"}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.7rem",
            color: "rgba(255, 255, 255, 0.5)",
            fontFamily: '"JetBrains Mono", monospace',
          }}
        >
          {blocksRemaining > 0
            ? `${blocksRemaining.toLocaleString()} blocks remaining`
            : "Competition ended"}
        </Typography>
      </Box>
    </Card>
  );
};

export default MinerVsMiner;
