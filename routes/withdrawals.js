var express = require('express')
var router = express.Router()

var model = require('../models/index')

const calculaBalance = async (cryptoId, amount) => {
    await model.CryptoResume.findOne({
        where: {
            cryptoId
        }
    })
    .then(async resume => {
        const newBalance = resume.balance - amount
        await model.CryptoResume.update({
            balance: newBalance
        }, {
            where: {
                cryptoId
            }
        })
        .then(_ => {
            return false
        })
        .catch(error => {
            return error
        })
    })
    .catch(error => {
        return error
    }) 
}

router.post('/', (req, res, _) => {
    const {
        cryptoId,
        amount,
        withdrawDate
    } = req.body
    model.Withdrawals.create({
        cryptoId,
        amount,
        withdrawDate
    })
    .then(async _ => {
        const retorno = await calculaBalance(cryptoId, amount)
        res.status(201).json({
            error: retorno ? true : retorno,
            message: retorno ? 'Aconteceu um erro' : 'Resumo alterado'
        })
    })
    .catch(error => res.json ({
        error: true,
        error: error
    }))
})

router.delete('/:id', (req, res, _) => {
    const id = req.params.id
    model.Withdrawals.findByPk(id)
    .then(withdraw => {
        model.Withdrawals.destroy({
            where: {
                id
            }
        })
        .then(async _ => {
            const retorno = await calculaBalance(withdraw.cryptoId, (withdraw.amount * -1))
            res.status(201).json({
                error: retorno ? true : retorno,
                message: retorno ? 'Aconteceu um erro' : 'Resumo alterado'
            })
        })
        .catch(error => res.json ({
            error: true,
            error: error
        }))
    })
    .catch(error => res.json ({
        error: true,
        error: error
    }))
})

module.exports = router