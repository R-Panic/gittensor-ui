import React from "react";
import { Box, Grid, Typography, Skeleton, Card } from "@mui/material";
import { Competition, IssueBounty } from "../../api/models/Issues";
import MinerVsMiner from "./MinerVsMiner";

interface ActiveCompetitionsProps {
  competitions: Competition[];
  issues?: Map<number, IssueBounty>;
  minerElos?: Map<string, number>;
  currentBlock?: number;
  isLoading?: boolean;
}

const ActiveCompetitions: React.FC<ActiveCompetitionsProps> = ({
  competitions,
  issues,
  minerElos,
  currentBlock,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3].map((i) => (
          <Grid item xs={12} md={6} lg={4} key={i}>
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
              <Skeleton
                variant="rectangular"
                height={120}
                sx={{ my: 2, borderRadius: 2 }}
              />
              <Skeleton variant="text" width="100%" />
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (competitions.length === 0) {
    return (
      <Box
        sx={{
          p: 6,
          textAlign: "center",
          backgroundColor: "#000000",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: 3,
        }}
      >
        <Typography
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "1rem",
            color: "rgba(255, 255, 255, 0.5)",
            mb: 1,
          }}
        >
          No Active Competitions
        </Typography>
        <Typography
          sx={{
            fontSize: "0.85rem",
            color: "rgba(255, 255, 255, 0.3)",
          }}
        >
          Check back later or browse available issues to start a new competition
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            color: "rgba(255, 255, 255, 0.5)",
          }}
        >
          {competitions.length} Active Competition
          {competitions.length !== 1 ? "s" : ""}
        </Typography>
        {currentBlock && (
          <Typography
            sx={{
              fontFamily: '"JetBrains Mono", monospace',
              fontSize: "0.75rem",
              color: "rgba(255, 255, 255, 0.3)",
            }}
          >
            Block: {currentBlock.toLocaleString()}
          </Typography>
        )}
      </Box>
      <Grid container spacing={3}>
        {competitions.map((competition) => (
          <Grid item xs={12} md={6} lg={4} key={competition.id}>
            <MinerVsMiner
              competition={competition}
              issue={issues?.get(competition.issueId)}
              miner1Elo={minerElos?.get(competition.miner1Hotkey)}
              miner2Elo={minerElos?.get(competition.miner2Hotkey)}
              currentBlock={currentBlock}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ActiveCompetitions;
