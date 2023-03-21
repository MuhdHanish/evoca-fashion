const adminCollection = require('../model/adminSchema')
const userCollection = require('../model/userSchema')

const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types

module.exports = {

  adminHome: (req, res,next) => {
    try {
      res.render('admin/admin-home')
    } catch (err) {
      next(err);
    }
  },

  getAdminLogin: (req, res,next) => {
    try {
      if (req.session.admin) {
        res.redirect('/')
      }
      else {
        const admerr = req.session.admerr
        const admdata = req.session.admdata
        res.render('admin/admin-login', { admerr, admdata })
        req.session.admerr = null
        req.session.admdata = null
      }
    } catch (err) {
      next(err);
    }
  },

  postAdminLogin: async (req, res,next) => {
    try {
      const adminData = req.body
      const admin = await adminCollection.findOne({ adminEmail: adminData.adminEmail })
      if (admin) {
        if (admin.adminPassword == adminData.adminPassword) {
          req.session.admin = admin
          res.redirect('/admin')
        }
        else {
          req.session.admerr = "invalid password"
          req.session.admdata = req.body
          res.redirect('/admin/login')
        }
      }
      else {
        req.session.admerr = "invalid email"
        req.session.admdata = req.body
        res.redirect('/admin/login')
      }
    } catch (err) {
      next(err);
    }
  },

  getUsersList: async (req, res,next) => {
    try {
      const users = await userCollection.find().toArray()
      res.render('admin/all-users', { users })
    } catch (err) {
      next(err);
    }
  },

  blockUser: async (req, res,next) => {
    try {
      const userId = req.params.id
      await userCollection.updateOne({ _id: new ObjectId(userId) }, { $set: { status: false } }).then()
      res.redirect('/admin/admin-userslist')
    } catch (err) {
      next(err);
    }
  },

  unblockUser: async (req, res,next) => {
    try {
      const userId = req.params.id
      await userCollection.updateOne({ _id: new ObjectId(userId) }, { $set: { status: true } }).then()
      res.redirect('/admin/admin-userslist')
    } catch (err) {
      next(err);
    }
  },

  adminLogout: (req, res,next) => {
    try {
      req.session.admin = null
      res.redirect('/admin/login')
    } catch (err) {
      next(err);
    }
  }
}

