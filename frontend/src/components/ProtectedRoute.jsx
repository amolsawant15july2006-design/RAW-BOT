import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-status-red mb-4 shadow-glow-red">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Access Restricted to Admin (Boss)</h2>
        <p className="text-industrial-400 max-w-md mb-6 text-sm">
          You are currently logged in as <span className="text-status-yellow font-semibold">{user?.title}</span>. 
          This administrative control area requires elevated system configuration privileges.
        </p>
        <Link
          to="/home"
          className="inline-flex items-center gap-2 px-4 py-2 bg-industrial-700 hover:bg-industrial-600 text-white rounded-lg text-sm border border-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Home
        </Link>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
