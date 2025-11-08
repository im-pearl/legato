import { Box, Card, Button, Text, IconButton, Editable, FileUpload } from '@chakra-ui/react';
import { LuFile, LuPlus, LuX, LuFileText, LuImage } from 'react-icons/lu';

function EvidenceList({ files, onFileChange, onRemoveFile, onUpdateDescription }) {
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    // 문서 파일
    const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'hwp', 'xlsx', 'xls', 'ppt', 'pptx'];
    if (documentExtensions.includes(extension)) {
      return <LuFileText size={18} color="gray" />;
    }
    
    // 이미지 파일
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
    if (imageExtensions.includes(extension)) {
      return <LuImage size={18} color="gray" />;
    }
    
    // 기타
    return <LuFile size={18} color="gray" />;
  };
  return (
    <Card.Root variant="outline">
      <Card.Body>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Text fontSize="lg" fontWeight={600}>
            증거 내역
          </Text>
          <Box>
            <FileUpload.Root onFileChange={onFileChange} multiple>
              <FileUpload.HiddenInput />
              <FileUpload.Trigger asChild>
                <Button size="xs" variant="outline">
                  <LuPlus />
                  파일 추가
                </Button>
              </FileUpload.Trigger>
            </FileUpload.Root>
          </Box>
        </Box>

        {files.length > 0 && (
          <Box
            borderWidth="1px"
            borderColor="gray.300"
            borderRadius="lg"
            overflow="hidden"
          >
            {files.map((file, index) => (
              <Box
                key={index}
                px={4} py={2}
                borderBottomWidth={index < files.length - 1 ? '1px' : '0'}
                borderColor="gray.200"
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    {getFileIcon(file.name)}
                    <Text fontSize="sm" fontWeight={500}>
                      {file.name}
                    </Text>
                  </Box>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    colorPalette="gray"
                    onClick={() => onRemoveFile(index)}
                    aria-label="삭제"
                  >
                    <LuX />
                  </IconButton>
                </Box>
                <Editable.Root
                  value={file.description}
                  onValueChange={(details) => onUpdateDescription(index, details.value)}
                  placeholder="증거에 대한 설명을 입력해주세요"
                >
                  <Editable.Preview
                    fontSize="sm"
                    color="gray.600"
                    minH="32px"
                    px={2}
                    py={1}
                    borderRadius="md"
                    _hover={{ bg: 'gray.50' }}
                  />
                  <Editable.Input fontSize="sm" px={2} py={1} />
                </Editable.Root>
              </Box>
            ))}
          </Box>
        )}
      </Card.Body>
    </Card.Root>
  );
}

export default EvidenceList;

