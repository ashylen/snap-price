import { 
    ScrollView, 
    View, 
    StyleSheet, 
    Text, 
    Image, 
    Platform, 
    Dimensions 
} from 'react-native';
import { useRouter } from 'expo-router';

const boundedHeight = Dimensions.get('window').height;

const About = () => {
    
    const contentA = `It all started with a dream. Bethany Jones was a home maker who loved baking.It started for her family,but soon after her neighbors and friends got a taste she was in demand. The star of the show was her pies, the Apple pie in particular.Soon she was swamped with requests to bake for special events. When someone offered her a substantial amount of money to bake a cake for a wedding, Bethany realized she could turn this into a business. And as the old saying goes, if you do what you love you will never work a day in your life. Bethany set out to secure the funding to realize her vision. The road wasnt easy. Many potential opportunites fell through but Bethany would not be denied. After 6 months of hard work and leveraging every bit of savings and credit she had available, Bethany finally secured her first location. A few months later and they had the grand opening. Customers were lined up around the corner. She ran out of goods within two hours of opening. Lesson learned and from there Bethany rolled up her sleeves and got to work.`;
    const contentB = `Bethany contributes 10 percent of its anual profits to causes that are close to her heart. She also volunteers for certain charities and hosts events in support of these charities. This includes catering these events and providing the baked goods they love so much. Bethany has also created an internship program with local culinary schools. Aspiring pastry chefs can work a rotation in Bethanys kitchens. Six months in the high volume atmosphere prepares students well for a career in baking. Some interns even end up working at Bethanys following their rotation.`;
    const contentC = `Bethanys has expanded to five locations with plans for more. We have also expanded into treats by mail via online ordering. We are also launching a mobile app so you can be sure that Bethanys is always close by.`;

    const hero = require('../assets/shutterstock_1192661812.jpg');

    const router = useRouter();
    return(
        <View style={styles.container}>
            <ScrollView>
                <Image
                    source={hero}
                    style={styles.heroStyle}
                />
                    <Text style={styles.aboutTitle}>All about Bethanys</Text>
                    <Text style={styles.aboutSubTitle}>Humble Beginnings</Text>
                    <Text style={styles.aboutContent}>{contentA}</Text>
                    <Text style={styles.aboutSubTitle}>What we care about</Text>
                    <Text style={styles.aboutContent}>{contentB}</Text>
                    <Text style={styles.aboutSubTitle}>What the future holds</Text>
                    <Text style={styles.aboutContent}>{contentC}</Text>
                    <Text style={styles.signature}>-Bethany Jones</Text>


                <Text
                    style={styles.backButton}
                    onPress={() => {
                        router.replace('/');
                    }}
                > 
                    GO BACK
                </Text>
            </ScrollView>
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        height: boundedHeight,
        ...Platform.select({
            android: { 
                paddingBottom: 160
            },
            ios: { 
                paddingBottom: 160
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
    aboutTitle: {
        textAlign: 'center',
        fontFamily:'Hochstadt-Serif',
        ...Platform.select({
            android: {
                fontSize: 20,
                paddingTop: 10 
            },
            ios: {
                fontSize: 20,
                paddingTop: 10 
            },
            default: {
                fontSize: 30,
                paddingTop: 20 
            }
        })
    },
    aboutSubTitle: {
        textAlign: 'left',
        fontFamily:'Hochstadt-Serif',
        ...Platform.select({
            android: {
                fontSize: 16,
                paddingTop: 8,
                paddingLeft: 10 
            },
            ios: {
                fontSize: 16,
                paddingTop: 8,
                paddingLeft: 10  
            },
            default: {
                fontSize: 26,
                paddingTop: 16,
                paddingLeft: 20  
            }
        })
    },
    aboutContent: {
        textAlign: 'left',
        fontFamily:'WorkSans-Regular',
        fontWeight: '600',
        ...Platform.select({
            android: {
                fontSize: 12,
                paddingTop: 10,
                paddingLeft: 10 
            },
            ios: {
                fontSize: 12,
                paddingTop: 10,
                paddingLeft: 10  
            },
            default: {
                fontSize: 22,
                paddingTop: 20,
                paddingLeft: 20  
            }
        })
    },
    signature: {
        textAlign: 'center',
        fontFamily:'TheGreatOutdoors-Regular',
        fontWeight: '600',
        ...Platform.select({
            android: {
                fontSize: 20,
                paddingTop: 10,
            },
            ios: {
                fontSize: 20,
                paddingTop: 10, 
            },
            default: {
                fontSize: 30,
                paddingTop: 16  
            }
        })
    },
    backButton: {
        textAlign: 'center',
        paddingVertical: 20,
        fontFamily:'WorkSans-Regular',
        fontWeight: '900',
        fontSize: 16
    }
});

export default About;