const express = require('express');
const router = express.Router();
const Gasto = require('../../../../libs/gastos');
const GastoDao = require('../../../../dao/models/GastosDao');
const gastoDao = new GastoDao();
const gasto = new Gasto(gastoDao);
gasto.init();

router.get('/', async (req, res) => {
  // extraer y validar datos del request
  try {
    // devolver la ejecución el controlador de esta ruta
    const versionData = await gasto.getVersion();
    return res.status(200).json(versionData);
  } catch ( ex ) {
    // manejar el error que pueda tirar el controlador
    console.error('Error Gasto', ex);
    return res.status(502).json({'error': 'Error Interno de Server'});
  }
}); // get /

router.get('/all', async (req, res) => {
  try {
    const gastos = await gasto.getGastos();
    return res.status(200).json(gastos);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({error:'Error al procesar solicitud.'});
  }
});

router.get('/byid/:codigo', async (req, res) => {
  try {
    const {codigo} = req.params;
    if (!(/^\d+$/.test(codigo))){
      return res.status(400).json({
        error: 'Se espera un codigo numérico'
      });
    }
    const registro = await gasto.getUsuarioById({codigo: parseInt(codigo)});
    return res.status(200).json(registro);
  } catch (ex) {
    console.error(ex);
    return res.status(501).json({ error: 'Error al procesar solicitud.' });
  }
} );

router.post('/new', async (req, res) => {
  try {
    const {type = '', description= '', amount= '', category= ''} = req.body;

    if (/^\s*$/.test(type)) {
      return res.status(400).json({
        error: 'Se espera valor de type'
      });
    }

    if (/^\s*$/.test(description)) {
        return res.status(400).json({
          error: 'Se espera valor de description'
        });
    }

    if (/^\s*$/.test(amount)) {
        return res.status(400).json({
          error: 'Se espera valor de amount'
        });
    }

    if (/^\s*$/.test(category)) {
        return res.status(400).json({
          error: 'Se espera valor de category'
        });
    }

    if (!(/^(INCOME)|(EXPENSES)$/.test(type))) {
      return res.status(400).json({
        error: 'Se espera valor de estado en INCOME o EXPENSES'
      });
    }
    const newGasto = await gasto.addGastos({type, description, amount, category});
    return res.status(200).json(newGasto);
  } catch(ex){
    console.error(ex);
    return res.status(502).json({error:'Error al procesar solicitud'});
  }
});

router.put('/update/:codigo', async (req, res)=>{
  try {
    const {codigo} = req.params;
    if(!(/^\d+$/.test(codigo))) {
      return res.status(400).json({error:'El codigo debe ser un dígito válido.'});
    }
    const {type = '', description= '', amount= '', category= ''} = req.body;

    if (/^\s*$/.test(type)) {
        return res.status(400).json({
          error: 'Se espera valor de type'
        });
      }
  
      if (/^\s*$/.test(description)) {
          return res.status(400).json({
            error: 'Se espera valor de description'
          });
      }
  
      if (/^\s*$/.test(amount)) {
          return res.status(400).json({
            error: 'Se espera valor de amount'
          });
      }
  
      if (/^\s*$/.test(category)) {
          return res.status(400).json({
            error: 'Se espera valor de category'
          });
      }
  
      if (!(/^(INCOME)|(EXPENSES)$/.test(type))) {
        return res.status(400).json({
          error: 'Se espera valor de estado en INCOME o EXPENSES'
        });
      }

    const updateResult = await gasto.updateGasto({codigo:parseInt(codigo),type, description, amount, category});

    if (!updateResult) {
      return res.status(404).json({error:'GASTO no encontrado.'});
    }
    return res.status(200).json({updateGasto:updateResult});

  } catch(ex) {
    console.error(ex);
    res.status(500).json({error: 'Error al procesar solicitud.'});
  }
});


router.delete('/delete/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    if (!(/^\d+$/.test(codigo))) {
      return res.status(400).json({ error: 'El codigo debe ser un dígito válido.' });
    }

    const gastoEliminado = await gasto.deleteGasto({ codigo: parseInt(codigo)});

    if (!gastoEliminado) {
      return res.status(404).json({ error: 'Gasto no encontrado.' });
    }
    return res.status(200).json({ gastoEliminado});

  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: 'Error al procesar solicitud.' });
  }
});

module.exports = router;
