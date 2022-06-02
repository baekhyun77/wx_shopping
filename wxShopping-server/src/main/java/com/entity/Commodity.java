package com.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName(value = "commodity")
public class Commodity {

    @TableId(value = "commodity_id", type = IdType.ASSIGN_UUID)
    private String commodity_id;
    private String commodity_name;
    private String commodity_price;
    private String commodity_num;
    private String commodity_userid;
    private String commodity_typeid;
    private String commodity_typename;
    private String commodity_group_num;
    private String commodity_image;
    private String commodity_shopid;
    private String commodity_shopname;
    private String commodity_describe;
    private String commodity_group;
    private String commodity_discount;
    private String commodity_sales;
    private String commodity_status;
    @TableField(value = "commodity_time", fill = FieldFill.INSERT)
    private String createTime;
}
