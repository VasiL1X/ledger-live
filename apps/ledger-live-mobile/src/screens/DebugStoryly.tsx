import React from "react";
import { Platform, ScrollView } from "react-native";
import { Flex, Text } from "@ledgerhq/native-ui";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Alert from "../components/Alert";
import {
  storyInstancesIDsMap,
  StorylyInstanceID,
} from "../components/Storyly/shared";
import StoryBar from "../components/Storyly/StoryBar";
import LanguageSettingsRow from "./Settings/General/LanguageRow";

const StyledStoryBar = styled(StoryBar).attrs({
  scrollContainerStyle: {
    paddingHorizontal: 16,
    justifyContent: "center",
    flexGrow: 1,
  },
})`
  flex: 1;
  padding-vertical: 16px;
`;

const DebugStoryly = () => (
  <SafeAreaView>
    <ScrollView>
      <Flex backgroundColor="background" flex={1}>
        <Alert
          type="warning"
          learnMoreUrl={
            Platform.OS === "android"
              ? "https://github.com/Netvent/storyly-mobile/issues/188"
              : undefined
          }
        >
          This is a tool provided as-is for the team to validate storyly
          instances used in the app.
          {Platform.OS === "android"
            ? "\n\nOn Android, this **will** crash in case there is a video, but outside of this debug screen, stories containing a video will be disabled by default. There is ongoing work to fix this and no stories will be added in app until this is solved."
            : ""}
        </Alert>
        <LanguageSettingsRow />
        {Object.keys(storyInstancesIDsMap).map((key, index) => (
          <Flex key={index} py={5} flex={1}>
            <Text>{key}</Text>
            <StyledStoryBar
              shouldBlockVideoContentOnAndroid={false}
              instanceID={storyInstancesIDsMap[key]}
              onFail={() => {}}
            />
          </Flex>
        ))}
      </Flex>
    </ScrollView>
  </SafeAreaView>
);

export default DebugStoryly;
