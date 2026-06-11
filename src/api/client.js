import axios from 'axios';

const api = axios.create({
  baseURL: 'https://be-y7hs.onrender.com/api/v1',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth & User
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  sendEmail: (email) => api.post('/auth/email/send', {}, { params: { email } }),
  verifyEmail: (data) => api.post('/auth/email/verify', data),
  getProfile: (userId) => api.get(`/users/${userId}/profile`),
  getMyProfile: () => api.get('/users/me/profile'),
  updateProfile: (data) => api.put('/users/me/profile', data),
  approveUser: (userId) => api.patch(`/admin/users/${userId}/status`),
};

// Community
export const communityApi = {
  getPosts: (params = {}) => {
    // Explicitly provide paging and sorting as they are often required in Spring backends
    const queryParams = {
      page: 0,
      size: 10,
      ...params
    };
    
    const cleanedParams = {};
    Object.keys(queryParams).forEach(key => {
      const val = queryParams[key];
      if (val !== undefined && val !== null && val !== '') {
        cleanedParams[key] = val;
      }
    });

    return api.get('/posts', { params: cleanedParams });
  },
  getPost: (postId) => api.get(`/posts/${postId}`),
  createPost: (data) => api.post('/posts', data),
  updatePost: (postId, data) => api.put(`/posts/${postId}`, data),
  deletePost: (postId) => api.delete(`/posts/${postId}`),
  pinPost: (postId, isPinned) => api.patch(`/posts/${postId}/pin`, null, { params: { isPinned } }),
  addComment: (postId, data) => api.post(`/posts/${postId}/comments`, data),
  recommendComment: (commentId, isRecommended) => api.patch(`/posts/comments/${commentId}/recommend`, null, { params: { isRecommended } }),
};

// Mentoring
export const mentoringApi = {
  getMentors: (params) => api.get('/mentoring/mentors', { params }),
  getMentorSchedules: (mentorId) => api.get(`/mentoring/mentors/${mentorId}/schedules`),
  applyMentoring: (data) => api.post('/mentoring/apply', data),
  getMyRequests: () => api.get('/mentoring/my-requests'),
  getIncomingRequests: () => api.get('/mentoring/incoming-requests'),
  cancelMentoring: (requestId) => api.delete(`/mentoring/${requestId}/cancel`),
  updateStatus: (requestId, status) => api.patch(`/mentoring/${requestId}/status`, null, { params: { status } }),
  registerSchedule: (data) => api.post('/mentoring/schedule', data),
};

// Gamification
export const gamificationApi = {
  getPoints: () => api.get('/gamification/points'),
  getHistory: () => api.get('/gamification/history'),
};

// Chat
export const chatApi = {
  getMyRooms: () => api.get('/chats/rooms'),
  getRoom: (roomId) => api.get(`/chats/rooms/${roomId}`),
  getMessages: (roomId) => api.get(`/chats/rooms/${roomId}/messages`),
  sendMessage: (roomId, data) => api.post(`/chats/rooms/${roomId}/messages`, data),
  getOrCreateSeniorRoomByQuery: (seniorId) => api.get('/chats/rooms/senior', { params: { seniorId } }),
  getOrCreateSeniorRoom: (data) => api.post('/chats/rooms/senior', data),
};

// Report
export const reportApi = {
  createReport: (data) => api.post('/reports', data),
  getReports: () => api.get('/reports'),
  processReport: (reportId, data) => api.patch(`/reports/${reportId}/status`, data),
};

export default api;
