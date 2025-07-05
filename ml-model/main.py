

from fastapi import FastAPI
from pydantic import BaseModel
from joblib import load
import numpy as np

# Load model
model = load("model/fraud_model.joblib")
app = FastAPI()

# Pydantic model for request
class Transaction(BaseModel):
    features: list[float]  # Must be 30 features

# Prediction route
@app.post("/predict")
def predict(tx: Transaction):
    probs = model.predict_proba([tx.features])[0]  # get probability
    result = int(probs[1] > 0.5)  # class 1 = fraud
    print(f"Features: {tx.features}")
    print(f"Probability: {probs}, Fraud: {bool(result)}")
    return {"fraud": bool(result), "probability": float(probs[1])}


# Import explanation logic
from explainability.shap_explainer import explain

# Explain route
@app.post("/explain")
def explain_tx(tx: Transaction):
    top_features = explain(tx.features)
    return {"top_features": top_features}
