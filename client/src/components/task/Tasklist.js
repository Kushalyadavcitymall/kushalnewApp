import React from "react";

function TaskList({ tasks }) {
  function renderTasks() {
    return tasks.map((task, i) => {
      return <li key={i}>{task.type } &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{task.info} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{task.iscompleted} </li>;
    });
  }

  return (
    <div>
      <ul>{renderTasks()}</ul>
    </div>
  );
}

export default TaskList;