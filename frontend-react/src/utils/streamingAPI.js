/**
 * 스트리밍 API 호출 유틸리티
 */

const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * 스트리밍 API 호출
 * @param {string} endpoint - API 엔드포인트 (예: '/issues/stream')
 * @param {object} requestData - 요청 데이터
 * @param {function} onChunk - 텍스트 청크를 받을 때 호출되는 콜백
 * @param {function} onComplete - 스트리밍 완료 시 호출되는 콜백
 * @param {function} onError - 에러 발생 시 호출되는 콜백
 */
export async function streamAPI(endpoint, requestData, onChunk, onComplete, onError) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        onComplete?.();
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
  } catch (error) {
    console.error('Streaming API error:', error);
    onError?.(error);
  }
}

/**
 * 스트리밍 응답을 완전히 수집하는 유틸리티
 * @param {string} endpoint - API 엔드포인트
 * @param {object} requestData - 요청 데이터
 * @returns {Promise<string>} 전체 응답 텍스트
 */
export async function streamAPIComplete(endpoint, requestData) {
  return new Promise((resolve, reject) => {
    let fullText = '';
    
    streamAPI(
      endpoint,
      requestData,
      (chunk) => {
        fullText += chunk;
      },
      () => {
        resolve(fullText);
      },
      (error) => {
        reject(error);
      }
    );
  });
}

