import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useValidatorStatus } from "../../api/DashboardApi";

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const SidebarCountdown: React.FC = () => {
  const { data: validatorStatus, isLoading } = useValidatorStatus({
    refetchInterval: 60000,
  });

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });

  useEffect(() => {
    if (!validatorStatus?.nextRunAt) return;

    const calculateRemaining = () => {
      const now = new Date().getTime();
      const nextRun = new Date(validatorStatus.nextRunAt!).getTime();
      const diff = Math.max(0, nextRun - now);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining({
        hours,
        minutes,
        seconds,
        total: diff,
      });
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);

    return () => clearInterval(interval);
  }, [validatorStatus?.nextRunAt]);

  const formatTime = (value: number) => value.toString().padStart(2, "0");

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", py: 1 }}>
        <Typography
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.65rem",
            color: "rgba(255, 255, 255, 0.4)",
          }}
        >
          Loading...
        </Typography>
      </Box>
    );
  }

  const isOverdue = timeRemaining.total <= 0 && validatorStatus?.nextRunAt;

  // Color based on time remaining
  const getStatusColor = () => {
    if (timeRemaining.total <= 0) return "#3fb950"; // Green - ready/running
    if (timeRemaining.hours === 0 && timeRemaining.minutes < 10)
      return "#fbbf24"; // Yellow - soon
    return "#60a5fa"; // Blue - normal
  };

  const statusColor = getStatusColor();

  return (
    <Box
      sx={{
        textAlign: "center",
        py: 1.5,
        px: 2,
      }}
    >
      <Typography
        sx={{
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "0.6rem",
          color: "rgba(255, 255, 255, 0.5)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          mb: 0.5,
        }}
      >
        {isOverdue ? "Validator" : "Next validation"}
      </Typography>
      {isOverdue ? (
        <Typography
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.75rem",
            fontWeight: 600,
            color: statusColor,
          }}
        >
          Running...
        </Typography>
      ) : (
        <Typography
          sx={{
            fontFamily: '"JetBrains Mono", monospace',
            fontSize: "0.75rem",
            fontWeight: 600,
            color: statusColor,
          }}
        >
          {timeRemaining.hours > 0 && `${timeRemaining.hours}h `}
          {formatTime(timeRemaining.minutes)}m {formatTime(timeRemaining.seconds)}s
        </Typography>
      )}
    </Box>
  );
};

export default SidebarCountdown;
