/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { forwardRef } from "react";
import "./Form.css";

// ---- Import alerts ------//
import alertify from "alertifyjs";
import "alertifyjs/build/css/alertify.min.css";

const Form = forwardRef((props, ref) => {
  const {
    HandleInput,
    HandleSubmit,
    TaskName,
    ButtonRefFunction,
    ClickToEdit,
  } = props;

  const SaveEditsAlert = (Func) => {
    alertify.confirm(
      "Change Confirmation",
      "Are you sure you want to Change Task ?",
      function () {
        Func();
        alertify.success("Changed Successfully ✅");
      },
      function () {
        alertify.error("Canceled❌");
      }
    );
  };

  return (
    <form action="" onSubmit={(e) => e.preventDefault()}>
      <input
        type="text"
        className="input-text"
        placeholder="Enter Task...."
        value={TaskName}
        onChange={HandleInput}
        ref={ref}
      />
      <input
        type="submit"
        className="form-submit"
        value={ClickToEdit ? "Save Task" : "Add Task"}
        onClick={(e) => {
          e.preventDefault();
          ref.current.value !== "" ? (
            ClickToEdit ? SaveEditsAlert(ButtonRefFunction) : HandleSubmit()
          ) : alert("Pls Enter Text First")
        }}
      />
    </form>
  );
});

export default Form;
