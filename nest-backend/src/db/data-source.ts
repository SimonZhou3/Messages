import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    port: parseInt(process.env.POSTGRES_LOCALHOST),
    host: 'localhost',
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/db/migrations/*.js'],
    synchronize: false,
    migrationsRun: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;