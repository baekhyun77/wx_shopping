package com.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.entity.Commodity;
import com.entity.User;
import com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/getAllUser", method = RequestMethod.GET)
    public String getAllUser() {
        List<User> users = userService.getBaseMapper().selectList(null);
        return JSON.toJSONString(users, SerializerFeature.WriteMapNullValue);
    }

    @PostMapping(value = "/userRegister")
    public String userRegister(@RequestBody User user) {
        List<User> users = userService.getBaseMapper().selectList(new QueryWrapper<User>().eq("user_phone", user.getUser_phone()));
        if(users.size() > 0) {
            return "2";
        }

        List<User> users1 = userService.getBaseMapper().selectList(new QueryWrapper<User>().eq("user_show", user.getUser_show()));
        if(users1.size() > 0) {
            return "3";
        }

        int insert = userService.getBaseMapper().insert(user);
        return insert+"";
    }

    @PostMapping(value = "/userLogin")
    public String userLogin(@RequestBody Map map) {
        System.out.println(map);
        List<User> list = userService.getBaseMapper().selectByMap(map);
        if(list.size() == 0) {
            return "0";
        }
        else {
            return JSON.toJSONString(list.get(0), SerializerFeature.WriteMapNullValue);
        }
    }

    @GetMapping(value = "/getUserByRootId")
    public String getUserByRootId(@RequestParam("id") String id) {
        List<User> userList = userService.getBaseMapper().selectList(new QueryWrapper<User>().eq("user_rootid", id));
        return JSON.toJSONString(userList, SerializerFeature.WriteMapNullValue);
    }

    @PostMapping(value = "/updateUserInfo")
    public String updateUserInfo(@RequestBody User user) {
        System.out.println(user);
        int i = userService.getBaseMapper().updateById(user);
        return i + "";
    }

    @GetMapping(value = "/getUserInfo")
    public String getUserInfo(@RequestParam("id") String id) {
        User user = userService.getBaseMapper().selectById(id);
        return JSON.toJSONString(user, SerializerFeature.WriteMapNullValue);
    }
}
