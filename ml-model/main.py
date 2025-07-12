from fastapi import FastAPI
from pydantic import BaseModel
from joblib import load
import numpy as np
from pathlib import Path
from explainability.shap_explainer import explain  # SHAP explanation logic

model_path = Path("model/fraud_model.joblib")
if not model_path.exists():
    raise FileNotFoundError("Trained model not found at 'model/fraud_model.joblib'. Please train the model first.")

model = load(model_path)


app = FastAPI(title="Fraud Detection API", version="1.0")


class Transaction(BaseModel):
    features: list[float]  # Must be 30 features


@app.post("/predict")
def predict(tx: Transaction):
    if len(tx.features) != 30:
        return {"error": "Exactly 30 features required for prediction."}

    probs = model.predict_proba([tx.features])[0]
    result = int(probs[1] > 0.5)  # Class 1 = Fraud

    print(f" Features: {tx.features}")
    print(f" Probability: {probs},  Fraud Detected: {bool(result)}")

    return {
        "fraud": bool(result),
        "probability": float(probs[1]),
    }


@app.post("/explain")
def explain_tx(tx: Transaction):
    if len(tx.features) != 30:
        return {"error": "Exactly 30 features required for explanation."}

    top_features = explain(tx.features)
    return {"top_features": top_features}
