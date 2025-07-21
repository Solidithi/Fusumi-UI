#  🌊 FUSUMI 🪸

<h3 align="center">FUSUMI</h3>
<p align="center">
Bridging Future Promises to Present Liquidity
</p>

<p align="center">
    <img src="public/Fusumi_Logo.png" alt="Fusumi Logo" width="150" height="150"/>
</p>

---

## Table of Contents 🏆
- [🌊 FUSUMI 🪸](#-fusumi-)
  - [Table of Contents 🏆](#table-of-contents-)
  - [Introduction 📕](#introduction-)
  - [Features ☕](#features-)
  - [How It Works 🛠️](#how-it-works-️)
  - [Tech Stack 💻](#tech-stack-)
  - [Demo 🎥](#demo-)
  - [Installation 📦](#installation-)
  - [Smart Contracts 📜](#smart-contracts-)
  - [Team Core 🎮](#team-core-)

## Introduction 📕

**Fusumi** is a groundbreaking decentralized finance (DeFi) and PayFi protocol designed to transform how businesses and consumers interact with debt and liquidity. Whether you're a developer seeking to integrate innovative payment solutions or a business user looking to unlock new financial models, Fusumi offers a unique value proposition.

Inspired by the vastness and fluidity of the ocean, Fusumi is charting a new course in the DeFi/PayFi landscape, turning future promises into present opportunities. At its core, Fusumi facilitates the transformation of future financial obligations and promises to pay into immediate, accessible liquidity within a blockchain framework.


## Features ☕

- **🔐 Debt-NFT Innovation**: Revolutionary system that mints Non-Fungible Tokens (NFTs) to represent debt obligations, creating redeemable assets that can be settled by payers or traded on dedicated liquidity marketplaces.

- **⚡ Instant Liquidity Conversion**: Transform future receivables into present capital by enabling businesses to sell debt-NFTs to third-party investors, providing immediate access to funds.

- **🌍 Flexible Payment Solutions**: Empowers both B2B and B2C models with versatile payment options including instant pay, pay-later schemes, and subscription-based services.

- **🪸 Fractionalization Technology**: Advanced capability to divide single debt-NFTs into multiple smaller NFTs, with each fraction representing percentage ownership and automatic proportional payment distribution.

- **💰 Dynamic Credit Management**: Incorporates sophisticated credit scoring mechanisms to mitigate risk and ensure sustainable lending practices within the ecosystem.

- **📊 Real-Time Asset Tracking**: Features dynamic NFT URIs that reflect real-time ownership and payment status, providing transparent and up-to-date asset information.

- **📄 Smart Contract Governance**: Built on Move language and deployed on Move testnet, leveraging smart contracts to govern the entire lifecycle of debt from issuance and transfer to payment and fractionalization.

- **🎨 Ocean-Inspired Design**: Beautiful, responsive interface inspired by the oceanic aesthetic of the Aptos/Move ecosystem, providing an intuitive and engaging user experience.

- **🔄 Move Blockchain Integration**: Seamless integration with Move blockchain for secure and efficient transactions, providing enterprise-grade reliability for all financial operations.

- **🖼️ IPFS Integration**: Decentralized file storage through Pinata for NFT metadata, ensuring permanent and accessible storage for all digital debt assets.SUMI UI 🪸

<p alig- **🔄 Aptos Blockchain Integration**: Seamless integration with Aptos blockchain for secure and fast transactions, providing enterprise-grade reliability for all business operations.


---

## How It Works 🛠️

1. **Service Consumption & Debt-NFT Minting**  
   - When a service is consumed and payment is not immediate, Fusumi automatically generates a debt-NFT that encapsulates the debt owed by the user (debtor) to the business (creditor). These aren't just digital receipts—they're redeemable assets with real financial value.

2. **Liquidity Marketplace Trading**  
   - Businesses can convert their future receivables into present capital by selling debt-NFTs to third-party investors on our dedicated liquidity marketplace. This transforms traditional accounts receivable into immediate cash flow.

3. **Fractionalization & Investment Opportunities**  
   - Single debt-NFTs can be divided into multiple smaller fractional NFTs, each representing a percentage of ownership. Payments to the root NFT automatically distribute proportionally to all fractional holders, creating granular investment opportunities.

4. **Smart Contract Lifecycle Management**  
   - Built on Move language with smart contracts governing the entire debt lifecycle from issuance and transfer to payment and fractionalization. Dynamic NFT URIs reflect real-time ownership and payment status with integrated credit scoring for risk mitigation.

## Tech Stack 💻

- **Frontend Framework**: [Next.js 13.5.8](https://nextjs.org/) with App Router
- **Language**: [TypeScript 5.8.3](https://www.typescriptlang.org/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Blockchain**: [Move Language](https://move-language.github.io/move/), [Move Testnet](https://aptosfoundation.org/)
- **Database**: [Prisma](https://www.prisma.io/), [PostgreSQL](https://www.postgresql.org/)
- **Storage**: [IPFS/Pinata](https://pinata.cloud/)
- **Icons**: [Lucide Icons](https://lucide.dev/)

## Demo 🎥

Experience the future of DeFi and PayFi with Fusumi!

👉 [Live Demo](https://youtu.be/qu0K_W3PMvs?si=9CIr6br-DZyDo7sC) <!-- Replace with actual demo link -->


## Installation 📦

Follow these steps to set up the Fusumi protocol locally:

1. **Clone the Repository**
   ```sh
   git clone https://github.com/Solidithi/Fusumi-UI.git
   cd Fusumi-UI
   ```

2. **Install Dependencies**
   ```sh
   pnpm install
   # or
   npm install
   ```

3. **Set Up Environment Variables**
   - Create a `.env.local` file in the root directory.
   - Add the following environment variables:
     ```env
     NEXT_PUBLIC_MOVE_NETWORK=testnet
     NEXT_PUBLIC_PINATA_API_KEY=your_pinata_key
     NEXT_PUBLIC_PINATA_SECRET_KEY=your_pinata_secret
     DATABASE_URL=your_postgresql_connection_string
     ```

4. **Initialize Database**
   ```sh
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the Application**
   ```sh
   pnpm dev
   # or
   npm run dev
   ```

6. **Access the Application**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Smart Contracts 📜

The core Move smart contracts that power the Fusumi protocol are maintained in a separate repository:

👉 **[Fusumi Smart Contracts](https://github.com/Solidithi/Fusumi-Contracts)**

This repository contains:
- **Debt-NFT Minting Contracts**: Core logic for creating and managing debt-NFTs
- **Fractionalization Logic**: Smart contracts enabling debt-NFT splitting and proportional distribution
- **Marketplace Contracts**: Trading mechanisms for the liquidity marketplace
<!-- - **Credit Scoring System**: On-chain credit assessment and risk management -->
- **Payment Settlement**: Automated payment processing and distribution logic

## Team Core 🎮

1. **[notlongfen](https://github.com/notlongfen)**  
   Full Stack & Blockchain Developer  
   Lead developer specializing in Next.js applications and Aptos blockchain integration. Focuses on creating seamless user experiences and robust backend architectures for decentralized applications.

2. **[ducmint864](https://github.com/ducmint864)**  
   Full Stack & Blockchain Developer  
   Expert in frontend development and smart contract integration. Crafts intuitive interfaces and ensures smooth blockchain interactions across the platform.

3. **[nguyenkhanh0209](https://github.com/nguyenkhanh0209)**  
   Full Stack & Blockchain Developer  
   Specializes in data architecture and API development. Ensures reliable data persistence and scalable backend solutions for the Fusumi ecosystem.

4. **[Trong-tra](https://github.com/Trong-tra)**  
   Full Stack & Blockchain Developer  
   Strategic developer with expertise in NFT systems and marketplace functionality. Drives innovation in coral NFT trading and split ownership mechanisms.

---

Made with ❤️ by Fusumi Team
