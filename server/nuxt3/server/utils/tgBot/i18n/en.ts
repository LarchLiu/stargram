export default {
  env: {
    system_init_message: 'You are a helpful assistant',
  },
  utils: {
    not_supported_configuration: 'Not supported configuration or data type error',
  },
  message: {
    not_supported_chat_type: (type: string) => `Currently not supported ${type} type of chat`,
    not_supported_chat_type_message: 'Currently not supported non-text format messages',
    handle_chat_type_message_error: (type: string) => `Error handling ${type} type of chat messages`,
    user_has_no_permission_to_use_the_bot: (id: string) => `You do not have permission to use this bot, please contact the administrator to add your ID (${id}) to the whitelist`,
    group_has_no_permission_to_use_the_bot: (id: string) => `The group has not enabled chat permissions, please contact the administrator to add the group ID (${id}) to the whitelist`,
  },
  command: {
    help: {
      summary: 'The following commands are currently supported:\n',
      start: 'Get your ID and settings url',
      config: 'Preview user config',
    },
  },
}
