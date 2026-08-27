// ============================================================================
// SkillSwap - Frontend API Client
// ============================================================================

const API_BASE = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const message = errData.message || errData.details || `HTTP Error ${response.status}`;
    throw new Error(message);
  }
  return response.json();
}

export const api = {
  // DB Health & Overview
  async getDbHealth() {
    const res = await fetch(`${API_BASE}/graph/health`);
    return handleResponse(res);
  },

  async getOverviewStats(userId = 'usr-kavya') {
    const res = await fetch(`${API_BASE}/matches/stats?userId=${userId}`);
    return handleResponse(res);
  },

  // Users & Profiles
  async getAllUsers() {
    const res = await fetch(`${API_BASE}/users`);
    return handleResponse(res);
  },

  async getUserProfile(userId) {
    const res = await fetch(`${API_BASE}/users/${userId}`);
    return handleResponse(res);
  },

  async addSkillTaught(userId, skillId, proficiency, experienceYears) {
    const res = await fetch(`${API_BASE}/users/${userId}/skills/taught`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillId, proficiency, experienceYears })
    });
    return handleResponse(res);
  },

  async removeSkillTaught(userId, skillId) {
    const res = await fetch(`${API_BASE}/users/${userId}/skills/taught/${skillId}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  async addSkillWanted(userId, skillId, priority, currentLevel) {
    const res = await fetch(`${API_BASE}/users/${userId}/skills/wanted`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skillId, priority, currentLevel })
    });
    return handleResponse(res);
  },

  async removeSkillWanted(userId, skillId) {
    const res = await fetch(`${API_BASE}/users/${userId}/skills/wanted/${skillId}`, {
      method: 'DELETE'
    });
    return handleResponse(res);
  },

  // Skills & Categories
  async getAllSkills(categoryId, search) {
    let query = '';
    const params = [];
    if (categoryId) params.push(`category=${encodeURIComponent(categoryId)}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (params.length > 0) query = `?${params.join('&')}`;

    const res = await fetch(`${API_BASE}/skills${query}`);
    return handleResponse(res);
  },

  async getSkillDetails(skillId) {
    const res = await fetch(`${API_BASE}/skills/${skillId}`);
    return handleResponse(res);
  },

  async getAllCategories() {
    const res = await fetch(`${API_BASE}/skills/categories`);
    return handleResponse(res);
  },

  async getPrerequisitePath(skillName) {
    const res = await fetch(`${API_BASE}/skills/prerequisites/${encodeURIComponent(skillName)}`);
    return handleResponse(res);
  },

  // Matches & Multi-Hop Recommendations
  async getMatches(userId) {
    const res = await fetch(`${API_BASE}/matches/${userId}`);
    return handleResponse(res);
  },

  async getMultiHopRecommendations(userId) {
    const res = await fetch(`${API_BASE}/matches/${userId}/recommendations`);
    return handleResponse(res);
  },

  // Swap Requests
  async getSwapRequests(userId) {
    const res = await fetch(`${API_BASE}/swaps/user/${userId}`);
    return handleResponse(res);
  },

  async sendSwapRequest(senderId, receiverId, offeredSkillId, wantedSkillId, message) {
    const res = await fetch(`${API_BASE}/swaps/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderId, receiverId, offeredSkillId, wantedSkillId, message })
    });
    return handleResponse(res);
  },

  async respondSwapRequest(swapId, status) {
    const res = await fetch(`${API_BASE}/swaps/${swapId}/respond`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  // Sessions & Reviews
  async getSessions(userId) {
    const res = await fetch(`${API_BASE}/sessions/user/${userId}`);
    return handleResponse(res);
  },

  async scheduleSession(swapId, teacherId, learnerId, skillId, date, time, mode, meetingLink) {
    const res = await fetch(`${API_BASE}/sessions/schedule`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ swapId, teacherId, learnerId, skillId, date, time, mode, meetingLink })
    });
    return handleResponse(res);
  },

  async completeSession(sessionId, rating, comment) {
    const res = await fetch(`${API_BASE}/sessions/${sessionId}/complete`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, comment })
    });
    return handleResponse(res);
  },

  // Graph Canvas & Pathfinding
  async getGraph(types = []) {
    const query = types.length > 0 ? `?types=${types.join(',')}` : '';
    const res = await fetch(`${API_BASE}/graph/explore${query}`);
    return handleResponse(res);
  },

  async findPath(source, target) {
    const res = await fetch(`${API_BASE}/graph/path?source=${encodeURIComponent(source)}&target=${encodeURIComponent(target)}`);
    return handleResponse(res);
  }
};
