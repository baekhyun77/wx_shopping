package com.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName(value = "user_order")
public class Order {

    @TableId(value = "order_id", type = IdType.ASSIGN_UUID)
    private String order_id;
    private String order_commodityid;
    private String order_commodityimage;
    private String order_commodityname;
    private String order_commoditystatus;
    private String order_userid;
    private String order_username;
    private String order_addressid;
    private String order_addressconsignee;
    private String order_addressdetails;
    private String order_addressname;
    private String order_addressphone;
    private String order_num;
    private String order_shopid;
    private String order_pay;
    private String order_price;
    private String order_purchase;
    private String order_status;

    @TableField(value = "order_time", fill = FieldFill.INSERT)
    private String createTime;

    @TableField(value = "order_update_time", fill = FieldFill.UPDATE)
    private String updateTime;
}
