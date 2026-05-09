const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 4000;

function start() {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running on http://0.0.0.0:${PORT}`);
  });
  
  // Initialize database in the background
  sequelize.authenticate()
    .then(() => {
      console.log('Database authenticated');
      return sequelize.sync({ force: true });
    })
    .then(() => {
      console.log('Database synchronized');
    })
    .catch(error => {
      console.error('Database error:', error);
    });
}

start();
