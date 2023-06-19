const {Pool} = require('pg');
const http = require('http');
// const pieChartController = require('./controller/pieChartController');
const handleApiRequest = require("./controller/controller");

const pool = new Pool({
    user: 'postgres',
    host: 'bdd-solutions.ci7zeff9myeo.eu-central-1.rds.amazonaws.com',
    database: 'bddsolutions',
    password: 'postgres',
    port: 5432, // Default PostgreSQL port
    max: 20, // Maximum number of connections in the pool
    idleTimreoutMillis: 30000, // Time Waiting for pgAin milliseconds a connection can remain idle before being closed
    connectionTimeoutMillis: 2000 // Time in milliseconds to wait while establishing a new connection
});

const execute = async (query) => {
    try {
        const client = await pool.connect();
        await client.query(query);
        client.release();
        return true;

    } catch (error) {
        console.error(error.stack);
        return false;
    }

};

const text = `
    CREATE TABLE IF NOT EXISTS "users"
    (
        "id"          SERIAL PRIMARY KEY,
        "username"    VARCHAR(255) NOT NULL,
        "firstname"   VARCHAR(255) NOT NULL,
        "lastname"    VARCHAR(255) NOT NULL,
        "email"       VARCHAR(255) NOT NULL,
        "password"    VARCHAR(255) NOT NULL,
        "role"        VARCHAR(255) NOT NULL,
        "birthdate"   DATE         NOT NULL,
        "phonenumber" VARCHAR(255) NOT NULL
    );`;

execute(text).then(result => {
    if (result) {
        console.log('Table created');
    }
});

module.exports = pool;


const server = http.createServer(async (req, res) => {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.url.startsWith('/api')) {
        await handleApiRequest(req, res, pool);
    }
        // } else
        // if (req.url === '/terrorism-data' && req.method === 'GET') {
        //     try {
        //         const client = await pool.connect();
        //         const result = await client.query('SELECT * FROM terrorism_data');
        //         const users = result.rows;
        //         client.release();
        //         res.writeHead(200, {'Content-Type': 'application/json'});
        //         res.end(JSON.stringify(users));
        //     } catch (error) {
        //         console.error('Error executing query', error);
        //         res.writeHead(500, {'Content-Type': 'text/plain'});
        //         res.end('Internal server error');
        //     } finally {
        //         pool.end();
        //     }
        // } else if (req.url === '/api/countAttackTypes' && req.method === 'GET') {
        //     pieChartController.getCountAttackTypes(req, res, pool);
        // } else if (req.url === '/api/pie/country' && req.method === 'GET') {
        //     const country = 'country';
        //     pieChartController.getCountCountry(req, res, pool, country);
        // } else if (req.url === '/api/pie/region' && req.method === 'GET') {
        //     const region = 'region';
        //     pieChartController.getCountCountry(req, res, pool, region);
        // } else if (req.url === '/api/pie/target' && req.method === 'GET') {
        //     const target = 'target';
        //     pieChartController.getCountCountry(req, res, pool, target);
        // } else if (req.url === '/api/pie/group_name' && req.method === 'GET') {
        //     const group_name = 'group_name';
        //     pieChartController.getCountCountry(req, res, pool, group_name);
        // } else if (req.url === '/api/pie/weapon_type' && req.method === 'GET') {
        //     const weapon_type = 'weapon_type';
        //     pieChartController.getCountCountry(req, res, pool, weapon_type);
        // } else if (req.url === '/api/pie/weapon_subtype' && req.method === 'GET') {
        //     const weapon_subtype = 'weapon_subtype';
        //     pieChartController.getCountCountry(req, res, pool, weapon_subtype);
        // } else if (req.url === '/api/pie/nkill' && req.method === 'GET') {
        //     const nkill = 'nkill';
        //     pieChartController.getCountCountry(req, res, pool, nkill);
        // } else if (req.url === '/api/pie/nkill_us' && req.method === 'GET') {
        //     const nkill_us = 'nkill_us';
        //     pieChartController.getCountCountry(req, res, pool, nkill_us);
    // }
    else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not found');

    }
});

const port = 3000;
// Choose the port number you want to use
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
//
// //-------------------------------------------------------------------------------------------
//
// function insertRowIntoTest(name) {
//     const insertQuery = `
//         INSERT INTO test (name)
//         VALUES ($1)
//     `;
//
//     const values = [name];
//
//     pool.query(insertQuery, values, (err, res) => {
//         if (err) {
//             console.error('Error inserting data:', err);
//         } else {
//             console.log('Data inserted successfully');
//         }
//
//         // Close the database connection
//     });
// }
//
// function insertRowIntoTerrorismTable(summary, country, region, attack_type, target, group_name, weapon_type, weapon_subtype, nkill, nkillus) {
//     const insertQuery = `INSERT INTO terrorism_data (summary, country, region, attack_type, target, group_name, weapon_type,
//                                     weapon_subtype, nkill, nkill_us)
//         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
//
//     const values = [summary, country, region, attack_type, target, group_name, weapon_type, weapon_subtype, nkill, nkillus];
//
//     pool.query(insertQuery, values, (err, res) => {
//         if (err) {
//             console.error('Error inserting data:', err);
//         } else {
//             console.log('Data inserted successfully');
//         }
//
//         // Close the database connection
//     });
// }
//
// module.exports = {
//     insertRowIntoTerrorismTable: insertRowIntoTerrorismTable
// };

