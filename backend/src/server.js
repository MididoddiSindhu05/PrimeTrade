const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 8080;

// Start listening immediately so the server is responsive right away
// and health checks pass regardless of database sync status.
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

// Authenticate and sync the database in the background.
// Failures are logged but do not prevent the server from serving requests.
sequelize
  .authenticate()
  .then(() => sequelize.sync({ force: true }))
  .then(() => {
    console.log('Database connected and synced successfully.');
  })
  .catch((error) => {
    console.error('Database connection or sync failed:', error);
  });
