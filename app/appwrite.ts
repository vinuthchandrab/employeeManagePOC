import { Account, Client } from "react-native-appwrite";

export const client = new Client()
  .setEndpoint("https://sgp.cloud.appwrite.io/v1")
  .setProject("697b57b10003b23e4aec")
  .setPlatform("com.empd.empDet");

export const account = new Account(client);
