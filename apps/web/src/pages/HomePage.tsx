import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency, formatKm } from '../lib/format';
import { Card, CardHeader } from '../components/Card';
import { Button } from '../components/Button';

export function HomePage() {
  const vehicle = useAppStore((s) => s.currentVehicle());
  const todayNetProfit = useAppStore((s) => s.todayNetProfit());
  const dailyGoal = useAppStore((s) => s.settings.dailyGoal);
  const todayDateKey = useAppStore((s) => s.todayDateKey());
  const ridesForDate = useAppStore((s) => s.ridesForDate);
  const todayRides = ridesForDate(todayDateKey);
  const remaining = Math.max(0, dailyGoal.targetNetProfit - todayNetProfit);
  const currency = useAppStore((s) => s.settings.currency);

  const progress =
    dailyGoal.targetNetProfit > 0
      ? Math.min(1, todayNetProfit / dailyGoal.targetNetProfit)
      : 0;

  if (!vehicle) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader
            title="Cadastre seu veículo"
            subtitle="Para calcular o lucro real das corridas, precisamos dos dados do seu veículo."
          />
          <div className="p-4">
            <Link to="/vehicle">
              <Button fullWidth>Cadastrar veículo</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
          Lucro líquido hoje
        </p>
        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          {formatCurrency(todayNetProfit, currency)}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {todayRides.length} corrida(s) registrada(s)
        </p>
      </section>

      <Card>
        <CardHeader
          title="Meta do dia"
          subtitle={`Meta: ${formatCurrency(dailyGoal.targetNetProfit, currency)}`}
        />
        <div className="p-4 space-y-4">
          <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 dark:bg-green-600 transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          {remaining > 0 ? (
            <p className="text-slate-600 dark:text-slate-300">
              Faltam {formatCurrency(remaining, currency)} para a meta
            </p>
          ) : (
            <p className="text-green-600 dark:text-green-400 font-medium">
              Meta atingida!
            </p>
          )}
          <div className="flex gap-3">
            <Link to="/goal" className="flex-1">
              <Button variant="secondary" fullWidth>
                Ver meta
              </Button>
            </Link>
            <Link to="/ride" className="flex-1">
              <Button fullWidth>Registrar corrida</Button>
            </Link>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/worth-it">
          <Card className="p-4 block hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
            <span className="text-2xl">✓</span>
            <p className="font-medium text-slate-800 dark:text-slate-100 mt-2">
              Vale a pena?
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Antes de aceitar
            </p>
          </Card>
        </Link>
        <Link to="/history">
          <Card className="p-4 block hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
            <span className="text-2xl">📋</span>
            <p className="font-medium text-slate-800 dark:text-slate-100 mt-2">
              Histórico
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Resumos e corridas
            </p>
          </Card>
        </Link>
      </div>

      {todayRides.length > 0 && (
        <Card>
          <CardHeader title="Corridas de hoje" />
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {todayRides.slice(0, 5).map((r) => (
              <li
                key={r.id}
                className="px-4 py-3 flex justify-between items-center"
              >
                <span className="text-slate-600 dark:text-slate-300">
                  {formatKm(r.distanceKm)} · {r.rideType === 'delivery' ? 'Entrega' : 'Passageiro'}
                </span>
                <span
                  className={
                    r.netProfit >= 0
                      ? 'text-green-600 dark:text-green-400 font-medium'
                      : 'text-red-600 dark:text-red-400'
                  }
                >
                  {formatCurrency(r.netProfit, currency)}
                </span>
              </li>
            ))}
          </ul>
          {todayRides.length > 5 && (
            <div className="p-3 text-center">
              <Link
                to="/history"
                className="text-sm text-blue-600 dark:text-blue-400 font-medium"
              >
                Ver todas
              </Link>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
