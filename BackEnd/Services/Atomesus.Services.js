const DEFAULT_BASE_URL = "https://api.atomesus.com";
const DEFAULT_MODEL = "cipher";
const DEFAULT_TIMEOUT_MS = 20000;

const statusMessages = {
    401: "Atomesus API key is invalid or missing.",
    402: "Atomesus credits are insufficient.",
    502: "Atomesus is temporarily unavailable.",
    504: "Atomesus request timed out.",
};

const extractAssistantText = (payload) => {
    const choice = Array.isArray(payload?.choices) ? payload.choices[0] : null;
    const content = choice?.message?.content ?? choice?.delta?.content ?? "";
    return typeof content === "string" ? content : JSON.stringify(content || "");
};

const safeAtomesusError = (status) => (
    statusMessages[status] || "Atomesus request failed."
);

const callAtomesusChat = async ({
    prompt,
    apiKey = process.env.ATOMESUS_API_KEY,
    baseUrl = process.env.ATOMESUS_BASE_URL || DEFAULT_BASE_URL,
    model = process.env.ATOMESUS_MODEL || DEFAULT_MODEL,
    fetchImpl = global.fetch,
    timeoutMs = Number(process.env.ATOMESUS_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS,
}) => {
    if (!apiKey) {
        throw new Error("Atomesus API key is not configured.");
    }

    if (typeof fetchImpl !== "function") {
        throw new Error("Fetch API is not available for Atomesus requests.");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    const url = `${String(baseUrl).replace(/\/$/, "")}/v1/chat/completions`;

    try {
        const response = await fetchImpl(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                model,
                messages: [
                    {
                        role: "system",
                        content: "Return concise, valid JSON only. Never include markdown fences.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                stream: false,
            }),
            signal: controller.signal,
        });

        if (!response.ok) {
            throw new Error(safeAtomesusError(response.status));
        }

        const payload = await response.json();
        const assistantText = extractAssistantText(payload);
        if (!assistantText) {
            throw new Error("Atomesus returned an empty response.");
        }
        return assistantText;
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("Atomesus request timed out.");
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }
};

module.exports = {
    callAtomesusChat,
    extractAssistantText,
};
