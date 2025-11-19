import React from "react";
import { useQuery } from "@apollo/client";
import { USERS_QUERY } from "../graphql/queries";

const UsersList = ({ onCreateUser, onEditUser, onDeleteUser }) => {
  const { data, loading, error, refetch } = useQuery(USERS_QUERY);

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-900/30 border border-red-500/50 px-4 py-3 text-sm text-red-300">
        {error.message || "Error loading users"}
      </div>
    );
  }

  const users = data?.users || [];

  const getUserTypeLabel = (userType) => {
    // Handle both number and string comparisons
    const type = typeof userType === 'string' ? parseInt(userType, 10) : userType;
    return type === 1 ? "Admin" : "Developer";
  };

  const getUserTypeBadgeClass = (userType) => {
    // Handle both number and string comparisons
    const type = typeof userType === 'string' ? parseInt(userType, 10) : userType;
    return type === 1
      ? "bg-purple-900/30 text-purple-300 border-purple-500/50"
      : "bg-blue-900/30 text-blue-300 border-blue-500/50";
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Developers</h2>
        {onCreateUser && (
          <button
            onClick={onCreateUser}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            New User
          </button>
        )}
      </div>

      {users.length === 0 ? (
        <div className="w-full rounded-lg border border-gray-700 bg-gray-800 p-8 text-center">
          <p className="text-gray-400 mb-4">No developers yet. Create your first developer user!</p>
          {onCreateUser && (
            <button
              onClick={onCreateUser}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Create User
            </button>
          )}
        </div>
      ) : (
        <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {user.fullName || user.email}
                  </h3>
                  {user.fullName && (
                    <p className="text-sm text-gray-400 mb-2">{user.email}</p>
                  )}
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded border ${getUserTypeBadgeClass(
                      user.userType
                    )}`}
                  >
                    {getUserTypeLabel(user.userType)}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mb-3">
                Created: {new Date(user.createdAt).toLocaleDateString()}
              </div>
              <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-700">
                {onEditUser && (
                  <button
                    onClick={() => onEditUser(user)}
                    className="flex-1 rounded-lg bg-indigo-600/20 px-3 py-2 text-xs font-medium text-indigo-300 hover:bg-indigo-600/30 transition-colors"
                  >
                    Edit
                  </button>
                )}
                {onDeleteUser && (
                  <button
                    onClick={() => onDeleteUser(user.id)}
                    className="flex-1 rounded-lg bg-red-600/20 px-3 py-2 text-xs font-medium text-red-300 hover:bg-red-600/30 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersList;


