/* @flow strict-local */
import React from 'react';
import type { Node } from 'react';
import { View } from 'react-native';

import { BRAND_COLOR, createStyleSheet } from '../styles';
import ZulipText from '../common/ZulipText';
import Touchable from '../common/Touchable';
import ZulipTextIntl from '../common/ZulipTextIntl';
import { IconDone, IconTrash } from '../common/Icons';
import { useGlobalSelector } from '../react-redux';
import { getIsActiveAccount } from './accountsSelectors';
import type { AccountStatus } from './AccountPickScreen';

const styles = createStyleSheet({
  wrapper: {
    justifyContent: 'space-between',
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    height: 72,
  },
  selectedAccountItem: {
    borderColor: BRAND_COLOR,
    borderWidth: 1,
  },
  details: {
    flex: 1,
    marginLeft: 16,
  },
  text: {
    fontWeight: 'bold',
    marginVertical: 2,
  },
  icon: {
    padding: 12,
    margin: 12,
  },
  signedOutText: {
    fontStyle: 'italic',
    color: 'gray',
    marginVertical: 2,
  },
});

type Props = $ReadOnly<{|
  account: AccountStatus,
  onSelect: AccountStatus => Promise<void> | void,
  onRemove: AccountStatus => Promise<void> | void,
|}>;

export default function AccountItem(props: Props): Node {
  const { email, realm, isLoggedIn } = props.account;

  const isActiveAccount = useGlobalSelector(state => getIsActiveAccount(state, { email, realm }));

  // Don't show the "remove account" button (the "trash" icon) for the
  // active account when it's logged in.  This prevents removing it when the
  // main app UI, relying on that account's data, may be on the nav stack.
  // See `getHaveServerData`.
  const showDoneIcon = isActiveAccount && isLoggedIn;

  const backgroundItemColor = isLoggedIn ? 'hsla(177, 70%, 47%, 0.1)' : 'hsla(0,0%,50%,0.1)';
  const textColor = isLoggedIn ? BRAND_COLOR : 'gray';

  return (
    <Touchable style={styles.wrapper} onPress={() => props.onSelect(props.account)}>
      <View
        style={[
          styles.accountItem,
          showDoneIcon && styles.selectedAccountItem,
          { backgroundColor: backgroundItemColor },
        ]}
      >
        <View style={styles.details}>
          <ZulipText style={[styles.text, { color: textColor }]} text={email} numberOfLines={1} />
          <ZulipText
            style={[styles.text, { color: textColor }]}
            text={realm.toString()}
            numberOfLines={1}
          />
          {!isLoggedIn && (
            <ZulipTextIntl style={styles.signedOutText} text="Signed out" numberOfLines={1} />
          )}
        </View>
        {!showDoneIcon ? (
          <IconTrash
            style={styles.icon}
            size={24}
            color="crimson"
            onPress={() => props.onRemove(props.account)}
          />
        ) : (
          <IconDone style={styles.icon} size={24} color={BRAND_COLOR} />
        )}
      </View>
    </Touchable>
  );
}
