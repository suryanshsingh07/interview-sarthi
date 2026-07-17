import fetch from 'node-fetch'; // Not needed in node 18+, but using built-in fetch
const apiKey = process.argv[2];

async function testModel(modelId) {
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hello" }] }]
            })
        });
        const data = await res.json();
        if (data.error) {
            console.log(`❌ ${modelId} failed: ${data.error.message}`);
            return false;
        } else if (data.candidates) {
            console.log(`✅ ${modelId} SUCCESS`);
            return true;
        }
    } catch (e) {
        console.log(`❌ ${modelId} error: ${e.message}`);
        return false;
    }
}

async function run() {
    const models = [
        'gemini-1.5-flash',
        'gemini-1.5-flash-latest',
        'gemini-1.5-pro',
        'gemini-pro',
        'gemini-1.0-pro'
    ];
    for (const m of models) {
        await testModel(m);
    }
}
run();
