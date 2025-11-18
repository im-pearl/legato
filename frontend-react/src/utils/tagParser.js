/**
 * 태그 파서 유틸리티
 * 
 * 스트리밍으로 들어오는 텍스트를 파싱하여 태그와 일반 텍스트를 구분합니다.
 */

/**
 * 스트리밍 텍스트 파서 클래스
 */
export class StreamingTagParser {
  constructor() {
    this.buffer = '';
    this.currentTag = null;
    this.tagContent = '';
    this.elements = []; // { type: 'tag' | 'text', tag: string, content: string }
  }

  /**
   * 새로운 청크를 추가하고 파싱
   * @param {string} chunk - 텍스트 청크
   * @returns {Array} 새로 파싱된 요소들
   */
  addChunk(chunk) {
    this.buffer += chunk;
    return this.parse();
  }

  /**
   * 버퍼를 파싱하여 태그와 텍스트 추출
   * @returns {Array} 새로 파싱된 요소들
   */
  parse() {
    const newElements = [];
    let i = 0;

    while (i < this.buffer.length) {
      // @ 태그 시작 감지
      if (this.buffer[i] === '@') {
        // 태그 이름 추출 (다음 공백, 줄바꿈, : 또는 @까지)
        let tagEnd = i + 1;
        while (
          tagEnd < this.buffer.length &&
          this.buffer[tagEnd] !== '\n' &&
          this.buffer[tagEnd] !== '\r' &&
          this.buffer[tagEnd] !== ' ' &&
          this.buffer[tagEnd] !== ':' &&
          this.buffer[tagEnd] !== '@'
        ) {
          tagEnd++;
        }

        const tagName = this.buffer.substring(i + 1, tagEnd);

        // 태그 시작
        if (!this.currentTag) {
          this.currentTag = tagName;
          this.tagContent = '';
          
          // 태그 시작 이벤트 (UI 렌더링용)
          newElements.push({
            type: 'tag_start',
            tag: tagName,
            content: '',
          });

          // : 다음의 내용도 같이 처리 (예: @issue1:강제추행)
          if (this.buffer[tagEnd] === ':') {
            i = tagEnd + 1;
            continue;
          } else {
            i = tagEnd;
            continue;
          }
        }
        // 태그 종료 (현재 태그와 같은 이름)
        else if (tagName === 'end' || tagName === '끝') {
          newElements.push({
            type: 'tag_end',
            tag: this.currentTag,
            content: this.tagContent.trim(),
          });

          this.currentTag = null;
          this.tagContent = '';
          i = tagEnd;
          
          // 줄바꿈 건너뛰기
          while (i < this.buffer.length && (this.buffer[i] === '\n' || this.buffer[i] === '\r')) {
            i++;
          }
          continue;
        }
        // 다른 태그 시작 (중첩)
        else {
          // 현재 태그 내용에 추가
          this.tagContent += this.buffer[i];
          i++;
          continue;
        }
      }

      // 태그 내부일 경우
      if (this.currentTag) {
        this.tagContent += this.buffer[i];
        
        // 태그 내부 텍스트 업데이트 이벤트
        if (this.buffer[i] !== '\r') { // \r은 건너뛰기
          newElements.push({
            type: 'tag_content',
            tag: this.currentTag,
            content: this.buffer[i],
          });
        }
      }
      // 태그 외부 (일반 텍스트)
      else {
        if (this.buffer[i] !== '\r') { // \r은 건너뛰기
          newElements.push({
            type: 'text',
            content: this.buffer[i],
          });
        }
      }

      i++;
    }

    // 처리된 부분 제거
    this.buffer = '';

    return newElements;
  }

  /**
   * 파싱 완료
   */
  complete() {
    const remaining = [];
    
    if (this.currentTag && this.tagContent) {
      remaining.push({
        type: 'tag_end',
        tag: this.currentTag,
        content: this.tagContent.trim(),
      });
    }

    this.currentTag = null;
    this.tagContent = '';
    this.buffer = '';

    return remaining;
  }

  /**
   * 리셋
   */
  reset() {
    this.buffer = '';
    this.currentTag = null;
    this.tagContent = '';
    this.elements = [];
  }
}

/**
 * 완성된 텍스트에서 태그 추출 (스트리밍 완료 후)
 * @param {string} text - 전체 텍스트
 * @returns {Object} 태그별 내용을 담은 객체
 */
export function extractTags(text) {
  const result = {};
  const tagRegex = /@(\w+)[:\s]*(.*?)@(?:end|끝)/gs;
  
  let match;
  while ((match = tagRegex.exec(text)) !== null) {
    const [, tagName, content] = match;
    
    if (!result[tagName]) {
      result[tagName] = [];
    }
    
    result[tagName].push(content.trim());
  }
  
  return result;
}

/**
 * issues 태그 파싱 (쟁점 리스트)
 * @param {string} text - 전체 텍스트
 * @returns {Array} 쟁점 배열
 */
export function parseIssues(text) {
  const issues = [];
  const issueRegex = /@issue\d+\s+(.*?)\s*@(?:end|끝)/gs;
  
  let match;
  while ((match = issueRegex.exec(text)) !== null) {
    issues.push(match[1].trim());
  }
  
  return issues;
}

/**
 * precedents 태그 파싱 (판례 리스트)
 * @param {string} text - 전체 텍스트
 * @returns {Object} 쟁점별 판례 객체
 */
export function parsePrecedents(text) {
  const result = {};
  
  // 쟁점별로 분리
  const issueRegex = /@issue\d+:(.*?)(?=@issue\d+:|$)/gs;
  let issueMatch;
  
  while ((issueMatch = issueRegex.exec(text)) !== null) {
    const [fullMatch] = issueMatch;
    const issueTitle = issueMatch[1].trim();
    
    // 해당 쟁점의 판례들 추출
    const cases = [];
    const caseRegex = /@case\d+\s+@num:(.*?)\s+@summary:(.*?)\s+@(?:end|끝)/gs;
    let caseMatch;
    
    while ((caseMatch = caseRegex.exec(fullMatch)) !== null) {
      cases.push({
        caseNumber: caseMatch[1].trim(),
        summary: caseMatch[2].trim(),
        selected: true, // 기본값: 선택됨
      });
    }
    
    result[issueTitle] = cases;
  }
  
  return result;
}

/**
 * report 태그 파싱 (판단 및 승소가능성)
 * @param {string} text - 전체 텍스트
 * @returns {Object} 판단 및 승소가능성 정보
 */
export function parseReport(text) {
  const result = {
    issues: [],
    probability: null,
  };
  
  // 쟁점별 판단 추출
  const issueRegex = /@issue\d+\.\s*(.*?)\s+(.*?)\s*@(?:end|끝)/gs;
  let match;
  
  while ((match = issueRegex.exec(text)) !== null) {
    result.issues.push({
      title: match[1].trim(),
      judgment: match[2].trim(),
    });
  }
  
  // 승소가능성 추출
  const probRegex = /@prob\s+-\s*(\d+)~(\d+)\s+-\s*(.*?)\s*@(?:end|끝)/s;
  const probMatch = text.match(probRegex);
  
  if (probMatch) {
    result.probability = {
      min: parseInt(probMatch[1]),
      max: parseInt(probMatch[2]),
      reason: probMatch[3].trim(),
    };
  }
  
  return result;
}

