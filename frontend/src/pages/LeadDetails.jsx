import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Phone, 
  User, 
  Activity as ActivityIcon, 
  Calendar, 
  ArrowLeft, 
  Save, 
  UserCheck, 
  Edit3, 
  Layout, 
  Clock,
  Briefcase
} from 'lucide-react';

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState(null);
  const [agents, setAgents] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
  const [assignee, setAssignee] = useState('');
  
  const [visitProp, setVisitProp] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('');

  const statuses = [
    "New Lead", "Contacted", "Requirement Collected", 
    "Property Suggested", "Visit Scheduled", "Visit Completed", 
    "Booked", "Lost"
  ];

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const leadRes = await axios.get(`/api/leads/${id}`);
      setLead(leadRes.data);
      setNotes(leadRes.data.notes || '');
      setStatus(leadRes.data.status);
      setAssignee(leadRes.data.assignedAgent?._id || '');
      setLoading(false);

      axios.get('/api/agents')
        .then(res => setAgents(res.data))
        .catch(err => console.error('Error agents:', err));
        
      axios.get('/api/apartments')
        .then(res => setApartments(res.data))
        .catch(err => console.error('Error apts:', err));

      axios.get(`/api/visits`)
        .then(res => {
          const leadVisits = res.data.filter(v => v.leadId?._id === id || v.leadId === id);
          setVisits(leadVisits);
        })
        .catch(err => console.error('Error visits:', err));

    } catch (err) {
      console.error('Error lead:', err);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await axios.put(`/api/leads/${id}/status`, { status });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleReassign = async () => {
    if(!assignee) return;
    try {
      await axios.put(`/api/leads/${id}/assign`, { agentId: assignee });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleUpdateNotes = async () => {
    try {
      await axios.put(`/api/leads/${id}/notes`, { notes });
      alert('Updated!');
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleScheduleVisit = async (e) => {
    e.preventDefault();
    try {
      const agentJSON = localStorage.getItem('agent');
      let agentId = null;
      if (agentJSON) {
        const agentData = JSON.parse(agentJSON);
        agentId = agentData._id || agentData.id;
      }

      await axios.post('/api/visits', {
        leadId: id,
        propertyName: visitProp,
        visitDate,
        visitTime,
        scheduledByAgent: agentId
      });
      await axios.put(`/api/leads/${id}/status`, { status: 'Visit Scheduled' });
      setVisitProp(''); setVisitDate(''); setVisitTime('');
      fetchData();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="p-12 text-center font-black text-slate-300 uppercase tracking-widest">Processing...</div>;
  if (!lead) return <div className="p-12 text-center text-red-500 font-bold">Data Mismatch: Lead not found</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
         <button onClick={() => navigate(-1)} className="p-2 bg-white text-slate-400 hover:text-blue-600 rounded-2xl shadow-sm border border-slate-200 transition-all flex items-center space-x-2 pr-4">
           <ArrowLeft size={18} />
           <span className="text-xs font-black uppercase tracking-widest">Dashboard</span>
         </button>
         <div className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-200 shadow-sm shadow-emerald-500/10">
            Active Profile
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Profile Info & Quick Actions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
               <User size={80} />
            </div>
            
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/20 mb-3 flex items-center justify-center border-4 border-white">
                <span className="text-white text-2xl font-black">{lead?.name?.charAt(0) || '?'}</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 leading-tight">{lead?.name}</h2>
              <p className="text-blue-600 font-bold text-[10px] bg-blue-50 px-2.5 py-0.5 rounded-full mt-1.5 inline-block border border-blue-100">
                {lead?.status}
              </p>
            </div>

            <div className="space-y-4 p-5 bg-slate-50 rounded-3xl border border-slate-100">
              <div className="flex items-center space-x-3 text-slate-600">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-blue-500 border border-slate-100">
                  <Phone size={14} />
                </div>
                <span className="font-bold text-sm tracking-tight">{lead.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600">
                <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-indigo-500 border border-slate-100">
                  <Briefcase size={14} />
                </div>
                <span className="font-bold text-xs uppercase tracking-tight text-slate-500">Source: <span className="text-slate-900 font-black">{lead.leadSource}</span></span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Lifecycle Stage</label>
                <div className="flex gap-2">
                   <select 
                    className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-900 font-bold text-xs focus:ring-2 focus:ring-blue-500/10 outline-none"
                    value={status} onChange={(e) => setStatus(e.target.value)}
                  >
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={handleUpdateStatus} className="p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
                    <UserCheck size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-1">Assigned Executive</label>
                <div className="flex gap-2">
                   <select 
                    className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-900 font-bold text-xs focus:ring-2 focus:ring-blue-500/10 outline-none"
                    value={assignee} onChange={(e) => setAssignee(e.target.value)}
                  >
                    {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                  </select>
                  <button onClick={handleReassign} className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
                    <Edit3 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-xl text-white">
            <h3 className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-slate-400">
              <Calendar size={12} className="mr-2 text-blue-400" /> 
              Prop-View Scheduler
            </h3>
            <form onSubmit={handleScheduleVisit} className="space-y-4">
              <select required className="w-full bg-slate-800 border-none px-5 py-3 rounded-2xl text-slate-200 font-bold text-sm focus:ring-2 focus:ring-blue-500/30 outline-none" value={visitProp} onChange={e => setVisitProp(e.target.value)}>
                <option value="">Choose Unit</option>
                {apartments.map(apt => (
                  <option key={apt._id} value={apt.name}>{apt.name}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <input required type="date" className="flex-1 bg-slate-800 border-none px-4 py-3 rounded-2xl text-slate-200 font-bold text-xs outline-none" value={visitDate} onChange={e=>setVisitDate(e.target.value)} />
                <input required type="time" className="flex-1 bg-slate-800 border-none px-4 py-3 rounded-2xl text-slate-200 font-bold text-xs outline-none" value={visitTime} onChange={e=>setVisitTime(e.target.value)} />
              </div>
              <button type="submit" className="w-full btn-gradient py-3.5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-blue-500/20 mt-4">
                Confirm Appointment
              </button>
            </form>
          </div>
        </div>

        {/* Right Columns - Activity & Detailed Records */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Notes Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center">
                  <Edit3 size={16} className="mr-2.5 text-blue-600" />
                  Experience Notes
               </h3>
               <button onClick={handleUpdateNotes} className="flex items-center space-x-1.5 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors">
                  <Save size={12} /> <span>Save Log</span>
               </button>
            </div>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-700 font-medium text-xs focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500/50 outline-none transition-all resize-none" 
              rows="3" value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Start logging customer feedback or specific requirements..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Timeline */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center">
                <ActivityIcon size={18} className="mr-3 text-indigo-600" />
                Audit Trail
              </h3>
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[0.8rem] before:h-full before:w-0.5 before:bg-slate-100">
                {lead.activities && lead.activities.length > 0 ? lead.activities.map((act, idx) => (
                  <div key={idx} className="relative pl-10 group">
                    <div className="absolute left-0 top-1 w-7 h-7 bg-white border-2 border-slate-200 rounded-xl group-hover:border-blue-500 group-hover:bg-blue-50 transition-all flex items-center justify-center">
                       <Clock size={10} className="text-slate-400 group-hover:text-blue-600" />
                    </div>
                    <div className="flex flex-col">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                          {new Date(act.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                       </p>
                       <p className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-tight">{act.action}</p>
                       <p className="text-xs font-medium text-slate-500 italic bg-slate-50 px-3 py-2 rounded-xl">"{act.note}"</p>
                    </div>
                  </div>
                )) : <p className="text-center text-slate-300 font-bold uppercase text-[10px] py-12 tracking-widest border border-dashed border-slate-200 rounded-3xl">Clean Trail</p>}
              </div>
            </div>

            {/* Visits List */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-200">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-8 flex items-center">
                <Layout size={18} className="mr-3 text-emerald-600" />
                Prop Visits
              </h3>
              <div className="space-y-4">
                {visits.length > 0 ? visits.map((v, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 rounded-[1.8rem] border border-slate-100 hover:border-blue-200 transition-colors group">
                    <div className="flex justify-between items-start mb-3">
                       <p className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tighter">{v.propertyName}</p>
                       <span className={`px-2 py-0.5 text-[8px] font-black rounded-lg uppercase tracking-widest ${
                         v.visitOutcome === 'Pending' ? 'bg-amber-100 text-amber-700' : 
                         v.visitOutcome === 'Booked' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                       }`}>
                         {v.visitOutcome}
                       </span>
                    </div>
                    <div className="flex items-center space-x-4 text-[10px] font-bold text-slate-400">
                       <span className="flex items-center"><Calendar size={12} className="mr-1" /> {v.visitDate}</span>
                       <span className="flex items-center"><Clock size={12} className="mr-1" /> {v.visitTime}</span>
                    </div>
                  </div>
                )) : <p className="text-center text-slate-300 font-bold uppercase text-[10px] py-12 tracking-widest border border-dashed border-slate-200 rounded-3xl">No Tours</p>}
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default LeadDetails;
