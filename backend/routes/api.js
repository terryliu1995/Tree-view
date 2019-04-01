const express = require('express');
const router = express.Router();
const Factory = require("../models/factory.js");
const Server = require("../../app.js");
const sanitize = require('mongo-sanitize');


router.get('/factory', function (req, res) {

    Factory.find({}, (err, items) => {
        if (err) res.json([]);
        else res.json(items);
    });

})


//Create A Factory
router.post('/factory', function (req, res) {
    console.log("Req body", req.body);
    if (req.body.title === "" || req.body.title === null) {
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
    if (req.body.min > req.body.max) {
        res.json({ errMsg: "There Min must be less than or equal to the Max" });
        return;
    }


    console.log("factory object to save", req.body);

    var newFactory = new Factory(req.body);
    newFactory.save(function (err, factory) {
        if (err) {
            console.log('Error creating factory', err);
        } else {
            // Server.sendFactoryInfo();
            res.json({ msg: "success" });
        }
    });

});

//Rename
router.patch('/factory', function (req, res) {
    console.log("Req body", req.body);
    if (req.body.title === "" || req.body.title === null) {
        res.json({ errMsg: "Factory Title Is Required" });
        return;
    }

    let factoryObj = {
        title: req.body.title,
    };


    console.log("factory rename", factoryObj);
    const userId = sanitize(req.body._id)

    Factory.updateOne({ _id: userId }, { $set: factoryObj }, { new: true }, function (err, factory) {
        if (err) {
            console.log("error");
            res.json({ errMsg: "There was an error renaming the factory" })
        } else {
            // Server.sendFactoryInfo();
            res.json({ msg: "success" });
        }
    })

});

//Regenerate A Factory
router.put('/factory', function (req, res) {
    console.log("Req body", req.body);
    if (req.body.title === "" || req.body.title === null) {
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


    console.log("factory object to save", req.body);
    const userId = sanitize(req.body._id)

    Factory.updateOne({ _id: userId }, { $set: req.body }, { new: true }, function (err, factory) {
        if (err) {
            console.log("error");
            res.json({ errMsg: "There was an error updating the factory" })
        } else {
            // Server.sendFactoryInfo();
            res.json({ msg: "success" });
        }
    })

});

//Delete A Factory

router.delete("/factory/:_id", function (req, res) {
    const userId = sanitize(req.params._id);

    Factory.deleteOne({ _id: userId }, function (err, rem) {
        if (err) {
            console.log("error occured: ", err);
            return;
        } else {
            console.log("deleted " + userId)
            // Server.sendFactoryInfo();
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
