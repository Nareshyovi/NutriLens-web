'use client'

import { Card } from '@/components/ui/Card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';

export default function ProgressCharts({ weightLogs, targetWeight }: { weightLogs: any[], targetWeight: number | null }) {
  
  // Format data for Recharts
  const data = weightLogs.map(log => ({
    date: new Date(log.logged_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: Number(log.weight_kg),
  }));

  // Ensure there's enough data for a meaningful chart, or mock it if empty for UI design verification
  const displayData = data.length > 0 ? data : [
    { date: 'Sep 25', weight: 75.2 },
    { date: 'Sep 27', weight: 74.8 },
    { date: 'Sep 29', weight: 74.5 },
    { date: 'Oct 01', weight: 74.1 }
  ];

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-5 flex flex-col gap-4">
        <h2 className="font-bold text-lg">Weight Trend (30 Days)</h2>
        
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)' }} 
                dy={10}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)' }}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                itemStyle={{ color: 'var(--color-primary)' }}
              />
              {targetWeight && (
                <ReferenceLine 
                  y={targetWeight} 
                  stroke="var(--color-secondary)" 
                  strokeDasharray="3 3" 
                  label={{ position: 'top', value: 'Target', fill: 'var(--color-secondary)', fontSize: 10, fontWeight: 'bold' }}
                />
              )}
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ r: 4, fill: 'var(--color-surface)', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: 'var(--color-primary)', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {data.length === 0 && (
          <p className="text-xs text-center text-[var(--color-outline)]">Showing sample data. Log weight to see your trend.</p>
        )}
      </Card>
      
      {/* Mock Adherence Chart */}
      <Card className="p-5 flex flex-col gap-4">
        <h2 className="font-bold text-lg">Calorie Adherence</h2>
        <div className="flex justify-between items-end h-[150px] px-2 gap-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
            const h = Math.random() * 80 + 20; // 20% to 100%
            const isOver = h > 80;
            return (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full bg-[rgba(34,160,107,0.1)] rounded-full h-full flex items-end overflow-hidden relative">
                  {/* Target line */}
                  <div className="absolute top-[20%] left-0 right-0 border-t-2 border-dashed border-[var(--color-outline)] z-10"></div>
                  
                  <div 
                    className={`w-full rounded-full transition-all duration-1000 ${isOver ? 'bg-[var(--color-secondary)]' : 'bg-[var(--color-primary)]'}`} 
                    style={{ height: `${h}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-[var(--color-on-surface-variant)]">{day}</span>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  );
}
