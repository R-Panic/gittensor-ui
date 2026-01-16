import React, { useState, useEffect, useMemo } from "react";
import { Box, Typography, useMediaQuery, keyframes } from "@mui/material";
import theme from "../../theme";
import { useValidatorStatus } from "../../api/DashboardApi";

// Pulse animation for the glow effect
const pulse = keyframes`
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
`;

// Rotate animation for the outer ring
const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const ValidatorCountdown: React.FC = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { data: validatorStatus, isLoading } = useValidatorStatus({
    refetchInterval: 60000,
  });

  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });

  // Calculate time remaining
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

  // Calculate progress (0 to 1)
  const progress = useMemo(() => {
    if (!validatorStatus?.intervalMs || timeRemaining.total === 0) return 0;
    const elapsed = validatorStatus.intervalMs - timeRemaining.total;
    return Math.min(1, Math.max(0, elapsed / validatorStatus.intervalMs));
  }, [timeRemaining.total, validatorStatus?.intervalMs]);

  // SVG parameters for the circular progress
  const size = isMobile ? 120 : 140;
  const strokeWidth = 4;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  // Color based on time remaining
  const getStatusColor = () => {
    if (timeRemaining.total <= 0) return "#3fb950"; // Green - ready/running
    if (timeRemaining.hours === 0 && timeRemaining.minutes < 10)
      return "#fbbf24"; // Yellow - soon
    return "#60a5fa"; // Blue - normal
  };

  const statusColor = getStatusColor();

  // Format time display
  const formatTime = (value: number) => value.toString().padStart(2, "0");

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: size,
          width: size,
        }}
      >
        <Typography variant="body2" color="rgba(255, 255, 255, 0.5)">
          Loading...
        </Typography>
      </Box>
    );
  }

  const isOverdue = timeRemaining.total <= 0 && validatorStatus?.nextRunAt;

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      {/* Timer Container */}
      <Box
        sx={{
          position: "relative",
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Animated glow background */}
        <Box
          sx={{
            position: "absolute",
            width: size * 0.8,
            height: size * 0.8,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${statusColor}20 0%, transparent 70%)`,
            animation: `${pulse} 2s ease-in-out infinite`,
          }}
        />

        {/* SVG Progress Ring */}
        <svg
          width={size}
          height={size}
          style={{
            position: "absolute",
            transform: "rotate(-90deg)",
          }}
        >
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={statusColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: "stroke-dashoffset 1s linear, stroke 0.3s ease",
            }}
          />
        </svg>

        {/* Decorative rotating outer ring */}
        <Box
          sx={{
            position: "absolute",
            width: size + 10,
            height: size + 10,
            borderRadius: "50%",
            border: `1px dashed ${statusColor}30`,
            animation: `${rotate} 30s linear infinite`,
          }}
        />

        {/* Inner content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          }}
        >
          {isOverdue ? (
            <>
              <Typography
                variant="monoSmall"
                sx={{
                  color: statusColor,
                  fontSize: isMobile ? 10 : 11,
                  mb: 0.5,
                }}
              >
                VALIDATOR
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontSize: isMobile ? 14 : 16,
                  fontWeight: 600,
                  color: statusColor,
                }}
              >
                RUNNING
              </Typography>
            </>
          ) : (
            <>
              <Typography
                variant="monoSmall"
                sx={{
                  color: "rgba(255, 255, 255, 0.5)",
                  fontSize: isMobile ? 8 : 9,
                  mb: 0.5,
                }}
              >
                NEXT RUN
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 0.5,
                }}
              >
                {timeRemaining.hours > 0 && (
                  <>
                    <Typography
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: isMobile ? 18 : 22,
                        fontWeight: 700,
                        color: "#fff",
                        lineHeight: 1,
                      }}
                    >
                      {timeRemaining.hours}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: isMobile ? 10 : 12,
                        fontWeight: 500,
                        color: statusColor,
                        lineHeight: 1,
                        mr: 0.5,
                      }}
                    >
                      h
                    </Typography>
                  </>
                )}
                <Typography
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: isMobile ? 18 : 22,
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  {timeRemaining.hours > 0 ? formatTime(timeRemaining.minutes) : timeRemaining.minutes}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: isMobile ? 10 : 12,
                    fontWeight: 500,
                    color: statusColor,
                    lineHeight: 1,
                    mr: 0.5,
                  }}
                >
                  m
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: isMobile ? 18 : 22,
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  {formatTime(timeRemaining.seconds)}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"JetBrains Mono", monospace',
                    fontSize: isMobile ? 10 : 12,
                    fontWeight: 500,
                    color: statusColor,
                    lineHeight: 1,
                  }}
                >
                  s
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Label */}
      <Typography
        variant="monoSmall"
        sx={{
          color: "rgba(255, 255, 255, 0.4)",
          fontSize: isMobile ? 9 : 10,
          textAlign: "center",
        }}
      >
        {isOverdue ? "Evaluating miners..." : "Until validator evaluation"}
      </Typography>
    </Box>
  );
};

export default ValidatorCountdown;
