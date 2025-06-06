const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const login = asyncHandler(async(req, res) => {
    try {
        const { email, password } = req.body
        const sanitizedBody = { ...req.body }
        if (sanitizedBody.password) {
            sanitizedBody.password = '[FILTERED]'
        }
        console.log(sanitizedBody)
        const result = await User.find({ email: email })
        if(result.length > 0) {
            const passwordMatch = await bcrypt.compare(
                password,
                result[0].password,
              )
            if (passwordMatch) {
                const TOKEN_KEY = process.env.TOKEN_KEY
                const token = jwt.sign({ user: result[0].email }, TOKEN_KEY, { expiresIn: "12h", })
                res.status(200).json({
                  message: "OK",
                  token: token,
                  data: {
                    first_name: result[0].first_name,
                    last_name: result[0].last_name,
                    email: result[0].email,
                    use_id: result[0].use_id,
                  },
                })
            } else {
                res.status(200).json({ message: "ERROR", data: 'Not Found User' })
            }
        } else {
            res.status(200).json({ message: "ERROR", data: 'Not Found User' })
        }
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
})

// create a product
const createUser = asyncHandler(async(req, res) => {
    try {
        const info = req.body
        const sanitizedBodyCreate = { ...req.body }
        if (sanitizedBodyCreate.password) {
            sanitizedBodyCreate.password = '[FILTERED]'
        }
        console.log(sanitizedBodyCreate)
        const findUser = await User.find({ email: info.email })
        if(findUser.length > 0) {
            res.status(200).json({ message: 'ERROR', data: 'User is exists' })
        } else {
            const hashedPassword = await bcrypt.hash(info.password, 10)
            info.password = hashedPassword
            info.status = 'A'
            const user = await User.create(info)
            res.status(200).json({ message: 'OK', data: user })
        }
    } catch (error) {
        res.status(500).json({ message: 'ERROR', data: error })
        throw new Error(error.message)
    }
})

// update a user
const updateUser = asyncHandler(async(req, res) => {
    try {
        const { id } = req.params
        const info = req.body
        const hashedPassword = await bcrypt.hash(info.password, 10)
        info.password = hashedPassword
        const user = await User.findByIdAndUpdate(id, info)
        // we cannot find any product in database
        if(!user){
            res.status(404)
            throw new Error(`cannot find any product with ID ${id}`)
        }
        const updatedUser = await User.findById(id)
        res.status(200).json(updatedUser)
        
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
})

const deleteUser = asyncHandler(async(req, res) =>{
    try {
        const { id } = req.params
        const user = await User.findByIdAndUpdate(id, { status: 'D' })
        if(!user){
            res.status(404)
            throw new Error(`cannot find any product with ID ${id}`)
        }
        res.status(200).json(user)
        
    } catch (error) {
        res.status(500)
        throw new Error(error.message)
    }
})

module.exports = {
    login,
    createUser,
    updateUser,
    deleteUser
}