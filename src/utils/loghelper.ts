var pino = require('pino');
const pinoLogger = pino({
    prettyPrint: { colorize: true }
});

function init() {
    //
    // setup up the pinologger as middleware
    //
    pinoLogger.level = process.env.LOG_LEVEL || "info";
}

module.exports = { logger: pinoLogger, init: init };
