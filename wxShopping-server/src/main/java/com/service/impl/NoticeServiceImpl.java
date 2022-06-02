package com.service.impl;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.entity.Notice;
import com.mapper.NoticeMapper;
import com.service.INoticeService;
import org.springframework.stereotype.Service;

@Service
public class NoticeServiceImpl extends ServiceImpl<NoticeMapper,Notice> implements INoticeService {
}
