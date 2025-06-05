import mockSalesOrders from '../mockData/salesOrders.json'

// Utility function to create a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// In-memory storage for sales orders (simulating a database)
let salesOrders = [...mockSalesOrders]

const salesOrderService = {
  // Get all sales orders
  async getAll() {
    await delay(400)
    return [...salesOrders]
  },

  // Get sales order by ID
  async getById(id) {
    await delay(300)
    const order = salesOrders.find(so => so.id === parseInt(id))
    if (!order) {
      throw new Error('Sales order not found')
    }
    return { ...order }
  },

  // Create new sales order
  async create(orderData) {
    await delay(380)
    
    // Validation
    if (!orderData.title?.trim()) {
      throw new Error('Sales order title is required')
    }
    if (!orderData.amount || parseFloat(orderData.amount) <= 0) {
      throw new Error('Sales order amount must be greater than 0')
    }

    // Generate order number if not provided
    const orderNumber = orderData.orderNumber || `SO-2024-${String(salesOrders.length + 1).padStart(3, '0')}`

    const newOrder = {
      id: Date.now(),
      ...orderData,
      orderNumber,
      amount: parseFloat(orderData.amount),
      status: orderData.status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: orderData.items || []
    }

    salesOrders = [...salesOrders, newOrder]
    return { ...newOrder }
  },

  // Update sales order
  async update(id, orderData) {
    await delay(350)
    
    const index = salesOrders.findIndex(so => so.id === parseInt(id))
    if (index === -1) {
      throw new Error('Sales order not found')
    }

    // Validation
    if (orderData.title !== undefined && !orderData.title?.trim()) {
      throw new Error('Sales order title cannot be empty')
    }
    if (orderData.amount !== undefined && (parseFloat(orderData.amount) <= 0 || isNaN(parseFloat(orderData.amount)))) {
      throw new Error('Sales order amount must be greater than 0')
    }

    // Validate status progression
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
    if (orderData.status && !validStatuses.includes(orderData.status)) {
      throw new Error('Invalid sales order status')
    }

    const updatedOrder = {
      ...salesOrders[index],
      ...orderData,
      amount: orderData.amount ? parseFloat(orderData.amount) : salesOrders[index].amount,
      updatedAt: new Date().toISOString()
    }

    salesOrders = salesOrders.map(so => so.id === parseInt(id) ? updatedOrder : so)
    return { ...updatedOrder }
  },

  // Delete sales order
  async delete(id) {
    await delay(320)
    
    const index = salesOrders.findIndex(so => so.id === parseInt(id))
    if (index === -1) {
      throw new Error('Sales order not found')
    }

    const deletedOrder = { ...salesOrders[index] }
    salesOrders = salesOrders.filter(so => so.id !== parseInt(id))
    return deletedOrder
  },

  // Additional business methods
  async getByStatus(status) {
    await delay(250)
    return salesOrders.filter(so => so.status === status).map(so => ({ ...so }))
  },

  async getByCompany(companyId) {
    await delay(250)
    return salesOrders.filter(so => so.companyId === companyId).map(so => ({ ...so }))
  },

  async getByContact(contactId) {
    await delay(250)
    return salesOrders.filter(so => so.contactId === contactId).map(so => ({ ...so }))
  },

  async updateStatus(id, status) {
    await delay(300)
    return this.update(id, { status })
  },

  async getByOrderNumber(orderNumber) {
    await delay(200)
    const order = salesOrders.find(so => so.orderNumber === orderNumber)
    if (!order) {
      throw new Error('Sales order not found')
    }
    return { ...order }
  },

  async getOverdueOrders() {
    await delay(300)
    const today = new Date()
    return salesOrders.filter(so => {
      if (!so.expectedDelivery) return false
      const deliveryDate = new Date(so.expectedDelivery)
      return deliveryDate < today && !['delivered', 'cancelled'].includes(so.status)
    }).map(so => ({ ...so }))
  }
}

export default salesOrderService