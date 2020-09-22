
import { Configuration } from '../config/config.keys';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { ConnectionOptions } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

export const databaseProviders = [
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        async useFactory(config: ConfigService) {
            return {
                //ssl: true,                                        // SSL Example in Azure
                type: 'mysql',                                      // type database  
                host: config.get(Configuration.HOST),                // server  database
                port: 3306,                                          // port the database
                username: config.get(Configuration.USERNAME),        // user database
                password: config.get(Configuration.PASSWORD),       // password database
                database: config.get(Configuration.DATABASE),        // schema
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],  // Entity
                synchronize: true,                                   // Create or update database tables or columns
                dropSchema: false
            } as ConnectionOptions
        }
    })
]
