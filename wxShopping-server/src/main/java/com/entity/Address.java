package com.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName(value = "address")
public class Address {

    @TableId(value = "address_id", type = IdType.ASSIGN_UUID)
    private String address_id;
    private String address_userid;
    private String address_consignee;
    private String address_name;
    private String address_phone;
    private String address_details;

    @TableField(value = "address_time", fill = FieldFill.INSERT)
    private String createTime;
}
