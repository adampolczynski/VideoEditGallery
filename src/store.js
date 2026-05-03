import create from 'zustand';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('admin_token') || null,
  isAuthenticated: !!localStorage.getItem('admin_token'),
  
  setToken: (token) => {
    if (token) {
      localStorage.setItem('admin_token', token);
    } else {
      localStorage.removeItem('admin_token');
    }
    set({ token, isAuthenticated: !!token });
  },
  
  logout: () => {
    localStorage.removeItem('admin_token');
    set({ token: null, isAuthenticated: false });
  }
}));

export const useVideosStore = create((set) => ({
  videos: [],
  settings: {
    autoScroll: false,
    autoScrollInterval: 5000,
  },
  loading: false,
  error: null,
  
  setVideos: (videos) => set({ videos }),
  setSettings: (settings) => set((state) => ({ settings: { ...state.settings, ...settings } })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  addVideo: (video) => set((state) => ({ videos: [...state.videos, video] })),
  updateVideo: (id, updates) => set((state) => ({
    videos: state.videos.map(v => v.id === id ? { ...v, ...updates } : v)
  })),
  removeVideo: (id) => set((state) => ({
    videos: state.videos.filter(v => v.id !== id)
  })),
  
  reorderVideos: (newOrder) => set({ videos: newOrder })
}));
