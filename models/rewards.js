'use strict'
module.exports = (sequelize, DataTypes) => {
    const Rewards = sequelize.define('Rewards', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cryptoId: DataTypes.INTEGER,
        amount: DataTypes.FLOAT,
        rewardDate: DataTypes.DATE
    }, {
        timestamps: false,
        freezeTableName: true
    })
    Rewards.associate = (models) => {
        Rewards.belongsTo(models.Crypto, {
            foreignKey: 'cryptoId',
            as: 'crypto'
        })
    }
    return Rewards
}