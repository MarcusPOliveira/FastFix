import React, { useState } from 'react';
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';
import { SignOut, ChatTeardropText } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

import Logo from '../../assets/logo_secondary.svg';
import { Filter } from '../../components/Filter';
import { Order, OrderProps } from '../../components/Order';
import { Button } from '../../components/Button';

export function Home() {
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open');
  const [orders, setOrders] = useState<OrderProps[]>([
    {
      id: '123',
      vehicle: 'MB Atego 2426 6x2',
      when: '18/07/22 às 10:00',
      status: 'open'
    },
  ]);

  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleNewOrder() {
    navigation.navigate('newOrder');
  }

  function handleOpenDetails(orderId: string) {
    navigation.navigate('details', { orderId });
  }

  return (
    <VStack flex={1} pb={6} bg="gray.700" >
      <HStack
        w="full"
        justifyContent="space-between"
        alignItems="center"
        bg="gray.600"
        pt={12}
        pb={5}
        px={6}
      >
        <Logo />
        <IconButton
          icon={<SignOut size={26} color={colors.gray[300]} />}
        />
      </HStack>
      <VStack flex={1} px={6}>
        <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center" >
          <Heading color="gray.100">Manutenções</Heading>
          <Text color="gray.200">3</Text>
        </HStack>
        <HStack space={3} mb={8}>
          <Filter
            title='Em andamento'
            type="open"
            isActive={statusSelected === "open"}
            onPress={() => setStatusSelected('open')}
          />
          <Filter
            title='Finalizadas'
            type="closed"
            isActive={statusSelected === "closed"}
            onPress={() => setStatusSelected('closed')}
          />
        </HStack>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item }) => <Order data={item} onPress={() => handleOpenDetails(item.id)} />}
          ListEmptyComponent={() => (
            <Center>
              <ChatTeardropText size={40} color={colors.gray[300]} />
              <Text color="gray.300" fontSize="xl" mt={6} textAlign="center" >
                Você ainda não possui{'\n'} manutenções {statusSelected === 'open' ? 'em andamento!' : 'finalizadas!'}
              </Text>
            </Center>
          )}
        />
        <Button title="Nova solicitação" onPress={handleNewOrder} />
      </VStack>
    </VStack>
  );
}