import pandas as pd
from sklearn.model_selection import train_test_split
import os

# Load full dataset
df = pd.read_csv("data/fraud_dataset.csv")
print("Full dataset:", df.shape)

# Shuffle and split
df1, temp = train_test_split(df, test_size=0.66, random_state=42)
df2, df3 = train_test_split(temp, test_size=0.5, random_state=42)

print("Client 1:", df1.shape)
print("Client 2:", df2.shape)
print("Client 3:", df3.shape)

# Save to client CSVs
os.makedirs("data", exist_ok=True)
df1.to_csv("data/client_1.csv", index=False, mode='w')
df2.to_csv("data/client_2.csv", index=False, mode='w')
df3.to_csv("data/client_3.csv", index=False, mode='w')

print("Data split into 3 client files")
