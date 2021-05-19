import { exec } from 'child_process';
import { Client, config } from 'kubernetes-client';

const portConfig = {
  'appeal-reply-service-api': 3002,
  'appeals-service-api': 3000,
  'document-service-api': 3001,
  'form-web-app': 9000,
  'lpa-questionnaire-web-app': 9001,
  'queue-retry': 9002,
  'pdf-service-api': 3003,
  gotenberg: 4006,
};

function getConfigPort(pod) {
  return pod.substring(4, pod.length - 17);
}

async function start() {
  const client = new Client({ config: config.fromKubeconfig(), version: '1.13' });

  const availablePods = await client.api.v1.namespaces('app-dev').pods.get();

  const podList = availablePods.body.items.reduce((pods, pod) => {
    const name = pod.meta.name.substring(4, pod.meta.name - 21); // unique identifier always the same length
    if (pods.indexOf(name) < 0) pods.push(name);
    return pods;
  });

  Promise.all(
    podList.forEach(async (pod) => {
      const res = await client.api.v1.namespaces('app-dev').pod(pod).status.get();
      const { containerPort } = res.body.spec.containers[0].ports[0];

      const serviceName = getConfigPort(pod);
      console.log(`Service name: ${serviceName}`);
      const configPort = portConfig[serviceName];

      const command = `kubectl port-forward -n app-dev pod/${pod} ${configPort}:${containerPort}`;

      console.log(`executing command: ${command}`);

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
      });
    })
  );
}

start();
