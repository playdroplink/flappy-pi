# Flappy Pi — Complete Documentation Package

## Table of Contents

* [Project Overview](#project-overview)
* [Gameplay Design](#gameplay-design)
* [Pi Network Integration](#pi-network-integration)
* [Frontend Architecture](#frontend-architecture)
* [Backend Architecture](#backend-architecture)
* [API Endpoints](#api-endpoints)
* [Database Schema](#database-schema)
* [Assets & Branding](#assets--branding)
* [Development Setup](#development-setup)
* [Deployment Instructions](#deployment-instructions)
* [Future Enhancements](#future-enhancements)
* [Contact & Support](#contact--support)

---

## Project Overview

**Flappy Pi is an engaging, infinite side-scrolling arcade game inspired by the classic Flappy Bird, designed specifically to integrate seamlessly with the Pi Network ecosystem. It offers a fun, addictive gameplay experience combined with blockchain-powered features such as Pi Network login, in-game purchases using Pi coins, and real-time leaderboards.

The game is built to run smoothly across both desktop browsers and mobile devices, inside or outside the Pi Browser, providing a consistent and immersive experience. Players can customize their bird with collectible skins, compete globally for high scores, and earn real Pi token rewards weekly based on their leaderboard rankings.

Key objectives of Flappy Pi include:

Combining classic, simple game mechanics with modern blockchain integration

Leveraging Pi Network’s user authentication and payment systems

Creating a social, competitive environment through real-time leaderboards

Providing monetization via Pi coin in-game purchases and rewarded ads

Supporting cross-platform play with responsive design and a polished UI

This project is developed and maintained by mrwain organization, aiming to deliver a high-quality, community-driven game that showcases the potential of Pi Network’s blockchain technology in gaming.

---

## Gameplay Design

Flappy Pi delivers a simple yet highly addictive gameplay loop modeled after the classic Flappy Bird:

Core Mechanic:
The player controls a bird that continuously moves horizontally across the screen. By tapping (mobile) or clicking (desktop), the bird flaps its wings to gain altitude. The goal is to navigate through gaps between vertically arranged pipes without colliding.

Infinite Side-Scrolling:
The game features endless procedurally generated pipes that scroll from right to left, creating a continuous challenge that tests the player’s reflexes and timing.

Increasing Difficulty:
As the player progresses, the game gradually increases difficulty by:

Increasing the scrolling speed of pipes

Narrowing the gaps between pipes

Adding occasional pipe patterns for extra challenge

Player Controls:
Smooth and responsive controls are essential. A single tap or click triggers the bird’s flap animation and movement, providing an intuitive and accessible user experience.

Bird Skins:
Players can unlock and equip different bird skins via in-game purchases using Pi coins, allowing personalization and enhancing engagement.

Lives & Revives:
When a player hits a pipe or the ground, the game ends unless the player uses a revive (earned by watching rewarded ads or purchased in the shop) to continue playing.

Score System:
The score increments by one each time the bird successfully passes through a pipe gap. The goal is to achieve the highest possible score.

Leaderboard Integration:
Player scores are submitted to a global leaderboard, allowing competition with others logged in via Pi Network.

Responsive UI:
The game adapts seamlessly between desktop and mobile layouts, ensuring a consistent and enjoyable play experience across devices.

* Side-scrolling bird control using tap/click to flap
* Procedurally generated pipes with increasing difficulty (speed & gap narrowing)
* Bird skins collectible from the in-game shop
* Lives & revives supported via rewarded ads or shop purchases
* Responsive design for desktop and mobile play

---

## Pi Network Integration

Flappy Pi leverages the Pi Network ecosystem to enhance security, user experience, and monetization through seamless blockchain interactions:

1. Pi Login & Authentication
Users authenticate using the official Pi Network SDK, which enables secure, passwordless login based on their Pi account.

This ensures that player identities are uniquely linked to their Pi user IDs, enabling trusted leaderboard rankings and in-game transactions.

The login flow supports both Pi Browser and standard web browsers with fallback options.

2. Pi Payments Integration
In-game purchases in the shop (bird skins, revives, score multipliers) are made using Pi coins.

Payments are handled via Pi Network’s payment APIs to ensure real-time transaction confirmation and security.

Users connect their Pi wallets for seamless send/receive operations within the app.

3. Wallet Connection
Players can view their Pi coin balance and transaction history inside the app.

Wallet connection uses Pi SDK functions, allowing players to authorize payments for purchases and receive Pi rewards.

4. Leaderboard Linking
Player scores and usernames on the leaderboard are tied directly to their Pi user IDs.

This integration prevents cheating and duplicates by validating scores with the backend linked to Pi accounts.

5. Weekly Pi Rewards
The top 10 players on the leaderboard receive Pi token rewards automatically distributed via backend cron jobs.

Reward tiers:

1st place: 5 Pi

2nd place: 3 Pi

3rd place: 2 Pi

4th to 10th place: 0.5 Pi each

6. Ad Monetization Integration
The Pi Ad Network is integrated to allow players to watch rewarded ads in exchange for revives or small Pi bonuses.

Ad SDK handles ad availability, cooldown timers, and user rewards securely.

* Login & authentication via Pi SDK
* In-game Pi payments for purchasing skins, revives, and multipliers
* Wallet connection for seamless transaction experience
* Leaderboard entries linked to Pi user IDs
* Weekly automated Pi reward distribution for top players

---

## Frontend Architecture

The Flappy Pi frontend is built as a responsive, modular web application optimized for both desktop and mobile browsers. It incorporates the following key components and technologies:

1. Core Technologies
HTML5 Canvas — Used as the primary rendering surface for smooth, performant game graphics and animations.

JavaScript (ES6+) — Implements game logic, UI interactions, and integration with external services.

Phaser.js Framework — Utilized for game development, handling physics, sprite animation, input control, and scene management.

CSS3 — For responsive styling and layout adapting to various screen sizes and orientations.

2. Main Frontend Files
index.html
The main entry point, containing the game canvas, UI containers, splash screen, and references to all scripts and styles.

styles.css
Contains responsive styles for the game UI, buttons, menus, and layouts optimized for both mobile and desktop devices.

game.js
Handles the core game logic including:

Bird physics and animation

Pipe generation and movement

Collision detection

Score calculation and display

Difficulty progression

shop.js
Manages the in-game shop UI, listing purchasable items, prices in Pi coins, and handling purchase flows via the Pi payment integration.

leaderboard.js
Fetches and displays the real-time leaderboard data, showing top player scores and usernames linked to Pi user IDs.

ads.js
Implements rewarded ad logic, including ad display, cooldown management, and granting revives or Pi bonuses upon successful ad views.

pi-sdk.js
Wraps Pi Network SDK functions to provide authentication, wallet connection, and payment processing within the game.

3. Asset Management
Assets Folder (assets/)
Contains all static resources such as:

Bird sprites and skins

Pipe and background images

UI icons and buttons

Sound effects and music

App logo for splash screen and favicon

4. Responsive Design
The UI adapts fluidly to different device screen sizes using flexible layouts, scalable canvas rendering, and touch-friendly controls.

Ensures consistent user experience both inside the Pi Browser and in standard web browsers.

5. Initialization & Game Flow
Upon loading, the splash screen with branding is shown briefly.

The Pi Network authentication flow triggers next.

Once authenticated, the main menu is displayed with options for Play, Shop, Leaderboard, and Settings.

Game scenes transition smoothly between gameplay, pause, game over, and shop views.

| File             | Purpose                                               |
| ---------------- | ----------------------------------------------------- |
| `index.html`     | Main HTML entry with canvas and UI elements           |
| `styles.css`     | Responsive styling for all screens                    |
| `game.js`        | Phaser.js game engine logic (bird, pipes, collisions) |
| `shop.js`        | Shop UI and Pi payment integration                    |
| `leaderboard.js` | Fetch and render leaderboard data                     |
| `ads.js`         | Rewarded ad logic and cooldown timers                 |
| `pi-sdk.js`      | Wrapper for Pi Network SDK auth & payments            |
| `assets/`        | Images (bird skins, pipes, background), sounds, logos |

---

## Backend Architecture

* Node.js server or Firebase Functions backend
* REST API endpoints for score saving, leaderboard fetching, and reward distribution
* Database (MongoDB, Firestore, or Realtime DB) for persistent data storage:

  * User scores
  * Purchase history
  * Rewards tracking

---

## API Endpoints

The backend infrastructure for Flappy Pi is designed to securely manage user data, game scores, rewards distribution, and in-game purchases while integrating with the Pi Network ecosystem.

1. Technology Stack
Node.js — Primary runtime environment for backend server.

Express.js — Web framework to create RESTful API endpoints.

Database — MongoDB or Firebase Firestore for scalable, real-time data storage.

Cron Jobs — Scheduled tasks for automatic weekly reward distribution.

Hosting — Firebase Functions, Heroku, or similar cloud platforms for serverless or managed deployment.

2. Key Responsibilities
Score Management
Store and update player scores linked to their unique Pi user IDs. Validate incoming score submissions to prevent cheating or duplication.

Leaderboard Service
Aggregate and return the top 10 players based on their highest scores for display in the frontend.

Purchase Tracking
Maintain records of all in-game purchases (bird skins, revives, multipliers) linked to user accounts for inventory management and fraud prevention.

Reward Distribution
A backend cron job runs weekly to:

Calculate leaderboard rankings

Distribute Pi token rewards to winners via Pi Network payment APIs

Update user reward history and balances

Ad Reward Processing
Track rewarded ad completions and grant appropriate in-game benefits, ensuring one-time crediting per ad viewed.

Authentication Verification
Confirm Pi Network authentication tokens from the frontend to securely associate API requests with authenticated users.

3. API Endpoints
POST /save-score
Accepts user scores with Pi user ID; validates and stores the data.

GET /leaderboard
Returns the current top 10 leaderboard entries.

POST /purchase-item
Processes item purchase requests and updates user inventory.

POST /ad-reward
Logs rewarded ad views and grants revives or bonuses.

POST /distribute-rewards
Cron endpoint to trigger Pi token payments for leaderboard winners.

4. Database Schema Overview
Users Collection/Table
Stores user profiles, Pi user IDs, balances, and purchase history.

Scores Collection/Table
Stores individual game scores with timestamps and user references.

Purchases Collection/Table
Logs purchase transactions with item details and payment status.

Rewards Collection/Table
Tracks rewards distributed to users for auditing and reporting.

5. Security Measures
Validate all incoming requests with authentication tokens.

Sanitize and verify data before database insertion.

Rate limit API calls to prevent abuse.

Secure payment transactions through Pi Network’s official SDK.

| Endpoint              | Method | Description                                  | Payload / Params                    |
| --------------------- | ------ | -------------------------------------------- | ----------------------------------- |
| `/save-score`         | POST   | Save a user’s game score                     | `{ userId: string, score: number }` |
| `/leaderboard`        | GET    | Get top 10 leaderboard scores                | None                                |
| `/distribute-rewards` | POST   | Trigger weekly Pi token rewards distribution | (Cron job triggered; no payload)    |

---

## Database Schema

### Users Collection/Table

| Field           | Type   | Description             |
| --------------- | ------ | ----------------------- |
| userId          | String | Pi Network user ID      |
| username        | String | Display name            |
| totalScore      | Number | Highest score achieved  |
| purchaseHistory | Array  | List of purchased items |

### Scores Collection/Table

| Field     | Type   | Description                  |
| --------- | ------ | ---------------------------- |
| userId    | String | Pi Network user ID           |
| score     | Number | Score from a game session    |
| timestamp | Date   | When the score was submitted |

### Rewards Collection/Table

| Field        | Type    | Description                  |
| ------------ | ------- | ---------------------------- |
| userId       | String  | Pi Network user ID           |
| rewardAmount | Number  | Pi tokens rewarded           |
| week         | String  | Week of reward               |
| distributed  | Boolean | Whether payment is completed |

---

## Assets & Branding

* Custom bird skins in various colors
* Pipe images and backgrounds
* Logo: combination of bird + Pi symbol
* Splash screen with branding text:

  ```
  Flappy Pi  
  Powered by mrwain organization  
  © 2025 mrwain organization. All rights reserved.
  ```

---

## Development Setup

1. Clone the repo
2. Install dependencies (e.g., `npm install`)
3. Configure environment variables for Pi SDK keys and backend URLs
4. Run frontend locally (`npm start` or equivalent)
5. Run backend locally (`node backend/server.js` or Firebase emulators)
6. Connect frontend to backend and Pi SDK

---

## Deployment Instructions

* Frontend hosted on Firebase Hosting, Vercel, or any static host
* Backend hosted on Firebase Functions, Heroku, or any Node.js cloud server
* Configure CI/CD pipelines for automated deploys
* Register app on Pi Network for SDK credentials
* Setup cron job or cloud scheduler for `/distribute-rewards` weekly endpoint

---

## Future Enhancements

* Add multiplayer challenges
* Social features & friend lists
* More skins and customization options
* Daily quests & missions
* Push notifications for rewards and events

---

## Contact & Support

For questions or contributions:
**mrwain organization**
Email: [support@mrwain.org](mailto:support@mrwain.org)
GitHub: github.com/mrwain/flappy-pi

---

