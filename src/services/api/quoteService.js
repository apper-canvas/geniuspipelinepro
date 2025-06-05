import mockQuotes from '../mockData/quotes.json'

// Utility function to create a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for quotes (simulating a database)
let quotes = [...mockQuotes]

const quoteService = {
  // Get all quotes
  async getAll() {
    await delay(300)
    return [...quotes]
  },

  // Get quote by ID
  async getById(id) {
    await delay(250)
    const quote = quotes.find(q => q.id === parseInt(id))
    if (!quote) {
      throw new Error('Quote not found')
    }
    return { ...quote }
  },

  // Create new quote
  async create(quoteData) {
    await delay(350)
    
    // Validation
    if (!quoteData.title?.trim()) {
      throw new Error('Quote title is required')
    }
    if (!quoteData.amount || parseFloat(quoteData.amount) <= 0) {
      throw new Error('Quote amount must be greater than 0')
    }

    const newQuote = {
      id: Date.now(),
      ...quoteData,
      amount: parseFloat(quoteData.amount),
      status: quoteData.status || 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: quoteData.items || []
    }

    quotes = [...quotes, newQuote]
    return { ...newQuote }
  },

  // Update quote
  async update(id, quoteData) {
    await delay(320)
    
    const index = quotes.findIndex(q => q.id === parseInt(id))
    if (index === -1) {
      throw new Error('Quote not found')
    }

    // Validation
    if (quoteData.title !== undefined && !quoteData.title?.trim()) {
      throw new Error('Quote title cannot be empty')
    }
    if (quoteData.amount !== undefined && (parseFloat(quoteData.amount) <= 0 || isNaN(parseFloat(quoteData.amount)))) {
      throw new Error('Quote amount must be greater than 0')
    }

    const updatedQuote = {
      ...quotes[index],
      ...quoteData,
      amount: quoteData.amount ? parseFloat(quoteData.amount) : quotes[index].amount,
      updatedAt: new Date().toISOString()
    }

    quotes = quotes.map(q => q.id === parseInt(id) ? updatedQuote : q)
    return { ...updatedQuote }
  },

  // Delete quote
  async delete(id) {
    await delay(280)
    
    const index = quotes.findIndex(q => q.id === parseInt(id))
    if (index === -1) {
      throw new Error('Quote not found')
    }

    const deletedQuote = { ...quotes[index] }
    quotes = quotes.filter(q => q.id !== parseInt(id))
    return deletedQuote
  },

  // Additional business methods
  async getByStatus(status) {
    await delay(200)
    return quotes.filter(q => q.status === status).map(q => ({ ...q }))
  },

  async getByCompany(companyId) {
    await delay(200)
    return quotes.filter(q => q.companyId === companyId).map(q => ({ ...q }))
  },

  async getByContact(contactId) {
    await delay(200)
    return quotes.filter(q => q.contactId === contactId).map(q => ({ ...q }))
  },

  async updateStatus(id, status) {
    await delay(250)
    return this.update(id, { status })
  }
}

export default quoteService