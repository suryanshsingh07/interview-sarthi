import urllib.request, json
api_key = 'AIzaSyAO1g0hdgFtGWaweCCGWDsIXMQJl4HV86k'
models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.0-pro']

for m in models:
    url = f'https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent?key={api_key}'
    req = urllib.request.Request(url, method='POST', headers={'Content-Type': 'application/json'}, data=json.dumps({'contents':[{'parts':[{'text':'Hello'}]}]}).encode('utf-8'))
    try:
        res = urllib.request.urlopen(req)
        print(f'SUCCESS: {m}')
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8')
        err_msg = json.loads(body).get('error', {}).get('message', str(e))
        print(f'FAILED: {m} - {err_msg}')
