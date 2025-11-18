from anthropic import Anthropic
from app.core.config import settings
from typing import Iterator


class ClaudeClient:
    """Wrapper for Claude API client."""
    
    def __init__(self):
        self.client = Anthropic(api_key=settings.CLAUDE_API_KEY)
        self.model = settings.CLAUDE_MODEL
        self.max_tokens = settings.CLAUDE_MAX_TOKENS
        self.temperature = settings.CLAUDE_TEMPERATURE
    
    def generate(
        self,
        system_prompt: str,
        user_message: str,
        max_tokens: int | None = None,
        temperature: float | None = None,
    ) -> str:
        """
        Generate a response from Claude.
        
        Args:
            system_prompt: System prompt for Claude
            user_message: User message/query
            max_tokens: Maximum tokens to generate (overrides default)
            temperature: Temperature for generation (overrides default)
        
        Returns:
            Generated text response
        """
        response = self.client.messages.create(
            model=self.model,
            max_tokens=max_tokens or self.max_tokens,
            temperature=temperature or self.temperature,
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_message}
            ]
        )
        
        return response.content[0].text
    
    def generate_stream(
        self,
        system_prompt: str,
        user_message: str,
        max_tokens: int | None = None,
        temperature: float | None = None,
    ) -> Iterator[str]:
        """
        Generate a streaming response from Claude.
        
        Args:
            system_prompt: System prompt for Claude
            user_message: User message/query
            max_tokens: Maximum tokens to generate (overrides default)
            temperature: Temperature for generation (overrides default)
        
        Yields:
            Text chunks as they arrive
        """
        try:
            with self.client.messages.stream(
                model=self.model,
                max_tokens=max_tokens or self.max_tokens,
                temperature=temperature or self.temperature,
                system=system_prompt,
                messages=[
                    {"role": "user", "content": user_message}
                ]
            ) as stream:
                for text in stream.text_stream:
                    print(f"[LLM 청크] {repr(text)}")  # 디버깅
                    yield text
        except Exception as e:
            yield f"[@에러]에러가 발생했습니다: {str(e)}[@에러_끝]"


# Singleton instance
claude_client = ClaudeClient()

