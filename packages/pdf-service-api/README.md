# PDF Service

This is container that runs an instance of chromium and uses puppeteer to instruct the browser to save a web page as a pdf

## Notes

Seems you need to keep --no-sandbox, alternative is to set up a custom seccomp profile:
https://security.stackexchange.com/questions/219577/how-to-securely-run-puppeteer-chromium-in-a-docker-container 

Currently we are inlining css to avoid the need to make external web requests from the service in Azure to get assets

Would be preferable to allow these requests and to perhaps use print css rules

It currently accepts html as a request to body

## Testing

As multipart
```shell
curl -X POST --form-string "html=<style>h1 { font-style: italic; }</style><h1>h1</h1><b>test</b>" http://localhost:3004/api/v1/generate --output result-multi.pdf
```

As JSON
```shell
curl -X POST -H "Content-Type: application/json" --data '{"html":"<style>h1 { font-style: italic; }</style><h1>h1</h1><b>test</b>"}' http://localhost:3004/api/v1/generate --output result.pdf
```
