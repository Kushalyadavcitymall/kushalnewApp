const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  user:{type: String, required: true},
  due_date:{type:Date,require:true},
  type: { type: String, required: true },
  info:{ type: String, required: true },
  assignedto:{ type: String, required: true },
  iscompleted: {type: String, required: true }
});

const task = mongoose.model("task", taskSchema);

module.exports = task;