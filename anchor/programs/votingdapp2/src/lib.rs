#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod votingdapp2 {
    use super::*;

  pub fn close(_ctx: Context<CloseVotingdapp2>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.votingdapp2.count = ctx.accounts.votingdapp2.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.votingdapp2.count = ctx.accounts.votingdapp2.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeVotingdapp2>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.votingdapp2.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeVotingdapp2<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Votingdapp2::INIT_SPACE,
  payer = payer
  )]
  pub votingdapp2: Account<'info, Votingdapp2>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseVotingdapp2<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub votingdapp2: Account<'info, Votingdapp2>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub votingdapp2: Account<'info, Votingdapp2>,
}

#[account]
#[derive(InitSpace)]
pub struct Votingdapp2 {
  count: u8,
}
