// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import Votingdapp2IDL from '../target/idl/votingdapp2.json'
import type { Votingdapp2 } from '../target/types/votingdapp2'

// Re-export the generated IDL and type
export { Votingdapp2, Votingdapp2IDL }

// The programId is imported from the program IDL.
export const VOTINGDAPP2_PROGRAM_ID = new PublicKey(Votingdapp2IDL.address)

// This is a helper function to get the Votingdapp2 Anchor program.
export function getVotingdapp2Program(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...Votingdapp2IDL, address: address ? address.toBase58() : Votingdapp2IDL.address } as Votingdapp2, provider)
}

// This is a helper function to get the program ID for the Votingdapp2 program depending on the cluster.
export function getVotingdapp2ProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Votingdapp2 program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return VOTINGDAPP2_PROGRAM_ID
  }
}
