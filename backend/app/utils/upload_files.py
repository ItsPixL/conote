import boto3
from werkzeug.utils import secure_filename

def get_s3_client(app):
    return boto3.client(
        "s3",
        aws_access_key_id=app.config["S3_KEY"],
        aws_secret_access_key=app.config["S3_SECRET"]
    )

def upload_file_to_s3(file, app, bucket_name, acl="public-read"):
    s3 = get_s3_client(app)
    filename = secure_filename(file.filename)
    s3.upload_fileobj(
        file,
        bucket_name,
        filename,
        ExtraArgs={"ACL": acl, "ContentType": file.content_type}
    )
    return f"https://{bucket_name}.s3.amazonaws.com/{filename}"
