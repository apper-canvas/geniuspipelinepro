import contactData from '../mockData/contacts.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let contacts = [...contactData]

const contactService = {
  async getAll() {
    await delay(300)
    return [...contacts]
  },

  async getById(id) {
    await delay(200)
    const contact = contacts.find(c => c.id === id)
    return contact ? { ...contact } : null
  },

  async create(data) {
    await delay(400)
    const newContact = {
      ...data,
      id: Date.now().toString(),
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    contacts.push(newContact)
    return { ...newContact }
  },

  async update(id, data) {
    await delay(350)
    const index = contacts.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Contact not found')
    
    contacts[index] = {
      ...contacts[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return { ...contacts[index] }
  },

  async delete(id) {
    await delay(250)
    const index = contacts.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Contact not found')
    
    contacts.splice(index, 1)
    return true
  }
}

export default contactService