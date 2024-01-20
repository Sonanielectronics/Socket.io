var mongoose = require("mongoose");

var MessageSchema = new mongoose.Schema({
    
    // content: String,
    // timestamp: {
    //     type: Date,
    //     default: Date.now
    // }

    // Sender: {
    //     type: String,
    //   },
      Message: {
        type: String,
      }

});

var Todo = mongoose.model("MessageCollection", MessageSchema);

module.exports = { Todo };
