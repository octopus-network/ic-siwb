import { DelegationChain, DelegationIdentity, Ed25519KeyIdentity, isDelegationValid } from '@dfinity/identity';

import type { SiwbIdentityStorage } from './storage.type';

const STORAGE_KEY = 'siwbIdentity';

/**
 * Loads the SIWB identity from local storage.
 * @throws {Error} If no identity is found, the stored state is invalid, or the delegation has expired.
 */
export function loadIdentity() {
  const storedState = localStorage.getItem(STORAGE_KEY);

  if (!storedState) {
    throw new Error('No stored identity found.');
  }

  const s: SiwbIdentityStorage = JSON.parse(storedState);
  if (!s.address || !s.sessionIdentity || !s.delegationChain) {
    throw new Error('Stored state is invalid.');
  }

  const d = DelegationChain.fromJSON(JSON.stringify(s.delegationChain));
  
  // Verify that the delegation isn't expired.
  if (!isDelegationValid(d)) {
    // Clear the expired identity from local storage.
    clearIdentity();
    throw new Error('Stored identity has expired.');
  }

  const i = DelegationIdentity.fromDelegation(Ed25519KeyIdentity.fromJSON(JSON.stringify(s.sessionIdentity)), d);

  return [s.address, i, d] as const;
}

/**
 * Saves the SIWB identity to local storage.
 */
export function saveIdentity(address: string, sessionIdentity: Ed25519KeyIdentity, delegationChain: DelegationChain) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      address: address,
      sessionIdentity: sessionIdentity.toJSON(),
      delegationChain: delegationChain.toJSON(),
    }),
  );
}

/**
 * Clears the SIWB identity from local storage.
 */
export function clearIdentity() {
  localStorage.removeItem(STORAGE_KEY);
}
