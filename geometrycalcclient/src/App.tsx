import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Circle, Triangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const GeometryCalculator = () => {
  const [shapes, setShapes] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({});
  const [activeShape, setActiveShape] = useState('circle');
  const [formData, setFormData] = useState({
    radius: '',
    a: '', b: '', c: ''
  });

  // Fetch history data
  useEffect(() => {
    fetchHistory();
    fetchStats();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/history');
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const circleStats = await fetch('http://localhost:8000/api/stats/circle');
      const triangleStats = await fetch('http://localhost:8000/api/stats/triangle');
      const [circleData, triangleData] = await Promise.all([
        circleStats.json(),
        triangleStats.json()
      ]);
      setStats({ circle: circleData, triangle: triangleData });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const calculateShape = async () => {
    try {
      let url;
      if (activeShape === 'circle') {
        url = `http://localhost:8000/api/circle/${formData.radius}`;
      } else {
        url = `http://localhost:8000/api/triangle/${formData.a}/${formData.b}/${formData.c}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setShapes([...shapes, data]);
      
      // Refresh history and stats
      fetchHistory();
      fetchStats();
    } catch (error) {
      console.error('Error calculating shape:', error);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
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
              className="w-full mt-4 p-2 bg-blue-500 text-white rounded"
              onClick={calculateShape}
            >
              Calculate
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
                  <div>Surface: {shape.surface.toFixed(2)}</div>
                  <div>Circumference: {shape.circumference.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart width={500} height={300} data={history}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="calculatedAt" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="surface" stroke="#8884d8" name="Surface" />
              <Line type="monotone" dataKey="circumference" stroke="#82ca9d" name="Circumference" />
            </LineChart>
          </CardContent>
        </Card>

        {/* History Card */}
        <Card>
          <CardHeader>
            <CardTitle>Calculation History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] overflow-y-auto space-y-2">
              {history.map((calc, index) => (
                <div key={index} className="p-2 border rounded">
                  <div className="font-bold capitalize">{calc.shapeType}</div>
                  <div className="text-sm">
                    Surface: {calc.surface} | 
                    Circumference: {calc.circumference.toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(calc.calculatedAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GeometryCalculator;