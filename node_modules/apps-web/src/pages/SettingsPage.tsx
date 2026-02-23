import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Card, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';

export function SettingsPage() {
  const settings = useAppStore((s) => s.settings);
  const setSettings = useAppStore((s) => s.setSettings);
  const setDailyGoal = useAppStore((s) => s.setDailyGoal);
  const setWorthItThresholds = useAppStore((s) => s.setWorthItThresholds);

  const [goal, setGoal] = useState(String(settings.dailyGoal.targetNetProfit));
  const [minNet, setMinNet] = useState(String(settings.worthItThresholds.minNetProfit));
  const [minPerKm, setMinPerKm] = useState(String(settings.worthItThresholds.minProfitPerKm));
  const [minPerHour, setMinPerHour] = useState(String(settings.worthItThresholds.minProfitPerHour));

  const saveGoal = () => {
    const n = parseFloat(goal.replace(',', '.')) || 0;
    if (n >= 0) setDailyGoal({ ...settings.dailyGoal, targetNetProfit: n });
  };

  const saveThresholds = () => {
    setWorthItThresholds({
      minNetProfit: parseFloat(minNet.replace(',', '.')) || 0,
      minProfitPerKm: parseFloat(minPerKm.replace(',', '.')) || 0,
      minProfitPerHour: parseFloat(minPerHour.replace(',', '.')) || 0,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader title="Aparência" />
        <div className="p-4">
          <Select<'light' | 'dark' | 'system'>
            label="Tema"
            value={settings.theme}
            options={[
              { value: 'system', label: 'Sistema' },
              { value: 'light', label: 'Claro' },
              { value: 'dark', label: 'Escuro' },
            ]}
            onChange={(theme) => setSettings({ theme })}
          />
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Meta diária"
          subtitle="Quanto você quer lucrar por dia (líquido)."
        />
        <div className="p-4 space-y-4">
          <Input
            label="Meta (valor)"
            type="text"
            inputMode="decimal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <Button variant="secondary" fullWidth onClick={saveGoal}>
            Salvar meta
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Vale a pena? — Mínimos"
          subtitle="Corrida só é 'vale a pena' se passar em todos."
        />
        <div className="p-4 space-y-4">
          <Input
            label="Lucro líquido mínimo"
            type="text"
            inputMode="decimal"
            value={minNet}
            onChange={(e) => setMinNet(e.target.value)}
          />
          <Input
            label="Lucro mínimo por km"
            type="text"
            inputMode="decimal"
            value={minPerKm}
            onChange={(e) => setMinPerKm(e.target.value)}
          />
          <Input
            label="Lucro mínimo por hora (0 = ignorar)"
            type="text"
            inputMode="decimal"
            value={minPerHour}
            onChange={(e) => setMinPerHour(e.target.value)}
          />
          <Button variant="secondary" fullWidth onClick={saveThresholds}>
            Salvar mínimos
          </Button>
        </div>
      </Card>
    </div>
  );
}
