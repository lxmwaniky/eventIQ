import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Initialize Gemini client
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

app = FastAPI()

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request body model
class ChatInput(BaseModel):
    conversation: str


def get_gemini_response(conversation: str):
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=conversation,
            config=types.GenerateContentConfig(
                system_instruction="""
                You are a professional business conversation analyst.

                Your task is to generate a clear, structured, and detailed summary
                of the provided chat conversation between two parties.

                Focus ONLY on extracting and summarizing key business-relevant discussions.

                Output Requirements:
                - Use clear section headings
                - Distinguish Party A and Party B
                - Separate agreed vs proposed terms
                - Identify unresolved issues
                - Preserve exact financial figures
                - Be concise but complete
                - If no business discussion exists, say:
                  "No business-relevant discussion identified."
                """,
                max_output_tokens=1000,
                temperature=0.3,  # lower = more deterministic
                top_p=0.8,
            ),
        )

        return response.text

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/summarize")
async def summarize_chat(data: ChatInput):
    summary = get_gemini_response(data.conversation)
    return {"summary": summary}