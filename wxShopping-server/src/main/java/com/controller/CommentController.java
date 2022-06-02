package com.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.conditions.query.QueryChainWrapper;
import com.entity.Comment;
import com.service.ICommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/comment")
public class CommentController {

    @Autowired
    private ICommentService commentService;

    @RequestMapping(value = "/addComment")
    public String addComment(@RequestBody Comment comment) {
        int insert = commentService.getBaseMapper().insert(comment);
        return insert + "";
    }

    /**
     * 通过商品获取评论
     * @param comment_commodityid
     * @return
     */
    @GetMapping(value = "/queryComment")
    public String queryComment(@RequestParam("comment_commodityid") String comment_commodityid) {
        List<Comment> comments = commentService.getBaseMapper().selectList(new QueryWrapper<Comment>().eq("comment_commodityid", comment_commodityid));
        return JSON.toJSONString(comments, SerializerFeature.WriteMapNullValue);
    }

    /**
     * 通过订单获取评论
     * @param comment_orderid
     * @return
     */
    @GetMapping(value = "/queryCommentByOrder")
    public String queryCommentByOrder(@RequestParam("comment_orderid") String comment_orderid) {
        List<Comment> comments = commentService.getBaseMapper().selectList(new QueryWrapper<Comment>().eq("comment_orderid", comment_orderid));
        return JSON.toJSONString(comments, SerializerFeature.WriteMapNullValue);
    }

}
