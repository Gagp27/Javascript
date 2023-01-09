import { DataTypes } from "sequelize";

import { database } from "../database/database.js";
const User = database.define("User", {
    userId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
    },

    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        defaultValue: null
    },

    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        defaultValue: null
    },

    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        defaultValue: null
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        notEmpty: true,
        isEmail: true,
        defaultValue: null
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        minLength: 8,
        defaultValue: null
    },

    token: {
        type: DataTypes.STRING,
        defaultValue: null
    },

    confirm: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },

    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: null
    },

    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: null
    }
},
{
    tableName: "users",
    underscored: true,
    timestamps: true,
    createdAt: true,
    updatedAt: true
});

export default User;
