package com.entity;
import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;


@Data
@TableName(value = "announce")
public class Announce {
    @TableId(value = "announce_id", type = IdType.ASSIGN_UUID)
    private String announce_id;
    private String announce_text;
    private String announce_time;
    private String announce_updatetime;


    @TableField(value = "announce_time", fill = FieldFill.INSERT)
    private String createTime;
    @TableField(value = "announce_updatetime", fill = FieldFill.UPDATE)
    private String updateTime;

}


