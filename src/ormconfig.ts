import * as PostgressConnectionStringParser from 'pg-connection-string';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

// Check typeORM documentation for more information.
export function ormConfig(): TypeOrmModuleOptions {
  dotenv.config();
  console.log(process.env.DB_URL);
  const connectionOptions = PostgressConnectionStringParser.parse(
    process.env.DB_URL,
  );
  return {
    type: 'postgres',
    host: connectionOptions.host,
    port: Number(connectionOptions.port),
    username: connectionOptions.user,
    password: connectionOptions.password,
    database: connectionOptions.database,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],

    // We are using migrations, synchronize should be set to false.
    synchronize: true,

    // Run migrations automatically,
    // you can disable this if you prefer running migration manually.
    migrationsRun: false,
    logging: true,
    logger: 'file',

    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {
      // Location of migration should be inside src folder
      // to be compiled into dist/ folder.
      migrationsDir: 'src/migrations',
    },
  };
}
