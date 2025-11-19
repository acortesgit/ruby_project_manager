import React from "react";

const TaskCard = ({ task, onStatusChange, onEdit, onDelete, loading }) => {
  const statusColors = {
    pending: "bg-yellow-900/30 text-yellow-300 border-yellow-500/50",
    in_progress: "bg-blue-900/30 text-blue-300 border-blue-500/50",
    completed: "bg-green-900/30 text-green-300 border-green-500/50"
  };

  // Normalize status to lowercase for color lookup (GraphQL returns uppercase)
  const normalizedStatus = task.status?.toLowerCase() || "pending";
  const statusDisplay = task.status?.replace(/_/g, " ").toUpperCase() || "PENDING";

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-lg">
      <div className="mb-2 flex items-start justify-between">
        <h3 className="text-lg font-semibold text-white">{task.title}</h3>
        <span className={`rounded-full border px-2 py-1 text-xs font-medium ${statusColors[normalizedStatus] || statusColors.pending}`}>
          {statusDisplay}
        </span>
      </div>

      {task.description && (
        <p className="mb-3 text-sm text-gray-400">{task.description}</p>
      )}

      <div className="mb-3 space-y-1 text-xs text-gray-500">
        <p>
          <span className="font-medium">Assigned to:</span> {task.assignee ? (task.assignee.fullName || task.assignee.email) : "Not assigned"}
        </p>
        <p>
          <span className="font-medium">Created:</span> {new Date(task.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            disabled={loading}
            className="rounded-lg bg-indigo-600/20 px-2 py-1 text-xs font-medium text-indigo-300 hover:bg-indigo-600/30 disabled:cursor-not-allowed transition-colors"
          >
            Edit
          </button>
        )}

        {onDelete && (
          <button
            onClick={() => onDelete(task.id)}
            disabled={loading}
            className="rounded-lg bg-red-600/20 px-2 py-1 text-xs font-medium text-red-300 hover:bg-red-600/30 disabled:cursor-not-allowed transition-colors"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

