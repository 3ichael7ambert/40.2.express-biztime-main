const request = require('supertest');
const app = require('../app'); 

describe('Company Routes', () => {
  it('GET /companies should return a list of companies', async () => {
    const response = await request(app).get('/companies');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('companies');
  });

});

describe('Invoices Routes', () => {
  it('GET /invoices should return a list of invoices', async () => {
    const response = await request(app).get('/invoices');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('invoices');
  });

});
