import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Votingdapp2 } from "../target/types/votingdapp2";
import { BankrunProvider, startAnchor } from "anchor-bankrun";
const IDL = require("../target/idl/votingdapp2.json");
const votingAddress = new PublicKey(
  "coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF"
);

describe("votingdapp2", () => {
  let context;
  let provider;
  let votingProgram: Program<Votingdapp2>;

  beforeAll(async () => {
    jest.setTimeout(100000);
    context = await startAnchor(
      "",
      [{ name: "votingdapp2", programId: votingAddress }],
      []
    );
    provider = new BankrunProvider(context);

    votingProgram = new Program<Votingdapp2>(IDL, provider);
  });

  it("Initialize Poll", async () => {
    jest.setTimeout(50000);
    await votingProgram.methods
      .initializePoll(
        new anchor.BN(1),
        "What is your favorite type of peanut butter?",
        new anchor.BN(0),
        new anchor.BN(1735330941)
      )
      .rpc();

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      votingAddress
    );

    const poll = await votingProgram.account.poll.fetch(pollAddress);
    // console.log(poll);

    expect(poll.pollId.toNumber()).toEqual(1);
    expect(poll.description.toString()).toEqual(
      "What is your favorite type of peanut butter?"
    );
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber()); //should fail
    // expect(poll.pollStart.toNumber()).toBeGreaterThan(poll.pollEnd.toNumber())//should pass
    // expect(poll.pollEnd.toNumber()).toEqual(1735330941)
  });

  it("initialize Candidate", async () => {
    jest.setTimeout(50000);
    await votingProgram.methods
      .initializeCandidate("Smooth", new anchor.BN(1))
      .rpc();
    await votingProgram.methods
      .initializeCandidate("Crunchy", new anchor.BN(1))
      .rpc();

    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Crunchy")],
      votingAddress
    );
    const crunchyCandidate = await votingProgram.account.candidate.fetch(
      crunchyAddress
    );
    console.log(crunchyCandidate);
    expect(crunchyCandidate.candidateVotes.toNumber()).toEqual(0);

    const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Smooth")],
      votingAddress
    );
    const smoothCandidate = await votingProgram.account.candidate.fetch(
      smoothAddress
    );
    console.log(smoothAddress);
    expect(smoothCandidate.candidateName.toString()).toEqual("Smooth");
  });
  it("vote", async () => {
    jest.setTimeout(50000);
    await votingProgram.methods.vote("Smooth", new anchor.BN(1)).rpc();
    const [smoothAddress] = await PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8), Buffer.from("Smooth")],
      votingAddress
    );
    const smoothCandidate = await votingProgram.account.candidate.fetch(smoothAddress)
    expect(smoothCandidate.candidateVotes.toNumber()).toEqual(1);
  });
});
