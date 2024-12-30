import { headers } from "next/headers";
import {
  ActionGetResponse,
  ActionPostRequest,
  ACTIONS_CORS_HEADERS,
  createPostResponse,
} from "@solana/actions";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
const IDL = require("../../../../anchor/target/idl/votingdapp2.json");
import { Votingdapp2 } from "@project/anchor";
import { Program } from "@coral-xyz/anchor";
export const OPTIONS = GET;
import * as anchor from "@coral-xyz/anchor";

export async function GET(request: Request) {
  const actionMetadata: ActionGetResponse = {
    icon: "https://media.istockphoto.com/id/1305693160/photo/peanut-butter-in-an-open-jar-and-peanuts-in-the-skin-are-scattered-on-the-blue-table-space.jpg?s=2048x2048&w=is&k=20&c=3pjfDHeEWQpETpgchMWSl0SxX1PPeD91QjVFAitrcf0=",
    title: "Vote for your favourite type of peanut butter",
    description: "Vote between Crunchy and Smoothy",
    label: "Vote",
    links: {
      actions: [
        {
          label: "Vote for crunchy",

          href: "/api/vote?candidate=Crunchy",
          type: "post",
        },
        {
          label: "Vote for Smooth",
          type: "post",
          href: "/api/vote?candidate=Smooth",
        },
      ],
    },
  };
  return Response.json(actionMetadata, { headers: ACTIONS_CORS_HEADERS });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const candidate = url.searchParams.get("candidate");

  if (candidate != "Crunchy" && candidate != "Smooth") {
    return new Response("Invalid candidate", {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }

  const connection = new Connection("http://127.0.0.1:8899", "confirmed");
  const program: Program<Votingdapp2> = new Program(IDL, { connection });
  const body: ActionPostRequest = await request.json();
  let voter;

  try {
    voter = new PublicKey(body.account);
  } catch (error) {
    return new Response("Invalid Account", {
      status: 400,
      headers: ACTIONS_CORS_HEADERS,
    });
  }

  const instruction = await program.methods
    .vote(candidate, new anchor.BN(1)).accounts({signer: voter})
    .instruction();

    const blockhash = await connection.getLatestBlockhash();
    const transaaction = new Transaction({
      blockhash: blockhash.blockhash,
      feePayer: voter,
      lastValidBlockHeight: blockhash.lastValidBlockHeight
    }).add(instruction)

    const response = await createPostResponse({
      fields:{
        transaction: transaaction
      }
    })

    return Response.json(response, {headers: ACTIONS_CORS_HEADERS})
}
