import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { CheckCircle2, BookOpen, Clock } from 'lucide-react';

/**
 * Dashboard page displaying aggregated statistics and a progress chart
 * of tasks and subjects for the currently logged-in user.
 */
export default function Dashboard() {
  const { token, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    /**
     * Fetches dashboard data concurrently using Promise.all to load tasks and subjects
     */
    const fetchDashboardData = async () => {
      try {
        const [tasksRes, subjectsRes] = await Promise.all([
          fetch('/api/tasks', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/subjects', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        
        if (tasksRes.ok) setTasks(await tasksRes.json());
        if (subjectsRes.ok) setSubjects(await subjectsRes.json());
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      }
    };
    fetchDashboardData();
  }, [token]);

  // Statistics Calculation
  const tasksDone = tasks.filter(t => t.completed).length;
  const subjectsCount = subjects.length;
  const totalTasks = tasks.length;
  
  // "Hours Studied" uses a dummy logic based on tasks done * 0.5 hours
  const hoursStudied = (tasksDone * 0.5).toFixed(1); 

  // Format data for Recharts (Completed vs Pending per Subject)
  const chartData = subjects.map(sub => {
    const subjectTasks = tasks.filter(t => t.subject?._id === sub._id);
    const completed = subjectTasks.filter(t => t.completed).length;
    const pending = subjectTasks.length - completed;
    return {
      name: sub.name,
      completed,
      pending,
      color: sub.color
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      <header className="mb-0 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded text-[10px] font-bold uppercase">Overview</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome, {user?.name}</h1>
          <p className="text-xs text-slate-500 mt-1 font-semibold tracking-wide">Here is a summary of your study progress.</p>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Tasks Done</span>
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded"><CheckCircle2 className="w-4 h-4 inline" /></span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-black">{totalTasks > 0 ? Math.round((tasksDone / totalTasks) * 100) : 0}%</span>
              <span className="text-xs opacity-80">Complete</span>
            </div>
            <div className="h-2 w-full bg-indigo-900/30 rounded-full overflow-hidden mt-4">
              <div 
                className="h-full bg-white rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(255,255,255,0.4)]" 
                style={{ width: `${totalTasks > 0 ? (tasksDone / totalTasks) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Active Subjects</span>
            <div className="p-1.5 bg-slate-50 text-slate-500 rounded-lg border border-slate-100">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-4xl font-black text-slate-800">{subjectsCount}</span>
            <p className="text-xs text-slate-500 font-semibold tracking-wide mt-1">Enrolled</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Hours Studied</span>
            <div className="p-1.5 bg-slate-50 text-slate-500 rounded-lg border border-slate-100">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-4xl font-black text-slate-800">{hoursStudied}</span>
            <p className="text-xs text-slate-500 font-semibold tracking-wide mt-1">Estimated hours</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-2xl flex flex-col">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Subject Progress</h2>
            <p className="text-[11px] text-slate-500">Tasks completion status per subject</p>
          </div>
        </div>
        
        <div className="p-6">
          {subjects.length > 0 ? (
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }} barSize={32}>
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                    axisLine={{ stroke: '#cbd5e1' }}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ backgroundColor: '#ffffff', color: '#0f172a', borderColor: '#e2e8f0', shadow: 'sm', borderRadius: '12px', fontWeight: 'bold', fontSize: '12px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b' }} />
                  <Bar dataKey="completed" name="Completed Tasks" stackId="a">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-comp-${index}`} fill={entry.color || '#4f46e5'} />
                    ))}
                  </Bar>
                  <Bar dataKey="pending" name="Pending Tasks" stackId="a">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-pend-${index}`} fill={entry.color || '#4f46e5'} opacity={0.2} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400">
              <BookOpen className="h-10 w-10 mb-3 opacity-20" />
              <p className="text-sm font-semibold">No data to display. Add subjects and tasks to see your progress.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
