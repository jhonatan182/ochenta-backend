const sqlite3 = require('sqlite3');

module.exports = class Connection {
    static db = null;
    static async getDB() {
        if (this.db === null) {
            this.db = new sqlite3.Database(
                `./data/${process.env.SQLITE_DB}`,
                (err) => {
                    if (err) {
                        console.error('Connection Error:', err);
                        return Promise.reject(err);
                    }
                    return Promise.resolve(this.db);
                }
            );
            console.log('Connection SQLITE: ', 'Creando Conexión');
        } else {
            console.log('Connection SQLITE: ', 'Usando Conexión Cacheada');
        }
        return Promise.resolve(this.db);
    }
};
