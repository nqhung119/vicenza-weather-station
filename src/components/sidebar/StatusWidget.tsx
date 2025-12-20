"use client";

import { Box, Typography } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { GlassCardSecondary } from "@/components/common/GlassCard";

interface StatusWidgetProps {
  label: string;
  value: string;
  data: number[];
  color: string;
}

export default function StatusWidget({ label, value, data, color }: StatusWidgetProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", mb: 1, fontSize: '0.75rem', fontWeight: 600 }}>
        {label}
      </Typography>
      <GlassCardSecondary sx={{ p: 2, position: "relative", overflow: "hidden" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color, boxShadow: `0 0 8px ${color}` }} />
            <Typography variant="caption" sx={{ fontWeight: 600 }}>{value}</Typography>
          </Box>
        </Box>
        <Box sx={{ height: 60, mt: -2, mx: -2 }}>
          <LineChart
            series={[{ data, color, area: true, showMark: false }]}
            // @ts-ignore
            leftAxis={null}
            // @ts-ignore
            bottomAxis={null}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            height={80}
            sx={{
              ".MuiLineElement-root": { strokeWidth: 2 },
              ".MuiAreaElement-root": { fillOpacity: 0.1 },
            }}
          />
        </Box>
        <Box sx={{ position: "absolute", top: 12, right: 12 }}>
           <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)" }}>?</Typography>
        </Box>
      </GlassCardSecondary>
    </Box>
  );
}
