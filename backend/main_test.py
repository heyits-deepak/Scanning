# tests/test_main.py

from fastapi.testclient import TestClient
from main import app

# Create a TestClient instance
client = TestClient(app)

def test_assess_url_vulnerability_valid_url_with_vulnerabilities():
    # Test a URL with common vulnerabilities
    url_with_vulnerabilities = "https://www.jimsindia.org/"

    # Make the HTTP request
    response = client.get(f"/vulnerability?url={url_with_vulnerabilities}")

    # Check the response status code
    assert response.status_code == 200

    # Check the presence of 'vulnerabilities' directly within 'assessment'
    assert 'assessment' in response.json()
    assert 'vulnerabilities' in response.json()['assessment']

def test_assess_url_vulnerability_valid_url_without_vulnerabilities():
    # Test a URL without common vulnerabilities
    url_without_vulnerabilities = "https://www.google.com/"

    # Make the HTTP request
    response = client.get(f"/vulnerability?url={url_without_vulnerabilities}")

    # Check the response status code
    assert response.status_code == 200

    # Check the presence of 'vulnerabilities' directly within 'assessment'
    assert 'assessment' in response.json()
    assert 'vulnerabilities' in response.json()['assessment']

    # Check that the 'vulnerabilities' list is ["No Common Vulnerabilities Detected"]
    assert response.json()['assessment']['vulnerabilities'] == ["No Common Vulnerabilities Detected"]

def test_assess_url_vulnerability_invalid_url():
    # Test an invalid URL
    invalid_url = "invalidurl"

    # Make the HTTP request
    response = client.get(f"/vulnerability?url={invalid_url}")

    # Check the response status code
    assert response.status_code == 500

    # Check that the expected error message is present in the response JSON
    assert "Error: Unable to connect to the website" in response.json()["detail"]

def test_assess_url_vulnerability_empty_url():
    # Test an empty URL
    empty_url = ""

    # Make the HTTP request
    response = client.get(f"/vulnerability?url={empty_url}")

    # Check the response status code
    assert response.status_code == 500  # Adjusted to expect a 500 status code

    # Check the presence of 'detail' key in the response JSON
    assert 'detail' in response.json()

    # Check that the 'detail' key contains the expected error message
    assert "Error: Unable to connect to the website" in response.json()['detail']

    # You can add more specific assertions based on the expected behavior for an empty URL


def test_assess_url_vulnerability_url_with_parameters():
    # Test a URL with parameters (Wikipedia search URL)
    url_with_parameters = "https://en.wikipedia.org/w/index.php?search=python"

    # Make the HTTP request
    response = client.get(f"/vulnerability?url={url_with_parameters}")

    # Check the response status code
    assert response.status_code == 200  # Adjusted to expect a 200 status code for a valid URL

    # Check the presence of 'assessment' key in the response JSON
    assert 'assessment' in response.json()

    # Check that the 'vulnerabilities' key contains a specific substring indicating no common vulnerabilities
    assert "No Common Vulnerabilities Detected" in response.json()['assessment']['vulnerabilities']

    # You can add more specific assertions based on the expected behavior for a URL with parameters
