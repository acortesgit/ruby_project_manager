import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  filters: {
    projectId: null,
    status: null,
    assigneeId: null
  }
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    fetchTasksSuccess: (state, action) => {
      state.tasks = action.payload;
      state.loading = false;
      state.error = null;
    },
    addTaskSuccess: (state, action) => {
      state.tasks.push(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateTaskSuccess: (state, action) => {
      const index = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      state.loading = false;
      state.error = null;
    },
    deleteTaskSuccess: (state, action) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  setLoading,
  setError,
  setFilters,
  fetchTasksSuccess,
  addTaskSuccess,
  updateTaskSuccess,
  deleteTaskSuccess,
  clearError
} = tasksSlice.actions;

export default tasksSlice.reducer;

