import pandas as pd
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE
from joblib import dump

# Load dataset
df = pd.read_csv("data/fraud_dataset.csv")

# Separate features and target
X = df.drop("Class", axis=1)  # 30 PCA columns
y = df["Class"]

# Split before resampling (to avoid data leakage)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Apply SMOTE on training data only
sm = SMOTE(random_state=42)
X_train_bal, y_train_bal = sm.fit_resample(X_train, y_train)

print(f"Original training samples: {len(X_train)}, Fraud count: {sum(y_train)}")
print(f"After SMOTE samples: {len(X_train_bal)}, Fraud count: {sum(y_train_bal)}")

# Train model
model = XGBClassifier(use_label_encoder=False, eval_metric="logloss")
model.fit(X_train_bal, y_train_bal)

# Save model
dump(model, "model/fraud_model.joblib")
print("✅ Model trained on balanced data and saved to model/fraud_model.joblib")