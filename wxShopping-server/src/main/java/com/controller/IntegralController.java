package com.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.entity.Integral;
import com.entity.Join;
import com.entity.User;
import com.service.IIntegralService;
import com.service.UserService;
import com.utils.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/integral")
public class IntegralController {

    @Autowired
    IIntegralService integralService;

    @Autowired
    UserService userService;

    @PostMapping(value = "/insertJoin")
    public String insertJoin(@RequestBody Integral integral) {
        //插入之前先判断是否已经签到
        String nowDate = DateUtil.getNowDate();
        List<Integral> integrals = integralService.getBaseMapper().selectList(new QueryWrapper<Integral>()
                .eq("integral_user_id", integral.getIntegral_user_id())
                .eq("integral_date", nowDate));
        if(integrals.size() > 0) {
            return "您今天已经签到，请明天再来！";
        }
        integral.setIntegral_date(nowDate);
        int insert = integralService.getBaseMapper().insert(integral);

        //用户积分加1
        User user = userService.getBaseMapper().selectById(integral.getIntegral_user_id());
        float before = Float.parseFloat(user.getUser_integral());
        user.setUser_integral((before + 2) + "");
        userService.getBaseMapper().updateById(user);

        return insert + "";
    }

    /**
     * 获取个人申请记录
     * @param id
     * @return
     */
    @GetMapping(value = "/getAllIntegralByUserId")
    public String getAllIntegralByUserId(@RequestParam("id") String id) {
        List<Integral> join_userid = integralService.getBaseMapper().selectList(new QueryWrapper<Integral>().eq("join_userid", id));
        //返回一个空对象给前端
        if(join_userid.size() == 0) return JSON.toJSONString(new Join(), SerializerFeature.WriteMapNullValue);;
        return JSON.toJSONString(join_userid.get(0), SerializerFeature.WriteMapNullValue);
    }

    @GetMapping(value = "/updateUserIntegral")
    public String updateUserIntegral(@RequestParam("id") String id,
            @RequestParam("price") String price) {
        User user = userService.getBaseMapper().selectById(id);
        float before = Float.parseFloat(user.getUser_integral());
        float later = before - Float.parseFloat(price);
        user.setUser_integral(later + "");
        int i = userService.getBaseMapper().updateById(user);
        return later + "";
    }

}
