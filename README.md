# game-BE-websocket

## Running the Application Locally

Make sure you have all the files in the correct structure as shown above.

Activate your virtual environment:

```
source venv/bin/activate 
```

Install dependencies:

```
pip install -r requirements.txt
```

Run the application:

```
uvicorn main:app --reload
```

Open your browser and navigate to:
http://localhost:8000/static/index.html