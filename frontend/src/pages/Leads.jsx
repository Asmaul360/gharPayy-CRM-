import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, X, Trash2, Filter, ChevronRight, User } from 'lucide-react';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', phone: '', leadSource: 'website' });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = () => {
    axios.get('/api/leads')
      .then(res => setLeads(res.data))
      .catch(err => console.error(err));
  };

  const handleAddLead = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/leads', newLead);
      setShowAddModal(false);
      setNewLead({ name: '', phone: '', leadSource: 'website' });
      fetchLeads();
    } catch (err) {
      console.error(err);
      alert('Error adding lead');
    }
  };

  const handleDeleteLead = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await axios.delete(`/api/leads/${id}`);
      fetchLeads();
    } catch (err) {
      console.error(err);
      alert('Error deleting lead');
    }
  };

  const filteredLeads = (leads || []).filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.phone.includes(searchTerm);
    const matchesStatus = filterStatus === 'All' || lead.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New Lead': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Contacted': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Requirement Collected': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Property Suggested': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
      case 'Visit Scheduled': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Visit Completed': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'Booked': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Lost': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lead Directory</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track your customer relationships.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-gradient px-6 py-3 rounded-2xl font-bold flex items-center justify-center group"
        >
          <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform" /> 
          Add New Lead
        </button>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-slate-100 scale-in-center">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-900">Create Lead</h2>
                <p className="text-sm text-slate-500">Fill in the customer details below.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddLead} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                  value={newLead.name}
                  onChange={(e) => setNewLead({...newLead, name: e.target.value})}
                  placeholder="Rahul Sharma"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Phone Number</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({...newLead, phone: e.target.value})}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Source</label>
                <select 
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium appearance-none"
                  value={newLead.leadSource}
                  onChange={(e) => setNewLead({...newLead, leadSource: e.target.value})}
                >
                  <option value="website">Website</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="social">Social Media</option>
                  <option value="phone">Phone Call</option>
                  <option value="form">Lead Form</option>
                </select>
              </div>
              <button 
                type="submit" 
                className="w-full btn-gradient py-4 rounded-2xl font-black text-lg shadow-blue-500/20"
              >
                Launch Lead
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search leads by name, phone..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter size={18} className="text-slate-400" />
            <select 
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold text-slate-700 outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="New Lead">New Lead</option>
              <option value="Contacted">Contacted</option>
              <option value="Requirement Collected">Requirement Collected</option>
              <option value="Property Suggested">Property Suggested</option>
              <option value="Visit Scheduled">Visit Scheduled</option>
              <option value="Visit Completed">Visit Completed</option>
              <option value="Booked">Booked</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Lead Name</th>
                <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Contact</th>
                <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Origin</th>
                <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Stage</th>
                <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Assignee</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map(lead => (
                <tr key={lead._id} className={`group hover:bg-blue-50/30 transition-colors ${lead.followUpRequired ? 'bg-red-50/50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        <User size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{lead.name}</p>
                        {lead.followUpRequired && (
                          <span className="text-[10px] font-black text-red-500 uppercase tracking-tight">Requires Attention</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold text-slate-600">{lead.phone}</p>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-[11px] font-bold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-500 uppercase tracking-tighter">
                      {lead.leadSource}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1.5 text-[10px] font-black rounded-full border border-transparent shadow-sm uppercase tracking-wider ${getStatusStyle(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-2">
                       <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black border border-blue-100 shadow-sm">
                          {lead.assignedAgent?.name ? lead.assignedAgent.name.charAt(0) : '?'}
                       </div>
                       <p className="text-sm font-bold text-slate-700 leading-none">{lead.assignedAgent?.name || 'Unassigned'}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <a 
                        href={`/leads/${lead._id}`} 
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group/action"
                        title="View Details"
                      >
                        <ChevronRight size={20} className="group-hover/action:translate-x-1 transition-transform" />
                      </a>
                      <button 
                        onClick={() => handleDeleteLead(lead._id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete Lead"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center opacity-40">
                      <Search size={48} className="mb-4 text-slate-300" />
                      <p className="text-slate-500 font-bold">No leads matched your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leads;
