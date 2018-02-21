// @flow

import { handleActions } from 'redux-actions'

import every from 'lodash/every'
import get from 'lodash/get'
import reduce from 'lodash/reduce'

import type { State } from 'reducers'
import type { Account, Accounts } from 'types/common'

export type AccountsState = Accounts

const state: AccountsState = []

function orderAccountsTransactions(account: Account) {
  const { transactions } = account
  transactions.sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt))
  return {
    ...account,
    transactions,
  }
}

const handlers: Object = {
  SET_ACCOUNTS: (
    state: AccountsState,
    { payload: accounts }: { payload: Accounts },
  ): AccountsState => accounts,

  ADD_ACCOUNT: (
    state: AccountsState,
    { payload: account }: { payload: Account },
  ): AccountsState => [...state, orderAccountsTransactions(account)],

  UPDATE_ACCOUNT: (
    state: AccountsState,
    { payload: account }: { payload: Account },
  ): AccountsState =>
    state.map(existingAccount => {
      if (existingAccount.id !== account.id) {
        return existingAccount
      }

      const { transactions, index } = account

      const updatedAccount = {
        ...existingAccount,
        ...account,
        balance: transactions.reduce((result, v) => {
          result += v.balance
          return result
        }, 0),
        index: index || get(existingAccount, 'currentIndex', 0),
        transactions,
      }

      return orderAccountsTransactions(updatedAccount)
    }),

  REMOVE_ACCOUNT: (state: AccountsState, { payload: account }: { payload: Account }) =>
    state.filter(acc => acc.id !== account.id),
}

// Selectors

export function getTotalBalance(state: { accounts: AccountsState }) {
  return reduce(
    state.accounts,
    (result, account) => {
      result += get(account, 'balance', 0)
      return result
    },
    0,
  )
}

export function getAccounts(state: { accounts: AccountsState }): Array<Account> {
  return state.accounts
}

export function getArchivedAccounts(state: { accounts: AccountsState }): Array<Account> {
  return state.accounts.filter(acc => acc.archived === true)
}

export function getVisibleAccounts(state: { accounts: AccountsState }): Array<Account> {
  return getAccounts(state).filter(account => account.archived !== true)
}

export function getAccountById(state: { accounts: AccountsState }, id: string): Account | null {
  const account = getAccounts(state).find(account => account.id === id)
  return account || null
}

export function canCreateAccount(state: State): boolean {
  return every(getAccounts(state), a => get(a, 'transactions.length', 0) > 0)
}

export default handleActions(handlers, state)
