// @flow

import { useCallback, useMemo } from "react";
import { BigNumber } from "bignumber.js";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { randomizeProviders } from "@ledgerhq/live-common/families/elrond/helpers/randomizeProviders";
import { denominate } from "@ledgerhq/live-common/families/elrond/helpers/denominate";

import { constants } from "~/renderer/families/elrond/constants";
import { openModal } from "~/renderer/actions/modals";
import IconCoins from "~/renderer/icons/Coins";

import type { Account, AccountLike } from "@ledgerhq/types-live";

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
};

const AccountHeaderActions = (props: Props) => {
  const { account, parentAccount } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const earnRewardEnabled = useMemo(
    (): boolean =>
      BigNumber(denominate({ input: account.spendableBalance, showLastNonZeroDecimal: true })).gte(
        1,
      ),
    [account.spendableBalance],
  );

  const validators = useMemo(
    () => randomizeProviders(account.elrondResources ? account.elrondResources.providers : []),
    [account.elrondResources],
  );

  const hasDelegations = account.elrondResources
    ? account.elrondResources.delegations.length > 0
    : false;

  const onClick = useCallback(() => {
    if (hasDelegations) {
      dispatch(
        openModal(constants.modals.stake, {
          account,
          validators,
        }),
      );
    } else {
      dispatch(
        openModal(constants.modals.rewards, {
          account,
          validators,
        }),
      );
    }
  }, [dispatch, account, validators, hasDelegations]);

  if (parentAccount) return null;

  const disabledLabel = earnRewardEnabled ? "" : t("elrond.delegation.minSafeWarning");

  return [
    {
      key: "Stake",
      onClick: onClick,
      icon: IconCoins,
      disabled: !earnRewardEnabled,
      label: t("account.stake"),
      tooltip: disabledLabel,
    },
  ];
};

export default AccountHeaderActions;