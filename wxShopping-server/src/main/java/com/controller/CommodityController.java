package com.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.entity.Commodity;
import com.entity.Join;
import com.entity.Order;
import com.entity.Shop;
import com.service.ICommodityService;
import com.service.IOrderService;
import com.service.IShopService;
import com.utils.MapSortUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/commodity")
public class CommodityController {

    @Autowired
    private ICommodityService commodityService;

    @Autowired
    private IShopService shopService;

    @Autowired
    IOrderService orderService;

    @PostMapping("/addCommodity")
    private String addCommodity(@RequestBody Commodity commodity) {
        int insert = commodityService.getBaseMapper().insert(commodity);
        return  insert + "";
    }

    /**
     * 获取个人的 商店中的所有商品
     * @param id
     * @return
     */
    @GetMapping(value = "/getCommodityByUserId")
    public String getCommodityByUserId(@RequestParam("id") String id) {
        List<Commodity> commodityList = commodityService.getBaseMapper().selectList(new QueryWrapper<Commodity>().eq("commodity_userid", id));
        return JSON.toJSONString(commodityList, SerializerFeature.WriteMapNullValue);
    }

    @GetMapping(value = "/getCommodityByTypeName")
    public String getCommodityByTypeName(@RequestParam("commodity_typename") String commodity_typename) {
        List<Commodity> commodityList = commodityService.getBaseMapper().selectList(new QueryWrapper<Commodity>().eq("commodity_typename", commodity_typename));
        return JSON.toJSONString(commodityList, SerializerFeature.WriteMapNullValue);
    }

    /**
     * 获取个人的商店中的所有商品
     * @param id
     * @return
     */
    @GetMapping(value = "/getCommodityByShopId")
    public String getCommodityByShopId(@RequestParam("id") String id) {
        List<Commodity> commodityList = commodityService.getBaseMapper().selectList(new QueryWrapper<Commodity>().eq("commodity_shopid", id));
        return JSON.toJSONString(commodityList, SerializerFeature.WriteMapNullValue);
    }

    /**
     * 用户访问获取商品的详情，店铺访问量需要加1
     */
    @GetMapping(value = "/userGetCommodity")
    private String userGetCommodity(@RequestParam("id") String id) {
        Commodity commodity = commodityService.getBaseMapper().selectById(id);

        Shop shop = shopService.getBaseMapper().selectById(commodity.getCommodity_shopid());
        String i = shop.getShop_visits();
        int add = Integer.parseInt(i) + 1;
        shop.setShop_visits(add + "");
        shopService.getBaseMapper().updateById(shop);
        return JSON.toJSONString(commodity, SerializerFeature.WriteMapNullValue);
    }

    /**
     * 管理人员访问，店铺量不加1
     */
    @GetMapping(value = "/adminGetCommodity")
    private String adminGetCommodity(@RequestParam("id") String id) {
        Commodity commodity = commodityService.getBaseMapper().selectById(id);
        return JSON.toJSONString(commodity, SerializerFeature.WriteMapNullValue);
    }

    /**
     * 通过id获取商品
     * @param commodity_typename 通过类型名称获取
     * @return
     */
    @GetMapping(value = "/getCommodityByType")
    public String getCommodityByType(@RequestParam("commodity_typename") String commodity_typename) {
        List<Commodity> commodityList = commodityService.getBaseMapper().selectList(new QueryWrapper<Commodity>().
                eq("commodity_typename", commodity_typename).eq("commodity_status","1"));
        return JSON.toJSONString(commodityList, SerializerFeature.WriteMapNullValue);
    }

    @PostMapping(value = "/updateCommodity")
    public String updateCommodity(@RequestBody Commodity commodity) {
        int i = commodityService.getBaseMapper().updateById(commodity);
        return i + "";
    }

    /**
     * 搜索
     * @param searchContent
     * @return
     */
    @GetMapping(value = "/queryCommodity")
    public String queryCommodity(@RequestParam("searchContent") String searchContent) {
        if (searchContent == "") {
            List<Commodity> commodityList = commodityService.getBaseMapper().selectList(new QueryWrapper<Commodity>().eq("commodity_status","1"));
            return JSON.toJSONString(commodityList, SerializerFeature.WriteMapNullValue);
        }
        List<Commodity> commodities = commodityService.getBaseMapper().selectList(new QueryWrapper<Commodity>().
                like("commodity_name", searchContent).eq("commodity_status","1").or().
                like("commodity_typename", searchContent).eq("commodity_status","1").
                or().like("commodity_describe", searchContent).eq("commodity_status","1"));
        return JSON.toJSONString(commodities, SerializerFeature.WriteMapNullValue);
    }
    @GetMapping(value = "/getAllCommodity")
    public String getAllJoin() {
        List<Commodity> addresses = commodityService.getBaseMapper().selectList(null);
        return JSON.toJSONString(addresses, SerializerFeature.WriteMapNullValue);
    }

    @GetMapping(value = "/hotCommodity")
    public String hotCommodity() {
        List<Commodity> commodityList = commodityService.getBaseMapper().selectList(new QueryWrapper<Commodity>().orderByDesc("commodity_sales"));
        return JSON.toJSONString(commodityList, SerializerFeature.WriteMapNullValue);
    }

    @GetMapping(value = "/newCommodity")
    public String newCommodity() {
        List<Commodity> commodityList = commodityService.getBaseMapper().selectList(new QueryWrapper<Commodity>().orderByDesc("commodity_time"));
        return JSON.toJSONString(commodityList, SerializerFeature.WriteMapNullValue);
    }

    @GetMapping(value = "/likeCommodity")
    public String likeCommodity(@RequestParam("userId") String userId) {
        List<Order> orderList = orderService.getBaseMapper().selectList(new QueryWrapper<Order>()
                .eq("order_userid", userId));

        //未查询到订单数据。即返回初始数据
        if(orderList.size() == 0) {
            List<Commodity> commodityList = commodityService.getBaseMapper().selectList(new QueryWrapper<Commodity>().eq("commodity_status","1"));
            return JSON.toJSONString(commodityList, SerializerFeature.WriteMapNullValue);
        }

        /**
         * 通过订单，获取到一个商品List
         */
        List<Commodity> commodityList = new ArrayList<Commodity>();
        for (Order order : orderList) {
            Commodity commodity = commodityService.getBaseMapper().selectById(order.getOrder_commodityid());
            commodityList.add(commodity);
        }
        /**
         * 开始统计商品List中类型。
         */
        Map<String, Integer> typeMap = new HashMap<>();
        int index = 0; //记录的下标
        for (Commodity commodity : commodityList) {
            for(String key : typeMap.keySet()) {
                if( commodity.getCommodity_typename().equals(key)) {
                    index = 1; //修改下标。通过下标去判断是否添加一个map进去
                    int value = typeMap.get(key) + 1; //修改记录的数值
                    typeMap.put(commodity.getCommodity_typename(), value); //将新的value值put 进去
                }
            }
            if(index == 0) { //即未统计到
                typeMap.put(commodity.getCommodity_typename(), 1);
            }
        }

        /**
         * 对map中的数值进行排序
         */
        Map<String, Integer> sortMap = MapSortUtil.sortByValueDesc(typeMap);
        System.out.println(sortMap);

        ArrayList<Commodity> commodities = new ArrayList<>();
        for(String key : sortMap.keySet()) {
            List<Commodity> list = commodityService.getBaseMapper().selectList(new QueryWrapper<Commodity>().
                    eq("commodity_typename", key).eq("commodity_status", "1"));
            for (Commodity commodity : list) {
                commodities.add(commodity);
            }
        }

        return JSON.toJSONString(commodities, SerializerFeature.WriteMapNullValue);
    }
}

