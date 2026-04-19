export declare class EncryptionUtil {
    private static readonly ALGORITHM;
    private static readonly ENCODING;
    static encrypt(text: string, secret: string): string;
    static decrypt(text: string, secret: string): string;
}
