'use strict'
module.exports = (sequelize, DataTypes) => {
    const WithDrawals = sequelize.define('WithDrawals', {
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
    WithDrawals.associate = (models) => {
        WithDrawals.belongsTo(models.Crypto, {
            foreignKey: 'cryptoId',
            as: 'crypto'
        })
    }
    return WithDrawals
}