import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context"
import { moderateScale } from "react-native-size-matters";

const EditGroupDetailPage = () => {
    const [data, setData] = useState(null);
    const [loader, setLoader] = useState(true);
    const getGroupDetail = async () => {
        const groupId = await AsyncStorage.getItem("GroupId");
        const token = await AsyncStorage.getItem("Token");
        try {
            const res = await axios.get(`https://split-application.onrender.com/api/v1/groups/findone/${groupId}`,
                { headers: { Authorization: `Bearer ${token}` } });
            setData(res.data.data);
            console.log(res.data.data._id)
            setLoader(false);
            console.log("update")
        } catch (error) {
            console.log(error);
            setLoader(false);
        }
    };

    useEffect(() => {
        getGroupDetail();
    }, []);
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }}>
                {loader ? (
                    <View style={styles.loaderContainer}>
                        <ActivityIndicator size="large" color="#414141ff" />
                    </View>
                ) : (
                    <View style={styles.container}>
                        <View>
                            <Text style={styles.iconText}>{data?.icon}</Text>
                        </View>
                        <View>
                            <Text>Group name</Text>
                            <TextInput style={{ borderBottomWidth: moderateScale(2) }}></TextInput>
                        </View>
                    </View>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
const styles = StyleSheet.create({
    container: {

    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
})
export default EditGroupDetailPage;