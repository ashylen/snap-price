import { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    Platform,
    Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';

const boundedHeight = Dimensions.get('window').height;

const Contact = () => {
    const [name, onChangeName] = useState('');
    const [email, onChangeEmail] = useState('');
    const [phone, onChangePhone] = useState('');
    const [message, onChangeMessage] = useState('');
    const hero = require('../assets/shutterstock_1010583892.jpg');

    const router = useRouter();

    const checkMessage = (email, message) => {
        if (!email) {
            Alert.alert('There was a problem', 'No email entered');
        } else if (!message) {
            Alert.alert('There was a problem', 'No message entered');
        } else {
            Alert.alert(email, message);
            router.replace('/');
        }
    };

    return(
        <View style={styles.container}>
            
            <ScrollView contentContainerStyle={styles.formView}>
                <Image
                    source={hero}
                    style={styles.heroStyle}
                />
                <Text style={styles.formTitle}>CONTACT US</Text>
                <Text style={styles.formLabel}>Name</Text>
                <TextInput 
                    style={styles.formInput}
                    onChangeText={onChangeName}
                    value={name}
                    placeholder='Enter Name'
                />
                <Text style={styles.formLabel}>Email</Text>
                <TextInput 
                    style={styles.formInput}
                    onChangeText={onChangeEmail}
                    value={email}
                    placeholder='Enter Email'
                    inputMode='email'
                />
                <Text style={styles.formLabel}>Phone</Text>
                <TextInput 
                    style={styles.formInput}
                    onChangeText={onChangePhone}
                    value={phone}
                    placeholder='Enter Phone #'
                    inputMode='tel'
                />
                <Text style={styles.formLabel}>Message</Text>
                <TextInput 
                    style={styles.formInput}
                    onChangeText={onChangeMessage}
                    value={message}
                    placeholder='Leave A Message'
                    multiline={true}
                    numberOfLines={7}
                    textAlignVertical='top'
                />
                <TouchableOpacity
                    onPress={() => {
                        checkMessage(email, message);
                    }}
                >
                    <Text style={styles.formButtonLabel}>SEND MESSAGE</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        router.replace('/');
                    }}
                >
                    <Text style={styles.formButtonLabel}>CANCEL</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
     
};

const styles = StyleSheet.create({
    container: {
        height: boundedHeight,
        ...Platform.select({
            android: { 
                paddingBottom: 350
            },
            ios: { 
                paddingBottom: 350
            },
            default:{
                paddingBottom: 20
            }
        }),
    },
    heroStyle: {
        width: '100%',
        ...Platform.select({
            android: { 
                height: 200
            },
            ios: { 
                height: 200
            },
            default: { 
                height: 400
            },
        }),
    },
    formView: {
        alignItems: 'center'
    },
    formTitle: {
        fontFamily:'WorkSans-Regular',
        fontWeight: '700',
        ...Platform.select({
            android: {
                fontSize: 20,
                paddingVertical: 10 
            },
            ios: {
                fontSize: 20,
                paddingVertical: 10 
            },
            default: {
                fontSize: 30,
                paddingVertical: 20 
            }
        })
    },
    formLabel: {
        fontFamily:'WorkSans-Regular',
        fontWeight: '500',
        ...Platform.select({
            android: {
                fontSize: 16,
                paddingTop: 10
            },
            ios: {
                fontSize: 16,
                paddingTop: 10
            },
            default: {
                fontSize: 24,
                paddingTop: 18
            }
        })
    },
    formInput: {
        fontFamily:'WorkSans-Regular',
        width: 250,
        borderWidth: 1,
        padding: 10,
        ...Platform.select({
            android: {
                fontSize: 16,
            },
            ios: {
                fontSize: 16,
            },
            default: {
                fontSize: 24,
                width: 400
            }
        })
    },
    formButtonLabel: {
        fontFamily:'WorkSans-Regular',
        fontWeight: '500',
        ...Platform.select({
            android: {
                fontSize: 16,
                paddingTop: 12
            },
            ios: {
                fontSize: 16,
                paddingTop: 12
            },
            default: {
                fontSize: 24,
                paddingTop: 20
            }
        })
    }
});

export default Contact;

