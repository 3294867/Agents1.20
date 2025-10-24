import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

def get_client():
  api_key = os.getenv("OPENAI_API_KEY") 
  client = OpenAI(api_key=api_key)
  return client