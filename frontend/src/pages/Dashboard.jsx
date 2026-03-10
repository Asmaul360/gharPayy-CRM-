import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  UserPlus, 
  CheckCircle, 
  TrendingUp, 
  Calendar, 
  ArrowUpRight,
  UserCheck
} from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalLeads: 0,
    newLeads: 0,
    bookedLeads: 0,
    totalVisits: 0,
    completedVisits: 0,
    pipeline: {},
    agentPerformance: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/dashboard/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { 
      label: 'Total Leads', 
      value: stats.totalLeads, 
      icon: <Users className="text-blue-600" />, 
      bg: 'bg-blue-50',
      trend: '+12%'
    },
    { 
      label: 'New Leads', 
      value: stats.newLeads, 
      icon: <UserPlus className="text-indigo-600" />, 
      bg: 'bg-indigo-50',
      trend: '5 New'
    },
    { 
      label: 'Scheduled Visits', 
      value: stats.totalVisits, 
      icon: <Calendar className="text-orange-600" />, 
      bg: 'bg-orange-50',
      trend: 'Check schedule'
    },
    { 
      label: 'Bookings', 
      value: stats.bookedLeads, 
      icon: <CheckCircle className="text-emerald-600" />, 
      bg: 'bg-emerald-50',
      trend: 'Goal: 10'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Today's quick summary.</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-3">
              <div className={`${card.bg} p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                {React.cloneElement(card.icon, { size: 24 })}
              </div>
              <ArrowUpRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{card.label}</h3>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-2xl font-black text-slate-900 tracking-tight">{card.value || 0}</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">{card.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pipeline Distribution */}
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
            <TrendingUp size={20} className="mr-2 text-blue-600" />
            Lead Pipeline
          </h3>
          <div className="space-y-5">
            {Object.entries(stats?.pipeline || {}).map(([status, count]) => (
              <div key={status} className="group">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-700">{status}</span>
                  <span className="font-bold text-blue-600">{count}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full group-hover:opacity-80 transition-all duration-500" 
                    style={{ width: `${(count / (stats.totalLeads || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {Object.keys(stats.pipeline).length === 0 && (
              <p className="text-sm text-slate-400 text-center py-8">No pipeline data yet.</p>
            )}
          </div>
        </div>

        {/* Agent Performance */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 pb-4 flex items-center justify-between border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <UserCheck size={20} className="mr-2 text-indigo-600" />
              Agent Performance
            </h3>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700">View Full Reports</button>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Agent</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Leads</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Visits</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Bookings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(stats?.agentPerformance || []).map((agent) => (
                  <tr key={agent._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shadow-sm">
                          {agent.name ? agent.name.charAt(0) : 'A'}
                        </div>
                        <span className="font-bold text-slate-700">{agent.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center font-semibold text-slate-600">{agent.leadsHandled}</td>
                    <td className="px-6 py-5 text-center font-semibold text-slate-600">{agent.visitsScheduled}</td>
                    <td className="px-8 py-5 text-right">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                        {agent.bookings} Booked
                      </span>
                    </td>
                  </tr>
                ))}
                {(stats?.agentPerformance?.length === 0) && (
                  <tr>
                    <td colSpan="4" className="px-8 py-12 text-center text-slate-400 italic">No agent performance data available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
