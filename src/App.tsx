import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { TextSummarizer, YouTubeSummarizer } from './pages/SummarizerTools';
import { OCRTool, ImageToNotesTool } from './pages/VisionTools';
import { Rewards } from './pages/Rewards';
import { Card } from './components/Common';

// Simple placeholder for pages not fully detailed in the prompt response to save space
const HistoryPage = () => {
  const { history } = useApp();
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Activity History</h2>
      {history.map(item => (
        <Card key={item.id} className="mb-4">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-wide text-purple-600 bg-purple-100 px-2 py-1 rounded-md">{item.type}</span>
              <h3 className="font-semibold mt-2 text-lg">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 mt-1">{item.summary}</p>
            </div>
            <span className="text-xs text-slate-400">{item.timestamp.toLocaleDateString()}</span>
          </div>
        </Card>
      ))}
      {history.length === 0 && <p className="text-slate-500">No history yet.</p>}
    </div>
  );
};

const SettingsPage = () => (
  <Card>
    <h2 className="text-xl font-bold mb-4">Settings</h2>
    <p className="text-slate-500">Account settings and preferences would go here.</p>
  </Card>
);

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/text-summary" element={<ProtectedRoute><TextSummarizer /></ProtectedRoute>} />
      <Route path="/youtube-summary" element={<ProtectedRoute><YouTubeSummarizer /></ProtectedRoute>} />
      <Route path="/ocr" element={<ProtectedRoute><OCRTool /></ProtectedRoute>} />
      <Route path="/image-notes" element={<ProtectedRoute><ImageToNotesTool /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
      <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AppProvider>
  );
};


export default App;