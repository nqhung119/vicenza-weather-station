import { Box, styled } from "@mui/material";

export const GlassCard = styled(Box)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.05)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
  color: "#fff",
}));

export const GlassCardSecondary = styled(Box)(({ theme }) => ({
  background: "rgba(0, 0, 0, 0.2)",
  backdropFilter: "blur(40px)",
  WebkitBackdropFilter: "blur(40px)",
  borderRadius: "20px",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  padding: "16px",
}));
