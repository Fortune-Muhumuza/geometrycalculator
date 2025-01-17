import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Circle, Triangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Type definitions for better type safety
type Shape = {
  type: string;
  surface: number;
  circumference: number;
  radius?: number;
  a?: number;
  b?: number;
  c?: number;
};

type HistoryItem = {
  shapeType: string;
  surface: number;
  circumference: number;
  calculatedAt: string;
  parameters: Record<string, number>;
};

const GeometryCalculator = () => {
  // Initialize states with proper types
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState<Record<string, any>>({});
  const [activeShape, setActiveShape] = useState<'circle' | 'triangle'>('circle');
  const [formData, setFormData] = useState({
    radius: '',
    a: '',
    b: '',
    c: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch history data
  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/history');
      if (!response.ok) throw new Error('Failed to fetch history');
      const data = await response.json();
      setHistory(data || []);
    } catch (error) {
      setError('Error fetching history');
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [circleStats, triangleStats] = await Promise.all([
        fetch('http://localhost:8000/api/stats/circle').then(res => res.json()),
        fetch('http://localhost:8000/api/stats/triangle').then(res => res.json())
      ]);
      setStats({
        circle: circleStats || {},
        triangle: triangleStats || {}
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const calculateShape = async () => {
    try {
      let url;
      if (activeShape === 'circle') {
        if (!formData.radius) {
          setError('Please enter a radius');
          return;
        }
        url = `http://localhost:8000/api/circle/${formData.radius}`;
      } else {
        if (!formData.a || !formData.b || !formData.c) {
          setError('Please enter all sides');
          return;
        }
        url = `http://localhost:8000/api/triangle/${formData.a}/${formData.b}/${formData.c}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Calculation failed');
      const data = await response.json();
      setShapes(prevShapes => [...prevShapes, data]);
      
      // Reset form and error
      setFormData({ radius: '', a: '', b: '', c: '' });
      setError(null);
      
      // Refresh history and stats
      fetchHistory();
      fetchStats();
    } catch (error) {
      setError('Error calculating shape');
      console.error('Error calculating shape:', error);
    }
  };

  // Format number helper function
  const formatNumber = (num: number | undefined): string => {
    return typeof num === 'number' ? num.toFixed(2) : 'N/A';
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shape Input Card */}
        <Card>
          <CardHeader>
            <CardTitle>Calculate Shape</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <button
                className={`flex items-center gap-2 p-2 rounded ${
                  activeShape === 'circle' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
                onClick={() => setActiveShape('circle')}
              >
                <Circle size={24} /> Circle
              </button>
              <button
                className={`flex items-center gap-2 p-2 rounded ${
                  activeShape === 'triangle' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
                onClick={() => setActiveShape('triangle')}
              >
                <Triangle size={24} /> Triangle
              </button>
            </div>

            {activeShape === 'circle' ? (
              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Radius"
                  className="w-full p-2 border rounded"
                  value={formData.radius}
                  onChange={(e) => setFormData({ ...formData, radius: e.target.value })}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="number"
                  placeholder="Side A"
                  className="w-full p-2 border rounded"
                  value={formData.a}
                  onChange={(e) => setFormData({ ...formData, a: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Side B"
                  className="w-full p-2 border rounded"
                  value={formData.b}
                  onChange={(e) => setFormData({ ...formData, b: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Side C"
                  className="w-full p-2 border rounded"
                  value={formData.c}
                  onChange={(e) => setFormData({ ...formData, c: e.target.value })}
                />
              </div>
            )}

            <button
              className="w-full mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
              onClick={calculateShape}
              disabled={loading}
            >
              {loading ? 'Calculating...' : 'Calculate'}
            </button>
          </CardContent>
        </Card>

        {/* Results Card */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Calculations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shapes.map((shape, index) => (
                <div key={index} className="p-4 border rounded">
                  <h3 className="font-bold capitalize">{shape.type}</h3>
                  <div>Surface: {formatNumber(shape.surface)}</div>
                  <div>Circumference: {formatNumber(shape.circumference)}</div>
                </div>
              ))}
              {shapes.length === 0 && (
                <div className="text-gray-500">No calculations yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length > 0 ? (
              <LineChart width={500} height={300} data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="calculatedAt" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="surface" stroke="#8884d8" name="Surface" />
                <Line type="monotone" dataKey="circumference" stroke="#82ca9d" name="Circumference" />
              </LineChart>
            ) : (
              <div className="text-gray-500">No data available for statistics</div>
            )}
          </CardContent>
        </Card>

        {/* History Card */}
        <Card>
          <CardHeader>
            <CardTitle>Calculation History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] overflow-y-auto space-y-2">
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : history.length > 0 ? (
                history.map((calc, index) => (
                  <div key={index} className="p-2 border rounded">
                    <div className="font-bold capitalize">{calc.shapeType}</div>
                    <div className="text-sm">
                      Surface: {formatNumber(calc.surface)} | 
                      Circumference: {formatNumber(calc.circumference)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(calc.calculatedAt).toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No calculation history</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeometryCalculator;