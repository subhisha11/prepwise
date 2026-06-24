from fastapi.testclient import TestClient
from app.main import app


def test_demo_login_and_dashboard():
    with TestClient(app) as client:
        health = client.get("/health")
        assert health.status_code == 200
        login = client.post(
            "/api/v1/auth/login",
            json={"email": "demo@prepwise.ai", "password": "Demo@123"},
        )
        assert login.status_code == 200
        token = login.json()["access_token"]
        dashboard = client.get(
            "/api/v1/dashboard",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert dashboard.status_code == 200
        assert dashboard.json()["metrics"]["ats_score"] > 0
