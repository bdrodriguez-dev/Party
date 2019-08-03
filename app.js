const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require("node-fetch");
const mongoose = require("mongoose");

require("core-js/stable");
require("regenerator-runtime/runtime");
require("@babel/register");
const apiLib = require('./public/scripts/api');
const CHARACTER_ADVANCEMENT_TABLE = require('./public/scripts/CHARACTER_ADVANCEMENT_TABLE');

app.use(bodyParser.urlencoded({extended: true}));
app.use("/public", express.static('./public/'));
app.set('view engine', 'ejs');

//Database Stuff
mongoose.connect('mongodb://localhost:27017/party', {useNewUrlParser: true});

const characterSchema = new mongoose.Schema({
  charName: String,
  charRace: String,
  charSubRace: String,
  charClass: [
    {
      charClass: String,
      charSubClass: String,
      classLevel: Number 
    }
  ],
  charGender: String,
  abilityScores: {
    str: {score: Number, mod: Number},
    dex: {score: Number, mod: Number},
    con: {score: Number, mod: Number},
    int: {score: Number, mod: Number},
    wis: {score: Number, mod: Number},
    cha: {score: Number, mod: Number}
  }
});

const Character = mongoose.model('Character', characterSchema);



// Routes ------------------------------------------------------------------------------
app.get('/', function(req, res) {
  res.render('pages/landing');
});

app.get('/characters', function(req, res) {
  //get list of characters
  Character.find({}, function(error, allCharacters) {
    if(error) console.log(error);
    else res.render('pages/characters', {characters: allCharacters});
  });
});

app.get('/characters/new', function(req, res) {
   apiLib.asyncCall('races/', (racesData) => {
    let racesList = [];
    racesData.results.forEach((race) => {
      racesList.push(race.name);
    });
    apiLib.asyncCall('classes/', (classesData) => {
      let classesList = [];
      classesData.results.forEach((charClass) => {
        classesList.push(charClass.name);
      });
      res.render('pages/newCharacter', {races: racesList, classes: classesList});
    });
  });
});

app.post('/characters', function(req, res) {
  const getClasses = function() {
    let classList = []
    let numClasses = req.body.numClasses;
    for(let i = 0; i < numClasses; i++) {
      let charClassName = "charClass_" + i;
      let subClassName = "subClass_" + i;
      let levelName = "level_" + i;
      classList.push({
        charClass: req.body[charClassName],
        charSubClass: req.body[subClassName],
        classLevel: req.body[levelName] 
      });
    }
    
    return classList;
  };
  const getMod = function(stat) {
    return Math.floor((req.body[stat] - 10) / 2);
  };

  //Create character in db when post route runs
  Character.create(
    {
      charName: req.body.characterName,
      charRace: req.body.race,
      charSubRace: req.body.subRace,
      charClass: getClasses(),
      charGender: req.body.gender,
      abilityScores: {
        str: {score: req.body.str, mod: getMod("str")},
        dex: {score: req.body.dex, mod: getMod("dex")},
        con: {score: req.body.con, mod: getMod("con")},
        int: {score: req.body.int, mod: getMod("int")},
        wis: {score: req.body.wis, mod: getMod("wis")},
        cha: {score: req.body.cha, mod: getMod("cha")},
      }
    }, 
    function(error, newCharacter) {
      if(error) {
        console.log(error);
      }
      else {
        console.log(newCharacter);
        res.redirect('/characters');
      }
    }
  );

});  

app.get('/characters/:id', function(req, res) {
  Character.findById(req.params.id, function(error, foundCharacter) {
    if(error) console.log(error);
    else res.render('pages/details', {character: foundCharacter});
  });
});

app.get('/characters/:id/edit', function(req, res) {
  //show edit forms for character
  apiLib.asyncCall('races/', (racesData) => {
    let racesList = [];
    racesData.results.forEach((race) => {
      racesList.push(race.name);
    });
    apiLib.asyncCall('classes/', (classesData) => {
      let classesList = [];
      classesData.results.forEach((charClass) => {
        classesList.push(charClass.name);
      });
      Character.findById(req.params.id, function(error, foundCharacter) {
        if(error) console.log(error);
        else res.render('pages/editCharacter', {races: racesList, classes: classesList, character: foundCharacter});
      });
    });
  });
});

app.put('/characters/:id', (req, res) => {
  //take form data
  //push to db
    //findByIdAndUpdate
  //redirect
});

app.delete('/characters/:id', (req, res) => {
  //findByIdAndRemove(req.params.id)
  
});

//--------------------------------------------------------------------------------------





app.listen(3000, () => console.log('Server is running'));