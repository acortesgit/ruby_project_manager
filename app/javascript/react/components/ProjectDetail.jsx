import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useMutation } from "@apollo/client";
import { PROJECT_QUERY, PROJECTS_QUERY } from "../graphql/queries";
import { DELETE_TASK, UPDATE_TASK_STATUS, DELETE_PROJECT } from "../graphql/mutations";
import { setCurrentProject, setLoading, setError } from "../store/slices/projectsSlice";
import { deleteTaskSuccess, updateTaskSuccess } from "../store/slices/tasksSlice";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import ConfirmModal from "./ConfirmModal";

const ProjectDetail = ({ project, onBack, onCreateTask, onEditTask, onEditProject, onDeleteProject }) => {
  const dispatch = useDispatch();
  const { loading: projectLoading } = useSelector((state) => state.projects);
  const [editingTask, setEditingTask] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const { data, loading: queryLoading, error, refetch } = useQuery(PROJECT_QUERY, {
    variables: { id: project.id },
    skip: !project
  });

  const [deleteTaskMutation] = useMutation(DELETE_TASK);
  const [updateTaskStatusMutation] = useMutation(UPDATE_TASK_STATUS);
  const [deleteProjectMutation] = useMutation(DELETE_PROJECT, {
    refetchQueries: [{ query: PROJECTS_QUERY }]
  });

  useEffect(() => {
    if (data?.project) {
      dispatch(setCurrentProject(data.project));
    }
  }, [data, dispatch]);

  const handleDeleteTask = (taskId) => {
    setTaskToDelete(taskId);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      dispatch(setLoading(true));
      const { data } = await deleteTaskMutation({ variables: { id: taskToDelete } });
      if (data?.deleteTask?.success) {
        dispatch(deleteTaskSuccess(taskToDelete));
        refetch();
      } else {
        dispatch(setError(data?.deleteTask?.errors?.join(", ") || "Failed to delete task"));
      }
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
      setTaskToDelete(null);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      dispatch(setLoading(true));
      const { data } = await updateTaskStatusMutation({
        variables: { id: taskId, status: newStatus }
      });
      if (data?.updateTaskStatus?.task) {
        dispatch(updateTaskSuccess(data.updateTaskStatus.task));
        refetch();
      } else {
        dispatch(setError(data?.updateTaskStatus?.errors?.join(", ") || "Failed to update task status"));
      }
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
    if (onEditTask) {
      onEditTask(task);
    }
  };

  const handleDeleteProject = () => {
    setShowDeleteProjectModal(true);
  };

  const confirmDeleteProject = async () => {
    try {
      dispatch(setLoading(true));
      const { data } = await deleteProjectMutation({ variables: { id: project.id } });
      if (data?.deleteProject?.success) {
        if (onDeleteProject) {
          onDeleteProject(project.id);
        }
        if (onBack) {
          onBack();
        }
      } else {
        dispatch(setError(data?.deleteProject?.errors?.join(", ") || "Failed to delete project"));
      }
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
      setShowDeleteProjectModal(false);
    }
  };

  const currentProject = data?.project || project;
  const tasks = currentProject?.tasks || [];

  if (queryLoading || projectLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading project...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-900/30 border border-red-500/50 px-4 py-3 text-sm text-red-300">
        {error.message}
      </div>
    );
  }

  return (
    <>
      {/* Delete Project Modal */}
      <ConfirmModal
        isOpen={showDeleteProjectModal}
        onClose={() => setShowDeleteProjectModal(false)}
        onConfirm={confirmDeleteProject}
        title="Delete Project"
        message={`Are you sure you want to delete "${currentProject.name}"? This action cannot be undone and all tasks in this project will be deleted.`}
        confirmText="Delete Project"
        cancelText="Cancel"
        variant="danger"
      />

      {/* Delete Task Modal */}
      <ConfirmModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete Task"
        cancelText="Cancel"
        variant="danger"
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="mb-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            ← Back to Projects
          </button>
          <h2 className="text-2xl font-bold text-white">{currentProject.name}</h2>
          {currentProject.description && (
            <p className="mt-1 text-gray-400">{currentProject.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          {onEditProject && (
            <button
              onClick={() => onEditProject(currentProject)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Edit Project
            </button>
          )}
          <button
            onClick={handleDeleteProject}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
          >
            Delete Project
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Tasks ({tasks.length})</h3>
        {!showTaskForm && onCreateTask && (
          <button
            onClick={() => {
              setEditingTask(null);
              setShowTaskForm(true);
            }}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            New Task
          </button>
        )}
      </div>

      {showTaskForm && (
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-4">
          <h4 className="mb-4 text-lg font-semibold text-white">
            {editingTask ? "Edit Task" : "Create New Task"}
          </h4>
          <TaskForm
            task={editingTask}
            projectId={currentProject.id}
            onSubmit={(formData) => {
              onCreateTask(currentProject.id, formData, editingTask);
              setShowTaskForm(false);
              setEditingTask(null);
            }}
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
            loading={projectLoading}
          />
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="rounded-lg border border-gray-700 bg-gray-800 p-8 text-center">
          <p className="text-gray-400">No tasks yet. Create your first task!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              loading={projectLoading}
            />
          ))}
        </div>
      )}
      </div>
    </>
  );
};

export default ProjectDetail;

