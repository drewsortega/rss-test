var mongoose = require('mongoose');

var linkSchema = mongoose.Schema({
  url : String
})

module.exports = mongoose.model('Link', linkSchema);
