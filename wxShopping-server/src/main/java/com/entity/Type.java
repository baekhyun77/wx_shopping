package com.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@TableName("type")
public class Type extends Model<Type> {

    @TableId(value = "t_id", type = IdType.ASSIGN_UUID)
    private String t_id;
    private String  t_name;

    @TableField( value = "t_time",fill = FieldFill.INSERT)
    private String createTime;
}
