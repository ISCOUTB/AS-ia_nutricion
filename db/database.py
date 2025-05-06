from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

uri = f"mongodb+srv://nutritionai:{os.getenv('db_password')}@as-ai-nutrition.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000"
client = MongoClient(uri)
