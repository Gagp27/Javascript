import { Sequelize } from "sequelize";

export const database = new Sequelize(
    process.env.MYSQL_DB_NAME,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASS,
    {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        dialect: "mysql",
        define: {
            timestamps: false
        }
    }
)

export const connection = async () => {
    try {
        await database.authenticate();
        console.log("Database connected");

    } catch (error) {
        console.log(error);
        console.log("Can't connect the database");
    }
}
