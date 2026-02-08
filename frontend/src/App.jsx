import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, ClipboardList, BarChart3, Globe2, Leaf, Smartphone } from 'lucide-react'
import ScanScreen from './components/ScanScreen'
import ItemDetailScreen from './components/ItemDetailScreen'
import InsightsScreen from './components/InsightsScreen'
import ImpactScreen from './components/ImpactScreen'
import ImpactDashboard from './components/ImpactDashboard'
import { WASTE_KNOWLEDGE } from './data/wasteData'

function App() {
  const [activeTab, setActiveTab] = useState('scan')
  const [selectedItem, setSelectedItem] = useState(null)
  const [scanHistory, setScanHistory] = useState([])
  const [showMobilePopup, setShowMobilePopup] = useState(true)

  // Auto-dismiss popup after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMobilePopup(false)
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  // Handle navigation to details
  const handleShowDetails = (item, image = null) => {
    // If an image is provided, attach it to the item object
    const itemWithImage = image ? { ...item, capturedImage: image } : item;
    setSelectedItem(itemWithImage)
    // Add to history if not already there (simple unique check by type or ID)
    setScanHistory(prev => [itemWithImage, ...prev].slice(0, 20))
    setActiveTab('details')
  }

  // Render active screen
  const renderScreen = () => {
    switch (activeTab) {
      case 'scan':
        return <ScanScreen onShowDetails={handleShowDetails} />
      case 'details':
        return <ItemDetailScreen item={selectedItem} />
      case 'insights':
        return <InsightsScreen history={scanHistory} onItemClick={handleShowDetails} />
      case 'impact':
        return <ImpactScreen item={selectedItem} history={scanHistory} />
      default:
        return <ScanScreen onShowDetails={handleShowDetails} />
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white selection:bg-emerald-500/30 overflow-hidden relative">
      {/* Background Mesh */}
      <div className="fixed inset-0 bg-mesh opacity-50 pointer-events-none" />

      {/* Floating Impact Dashboard */}
      <ImpactDashboard history={scanHistory} wasteKnowledge={WASTE_KNOWLEDGE} />

      {/* Top Banner (Optional for Hackathon feel) */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500 z-50 animate-pulse" />

      {/* Mobile Usage Popup */}
      <AnimatePresence>
        {showMobilePopup && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] px-4"
          >
            <div className="glass-card bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 p-4 rounded-2xl shadow-[0_8px_32px_rgba(16,185,129,0.3)] flex items-center gap-3 max-w-sm">
              <div className="bg-emerald-500/20 p-2 rounded-xl">
                <Smartphone className="text-emerald-400" size={24} />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold text-sm">For better experience</p>
                <p className="text-gray-300 text-xs">Use this app on mobile</p>
              </div>
              <button
                onClick={() => setShowMobilePopup(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="relative h-screen pb-24 pt-20 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Premium Glass Bottom Navigation */}
      <nav className="fixed bottom-4 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 z-50">
        <div className="glass-card flex justify-between sm:justify-around items-center p-2 sm:p-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] bg-slate-900/80 backdrop-blur-xl">
          <NavButton
            active={activeTab === 'scan'}
            onClick={() => setActiveTab('scan')}
            icon={<Camera size={20} />}
            label="Scan"
            color="emerald"
          />
          <NavButton
            active={activeTab === 'details'}
            onClick={() => setActiveTab('details')}
            icon={<ClipboardList size={20} />}
            label="Details"
            color="emerald"
          />
          <NavButton
            active={activeTab === 'insights'}
            onClick={() => setActiveTab('insights')}
            icon={<BarChart3 size={20} />}
            label="Insights"
            color="blue"
          />
          <NavButton
            active={activeTab === 'impact'}
            onClick={() => setActiveTab('impact')}
            icon={<Globe2 size={20} />}
            label="Impact"
            color="blue"
          />
        </div>
      </nav>
    </div>
  )
}

function NavButton({ active, onClick, icon, label, color }) {
  const activeClass = color === 'emerald'
    ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]'
    : 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]'

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 px-3 sm:px-5 rounded-xl sm:rounded-2xl transition-all duration-300 ${active ? activeClass : 'text-gray-500 hover:text-white'
        }`}
    >
      <div className={`${active ? 'scale-110' : 'scale-100'} transition-transform`}>
        {icon}
      </div>
      <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${active ? 'block' : 'hidden sm:block'}`}>
        {label}
      </span>
    </button>
  )
}

export default App
