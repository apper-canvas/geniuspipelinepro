import dealData from '../mockData/deals.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let deals = [...dealData]

const dealService = {
  async getAll() {
    await delay(300)
    return [...deals]
  },

  async getById(id) {
    await delay(200)
    const deal = deals.find(d => d.id === id)
    return deal ? { ...deal } : null
  },

  async create(data) {
    await delay(400)
    const newDeal = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    deals.push(newDeal)
    return { ...newDeal }
  },

  async update(id, data) {
    await delay(350)
    const index = deals.findIndex(d => d.id === id)
    if (index === -1) throw new Error('Deal not found')
    
    deals[index] = {
      ...deals[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return { ...deals[index] }
  },

  async delete(id) {
    await delay(250)
    const index = deals.findIndex(d => d.id === id)
    if (index === -1) throw new Error('Deal not found')
    
    deals.splice(index, 1)
    return true
  }
}

export default dealService