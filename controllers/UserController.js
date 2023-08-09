const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


const bcrypt = require("bcrypt");
const User = require('../models/user');
const passport = require('passport');
const paginate = require('express-paginate');

exports.getLogin = (req, res) => {
    res.render('login', {
        title: 'Login'
    });
};

exports.postLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.log('Error during authentication:', err);
            return next(err);
        }
        if (!user) {
            console.log('Authentication failed:', info.message);
            return res.redirect('/login');
        }
        req.logIn(user, (err) => {
            if (err) {
                console.log('Error during login:', err);
                return next(err);
            }
            console.log('User after authentication:', req.user);
            return res.redirect('/dashboard'); // Redirect to dashboard after successful login
        });
    })(req, res, next);
};


exports.logout = (req, res) => {
    req.logout(() => {});
    res.redirect('/');
};

exports.getNewUser = (req, res) => {
    res.render("user/new", { title: "Create User" });
};

exports.postNewUser = async (req, res) => {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    try {
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role,
            createdBy: req.user._id,
            updatedBy: req.user._id,
        });
  
        await user.save();
        res.redirect("/users/list");
    } catch (error) {
        console.log(error);
        res.render("user/new", {
            title: "Create User",
            error: "Failed to create user. Please try again.",
        });
    }
};

exports.getSearch = async (req, res) => {
    try {
        const { query } = req.query;
        if (query && query.length >= 3) {
            const users = await User.find({
                $or: [
                    { username: { $regex: query, $options: "i" } },
                    { email: { $regex: query, $options: "i" } },
                ],
            })
                .limit(10)
                .lean();

            res.status(200).json({ success: true, users });
        } else {
            res.status(400).json({ success: false, message: "Invalid query" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

exports.getList = async (req, res) => {
    if(req.isAuthenticated()){
      let query = {};
      let [ users ] = await Promise.all([
        User.find(query)
          .sort({ updatedAt: 'desc' })
          .limit(req.query.limit)
          .skip(req.skip)
          .lean()
          .exec(),
      ]);
      let [ count ] = await Promise.all([
        User.countDocuments(query),
      ]);
      let pageCount = Math.ceil(count / req.query.limit);
      res.render('user/list', {
        user: req.user,
        title: 'List of Users',
        users: users,
        pageCountUsers: pageCount,
        pagesUsers: paginate.getArrayPages(req)(3, pageCount, req.query.page),
      });
    } else {
      res.render('dashboard', { user: req.user, title: 'Dashboard' });
    }
  };
  

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        const user = await User.findById(userId);
    
        if (user) {
            await User.findByIdAndRemove(userId);
            res.status(200).json({ success: true, message: 'User deleted successfully.' });
        } else {
            res.status(404).json({ success: false, message: 'User not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};
