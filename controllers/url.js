const URL = require('../models/url.model')
const shortid = require('shortid')
const validUrl = require('valid-url')

exports.create = async (req, res) => {
    const url = req.body.url
    const urlCode = shortid.generate()
    // check if is valid url
    if(!validUrl.isWebUri(url)) {
        res.json({
            error: 'invalid URL'
        })
    } else {
        try {
            // check if url already exists
            URL.findOne({ original_url: url }, (err, url) => {
                if(!url) {
                    const newUrl = new URL({
                        original_url: req.body.url,
                        short_url: urlCode
                    })
                    newUrl.save()
                          .then(url => {
                            res.json({
                                original_url: url.original_url,
                                short_url: url.short_url
                            })
                          })
                } else {
                    res.json({
                        original_url: url.original_url,
                        short_url: url.short_url
                    })
                }
            })
        } catch(err) {
            console.log(err)
            res.status(500).json('Server Error')
        }
    }
}

exports.getShortUrl = (req, res) => {
    // find short url
    URL.findOne({ short_url: req.params.short_url }, (err, shortUrl) => {
        // if it exists, redirect to original url
        if(shortUrl) {
            res.redirect(shortUrl.original_url)
        } else if(err) {
            return res.status(400).json('URL not found')
        }
    })
}