/**
 * Example
 *
 * Example for using the Notify mock.
 */

const { NotifyClient } = require('notifications-node-client');

(async () => {
  const notifyUrl = process.env.NOTIFY_URL;
  const serviceId = process.env.NOTIFY_SERVICE_URL;
  const apiKey = process.env.NOTIFY_API_KEY;

  const args = [];
  if (notifyUrl) {
    args.push(notifyUrl, serviceId);
  }
  args.push(apiKey);

  const notify = new NotifyClient(...args);

  await notify.sendEmailClient('123', 'test@test.com', {});
})();
