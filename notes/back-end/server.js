const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}));

// parse application/json
app.use(bodyParser.json());

// connect to the database
mongoose.connect('mongodb://localhost:27017/notes', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
    name: 'session',
    keys: ['secretValue'],
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

const users = require("./users.js");
app.use("/api/users", users.routes);
const validUser = users.valid;

const folderSchema = new mongoose.Schema({
  name: String,
  notes: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Note'
  }],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  lastEdited: {
    type: Date, default:Date.now,
  },
});

const Folder = mongoose.model('Folder', folderSchema);


// Create a folder
app.post('/api/folders', validUser, async (req, res) => {
  const folder = new Folder({
    name: req.body.name,
    notes: [],
    user: req.user._id,
  });
  try {
    await folder.save();
    res.send(folder);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
// GET ONE FOLDER
app.get('/api/folders/:id', validUser, async (req,res)=> {
  console.log("entered one folder endpoint");
  try {
    let folder = await Folder.findOne({_id: req.params.id});
    if(!folder.user._id.equals(req.user._id) ){
      return res.sendStatus(403);
    }
    res.send(folder);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }
});
// Get a list of all Folders
app.get('/api/folders/user/:userID', validUser, async (req, res) => {
  try {
    let folders = await Folder.find({user: req.params.userID}).sort({lastEdited:-1});
    res.send(folders);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


app.delete('/api/folders/:id', validUser, async (req, res)=> {

  try {
    let id = req.params.id;
    let folder = await Folder.findOne({_id:id}).populate('user');

    if(!folder.user._id.equals(req.user._id) ){
      return res.sendStatus(403);
    }

    for(let i = 0; i < folder.notes.length; i++) {
      await Note.deleteOne({_id:folder.notes[i]._id});
    }
    await Folder.deleteOne({_id:id})
    res.sendStatus(200);
  } catch(error) {
    console.log(error);
    res.sendStatus(500);
  }

});


app.put('/api/folders/:id', validUser, async (req, res)=> {
  try {
   let id = req.params.id;
   let folder = await Folder.findOne({_id:id}).poulate('user');

   if(folder.user != req.user){
     return res.sendStatus(403);
   }
   folder.name = req.body.name;

   folder.lastEdited = new Date();

   folder.save();

   res.sendStatus(200)
 } catch(error) {
   console.log(error);
   res.sendStatus(500);

 }
});

const noteSchema = new mongoose.Schema({
  name: String,
  contents: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  lastEdited: {
    type: Date, default:Date.now,
  },
});

const Note = mongoose.model('Note', noteSchema);



app.post('/api/folders/:folderID/notes', validUser, async (req, res) => {
    try {
        let folder = await Folder.findOne({_id: req.params.folderID});

        if (!folder) {
            res.send(404);
            return;
        }
        if(!folder.user._id.equals(req.user._id) ){
          return res.sendStatus(403);
        }

        let note = new Note({
            name: req.body.name,
            contents: req.body.contents,
            user: req.user._id,
        });
        await note.save();
        folder.notes.push(note._id);
        await folder.save();
        res.send(note);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.get('/api/folders/:folderID/notes', validUser, async (req, res) => {
    try {
        let folder = await Folder.findOne({_id: req.params.folderID}).populate("notes");
        if (!folder) {
            res.send(404);
            return;
        }

        res.send(folder.notes.sort(function(a,b) {
          return b.lastEdited - a.lastEdited;
        }));
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});


app.get('/api/folders/:folderID/notes/:id', validUser, async (req, res)=> {
  try {
    let note = await Note.findOne({_id:req.params.id})
    console.log(note);
    if (!note) {
        res.send(404);
        return;
    }
    res.send(note);
  } catch(error) {
      console.log(error)
      res.sendStatus(500);
  }

});

app.put('/api/notes/:noteID', validUser, async (req, res) => {
    try {
        let note = await Note.findOne({_id:req.params.noteID});
        if (!note) {
            res.send(404);
            return;
        }

        if(!note.user._id.equals(req.user._id) ){
          return res.sendStatus(403);
        }

        note.name = req.body.name;
        note.contents = req.body.contents;
        note.lastEdited = new Date();
        await note.save();
        res.send(note);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.put('/api/folders/:folderID/updateLastEdited', validUser, async (req, res) => {
  try {
    let folder = await Folder.findOne({_id: req.params.folderID})
    if (!folder) {
        res.send(404)
        return;
      }
    if(!folder.user._id.equals(req.user._id)){
      return res.sendStatus(403);
    }

    folder.lastEdited = new Date();
    await folder.save();
    res.sendStatus(200);
   } catch(error) {
     console.log(error)
    res.sendStatus(500);
  }

});

app.delete('/api/folders/:folderID/notes/:noteID', validUser, async (req, res) => {
    try {

        let folder = await Folder.findOne({_id: req.params.folderID})
        if (!folder) {
            res.send(404);
            return;
        }
        if(!folder.user._id.equals(req.user._id) ){
          return res.sendStatus(403);
        }


        let note = await Note.findOne({_id:req.params.noteID});

        if (!note) {
            res.send(404);
            return;
        }

        let index = folder.notes.indexOf(note._id)

        folder.notes.splice(index,1);

        await note.delete();
        await folder.save();
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});



app.listen(3000, () => console.log('Server listening on port 3000!'));
