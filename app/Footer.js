import { StyleSheet, View, Text, Dimensions, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';

const windowDimensions = Dimensions.get('window');
const WinHeight = windowDimensions.height
const smallLogo = require('../assets/bethanys-pie-shop-logo_extra-4-black.png');

const Footer = () => {
    const router = useRouter();
    return (
        <View style={styles.footer}>
            <Image
                source={smallLogo}
                style={styles.smallLogoStyle}
            />
            <Text
                style={styles.menu}
                onPress={() => {
                    router.push('/about');
                }}
            >
                ABOUT
            </Text>
            {/* <Text 
                style={styles.menu}
                onPress={() => {
                    router.push('/news');
                }}
            >
                NEWS
            </Text> */}
            <Text style={styles.menu}>BLOG</Text>
            <Text style={styles.menu}>YOUTUBE</Text>
        </View>
    );

};

const styles = StyleSheet.create({
    footer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#d77948',
        height: 50,
        width: '100%',
        flexDirection: 'row',
        width: '100%',
        ...Platform.select({
            android: {
                position: 'absolute',
                top: WinHeight - 50
            },
            ios: {
                position: 'absolute',
                top: WinHeight - 50
            },
            default: {
                position: 'relative',
                bottom: 0
            },
        })
    },
    smallLogoStyle: {
        height: 30,
        width: 30,
        ...Platform.select({
            android: {
                marginLeft: 23,
            },
            ios: {
                marginLeft: 23,
            },
            default: {
                left: '-35%'
            },
        })
    },
    menu: {
        paddingLeft: 25,
        paddingRight: 25,
        color: '#FFFFFF',
        fontFamily: 'WorkSans-Regular',
        fontWeight: '700'
    }
});

export default Footer;