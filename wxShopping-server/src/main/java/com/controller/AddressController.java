package com.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.entity.Address;
import com.service.IAddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/address")
public class AddressController {

    @Autowired
    private IAddressService addressService;

    @GetMapping(value = "/getAllAddress")
    public String getAllAddress() {
        List<Address> addresses = addressService.getBaseMapper().selectList(null);
        return JSON.toJSONString(addresses, SerializerFeature.WriteMapNullValue);
    }

    /**
     * 查询个人地址列表
     * @param id 用户id
     * @return
     */
    @GetMapping(value = "/getAddressByUserId")
    public String getAddressByUserId(@RequestParam("id") String id) {
        List<Address> addressList = addressService.getBaseMapper().selectList(new QueryWrapper<Address>().eq("address_userid", id));
        return JSON.toJSONString(addressList, SerializerFeature.WriteMapNullValue);
    }

    @PostMapping(value = "/addAddress")
    public String addAddress(@RequestBody Address address) {
        int insert = addressService.getBaseMapper().insert(address);
        return insert + "";
    }

    @RequestMapping(value = "/deleteAddress" , method = RequestMethod.GET)
    public ResponseEntity<?> deleteAddress(@RequestParam("id") String id) {
        int info = addressService.getBaseMapper().deleteById(id);
        if( info == 1) {
            return new ResponseEntity<String>("1", HttpStatus.OK);
        }
        else {
            return new ResponseEntity<String>("0", HttpStatus.OK);
        }
    }
}
