package com.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.entity.Shop;
import com.entity.User;
import com.service.IShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/shop")
public class ShopController {

    @Autowired
    private IShopService shopService;

    @RequestMapping(value = "/getAllShop", method = RequestMethod.GET)
    public String getAllShop() {
        List<Shop> users = shopService.getBaseMapper().selectList(null);
        return JSON.toJSONString(users, SerializerFeature.WriteMapNullValue);
    }

    /**
     * 添加商店
     * @param shop
     * @return
     */
    @PostMapping(value = "/addShop")
    public String addShop(@RequestBody Shop shop) {
        int insert = shopService.getBaseMapper().insert(shop);
        return insert+"";
    }

    /**
     * 修改店铺
     * @param user
     * @return
     */
    @PostMapping(value = "/updateShop")
    public String updateUserInfo(@RequestBody Shop user) {
        int i = shopService.getBaseMapper().updateById(user);
        return i + "";
    }

    /**
     * 获取个人的店铺
     * @param id 用户id
     * @return
     */
    @GetMapping(value = "/getShopByUserId")
    public String getShopByUserId(@RequestParam("id") String id) {
        List<Shop> shopList = shopService.getBaseMapper().selectList(new QueryWrapper<Shop>().eq("shop_userid", id));

        return JSON.toJSONString(shopList.get(0), SerializerFeature.WriteMapNullValue);
    }

    /**
     * 获取店铺详情
     * @param id 用户id
     * @return
     */
    @GetMapping(value = "/getShopById")
    public String getShopById(@RequestParam("id") String id) {
        Shop shop = shopService.getBaseMapper().selectById(id);

        return JSON.toJSONString(shop, SerializerFeature.WriteMapNullValue);
    }
}
