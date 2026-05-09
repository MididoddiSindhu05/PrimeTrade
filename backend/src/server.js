const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 8080;

// Start listening immediately so health checks pass and Railway keeps the app online.
// Database operations run in the background — they must not block app.listen().
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

// Authenticate and sync the database as background promises.
console.log('Connecting to database...');
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connection established successfully.');
    return sequelize.sync({ force: true });
  })
  .then(() => {
    console.log('Database synced successfully.');
  })
  .catch((error) => {
    console.error('Database initialisation failed:', error);
  });
