import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../ui/chart"

const chartConfig = {
  revenue: {
    label: "Primes Émises",
    color: "#3b82f6",
  },
  collected: {
    label: "Encaissé",
    color: "#10b981",
  },
} satisfies ChartConfig

export function RevenueBarChart({ data }: { data: any[] }) {
  return (
    <Card className="col-span-4 bg-card/50 border-slate-800 hover:border-slate-700 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight">Performance Financière</CardTitle>
          <CardDescription>Visualisation du recouvrement mensuel</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart 
            accessibilityLayer 
            data={data} 
            margin={{ top: 20 }}
            barGap={8}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              fontSize={12}
              tickFormatter={(value) => value}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickFormatter={(value) => `${value} DH`}
              width={80}
            />
            <ChartTooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} 
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} className="mt-4" />
            
            <Bar 
              dataKey="revenue" 
              fill="var(--color-revenue)" 
              radius={[4, 4, 0, 0]} 
              barSize={30}
              className="opacity-90 hover:opacity-100 transition-opacity"
            />
            
            <Bar 
              dataKey="collected" 
              fill="var(--color-collected)" 
              radius={[4, 4, 0, 0]} 
              barSize={30}
              className="opacity-90 hover:opacity-100 transition-opacity"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}