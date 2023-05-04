import { createContext, ReactNode, useEffect, useState } from "react";

import { api } from "@services/axios";
import { User } from "src/entities/user.entities";

import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from "@storage/storageUser";

import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from "@storage/storageAuthToken";

type AuthContextData = {
  user: User;
  isLoadingUserStorageData: boolean;
  refreshedToken: string;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (userUpdated: User) => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<User>({} as User);

  const [refreshedToken, setRefreshedToken] = useState("");

  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(true);

  //Verifica a autenticação do usuário, buscando informações no dispositivo do usuário
  const loadUserData = async () => {
    try {
      setIsLoadingUserStorageData(true);

      const userLogged = await storageUserGet();

      const token = await storageAuthTokenGet();

      if (userLogged && token) {
        userAndTokenUpdate(userLogged, token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  };

  //Atualiza o token através do token buscado no cabeçalho
  const userAndTokenUpdate = async (user: User, token: string) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    setUser(user);
  };

  const updateUserProfile = async (userUpdated: User) => {
    try {
      setUser(userUpdated);
      await storageUserSave(userUpdated);
    } catch (error) {
      throw error;
    }
  };

  //Salva as informações no dispositivo do user
  const storageUserAndTokenSave = async (user: User, token: string) => {
    try {
      setIsLoadingUserStorageData(true);

      await storageUserSave(user);

      await storageAuthTokenSave(token);
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  };

  //Quando faz autenticação:
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const response = await api.post("/sessions", {
        email,
        password,
      });

      const { user, token } = response.data;

      if (user && token) {
        //Armazena os dados no dispositivo do user.
        //Tanto do user quanto do Token.
        await storageUserAndTokenSave(user, token);
        await userAndTokenUpdate(user, token);
      }
    } catch (error) {
      throw error;
    }
  };

  //Remove as informações do dispositivo
  const signOut = async (): Promise<void> => {
    try {
      setIsLoadingUserStorageData(true);

      setUser({} as User);

      await storageUserRemove();
      await storageAuthTokenRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  };

  const refreshTokenUpdated = (T: string) => {
    setRefreshedToken(T);
  };

  const authContextData: AuthContextData = {
    user,
    refreshedToken,
    isLoadingUserStorageData,
    signIn,
    signOut,
    updateUserProfile,
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager({
      signOut,
      refreshTokenUpdated,
    });

    return () => {
      subscribe();
    };
  }, [signOut]);

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
