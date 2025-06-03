import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, isPast, isToday, isTomorrow } from 'date-fns'
import ApperIcon from './ApperIcon'
import ActivityTimeline from './ActivityTimeline'
import { contactService, dealService, taskService, activityService, emailService } from '../services'
import companyService from '../services/api/companyService'
import { toast } from 'react-toastify'
import Dashboard from './Dashboard'

const MainFeature = ({ activeSection }) => {
  const [contacts, setContacts] = useState([])
  const [companies, setCompanies] = useState([])
const [deals, setDeals] = useState([])
  const [tasks, setTasks] = useState([])
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showContactModal, setShowContactModal] = useState(false)
  const [showCompanyModal, setShowCompanyModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [editingCompany, setEditingCompany] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [selectedContact, setSelectedContact] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showEmailCompose, setShowEmailCompose] = useState(false)
  const [replyingTo, setReplyingTo] = useState(null)
  const [emailContent, setEmailContent] = useState({ to: '', subject: '', body: '' })
  const [emailSearchTerm, setEmailSearchTerm] = useState('')
  const [emailFilter, setEmailFilter] = useState('all')
  const [draggedDeal, setDraggedDeal] = useState(null)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: ''
  })
  useEffect(() => {
    if (activeSection === 'contacts') {
      loadContacts()
    } else if (activeSection === 'companies') {
      loadCompanies()
    } else if (activeSection === 'pipeline') {
      loadDeals()
} else if (activeSection === 'tasks') {
      loadTasks()
    } else if (activeSection === 'emails') {
      loadEmails()
    }
  }, [activeSection])

  const loadCompanies = async () => {
    try {
      setLoading(true)
      const data = await companyService.getAll()
      setCompanies(data)
    } catch (error) {
      console.error('Error loading companies:', error)
      toast.error('Failed to load companies')
    } finally {
      setLoading(false)
    }
  }
const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    assignedTo: ''
  })

  const [emailFormData, setEmailFormData] = useState({
    to: '',
    subject: '',
    body: '',
    replyTo: null
  })

  const pipelineStages = [
    { id: 'lead', label: 'Lead', color: 'bg-gray-400' },
    { id: 'qualified', label: 'Qualified', color: 'bg-blue-400' },
    { id: 'proposal', label: 'Proposal', color: 'bg-yellow-400' },
    { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-400' },
    { id: 'closed-won', label: 'Closed Won', color: 'bg-green-400' },
    { id: 'closed-lost', label: 'Closed Lost', color: 'bg-red-400' }
  ]

  const loadContacts = async () => {
    try {
      setLoading(true)
      const data = await contactService.getAll()
      setContacts(data)
    } catch (error) {
      console.error('Error loading contacts:', error)
      toast.error('Failed to load contacts')
    } finally {
      setLoading(false)
    }
  }

  const loadDeals = async () => {
    try {
      setLoading(true)
      const data = await dealService.getAll()
      setDeals(data)
    } catch (error) {
      console.error('Error loading deals:', error)
      toast.error('Failed to load deals')
    } finally {
      setLoading(false)
    }
  }

  const loadTasks = async () => {
    try {
      setLoading(true)
      const data = await taskService.getAll()
      setTasks(data)
    } catch (error) {
      console.error('Error loading tasks:', error)
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const loadEmails = async () => {
    try {
      setLoading(true)
      const data = await emailService.getAll()
      setEmails(data)
    } catch (error) {
      console.error('Error loading emails:', error)
      toast.error('Failed to load emails')
    } finally {
      setLoading(false)
    }
  }

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
      } else if (activeSection === 'emails') {
        const result = await emailService.getAll()
        setEmails(result || [])
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

  const handleEditContact = async (contactData) => {
    try {
      const updatedContact = await contactService.update(editingContact.id, contactData)
      setContacts(contacts.map(c => c.id === editingContact.id ? updatedContact : c))
      setEditingContact(null)
      setShowContactModal(false)
      toast.success('Contact updated successfully!')
    } catch (error) {
      console.error('Error updating contact:', error)
      toast.error('Failed to update contact')
    }
  }

  const handleDeleteContact = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactService.delete(contactId)
        setContacts(contacts.filter(c => c.id !== contactId))
        toast.success('Contact deleted successfully!')
      } catch (error) {
        console.error('Error deleting contact:', error)
        toast.error('Failed to delete contact')
      }
    }
  }
  const handleAddCompany = async (companyData) => {
    try {
      const newCompany = await companyService.create(companyData)
      setCompanies([...companies, newCompany])
      setShowCompanyModal(false)
      toast.success('Company added successfully!')
    } catch (error) {
      console.error('Error adding company:', error)
      toast.error('Failed to add company')
    }
  }

  const handleEditCompany = async (companyData) => {
    try {
      const updatedCompany = await companyService.update(editingCompany.id, companyData)
      setCompanies(companies.map(c => c.id === editingCompany.id ? updatedCompany : c))
      setEditingCompany(null)
      setShowCompanyModal(false)
      toast.success('Company updated successfully!')
    } catch (error) {
      console.error('Error updating company:', error)
      toast.error('Failed to update company')
    }
  }

  const handleDeleteCompany = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await companyService.delete(companyId)
        setCompanies(companies.filter(c => c.id !== companyId))
        toast.success('Company deleted successfully!')
      } catch (error) {
        console.error('Error deleting company:', error)
        toast.error('Failed to delete company')
      }
    }
  }

const handleAddContact = async (contactData) => {
    try {
      const newContact = await contactService.create(contactData)
      setContacts([...contacts, newContact])
      setShowContactModal(false)
      toast.success('Contact added successfully!')
    } catch (error) {
      console.error('Error adding contact:', error)
      toast.error('Failed to add contact')
    }
  }

  const handleTaskSubmit = async (e) => {
    e.preventDefault()
    if (!taskFormData.title?.trim()) {
      toast.error('Please enter a task title')
      return
    }

    try {
      setLoading(true)
      if (selectedTask) {
        await taskService.update(selectedTask.id, taskFormData)
        toast.success('Task updated successfully')
      } else {
        await taskService.create(taskFormData)
        toast.success('Task created successfully')
      }
      setShowTaskModal(false)
      setTaskFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        dueDate: '',
        assignedTo: ''
      })
      setSelectedTask(null)
      loadData()
    } catch (err) {
      toast.error(err?.message || 'Failed to save task')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!emailFormData.to?.trim() || !emailFormData.subject?.trim()) {
      toast.error('Please fill in recipient and subject fields')
      return
    }

    try {
      setLoading(true)
      const emailData = {
        ...emailFormData,
        timestamp: new Date().toISOString(),
        from: 'user@company.com', // Would come from current user
        status: 'sent'
      }
      
      await emailService.create(emailData)
      toast.success('Email sent successfully')
      setShowEmailCompose(false)
      setEmailFormData({
        to: '',
        subject: '',
        body: '',
        replyTo: null
      })
      loadData()
    } catch (err) {
      toast.error(err?.message || 'Failed to send email')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailReply = (email) => {
    setEmailFormData({
      to: email.from,
      subject: `Re: ${email.subject}`,
      body: `\n\n--- Original Message ---\nFrom: ${email.from}\nDate: ${format(new Date(email.timestamp), 'PPpp')}\nSubject: ${email.subject}\n\n${email.body}`,
      replyTo: email.id
    })
    setShowEmailCompose(true)
  }

  const handleEmailForward = (email) => {
    setEmailFormData({
      to: '',
      subject: `Fwd: ${email.subject}`,
      body: `\n\n--- Forwarded Message ---\nFrom: ${email.from}\nTo: ${email.to}\nDate: ${format(new Date(email.timestamp), 'PPpp')}\nSubject: ${email.subject}\n\n${email.body}`,
      replyTo: null
    })
    setShowEmailCompose(true)
  }

  const handleEmailDelete = async (emailId) => {
    if (!window.confirm('Are you sure you want to delete this email?')) return
    
    try {
      await emailService.delete(emailId)
      toast.success('Email deleted successfully')
      loadData()
    } catch (err) {
      toast.error(err?.message || 'Failed to delete email')
    }
  }

  const handleEmailMarkRead = async (emailId, isRead) => {
    try {
      const email = emails.find(e => e.id === emailId)
      await emailService.update(emailId, { ...email, isRead })
      toast.success(`Email marked as ${isRead ? 'read' : 'unread'}`)
      loadData()
    } catch (err) {
      toast.error('Failed to update email status')
    }
  }

  const handleTaskEdit = (task) => {
    setSelectedTask(task)
    setTaskFormData({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
      dueDate: task.dueDate || '',
      assignedTo: task.assignedTo || ''
    })
    setShowTaskModal(true)
  }

  const handleTaskDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    
    try {
      await taskService.delete(id)
      toast.success('Task deleted successfully')
      loadData()
    } catch (err) {
      toast.error(err?.message || 'Failed to delete task')
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

  const handleDelete = async (contactId) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) return
    
    try {
      await contactService.delete(contactId)
      toast.success('Contact deleted successfully')
      loadData()
    } catch (err) {
      toast.error(err?.message || 'Failed to delete contact')
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = `${contact.firstName} ${contact.lastName} ${contact.email} ${contact.company}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || contact.tags?.includes(selectedFilter)
    return matchesSearch && matchesFilter
  })

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = `${company.name} ${company.industry} ${company.size}`.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'small' && company.size === 'Small') ||
      (selectedFilter === 'medium' && company.size === 'Medium') ||
      (selectedFilter === 'large' && company.size === 'Large') ||
      (selectedFilter === 'enterprise' && company.size === 'Enterprise')
    return matchesSearch && matchesFilter
  })

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

  const filteredEmails = emails?.filter(email => {
    const matchesSearch = !emailSearchTerm || 
      email?.subject?.toLowerCase().includes(emailSearchTerm.toLowerCase()) ||
      email?.from?.toLowerCase().includes(emailSearchTerm.toLowerCase()) ||
      email?.body?.toLowerCase().includes(emailSearchTerm.toLowerCase())
    
    const matchesFilter = emailFilter === 'all' || 
      (emailFilter === 'unread' && !email?.isRead) ||
      (emailFilter === 'read' && email?.isRead)
    
    return matchesSearch && matchesFilter
  }) || []

  if (activeSection === 'dashboard') {
    return <Dashboard />
  }
    if (activeSection === 'companies') {
      return (
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Companies</h1>
              <p className="text-surface-600 dark:text-surface-400 mt-1">Manage your company relationships</p>
            </div>
            <motion.button
              onClick={() => {
                setEditingCompany(null)
                setShowCompanyModal(true)
              }}
              className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span>New Company</span>
            </motion.button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">All Sizes</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          {/* Companies Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompanies.map((company) => (
                <motion.div
                  key={company.id}
                  className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{company.name}</h3>
                      <p className="text-surface-600 dark:text-surface-400 text-sm">{company.industry}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      company.size === 'Small' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      company.size === 'Medium' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      company.size === 'Large' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    }`}>
                      {company.size}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-surface-600 dark:text-surface-400">
                      <ApperIcon name="Users" className="w-4 h-4" />
                      <span>{company.employees} employees</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-surface-600 dark:text-surface-400">
                      <ApperIcon name="Globe" className="w-4 h-4" />
                      <span className="truncate">{company.website}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-surface-600 dark:text-surface-400">
                      <ApperIcon name="MapPin" className="w-4 h-4" />
                      <span>{company.address.city}, {company.address.state}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingCompany(company)
                        setShowCompanyModal(true)
                      }}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                      <span className="text-sm">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCompany(company.id)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                      <span className="text-sm">Delete</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Company Modal */}
          {showCompanyModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
                    {editingCompany ? 'Edit Company' : 'Add New Company'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCompanyModal(false)
                      setEditingCompany(null)
                    }}
                    className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target)
                  const companyData = {
                    name: formData.get('name'),
                    industry: formData.get('industry'),
                    size: formData.get('size'),
                    employees: parseInt(formData.get('employees')),
                    website: formData.get('website'),
                    phone: formData.get('phone'),
                    email: formData.get('email'),
                    address: {
                      street: formData.get('street'),
                      city: formData.get('city'),
                      state: formData.get('state'),
                      zipCode: formData.get('zipCode'),
                      country: formData.get('country')
                    },
                    description: formData.get('description'),
                    founded: formData.get('founded'),
                    revenue: formData.get('revenue')
                  }
                  
                  if (editingCompany) {
                    handleEditCompany(companyData)
                  } else {
                    handleAddCompany(companyData)
                  }
                }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        defaultValue={editingCompany?.name}
                        required
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Industry *
                      </label>
                      <input
                        type="text"
                        name="industry"
                        defaultValue={editingCompany?.industry}
                        required
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Company Size *
                      </label>
                      <select
                        name="size"
                        defaultValue={editingCompany?.size}
                        required
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="">Select size</option>
                        <option value="Small">Small (1-50)</option>
                        <option value="Medium">Medium (51-250)</option>
                        <option value="Large">Large (251-1000)</option>
                        <option value="Enterprise">Enterprise (1000+)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Employees
                      </label>
                      <input
                        type="number"
                        name="employees"
                        defaultValue={editingCompany?.employees}
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        defaultValue={editingCompany?.website}
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        defaultValue={editingCompany?.phone}
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        defaultValue={editingCompany?.email}
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Founded
                      </label>
                      <input
                        type="text"
                        name="founded"
                        defaultValue={editingCompany?.founded}
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Revenue Range
                    </label>
                    <select
                      name="revenue"
                      defaultValue={editingCompany?.revenue}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select revenue range</option>
                      <option value="<$1M">Less than $1M</option>
                      <option value="$1M - $10M">$1M - $10M</option>
                      <option value="$10M - $50M">$10M - $50M</option>
                      <option value="$50M - $100M">$50M - $100M</option>
                      <option value="$100M - $500M">$100M - $500M</option>
                      <option value="$500M+">$500M+</option>
                      <option value="$1B+">$1B+</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="street"
                        defaultValue={editingCompany?.address?.street}
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        defaultValue={editingCompany?.address?.city}
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        defaultValue={editingCompany?.address?.state}
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        defaultValue={editingCompany?.address?.zipCode}
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      defaultValue={editingCompany?.address?.country || 'USA'}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows="3"
                      defaultValue={editingCompany?.description}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-xl hover:shadow-lg transition-all"
                    >
                      {editingCompany ? 'Update Company' : 'Add Company'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCompanyModal(false)
                        setEditingCompany(null)
                      }}
                      className="flex-1 bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 py-2 px-4 rounded-xl hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </div>
      )
    }

if (activeSection === 'activities') {
      return <ActivityTimeline />
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
          
          {activeSection === 'pipeline' && (
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // TODO: Implement deal creation modal
                  console.log('Add new deal clicked')
                }}
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
                <span>New Deal</span>
              </motion.button>
            </div>
          )}
          
          {activeSection === 'tasks' && (
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedTask(null)
                  setTaskFormData({
                    title: '',
                    description: '',
                    priority: 'medium',
                    status: 'pending',
                    dueDate: '',
                    assignedTo: ''
                  })
                  setShowTaskModal(true)
                }}
                className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
              >
                <ApperIcon name="Plus" className="w-4 h-4" />
                <span>New Task</span>
              </motion.button>
            </div>
          )}
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
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleTaskEdit(task)}
                              className="p-2 text-surface-400 hover:text-primary rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors"
                            >
                              <ApperIcon name="Edit" className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleTaskDelete(task.id)}
                              className="p-2 text-surface-400 hover:text-red-500 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </motion.button>
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
              className="h-full"
            >
              <div className="grid gap-6 h-full">
                {/* Email Toolbar */}
                <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-2xl border border-surface-200 dark:border-surface-700 p-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative">
                        <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
                        <input
                          type="text"
                          placeholder="Search emails..."
                          value={emailSearchTerm}
                          onChange={(e) => setEmailSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 w-full sm:w-80 border border-surface-300 dark:border-surface-600 rounded-xl bg-white/90 dark:bg-surface-800/90 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                      </div>
                      <select
                        value={emailFilter}
                        onChange={(e) => setEmailFilter(e.target.value)}
                        className="px-4 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white/90 dark:bg-surface-800/90 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      >
                        <option value="all">All Emails</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                      </select>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setEmailFormData({
                          to: '',
                          subject: '',
                          body: '',
                          replyTo: null
                        })
                        setShowEmailCompose(true)
                      }}
                      className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <ApperIcon name="Plus" className="w-4 h-4" />
                      <span>Compose</span>
                    </motion.button>
                  </div>
                </div>

                {/* Email List */}
                <div className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden">
                  <div className="divide-y divide-surface-200 dark:divide-surface-700">
                    {filteredEmails.length === 0 ? (
                      <div className="p-12 text-center">
                        <ApperIcon name="Mail" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                        <p className="text-surface-600 dark:text-surface-400">No emails found</p>
                      </div>
                    ) : (
                      filteredEmails.map((email) => (
                        <motion.div
                          key={email.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`p-6 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors cursor-pointer ${
                            !email?.isRead ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                          }`}
                          onClick={() => setSelectedEmail(email)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                                {email?.from?.charAt(0)?.toUpperCase() || 'U'}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className={`font-medium truncate ${
                                    !email?.isRead ? 'text-surface-900 dark:text-white' : 'text-surface-700 dark:text-surface-300'
                                  }`}>
                                    {email?.from || 'Unknown Sender'}
                                  </p>
                                  <span className="text-xs text-surface-500 ml-2">
                                    {email?.timestamp ? format(new Date(email.timestamp), 'MMM dd, HH:mm') : ''}
                                  </span>
                                </div>
                                <h4 className={`font-medium mb-1 truncate ${
                                  !email?.isRead ? 'text-surface-900 dark:text-white' : 'text-surface-700 dark:text-surface-300'
                                }`}>
                                  {email?.subject || 'No Subject'}
                                </h4>
                                <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-2">
                                  {email?.body || 'No content'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              {!email?.isRead && (
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
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

      {/* Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowTaskModal(false)}
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
                  {selectedTask ? 'Edit Task' : 'Add New Task'}
                </h3>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <form onSubmit={handleTaskSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={taskFormData.title}
                    onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={taskFormData.description}
                    onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={taskFormData.priority}
                      onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Status
                    </label>
                    <select
                      value={taskFormData.status}
                      onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskFormData.dueDate}
                    onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Assigned To
                  </label>
                  <input
                    type="text"
                    value={taskFormData.assignedTo}
                    onChange={(e) => setTaskFormData({ ...taskFormData, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="Enter name or email"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTaskModal(false)}
                    className="px-4 py-2 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : (selectedTask ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
</AnimatePresence>

      {/* Email Compose Modal */}
      <AnimatePresence>
        {showEmailCompose && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowEmailCompose(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-surface-900 dark:text-white">
                  Compose Email
                </h3>
                <button
                  onClick={() => setShowEmailCompose(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    To *
                  </label>
                  <input
                    type="email"
                    value={emailFormData.to}
                    onChange={(e) => setEmailFormData({ ...emailFormData, to: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="recipient@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={emailFormData.subject}
                    onChange={(e) => setEmailFormData({ ...emailFormData, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="Email subject"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={emailFormData.body}
                    onChange={(e) => setEmailFormData({ ...emailFormData, body: e.target.value })}
                    rows={10}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="Type your message here..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEmailCompose(false)}
                    className="px-4 py-2 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center space-x-2"
                  >
                    <ApperIcon name="Send" className="w-4 h-4" />
                    <span>{loading ? 'Sending...' : 'Send'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Detail Modal */}
      <AnimatePresence>
        {selectedEmail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedEmail(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-surface-900 dark:text-white mb-2">
                    {selectedEmail?.subject || 'No Subject'}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-surface-600 dark:text-surface-400">
                    <span>From: {selectedEmail?.from}</span>
                    <span>To: {selectedEmail?.to}</span>
                    <span>{selectedEmail?.timestamp ? format(new Date(selectedEmail.timestamp), 'PPpp') : ''}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmail(null)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <div className="border-t border-surface-200 dark:border-surface-700 pt-6 mb-6">
                <div className="whitespace-pre-wrap text-surface-900 dark:text-white">
                  {selectedEmail?.body || 'No content'}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-surface-200 dark:border-surface-700">
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleEmailReply(selectedEmail)
                      setSelectedEmail(null)
                    }}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <ApperIcon name="Reply" className="w-4 h-4" />
                    <span>Reply</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleEmailForward(selectedEmail)
                      setSelectedEmail(null)
                    }}
                    className="px-4 py-2 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors flex items-center space-x-2"
                  >
                    <ApperIcon name="Forward" className="w-4 h-4" />
                    <span>Forward</span>
                  </motion.button>
                </div>
                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleEmailMarkRead(selectedEmail.id, !selectedEmail.isRead)}
                    className="px-4 py-2 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors flex items-center space-x-2"
                  >
                    <ApperIcon name={selectedEmail.isRead ? "Mail" : "MailOpen"} className="w-4 h-4" />
                    <span>{selectedEmail.isRead ? 'Mark Unread' : 'Mark Read'}</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      handleEmailDelete(selectedEmail.id)
                      setSelectedEmail(null)
                    }}
                    className="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                    <span>Delete</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature