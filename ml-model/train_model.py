import pandas as pd
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from joblib import dump

# Load dataset
df = pd.read_csv("data/fraud_dataset.csv")

# Features and labels
X = df.drop("Class", axis=1)  # 30 columns
y = df["Class"]               # 0 = legit, 1 = fraud

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train XGBoost model
model = XGBClassifier(use_label_encoder=False, eval_metric="logloss")
model.fit(X_train, y_train)

# Save model
dump(model, "model/fraud_model.joblib")
print("Model trained and saved to model/fraud_model.joblib")
