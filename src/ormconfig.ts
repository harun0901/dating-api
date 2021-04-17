import * as PostgressConnectionStringParser from 'pg-connection-string';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

// Check typeORM documentation for more information.
export function ormConfig(): TypeOrmModuleOptions {
  dotenv.config();
  const connectionOptions = PostgressConnectionStringParser.parse(
    process.env.DATE_API_DATABASE_URL,
  );
  return {
    type: 'postgres',
    host: connectionOptions.host,
    port: Number(connectionOptions.port),
    username: connectionOptions.user,
    password: connectionOptions.password,
    database: connectionOptions.database,
    extra: {
      ssl: false, //true for hosting.-test-mode
    },
    entities: [__dirname + '/**/*.entity{.ts,.js}'],

    // We are using migrations, synchronize should be set to false.
    synchronize: true,

    // Run migrations automatically,
    // you can disable this if you prefer running migration manually.
    migrationsRun: false,
    logging: false,
    logger: 'file',

    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    cli: {
      // Location of migration should be inside src folder
      // to be compiled into dist/ folder.
      migrationsDir: 'src/migrations',
    },
  };
}
