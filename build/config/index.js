"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    JWT_SECRET: 'p4sta.w1th-b0logn3s3-s@uce',
    JWT_ALGO: 'HS256',
    port: 3000,
    LOG_LEVEL: 'debug',
    jwtSecret: 'p4sta.w1th-b0logn3s3-s@uce',
    jwtAlgorithm: 'HS256',
    logs: {
        level: 'silly',
    },
    // api config
    api: {
        prefix: '/api',
    },
    // CREATE USER hwy WITH PASSWORD 'pgtest';
    // CREATE DATABASE seatmanager;
    // GRANT ALL PRIVILEGES ON DATABASE seatmanager TO 'hwy';
    // curl -sL https://deb.nodesource.com/setup_14.x -o node source_setup.sh
    // scp -r build/* root@165.22.99.27:~/app/
    //Postgrpsql Local DB config
    HOST: "localhost",
    USER: "hwy",
    PASSWORD: "pgtest",
    DB: "seatmanager",
    dialect: "postgresql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
    // HOST: "ts-db-hwy.database.windows.net",
    // USER: "htoowaiyan",
    // PASSWORD: "p@s2w0Rd",
    // DB: "heingp",
    // dialect: "mssql",
    // pool: {
    //   max: 5,
    //   min: 0,
    //   acquire: 30000,
    //   idle: 10000,
    // }
    // 
    // // Driver={ODBC Driver 13 for SQL Server};
    // Server=tcp:tastytest.database.windows.net,1433;
    // Database=heingp;
    // Uid=htoowaiyan;
    // Pwd={your_password_here};
    // Encrypt=yes;
    // TrustServerCertificate=no;
    // Connection Timeout=30;
};
