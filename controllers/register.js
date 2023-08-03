const registerHandler = (req, res, db, bcrypt, saltRounds) => {
    const { name, email, password } = req.body
    const hash = bcrypt.hashSync(password, saltRounds);

    if (!name || !email || !password) {
        return res.status(400).json('incorrect form submission')
    }

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')    
                .insert({
                    email: loginEmail[0].email,
                    name: name,
                    joined: new Date
                }).then(user => {
                    res.json(user[0])
                })
        })
        .then(trx.commit)
        .catch(trx.callback)
    })
    .catch(err => res.status(400).json('unable to register')) 
     
}

module.exports = { registerHandler }