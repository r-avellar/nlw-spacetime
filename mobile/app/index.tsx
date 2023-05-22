import { View, Text, TouchableOpacity } from 'react-native';
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { useEffect } from 'react';
import { api } from '../src/lib/api';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from "expo-router";

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/3f6bf1560e0747cecda9',
};

export default function App() {
  const router = useRouter()

  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: '3f6bf1560e0747cecda9',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime'
      }),
    },
    discovery,
  );
  async function HandleGithubOAuthCode(code: string) {
    const response = await api.post('/register', {
      code,
    })
    const { token } = response.data
    await SecureStore.setItemAsync('token', token)
    router.push('/memories')
  }
  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      HandleGithubOAuthCode(code)
    }
  }, [response]);

  return (
    <View className='flex-1 items-center  px-8 py-10'>
      <View className='flex-1 items-center justify-center gap-6'>
        <NLWLogo />
        <View className='space-y-2'>
          <Text className='text-center font-title text-2xl leading-tight text-gray-50'>
            Sua cápsula do tempo
          </Text>
          <Text className='text-center font-body text-base leading-relaxed text-gray-100'>
            Colecione momentos marcantes da sua jornada e compartilhe (se quiser) com o munddo!
          </Text>
        </View>
        <TouchableOpacity className='rounded-full bg-green-500 px-5 py-2' activeOpacity={0.7} onPress={() => signInWithGithub()}>
          <Text className='font-alt text-sm uppercase font-black'>Cadastrar lembrança</Text>
        </TouchableOpacity>
      </View>
      <Text className='text-center font-body text-sm leading-relaxed text-gray-200'> Feito com 💜 no NLW da Rocketseat</Text>
    </View>
  );
}

