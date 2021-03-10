# Ping

This is a simple service to ping an endpoint as a health check and report to
Prometheus

Health checks never fail so this is purely as a monitoring tool. This will
mark as failed if the call times out or returns a non-2xx/3xx range status
code. cURL is installed on the Docker image to help with debugging.
