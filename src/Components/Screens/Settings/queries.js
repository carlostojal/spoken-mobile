import { gql } from "@apollo/client";

export default queries = {

	GET_USER_DATA: gql`
		query getUserData {
			getUserData {
				_id
				name
				surname
				email
				username
				profile_type
				profile_privacy_type
				profile_pic {
					_id
				}
				permissions {
					collect_usage_data
				}
			}
		}
	`,

	EDIT_USER: gql`
		mutation editUser($name: String!, $surname: String!, $email: String!, $username: String!, $password: String!, $profile_pic: ID, $profile_privacy_type: ProfilePrivacyType!, $collect_usage_data: Boolean!) {
			editUser(name: $name, surname: $surname, email: $email, username: $username, password: $password, profile_pic: $profile_pic, profile_privacy_type: $profile_privacy_type, collect_usage_data: $collect_usage_data) {
				_id
				name
				surname
				email
				username
				profile_type
				profile_privacy_type
				profile_pic {
					_id
				}
				permissions {
					collect_usage_data
				}
			}
		}
	`,

	GET_SESSIONS: gql`
		query getSessions {
			getSessions {
				_id
				created_at
				expires_at
				user_location {
					coordinates
				}
				user_platform
			}
		}
	`,

	DELETE_SESSION: gql`
		mutation deleteSession($session_id: ID!) {
			deleteSessionById(session_id: $session_id) {
				_id
			}
		}
	`
}