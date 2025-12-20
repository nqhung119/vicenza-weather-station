"use client";

import { Box, Typography, Divider } from "@mui/material";
import { MapPin, Thermometer, Droplets, Sun, Activity, Wifi, ShieldCheck, Database, Clock } from "lucide-react";
import { format } from "date-fns";
import { GlassCard } from "@/components/common/GlassCard";
import SystemStatus from "@/components/sidebar/SystemStatus";
import GlobeWidget from "@/components/sidebar/GlobeWidget";
import { WeatherData } from "@/types/weather";

interface MainDashboardProps {
  data: (WeatherData & { isConnected?: boolean; lastUpdate?: Date }) | null;
  history: WeatherData[];
  children: React.ReactNode;
}

export default function MainDashboard({ data, history, children }: MainDashboardProps) {
  return (
    <Box sx={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      p: { xs: 0, md: 4 }
    }}>
      <GlassCard sx={{ 
        width: "100%", 
        maxWidth: "1200px", 
        height: { xs: "100vh", md: "850px" },
        display: "flex",
        overflow: "hidden",
        position: "relative",
        boxShadow: "inset 0 0 100px rgba(0,0,0,0.2), 0 25px 50px -12px rgba(0,0,0,0.5)"
      }}>
        {/* Sidebar */}
        <Box sx={{ 
          width: "300px", 
          borderRight: "1px solid rgba(255,255,255,0.1)",
          p: 4,
          display: { xs: "none", lg: "flex" },
          flexDirection: "column",
          gap: 4
        }}>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: 2, display: "inline-block" }}>
              VICENZA
              <Box sx={{ height: 3, width: "100%", bgcolor: "rgba(255,255,255,0.3)", mt: 0.5, borderRadius: 1 }} />
            </Typography>
          </Box>

          <Box sx={{ pl: 1 }}>
            <SystemStatus isConnected={data?.isConnected ?? false} />
          </Box>

          <Box sx={{ mt: "auto", pl: 1 }}>
            <GlobeWidget />
          </Box>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", px: { xs: 4, lg: 10 }, py: 6, position: "relative" }}>
          {/* Top Bar: Minimalist with Connection Status */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "rgba(255,255,255,0.4)" }}>
                <Clock size={16} />
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  {data?.lastUpdate ? format(data.lastUpdate, "HH:mm:ss") : "--:--:--"}
                </Typography>
              </Box>
              <Divider orientation="vertical" flexItem sx={{ borderColor: "rgba(255,255,255,0.1)", height: 16, alignSelf: "center" }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>STATION ID:</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700 }}>VIC-001</Typography>
              </Box>
            </Box>
            
            <Box sx={{ 
                px: 2, py: 0.8, 
                borderRadius: "20px", 
                bgcolor: data?.isConnected ? "rgba(76, 175, 80, 0.1)" : "rgba(244, 67, 54, 0.1)", 
                border: `1px solid ${data?.isConnected ? "rgba(76, 175, 80, 0.2)" : "rgba(244, 67, 54, 0.2)"}`,
                display: "flex", alignItems: "center", gap: 1.5
            }}>
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: data?.isConnected ? "#4caf50" : "#f44336", boxShadow: `0 0 10px ${data?.isConnected ? "#4caf50" : "#f44336"}` }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: data?.isConnected ? "#81c784" : "#e57373", letterSpacing: 1 }}>
                {data?.isConnected ? "SYSTEM LIVE" : "STATION OFFLINE"}
              </Typography>
            </Box>
          </Box>

          {/* Center Content: Hero Section + Sensor Grid */}
          <Box sx={{ 
            flexGrow: 1, 
            display: "flex", 
            flexDirection: { xs: "column", xl: "row" }, 
            gap: 10, 
            alignItems: "center",
            maxWidth: "1000px",
            mx: "auto",
            width: "100%"
          }}>
            
            {/* Hero Section */}
            <Box sx={{ flex: 1.2, display: "flex", flexDirection: "column" }}>
              <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                <Typography sx={{ 
                    fontSize: { xs: '7rem', md: '11rem' }, 
                    fontWeight: 200, 
                    lineHeight: 0.9,
                    textShadow: "0 0 40px rgba(255,255,255,0.2)"
                }}>
                  {data?.temp_room ?? "--"}
                </Typography>
                <Typography sx={{ fontSize: '3.5rem', fontWeight: 300, color: "rgba(255,255,255,0.2)" }}>°C</Typography>
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <MapPin size={24} color="#ff5e62" />
                    <Typography variant="h2" sx={{ fontWeight: 700, letterSpacing: -1.5 }}>
                        Living Room
                    </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 300, color: "rgba(255,255,255,0.5)" }}>
                  Indoor Atmosphere Control
                </Typography>
                
                <Box sx={{ display: "flex", gap: 1.5, mt: 4 }}>
                   <StatBadge label="PEAK" value="29.4°" />
                   <StatBadge label="LOW" value="12.1°" />
                </Box>
              </Box>
            </Box>

            {/* Sensor Grid */}
            <Box sx={{ 
              width: { xs: "100%", xl: "420px" }, 
              display: "grid", 
              gridTemplateColumns: "1fr 1fr", 
              gap: 2.5 
            }}>
               <MetricCard icon="Thermometer" label="Outdoor" value={`${data?.temp_out ?? "--"}°C`} subValue="Garden Node" color="#ff5e62" />
               <MetricCard icon="Droplets" label="Humidity" value={`${data?.hum_room ?? "--"}%`} subValue="Room Level" color="#00d2ff" />
               <MetricCard icon="Sun" label="Solar Info" value={`${data?.lux ?? "--"} lx`} subValue="Ambient Light" color="#ffb75e" />
               <MetricCard icon="Activity" label="Connectivity" value={data?.isConnected ? "12ms" : "---"} subValue="SSE Latency" color={data?.isConnected ? "#4caf50" : "#f44336"} />
            </Box>
          </Box>

          {/* Forecast/History Footer */}
          <Box sx={{ maxWidth: "1000px", mx: "auto", width: "100%" }}>
            {children}
          </Box>
        </Box>
      </GlassCard>
    </Box>
  );
}

function StatBadge({ label, value }: { label: string, value: string }) {
    return (
        <Box sx={{ 
            bgcolor: "rgba(0,0,0,0.1)", 
            px: 2, py: 1, 
            borderRadius: 2, 
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)",
            display: "flex", alignItems: "center", gap: 2
        }}>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)", fontWeight: 800, fontSize: '0.65rem', letterSpacing: 1 }}>{label}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{value}</Typography>
        </Box>
    );
}

function MetricCard({ icon, label, value, subValue, color }: { icon: string, label: string, value: string, subValue: string, color: string }) {
    const icons: Record<string, any> = { Thermometer, Droplets, Sun, Activity, Wifi, ShieldCheck, Database };
    const Icon = icons[icon] || Activity;
    
    return (
        <Box sx={{ 
            bgcolor: "rgba(0, 0, 0, 0.15)", 
            p: 3, 
            borderRadius: 6, 
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.2)",
            backdropFilter: "blur(20px)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "relative",
            overflow: "hidden",
            "&:hover": { 
                bgcolor: "rgba(0, 0, 0, 0.25)", 
                transform: "translateY(-4px)",
                boxShadow: "inset 0 0 30px rgba(0,0,0,0.2), 0 20px 40px rgba(0,0,0,0.4)",
                "& .icon-box": { transform: "scale(1.1) rotate(-5deg)" }
            },
            "&::before": {
                content: '""',
                position: "absolute",
                top: 0, left: 0, right: 0, height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
            }
        }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                <Box className="icon-box" sx={{ 
                    p: 1.5, 
                    borderRadius: 2.5, 
                    bgcolor: `${color}10`, 
                    color: color, 
                    transition: "transform 0.4s ease",
                    border: `1px solid ${color}20` 
                }}>
                    <Icon size={24} />
                </Box>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: -0.5 }}>{value}</Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.3)", fontWeight: 800, letterSpacing: 1.5, display: "block", mb: 0.5 }}>{label.toUpperCase()}</Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.4)", fontSize: '0.75rem', fontWeight: 500 }}>{subValue}</Typography>
        </Box>
    )
}
