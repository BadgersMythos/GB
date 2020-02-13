const cron = require('node-cron');
const moment = require('moment');
const momentTz = require('moment-timezone');
const { main } = require('./dist/booking');
const config = require('./data/config.json');
const { log } = require('./dist/utils/logger');

const { getUserLoginDetails } = require('./dist/utils/login');
const { email, password } = getUserLoginDetails(config);

const { CRON } = process.env;

const run = () => {
  log('Running booking');
  main(email, password);
};

const getTimezonedhour = () => {
  const machineHour = momentTz.tz(momentTz.tz.guess()).hour();
  const GMTHour = momentTz.tz('Europe/London').hour();
  return 10 + (machineHour - GMTHour);
};

const finalCron = CRON || `15 ${getTimezonedhour()} * * *`;

log(`Running scheduler with Cron: ${finalCron}`);

/**
 * Run everyday at 7am, GMT time
 */
cron.schedule(finalCron, run);
