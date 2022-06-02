package com.entity;

import com.baomidou.mybatisplus.annotation.*;
import javafx.scene.chart.ValueAxis;
import lombok.Data;

@Data
@TableName(value = "comment")
public class Comment {

    @TableId(value = "comment_id", type = IdType.ASSIGN_UUID)
    private String comment_id;
    private String comment_orderid;
    private String comment_commodityid;
    private String comment_userid;
    private String comment_username;
    private String comment_userimage;
    private String comment_stars;
    private String comment_level;
    private String comment_content;

    @TableField(value = "comment_time", fill = FieldFill.INSERT)
    private String createTime;
}
