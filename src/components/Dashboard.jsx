import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Chart from 'react-apexcharts'
import { dealService } from '../services'
import ApperIcon from './ApperIcon'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [metrics, setMetrics] = useState({})

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const dealsData = await dealService.getAll()
      setDeals(dealsData)
      calculateMetrics(dealsData)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const calculateMetrics = (dealsData) => {
    const totalValue = dealsData.reduce((sum, deal) => sum + deal.value, 0)
    const wonDeals = dealsData.filter(deal => deal.stage === 'closed-won')
    const totalDeals = dealsData.length
    const conversionRate = totalDeals > 0 ? (wonDeals.length / totalDeals) * 100 : 0
    const avgDealSize = totalDeals > 0 ? totalValue / totalDeals : 0

    setMetrics({
      totalValue,
      wonDeals: wonDeals.length,
      conversionRate,
      avgDealSize,
      totalDeals
    })
  }

  const getStageData = () => {
    const stages = ['lead', 'qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost']
    const stageData = stages.map(stage => {
      const stageDeals = deals.filter(deal => deal.stage === stage)
      return {
        stage: stage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        count: stageDeals.length,
        value: stageDeals.reduce((sum, deal) => sum + deal.value, 0)
      }
    })
    return stageData
  }

  const getMonthlyData = () => {
    const months = []
    const now = new Date()
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        deals: Math.floor(Math.random() * 20) + 10,
        value: Math.floor(Math.random() * 200000) + 50000
      })
    }
    return months
  }

  const pipelineChartOptions = {
    chart: {
      type: 'donut',
      background: 'transparent'
    },
    labels: getStageData().map(item => item.stage),
    colors: ['#7C3AED', '#06B6D4', '#F59E0B', '#10B981', '#EF4444', '#6B7280'],
    legend: {
      position: 'bottom',
      labels: {
        colors: ['#64748b']
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '65%'
        }
      }
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }

  const timeSeriesOptions = {
    chart: {
      type: 'area',
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2
      }
    },
    colors: ['#7C3AED'],
    xaxis: {
      categories: getMonthlyData().map(item => item.month),
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    },
    grid: {
      borderColor: '#e2e8f0'
    }
  }

  const conversionFunnelOptions = {
    chart: {
      type: 'bar',
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4
      }
    },
    colors: ['#06B6D4'],
    xaxis: {
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    }
  }

  const valueRangeOptions = {
    chart: {
      type: 'bar',
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    colors: ['#F59E0B'],
    xaxis: {
      categories: ['<$50K', '$50K-$100K', '$100K-$150K', '>$150K'],
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b'
        }
      }
    }
  }

  const getValueRangeData = () => {
    const ranges = [
      { min: 0, max: 50000, label: '<$50K' },
      { min: 50000, max: 100000, label: '$50K-$100K' },
      { min: 100000, max: 150000, label: '$100K-$150K' },
      { min: 150000, max: Infinity, label: '>$150K' }
    ]

    return ranges.map(range => {
      const count = deals.filter(deal => 
        deal.value >= range.min && deal.value < range.max
      ).length
      return count
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Sales Dashboard</h1>
          <p className="text-surface-600 dark:text-surface-400 mt-1">Track your sales performance and pipeline</p>
        </div>
        <motion.button
          onClick={loadDashboardData}
          className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          <span>Refresh</span>
        </motion.button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 dark:text-surface-400 text-sm">Total Pipeline</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                ${metrics.totalValue?.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <ApperIcon name="DollarSign" className="w-6 h-6 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 dark:text-surface-400 text-sm">Deals Won</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                {metrics.wonDeals}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <ApperIcon name="Trophy" className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 dark:text-surface-400 text-sm">Conversion Rate</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                {metrics.conversionRate?.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
              <ApperIcon name="Target" className="w-6 h-6 text-secondary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-surface-600 dark:text-surface-400 text-sm">Avg Deal Size</p>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">
                ${metrics.avgDealSize?.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="w-6 h-6 text-accent" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline by Stage */}
        <motion.div
          className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Pipeline by Stage</h3>
          <Chart
            options={pipelineChartOptions}
            series={getStageData().map(item => item.count)}
            type="donut"
            height={300}
          />
        </motion.div>

        {/* Deals Over Time */}
        <motion.div
          className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Deals Over Time</h3>
          <Chart
            options={timeSeriesOptions}
            series={[{
              name: 'Deals',
              data: getMonthlyData().map(item => item.deals)
            }]}
            type="area"
            height={300}
          />
        </motion.div>

        {/* Conversion Funnel */}
        <motion.div
          className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Conversion Funnel</h3>
          <Chart
            options={conversionFunnelOptions}
            series={[{
              name: 'Deals',
              data: getStageData().slice(0, 4).map(item => item.count)
            }]}
            type="bar"
            height={300}
          />
        </motion.div>

        {/* Deals by Value Range */}
        <motion.div
          className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Deals by Value Range</h3>
          <Chart
            options={valueRangeOptions}
            series={[{
              name: 'Deals',
              data: getValueRangeData()
            }]}
            type="bar"
            height={300}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard