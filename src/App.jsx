/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import "./App.css";

import HeaderTitle from "./components/HeaderTitle/HeaderTitle";
import Form from "./components/Form/Form";
import AddTask from "./components/AddTask/AddTask";


function App() {
  // -----------------

  // !!! States Declaration
  const [TaskObj, setTaskObj] = useState(
    JSON.parse(localStorage.getItem("TaskState")) || []
  );
  const [TaskName, setTaskName] = useState("");
  const [NewEditTask, setNewEditTask] = useState({});
  const [ClickToEdit, setClickToEdit] = useState(false)

  // !!!! FORM INPUT FUNCTION
  const HandleInput = (e) => {
    setTaskName(e.target.value);
  };

  // !!!! FORM SUBMIT FUNCTION
  const HandleSubmit = () => {
    

    TaskName.trim() != ""
      ? setTaskObj((PrevItem) => [
          ...PrevItem,
          {
            name: TaskName.trim(),
            id: Date.now(),
            isClicked: false,
          }
        ])
      : alert("Pls Enter Task First");

    setTaskName("");
  };

  // !!!! HANDLE CLICK FUNCTION
  const HandleClick = (id) => {
    const updatedTasks = TaskObj.map((task) =>
      task.id === id ? { ...task, isClicked: !task.isClicked } : task
    );
    setTaskObj(updatedTasks);
    localStorage.setItem("TaskState", JSON.stringify(updatedTasks));
  };

  // !!!! SET LOCAL STORAGE FUNCTION
  const setLocalStorage = () => {
    localStorage.setItem("TaskState", JSON.stringify(TaskObj));
  };

  // ----- USEEFFECT ----------
  useEffect(() => {
    setLocalStorage();
  }, [TaskObj]);

  // !!!! DELETE TASK FUNCTION
  const DeleteTask = (id) => {
    let Tasks = TaskObj.filter((item) => item.id !== id);

    setTaskObj(Tasks);
  };

  // !!!! EDITE TASK FUNCTION
  const EditTask = (id) => {
    let Task = TaskObj.find((item) => item.id == id);

    setTaskName(Task.name);
    setNewEditTask(Task);
    setClickToEdit(true)
  };


  //???? ---- input ref -----
  const InputRef = useRef();

  const ButtonRefFunction = () => {
  if(InputRef.current.value !== "") {
    const updatedTasks = TaskObj.map((item) =>
      item.id === NewEditTask.id ? { ...item, name: InputRef.current.value } : item
    )
    setTaskObj(updatedTasks);
    setClickToEdit(false);
    setTaskName("");
  }
};

  const RefInputFunction = () => {
    InputRef.current.select();
  };

  return (
    <>
      <main className="main-app">
        <div className="main-app-section">
          <HeaderTitle />
          <Form
            HandleInput={HandleInput}
            HandleSubmit={HandleSubmit}
            TaskObj={TaskObj}
            TaskName={TaskName}
            ref={InputRef}
            ButtonRefFunction={ButtonRefFunction}
            ClickToEdit={ClickToEdit}
          />
          <AddTask
            TaskObj={TaskObj}
            HandleClick={HandleClick}
            DeleteTask={DeleteTask}
            EditTask={EditTask}
            RefInputFunction={RefInputFunction}
            ButtonRefFunction={ButtonRefFunction}
            ClickToEdit={ClickToEdit}
            setClickToEdit={setClickToEdit}
          />
        </div>
      </main>
    </>
  );
}

export default App;
