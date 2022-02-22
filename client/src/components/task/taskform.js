import axios from "axios";
import React, { useState } from "react";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

toast.configure();
function Taskform({ gettasks }) {
  const [type,settype] = useState("");
  const [info,setinfo]= useState("");
  const [iscompleted,setiscompleted]= useState("");
  const [assignto,setassignto]=useState("");
  var today = new Date();
  var dat = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var [date,setdate]=useState(dat);

  async function savetask(e) {
    e.preventDefault();

    try {
      const taskData = {
        type:type,info:info,iscompleted:iscompleted,assignedto:assignto,due_date:date
      };
      date=new Date(date)
      dat=new Date(dat)
      if(date.getTime()<dat.getTime()){
        toast("Please Select Future Date")
      }
      if(iscompleted!="Completed" &&iscompleted!="Not Completed"){
        toast("Please put either Completed or Not Completed in 'Is Completed' column");
      }
       await axios.post("http://localhost:5000/task/", taskData);
     // await axios.post("https://mern-auth-template-tutorial.herokuapp.com/customer/",customerData);
      gettasks();
    } catch (err) {
      console.error(err);
    }
  }
  async function deletealltask(e) {
    e.preventDefault();

    try {
       await axios.delete("http://localhost:5000/task/");
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
       await axios.put("http://localhost:5000/task/",taskData);
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
        <input
          type="text"
          placeholder="Assign to"
          onChange={(e) => {
            setassignto(e.target.value);
          }}
          value={assignto}
        />
        <input
          type="Date"
          placeholder="Date"
          onChange={(e) => {
            setdate(e.target.value);
          }}
          value={date}
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