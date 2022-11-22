import type { ElrondAccount } from "@ledgerhq/live-common/families/elrond/types";

import React from "react";
import { BigNumber } from "bignumber.js";
import { randomizeProviders } from "@ledgerhq/live-common/families/elrond/helpers/randomizeProviders";
import { denominate } from "@ledgerhq/live-common/families/elrond/helpers/denominate";

import { Icons } from "@ledgerhq/native-ui";
import { Trans } from "react-i18next";

import { NavigatorName, ScreenName } from "../../const";
import { ActionButtonEvent } from "../../components/FabActions";

/*
 * Declare the types for the properties and return payload.
 */

export interface getActionsType {
  account: ElrondAccount;
}
export type getActionsReturnType = ActionButtonEvent[] | null | undefined;

/*
 * Declare the function that will return the actions' settings array.
 */

const getActions = (props: getActionsType): getActionsReturnType => {
  const { account } = props;

  const balance = denominate({
    input: String(account.spendableBalance),
    showLastNonZeroDecimal: true,
  });
  const delegationEnabled = new BigNumber(balance).gte(1);

  /*
   * Get a list of all the providers, randomize, and also the screen, conditionally, based on existing amount of delegations.
   */

  const validators = randomizeProviders(
    account.elrondResources ? account.elrondResources.providers : [],
  );

  const screen =
    account.elrondResources && account.elrondResources.delegations.length === 0
      ? ScreenName.ElrondDelegationStarted
      : ScreenName.ElrondDelegationValidator;

  /*
   * Return the array of actions.
   */

  return [
    {
      id: "stake",
      disabled: !delegationEnabled,
      label: <Trans i18nKey="account.stake" />,
      Icon: Icons.ClaimRewardsMedium,
      navigationParams: [
        NavigatorName.ElrondDelegationFlow,
        { screen, params: { account, validators } },
      ],
    },
  ];
};

export default {
  getActions,
};