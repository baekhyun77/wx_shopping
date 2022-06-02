package com.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName(value = "shop")
public class Shop {
    @TableId(value = "shop_id", type = IdType.ASSIGN_UUID)
    private String shop_id;
    private String shop_name;
    private String shop_image;
    private String shop_describe;
    private String shop_turnover;
    private String shop_userid;
    private String shop_username;
    private String shop_visits;
    private String shop_address;
    private String shop_phone;
    private String shop_status;

    @TableField(value = "shop_time", fill = FieldFill.INSERT)
    private String createTime;
}
