package com.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import lombok.Data;

@TableName("user")
public class User extends Model<User>{

    @TableId(value = "user_id", type = IdType.ASSIGN_UUID)
    private String user_id;

    private String user_integral;

    private String user_show;

    private String user_name;

    private String user_password;


    @TableField("user_phone")
    private String user_phone;

    @TableField(value = "user_email")
    private String user_email;

    @TableField(value = "user_rootid")
    private String user_rootid;

    @TableField(value = "user_image")
    private String user_image;

    @TableField(value = "user_address")
    private String user_address;

    @TableField(value = "user_status")
    private String user_status;

    private String user_payword;

    @TableField(value = "user_time" ,fill = FieldFill.INSERT)
    private String createTime;


    @Override
    public String toString() {
        return "User{" +
                "user_id='" + user_id + '\'' +
                ", user_integral='" + user_integral + '\'' +
                ", user_show='" + user_show + '\'' +
                ", user_name='" + user_name + '\'' +
                ", user_password='" + user_password + '\'' +
                ", user_phone='" + user_phone + '\'' +
                ", user_email='" + user_email + '\'' +
                ", user_rootid='" + user_rootid + '\'' +
                ", user_image='" + user_image + '\'' +
                ", user_address='" + user_address + '\'' +
                ", user_status='" + user_status + '\'' +
                ", user_payword='" + user_payword + '\'' +
                ", createTime='" + createTime + '\'' +
                '}';
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getUser_integral() {
        return user_integral;
    }

    public void setUser_integral(String user_integral) {
        this.user_integral = user_integral;
    }

    public String getUser_show() {
        return user_show;
    }

    public void setUser_show(String user_show) {
        this.user_show = user_show;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getUser_password() {
        return user_password;
    }

    public void setUser_password(String user_password) {
        this.user_password = user_password;
    }

    public String getUser_phone() {
        return user_phone;
    }

    public void setUser_phone(String user_phone) {
        this.user_phone = user_phone;
    }

    public String getUser_email() {
        return user_email;
    }

    public void setUser_email(String user_email) {
        this.user_email = user_email;
    }

    public String getUser_rootid() {
        return user_rootid;
    }

    public void setUser_rootid(String user_rootid) {
        this.user_rootid = user_rootid;
    }

    public String getUser_image() {
        return user_image;
    }

    public void setUser_image(String user_image) {
        this.user_image = user_image;
    }

    public String getUser_address() {
        return user_address;
    }

    public void setUser_address(String user_address) {
        this.user_address = user_address;
    }

    public String getUser_status() {
        return user_status;
    }

    public void setUser_status(String user_status) {
        this.user_status = user_status;
    }
    public String getUser_payword() {
        return user_payword;
    }

    public void getUser_payword(String user_payword) {
        this.user_payword = user_payword;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }
}
