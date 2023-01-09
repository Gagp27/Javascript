import sequelize, {DataTypes} from "sequelize";
import {database} from "../database/database.js";

const Task = database.define("Task", {
    taskId: {
		type: DataTypes.BIGINT,
		autoIncrement: true,
		primaryKey: true
	},

	taskName: {
        type: sequelize.STRING,
		allowNull: false,
		notEmpty: true,
    },

    state: {
        type: sequelize.BOOLEAN,
        defaultValue: false
    },

    projectId: {
        type: sequelize.STRING
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
		tableName: "tasks",
		underscored: true,
		timestamps: true,
		createdAt: true,
		updatedAt: true
	}
);


export default Task;
