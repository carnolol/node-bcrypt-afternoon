const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db')
        const {username, password, isAdmin} = req.body
        const result = await db.get_user([username])
        const extingUser = result[0]
        if(extingUser){
            return res.status(409).send('That Username is Taken!')
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const registeredUser = await db.register_user([isAdmin, username, hash])
        const user = registeredUser[0]
        req.session.user = {
            isAdmin: user.is_admin,
            id: user.id,
            username: user.username
        }
        res.status(201).send(req.session.user)
    },
}