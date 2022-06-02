package com.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.entity.Type;
import com.service.ITypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/type")
public class TypeController {

    @Autowired
    private ITypeService typeService;

    @PostMapping(value = "/addType")
    public String addType(@RequestBody Type type) {
        int insert = typeService.getBaseMapper().insert(type);
        return insert+"";
    }

    @RequestMapping(value = "/getAllType" , method = RequestMethod.GET)
    public ResponseEntity<?> getAllTye() {
        List<Type> types = typeService.getBaseMapper().selectList(null);
        String rtnUser = JSON.toJSONString(types, SerializerFeature.WriteMapNullValue);
        return new ResponseEntity<String>(rtnUser, HttpStatus.OK);
    }

    @RequestMapping(value = "/deleteType" , method = RequestMethod.GET)
    public ResponseEntity<?> deleteType(@RequestParam("id") String id) {
        System.out.println(id);
        int info = typeService.getBaseMapper().deleteById(id);
        if( info == 1) {
            return new ResponseEntity<String>("1", HttpStatus.OK);
        }
        else {
            return new ResponseEntity<String>("0", HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/updateType" , method = RequestMethod.POST)
    public ResponseEntity<?> updateType(@RequestBody Type type) {
        int info = typeService.getBaseMapper().updateById(type);
        if( info == 1) {
            return new ResponseEntity<String>("1", HttpStatus.OK);
        }
        else {
            return new ResponseEntity<String>("0", HttpStatus.OK);
        }
    }
}
