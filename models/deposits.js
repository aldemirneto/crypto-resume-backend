'use strict'
module.exports = (sequelize, DataTypes) => {
    const Deposits = sequelize.define('Deposits', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cryptoId: DataTypes.INTEGER,
        amount: DataTypes.FLOAT,
        price: DataTypes.FLOAT,
        depositDate: DataTypes.DATE
    }, {
        timestamps: false,
        freezeTableName: true
    })
    Deposits.associate = (models) => {
        Deposits.belongsTo(models.Crypto, {
            foreignKey: 'cryptoId',
            as: 'crypto'
        })
    }
    return Deposits
}