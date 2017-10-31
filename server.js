var mongoose = require('mongoose');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');
var fs = require ('fs');
var {ObjectID} = require('mongodb');
var _ = require('lodash');

var {Position} = require ('./models/position');
var {SkillComp} = require('./models/skillComp');
var {Action} = require('./models/action');

const port = process.env.PORT || 3000;
const mongoCon = process.env.MONGODB_URI || 'mongodb://localhost:30001/HR';

// connection to the db
mongoose.connect(mongoCon, { useMongoClient: true });
mongoose.Promise = global.Promise;

// json parser for the Posting and getting
app.use(bodyParser.json());

//stat the server
app.listen(port, function () {
	console.log('Server is up and running, listening on port ' + port);
});

// log what happens
app.use((req, res, next) => {
	var now = new Date().toString();
	var logLine = `${now}: ${req.method}${req.originalUrl}`;
	console.log(logLine);
	fs.appendFile('logs/server.log', logLine +  '\n', (err) => {
		if (err) {
			console.log('Unable to write to file server.log');
		}
	});
	next();
});
app.use(express.static(__dirname + '/public'));


// POSTIIONS
app.post('/positions', async (req, res) => {
	try {
		var position = new Position(req.body);

		position = await position.save();
		res.status(200).send({position, status: 'created'});

	} catch (e) {
		res.status(404).send({e, status: 'not created'});
	}
});

app.get('/positions', async (req, res) => {
	try {
		// console.log(Position.find());
		var positions = await Position.find();
		res.status(200).send({count: positions.length, positions});
	} catch (e) {
		res.status(404).send(e);
	}
});

app.get('/positions/:id', async (req, res) => {
	var id = req.params.id;
	if(!ObjectID.isValid(id)){
		return res.status(404).send({status: 'not created', error: 'bad object ID'});
	}
	try {
		// console.log(Position.find());
		var positions = await Position.findById(id);
		res.status(200).send({count: positions.length, positions});
	} catch (e) {
		res.status(404).send(e);
	}
});

app.patch('/positions/:id', (req, res) => {
	var id = req.params.id;
	var body = _.pick(req.body, ['nextPositions', 'skills', 'competencies']);
	if (!ObjectID.isValid(req.params.id)) {
		return res.status(404).send({});
	} 

	Position.findByIdAndUpdate(id, {$addToSet: body}, {new: true}).then((position) => {
		res.status(200).send({position, status: 'updated'});
	}).catch((e) => {
		res.status(400).send(e);
	});

});

// SKILLCOMPS
app.post('/skillcomps', async (req, res) => {
	try {
		var skillComp = new SkillComp(req.body);

		skillComp = await skillComp.save();
		res.status(200).send({skillComp, status: 'created'});
	} catch (e) {
		res.status(404).send({e, status: 'not created'});
	}
});

app.get('/skillcomps', async (req, res) => {
	try {
		var skillComps = await SkillComp.find();
		res.status(200).send({skillComps});
	} catch (e) {
		res.status(404).send(e);
	}
	
});


// ACTIONS
app.post('/actions', async (req, res) => {
	if(!ObjectID.isValid(req.body.skillCompID)){
		return res.status(404).send({status: 'not created', error: 'bad object ID'});
	}

	try {
		var action = new Action(req.body);

		action = await action.save();
		res.status(200).send({action, status: 'created'});
	} catch (e) {
		res.status(404).send({e, status: 'not created'});
	}
});

app.get('/actions', async (req, res) => {
	try {
		var actions = await Action.find();
		res.status(200).send({actions});
	} catch (e) {
		res.status(404).send(e);
	}
	
});

app.get('/actions/:skillCompID', async (req, res) => {
	var skillCompID = req.params.skillCompID;
	if(!ObjectID.isValid(req.params.skillCompID)){
		return res.status(404).send({status: 'not created', error: 'bad object ID'});
	}
	try {
		var actions = await Action.find({skillCompID: skillCompID});
		res.status(200).send({actions});
	} catch (e) {
		res.status(404).send(e);
	}
	
});

