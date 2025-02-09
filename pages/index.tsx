import { useState } from 'react';
import dynamic from 'next/dynamic';

interface Product {
  category: string;
  power: number;
  hours: number;
  pricePerUnit: number;
}

const DynamicPieChart = dynamic(
  () => import('../components/EnergyChart').then((mod) => mod.PieChart),
  { ssr: false, loading: () => <div>Loading...</div> }
);

const DynamicBarChart = dynamic(
  () => import('../components/EnergyChart').then((mod) => mod.BarChart),
  { ssr: false, loading: () => <div>Loading...</div> }
);

export default function EnergyCalculator() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    category: 'light',
    power: 0,
    hours: 0,
    pricePerUnit: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProducts(prev => [...prev, formData]);
    setFormData({
      category: 'light',
      power: 0,
      hours: 0,
      pricePerUnit: 0
    });
  };

  const calculateEnergy = (): Record<string, { energy: number; cost: number }> => {
    return products.reduce((acc, product) => {
      const energy = (product.power * product.hours) / 1000; // kWh
      const cost = energy * product.pricePerUnit;
      
      acc[product.category] = {
        energy: (acc[product.category]?.energy || 0) + energy,
        cost: (acc[product.category]?.cost || 0) + cost
      };
      return acc;
    }, {} as Record<string, { energy: number; cost: number }>);
  };

  const getChartData = () => {
    const energyData = calculateEnergy();
    const categories = Object.keys(energyData);

    return {
      pieData: {
        labels: categories,
        datasets: [{
          label: 'Energy Consumption (kWh)',
          data: categories.map(cat => energyData[cat].energy),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }]
      },
      barData: {
        labels: categories,
        datasets: [{
          label: 'Daily Cost',
          data: categories.map(cat => energyData[cat].cost),
          backgroundColor: ['#36A2EB', '#4BC0C0', '#FFCE56', '#FF6384']
        }]
      }
    };
  };

  const { pieData, barData } = getChartData();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Energy Calculator</h1>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                className="w-full p-2 border rounded"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="light">Light</option>
                <option value="fan">Fan</option>
                <option value="tv">TV</option>
                <option value="ac">AC</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Power (W)</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={formData.power || ''}
                onChange={e => setFormData({...formData, power: Number(e.target.value)})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Daily Usage (hours)</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={formData.hours || ''}
                onChange={e => setFormData({...formData, hours: Number(e.target.value)})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Price per Unit ($)</label>
              <input
                type="number"
                step="0.01"
                className="w-full p-2 border rounded"
                value={formData.pricePerUnit || ''}
                onChange={e => setFormData({...formData, pricePerUnit: Number(e.target.value)})}
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add Device
          </button>
        </form>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Energy Distribution</h2>
            <div className="h-64">
              <DynamicPieChart data={pieData} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Cost Comparison</h2>
            <div className="h-64">
              <DynamicBarChart data={barData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}