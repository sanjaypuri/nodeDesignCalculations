const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/', (request, response)=>{
	response.render('home', {});
});

app.get('/hydcylflowcalc', (request, response)=>{
	let sql = `CREATE TABLE IF NOT EXISTS hydcylflowcalc (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				project TEXT NOT NULL,
				customer TEXT,
				title TEXT,
				powerpack TEXT NOT NULL,
				valvestand TEXT NOT NULL,
				equipment TEXT NOT NULL,
				fun TEXT NOT NULL,
				qty TEXT INTEGER NOT NULL,
				bore TEXT INTEGER NOT NULL,
				rod TEXT INTEGER NOT NULL,
				stroke TEXT INTEGER NOT NULL,
				pressure TEXT INTEGER NOT NULL,
				cylspeed TEXT INTEGER NOT NULL,
				forcecap FLOAT,
				forcerod FLOAT,
				volcap FLOAT,
				volrod FLOAT,
				stroketime FLOAT,
				flowcap FLOAT,
				flowrod FLOAT
				);`;
	db.run(sql, (err)=>{
		if(err){
			console.log(`Error creating table 'hydcylflowcalc', error: ${err.message}`);
		}else {
			sql = `SELECT id, project, customer, title, powerpack, valvestand, equipment, fun, qty, bore, rod, stroke, pressure, cylspeed FROM hydcylflowcalc`;
			db.all(sql, (err, rows)=>{
				if(err){
					console.log(`Error reading table 'hydcylflowcalc' Error: ${err.message}`);
				}
				else{
					response.render('hydcylflowcalc', {rows});
				}
			});
		}
	});
});

app.get('/hydcylflowcalcnew', (request, response)=>{
	response.render('hydcylflowcalcnew', {});
});

app.post('/hydcylflowcalcnew', (request, response)=>{
	const project = request.body.project;
	const customer = request.body.customer;
	const title = request.body.title;
	const powerpack = request.body.powerpack;
	const valvestand = request.body.valvestand;
	const equipment = request.body.equipment;
	const fun = request.body.fun;
	const qty = parseInt(request.body.qty,10);
	const bore = parseInt(request.body.bore, 10);
	const rod = parseInt(request.body.rod, 10);
	const stroke = parseInt(request.body.stroke, 10);
	const pressure = parseInt(request.body.pressure,10);
	const speed = parseInt(request.body.speed, 10);
	const forcecap = 1.0*((22/7)/4)*(1.0*bore/10)*(1.0*bore/10)*pressure;
	const forcerod = 1.0*((22/7)/4)*((1.0*bore/10)*(1.0*bore/10)-(1.0*rod/10)*(1.0*rod/10))*pressure;
	const volcap = 1.0*((22/7)/4)*(1.0*bore/10)*(1.0*bore/10)*(1.0*stroke/10)/1000;
	const volrod = 1.0*((22/7)/4)*((1.0*bore/10)*(1.0*bore/10)-(1.0*rod/10)*(1.0*rod/10))*(1.0*stroke/10)/1000;
	const stroketime = 1.0*stroke/speed;
	const flowcap = 1.0*((22/7)/4)*(bore)*(bore)*speed*60/1000000;
	const flowrod = 1.0*((22/7)/4)*((bore)*(bore)-(rod)*(rod))*speed*60/1000000;
	const sql = `INSERT INTO hydcylflowcalc 
				(project, customer, title, powerpack, valvestand, equipment, fun, qty, bore, rod, stroke, pressure, cylspeed, forcecap, forcerod, volcap, volrod, stroketime, flowcap, flowrod)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
	db.run(sql, [project, customer, title, powerpack, valvestand, equipment, fun, qty, bore, rod, stroke, pressure, speed, forcecap, forcerod, volcap, volrod, stroketime, flowcap, flowrod], (err)=>{
		if(err){
			console.log(`Error writing to 'hydcylflowcalc' Error:${err.message}`);
		} else {
			console.log("Record Saved");
			response.redirect('/hydcylflowcalc');
		}
	});
});

app.get('/hydcylflowcalcshow/:id', (request, response)=>{
	const sql = `SELECT * FROM hydcylflowcalc WHERE id = ?`;
	db.get(sql, request.params.id, (err, row)=>{
		if(err){
			console.log(`Error reading from 'hydcylflowcalc' Error:${err.message}`);
		} else {
			response.render('hydcylflowcalcshow', {row});
		}
	});
});

app.get('/hydcylflowcalcedit/:id', (request, response)=>{
	const sql = `SELECT * FROM hydcylflowcalc WHERE id = ?`;
	db.get(sql, request.params.id, (err, row)=>{
		if(err){
			console.log(`Error reading from 'hydcylflowcalc' Error:${err.message}`);
		} else {
			response.render('hydcylflowcalcedit', {row});	
		}
	});
});

app.post('/hydcylflowcalcedit', (request, response)=>{
	const id = request.body.id;
	const project = request.body.project;
	const customer = request.body.customer;
	const title = request.body.title;
	const powerpack = request.body.powerpack;
	const valvestand = request.body.valvestand;
	const equipment = request.body.equipment;
	const fun = request.body.fun;
	const qty = parseInt(request.body.qty,10);
	const bore = parseInt(request.body.bore, 10);
	const rod = parseInt(request.body.rod, 10);
	const stroke = parseInt(request.body.stroke, 10);
	const pressure = parseInt(request.body.pressure,10);
	const speed = parseInt(request.body.speed, 10);
	const forcecap = 1.0*((22/7)/4)*(1.0*bore/10)*(1.0*bore/10)*pressure;
	const forcerod = 1.0*((22/7)/4)*((1.0*bore/10)*(1.0*bore/10)-(1.0*rod/10)*(1.0*rod/10))*pressure;
	const volcap = 1.0*((22/7)/4)*(1.0*bore/10)*(1.0*bore/10)*(1.0*stroke/10)/1000;
	const volrod = 1.0*((22/7)/4)*((1.0*bore/10)*(1.0*bore/10)-(1.0*rod/10)*(1.0*rod/10))*(1.0*stroke/10)/1000;
	const stroketime = 1.0*stroke/speed;
	const flowcap = 1.0*((22/7)/4)*(bore)*(bore)*speed*60/1000000;
	const flowrod = 1.0*((22/7)/4)*((bore)*(bore)-(rod)*(rod))*speed*60/1000000;
	console.log({id:id, project:project});
	const sql = `UPDATE hydcylflowcalc
				SET project = ?,
					customer = ?,
					title = ?,
					powerpack = ?,
					valvestand = ?,
					equipment = ?,
					fun = ?,
					qty = ?,
					bore = ?,
					rod = ?,
					stroke = ?,
					pressure = ?,
					cylspeed = ?,
					forcecap = ?,
					forcerod = ?,
					volcap = ?,
					volrod = ?,
					stroketime = ?,
					flowcap = ?,
					flowrod = ?
				WHERE id = ?`;
	db.run(sql, 
		[project, customer, title, powerpack, valvestand, equipment, fun, qty, bore, rod, stroke, pressure, speed, forcecap, forcerod, volcap, volrod, stroketime, flowcap, flowrod, id], 
		(err)=>{
			if(err){
			console.log(`Error updating 'hydcylflowcalc' Error:${err.message}`);
			} else {
			response.redirect('/hydcylflowcalc');
			}
		});
});

app.listen(5000, ()=>{
	console.log('Server running at port 5000')
});
