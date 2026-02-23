import { useAppStore } from '../store/useAppStore';
import { formatCurrency } from '../lib/format';
import { Card, CardHeader } from '../components/Card';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

export function DailyGoalPage() {
  const todayNetProfit = useAppStore((s) => s.todayNetProfit());
  const dailyGoal = useAppStore((s) => s.settings.dailyGoal);
  const ridesNeededForGoal = useAppStore((s) => s.ridesNeededForGoal());
  const averageProfitPerRide = useAppStore((s) => s.averageProfitPerRide());
  const currency = useAppStore((s) => s.settings.currency);

  const remaining = Math.max(0, dailyGoal.targetNetProfit - todayNetProfit);
  const progress =
    dailyGoal.targetNetProfit > 0
      ? Math.min(1, todayNetProfit / dailyGoal.targetNetProfit)
      : 0;

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm text-slate-500 dark:text-slate-400">Meta do dia</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {formatCurrency(dailyGoal.targetNetProfit, currency)}
        </p>
      </section>

      <Card>
        <CardHeader title="Progresso" />
        <div className="p-4 space-y-4">
          <div className="h-4 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 dark:bg-green-600 transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                {formatCurrency(todayNetProfit, currency)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Lucro hoje
              </p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100">
                {formatCurrency(remaining, currency)}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Faltando
              </p>
            </div>
          </div>
          {remaining <= 0 && (
            <p className="text-center text-green-600 dark:text-green-400 font-medium">
              Meta atingida!
            </p>
          )}
          {remaining > 0 && averageProfitPerRide > 0 && (
            <p className="text-sm text-slate-600 dark:text-slate-300 text-center">
              Aproximadamente <strong>{ridesNeededForGoal}</strong> corrida(s)
              para a meta (média {formatCurrency(averageProfitPerRide, currency)}/corrida)
            </p>
          )}
          <Link to="/settings">
            <Button variant="secondary" fullWidth>
              Alterar meta nas configurações
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
