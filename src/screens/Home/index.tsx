import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { HStack, IconButton, VStack, useTheme, Text, Heading, FlatList, Center } from 'native-base';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { SignOut, ChatTeardropText } from 'phosphor-react-native';
import { useNavigation } from '@react-navigation/native';

import Logo from '../../assets/logo_secondary.svg';
import { dateFormat } from '../../utils/firestoreDateFormat';
import { Filter } from '../../components/Filter';
import { Order, OrderProps } from '../../components/Order';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>('open');
  const [orders, setOrders] = useState<OrderProps[]>([]);

  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleNewOrder() {
    navigation.navigate('newOrder');
  }

  function handleOpenDetails(orderId: string) {
    navigation.navigate('details', { orderId });
  }

  function handleLogout() {
    auth()
      .signOut()
      .catch((error) => {
        console.log(error);
        return Alert.alert('Não foi possível sair');
      });
  }

  useEffect(() => {
    setIsLoading(true);
    const subscriber = firestore()
      .collection('orders')
      .where('status', '==', statusSelected)
      .onSnapshot((snapshot) => {  //atualiza os dados em realtime
        const data = snapshot.docs.map((doc) => {
          const { vehicle, description, status, created_at } = doc.data();
          return {
            id: doc.id,
            vehicle,
            description,
            status,
            when: dateFormat(created_at)
          }
        })
        setOrders(data);
        setIsLoading(false);
      });
    return subscriber;
  }, [statusSelected]);

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
          onPress={handleLogout}
        />
      </HStack>
      <VStack flex={1} px={6}>
        <HStack w="full" mt={8} mb={4} justifyContent="space-between" alignItems="center" >
          <Heading color="gray.100">Manutenções</Heading>
          <Text color="gray.200">{orders.length}</Text>
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
        {
          isLoading ? <Loading /> :
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
        }
        <Button
          title="Nova Manutenção"
          onPress={handleNewOrder}
        />
      </VStack>
    </VStack>
  );
}