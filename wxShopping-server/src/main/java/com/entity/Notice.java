package com.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName(value = "notice")
public class Notice {
    @TableId(value = "notice_id", type = IdType.ASSIGN_UUID)
    private String notice_id;
    private String noice_user_id;
    private String notice_user_name;
    private String notice_message;
    private String notice_status;

    @TableField(value = "notice_time", fill = FieldFill.INSERT)
    private String createTime;
}

