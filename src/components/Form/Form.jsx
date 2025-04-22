/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { forwardRef } from "react";
import { FaPlus, FaSave, FaSearch, FaCheck, FaTimes, FaTrashAlt } from "react-icons/fa";
import "./Form.css";

const Form = forwardRef((props, ref) => {
  const {
    HandleInput,
    HandleSubmit,
    TaskName,
    ButtonRefFunction,
    ClickToEdit,
    handleSearch,
    searchTerm,
    filterStatus,
    handleFilterChange,
    filterCategory,
    handleCategoryFilter,
    sortBy,
    handleSortChange,
    deleteCompletedTasks,
    markAllAs,
    stats
  } = props;

  return (
    <div className="form-container">
      {/* Task Statistics */}
      <div className="task-stats">
        <div className="stat-item total">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-item active">
          <div className="stat-number">{stats.active}</div>
          <div className="stat-label">Active Tasks</div>
        </div>
        <div className="stat-item completed">
          <div className="stat-number">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      {/* Task Input Form */}
      <div className="task-input-container">
        <input
          type="text"
          className="task-input"
          placeholder="Add a new task..."
          value={TaskName}
          onChange={HandleInput}
          ref={ref}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              ClickToEdit ? ButtonRefFunction(e) : HandleSubmit(e);
            }
          }}
        />
        <button
          className={`add-btn ${ClickToEdit ? "edit-mode" : ""}`}
          onClick={(e) => ClickToEdit ? ButtonRefFunction(e) : HandleSubmit(e)}
        >
          {ClickToEdit ? (
            <>
              <FaSave className="add-btn-icon" /> Save
            </>
          ) : (
            <>
              <FaPlus className="add-btn-icon" /> Add Task
            </>
          )}
        </button>
      </div>

      {/* Task Controls */}
      <div className="task-controls">
        {/* Search */}
        <div className="control-group search">
          <div className="control-group-title">Search Tasks</div>
          <div className="search-input-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Filter by Status */}
        <div className="control-group">
          <div className="control-group-title">Filter by Status</div>
          <div className="filter-btn-group">
            <button
              className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
              onClick={() => handleFilterChange("all")}
            >
              All
            </button>
            <button
              className={`filter-btn ${filterStatus === "active" ? "active" : ""}`}
              onClick={() => handleFilterChange("active")}
            >
              Active
            </button>
            <button
              className={`filter-btn ${filterStatus === "completed" ? "active" : ""}`}
              onClick={() => handleFilterChange("completed")}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Filter by Category */}
        <div className="control-group">
          <div className="control-group-title">Filter by Category</div>
          <div className="filter-btn-group">
            <button
              className={`filter-btn ${filterCategory === "all" ? "active" : ""}`}
              onClick={() => handleCategoryFilter("all")}
            >
              All
            </button>
            <button
              className={`filter-btn ${filterCategory === "general" ? "active" : ""}`}
              onClick={() => handleCategoryFilter("general")}
            >
              General
            </button>
            <button
              className={`filter-btn ${filterCategory === "work" ? "active" : ""}`}
              onClick={() => handleCategoryFilter("work")}
            >
              Work
            </button>
            <button
              className={`filter-btn ${filterCategory === "personal" ? "active" : ""}`}
              onClick={() => handleCategoryFilter("personal")}
            >
              Personal
            </button>
            <button
              className={`filter-btn ${filterCategory === "shopping" ? "active" : ""}`}
              onClick={() => handleCategoryFilter("shopping")}
            >
              Shopping
            </button>
            <button
              className={`filter-btn ${filterCategory === "health" ? "active" : ""}`}
              onClick={() => handleCategoryFilter("health")}
            >
              Health
            </button>
          </div>
        </div>

        {/* Sort */}
        <div className="control-group">
          <div className="control-group-title">Sort By</div>
          <div className="sort-select-group">
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="priority">Priority</option>
              <option value="dueDate">Due Date</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="control-group">
          <div className="control-group-title">Bulk Actions</div>
          <div className="bulk-actions">
            <button
              className="bulk-action-btn bulk-action-complete"
              onClick={() => markAllAs(true)}
            >
              <FaCheck /> Mark All Complete
            </button>
            <button
              className="bulk-action-btn bulk-action-active"
              onClick={() => markAllAs(false)}
            >
              <FaTimes /> Mark All Active
            </button>
            <button
              className="bulk-action-btn bulk-action-clear"
              onClick={deleteCompletedTasks}
            >
              <FaTrashAlt /> Clear Completed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Form;
