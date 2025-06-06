const express = require('express')
const router = express.Router()
const { login, createUser, updateUser, deleteUser } = require('../controllers/userController')
const { userCheckToken, verifyToken } = require('../middleware/authorization')

//Verify
router.use((req, res, next) => {
    const pathname = req.path
        return next()
    }
    verifyToken(req, res, next)
})

router.post('/login', login)
router.post('/token', userCheckToken)

// create a User
router.post('/register', createUser)
// update a User
router.put('/:id', updateUser)
// delete a User
router.delete('/:id', deleteUser)

module.exports = router
