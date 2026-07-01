export class LoggerServices {
    succes = (message: string): void => {
        console.log(`[ \x1b[32m${new Date()}\x1b[0m ] -\x1b[0m ${message}`);
    }

    error = (message: string): void => {
        console.error(`[ \x1b[31m${new Date()}\x1b[0m ] -\x1b[0m ${message}`);
    }
}