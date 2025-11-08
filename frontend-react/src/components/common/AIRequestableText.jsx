import { useState, useRef, useEffect } from 'react';
import { Box, Button, Input, IconButton } from '@chakra-ui/react';
import { LuSparkles, LuCheck, LuX, LuSend } from 'react-icons/lu';
import DiffMatchPatch from 'diff-match-patch';

function AIRequestableText({ value, onChange, ...textareaProps }) {
  const [selection, setSelection] = useState(null);
  const [toolbarPos, setToolbarPos] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [aiRequest, setAiRequest] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const textRef = useRef(null);
  const dmp = new DiffMatchPatch();

  useEffect(() => {
    const handleMouseUp = () => {
      // 툴바가 이미 표시 중이면 무시
      if (toolbarPos) return;

      setTimeout(() => {
        const selectedText = window.getSelection();
        const selectedStr = selectedText.toString().trim();

        if (selectedText.rangeCount === 0 || selectedStr === '') {
          return;
        }

        const range = selectedText.getRangeAt(0);
        if (!textRef.current?.contains(range.commonAncestorContainer)) {
          return;
        }

        try {
          const preSelectionRange = range.cloneRange();
          preSelectionRange.selectNodeContents(textRef.current);
          preSelectionRange.setEnd(range.startContainer, range.startOffset);
          const start = preSelectionRange.toString().length;
          const end = start + selectedStr.length;

          const rect = range.getBoundingClientRect();

          setToolbarPos({
            top: rect.bottom + 5,
            left: rect.left + rect.width / 2,
          });

          setSelection({ start, end, text: selectedStr });
        } catch (error) {
          console.error('선택 위치 계산 오류:', error);
        }
      }, 10);
    };

    const handleClickOutside = (e) => {
      if (toolbarPos && !e.target.closest('.ai-toolbar')) {
        setToolbarPos(null);
        setSelection(null);
        setShowInput(false);
        setAiRequest('');
        window.getSelection().removeAllRanges();
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toolbarPos]);

  const handleAIRequest = () => {
    setShowInput(true);
  };

  const handleSendRequest = () => {
    if (!selection) return;

    // 목업: AI 응답 생성
    const mockResponse = selection.text
      .replace('의뢰인', '원고')
      .replace('상대방', '피고')
      .replace('총 0,000,000원', '총 50,000,000원')
      .replace('(지급내역))', '(지급명세서 참조)');

    // diff 계산
    const diffs = dmp.diff_main(selection.text, mockResponse);
    dmp.diff_cleanupSemantic(diffs);

    setAiSuggestion({
      original: selection.text,
      modified: mockResponse,
      diffs: diffs,
      range: { start: selection.start, end: selection.end },
      position: toolbarPos, // 위치 정보 저장
    });

    setToolbarPos(null);
    setShowInput(false);
    setAiRequest('');
    setSelection(null);
    window.getSelection().removeAllRanges();
  };

  const handleAcceptSuggestion = () => {
    if (!aiSuggestion) return;

    const { start, end } = aiSuggestion.range;
    const newValue = value.substring(0, start) + aiSuggestion.modified + value.substring(end);
    onChange(newValue);
    setAiSuggestion(null);
  };

  const handleRejectSuggestion = () => {
    setAiSuggestion(null);
  };

  const renderTextWithSuggestion = () => {
    if (!aiSuggestion) return value;

    const { start, end } = aiSuggestion.range;
    const before = value.substring(0, start);
    const after = value.substring(end);

    return (
      <>
        {before}
        <span style={{ position: 'relative', display: 'inline' }}>
          {aiSuggestion.diffs.map((diff, index) => {
            const [operation, text] = diff;
            if (operation === 0) {
              return <span key={index}>{text}</span>;
            } else if (operation === -1) {
              return (
                <span
                  key={index}
                  style={{
                    textDecoration: 'line-through',
                    color: '#dc2626',
                    backgroundColor: '#fee2e2',
                  }}
                >
                  {text}
                </span>
              );
            } else if (operation === 1) {
              return (
                <span
                  key={index}
                  style={{
                    color: '#2563eb',
                    backgroundColor: '#dbeafe',
                    fontWeight: 500,
                  }}
                >
                  {text}
                </span>
              );
            }
            return null;
          })}
        </span>
        {after}
      </>
    );
  };

  return (
    <Box position="relative">
      <Box
        ref={textRef}
        contentEditable={!aiSuggestion}
        suppressContentEditableWarning
        onInput={(e) => {
          if (!aiSuggestion) {
            onChange(e.currentTarget.textContent || '');
          }
        }}
        style={{
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          minHeight: textareaProps.rows ? `${textareaProps.rows * 1.5}em` : 'auto',
          padding: '8px 12px',
          border: '1px solid #e4e4e7',
          borderRadius: '6px',
          outline: 'none',
          fontFamily: textareaProps.fontFamily || 'inherit',
          fontSize: textareaProps.fontSize || '1rem',
          lineHeight: textareaProps.lineHeight || 1.5,
        }}
      >
        {renderTextWithSuggestion()}
      </Box>

      {toolbarPos && (
        <Box
          className="ai-toolbar"
          position="fixed"
          top={`${toolbarPos.top}px`}
          left={`${toolbarPos.left}px`}
          transform="translateX(-50%)"
          zIndex={1000}
        >
          {!showInput ? (
            <Button
              size="sm"
              onClick={handleAIRequest}
              colorPalette="gray"
              boxShadow="lg"
            >
              <LuSparkles />
              AI에게 요청
            </Button>
          ) : (
            <Box
              bg="white"
              p={3}
              borderRadius="md"
              boxShadow="lg"
              borderWidth="1px"
              minW="400px"
              display="flex"
              gap={2}
              alignItems="center"
            >
              <Input
                placeholder="AI에게 요청할 내용을 입력하세요..."
                value={aiRequest}
                onChange={(e) => setAiRequest(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendRequest();
                  }
                }}
                autoFocus
                size="sm"
                flex={1}
              />
              <IconButton
                size="sm"
                onClick={handleSendRequest}
                colorPalette="gray"
                aria-label="전송"
              >
                <LuSend />
              </IconButton>
              <IconButton
                size="sm"
                variant="ghost"
                onClick={() => {
                  setToolbarPos(null);
                  setSelection(null);
                  setShowInput(false);
                  setAiRequest('');
                  window.getSelection().removeAllRanges();
                }}
                aria-label="취소"
              >
                <LuX />
              </IconButton>
            </Box>
          )}
        </Box>
      )}

      {aiSuggestion && aiSuggestion.position && (
        <Box
          position="fixed"
          top={`${aiSuggestion.position.top}px`}
          left={`${aiSuggestion.position.left}px`}
          transform="translateX(-50%)"
          zIndex={1000}
          bg="white"
          p={3}
          borderRadius="md"
          boxShadow="lg"
          borderWidth="1px"
        >
          <Box display="flex" gap={2}>
            <Button size="sm" onClick={handleAcceptSuggestion} colorPalette="gray">
              <LuCheck />
              수락
            </Button>
            <Button size="sm" variant="outline" onClick={handleRejectSuggestion}>
              <LuX />
              거절
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default AIRequestableText;

