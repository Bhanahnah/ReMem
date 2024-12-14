IMG_NAME=server-api
GCP_DOCKER_IMG=us-south1-docker.pkg.dev/remem-440605/remem-images/$(IMG_NAME)
BUILD_TAG=v0.1

# Determine if the image needs to be built and pushed
check-image:
	@if docker pull $(GCP_DOCKER_IMG):$(BUILD_TAG) 2>/dev/null; then \
		docker save $(GCP_DOCKER_IMG):$(BUILD_TAG) | sha256sum > remote.sha256; \
		docker build -q -t $(GCP_DOCKER_IMG):$(BUILD_TAG) . | sha256sum > local.sha256; \
		if cmp -s remote.sha256 local.sha256; then \
			echo "Image is up to date. Skipping build and push."; \
			exit 0; \
		fi; \
	fi

build-dev:
	docker build --no-cache -f Dockerfile -t $(GCP_DOCKER_IMG):dev -t $(GCP_DOCKER_IMG):$(BUILD_TAG) .

build-prod:
	docker build -f Dockerfile -t $(GCP_DOCKER_IMG):prod -t $(GCP_DOCKER_IMG):$(BUILD_TAG) .

push-dev: build-dev
	docker push $(GCP_DOCKER_IMG):dev
	docker push $(GCP_DOCKER_IMG):$(BUILD_TAG)

push-prod: build-prod
	docker push $(GCP_DOCKER_IMG):prod
	docker push $(GCP_DOCKER_IMG):$(BUILD_TAG)

clean:
	rm -f remote.sha256 local.sha256
