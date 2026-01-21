# Sumsub Document Upload Server

This server provides a simple way to upload identity documents (ID card front, back, and selfie) to the Sumsub API. It's designed for local testing and is ideal for use with API clients like Postman.

## Setup

1.  **Install Dependencies**

    ```shell
    npm install
    ```

2.  **Prepare Document Images**

    Place your document images in the `resources` directory with the following names:
    *   `front.png`
    *   `back.png`
    *   `selfie.png`

3.  **Start the Server**

    ```shell
    npm start
    ```

    The server will run on `http://localhost:3000`.

## Usage

Send a `POST` request to the `/upload/:applicantId` endpoint to upload all three documents for a given applicant.

### Authentication

Provide your Sumsub credentials in the request headers. This is the recommended method for flexibility.

*   `X-App-Token`: Your Sumsub App Token
*   `X-Secret-Key`: Your Sumsub Secret Key

As a fallback, you can place a `.env` file in the project root with `SUMSUB_APP_TOKEN` and `SUMSUB_SECRET_KEY`.

### Example cURL

```shell
curl -X POST \
  -H "X-App-Token: YOUR_APP_TOKEN" \
  -H "X-Secret-Key: YOUR_SECRET_KEY" \
  http://localhost:3000/upload/YOUR_APPLICANT_ID
```

Replace `YOUR_APPLICANT_ID`, `YOUR_APP_TOKEN`, and `YOUR_SECRET_KEY` with your actual data.
