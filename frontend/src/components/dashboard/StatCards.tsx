// components/stats/StatCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  DollarSign,
  Users,
  FileText,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Car,
  Shield,
  Clock,
} from "lucide-react";
import { MetricCard } from "../../types/stats";

const iconMap = {
  dollar: DollarSign,
  users: Users,
  "file-text": FileText,
  "trending-up": TrendingUp,
  wallet: Wallet,
  car: Car,
  shield: Shield,
  clock: Clock,
};

interface StatCardsProps {
  cards: MetricCard[];
}

export function StatCards({ cards }: StatCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = iconMap[card.iconName as keyof typeof iconMap] || FileText;
        const isPositive = card.trend_type === "up";

        return (
          <Card
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-md font-medium text-gray-700 dark:text-gray-300">
                  {card.title}
                </CardTitle>
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {card.value}
              </div>

              <div className="flex items-center gap-2">
                <div
                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    isPositive
                      ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400"
                      : "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400"
                  }`}
                >
                  {isPositive ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(card.trend)}%
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
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
