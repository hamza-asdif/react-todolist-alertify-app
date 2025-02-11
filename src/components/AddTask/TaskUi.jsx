/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { AiTwotoneDelete } from "react-icons/ai";

// ----------Alerts Import --------------//
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.min.css";

import "./addtask.css";

const TaskUi = (props) => {
  let {
    TaskObj,
    HandleClick,
    DeleteTask,
    EditTask,
    RefInputFunction,
  } = props;

  // *** State Declarations ----------------------
  const [ClickState, setClickState] = useState(
    JSON.parse(localStorage.getItem("Clickes")) || {}
  );

  const HandleClickItem = (item) => {
    setClickState((Prev) => ({
      ...Prev,
      [item.id]: !Prev[item.id],
    }));

    HandleClick(item.id);
  };

  useEffect(() => {
    localStorage.setItem("Clickes", JSON.stringify(ClickState));
  }, [ClickState]);

  const DeleteAlert = (id) => {

    alertify.confirm(
      "Alert - Delete",
      "Do You Want To Delete This Task ? ",
      function () {
        alertify.success("Deleted Successfully ✅");
        DeleteTask(id)
      },
      function () {
        alertify.error("Cancel");
      }
    );
  };

  return (
    <>
      {TaskObj.length ? (
        TaskObj.map((SingleTask) => (
          <li
            key={SingleTask.id}
            className="li-container"
            style={{
              textDecoration: ClickState[SingleTask.id] ? "line-through" : null,
            }}
          >
            <div className="task-text-container">
              <input
                type="checkbox"
                name="checkboxname"
                id="checkbox"
                onChange={() => HandleClickItem(SingleTask)}
                checked={ClickState[SingleTask.id]}
              />
              <span className="task-title" id="checkboxname">
                {SingleTask.name}
              </span>
            </div>
            <div className="icons-container">
              <AiTwotoneDelete
                className="edit-icon"
                id="delete"
                onClick={() => {
                  DeleteAlert(SingleTask.id);
                }}
              />
              <FaEdit
                className="edit-icon"
                onClick={() => {
                  EditTask(SingleTask.id);
                  setTimeout(() => RefInputFunction(), 400);
                }}
              />
            </div>
          </li>
        ))
      ) : (
        <div style={{ textAlign: "center" }}>
          <h3>You need to Enter A Task, There&apos;s no one</h3>
        </div>
      )}
    </>
  );
};

export default TaskUi;
