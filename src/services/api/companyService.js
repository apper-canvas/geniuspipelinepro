import companyData from '../mockData/companies.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let companies = [...companyData]

const companyService = {
  async getAll() {
    await delay(300)
    return [...companies]
  },

  async getById(id) {
    await delay(200)
    const company = companies.find(c => c.id === id)
    return company ? { ...company } : null
  },

  async create(data) {
    await delay(400)
    const newCompany = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    companies.push(newCompany)
    return { ...newCompany }
  },

  async update(id, data) {
    await delay(350)
    const index = companies.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Company not found')
    
    companies[index] = {
      ...companies[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return { ...companies[index] }
  },

  async delete(id) {
    await delay(250)
    const index = companies.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Company not found')
    
    companies.splice(index, 1)
    return true
  }
}

export default companyService