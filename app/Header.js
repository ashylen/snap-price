import { StyleSheet, View, Image, Text, TouchableWithoutFeedback } from 'react-native';
import { useRouter } from 'expo-router';
import { BethanyContext } from './bethanyContext';
import { useEffect, useContext } from 'react';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';


const Header = () => {
    const logo = require('../assets/bethanys-pie-shop-logo_horiz-white.png');
    const router = useRouter();
    //added for login
    const { toggleLogin, getUser, isLoggedIn } = useContext(BethanyContext)

    useEffect(() => {
        console.log('getUser function running');
        getUser();
    }, [isLoggedIn]);

    let display = isLoggedIn ? <FontAwesome name="user-circle-o" size={24} color="black" /> : <AntDesign style={styles.menu} name='user' size={24} color='white' />;

    return (
        <View style={styles.header}>
            <TouchableWithoutFeedback
                onPress={() => {
                    router.replace('/');
                }}
            >
                <Image
                    source={logo}
                    style={styles.logoStyle}
                />
            </TouchableWithoutFeedback>
            {/* <Text style={styles.menu}>SHOP</Text> */}
            <Text
                style={styles.menu}
                onPress={() => {
                    router.push('/contact');
                }}
            >
                CONTACT
            </Text>
            <Text
                style={styles.menu}
                onPress={() => {
                    router.push('/register');
                }}
            >
                REGISTER
            </Text>
            <Text
                style={styles.menu}
                onPress={toggleLogin}
            >
                {display}
            </Text>
            <Feather style={styles.menu} name='shopping-cart' size={24} color='white' />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#d77948',
        height: 80,
        width: '100%',
        flexDirection: 'row'
    },
    logoStyle: {
        height: 30,
        width: 95,
        marginRight: 5,
        marginLeft: 10
    },
    menu: {
        paddingLeft: 8,
        paddingRight: 8,
        color: '#FFFFFF',
        fontFamily: 'WorkSans-Regular',
        fontWeight: '700'
    }
});

export default Header;