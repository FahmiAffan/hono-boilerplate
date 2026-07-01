export class LocalEncrypt {
    constructor(public key: string) { }
    
    encrypt = (data: string): string => {
        const crypto = require('crypto');
        const cipher = crypto.createCipher('aes-256-cbc', this.key);
        let encrypted = cipher.update(data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    bcryptEncrypt = async (data: string): Promise<string> => {
        const bcrypt = require('bcrypt');
        const saltRounds = 10;
        const hashedData = await bcrypt.hash(data, saltRounds);
        return hashedData;
    }

    decrypt = (encryptedData: string): string => {
        const crypto = require('crypto');
        const decipher = crypto.createDecipher('aes-256-cbc', this.key);
        let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}