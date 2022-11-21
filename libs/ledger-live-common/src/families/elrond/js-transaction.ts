import { $Shape } from "utility-types";
import { BigNumber } from "bignumber.js";
import type { ElrondAccount, Transaction } from "./types";
import { getFees } from "./api";
import { GAS, MIN_GAS_LIMIT } from "./constants";
import { ElrondEncodeTransaction } from "./encode";

const sameFees = (a, b) => (!a || !b ? false : a === b);

/**
 * Create an empty transaction
 *
 * @returns {Transaction}
 */
export const createTransaction = (): Transaction => {
  return {
    family: "elrond",
    mode: "send",
    amount: new BigNumber(0),
    recipient: "",
    useAllAmount: false,
    fees: new BigNumber(50000),
    gasLimit: MIN_GAS_LIMIT,
  };
};

/**
 * Apply patch to transaction
 *
 * @param {*} t
 * @param {*} patch
 */
export const updateTransaction = (
  t: Transaction,
  patch: $Shape<Transaction>
): Transaction => {
  return { ...t, ...patch };
};

/**
 * Prepare transaction before checking status
 *
 * @param {ElrondAccount} a
 * @param {Transaction} t
 */
export const prepareTransaction = async (
  a: ElrondAccount,
  t: Transaction
): Promise<Transaction> => {
  const tokenAccount =
    (t.subAccountId &&
      a.subAccounts &&
      a.subAccounts.find((ta) => ta.id === t.subAccountId)) ||
    null;

  if (tokenAccount) {
    t.data = ElrondEncodeTransaction.ESDTTransfer(t, tokenAccount);
    t.gasLimit = GAS.ESDT_TRANSFER; //gasLimit for and ESDT transfer
  } else {
    switch (t.mode) {
      case "reDelegateRewards":
        t.gasLimit = GAS.DELEGATE;
        t.data = ElrondEncodeTransaction.reDelegateRewards();
        break;

      case "withdraw":
        t.gasLimit = GAS.DELEGATE;
        t.data = ElrondEncodeTransaction.withdraw();
        break;

      case "unDelegate":
        t.gasLimit = GAS.DELEGATE;
        t.data = ElrondEncodeTransaction.unDelegate(t);
        break;

      case "delegate":
        t.gasLimit = GAS.DELEGATE;
        t.data = ElrondEncodeTransaction.delegate();
        break;

      case "claimRewards":
        t.gasLimit = GAS.CLAIM;
        t.data = ElrondEncodeTransaction.claimRewards();
        break;

      default:
        break;
    }
  }

  const fees = await getFees(t);

  // FIXME DEBUG TBR
  console.log("XXX - prepareTransaction - t: ", t);
  console.log("XXX - prepareTransaction - fees: ", fees.toFixed());

  if (!sameFees(t.fees, fees)) {
    return { ...t, fees };
  }

  return t;
};
