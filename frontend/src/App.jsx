import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CypherViewerModal from './components/CypherViewerModal';

import Dashboard from './pages/Dashboard';
import MySkillsPage from './pages/MySkillsPage';
import FindSkillsPage from './pages/FindSkillsPage';
import MatchesPage from './pages/MatchesPage';
import RequestsPage from './pages/RequestsPage';
import SessionsPage from './pages/SessionsPage';
import ProfilePage from './pages/ProfilePage';
import GraphExplorerPage from './pages/GraphExplorerPage';
import CypherPlaygroundPage from './pages/CypherPlaygroundPage';

function AppContent() {
  const { loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cypherModalOpen, setCypherModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0F1D] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 animate-spin flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <div className="w-8 h-8 rounded-xl bg-[#0A0F1D]"></div>
        </div>
        <p className="text-sm font-semibold text-indigo-400 font-mono animate-pulse">
          Connecting to SkillSwap Graph Database...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0F1D] text-slate-100 flex flex-col antialiased">
      {/* Top Navigation */}
      <Navbar
        onOpenCypherModal={() => setCypherModalOpen(true)}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto bg-[#0A0F1D]">
          {activeTab === 'dashboard' && (
            <Dashboard
              setActiveTab={setActiveTab}
              onOpenCypherModal={() => setCypherModalOpen(true)}
            />
          )}
          {activeTab === 'my-skills' && (
            <MySkillsPage setActiveTab={setActiveTab} />
          )}
          {activeTab === 'find-skills' && (
            <FindSkillsPage setActiveTab={setActiveTab} />
          )}
          {activeTab === 'matches' && (
            <MatchesPage
              setActiveTab={setActiveTab}
              onOpenCypherModal={() => setCypherModalOpen(true)}
            />
          )}
          {activeTab === 'requests' && (
            <RequestsPage setActiveTab={setActiveTab} />
          )}
          {activeTab === 'sessions' && (
            <SessionsPage />
          )}
          {activeTab === 'profile' && (
            <ProfilePage setActiveTab={setActiveTab} />
          )}
          {activeTab === 'graph-explorer' && (
            <GraphExplorerPage
              setActiveTab={setActiveTab}
              onOpenCypherModal={() => setCypherModalOpen(true)}
            />
          )}
          {activeTab === 'cypher' && (
            <CypherPlaygroundPage />
          )}
        </main>
      </div>

      {/* Global openCypher Query Inspector Modal */}
      <CypherViewerModal
        isOpen={cypherModalOpen}
        onClose={() => setCypherModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
