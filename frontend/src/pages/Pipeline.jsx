import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MoreHorizontal, User, MapPin, ExternalLink, AlertCircle } from 'lucide-react';

const STAGES = [
  'New Lead', 'Contacted', 'Requirement Collected',
  'Property Suggested', 'Visit Scheduled', 'Visit Completed',
  'Booked', 'Lost'
];

function SortableLeadCard({ lead }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: lead._id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const statusColors = {
    'New Lead': 'bg-blue-500',
    'Contacted': 'bg-purple-500',
    'Requirement Collected': 'bg-indigo-500',
    'Property Suggested': 'bg-cyan-500',
    'Visit Scheduled': 'bg-orange-500',
    'Visit Completed': 'bg-teal-500',
    'Booked': 'bg-emerald-500',
    'Lost': 'bg-red-500'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-grab active:cursor-grabbing ${lead.followUpRequired ? 'ring-2 ring-red-500/20 bg-red-50/10' : ''}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className={`w-1.5 h-6 rounded-full ${statusColors[lead.status] || 'bg-slate-300'}`}></div>
        <button className="text-slate-300 hover:text-slate-600 transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>
      
      <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-tight mb-1">{lead.name}</h4>
      <p className="text-xs font-bold text-slate-400 mb-4">{lead.phone}</p>
      
      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-[10px] font-black border border-slate-200">
            {lead.assignedAgent?.name ? lead.assignedAgent.name.charAt(0) : '?'}
          </div>
          <span className="text-[10px] font-bold text-slate-400 truncate max-w-[80px]">
            {lead.assignedAgent?.name?.split(' ')[0] || 'Unassigned'}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {lead.followUpRequired && (
            <AlertCircle size={14} className="text-red-500 animate-pulse" />
          )}
          <span className="text-[9px] font-black px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full uppercase tracking-tighter">
            {lead.leadSource}
          </span>
        </div>
      </div>

      <a 
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
        href={`/leads/${lead._id}`} 
        className="absolute top-12 right-4 p-2 bg-blue-50 text-blue-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:text-white"
      >
        <ExternalLink size={14} />
      </a>
    </div>
  );
}

export default function Pipeline() {
  const [leads, setLeads] = useState([]);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = () => {
    axios.get('/api/leads')
      .then(res => setLeads(res.data))
      .catch(err => console.error(err));
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeLead = (leads || []).find(l => l._id === active.id);
    const overId = over.id;

    if (STAGES.includes(overId)) {
      if (activeLead && activeLead.status !== overId) {
        setLeads(prev => prev.map(l => l._id === active.id ? { ...l, status: overId } : l));
      }
    } else {
      const overLead = (leads || []).find(l => l._id === overId);
      if (overLead && activeLead && activeLead.status !== overLead.status) {
        setLeads(prev => prev.map(l => l._id === active.id ? { ...l, status: overLead.status } : l));
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeLead = leads.find(l => l._id === active.id);
    let targetStatus = over.id;

    if (!STAGES.includes(targetStatus)) {
      const overLead = leads.find(l => l._id === targetStatus);
      targetStatus = overLead ? overLead.status : activeLead.status;
    }

    if (activeLead.status !== targetStatus) {
      try {
        await axios.put(`/api/leads/${active.id}/status`, { status: targetStatus });
        fetchLeads();
      } catch (err) {
        console.error(err);
        fetchLeads();
      }
    }
  };

  const getItemStyles = (stage) => {
    switch (stage) {
      case 'New Lead': return 'border-blue-200 bg-blue-50/30';
      case 'Booked': return 'border-emerald-200 bg-emerald-50/30';
      case 'Lost': return 'border-red-200 bg-red-50/30';
      default: return 'border-slate-200 bg-slate-100/40';
    }
  };

  const activeLead = activeId ? leads.find(l => l._id === activeId) : null;

  return (
    <div className="space-y-8 h-screen-minus-header flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Sales Pipeline</h1>
          <p className="text-slate-500 mt-1">Drag and drop leads to change their stage.</p>
        </div>
        <div className="flex items-center space-x-4">
           <div className="hidden md:flex items-center space-x-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Urgent Follow-ups</span>
           </div>
        </div>
      </div>
      
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex overflow-x-auto space-x-8 pb-8 pr-8 no-scrollbar scroll-smooth">
          {STAGES.map(stage => {
            const stageLeads = leads.filter(l => l.status === stage);
            return (
              <div 
                key={stage}
                className={`flex-shrink-0 w-72 rounded-[2rem] flex flex-col border border-dashed transition-all duration-500 ${getItemStyles(stage)} shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]`}
              >
                <div className="p-5 pb-3 flex justify-between items-center">
                  <h3 className="font-black text-slate-900 text-xs uppercase tracking-[0.2em]">
                    {stage}
                  </h3>
                  <div className="bg-white/80 backdrop-blur-sm text-slate-900 text-[10px] font-black px-3 py-1 rounded-full border border-slate-200/50 shadow-sm">
                    {stageLeads.length}
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 pt-2 space-y-5 custom-scrollbar">
                  <SortableContext 
                    id={stage}
                    items={(stageLeads || []).map(l => l._id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {stageLeads.map(lead => (
                      <SortableLeadCard key={lead._id} lead={lead} />
                    ))}
                    {stageLeads.length === 0 && (
                      <div className="h-32 border-2 border-dashed border-slate-300/40 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 group/drop transition-all">
                        <MapPin size={24} className="mb-2 opacity-20 group-hover/drop:scale-110 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-40">Drop items</span>
                      </div>
                    )}
                  </SortableContext>
                </div>
              </div>
            );
          })}
        </div>

        <DragOverlay dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: '0.2' } },
          }),
        }}>
          {activeLead ? (
            <div className="bg-white p-6 rounded-[2rem] shadow-2xl border-2 border-blue-500 cursor-grabbing w-80 rotate-2 scale-105 transition-transform">
              <div className="flex justify-between items-start mb-4">
                 <div className="w-2 h-6 bg-blue-500 rounded-full"></div>
                 <MoreHorizontal size={18} className="text-slate-300" />
              </div>
              <h4 className="font-black text-slate-900 leading-tight mb-1">{activeLead.name}</h4>
              <p className="text-xs font-bold text-slate-400">{activeLead.phone}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
