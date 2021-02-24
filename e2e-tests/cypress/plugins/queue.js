const container = require('rhea');

module.exports = (config) => {
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
      });
    },

    putOnQueue: (message)=> {
      return new Promise( (resolve, reject) => {
        container.once('sendable', function (context) {
          context.sender.send({body: message});
          resolve(null);
        });

        container.on('error', function (context) {
          reject(error);
        });

        var connection = container.connect(opts);

        connection.open_sender(queue);
      });
    },

    getLastFromQueue: ()=> {
      if (!received || !received.length) {
        return null; // at least surface the failure in the test..
      }
      return received[received.length - 1];
    }
  }
}
