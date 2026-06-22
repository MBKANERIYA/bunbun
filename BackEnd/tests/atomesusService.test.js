const assert = require("node:assert/strict");
const test = require("node:test");

const {
    callAtomesusChat,
    extractAssistantText,
} = require("../Services/Atomesus.Services");

test("extracts assistant text from OpenAI-compatible chat completion response", () => {
    assert.equal(
        extractAssistantText({
            choices: [{ message: { content: "{\"recommendations\":[]}" } }],
        }),
        "{\"recommendations\":[]}"
    );
});

test("calls Atomesus chat completions without exposing API key in response data", async () => {
    let capturedRequest;
    const fetchImpl = async (url, options) => {
        capturedRequest = { url, options };
        return {
            ok: true,
            status: 200,
            json: async () => ({
                choices: [{ message: { content: "{\"recommendations\":[{\"productId\":\"p1\",\"reason\":\"Good match\"}]}" } }],
            }),
        };
    };

    const text = await callAtomesusChat({
        prompt: "Rank products",
        apiKey: "test-secret-key",
        fetchImpl,
        timeoutMs: 1000,
    });

    assert.equal(capturedRequest.url, "https://api.atomesus.com/v1/chat/completions");
    assert.equal(capturedRequest.options.method, "POST");
    assert.equal(capturedRequest.options.headers.Authorization, "Bearer test-secret-key");
    assert.equal(text.includes("test-secret-key"), false);
});

test("maps Atomesus payment errors to a safe message", async () => {
    const fetchImpl = async () => ({
        ok: false,
        status: 402,
        json: async () => ({ error: "card says secret test-secret-key" }),
    });

    await assert.rejects(
        () => callAtomesusChat({
            prompt: "Rank products",
            apiKey: "test-secret-key",
            fetchImpl,
            timeoutMs: 1000,
        }),
        /Atomesus credits are insufficient/
    );
});
