const app = require('express').Router();
const { readFromFile, readAndAppend, readAndDelete } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');
const fs = require('fs');
const path = require("path")

const dbDirPath = '../db/'
const dbFileName = "db.json"

// GET Route for retrieving all the feedback
app.get('/', async (req, res) => {
  console.info(`${req.method} request received for feedback`);

  fs.readdir(path.join(__dirname, dbDirPath), (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 

      // Listing all files using forEach
      files.forEach((file) => {
          console.log(file);
      });
  });


  try {
    const data = await readFromFile(path.join(__dirname, dbDirPath+dbFileName))
    const jsonData = JSON.parse(data)
    res.json(jsonData)
  } catch {
    res.status(500)
  }
});

// POST Route for submitting feedback
app.post('/', async (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add or update a note`);
  console.log(req.body)
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  console.log(title,text)

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newFeedback = {
      title,
      text,
      note_id: uuid(),
    };

    await readAndAppend(newFeedback, path.join(__dirname, dbDirPath+dbFileName))

    const response = {
      status: 'success',
      body: newFeedback,
    };

    res.json(response);
  } else {
    res.json('Error in posting feedback');
  }
});

app.delete("/:note_id", (req, res)=> {
  console.info(`${req.method} request received`);
  var note_id = req.params.note_id

  try {
    readAndDelete(note_id, path.join(__dirname, dbDirPath+dbFileName))
    res.json("200")
  } catch {
    console.log("error deleting")
    res.json("500")
  }
})

module.exports = app;
