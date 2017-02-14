# fbm-photos-downloader
Download photos from a chat

## Installation
```bash
$ git clone https://github.com/lyneca/fbm-photos-downloader
$ cd fbm-photos-downloader
$ npm install
```

## Usage
```bash
$ node get_photos.js [-t thread ID] [-s username to search for]
```
The `-s` switch will look up a username to search for. This doesn't work with group chats
due to facebook recently changing the way they request that data.

Glorious api provided by [facebook-chat-api](https://github.com/Schmavery/facebook-chat-api)
