const express = require('express');
const router = express.Router();
const CashFlow = require('../../../../libs/cashflow');
const CashFlowDao = require('../../../../dao/mongodb/models/CashFlowDao');
const cashFlow = new CashFlow(new CashFlowDao());

cashFlow.init();

router.get('/all', async (req, res) => {
    try {
        console.log('CashFlow all: ', { user: req.user });
        const result = await cashFlow.getAllCashFlows(req.user.jwtUser._id);
        return res.status(200).json(result);
    } catch (error) {
        console.error('cashflow', error);
        return res
            .status(500)
            .json({ error: 'No se puede procesar petición.' });
    }
});

router.get('/page/:page/:limit', async (req, res) => {
    try {
        const { page, limit } = req.params;
        const _page = parseInt(page);
        const result = await cashFlow.getPagedCashFlows(
            req.user.jwtUser._id,
            _page,
            _limit
        );
        return res.status(200).json(result);
    } catch (error) {
        console.error('cashflow', error);
        return res
            .status(500)
            .json({ error: 'No se puede procesar petición.' });
    }
});

router.get('/summary', async (req, res) => {
    try {
        const summary = await cashFlow.getCashFlowGroupedByType(
            req.user.jwtUser._id
        );
        return res.status(200).json(summary);
    } catch (error) {
        console.error('cashflow', error);
        return res
            .status(500)
            .json({ error: 'No se puede procesar petición.' });
    }
});

module.exports = router;
