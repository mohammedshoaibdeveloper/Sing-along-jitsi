#!/bin/sh
RECORDINGS_DIR=$1

VIDEO_FILE_PATH=$(find $RECORDINGS_DIR -name *.mp4)
VIDEO_FILE_NAME=${VIDEO_FILE_PATH:33}
UPLOAD_DIR_NAME=${VIDEO_FILE_NAME/%_*/}
GOOGLE_DRIVE='gDrive'
S3='S3'

echo $RECORDINGS_DIR >> /var/log/jitsi/jibri/recording_finish_process.log
echo $VIDEO_FILE_PATH >> /var/log/jitsi/jibri/recording_finish_process.log
echo $VIDEO_FILE_NAME >> /var/log/jitsi/jibri/recording_finish_process.log
echo $UPLOAD_DIR_NAME >> /var/log/jitsi/jibri/recording_finish_process.log
curl https://hallelujahgospel.com/api/recording-server > /etc/jitsi/jibri/response.json
TYPE=$(cat /etc/jitsi/jibri/response.json | jq -r '.type')

if [[ $TYPE == "$GOOGLE_DRIVE" ]]; then
    echo "In Google Drive" >> /var/log/jitsi/jibri/recording_finish_process.log
    TOKEN=$(cat /etc/jitsi/jibri/response.json | jq '.credentials' | jq -c .)
    rm -rf /home/jibri/.config/rclone/rclone.conf
    cat << EOT >> /home/jibri/.config/rclone/rclone.conf
[gd]
type = drive
client_id = 230607611306-pv7mjcvg3lc4p8e19s0uok6oqr6smiv3.apps.googleusercontent.com
client_secret = TlPMywVYJVcH9hNGXSDnHCsQ
scope = drive
token = $TOKEN
root_folder_id =
EOT
    /usr/bin/rclone copy $VIDEO_FILE_PATH gd:sing-along-recordings -v >> /var/log/jitsi/jibri/recording_finish_process.log
    RECORDING_URL=$(/usr/bin/rclone link gd:sing-along-recordings/$VIDEO_FILE_NAME)
    echo $RECORDING_URL >> /var/log/jitsi/jibri/recording_finish_process.log


fi

if [[ $TYPE == $S3 ]]; then
    echo "In S3" >> /var/log/jitsi/jibri/recording_finish_process.log
    AWS_ACCESS_KEY=$(cat /etc/jitsi/jibri/response.json | jq -r '.credentials.access_key')
    AWS_ACCESS_SECRET=$(cat /etc/jitsi/jibri/response.json | jq -r '.credentials.access_secret')
    rm -rf /home/jibri/.config/rclone/rclone.conf
    cat << EOT >> /home/jibri/.config/rclone/rclone.conf
[s3]
type = s3
provider = AWS
env_auth = false
access_key_id = $AWS_ACCESS_KEY
secret_access_key = $AWS_ACCESS_SECRET
region = us-west-1
location_constraint = us-west-1
acl = private

EOT

    /usr/bin/rclone copy $VIDEO_FILE_PATH s3:hallelujahgospel-videos -v >> /var/log/jitsi/jibri/recording_finish_process.log
    RECORDING_URL=https://hallelujahgospel-videos.s3-us-west-1.amazonaws.com/$VIDEO_FILE_NAME

fi


echo 'FInal' >> /var/log/jitsi/jibri/recording_finish_process.log
echo $RECORDING_URL >> /var/log/jitsi/jibri/recording_finish_process.log
EVENT_ID=$(cat $RECORDINGS_DIR/metadata.json | jq -r '.eventId')
echo $EVENT_ID >> /var/log/jitsi/jibri/recording_finish_process.log
curl "https://www.hallelujahgospel.com/api/save-recording?event_id=$EVENT_ID&url=$RECORDING_URL" >> /var/log/jitsi/jibri/recording_finish_process.log
rm -rf /tmp/recordings/*
