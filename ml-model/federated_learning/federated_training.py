import pandas as pd
import tensorflow as tf
import numpy as np
import os

# Define model architecture
def create_model():
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(32, activation='relu', input_shape=(30,)),
        tf.keras.layers.Dense(1, activation='sigmoid')
    ])
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    return model

# Load and train on each client's data
client_models = []
client_files = ["data/client_1.csv", "data/client_2.csv", "data/client_3.csv"]

for file in client_files:
    df = pd.read_csv(file)
    X = df.drop("Class", axis=1).values
    y = df["Class"].values
    model = create_model()
    model.fit(X, y, epochs=5, batch_size=8, verbose=0)  # You can increase epochs
    client_models.append(model)
    print(f"Trained on {file}")

# Function to average model weights
def average_weights(models):
    new_weights = []
    for weights in zip(*[m.get_weights() for m in models]):
        new_weights.append(np.mean(weights, axis=0))
    return new_weights

# Average the weights
averaged_weights = average_weights(client_models)

# Assign averaged weights to a new global model
global_model = create_model()
global_model.set_weights(averaged_weights)

# Save the global model
os.makedirs("model", exist_ok=True)
global_model.save("model/global_fraud_model.keras")
print("Global model saved as global_fraud_model.keras")

from xgboost import XGBClassifier
from joblib import dump

# Generate synthetic data for distillation
X_synth = np.random.normal(0, 1, size=(10000, 30))
y_probs = global_model.predict(X_synth).flatten()
y_synth = (y_probs > 0.5).astype(int)

# Train an XGBoost model
xgb_model = XGBClassifier(use_label_encoder=False, eval_metric='logloss')
xgb_model.fit(X_synth, y_synth)
dump(xgb_model, "model/fraud_model.joblib")
print("fraud_model.joblib created from simulated federated learning.")
