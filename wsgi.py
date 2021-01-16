from dotenv import load_dotenv
load_dotenv()
from backend import app
if __name__ == "__main__":
  app.run()