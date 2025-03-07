#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod votingdapp2 {
    use super::*;

    pub fn initialize_poll(
        ctx: Context<InitializePoll>,
        poll_id: u64,
        description: String,
        poll_start: u64,
        poll_end: u64,
    ) -> Result<()> {
        let poll = &mut ctx.accounts.poll;
        poll.poll_id = poll_id;
        poll.poll_start = poll_start;
        poll.description = description;
        poll.poll_end = poll_end;
        poll.candidate_amount = 0;
        Ok(())
    }

    pub fn initialize_candidate(
        ctx: Context<InitializeCandidate>,
        candidate_name: String,
        _poll_id: u64,
    ) -> Result<()> {
        let candidate = &mut ctx.accounts.candidate;
        let poll = &mut ctx.accounts.poll;
        poll.candidate_amount += 1;
        candidate.candidate_name = candidate_name;
        candidate.candidate_votes = 0;
        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, candidate_name: String, _poll_id:u64) -> Result<()> {
      let candidate = &mut ctx.accounts.candidate;
      candidate.candidate_votes += 1;
        Ok(())
    }
}


#[derive(Accounts)]
#[instruction(candidate_name: String, poll_id:u64)]
pub struct Vote<'info>{
  pub signer: Signer<'info>,

  #[account(
    mut,
    seeds=[poll_id.to_le_bytes().as_ref()],
    bump
  )]
  pub poll: Account<'info, Poll>,

  #[account(
    mut, 
    seeds=[poll_id.to_le_bytes().as_ref(), candidate_name.as_bytes()],
    bump
  )]
  pub candidate: Account<'info, Candidate>

}

#[derive(Accounts)]
#[instruction(candidate_name: String, poll_id:u64)]
pub struct InitializeCandidate<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
    // init,
    // payer=signer,
    // space=82+Poll::INIT_SPACE, //commenting these out because they have been created earlier and we're just trying to refrence a poll to increment it's details
    seeds=[poll_id.to_le_bytes().as_ref()],
    bump
)]
    pub poll: Account<'info, Poll>,
    #[account(
    init,
    payer=signer,
    space=82+Candidate::INIT_SPACE,
    seeds=[poll_id.to_le_bytes().as_ref(), candidate_name.as_bytes()],
    bump
)]
    pub candidate: Account<'info, Candidate>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(poll_id:u64)] //We use Instruction TO pull in the parameter we wish to use!
pub struct InitializePoll<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer=signer,
        space=82+Poll::INIT_SPACE,
        seeds=[poll_id.to_le_bytes().as_ref()],//The method to_le_bytes() converts the numeric value of poll_id into its little-endian byte representation.The method .as_ref() converts the byte array returned by to_le_bytes() into a reference (&[u8]).
        //This reference is needed because PDAs in Solana use a slice of bytes as a "seed" for address generation.
        bump
    )]
    pub poll: Account<'info, Poll>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Poll {
    pub poll_id: u64,

    #[max_len(32)]
    pub description: String,
    pub poll_start: u64,
    pub poll_end: u64,
    pub candidate_amount: u64,
}

#[account]
#[derive(InitSpace)]
pub struct Candidate {
    #[max_len(32)]
    pub candidate_name: String,
    pub candidate_votes: u64,
}
