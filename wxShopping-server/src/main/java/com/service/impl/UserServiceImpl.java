package com.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.entity.User;
import com.mapper.UserMapper;
import com.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
/**
 * service实现mybatis-plus 需要继承一个ServiceImpl去实现
 */
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

}
