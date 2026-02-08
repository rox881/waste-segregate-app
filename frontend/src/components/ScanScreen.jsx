import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, RefreshCcw, ArrowRight, ShieldCheck, Info, Leaf, Trash2, Recycle, AlertTriangle, Upload, Mic, MessageSquare, X, Volume2 } from 'lucide-react';

const API_URL = 'http://localhost:8000/detect';

const BIN_CONFIG = {
    Recycle: {
        icon: <Recycle className="text-emerald-400" size={28} />,
        color: 'emerald',
        label: 'Dry / Recyclable',
        bg: 'from-emerald-500/20 to-emerald-900/20',
        border: 'border-emerald-500/30'
    },
    Organic: {
        icon: <Leaf className="text-amber-400" size={28} />,
        color: 'amber',
        label: 'Wet / Organic',
        bg: 'from-amber-500/20 to-amber-900/20',
        border: 'border-amber-500/30'
    },
    Landfill: {
        icon: <Trash2 className="text-slate-400" size={28} />,
        color: 'slate',
        label: 'Dry / Landfill',
        bg: 'from-slate-500/20 to-slate-900/20',
        border: 'border-slate-500/30'
    },
    Hazardous: {
        icon: <AlertTriangle className="text-red-400" size={28} />,
        color: 'red',
        label: 'Hazardous Waste',
        bg: 'from-red-500/20 to-red-900/20',
        border: 'border-red-500/30'
    },
};

const BIN_COLORS = {
    "Recycle": "#00c896",
    "Organic": "#FFA500",
    "Landfill": "#FF0000",
    "Hazardous": "#800080"
};

// Normalize backend category names to frontend BIN_CONFIG keys
const normalizeCategoryName = (backendCategory) => {
    if (!backendCategory) return "Organic";

    const normalized = backendCategory.toLowerCase().trim();

    // Map backend category names to frontend BIN_CONFIG keys
    const categoryMap = {
        "recyclable": "Recycle",
        "recycle": "Recycle",
        "organic": "Organic",
        "reuse": "Recycle",
        "reusable": "Recycle",
        "landfill": "Landfill",
        "hazardous": "Hazardous"
    };

    return categoryMap[normalized] || "Organic";
};

const ScanScreen = ({ onShowDetails }) => {
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);
    const detectionImageRef = useRef(null);
    const resultsImageRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [detectedItems, setDetectedItems] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [cameraPermission, setCameraPermission] = useState(true);
    const [isListening, setIsListening] = useState(false);
    const [chatResponse, setChatResponse] = useState(null);
    const [isThinking, setIsThinking] = useState(false);
    const [showDetectionView, setShowDetectionView] = useState(false);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [imageLoaded, setImageLoaded] = useState(false); // Track when image is ready

    // AI Voice Assistant logic
    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = async (event) => {
            const transcript = event.results[0][0].transcript;
            handleChatQuery(transcript);
        };

        recognition.start();
    };

    const handleChatQuery = async (query) => {
        setIsThinking(true);
        try {
            console.log("🗣️ Sending query to AI:", query);
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query }),
            });
            const data = await response.json();
            console.log("🤖 AI Response received:", data);
            setChatResponse({ query, ...data });

            // Text-to-Speech Response
            if (data.response) {
                const utterance = new SpeechSynthesisUtterance(data.response);
                utterance.pitch = 1.1;
                utterance.rate = 1.0;
                window.speechSynthesis.speak(utterance);
            }
        } catch (error) {
            console.error("Chat error:", error);
            const errorMsg = "I'm having trouble connecting to my knowledge base.";
            setChatResponse({ query, response: errorMsg, binSuggestion: "Landfill" });
            window.speechSynthesis.speak(new SpeechSynthesisUtterance(errorMsg));
        } finally {
            setIsThinking(false);
        }
    };

    // Calculate scaled bounding box coordinates
    const getScaledBoundingBox = (bbox, displayedWidth, displayedHeight) => {
        // Try to get image ref (check both refs)
        const imageRef = detectionImageRef.current || resultsImageRef.current;

        if (!imageRef) {
            console.warn('⚠️ No image ref available, using original bbox:', bbox);
            return bbox;
        }

        // Get natural (original) image dimensions
        const originalWidth = imageRef.naturalWidth || 1280;
        const originalHeight = imageRef.naturalHeight || 720;

        // Get container dimensions
        const containerWidth = imageRef.clientWidth;
        const containerHeight = imageRef.clientHeight;

        // Calculate actual rendered image size (excluding letterboxing from object-fit: contain)
        const imageAspectRatio = originalWidth / originalHeight;
        const containerAspectRatio = containerWidth / containerHeight;

        let actualDisplayedWidth, actualDisplayedHeight, offsetX = 0, offsetY = 0;

        if (containerAspectRatio > imageAspectRatio) {
            // Container is wider - letterboxing on left/right
            actualDisplayedHeight = containerHeight;
            actualDisplayedWidth = containerHeight * imageAspectRatio;
            offsetX = (containerWidth - actualDisplayedWidth) / 2;
        } else {
            // Container is taller - letterboxing on top/bottom
            actualDisplayedWidth = containerWidth;
            actualDisplayedHeight = containerWidth / imageAspectRatio;
            offsetY = (containerHeight - actualDisplayedHeight) / 2;
        }

        // Calculate scale factors
        const scaleX = actualDisplayedWidth / originalWidth;
        const scaleY = actualDisplayedHeight / originalHeight;

        // Scale bounding box and add letterbox offset
        const scaled = {
            x: (bbox.x * scaleX) + offsetX,
            y: (bbox.y * scaleY) + offsetY,
            w: bbox.w * scaleX,
            h: bbox.h * scaleY
        };

        console.log(`📏 Scaling bbox from ${originalWidth}x${originalHeight} → ${Math.round(actualDisplayedWidth)}x${Math.round(actualDisplayedHeight)} (offset: ${Math.round(offsetX)}, ${Math.round(offsetY)}):`, bbox, '→', scaled);
        return scaled;
    };

    // Handle image load to get displayed dimensions
    const handleImageLoad = (e) => {
        const { naturalWidth, naturalHeight, width, height } = e.target;
        console.log('📐 Image loaded - Natural:', naturalWidth, 'x', naturalHeight, 'Displayed:', width, 'x', height);
        setImageDimensions({ width, height });
        console.log('📐 Image dimensions set to:', width, 'x', height);
        setImageLoaded(true); // Trigger re-render with loaded image
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Image = reader.result;
                setCapturedImage(base64Image);
                analyzeImage(base64Image);
            };
            reader.readAsDataURL(file);
        }
    };

    const videoConstraints = {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "environment"
    };

    const handleCapture = useCallback(() => {
        if (webcamRef.current) {
            setImageLoaded(false); // Reset loaded state
            const imageSrc = webcamRef.current.getScreenshot({
                width: 1280,
                height: 720
            });
            if (imageSrc) {
                setCapturedImage(imageSrc);
                analyzeImage(imageSrc);
            } else {
                console.warn("Could not capture screenshot - check camera permissions");
            }
        }
    }, [webcamRef]);

    const analyzeImage = async (base64Image) => {
        setIsAnalyzing(true);
        setDetectedItems([]);
        setShowDetectionView(false);

        try {
            // Robust base64 to File conversion
            const arr = base64Image.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            const file = new File([u8arr], 'capture.jpg', { type: mime });
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Analysis successful:", data);
                setDetectedItems(data.items || []);
                setShowDetectionView(true);
            } else {
                const errorText = await response.text();
                console.error(`Analysis failed with status ${response.status}:`, errorText);
            }
        } catch (error) {
            console.error("Analysis network/fetch error:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const retake = () => {
        setCapturedImage(null);
        setDetectedItems([]);
        setShowDetectionView(false);
        setIsAnalyzing(false);
    };

    return (
        <div className="h-full relative overflow-auto flex flex-col pt-8">
            {/* Header Title */}
            <header className="px-6 mb-4 z-20">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2"
                >
                    <div className="bg-emerald-500 p-2 rounded-xl">
                        <Camera size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-white">ECO-SCRUTINIZE</h1>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-400 opacity-80">AI-Powered Waste Segregation</p>
                    </div>
                </motion.div>
            </header>

            {/* Viewport */}
            <div className="flex-1 px-4 pb-4">
                <div className="w-full h-full glass-card overflow-hidden relative border-white/5 shadow-2xl">
                    {!capturedImage ? (
                        <div className="absolute inset-0">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                screenshotQuality={1}
                                videoConstraints={videoConstraints}
                                className="w-full h-full object-cover"
                                onUserMediaError={() => setCameraPermission(false)}
                                imageSmoothing={true}
                                minScreenshotWidth={1280}
                                minScreenshotHeight={720}
                            />
                            {/* Camera Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center p-12">
                                <div className="w-full h-full border-2 border-white/20 border-dashed rounded-3xl flex items-center justify-center">
                                    <div className="w-20 h-20 border-2 border-emerald-500/50 rounded-full animate-ping opacity-20"></div>
                                </div>
                            </div>
                        </div>
                    ) : showDetectionView && detectedItems.length > 0 ? (
                        // Detection View with Bounding Boxes
                        <div className="absolute inset-0">
                            <div className="w-full h-full flex flex-col md:flex-row">
                                {/* Original Image */}
                                <div className="w-full md:w-1/2 p-4 border-r border-white/10">
                                    <h3 className="text-sm font-bold text-white mb-2 text-center">Original Image</h3>
                                    <img
                                        src={capturedImage}
                                        alt="Original"
                                        className="w-full h-auto rounded-lg object-contain max-h-[400px]"
                                    />
                                </div>

                                {/* Detected Image with Bounding Boxes */}
                                <div className="w-full md:w-1/2 p-4 relative">
                                    <h3 className="text-sm font-bold text-white mb-2 text-center">Detection Results</h3>
                                    <div className="relative w-full h-auto">
                                        <img
                                            ref={detectionImageRef}
                                            src={capturedImage}
                                            alt="Detected"
                                            className="w-full rounded-lg object-contain max-h-[400px]"
                                            onLoad={handleImageLoad}
                                        />
                                        {/* Bounding Boxes Overlay - only render after image loads */}
                                        {imageLoaded && detectedItems.map((item, idx) => {
                                            const normalizedCategory = normalizeCategoryName(item.bin);
                                            const config = BIN_CONFIG[normalizedCategory] || BIN_CONFIG.Organic;
                                            const scaledBox = getScaledBoundingBox(item.bbox, null, null); // Let function get dimensions from ref
                                            return (
                                                <div
                                                    key={idx}
                                                    className="absolute border-2 rounded-md pointer-events-none"
                                                    style={{
                                                        left: `${scaledBox.x}px`,
                                                        top: `${scaledBox.y}px`,
                                                        width: `${scaledBox.w}px`,
                                                        height: `${scaledBox.h}px`,
                                                        borderColor: BIN_COLORS[normalizedCategory] || '#FFFFFF',
                                                        boxShadow: `0 0 10px ${BIN_COLORS[normalizedCategory] || '#FFFFFF'}`
                                                    }}
                                                >
                                                    <div className={`absolute top-0 left-0 bg-${config.color}-500 text-white text-xs font-bold px-2 py-1 rounded-tr-md rounded-bl-md`}>
                                                        {normalizedCategory} {Math.round(item.confidence * 100)}%
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="absolute inset-0">
                            <img
                                src={capturedImage}
                                alt="Captured"
                                className={`w-full h-full object-cover transition-all duration-700 ${isAnalyzing ? 'blur-sm scale-110' : 'blur-0 scale-100'}`}
                            />
                        </div>
                    )}

                    {/* Analysis Visualizer */}
                    <AnimatePresence>
                        {isAnalyzing && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center z-30"
                            >
                                <div className="relative">
                                    <div className="w-24 h-24 border-[3px] border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
                                            <ShieldCheck className="text-emerald-500 animate-pulse" size={32} />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 text-center">
                                    <h2 className="text-xl font-bold text-white tracking-wide">ANALYZING WASTE...</h2>
                                    <p className="text-gray-400 text-sm mt-1">Detecting and Classifying Waste Items</p>
                                </div>
                                {/* Scanning line */}
                                <motion.div
                                    initial={{ top: '0%' }}
                                    animate={{ top: '100%' }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent z-40 brightness-150"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Controls / Result area */}
            <div className="px-6 pb-28 pt-2">
                {!capturedImage && (
                    <div className="flex flex-col items-center">
                        <p className="text-gray-400 text-xs font-medium mb-6 flex items-center gap-2">
                            <Info size={14} className="text-emerald-500" />
                            Align waste item or upload an image
                        </p>

                        <div className="flex items-center gap-4">
                            {/* Upload Button */}
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="bg-white/10 p-4 rounded-2xl border border-white/20 active:scale-95 transition-all group"
                            >
                                <Upload size={24} className="text-white group-hover:text-emerald-400" />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                />
                            </button>

                            {/* Main Capture Button */}
                            <button
                                onClick={handleCapture}
                                className="bg-white p-1 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.2)] active:scale-95 transition-transform"
                            >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 border-[3px] border-black rounded-full flex items-center justify-center">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black rounded-full"></div>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* AI Chat Response Overlay */}
                <AnimatePresence>
                    {(chatResponse || isThinking) && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed bottom-28 left-4 right-4 z-[60]"
                        >
                            <div className="glass-card p-6 border-emerald-500/30 bg-slate-900/90 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <button
                                    onClick={() => setChatResponse(null)}
                                    className="absolute top-4 right-4 text-gray-500 hover:text-white"
                                >
                                    <X size={18} />
                                </button>

                                {isThinking ? (
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                                        <p className="text-gray-400 font-bold text-sm italic">ECO-SCRUTINIZE IS THINKING...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-emerald-500 p-1.5 rounded-lg">
                                                    <MessageSquare size={14} className="text-white" />
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">AI Assistant Response</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const utterance = new SpeechSynthesisUtterance(chatResponse.response);
                                                    utterance.pitch = 1.1;
                                                    window.speechSynthesis.speak(utterance);
                                                }}
                                                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"
                                                title="Repeat Voice"
                                            >
                                                <Volume2 size={14} />
                                            </button>
                                        </div>

                                        <p className="text-white font-bold leading-relaxed">
                                            "{chatResponse.response}"
                                        </p>

                                        <div className={`p-3 rounded-xl border flex items-center justify-between ${chatResponse.binSuggestion === 'Recycle' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                            chatResponse.binSuggestion === 'Organic' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                                chatResponse.binSuggestion === 'Hazardous' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                                                    'bg-slate-500/10 border-slate-500/20 text-slate-400'
                                            }`}>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full animate-pulse bg-current" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Recommended Bin: {chatResponse.binSuggestion}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {capturedImage && !isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                    >
                        {detectedItems.length === 0 ? (
                            <div className="glass-card p-6 text-center">
                                <AlertTriangle className="mx-auto text-amber-500 mb-2" size={32} />
                                <h3 className="font-bold text-lg text-white">Detection Unclear</h3>
                                <p className="text-gray-400 text-sm">AI couldn't identify the material perfectly.</p>
                                <div className="mt-6 flex flex-col gap-3">
                                    <button
                                        onClick={retake}
                                        className="flex items-center justify-center gap-2 bg-white text-black px-6 py-4 rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-all"
                                    >
                                        <RefreshCcw size={16} />
                                        Try Another Angle
                                    </button>
                                    <button
                                        onClick={() => {
                                            retake();
                                            fileInputRef.current?.click();
                                        }}
                                        className="flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-6 py-4 rounded-2xl font-bold text-sm hover:bg-emerald-500/20 active:scale-95 transition-all"
                                    >
                                        <Upload size={16} />
                                        Upload a Clear Photo
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Side-by-Side Image View */}
                                <div className="glass-card p-4">
                                    <div className="w-full h-full flex flex-col md:flex-row gap-4">
                                        {/* Original Image */}
                                        <div className="w-full md:w-1/2">
                                            <h3 className="text-sm font-bold text-white mb-2 text-center">Original Image</h3>
                                            <div className="relative w-full h-[300px] bg-slate-800/50 rounded-lg overflow-hidden">
                                                <img
                                                    src={capturedImage}
                                                    alt="Original"
                                                    className="w-full h-full object-contain"
                                                />
                                            </div>
                                        </div>

                                        {/* Detected Image with Bounding Boxes */}
                                        <div className="w-full md:w-1/2">
                                            <h3 className="text-sm font-bold text-white mb-2 text-center">Detection Results</h3>
                                            <div className="relative w-full h-[300px] bg-slate-800/50 rounded-lg overflow-hidden">
                                                <img
                                                    ref={resultsImageRef}
                                                    src={capturedImage}
                                                    alt="Detected"
                                                    className="w-full h-full object-contain"
                                                    onLoad={handleImageLoad}
                                                />
                                                {/* Bounding Boxes Overlay */}
                                                {detectedItems.map((item, idx) => {
                                                    const config = BIN_CONFIG[item.bin] || BIN_CONFIG.Landfill;
                                                    const scaledBox = getScaledBoundingBox(item.bbox, null, null);
                                                    return (
                                                        <div
                                                            key={idx}
                                                            className="absolute border-2 rounded-md pointer-events-none"
                                                            style={{
                                                                left: `${scaledBox.x}px`,
                                                                top: `${scaledBox.y}px`,
                                                                width: `${scaledBox.w}px`,
                                                                height: `${scaledBox.h}px`,
                                                                borderColor: BIN_COLORS[item.bin] || '#FFFFFF',
                                                                boxShadow: `0 0 8px ${BIN_COLORS[item.bin] || '#FFFFFF'}`
                                                            }}
                                                        >
                                                            <div className={`absolute top-0 left-0 bg-${config.color}-500 text-white text-xs font-bold px-2 py-1 rounded-tr-md rounded-bl-md`}>
                                                                {item.bin} {Math.round(item.confidence * 100)}%
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Detection Status */}
                                <div className="glass-card p-4 bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                            <span className="text-sm font-bold text-white">Detection Complete</span>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-400">
                                            {detectedItems.length} object{detectedItems.length > 1 ? 's' : ''} detected
                                        </span>
                                    </div>
                                </div>

                                {/* Results List (Simplified) */}
                                <div className="space-y-2">
                                    {detectedItems.map((item, idx) => {
                                        const normalizedCategory = normalizeCategoryName(item.bin);
                                        const config = BIN_CONFIG[normalizedCategory] || BIN_CONFIG.Organic;
                                        return (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                onClick={() => onShowDetails && onShowDetails(item, capturedImage)}
                                                className={`glass-card p-3 flex items-center justify-between cursor-pointer group hover:bg-white/10 active:scale-[0.98] transition-all border-l-[4px] ${config.border}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-xl bg-gradient-to-br ${config.bg}`}>
                                                        {config.icon}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-base font-bold text-white">{item.itemType}</h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300`}>
                                                                {config.label}
                                                            </span>
                                                            <span className="text-[9px] font-bold text-gray-400">
                                                                Confidence: {Math.round(item.confidence * 100)}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-white/5 p-1.5 rounded-lg group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                                                    <ArrowRight size={16} className="text-gray-500 group-hover:text-emerald-400" />
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>

                                {/* Retake Button */}
                                <button
                                    onClick={retake}
                                    className="w-full py-3 text-gray-500 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
                                >
                                    Scan Another Material
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ScanScreen;