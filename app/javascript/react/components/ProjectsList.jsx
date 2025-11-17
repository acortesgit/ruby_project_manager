import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@apollo/client";
import { PROJECTS_QUERY } from "../graphql/queries";
import { fetchProjectsSuccess, setLoading, setError } from "../store/slices/projectsSlice";

const ProjectsList = ({ onSelectProject, onCreateProject }) => {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector((state) => state.projects);
  const { data, loading: queryLoading, error, refetch } = useQuery(PROJECTS_QUERY);

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
        <p className="text-gray-500">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
          >
            Refresh
          </button>
          {onCreateProject && (
            <button
              onClick={onCreateProject}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              New Project
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500 mb-4">No projects yet. Create your first project!</p>
          {onCreateProject && (
            <button
              onClick={onCreateProject}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
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
              className="cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
              {project.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
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
};

export default ProjectsList;

