import {createPool} from "mysql2/promise";

const pool = createPool({
    host : 'database-2.cqdhewc2xpoq.us-east-1.rds.amazonaws.com',
    port :  '3306',
    user: 'root',
    password: 'Dosmil23',
    database: 'mensajerosDB'
});

export default pool;