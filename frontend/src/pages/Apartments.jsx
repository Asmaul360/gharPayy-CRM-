import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, X, Home, MapPin, DollarSign, Users, Trash2, Edit2, Info, LayoutGrid } from 'lucide-react';

const Apartments = () => {
  const [apartments, setApartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newApartment, setNewApartment] = useState({
    name: '',
    location: '',
    price: '',
    type: 'Single',
    status: 'Available',
    roomSize: '',
    description: ''
  });

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = () => {
    axios.get('/api/apartments')
      .then(res => setApartments(res.data))
      .catch(err => console.error(err));
  };

  const handleAddApartment = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/apartments/${editingId}`, newApartment);
      } else {
        await axios.post('/api/apartments', newApartment);
      }
      setShowAddModal(false);
      setIsEditing(false);
      setEditingId(null);
      setNewApartment({ name: '', location: '', price: '', type: 'Single', status: 'Available', roomSize: '', description: '' });
      fetchApartments();
    } catch (err) {
      console.error(err);
      alert(`Error updating: ` + (err.response?.data?.error || err.message));
    }
  };

  const handleEditClick = (apt) => {
    setNewApartment({
      name: apt.name,
      location: apt.location,
      price: apt.price,
      type: apt.type,
      status: apt.status,
      roomSize: apt.roomSize || '',
      description: apt.description || ''
    });
    setEditingId(apt._id);
    setIsEditing(true);
    setShowAddModal(true);
  };

  const handleDeleteApartment = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await axios.delete(`/api/apartments/${id}`);
      fetchApartments();
    } catch (err) {
      console.error(err);
      alert('Error deleting');
    }
  };

  const filteredApartments = (apartments || []).filter(apt => 
    (apt.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (apt.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Inventory</h1>
          <p className="text-slate-400 mt-1 uppercase text-[10px] font-bold tracking-widest">Manage properties & unit availability</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-gradient px-6 py-3 rounded-2xl font-bold flex items-center shadow-lg shadow-blue-500/20 group"
        >
          <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform" /> 
          Add New Unit
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Filter units by name, sector or location..." 
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-600 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApartments.map(apt => (
            <div key={apt._id} className="group bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-125 transition-transform pointer-events-none">
                  <Home size={120} />
               </div>
               
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Home size={20} />
                </div>
                <div className="flex space-x-2">
                   <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider border shadow-sm ${
                    apt.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                    apt.status === 'Full' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                  }`}>
                    {apt.status}
                  </span>
                  <div className="flex space-x-1">
                    <button onClick={() => handleEditClick(apt)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteApartment(apt._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-blue-700 transition-colors uppercase tracking-tight">{apt.name}</h3>
              <div className="flex items-center text-slate-500 text-xs font-bold mb-4 uppercase tracking-tighter">
                <MapPin size={14} className="mr-1 text-slate-300" /> {apt.location}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-2.5 py-1 rounded-lg uppercase tracking-widest border border-slate-200/50 flex items-center">
                    <LayoutGrid size={10} className="mr-1" /> {apt.type}
                  </span>
                  {apt.roomSize && (
                    <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg uppercase tracking-widest border border-indigo-100 flex items-center">
                      <Info size={10} className="mr-1" /> {apt.roomSize}
                    </span>
                  )}
              </div>

              <div className="flex justify-between items-center pt-5 border-t border-slate-50">
                <div className="flex items-baseline font-black text-slate-900 text-lg tracking-tight">
                  <span className="text-slate-400 text-xs font-bold mr-0.5 whitespace-nowrap">₹</span> 
                  {apt.price.toLocaleString()}
                  <span className="text-[10px] font-black text-slate-400 ml-1 uppercase tracking-widest">/ Month</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredApartments.length === 0 && (
          <div className="py-20 text-center flex flex-col items-center opacity-40">
             <Home size={48} className="mb-4 text-slate-300" />
             <p className="text-slate-500 font-black uppercase tracking-widest">Empty Inventory</p>
          </div>
        )}
      </div>

      {/* Modern Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-2xl shadow-2xl border border-slate-100 scale-in-center overflow-y-auto max-h-[90vh] custom-scrollbar">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{isEditing ? 'Modify Listing' : 'New Listing'}</h2>
                <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">Define unit parameters & capacity</p>
              </div>
              <button onClick={() => { setShowAddModal(false); setIsEditing(false); setEditingId(null); setNewApartment({ name: '', location: '', price: '', type: 'Single', status: 'Available', roomSize: '', description: '' }); }} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-2xl transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddApartment} className="grid grid-cols-2 gap-8">
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Building / Project Name</label>
                <input required type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all" value={newApartment.name} onChange={e => setNewApartment({...newApartment, name: e.target.value})} placeholder="Sunset Residences" />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Geographic Location</label>
                <input required type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all" value={newApartment.location} onChange={e => setNewApartment({...newApartment, location: e.target.value})} placeholder="DLF Phase 3, Gurgaon" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Monthly Yield (INR)</label>
                <input required type="number" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all" value={newApartment.price} onChange={e => setNewApartment({...newApartment, price: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Unit Classification</label>
                <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all appearance-none" value={newApartment.type} onChange={e => setNewApartment({...newApartment, type: e.target.value})}>
                  <option value="Single">Single Room</option>
                  <option value="Double">Double Sharing</option>
                  <option value="Triple">Triple Sharing</option>
                  <option value="Studio">Studio Unit</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Floor Area (optional)</label>
                <input type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all" value={newApartment.roomSize} onChange={e => setNewApartment({...newApartment, roomSize: e.target.value})} placeholder="e.g. 150 SQFT" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Deployment Status</label>
                <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold transition-all appearance-none" value={newApartment.status} onChange={e => setNewApartment({...newApartment, status: e.target.value})}>
                  <option value="Available">Available</option>
                  <option value="Full">Full (Capactiy)</option>
                  <option value="Maintenance">Under Maintenance</option>
                </select>
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Asset Description</label>
                <textarea className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-medium transition-all h-32 resize-none" value={newApartment.description} onChange={e => setNewApartment({...newApartment, description: e.target.value})}></textarea>
              </div>
              <button type="submit" className="col-span-2 btn-gradient py-5 rounded-[1.8rem] font-black uppercase text-sm tracking-[0.2em] shadow-xl shadow-blue-500/30 mt-4 active:scale-[0.98] transition-all">
                {isEditing ? 'Publish Updates' : 'Publish Listing'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Apartments;
