var mongoose = require('mongoose');

// define the schema 
var factorySchema = mongoose.Schema({

        title: String,
        min: Number,
        max: Number,
        children: Array

});



// create the model 
module.exports = mongoose.model('Factory', factorySchema);
