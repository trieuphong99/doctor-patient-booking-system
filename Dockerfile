FROM public.ecr.aws/lambda/nodejs:16

RUN yum install -y python3 && \
    pip3 install --upgrade pip requests

COPY . .

CMD ["dist/serverless.handler"]