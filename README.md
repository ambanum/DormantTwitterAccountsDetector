Detect dormant bots on Twitter within the network of some given account.

# Features of a dormant account
 
_Keep in mind that this is just a hackathon proof of concept. No one is saying that any account bearing these features is necessarily a dormant bot. However, manual classification has proven that even with such naive conditions, around 85% of detected accounts do indeed seem to be inauthentic._

- Max 15 tweets
- Ratio Friends/Followers > 3
- Created after Feb 01 2019

# Configuration

In the file `.env`:

- Specify your Twitter credentials:

```
    CONSUMER_KEY=<TWITTER_CONSUMER_KEY>
    CONSUMER_SECRET=<TWITTER_CONSUMER_SECRET>
    ACCESS_TOKEN=<TWITTER_ACCESS_TOKEN>
    ACCESS_TOKEN_SECRET=<TWITTER_ACCESS_TOKEN_SECRET>
```

- Specify the MongoDB url:

```
    MONGO_URL=mongodb://localhost/TwitterGraphExplorer
```

- Specify the Twitter handle of the seed user, that is the user from whom the graph exploration will start:

```
    USER_SEED=ndpnt
```

# Usage

Install dependencies:

```
    npm install
```

Insert the seed user:

```
    node firstUserToExplore.js
```

Start the detector:

```
    node jobsRunner.js
```

You also can start a web UI to display a counter of dormant bots found:
```
    npm start
```
# Result

As result, the script stores every account matching the given conditions in a `twitterusers` collection.
It also stores every encountered account in a backup collection to allow changing features and rerun the detector locally without calling the Twitter API.
