const config = require('../lib/config');
const Queue = require('../lib/queue');

const queue = new Queue(config.messageQueue);

module.exports = {
  listConnections(req, res) {
    req.log.info('Listing connections');

    res.render('queue/list', {
      breadcrumbs: [
        {
          name: 'Connection List',
        },
      ],
      columns: [
        {
          name: 'Connection Name',
          key: 'key',
        },
        {
          name: 'Queue Count',
          key: 'count',
        },
      ],
      data: queue.getConnections().map((item) => ({
        ...item,
        count: item.queues.length,
      })),
      link: (item) => `/queue/${item.key}`,
      title: 'Connection List',
    });
  },

  listQueues(req, res, next) {
    const { connectionId } = req.params;
    const connection = queue.getConnections().find(({ key }) => key === connectionId);

    if (!connection) {
      next();
      return;
    }

    req.log.info({ connectionId }, 'Listing queues');

    const title = `Queues on ${connectionId}`;

    res.render('queue/list', {
      breadcrumbs: [
        {
          url: '/queue',
          name: 'Connection List',
        },
        {
          name: title,
        },
      ],
      columns: [
        {
          name: 'Queue name',
          key: 'queue',
        },
      ],
      data: connection.queues.map((item) => ({ queue: item })),
      link: (item) => `/queue/${connectionId}/${item.queue}`,
      title,
    });
  },

  async getMessagesOnQueue(req, res, next) {
    const { connectionId, queueId } = req.params;
    const maxMessageCount = Number(req.query.messages || 32);

    const connection = queue.getConnections().find(({ key }) => key === connectionId);

    if (!connection) {
      next();
      return;
    }

    const messages = await queue.getDLQMessages(connectionId, queueId, maxMessageCount);

    req.log.info(
      {
        connectionId,
        queueId,
        maxMessageCount,
        count: messages.length,
      },
      'Messages retrieved'
    );

    const title = `Messages on ${queueId}`;

    res.render('queue/list', {
      alert: {
        url: `/queue/${connectionId}/${queueId}/requeue`,
        method: 'post',
        button: 'Requeue messages',
      },
      breadcrumbs: [
        {
          url: '/queue',
          name: 'Connection List',
        },
        {
          url: `/queue/${connectionId}`,
          name: `Queues on ${connectionId}`,
        },
        {
          name: title,
        },
      ],
      columns: [
        {
          name: 'ID',
          key: 'messageId',
        },
        {
          name: 'Delivery Attempts',
          key: 'deliveryCount',
        },
        {
          name: 'Data',
          key: 'body',
          factory(body) {
            let code = '<pre><code>';
            try {
              code += JSON.stringify(body, null, 2);
            } catch (err) {
              code += body;
            }

            code += '</code></pre>';

            return code;
          },
        },
      ],
      data: messages,
      title,
    });
  },

  async requeue(req, res, next) {
    const { connectionId, queueId } = req.params;
    const maxMessageCount = Number(req.query.messages || 32);

    const connection = queue.getConnections().find(({ key }) => key === connectionId);

    if (!connection) {
      next();
      return;
    }

    req.log.info({ connectionId, queueId, maxMessageCount }, 'Triggering requeue of messages');

    const messages = await queue.getDLQMessages(connectionId, queueId, maxMessageCount, true);

    req.log.info({ count: messages.length }, 'Requeue successful');

    res.redirect(`/queue/${connectionId}/${queueId}`);
  },
};
