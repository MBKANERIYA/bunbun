const { GoogleGenAI } = require("@google/genai");

/**
 * Generate a virtual try-on image using Gemini API
 * @param {Object} params
 * @param {string} params.userImageBase64 - Base64 string of the user's selfie
 * @param {string} params.productImageBase64 - Base64 string of the product image
 * @param {string} params.productDescription - Text description of the product
 * @returns {Promise<{imageBase64: string, mimeType: string, textResponse: string}>}
 */
const generateTryOnImage = async ({ userImageBase64, productImageBase64, productDescription }) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("Gemini API key is not configured.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Ensure base64 strings don't have the data URL prefix for the API
    const cleanUserBase64 = userImageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
    const cleanProductBase64 = productImageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const prompt = `You are a virtual fashion try-on assistant. I'm providing two images:
1. A photo of a person (the user)
2. A photo of a clothing product: ${productDescription}

Generate a realistic image of the person wearing this exact clothing product. Maintain the person's face, body shape, skin tone, and pose. The clothing should drape naturally and match the product's exact color, pattern, and style. Keep the original background if possible.`;

    try {
        // We set a long timeout at the controller or via a signal if needed, but the SDK handles the request.
        // We'll use gemini-2.5-flash-image which supports image generation
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-image",
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: prompt },
                        {
                            inlineData: {
                                mimeType: "image/jpeg", // standardizing to jpeg for input
                                data: cleanUserBase64,
                            },
                        },
                        {
                            inlineData: {
                                mimeType: "image/jpeg",
                                data: cleanProductBase64,
                            },
                        },
                    ],
                },
            ],
            config: {
                responseModalities: ["TEXT", "IMAGE"],
            },
        });

        if (!response.candidates || response.candidates.length === 0) {
            throw new Error("No response candidates returned from the API.");
        }

        const parts = response.candidates[0].content?.parts || [];
        let imageBase64 = null;
        let mimeType = null;
        let textResponse = "";

        for (const part of parts) {
            if (part.inlineData) {
                imageBase64 = part.inlineData.data;
                mimeType = part.inlineData.mimeType;
            }
            if (part.text) {
                textResponse += part.text + " ";
            }
        }

        if (!imageBase64) {
            throw new Error("The API did not return an image in the response.");
        }

        return {
            imageBase64,
            mimeType: mimeType || "image/jpeg",
            textResponse: textResponse.trim(),
        };
    } catch (error) {
        console.error("Gemini API Error:", error);
        
        // Handle common API errors
        if (error.status === 429 || error.message?.includes("429")) {
            throw new Error("Rate limit exceeded. Please try again in a few moments.");
        }
        if (error.status === 400 || error.message?.includes("API_KEY_INVALID")) {
            throw new Error("Invalid API key configuration.");
        }
        if (error.message?.includes("not found")) {
            throw new Error("The try-on model is currently unavailable.");
        }
        
        throw new Error(`Failed to generate try-on image: ${error.message}`);
    }
};

module.exports = { generateTryOnImage };
