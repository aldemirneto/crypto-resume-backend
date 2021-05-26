var express = require('express')
var router = express.Router()

var model = require('../models/index')

router.get('/', (_, res, next) => {
    model.CryptoResume.findAll({})
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

router.put('/:id', (req, res, next) => {
    const resumeId = req.params.id
    const {
        cryptoId,
        balance,
        averagePrice
    } = req.body
    model.CryptoResume.update({
        cryptoId: cryptoId,
        balance: balance,
        averagePrice: averagePrice
    }, {
        where: {
            id: resumeId
        }
    })
    .then(_ => res.status(201).json({
        error: false,
        message: 'Resumo alterado'
    }))
    .catch(error => res.json({
        error: true,
        error: error
    }))
})

router.get('/:id', (req, res, next) => {
    const cryptoId = req.params.id
    model.CryptoResume.findByPk(cryptoId)
    .then(CryptoResume => res.json ({
        error: false,
        data: CryptoResume
    }))
    .catch(error => res.json ({
        error: true,
        error: error
    }))
})

module.exports = router