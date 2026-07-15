"""
rag_chatbot.py
---------------
AI Tax Chatbot using Retrieval-Augmented Generation (RAG), built with:
- LangChain  -> orchestration (prompts, chaining retrieval + LLM)
- FAISS      -> fast vector search over our tax knowledge base
- Gemini     -> the actual language model that writes the answer

Simple explanation of RAG:
1. We keep a small set of Indian tax facts in data/tax_knowledge.json.
2. We convert each fact into a vector (embedding) and store it in FAISS.
3. When the user asks a question, we search FAISS for the most relevant
   facts (this is the "Retrieval" step).
4. We hand those facts + the question to Gemini, so it answers using
   real, grounded information instead of guessing (this is "Generation").

This keeps the chatbot accurate and focused on Indian taxation, instead
of relying purely on what the model "remembers".
"""

import os
import json

from langchain.docstore.document import Document
from langchain.prompts import ChatPromptTemplate
from langchain_community.vectorstores import FAISS
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings

# Path to our small knowledge base of Indian tax facts
KNOWLEDGE_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "tax_knowledge.json")

# Gemini models used for embeddings (search) and chat (answering).
# NOTE: Google periodically retires older model names. If you ever see a
# "404 model not found" or "no longer available" error, check
# https://ai.google.dev/gemini-api/docs/models for current model names.
EMBEDDING_MODEL = "models/gemini-embedding-001"
CHAT_MODEL = "gemini-flash-latest"  # auto-updating alias, avoids hardcoding a version that gets retired

# Instructions that shape how Gemini should behave and respond
SYSTEM_PROMPT = """You are TaxBuddy AI, a friendly assistant that helps Indian
citizens understand Income Tax — slabs, deductions, HRA, tax regimes, and ITR filing.

Rules:
- Only answer questions about Indian income tax. If asked something unrelated,
  politely say you can only help with Indian income tax topics.
- Base your answer primarily on the "Reference Facts" provided below.
- Keep answers short, clear, and easy for a non-expert to understand.
- If the question involves a final filing decision, remind the user this is
  general guidance and not professional tax advice.

Reference Facts:
{context}
"""


class RagChatbot:
    """Wraps the FAISS vector store + Gemini chat model into one simple chatbot."""

    def __init__(self):
        self.vectorstore = None
        self.llm = None
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("human", "{question}"),
        ])

    def build(self):
        """
        Called once when the server starts.
        Loads the knowledge base, builds embeddings, and creates the
        FAISS vector store + the Gemini chat model.
        """
        api_key = os.getenv("GEMINI_API_KEY")

        # Step 1: Load our tax facts from the JSON file
        with open(KNOWLEDGE_FILE, "r", encoding="utf-8") as f:
            facts = json.load(f)

        # Step 2: Turn each fact into a LangChain "Document"
        documents = [
            Document(
                page_content=f"{item['topic']}: {item['content']}",
                metadata={"topic": item["topic"]},
            )
            for item in facts
        ]

        # Step 3: Create embeddings (text -> vector of numbers) using Gemini
        embeddings = GoogleGenerativeAIEmbeddings(model=EMBEDDING_MODEL, google_api_key=api_key)

        # Step 4: Build the FAISS vector store from our documents + embeddings
        self.vectorstore = FAISS.from_documents(documents, embeddings)

        # Step 5: Set up the Gemini chat model used to generate answers
        self.llm = ChatGoogleGenerativeAI(model=CHAT_MODEL, google_api_key=api_key, temperature=0.3)

        print(f"[RAG] Chatbot ready. Indexed {len(documents)} tax facts with FAISS.")

    def ask(self, question: str) -> str:
        """
        Main function used by the API route.
        1. Retrieves the most relevant facts from FAISS for this question.
        2. Sends the facts + question to Gemini via a LangChain prompt chain.
        3. Returns the generated answer as plain text.
        """
        if self.vectorstore is None or self.llm is None:
            raise RuntimeError("Chatbot not initialized. Call build() first.")

        # Retrieval step: find the top 3 most relevant facts for this question
        relevant_docs = self.vectorstore.similarity_search(question, k=3)
        context = "\n".join(f"- {doc.page_content}" for doc in relevant_docs)

        # Generation step: LangChain "chain" = prompt template piped into the LLM
        chain = self.prompt | self.llm
        response = chain.invoke({"context": context, "question": question})

        return response.content


# A single shared instance used across the whole backend app
rag_chatbot = RagChatbot()
