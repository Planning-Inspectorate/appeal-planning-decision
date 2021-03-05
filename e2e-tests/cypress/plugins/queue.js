const container = require('rhea');

module.exports = (config) => {
  const queueValidationEnabled = config.env.QUEUE_VALIDATION_ENABLED;

  const username = config.env.HORIZON_HAS_PUBLISHER_USERNAME;
  const password = config.env.HORIZON_HAS_PUBLISHER_PASSWORD;
  const port = config.env.HORIZON_HAS_PUBLISHER_PORT;
  const host = config.env.HORIZON_HAS_PUBLISHER_HOST;
  const queue = config.env.HORIZON_HAS_PUBLISHER_QUEUE;

  const received = [];


  const opts = { host, port, username, password };

  return {
    listenToQueue: () => {
      return new Promise( (resolve, reject) => {

        if (queueValidationEnabled) {
          container.on('message', function (context) {
            const messageFromBuffer = context.message.body.content.toString('utf-8');
            const message = JSON.parse(messageFromBuffer);
            received.push(message);
          });

          container.on('error', function (context) {
            reject(error);
          });

          var connection = container.connect(opts);

          connection.open_receiver(queue);

          resolve(null);
        } else {
          resolve(null);
        }

      });
    },

    putOnQueue: (message)=> {
      return new Promise( (resolve, reject) => {

        if (queueValidationEnabled) {
          container.once('sendable', function (context) {
            context.sender.send({body: message});
            resolve(null);
          });

          container.on('error', function (context) {
            reject(error);
          });

          var connection = container.connect(opts);

          connection.open_sender(queue);
        } else {
          resolve(null);
        }

      });
    },

    getLastFromQueue: ()=> {
      if (queueValidationEnabled) {
        if (!received || !received.length) {
          return null; // at least surface the failure in the test..
        }
        return received[received.length - 1];
      } else {
        return "should not be validating against this as queue validation is disabled"
      }
    }
  }
}
