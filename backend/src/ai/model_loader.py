import joblib
import os

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "models", "modelo_estado_nutricional.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "models", "label_encoder.pkl")

def load_model():
    return joblib.load(MODEL_PATH)

def load_label_encoder():
    return joblib.load(ENCODER_PATH)
