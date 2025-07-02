const fetch = require('node-fetch');

class UserApi {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getUser(id) {
    const response = await fetch(`${this.baseUrl}/user/${id}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  async getUsers() {
    const response = await fetch(`${this.baseUrl}/users`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
}

module.exports = UserApi; 