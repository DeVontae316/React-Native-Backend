const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const Description = require("./models/testForm");
const userRoutes = require("./routers/user");
const taskRoutes = require("./routers/task");
const pickupRoutes = require("./routers/pickup");
const pickupDescritptionRoutes = require("./routers/pickupdescription");

require("./db/mongoose");


app.use(express.json());//parses json to an object to be accesible via req.body
app.use(userRoutes);
app.use(taskRoutes);
app.use(pickupRoutes);
app.use(pickupDescritptionRoutes);
app.post("/testform", async (req, res) => {
    try {
        const description = await new Description(req.body).save()
        if (description) {
            return res.status(200).send(description);
        }
        res.status(404).send({ error: "Oooopss...." })
    } catch (error) {
        res.status(400).send({ error: "Monkeys did it..." });
    }
})
app.patch("/testform/:id", async (req, res) => {

    const update = await Description.updateOne({ _id: req.params.id }, { description: req.body.description });
    const updated = await Description.findById(req.params.id);
    console.log(updated)

    res.send(updated);
})
app.get("/testform", async (req, res) => {
    const all = await Description.find({});
    console.log(all)
    res.send(all);
})
app.delete("/testform/:id", async (req, res) => {
    try {
        let response = await Description.deleteOne({ _id: req.params.id });
        console.log(response.deletedCount)
        if (response.deletedCount === 1) {
            return res.status(202).send({ success: "item deleted" });
        } else {
            return res.status(404).send("Monkeys didn't delete item")
        }
    } catch (error) {
        return res.status(400).send({ error: "Oooopss..." })
    }


})


const x = {
    name: "Bob",
}

const { name } = x;
console.log(JSON.stringify({ name }));
/*var x = () => {
    var a = [];

    for (var i = 0; i < 5; i++) {
        a.push((function (i) {
            return function () {
                return console.log(i);
            }
        })(i))
    }
    return a;
}

const hold = x();
hold[0]();*/

app.listen(port, () => {
    console.log(`Server running on port:${port} `);
});

