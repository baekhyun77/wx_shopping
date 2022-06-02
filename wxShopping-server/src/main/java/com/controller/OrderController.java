package com.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;

import com.entity.Commodity;
import com.entity.Order;
import com.entity.Shop;
import com.service.ICommodityService;
import com.service.IOrderService;
import com.service.IShopService;
import com.sun.org.apache.xpath.internal.operations.Or;
import com.vo.CommoditySaleVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/order")
public class OrderController {

    @Autowired
    private IOrderService orderService;

    @Autowired
    private IShopService shopService;

    @Autowired
    private ICommodityService commodityService;

    /**
     * 添加购物车，或者直接购买，即status=="1" 状态 0：购物车；1：下单； 2 ：发货； 3；收货完成； 4退货 售后； 5 异常
     *       {"title":"全部", "status":"9"},
     *       {"title":"待发货", "status":"1"},
     *       {"title":"待收货","status":"2"},
     *       {"title":"待评价", "status": "3"},
     *       {"title":"已完成", "status": "4"}
     *       {"title":"退款", "status": "5"}
     * @param order1
     * @return
     */
    @PostMapping(value = "/addCart")
    public String addCart(@RequestBody Order order1) {
        if(order1.getOrder_status().equals("1")) {
            //修改库存和营业数量
            int order_num = Integer.parseInt(order1.getOrder_num());//用户下单数量；
            Commodity commodity = commodityService.getBaseMapper().selectById(order1.getOrder_commodityid());
            int commodity_sales = Integer.parseInt(commodity.getCommodity_sales());
            int afterSales = commodity_sales + order_num;
            commodity.setCommodity_sales(afterSales + "");
            int commodity_num = Integer.parseInt(commodity.getCommodity_num());
            int afterNum = commodity_num - order_num;
            commodity.setCommodity_num(afterNum + "");
            commodityService.getBaseMapper().updateById(commodity);

            //修改店铺的营业额
            Shop shop = shopService.getBaseMapper().selectById(order1.getOrder_shopid());
            float shop_turnover = Float.parseFloat(shop.getShop_turnover());
            float turnover = Float.parseFloat(order1.getOrder_pay());//支付的金额
            float afterTurnover = shop_turnover + turnover;
            shop.setShop_turnover(afterTurnover + "");
            shopService.getBaseMapper().updateById(shop);
        }
        int insert = orderService.getBaseMapper().insert(order1);
        return insert + "";
    }

    /**
     * 从购物车中删除 状态 0：购物车；1：
     *       {"title":"全部", "status":"9"},
     *       {"title":"待发货", "status":"1"},
     *       {"title":"待收货","status":"2"},
     *       {"title":"待评价", "status": "3"},
     *       {"title":"已完成", "status": "4"}
     *       {"title":"退款", "status": "5"}
     * @param id
     * @return
     */
    @GetMapping(value = "/deleteFromCart")
    public String deleteFromCart(@RequestParam("id")String id) {
        int i = orderService.getBaseMapper().deleteById(id);
        System.out.println("****************");
        System.out.println(i);
        return i + "";
    }
    @GetMapping(value = "/getOrderById")
    public String getOrderById(@RequestParam("order_id") String id) {
        List<Order> shopList = orderService.getBaseMapper().selectList(new QueryWrapper<Order>().eq("order_id", id));

        return JSON.toJSONString(shopList.get(0), SerializerFeature.WriteMapNullValue);
    }

    /**
     * 退款功能。。需要修改营业额和商品的库存
     *       {"title":"全部", "status":"9"},
     *       {"title":"待发货", "status":"1"},
     *       {"title":"待收货","status":"2"},
     *       {"title":"待评价", "status": "3"},
     *       {"title":"已完成", "status": "4"}
     *       {"title":"退款", "status": "5"}
     * @param order
     * @return
     */
    @PostMapping(value = "/refund")
    public String refund(@RequestBody Order order) {
        if(!order.getOrder_status().equals("5")) { //如果状态不为5 则异常
            return "异常！";
        }
        //查询到订单详细的信息
        Order order1 = orderService.getBaseMapper().selectById(order.getOrder_id());
        //修改库存和营业数量
        int order_num = Integer.parseInt(order1.getOrder_num());//用户下单数量；
        Commodity commodity = commodityService.getBaseMapper().selectById(order1.getOrder_commodityid());
        int commodity_sales = Integer.parseInt(commodity.getCommodity_sales());
        int afterSales = commodity_sales - order_num;
        commodity.setCommodity_sales(afterSales + "");
        int commodity_num = Integer.parseInt(commodity.getCommodity_num());
        int afterNum = commodity_num + order_num;
        commodity.setCommodity_num(afterNum + "");
        commodityService.getBaseMapper().updateById(commodity);

        //修改店铺的营业额
        Shop shop = shopService.getBaseMapper().selectById(order1.getOrder_shopid());
        float shop_turnover = Float.parseFloat(shop.getShop_turnover());
        float turnover = Float.parseFloat(order1.getOrder_pay());//支付的金额
        float afterTurnover = shop_turnover - turnover;
        shop.setShop_turnover(afterTurnover + "");
        shopService.getBaseMapper().updateById(shop);

        int i = orderService.getBaseMapper().updateById(order);
        return i + "";
    }
    /**
     * 修改订单状态 当修改为下单之后，这里采用最简单的流程。直接发货商品数量减相对的数量，营业额增加相对的状态，
     * 前端只需要传一个status，和一个订单id即可。
     * @param order
     * @return
     */
    @PostMapping(value = "/updateOrderStatus")
    public String updateOrderStatus(@RequestBody Order order) {
        Order order1 = orderService.getBaseMapper().selectById(order.getOrder_id());

        if(order.getOrder_status().equals("1")) {
            //修改库存和营业数量
            int order_num = Integer.parseInt(order1.getOrder_num());//用户下单数量；
            Commodity commodity = commodityService.getBaseMapper().selectById(order1.getOrder_commodityid());
            int commodity_sales = Integer.parseInt(commodity.getCommodity_sales());
            int afterSales = commodity_sales + order_num;
            commodity.setCommodity_sales(afterSales + "");
            int commodity_num = Integer.parseInt(commodity.getCommodity_num());
            int afterNum = commodity_num - order_num;
            commodity.setCommodity_num(afterNum + "");
            commodityService.getBaseMapper().updateById(commodity);

            //修改店铺的营业额
            Shop shop = shopService.getBaseMapper().selectById(order1.getOrder_shopid());
            float shop_turnover = Float.parseFloat(shop.getShop_turnover());
            float turnover = Float.parseFloat(order1.getOrder_pay());//支付的金额
            float afterTurnover = shop_turnover + turnover;
            shop.setShop_turnover(afterTurnover + "");
            shopService.getBaseMapper().updateById(shop);
        }
        int i = orderService.getBaseMapper().updateById(order);
        return i + "";
    }


    @PostMapping(value = "/queryOrder")
    public String queryOrder(@RequestBody Map map) {
        System.out.println(map);
        System.out.println("test");
        List list = orderService.getBaseMapper().selectByMap(map);
        return JSON.toJSONString(list, SerializerFeature.WriteMapNullValue);
    }


    @GetMapping(value = "/loadCommoditySale")
    public String loadCommoditySale(@RequestParam("userId") String userId) {
        //获取用户的店铺
        List<Shop> shopList = shopService.getBaseMapper().selectList(new QueryWrapper<Shop>()
                .eq("shop_userid", userId));
        Shop shop = shopList.get(0); //用户的店铺
        List<Commodity> commodityList = commodityService.getBaseMapper().selectList(new QueryWrapper<Commodity>()
                .eq("commodity_shopid", shop.getShop_id()));
        if(commodityList.size() == 0) {
            return "0";
        }

        /**
         * 需要返回的数据 商品名称 加上价格。
         */
        ArrayList<CommoditySaleVo> commoditySaleVos = new ArrayList<>();
        for (Commodity commodity : commodityList) {
            CommoditySaleVo saleVo = new CommoditySaleVo();
            //填充价格跟名称
            saleVo.setCommodityName(commodity.getCommodity_name() + "; 价格:" + commodity.getCommodity_price());
            //填充销量
            float sale = 0;
            List<Order> orderList = orderService.getBaseMapper().selectList(new QueryWrapper<Order>()
                    .eq("order_commodityid", commodity.getCommodity_id()));

            for (Order order : orderList) {
                if(!order.getOrder_status().equals("0") && !order.getOrder_status().equals("5")) {
                    sale += Float.parseFloat(order.getOrder_pay());
                }
            }
            saleVo.setSale(sale);

            commoditySaleVos.add(saleVo);
        }
        return JSON.toJSONString(commoditySaleVos, SerializerFeature.WriteMapNullValue);
    }
}
