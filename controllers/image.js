const clarifai = require('clarifai') 

const apiCallHandler = (req, res) => {
    const app = new clarifai.App({
        apiKey: '96c7726ec4d74405970079f308aeacad'
    })

    app.models.predict('face-detection', req.body.input)
        .then(data => res.json(data))
        .catch(err => res.status(400).json('unable to work with API'))
}

const imageHandler = (req, res, db) => {
    const { id } = req.body
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0].entries)
        })
        .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = { imageHandler, apiCallHandler }