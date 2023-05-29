import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class Password {
  //静态方法是我们不需要创建实例就可以访问的方法
  static async toHash(password: string){
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  };

  static async compare(storedPassword: string, suppliedPassword: string){
    const [hasedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
   
    return buf.toString('hex') === hasedPassword;
  }
}
