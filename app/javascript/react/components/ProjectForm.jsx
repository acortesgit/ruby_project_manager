import React, { useState, useEffect } from "react";

const ProjectForm = ({ project = null, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || ""
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
          Project Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          placeholder="Enter project name"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-700 px-4 py-2 text-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
          placeholder="Enter project description"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400 disabled:opacity-50 transition-colors"
        >
          {loading ? "Saving..." : project ? "Update Project" : "Create Project"}
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

export default ProjectForm;

