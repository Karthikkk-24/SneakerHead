import mysql from 'mysql2/promise';

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sneakerhead_db',
};

const pool = mysql.createPool(dbConfig);

export const query = (sql, values) => {
    return pool.query(sql, values);
};

export default pool;
