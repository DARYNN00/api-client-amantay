# Lab 6 - API Client

## API Used and Base URL
- **API Name**: JSONPlaceholder
- **Base URL**: `https://jsonplaceholder.typicode.com`

## Explanation of await and response.ok
- `await` pauses the execution of the async function until the Promise is settled, allowing asynchronous code to look and behave like synchronous code.
- `response.ok` is a boolean flag that checks if the HTTP status code is in the successful range (200-299), which is essential because `fetch` does not throw an error on 404 or 500 responses.
- `try/catch` block safely handles network failures or broken connection exceptions.

## AI Tools Used
- Google Gemini (for API selection and architecture guidance).