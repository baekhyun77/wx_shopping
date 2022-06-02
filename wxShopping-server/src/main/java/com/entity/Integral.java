package com.entity;

import com.baomidou.mybatisplus.annotation.*;

@TableName(value = "integral")
public class Integral {

    @TableId(value = "integral_id", type = IdType.ASSIGN_UUID)
    private String integral_id;
    private String integral_user_id;
    private String integral_user_name;
    private String integral_date;
    @TableField(value = "integral_time", fill = FieldFill.INSERT)
    private String createTime;

    @Override
    public String toString() {
        return "Integral{" +
                "integral_id='" + integral_id + '\'' +
                ", integral_user_id='" + integral_user_id + '\'' +
                ", integral_user_name='" + integral_user_name + '\'' +
                ", integral_date='" + integral_date + '\'' +
                ", createTime='" + createTime + '\'' +
                '}';
    }

    public String getIntegral_id() {
        return integral_id;
    }

    public void setIntegral_id(String integral_id) {
        this.integral_id = integral_id;
    }

    public String getIntegral_user_id() {
        return integral_user_id;
    }

    public void setIntegral_user_id(String integral_user_id) {
        this.integral_user_id = integral_user_id;
    }

    public String getIntegral_user_name() {
        return integral_user_name;
    }

    public void setIntegral_user_name(String integral_user_name) {
        this.integral_user_name = integral_user_name;
    }

    public String getIntegral_date() {
        return integral_date;
    }

    public void setIntegral_date(String integral_date) {
        this.integral_date = integral_date;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }
}
