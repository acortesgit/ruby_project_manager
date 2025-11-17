import React from "react";

const TaskCard = ({ task, onStatusChange, onEdit, onDelete, loading }) => {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800"
  };

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in_progress", label: "In Progress" },
    { value: "completed", label: "Completed" }
  ];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[task.status] || statusColors.pending}`}>
          {task.status.replace("_", " ").toUpperCase()}
        </span>
      </div>

      {task.description && (
        <p className="mb-3 text-sm text-gray-600">{task.description}</p>
      )}

      <div className="mb-3 space-y-1 text-xs text-gray-500">
        {task.assignee && (
          <p>
            <span className="font-medium">Assigned to:</span> {task.assignee.email}
          </p>
        )}
        <p>
          <span className="font-medium">Created:</span> {new Date(task.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          disabled={loading}
          className="rounded-md border border-gray-300 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            disabled={loading}
            className="rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-200 disabled:cursor-not-allowed"
          >
            Edit
          </button>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            disabled={loading}
            className="rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-200 disabled:cursor-not-allowed"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

