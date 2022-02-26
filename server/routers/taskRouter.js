const router = require("express").Router();
const task = require("../models/task.js");
const auth = require("../middleware/auth");

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const redis = require('redis');

const client = redis.createClient();

   
(async () => {
    await client.connect();
})();

router.post("/", auth, async (req, res) => {
  try {
    const type = req.body.type;
    const info = req.body.info;
    var date=req.body.due_date;
    const assignedto=req.body.assignedto;
    const iscompleted = req.body.iscompleted;
    var today = new Date();
    var dat = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      date=new Date(date)
      dat=new Date(dat)
      if(date.getTime()<dat.getTime()){
        res.status(500).send("Please Select future time");
      return
      }
    if(iscompleted != "Completed" && iscompleted!="Not Completed"){
      res.status(500).send("Not in Proper Form");
      return
    }
    
    const newtask = new task({
      user:req.user,type:type,info:info,iscompleted:iscompleted,assignedto:assignedto,due_date:date
    });

    const savedtask = await newtask.save();

    res.json(savedtask);
    const tasks = await task.find({user:req.user});
    client.setEx(req.user,3600*24,JSON.stringify(tasks));
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});
router.put("/", auth, async (req, res) => {
    try {
      const filter={user:req.user}
      const savedtask = await task.updateMany(filter,{iscompleted:req.body.iscompleted});
  
      res.json(savedtask);
      const tasks = await task.find({user:req.user});
      client.setEx(req.user,3600*24,JSON.stringify(tasks));
    } catch (err) { 

      console.error(err);
      res.status(500).send();
    }
  });

router.get("/", auth, async (req, res) => {
  try {
    client.get(req.user, (err, data) => {
      if (err) throw err;
  
      if (data !== null) {
        res.json(JSON.parse(tasks));
        return
      } else {
        next();
      }
    });
    const tasks = await task.find({user:req.user});
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.delete("/", auth, async (req, res) => {
    try {
      const tasks = await task.deleteMany({user:req.user});
      res.json(tasks);
      client.del(tasks);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  });

module.exports = router;