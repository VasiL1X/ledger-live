import { useDispatch, useSelector } from "react-redux";
import { ContentCard as BrazeContentCard } from "react-native-appboy-sdk";
import { CryptoOrTokenCurrency } from "@ledgerhq/types-cryptoassets";
import { useCallback, useMemo } from "react";
import { useBrazeContentCard } from "./brazeContentCard";
import {
  assetsCardsSelector,
  discoverCardsSelector,
  walletCardsSelector,
} from "../reducers/dynamicContent";
import { dismissedDynamicCardsSelector } from "../reducers/settings";
import {
  AssetContentCard,
  Background,
  DiscoverContentCard,
  LocationContentCard,
  WalletContentCard,
} from "./types";
import { track } from "../analytics";
import { setDismissedDynamicCards } from "../actions/settings";

export const filterByPage = (array: BrazeContentCard[], page: string) =>
  array.filter(elem => elem.extras.location === page);

export const mapAsWalletContentCard = (card: BrazeContentCard) =>
  ({
    id: card.id,
    tag: card.extras.tag,
    title: card.extras.title,
    location: LocationContentCard.Wallet,
    image: card.extras.image,
    link: card.extras.link,
    background:
      Background[card.extras.background as Background] || Background.purple,
  } as WalletContentCard);

export const mapAsAssetContentCard = (card: BrazeContentCard) =>
  ({
    id: card.id,
    tag: card.extras.tag,
    title: card.extras.title,
    location: LocationContentCard.Asset,
    image: card.extras.image,
    link: card.extras.link,
    cta: card.extras.cta,
    assets: card.extras.assets ?? "",
    displayOnEveryAssets: Boolean(card.extras.displayOnEveryAssets) ?? false,
  } as AssetContentCard);

export const mapAsDiscoverContentCard = (card: BrazeContentCard) =>
  ({
    id: card.id,
    tag: card.extras.tag,
    title: card.extras.title,
    location: LocationContentCard.Discover,
    image: card.extras.image,
    link: card.extras.link,
    description: card.extras.description,
  } as DiscoverContentCard);

const useDynamicContent = () => {
  const dispatch = useDispatch();
  const { logClickCard, logDismissCard, logImpressionCard } =
    useBrazeContentCard();

  const assetsCards = useSelector(assetsCardsSelector);
  const walletCards = useSelector(walletCardsSelector);
  const discoverCards = useSelector(discoverCardsSelector);
  const hiddenCards: string[] = useSelector(dismissedDynamicCardsSelector);

  const walletCardsDisplayed = useMemo(
    () =>
      walletCards.filter(
        (wc: WalletContentCard) => !hiddenCards.includes(wc.id),
      ),
    [walletCards, hiddenCards],
  );
  const assetsCardsDisplayed = useMemo(
    () =>
      assetsCards.filter(
        (ac: AssetContentCard) => !hiddenCards.includes(ac.id),
      ),
    [assetsCards, hiddenCards],
  );

  const discoverCardsDisplayed = useMemo(
    () =>
      discoverCards.filter(
        (dc: DiscoverContentCard) => !hiddenCards.includes(dc.id),
      ),
    [discoverCards, hiddenCards],
  );

  const isAWalletCardDisplayed = useMemo(
    () => walletCardsDisplayed.length >= 1,
    [walletCardsDisplayed],
  );
  const isADiscoverCardDisplayed = useMemo(
    () => discoverCardsDisplayed.length >= 1,
    [discoverCardsDisplayed],
  );
  const isAtLeastOneCardDisplayed = useMemo(
    () =>
      isAWalletCardDisplayed ||
      isADiscoverCardDisplayed ||
      assetsCardsDisplayed.length >= 1,
    [isAWalletCardDisplayed, isADiscoverCardDisplayed, assetsCardsDisplayed],
  );

  const getAssetCardByIdOrTicker = useCallback(
    (currency: CryptoOrTokenCurrency): AssetContentCard | undefined => {
      if (!currency) {
        return undefined;
      }

      return assetsCardsDisplayed.find(
        (ac: AssetContentCard) =>
          ac.assets.toLowerCase().includes(currency.id.toLowerCase()) ||
          ac.assets.toUpperCase().includes(currency.ticker.toUpperCase()) ||
          ac.displayOnEveryAssets,
      );
    },
    [assetsCardsDisplayed],
  );

  const dismissCard = useCallback(
    (cardId: string) => {
      dispatch(setDismissedDynamicCards([...hiddenCards, cardId]));
    },
    [dispatch, hiddenCards],
  );

  const trackContentCardEvent = useCallback(
    (
      event: "contentcard_clicked" | "contentcard_dismissed",
      params: {
        campaign: string;
        screen: string;
        link: string;
      },
    ) => {
      track(event, params);
    },
    [],
  );

  return {
    walletCards,
    walletCardsDisplayed,
    isAWalletCardDisplayed,
    discoverCardsDisplayed,
    isADiscoverCardDisplayed,
    discoverCards,
    assetsCards,
    getAssetCardByIdOrTicker,
    isAtLeastOneCardDisplayed,
    logClickCard,
    logDismissCard,
    logImpressionCard,
    dismissCard,
    trackContentCardEvent,
  };
};

export default useDynamicContent;
