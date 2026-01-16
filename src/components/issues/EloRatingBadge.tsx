import React from "react";
import { Chip, SxProps, Theme } from "@mui/material";

interface EloRatingBadgeProps {
  elo: number;
  size?: "small" | "medium";
  sx?: SxProps<Theme>;
}

/**
 * Get color based on ELO rating
 * - Green: >= 1000 (high performers)
 * - Yellow: 800-999 (average)
 * - Orange: 700-799 (below average)
 * - Red: < 700 (low performers)
 */
const getEloColor = (elo: number): string => {
  if (elo >= 1000) return "#3fb950"; // Green
  if (elo >= 800) return "#fbbf24"; // Yellow
  if (elo >= 700) return "#f97316"; // Orange
  return "#ef4444"; // Red
};

const EloRatingBadge: React.FC<EloRatingBadgeProps> = ({
  elo,
  size = "small",
  sx,
}) => {
  const color = getEloColor(elo);

  return (
    <Chip
      label={Math.round(elo)}
      size={size}
      sx={{
        fontFamily: '"JetBrains Mono", monospace',
        fontWeight: 600,
        backgroundColor: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
        ...sx,
      }}
    />
  );
};

export default EloRatingBadge;
