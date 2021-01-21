FROM cypress/included:6.2.1
WORKDIR /home/node
COPY . .
ENV CYPRESS_BASE_URL=https://appeals-dev.planninginspectorate.gov.uk
ENV FILE_UPLOAD_MAX_FILE_SIZE_BYTES=50000000
RUN npm ci
ENTRYPOINT [ "bash", "./entrypoint.sh" ]
