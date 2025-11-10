import { Box, Text, Dialog, Portal, CloseButton } from '@chakra-ui/react';

function PrecedentModal({ isOpen, onClose, precedent }) {
  // 목업 데이터
  const mockData = {
    title: '대법원 2005. 5. 13. 선고 2004다1899 판결 [손해배상(기)]',
    판시사항: '간통한 부녀 및 상간자가 부녀의 자녀에 대한 관계에서 불법행위책임을 부담하는지 여부(소극)',
    판결요지: `배우자 있는 부녀와 간통행위를 하고, 이로 인하여 그 부녀가 배우자와 별거하거나 이혼하는 등으로 혼인관계를 파탄에 이르게 한 경우 그 부녀와 간통행위를 한 제3자(상간자)는 그 부녀의 배우자에 대하여 불법행위를 구성하고, 따라서 그로 인하여 그 부녀의 배우자가 입은 정신상의 고통을 위자할 의무가 있다고 할 것이나, 이러한 경우라도 간통행위를 한 부녀 자체가 그 자녀에 대하여 불법행위책임을 부담한다고 할 수는 없고, 또한 간통행위를 한 제3자(상간자) 역시 해의(害意)를 가지고 부녀의 그 자녀에 대한 양육이나 보호 내지 교양을 적극적으로 저지하는 등의 특별한 사정이 없는 한 그 자녀에 대한 관계에서 불법행위책임을 부담한다고 할 수는 없다.`,
    참조조문: '민법 제751조',
    당사자: {
      원고: '원고 1 외 1인',
      피고: '피고',
      원심판결: '서울지법 2003. 11. 13. 선고 2002나58852 판결',
    },
    주문: '상고를 모두 기각한다. 상고비용은 원고들의 부담으로 한다.',
    이유: `상고이유를 본다.

배우자 있는 부녀와 간통행위를 하고, 이로 인하여 그 부녀가 배우자와 별거하거나 이혼하는 등으로 혼인관계를 파탄에 이르게 한 경우 그 부녀와 간통행위를 한 제3자(상간자)는 그 부녀의 배우자에 대하여 불법행위를 구성하고, 따라서 그로 인하여 그 부녀의 배우자가 입은 정신상의 고통을 위자할 의무가 있다고 할 것이다. 그러나 이러한 경우라도 간통행위를 한 부녀 자체가 그 자녀에 대하여 불법행위책임을 부담한다고 할 수는 없고, 또한 간통행위를 한 제3자(상간자) 역시 해의(害意)를 가지고 부녀의 그 자녀에 대한 양육이나 보호 내지 교양을 적극적으로 저지하는 등의 특별한 사정이 없는 한 그 자녀에 대한 관계에서 불법행위책임을 부담한다고 할 수는 없다.

원심판결의 이유에 의하면, 원심은 그 채용 증거들을 종합하여, 판시와 같은 사실들을 인정한 다음, "피고는 소외인이 유부녀임을 알면서도 소외인과 간통함으로써 원심 공동원고와 소외인 사이의 부부관계를 파탄에 이르게 하였고, 이로 인해 원심 공동원고와 소외인 사이의 자녀들인 원고들도 정신적 고통을 입었으므로, 피고는 그로 인해 원고들이 입은 정신적 손해를 위자할 책임이 있다."는 원고들의 주장에 대하여, 혼인관계의 유지 여부와 그에 따른 자식과의 동거 여부는 부부의 자유로운 의사에 의하여 결정되는 것이므로, 자녀 있는 부녀와 간통행위를 함으로써 그 부녀가 남편과 이혼하고 자녀들과 별거하게 되었다고 하더라도, 부녀가 그 자녀에 대하여 간통행위로 인한 불법행위책임을 부담한다고 할 수는 없고, 이와 마찬가지로 상간자도 적극적으로 부녀와 자녀의 동거를 저지하였다는 등의 특별한 사정이 없는 한 자녀에 대한 관계에서 불법행위의 책임을 부담한다고는 볼 수 없다고 판단하였다.

앞에서 본 법리와 기록에 비추어 관계 증거들을 살펴보면, 원심의 위와 같은 인정 및 판단은 수긍이 되고, 거기에 상고이유에서 주장하는 바와 같이 손해배상에 관한 법리를 오해하거나 석명권을 행사하지 아니한 위법이 있다 할 수 없다.

그러므로 상고를 모두 기각하고, 상고비용은 패소자들의 부담으로 하기로 하여 관여 대법관의 일치된 의견으로 주문과 같이 판결한다.`,
    재판관: [
      { role: '재판장', title: '대법관', name: '이규홍' },
      { role: '', title: '대법관', name: '이용우' },
      { role: '', title: '대법관', name: '박재윤' },
      { role: '주심', title: '대법관', name: '양승태' },
    ],
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={({ open }) => !open && onClose()}
      size="xl"
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxH="90vh">
            <Dialog.Header borderBottomWidth="1px" borderColor="gray.200" pb={4}>
              <Dialog.Title fontSize="lg" fontWeight={600} pr={12}>
                {mockData.title}
              </Dialog.Title>
              <CloseButton
                position="absolute"
                top={4}
                right={4}
                size="sm"
                onClick={onClose}
              />
            </Dialog.Header>

            <Dialog.Body overflowY="auto" py={6}>
          {/* 판시사항 */}
          <Box mb={6}>
            <Text fontSize="md" fontWeight={600} color="gray.900" mb={2}>
              판시사항
            </Text>
            <Text fontSize="sm" color="gray.800" lineHeight={1.8}>
              {mockData.판시사항}
            </Text>
          </Box>

          {/* 판결요지 */}
          <Box mb={6}>
            <Text fontSize="md" fontWeight={600} color="gray.900" mb={2}>
              판결요지
            </Text>
            <Text fontSize="sm" color="gray.800" lineHeight={1.8}>
              {mockData.판결요지}
            </Text>
          </Box>

          {/* 참조조문 */}
          <Box mb={6}>
            <Text fontSize="md" fontWeight={600} color="gray.900" mb={2}>
              참조조문
            </Text>
            <Text fontSize="sm" color="gray.800">
              {mockData.참조조문}
            </Text>
          </Box>

          {/* 당사자 */}
          <Box mb={6}>
            <Text fontSize="md" fontWeight={600} color="gray.900" mb={3}>
              당사자
            </Text>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" gap={4}>
                <Text fontSize="sm" fontWeight={500} color="gray.700" minW="80px">
                  원고
                </Text>
                <Text fontSize="sm" color="gray.800">
                  {mockData.당사자.원고}
                </Text>
              </Box>
              <Box display="flex" gap={4}>
                <Text fontSize="sm" fontWeight={500} color="gray.700" minW="80px">
                  피고
                </Text>
                <Text fontSize="sm" color="gray.800">
                  {mockData.당사자.피고}
                </Text>
              </Box>
              <Box display="flex" gap={4}>
                <Text fontSize="sm" fontWeight={500} color="gray.700" minW="80px">
                  원심판결
                </Text>
                <Text fontSize="sm" color="gray.800">
                  {mockData.당사자.원심판결}
                </Text>
              </Box>
            </Box>
          </Box>

          {/* 주문 */}
          <Box mb={6}>
            <Text fontSize="md" fontWeight={600} color="gray.900" mb={2}>
              주문
            </Text>
            <Text fontSize="sm" color="gray.800" lineHeight={1.8}>
              {mockData.주문}
            </Text>
          </Box>

          {/* 이유 */}
          <Box mb={6}>
            <Text fontSize="md" fontWeight={600} color="gray.900" mb={2}>
              이유
            </Text>
            <Text fontSize="sm" color="gray.800" lineHeight={1.8} whiteSpace="pre-line">
              {mockData.이유}
            </Text>
          </Box>

          {/* 재판관 */}
          <Box>
            <Text fontSize="sm" fontWeight={600} color="gray.900" mb={3}>
              재판관
            </Text>
            <Box display="flex" flexWrap="wrap" gap={3}>
              {mockData.재판관.map((judge, index) => (
                <Box key={index} display="flex" gap={1} fontSize="sm" color="gray.800">
                  {judge.role && (
                    <Text fontWeight={500} color="gray.700">
                      {judge.role}
                    </Text>
                  )}
                  <Text>{judge.title}</Text>
                  <Text fontWeight={500}>{judge.name}</Text>
                </Box>
              ))}
            </Box>
          </Box>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}

export default PrecedentModal;

