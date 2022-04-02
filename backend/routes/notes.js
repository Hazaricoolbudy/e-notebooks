const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

// ROUTE 1 get all the notes get "api/auth/fetchallnotes", need login reauired

router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error occured");
    }
});
// ROUTE 2 Add a new note POST "api/auth/addnote" using Post, need login reauired

router.post(
    "/addnote",
    fetchuser,
    [
        body("title", "Enter a valid title").isLength({ min: 3 }),
        body("discription", "Discription must be atleat five characters").isLength({
            min: 3,
        }),
    ],
    async (req, res) => {
        try {
            const { title, discription, tag } = req.body;
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(404).json({ error: error.array() });
            }
            const note = new Notes({
                title,
                discription,
                tag,
                user: req.user.id,
            });
            const saveNote = await note.save();
            res.json({ saveNote });

        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal server error occured");
        }
    }
);

// ROUTE 3 UPDATE a new note PUT "api/auth/update" using Post, need login reauired

router.put('/updatenote/:id', fetchuser, async (req, res) => {

    const { title, discription, tag } = req.body;

    // Create a new note object

    try {



        const newNote = {};
        if (title) {
            newNote.title = title;

        }
        if (discription) {
            newNote.discription = discription
        }
        if (tag) {
            newNote.tag = tag
        }
        // Find the note to be update it
        let note = await Notes.findById(req.params.id)
        if (!note) {
            return res.status(404).send("NOT FOUND")

        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("NOT ALLOWED")
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.send(note);
        // const saveNewNote=await note.save();
        // res.send(saveNewNote);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error occured");

    }

})
// ROUTE 4 UPDATE a new note DElete "api/auth/deletenote" using Post, need login reauired

router.delete('/deletenote/:id', fetchuser, async (req, res) => {



    // Find the note to be DELTED ADN DELETE IT
    let note = await Notes.findById(req.params.id)

    try {

        if (!note) {
            return res.status(404).send("NOT FOUND")
        }

        // ALLOW deletion only if user owns this notes
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("NOT ALLOWED")
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.send({ "Success": "Note has been deleted", note: note });
        // const saveNewNote=await note.save();
        // res.send(saveNewNote);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error occured");
    }

})

module.exports = router;
