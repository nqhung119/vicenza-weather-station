"use client";

import { Box, Typography, IconButton } from "@mui/material";
import { Navigation, Circle } from "lucide-react";
import { GlassCardSecondary } from "@/components/common/GlassCard";

export default function GlobeWidget() {
  return (
    <Box sx={{ mt: "auto", pl: 1.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)", fontSize: '0.75rem', fontWeight: 600 }}>
          Select Area
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5 }}>
           <Navigation size={12} style={{ opacity: 0.6 }} />
           <Circle size={4} fill="white" style={{ opacity: 0.6 }} />
           <Circle size={4} style={{ opacity: 0.3 }} />
        </Box>
      </Box>
      
      <Box sx={{ position: "relative", width: "100%", pt: "100%", mb: 2 }}>
        {/* Stylized Globe Placeholder */}
        <Box sx={{ 
          position: "absolute", 
          top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.4) 100%)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
           <Box sx={{ 
             width: "120%", 
             height: "120%", 
             backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')",
             backgroundSize: "contain",
             backgroundRepeat: "no-repeat",
             backgroundPosition: "center",
             opacity: 0.2,
             filter: "invert(1)",
             animation: "rotation 60s linear infinite"
           }} />
           <Box sx={{ 
             position: "absolute",
             width: 12, height: 12,
             bgcolor: "#ff5e62",
             borderRadius: "50%",
             boxShadow: "0 0 15px #ff5e62",
             top: "40%",
             left: "45%"
           }} />
        </Box>
      </Box>

      <GlassCardSecondary sx={{ py: 2, px: 3, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "rgba(255,255,255,0.02)", boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)" }}>
          <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: 1, color: "rgba(255,255,255,0.8)" }}>
            Vicenza Station - Home
          </Typography>
      </GlassCardSecondary>

      <style jsx global>{`
        @keyframes rotation {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
}
