import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  type VehicleType,
  type FuelType,
  type VehicleProfile,
} from '@driver-profit/shared';
import { useAppStore } from '../store/useAppStore';
import { Card, CardHeader } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';

const VEHICLE_TYPES: { value: VehicleType; label: string }[] = [
  { value: 'car', label: 'Carro' },
  { value: 'motorcycle', label: 'Moto' },
  { value: 'bicycle', label: 'Bicicleta' },
];

const FUEL_TYPES: { value: FuelType; label: string }[] = [
  { value: 'gasoline', label: 'Gasolina' },
  { value: 'ethanol', label: 'Etanol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'cng', label: 'GNV' },
  { value: 'electric', label: 'Elétrico' },
  { value: 'none', label: 'Nenhum (bike)' },
];

export function VehiclePage() {
  const navigate = useNavigate();
  const vehicles = useAppStore((s) => s.vehicles);
  const currentVehicle = useAppStore((s) => s.currentVehicle());
  const settings = useAppStore((s) => s.settings);
  const addVehicle = useAppStore((s) => s.addVehicle);
  const updateVehicle = useAppStore((s) => s.updateVehicle);
  const deleteVehicle = useAppStore((s) => s.deleteVehicle);
  const setSettings = useAppStore((s) => s.setSettings);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('motorcycle');
  const [fuelType, setFuelType] = useState<FuelType>('gasoline');
  const [fuelPrice, setFuelPrice] = useState('');
  const [consumption, setConsumption] = useState('');
  const [maintenance, setMaintenance] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setVehicleType('motorcycle');
    setFuelType('gasoline');
    setFuelPrice('');
    setConsumption('');
    setMaintenance('');
  };

  const startEdit = (v: VehicleProfile) => {
    setEditingId(v.id);
    setName(v.name);
    setVehicleType(v.vehicleType);
    setFuelType(v.fuelType);
    setFuelPrice(String(v.fuelPricePerLiter));
    setConsumption(String(v.consumptionKmPerLiter));
    setMaintenance(String(v.maintenanceCostPerKm));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fuelNum = parseFloat(fuelPrice.replace(',', '.')) || 0;
    const consNum = parseFloat(consumption.replace(',', '.')) || 0;
    const maintNum = parseFloat(maintenance.replace(',', '.')) || 0;

    if (editingId) {
      updateVehicle(editingId, {
        name: name || 'Veículo',
        vehicleType,
        fuelType,
        fuelPricePerLiter: fuelNum,
        consumptionKmPerLiter: consNum,
        maintenanceCostPerKm: maintNum,
      });
      resetForm();
      return;
    }

    addVehicle({
      name: name || 'Veículo',
      vehicleType,
      fuelType,
      fuelPricePerLiter: fuelNum,
      consumptionKmPerLiter: consNum,
      maintenanceCostPerKm: maintNum,
    });
    resetForm();
    if (vehicles.length === 0) navigate('/');
  };

  const handleDelete = (id: string) => {
    if (confirm('Remover este veículo? As corridas continuarão no histórico.')) {
      deleteVehicle(id);
      resetForm();
    }
  };

  const showFuel = fuelType !== 'none' && fuelType !== 'electric';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader
          title={editingId ? 'Editar veículo' : 'Novo veículo'}
          subtitle="Consumo e custos para calcular o lucro real."
        />
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Input
            label="Nome (ex: Moto iFood)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Meu veículo"
          />
          <Select<VehicleType>
            label="Tipo"
            value={vehicleType}
            options={VEHICLE_TYPES}
            onChange={setVehicleType}
          />
          <Select<FuelType>
            label="Combustível"
            value={fuelType}
            options={FUEL_TYPES}
            onChange={setFuelType}
          />
          {showFuel && (
            <>
              <Input
                label="Preço do litro"
                type="text"
                inputMode="decimal"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
                placeholder="5,89"
              />
              <Input
                label="Consumo (km/l)"
                type="text"
                inputMode="decimal"
                value={consumption}
                onChange={(e) => setConsumption(e.target.value)}
                placeholder="30"
                hint="Quantos km por litro"
              />
            </>
          )}
          <Input
            label="Custo manutenção por km"
            type="text"
            inputMode="decimal"
            value={maintenance}
            onChange={(e) => setMaintenance(e.target.value)}
            placeholder="0,15"
            hint="Estimativa: pneus, óleo, revisão etc."
          />
          <div className="flex gap-3">
            {editingId && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => resetForm()}
                className="flex-1"
              >
                Cancelar
              </Button>
            )}
            <Button type="submit" fullWidth={!editingId} className={editingId ? 'flex-1' : ''}>
              {editingId ? 'Salvar' : 'Cadastrar'}
            </Button>
          </div>
        </form>
      </Card>

      {vehicles.length > 0 && (
        <Card>
          <CardHeader title="Seus veículos" />
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {vehicles.map((v) => (
              <li
                key={v.id}
                className="px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {v.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {VEHICLE_TYPES.find((t) => t.value === v.vehicleType)?.label}{' '}
                    · {FUEL_TYPES.find((t) => t.value === v.fuelType)?.label}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="activeVehicle"
                    checked={settings.vehicleId === v.id}
                    onChange={() => setSettings({ vehicleId: v.id })}
                    className="w-5 h-5"
                  />
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => startEdit(v)}
                    className="min-w-0 p-2"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={() => handleDelete(v.id)}
                    className="min-w-0 p-2 text-red-600 dark:text-red-400"
                  >
                    Excluir
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
