import { useState } from "react";

import { Text, Heading, VStack, SectionList } from "native-base";

import HistoryCard from "@components/HistoryCard";
import ScreenHeader from "@components/ScereenHeader";

const History = () => {
  const [exercises, setExercises] = useState([
    {
      titlle: "26.08.2022",
      data: ["1", "2", "3"],
    },
    {
      titlle: "27.07.2023",
      data: ["1", "2"],
    },
  ]);

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />

      <SectionList
        sections={exercises}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <HistoryCard />}
        renderSectionHeader={({ section }) => (
          <Heading
            color={"gray.200"}
            fontSize={"md"}
            mt={10}
            mb={3}
            fontFamily={"heading"}
          >
            {section.titlle}
          </Heading>
        )}
        px={8}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: "center" }
        }
        ListEmptyComponent={() => (
          <Text color={"gray.100"} textAlign={"center"}>
            Não há Exercícios ainda. {`\n`}
            Vamos Treinar hoje?
          </Text>
        )}
      />
    </VStack>
  );
};

export default History;
