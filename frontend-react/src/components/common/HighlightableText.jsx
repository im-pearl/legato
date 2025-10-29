import { useState, useRef, useEffect } from 'react';
import { Box, IconButton } from '@chakra-ui/react';
import { LuHighlighter, LuX } from 'react-icons/lu';

function HighlightableText({ text, highlights = [], onHighlight, onRemoveHighlight, ...props }) {
  const [selection, setSelection] = useState(null);
  const [toolbarPos, setToolbarPos] = useState(null);
  const [hoveredHighlight, setHoveredHighlight] = useState(null);
  const textRef = useRef(null);

  useEffect(() => {
    const handleMouseUp = (e) => {
      // 약간의 지연을 주어 텍스트 선택이 완료되도록 함
      setTimeout(() => {
        const selectedText = window.getSelection();
        const selectedStr = selectedText.toString().trim();
        
        if (selectedText.rangeCount === 0 || selectedStr === '') {
          setToolbarPos(null);
          return;
        }

        // 현재 컴포넌트 내에서 선택되었는지 확인
        const range = selectedText.getRangeAt(0);
        if (!textRef.current?.contains(range.commonAncestorContainer)) {
          return;
        }

        console.log('텍스트 선택됨:', selectedStr);

        // 선택된 텍스트의 실제 위치 계산
        try {
          const preSelectionRange = range.cloneRange();
          preSelectionRange.selectNodeContents(textRef.current);
          preSelectionRange.setEnd(range.startContainer, range.startOffset);
          const start = preSelectionRange.toString().length;
          const end = start + selectedStr.length;
          
          console.log('위치:', { start, end });
          
          // 툴바 위치 계산
          const rect = range.getBoundingClientRect();
          const scrollY = window.scrollY || window.pageYOffset;
          const scrollX = window.scrollX || window.pageXOffset;
          
          setToolbarPos({
            top: rect.top + scrollY - 45,
            left: rect.left + scrollX + rect.width / 2,
          });

          setSelection({ start, end });
        } catch (error) {
          console.error('하이라이트 위치 계산 오류:', error);
        }
      }, 10);
    };

    const handleClickOutside = (e) => {
      if (toolbarPos && !e.target.closest('.highlight-toolbar')) {
        setToolbarPos(null);
        setSelection(null);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toolbarPos]);

  const handleAddHighlight = () => {
    if (selection && onHighlight) {
      onHighlight(selection);
      setToolbarPos(null);
      setSelection(null);
      window.getSelection().removeAllRanges();
    }
  };

  const renderTextWithHighlights = () => {
    if (!text || highlights.length === 0) {
      return text;
    }

    // 하이라이트를 정렬
    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
    
    const parts = [];
    let lastIndex = 0;

    sortedHighlights.forEach((highlight, idx) => {
      // 하이라이트 이전 텍스트
      if (highlight.start > lastIndex) {
        parts.push(
          <span key={`text-${lastIndex}`}>
            {text.slice(lastIndex, highlight.start)}
          </span>
        );
      }

      // 하이라이트된 텍스트
      const isHovered = hoveredHighlight === idx;
      parts.push(
        <Box
          key={`highlight-${idx}`}
          as="mark"
          display="inline"
          position="relative"
          bg="yellow.200"
          color="inherit"
          px="1px"
          borderRadius="2px"
          onMouseEnter={() => setHoveredHighlight(idx)}
          onMouseLeave={() => setHoveredHighlight(null)}
        >
          {text.slice(highlight.start, highlight.end)}
          {isHovered && onRemoveHighlight && (
            <IconButton
              size="2xs"
              position="absolute"
              top="-8px"
              right="-8px"
              variant="solid"
              colorPalette="gray"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveHighlight(idx);
              }}
              aria-label="하이라이트 제거"
              borderRadius="full"
              w="16px"
              h="16px"
              minW="16px"
              _hover={{ bg: 'red.500', color: 'white' }}
            >
              <LuX size={10} />
            </IconButton>
          )}
        </Box>
      );

      lastIndex = highlight.end;
    });

    // 마지막 텍스트
    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  return (
    <>
      <Box ref={textRef} position="relative" {...props}>
        {renderTextWithHighlights()}
      </Box>

      {/* 하이라이트 툴바 */}
      {toolbarPos && (
        <Box
          className="highlight-toolbar"
          position="fixed"
          top={`${toolbarPos.top}px`}
          left={`${toolbarPos.left}px`}
          transform="translateX(-50%)"
          zIndex={1000}
          bg="white"
          boxShadow="lg"
          borderRadius="md"
          p={1}
          borderWidth="1px"
          borderColor="gray.200"
        >
          <IconButton
            size="sm"
            variant="ghost"
            onClick={handleAddHighlight}
            aria-label="하이라이트"
            colorPalette="yellow"
          >
            <LuHighlighter />
          </IconButton>
        </Box>
      )}
    </>
  );
}

export default HighlightableText;

