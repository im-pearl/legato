/**
 * 하이라이트가 포함된 텍스트를 LLM 전송용 형식으로 변환
 * 하이라이트된 부분은 **텍스트** 형식으로 변환
 */
export function formatTextForLLM(text, highlights = []) {
  if (!text || highlights.length === 0) {
    return text;
  }

  // 하이라이트를 정렬
  const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
  
  let result = '';
  let lastIndex = 0;

  sortedHighlights.forEach((highlight) => {
    // 하이라이트 이전 텍스트
    result += text.slice(lastIndex, highlight.start);
    
    // 하이라이트된 텍스트를 **로 감싸기
    result += '**' + text.slice(highlight.start, highlight.end) + '**';
    
    lastIndex = highlight.end;
  });

  // 마지막 텍스트
  result += text.slice(lastIndex);

  return result;
}

/**
 * 의뢰서와 상담결과지의 모든 데이터를 LLM 전송용 형식으로 변환
 */
export function prepareDataForLLM(qaItems, consultationGroups) {
  const formattedData = {
    requestForm: qaItems.map((item) => ({
      question: item.question,
      answer: formatTextForLLM(item.answer, item.highlights),
      originalAnswer: item.answer,
      highlights: item.highlights,
    })),
    consultationResult: {},
  };

  Object.entries(consultationGroups).forEach(([groupName, items]) => {
    formattedData.consultationResult[groupName] = items.map((item) => ({
      label: item.label,
      value: formatTextForLLM(item.value, item.highlights),
      originalValue: item.value,
      highlights: item.highlights,
    }));
  });

  return formattedData;
}

