import axios from "axios";
import { apiUrl } from "./apiConfig";

export const requestProductSuggestions = async ({ productType, clothingImage, attributes, answers }) => {
    const formData = new FormData();
    formData.append("productType", productType);
    formData.append("clothingImage", clothingImage);
    formData.append("attributes", JSON.stringify(attributes || {}));
    formData.append("answers", JSON.stringify(answers || {}));

    const response = await axios.post(apiUrl("/v1/chatbot/suggestions"), formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const checkTryOnStatus = async () => {
    const response = await axios.get(apiUrl("/v1/chatbot/try-on/status"));
    return response.data;
};

export const generateTryOnImage = async (selfieBase64, productId) => {
    const response = await axios.post(apiUrl("/v1/chatbot/try-on/generate"), {
        selfieBase64,
        productId
    });
    return response.data;
};

export const getTryOnProducts = async (params) => {
    const response = await axios.get(apiUrl("/v1/chatbot/try-on/products"), {
        params
    });
    return response.data;
};
