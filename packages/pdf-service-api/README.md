# PDF Service

This is container that runs an instance of chromium and uses puppeteer to instruct the browser to save a web page as a pdf

## Notes

Seems you need to keep --no-sandbox, alternative is to set up a custom seccomp profile:
https://security.stackexchange.com/questions/219577/how-to-securely-run-puppeteer-chromium-in-a-docker-container 

Currently we are inlining css to avoid the need to make external web requests from the service in Azure to get assets

Would be preferable to allow these requests and to perhaps use print css rules

It accepts plain html or gzip-compressed html in the request body.

## Testing

Unit tests:
```shell
npm test
```

As plain raw html
```shell
curl -X POST -H "Content-Type: text/html; charset=utf-8" --data '<style>h1 { font-style: italic; }</style><h1>h1</h1><b>test</b>' http://localhost:3004/api/v1/generate --output result.pdf
```

As gzip-compressed raw html
```shell
printf '%s' '<style>h1 { font-style: italic; }</style><h1>h1</h1><b>test</b>' | gzip | curl -X POST -H "Content-Type: application/gzip" -H "Content-Encoding: gzip" --data-binary @- http://localhost:3004/api/v1/generate --output result.pdf
```
