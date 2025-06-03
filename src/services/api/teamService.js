import teamData from '../mockData/team.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let team = [...teamData]

const teamService = {
  async getAll() {
    await delay(150)
    return [...team]
  },

  async getById(id) {
    await delay(100)
    const member = team.find(t => t.id === id)
    return member ? { ...member } : null
  },

  async getByUsername(username) {
    await delay(100)
    const member = team.find(t => t.username === username)
    return member ? { ...member } : null
  },

  async getCurrentUser() {
    await delay(100)
    // Return the first user as current user for demo purposes
    return team[0] ? { ...team[0] } : null
  }
}

export default teamService