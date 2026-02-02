import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { DistributionPoint } from "../../types/stats";

interface BrandDonutChartProps {
  data: DistributionPoint[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

export function BrandDonutChart({ data }: BrandDonutChartProps) {
  const totalVehicles = data.reduce((acc, curr) => acc + curr.value, 0);

  const chartConfig = data.reduce((acc, curr, idx) => {
    acc[curr.name] = { label: curr.name, color: COLORS[idx % COLORS.length] };
    return acc;
  }, {} as any);

  return (
    <Card className="col-span-3 bg-card/50 border-slate-800 flex flex-col h-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">Répartition de Flotte</CardTitle>
        <CardDescription>Analyse par constructeur automobile</CardDescription>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-1">
        <div className="flex-1 min-h-[300px] relative">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={90}  
                outerRadius={130} 
                paddingAngle={8}
                strokeWidth={0}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-4xl font-extrabold">{totalVehicles}</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Véhicules</span>
          </div>
        </div>


      </CardContent>
    </Card>
  );
}