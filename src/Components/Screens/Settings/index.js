import React, { useState, useEffect } from "react";
import { ScrollView, View, Switch, Alert } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import { useQuery, useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import Header from "../../Misc/Header";
import CustomText from "../../Misc/CustomText";
import CustomTextField from "../../Misc/CustomTextField";
import CustomButton from "../../Misc/CustomButton";
import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import queries from "./queries";
import styles from "./styles";
import getFullBackendAddress from "../../../helpers/getFullBackendAddress";
import colors from "../../../colors";

export default function Settings() {

	const { t } = useTranslation();

	const { data: userData, loading: userDataLoading, error: userDataError } = useQuery(queries.GET_USER_DATA);
	const { data: sessionsData, loading: sessionsLoading, error: sessionsError } = useQuery(queries.GET_SESSIONS);
	const [editUser, { data: editUserData, loading: editUserLoading, error: editUserError }] = useMutation(queries.EDIT_USER);
	const [deleteSession, { data: deleteSessionData, loading: deleteSessionLoading, error: deleteSessionError }] = useMutation(queries.DELETE_SESSION);

	const [name, setName] = useState("");
	const [surname, setSurname] = useState("");
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [profilePicId, setProfilePicId] = useState(null);
	const [allowDataCollection, setAllowDataCollection] = useState(true);

	const [image, setImage] = useState(null);
	const [imageForm, setImageForm] = useState(null);
	const [imgUploadLoading, setImgUploadLoading] = useState(false);

	const [sessions, setSessions] = useState([]);

	useEffect(() => {
		if(userData && userData.getUserData) {
			setName(userData.getUserData.name);
			setSurname(userData.getUserData.surname);
			setEmail(userData.getUserData.email);
			setUsername(userData.getUserData.username);
			setProfilePicId(userData.getUserData.profile_pic._id);
			setAllowDataCollection(userData.getUserData.permissions.collect_usage_data);
		}
	}, [userData]);

	useEffect(() => {

		if(sessionsData && sessionsData.getSessions)
			setSessions(sessionsData.getSessions);

		if(deleteSessionData && deleteSessionData.deleteSession)
			setSessions(sessions.filter((s) => s._id != deleteSessionData.deleteSession._id));

	}, [sessionsData, deleteSessionData]);

	useEffect(() => {

		if(editUserError)
			Alert.alert(t("strings.error"), t("errors.generic"));

	}, [editUserError]);

	useEffect(() => {
		
		if(editUserData && editUserData.editUser)
			Alert.alert(t("string.success"));

	}, [editUserData]);

	const onSave = async () => {

		setImgUploadLoading(true);

		let uploadResult = null;

		try {
			const url = `${getFullBackendAddress("media")}/upload`;
			const tokens = JSON.parse(await AsyncStorage.getItem("tokens"));
			uploadResult = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "multipart/form-data",
					"Authorization": tokens && tokens.access ? tokens.access : ""
				},
				body: imageForm
			});

			setImgUploadLoading(false);

		} catch(e) {
			console.error(e);
			Alert.alert(t("strings.error"), t("errors.error_uploading_media"));
			setImgUploadLoading(false);
			return;
		}

		uploadResult = await uploadResult.json();

		switch(uploadResult.result) {
			case "FILE_UPLOADED":
				setImgUploadLoading(false);
				setProfilePicId(uploadResult.media_id);
				break;
			default:
				Alert.alert(t("strings.error"), t("errors.error_uploading_media"));
				return;
		}

		await editUser({
			variables: {
				name,
				surname,
				email,
				username,
				password,
				profile_pic: profilePicId,
				collect_usage_data: allowDataCollection
			}
		});
	};

	const onPickImage = async () => {

		setImgUploadLoading(true);

		let img = null;
		try {
			img = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [1, 1],
				quality: Constants.manifest.extra.IMAGE_COMPRESSION_LEVEL
			});
		} catch(e) {
			Alert.alert(t("strings.error"), t("strings.error_uploading_media"));
			setImgUploadLoading(false);
		}

		if(!imgUploadLoading) {

			setImage(img);

			let localUri = img.uri;
			let filename = localUri.split("/").pop();

			let match = /\.(\w+)$/.exec(filename);
			let type = match ? `image/${match[1]}` : "image";

			let form = new FormData();
			form.append("media", { uri: localUri, name: filename, type });

			setImageForm(form);
		}

		setImgUploadLoading(false);

	};
	
  return (
    <ScrollView contentContainerStyle={{padding: 15}}>
			<Header>
				{ t("screens.settings.title") }
			</Header>
			<View style={styles.area}>
				<CustomText>
					{ t("screens.settings.labels.name") }
				</CustomText>
				<CustomTextField onChangeText={(text) => setName(text)}>
					{ name }
				</CustomTextField>
			</View>
			<View style={styles.area}>
				<CustomText>
					{ t("screens.settings.labels.surname") }
				</CustomText>
				<CustomTextField onChangeText={(text) => setSurname(text)}>
					{ surname }
				</CustomTextField>
			</View>
			<View style={styles.area}>
				<CustomText>
					{ t("screens.settings.labels.email") }
				</CustomText>
				<CustomTextField onChangeText={(text) => setEmail(text)}>
					{ email }
				</CustomTextField>
			</View>
			<View style={styles.area}>
				<CustomText>
					{ t("screens.settings.labels.username") }
				</CustomText>
				<CustomTextField onChangeText={(text) => setUsername(text)}>
					{ username }
				</CustomTextField>
			</View>
			<View style={styles.area}>
				<CustomText>
					{ t("screens.settings.labels.password") }
				</CustomText>
				<CustomTextField onChangeText={(text) => setPassword(text)}>
					{ password }
				</CustomTextField>
			</View>
			<View style={styles.area}>
				<CustomText>
					{ t("screens.settings.labels.profile_pic") }
				</CustomText>
				<CustomButton loading={imgUploadLoading} onPress={() => onPickImage()}>
					{ t("screens.settings.labels.pick_image") }
				</CustomButton>
			</View>
			<View style={styles.area}>
				<CustomText>
					{ t("screens.settings.labels.allow_data_collection") }
				</CustomText>
				<Switch value={allowDataCollection} onValueChange={(a) => {
					setAllowDataCollection(a);
				}} />
			</View>
			<View style={styles.area}>
				<CustomButton loading={editUserLoading || imgUploadLoading} onPress={() => onSave()}>
					{ t("screens.settings.labels.save") }
				</CustomButton>
			</View>
			<View style={styles.area}>
				<CustomText>
					{ t("screens.settings.labels.sessions") }
				</CustomText>
				{ sessions && sessions.map((session) => {
					return (
						<View key={session._id} style={{backgroundColor: colors.card, borderRadius: 10, marginBottom: 15, padding: 15}}>
							<View style={styles.area}>
								<CustomText>{ t("screens.settings.labels.platform") }</CustomText>
								<CustomText>{ session.user_platform }</CustomText>
							</View>
							{ session.user_location && session.user_location.coordinates &&
								<View style={styles.area}>
									<CustomText>{ t("screens.settings.labels.location") }</CustomText>
									<CustomText>{ session.user_location.coordinates[1] }, {session.user_location.coordinates[0]}</CustomText>
								</View>
							}
							<CustomButton onPress={() => deleteSession({variables: {session_id: session._id}})} loading={deleteSessionLoading}>
								{ t("screens.settings.labels.end_session") }
							</CustomButton>
						</View>
					);
				})}
			</View>
    </ScrollView>
  );
}