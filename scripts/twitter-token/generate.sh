#!/bin/bash
# Grab oauth token for use with Nitter (requires Twitter account). 
# results: {"oauth_token":"xxxxxxxxxx-xxxxxxxxx","oauth_token_secret":"xxxxxxxxxxxxxxxxxxxxx"}
# 2024-11-14: verified working again
# 2025-01-07: added 2FA support

username=$1
password=$2
# Two-Factor Authentication
# You can use any time-based one time password (TOTP) authentication app like Google Authenticator, Authy, Duo Mobile, 1Password, etc.)
# - Wait for prompt, use authentication app to get code.
# - OR enter here your one-time backup code (limit of 5 active codes, must be used in order created; out of order sequence revokes previous codes)
totp_code=""

if [[ -z "$username" || -z "$password" ]]; then
  echo "needs username and password"
  exit 1
fi

bearer_token='AAAAAAAAAAAAAAAAAAAAAFXzAwAAAAAAMHCxpeSDG1gLNLghVe8d74hl6k4%3DRUMF4xAQLsbeBhTSRrCiQpJtxoGWeyHrDb5te2jpGskWDFW82F'
guest_token=$(curl -s -XPOST https://api.twitter.com/1.1/guest/activate.json -H "Authorization: Bearer ${bearer_token}" -d "grant_type=client_credentials" | jq -r '.guest_token')
base_url='https://api.twitter.com/1.1/onboarding/task.json'
header=(-H "Authorization: Bearer ${bearer_token}" -H "User-Agent: TwitterAndroid/10.21.0-release.0" -H "X-Twitter-Active-User: yes" -H "Content-Type: application/json" -H "X-Guest-Token: ${guest_token}")

# start flow
flow_1=$(curl -si -XPOST "${base_url}?flow_name=login&api_version=1&known_device_token=&sim_country_code=us" "${header[@]}" \
  -d '{"flow_token": null, "input_flow_data": {"country_code": null, "flow_context": {"referrer_context": {"referral_details": "utm_source=google-play&utm_medium=organic", "referrer_url": ""}, "start_location": {"location": "deeplink"}}, "requested_variant": null, "target_user_id": 0}}'
)

# get 'att', now needed in headers, and 'flow_token' from flow_1
att=$(sed -En 's/^att: (.*)\r/\1/p' <<< "${flow_1}")
flow_token=$(sed -n '$p' <<< "${flow_1}" | jq -r .flow_token)

# username
token_2=$(curl -s -XPOST "${base_url}" -H "att: ${att}" "${header[@]}" \
  -d '{"flow_token": "'"${flow_token}"'", "subtask_inputs": [{"enter_text": {"suggestion_id": null, "text": "'"${username}"'", "link": "next_link"}, "subtask_id": "LoginEnterUserIdentifier"}]}' | jq -r .flow_token)

# password flow and print oauth_token and secret
flow_3=$(curl -s -XPOST "${base_url}" -H "att: ${att}" "${header[@]}" \
  -d '{"flow_token": "'"${token_2}"'", "subtask_inputs": [{"enter_password": {"password": "'"${password}"'", "link": "next_link"}, "subtask_id": "LoginEnterPassword"}]}')

token_3=$(jq -r .flow_token <<< "${flow_3}")

check_2fa=$(jq -r .subtasks[0].subtask_id <<< "${flow_3}")

if [[ "${check_2fa}" != "LoginTwoFactorAuthChallenge" ]]; then
  jq -c '.subtasks[0]|if(.open_account) then {oauth_token: .open_account.oauth_token, oauth_token_secret: .open_account.oauth_token_secret} else empty end' <<< "${flow_3}"
  exit 0
fi

# 2FA stuff
if [[ -z "$totp_code" ]]; then
  echo "@${username} - Use your code generator app to generate a code and enter it below."
  read totp_code
fi

curl -s -XPOST "${base_url}" -H "att: ${att}" "${header[@]}" \
  -d '{"flow_token":"'"${token_3}"'","subtask_inputs":[{"subtask_id":"LoginTwoFactorAuthChallenge","enter_text":{"text":"'"${totp_code}"'","link":"next_link"}}]}' |
  jq -c 'if(.subtasks[0].open_account) then {oauth_token: .subtasks[0].open_account.oauth_token, oauth_token_secret: .subtasks[0].open_account.oauth_token_secret} else .errors[0].message end'
