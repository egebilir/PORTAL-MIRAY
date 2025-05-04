   // scripts/migrate.js
   const pool = require('../config/database');
   const fs = require('fs');
   const path = require('path');
   const bcrypt = require('bcryptjs');

   async function setupDatabase() {
       try {
           // Read and execute schema
           const schema = fs.readFileSync(
               path.join(__dirname, '../config/schema.sql'),
               'utf8'
           );
           await pool.query(schema);
           console.log('Database schema created successfully');

           // Create admin user
           const hashedPassword = await bcrypt.hash('admin123', 10);
           await pool.query(`
               INSERT INTO users (username, password_hash, email, role)
               VALUES ('admin', $1, 'admin@miray.com', 'admin')
               ON CONFLICT (username) DO NOTHING
           `, [hashedPassword]);
           console.log('Admin user created successfully');

           // Migrate data from localStorage
           await migrateData();
           console.log('Data migration completed successfully');
       } catch (error) {
           console.error('Error during migration:', error);
       } finally {
           await pool.end();
       }
   }

   async function migrateData() {
       try {
           // Migrate news items
           const newsItems = JSON.parse(localStorage.getItem('newsItems') || '[]');
           for (const news of newsItems) {
               await pool.query(`
                   INSERT INTO news (title, content, author_id, created_at, publish_date)
                   VALUES ($1, $2, 1, $3, $3)
               `, [news.title, news.content, new Date(news.date)]);
           }
           console.log('News items migrated successfully');

           // Migrate shore excursion hours
           const shorexHours = JSON.parse(localStorage.getItem('shorexHours') || '{}');
           for (const [day, hours] of Object.entries(shorexHours)) {
               const dayNumber = getDayNumber(day);
               await pool.query(`
                   INSERT INTO shorex_hours (day_of_week, start_time, end_time)
                   VALUES ($1, $2, $3)
               `, [dayNumber, hours.start, hours.end]);
           }
           console.log('Shore excursion hours migrated successfully');

           // Migrate game center hours
           const psHours = JSON.parse(localStorage.getItem('psHours') || '{}');
           for (const [session, hours] of Object.entries(psHours)) {
               await pool.query(`
                   INSERT INTO game_center_hours (session_type, start_time, end_time)
                   VALUES ($1, $2, $3)
               `, [session, hours.start, hours.end]);
           }
           console.log('Game center hours migrated successfully');

       } catch (error) {
           console.error('Error during data migration:', error);
           throw error;
       }
   }

   function getDayNumber(day) {
       const days = {
           'weekday': 1,
           'saturday': 6,
           'sunday': 0
       };
       return days[day] || 0;
   }

   // Run migration
   setupDatabase();