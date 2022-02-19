const router = require("express").Router();
const task = require("../models/task.js");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const type = req.body.type;
    const info = req.body.info;
    const iscompleted = req.body.iscompleted;

    const newtask = new task({
      user:req.user,type:type,info:info,iscompleted:iscompleted
    });

    const savedtask = await newtask.save();

    res.json(savedtask);
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
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  });

router.get("/", auth, async (req, res) => {
  try {
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
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  });

module.exports = router;