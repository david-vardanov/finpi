const express = require("express");
const router = express.Router();
const paginate = require("express-paginate");
const isAuthenticated = require("../middlewares/authMiddleware");

const InviteController = require('../controllers/InviteController');

//router.post("/generate-invite-link", InviteController.generateInviteLink);
router.get("/list", isAuthenticated, paginate.middleware(10,50), InviteController.listInvites);
router.get("/:id", isAuthenticated, InviteController.getInvite);
router.get("/log/:inviteId", InviteController.logInvite);
router.delete("/:id", InviteController.deleteInvite);
router.post("/:id/revoke", InviteController.revokeInvite);

module.exports = router;
