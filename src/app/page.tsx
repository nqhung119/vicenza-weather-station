"use client";

import { Box } from "@mui/material";
import { useWeatherData } from "@/hooks/use-weather-data";
import MainDashboard from "@/components/layout/MainDashboard";
import ForecastFooter from "@/components/dashboard/ForecastFooter";

export default function Dashboard() {
  const { data, history } = useWeatherData();

  return (
    <Box sx={{ position: "relative", zIndex: 1 }}>
      <MainDashboard data={data} history={history}>
        <ForecastFooter data={history.map(h => h.temp_room)} />
      </MainDashboard>
    </Box>
  );
}
