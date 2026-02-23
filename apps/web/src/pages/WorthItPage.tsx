import { useState } from 'react';
import {
  calculateRideCost,
  evaluateWorthIt,
  type WorthItVerdict,
} from '@driver-profit/shared';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency, formatKm, formatMinutes } from '../lib/format';
import { Card, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

const VERDICT_LABELS: Record<WorthItVerdict, { label: string; emoji: string; className: string }> = {
  worth_it: { label: 'Vale a pena!', emoji: '✅', className: 'text-green-600 dark:text-green-400' },
  low_margin: { label: 'Margem baixa', emoji: '⚠️', className: 'text-amber-600 dark:text-amber-400' },
  not_worth_it: { label: 'Não vale a pena', emoji: '❌', className: 'text-red-600 dark:text-red-400' },
};

export function WorthItPage() {
  const vehicle = useAppStore((s) => s.currentVehicle());
  const thresholds = useAppStore((s) => s.settings.worthItThresholds);
  const currency = useAppStore((s) => s.settings.currency);

  const [distance, setDistance] = useState('');
  const [payout, setPayout] = useState('');
  const [duration, setDuration] = useState('');
  const [result, setResult] = useState<ReturnType<typeof calculateRideCost> | null>(null);
  const [verdict, setVerdict] = useState<WorthItVerdict | null>(null);

  const distanceNum = parseFloat(distance.replace(',', '.')) || 0;
  const payoutNum = parseFloat(payout.replace(',', '.')) || 0;
  const durationNum = duration ? parseFloat(duration.replace(',', '.')) || 0 : undefined;

  const handleCalculate = () => {
    if (!vehicle || distanceNum <= 0 || payoutNum <= 0) return;
    const breakdown = calculateRideCost(
      {
        distanceKm: distanceNum,
        payout: payoutNum,
        rideType: 'delivery',
        durationMinutes: durationNum || undefined,
      },
      vehicle
    );
    const v = evaluateWorthIt(
      breakdown,
      thresholds,
      durationNum || undefined
    );
    setResult(breakdown);
    setVerdict(v);
  };

  if (!vehicle) {
    return (
      <Card>
        <CardHeader
          title="Cadastre um veículo"
          subtitle="Vá em Veículo no menu para configurar."
        />
      </Card>
    );
  }

  const verdictInfo = verdict ? VERDICT_LABELS[verdict] : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Vale a pena?"
          subtitle="Digite distância e valor antes de aceitar."
        />
        <div className="p-4 space-y-4">
          <Input
            label="Distância (km)"
            type="text"
            inputMode="decimal"
            placeholder="Ex: 5,2"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
          />
          <Input
            label="Valor da corrida"
            type="text"
            inputMode="decimal"
            placeholder="Ex: 15,00"
            value={payout}
            onChange={(e) => setPayout(e.target.value)}
          />
          <Input
            label="Tempo estimado (min) — opcional"
            type="text"
            inputMode="numeric"
            placeholder="Ex: 25"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <Button
            fullWidth
            onClick={handleCalculate}
            disabled={distanceNum <= 0 || payoutNum <= 0}
          >
            Calcular
          </Button>
        </div>
      </Card>

      {result && verdictInfo && (
        <Card>
          <div className="p-4">
            <div className={`text-center py-4 ${verdictInfo.className}`}>
              <span className="text-4xl block">{verdictInfo.emoji}</span>
              <p className="text-xl font-semibold mt-2">{verdictInfo.label}</p>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Custo total</span>
                <span>{formatCurrency(result.totalCost, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Lucro líquido</span>
                <span
                  className={
                    result.netProfit >= 0
                      ? 'text-green-600 dark:text-green-400 font-medium'
                      : 'text-red-600 dark:text-red-400'
                  }
                >
                  {formatCurrency(result.netProfit, currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Por km</span>
                <span>{formatCurrency(result.profitPerKm, currency)}/km</span>
              </div>
              {durationNum > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Por hora</span>
                  <span>{formatCurrency(result.profitPerHour, currency)}/h</span>
                </div>
              )}
            </dl>
          </div>
        </Card>
      )}
    </div>
  );
}
