# CompanyChain
Company employee management system with blockchain service layer. This application uses blockchain database, IPFS and smart contracts.

## Blockchain philosophy
All the transactions are tracked using blockchain database solution Tableland. Database table definitions(DDL) are deployed as smart contracts. Authentication is done using smart contract. Documents are uploaded to distributed, immutable storage using IPFS protocol and smart contract(CID are paired to employee address)

## Development server
To start application in development mode you need to:

- `npm install -g @tableland/local`
- `npm install -g truffle`

Run `npm install` in root folder as well as in *smart-contracts* folder. 

Next you need to run local  blockchain network and deploy Tableland contracts: 

`npx local-tableland`

This creates **Hardhat** network with accounts and deploys smart-contracts. You need to import this network with at least one account to **Metamask**. 
If you encounter any trouble reffer to Tableland documentation [here](https://docs.tableland.xyz/local-tableland/).

Navigate to *smart-contracts* folder and run:
`truffle migrate --reset --network development`
This deploys apps smart contracts. Copy addresses of deployed contracts.

In the file **config.json** insert needed information and upload this file to IPFS using any provider. **Copy CID**.

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

As application boots, enter **CID** or use sample installation. 

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. However **build is not optimized**, since this application is not intended to be build.

## Running unit tests

Run `truffle test` in *smart-contracts/test* to execute the unit tests via [Mocha](https://mochajs.org).

## Further help

If you need any help feel free to reach me! <patrikhyll@gmail.com>
