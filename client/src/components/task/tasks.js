import axios from "axios";
import React, { useEffect, useState } from "react";
import Taskform from "./taskform";
import TaskList from "./Tasklist";


function Tasks() {
  const [tasks, setTasks] = useState([]);

  async function gettasks() {
    const tasksRes = await axios.get("https://kushal2secondtodoapp.herokuapp.com/task/");
    //const tasksRes = await axios.get("https://mern-auth-template-tutorial.herokuapp.com/customer/" );
    setTasks(tasksRes.data);
  }

  useEffect(() => {
    gettasks();
  }, []);

  return (
    <div>
      <Taskform gettasks={gettasks} />
      <TaskList tasks={tasks}/>
    </div>
  );
}

export default Tasks;