from pymongo import MongoClient
from dotenv import load_dotenv
from utils.validators import initialize_collections
import os

load_dotenv()

uri = os.getenv('MONGO_URI')
client = MongoClient(uri)

db = client["Nutrikids"]

initialize_collections(db)
