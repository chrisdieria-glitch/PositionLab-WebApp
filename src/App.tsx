import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import CalculatorPage from './pages/CalculatorPage';
import HistoryPage from './pages/HistoryPage';
import type { TabKey } from './types';
import './styles/global.css';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('calculator');
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const switchTab = useCallback((tab: TabKey) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    if (tab === 'history') {
      setReloadTrigger((n) => n + 1);
    }
  }, [activeTab]);

  const handleSaveComplete = useCallback(() => {
    setReloadTrigger((n) => n + 1);
  }, []);

  return (
    <>
      <Sidebar activeTab={activeTab} onTabChange={switchTab} />
      <main className="main-content">
        <div className="content-inner">
          {activeTab === 'calculator' && (
            <CalculatorPage onSaveComplete={handleSaveComplete} />
          )}
          {activeTab === 'history' && (
            <HistoryPage reloadTrigger={reloadTrigger} />
          )}
        </div>
      </main>
    </>
  );
}
