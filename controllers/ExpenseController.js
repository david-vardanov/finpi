// controllers/ExpenseController.js
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const moment = require('moment');
const getCalculations = require('../helpers/calculations');
const buildFilterOptions = require('../helpers/filter');



const Expense = require('../models/Expense');

const Tag = require('../models/Tag');
exports.list = async (req, res) => {
  const expenses = await Expense.find({ user: req.user.id })
    .sort({ date: -1 })
    .populate('tags');
  
  const calculations = await getCalculations(req.user.id);
  res.render('expense/list', {
    expenses,
    title: 'Expenses',
    moment,
    calculations
  });
};


// Helper function to get the total amount spent within a date range
async function getSpentAmount(userId, startDate, endDate) {
  const result = await Expense.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), date: { $gte: startDate.toDate(), $lte: endDate.toDate() } } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  return result[0]?.total || 0;
}




exports.create = async (req, res) => {
  res.render('expense/add', { title: "New Expense", expense: new Expense() });
};

exports.store = async (req, res) => {
  const expenseData = {
    amount: req.body.amount,
    date: req.body.date,
    description: req.body.description,
    user: req.user.id
  };
  const tags = req.body.tags;
  const savedTags = [];
  if(tags) {
  for (const tag of tags) {
    // If the tag id is not a valid ObjectId, it's a new tag
    if (!ObjectId.isValid(tag)) { 
      // Check if the tag already exists
      let existingTag = await Tag.findOne({ name: tag, user: req.user.id });
      if (!existingTag) {
        const newTag = new Tag({ name: tag, user: req.user.id });
        await newTag.save();
        existingTag = newTag;
      }
      savedTags.push(existingTag._id);
    } else {
      savedTags.push(tag);
    }
  }
}
  expenseData.tags = savedTags;

  const expense = new Expense(expenseData);
  await expense.save();
  res.redirect('/expenses');
};


exports.edit = async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  const tags = await Tag.find();
  res.render('expense/edit', { ags, expense, moment, title: 'Edit Expense' });
};

exports.filter = async (req, res) => {
  const { dateFrom, dateTo, tags, minAmount, maxAmount } = req.body;

  const calculations = await getCalculations(req.user.id);

  const filterOptions = buildFilterOptions(req.body);




// Query for tags
  const expenses = await Expense.find(filterOptions).populate('tags');

  // Pass the filter options and tags to the view
  res.render('expense/list', { expenses, calculations, title: 'Filtered Expenses', filterOptions, tags, moment });

};

exports.filterByTag = async (req, res) => {
  const tagId = req.params.tagId;

  const expenses = await Expense.find({ tags: tagId, user: req.user.id }).populate('tags');
  const calculations = await getCalculations(req.user.id);
  // Pass the expenses to the view
  res.render('expense/list', { expenses, calculations, title: 'Filtered Expenses', moment });
};


exports.update = async (req, res) => {
  const expenseData = {
    amount: req.body.amount,
    date: req.body.date,
    description: req.body.description,
    user: req.user.id
  };
  const tags = req.body.tags;
  const updatedTags = [];
  if( tags) {
  for (const tag of tags) {
    // If the tag id is not a valid ObjectId, it's a new tag
    if (!ObjectId.isValid(tag)) { 
      // Check if the tag already exists
      let existingTag = await Tag.findOne({ name: tag, user: req.user.id });
      if (!existingTag) {
        const newTag = new Tag({ name: tag, user: req.user.id });
        await newTag.save();
        existingTag = newTag;
      }
      updatedTags.push(existingTag._id);
    } else {
      updatedTags.push(tag);
    }
  }
}
  expenseData.tags = updatedTags;

  const expense = await Expense.findByIdAndUpdate(req.params.id, expenseData, { new: true });
  res.redirect('/expenses');
};

exports.delete = async (req, res) => {
  console.log('delete called');
  await Expense.findByIdAndDelete(req.params.id);
  res.redirect('/expenses');
};
