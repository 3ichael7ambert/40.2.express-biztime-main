const express = require('express');
const router = express.Router();
const db = require('../db'); // Assuming you have a database module

// Middleware to parse JSON in the request body
router.use(express.json());

// GET /invoices
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT id, comp_code FROM invoices');
        return res.json({ invoices: result.rows });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /invoices/:id
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        const invoice = result.rows[0];
        const companyResult = await db.query('SELECT * FROM companies WHERE code = $1', [invoice.comp_code]);
        const company = companyResult.rows[0];
        return res.json({ invoice: { ...invoice, company } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST /invoices
router.post('/', async (req, res) => {
    const { comp_code, amt } = req.body;
    try {
        const result = await db.query('INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING *', [comp_code, amt]);
        return res.status(201).json({ invoice: result.rows[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// PUT /invoices/:id
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { amt, paid } = req.body;

    try {
        const result = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }

        const invoice = result.rows[0];
        let paidDate = null;

        if (paid && !invoice.paid) {
            // If paying an unpaid invoice, set paid_date to today
            paidDate = new Date().toISOString().split('T')[0];
        } else if (!paid) {
            // If un-paying, set paid_date to null
            paidDate = null;
        } else {
            // Keep the current paid_date for other cases
            paidDate = invoice.paid_date;
        }

        const updateResult = await db.query(
            'UPDATE invoices SET amt = $1, paid = $2, paid_date = $3 WHERE id = $4 RETURNING *',
            [amt, paid, paidDate, id]
        );

        return res.json({ invoice: updateResult.rows[0] });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE /invoices/:id
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await db.query('DELETE FROM invoices WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Invoice not found' });
        }
        return res.json({ status: 'deleted' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
