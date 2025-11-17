import React, { useMemo, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";

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

const ENQUEUE_SAMPLE_JOB_MUTATION = gql`
  mutation EnqueueSampleJob($message: String) {
    enqueueSampleJob(message: $message) {
      queued
      jobId
      errors
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

  const [feedback, setFeedback] = useState(null);

  const clearFeedback = () => setFeedback(null);

  const [registerUser, { loading: registering }] = useMutation(REGISTER_USER_MUTATION);
  const [loginUser, { loading: loggingIn }] = useMutation(LOGIN_USER_MUTATION);
  const [logoutUser, { loading: loggingOut }] = useMutation(LOGOUT_USER_MUTATION);
  const [enqueueSampleJob, { loading: queuingJob }] = useMutation(ENQUEUE_SAMPLE_JOB_MUTATION);

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
      // Redirect to Admin Dashboard after successful registration
      setTimeout(() => {
        window.location.replace("/admin");
      }, 100);
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
      // Redirect to Admin Dashboard after successful login
      setTimeout(() => {
        window.location.replace("/admin");
      }, 100);
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
      setFeedback({ type: "success", message: "Signed out." });
    } catch (error) {
      console.error("Logout error", error);
      setFeedback({ type: "error", message: "Unable to sign out. Please try again." });
    }
  };

  const [jobMessage, setJobMessage] = useState("");

  const handleEnqueueJob = async () => {
    clearFeedback();
    try {
      const response = await enqueueSampleJob({
        variables: { message: jobMessage || null }
      });

      const payload = response.data?.enqueueSampleJob;
      if (!payload?.queued) {
        setFeedback({
          type: "error",
          message: payload?.errors?.join(", ") || "Failed to queue job."
        });
        return;
      }

      setJobMessage("");
      setFeedback({
        type: "success",
        message: `Job queued! Sidekiq ID: ${payload.jobId}`
      });
    } catch (error) {
      console.error("Enqueue job error", error);
      setFeedback({ type: "error", message: "Unable to queue the job. Please try again." });
    }
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Training App</h1>
          {currentUser && (
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-500"
            >
              {loggingOut ? "Signing out…" : "Sign out"}
            </button>
          )}
        </header>

        <Feedback feedback={feedback} />

        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Current session</h2>
          {userCard}
        </section>

        {!currentUser && (
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
        )}

        {currentUser && (
          <section className="rounded-lg bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">Background work demo</h2>
            <p className="mb-4 text-sm text-gray-600">
              Queue a Sidekiq job through GraphQL. The job writes an entry to the Rails log including
              the current user.
            </p>
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                type="text"
                placeholder="Optional message"
                value={jobMessage}
                onChange={(event) => setJobMessage(event.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 md:w-2/3"
              />
              <button
                type="button"
                onClick={handleEnqueueJob}
                disabled={queuingJob}
                className="rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300 md:w-1/3"
              >
                {queuingJob ? "Queueing…" : "Queue Sidekiq job"}
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default App;

