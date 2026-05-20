"use client";

import * as React from "react";
import { Pie, PieChart, Sector } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { AnalyticsData } from "@/lib/dashboard/types";

interface Props {
  data: AnalyticsData["contentDistribution"];
}

const chartConfig = {
  blogs: { label: "Blogs", color: "#3b82f6" },
  destinations: { label: "Destinations", color: "#10b981" },
  itineraries: { label: "Itineraries", color: "#f59e0b" },
  gallery: { label: "Gallery", color: "#8b5cf6" },
  bookings: { label: "Bookings", color: "#ef4444" },
} satisfies ChartConfig;

export function ContentDistributionChart({ data }: Props) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key,
    count: value.count,
    fill: `var(--color-${key})`,
  }));

  const id = "content-distribution";
  const [activeItem, setActiveItem] = React.useState(chartData[0].name);

  const activeIndex = React.useMemo(
    () => chartData.findIndex((item) => item.name === activeItem),
    [activeItem, chartData]
  );

  const totalCount = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.count, 0),
    [chartData]
  );

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>Content Distribution</CardTitle>
        <CardDescription>
          Breakdown of all content types across the platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center justify-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({ outerRadius = 0, ...props }) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 8} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius}
                    innerRadius={outerRadius - 8}
                  />
                </g>
              )}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              onMouseOver={(item) => {
                setActiveItem(item.name);
              }}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
} 