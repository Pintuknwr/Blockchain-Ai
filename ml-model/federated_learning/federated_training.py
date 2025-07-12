import pandas as pd
import tensorflow as tf
import numpy as np
import os
from imblearn.over_sampling import SMOTE
from sklearn.metrics import accuracy_score

#  Create the global model architecture
def create_model():
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(30,)),
        tf.keras.layers.Dense(32, activation='relu'),
        tf.keras.layers.Dense(1, activation='sigmoid')
    ])
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model

client_models = []
client_files = ["data/client_1.csv", "data/client_2.csv", "data/client_3.csv"]

# Training each client with SMOTE applied
for file in client_files:
    df = pd.read_csv(file)
    X = df.drop("Class", axis=1).values
    y = df["Class"].values

    # Apply SMOTE balancing
    sm = SMOTE(random_state=42)
    X_bal, y_bal = sm.fit_resample(X, y)

    model = create_model()
    model.fit(X_bal, y_bal, epochs=10, batch_size=16, verbose=0)

    #  Evaluate on original (unbalanced) client data
    y_pred = model.predict(X).flatten()
    y_pred_binary = (y_pred > 0.5).astype(int)
    acc = accuracy_score(y, y_pred_binary)
    print(f"📦 Trained on {file}: Accuracy = {acc:.4f}")

    client_models.append(model)

# Federated Averaging
def average_weights(models):
    new_weights = []
    for weights in zip(*[m.get_weights() for m in models]):
        new_weights.append(np.mean(weights, axis=0))
    return new_weights

averaged_weights = average_weights(client_models)
global_model = create_model()
global_model.set_weights(averaged_weights)

# Save global model
os.makedirs("model", exist_ok=True)
global_model.save("model/global_fraud_model.keras")
print("✅ Global model saved as global_fraud_model.keras")

# Distill into XGBoost model for inference
from xgboost import XGBClassifier
from joblib import dump

# Generate synthetic data
X_synth = np.random.normal(0, 1, size=(10000, 30))
y_probs = global_model.predict(X_synth).flatten()
y_synth = (y_probs > 0.5).astype(int)

# Train distilled XGBoost model
xgb_model = XGBClassifier(eval_metric='logloss')
xgb_model.fit(X_synth, y_synth)
dump(xgb_model, "model/fraud_model.joblib")
print("fraud_model.joblib created from federated global model.")
