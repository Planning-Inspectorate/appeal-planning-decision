const reloadScript = (scriptId, document) => {
	const script = document.getElementById(scriptId);
	const scriptContent = script.textContent;
	script.parentNode.removeChild(script);
	const loadBackScript = document.createElement('script');
	loadBackScript.setAttribute('id', scriptId);
	loadBackScript.textContent = scriptContent;
	document.body.appendChild(loadBackScript);
};
const removeScript = (scriptId, document) => {
	const script = document.getElementById(scriptId);
	script.parentNode.removeChild(script);
};
const runFunction = (functionName, document, args = [], cb) => {
	//window.eval('let r;');
	let iife = `(() => {
		r = ${functionName}(${args.join(',')})
    })()`;
	let iifeScript = document.createElement('script');
	iifeScript.textContent = iife;
	document.body.append(iifeScript);
	const retries = 3;
	let retryCount = 0;
	const waitForVar = () => {
		retryCount++;
		if (retryCount === retries) cb({ error: `failed waiting for return value` });
		if (window && typeof window.r !== 'undefined' && window.r != 'TEST_STARTED') {
			cb(window.r);
		}
		setTimeout(waitForVar, 1000);
	};
	setTimeout(waitForVar, 1000);
};
module.exports = {
	reloadScript,
	removeScript,
	runFunction
};
