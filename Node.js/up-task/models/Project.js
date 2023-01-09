import { DataTypes } from "sequelize";
import { database } from "../database/database.js";


const Project = database.define("Project", {
    projectId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },

    projectName: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
    },

    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
    },

    userId: {
        type: DataTypes.BIGINT,
    },

    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    updatedAt: {
        type: DataTypes.DATE,
    }
},
    {
        tableName: "projects",
        underscored: true,
        timestamps: true,
        createdAt: true,
        updatedAt: true
    }
);

export default Project;
