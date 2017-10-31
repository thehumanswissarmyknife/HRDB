var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var actionSchema = new Schema ({
	name: {
		type: String,
		required: true},
	skillCompID: {
		type: String,
		required: true},
	description: {
		type: String,
		required: true
	}
});

var Action = mongoose.model('Action', actionSchema);

module.exports = {Action};