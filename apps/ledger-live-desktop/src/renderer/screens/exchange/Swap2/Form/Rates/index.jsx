// @flow
import React, { useCallback, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { track } from "~/renderer/analytics/segment";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import CentralisedRate from "./CentralisedRate";
import Countdown from "./Countdown";
import EmptyState from "./EmptyState";
import Filter from "./Filter";
import type {
  SwapSelectorStateType,
  RatesReducerState,
} from "@ledgerhq/live-common/exchange/swap/types";
import { rateSelector, updateRateAction } from "~/renderer/actions/swap";
import TrackPage from "~/renderer/analytics/TrackPage";
import { swapDefaultTrack } from "../../utils/index";
import styled from "styled-components";
import Tooltip from "~/renderer/components/Tooltip";
import IconInfoCircle from "~/renderer/icons/InfoCircle";
import { filterRates } from "./filterRates";

type Props = {
  fromCurrency: $PropertyType<SwapSelectorStateType, "currency">,
  toCurrency: $PropertyType<SwapSelectorStateType, "currency">,
  rates: $PropertyType<RatesReducerState, "value">,
  provider: ?string,
  refreshTime: number,
  updateSelection: () => void,
  countdown: boolean,
  decentralizedSwapAvailable: boolean,
};

const TableHeader: ThemedComponent<{}> = styled(Box).attrs({
  horizontal: true,
  alignItems: "center",
  ff: "Inter|SemiBold",
  justifyContent: "space-between",
  fontWeight: "500",
  fontSize: 3,
  color: "palette.text.shade40",
  pl: 3,
  pr: 2,
  mt: 3,
  pb: 10,
})`
  border-bottom: 1px solid ${p => p.theme.colors.neutral.c30};
`;

export default function ProviderRate({
  fromCurrency,
  toCurrency,
  rates,
  provider,
  updateSelection,
  refreshTime,
  countdown,
}: Props) {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState([]);
  const [defaultPartner, setDefaultPartner] = useState("");
  const selectedRate = useSelector(rateSelector);

  const providerRef = useRef(null);

  const filteredRates = useMemo(() => {
    return filterRates(rates, filter);
  }, [rates, filter]);

  const updateRate = useCallback(
    rate => {
      const buttonName = rate.providerType === "CEX" ? "Partner Chosen" : "Partner Dex Chosen";
      const value = rate ?? rate.provider;
      track("partner_clicked", {
        button: buttonName,
        page: "Page Swap Form",
        ...swapDefaultTrack,
        swap_type: rate.tradeMethod,
        value,
        defaultPartner,
      });
      updateSelection(rate);
      dispatch(updateRateAction(rate));
    },
    [defaultPartner, updateSelection, dispatch],
  );

  const updateFilter = useCallback(
    newFilter => {
      track("button_clicked", {
        button: "Filter selected",
        page: "Page Swap Form",
        ...swapDefaultTrack,
        value: newFilter,
      });
      setFilter(newFilter);
      const first = filterRates(rates, newFilter)[0];
      if (first) {
        updateRate(first);
        setDefaultPartner(first.provider);
      }
    },
    [rates, updateRate],
  );

  return (
    <Box height="100%" width="100%">
      <TrackPage
        category="Swap"
        name="Form - Edit Rates"
        provider={provider}
        {...swapDefaultTrack}
      />
      <Box horizontal justifyContent="space-between" fontSize={5}>
        <Text
          variant="h5"
          color="neutral.c100"
          style={{ textTransform: "uppercase", fontFamily: "Alpha" }}
        >
          <Trans i18nKey="swap2.form.rates.title" />
        </Text>
        {countdown && (
          <Box horizontal fontSize={3}>
            <Countdown refreshTime={refreshTime} rates={rates} />
          </Box>
        )}
      </Box>
      <Filter onClick={updateFilter} />
      <TableHeader>
        <Box horizontal width="215px" alignItems="center" pr="38px">
          <Text alignItems="center" display="flex" mr={1}>
            <Trans i18nKey="swap2.form.rates.name.title" />
          </Text>
          <Tooltip
            content={
              <Box style={{ maxWidth: 250 }}>
                <Trans i18nKey="swap2.form.rates.name.tooltip" />
              </Box>
            }
          >
            <IconInfoCircle size={12} />
          </Tooltip>
        </Box>
        <Box horizontal flex="1" alignItems="center" justifyContent="flex-start">
          <Text alignItems="center" display="flex" mr={1}>
            <Trans i18nKey="swap2.form.rates.rate.title" />
          </Text>
          <Tooltip
            content={
              <Box style={{ maxWidth: 290 }}>
                <Text style={{ textAlign: "left" }}>
                  <Trans i18nKey="swap2.form.rates.rate.tooltip">
                    <Text ff="Inter|Bold" />
                  </Trans>
                </Text>
              </Box>
            }
          >
            <IconInfoCircle size={12} />
          </Tooltip>
        </Box>
        <Box horizontal flex="1" alignItems="center" justifyContent="flex-end" mr={1}>
          <Text alignItems="center" display="flex" mr={1}>
            <Trans i18nKey="swap2.form.rates.receive.title" />
          </Text>
          <Tooltip
            content={
              <Box style={{ maxWidth: 150 }}>
                <Text>
                  <Trans i18nKey="swap2.form.rates.receive.tooltip" />
                </Text>
              </Box>
            }
          >
            <Box>
              <IconInfoCircle size={12} />
            </Box>
          </Tooltip>
        </Box>
      </TableHeader>
      <Box mt={3} ref={providerRef}>
        {filteredRates.map(rate => (
          <CentralisedRate
            key={`${rate.provider}-${rate.tradeMethod}`}
            value={rate}
            selected={rate === selectedRate}
            onSelect={updateRate}
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
          />
        ))}
      </Box>
      {!filteredRates.length && <EmptyState />}
    </Box>
  );
}
