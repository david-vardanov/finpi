const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const Tag = require('../models/Tag'); // Modify the path as needed

exports.list = async (req, res) => {
  const tags = await Tag.find({ user: req.user.id });
  res.render('expense/tag/list', { tags, title: 'Tags' });
  console.log(tags);
};

exports.create = (req, res) => {
  res.render('expense/tag/create', { title: 'New Tag' });
};

exports.store = async (req, res) => {
  
    const tag = new Tag({ ...req.body, user: req.user.id });
    console.log(tag);
    try {
      await tag.save();
      console.log(tag);
    } catch (err) {
      console.error(err);
    }
    res.redirect('/expenses/tags');
  };

  exports.search = async (req, res) => {
    const search = req.query.term;
    let tags = await Tag.find({
      name: { $regex: new RegExp(search, 'i') },
      user: req.user.id
    }).limit(5);
  
    // Format the tags array to include 'id' and 'text' properties
    tags = tags.map(tag => {
      return {
        id: tag._id, // Use '_id' property from MongoDB document as 'id'
        text: tag.name // Use 'name' property from MongoDB document as 'text'
      };
    });
  
    // Wrap the tags array in an object under the 'results' key
    res.json({ results: tags });
  };


  exports.createAjax = async (req, res) => {
   const tag = new Tag({ name: req.body.name, user: req.user.id });
    try {
      await tag.save();
      res.json({ status: 'success', message: 'Tag created successfully' });
    } catch (err) {
      console.error(err);
      res.json({ status: 'error', message: 'Error creating tag' });
    }
};


exports.edit = async (req, res) => {
  const tag = await Tag.findById(req.params.id);
  res.render('expense/tag/edit', { tag });
};

exports.update = async (req, res) => {
  await Tag.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/expenses/tags');
};

exports.delete = async (req, res) => {
  await Tag.findByIdAndDelete(req.params.id);
  res.redirect('/expenses/tags');
};
