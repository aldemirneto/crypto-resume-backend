'use strict'
module.exports = (sequelize, DataTypes) => {
    const CryptoResume = sequelize.define('CryptoResume', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cryptoId: DataTypes.INTEGER,
        balance: DataTypes.FLOAT,
        averagePrice: DataTypes.FLOAT
    }, {
        timestamps: false,
        freezeTableName: true
    })
    CryptoResume.associate = (models) => {
        CryptoResume.belongsTo(models.Crypto, {
            foreignKey: 'cryptoId',
            as: 'crypto'
        })
    }
    return CryptoResume
}