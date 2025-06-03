import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import ActivityTimeline from './ActivityTimeline'
import { contactService } from '../services'
import { dealService } from '../services'
import { taskService } from '../services'
import { format, isToday, isTomorrow, isPast } from 'date-fns'

const MainFeature = ({ activeSection }) => {
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [draggedDeal, setDraggedDeal] = useState(null)

  const pipelineStages = [
    { id: 'lead', label: 'Lead', color: 'bg-surface-500' },
    { id: 'qualified', label: 'Qualified', color: 'bg-blue-500' },
    { id: 'proposal', label: 'Proposal', color: 'bg-accent' },
    { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-500' },
    { id: 'closed-won', label: 'Closed Won', color: 'bg-green-500' },
    { id: 'closed-lost', label: 'Closed Lost', color: 'bg-red-500' }
  ]

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: ''
  })

  useEffect(() => {
    loadData()
  }, [activeSection])

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      if (activeSection === 'contacts') {
        const result = await contactService.getAll()
        setContacts(result || [])
      } else if (activeSection === 'pipeline') {
        const result = await dealService.getAll()
        setDeals(result || [])
      } else if (activeSection === 'tasks') {
        const result = await taskService.getAll()
        setTasks(result || [])
      }
    } catch (err) {
      setError(err?.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.firstName?.trim() || !formData.lastName?.trim() || !formData.email?.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      if (selectedContact) {
        await contactService.update(selectedContact.id, formData)
        toast.success('Contact updated successfully')
      } else {
        await contactService.create(formData)
        toast.success('Contact created successfully')
      }
      setShowModal(false)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        position: ''
      })
      setSelectedContact(null)
      loadData()
    } catch (err) {
      toast.error(err?.message || 'Failed to save contact')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (contact) => {
    setSelectedContact(contact)
    setFormData({
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      email: contact.email || '',
      phone: contact.phone || '',
      company: contact.company || '',
      position: contact.position || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return
    
    try {
      await contactService.delete(id)
      toast.success('Contact deleted successfully')
      loadData()
    } catch (err) {
      toast.error(err?.message || 'Failed to delete contact')
    }
  }

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e, targetStage) => {
    e.preventDefault()
    if (draggedDeal && draggedDeal.stage !== targetStage) {
      try {
        await dealService.update(draggedDeal.id, { ...draggedDeal, stage: targetStage })
        toast.success('Deal moved successfully')
        loadData()
      } catch (err) {
        toast.error('Failed to update deal')
      }
    }
    setDraggedDeal(null)
  }

  const filteredContacts = contacts?.filter(contact =>
    `${contact?.firstName || ''} ${contact?.lastName || ''} ${contact?.email || ''} ${contact?.company || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  ) || []

  const getTaskPriority = (priority) => {
    switch (priority) {
      case 'high': return { color: 'text-red-600 bg-red-100', icon: 'AlertTriangle' }
      case 'medium': return { color: 'text-amber-600 bg-amber-100', icon: 'Clock' }
      case 'low': return { color: 'text-green-600 bg-green-100', icon: 'CheckCircle' }
      default: return { color: 'text-surface-600 bg-surface-100', icon: 'Circle' }
    }
  }

  const getTaskStatus = (dueDate) => {
    if (!dueDate) return 'No due date'
    const date = new Date(dueDate)
    if (isPast(date) && !isToday(date)) return 'Overdue'
    if (isToday(date)) return 'Due today'
    if (isTomorrow(date)) return 'Due tomorrow'
    return format(date, 'MMM dd, yyyy')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-surface-600 dark:text-surface-400">Loading...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-white/50 dark:bg-surface-900/50 backdrop-blur-sm">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-700 p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-surface-900 dark:text-white capitalize">
              {activeSection === 'pipeline' ? 'Sales Pipeline' : activeSection}
            </h2>
            <p className="text-surface-600 dark:text-surface-400 mt-1">
              {activeSection === 'contacts' && 'Manage your customer relationships'}
              {activeSection === 'pipeline' && 'Track deals through your sales process'}
              {activeSection === 'tasks' && 'Stay on top of your to-do list'}
              {activeSection === 'activities' && 'View all customer interactions'}
              {activeSection === 'emails' && 'Manage email communications'}
            </p>
          </div>
          
          {activeSection === 'contacts' && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full sm:w-80 border border-surface-300 dark:border-surface-600 rounded-xl bg-white/90 dark:bg-surface-800/90 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedContact(null)
                  setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    phone: '',
                    company: '',
                    position: ''
                  })
                  setShowModal(true)
                }}
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
                <span>Add Contact</span>
              </motion.button>
            </div>
          )}
        </div>
      </motion.header>

      {/* Content */}
      <div className="flex-1 overflow-hidden p-6">
        <AnimatePresence mode="wait">
          {activeSection === 'contacts' && (
            <motion.div
              key="contacts"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <div className="grid gap-6 h-full">
                <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-surface-50 dark:bg-surface-900">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-surface-500 uppercase tracking-wider">Contact</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-surface-500 uppercase tracking-wider hidden sm:table-cell">Company</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-surface-500 uppercase tracking-wider hidden md:table-cell">Email</th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-surface-500 uppercase tracking-wider hidden lg:table-cell">Phone</th>
                          <th className="px-6 py-4 text-right text-xs font-medium text-surface-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                        {filteredContacts.map((contact) => (
                          <motion.tr
                            key={contact.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                                  {contact?.firstName?.charAt(0) || '?'}{contact?.lastName?.charAt(0) || ''}
                                </div>
                                <div>
                                  <p className="font-medium text-surface-900 dark:text-white">
                                    {contact?.firstName || ''} {contact?.lastName || ''}
                                  </p>
                                  <p className="text-sm text-surface-500 dark:text-surface-400">
                                    {contact?.position || 'No position'}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-surface-900 dark:text-white hidden sm:table-cell">
                              {contact?.company || 'No company'}
                            </td>
                            <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-400 hidden md:table-cell">
                              {contact?.email || 'No email'}
                            </td>
                            <td className="px-6 py-4 text-sm text-surface-600 dark:text-surface-400 hidden lg:table-cell">
                              {contact?.phone || 'No phone'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleEdit(contact)}
                                  className="p-2 text-surface-400 hover:text-primary rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors"
                                >
                                  <ApperIcon name="Edit" className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDelete(contact.id)}
                                  className="p-2 text-surface-400 hover:text-red-500 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors"
                                >
                                  <ApperIcon name="Trash2" className="w-4 h-4" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'pipeline' && (
            <motion.div
              key="pipeline"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 h-full overflow-x-auto">
                {pipelineStages.map((stage) => (
                  <div
                    key={stage.id}
                    className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-2xl border border-surface-200 dark:border-surface-700 p-4 min-w-80 sm:min-w-0"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage.id)}
                  >
                    <div className="flex items-center space-x-2 mb-4">
                      <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                      <h3 className="font-semibold text-surface-900 dark:text-white">{stage.label}</h3>
                      <span className="text-xs text-surface-500 bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded-full">
                        {deals?.filter(deal => deal?.stage === stage.id)?.length || 0}
                      </span>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
                      {deals?.filter(deal => deal?.stage === stage.id)?.map((deal) => (
                        <motion.div
                          key={deal.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, deal)}
                          className="p-4 bg-surface-50 dark:bg-surface-700 rounded-xl border border-surface-200 dark:border-surface-600 cursor-move hover:shadow-lg transition-all"
                          whileHover={{ scale: 1.02 }}
                        >
                          <h4 className="font-medium text-surface-900 dark:text-white mb-2">{deal?.title || 'Untitled Deal'}</h4>
                          <p className="text-lg font-bold text-primary mb-2">
                            ${deal?.value?.toLocaleString() || '0'}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-surface-600 dark:text-surface-400">
                              {deal?.probability || 0}% chance
                            </span>
                            <span className="text-surface-500">
                              {deal?.expectedCloseDate ? format(new Date(deal.expectedCloseDate), 'MMM dd') : 'No date'}
                            </span>
                          </div>
                        </motion.div>
                      )) || []}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <div className="grid gap-6">
                <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-2xl border border-surface-200 dark:border-surface-700 p-6">
                  <div className="space-y-4">
                    {tasks?.map((task) => {
                      const priority = getTaskPriority(task?.priority)
                      return (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start space-x-4 p-4 border border-surface-200 dark:border-surface-600 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
                        >
                          <div className={`w-8 h-8 rounded-lg ${priority.color} flex items-center justify-center`}>
                            <ApperIcon name={priority.icon} className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-surface-900 dark:text-white mb-1">
                              {task?.title || 'Untitled Task'}
                            </h4>
                            <p className="text-sm text-surface-600 dark:text-surface-400 mb-2">
                              {task?.description || 'No description'}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-xs">
                              <span className="bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded-full">
                                {task?.status || 'pending'}
                              </span>
                              <span className="text-surface-500">
                                {getTaskStatus(task?.dueDate)}
                              </span>
                              <span className="text-surface-500">
                                Assigned to: {task?.assignedTo || 'Unassigned'}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )
                    }) || []}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

{activeSection === 'activities' && (
            <motion.div
              key="activities"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <ActivityTimeline />
            </motion.div>
          )}

          {activeSection === 'emails' && (
            <motion.div
              key="emails"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                  <ApperIcon name="Mail" className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">
                  Email Management
                </h3>
                <p className="text-surface-600 dark:text-surface-400">
                  Manage email communications and correspondence
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-surface-900 dark:text-white">
                  {selectedContact ? 'Edit Contact' : 'Add New Contact'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Position
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (selectedContact ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature