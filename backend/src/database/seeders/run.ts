import { DataSource } from 'typeorm';
import { runSeeders } from './seed';
import { AppDataSource } from '../data-source';

async function main() {
  try {
    console.log('🔌 Connecting to database...');
    await AppDataSource.initialize();
    console.log('✅ Database connected\n');

    await runSeeders(AppDataSource);

    await AppDataSource.destroy();
    console.log('\n✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running seeders:', error);
    process.exit(1);
  }
}

main();


