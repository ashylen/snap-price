import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    Dimensions,
    Platform
} from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { grabOneStory } from './newsData';

const boundedHeight = Dimensions.get('window').height;

const NewsDetail = () => {
    const router = useRouter();
    const { selectedStory } = useLocalSearchParams();
    const [story, loadStory] = useState({});
    useEffect(() => {
        loadStory(grabOneStory(selectedStory));
    }, []); 

    return(
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image
                    source={story.storyImage}
                    style={styles.stImage}
                />
                <Text style={styles.stTitle}>{story.storyTitle}</Text>
                <Text style={styles.stContent}>{story.story}</Text>
                <Text 
                    style={styles.stBack}
                    onPress={() => {
                        router.back();
                    }}
                >
                    GO BACK TO NEWS
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
                paddingBottom: 170    
            },
            ios: {
            },
            default: {
                paddingTop: 20    
            }
        })     
    },
    scrollContainer: {
        alignItems: 'center'
    },
    stImage: {
        width: '100%',
        ...Platform.select({
            android: {
                height: 200
            },
            ios: {
                height: 200
            },
            default: {
                height: 500,
                resizeMode: 'contain'    
            }
        })     
    },
    stTitle: {
        fontFamily:'WorkSans-Regular',
        fontWeight: '700',
        ...Platform.select({
            android: {
                fontSize: 18,
                paddingTop: 10
            },
            ios: {
                fontSize: 18,
                paddingTop: 10
            },
            default: {
                fontSize: 24,
                paddingTop: 20    
            }
        })     
    },
    stContent: {
        textAlign: 'justify',
        fontFamily:'WorkSans-Regular',
        fontWeight: '400',
        ...Platform.select({
            android: {
                fontSize: 16,
                paddingTop: 10,
                paddingHorizontal: 50
            },
            ios: {
                fontSize: 16,
                paddingTop: 10,
                paddingHorizontal: 50
            },
            default: {
                fontSize: 20,
                paddingTop: 15,
                paddingHorizontal: 300
            }
        })     
    },
    stBack: {
        fontFamily:'WorkSans-Regular',
        fontWeight: '700',
        ...Platform.select({
            android: {
                fontSize: 20,
                paddingTop: 20,
            },
            ios: {
                fontSize: 16,
                paddingTop: 20,
            },
            default: {
                fontSize: 26,
                paddingTop: 30,  
            }
        })     
    }
});

export default NewsDetail;