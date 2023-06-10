/**
 * @type {I18n}
 */
export default {
  env: {
    system_init_message: '你是一个得力的助手',
  },
  utils: {
    not_supported_configuration: '不支持的配置项或数据类型错误',
  },
  message: {
    not_supported_chat_type: (type: string) => `暂不支持${type}类型的聊天`,
    not_supported_chat_type_message: '暂不支持非文本格式消息',
    handle_chat_type_message_error: (type: string) => `处理${type}类型的聊天消息出错`,
    user_has_no_permission_to_use_the_bot: (id: string) => `你没有权限使用这个bot, 请请联系管理员添加你的ID(${id})到白名单`,
    group_has_no_permission_to_use_the_bot: (id: string) => `该群未开启聊天权限, 请请联系管理员添加群ID(${id})到白名单`,
  },
  command: {
    help: {
      summary: '当前支持以下命令:\n',
      start: '获取你的ID和用户设置网址',
      config: '查看用户设置',
    },
  },
}
