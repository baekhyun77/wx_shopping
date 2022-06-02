package com.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName(value = "collection")
public class UserCollection {

    @TableId(value = "collection_id", type = IdType.ASSIGN_UUID)
    private String collection_id;
    private String collection_userid;
    private String collection_shopid;
    private String collection_shopname;
    private String collection_shopimage;
    @TableField(value = "collection_time", fill = FieldFill.INSERT)
    private String createTime;
}
