import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '@/components/organisms/Sidebar';
import TopBar from '@/components/organisms/TopBar';
import Dashboard from '@/components/pages/Dashboard';
import Inbox from '@/components/pages/Inbox';
import Calendar from '@/components/pages/Calendar';
import Tasks from '@/components/pages/Tasks';
import Projects from '@/components/pages/Projects';
import Rules from '@/components/pages/Rules';
import Services from '@/components/pages/Services';

const AuthenticatedApp = () => {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 overflow-auto bg-surface">
          <div className="p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/services" element={<Services />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedApp;