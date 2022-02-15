const colors = {
    yellow: "\x1b[93m",
    gray: "\x1b[90m",
    green:"\x1b[32m",
    white: "\x1b[37m",
    red:"\x1b[31m",
    reset:"\x1b[0m"
}
var path = require('path');
class Logger{
    constructor(module){
        this.MODULE = path.basename(module);
    }
    log(...str){
        process.stdout.write(`${colors.gray}[${new Date().toLocaleTimeString()}] ${colors.green}[${this.MODULE}]${colors.reset}\n${str.join(" ")}\r\n`+colors.reset)
    }
    warn(...str){
        process.stdout.write(`${colors.gray}[${new Date().toLocaleTimeString()}] ${colors.green}[${this.MODULE}]${colors.yellow}\n${str.join(" ")}\r\n`+colors.reset)
    }
    err(...str){
        process.stdout.write(`${colors.gray}[${new Date().toLocaleTimeString()}] ${colors.green}[${this.MODULE}]${colors.red}\n${str.join(" ")}\r\n`+colors.reset)
    }
}
module.exports = Logger