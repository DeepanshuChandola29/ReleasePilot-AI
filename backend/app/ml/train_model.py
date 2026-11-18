
import os
import joblib
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report


# Get the current folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Model output path
MODEL_PATH = os.path.join(BASE_DIR, "risk_model.pkl")


def generate_training_data():
    """
    Generate demonstration training data.

    These labels are generated using example risk rules.
    Replace this dataset with real deployment history
    when it becomes available.
    """

    data = []

    for files in range(0, 51, 2):
        for additions in range(0, 2001, 100):
            for deletions in range(0, 1001, 100):
                for sensitive in range(0, 4):

                    score = 0

                    if files > 20:
                        score += 30
                    elif files > 10:
                        score += 20
                    elif files > 5:
                        score += 10

                    if additions > 1000:
                        score += 25
                    elif additions > 500:
                        score += 15

                    if deletions > 500:
                        score += 20
                    elif deletions > 200:
                        score += 10

                    if sensitive > 0:
                        score += 25

                    score = min(score, 100)

                    if score >= 60:
                        risk = "HIGH"
                    elif score >= 30:
                        risk = "MEDIUM"
                    else:
                        risk = "LOW"

                    data.append({
                        "total_files_changed": files,
                        "total_additions": additions,
                        "total_deletions": deletions,
                        "sensitive_files_count": sensitive,
                        "risk_level": risk
                    })

    return pd.DataFrame(data)


def train_model():

    print("Generating training dataset...")

    df = generate_training_data()

    # Separate features and target
    X = df[
        [
            "total_files_changed",
            "total_additions",
            "total_deletions",
            "sensitive_files_count"
        ]
    ]

    y = df["risk_level"]

    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    print("Training Random Forest model...")

    model = RandomForestClassifier(
        n_estimators=100,
        random_state=42,
        class_weight="balanced"
    )

    model.fit(X_train, y_train)

    # Evaluate the model
    predictions = model.predict(X_test)

    accuracy = accuracy_score(y_test, predictions)

    print("\nModel Accuracy:", round(accuracy * 100, 2), "%")

    print("\nClassification Report:")
    print(classification_report(y_test, predictions))

    # Save the trained model
    joblib.dump(model, MODEL_PATH)

    print("\nModel saved successfully!")
    print("Location:", MODEL_PATH)


if __name__ == "__main__":
    train_model()
