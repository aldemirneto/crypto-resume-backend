const express = require('express')
const router = express.Router()
const coinGecko = require('coingecko-api')

const model = require('../models/index')
const coinGeckoClient = new coinGecko()

function findCotacaoBySymbol (cotacao) {
    if(cotacao.symbol == this) {
        return cotacao
    }
}

function round(num) {
    return +(Math.round(num + 'e+2')  + 'e-2');
}

router.get('/', async (req, res, _) => {
    await model.Crypto.findAll({
        include: 'cryptoResume'
    })
    .then(async crypto => {
        const symbols = crypto.map(obj => {
            return obj.dataValues.description.toLowerCase().replace(' ', '-')
        }).join()
        const cotacao = await coinGeckoClient.coins.markets({
            ids: symbols
        })
        const cotacaoData = cotacao.data
        const removeDataValues = crypto.map(obj => {return obj.dataValues})
        const objetoTratado = removeDataValues.map(obj => {
            obj.balance = obj.cryptoResume.dataValues.balance
            obj.averagePrice = obj.cryptoResume.dataValues.averagePrice
            delete obj.cryptoResume
            obj.custoTotal = obj.balance * obj.averagePrice
            const findCrypto = cotacaoData.find(findCotacaoBySymbol, obj.symbol.toLowerCase())
            obj.cotacaoAtual = findCrypto.current_price
            obj.valorAtivo = obj.balance * obj.cotacaoAtual
            obj.lucro = round(obj.valorAtivo - obj.custoTotal).toFixed(2).toString().replace('.', ',')
            obj.valorizacao = obj.balance == 0 ? round(0).toFixed(2).toString().replace('.', ',') : round(((obj.valorAtivo / obj.custoTotal) - 1) * 100).toFixed(2).toString().replace('.', ',')
            obj.logo = findCrypto.image
            obj.averagePrice = round(obj.averagePrice).toFixed(2).toString().replace('.', ',')
            obj.cotacaoAtual = round(obj.cotacaoAtual).toFixed(2).toString().replace('.', ',')
            obj.custoTotal = round(obj.custoTotal).toFixed(2).toString().replace('.', ',')
            obj.valorAtivo = round(obj.valorAtivo).toFixed(2).toString().replace('.', ',')
            return obj
        })
        res.json(objetoTratado)
    })
    .catch(error => res.json(error))
})

router.get('/resume', async (req, res, _) => {
    await model.Crypto.findAll({
        include: 'cryptoResume'
    })
    .then(async crypto => {
        const symbols = crypto.map(obj => {
            return obj.dataValues.description.toLowerCase().replace(' ', '-')
        }).join()
        const cotacao = await coinGeckoClient.coins.markets({
            ids: symbols
        })
        const cotacaoData = cotacao.data
        const removeDataValues = crypto.map(obj => {return obj.dataValues})
        const objetoTratado = removeDataValues.map(obj => {
            obj.balance = obj.cryptoResume.dataValues.balance
            obj.averagePrice = obj.cryptoResume.dataValues.averagePrice
            delete obj.cryptoResume
            obj.custoTotal = obj.balance * obj.averagePrice
            const findCrypto = cotacaoData.find(findCotacaoBySymbol, obj.symbol.toLowerCase())
            obj.cotacaoAtual = findCrypto.current_price
            obj.valorTotal = obj.balance * obj.cotacaoAtual
            return obj
        })
        let sumCusto = 0, sumValor = 0
        for(i = 0; i < objetoTratado.length; i++) {
            sumCusto += objetoTratado[i].custoTotal
        }
        for(i = 0; i < objetoTratado.length; i++) {
            sumValor += objetoTratado[i].valorTotal
        }
        const retorno = {
            Balance: round(sumValor).toFixed(2).toString().replace('.',','),
            Spend: round(sumCusto).toFixed(2).toString().replace('.',','),
            Profit: round(sumValor - sumCusto).toFixed(2).toString().replace('.',','),
            Valuable: round(((sumValor / sumCusto) - 1) * 100).toFixed(2).toString().replace('.', ',')
        }
        res.json(retorno)
    })
    .catch(error => res.json(error))
})

module.exports = router