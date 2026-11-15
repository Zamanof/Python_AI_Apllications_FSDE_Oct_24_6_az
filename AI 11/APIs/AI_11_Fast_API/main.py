from fastapi import FastAPI, HTTPException

import traceback
import joblib
from pathlib import Path
from pydantic import BaseModel

import pandas as pd

import sklearn

app = FastAPI(
    title="Price prediction AI Service",
)

MODEL_PATH = Path('../../models/model.pkl')
print(f'Model path: {MODEL_PATH}')
print(f'File exists: {MODEL_PATH.exists()}')

try:
    loaded = joblib.load(MODEL_PATH)
    if isinstance(loaded, dict) and 'pipeline' in loaded:
        BUNDLE = loaded
        PIPELINE = BUNDLE['pipeline']
        FEATURES = BUNDLE.get('featured_order', ['Bedrooms', 'Bathrooms', 'Sqm', 'City'])
    print(f'Model successfully loaded: {MODEL_PATH}')
except Exception as e:
    print(f'Failed to load model: {MODEL_PATH}')
    print(e)
    BUNDLE = None
    PIPELINE = None
    FEATURES = ['Bedrooms', 'Bathrooms', 'Sqm', 'City']

class PredictIn(BaseModel):
    bedrooms: float
    bathrooms: float
    sqm: float
    city: str


@app.post("/predict")
async def predict(request: PredictIn):
    if PIPELINE is None:
        raise HTTPException(status_code=500, detail="No model loaded")

    try:
        features = {
            'Bedrooms': [request.bedrooms],
            'Bathrooms': [request.bathrooms],
            'Sqm': [request.sqm],
            'City': [request.city]
        }
        if 'Sqm' in FEATURES:
            features['Sqm'] = [request.sqm]

        features_df = pd.DataFrame(features, columns=FEATURES)
        prediction = PIPELINE.predict(features_df)[0]
        return {'priceAZN': float(prediction)}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/retrain")
async def retrain():
    pass




