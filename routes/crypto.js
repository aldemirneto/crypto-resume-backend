var express = require('express')
var router = express.Router()

var model = require('../models/index')

router.get('/', (_, res, next) => {
    model.Crypto.findAll({})
    .then(cryptos => res.json ({
        error: false,
        data: cryptos
    }))
    .catch(error => res.json ({
        error: true,
        data: [],
        error: error
    }))
})

router.post('/', (req, res, _) => {
    const {
        description,
        symbol,
        balance,
        averagePrice
    } = req.body
    model.Crypto.create({
        description: description,
        symbol: symbol
    })
    .then(async crypto => {
        await model.CryptoResume.create({
            cryptoId: crypto.id,
            balance: balance,
            averagePrice: averagePrice
        })
        .then(crypto => res.status(201).json({
            error: false,
            data: crypto
        }))
        .catch(error => res.json({
            error: true,
            data: [],
            error: error
        }))
    })
    .catch(error => res.json({
        error: true,
        data: [],
        error: error
    }))
})

router.put('/:id', (req, res, next) => {
    const id = req.params.id
    const {
        description,
        symbol
    } = req.body
    model.Crypto.update({
        description: description,
        symbol: symbol
    }, {
        where: {
            id: id
        }
    })
    .then(_ => res.status(201).json({
        error: false,
        message: 'Criptomoeda alterada'
    }))
    .catch(error => res.json({
        error: true,
        error: error
    }))
})

router.get('/:id', (req, res, next) => {
    const cryptoId = req.params.id
    model.Crypto.findByPk(cryptoId)
    .then(crypto => res.json ({
        error: false,
        data: crypto
    }))
    .catch(error => res.json ({
        error: true,
        error: error
    }))
})

module.exports = router
