import React, { useState } from 'react';
import { Heading, VStack, Icon, useTheme, Toast } from 'native-base';
import auth from '@react-native-firebase/auth';
import { Envelope, Key } from 'phosphor-react-native';

import Logo from '../../assets/logo_primary.svg';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Alert, ToastAndroid } from 'react-native';

export function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { colors } = useTheme();

  async function handleSignIn() {
    if (!email) {
      return ToastAndroid.show('É necessário informar o email', ToastAndroid.LONG);
    }
    if (!password) {
      return ToastAndroid.show('É necessário informar a senha', ToastAndroid.LONG);
    }
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        if (error.code === "auth/invalid-email") {
          return Alert.alert("Email e/ou senha inválidos");
        }
        if (error.code === "auth/user-not-found") {
          return Alert.alert("Usuário não cadastrado");
        }
        return Alert.alert('Não foi possível acessar')
      })
    setIsLoading(true);
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24} >
      <Logo />
      <Heading color="gray.100" fontSize="xl" mt={20} mb={6} >
        Acesse sua conta
      </Heading>
      <Input
        placeholder="Email"
        mb={4}
        keyboardType='email-address'
        InputLeftElement={<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />}
        onChangeText={setEmail}
      />
      <Input
        placeholder="Senha"
        mb={4}
        secureTextEntry
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        onChangeText={setPassword}
      />
      <Button
        title='Entrar'
        w="full"
        isLoading={isLoading}
        onPress={handleSignIn}
      />
    </VStack>
  );
}
