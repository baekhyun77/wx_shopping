package com.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.entity.Msg;
import com.mapper.MsgMapper;
import com.service.IMsgService;
import org.springframework.stereotype.Service;

@Service
public class MsgServiceImpl extends ServiceImpl<MsgMapper, Msg> implements IMsgService {
}
