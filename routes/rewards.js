var express = require('express')
var router = express.Router()

var model = require('../models/index')

const calculaBalance = async (cryptoId) => {
    await model.Deposits.findAll({
        where: {
            cryptoId: cryptoId
        }
    })
    .then(async deposits => {
        await model.Rewards.findAll({
            where: {
                cryptoId
            }
        })
        .then(async rewards => {
            let sumTotalPrice = 0, sumDepositAmount = 0, sumRewardsAmount = 0
            for(i = 0; i < deposits.length; i++) {
                sumTotalPrice += deposits[i].totalPrice
            }
            for(i = 0; i < deposits.length; i++) {
                sumDepositAmount += deposits[i].amount
            }
            for(i = 0; i < rewards.length; i++) {
                sumRewardsAmount += rewards[i].amount
            }
            await model.CryptoResume.update({
                cryptoId: cryptoId,
                balance: (sumRewardsAmount + sumDepositAmount),
                averagePrice: sumDepositAmount == 0 ? 0 : sumTotalPrice / (sumRewardsAmount + sumDepositAmount)
            }, {
                where: {
                    cryptoId: cryptoId
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
    })  
    .catch(error => {
        return error
    })  
} 

router.get('/', (req, res, next) => {
    model.Rewards.findAll({
        include: 'crypto'
    })
    .then(deposits => {
        const removeDataValues = deposits.map(obj => {return obj.dataValues})
        const objetoTratado = removeDataValues.map(obj => {
            obj.symbol = obj.crypto.dataValues.symbol
            delete obj.crypto
            return obj
        })
        res.json (objetoTratado)
    })
    .catch(error => res.json ({
        error: true,
        data: [],
        error: error
    }))
})

router.post('/', (req, res, next) => {
    const {
        cryptoId,
        amount,
        rewardDate
    } = req.body
    model.Rewards.create({
        cryptoId,
        amount,
        rewardDate
    })
    .then(async _ => {
        const retorno = await calculaBalance(cryptoId)
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

router.delete('/:id', (req, res, next) => {
    const id = req.params.id
    model.Rewards.findByPk(id)
    .then(reward => {
        model.Rewards.destroy({
            where: {
                id
            }
        })
        .then(async _ => {
            const retorno = await calculaBalance(reward.cryptoId)
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

router.put('/:id', (req,res, _) => {
    const id = req.params.id
    const {
        cryptoId,
        amount,
        rewardDate
    } = req.body
    model.Rewards.update({
        cryptoId: cryptoId,
        amount: amount,
        rewardDate: rewardDate
    }, {
        where: {
            id: id
        }
    })
    .then(async _ => {
        const retorno = await calculaBalance(cryptoId)
        res.status(201).json({
            error: retorno ? true : retorno,
            message: retorno ? 'Aconteceu um erro' : 'Resumo alterado'
        })
    })
    .catch(error => res.json({
        error: true,
        error: error
    }))
})

module.exports = router