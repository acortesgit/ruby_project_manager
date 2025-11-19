import React, { useState, useEffect } from "react";

const UserForm = ({ onSubmit, onCancel, loading, initialUser = null }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    user_type: 2 // Default to Developer
  });

  useEffect(() => {
    if (initialUser) {
      setFormData({
        full_name: initialUser.fullName || "",
        email: initialUser.email || "",
        user_type: initialUser.userType || 2
      });
    }
  }, [initialUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "user_type" ? parseInt(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-2">
          Full Name *
        </label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          required
          value={formData.full_name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          placeholder="Juan Pérez"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          placeholder="user@example.com"
        />
      </div>

      <div>
        <label htmlFor="user_type" className="block text-sm font-medium text-gray-300 mb-2">
          User Type *
        </label>
        <select
          id="user_type"
          name="user_type"
          value={formData.user_type}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-700 px-3 py-2 text-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        >
          <option value={1}>Admin</option>
          <option value={2}>Developer</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400 disabled:opacity-50 transition-colors"
        >
          {loading ? (initialUser ? "Updating..." : "Creating...") : (initialUser ? "Update User" : "Create User")}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex justify-center rounded-lg bg-gray-700 px-4 py-2 text-sm font-medium text-gray-300 shadow-sm hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default UserForm;

