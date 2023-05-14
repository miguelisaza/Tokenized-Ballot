# Homework Weekend 3 - Tokenized Ballot

Required node version: 

```
```

Make sure that you got Yarn installed in your system

```shell
npm i yarn -g
```

To install the project, run the following commands from the root folder:

```shell
yarn add
yarn hardhat compile
```

And then, run the script: 

```shell
yarn run tokenized-ballot-script Dog Cat Mice Donkey
```

The expected output of the script will be: 

```
Proposals to Ballot:
Proposal N. 1: Dog
Proposal N. 2: Cat
Proposal N. 3: Mice
Proposal N. 4: Donkey
----------------------------------------------------
ERC20 VoteToken contract deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 address at block 1
TokenizedBallot contract deployed at 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 address at block 2.
----------------------------------------------------
The Ballot will only allow voters that got their voting rights until block #8!
----------------------------------------------------
Minted 10.0 VTK to address 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 at block 3
Delegated 10.0 votes to address 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 at block 4
Minted 10.0 VTK to address 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC at block 5
Delegated 10.0 votes to address 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC at block 6
Minted 10.0 VTK to address 0x90F79bf6EB2c4f870365E785982E1f101E93b906 at block 7
Delegated 10.0 votes to address 0x90F79bf6EB2c4f870365E785982E1f101E93b906 at block 8
Minted 10.0 VTK to address 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 at block 9
Delegated 10.0 votes to address 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 at block 10
----------------------------------------------------
0x70997970C51812dc3A010C7d01b50e0d17dc79C8 has 10.0 votes available, and will cast 1.0 votes
0x70997970C51812dc3A010C7d01b50e0d17dc79C8 voted successfully 1.0 times for proposal #2 at block 11, now it has 9.0 remaining votes
0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC has 10.0 votes available, and will cast 3.0 votes
0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC voted successfully 3.0 times for proposal #1 at block 12, now it has 7.0 remaining votes
0x90F79bf6EB2c4f870365E785982E1f101E93b906 has 10.0 votes available, and will cast 4.0 votes
0x90F79bf6EB2c4f870365E785982E1f101E93b906 voted successfully 4.0 times for proposal #1 at block 13, now it has 6.0 remaining votes
0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65 has 0.0 votes available, and will cast 4.0 votes
Error casting vote -> VM Exception while processing transaction: reverted with reason string 'Trying to vote more than allowed'
0x70997970C51812dc3A010C7d01b50e0d17dc79C8 has 9.0 votes available, and will cast 2.0 votes
0x70997970C51812dc3A010C7d01b50e0d17dc79C8 voted successfully 2.0 times for proposal #2 at block 14, now it has 7.0 remaining votes
0x90F79bf6EB2c4f870365E785982E1f101E93b906 has 6.0 votes available, and will cast 7.0 votes
Error casting vote -> VM Exception while processing transaction: reverted with reason string 'Trying to vote more than allowed'
----------------------------------------------------
The winner is Cat
```

Feel free to change the call parameters, target block and mint values from the script.
