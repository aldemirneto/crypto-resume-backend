'use strict'
module.exports = (sequelize, DataTypes) => {
    const Crypto = sequelize.define('Crypto', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        description: DataTypes.STRING,
        symbol: DataTypes.STRING
    }, {
        timestamps: false,
        freezeTableName: true
    })
    Crypto.associate = (models) => {
        Crypto.hasOne(models.CryptoResume, {
            as: 'cryptoResume'
        })
        //Crypto.hasMany(models.Deposits)
        //Crypto.hasMany(models.Withdrawals)
    }
    return Crypto
}