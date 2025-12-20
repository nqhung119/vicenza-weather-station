"use client";

import { useState, useEffect } from "react";
import { WeatherData, WeatherState } from "@/types/weather";

export function useWeatherData() {
  const [data, setData] = useState<WeatherState | null>(null);
  const [history, setHistory] = useState<WeatherData[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("/api/mqtt");

    eventSource.onmessage = (event) => {
      try {
        const newData: WeatherData = JSON.parse(event.data);
        const state: WeatherState = {
          ...newData,
          isConnected: true,
          // Convert Unix timestamp (seconds) to JS Date (milliseconds)
          lastUpdate: newData.timestamp ? new Date(newData.timestamp * 1000) : new Date(),
        };
        setData(state);
        setHistory((prev) => {
          const updated = [...prev, newData];
          return updated.length > 50 ? updated.slice(-50) : updated;
        });
      } catch (error) {
        console.error("Failed to parse SSE data:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      setData((prev) => prev ? { ...prev, isConnected: false } : null);
      // Removed eventSource.close() to let it auto-reconnect
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return { data, history };
}
