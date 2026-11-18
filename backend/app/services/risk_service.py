
import os
import joblib
import pandas as pd


# Find the trained model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "..",
    "ml",
    "risk_model.pkl"
)

# Load the model once when the service is imported
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        "Trained model not found. Run: python -m app.ml.train_model"
    )

model = joblib.load(MODEL_PATH)


def predict_release_risk(comparison_data: dict):
    """
    Predict release risk using the trained Random Forest model.
    """

    total_files = comparison_data.get("total_files_changed", 0)
    additions = comparison_data.get("total_additions", 0)
    deletions = comparison_data.get("total_deletions", 0)

    files = comparison_data.get("files", [])

    # Identify sensitive files
    sensitive_keywords = [
        "auth",
        "security",
        "login",
        "payment",
        "database",
        "config",
        "migration",
        "permission",
        "secret"
    ]

    sensitive_files = []

    for file in files:
        filename = file.get("filename", "").lower()

        if any(keyword in filename for keyword in sensitive_keywords):
            sensitive_files.append(file.get("filename"))

    sensitive_count = len(sensitive_files)

    # Prepare model input
    features = pd.DataFrame([{
        "total_files_changed": total_files,
        "total_additions": additions,
        "total_deletions": deletions,
        "sensitive_files_count": sensitive_count
    }])

    # Predict risk level
    prediction = model.predict(features)[0]

    # Calculate prediction confidence, if supported
    confidence = None

    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(features)[0]
        confidence = round(float(max(probabilities)) * 100, 2)

    # Generate explanations for the prediction
    reasons = []

    if total_files > 10:
        reasons.append("A large number of files have changed")

    if additions > 500:
        reasons.append("A high number of code lines have been added")

    if deletions > 200:
        reasons.append("A significant amount of code has been deleted")

    if sensitive_files:
        reasons.append("Sensitive application files have been modified")

    if not reasons:
        reasons.append("No major change indicators detected")

    # Deployment recommendation
    recommendations = {
        "LOW": "Proceed with standard testing before deployment.",
        "MEDIUM": "Run additional tests and review the changed files.",
        "HIGH": "Require detailed code review and extensive testing before deployment."
    }

    return {
        "risk_level": str(prediction),
        "prediction_confidence": confidence,
        "reasons": reasons,
        "sensitive_files": sensitive_files,
        "recommendation": recommendations.get(
            str(prediction),
            "Review the release before deployment."
        )
    }
