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

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">My Projects</h2>
          {onCreateProject && (
            <button
              onClick={onCreateProject}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              New Project
            </button>
          )}
      </div>

      {error && (
        <div className="rounded-lg bg-red-900/30 border border-red-500/50 px-4 py-3 text-sm text-red-300">
          {error.message || error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="w-full rounded-lg border border-gray-700 bg-gray-800 p-8 text-center">
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
        <div className="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject && onSelectProject(project)}
              className="group cursor-pointer rounded-xl border border-gray-700/50 bg-gradient-to-br from-gray-800 to-gray-800/50 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-indigo-500/50 hover:from-gray-800 hover:to-gray-800/80 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-500/20 p-2.5 border border-indigo-500/30 flex-shrink-0">
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors truncate">{project.name}</h3>
                  </div>
                </div>
              </div>
              
              {project.description && (
                <p className="text-sm text-gray-400 mb-4 line-clamp-2 leading-relaxed">{project.description}</p>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                <div className="flex items-center gap-2 text-xs text-gray-400 whitespace-nowrap">
                  <svg className="w-2 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="font-medium">{project.tasks?.length || 0} tasks</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
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

