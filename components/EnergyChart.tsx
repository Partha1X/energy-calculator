import { Pie, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement,
  Title 
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor?: string;
    borderWidth?: number;
  }[];
}

export const PieChart = ({ data }: { data: ChartData }) => (
  <Pie data={data} />
);

export const BarChart = ({ data }: { data: ChartData }) => (
  <Bar data={data} options={{ responsive: true }} />
);