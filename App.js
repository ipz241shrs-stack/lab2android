import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { View, Text, FlatList, SectionList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

const INITIAL_DATA = Array.from({ length: 15 }, (_, i) => ({
    id: i.toString(),
    title: `Новина ${i + 1}`,
    description: `Опис для новини ${i + 1}`,
    image: `https://picsum.photos/100?random=${i}`
}));

const CONTACTS_DATA = [
    { title: "Викладачі", data: ["Чижмотря О.В.", "Чижмотря О.Г."] },
    { title: "Студенти", data: ["Шпак Роман", "Гринченко Катерина", "Загревський Артем"] }
];

const DetailsScreen = ({ route }) => {
    const { item } = route.params;
    return (
        <View style={styles.center}>
            <Image source={{ uri: item.image }} style={styles.largeImage} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </View>
    );
};

const MainScreen = ({ navigation }) => {
    const [data, setData] = useState(INITIAL_DATA);
    const [loading, setLoading] = useState(false);

    const loadMore = () => {
        if (loading) return;
        setLoading(true);
        setTimeout(() => {
            const newData = Array.from({ length: 5 }, (_, i) => ({
                id: (data.length + i).toString(),
                title: `Новина ${data.length + i + 1}`,
                description: `Опис для новини ${data.length + i + 1}`,
                image: `https://picsum.photos/100?random=${data.length + i}`
            }));
            setData([...data, ...newData]);
            setLoading(false);
        }, 1000);
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Details', { item })}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <View>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text>{item.description}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
            />
        </View>
    );
};

const ContactsScreen = () => (
    <View style={styles.container}>
        <SectionList
            sections={CONTACTS_DATA}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
                <View style={styles.item}>
                    <Text style={styles.title}>{item}</Text>
                </View>
            )}
            renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.header}>{title}</Text>
            )}
        />
    </View>
);

const CustomDrawerContent = (props) => (
    <DrawerContentScrollView {...props}>
        <View style={styles.drawerHeader}>
            <Image source={{ uri: 'https://picsum.photos/100' }} style={styles.avatar} />
            <Text style={styles.drawerName}>Шпак Роман Сергійович</Text>
            <Text style={styles.drawerGroup}>ІПЗ-24-1</Text>
        </View>
        <DrawerItemList {...props} />
    </DrawerContentScrollView>
);

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

const MainStack = () => (
    <Stack.Navigator>
        <Stack.Screen name="News" component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Деталі' }} />
    </Stack.Navigator>
);

export default function App() {
    return (
        <NavigationContainer>
            <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
                <Drawer.Screen name="Головна" component={MainStack} />
                <Drawer.Screen name="Контакти" component={ContactsScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    center: { flex: 1, alignItems: 'center', padding: 20 },
    item: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc', alignItems: 'center' },
    image: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
    largeImage: { width: 200, height: 200, borderRadius: 10, marginBottom: 20 },
    title: { fontSize: 16, fontWeight: 'bold' },
    description: { fontSize: 14, color: '#666' },
    header: { fontSize: 20, fontWeight: 'bold', backgroundColor: '#f4f4f4', padding: 10, textAlign: 'center' },
    drawerHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc', alignItems: 'center' },
    avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
    drawerName: { fontSize: 18, fontWeight: 'bold' },
    drawerGroup: { fontSize: 14, color: '#666' }
});