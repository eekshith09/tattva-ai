import React from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button } from '../components/Common';
import { 
  TrendingUp, 
  Zap, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const Dashboard = () => {
  const { user, history } = useApp();

  const stats = [
    { label: 'Total XP', value: user?.xp, icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { label: 'Tasks Done', value: history.length, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { label: 'Daily Streak', value: `${user?.dailyStreak} Days`, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
  ];

  const chartData = [
    { name: 'Mon', xp: 40 },
    { name: 'Tue', xp: 30 },
    { name: 'Wed', xp: 20 },
    { name: 'Thu', xp: 60 },
    { name: 'Fri', xp: 80 },
    { name: 'Sat', xp: 45 },
    { name: 'Sun', xp: user?.dailyStreak ? user.xp % 100 : 10 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400">Track your progress and access AI tools.</p>
        </div>
        <Link to="/text-summary">
          <Button>
            New Project <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <Card key={idx} className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-6">Weekly Activity (XP)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="xp" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#8b5cf6" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent History */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent</h3>
            <Link to="/history" className="text-sm text-purple-600 hover:text-purple-700 font-medium">View all</Link>
          </div>
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No activity yet. Try a tool!</p>
            ) : (
              history.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-start space-x-3 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 dark:text-purple-300">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{item.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};