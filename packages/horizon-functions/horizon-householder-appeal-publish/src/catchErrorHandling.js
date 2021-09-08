/**
 * Deal with error handling for publishing events to Horizon
 *
 * @param event
 * @param err
 * @returns [message, httpStatus]
 */
const catchErrorHandling = (event, err) => {
  let message;
  let httpStatus = 500;

  if (err.response) {
    message = 'No response received from Horizon';
    event.log.error(
      {
        message: err.message,
        data: err.response.data,
        status: err.response.status,
        headers: err.response.headers,
      },
      message
    );
  } else if (err.request) {
    message = 'Error sending to Horizon';
    httpStatus = 400;
    event.log.error(
      {
        message: err.message,
        request: err.request,
      },
      message
    );
  } else {
    /* istanbul ignore next */
    message = err.message ?? 'General error';
    event.log.error(
      {
        message: err.message,
        stack: err.stack,
      },
      message
    );
  }

  return [message, httpStatus];
};

module.exports = { catchErrorHandling };
