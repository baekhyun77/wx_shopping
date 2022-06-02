package com.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.text.SimpleDateFormat;
import java.util.Date;

@Component//记得加入IOC
public class MyBatisPlusFillTime implements MetaObjectHandler {
    @Override
    public void insertFill(MetaObject metaObject) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        this.setFieldValByName("createTime",df.format(new Date()).toString(),metaObject);
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        this.setFieldValByName("updateTime",df.format(new Date()).toString(),metaObject);
    }
}
