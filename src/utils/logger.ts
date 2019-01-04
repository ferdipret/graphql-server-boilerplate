type consoleLog = (message?: any, ...optionalParams: any[]) => void
/*tslint:disable-next-line*/
const log: consoleLog = console.log

export { log }
