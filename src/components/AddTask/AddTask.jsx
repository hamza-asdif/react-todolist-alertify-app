/* eslint-disable react/prop-types */
import TaskUi from "./TaskUi";
import "./addtask.css";

const AddTask = (props) => {
  const {
    TaskObj,
    HandleClick,
    DeleteTask,
    EditTask,
    RefInputFunction,
    ButtonRefFunction,
    ClickToEdit,
    setClickToEdit,
    updateTaskPriority,
    updateTaskCategory,
    setTaskDueDate,
    darkMode,
    customCategories,
    addCustomCategory
  } = props;
  
  return ( 
    <div className="tasks-container">
      <TaskUi 
        TaskObj={TaskObj}
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
        customCategories={customCategories}
        addCustomCategory={addCustomCategory}
      />
    </div>
  );
};

export default AddTask;
