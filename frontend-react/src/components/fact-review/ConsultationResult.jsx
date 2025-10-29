import { Box, Card, Text, Stack, Grid, GridItem, Editable } from '@chakra-ui/react';
import { useState } from 'react';
import HighlightableText from '../common/HighlightableText';

function ConsultationResult({ groups, onChange, onHighlight, onRemoveHighlight }) {
  const [editingKey, setEditingKey] = useState(null);
  
  // 기초 정보와 비용 정보는 2열 그리드로, 상담 내용은 Editable로
  const isStaticGroup = (groupName) => {
    return groupName === '기초 정보' || groupName === '비용 정보';
  };

  return (
    <Card.Root variant="outline">
      <Card.Body>
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Text fontSize="lg" fontWeight={600}>
            상담 결과지
          </Text>
        </Box>

        {Object.entries(groups).map(([groupName, items], index, array) => (
          <Box 
            key={groupName} 
            mb={4} 
            pb={4} 
            borderBottomWidth={index === array.length - 1 ? "0" : "1px"} 
            borderColor="gray.200"
          >
            <Text fontSize="sm" fontWeight={600} color="gray.700" mb={3}>
              {groupName}
            </Text>
            
            {isStaticGroup(groupName) ? (
              // 기초 정보, 비용 정보: 2열 그리드 텍스트 표시
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                {items.map((item, index) => (
                  <GridItem key={index}>
                    <Text fontSize="xs" color="gray.600" mb={1}>
                      {item.label}
                    </Text>
                    <Text fontSize="sm">
                      {item.value}
                    </Text>
                  </GridItem>
                ))}
              </Grid>
            ) : (
              // 상담 내용: Editable
              <Stack gap={4}>
                {items.map((item, idx) => {
                  const itemKey = `${groupName}-${idx}`;
                  return (
                    <Box key={idx}>
                      <Text fontSize="xs" color="gray.600" mb={1}>
                        {item.label}
                      </Text>
                      <Editable.Root 
                        value={item.value}
                        onValueChange={(e) => onChange && onChange(groupName, idx, e.value)}
                        onEdit={() => setEditingKey(itemKey)}
                        onCancel={() => setEditingKey(null)}
                        onSubmit={() => setEditingKey(null)}
                        activationMode="dblclick"
                      >
                        <Editable.Preview
                          fontSize="sm"
                          color="gray.800"
                          p={2}
                          borderRadius="md"
                          _hover={{ bg: 'gray.100' }}
                          cursor="text"
                          whiteSpace="pre-wrap"
                          wordBreak="break-word"
                        >
                          {editingKey === itemKey ? (
                            item.value
                          ) : (
                            <HighlightableText
                              text={item.value}
                              highlights={item.highlights || []}
                              onHighlight={(selection) => onHighlight && onHighlight(groupName, idx, selection)}
                              onRemoveHighlight={(highlightIdx) => onRemoveHighlight && onRemoveHighlight(groupName, idx, highlightIdx)}
                            />
                          )}
                        </Editable.Preview>
                        <Editable.Textarea
                          fontSize="sm"
                          color="gray.800"
                          p={2}
                          borderRadius="md"
                        />
                      </Editable.Root>
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Box>
        ))}
      </Card.Body>
    </Card.Root>
  );
}

export default ConsultationResult;

