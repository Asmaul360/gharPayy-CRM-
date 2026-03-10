import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Clock, MapPin, Menu, LogOut, Home, AlertTriangle } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Pipeline from './pages/Pipeline';
import Visits from './pages/Visits';
import LeadDetails from './pages/LeadDetails';
import Login from './pages/Login';
import Apartments from './pages/Apartments';

// --- Error Boundary ---
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="bg-white rounded-2xl border border-red-100 shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h2 className="text-lg font-black text-slate-900 mb-2">Page Crashed</h2>
            <p className="text-sm text-slate-500 mb-2">{this.state.error?.message || 'Unknown error.'}</p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
              className="mt-4 px-5 py-2.5 bg-blue-600 text-white text-xs font-black rounded-xl uppercase tracking-widest hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Auth Guard ---
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

// --- App Layout (uses Outlet from React Router v6) ---
const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  let agentName = 'Agent';
  try {
    const raw = localStorage.getItem('agent');
    if (raw) agentName = JSON.parse(raw)?.name || 'Agent';
  } catch (e) {}

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('agent');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={18} /> },
    { name: 'Leads', path: '/leads', icon: <Users size={18} /> },
    { name: 'Pipeline', path: '/pipeline', icon: <MapPin size={18} /> },
    { name: 'Visits', path: '/visits', icon: <Clock size={18} /> },
    { name: 'Apartments', path: '/apartments', icon: <Home size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden lg:flex flex-col border-r border-slate-800 shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-base italic">G</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">Gharpayy <span className="text-blue-400 font-normal">CRM</span></h2>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`}>
                  {item.icon}
                </span>
                <span className="font-semibold text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 hover:text-red-400 transition-all text-slate-400">
            <LogOut size={16} />
            <span className="font-semibold text-xs">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center lg:hidden">
            <Menu size={20} className="text-slate-600" />
            <h1 className="ml-3 font-bold text-slate-800 text-sm">Gharpayy</h1>
          </div>

          <div className="hidden lg:flex items-center space-x-2 bg-slate-100 rounded-full px-3 py-1 ring-1 ring-slate-200">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Enterprise Portal</span>
          </div>

          <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-800 leading-tight">{agentName}</p>
              <p className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Agent</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-md border-2 border-white">
              {agentName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
};

// --- App ---
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="leads/:id" element={<LeadDetails />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="visits" element={<Visits />} />
          <Route path="apartments" element={<Apartments />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
