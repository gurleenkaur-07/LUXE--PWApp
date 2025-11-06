// Development script that seeds database then starts server
const { spawn } = require('child_process');
const path = require('path');

console.log('🌱 Seeding database with server data...\n');

// First, run the seeder
const seeder = spawn('node', ['scripts/seeder.js'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  shell: true,
});

seeder.on('error', (error) => {
  console.error('❌ Error running seeder:', error.message);
  console.log('🚀 Starting development server anyway...\n');
  startServer();
});

seeder.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Database seeded successfully!');
  } else if (code === null) {
    // Process was killed, which is fine
    console.log('\n⚠️  Seeder process was terminated');
  } else {
    console.log(`\n⚠️  Seeding completed with exit code: ${code}`);
    console.log('🚀 Starting development server anyway...\n');
  }
  
  // Small delay to ensure mongoose connections are closed
  setTimeout(() => {
    startServer();
  }, 500);
});

function startServer() {
  console.log('🚀 Starting development server...\n');
  
  // Start nodemon
  const nodemon = spawn('npx', ['nodemon', 'server.js'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    shell: true,
  });
  
  nodemon.on('error', (error) => {
    console.error('❌ Error starting nodemon:', error.message);
    process.exit(1);
  });
  
  nodemon.on('close', (code) => {
    process.exit(code || 0);
  });
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down gracefully...');
    nodemon.kill('SIGINT');
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  });
  
  process.on('SIGTERM', () => {
    nodemon.kill('SIGTERM');
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  });
}

