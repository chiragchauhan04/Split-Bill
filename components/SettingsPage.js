import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { groupContext } from "../providers/groupContext";

const SettingsPage = (props) => {
    const { loader, list, getOneGroupDetail } = useContext(groupContext)
    const [inviteModal, setInviteModal] = useState(false)
    const [linkModal, setLinkModal] = useState(false)
    const [link, setLink] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        getOneGroupDetail();
    }, []);


    useEffect(() => {
        if (list?.members) {
            getUserDetail();   // Now check admin only after members are loaded
        }
    }, [list]);

    const inviteMemberApi = async () => {
        const groupId = await AsyncStorage.getItem('GroupId')
        const token = await AsyncStorage.getItem("Token");
        try {
            const res = await axios.get(`https://split-application.onrender.com/api/v1/groups/${groupId}?email=${email}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            console.log(res.data.data.inviteLink)
            setLink(res.data.data.inviteLink)
            setInviteModal(false)
            setLinkModal(true)
            setEmail('')
            getOneGroupDetail()
        }
        catch (error) {
            console.log(error)
        }
    }
    const handleLink = async () => {
        const supported = await Linking.canOpenURL(link);
        if (!supported) {
            await Linking.openURL(link);
            setLinkModal(false)
        } else {
            await Linking.openURL(link);
            setLinkModal(false)

        }
    };


    const getUserDetail = async () => {
        const userId = await AsyncStorage.getItem('UserId')
        console.log("userID", userId)

        const adminUser = list.members.find(
            member => member._id === userId
        );

        const isAdmin = adminUser?.role === "admin";
        setIsAdmin(isAdmin)
        // console.log(isAdmin)
    }

    const deleteGroup = async () => {
        const groupId = await AsyncStorage.getItem('GroupId');
        const token = await AsyncStorage.getItem('Token');
        console.log("groupId", groupId)
        try {
            const res = await axios.delete(`https://split-application.onrender.com/api/v1/groups/${groupId}`,
                { headers: { Authorization: `Bearer ${token}` } })
            console.log("group deleted successfully")
            props.navigation.reset({
                index: 0,
                routes: [{ name: "Home" }],
            });
        }
        catch (error) {
            console.log(error)
        }
    }

    const memberLeave = async () => {
        const token = await AsyncStorage.getItem("Token");
        const GroupId = await AsyncStorage.getItem('GroupId');
        console.log("groupId", GroupId)
        console.log("token", token)
        // console.log(isAdmin);
        let url;
        if (isAdmin) {
            url = `https://split-application.onrender.com/api/v1/groups/${GroupId}/admin-leave`;
        } else {
            url = `https://split-application.onrender.com/api/v1/groups/${GroupId}/leave`;
        }
        try {
            const res = await axios.patch(url, {}, { headers: { Authorization: `Bearer ${token}` } })
            // console.log(res)
            props.navigation.reset({
                index: 0,
                routes: [{ name: "Home" }]
            })
        }
        catch (error) {
            console.log(error)
        }
    }

    const adminLeaveMember = async (Id) => {
        console.log(Id);
        if (isAdmin) {
            Alert.alert("Leave member", "Are you sure to leave this member from group!", [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Ok", onPress: async () => {
                        const token = await AsyncStorage.getItem("Token");
                        const GroupId = await AsyncStorage.getItem('GroupId');
                        console.log("groupId", GroupId)
                        // console.log("token", token)
                        try {
                            const res = await axios.patch(`https://split-application.onrender.com/api/v1/groups/${GroupId}/remove/${Id}`, {},
                                { headers: { Authorization: `Bearer ${token}` } }
                            )
                            console.log("user leave successfully");
                            getOneGroupDetail()
                        }
                        catch (error) {
                            console.log(error);
                            setError("Admin can't remove themselves with this method!")
                        }
                    }
                }
            ])
        }
    }
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeContainer}>
                <ScrollView>
                    {loader ? (
                        <View style={styles.loaderContainer}>
                            <ActivityIndicator size="large" color="#414141ff" />
                        </View>
                    ) : (
                        <View style={styles.container}>
                            <View style={styles.groupCard}>
                                <View style={styles.iconContainer}>
                                    <Text style={styles.iconText}>{list?.icon}</Text>
                                </View>

                                <View style={styles.groupInfo}>
                                    <Text style={styles.groupNameTxt}>{list?.name}</Text>
                                    <Pressable style={styles.editButton} onPress={() => props.navigation.navigate('EditGroup')}>
                                        <Image source={require("../assets/images/pencil.png")} style={styles.editIcon} />
                                    </Pressable>
                                </View>
                            </View>
                            <View style={styles.detailsSection}>
                                <Text style={styles.detailsHeader}>Group members</Text>
                                <Pressable style={styles.detailRow} onPress={() => setInviteModal(true)}>
                                    <Image source={require('../assets/images/link.png')} style={[styles.editIcon, { marginLeft: scale(10) }]} />
                                    <Text style={styles.detailValue}>Invite via link</Text>
                                </Pressable>

                                <View>
                                    {list?.members?.map((item, index) => (
                                        <View key={index} style={styles.groupMemberContainer}>
                                            <View>
                                                <Text style={styles.memberIcon}>{list.icon}</Text>
                                            </View>
                                            <Pressable style={styles.memberContainer} onPress={() => adminLeaveMember(item._id)}>
                                                <View>
                                                    <Text>{item.name}</Text>
                                                    <Text>{item.email}</Text>
                                                </View>
                                                <View >
                                                    <Text style={styles.memberRole}>{item.role}</Text>
                                                </View>
                                            </Pressable>
                                        </View>
                                    ))}
                                </View>
                                {
                                    error && <Text style={styles.errorTxt}>{error}</Text>
                                }
                            </View>
                            <View style={styles.detailsSection}>
                                <Text style={styles.detailsHeader}>Advance settings</Text>
                                <Pressable style={styles.detailRow} onPress={() => memberLeave()}>
                                    <Image source={require('../assets/images/log-in.png')} style={[styles.editIcon, { marginLeft: scale(10), tintColor: "red" }]} />
                                    <Text style={[styles.detailValue, { color: "red", fontWeight: "700" }]}>Leave group</Text>
                                </Pressable>
                                <Pressable onPress={() => deleteGroup()}>
                                    {
                                        isAdmin &&
                                        <View style={styles.detailRow}>
                                            <Image source={require('../assets/images/delete.png')} style={[styles.editIcon, { marginLeft: scale(10), tintColor: "red" }]} />
                                            <Text style={[styles.detailValue, { color: "red", fontWeight: "700" }]}>Delete group</Text>
                                        </View>
                                    }
                                </Pressable>
                            </View>
                        </View>
                    )}
                    <Modal transparent={true} visible={inviteModal} style={inviteModal} animationType="slide">
                        <View style={styles.modalBackground}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>Invite via link</Text>
                                <TextInput keyboardType="email-address" style={styles.input} placeholder="Enter email address" placeholderTextColor="#777" value={email} onChangeText={(text) => setEmail(text.toLowerCase())} />
                                <Pressable style={styles.shareButton} onPress={() => inviteMemberApi()}>
                                    <Text style={styles.shareButtonText}>Share Link</Text>
                                </Pressable>
                                <Pressable onPress={() => setInviteModal(false)}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                    <Modal transparent={true} visible={linkModal} style={inviteModal} animationType="slide">
                        <View style={styles.modalBackground}>
                            <View style={styles.modalContainer}>
                                <Pressable onPress={() => handleLink()}>
                                    <Text style={styles.linkTxt}>{link}</Text>
                                </Pressable>
                                <Pressable onPress={() => setLinkModal(false)}>
                                    <Text style={[styles.cancelText, { marginTop: moderateScale(5) }]}>Cancel</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </SafeAreaView >
        </SafeAreaProvider >
    );
};

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1,
        backgroundColor: "#f6f7fb",
    },
    container: {
        flex: 1,
        paddingHorizontal: moderateScale(15),
        paddingVertical: verticalScale(10),
    },
    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    groupCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: moderateScale(10),
        padding: moderateScale(12),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: verticalScale(20),
    },
    iconContainer: {
        width: scale(90),
        height: scale(90),
        borderRadius: moderateScale(8),
        backgroundColor: "#f0f0f0",
        justifyContent: "center",
        alignItems: "center",
        marginRight: scale(12),
    },
    iconText: {
        fontSize: moderateScale(50),
    },
    groupInfo: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    groupNameTxt: {
        fontSize: moderateScale(22),
        fontWeight: "bold",
        color: "#222",
    },
    memberContainer: {
        paddingLeft: moderateScale(5),
        flexDirection: "row",
        width: scale(245),
        justifyContent: "space-between",
    },
    memberRole: {
        verticalAlign: "middle",
        fontWeight: "500",
        color: "green",
    },
    editButton: {
        padding: moderateScale(6),
    },
    editIcon: {
        width: scale(22),
        height: scale(22),

    },
    errorTxt: {
        textAlign: "center",
        fontSize: moderateScale(14),
        color: "red",
        fontWeight: "600"
    },
    detailsSection: {
        backgroundColor: "#fff",
        borderRadius: moderateScale(10),
        padding: moderateScale(15),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        marginBottom: verticalScale(20),
    },
    detailsHeader: {
        fontSize: moderateScale(18),
        fontWeight: "600",
        color: "#333",
        marginBottom: verticalScale(10),
    },
    detailRow: {
        flexDirection: "row",
        marginBottom: verticalScale(8),
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 2,
        paddingVertical: verticalScale(5),
        borderRadius: moderateScale(3),
        backgroundColor: "#f0f0f0",
    },
    groupMemberContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        marginBottom: verticalScale(2),
        borderRadius: moderateScale(3),
        padding: moderateScale(3)
    },
    linkTxt: {
        color: '#007AFF',
        paddingBottom: 2,
    },
    detailLabel: {
        fontSize: moderateScale(30),
        backgroundColor: "#666",
        borderRadius: moderateScale(20),
        // marginVertical: scale(10)
    },
    memberIcon: {
        fontSize: moderateScale(30),
        backgroundColor: "#666",
        borderRadius: moderateScale(20),
        width: scale(37)
        // marginVertical: scale(10)
    },
    detailValue: {
        fontSize: moderateScale(15),
        flex: 1,
        justifyContent: "space-evenly",
        alignItems: "center",
        marginLeft: scale(10)
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 15,
        color: "#222",
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 15,
        fontSize: 15,
        color: "#000",
    },
    shareButton: {
        backgroundColor: "#4A90E2",
        borderRadius: 6,
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginBottom: 10,
    },
    shareButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    cancelText: {
        color: "#666",
        fontSize: 14,
        textDecorationLine: "underline",
    },

});

export default SettingsPage;
