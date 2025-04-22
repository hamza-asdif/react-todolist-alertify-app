/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import "./App.css";
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.min.css";

// Import components
import HeaderTitle from "./components/HeaderTitle/HeaderTitle";
import Form from "./components/Form/Form";
import AddTask from "./components/AddTask/AddTask";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";

// Import context
import { AppContext } from "./context/AppContext";

function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true" || false
  );

  // Task states
  const [TaskObj, setTaskObj] = useState(
    JSON.parse(localStorage.getItem("TaskState")) || []
  );
  const [TaskName, setTaskName] = useState("");
  const [NewEditTask, setNewEditTask] = useState({});
  const [ClickToEdit, setClickToEdit] = useState(false);
  
  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, active, completed
  const [filterCategory, setFilterCategory] = useState("all"); // all, work, personal, etc.
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, alphabetical
  
  // Statistics
  const totalTasks = TaskObj.length;
  const completedTasks = TaskObj.filter(task => task.isClicked).length;
  const activeTasks = totalTasks - completedTasks;

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    
    // Apply dark mode to document
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  // Apply dark mode on initial load
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);

  // FORM INPUT FUNCTION
  const HandleInput = (e) => {
    setTaskName(e.target.value);
  };

  // FORM SUBMIT FUNCTION
  const HandleSubmit = (e) => {
    e.preventDefault();
    if (TaskName.trim() !== "") {
      const newTask = {
        name: TaskName.trim(),
        id: Date.now(),
        isClicked: false,
        createdAt: new Date().toISOString(),
        priority: "normal", // low, normal, high
        category: "general", // general, work, personal, etc.
        dueDate: null
      };
      
      setTaskObj(prevTasks => [newTask, ...prevTasks]);
      alertify.success("Task added successfully!");
      setTaskName("");
    } else {
      alertify.error("Please enter a task first");
    }
  };

  // HANDLE CLICK FUNCTION (Toggle completion)
  const HandleClick = (id) => {
    const updatedTasks = TaskObj.map((task) =>
      task.id === id ? { ...task, isClicked: !task.isClicked } : task
    );
    setTaskObj(updatedTasks);
  };

  // SET LOCAL STORAGE FUNCTION
  const setLocalStorage = () => {
    localStorage.setItem("TaskState", JSON.stringify(TaskObj));
  };

  // Save to localStorage whenever tasks change
  useEffect(() => {
    setLocalStorage();
  }, [TaskObj]);

  // DELETE TASK FUNCTION
  const DeleteTask = (id) => {
    const updatedTasks = TaskObj.filter((item) => item.id !== id);
    setTaskObj(updatedTasks);
  };

  // EDIT TASK FUNCTION
  const EditTask = (id) => {
    const task = TaskObj.find((item) => item.id === id);
    setTaskName(task.name);
    setNewEditTask(task);
    setClickToEdit(true);
    
    // Scroll to the input field and focus it
    setTimeout(() => {
      if (InputRef.current) {
        InputRef.current.focus();
        // Scroll to the input field
        InputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // UPDATE TASK PRIORITY
  const updateTaskPriority = (id, priority) => {
    const updatedTasks = TaskObj.map((task) =>
      task.id === id ? { ...task, priority } : task
    );
    setTaskObj(updatedTasks);
    alertify.success(`Priority set to ${priority}`);
  };

  // UPDATE TASK CATEGORY
  const updateTaskCategory = (id, category) => {
    const updatedTasks = TaskObj.map((task) =>
      task.id === id ? { ...task, category } : task
    );
    setTaskObj(updatedTasks);
    alertify.success(`Category set to ${category}`);
  };

  // SET DUE DATE
  const setTaskDueDate = (id, dueDate) => {
    const updatedTasks = TaskObj.map((task) =>
      task.id === id ? { ...task, dueDate } : task
    );
    setTaskObj(updatedTasks);
    alertify.success("Due date updated");
  };

  // SEARCH AND FILTER FUNCTIONS
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const handleCategoryFilter = (category) => {
    setFilterCategory(category);
  };

  const handleSortChange = (sortType) => {
    setSortBy(sortType);
  };

  // Apply filters, search, and sorting
  const filteredAndSortedTasks = TaskObj
    .filter(task => {
      // Apply search filter
      if (searchTerm && !task.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Apply status filter
      if (filterStatus === "active" && task.isClicked) return false;
      if (filterStatus === "completed" && !task.isClicked) return false;
      
      // Apply category filter
      if (filterCategory !== "all" && task.category !== filterCategory) return false;
      
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === "alphabetical") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "priority") {
        const priorityOrder = { high: 1, normal: 2, low: 3 };
        return priorityOrder[a.priority || 'normal'] - priorityOrder[b.priority || 'normal'];
      } else if (sortBy === "dueDate") {
        // Sort by due date (null values last)
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return 0;
    });

  // INPUT REF FUNCTIONS
  const InputRef = useRef();

  const ButtonRefFunction = (e) => {
    if (e) e.preventDefault();
    
    if (InputRef.current.value.trim() !== "") {
      const updatedTasks = TaskObj.map((item) =>
        item.id === NewEditTask.id ? 
        { 
          ...item, 
          name: InputRef.current.value.trim(),
          // Preserve other properties from the original task
          priority: item.priority,
          category: item.category,
          dueDate: item.dueDate,
          isClicked: item.isClicked
        } : item
      );
      setTaskObj(updatedTasks);
      setClickToEdit(false);
      setTaskName("");
      alertify.success("Task updated successfully!");
    } else {
      alertify.error("Task name cannot be empty");
    }
  };

  const RefInputFunction = () => {
    if (InputRef.current) {
      InputRef.current.select();
    }
  };

  // BULK ACTIONS
  const deleteCompletedTasks = () => {
    if (TaskObj.some(task => task.isClicked)) {
      alertify.confirm(
        "Delete Completed Tasks",
        "Are you sure you want to delete all completed tasks?",
        function () {
          const remainingTasks = TaskObj.filter(task => !task.isClicked);
          setTaskObj(remainingTasks);
          alertify.success("Completed tasks deleted successfully!");
        },
        function () {
          alertify.error("Operation canceled");
        }
      );
    } else {
      alertify.error("No completed tasks to delete");
    }
  };

  // Mark all as complete/incomplete
  const markAllAs = (status) => {
    if (TaskObj.length === 0) {
      alertify.error("No tasks to mark");
      return;
    }
    
    // If filtering is active, only mark visible tasks
    if (filterStatus !== "all" || filterCategory !== "all" || searchTerm) {
      alertify.confirm(
        `Mark ${status ? 'Complete' : 'Active'}`,
        `Do you want to mark only the filtered tasks as ${status ? 'completed' : 'active'}?`,
        function() {
          // Mark only filtered tasks
          const updatedTasks = TaskObj.map(task => {
            // Check if task is in the filtered list
            const isFiltered = filteredAndSortedTasks.some(t => t.id === task.id);
            return isFiltered ? { ...task, isClicked: status } : task;
          });
          setTaskObj(updatedTasks);
          alertify.success(`Filtered tasks marked as ${status ? 'completed' : 'active'}`);
        },
        function() {
          // Mark all tasks
          const updatedTasks = TaskObj.map(task => ({
            ...task,
            isClicked: status
          }));
          setTaskObj(updatedTasks);
          alertify.success(`All tasks marked as ${status ? 'completed' : 'active'}`);
        }
      ).set('labels', {ok:'Only Filtered Tasks', cancel:'All Tasks'});
    } else {
      // No filtering, mark all tasks
      const updatedTasks = TaskObj.map(task => ({
        ...task,
        isClicked: status
      }));
      setTaskObj(updatedTasks);
      alertify.success(`All tasks marked as ${status ? 'completed' : 'active'}`);
    }
  };

  // Context value
  const contextValue = {
    darkMode,
    toggleDarkMode,
    stats: {
      total: totalTasks,
      completed: completedTasks,
      active: activeTasks
    }
  };

  // Get current year for footer
  const currentYear = new Date().getFullYear();

  return (
    <AppContext.Provider value={contextValue}>
      <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
        <main className="main-app">
          <div className="main-app-section">
            <div className="app-header">
              <HeaderTitle />
              <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
            </div>
            
            <Form
              HandleInput={HandleInput}
              HandleSubmit={HandleSubmit}
              TaskObj={TaskObj}
              TaskName={TaskName}
              ref={InputRef}
              ButtonRefFunction={ButtonRefFunction}
              ClickToEdit={ClickToEdit}
              handleSearch={handleSearch}
              searchTerm={searchTerm}
              filterStatus={filterStatus}
              handleFilterChange={handleFilterChange}
              filterCategory={filterCategory}
              handleCategoryFilter={handleCategoryFilter}
              sortBy={sortBy}
              handleSortChange={handleSortChange}
              deleteCompletedTasks={deleteCompletedTasks}
              markAllAs={markAllAs}
              stats={contextValue.stats}
            />
            
            <AddTask
              TaskObj={filteredAndSortedTasks}
              HandleClick={HandleClick}
              DeleteTask={DeleteTask}
              EditTask={EditTask}
              RefInputFunction={RefInputFunction}
              ButtonRefFunction={ButtonRefFunction}
              ClickToEdit={ClickToEdit}
              setClickToEdit={setClickToEdit}
              updateTaskPriority={updateTaskPriority}
              updateTaskCategory={updateTaskCategory}
              setTaskDueDate={setTaskDueDate}
              darkMode={darkMode}
            />
          </div>
        </main>
        
        <footer className="app-footer">
          <p>TaskMaster Pro &copy; {currentYear} | Made with ❤️ | All rights reserved</p>
        </footer>
      </div>
    </AppContext.Provider>
  );
}

export default App;
