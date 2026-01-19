import React from "react";
import { Box, Tabs, Tab, Stack } from "@mui/material";
import { Page } from "../components/layout";
import { SEO } from "../components";
import {
  IssueStats,
  IssuesList,
  ActiveCompetitions,
  EloLeaderboard,
} from "../components/issues";
import {
  useIssuesStats,
  useActiveCompetitions,
  useEloLeaderboard,
  useIssues,
} from "../api";

const IssuesPage: React.FC = () => {
  const [tab, setTab] = React.useState(0);

  const statsQuery = useIssuesStats();
  const activeCompetitionsQuery = useActiveCompetitions();
  const eloLeaderboardQuery = useEloLeaderboard(25);
  const allIssuesQuery = useIssues();
  const activeIssuesQuery = useIssues("active");
  const completedIssuesQuery = useIssues("completed");

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  return (
    <Page title="Issues Competition">
      <SEO
        title="Issues Competition"
        description="Compete to solve GitHub issues and earn Alpha bounties. View active competitions, ELO rankings, and available issues on Gittensor."
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 1400,
          mx: "auto",
          px: { xs: 2, md: 3 },
        }}
      >
        <Stack spacing={3}>
          {/* Stats Header */}
          <IssueStats
            stats={statsQuery.data}
            isLoading={statsQuery.isLoading}
          />

          {/* Tabs Navigation */}
          <Box
            sx={{
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <Tabs
              value={tab}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textTransform: "none",
                  color: "rgba(255, 255, 255, 0.5)",
                  minHeight: 48,
                  "&.Mui-selected": {
                    color: "#ffffff",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#ffffff",
                  height: 2,
                },
              }}
            >
              <Tab label="All Issues" />
              <Tab label="Active Competitions" />
              <Tab label="Available Issues" />
              <Tab label="ELO Leaderboard" />
              <Tab label="History" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ minHeight: 400 }}>
            {tab === 0 && (
              <IssuesList
                issues={allIssuesQuery.data || []}
                isLoading={allIssuesQuery.isLoading}
                showAllStatuses
              />
            )}
            {tab === 1 && (
              <ActiveCompetitions
                competitions={activeCompetitionsQuery.data || []}
                isLoading={activeCompetitionsQuery.isLoading}
              />
            )}
            {tab === 2 && (
              <IssuesList
                issues={activeIssuesQuery.data || []}
                isLoading={activeIssuesQuery.isLoading}
              />
            )}
            {tab === 3 && (
              <EloLeaderboard
                data={eloLeaderboardQuery.data || []}
                isLoading={eloLeaderboardQuery.isLoading}
                title="Miner ELO Rankings"
              />
            )}
            {tab === 4 && (
              <IssuesList
                issues={completedIssuesQuery.data || []}
                isLoading={completedIssuesQuery.isLoading}
                showCompleted
              />
            )}
          </Box>
        </Stack>
      </Box>
    </Page>
  );
};

export default IssuesPage;
