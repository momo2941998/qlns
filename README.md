gen HASH 
```
echo -n "your-new-password" | shasum -a 256
```

Build & Run Project
1. Build client
at client/, change .env and run yarn build
2. docker compose up