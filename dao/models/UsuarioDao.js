const { db } = require('../Connection');
const DaoObject = require('../DaoObject');
module.exports = class UsuarioDao extends DaoObject{
  constructor(db = null){
    console.log('UsuarioDao db: ', db);
    super(db);
  }
  setup(){
    if (process.env.SQLITE_SETUP) {
      const createStatement = 'CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, estado TEXT, password TEXT, nombre TEXT , avatar TEXT, fchaIngreso TEXT);';
      this.conn.run(createStatement);
    }
  }

  getAll(){
    return this.all(
      'SELECT * from usuarios;', []
    );
  }

  getById( {codigo} ){
    const sqlstr= 'SELECT * from usuarios where id=?;';
    const sqlParamArr = [codigo];
    return this.get(sqlstr, sqlParamArr);
  }

  insertOne({email, password, nombre, avatar, estado}) {
    
    const fchaIngreso = new Date().toISOString()
    const sqlstr = 'INSERT INTO usuarios (email, password, nombre, avatar, estado ,fchaIngreso) values (?, ?, ?, ?, ?, ?);';
    const sqlParamArr = [email, password, nombre, avatar, estado ,fchaIngreso];
    return this.run(sqlstr, sqlParamArr);
  }

  updateOne({codigo, email, password, nombre, avatar, estado}){
    const sqlstr= 'UPDATE usuarios set email = ?, password = ?, nombre = ?, avatar = ? , estado = ? where id = ?;';
    const sqlParamArr = [email, password, nombre, avatar, estado, codigo];
    return this.run(sqlstr, sqlParamArr);
  }

  deleteOne({ codigo }) {
    const sqlstr = 'DELETE FROM usuarios where id = ?;';
    const sqlParamArr = [codigo];
    return this.run(sqlstr, sqlParamArr);
  }

}
