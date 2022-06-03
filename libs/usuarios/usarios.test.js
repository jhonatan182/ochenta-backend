const Usuario = require('./index');
const Conexion = require('../../dao/Connection');
const UsariosDao = require('../../dao/models/UsuarioDao');
const fs = require('fs');

describe('Testing Usuarios CRUD' , () => {

    const env = process.env;
    let db , UserDao , Usr;

    //dado que .... al ejecutar | procesar | activar ... se espera que ...

    beforeAll( async () => {

        jest.resetModules();

        process.env = {
            ...env,
            SQLITE_DB : 'ochentaapp_user_test.db',
            SQLITE_SETUP: 1
        }

        db = await Conexion.getDB();
        UserDao = new UsariosDao(db)
        Usr = new Usuario(UserDao)

        await Usr.init();

        await Usr.addUsuarios({
            email: 'test@test1.com',
            nombre :'Test 1',
            avatar : 'Test Avatar',
            password: '123456',
            estado: 'ACT'
        })

        await Usr.addUsuarios({
            email: 'test@test2.com',
            nombre :'Test 2',
            avatar : 'Test Avatar 2',
            password: '123456',
            estado: 'ACT'
        })

        await Usr.addUsuarios({
            email: 'test@test3.com',
            nombre :'Test 3',
            avatar : 'Test Avatar 3',
            password: '123456',
            estado: 'ACT'
        });

        return true
    });


    afterAll( async () => {

        
        fs.unlinkSync(`data/${process.env.SQLITE_DB}`);
        process.env = env;
        
        return true

    });

    test('Usuarios insertOne', async () => { 
        const result = await Usr.addUsuarios({
            email: 'test@test3.com',
            nombre :'Test 3',
            avatar : 'Test Avatar 3',
            password: '123456',
            estado: 'ACT'
        })

        expect(result.id).toBeGreaterThanOrEqual(1);
     })


     test('Usuarios getAll', async () => { 
        const result = await Usr.getUsuarios()

        expect(result.length).toBeGreaterThanOrEqual(1);
     })
});