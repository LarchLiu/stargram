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
      help: 'Get command help',
      new: 'Start a new conversation',
      start: 'Get your ID and start a new conversation',
      img: 'Generate an image, the complete command format is `/img image description`, for example `/img beach at moonlight`',
      version: 'Get the current version number to determine whether to update',
      setenv: 'Set user configuration, the complete command format is /setenv KEY=VALUE',
      delenv: 'Delete user configuration, the complete command format is /delenv KEY',
      usage: 'Get the current usage statistics of the robot',
      system: 'View some system information',
      role: 'Set the preset identity',
      redo: 'Redo the last conversation, /redo with modified content or directly /redo',
      echo: 'Echo the message',
      adduser: 'Add user to whitelist. /adduser UserId',
      deluser: 'Delete user from whitelist. /deluser UserId',
    },
    role: {
      not_defined_any_role: 'No roles have been defined yet',
      current_defined_role: (size: string) => `The following roles are currently defined (${size}):\n`,
      help: 'Format error: the complete command format is `/role operation`\n'
                  + 'The following `operation` is currently supported:\n'
                  + ' `/role show` Display the currently defined roles.\n'
                  + ' `/role role name del` Delete the specified role.\n'
                  + ' `/role role name KEY=VALUE` Set the configuration of the specified role.\n'
                  + '  The following settings are currently supported:\n'
                  + '   `SYSTEM_INIT_MESSAGE`: Initialization message\n'
                  + '   `OPENAI_API_EXTRA_PARAMS`: OpenAI API extra parameters, must be JSON',
      delete_role_success: 'Delete role successfully',
      delete_role_error: (e: any) => `Delete role error: \`${e.message}\``,
      update_role_success: 'Update configuration successfully',
      update_role_error: (e: any) => `Configuration item format error: \`${e.message}\``,
    },
    img: {
      help: 'Please enter the image description. The complete command format is `/img raccoon cat`',
    },
    new: {
      new_chat_start: 'A new conversation has started',
      new_chat_start_private: (id: string) => `A new conversation has started, your ID (${id})`,
      new_chat_start_group: (id: string) => `A new conversation has started, group ID (${id})`,
    },
    setenv: {
      help: 'Configuration item format error: the complete command format is /setenv KEY=VALUE',
      update_config_success: 'Update configuration successfully',
      update_config_error: (e: any) => `Configuration item format error: ${e.message}`,
    },
    adduser: {
      help: 'Add user error: the complete command format is /adduser UserId',
      update_config_success: 'Add user successfully',
      add_user_error: (e: any) => `Add user error: ${e.message}`,
    },
    version: {
      new_version_found: (current: any, online: any) => `New version found, current version: ${JSON.stringify(current)}, latest version: ${JSON.stringify(online)}`,
      current_is_latest_version: (current: any) => `Current is the latest version, current version: ${JSON.stringify(current)}`,
    },
    usage: {
      usage_not_open: 'The current robot is not open for usage statistics',
      current_usage: '📊 Current robot usage\n\nTokens:\n',
      total_usage: (total: number) => `- Total: ${total || 0} tokens\n- Per chat usage: `,
      no_usage: '- No usage',
    },
    permission: {
      not_authorized: 'Identity permission verification failed',
      not_enough_permission: (roleList: string[], chatRole: string) => `Insufficient permissions, need ${roleList.join(',')}, current: ${chatRole}`,
      role_error: (e: any) => `Identity verification error: ${e.message}`,
      command_error: (e: any) => `Command execution error: ${e.message}`,
    },
  },
}
