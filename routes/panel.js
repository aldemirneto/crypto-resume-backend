const express = require('express')
const router = express.Router()
const axios = require('axios').default

const key = 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c'
//const key = '19073ad3-6a3f-4b6d-9cf0-e143e211b1d5'

const Url = 'https://sandbox-api.coinmarketcap.com'
//const Url = 'https://pro-api.coinmarketcap.com'

const model = require('../models/index')

router.get('/', async (req, res, _) => {
    await model.Crypto.findAll({
        include: 'cryptoResume'
    })
    .then(async crypto => {
        const symbols = crypto.map(obj => {
            return obj.dataValues.symbol
        }).join()
        await axios.get(`${Url}/v1/cryptocurrency/quotes/latest`,{
            headers: {
                'X-CMC_PRO_API_KEY': key
            }
            ,params: {
                symbol : symbols
            }
        })
        .then(cotacoes => {
            const removeDataValues = crypto.map(obj => {return obj.dataValues})
            const objetoTratado = removeDataValues.map(obj => {
                obj.balance = obj.cryptoResume.dataValues.balance
                obj.averagePrice = obj.cryptoResume.dataValues.averagePrice
                delete obj.cryptoResume
                obj.custoTotal = obj.balance * obj.averagePrice
                obj.cotacaoAtual = cotacoes.data.data[obj.symbol].quote['USD'].price
                obj.valorAtivo = obj.balance * obj.cotacaoAtual
                obj.lucro = obj.valorAtivo - obj.custoTotal
                obj.valorizacao = ((obj.valorAtivo / obj.custoTotal) - 1) * 100
                return obj
            })
            res.json(objetoTratado)
        })
        .catch(error => res.json(error))
    })
    .catch(error => res.json(error))
})

module.exports = router