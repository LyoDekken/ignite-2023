import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Box, useTheme } from "native-base";

import { useAuth } from "@hooks/useAuth";

import { AuthRoutes } from "./auth.routes";
import { AppRoutes } from "./app.routes";

import Loading from "@components/Loading";

export function Routes() {
  const { colors } = useTheme();

  const { user, isLoadingUserStorageData } = useAuth();

  const theme = DefaultTheme;

  theme.colors.background = colors.gray[700];

  if (isLoadingUserStorageData) {
    return <Loading />;
  }

  return (
    //Fundo Banco igual a #FFF
    //Double check - garantir que o fundo não mude de cor ao navegar pelas telas
    <Box flex={1} bg={"gray.700"}>
      <NavigationContainer theme={theme}>
        {user.id ? <AppRoutes /> : <AuthRoutes />}
      </NavigationContainer>
    </Box>
  );
}
