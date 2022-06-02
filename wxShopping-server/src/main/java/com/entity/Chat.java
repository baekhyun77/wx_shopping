package com.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName(value = "chat")
public class Chat {

    @TableId(value = "chat_id")
    private String chat_id;
    private String chat_from_userid;
    private String chat_from_username;
    private String chat_from_userimage;
    private String chat_to_userid;
    private String chat_to_username;
    private String chat_to_userimage;
    @TableField(value = "chat_time", fill = FieldFill.INSERT)
    private String createTime;
}
