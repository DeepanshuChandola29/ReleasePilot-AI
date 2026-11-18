
from fastapi.testclient import TestClient

from app.main import app
from app.routes import github, risk, release


client = TestClient(app)


def test_github_compare_success(monkeypatch):
    def mock_compare(**kwargs):
        return {
            "repository": "owner/repo",
            "base_commit": "abc123",
            "head_commit": "def456",
            "total_commits": 2,
            "total_files_changed": 1,
            "total_additions": 10,
            "total_deletions": 2,
            "files": []
        }

    monkeypatch.setattr(
        github,
        "compare_github_commits",
        mock_compare
    )

    response = client.get(
        "/api/github/compare",
        params={
            "owner": "owner",
            "repo": "repo",
            "base": "abc123",
            "head": "def456"
        }
    )

    assert response.status_code == 200
    assert response.json()["status"] == "success"


def test_github_compare_invalid_request():
    response = client.get("/api/github/compare")

    assert response.status_code == 422


def test_risk_prediction_success(monkeypatch):
    def mock_predict(data):
        return {
            "risk_level": "Low",
            "risk_score": 20
        }

    monkeypatch.setattr(
        risk,
        "predict_release_risk",
        mock_predict
    )

    response = client.post(
        "/api/risk/predict",
        json={
            "total_files_changed": 2,
            "total_additions": 10,
            "total_deletions": 3,
            "files": []
        }
    )

    assert response.status_code == 200
    assert response.json()["status"] == "success"


def test_risk_prediction_rejects_negative_values():
    response = client.post(
        "/api/risk/predict",
        json={
            "total_files_changed": -1,
            "total_additions": 10,
            "total_deletions": 3,
            "files": []
        }
    )

    assert response.status_code == 422


def test_release_analysis_success(monkeypatch):
    def mock_compare(**kwargs):
        return {
            "repository": "owner/repo",
            "base_commit": "abc123",
            "head_commit": "def456",
            "total_commits": 2,
            "total_files_changed": 1,
            "total_additions": 10,
            "total_deletions": 2,
            "files": []
        }

    def mock_predict(data):
        return {
            "risk_level": "Low",
            "risk_score": 20
        }

    monkeypatch.setattr(
        release,
        "compare_github_commits",
        mock_compare
    )

    monkeypatch.setattr(
        release,
        "predict_release_risk",
        mock_predict
    )

    response = client.post(
        "/api/release/analyze",
        json={
            "owner": "owner",
            "repo": "repo",
            "base": "abc123",
            "head": "def456"
        }
    )

    assert response.status_code == 200
    assert response.json()["status"] == "success"
    assert "risk_analysis" in response.json()["data"]


def test_release_analysis_rejects_empty_fields():
    response = client.post(
        "/api/release/analyze",
        json={
            "owner": "",
            "repo": "repo",
            "base": "abc123",
            "head": "def456"
        }
    )

    assert response.status_code == 422

def test_health_check_success():
    response = client.get("/api/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "success"
    assert data["application"] == "ReleasePilot AI"
    assert "timestamp" in data
