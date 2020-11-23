const express = require("express");
const Task = require("../models/task");
const router = express.Router();
const auth = require("../middleware/auth");


router.get("/tasks/alltask", async (req, res) => {
    try {
        const tasks = await Task.find({});
        if (!tasks) {
            return res.status(404).send({ error: "Unable to process request" });
        }

        res.send(tasks);

    } catch (error) {
        return res.status(500).send({ error });
    }
})

/*
task?sortBy=createdAt:desc
/task?limit=3&skip3
*/
router.get("/tasks", auth, async (req, res) => {
    const Match = {};
    //const Sort = {};
    const sort = {}




    try {
        if (req.query.completed) {
            Match.completed = req.query.completed === "true" ? true : false
        }
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(":");
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        await req.user.populate({
            path: "tasks",
            limit: parseInt(req.query.limit),
            skip: parseInt(req.query.skip),
            match: Match,
            options: {
                sort
            }
        }).execPopulate()

        res.send(req.user.tasks)
    }
    catch (error) {
        res.status(505).send({ error });
    }
})
//task?sortBy=createdAt:desc&limit=5&skip=1


router.get("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, owner: req.user._id });
        if (!task) {
            return res.status(404).send({ error: "task not found" });
        }
        res.status(202).send(task)
    } catch (error) {
        res.status(500).send({ error: "Couldn't process request for task!" })
    }

});
router.patch("/tasks/:id", auth, async (req, res) => {
    const keys = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const check = keys.every(update => allowedUpdates.includes(update));

    if (!check) {
        return res.send({ error: "Can't update those fields :(" });
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send({ error: "Task wasn't found" });
        }

        keys.forEach(updates => task[updates] = req.body[updates]);
        await task.save();
        res.send(task);

    } catch (error) {
        return res.status(500).send({ error: "Monkeys have your task" });
    }
})


/*router.patch("/tasks/:id", async (req, res) => {
    const keys = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const check = keys.every(update => allowedUpdates.includes(update));

    if (!check) {
        return res.send({ error: "Can't update those fields :(" });
    }
    try {
        const task = await Task.findById(req.params.id);

        keys.forEach(updates => task[updates] = reqy.body[updates]);
        await task.save();

        if (!task) {
            return res.status(404).send({ error: "Task wasn't found" });
        }
        res.send(task);
    } catch (error) {
        return res.status(500).send({ error: "Monkeys have your task" });
    }
})*/

router.post("/tasks", auth, async (req, res) => {
    try {
        const task = await new Task({
            ...req.body,
            owner: req.user._id
        }).save()



        res.status(200).send(task)
        console.log(req.user._id);
    }
    catch (error) {
        res.status(500).send({ error });
    }

});


router.delete("/tasks/:id", auth, async (req, res) => {
    try {

        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        if (!task) {
            return res.send({ error: "Something went wrong with count" })
        }

        res.status(202).send(task);
    } catch (error) {
        res.status(500).send({ error: "Monkeys did it..." })
    }
})

/*
router.delete("/tasks/:id", async (req, res) => {
    try {
        //const task = await Task.findByIdAndRemove(req.params.id);
        const task = await Task.findByIdAndRemove(req.params.id);

        if (!task) {
            return res.send({ error: "Something went wrong with count" })
        }
        //res.status(202).send(task);
        res.status(202).send(task);
    } catch (error) {
        res.status(500).send({ error: "Monkeys did it..." })
    }
})*/



module.exports = router;