const { db } = require('../Connection');
const DaoObject = require('../DaoObject');
module.exports = class GastosDao extends DaoObject{
  constructor(db = null){
    console.log('GastosDao db: ', db);
    super(db);
  }
  setup(){
    if (process.env.SQLITE_SETUP) {
      const createStatement = 'CREATE TABLE IF NOT EXISTS gastos (id INTEGER PRIMARY KEY AUTOINCREMENT,  type TEXT, description TEXT, date TEXT, amount DECIMAL(10,5) , category TEXT);';
      this.conn.run(createStatement);
    }
  }

  getAll(){
    return this.all(
      'SELECT * from gastos;', []
    );
  }

  getById( {codigo} ){
    const sqlstr= 'SELECT * from gastos where id=?;';
    const sqlParamArr = [codigo];
    return this.get(sqlstr, sqlParamArr);
  }

  insertOne({type ,description ,amount ,category }) {

    const date = new Date().toISOString()
    const sqlstr = 'INSERT INTO gastos (type ,description, date ,amount ,category) values (?, ?,?,?,?);';
    const sqlParamArr = [type ,description,date,amount ,category ];
    return this.run(sqlstr, sqlParamArr);
  }

  updateOne({type ,description ,amount ,category, codigo}){
    const sqlstr= 'UPDATE gastos set type = ?, description = ?, amount = ?, category = ? where id = ?;';
    const sqlParamArr = [type ,description ,amount ,category, codigo];
    return this.run(sqlstr, sqlParamArr);
  }

  deleteOne({ codigo }) {
    const sqlstr = 'DELETE FROM gastos where id = ?;';
    const sqlParamArr = [codigo];
    return this.run(sqlstr, sqlParamArr);
  }

}
