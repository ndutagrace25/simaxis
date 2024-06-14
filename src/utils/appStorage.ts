import { User } from "../features/auth/authSlice";
import { getDataFromSessionStorage } from "./session";

class AppStorage {
  constructor() {}

  getToken(): string | "" {
    let token = getDataFromSessionStorage("token");
    return token;
  }

  getUser(): User | null {
    let user = getDataFromSessionStorage("user");
    return user;
  }
}

export const appSession = new AppStorage();
