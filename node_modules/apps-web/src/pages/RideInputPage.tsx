import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { formatCurrency, formatKm, formatMinutes } from '../lib/format';
import { Card, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import type { RideType } from '@driver-profit/shared';

export function RideInputPage() {
  const navigate = useNavigate();
  const vehicle = useAppStore((s) => s.currentVehicle());
  const addRide = useAppStore((s) => s.addRide);
  const currency = useAppStore((s) => s.settings.currency);

  const [distance, setDistance] = useState('');
  const [payout, setPayout] = useState('');
  const [rideType, setRideType] = useState<RideType>('delivery');
  const [duration, setDuration] = useState('');
  const [lastAdded, setLastAdded] = useState<ReturnType<typeof addRide>>(null);

  const distanceNum = parseFloat(distance.replace(',', '.')) || 0;
  const payoutNum = parseFloat(payout.replace(',', '.')) || 0;
  const durationNum = duration ? parseFloat(duration.replace(',', '.')) || 0 : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicle || distanceNum <= 0 || payoutNum <= 0) return;
    const record = addRide({
      distanceKm: distanceNum,
      payout: payoutNum,
      rideType,
      durationMinutes: durationNum,
    });
    setLastAdded(record);
    setDistance('');
    setPayout('');
    setDuration('');
  };

  const handleAddAnother = () => {
    setLastAdded(null);
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

  if (lastAdded) {
    return (
      <div className="space-y-6">
        <Card>
          <div className="p-4 text-center">
            <p className="text-green-600 dark:text-green-400 text-2xl font-bold">
              Corrida registrada!
            </p>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Lucro líquido: {formatCurrency(lastAdded.netProfit, currency)}
            </p>
            <div className="flex gap-3 mt-6">
              <Button variant="secondary" fullWidth onClick={handleAddAnother}>
                Nova corrida
              </Button>
              <Button fullWidth onClick={() => navigate('/')}>
                Início
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title="Registrar corrida"
          subtitle="Dados da corrida ou entrega concluída."
        />
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Select<RideType>
            label="Tipo"
            value={rideType}
            options={[
              { value: 'delivery', label: 'Entrega' },
              { value: 'passenger', label: 'Passageiro' },
            ]}
            onChange={setRideType}
          />
          <Input
            label="Distância (km)"
            type="text"
            inputMode="decimal"
            placeholder="Ex: 5,2"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            required
          />
          <Input
            label="Valor recebido"
            type="text"
            inputMode="decimal"
            placeholder="Ex: 18,50"
            value={payout}
            onChange={(e) => setPayout(e.target.value)}
            required
          />
          <Input
            label="Tempo (min) — opcional"
            type="text"
            inputMode="numeric"
            placeholder="Ex: 25"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            disabled={distanceNum <= 0 || payoutNum <= 0}
          >
            Salvar corrida
          </Button>
        </form>
      </Card>
    </div>
  );
}
