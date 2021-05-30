var express = require('express')
var router = express.Router()

var model = require('../models/index')

const calculaDeposito = async (cryptoId) => {
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
            await model.Withdrawals.findAll({
                where: {
                    cryptoId
                }
            })
            .then(async withdrawals => {
                let sumTotalPrice = 0, sumDepositAmount = 0, sumRewardsAmount = 0, sumWithdrawalAmount = 0
                for(i = 0; i < deposits.length; i++) {
                    sumTotalPrice += deposits[i].totalPrice
                }
                for(i = 0; i < deposits.length; i++) {
                    sumDepositAmount += deposits[i].amount
                }
                for(i = 0; i < rewards.length; i++) {
                    sumRewardsAmount += rewards[i].amount
                }
                for(i = 0; i < withdrawals.length; i++) {
                    sumWithdrawalAmount += withdrawals[i].amount
                }
                await model.CryptoResume.update({
                    cryptoId: cryptoId,
                    balance: (sumRewardsAmount + sumDepositAmount - sumWithdrawalAmount),
                    averagePrice: sumDepositAmount == 0 ? 0 : sumTotalPrice / (sumRewardsAmount + sumDepositAmount - sumWithdrawalAmount)
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
    })  
    .catch(error => {
        return error
    })  
} 

router.post('/', async (req, res, _) => {
    const {
        cryptoId,
        amount,
        price,
        depositDate
    } = req.body
    await model.Deposits.create({
        cryptoId: cryptoId,
        amount: amount,
        price: price,
        totalPrice: amount * price,
        depositDate: depositDate
    })
    .then(async deposit => {
        const retorno = await calculaDeposito(cryptoId)
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
    model.Deposits.findByPk(id)
    .then(deposit => 
        model.Deposits.destroy({
            where: {
                id: id
            }
        })
        .then(async _ => {
            const retorno = await calculaDeposito(deposit.cryptoId)
            res.status(201).json({
                error: retorno ? true : retorno,
                message: retorno ? 'Aconteceu um erro' : 'Resumo alterado'
            })
        })
        .catch(error => res.json ({
            error: true,
            error: error
        }))
    )
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
        price,
        depositDate
    } = req.body
    model.Deposits.update({
        cryptoId: cryptoId,
        amount: amount,
        price: price,
        totalPrice: amount * price,
        depositDate: depositDate
    }, {
        where: {
            id: id
        }
    })
    .then(async _ => {
        const retorno = await calculaDeposito(cryptoId)
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

router.get('/', (_, res, next) => {
    model.Deposits.findAll({
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

module.exports = router
