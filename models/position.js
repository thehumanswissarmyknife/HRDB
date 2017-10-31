var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var positionSchema = new Schema ({
	title: {
		type: String,
		required: true},
	level: {
		type:Number,
		required: true},
	skills: Array,
	competencies: Array,
	nextPositions: Array
});

var Position = mongoose.model('Position', positionSchema);

module.exports = {Position};