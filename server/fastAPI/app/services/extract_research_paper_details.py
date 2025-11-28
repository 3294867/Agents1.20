from pydantic import BaseModel
from app.utils.get_client import get_client

class ResearchPaperExtraction(BaseModel):
    title: str
    authors: list[str]
    abstract: str
    keywords: list[str]

async def extract_research_paper_details():
    client = get_client()

    pdf = await client.files.create(
        file=open("./app/services/sample.pdf", "rb"),
        purpose="user_data"
    )

    response = await client.responses.parse(
        model="gpt-4o-2024-08-06",
        input=[
            {
                "role": "system",
                "content": "Extract research paper information"
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_file",
                        "file_id": pdf.id
                    }
                ]
            }
        ],
        text_format=ResearchPaperExtraction
    )

    return response.output_text
