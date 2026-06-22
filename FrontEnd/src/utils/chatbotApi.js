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
