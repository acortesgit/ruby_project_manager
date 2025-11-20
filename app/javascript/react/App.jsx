import React, { useMemo, useState, useRef, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { useMutation as useGraphQLMutation } from "@apollo/client";
import { CREATE_PROJECT, UPDATE_PROJECT, CREATE_TASK, UPDATE_TASK, CREATE_USER, UPDATE_USER, DELETE_USER } from "./graphql/mutations";
import { PROJECTS_QUERY, PROJECT_QUERY, USERS_QUERY } from "./graphql/queries";
import { addProjectSuccess, updateProjectSuccess, setCurrentProject, setLoading, setError, deleteProjectSuccess } from "./store/slices/projectsSlice";
import { addTaskSuccess, updateTaskSuccess } from "./store/slices/tasksSlice";
import ProjectsList from "./components/ProjectsList";
import ProjectDetail from "./components/ProjectDetail";
import ProjectForm from "./components/ProjectForm";
import UsersList from "./components/UsersList";
import UserForm from "./components/UserForm";
import ConfirmModal from "./components/ConfirmModal";
import NotificationsList from "./components/NotificationsList";

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      id
      email
      createdAt
    }
  }
`;

const REGISTER_USER_MUTATION = gql`
  mutation RegisterUser($email: String!, $password: String!, $passwordConfirmation: String!) {
    registerUser(email: $email, password: $password, passwordConfirmation: $passwordConfirmation) {
      user {
        id
        email
      }
      errors
    }
  }
`;

const LOGIN_USER_MUTATION = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      user {
        id
        email
      }
      errors
    }
  }
`;

const LOGOUT_USER_MUTATION = gql`
  mutation LogoutUser {
    logoutUser {
      success
    }
  }
`;

const AuthForm = ({ title, includePasswordConfirmation = false, loading, onSubmit, submitLabel }) => {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    passwordConfirmation: ""
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formState);
  };

  return (
    <section className="max-w-md w-full mx-auto rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 p-8 shadow-2xl backdrop-blur-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
        <div className="h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor={`${title}-email`}>
            Email
          </label>
          <input
            id={`${title}-email`}
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-gray-600/50 bg-gray-800/50 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-500 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-gray-800 transition-all duration-200"
            placeholder="you@example.com"
            value={formState.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor={`${title}-password`}>
            Password
          </label>
          <input
            id={`${title}-password`}
            name="password"
            type="password"
            required
            className="w-full rounded-xl border border-gray-600/50 bg-gray-800/50 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-500 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-gray-800 transition-all duration-200"
            placeholder="••••••••"
            value={formState.password}
            onChange={handleChange}
          />
        </div>

        {includePasswordConfirmation && (
          <div>
            <label
              className="block text-sm font-medium text-gray-300 mb-2"
              htmlFor={`${title}-passwordConfirmation`}
            >
              Confirm password
            </label>
            <input
              id={`${title}-passwordConfirmation`}
              name="passwordConfirmation"
              type="password"
              required
              className="w-full rounded-xl border border-gray-600/50 bg-gray-800/50 backdrop-blur-sm px-4 py-3 text-white placeholder-gray-500 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-gray-800 transition-all duration-200"
              placeholder="••••••••"
              value={formState.passwordConfirmation}
              onChange={handleChange}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-500 hover:to-purple-500 hover:shadow-xl hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:from-indigo-600 disabled:hover:to-purple-600 transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            submitLabel
          )}
        </button>
      </form>
    </section>
  );
};

const Feedback = ({ feedback, onDismiss }) => {
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => {
        if (onDismiss) {
          onDismiss();
        }
      }, feedback.type === "success" ? 3000 : 5000); // Success: 3s, Error: 5s

      return () => clearTimeout(timer);
    }
  }, [feedback, onDismiss]);

  if (!feedback) return null;

  const toneClasses =
    feedback.type === "error"
      ? "bg-red-700 border-red-400 text-white"
      : "bg-emerald-600 border-emerald-400 text-white";

  const bgColor = feedback.type === "error" 
    ? "rgba(185, 28, 28, 0.95)" // red-700 with opacity
    : "rgba(5, 150, 105, 0.95)"; // emerald-600 with opacity
  
  const borderColor = feedback.type === "error"
    ? "rgba(248, 113, 113, 0.8)" // red-400
    : "rgba(52, 211, 153, 0.8)"; // emerald-400

  return (
    <div 
      className={`rounded-lg border-2 px-4 py-3 text-sm shadow-2xl text-white font-medium min-w-[300px] max-w-[500px] transform transition-all duration-300 ease-out backdrop-blur-sm`}
      style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        zIndex: 99999,
        backgroundColor: bgColor,
        borderColor: borderColor,
        animation: 'slideInUp 0.3s ease-out'
      }}
    >
      <div className="flex items-center gap-3">
        {feedback.type === "error" ? (
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
        <span className="flex-1 font-medium">{feedback.message}</span>
        <button
          onClick={onDismiss}
          className="ml-2 text-white/80 hover:text-white transition-colors rounded hover:bg-white/10 p-1"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const { data, loading: currentUserLoading, refetch } = useQuery(CURRENT_USER_QUERY);
  const currentUser = data?.currentUser ?? null;

  const dispatch = useDispatch();
  const { currentProject, loading: projectsLoading } = useSelector((state) => state.projects);

  const [feedback, setFeedback] = useState(null);
  const [view, setView] = useState("projects"); // "projects", "project-detail", "create-project", "edit-project", "users", "create-user", "edit-user"
  const [section, setSection] = useState("projects"); // "projects", "users", or "notifications"
  const [editingProject, setEditingProject] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [authView, setAuthView] = useState("login"); // "login" or "register"
  const [isDesktop, setIsDesktop] = useState(false);
  const projectsListRef = useRef(null);

  const clearFeedback = () => setFeedback(null);

  const [registerUser, { loading: registering }] = useMutation(REGISTER_USER_MUTATION);
  const [loginUser, { loading: loggingIn }] = useMutation(LOGIN_USER_MUTATION);
  const [logoutUser, { loading: loggingOut }] = useMutation(LOGOUT_USER_MUTATION);
  const [createProjectMutation] = useGraphQLMutation(CREATE_PROJECT, {
    update: (cache, { data }) => {
      if (data?.createProject?.project) {
        const existingData = cache.readQuery({ query: PROJECTS_QUERY });
        if (existingData) {
          cache.writeQuery({
            query: PROJECTS_QUERY,
            data: {
              projects: [...existingData.projects, data.createProject.project]
            }
          });
        }
      }
    }
  });
  const [updateProjectMutation] = useGraphQLMutation(UPDATE_PROJECT, {
    update: (cache, { data }) => {
      if (data?.updateProject?.project) {
        const existingData = cache.readQuery({ query: PROJECTS_QUERY });
        if (existingData) {
          cache.writeQuery({
            query: PROJECTS_QUERY,
            data: {
              projects: existingData.projects.map(p => 
                p.id === data.updateProject.project.id ? data.updateProject.project : p
              )
            }
          });
        }
        // Also update PROJECT_QUERY if it's in cache
        try {
          const projectData = cache.readQuery({ 
            query: PROJECT_QUERY, 
            variables: { id: data.updateProject.project.id } 
          });
          if (projectData) {
            cache.writeQuery({
              query: PROJECT_QUERY,
              variables: { id: data.updateProject.project.id },
              data: {
                project: data.updateProject.project
              }
            });
          }
        } catch (e) {
          // PROJECT_QUERY not in cache, that's ok
        }
      }
    }
  });
  const [createTaskMutation] = useGraphQLMutation(CREATE_TASK, {
    update: (cache, { data }) => {
      if (data?.createTask?.task) {
        const projectId = data.createTask.task.project.id;
        const newTask = data.createTask.task;
        
        try {
          const projectData = cache.readQuery({ 
            query: PROJECT_QUERY, 
            variables: { id: projectId } 
          });
          if (projectData?.project) {
            // Check if task already exists to avoid duplicates
            const taskExists = projectData.project.tasks?.some(t => t.id === newTask.id);
            if (!taskExists) {
              cache.writeQuery({
                query: PROJECT_QUERY,
                variables: { id: projectId },
                data: {
                  project: {
                    ...projectData.project,
                    tasks: [...(projectData.project.tasks || []), newTask]
                  }
                }
              });
            }
          }
        } catch (e) {
          // PROJECT_QUERY not in cache, that's ok
        }
        
        // Update PROJECTS_QUERY to update task count
        try {
          const existingData = cache.readQuery({ query: PROJECTS_QUERY });
          if (existingData) {
            const taskExists = existingData.projects
              .find(p => p.id === projectId)?.tasks?.some(t => t.id === newTask.id);
            if (!taskExists) {
              cache.writeQuery({
                query: PROJECTS_QUERY,
                data: {
                  projects: existingData.projects.map(p => 
                    p.id === projectId 
                      ? { ...p, tasks: [...(p.tasks || []), newTask] }
                      : p
                  )
                }
              });
            }
          }
        } catch (e) {
          // PROJECTS_QUERY not in cache, that's ok
        }
      }
    }
  });
  const [updateTaskMutation] = useGraphQLMutation(UPDATE_TASK, {
    update: (cache, { data }) => {
      if (data?.updateTask?.task) {
        const projectId = data.updateTask.task.project.id;
        try {
          const projectData = cache.readQuery({ 
            query: PROJECT_QUERY, 
            variables: { id: projectId } 
          });
          if (projectData?.project) {
            cache.writeQuery({
              query: PROJECT_QUERY,
              variables: { id: projectId },
              data: {
                project: {
                  ...projectData.project,
                  tasks: projectData.project.tasks.map(t => 
                    t.id === data.updateTask.task.id ? data.updateTask.task : t
                  )
                }
              }
            });
          }
        } catch (e) {
          // PROJECT_QUERY not in cache, that's ok
        }
      }
    }
  });
  const [createUserMutation] = useGraphQLMutation(CREATE_USER, {
    update: (cache, { data }) => {
      if (data?.createUser?.user) {
        const existingData = cache.readQuery({ query: USERS_QUERY });
        if (existingData) {
          cache.writeQuery({
            query: USERS_QUERY,
            data: {
              users: [...existingData.users, data.createUser.user]
            }
          });
        }
      }
    }
  });
  const [updateUserMutation] = useGraphQLMutation(UPDATE_USER, {
    update: (cache, { data }) => {
      if (data?.updateUser?.user) {
        const existingData = cache.readQuery({ query: USERS_QUERY });
        if (existingData) {
          cache.writeQuery({
            query: USERS_QUERY,
            data: {
              users: existingData.users.map(u => 
                u.id === data.updateUser.user.id ? data.updateUser.user : u
              )
            }
          });
        }
      }
    }
  });
  const [deleteUserMutation] = useGraphQLMutation(DELETE_USER, {
    update: (cache, { data }, { variables }) => {
      if (data?.deleteUser?.success && variables?.id) {
        const existingData = cache.readQuery({ query: USERS_QUERY });
        if (existingData) {
          cache.writeQuery({
            query: USERS_QUERY,
            data: {
              users: existingData.users.filter(u => u.id !== variables.id)
            }
          });
        }
      }
    }
  });

  const handleRegister = async ({ email, password, passwordConfirmation }) => {
    clearFeedback();

    try {
      const response = await registerUser({
        variables: { email, password, passwordConfirmation }
      });

      const payload = response.data?.registerUser;
      if (payload?.errors?.length) {
        setFeedback({ type: "error", message: payload.errors.join(", ") });
        return;
      }

      // After successful registration, switch to login view
      setAuthView("login");
      setFeedback({ type: "success", message: "Account created successfully! Please sign in to continue." });
    } catch (error) {
      console.error("Register error", error);
      setFeedback({ type: "error", message: "Unable to create the account. Please try again." });
    }
  };

  const handleLogin = async ({ email, password }) => {
    clearFeedback();

    try {
      const response = await loginUser({
        variables: { email, password }
      });

      const payload = response.data?.loginUser;
      if (payload?.errors?.length) {
        setFeedback({ type: "error", message: payload.errors.join(", ") });
        return;
      }

      await refetch();
      setFeedback({ type: "success", message: "Signed in successfully!" });
    } catch (error) {
      console.error("Login error", error);
      setFeedback({ type: "error", message: "Unable to sign in. Please try again." });
    }
  };

  const handleLogout = async () => {
    clearFeedback();

    try {
      await logoutUser();
      await refetch();
      setView("projects");
      dispatch(setCurrentProject(null));
      setFeedback({ type: "success", message: "Signed out." });
    } catch (error) {
      console.error("Logout error", error);
      setFeedback({ type: "error", message: "Unable to sign out. Please try again." });
    }
  };

  const handleCreateProject = async (formData) => {
    try {
      dispatch(setLoading(true));
      clearFeedback();
      const { data } = await createProjectMutation({
        variables: { name: formData.name, description: formData.description }
      });

      if (data?.createProject?.project) {
        dispatch(addProjectSuccess(data.createProject.project));
        setView("projects");
        setFeedback({ type: "success", message: "Project created successfully!" });
      } else {
        dispatch(setError(data?.createProject?.errors?.join(", ") || "Failed to create project"));
        setFeedback({ type: "error", message: data?.createProject?.errors?.join(", ") || "Failed to create project" });
      }
    } catch (error) {
      dispatch(setError(error.message));
      setFeedback({ type: "error", message: error.message });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleUpdateProject = async (formData) => {
    try {
      dispatch(setLoading(true));
      clearFeedback();
      const { data } = await updateProjectMutation({
        variables: { id: editingProject.id, name: formData.name, description: formData.description }
      });

      if (data?.updateProject?.project) {
        dispatch(updateProjectSuccess(data.updateProject.project));
        setView("project-detail");
        setEditingProject(null);
        setFeedback({ type: "success", message: "Project updated successfully!" });
      } else {
        dispatch(setError(data?.updateProject?.errors?.join(", ") || "Failed to update project"));
        setFeedback({ type: "error", message: data?.updateProject?.errors?.join(", ") || "Failed to update project" });
      }
    } catch (error) {
      dispatch(setError(error.message));
      setFeedback({ type: "error", message: error.message });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCreateTask = async (projectId, formData, editingTask = null) => {
    try {
      dispatch(setLoading(true));
      clearFeedback();

      if (editingTask) {
        // Convert status to uppercase for GraphQL enum (pending -> PENDING, in_progress -> IN_PROGRESS, completed -> COMPLETED)
        const statusUpper = formData.status.toUpperCase();
        const { data } = await updateTaskMutation({
          variables: {
            id: editingTask.id,
            title: formData.title,
            description: formData.description,
            status: statusUpper,
            assigneeId: formData.assigneeId || null
          }
        });

        if (data?.updateTask?.task) {
          dispatch(updateTaskSuccess(data.updateTask.task));
          setFeedback({ type: "success", message: "Task updated successfully!" });
        } else {
          dispatch(setError(data?.updateTask?.errors?.join(", ") || "Failed to update task"));
          setFeedback({ type: "error", message: data?.updateTask?.errors?.join(", ") || "Failed to update task" });
        }
      } else {
        const { data } = await createTaskMutation({
          variables: {
            projectId,
            title: formData.title,
            description: formData.description,
            assigneeId: formData.assigneeId || null
          }
        });

        if (data?.createTask?.task) {
          // Don't dispatch to Redux - Apollo cache handles the update
          setFeedback({ type: "success", message: "Task created successfully!" });
        } else {
          dispatch(setError(data?.createTask?.errors?.join(", ") || "Failed to create task"));
          setFeedback({ type: "error", message: data?.createTask?.errors?.join(", ") || "Failed to create task" });
        }
      }
    } catch (error) {
      dispatch(setError(error.message));
      setFeedback({ type: "error", message: error.message });
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSelectProject = (project) => {
    dispatch(setCurrentProject(project));
    setView("project-detail");
  };

  // Auto-refresh projects list when view changes to projects
  React.useEffect(() => {
    if (view === "projects" && projectsListRef.current?.refetch) {
      // Small delay to ensure component is mounted
      const timer = setTimeout(() => {
        projectsListRef.current.refetch();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const handleDeleteProject = async (projectId) => {
    dispatch(deleteProjectSuccess(projectId));
    setView("projects");
    setFeedback({ type: "success", message: "Project deleted successfully!" });
  };

  const handleCreateUser = async (formData) => {
    try {
      clearFeedback();
      const { data, errors: graphqlErrors } = await createUserMutation({
        variables: {
          fullName: formData.full_name,
          email: formData.email,
          userType: formData.user_type
        }
      });

      if (graphqlErrors && graphqlErrors.length > 0) {
        const errorMessages = graphqlErrors.map(err => err.message).join(", ");
        setFeedback({ type: "error", message: errorMessages });
        console.error("GraphQL errors:", graphqlErrors);
        return;
      }

      if (data?.createUser?.user) {
        setView("users");
        setFeedback({ type: "success", message: "User created successfully!" });
      } else if (data?.createUser?.errors && data.createUser.errors.length > 0) {
        setFeedback({ type: "error", message: data.createUser.errors.join(", ") });
        console.error("Backend errors:", data.createUser.errors);
      } else {
        setFeedback({ type: "error", message: "Failed to create user. Please try again." });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setFeedback({ type: "error", message: error.message || "Unable to create user. Please try again." });
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setView("edit-user");
  };

  const handleUpdateUser = async (formData) => {
    if (!editingUser) return;

    try {
      clearFeedback();
      const { data, errors: graphqlErrors } = await updateUserMutation({
        variables: {
          id: editingUser.id,
          fullName: formData.full_name,
          email: formData.email,
          userType: formData.user_type
        }
      });

      if (graphqlErrors && graphqlErrors.length > 0) {
        const errorMessages = graphqlErrors.map(err => err.message).join(", ");
        setFeedback({ type: "error", message: errorMessages });
        console.error("GraphQL errors:", graphqlErrors);
        return;
      }

      if (data?.updateUser?.user) {
        setEditingUser(null);
        setView("users");
        setFeedback({ type: "success", message: "User updated successfully!" });
      } else if (data?.updateUser?.errors && data.updateUser.errors.length > 0) {
        setFeedback({ type: "error", message: data.updateUser.errors.join(", ") });
        console.error("Backend errors:", data.updateUser.errors);
      } else {
        setFeedback({ type: "error", message: "Failed to update user. Please try again." });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      setFeedback({ type: "error", message: error.message || "Unable to update user. Please try again." });
    }
  };

  const handleDeleteUser = (userId) => {
    setUserToDelete(userId);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      clearFeedback();
      const { data, errors: graphqlErrors } = await deleteUserMutation({
        variables: { id: userToDelete }
      });

      if (graphqlErrors && graphqlErrors.length > 0) {
        const errorMessages = graphqlErrors.map(err => err.message).join(", ");
        setFeedback({ type: "error", message: errorMessages });
        console.error("GraphQL errors:", graphqlErrors);
        setUserToDelete(null);
        return;
      }

      if (data?.deleteUser?.success) {
        setUserToDelete(null);
        setFeedback({ type: "success", message: "User deleted successfully!" });
      } else if (data?.deleteUser?.errors && data.deleteUser.errors.length > 0) {
        setFeedback({ type: "error", message: data.deleteUser.errors.join(", ") });
        console.error("Backend errors:", data.deleteUser.errors);
        setUserToDelete(null);
      } else {
        setFeedback({ type: "error", message: "Failed to delete user. Please try again." });
        setUserToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setFeedback({ type: "error", message: error.message || "Unable to delete user. Please try again." });
      setUserToDelete(null);
    }
  };

  const handleSectionChange = (newSection) => {
    setSection(newSection);
    if (newSection === "projects") {
      setView("projects");
    } else if (newSection === "users") {
      setView("users");
    } else if (newSection === "notifications") {
      setView("notifications");
    }
  };

  // Hook para detectar si es desktop
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-black flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-8">
          <header className="text-center space-y-3">
            <div className="inline-block">
              <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                DevHub
              </h1>
            </div>
            <p className="text-gray-400 text-base sm:text-lg">
              {authView === "login" 
                ? "Welcome back! Please sign in to continue." 
                : "Create your account to get started."}
            </p>
          </header>

          <Feedback feedback={feedback} onDismiss={clearFeedback} />

          {authView === "login" ? (
            <div className="space-y-6">
              <AuthForm
                title="Sign in"
                submitLabel="Log in"
                onSubmit={handleLogin}
                loading={loggingIn}
              />
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthView("register")}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors underline decoration-2 underline-offset-2 decoration-indigo-500/50 hover:decoration-indigo-400"
                  >
                    Create one here
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <AuthForm
                title="Create account"
                submitLabel="Register"
                onSubmit={handleRegister}
                includePasswordConfirmation
                loading={registering}
              />
              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setAuthView("login")}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors underline decoration-2 underline-offset-2 decoration-indigo-500/50 hover:decoration-indigo-400"
                  >
                    Sign in here
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const sections = [
    { id: "projects", label: "Projects", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    )},
    { id: "users", label: "Users", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )},
    { id: "notifications", label: "Notifications", icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    )}
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="w-full bg-gray-900 border-b border-gray-700">
        <div className="w-full px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 py-8 sm:py-10">
            <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto">
              <h1 className="text-3xl font-bold text-white">DevHub</h1>
              <nav className="flex items-center gap-2 sm:gap-3">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => handleSectionChange(sec.id)}
                    className={`flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg transition-colors ${
                      section === sec.id
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                    title={sec.label}
                  >
                    {sec.icon}
                    {isDesktop && <span className="font-medium">{sec.label}</span>}
                  </button>
                ))}
              </nav>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 sm:px-6 sm:py-3 text-base font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-600 transition-colors whitespace-nowrap min-w-fit"
              title="Sign out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {isDesktop && (
                <span>
                  {loggingOut ? "Signing\u00A0out…" : "Sign\u00A0out"}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="w-full">
        <div className="w-full p-6 px-8 space-y-6 max-w-7xl mx-auto">

        {view === "projects" && (
          <ProjectsList
            ref={projectsListRef}
            onSelectProject={handleSelectProject}
            onCreateProject={() => {
              setEditingProject(null);
              setView("create-project");
            }}
          />
        )}

        {view === "create-project" && (
          <div className="w-full rounded-lg border border-gray-700 bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Create New Project</h2>
            <ProjectForm
              onSubmit={handleCreateProject}
              onCancel={() => setView("projects")}
              loading={projectsLoading}
            />
          </div>
        )}

        {view === "edit-project" && editingProject && (
          <div className="w-full rounded-lg border border-gray-700 bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Edit Project</h2>
            <ProjectForm
              project={editingProject}
              onSubmit={handleUpdateProject}
              onCancel={() => {
                setView("project-detail");
                setEditingProject(null);
              }}
              loading={projectsLoading}
            />
          </div>
        )}

        {view === "project-detail" && currentProject && (
          <ProjectDetail
            project={currentProject}
            onBack={() => {
              setView("projects");
              dispatch(setCurrentProject(null));
            }}
            onCreateTask={handleCreateTask}
            onEditTask={(task) => {
              // This will be handled in ProjectDetail component
            }}
            onEditProject={(project) => {
              setEditingProject(project);
              setView("edit-project");
            }}
            onDeleteProject={handleDeleteProject}
          />
        )}

        {view === "users" && (
          <UsersList
            onCreateUser={() => setView("create-user")}
            onEditUser={handleEditUser}
            onDeleteUser={handleDeleteUser}
          />
        )}

        {view === "create-user" && (
          <div className="w-full rounded-lg border border-gray-700 bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Create New User</h2>
            <UserForm
              onSubmit={handleCreateUser}
              onCancel={() => setView("users")}
              loading={false}
            />
          </div>
        )}

        {view === "edit-user" && editingUser && (
          <div className="w-full rounded-lg border border-gray-700 bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Edit User</h2>
            <UserForm
              onSubmit={handleUpdateUser}
              onCancel={() => {
                setEditingUser(null);
                setView("users");
              }}
              loading={false}
              initialUser={editingUser}
            />
          </div>
        )}

        {view === "notifications" && (
          <NotificationsList />
        )}
        </div>
        <ConfirmModal
          isOpen={!!userToDelete}
          onClose={() => setUserToDelete(null)}
          onConfirm={confirmDeleteUser}
          title="Delete User"
          message="Are you sure you want to delete this user? This action cannot be undone."
          confirmText="Delete User"
          cancelText="Cancel"
          variant="danger"
        />
        <Feedback feedback={feedback} onDismiss={clearFeedback} />
      </div>
    </div>
  );
};

export default App;
