import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';

import { TextSummarizer, YouTubeSummarizer } from './pages/SummarizerTools';
import { OCRTool, ImageToNotesTool } from './pages/VisionTools';
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



const AppShell = ({ children }: { children?: React.ReactNode }) => (
  <Layout>{children}</Layout>
);


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppShell><Dashboard /></AppShell>} />
      <Route path="/text-summary" element={<AppShell><TextSummarizer /></AppShell>} />
      <Route path="/youtube-summary" element={<AppShell><YouTubeSummarizer /></AppShell>} />
      <Route path="/ocr" element={<AppShell><OCRTool /></AppShell>} />
      <Route path="/image-notes" element={<AppShell><ImageToNotesTool /></AppShell>} />
      <Route path="/history" element={<AppShell><HistoryPage /></AppShell>} />
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

