import React, { useEffect, useImperativeHandle, forwardRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { PROJECTS_QUERY } from "../graphql/queries";
import { fetchProjectsSuccess, setLoading, setError } from "../store/slices/projectsSlice";

const ProjectsList = forwardRef(({ onSelectProject, onCreateProject }, ref) => {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state) => state.projects);
  const { data, loading: queryLoading, error, refetch } = useQuery(PROJECTS_QUERY, {
    fetchPolicy: "cache-and-network" // Always fetch fresh data
  });

  // Expose refetch function to parent component
  useImperativeHandle(ref, () => ({
    refetch
  }));

  useEffect(() => {
    if (queryLoading) {
      dispatch(setLoading(true));
    } else if (error) {
      dispatch(setError(error.message));
    } else if (data?.projects) {
      dispatch(fetchProjectsSuccess(data.projects));
    }
  }, [data, queryLoading, error, dispatch]);

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Projects</h2>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Refresh
          </button>
          {onCreateProject && (
            <button
              onClick={onCreateProject}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              New Project
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-900/30 border border-red-500/50 px-4 py-3 text-sm text-red-300">
          {error.message || error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-8 text-center">
          <p className="text-gray-400 mb-4">No projects yet. Create your first project!</p>
          {onCreateProject && (
            <button
              onClick={onCreateProject}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject && onSelectProject(project)}
              className="cursor-pointer rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-lg transition hover:shadow-xl hover:border-gray-600"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.description}</p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{project.tasks?.length || 0} tasks</span>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

ProjectsList.displayName = "ProjectsList";

export default ProjectsList;

