const router = require("express").Router();
const task = require("../models/task.js");
const auth = require("../middleware/auth");

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const redis = require('redis');

const client = redis.createClient();
const { Kafka } = require("kafkajs")

// the client ID lets kafka know who's producing the messages
const clientId = "myapp"
// we can define the list of brokers in the cluster
const brokers = ["localhost:9093"]
// this is the topic to which we want to write messages
const topic = "tasks"
// initialize a new kafka client and initialize a producer from it
const kafka = new Kafka({ brokers })
const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: clientId })

const consume = async () => {
	// first, we wait for the client to connect and subscribe to the given topic
	await consumer.connect()
	await consumer.subscribe({ topic })
	await consumer.run({
		// this function is called every time the consumer gets a new message
		eachMessage: async({ message }) => {
			// here, we just log the message to the standard output
			console.log(`received message: ${message.value}`)
      console.log(JSON.parse(message.value))
      const task1=JSON.parse(message.value);
      const newtask = new task({
        user:task1.user,type:task1.type,info:task1.info,iscompleted:task1.iscompleted,assignedto:task1.assignedto,due_date:task1.due_date
      });
      const savedtask = await newtask.save();
      const tasks = await task.find({user:task1.user});
      await client.setEx(task1.user,3600*24,JSON.stringify(tasks));
		}
	})
} 

var connection =async () => {
    await client.connect();
    await producer.connect();
    await consume();
    console.log("connected Kafka")
};
connection();

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
    await producer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(newtask)
        },
      ],
    })
    //const savedtask = await newtask.save();

    res.json("ok");
    //const tasks = await task.find({user:req.user});
    //client.setEx(req.user,3600*24,JSON.stringify(tasks));
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