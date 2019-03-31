const express = require('express');
const router = express.Router();
const Factory = require("../models/factory.js");
const Server = require("../../app.js");
const sanitize = require('mongo-sanitize');



//Create A Factory
router.post('/factory', function (req, res) {
    console.log("Req body", req.body);
    if (req.body.factoryTitle === "" || req.body.factoryTitle === null) {
        res.json({ errMsg: "Factory Title Is Required" });
        return;
    }
    if (req.body.amount === "" || req.body.amount === null || req.body.amount < 0 || req.body.amount > 15) {
        res.json({ errMsg: "Generate Amount Is Invalid" });
        return;
    }

    if (req.body.childMax === "" || req.body.childMax === null) {
        res.json({ errMsg: "Max Is Required" });
        return;
    }
    if (req.body.childMin === "" || req.body.childMin === null) {
        res.json({ errMsg: "Min Is Required" });
        return;
    }
    if (req.body.childMin > req.body.childMax) {
        res.json({ errMsg: "There Min must be less than or equal to the Max" });
        return;
    }

    const childArr = createChildArr(req.body.amount, req.body.childMin, req.body.childMax);
    console.log("GOT CHILD ARR", childArr);
    const factoryObj = {
        factoryTitle: req.body.factoryTitle,
        children: childArr,
        max: req.body.childMax,
        min: req.body.childMin
    }
    console.log("factory object to save", factoryObj);

    var newFactory = new Factory(factoryObj);
    newFactory.save(function (err, factory) {
        if (err) {
            console.log('Error creating factory', err);
        } else {
            Server.sendFactoryInfo();
            res.json({ msg: "success" });
        }
    });

});

//Update A Factory
router.put('/factory/:id', function (req, res) {
    console.log("Req body", req.body);
    if (req.body.factoryTitle === "" || req.body.factoryTitle === null) {
        res.json({ errMsg: "Factory Title Is Required" });
        return;
    }
    if (req.body.amount === "" || req.body.amount === null || req.body.amount < 0 || req.body.amount > 15) {
        res.json({ errMsg: "Generate Amount Is Invalid" });
        return;
    }

    if (req.body.max === "" || req.body.max === null) {
        res.json({ errMsg: "Max Is Required" });
        return;
    }
    if (req.body.min === "" || req.body.min === null) {
        res.json({ errMsg: "Min Is Required" });
        return;
    }
    if (req.min > req.max) {
        res.json({ errMsg: "There Min must be less than or equal to the Max" });
        return;
    }
    let factoryObj;
    if (req.body.min) {
        const childArr = createChildArr(req.body.amount, req.body.min, req.body.max);
        factoryObj = {
            title: req.body.title,
            children: childArr,
            max: req.body.max,
            min: req.body.min
        }
    } else {
        factoryObj = {
            title: req.body.title,
        }
    }

    console.log("factory object to save", factoryObj);
    const userId = sanitize(req.params.id)

    Factory.updateOne({ _id: userId }, { $set: factoryObj }, { new: true }, function (err, factory) {
        if (err) {
            console.log("error");
            res.json({ errMsg: "There was an error updating the factory" })
        } else {
            Server.sendFactoryInfo();
            res.json({ msg: "success" });
        }
    })

});

//Delete A Factory

router.delete("/factory/:id", function (req, res) {
    const info = req.body;
    const userId = sanitize(req.params.id);

    Factory.deleteOne({ _id: userId }, function (err, rem) {
        if (err) {
            console.log("error occured: ", err);
            return;
        } else {
            console.log("deleted")
            Server.sendFactoryInfo();
            res.json({ msg: "success" });
        }
    });
});



function createChildArr(count, min, max) {
    let childArr = [];
    for (let i = 0; i < count; i++) {
        let randomNumber = getRandomNumber(min, max);
        console.log("RANDOM NUMBER", randomNumber);
        childArr.push(randomNumber);
    }
    return childArr;
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * max) + min;
}



module.exports = router;
