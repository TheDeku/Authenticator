import { TypeOrmModule} from '@nestjs/typeorm';
import { Configuration } from '../config/config.keys';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { ConnectionOptions } from 'typeorm';

export const databaseProviders = [
    TypeOrmModule.forRootAsync({
        imports: [ ConfigModule],
        inject: [ ConfigService],
        async useFactory(config: ConfigService){
            return{
                //ssl: true,                                            // SSL Example in Azure
                type: config.get(Configuration.TYPE),                   // Type DataBase  
                host: config.get(Configuration.HOST),                   // Server  Database
                port: parseInt(config.get(Configuration.PORTDB)),       // Port the Database
                username: config.get(Configuration.USERNAME),           // User DataBase
                password: config.get(Configuration.PASSWORD),           // Password DataBase
                database: config.get(Configuration.DATABASE),           // Schema
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],     // Entity
                synchronize: false,     // Create or Update DataBase tables or columns
                dropSchema: false        // Drop Schema   
            } as ConnectionOptions
        }
    })
]
