import emailData from '../mockData/emails.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let emails = [...emailData]

const emailService = {
  async getAll() {
    await delay(300)
    return [...emails]
  },

  async getById(id) {
    await delay(200)
    const email = emails.find(e => e.id === id)
    return email ? { ...email } : null
  },

  async create(data) {
    await delay(400)
    const newEmail = {
      ...data,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    }
    emails.push(newEmail)
    return { ...newEmail }
  },

  async update(id, data) {
    await delay(350)
    const index = emails.findIndex(e => e.id === id)
    if (index === -1) throw new Error('Email not found')
    
    emails[index] = {
      ...emails[index],
      ...data
    }
    return { ...emails[index] }
  },

  async delete(id) {
    await delay(250)
    const index = emails.findIndex(e => e.id === id)
    if (index === -1) throw new Error('Email not found')
    
    emails.splice(index, 1)
    return true
  }
}

export default emailService