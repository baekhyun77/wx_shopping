package com.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName(value = "message")
public class Msg {

    @TableId(value = "msg_id", type = IdType.ASSIGN_UUID)
    private String msg_id;
    private String msg_userid;
    private String msg_username;
    private String msg_userimage;
    private String msg_chatid;
    private String msg_text;
    @TableField(value = "msg_time", fill = FieldFill.INSERT)
    private String createTime;
}
