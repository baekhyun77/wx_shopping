package com.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.conditions.query.QueryChainWrapper;
import com.entity.Msg;
import com.service.IMsgService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/msg")
public class MsgController {

    @Autowired
    private IMsgService msgService;

    /**
     * 这个控制器应该是只有 一个方法就够了，只是单纯的在打开聊天框的时候初始化一下历史消息，通过聊天连接的id
     * @param id 连接的id
     * @return
     */
    @GetMapping(value = "/getMsgByChat")
    public String getMsgByChat(@RequestParam("id") String id) {
        List<Msg> msg_chatid = msgService.getBaseMapper().selectList(new QueryWrapper<Msg>().eq("msg_chatid", id).orderByAsc("msg_time"));
        return JSON.toJSONString(msg_chatid, SerializerFeature.WriteMapNullValue);
    }

    /**
     * 当发一条消息的时候，直接保存到数据库。管它呢，
     * @param msg
     * @return
     */
    @PostMapping(value = "/addMsg")
    public String addMsg(@RequestBody Msg msg) {
        int insert = msgService.getBaseMapper().insert(msg);
        return insert + "";
    }
}
