import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { 
  DollarSign, 
  Users, 
  FileText, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Wallet 
} from "lucide-react";
import { MetricCard } from "../../types/stats";

const iconMap = {
  dollar: DollarSign,
  users: Users,
  'file-text': FileText,
  'trending-up': TrendingUp,
  wallet: Wallet,  
};

export function StatCards({ cards }: { cards: MetricCard[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => {
        const Icon = iconMap[card.iconName as keyof typeof iconMap] || FileText;
        const isPositive = card.trend_type === 'up';

        return (
          <Card key={i} className="bg-card/50 border-slate-800 hover:border-primary/50 hover:bg-card/80 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
              <CardTitle className="text-base font-semibold tracking-tight text-foreground/90">
                {card.title}
              </CardTitle>
              <div className="p-2.5 bg-primary/15 rounded-xl">
                <Icon className="w-7 h-7 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-extrabold tracking-tight">
                {card.value}
              </div>
              
              <div className="flex items-center mt-2">
                <div className={`flex items-center px-1.5 py-0.5 rounded-md text-xs font-bold ${
                  isPositive 
                    ? 'bg-emerald-500/10 text-emerald-500' 
                    : 'bg-rose-500/10 text-rose-500'
                }`}>
                  {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {Math.abs(card.trend)}%
                </div>
                <span className="ml-2 text-xs font-medium text-muted-foreground italic">
                  {card.description}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}