/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { 
  FaEdit, 
  FaTrashAlt, 
  FaFlag, 
  FaTag, 
  FaCalendarAlt,
  FaStar
} from "react-icons/fa";
import "./addtask.css";

// ----------Alerts Import --------------//
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.min.css";

const TaskUi = (props) => {
  const {
    TaskObj,
    HandleClick,
    DeleteTask,
    EditTask,
    updateTaskPriority,
    updateTaskCategory,
    setTaskDueDate,
    darkMode
  } = props;

  // State Declarations
  const [ClickState, setClickState] = useState(
    JSON.parse(localStorage.getItem("Clickes")) || {}
  );
  const [showOptions, setShowOptions] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const HandleClickItem = (item) => {
    try {
      // Update the click state
      setClickState((prev) => ({
        ...prev,
        [item.id]: !prev[item.id],
      }));

      // Call the parent handler to update the main task state
      HandleClick(item.id);
      
      // Close any open dropdowns when marking a task complete/incomplete
      setShowOptions({});
      setShowDatePicker(null);
    } catch (error) {
      console.error("Error toggling task completion:", error);
      alertify.error("Error updating task status");
    }
  };

  useEffect(() => {
    localStorage.setItem("Clickes", JSON.stringify(ClickState));
  }, [ClickState]);

  const DeleteAlert = (id) => {
    const task = TaskObj.find(item => item.id === id);
    if (!task) return;
    
    alertify.confirm(
      "Delete Task",
      `Are you sure you want to delete this task: "${task.name}"?`,
      function () {
        DeleteTask(id);
        alertify.success("Task deleted successfully");
      },
      function () {
        alertify.error("Operation canceled");
      }
    ).set({
      'labels': {ok: 'Yes, Delete It', cancel: 'Cancel'},
      'defaultFocus': 'cancel'
    });
  };

  const toggleOptions = (id, e) => {
    if (e) e.stopPropagation();
    
    // Close all other open options
    const newOptions = {};
    if (!showOptions[id]) {
      newOptions[id] = true;
    }
    setShowOptions(newOptions);
    
    // Close date picker if opening options
    if (id.includes('_priority') || id.includes('_category')) {
      setShowDatePicker(null);
    }
  };

  const toggleDatePicker = (id, e) => {
    if (e) e.stopPropagation();
    
    // Close if already open, open if closed
    setShowDatePicker(showDatePicker === id ? null : id);
    
    // Close all option dropdowns
    setShowOptions({});
  };

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Don't close if clicking inside a dropdown
      if (e.target.closest('.options-dropdown') || e.target.closest('.date-picker-dropdown')) {
        return;
      }
      
      // Don't close if clicking on a button that toggles a dropdown
      if (e.target.closest('.action-btn')) {
        return;
      }
      
      setShowOptions({});
      setShowDatePicker(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Stop propagation for dropdown clicks
  const handleDropdownClick = (e) => {
    e.stopPropagation();
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'var(--priority-high)';
      case 'normal': return 'var(--priority-normal)';
      case 'low': return 'var(--priority-low)';
      default: return 'var(--priority-normal)';
    }
  };

  // Get category icon and label
  const getCategoryInfo = (category) => {
    switch(category) {
      case 'work': return { icon: '💼', label: 'Work' };
      case 'personal': return { icon: '👤', label: 'Personal' };
      case 'shopping': return { icon: '🛒', label: 'Shopping' };
      case 'health': return { icon: '💪', label: 'Health' };
      default: return { icon: '📝', label: 'General' };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for comparison
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if date is today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    // Check if date is tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    // Otherwise format as MM/DD/YYYY
    return date.toLocaleDateString();
  };

  // Format date for input value
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return ''; // Invalid date
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return '';
    }
  };

  // Check if task is due soon (within 2 days)
  const isDueSoon = (dateString) => {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for comparison
    
    const twoDaysFromNow = new Date(today);
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    
    return date <= twoDaysFromNow && date >= today;
  };

  // Check if task is overdue
  const isOverdue = (dateString) => {
    if (!dateString) return false;
    
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part for comparison
    
    return date < today;
  };

  // Handle date selection
  const handleDateSelect = (id, dateString) => {
    try {
      const date = dateString ? new Date(dateString) : null;
      if (date && isNaN(date.getTime())) {
        alertify.error("Invalid date format");
        return;
      }
      setTaskDueDate(id, date ? date.toISOString() : null);
      setShowDatePicker(null);
    } catch (error) {
      console.error("Error setting date:", error);
      alertify.error("Error setting date");
    }
  };

  // Handle edit button click
  const handleEditClick = (e, task) => {
    e.stopPropagation();
    
    // Close any open dropdowns
    setShowOptions({});
    setShowDatePicker(null);
    
    // Call the parent edit function
    EditTask(task.id);
  };

  // Handle edit modal close
  const handleEditModalClose = () => {
    setShowEditModal(false);
    setEditingTaskId(null);
    setEditingTask(null);
  };

  // Handle save in edit modal
  const handleEditModalSave = (task) => {
    try {
      // Update the task name in the parent component
      if (task.name.trim() === "") {
        alertify.error("Task name cannot be empty");
        return;
      }
      
      // Update task in the parent component
      const updatedTask = {
        ...task,
        name: task.name.trim()
      };
      
      // Update task name by calling EditTask
      EditTask(task.id);
      
      // Update task priority
      updateTaskPriority(task.id, task.priority || 'normal');
      
      // Update task category
      updateTaskCategory(task.id, task.category || 'general');
      
      // Update task due date
      setTaskDueDate(task.id, task.dueDate);
      
      // Close the modal
      handleEditModalClose();
      
      // Show success message
      alertify.success("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      alertify.error("Error updating task");
    }
  };

  return (
    <div className="task-list">
      {TaskObj.length ? (
        TaskObj.map((task) => (
          <div
            key={task.id}
            className={`task-item ${ClickState[task.id] ? 'completed' : ''} ${darkMode ? 'dark' : ''}`}
            style={{
              borderLeftColor: getPriorityColor(task.priority || 'normal')
            }}
          >
            <div className="task-content">
              <div className="task-checkbox">
                <input
                  type="checkbox"
                  checked={ClickState[task.id] || false}
                  onChange={() => HandleClickItem(task)}
                  id={`task-${task.id}`}
                />
                <label htmlFor={`task-${task.id}`} className="checkbox-label"></label>
              </div>
              
              <div className="task-details">
                <div className="task-name">{task.name}</div>
                
                <div className="task-meta">
                  <span className="task-category">
                    {getCategoryInfo(task.category || 'general').icon} {getCategoryInfo(task.category || 'general').label}
                  </span>
                  
                  {task.dueDate && (
                    <span className={`task-due-date ${isDueSoon(task.dueDate) ? 'due-soon' : ''} ${isOverdue(task.dueDate) ? 'overdue' : ''}`}>
                      <FaCalendarAlt /> {formatDate(task.dueDate)}
                    </span>
                  )}
                  
                  <span className="task-priority" style={{ color: getPriorityColor(task.priority || 'normal') }}>
                    <FaFlag /> {task.priority || 'normal'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="task-actions">
              {/* Due Date Button */}
              <button 
                className="action-btn date-btn"
                onClick={(e) => toggleDatePicker(task.id, e)}
                title="Set due date"
              >
                <FaCalendarAlt />
                <span className="action-label">Date</span>
              </button>
              
              {/* Category Button */}
              <button 
                className="action-btn category-btn"
                onClick={(e) => toggleOptions(task.id + '_category', e)}
                title="Set category"
              >
                <FaTag />
                <span className="action-label">Category</span>
              </button>
              
              {/* Priority Button */}
              <button 
                className="action-btn priority-btn"
                style={{ color: getPriorityColor(task.priority || 'normal') }}
                onClick={(e) => toggleOptions(task.id + '_priority', e)}
                title="Set priority"
              >
                <FaFlag />
                <span className="action-label">Priority</span>
              </button>
              
              {/* Edit Button */}
              <button 
                className="action-btn edit-btn"
                onClick={(e) => handleEditClick(e, task)}
                title="Edit task"
              >
                <FaEdit />
                <span className="action-label">Edit</span>
              </button>
              
              {/* Delete Button */}
              <button 
                className="action-btn delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  DeleteAlert(task.id);
                }}
                title="Delete task"
              >
                <FaTrashAlt />
                <span className="action-label">Delete</span>
              </button>
              
              {/* Priority Options Dropdown */}
              {showOptions[task.id + '_priority'] && (
                <div className="options-dropdown priority-options" onClick={handleDropdownClick}>
                  <div className="dropdown-header">Select Priority</div>
                  <div 
                    className="dropdown-item" 
                    onClick={() => { 
                      updateTaskPriority(task.id, 'high'); 
                      toggleOptions(task.id + '_priority'); 
                    }}
                  >
                    <FaFlag style={{ color: 'var(--priority-high)' }} /> High Priority
                  </div>
                  <div 
                    className="dropdown-item" 
                    onClick={() => { 
                      updateTaskPriority(task.id, 'normal'); 
                      toggleOptions(task.id + '_priority'); 
                    }}
                  >
                    <FaFlag style={{ color: 'var(--priority-normal)' }} /> Normal Priority
                  </div>
                  <div 
                    className="dropdown-item" 
                    onClick={() => { 
                      updateTaskPriority(task.id, 'low'); 
                      toggleOptions(task.id + '_priority'); 
                    }}
                  >
                    <FaFlag style={{ color: 'var(--priority-low)' }} /> Low Priority
                  </div>
                </div>
              )}
              
              {/* Category Options Dropdown */}
              {showOptions[task.id + '_category'] && (
                <div className="options-dropdown category-options" onClick={handleDropdownClick}>
                  <div className="dropdown-header">Select Category</div>
                  <div 
                    className="dropdown-item" 
                    onClick={() => { 
                      updateTaskCategory(task.id, 'general'); 
                      toggleOptions(task.id + '_category'); 
                    }}
                  >
                    📝 General
                  </div>
                  <div 
                    className="dropdown-item" 
                    onClick={() => { 
                      updateTaskCategory(task.id, 'work'); 
                      toggleOptions(task.id + '_category'); 
                    }}
                  >
                    💼 Work
                  </div>
                  <div 
                    className="dropdown-item" 
                    onClick={() => { 
                      updateTaskCategory(task.id, 'personal'); 
                      toggleOptions(task.id + '_category'); 
                    }}
                  >
                    👤 Personal
                  </div>
                  <div 
                    className="dropdown-item" 
                    onClick={() => { 
                      updateTaskCategory(task.id, 'shopping'); 
                      toggleOptions(task.id + '_category'); 
                    }}
                  >
                    🛒 Shopping
                  </div>
                  <div 
                    className="dropdown-item" 
                    onClick={() => { 
                      updateTaskCategory(task.id, 'health'); 
                      toggleOptions(task.id + '_category'); 
                    }}
                  >
                    💪 Health
                  </div>
                </div>
              )}
              
              {/* Date Picker Dropdown */}
              {showDatePicker === task.id && (
                <div className="date-picker-dropdown" onClick={handleDropdownClick}>
                  <div className="dropdown-header">Set Due Date</div>
                  <input 
                    type="date" 
                    value={task.dueDate ? formatDateForInput(task.dueDate) : ''}
                    onChange={(e) => handleDateSelect(task.id, e.target.value)}
                  />
                  <div className="date-picker-actions">
                    <button 
                      className="date-action clear" 
                      onClick={() => handleDateSelect(task.id, null)}
                    >
                      Clear
                    </button>
                    <button 
                      className="date-action today" 
                      onClick={() => handleDateSelect(task.id, new Date().toISOString())}
                    >
                      Today
                    </button>
                    <button 
                      className="date-action tomorrow" 
                      onClick={() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        handleDateSelect(task.id, tomorrow.toISOString());
                      }}
                    >
                      Tomorrow
                    </button>
                  </div>
                </div>
              )}
              
              {/* Edit Modal */}
              {showEditModal && editingTaskId === task.id && (
                <div className="edit-modal-overlay" onClick={handleEditModalClose}>
                  <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
                    <h3 className="edit-modal-title">Edit Task</h3>
                    
                    <div className="edit-modal-content">
                      <div className="edit-modal-field">
                        <label>Task Name</label>
                        <input 
                          type="text" 
                          value={editingTask.name}
                          onChange={(e) => setEditingTask({...editingTask, name: e.target.value})}
                          className="edit-modal-input"
                        />
                      </div>
                      
                      <div className="edit-modal-field">
                        <label>Priority</label>
                        <div className="edit-modal-options">
                          <button 
                            className={`priority-option ${editingTask.priority === 'high' ? 'active' : ''}`}
                            onClick={() => setEditingTask({...editingTask, priority: 'high'})}
                            style={{ backgroundColor: 'var(--priority-high)' }}
                          >
                            High
                          </button>
                          <button 
                            className={`priority-option ${editingTask.priority === 'normal' ? 'active' : ''}`}
                            onClick={() => setEditingTask({...editingTask, priority: 'normal'})}
                            style={{ backgroundColor: 'var(--priority-normal)' }}
                          >
                            Normal
                          </button>
                          <button 
                            className={`priority-option ${editingTask.priority === 'low' ? 'active' : ''}`}
                            onClick={() => setEditingTask({...editingTask, priority: 'low'})}
                            style={{ backgroundColor: 'var(--priority-low)' }}
                          >
                            Low
                          </button>
                        </div>
                      </div>
                      
                      <div className="edit-modal-field">
                        <label>Category</label>
                        <select 
                          className="edit-modal-select"
                          value={editingTask.category || 'general'}
                          onChange={(e) => setEditingTask({...editingTask, category: e.target.value})}
                        >
                          <option value="general">General</option>
                          <option value="work">Work</option>
                          <option value="personal">Personal</option>
                          <option value="shopping">Shopping</option>
                          <option value="health">Health</option>
                        </select>
                      </div>
                      
                      <div className="edit-modal-field">
                        <label>Due Date</label>
                        <input 
                          type="date" 
                          className="edit-modal-date"
                          value={editingTask.dueDate ? formatDateForInput(editingTask.dueDate) : ''}
                          onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value ? new Date(e.target.value).toISOString() : null})}
                        />
                      </div>
                    </div>
                    
                    <div className="edit-modal-actions">
                      <button 
                        className="edit-modal-cancel"
                        onClick={handleEditModalClose}
                      >
                        Cancel
                      </button>
                      <button 
                        className="edit-modal-save"
                        onClick={() => handleEditModalSave(editingTask)}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="empty-state">
          <FaStar className="empty-icon" />
          <h3>No tasks found</h3>
          <p>Add a new task or adjust your filters to see tasks</p>
        </div>
      )}
    </div>
  );
};

export default TaskUi;
