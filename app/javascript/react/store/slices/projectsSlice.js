import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    fetchProjectsSuccess: (state, action) => {
      state.projects = action.payload;
      state.loading = false;
      state.error = null;
    },
    addProjectSuccess: (state, action) => {
      state.projects.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateProjectSuccess: (state, action) => {
      const index = state.projects.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
      }
      if (state.currentProject?.id === action.payload.id) {
        state.currentProject = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    deleteProjectSuccess: (state, action) => {
      state.projects = state.projects.filter((p) => p.id !== action.payload);
      if (state.currentProject?.id === action.payload) {
        state.currentProject = null;
      }
      state.loading = false;
      state.error = null;
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setLoading,
  setError,
  fetchProjectsSuccess,
  addProjectSuccess,
  updateProjectSuccess,
  deleteProjectSuccess,
  setCurrentProject,
  clearError
} = projectsSlice.actions;

export default projectsSlice.reducer;

