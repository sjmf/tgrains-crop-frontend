// Record API fixtures for the e2e tests from a running backend.
//
//   node tests/e2e/fixtures/record.mjs [baseUrl]     (default http://127.0.0.1:8000)
//
// Start the backend first, e.g. from crop-model:
//   docker compose -f docker-compose-build.yml up -d redis mariadb celery gunicorn
// with gunicorn's port 5000 published on 8000. Model results are stochastic, so
// re-recording changes the numbers but not the shape.

import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const base = process.argv[2] || 'http://127.0.0.1:8000'
const out = dirname(fileURLToPath(import.meta.url))
const sleep = ms => new Promise(r => setTimeout(r, ms))

// Follow the 303 to /api/status/<id> and poll until the Celery task finishes
async function task(path, init) {
    let res = await fetch(base + path, init)
    let body = await res.json()
    while (!['SUCCESS', 'FAILURE', 'REVOKED'].includes(body.state)) {
        await sleep(500)
        body = await (await fetch(res.url)).json()
    }
    if (body.state !== 'SUCCESS') throw new Error(`${path}: ${body.state} ${body.status}`)
    return body
}

const save = (name, data) => {
    writeFileSync(join(out, name + '.json'), JSON.stringify(data, null, 1) + '\n')
    console.log('wrote', name)
}

for (const id of [101, 102]) {
    const strings = await task(`/api/strings?landscape_id=${id}`)
    save(`strings-${id}`, strings)
    const bau = await task(`/api/model?landscape_id=${id}`)
    save(`bau-${id}`, bau)

    // One model run with every crop area raised by 10%, so results differ from BAU
    const payload = { landscape_id: id }
    strings.result.crops.forEach((c, i) => { payload[c] = Math.round(bau.result.cropAreas[i] * 1.1) })
    strings.result.livestock.forEach((l, i) => { payload[l] = Math.round(bau.result.livestockAreas[i]) })
    save(`model-${id}`, await task('/api/model', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    }))
}

save('tags', await (await fetch(base + '/api/tags')).json())
