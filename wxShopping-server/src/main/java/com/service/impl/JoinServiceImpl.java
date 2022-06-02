package com.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.entity.Join;
import com.mapper.JoinMapper;
import com.service.IJoinService;
import org.springframework.stereotype.Service;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;

@Service
public class JoinServiceImpl extends ServiceImpl<JoinMapper, Join> implements IJoinService  {
}
