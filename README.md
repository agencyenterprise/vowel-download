# Vowel Download

This is a script to download all your Vowel call data before they completely shutdown.

## Steps to run this project

### Install
```
yarn install
```

### Find Vowel's auth cookie value
Vowel's auth cookie value is found by looking for the cookies when accessing Vowel in your browser. The example below is using a chrome extension for managing cookies, but you can also find it by looking into vowel requests in your chrome devtools' Network tab.


<img width="561" alt="vowel_auth_cookie" src="https://github.com/agencyenterprise/vowel-download/assets/5142389/9bfe8f5f-a1b8-47b7-a716-b6310f776452">

### Setting up your .env
1. Copy the .env-example file, changing its name to .env
1. Set VOWEL_AUTH_TOKEN with the value found in your browser

### Run the script
```
yarn start
```
You can optionally pass a custom batch size "-b" (defaults to 5) and/or a different Vowel auth cookie value "-a" (defaults to var in .env.
```
yarn start -b 10 -a SomeRandomAuthCookieValue
```
If you need help remembering what values you can pass to the script, you can read its help
```
yarn start --help
```
