import * as fs from 'fs';
import { parse } from 'dotenv';
import * as dotenv from 'dotenv';

export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    dotenv.config();
    const isDevelopmentEnv = process.env.NODE_ENV !== 'production';
    console.log(`Application listening on port: ${process.env.NODE_ENV}`)
    if (isDevelopmentEnv) {
      const envFilePath = __dirname + '/../../.env';
      const existsPath = fs.existsSync(envFilePath);

      if (!existsPath) {
        console.log('.env file does not exist');
        process.exit(0);
      }

      this.envConfig = parse(fs.readFileSync(envFilePath));
    } else {

      this.envConfig = {
        PORT: process.env.PORT,
        HOST: process.env.HOST,
        TYPE: process.env.TYPE,
        PORTBD: process.env.PORTBD,
        USERNAME: process.env.USERNAME,
        PASSWORD: process.env.PASSWORD,
        DATABASE: process.env.DATABASE,
        JWT_SECRET: process.env.JWT_SECRET,
        SYNCHRONIZE: process.env.SYNCHRONIZE,
        DROPSCHEMA: process.env.DROPSCHEMA,
        LOGIN_GOOGLE: process.env.LOGIN_GOOGLE
      };
    }
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}

/*   PORT: '5004',
  HOST: '174.138.108.5',
  USERNAME: 'root',
  PASSWORD: 'dockermysql',
  DATABASE: 'bddocker',
  JWT_SECRET: 'oirgdjnc$@dfg', */