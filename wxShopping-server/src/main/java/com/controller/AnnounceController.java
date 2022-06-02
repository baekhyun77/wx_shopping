package com.controller;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.entity.Announce;
import com.entity.Type;
import com.service.IAnnounceService;
import com.service.ITypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/announce")
public class AnnounceController {

    @Autowired
    private IAnnounceService announceService;


    @PostMapping(value = "/addAnnounce")
    public String addAnnounce(@RequestBody Announce announce) {
        int insert = announceService.getBaseMapper().insert(announce);
        return insert+"";
    }

    @RequestMapping(value = "/getAllAnnounce" , method = RequestMethod.GET)
    public ResponseEntity<?> getAllAnnounce() {
        List<Announce> announces = announceService.getBaseMapper().selectList(null);
        String rtnUser = JSON.toJSONString(announces, SerializerFeature.WriteMapNullValue);
        return new ResponseEntity<String>(rtnUser, HttpStatus.OK);
    }

    @RequestMapping(value = "/deleteAnnounce" , method = RequestMethod.GET)
    public ResponseEntity<?> deleteType(@RequestParam("id") String id) {
        System.out.println(id);
        int info =announceService.getBaseMapper().deleteById(id);
        if( info == 1) {
            return new ResponseEntity<String>("1", HttpStatus.OK);
        }
        else {
            return new ResponseEntity<String>("0", HttpStatus.OK);
        }
    }

    @RequestMapping(value = "/updateAnnounce" , method = RequestMethod.POST)
    public ResponseEntity<?> updateAnnounce(@RequestBody Announce announce) {
        int info = announceService.getBaseMapper().updateById(announce);
        if( info == 1) {
            return new ResponseEntity<String>("1", HttpStatus.OK);
        }
        else {
            return new ResponseEntity<String>("0", HttpStatus.OK);
        }
    }

}
