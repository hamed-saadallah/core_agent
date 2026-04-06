import * as crypto from 'crypto';

export class EncryptionUtil {
  private static readonly ALGORITHM = 'aes-256-cbc';
  private static readonly ENCODING = 'hex';

  static encrypt(text: string, secret: string): string {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(secret, 'salt', 32);
    const cipher = crypto.createCipheriv(EncryptionUtil.ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', EncryptionUtil.ENCODING);
    encrypted += cipher.final(EncryptionUtil.ENCODING);

    return `${iv.toString(EncryptionUtil.ENCODING)}:${encrypted}`;
  }

  static decrypt(text: string, secret: string): string {
    const [ivHex, encrypted] = text.split(':');
    const iv = Buffer.from(ivHex, EncryptionUtil.ENCODING);
    const key = crypto.scryptSync(secret, 'salt', 32);
    const decipher = crypto.createDecipheriv(EncryptionUtil.ALGORITHM, key, iv);

    let decrypted = decipher.update(encrypted, EncryptionUtil.ENCODING, 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
