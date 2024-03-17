import { 
    Image, 
    View, 
    Text, 
    StyleSheet, 
    Dimensions, 
    Platform 
} from 'react-native';

const windowDimensions = Dimensions.get('window');
const winWidth = windowDimensions.width - 700 / 3 ;
const computerImagesWidth = winWidth / 2;
const computerImagesHeight = computerImagesWidth - 215;

const PieDisplay = ({pieImage, product }) => {

    return(
        <View style={styles.container}>
            <Image
                source={pieImage}
                style={styles.pieStyle}
            />
            <View style={styles.addButton}>
                <Text style={styles.addText}>+ ADD TO CART</Text>
            </View>
            <View style={styles.product}>
                <Text style={styles.productText}>{product}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
    },
    pieStyle: {
        resizeMode: 'contain',
        ...Platform.select({
            android: {
                height: winWidth,
                width: winWidth,
                paddingHorizontal: '10'
            },
            ios: {
                height: winWidth,
                width: winWidth,
                paddingHorizontal: '10'
            },
            default: {
                height: computerImagesHeight,
                width: computerImagesWidth,
            },
        })   
    },
    addButton: {
        backgroundColor: '#ffcec7',
        top: '-15%' 
    },
    addText: {
        textAlign: 'center',
        fontFamily:'WorkSans-Regular',
        fontWeight: '900',
        ...Platform.select({
            android: {
                fontSize: 10
            },
            ios: {
                fontSize: 10
            },
            default: {
                fontSize: 20
            },
        })
    },
    product: {
        top: '-12%'
    },
    productText: {
        textAlign: 'center',
        fontFamily:'WorkSans-Regular',
        fontWeight: '900',
        fontSize: 16,
        textTransform: 'uppercase'    
    }
});

export default PieDisplay;