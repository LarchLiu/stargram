#!/bin/bash
# Grab oauth token for use with Nitter (requires Twitter account). 
# results: {"oauth_token":"xxxxxxxxxx-xxxxxxxxx","oauth_token_secret":"xxxxxxxxxxxxxxxxxxxxx"}
# https://gist.github.com/cmj/998f59680e3549e7f181057074eccaa3

username=$1
password=$2

if [[ -z "$username" || -z "$password" ]]; then
  echo "needs username and password"
  exit 1
fi

bearer_token='AAAAAAAAAAAAAAAAAAAAAFXzAwAAAAAAMHCxpeSDG1gLNLghVe8d74hl6k4%3DRUMF4xAQLsbeBhTSRrCiQpJtxoGWeyHrDb5te2jpGskWDFW82F'
guest_token=$(curl -s -XPOST https://api.twitter.com/1.1/guest/activate.json -H "Authorization: Bearer ${bearer_token}" -H 'Connection: close' | jq -r '.guest_token')

header=(-H "Authorization: Bearer ${bearer_token}" -H "Content-Type: application/json" -H "User-Agent: TwitterAndroid/10.21.1" -H "X-Guest-Token: ${guest_token}")

task_1=$(curl -si -XPOST 'https://twitter.com/i/api/1.1/onboarding/task.json?flow_name=login' "${header[@]}" -d '{"":""}')

att=$(sed -En 's/att: (.*)\r/\1/p' <<< "${task_1}")
flow_token=$(sed -En 's/(.*flow_token.*)/\1/p' <<< "${task_1}" | jq -r .flow_token)

token_2=$(curl -s -XPOST 'https://twitter.com/i/api/1.1/onboarding/task.json' -H "att: ${att}" "${header[@]}" \
  -d "{\"flow_token\": \"${flow_token}\" ,\"subtask_inputs\": [{\"subtask_id\":\"LoginEnterUserIdentifierSSO\",\"settings_list\":{\"setting_responses\":[{\"key\":\"user_identifier\",\"response_data\":{\"text_data\":{\"result\":\"${username}\"}}}],\"link\":\"next_link\"}}]}" | jq -r .flow_token)

token_3=$(curl -s -XPOST 'https://twitter.com/i/api/1.1/onboarding/task.json' -H "att: ${att}" "${header[@]}" \
  -d "{\"flow_token\": \"${token_2}\", \"subtask_inputs\": [{\"enter_password\": {\"password\": \"${password}\", \"link\": \"next_link\"}, \"subtask_id\": \"LoginEnterPassword\"}]}" | jq -r .flow_token)

curl -s -XPOST 'https://twitter.com/i/api/1.1/onboarding/task.json' -H "att: ${att}" "${header[@]}" \
  -d "{\"flow_token\": \"${token_3}\", \"subtask_inputs\": [{\"check_logged_in_account\": {\"link\": \"AccountDuplicationCheck_false\"}, \"subtask_id\": \"AccountDuplicationCheck\"}]}" | jq -c '.subtasks[0]|if(.open_account) then {oauth_token: .open_account.oauth_token, oauth_token_secret: .open_account.oauth_token_secret} else empty end'
