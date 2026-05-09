const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const adminRoutes = require('./routes/admin');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'PrimeTrade backend' });
});

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.use(errorHandler);

module.exports = app;
