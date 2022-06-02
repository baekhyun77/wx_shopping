package com.vo;

/**
 * 获取商家的商品销量Vo
 */
public class CommoditySaleVo {
    /*
    商品名称加价格
     */
    private String commodityName; //商品名加价格

    /*
     *销量
     */
    private Float sale; //销量

    @Override
    public String toString() {
        return "CommoditySaleVo{" +
                "commodityName='" + commodityName + '\'' +
                ", sale=" + sale +
                '}';
    }

    public String getCommodityName() {
        return commodityName;
    }

    public void setCommodityName(String commodityName) {
        this.commodityName = commodityName;
    }

    public Float getSale() {
        return sale;
    }

    public void setSale(Float sale) {
        this.sale = sale;
    }
}
