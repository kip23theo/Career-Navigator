import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

// API Endpoints
export const profileAPI = {
  uploadResume: async (formData) => {
    const response = await api.post("/profile/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/profile");
    return response.data;
  },
};

export const skillsAPI = {
  getGapMap: async (dreamRole) => {
    const response = await api.post("/skills/gap-map", { dreamRole });
    return response.data;
  },

  getMarketDemand: async (skills) => {
    const response = await api.post("/skills/market-demand", { skills });
    return response.data;
  },
};

export const quizAPI = {
  submitQuiz: async (answers) => {
    const response = await api.post("/quiz/submit", { answers });
    return response.data;
  },
};

export const dashboardAPI = {
  getSummary: async () => {
    const response = await api.get("/dashboard/summary");
    return response.data;
  },

  getMetrics: async () => {
    const response = await api.get("/dashboard/metrics");
    return response.data;
  },
};

export const roadmapAPI = {
  generate: async (profileData) => {
    const response = await api.post("/roadmap/generate", profileData);
    return response.data;
  },

  adaptiveUpdate: async (deltaSkills) => {
    const response = await api.post("/roadmap/adaptive-update", {
      deltaSkills,
    });
    return response.data;
  },

  getProgress: async () => {
    const response = await api.get("/roadmap/progress");
    return response.data;
  },
};

export const linkedInAPI = {
  syncProfile: async (linkedInData) => {
    const response = await api.post("/linkedin/sync", linkedInData);
    return response.data;
  },
};

export default api;
