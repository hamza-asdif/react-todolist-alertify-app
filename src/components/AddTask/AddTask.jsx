/* eslint-disable react/prop-types */


import TaskUi from "./TaskUi";

import "./addtask.css";

const AddTask = (props) => {
  let {TaskObj, HandleClick, DeleteTask, EditTask, RefInputFunction, ClickToEdit} = props
  return ( 
    <div className="Main-task-section">
      <TaskUi 
      TaskObj={TaskObj}
      HandleClick={HandleClick}
      DeleteTask={DeleteTask}
      EditTask={EditTask}
      RefInputFunction={RefInputFunction}
      ClickToEdit={ClickToEdit}
      
      />
    </div>
  );
};

export default AddTask;
