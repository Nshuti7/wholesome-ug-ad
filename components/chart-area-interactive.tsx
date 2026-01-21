"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  Activity,
  BarChart3,
  FileText,
  Image,
  Mail,
  MapPin,
  Route,
  Star,
  TrendingUp,
  Users,
} from "lucide-react"
import {
  parseISO,
  isValid,
  format as fnFormat,
  getMonth,
  getYear,
  subMonths,
} from "date-fns"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { AnalyticsData, MonthlyStat } from "@/lib/dashboard/types"

type ChartConfigType = {
  [key: string]: {
    label: string
    color: string
    icon: React.ElementType
  }
}

// Configuration for each metric
const chartConfig: ChartConfigType = {
  contacts:   { label: "Contacts",    color: "hsl(221.2 83.2% 53.3%)", icon: Mail },
  reviews:    { label: "Reviews",     color: "hsl(142.1 76.2% 36.3%)", icon: Star },
  subscribers:{ label: "Subscribers", color: "hsl(47.9 95.8% 53.1%)",  icon: Users },
  blogs:      { label: "Blogs",       color: "hsl(262.1 83.3% 57.8%)", icon: FileText },
  destinations:{label: "Destinations",color: "hsl(0 84.2% 60.2%)",     icon: MapPin },
  itineraries:{ label: "Itineraries", color: "hsl(195.2 92.2% 43.1%)", icon: Route },
  bookings:   { label: "Bookings",    color: "hsl(280.2 92.2% 43.1%)", icon: Activity },
}


function safeParse(raw?: string): Date | null {
  if (!raw) return null
  
  // Handle different date formats
  let dt: Date | null = null
  
  if (raw.includes("T")) {
    // ISO format
    dt = parseISO(raw)
  } else if (raw.includes(" ")) {
    // Format like "January 2024" - this is what the backend returns
    const [month, year] = raw.split(" ")
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    const monthIndex = monthNames.indexOf(month)
    if (monthIndex !== -1 && year) {
      dt = new Date(parseInt(year), monthIndex, 1)
    }
  } else {
    // Try ISO format with time
    dt = parseISO(`${raw}T00:00:00Z`)
  }
  
  return isValid(dt) ? dt : null
}


// Custom Tooltip with enhanced styling
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border/50 rounded-lg p-3 shadow-xl">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any) => (
            <div key={entry.name} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div
                  style={{ backgroundColor: entry.color }}
                  className="w-2.5 h-2.5 rounded-full"
                />
                <span className="text-sm text-muted-foreground">
                  {entry.name}
                </span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

const Sparkline = ({ data, color }: { data: number[]; color: string }) => {
  const chartData = data.map((value, index) => ({ name: index, value }))
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

interface ChartAreaInteractiveProps {
  analytics: AnalyticsData | null
}

export function ChartAreaInteractive({ analytics }: ChartAreaInteractiveProps) {
  const [chartType, setChartType] = React.useState<"area" | "line" | "bar">("area")
  const [timePeriod, setTimePeriod] = React.useState("6months")
  const [visibleMetrics, setVisibleMetrics] = React.useState(Object.keys(chartConfig))
  const [hoveredMetric, setHoveredMetric] = React.useState<string | null>(null)

  // Ensure we have at least one visible metric
  React.useEffect(() => {
    if (visibleMetrics.length === 0) {
      setVisibleMetrics([Object.keys(chartConfig)[0]])
    }
  }, [visibleMetrics.length])

  const { chartData, summary } = React.useMemo(() => {
    if (!analytics) {
      // Return sample data when no analytics are available
      const now = new Date()
      const allMonths = Array.from({ length: 12 }, (_, i) =>
        fnFormat(new Date(now.getFullYear(), i), "MMM")
      )
      
      const sampleData = allMonths.map((month) => ({
        month,
        contacts: Math.floor(Math.random() * 50) + 10,
        reviews: Math.floor(Math.random() * 20) + 5,
        subscribers: Math.floor(Math.random() * 30) + 15,
        blogs: Math.floor(Math.random() * 10) + 2,
        destinations: Math.floor(Math.random() * 8) + 1,
        itineraries: Math.floor(Math.random() * 5) + 1,
        gallery: Math.floor(Math.random() * 15) + 3,
        bookings: Math.floor(Math.random() * 25) + 8,
      }))
      
      const sampleSummary = Object.keys(chartConfig).reduce((acc, key) => {
        acc[key] = {
          total: Math.floor(Math.random() * 200) + 50,
          trend: Math.floor(Math.random() * 40) - 20,
          sparkline: Array.from({ length: 12 }, () => Math.floor(Math.random() * 50) + 10)
        }
        return acc
      }, {} as Record<string, { total: number; trend: number; sparkline: number[] }>)
      
      return { chartData: sampleData, summary: sampleSummary }
    }
    
    const now = new Date()
    const allMonths = Array.from({ length: 12 }, (_, i) =>
      fnFormat(new Date(now.getFullYear(), i), "MMM")
    )

    let monthsToShow = allMonths
    if (timePeriod === "6months") {
      const end = getMonth(now)
      const start = getMonth(subMonths(now, 5))
      monthsToShow = allMonths.slice(start, end + 1)
    }

    const processedChartData = monthsToShow.map((month) => {
      const monthIndex = allMonths.indexOf(month)
      const dataPoint: Record<string, string | number> = { month }

      Object.keys(chartConfig).forEach((key) => {
        const stats = analytics.monthlyStats[key as keyof typeof analytics.monthlyStats] || []
        
        const monthStat = stats.find((s: MonthlyStat) => {
          const dt = safeParse(s.month)
          return dt && getMonth(dt) === monthIndex
        })
        
        dataPoint[key] = monthStat ? monthStat.count : 0
      })

      return dataPoint
    })

    const processedSummary: Record<
      string,
      { total: number; trend: number; sparkline: number[] }
    > = {}

    Object.keys(chartConfig).forEach((key) => {
      const fullYearValues = allMonths.map((m) => {
        const stat = analytics.monthlyStats[key as keyof typeof analytics.monthlyStats]?.find(
          (s: MonthlyStat) => {
            const dt = safeParse(s.month)
            return dt && fnFormat(dt, "MMM") === m && getYear(dt) === getYear(now)
          }
        )
        return { month: m, value: stat ? stat.count : 0 }
      })

      const total     = fullYearValues.reduce((sum, curr) => sum + curr.value, 0)
      const recentSum = fullYearValues.slice(-3).reduce((sum, curr) => sum + curr.value, 0)
      const prevSum   = fullYearValues.slice(-6, -3).reduce((sum, curr) => sum + curr.value, 0)
      const trend     = prevSum > 0 ? ((recentSum - prevSum) / prevSum) * 100
                        : recentSum > 0 ? 100 : 0

      processedSummary[key] = {
        total,
        trend,
        sparkline: fullYearValues.map((d) => d.value),
      }
    })

    return { chartData: processedChartData, summary: processedSummary }
  }, [analytics, timePeriod])

  const toggleMetric = (key: string) => {
    setVisibleMetrics((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const ChartComponent = { area: AreaChart, line: LineChart, bar: BarChart }[chartType]
  const MetricComponent = { area: Area, line: Line, bar: Bar }[chartType] as React.ElementType

  return (
    <Card className="h-full w-full flex flex-col">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle>Analytics Overview</CardTitle>
            <CardDescription>
              {!analytics ? "Showing sample data - connect to backend for real metrics." : "An interactive look at your platform's metrics."}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
              </SelectContent>
            </Select>
            <ToggleGroup
              type="single"
              value={chartType}
              onValueChange={(v) => v && setChartType(v as any)}
              className="bg-background rounded-lg border p-1"
            >
              <ToggleGroupItem value="area" aria-label="Area chart">
                <Activity className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="line" aria-label="Line chart">
                <TrendingUp className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="bar" aria-label="Bar chart">
                <BarChart3 className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-6">
        {/* Summary sparklines */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {Object.entries(summary).map(([key, { total, trend, sparkline }]) => {
            const config = chartConfig[key]
            const isVisible = visibleMetrics.includes(key)
            return (
              <TooltipProvider key={key}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      onMouseEnter={() => setHoveredMetric(key)}
                      onMouseLeave={() => setHoveredMetric(null)}
                      onClick={() => toggleMetric(key)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                        isVisible ? "bg-background shadow" : "bg-muted/50"
                      }`}
                      style={{
                        borderColor:
                          isVisible && hoveredMetric === key
                            ? config.color
                            : "transparent",
                      }}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <config.icon
                          className="w-5 h-5"
                          style={{ color: config.color }}
                        />
                      </div>
                      <div className="w-full h-12">
                        <Sparkline data={sparkline} color={config.color} />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-background/95 backdrop-blur-sm border border-border/50 shadow-xl"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">
                        {config.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total: {total.toLocaleString()}
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          trend >= 0 ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {trend >= 0 ? "+" : ""}
                        {trend.toFixed(1)}% from previous period
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          })}
        </div>

        {/* Main chart */}
        <div className="flex-grow min-h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ChartComponent
                data={chartData}
                margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <RechartsTooltip content={<CustomTooltip />} />
                {visibleMetrics.map((key) => {
                  const config = chartConfig[key]
                  const isHovered = hoveredMetric === key
                  return React.createElement(MetricComponent, {
                    key,
                    dataKey: key,
                    name: config.label,
                    type: "monotone",
                    stroke: config.color,
                    fill: config.color,
                    strokeWidth: isHovered ? 3 : 2,
                    fillOpacity: isHovered ? 0.4 : chartType === "area" ? 0.2 : 1,
                    dot: chartType !== "bar",
                    activeDot: chartType !== "bar",
                    radius: chartType === "bar" ? [4, 4, 0, 0] : undefined,
                  })
                })}
              </ChartComponent>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
