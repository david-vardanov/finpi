const moment = require('moment');
const NodeCache = require('node-cache');
const Expense = require('../models/Expense');
const mongoose = require('mongoose');

// Cache for 10 minutes
const calculationsCache = new NodeCache({ stdTTL: 600, checkperiod: 600 });

async function getSpentAmount(userId, startDate, endDate) {
  const cacheKey = `${userId}-${startDate}-${endDate}`;
  const cachedValue = calculationsCache.get(cacheKey);

  if (cachedValue) return cachedValue;

  const result = await Expense.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), date: { $gte: startDate.toDate(), $lte: endDate.toDate() } } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  const total = result[0]?.total || 0;
  calculationsCache.set(cacheKey, total);

  return total;
}

async function getCalculations(userId) {
  const startOfToday = moment().startOf('day');
  const endOfToday = moment().endOf('day');

  const startOfYesterday = startOfToday.clone().subtract(1, 'days');
  const endOfYesterday = endOfToday.clone().subtract(1, 'days');

  const startOfWeek = moment().startOf('week');
  const endOfWeek = moment().endOf('week');

  const startOfMonth = moment().startOf('month');
  const endOfMonth = moment().endOf('month');

  const todaySpent = await getSpentAmount(userId, startOfToday, endOfToday);
  const yesterdaySpent = await getSpentAmount(userId, startOfYesterday, endOfYesterday);
  const weekSpent = await getSpentAmount(userId, startOfWeek, endOfWeek);
  const monthSpent = await getSpentAmount(userId, startOfMonth, endOfMonth);

  return {
    todaySpent,
    yesterdaySpent,
    weekSpent,
    monthSpent,
  };
}

module.exports = getCalculations;
