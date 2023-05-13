# Cloud Cache

## Description

This is a simple cache setup which solves my initial problem^[1] mentioned below. This cloud function pushes a copy of the image/data from remote config and pushes it to firebase storage. The cloud function runs on a cron job which is scheduled to run every 2 hour.

#### The Problem $^{[1]}$

I use DenverCoder1's github-readme-streak-stats & anuraghazra's popular github-readme-stats both of which are hosted on vercel and generate the image on the fly.  
Since the images are generated everytime someone requests for them they either take a lot of time to load or just straight up dont load, to be more presise it mostly happens during vercel functions cold start.  
This is where this cloud function comes in. It caches the image and pushes it to firebase storage. The image is then served from firebase storage.

## Usage

The cloud function is deployed on firebase and is scheduled to run every 2 hours.

## Deploy

```bash
# Install firebase cli
npm install -g firebase-tools

# Login to firebase
firebase login

# Init firebase
firebase init

# Deploy
firebase deploy
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
