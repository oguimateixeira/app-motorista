import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency, formatKm, formatMinutes } from '../lib/format';
import { Card, CardHeader } from '../components/Card';

function formatDateKey(dateKey: string): string {
  const [y, m, d] = dateKey.split('-');
  const date = new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
  return date.toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function HistoryPage() {
  const dailySummaries = useAppStore((s) => s.dailySummaries());
  const ridesForDate = useAppStore((s) => s.ridesForDate);
  const currency = useAppStore((s) => s.settings.currency);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  const summaries = dailySummaries;

  if (summaries.length === 0) {
    return (
      <Card>
        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
          Nenhuma corrida registrada ainda. Registre sua primeira corrida em
          Corrida.
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Resumo por dia" />
        <ul className="divide-y divide-slate-100 dark:divide-slate-700">
          {summaries.map((s) => {
            const isExpanded = expandedDate === s.dateKey;
            const rides = ridesForDate(s.dateKey);
            return (
              <li key={s.dateKey}>
                <button
                  type="button"
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  onClick={() =>
                    setExpandedDate(isExpanded ? null : s.dateKey)
                  }
                >
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">
                      {formatDateKey(s.dateKey)}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {s.totalRides} corrida(s) · {formatKm(s.totalDistanceKm)}
                    </p>
                  </div>
                  <span
                    className={
                      s.netProfit >= 0
                        ? 'text-green-600 dark:text-green-400 font-semibold'
                        : 'text-red-600 dark:text-red-400'
                    }
                  >
                    {formatCurrency(s.netProfit, currency)}
                  </span>
                </button>
                {isExpanded && (
                  <ul className="bg-slate-50 dark:bg-slate-800/50 divide-y divide-slate-100 dark:divide-slate-700">
                    {rides.map((r) => (
                      <li
                        key={r.id}
                        className="px-4 py-2 pl-8 flex justify-between text-sm"
                      >
                        <span className="text-slate-600 dark:text-slate-300">
                          {formatKm(r.distanceKm)} ·{' '}
                          {r.rideType === 'delivery' ? 'Entrega' : 'Passageiro'}
                          {r.durationMinutes != null && r.durationMinutes > 0 && (
                            <> · {formatMinutes(r.durationMinutes)}</>
                          )}
                        </span>
                        <span
                          className={
                            r.netProfit >= 0
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }
                        >
                          {formatCurrency(r.netProfit, currency)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
