import {createContext, useState} from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const BethanyContext = createContext(null);

export const BethanyProvider = (props) =>  {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    console.log('isLoggedIn variable', isLoggedIn)
    const [loggedUser, setLoggedUser] = useState('');
    console.log('loggedUser variable', loggedUser)

    const toggleLogin = () => {
        if (isLoggedIn) {
            AsyncStorage.setItem('userLoggedIn', 'none', () => {
                setIsLoggedIn(false);
                setLoggedUser('');
                Alert.alert('User logged out');
            })
        }
        else {
            router.push('/login');
        }
    };

    const getUser = () => {
        AsyncStorage.getItem('userLoggedIn', (err, result) => {
            if ( result==='none') {
                console.log('No one logged in');
            }
            else if (result===null) {
                AsyncStorage.setItem('userLoggedIn', 'none', () => {
                    console.log('Set user to NONE')
                });
            }
            else {
                setIsLoggedIn(true);
                setLoggedUser(result);
                console.log('logged in user: ',loggedUser)
                console.log('Watching : ', isLoggedIn) 
            }
        });
    };
 


  return (
    <BethanyContext.Provider 
      value={{toggleLogin,getUser, isLoggedIn, setIsLoggedIn, loggedUser}}
    >
      {props.children}
    </BethanyContext.Provider>
  );
}