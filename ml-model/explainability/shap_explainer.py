

import shap
import numpy as np
import pandas as pd
from joblib import load

# Load trained model
model = load("model/fraud_model.joblib")

# Initialize SHAP explainer
explainer = shap.Explainer(model)

def explain(features: list):
    # Compute SHAP values
    shap_values = explainer(np.array([features]))

    # Create a sorted DataFrame of feature impacts
    shap_df = pd.DataFrame({
        "feature": [f"f{i}" for i in range(len(features))],
        "value": features,
        "importance": shap_values.values[0]
    }).sort_values("importance", ascending=False)

    # Return top 3 features as list of dicts
    return shap_df.head(3).to_dict(orient="records")
