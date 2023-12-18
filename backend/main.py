import re
from sqli import scan_sql_injection
import requests
from bs4 import BeautifulSoup
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow requests from your React frontend
origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Define a function to check for common vulnerabilities and security aspects
def assess_vulnerabilities(url):
    try:
        # Check if the URL starts with "https://" or "http://"
        if not (url.startswith("https://") or url.startswith("http://")):
            try:
            # Prepend "https://" to the URL and send a GET request
                response = requests.get("https://" + url)
                url = "https://" + url
            except requests.exceptions.RequestException:
                # If the request raises an exception, prepend "http://" to the URL and send another GET request
                try:
                    response = requests.get("http://" + url)
                    url = "http://" + url
                except requests.exceptions.RequestException:
                    # If both requests raise exceptions, raise an HTTPException
                    raise HTTPException(
                        status_code=500,
                        detail="Error: Unable to connect to the website",
                    )

        # Send a GET request to the provided URL
        response = requests.get(url)
        response.raise_for_status()

        # Get the final URL after redirects
        final_url = response.url
        print(response)
        print(response.url)

        # Parse the HTML content
        soup = BeautifulSoup(response.text, "html.parser")

        # Initialize a list to store detected vulnerabilities
        vulnerabilities = []

        # Check for common vulnerabilities using regular expressions
        common_vulnerabilities = { "XSS": [r"<script\b", r"alert\(", r"onerror="],
            "Command Injection": [
                r";\s*ls",
                r"&&\s*rm\s*-rf",
                r"\|\s*cat\s+/etc/passwd",
            ],
            "Insecure Password Storage": [r'type=["\']?password["\']?'],
            "Cross-Site Request Forgery (CSRF)": [r"csrf[-_]token", r"csrf_token"],
            "Insecure Direct Object References (IDOR)": [ r"\buser_id\b=1", r"\bfile\b=../../etc/passwd",
            ],
            "Sensitive Data Exposure": [r"\bpassword\b", r"\bapikey\b", r"\bsecret\b"],
            "Security Misconfiguration": [
            r"404\s*Not Found",
            r"403\s*Forbidden",
            r"500\s*Internal Server Error",
            r"server\s*error",
            r"misconfigured",
            r"access\s*denied",
            r"directory\s*listing\s*is\s*disabled",
            r"stack\s*trace",
            r"traceback",
            ],
            "Secure Design": [
            r"\bleast\s*privilege\b",
            r"\bprinciple\s*of\s*least\s*privilege\b",
            r"\bseparation\s*of\s*duties\b",
            r"\bdefense\s*in\s*depth\b",
            r"\bsecurity\s*by\s*design\b",
            r"\bsecure\s*architecture\b",
            r"\bauthentication\s*and\s*authorization\b",
            r"\bsecure\s*communication\b",
            r"\bsecure\s*file\s*uploads\b",
            r"\binput\s*validation\b",
            r"\boutput\s*encoding\b",
            r"\berror\s*handling\b",
            r"\bsecurity\s*policies\b",
            r"\bdata\s*classification\b",
            ],
            "Broken Authentication": [r"\blogin\b", r"authentication\s*failed"],
            "Insecure Deserialization": [r"phpserialize", r"pickle\.load\("],
            "Missing Rate Limiting": [r"429\s*Too Many Requests"],
            "Missing HTTP Security Headers": [
                r"<meta\s*http-equiv=['\"]?X-Frame-Options['\"]?[^>]*>",
                r"<meta\s*http-equiv=['\"]?X-XSS-Protection['\"]?[^>]*>",
                r"<meta\s*http-equiv=['\"]?X-Content-Type-Options['\"]?[^>]*>",
                r"<meta\s*http-equiv=['\"]?Content-Security-Policy['\"]?[^>]*>",
            ]
        }


        for vulnerability, patterns in common_vulnerabilities.items():
            for pattern in patterns:
                if re.search(pattern, soup.text, re.IGNORECASE):
                    vulnerabilities.append(vulnerability)

        # Check if the website uses HTTPS
        if not final_url.startswith("https://"):
            vulnerabilities.append("Not Using HTTPS")

        # Check for SSL certificate
        try:
            # This will raise an SSLError if the certificate is not valid
            requests.get(url, verify=True)
        except requests.exceptions.SSLError:
            vulnerabilities.append("SSL Certificate Issue")

        test = scan_sql_injection(url)

        if(test):
             vulnerabilities.append(test)

        if vulnerabilities:
            return {"vulnerabilities": vulnerabilities}
        else:
            return {"vulnerabilities": ["No Common Vulnerabilities Detected"]}

    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.get("/vulnerability/")
async def assess_url_vulnerability(url: str):
    result = assess_vulnerabilities(url)
    return {"url": url, "assessment": result}
