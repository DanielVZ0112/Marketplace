import { DataSource } from 'typeorm';
import { runSeeders } from './seed';
import { AppDataSource } from '../data-source';

async function main() {
  await AppDataSource.initialize();
  await runSeeders(AppDataSource);
  await AppDataSource.destroy();
}

main().catch(console.error);