import { Box, Text, Button, Table, For, Dialog, Portal, CloseButton } from '@chakra-ui/react';

function PreviewReportModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  clientName,
  requestNumber,
  lawyerName,
  receiptDate,
  factsContent,
  issues,
  winProbability,
  winProbabilityDescription,
}) {
  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={({ open }) => !open && onClose()}
      size="xl"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title pr={12}>사건 심사 보고서</Dialog.Title>
              <CloseButton
                position="absolute"
                top={4}
                right={4}
                size="sm"
                onClick={onClose}
              />
            </Dialog.Header>

            <Dialog.Body>
              {/* 보고서 헤더 */}
              <Table.Root size="sm" mb={6}>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell fontWeight={600} bg="gray.100" w="15%">의뢰인</Table.Cell>
                    <Table.Cell w="35%">{clientName}</Table.Cell>
                    <Table.Cell fontWeight={600} bg="gray.100" w="15%">신청지 번호</Table.Cell>
                    <Table.Cell w="35%">{requestNumber}</Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell fontWeight={600} bg="gray.100">상담 변호사</Table.Cell>
                    <Table.Cell>{lawyerName}</Table.Cell>
                    <Table.Cell fontWeight={600} bg="gray.100">접수일</Table.Cell>
                    <Table.Cell>{receiptDate}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>

              {/* 사건 요약 */}
              <Box mb={6}>
                <Text fontSize="lg" fontWeight={600} color="gray.900" mb={3} pb={1} borderBottomWidth="1px" borderColor="gray.200">
                  사건 요약
                </Text>
                <Text fontSize="sm" lineHeight={1.6}>
                  본 사건은 설계용역 대금 청구에 관한 사건으로, 의뢰인이 상대방으로부터 오피스텔 신축설계 용역을 의뢰받아 완료하였으나, 계약서 없이 진행되어 설계용역대금에 대한 다툼이 발생한 사안입니다...
                </Text>
              </Box>

              {/* 사실관계 */}
              <Box mb={6}>
                <Text fontSize="lg" fontWeight={600} color="gray.900" mb={3} pb={1} borderBottomWidth="1px" borderColor="gray.200">
                  사실관계
                </Text>
                <Text fontSize="sm" lineHeight={1.6} whiteSpace="pre-line">
                  {factsContent}
                </Text>
              </Box>

              {/* 법리 검토 */}
              <Box mb={6}>
                <Text fontSize="lg" fontWeight={600} color="gray.900" mb={3} pb={1} borderBottomWidth="1px" borderColor="gray.200">
                  법리 검토
                </Text>
                <For each={issues}>
                  {(issue, index) => (
                    <Box key={index} mb={6}>
                      <Text fontSize="md" fontWeight={600} mb={2}>
                        {index + 1}. {issue.content}
                      </Text>
                      <Text fontSize="sm" lineHeight={1.6} mb={4}>
                        {issue.subsumption}
                      </Text>
                      <Text fontSize="sm" fontWeight={600} mb={2}>
                        관련 판례
                      </Text>
                      <Box as="ul" pl={6} m={0}>
                        <For each={issue.precedents}>
                          {(precedent, pIndex) => (
                            <Box key={pIndex} as="li">
                              <Text fontSize="sm" color="gray.700">
                                {precedent.caseNumber}
                              </Text>
                            </Box>
                          )}
                        </For>
                      </Box>
                    </Box>
                  )}
                </For>
              </Box>

              {/* 승소가능성 */}
              <Box mb={6}>
                <Text fontSize="lg" fontWeight={600} color="gray.900" mb={3} pb={1} borderBottomWidth="1px" borderColor="gray.200">
                  승소가능성 평가
                </Text>
                <Text fontSize="md" fontWeight={600} color="gray.900" mb={3}>
                  {winProbability[0]}~{winProbability[1]}%
                </Text>
                <Text fontSize="sm" lineHeight={1.6}>
                  {winProbabilityDescription}
                </Text>
              </Box>
            </Dialog.Body>

            <Dialog.Footer>
              <Button size="lg" colorPalette="gray" onClick={onConfirm}>
                제출
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default PreviewReportModal;

