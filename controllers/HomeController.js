const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const paginate = require("express-paginate");
const isAuthenticated = require('../middlewares/authMiddleware');

exports.index = async (req, res) => {
    res.render("homepage", {
        title: "Expense Tracker - Home"
    });
};

exports.about = (req, res) => {
    res.render("about", {
        title: "About - Expense Tracker"
    });
};

exports.dashboard = (req, res) => {
    res.render("dashboard/index", {
        title: "Dashboard - Expense Tracker"
    });
};



exports.contacts = (req, res) => {
    res.render("contacts", {
        title: "Contacts - Expense Tracker"
    });
};
