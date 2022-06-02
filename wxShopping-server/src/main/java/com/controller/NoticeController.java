package com.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.entity.Join;
import com.entity.Notice;
import com.entity.Shop;
import com.entity.UserCollection;
import com.service.UserService;
import com.service.INoticeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping(value = "/notice")
public class NoticeController {

    @Autowired
    private INoticeService noticeService;

    @GetMapping(value = "/getAllNotice")
    public String getAllNotice() {
        List<Notice> addresses = noticeService.getBaseMapper().selectList(null);
        return JSON.toJSONString(addresses, SerializerFeature.WriteMapNullValue);
    }
    @PostMapping(value = "/insertNotice")
    public String insertJoin(@RequestBody Notice address) {
        int insert = noticeService.getBaseMapper().insert(address);
        return insert + "";
    }
    /**
     * 获取个人申请记录
     * @param id
     * @return
     */
    @GetMapping(value = "/getAllNoticecByUserId")
    public String getAllNoticecByUserId(@RequestParam("id") String id) {
        List<Notice> notices_user_id = noticeService.getBaseMapper().selectList(new QueryWrapper<Notice>().eq("notice_user_id", id));
        //返回一个空对象给前端
        if(notices_user_id.size() == 0) return JSON.toJSONString(new Join(), SerializerFeature.WriteMapNullValue);;
        return JSON.toJSONString(notices_user_id.get(0), SerializerFeature.WriteMapNullValue);
    }

    /**
     * 修改店铺
     * @param notice
     * @return
     */
    @PostMapping(value = "/updateNotice")
    public String updateNotice(@RequestBody Notice notice) {
        int i = noticeService.getBaseMapper().updateById(notice);
        return i + "";
    }
    @PostMapping(value = "/getNoticeByUserId")
    public String getNoticeByUserId(@RequestParam("id") String id) {
        List<Notice> list = noticeService.getBaseMapper().selectList(new QueryWrapper<Notice>().eq("noice_user_id", id));
        return JSON.toJSONString(list, SerializerFeature.WriteMapNullValue);
    }
}
