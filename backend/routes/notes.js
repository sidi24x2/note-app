const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const Note = require('../models/Note');
const slugify = require('slugify');

router.use(auth.verifyToken);

router.get('/', async (req, res) => {
  try {
    let { username } = req.user;

    let notes = await Note.find({ author: username });

    if (!notes || notes.length === 0)
      return res.status(400).json({ msg: 'No Notes Found' });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ msg: error.msg || error });
  }
});

router.get('/favorites', async (req, res) => {
  try {
    console.log(req.user.username);
    let notes = await Note.find({
      author: req.user.username,
      favorited: true,
    });
    if (!notes) return res.status(404).json({ msg: 'No Notes Found' });

    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ msg: error.msg || error });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    let { slug } = req.params;
    let note = await Note.findOne({ slug, author: req.user.username });
    if (!note) return res.status(400).json({ msg: 'No Note Found' });

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ msg: error.msg || error });
  }
});

router.post('/', async (req, res) => {
  try {
    let { title, content } = req.body;
    req.body.author = req.user.username;
    req.body.slug = slugify(req.body.title);

    if (!title || !content)
      return res.status(400).json({ msg: 'Title/Content Required!' });

    let note = await Note.create(req.body);
    if (!note) return res.status(500).json({ msg: 'Error Creating Note' });

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ msg: error.msg || error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    let { id } = req.params;
    let { title, content } = req.body;
    if (!title || !content)
      return res
        .status(400)
        .json({ msg: 'Title and content should not be empty !' });

    req.body.slug = slugify(req.body.title);

    let note = await Note.findOneAndUpdate(
      { _id: id, author: req.user.username },
      req.body,
      { new: true }
    );

    if (!note)
      return res.status(404).json({
        msg: 'Note not found or you are not authorized to this note.',
      });

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ msg: error.msg || error });
  }
});

router.put('/:id/favorite', async (req, res) => {
  try {
    let { id } = req.params;

    let note = await Note.findOne({ _id: id, author: req.user.username });

    if (!note)
      return res.status(404).json({
        msg: 'Note not found or you are not authorized to this note.',
      });

    note.favorited = !note.favorited;

    note = await note.save();

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ msg: error.msg || error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let { id } = req.params;

    let note = await Note.findByIdAndDelete(id);

    if (!note) return res.status(400).json({ msg: 'Error Deleting Note' });

    res.status(201).json({ msg: 'Deleted !!' });
  } catch (error) {
    res.status(500).json({ msg: error.msg || error });
  }
});

module.exports = router;
