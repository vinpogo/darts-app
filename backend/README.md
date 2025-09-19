## How to use backend API

To install dependencies:

```sh
bun install
```

To run:

```sh
bun run dev
```

open http://localhost:3521

## How to call the backend API

You can interact with the backend API through **Postman**, or use the **cURL** commands if you prefer working in the terminal 🤪.

### 1. POST Throw Results

**Endpoint:**

```
http://localhost:3521/
```

**Request Body (JSON):**

```json
[
    {
        "aim": "D18",
        "hit": "D1"
    },
    {
        "aim": "D18",
        "hit": "D1"
    },
    {
        "aim": "D18",
        "hit": "D1"
    }
]
```

**cURL Example:**

```bash
curl -X POST http://localhost:3521/ \
  -H "Content-Type: application/json" \
  -d '[
    {
      "aim": "D18",
      "hit": "D1"
    },
    {
      "aim": "D18",
      "hit": "D1"
    },
    {
      "aim": "D18",
      "hit": "D1"
    }
  ]'
```

---

### 2. GET AI Result by Score

**Endpoint:**

```
http://localhost:3521?score=<score>
```

For example, to check the result of a score of `495`:

```bash
curl -X GET "http://localhost:3521?score=495"
```
