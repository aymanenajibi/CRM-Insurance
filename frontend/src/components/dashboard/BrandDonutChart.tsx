// components/stats/BrandDonutChart.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { PieChart, Pie, Cell } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { DistributionPoint } from "../../types/stats";

interface BrandDonutChartProps {
  data: DistributionPoint[];
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
];

export function BrandDonutChart({ data }: BrandDonutChartProps) {
  const totalVehicles = data.reduce((acc, curr) => acc + curr.value, 0);

  const chartConfig = data.reduce((acc, curr, idx) => {
    acc[curr.name] = { label: curr.name, color: COLORS[idx % COLORS.length] };
    return acc;
  }, {} as any);

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Répartition de la flotte
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
          Analyse par constructeur automobile
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="relative h-[300px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
                strokeWidth={1}
                stroke="rgba(255, 255, 255, 0.1)"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    className="hover:opacity-90 transition-opacity"
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {totalVehicles}
            </span>
            <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
              Véhicules
            </span>
          </div>
        </div>

        {data.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-2">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  {item.name}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 ml-auto">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
