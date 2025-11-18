import { useState, useCallback, useRef } from 'react';
import { streamAPI } from '../utils/streamingAPI';
import { StreamingTagParser } from '../utils/tagParser';

/**
 * 스트리밍 API 호출을 위한 커스텀 훅
 */
export function useStreaming() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [fullText, setFullText] = useState('');
  const parserRef = useRef(null);

  /**
   * 스트리밍 시작
   * @param {string} endpoint - API 엔드포인트
   * @param {object} requestData - 요청 데이터
   * @param {function} onElement - 파싱된 요소를 받을 때 호출되는 콜백
   * @param {function} onComplete - 완료 시 호출되는 콜백
   */
  const startStreaming = useCallback(async (endpoint, requestData, onElement, onComplete) => {
    setIsStreaming(true);
    setError(null);
    setFullText('');
    
    // 파서 초기화
    parserRef.current = new StreamingTagParser();

    try {
      await streamAPI(
        endpoint,
        requestData,
        (chunk) => {
          // 전체 텍스트 누적
          setFullText(prev => prev + chunk);
          
          // 파싱
          const elements = parserRef.current.addChunk(chunk);
          
          // 파싱된 요소들을 하나씩 전달
          elements.forEach(element => {
            onElement?.(element);
          });
        },
        () => {
          // 스트리밍 완료
          const remaining = parserRef.current.complete();
          remaining.forEach(element => {
            onElement?.(element);
          });
          
          setIsStreaming(false);
          onComplete?.();
        },
        (err) => {
          setError(err);
          setIsStreaming(false);
        }
      );
    } catch (err) {
      setError(err);
      setIsStreaming(false);
    }
  }, []);

  /**
   * 스트리밍 중지
   */
  const stopStreaming = useCallback(() => {
    setIsStreaming(false);
    if (parserRef.current) {
      parserRef.current.reset();
    }
  }, []);

  return {
    isStreaming,
    error,
    fullText,
    startStreaming,
    stopStreaming,
  };
}

