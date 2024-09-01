"use client";

import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { ChartsLegendRoot } from "@mui/x-charts/ChartsLegend/LegendPerItem";
import { ChartsLegend, legendClasses } from "@mui/x-charts";
import { textFieldClasses } from "@mui/material";

export default function ChartsOverviewDemo() {
  const [data, setData] = React.useState([35, 44, 34, 24, 10, 15]);

  const teams = ["Team 1", "Team 2", "Team 3", "Team 4", "Team 5", "Team 6"];
  const yTicks = [0, 10, 20, 30, 40, 50];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setData(Array.from({ length: 6 }, () => Math.floor(Math.random() * 51)));
    }, 3000);
    return () => clearInterval(interval);
  }, [data]);

  return (
    <BarChart
      series={[{ data: data, label: "Emails" }]}
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
          tickInterval: yTicks,
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
