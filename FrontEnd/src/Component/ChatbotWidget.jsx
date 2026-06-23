import React, { useEffect, useMemo, useState } from "react";
import { MessageCircle, Sparkles, X, Camera, Shirt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModel";
import { getAuthUserId } from "../utils/auth";
import { requestProductSuggestions, checkTryOnStatus, generateTryOnImage, getTryOnProducts } from "../utils/chatbotApi";
import "../Style/ChatbotWidget.css";

const PRODUCT_TYPES = [
    { value: "plain_blouse", label: "Plain Blouse" },
    { value: "kalamkari_blouse", label: "Kalamkari Blouse" },
    { value: "shapewear", label: "Shapewear" },
];

const SUGGEST_STEPS = [
    { id: 1, label: "Product type" },
    { id: 2, label: "Clothing photo" },
    { id: 3, label: "Style details" },
];
const TOTAL_SUGGEST_STEPS = SUGGEST_STEPS.length;

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

const getRecommendationProductId = (item) => item?.product?._id || "";

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
    const [flow, setFlow] = useState("home"); // home, suggest, tryon
    
    // Suggestion state
    const [step, setStep] = useState(1);
    const [productType, setProductType] = useState("");
    const [clothingImage, setClothingImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [colorHints, setColorHints] = useState([]);
    const [answers, setAnswers] = useState(defaultAnswers);
    const [results, setResults] = useState([]);
    const [shownProductIds, setShownProductIds] = useState([]);
    const [hasMoreSuggestions, setHasMoreSuggestions] = useState(false);
    
    // TryOn state
    const [isTryOnEnabled, setIsTryOnEnabled] = useState(false);
    const [tryOnStep, setTryOnStep] = useState(1); // 1: Selfie, 2: Browse, 3: Result
    const [tryOnSelfie, setTryOnSelfie] = useState(null); // blob url
    const [tryOnSelfieBase64, setTryOnSelfieBase64] = useState("");
    const [tryOnProductId, setTryOnProductId] = useState(null);
    const [tryOnProduct, setTryOnProduct] = useState(null);
    const [tryOnResult, setTryOnResult] = useState(null);
    const [tryOnProductsList, setTryOnProductsList] = useState([]);
    const [tryOnPage, setTryOnPage] = useState(1);
    const [tryOnHasMore, setTryOnHasMore] = useState(false);
    
    // Shared state
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
        
        // Check if TryOn is enabled
        checkTryOnStatus().then(data => {
            setIsTryOnEnabled(data.enabled);
        }).catch(() => setIsTryOnEnabled(false));

        return () => {
            window.removeEventListener("authChanged", syncAuth);
            window.removeEventListener("storage", syncAuth);
        };
    }, []);

    useEffect(() => () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        if (tryOnSelfie) URL.revokeObjectURL(tryOnSelfie);
    }, [previewUrl, tryOnSelfie]);

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
        setStep(1);
        setProductType("");
        setClothingImage(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
        setColorHints([]);
        setAnswers(defaultAnswers);
        setResults([]);
        setShownProductIds([]);
        setHasMoreSuggestions(false);
        setStatusText("");
        setError("");
    };

    const returnToHome = () => {
        setFlow("home");
        setStep(1);
        setStatusText("");
        setError("");
    };

    // --- Suggestion Flow ---

    const handleImageChange = async (event) => {
        const file = event.target.files?.[0];
        setError("");
        setResults([]);
        setShownProductIds([]);
        setHasMoreSuggestions(false);
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

    const handleSuggest = async ({ append = false } = {}) => {
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
        setStatusText(append ? "Looking for more fresh options..." : "Finding the best matches...");
        if (!append) {
            setResults([]);
            setShownProductIds([]);
            setHasMoreSuggestions(false);
        }

        try {
            const idsToExclude = append ? shownProductIds : [];
            const data = await requestProductSuggestions({
                productType,
                clothingImage,
                attributes: {
                    colorHints,
                    colorNames: describeColorHints(colorHints),
                    confirmedColors: answers.clothingColors,
                    selectedProductType: selectedProductTypeLabel,
                    shownProductIds: idsToExclude,
                },
                answers,
            });
            const recommendations = data.recommendations || [];
            const existingIds = new Set(append ? results.map(getRecommendationProductId) : []);
            const freshRecommendations = recommendations.filter((item) => {
                const productId = getRecommendationProductId(item);
                return productId && !existingIds.has(productId);
            });
            const nextResults = append ? [...results, ...freshRecommendations] : recommendations;
            const nextShownIds = [...new Set([
                ...(append ? shownProductIds : []),
                ...nextResults.map(getRecommendationProductId).filter(Boolean),
            ])];

            setResults(nextResults);
            setShownProductIds(nextShownIds);
            setHasMoreSuggestions(Boolean(data.hasMore) && freshRecommendations.length > 0);

            if (nextResults.length === 0 || (append && freshRecommendations.length === 0)) {
                setStatusText("I have shown all fresh matches I can find for this selection. Try changing details or starting over.");
                setHasMoreSuggestions(false);
            } else if (append) {
                setStatusText(`Added ${freshRecommendations.length} more fresh ${freshRecommendations.length === 1 ? "match" : "matches"}.`);
            } else {
                setStatusText(data.warning ? "Showing safe catalog matches while the stylist is unavailable. You can still ask for more." : "Here are the first matches. You can ask for more, refine details, or start over.");
            }

            if (!append && nextResults.length > 0) {
                setStep(4);
            }
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

    const handleChangeDetails = () => {
        setResults([]);
        setShownProductIds([]);
        setHasMoreSuggestions(false);
        setStatusText("");
        setError("");
        setStep(3);
    };

    const goToNextStep = () => {
        setError("");
        if (step === 1 && !productType) {
            setError("Choose what you are shopping for.");
            return;
        }
        if (step === 2 && !clothingImage) {
            setError("Upload the clothing photo first.");
            return;
        }
        setStep((current) => Math.min(current + 1, TOTAL_SUGGEST_STEPS));
    };

    // --- AI Try-On Flow ---

    const startTryOn = () => {
        if (!requireLogin()) return;
        setFlow("tryon");
        setTryOnStep(1);
        setTryOnResult(null);
        setError("");
        setStatusText("");
    };

    const startTryOnFromSuggestion = (product) => {
        if (!requireLogin()) return;
        setTryOnProductId(product._id);
        setTryOnProduct(product);
        setFlow("tryon");
        if (tryOnSelfieBase64) {
            // Already have selfie, jump to generate
            doGenerateTryOn(tryOnSelfieBase64, product._id);
        } else {
            // Need selfie
            setTryOnStep(1);
        }
    };

    const handleTryOnSelfieChange = (e) => {
        const file = e.target.files?.[0];
        setError("");
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("Please upload a valid image file.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setTryOnSelfieBase64(reader.result);
            if (tryOnSelfie) URL.revokeObjectURL(tryOnSelfie);
            setTryOnSelfie(URL.createObjectURL(file));
        };
        reader.readAsDataURL(file);
    };

    const loadTryOnProducts = async (page = 1) => {
        setIsLoading(true);
        setError("");
        try {
            const res = await getTryOnProducts({ page, limit: 6 });
            setTryOnProductsList(prev => page === 1 ? res.products : [...prev, ...res.products]);
            setTryOnHasMore(page < res.totalPages);
            setTryOnPage(page);
        } catch (e) {
            setError("Failed to load products for try-on.");
        } finally {
            setIsLoading(false);
        }
    };

    const goToTryOnBrowse = () => {
        if (!tryOnSelfieBase64) {
            setError("Please upload your photo first.");
            return;
        }
        setTryOnStep(2);
        if (tryOnProductsList.length === 0) {
            loadTryOnProducts(1);
        }
        // If we came from a suggestion and just uploaded selfie, jump to generate
        if (tryOnProductId) {
            doGenerateTryOn(tryOnSelfieBase64, tryOnProductId);
        }
    };

    const selectTryOnProduct = (product) => {
        setTryOnProductId(product._id);
        setTryOnProduct(product);
        doGenerateTryOn(tryOnSelfieBase64, product._id);
    };

    const doGenerateTryOn = async (selfieBase64, prodId) => {
        setTryOnStep(3); // Result/Generating
        setIsLoading(true);
        setError("");
        setStatusText("AI is generating your try-on image. This may take 15-30 seconds...");
        try {
            const res = await generateTryOnImage(selfieBase64, prodId);
            setTryOnResult(res);
            setStatusText("Here is your virtual try-on!");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to generate try-on.");
            setTryOnStep(2); // Go back to browse
        } finally {
            setIsLoading(false);
        }
    };

    // --- Renderers ---

    const renderHome = () => (
        <>
            <div className="chatbot-message">
                Hi, welcome to Bunbun Clothing. I can help you find pieces that suit what you already have, or you can use our AI Try-On feature.
            </div>
            <div className="chatbot-choice-grid">
                <button className="chatbot-choice" type="button" onClick={openSuggestions}>
                    <Sparkles size={17} /> Suggest Products
                </button>
                <button 
                    className={`chatbot-choice ${!isTryOnEnabled ? "chatbot-disabled" : ""}`} 
                    type="button" 
                    onClick={startTryOn}
                    disabled={!isTryOnEnabled}
                >
                    <Shirt size={17} /> AI Try-On
                </button>
                {!isTryOnEnabled && (
                    <p className="chatbot-note" style={{marginTop: 0}}>AI Try-On requires a Gemini API key.</p>
                )}
            </div>
        </>
    );

    const renderSuggestBody = () => {
        if (step === 1) return (
            <div className="chatbot-step" key="step-type">
                <div className="chatbot-message">
                    What are you shopping for today? Pick one and I will match 5 products to your outfit.
                </div>
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
                {error && <div className="chatbot-error">{error}</div>}
            </div>
        );

        if (step === 2) return (
            <div className="chatbot-step" key="step-photo">
                <div className="chatbot-message">
                    Upload a clear photo of the {selectedProductTypeLabel ? selectedProductTypeLabel.toLowerCase() : "item"} you want to match.
                </div>
                <div className="chatbot-upload">
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
                    <p className="chatbot-note">We do not store your uploaded photos. They are used only during this session.</p>
                    {previewUrl && <img className="chatbot-preview" src={previewUrl} alt="Uploaded preview" />}
                    {colorHints.length > 0 && (
                        <div className="chatbot-swatch-row">
                            {colorHints.map((color) => (
                                <span key={color} className="chatbot-swatch" style={{ backgroundColor: color }} title={colorNameFromHex(color)}></span>
                            ))}
                        </div>
                    )}
                </div>
                {error && <div className="chatbot-error">{error}</div>}
            </div>
        );

        if (step === 3) return (
            <div className="chatbot-step" key="step-details">
                <div className="chatbot-message">
                    A few quick style details and I will find your matches.
                </div>
                <div className="chatbot-form-grid">
                    <div className="chatbot-field">
                        <label htmlFor="chatbot-colors">Main colors you see</label>
                        <input id="chatbot-colors" value={answers.clothingColors || ""} onChange={(e) => updateAnswer("clothingColors", e.target.value)} />
                    </div>
                    <div className="chatbot-field">
                        <label htmlFor="chatbot-outfit">Clothing type</label>
                        <input id="chatbot-outfit" value={answers.outfitType} onChange={(e) => updateAnswer("outfitType", e.target.value)} />
                    </div>
                </div>
                {error && <div className="chatbot-error">{error}</div>}
            </div>
        );

        return (
            <div className="chatbot-step" key="step-results">
                <div className="chatbot-results-head">
                    <button className="chatbot-back-link" type="button" onClick={handleChangeDetails} disabled={isLoading}>
                        &larr; Change details
                    </button>
                    <span className="chatbot-results-count">{results.length} matches</span>
                </div>

                {statusText && <p className="chatbot-note chatbot-results-status">{statusText}</p>}
                {error && <div className="chatbot-error">{error}</div>}

                <div className="chatbot-result-list">
                    {results.map((item, index) => (
                        <div className="chatbot-result" key={item.product._id}>
                            <img src={item.product.image} alt={item.product.name} />
                            <div>
                                <h4>{index + 1}. {item.product.name}</h4>
                                <div className="chatbot-result-price">Rs. {item.product.selling_price}</div>
                                <p className="chatbot-result-reason">{item.reason}</p>
                                <div className="chatbot-result-actions" style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                                    <button className="chatbot-secondary-btn" style={{ padding: '6px 10px', minHeight: 'auto', fontSize: '0.8rem' }} onClick={() => { setIsOpen(false); navigate(`/product/${item.product.slug}`); }}>
                                        View
                                    </button>
                                    {isTryOnEnabled && (
                                        <button className="chatbot-primary-btn" style={{ padding: '6px 10px', minHeight: 'auto', fontSize: '0.8rem' }} onClick={() => startTryOnFromSuggestion(item.product)}>
                                            AI Try-On
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="chatbot-next-step">
                    <p>Want a different direction?</p>
                    <div className="chatbot-next-actions">
                        <button className="chatbot-primary-btn" type="button" onClick={() => handleSuggest({ append: true })} disabled={isLoading || !hasMoreSuggestions}>
                            {isLoading ? "Checking..." : hasMoreSuggestions ? "Show More" : "No More Fresh Matches"}
                        </button>
                        <button className="chatbot-secondary-btn" type="button" onClick={returnToHome} disabled={isLoading}>Main Menu</button>
                    </div>
                </div>
            </div>
        );
    };

    const renderTryOnBody = () => {
        if (tryOnStep === 1) return (
            <div className="chatbot-step">
                <div className="chatbot-message">
                    Welcome to AI Try-On! First, upload a clear, front-facing photo of yourself.
                </div>
                <div className="chatbot-upload">
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleTryOnSelfieChange} />
                    <p className="chatbot-note">For best results, use a well-lit photo with a neutral background.</p>
                    {tryOnSelfie && <img className="chatbot-preview" src={tryOnSelfie} alt="Your selfie" />}
                </div>
                {error && <div className="chatbot-error">{error}</div>}
            </div>
        );

        if (tryOnStep === 2) return (
            <div className="chatbot-step">
                <div className="chatbot-message">
                    Select a product to try on.
                </div>
                {error && <div className="chatbot-error">{error}</div>}
                
                <div className="chatbot-result-list" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {tryOnProductsList.map((prod) => (
                        <div className="chatbot-tryon-card" key={prod._id} onClick={() => selectTryOnProduct(prod)}>
                            <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px' }} />
                            <h5 style={{ margin: '6px 0 2px', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prod.name}</h5>
                            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 'bold' }}>Rs. {prod.selling_price}</p>
                        </div>
                    ))}
                </div>
                
                {isLoading && <p className="chatbot-note">Loading products...</p>}
                
                {!isLoading && tryOnHasMore && (
                    <button className="chatbot-secondary-btn" style={{ width: '100%', marginTop: '10px' }} onClick={() => loadTryOnProducts(tryOnPage + 1)}>
                        Load More
                    </button>
                )}
            </div>
        );

        if (tryOnStep === 3) return (
            <div className="chatbot-step">
                {isLoading ? (
                    <div className="chatbot-thinking" role="status" aria-live="polite">
                        <span className="chatbot-thinking-dots" aria-hidden="true"><span></span><span></span><span></span></span>
                        <span>{statusText || "AI is generating your try-on image..."}</span>
                    </div>
                ) : tryOnResult ? (
                    <div>
                        <div className="chatbot-message">
                            {tryOnResult.message || "Here is your virtual try-on! How does it look?"}
                        </div>
                        {tryOnResult.image && (
                            <img 
                                src={`data:${tryOnResult.image.mimeType};base64,${tryOnResult.image.base64}`} 
                                alt="AI Try-On Result" 
                                style={{ width: '100%', borderRadius: '8px', border: '1px solid #ddd' }} 
                            />
                        )}
                        <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexDirection: 'column' }}>
                            {tryOnProduct && (
                                <button className="chatbot-primary-btn" onClick={() => { setIsOpen(false); navigate(`/product/${tryOnProduct.slug}`); }}>
                                    Buy {tryOnProduct.name}
                                </button>
                            )}
                            <button className="chatbot-secondary-btn" onClick={() => setTryOnStep(2)}>
                                Try Another Product
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="chatbot-error">Something went wrong. Please go back.</div>
                )}
                {error && <div className="chatbot-error">{error}</div>}
            </div>
        );
    };

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

                    {flow === "suggest" && step <= TOTAL_SUGGEST_STEPS && (
                        <div className="chatbot-stepper">
                            <div className="chatbot-step-track">
                                {SUGGEST_STEPS.map((item) => (
                                    <span key={item.id} className={`chatbot-step-seg ${step === item.id ? "active" : ""} ${step > item.id ? "done" : ""}`}></span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {flow === "tryon" && (
                        <div className="chatbot-stepper">
                            <div className="chatbot-step-track">
                                {[1, 2, 3].map((id) => (
                                    <span key={id} className={`chatbot-step-seg ${tryOnStep === id ? "active" : ""} ${tryOnStep > id ? "done" : ""}`}></span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="chatbot-body">
                        {flow === "home" && renderHome()}
                        {flow === "suggest" && renderSuggestBody()}
                        {flow === "tryon" && renderTryOnBody()}
                    </div>

                    {flow === "suggest" && step <= TOTAL_SUGGEST_STEPS && (
                        <div className="chatbot-footer">
                            <button className="chatbot-secondary-btn" type="button" onClick={step === 1 ? returnToHome : () => setStep(s => s - 1)} disabled={isLoading}>
                                {step === 1 ? "Main Menu" : "Back"}
                            </button>
                            {step < TOTAL_SUGGEST_STEPS ? (
                                <button className="chatbot-primary-btn" type="button" onClick={goToNextStep}>Next</button>
                            ) : (
                                <button className="chatbot-primary-btn" type="button" onClick={() => handleSuggest()} disabled={isLoading}>
                                    {isLoading ? "Checking..." : "Show Matches"}
                                </button>
                            )}
                        </div>
                    )}

                    {flow === "tryon" && (
                        <div className="chatbot-footer">
                            {tryOnStep === 1 && (
                                <>
                                    <button className="chatbot-secondary-btn" type="button" onClick={returnToHome}>Main Menu</button>
                                    <button className="chatbot-primary-btn" type="button" onClick={goToTryOnBrowse} disabled={!tryOnSelfieBase64}>Next</button>
                                </>
                            )}
                            {tryOnStep === 2 && (
                                <button className="chatbot-secondary-btn" type="button" onClick={() => setTryOnStep(1)} disabled={isLoading}>Back</button>
                            )}
                            {tryOnStep === 3 && !isLoading && (
                                <button className="chatbot-secondary-btn" type="button" onClick={returnToHome}>Main Menu</button>
                            )}
                        </div>
                    )}
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
