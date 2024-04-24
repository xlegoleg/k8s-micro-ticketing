import { scryptSync, randomBytes } from 'crypto';

export class PasswordService {
  public static toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buffer = scryptSync(password, salt, 64);

    return `${buffer.toString('hex')}.${salt}`;
  }

  public static compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = scryptSync(suppliedPassword, salt, 64);

    return buf.toString('hex') === hashedPassword;
  }
}