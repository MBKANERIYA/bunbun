import React, { useEffect, useMemo, useState } from "react";
import { MessageCircle, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModel";
import { getAuthUserId } from "../utils/auth";
import { requestProductSuggestions } from "../utils/chatbotApi";
import "../Style/ChatbotWidget.css";

const PRODUCT_TYPES = [
    { value: "plain_blouse", label: "Plain Blouse" },
    { value: "kalamkari_blouse", label: "Kalamkari Blouse" },
    { value: "shapewear", label: "Shapewear" },
];

const defaultAnswers = {
    outfitType: "",
    occasion: "",
    desiredLook: "",
    contrastPreference: "",
    budget: "",
    notes: "",
};

const rgbToHex = (r, g, b) => (
    `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`
);

const hexToRgb = (hex) => {
    const value = hex.replace("#", "");
    return {
        r: parseInt(value.slice(0, 2), 16),
        g: parseInt(value.slice(2, 4), 16),
        b: parseInt(value.slice(4, 6), 16),
    };
};

const rgbToColorName = ({ r, g, b }) => {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const lightness = (max + min) / 2;

    if (delta < 18) {
        if (lightness < 55) return "black";
        if (lightness < 105) return "charcoal";
        if (lightness < 170) return "grey";
        if (lightness < 220) return "light grey";
        return "off white";
    }

    let hue = 0;
    if (max === r) {
        hue = ((g - b) / delta) % 6;
    } else if (max === g) {
        hue = (b - r) / delta + 2;
    } else {
        hue = (r - g) / delta + 4;
    }
    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;

    const saturation = delta / (255 - Math.abs(2 * lightness - 255));

    if (lightness > 205 && saturation < 0.35) return "cream";
    if (hue >= 35 && hue < 70 && lightness > 165) return "soft cream";
    if (hue >= 35 && hue < 70 && saturation < 0.45) return "beige";
    if (hue >= 40 && hue < 75 && lightness < 135) return "olive";
    if (hue >= 20 && hue < 40 && lightness < 125) return "brown";
    if (hue >= 345 || hue < 12) return lightness < 115 ? "maroon" : "red";
    if (hue >= 12 && hue < 35) return lightness < 125 ? "rust" : "orange";
    if (hue >= 35 && hue < 55) return "mustard";
    if (hue >= 55 && hue < 75) return "yellow";
    if (hue >= 75 && hue < 165) return lightness < 130 ? "green" : "sage green";
    if (hue >= 165 && hue < 195) return "teal";
    if (hue >= 195 && hue < 255) return lightness < 105 ? "navy" : "blue";
    if (hue >= 255 && hue < 290) return "purple";
    if (hue >= 290 && hue < 345) return lightness < 125 ? "wine" : "pink";
    return "mixed color";
};

const colorNameFromHex = (hex) => rgbToColorName(hexToRgb(hex));

const describeColorHints = (colors) => {
    const names = colors.map(colorNameFromHex);
    return [...new Set(names)].join(", ");
};

const extractColorHints = (file) => new Promise((resolve) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
        const canvas = document.createElement("canvas");
        const size = 80;
        canvas.width = size;
        canvas.height = size;
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, size, size);
        const { data } = context.getImageData(0, 0, size, size);
        const buckets = new Map();

        for (let index = 0; index < data.length; index += 16) {
            const alpha = data[index + 3];
            if (alpha < 180) continue;
            const r = Math.round(data[index] / 32) * 32;
            const g = Math.round(data[index + 1] / 32) * 32;
            const b = Math.round(data[index + 2] / 32) * 32;
            const brightness = (r + g + b) / 3;
            if (brightness < 24 || brightness > 242) continue;
            const key = `${Math.min(r, 255)},${Math.min(g, 255)},${Math.min(b, 255)}`;
            buckets.set(key, (buckets.get(key) || 0) + 1);
        }

        URL.revokeObjectURL(url);
        const colors = [...buckets.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([key]) => {
                const [r, g, b] = key.split(",").map(Number);
                return rgbToHex(r, g, b);
            });
        resolve(colors);
    };

    image.onerror = () => {
        URL.revokeObjectURL(url);
        resolve([]);
    };

    image.src = url;
});

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [flow, setFlow] = useState("home");
    const [productType, setProductType] = useState("");
    const [clothingImage, setClothingImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [colorHints, setColorHints] = useState([]);
    const [answers, setAnswers] = useState(defaultAnswers);
    const [results, setResults] = useState([]);
    const [statusText, setStatusText] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getAuthUserId()));
    const navigate = useNavigate();

    useEffect(() => {
        const syncAuth = () => setIsLoggedIn(Boolean(getAuthUserId()));
        window.addEventListener("authChanged", syncAuth);
        window.addEventListener("storage", syncAuth);
        return () => {
            window.removeEventListener("authChanged", syncAuth);
            window.removeEventListener("storage", syncAuth);
        };
    }, []);

    useEffect(() => () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    const selectedProductTypeLabel = useMemo(
        () => PRODUCT_TYPES.find((item) => item.value === productType)?.label || "",
        [productType]
    );

    const requireLogin = () => {
        if (getAuthUserId()) {
            setIsLoggedIn(true);
            return true;
        }
        setShowLogin(true);
        return false;
    };

    const resetSuggestion = () => {
        setFlow("suggest");
        setProductType("");
        setClothingImage(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
        setColorHints([]);
        setAnswers(defaultAnswers);
        setResults([]);
        setStatusText("");
        setError("");
    };

    const handleImageChange = async (event) => {
        const file = event.target.files?.[0];
        setError("");
        setResults([]);
        setClothingImage(null);
        setColorHints([]);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");

        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("Please upload a JPG, PNG, or WebP image.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Please upload an image smaller than 5 MB.");
            return;
        }

        setClothingImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        const colors = await extractColorHints(file);
        setColorHints(colors);
        setAnswers((current) => ({
            ...current,
            clothingColors: describeColorHints(colors),
        }));
    };

    const updateAnswer = (field, value) => {
        setAnswers((current) => ({ ...current, [field]: value }));
    };

    const handleSuggest = async () => {
        if (!requireLogin()) return;
        if (!productType) {
            setError("Choose what you are shopping for.");
            return;
        }
        if (!clothingImage) {
            setError("Upload the clothing photo first.");
            return;
        }

        setIsLoading(true);
        setError("");
        setStatusText("Finding the best matches...");
        setResults([]);

        try {
            const data = await requestProductSuggestions({
                productType,
                clothingImage,
                attributes: {
                    colorHints,
                    colorNames: describeColorHints(colorHints),
                    confirmedColors: answers.clothingColors,
                    selectedProductType: selectedProductTypeLabel,
                },
                answers,
            });
            setResults(data.recommendations || []);
            setStatusText(data.warning ? "Showing safe catalog matches while the stylist is unavailable." : "Here are the top 5 matches.");
        } catch (err) {
            setError(err.response?.data?.message || "Could not get suggestions right now.");
            setStatusText("");
        } finally {
            setIsLoading(false);
        }
    };

    const openSuggestions = () => {
        if (!requireLogin()) return;
        resetSuggestion();
    };

    const renderHome = () => (
        <>
            <div className="chatbot-message">
                Hi, welcome to Bunbun Clothing. I can help you find pieces that suit what you already have.
            </div>
            <div className="chatbot-choice-grid">
                <button className="chatbot-choice" type="button" onClick={openSuggestions}>
                    <Sparkles size={17} /> Suggest Products
                </button>
                <button className="chatbot-choice chatbot-disabled" type="button" onClick={() => setFlow("tryon")}>
                    AI Try-On
                </button>
            </div>
        </>
    );

    const renderTryOn = () => (
        <>
            <div className="chatbot-message">
                AI Try-On will be available once Atomesus supports documented image generation for API users.
            </div>
            <button className="chatbot-secondary-btn" type="button" onClick={() => setFlow("home")}>
                Back
            </button>
        </>
    );

    const renderSuggestion = () => (
        <>
            <div className="chatbot-message">
                Tell me what you want to match, then I will suggest 5 products from the store.
            </div>

            <p className="chatbot-section-title">Product Type</p>
            <div className="chatbot-choice-grid">
                {PRODUCT_TYPES.map((item) => (
                    <button
                        key={item.value}
                        type="button"
                        className={`chatbot-choice ${productType === item.value ? "active" : ""}`}
                        onClick={() => setProductType(item.value)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <p className="chatbot-section-title">Clothing Photo</p>
            <div className="chatbot-upload">
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
                <p className="chatbot-note">We do not store your uploaded photos. They are used only during this session.</p>
                {previewUrl && <img className="chatbot-preview" src={previewUrl} alt="Uploaded clothing preview" />}
                {colorHints.length > 0 && (
                    <div className="chatbot-swatch-row" aria-label="Suggested color hints">
                        {colorHints.map((color) => (
                            <span
                                key={color}
                                className="chatbot-swatch"
                                style={{ backgroundColor: color }}
                                title={colorNameFromHex(color)}
                            ></span>
                        ))}
                    </div>
                )}
            </div>

            <p className="chatbot-section-title">Stylist Questions</p>
            <div className="chatbot-form-grid">
                <div className="chatbot-field">
                    <label htmlFor="chatbot-colors">Main colors you see</label>
                    <input
                        id="chatbot-colors"
                        value={answers.clothingColors || ""}
                        onChange={(event) => updateAnswer("clothingColors", event.target.value)}
                        placeholder="Black saree with gold border"
                    />
                </div>
                <div className="chatbot-field">
                    <label htmlFor="chatbot-outfit">Clothing type</label>
                    <input
                        id="chatbot-outfit"
                        value={answers.outfitType}
                        onChange={(event) => updateAnswer("outfitType", event.target.value)}
                        placeholder="Saree, lehenga, kurti, dupatta..."
                    />
                </div>
                <div className="chatbot-field">
                    <label htmlFor="chatbot-occasion">Occasion</label>
                    <select id="chatbot-occasion" value={answers.occasion} onChange={(event) => updateAnswer("occasion", event.target.value)}>
                        <option value="">Select</option>
                        <option value="daily wear">Daily wear</option>
                        <option value="office">Office</option>
                        <option value="party">Party</option>
                        <option value="wedding">Wedding</option>
                        <option value="festival">Festival</option>
                    </select>
                </div>
                <div className="chatbot-field">
                    <label htmlFor="chatbot-look">Desired look</label>
                    <select id="chatbot-look" value={answers.desiredLook} onChange={(event) => updateAnswer("desiredLook", event.target.value)}>
                        <option value="">Select</option>
                        <option value="simple">Simple</option>
                        <option value="festive">Festive</option>
                        <option value="elegant contrast">Elegant contrast</option>
                        <option value="rich traditional">Rich traditional</option>
                    </select>
                </div>
                <div className="chatbot-field">
                    <label htmlFor="chatbot-contrast">Color direction</label>
                    <select id="chatbot-contrast" value={answers.contrastPreference} onChange={(event) => updateAnswer("contrastPreference", event.target.value)}>
                        <option value="">Stylist can decide</option>
                        <option value="contrast">Contrast</option>
                        <option value="matching family">Same color family</option>
                        <option value="neutral balance">Neutral balance</option>
                    </select>
                </div>
                <div className="chatbot-field">
                    <label htmlFor="chatbot-budget">Budget</label>
                    <input
                        id="chatbot-budget"
                        value={answers.budget}
                        onChange={(event) => updateAnswer("budget", event.target.value)}
                        placeholder="Optional"
                    />
                </div>
                <div className="chatbot-field">
                    <label htmlFor="chatbot-notes">Anything else</label>
                    <textarea
                        id="chatbot-notes"
                        value={answers.notes}
                        onChange={(event) => updateAnswer("notes", event.target.value)}
                        placeholder="Sleeve preference, border color, comfort needs..."
                    />
                </div>
            </div>

            {error && <div className="chatbot-error">{error}</div>}
            {statusText && <p className="chatbot-note">{statusText}</p>}

            <div className="chatbot-actions">
                <button className="chatbot-primary-btn" type="button" onClick={handleSuggest} disabled={isLoading}>
                    {isLoading ? "Checking..." : "Show Matches"}
                </button>
                <button className="chatbot-secondary-btn" type="button" onClick={() => setFlow("home")}>
                    Back
                </button>
            </div>

            {results.length > 0 && (
                <>
                    <p className="chatbot-section-title">Top Matches</p>
                    <div className="chatbot-result-list">
                        {results.map((item) => (
                            <div className="chatbot-result" key={item.product._id}>
                                <img src={item.product.image} alt={item.product.name} />
                                <div>
                                    <h4>{item.rank}. {item.product.name}</h4>
                                    <div className="chatbot-result-price">Rs. {item.product.selling_price}</div>
                                    <p className="chatbot-result-reason">{item.reason}</p>
                                    <button
                                        className="chatbot-link-btn"
                                        type="button"
                                        onClick={() => {
                                            setIsOpen(false);
                                            navigate(`/product/${item.product.slug}`);
                                        }}
                                    >
                                        View Product
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    );

    return (
        <>
            {isOpen && (
                <section className="chatbot-panel" aria-label="Bunbun shop assistant">
                    <div className="chatbot-header">
                        <div>
                            <h3 className="chatbot-title">Bunbun Assistant</h3>
                            <p className="chatbot-subtitle">{isLoggedIn ? "Ready to style your outfit" : "Login required for uploads"}</p>
                        </div>
                        <button className="chatbot-close" type="button" onClick={() => setIsOpen(false)} aria-label="Close chatbot">
                            <X size={19} />
                        </button>
                    </div>
                    <div className="chatbot-body">
                        {flow === "home" && renderHome()}
                        {flow === "suggest" && renderSuggestion()}
                        {flow === "tryon" && renderTryOn()}
                    </div>
                </section>
            )}

            <button className="chatbot-launcher" type="button" onClick={() => setIsOpen((open) => !open)} aria-label="Open Bunbun assistant">
                <MessageCircle size={25} />
            </button>

            <LoginModal
                isOpen={showLogin}
                onClose={() => {
                    setShowLogin(false);
                    setIsLoggedIn(Boolean(getAuthUserId()));
                }}
            />
        </>
    );
};

export default ChatbotWidget;
