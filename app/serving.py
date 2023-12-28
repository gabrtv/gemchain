from langchain_google_genai import ChatGoogleGenerativeAI

def serve_model(prompt):
    llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.7)
    return llm.invoke(prompt)

def serve_model_streaming(prompt):
    llm = ChatGoogleGenerativeAI(model="gemini-pro", streaming=True)  # Enable streaming
    for chunk in llm.stream(prompt):
        #yield chunk.content.encode('utf-8')        
        yield f"data: {chunk.content.encode('utf-8')}\n\n"
