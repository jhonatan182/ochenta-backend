const DaoObject = require('../../dao/DaoObject');
module.exports = class Gastos {
  gastoDao = null;

  constructor ( gastoDao = null) {
    if (!(gastoDao instanceof DaoObject)) {
     throw new Error('An Instance of DAO Object is Required');
    }
    this.gastoDao = gastoDao;
  }
  async init(){
    await this.gastoDao.init();
    this.gastoDao.setup();
  }

  async getVersion () {
    return {
      entity: 'Gastos',
      version: '1.0.0',
      description: 'CRUD de GASTOS'
    };
  }

  async addGastos ({
      type,
      description,
      amount,
      category,
  }) {
    const result =  await this.gastoDao.insertOne(
      {
        type,
        description,
        amount,
        category,
      }
    );
    return {
        type,
        description,
        amount,
        category, 
        id: result.lastID
    };
  };

  async getGastos () {
    return this.gastoDao.getAll();
  }

  async getGastoById ({ codigo }) {
    return this.gastoDao.getById({codigo});
  }

  async updateGasto ({ type ,description ,amount ,category, codigo}) {
    const result = await this.gastoDao.updateOne({type ,description ,amount ,category, codigo});
    return {
        type,
        description,
        amount,
        category, 
        codigo,
        modified: result.changes
    }
  }

  async deleteGasto({ codigo }) {
    const gastoToDelete = await this.gastoDao.getById({codigo});
    const result = await this.gastoDao.deleteOne({ codigo });
    return {
      ...gastoToDelete,
      deleted: result.changes
    };
  }
}
