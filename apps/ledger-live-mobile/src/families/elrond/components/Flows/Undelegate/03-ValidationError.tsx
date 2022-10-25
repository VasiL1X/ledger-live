// @flow
import React, { useCallback } from "react";
import { StyleSheet, Linking } from "react-native";
import SafeAreaView from "react-native-safe-area-view";
import { useTheme } from "@react-navigation/native";

import { TrackScreen } from "../../../../../analytics";
import ValidateError from "../../../../../components/ValidateError";
import { urls } from "../../../../../config/urls";

const forceInset = { bottom: "always" };

interface RouteParams {
  accountId: string;
  deviceId: string;
  transaction: any;
  error: Error;
}

interface Props {
  navigation: any;
  route: { params: RouteParams };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

const Error = (props: Props) => {
  const { navigation, route } = props;
  const { colors } = useTheme();
  const onClose = useCallback(() => {
    navigation.getParent().pop();
  }, [navigation]);

  const onContactUs = useCallback(() => {
    Linking.openURL(urls.contact);
  }, []);

  const onRetry = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const error = route.params.error;

  return (
    <SafeAreaView
      style={[styles.root, { backgroundColor: colors.background }]}
      forceInset={forceInset}
    >
      <TrackScreen category="ElrondUndelegation" name="ValidationError" />

      <ValidateError
        onContactUs={onContactUs}
        onClose={onClose}
        onRetry={onRetry}
        error={error}
      />
    </SafeAreaView>
  );
};

export default Error;