import { useState } from 'react';
import { VStack, useTheme } from 'native-base';
import firestore from '@react-native-firebase/firestore';

import { Header } from '../../components/Header';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Alert, ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function NewOrder() {
  const [isLoading, setIsLoading] = useState(false);
  const [vehicle, setVehicle] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation();

  function handleNewOrder() {
    if (!vehicle || !description) {
      ToastAndroid.show('Preencha todos os campos', ToastAndroid.LONG);
    }
    setIsLoading(true);
    firestore()
      .collection('orders')
      .add({
        vehicle,
        description,
        status: 'open',
        created_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        ToastAndroid.show('Nova manutenção registrada com sucesso!', ToastAndroid.LONG);
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        return Alert.alert('Não foi possível registrar a nova manutenção!');
      })
  }

  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Nova manutenção" />
      <Input
        placeholder='Nome do veículo'
        mt={4}
        onChangeText={setVehicle}
      />
      <Input
        placeholder='Descrição do problema'
        flex={1}
        mt={5}
        multiline
        textAlignVertical='top'
        onChangeText={setDescription}
      />
      <Button
        title='Cadastrar'
        mt={5}
        isLoading={isLoading}
        onPress={handleNewOrder}
      />
    </VStack>
  );
}