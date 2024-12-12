# Debugging

As the project uses Docker / `docker-compose`, the process of enabling the node debugger involves some extra steps and may not be suitable to be run at all times.

The following guide is for VSCode/WebStorm, but should be transferable to other IDEs.

1. Change the `docker-compose.yml` entry for your needed project. Taking `forms-web-app` as the example, this requires two changes to the service definition:

```language-yaml
# uncomment / expose the node debugger port - the port number is arbitrary
# but needs to match the one you will use in your IDE

    ports:
      - 9003:3000
      # node debugger
      - 9229:9229
```

Also switch out the `command` used by this service. This needs to marry up to a script inside the projects `package.json` file that starts the project with the debugger enabled.

```
# comment out this line:
    #command: npm run start:dev
# uncomment this line:
    command: npm run start:dev:debug
```

2. Restart the environment: `make serve`

3. Create a debug profile in your IDE

VSCode has debugging profiles committed to the repo in [/.vscode/launch.json](/.vscode/launch.json)

For documentation on launch.json see the following: https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_launch-configuration

![webstorm debug profile screenshot](./debug/webstorm-debug-profile.png 'Webstorm debug profile screenshot')

The important point is that the port matches the exposed port from the docker service - `9229` in this case.

4. Add a breakpoint:

![add a breakpoint screenshot](./debug/add-a-breakpoint.png 'add a breakpoint screenshot')

5. Start the debugger from your IDE - in WebStorm this is the green bug icon:

vscode ![launch debugger](./debug/vscode-debug-menu.png 'launch debugger')

You can select the appropriate app from the debugging dropdown:

![webstorm debug icon screenshot](./debug/webstorm-debug-icon.png 'Webstorm debug icon screenshot')

The debugger should connect:

![webstorm connected debugger screenshot](./debug/webstorm-connected-debugger.png 'Webstorm connected debugger screenshot')

6. In your browser, reload the page where you added the breakpoint.

For the purposes of this example, this would be `http://0.0.0.0:9003/appellant-submission/task-list`

7. You should now have successfully enabled step debugging:

![webstorm step debugging session screenshot](./debug/webstorm-step-debugging-session.png 'Webstorm step debugging session screenshot')
