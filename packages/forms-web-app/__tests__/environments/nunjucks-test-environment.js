const JSDOMEnvironment = require('jest-environment-jsdom').TestEnvironment;

const SCRIPT_RUNNER_STATE = {
	LOADED: 'LOADED',
	RUNNING: 'RUN',
	RAN: 'RAN',
	RESULTS_RETRIEVED: 'RESULTS_RETRIEVED',
	RESET: 'RESET'
};

const KEY_EXCLUSION_LIST = [
	'afterAll',
	'afterEach',
	'beforeAll',
	'beforeEach',
	'describe',
	'it',
	'test',
	'fdescribe',
	'fit',
	'xdescribe',
	'xit',
	'xtest',
	'expect',
	'CSS',
	'fetch',
	'Response',
	'Request',
	'fetchMock',
	'TextEncoder',
	'TextDecoder',
	'Headers',
	'reloadScript',
	'removeScript',
	'runFunctionSync'
];

const sleep = (time) => new Promise((res) => setTimeout(res, time, ''));

/**
 *
 * @property: dom
 * @property: fakeTimers
 * @property: fakeTimersModern
 * @property: global
 * @property: errorEventListener
 * @property: moduleMocker
 * @property: customExportConditions
 */
class NunjucksTestEnvironment extends JSDOMEnvironment {
	constructor(config, context) {
		super(config, context);
		this.config = config;
		this.context = context;
	}

	setupScriptHelpers = () => {
		this.global.reloadScript = (scriptId, document) => {
			const script = document.getElementById(scriptId);
			const scriptContent = script.textContent;
			script.parentNode.removeChild(script);
			const loadBackScript = document.createElement('script');
			loadBackScript.setAttribute('id', scriptId);
			loadBackScript.textContent = scriptContent;
			document.body.appendChild(loadBackScript);
		};

		this.global.runFunctionSync = (functionName, document, args = [], cb) => {
			const statement = `${functionName}(${args.map((arg) => `"${arg}"`).join(',')});`;
			//r = doTheThing("arg1", "arg2");
			console.log(`Running statement ${statement}`);
			let iife = `(() => {

                r = ${statement};
                console.log("Returned value: ", r);

            })()`;
			let iifeScript = document.createElement('script');
			iifeScript.textContent = iife;
			document.body.append(iifeScript);
			const retries = 3;
			let retryCount = 0;
			const waitForVar = () => {
				if (retryCount === retries) {
					cb({ error: `failed waiting for return value` });
					return;
				}
				if (typeof this.dom.window.r != 'undefined') {
					console.log(`Results received: ${this.dom.window.r}`);
					this.scriptRunnerState = SCRIPT_RUNNER_STATE.RESULTS_RETRIEVED;
					cb(this.dom.window.r);
					return;
				}
				retryCount++;
				setTimeout(waitForVar, 1000);
			};
			setTimeout(waitForVar, 1000);
		};
	};

	async setup() {
		await super.setup();
		this.dom.window.r = '';
		this.dom.window.scriptRunnerState = SCRIPT_RUNNER_STATE.LOADED;
		this.WINDOW_KEYS = Object.keys(this.dom.window);
		this.setupScriptHelpers();
	}

	async teardown() {}

	getVmContext() {
		return super.getVmContext();
	}

	/**
	 * @type Event
	 * @property: name
	 * @property: parentProcess
	 * @property: runtimeGlobals
	 * @property: testNamePattern
	 * @property: asyncError
	 * @property: fn
	 * @property: hookType
	 * @property: timeout
	 * @property: blockName
	 * @property: describeBlock
	 * @property: mode
	 * @property: concurrent
	 * @property: failing
	 * @property: testName
	 */

	/**
	 * @type State
	 * @property: currentDescribeBlock
	 * @property: currentlyRunningTest
	 * @property: expand
	 * @property: hasFocusedTests
	 * @property: hasStarted
	 * @property: includeTestLocationInResult
	 * @property: maxConcurrency
	 * @property: parentProcess
	 * @property: rootDescribeBlock
	 * @property: testNamePattern
	 * @property: testTimeout
	 * @property: unhandledErrors
	 * @property: originalGlobalErrorHandlers
	 */

	/**
	 *
	 * @param {Event} event
	 * @param {State} state
	 * Event names
	 * setup
	 *      - properties: name, parentProcess, runtimeGlobals, testNamePattern
	 * add_hook
	 *      - properties: asyncError, fn, hookType, name, timeout
	 * start_describe_definition
	 *      - properties: asyncError, blockName, mode, name
	 * add_hook
	 *      - properties: asyncError, fn, hookType, name, timeout
	 * add_test
	 *      - properties: asyncError, concurrent, failing, fn, mode, name, testName, timeout
	 * finish_describe_definition
	 *      - properties: blockName, mode, name
	 * run_start
	 *      - properties: name
	 * run_describe_start
	 *      - properties: describeBlock, name
	 * hook_start
	 *      - properties: hook, name
	 * hook_success
	 *      - properties: describeBlock, hook, name, test
	 * test_fn_start
	 *      - properties: name, test
	 * test_fn_success
	 *      - properties: name, test
	 * test_done
	 *      - properties: name, test
	 * test_start
	 *      - properties: name, test
	 * test_skip
	 *      - properties: name, test
	 * run_describe_finish
	 *      - properties: describeBlock, name
	 * run_finish
	 *      - properties: name
	 * teardown
	 *      - properties: name
	 */
	async handleTestEvent(event, state) {
		if (event.name === 'test_start') {
			this.dom.window.scriptRunnerState = SCRIPT_RUNNER_STATE.RUNNING;
		}
		if (event.name === 'test_done') {
			if (state.unhandledErrors.length > 0) {
				console.log(state.unhandledErrors);
			}
			this.dom.window.scriptRunnerState = SCRIPT_RUNNER_STATE.RAN;
			const AFTER_TEST_WINDOW_KEYS = Object.keys(this.dom.window);
			let DIFF_WINDOW_KEYS = AFTER_TEST_WINDOW_KEYS.filter(
				(k) => !this.WINDOW_KEYS.includes(k) && !KEY_EXCLUSION_LIST.includes(k)
			);
			if (DIFF_WINDOW_KEYS.length > 0) {
				console.log(
					`\n\ncleaning up the following side effects on the JSDOM virtual console \n\n\t - ${DIFF_WINDOW_KEYS.join(
						'\n\t - '
					)}\n\n`
				);
			}
			while (!this.dom.window.scriptRunnerState === SCRIPT_RUNNER_STATE.RESULTS_RETRIEVED) {
				await sleep(1000);
			}
			DIFF_WINDOW_KEYS.forEach((k) => delete this.dom.window[k]);
			this.dom.window.scriptRunnerState = SCRIPT_RUNNER_STATE.RESET;
			DIFF_WINDOW_KEYS = Object.keys(this.dom.window).filter(
				(k) => !this.WINDOW_KEYS.includes(k) && !KEY_EXCLUSION_LIST.includes(k)
			);
		}
	}
}

module.exports = NunjucksTestEnvironment;
