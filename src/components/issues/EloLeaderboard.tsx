import React from "react";
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Skeleton,
  Tooltip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { EloScore } from "../../api/models/Issues";
import EloRatingBadge from "./EloRatingBadge";

interface EloLeaderboardProps {
  data: EloScore[];
  isLoading?: boolean;
  title?: string;
  onSelectMiner?: (hotkey: string) => void;
}

/**
 * Truncate hotkey for display
 */
const truncateHotkey = (hotkey: string, startChars = 6, endChars = 4): string => {
  if (hotkey.length <= startChars + endChars) return hotkey;
  return `${hotkey.slice(0, startChars)}...${hotkey.slice(-endChars)}`;
};

/**
 * Calculate win percentage
 */
const calculateWinRate = (wins: number, losses: number): string => {
  const total = wins + losses;
  if (total === 0) return "0%";
  return `${Math.round((wins / total) * 100)}%`;
};

const EloLeaderboard: React.FC<EloLeaderboardProps> = ({
  data,
  isLoading = false,
  title = "ELO Leaderboard",
  onSelectMiner,
}) => {
  const headerCellSx = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
    color: "rgba(255, 255, 255, 0.3)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    py: 1.5,
  };

  const bodyCellSx = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: "0.85rem",
    color: "#ffffff",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
    py: 1.5,
  };

  if (isLoading) {
    return (
      <Card
        sx={{
          backgroundColor: "#000000",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 3,
        }}
        elevation={0}
      >
        <Box sx={{ p: 2 }}>
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "1rem",
              fontWeight: 600,
              mb: 2,
            }}
          >
            {title}
          </Typography>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={40}
              sx={{ mb: 1, borderRadius: 1 }}
            />
          ))}
        </Box>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card
        sx={{
          backgroundColor: "#000000",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 3,
          p: 4,
          textAlign: "center",
        }}
        elevation={0}
      >
        <Typography sx={{ color: "rgba(255, 255, 255, 0.5)" }}>
          No ELO data available
        </Typography>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        backgroundColor: "#000000",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 3,
        overflow: "hidden",
      }}
      elevation={0}
    >
      {title && (
        <Box sx={{ p: 2, borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            {title}
          </Typography>
        </Box>
      )}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ ...headerCellSx, width: "60px" }}>Rank</TableCell>
              <TableCell sx={headerCellSx}>Miner</TableCell>
              <TableCell sx={{ ...headerCellSx, textAlign: "center" }}>
                ELO
              </TableCell>
              <TableCell sx={{ ...headerCellSx, textAlign: "center" }}>
                W/L
              </TableCell>
              <TableCell sx={{ ...headerCellSx, textAlign: "center" }}>
                Win %
              </TableCell>
              <TableCell sx={{ ...headerCellSx, textAlign: "center" }}>
                Eligible
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((score, index) => {
              const rank = index + 1;
              const rankColor =
                rank === 1
                  ? "#FFD700"
                  : rank === 2
                    ? "#C0C0C0"
                    : rank === 3
                      ? "#CD7F32"
                      : "rgba(255, 255, 255, 0.6)";

              return (
                <TableRow
                  key={score.hotkey}
                  onClick={() => onSelectMiner?.(score.hotkey)}
                  sx={{
                    cursor: onSelectMiner ? "pointer" : "default",
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.03)",
                    },
                  }}
                >
                  <TableCell sx={bodyCellSx}>
                    <Typography
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: rankColor,
                      }}
                    >
                      #{rank}
                    </Typography>
                  </TableCell>
                  <TableCell sx={bodyCellSx}>
                    <Tooltip title={score.hotkey} arrow placement="top">
                      <Typography
                        sx={{
                          fontFamily: '"JetBrains Mono", monospace',
                          fontSize: "0.85rem",
                          color: "#58a6ff",
                        }}
                      >
                        {truncateHotkey(score.hotkey)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ ...bodyCellSx, textAlign: "center" }}>
                    <EloRatingBadge elo={score.elo} size="small" />
                  </TableCell>
                  <TableCell sx={{ ...bodyCellSx, textAlign: "center" }}>
                    <Typography
                      component="span"
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: "0.8rem",
                      }}
                    >
                      <Box component="span" sx={{ color: "#3fb950" }}>
                        {score.wins}
                      </Box>
                      <Box
                        component="span"
                        sx={{ color: "rgba(255, 255, 255, 0.3)", mx: 0.5 }}
                      >
                        /
                      </Box>
                      <Box component="span" sx={{ color: "#ef4444" }}>
                        {score.losses}
                      </Box>
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ ...bodyCellSx, textAlign: "center" }}>
                    <Typography
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: "0.8rem",
                        color:
                          score.wins / (score.wins + score.losses || 1) >= 0.5
                            ? "#3fb950"
                            : "#ef4444",
                      }}
                    >
                      {calculateWinRate(score.wins, score.losses)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ ...bodyCellSx, textAlign: "center" }}>
                    {score.isEligible ? (
                      <CheckCircleIcon
                        sx={{ fontSize: 18, color: "#3fb950" }}
                      />
                    ) : (
                      <CancelIcon
                        sx={{ fontSize: 18, color: "rgba(255, 255, 255, 0.3)" }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default EloLeaderboard;
