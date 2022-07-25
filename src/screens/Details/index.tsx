import { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { HStack, VStack, useTheme, Text, ScrollView, Box } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CircleWavyCheck, Hourglass, Car, ClipboardText } from 'phosphor-react-native';

import { Header } from '../../components/Header';
import { OrderProps } from '../../components/Order';
import { OrderDTO } from '../../DTOs/OrderDTO';
import { dateFormat } from '../../utils/firestoreDateFormat';
import { Loading } from '../../components/Loading';
import { CardDetails } from '../../components/CardDetails';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Alert, ToastAndroid } from 'react-native';

//tipagem dos parametros que vem da Tela Home
type RouteParams = {
  orderId: string;
}

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details({ }) {
  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState('');
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

  const route = useRoute();
  const { orderId } = route.params as RouteParams;
  const navigation = useNavigation();
  const { colors } = useTheme();

  function handleOrderClose() {
    if (!solution) {
      return Alert.alert('Manutenção', 'Informe uma solução do problema para encerrar!')
    }
    firestore()
      .collection<OrderDTO>('orders')
      .doc(orderId)
      .update({
        status: 'closed',
        solution,
        closed_at: firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        ToastAndroid.show('Manutenção finalizada com sucesso!', ToastAndroid.LONG);
        navigation.navigate('home');
      })
      .catch((error) => {
        console.log(error);
        Alert.alert('Manutenção', 'Não foi possível encerrar!');
      })
  }

  useEffect(() => {
    firestore()
      .collection<OrderDTO>('orders')
      .doc(orderId)
      .get()
      .then((doc) => {
        const { vehicle, description, status, created_at, closed_at, solution } = doc.data();
        const closed = closed_at ? dateFormat(closed_at) : null;
        setOrder({
          id: doc.id,
          vehicle,
          description,
          status,
          solution,
          when: dateFormat(created_at),
          closed,
        });
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg="gray.700">
      <Box px={6} bg="gray.600">
        <Header title="Detalhes da Manutenção" />
      </Box>
      <HStack bg="gray.500" justifyContent="center" p={4}>
        {
          order.status === "closed"
            ? <CircleWavyCheck size={22} color={colors.green[300]} />
            : <Hourglass size={22} color={colors.secondary[700]} />
        }
        <Text
          fontSize="sm"
          color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
          ml={2}
          textTransform="uppercase"
        >
          {
            order.status === 'closed' ? 'Finalizado' : 'em andamento'
          }
        </Text>
      </HStack>
      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="Veículo"
          description={order.vehicle}
          icon={Car}
        />
        <CardDetails
          title="Descrição do problema"
          description={order.description}
          icon={ClipboardText}
          footer={`Registrado em ${order.when}`}
        />
        <CardDetails
          title="Solução"
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {
            order.status === 'open' &&
            <Input
              placeholder='Descrição da solução'
              h={24}
              textAlignVertical="top"
              multiline
              onChangeText={setSolution}
            />
          }
        </CardDetails>
      </ScrollView>
      {
        order.status === 'open' &&
        <Button
          title="Encerrar Manutenção"
          m={5}
          isLoading={isLoading}
          onPress={handleOrderClose}
        />
      }
    </VStack>
  );
}
