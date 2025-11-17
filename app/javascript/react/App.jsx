import React, { useMemo, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { useMutation as useGraphQLMutation } from "@apollo/client";
import { CREATE_PROJECT, UPDATE_PROJECT, CREATE_TASK, UPDATE_TASK } from "./graphql/mutations";
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
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">{title}</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor={`${title}-email`}>
            Email
          </label>
          <input
            id={`${title}-email`}
            name="email"
            type="email"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            value={formState.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor={`${title}-password`}>
            Password
          </label>
          <input
            id={`${title}-password`}
            name="password"
            type="password"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            value={formState.password}
            onChange={handleChange}
          />
        </div>

        {includePasswordConfirmation && (
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor={`${title}-passwordConfirmation`}
            >
              Confirm password
            </label>
            <input
              id={`${title}-passwordConfirmation`}
              name="passwordConfirmation"
              type="password"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              value={formState.passwordConfirmation}
              onChange={handleChange}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {loading ? "Processing..." : submitLabel}
        </button>
      </form>
    </section>
  );
};

const Feedback = ({ feedback }) => {
  if (!feedback) return null;

  const toneClasses =
    feedback.type === "error"
      ? "bg-red-50 border-red-200 text-red-700"
      : "bg-green-50 border-green-200 text-green-700";

  return (
    <div className={`rounded-md border px-4 py-3 text-sm ${toneClasses}`}>
      {feedback.message}
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

  const clearFeedback = () => setFeedback(null);

  const [registerUser, { loading: registering }] = useMutation(REGISTER_USER_MUTATION);
  const [loginUser, { loading: loggingIn }] = useMutation(LOGIN_USER_MUTATION);
  const [logoutUser, { loading: loggingOut }] = useMutation(LOGOUT_USER_MUTATION);
  const [createProjectMutation] = useGraphQLMutation(CREATE_PROJECT);
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

  const handleDeleteProject = (projectId) => {
    dispatch(deleteProjectSuccess(projectId));
    setView("projects");
    setFeedback({ type: "success", message: "Project deleted successfully!" });
  };

  const userCard = useMemo(() => {
    if (currentUserLoading) {
      return <p className="text-sm text-gray-500">Loading session…</p>;
    }

    if (!currentUser) {
      return <p className="text-sm text-gray-500">No active session.</p>;
    }

    return (
      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-medium">Email:</span> {currentUser.email}
        </p>
        <p>
          <span className="font-medium">User ID:</span> {currentUser.id}
        </p>
      </div>
    );
  }, [currentUser, currentUserLoading]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-4xl space-y-6">
          <header className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Training App</h1>
          </header>

          <Feedback feedback={feedback} />

          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Current session</h2>
            {userCard}
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <AuthForm
              title="Create account"
              submitLabel="Register"
              onSubmit={handleRegister}
              includePasswordConfirmation
              loading={registering}
            />
            <AuthForm
              title="Sign in"
              submitLabel="Log in"
              onSubmit={handleLogin}
              loading={loggingIn}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Training App</h1>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-500"
          >
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </header>

        <Feedback feedback={feedback} />

        {view === "projects" && (
          <ProjectsList
            onSelectProject={handleSelectProject}
            onCreateProject={() => {
              setEditingProject(null);
              setView("create-project");
            }}
          />
        )}

        {view === "create-project" && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Create New Project</h2>
            <ProjectForm
              onSubmit={handleCreateProject}
              onCancel={() => setView("projects")}
              loading={projectsLoading}
            />
          </div>
        )}

        {view === "edit-project" && editingProject && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Edit Project</h2>
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
