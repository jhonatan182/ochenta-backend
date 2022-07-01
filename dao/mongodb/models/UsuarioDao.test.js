const path = require('path');
const dotenv = require('dotenv');
const UsuarioDao = require('./UsuarioDao');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const Connection = require('../Connection');
const { hasUncaughtExceptionCaptureCallback } = require('process');

describe('Testing Usuarios Crud in MongoDB', () => {
    const env = process.env;
    let db, UserDao, User, id;

    beforeAll(async () => {
        jest.resetModules();
        process.env = {
            ...env,
            MONGODB_URI: '',
            MONGODB_DB: 'sw202202_test',
            MONGODB_SETUP: 1,
        };
        db = await Connection.getDB();
        UserDao = new UsuarioDao(db, 'usuarios');
        await UserDao.init();
        return true;
    });

    afterAll(async () => {
        process.env = env;
        return true;
    });

    test('Get All Records', async () => {
        const result = await UserDao.getAll();
        console.log(result);
    });

    test('Insert One Record', async () => {
        const result = await UserDao.insertOne({
            email: 'test3@prueba.com',
            nombre: 'Test 3',
            avatar: 'testAvatar3',
            password: 'nondisclose3',
            estado: 'ACT',
        });
        console.log(result);
        id = result.insertedId;
        expect(result.acknowledged).toBe(true);
    });

    test('FindById Record', async () => {
        const record = await UserDao.getById({ codigo: id.toString() });
        console.log(record);
        expect(record._id).toStrictEqual(id);
    });

    test('Update One Record', async () => {
        const updateResult = await UserDao.updateOne({
            codigo: id.toString(),
            email: 'test2_2@prueba.com',
            nombre: 'Test 2 UPD',
            avatar: 'testAvatar2_2',
            password: 'nondisclose2_2',
            estado: 'INA',
        });
        console.log(updateResult);
        expect(updateResult.acknowledged).toBe(true);
    });

    test('Delete One Record', async () => {
        const deleteResult = await UserDao.deleteOne({ codigo: id.toString() });
        console.log(deleteResult);
        expect(deleteResult.acknowledged).toBe(true);
    });
});
