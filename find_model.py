import google.generativeai as genai

GEMINI_API_KEY = "AIzaSyDQvjdrkbpOGNvFvwtuZpA7zY0jgEcnpYI"
genai.configure(api_key=GEMINI_API_KEY)

print("Listing models that support generateContent...")
models = [
    m.name
    for m in genai.list_models()
    if "generateContent" in m.supported_generation_methods
]
print(f"Total candidate models: {len(models)}")

for model_name in models:
    print(f"Testing model: {model_name}...")
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("test")
        print(f"✅ SUCCESS with {model_name}: {response.text[:20]}...")
        break
    except Exception as e:
        print(f"❌ FAILED with {model_name}: {e}")
