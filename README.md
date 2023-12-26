# GemChain

This is a demonstration of [LangChain](https://www.langchain.com/) with Google's [Gemini Pro](https://ai.google.dev/) model. Not intended for production use.

## Quickstart for local development

After cloning the repo, grab a Gemini API key from [here](https://makersuite.google.com/app/apikey) and export it as an environment variable

```shell
export GOOGLE_API_KEY=<YOUR-API-KEY>
```

Create a virtual environment and install the requirements

```shell
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Run the application server
```shell
python -m app.main
```

Open the playground in your browser at [http://localhost:5000/](http://localhost:5000/)

## Quick deploy to Google Cloud

If you don't have a Google Cloud account, you can get one for [free with $300 in credits](https://cloud.google.com/free?hl=en). You will also need a local [Docker](https://docs.docker.com/get-docker/) and [gcloud CLI](https://cloud.google.com/sdk/gcloud).

Set your default Google Cloud project
```shell
export GOOGLE_PROJECT_ID=<YOUR-PROJECT-ID>
gcloud config set project $GOOGLE_PROJECT_ID
```

Build and push the image to Google Cloud
```shell
export GEMCHAIN_IMAGE="gcr.io/<YOUR-PROJECT-ID>/gemchain:latest"
gcloud docker -- push $GEMCHAIN_IMAGE
```

Deploy to Google Cloud Run and allow unauthenticated access
```shell
gcloud run deploy gemchain \
    --allow-unauthenticated \
    --image $GEMCHAIN_IMAGE \
    --platform managed \
    --region us-central1 \
    --set-env-vars GOOGLE_API_KEY=$GOOGLE_API_KEY
```

# License

MIT