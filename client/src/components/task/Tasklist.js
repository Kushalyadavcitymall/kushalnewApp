import React from "react";

function TaskList({ tasks }) {
  function renderTasks() {
    return tasks.map((task, i) => {
      return <li key={i}>{task.type } &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{task.info} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{task.iscompleted} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{task.assignedto} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{task.due_date}</li>;
    });
  }

  return (
    <div>
      <ul>{renderTasks()}</ul>
    </div>
  );
}

export default TaskList;