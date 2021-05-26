'use strict'
module.exports = (sequelize, DataTypes) => {
    const Withdrawals = sequelize.define('Withdrawals', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cryptoId: DataTypes.INTEGER,
        amount: DataTypes.FLOAT,
        withdrawDate: DataTypes.DATE
    }, {
        timestamps: false,
        freezeTableName: true
    })
    Withdrawals.associate = (models) => {
        Withdrawals.belongsTo(models.Crypto, {
            foreignKey: 'cryptoId',
            as: 'crypto'
        })
    }
    return Withdrawals
}