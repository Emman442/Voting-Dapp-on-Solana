import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Votingdapp2} from '../target/types/votingdapp2'

describe('votingdapp2', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Votingdapp2 as Program<Votingdapp2>

  const votingdapp2Keypair = Keypair.generate()

  it('Initialize Votingdapp2', async () => {
    await program.methods
      .initialize()
      .accounts({
        votingdapp2: votingdapp2Keypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([votingdapp2Keypair])
      .rpc()

    const currentCount = await program.account.votingdapp2.fetch(votingdapp2Keypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Votingdapp2', async () => {
    await program.methods.increment().accounts({ votingdapp2: votingdapp2Keypair.publicKey }).rpc()

    const currentCount = await program.account.votingdapp2.fetch(votingdapp2Keypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Votingdapp2 Again', async () => {
    await program.methods.increment().accounts({ votingdapp2: votingdapp2Keypair.publicKey }).rpc()

    const currentCount = await program.account.votingdapp2.fetch(votingdapp2Keypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Votingdapp2', async () => {
    await program.methods.decrement().accounts({ votingdapp2: votingdapp2Keypair.publicKey }).rpc()

    const currentCount = await program.account.votingdapp2.fetch(votingdapp2Keypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set votingdapp2 value', async () => {
    await program.methods.set(42).accounts({ votingdapp2: votingdapp2Keypair.publicKey }).rpc()

    const currentCount = await program.account.votingdapp2.fetch(votingdapp2Keypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the votingdapp2 account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        votingdapp2: votingdapp2Keypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.votingdapp2.fetchNullable(votingdapp2Keypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
