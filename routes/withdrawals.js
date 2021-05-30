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
            await model.Withdrawals.findAll({
                where: {
                    cryptoId
                }
            })
            .then(async withdrawals => {
                let sumDepositAmount = 0, sumRewardsAmount = 0, sumWithdrawalAmount = 0
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
            const retorno = await calculaBalance(withdraw.cryptoId)
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

router.get('/', (_, res, next) => {
    model.Withdrawals.findAll({
        include: 'crypto'
    })
    .then(Withdrawals => {
        const removeDataValues = Withdrawals.map(obj => {return obj.dataValues})
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