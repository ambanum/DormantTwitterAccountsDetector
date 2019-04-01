Detect sleeping bots on Twitter within the network of a initially predetermined user.

# Feature of a sleeping bot
 
- Max 15 tweets
- Ratio Friends/Followers > 3
- Created after the Feb 01 2019

# Configuration

In the file `.env`:
- Specify your twitter credentials:
```
    CONSUMER_KEY=<TWITTER_CONSUMER_KEY>
    CONSUMER_SECRET=<TWITTER_CONSUMER_SECRET>
    ACCESS_TOKEN=<TWITTER_ACCESS_TOKEN>
    ACCESS_TOKEN_SECRET=<TWITTER_ACCESS_TOKEN_SECRET>
```

- Specify the mongo url:
```
    MONGO_URL=mongodb://localhost/TwitterGraphExplorer
```

- Specify the twitter handle the seed user, it means the user from whom the graph exploration will start:
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

You also can start a web UI to display a counter of sleeping bots found:
```
    npm start
```
# Result

As result, the script stores every users it considers being a sleeping bot in a `twitterusers` collection.
It also stores every users in a backup collection to allow changing features and rerun the detector locally without calling the Twitter API.