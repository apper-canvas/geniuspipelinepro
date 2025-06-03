import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { activityService } from '../services'
import { format, isToday, isYesterday, isSameDay } from 'date-fns'

const ActivityTimeline = () => {
  const [activities, setActivities] = useState([])
  const [filteredActivities, setFilteredActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedFilters, setSelectedFilters] = useState(['all'])

  const activityTypes = [
    { id: 'all', label: 'All Activities', icon: 'Activity', color: 'bg-surface-500' },
    { id: 'call', label: 'Calls', icon: 'Phone', color: 'bg-green-500' },
    { id: 'email', label: 'Emails', icon: 'Mail', color: 'bg-blue-500' },
    { id: 'task', label: 'Tasks', icon: 'CheckSquare', color: 'bg-amber-500' },
    { id: 'meeting', label: 'Meetings', icon: 'Calendar', color: 'bg-purple-500' },
    { id: 'note', label: 'Notes', icon: 'FileText', color: 'bg-surface-600' }
  ]

  useEffect(() => {
    loadActivities()
  }, [])

  useEffect(() => {
    filterActivities()
  }, [activities, selectedFilters])

  const loadActivities = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await activityService.getAll()
      // Sort activities by timestamp in descending order (newest first)
      const sortedActivities = (result || []).sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      )
      setActivities(sortedActivities)
    } catch (err) {
      setError(err?.message || 'Failed to load activities')
      toast.error('Failed to load activities')
    } finally {
      setLoading(false)
    }
  }

  const filterActivities = () => {
    if (selectedFilters.includes('all')) {
      setFilteredActivities(activities)
    } else {
      const filtered = activities.filter(activity => 
        selectedFilters.includes(activity.type?.toLowerCase())
      )
      setFilteredActivities(filtered)
    }
  }

  const toggleFilter = (filterId) => {
    if (filterId === 'all') {
      setSelectedFilters(['all'])
    } else {
      setSelectedFilters(prev => {
        const newFilters = prev.filter(f => f !== 'all')
        if (newFilters.includes(filterId)) {
          const updated = newFilters.filter(f => f !== filterId)
          return updated.length === 0 ? ['all'] : updated
        } else {
          return [...newFilters, filterId]
        }
      })
    }
  }

  const getActivityIcon = (type) => {
    const activityType = activityTypes.find(t => t.id === type?.toLowerCase())
    return activityType || activityTypes.find(t => t.id === 'note')
  }

  const formatActivityDate = (timestamp) => {
    const date = new Date(timestamp)
    if (isToday(date)) return 'Today'
    if (isYesterday(date)) return 'Yesterday'
    return format(date, 'MMM dd, yyyy')
  }

  const formatActivityTime = (timestamp) => {
    return format(new Date(timestamp), 'h:mm a')
  }

  const groupActivitiesByDate = (activities) => {
    const groups = {}
    activities.forEach(activity => {
      const date = format(new Date(activity.timestamp), 'yyyy-MM-dd')
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(activity)
    })
    return groups
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-surface-600 dark:text-surface-400">Loading activities...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={loadActivities}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const groupedActivities = groupActivitiesByDate(filteredActivities)

  return (
    <div className="h-full flex flex-col">
      {/* Filter Buttons */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {activityTypes.map((type) => (
            <motion.button
              key={type.id}
              onClick={() => toggleFilter(type.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                selectedFilters.includes(type.id)
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                  : 'bg-white/80 dark:bg-surface-800/80 hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-600'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`w-3 h-3 rounded-full ${
                selectedFilters.includes(type.id) ? 'bg-white' : type.color
              }`}></div>
              <ApperIcon name={type.icon} className="w-4 h-4" />
              <span className="text-sm font-medium">{type.label}</span>
              {type.id !== 'all' && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedFilters.includes(type.id)
                    ? 'bg-white/20 text-white'
                    : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-400'
                }`}>
                  {activities.filter(a => a.type?.toLowerCase() === type.id).length}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto">
        {Object.keys(groupedActivities).length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                <ApperIcon name="Activity" className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">
                No Activities Found
              </h3>
              <p className="text-surface-600 dark:text-surface-400">
                {selectedFilters.includes('all') 
                  ? 'No activities have been recorded yet.'
                  : `No activities found for the selected filter${selectedFilters.length > 1 ? 's' : ''}.`
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedActivities)
              .sort(([a], [b]) => new Date(b) - new Date(a))
              .map(([date, dayActivities]) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  {/* Date Header */}
                  <div className="sticky top-0 z-10 bg-surface-50/90 dark:bg-surface-800/90 backdrop-blur-sm p-3 rounded-xl border border-surface-200 dark:border-surface-700 mb-4">
                    <h3 className="font-semibold text-surface-900 dark:text-white">
                      {formatActivityDate(dayActivities[0].timestamp)}
                    </h3>
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      {dayActivities.length} activit{dayActivities.length === 1 ? 'y' : 'ies'}
                    </p>
                  </div>

                  {/* Timeline Items */}
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-px bg-surface-200 dark:bg-surface-700"></div>

                    <div className="space-y-6">
                      {dayActivities.map((activity, index) => {
                        const activityType = getActivityIcon(activity.type)
                        return (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative flex items-start space-x-4"
                          >
                            {/* Timeline Dot */}
                            <div className={`w-8 h-8 rounded-full ${activityType.color} flex items-center justify-center relative z-10 shadow-lg`}>
                              <ApperIcon name={activityType.icon} className="w-4 h-4 text-white" />
                            </div>

                            {/* Activity Card */}
                            <div className="flex-1 bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-xl border border-surface-200 dark:border-surface-700 p-4 shadow-sm hover:shadow-md transition-all">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h4 className="font-medium text-surface-900 dark:text-white">
                                    {activity.title || `${activity.type || 'Activity'} Activity`}
                                  </h4>
                                  <p className="text-sm text-surface-600 dark:text-surface-400">
                                    {activity.description || 'No description available'}
                                  </p>
                                </div>
                                <span className="text-xs text-surface-500 bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded-full">
                                  {formatActivityTime(activity.timestamp)}
                                </span>
                              </div>

                              {/* Activity Details */}
                              <div className="flex flex-wrap items-center gap-4 text-sm">
                                {activity.contactId && (
                                  <div className="flex items-center space-x-1 text-surface-600 dark:text-surface-400">
                                    <ApperIcon name="User" className="w-4 h-4" />
                                    <span>Contact: {activity.contactName || activity.contactId}</span>
                                  </div>
                                )}
                                {activity.dealId && (
                                  <div className="flex items-center space-x-1 text-surface-600 dark:text-surface-400">
                                    <ApperIcon name="DollarSign" className="w-4 h-4" />
                                    <span>Deal: {activity.dealTitle || activity.dealId}</span>
                                  </div>
                                )}
                                {activity.duration && (
                                  <div className="flex items-center space-x-1 text-surface-600 dark:text-surface-400">
                                    <ApperIcon name="Clock" className="w-4 h-4" />
                                    <span>{activity.duration}</span>
                                  </div>
                                )}
                                {activity.outcome && (
                                  <div className="flex items-center space-x-1">
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      activity.outcome === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                      activity.outcome === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200' :
                                      'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200'
                                    }`}>
                                      {activity.outcome}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Additional Notes */}
                              {activity.notes && (
                                <div className="mt-3 p-3 bg-surface-50 dark:bg-surface-700 rounded-lg">
                                  <p className="text-sm text-surface-700 dark:text-surface-300">
                                    {activity.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityTimeline