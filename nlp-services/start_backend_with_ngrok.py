import os
import subprocess
import time
from pyngrok import ngrok
import sys

# Load environment variables if needed
from dotenv import load_dotenv
load_dotenv()

# Kill any existing ngrok processes
ngrok.kill()

# Start ngrok tunnel for NLP service
tunnel = ngrok.connect(8000, bind_tls=True)
public_url = tunnel.public_url  # ✅ Get only the URL, e.g., https://xxxx.ngrok-free.app

print(f"Public NLP URL: {public_url}")

# Path to your frontend .env file
frontend_env_path = os.path.join(
    os.path.dirname(__file__),
    "..",
    "journalfront",
    "projectjournal",
    ".env"
)

# Make sure path is absolute
frontend_env_path = os.path.abspath(frontend_env_path)

# Update or create the .env file with REACT_APP_NLP_URL
lines = []
if os.path.exists(frontend_env_path):
    with open(frontend_env_path, "r") as f:
        lines = f.readlines()

# Remove old REACT_APP_NLP_URL entries
lines = [line for line in lines if not line.startswith("REACT_APP_NLP_URL=")]
lines.append(f"REACT_APP_NLP_URL={public_url}\n")

with open(frontend_env_path, "w") as f:
    f.writelines(lines)

print(f"Updated {frontend_env_path} with NLP URL")

# Start the NLP FastAPI server
subprocess.Popen([sys.executable, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"])

# Keep the script running so ngrok stays open
try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    ngrok.kill()
