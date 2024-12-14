# Use an official Python base image
FROM python:3.10-slim AS build

# Set environment variables
# ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH=/packages

# Create and set the working directory
WORKDIR /app

# Copy the requirements.txt (or your requirements file) and install dependencies
COPY ./requirements.txt /app/

# Install Python dependencies into a separate directory (/packages)
RUN pip install --no-cache-dir -r /app/requirements.txt --target /packages

# Copy the rest of your app's source code
COPY ./api /app/api
COPY ./common /app/common
COPY ./gunicorn.conf.py /app/

# SSL for HTTPS
RUN mkdir -p /etc/ssl/certs /etc/ssl/private
COPY server.crt /etc/ssl/certs/server.crt
COPY server.key /etc/ssl/private/server.key

# Expose the necessary port (typically 5000 for Flask apps)
EXPOSE 6060
# For HTTPS?
EXPOSE 443

# Set the entry point to run the application with Gunicorn
# CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app.wsgiapp:app"]
CMD ["python", "/packages/gunicorn/app/wsgiapp.py","api.wsgi:app"]



## OLD NON-WORKING!!!!!! But slimmer.....
# # FROM python:3.9.2-slim-buster@sha256:721de1d0aea3331da282531b8b9e428d552b89bd6fd0d0c14e634deaddc241fc as build
# # FROM --platform=linux/amd64 python:3.10.0 AS build
# FROM python:3.10.0 AS build
# RUN groupadd auth0 && useradd -m developer -g auth0
# USER developer
# WORKDIR /home/developer
# COPY ./requirements.txt ./app/requirements.txt
# RUN pip install --upgrade pip
# # --platform manylinux2014_x86_64  --only-binary=:all: to get pydantic_core to work?
# # RUN pip install --disable-pip-version-check -r ./app/requirements.txt --target ./packages
# RUN pip install -r ./app/requirements.txt --target ./packages
# # RUN pip install --python-version 3.10.0 --only-binary=:all: -r ./app/requirements.txt --target ./packages
# COPY ./api ./app/api
# COPY ./common ./app/common
# COPY ./gunicorn.conf.py ./app

# FROM gcr.io/distroless/python3
# # FROM gcr.io/distroless/python3@sha256:eb773dd9d39f0becdab47e2ef5f1b10e2988c93a40ac8d32ca593096b409d351
# COPY --from=build /home/developer/app /app
# COPY --from=build /home/developer/packages /packages
# USER 1000
# EXPOSE 6060
# ENV PYTHONPATH="/packages"
# WORKDIR /app
# CMD ["/packages/gunicorn/app/wsgiapp.py","api.wsgi:app"]
