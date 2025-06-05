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
  const [quotes, setQuotes] = useState([])
  const [salesOrders, setSalesOrders] = useState([])
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
  const [selectedContactDetail, setSelectedContactDetail] = useState(null)
  const [showContactDetailModal, setShowContactDetailModal] = useState(false)
  const [selectedCompanyDetail, setSelectedCompanyDetail] = useState(null)
  const [showCompanyDetailModal, setShowCompanyDetailModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [selectedEmail, setSelectedEmail] = useState(null)
const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showEmailCompose, setShowEmailCompose] = useState(false)
  const [replyingTo, setReplyingTo] = useState(null)
  const [emailContent, setEmailContent] = useState({ to: '', subject: '', body: '' })
  const [emailSearchTerm, setEmailSearchTerm] = useState('')
  const [emailFilter, setEmailFilter] = useState('all')
const [showNotesModal, setShowNotesModal] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState(null)
  const [notes, setNotes] = useState([])
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false)
  const [selectedTaskDetail, setSelectedTaskDetail] = useState(null)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [showQuoteDetailModal, setShowQuoteDetailModal] = useState(false)
  const [selectedQuoteDetail, setSelectedQuoteDetail] = useState(null)
  const [editingQuote, setEditingQuote] = useState(null)
  const [showSalesOrderModal, setShowSalesOrderModal] = useState(false)
  const [showSalesOrderDetailModal, setShowSalesOrderDetailModal] = useState(false)
  const [selectedSalesOrderDetail, setSelectedSalesOrderDetail] = useState(null)
  const [editingSalesOrder, setEditingSalesOrder] = useState(null)
  const [teamMembers] = useState([
    { id: 1, name: 'John Smith', username: 'john.smith', email: 'john.smith@company.com', role: 'Sales Manager' },
    { id: 2, name: 'Jane Doe', username: 'jane.doe', email: 'jane.doe@company.com', role: 'Account Executive' },
    { id: 3, name: 'Mike Johnson', username: 'mike.johnson', email: 'mike.johnson@company.com', role: 'Sales Representative' },
    { id: 4, name: 'Sarah Wilson', username: 'sarah.wilson', email: 'sarah.wilson@company.com', role: 'Legal Counsel' },
    { id: 5, name: 'David Chen', username: 'david.chen', email: 'david.chen@company.com', role: 'Marketing Manager' }
])
const [draggedDeal, setDraggedDeal] = useState(null)
  const [showDealModal, setShowDealModal] = useState(false)
  const [selectedDealDetail, setSelectedDealDetail] = useState(null)
  const [showDealDetailModal, setShowDealDetailModal] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: ''
  })
const [quoteFormData, setQuoteFormData] = useState({
    title: '',
    description: '',
    amount: '',
    contactId: '',
    companyId: '',
    status: 'draft',
    validUntil: '',
    items: []
  })

  const [salesOrderFormData, setSalesOrderFormData] = useState({
    orderNumber: '',
    title: '',
    description: '',
    amount: '',
    contactId: '',
    companyId: '',
    status: 'pending',
    expectedDelivery: '',
    items: []
  })

useEffect(() => {
    if (activeSection === 'contacts') {
      loadContacts()
    } else if (activeSection === 'companies') {
      loadCompanies()
    } else if (activeSection === 'pipeline') {
      loadDeals()
    } else if (activeSection === 'quotes') {
      loadQuotes()
    } else if (activeSection === 'salesorders') {
      loadSalesOrders()
    } else if (activeSection === 'tasks') {
      loadTasks()
    } else if (activeSection === 'emails') {
      loadEmails()
    }
  }, [activeSection])
// Clear company and quote details when switching away from their sections
  useEffect(() => {
    if (activeSection !== 'companies') {
      setSelectedCompanyDetail(null)
      setShowCompanyDetailModal(false)
    }
    if (activeSection !== 'quotes') {
      setSelectedQuoteDetail(null)
      setShowQuoteDetailModal(false)
    }
  }, [activeSection])

  // Auto-show company details modal when company is selected
  useEffect(() => {
    if (selectedCompanyDetail && !showCompanyDetailModal) {
      setShowCompanyDetailModal(true)
    }
  }, [selectedCompanyDetail, showCompanyDetailModal])

  // Auto-show quote details modal when quote is selected
  useEffect(() => {
    if (selectedQuoteDetail && !showQuoteDetailModal) {
      setShowQuoteDetailModal(true)
    }
  }, [selectedQuoteDetail, showQuoteDetailModal])

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

  const [dealFormData, setDealFormData] = useState({
    title: '',
    value: '',
    contactId: '',
    stage: 'lead',
    probability: 50,
    expectedCloseDate: ''
})

const pipelineStages = [
    { id: 'lead', label: 'Lead', color: 'bg-gray-400' },
    { id: 'qualified', label: 'Qualified', color: 'bg-blue-400' },
    { id: 'proposal', label: 'Proposal', color: 'bg-yellow-400' },
    { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-400' },
    { id: 'closed-won', label: 'Closed Won', color: 'bg-green-400' },
    { id: 'closed-lost', label: 'Closed Lost', color: 'bg-red-400' }
  ]

  const salesOrderStages = [
    { id: 'pending', label: 'Pending', color: 'bg-yellow-400' },
    { id: 'confirmed', label: 'Confirmed', color: 'bg-blue-400' },
    { id: 'processing', label: 'Processing', color: 'bg-orange-400' },
    { id: 'shipped', label: 'Shipped', color: 'bg-purple-400' },
    { id: 'delivered', label: 'Delivered', color: 'bg-green-400' },
    { id: 'cancelled', label: 'Cancelled', color: 'bg-red-400' }
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

const loadQuotes = async () => {
    try {
      setLoading(true)
      const { quoteService } = await import('../services')
      const data = await quoteService.getAll()
      setQuotes(data)
    } catch (error) {
      console.error('Error loading quotes:', error)
      toast.error('Failed to load quotes')
    } finally {
      setLoading(false)
    }
  }

  const loadSalesOrders = async () => {
    try {
      setLoading(true)
      const { salesOrderService } = await import('../services')
      const data = await salesOrderService.getAll()
      setSalesOrders(data)
    } catch (error) {
      console.error('Error loading sales orders:', error)
      toast.error('Failed to load sales orders')
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
      } else if (activeSection === 'quotes') {
        loadQuotes()
      } else if (activeSection === 'salesorders') {
        loadSalesOrders()
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
company: contact.company || '',
      phone: contact.phone || '',
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
const handleContactClick = (contact) => {
    setSelectedContactDetail(contact)
    setShowContactDetailModal(true)
  }

const handleCompanyClick = (company) => {
    setSelectedCompanyDetail(company)
    setShowCompanyDetailModal(true)
  }

  const handleDealClick = (deal) => {
    setSelectedDealDetail(deal)
    setShowDealDetailModal(true)
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

const handleDealSubmit = async (e) => {
    e.preventDefault()
    
    // Enhanced validation
    if (!dealFormData.title?.trim()) {
      toast.error('Deal title is required')
      return
    }
    
    if (!dealFormData.value || isNaN(parseFloat(dealFormData.value)) || parseFloat(dealFormData.value) <= 0) {
      toast.error('Please enter a valid deal value greater than 0')
      return
    }

    try {
      setLoading(true)
      
      // Prepare deal data with proper validation
      const dealData = {
        title: dealFormData.title.trim(),
        value: parseFloat(dealFormData.value),
        stage: dealFormData.stage || 'lead',
        probability: parseInt(dealFormData.probability) || 50,
        expectedCloseDate: dealFormData.expectedCloseDate || '',
        contactId: dealFormData.contactId || '',
        createdAt: new Date().toISOString()
      }
      
      console.log('Submitting deal data:', dealData)
      
      const result = await dealService.create(dealData)
      console.log('Deal created successfully:', result)
      
      toast.success('Deal created successfully')
      setShowDealModal(false)
      setDealFormData({
        title: '',
        value: '',
        contactId: '',
        stage: 'lead',
        probability: 50,
        expectedCloseDate: ''
      })
      loadData()
    } catch (err) {
      console.error('Error in handleDealSubmit:', err)
      
      // Provide more specific error messages
      if (err.message.includes('title is required')) {
        toast.error('Deal title is required')
      } else if (err.message.includes('value is required')) {
        toast.error('Deal value is required')
      } else if (err.message.includes('ApperSDK')) {
        toast.error('Connection error - please refresh the page and try again')
      } else if (err.message.includes('configuration')) {
        toast.error('System configuration error - please contact support')
      } else {
        toast.error(err?.message || 'Failed to create deal - please try again')
      }
    } finally {
      setLoading(false)
    }
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

const handleAddNote = async (noteData) => {
    try {
      // Extract tagged users from content
      const tagMatches = noteData.content.match(/@[\w.]+/g) || []
      const taggedUsers = tagMatches.map(tag => {
        const username = tag.slice(1) // Remove @ symbol
        return teamMembers.find(member => member.username === username)
      }).filter(Boolean) // Remove any undefined matches

      const newNote = {
        id: Date.now(),
        content: noteData.content,
        entityType: selectedEntity?.type,
        entityId: selectedEntity?.data?.id,
        author: { name: 'Current User', username: 'current.user' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        taggedUsers: taggedUsers
      }
      setNotes([...notes, newNote])
      toast.success('Note added successfully')
      
      // Notify tagged users
      if (taggedUsers.length > 0) {
        toast.info(`Tagged ${taggedUsers.length} team member${taggedUsers.length > 1 ? 's' : ''}`)
      }
    } catch (error) {
      toast.error('Failed to add note')
    }
  }

  const handleEditNote = async (noteId, newContent) => {
    try {
      setNotes(notes.map(note => 
        note.id === noteId 
          ? { ...note, content: newContent, updatedAt: new Date().toISOString() }
          : note
      ))
      toast.success('Note updated successfully')
    } catch (error) {
      toast.error('Failed to update note')
    }
  }

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return
    
    try {
      setNotes(notes.filter(note => note.id !== noteId))
      toast.success('Note deleted successfully')
    } catch (error) {
      toast.error('Failed to delete note')
    }
  }

const handleQuoteClick = (quote) => {
    setSelectedQuoteDetail(quote)
    setShowQuoteDetailModal(true)
  }

  const handleSalesOrderClick = (salesOrder) => {
    setSelectedSalesOrderDetail(salesOrder)
    setShowSalesOrderDetailModal(true)
  }

  const handleQuoteSubmit = async (e) => {
    e.preventDefault()
    if (!quoteFormData.title?.trim() || !quoteFormData.amount) {
      toast.error('Please fill in title and amount fields')
      return
    }

    try {
      setLoading(true)
      const quoteData = {
        ...quoteFormData,
        amount: parseFloat(quoteFormData.amount),
        id: editingQuote ? editingQuote.id : Date.now(),
        createdAt: editingQuote ? editingQuote.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      if (editingQuote) {
        setQuotes(quotes.map(q => q.id === editingQuote.id ? quoteData : q))
        toast.success('Quote updated successfully')
      } else {
        setQuotes([...quotes, quoteData])
        toast.success('Quote created successfully')
      }
      
      setShowQuoteModal(false)
      setQuoteFormData({
        title: '',
        description: '',
        amount: '',
        contactId: '',
        companyId: '',
        status: 'draft',
        validUntil: '',
        items: []
      })
      setEditingQuote(null)
    } catch (err) {
      toast.error(err?.message || 'Failed to save quote')
    } finally {
      setLoading(false)
    }
  }

  const handleSalesOrderSubmit = async (e) => {
    e.preventDefault()
    if (!salesOrderFormData.title?.trim() || !salesOrderFormData.amount) {
      toast.error('Please fill in title and amount fields')
      return
    }

    try {
      setLoading(true)
      const orderData = {
        ...salesOrderFormData,
        amount: parseFloat(salesOrderFormData.amount),
        id: editingSalesOrder ? editingSalesOrder.id : Date.now(),
        orderNumber: editingSalesOrder ? editingSalesOrder.orderNumber : `SO-2024-${String(salesOrders.length + 1).padStart(3, '0')}`,
        createdAt: editingSalesOrder ? editingSalesOrder.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      if (editingSalesOrder) {
        setSalesOrders(salesOrders.map(so => so.id === editingSalesOrder.id ? orderData : so))
        toast.success('Sales order updated successfully')
      } else {
        setSalesOrders([...salesOrders, orderData])
        toast.success('Sales order created successfully')
      }
      
      setShowSalesOrderModal(false)
      setSalesOrderFormData({
        orderNumber: '',
        title: '',
        description: '',
        amount: '',
        contactId: '',
        companyId: '',
        status: 'pending',
        expectedDelivery: '',
        items: []
      })
      setEditingSalesOrder(null)
    } catch (err) {
      toast.error(err?.message || 'Failed to save sales order')
    } finally {
      setLoading(false)
    }
  }

  const handleQuoteDelete = async (quoteId) => {
    if (!window.confirm('Are you sure you want to delete this quote?')) return
    
    try {
      setQuotes(quotes.filter(q => q.id !== quoteId))
      toast.success('Quote deleted successfully')
    } catch (err) {
      toast.error('Failed to delete quote')
    }
  }

  const handleSalesOrderDelete = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this sales order?')) return
    
    try {
      setSalesOrders(salesOrders.filter(so => so.id !== orderId))
      toast.success('Sales order deleted successfully')
    } catch (err) {
      toast.error('Failed to delete sales order')
    }
  }

  const handleConvertQuoteToDeal = async (quote) => {
    try {
      const dealData = {
        id: Date.now(),
        title: quote.title,
        value: quote.amount,
        contactId: quote.contactId,
        stage: 'proposal',
        probability: 75,
        expectedCloseDate: quote.validUntil,
        createdAt: new Date().toISOString()
      }
      
      setDeals([...deals, dealData])
      toast.success('Quote converted to deal successfully')
      setShowQuoteDetailModal(false)
    } catch (err) {
      toast.error('Failed to convert quote to deal')
    }
  }

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
                  className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleCompanyClick(company)}
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
                      <span>{company.address?.city && company.address?.state ? `${company.address.city}, ${company.address.state}` : 'Unknown location'}</span>
                    </div>
                  </div>
<div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingCompany(company)
                        setShowCompanyModal(true)
                      }}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                      <span className="text-sm">Edit</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteCompany(company.id)
                      }}
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
    if (activeSection === 'quotes') {
      return (
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Quotes</h1>
              <p className="text-surface-600 dark:text-surface-400 mt-1">Manage your quote proposals</p>
            </div>
            <motion.button
              onClick={() => {
                setEditingQuote(null)
                setQuoteFormData({
                  title: '',
                  description: '',
                  amount: '',
                  contactId: '',
                  companyId: '',
                  status: 'draft',
                  validUntil: '',
                  items: []
                })
                setShowQuoteModal(true)
              }}
              className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span>New Quote</span>
            </motion.button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search quotes..."
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
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Quotes Grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quotes.map((quote) => (
                <motion.div
                  key={quote.id}
                  className="bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-card border border-surface-200 dark:border-surface-700 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleQuoteClick(quote)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{quote.title}</h3>
                      <p className="text-surface-600 dark:text-surface-400 text-sm">{quote.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                      quote.status === 'draft' ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300' :
                      quote.status === 'sent' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      quote.status === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {quote.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">${quote.amount?.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-surface-600 dark:text-surface-400">
                      <ApperIcon name="User" className="w-4 h-4" />
                      <span>{quote.contactId}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-surface-600 dark:text-surface-400">
                      <ApperIcon name="Building2" className="w-4 h-4" />
                      <span>{quote.companyId}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-surface-600 dark:text-surface-400">
                      <ApperIcon name="Calendar" className="w-4 h-4" />
                      <span>Valid until: {quote.validUntil ? format(new Date(quote.validUntil), 'MMM dd, yyyy') : 'No expiry'}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingQuote(quote)
                        setQuoteFormData({
                          title: quote.title,
                          description: quote.description,
                          amount: quote.amount.toString(),
                          contactId: quote.contactId,
                          companyId: quote.companyId,
                          status: quote.status,
                          validUntil: quote.validUntil,
                          items: quote.items || []
                        })
                        setShowQuoteModal(true)
                      }}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                      <span className="text-sm">Edit</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleQuoteDelete(quote.id)
                      }}
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

          {/* Quote Modal */}
          {showQuoteModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
                    {editingQuote ? 'Edit Quote' : 'Create New Quote'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowQuoteModal(false)
                      setEditingQuote(null)
                    }}
                    className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                  </button>
                </div>

                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Quote Title *
                    </label>
                    <input
                      type="text"
                      value={quoteFormData.title}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, title: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={quoteFormData.description}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, description: e.target.value })}
                      rows="3"
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Amount *
                      </label>
                      <input
                        type="number"
                        value={quoteFormData.amount}
                        onChange={(e) => setQuoteFormData({ ...quoteFormData, amount: e.target.value })}
                        required
                        step="0.01"
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Status
                      </label>
                      <select
                        value={quoteFormData.status}
                        onChange={(e) => setQuoteFormData({ ...quoteFormData, status: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Contact
                      </label>
                      <select
                        value={quoteFormData.contactId}
                        onChange={(e) => setQuoteFormData({ ...quoteFormData, contactId: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
>
                        <option value="">Select contact</option>
                        {contacts.map((contact) => (
                          <option key={contact.id} value={contact.email}>
                            {contact.firstName} {contact.lastName} - {contact.email}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Company
                      </label>
                      <select
                        value={quoteFormData.companyId}
                        onChange={(e) => setQuoteFormData({ ...quoteFormData, companyId: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
>
                        <option value="">Select company</option>
                        {companies.map((company) => (
                          <option key={company.id} value={company.name}>
                            {company.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      value={quoteFormData.validUntil}
                      onChange={(e) => setQuoteFormData({ ...quoteFormData, validUntil: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-xl hover:shadow-lg transition-all"
                    >
                      {editingQuote ? 'Update Quote' : 'Create Quote'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowQuoteModal(false)
                        setEditingQuote(null)
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

    if (activeSection === 'salesorders') {
      return (
        <div className="p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-surface-900 dark:text-white">Sales Orders</h1>
              <p className="text-surface-600 dark:text-surface-400 mt-1">Track and manage sales orders</p>
            </div>
            <motion.button
              onClick={() => {
                setEditingSalesOrder(null)
                setSalesOrderFormData({
                  orderNumber: '',
                  title: '',
                  description: '',
                  amount: '',
                  contactId: '',
                  companyId: '',
                  status: 'pending',
                  expectedDelivery: '',
                  items: []
                })
                setShowSalesOrderModal(true)
              }}
              className="mt-4 sm:mt-0 flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span>New Sales Order</span>
            </motion.button>
          </div>

          {/* Sales Order Pipeline */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 h-full overflow-x-auto">
              {salesOrderStages.map((stage) => (
                <div
                  key={stage.id}
                  className="bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl rounded-2xl border border-surface-200 dark:border-surface-700 p-4 min-w-80 sm:min-w-0"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    <h3 className="font-semibold text-surface-900 dark:text-white">{stage.label}</h3>
                    <span className="text-xs text-surface-500 bg-surface-100 dark:bg-surface-700 px-2 py-1 rounded-full">
                      {salesOrders?.filter(order => order?.status === stage.id)?.length || 0}
                    </span>
                  </div>
                  <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
                    {salesOrders?.filter(order => order?.status === stage.id)?.map((order) => (
                      <motion.div
                        key={order.id}
                        onClick={() => handleSalesOrderClick(order)}
                        className="p-4 bg-surface-50 dark:bg-surface-700 rounded-xl border border-surface-200 dark:border-surface-600 cursor-pointer hover:shadow-lg transition-all"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-surface-900 dark:text-white text-sm">{order?.orderNumber}</h4>
                          <span className="text-xs text-surface-500 bg-surface-200 dark:bg-surface-600 px-2 py-1 rounded">
                            {order?.status}
                          </span>
                        </div>
                        <h5 className="font-medium text-surface-900 dark:text-white mb-2">{order?.title || 'Untitled Order'}</h5>
                        <p className="text-lg font-bold text-primary mb-2">
                          ${order?.amount?.toLocaleString() || '0'}
                        </p>
                        <div className="text-sm text-surface-600 dark:text-surface-400">
                          <p className="truncate">{order?.contactId}</p>
                          <p className="truncate">{order?.companyId}</p>
                          {order?.expectedDelivery && (
                            <p>Due: {format(new Date(order.expectedDelivery), 'MMM dd')}</p>
                          )}
                        </div>
                      </motion.div>
                    )) || []}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sales Order Modal */}
          {showSalesOrderModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
                    {editingSalesOrder ? 'Edit Sales Order' : 'Create New Sales Order'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowSalesOrderModal(false)
                      setEditingSalesOrder(null)
                    }}
                    className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
                  >
                    <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                  </button>
                </div>

                <form onSubmit={handleSalesOrderSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Order Title *
                    </label>
                    <input
                      type="text"
                      value={salesOrderFormData.title}
                      onChange={(e) => setSalesOrderFormData({ ...salesOrderFormData, title: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Description
                    </label>
                    <textarea
                      value={salesOrderFormData.description}
                      onChange={(e) => setSalesOrderFormData({ ...salesOrderFormData, description: e.target.value })}
                      rows="3"
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Amount *
                      </label>
                      <input
                        type="number"
                        value={salesOrderFormData.amount}
                        onChange={(e) => setSalesOrderFormData({ ...salesOrderFormData, amount: e.target.value })}
                        required
                        step="0.01"
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Status
                      </label>
                      <select
                        value={salesOrderFormData.status}
                        onChange={(e) => setSalesOrderFormData({ ...salesOrderFormData, status: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Contact
                      </label>
                      <select
                        value={salesOrderFormData.contactId}
                        onChange={(e) => setSalesOrderFormData({ ...salesOrderFormData, contactId: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
>
                        <option value="">Select contact</option>
                        {contacts.map((contact) => (
                          <option key={contact.id} value={contact.email}>
                            {contact.firstName} {contact.lastName} - {contact.email}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                        Company
                      </label>
                      <select
                        value={salesOrderFormData.companyId}
                        onChange={(e) => setSalesOrderFormData({ ...salesOrderFormData, companyId: e.target.value })}
                        className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
>
                        <option value="">Select company</option>
                        {companies.map((company) => (
                          <option key={company.id} value={company.name}>
                            {company.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Expected Delivery
                    </label>
                    <input
                      type="date"
                      value={salesOrderFormData.expectedDelivery}
                      onChange={(e) => setSalesOrderFormData({ ...salesOrderFormData, expectedDelivery: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-xl bg-white dark:bg-surface-800 text-surface-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-primary to-secondary text-white py-2 px-4 rounded-xl hover:shadow-lg transition-all"
                    >
                      {editingSalesOrder ? 'Update Order' : 'Create Order'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSalesOrderModal(false)
                        setEditingSalesOrder(null)
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
              {activeSection === 'quotes' && 'Create and manage quote proposals'}
              {activeSection === 'salesorders' && 'Track and manage sales orders'}
            </p>
          </div>
          
          {activeSection === 'pipeline' && (
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
onClick={() => {
                  setDealFormData({
                    title: '',
                    value: '',
                    contactId: '',
                    stage: 'lead',
                    probability: 50,
                    expectedCloseDate: ''
                  })
                  setShowDealModal(true)
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
                            className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors cursor-pointer"
                            onClick={() => handleContactClick(contact)}
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
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEdit(contact)
                                  }}
                                  className="p-2 text-surface-400 hover:text-primary rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors"
                                >
                                  <ApperIcon name="Edit" className="w-4 h-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDelete(contact.id)
                                  }}
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
                          onClick={() => handleDealClick(deal)}
                          className="p-4 bg-surface-50 dark:bg-surface-700 rounded-xl border border-surface-200 dark:border-surface-600 cursor-pointer hover:shadow-lg transition-all"
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
                          <div className="mt-3 pt-3 border-t border-surface-200 dark:border-surface-600">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedEntity({ type: 'deal', data: deal })
                                setShowNotesModal(true)
                              }}
                              className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-surface-100 dark:bg-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-500 transition-colors"
                            >
                              <ApperIcon name="MessageSquare" className="w-4 h-4" />
                              <span className="text-sm">Notes</span>
                            </motion.button>
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
                          className="flex items-start space-x-4 p-4 border border-surface-200 dark:border-surface-600 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedTaskDetail(task)
                            setShowTaskDetailModal(true)
                          }}
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
                              onClick={(e) => {
                                e.stopPropagation()
                                handleTaskEdit(task)
                              }}
                              className="p-2 text-surface-400 hover:text-primary rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors"
                            >
                              <ApperIcon name="Edit" className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleTaskDelete(task.id)
                              }}
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
                  <select
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
>
                    <option value="">Select company</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.name}>
                        {company.name}
                      </option>
                    ))}
                  </select>
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
      {/* Notes Modal */}
      <AnimatePresence>
        {showNotesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowNotesModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-surface-900 dark:text-white">
                    Internal Notes
                  </h3>
                  <p className="text-surface-600 dark:text-surface-400 text-sm">
                    {selectedEntity?.type === 'contact' ? 'Contact:' : 'Deal:'} {selectedEntity?.data?.firstName ? `${selectedEntity.data.firstName} ${selectedEntity.data.lastName}` : selectedEntity?.data?.title || selectedEntity?.data?.name}
                  </p>
                </div>
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col">
                {/* Notes List */}
                <div className="flex-1 overflow-y-auto mb-6 space-y-4">
                  {notes.length === 0 ? (
                    <div className="text-center py-12">
                      <ApperIcon name="MessageSquare" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
                      <p className="text-surface-600 dark:text-surface-400">No notes yet</p>
                      <p className="text-surface-500 dark:text-surface-500 text-sm">Add the first internal note below</p>
                    </div>
                  ) : (
                    notes.map((note) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-surface-50 dark:bg-surface-700/50 rounded-xl p-4 border border-surface-200 dark:border-surface-600"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {note.author?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="font-medium text-surface-900 dark:text-white text-sm">
                                {note.author?.name || 'Unknown User'}
                              </p>
                              <p className="text-surface-500 dark:text-surface-400 text-xs">
                                {format(new Date(note.createdAt), 'MMM dd, yyyy HH:mm')}
                                {note.updatedAt !== note.createdAt && ' (edited)'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => {
                                const newContent = prompt('Edit note:', note.content)
                                if (newContent !== null && newContent !== note.content) {
                                  handleEditNote(note.id, newContent)
                                }
                              }}
                              className="p-1 text-surface-400 hover:text-primary rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors"
                            >
                              <ApperIcon name="Edit" className="w-3 h-3" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteNote(note.id)}
                              className="p-1 text-surface-400 hover:text-red-500 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-600 transition-colors"
                            >
                              <ApperIcon name="Trash2" className="w-3 h-3" />
                            </motion.button>
                          </div>
                        </div>
                        <div className="text-surface-700 dark:text-surface-300 text-sm whitespace-pre-wrap mb-2">
                          {note.content?.split(/(@[\w.]+)/g).map((part, index) => {
                            if (part.startsWith('@')) {
                              const username = part.slice(1)
                              const taggedUser = note.taggedUsers?.find(user => user.username === username)
                              return (
                                <span
                                  key={index}
                                  className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1 rounded"
                                  title={taggedUser ? `${taggedUser.name} (${taggedUser.username})` : username}
                                >
                                  {part}
                                </span>
                              )
                            }
                            return part
                          })}
                        </div>
                        {note.taggedUsers && note.taggedUsers.length > 0 && (
                          <div className="flex items-center space-x-2 text-xs">
                            <ApperIcon name="Users" className="w-3 h-3 text-surface-400" />
                            <span className="text-surface-500 dark:text-surface-400">
                              Tagged: {note.taggedUsers.map(user => user.name).join(', ')}
                            </span>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>

{/* Add Note Form */}
                <div className="border-t border-surface-200 dark:border-surface-700 pt-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                        Add Internal Note
                      </label>
                      <TaggingInput 
                        teamMembers={teamMembers}
                        onSubmit={(content) => {
                          if (content?.trim()) {
                            handleAddNote({ content })
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
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

      {/* Deal Modal */}
      <AnimatePresence>
        {showDealModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDealModal(false)}
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
                  Add New Deal
                </h3>
                <button
                  onClick={() => setShowDealModal(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <form onSubmit={handleDealSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Deal Title *
                  </label>
                  <input
                    type="text"
                    value={dealFormData.title}
                    onChange={(e) => setDealFormData({ ...dealFormData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="Enter deal title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Deal Value *
                  </label>
                  <input
                    type="number"
                    value={dealFormData.value}
                    onChange={(e) => setDealFormData({ ...dealFormData, value: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Contact
                    </label>
                    <select
                      value={dealFormData.contactId}
                      onChange={(e) => setDealFormData({ ...dealFormData, contactId: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
>
                      <option value="">Select contact</option>
                      {contacts.map((contact) => (
                        <option key={contact.id} value={contact.email}>
                          {contact.firstName} {contact.lastName} - {contact.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Company
                    </label>
                    <select
                      value={dealFormData.companyId}
value={dealFormData.companyId}
                      onChange={(e) => setDealFormData({ ...dealFormData, companyId: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
>
                      <option value="">Select company</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.name}>
                          {company.name}
                        </option>
))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Stage
                    </label>
                    <select
                      value={dealFormData.stage}
                      onChange={(e) => setDealFormData({ ...dealFormData, stage: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    >
                      <option value="lead">Lead</option>
                      <option value="qualified">Qualified</option>
                      <option value="proposal">Proposal</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="closed-won">Closed Won</option>
                      <option value="closed-lost">Closed Lost</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Probability (%)
                    </label>
                    <input
                      type="number"
                      value={dealFormData.probability}
                      onChange={(e) => setDealFormData({ ...dealFormData, probability: e.target.value })}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Expected Close Date
                  </label>
                  <input
                    type="date"
                    value={dealFormData.expectedCloseDate}
                    onChange={(e) => setDealFormData({ ...dealFormData, expectedCloseDate: e.target.value })}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowDealModal(false)}
                    className="px-4 py-2 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? 'Creating...' : 'Create Deal'}
                  </button>
</div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Contact Detail Modal */}
      <AnimatePresence>
        {showContactDetailModal && selectedContactDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowContactDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-surface-900 dark:text-white">
                  Contact Details
                </h3>
                <button
                  onClick={() => setShowContactDetailModal(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Contact Header */}
                <div className="flex items-center space-x-4 p-4 bg-surface-50 dark:bg-surface-700/50 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {selectedContactDetail?.firstName?.charAt(0) || '?'}{selectedContactDetail?.lastName?.charAt(0) || ''}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-surface-900 dark:text-white">
                      {selectedContactDetail?.firstName || ''} {selectedContactDetail?.lastName || ''}
                    </h4>
                    <p className="text-surface-600 dark:text-surface-400">
                      {selectedContactDetail?.position || 'No position'} {selectedContactDetail?.company ? `at ${selectedContactDetail.company}` : ''}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-surface-900 dark:text-white">Contact Information</h5>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Mail" className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Email</p>
                          <p className="text-surface-900 dark:text-white">{selectedContactDetail?.email || 'No email'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Phone" className="w-4 h-4 text-secondary" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Phone</p>
                          <p className="text-surface-900 dark:text-white">{selectedContactDetail?.phone || 'No phone'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Building2" className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Company</p>
                          <p className="text-surface-900 dark:text-white">{selectedContactDetail?.company || 'No company'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Briefcase" className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Position</p>
                          <p className="text-surface-900 dark:text-white">{selectedContactDetail?.position || 'No position'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-surface-900 dark:text-white">Additional Information</h5>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Calendar" className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Created</p>
                          <p className="text-surface-900 dark:text-white">
                            {selectedContactDetail?.createdAt ? format(new Date(selectedContactDetail.createdAt), 'PPP') : 'Unknown'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Clock" className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Last Updated</p>
                          <p className="text-surface-900 dark:text-white">
                            {selectedContactDetail?.updatedAt ? format(new Date(selectedContactDetail.updatedAt), 'PPP') : 'Unknown'}
                          </p>
                        </div>
                      </div>

                      {selectedContactDetail?.tags && selectedContactDetail.tags.length > 0 && (
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <ApperIcon name="Tag" className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div>
                            <p className="text-sm text-surface-500 dark:text-surface-400">Tags</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedContactDetail.tags.map((tag, index) => (
                                <span key={index} className="px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 text-xs rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-surface-200 dark:border-surface-700">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowContactDetailModal(false)
                      handleEdit(selectedContactDetail)
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                    <span>Edit Contact</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedEntity({ type: 'contact', data: selectedContactDetail })
                      setShowNotesModal(true)
                    }}
                    className="px-6 py-2 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors flex items-center space-x-2"
                  >
                    <ApperIcon name="MessageSquare" className="w-4 h-4" />
                    <span>View Notes</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
</motion.div>
        )}
      </AnimatePresence>

      {/* Company Detail Modal */}
      <AnimatePresence>
        {showCompanyDetailModal && selectedCompanyDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowCompanyDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-surface-900 dark:text-white">
                  Company Details
                </h3>
                <button
                  onClick={() => setShowCompanyDetailModal(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Company Header */}
                <div className="flex items-center space-x-4 p-4 bg-surface-50 dark:bg-surface-700/50 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    {selectedCompanyDetail?.name?.charAt(0)?.toUpperCase() || 'C'}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-surface-900 dark:text-white">
                      {selectedCompanyDetail?.name || 'Unknown Company'}
                    </h4>
                    <p className="text-surface-600 dark:text-surface-400">
                      {selectedCompanyDetail?.industry || 'No industry specified'}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium mt-1 ${
                      selectedCompanyDetail?.size === 'Small' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      selectedCompanyDetail?.size === 'Medium' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      selectedCompanyDetail?.size === 'Large' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                      'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    }`}>
                      {selectedCompanyDetail?.size || 'Unknown'} Company
                    </span>
                  </div>
                </div>

                {/* Company Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-surface-900 dark:text-white">Contact Information</h5>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Mail" className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Email</p>
                          <p className="text-surface-900 dark:text-white">{selectedCompanyDetail?.email || 'No email'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Phone" className="w-4 h-4 text-secondary" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Phone</p>
                          <p className="text-surface-900 dark:text-white">{selectedCompanyDetail?.phone || 'No phone'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Globe" className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Website</p>
                          <p className="text-surface-900 dark:text-white">{selectedCompanyDetail?.website || 'No website'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Users" className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Employees</p>
                          <p className="text-surface-900 dark:text-white">{selectedCompanyDetail?.employees || 'Unknown'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-surface-900 dark:text-white">Company Details</h5>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="MapPin" className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Address</p>
                          <p className="text-surface-900 dark:text-white">
                            {selectedCompanyDetail?.address ? 
                              `${selectedCompanyDetail.address.city}, ${selectedCompanyDetail.address.state} ${selectedCompanyDetail.address.zipCode}` : 
                              'No address'
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="DollarSign" className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Revenue</p>
                          <p className="text-surface-900 dark:text-white">{selectedCompanyDetail?.revenue || 'Not specified'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Calendar" className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Founded</p>
                          <p className="text-surface-900 dark:text-white">{selectedCompanyDetail?.founded || 'Unknown'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Clock" className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Added</p>
                          <p className="text-surface-900 dark:text-white">
                            {selectedCompanyDetail?.createdAt ? format(new Date(selectedCompanyDetail.createdAt), 'PPP') : 'Unknown'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedCompanyDetail?.description && (
                  <div className="space-y-2">
                    <h5 className="text-lg font-semibold text-surface-900 dark:text-white">Description</h5>
                    <p className="text-surface-700 dark:text-surface-300 bg-surface-50 dark:bg-surface-700/50 p-4 rounded-xl">
                      {selectedCompanyDetail.description}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-surface-200 dark:border-surface-700">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowCompanyDetailModal(false)
                      setEditingCompany(selectedCompanyDetail)
                      setShowCompanyModal(true)
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                    <span>Edit Company</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
</motion.div>
        )}
      </AnimatePresence>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {showTaskDetailModal && selectedTaskDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowTaskDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-surface-900 dark:text-white">
                  Task Details
                </h3>
                <button
                  onClick={() => setShowTaskDetailModal(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Task Header */}
                <div className="flex items-start space-x-4 p-4 bg-surface-50 dark:bg-surface-700/50 rounded-xl">
                  {(() => {
                    const priority = getTaskPriority(selectedTaskDetail?.priority)
                    return (
                      <div className={`w-12 h-12 rounded-lg ${priority.color} flex items-center justify-center`}>
                        <ApperIcon name={priority.icon} className="w-6 h-6" />
                      </div>
                    )
                  })()}
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-surface-900 dark:text-white">
                      {selectedTaskDetail?.title || 'Untitled Task'}
                    </h4>
                    <p className="text-surface-600 dark:text-surface-400 mt-1">
                      {selectedTaskDetail?.description || 'No description provided'}
                    </p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        selectedTaskDetail?.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        selectedTaskDetail?.status === 'in-progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}>
                        {selectedTaskDetail?.status || 'pending'}
                      </span>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        selectedTaskDetail?.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                        selectedTaskDetail?.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {selectedTaskDetail?.priority || 'medium'} priority
                      </span>
                    </div>
                  </div>
                </div>

                {/* Task Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-surface-900 dark:text-white">Task Information</h5>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Calendar" className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Due Date</p>
                          <p className="text-surface-900 dark:text-white">
                            {selectedTaskDetail?.dueDate ? format(new Date(selectedTaskDetail.dueDate), 'PPP') : 'No due date'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="User" className="w-4 h-4 text-secondary" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Assigned To</p>
                          <p className="text-surface-900 dark:text-white">{selectedTaskDetail?.assignedTo || 'Unassigned'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Clock" className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Status</p>
                          <p className="text-surface-900 dark:text-white capitalize">
                            {getTaskStatus(selectedTaskDetail?.dueDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-surface-900 dark:text-white">Additional Details</h5>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Plus" className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Created</p>
                          <p className="text-surface-900 dark:text-white">
                            {selectedTaskDetail?.createdAt ? format(new Date(selectedTaskDetail.createdAt), 'PPP') : 'Unknown'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Edit" className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Last Updated</p>
                          <p className="text-surface-900 dark:text-white">
                            {selectedTaskDetail?.updatedAt ? format(new Date(selectedTaskDetail.updatedAt), 'PPP') : 'Never'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Target" className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Priority Level</p>
                          <p className="text-surface-900 dark:text-white capitalize">
                            {selectedTaskDetail?.priority || 'medium'} priority
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-surface-200 dark:border-surface-700">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowTaskDetailModal(false)
                      handleTaskEdit(selectedTaskDetail)
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                    <span>Edit Task</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowTaskDetailModal(false)
                      handleTaskDelete(selectedTaskDetail.id)
                    }}
                    className="px-6 py-2 border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                    <span>Delete Task</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
</motion.div>
        )}
      </AnimatePresence>

      {/* Deal Detail Modal */}
      <AnimatePresence>
        {showDealDetailModal && selectedDealDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowDealDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-surface-900 dark:text-white">
                  Deal Details
                </h3>
                <button
                  onClick={() => setShowDealDetailModal(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Deal Header */}
                <div className="flex items-center space-x-4 p-4 bg-surface-50 dark:bg-surface-700/50 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">
                    <ApperIcon name="DollarSign" className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-surface-900 dark:text-white">
                      {selectedDealDetail?.title || 'Untitled Deal'}
                    </h4>
                    <p className="text-2xl font-bold text-primary">
                      ${selectedDealDetail?.value?.toLocaleString() || '0'}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedDealDetail?.stage === 'closed-won' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        selectedDealDetail?.stage === 'closed-lost' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                        selectedDealDetail?.stage === 'negotiation' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                        selectedDealDetail?.stage === 'proposal' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        selectedDealDetail?.stage === 'qualified' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                      }`}>
                        {pipelineStages.find(stage => stage.id === selectedDealDetail?.stage)?.label || 'Unknown Stage'}
                      </span>
                      <span className="text-sm text-surface-600 dark:text-surface-400">
                        {selectedDealDetail?.probability || 0}% probability
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-surface-900 dark:text-white">Deal Information</h5>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="User" className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Contact</p>
                          <p className="text-surface-900 dark:text-white">{selectedDealDetail?.contactId || 'No contact assigned'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Calendar" className="w-4 h-4 text-secondary" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Expected Close Date</p>
                          <p className="text-surface-900 dark:text-white">
                            {selectedDealDetail?.expectedCloseDate ? format(new Date(selectedDealDetail.expectedCloseDate), 'PPP') : 'No date set'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="TrendingUp" className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Stage</p>
                          <p className="text-surface-900 dark:text-white capitalize">
                            {pipelineStages.find(stage => stage.id === selectedDealDetail?.stage)?.label || 'Unknown'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Target" className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Win Probability</p>
                          <p className="text-surface-900 dark:text-white">{selectedDealDetail?.probability || 0}%</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-surface-900 dark:text-white">Additional Details</h5>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Plus" className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Created</p>
                          <p className="text-surface-900 dark:text-white">
                            {selectedDealDetail?.createdAt ? format(new Date(selectedDealDetail.createdAt), 'PPP') : 'Unknown'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Edit" className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Last Updated</p>
                          <p className="text-surface-900 dark:text-white">
                            {selectedDealDetail?.updatedAt ? format(new Date(selectedDealDetail.updatedAt), 'PPP') : 'Never'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="DollarSign" className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Deal Value</p>
                          <p className="text-surface-900 dark:text-white font-semibold">
                            ${selectedDealDetail?.value?.toLocaleString() || '0'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Clock" className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Days to Close</p>
                          <p className="text-surface-900 dark:text-white">
                            {selectedDealDetail?.expectedCloseDate ? 
                              Math.max(0, Math.ceil((new Date(selectedDealDetail.expectedCloseDate) - new Date()) / (1000 * 60 * 60 * 24))) + ' days' : 
                              'No date set'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-surface-200 dark:border-surface-700">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedEntity({ type: 'deal', data: selectedDealDetail })
                      setShowNotesModal(true)
                    }}
                    className="px-6 py-2 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors flex items-center space-x-2"
                  >
                    <ApperIcon name="MessageSquare" className="w-4 h-4" />
                    <span>View Notes</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowDealDetailModal(false)
                      // Here you would implement deal editing functionality
                      toast.info('Deal editing functionality coming soon')
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                    <span>Edit Deal</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
</AnimatePresence>

      {/* Quote Detail Modal */}
      <AnimatePresence>
        {showQuoteDetailModal && selectedQuoteDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowQuoteDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-surface-900 dark:text-white">
                  Quote Details
                </h3>
                <button
                  onClick={() => setShowQuoteDetailModal(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Quote Header */}
                <div className="flex items-center space-x-4 p-4 bg-surface-50 dark:bg-surface-700/50 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    <ApperIcon name="FileText" className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-surface-900 dark:text-white">
                      {selectedQuoteDetail?.title || 'Unknown Quote'}
                    </h4>
                    <p className="text-surface-600 dark:text-surface-400">
                      {selectedQuoteDetail?.description || 'No description provided'}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedQuoteDetail?.status === 'draft' ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300' :
                        selectedQuoteDetail?.status === 'sent' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        selectedQuoteDetail?.status === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {selectedQuoteDetail?.status}
                      </span>
                      <span className="text-2xl font-bold text-primary">
                        ${selectedQuoteDetail?.amount?.toLocaleString() || '0'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quote Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-surface-900 dark:text-white">Quote Information</h5>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="User" className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Contact</p>
                          <p className="text-surface-900 dark:text-white">{selectedQuoteDetail?.contactId || 'No contact'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Building2" className="w-4 h-4 text-secondary" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Company</p>
                          <p className="text-surface-900 dark:text-white">{selectedQuoteDetail?.companyId || 'No company'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Calendar" className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Valid Until</p>
                          <p className="text-surface-900 dark:text-white">
                            {selectedQuoteDetail?.validUntil ? format(new Date(selectedQuoteDetail.validUntil), 'PPP') : 'No expiry date'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-surface-900 dark:text-white">Additional Details</h5>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Plus" className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Created</p>
                          <p className="text-surface-900 dark:text-white">
                            {selectedQuoteDetail?.createdAt ? format(new Date(selectedQuoteDetail.createdAt), 'PPP') : 'Unknown'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="DollarSign" className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Quote Amount</p>
                          <p className="text-surface-900 dark:text-white font-semibold">
                            ${selectedQuoteDetail?.amount?.toLocaleString() || '0'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Clock" className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Days Remaining</p>
                          <p className="text-surface-900 dark:text-white">
                            {selectedQuoteDetail?.validUntil ? 
                              Math.max(0, Math.ceil((new Date(selectedQuoteDetail.validUntil) - new Date()) / (1000 * 60 * 60 * 24))) + ' days' : 
                              'No expiry'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quote Items */}
                {selectedQuoteDetail?.items && selectedQuoteDetail.items.length > 0 && (
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-surface-900 dark:text-white">Quote Items</h5>
                    <div className="bg-surface-50 dark:bg-surface-700/50 rounded-xl p-4">
                      <div className="space-y-3">
                        {selectedQuoteDetail.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-surface-800 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-surface-900 dark:text-white">{item.description}</p>
                              <p className="text-sm text-surface-600 dark:text-surface-400">
                                Qty: {item.quantity} × ${item.unitPrice?.toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-surface-900 dark:text-white">${item.total?.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-surface-200 dark:border-surface-700">
                  {selectedQuoteDetail?.status === 'accepted' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleConvertQuoteToDeal(selectedQuoteDetail)}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                    >
                      <ApperIcon name="ArrowRight" className="w-4 h-4" />
                      <span>Convert to Deal</span>
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowQuoteDetailModal(false)
                      setEditingQuote(selectedQuoteDetail)
                      setQuoteFormData({
                        title: selectedQuoteDetail.title,
                        description: selectedQuoteDetail.description,
                        amount: selectedQuoteDetail.amount.toString(),
                        contactId: selectedQuoteDetail.contactId,
                        companyId: selectedQuoteDetail.companyId,
                        status: selectedQuoteDetail.status,
                        validUntil: selectedQuoteDetail.validUntil,
                        items: selectedQuoteDetail.items || []
                      })
                      setShowQuoteModal(true)
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                    <span>Edit Quote</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sales Order Detail Modal */}
      <AnimatePresence>
        {showSalesOrderDetailModal && selectedSalesOrderDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowSalesOrderDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold text-surface-900 dark:text-white">
                  Sales Order Details
                </h3>
                <button
                  onClick={() => setShowSalesOrderDetailModal(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-surface-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Sales Order Header */}
                <div className="flex items-center space-x-4 p-4 bg-surface-50 dark:bg-surface-700/50 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                    <ApperIcon name="ShoppingCart" className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="text-xl font-semibold text-surface-900 dark:text-white">
                        {selectedSalesOrderDetail?.orderNumber}
                      </h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedSalesOrderDetail?.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        selectedSalesOrderDetail?.status === 'confirmed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        selectedSalesOrderDetail?.status === 'processing' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                        selectedSalesOrderDetail?.status === 'shipped' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
                        selectedSalesOrderDetail?.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {selectedSalesOrderDetail?.status}
                      </span>
                    </div>
                    <h5 className="text-lg font-medium text-surface-900 dark:text-white mb-1">
                      {selectedSalesOrderDetail?.title || 'Unknown Order'}
                    </h5>
                    <p className="text-surface-600 dark:text-surface-400">
                      {selectedSalesOrderDetail?.description || 'No description provided'}
                    </p>
                    <p className="text-2xl font-bold text-primary mt-2">
                      ${selectedSalesOrderDetail?.amount?.toLocaleString() || '0'}
                    </p>
                  </div>
                </div>

                {/* Sales Order Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-surface-900 dark:text-white">Order Information</h5>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="User" className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Contact</p>
                          <p className="text-surface-900 dark:text-white">{selectedSalesOrderDetail?.contactId || 'No contact'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Building2" className="w-4 h-4 text-secondary" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Company</p>
                          <p className="text-surface-900 dark:text-white">{selectedSalesOrderDetail?.companyId || 'No company'}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Truck" className="w-4 h-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Expected Delivery</p>
                          <p className="text-surface-900 dark:text-white">
                            {selectedSalesOrderDetail?.expectedDelivery ? format(new Date(selectedSalesOrderDetail.expectedDelivery), 'PPP') : 'No delivery date'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-surface-900 dark:text-white">Additional Details</h5>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Plus" className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Created</p>
                          <p className="text-surface-900 dark:text-white">
                            {selectedSalesOrderDetail?.createdAt ? format(new Date(selectedSalesOrderDetail.createdAt), 'PPP') : 'Unknown'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="DollarSign" className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Order Amount</p>
                          <p className="text-surface-900 dark:text-white font-semibold">
                            ${selectedSalesOrderDetail?.amount?.toLocaleString() || '0'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                          <ApperIcon name="Clock" className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm text-surface-500 dark:text-surface-400">Days to Delivery</p>
                          <p className="text-surface-900 dark:text-white">
                            {selectedSalesOrderDetail?.expectedDelivery ? 
                              Math.max(0, Math.ceil((new Date(selectedSalesOrderDetail.expectedDelivery) - new Date()) / (1000 * 60 * 60 * 24))) + ' days' : 
                              'No delivery date'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                {selectedSalesOrderDetail?.items && selectedSalesOrderDetail.items.length > 0 && (
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-surface-900 dark:text-white">Order Items</h5>
                    <div className="bg-surface-50 dark:bg-surface-700/50 rounded-xl p-4">
                      <div className="space-y-3">
                        {selectedSalesOrderDetail.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-surface-800 rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-surface-900 dark:text-white">{item.description}</p>
                              <p className="text-sm text-surface-600 dark:text-surface-400">
                                Qty: {item.quantity} × ${item.unitPrice?.toLocaleString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-surface-900 dark:text-white">${item.total?.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-surface-200 dark:border-surface-700">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowSalesOrderDetailModal(false)
                      setEditingSalesOrder(selectedSalesOrderDetail)
                      setSalesOrderFormData({
                        orderNumber: selectedSalesOrderDetail.orderNumber,
                        title: selectedSalesOrderDetail.title,
                        description: selectedSalesOrderDetail.description,
                        amount: selectedSalesOrderDetail.amount.toString(),
                        contactId: selectedSalesOrderDetail.contactId,
                        companyId: selectedSalesOrderDetail.companyId,
                        status: selectedSalesOrderDetail.status,
                        expectedDelivery: selectedSalesOrderDetail.expectedDelivery,
                        items: selectedSalesOrderDetail.items || []
                      })
                      setShowSalesOrderModal(true)
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                  >
                    <ApperIcon name="Edit" className="w-4 h-4" />
                    <span>Edit Order</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowSalesOrderDetailModal(false)
                      handleSalesOrderDelete(selectedSalesOrderDetail.id)
                    }}
                    className="px-6 py-2 border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                    <span>Delete Order</span>
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

// TaggingInput Component for team member mentions
const TaggingInput = ({ teamMembers, onSubmit }) => {
  const [content, setContent] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState([])
const [selectedSuggestion, setSelectedSuggestion] = useState(0)
  const [mentionStart, setMentionStart] = useState(0)
  const textareaRef = React.useRef(null)
  const handleContentChange = (e) => {
    const value = e.target.value
    const cursorPosition = e.target.selectionStart
    setContent(value)

    // Check for @ mention
    const beforeCursor = value.substring(0, cursorPosition)
    const mentionMatch = beforeCursor.match(/@(\w*)$/)
    
    if (mentionMatch) {
      const query = mentionMatch[1].toLowerCase()
      const filtered = teamMembers.filter(member => 
        member.username.toLowerCase().includes(query) ||
        member.name.toLowerCase().includes(query)
      )
      
      if (filtered.length > 0) {
        setSuggestions(filtered)
        setShowSuggestions(true)
        setSelectedSuggestion(0)
        setMentionStart(cursorPosition - mentionMatch[0].length)
      } else {
        setShowSuggestions(false)
      }
    } else {
      setShowSuggestions(false)
    }
  }

  const insertMention = (member) => {
    const beforeMention = content.substring(0, mentionStart)
    const afterCursor = content.substring(textareaRef.current.selectionStart)
    const newContent = beforeMention + `@${member.username}` + afterCursor
    
    setContent(newContent)
    setShowSuggestions(false)
    
    // Focus back to textarea
    setTimeout(() => {
      if (textareaRef.current) {
        const newCursorPosition = beforeMention.length + member.username.length + 1
        textareaRef.current.focus()
        textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition)
      }
    }, 0)
  }

  const handleKeyDown = (e) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedSuggestion(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        )
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault()
        insertMention(suggestions[selectedSuggestion])
      } else if (e.key === 'Escape') {
        setShowSuggestions(false)
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (content.trim()) {
      onSubmit(content)
      setContent('')
      setShowSuggestions(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          rows={3}
          className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-700 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
          placeholder="Write your note here... Use @username to tag team members"
        />
        
        {showSuggestions && (
          <div className="absolute z-10 mt-1 w-full max-w-xs bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-600 rounded-lg shadow-lg">
            {suggestions.map((member, index) => (
              <div
                key={member.id}
                className={`px-3 py-2 cursor-pointer transition-colors ${
                  index === selectedSuggestion 
                    ? 'bg-primary/10 text-primary' 
                    : 'hover:bg-surface-50 dark:hover:bg-surface-700'
                }`}
                onClick={() => insertMention(member)}
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-surface-900 dark:text-white">
                      {member.name}
                    </div>
                    <div className="text-xs text-surface-500 dark:text-surface-400">
                      @{member.username} • {member.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="absolute bottom-2 right-2 text-xs text-surface-500">
          Type @ to mention team members
        </div>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>Add Note</span>
        </button>
      </div>
    </form>
  )
}

export default MainFeature