const express = require("express");
const app = express();
const ExpressError = require("./expressError");
const PORT = 3000; // Easy port manipulation
const companiesRoutes = require('./routes/companies');
const invoicesRoutes = require('./routes/invoices');

app.use(express.json());

// Use the company routes
app.use('/companies', companiesRoutes);

// Use the invoices routes
app.use('/invoices', invoicesRoutes);

/** 404 handler */
app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  return res.json({
    error: err,
    message: err.message
  });
});

module.exports = app;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
