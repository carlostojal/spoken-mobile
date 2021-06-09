import Constants from "expo-constants";

export default function getFullBackendAddress(type="api") {

  if(type == "api") {
    if(Constants.manifest.extra.API_USING_DOMAIN) {
      return `${Constants.manifest.extra.API_ADDRESS}${Constants.manifest.extra.API_ENDPOINT}`;
    } else {
      return `${Constants.manifest.extra.API_ADDRESS}:${Constants.manifest.extra.API_PORT}${Constants.manifest.extra.API_ENDPOINT}`;
    }
  } else {
    if(Constants.manifest.extra.MEDIA_SERVER_USING_DOMAIN) {
      return Constants.manifest.extra.MEDIA_SERVER_ADDRESS;
    } else {
      return `${Constants.manifest.extra.MEDIA_SERVER_ADDRESS}:${Constants.manifest.extra.MEDIA_SERVER_PORT}`;
    }
  }
}