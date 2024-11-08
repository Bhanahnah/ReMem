sudo apt-get update
sudo apt-get install docker

# Taken from https://cloud.google.com/sdk/docs/install#deb
sudo apt-get install apt-transport-https ca-certificates gnupg curl
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
sudo apt-get update && sudo apt-get install google-cloud-cli google-cloud-cli-terraform-validator -y

# Athenticate GCP
gcloud auth activate-service-account --key-file=gcp_creds.json
# Make artifact registry work with Docker
gcloud auth configure-docker us-south1-docker.pkg.dev

# Alternative for logging in docker with registry, no messing with gcloud CLI?
#cat gcp_creds.json | docker login -u _json_key --password-stdin \
#https://us-south1-docker.pkg.dev


# To build and push the images
# docker-compose build --pull
# docker-compose push


# Doesn't work since need to "restart VM" for changes to take effect?
# Docker requires privileged access to interact with registries. On Linux or Windows,
# add the user that you use to run Docker commands to the Docker security group.
# This step is not required on macOS since Docker Desktop runs on a virtual machine as the root user.
# sudo usermod -a -G docker ${USER}
