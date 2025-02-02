from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from langchain_mistralai.chat_models import ChatMistralAI
from langchain.memory import ConversationBufferMemory
from langchain.tools import DuckDuckGoSearchRun
from langchain.agents import initialize_agent, Tool, AgentType
from langchain.schema import HumanMessage, SystemMessage, AIMessage
from langchain.prompts import MessagesPlaceholder
import json
import os
from django.core.cache import cache

# Initialize Mistral AI
os.environ["MISTRAL_API_KEY"] = "fKvEx9jkjolPiDfSY2h6HF3RcZGyX6hi"
llm = ChatMistralAI(
    model="mistral-medium",
    temperature=0.7,
    max_tokens=2048,
    top_p=0.9,
    streaming=False
)

@method_decorator(csrf_exempt, name='dispatch')
class Chatbot(View):
    def __init__(self):
        super().__init__()
        self.search = DuckDuckGoSearchRun()
        self.system_message = """You are SmartCare, a knowledgeable and helpful medical AI assistant. Your primary role is to:

1. Provide clear, accurate medical information in a conversational and helpful manner
2. Always include important disclaimers when discussing medical conditions
3. Emphasize the importance of consulting healthcare professionals
4. Use reliable medical sources when searching for information
5. Be empathetic and understanding when discussing health concerns
6. For emergencies, strongly encourage seeking immediate medical attention
7. Structure your responses clearly with relevant medical information

Remember: While you can provide general medical information and guidance, you cannot diagnose conditions or prescribe treatments. Always encourage users to seek professional medical advice for specific health concerns."""

    def get_or_create_agent(self, session_id):
        """Get or create an agent for the session"""
        agent_key = f"medical_agent_{session_id}"
        memory_key = f"medical_memory_{session_id}"
        
        # Try to get existing memory from cache
        memory = cache.get(memory_key)
        if not memory:
            memory = ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True,
                input_key="input",
                output_key="output"
            )
            cache.set(memory_key, memory, timeout=3600)
        
        # Define tools with improved medical search
        tools = [
            Tool(
                name="Medical Information Search",
                func=self.medical_search,
                description="Search for detailed medical information about symptoms, conditions, treatments, and health topics from reliable medical sources."
            )
        ]
        
        # Initialize or get agent with improved prompting
        agent = cache.get(agent_key)
        if not agent:
            agent = initialize_agent(
                tools,
                llm,
                agent=AgentType.CONVERSATIONAL_REACT_DESCRIPTION,
                memory=memory,
                verbose=True,
                handle_parsing_errors=True,
                max_iterations=3,
                early_stopping_method="generate",
                agent_kwargs={
                    "system_message": self.system_message,
                    "extra_prompt_messages": [MessagesPlaceholder(variable_name="chat_history")]
                }
            )
            cache.set(agent_key, agent, timeout=3600)
        
        return agent, memory

    def medical_search(self, query: str) -> str:
        """Enhanced medical search function"""
        try:
            # Enhance the query for better medical results
            medical_query = f"medical information: {query} symptoms treatment causes from reputable medical sources"
            results = self.search.run(medical_query)
            
            # Format the results for better readability
            formatted_results = f"""Based on medical sources:
{results}

Note: This information is from general medical resources. Please consult a healthcare provider for personalized medical advice."""
            
            return formatted_results
        except Exception as e:
            return f"Unable to retrieve medical information at this time: {str(e)}"

    def get_response(self, query: str, session_id: str) -> tuple:
        """Get response while handling potential errors"""
        try:
            if not query:
                return "Please ask your medical question.", True
            
            try:
                agent, memory = self.get_or_create_agent(session_id)
                
                # Format the response for medical context
                enhanced_query = f"Medical question: {query}\nPlease provide relevant medical information, symptoms, or advice while maintaining appropriate medical disclaimers."
                
                response = agent.run(input=enhanced_query)
                
                # Add interaction to memory
                memory.save_context(
                    {"input": query},
                    {"output": response}
                )
                
                return response, True
            except Exception as agent_error:
                print(f"Agent error: {agent_error}")
                # Fallback to direct LLM
                messages = [
                    SystemMessage(content=self.system_message),
                    HumanMessage(content=query)
                ]
                response = llm.invoke(messages)
                return response.content if hasattr(response, 'content') else str(response), True
                
        except Exception as e:
            return f"I apologize, but I encountered an error processing your medical question. Please try rephrasing or ask another question. Error: {str(e)}", False

    def post(self, request, *args, **kwargs):
        """Handle POST requests"""
        try:
            data = json.loads(request.body)
            query = data.get('query', '')
            session_id = data.get('session_id', '')
            
            if not session_id:
                response_data = {
                    'success': False,
                    'response': 'Session ID is required'
                }
                status_code = 400
            elif not query:
                response_data = {
                    'success': False,
                    'response': 'Please ask your medical question.'
                }
                status_code = 400
            else:
                bot_response, success = self.get_response(query, session_id)
                response_data = {
                    'success': success,
                    'response': bot_response,
                    'disclaimer': ("This information is for educational purposes only. "
                                 "Please consult with a healthcare provider for medical advice.")
                }
                status_code = 200

        except json.JSONDecodeError:
            response_data = {
                'success': False,
                'response': 'Invalid request format'
            }
            status_code = 400
        except Exception as e:
            response_data = {
                'success': False,
                'response': f'Error processing request: {str(e)}'
            }
            status_code = 500

        response = JsonResponse(response_data, status=status_code)
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Credentials"] = "true"
        return response

    def options(self, request, *args, **kwargs):
        """Handle preflight CORS requests"""
        response = JsonResponse({})
        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, X-CSRFToken"
        return response