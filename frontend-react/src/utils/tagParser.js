/**
 * 태그 파서 유틸리티
 * 
 * 스트리밍으로 들어오는 텍스트를 파싱하여 태그와 일반 텍스트를 구분합니다.
 */

/**
 * 스트리밍 텍스트 파서 클래스 (@tag@ 형식)
 */
export class StreamingTagParser {
  constructor() {
    this.buffer = '';           // 미처리 텍스트 버퍼
    this.currentTag = null;     // 현재 열린 태그
    this.tagContent = '';       // 태그 내용
    this.pendingAt = false;     // @ 대기 중
    this.pendingTag = '';       // @ 이후 축적 중인 태그명
  }

  /**
   * 새로운 청크를 추가하고 파싱
   * @param {string} chunk - 텍스트 청크
   * @returns {Array} 새로 파싱된 요소들
   */
  addChunk(chunk) {
    const newElements = [];
    
    for (let i = 0; i < chunk.length; i++) {
      const char = chunk[i];
      
      // @ 감지
      if (char === '@') {
        // 이미 @ 대기 중이면 태그 완성
        if (this.pendingAt) {
          const tagName = this.pendingTag;
          
          // @end@ 태그 - 현재 열린 태그 종료
          if (tagName === 'end' && this.currentTag) {
            // 버퍼에 남은 태그 내용 먼저 처리
            for (const c of this.buffer) {
              if (c !== '\r') {
                this.tagContent += c;
                newElements.push({
                  type: 'tag_content',
                  tag: this.currentTag,
                  content: c,
                });
              }
            }
            this.buffer = '';
            
            // 태그 종료
            newElements.push({
              type: 'tag_end',
              tag: this.currentTag,
              content: this.tagContent.trim(),
            });
            this.currentTag = null;
            this.tagContent = '';
          }
          // 태그 시작
          else if (!this.currentTag) {
            // 버퍼에 남은 일반 텍스트 먼저 처리
            for (const c of this.buffer) {
              if (c !== '\r') {
                newElements.push({
                  type: 'text',
                  content: c,
                });
              }
            }
            this.buffer = '';
            
            // 태그 시작
            this.currentTag = tagName;
            this.tagContent = '';
            newElements.push({
              type: 'tag_start',
              tag: tagName,
              content: '',
            });
          }
          // 중첩된 다른 태그 (내용으로 처리)
          else {
            this.buffer += '@' + this.pendingTag + '@';
          }
          
          // @ 대기 상태 초기화
          this.pendingAt = false;
          this.pendingTag = '';
        }
        // @ 처음 등장 - 대기 시작
        else {
          this.pendingAt = true;
          this.pendingTag = '';
        }
      }
      // @ 대기 중일 때
      else if (this.pendingAt) {
        // 알파벳/숫자면 태그명에 추가
        if (/[a-zA-Z0-9]/.test(char)) {
          this.pendingTag += char;
        }
        // 그 외 문자면 @ 취소하고 일반 텍스트로 처리
        else {
          this.buffer += '@' + this.pendingTag + char;
          this.pendingAt = false;
          this.pendingTag = '';
        }
      }
      // 일반 텍스트
      else {
        this.buffer += char;
      }
    }
    
    // 버퍼에 남은 내용 처리 (@ 대기 중이 아닐 때만)
    if (!this.pendingAt && this.buffer.length > 0) {
      if (this.currentTag) {
        // 태그 내부
        for (const c of this.buffer) {
          if (c !== '\r') {
            this.tagContent += c;
            newElements.push({
              type: 'tag_content',
              tag: this.currentTag,
              content: c,
            });
          }
        }
      } else {
        // 태그 외부
        for (const c of this.buffer) {
          if (c !== '\r') {
            newElements.push({
              type: 'text',
              content: c,
            });
          }
        }
      }
      this.buffer = '';
    }
    
    return newElements;
  }

  /**
   * 파싱 완료
   */
  complete() {
    const remaining = [];
    
    // @ 대기 중이었으면 일반 텍스트로 처리
    if (this.pendingAt) {
      this.buffer += '@' + this.pendingTag;
      this.pendingAt = false;
      this.pendingTag = '';
    }
    
    // 버퍼 남은 내용 처리
    if (this.buffer.length > 0) {
      if (this.currentTag) {
        for (const c of this.buffer) {
          if (c !== '\r') {
            this.tagContent += c;
            remaining.push({
              type: 'tag_content',
              tag: this.currentTag,
              content: c,
            });
          }
        }
      } else {
        for (const c of this.buffer) {
          if (c !== '\r') {
            remaining.push({
              type: 'text',
              content: c,
            });
          }
        }
      }
    }
    
    // 태그가 아직 열려 있으면 종료
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
    this.pendingAt = false;
    this.pendingTag = '';
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

