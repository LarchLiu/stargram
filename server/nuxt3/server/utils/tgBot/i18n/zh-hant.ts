/**
 * @type {I18n}
 */
export default {
  env: {
    system_init_message: '你是一個得力的助手',
  },
  utils: {
    not_supported_configuration: '不支持的配置或數據類型錯誤',
  },
  message: {
    not_supported_chat_type: (type: string) => `當前不支持${type}類型的聊天`,
    not_supported_chat_type_message: '當前不支持非文本格式消息',
    handle_chat_type_message_error: (type: any) => `處理${type}類型的聊天消息出錯`,
    user_has_no_permission_to_use_the_bot: (id: string) => `您沒有權限使用本機器人，請聯繫管理員將您的ID(${id})添加到白名單中`,
    group_has_no_permission_to_use_the_bot: (id: string) => `該群組未開啟聊天權限，請聯繫管理員將該群組ID(${id})添加到白名單中`,
  },
  command: {
    help: {
      summary: '當前支持的命令如下：\n',
      start: '獲取您的ID和设置网址',
      config: '查看用户设置',
    },
  },
}
