"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { ChartsLegendRoot } from "@mui/x-charts/ChartsLegend/LegendPerItem";
import { ChartsLegend, legendClasses } from "@mui/x-charts";
import { textFieldClasses } from "@mui/material";
import { loadScoreData, loadTeams } from "@/lib/queries";
import { SupabaseClient } from "@supabase/supabase-js";
import { getDbClient } from "@/utils/client";

export default function ChartsOverviewDemo() {
  const [scoreData, setScoreData] = useState<number[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    const initSupabase = async () => {
      const client = await getDbClient();
      setSupabase(client);
    };
    initSupabase();
  }, []);

  useEffect(() => {
    if (!supabase) return;

    const fetchInitialData = async () => {
      const teamsData = await loadTeams();
      setTeams(teamsData);

      const initialScores = await loadScoreData();
      setScoreData(initialScores);
    };

    fetchInitialData();

    const subscription = supabase
      .channel("public:emails")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "emails" },
        async (payload) => {
          console.log("Change received!", payload);
          const updatedScores = await loadScoreData();
          setScoreData(updatedScores);
          const updatedTeams = await loadTeams();
          setTeams(updatedTeams);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  // const yTicks = [0, 10, 20, 30, 40, 50];

  // this is the code for the subscription, should be in a useEffect
  // const emails = supabase.channel('custom-insert-channel')
  // .on(
  //   'postgres_changes',
  //   { event: 'INSERT', schema: 'public', table: 'emails' },
  //   (payload) => {
  //     console.log('Change received!', payload)
  //   }
  // )
  // .subscribe()

  return (
    <BarChart
      series={[{ data: scoreData, label: "Emails" }]}
      borderRadius={20}
      colors={[
        "#ffffff",
        "#f0f0f0",
        "#e0e0e0",
        "#d0d0d0",
        "#c0c0c0",
        "#b0b0b0",
      ]}
      xAxis={[
        {
          label: "Teams",
          data: teams,
          scaleType: "band",
        },
      ]}
      yAxis={[
        {
          label: "Score",
        },
      ]}
      margin={{ top: 50, bottom: 50, left: 50, right: 10 }}
      barLabel={"value"}
      sx={(theme) => ({
        [`.${axisClasses.root}`]: {
          [`.${axisClasses.line}`]: {
            stroke: "#FFFFFF", // Sets the axis lines to white
          },
          [`.${axisClasses.tick}`]: {
            stroke: "#FFFFFF", // Sets the ticks to white
          },
          [`.${axisClasses.tickLabel}`]: {
            fill: "#FFFFFF", // Sets the tick labels to white
          },
          [`.${axisClasses.label}`]: {
            fill: "#FFFFFF", // Sets the axis label to white
          },
        },
      })}
    />
  );
}
