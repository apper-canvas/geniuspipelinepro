import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'
import MainFeature from '../components/MainFeature'
import Dashboard from '../components/Dashboard'
import { toast } from 'react-toastify'

const Home = ({ darkMode, toggleDarkMode }) => {
  const [activeSection, setActiveSection] = useState('dashboard')

const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
    { id: 'contacts', label: 'Contacts', icon: 'Users' },
    { id: 'companies', label: 'Companies', icon: 'Building2' },
    { id: 'pipeline', label: 'Pipeline', icon: 'TrendingUp' },
    { id: 'quotes', label: 'Quotes', icon: 'FileText' },
    { id: 'salesorders', label: 'Sales Orders', icon: 'ShoppingCart' },
    { id: 'tasks', label: 'Tasks', icon: 'CheckSquare' },
    { id: 'activities', label: 'Activities', icon: 'Activity' },
    { id: 'emails', label: 'Emails', icon: 'Mail' }
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 lg:w-80 bg-white/90 dark:bg-surface-800/90 backdrop-blur-xl border-r border-surface-200 dark:border-surface-700 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl text-surface-900 dark:text-white">CRM</span>
</div>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
            >
              <ApperIcon 
                name={darkMode ? 'Sun' : 'Moon'} 
                className="w-5 h-5 text-surface-600 dark:text-surface-400" 
              />
            </button>
          </div>
        </div>
        {/* Navigation */}
<nav className="flex-1 p-6">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <motion.li key={item.id}>
                <motion.button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                      : 'hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Stats Card */}
        <div className="p-6">
          <motion.div 
            className="bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 p-4 rounded-2xl border border-primary/20"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="BarChart3" className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-surface-900 dark:text-white">This Month</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-2xl font-bold text-primary">47</p>
                <p className="text-xs text-surface-600 dark:text-surface-400">New Leads</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">$124K</p>
                <p className="text-xs text-surface-600 dark:text-surface-400">Revenue</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <MainFeature activeSection={activeSection} />
      </main>
    </div>
  )
}

export default Home