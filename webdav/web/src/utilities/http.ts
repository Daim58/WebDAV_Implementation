
export function request(method: string, url: string, headers: {[key:string]:string} = {}, body: string | null = null) {
    return new Promise(function (resolve, reject) {
        const request  = new XMLHttpRequest()
        const header   = new Headers();
        const response = () => ({
            status: request.status,
            url: request.responseURL,
            body: () => Promise.resolve(request.responseText),
            headers: new Headers(),
        });
        request.ontimeout = reject
        request.onerror   = reject
        request.onload    = () => {
            let headers = request.getAllResponseHeaders()
            let items   = headers.trim().split(/[\r\n]+/)
            for (let i = 0, len = items.length; i < len; i++) {
                let pair  = items[i];
                let index = pair.indexOf('\u003a\u0020');
                if (index > 0) {
                    let key = pair.substring(0, index);
                    let val = pair.substring(index + 2);
                    header.append(key, val)
                }
            }
            resolve(response())
        }
        request.open(method, url)
        for (let key in headers) {
            request.setRequestHeader(key, headers[key])
        }
        if (method === 'GET' || method === 'DELETE') {
            request.send(null);
        } else {
            request.send(body)
        }
    })
}
