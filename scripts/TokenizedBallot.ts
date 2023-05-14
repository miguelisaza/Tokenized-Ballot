import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import {
  TokenizedBallot,
  TokenizedBallot__factory,
  VoteToken,
  VoteToken__factory,
} from "../typechain-types";

const TARGET_BLOCK = 8;
const MINT_VALUE = ethers.utils.parseUnits("10");

function convertStringArrayToBytes32(array: string[]) {
  return array.map(ethers.utils.formatBytes32String);
}

function showDividerLine() {
  return console.log("----------------------------------------------------");
}

/**
 * Deploys contracts for a tokenized voting system.
 *
 * @async
 * @param {SignerWithAddress} deployer - The account used to deploy the contracts.
 *
 * @returns {Promise<{ voteTokenContract: VoteToken, tokenizedBallotContract: TokenizedBallot }>}
 * A promise that resolves to an object containing the deployed `VoteToken` and `TokenizedBallot` contracts.
 *
 * @throws {Error} If an error occurs during the contract deployment process, it is thrown and must be caught by the caller.
 */
async function deployContracts(deployer: SignerWithAddress): Promise<{
  voteTokenContract: VoteToken;
  tokenizedBallotContract: TokenizedBallot;
}> {
  const proposals = process.argv.slice(2) as string[];

  console.log("Proposals to Ballot: ");
  proposals.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });

  showDividerLine();

  //contract factories
  const tokenizedBallotFactory = new TokenizedBallot__factory(deployer);
  const voteTokenFactory = new VoteToken__factory(deployer);

  // deploy voteTokenContract
  const voteTokenContract = await voteTokenFactory.deploy();
  const voteTokenContractTxR = await voteTokenContract.deployTransaction.wait();

  console.log(
    `ERC20 VoteToken contract deployed at ${voteTokenContract.address} address at block ${voteTokenContractTxR.blockNumber}`
  );

  // deploy tokenizedBallotContract
  const tokenizedBallotContract = await tokenizedBallotFactory.deploy(
    convertStringArrayToBytes32(proposals),
    voteTokenContract.address,
    TARGET_BLOCK
  );
  const tokenizedBallotContractTxR =
    await tokenizedBallotContract.deployTransaction.wait();

  console.log(
    `TokenizedBallot contract deployed at ${tokenizedBallotContract.address} address at block ${tokenizedBallotContractTxR.blockNumber}.`
  );

  showDividerLine();

  console.log(
    `The Ballot will only allow voters that got their voting rights until block #${TARGET_BLOCK}!`
  );

  return { voteTokenContract, tokenizedBallotContract };
}

/**
 * Gives vote tokens to a specified address and delegates them for voting.
 *
 * @async
 * @param {VoteToken} tokenContract - The VoteToken contract instance.
 * @param {SignerWithAddress} account - The account to which vote tokens will be minted and delegated.
 *
 * @returns {Promise<void>} A promise that resolves when the tokens have been minted and delegated,
 * or rejects if an error occurs.
 */
async function giveVotesToAddress(
  tokenContract: VoteToken,
  account: SignerWithAddress
): Promise<void> {
  // mint vote tokens
  const mintTx = await tokenContract.mint(account.address, MINT_VALUE);
  const mintTxR = await mintTx.wait();

  console.log(
    `Minted ${ethers.utils.formatUnits(MINT_VALUE)} VTK to address ${
      account.address
    } at block ${mintTxR.blockNumber}`
  );

  // delegate tokens to allow voting
  const delegateTx = await tokenContract
    .connect(account)
    .delegate(account.address);

  const delegateTxR = await delegateTx.wait();

  console.log(
    `Delegated ${ethers.utils.formatUnits(MINT_VALUE)} votes to address ${
      account.address
    } at block ${delegateTxR.blockNumber}`
  );
}

/**
 * Casts a vote for a given proposal on a ballot.
 *
 * @async
 * @param {TokenizedBallot} ballotContract - The ballot contract instance.
 * @param {SignerWithAddress} account - The account used to cast the vote.
 * @param {number} proposalNumber - The number of the proposal to vote for.
 * @param {number} [rawVotes=1] - The number of votes to cast (default is 1).
 *
 * @returns {Promise<void>} Returns a promise that resolves when the vote has been cast,
 * or rejects if an error occurs. If the vote is successful, it will log
 * the account's remaining votes. If an error occurs, it logs the reason.
 *
 * @throws {Error} If an error occurs during the voting process, it is caught
 * and the reason is logged.
 */
async function castVote(
  ballotContract: TokenizedBallot,
  account: SignerWithAddress,
  proposalNumber: number,
  rawVotes = 1
) {
  try {
    const votesAvailable = await ballotContract.votingPower(account.address);
    const votes = ethers.utils.parseUnits(`${rawVotes}`);

    console.log(
      account.address,
      "has",
      ethers.utils.formatUnits(votesAvailable),
      "votes available, and will cast",
      ethers.utils.formatUnits(votes),
      "votes"
    );

    const voteTx = await ballotContract
      .connect(account)
      .vote(proposalNumber, votes);
    const voteTxR = await voteTx.wait();

    const remainingVotes = await ballotContract.votingPower(account.address);

    console.log(
      `${account.address} voted successfully ${ethers.utils.formatUnits(
        votes
      )} times for proposal #${proposalNumber} at block ${
        voteTxR.blockNumber
      }, now it has ${ethers.utils.formatUnits(remainingVotes)} remaining votes`
    );
  } catch (error) {
    if (typeof error === "object" && error !== null && "reason" in error) {
      console.log("Error casting vote ->", error.reason);
    }
  }
}

async function getWinnerProposal(ballotContract: TokenizedBallot) {
  const winnerProposal = await ballotContract.winnerName();
  const winnerName = ethers.utils.parseBytes32String(winnerProposal);

  console.log(`The winner is ${winnerName}`);
}

async function main() {
  const [deployer, account1, account2, account3, account4] =
    await ethers.getSigners();

  // deploy contracts
  const { voteTokenContract, tokenizedBallotContract } = await deployContracts(
    deployer
  );

  showDividerLine();

  // mint tokens and delegate votes to addresses
  await giveVotesToAddress(voteTokenContract, account1);
  await giveVotesToAddress(voteTokenContract, account2);
  await giveVotesToAddress(voteTokenContract, account3);
  await giveVotesToAddress(voteTokenContract, account4);

  showDividerLine();

  // voting starts!
  await castVote(tokenizedBallotContract, account1, 2); // account 1: 1 vote for Proposal 2
  await castVote(tokenizedBallotContract, account2, 1, 3); // account 2: 3 votes for Proposal 1
  await castVote(tokenizedBallotContract, account3, 1, 4); // account 3: 4 votes for Proposal 1
  await castVote(tokenizedBallotContract, account4, 1, 4); // this vote will fail, because account 4 voting rigths were providen in block 10 and the TARGET_BLOCK for voting is 8
  await castVote(tokenizedBallotContract, account1, 2, 2); // account 1: 2 vote for Proposal 2
  await castVote(tokenizedBallotContract, account3, 1, 7); // account 3: 7 votes for Proposal 1 (will fail because it doesn't have enough voting power left)

  showDividerLine();

  // check winner!
  await getWinnerProposal(tokenizedBallotContract);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
