import config from "./config";

const BASE_URL = config.API_BASE_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Request failed");
  }
  return res.json();
}

// AUTH
export const authAPI = {
  login: async (phone, password) => {
    const form = new URLSearchParams();
    form.append("username", phone);
    form.append("password", password);
    const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });
    return handleResponse(res);
  },

  register: async (data) => {
    const res = await fetch(`${BASE_URL}/api/v1/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
  },
};

// USERS
export const usersAPI = {
  getMe: async () => {
    const res = await fetch(`${BASE_URL}/api/v1/users/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  updateMe: async (data) => {
    const res = await fetch(`${BASE_URL}/api/v1/users/me`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },
};

// CROPS
export const cropsAPI = {
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/api/v1/crops`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getUserCrops: async () => {
    const res = await fetch(`${BASE_URL}/api/v1/crops/user`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  addCrop: async (data) => {
    const res = await fetch(`${BASE_URL}/api/v1/crops`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  deleteCrop: async (id) => {
    const res = await fetch(`${BASE_URL}/api/v1/crops/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};

// SENSORS
export const sensorsAPI = {
  getLatest: async () => {
    const res = await fetch(`${BASE_URL}/api/v1/sensors/latest`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getHistory: async (limit = 24) => {
    const res = await fetch(`${BASE_URL}/api/v1/sensors/history?limit=${limit}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};

// RECOMMENDATIONS
export const recommendationsAPI = {
  getLatest: async () => {
    const res = await fetch(`${BASE_URL}/api/v1/recommendations/latest`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  getHistory: async () => {
    const res = await fetch(`${BASE_URL}/api/v1/recommendations`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};

// CHATBOT
export const chatbotAPI = {
  sendMessage: async (message, language = "en") => {
    const res = await fetch(`${BASE_URL}/api/v1/chatbot/chat`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, language }),
    });
    return handleResponse(res);
  },
};

// VILLAGES
export const villagesAPI = {
  search: async (query) => {
    const res = await fetch(`${BASE_URL}/api/v1/villages/search?q=${encodeURIComponent(query)}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};

// DEVICES
export const deviceAPI = {
  getSettings: async () => {
    const res = await fetch(`${BASE_URL}/api/v1/devices/settings`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  setupDevices: async (data) => {
    const res = await fetch(`${BASE_URL}/api/v1/devices/setup`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data), // Expected: { devices: [{id: 1, pots: 3}, ...] }
    });
    return handleResponse(res);
  },

  saveGardenDetails: async (data) => {
    const res = await fetch(`${BASE_URL}/api/v1/devices/garden-details`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data), // Expected: [{pot_id: 'd1-p1', plant_type: 'Mint', ...}]
    });
    return handleResponse(res);
  },
};


export default {
  auth: authAPI,
  users: usersAPI,
  crops: cropsAPI,
  sensors: sensorsAPI,
  recommendations: recommendationsAPI,
  chatbot: chatbotAPI,
  villages: villagesAPI,
  devices: deviceAPI, // Add this line
};