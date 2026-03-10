import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, MapPin, CheckCircle, XCircle, Calendar, User, ChevronRight } from 'lucide-react';

const Visits = () => {
  const [visits, setVisits] = useState([]);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = () => {
    axios.get('/api/visits')
      .then(res => setVisits(res.data))
      .catch(err => console.error(err));
  };

  const currentUpcoming = (visits || []).filter(v => v.visitOutcome === 'Pending');
  const pastVisits = (visits || []).filter(v => v.visitOutcome !== 'Pending');

  const updateOutcome = async (id, outcome) => {
    try {
      await axios.put(`/api/visits/${id}/outcome`, { outcome });
      fetchVisits();
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || 'Failed to update visit outcome';
      alert(errorMsg);
    }
  };

  const getOutcomeStyle = (outcome) => {
    switch (outcome) {
      case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Booked': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Interested': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Not Interested': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const VisitCard = ({ visit }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-4 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center font-bold shadow-sm group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg leading-tight group-hover:text-blue-700 transition-colors uppercase tracking-tight">
                {visit.propertyName}
              </h3>
              <div className="flex items-center mt-1 space-x-2">
                 <User size={12} className="text-slate-400" />
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                   {visit.leadId?.name || 'Unknown Lead'}
                 </p>
              </div>
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <span className={`px-4 py-1.5 text-[10px] font-black rounded-full border shadow-sm uppercase tracking-[0.1em] ${getOutcomeStyle(visit.visitOutcome)}`}>
            {visit.visitOutcome}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
        <div className="flex items-center space-x-3 text-slate-600">
          <Clock size={16} className="text-blue-500" />
          <span className="font-bold">{visit.visitDate} <span className="text-slate-400 font-medium">@</span> {visit.visitTime}</span>
        </div>
        <div className="flex items-center space-x-3 text-slate-600">
          <User size={16} className="text-indigo-500" />
          <span className="font-bold text-slate-500">Agent: <span className="text-slate-900">{visit.scheduledByAgent?.name || 'Unassigned'}</span></span>
        </div>
      </div>

      {visit.visitOutcome === 'Pending' && (
        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-50">
          <button 
            onClick={() => updateOutcome(visit._id, 'Interested')} 
            className="flex-1 min-w-[100px] bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center transition-all"
          >
             <CheckCircle size={14} className="mr-2" /> Interested
          </button>
          <button 
            onClick={() => updateOutcome(visit._id, 'Not Interested')} 
            className="flex-1 min-w-[100px] bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-600 font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center transition-all"
          >
             <XCircle size={14} className="mr-2" /> Not Interested
          </button>
          <button 
            onClick={() => updateOutcome(visit._id, 'Booked')} 
            className="flex-1 min-w-[100px] bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center transition-all shadow-sm shadow-emerald-500/10"
          >
             <CheckCircle size={14} className="mr-2" /> Mark Booked
          </button>
        </div>
      )}
      
      {visit.leadId && (
        <div className="mt-4 text-right">
           <a href={`/leads/${visit.leadId._id}`} className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase flex items-center justify-end group/link transition-all">
              Lead Details <ChevronRight size={14} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
           </a>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Visit Management</h1>
        <p className="text-slate-400 mt-0.5 uppercase text-[9px] font-bold tracking-widest">Track property viewings & outcomes</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xs font-black text-slate-400 mb-6 flex items-center uppercase tracking-[0.3em]">
            <span className="bg-amber-100 text-amber-600 p-2.5 rounded-2xl mr-4 shadow-sm shadow-amber-500/20">
              <Clock size={16} />
            </span>
            Pending Actions
          </h2>
          <div className="space-y-2">
            {currentUpcoming.length > 0 ? currentUpcoming.map(v => <VisitCard key={v._id} visit={v} />) : (
              <div className="text-slate-400 text-sm font-bold p-12 bg-white rounded-[2rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center opacity-40">
                <Calendar size={32} className="mb-4" />
                No pending visits.
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-xs font-black text-slate-400 mb-6 flex items-center uppercase tracking-[0.3em]">
            <span className="bg-slate-100 text-slate-500 p-2.5 rounded-2xl mr-4 shadow-sm">
              <CheckCircle size={16} />
            </span>
            History Log
          </h2>
          <div className="space-y-2">
            {pastVisits.length > 0 ? pastVisits.slice(0, 5).map(v => <VisitCard key={v._id} visit={v} />) : (
              <div className="text-slate-400 text-sm font-bold p-12 bg-white rounded-[2rem] border-2 border-dashed border-slate-100 text-center flex flex-col items-center opacity-40">
                <Clock size={32} className="mb-4" />
                History is empty.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visits;
