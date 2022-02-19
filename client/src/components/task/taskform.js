import axios from "axios";
import React, { useState } from "react";

function Taskform({ gettasks }) {
  const [type,settype] = useState("");
  const [info,setinfo]= useState("");
  const [iscompleted,setiscompleted]= useState("");

  async function savetask(e) {
    e.preventDefault();

    try {
      const taskData = {
        type:type,info:info,iscompleted:iscompleted
      };
       await axios.post("https://kushal2secondtodoapp.herokuapp.com/task/", taskData);
     // await axios.post("https://mern-auth-template-tutorial.herokuapp.com/customer/",customerData);
      gettasks();
    } catch (err) {
      console.error(err);
    }
  }
  async function deletealltask(e) {
    e.preventDefault();

    try {
       await axios.delete("https://kushal2secondtodoapp.herokuapp.com/task/");
     // await axios.post("https://mern-auth-template-tutorial.herokuapp.com/customer/",customerData);
      gettasks();
    } catch (err) {
      console.error(err);
    }
  }
  async function markalltask(e) {
    e.preventDefault();

    try {
        const taskData = {
            iscompleted:"Completed"
          };
       await axios.put("https://kushal2secondtodoapp.herokuapp.com/task/",taskData);
     // await axios.post("https://mern-auth-template-tutorial.herokuapp.com/customer/",customerData);
      gettasks();
    } catch (err) {
      console.error(err);
    }
  }


  return (
    <div>
      <form onSubmit={savetask}>
        <input
          type="text"
          placeholder="Type of task"
          onChange={(e) => {
            settype(e.target.value);
          }}
          value={type}
        />
        <input
          type="text"
          placeholder="Information of task"
          onChange={(e) => {
            setinfo(e.target.value);
          }}
          value={info}
        />
        <input
          type="text"
          placeholder="Is Completed"
          onChange={(e) => {
            setiscompleted(e.target.value);
          }}
          value={iscompleted}
        />

        <button type="submit">Save new task</button>
      </form>
      <form onSubmit={deletealltask}>
          <button type="submit"> Delete All Tasks</button>
      </form>
      <form onSubmit={markalltask}>
          <button type="submit"> Mark All Tasks as completed</button>
      </form>
    </div>
  );
}

export default Taskform;