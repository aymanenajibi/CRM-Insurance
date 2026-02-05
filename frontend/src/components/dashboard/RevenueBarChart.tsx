// components/stats/RevenueBarChart.tsx - Version alternative
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

// Configuration des couleurs pour recharts
const barColors = {
  revenue: "#3b82f6", // blue-600
  collected: "#10b981", // green-600
};

const chartConfig = {
  revenue: {
    label: "Primes émises",
    color: barColors.revenue,
  },
  collected: {
    label: "Encaissé",
    color: barColors.collected,
  },
} satisfies ChartConfig;

export function RevenueBarChart({ data }: { data: any[] }) {
  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Performance financière
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
          Visualisation du recouvrement mensuel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              className="stroke-gray-200 dark:stroke-gray-700"
            />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickMargin={10}
              className="text-gray-600 dark:text-gray-400"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              tickMargin={10}
              tickFormatter={(value) => `${value} DH`}
              className="text-gray-600 dark:text-gray-400"
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
            />

            {/* Légende personnalisée */}
            <Legend
              content={(props) => {
                const { payload } = props;
                return (
                  <div className="flex items-center justify-center gap-4 mt-4">
                    {payload?.map((entry, index) => (
                      <div
                        key={`item-${index}`}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-xs text-gray-700 dark:text-gray-300">
                          {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />

            <Bar
              dataKey="revenue"
              fill={barColors.revenue}
              radius={[4, 4, 0, 0]}
              barSize={24}
              className="hover:opacity-90 transition-opacity"
            />

            <Bar
              dataKey="collected"
              fill={barColors.collected}
              radius={[4, 4, 0, 0]}
              barSize={24}
              className="hover:opacity-90 transition-opacity"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
