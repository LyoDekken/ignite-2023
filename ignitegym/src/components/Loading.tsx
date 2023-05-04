import { Spinner, Center } from "native-base";

const Loading = () => {
  return (
    <Center flex={1} bg="gray.700">
      <Spinner color="green.500" size={32} />;
    </Center>
  );
};

export default Loading;
