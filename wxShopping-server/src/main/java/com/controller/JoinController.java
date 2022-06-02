package com.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.entity.Join;
import com.entity.Shop;
import com.entity.User;
import com.service.IJoinService;
import com.service.IShopService;
import com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/join")
public class JoinController {

    @Autowired
    private IJoinService joinService;

    @Autowired
    private UserService userService;

    @Autowired
    private IShopService shopService; //审核 通过的时候自动添加一个店铺

    @GetMapping(value = "/getAllJoin")
    public String getAllJoin() {
        List<Join> addresses = joinService.getBaseMapper().selectList(null);
        return JSON.toJSONString(addresses, SerializerFeature.WriteMapNullValue);
    }

    @PostMapping(value = "/insertJoin")
    public String insertJoin(@RequestBody Join address) {
        int insert = joinService.getBaseMapper().insert(address);
        return insert + "";
    }

    /**
     * 获取个人申请记录
     * @param id
     * @return
     */
    @GetMapping(value = "/getAllJoinByUserId")
    public String getAllJoinByUserId(@RequestParam("id") String id) {
        List<Join> join_userid = joinService.getBaseMapper().selectList(new QueryWrapper<Join>().eq("join_userid", id));
        //返回一个空对象给前端
        if(join_userid.size() == 0) return JSON.toJSONString(new Join(), SerializerFeature.WriteMapNullValue);;
        return JSON.toJSONString(join_userid.get(0), SerializerFeature.WriteMapNullValue);
    }

    /**
     * 审批。还需加入 修改user表中数据。所以需要前端传回来一个用户id，可以封装进Join对象
     * @param type
     * @return
     */
    @RequestMapping(value = "/updateJoin" , method = RequestMethod.POST)
    public ResponseEntity<?> updateJoin(@RequestBody Join type) {
        //修改用户
        System.out.println(type);
        User user = new User();
        user.setUser_id(type.getJoin_userid());
        if(type.getJoin_status().equals("0")) {
            user.setUser_rootid("3");
        }
        else {
            user.setUser_rootid("2");

            //添加店铺
            List<Shop> shop_userid = shopService.getBaseMapper().selectList(new QueryWrapper<Shop>().eq("shop_userid", type.getJoin_userid()));
            if(shop_userid.size() == 0) {//如果是第一审核通过则添加一个店铺
                Shop shop = new Shop();
                shop.setShop_userid(type.getJoin_userid());
                shop.setShop_username(type.getJoin_username());
                shop.setShop_status("false");
                shopService.getBaseMapper().insert(shop);
            }
        }
        System.out.println(user);
        int i = userService.getBaseMapper().updateById(user);

        int info = joinService.getBaseMapper().updateById(type);
        if( info == 1) {
            return new ResponseEntity<String>("1", HttpStatus.OK);
        }
        else {
            return new ResponseEntity<String>("0", HttpStatus.OK);
        }
    }
    /**
     * 审批。还需加入 修改user表中数据。所以需要前端传回来一个用户id，可以封装进Join对象
     * @param type
     * @return
     */
    @RequestMapping(value = "/updateJoin1" , method = RequestMethod.POST)
    public Object updateJoin1(@RequestBody Join type) {
        //修改用户
        System.out.println(type);
        User user = new User();
        user.setUser_id(type.getJoin_userid());
        if(type.getJoin_status().equals("0")) {
            user.setUser_rootid("3");
        }
        else {
            user.setUser_rootid("2");
        }
        System.out.println(user);
        int i = userService.getBaseMapper().updateById(user);

        int info = joinService.getBaseMapper().updateById(type);
        if( info == 1) {
            return new ResponseEntity<String>("1", HttpStatus.OK);
        }
        else {
            return new ResponseEntity<String>("0", HttpStatus.OK);
        }
    }
}
