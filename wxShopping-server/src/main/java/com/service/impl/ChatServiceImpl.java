package com.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.entity.Chat;
import com.mapper.ChatMapper;
import com.service.IChatService;
import org.springframework.stereotype.Service;

@Service
public class ChatServiceImpl extends ServiceImpl<ChatMapper, Chat> implements IChatService {
}
