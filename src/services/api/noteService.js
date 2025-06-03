import noteData from '../mockData/notes.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let notes = [...noteData]

const noteService = {
  async getByEntity(entityType, entityId) {
    await delay(200)
    return notes.filter(note => note.entityType === entityType && note.entityId === entityId)
  },

  async create(data) {
    await delay(300)
    const newNote = {
      ...data,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    notes.push(newNote)
    return { ...newNote }
  },

  async update(id, data) {
    await delay(250)
    const index = notes.findIndex(n => n.id === id)
    if (index === -1) throw new Error('Note not found')
    
    notes[index] = {
      ...notes[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return { ...notes[index] }
  },

  async delete(id) {
    await delay(200)
    const index = notes.findIndex(n => n.id === id)
    if (index === -1) throw new Error('Note not found')
    
    notes.splice(index, 1)
    return true
  }
}

export default noteService