package com.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.entity.UserCollection;
import com.service.ICollectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/collection")
public class CollectionController {

    @Autowired
    private ICollectionService collectionService;

    @PostMapping(value = "/addCollection")
    public String addCollection(@RequestBody UserCollection collection){
        int insert = collectionService.getBaseMapper().insert(collection);
        return insert + "";
    }

    /**
     * 查询收藏记录
     * @param map
     * @return
     */
    @PostMapping(value = "/getCollectionByUserId")
    public String getCollectionByUserId(@RequestBody Map map) {
        List<UserCollection> list = collectionService.getBaseMapper().selectByMap(map);
        return JSON.toJSONString(list, SerializerFeature.WriteMapNullValue);
    }

    @PostMapping(value = "/deleteCollection")
    public String deleteCollection(@RequestBody Map map) {
        int i = collectionService.getBaseMapper().deleteByMap(map);
        return i + "";
    }
}
