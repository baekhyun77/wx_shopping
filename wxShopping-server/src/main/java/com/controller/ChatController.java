package com.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.entity.Chat;
import com.entity.User;
import com.service.IChatService;
import com.service.UserService;
import com.utils.GetUUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/chat")
public class ChatController {

    @Autowired
    private IChatService chatService;

    @Autowired
    private UserService userService;
    /**
     * 每次微信小程序端开发 chat页面的时候，只需要一个toUserId。FromUserId是它自己，我们只需要将chatId返回给前端就行。
     * 首先通过from_userid 和 to_userid查询一下是否已经有了连接(主要是用户从商品详情页面，打开聊天的时候)。
     * 如果有了连接，则将连接id发送给前端。前端同这个id去查询历史消息，
     * 如果没有则新建连接，新建的连接没有历史消息，直接返回为1（真实逻辑不是这样的）
     * @param chat
     * @return
     */
    @PostMapping(value = "addChat")
    public String addChar(@RequestBody Chat chat) {
        List<Chat> chats = chatService.getBaseMapper().selectList(new QueryWrapper<Chat>().eq("chat_from_userid", chat.getChat_from_userid())
                .eq("chat_to_userid", chat.getChat_to_userid()));
        if(chats.size() > 0) {
            return chats.get(0).getChat_id();
        }

        User user = userService.getBaseMapper().selectById(chat.getChat_to_userid());//获取商家的信息，所有连接都是由买家发起的
        chat.setChat_to_username(user.getUser_name());
        chat.setChat_to_userimage(user.getUser_image());
        String id = GetUUID.Uid();
        chat.setChat_id(id); //第一次创建连接，需要将这个chat_id.发送给微信端。

        int insert = chatService.getBaseMapper().insert(chat);
        return id;
    }

    /**
     * 通过id删除
     * @param id
     * @return
     */
    @GetMapping(value = "/deleteChatById")
    public String deleteChatById(@RequestParam("id") String id) {
        int i = chatService.getBaseMapper().deleteById(id);
        return i + "";
    }

    /**
     * 查询连接的信息，主要是商家获取连接列表
     * @param map
     * @return
     */
    @PostMapping(value = "/selectChat")
    public String selectChat(@RequestBody Map map) {
        List<Chat> list = chatService.getBaseMapper().selectByMap(map);
        return JSON.toJSONString(list, SerializerFeature.WriteMapNullValue);
    }
}
