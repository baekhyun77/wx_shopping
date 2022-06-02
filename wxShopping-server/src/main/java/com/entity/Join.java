package com.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("apply")
public class Join {
    @TableId(value = "join_id", type = IdType.ASSIGN_UUID)
    private String join_id;
    private String join_userid;
    private String join_username;
    private String join_reason;
    private String join_status;

    @TableField(value = "join_time", fill = FieldFill.INSERT)
    private String createTime;
    @TableField(value = "join_update_time", fill = FieldFill.UPDATE)
    private String updateTime;
}
