const { exec } = require("child_process");

const portConfig = {
    "appeal-reply-service-api": 3002,
    "appeals-service-api": 3000,
    "document-service-api": 3001,
    "form-web-app": 9000,
    "lpa-questionnaire-web-app": 9001,
    "queue-retry": 9002,
    "pdf-service-ap": 3003,
    "gotenberg": 4006
}

async function start(){

    const Client = require('kubernetes-client').Client
    const config = require('kubernetes-client').config

    const client = new Client({ config: config.fromKubeconfig(), version: '1.13' })

    let pods = await client.api.v1.namespaces('app-dev').pods.get()
    //console.log(pods.body.items)

    const podList = pods.body.items
    const podNames = []

    for (let index = 0; index < podList.length; index++) {
        const p = podList[index];
        //console.log(p.metadata.name)
        podNames.push(p.metadata.name)
    }

    // now we have all the pods we need to deduplicate them so we're not adding duplucate mappings.

    var finalNames = []
    for (let i = 0; i < podNames.length; i++) {
        let thePod = podNames[i];
        let splitName = thePod.split('-')

        if(thePod.includes('amqp-connector')){
            continue
        }

        if(i+1 < podNames.length) {
        let nextPod = podNames[i+1]
            let nextSplitName = nextPod.split('-')

            if(splitName[0] === nextSplitName[0] && splitName[1] === nextSplitName[1] && splitName[2] === nextSplitName[2]){
                finalNames.push(thePod)
                i++
                continue
            } else {
                finalNames.push(thePod)
                continue
            }
        } else {
            finalNames.push(thePod)
        }

    }

    // now we create a port mapping based on our config!
    for (let i = 0; i < finalNames.length; i++) {
        const pod = finalNames[i];

        let res = await client.api.v1.namespaces('app-dev').pod(pod).status.get()
        let containerPort = res.body.spec.containers[0].ports[0].containerPort

        let serviceName = getConfigPort(pod)
        console.log('Service name: ' + serviceName)
        let configPort = portConfig[serviceName]

        let command = `kubectl port-forward -n app-dev pod/${pod} ${configPort}:${containerPort}`

        console.log(`executing command: ${command}`)

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
    }
}

function getConfigPort(podName){

    return podName.substring(4, podName.length - 17);


}

start()
