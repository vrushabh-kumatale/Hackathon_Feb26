const express = require('express')
const cryptoJs = require('crypto-js')
const jwt = require('jsonwebtoken')
const pool = require("../db-connection/db");
const  result  = require('../utils/result');
const config = require('../utils/config')

const router = express.Router()

router.post('/register', (req, res) => {
  const { email, password, role } = req.body
  const encryptedPassword = String(cryptoJs.SHA256(password))
  const sql = `INSERT INTO users(email, password, role) VALUES(?,?,?)`
  pool.query(
    sql,
    [email, encryptedPassword, role],
    (error, data) => {
      res.send(result.createResult(error, data))
    }
  )
})

router.post('/login', (req, res) => {
  const { email, password } = req.body
  const encryptedPassword = String(cryptoJs.SHA256(password))
  const sql = `SELECT * FROM users WHERE email = ? AND password = ?`
  pool.query(sql, [email, encryptedPassword], (error, data) => {
    if (data) {
      if (data.length != 0) {
        const payload = {
          userId: data[0].id,
        }
        const token = jwt.sign(payload, config.secret)
        const body = {
          token: token,
           email: data[0].email,
           role: data[0].role,
        }
        res.send(result.createSuccessResult(body))
      } else res.send(result.createErrorResult('Invalid email or password'))
    } else res.send(result.createErrorResult(error))
  })
})

module.exports = router
