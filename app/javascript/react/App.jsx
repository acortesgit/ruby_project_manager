import React, { useMemo, useState, useRef } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { useMutation as useGraphQLMutation } from "@apollo/client";
import { CREATE_PROJECT, UPDATE_PROJECT, CREATE_TASK, UPDATE_TASK } from "./graphql/mutations";
import { PROJECTS_QUERY } from "./graphql/queries";
import { addProjectSuccess, updateProjectSuccess, setCurrentProject, setLoading, setError, deleteProjectSuccess } from "./store/slices/projectsSlice";
import { addTaskSuccess, updateTaskSuccess } from "./store/slices/tasksSlice";
import ProjectsList from "./components/ProjectsList";
import ProjectDetail from "./components/ProjectDetail";
import ProjectForm from "./components/ProjectForm";

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

const Feedback = ({ feedback }) => {
  if (!feedback) return null;

  const toneClasses =
    feedback.type === "error"
      ? "bg-red-900/20 border-red-500/30 text-red-300 backdrop-blur-sm"
      : "bg-green-900/20 border-green-500/30 text-green-300 backdrop-blur-sm";

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm shadow-lg ${toneClasses} animate-in fade-in slide-in-from-top-2 duration-300`}>
      <div className="flex items-center gap-2">
        {feedback.type === "error" ? (
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )}
        <span>{feedback.message}</span>
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
  const [view, setView] = useState("projects"); // "projects", "project-detail", "create-project", "edit-project"
  const [editingProject, setEditingProject] = useState(null);
  const [authView, setAuthView] = useState("login"); // "login" or "register"
  const projectsListRef = useRef(null);

  const clearFeedback = () => setFeedback(null);

  const [registerUser, { loading: registering }] = useMutation(REGISTER_USER_MUTATION);
  const [loginUser, { loading: loggingIn }] = useMutation(LOGIN_USER_MUTATION);
  const [logoutUser, { loading: loggingOut }] = useMutation(LOGOUT_USER_MUTATION);
  const [createProjectMutation] = useGraphQLMutation(CREATE_PROJECT, {
    refetchQueries: [{ query: PROJECTS_QUERY }]
  });
  const [updateProjectMutation] = useGraphQLMutation(UPDATE_PROJECT);
  const [createTaskMutation] = useGraphQLMutation(CREATE_TASK);
  const [updateTaskMutation] = useGraphQLMutation(UPDATE_TASK);

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

      await refetch();
      setFeedback({ type: "success", message: "Account created successfully!" });
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
        const { data } = await updateTaskMutation({
          variables: {
            id: editingTask.id,
            title: formData.title,
            description: formData.description,
            status: formData.status,
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
          dispatch(addTaskSuccess(data.createTask.task));
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

          <Feedback feedback={feedback} />

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

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">DevHub</h1>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-600 transition-colors"
          >
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </header>

        <Feedback feedback={feedback} />

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
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
            <h2 className="mb-4 text-xl font-semibold text-white">Create New Project</h2>
            <ProjectForm
              onSubmit={handleCreateProject}
              onCancel={() => setView("projects")}
              loading={projectsLoading}
            />
          </div>
        )}

        {view === "edit-project" && editingProject && (
          <div className="rounded-lg border border-gray-700 bg-gray-800 p-6">
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
      </div>
    </div>
  );
};

export default App;
