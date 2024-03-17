import {
    StyleSheet,
    Text,
    View,
    FlatList,
    Image,
    TouchableOpacity,
    Platform
} from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { grabAllStories } from './newsData';

const NewsItem = ({ storyId, storyTitle, storyImage, storySnippet }) => {
    const router = useRouter();
    
    return(
        <TouchableOpacity
            onPress={() => {
                router.push({
                    pathname: '/newsDetail',
                    params: {selectedStory: storyId}
                });
            }}
        >
            <View style={styles.newsItem}>
                <Image 
                    style={styles.stImage}
                    source={storyImage}
                />
                <Text style={styles.stTitle}>{storyTitle}</Text>
                <Text style={styles.stSnippet}>{storySnippet}</Text>
            </View>
    </TouchableOpacity>
    );
};

const News = () => {
    const [newsStories, setNewsStories] = useState([]);

    useEffect(() => {
        setNewsStories(grabAllStories());
    }, []);

    return(
        <View style={styles.container}>
            <Text style={styles.pageTitle}>BPS News</Text>
            <FlatList
                data={newsStories}
                renderItem={({item}) => <NewsItem {...item}/>}
                keyExtractor={item => item.storyId}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    newsItem: {
        ...Platform.select({
            android: {
                borderTopWidth: 1  
            },
            ios: {
                borderTopWidth: 1  
            }
        })
    },
    stImage: {
        ...Platform.select({
            android: {
                width: '100%',
                height: 220
            },
            ios: {
                width: '100%',
                height: 220
            },
            default: {
                width: '70%',
                height: 450,
                alignSelf: 'center'
            },
        })
        
    },
    stTitle: {
        textAlign: 'center',
        fontFamily:'WorkSans-Regular',
        fontWeight: '700',
        ...Platform.select({
            android: {
                fontSize: 18,
                paddingTop: 20,
            },
            ios: {
                fontSize: 18,
                paddingTop: 20
            },
            default: {
                fontSize: 24,
                paddingTop: 30
            }
        })     
    },
    stSnippet: {
        textAlign: 'justify',
        fontFamily:'WorkSans-Regular',
        fontWeight: '400',
        ...Platform.select({
            android: {
                fontSize: 16,
                paddingTop: 10,
                paddingBottom: 60,
                paddingHorizontal: 30
            },
            ios: {
                fontSize: 16,
                paddingTop: 10,
                paddingBottom: 40,
                paddingHorizontal: 30
            },
            default: {
                textAlign: 'center',
                fontSize: 20,
                paddingTop: 15,
                paddingBottom: 60
            }
        })     
    },
    container: {
        backgroundColor: '#ffcec7',
        paddingBottom: 290    
    },
    pageTitle: {
        textAlign: 'center',
        fontFamily:'WorkSans-Regular',
        fontWeight: '800',
        ...Platform.select({
            android: {
                fontSize: 26,
                paddingBottom: 10,    
            },
            ios: {
                fontSize: 26,
                paddingBottom: 10,    
            },
            default: {
                fontSize: 32,
                paddingBottom: 20,   
            },
        })
            
    }
});

export default News;