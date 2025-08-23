# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from transformers import pipeline
# import random
# import re
# import logging
# import torch

# # Configure logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# # Initialize FastAPI app
# app = FastAPI()

# # Enable CORS (important for frontend integration)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:5173",
#         "https://300d9cd02181.ngrok-free.app"
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# @app.get("/")
# def read_root():
#     return {"message": "NLP service is running"}

# # Global variables for models
# sentiment_analyzer = None
# emotion_analyzer = None
# models_loaded = False

# def load_models():
#     global sentiment_analyzer, emotion_analyzer, models_loaded
#     try:
#         logger.info("Loading sentiment analysis model...")
#         sentiment_analyzer = pipeline(
#             "sentiment-analysis",
#             model="distilbert-base-uncased-finetuned-sst-2-english",
#             device=0 if torch.cuda.is_available() else -1  # Use GPU if available
#         )
#         logger.info("Sentiment model loaded successfully")
        
#         logger.info("Loading emotion analysis model...")
#         emotion_analyzer = pipeline(
#             "text-classification",
#             model="bhadresh-savani/distilbert-base-uncased-emotion",
#             device=0 if torch.cuda.is_available() else -1  # Use GPU if available
#         )
#         logger.info("Emotion model loaded successfully")
        
#         models_loaded = True
#         logger.info("All models loaded successfully")
#         return True
#     except Exception as e:
#         logger.error(f"Error loading models: {str(e)}")
#         models_loaded = False
#         return False

# # Load models at startup
# load_models()

# # Pydantic model for request
# class JournalRequest(BaseModel):
#     text: str

# # Enhanced feedback templates with more detailed responses
# EMOTION_FEEDBACK = {
#     "anger": [
#         "You seem frustrated. Try venting through writing or taking a short break. Remember that anger is often a signal that something important needs attention.",
#         "It looks like you're feeling angry. Consider what triggered this and think about healthy ways to express it. Physical activity or creative expression might help channel this energy.",
#         "Anger can be a signal that something needs to change. Reflect on what might help and consider talking to someone you trust about these feelings."
#     ],
#     "sadness": [
#         "It sounds like you're feeling low today. Give yourself permission to rest and process your emotions. Sadness is a natural part of life that helps us appreciate joy more deeply.",
#         "You're going through a tough time. Remember that it's okay to feel sad and that this will pass. Be gentle with yourself and reach out if you need support.",
#         "Sadness is a natural emotion. Be kind to yourself and reach out if you need support. Sometimes sharing these feelings with someone can lighten the burden."
#     ],
#     "joy": [
#         "You're feeling joyful — keep doing what brings you happiness! This positive energy is wonderful to see. Consider what specifically sparked this joy and how you might create more moments like this.",
#         "It's wonderful to see you in high spirits! Hold onto this feeling and share it with others. Joy is contagious and can brighten not just your day but those around you too.",
#         "Joy is contagious! Keep embracing the positive energy. These moments of pure happiness are worth savoring and remembering. What made this moment so special for you?"
#     ],
#     "love": [
#         "You're radiating love. Spread it around! This beautiful emotion connects us deeply to others. Consider expressing these feelings directly to the person who inspired them.",
#         "Love is a beautiful emotion. It's great that you're experiencing it. These feelings of connection and affection are precious - nurture them and let them guide your actions.",
#         "Feeling loved and loving others is a gift. Cherish these moments and the people who bring them into your life. How might you deepen these connections?"
#     ],
#     "fear": [
#         "Feeling fear or anxiety? Try grounding yourself with deep breaths. Remember that fear often shows up when we care deeply about something. What small step could you take to move forward?",
#         "Fear can be paralyzing. Remember to take one step at a time. It's okay to feel scared - courage isn't the absence of fear but action despite it.",
#         "It's okay to feel scared. Talk about your fears with someone you trust. Sometimes saying them out loud makes them feel more manageable."
#     ],
#     "surprise": [
#         "You seem surprised. Reflecting can help understand what triggered this feeling. Surprises can be opportunities for growth and new perspectives.",
#         "Surprise can be exciting or unsettling. Take a moment to process what happened. What about this situation caught you off guard?",
#         "Unexpected events can be jarring. Give yourself time to adjust. Sometimes surprises lead us to wonderful new paths we hadn't considered."
#     ]
# }

# # Enhanced theme notes with more detailed responses
# THEME_NOTES = {
#     "stress": [
#         " It sounds like you've been under a lot of pressure lately — maybe break tasks into smaller steps. Remember to prioritize self-care during demanding times.",
#         " Stress can be overwhelming. Consider taking a short walk or practicing deep breathing. Even small moments of mindfulness can help reset your nervous system.",
#         " When you're stressed, it's important to prioritize. What's the most urgent thing you can do right now? Remember that asking for help is a sign of strength."
#     ],
#     "relationship": [
#         " Your reflections on relationships show they matter deeply to you — consider reaching out again when the moment feels right. These connections are vital to our wellbeing.",
#         " Relationships can be complex. Think about what you need from your connections right now. Open communication often deepens our bonds with others.",
#         " It seems like relationships are on your mind. Maybe it's time to have an honest conversation. Vulnerability often leads to greater intimacy and understanding."
#     ],
#     "loneliness": [
#         " It seems like you're feeling disconnected — even a brief chat with someone could help. Remember that loneliness is a feeling, not a permanent state.",
#         " Loneliness can be heavy. Remember that there are people who care about you. Sometimes reaching out first can make all the difference.",
#         " Feeling alone? Try reaching out to a friend or family member, even just to say hi. Connection often begins with small, simple gestures."
#     ],
#     "motivation": [
#         " I can sense your drive — channel it into something you love. Motivation is a precious resource - use it wisely while it's flowing strongly.",
#         " Motivation is a powerful force. Use it to tackle a goal you've been putting off. What would make you proud to accomplish?",
#         " You're feeling motivated — that's great! Keep the momentum going. Consider breaking your goal into smaller, manageable steps to maintain this energy."
#     ],
#     "tiredness": [
#         " Your body and mind might need some rest — listen to that signal. Rest isn't a luxury, it's essential for functioning at your best.",
#         " Fatigue can affect your mood. Make sure you're getting enough sleep and taking breaks. Sometimes the most productive thing you can do is rest.",
#         " You sound exhausted. It's important to rest and recharge. Consider what activities truly restore your energy and make time for them regularly."
#     ],
#     # New themes for more detailed responses
#     "affection": [
#         " I sense deep affection in your words. These feelings of warmth and connection are truly special. Consider expressing these feelings directly to brighten someone else's day too.",
#         " Your writing radiates tenderness and care. These emotions are precious and worth nurturing. How might you show this affection in your actions today?",
#         " There's a beautiful warmth in your reflections. These feelings of affection enrich our lives profoundly. Treasure these connections that bring you such joy."
#     ],
#     "gratitude": [
#         " Gratitude shines through your words. This mindset transforms ordinary moments into extraordinary gifts. What else are you grateful for today?",
#         " I can feel your appreciation for life's simple pleasures. Practicing gratitude regularly can significantly boost your overall happiness and wellbeing.",
#         " Your journal reflects a thankful heart. These moments of appreciation are powerful anchors during challenging times. Consider noting three things you're grateful for each day."
#     ],
#     "shared_moments": [
#         " Your writing beautifully captures the magic of shared experiences. These moments of connection create lasting memories that sustain us. What made this time together so meaningful?",
#         " The joy you find in shared experiences is wonderful to see. These connections form the fabric of a rich life. How might you create more moments like this?",
#         " Your reflections highlight how precious shared moments are. These experiences become treasures we carry with us. Who would you like to share your next special moment with?"
#     ],
#     "mindfulness": [
#         " You demonstrate beautiful presence in the moment. This mindfulness is a powerful practice that enhances our appreciation of life. What sensations are you noticing right now?",
#         " Your attention to small details shows wonderful mindfulness. This awareness deepens our experience of everyday moments. How might you bring this presence to other parts of your day?",
#         " I notice your appreciation for the present moment. This mindful awareness is a gift that enriches every experience. What small wonder might you notice next?"
#     ]
# }

# def extract_keywords(text, max_keywords=5):
#     """
#     Simple keyword extractor without external libs.
#     """
#     stopwords = {
#         "the","and","is","in","to","a","of","it","that","for","on","with","as","this","at",
#         "by","an","be","or","are","was","were","from","your","you","i","me","my","we","our"
#     }
#     words = re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())
#     freq = {}
#     for w in words:
#         if w not in stopwords:
#             freq[w] = freq.get(w, 0) + 1
#     sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)
#     return [w for w, _ in sorted_words[:max_keywords]]

# def generate_feedback(emotion, sentiment, journal_text):
#     emotion = emotion.lower()
#     sentiment = sentiment.lower()
    
#     # Clean text for keyword search
#     clean_text = re.sub(r"[^\w\s]", "", journal_text.lower())
    
#     # Enhanced keywords for deeper context
#     keywords = {
#         "stress": ["pressure", "overwhelmed", "deadline", "burnout", "stress"],
#         "relationship": ["relationship", "connection", "partner", "friend", "family", "together", "shared", "with you", "us", "we"],
#         "loneliness": ["alone", "isolated", "lonely"],
#         "motivation": ["motivated", "inspired", "determined", "drive"],
#         "tiredness": ["tired", "exhausted", "fatigued", "drained"],
#         # New keyword categories
#         "affection": ["love", "affection", "care", "cherish", "dear", "heart", "warmth", "fondness", "tenderness", "thought of you"],
#         "gratitude": ["grateful", "thankful", "appreciate", "blessed", "savored", "gratitude", "treasure"],
#         "shared_moments": ["together", "shared", "we", "us", "with you", "our", "made together", "call", "message"],
#         "mindfulness": ["scent", "drifting", "savored", "moment", "present", "notice", "feeling", "senses", "now"]
#     }
    
#     # Select a random base feedback for the emotion
#     base_feedback = random.choice(EMOTION_FEEDBACK.get(emotion, ["Keep writing, your thoughts matter."]))
    
#     # Detect all matching themes
#     detected_themes = []
#     for category, words in keywords.items():
#         if any(word in clean_text for word in words):
#             detected_themes.append(category)
    
#     # Build personalized feedback from detected themes
#     personalized_parts = []
#     for theme in detected_themes[:2]:  # Limit to 2 themes to avoid overly long responses
#         if theme in THEME_NOTES:
#             personalized_parts.append(random.choice(THEME_NOTES[theme]))
    
#     # Combine base feedback with personalized parts
#     feedback = base_feedback
#     if personalized_parts:
#         feedback += " " + " ".join(personalized_parts)
    
#     return feedback

# @app.get("/health")
# def health_check():
#     """Health check endpoint to verify models are loaded"""
#     if models_loaded and sentiment_analyzer and emotion_analyzer:
#         return {
#             "status": "healthy", 
#             "models": "loaded",
#             "sentiment_model": "loaded",
#             "emotion_model": "loaded"
#         }
#     else:
#         return {
#             "status": "unhealthy", 
#             "models": "not loaded",
#             "sentiment_model": "loaded" if sentiment_analyzer else "not loaded",
#             "emotion_model": "loaded" if emotion_analyzer else "not loaded"
#         }

# @app.post("/reload-models")
# def reload_models():
#     """Endpoint to reload models if they failed to load initially"""
#     success = load_models()
#     if success:
#         return {"status": "success", "message": "Models reloaded successfully"}
#     else:
#         raise HTTPException(status_code=500, detail="Failed to reload models")

# @app.post("/analyze")
# def analyze_journal(data: JournalRequest):
#     # Check if models are loaded
#     if not models_loaded or not sentiment_analyzer or not emotion_analyzer:
#         logger.error("Models not loaded - cannot analyze journal")
#         raise HTTPException(
#             status_code=503, 
#             detail="NLP analysis unavailable - models failed to load. Try /reload-models endpoint."
#         )
    
#     text = data.text.strip()
#     if not text:
#         raise HTTPException(status_code=400, detail="Text is required.")
    
#     try:
#         logger.info(f"Analyzing journal entry: {text[:50]}...")
#         sentiment = sentiment_analyzer(text)[0]
#         emotion = emotion_analyzer(text)[0]
#         logger.info(f"Sentiment: {sentiment}, Emotion: {emotion}")
        
#         # Pass full journal text to generate_feedback for personalization
#         feedback = generate_feedback(emotion['label'], sentiment['label'], text)
#         logger.info(f"Generated feedback: {feedback[:50]}...")
        
#         return {
#             "sentiment": sentiment,
#             "emotion": emotion,
#             "feedback": feedback,
#             "detected_themes": extract_keywords(text)  # Add detected keywords for transparency
#         }
#     except Exception as e:
#         logger.error(f"Error during analysis: {str(e)}", exc_info=True)
#         raise HTTPException(
#             status_code=500, 
#             detail=f"Analysis failed: {str(e)}"
#         )




from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from textblob import TextBlob
import random
import re
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI()

# Enable CORS (important for frontend integration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://project-journal-eight.vercel.app",
        "http://localhost:5173",
        "https://300d9cd02181.ngrok-free.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "NLP service is running (lightweight)"}

# Pydantic model for request
class JournalRequest(BaseModel):
    text: str

# Keep ALL your custom emotional feedbacks
EMOTION_FEEDBACK = {
    "anger": [
        "You seem frustrated. Try venting through writing or taking a short break. Remember that anger is often a signal that something important needs attention.",
        "It looks like you're feeling angry. Consider what triggered this and think about healthy ways to express it. Physical activity or creative expression might help channel this energy.",
        "Anger can be a signal that something needs to change. Reflect on what might help and consider talking to someone you trust about these feelings."
    ],
    "sadness": [
        "It sounds like you're feeling low today. Give yourself permission to rest and process your emotions. Sadness is a natural part of life that helps us appreciate joy more deeply.",
        "You're going through a tough time. Remember that it's okay to feel sad and that this will pass. Be gentle with yourself and reach out if you need support.",
        "Sadness is a natural emotion. Be kind to yourself and reach out if you need support. Sometimes sharing these feelings with someone can lighten the burden."
    ],
    "joy": [
        "You're feeling joyful — keep doing what brings you happiness! This positive energy is wonderful to see. Consider what specifically sparked this joy and how you might create more moments like this.",
        "It's wonderful to see you in high spirits! Hold onto this feeling and share it with others. Joy is contagious and can brighten not just your day but those around you too.",
        "Joy is contagious! Keep embracing the positive energy. These moments of pure happiness are worth savoring and remembering. What made this moment so special for you?"
    ],
    "love": [
        "You're radiating love. Spread it around! This beautiful emotion connects us deeply to others. Consider expressing these feelings directly to the person who inspired them.",
        "Love is a beautiful emotion. It's great that you're experiencing it. These feelings of connection and affection are precious - nurture them and let them guide your actions.",
        "Feeling loved and loving others is a gift. Cherish these moments and the people who bring them into your life. How might you deepen these connections?"
    ],
    "fear": [
        "Feeling fear or anxiety? Try grounding yourself with deep breaths. Remember that fear often shows up when we care deeply about something. What small step could you take to move forward?",
        "Fear can be paralyzing. Remember to take one step at a time. It's okay to feel scared - courage isn't the absence of fear but action despite it.",
        "It's okay to feel scared. Talk about your fears with someone you trust. Sometimes saying them out loud makes them feel more manageable."
    ],
    "surprise": [
        "You seem surprised. Reflecting can help understand what triggered this feeling. Surprises can be opportunities for growth and new perspectives.",
        "Surprise can be exciting or unsettling. Take a moment to process what happened. What about this situation caught you off guard?",
        "Unexpected events can be jarring. Give yourself time to adjust. Sometimes surprises lead us to wonderful new paths we hadn't considered."
    ]
}

# Keep ALL your theme notes
THEME_NOTES = {
    "stress": [
        "It sounds like you've been under a lot of pressure lately — maybe break tasks into smaller steps. Remember to prioritize self-care during demanding times.",
        "Stress can be overwhelming. Consider taking a short walk or practicing deep breathing. Even small moments of mindfulness can help reset your nervous system.",
        "When you're stressed, it's important to prioritize. What's the most urgent thing you can do right now? Remember that asking for help is a sign of strength."
    ],
    "relationship": [
        "Your reflections on relationships show they matter deeply to you — consider reaching out again when the moment feels right. These connections are vital to our wellbeing.",
        "Relationships can be complex. Think about what you need from your connections right now. Open communication often deepens our bonds with others.",
        "It seems like relationships are on your mind. Maybe it's time to have an honest conversation. Vulnerability often leads to greater intimacy and understanding."
    ],
    "loneliness": [
        "It seems like you're feeling disconnected — even a brief chat with someone could help. Remember that loneliness is a feeling, not a permanent state.",
        "Loneliness can be heavy. Remember that there are people who care about you. Sometimes reaching out first can make all the difference.",
        "Feeling alone? Try reaching out to a friend or family member, even just to say hi. Connection often begins with small, simple gestures."
    ],
    "motivation": [
        "I can sense your drive — channel it into something you love. Motivation is a precious resource - use it wisely while it's flowing strongly.",
        "Motivation is a powerful force. Use it to tackle a goal you've been putting off. What would make you proud to accomplish?",
        "You're feeling motivated — that's great! Keep the momentum going. Consider breaking your goal into smaller, manageable steps to maintain this energy."
    ],
    "tiredness": [
        "Your body and mind might need some rest — listen to that signal. Rest isn't a luxury, it's essential for functioning at your best.",
        "Fatigue can affect your mood. Make sure you're getting enough sleep and taking breaks. Sometimes the most productive thing you can do is rest.",
        "You sound exhausted. It's important to rest and recharge. Consider what activities truly restore your energy and make time for them regularly."
    ],
    "affection": [
        "I sense deep affection in your words. These feelings of warmth and connection are truly special. Consider expressing these feelings directly to brighten someone else's day too.",
        "Your writing radiates tenderness and care. These emotions are precious and worth nurturing. How might you show this affection in your actions today?",
        "There's a beautiful warmth in your reflections. These feelings of affection enrich our lives profoundly. Treasure these connections that bring you such joy."
    ],
    "gratitude": [
        "Gratitude shines through your words. This mindset transforms ordinary moments into extraordinary gifts. What else are you grateful for today?",
        "I can feel your appreciation for life's simple pleasures. Practicing gratitude regularly can significantly boost your overall happiness and wellbeing.",
        "Your journal reflects a thankful heart. These moments of appreciation are powerful anchors during challenging times. Consider noting three things you're grateful for each day."
    ],
    "shared_moments": [
        "Your writing beautifully captures the magic of shared experiences. These moments of connection create lasting memories that sustain us. What made this time together so meaningful?",
        "The joy you find in shared experiences is wonderful to see. These connections form the fabric of a rich life. How might you create more moments like this?",
        "Your reflections highlight how precious shared moments are. These experiences become treasures we carry with us. Who would you like to share your next special moment with?"
    ],
    "mindfulness": [
        "You demonstrate beautiful presence in the moment. This mindfulness is a powerful practice that enhances our appreciation of life. What sensations are you noticing right now?",
        "Your attention to small details shows wonderful mindfulness. This awareness deepens our experience of everyday moments. How might you bring this presence to other parts of your day?",
        "I notice your appreciation for the present moment. This mindful awareness is a gift that enriches every experience. What small wonder might you notice next?"
    ]
}

def extract_keywords(text, max_keywords=5):
    stopwords = {
        "the","and","is","in","to","a","of","it","that","for","on","with","as","this","at",
        "by","an","be","or","are","was","were","from","your","you","i","me","my","we","our"
    }
    words = re.findall(r"\b[a-zA-Z]{3,}\b", text.lower())
    freq = {}
    for w in words:
        if w not in stopwords:
            freq[w] = freq.get(w, 0) + 1
    sorted_words = sorted(freq.items(), key=lambda x: x[1], reverse=True)
    return [w for w, _ in sorted_words[:max_keywords]]

def generate_feedback(emotion, sentiment, journal_text):
    emotion = emotion.lower()
    clean_text = re.sub(r"[^\w\s]", "", journal_text.lower())
    
    keywords = {
        "stress": ["pressure", "overwhelmed", "deadline", "burnout", "stress"],
        "relationship": ["relationship", "connection", "partner", "friend", "family", "together", "shared", "with you", "us", "we"],
        "loneliness": ["alone", "isolated", "lonely"],
        "motivation": ["motivated", "inspired", "determined", "drive"],
        "tiredness": ["tired", "exhausted", "fatigued", "drained"],
        "affection": ["love", "affection", "care", "cherish", "dear", "heart", "warmth", "fondness", "tenderness", "thought of you"],
        "gratitude": ["grateful", "thankful", "appreciate", "blessed", "savored", "gratitude", "treasure"],
        "shared_moments": ["together", "shared", "we", "us", "with you", "our", "made together", "call", "message"],
        "mindfulness": ["scent", "drifting", "savored", "moment", "present", "notice", "feeling", "senses", "now"]
    }
    
    base_feedback = random.choice(EMOTION_FEEDBACK.get(emotion, ["Keep writing, your thoughts matter."]))
    
    detected_themes = []
    for category, words in keywords.items():
        if any(word in clean_text for word in words):
            detected_themes.append(category)
    
    personalized_parts = []
    for theme in detected_themes[:2]:
        if theme in THEME_NOTES:
            personalized_parts.append(random.choice(THEME_NOTES[theme]))
    
    feedback = base_feedback
    if personalized_parts:
        feedback += " " + " ".join(personalized_parts)
    
    return feedback

@app.get("/health")
def health_check():
    return {"status": "healthy", "models": "lightweight-analyzer"}

@app.post("/reload-models")
def reload_models():
    return {"status": "success", "message": "Lightweight analyzer always available"}

@app.post("/analyze")
def analyze_journal(data: JournalRequest):
    text = data.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text is required.")

    try:
        logger.info(f"Analyzing journal entry: {text[:50]}...")
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity

        # Sentiment classification
        if polarity > 0.1:
            sentiment = {"label": "POSITIVE", "score": polarity}
            emotion = {"label": "joy", "score": polarity}
        elif polarity < -0.1:
            sentiment = {"label": "NEGATIVE", "score": abs(polarity)}
            emotion = {"label": "sadness", "score": abs(polarity)}
        else:
            sentiment = {"label": "NEUTRAL", "score": 1 - abs(polarity)}
            emotion = {"label": "neutral", "score": 1 - abs(polarity)}

        feedback = generate_feedback(emotion["label"], sentiment["label"], text)

        return {
            "sentiment": sentiment,
            "emotion": emotion,
            "feedback": feedback,
            "detected_themes": extract_keywords(text)
        }
    except Exception as e:
        logger.error(f"Error during analysis: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
