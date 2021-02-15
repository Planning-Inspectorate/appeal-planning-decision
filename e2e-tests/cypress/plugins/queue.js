const container = require('rhea');

module.exports = (config) => {
  const received = [];

  const username = config.env.RMQuser;
  const password = config.env.RMQpass;
  const port = config.env.RMQport;

  const opts = { port, username, password };

  const queue = 'my-special-queue';

  return {
    listenToQueue: () => {
      return new Promise( (resolve, reject) => {
        container.on('message', function (context) {
          received.push(context.message.body);
          context.connection.close();
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
      return received[received.length - 1];
    }


  }
}
